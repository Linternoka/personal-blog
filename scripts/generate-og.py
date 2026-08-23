"""
生成站点社交分享图 public/og.png（1200×630，Open Graph / Twitter Card 标准尺寸）。

用法：python scripts/generate-og.py
需要 Pillow。设计复刻 components/Logo.tsx 的星轨 + 站点深底青绿配色。
可手动调整文案后重跑，产物随站点部署。
"""
import math

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
GOLD = (127, 220, 198)  # #7fdcc6 青绿
TEXT = (232, 234, 233)  # #e8eae9
CORNER = (64, 110, 99)


def vertical_gradient(c1, c2, height, width):
    img = Image.new("RGB", (width, height))
    px = img.load()
    for y in range(height):
        t = y / (height - 1)
        r = int(c1[0] + (c2[0] - c1[0]) * t)
        g = int(c1[1] + (c2[1] - c1[1]) * t)
        b = int(c1[2] + (c2[2] - c1[2]) * t)
        for x in range(width):
            px[x, y] = (r, g, b)
    return img


def main():
    img = vertical_gradient((19, 26, 32), (10, 14, 13), H, W)  # #131a20 -> #0a0e0d
    d = ImageDraw.Draw(img)

    # ---- 星轨（中心 cx,cy，整体缩放 scale）----
    cx, cy, scale = 600, 262, 0.42

    def S(v):
        return v * scale

    def circle(r):
        return [cx - r, cy - r, cx + r, cy + r]

    # 外圈轨道
    d.ellipse(circle(S(260)), outline=GOLD, width=2)
    # 5 条斜轨道（圆心在距中心 S(130) 处、半径 S(130)，旋转 72°）
    r2, d2 = S(130), S(130)
    for k in range(5):
        ang = math.radians(k * 72 - 90)
        ox, oy = cx + d2 * math.cos(ang), cy + d2 * math.sin(ang)
        d.ellipse([ox - r2, oy - r2, ox + r2, oy + r2], outline=GOLD, width=2)
    # 五角星核心（外接圆半径 S(110)）
    R = S(110)
    pts = []
    for k in range(10):
        ang = math.radians(-90 + k * 36)
        rad = R if k % 2 == 0 else R * 0.382
        pts.append((cx + rad * math.cos(ang), cy + rad * math.sin(ang)))
    d.polygon(pts, outline=GOLD, width=2)
    # 中层圆环 + 虚线环
    r3 = S(180)
    d.ellipse(circle(r3), outline=GOLD, width=2)
    for seg in range(0, 360, 18):
        d.arc(circle(r3), start=seg, end=seg + 8, fill=GOLD, width=1)
    # 中心圆核
    d.ellipse(circle(S(25)), outline=GOLD, width=2)
    d.ellipse(circle(S(12)), fill=GOLD)

    # ---- 文字 ----
    try:
        f_title = ImageFont.truetype("C:/Windows/Fonts/simsun.ttc", 58)
        f_sub = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 21)
    except Exception:
        f_title = f_sub = ImageFont.load_default()

    name = "废书库修缮委员会"
    spacing = 14
    widths = [f_title.getbbox(ch)[2] - f_title.getbbox(ch)[0] for ch in name]
    total = sum(widths) + spacing * (len(name) - 1)
    x, y = (W - total) / 2, 418
    for ch, w in zip(name, widths):
        d.text((x, y), ch, font=f_title, fill=TEXT)
        x += w + spacing

    sub = "记录 · 展示 · 分享"
    sub_w = f_sub.getbbox(sub)[2] - f_sub.getbbox(sub)[0]
    d.text(((W - sub_w) / 2, 508), sub, font=f_sub, fill=GOLD)

    # ---- 上下渐变线 ----
    for yline in (40, 590):
        for x in range(90, W - 90):
            t = (x - 90) / (W - 180)
            a = 1 - abs(t - 0.5) * 2
            col = tuple(int(GOLD[i] * 0.55 * a) for i in range(3))
            d.line([(x, yline), (x, yline)], fill=col)

    # ---- 四角 L 形 ----
    L = 46
    for x0, y0, sx, sy in [
        (34, 34, 1, 1),
        (W - 34, 34, -1, 1),
        (34, H - 34, 1, -1),
        (W - 34, H - 34, -1, -1),
    ]:
        d.line([(x0, y0), (x0 + sx * L, y0)], fill=CORNER, width=1)
        d.line([(x0, y0), (x0, y0 + sy * L)], fill=CORNER, width=1)

    img.save("public/og.png")
    print("saved public/og.png")


if __name__ == "__main__":
    main()
