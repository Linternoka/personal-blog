import type { Metadata } from "next";
import { getWorks, type WorkItem } from "@/lib/works";
import Reveal from "@/components/Reveal";
import EmptyState from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "推荐作品",
  description: "记录与分享值得一看的作品",
};

/** 单张推荐卡片：标题 / 类型 / 简介 / 链接（复用档案残片卡片设计） */
function WorkCard({ work }: { work: WorkItem }) {
  return (
    <a
      href={work.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-archive group flex h-full flex-col"
    >
      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-textsoft">
        <span className="pill">{work.type}</span>
        {work.author && (
          <>
            <span className="text-gold/60">/</span>
            <span className="tracking-widest">{work.author}</span>
          </>
        )}
        {work.date && (
          <>
            <span className="text-gold/60">/</span>
            <time className="tabular-nums tracking-wider">{work.date}</time>
          </>
        )}
      </div>

      <h2 className="kam-title text-xl leading-snug text-text transition-colors duration-500 group-hover:text-goldstrong sm:text-2xl">
        {work.title}
      </h2>

      {work.description && (
        <p className="mt-2 line-clamp-3 max-w-2xl text-sm leading-relaxed text-textsoft">
          {work.description}
        </p>
      )}

      <span className="kam-link mt-auto inline-flex items-center gap-1 pt-4 text-xs tracking-widest">
        查看 →
      </span>
    </a>
  );
}

export default function WorksPage() {
  const works = getWorks();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
      <div className="border-b border-line pb-6">
        <h1 className="kam-section-ja text-3xl">推荐作品</h1>
        <p className="mt-3 text-sm tracking-widest text-textsoft">
          记录与分享值得一看的作品
        </p>
      </div>

      {works.length === 0 ? (
        <EmptyState
          title="还没有推荐作品"
          hint="在 content/works.json 中逐条添加即可"
        />
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {works.map((work, i) => (
            <Reveal key={work.url + work.title} delay={Math.min(i, 6) * 70}>
              <WorkCard work={work} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
