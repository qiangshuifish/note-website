import type MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token';
import path from 'node:path';

const RAW_ASSET_BASE = 'https://raw.githubusercontent.com/qiangshuifish/note-website/note-website';
const EXTERNAL_URL_RE = /^(?:[a-z][a-z\d+.-]*:)?\/\//i;

function splitUrlSuffix(src: string) {
  const index = src.search(/[?#]/);
  if (index === -1) return { pathname: src, suffix: '' };
  return {
    pathname: src.slice(0, index),
    suffix: src.slice(index),
  };
}

function encodePathname(pathname: string) {
  return pathname.split('/').map(segment => encodeURIComponent(segment)).join('/');
}

function toRawAssetUrl(src: string, pagePath?: string) {
  if (
    !src ||
    src.startsWith('/') ||
    src.startsWith('#') ||
    src.startsWith('data:') ||
    EXTERNAL_URL_RE.test(src)
  ) {
    return src;
  }

  const { pathname, suffix } = splitUrlSuffix(src);
  const baseDir = pagePath ? path.posix.dirname(pagePath) : '.';
  const normalized = path.posix.normalize(path.posix.join(baseDir, pathname));

  if (normalized.startsWith('../')) {
    return src;
  }

  return `${RAW_ASSET_BASE}/${encodePathname(normalized)}${suffix}`;
}

/**
 * Markdown-it 插件：
 * 将图片包裹在 <a class="image-link"> 中，支持点击放大
 */
export function vPreForMustache() {
  return (md: MarkdownIt) => {
    const defaultImageRender = md.renderer.rules.image;

    // 图片包裹在 image-link 中
    md.renderer.rules.image = function (
      tokens: Token[],
      idx: number,
      options: any,
      env: any,
      self: any
    ) {
      const token = tokens[idx];
      const srcIndex = token.attrIndex('src');
      const src = token.attrs?.[srcIndex]?.[1] || '';
      const rawSrc = toRawAssetUrl(src, env?.relativePath);
      if (srcIndex >= 0 && rawSrc !== src) {
        token.attrSet('src', rawSrc);
      }
      const rendered = defaultImageRender
        ? defaultImageRender(tokens, idx, options, env, self)
        : self.renderToken(tokens, idx, options);
      return `<a class="image-link" href="${rawSrc}" target="_blank" rel="noopener" title="点击查看原图">${rendered}</a>`;
    };
  };
}
