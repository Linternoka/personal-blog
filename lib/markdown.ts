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

/**
 * rehype 插件：给站内图片（/ 开头的绝对路径）自动拼接部署子路径 basePath，
 * 使 markdown 里写 `/images/xxx.png` 在子路径部署下也能正确加载
 */
function rehypeBasePathImages() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!basePath) return () => undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const walk = (node: any) => {
      if (
        node.type === "element" &&
        node.tagName === "img" &&
        typeof node.properties?.src === "string"
      ) {
        const src = node.properties.src;
        if (src.startsWith("/") && !src.startsWith("//")) {
          node.properties.src = `${basePath}${src}`;
        }
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}

/**
 * rehype 插件：将顶层 table 包裹进 .table-scroll 容器，
 * 使窄屏（手机）上过宽的表格可以横向滚动而不撑破布局
 */
function rehypeWrapTables() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const walk = (node: any) => {
      if (node.type === "element" && Array.isArray(node.children)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.children = node.children.flatMap((child: any) => {
          if (child.type === "element" && child.tagName === "table") {
            return [
              {
                type: "element",
                tagName: "div",
                properties: { className: ["table-scroll"] },
                children: [child],
              },
            ];
          }
          return [child];
        });
        node.children.forEach(walk);
      }
    };
    walk(tree);
  };
}

/**
 * rehype 插件：把段落内软换行（\n）转为 <br>（GitHub 式硬换行），
 * 用于中日文分行对照——日文原文与中文翻译各占一行。
 * 注意：micromark 4 已移除 remarkParse 的 breaks 选项，需在此手动转换。
 */
function rehypeHardBreaks() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const walk = (node: any) => {
      if (
        (node.type === "element" || node.type === "root") &&
        Array.isArray(node.children)
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.children = node.children.flatMap((child: any) => {
          // 只处理含实际内容的文本节点：块级元素之间的纯换行文本（如 "\n"）跳过，
          // 避免在 <h2> 与 <p> 之间误插 <br>
          if (
            child.type === "text" &&
            child.value.trim() !== "" &&
            child.value.includes("\n")
          ) {
            const parts: string[] = child.value.split("\n");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const out: any[] = [];
            parts.forEach((part: string, i: number) => {
              if (part) out.push({ type: "text", value: part });
              if (i < parts.length - 1) {
                out.push({
                  type: "element",
                  tagName: "br",
                  properties: {},
                  children: [],
                });
              }
            });
            return out;
          }
          walk(child);
          return [child];
        });
      }
    };
    walk(tree);
  };
}

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
    .use(rehypeHardBreaks)
    .use(rehypeWrapTables)
    .use(rehypeBasePathImages)
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
