#!/usr/bin/env python3
"""
VitePress .md 文件预处理脚本
转义所有会导致 Vue 编译器报错的字符，并记录替换详情以便后续追溯和还原。

替换规则：
1. 代码块内：转义 < > @ 为 &lt; &gt; &#64;
2. 非代码块：
   a. 转义 < 为 &lt;
   b. 转义 {{ }} 为 {<zwsp>{ }<zwsp>}
   c. 转义 {a, b} 模式（含逗号的 brace 包裹内容会被 Vue 当作 JS 对象）
      → &#123;a, b&#125;

输出：
- 直接修改 .md 文件
- 生成 replacement-log.json 记录所有替换位置和内容
"""

import json
import os
import re
from pathlib import Path

# 零宽空格
ZWSP = '​'

def escape_code_block_line(line: str) -> str:
    line = line.replace('<', '&lt;')
    line = line.replace('>', '&gt;')
    line = line.replace('@', '&#64;')
    return line

def escape_text_line(line: str) -> str:
    # 转义 < 为 &lt;
    line = line.replace('<', '&lt;')
    # 转义 {{ }} 用零宽空格打断
    line = line.replace('{{', '{' + ZWSP + '{')
    line = line.replace('}}', '}' + ZWSP + '}')
    # 转义 { ... , ... } 模式（包含逗号/分号的 brace 内容会被 Vue 当作 JS 对象属性）
    # 支持中文逗号、分号、空格等分隔符
    line = re.sub(r'\{([^{}]*[,，;；][^{}]*)\}', r'&#123;\1&#125;', line)
    return line

def process_file(filepath: str) -> list[dict]:
    """处理单个文件，返回替换记录"""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    output = []
    replacements = []
    in_code_block = False
    in_frontmatter = False

    for line_idx, line in enumerate(lines):
        line_num = line_idx + 1
        original_line = line.rstrip('\n')

        # frontmatter
        if line_idx == 0 and line.strip() == '---':
            in_frontmatter = True
            output.append(line)
            continue
        if in_frontmatter and line.strip() == '---':
            in_frontmatter = False
            output.append(line)
            continue
        if in_frontmatter:
            output.append(line)
            continue

        # code block boundary
        if line.lstrip().startswith('```'):
            in_code_block = not in_code_block
            output.append(line)
            continue

        if in_code_block:
            new_line = escape_code_block_line(original_line)
            if new_line != original_line:
                replacements.append({
                    'line': line_num,
                    'type': 'code_block',
                    'original': original_line,
                    'replaced': new_line,
                })
            output.append(new_line + ('\n' if line.endswith('\n') else ''))
        else:
            new_line = escape_text_line(original_line)
            if new_line != original_line:
                replacements.append({
                    'line': line_num,
                    'type': 'text',
                    'original': original_line,
                    'replaced': new_line,
                })
            output.append(new_line + ('\n' if line.endswith('\n') else ''))

    new_content = ''.join(output)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return replacements

def collect_md_files(root: str) -> list[str]:
    ignore = {'node_modules', 'dist', '.vitepress', '.git'}
    files = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in ignore]
        for fn in filenames:
            if fn.endswith('.md'):
                files.append(os.path.join(dirpath, fn))
    return sorted(files)

def main():
    root = os.getcwd()
    files = collect_md_files(root)
    print(f"找到 {len(files)} 个 .md 文件")

    all_replacements = {}
    modified_count = 0

    for filepath in files:
        rel_path = os.path.relpath(filepath, root)
        replacements = process_file(filepath)
        if replacements:
            all_replacements[rel_path] = replacements
            modified_count += 1

    # 写入日志
    log_path = os.path.join(root, '.vitepress', 'replacement-log.json')
    os.makedirs(os.path.dirname(log_path), exist_ok=True)
    with open(log_path, 'w', encoding='utf-8') as f:
        json.dump(all_replacements, f, ensure_ascii=False, indent=2)

    print(f"修改了 {modified_count} 个文件")
    print(f"替换记录已写入 {log_path}")

    # 统计
    total_replacements = sum(len(v) for v in all_replacements.values())
    print(f"共 {total_replacements} 处替换")

if __name__ == '__main__':
    main()
