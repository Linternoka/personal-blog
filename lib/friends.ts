export interface Friend {
  name: string;
  url: string;
  description: string;
  avatar?: string;
}

/** 友情链接列表，在这里增删改 */
export const friends: Friend[] = [];
