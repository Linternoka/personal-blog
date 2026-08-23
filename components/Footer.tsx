import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Logo } from "./Logo";
import { RssIcon, EditIcon } from "./icons";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto w-full max-w-5xl px-4 pb-[calc(env(safe-area-inset-bottom)+3.5rem)] pt-14 sm:px-6">
        <div className="flex flex-col items-center gap-5">
          {/* 站标 + 站点名（竖排居中，Logo 用青绿强调色与 Header 呼应） */}
          <Link
            href="/"
            className="kam-title flex flex-col items-center gap-3 text-xl tracking-[0.08em] text-goldstrong"
          >
            <Logo className="h-24 w-24 text-goldstrong" />
            {siteConfig.name}
          </Link>

          <p className="max-w-md text-center text-sm leading-relaxed text-textsoft">
            {siteConfig.description}
          </p>
        </div>

        {/* 版权行：订阅 / 关于（社交链接已移至「关于」页） / 版权 */}
        <p className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-xs tracking-widest text-textsoft">
          {/* rss.xml 是静态文件不是页面路由，禁用 RSC 预取避免 404 噪音 */}
          <Link
            href="/rss.xml"
            prefetch={false}
            className="kam-link flex items-center gap-1.5"
            title="RSS 订阅"
          >
            <RssIcon className="h-3.5 w-3.5" />
            RSS 订阅
          </Link>
          <span className="text-line-strong">/</span>
          <Link href="/about" className="kam-link">
            关于
          </Link>
          <span className="text-line-strong">/</span>
          <span>
            © {year} {siteConfig.author.name} · Powered by Next.js
          </span>
        </p>

        <p className="mt-5 text-center">
          {/* /admin/ 是独立静态应用不是页面路由，禁用 RSC 预取避免 404 噪音 */}
          <Link
            href="/admin/"
            prefetch={false}
            className="kam-link inline-flex items-center gap-1 text-xs tracking-widest text-textsoft/80 transition-colors hover:text-gold"
            title="进入图形化内容管理后台（Decap CMS）"
          >
            <EditIcon className="h-3 w-3" />
            后台管理
          </Link>
        </p>
      </div>
    </footer>
  );
}
