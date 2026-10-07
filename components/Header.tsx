"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/lib/site";
import { Logo } from "./Logo";
import ThemeToggle from "./ThemeToggle";
import {
  CloseIcon,
  FolderIcon,
  GuideIcon,
  HomeIcon,
  InfoIcon,
  LibraryIcon,
  MenuIcon,
  SearchIcon,
  TagsIcon,
  UsersIcon,
} from "./icons";

/**
 * 移动端菜单的导航图标（按 href 映射）
 * 桌面端导航保持纯文字 + CSS "/" 前缀的终端风格，不加图标
 */
const navIcons: Record<string, (props: { className?: string }) => React.JSX.Element> = {
  "/": HomeIcon,
  "/categories": FolderIcon,
  "/tags": TagsIcon,
  "/search": SearchIcon,
  "/works": LibraryIcon,
  "/guide": GuideIcon,
  "/about": InfoIcon,
  "/friends": UsersIcon,
};

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/60 backdrop-blur-md">
      <div className="mx-auto flex h-28 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* 站标 + 站点名
            星轨 Logo（components/Logo.tsx）：线稿继承 currentColor，
            青绿强调用 var(--gold) 自动适配亮/暗色；持续慢速旋转（kam-spin）。
            站名下方为英文全称副标 Geniza Renovation Committee
            （Geniza 取希伯来语「藏经库」之意，呼应收录旧文献的「废书库修缮」主题） */}
        <Link
          href="/"
          className="kam-title group flex items-center gap-5 text-2xl tracking-[0.08em] text-text"
        >
          <Logo className="kam-spin h-20 w-20 shrink-0 text-gold sm:h-24 sm:w-24" />
          <span className="flex flex-col leading-none">
            <span className="transition-colors duration-500 group-hover:text-goldstrong">
              {siteConfig.name}
            </span>
            <span className="mt-2 text-sm font-normal tracking-[0.14em] text-text/75">
              Geniza R.C.
            </span>
          </span>
        </Link>

        {/* 桌面端导航 */}
        <nav className="hidden items-center gap-6 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`kam-nav-link kam-nav pb-0.5 text-sm ${
                isActive(item.href) ? "active" : "text-textsoft hover:text-text"
              }`}
            >
              {item.title}
            </Link>
          ))}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>

        {/* 移动端 */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="打开菜单"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center text-text transition-colors hover:text-gold"
          >
            {open ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {open && (
        <nav className="kam-menu-enter border-t border-line bg-bg px-4 py-3 md:hidden">
          {siteConfig.nav.map((item) => {
            const Icon = navIcons[item.href];
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`kam-nav flex items-center gap-3 border-b border-line/60 py-3 text-sm last:border-b-0 ${
                  active ? "text-text" : "text-textsoft"
                }`}
              >
                {Icon && (
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      active ? "text-gold" : "text-textsoft/70"
                    }`}
                  />
                )}
                {item.title}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
