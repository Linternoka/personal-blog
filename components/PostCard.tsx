import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="card-archive group h-full">
      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-textsoft">
        <time dateTime={post.date} className="tabular-nums tracking-wider">
          {formatDate(post.date)}
        </time>
        <span className="text-gold/60">/</span>
        <Link
          href={`/categories/${encodeURIComponent(post.category)}`}
          className="tracking-widest transition-colors hover:text-goldstrong"
        >
          {post.category}
        </Link>
      </div>
      <h2 className="kam-title text-xl leading-snug sm:text-2xl">
        <Link
          href={`/posts/${post.slug}`}
          className="text-text transition-colors duration-500 group-hover:text-goldstrong"
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
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="pill"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
