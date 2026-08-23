@AGENTS.md

# 废书库修缮委员会 · 项目指南

基于 **Next.js 16（App Router，静态导出）+ TypeScript + Tailwind CSS v4** 的个人博客，部署于 GitHub Pages，后台用 Decap CMS。

## 常用命令

- `npm run dev` — 本地开发（先跑 `node scripts/generate-static.mjs` 生成 RSS/搜索索引）
- `npm run build` — 静态导出到 `out/`（Windows PowerShell 需 `cmd /c "npm ..."`）
- `npm run lint` — ESLint 检查（当前应零错误）

## 关键约定

- **设计系统**：`app/globals.css` 的 CSS 变量（`--gold` 青绿、`--bg` 深底等），dark-first，废墟赛博风；Tailwind 类名映射见 `@theme inline`
- **内容**：文章在 `content/posts/`（.mdx + frontmatter），推荐作品在 `content/works.json`
- **站点配置**：`site.config.json`（name / author / social / url）
- **Markdown 渲染**：`lib/markdown.ts` 已用 `rehype-sanitize` 消毒（防 XSS），改渲染管线时勿移除；管线末尾给所有 img 加 `referrerPolicy`（schema 已允许该属性）
- **外链安全**：作品/友链 URL 经 `safeUrl` 协议白名单（http/https）校验，返回规范化 URL；`target="_blank"` 一律带 `rel="noopener noreferrer"`
- **CSP**：`app/layout.tsx` 用 `<meta http-equiv>` 输出 CSP（静态导出实测可渲染；`frame-ancestors` 在 meta 中无效故省略）；改脚本/资源加载来源时需同步检查 CSP 是否拦截
- **静态生成脚本**：`scripts/generate-static.mjs` 的 slug 校验必须与 `lib/posts.ts` 保持一致（`^[\w\u4e00-\u9fa5-]+$`），否则 RSS/sitemap 会收录页面不存在的文章
- **OAuth 代理**：`netlify/functions/oauth.js` 的 state cookie 走 HttpOnly+Secure+SameSite=Lax；所有响应带 `X-Frame-Options: DENY` 与 `Referrer-Policy: no-referrer`（Decap 登录用 window.open 弹窗，不受 iframe 限制影响）

## 后台（Decap CMS）

- 后台文件在 `public/admin/`（`config.yml` 集合配置 / `custom.css` 主题覆盖 / `index.html` 入口）
- 登录走自托管 OAuth 代理（Netlify Function），环境变量 `GITHUB_OAUTH_CLIENT_ID/SECRET`、`OAUTH_BASE_URL`
- 改 `custom.css` 后必须 bump `index.html` 里的 `?v=` 版本号，否则 CDN 缓存不更新
- 编辑器 class 是 emotion hash（`css-xxx-*`），用 `[class*="..."` 前缀匹配；改 UI 用 playwright 验证 computed style

## 部署

- push 到 `main` 触发 GitHub Actions → GitHub Pages（子路径 `/<repo>`）
- Netlify 仅承载 OAuth 代理（见 `netlify.toml` / `netlify/functions/oauth.js`）
- 本地 push 需设代理 `$env:HTTP_PROXY='http://127.0.0.1:7897'`，并跳过系统 GCM

