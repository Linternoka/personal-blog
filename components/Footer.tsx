import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-line bg-bgdeep">
      <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
        <div className="flex flex-col items-center gap-6">
          {/* 站点名 */}
          <Link
            href="/"
            className="kam-title text-2xl font-black tracking-[0.4em] text-gold"
          >
            {siteConfig.name}
          </Link>

          {/* 装饰分隔 */}
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="text-gold/80">❖</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60" />
          </div>

          <p className="max-w-md text-center text-sm leading-relaxed text-textsoft">
            {siteConfig.description}
          </p>

          {/* 社交按钮 */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {siteConfig.social.github && (
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="kam-btn px-6 py-2 text-xs"
              >
                GitHub
              </a>
            )}
            {siteConfig.social.twitter && (
              <a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="kam-btn px-6 py-2 text-xs"
              >
                Twitter
              </a>
            )}
            {siteConfig.social.email && (
              <a
                href={siteConfig.social.email}
                className="kam-btn px-6 py-2 text-xs"
              >
                邮箱
              </a>
            )}
            <Link href="/rss.xml" className="kam-btn px-6 py-2 text-xs" title="RSS 订阅">
              RSS
            </Link>
          </div>
        </div>
        <p className="mt-10 text-center text-xs tracking-[0.3em] text-textsoft">
          © {year} {siteConfig.author.name} · Powered by Next.js
        </p>
      </div>
    </footer>
  );
}
