#!/bin/bash
# 本地部署脚本：构建静态产物并部署到 gh-pages 分支

set -euo pipefail

echo "🚀 开始部署知识库到 GitHub Pages..."

echo "🧹 清理旧构建产物..."
rm -rf dist

echo "🔨 构建网站（183 门课程，约需 10-15 分钟）..."
npm run docs:build

echo "📦 构建产物大小:"
du -sh dist

echo "📤 部署 dist 到 gh-pages 分支..."
npx gh-pages -d dist -t --nojekyll -m "Deploy: 更新知识库"

echo "✅ 部署完成！"
echo "🔗 访问地址: https://qiangshuifish.github.io/note-website/"
