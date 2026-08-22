"use client";

import Link from "next/link";
import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/lib/site";
import { formatDate } from "@/lib/utils";

interface SearchItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  content: string;
}

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${siteConfig.basePath}/search-index.json`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SearchItem[]) => {
        setItems(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: "title", weight: 0.5 },
          { name: "description", weight: 0.2 },
          { name: "tags", weight: 0.15 },
          { name: "category", weight: 0.1 },
          { name: "content", weight: 0.05 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [items]
  );

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return fuse.search(q).map((r) => r.item);
  }, [query, fuse]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="kam-title text-3xl font-black text-gold">搜索</h1>
      <p className="mt-2 text-sm tracking-widest text-textsoft">
        搜索博客中的文章、标签与内容
      </p>

      <div className="relative mt-6">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入关键词，回车或直接搜索…"
          className="w-full border border-line bg-bgsoft py-3 pl-12 pr-4 text-text outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
          autoFocus
        />
      </div>

      {!loaded && (
        <p className="mt-8 text-sm tracking-widest text-textsoft">索引加载中…</p>
      )}

      {loaded && query.trim() && results.length === 0 && (
        <p className="mt-8 text-textsoft">
          没有找到与「{query.trim()}」相关的文章喵~
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-6 flex flex-col gap-4">
          <p className="text-sm tracking-widest text-textsoft">
            共找到 {results.length} 篇相关文章
          </p>
          {results.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group relative border border-line bg-bgsoft p-5 transition-colors duration-300 hover:border-gold"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="border border-gold px-2 py-0.5 font-serif font-semibold tracking-widest text-gold">
                  {post.category}
                </span>
                <time dateTime={post.date} className="tracking-widest text-textsoft">
                  {formatDate(post.date)}
                </time>
              </div>
              <h2 className="kam-title mt-2 text-lg font-bold text-text transition-colors group-hover:text-goldstrong">
                {post.title}
              </h2>
              {post.description && (
                <p className="mt-1 line-clamp-2 text-sm text-textsoft">
                  {post.description}
                </p>
              )}
              {post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs tracking-widest text-gold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
