import { safeUrl } from "./utils";

export { safeUrl };

export interface Friend {
  name: string;
  url: string;
  description: string;
  /** 头像地址（可选）：站内路径（如 /images/xxx.png）或外链 http(s) 均可 */
  avatar?: string;
}

/** 友情链接列表，在这里增删改 */
export const friends: Friend[] = [];
