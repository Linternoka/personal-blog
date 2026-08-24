"use client";

import { useEffect, useRef } from "react";

/**
 * 阅读进度计：参照 SCP-CN-4001《传汐引潮》的侧边高度计样式——
 * 固定在页面右侧垂直居中：小号英文标签 + 大号百分比数字。
 * 随滚动从 0% 平滑变化到 100%（lerp 缓动，计数器式变化），青绿发光。
 * rAF 循环驱动，不依赖 scroll 事件。
 */
export default function ReadingProgress() {
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const num = numRef.current;
    if (!num) return;
    let shown = 0; // 当前显示的平滑值
    let target = 0; // 实际滚动进度（%）
    // 缓存总滚动范围：scrollHeight 读取会强制 reflow，避免每帧读取；
    // 由低频轮询定期刷新，兼顾「进度均匀准确」与「滚动流畅不卡」
    let total = document.documentElement.scrollHeight - window.innerHeight;
    let rafId = 0;
    let running = false;
    let lastScrollY = window.scrollY;

    const refreshTotal = () => {
      total = document.documentElement.scrollHeight - window.innerHeight;
    };

    const tick = () => {
      const scrollY = window.scrollY;
      // 线性进度 = scrollY / total（均匀）；底部容差 2px 兜底 100%
      const pct =
        total - scrollY <= 2
          ? 100
          : total > 0
            ? Math.min(100, Math.max(0, (scrollY / total) * 100))
            : 0;
      target = pct;
      // 缓动逼近：滚动中数字平滑增减，停下后迅速归位
      shown += (target - shown) * 0.18;
      if (Math.abs(target - shown) < 0.08) shown = target;
      const txt = `${Math.round(shown)}%`;
      if (num.textContent !== txt) num.textContent = txt;
      // 数字已收敛且滚动停止 → 暂停循环（静止时零 rAF 开销）
      if (
        Math.abs(target - shown) < 0.08 &&
        Math.abs(scrollY - lastScrollY) < 0.5
      ) {
        running = false;
        cancelAnimationFrame(rafId);
        return;
      }
      lastScrollY = scrollY;
      rafId = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("resize", refreshTotal);
    window.addEventListener("load", refreshTotal);
    // 滚动时重启循环（被动监听，不影响滚动性能）
    window.addEventListener("scroll", start, { passive: true });
    // 兜底低频轮询：刷新 total + 覆盖 scroll 事件缺失/被吞的环境
    let pollLastY = window.scrollY;
    const poll = window.setInterval(() => {
      refreshTotal();
      if (Math.abs(window.scrollY - pollLastY) > 0.5) {
        pollLastY = window.scrollY;
        start();
      }
    }, 1000);

    start();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", refreshTotal);
      window.removeEventListener("load", refreshTotal);
      window.removeEventListener("scroll", start);
      window.clearInterval(poll);
    };
  }, []);

  return (
    <div className="reading-progress-side" aria-hidden="true">
      <span className="reading-side-label">PROGRESS</span>
      <span className="reading-side-num" ref={numRef}>
        0%
      </span>
    </div>
  );
}
