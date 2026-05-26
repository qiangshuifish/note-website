<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const progress = ref(0);

function updateProgress() {
  const el = document.documentElement;
  const scrollTop = window.scrollY || window.pageYOffset;
  const docHeight = el.scrollHeight - el.clientHeight;
  if (docHeight <= 0) {
    progress.value = 0;
    return;
  }
  progress.value = Math.min(Math.round((scrollTop / docHeight) * 100), 100);
}

let ticking = false;

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateProgress();
      ticking = false;
    });
    ticking = true;
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  updateProgress();
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <Transition name="progress-fade">
    <div v-if="progress > 0" class="reading-progress" title="阅读进度">
      <div class="reading-progress-track">
        <div class="reading-progress-bar" :style="{ width: progress + '%' }" />
      </div>
      <span class="reading-progress-text">{{ progress }}%</span>
    </div>
  </Transition>
</template>

<style scoped>
.reading-progress {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 8px 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  min-width: 100px;
}

.reading-progress-track {
  width: 60px;
  height: 4px;
  background: var(--vp-c-bg-soft);
  border-radius: 2px;
  overflow: hidden;
}

.reading-progress-bar {
  height: 100%;
  background: var(--vp-c-brand-1);
  border-radius: 2px;
  transition: width 0.2s ease;
}

.reading-progress-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  font-family: 'Noto Sans SC', sans-serif;
  min-width: 30px;
  text-align: right;
}

.progress-fade-enter-active,
.progress-fade-leave-active {
  transition: opacity 0.3s ease;
}

.progress-fade-enter-from,
.progress-fade-leave-to {
  opacity: 0;
}
</style>
