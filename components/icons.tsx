/**
 * 站点统一图标层（唯一图标出口）
 *
 * 界面图标来自 Lucide（https://lucide.dev，ISC 许可）—— Feather Icons 的官方后继，
 * 与本站原有的 feather 线条风格同源：24×24 网格、圆角线帽、纯描边无填充。
 *
 * 为什么统一收在这一层，而不是各处直接 import lucide-react：
 * 1. 线宽一致：历史遗留的 1.5 / 2 混用（icons.tsx 用 1.5，Header / ThemeToggle /
 *    TocSidebar 手写 SVG 用 2）在这里收敛成唯一的 ICON_STROKE
 * 2. 无障碍一致：所有装饰性图标统一 aria-hidden，需要语义的地方由调用方给 aria-label
 * 3. 换库只改这一处：站点专属资产（品牌标识、空态插画）与库图标同一出口
 *
 * 品牌图标为何仍是手写：Lucide 1.x 已移除全部品牌图标（无 github / bilibili），
 * 因此 GitHub 用官方 octicon 路径（MIT），Bilibili 为手写线性标识，都保留在本文件。
 */

import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  ChartColumn,
  Check,
  Copy,
  ExternalLink,
  FolderOpen,
  House,
  Info,
  Library,
  List,
  Mail,
  Menu,
  Moon,
  NotebookPen,
  Rss,
  ScrollText,
  Search,
  ShieldCheck,
  SquarePen,
  Star,
  Sun,
  Tag,
  Tags,
  Users,
  X,
} from "lucide-react";

export type IconProps = {
  /** 尺寸与颜色由调用方用 Tailwind 类控制（如 h-4 w-4 text-gold） */
  className?: string;
  /** 覆盖描边宽度；默认取 ICON_STROKE，与站点线稿风格一致 */
  strokeWidth?: number;
};

/** 站点统一描边宽度：与原有 feather 手写图标（1.5）保持一致 */
export const ICON_STROKE = 1.5;

/**
 * 把一个 Lucide 图标包装成站点图标：注入统一线宽与无障碍属性。
 * 用类型注解而非泛型工厂，是为了让每个导出都保留可读的 displayName。
 */
function withSiteDefaults(Base: LucideIcon, displayName: string) {
  function SiteIcon({ className, strokeWidth = ICON_STROKE }: IconProps) {
    return (
      <Base
        className={className}
        strokeWidth={strokeWidth}
        aria-hidden="true"
        focusable="false"
      />
    );
  }
  SiteIcon.displayName = displayName;
  return SiteIcon;
}

/* ---------- 导航与控件 ---------- */

/** 移动端菜单开合（开） */
export const MenuIcon = withSiteDefaults(Menu, "MenuIcon");
/** 关闭：菜单 / 目录侧栏 / 搜索清空 */
export const CloseIcon = withSiteDefaults(X, "CloseIcon");
/** 主题切换：亮色态显示太阳 */
export const SunIcon = withSiteDefaults(Sun, "SunIcon");
/** 主题切换：暗色态显示月亮 */
export const MoonIcon = withSiteDefaults(Moon, "MoonIcon");
/** 搜索框放大镜 */
export const SearchIcon = withSiteDefaults(Search, "SearchIcon");
/** 文章目录（TOC）侧栏 */
export const TocIcon = withSiteDefaults(List, "TocIcon");
/** 回到顶部 */
export const ArrowUpIcon = withSiteDefaults(ArrowUp, "ArrowUpIcon");

/* ---------- 文章导航 ---------- */

/** 上一篇 */
export const ArrowLeftIcon = withSiteDefaults(ArrowLeft, "ArrowLeftIcon");
/** 下一篇 / 查看全部 */
export const ArrowRightIcon = withSiteDefaults(ArrowRight, "ArrowRightIcon");
/** 外链跳转（推荐作品「查看」） */
export const ArrowUpRightIcon = withSiteDefaults(ArrowUpRight, "ArrowUpRightIcon");

/* ---------- 页脚与功能区 ---------- */

/** RSS 订阅 */
export const RssIcon = withSiteDefaults(Rss, "RssIcon");
/** 后台管理（Decap CMS） */
export const EditIcon = withSiteDefaults(SquarePen, "EditIcon");
/** 访问统计 */
export const ChartIcon = withSiteDefaults(ChartColumn, "ChartIcon");

/* ---------- 社交与联系 ---------- */

/** 邮箱 / 联系我 */
export const MailIcon = withSiteDefaults(Mail, "MailIcon");
/** 萌娘百科 */
export const BookIcon = withSiteDefaults(BookOpen, "BookIcon");
/** Bangumi 番组收藏 */
export const StarIcon = withSiteDefaults(Star, "StarIcon");
/** SCP 基金会 */
export const ShieldIcon = withSiteDefaults(ShieldCheck, "ShieldIcon");
/** 复制成功反馈 */
export const CheckIcon = withSiteDefaults(Check, "CheckIcon");
/** 代码块复制 */
export const CopyIcon = withSiteDefaults(Copy, "CopyIcon");

/**
 * 命令式 DOM 场景用的图标标记（配合 dangerouslySetInnerHTML / innerHTML）
 *
 * 文章代码块的复制按钮由 CodeBlockEnhancer 直接构建 DOM（内容在 React 之外），
 * 放不了 React 组件；为免给按钮单独开 React root，这里给出等价的 SVG 标记。
 * 路径与上面的 React 版同源：Lucide Copy / Check（ISC 许可，https://lucide.dev），
 * 改动时两处需一起改。
 */
export const COPY_ICON_MARKUP =
  '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';

export const CHECK_ICON_MARKUP =
  '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

/* ---------- 分区标题 ---------- */

/** 最新文章 / 文章列表 */
export const ScrollTextIcon = withSiteDefaults(ScrollText, "ScrollTextIcon");
/** 分类 */
export const FolderIcon = withSiteDefaults(FolderOpen, "FolderIcon");
/** 标签 */
export const TagsIcon = withSiteDefaults(Tags, "TagsIcon");
/** 单个标签 */
export const TagIcon = withSiteDefaults(Tag, "TagIcon");
/** 推荐作品 */
export const LibraryIcon = withSiteDefaults(Library, "LibraryIcon");
/** 友链 */
export const UsersIcon = withSiteDefaults(Users, "UsersIcon");
/** 站外链接标记 */
export const ExternalLinkIcon = withSiteDefaults(ExternalLink, "ExternalLinkIcon");
/** 关于 */
export const InfoIcon = withSiteDefaults(Info, "InfoIcon");
/** 使用与维护指南 */
export const GuideIcon = withSiteDefaults(NotebookPen, "GuideIcon");
/** 回到首页（404 页） */
export const HomeIcon = withSiteDefaults(House, "HomeIcon");

/* ---------- 品牌标识（Lucide 无品牌图标，保留官方 / 手写路径） ---------- */

/** GitHub：官方 octicon mark（MIT 许可） */
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

/** Bilibili：手写线性标识（官方标志为实心色块，与本站线稿风格不符） */
export function BilibiliIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={ICON_STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M7.5 3 9.5 6M16.5 3 14.5 6" />
      <path d="m10 11 3 1.6-3 1.6" />
    </svg>
  );
}

/* ---------- 站点专属插画（不在任何图标库中，属本站原创） ---------- */

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
