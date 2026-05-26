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
      count: mdFiles.length
    });
  }

  return { sidebar, navItems };
}

// 生成 sidebar.mts
const { sidebar, navItems } = generateSidebar();

const sidebarContent = `// 此文件由 scripts/generate-sidebar.mts 自动生成，请勿手动编辑
import type { DefaultTheme } from 'vitepress';

export const sidebar: DefaultTheme.Sidebar = ${JSON.stringify(sidebar, null, 2)};

export const navItems = ${JSON.stringify(navItems, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '..', '.vitepress', 'sidebar.ts'), sidebarContent, 'utf-8');
console.log(`✅ 侧边栏配置已生成: ${navItems.length} 个课程`);
