import Link from "next/link";
import { getAllPosts, getCategoriesWithCount, getTagsWithCount } from "@/lib/posts";
import { siteConfig } from "@/lib/site";
import PostCard from "@/components/PostCard";
import Reveal from "@/components/Reveal";

export default function HomePage() {
  const posts = getAllPosts();
  const categories = getCategoriesWithCount();
  const tags = getTagsWithCount();

  return (
    <>
      {/* ---------- 神椿 Hero：全屏大视觉 ---------- */}
      <section className="kam-hero px-4 text-center">
        <div className="kam-hero-frame" />

        {/* 左侧竖排文字 */}
        <span className="kam-vertical kam-fade-up kam-delay-1 absolute left-5 top-1/2 z-10 hidden -translate-y-1/2 text-[11px] text-gold/70 md:block">
          记录 · 分享 · 成长
        </span>
        {/* 右侧竖排文字 */}
        <span className="kam-vertical kam-fade-up kam-delay-1 absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 text-[11px] text-gold/70 md:block">
          {siteConfig.author.name}
        </span>

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
          {/* 小字英文标识 */}
          <p className="kam-fade-up mb-6 text-xs tracking-[0.6em] text-gold sm:text-sm">
            KAMITSUBAKI · PERSONAL · BLOG
          </p>

          {/* 中央大字标题（紧排 + glitch 特效，仿神椿） */}
          <h1
            data-text={siteConfig.name}
            className="kam-fade-up kam-delay-1 kam-hero-title kam-glitch text-5xl sm:text-7xl"
          >
            {siteConfig.name}
          </h1>

          {/* 装饰分隔 */}
          <div className="kam-fade-up kam-delay-2 my-8 flex items-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/70" />
            <span className="text-gold">❖</span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/70" />
          </div>

          <p className="kam-fade-up kam-delay-3 mx-auto max-w-xl text-base leading-loose text-herofgs sm:text-lg">
            {siteConfig.description}
          </p>

          <div className="kam-fade-up kam-delay-4 mt-10 flex flex-wrap items-center justify-center gap-4">
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
        </div>

        {/* SCROLL 指示 */}
        <div className="kam-fade-up kam-delay-4 absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
          <span className="text-[10px] tracking-[0.5em] text-herofgf">SCROLL</span>
          <div className="kam-scroll" />
        </div>
      </section>

      {/* ---------- 内容区 ---------- */}
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        {/* 分类与标签概览 */}
        {(categories.length > 0 || tags.length > 0) && (
          <Reveal>
            <section className="kam-section mb-16">
              <span className="kam-section-en">Category & Tag</span>
              <h2 className="kam-section-ja text-xl">分类与标签</h2>
              <div className="mt-6 flex flex-col gap-6 border-y border-line py-6 sm:flex-row sm:items-start sm:justify-between">
                {categories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="kam-title mr-2 text-xs tracking-[0.3em] text-gold">
                      <span className="kam-kakko">「</span>分类<span className="kam-kakko">」</span>
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
                      <span className="kam-kakko">「</span>标签<span className="kam-kakko">」</span>
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
              </div>
            </section>
          </Reveal>
        )}

        {/* 文章列表 */}
        <Reveal>
          <section className="kam-section">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <span className="kam-section-en">Recent Posts</span>
                <h2 className="kam-section-ja text-2xl">最新文章</h2>
              </div>
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
        </Reveal>
      </div>
    </>
  );
}
