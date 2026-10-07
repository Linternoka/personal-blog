import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Geist_Mono, Noto_Sans_JP, Noto_Serif_SC } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import FontWarm from "@/components/FontWarm";
import JsonLd from "@/components/JsonLd";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// 标题衬线：Noto Serif SC（思源宋体，覆盖简体中文，极轻字重 200）
// 字重裁剪到 200/300 两个字重（标题 200、表格表头 300）；
// 原先还留着 400，但它只为「表格表头」一处服务，却要多背一整套 CJK 切片
// （构建产物体积 + 每页 CSS 里的 @font-face 规则），已去掉。
const notoSerifSc = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  subsets: ["latin"],
  weight: ["200", "300"],
  display: "swap",
  // adjustFontFallback=true 让 Next.js 内联 size-adjust / ascent-override metric override，
  // 浏览器立即用本地 fallback 字体布局，CLS=0，避免「自定义字体加载完 → 文字跳动」
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: true,
});

// 正文无衬线：Noto Sans JP（文书质感）
// 字重裁剪到 300/400 两个字重（全局正文用 font-weight: 300 / 400）；省下 4→2 字重
const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // favicon：public/favicon.svg（星轨 Logo 简化版），Next.js 自动拼部署子路径
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  // 防外链 Referer 泄露本站完整 URL（友链/推荐作品点击后目标站只能看到根域名）
  referrer: "strict-origin-when-cross-origin",
  metadataBase: new URL(`${siteConfig.url}${siteConfig.basePath}`),
  // canonical：指定每个页面的权威 URL，防止重复内容（?query、index.html 变体等）
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${siteConfig.basePath}/rss.xml`,
    },
  },
  // robots.txt 由 app/robots.ts 生成（Next.js 16 路由文件约定），
  // 其中声明 public/sitemap.xml（scripts/generate-static.mjs 构建时生成）
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    locale: "zh_CN",
    type: "website",
    // 分享图：scripts/generate-og.py 生成（1200×630）
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: siteConfig.name },
    ],
  },
  // Twitter 卡片：summary_large_image 显示大图
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/og.png"],
  },
};

// 站点绝对根地址（url + 部署子路径），JSON-LD 里要求绝对 URL
const siteUrl = `${siteConfig.url}${siteConfig.basePath}`;

// 统计上报端点：填了才拼进 CSP 的 connect-src，避免改了配置忘记同步 CSP 被拦
const analytics = siteConfig.analytics;
const analyticsEndpoint = analytics?.enabled ? analytics.endpoint : "";
let analyticsOrigin = "";
try {
  analyticsOrigin = analyticsEndpoint ? new URL(analyticsEndpoint).origin : "";
} catch {
  analyticsOrigin = "";
}

// 注：CSP 通过 <meta http-equiv> 输出（GitHub Pages 不支持自定义 HTTP header，
// 静态导出的产物在 out/*.html 中实测可正常渲染，Next.js 16 不过滤 httpEquiv）。
// - frame-ancestors 在 meta 中会被浏览器忽略（仅 header 生效），故未写入；
//   主站是纯静态内容无敏感操作，clickjacking 面有限，OAuth 代理已单独加 X-Frame-Options。
// - script-src 含 'unsafe-inline' 是静态导出 RSC 内联脚本的硬性要求，
//   残留 XSS 风险仍由 lib/markdown.ts 的 rehype-sanitize（默认 schema + className 白名单）阻断。
// - font-src 只留 'self' data:：字体已由 next/font 在构建期自托管到 /_next/static/media，
//   运行时不再有 Google Fonts 请求，实测首屏外部请求为 0（原先放行 fonts.gstatic.com 纯属多余）。
// - 若未来部署平台支持自定义 header，可改用 next.config.ts 的 headers() 输出更强 CSP（含 frame-ancestors）。
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  `connect-src 'self'${analyticsOrigin ? ` ${analyticsOrigin}` : ""}`,
  "frame-src https://giscus.app",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistMono.variable} ${notoSerifSc.variable} ${notoSansJp.variable} h-full antialiased`}
    >
      <head>
        {/* 这里曾有一条到 fonts.gstatic.com 的 preconnect。
            next/font 是构建期把字体文件自托管到 /_next/static/media，
            运行时并不会再向 Google 取字体，实测首屏外部请求为 0，
            所以那条 preconnect 只会白开一条到境外的 DNS/TCP/TLS 连接
            （实测该主机握手约 0.23s，国内网络下纯属浪费），已移除。 */}
        <meta httpEquiv="Content-Security-Policy" content={csp} />
      </head>
      <body className="flex min-h-full flex-col bg-bg text-text">
        {/* 访问统计（GoatCounter）：脚本本地托管（public/count.js，从 gc.zgo.at 下载），
            避免 gc.zgo.at CDN 在部分网络下不可达导致统计失效。
            next/script 不会给 public 文件自动拼 basePath，需用 siteConfig.basePath 显式拼接
            （部署子路径 /personal-blog 时即 /personal-blog/count.js）。
            端点与开关走 site.config.json 的 analytics，可在不改代码的前提下关闭或改指向。
            更新脚本：curl -o public/count.js https://gc.zgo.at/count.js */}
        {analyticsEndpoint && (
          <Script
            data-goatcounter={analyticsEndpoint}
            async
            src={`${siteConfig.basePath}/count.js`}
          />
        )}
        {/* SEO：WebSite 结构化数据（全站） */}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteConfig.name,
            alternateName: "Geniza",
            url: `${siteUrl}/`,
            description: siteConfig.description,
            inLanguage: "zh-CN",
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          {/* 回到顶部：滚过一屏才浮现（客户端组件，显隐见 globals.css .back-to-top） */}
          <BackToTop />
          <FontWarm />
        </ThemeProvider>
      </body>
    </html>
  );
}
