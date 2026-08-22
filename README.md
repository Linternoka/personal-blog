# 🏚️ 废书库修缮委员会 · 个人博客

一个基于 **Next.js 16 + TypeScript + Tailwind CSS v4** 的个人博客，采用「废墟赛博」暗色设计系统。支持分类、标签、全文搜索、暗色/亮色模式、RSS 订阅、Giscus 评论，带 **Decap CMS 图形化后台**，可一键部署到 **GitHub Pages**。

## ✨ 功能

- 📝 **Markdown 写作**：文章放在 `content/posts/`，frontmatter 管理元信息，支持 KaTeX 公式与代码高亮
- 🎛️ **Decap CMS 后台**：`/admin/` 图形化编辑文章、上传配图，GitHub OAuth 登录后直接提交
- 📚 **推荐作品**：`content/works.json` 集中管理，卡片式展示（项目 / 文章 / 视频等）
- 🏷️ **分类与标签**：自动聚合，预设分类始终显示
- 🔍 **全文搜索**：构建时生成 `search-index.json`，前端 Fuse.js 模糊搜索
- 🌙 **暗色 / 亮色**：默认暗色（废墟赛博），跟随系统可手动切换
- 📡 **RSS 订阅**：构建时自动生成 `rss.xml`
- 🗺️ **站点地图**：自动生成 `sitemap.xml`，利于 SEO
- 💬 **评论系统**：基于 Giscus（GitHub Discussions），配置即用
- 📄 **关于 / 友链 / 指南页面**

## 🚀 快速开始

```bash
npm install
npm run dev        # 本地开发，http://localhost:3000
```

> 项目部署在 GitHub Pages 子路径（`/<repo>`），本地预览子路径效果可设 `NEXT_PUBLIC_BASE_PATH=/personal-blog`。

### 构建预览

```bash
npm run build      # 生成静态产物到 out/，并生成 rss.xml / sitemap.xml / search-index.json
npx serve out      # 预览静态站点
```

## ✍️ 写文章

### 方式一：直接写 frontmatter

在 `content/posts/` 下新建 `.mdx` 文件：

```mdx
---
title: "文章标题"
date: "2026-08-22"            # 必填
updated: "2026-08-23"         # 可选
description: "文章摘要，用于卡片与 SEO"
category: "杂谈"              # 杂谈 / 评价 / 记录 / 其他
tags: [记录, 日常]
draft: false                   # 设为 true 则不发布
---

正文内容…（支持 GFM、KaTeX、代码高亮）
```

### 方式二：Decap CMS 后台

后台地址：部署后为 `/personal-blog/admin/`，登录流程：

1. 打开后台 → 点「使用 GitHub 登录」→ GitHub 授权
2. 在编辑器中撰写/编辑文章，点保存 → Decap 以你的 token 直接 commit 到 `main`
3. 保存会触发 GitHub Actions 自动重建部署

> 认证走自托管 OAuth 代理（Netlify Function），见下文「部署」。

## ⚙️ 站点配置

所有站点信息集中在 `site.config.json`：

| 字段 | 说明 |
| --- | --- |
| `name` / `title` / `description` | 站点名、浏览器标题、SEO 描述 |
| `url` | 部署根地址（如 `https://user.github.io`） |
| `author` | 作者（name / email / bio） |
| `social` | 社交链接（github / bilibili / email …） |

### 推荐作品

编辑 `content/works.json`，逐条添加 `title` / `type` / `description` / `url`：

```json
{
  "title": "作品名",
  "type": "项目",
  "description": "一句话简介",
  "url": "https://example.com"
}
```

> 链接会经过协议白名单校验，仅允许 `http/https`（防 `javascript:` XSS）。

### 启用评论（Giscus）

1. 到 [giscus.app](https://giscus.app) 获取配置
2. 填入 `lib/site.ts` 的 `giscus` 字段（repo / repoId / categoryId）
3. 将 `enabled` 设为 `true`

### 添加友链

编辑 `lib/friends.ts`，按格式添加（URL 同样会经过协议白名单校验）。

## 🚢 部署

### GitHub Pages（主部署）

仓库包含 `.github/workflows/deploy.yml`：

1. 推送代码到 `main`
2. 仓库 **Settings → Pages** → Source 选 **GitHub Actions**
3. 自动构建部署，地址为 `https://<user>.github.io/<repo>/`

> 子路径自动计算：仓库以 `.github.io` 结尾 → 根路径；否则 → `/<repo>`。

### Netlify（仅承载后台 OAuth）

Decap CMS 的 GitHub 登录需要一个 OAuth 代理（GitHub 官方托管服务已下线），项目用 Netlify Function 自托管：

- `netlify/functions/oauth.js`：实现 `/auth` 302 跳转与 `/callback` 换 token
- `netlify.toml`：把 `/auth`、`/callback` 重定向到 Function
- 需在 Netlify 配置环境变量：
  - `GITHUB_OAUTH_CLIENT_ID` / `GITHUB_OAUTH_CLIENT_SECRET`（GitHub OAuth App）
  - `OAUTH_BASE_URL`（Netlify 站点地址，不带路径）
- GitHub OAuth App 的 Redirect URI 填 `https://<netlify-site>.netlify.app/callback`

## 📁 目录结构

```text
├── app/                 # 页面与路由（Next.js App Router）
│   ├── posts/[slug]/    # 文章详情
│   ├── categories/      # 分类列表与筛选
│   ├── tags/            # 标签列表与筛选
│   ├── search/          # 全文搜索
│   ├── works/           # 推荐作品
│   ├── about/ friends/ guide/
├── components/          # UI 组件（Header / Footer / PostCard / Toc …）
├── content/
│   ├── posts/           # Markdown 文章（.mdx）
│   └── works.json       # 推荐作品数据
├── lib/                 # 核心逻辑（站点配置 / 文章读取 / Markdown 渲染）
├── public/
│   ├── admin/           # Decap CMS 后台（config.yml / custom.css / index.html）
│   └── images/          # 文章配图
├── scripts/             # 构建脚本（RSS / sitemap / 搜索索引）
├── netlify/             # OAuth 代理 Function
└── .github/workflows/   # GitHub Pages 部署工作流
```

## 🛡️ 安全说明

- **Markdown XSS 防护**：`lib/markdown.ts` 经 `rehype-sanitize` 消毒，过滤危险协议与事件属性
- **路径穿越防护**：`lib/posts.ts` 对 slug 做白名单正则校验
- **外链协议校验**：作品 / 友链 URL 仅允许 `http/https`
- **外链安全**：所有 `target="_blank"` 均带 `rel="noopener noreferrer"`
- **密钥安全**：`.env*` 已被 gitignore，OAuth secret 只存于 Netlify 环境变量

## 🧰 技术栈

Next.js 16 · TypeScript · Tailwind CSS v4 · unified / remark / rehype · next-themes · Fuse.js · Decap CMS · Giscus · feed
