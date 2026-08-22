import type { Metadata } from "next";
import SearchClient from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "搜索",
  description: "搜索博客文章",
};

export default function SearchPage() {
  return <SearchClient />;
}
