"use client";

import Link from "next/link";
import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import Reveal from "./Reveal";
import EmptyState from "./EmptyState";

interface SearchItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
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
      // content 字段已从搜索索引移除（见 scripts/generate-static.mjs）；
      // 这里若需要全文搜索，加 `name: "content", weight: 0.05` 并恢复索引生成即可
      new Fuse(items, {
        keys: [
          { name: "title", weight: 0.5 },
          { name: "description", weight: 0.2 },
          { name: "tags", weight: 0.15 },
          { name: "category", weight: 0.1 },
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
    <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6">
      <div className="border-b border-line pb-6">
        <h1 className="kam-section-ja text-3xl">搜索</h1>
        <p className="mt-3 text-sm tracking-widest text-textsoft">
          搜索博客中的文章、标签与内容
        </p>
      </div>

      <div className="relative mt-8">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-textsoft"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入关键词，回车或直接搜索…"
          className="w-full border-b border-line-strong bg-transparent py-3 pl-12 pr-4 text-text outline-none transition-colors focus:border-text"
          autoFocus
        />
      </div>

      {!loaded && (
        <p className="mt-8 text-sm tracking-widest text-textsoft">索引加载中…</p>
      )}

      {loaded && query.trim() && results.length === 0 && (
        <EmptyState title={`没有找到与「${query.trim()}」相关的文章`} />
      )}

      {results.length > 0 && (
        <div className="mt-6 flex flex-col">
          <p className="pb-2 text-sm tracking-widest text-textsoft">
            共找到 {results.length} 篇相关文章
          </p>
          {results.map((post, i) => (
            <Reveal key={post.slug} delay={Math.min(i, 6) * 70}>
              <Link
                href={`/posts/${post.slug}`}
                className="group block border-b border-line py-5 transition-colors duration-300 hover:border-gold/40"
              >
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <time dateTime={post.date} className="tabular-nums tracking-wider text-textsoft">
                  {formatDate(post.date)}
                </time>
                <span className="text-line-strong">/</span>
                <span className="tracking-widest text-textsoft">
                  {post.category}
                </span>
              </div>
              <h2 className="kam-title mt-2 text-lg text-text transition-colors group-hover:text-goldstrong">
                {post.title}
              </h2>
              {post.description && (
                <p className="mt-1 line-clamp-2 text-sm text-textsoft">
                  {post.description}
                </p>
              )}
              {post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs tracking-widest text-textsoft/80"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
