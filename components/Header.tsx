"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/lib/site";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="kam-title flex items-center gap-3 text-lg font-black tracking-[0.3em] text-gold"
        >
          <span className="text-xl">🌸</span>
          <span>{siteConfig.name}</span>
        </Link>

        {/* 桌面端导航 */}
        <nav className="hidden items-center gap-2 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`kam-nav-link kam-nav rounded-sm px-3 py-2 text-sm ${
                isActive(item.href)
                  ? "active"
                  : "text-textsoft hover:text-cream"
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-gold transition-colors hover:bg-gold/10"
          >
            {open ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {open && (
        <nav className="border-t border-line bg-bgsoft px-4 py-3 md:hidden">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`kam-nav-link kam-nav block rounded-sm px-3 py-2.5 text-sm ${
                isActive(item.href)
                  ? "active"
                  : "text-textsoft hover:text-cream"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
