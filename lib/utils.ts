/**
 * 仅允许 http/https 协议的外链，过滤 javascript: / data: / vbscript: 等危险协议防 XSS。
 * 友链、推荐作品等链接可能指向第三方，渲染前必须净化。
 * 不合法的输入返回 "#"，调用方据此不渲染外链。
 */
export function safeUrl(url: string | undefined): string {
  if (!url) return "#";
  try {
    const u = new URL(url, "https://invalid.local");
    return u.protocol === "http:" || u.protocol === "https:" ? url : "#";
  } catch {
    return "#";
  }
}

/**
 * 安全解码动态路由参数。Next.js 对中文等非 ASCII 参数会传入 URL 编码形式
 * （如 %E6%B5%8B...），而 generateStaticParams 返回的是未编码原文；
 * 统一解码后再匹配，畸形编码回退原值，避免抛错。
 */
export function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/** 格式化日期为中文长格式，如「2026 年 8 月 22 日」 */
export function formatDate(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** 相对日期，如「3 天前」 */
export function timeAgo(date: string): string {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 天前`;
  return formatDate(date);
}
