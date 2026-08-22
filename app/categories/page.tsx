import Link from "next/link";
import type { Metadata } from "next";
import { getCategoriesWithCount } from "@/lib/posts";

export const metadata: Metadata = {
  title: "分类",
  description: "文章分类",
};

export default function CategoriesPage() {
  const categories = getCategoriesWithCount();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="kam-title text-3xl font-black text-gold">分类</h1>
      <p className="mt-2 text-sm tracking-widest text-textsoft">
        共 {categories.length} 个分类
      </p>

      {categories.length === 0 ? (
        <p className="mt-8 text-textsoft">还没有文章喵~</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/categories/${encodeURIComponent(category.name)}`}
              className="group flex items-center justify-between border border-line bg-bgsoft p-5 transition-colors duration-300 hover:border-gold"
            >
              <span className="kam-title text-lg font-bold text-text transition-colors group-hover:text-goldstrong">
                {category.name}
              </span>
              <span className="border border-gold px-2.5 py-0.5 text-xs tracking-widest text-gold">
                {category.count} 篇
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
