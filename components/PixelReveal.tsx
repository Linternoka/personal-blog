"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 文章封面：canvas 像素化揭示（自研，零第三方库）
 *
 * 原理：把封面画进一张与图片完全重叠的 canvas —— 起始只画很粗的像素块
 * （先把图缩到极小的离屏画布，再关掉平滑放大回原尺寸），随后逐级提高分辨率，
 * 最后淡出 canvas 露出底下的原图，观感像「信号逐级锁定」。
 *
 * 兜底与边界：
 * - 服务端渲染 / 无 JS：<img> 原样可见，canvas 始终为空（透明），不影响任何东西
 * - prefers-reduced-motion：直接不做动画，CSS 里也会把 canvas 隐藏
 * - 图片加载失败：整块不渲染，不留空白框与碎图标
 * - 每张封面只播一次（IntersectionObserver 触发后即 unobserve）
 * - canvas 按 object-fit: cover 同款裁切绘制，避免淡出瞬间画面跳动
 * - 只 drawImage、不读像素，因此跨域封面也不会污染 canvas
 */

/** 动画时长（ms） */
const DURATION = 1100;
/** 结束时每块的像素边长（8 ≈ 肉眼已看不出块感） */
const TARGET_BLOCK = 8;
/** 起始块数（越小越糊） */
const START_COLS = 4;
/** canvas 位图边长上限，防止大屏 + 高 DPR 下画布过大吃内存 */
const MAX_BITMAP = 2048;
/**
 * 像素阶梯档数：每档停一小段再跳下一档，观感是「逐级锁定」。
 * 不用连续插值——easeOut 会让最粗的那一段一闪而过（实测只停留约 100ms），
 * 阶梯式才能让「大像素块」这一档被看见。
 */
const STEPS = 7;

export default function PixelReveal({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 封面加载失败：整块不渲染
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const frameNode = frameRef.current;
    const imgNode = imgRef.current;
    const canvasNode = canvasRef.current;
    if (!frameNode || !imgNode || !canvasNode) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    let stopped = false;
    let started = false;

    async function run() {
      const frame = frameNode as HTMLDivElement;
      const img = imgNode as HTMLImageElement;
      const canvas = canvasNode as HTMLCanvasElement;

      // 等图片真正可用（lazy 加载的图可能刚触发下载）
      try {
        if (!img.complete) {
          await new Promise<void>((resolve, reject) => {
            const onLoad = () => resolve();
            const onError = () => reject(new Error("cover image failed"));
            img.addEventListener("load", onLoad, { once: true });
            img.addEventListener("error", onError, { once: true });
          });
        }
        await img.decode();
      } catch {
        return; // 图片不可用：交给 onError 卸载整块
      }
      if (stopped) return;

      const natW = img.naturalWidth;
      const natH = img.naturalHeight;
      const rect = frame.getBoundingClientRect();
      if (!natW || !natH || !rect.width || !rect.height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const shrink = Math.min(1, MAX_BITMAP / Math.max(rect.width, rect.height) / dpr);
      const bw = Math.max(1, Math.round(rect.width * dpr * shrink));
      const bh = Math.max(1, Math.round(rect.height * dpr * shrink));
      canvas.width = bw;
      canvas.height = bh;

      const ctx = canvas.getContext("2d");
      const off = document.createElement("canvas");
      const offCtx = off.getContext("2d");
      if (!ctx || !offCtx) return;

      // object-fit: cover 的居中裁切，和 <img> 的显示方式保持一致
      const cover = Math.max(bw / natW, bh / natH);
      const sw = bw / cover;
      const sh = bh / cover;
      const sx = (natW - sw) / 2;
      const sy = (natH - sh) / 2;

      const drawAt = (cols: number) => {
        const rows = Math.max(1, Math.round((cols * bh) / bw));
        off.width = cols;
        off.height = rows;
        offCtx.clearRect(0, 0, cols, rows);
        offCtx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, bw, bh);
        ctx.drawImage(off, 0, 0, cols, rows, 0, 0, bw, bh);
      };

      const maxCols = Math.max(START_COLS, Math.ceil(bw / TARGET_BLOCK));
      const t0 = performance.now();

      const tick = (now: number) => {
        if (stopped) return;
        const t = Math.min(1, (now - t0) / DURATION);
        // 阶梯 + 幂曲线：前几档块很大且停得久，后段快速收敛到清晰
        const step = Math.min(STEPS, Math.floor(t * STEPS) + 1);
        const e = Math.pow(step / STEPS, 1.6);
        drawAt(Math.round(START_COLS + (maxCols - START_COLS) * e));
        if (t < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          frame.classList.add("is-revealed");
        }
      };
      rafId = requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((e) => e.isIntersecting)) return;
        started = true;
        observer.unobserve(frameNode);
        void run();
      },
      { threshold: 0.25 }
    );
    observer.observe(frameNode);

    return () => {
      stopped = true;
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (failed) return null;

  return (
    <div ref={frameRef} className={`cover-frame ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
