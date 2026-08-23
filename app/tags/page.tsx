import Link from "next/link";
import type { Metadata } from "next";
import { getTagsWithCount } from "@/lib/posts";
import EmptyState from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "标签",
  description: "文章标签",
  alternates: { canonical: "/tags" },
  openGraph: { url: "/tags" },
};

export default function TagsPage() {
  const tags = getTagsWithCount();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <div className="border-b border-line pb-6">
        <h1 className="kam-section-ja text-3xl">标签</h1>
        <p className="mt-3 text-sm tracking-widest text-textsoft">
          共 {tags.length} 个标签
        </p>
      </div>

      {tags.length === 0 ? (
        <EmptyState title="还没有标签" />
      ) : (
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className="kam-link text-sm tracking-widest"
            >
              #{tag.name}
              <span className="ml-1.5 text-xs text-textsoft/70">
                {tag.count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
