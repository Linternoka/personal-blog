import raw from "../site.config.json";

/**
 * 站点全局配置
 * basePath：当部署在 https://<user>.github.io/<repo>/ 子路径下时，填 "/<repo>"；部署在根路径时留空。
 * 也可以直接在构建时用环境变量 NEXT_PUBLIC_BASE_PATH 覆盖。
 */
export const siteConfig = {
  ...raw,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  nav: [
    { title: "首页", href: "/" },
    { title: "分类", href: "/categories" },
    { title: "标签", href: "/tags" },
    { title: "搜索", href: "/search" },
    { title: "推荐", href: "/works" },
    { title: "指南", href: "/guide" },
    { title: "关于", href: "/about" },
    { title: "友链", href: "/friends" },
  ] as { title: string; href: string }[],
  /**
   * Giscus 评论配置（https://giscus.app 获取）
   * 配置好 repo / repoId / categoryId 后把 enabled 设为 true 即可启用评论
   */
  giscus: {
    enabled: true,
    repo: "Linternoka/personal-blog", // 格式：owner/repo
    repoId: "R_kgDOUAZk1Q",
    category: "Announcements",
    categoryId: "DIC_kwDOUAZk1c4DEFeD",
    mapping: "pathname" as const,
    reactionsEnabled: "1" as const,
    inputPosition: "top" as const,
    lang: "zh-CN" as const,
    theme: "preferred_color_scheme" as const,
  },
};
