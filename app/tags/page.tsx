import Link from "next/link";
import type { Metadata } from "next";
import { getTagsWithCount } from "@/lib/posts";

export const metadata: Metadata = {
  title: "标签",
  description: "文章标签",
};

export default function TagsPage() {
  const tags = getTagsWithCount();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="kam-title text-3xl font-black text-gold">标签</h1>
      <p className="mt-2 text-sm tracking-widest text-textsoft">
        共 {tags.length} 个标签
      </p>

      {tags.length === 0 ? (
        <p className="mt-8 text-textsoft">还没有标签喵~</p>
      ) : (
        <div className="mt-8 flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className="group border border-line bg-bgsoft px-4 py-2 text-sm tracking-widest text-textsoft transition-colors duration-300 hover:border-gold hover:text-gold"
            >
              #{tag.name}
              <span className="ml-1.5 text-xs text-gold/70">
                {tag.count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
