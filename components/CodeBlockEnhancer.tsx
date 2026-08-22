"use client";

import { useEffect } from "react";

/**
 * 文章代码块增强：包一层带文件名与复制按钮的框架
 */
export default function CodeBlockEnhancer() {
  useEffect(() => {
    const container = document.querySelector(".prose-kam");
    if (!container) return;

    container.querySelectorAll("pre").forEach((pre) => {
      if (pre.closest(".code-frame")) return; // 已处理

      const wrapper = document.createElement("div");
      wrapper.className = "code-frame";
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const code = pre.querySelector("code");
      const lang = (code?.className || "").match(/language-([\w-]+)/)?.[1] || "text";

      const header = document.createElement("div");
      header.className = "code-frame-header";

      const name = document.createElement("span");
      name.textContent = lang;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-copy-btn";
      btn.textContent = "复制";
      btn.addEventListener("click", () => {
        const text = pre.innerText;
        const done = () => {
          btn.textContent = "已复制";
          btn.classList.add("copied");
          setTimeout(() => {
            btn.textContent = "复制";
            btn.classList.remove("copied");
          }, 1600);
        };
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
        } else {
          fallbackCopy(text, done);
        }
      });

      header.append(name, btn);
      wrapper.insertBefore(header, pre);
    });
  }, []);

  return null;
}

function fallbackCopy(text: string, done: () => void) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    done();
  } catch {
    /* 忽略 */
  }
  document.body.removeChild(ta);
}
