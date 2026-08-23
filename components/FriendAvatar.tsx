"use client";

import { useState } from "react";
import { safeUrl } from "@/lib/utils";

/**
 * 友链头像：有 avatar 时显示图片（站内路径自动拼 basePath，外链过协议白名单），
 * 加载失败或没有 avatar 时回退到名字首字符。
 */
export default function FriendAvatar({
  name,
  avatar,
  basePath = "",
  className = "",
}: {
  name: string;
  avatar?: string;
  basePath?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  let src = "";
  if (avatar && !failed) {
    // 站内路径（/images/...）拼部署子路径；外链走协议白名单
    if (avatar.startsWith("/") && !avatar.startsWith("//")) {
      src = `${basePath}${avatar}`;
    } else {
      src = safeUrl(avatar);
    }
  }

  if (!src) {
    return (
      <div
        className={`kam-title flex h-11 w-11 shrink-0 items-center justify-center border border-line-strong text-base text-text ${className}`}
      >
        {name.slice(0, 1)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={44}
      height={44}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`h-11 w-11 shrink-0 rounded-full border border-line-strong object-cover ${className}`}
    />
  );
}
