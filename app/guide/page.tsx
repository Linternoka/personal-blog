import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "使用与维护指南",
  description: `如何使用与维护 ${siteConfig.name}`,
};

const adminHref = "/admin/";

function Section({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-line py-10 last:border-b-0">
      <h2 className="kam-section-ja flex items-baseline gap-3 text-xl">
        <span className="text-sm tracking-widest text-gold">{num}</span>
        {title}
      </h2>
      <div className="mt-5 space-y-4 text-[15px] leading-7 text-text [&_strong]:font-medium">
        {children}
      </div>
    </section>
  );
}

export default function GuidePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <div className="border-b border-line pb-6">
        <h1 className="kam-section-ja text-3xl">使用与维护指南</h1>
        <p className="mt-3 text-sm tracking-widest text-textsoft">
          写文章、传图片、改配置、本地预览，都在这页说清楚
        </p>
      </div>

      <Section num="01" title="快速开始">
        <p>
          后台是个网页版编辑器，浏览器打开就能用，不用装任何软件。进去有两条路：
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>打开网站随便哪一页，滚到最底部，点「后台管理」。</li>
          <li>
            直接在地址栏输入{" "}
            <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">
              {siteConfig.url}
              {siteConfig.basePath}/admin/
            </code>
            。
          </li>
        </ol>
        <p>
          第一次进要用{" "}
          <Link href={adminHref} className="kam-link text-goldstrong">
            GitHub 账号登录
          </Link>
          。点登录后浏览器会弹授权窗口，选「Authorize」允许就行。之后每次打开后台都保持登录，不用再授权。
        </p>
        <p>
          如果登录弹窗被浏览器拦了，地址栏旁边会有提示，放行一次再点登录。
        </p>
      </Section>

      <Section num="02" title="写一篇文章">
        <p>
          登录后点左侧「文章」，再点右上角「新建文章」，会进入编辑页。字段都说明一下：
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>标题必填，会显示在文章列表和网址里。</li>
          <li>日期默认是今天，想改就改成过去的日期。</li>
          <li>
            摘要选填，是列表页的一句话简介。不填的话，网站会自动从正文开头截一段。
          </li>
          <li>
            分类只能在{" "}
            <span className="text-goldstrong">杂谈、评价、记录、其他</span>{" "}
            里选一个。想加新分类得动代码，见第五节。
          </li>
          <li>标签选填，可以填多个，用英文逗号隔开。</li>
          <li>草稿勾上后文章不会出现在网站上，适合写一半先存着。</li>
          <li>正文用 Markdown 写，标题、列表、代码块、公式、引用都支持。</li>
        </ul>
        <p>
          写完点右下角「保存」。保存后网站自动重新构建，一般一两分钟，
          新文章就出现在首页和对应分类里了。想删文章，在后台文章列表点「删除」再保存。
        </p>
      </Section>

      <Section num="03" title="上传图片">
        <p>
          正文编辑框里点工具栏的图片按钮，或者直接把图片拖进编辑框，
          选好文件就行。图片会存到网站的{" "}
          <code className="mx-1 rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">
            /images/
          </code>
          目录，正文里自动插入引用地址，保存后随文章一起发布。
        </p>
        <p className="text-textsoft">
          图片没有云存储，就是仓库里的普通文件。太大的图建议先压到 1MB 以内再传，
          不然仓库体积涨得很快。
        </p>
      </Section>

      <Section num="04" title="发布流程是怎么运转的">
        <p>这个站不买服务器，也不接数据库。整个流程是这样的：</p>
        <blockquote className="border-l-2 border-gold pl-4 text-textsoft">
          后台点「保存」→ 内容作为一次提交写进 GitHub 仓库 →
          GitHub Actions 自动重新构建 → 部署到 GitHub Pages，网站更新。
        </blockquote>
        <p>
          每次发布都是一次代码提交，历史全在 Git 里。改坏了也不怕，
          去仓库找到对应的提交，把文件恢复成旧版本再推送就行。
        </p>
      </Section>

      <Section num="05" title="高级维护（给想折腾的人）">
        <p>下面的操作要碰代码，建议先把仓库克隆到本地再做：</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            站点信息（站名、口号、头像、社交链接、导航）在根目录的{" "}
            <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">site.config.json</code>
            ，改完推 main 就生效。
          </li>
          <li>
            预设分类在{" "}
            <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">lib/posts.ts</code>{" "}
            的 <code>PRESET_CATEGORIES</code> 数组里，加一项就有新分类。
          </li>
          <li>
            推荐作品在{" "}
            <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">content/works.json</code>
            ，按「标题 / 类型 / 简介 / 链接」逐条加。
          </li>
          <li>
            外观配色、特效都写在{" "}
            <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">app/globals.css</code>
            ，全局颜色由 CSS 变量控制。
          </li>
          <li>
            本地预览：<code>npm install</code> 后跑{" "}
            <code>npm run dev</code>，浏览器打开本地地址，边改边看。
          </li>
          <li>
            手动构建：<code>npm run build</code>，产物在 <code>out/</code> 目录，
            推送到 <code>main</code> 分支就会自动上线。
          </li>
        </ul>
      </Section>

      <Section num="06" title="常见问题">
        <ul className="space-y-3">
          <li>
            <strong>后台登录没反应？</strong>
            <br />
            八成是弹窗被浏览器拦了，允许弹窗再试。一直失败就换个浏览器。
          </li>
          <li>
            <strong>保存了但网站没更新？</strong>
            <br />
            构建要一两分钟，别急着刷新。超过五分钟还没动静，去仓库的
            Actions 页看是不是构建失败了。
          </li>
          <li>
            <strong>分类里没有我要的？</strong>
            <br />
            现在固定四个分类（杂谈 / 评价 / 记录 / 其他），想加新的动代码，见第五节。
          </li>
          <li>
            <strong>想藏起一篇文章，又不想删？</strong>
            <br />
            编辑文章，勾「草稿」再保存就行，草稿不会发布。
          </li>
          <li>
            <strong>改坏了想恢复？</strong>
            <br />
            内容都在 Git 里。回仓库找到对应的提交，恢复成旧版本推上去。
          </li>
        </ul>
      </Section>
    </div>
  );
}
