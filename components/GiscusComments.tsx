"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useTheme } from "next-themes";
import { siteConfig } from "@/lib/site";

/**
 * Giscus 评论组件（点击后再加载）
 *
 * 为什么默认不直接加载：giscus 是第三方 iframe，实测在国内网络下
 * TLS 握手约 1.6s、首字节约 1.7s，文章页一打开就去拉它会明显拖慢阅读。
 * 所以改成「先只渲染一个按钮」，用户真想评论时再点 —— 在那之前
 * 既不下载 @giscus/react 的 JS，也不发任何到 giscus.app 的请求。
 *
 * 配置见 site.config.json / lib/site.ts：giscus.enabled 设为 true 即启用。
 * 获取配置：https://giscus.app
 */

// 点开之后才去下载 @giscus/react（约 32KB），并跳过 SSR
const Giscus = dynamic(() => import("@giscus/react"), {
  ssr: false,
  loading: () => (
    <p className="text-sm tracking-widest text-textsoft">评论加载中…</p>
  ),
});

export default function GiscusComments() {
  const { giscus } = siteConfig;
  const { resolvedTheme } = useTheme();
  const [opened, setOpened] = useState(false);

  if (!giscus.enabled || !giscus.repo || !giscus.repoId || !giscus.categoryId) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-line pt-8">
      <h2 className="kam-title mb-4 text-lg text-text">评论</h2>

      {opened ? (
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
      ) : (
        <div className="flex flex-col items-start gap-3 border border-line bg-bgsoft px-5 py-4">
          <p className="text-sm leading-relaxed text-textsoft">
            评论由 Giscus 提供，内容存放在 GitHub。点开才会加载它——
            网络访问 GitHub 较慢时，这样不会拖慢文章本身的打开速度。
          </p>
          <button
            type="button"
            onClick={() => setOpened(true)}
            className="kam-btn px-5 py-2 text-sm"
          >
            加载评论
          </button>
        </div>
      )}
    </section>
  );
}
