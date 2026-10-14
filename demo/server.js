/* ══ WEB DEMO — máy chủ ẢO chạy ngay trong trình duyệt (demo.html, demo-phu-huynh.html) ══
   · Nạp ĐẦU TIÊN trong <head> của trang demo (tools/demo/build.js tự chèn). KHÔNG có trong index.html / phu-huynh.html thật.
   · Mọi lệnh gọi tới script.google.com bị chặn và trả lời bằng DEMO.api ⇒ không bao giờ chạm máy chủ / Google Sheet thật.
   · Bộ nhớ tách riêng: mọi khoá localStorage của trang demo tự thêm tiền tố "d11:" ⇒ không lẫn với sổ thật trên cùng máy.
   · Dữ liệu ẢO (tên học sinh giả), tạo theo ngày hôm nay: từ tháng 9 đến tháng hiện tại; lưu ở d11:hk_demo_db_v2.
   · Email hệ thống gửi đi (phụ huynh, giáo viên chủ nhiệm, ban giám hiệu…) không gửi thật — vào Hộp thư mô phỏng (DEMO.mails).
   · Lệnh backend mới ⇒ thêm `case` trong api() (và htdemo.js cho phần học tập / sổ chủ nhiệm). */
(function () {
  'use strict';
  /* ── 1. tách bộ nhớ ── */
  var PFX = 'd11:', SP = Storage.prototype, oG = SP.getItem, oS = SP.setItem, oR = SP.removeItem;
  var REAL = (function () { try { return window.localStorage; } catch (e) { return null; } })();
  function isL(st) { return REAL && st === REAL; }
  SP.getItem = function (k) { return oG.call(this, isL(this) ? PFX + k : k); };
  SP.setItem = function (k, v) { return oS.call(this, isL(this) ? PFX + k : k, v); };
  SP.removeItem = function (k) { return oR.call(this, isL(this) ? PFX + k : k); };
  function demoKeys() { var out = []; try { for (var i = 0; i < REAL.length; i++) { var k = REAL.key(i); if (k && k.indexOf(PFX) === 0) out.push(k.slice(PFX.length)); } } catch (e) {} return out; }
  var LS = REAL;
  function g(k) { try { return LS.getItem(k); } catch (e) { return null; } }
  function s(k, v) { try { v == null ? LS.removeItem(k) : LS.setItem(k, v); } catch (e) {} }

  var CODE = '11d3yenhoa';
  var PAGE = /phu-huynh/.test(location.pathname) ? 'ph' : 'app';
  var UNLOCKED = g('demo_ok') === '1';
  /* đã nhập mã ⇒ tự vào sổ (mặc định vai giáo viên chủ nhiệm) */
  if (UNLOCKED && PAGE === 'app' && !/^tok\./.test(g('hk_token') || '')) s('hk_token', 'tok.' + (g('demo_role') || 'gvcn'));
  ['hk_tour_gvcn', 'hk_tour_cb', 'hkph_tour'].forEach(function (k) { if (g(k) == null) s(k, '1'); });

  /* ── 2. dữ liệu ảo ── */
  function pad(n) { return String(n).padStart(2, '0'); }
  var NOW = new Date();
  /* tháng đang học (năm học 2026 – 2027: tháng 9/2026 → 5/2027); ngoài khoảng đó ⇒ tháng 10 */
  var Y0 = 2026, cur = NOW.getMonth() + 1, ny = NOW.getFullYear();
  var inYear = (ny === Y0 && cur >= 9) || (ny === Y0 + 1 && cur <= 5);
  var THANG = inYear ? cur : 10, DAY = inYear ? NOW.getDate() : 15;
  var MONTHS = []; for (var mm = 9; ; mm = mm % 12 + 1) { MONTHS.push(mm); if (mm === THANG) break; }
  function yearOf(m) { return m >= 9 ? Y0 : Y0 + 1; }
  function wkOf(d) { return Math.min(4, Math.max(1, Math.ceil(d / 7))); }
  var TUAN = wkOf(DAY);

  var HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Ngô'];
  var DEM = ['Minh', 'Thu', 'Gia', 'Bảo', 'Ngọc', 'Hải', 'Khánh', 'Phương', 'Đức', 'Thanh'];
  var TEN = ['An', 'Bình', 'Chi', 'Dũng', 'Hằng', 'Hà', 'Hưng', 'Khoa', 'Lan', 'Linh', 'Long', 'Mai', 'Nam', 'Nga', 'Phúc', 'Quân', 'Sơn', 'Trang', 'Tú', 'Vy'];
  var ME = {
    gvcn: { name: 'Nguyễn Thu Thảo', role: 'GVCN', email: 'co.thao@demo.vn', to: '' },
    lt: { name: 'Nguyễn Minh An', role: 'Cán bộ lớp', email: 'loptruong@demo.vn', to: '1' },
    ph: { name: 'Phụ huynh', role: 'Phụ huynh', email: '', to: '' }
  };
  var ROLE_T = { gvcn: 'Giáo viên chủ nhiệm', lt: 'Cán bộ lớp', ph: 'Cha mẹ học sinh' };
  function rnd(seed) { var x = seed; return function () { x = (x * 9301 + 49297) % 233280; return x / 233280; }; }
  function build() {
    var r = rnd(11), students = [], i, used = {};
    for (i = 0; i < 40; i++) {
      var ten, j = 0;   /* tên giả, không trùng nhau */
      do { ten = HO[(i * 7 + j) % 10] + ' ' + DEM[(i * 3 + j * 7) % 10] + ' ' + TEN[(i * 11 + j * 3) % 20]; j++; } while (used[ten]);
      used[ten] = 1;
      students.push({ ma: 'HS' + pad(i + 1), ten: ten, to: String(1 + (i % 4)),
        chucVu: i === 0 ? 'Lớp trưởng' : (i < 4 ? 'Tổ trưởng' : 'Học sinh'), trangThai: 'Đang học',
        email: i % 5 !== 4 ? 'phuhuynh.hs' + pad(i + 1) + '@demo.vn' : '' });
    }
    var tru = [
      { ma: 'T01', nhom: 'Nề nếp', noiDung: 'Đi học muộn', diem: -2, active: true, dienGiai: 'Có mặt sau tiếng trống vào lớp.' },
      { ma: 'T02', nhom: 'Nề nếp', noiDung: 'Không mặc đồng phục', diem: -2, active: true, dienGiai: '' },
      { ma: 'T03', nhom: 'Học tập', noiDung: 'Không làm bài tập', diem: -3, active: true, dienGiai: 'Giáo viên báo.' },
      { ma: 'T04', nhom: 'Học tập', noiDung: 'Nói chuyện riêng', diem: -1, active: true, dienGiai: '' },
      { ma: 'T05', nhom: 'Kỷ luật', noiDung: 'Dùng điện thoại trong giờ', diem: -5, active: true, dienGiai: '' },
      { ma: 'T06', nhom: 'Vệ sinh', noiDung: 'Không trực nhật', diem: -3, active: true, dienGiai: '' }];
    var cong = [
      { ma: 'C01', nhom: 'Học tập', noiDung: 'Phát biểu xây dựng bài', diem: 1, active: true, dienGiai: '' },
      { ma: 'C02', nhom: 'Học tập', noiDung: 'Điểm 9–10 kiểm tra', diem: 2, active: true, dienGiai: '' },
      { ma: 'C03', nhom: 'Phong trào', noiDung: 'Tham gia phong trào', diem: 3, active: true, dienGiai: '' }];
    var entries = [], id = 1, remarks = [], khoa = {};
    MONTHS.forEach(function (th) {
      var last = th === THANG ? TUAN : 4;
      for (var tu = 1; tu <= last; tu++) students.forEach(function (st) {
        var k = r(), who = k < 0.5 ? ['loptruong@demo.vn', 'Nguyễn Minh An'] : ['totruong2@demo.vn', 'Trần Hải Bình'];
        var day = Math.min(28, tu * 7 - 3 + Math.floor(r() * 3)); if (th === THANG && day > DAY) day = DAY;
        var dt = yearOf(th) + '-' + pad(th) + '-' + pad(day);
        if (k < 0.3) { var c = tru[Math.floor(r() * tru.length)];
          entries.push(['D' + id++, dt + ' 07:1' + tu, th, tu, st.ma, st.to, 'Trừ', c.ma, c.noiDung, c.diem, who[0], who[1], '']); }
        if (k > 0.82) { var d = cong[Math.floor(r() * cong.length)];
          entries.push(['D' + id++, dt + ' 09:0' + tu, th, tu, st.ma, st.to, 'Cộng', d.ma, d.noiDung, d.diem, who[0], who[1], '']); }
      });
      if (th !== THANG) { khoa[th] = { by: ME.gvcn.name, at: (th === 12 ? (Y0 + 1) + '-01' : yearOf(th % 12 + 1) + '-' + pad(th % 12 + 1)) + '-01 16:30' };
        remarks.push({ maHS: 'HS03', thang: th, nhanXet: 'Em tiến bộ rõ, cần đúng giờ hơn.', xepLoai: 'Khá' }, { maHS: 'HS05', thang: th, nhanXet: 'Ngoan, tích cực phát biểu.', xepLoai: 'Tốt' }); }
    });
    return { v: 3, made: THANG + '-' + TUAN, rev: 1, students: students, tru: tru, cong: cong, entries: entries, remarks: remarks, nid: id,
      cfg: { namHoc: '2026 - 2027', lop: '11D3', gvcn: ME.gvcn.name, thang: THANG, soTuan: 4,
        thresholds: [{ ten: 'Tốt', san: 0 }, { ten: 'Khá', san: -6 }, { ten: 'Trung bình', san: -12 }, { ten: 'Yếu', san: -9999 }] },
      khoa: khoa, phMail: { on: true, cong: true },
      phReg: [{ id: 'R1', ma: 'HS02', ten: students[1].ten, email: 'me.hs02@demo.vn', at: yearOf(THANG) + '-' + pad(THANG) + '-' + pad(Math.max(1, DAY - 1)) + ' 07:45' }],
      quyDinh: { xepThuLop: 5, heSoTaiPham: 2, chiTieu: [{ tu: 1, den: 5, min: 0, max: 1 }, { tu: 6, den: 8, min: 1, max: 2 }] },
      thongBao: { mode: 'Ngay', emails: 'co.thao@demo.vn', nguong: 0, baoCong: true },
      accounts: [
        { email: 'co.thao@demo.vn', ten: ME.gvcn.name, role: 'GVCN', to: '', active: true },
        { email: 'loptruong@demo.vn', ten: 'Nguyễn Minh An', role: 'Cán bộ lớp', to: '', active: true },
        { email: 'totruong2@demo.vn', ten: 'Trần Hải Bình', role: 'Cán bộ lớp', to: '', active: true }],
      theme: '', mails: [], ev: {}, reg: {} };
  }
  var DB = null;
  function load() { if (DB) return DB; try { DB = JSON.parse(g('hk_demo_db_v2') || 'null'); } catch (e) { DB = null; } if (!DB || DB.v !== 3) { DB = build(); save(); } return DB; }
  function save() { try { LS.setItem('hk_demo_db_v2', JSON.stringify(DB)); } catch (e) { DB.ev = {}; if (DB.ht) DB.ht.img = {}; try { LS.setItem('hk_demo_db_v2', JSON.stringify(DB)); } catch (e2) {} } }
  function now() { var d = new Date(); return yearOf(THANG) + '-' + pad(THANG) + '-' + pad(DAY) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function stu(ma) { return DB.students.filter(function (x) { return x.ma === ma; })[0]; }
  function nz(n) { return (n > 0 ? '+' : '') + n; }
  function ten1(t) { return String(t || '').trim().split(/\s+/).pop(); }
  function mail(o) { o.id = 'M' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); o.at = now(); o.unread = true; DB.mails.unshift(o); DB.mails = DB.mails.slice(0, 60); save();
    try { window.dispatchEvent(new CustomEvent('demo-mail', { detail: o })); } catch (e) {} }
  var BASE = location.href.replace(/[#?].*$/, '').replace(/[^/]*$/, '');

  /* email mô phỏng gửi cha mẹ học sinh — cùng nội dung với máy chủ thật (KhoaThang.gs ▸ guiPhuHuynh_) */
  function loiNhan(con, items, me) {
    var tru = items.filter(function (e) { return e[9] < 0; });
    if (tru.length) {
      var nTru = me.filter(function (e) { return e[9] < 0; }).length, lan = 0;
      tru.forEach(function (e) { var n = me.filter(function (x) { return x[7] === e[7] && x[9] < 0; }).length; if (n > lan) lan = n; });
      if (nTru >= 5 || lan >= 3) return { emo: 'lo-lang', loi: 'Tháng này ' + con + ' đã có <b>' + nTru + '</b> lần bị trừ điểm. Cô Thảo mong bác dành thời gian trò chuyện với con và cùng phối hợp để giúp con tiến bộ hơn ạ.' };
      if (lan === 2) return { emo: 'nghiem', loi: 'Đây là lần thứ 2 trong tháng ' + con + ' mắc lỗi này. Cô Thảo nhờ bác nhắc nhở để con không tái phạm nữa ạ.' };
      return { emo: 'buon', loi: 'Đây là lần đầu trong tháng con mắc lỗi này. Cô Thảo nhờ bác nhắc nhẹ ' + con + ', cô Thảo tin con sẽ cố gắng hơn ạ.' };
    }
    var t = items.reduce(function (a, e) { return a + e[9]; }, 0);
    return t >= 3 ? { emo: 'khen-lon', loi: 'Cô Thảo rất vui vì ' + con + ' đã cố gắng nhiều. Bác dành lời khen cho con nhé ạ!' } : { emo: 'vui', loi: 'Cô Thảo báo tin vui để bác cùng động viên ' + con + ' ạ!' };
  }
  function mailPhuHuynh(st, items) {
    if (!st || !st.email || !DB.phMail.on) return;
    var tru = items.some(function (e) { return e[9] < 0; }); if (!tru && !DB.phMail.cong) return;
    var th = items[0][2], me = DB.entries.filter(function (e) { return e[4] === st.ma && e[2] === th; });
    var tong = me.reduce(function (a, e) { return a + e[9]; }, 0), con = 'con <b>' + ten1(st.ten) + '</b>', L = loiNhan(con, items, me);
    var rows = items.map(function (e) { return '<tr><td style="padding:6px 10px;border-bottom:1px solid #EEF2F3;text-align:left">' + e[8] + (e[12] ? '<div style="color:#6C8A93;font-size:12px">' + e[12] + '</div>' : '') + '</td><td style="padding:6px 10px;border-bottom:1px solid #EEF2F3;text-align:right;font-weight:800;color:' + (e[9] < 0 ? '#C0392B' : '#1E8449') + '">' + nz(e[9]) + '</td></tr>'; }).join('');
    var link = BASE + 'demo-phu-huynh.html#hs=' + st.ma + '&tb=' + items.map(function (e) { return e[0]; }).join(',');
    mail({ kind: 'tb', to: st.email, from: 'Cô Thảo · Sổ theo dõi học sinh 11D3', link: link,
      subject: (tru ? '[11D3] Cô Thảo cập nhật rèn luyện của con ' : 'Tin vui: con ') + st.ten + (tru ? '' : ' được cộng điểm'),
      html: '<div style="font-family:Aptos,Arial,sans-serif;max-width:560px;color:#1B333A"><img src="' + BASE + 'mascot/chu-nhiem/png/' + L.emo + '.png" width="110" style="float:right;margin:0 0 6px 10px" alt="">'
        + '<div style="color:#6C8A93;font-size:12px">LỚP 11D3 · THPT YÊN HÒA</div><div style="font-size:19px;font-weight:800;color:#0A5C64;margin:4px 0">Cô Thảo xin cập nhật cho bác về con ' + st.ten + '</div>'
        + '<p style="line-height:1.55">' + L.loi + '</p><table style="border-collapse:collapse;width:100%;clear:both;font-size:14px">' + rows + '</table>'
        + '<p>Tổng điểm tháng ' + th + ' của con: <b style="color:' + (tong < 0 ? '#C0392B' : '#1E8449') + '">' + nz(tong) + '</b></p>'
        + '<p><a href="' + link + '" style="display:inline-block;background:#0E7C86;color:#fff;text-decoration:none;padding:10px 18px;border-radius:10px;font-weight:bold">Xem chi tiết &amp; tải PDF thông báo</a></p></div>' });
  }

  /* ── 3. máy chủ ảo ── */
  function base(who) {
    var me = ME[who] || ME.ph;
    var o = { ok: true, me: me, cfg: DB.cfg, students: DB.students, cong: DB.cong, tru: DB.tru, accounts: DB.accounts, thongBao: DB.thongBao,
      sheetUrl: '', quyDinh: DB.quyDinh, thang: DB.cfg.thang, theme: DB.theme, khoa: DB.khoa, rev: String(DB.rev),
      data: { entries: DB.entries.filter(function (e) { return e[2] === DB.cfg.thang; }), remarks: DB.remarks } };
    if (who === 'gvcn') { o.phMail = DB.phMail; o.phReg = DB.phReg; }
    if (who === 'ph') o.data.entries = o.data.entries.map(function (e) { e = e.slice(); if (e[13]) e[13] = '1'; return e; });
    return o;
  }
  function locked(a, p) {
    var th = /^(addEntries|saveRemark)$/.test(a) ? Number(p.thang)
      : /^(updateEntry|deleteEntry)$/.test(a) ? ((DB.entries.filter(function (e) { return e[0] === p.id; })[0] || [])[2])
      : a === 'addEvidence' ? ((DB.entries.filter(function (e) { return e[0] === (p.entryIds || [])[0]; })[0] || [])[2])
      : a === 'delEvidence' ? ((DB.entries.filter(function (e) { return e[0] === p.entryId; })[0] || [])[2]) : null;
    return th && DB.khoa[th] ? th : null;
  }
  function api(a, p, tok) {
    load(); p = p || {};
    var who = (String(tok || '').match(/^tok\.(\w+)/) || [])[1], me = ME[who], write = false, r;
    var lk = locked(a, p);
    if (lk) return { ok: false, error: 'Tháng ' + lk + ' đã được giáo viên chủ nhiệm khoá sổ, không thêm, sửa, xoá được nữa.' };
    if (window.HTDEMO) {
      DB.ht = DB.ht || HTDEMO.build(DB.students);
      var hr = HTDEMO.api(DB.ht, a, p, who, DB.students);
      if (hr) {
        (DB.ht.mails || []).splice(0).forEach(function (m) { mail({ kind: 'ht', to: m.to, from: 'Giáo viên chủ nhiệm ' + ME.gvcn.name, subject: m.subject, html: m.html + (m.files && m.files.length ? '<p><i>Tệp đính kèm: ' + m.files.join(', ') + '</i></p>' : '') }); });
        save(); return hr;
      }
    }
    switch (a) {
      case 'loginKhach': r = { ok: true, token: 'tok.ph', boot: base('ph') }; break;
      case 'bootstrap': r = who ? base(who) : { ok: false, error: 'Phiên đăng nhập hết hạn' }; break;
      case 'roster': r = { ok: true, members: [] }; break;
      case 'otpStart': case 'otpVerify': case 'login':
        r = { ok: false, error: 'Bản demo không dùng email — nhập mã truy cập 11D3Yenhoa ở màn hình đầu.' }; break;
      case 'sync':
        if (p.rev && p.rev === String(DB.rev)) { r = { ok: true, rev: String(DB.rev), same: true }; break; }
        r = { ok: true, rev: String(DB.rev), khoa: DB.khoa, entries: DB.entries.filter(function (e) { return !p.thangs || p.thangs.indexOf(e[2]) >= 0; }).map(function (e) { e = e.slice(); if (who === 'ph' && e[13]) e[13] = '1'; return e; }), remarks: DB.remarks };
        if (who === 'gvcn') r.phReg = DB.phReg; break;
      case 'entries': r = { ok: true, entries: DB.entries.filter(function (e) { return !p.thangs || p.thangs.indexOf(e[2]) >= 0; }).map(function (e) { e = e.slice(); if (who === 'ph' && e[13]) e[13] = '1'; return e; }), remarks: DB.remarks }; break;
      case 'addEntries':
        if (!me || who === 'ph') { r = { ok: false, error: 'Tài khoản này không ghi nề nếp.' }; break; }
        if (p.rid && DB.reg['rid:' + p.rid]) { r = DB.reg['rid:' + p.rid]; r.dup = true; break; }
        var out = (p.items || []).map(function (x) { var st = stu(x.maHS) || {};
          var e = ['D' + (DB.nid++), now(), Number(p.thang), Number(p.tuan), x.maHS, st.to, x.loai, x.maMuc, x.noiDung, x.diem, me.email, me.name, x.ghiChu || ''];
          DB.entries.push(e); return e; });
        r = { ok: true, ids: out.map(function (e) { return e[0]; }) }; if (p.rid) DB.reg['rid:' + p.rid] = r; write = true;
        var by = {}; out.forEach(function (e) { (by[e[4]] = by[e[4]] || []).push(e); });
        setTimeout(function () { Object.keys(by).forEach(function (ma) { mailPhuHuynh(stu(ma), by[ma]); }); }, 400);
        break;
      case 'deleteEntry': DB.entries = DB.entries.filter(function (e) { return e[0] !== p.id; }); r = { ok: true }; write = true; break;
      case 'updateEntry': DB.entries.forEach(function (e) { if (e[0] === p.id) { if (p.tuan) e[3] = Number(p.tuan); if (p.diem != null) e[9] = Number(p.diem); if (p.ghiChu != null) e[12] = p.ghiChu; } }); r = { ok: true }; write = true; break;
      case 'saveRemark':
        if (who !== 'gvcn') { r = { ok: false, error: 'Chỉ giáo viên chủ nhiệm được nhận xét, xác nhận xếp loại.' }; break; }
        DB.remarks = DB.remarks.filter(function (x) { return !(x.maHS === p.maHS && x.thang === Number(p.thang)); });
        DB.remarks.push({ maHS: p.maHS, thang: Number(p.thang), xepLoai: p.xepLoai || '', nhanXet: p.nhanXet || '' }); r = { ok: true }; write = true; break;
      case 'lockMonth':
        if (who !== 'gvcn') { r = { ok: false, error: 'Chỉ giáo viên chủ nhiệm được khoá sổ / mở khoá tháng.' }; break; }
        if (p.lock === false) delete DB.khoa[p.thang]; else DB.khoa[p.thang] = { by: ME.gvcn.name, at: now() };
        r = { ok: true, khoa: DB.khoa }; write = true; break;
      case 'addEvidence': var fid = 'F' + Date.now().toString(36); DB.ev[fid] = { n: p.name, m: p.mime, data: p.data };
        (p.entryIds || []).forEach(function (eid) { DB.entries.forEach(function (e) { if (e[0] === eid) e[13] = (e[13] ? e[13] + ';' : '') + fid + '|' + p.name + '|' + p.mime; }); });
        r = { ok: true, file: { id: fid, n: p.name, m: p.mime } }; write = true; break;
      case 'getEvidence': var f = DB.ev[p.id]; r = f ? { ok: true, name: f.n, mime: f.m, data: f.data } : { ok: false, error: 'Ảnh minh chứng không còn (bộ nhớ demo đầy).' }; break;
      case 'delEvidence': DB.entries.forEach(function (e) { if (e[0] === p.entryId) e[13] = String(e[13] || '').split(';').filter(function (x) { return x.indexOf(p.fileId + '|') !== 0; }).join(';'); }); r = { ok: true }; write = true; break;
      case 'savePhMail': DB.phMail = { on: p.on !== false, cong: p.cong !== false }; r = { ok: true, phMail: DB.phMail }; break;
      case 'phDangKy':
        var em = String(p.email || '').trim().toLowerCase(), sx = stu(p.ma);
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { r = { ok: false, error: 'Email chưa đúng.' }; break; }
        DB.reg['ph:' + em] = p.ma;
        mail({ kind: 'code', to: em, from: 'Sổ theo dõi học sinh 11D3', subject: 'Mã xác nhận đăng ký nhận thông báo rèn luyện: 123456',
          html: '<div style="font-family:Aptos,Arial,sans-serif;max-width:480px"><p>Kính gửi bác,</p><p>Mã xác nhận để nhận thông báo rèn luyện của con <b>' + (sx ? sx.ten : '') + '</b> là:</p><p style="font-size:30px;font-weight:800;letter-spacing:6px;color:#0A5C64">123456</p><p style="color:#6C8A93;font-size:13px">(Bản demo: mã luôn là 123456.)</p></div>' });
        r = { ok: true, ten: sx && sx.ten }; break;
      case 'phXacNhan':
        var em2 = String(p.email || '').trim().toLowerCase(), ma2 = DB.reg['ph:' + em2];
        if (!ma2) { r = { ok: false, error: 'Mã đã hết hạn. Bác bấm gửi lại mã nhé.' }; break; }
        if (String(p.code) !== '123456') { r = { ok: false, error: 'Mã chưa đúng ạ. (Bản demo: mã là 123456)' }; break; }
        delete DB.reg['ph:' + em2]; var s2 = stu(ma2);
        var rec = { id: 'R' + (Date.now() % 100000), ma: ma2, ten: s2 ? s2.ten : ma2, email: em2, at: now() };
        DB.phReg.push(rec); write = true;
        mail({ kind: 'gv', to: ME.gvcn.email, from: 'Sổ theo dõi học sinh 11D3', subject: '[11D3] Phụ huynh của ' + rec.ten + ' đăng ký nhận thông báo — cô duyệt giúp nhé',
          html: '<div style="font-family:Aptos,Arial,sans-serif;max-width:520px"><p>Chào cô Thảo,</p><p>Phụ huynh của <b>' + rec.ten + '</b> (' + em2 + ') vừa đăng ký nhận email thông báo rèn luyện. Hiện có <b>' + DB.phReg.length + '</b> đăng ký chờ cô duyệt (mục Quản lý ▸ Cha mẹ học sinh).</p></div>' });
        r = { ok: true, cho: true }; break;
      case 'phDuyet':
        if (who !== 'gvcn') { r = { ok: false, error: 'Chỉ giáo viên chủ nhiệm duyệt đăng ký của phụ huynh.' }; break; }
        var rr = DB.phReg.filter(function (x) { return x.id === p.id; })[0]; DB.phReg = DB.phReg.filter(function (x) { return x.id !== p.id; });
        if (rr && p.ok !== false) { var s3 = stu(rr.ma); if (s3) s3.email = (s3.email ? s3.email + ', ' : '') + rr.email;
          mail({ kind: 'duyet', to: rr.email, from: 'Cô Thảo · Sổ theo dõi học sinh 11D3', subject: 'Cô Thảo đã duyệt — bác sẽ nhận thông báo rèn luyện của con ' + rr.ten,
            html: '<div style="font-family:Aptos,Arial,sans-serif;max-width:560px"><img src="' + BASE + 'mascot/chu-nhiem/png/cam-on.png" width="110" style="float:right" alt=""><p>Kính gửi bác,</p><p>Cô Thảo đã duyệt đăng ký của bác. Từ nay, mỗi khi con <b>' + rr.ten + '</b> được cộng hoặc bị trừ điểm, bác sẽ nhận email kèm lời nhắn của cô Thảo về con ạ.</p><p style="clear:both"><i>Tệp đính kèm: HDSD_Phu_huynh.pdf</i></p></div>' }); }
        r = { ok: true, dangKy: DB.phReg }; write = true; break;
      case 'saveStudents': if (who !== 'gvcn') { r = { ok: false, error: 'Chỉ giáo viên chủ nhiệm được sửa danh sách lớp.' }; break; } DB.students = p.students || DB.students; r = { ok: true, students: DB.students }; write = true; break;
      case 'saveAccounts': if (who !== 'gvcn') { r = { ok: false, error: 'Chỉ giáo viên chủ nhiệm được sửa tài khoản.' }; break; } DB.accounts = p.accounts || DB.accounts; r = { ok: true }; break;
      case 'saveConfig': if (p.thang) DB.cfg.thang = Number(p.thang); if (p.soTuan) DB.cfg.soTuan = Number(p.soTuan); if (p.thresholds) DB.cfg.thresholds = p.thresholds; r = { ok: true }; write = true; break;
      case 'saveQuyDinh': DB.quyDinh = p; r = { ok: true }; break;
      case 'saveNotify': DB.thongBao = p; r = { ok: true }; break;
      case 'saveCatalog': if (p.loai === 'Cộng' || p.loai === 'cong') DB.cong = p.items; else DB.tru = p.items; r = { ok: true }; break;
      case 'saveTheme': DB.theme = p.theme; r = { ok: true, theme: p.theme }; break;
      case 'testMail': r = { ok: true, quota: 99 }; mail({ kind: 'test', to: ME.gvcn.email, from: 'Sổ theo dõi học sinh 11D3', subject: 'Thư thử', html: '<p>Thư thử từ Sổ theo dõi học sinh (bản demo).</p>' }); break;
      case 'changePin': case 'resetPin': r = { ok: false, error: 'Bản demo không dùng mật khẩu.' }; break;
      default: r = { ok: true };
    }
    if (write) DB.rev++;
    save();
    return r;
  }
  function setRole(role) {
    ['hk_cache_v3', 'hk_cache_v4', 'hk_outbox_v1', 'hk_khoa', 'hk_htq_v1', 'hk_ht_v1', 'hkph_cache_v1', 'hkph_token'].forEach(function (k) { s(k, null); });
    s('demo_role', role === 'ph' ? null : role); s('hk_token', role === 'ph' ? null : 'tok.' + role);
  }
  window.DEMO = { on: true, page: PAGE, code: CODE, unlocked: UNLOCKED, api: api, ME: ME, ROLE_T: ROLE_T, keys: demoKeys,
    role: function () { return (String(g('hk_token') || '').match(/^tok\.(\w+)/) || [])[1] || (PAGE === 'ph' ? 'ph' : ''); },
    db: function () { return load(); }, mails: function () { return load().mails; },
    readAll: function () { load().mails.forEach(function (m) { m.unread = false; }); save(); },
    unlock: function (code) { if (String(code || '').replace(/\s+/g, '').toLowerCase() !== CODE) return false; s('demo_ok', '1'); return true; },
    lock: function () { demoKeys().forEach(function (k) { if (k !== 'hk_demo_db_v2') s(k, null); }); },
    setRole: setRole,
    reset: function () { DB = build(); save(); setRole(DEMO.role() || 'gvcn'); } };

  /* ── 4. chặn mọi lệnh gọi tới máy chủ thật ── */
  var of = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function (url, o) {
    var u = typeof url === 'string' ? url : (url && url.url) || '';
    if (!/script\.google(usercontent)?\.com/.test(u)) return of(url, o);
    var body = {}; try { body = JSON.parse((o && o.body) || '{}'); } catch (e) {}
    return new Promise(function (res) {
      setTimeout(function () {
        var r; try { r = body.action ? api(body.action, body.payload, body.token) : { ok: true }; } catch (e) { r = { ok: false, error: String(e.message || e) }; }
        res(new Response(JSON.stringify(r), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }, body.action === 'sync' ? 30 : 140);
    });
  };
  /* JSONP / sendBeacon / ảnh tới máy chủ thật: chặn luôn cho chắc */
  try { var oB = navigator.sendBeacon && navigator.sendBeacon.bind(navigator); if (oB) navigator.sendBeacon = function (u, d) { return /script\.google/.test(String(u)) ? true : oB(u, d); }; } catch (e) {}
  document.documentElement.classList.add('demo');
})();
