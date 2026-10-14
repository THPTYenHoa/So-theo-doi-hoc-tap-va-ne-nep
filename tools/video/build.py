#!/usr/bin/env python3
"""Dựng video giới thiệu 1920×1080 từ các cảnh đã quay (tools/video/rec.js) + trang tiêu đề.
   python3 tools/video/build.py  (cần http.server 8768 đang chạy cho chrome.js; OUT = thư mục quay, mặc định /tmp/hk_video)
   Kết quả: OUT/So_theo_doi_hoc_sinh_11D3_gioi_thieu.mp4 + .srt (chữ thuyết minh, dùng cho giọng đọc CapCut) + _loi_thuyet_minh.txt"""
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.environ.get('OUT', '/tmp/hk_video'); TMP = os.path.join(OUT, '_build'); os.makedirs(TMP, exist_ok=True)
URL = os.environ.get('APP_URL', 'thptyenhoa.github.io/So-theo-doi-hoc-tap-va-ne-nep')
FADE = '0xF3F8F9'; FPS = 30
L = {'desk': dict(x=60, y=132, w=1440, h=810), 'mob': dict(x=220, y=150, w=398, h=860)}

# (loại, tên, thời lượng hoặc chương, nội dung)
SEQ = [
  ('card', 'intro', 6.5, dict(logo=1, k='Video giới thiệu · hướng dẫn sử dụng', h1='Sổ theo dõi học sinh', l1='Hạnh kiểm &amp; nề nếp · Lớp 11D3', l2='Trường THPT Yên Hòa · Năm học 2026 – 2027', ms='chao'),
     'Sổ theo dõi học sinh lớp 11D3, Trường THPT Yên Hòa. Video giới thiệu và hướng dẫn sử dụng.'),
  ('card', 'vande', 9, dict(k='Vấn đề', h2='Theo dõi hạnh kiểm bằng sổ giấy', li=['Ghi chép rời rạc, mỗi cán bộ lớp một cuốn, dễ thất lạc.', 'Cuối tháng cộng điểm, xếp loại thủ công, mất nhiều thời gian.', 'Phụ huynh biết tình hình của con muộn, khó phối hợp sớm.'], ms='suy-nghi'),
     'Theo dõi hạnh kiểm bằng sổ giấy: ghi chép rời rạc, dễ thất lạc; cuối tháng cộng điểm, xếp loại thủ công mất nhiều thời gian; phụ huynh biết tình hình của con muộn.'),
  ('card', 'giaiphap', 9, dict(k='Giải pháp', h2='Một cuốn sổ điện tử dùng chung cho cả lớp', li=['Chạy trên điện thoại và máy tính, không cần cài đặt.', 'Dữ liệu lưu trên Google Sheet của nhà trường.', 'Ba vai: giáo viên chủ nhiệm, cán bộ lớp, phụ huynh — mỗi người thấy đúng phần của mình.'], ms='huong-dan'),
     'Giải pháp: một cuốn sổ điện tử dùng chung cho cả lớp, chạy trên điện thoại và máy tính, dữ liệu lưu trên Google Sheet của nhà trường. Mỗi người chỉ thấy đúng phần của mình.'),
  ('card', 'sec1', 3.5, dict(big='1', h2='Cán bộ lớp ghi điểm hằng ngày', ms='chi-tay'), 'Phần một: cán bộ lớp ghi điểm hằng ngày.'),
  ('clip', 'c1_dangnhap', 0, None, None),
  ('clip', 'c2_ghidiem', 1, None, None),
  ('card', 'sec2', 3.5, dict(big='2', h2='Giáo viên chủ nhiệm theo dõi, xếp loại, báo cáo', ms='vui'), 'Phần hai: giáo viên chủ nhiệm theo dõi, xếp loại và báo cáo.'),
  ('clip', 'c3_tongquan', 2, None, None),
  ('clip', 'c4_hanhkiem', 3, None, None),
  ('clip', 'c5_hoso', 4, None, None),
  ('clip', 'c6_thongke', 5, None, None),
  ('clip', 'c7_baocao', 6, None, None),
  ('card', 'sec3', 3.5, dict(big='3', h2='Phụ huynh theo dõi con', ms='co-vu'), 'Phần ba: phụ huynh theo dõi con.'),
  ('clip', 'c8_phuhuynh', 7, None, None),
  ('card', 'hieuqua', 10, dict(k='Hiệu quả', h2='Nhanh hơn, chính xác hơn, gần phụ huynh hơn', li=['Ghi một lượt điểm trong vài giây, ngay tại lớp.', 'Xếp loại tháng, học kỳ và báo cáo tự tổng hợp.', 'Phụ huynh nắm tình hình kịp thời, phối hợp sớm.', 'Dữ liệu học sinh được bảo vệ: đúng người, đúng phần.'], ms='khen-lon'),
     'Hiệu quả: ghi điểm trong vài giây ngay tại lớp; xếp loại và báo cáo tự tổng hợp; phụ huynh nắm tình hình kịp thời; dữ liệu học sinh được bảo vệ.'),
  ('card', 'morong', 8, dict(k='Hướng phát triển', h2='Mở rộng thành sổ liên lạc điện tử của nhà trường', li=['Ban giám hiệu theo dõi thi đua nhiều lớp.', 'Học bạ, điểm số; nội quy, quy định.', 'Hoạt động của trường, thông báo chung.'], ms='an-mung'),
     'Hướng phát triển: mở rộng thành sổ liên lạc điện tử của nhà trường: ban giám hiệu theo dõi thi đua, học bạ, nội quy, hoạt động và thông báo chung.'),
  ('card', 'end', 7, dict(logo=1, h2='Cảm ơn quý thầy cô đã theo dõi!', l1='Trải nghiệm ngay: màn đăng nhập ▸ <b>Kiểm tra tính năng ứng dụng</b>', url=URL, ms='cam-on'),
     'Cảm ơn quý thầy cô đã theo dõi. Trải nghiệm ngay tại màn đăng nhập, mục Kiểm tra tính năng ứng dụng.'),
]

def sh(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-1500:]); sys.exit(1)
    return r.stdout

def dur(f): return float(sh(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).strip())

metas = {s[1]: json.load(open(os.path.join(OUT, s[1], 'meta.json'))) for s in SEQ if s[0] == 'clip'}
ncl = sum(1 for s in SEQ if s[0] == 'clip')
# 1. lớp hình
spec = [dict(out=f'{TMP}/bg_desk.png', kind='bg', layout='desk'), dict(out=f'{TMP}/bg_mob.png', kind='bg', layout='mob'),
        dict(out=f'{TMP}/mask_desk.png', kind='mask', layout='desk'), dict(out=f'{TMP}/mask_mob.png', kind='mask', layout='mob')]
for s in SEQ:
    if s[0] == 'card': spec.append(dict(out=f'{TMP}/card_{s[1]}.png', kind='card', body=s[3]))
k = 0
for s in SEQ:
    if s[0] != 'clip': continue
    k += 1; m = metas[s[1]]
    for i, c in enumerate(m['caps']):
        spec.append(dict(out=f'{TMP}/fg_{s[1]}_{i}.png', kind='fg', layout='mob' if m['mobile'] else 'desk', title=m['title'] or s[1], text=c['text'], sub=c['sub'], step=f'Bước {k} / {ncl}', ch=s[2]))
json.dump(spec, open(f'{TMP}/spec.json', 'w'), ensure_ascii=False)
sh(['node', os.path.join(HERE, 'chrome.js'), f'{TMP}/spec.json'])

parts, srt, t_abs = [], [], 0.0
def enc(): return ['-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', str(FPS)]
for s in SEQ:
    if s[0] == 'card':
        d = max(s[2], round(1.6 + len(s[4]) * 0.072, 1)); o = f'{TMP}/part_{len(parts):02d}.mp4'   # đủ thời gian cho lời thuyết minh
        sh(['ffmpeg', '-y', '-loop', '1', '-t', str(d), '-i', f'{TMP}/card_{s[1]}.png', '-vf', f'fade=t=in:st=0:d=0.5:color={FADE},fade=t=out:st={d-0.5}:d=0.5:color={FADE},format=yuv420p'] + enc() + [o])
        srt.append((t_abs + 0.3, t_abs + d - 0.3, s[4])); parts.append(o); t_abs += d; print('▣', s[1], d); continue
    m = metas[s[1]]; lay = 'mob' if m['mobile'] else 'desk'; g = L[lay]
    fr = m['frames']; t0 = fr[0]['t']; end = m['end']
    lst = f'{TMP}/{s[1]}.txt'
    with open(lst, 'w') as f:
        for i, x in enumerate(fr):
            nx = fr[i + 1]['t'] if i + 1 < len(fr) else end
            f.write(f"file '{os.path.join(OUT, s[1], x['f'])}'\nduration {max(0.001, nx - x['t']):.4f}\n")
        f.write(f"file '{os.path.join(OUT, s[1], fr[-1]['f'])}'\n")
    raw = f'{TMP}/{s[1]}_raw.mp4'
    sh(['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-vf', f"fps={FPS},scale={g['w']}:{g['h']}:flags=lanczos,format=yuv420p"] + enc() + [raw])
    D = dur(raw); caps = m['caps']
    ts = [max(0.0, c['t'] - t0) for c in caps]; ts[0] = 0.0
    ins = ['-loop', '1', '-i', f'{TMP}/bg_{lay}.png', '-i', raw, '-loop', '1', '-i', f'{TMP}/mask_{lay}.png']
    fl = f"[1:v]format=rgba[v];[2:v]format=gray[m];[v][m]alphamerge[vr];[0:v][vr]overlay={g['x']}:{g['y']}:shortest=1[b0]"
    for i, c in enumerate(caps):
        ins += ['-loop', '1', '-i', f'{TMP}/fg_{s[1]}_{i}.png']
        a, b = ts[i], (ts[i + 1] if i + 1 < len(caps) else D + 1)
        fl += f";[b{i}][{3 + i}:v]overlay=0:0:enable='between(t,{a:.3f},{b:.3f})'[b{i + 1}]"
        srt.append((t_abs + a, t_abs + min(b, D) - 0.05, c['text'] + ((' ' + c['sub']) if c['sub'] else '')))
    fl += f";[b{len(caps)}]fade=t=in:st=0:d=0.4:color={FADE},fade=t=out:st={D - 0.4:.3f}:d=0.4:color={FADE},format=yuv420p[out]"
    o = f'{TMP}/part_{len(parts):02d}.mp4'
    sh(['ffmpeg', '-y'] + ins + ['-filter_complex', fl, '-map', '[out]', '-t', f'{D:.3f}'] + enc() + [o])
    parts.append(o); t_abs += D; print('▶', s[1], round(D, 1), 's,', len(caps), 'chú thích')

with open(f'{TMP}/parts.txt', 'w') as f: f.writelines(f"file '{p}'\n" for p in parts)
name = os.path.join(OUT, 'So_theo_doi_hoc_sinh_11D3_gioi_thieu')
sh(['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', f'{TMP}/parts.txt', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '64k', '-shortest', '-movflags', '+faststart', name + '.mp4'])
def tc(x): h, r = divmod(x, 3600); mi, se = divmod(r, 60); return f"{int(h):02d}:{int(mi):02d}:{int(se):02d},{int(round((se - int(se)) * 1000)):03d}"
with open(name + '.srt', 'w', encoding='utf-8') as f:
    for i, (a, b, t) in enumerate(srt): f.write(f"{i + 1}\n{tc(a)} --> {tc(b)}\n{t}\n\n")
with open(name + '_loi_thuyet_minh.txt', 'w', encoding='utf-8') as f:
    f.write('LỜI THUYẾT MINH — Sổ theo dõi học sinh 11D3 (khớp thời gian video)\n\n')
    for a, b, t in srt: f.write(f"[{tc(a)[:8]}] {t}\n")
print('✅', name + '.mp4', round(dur(name + '.mp4'), 1), 's')
