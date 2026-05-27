import { defineConfig } from 'vitepress';
import { sidebar, navItems } from './sidebar';
import { escapeAngleBrackets } from './escape-plugin';
import { vPreForMustache } from './vpre-plugin';

// 按知识领域对课程进行分组导航（避免 187 项单一下拉）
const courseNavGroups = [
  { text: 'AI 与智能体', items: /AI|ClaudeCode|LLM|RAG|Agent|智能体|人工智能|机器学习|深度学习|推荐系统|NLP/ },
  { text: '前端开发', items: /前端|React|Vue|JavaScript|浏览器|可视化|Flutter|iOS|Android|WebAssembly|Vim/ },
  { text: '后端开发', items: /Java|Go|Spring|Python|Kafka|RPC|Tomcat|Jetty|后端|OpenResty/ },
  { text: '数据库与存储', items: /MySQL|Redis|etcd|数据库|SQL|Kafka|消息队列/ },
  { text: '基础设施', items: /Kubernetes|容器|Linux|Nginx|Serverless|SRE|运维|DevOps|持续交付|性能工程|容量/ },
  { text: '架构与设计', items: /架构|DDD|微服务|分布式|中台|设计模式|系统|调优|压测|全链路/ },
  { text: '算法与底层', items: /算法|数据结构|内存|编译原理|操作系统|V8|网络协议|趣谈Linux/ },
  { text: '技术管理', items: /管理|产品|敏捷|项目|OKR|领导力|CTO|晋升|复盘|技术管理|技术领导力/ },
];

function buildNavItems() {
  const ungrouped = new Set<string>(courseNavGroups.map(g => g.items.source));
  const result: Record<string, { text: string; link: string }[]> = {};

  for (const group of courseNavGroups) {
    const courses = navItems.filter(item => group.items.test(item.text));
    if (courses.length > 0) {
      result[group.text] = courses.map(c => ({ text: c.text, link: c.link }));
      courses.forEach(c => ungrouped.delete(c.text));
    }
  }

  // 未分组的课程归入「其他」
  const allGrouped = new Set(navItems.filter(item =>
    courseNavGroups.some(g => g.items.test(item.text))
  ).map(c => c.text));
  const remaining = navItems.filter(c => !allGrouped.has(c.text));
  if (remaining.length > 0) {
    result['其他'] = remaining.map(c => ({ text: c.text, link: c.link }));
  }

  return Object.entries(result).map(([text, items]) => ({ text, items }));
}

export default defineConfig({
  title: '技术学习笔记',
  description: '183门技术课程学习笔记',
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
        items: buildNavItems().map(g => ({ text: g.text, items: g.items })),
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
