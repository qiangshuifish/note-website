// Vite 插件：在 Markdown 文件内容用 <div v-pre> 包裹
// 避免 Vue 编译器将 Go 泛型、HTML 示例代码等当作 HTML/Vue 标签解析而报错

export function escapeAngleBrackets() {
  return {
    name: 'vitepress:escape-md-content',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('.md')) return null;
      
      // 在文件开头添加 <div v-pre>
      // 在文件结尾添加 </div>
      // 但要保留 frontmatter
      
      const lines = code.split('\n');
      let hasFrontmatter = false;
      let frontmatterEnd = 0;
      
      // 查找 frontmatter 结束位置
      if (lines[0]?.trim() === '---') {
        for (let i = 1; i < Math.min(lines.length, 50); i++) {
          if (lines[i]?.trim() === '---') {
            hasFrontmatter = true;
            frontmatterEnd = i;
            break;
          }
        }
      }
      
      // 在 frontmatter 后或文件开头添加 v-pre，结尾添加 </div>
      if (hasFrontmatter) {
        lines.splice(frontmatterEnd + 1, 0, '<div v-pre>');
        lines.push('</div>');
      } else {
        lines.unshift('<div v-pre>');
        lines.push('</div>');
      }
      
      return {
        code: lines.join('\n'),
        map: null
      };
    },
  };
}
