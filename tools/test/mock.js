/* Backend giả lập cho Sổ hạnh kiểm 11D3 (Playwright). Dữ liệu GIẢ — không dùng tên / điểm học sinh thật.
   newPage(browser, {as:'gvcn'|'lt'|'tt'|'ph'|null, lag, mobile, failWrite, flaky, khoa:{10:{…}}, phReg:[…]}) ; page.M.CALLS ghi mọi lệnh gọi. */
const HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Ngô'];
const DEM = ['Minh', 'Thu', 'Gia', 'Bảo', 'Ngọc', 'Hải', 'Khánh', 'Phương', 'Đức', 'Thanh'];
const TEN = ['An', 'Bình', 'Chi', 'Dũng', 'Hằng', 'Hà', 'Hưng', 'Khoa', 'Lan', 'Linh', 'Long', 'Mai', 'Nam', 'Nga', 'Phúc', 'Quân', 'Sơn', 'Trang', 'Tú', 'Vy'];
const TINY = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkaPhfDwAEZAJXIp2LhQAAAABJRU5ErkJggg==';
function rnd(seed) { let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }
function build() {
  const r = rnd(7), students = [];
  for (let i = 0; i < 40; i++) {
    const to = 1 + (i % 4);
    students.push({ ma: 'HS' + String(i + 1).padStart(2, '0'), ten: HO[i % 10] + ' ' + DEM[(i * 3) % 10] + ' ' + TEN[(i * 7) % 20], to: String(to),
      chucVu: i === 0 ? 'Lớp trưởng' : (i < 5 && i > 0 ? 'Tổ trưởng' : 'Học sinh'), trangThai: 'Đang học', email: '' });
  }
  const tru = [
    { ma: 'T01', nhom: 'Nề nếp', noiDung: 'Đi học muộn', diem: -2, active: true, dienGiai: 'Có mặt sau tiếng trống vào lớp.' },
    { ma: 'T02', nhom: 'Nề nếp', noiDung: 'Không mặc đồng phục', diem: -2, active: true, dienGiai: '' },
    { ma: 'T03', nhom: 'Học tập', noiDung: 'Không làm bài tập', diem: -3, active: true, dienGiai: 'Giáo viên bộ môn báo.' },
    { ma: 'T04', nhom: 'Học tập', noiDung: 'Nói chuyện riêng', diem: -1, active: true, dienGiai: '' },
    { ma: 'T05', nhom: 'Kỷ luật', noiDung: 'Dùng điện thoại trong giờ', diem: -5, active: true, dienGiai: '' },
    { ma: 'T06', nhom: 'Vệ sinh', noiDung: 'Không trực nhật', diem: -3, active: true, dienGiai: '' }];
  const cong = [
    { ma: 'C01', nhom: 'Học tập', noiDung: 'Phát biểu xây dựng bài', diem: 1, active: true, dienGiai: '' },
    { ma: 'C02', nhom: 'Học tập', noiDung: 'Điểm 9–10 kiểm tra', diem: 2, active: true, dienGiai: '' },
    { ma: 'C03', nhom: 'Phong trào', noiDung: 'Tham gia phong trào', diem: 3, active: true, dienGiai: '' }];
  const entries = []; let id = 1;
  for (const th of [9, 10]) for (let tu = 1; tu <= 4; tu++) for (const s of students) {
    const k = r();
    if (k < 0.35) { const c = tru[Math.floor(r() * tru.length)]; entries.push([ 'E' + id++, `2026-${String(th).padStart(2, '0')}-${String(tu * 6).padStart(2, '0')} 08:1${tu}`, th, tu, s.ma, s.to, 'Trừ', c.ma, c.noiDung, c.diem, 'lt@x', 'Lớp trưởng', '' ]); }
    if (k > 0.8) { const c = cong[Math.floor(r() * cong.length)]; entries.push([ 'E' + id++, `2026-${String(th).padStart(2, '0')}-${String(tu * 6).padStart(2, '0')} 09:0${tu}`, th, tu, s.ma, s.to, 'Cộng', c.ma, c.noiDung, c.diem, 'lt@x', 'Lớp trưởng', '' ]); }
  }
  const remarks = [{ maHS: 'HS03', thang: 9, nhanXet: 'Có tiến bộ, cần đúng giờ hơn.', xepLoai: '' }];
  return { students, tru, cong, entries, remarks };
}
const HTDEMO = require('../../demo/htdemo.js');
const EMAILS = { 'gvcn@example.com': 'gvcn', 'loptruong@example.com': 'lt', 'totruong2@example.com': 'tt', 'gvtoan@example.com': 'gvtoan' };
const ME = { gvcn: { name: 'Nguyễn Thu Thảo', role: 'GVCN', email: 'gvcn@example.com', to: '' },
  lt: { name: 'Nguyễn Minh An', role: 'Cán bộ lớp', email: 'loptruong@example.com', to: '1' },
  tt: { name: 'Trần Hải Bình', role: 'Tổ trưởng', email: 'totruong2@example.com', to: '2' },
  ph: { name: 'Phụ huynh', role: 'Phụ huynh', email: '', to: '' },
  gvtoan: { name: 'Phạm Thu Hà', role: 'Giáo viên bộ môn', email: 'gvtoan@example.com', to: '', mon: ['TOAN'] } };
async function newPage(browser, o = {}) {
  const ctx = await browser.newContext(Object.assign(o.mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : { viewport: { width: 1360, height: 860 } }, { locale: 'vi-VN' }, o.ctx || {}));
  const page = await ctx.newPage();
  const D = build(), M = page.M = { HT: null, CALLS: [], D, rev: 1, khoa: o.khoa || {}, phMail: { on: true, cong: true }, phReg: o.phReg || [], REG: {} };
  /* v3.2: người khác ghi / xoá (giả lập) ⇒ đổi rev */
  M.ext = (ma, muc, diem, who = 'Lớp trưởng') => { const s = D.students.find(x => x.ma === ma); const e = ['X' + Date.now() + Math.random().toString(36).slice(2, 5), '2026-10-08 10:05', 10, 1, ma, s.to, diem < 0 ? 'Trừ' : 'Cộng', 'T01', muc, diem, 'loptruong@example.com', who, '']; D.entries.push(e); M.rev++; return e[0]; };
  M.phNew = (ma, email) => { const s = D.students.find(x => x.ma === ma); M.phReg.push({ id: 'R' + (M.phReg.length + 100), ma, ten: s.ten, email, at: '2026-10-09 10:00' }); M.rev++; };
  M.extDel = id => { D.entries = D.entries.filter(e => e[0] !== id); M.rev++; };
  if (o.as) await ctx.addInitScript(t => { try { localStorage.setItem('hk_token', t); } catch (_) {} }, 'tok.' + o.as);
  if (!o.tour) await ctx.addInitScript(() => { try { ['hk_tour_gvcn', 'hk_tour_cb', 'hkph_tour'].forEach(k => localStorage.setItem(k, '1')); } catch (_) {} });
  if (o.time) await page.clock.setFixedTime(new Date(o.time));
  await page.route(/script\.google\.com/, async route => {
    const req = route.request(); let body = {};
    try { body = JSON.parse(req.postData() || '{}'); } catch (_) {}
    const u = new URL(req.url()); const q = Object.fromEntries(u.searchParams);
    const a = body.action || q.action, p = body.payload || (q.payload ? JSON.parse(q.payload) : {}), tok = body.token || q.token || '';
    M.CALLS.push({ a, p, tok, t: Date.now() });
    const who = (tok.match(/^tok\.(\w+)/) || [])[1];
    const cfg = { namHoc: '2026 - 2027', thang: 10, soTuan: 4, thresholds: [{ ten: 'Tốt', san: 0 }, { ten: 'Khá', san: -6 }, { ten: 'Trung bình', san: -12 }, { ten: 'Yếu', san: -9999 }] };
    const base = () => ({ ok: true, me: ME[who] || ME.ph, cfg, students: D.students, cong: D.cong, tru: D.tru,
      accounts: [{ email: 'gvcn@example.com', ten: 'Nguyễn Thu Thảo', role: 'GVCN', to: '', active: true }, { email: 'loptruong@example.com', ten: 'Nguyễn Minh An', role: 'Cán bộ lớp', to: '', active: true }],
      thongBao: { mode: 'Ngay', emails: '', nguong: 0, baoCong: true }, sheetUrl: 'https://docs.google.com/spreadsheets/d/FAKE/edit',
      quyDinh: { xepThuLop: 5, heSoTaiPham: 2, chiTieu: [{ tu: 1, den: 5, min: 0, max: 1 }, { tu: 6, den: 8, min: 1, max: 2 }] }, thang: 10, theme: M.theme || '',
      data: { entries: D.entries.filter(e => e[2] === 10), remarks: D.remarks }, rev: o.oldBackend ? undefined : String(M.rev),
      khoa: M.khoa, phMail: who === 'gvcn' ? M.phMail : undefined, phReg: who === 'gvcn' ? M.phReg : undefined });
    let res;
    if (!M.HT) M.HT = HTDEMO.build(D.students);
    { const hr = HTDEMO.api(M.HT, a, p, who, D.students); if (hr) { M.CALLS[M.CALLS.length - 1].ht = 1; if (o.lag) await new Promise(r => setTimeout(r, o.lag)); return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(hr) }); } }
    /* v3.7: tháng đã chốt ⇒ chặn ghi (giống kiemKhoa_ ở backend) */
    const thOf = () => /^(addEntries|saveRemark)$/.test(a) ? Number(p.thang) : /^(updateEntry|deleteEntry)$/.test(a) ? ((D.entries.find(e => e[0] === p.id) || [])[2]) : /^(addEvidence)$/.test(a) ? ((D.entries.find(e => e[0] === (p.entryIds || [])[0]) || [])[2]) : /^delEvidence$/.test(a) ? ((D.entries.find(e => e[0] === p.entryId) || [])[2]) : null;
    const lk = thOf();
    if (lk && M.khoa[lk]) { M.CALLS[M.CALLS.length - 1].blocked = true; return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ ok: false, error: 'Tháng ' + lk + ' đã được GVCN chốt hạnh kiểm — không thêm, sửa, xoá được nữa.' }) }); }
    if (o.lag) await new Promise(r => setTimeout(r, o.lag));
    if (a === 'otpStart') { const em = String(p.email || '').toLowerCase(); const who2 = EMAILS[em];
      res = !who2 ? { ok: false, error: 'Email này chưa được cấp quyền vào sổ. Bạn nhờ cô chủ nhiệm thêm email vào mục Tài khoản nhé.' }
          : (M.otpAt && Date.now() - M.otpAt < 45000 && !o.noGap) ? { ok: false, code: 'WAIT', error: 'Mã vừa được gửi. Đợi 40 giây rồi gửi lại.' }
          : (M.otpAt = Date.now(), M.otpEmail = em, { ok: true, gap: 45, name: ME[who2].name }); }
    else if (a === 'otpVerify') { const who2 = EMAILS[String(p.email || '').toLowerCase()];
      res = p.code === '123456' && who2 ? (() => { const b = base(); b.me = ME[who2]; return { ok: true, token: 'tok.' + who2, me: ME[who2], boot: b }; })() : { ok: false, error: 'Mã chưa đúng. Còn 4 lần thử.' }; }
    else if (a === 'addEvidence') { M.EV = M.EV || {}; const id = 'F' + (Object.keys(M.EV).length + 1); M.EV[id] = { n: p.name, m: p.mime, data: p.data };
      (p.entryIds || []).forEach(eid => { const e = D.entries.find(x => x[0] === eid); if (e) e[13] = (e[13] ? e[13] + ';' : '') + id + '|' + p.name + '|' + p.mime; });
      res = { ok: true, file: { id, n: p.name, m: p.mime } }; }
    else if (a === 'getEvidence') { const f = (M.EV || {})[p.id] || { n: 'anh.jpg', m: 'image/png', data: TINY }; res = { ok: true, name: f.n, mime: f.m, data: f.data }; }
    else if (a === 'delEvidence') { const e = D.entries.find(x => x[0] === p.entryId); if (e) e[13] = String(e[13] || '').split(';').filter(x => x.indexOf(p.fileId + '|') !== 0).join(';'); res = { ok: true }; }
    else if (a === 'lockMonth') { if (who !== 'gvcn') res = { ok: false, error: 'Chỉ GVCN được khoá sổ / mở khoá tháng.' }; else { if (p.lock === false) delete M.khoa[p.thang]; else M.khoa[p.thang] = { by: 'Nguyễn Thu Thảo', at: '2026-10-31 16:00' }; M.rev++; res = { ok: true, khoa: M.khoa }; } }
    else if (a === 'savePhMail') { M.phMail = { on: p.on !== false, cong: p.cong !== false }; res = { ok: true, phMail: M.phMail }; }
    else if (a === 'phDangKy') { if (!/@/.test(p.email || '')) res = { ok: false, error: 'Email chưa đúng.' }; else { M.REG[String(p.email).toLowerCase()] = p.ma; res = { ok: true, ten: (D.students.find(s => s.ma === p.ma) || {}).ten }; } }
    else if (a === 'phXacNhan') { const em = String(p.email || '').toLowerCase(), ma = M.REG[em]; if (!ma) res = { ok: false, error: 'Mã đã hết hạn. Các bác bấm gửi lại mã nhé.' }; else if (p.code !== '123456') res = { ok: false, error: 'Mã chưa đúng ạ.' }; else { delete M.REG[em]; M.phReg.push({ id: 'R' + (M.phReg.length + 1), ma, ten: (D.students.find(s => s.ma === ma) || {}).ten, email: em, at: '2026-10-08 10:00' }); res = { ok: true, cho: true }; } }
    else if (a === 'phDuyet' && p.ok !== false && p.pdfVer && !p.pdf && M.pdfVer !== p.pdfVer) res = { ok: false, code: 'NEED_PDF', error: 'Cần gửi kèm file hướng dẫn.' };
    else if (a === 'phDuyet') { if (p.pdf) { M.pdfVer = p.pdfVer; M.pdfLen = p.pdf.length; } const r = M.phReg.find(x => x.id === p.id); M.phReg = M.phReg.filter(x => x.id !== p.id); if (r && p.ok !== false) { const s = D.students.find(x => x.ma === r.ma); if (s) s.email = (s.email ? s.email + ', ' : '') + r.email; } res = { ok: true, dangKy: M.phReg }; }
    else if (a === 'saveTheme') { M.theme = p.theme; res = { ok: true, theme: p.theme }; }
    else if (a === 'roster') res = { ok: true, members: [{ id: 'gv', ten: 'Nguyễn Thu Thảo', role: 'GVCN', to: '', nhom: 'gvcn' }, { id: 'lt', ten: 'Nguyễn Minh An', role: 'Lớp trưởng', to: '1', nhom: 'canbo' }, { id: 'tt2', ten: 'Trần Hải Bình', role: 'Tổ trưởng', to: '2', nhom: 'canbo' }] };
    else if (a === 'login') res = (body.payload && body.payload.pin) ? Object.assign({ token: 'tok.' + ({ gv: 'gvcn', lt: 'lt', tt2: 'tt' }[p.id] || 'lt') }, { boot: (who2 => { const b = base(); b.me = ME[who2]; return b; })({ gv: 'gvcn', lt: 'lt', tt2: 'tt' }[p.id] || 'lt') }) : { ok: false, error: 'Sai mật khẩu' };
    else if (a === 'loginKhach') { res = { ok: true, token: 'tok.ph', boot: base() }; res.boot.me = ME.ph; }
    else if (a === 'bootstrap') res = who ? base() : { ok: false, error: 'Phiên đăng nhập hết hạn' };
    else if (a === 'sync') { res = o.oldBackend ? { ok: false, error: 'Không nhận ra yêu cầu: sync' }
      : (p.rev === String(M.rev) ? { ok: true, rev: String(M.rev), same: true }
      : { ok: true, rev: String(M.rev), khoa: M.khoa, phReg: who === 'gvcn' ? M.phReg : undefined, entries: D.entries.filter(e => !p.thangs || p.thangs.includes(e[2])).map(e => e.slice()), remarks: D.remarks }); }
    else if (a === 'entries') { const th = p.thangs; res = { ok: true, entries: D.entries.filter(e => !th || th.includes(e[2])), remarks: D.remarks }; }
    else if (a === 'addEntries') { if (p.rid && M.RID && M.RID[p.rid]) { res = M.RID[p.rid]; }
      else if (o.drop && o.drop.addEntries > 0) { o.drop.addEntries--; const out = (p.items || []).map((x, i) => { const e = ['E' + (D.entries.length + 1 + i), '2026-10-08 10:00', p.thang, p.tuan, x.maHS, '1', x.loai, x.maMuc, x.noiDung, x.diem, 'x', 'x', x.ghiChu || '']; D.entries.push(e); return e; }); (M.RID = M.RID || {})[p.rid] = { ok: true, ids: out.map(e => e[0]) }; return route.abort(); }
      else if (o.failWrite) res = { ok: false, error: 'Lỗi ghi (giả lập)' }; else { const out = (p.items || []).map((x, i) => { const e = ['E' + (D.entries.length + 1 + i), '2026-10-08 10:00', p.thang, p.tuan, x.maHS, (D.students.find(s => s.ma === x.maHS) || {}).to, x.loai, x.maMuc, x.noiDung, x.diem, 'x', 'x', x.ghiChu || '']; D.entries.push(e); return e; }); res = { ok: true, ids: out.map(e => e[0]) }; if (p.rid) (M.RID = M.RID || {})[p.rid] = res; } }
    else if (a === 'deleteEntry') { D.entries = D.entries.filter(e => e[0] !== p.id); res = { ok: true }; }
    else if (a === 'saveStudents') { M.saved = (M.saved || 0) + 1; if (who !== 'gvcn') res = { ok: false, error: 'Chỉ GVCN hoặc quản trị được sửa danh sách lớp.' }; else { D.students = p.students; res = { ok: true, students: p.students }; } }
    else if (a === 'saveAccounts') { res = who !== 'gvcn' ? { ok: false, error: 'Chỉ GVCN hoặc quản trị được sửa tài khoản.' } : { ok: true }; }
    else res = { ok: true };
    if (/^(addEntries|deleteEntry|updateEntry|addEvidence|delEvidence|saveRemark)$/.test(a) && res && res.ok && !res.dup) M.rev++;
    return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(res) });
  });
  return page;
}
module.exports = { newPage, build, ME, TINY };
