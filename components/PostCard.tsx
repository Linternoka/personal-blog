import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group relative border border-line bg-bgsoft p-6 transition-all duration-300 hover:border-gold hover:bg-bgsoft/70 sm:p-8">
      {/* 左侧金色装饰条 */}
      <span className="absolute left-0 top-0 h-full w-[3px] scale-y-0 bg-gold transition-transform duration-300 group-hover:scale-y-100" />
      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs">
        <Link
          href={`/categories/${encodeURIComponent(post.category)}`}
          className="border border-gold px-2 py-0.5 font-serif font-semibold tracking-widest text-gold transition-colors hover:bg-gold hover:text-cream"
        >
          {post.category}
        </Link>
        <time
          dateTime={post.date}
          className="tracking-widest text-textsoft"
        >
          {formatDate(post.date)}
        </time>
      </div>
      <h2 className="kam-title text-xl leading-snug sm:text-2xl">
        <Link
          href={`/posts/${post.slug}`}
          className="text-text transition-colors duration-300 group-hover:text-goldstrong"
        >
          {post.title}
        </Link>
      </h2>
      {post.description && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-textsoft">
          {post.description}
        </p>
      )}
      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="kam-link text-xs tracking-widest"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
