#!/usr/bin/env node
// 分批构建 VitePress 站点，避免 7500+ 页面导致 Node.js 栈溢出
// 每批：移走非本批目录 → 用独立 config 构建 → 恢复目录
// 最后合并所有批次产物
import { readFileSync, writeFileSync, readdirSync, statSync, rmSync, mkdirSync, existsSync, renameSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const STAGING = join(ROOT, '.build_staging');
const N_BATCHES = 3;
const EXCLUDE_DIRS = ['node_modules', 'dist', '.vitepress', 'scripts', '.build_staging'];

function getCourseDirs() {
  const entries = readdirSync(ROOT, { withFileTypes: true });
  return entries
    .filter(e => e.isDirectory() && !EXCLUDE_DIRS.includes(e.name))
    .map(e => e.name);
}

function countMdFiles(dir) {
  let count = 0;
  const walk = (p) => {
    for (const e of readdirSync(p, { withFileTypes: true })) {
      const full = join(p, e.name);
      if (e.isDirectory() && e.name !== 'node_modules' && e.name !== '.git') walk(full);
      else if (e.name.endsWith('.md')) count++;
    }
  };
  walk(join(ROOT, dir));
  return count;
}

function greedyAssign(dirs, nBatches) {
  const counts = dirs.map(d => ({ dir: d, count: countMdFiles(d) }));
  counts.sort((a, b) => b.count - a.count);
  const batches = Array.from({ length: nBatches }, () => ({ dirs: [], total: 0 }));
  for (const c of counts) {
    let minIdx = 0;
    for (let j = 1; j < nBatches; j++) {
      if (batches[j].total < batches[minIdx].total) minIdx = j;
    }
    batches[minIdx].dirs.push(c.dir);
    batches[minIdx].total += c.count;
  }
  return batches;
}

function restoreAll(moved) {
  for (const d of moved) {
    const src = join(STAGING, d);
    const dst = join(ROOT, d);
    if (existsSync(src)) {
      renameSync(src, dst);
    }
  }
  if (existsSync(STAGING)) rmSync(STAGING, { recursive: true, force: true });
}

async function buildBatch(batchNum, dirs) {
  const outDir = join(ROOT, `dist-batch${batchNum}`);

  console.log(`\n========== Batch ${batchNum}: ${dirs.length} 个课程, ${dirs.reduce((s, d) => s + countMdFiles(d), 0)} 个文件 ==========`);

  const allDirs = getCourseDirs();
  const dirSet = new Set(dirs);
  const moved = [];

  mkdirSync(STAGING, { recursive: true });
  for (const d of allDirs) {
    if (!dirSet.has(d) && existsSync(join(ROOT, d))) {
      renameSync(join(ROOT, d), join(STAGING, d));
      moved.push(d);
    }
  }
  console.log(`  移走了 ${moved.length} 个目录`);

  // 生成临时 config（sidebar 为空，避免引用不存在的课程）
  const navItems = dirs.map(d => ({ text: d, link: `/${d}/` }));
  const config = `import { defineConfig } from 'vitepress';
import { escapeAngleBrackets } from './escape-plugin';
import { vPreForMustache } from './vpre-plugin';

export default defineConfig({
  title: '技术学习笔记',
  description: '技术学习笔记',
  base: '/note-website/',
  srcDir: '.',
  outDir: './dist',
  cleanUrls: true,
  vite: { plugins: [escapeAngleBrackets()] },
  ignoreDeadLinks: true,
  markdown: {
    links: { ignoreDeadLinks: true },
    config: (md) => { md.use(vPreForMustache()); },
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
      { text: '课程', items: ${JSON.stringify(navItems)} },
    ],
    sidebar: {},
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: { selectText: '选择', navigateText: '切换' },
              },
            },
          },
        },
      },
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/qiangshuifish/note-website' }],
    docFooter: { prev: '上一页', next: '下一页' },
    outline: { label: '页面导航', level: [2, 3] },
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    lastUpdated: { text: '最后更新于', formatOptions: { dateStyle: 'short', timeStyle: 'medium' } },
  },
});
`;
  const configPath = join(ROOT, '.vitepress', `config-batch${batchNum}.ts`);
  writeFileSync(configPath, config);

  try {
    console.log(`  构建中...`);
    execSync(`npx vitepress build --config .vitepress/config-batch${batchNum}.ts`, {
      stdio: 'inherit',
      cwd: ROOT,
      env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=8192' },
    });

    // 构建完成后，把 dist/ 的内容移到批次目录
    mkdirSync(outDir, { recursive: true });
    execSync(`rsync -a dist/ "${outDir}/"`, { cwd: ROOT, stdio: 'inherit' });
    const htmlCount = execSync(`find "${outDir}" -name '*.html' | wc -l`, { encoding: 'utf-8' }).trim();
    console.log(`  Batch ${batchNum} 完成 → ${htmlCount} HTML 文件`);
  } catch (err) {
    console.error(`  Batch ${batchNum} 构建失败！`);
    restoreAll(moved);
    rmSync(configPath, { force: true });
    process.exit(1);
  }

  // 清理 dist/ 给下一批腾位置
  rmSync(join(ROOT, 'dist'), { recursive: true, force: true });

  restoreAll(moved);
  rmSync(configPath, { force: true });
}

async function main() {
  const allDirs = getCourseDirs();
  console.log(`共 ${allDirs.length} 个课程目录`);

  const batches = greedyAssign(allDirs, N_BATCHES);
  console.log(`分成 ${N_BATCHES} 批:`);
  batches.forEach((b, i) => console.log(`  Batch ${i+1}: ${b.total} 个文件, ${b.dirs.length} 个目录`));

  // 清理
  rmSync(join(ROOT, 'dist'), { recursive: true, force: true });
  for (let i = 1; i <= N_BATCHES; i++) {
    rmSync(join(ROOT, `dist-batch${i}`), { recursive: true, force: true });
  }

  // 分批构建
  for (let i = 0; i < N_BATCHES; i++) {
    await buildBatch(i + 1, batches[i].dirs);
  }

  // 合并
  console.log('\n========== 合并所有批次到 dist/ ==========');
  mkdirSync(join(ROOT, 'dist'), { recursive: true });
  for (let i = 1; i <= N_BATCHES; i++) {
    const batchDir = join(ROOT, `dist-batch${i}`);
    if (existsSync(batchDir)) {
      execSync(`rsync -a ${JSON.stringify(batchDir)}/ dist/`, { cwd: ROOT, stdio: 'inherit' });
      console.log(`  合并 dist-batch${i}/`);
      rmSync(batchDir, { recursive: true, force: true });
    }
  }

  const totalHtml = execSync(`find dist/ -name '*.html' | wc -l`, { encoding: 'utf-8' }).trim();
  console.log(`\n合并完成！dist/ 包含 ${totalHtml} 个 HTML 文件。`);
  console.log('Done!');
}

main().catch(err => { console.error(err); process.exit(1); });
