import Link from "next/link";
import { getAllPosts, getCategoriesWithCount, getTagsWithCount } from "@/lib/posts";
import { siteConfig } from "@/lib/site";
import PostCard from "@/components/PostCard";
import Reveal from "@/components/Reveal";
import ContactLink from "@/components/ContactLink";
import EmptyState from "@/components/EmptyState";

export default function HomePage() {
  const posts = getAllPosts();
  const categories = getCategoriesWithCount();
  const tags = getTagsWithCount();

  return (
    <>
      {/* ---------- Hero：现代编辑风，全屏留白 ---------- */}
      <section className="kam-hero px-4 text-center">
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center pb-16 pt-12">
          {/* 中央大字标题（极轻字重） */}
          <h1 className="kam-hero-title text-4xl leading-tight sm:text-6xl lg:text-7xl">
            {siteConfig.name}
          </h1>

          {/* 说明：标明这是个人博客，避免标题让人一头雾水 */}
          <p className="kam-fade-up kam-delay-1 mt-6 text-base leading-loose text-herofgs sm:text-lg">
            这里是 {siteConfig.author.name} 的个人博客，记录、展示、分享。
          </p>

          {/* 分隔：细线 + 圆点 */}
          <div className="kam-fade-up kam-delay-2 my-8 flex items-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60" />
          </div>

          <div className="kam-fade-up kam-delay-3 mt-2 flex flex-wrap items-center justify-center gap-3">
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

          {/* 落点小字（杂志版权行，克制填充） */}
          <p className="kam-fade-up kam-delay-4 mt-16 flex items-center gap-3 text-[11px] tracking-[0.35em] text-herofgf">
            <span className="h-px w-8 bg-current opacity-30" />
            ✎ 写代码，也写生活 · SINCE 2026
            <span className="h-px w-8 bg-current opacity-30" />
          </p>
        </div>
      </section>

      {/* ---------- 内容区 ---------- */}
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
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
              <EmptyState title="还没有文章" hint="去 content/posts 目录添加第一篇吧" />
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
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
