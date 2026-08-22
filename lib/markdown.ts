import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

/**
 * 安全过滤 schema：
 * - 保留标题锚点 id（rehype-slug 生成）
 * - 所有元素额外允许 className（rehype-katex / rehype-highlight 的样式类，
 *   class 本身无脚本风险；默认 schema 的 * 通配不含 className，需显式补上）
 * - 默认 schema 已过滤 javascript:/vbscript: 等危险协议、事件属性与危险标签
 */
const sanitizeSchema = {
  ...defaultSchema,
  clobberPrefix: "",
  attributes: Object.fromEntries(
    Object.entries(defaultSchema.attributes ?? {}).map(([k, v]) => [
      k,
      [...v, "className"],
    ])
  ),
};

/** 将 Markdown/MDX 正文渲染为 HTML 字符串（已消毒，防 XSS） */
export async function renderMarkdown(content: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeKatex)
    .use(rehypeHighlight)
    .use(rehypeSanitize, sanitizeSchema)
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
