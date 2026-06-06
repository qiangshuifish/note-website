// 侧边栏自动生成脚本
// 扫描课程目录，生成 .vitepress/sidebar.mts 供 config.mts 导入

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// 需要排除的目录和文件
const EXCLUDE_DIRS = ['node_modules', '.git', '.vitepress', '.claude', 'docs'];
const EXCLUDE_FILES = ['CLAUDE.md', 'package.json', 'index.md'];

const COURSE_CATEGORIES = [
  {
    key: 'ai',
    label: 'AI 与数据智能',
    patterns: [
      /AI|AIGC|LLM|Agent|Claude|RAG|NLP|机器学习|深度学习|推荐系统|人工智能|数据分析|数据科学|PyTorch|TensorFlow/i,
    ],
  },
  {
    key: 'frontend',
    label: '前端与客户端',
    patterns: [
      /前端|JavaScript|TypeScript|React|Vue|Flutter|iOS|Android|WebAssembly|浏览器|可视化|Vim|CSS|HTML/i,
    ],
  },
  {
    key: 'backend',
    label: '后端与中间件',
    patterns: [
      /Java|Go|Python|Spring|RPC|Kafka|RocketMQ|消息队列|Tomcat|Jetty|OpenResty|后端|服务端|网络编程|API|中间件/i,
    ],
  },
  {
    key: 'database',
    label: '数据库与存储',
    patterns: [
      /MySQL|Redis|MongoDB|etcd|数据库|SQL|存储|缓存|索引|事务|分库分表|KV|NoSQL|ElasticSearch/i,
    ],
  },
  {
    key: 'infra',
    label: '云原生与基础设施',
    patterns: [
      /Kubernetes|Docker|容器|Linux|Nginx|Serverless|SRE|DevOps|运维|云计算|网络协议|HTTP|HTTPS|CDN|监控|日志|CI\/?CD/i,
    ],
  },
  {
    key: 'architecture',
    label: '架构与分布式',
    patterns: [
      /架构|分布式|微服务|DDD|中台|设计模式|高并发|高可用|系统设计|性能|调优|压测|全链路|容量|领域驱动/i,
    ],
  },
  {
    key: 'foundation',
    label: '算法与计算机基础',
    patterns: [
      /算法|数据结构|动态规划|线性代数|数学|内存|编译原理|操作系统|计算机组成|CPU|汇编|虚拟机|JVM|C\+\+|Rust/i,
    ],
  },
  {
    key: 'security',
    label: '安全与区块链',
    patterns: [
      /安全|密码|加密|OAuth|认证|授权|区块链|以太坊|智能合约|Web3|隐私|攻防/i,
    ],
  },
  {
    key: 'quality',
    label: '工程效能与测试',
    patterns: [
      /测试|质量|研发效率|效能|重构|持续交付|持续集成|自动化|代码质量|软件工程|项目交付|工程能力/i,
    ],
  },
  {
    key: 'product',
    label: '产品与商业',
    patterns: [
      /产品|商业|增长|运营|用户体验|交互|设计|创新|MVP|需求|用户|增长|商业模式|硅谷产品/i,
    ],
  },
  {
    key: 'management',
    label: '技术管理与职场',
    patterns: [
      /管理|项目管理|敏捷|OKR|领导力|CTO|晋升|面试|职场|团队|沟通|复盘|绩效|组织|求生|架构师成长/i,
    ],
  },
  {
    key: 'growth',
    label: '个人成长与表达',
    patterns: [
      /写作|故事|视觉笔记|摄影|音乐|英语|跑步|财富|学习高手|时间管理|阅读|表达|思维|认知|法律|求职|恋爱/i,
    ],
  },
];

const COURSE_CATEGORY_OVERRIDES: Record<string, string> = {
  '从0开始学大数据': 'ai',
  '代码之丑': 'quality',
  '手把手带你写一个Web框架': 'backend',
  '物联网开发实战': 'infra',
  '设计模式之美': 'architecture',
  '软件设计之美': 'architecture',
  '说透芯片': 'foundation',
  '如何看懂一幅画': 'growth',
  '如何读懂一首诗': 'growth',
  '编辑训练营': 'growth',
  '正则表达式入门课': 'foundation',
  '搞定音频技术': 'foundation',
  '攻克视频技术': 'foundation',
};

// 从文件名提取标题：去掉编号和分隔符
// 例: "01-程序员如何用技术变现？（上）.md" -> "程序员如何用技术变现？（上）"
// 例: "开篇词｜RAG，传统开发者加入AI的最佳路线.md" -> "RAG，传统开发者加入AI的最佳路线"
function extractTitle(filename) {
  let name = filename.replace(/\.md$/, '');
  // 匹配带｜的格式: 前缀文字 + ｜ (如 "开篇词｜xxx", "加餐1｜xxx")
  if (/[|｜]/.test(name)) {
    name = name.replace(/^[^|｜]+[|｜][\s\-]*/, '');
  }
  // 匹配数字-格式: "01-xxx"
  name = name.replace(/^\d+-/, '');
  return name;
}

// 提取文件排序编号
function extractSortKey(filename) {
  let name = filename.replace(/\.md$/, '');
  const match = name.match(/^(\d+)/);
  if (match) return parseInt(match[1], 10);
  // 特殊文章排在最后
  if (name.startsWith('开篇词')) return 0;
  if (name.startsWith('加餐')) return 990;
  if (name.startsWith('答疑')) return 991;
  if (name.startsWith('总结')) return 992;
  if (name.startsWith('结束语')) return 999;
  if (name.startsWith('结课')) return 1000;
  return 9999;
}

function scoreCategory(category, courseDir, articleTitles) {
  let score = 0;
  for (const pattern of category.patterns) {
    if (pattern.test(courseDir)) score += 10;
    for (const title of articleTitles) {
      if (pattern.test(title)) score += 1;
    }
  }
  return score;
}

function classifyCourse(courseDir, articleTitles) {
  const scored = COURSE_CATEGORIES
    .map(category => ({
      key: category.key,
      label: category.label,
      score: scoreCategory(category, courseDir, articleTitles),
    }))
    .sort((a, b) => b.score - a.score);

  const overrideKey = COURSE_CATEGORY_OVERRIDES[courseDir];
  const override = overrideKey ? COURSE_CATEGORIES.find(category => category.key === overrideKey) : null;
  const primary = override
    ? { key: override.key, label: override.label, score: Number.MAX_SAFE_INTEGER }
    : scored[0]?.score > 0
      ? scored[0]
      : { key: 'other', label: '其他', score: 0 };
  let tags = scored
    .filter(item => item.score > 0)
    .slice(0, 3)
    .map(item => item.label);

  if (override) {
    tags = [override.label, ...tags.filter(tag => tag !== override.label)];
  }
  if (tags.length === 0) tags.push(primary.label);

  return {
    category: primary.key,
    categoryLabel: primary.label,
    tags,
  };
}

// 扫描课程目录生成侧边栏配置
function generateSidebar() {
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });

  const courseDirs = entries
    .filter(e => e.isDirectory() && !EXCLUDE_DIRS.includes(e.name))
    .map(e => e.name)
    .sort();

  const sidebar = {};
  const navItems = [];

  for (const courseDir of courseDirs) {
    const dirPath = path.join(rootDir, courseDir);
    const mdFiles = fs.readdirSync(dirPath)
      .filter(f => f.endsWith('.md') && !EXCLUDE_FILES.includes(f))
      .sort((a, b) => extractSortKey(a) - extractSortKey(b));

    if (mdFiles.length === 0) continue;
    const articleTitles = mdFiles.map(extractTitle);
    const meta = classifyCourse(courseDir, articleTitles);

    const items = mdFiles.map(f => {
      // 对文件名中的 % 进行转义，避免被当作 URL 百分编码
      const safeName = f.replace(/\.md$/, '').replace(/%/g, '%25');
      return {
        text: extractTitle(f),
        link: `/${courseDir}/${safeName}`
      };
    });

    sidebar[`/${courseDir}/`] = items;
    navItems.push({
      text: courseDir,
      link: items[0].link,
      count: mdFiles.length,
      category: meta.category,
      categoryLabel: meta.categoryLabel,
      tags: meta.tags
    });
  }

  return { sidebar, navItems };
}

// 生成 sidebar.mts
const { sidebar, navItems } = generateSidebar();

const sidebarContent = `// 此文件由 scripts/generate-sidebar.mts 自动生成，请勿手动编辑
import type { DefaultTheme } from 'vitepress';

export const sidebar: DefaultTheme.Sidebar = ${JSON.stringify(sidebar, null, 2)};

export const courseCategories = ${JSON.stringify(COURSE_CATEGORIES.map(({ key, label }) => ({ key, label })), null, 2)};

export const navItems = ${JSON.stringify(navItems, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '..', '.vitepress', 'sidebar.ts'), sidebarContent, 'utf-8');
const categorySummary = navItems.reduce((summary, item) => {
  summary[item.categoryLabel] = (summary[item.categoryLabel] || 0) + 1;
  return summary;
}, {});

console.log(`✅ 侧边栏配置已生成: ${navItems.length} 个课程`);
console.log(`📚 分类统计: ${Object.entries(categorySummary).map(([label, count]) => `${label} ${count}`).join(' / ')}`);
