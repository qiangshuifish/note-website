#!/bin/bash
# 本地部署脚本：构建并部署到 GitHub Pages

set -e

echo "🚀 开始部署知识库到 GitHub Pages..."

# 生成侧边栏
echo "📑 生成侧边栏配置..."
npx tsx scripts/generate-sidebar.mts

# 构建（需要大内存）
echo "🔨 构建网站（183 门课程，约需 10-15 分钟）..."
NODE_OPTIONS="--max-old-space-size=16384" npx vitepress build

# 部署到 gh-pages 分支
echo "📤 部署到 GitHub Pages..."
npx gh-pages -d dist -t true -m "Deploy: 更新知识库"

echo "✅ 部署完成！"
echo "🔗 访问地址: https://qiangshuifish.github.io/note-website/"
