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
        <p>
          {name} 是一个关于技术、生活与学习笔记的个人博客。这里会分享编程经验、
          踩坑记录、读书笔记，以及一些生活的碎碎念。
        </p>
        <h2>关于我</h2>
        <ul>
          <li>热爱写代码，也热爱生活</li>
          <li>喜欢把学到的东西记录下来，也分享给需要的人</li>
          <li>欢迎通过页面下方的联系方式与我交流</li>
        </ul>
        <h2>技术栈</h2>
        <p>
          本博客使用 Next.js、TypeScript 与 Tailwind CSS 构建，内容以 Markdown
          编写，部署在 GitHub Pages 上。
        </p>
        <blockquote>
          “记录是为了更好地思考，分享是为了更好地成长。”
        </blockquote>
      </div>
    </div>
  );
}
