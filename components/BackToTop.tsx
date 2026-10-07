"use client";

import { useSyncExternalStore } from "react";
import { ArrowUpIcon } from "./icons";

/** 滚过约一屏后才浮现，避免短页面也挂个按钮 */
const SHOW_AFTER = 600;

function subscribe(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  window.addEventListener("resize", onStoreChange);
  return () => {
    window.removeEventListener("scroll", onStoreChange);
    window.removeEventListener("resize", onStoreChange);
  };
}

// 快照返回布尔值：滚动过程中只有「跨过阈值」那一次才触发重渲染，
// 不做每帧 setState（与 ThemeToggle 同一套 useSyncExternalStore 写法，
// 也顺带规避 react-hooks 的 set-state-in-effect 规则）
const getSnapshot = () => window.scrollY > SHOW_AFTER;
// 服务端无滚动位置，一律视为不可见，避免 hydration 不一致
const getServerSnapshot = () => false;

/**
 * 回到顶部按钮：长文章 / 长列表的兜底出口。
 * 图标复用站点图标层（Lucide ArrowUp），显隐由 .back-to-top.is-visible 控制。
 */
export default function BackToTop() {
  const visible = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const toTop = () => {
    // 尊重系统「减弱动态效果」：关掉平滑滚动，直接跳回顶部
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      aria-label="回到顶部"
      title="回到顶部"
      onClick={toTop}
      className={`back-to-top ${visible ? "is-visible" : ""}`}
    >
      <ArrowUpIcon className="h-4 w-4" />
    </button>
  );
}
