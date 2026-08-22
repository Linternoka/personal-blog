import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import ContactLink from "@/components/ContactLink";
import {
  GitHubIcon,
  BilibiliIcon,
  BookIcon,
  StarIcon,
  ShieldIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "关于",
  description: `关于 ${siteConfig.name} 与 ${siteConfig.author.name}`,
};

export default function AboutPage() {
  const { author, name } = siteConfig;
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <div className="border-b border-line pb-6">
        <h1 className="kam-section-ja text-3xl">关于</h1>
      </div>
      <div className="mt-10 flex flex-col items-center text-center">
        {/* 头像 */}
        {siteConfig.avatar ? (
          <span className="rounded-full bg-bgsoft p-1.5 ring-1 ring-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${siteConfig.basePath}${siteConfig.avatar}`}
              alt={author.name}
              width={112}
              height={112}
              className="h-28 w-28 rounded-full object-cover"
            />
          </span>
        ) : (
          <div className="kam-title flex h-28 w-28 items-center justify-center rounded-full border border-line-strong bg-bgsoft text-5xl text-text">
            {author.name.slice(0, 1)}
          </div>
        )}
        <div className="mt-6">
          <h2 className="kam-title text-2xl font-bold text-text">
            {author.name}
          </h2>
          <p className="mt-2 text-textsoft">{author.bio}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
            {siteConfig.social.github && (
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="kam-link flex items-center gap-1.5 tracking-widest"
              >
                <GitHubIcon className="h-4 w-4" />
                GitHub
              </a>
            )}
            {siteConfig.social.bilibili && (
              <a
                href={siteConfig.social.bilibili}
                target="_blank"
                rel="noopener noreferrer"
                className="kam-link flex items-center gap-1.5 tracking-widest"
              >
                <BilibiliIcon className="h-4 w-4" />
                Bilibili
              </a>
            )}
            {siteConfig.social.moegirl && (
              <a
                href={siteConfig.social.moegirl}
                target="_blank"
                rel="noopener noreferrer"
                className="kam-link flex items-center gap-1.5 tracking-widest"
              >
                <BookIcon className="h-4 w-4" />
                萌娘百科
              </a>
            )}
            {siteConfig.social.bangumi && (
              <a
                href={siteConfig.social.bangumi}
                target="_blank"
                rel="noopener noreferrer"
                className="kam-link flex items-center gap-1.5 tracking-widest"
              >
                <StarIcon className="h-4 w-4" />
                Bangumi
              </a>
            )}
            {siteConfig.social.scp && (
              <a
                href={siteConfig.social.scp}
                target="_blank"
                rel="noopener noreferrer"
                className="kam-link flex items-center gap-1.5 tracking-widest"
              >
                <ShieldIcon className="h-4 w-4" />
                SCP 基金会
              </a>
            )}
            {siteConfig.social.email && (
              <ContactLink
                email={siteConfig.social.email.replace(/^mailto:/, "")}
                className="kam-link tracking-widest"
              />
            )}
          </div>
        </div>
      </div>

      <div className="prose prose-kam mt-10 max-w-none">
        <h2>关于这个博客</h2>
        <p>{name}，记录、展示、分享。</p>
        <h2>关于我</h2>
        <p>{author.bio}</p>
        <h2>技术栈</h2>
        <p>
          本博客使用 Next.js、TypeScript 与 Tailwind CSS 构建，内容以 Markdown
          编写，部署在 GitHub Pages 上。
        </p>
      </div>
    </div>
  );
}
