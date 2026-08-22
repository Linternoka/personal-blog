export interface Friend {
  name: string;
  url: string;
  description: string;
  avatar?: string;
}

/** 友情链接列表，在这里增删改 */
export const friends: Friend[] = [
  {
    name: "示例友链",
    url: "https://example.com",
    description: "这是一个示例友链，欢迎在这里添加你的朋友们。",
  },
];
