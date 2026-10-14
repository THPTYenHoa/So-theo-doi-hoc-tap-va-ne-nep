/* ══ v5.0 — Máy chủ mô phỏng phần KẾT QUẢ HỌC TẬP / SỔ CHỦ NHIỆM (dữ liệu GIẢ) ══
   Dùng chung cho: web demo (demo/server.js ▸ demo.html) và tools/test/mock.js (kiểm thử Playwright).
   HTDEMO.build(students) ⇒ trạng thái {mon, gv, rule, diem, hoso, scn, mails}
   HTDEMO.api(st, action, p, who, students) ⇒ kết quả như backend HocTap.gs (null nếu không phải lệnh của phần này). */
(function (root) {
  'use strict';
  var MON = [['TOAN', 'Toán', 'd', 4], ['VAN', 'Ngữ văn', 'd', 4], ['ANH', 'Tiếng Anh', 'd', 4], ['SU', 'Lịch sử', 'd', 3], ['DIA', 'Địa lí', 'd', 3],
    ['KTPL', 'Giáo dục kinh tế và pháp luật', 'd', 3], ['QPAN', 'Giáo dục quốc phòng và an ninh', 'd', 2], ['GDTC', 'Giáo dục thể chất', 'nx', 3],
    ['HDTN', 'Hoạt động trải nghiệm, hướng nghiệp', 'nx', 3], ['GDDP', 'Nội dung giáo dục của địa phương', 'nx', 2]];
  var VT = { TOAN: 'Toán', VAN: 'Văn', ANH: 'Anh', SU: 'Sử', DIA: 'Địa', KTPL: 'KTPL', QPAN: 'QP-AN', GDTC: 'GDTC', HDTN: 'HĐTN', GDDP: 'GDĐP' };
  var RULE = { heSoTX: 1, heSoGK: 2, heSoCK: 3, heSoHK2: 2, lamTron: 1, totDiemMoi: 6.5, totSoMon: 6, totDiemCao: 8, khaDiemMoi: 5, khaSoMon: 6, khaDiemCao: 6.5,
    datSoMon: 6, datDiem: 5, datSan: 3.5, datToiDaCD: 1, xsSoMon: 6, xsDiem: 9, nxTiLeDat: 0.6667 };
  function rnd(seed) { var s = seed; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function build(students) {
    var r = rnd(11), diem = [];
    students.forEach(function (s, i) {
      var lv = 5.6 + r() * 3.6 + (i % 7 === 0 ? 0.6 : 0) - (i % 11 === 3 ? 1.2 : 0);
      MON.forEach(function (m) {
        [1].forEach(function (hk) {   /* v6.3: không có ĐĐGtx — chỉ giữa kì, cuối kì, TB môn (dán từ phần mềm điểm của trường) */
          if (m[2] === 'nx') { diem.push([s.ma, m[0], hk, 'GK', 'Đ']); diem.push([s.ma, m[0], hk, 'CK', r() < 0.95 ? 'Đ' : 'CĐ']); diem.push([s.ma, m[0], hk, 'HK', r() < 0.95 ? 'Đ' : 'CĐ']); return; }
          var cl = function (x) { return Math.max(2, Math.min(10, Math.round(x * 4) / 4)); };
          var gk = cl(lv + (r() - 0.5) * 2), ck = cl(lv + (r() - 0.5) * 2);
          diem.push([s.ma, m[0], hk, 'GK', String(gk)]);
          diem.push([s.ma, m[0], hk, 'CK', String(ck)]);
          diem.push([s.ma, m[0], hk, 'HK', String(Math.round(((lv + (r() - 0.5)) * 5 + gk * 2 + ck * 3) / 10 * 10) / 10)]);
        });
      });
    });
    /* kỳ thi mẫu: ôn luyện trên app (cả lớp) + thi học sinh giỏi (một số bạn) */
    var KT = [['OL2610ANH1', 'OL', 'ANH', 'Ôn luyện tiếng Anh trên app · tuần 1', '2026-10-05', 10, 1], ['OL2610TOAN2', 'OL', 'TOAN', 'Luyện đề Toán trên app · đề 2', '2026-10-09', 10, 1],
      ['HSG2610TOAN', 'HSG', 'TOAN', 'Thi học sinh giỏi cấp trường môn Toán · vòng 1', '2026-10-12', 20, 0.25], ['HSG2610VAN', 'HSG', 'VAN', 'Thi học sinh giỏi cấp trường môn Ngữ văn · vòng 1', '2026-10-12', 20, 0.15]];
    var kyThi = KT.map(function (k) { return { id: k[0], loai: k[1], mon: k[2], ten: k[3], ngay: k[4], hk: 1, thang: k[5], gc: k[1] === 'OL' ? 'Ứng dụng luyện thi (ví dụ)' : '', by: 'Nguyễn Thu Thảo' }; });
    students.forEach(function (s, i) {
      var lv = 5.6 + r() * 3.6;
      KT.forEach(function (k) { if (r() > (k[6] === 1 ? 0.92 : k[6])) return;   /* tỉ lệ học sinh dự thi */
        var v = Math.max(1, Math.min(k[5], Math.round((lv / 10 * k[5] + (r() - 0.5) * k[5] * 0.25) * 4) / 4)); diem.push([s.ma, k[2], 1, 'KT#' + k[0], String(v)]); });
    });
    var hoso = students.map(function (s, i) {
      return { ma: s.ma, ten: s.ten, gt: i % 3 === 0 ? 'Nam' : 'Nữ', ns: '', dv: i % 5 === 4 ? '' : 'x', dc: 'Phường Yên Hòa, Hà Nội (địa chỉ mẫu)', dt: '', dien: i === 6 ? 'Đặc biệt' : '',
        lb: '', tt: '', cn: i % 9 === 0 ? 'Năng động, tích cực' : '', gd: '', db: i === 6 ? 'x' : '', bh: i === 6 ? 'Hoàn cảnh gia đình khó khăn (dữ liệu mẫu)' : '',
        bp: i === 6 ? 'Quan tâm, phối hợp thường xuyên với gia đình' : '', rl0: 'Tốt', ht0: i % 8 === 5 ? 'Khá' : 'Tốt', kt0: i % 4 === 0 ? 'Học sinh Xuất sắc' : '', gc: '' };
    });
    return { mon: MON.map(function (m, i) { return { ma: m[0], ten: m[1], ht: m[2], tx: m[3], tt: i + 1, on: true, vt: VT[m[0]] }; }),
      gv: [],
      kyThi: kyThi, rule: JSON.parse(JSON.stringify(RULE)), diem: diem.map(function (d) { return d.concat(['Giáo viên chủ nhiệm', '2026-10-10 08:00']); }),
      hoso: hoso, scn: { 'cfg.bgh_email': 'bgh@example.com' }, mails: [] };
  }
  function aiMau(loai, d) {   /* câu trả lời mẫu cho Trợ lý AI ở bản demo / kiểm thử */
    var low = function (s) { return String(s || '').toLowerCase(); };
    if (loai === 'bc_lop') {
      var xl = (d.xepLoai || []).filter(function (x) { return x.soHS; }).map(function (x) { return x.soHS + ' em ' + low(x.loai); }).join(', ');
      var loi = (d.loiThuongGap || []).slice(0, 2).map(function (x) { return low(x.noiDung) + ' (' + x.lan + ' lượt)'; }).join(' và ');
      var tr = d.kyTruoc ? (d.diemTBLop >= d.kyTruoc.diemTBLop ? ', nhích lên so với kỳ trước' : ', giảm nhẹ so với kỳ trước') : '';
      return { nhanXet: 'Trong ' + (d.ky || 'kỳ này') + ', tập thể lớp duy trì nề nếp tương đối ổn định với điểm trung bình ' + d.diemTBLop + tr + '. Lớp có ' + d.luotDuocCong + ' lượt được cộng điểm, cho thấy tinh thần tích cực tham gia phong trào; xếp loại gồm ' + (xl || 'chưa đủ dữ liệu') + '. '
          + (loi ? 'Các lỗi còn lặp lại chủ yếu là ' + loi + ', cần được nhắc nhở sớm. ' : '') + (d.soHSCanQuanTam ? 'Có ' + d.soHSCanQuanTam + ' em cần được quan tâm, đồng hành thêm. ' : '') + 'Nhìn chung, lớp có nền tảng tốt để tiếp tục tiến bộ trong thời gian tới.',
        phuongHuong: '- Duy trì kiểm tra nề nếp đầu giờ, nhắc nhở ngay khi phát hiện vi phạm.\n- Tập trung khắc phục ' + (loi ? 'các lỗi ' + loi : 'các lỗi thường gặp') + ' qua cán bộ lớp và các tổ.\n- Trao đổi riêng, phối hợp với gia đình các em cần quan tâm.\n- Tuyên dương kịp thời các em tiến bộ, đẩy mạnh thi đua giữa các tổ.' };
    }
    var vp = d.viPham || [], kc = d.duocCong || [], kt = (d.kyThi || [])[0], mon = (d.diemKiemTra || []).filter(function (m) { return +String(m.cuoiKi || m.giuaKi || 0).replace(',', '.') >= 8; }).map(function (m) { return m.mon; }).slice(0, 2);
    return {
      nhanXet: 'Trong ' + (d.ky || 'tháng') + ', em đạt điểm trung bình ' + d.diemTBThang + ', xếp loại ' + low(d.xepLoaiThang) + '. '
        + (kc.length ? 'Em tích cực tham gia hoạt động của lớp (' + low(kc[0].noiDung) + '), đáng được ghi nhận. ' : '')
        + (mon.length ? 'Kết quả kiểm tra các môn ' + mon.join(', ') + ' tốt. ' : '') + (kt ? 'Em tham gia ' + low(kt.kyThi) + ', đạt ' + kt.diem + '/' + kt.thangDiem + '. ' : '')
        + (vp.length ? 'Em cần khắc phục lỗi "' + low(vp[0].noiDung) + '" để giữ vững nề nếp. ' : 'Em giữ nề nếp tốt, không vi phạm. ') + 'Cô tin em sẽ tiếp tục cố gắng và tiến bộ hơn.',
      diemManh: [kc.length ? 'Tích cực: ' + low(kc[0].noiDung) : 'Chấp hành tốt nội quy lớp'].concat(mon.length ? ['Học tốt môn ' + mon.join(', ')] : []),
      canCoGang: vp.length ? vp.slice(0, 2).map(function (x) { return 'Khắc phục lỗi "' + low(x.noiDung) + '"' + ' (' + x.lan + ' lần)'; }) : ['Duy trì sự ổn định'],
      goiYGV: vp.length ? 'Trao đổi riêng, nhẹ nhàng với em về lỗi "' + low(vp[0].noiDung) + '"; nhờ cán bộ lớp nhắc nhở và ghi nhận khi em tiến bộ.' : 'Tuyên dương trước lớp để em tiếp tục phát huy.'
    };
  }
  function api(st, a, p, who, students) {
    var gvcn = who === 'gvcn', gvMon = null,   /* v6.4: không còn vai giáo viên bộ môn */ cb = who === 'lt' || who === 'tt';
    var ddCB = function (dd) { return dd === 'GK' || dd === 'CK' || /^KT#/.test(dd); };
    st.kyThi = st.kyThi || []; st.bao = st.bao || {};
    var need = function () { if (!gvcn) throw new Error('Chỉ giáo viên chủ nhiệm được thực hiện thao tác này.'); };
    try {
      switch (a) {
        case 'htBoot':
          if (!gvcn && !gvMon && !cb) return { ok: false, error: 'Chỉ giáo viên chủ nhiệm và cán bộ lớp xem được điểm kiểm tra.' };
          var o = { ok: true, mon: st.mon, gv: st.gv, rule: st.rule, kyThi: st.kyThi, diem: gvMon ? st.diem.filter(function (d) { return gvMon.indexOf(d[1]) >= 0; }) : cb ? st.diem.filter(function (d) { return ddCB(d[3]); }) : st.diem };
          if (gvMon) o.myMon = gvMon; else if (cb) o.canBo = true; else { o.hoso = st.hoso; o.scn = st.scn; o.mailQuota = 90; }
          return o;
        case 'htSaveMon': need(); st.mon = p.mon; return { ok: true, mon: st.mon };
        case 'htSaveGV': return { ok: false, error: 'Sổ không còn dùng danh sách giáo viên bộ môn.' };
        case 'htSaveRule': need(); Object.keys(p.rule || {}).forEach(function (k) { st.rule[k] = p.rule[k]; }); return { ok: true, rule: st.rule };
        case 'htSaveDiem':
          if (!gvcn && !gvMon && !cb) throw new Error('Không có quyền nhập điểm.');
          var items = p.items || [];
          if (cb && (items.some(function (it) { return !ddCB(it.dd); }) || (p.replace && !(p.replace.dds || []).every(ddCB)))) throw new Error('Cán bộ lớp chỉ nhập điểm kiểm tra giữa kì, cuối kì và các kỳ thi.');
          if (gvMon && items.some(function (it) { return gvMon.indexOf(it.mon) < 0; })) throw new Error('Thầy/cô chỉ nhập được điểm môn mình dạy.');
          if (p.replace && p.replace.mon) { var dds = p.replace.dds || []; st.diem = st.diem.filter(function (d) { return !(d[1] === p.replace.mon && d[2] === +p.replace.hk && (!dds.length || dds.indexOf(d[3]) >= 0)); }); }
          items.forEach(function (it) {
            var i = -1; st.diem.forEach(function (d, k) { if (d[0] === it.ma && d[1] === it.mon && d[2] === +it.hk && d[3] === it.dd) i = k; });
            if (it.v === '') { if (i >= 0) st.diem.splice(i, 1); return; }
            if (i >= 0) st.diem[i][4] = it.v; else st.diem.push([it.ma, it.mon, +it.hk, it.dd, it.v, 'Người nhập', '']);
          });
          return { ok: true, them: items.length };
        case 'htSaveKyThi':
          if (!gvcn && !gvMon && !cb) throw new Error('Chỉ giáo viên và cán bộ lớp được tạo kỳ thi.');
          if (p.op === 'del') { st.kyThi = st.kyThi.filter(function (k) { return k.id !== p.id; }); st.diem = st.diem.filter(function (d) { return d[3] !== 'KT#' + p.id; }); return { ok: true, kyThi: st.kyThi }; }
          var k = p.kt || {}; if (!k.mon || !k.ten) throw new Error('Cần chọn môn và đặt tên kỳ thi.');
          if (gvMon && gvMon.indexOf(k.mon) < 0) throw new Error('Thầy/cô chỉ tạo kỳ thi cho môn mình dạy.');
          var id = k.id || (String(k.loai || 'KT') + Date.now().toString(36).toUpperCase());
          var row = { id: id, loai: k.loai || 'KT', mon: k.mon, ten: k.ten, ngay: k.ngay || '', hk: +k.hk === 2 ? 2 : 1, thang: +k.thang || 10, gc: k.gc || '', by: k.by || 'Người dùng demo' };
          var at = -1; st.kyThi.forEach(function (x, i) { if (x.id === id) at = i; }); if (at >= 0) { row.by = st.kyThi[at].by; st.kyThi[at] = row; } else st.kyThi.push(row);
          return { ok: true, id: id, kyThi: st.kyThi };
        case 'htBaoDiem':
          if (!gvcn && !gvMon && !cb) throw new Error('Không có quyền gửi báo điểm.');
          var keys = (p.keys || []).map(function (x) { return x.mon + '|' + (+x.hk === 2 ? 2 : 1) + '|' + x.dd; }), theo = {}, nB = 0;
          st.diem.forEach(function (d) { var key = d[1] + '|' + d[2] + '|' + d[3]; if (keys.indexOf(key) < 0 || !ddCB(d[3])) return; var bk = d[0] + '|' + key; if (st.bao[bk] === d[4]) return; st.bao[bk] = d[4]; nB++; (theo[d[0]] = theo[d[0]] || []).push(d); });
          var gui2 = 0;
          Object.keys(theo).forEach(function (ma) { var s2 = (students || []).filter(function (x) { return x.ma === ma; })[0]; if (!s2 || !/@/.test(s2.email || '')) return; gui2++;
            st.mails.push({ kind: 'diem', to: s2.email, subject: '[11D3] Điểm kiểm tra của con ' + String(s2.ten).split(' ').pop(),
              html: '<p>Kính gửi bác, giáo viên chủ nhiệm xin thông báo kết quả bài kiểm tra / kỳ thi vừa được cập nhật của con <b>' + s2.ten + '</b>:</p><table style="border-collapse:collapse;width:100%">'
                + theo[ma].map(function (d) { var kt = st.kyThi.filter(function (x) { return 'KT#' + x.id === d[3]; })[0], mon = (st.mon.filter(function (x) { return x.ma === d[1]; })[0] || {}).ten || d[1];
                  return '<tr><td style="padding:8px;border-bottom:1px solid #EDF4F5"><b>' + mon + '</b><br><span style="color:#6C8A93;font-size:13px">' + (kt ? kt.ten : (d[3] === 'GK' ? 'Kiểm tra giữa kì' : 'Kiểm tra cuối kì') + ' · học kì ' + (d[2] === 2 ? 'II' : 'I')) + '</span></td><td style="padding:8px;border-bottom:1px solid #EDF4F5;text-align:right;font-size:20px;font-weight:800">' + String(d[4]).replace('.', ',') + (kt && kt.thang !== 10 ? '/' + kt.thang : '') + '</td></tr>'; }).join('') + '</table>' }); });
          return { ok: true, n: nB, mail: 'đã gửi ' + gui2 + ' thư báo điểm' };
        case 'htSaveHoSo': need();
          (p.rows || []).forEach(function (o2) { var h = st.hoso.filter(function (x) { return x.ma === o2.ma; })[0]; if (h) Object.keys(o2).forEach(function (k) { h[k] = o2[k]; }); else st.hoso.push(o2); });
          return { ok: true, hoso: st.hoso };
        case 'scnSave': need(); Object.keys(p.kv || {}).forEach(function (k) { if (p.kv[k] == null) delete st.scn[k]; else st.scn[k] = String(p.kv[k]); }); return { ok: true };
        case 'scnImg': need();
          st.img = st.img || {}; var id = 'IMG' + (Object.keys(st.img).length + 1); st.img[id] = { n: p.name, m: p.mime, data: p.data };
          var list = (p.thay ? [] : JSON.parse(st.scn['img.' + p.key] || '[]')).concat([{ id: id, n: p.name, m: p.mime, w: p.w, h: p.h }]);
          st.scn['img.' + p.key] = JSON.stringify(list); return { ok: true, list: list };
        case 'scnImgDel': need(); var l2 = JSON.parse(st.scn['img.' + p.key] || '[]').filter(function (x) { return x.id !== p.id; }); st.scn['img.' + p.key] = JSON.stringify(l2); return { ok: true, list: l2 };
        case 'scnImgGet': need(); var f = (st.img || {})[p.id]; return f ? { ok: true, name: f.n, mime: f.m, data: f.data } : { ok: false, error: 'Không tìm thấy ảnh.' };
        case 'htMailBGH': need(); st.mails.push({ kind: 'bgh', to: p.to || st.scn['cfg.bgh_email'], subject: p.subject, html: p.html, files: (p.files || []).map(function (x) { return x.name; }) }); return { ok: true, to: [p.to || st.scn['cfg.bgh_email']] };
        case 'htMailGV': return { ok: false, error: 'Sổ không còn gửi thư cho giáo viên bộ môn.' };
        /* v6.5: Trợ lý AI — bản mô phỏng soạn câu trả lời mẫu từ đúng số liệu ẩn danh app gửi (bản thật: Claude, AiTroLy.gs) */
        case 'aiTrangThai': return { ok: true, on: gvcn, model: 'claude-opus-5-5 (mô phỏng)' };
        case 'aiGoiY': need(); st.aiN = (st.aiN || 0) + 1; return { ok: true, model: 'claude-opus-5-5 (mô phỏng)', goiY: aiMau(p.loai, p.data || {}) };
        case 'htMailPH': need(); var gui = 0, bo = [];
          (p.items || []).forEach(function (it) { var s = (students || []).filter(function (x) { return x.ma === it.ma; })[0]; if (!s || !/@/.test(s.email || '')) { bo.push(s ? s.ten : it.ma); return; } gui++; st.mails.push({ kind: 'ph', to: s.email, subject: it.subject, html: it.html }); });
          return { ok: true, gui: gui, bo: bo };
      }
    } catch (e) { return { ok: false, error: e.message }; }
    return null;
  }
  var HTDEMO = { build: build, api: api };
  if (typeof module !== 'undefined' && module.exports) module.exports = HTDEMO; else root.HTDEMO = HTDEMO;
})(typeof window !== 'undefined' ? window : this);
