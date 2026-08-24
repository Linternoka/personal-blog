# 废书库修缮委员会

一个个人博客。Next.js 16 + TypeScript + Tailwind CSS v4，静态导出到 GitHub Pages，后台用 Decap CMS 在浏览器里直接编辑文章。

## 有什么

- Markdown 写作，文章是 `content/posts/` 下的 .mdx，元信息写在 frontmatter 里
- 分类、标签、全文搜索（Fuse.js，构建时生成索引）
- 暗色 / 亮色主题，默认暗色
- RSS 订阅和 sitemap，构建时生成
- 推荐作品页，数据在 `content/works.json`
- 关于、友链、指南页面
- Giscus 评论（要先配 repo 和 categoryId 才能用）
- KaTeX 公式、代码高亮

## 本地跑

```bash
npm install
npm run dev
```

打开 http://localhost:3000。

构建预览：

```bash
npm run build
npx serve out
```

部署在子路径（`/<repo>`）时，想本地看子路径效果就设 `NEXT_PUBLIC_BASE_PATH=/personal-blog`。

Windows 上 npm 脚本会被 PowerShell 拦，用 `cmd /c "npm run dev"` 这种方式跑。

## 写文章

两种方式。

### 方式一：后台（图形化）

部署后访问 `/personal-blog/admin/`，点「使用 GitHub 登录」，授权完就能在网页里写。写完点保存，直接提交到 main，触发重新构建。认证走自托管 OAuth 代理，见部署一节。

页脚有「后台管理」入口，或者直接在地址栏输入后台地址。

### 方式二：直接写文件

文章就是 `content/posts/` 下的 .mdx，文件名是网址里的 slug。开头是 frontmatter：

```mdx
---
title: "标题"
date: "2026-08-22"
updated: "2026-08-23"      # 可选
description: "摘要"
category: "杂谈"           # 杂谈 / 评价 / 记录 / 其他
tags: [记录]
draft: false               # true 则不发布
cover: "/images/xxx.png"   # 可选
---

正文。
```

写完 git 提交推 main 就发布。没有本地环境的话，GitHub 网页上直接编辑也能提交。

提醒：后台和本地同时改会分叉，推之前先 `git fetch` + `git rebase`，别直接覆盖。

## 添加推荐

「推荐」页数据在 `content/works.json`，数组里加一组：

```json
{
  "title": "作品标题",
  "type": "轻小说",
  "description": "一句话简介",
  "url": "https://example.com",
  "author": "作者（可选）",
  "date": "2026-08-22（可选）"
}
```

`url` 只认 http/https，其他协议会被过滤掉。

## 添加友链

友链在 `lib/friends.ts` 的 `friends` 数组：

```ts
{
  name: "站点名",
  url: "https://example.com",
  description: "一句话介绍",
  avatar: "/images/friend.png", // 可选
}
```

`avatar` 填站内路径或外链都行，不填用站点名首字符代替。url 同样只收 http/https。

## 配置

站点信息都在 `site.config.json`：

| 字段 | 说明 |
| --- | --- |
| `name` / `title` / `description` | 站点名、标题、描述 |
| `url` | 部署根地址，如 `https://user.github.io` |
| `author` | name / email / bio |
| `social` | 社交链接 |

导航菜单在 `lib/site.ts` 的 `nav` 数组。

评论要开的话，去 [giscus.app](https://giscus.app) 拿配置，填进 `lib/site.ts` 的 giscus 字段，把 enabled 改成 true。

访问统计使用 GoatCounter，后台地址是 [linternoka-blog.goatcounter.com](https://linternoka-blog.goatcounter.com/)。统计脚本在 `app/layout.tsx` 中配置。

预设分类在 `lib/posts.ts` 的 `PRESET_CATEGORIES`，改的时候记得同步 `public/admin/config.yml` 里的分类选项。

## 部署

主站在 GitHub Pages。推送 main 触发 Actions 构建，仓库 Settings → Pages 里把 Source 选成 GitHub Actions 就行。地址是 `https://<user>.github.io/<repo>/`。仓库名以 .github.io 结尾就部署到根路径，否则在子路径。

后台登录需要一个 GitHub OAuth 代理。GitHub 官方的托管服务已经下线，所以自己用 Netlify Function 搭了一个：

- `netlify/functions/oauth.js` 处理 `/auth` 和 `/callback`
- `netlify.toml` 把这两个路径重定向到 Function
- Netlify 上配三个环境变量：`GITHUB_OAUTH_CLIENT_ID`、`GITHUB_OAUTH_CLIENT_SECRET`、`OAUTH_BASE_URL`
- GitHub OAuth App 的回调地址填 `https://<netlify站点>.netlify.app/callback`

## 网站架构

代码和内容在同一个仓库，构建时全部页面导出成静态文件，没有服务器也没有数据库。

```text
app/                  页面（App Router）
components/           UI 组件
content/              posts 文章 + works.json 作品
lib/                  站点配置、文章读取、Markdown 渲染、公共工具
public/admin/         Decap CMS 后台
public/images/        配图
scripts/              构建时生成 rss / sitemap / 搜索索引
netlify/              OAuth 代理
.github/workflows/    部署
```

几条数据线：

- 文章在 `content/posts/`，`lib/posts.ts` 构建时读进来生成页面，`lib/markdown.ts` 负责渲染（过 rehype-sanitize 消毒）
- `scripts/generate-static.mjs` 在构建前跑，产出 `public/rss.xml`、`sitemap.xml`、`search-index.json`
- 搜索是纯前端的，Fuse.js 在浏览器里查索引
- 评论 Giscus 挂在 GitHub Discussions 上
- 后台 Decap CMS 登录走 Netlify OAuth 代理，保存直接 commit 到 main
- 构建流程：`npm run build` → 先生成静态资源 → Next.js 导出到 `out/` → Actions 上传 Pages

## 顺手做的安全处理

- 文章 Markdown 渲染前过一遍 rehype-sanitize，危险协议和事件属性会被滤掉
- slug 只允许文件名安全字符，防路径穿越；`scripts/generate-static.mjs` 的 RSS/sitemap/搜索索引与页面共用同一套校验，不会收录会 404 的文章
- 作品和友链链接走协议白名单，且返回的是 URL 规范化结果（消除浏览器与校验器的解析差异）
- 所有新窗口链接都带 rel="noopener noreferrer"
- 站内 `<meta http-equiv>` CSP：限制资源来源、禁 object/plugin、base-uri 防劫持（静态导出实测可输出）
- 外链图片（文章插图、友链头像）带 `referrerPolicy="no-referrer"`，防图床追踪访客
- OAuth 代理：state CSRF 校验 + HttpOnly/Secure cookie + `X-Frame-Options: DENY` + `Referrer-Policy: no-referrer` 防 clickjacking 与 token 泄露
- GitHub Actions 固定到发布 tag 的 SHA（防供应链投毒）
- 密钥不进仓库，OAuth secret 只在 Netlify 环境变量里；`.env*`、`.venv*`、构建日志均被 .gitignore 覆盖

## 技术栈

Next.js 16 · TypeScript · Tailwind CSS v4 · Decap CMS · Giscus · Fuse.js · remark / rehype
