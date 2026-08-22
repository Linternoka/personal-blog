import Link from "next/link";
import { siteConfig } from "@/lib/site";
import ContactLink from "./ContactLink";
import {
  GitHubIcon,
  BilibiliIcon,
  BookIcon,
  StarIcon,
  ShieldIcon,
  MailIcon,
  RssIcon,
  EditIcon,
} from "./icons";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
        <div className="flex flex-col items-center gap-5">
          {/* 站点名 */}
          <Link
            href="/"
            className="kam-title text-xl font-bold tracking-[0.08em] text-goldstrong"
          >
            {siteConfig.name}
          </Link>

          <p className="max-w-md text-center text-sm leading-relaxed text-textsoft">
            {siteConfig.description}
          </p>

          {/* 社交链接 */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {siteConfig.social.github && (
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="kam-link flex items-center gap-1.5 text-xs tracking-widest"
              >
                <GitHubIcon className="h-3.5 w-3.5" />
                GitHub
              </a>
            )}
            {siteConfig.social.bilibili && (
              <a
                href={siteConfig.social.bilibili}
                target="_blank"
                rel="noopener noreferrer"
                className="kam-link flex items-center gap-1.5 text-xs tracking-widest"
              >
                <BilibiliIcon className="h-3.5 w-3.5" />
                Bilibili
              </a>
            )}
            {siteConfig.social.moegirl && (
              <a
                href={siteConfig.social.moegirl}
                target="_blank"
                rel="noopener noreferrer"
                className="kam-link flex items-center gap-1.5 text-xs tracking-widest"
              >
                <BookIcon className="h-3.5 w-3.5" />
                萌娘百科
              </a>
            )}
            {siteConfig.social.bangumi && (
              <a
                href={siteConfig.social.bangumi}
                target="_blank"
                rel="noopener noreferrer"
                className="kam-link flex items-center gap-1.5 text-xs tracking-widest"
              >
                <StarIcon className="h-3.5 w-3.5" />
                Bangumi
              </a>
            )}
            {siteConfig.social.scp && (
              <a
                href={siteConfig.social.scp}
                target="_blank"
                rel="noopener noreferrer"
                className="kam-link flex items-center gap-1.5 text-xs tracking-widest"
              >
                <ShieldIcon className="h-3.5 w-3.5" />
                SCP 基金会
              </a>
            )}
            {siteConfig.social.email && (
              <ContactLink
                email={siteConfig.social.email.replace(/^mailto:/, "")}
                className="kam-link flex items-center gap-1.5 text-xs tracking-widest"
                label="邮箱"
              />
            )}
            <Link
              href="/rss.xml"
              className="kam-link flex items-center gap-1.5 text-xs tracking-widest"
              title="RSS 订阅"
            >
              <RssIcon className="h-3.5 w-3.5" />
              RSS
            </Link>
          </div>
        </div>
        <p className="mt-10 text-center text-xs tracking-widest text-textsoft">
          © {year} {siteConfig.author.name} · Powered by Next.js
        </p>
        <p className="mt-3 text-center">
          <Link
            href="/admin/"
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
