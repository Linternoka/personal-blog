/**
 * 站标 Logo —— 星轨
 *
 * 五角星核心 + 多重轨道（外圈 / 5 条斜轨道 / 中层虚线环 / 5 个椭圆轨道）。
 * - 线稿继承 currentColor（随外层文字色自动亮暗适配）
 * - 青绿强调用 var(--gold)（暗色 #7fdcc6 / 浅色 #0f766e）
 * - 核心填充用 var(--gold-soft)（青绿低透明，两种模式均有层次）
 */
type LogoProps = { className?: string };

export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <g transform="translate(300,300)">
        {/* 外圈轨道 */}
        <circle
          r="260"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 5 条斜轨道 */}
        <g
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="0" cy="-130" r="130" />
          <circle cx="0" cy="-130" r="130" transform="rotate(72)" />
          <circle cx="0" cy="-130" r="130" transform="rotate(144)" />
          <circle cx="0" cy="-130" r="130" transform="rotate(216)" />
          <circle cx="0" cy="-130" r="130" transform="rotate(288)" />
        </g>
        {/* 星形核心 */}
        <polygon
          points="0,-110 32,-34 105,-34 43,13 64,90 0,55 -64,90 -43,13 -105,-34 -32,-34"
          fill="var(--gold-soft)"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* 中层圆环 + 虚线环 */}
        <circle r="180" stroke="currentColor" strokeWidth="2" />
        <circle
          r="180"
          strokeDasharray="8 6"
          strokeWidth="1.5"
          stroke="var(--gold)"
        />
        {/* 内层 5 个椭圆轨道 */}
        <g stroke="var(--gold)" strokeWidth="1.5" opacity="0.85">
          <ellipse rx="60" ry="15" transform="rotate(0)" />
          <ellipse rx="60" ry="15" transform="rotate(72)" />
          <ellipse rx="60" ry="15" transform="rotate(144)" />
          <ellipse rx="60" ry="15" transform="rotate(216)" />
          <ellipse rx="60" ry="15" transform="rotate(288)" />
        </g>
        {/* 中心圆核 */}
        <circle
          r="25"
          fill="var(--gold-soft)"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle r="12" fill="var(--gold)" />
      </g>
    </svg>
  );
}
