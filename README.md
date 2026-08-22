# 🐱 我的小站 · 个人博客

一个基于 **Next.js + TypeScript + Tailwind CSS** 的个人博客，支持分类、标签、全文搜索、暗色模式、RSS 订阅与 Giscus 评论，可一键部署到 **GitHub Pages**。

## ✨ 功能

- 📝 **Markdown 写作**：文章放在 `content/posts/`，frontmatter 管理元信息
- 🏷️ **分类与标签**：自动聚合，支持筛选页面
- 🔍 **全文搜索**：构建时生成索引，前端 Fuse.js 模糊搜索
- 🌙 **暗色模式**：跟随系统，可手动切换
- 📡 **RSS 订阅**：构建时自动生成 `rss.xml`
- �️ **站点地图**：自动生成 `sitemap.xml`，利于 SEO
- �💬 **评论系统**：基于 Giscus（GitHub Discussions）
- 📄 **关于 / 友链页面**
- 📐 **数学公式**：KaTeX 支持
- 🎨 **代码高亮**：GitHub 风格，明暗双主题

## 🚀 快速开始

### 本地开发

```bash
npm install
npm run dev
```

打开 `http://localhost:3000` 即可预览。

### 本地构建预览

```bash
npm run build          # 构建到 out/ 并生成 rss.xml 与 search-index.json
npx serve out          # 预览静态站点
```

## ✍️ 写文章

在 `content/posts/` 下新建 `.mdx` 文件即可，支持 GitHub Flavored Markdown、数学公式与代码高亮：

```mdx
---
title: "文章标题"
date: "2026-08-22"            # 必填
updated: "2026-08-23"         # 可选，更新日期
description: "文章摘要，会显示在卡片与 SEO 中"
category: "技术"              # 分类（需在 frontmatter 中指定）
tags: [Next.js, React]         # 标签，可多个
draft: false                   # 设为 true 则不发布
---

正文内容…
```

## ⚙️ 站点配置

所有站点信息集中在 `site.config.json` 中修改：

| 字段 | 说明 |
| --- | --- |
| `name` | 站点名称（导航栏 / 标题） |
| `title` | 浏览器标题 |
| `description` | 站点描述（SEO / RSS） |
| `url` | 部署后的完整地址，如 `https://user.github.io` |
| `author` | 作者信息 |
| `social` | 社交链接 |

### 启用评论（Giscus）

1. 到 [giscus.app](https://giscus.app) 按指引获取配置
2. 将 `repo`、`repoId`、`categoryId` 填入 `lib/site.ts` 的 `giscus` 配置
3. 将 `enabled` 设为 `true`

### 添加友链

编辑 `lib/friends.ts`，按格式添加即可。

## 🚢 部署到 GitHub Pages

### 方案一：GitHub Actions（推荐）

仓库已包含 `.github/workflows/deploy.yml`，只需：

1. 把代码推送到 GitHub（默认分支为 `main`）
2. 在仓库 **Settings → Pages** 中，将 Source 设为 **GitHub Actions**
3. 推送后 Actions 会自动构建并部署，地址为 `https://<user>.github.io/<repo>/`

> 子路径会自动计算：仓库名以 `.github.io` 结尾时部署在根路径，否则部署在 `/<repo>` 下。

### 方案二：本地手动部署

```bash
npm run build
```

把 `out/` 目录内容推送到你的 GitHub Pages 仓库即可。

## 📁 目录结构

```text
├── app/                 # 页面与路由
│   ├── posts/[slug]/    # 文章详情
│   ├── tags/            # 标签列表与筛选
│   ├── categories/      # 分类列表与筛选
│   ├── about/           # 关于
│   ├── friends/         # 友链
│   └── search/          # 搜索
├── components/          # UI 组件
├── content/posts/       # Markdown 文章
├── lib/                 # 核心逻辑（站点配置 / 文章读取 / Markdown 渲染）
├── scripts/             # 构建后脚本（RSS / 搜索索引）
└── .github/workflows/   # 部署工作流
```

## 🧰 技术栈

Next.js 16 · TypeScript · Tailwind CSS v4 · unified/remark · next-themes · Fuse.js · Giscus · feed
