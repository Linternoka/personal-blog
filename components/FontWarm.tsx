"use client";

import { useEffect } from "react";

/**
 * 字体预热：提前拉取标题（Noto Serif SC）常用汉字分片，
 * 缓解 CJK 按需分片加载导致标题文字粗细短暂的参差（FOUT）。
 * 无害：字体已加载时 load() 立即返回。
 */
export default function FontWarm() {
  useEffect(() => {
    try {
      const sample =
        "废书库修缮委员会记录展示分享测试文章我的个人博客分类标签友链关于搜索指南最新";
      document.fonts.load('200 16px "Noto Serif SC"', sample).catch(() => {});
    } catch {
      /* 忽略 */
    }
  }, []);
  return null;
}
