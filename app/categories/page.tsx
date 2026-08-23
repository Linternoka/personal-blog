import Link from "next/link";
import type { Metadata } from "next";
import { getCategoriesWithCount } from "@/lib/posts";
import Reveal from "@/components/Reveal";
import EmptyState from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "分类",
  description: "文章分类",
  alternates: { canonical: "/categories" },
  openGraph: { url: "/categories" },
};

export default function CategoriesPage() {
  const categories = getCategoriesWithCount();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <div className="border-b border-line pb-6">
        <h1 className="kam-section-ja text-3xl">分类</h1>
        <p className="mt-3 text-sm tracking-widest text-textsoft">
          共 {categories.length} 个分类
        </p>
      </div>

      {categories.length === 0 ? (
        <EmptyState title="还没有文章" />
      ) : (
        <div className="mt-2">
          {categories.map((category, i) => (
            <Reveal key={category.name} delay={i * 70}>
              <Link
                href={`/categories/${encodeURIComponent(category.name)}`}
                className="group flex items-center justify-between border-b border-line py-5 transition-colors duration-300 hover:border-gold/40"
              >
                <span className="kam-title text-lg text-text transition-colors group-hover:text-goldstrong">
                  {category.name}
                </span>
                <span className="text-xs tabular-nums tracking-widest text-textsoft">
                  {category.count} 篇
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
