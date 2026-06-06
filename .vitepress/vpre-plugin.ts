import type MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token';

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
      const rendered = defaultImageRender
        ? defaultImageRender(tokens, idx, options, env, self)
        : self.renderToken(tokens, idx, options);
      return `<a class="image-link" href="${src}" target="_blank" rel="noopener" title="点击查看原图">${rendered}</a>`;
    };
  };
}
