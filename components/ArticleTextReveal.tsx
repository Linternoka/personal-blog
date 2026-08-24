"use client";

import { useEffect } from "react";

/**
 * 文章正文「赛博故障解码」（JS 驱动）：
 * 随页面下滑，文字一进入视口底部就立即开始解码——字符先显示乱码故障
 * （片假名碎片 + 汉字部件，青绿 + RGB 分离样式），闪烁后变成正文，
 * 严格从上到下扫描。
 *
 * 跟手设计：解码由「视口位置」驱动而非固定速度排队——字符进入视口即启动
 * 约 220ms 的解码动画，滚动到哪、哪的文字就加载到哪，视口内绝大部分
 * 始终是清晰正文，只有底部边缘是正在解码的乱码条带。
 *
 * 安全性：
 * - 无 JS 环境下正文始终完全可见（拆字/乱码只发生在 JS 运行时，SSR 输出原样 HTML）
 * - prefers-reduced-motion 时直接跳过，文字保持清晰
 * - 只处理正文容器的直接子级块级元素；代码块与 KaTeX 公式不拆分
 */

/** 参与效果的块级元素（正文容器的直接子级） */
const BLOCK_TAGS = new Set([
  "P",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "UL",
  "OL",
  "BLOCKQUOTE",
  "PRE",
  "FIGURE",
  "TABLE",
  "DIV",
]);

/**
 * 单个字符的解码曲线（阶梯保持，[进度 0-1, 透明度]）：
 * 乱码暗 → 乱码闪亮 → 闪灭 → 正文闪亮 → 稳定清晰
 */
const CHAR_FLASH: Array<[number, number]> = [
  [0, 0.15],
  [0.25, 1],
  [0.5, 0.1],
  [0.7, 1],
  [1, 1],
];
/** 在该进度把乱码切换为真实字符（最后一次闪亮时） */
const REVEAL_AT = 0.7;
/** 单个字符解码时长（ms） */
const CHAR_DURATION = 220;
/** 同一批进入视口的字符间错开（ms），保证行内逐个闪烁 */
const ROW_INTERVAL = 6;

/** 赛博故障乱码池：片假名碎片 + 汉字部件（全角）/ 符号（半角） */
const GLITCH_WIDE = [
  "ｱ",
  "ｲ",
  "ｳ",
  "ｴ",
  "ｵ",
  "ｶ",
  "ﾅ",
  "ﾆ",
  "ﾊ",
  "ﾋ",
  "ﾒ",
  "ﾔ",
  "ﾜ",
  "ヵ",
  "ヶ",
  "亻",
  "彳",
  "丷",
  "乂",
  "爻",
  "冂",
  "匚",
  "廾",
  "灬",
  "攵",
  "卄",
];
const GLITCH_NARROW = [
  "#",
  "@",
  "%",
  "&",
  "*",
  "+",
  "x",
  "z",
  "0",
  "8",
  "$",
  "?",
  "/",
  "\\",
  "|",
];

/** 判断是否为全角宽字符（中文/假名/全角标点/谚文/CJK 扩展） */
function isWideChar(ch: string): boolean {
  const code = ch.codePointAt(0) ?? 0;
  return (
    (code >= 0x2e80 && code <= 0x9fff) ||
    (code >= 0xac00 && code <= 0xd7af) ||
    (code >= 0xff00 && code <= 0xffef) ||
    (code >= 0x20000 && code <= 0x2ffff)
  );
}

function pick<T>(arr: T[]): T {
  return arr[(Math.random() * arr.length) | 0];
}

/** 生成乱码占位：空白保持空白，宽字符用全角乱码，窄字符用半角乱码 */
function randomGlitch(real: string): string {
  if (/\s/.test(real)) return real;
  return isWideChar(real) ? pick(GLITCH_WIDE) : pick(GLITCH_NARROW);
}

export default function ArticleTextReveal({
  containerId = "article-content",
}: {
  containerId?: string;
}) {
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 系统开启减弱动态效果：文字保持清晰可见
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const blocks = Array.from(container.children).filter((el) =>
      BLOCK_TAGS.has(el.tagName)
    ) as HTMLElement[];
    if (blocks.length === 0) return;

    // 进入视口前：整块半透明（加载中）
    blocks.forEach((el) => {
      el.style.opacity = "0.3";
    });

    // 已拆字符池（按文档顺序）与动画状态
    const chars: HTMLElement[] = [];
    const active = new Set<HTMLElement>();
    const startAt = new Map<HTMLElement, number>();
    let idx = 0;
    let rafId = 0;
    let running = false;

    const tick = (now: number) => {
      // 视口底部：字符滚到此处立即启动解码
      const scanY = window.scrollY + window.innerHeight;

      // 1) 启动刚进入视口的字符：同一行（y 相同）按行内序号短间隔错开，
      //    不同行同步解码——整屏 400ms 内完成，滚动跟手
      const pending: HTMLElement[] = [];
      for (const c of chars) {
        if (c.dataset.done === "1") continue; // 已完成，不再启动
        if (active.has(c)) continue;
        if (+(c.dataset.y ?? "0") <= scanY) {
          pending.push(c);
        }
      }
      if (pending.length > 0) {
        const byY = new Map<number, HTMLElement[]>();
        for (const c of pending) {
          const y = +(c.dataset.y ?? "0");
          const list = byY.get(y) ?? [];
          list.push(c);
          byY.set(y, list);
        }
        for (const line of byY.values()) {
          line.sort((a, b) => +(a.dataset.idx ?? "0") - +(b.dataset.idx ?? "0"));
          line.forEach((c, i) => {
            startAt.set(c, now + i * ROW_INTERVAL);
            active.add(c);
          });
        }
      }

      // 2) 驱动解码动画
      for (const c of Array.from(active)) {
        const t0 = startAt.get(c)!;
        const k = (now - t0) / CHAR_DURATION;
        if (k >= 1) {
          finishChar(c);
          active.delete(c);
          startAt.delete(c);
        } else {
          animateChar(c, k);
        }
      }

      // 无进行中的动画、且视口内无待解码字符 → 暂停循环（静止时零开销）
      if (active.size === 0) {
        let hasPending = false;
        for (const c of chars) {
          if (c.dataset.done !== "1" && +(c.dataset.y ?? "0") <= scanY) {
            hasPending = true;
            break;
          }
        }
        if (!hasPending) {
          running = false;
          cancelAnimationFrame(rafId);
          return;
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };
    start();

    const observer = new IntersectionObserver(
      (entries) => {
        // 同批进入视口的块按纵向位置从上到下排序，确保解码顺序
        const entering = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => {
            const ra = a.target.getBoundingClientRect().top;
            const rb = b.target.getBoundingClientRect().top;
            return ra - rb;
          });
        entering.forEach((entry) => {
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          // 块恢复清晰，随后拆字成乱码并注册到扫描线
          el.style.removeProperty("opacity");
          const newChars = splitToChars(el);
          newChars.forEach((c) => {
            c.dataset.idx = String(idx++);
            chars.push(c);
          });
          // 有新字符入队 → 确保解码循环在跑
          if (newChars.length > 0) start();
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -10px 0px" }
    );

    blocks.forEach((el) => observer.observe(el));

    // 滚动时重启循环（新字符进入视口）；被动监听不影响滚动性能
    window.addEventListener("scroll", start, { passive: true });
    // 兜底：scroll 事件缺失/被吞的环境，轮询检测滚动位置变化
    let pollLastY = window.scrollY;
    const poll = window.setInterval(() => {
      if (Math.abs(window.scrollY - pollLastY) > 0.5) {
        pollLastY = window.scrollY;
        start();
      }
    }, 1000);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", start);
      window.clearInterval(poll);
      cancelAnimationFrame(rafId);
    };
  }, [containerId]);

  return null;
}

/**
 * 把块内文本拆成单字符 span（保留行内结构；跳过代码块与 KaTeX 公式）。
 * 每个 span 记录文档纵坐标 data-y（用于视口驱动），显示乱码占位，
 * 真实字符存于 data-real，初始半透明。返回按文档顺序排列的字符 span。
 */
function splitToChars(root: HTMLElement): HTMLElement[] {
  const chars: HTMLElement[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node: Node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      // 代码块 / 公式保持原样，不逐字拆分
      if (parent.closest("pre") || parent.closest(".katex")) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) textNodes.push(n as Text);

  textNodes.forEach((node) => {
    const text = node.textContent ?? "";
    if (!text) return;
    // 文本节点的文档纵坐标（同一行字符 y 相同）
    let y = 0;
    try {
      const range = document.createRange();
      range.selectNodeContents(node);
      y = range.getBoundingClientRect().top + window.scrollY;
    } catch {
      y = root.getBoundingClientRect().top + window.scrollY;
    }
    const frag = document.createDocumentFragment();
    for (const ch of text) {
      const span = document.createElement("span");
      span.className = "kam-char";
      span.dataset.real = ch;
      span.dataset.y = String(y);
      // 少量字符（约 1/8）带故障色点缀（品红/青绿），其余保持正文色
      if (Math.random() < 0.12) {
        span.dataset.tint = Math.random() < 0.5 ? "magenta" : "cyan";
      }
      span.textContent = randomGlitch(ch);
      span.style.opacity = "0.15";
      chars.push(span);
      frag.appendChild(span);
    }
    node.parentNode?.replaceChild(frag, node);
  });
  return chars;
}

/** 解码进行中的字符：阶梯透明度闪烁 + 乱码持续扰动 + 故障样式 */
function animateChar(el: HTMLElement, k: number) {
  el.style.opacity = String(stepInterpolate(CHAR_FLASH, k));
  el.classList.add("glitching");
  if (el.dataset.tint === "magenta") {
    el.classList.add("glitch-magenta");
  } else if (el.dataset.tint === "cyan") {
    el.classList.add("glitch-cyan");
  }
  if (k < REVEAL_AT) {
    el.textContent = randomGlitch(el.dataset.real ?? " ");
  }
}

/** 解码完成：正文亮起并清除动画痕迹，标记 done 防止再次启动 */
function finishChar(el: HTMLElement) {
  el.textContent = el.dataset.real ?? "";
  el.style.removeProperty("opacity");
  el.classList.remove("glitching", "glitch-magenta", "glitch-cyan");
  el.dataset.done = "1";
}

/**
 * 阶梯插值：在区间内保持起点值，到区间边界瞬间跳变到下一值。
 * 与线性插值不同——不产生平滑过渡，制造「闪烁」的突变感。
 */
function stepInterpolate(frames: Array<[number, number]>, t: number): number {
  for (let i = 0; i < frames.length - 1; i++) {
    const [t0, v0] = frames[i];
    const [t1] = frames[i + 1];
    if (t >= t0 && t < t1) return v0;
  }
  return frames[frames.length - 1][1];
}
