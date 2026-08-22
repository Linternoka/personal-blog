import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoriesWithCount, getPostsByCategory } from "@/lib/posts";
import PostCard from "@/components/PostCard";

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

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

  if (posts.length === 0) notFound();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <nav className="text-sm tracking-widest text-textsoft">
        <Link href="/categories" className="kam-link">
          分类
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gold">{name}</span>
      </nav>
      <div className="kam-section mt-6">
        <span className="kam-section-en">Category</span>
        <h1 className="kam-section-ja text-3xl">
          <span className="kam-kakko">「</span>{name}<span className="kam-kakko">」</span>
        </h1>
      </div>
      <p className="mt-4 text-sm tracking-widest text-textsoft">
        共 {posts.length} 篇文章
      </p>

      <div className="mt-8 flex flex-col gap-5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
