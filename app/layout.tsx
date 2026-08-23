import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist_Mono, Noto_Sans_JP, Noto_Serif_SC } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FontWarm from "@/components/FontWarm";
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
  // 防外链 Referer 泄露本站完整 URL（友链/推荐作品点击后目标站只能看到根域名）
  referrer: "strict-origin-when-cross-origin",
  metadataBase: new URL(`${siteConfig.url}${siteConfig.basePath}`),
  alternates: {
    types: {
      "application/rss+xml": `${siteConfig.basePath}/rss.xml`,
    },
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    type: "website",
  },
};

// 注：未在此设置 Content-Security-Policy。
// - GitHub Pages 不允许自定义 HTTP header，无法注入 HTTP CSP；
// - Next.js 16 的 metadata API 不支持 httpEquiv（官方标记"Unsupported Metadata"），
//   JSX <meta httpEquiv> 在静态导出时会被 Next.js 过滤；
// - 残留 XSS 风险已通过 lib/markdown.ts 的 rehype-sanitize 消毒（默认 schema + className 白名单）阻断。
// 若未来部署平台支持自定义 header，建议改用 next.config.ts 的 headers() 输出 HTTP CSP。

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
      </head>
      <body className="flex min-h-full flex-col bg-bg text-text">
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
