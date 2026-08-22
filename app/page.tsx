import Link from "next/link";
import { getAllPosts, getCategoriesWithCount, getTagsWithCount } from "@/lib/posts";
import { siteConfig } from "@/lib/site";
import PostCard from "@/components/PostCard";

export default function HomePage() {
  const posts = getAllPosts();
  const categories = getCategoriesWithCount();
  const tags = getTagsWithCount();

  return (
    <>
      {/* ---------- 神椿 Hero ---------- */}
      <section className="relative flex min-h-[72vh] flex-col items-center justify-center overflow-hidden bg-ink px-4 text-center">
        {/* 金色光晕装饰 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(170,148,109,0.28), transparent 65%), radial-gradient(ellipse 60% 50% at 50% 110%, rgba(170,148,109,0.12), transparent 60%)",
          }}
        />
        {/* 顶部分隔线 */}
        <div className="absolute left-1/2 top-24 h-px w-24 -translate-x-1/2 bg-gold/50" />

        <p className="kam-title relative z-10 mb-5 text-xs tracking-[0.6em] text-gold sm:text-sm">
          MY · PERSONAL · BLOG
        </p>
        <h1 className="kam-title relative z-10 max-w-3xl text-4xl font-black leading-tight text-cream sm:text-6xl">
          {siteConfig.name}
        </h1>
        <p className="relative z-10 mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg">
          {siteConfig.description}
        </p>

        <div className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4">
          {siteConfig.social.github && (
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="kam-btn px-8 py-2.5 text-sm"
            >
              GitHub
            </a>
          )}
          {siteConfig.social.email && (
            <a
              href={siteConfig.social.email}
              className="kam-btn px-8 py-2.5 text-sm"
            >
              联系我
            </a>
          )}
          <Link href="/about" className="kam-btn px-8 py-2.5 text-sm">
            关于我
          </Link>
        </div>

        {/* SCROLL 指示 */}
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
          <span className="text-[10px] tracking-[0.4em] text-cream/50">SCROLL</span>
          <div className="kam-scroll" />
        </div>
      </section>

      {/* ---------- 内容区 ---------- */}
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
        {/* 分类与标签概览 */}
        {(categories.length > 0 || tags.length > 0) && (
          <section className="mb-12 flex flex-col gap-6 border-y border-line py-6 sm:flex-row sm:items-start sm:justify-between">
            {categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="kam-title mr-2 text-xs tracking-[0.3em] text-gold">
                  分类
                </span>
                {categories.slice(0, 6).map((c) => (
                  <Link
                    key={c.name}
                    href={`/categories/${encodeURIComponent(c.name)}`}
                    className="border border-line px-3 py-1 text-xs tracking-widest text-textsoft transition-colors hover:border-gold hover:text-gold"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="kam-title mr-2 text-xs tracking-[0.3em] text-gold">
                  标签
                </span>
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
          </section>
        )}

        {/* 文章列表 */}
        <section>
          <div className="mb-6 flex items-end justify-between border-b border-line pb-3">
            <h2 className="kam-title text-2xl font-black text-gold sm:text-3xl">
              最新文章
            </h2>
            <Link
              href="/categories"
              className="kam-link text-sm tracking-widest"
            >
              查看全部 →
            </Link>
          </div>
          {posts.length === 0 ? (
            <div className="border border-dashed border-line p-12 text-center text-textsoft">
              还没有文章喵~ 去 <code className="rounded bg-bgdeep px-1.5 py-0.5">content/posts</code>{" "}
              目录添加第一篇吧！
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
