import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

/** 将 Markdown/MDX 正文渲染为 HTML 字符串 */
export async function renderMarkdown(content: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeKatex)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content);
  return String(file);
}

/** 将 Markdown 文本粗略转为纯文本（用于搜索索引 / 摘要） */
export function stripMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, " ") // 代码块
    .replace(/`([^`]*)`/g, "$1") // 行内代码
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // 链接
    .replace(/^#{1,6}\s+/gm, "") // 标题
    .replace(/[*_~>#|]/g, " ") // 标记符号
    .replace(/\s+/g, " ")
    .trim();
}
