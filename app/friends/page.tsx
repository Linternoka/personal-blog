import type { Metadata } from "next";
import { friends } from "@/lib/friends";

export const metadata: Metadata = {
  title: "友链",
  description: "我的朋友们",
};

export default function FriendsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <div className="kam-section">
        <span className="kam-section-en">Friends</span>
        <h1 className="kam-section-ja text-3xl">友链</h1>
      </div>
      <p className="mt-4 text-sm tracking-widest text-textsoft">
        我的朋友们，欢迎互相交换友链~
      </p>

      {friends.length === 0 ? (
        <p className="mt-8 text-textsoft">
          暂无友链，欢迎联系我交换链接喵~
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {friends.map((friend) => (
            <a
              key={friend.url}
              href={friend.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 border border-line bg-bgsoft p-5 transition-colors duration-300 hover:border-gold"
            >
              <div className="kam-title flex h-12 w-12 shrink-0 items-center justify-center border border-gold text-lg text-gold">
                {friend.name.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <h2 className="kam-title font-bold text-text transition-colors group-hover:text-goldstrong">
                  {friend.name}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-textsoft">
                  {friend.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
