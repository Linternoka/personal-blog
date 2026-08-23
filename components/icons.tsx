/**
 * 轻量线性图标集（feather 风格，统一 stroke 描边）
 * GitHub 图标使用官方 octicon mark（MIT 许可），其余为手写线条图标
 */

type IconProps = { className?: string };

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.26 5.66.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.68.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
      />
    </svg>
  );
}

export function BilibiliIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M7.5 3 9.5 6M16.5 3 14.5 6" />
      <path d="m10 11 3 1.6-3 1.6" />
    </svg>
  );
}

export function BookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} aria-hidden="true">
      <path d="m12 2 3 6.5 7 .9-5 4.8 1.3 7L12 18.4 5.7 21.2 7 14.2 2 9.4l7-.9z" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} aria-hidden="true">
      <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

export function RssIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} aria-hidden="true">
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function EditIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} aria-hidden="true">
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
    </svg>
  );
}

/** 空态插画：一本被修缮的旧书（呼应「废书库修缮」主题） */
export function BookRepairIllustration({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 120 96"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* 左页 */}
      <path d="M12 24c0-12 14-14 26-13l20 2v65l-20-2c-14-1-26-4-26-18z" />
      {/* 右页 */}
      <path d="M108 24c0-12-14-14-26-13l-20 2v65l20-2c14-1 26-4 26-18z" />
      {/* 书脊 */}
      <path d="M58 13v65M62 13v65" />
      {/* 左页文字线 */}
      <path d="M22 30h24M22 40h24M22 50h22" opacity="0.7" />
      {/* 右页文字线 */}
      <path d="M98 30H74M98 40H74M98 50h-22" opacity="0.7" />
      {/* 修缮胶带 */}
      <path d="m44 62 22 2-3 9-22-2z" opacity="0.9" />
      {/* 折角补丁 */}
      <path d="m72 10 6-4 4 5z" opacity="0.7" />
    </svg>
  );
}

/** 空态插画：两节链环被重新接合（友链交换主题，呼应「废书库修缮」） */
export function LinkRepairIllustration({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 120 96"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* 链环主体（feather link 放大 4x 居中） */}
      <g transform="translate(12 0) scale(4)" strokeWidth="0.4">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </g>
      {/* 修缮胶带：链环接合处 */}
      <path d="m48 42 24 5-3 10-24-5z" opacity="0.9" />
      {/* 装饰星点 */}
      <path
        d="M18 20v3M16.5 21.5h3M102 20v3M100.5 21.5h3M22 76v3M20.5 77.5h3M98 76v3M96.5 77.5h3"
        opacity="0.55"
      />
    </svg>
  );
}
