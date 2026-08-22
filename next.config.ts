import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出，用于部署到 GitHub Pages。
  // 仅在构建时（production）启用；开发模式下保持普通渲染，
  // 以规避 Next.js dev 对非 ASCII 动态参数（中文分类/标签）的已知检查问题。
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  images: { unoptimized: true },
  // 子路径部署支持（如 https://user.github.io/<repo>/），构建时由环境变量注入
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  trailingSlash: true,
};

export default nextConfig;
