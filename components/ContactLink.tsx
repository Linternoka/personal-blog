"use client";

import { useState } from "react";

/** 复制文本到剪贴板：优先 Clipboard API，失败降级 execCommand */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // 继续尝试降级方案
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/**
 * 联系邮箱按钮：点击复制邮箱地址（替代 mailto，兼容无邮件客户端环境）
 * 点击后显示「邮箱已复制」提示，2 秒后恢复
 */
export default function ContactLink({
  email,
  className = "",
  label = "联系我",
}: {
  email: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const ok = await copyText(email);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      // 最后兜底：提示邮箱文本供手动复制
      window.alert(`邮箱地址：${email}（可手动复制）`);
    }
  };

  return (
    <a
      href={`mailto:${email}`}
      onClick={handleClick}
      title={`复制邮箱 ${email}`}
      className={className}
    >
      {copied ? "邮箱已复制 ✓" : label}
    </a>
  );
}
