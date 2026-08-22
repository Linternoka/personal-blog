import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  description: string;
  category: string;
  tags: string[];
  draft?: boolean;
  cover?: string;
}

export interface Post extends PostMeta {
  content: string;
}

/** 将 frontmatter 中的 tags 统一为字符串数组（兼容逗号分隔字符串） */
function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string")
    return value
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => file.replace(/\.mdx?$/, ""));
}

/** 将 frontmatter 日期安全转为 ISO 字符串（无效日期返回 fallback，避免构建崩溃） */
function safeIsoDate(value: unknown, fallback?: string): string | undefined {
  if (!value) return fallback;
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? fallback : d.toISOString();
}

export function getPostBySlug(slug: string): Post | null {
  const realSlug = slug.replace(/\.mdx?$/, "");
  // 安全校验：仅允许文件名字符（字母/数字/中文/下划线/连字符），防止路径穿越
  if (!/^[\w\u4e00-\u9fa5-]+$/.test(realSlug)) return null;
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  return {
    slug: realSlug,
    title: data.title || realSlug,
    date: safeIsoDate(data.date, "") ?? "",
    updated: safeIsoDate(data.updated, undefined),
    description: data.description || "",
    category: data.category || "未分类",
    tags: toArray(data.tags),
    draft: data.draft === true,
    cover: data.cover,
    content,
  };
}

/** 获取所有已发布文章，按日期倒序 */
export function getAllPosts(): Post[] {
  return getPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null && !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getTagsWithCount(): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) || 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/** 预设分类：即使暂无文章也始终显示在分类页 */
export const PRESET_CATEGORIES = ["杂谈", "评价", "记录", "其他"];

export function getCategoriesWithCount(): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const post of getAllPosts()) {
    const category = post.category || "未分类";
    map.set(category, (map.get(category) || 0) + 1);
  }
  // 预设分类始终存在（即使 0 篇）
  for (const c of PRESET_CATEGORIES) {
    if (!map.has(c)) map.set(c, 0);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh"));
}
