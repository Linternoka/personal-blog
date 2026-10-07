"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "./icons";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // 服务端快照返回 false，客户端挂载后返回 true，避免 hydration mismatch
  // （替代 useEffect + setState 的 mounted 模式，规避 set-state-in-effect）
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="切换主题"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center text-textsoft transition-colors hover:text-text"
    >
      {isDark ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
}
