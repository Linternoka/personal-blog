import type { Metadata } from "next";
import { friends, safeUrl } from "@/lib/friends";
import Reveal from "@/components/Reveal";
import EmptyState from "@/components/EmptyState";
import { LinkRepairIllustration } from "@/components/icons";

export const metadata: Metadata = {
  title: "友链",
  description: "我的朋友们",
};

export default function FriendsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <div className="border-b border-line pb-6">
        <h1 className="kam-section-ja text-3xl">友链</h1>
        <p className="mt-3 text-sm tracking-widest text-textsoft">
          我的朋友们，欢迎互相交换友链~
        </p>
      </div>

      {friends.length === 0 ? (
        <EmptyState
          title="暂无友链"
          hint="欢迎联系我交换链接"
          illustration={
            <LinkRepairIllustration className="h-24 w-28 text-line-strong" />
          }
        />
      ) : (
        <div className="mt-2">
          {friends.map((friend, i) => (
            <Reveal key={friend.url} delay={i * 70}>
              <a
                href={safeUrl(friend.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 border-b border-line py-5 transition-colors duration-300 hover:border-gold/40"
              >
                <div className="kam-title flex h-11 w-11 shrink-0 items-center justify-center border border-line-strong text-base text-text">
                  {friend.name.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <h2 className="kam-title text-text transition-colors group-hover:text-goldstrong">
                    {friend.name}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm text-textsoft">
                    {friend.description}
                  </p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
