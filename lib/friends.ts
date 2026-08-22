export interface Friend {
  name: string;
  url: string;
  description: string;
  avatar?: string;
}

/**
 * 仅允许 http/https 协议的外链，过滤 javascript: / data: 等危险协议防 XSS
 * （友链 url 可能来自他人，渲染前必须净化）
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

/** 友情链接列表，在这里增删改 */
export const friends: Friend[] = [];
