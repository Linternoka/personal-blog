import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import GiscusComments from "@/components/GiscusComments";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      tags: post.tags,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const html = await renderMarkdown(post.content);
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === post.slug);
  const prev = index > 0 ? posts[index - 1] : null;
  const next = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null;

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      {/* 文章头部 */}
      <header>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link
            href={`/categories/${encodeURIComponent(post.category)}`}
            className="border border-gold px-2.5 py-1 font-serif font-semibold tracking-widest text-gold transition-colors hover:bg-gold hover:text-cream"
          >
            {post.category}
          </Link>
          <time
            dateTime={post.date}
            className="tracking-widest text-textsoft"
          >
            {formatDate(post.date)}
          </time>
          {post.updated && post.updated !== post.date && (
            <span className="text-xs text-textsoft/70">
              （更新于 {formatDate(post.updated)}）
            </span>
          )}
        </div>
        <h1 className="kam-title mt-5 text-3xl font-black leading-snug text-text sm:text-4xl">
          {post.title}
        </h1>
        {post.description && (
          <p className="mt-4 text-lg leading-relaxed text-textsoft">
            {post.description}
          </p>
        )}
        {post.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="kam-link text-sm tracking-widest"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* 正文 */}
      <div
        className="prose prose-kam mt-10 max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* 评论 */}
      <GiscusComments />

      {/* 上一篇 / 下一篇 */}
      <nav className="mt-12 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/posts/${prev.slug}`}
            className="group relative border border-line bg-bgsoft p-5 transition-colors duration-300 hover:border-gold"
          >
            <span className="text-xs tracking-widest text-gold">← 上一篇</span>
            <p className="kam-title mt-2 text-base font-semibold leading-snug text-text transition-colors group-hover:text-goldstrong">
              {prev.title}
            </p>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next ? (
          <Link
            href={`/posts/${next.slug}`}
            className="group relative border border-line bg-bgsoft p-5 text-right transition-colors duration-300 hover:border-gold"
          >
            <span className="text-xs tracking-widest text-gold">下一篇 →</span>
            <p className="kam-title mt-2 text-base font-semibold leading-snug text-text transition-colors group-hover:text-goldstrong">
              {next.title}
            </p>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
      </nav>

      {/* 站点署名 */}
      <div className="mt-10 flex items-center justify-between border border-line bg-bgsoft px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="kam-title flex h-11 w-11 items-center justify-center border border-gold text-lg text-gold">
            {siteConfig.author.name.slice(0, 1)}
          </div>
          <div>
            <p className="kam-title text-sm font-bold tracking-widest text-text">
              {siteConfig.author.name}
            </p>
            <p className="mt-0.5 text-xs text-textsoft">
              {siteConfig.author.bio}
            </p>
          </div>
        </div>
        <Link href="/about" className="kam-link text-sm tracking-widest">
          关于 →
        </Link>
      </div>
    </article>
  );
}
