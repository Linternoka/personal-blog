"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { siteConfig } from "@/lib/site";

/**
 * Giscus 评论组件
 * 在 site.config.json / lib/site.ts 中配置好 giscus 后，
 * 将 enabled 设为 true 即可启用。获取配置：https://giscus.app
 */
export default function GiscusComments() {
  const { giscus } = siteConfig;
  const { resolvedTheme } = useTheme();
  if (!giscus.enabled || !giscus.repo || !giscus.repoId || !giscus.categoryId) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-line pt-8">
      <h2 className="kam-title mb-4 text-lg text-text">评论</h2>
      <Giscus
        repo={giscus.repo as `${string}/${string}`}
        repoId={giscus.repoId}
        category={giscus.category}
        categoryId={giscus.categoryId}
        mapping={giscus.mapping}
        reactionsEnabled={giscus.reactionsEnabled}
        inputPosition={giscus.inputPosition}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        lang={giscus.lang}
      />
    </section>
  );
}
