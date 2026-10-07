@AGENTS.md

# 废书库修缮委员会 · 项目指南

基于 **Next.js 16（App Router，静态导出）+ TypeScript + Tailwind CSS v4** 的个人博客，部署于 GitHub Pages，后台用 Decap CMS。

## 常用命令

- `npm run dev` — 本地开发（先跑 `node scripts/generate-static.mjs` 生成 RSS/搜索索引）
- `npm run build` — 静态导出到 `out/`（Windows PowerShell 需 `cmd /c "npm ..."`）
- `npm run lint` — ESLint 检查（当前应零错误）

## 关键约定

- **设计系统**：`app/globals.css` 的 CSS 变量（`--gold` 青绿、`--bg` 深底等），dark-first，废墟赛博风；Tailwind 类名映射见 `@theme inline`
- **图标**：所有图标统一从 `components/icons.tsx` 出口拿（唯一一层，收敛描边 1.5 与 `aria-hidden`）。界面图标来自开源库 **Lucide**（ISC 许可，https://lucide.dev ）；Lucide 1.x 已移除品牌图标，故 GitHub / Bilibili 标识与两张空态插画是本站自有资产，同文件内维护。代码块复制按钮是命令式 DOM（React 管不到），用同文件导出的 `COPY_ICON_MARKUP` / `CHECK_ICON_MARKUP` 字符串，改动需与 React 版同步。分区标题用图标时加 `kam-ico` 类隐藏原来的圆点
- **内容**：文章在 `content/posts/`（.mdx + frontmatter），推荐作品在 `content/works.json`
- **站点配置**：`site.config.json`（name / author / social / url）
- **Markdown 渲染**：`lib/markdown.ts` 已用 `rehype-sanitize` 消毒（防 XSS），改渲染管线时勿移除；管线末尾给所有 img 加 `referrerPolicy`（schema 已允许该属性）
- **外链安全**：作品/友链 URL 经 `safeUrl` 协议白名单（http/https）校验，返回规范化 URL；`target="_blank"` 一律带 `rel="noopener noreferrer"`
- **CSP**：`app/layout.tsx` 用 `<meta http-equiv>` 输出 CSP（静态导出实测可渲染；`frame-ancestors` 在 meta 中无效故省略）；改脚本/资源加载来源时需同步检查 CSP 是否拦截
- **外部依赖与国内可达性**（2026-10-07 在本机国内网络实测，改动前先看这组数）：
  - 首屏**外部请求为 0**：字体经 `next/font` 构建期自托管到 `/_next/static/media`，`fonts.gstatic.com` 只在 CSP 里放过、运行时并不请求（那条 preconnect 已删，白开一条境外连接）
  - **字体是最大传输成本**：首页 95 请求 / 3.21 MB，其中字体 2.09 MB / 55 个文件（Sans JP 正文 1.36 MB、Serif SC 标题 0.70 MB）；文章页 184 请求 / 6.85 MB，其中字体 5.6 MB / 125 个文件。`display:swap` + `adjustFontFallback` 已保证不阻塞首屏与 CLS=0，代价只是带宽
  - **裁字重只省 CSS，不省字体下载**（实测）：去掉思源宋体 400 字重（原本只服务表格表头，已改 300）后，@font-face 规则 578→477、CSS 553 KB→462 KB（−16.4%，渲染阻塞资源变小），但产物字体文件仍是 291 个 / 12.35 MB —— CJK 切片是**可变字体**，同一文件服务多个字重（实测 225/251 个文件被 ≥2 个字重引用），删掉 400 的规则后那些文件仍被 200/300 用着，且无一个文件变成无人引用。**想真正减下载量，只能动「正文要不要用 CJK 网络字体」这一层**
  - **统计在国内失效**：`linternoka-blog.goatcounter.com` 被 DNS 解析到 `0.0.0.0`（国内封锁特征），上报必然失败。端点与开关已挪到 `site.config.json` 的 `analytics`，可关掉或指向自建实例
  - **评论默认不加载**：giscus.app 实测 TLS 1.6s / 首字节 1.7s，故 `GiscusComments` 改成点击后才 `dynamic` 引入（那之前不下载 JS、不发请求）
  - **GitHub Pages 可用但冷启动慢**：冷连接 TTFB ≈ 1.24s，热连接稳定 ≈ 0.50s。对照实测 Netlify 更慢（TTFB 1.66s），所以不要把主站迁到 Netlify
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
- 本地 push 需先启动 Clash Verge，再设 `$env:HTTPS_PROXY='http://127.0.0.1:7897'`
  - git 对 `https://` 远端只认 `HTTPS_PROXY` / `https_proxy`，写成 `HTTP_PROXY` **不生效**（2026-09-20 实测：只设 `HTTP_PROXY` 走直连并在 21s 后超时；只设 `HTTPS_PROXY` 才走代理）
  - 系统 GCM 已在 `~/.gitconfig` 用空 helper 覆盖，凭据走 `gh auth git-credential`
  - 代理不可用时，可用 `gh api` 经 `api.github.com` 建分支 / 提交 / 开 PR（实测比 git 直连稳定）

