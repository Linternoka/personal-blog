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
          写文章、传图片、加推荐、换友链、改配置，都在这页说清楚
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
            里选一个。想加新分类得动代码，见第十节。
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

      <Section num="04" title="添加推荐作品">
        <p>
          「推荐」页放的是你认可的作品，轻小说、音乐、游戏、项目都可以。
          数据存在仓库的{" "}
          <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">
            content/works.json
          </code>
          ，后台里改不了，得直接编辑这个文件。
        </p>
        <p>每条作品长这样：</p>
        <pre className="overflow-x-auto rounded border border-line bg-bgsoft p-4 text-sm leading-6">
{`{
  "title": "作品标题",
  "type": "轻小说",
  "description": "一句话简介",
  "url": "https://example.com",
  "author": "作者（可选）",
  "date": "2026-08-22（可选）"
}`}
        </pre>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <code>title</code>、<code>type</code>、<code>description</code>、{" "}
            <code>url</code> 必填，其余可选。
          </li>
          <li>
            <code>type</code> 随便填，显示成标签，比如项目、文章、视频、音乐、游戏、书。
          </li>
          <li>
            <code>url</code> 只认 http/https，别的协议会被过滤掉，链接不会渲染。
          </li>
        </ul>
        <p>在数组末尾加一组，保存文件推上去就行。编辑方法见第六节。</p>
      </Section>

      <Section num="05" title="添加友链">
        <p>
          友链列表写在代码文件{" "}
          <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">
            lib/friends.ts
          </code>{" "}
          的 <code>friends</code> 数组里，同样要直接改文件。一条友链四个字段：
        </p>
        <pre className="overflow-x-auto rounded border border-line bg-bgsoft p-4 text-sm leading-6">
{`{
  name: "站点名",
  url: "https://example.com",
  description: "一句话介绍",
  avatar: "/images/friend.png" // 可选，头像
}`}
        </pre>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <code>avatar</code> 可填站内路径（<code>/images/...</code>），
            也可以填外链地址。不填就用站点名首字符代替。
          </li>
          <li>
            <code>url</code> 只认 http/https，不安全的协议会被过滤。
          </li>
        </ul>
        <p>
          一般流程是对方先挂上你的站，再通过邮箱联系你，你确认后把对方加进来，
          互相挂上链接。联系方式见「关于」页。
        </p>
      </Section>

      <Section num="06" title="非图形化编辑（直接写文件）">
        <p>
          不想开后台、要批量改、或者想写长文的时候，直接改仓库里的文件更顺手。
          文章就是{" "}
          <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">
            content/posts/
          </code>{" "}
          下的 .mdx 文件，文件名就是网址里的那段（slug）。
        </p>
        <p>文件开头是 frontmatter，用三条横线包起来，字段如下：</p>
        <pre className="overflow-x-auto rounded border border-line bg-bgsoft p-4 text-sm leading-6">
{`---
title: "标题"
date: "2026-08-22"
updated: "2026-08-23"      # 可选，更新日期
description: "摘要"
category: "杂谈"           # 杂谈 / 评价 / 记录 / 其他
tags: [记录, 其他]
draft: false               # true 则不发布
cover: "/images/xxx.png"   # 可选，封面图
---

正文，用 Markdown 写。`}
        </pre>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            文件名建议用简短英文或中文，别带空格和 <code>#</code>、<code>?</code>{" "}
            这类符号。
          </li>
          <li>
            正文支持标题、列表、表格、代码块、行内代码、引用、图片、KaTeX 公式。
            图片写 <code>/images/xxx.png</code> 这样的站内路径，部署时会自动拼上子路径。
          </li>
          <li>
            改完保存，用 git 提交推送到 <code>main</code> 分支，构建会自动跑。
            本地没有环境的话，直接在 GitHub 网页上也能编辑和提交。
          </li>
        </ul>
        <p>
          想先在本地看效果，装好 Node.js 后跑{" "}
          <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm">
            npm install
          </code>{" "}
          再跑{" "}
          <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm">npm run dev</code>
          ，浏览器打开本地地址就能预览。注意 Windows 上要用{" "}
          <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm">
            cmd /c &quot;npm run dev&quot;
          </code>{" "}
          这种方式跑。
        </p>
        <p className="text-textsoft">
          一个提醒：如果后台和本地都在改，两边会各自产生提交。推代码前先拉取合并，
          别直接覆盖，不然后台那边的新文章可能丢。
        </p>
      </Section>

      <Section num="07" title="网站是怎么搭起来的">
        <p>
          这个站不买服务器，也不接数据库。代码和内容都在同一个 Git 仓库里，
          构建时把全部页面生成成静态文件，丢到 GitHub Pages 上。
          访问者看到的就是一堆 HTML，快，也不用维护机器。
        </p>
        <p>目录结构：</p>
        <pre className="overflow-x-auto rounded border border-line bg-bgsoft p-4 text-sm leading-6">
{`app/                  页面（Next.js App Router）
  posts/[slug]/       文章页
  categories/         分类页
  tags/               标签页
  search/             搜索页
  works/              推荐页
  friends/            友链页
  about/              关于页
  guide/              本页
components/           UI 组件
content/
  posts/              文章，.mdx 文件
  works.json          推荐作品数据
lib/                  读取和渲染逻辑
  site.ts             站点配置、导航、评论配置
  posts.ts            读文章、分类、标签
  markdown.ts         Markdown 渲染（含消毒）
  works.ts            读推荐作品
  friends.ts          友链数据
  utils.ts            公共工具函数
public/
  admin/              Decap CMS 后台
  images/             配图
scripts/
  generate-static.mjs 构建时生成 RSS / sitemap / 搜索索引
netlify/              OAuth 登录代理
.github/workflows/    自动构建部署`}
        </pre>
        <p>几条线捋一下：</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            文章在 <code>content/posts/</code>，构建时读进来，生成对应页面。
          </li>
          <li>
            <code>scripts/generate-static.mjs</code> 在构建前跑，产出 RSS、sitemap
            和全文搜索用的索引文件。
          </li>
          <li>搜索是纯前端的，Fuse.js 在浏览器里查索引，不经过任何服务。</li>
          <li>评论用 Giscus，挂在 GitHub Discussions 上，配置好才显示。</li>
          <li>后台是 Decap CMS，登录走自托管的 OAuth 代理，见第八节。</li>
          <li>所有外链都过了协议白名单，Markdown 渲染也做了消毒，可以放心点。</li>
        </ul>
      </Section>

      <Section num="08" title="发布流程是怎么运转的">
        <p>整个流程是这样的：</p>
        <blockquote className="border-l-2 border-gold pl-4 text-textsoft">
          后台点「保存」→ 内容作为一次提交写进 GitHub 仓库 →
          GitHub Actions 自动重新构建 → 部署到 GitHub Pages，网站更新。
        </blockquote>
        <p>
          每次发布都是一次代码提交，历史全在 Git 里。改坏了也不怕，
          去仓库找到对应的提交，把文件恢复成旧版本再推送就行。
        </p>
        <p>
          后台登录用的 OAuth 代理是 Netlify 上一个小函数，只负责 GitHub 授权换 token，
          不存任何内容。主站本身完全在 GitHub Pages 上，Netlify 挂了对站点没影响。
        </p>
      </Section>

      <Section num="09" title="改配置">
        <p>下面这些不用碰代码逻辑，改完推 main 就生效：</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            站名、口号、头像、社交链接这些在根目录的{" "}
            <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">
              site.config.json
            </code>
            。
          </li>
          <li>
            导航菜单在{" "}
            <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">
              lib/site.ts
            </code>{" "}
            的 <code>nav</code> 数组。
          </li>
          <li>
            预设分类在{" "}
            <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">
              lib/posts.ts
            </code>{" "}
            的 <code>PRESET_CATEGORIES</code> 数组，加一项就有新分类。
            记得同步改{" "}
            <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm">
              public/admin/config.yml
            </code>{" "}
            里的分类选项，两边保持一致。
          </li>
          <li>
            评论要开的话，去 giscus.app 拿配置，填进{" "}
            <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">
              lib/site.ts
            </code>{" "}
            的 <code>giscus</code> 字段，把 <code>enabled</code> 改成{" "}
            <code>true</code>。
          </li>
          <li>
            外观配色、特效都写在{" "}
            <code className="rounded bg-bgsoft px-1.5 py-0.5 text-sm text-goldstrong">
              app/globals.css
            </code>
            ，全局颜色由 CSS 变量控制。
          </li>
        </ul>
      </Section>

      <Section num="10" title="常见问题">
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
            现在固定四个分类（杂谈 / 评价 / 记录 / 其他），想加新的动代码，见第九节。
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
          <li>
            <strong>想在手机上写文章？</strong>
            <br />
            后台是网页，手机浏览器也能开，就是排版和电脑不太一样。
            图省事还是电脑上改。
          </li>
        </ul>
      </Section>
    </div>
  );
}
