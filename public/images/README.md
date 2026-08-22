# 图片存放说明

把文章用到的图片放在这个目录（`public/images/`）里，然后在 Markdown 中引用：

```markdown
![图片描述](/images/图片文件名.png)
```

- 支持 `png` / `jpg` / `jpeg` / `gif` / `webp` / `svg`
- 路径以 `/images/` 开头即可，部署时会自动适配子路径（`/personal-blog/`）
- 也可以用外链图床的完整 URL（`https://...`）
- 注意：单个文件不要超过仓库限制（GitHub 建议 <50MB，普通图片远小于此）
