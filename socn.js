/* ══ v5.0 — SỔ CÔNG TÁC CHỦ NHIỆM (menu "Sổ chủ nhiệm", #vSCN, chỉ GVCN) ══
   Xuất file Word theo đúng mẫu của trường (templates/so-chu-nhiem.docx — dựng bằng tools/socn/lam_khuon.py, điền bằng docxfill.js).
   · Phần tự động lấy từ dữ liệu đã lưu: danh sách GVBM, danh sách lớp theo tổ, tổ trưởng, kết quả năm trước / đặc điểm (hồ sơ học sinh),
     sơ kết hằng tuần + tổng hợp xếp loại rèn luyện từng tháng, mức rèn luyện từng tháng của từng HS, biểu hiện đáng chú ý (nhật ký theo dõi),
     chất lượng hai mặt giáo dục (kết quả học tập + rèn luyện), sĩ số.
   · Phần GVCN tự điền: lưu ở máy chủ (sheet SoChuNhiem, lệnh scnSave), ô nào để trống thì in ra ô trống như sổ giấy.
   · Ảnh: sơ đồ lớp HK I / HK II, quy định của lớp, biên bản họp CMHS, trang tổng kết… (scnImg, thư mục Drive riêng tư).
   · Gửi Ban giám hiệu: email kèm file Word (htMailBGH). */
(function () {
  'use strict';
  if (!window.HT) return;
  const HT = window.HT, IC = HT.IC;
  const SCN = window.SCN = { tab: 'chung', thang: null, imgs: {}, pend: {}, t: null };
  const LV = ['Tốt', 'Khá', 'Đạt', 'Chưa đạt'];
  const HK1 = [9, 10, 11, 12, 1], HK2 = [2, 3, 4, 5], THANG = [9, 10, 11, 12, 1, 2, 3, 4, 5];
  const pct = (a, b) => b ? (Math.round(a * 1000 / b) / 10).toString().replace('.', ',') + '%' : '';
  const bo = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  const kv = () => (HT.d && HT.d.scn) || {};
  const get = (k, d) => { const v = kv()[k]; return v == null || v === '' ? (d == null ? '' : d) : v; };
  const getJ = (k, d) => { try { const v = kv()[k]; return v ? JSON.parse(v) : d; } catch (_) { return d; } };
  const ten1 = t => { const a = String(t || '').trim().split(/\s+/); return a.slice(-2).join(' '); };

  /* ───────── nội dung gợi ý (theo mẫu sổ của trường; không có tên học sinh) ───────── */
  const DEF = {
    qd_lop: 'Mỗi HS có 10 điểm mỗi tuần, vi phạm lỗi nào trừ điểm tương ứng, đạt thành tích nào được cộng điểm tương ứng.\nĐiểm thi đua tháng sẽ là ĐTB của các tuần trong tháng đó.\nĐiểm này sẽ dùng để xếp loại rèn luyện hằng tháng và gửi về cho CMHS.',
    xl: [['>= 9', '>= 36', 'T'], ['8,5 – 8,75', '34 – 35,75', 'K+'], ['8 – 8,25', '32 – 33,75', 'K'], ['7,5 – 7,75', '30 – 31,75', 'K -'], ['7 – 7,25', '28 – 29,75', 'Đạt +'], ['6,5 – 6,75', '26 – 27,75', 'Đạt'], ['6 – 6,25', '24 – 25,75', 'Đạt -'], ['Từ 5,75 trở xuống', 'Từ 23,75 trở xuống', 'Chưa đạt']],
    sodo1_ghichu: 'Mỗi tháng đổi dãy và 3 bàn trên dưới.',
    kh_khokhan: '- Trình độ HS chưa đồng đều; một số HS mới chuyển đến, chưa quen nền nếp học tập, rèn luyện của lớp, của trường.\n- Một số HS có hoàn cảnh gia đình đặc biệt, cần được quan tâm.',
    kh_thuanloi: '- Học sinh ngoan, lễ phép, có ý thức học tập và rèn luyện, xây dựng tập thể đoàn kết.\n- Đội ngũ cán bộ lớp chủ động, trách nhiệm trong công việc được phân công.\n- Cha mẹ học sinh nhiệt tình, có trách nhiệm với công việc của lớp, ủng hộ GVCN và nhà trường trong các hoạt động giáo dục.',
    kh_daoduc: '- Hình thành và phát triển cho HS những phẩm chất chủ yếu: yêu nước, nhân ái, chăm chỉ, trung thực, trách nhiệm.\n- Hình thành và phát triển cho HS những năng lực cốt lõi: năng lực tự chủ và tự học, năng lực giao tiếp và hợp tác, năng lực giải quyết vấn đề và sáng tạo và các năng lực đặc thù qua các môn học.\n- Duy trì nền nếp học tập, ý thức kỉ luật và thực hiện tốt nội quy của nhà trường.\n- Rèn luyện: Tốt 100%.\n- Không có học sinh vi phạm an toàn giao thông, quy chế thi tập trung, tệ nạn xã hội.\n- Học sinh giao tiếp với bạn bè văn minh, thanh lịch, không nói tục, chửi bậy.',
    kh_vanhoa: '- HS tích cực, chủ động và tự giác trong học tập; nghiêm túc, trung thực trong các kì kiểm tra, đánh giá định kì, các kì kiểm tra tập trung.\n- Từng bước nâng cao chất lượng học sinh qua các lần kiểm tra tập trung của nhà trường.\n- Thực hiện thắng lợi mục tiêu năm học mà lớp đã xây dựng.\n- Có học sinh tham gia thi HSG và đạt giải ở một số môn học.\n- Đẩy mạnh số lượng các chứng chỉ quốc tế về Tiếng Anh, Tin học.',
    kh_laodong: '- Yêu lao động, giữ gìn cảnh quan lớp học sạch sẽ.\n- Nâng cao trách nhiệm cá nhân trong việc giữ gìn vệ sinh môi trường, bảo vệ cơ sở vật chất.\n- Quan tâm, thực hiện các khảo sát và có định hướng nghề nghiệp cho bản thân.',
    kh_danhhieu: 'Tập thể tiên tiến\nChi đoàn vững mạnh',
    bp_hs: '- Phân chia nhóm học sinh theo năng lực, trình độ tiếp thu của học sinh.\n- Lập nhóm bạn cùng tiến: hỗ trợ ôn tập, kiểm tra đề cương, điểm thường xuyên.',
    bp_cmhs: '- Quản lý nền nếp, học tập và đời sống tinh thần của HS.\n- Phối hợp với GVBM, CMHS giám sát, động viên, khen thưởng kịp thời.\n- Liên hệ mật thiết để giải quyết các vấn đề phát sinh.',
    bp_gvbm: '- Lập nhóm GVBM của lớp.\n- Thông tin kịp thời tình hình của lớp và đưa ra những biện pháp phù hợp giúp lớp đạt mục tiêu.',
    kh_detai: 'Tổ chức thực hiện các giờ học về:\n+ Nếp sống văn minh thanh lịch, kĩ năng sống.\n+ Sinh hoạt theo chủ đề hằng tháng.\n+ Giáo dục cho HS phương pháp tự học, tự nghiên cứu tài liệu.',
    hcn_thongtin: 'Thời gian: … giờ … ngày … / … / …\nHình thức: trực tiếp / trực tuyến\nThành phần:\n+ BGH: …\n+ GVCN: toàn trường          Tổng số: …          Vắng: …\n+ Đoàn thanh niên: …\n+ Giám thị: …\n+ Bộ phận khác: …\nChủ trì cuộc họp: …',
    cb_doan: [{ chucvu: 'Bí thư Chi đoàn', pv: 'Phụ trách chung hoạt động Đoàn thanh niên' }, { chucvu: 'Phó bí thư Chi đoàn', pv: 'Hỗ trợ Bí thư triển khai các hoạt động Đoàn' }],
    bdd: [{ nv: 'Trưởng ban' }, { nv: 'Phó ban' }, { nv: 'Thủ quỹ' }]
  };
  const PV = { 'lớp trưởng': 'Phụ trách chung, theo dõi tình hình học tập và rèn luyện, hoạt động của tập thể.', 'lớp phó học tập': 'Học tập, quản lý điểm số, lập bảng điểm khen thưởng.', 'lớp phó': 'Tình hình rèn luyện, thực hiện nội quy của lớp.' };

  /* ───────── số liệu tự động ───────── */
  const L = () => activeStudents();
  const hoso = ma => ((HT.d && HT.d.hoso) || []).find(h => h.ma === ma) || {};
  const coDL = m => S.entries.some(e => e[E_THANG] === m);
  const rlThang = (ma, m) => { try { return Math.min(3, xlOf(ma, [m]).i); } catch (_) { return null; } };
  const rlKy = (ma, ms) => { if (!ms.some(coDL)) return null; try { return Math.min(3, xlOf(ma, ms).i); } catch (_) { return null; } };
  const ENT = (m, w) => { const ids = new Set(L().map(s => s.ma)); return S.entries.filter(e => e[E_THANG] === m && (w == null || e[E_TUAN] === w) && ids.has(e[E_MA])); };
  const NHOM = [
    ['Số đi muộn', /muon/], ['Số bỏ tiết', /bo tiet|tron tiet|bo hoc|nghi khong phep/], ['Số không chuẩn bị bài', /khong (lam|chuan bi|hoc|soan)|thieu bai|quen sach|quen vo/],
    ['Số bị dưới 5.0', /duoi 5|diem kem|diem yeu/], ['Mắc thái độ sai', /thai do|vo le|hon/], ['Số điểm tốt', /diem (9|10|tot|cao|gioi)|9 ?- ?10|9–10/], ['Số việc tốt', /viec tot|nhat duoc|giup do/]
  ];
  function tuanAuto(m, w) {
    const E = ENT(m, w); if (!coDL(m)) return [];
    const nd = e => bo(e[E_ND] || e[E_MUC]);
    const out = NHOM.map(([, re]) => String(E.filter(e => re.test(nd(e))).length));
    const khen = new Set(E.filter(e => e[E_DIEM] > 0).map(e => e[E_MA])), pb = E.filter(e => e[E_DIEM] < 0);
    out.push(String(khen.size));
    const top = {}; pb.forEach(e => { const k = e[E_ND] || e[E_MUC]; top[k] = (top[k] || 0) + 1; });
    const t1 = Object.entries(top).sort((a, b) => b[1] - a[1])[0];
    out.push(pb.length ? String(new Set(pb.map(e => e[E_MA])).size) + (t1 ? ' (' + t1[0] + ' - ' + String(t1[1]).padStart(2, '0') + ')' : '') : '0');
    out.push('', '', '');
    return out;
  }
  const ROWS = NHOM.map(x => x[0]).concat(['HS được khen', 'HS bị phê bình', 'Số tiết trống', 'Số tiết tự quản tốt', 'Xếp loại cả lớp']);
  function thangData(m) {
    const k = 't' + m + '.', o = { so: m, ten: 'THÁNG ' + m, kehoach: get(k + 'kehoach'), hoctap: get(k + 'hoctap'), renluyen: get(k + 'renluyen'), xtd: get(k + 'xtd') };
    const nT = Math.min(4, S.cfg.soTuan || 4);
    for (let w = 1; w <= 4; w++) {
      o['h' + w] = w <= nT ? 'Tuần ' + w : '';
      const au = w <= nT ? tuanAuto(m, w) : [];
      for (let r = 1; r <= 12; r++) o['r' + r + 'w' + w] = get(k + 'r' + r + 'w' + w, au[r - 1] || '');
    }
    const ds = coDL(m) ? L().map(s => ({ s, i: rlThang(s.ma, m) })) : [];
    const c = [0, 0, 0, 0]; ds.forEach(x => { if (x.i != null) c[x.i]++; });
    const n = ds.length;
    for (let i = 0; i < 4; i++) { o['x' + (2 * i + 1)] = get(k + 'x' + (2 * i + 1), n ? String(c[i]) : ''); o['x' + (2 * i + 2)] = get(k + 'x' + (2 * i + 2), n ? pct(c[i], n) : ''); }
    o.dsxl = get(k + 'dsxl', n ? LV.map((l, i) => { const t = ds.filter(x => x.i === i); if (!t.length) return ''; return '- ' + (S.cfg.thresholds[i] ? S.cfg.thresholds[i].ten : l) + ' (' + t.length + ' HS)' + (i > 0 ? ': ' + t.map(x => x.s.ten).join(', ') : ''); }).filter(Boolean).join('\n') : '');
    return o;
  }
  SCN.thangData = thangData;
  function goiY(m, loai) {
    const E = ENT(m); if (!E.length) return '';
    const by = (f) => { const t = {}; E.filter(f).forEach(e => { (t[e[E_ND] || e[E_MUC]] = t[e[E_ND] || e[E_MUC]] || new Set()).add(e[E_MA]); }); return Object.entries(t).sort((a, b) => b[1].size - a[1].size); };
    const nm = set => Array.from(set).map(ma => ten1((stu(ma) || {}).ten)).join(', ');
    if (loai === 'hoctap') {
      const kh = by(e => e[E_DIEM] > 0 && /hoc|bai|diem|phat bieu/.test(bo(e[E_ND] || e[E_MUC])));
      const ph = by(e => e[E_DIEM] < 0 && /hoc|bai|diem|tiet/.test(bo(e[E_ND] || e[E_MUC])));
      return ['Đa số HS có ý thức học tập, tập trung học, hăng hái phát biểu xây dựng bài.']
        .concat(kh.slice(0, 3).map(([k, s]) => '+ Tuyên dương HS ' + k.toLowerCase() + ': ' + nm(s) + '.'))
        .concat(ph.slice(0, 3).map(([k, s]) => '+ Nhắc nhở HS ' + k.toLowerCase() + ': ' + nm(s) + '.')).join('\n');
    }
    const kh = by(e => e[E_DIEM] > 0), vp = by(e => e[E_DIEM] < 0);
    return ['- Đa số HS có ý thức rèn luyện, chấp hành đúng nội quy của trường, tiêu chí thi đua của lớp.']
      .concat(kh.slice(0, 3).map(([k, s]) => '- Khen: ' + k + ' (' + nm(s) + ').'))
      .concat(vp.slice(0, 4).map(([k, s]) => '- Nhắc nhở: ' + k + ' (' + nm(s) + ').')).join('\n');
  }
  function bieuHien() {
    const out = [], g = {};
    S.entries.filter(e => Math.abs(e[E_DIEM]) >= 3 || String(e[E_GC] || '').trim()).forEach(e => {
      const d = String(e[E_LUC] || '').slice(0, 10), nd = (e[E_ND] || e[E_MUC]) + (e[E_GC] ? ' — ' + e[E_GC] : '');
      const k = d + '|' + nd; (g[k] = g[k] || { d, nd, ma: [], diem: e[E_DIEM] }).ma.push(e[E_MA]);
    });
    Object.values(g).sort((a, b) => a.d.localeCompare(b.d)).forEach(x => {
      const p = x.d.split('-'); out.push({ ngay: p.length === 3 ? (+p[2]) + '/' + (+p[1]) + '/' + p[0] : x.d, ten: x.ma.map(ma => (stu(ma) || {}).ten || ma).join(', '), nd: x.nd + ' (' + (x.diem > 0 ? '+' : '') + x.diem + ' điểm)', _d: x.d });
    });
    getJ('bh_them', []).forEach(x => out.push(Object.assign({ _d: x._d || '' }, x)));
    return out.sort((a, b) => String(a._d).localeCompare(String(b._d)));
  }
  function slAuto() {
    const ds = L(), H = ds.map(s => hoso(s.ma)), y = v => /^(x|có|co|1|đv|dv|true)$/i.test(String(v || '').trim());
    const dien = re => H.filter(h => re.test(bo(h.dien))).length;
    return [ds.length, H.filter(h => /^nu|^nữ/i.test(bo(h.gt))).length, H.filter(h => y(h.dv)).length, H.filter(h => y(h.lb)).length, H.filter(h => y(h.tt)).length,
      dien(/thuong binh/), dien(/liet si/), dien(/cbcn|can bo/), dien(/dac biet/), ''];
  }
  function shlWeeks() {
    const y0 = +(String(S.cfg.namHoc || '').match(/\d{4}/) || [new Date().getFullYear()])[0];
    const bd = get('cfg.ngay_bd', y0 + '-09-01'); const d0 = new Date(bd + 'T00:00:00');
    const mon = new Date(d0); mon.setDate(d0.getDate() - ((d0.getDay() + 6) % 7));
    const nd = getJ('shl', {}); const out = [];
    const f2 = n => String(n).padStart(2, '0');
    for (let k = 0; k < 35; k++) {
      const a = new Date(mon); a.setDate(mon.getDate() + 7 * k); const b = new Date(a); b.setDate(a.getDate() + 4);
      const s = k === 0 && d0 > a ? d0 : a;
      out.push({ tuan: 'Tuần ' + (k + 1), ngay: 'Ngày ' + f2(s.getDate()) + (s.getMonth() !== b.getMonth() ? '/' + f2(s.getMonth() + 1) : '') + ' - ' + f2(b.getDate()) + ' tháng ' + f2(b.getMonth() + 1) + ' năm ' + b.getFullYear(), nd: nd[k + 1] || '', k: k + 1 });
    }
    return out;
  }
  SCN.shlWeeks = shlWeeks;
  /** Chất lượng chung (bảng PHẦN IV) và chất lượng hai mặt — tự tính. */
  function clAuto() {
    const ds = L(), n = ds.length, o = {};
    const cnt = arr => { const c = [0, 0, 0, 0]; arr.forEach(i => { if (i != null) c[i]++; }); return arr.some(i => i != null) ? c : null; };
    const map = { 2: [ds.map(s => LV.indexOf(hoso(s.ma).rl0)).map(i => i < 0 ? null : i), ds.map(s => LV.indexOf(hoso(s.ma).ht0)).map(i => i < 0 ? null : i)],
      3: [null, ds.map(s => HT.ketQua(s.ma, 'gk1').muc)], 4: [ds.map(s => rlKy(s.ma, HK1)), ds.map(s => HT.ketQua(s.ma, 'hk1').muc)],
      5: [null, ds.map(s => HT.ketQua(s.ma, 'gk2').muc)], 6: [ds.map(s => rlKy(s.ma, HK2)), ds.map(s => HT.ketQua(s.ma, 'hk2').muc)],
      7: [ds.map(s => rlKy(s.ma, THANG)), ds.map(s => HT.ketQua(s.ma, 'cn').muc)] };
    Object.keys(map).forEach(r => { const [rl, ht] = map[r]; const a = rl && cnt(rl), b = ht && cnt(ht);
      for (let i = 0; i < 4; i++) { o['cl_' + r + '_' + (1 + i)] = a ? String(a[i]) : ''; o['cl_' + r + '_' + (5 + i)] = b ? String(b[i]) : ''; } });
    const k1 = [cnt(ds.map(s => rlKy(s.ma, HK1))), cnt(ds.map(s => rlKy(s.ma, HK2))), cnt(ds.map(s => HT.ketQua(s.ma, 'hk1').muc)), cnt(ds.map(s => HT.ketQua(s.ma, 'hk2').muc))];
    for (let i = 0; i < 4; i++) {
      const r = 3 + i;
      [[k1[0], 1], [k1[1], 3], [k1[2], 7], [k1[3], 9]].forEach(([c, col]) => { o['c2m_' + r + '_' + col] = c ? String(c[i]) : ''; o['c2m_' + r + '_' + (col + 1)] = c ? pct(c[i], n) : ''; });
    }
    return o;
  }

  /* ───────── dữ liệu điền vào khuôn ───────── */
  SCN.data = function () {
    const D = HT.d, K = kv(), ds = L(), cfg = S.cfg;
    const nh = String(cfg.namHoc || '').replace(/\s*-\s*/, '-');
    const o = {
      gvcn_hoa: String(get('cfg.gvcn', cfg.gvcn || S.me.name)).toUpperCase(), lop: cfg.lop || '', truong_hoa: String(get('cfg.truong', 'THPT YÊN HÒA')).toUpperCase(),
      so_gddt: String(get('cfg.so', 'SỞ GIÁO DỤC VÀ ĐÀO TẠO HÀ NỘI')).toUpperCase(), namhoc: nh, namhoc_gach: nh.replace('-', ' - ')
    };
    const monTen = ma => (HT.monOf(ma) || { ten: ma }).ten;
    o.gv = D.gv.filter(g => g.on !== false).map(g => ({ mon: g.mon.map(monTen).join(', '), ten: g.ten, lh: [g.dt, g.dc].filter(Boolean).join(' · ') || g.email, _o: Math.min.apply(null, g.mon.map(m => (HT.monOf(m) || { tt: 99 }).tt).concat([99])) })).sort((a, b) => a._o - b._o);
    o.gv._min = 9;
    o.qd_lop = get('qd_lop', DEF.qd_lop);
    o.xl = getJ('xl', DEF.xl).map(r => ({ tuan: r[0], thang: r[1], loai: r[2] }));
    const nhom = (cat, dau) => { const g = {}; cat.filter(c => c.active).forEach(c => { (g[c.nhom] = g[c.nhom] || []).push(c.noiDung + ' (' + (c.diem > 0 ? '+' : '') + c.diem + ')'); }); return Object.keys(g).map(k => dau + ' – ' + k + ': ' + g[k].join('; ')); };
    o.dm_diem = get('dm_diem_on', '1') === '1' ? ['Điểm trừ, điểm cộng áp dụng trong sổ theo dõi:'].concat(nhom(S.tru || [], 'Trừ')).concat(nhom(S.cong || [], 'Cộng')).join('\n') : '';
    ['sodo1_ghichu', 'sodo2_ghichu', 'ghichu_thaydoi', 'kh_khokhan', 'kh_thuanloi', 'kh_daoduc', 'kh_vanhoa', 'kh_laodong', 'kh_danhhieu', 'bp_hs', 'bp_cmhs', 'bp_gvbm', 'kh_detai', 'kh_dieuchinh',
      'sk_hk1', 'tk_nam', 'dacdiem_noitroi', 'cd_thang', 'cd_tuan', 'cd_thoigian', 'cd_diadiem', 'cd_noidung', 'hcn_thang', 'hcn_thongtin', 'hcn_noidung',
      'tk_hk1', 'tk_hk1_tang', 'tk_hk1_giam', 'tk_cn', 'tk_cn_tang', 'tk_cn_giam', 'tk_lydo', 'tk_bh_ht', 'tk_bh_bt', 'tk_bh_hc', 'tk_bh_khac', 'tk_giaiphap',
      'xl_lop_hk1', 'xl_lop_hk2', 'xl_cd_hk1', 'xl_cd_hk2', 'thanhtich', 'skkn_1', 'skkn_2', 'skkn_3', 'skkn_4'].forEach(k => { o[k] = get(k, DEF[k] || ''); });
    o.tk_dau = get('tk_dau', String(ds.length));
    const cb = (lst) => lst.map(x => { const s = stu(x.ma) || {}, h = hoso(x.ma); return { chucvu: x.chucvu || '', ten: s.ten || x.ten || '', dc: h.dc || '', dt: h.dt || '', pv: x.pv || '' }; });
    o.cb_doan = cb(getJ('cb_doan', DEF.cb_doan));
    o.cb_lop = cb(getJ('cb_lop', defCbLop()));
    const tos = Array.from(new Set(ds.map(s => String(s.to)))).sort((a, b) => a - b);
    o.cb_to = tos.map(t => { const s = ds.find(x => String(x.to) === t && /tổ trưởng/i.test(x.chucVu || '')); const h = s ? hoso(s.ma) : {}; return { to: t, ten: s ? s.ten : '', dc: h.dc || '', dt: h.dt || '' }; });
    const pair = (a, b) => { const A = ds.filter(s => String(s.to) === a), B = ds.filter(s => String(s.to) === b); const r = []; for (let i = 0; i < Math.max(A.length, B.length); i++) r.push({ ten1: A[i] ? A[i].ten : '', dc1: A[i] ? hoso(A[i].ma).dc || '' : '', ten2: B[i] ? B[i].ten : '', dc2: B[i] ? hoso(B[i].ma).dc || '' : '' }); return r; };
    o.to12 = pair(tos[0] || '1', tos[1] || '2'); o.to34 = pair(tos[2] || '3', tos[3] || '4');
    o.bdd = getJ('bdd', DEF.bdd); o.bdd._min = 3;
    const au = slAuto();
    for (let r = 2; r <= 6; r++) for (let c = 1; c <= 10; c++) o['sl_' + r + '_' + c] = get('sl_' + r + '_' + c, r === 2 ? String(au[c - 1]) : '');
    o.hs = ds.map((s, i) => { const h = hoso(s.ma); return { stt: i + 1, ten: s.ten, rl: h.rl0 || '', ht: h.ht0 || '', kt: h.kt0 || '', gc: h.gc || '', cn: h.cn || '', gd: h.gd || '' }; });
    o.hsdb = ds.filter(s => /^(x|có|co|1|true)$/i.test(String(hoso(s.ma).db || '').trim())).map((s, i) => { const h = hoso(s.ma); return { stt: i + 1, ten: s.ten, dd: [h.bh, h.gd].filter(Boolean).join('; '), bp: h.bp || '' }; });
    o.hsdb._min = 4;
    for (let r = 2; r <= 4; r++) for (let c = 1; c <= 8; c++) o['ct_' + r + '_' + c] = get('ct_' + r + '_' + c);
    o.thang1 = [9, 10, 11, 12].map(thangData); o.thang2 = [1, 2, 3, 4, 5].map(thangData);
    const cl = clAuto(); Object.keys(cl).forEach(k => { o[k] = get(k, cl[k]); });
    for (let r = 2; r <= 7; r++) o['cl_' + r + '_9'] = get('cl_' + r + '_9');
    for (let r = 1; r <= 3; r++) for (let c = 0; c <= 5; c++) o['ctb_' + r + '_' + c] = get('ctb_' + r + '_' + c);
    for (let r = 0; r <= 2; r++) for (let c = 0; c <= 1; c++) o['t35_' + r + '_' + c] = get('t35_' + r + '_' + c);
    o.bh = bieuHien(); o.bh._min = 6;
    o.rl = ds.map((s, i) => { const x = { stt: i + 1, ten: s.ten }; THANG.forEach(m => { x['t' + m] = coDL(m) ? (rlThang(s.ma, m) == null ? '' : shortLv(rlThang(s.ma, m))) : ''; }); return x; });
    o.ph = getJ('ph', []); o.ph._min = 5;
    o.shl = shlWeeks();
    o.img = {};
    return o;
  };
  const shortLv = i => (S.cfg.thresholds[i] ? S.cfg.thresholds[i].ten : LV[i]);
  function defCbLop() {
    const ds = L(), r = [];
    ds.filter(s => /lớp trưởng/i.test(s.chucVu || '')).forEach(s => r.push({ chucvu: 'Lớp trưởng', ma: s.ma, pv: PV['lớp trưởng'] }));
    ds.filter(s => /lớp phó/i.test(s.chucVu || '')).forEach(s => r.push({ chucvu: s.chucVu, ma: s.ma, pv: PV[bo(s.chucVu).indexOf('hoc tap') >= 0 ? 'lớp phó học tập' : 'lớp phó'] }));
    if (!r.length) r.push({ chucvu: 'Lớp trưởng', ma: '', pv: PV['lớp trưởng'] });
    return r;
  }

  /* ───────── ảnh ───────── */
  const IMGS = [['sodo1', 'Sơ đồ lớp học (Học kì I)'], ['sodo2', 'Sơ đồ lớp học (Học kì II)'], ['quydinh_lop', 'Bảng quy định điểm cộng, điểm trừ của lớp'],
    ['sk_hk1', 'Trang tổng kết HK I (sổ theo dõi và đánh giá HS)'], ['tk_nam', 'Trang tổng kết HK II và cả năm'],
    ['bb_daunam', 'Biên bản họp CMHS đầu năm học'], ['bb_hk1', 'Biên bản họp CMHS cuối học kì I'], ['bb_cuoinam', 'Biên bản họp CMHS cuối năm học']];
  SCN.IMGS = IMGS;
  const imgList = key => getJ('img.' + key, []);
  async function imgData(it) {
    if (SCN.imgs[it.id]) return SCN.imgs[it.id];
    const j = await rawApi('scnImgGet', { id: it.id }, 60000);
    SCN.imgs[it.id] = { data: j.data, mime: j.mime }; return SCN.imgs[it.id];
  }
  function shrink(file, max) {
    return new Promise((ok, no) => {
      const fr = new FileReader(); fr.onerror = () => no(new Error('Không đọc được ảnh.'));
      fr.onload = () => { const im = new Image(); im.onerror = () => no(new Error('Tệp không phải ảnh.')); im.onload = () => {
        const k = Math.min(1, max / Math.max(im.width, im.height)), w = Math.round(im.width * k), h = Math.round(im.height * k);
        const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.drawImage(im, 0, 0, w, h);
        const url = c.toDataURL('image/jpeg', 0.88); ok({ data: url.split(',')[1], mime: 'image/jpeg', w, h, url }); }; im.src = fr.result; };
      fr.readAsDataURL(file);
    });
  }
  async function upImg(key, files, thay) {
    for (const f of files) {
      const r = await shrink(f, 2200);
      toast('Đang tải ảnh lên…');
      const j = await rawApi('scnImg', { key, name: f.name.replace(/\.[^.]+$/, '') + '.jpg', mime: r.mime, data: r.data, w: r.w, h: r.h, thay: thay ? 1 : 0 }, 120000);
      thay = false;
      HT.d.scn['img.' + key] = JSON.stringify(j.list);
      const last = j.list[j.list.length - 1]; SCN.imgs[last.id] = { data: r.data, mime: r.mime };
    }
    toast('Đã lưu ảnh.'); SCN.render();
  }

  /* ───────── lưu nội dung GVCN điền ───────── */
  function put(k, v) {
    HT.d.scn[k] = v; SCN.pend[k] = v;
    clearTimeout(SCN.t); SCN.t = setTimeout(flush, 900);
    const c = document.getElementById('scnSaved'); if (c) c.textContent = 'Đang lưu…';
  }
  function flush() {
    const kv2 = SCN.pend; SCN.pend = {};
    if (Object.keys(kv2).length) HT.queue('scnSave', { kv: kv2 });
    const c = document.getElementById('scnSaved'); if (c) c.textContent = 'Đã lưu';
  }
  SCN.put = put;
  window.addEventListener('beforeunload', () => { if (Object.keys(SCN.pend).length) flush(); });

  /* ───────── giao diện ───────── */
  const css = document.createElement('style'); css.id = 'scn-css';
  css.textContent = `
#vSCN,#vHT{min-width:0;max-width:100%;overflow-x:hidden} .scnsec{min-width:0} .scnf{min-width:0} .scnf .tablewrap,.scngrid{max-width:100%}
#vSCN .scntop{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:0 12px 12px}
#vSCN .scntop .sp{flex:1} #scnSaved{font-size:12px;color:var(--mute);font-weight:700}
.scnsec{margin:0 12px 14px;background:var(--card);border:1px solid var(--line);border-radius:var(--r-lg);padding:4px 14px 12px}
.scnsec>h3{margin:12px 0 4px;font-size:15px;color:var(--teal-d)} .scnsec>p.hint{margin:0 0 8px;font-size:12.5px;color:var(--mute);line-height:1.5}
.scnf{margin:10px 0} .scnf>label{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:800;color:var(--sub);margin:0 0 5px}
.scnf>label .au{font-weight:700;font-size:11px;color:var(--ok);background:var(--ok-bg);border-radius:99px;padding:1px 8px}
.scnf>label button{margin-left:auto;font-size:12px;color:var(--teal-d);background:var(--pale);border:0;border-radius:8px;padding:3px 9px;font-weight:700;cursor:pointer}
.scnf textarea,.scnf input[type=text],.scnf input[type=date],.scnf input[type=email]{width:100%;border:1.5px solid var(--line);border-radius:10px;padding:9px 11px;font:inherit;font-size:14px;line-height:1.55;background:#fff}
.scnf textarea{min-height:70px;resize:vertical} .scnf textarea:focus,.scnf input:focus{outline:2px solid var(--teal-xl);border-color:var(--teal)}
.scnauto{border:1px dashed var(--line);border-radius:10px;padding:9px 11px;font-size:13.5px;white-space:pre-line;color:var(--ink);background:var(--paler);max-height:260px;overflow:auto}
.scngrid{overflow-x:auto} .scngrid table{font-size:12.5px} .scngrid td,.scngrid th{padding:4px 5px} .scngrid input{width:62px;height:30px;border:1.5px solid var(--line);border-radius:7px;text-align:center;font:inherit;font-size:13px}
.scngrid input::placeholder{color:var(--teal-d);opacity:.75;font-weight:700} .scngrid td.lb{text-align:left;font-weight:700;white-space:nowrap}
.scngrid input.w{width:150px;text-align:left}
.scnlist table input,.scnlist table select{width:100%;min-width:90px;height:32px;border:1.5px solid var(--line);border-radius:7px;padding:0 7px;font:inherit;font-size:13px;background:#fff}
.scnlist .x{border:0;background:none;color:var(--dang);font-size:18px;cursor:pointer}
.scnimgs{display:flex;flex-wrap:wrap;gap:8px} .scnimgs .im{position:relative;width:120px;height:90px;border:1px solid var(--line);border-radius:10px;overflow:hidden;background:var(--paler);display:grid;place-items:center;font-size:11px;color:var(--mute)}
.scnimgs .im img{width:100%;height:100%;object-fit:cover} .scnimgs .im button{position:absolute;top:3px;right:3px;width:24px;height:24px;border-radius:50%;border:0;background:rgba(0,0,0,.55);color:#fff;cursor:pointer}
.scnimgs .add{width:120px;height:90px;border:1.5px dashed var(--teal-l);border-radius:10px;background:var(--pale);color:var(--teal-d);font-weight:700;font-size:12.5px;cursor:pointer}
.scnmon{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 4px} .scnmon button{height:32px;padding:0 12px;border-radius:9px;border:1.5px solid var(--line);background:var(--card);font-weight:700;color:var(--sub);font-size:13px}
.scnmon button.on{background:var(--teal);border-color:var(--teal);color:#fff}
.hsgrid{margin:0 12px 14px} .hsgrid td{padding:3px 4px} .hsgrid input{height:30px;border:1px solid var(--line2);border-radius:6px;padding:0 6px;font:inherit;font-size:12.5px;width:100%;min-width:90px;background:#fff}
.hsgrid input.s{min-width:46px;width:56px;text-align:center} .hsgrid input.l{min-width:200px}
.hsgrid input:focus{border-color:var(--teal);outline:0}
@media (min-width:761px){ #vSCN .scntop{padding-left:26px;padding-right:26px} .scnsec,.hsgrid{margin-left:26px;margin-right:26px} }`;
  document.head.appendChild(css);

  ICON.scn = '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11M9 8h6"/>';
  NAV.splice(NAV.findIndex(n => n.v === 'ls'), 0, { v: 'scn', t: 'Sổ công tác chủ nhiệm', s: 'Sổ CN', el: '#vSCN' });
  (function () { const b = $('#vLS'); if (b && !$('#vSCN')) { const s = document.createElement('section'); s.className = 'view hide'; s.id = 'vSCN'; b.before(s); } })();
  const navItemsS = navItems;
  window.navItems = navItems = function () { return navItemsS.apply(this, arguments).filter(n => n.v !== 'scn' || (S.me && isGVCN())); };
  const goS = go;
  window.go = go = async function (v) {
    if (v === 'scn') {
      S.view = v; syncView(); try { exitMulti(); } catch (_) {}
      if (!HT.d || !S.allLoaded) {
        $('#vSCN').innerHTML = '<div class="sechead"><h2>Đang tải dữ liệu sổ chủ nhiệm</h2></div>' + skeleton(6);
        try { await Promise.all([HT.load(), S.allLoaded ? null : loadAllMonths()]); } catch (e) { err(e); }
      }
      SCN.render(); return;
    }
    return goS.apply(this, arguments);
  };
  const renderAllS = renderAll;
  window.renderAll = renderAll = function () { renderAllS.apply(this, arguments); if (S.view === 'scn') SCN.render(); };

  const TABS = [['chung', 'Thông tin chung'], ['p1', 'I. Quy định'], ['p2', 'II. Tổ chức lớp'], ['p3', 'III. Kế hoạch giáo dục'], ['thang', 'Kế hoạch từng tháng'],
    ['p4', 'IV. Theo dõi học sinh'], ['tk', 'Tổng kết năm học'], ['hoso', 'Hồ sơ học sinh']];
  SCN.render = function () {
    const box = $('#vSCN'); if (!box || S.view !== 'scn') return;
    if (!HT.d || !HT.d.scn) { box.innerHTML = '<div class="empty"><b>Chưa tải được dữ liệu</b>Kiểm tra mạng rồi mở lại mục Sổ công tác chủ nhiệm.</div>'; return; }
    if (box.contains(document.activeElement) && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    if (!SCN.thang) { const m = new Date().getMonth() + 1; SCN.thang = THANG.indexOf(m) >= 0 ? m : 9; }
    let h = `<div class="httabs">${TABS.map(([k, l]) => `<button data-st="${k}" class="${SCN.tab === k ? 'on' : ''}">${l}</button>`).join('')}</div>
      <div class="scntop"><span id="scnSaved"></span><span class="sp"></span>
      <button class="hb" id="scnWord">${IC.down}<span class="lg">Xuất file Word</span></button><button class="hb p" id="scnBGH">${IC.mail}<span class="lg">Gửi Ban giám hiệu</span></button></div>`;
    h += ({ chung: vChung, p1: vP1, p2: vP2, p3: vP3, thang: vThang, p4: vP4, tk: vTK, hoso: vHoSo })[SCN.tab]();
    box.innerHTML = h;
    box.querySelectorAll('[data-st]').forEach(b => b.onclick = () => { flush(); SCN.tab = b.dataset.st; SCN.render(); window.scrollTo(0, 0); });
    box.querySelector('#scnWord').onclick = () => xuatWord();
    box.querySelector('#scnBGH').onclick = () => guiBGH();
    bindFields(box);
    if (SCN.tab === 'hoso') bindHoSo(box);
    if (SCN.tab === 'thang') box.querySelectorAll('[data-tm]').forEach(b => b.onclick = () => { flush(); SCN.thang = +b.dataset.tm; SCN.render(); });
    box.querySelectorAll('.im[data-id]').forEach(async el => { try { const d = await imgData({ id: el.dataset.id }); el.innerHTML = `<img alt="" src="data:${d.mime};base64,${d.data}"><button data-imgdel="${esc(el.dataset.id)}" data-k="${esc(el.dataset.k)}" aria-label="Xoá ảnh">×</button>`; bindImgDel(el); } catch (_) { el.textContent = 'Không tải được ảnh'; } });
  };

  /* ── trường nhập ── */
  const fText = (k, l, o) => { o = o || {}; const d = o.def != null ? o.def : DEF[k];
    return `<div class="scnf"><label>${l}${o.au ? '<span class="au">Tự động</span>' : ''}${d ? `<button data-def="${esc(k)}">Điền mẫu</button>` : ''}${o.goiy ? `<button data-goiy="${esc(o.goiy)}" data-k="${esc(k)}">Gợi ý từ dữ liệu</button>` : ''}</label>
      <textarea data-k="${esc(k)}" rows="${o.rows || 4}" placeholder="${esc(o.ph || 'GVCN điền (để trống ⇒ in ô trống)')}">${esc(kv()[k] != null ? kv()[k] : (d || ''))}</textarea></div>`; };
  const fLine = (k, l, o) => { o = o || {}; return `<div class="scnf"><label>${l}</label><input type="${o.type || 'text'}" data-k="${esc(k)}" value="${esc(get(k, o.d || ''))}" placeholder="${esc(o.ph || '')}"></div>`; };
  const fAuto = (l, txt, note) => `<div class="scnf"><label>${l}<span class="au">Tự động</span></label><div class="scnauto">${txt ? esc(txt) : '<span style="color:var(--mute)">(chưa có dữ liệu)</span>'}</div>${note ? `<p class="hint" style="font-size:12px;color:var(--mute);margin:5px 0 0">${note}</p>` : ''}</div>`;
  function fGrid(pre, rows, cols, opt) {
    opt = opt || {}; const au = opt.auto || {};
    return `<div class="scnf"><label>${opt.l || ''}${opt.auto ? '<span class="au">Tự động · sửa được</span>' : ''}</label><div class="scngrid"><table><thead><tr><th></th>${cols.map(c => `<th>${esc(c[1])}</th>`).join('')}</tr></thead><tbody>
      ${rows.map(([ri, rl]) => `<tr><td class="lb">${esc(rl)}</td>${cols.map(([ci]) => { const k = pre + '_' + ri + '_' + ci; return `<td><input data-k="${k}" value="${esc(kv()[k] || '')}" placeholder="${esc(au[k] || '')}"${opt.w && opt.w.indexOf(ci) >= 0 ? ' class="w"' : ''}></td>`; }).join('')}</tr>`).join('')}
      </tbody></table></div>${opt.auto ? '<p class="hint" style="font-size:12px;color:var(--mute);margin:5px 0 0">Số mờ là số hệ thống tự tính; gõ số vào ô để thay.</p>' : ''}</div>`;
  }
  function fList(k, cols, def, l, note) {
    const list = getJ(k, def || []);
    return `<div class="scnf scnlist"><label>${l}</label><div class="tablewrap"><table data-list="${esc(k)}"><thead><tr>${cols.map(c => `<th>${esc(c[1])}</th>`).join('')}<th></th></tr></thead><tbody>
      ${list.map(it => listRow(cols, it)).join('')}</tbody></table></div>
      <button class="hb" data-add="${esc(k)}" style="margin-top:6px;height:34px">${IC.plus} Thêm dòng</button>${note ? `<p class="hint" style="font-size:12px;color:var(--mute);margin:5px 0 0">${note}</p>` : ''}</div>`;
  }
  const HS_OPT = () => '<option value=""></option>' + L().map(s => `<option value="${esc(s.ma)}">${esc(s.ten)}</option>`).join('');
  function listRow(cols, it) {
    return `<tr>${cols.map(([c, , t]) => t === 'hs' ? `<td><select data-c="${c}">${HS_OPT().replace(`value="${esc(it[c] || '')}"`, `value="${esc(it[c] || '')}" selected`)}</select></td>` : `<td><input data-c="${c}" value="${esc(it[c] || '')}"${t === 'date' ? ' type="date"' : ''}></td>`).join('')}<td><button class="x" aria-label="Xoá dòng">×</button></td></tr>`;
  }
  function fImg(key, l, note) {
    return `<div class="scnf"><label>${l}</label><div class="scnimgs">${imgList(key).map(it => `<div class="im" data-id="${esc(it.id)}" data-k="${esc(key)}">Đang tải…</div>`).join('')}
      <button class="add" data-img="${esc(key)}">+ Thêm ảnh</button></div>${note ? `<p class="hint" style="font-size:12px;color:var(--mute);margin:5px 0 0">${note}</p>` : ''}</div>`;
  }
  const sec = (t, hint, body) => `<div class="scnsec"><h3>${t}</h3>${hint ? `<p class="hint">${hint}</p>` : ''}${body}</div>`;
  function bindImgDel(el) {
    const b = el.querySelector('[data-imgdel]'); if (!b) return;
    b.onclick = async () => { if (!confirm('Xoá ảnh này khỏi sổ?')) return;
      try { const j = await rawApi('scnImgDel', { key: b.dataset.k, id: b.dataset.imgdel }); HT.d.scn['img.' + b.dataset.k] = JSON.stringify(j.list); SCN.render(); } catch (e) { err(e); } };
  }
  function bindFields(box) {
    box.querySelectorAll('textarea[data-k],input[data-k]').forEach(i => i.addEventListener('input', () => put(i.dataset.k, i.value)));
    box.querySelectorAll('[data-def]').forEach(b => b.onclick = () => { const k = b.dataset.def, t = box.querySelector(`textarea[data-k="${k}"]`); if (t.value.trim() && !confirm('Thay nội dung đang có bằng nội dung mẫu?')) return; t.value = DEF[k]; put(k, DEF[k]); });
    box.querySelectorAll('[data-goiy]').forEach(b => b.onclick = () => { const k = b.dataset.k, t = box.querySelector(`textarea[data-k="${k}"]`); const g = goiY(SCN.thang, b.dataset.goiy);
      if (!g) { toast('Tháng ' + SCN.thang + ' chưa có dữ liệu theo dõi.'); return; } t.value = (t.value.trim() ? t.value.trim() + '\n' : '') + g; put(k, t.value); });
    box.querySelectorAll('table[data-list]').forEach(T => {
      const k = T.dataset.list, cols = Array.from(T.querySelectorAll('thead th')).slice(0, -1);
      const save = () => { const v = Array.from(T.tBodies[0].rows).map(tr => { const o = {}; tr.querySelectorAll('[data-c]').forEach(x => { o[x.dataset.c] = x.value; }); return o; }); put(k, JSON.stringify(v)); };
      T.addEventListener('input', save); T.addEventListener('change', save);
      const delB = () => T.querySelectorAll('.x').forEach(b => b.onclick = () => { b.closest('tr').remove(); save(); }); delB();
      const add = box.querySelector(`[data-add="${k}"]`);
      if (add) add.onclick = () => { const proto = T.tBodies[0].rows[0]; let tr;
        if (proto) { tr = proto.cloneNode(true); tr.querySelectorAll('input').forEach(x => x.value = ''); tr.querySelectorAll('select').forEach(x => x.value = ''); }
        else { const tmp = document.createElement('tbody'); tmp.innerHTML = listRow(LCOLS[k] || cols.map((c, i) => ['c' + i, c.textContent]), {}); tr = tmp.rows[0]; }
        T.tBodies[0].appendChild(tr); delB(); save(); };
    });
    box.querySelectorAll('[data-img]').forEach(b => b.onclick = () => { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.multiple = true;
      inp.onchange = () => upImg(b.dataset.img, Array.from(inp.files)).catch(err); inp.click(); });
    box.querySelectorAll('[data-slrow]').forEach(b => b.onclick = () => { const r = b.dataset.slrow, au = slAuto(); for (let c = 1; c <= 9; c++) { const k = 'sl_' + r + '_' + c, i = box.querySelector(`input[data-k="${k}"]`); if (i) { i.value = au[c - 1]; put(k, String(au[c - 1])); } } toast('Đã điền số liệu hiện tại.'); });
    box.querySelectorAll('[data-shl]').forEach(t => t.addEventListener('input', () => { const m = getJ('shl', {}); m[t.dataset.shl] = t.value; put('shl', JSON.stringify(m)); }));
    const dm = box.querySelector('#scnDm'); if (dm) dm.onchange = () => put('dm_diem_on', dm.checked ? '1' : '0');
  }
  const LCOLS = {
    cb_doan: [['chucvu', 'Chức vụ'], ['ma', 'Học sinh', 'hs'], ['pv', 'Phần việc phụ trách']],
    cb_lop: [['chucvu', 'Chức vụ'], ['ma', 'Học sinh', 'hs'], ['pv', 'Phần việc phụ trách']],
    bdd: [['ten', 'Họ tên'], ['nghe', 'Nghề nghiệp'], ['dc', 'Địa chỉ'], ['dt', 'Số ĐT'], ['nv', 'Nhiệm vụ']],
    ph: [['ngay', 'Ngày, tháng, năm'], ['dt', 'Đối tượng phối hợp (cá nhân, đoàn thể)'], ['nd', 'Nội dung hoạt động phối hợp']],
    xl: [['0', 'Tuần'], ['1', 'Tháng'], ['2', 'Xếp loại']],
    bh_them: [['ngay', 'Ngày, tháng, năm'], ['ten', 'Họ, tên học sinh'], ['nd', 'Biểu hiện cụ thể đáng chú ý']]
  };

  /* ── các mục ── */
  function vChung() {
    return sec('Thông tin chung của sổ', 'In trên bìa sổ và dùng khi gửi email.', fLine('cfg.gvcn', 'Họ tên giáo viên chủ nhiệm', { d: S.cfg.gvcn || S.me.name }) + fLine('cfg.truong', 'Trường', { d: 'THPT Yên Hòa' })
      + fLine('cfg.so', 'Cơ quan chủ quản (dòng đầu bìa)', { d: 'Sở Giáo dục và Đào tạo Hà Nội' }) + fLine('cfg.bgh_email', 'Email Ban giám hiệu nhận báo cáo (nhiều email cách nhau dấu phẩy)', { type: 'email', ph: 'vd: hieutruong@…, phohieutruong@…' })
      + fLine('cfg.ngay_bd', 'Ngày bắt đầu năm học (để ghi ngày các tuần sinh hoạt lớp)', { type: 'date', d: (String(S.cfg.namHoc || '').match(/\d{4}/) || ['2026'])[0] + '-09-01' }))
      + sec('Cách dùng', '', `<div class="scnauto" style="background:#fff;border-style:solid">1. Các mục có nhãn <b>Tự động</b> lấy từ dữ liệu đã lưu trong sổ (danh sách lớp, nhật ký theo dõi nề nếp, kết quả học tập, hồ sơ học sinh).
2. Các mục còn lại giáo viên chủ nhiệm điền; nội dung tự lưu sau khi gõ. Mục nào để trống thì file Word in ô trống như sổ giấy.
3. Bấm <b>Xuất file Word</b> để tải sổ theo đúng mẫu của trường; bấm <b>Gửi Ban giám hiệu</b> để gửi email kèm file.</div>`.replace(/<b>/g, '').replace(/<\/b>/g, ''));
  }
  function vP1() {
    const d = SCN.data();
    return sec('Danh sách các thầy (cô) bộ môn', 'Lấy từ Kết quả học tập ▸ Môn học &amp; giáo viên.', fAuto('Giáo viên bộ môn', d.gv.map(g => '- ' + g.mon + ': ' + g.ten + (g.lh ? ' · ' + g.lh : '')).join('\n')))
      + sec('Quy định đánh giá rèn luyện của lớp', '', fText('qd_lop', 'Tiêu chí đánh giá rèn luyện của lớp', { rows: 4 })
        + fList('xl', [['0', 'Tuần'], ['1', 'Tháng'], ['2', 'Xếp loại']], DEF.xl.map(r => ({ 0: r[0], 1: r[1], 2: r[2] })), 'Bảng quy đổi điểm thi đua – xếp loại', 'Bảng in ngay dưới tiêu chí. Mặc định theo mẫu sổ của trường.')
        + fImg('quydinh_lop', 'Ảnh bảng quy định điểm cộng, điểm trừ của lớp (không bắt buộc)')
        + `<div class="scnf"><label><input type="checkbox" id="scnDm"${get('dm_diem_on', '1') === '1' ? ' checked' : ''} style="width:18px;height:18px"> In kèm danh mục điểm cộng, điểm trừ đang dùng trong sổ</label></div>`);
  }
  function vP2() {
    const d = SCN.data();
    return sec('Sơ đồ lớp học', 'Chụp hoặc chọn ảnh sơ đồ chỗ ngồi; ảnh được chèn vào đúng trang của sổ (vừa khổ giấy).',
      fImg('sodo1', 'Sơ đồ lớp học (Học kì I)') + fText('sodo1_ghichu', 'Phần ghi chú thay đổi (HK I)', { rows: 2 }) + fImg('sodo2', 'Sơ đồ lớp học (Học kì II)') + fText('sodo2_ghichu', 'Phần ghi chú thay đổi (HK II)', { rows: 2, def: '' }))
      + sec('Phân công cán bộ lớp', 'Địa chỉ, điện thoại lấy từ thẻ Hồ sơ học sinh.',
        fList('cb_doan', LCOLS.cb_doan, DEF.cb_doan, '1. Tổ chức Đoàn, Đội') + fList('cb_lop', LCOLS.cb_lop, defCbLop(), '2. Tổ chức lớp')
        + fAuto('3. Các tổ trưởng', d.cb_to.map(t => 'Tổ ' + t.to + ': ' + (t.ten || '…') + (t.dt ? ' · ' + t.dt : '')).join('\n'), 'Theo chức vụ "Tổ trưởng" trong danh sách lớp (Cài đặt).'))
      + sec('Danh sách học sinh chia theo tổ', '', fAuto('Danh sách theo tổ', Array.from(new Set(L().map(s => s.to))).map(t => 'Tổ ' + t + ': ' + L().filter(s => s.to === t).map(s => s.ten).join(', ')).join('\n')))
      + sec('Danh sách Ban đại diện cha mẹ học sinh', '', fList('bdd', LCOLS.bdd, DEF.bdd, 'Ban đại diện CMHS') + fText('ghichu_thaydoi', 'Những ghi chú và thay đổi', { rows: 3, def: '' }));
  }
  function vP3() {
    const au = slAuto(), A = {}; for (let c = 1; c <= 10; c++) A['sl_2_' + c] = String(au[c - 1]);
    const COL = [[1, 'Tổng số'], [2, 'Nữ'], [3, 'ĐV'], [4, 'Lưu ban'], [5, 'Trái tuyến'], [6, 'Thương binh'], [7, 'Liệt sĩ'], [8, 'CBCN'], [9, 'Đặc biệt'], [10, 'Ghi chú']];
    const ROW = [[2, 'Đầu năm'], [3, 'Giữa HK I'], [4, 'Đầu HK II'], [5, 'Giữa HK II'], [6, 'Cuối năm']];
    return sec('Tình hình lớp: số lượng', 'Hàng "Đầu năm" tự tính từ danh sách lớp và hồ sơ học sinh. Các hàng khác: bấm nút để điền số liệu tại thời điểm đó.',
      fGrid('sl', ROW, COL, { auto: A, w: [10] }) + `<div style="display:flex;gap:6px;flex-wrap:wrap">${ROW.slice(1).map(([r, l]) => `<button class="hb" style="height:32px" data-slrow="${r}">Điền số liệu hiện tại vào "${l}"</button>`).join('')}</div>`)
      + sec('Kết quả năm học trước · Số học sinh đặc biệt · Danh sách học sinh', 'Lấy từ thẻ Hồ sơ học sinh (kết quả năm trước, đặc điểm cá nhân, gia đình, học sinh cần quan tâm đặc biệt).',
        fAuto('Học sinh cần quan tâm đặc biệt', SCN.data().hsdb.map(x => '- ' + x.ten + (x.dd ? ': ' + x.dd : '') + (x.bp ? ' ⇒ ' + x.bp : '')).join('\n')))
      + sec('Kế hoạch chủ nhiệm', '(Dựa theo kế hoạch nhà trường để xây dựng kế hoạch chủ nhiệm lớp.)',
        '<h3 style="font-size:14px;margin:10px 0 0">I. Đặc điểm tình hình</h3>' + fText('kh_khokhan', '1. Khó khăn') + fText('kh_thuanloi', '2. Thuận lợi')
        + '<h3 style="font-size:14px;margin:14px 0 0">II. Nội dung kế hoạch</h3>' + fText('kh_daoduc', '1.1. Giáo dục đạo đức', { rows: 6 }) + fText('kh_vanhoa', '1.2. Giáo dục văn hoá', { rows: 5 }) + fText('kh_laodong', '1.3. Lao động và hướng nghiệp')
        + fGrid('ct', [[2, 'Học kì I'], [3, 'Học kì II'], [4, 'Danh hiệu cả năm']], [[1, 'RL Tốt'], [2, 'RL Khá'], [3, 'RL Đạt'], [4, 'RL CĐ'], [5, 'HT X.sắc'], [6, 'HT Giỏi'], [7, 'HT Đạt'], [8, 'HT CĐ']], { l: '2. Chỉ tiêu' })
        + fText('kh_danhhieu', '3. Các danh hiệu phấn đấu', { rows: 2 })
        + '<h3 style="font-size:14px;margin:14px 0 0">III. Biện pháp chính</h3>' + fText('bp_hs', '1. Đối với học sinh', { rows: 3 }) + fText('bp_cmhs', '2. Phối hợp với CMHS', { rows: 3 }) + fText('bp_gvbm', '3. Phối hợp với GVBM', { rows: 3 })
        + fText('kh_detai', 'IV. Những đề tài đi sâu để rút kinh nghiệm', { rows: 4 }) + fText('kh_dieuchinh', 'V. Điều chỉnh kế hoạch', { rows: 3, def: '' }));
  }
  function vThang() {
    const m = SCN.thang, k = 't' + m + '.', d = thangData(m);
    const A = {}; for (let w = 1; w <= 4; w++) for (let r = 1; r <= 12; r++) { const au = tuanAuto(m, w); A['t' + m + '.r' + r + 'w' + w] = au[r - 1] || ''; }
    const grid = `<div class="scnf"><label>Sơ kết hằng tuần<span class="au">Tự động · sửa được</span></label><div class="scngrid"><table><thead><tr><th></th>${[1, 2, 3, 4].map(w => `<th>Tuần ${w}</th>`).join('')}</tr></thead><tbody>
      ${ROWS.map((rl, ri) => `<tr><td class="lb">${esc(rl)}</td>${[1, 2, 3, 4].map(w => { const kk = k + 'r' + (ri + 1) + 'w' + w; return `<td><input data-k="${kk}" value="${esc(kv()[kk] || '')}" placeholder="${esc(A[kk] || '')}"${ri >= 8 ? ' class="w"' : ''}></td>`; }).join('')}</tr>`).join('')}</tbody></table></div>
      <p class="hint" style="font-size:12px;color:var(--mute);margin:5px 0 0">Số mờ đếm từ nhật ký theo dõi nề nếp (theo nội dung ghi nhận). Gõ vào ô để thay; "Số tiết trống", "Số tiết tự quản tốt", "Xếp loại cả lớp" GVCN điền.</p></div>`;
    return `<div class="scnsec" style="padding-top:10px"><div class="scnmon">${THANG.map(t => `<button data-tm="${t}" class="${t === m ? 'on' : ''}">Tháng ${t}</button>`).join('')}</div></div>`
      + sec('Kế hoạch cụ thể tháng ' + m, '', fText(k + 'kehoach', '1. Kế hoạch hoạt động (chủ đề tháng, nội dung trọng tâm)', { rows: 6, def: '' })
        + '<h3 style="font-size:14px;margin:12px 0 0">2. Đánh giá của GVCN và tình hình lớp trong tháng</h3>'
        + fText(k + 'hoctap', '- Học tập', { rows: 5, def: '', goiy: 'hoctap' })
        + fText(k + 'renluyen', '- Rèn luyện (ghi rõ họ tên học sinh có biểu hiện tốt và học sinh cần phải theo dõi tiếp)', { rows: 6, def: '', goiy: 'renluyen' })
        + fAuto('Số lượng học sinh được đánh giá theo các mức trong tháng', d.dsxl, 'Theo xếp loại tháng ' + m + ' trong sổ (xếp loại GVCN đã xác nhận được ưu tiên).')
        + grid
        + fAuto('Tổng hợp theo dõi đánh giá rèn luyện học sinh tháng ' + m, d.x1 ? LV.map((l, i) => l + ': ' + d['x' + (2 * i + 1)] + ' (' + d['x' + (2 * i + 2)] + ')').join(' · ') : '')
        + fLine(k + 'xtd', 'Xếp thi đua tháng ' + m));
  }
  function vP4() {
    const A = clAuto(), d = SCN.data();
    return sec('Chất lượng chung của lớp', 'Kết quả học tập lấy từ Kết quả học tập; kết quả rèn luyện lấy từ xếp loại tháng; "Năm trước" lấy từ hồ sơ học sinh.',
      fGrid('cl', [[2, 'Năm trước'], [3, 'Giữa học kì I'], [4, 'Học kì I'], [5, 'Giữa học kì II'], [6, 'Học kì II'], [7, 'Cả năm']],
        [[1, 'RL Tốt'], [2, 'RL Khá'], [3, 'RL Đạt'], [4, 'RL CĐ'], [5, 'HT Tốt'], [6, 'HT Khá'], [7, 'HT Đạt'], [8, 'HT CĐ'], [9, 'Ghi chú']], { auto: A, w: [9] }))
      + sec('Số học sinh chưa tiến bộ', '', fGrid('ctb', [[1, 'Nam'], [2, 'Nữ']], [[1, 'Đầu năm'], [2, 'Giữa HK I'], [3, 'HKI'], [4, 'Giữa HKII'], [5, 'Cả năm']]))
      + sec('Các đặc điểm nổi trội khác của lớp', '', fText('dacdiem_noitroi', 'Đặc điểm nổi trội', { rows: 3, def: '' }))
      + sec('Theo dõi các biểu hiện của học sinh', 'Tự động: các ghi nhận có ghi chú hoặc từ 3 điểm trở lên trong nhật ký theo dõi. Thêm biểu hiện khác ở bảng dưới.',
        fAuto('Từ nhật ký theo dõi (' + d.bh.length + ' dòng)', d.bh.slice(0, 40).map(x => x.ngay + ' · ' + x.ten + ' · ' + x.nd).join('\n') + (d.bh.length > 40 ? '\n…' : '')) + fList('bh_them', LCOLS.bh_them, [], 'Biểu hiện khác (GVCN ghi thêm)'))
      + sec('Mức đánh giá rèn luyện theo tháng', '', fAuto('Từng học sinh × tháng', d.rl.slice(0, 12).map(x => x.ten + ': ' + THANG.map(m => x['t' + m] ? 'T' + m + ' ' + x['t' + m] : '').filter(Boolean).join(', ')).join('\n') + (d.rl.length > 12 ? '\n… (đủ ' + d.rl.length + ' học sinh trong file Word)' : '')))
      + sec('Các hoạt động GVCN đã thực hiện nhằm phối hợp giáo dục học sinh', '', fList('ph', LCOLS.ph, [], 'Hoạt động phối hợp'))
      + sec('Nội dung cơ bản các buổi sinh hoạt lớp', 'Ngày của từng tuần tính từ ngày bắt đầu năm học (Thông tin chung).',
        `<div class="scngrid"><table><tbody>${shlWeeks().map(w => `<tr><td class="lb">${w.tuan}<br><span style="font-weight:500;color:var(--mute)">${esc(w.ngay.replace('Ngày ', ''))}</span></td><td style="width:100%"><textarea data-shl="${w.k}" rows="2" style="width:100%;border:1.5px solid var(--line);border-radius:8px;padding:6px 8px;font:inherit;font-size:13px">${esc(w.nd)}</textarea></td></tr>`).join('')}</tbody></table></div>`)
      + sec('Nội dung các buổi sinh hoạt lớp theo chuyên đề do GVCN tổ chức', '', fLine('cd_thang', 'Tháng') + fLine('cd_tuan', 'Tuần') + fLine('cd_thoigian', 'Thời gian tổ chức hoạt động') + fLine('cd_diadiem', 'Địa điểm') + fText('cd_noidung', 'Dự kiến nội dung', { def: '' }))
      + sec('Nội dung cơ bản các buổi họp chủ nhiệm (của trường hoặc khối)', '', fLine('hcn_thang', 'Biên bản họp GVCN – tháng') + fText('hcn_thongtin', 'A. Thông tin chung', { rows: 8 }) + fText('hcn_noidung', 'B. Nội dung', { rows: 6, def: '' }))
      + sec('Biên bản họp cha mẹ học sinh', 'Chụp ảnh biên bản đã ký; ảnh được chèn vào đúng trang của sổ.', fImg('bb_daunam', 'Đầu năm học') + fImg('bb_hk1', 'Cuối học kì I') + fImg('bb_cuoinam', 'Cuối năm học'));
  }
  function vTK() {
    const A = clAuto();
    return sec('Sơ kết học kì I', 'Đính kèm ảnh trang tổng kết HK I trong sổ theo dõi và đánh giá học sinh.', fImg('sk_hk1', 'Ảnh trang tổng kết HK I') + fText('sk_hk1', 'Ghi chú sơ kết HK I', { rows: 3, def: '' }))
      + sec('Tổng kết năm học', 'Đính kèm ảnh trang tổng kết HK II và năm học.', fImg('tk_nam', 'Ảnh trang tổng kết HK II và năm học') + fText('tk_nam', 'Ghi chú tổng kết năm học', { rows: 3, def: '' }))
      + sec('Tổng kết cả năm — A. Số lượng', '', fLine('tk_dau', '1. Số lượng học sinh đầu năm học', { d: String(L().length) }) + fLine('tk_hk1', 'Số học sinh cuối học kì I') + fLine('tk_hk1_tang', '… tăng') + fLine('tk_hk1_giam', '… giảm')
        + fLine('tk_cn', 'Số học sinh cuối năm học') + fLine('tk_cn_tang', '… tăng') + fLine('tk_cn_giam', '… giảm') + fText('tk_lydo', '2. Lý do tăng, giảm', { rows: 2, def: '' })
        + fLine('tk_bh_ht', '3. Lý do bỏ học — Kết quả học tập Chưa đạt') + fLine('tk_bh_bt', '… Bệnh tật') + fLine('tk_bh_hc', '… Hoàn cảnh khó khăn') + fLine('tk_bh_khac', '… Các lý do khác'))
      + sec('B. Các giải pháp giáo dục của GVCN và những chuyển biến của lớp', '', fText('tk_giaiphap', 'Giải pháp và chuyển biến', { rows: 6, def: '' }))
      + sec('C. Chất lượng hai mặt giáo dục', 'Tự tính từ xếp loại rèn luyện và kết quả học tập cuối HK I, cuối HK II.',
        fGrid('c2m', [[3, 'Tốt'], [4, 'Khá'], [5, 'Đạt'], [6, 'Chưa đạt']], [[1, 'RL HKI SL'], [2, 'RL HKI %'], [3, 'RL HKII SL'], [4, 'RL HKII %'], [7, 'HT HKI SL'], [8, 'HT HKI %'], [9, 'HT HKII SL'], [10, 'HT HKII %']], { auto: A })
        + fGrid('t35', [[0, 'Dòng 1'], [1, 'Dòng 2'], [2, 'Dòng 3']], [[0, 'Chậm tiến (đầu năm / cuối HKI / cuối HKII)'], [1, 'HSG quận / TP / đạt giải']], { l: 'Số học sinh chậm tiến · học sinh giỏi', w: [0, 1] }))
      + sec('D. Các thành tích khác', '', fLine('xl_lop_hk1', '1. Xếp loại lớp — cuối HK I') + fLine('xl_lop_hk2', '… cuối HK II') + fLine('xl_cd_hk1', '2. Xếp loại chi đoàn — cuối HK I') + fLine('xl_cd_hk2', '… cuối HK II') + fText('thanhtich', '3. Các thành tích đặc biệt khác', { rows: 3, def: '' }))
      + sec('Dàn ý sáng kiến kinh nghiệm công tác chủ nhiệm', '', fText('skkn_1', 'I. Cơ sở thực tiễn và lý luận', { def: '' }) + fText('skkn_2', 'II. Những biện pháp tiến hành', { def: '' }) + fText('skkn_3', 'III. Kết quả thực hiện', { def: '' }) + fText('skkn_4', 'IV. Bài học kinh nghiệm rút ra', { def: '' }));
  }

  /* ── hồ sơ học sinh ── */
  const HSC = [['gt', 'Giới tính', 's'], ['dv', 'Đoàn viên (x)', 's'], ['dc', 'Địa chỉ', 'l'], ['dt', 'Điện thoại'], ['dien', 'Diện gia đình'], ['lb', 'Lưu ban (x)', 's'], ['tt', 'Trái tuyến (x)', 's'],
    ['cn', 'Đặc điểm cá nhân', 'l'], ['gd', 'Đặc điểm gia đình', 'l'], ['db', 'Cần quan tâm (x)', 's'], ['bh', 'Biểu hiện / hoàn cảnh', 'l'], ['bp', 'Biện pháp giáo dục', 'l'],
    ['rl0', 'KQRL năm trước'], ['ht0', 'KQHT năm trước'], ['kt0', 'Khen thưởng năm trước'], ['gc', 'Ghi chú']];
  function vHoSo() {
    return `<div class="htnote">Hồ sơ dùng cho Sổ công tác chủ nhiệm (danh sách theo tổ, cán bộ lớp, tình hình lớp, kết quả năm trước, học sinh đặc biệt). <b>Thông tin cá nhân chỉ GVCN xem được.</b> Có thể nhập nhanh từ Excel (dòng tiêu đề có cột "Họ và tên" hoặc "Mã HS").</div>
      <div class="htbar"><button class="hb" id="hsImp">${IC.up} Nhập từ Excel</button><button class="hb" id="hsExp">${IC.down} Tải Excel</button><span class="sp"></span><button class="hb p" id="hsSave">${IC.save} Lưu hồ sơ</button></div>
      <div class="hsgrid tablewrap"><table><thead><tr><th>TT</th><th class="name">Họ và tên</th>${HSC.map(c => `<th>${esc(c[1])}</th>`).join('')}</tr></thead><tbody>
      ${L().map((s, i) => { const h = hoso(s.ma); return `<tr data-ma="${esc(s.ma)}"><td>${i + 1}</td><td class="name">${esc(s.ten)}</td>${HSC.map(([k, , t]) => `<td><input data-h="${k}" value="${esc(h[k] || '')}"${t ? ` class="${t}"` : ''}></td>`).join('')}</tr>`; }).join('')}
      </tbody></table></div>`;
  }
  function bindHoSo(box) {
    const dirty = new Set();
    box.querySelectorAll('[data-h]').forEach(i => i.addEventListener('input', () => { dirty.add(i.closest('tr').dataset.ma); }));
    box.querySelector('#hsSave').onclick = () => {
      const rows = Array.from(dirty).map(ma => { const tr = box.querySelector(`tr[data-ma="${CSS.escape(ma)}"]`), o = { ma, ten: (stu(ma) || {}).ten || '' }; tr.querySelectorAll('[data-h]').forEach(i => { o[i.dataset.h] = i.value.trim(); }); return o; });
      if (!rows.length) { toast('Chưa có thay đổi.'); return; }
      saveHoSo(rows); dirty.clear(); toast('Đã lưu hồ sơ ' + rows.length + ' học sinh.');
    };
    box.querySelector('#hsExp').onclick = () => (window.DL ? DL.load('xlsx') : Promise.resolve()).then(() => {
      const X = window.XLSX, rows = [['STT', 'Mã HS', 'Họ và tên'].concat(HSC.map(c => c[1]))];
      L().forEach((s, i) => { const h = hoso(s.ma); rows.push([i + 1, s.ma, s.ten].concat(HSC.map(c => h[c[0]] || ''))); });
      const wb = X.utils.book_new(); X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet(rows), 'Ho so hoc sinh'); X.writeFile(wb, 'Ho_so_hoc_sinh_' + (S.cfg.lop || '') + '.xlsx');
    }).catch(err);
    box.querySelector('#hsImp').onclick = () => {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.xlsx,.xls,.csv';
      inp.onchange = async () => { try {
        await (window.DL ? DL.load('xlsx') : null); const X = window.XLSX, wb = X.read(await inp.files[0].arrayBuffer(), { type: 'array' });
        const rows = X.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, raw: false, defval: '' });
        const hr = rows.findIndex(r => r.some(c => /^(ho va ten|ho ten|ma hs)$/.test(bo(c).trim()))); if (hr < 0) { toast('Không thấy dòng tiêu đề có cột "Họ và tên".'); return; }
        const head = rows[hr].map(c => bo(c).trim());
        const iMa = head.findIndex(c => /^ma hs|^ma hoc sinh/.test(c)), iTen = head.findIndex(c => /^(ho va ten|ho ten)$/.test(c));
        const map = HSC.map(([k, l]) => [k, head.findIndex(c => c && (c === bo(l).trim() || c.indexOf(bo(l).replace(/\s*\(x\)/, '').trim()) === 0 || bo(l).replace(/\s*\(x\)/, '').trim().indexOf(c) === 0))]).filter(x => x[1] >= 0);
        const out = []; let miss = 0;
        rows.slice(hr + 1).forEach(r => { if (!r.some(c => String(c).trim())) return;
          let s = iMa >= 0 ? L().find(x => x.ma.toLowerCase() === String(r[iMa]).trim().toLowerCase()) : null;
          if (!s && iTen >= 0) { const c = L().filter(x => bo(x.ten).trim() === bo(r[iTen]).trim()); if (c.length === 1) s = c[0]; }
          if (!s) { miss++; return; }
          const o = { ma: s.ma, ten: s.ten }; map.forEach(([k, i]) => { if (String(r[i]).trim()) o[k] = String(r[i]).trim(); }); out.push(o); });
        if (!out.length) { toast('Không khớp được học sinh nào với danh sách lớp.'); return; }
        if (!confirm('Cập nhật hồ sơ ' + out.length + ' học sinh (' + map.length + ' cột)' + (miss ? ', bỏ qua ' + miss + ' dòng không khớp tên' : '') + '?')) return;
        saveHoSo(out); SCN.render(); toast('Đã nhập hồ sơ ' + out.length + ' học sinh.');
      } catch (e) { err(e); } };
      inp.click();
    };
  }
  function saveHoSo(rows) {
    const H = HT.d.hoso = HT.d.hoso || [];
    rows.forEach(o => { const h = H.find(x => x.ma === o.ma); if (h) Object.assign(h, o); else H.push(Object.assign({}, o)); });
    for (let i = 0; i < rows.length; i += 60) HT.queue('htSaveHoSo', { rows: rows.slice(i, i + 60) });
  }

  /* ───────── xuất Word · gửi Ban giám hiệu ───────── */
  async function taoWord() {
    flush();
    if (window.DL) DL.busy(true, 'Đang tạo Sổ công tác chủ nhiệm…', 0.1);
    try {
      const data = SCN.data();
      const keys = IMGS.map(x => x[0]); let n = 0, tong = keys.reduce((a, k) => a + imgList(k).length, 0);
      for (const k of keys) {
        data.img[k] = [];
        for (const it of imgList(k)) { const d = await imgData(it); data.img[k].push({ data: d.data, mime: d.mime, w: it.w, h: it.h }); n++; if (window.DL) DL.busy(true, 'Đang lấy ảnh ' + n + '/' + tong + '…', 0.1 + 0.5 * n / Math.max(1, tong)); }
      }
      if (window.DL) DL.busy(true, 'Đang điền dữ liệu vào mẫu sổ…', 0.7);
      const buf = await (await fetch('templates/so-chu-nhiem.docx?v=5.0')).arrayBuffer();
      const blob = await DOCXFILL.fill(buf, data);
      SCN.lastData = data;
      return blob;
    } finally { if (window.DL) DL.busy(false); }
  }
  SCN.taoWord = taoWord;
  const tenFile = () => 'So_cong_tac_chu_nhiem_' + (S.cfg.lop || '') + '_' + String(S.cfg.namHoc || '').replace(/\s/g, '') + '.docx';
  async function xuatWord() { try { const b = await taoWord(); if (window.DL) DL.save(b, tenFile()); else { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = tenFile(); a.click(); } } catch (e) { err(e); } }
  function b64(blob) { return new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(',')[1]); r.onerror = no; r.readAsDataURL(blob); }); }
  function tomTat() {
    const ds = L(), m = new Date().getMonth() + 1, mm = THANG.indexOf(m) >= 0 && coDL(m) ? m : THANG.filter(coDL).slice(-1)[0];
    const d = mm ? thangData(mm) : null;
    let t = `Sĩ số lớp: ${ds.length} học sinh.`;
    if (d) t += `\nKết quả rèn luyện tháng ${mm}: ` + LV.map((l, i) => l + ' ' + d['x' + (2 * i + 1)] + ' (' + d['x' + (2 * i + 2)] + ')').join('; ') + '.';
    const ky = HT.KY.slice().reverse().find(([k]) => ds.some(s => HT.ketQua(s.ma, k).muc != null));
    if (ky) { const c = [0, 0, 0, 0]; ds.forEach(s => { const x = HT.ketQua(s.ma, ky[0]).muc; if (x != null) c[x]++; }); t += `\nKết quả học tập ${ky[1][0].toLowerCase() + ky[1].slice(1)}: ` + LV.map((l, i) => l + ' ' + c[i]).join('; ') + '.'; }
    if (mm && get('t' + mm + '.xtd')) t += `\nXếp thi đua tháng ${mm}: ${get('t' + mm + '.xtd')}.`;
    return t;
  }
  function guiBGH() {
    const o = HT.ov('Gửi Ban giám hiệu', `<label>Gửi tới</label><input type="text" id="bgTo" value="${esc(get('cfg.bgh_email'))}" placeholder="email Ban giám hiệu, cách nhau dấu phẩy">
      <label style="display:block;margin-top:8px">Tiêu đề</label><input type="text" id="bgSub" value="Lớp ${esc(S.cfg.lop || '')} — Báo cáo công tác chủ nhiệm, kết quả thi đua">
      <label style="display:block;margin-top:8px">Nội dung</label><textarea id="bgBody" rows="9">Kính gửi Ban giám hiệu,\n\nGiáo viên chủ nhiệm lớp ${esc(S.cfg.lop || '')} xin báo cáo tình hình công tác chủ nhiệm và kết quả thi đua của lớp như sau:\n${esc(tomTat())}\n\nChi tiết xin xem Sổ công tác chủ nhiệm đính kèm.\n\nTrân trọng,\n${esc(get('cfg.gvcn', S.cfg.gvcn || S.me.name))}</textarea>
      <label class="ck"><input type="checkbox" id="bgAtt" checked> <span>Đính kèm Sổ công tác chủ nhiệm (file Word)</span></label><p class="mut">Một bản thư được gửi kèm tới email của thầy/cô (CC).</p>`,
      `<button class="hb" data-x>Huỷ</button><button class="hb p" data-ok>${IC.mail} Gửi</button>`);
    o.$('[data-x]').onclick = o.close;
    o.$('[data-ok]').onclick = async () => {
      const to = o.$('#bgTo').value.trim(); if (!/@/.test(to)) { toast('Nhập email Ban giám hiệu.'); return; }
      if (to !== get('cfg.bgh_email')) put('cfg.bgh_email', to);
      const b = o.$('[data-ok]'); b.disabled = true; b.textContent = 'Đang chuẩn bị…';
      try {
        const files = [];
        if (o.$('#bgAtt').checked) { const blob = await taoWord(); files.push({ name: tenFile(), mime: blob.type, data: await b64(blob) }); }
        b.textContent = 'Đang gửi…';
        const j = await rawApi('htMailBGH', { to, subject: o.$('#bgSub').value, html: esc(o.$('#bgBody').value).replace(/\n/g, '<br>'), files }, 180000);
        o.close(); toast('Đã gửi tới ' + (j.to || []).join(', ') + '.');
      } catch (e) { b.disabled = false; b.textContent = 'Gửi'; err(e); }
    };
  }
  SCN.guiBGH = guiBGH;
})();
