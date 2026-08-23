import type { ReactNode } from "react";
import { BookRepairIllustration } from "./icons";

/**
 * 空态展示：暂无内容时的插画 + 提示（呼应「废书库修缮」主题）
 * illustration：可选自定义插画，默认使用旧书插画
 */
export default function EmptyState({
  title,
  hint,
  illustration,
}: {
  title: string;
  hint?: string;
  illustration?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      {illustration ?? (
        <BookRepairIllustration className="h-24 w-28 text-line-strong" />
      )}
      <p className="mt-6 text-sm tracking-widest text-textsoft">{title}</p>
      {hint && <p className="mt-1.5 text-xs text-textsoft/70">{hint}</p>}
    </div>
  );
}
