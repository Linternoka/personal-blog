import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

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
      <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row">
        {/* 头像 */}
        <div className="kam-title flex h-20 w-20 shrink-0 items-center justify-center border border-line-strong bg-bgsoft text-3xl text-text">
          {author.name.slice(0, 1)}
        </div>
        <div>
          <h2 className="kam-title text-xl font-bold text-text">
            {author.name}
          </h2>
          <p className="mt-1 text-textsoft">{author.bio}</p>
          <div className="mt-4 flex flex-wrap gap-5 text-sm">
            {siteConfig.social.github && (
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="kam-link tracking-widest"
              >
                GitHub
              </a>
            )}
            {siteConfig.social.email && (
              <a
                href={siteConfig.social.email}
                className="kam-link tracking-widest"
              >
                联系我
              </a>
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
