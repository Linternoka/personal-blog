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
          className="kam-title flex items-center gap-3 text-lg font-bold tracking-[0.08em] text-goldstrong"
        >
          {siteConfig.logo && (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bgsoft ring-1 ring-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${siteConfig.basePath}${siteConfig.logo}`}
                alt={siteConfig.name}
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            </span>
          )}
          <span>{siteConfig.name}</span>
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
        <nav className="border-t border-line bg-bg px-4 py-3 md:hidden">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`kam-nav block border-b border-line/60 py-3 text-sm last:border-b-0 ${
                isActive(item.href) ? "text-text" : "text-textsoft"
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
