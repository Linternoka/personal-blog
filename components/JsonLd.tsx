/**
 * JSON-LD 结构化数据输出组件（SEO）
 * 输出 <script type="application/ld+json">，供搜索引擎理解页面语义。
 * 用 JSON.stringify 后转义 "<" 防 "</script>" 注入破坏页面结构。
 */
export default function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
