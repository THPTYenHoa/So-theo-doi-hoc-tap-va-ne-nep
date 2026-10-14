/* ══ RPT — báo cáo PDF KHỔ NGANG (A4 landscape) dùng chung cho index.html + phu-huynh.html ══
   RPT.student(D, ma, ky, {aud})  · hồ sơ 1 học sinh (tháng / học kỳ / cả năm): số nổi bật, biểu đồ, KẾT QUẢ HỌC TẬP (HT.gradePage), lỗi, khen, nhận xét, chi tiết
   RPT.notice(D, ma, ids)          · thông báo gửi phụ huynh: "Cô Thảo xin cập nhật…" cho các mục vừa ghi
   RPT.cls(M)                      · báo cáo lớp (mô hình số liệu do index.html dựng từ bcStats)
   RPT.open(html, title)           · in / lưu PDF qua iframe ẩn (khổ ngang). RPT.last = HTML vừa dựng (kiểm thử).
   D = {cfg, students, entries, remarks}; bản ghi: [id, lúc, tháng, tuần, mã HS, tổ, loại, mã mục, nội dung, điểm, email, người ghi, ghi chú, bằng chứng] */
(function () {
  'use strict';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var nz = function (v) { return (v > 0 ? '+' : '') + v; };
  var f1 = function (v) { return (Math.round(v * 10) / 10).toFixed(1); };
  var RC = ['#1E8449', '#1F618D', '#B9761C', '#C0392B'], RB = ['#E5F5EB', '#E7F0F8', '#FDF2E1', '#FCEDEA'];
  var MONTHS = [9, 10, 11, 12, 1, 2, 3, 4, 5], HK = { 1: [9, 10, 11, 12, 1], 2: [2, 3, 4, 5] };
  var ten1 = function (n) { var a = String(n || '').trim().split(/\s+/); return a[a.length - 1]; };
  function rankIdx(cfg, v) { var t = cfg.thresholds; for (var i = 0; i < t.length; i++) if (v >= t[i].san) return i; return t.length - 1; }
  function mc(emo, size, st) { var src = (window.MASCOT && MASCOT.rnd) ? MASCOT.rnd(emo, { any: true }) : 'mascot/chu-nhiem/' + emo + '.webp'; /* v3.9: ngẫu nhiên các bộ trang phục */ return '<img class="mc" src="' + src + '" style="width:' + size + 'px;height:' + size + 'px;' + (st || '') + '" alt="">'; }
  function dl(cur, prev, goodUp, fmt) {
    if (prev == null) return '';
    var d = cur - prev; if (Math.abs(d) < 0.05) return '<span class="dl eq">= kỳ trước</span>';
    var good = goodUp ? d > 0 : d < 0;
    return '<span class="dl ' + (good ? 'good' : 'bad') + '">' + (d > 0 ? '▲' : '▼') + ' ' + (fmt ? fmt(Math.abs(d)) : Math.abs(d)) + ' so kỳ trước</span>';
  }
  /* ── biểu đồ SVG ── */
  function line(pts, o) {
    o = o || {}; var W = o.w || 470, H = o.h || 200, P = 34, top = 22, bot = 28;
    var vs = pts.filter(function (p) { return p.v != null; }).map(function (p) { return p.v; });
    if (!vs.length) return '<div class="none">Chưa có dữ liệu</div>';
    var hi = Math.max(1, Math.max.apply(null, vs)), lo = Math.min(-1, Math.min.apply(null, vs)); var sp = hi - lo;
    var X = function (i) { return P + i * ((W - P * 2) / Math.max(1, pts.length - 1)); }, Y = function (v) { return top + (hi - v) / sp * (H - top - bot); };
    var g = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '"><line x1="' + (P - 10) + '" x2="' + (W - P + 10) + '" y1="' + Y(0) + '" y2="' + Y(0) + '" stroke="#C9D9DD" stroke-dasharray="4 4"/>';
    var d = '', a = '', first = -1, last = -1;
    pts.forEach(function (p, i) { if (p.v == null) return; d += (first < 0 ? 'M' : 'L') + X(i).toFixed(1) + ' ' + Y(p.v).toFixed(1) + ' '; if (first < 0) first = i; last = i; });
    if (first >= 0) a = d + 'L' + X(last).toFixed(1) + ' ' + Y(0).toFixed(1) + ' L' + X(first).toFixed(1) + ' ' + Y(0).toFixed(1) + ' Z';
    g += '<path d="' + a + '" fill="#0E7C86" opacity=".10"/><path d="' + d + '" fill="none" stroke="#0E7C86" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
    pts.forEach(function (p, i) {
      if (p.v != null) { var c = p.v < 0 ? '#C0392B' : '#1E8449';
        g += '<circle cx="' + X(i) + '" cy="' + Y(p.v) + '" r="5" fill="#fff" stroke="' + c + '" stroke-width="2.5"/><text x="' + X(i) + '" y="' + (Y(p.v) - 10) + '" text-anchor="middle" font-size="12" font-weight="800" fill="' + c + '">' + (o.fmt ? o.fmt(p.v) : f1(p.v)) + '</text>'; }
      g += '<text x="' + X(i) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="11.5" fill="#5C7A83" font-weight="600">' + esc(p.k) + '</text>';
    });
    return g + '</svg>';
  }
  function bars2(rows, o) {   /* rows [{k, a: cộng, b: trừ (dương)}] */
    o = o || {}; var W = o.w || 470, H = o.h || 200, P = 26, top = 22, bot = 28;
    if (!rows.length) return '<div class="none">Chưa có dữ liệu</div>';
    var mx = Math.max(1, Math.max.apply(null, rows.map(function (r) { return Math.max(r.a, r.b); })));
    var bw = (W - P * 2) / rows.length, g = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">';
    rows.forEach(function (r, i) {
      var x = P + i * bw, w = Math.min(26, bw * .3), base = H - bot, hA = r.a / mx * (H - top - bot), hB = r.b / mx * (H - top - bot);
      g += '<rect x="' + (x + bw / 2 - w - 2) + '" y="' + (base - hA) + '" width="' + w + '" height="' + Math.max(1.5, hA) + '" rx="3" fill="#1E8449"/>'
        + '<rect x="' + (x + bw / 2 + 2) + '" y="' + (base - hB) + '" width="' + w + '" height="' + Math.max(1.5, hB) + '" rx="3" fill="#C0392B"/>';
      if (r.a) g += '<text x="' + (x + bw / 2 - w / 2 - 2) + '" y="' + (base - hA - 5) + '" text-anchor="middle" font-size="11" font-weight="800" fill="#1E8449">+' + r.a + '</text>';
      if (r.b) g += '<text x="' + (x + bw / 2 + w / 2 + 2) + '" y="' + (base - hB - 5) + '" text-anchor="middle" font-size="11" font-weight="800" fill="#C0392B">−' + r.b + '</text>';
      g += '<text x="' + (x + bw / 2) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="11.5" fill="#5C7A83" font-weight="600">' + esc(r.k) + '</text>';
    });
    return g + '<line x1="' + P + '" x2="' + (W - P) + '" y1="' + (H - bot) + '" y2="' + (H - bot) + '" stroke="#DEEAEC"/></svg>'
      + '<div class="lg"><i style="background:#1E8449"></i>Điểm cộng <i style="background:#C0392B;margin-left:10px"></i>Điểm trừ</div>';
  }
  function donut(vals, names, o) {
    o = o || {}; var S = o.size || 150, R = S / 2 - 10, r = R - 22, cx = S / 2, tot = vals.reduce(function (a, b) { return a + b; }, 0) || 1, a0 = -Math.PI / 2;
    var g = '<svg width="' + S + '" height="' + S + '" viewBox="0 0 ' + S + ' ' + S + '">';
    vals.forEach(function (v, i) {
      if (!v) return; var a1 = a0 + v / tot * Math.PI * 2, big = a1 - a0 > Math.PI ? 1 : 0;
      if (v === tot) g += '<circle cx="' + cx + '" cy="' + cx + '" r="' + (R + r) / 2 + '" fill="none" stroke="' + RC[i] + '" stroke-width="' + (R - r) + '"/>';
      else g += '<path d="M' + (cx + R * Math.cos(a0)) + ' ' + (cx + R * Math.sin(a0)) + ' A' + R + ' ' + R + ' 0 ' + big + ' 1 ' + (cx + R * Math.cos(a1)) + ' ' + (cx + R * Math.sin(a1))
        + ' L' + (cx + r * Math.cos(a1)) + ' ' + (cx + r * Math.sin(a1)) + ' A' + r + ' ' + r + ' 0 ' + big + ' 0 ' + (cx + r * Math.cos(a0)) + ' ' + (cx + r * Math.sin(a0)) + ' Z" fill="' + RC[i] + '"/>';
      a0 = a1;
    });
    g += '<text x="' + cx + '" y="' + (cx + 2) + '" text-anchor="middle" font-size="22" font-weight="800" fill="#1B333A">' + esc(o.center || '') + '</text><text x="' + cx + '" y="' + (cx + 20) + '" text-anchor="middle" font-size="10.5" fill="#5C7A83">' + esc(o.sub || '') + '</text></svg>';
    return '<div class="dn">' + g + '<div class="dnl">' + names.map(function (n, i) { return '<div><i style="background:' + RC[i] + '"></i>' + esc(n) + ' <b>' + vals[i] + '</b>' + (o.prev ? ' <em>(kỳ trước ' + o.prev[i] + ')</em>' : '') + '</div>'; }).join('') + '</div></div>';
  }
  function hb(rows, o) {
    o = o || {}; if (!rows.length) return '<div class="none">' + esc(o.empty || 'Không có') + '</div>';
    var mx = o.max || Math.max.apply(null, rows.map(function (r) { return Math.abs(r.v); })) || 1;
    return rows.map(function (r) { return '<div class="hb"><span class="t">' + r.k + '</span><span class="tr"><i style="width:' + (Math.abs(r.v) / mx * 100).toFixed(0) + '%;background:' + (r.c || '#C0392B') + '"></i></span><b style="color:' + (r.c || '#C0392B') + '">' + (r.lbl != null ? r.lbl : r.v) + '</b></div>'; }).join('');
  }
  var CSS = '.nx1{margin-top:2.5mm;padding:2.2mm 3mm;border-left:3px solid #0E7C86;background:#F2F8F9;border-radius:0 2mm 2mm 0;font-size:10pt;line-height:1.45;color:#1B333A}.nx1 b{color:#0A5C64}.nx1 i{color:#6C8A93}.cmp .cr{display:grid;grid-template-columns:30mm 1fr 18mm;grid-template-rows:auto auto;column-gap:3mm;align-items:center;margin:0 0 3.2mm}.cmp .ck{grid-row:1/3;font-weight:700;font-size:9.5pt;color:#1B333A}.cmp .cb{position:relative;height:4.6mm;display:flex;align-items:center;gap:2mm}.cmp .cb i{display:block;flex:none;height:100%;border-radius:2mm;min-width:1mm}.cmp .cb b{font-size:9pt;font-weight:800;color:#1B333A}.cmp .cb.pv{height:3.2mm;margin-top:.8mm}.cmp .cb.pv i{background:#C9D6DA}.cmp .cb.pv b{color:#8AA6AD;font-weight:600;font-size:8pt}.cmp .cd{grid-row:1/3;grid-column:3;font-weight:800;font-size:10pt;text-align:right}.cmp .cd.up{color:#1E8449}.cmp .cd.dn{color:#C0392B}.cmp .cd.eq{color:#8AA6AD}.cmp .clg{display:flex;gap:4mm;flex-wrap:wrap;font-size:8pt;color:#5C7A83;margin-top:1mm}.cmp .clg i{display:inline-block;width:3mm;height:3mm;border-radius:1mm;margin-right:1mm;vertical-align:-.4mm}@page{size:A4 landscape;margin:0}*{box-sizing:border-box}body{margin:0;font-family:"Be Vietnam Pro",Aptos,"Segoe UI",Arial,sans-serif;color:#1B333A;-webkit-print-color-adjust:exact;print-color-adjust:exact;background:#fff}'
    + '.pg{width:297mm;height:209mm;padding:11mm 14mm 12mm;position:relative;page-break-after:always;overflow:hidden}.pg:last-child{page-break-after:auto}'
    + '.pg::before{content:"";position:absolute;left:0;top:0;right:0;height:3mm;background:linear-gradient(90deg,#0E7C86,#6FBEC5)}'
    + '.hd{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1.5px solid #DCE9EB;padding-bottom:3mm;margin-bottom:4.5mm}'
    + '.hd .k{font-size:8.5pt;letter-spacing:.14em;text-transform:uppercase;color:#0E7C86;font-weight:800}.hd h1{font-size:19pt;margin:1mm 0 0;color:#0A5C64;line-height:1.15}'
    + '.hd .r{text-align:right;font-size:9pt;color:#5C7A83;line-height:1.5}.hd .r b{color:#1B333A}'
    + '.ft{position:absolute;left:14mm;right:14mm;bottom:5mm;font-size:7.5pt;color:#8AA6AD;display:flex;justify-content:space-between}'
    + '.kp{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm;margin-bottom:4.5mm}.kpi{border:1px solid #E3ECEE;border-radius:4mm;padding:3mm 4mm;background:#F8FBFC;position:relative;overflow:hidden}'
    + '.kpi::before{content:"";position:absolute;left:0;top:0;bottom:0;width:1.6mm;background:var(--c,#6FBEC5)}.kpi .n{font-size:23pt;font-weight:800;line-height:1.05;color:var(--c,#1B333A)}'
    + '.kpi .l{font-size:8.5pt;color:#5C7A83;font-weight:700;margin-top:.5mm}.dl{display:inline-block;margin-top:1.2mm;font-size:7.8pt;font-weight:800;border-radius:99px;padding:.3mm 2.2mm}'
    + '.dl.good{background:#E5F5EB;color:#1E8449}.dl.bad{background:#FCEDEA;color:#C0392B}.dl.eq{background:#EEF3F4;color:#5C7A83}'
    + '.g2{display:grid;grid-template-columns:1fr 1fr;gap:5mm}.g3{display:grid;grid-template-columns:1.1fr 1fr;gap:5mm}'
    + '.card{border:1px solid #E3ECEE;border-radius:4mm;padding:3.5mm 4mm;background:#fff}.card h3{font-size:10.5pt;margin:0 0 2.5mm;color:#0A5C64;display:flex;align-items:center;gap:2mm}'
    + '.card h3 .mc{margin:-3mm 0 -3mm auto}.say{display:flex;gap:4mm;align-items:center;background:linear-gradient(135deg,#F0F7F8,#FFFDF5);border:1px solid #E3ECEE;border-radius:5mm;padding:2.5mm 5mm;margin-bottom:4.5mm}'
    + '.say .b{font-size:11pt;line-height:1.55}.say .b b{color:#0A5C64}.say .mc{flex:none}'
    + '.none{color:#8AA6AD;font-size:9.5pt;padding:4mm 0}.lg{font-size:8.5pt;color:#5C7A83;margin-top:1mm}.lg i,.dnl i{display:inline-block;width:3mm;height:3mm;border-radius:1mm;margin-right:1.5mm;vertical-align:-.3mm}'
    + '.dn{display:flex;align-items:center;gap:5mm}.dnl div{font-size:9.5pt;margin:1.2mm 0}.dnl em{color:#8AA6AD;font-style:normal;font-size:8.5pt}'
    + '.hb{display:grid;grid-template-columns:42% 1fr 12mm;gap:2.5mm;align-items:center;font-size:9.5pt;margin:1.6mm 0}.hb .t{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    + '.hb .tr{height:3mm;border-radius:2mm;background:#EEF3F4;overflow:hidden}.hb .tr i{display:block;height:100%;border-radius:2mm}.hb b{text-align:right}'
    + 'table.t{width:100%;border-collapse:collapse;font-size:9pt}table.t th{background:#E6F3F4;color:#0A5C64;text-align:left;padding:1.8mm 2.2mm;font-size:8.3pt}'
    + 'table.t td{padding:1.6mm 2.2mm;border-bottom:1px solid #EDF4F5}table.t td.n,table.t th.n{text-align:right}.pill{display:inline-block;border-radius:99px;padding:.3mm 2.4mm;font-weight:800;font-size:8.5pt}'
    + '.lst div{display:flex;gap:2.5mm;align-items:baseline;font-size:9.5pt;padding:1.2mm 0;border-bottom:1px dashed #E3ECEE}.lst div:last-child{border-bottom:0}.lst b.p{color:#1E8449}.lst b.m{color:#C0392B}.lst span{flex:1}'
    + '.txt{font-size:10.2pt;line-height:1.6;white-space:pre-line}.sig{position:absolute;right:16mm;bottom:16mm;text-align:center;font-size:10pt;line-height:1.5}'
    + '.big{font-size:30pt;font-weight:800;line-height:1}.ev{display:flex;gap:4mm;align-items:center;border:1px solid #E3ECEE;border-radius:4mm;padding:3mm 4mm;margin-bottom:3mm}'
    + '.ev .pt{flex:none;width:22mm;text-align:center;font-size:24pt;font-weight:800;border-radius:3mm;padding:1.5mm 0}.ev .pt.m{background:#FCEDEA;color:#C0392B}.ev .pt.p{background:#E5F5EB;color:#1E8449}'
    + '.ev .bd b{font-size:12pt}.ev .bd div{font-size:9pt;color:#5C7A83;margin-top:.8mm}.bub{position:relative;background:#fff;border:1.5px solid #CFE3E6;border-radius:5mm;padding:4mm 5mm;font-size:11.5pt;line-height:1.6}'
    + '.bub::after{content:"";position:absolute;left:12mm;bottom:-3.2mm;width:5mm;height:5mm;background:#fff;border-right:1.5px solid #CFE3E6;border-bottom:1.5px solid #CFE3E6;transform:rotate(45deg)}';
  function page(head, body, foot) { return '<section class="pg">' + head + body + '<div class="ft"><span>' + foot + '</span><span class="pn"></span></div></section>'; }
  function head(k, h, r) { return '<div class="hd"><div><div class="k">' + k + '</div><h1>' + h + '</h1></div><div class="r">' + r + '</div></div>'; }
  function today() { var d = new Date(); return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear(); }
  function footTxt(D) { return 'Sổ theo dõi học sinh lớp ' + esc(D.cfg.lop || '11D3') + (D.cfg.truong ? ' · ' + esc(D.cfg.truong) : '') + ' · Năm học ' + esc(D.cfg.namHoc || '') + ' · In ngày ' + today(); }
  /* ── số liệu 1 học sinh ── */
  function kyMonths(ky) { return ky.k === 'thang' ? [ky.m] : ky.k === 'hk' ? HK[ky.n] : MONTHS; }
  function kyName(ky) { return ky.k === 'thang' ? 'Tháng ' + ky.m : ky.k === 'hk' ? 'Học kỳ ' + (ky.n === 1 ? 'I' : 'II') : 'Cả năm học'; }
  function prevKy(ky) { if (ky.k === 'thang') { var i = MONTHS.indexOf(ky.m); return i > 0 ? { k: 'thang', m: MONTHS[i - 1] } : null; } if (ky.k === 'hk' && ky.n === 2) return { k: 'hk', n: 1 }; return null; }
  function stu(D, ma, ky) {
    var cfg = D.cfg, soTuan = cfg.soTuan || 4, ms = kyMonths(ky);
    var has = ms.filter(function (m) { return D.entries.some(function (e) { return e[2] === m; }); });
    var E = D.entries.filter(function (e) { return e[4] === ma && ms.indexOf(e[2]) >= 0; });
    var mT = function (m) { var s = 0; D.entries.forEach(function (e) { if (e[4] === ma && e[2] === m) s += e[9]; }); return s; };
    var sc = ky.k === 'thang' ? mT(ky.m) / soTuan : (has.length ? has.reduce(function (a, m) { return a + mT(m) / soTuan; }, 0) / has.length : 0);
    var rm = (D.remarks || []).filter(function (r) { return r.maHS === ma && ms.indexOf(r.thang) >= 0; }).sort(function (a, b) { return MONTHS.indexOf(a.thang) - MONTHS.indexOf(b.thang); });
    var ch = rm.filter(function (r) { return r.xepLoai; }).slice(-1)[0], ri = rankIdx(cfg, sc);
    if (ch) { var j = cfg.thresholds.findIndex(function (t) { return t.ten === ch.xepLoai; }); if (j >= 0) ri = j; }
    return { E: E, sc: sc, ri: ri, xl: cfg.thresholds[ri].ten, chot: !!ch, rm: rm, ms: ms, has: has, mT: mT,
      cong: E.filter(function (e) { return e[9] > 0; }), tru: E.filter(function (e) { return e[9] < 0; }) };
  }
  var EMO_RI = ['khen-lon', 'co-vu', 'lo-lang', 'nghiem'];
  function student(D, ma, ky, o) {
    o = o || {}; var cfg = D.cfg, s = D.students.find(function (x) { return x.ma === ma; }) || { ten: ma, to: '' }, X = stu(D, ma, ky), pk = prevKy(ky), PV = pk ? stu(D, ma, pk) : null;
    var ph = o.aud === 'ph', con = ph ? 'Con' : 'Em', ten = esc(ten1(s.ten));
    var dCong = X.cong.reduce(function (a, e) { return a + e[9]; }, 0), dTru = X.tru.reduce(function (a, e) { return a + e[9]; }, 0);
    var emo = X.ri === 0 ? (X.cong.length ? 'khen-lon' : 'vui') : EMO_RI[X.ri];
    var trend = PV ? X.sc - PV.sc : 0;
    var msg = [con + ' <b>' + ten + '</b> ' + (X.ri === 0 ? 'đang thực hiện nề nếp rất tốt' : X.ri === 1 ? 'thực hiện tốt nề nếp, chỉ còn vài lỗi nhỏ' : X.ri === 2 ? 'còn mắc một số lỗi' : 'còn mắc nhiều lỗi') + ' trong ' + kyName(ky).toLowerCase() + ' — xếp loại <b>' + esc(X.xl) + '</b>' + (X.chot ? ' (giáo viên chủ nhiệm đã xác nhận)' : '') + '.',
      PV ? (trend > 0.05 ? 'So với ' + kyName(pk).toLowerCase() + ', ' + con.toLowerCase() + ' đã <b style="color:#1E8449">tiến bộ</b> rõ rệt.' : trend < -0.05 ? 'So với ' + kyName(pk).toLowerCase() + ', kết quả của ' + con.toLowerCase() + ' <b style="color:#C0392B">đi xuống</b>, ' + con.toLowerCase() + ' cần cố gắng hơn.' : 'Kết quả giữ ổn định so với ' + kyName(pk).toLowerCase() + '.') : '',
      ph ? (X.ri <= 1 ? 'Cô Thảo cảm ơn bác đã luôn đồng hành cùng con ạ!' : 'Cô Thảo mong bác cùng phối hợp nhắc nhở con thêm ạ.') : ''].filter(Boolean).join(' ');
    var foot = footTxt(D);
    var kpis = '<div class="kp"><div class="kpi" style="--c:' + RC[rankIdx(cfg, X.sc)] + '"><div class="n">' + f1(X.sc) + '</div><div class="l">Điểm TB tuần</div>' + dl(X.sc, PV && PV.sc, true, f1) + '</div>'
      + '<div class="kpi" style="--c:' + RC[X.ri] + '"><div class="n">' + esc(X.xl) + '</div><div class="l">Xếp loại ' + (X.chot ? '· đã xác nhận ✓' : '· tạm tính') + '</div>' + (PV ? '<span class="dl eq">kỳ trước: ' + esc(PV.xl) + '</span>' : '') + '</div>'
      + '<div class="kpi" style="--c:#1E8449"><div class="n">' + X.cong.length + '</div><div class="l">Lượt được khen · +' + dCong + ' điểm</div>' + dl(X.cong.length, PV && PV.cong.length, true) + '</div>'
      + '<div class="kpi" style="--c:#C0392B"><div class="n">' + X.tru.length + '</div><div class="l">Lượt vi phạm · ' + dTru + ' điểm</div>' + dl(X.tru.length, PV && PV.tru.length, false) + '</div></div>';
    var pts, br;
    if (ky.k === 'thang') {
      pts = []; br = []; for (var w = 1; w <= (cfg.soTuan || 4); w++) { var we = X.E.filter(function (e) { return e[3] === w; });
        pts.push({ k: 'Tuần ' + w, v: we.reduce(function (a, e) { return a + e[9]; }, 0) }); br.push({ k: 'Tuần ' + w, a: we.filter(function (e) { return e[9] > 0; }).reduce(function (a, e) { return a + e[9]; }, 0), b: -we.filter(function (e) { return e[9] < 0; }).reduce(function (a, e) { return a + e[9]; }, 0) }); }
    } else {
      pts = X.ms.map(function (m) { return { k: 'T' + m, v: X.has.indexOf(m) >= 0 ? X.mT(m) / (cfg.soTuan || 4) : null }; });
      br = X.ms.filter(function (m) { return X.has.indexOf(m) >= 0; }).map(function (m) { var me = X.E.filter(function (e) { return e[2] === m; });
        return { k: 'T' + m, a: me.filter(function (e) { return e[9] > 0; }).reduce(function (a, e) { return a + e[9]; }, 0), b: -me.filter(function (e) { return e[9] < 0; }).reduce(function (a, e) { return a + e[9]; }, 0) }; });
    }
    var h = head('Báo cáo kết quả rèn luyện của học sinh', esc(s.ten), 'Lớp <b>' + esc(cfg.lop || '11D3') + '</b> · Tổ <b>' + esc(s.to) + '</b>' + (s.chucVu && s.chucVu !== 'Học sinh' ? ' · ' + esc(s.chucVu) : '') + '<br>' + kyName(ky) + ' · Năm học ' + esc(cfg.namHoc || ''));
    var lastRm = X.rm.filter(function (r) { return r.nhanXet; }).slice(-1)[0];
    var nxTxt = lastRm ? String(lastRm.nhanXet) : '';
    var nxBox = '<div class="nx1"><b>Nhận xét của cô Thảo' + (lastRm ? ' · tháng ' + lastRm.thang : '') + ':</b> ' + (nxTxt ? esc(nxTxt.length > 230 ? nxTxt.slice(0, 227) + '…' : nxTxt) : '<i>Cô Thảo sẽ cập nhật nhận xét cho con vào cuối tháng.</i>') + '</div>';
    var p1 = '<div class="say">' + mc(emo, 104) + '<div class="b">' + msg + nxBox + '</div></div>' + kpis
      + '<div class="g2"><div class="card"><h3>' + (ky.k === 'thang' ? 'Điểm từng tuần' : 'Điểm TB tuần qua các tháng') + '</h3>' + line(pts, { w: 470, h: 172, fmt: ky.k === 'thang' ? nz : f1 }) + '</div>'
      + '<div class="card"><h3>Cộng / trừ ' + (ky.k === 'thang' ? 'theo tuần' : 'theo tháng') + '</h3>' + bars2(br, { w: 470, h: 160 }) + '</div></div>';
    var out = page(h, p1, foot);
    /* v6.3: trang Kết quả học tập (điểm các môn, biểu đồ, nhận xét giáo viên chủ nhiệm) khi sổ có dữ liệu điểm */
    if (o.grades !== false && window.HT && HT.gradePage) { try { out += HT.gradePage(D, ma, ky, o); } catch (e) {} }
    /* trang 2: lỗi, khen, nhận xét */
    var loi = {}; X.tru.forEach(function (e) { var k = e[8] || e[7]; loi[k] = (loi[k] || 0) + 1; });
    var lr = Object.keys(loi).map(function (k) { return { k: esc(k), v: loi[k], lbl: loi[k] + ' lần' }; }).sort(function (a, b) { return b.v - a.v; }).slice(0, 7);
    var kh = X.cong.slice().sort(function (a, b) { return String(b[1]).localeCompare(String(a[1])); }).slice(0, 8);
    var p2 = '<div class="g3"><div><div class="card" style="margin-bottom:4mm"><h3>Lỗi thường mắc' + (lr.length ? mc('nghiem', 46) : '') + '</h3>' + hb(lr, { empty: 'Không có lỗi nào — rất đáng khen!' }) + '</div>'
      + '<div class="card"><h3>Khen thưởng, điểm cộng' + (kh.length ? mc('vui', 46) : '') + '</h3><div class="lst">' + (kh.length ? kh.map(function (e) { return '<div><b class="p">+' + e[9] + '</b><span>' + esc(e[8] || e[7]) + (e[12] ? ' — <i>' + esc(e[12]) + '</i>' : '') + '</span><em style="color:#8AA6AD;font-style:normal;font-size:8.5pt">T' + e[2] + '·tuần ' + e[3] + '</em></div>'; }).join('') : '<div class="none">Chưa có điểm cộng trong kỳ.</div>') + '</div></div></div>'
      + '<div class="card"><h3>Nhận xét của cô Thảo</h3>' + (X.rm.length ? X.rm.map(function (r) { return '<div style="margin:0 0 3mm"><span class="pill" style="background:#E6F3F4;color:#0A5C64">Tháng ' + r.thang + (r.xepLoai ? ' · ' + esc(r.xepLoai) + ' ✓' : '') + '</span><div class="txt" style="margin-top:1.5mm">' + esc(r.nhanXet || '(chưa có lời nhận xét)') + '</div></div>'; }).join('') : '<div class="none">Giáo viên chủ nhiệm chưa ghi nhận xét cho kỳ này.</div>')
      + (ph ? '<div class="txt" style="margin-top:3mm;color:#41566F">' + (X.ri <= 1 ? 'Bác tiếp tục động viên con giữ vững nề nếp nhé.' : 'Bác trò chuyện cùng con về những lỗi trên và liên hệ cô Thảo khi cần trao đổi thêm về con ạ.') + '</div>' : '') + '</div></div>';
    out += page(head('Chi tiết · ' + kyName(ky), esc(s.ten), 'Lỗi thường mắc · Khen thưởng · Nhận xét'), p2, foot);
    /* trang 3+: bảng chi tiết */
    var rows = X.E.slice().sort(function (a, b) { return MONTHS.indexOf(a[2]) - MONTHS.indexOf(b[2]) || a[3] - b[3] || String(a[1]).localeCompare(String(b[1])); });
    for (var i = 0; i < rows.length; i += 17) {
      out += page(head('Các lần ghi nhận · ' + kyName(ky), esc(s.ten), rows.length + ' ghi nhận' + (rows.length > 17 ? ' · phần ' + (i / 17 + 1) : '')),
        '<table class="t"><tr><th>Tháng</th><th>Tuần</th><th>Ngày</th><th>Nội dung</th><th>Ghi chú</th><th>Người ghi</th><th class="n">Điểm</th></tr>'
        + rows.slice(i, i + 17).map(function (e) { return '<tr><td>' + e[2] + '</td><td>' + e[3] + '</td><td>' + esc(String(e[1]).slice(0, 10)) + '</td><td>' + esc(e[8] || e[7]) + '</td><td>' + esc(e[12] || '') + '</td><td>' + esc(e[11] || '') + '</td><td class="n" style="font-weight:800;color:' + (e[9] < 0 ? '#C0392B' : '#1E8449') + '">' + nz(e[9]) + '</td></tr>'; }).join('') + '</table>', foot);
    }
    return out;
  }
  /* ── thông báo phụ huynh ── */
  function notice(D, ma, ids) {
    var cfg = D.cfg, s = D.students.find(function (x) { return x.ma === ma; }) || { ten: ma, to: '' }, want = (ids || []).map(String);
    var E = D.entries.filter(function (e) { return want.indexOf(String(e[0])) >= 0 && e[4] === ma; });
    if (!E.length) { var mine = D.entries.filter(function (e) { return e[4] === ma; }).sort(function (a, b) { return String(b[1]).localeCompare(String(a[1])); }); if (mine.length) E = mine.filter(function (e) { return String(e[1]).slice(0, 10) === String(mine[0][1]).slice(0, 10); }); }
    var th = E.length ? E[0][2] : cfg.thang, me = D.entries.filter(function (e) { return e[4] === ma && e[2] === th; });
    var tong = me.reduce(function (a, e) { return a + e[9]; }, 0), tb = tong / (cfg.soTuan || 4), ri = rankIdx(cfg, tb);
    var tru = E.filter(function (e) { return e[9] < 0; }), cong = E.filter(function (e) { return e[9] > 0; });
    var nTru = me.filter(function (e) { return e[9] < 0; }).length, lanMax = 0;
    tru.forEach(function (e) { var n = me.filter(function (x) { return x[7] === e[7] && x[9] < 0; }).length; if (n > lanMax) lanMax = n; });
    var t = esc(ten1(s.ten)), emo, msg;
    if (tru.length) {
      if (nTru >= 5 || lanMax >= 3) { emo = 'lo-lang'; msg = 'Tháng này con <b>' + t + '</b> đã có <b>' + nTru + '</b> lần bị trừ điểm. Cô Thảo mong bác dành thời gian trò chuyện với con và cùng phối hợp để giúp con tiến bộ hơn ạ.'; }
      else if (lanMax === 2) { emo = 'nghiem'; msg = 'Đây là lần thứ 2 trong tháng con <b>' + t + '</b> mắc lỗi này. Cô Thảo nhờ bác nhắc nhở để con không tái phạm nữa ạ.'; }
      else { emo = 'buon'; msg = 'Đây là lần đầu trong tháng con mắc lỗi này. Cô Thảo nhờ bác nhắc nhẹ con <b>' + t + '</b>, cô Thảo tin con sẽ cố gắng hơn ạ.'; }
    } else { var sum = cong.reduce(function (a, e) { return a + e[9]; }, 0); emo = sum >= 3 ? 'khen-lon' : 'vui'; msg = 'Cô Thảo báo tin vui: con <b>' + t + '</b> vừa được cộng điểm. Bác dành lời khen và động viên con nhé ạ!'; }
    var wk = []; for (var w = 1; w <= (cfg.soTuan || 4); w++) wk.push({ k: 'Tuần ' + w, v: me.filter(function (e) { return e[3] === w; }).reduce(function (a, e) { return a + e[9]; }, 0) });
    var body = '<div style="display:grid;grid-template-columns:86mm 1fr;gap:7mm"><div><div class="bub">' + msg + '</div><div style="text-align:center;margin-top:5mm">' + mc(emo, 230) + '</div></div><div>'
      + E.map(function (e) { return '<div class="ev"><div class="pt ' + (e[9] < 0 ? 'm' : 'p') + '">' + nz(e[9]) + '</div><div class="bd"><b>' + esc(e[8] || e[7]) + '</b><div>Tuần ' + e[3] + ' tháng ' + e[2] + ' · ' + esc(String(e[1]).slice(0, 10)) + ' · ghi bởi ' + esc(e[11] || '') + '</div>' + (e[12] ? '<div style="color:#1B333A">Ghi chú: ' + esc(e[12]) + '</div>' : '') + '</div></div>'; }).join('')
      + '<div class="kp" style="grid-template-columns:repeat(3,1fr);margin-top:4mm"><div class="kpi" style="--c:' + (tong < 0 ? '#C0392B' : '#1E8449') + '"><div class="n">' + nz(tong) + '</div><div class="l">Tổng điểm tháng ' + th + '</div></div>'
      + '<div class="kpi" style="--c:' + RC[ri] + '"><div class="n">' + esc(cfg.thresholds[ri].ten) + '</div><div class="l">Xếp loại tạm tính</div></div>'
      + '<div class="kpi" style="--c:#0E7C86"><div class="n" style="font-size:16pt"><span style="color:#1E8449">' + me.filter(function (e) { return e[9] > 0; }).length + ' khen</span> · <span style="color:#C0392B">' + nTru + ' trừ</span></div><div class="l">Trong tháng ' + th + '</div></div></div>'
      + (function () { var r = (D.remarks || []).filter(function (x) { return x.maHS === ma && x.thang === th && x.nhanXet; })[0];
        return '<div class="nx1" style="margin:0 0 3mm"><b>Nhận xét của cô Thảo · tháng ' + th + ':</b> ' + (r ? esc(r.nhanXet) : '<i>Cô Thảo sẽ gửi nhận xét của tháng về con vào cuối tháng ạ.</i>') + '</div>'; })()
      + '<div class="card"><h3>Điểm từng tuần trong tháng ' + th + '</h3>' + line(wk, { w: 560, h: 118, fmt: nz }) + '</div></div></div>';
    return page(head('Thông báo kết quả rèn luyện', 'Cô Thảo xin cập nhật cho bác về con ' + esc(s.ten), 'Lớp <b>' + esc(cfg.lop || '11D3') + '</b> · Tổ <b>' + esc(s.to) + '</b><br>Năm học ' + esc(cfg.namHoc || '')), body, footTxt(D));
  }
  /* ── mở bản in ── */
  function open(html, title, o) {
    o = o || {};
    var base = location.href.replace(/[#?].*$/, '').replace(/[^/]*$/, '');
    var doc = '<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>' + esc(title || 'Báo cáo') + '</title><base href="' + base + '">'
      + '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700;800&display=swap"><style>' + CSS + '</style></head><body>' + html
      + '<script>document.querySelectorAll(".pn").forEach(function(e,i,a){e.textContent="Trang "+(i+1)+"/"+a.length;});<\/script></body></html>';
    RPT.last = doc;
    if (o.dry) return doc;
    var ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (ios) { var w = window.open('', '_blank'); if (w) { w.document.write(doc); w.document.close(); setTimeout(function () { try { w.print(); } catch (e) {} }, 900); return doc; } }
    var f = document.getElementById('rptFrame'); if (f) f.remove();
    f = document.createElement('iframe'); f.id = 'rptFrame'; f.setAttribute('aria-hidden', 'true');
    f.style.cssText = 'position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0;pointer-events:none';
    document.body.appendChild(f);
    var d = f.contentDocument; d.open(); d.write(doc); d.close();
    var imgs = [].slice.call(d.images);
    Promise.all(imgs.map(function (i) { return i.complete ? 1 : new Promise(function (r) { i.onload = i.onerror = r; setTimeout(r, 2500); }); }))
      .then(function () { setTimeout(function () { try { f.contentWindow.focus(); f.contentWindow.print(); } catch (e) { var w2 = window.open('', '_blank'); if (w2) { w2.document.write(doc); w2.document.close(); setTimeout(function () { w2.print(); }, 800); } } }, 250); });
    return doc;
  }
  /* so sánh kỳ này / kỳ trước: rows [{k, a: kỳ này, b: kỳ trước, up: true nếu tăng là tốt, c: màu}] */
  function cmp(rows, o) {
    o = o || {}; var mx = Math.max(1, Math.max.apply(null, rows.map(function (r) { return Math.max(r.a, r.b); })));
    return '<div class="cmp">' + rows.map(function (r) {
      var d = r.a - r.b, good = d === 0 ? 0 : (d > 0) === !!r.up ? 1 : -1;
      return '<div class="cr"><div class="ck">' + esc(r.k) + '</div><div class="cb"><i style="width:calc((100% - 9mm) * ' + (r.a / mx).toFixed(3) + ');background:' + (r.c || '#0E7C86') + '"></i><b>' + r.a + '</b></div>'
        + '<div class="cb pv"><i style="width:calc((100% - 9mm) * ' + (r.b / mx).toFixed(3) + ')"></i><b>' + r.b + '</b></div>'
        + '<span class="cd ' + (good > 0 ? 'up' : good < 0 ? 'dn' : 'eq') + '">' + (d === 0 ? '=' : (d > 0 ? '▲ ' : '▼ ') + Math.abs(d)) + '</span></div>';
    }).join('') + '<div class="clg"><span><i style="background:#0E7C86"></i>' + esc(o.cur || 'Kỳ này') + '</span><span><i style="background:#C9D6DA"></i>' + esc(o.prev || 'Kỳ trước') + '</span><span style="color:#1E8449">▲▼ xanh = tốt lên</span><span style="color:#C0392B">đỏ = kém đi</span></div></div>';
  }
  window.RPT = { student: student, notice: notice, open: open, page: page, head: head, line: line, bars2: bars2, donut: donut, hb: hb, cmp: cmp, mc: mc, dl: dl,
    footTxt: footTxt, kyName: kyName, rankIdx: rankIdx, RC: RC, RB: RB, CSS: CSS, last: '' };
})();
