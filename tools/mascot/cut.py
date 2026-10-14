"""Tách nền ảnh chibi Gemini (nền trắng) ⇒ WebP 360×360 trong suốt + PNG 200px cho email.
Dùng: python3 tools/mascot/cut.py <vai> <biểu-cảm>=<ảnh.png> [<biểu-cảm>=<ảnh.png> …]
Ví dụ: python3 tools/mascot/cut.py ao-dai chao=1.png vui=2.png
Kết quả: mascot/<vai>/<biểu-cảm>.webp và mascot/<vai>/png/<biểu-cảm>.png. Sau đó khai báo vai trong mascot.js ▸ READY."""
import sys, os
import numpy as np
from PIL import Image
from collections import deque

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')

def flood(mask, seeds):
    h, w = mask.shape; seen = np.zeros((h, w), bool); q = deque()
    for y, x in seeds:
        if mask[y, x] and not seen[y, x]: seen[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            yy, xx = y + dy, x + dx
            if 0 <= yy < h and 0 <= xx < w and not seen[yy, xx] and mask[yy, xx]:
                seen[yy, xx] = True; q.append((yy, xx))
    return seen

def cut(src):
    im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(np.int16)
    h, w, _ = a.shape
    lum = a.mean(2); sat = a.max(2) - a.min(2)
    edge = [(y, x) for x in range(w) for y in (0, h - 1)] + [(y, x) for y in range(h) for x in (0, w - 1)]
    # 1) nền trắng thuần nối với mép ảnh
    core = flood((lum >= 244) & (sat <= 12), edge)
    # 2) bóng xám trung tính nối với nền (dừng ở viền nhân vật) ⇒ bóng mờ màu tối, không còn đĩa xám
    ys, xs = np.nonzero(core)
    shad = flood(((sat <= 10) & (lum >= 150)) | core, list(zip(ys.tolist(), xs.tolist()))) & ~core
    alpha = np.full((h, w), 255.0)
    alpha[core] = 0
    alpha[shad] = np.clip((246 - lum[shad]) * 3.2, 0, 120)
    rgb = a.astype(np.float32).copy()
    rgb[shad] = [38, 52, 58]          # bóng = màu tối + alpha ⇒ đổ bóng mềm trên mọi nền
    from PIL import ImageFilter
    al = Image.fromarray(alpha.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))
    out = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)); out.putalpha(al)
    bb = Image.fromarray((np.asarray(al) > 8).astype(np.uint8) * 255).getbbox() or (0, 0, w, h)
    x0, y0, x1, y1 = bb; s = max(x1 - x0, y1 - y0); m = int(s * 0.06); s += 2 * m
    sq = Image.new('RGBA', (s, s), (0, 0, 0, 0)); sq.paste(out.crop((x0, y0, x1, y1)), ((s - (x1 - x0)) // 2, (s - (y1 - y0)) // 2))
    return sq

if __name__ == '__main__':
    vai = sys.argv[1]; d = os.path.join(ROOT, 'mascot', vai); os.makedirs(os.path.join(d, 'png'), exist_ok=True)
    for arg in sys.argv[2:]:
        emo, src = arg.split('=', 1); sq = cut(src)
        sq.resize((360, 360), Image.LANCZOS).save(os.path.join(d, emo + '.webp'), 'WEBP', quality=82, method=6)
        p = sq.resize((200, 200), Image.LANCZOS); p.quantize(colors=255, method=Image.FASTOCTREE, dither=Image.NONE).save(os.path.join(d, 'png', emo + '.png'), optimize=True)
        print(vai, emo, os.path.getsize(os.path.join(d, emo + '.webp')) // 1024, 'KB')
