"use client";

import { useEffect, useState } from "react";
import Toc, { type TocItem } from "./Toc";

/**
 * 文章目录侧边栏：固定左侧、默认隐藏，随页面滚动固定不动。
 * 形态参考 SCP 基金会「过氧化物（peroxide）」主题的侧边栏：
 * - 左侧固定 280px 抽屉，默认滑出屏幕外（隐藏）
 * - 点击左缘「目录」标签开合，Esc / 遮罩 / × 均可关闭
 */
export default function TocSidebar({ headings }: { headings: TocItem[] }) {
  const [open, setOpen] = useState(false);

  // Esc 关闭
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (headings.length === 0) return null;

  return (
    <>
      {/* 遮罩：小屏点击关闭 */}
      <div
        className={`toc-overlay lg:hidden ${open ? "is-open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* 固定左侧目录侧边栏（默认隐藏） */}
      <aside
        id="toc-sidebar"
        className={`toc-sidebar ${open ? "is-open" : ""}`}
        aria-label="文章目录"
        aria-hidden={!open}
      >
        <div className="toc-sidebar-head">
          <p className="toc-sidebar-title">目录</p>
          <button
            type="button"
            className="toc-close"
            onClick={() => setOpen(false)}
            aria-label="关闭目录"
          >
            ×
          </button>
        </div>
        <Toc headings={headings} hideTitle />
      </aside>

      {/* 左缘开合标签 */}
      <button
        type="button"
        className={`toc-toggle ${open ? "is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "关闭目录" : "打开目录"}
        aria-expanded={open}
        aria-controls="toc-sidebar"
      >
        目录
      </button>
    </>
  );
}
