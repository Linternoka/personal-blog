import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="kam-title text-7xl font-black tracking-widest text-gold/40">
        404
      </p>
      <h1 className="kam-title mt-4 text-2xl font-black text-text">
        页面走丢了喵~
      </h1>
      <p className="mt-2 text-textsoft">
        你要找的页面可能被移走了，或者从未存在过。
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="kam-btn px-6 py-2.5 text-sm">
          回到首页
        </Link>
        <Link href="/search" className="kam-btn px-6 py-2.5 text-sm">
          搜索文章
        </Link>
      </div>
    </div>
  );
}
