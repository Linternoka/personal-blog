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
          从这里了解如何写作、上传图片与维护这个网站
        </p>
      </div>

      <Section num="01" title="快速开始">
        <p>
          网站的管理后台是一个网页版的编辑器，不需要安装任何软件。
          有两种方式进入：
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>打开网站任意页面，滚动到最底部，点击「后台管理」；</li>
          <li>或者直接在地址栏访问{" "}
            <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">
              {siteConfig.url}
              {siteConfig.basePath}/admin/
            </code>
            。
          </li>
        </ol>
        <p>
          第一次进入需要{" "}
          <Link href={adminHref} className="kam-link text-goldstrong">
            用 GitHub 账号登录
          </Link>
          。点击登录后会弹出 GitHub 的授权窗口，点「Authorize」允许即可。
          之后每次打开后台都会自动登录，不用重复授权。
        </p>
      </Section>

      <Section num="02" title="写一篇文章">
        <p>登录后，点击左侧「文章」，再点右上角「新建文章」，会进入编辑页。各字段说明：</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>标题</strong>：必填，会显示在文章列表和网址里；
          </li>
          <li>
            <strong>日期</strong>：默认是今天，可以手动改成过去的日期；
          </li>
          <li>
            <strong>摘要</strong>：选填，列表页展示的一句话简介，不填会自动截取正文开头；
          </li>
          <li>
            <strong>分类</strong>：只能填{" "}
            <span className="text-goldstrong">杂谈、评价、记录、其他</span>{" "}
            四个之一（想加新分类需要改代码，见「高级维护」）；
          </li>
          <li>
            <strong>标签</strong>：选填，可以填多个，用英文逗号分开；
          </li>
          <li>
            <strong>草稿</strong>：勾选后文章不会出现在网站上，适合写一半存着；
          </li>
          <li>
            <strong>正文</strong>：用 Markdown 语法写，支持标题、列表、代码块、公式、引用等。
          </li>
        </ul>
        <p>
          写完后点右下角「保存」。保存后约 1～2 分钟，网站会自动重新构建，
          新文章就会出现在首页和对应分类里。想删文章，在后台文章列表点「删除」并保存即可。
        </p>
      </Section>

      <Section num="03" title="上传图片">
        <p>
          在正文编辑框里点击工具栏的图片按钮（或直接拖拽图片进来），
          选择或上传图片文件即可。图片会自动存到网站的
          <code className="mx-1 rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">
            /images/
          </code>
          目录，正文里会插入引用地址，保存后图片随文章一起发布。
        </p>
        <p className="text-textsoft">
          小提示：网站上的图片没有云存储，就是存在仓库里的文件。大图建议先压缩到 1MB 以内，避免仓库体积增长过快。
        </p>
      </Section>

      <Section num="04" title="发布流程是怎么运转的">
        <p>整个网站不需要买服务器、不需要数据库，核心就一句话：</p>
        <blockquote className="border-l-2 border-gold pl-4 text-textsoft">
          你在后台点「保存」→ 内容作为一次提交写进 GitHub 仓库 →
          GitHub Actions 自动重新构建 → 部署到 GitHub Pages，网站更新。
        </blockquote>
        <p>
          所以每次发布本质上都是一次代码提交，所有历史版本都保存在 Git 里。
          万一改坏了，随时可以回滚到之前任何一版，不会丢东西。
        </p>
      </Section>

      <Section num="05" title="高级维护（给想折腾的人）">
        <p>下面的操作需要动代码，建议在电脑上把仓库克隆下来做：</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>改站点信息</strong>（站名、口号、头像、社交链接、导航）：
            编辑根目录的 <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">site.config.json</code>；
          </li>
          <li>
            <strong>新增预设分类</strong>：修改{" "}
            <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">lib/posts.ts</code>{" "}
            里的 <code>PRESET_CATEGORIES</code> 数组；
          </li>
          <li>
            <strong>管理推荐作品</strong>：编辑{" "}
            <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">content/works.json</code>，
            按「标题 / 类型 / 简介 / 链接」逐条添加即可，保存推送后自动上线；
          </li>
          <li>
            <strong>改外观配色/特效</strong>：全局样式都在{" "}
            <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">app/globals.css</code>；
          </li>
          <li>
            <strong>本地预览</strong>：<code>npm install</code> 后跑{" "}
            <code>npm run dev</code>，浏览器打开本地地址即可边改边看；
          </li>
          <li>
            <strong>手动构建</strong>：<code>npm run build</code>，产物在{" "}
            <code>out/</code> 目录，推送到 <code>main</code> 分支就会自动上线。
          </li>
        </ul>
      </Section>

      <Section num="06" title="常见问题">
        <ul className="space-y-3">
          <li>
            <strong>后台登录没反应 / 弹窗被浏览器拦截？</strong>
            <br />
            允许浏览器弹出窗口后重试；如果一直失败，换一个浏览器再试。
          </li>
          <li>
            <strong>保存了但网站没更新？</strong>
            <br />
            构建需要 1～2 分钟，稍等再刷新。若超过 5 分钟还没更新，去仓库的
            Actions 页看构建是否失败。
          </li>
          <li>
            <strong>分类里找不到我要的？</strong>
            <br />
            目前固定四个分类（杂谈 / 评价 / 记录 / 其他），想加新的按「高级维护」改代码。
          </li>
          <li>
            <strong>想让文章不在列表出现，又不删掉？</strong>
            <br />
            编辑文章，勾选「草稿」后保存即可，草稿不会发布。
          </li>
          <li>
            <strong>改坏了想恢复？</strong>
            <br />
            所有内容都在 Git 里，回到 GitHub 仓库找到对应的提交，把文件恢复成旧版本再推送即可。
          </li>
        </ul>
      </Section>
    </div>
  );
}
