import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTagsWithCount, getPostsByTag } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Reveal from "@/components/Reveal";

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export function generateStaticParams() {
  const tags = getTagsWithCount();
  // 暂无标签时返回哨兵值，避免静态导出因空数组报错；该页面会走 notFound
  if (tags.length === 0) return [{ tag: "__none__" }];
  return tags.map((t) => ({ tag: t.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const name = safeDecode(tag);
  return {
    title: `标签：${name}`,
    description: `标签「${name}」下的文章`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const name = safeDecode(tag);
  const posts = getPostsByTag(name);

  if (posts.length === 0) notFound();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <nav className="text-sm tracking-widest text-textsoft">
        <Link href="/tags" className="kam-link">
          标签
        </Link>
        <span className="mx-2 text-line-strong">/</span>
        <span className="text-text">#{name}</span>
      </nav>
      <div className="mt-6 border-b border-line pb-6">
        <h1 className="kam-section-ja text-3xl">#{name}</h1>
        <p className="mt-3 text-sm tracking-widest text-textsoft">
          共 {posts.length} 篇文章
        </p>
      </div>

      <div className="mt-2 flex flex-col">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 90}>
            <PostCard post={post} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
