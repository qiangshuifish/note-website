<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vitepress';
import { navItems } from '../../sidebar';

const route = useRoute();

const currentCourse = computed(() => {
  const path = route.path.split(/[?#]/)[0] || '';
  const firstSegment = path
    .replace(/^\/note-website\//, '/')
    .replace(/^\//, '')
    .split('/')[0];

  if (!firstSegment) return '';

  const decoded = safeDecode(firstSegment);
  const course = navItems.find(item => item.text === decoded);

  return course || { text: decoded, categoryLabel: '课程' };
});

const courseName = computed(() => currentCourse.value && currentCourse.value.text);
const categoryName = computed(() => currentCourse.value && currentCourse.value.categoryLabel);

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
</script>

<template>
  <div v-if="courseName" class="current-course-name" :title="courseName" :aria-label="`当前课程：${courseName}`">
    <span class="course-mark" aria-hidden="true"></span>
    <span class="course-meta">{{ categoryName }}</span>
    <span class="course-title">{{ courseName }}</span>
  </div>
</template>
