<script setup lang="ts">
import { ref, computed } from 'vue';
import { withBase } from 'vitepress';
import { navItems } from '../../sidebar';

interface Course {
  text: string;
  link: string;
  count: number;
}

interface CourseGroup {
  title: string;
  icon: string;
  courses: Course[];
}

const allCourses: Course[] = navItems.map(item => ({
  text: item.text,
  link: item.link,
  count: item.count,
}));

const totalArticles = computed(() => allCourses.reduce((sum, c) => sum + c.count, 0));

const searchQuery = ref('');
const activeTab = ref('全部');

// 课程分类
const groups: CourseGroup[] = [
  {
    title: 'AI 与智能应用',
    icon: 'AI',
    courses: allCourses.filter(c =>
      /ClaudeCode|LLM|RAG|Agent|智能体/.test(c.text)
    ),
  },
  {
    title: '数据库与存储',
    icon: 'DB',
    courses: allCourses.filter(c =>
      /MySQL|Redis|数据库/.test(c.text)
    ),
  },
  {
    title: '架构与设计',
    icon: 'Arch',
    courses: allCourses.filter(c =>
      /架构|DDD|微服务/.test(c.text)
    ),
  },
  {
    title: '基础与工程',
    icon: 'Eng',
    courses: allCourses.filter(c =>
      /算法|容器|左耳|Java业务|工程/.test(c.text)
    ),
  },
];

// 未分组的课程
const groupedTexts = new Set(groups.flatMap(g => g.courses.map(c => c.text)));
const ungrouped = allCourses.filter(c => !groupedTexts.has(c.text));
if (ungrouped.length > 0) {
  groups.push({ title: '其他课程', icon: 'Other', courses: ungrouped });
}

// 所有标签
const tabs = computed(() => ['全部', ...groups.map(g => g.title)]);

// 当前选中的分组
const activeGroup = computed(() => {
  if (activeTab.value === '全部') return null;
  return groups.find(g => g.title === activeTab.value) ?? null;
});

// 过滤
function filterCourses(courses: Course[]): Course[] {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return courses;
  return courses.filter(c => c.text.toLowerCase().includes(q));
}

const filteredAll = computed(() => filterCourses(allCourses));
const filteredActiveGroup = computed(() => {
  if (!activeGroup.value) return [];
  return filterCourses(activeGroup.value.courses);
});

function escapePercent(link: string) {
  return link.replace(/%/g, '%25');
}

function selectTab(tab: string) {
  activeTab.value = tab;
}
</script>

<template>
  <section id="courses" class="course-section">
    <h2 class="section-title">全部课程</h2>
    <p class="summary">
      <span class="summary-num">{{ allCourses.length }}</span> 门课程 ·
      <span class="summary-num">{{ totalArticles }}</span> 篇文章
    </p>

    <div class="search-wrapper">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索课程名称..."
        class="search-input"
      />
    </div>

    <!-- 分类标签栏 -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="['tab-btn', { active: activeTab === tab }]"
        @click="selectTab(tab)"
      >
        {{ tab }}
      </button>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredAll.length === 0 && activeTab === '全部'" class="empty-hint">
      <div class="empty-icon">🔍</div>
      <p>没有找到匹配的课程</p>
    </div>
    <div v-else-if="filteredActiveGroup.length === 0 && activeGroup" class="empty-hint">
      <div class="empty-icon">🔍</div>
      <p>没有找到匹配的课程</p>
    </div>

    <!-- 「全部」网格 -->
    <Transition name="fade" mode="out-in">
      <div v-if="activeTab === '全部'" :key="'all'" class="course-grid">
        <a
          v-for="(course, ci) in filteredAll"
          :key="course.text"
          :href="withBase(escapePercent(course.link))"
          class="card"
          :style="{ '--card-index': ci }"
        >
          <h4 class="card-title">{{ course.text }}</h4>
          <div class="card-footer">
            <span class="card-badge">{{ course.count }} 篇</span>
          </div>
        </a>
      </div>

      <!-- 单组网格 -->
      <div
        v-else-if="activeGroup"
        :key="activeTab"
        class="course-grid course-grid--group"
      >
        <a
          v-for="(course, ci) in filteredActiveGroup"
          :key="course.text"
          :href="withBase(escapePercent(course.link))"
          class="card"
          :style="{ '--card-index': ci }"
        >
          <h4 class="card-title">{{ course.text }}</h4>
          <div class="card-footer">
            <span class="card-badge">{{ course.count }} 篇</span>
          </div>
        </a>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.course-section {
  max-width: 1152px;
  margin: 48px auto 0;
  padding: 0 24px 48px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
  font-family: 'Noto Serif SC', serif;
}

.summary {
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 15px;
  margin: 0 0 32px;
}

.summary-num {
  font-weight: 700;
  color: var(--vp-c-brand-1);
  font-family: 'Noto Serif SC', serif;
}

/* 搜索框 */
.search-wrapper {
  max-width: 420px;
  margin: 0 auto 28px;
}

.search-input {
  width: 100%;
  padding: 12px 18px;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 10px;
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

/* 标签栏 */
.tab-bar {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.tab-btn {
  padding: 8px 18px;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: 'Noto Sans SC', sans-serif;
}

.tab-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.tab-btn.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}

/* 空状态 */
.empty-hint {
  text-align: center;
  color: var(--vp-c-text-3);
  padding: 64px 0;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-hint p {
  font-size: 15px;
}

/* 响应式网格 */
.course-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.course-grid--group {
  grid-template-columns: repeat(2, 1fr);
}

/* Fade 过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 卡片 */
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 18px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--vp-c-bg-soft);
  min-height: 96px;
  position: relative;
  overflow: hidden;
  animation: cardFadeIn 0.4s ease-out both;
  animation-delay: calc(var(--card-index) * 0.04s);
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 卡片顶部装饰线 */
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  opacity: 0;
  transition: opacity 0.3s;
}

.card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  background: var(--vp-c-bg-elv);
}

.card:hover::before {
  opacity: 1;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 12px;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.25s;
}

.card:hover .card-badge {
  background: var(--vp-c-brand-1);
  color: #fff;
}

/* 响应式 */
@media (max-width: 960px) {
  .course-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .course-section {
    padding: 0 16px 32px;
  }

  .section-title {
    font-size: 26px;
  }

  .course-grid,
  .course-grid--group {
    grid-template-columns: 1fr;
  }

  .tab-bar {
    gap: 6px;
    margin-bottom: 24px;
  }

  .tab-btn {
    padding: 6px 14px;
    font-size: 12px;
  }
}
</style>
