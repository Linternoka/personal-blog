import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRESET_CATEGORIES, getCategoriesWithCount, getPostsByCategory } from "@/lib/posts";
import { safeDecode } from "@/lib/utils";
import PostCard from "@/components/PostCard";
import Reveal from "@/components/Reveal";
import EmptyState from "@/components/EmptyState";

export function generateStaticParams() {
  return getCategoriesWithCount().map((c) => ({ category: c.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const name = safeDecode(category);
  return {
    title: `分类：${name}`,
    description: `「${name}」分类下的文章`,
    alternates: { canonical: `/categories/${encodeURIComponent(name)}` },
    openGraph: { url: `/categories/${encodeURIComponent(name)}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const name = safeDecode(category);
  const posts = getPostsByCategory(name);
  const isPreset = PRESET_CATEGORIES.includes(name);

  // 非预设分类且无文章 → 404；预设分类允许空态展示
  if (posts.length === 0 && !isPreset) notFound();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <nav className="text-sm tracking-widest text-textsoft">
        <Link href="/categories" className="kam-link">
          分类
        </Link>
        <span className="mx-2 text-line-strong">/</span>
        <span className="text-text">{name}</span>
      </nav>
      <div className="mt-6 border-b border-line pb-6">
        <h1 className="kam-section-ja text-3xl">{name}</h1>
        <p className="mt-3 text-sm tracking-widest text-textsoft">
          共 {posts.length} 篇文章
        </p>
      </div>

      {posts.length === 0 ? (
        <EmptyState title="该分类下暂无文章" />
      ) : (
        <div className="mt-2 flex flex-col">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 90}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
