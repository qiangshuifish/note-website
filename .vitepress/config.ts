import { defineConfig } from 'vitepress';
import { courseCategories, sidebar, navItems } from './sidebar';
import { vPreForMustache } from './vpre-plugin';

function buildNavItems() {
  const result: Record<string, { text: string; link: string }[]> = {};

  for (const category of courseCategories) {
    const courses = navItems.filter(item => item.category === category.key);
    if (courses.length > 0) {
      result[category.label] = courses.map(c => ({ text: c.text, link: c.link }));
    }
  }

  // 未分组的课程归入「其他」
  const remaining = navItems.filter(c => !c.category || c.category === 'other');
  if (remaining.length > 0) {
    result['其他'] = remaining.map(c => ({ text: c.text, link: c.link }));
  }

  return Object.entries(result).map(([text, items]) => ({ text, items }));
}

const fullTextSearchConfig = process.env.ENABLE_FULL_TEXT_SEARCH === '1'
  ? {
      provider: 'local' as const,
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
        },
      },
    }
  : undefined;

export default defineConfig({
  title: '技术学习笔记',
  description: '183门技术课程学习笔记',
  base: '/note-website/',
  srcDir: '.',
  outDir: './dist',
  cleanUrls: true,
  metaChunk: true,

  vite: {
    plugins: [
      {
        name: 'vitepress:escape-tags',
        enforce: 'pre',
        transform(code, id) {
          // 只处理 .md 文件，在 VitePress 转换之前
          if (!id.endsWith('.md')) return null;
          
          // 排除首页和特殊组件页，它们有自定义 Vue 组件
          if (id.includes('index.md')) return null;
          
          const lines = code.split('\n');
          const output = [];
          let inFrontmatter = false;
          
          for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
            let line = lines[lineIdx];
            
            // 处理 frontmatter
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
            
            // 跳过 Vue 组件调用行（如 <CourseCards />）
            if (line.trim().match(/^<\/?[A-Z][\w]*[^>]*\/?>\s*$/)) {
              output.push(line);
              continue;
            }
            
            // 用零宽空格打断所有的 < 和 </ 模式
            // 注意：这里我们故意不排除 HTML 标签，因为在 Markdown 中它们会被正确的 HTML 解析
            // 我们只排除 Vue 组件（上面已经处理了）
            let escaped = line;
            
            // 打断所有开始标签 <letter
            escaped = escaped.replace(/<([a-zA-Z])/g, '<\u200B$1');
            
            // 打断所有结束标签 </letter
            escaped = escaped.replace(/<\/([a-zA-Z])/g, '<\u200B/$1');
            
            // 也处理 {{ }} 和 }}
            escaped = escaped.replace(/\{\{/g, '{\u200B{').replace(/\}\}/g, '}\u200B}');
            
            output.push(escaped);
          }
          
          return {
            code: output.join('\n'),
            map: null
          };
        }
      }
    ],
  },

  // 忽略死链接检查（课程笔记中包含大量示例 URL）
  ignoreDeadLinks: true,

  markdown: {
    headers: {
      level: [2, 3],
    },
    links: {
      ignoreDeadLinks: true,
    },
    config: (md) => {
      md.use(vPreForMustache());
    },
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Serif+SC:wght@400;600;700&display=swap' }],
  ],

  themeConfig: {
    siteTitle: '技术学习笔记',
    logo: '',

    nav: [
      { text: '首页', link: '/' },
      {
        text: '课程',
        items: buildNavItems().map(g => ({ text: g.text, items: g.items })),
      },
    ],

    sidebar,

    ...(fullTextSearchConfig ? { search: fullTextSearchConfig } : {}),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/qiangshuifish/note-website' },
    ],

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    outline: {
      label: '页面导航',
      level: [2, 3],
    },

    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
  },
});
