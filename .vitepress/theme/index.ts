import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import CourseCards from './components/CourseCards.vue';
import ReadingProgress from './components/ReadingProgress.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('CourseCards', CourseCards);
    app.component('ReadingProgress', ReadingProgress);
    if (typeof window !== 'undefined') {
      setupLightbox();
      setupSmoothScroll();
    }
  },
} satisfies Theme;

// ========== 图片弹层放大（纯 JS，无 Vue SSR 问题） ==========

function setupLightbox() {
  const container = document.createElement('div');
  container.id = 'image-lightbox-root';
  document.body.appendChild(container);

  let isOpen = false;
  let currentSrc = '';

  function open(src: string) {
    if (!src || isOpen) return;
    currentSrc = src;
    isOpen = true;
    document.body.style.overflow = 'hidden';
    render();
  }

  function close() {
    isOpen = false;
    document.body.style.overflow = '';
    setTimeout(() => { currentSrc = ''; render(); }, 300);
  }

  function render() {
    if (!isOpen) {
      container.innerHTML = '';
      return;
    }
    container.innerHTML = `
      <div class="image-lightbox" id="lightbox-overlay">
        <button class="image-lightbox-close" id="lightbox-close" aria-label="关闭">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="15" y1="5" x2="5" y2="15"/>
            <line x1="5" y1="5" x2="15" y2="15"/>
          </svg>
        </button>
        <img src="${currentSrc}" class="image-lightbox-img" alt="图片预览" />
      </div>
    `;

    document.getElementById('lightbox-overlay')?.addEventListener('click', close);
    document.getElementById('lightbox-close')?.addEventListener('click', (e) => {
      e.stopPropagation();
      close();
    });
    container.querySelector('.image-lightbox-img')?.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // 点击文章中的图片链接触发弹层
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('.vp-doc .image-link');
    if (!link) return;
    e.preventDefault();
    e.stopPropagation();

    const img = link.querySelector('img') as HTMLImageElement | null;
    // 使用 img.src（DOM 属性）而非 getAttribute('src')，自动解析为绝对 URL
    const src = img?.src || '';
    if (src) open(src);
  }, true);

  // ESC 关闭
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close();
  });
}

// ========== 锚点平滑滚动 ==========

function setupSmoothScroll() {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const el = document.querySelector(href);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, true);
}
