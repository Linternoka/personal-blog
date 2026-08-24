"use client";

import { useEffect, useRef, useState } from "react";
import Toc, { type TocItem } from "./Toc";

/**
 * 文章目录侧边栏：固定左侧、默认隐藏，随页面滚动固定不动。
 * 形态参考 SCP 基金会「过氧化物（peroxide）」主题的侧边栏：
 * - 桌面端：鼠标移到左缘自动浮现，移出左侧区域自动隐藏
 *   （用 mousemove 坐标判断，比 mouseenter/leave 更稳，不会"闪一下"）
 * - 移动端：左下角按钮点击开合，遮罩 / × 关闭
 */
export default function TocSidebar({ headings }: { headings: TocItem[] }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);
  const isDesktop = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    isDesktop.current = mq.matches;
    const onChange = () => (isDesktop.current = mq.matches);
    mq.addEventListener("change", onChange);

    // 桌面端：按鼠标 X 坐标控制浮现 / 隐藏（左缘触发，移出侧边栏范围关闭）
    const onMove = (e: MouseEvent) => {
      if (!isDesktop.current) return;
      const x = e.clientX;
      if (x <= 20) {
        // 鼠标移到左缘热区 → 打开
        if (timer.current) window.clearTimeout(timer.current);
        setOpen(true);
      } else if (x > 300) {
        // 移出侧边栏范围 → 延迟关闭（留 20px 缓冲）
        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setOpen(false), 250);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      mq.removeEventListener("change", onChange);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

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
        className={`toc-overlay ${open ? "is-open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* 左缘触发标签（仅桌面端，视觉提示） */}
      <div className="toc-hotzone" aria-hidden="true">
        <span className="toc-hotzone-tab">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M8 6h13M8 12h13M8 18h13" />
            <path d="M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
        </span>
      </div>

      {/* 固定左侧目录侧边栏（默认隐藏，鼠标移入左缘浮现） */}
      <aside
        id="toc-sidebar"
        className={`toc-sidebar ${open ? "is-open" : ""}`}
        aria-label="文章目录"
        aria-hidden={!open}
      >
        <div className="toc-sidebar-head">
          <p className="toc-sidebar-title">INDEX</p>
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

      {/* 移动端：左下角开合按钮 */}
      <button
        type="button"
        className={`toc-toggle ${open ? "is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "关闭目录" : "打开目录"}
        aria-expanded={open}
        aria-controls="toc-sidebar"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="h-3 w-3"
        >
          <path d="M8 6h13M8 12h13M8 18h13" />
          <path d="M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
        TOC
      </button>
    </>
  );
}
