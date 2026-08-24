import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Geist_Mono, Noto_Sans_JP, Noto_Serif_SC } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
// 字重裁剪到 200/300/400 三个字重（实际用到：标题 200、导航 300、表格 th 400）；
// 500/600/700 完全未使用，省下 6→3 字重 ≈ 50% Noto Serif SC 体积
const notoSerifSc = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  subsets: ["latin"],
  weight: ["200", "300", "400"],
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

// 注：CSP 通过 <meta http-equiv> 输出（GitHub Pages 不支持自定义 HTTP header，
// 静态导出的产物在 out/*.html 中实测可正常渲染，Next.js 16 不过滤 httpEquiv）。
// - frame-ancestors 在 meta 中会被浏览器忽略（仅 header 生效），故未写入；
//   主站是纯静态内容无敏感操作，clickjacking 面有限，OAuth 代理已单独加 X-Frame-Options。
// - script-src 含 'unsafe-inline' 是静态导出 RSC 内联脚本的硬性要求，
//   残留 XSS 风险仍由 lib/markdown.ts 的 rehype-sanitize（默认 schema + className 白名单）阻断。
// - 若未来部署平台支持自定义 header，可改用 next.config.ts 的 headers() 输出更强 CSP（含 frame-ancestors）。

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistMono.variable} ${notoSerifSc.variable} ${notoSansJp.variable} h-full antialiased`}
    >
      <head>
        {/* DNS+TCP+TLS 预热：Google Fonts 字体二进制实际从 fonts.gstatic.com 下载，
            在 <head> 提前建立连接能把首字渲染的 RTT 节省 100-300ms。
            preconnect 必须排在任何资源请求之前——Next.js 16 自动加在 <head> 前面部分 */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* CSP：default-src 等限制资源来源（script-src 含 unsafe-inline 为 RSC 内联脚本所需）；
            frame-ancestors 在 meta 中无效已省略；giscus 未启用但预留 frame-src */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' https://gc.zgo.at; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://linternoka-blog.goatcounter.com; frame-src https://giscus.app; base-uri 'self'; form-action 'self'; object-src 'none'"
        />
      </head>
      <body className="flex min-h-full flex-col bg-bg text-text">
        <Script
          data-goatcounter="https://linternoka-blog.goatcounter.com/count"
          async
          src="https://gc.zgo.at/count.js"
        />
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
          <FontWarm />
        </ThemeProvider>
      </body>
    </html>
  );
}
