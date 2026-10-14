#!/usr/bin/env python3
"""Dựng KHUÔN "Sổ công tác chủ nhiệm" (templates/so-chu-nhiem.docx) từ file Word mẫu của trường.

   python3 tools/socn/lam_khuon.py <file mẫu .docx> templates/so-chu-nhiem.docx

 - Giữ nguyên trình bày của file mẫu (khổ giấy, phông, bảng, ảnh quy định), chỉ thay phần dữ liệu bằng ô đánh dấu {{…}}
   để app (socn.js ▸ DOCXFILL) điền dữ liệu lúc xuất.
 - XOÁ mọi dữ liệu cá nhân của file mẫu (tên, địa chỉ, số điện thoại học sinh / cha mẹ học sinh / giáo viên, ảnh sơ đồ lớp,
   ảnh biên bản họp) — repo app là repo CÔNG KHAI. File mẫu gốc KHÔNG đưa vào repo.
 Cú pháp ô đánh dấu (xem socn.js):
   {{khoa}}            giá trị đơn (nhiều dòng ⇒ tách thành nhiều đoạn)
   {{*ds.truong}}      dòng bảng lặp theo danh sách ds (các dòng liền nhau cùng ds = 1 nhóm lặp)
   {{#ds}} … {{/ds}}   nhóm đoạn / bảng lặp theo danh sách ds (đoạn đánh dấu nằm riêng 1 dòng); bên trong dùng {{.truong}}
   {{img:khoa}}        chèn ảnh (một hoặc nhiều ảnh) vừa khổ giấy
"""
import copy, re, sys, zipfile, io
from docx import Document
from docx.oxml.ns import qn

SRC, DST = sys.argv[1], sys.argv[2]
d = Document(SRC)
body = d.element.body
K = list(body.iterchildren())          # chỉ số theo file mẫu gốc (xem ghi chú từng mục)
W = lambda t: qn('w:' + t)


def runs_t(p):
    return [t for t in p.iter(W('t'))]


def set_text(p, text):
    """Đặt chữ cho đoạn: giữ định dạng đoạn + định dạng run đầu tiên, bỏ mọi run / ảnh khác."""
    rpr = None
    for r in p.iter(W('r')):
        x = r.find(W('rPr'))
        if x is not None and r.find(W('t')) is not None:
            rpr = copy.deepcopy(x); break
    if rpr is None:
        for r in p.iter(W('r')):
            x = r.find(W('rPr'))
            if x is not None: rpr = copy.deepcopy(x); break
    for ch in list(p):
        if ch.tag != W('pPr'): p.remove(ch)
    r = p.makeelement(W('r'), {})
    if rpr is not None: r.append(rpr)
    t = r.makeelement(W('t'), {}); t.text = text
    t.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
    r.append(t); p.append(r)
    return p


def replace_in(p, old, new):
    ts = runs_t(p); full = ''.join(t.text or '' for t in ts)
    i = full.find(old)
    if i < 0: return False
    pos = 0; done = False
    for t in ts:
        s = t.text or ''; a, b = pos, pos + len(s); pos = b
        if b <= i or a >= i + len(old): continue
        lo, hi = max(i, a) - a, min(i + len(old), b) - a
        if not done:
            t.text = s[:lo] + new + s[hi:]; done = True
            t.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
        else:
            t.text = s[:lo] + s[hi:]
    return True


def tcs(tr): return tr.findall(W('tc'))
def rows(tbl): return tbl.findall(W('tr'))


def cell_set(tc, text):
    ps = tc.findall(W('p'))
    set_text(ps[0], text)
    for p in ps[1:]: tc.remove(p)
    # thụt lề phải của kiểu Normal làm chữ trong ô hẹp bị xuống dòng từng kí tự ⇒ bỏ thụt lề trong ô dữ liệu
    pr = ps[0].find(W('pPr'))
    if pr is None: pr = ps[0].makeelement(W('pPr'), {}); ps[0].insert(0, pr)
    ind = pr.find(W('ind'))
    if ind is None: ind = pr.makeelement(W('ind'), {}); pr.insert(0, ind)
    for a in ('left', 'right', 'firstLine', 'hanging', 'start', 'end'):
        if ind.get(W(a)) is not None: del ind.attrib[W(a)]
    ind.set(W('left'), '0'); ind.set(W('right'), '0'); ind.set(W('firstLine'), '0')


def clone_after(ref, el):
    n = copy.deepcopy(el); ref.addnext(n); return n


def para_like(ref, text, after=True):
    n = copy.deepcopy(ref); set_text(n, text)
    (ref.addnext if after else ref.addprevious)(n)
    return n


def marker_par(ref_para, text):
    """Đoạn đánh dấu riêng 1 dòng (khối lặp) — sao định dạng đoạn ref."""
    n = copy.deepcopy(ref_para); set_text(n, text); return n


def remove(el):
    el.getparent().remove(el)


def keep_rows(tbl, n_head, proto_markers):
    """Giữ n_head dòng tiêu đề + 1 dòng mẫu (điền ô đánh dấu), xoá các dòng dữ liệu khác."""
    rs = rows(tbl)
    proto = rs[n_head]
    for c, m in zip(tcs(proto), proto_markers): cell_set(c, m)
    for r in rs[n_head + 1:]: tbl.remove(r)


def grid(tbl, r0, r1, cols, key):
    for ri, tr in enumerate(rows(tbl)):
        if ri < r0 or ri > r1: continue
        cs = tcs(tr)
        for ci in cols:
            if ci < len(cs): cell_set(cs[ci], '{{%s_%d_%d}}' % (key, ri, ci))


TB = [el for el in K if el.tag == W('tbl')]
P = lambda i: K[i]

# ── BÌA (hộp chữ, có 2 bản: mc:Choice + mc:Fallback) ──
for tx in body.iter(W('txbxContent')):
    for p in tx.iter(W('p')):
        replace_in(p, 'VŨ THỊ VÂN', '{{gvcn_hoa}}')
        replace_in(p, '11D4', '{{lop}}')
        replace_in(p, 'THPT YÊN HOÀ', '{{truong_hoa}}')
        replace_in(p, '2026-2027', '{{namhoc}}')
        replace_in(p, 'SỞ GIÁO DỤC VÀ ĐÀO TẠO HÀ NỘI', '{{so_gddt}}')

# ── DANH SÁCH GVBM (bảng 0) ──
keep_rows(TB[0], 1, ['{{*gv.mon}}', '{{*gv.ten}}', '{{*gv.lh}}'])

# ── QUY ĐỊNH ĐÁNH GIÁ RÈN LUYỆN CỦA LỚP ──
replace_in(P(73), '11D4', '{{lop}}')
set_text(P(74), 'NĂM HỌC {{namhoc_gach}}')
set_text(P(76), '{{qd_lop}}'); remove(P(77)); remove(P(78))
keep_rows(TB[1], 1, ['{{*xl.tuan}}', '{{*xl.thang}}', '{{*xl.loai}}'])
# ảnh bảng điểm trừ / cộng của lớp mẫu (image10) ⇒ ảnh lớp tải lên + danh mục điểm từ app
pi = P(82); set_text(pi, '{{img:quydinh_lop}}'); para_like(pi, '{{dm_diem}}')

# ── PHẦN II: SƠ ĐỒ LỚP ──
set_text(P(117), '{{img:sodo1}}')
set_text(P(120), '{{sodo1_ghichu}}')
set_text(P(133), '{{img:sodo2}}')
set_text(P(149), '{{sodo2_ghichu}}')

# ── PHÂN CÔNG CÁN BỘ LỚP (159…185) ⇒ 3 nhóm lặp ──
pb, pdc, ppv = P(160), P(161), P(162)
grp = [(159, 'cb_doan', 163, 165), (166, 'cb_lop', 167, 176)]
for head, name, a, b in grp:
    for i in range(a, b + 1): remove(P(i))
# nhóm 1: dùng 3 đoạn 160-162 làm mẫu
set_text(pb, '- {{.chucvu}}: {{.ten}}'); set_text(pdc, 'Địa chỉ: {{.dc}}\tĐiện thoại: {{.dt}}'); set_text(ppv, 'Phần việc phụ trách: {{.pv}}')
P(159).addnext(marker_par(P(159), '{{#cb_doan}}'))
ppv.addnext(marker_par(P(159), '{{/cb_doan}}'))
# nhóm 2 (sau "2. TỔ CHỨC LỚP")
h2 = P(166); prev = h2
prev.addnext(marker_par(h2, '{{#cb_lop}}')); prev = prev.getnext()
for src in (pb, pdc, ppv):
    n = copy.deepcopy(src); prev.addnext(n); prev = n
prev.addnext(marker_par(h2, '{{/cb_lop}}'))
# nhóm 3: tổ trưởng
for i in range(180, 186): remove(P(i))
set_text(P(178), 'Tổ {{.to}}: {{.ten}}        Địa chỉ: {{.dc}}')
set_text(P(179), '                                                  Điện thoại: {{.dt}}')
P(177).addnext(marker_par(P(177), '{{#cb_to}}'))
P(179).addnext(marker_par(P(177), '{{/cb_to}}'))

# ── DANH SÁCH THEO TỔ (bảng 2, 3) · BAN ĐẠI DIỆN CMHS (bảng 4) ──
keep_rows(TB[2], 2, ['{{*to12.ten1}}', '{{*to12.dc1}}', '{{*to12.ten2}}', '{{*to12.dc2}}'])
keep_rows(TB[3], 2, ['{{*to34.ten1}}', '{{*to34.dc1}}', '{{*to34.ten2}}', '{{*to34.dc2}}'])
keep_rows(TB[4], 1, ['{{*bdd.ten}}', '{{*bdd.nghe}}', '{{*bdd.dc}}', '{{*bdd.dt}}', '{{*bdd.nv}}'])
set_text(P(207), '{{ghichu_thaydoi}}')

# ── PHẦN III ──
grid(TB[5], 2, 6, range(1, 11), 'sl')
keep_rows(TB[6], 2, ['{{*hs.stt}}', '{{*hs.ten}}', '{{*hs.rl}}', '{{*hs.ht}}', '{{*hs.kt}}', '{{*hs.gc}}'])
keep_rows(TB[7], 1, ['{{*hsdb.stt}}', '{{*hsdb.ten}}', '{{*hsdb.dd}}', '{{*hsdb.bp}}'])
keep_rows(TB[8], 1, ['{{*hs.stt}}', '{{*hs.ten}}', '{{*hs.cn}}', '{{*hs.gd}}'])

def fill_range(a, b, key):
    """Đoạn a…b là nội dung mẫu ⇒ đoạn a = {{key}}, xoá phần còn lại."""
    set_text(P(a), '{{%s}}' % key)
    for i in range(a + 1, b + 1): remove(P(i))

fill_range(259, 262, 'kh_khokhan')
fill_range(264, 266, 'kh_thuanloi')
fill_range(271, 276, 'kh_daoduc')
fill_range(278, 282, 'kh_vanhoa')
fill_range(284, 286, 'kh_laodong')
grid(TB[9], 2, 4, range(1, 9), 'ct')
fill_range(291, 292, 'kh_danhhieu')
fill_range(297, 298, 'bp_hs')
fill_range(300, 302, 'bp_cmhs')
fill_range(304, 305, 'bp_gvbm')
fill_range(307, 310, 'kh_detai')
set_text(P(312), '{{kh_dieuchinh}}')

# ── KẾ HOẠCH TỪNG THÁNG: 1 khối mẫu (tháng 10, 402…424) lặp {{#thang1}} (T9–T12) và {{#thang2}} (T1–T5) ──
proto = [copy.deepcopy(K[i]) for i in range(402, 425)]
xtd = copy.deepcopy(P(392))
pbk = copy.deepcopy(P(425))            # đoạn ngắt trang
def equal_cols(tbl):
    """Chia đều bề rộng các cột (bảng mẫu có cột quá hẹp ⇒ số bị xuống dòng)."""
    g = tbl.find(W('tblGrid')); gc = g.findall(W('gridCol'))
    tot = sum(int(x.get(W('w'))) for x in gc); n = len(gc); w = tot // n
    for x in gc: x.set(W('w'), str(w))
    for tr in rows(tbl):
        for tc in tcs(tr):
            pr = tc.find(W('tcPr')); sp = pr.find(W('gridSpan')) if pr is not None else None
            k = int(sp.get(W('val'))) if sp is not None else 1
            tw = pr.find(W('tcW')) if pr is not None else None
            if tw is not None: tw.set(W('w'), str(w * k)); tw.set(W('type'), 'dxa')

def month_block():
    els = [copy.deepcopy(e) for e in proto]
    m = {i: e for i, e in zip(range(402, 425), els)}
    pr = m[402].find(W('pPr'))
    if pr is None: pr = m[402].makeelement(W('pPr'), {}); m[402].insert(0, pr)
    pr.insert(0, pr.makeelement(W('pageBreakBefore'), {}))
    set_text(m[403], '{{.ten}}')
    set_text(m[405], '{{.kehoach}}')
    set_text(m[408], '{{.hoctap}}')
    set_text(m[410], '{{.renluyen}}')
    set_text(m[411], '{{.dsxl}}')
    t12, t13 = m[415], m[417]
    rs = rows(t12)
    for ci, c in enumerate(tcs(rs[0])[1:5]): cell_set(c, '{{.h%d}}' % (ci + 1))
    for ri, tr in enumerate(rs[1:]):
        for ci, c in enumerate(tcs(tr)[1:5]): cell_set(c, '{{.r%dw%d}}' % (ri + 1, ci + 1))
    for p in rows(t13)[0].iter(W('p')): replace_in(p, 'tháng 10', 'tháng {{.so}}')
    last = rows(t13)[-1]
    for ci, c in enumerate(tcs(last)): cell_set(c, '{{.x%d}}' % (ci + 1))
    equal_cols(t13)
    n = copy.deepcopy(xtd); set_text(n, 'Xếp thi đua tháng {{.so}}: {{.xtd}}')
    els.insert(els.index(m[418]), n)
    for i in range(419, 425): els.remove(m[i])
    return els

def put_block(after_el, name):
    ref = after_el
    mk = marker_par(xtd, '{{#%s}}' % name); ref.addnext(mk); ref = mk
    for e in month_block(): ref.addnext(e); ref = e
    mk2 = marker_par(xtd, '{{/%s}}' % name); ref.addnext(mk2)

anchor1 = P(312)
for i in range(313, 462): remove(K[i])
put_block(anchor1, 'thang1')
set_text(P(465), '{{img:sk_hk1}}'); set_text(P(466), '{{sk_hk1}}')
anchor2 = P(466)
for i in range(467, 599): remove(K[i])
put_block(anchor2, 'thang2')
set_text(P(602), '{{img:tk_nam}}'); set_text(P(603), '{{tk_nam}}')

# ── PHẦN IV ──
grid(TB[28], 2, 7, range(1, 10), 'cl')
grid(TB[29], 1, 2, range(1, 6), 'ctb'); grid(TB[29], 3, 3, range(0, 6), 'ctb')
fill_range(653, 653, 'dacdiem_noitroi')
keep_rows(TB[30], 1, ['{{*bh.ngay}}', '{{*bh.ten}}', '{{*bh.nd}}'])
keep_rows(TB[31], 1, ['{{*rl.stt}}', '{{*rl.ten}}'] + ['{{*rl.t%d}}' % m for m in (9, 10, 11, 12, 1, 2, 3, 4, 5)])
keep_rows(TB[32], 1, ['{{*ph.ngay}}', '{{*ph.dt}}', '{{*ph.nd}}'])
# sinh hoạt lớp: 2 dòng / tuần
rs = rows(TB[33])
cell_set(tcs(rs[0])[0], '{{*shl.tuan}}'); cell_set(tcs(rs[0])[1], '{{*shl.ngay}}')
for c in tcs(rs[1]): cell_set(c, '{{*shl.nd}}')
for r in rs[2:]: TB[33].remove(r)
# chuyên đề
set_text(P(773), 'THÁNG {{cd_thang}}')
set_text(P(774), 'Tuần: {{cd_tuan}}'); set_text(P(775), 'Thời gian tổ chức hoạt động: {{cd_thoigian}}')
set_text(P(776), 'Địa điểm: {{cd_diadiem}}'); set_text(P(777), 'Dự kiến nội dung: '); para_like(P(777), '{{cd_noidung}}')
# biên bản họp GVCN (816…832): giữ tiêu đề, nội dung = ô điền
for i in range(818, 831): remove(P(i))
set_text(P(816), 'BIÊN BẢN HỌP GIÁO VIÊN CHỦ NHIỆM – THÁNG {{hcn_thang}}') if 'BIÊN BẢN' in ''.join(t.text or '' for t in runs_t(P(816))) else None
para_like(P(817), '{{hcn_thongtin}}')
set_text(P(832), '{{hcn_noidung}}')
# biên bản họp CMHS: ảnh tải lên
set_text(P(860), '{{img:bb_daunam}}'); remove(P(865))
set_text(P(871), '{{img:bb_hk1}}')
set_text(P(874), '{{img:bb_cuoinam}}')
# tổng kết cả năm
set_text(P(915), '1. Số lượng học sinh đầu năm học: {{tk_dau}}')
set_text(P(916), '- Số học sinh cuối học kì I: {{tk_hk1}}\t\t(Tăng {{tk_hk1_tang}}\t\tgiảm {{tk_hk1_giam}}\t\t)')
set_text(P(917), '- Số học sinh cuối năm học: {{tk_cn}}\t\t(Tăng {{tk_cn_tang}}\t\tgiảm {{tk_cn_giam}}\t\t)')
set_text(P(919), '{{tk_lydo}}')
set_text(P(921), '- Kết quả học tập: Chưa đạt {{tk_bh_ht}}\t\t\t\t\tBệnh tật: {{tk_bh_bt}}')
set_text(P(922), '- Hoàn cảnh khó khăn: {{tk_bh_hc}}\t\t\t\t\tCác lý do khác: {{tk_bh_khac}}')
set_text(P(926), '{{tk_giaiphap}}')
grid(TB[34], 3, 6, [1, 2, 3, 4, 7, 8, 9, 10], 'c2m')
for ri, tr in enumerate(rows(TB[35])):
    for ci, c in enumerate(tcs(tr)):
        p = c.findall(W('p'))[0]
        p.append(copy.deepcopy(runs_t(p)[-1].getparent())) if runs_t(p) else None
        last = runs_t(p)[-1]; last.text = ' {{t35_%d_%d}}' % (ri, ci)
r36 = rows(TB[36])
for ri in (1, 2):
    c = tcs(r36[ri])[1]; ps = c.findall(W('p'))
    key = 'xl_lop' if ri == 1 else 'xl_cd'
    if len(ps) >= 2:
        set_text(ps[0], 'Cuối học kì I: {{%s_hk1}}' % key); set_text(ps[1], 'Cuối học kì II: {{%s_hk2}}' % key)
    else:
        set_text(ps[0], 'Cuối học kì I: {{%s_hk1}}    Cuối học kì II: {{%s_hk2}}' % (key, key))
c = tcs(r36[3])[0]; p = c.findall(W('p'))[-1]
para_like(p, '{{thanhtich}}')
# SKKN
for i, k in zip((962, 963, 964, 965), ('skkn_1', 'skkn_2', 'skkn_3', 'skkn_4')): para_like(P(i), '{{%s}}' % k)

# ── siêu dữ liệu ──
cp = d.core_properties
cp.author = 'Sổ theo dõi học sinh'; cp.last_modified_by = 'Sổ theo dõi học sinh'; cp.title = 'Sổ công tác chủ nhiệm'
cp.revision = 1

buf = io.BytesIO(); d.save(buf)
# bỏ ảnh dữ liệu cá nhân không còn được tham chiếu (sơ đồ lớp, biên bản họp) + customXml của file mẫu
zin = zipfile.ZipFile(io.BytesIO(buf.getvalue()))
doc = zin.read('word/document.xml').decode('utf8')
rels = zin.read('word/_rels/document.xml.rels').decode('utf8')
used = set(re.findall(r'r:(?:embed|id|link)="(rId\d+)"', doc))
keep_rels, drop = [], set()
for m in re.finditer(r'<Relationship [^>]*/>', rels):
    rel = m.group(0); rid = re.search(r'Id="(rId\d+)"', rel).group(1); tgt = re.search(r'Target="([^"]+)"', rel).group(1)
    if 'image' in rel and rid not in used: drop.add('word/' + tgt); continue
    keep_rels.append(rel)
rels2 = re.sub(r'<Relationship [^>]*/>', '', rels).replace('</Relationships>', ''.join(keep_rels) + '</Relationships>')
zout = zipfile.ZipFile(DST, 'w', zipfile.ZIP_DEFLATED)
for it in zin.infolist():
    if it.filename in drop: continue
    data = zin.read(it.filename)
    if it.filename == 'word/_rels/document.xml.rels': data = rels2.encode('utf8')
    zout.writestr(it, data)
zout.close()
print('Khuôn:', DST, '· bỏ ảnh:', sorted(drop))
