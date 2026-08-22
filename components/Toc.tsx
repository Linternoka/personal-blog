"use client";

import { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * 文章目录：跟随滚动高亮当前章节，点击平滑滚动
 */
export default function Toc({
  headings,
  hideTitle = false,
}: {
  headings: TocItem[];
  hideTitle?: boolean;
}) {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (headings.length === 0) return;
    const onScroll = () => {
      let current = "";
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top <= 96) current = h.id;
      }
      setActive(current || headings[0]?.id || "");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="toc" aria-label="文章目录">
      {!hideTitle && (
        <p className="mb-3 text-xs tracking-[0.3em] text-gold">目录</p>
      )}
      <ul>
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={h.level >= 3 ? "toc-2" : ""}
              style={active === h.id ? { color: "var(--accent)", borderLeftColor: "var(--accent)" } : undefined}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
