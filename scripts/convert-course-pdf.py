#!/usr/bin/env python3
"""
极客时间课程 PDF 转 Markdown 工具

将课程目录下的 PDF（每讲一个，文件名形如「01｜标题.pdf」「开篇词｜标题.pdf」）
转换为本仓库笔记格式的 Markdown，并提取插图到输出目录的 images/<讲次>/ 下。
正文跨页段落自动合并，代码块自动识别语言，留言区内容按仓库惯例不纳入。

依赖安装（一次性）:
    /usr/bin/python3 -m pip install --user pymupdf

使用示例:
    # 转换整个课程目录，默认输出到仓库根目录下的同名课程目录
    python3 scripts/convert-course-pdf.py -i ~/Downloads/深入拆解消息队列47讲

    # 指定输出目录
    python3 scripts/convert-course-pdf.py -i ~/Downloads/课程目录 -o ./课程目录

    # 补齐缺失讲次时只转换尚未生成的文件
    python3 scripts/convert-course-pdf.py -i ~/Downloads/课程目录 --skip-existing

    # 只转换单个 PDF（输入也可以是单个文件）
    python3 scripts/convert-course-pdf.py -i ~/Downloads/课程目录/24｜标题.pdf

    # 模拟运行，查看将生成哪些文件
    python3 scripts/convert-course-pdf.py -i ~/Downloads/课程目录 --dry-run -v

转换完成后的配套步骤:
    1. node_modules/.bin/tsx scripts/generate-sidebar.mts   重新生成侧边栏
    2. 按上一步输出的课程总数更新 index.md 与 .vitepress/config.ts 中的课程数
    3. node_modules/.bin/vitepress dev --port 5173          本地预览

已知限制（源 PDF 固有，无法在转换侧恢复）:
    - 超长代码行在源 PDF 中已被截断
    - 行内加粗等富文本样式无法从 PDF 提取
    - 约 1KB 的空 PDF 会自动跳过，并在任务总结中列出
"""

import argparse
import json
import os
import re
import sys
import tempfile
import unicodedata
from datetime import datetime
from pathlib import Path


class Colors:
    RESET = "\x1b[0m"
    RED = "\x1b[31m"
    GREEN = "\x1b[32m"
    YELLOW = "\x1b[33m"
    BLUE = "\x1b[34m"
    CYAN = "\x1b[36m"
    GRAY = "\x1b[90m"
    BOLD = "\x1b[1m"


class Logger:
    @staticmethod
    def info(msg):
        print(f"{Colors.GRAY}[INFO]   {Colors.RESET}{Colors.BLUE}ℹ {msg}{Colors.RESET}")

    @staticmethod
    def success(msg):
        print(f"{Colors.GRAY}[SUCCESS]{Colors.RESET}{Colors.GREEN}✔ {msg}{Colors.RESET}")

    @staticmethod
    def warn(msg):
        print(f"{Colors.GRAY}[WARNING]{Colors.RESET}{Colors.YELLOW}⚠ {msg}{Colors.RESET}")

    @staticmethod
    def error(msg):
        print(f"{Colors.GRAY}[ERROR]  {Colors.RESET}{Colors.RED}✖ {msg}{Colors.RESET}")

    @staticmethod
    def debug(msg):
        print(f"{Colors.GRAY}[DEBUG]  🐛 {msg}{Colors.RESET}")

    @staticmethod
    def header(msg):
        print(f"\n{Colors.BOLD}{Colors.CYAN}--- {msg} ---{Colors.RESET}")


try:
    import fitz
except ImportError:
    try:
        import pymupdf as fitz
    except ImportError:
        Logger.error("缺少 PyMuPDF 依赖")
        print("运行: /usr/bin/python3 -m pip install --user pymupdf")
        sys.exit(1)


REPO_ROOT = Path(__file__).resolve().parent.parent
FENCE = "`" * 3
TERMINAL = "。？！；：…”’）】?!;:"

SECRET_PATTERNS = [
    (re.compile(r'sk-ant-[A-Za-z0-9_-]{20,}'), 'sk-ant-xxxx'),
    (re.compile(r'sk-[A-Za-z0-9_-]{20,}'), 'sk-xxxx'),
    (re.compile(r'(?:sk|rk)_(?:test|live)_[A-Za-z0-9]{10,}'), 'sk_test_xxxx'),
    (re.compile(r'ghp_[A-Za-z0-9]{30,}'), 'ghp_xxxx'),
    (re.compile(r'AKIA[0-9A-Z]{16}'), 'AKIAxxxx'),
    (re.compile(r'xox[baprs]-[A-Za-z0-9-]{10,}'), 'xox-xxxx'),
]


def redact_secrets(text):
    """脱敏代码示例中可能出现的 API 密钥等凭据，避免触发 GitHub 推送保护。"""
    for pattern, placeholder in SECRET_PATTERNS:
        text = pattern.sub(placeholder, text)
    text = re.sub(r'(?i)((?:openweather\w*|appid)\s*[=:]\s*["\']?)[a-f0-9]{32}', r'\1xxxx', text)
    return text


def fix_text(text):
    """去除私用区字符和控制字符，规范化 CJK 部首区字符和不停顿空格。"""
    out = []
    for ch in text:
        code = ord(ch)
        if code < 32 and ch not in '\t\n\r':
            continue
        if code == 0x7F:
            continue
        if 0xE000 <= code <= 0xF8FF:
            continue
        if 0x2E80 <= code <= 0x2FFF:
            ch = unicodedata.normalize('NFKC', ch)
        if ch == '\xa0':
            ch = ' '
        out.append(ch)
    return ''.join(out)


def is_pua_only(text):
    return text.strip() != '' and all(0xE000 <= ord(c) <= 0xF8FF or c.isspace() for c in text)


def guess_lang(code):
    if re.search(r'\b(public|private|protected)\s+(class|interface|enum|static|void|final)\b|import\s+java\.|System\.out', code):
        return 'java'
    if re.search(r'^\s*(message|service)\s+\w+\s*\{|\brpc\s+\w+\s*\(|syntax\s*=\s*"proto3"', code, re.M):
        return 'protobuf'
    if re.search(r'^\s*func\s+\w+|package\s+main|:=', code, re.M):
        return 'go'
    if re.search(r'\b(SELECT|INSERT|UPDATE|DELETE|CREATE TABLE|ALTER TABLE)\b', code, re.I):
        return 'sql'
    if re.search(r'^\s*(curl|wget|docker|kubectl|tar|grep|awk|sed|chmod|mkdir|cd|ls|cat|echo|export|sudo|yum|apt|bin/|sh )', code, re.M):
        return 'bash'
    if re.search(r'^\s*[\{\[]', code) and re.search(r'"\w+"\s*:', code):
        return 'json'
    if re.search(r'^\s*(server|spring|rocketmq|kafka|broker)\s*:', code, re.M | re.I) and re.search(r'^\s+\w[\w-]*\s*:', code, re.M):
        return 'yaml'
    if re.search(r'^\s*<\w+[^>]*>', code, re.M):
        return 'xml'
    if re.search(r'^\s*(def |class |import |from \w+ import )', code, re.M):
        return 'python'
    if re.search(r'\b(const|let|var|function|=>)\b', code):
        return 'javascript'
    return ''


def lecture_num(stem):
    """从文件名提取讲次目录名，如「01｜标题」→01，「2024：标题」→2024，「开篇词｜标题」→开篇词。"""
    return re.split(r'[｜：:]', stem, maxsplit=1)[0]


def safe_image_dir(name):
    """替换会截断 Markdown 图片链接的 ASCII 括号和空格。"""
    return re.sub(r'[()\s]+', '-', name)


def image_subdirs(pdf_paths):
    """为每个 PDF 计算图片子目录名。同编号讲次（如多场直播回放）改用完整文件名，避免图片互相覆盖。"""
    stems = [os.path.splitext(os.path.basename(p))[0] for p in pdf_paths]
    nums = [lecture_num(s) for s in stems]
    counts = {}
    for n in nums:
        counts[n] = counts.get(n, 0) + 1
    result = {}
    for p, stem, num in zip(pdf_paths, stems, nums):
        if counts[num] > 1:
            result[p] = safe_image_dir(re.sub(r'｜+', '-', stem))
        else:
            result[p] = safe_image_dir(num)
    return result


def collect(pdf_path, course_name):
    """按页提取正文、标题、代码、列表和图片元素，遇到留言区即截断。"""
    doc = fitz.open(pdf_path)
    elements = []
    course_name_nospace = re.sub(r'\s+', '', course_name)
    for pno in range(len(doc)):
        page = doc[pno]
        page_items = []
        first_body_y = None
        for block in page.get_text('dict')['blocks']:
            if block['type'] != 0:
                continue
            for line in block['lines']:
                spans = line['spans']
                raw = ''.join(s['text'] for s in spans)
                if is_pua_only(raw):
                    continue
                text = fix_text(raw).strip()
                if not text:
                    continue
                text_nospace = re.sub(r'\s+', '', text)
                if text_nospace == '打开APP' or '复制代码' in text_nospace:
                    continue
                size = round(spans[0]['size'], 1)
                x0 = line['bbox'][0]
                y0 = line['bbox'][1]
                fonts = {s['font'] for s in spans}
                if size >= 16:
                    continue
                if course_name_nospace in text_nospace and '·' in text:
                    continue
                if text.startswith('©'):
                    continue
                if re.match(r'^(全部留言|精选留言)', text_nospace) or text_nospace.startswith('由作者筛选后的优质留言'):
                    page_items.append({'kind': 'cut', 'y': y0, 'text': text, 'page': pno})
                    continue
                if any('SourceCodePro' in f for f in fonts):
                    if re.fullmatch(r'\d+', text) and x0 < 70:
                        continue
                    page_items.append({'kind': 'code', 'y': y0, 'x': x0, 'text': fix_text(raw).rstrip(), 'page': pno})
                    continue
                if size >= 14.5:
                    page_items.append({'kind': 'h2', 'y': y0, 'text': text, 'page': pno})
                    continue
                if size >= 13.5:
                    page_items.append({'kind': 'h3', 'y': y0, 'text': text, 'page': pno})
                    continue
                if re.fullmatch(r'\d+\.', text) and x0 < 58:
                    page_items.append({'kind': 'num_marker', 'y': y0, 'text': text, 'page': pno})
                    continue
                kind = 'list' if x0 >= 55 else 'body'
                if kind == 'body' and first_body_y is None:
                    first_body_y = y0
                page_items.append({'kind': kind, 'y': y0, 'x': x0, 'text': text, 'page': pno})
        bullet_ys = []
        for dr in page.get_drawings():
            r = dr['rect']
            if 40 <= r.x0 <= 56 and r.width < 8 and r.height < 8 and dr.get('fill') is not None:
                bullet_ys.append(r.y0)
        for item in page_items:
            if item['kind'] == 'list':
                if any(abs(item['y'] - by) < 10 for by in bullet_ys):
                    item['marker'] = 'bullet'
        for item in page_items:
            if item['kind'] == 'num_marker':
                best = None
                for cand in page_items:
                    if cand['kind'] == 'list' and abs(cand['y'] - item['y']) < 12:
                        if best is None or cand['y'] < best['y']:
                            best = cand
                if best is not None:
                    best['marker'] = item['text']
        page_items = [it for it in page_items if it['kind'] != 'num_marker']
        for xref_info in page.get_images(full=True):
            xref = xref_info[0]
            try:
                rects = page.get_image_rects(xref)
            except Exception:
                rects = []
            for rect in rects:
                if rect.width < 8 or rect.height < 8:
                    continue
                if rect.x0 < 30 and rect.y0 < 30 and rect.width > 500:
                    continue
                if pno == 0 and first_body_y is not None and rect.y1 <= first_body_y:
                    continue
                page_items.append({'kind': 'image', 'y': rect.y0, 'xref': xref, 'page': pno})
        page_items.sort(key=lambda it: it['y'])
        cut_idx = next((i for i, it in enumerate(page_items) if it['kind'] == 'cut'), None)
        if cut_idx is not None:
            page_items = page_items[:cut_idx]
            elements.extend(page_items)
            break
        elements.extend(page_items)
    return doc, elements


def same_paragraph(prev, cur):
    if prev['kind'] != cur['kind']:
        return False
    if prev['kind'] not in ('body', 'list'):
        return False
    if prev['page'] == cur['page']:
        return cur['y'] - prev['y'] < 28
    if prev['y'] > 700 and cur['y'] < 60:
        if prev['kind'] == 'list':
            return False
        return bool(prev['text']) and prev['text'][-1] not in TERMINAL
    return False


def convert(pdf_path, out_dir, course_name, dry_run=False, img_subdir=None):
    doc, elements = collect(pdf_path, course_name)
    stem = os.path.splitext(os.path.basename(pdf_path))[0]
    num = safe_image_dir(img_subdir or lecture_num(stem))
    img_dir = os.path.join(out_dir, 'images', num)
    heading = '# ' + stem.replace('｜', ' | ')
    parts = [heading]
    para = None
    code_lines = None
    img_count = 0
    seen_xrefs = set()
    last_code_page = -1
    last_code_y = 0

    def flush_para():
        nonlocal para
        if para is not None:
            text = re.sub(r' {2,}', ' ', para['text']).strip()
            if para['kind'] == 'list':
                marker = para.get('marker')
                if marker and marker != 'bullet':
                    parts.append(marker + ' ' + text)
                else:
                    parts.append('- ' + text)
            else:
                parts.append(text)
            para = None

    def flush_code():
        nonlocal code_lines
        if code_lines is not None:
            code = '\n'.join(code_lines).strip('\n')
            lang = guess_lang(code)
            parts.append(FENCE + lang + '\n' + code + '\n' + FENCE)
            code_lines = None

    for el in elements:
        kind = el['kind']
        if kind == 'code':
            flush_para()
            if code_lines is None:
                code_lines = []
            elif el['page'] != last_code_page and not (last_code_y > 700 and el['y'] < 60):
                flush_code()
                code_lines = []
            code_lines.append(el['text'])
            last_code_page = el['page']
            last_code_y = el['y']
            continue
        flush_code()
        if kind in ('body', 'list'):
            if para is not None and same_paragraph(para, el):
                para['text'] += el['text']
                para['y'] = el['y']
                para['page'] = el['page']
            else:
                flush_para()
                para = {'kind': kind, 'text': el['text'], 'y': el['y'], 'page': el['page'], 'marker': el.get('marker')}
            continue
        flush_para()
        if kind in ('h2', 'h3'):
            parts.append(('## ' if kind == 'h2' else '### ') + el['text'])
        elif kind == 'image':
            xref = el['xref']
            if xref in seen_xrefs:
                continue
            seen_xrefs.add(xref)
            info = doc.extract_image(xref)
            if not info or not info.get('image'):
                continue
            img_count += 1
            fname = str(img_count) + '.' + info['ext']
            if not dry_run:
                os.makedirs(img_dir, exist_ok=True)
                with open(os.path.join(img_dir, fname), 'wb') as fh:
                    fh.write(info['image'])
            parts.append('![](images/' + num + '/' + fname + ')')
    flush_para()
    flush_code()
    md = redact_secrets('\n\n'.join(parts) + '\n')
    out_path = os.path.join(out_dir, stem + '.md')
    if not dry_run:
        with open(out_path, 'w', encoding='utf-8') as fh:
            fh.write(md)
    doc.close()
    return out_path, len(parts) - 1, img_count


def main():
    parser = argparse.ArgumentParser(
        description='极客时间课程 PDF 转 Markdown（提取正文、代码、插图，生成仓库笔记格式）',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  python3 scripts/convert-course-pdf.py -i ~/Downloads/深入拆解消息队列47讲
  python3 scripts/convert-course-pdf.py -i ~/Downloads/课程目录 -o ./课程目录 --skip-existing
  python3 scripts/convert-course-pdf.py -i ~/Downloads/课程目录/24｜标题.pdf
  python3 scripts/convert-course-pdf.py -i ~/Downloads/课程目录 --dry-run -v

转换完成后:
  node_modules/.bin/tsx scripts/generate-sidebar.mts
  按输出的课程总数更新 index.md 与 .vitepress/config.ts
        """
    )
    parser.add_argument('-i', '--input', required=True, help='课程 PDF 目录，或单个 PDF 文件')
    parser.add_argument('-o', '--output', default=None, help='输出课程目录（默认: 仓库根目录/输入目录名）')
    parser.add_argument('--course-name', default=None, help='课程名，用于过滤页眉（默认: 输入课程目录名）')
    parser.add_argument('--skip-existing', action='store_true', help='跳过已生成 Markdown 的讲次，用于补齐缺失讲次')
    parser.add_argument('--dry-run', action='store_true', help='模拟运行，不实际写入文件')
    parser.add_argument('-v', '--verbose', action='store_true', help='详细日志输出')
    args = parser.parse_args()

    input_path = Path(args.input).expanduser().resolve()
    if not input_path.exists():
        Logger.error(f'输入路径不存在: {input_path}')
        sys.exit(1)

    if input_path.is_file():
        pdf_files = [input_path]
        default_out = REPO_ROOT / input_path.parent.name
    else:
        pdf_files = sorted(p for p in input_path.iterdir() if p.suffix.lower() == '.pdf' and not p.name.startswith('._'))
        default_out = REPO_ROOT / input_path.name
    if not pdf_files:
        Logger.error(f'输入目录中没有 PDF 文件: {input_path}')
        sys.exit(1)

    siblings = pdf_files if input_path.is_dir() else sorted(p for p in input_path.parent.iterdir() if p.suffix.lower() == '.pdf' and not p.name.startswith('._'))
    subdirs = image_subdirs([str(p) for p in siblings])

    out_dir = Path(args.output).expanduser().resolve() if args.output else default_out
    course_name = args.course_name or (input_path.name if input_path.is_dir() else input_path.parent.name)

    Logger.header('任务启动')
    print(f'  {Colors.GRAY}输入:{Colors.RESET} {input_path}')
    print(f'  {Colors.GRAY}输出:{Colors.RESET} {out_dir}')
    print(f'  {Colors.GRAY}课程名:{Colors.RESET} {course_name}')
    print(f'  {Colors.GRAY}PDF 数量:{Colors.RESET} {len(pdf_files)}')
    if args.dry_run:
        print(f'  {Colors.YELLOW}模拟运行: 是{Colors.RESET}')
    if args.skip_existing:
        print(f'  {Colors.GRAY}跳过已存在:{Colors.RESET} 是')

    if not args.dry_run:
        out_dir.mkdir(parents=True, exist_ok=True)

    converted = 0
    total_images = 0
    skipped_empty = []
    skipped_corrupt = []
    skipped_existing = 0
    failed_operations = []

    Logger.header('开始转换')
    for pdf_path in pdf_files:
        name = pdf_path.name
        try:
            with fitz.open(pdf_path) as doc:
                page_count = len(doc)
                if page_count == 0:
                    skipped_corrupt.append(name)
                    Logger.warn(f'损坏 PDF（无页面），已跳过 | {name}')
                    continue
                is_empty = page_count == 1 and not doc[0].get_text().strip()
            if is_empty:
                skipped_empty.append(name)
                Logger.warn(f'空 PDF，已跳过 | {name}')
                continue
            stem = pdf_path.stem
            if args.skip_existing and (out_dir / (stem + '.md')).exists():
                skipped_existing += 1
                Logger.info(f'已存在，跳过 | {name}')
                continue
            if args.verbose:
                Logger.debug(f'{page_count} 页 | {name}')
            out_path, blocks, imgs = convert(str(pdf_path), str(out_dir), course_name, dry_run=args.dry_run, img_subdir=subdirs.get(str(pdf_path)))
            converted += 1
            total_images += imgs
            prefix = '[dry-run] 将生成' if args.dry_run else '已生成'
            Logger.info(f'{prefix} {blocks} 个内容块, {imgs} 张图片 | {os.path.basename(out_path)}')
        except fitz.FileDataError as e:
            skipped_corrupt.append(name)
            Logger.warn(f'损坏 PDF，已跳过 | {name}: {e}')
        except Exception as e:
            failed_operations.append({
                'file': str(pdf_path),
                'operation': '转换',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            })
            Logger.error(f'转换失败 | {name}: {e}')

    Logger.header('任务总结')
    print(f'  {Colors.GRAY}转换成功:{Colors.RESET} {converted} 个文件')
    print(f'  {Colors.GRAY}提取图片:{Colors.RESET} {total_images} 张')
    if skipped_existing:
        print(f'  {Colors.GRAY}跳过已存在:{Colors.RESET} {skipped_existing} 个')
    if skipped_empty:
        print(f'  {Colors.YELLOW}空 PDF 跳过: {len(skipped_empty)} 个{Colors.RESET}')
        for name in skipped_empty:
            print(f'    {Colors.YELLOW}⚠ {name}{Colors.RESET}')
    if skipped_corrupt:
        print(f'  {Colors.YELLOW}损坏 PDF 跳过: {len(skipped_corrupt)} 个{Colors.RESET}')
        for name in skipped_corrupt:
            print(f'    {Colors.YELLOW}⚠ {name}{Colors.RESET}')

    if failed_operations:
        print(f'  {Colors.RED}失败操作明细:{Colors.RESET}')
        print(f'    {Colors.GRAY}失败数量: {len(failed_operations)}{Colors.RESET}')
        for fail in failed_operations:
            print(f'    {Colors.RED}✗ {fail["operation"]} 失败:{Colors.RESET}')
            print(f'      {Colors.GRAY}文件: {fail["file"]}{Colors.RESET}')
            print(f'      {Colors.GRAY}错误: {fail["error"]}{Colors.RESET}')
        report_path = os.path.join(tempfile.gettempdir(), f'convert-course-failed-{int(datetime.now().timestamp())}.json')
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'total_failed': len(failed_operations),
                'failures': failed_operations
            }, f, indent=2, ensure_ascii=False)
        print(f'  {Colors.GRAY}失败报告: {report_path}{Colors.RESET}')
        sys.exit(1)

    if converted == 0 and not skipped_existing:
        Logger.warn('没有转换任何文件')
        sys.exit(1)

    Logger.success('任务完成！')
    if not args.dry_run:
        Logger.info('后续步骤: node_modules/.bin/tsx scripts/generate-sidebar.mts 重新生成侧边栏，并更新 index.md 与 .vitepress/config.ts 中的课程数')


if __name__ == '__main__':
    main()
