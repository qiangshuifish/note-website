<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { withBase } from 'vitepress';
import { navItems } from '../../sidebar';

interface Course {
  text: string;
  link: string;
  count: number;
}

const allCourses: Course[] = navItems.map(item => ({
  text: item.text,
  link: item.link,
  count: item.count,
}));

const totalArticles = computed(() => allCourses.reduce((sum, c) => sum + c.count, 0));

const searchQuery = ref('');
const activeCategory = ref<string | null>(null);
const catalogRef = ref<HTMLElement | null>(null);

// 知识领域分类（关键词匹配）
const categories: { key: string; label: string; match: (name: string) => boolean }[] = [
  { key: 'ai', label: 'AI 与智能体', match: n => /ClaudeCode|LLM|RAG|Agent|智能体|人工智能|机器学习|深度学习|推荐系统|NLP/.test(n) },
  { key: 'frontend', label: '前端开发', match: n => /前端|React|Vue|JavaScript|浏览器|可视化|Flutter|iOS|Android|WebAssembly/.test(n) },
  { key: 'backend', label: '后端开发', match: n => /Java|Go|Spring|Python|Kafka|Redis|MySQL|RPC|Tomcat|Jetty|后端/.test(n) },
  { key: 'database', label: '数据库', match: n => /MySQL|Redis|etcd|数据库|SQL|Kafka|消息队列|Kafka/.test(n) },
  { key: 'infra', label: '基础设施', match: n => /Kubernetes|容器|Docker|Linux|Nginx|OpenResty|Serverless|SRE|运维|DevOps|持续交付|CI\/?CD/.test(n) },
  { key: 'architecture', label: '架构与设计', match: n => /架构|DDD|微服务|分布式|中台|设计模式|RPC|系统|性能|调优|压测/.test(n) },
  { key: 'algo', label: '算法与底层', match: n => /算法|数据结构|内存|编译原理|操作系统|V8|网络协议|Linux操作系统|动态规划/.test(n) },
  { key: 'security', label: '安全', match: n => /安全|密码|OAuth|区块链/.test(n) },
  { key: 'management', label: '技术管理', match: n => /管理|团队|产品|敏捷|项目管理|OKR|领导力|CTO|晋升|复盘/.test(n) },
  { key: 'growth', label: '个人成长', match: n => /财富|写作|跑步|恋爱|摄影|音乐|读书|学习高手|诗|画|故事|职场|英语|跑步|阅读|测试|财富|10x/.test(n) },
];

// 为每门课程分配分类
function getCourseCategory(course: Course): string {
  for (const cat of categories) {
    if (cat.match(course.text)) return cat.key;
  }
  return 'other';
}

// 分类统计
const categoryStats = computed(() => {
  const stats: { key: string; label: string; count: number; articles: number }[] = [
    { key: 'all', label: '全部', count: allCourses.length, articles: totalArticles.value },
  ];
  for (const cat of categories) {
    const courses = allCourses.filter(c => getCourseCategory(c) === cat.key);
    if (courses.length > 0) {
      const arts = courses.reduce((s, c) => s + c.count, 0);
      stats.push({ key: cat.key, label: cat.label, count: courses.length, articles: arts });
    }
  }
  const others = allCourses.filter(c => getCourseCategory(c) === 'other');
  if (others.length > 0) {
    const arts = others.reduce((s, c) => s + c.count, 0);
    stats.push({ key: 'other', label: '其他', count: others.length, articles: arts });
  }
  return stats;
});

// 按分类分组
const groupedCourses = computed(() => {
  const groups: { key: string; label: string; courses: Course[] }[] = [];
  if (activeCategory.value === null || activeCategory.value === 'all') {
    for (const cat of categoryStats.value) {
      if (cat.key === 'all') continue;
      const courses = allCourses.filter(c => getCourseCategory(c) === cat.key);
      const filtered = searchQuery.value ? courses.filter(c => matchesSearch(c)) : courses;
      if (filtered.length > 0) {
        groups.push({ key: cat.key, label: cat.label, courses: filtered });
      }
    }
  } else {
    const courses = allCourses.filter(c => getCourseCategory(c) === activeCategory.value);
    const filtered = searchQuery.value ? courses.filter(c => matchesSearch(c)) : courses;
    if (filtered.length > 0) {
      const catLabel = categoryStats.value.find(s => s.key === activeCategory.value)?.label || '';
      groups.push({ key: activeCategory.value, label: catLabel, courses: filtered });
    }
  }
  return groups;
});

// 搜索过滤
function matchesSearch(course: Course): boolean {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return true;
  return course.text.toLowerCase().includes(q);
}

const visibleCount = computed(() => {
  return groupedCourses.value.reduce((sum, g) => sum + g.courses.length, 0);
});

function selectCategory(key: string) {
  activeCategory.value = key === 'all' ? null : key;
  // 滚动到课程区域
  nextTick(() => {
    const el = document.getElementById('course-catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function escapePercent(link: string) {
  return link.replace(/%/g, '%25');
}

// 文章数量标签
function sizeLabel(count: number): string {
  if (count >= 100) return '大部头';
  if (count >= 50) return '系统课';
  if (count >= 30) return '专题课';
  if (count >= 15) return '精讲';
  return '入门';
}
</script>

<template>
  <section class="catalog-page">
    <!-- 顶部统计 -->
    <header class="catalog-header">
      <h2 class="catalog-title">课程索引</h2>
      <p class="catalog-summary">
        <span class="num">{{ allCourses.length }}</span> 门课程
        <span class="sep">·</span>
        <span class="num">{{ totalArticles }}</span> 篇文章
        <span class="sep">·</span>
        <span class="num">{{ categoryStats.length - 1 }}</span> 个知识领域
      </p>
    </header>

    <!-- 搜索 -->
    <div class="search-bar">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索课程..."
        class="search-input"
        autocomplete="off"
      />
      <span v-if="searchQuery" class="search-count">{{ visibleCount }} / {{ allCourses.length }}</span>
    </div>

    <!-- 双栏布局 -->
    <div class="catalog-layout" id="course-catalog">
      <!-- 左侧分类导航 -->
      <aside class="catalog-sidebar">
        <nav class="category-nav">
          <button
            v-for="stat in categoryStats"
            :key="stat.key"
            :class="[
              'category-item',
              { active: activeCategory === (stat.key === 'all' ? null : stat.key) }
            ]"
            @click="selectCategory(stat.key)"
          >
            <span class="cat-label">{{ stat.label }}</span>
            <span class="cat-count">{{ stat.count }}</span>
          </button>
        </nav>
      </aside>

      <!-- 右侧课程列表 -->
      <main class="catalog-main">
        <Transition name="fade" mode="out-in">
          <div v-if="groupedCourses.length > 0" :key="activeCategory + '-' + searchQuery" class="groups-container">
            <div v-for="group in groupedCourses" :key="group.key" class="course-group">
              <h3 class="group-header">
                <span class="group-dot" />
                <span class="group-title">{{ group.label }}</span>
                <span class="group-count">{{ group.courses.length }} 门</span>
              </h3>
              <div class="group-grid">
                <a
                  v-for="course in group.courses"
                  :key="course.text"
                  :href="withBase(escapePercent(course.link))"
                  class="course-card"
                >
                  <div class="course-info">
                    <h4 class="course-title">{{ course.text }}</h4>
                    <span class="course-size">{{ sizeLabel(course.count) }}</span>
                  </div>
                  <span class="course-count">{{ course.count }}</span>
                </a>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <p>没有找到匹配的课程</p>
            <button class="reset-btn" @click="searchQuery = ''; activeCategory = null">清除筛选</button>
          </div>
        </Transition>
      </main>
    </div>
  </section>
</template>

<style scoped>
.catalog-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

/* ---- Header ---- */
.catalog-header {
  text-align: center;
  margin-bottom: 28px;
}

.catalog-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
  font-family: 'Noto Serif SC', serif;
}

.catalog-summary {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 0;
}

.catalog-summary .num {
  font-weight: 700;
  color: var(--vp-c-brand-1);
  font-family: 'Noto Serif SC', serif;
}

.catalog-summary .sep {
  margin: 0 4px;
  color: var(--vp-c-text-3);
}

/* ---- Search ---- */
.search-bar {
  position: relative;
  max-width: 480px;
  margin: 0 auto 32px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--vp-c-text-3);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 80px 12px 42px;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 12px;
  font-size: 14px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  outline: none;
  transition: all 0.25s ease;
  font-family: 'Noto Sans SC', sans-serif;
}

.search-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
  background: var(--vp-c-bg-elv);
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
}

.search-count {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

/* ---- Dual-column layout ---- */
.catalog-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 32px;
  align-items: start;
}

/* ---- Sidebar ---- */
.catalog-sidebar {
  position: sticky;
  top: calc(var(--vp-nav-height, 56px) + 16px);
  max-height: calc(100vh - var(--vp-nav-height, 56px) - 32px);
  overflow-y: auto;
}

.category-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Noto Sans SC', sans-serif;
  text-align: left;
  width: 100%;
}

.category-item:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.category-item.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.category-item .cat-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-item .cat-count {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  min-width: 24px;
  text-align: center;
}

.category-item.active .cat-count {
  background: var(--vp-c-brand-1);
  color: #fff;
}

/* ---- Main content ---- */
.catalog-main {
  min-width: 0;
}

.groups-container {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

/* ---- Group header ---- */
.group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.group-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  flex-shrink: 0;
}

.group-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
  font-family: 'Noto Serif SC', serif;
}

.group-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

/* ---- Course cards in groups ---- */
.group-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.course-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  background: var(--vp-c-bg);
  gap: 12px;
  min-height: 52px;
}

.course-card:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.course-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.course-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin: 0;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s;
}

.course-card:hover .course-title {
  color: var(--vp-c-brand-1);
}

.course-size {
  font-size: 10px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  padding: 2px 7px;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}

.course-card:hover .course-size {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.course-count {
  font-size: 12px;
  font-weight: 700;
  color: var(--vp-c-text-3);
  font-family: 'Noto Sans SC', sans-serif;
  flex-shrink: 0;
  min-width: 20px;
  text-align: right;
}

.course-card:hover .course-count {
  color: var(--vp-c-brand-1);
}

/* ---- Empty state ---- */
.empty-state {
  text-align: center;
  padding: 80px 0;
  color: var(--vp-c-text-3);
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  opacity: 0.4;
}

.empty-state p {
  font-size: 15px;
  margin: 0 0 20px;
}

.reset-btn {
  padding: 8px 20px;
  border: 1.5px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Noto Sans SC', sans-serif;
}

.reset-btn:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}

/* ---- Transitions ---- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ---- Responsive ---- */
@media (max-width: 960px) {
  .group-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .catalog-page {
    padding: 24px 16px 48px;
  }

  .catalog-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .catalog-sidebar {
    position: static;
    max-height: none;
    overflow: visible;
  }

  .category-nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 6px;
  }

  .category-item {
    padding: 8px 12px;
    font-size: 12px;
    width: auto;
    border: 1.5px solid var(--vp-c-divider);
    border-radius: 8px;
  }

  .category-item.active {
    border-color: var(--vp-c-brand-1);
  }

  .category-item .cat-count {
    display: none;
  }

  .group-grid {
    grid-template-columns: 1fr;
  }

  .catalog-title {
    font-size: 24px;
  }
}
</style>
