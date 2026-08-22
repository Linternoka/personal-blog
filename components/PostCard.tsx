import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group border-b border-line py-7 transition-colors duration-300 hover:border-gold/40">
      <div className="mb-2 flex flex-wrap items-center gap-3 text-xs">
        <time dateTime={post.date} className="tabular-nums tracking-wider text-textsoft">
          {formatDate(post.date)}
        </time>
        <span className="text-gold/50">/</span>
        <Link
          href={`/categories/${encodeURIComponent(post.category)}`}
          className="tracking-widest text-textsoft transition-colors hover:text-goldstrong"
        >
          {post.category}
        </Link>
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
        <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-textsoft">
          {post.description}
        </p>
      )}
      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="text-xs tracking-widest text-textsoft/80 transition-colors hover:text-goldstrong"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
