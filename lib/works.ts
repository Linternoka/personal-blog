import raw from "../content/works.json";

/** 推荐作品条目（content/works.json 中逐条添加即可） */
export interface WorkItem {
  /** 作品标题 */
  title: string;
  /** 类型：项目 / 文章 / 视频 / 音乐 / 游戏 / 书 等自由填写 */
  type: string;
  /** 一句话简介 */
  description: string;
  /** 外链地址 */
  url: string;
  /** 作者（可选） */
  author?: string;
  /** 日期（可选，如 2026-08-22） */
  date?: string;
}

/** 读取推荐作品列表（按数组顺序展示） */
export function getWorks(): WorkItem[] {
  return raw as WorkItem[];
}
