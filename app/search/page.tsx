import type { Metadata } from "next";
import SearchClient from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "搜索",
  description: "搜索博客文章",
  alternates: { canonical: "/search" },
  openGraph: { url: "/search" },
};

export default function SearchPage() {
  return <SearchClient />;
}
