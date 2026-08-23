import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * robots.txt（Next.js 16 路由文件约定，静态导出自动生成到 out/robots.txt）。
 * sitemap 由 scripts/generate-static.mjs 生成到 public/sitemap.xml，这里声明其绝对 URL。
 */
const siteUrl = `${siteConfig.url}${siteConfig.basePath}`;

// 静态导出（output: "export"）要求路由显式声明为静态
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // 允许全站抓取，但不索引后台登录界面（/admin/，Decap CMS）
    rules: [{ userAgent: "*", allow: "/", disallow: "/admin/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
