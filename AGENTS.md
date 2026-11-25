# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Repository Overview

This is a personal knowledge/note repository containing Markdown documents from various technical courses, published as a VitePress site (config in `.vitepress/`, helper scripts in `scripts/`).

## Structure

Notes are organized into course directories at the top level:

- **左耳听风** — Software engineering, distributed systems, programming paradigms, leadership (239 files)
- **许式伟的架构课** — Software architecture (178 files)
- **数据结构与算法之美** — Data structures and algorithms (156 files)
- **MySQL实战45讲** — MySQL/InnoDB practical guide (96 files)
- **Java业务开发常见错误100例** — Common Java development pitfalls (93 files)
- **Redis源码剖析与实战** — Redis source code analysis (93 files)
- **容器实战高手课** — Container/containerization (61 files)
- **DDD实战课** — Domain-Driven Design (51 files)
- **RAG系统实战课** — RAG system practical course (58 files)
- **LLM自主智能体应用实战课** — LLM autonomous agent applications (52 files)
- **Codex企业级全链路开发实战** — Codex enterprise development (102 files)
- **Codex企业级老项目改造实战** — Codex legacy project refactoring (58 files)
- **Codex工程化实战** — Codex engineering practices (95 files)
- **从0开始构建AgentHarness** — Building AgentHarness from scratch (44 files)
- **深入拆解消息队列47讲** — Message queue internals (24 files; source PDFs for lectures 19, 23, 24–47 are missing or empty)

There are also a few standalone Markdown files at the root (e.g., `二叉树.md`, `网站 Https 化.md`, `Oh My Zsh 是什么.md`).

## File Naming Convention

Files follow a numbered pattern, e.g., `01-标题.md`, `02｜标题.md`, `开篇词｜标题.md`, `结束语｜标题.md`. Delimiters between number and title vary (`-`, `｜`, `-｜`).

## Course PDF Conversion

`scripts/convert-course-pdf.py` converts Geekbang course PDFs (one per lecture, named like `01｜标题.pdf`) into the repository's Markdown note format and extracts figures into `images/<lecture>/`. It requires PyMuPDF (already installed in user site-packages; if missing run `/usr/bin/python3 -m pip install --user pymupdf`).

```bash
# Convert a whole course directory; output defaults to <repo root>/<input dir name>
python3 scripts/convert-course-pdf.py -i ~/Downloads/课程目录名

# Fill in missing lectures later without touching existing files
python3 scripts/convert-course-pdf.py -i ~/Downloads/课程目录名 --skip-existing

# Preview what would be generated
python3 scripts/convert-course-pdf.py -i ~/Downloads/课程目录名 --dry-run -v
```

After converting, regenerate the sidebar and update the course count in `index.md` and `.vitepress/config.ts` to match the number printed by the sidebar script:

```bash
node_modules/.bin/tsx scripts/generate-sidebar.mts
```

Known source limitations: overlong code lines are truncated in the source PDFs, inline bold cannot be extracted, reader comments are excluded by convention, and ~1KB empty PDFs are skipped and listed in the summary.

## Local Preview and Build

```bash
node_modules/.bin/vitepress dev --port 5173   # preview at http://localhost:5173/note-website/
NODE_OPTIONS=--max-old-space-size=24576 node_modules/.bin/vitepress build
```

Use the executables under `node_modules/.bin/` directly. Avoid `pnpm exec`: it once moved node_modules packages into `.ignored` and triggered network re-fetches.

The image plugin `.vitepress/vpre-plugin.ts` rewrites relative image paths to GitHub raw URLs (branch `note-website`) in production builds and keeps local paths in dev. Images of a new course are unavailable online until the course is pushed to GitHub.

## Git Workflow

- Branch: `note-website` (current; GitHub raw image URLs point to this branch), `main` (default)
- Commit message style: `添加技术学习课程资料`
