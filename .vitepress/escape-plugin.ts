// Vite 插件：处理 .md 文件中的 HTML-like 标签和 Vue 模板语法
// 在 Vue SFC 编译器处理之前：
// 1. 将 <word> 转义为 &lt;word&gt;
// 2. 将 {{expr}} 转义为 &#123;&#123;expr&#125;&#125;
// 避免 Vue 编译器将其当作 HTML/Vue 标签或模板表达式解析而报错

export function escapeAngleBrackets() {
  return {
    name: 'vitepress:escape-angle-brackets',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('.md')) return null;

      let result = code;
      const lines = code.split('\n');
      const output = [];
      let inCodeBlock = false;
      let inFrontmatter = false;

      for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx];

        // 处理 frontmatter 边界 (---)
        if (lineIdx === 0 && line.trim() === '---') {
          inFrontmatter = true;
          output.push(line);
          continue;
        }
        if (inFrontmatter && line.trim() === '---') {
          inFrontmatter = false;
          output.push(line);
          continue;
        }
        if (inFrontmatter) {
          output.push(line);
          continue;
        }

        // 处理代码块边界
        if (line.trimStart().startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          output.push(line);
          continue;
        }
        if (inCodeBlock) {
          output.push(line);
          continue;
        }

        // 跳过自定义组件行（如 <CourseCards />）
        if (line.trim().match(/^<\/?[A-Z][\w]*[^>]*\/?>\s*$/)) {
          output.push(line);
          continue;
        }

        let newLine = escapeLine(line);
        output.push(newLine);
      }

      const newCode = output.join('\n');
      if (newCode !== result) {
        return { code: newCode, map: null };
      }
      return null;
    },
  };
}

// 转义一行中的 <word> 和 {{expr}} 模式
function escapeLine(line: string): string {
  let result = '';
  let i = 0;
  while (i < line.length) {
    const ch = line[i];

    // 处理行内反引号 - 也要转义其中的 <word> 和 {{ }}
    if (ch === '`') {
      let end = line.indexOf('`', i + 1);
      if (end === -1) end = line.length;
      let backtickContent = line.slice(i + 1, end);
      backtickContent = backtickContent.replace(/\{\{/g, '{\u200B{').replace(/\}\}/g, '}\u200B}');
      backtickContent = backtickContent.replace(/<([a-zA-Z][\w-]*)(?![^>]*=")/g, '&lt;$1');
      result += '`' + backtickContent + '`';
      i = end + 1;
      continue;
    }

    // 处理 {{...}} - 用零宽空格打断 Vue 模板表达式模式
    // Vue 编译器看到 {<zwsp>{ 就不会当作模板表达式
    if (ch === '{' && line[i + 1] === '{') {
      result += '{\u200B{';
      i += 2;
      continue;
    }
    if (ch === '}' && line[i + 1] === '}') {
      result += '}\u200B}';
      i += 2;
      continue;
    }
    if (ch === '}' && line[i + 1] === '}') {
      result += '&#125;&#125;';
      i += 2;
      continue;
    }

    // 处理 <word> - 转义为 &lt;word&gt;
    if (ch === '<') {
      const rest = line.slice(i);
      const match = rest.match(/^<\/?([A-Za-z][\w-]*)([\s\S]*?)(\/?>)/);
      if (match) {
        const tagName = match[1].toLowerCase();
        const knownHtmlTags = ['br', 'hr', 'p', 'div', 'span', 'a', 'img', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'pre', 'code', 'strong', 'em', 'b', 'i', 'u', 'blockquote', 'details', 'summary', 'input', 'select', 'option', 'form', 'button', 'video', 'audio', 'source', 'iframe', 'script', 'style'];
        if (knownHtmlTags.includes(tagName) || match[0].endsWith('/>') || match[0].includes('="')) {
          // 保留已知 HTML 标签
          result += ch;
          i++;
        } else {
          // 转义未知标签
          result += '&lt;';
          i++;
        }
      } else {
        // 不匹配标签模式，转义
        result += '&lt;';
        i++;
      }
      continue;
    }

    result += ch;
    i++;
  }
  return result;
}
