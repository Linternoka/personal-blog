import Link from "next/link";
import { getAllPosts, getCategoriesWithCount, getTagsWithCount } from "@/lib/posts";
import { siteConfig } from "@/lib/site";
import PostCard from "@/components/PostCard";
import Reveal from "@/components/Reveal";
import ContactLink from "@/components/ContactLink";

export default function HomePage() {
  const posts = getAllPosts();
  const categories = getCategoriesWithCount();
  const tags = getTagsWithCount();

  return (
    <>
      {/* ---------- Hero：留白开场 + 淡金氛围 ---------- */}
      <section className="kam-hero border-b border-line px-4 text-center">
        <div className="kam-hero-frame" />

        {/* 四角细线装饰（SVG） */}
        <svg className="absolute left-6 top-6 hidden h-6 w-6 text-gold/40 md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
          <path d="M1 9V1H9" />
        </svg>
        <svg className="absolute right-6 top-6 hidden h-6 w-6 text-gold/40 md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
          <path d="M15 1H23V9" />
        </svg>
        <svg className="absolute bottom-6 left-6 hidden h-6 w-6 text-gold/40 md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
          <path d="M1 15V23H9" />
        </svg>
        <svg className="absolute bottom-6 right-6 hidden h-6 w-6 text-gold/40 md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
          <path d="M15 23H23V15" />
        </svg>

        {/* 左右竖排文字（逐字闪入） */}
        <span className="kam-vertical absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 text-[11px] text-gold/60 md:block">
          {"记录 · 展示 · 分享".split("").map((ch, i) => (
            <span
              key={i}
              className="kam-char"
              style={{ animationDelay: `${0.6 + i * 0.07}s` }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
        <span className="kam-vertical absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 text-[11px] text-gold/60 md:block">
          {siteConfig.author.name.split("").map((ch, i) => (
            <span
              key={i}
              className="kam-char"
              style={{ animationDelay: `${0.6 + i * 0.07}s` }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center pb-16">
          {/* 小字英文标识 */}
          <p className="kam-fade-up mb-5 text-xs tracking-[0.3em] text-gold">
            PERSONAL BLOG
          </p>

          {/* 中央大字标题（逐字闪入 + glitch 信号闪现） */}
          <h1
            data-text={siteConfig.name}
            className="kam-hero-title kam-glitch text-5xl sm:text-7xl"
          >
            {siteConfig.name.split("").map((ch, i) => (
              <span
                key={i}
                className="kam-char"
                style={{ animationDelay: `${0.35 + i * 0.09}s` }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </h1>

          {/* 金色分隔：线 + 菱形 */}
          <div className="kam-fade-up kam-delay-2 my-8 flex items-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/70" />
            <svg viewBox="0 0 10 10" className="h-2 w-2 text-gold" aria-hidden="true">
              <path d="M5 0 10 5 5 10 0 5Z" fill="currentColor" />
            </svg>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/70" />
          </div>

          <p className="kam-fade-up kam-delay-3 mx-auto max-w-xl text-base leading-loose text-herofgs sm:text-lg">
            {siteConfig.description}
          </p>

          <div className="kam-fade-up kam-delay-4 mt-10 flex flex-wrap items-center justify-center gap-3">
            {siteConfig.social.github && (
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="kam-btn px-7 py-2.5 text-sm"
              >
                GitHub
              </a>
            )}
            {siteConfig.social.email && (
              <ContactLink
                email={siteConfig.social.email.replace(/^mailto:/, "")}
                className="kam-btn px-7 py-2.5 text-sm"
              />
            )}
            <Link href="/about" className="kam-btn px-7 py-2.5 text-sm">
              关于我
            </Link>
          </div>
        </div>

        {/* SCROLL 指示 */}
        <div className="kam-fade-up kam-delay-4 absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
          <span className="text-[10px] tracking-[0.35em] text-gold/70">SCROLL</span>
          <div className="kam-scroll" />
        </div>
      </section>

      {/* ---------- 内容区 ---------- */}
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        {/* 分类与标签概览 */}
        {(categories.length > 0 || tags.length > 0) && (
          <Reveal>
            <section className="mb-16">
              <div className="flex flex-col gap-6 border-y border-line py-6 sm:flex-row sm:items-start sm:justify-between">
                {categories.some((c) => c.count > 0) && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="kam-title mr-2 text-xs text-gold">分类</span>
                    {categories.filter((c) => c.count > 0).slice(0, 6).map((c) => (
                      <Link
                        key={c.name}
                        href={`/categories/${encodeURIComponent(c.name)}`}
                        className="px-1 py-0.5 text-xs tracking-widest text-textsoft transition-colors hover:text-goldstrong"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
                {tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="kam-title mr-2 text-xs text-gold">标签</span>
                    {tags.slice(0, 8).map((t) => (
                      <Link
                        key={t.name}
                        href={`/tags/${encodeURIComponent(t.name)}`}
                        className="kam-link text-xs tracking-widest"
                      >
                        #{t.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </Reveal>
        )}

        {/* 文章列表 */}
        <Reveal>
          <section>
            <div className="mb-8 flex items-end justify-between border-b border-line pb-4">
              <h2 className="kam-section-ja text-2xl">最新文章</h2>
              <Link
                href="/categories"
                className="kam-link text-sm tracking-widest"
              >
                查看全部
              </Link>
            </div>
            {posts.length === 0 ? (
              <div className="border border-dashed border-line p-12 text-center text-textsoft">
                还没有文章~ 去 <code className="rounded bg-bgdeep px-1.5 py-0.5">content/posts</code>{" "}
                目录添加第一篇吧！
              </div>
            ) : (
              <div className="flex flex-col">
                {posts.map((post, i) => (
                  <Reveal key={post.slug} delay={i * 90}>
                    <PostCard post={post} />
                  </Reveal>
                ))}
              </div>
            )}
          </section>
        </Reveal>
      </div>
    </>
  );
}
