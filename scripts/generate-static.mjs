/**
 * 构建前/开发脚本：生成 RSS 订阅文件与搜索索引
 * 输出到 public/ 目录，开发模式可直接访问；
 * `next build` 时 public/ 内容会自动复制到 out/ 随站点部署。
 * 在 `next build` 之前运行（见 package.json 的 build 脚本）。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { Feed } from "feed";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(root, "content", "posts");
const outDir = path.join(root, "public");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const site = JSON.parse(
  fs.readFileSync(path.join(root, "site.config.json"), "utf8")
);

function stripMarkdown(content) {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>#|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function safeDate(value, fallback) {
  const d = value ? new Date(value) : new Date();
  const fb = fallback || new Date();
  return Number.isNaN(d.getTime()) ? fb : d;
}

function readPosts() {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx?$/, ""),
        title: data.title || file,
        date: safeDate(data.date),
        updated: data.updated ? safeDate(data.updated) : undefined,
        description: data.description || "",
        category: data.category || "未分类",
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        draft: data.draft === true,
        content,
      };
    })
    .filter((post) => !post.draft)
    .sort((a, b) => b.date - a.date);
}

function main() {
  const posts = readPosts();
  fs.mkdirSync(outDir, { recursive: true });

  // ---- 生成 RSS ----
  const feed = new Feed({
    title: site.title,
    description: site.description,
    id: site.url,
    link: `${site.url}${basePath}`,
    language: "zh-CN",
    favicon: `${site.url}${basePath}/favicon.ico`,
    copyright: `Copyright © ${new Date().getFullYear()} ${site.author.name}`,
    author: {
      name: site.author.name,
      email: site.author.email,
      link: `${site.url}${basePath}`,
    },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${site.url}${basePath}/posts/${post.slug}/`,
      link: `${site.url}${basePath}/posts/${post.slug}/`,
      description: post.description,
      content: stripMarkdown(post.content).slice(0, 500),
      date: post.date,
      category: [{ name: post.category }],
    });
  }

  fs.writeFileSync(path.join(outDir, "rss.xml"), feed.rss2(), "utf8");

  // ---- 生成搜索索引 ----
  // 不存正文：Fuse.js 里 content 字段权重仅 0.05（title/desc/tags/category 权重合计 0.95），
  // 实际搜索效果几乎无差异，但能让索引体积从「全文 size 线性增长」降到「元数据 size」级别。
  // 若以后需要全文搜索，单独启用 search-index-full.json 即可（不带全文的索引继续保留给首屏）。
  const searchIndex = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    category: post.category,
    tags: post.tags,
    date: post.date.toISOString(),
  }));
  fs.writeFileSync(
    path.join(outDir, "search-index.json"),
    JSON.stringify(searchIndex),
    "utf8"
  );

  // ---- 生成 sitemap.xml ----
  const categories = [...new Set(posts.map((p) => p.category))];
  const tags = [...new Set(posts.flatMap((p) => p.tags))];
  const staticUrls = ["/", "/about/", "/friends/", "/search/", "/categories/", "/tags/"];
  const allUrls = [
    ...staticUrls,
    ...posts.map((p) => `/posts/${encodeURIComponent(p.slug)}/`),
    ...categories.map((c) => `/categories/${encodeURIComponent(c)}/`),
    ...tags.map((t) => `/tags/${encodeURIComponent(t)}/`),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls
    .map((u) => `  <url><loc>${site.url}${basePath}${u}</loc></url>`)
    .join("\n")}\n</urlset>\n`;
  fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap, "utf8");

  console.log(
    `✅ 已生成 rss.xml、sitemap.xml 与 search-index.json（共 ${posts.length} 篇文章）`
  );
}

main();
