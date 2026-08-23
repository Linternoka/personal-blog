import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate, safeDecode } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import GiscusComments from "@/components/GiscusComments";
import TocSidebar from "@/components/TocSidebar";
import CodeBlockEnhancer from "@/components/CodeBlockEnhancer";

export function generateStaticParams() {
  const posts = getAllPosts();
  // 暂无文章时返回哨兵值，避免静态导出因空数组报错；该页面会走 notFound
  if (posts.length === 0) return [{ slug: "__none__" }];
  return posts.map((post) => ({ slug: post.slug }));
}

/** 从渲染后的 HTML 提取 h2/h3 标题，用于目录 */
function extractHeadings(
  html: string
): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const re = /<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h\1>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const text = m[3].replace(/<[^>]*>/g, "").trim();
    if (text) headings.push({ id: m[2], text, level: Number(m[1]) });
  }
  return headings;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(safeDecode(slug));
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
  const post = getPostBySlug(safeDecode(slug));
  if (!post) notFound();

  const html = await renderMarkdown(post.content);
  const headings = extractHeadings(html);
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === post.slug);
  const prev = index > 0 ? posts[index - 1] : null;
  const next = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <CodeBlockEnhancer />
      <TocSidebar headings={headings} />
      <article className="mx-auto w-full max-w-3xl lg:max-w-4xl">
          {/* 文章头部（极简元数据） */}
          <header>
            <div className="flex flex-wrap items-center gap-3 text-sm text-textsoft">
              <time dateTime={post.date} className="tabular-nums tracking-wider">
                {formatDate(post.date)}
              </time>
              <span className="text-line-strong">/</span>
              <Link
                href={`/categories/${encodeURIComponent(post.category)}`}
                className="tracking-widest transition-colors hover:text-goldstrong"
              >
                {post.category}
              </Link>
              {post.updated && post.updated !== post.date && (
                <span className="text-xs text-textsoft/70">
                  更新于 {formatDate(post.updated)}
                </span>
              )}
            </div>
            <h1 className="kam-title mt-5 text-3xl leading-snug text-text sm:text-4xl">
              {post.title}
            </h1>
            {post.description && (
              <p className="mt-4 text-lg leading-relaxed text-textsoft">
                {post.description}
              </p>
            )}
            {post.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="pill"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
            <div className="mt-8 h-px w-full bg-gradient-to-r from-gold/60 via-line to-transparent" />
          </header>

          {/* 正文 */}
          <div
            className="prose prose-kam mx-auto mt-10"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>

      {/* 评论 / 上一篇下一篇 / 署名 */}
      <div className="mx-auto w-full max-w-3xl lg:max-w-4xl">
        <GiscusComments />

        <nav className="mt-12 grid border-t border-line pt-6 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/posts/${prev.slug}`}
            className="group py-2 pr-4"
          >
            <span className="text-xs tracking-widest text-gold">← 上一篇</span>
            <p className="kam-title mt-1.5 text-base leading-snug text-text transition-colors group-hover:text-goldstrong">
              {prev.title}
            </p>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next ? (
          <Link
            href={`/posts/${next.slug}`}
            className="group mt-4 border-t border-line py-2 pl-4 pt-4 text-right sm:mt-0 sm:border-t-0 sm:border-l sm:pt-2"
          >
            <span className="text-xs tracking-widest text-gold">下一篇 →</span>
            <p className="kam-title mt-1.5 text-base leading-snug text-text transition-colors group-hover:text-goldstrong">
              {next.title}
            </p>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
      </nav>

      {/* 站点署名 */}
      <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
        <div className="flex items-center gap-4">
          {siteConfig.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${siteConfig.basePath}${siteConfig.avatar}`}
              alt={siteConfig.author.name}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full border border-gold/60 object-cover"
            />
          ) : (
            <div className="kam-title flex h-11 w-11 items-center justify-center border border-gold/60 text-lg text-goldstrong">
              {siteConfig.author.name.slice(0, 1)}
            </div>
          )}
          <div>
            <p className="kam-title text-sm text-text">
              {siteConfig.author.name}
            </p>
            {siteConfig.author.bio && (
              <p className="mt-0.5 text-xs text-textsoft">
                {siteConfig.author.bio}
              </p>
            )}
          </div>
        </div>
          <Link href="/about" className="kam-link text-sm tracking-widest">
            关于
          </Link>
        </div>
      </div>
    </div>
  );
}
