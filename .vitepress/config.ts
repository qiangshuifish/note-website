import { defineConfig } from 'vitepress';
import { sidebar, navItems } from './sidebar';
import { escapeAngleBrackets } from './escape-plugin';
import { vPreForMustache } from './vpre-plugin';

export default defineConfig({
  title: '技术学习笔记',
  description: '48门技术课程学习笔记',
  base: '/note-website/',
  srcDir: '.',
  outDir: './dist',
  cleanUrls: true,

  vite: {
    plugins: [escapeAngleBrackets()],
  },

  // 忽略死链接检查（课程笔记中包含大量示例 URL）
  ignoreDeadLinks: true,

  markdown: {
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
        items: navItems.map(item => ({
          text: item.text,
          link: item.link,
        })),
      },
    ],

    sidebar,

    search: {
      provider: 'local',
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
    },

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
