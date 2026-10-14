/* ══ v5.0 — KẾT QUẢ HỌC TẬP (menu "Kết quả học tập", #vHT) ══
   Backend: htBoot · htSaveDiem · htSaveMon · htSaveRule · htMailPH (HocTap.gs, kho yenhoa-backend).
   · Bảng điểm theo môn × học kì: ĐĐGtx (TX1…), giữa kì (GK), cuối kì (CK), đầu điểm mới bất kì; sửa / xoá từng ô, thêm / xoá cột.
   · Nhập từ Excel: một hay nhiều trang tính (tên trang = tên / mã môn), nhận cột mới ⇒ lưu thành đầu điểm mới; "thay hàng loạt" hoặc "chỉ cập nhật ô có giá trị".
   · Tổng kết: ĐTB môn học kì / cả năm, mức kết quả học tập (Thông tư 22/2021: Tốt · Khá · Đạt · Chưa đạt), danh hiệu cả năm.
   · Môn học, cách tính điểm (tham số sửa được). v6.4: bỏ vai giáo viên bộ môn — chỉ GVCN và cán bộ lớp cập nhật điểm.
   · Gửi phiếu báo kết quả học tập + rèn luyện tới cha mẹ học sinh.
   Ghi: cập nhật màn hình ngay, hàng đợi HTQ (localStorage hk_htq_v1) gửi nền, lỗi mạng tự thử lại. Dữ liệu đệm: hk_ht_v1. */
(function () {
  'use strict';
  const ROLE_GV = 'Giáo viên bộ môn';
  const HT = window.HT = { d: null, loading: null, tab: 'diem', hk: 1, mon: '', ky: 'hk1', edit: null };
  const isGV = () => false;   // v6.4: bỏ vai giáo viên bộ môn — chỉ GVCN và cán bộ lớp cập nhật điểm
  const isCB = () => S.me && S.me.role === 'Cán bộ lớp';   /* ★ v6.3: cán bộ lớp nhập điểm kiểm tra giữa / cuối kì, kỳ thi */
  const canHT = () => S.me && (isGVCN() || isGV() || isCB());
  HT.isCB = isCB; HT.canHT = canHT;
  const LV = ['Tốt', 'Khá', 'Đạt', 'Chưa đạt'];
  const LVC = ['r0', 'r1', 'r2', 'r3'];
  const bo = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/\s+/g, ' ').trim();
  const r1 = (x, n) => { const k = Math.pow(10, n == null ? 1 : n); return Math.round((x + 1e-9) * k) / k; };
  const f1 = x => x == null || isNaN(x) ? '' : String(r1(x, (HT.d && HT.d.rule.lamTron) != null ? HT.d.rule.lamTron : 1)).replace('.', ',');
  const ls = { get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (_) { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} } };

  /* ───────────────────────── dữ liệu ───────────────────────── */
  function idx() {
    const D = HT.d; D.ix = {};
    D.diem.forEach(r => { D.ix[r[0] + '|' + r[1] + '|' + r[2] + '|' + r[3]] = r; });
  }
  function apply(j) {
    HT.d = { mon: j.mon || [], gv: j.gv || [], rule: j.rule || {}, diem: j.diem || [], hoso: j.hoso || null, scn: j.scn || null, myMon: j.myMon || null, quota: j.mailQuota, kyThi: j.kyThi || [], ts: Date.now() };
    idx(); htqOverlay();
    if (!isGV()) ls.set('hk_ht_v1', { mon: HT.d.mon, gv: HT.d.gv, rule: HT.d.rule, diem: HT.d.diem, hoso: HT.d.hoso, scn: HT.d.scn, kyThi: HT.d.kyThi, me: S.me && S.me.email });
  }
  HT.load = async function (force) {
    if (!canHT()) return null;
    if (HT.d && !force) return HT.d;
    if (!HT.d && !force) { const c = ls.get('hk_ht_v1'); if (c && S.me && c.me === S.me.email) { apply(c); setTimeout(() => HT.load(true).then(() => HT.render()).catch(() => {}), 300); return HT.d; } }
    if (HT.loading) return HT.loading;
    HT.loading = rawApi('htBoot', {}, 60000).then(j => { apply(j); return HT.d; }).finally(() => { HT.loading = null; });
    return HT.loading;
  };
  HT.monList = function (all) {
    const D = HT.d; if (!D) return [];
    let m = D.mon.filter(x => all || x.on);
    if (isGV()) m = m.filter(x => (D.myMon || []).indexOf(x.ma) >= 0);
    return m;
  };
  HT.monOf = ma => (HT.d.mon.find(m => m.ma === ma) || null);
  HT.val = (ma, mon, hk, dd) => { const r = HT.d.ix[ma + '|' + mon + '|' + hk + '|' + dd]; return r ? r[4] : ''; };
  const ddKind = dd => /^TX\d*$/.test(dd) ? 'tx' : dd === 'GK' ? 'gk' : dd === 'CK' ? 'ck' : dd === 'HK' ? 'hk' : dd === 'NXGV' ? 'nx' : 'khac';
  HT.ddKind = ddKind;
  /** Danh sách đầu điểm của môn/học kì: TX1…TXn (theo số ĐĐGtx hoặc nhiều hơn nếu đã có), GK, CK, các đầu điểm mới. */
  /* ★ v6.3: KHÔNG nhập ĐĐGtx nữa (điểm thường xuyên đã có ở phần mềm quản lý điểm của trường) — bảng điểm chỉ Giữa kì, Cuối kì
     (+ "TB môn" = đầu điểm HK, giáo viên dán từ phần mềm kia nếu cần xếp mức học tập). Kỳ thi khác: đầu điểm KT#<mã> (kythi.js). */
  HT.dds = function (mon, hk) { return isCB() ? ['GK', 'CK'] : ['GK', 'CK', 'HK']; };
  HT.ddsCu = function (mon, hk) {
    const m = HT.monOf(mon) || { tx: 3 };
    const have = new Set(HT.d.diem.filter(r => r[1] === mon && r[2] === hk).map(r => r[3]));
    const extra = (ls.get('hk_ht_cols') || {})[mon + '|' + hk] || [];
    extra.forEach(x => have.add(x));
    let ntx = m.tx || 0; have.forEach(d => { const k = d.match(/^TX(\d+)$/); if (k) ntx = Math.max(ntx, +k[1]); });
    const out = []; for (let i = 1; i <= ntx; i++) out.push('TX' + i);
    out.push('GK', 'CK');
    Array.from(have).filter(d => ddKind(d) === 'khac').sort().forEach(d => out.push(d));
    return out;
  };
  const num = v => { const s = String(v == null ? '' : v).trim().replace(',', '.'); if (s === '' || isNaN(+s)) return null; return +s; };
  const isD = v => /^(đ|d|đạt|dat)$/i.test(String(v).trim());
  const isCD = v => /^(cđ|cd|chưa đạt|chua dat|kđ|kd|không đạt|khong dat)$/i.test(String(v).trim());

  /** Điểm trung bình môn học kì (môn điểm số) hoặc kết quả Đ / CĐ (môn nhận xét). null = chưa đủ đầu điểm. */
  HT.tbHK = function (ma, mon, hk) {
    const m = HT.monOf(mon); if (!m) return null; const R = HT.d.rule;
    const vals = HT.ddsCu(mon, hk).map(dd => [dd, HT.val(ma, mon, hk, dd)]).filter(x => x[1] !== '');
    const ov = HT.val(ma, mon, hk, 'HK');
    if (m.ht === 'nx') {
      if (ov) return isD(ov) ? 'Đ' : isCD(ov) ? 'CĐ' : null;
      const ck = HT.val(ma, mon, hk, 'CK'); if (!ck) return null;
      const all = vals.filter(x => ['tx', 'gk', 'ck'].indexOf(ddKind(x[0])) >= 0).map(x => x[1]);
      const d = all.filter(isD).length;
      return isD(ck) && all.length && d / all.length >= (+R.nxTiLeDat || 0.6667) - 1e-9 ? 'Đ' : 'CĐ';
    }
    if (ov && num(ov) != null) return num(ov);
    let s = 0, w = 0, gk = null, ck = null;
    vals.forEach(([dd, v]) => { const n = num(v); if (n == null) return; const k = ddKind(dd);
      if (k === 'tx') { s += n * (+R.heSoTX || 1); w += (+R.heSoTX || 1); } else if (k === 'gk') gk = n; else if (k === 'ck') ck = n; });
    if (gk == null || ck == null || !w) return null;
    s += gk * (+R.heSoGK || 2) + ck * (+R.heSoCK || 3); w += (+R.heSoGK || 2) + (+R.heSoCK || 3);
    return r1(s / w, R.lamTron != null ? +R.lamTron : 1);
  };
  /** Kết quả giữa kì (tham khảo): điểm GK. */
  HT.tbGK = function (ma, mon, hk) { const m = HT.monOf(mon); const v = HT.val(ma, mon, hk, 'GK'); if (!m || v === '') return null; return m.ht === 'nx' ? (isD(v) ? 'Đ' : 'CĐ') : num(v); };
  HT.tbCN = function (ma, mon) {
    const m = HT.monOf(mon); if (!m) return null;
    const a = HT.tbHK(ma, mon, 1), b = HT.tbHK(ma, mon, 2);
    if (m.ht === 'nx') return b;
    if (a == null || b == null) return null;
    const k = +HT.d.rule.heSoHK2 || 2;
    return r1((a + k * b) / (1 + k), HT.d.rule.lamTron != null ? +HT.d.rule.lamTron : 1);
  };
  /** kỳ: 'gk1' | 'hk1' | 'gk2' | 'hk2' | 'cn' ⇒ {mon:{ma:giá trị}, muc:0..3 | null, thieu:[môn chưa đủ]} */
  HT.ketQua = function (ma, ky) {
    const R = HT.d.rule, ms = HT.monList();
    const f = ky === 'cn' ? m => HT.tbCN(ma, m.ma) : ky[0] === 'g' ? m => HT.tbGK(ma, m.ma, +ky[2]) : m => HT.tbHK(ma, m.ma, +ky[2]);
    const out = { mon: {}, muc: null, thieu: [] };
    const ds = [], nx = [];
    ms.forEach(m => { const v = f(m); out.mon[m.ma] = v; if (v == null) { out.thieu.push(m.ten); return; } (m.ht === 'nx' ? nx : ds).push(v); });
    if (!ds.length && !nx.length) return out;
    if (out.thieu.length > ms.length / 2) return out;
    const nD = ds.length, cd = nx.filter(v => v === 'CĐ').length;
    const cnt = t => ds.filter(v => v >= t - 1e-9).length;
    const need = n => Math.min(+n, nD);
    if (!cd && ds.every(v => v >= +R.totDiemMoi - 1e-9) && cnt(+R.totDiemCao) >= need(R.totSoMon)) out.muc = 0;
    else if (!cd && ds.every(v => v >= +R.khaDiemMoi - 1e-9) && cnt(+R.khaDiemCao) >= need(R.khaSoMon)) out.muc = 1;
    else if (cd <= +R.datToiDaCD && cnt(+R.datDiem) >= need(R.datSoMon) && ds.every(v => v >= +R.datSan - 1e-9)) out.muc = 2;
    else out.muc = 3;
    if (out.thieu.length) out.tam = true;
    return out;
  };
  /** Kết quả rèn luyện theo kỳ (từ xếp loại tháng của sổ): chỉ số 0..3 hoặc null. */
  HT.renLuyen = function (ma, ky) {
    const HK1 = [9, 10, 11, 12, 1], HK2 = [2, 3, 4, 5];
    const ms = ky === 'cn' ? HK1.concat(HK2) : (ky.slice(-1) === '1' ? HK1 : HK2);
    if (!S.entries.some(e => ms.indexOf(e[E_THANG]) >= 0)) return null;
    try { const x = xlOf(ma, ms); return Math.min(3, x.i); } catch (_) { return null; }
  };
  HT.danhHieu = function (ma) {
    const kq = HT.ketQua(ma, 'cn'), rl = HT.renLuyen(ma, 'cn'), R = HT.d.rule;
    if (kq.muc !== 0 || rl !== 0) return '';
    const n = HT.monList().filter(m => m.ht !== 'nx').filter(m => { const v = HT.tbCN(ma, m.ma); return v != null && v >= +R.xsDiem - 1e-9; }).length;
    return n >= +R.xsSoMon ? 'Học sinh Xuất sắc' : 'Học sinh Giỏi';
  };
  HT.LV = LV;

  /* ───────────────────────── hàng đợi ghi ───────────────────────── */
  const HTQ = { list: ls.get('hk_htq_v1') || [], run: false, t: null };
  const htqSave = () => ls.set('hk_htq_v1', HTQ.list);
  function htqAdd(a, p) { p.rid = p.rid || ('h' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)); HTQ.list.push({ a, p, n: 0 }); htqSave(); htqChip(); htqKick(0); }
  function htqKick(ms) { clearTimeout(HTQ.t); HTQ.t = setTimeout(htqStep, ms || 0); }
  async function htqStep() {
    if (HTQ.run || !HTQ.list.length) { htqChip(); return; }
    HTQ.run = true; const op = HTQ.list[0];
    try {
      const j = await rawApi(op.a, op.p, 60000);
      HTQ.list.shift(); htqSave();
      if (op.a === 'htSaveMon' && j.mon) HT.d.mon = j.mon;
      if (op.a === 'htSaveGV' && j.gv) HT.d.gv = j.gv;
      if (op.a === 'htSaveRule' && j.rule) HT.d.rule = j.rule;
      HTQ.run = false; htqChip(); htqKick(50);
    } catch (e) {
      HTQ.run = false;
      if (e.net) { op.n++; htqSave(); htqChip(); htqKick(Math.min(60, [2, 4, 8, 15, 30, 60][Math.min(5, op.n)]) * 1000); return; }
      HTQ.list.shift(); htqSave(); htqChip(); err(e); HT.load(true).then(() => HT.render()).catch(() => {});
    }
  }
  /** Dữ liệu mới từ máy chủ ⇒ áp lại các ô còn đang chờ gửi. */
  function htqOverlay() {
    if (!HT.d) return;
    HTQ.list.forEach(op => { if (op.a === 'htSaveDiem') localDiem(op.p.items, op.p.replace, true); });
  }
  function htqChip() {
    let c = document.getElementById('htq'); const n = HTQ.list.length;
    if (!n) { if (c) c.remove(); return; }
    if (!c) { c = document.createElement('div'); c.id = 'htq'; document.body.appendChild(c); }
    c.textContent = 'Đang lưu ' + n + ' thay đổi điểm…';
  }
  function localDiem(items, replace, quiet) {
    const D = HT.d;
    if (replace && replace.mon) {
      const dds = (replace.dds || []);
      D.diem = D.diem.filter(r => !(r[1] === replace.mon && r[2] === +replace.hk && (!dds.length || dds.indexOf(r[3]) >= 0)));
    }
    idx();
    (items || []).forEach(it => {
      const k = it.ma + '|' + it.mon + '|' + it.hk + '|' + it.dd, r = D.ix[k];
      if (it.v === '') { if (r) { D.diem.splice(D.diem.indexOf(r), 1); delete D.ix[k]; } return; }
      if (r) { r[4] = it.v; r[5] = S.me.name; } else { const n = [it.ma, it.mon, +it.hk, it.dd, it.v, S.me.name, '']; D.diem.push(n); D.ix[k] = n; }
    });
    if (!quiet) ls.set('hk_ht_v1', Object.assign(ls.get('hk_ht_v1') || {}, { diem: D.diem }));
  }
  HT.saveDiem = function (items, replace) {
    if (!items.length && !replace) return;
    localDiem(items, replace);
    for (let i = 0; i < Math.max(1, items.length); i += 400) htqAdd('htSaveDiem', { items: items.slice(i, i + 400), replace: i === 0 ? replace : undefined });
  };
  HT.queue = htqAdd;

  /* ───────────────────────── giao diện ───────────────────────── */
  const css = document.createElement('style'); css.id = 'ht-css';
  css.textContent = `
#main,#main>.scroll{min-width:0}
#vHT .httabs,#vSCN .httabs{display:flex;gap:6px;padding:0 12px 12px;overflow-x:auto;scrollbar-width:none}
#vHT .httabs button,#vSCN .httabs button{flex:0 0 auto;height:36px;padding:0 14px;border-radius:10px;background:var(--card);border:1.5px solid var(--line);font-size:13.5px;font-weight:700;color:var(--sub)}
#vHT .httabs button.on,#vSCN .httabs button.on{background:var(--teal);border-color:var(--teal);color:#fff}
.htbar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:0 12px 12px}
.htbar select,.htbar .sel{height:38px;border:1.5px solid var(--line);border-radius:10px;padding:0 10px;background:var(--card);font:inherit;font-size:14px;color:var(--ink);max-width:100%}
.htbar .sp{flex:1}
.hb{height:38px;padding:0 13px;border-radius:10px;border:1.5px solid var(--line);background:var(--card);color:var(--teal-d);font-weight:700;font-size:13.5px;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.hb:hover{background:var(--pale);border-color:var(--teal-l)} .hb.p{background:var(--teal);border-color:var(--teal);color:#fff} .hb.p:hover{background:var(--teal-d)} .hb.d{color:var(--dang)}
.hb svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.htnote{margin:0 12px 12px;padding:10px 13px;border-radius:12px;background:var(--pale);color:var(--teal-d);font-size:13px;line-height:1.55}
.htnote b{color:var(--ink)}
.htg{margin:0 12px 14px}
.htg table td,.htg table th{padding:7px 9px}
.htg td.c{cursor:cell;min-width:52px;font-variant-numeric:tabular-nums;font-weight:700}
.htg td.c:hover{outline:2px solid var(--teal-xl);outline-offset:-2px}
.htg td.c.e{padding:0} .htg td.c.e input,.htg td.c.e select{width:64px;height:34px;border:2px solid var(--teal);border-radius:6px;text-align:center;font:inherit;font-weight:700}
.htg td.tb{font-weight:800;color:var(--teal-d);background:var(--paler)}
.htg td.lo{color:var(--dang)} .htg th.dd{cursor:pointer} .htg th.dd:hover{background:var(--teal-xl)} .htg th.new{color:var(--warn)}
.htg td.nxgv{min-width:200px;max-width:360px;white-space:normal;text-align:left;font-weight:500;font-size:12.5px;cursor:text}
.htg .muc{display:inline-block;border-radius:99px;padding:2px 9px;font-size:12px;font-weight:800}
.muc.r0{background:var(--ok-bg);color:var(--ok)} .muc.r1{background:var(--info-bg);color:var(--info)} .muc.r2{background:var(--warn-bg);color:var(--warn)} .muc.r3{background:var(--dang-bg);color:var(--dang)}
.htform{margin:0 12px 14px;background:var(--card);border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden}
.htform .row{display:grid;grid-template-columns:minmax(0,1fr) 120px;gap:10px;align-items:center;padding:10px 14px;border-bottom:1px solid var(--line2)}
.htform .row:last-child{border-bottom:0} .htform .row label{font-size:13.5px;color:var(--ink);line-height:1.45} .htform .row small{display:block;color:var(--mute);font-size:11.5px}
.htform input,.htform select{height:38px;border:1.5px solid var(--line);border-radius:9px;padding:0 9px;font:inherit;font-size:14px;width:100%;background:#fff}
.htlist{margin:0 12px 14px}
.htlist table input,.htlist table select{height:34px;border:1.5px solid var(--line);border-radius:8px;padding:0 8px;font:inherit;font-size:13.5px;width:100%;min-width:70px;background:#fff}
.htlist table td{padding:5px 6px} .htlist .x{border:0;background:none;color:var(--dang);font-size:18px;cursor:pointer}
#htq{position:fixed;left:50%;bottom:calc(84px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:900;background:#1B333A;color:#fff;font-size:12.5px;font-weight:700;padding:7px 14px;border-radius:99px;box-shadow:var(--sh-2)}
#htov{position:fixed;inset:0;z-index:9500;background:rgba(15,30,35,.45);display:flex;align-items:center;justify-content:center;padding:14px}
#htov .bx{background:#fff;border-radius:18px;width:min(760px,100%);max-height:calc(100vh - 28px);display:flex;flex-direction:column;box-shadow:0 24px 60px rgba(0,0,0,.3)}
#htov .hd{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid var(--line2)} #htov .hd h3{margin:0;font-size:17px;color:var(--teal-d);flex:1}
#htov .hd .x{border:0;background:var(--paler);border-radius:10px;width:34px;height:34px;font-size:18px;cursor:pointer}
#htov .bd{padding:14px 18px;overflow:auto;font-size:14px;line-height:1.55} #htov .ft{display:flex;gap:8px;justify-content:flex-end;padding:12px 18px;border-top:1px solid var(--line2);flex-wrap:wrap}
#htov .bd table{font-size:12.5px} #htov .bd textarea,#htov .bd input[type=text],#htov .bd select{width:100%;border:1.5px solid var(--line);border-radius:10px;padding:8px 10px;font:inherit;font-size:14px}
#htov .bd label.ck{display:flex;gap:8px;align-items:flex-start;margin:6px 0} #htov .bd .mut{color:var(--mute);font-size:12.5px}
@media (min-width:761px){ #vHT .httabs,#vSCN .httabs,.htbar{padding-left:26px;padding-right:26px} .htnote,.htg,.htform,.htlist{margin-left:26px;margin-right:26px} }
@media (max-width:760px){ .htbar .hb .lg{display:none} }`;
  document.head.appendChild(css);
  const SV = p => `<svg viewBox="0 0 24 24">${p}</svg>`;
  const IC = {
    up: SV('<path d="M12 16V4m0 0-4 4m4-4 4 4M4 20h16"/>'), down: SV('<path d="M12 4v12m0 0-4-4m4 4 4-4M4 20h16"/>'),
    plus: SV('<path d="M12 5v14M5 12h14"/>'), mail: SV('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    save: SV('<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h8M8 21v-7h8v7"/>')
  };
  HT.IC = IC;
  ICON.ht = '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M8 7h8M8 11h5"/>';

  function ov(title, body, foot, opt) {
    let o = document.getElementById('htov'); if (o) o.remove();
    o = document.createElement('div'); o.id = 'htov';
    o.innerHTML = `<div class="bx" role="dialog" aria-label="${esc(title)}"><div class="hd"><h3>${esc(title)}</h3><button class="x" aria-label="Đóng">×</button></div><div class="bd">${body}</div>${foot ? `<div class="ft">${foot}</div>` : ''}</div>`;
    if (opt && opt.w) o.querySelector('.bx').style.width = 'min(' + opt.w + 'px,100%)';
    document.body.appendChild(o);
    const close = () => o.remove();
    o.querySelector('.x').onclick = close; o.onclick = e => { if (e.target === o) close(); };
    return { el: o, close, $: s => o.querySelector(s), $$: s => Array.from(o.querySelectorAll(s)) };
  }
  HT.ov = ov;

  /* menu + màn hình */
  NAV.splice(NAV.findIndex(n => n.v === 'tk'), 0, { v: 'ht', t: 'Kết quả học tập', s: 'Học tập', el: '#vHT' });
  (function () { const b = $('#vBang'); if (b && !$('#vHT')) { const s = document.createElement('section'); s.className = 'view hide'; s.id = 'vHT'; b.after(s); } })();
  const navItemsHT = navItems;
  window.navItems = navItems = function () {
    if (isGV()) return NAV.filter(n => n.v === 'ht');
    return navItemsHT.apply(this, arguments).filter(n => n.v !== 'ht' || canHT());
  };
  const goHT = go;
  window.go = go = async function (v) {
    if (v === 'ht') {
      S.view = v; syncView(); try { exitMulti(); } catch (_) {}
      if (!HT.d) { $('#vHT').innerHTML = '<div class="sechead"><h2>Đang tải kết quả học tập</h2></div>' + skeleton(6);
        try { await HT.load(); } catch (e) { err(e); } }
      if (!S.allLoaded && isGVCN()) loadAllMonths().catch(() => {});
      HT.render(); return;
    }
    return goHT.apply(this, arguments);
  };
  const renderAllHT = renderAll;
  window.renderAll = renderAll = function () { renderAllHT.apply(this, arguments); if (S.view === 'ht') HT.render(); const hb = $('#helpBar'); if (hb && (S.view === 'ht' || S.view === 'scn')) hb.classList.add('hide'); };
  const syncViewHT = syncView;
  window.syncView = syncView = function () { syncViewHT.apply(this, arguments); if (S.view === 'ht' || S.view === 'scn') ['#periodBar', '#helpBar'].forEach(x => { const e = $(x); if (e) e.classList.add('hide'); }); };
  const showAppHT = showApp;
  window.showApp = showApp = function () {
    const r = showAppHT.apply(this, arguments);
    if (isGV()) { buildNav(); if (S.view !== 'ht') go('ht'); }
    if (/#hoctap/.test(location.hash) && canHT()) setTimeout(() => go('ht'), 400);
    if (HTQ.list.length) htqKick(1500);
    return r;
  };
  const autoTourHT = window.autoTour;
  if (typeof autoTourHT === 'function') window.autoTour = function () { if (isGV()) return; return autoTourHT.apply(this, arguments); };

  /* Thông tư 22/2021: mức Tốt · Khá · Đạt · Chưa đạt (thay tên cũ Trung bình / Yếu khi hiển thị) */
  const TT22 = { 'trung bình': 'Đạt', 'trung binh': 'Đạt', 'yếu': 'Chưa đạt', 'yeu': 'Chưa đạt', 'kém': 'Chưa đạt' };
  const tt22 = t => TT22[String(t || '').trim().toLowerCase()] || t;
  function chuanTen() {
    try { (S.cfg && S.cfg.thresholds || []).forEach(t => { t.ten = tt22(t.ten); }); (S.remarks || []).forEach(r => { if (r.xepLoai) r.xepLoai = tt22(r.xepLoai); }); } catch (_) {}
  }
  const abHT = window.applyBase;
  if (typeof abHT === 'function') window.applyBase = function () { const r = abHT.apply(this, arguments); chuanTen(); return r; };
  const raHT2 = renderAll;
  window.renderAll = renderAll = function () { chuanTen(); return raHT2.apply(this, arguments); };

  HT.render = function () {
    const box = $('#vHT'); if (!box || S.view !== 'ht') return;
    if (!HT.d) { box.innerHTML = '<div class="empty"><b>Chưa tải được dữ liệu</b>Kiểm tra mạng rồi bấm lại menu Kết quả học tập.</div>'; return; }
    if (box.contains(document.activeElement) && /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName) && HT.edit == null) return;
    const tabs = isGV() || isCB() ? [['diem', 'Giữa kì · cuối kì'], ['kt', 'Kỳ thi & ôn luyện']] : [['diem', 'Giữa kì · cuối kì'], ['kt', 'Kỳ thi & ôn luyện'], ['tk', 'Tổng kết'], ['mon', 'Môn học'], ['rule', 'Cách tính điểm']];
    if (!tabs.some(t => t[0] === HT.tab)) HT.tab = 'diem';
    let h = `<div class="httabs">${tabs.map(([k, l]) => `<button data-htt="${k}" class="${HT.tab === k ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    if (HT.tab === 'diem') h += viewDiem();
    if (HT.tab === 'kt' && HT.viewKT) h += HT.viewKT();
    if (HT.tab === 'tk') h += viewTK();
    if (HT.tab === 'mon') h += viewMon();
    if (HT.tab === 'rule') h += viewRule();
    box.innerHTML = h;
    box.querySelectorAll('[data-htt]').forEach(b => b.onclick = () => { HT.tab = b.dataset.htt; HT.edit = null; HT.render(); });
    if (HT.tab === 'diem') bindDiem(box);
    if (HT.tab === 'kt' && HT.bindKT) HT.bindKT(box);
    if (HT.tab === 'tk') bindTK(box);
    if (HT.tab === 'mon') bindMon(box);
    if (HT.tab === 'rule') bindRule(box);
  };

  /* ── Bảng điểm ── */
  function viewDiem() {
    const ms = HT.monList();
    if (!ms.length) return `<div class="empty"><b>Chưa có môn học</b>Vào thẻ Môn học để thêm môn.</div>`;
    if (!ms.some(m => m.ma === HT.mon)) HT.mon = ms[0].ma;
    const m = HT.monOf(HT.mon), hk = HT.hk, dds = HT.dds(m.ma, hk), L = activeStudents();
    let h = `<div class="htbar">
      <select id="htMon" aria-label="Môn học">${ms.map(x => `<option value="${esc(x.ma)}"${x.ma === m.ma ? ' selected' : ''}>${esc(x.ten)}</option>`).join('')}</select>
      <select id="htHK" aria-label="Học kì"><option value="1"${hk === 1 ? ' selected' : ''}>Học kì I</option><option value="2"${hk === 2 ? ' selected' : ''}>Học kì II</option></select>
      <span class="sp"></span>
      <button class="hb" id="htImp">${IC.up}<span class="lg">Nhập từ Excel</span></button>
      <button class="hb" id="htExp">${IC.down}<span class="lg">Tải Excel</span></button></div>`;
    h += `<div class="htnote">Nhập điểm bài <b>kiểm tra giữa kì, cuối kì</b>${m.ht === 'nx' ? ' (môn đánh giá bằng nhận xét: <b>Đ</b> / <b>CĐ</b>)' : ''}. Bấm vào ô để nhập (Enter: lưu, xuống dòng) hoặc <b>Nhập từ Excel</b>.
      ${isCB() ? '' : 'Cột <b>TB môn</b> (không bắt buộc) dán từ phần mềm quản lý điểm của trường nếu cần xếp mức học tập.'}${HT.baoTxt ? HT.baoTxt() : ''}</div>`;
    const gvx = !isCB();
    h += `<div class="htg tablewrap"><table><thead><tr><th>TT</th><th class="name">Họ và tên</th>${dds.map(d => `<th data-dd="${esc(d)}">${esc(ddLabel(d))}</th>`).join('')}${gvx && hk === 2 ? `<th>${m.ht === 'nx' ? 'KQ cả năm' : 'TB cả năm'}</th>` : ''}</tr></thead><tbody>`;
    L.forEach((s, i) => {
      const tb = HT.tbHK(s.ma, m.ma, hk), cn = hk === 2 ? HT.tbCN(s.ma, m.ma) : null;
      h += `<tr data-ma="${esc(s.ma)}"><td>${i + 1}</td><td class="name">${esc(s.ten)}</td>`;
      dds.forEach(d => { const v = HT.val(s.ma, m.ma, hk, d); const n = num(v); h += `<td class="c${n != null && n < 5 || isCD(v) ? ' lo' : ''}" data-dd="${esc(d)}">${esc(fmtV(v))}</td>`; });
      if (gvx && hk === 2) h += `<td class="tb">${cn == null ? '' : typeof cn === 'number' ? f1(cn) : cn}</td>`;
      h += '</tr>';
    });
    h += '</tbody></table></div>';
    return h;
  }
  const fmtV = v => { const n = num(v); return n != null ? String(n).replace('.', ',') : isD(v) ? 'Đ' : isCD(v) ? 'CĐ' : v; };
  const ddLabel = d => /^TX(\d+)$/.test(d) ? 'ĐĐGtx ' + d.slice(2) : d === 'GK' ? 'Giữa kì' : d === 'CK' ? 'Cuối kì' : d === 'HK' ? 'TB môn' : /^KT#/.test(d) && HT.ktOf ? (HT.ktOf(d.slice(3)) || {}).ten || d : d;
  HT.ddLabel = ddLabel;
  function normV(v, m) {
    v = String(v == null ? '' : v).trim();
    if (v === '') return '';
    if (m && m.ht === 'nx') { if (isD(v)) return 'Đ'; if (isCD(v)) return 'CĐ'; return null; }
    const n = num(v); if (n == null || n < 0 || n > 10) return null;
    return String(r1(n, 2));
  }
  HT.normV = normV;
  function bindDiem(box) {
    const m = HT.monOf(HT.mon); if (!m) return;
    const sel = box.querySelector('#htMon'); if (sel) sel.onchange = () => { HT.mon = sel.value; HT.render(); };
    const hk = box.querySelector('#htHK'); if (hk) hk.onchange = () => { HT.hk = +hk.value; HT.render(); };
    box.querySelector('#htImp').onclick = () => importExcel();
    box.querySelector('#htExp').onclick = () => exportExcel();
    box.querySelectorAll('td.c').forEach(td => td.onclick = () => editCell(td));
  }
  function editCell(td) {
    if (td.classList.contains('e')) return;
    const m = HT.monOf(HT.mon), tr = td.closest('tr'), ma = tr.dataset.ma, dd = td.dataset.dd, hk = HT.hk;
    const cur = HT.val(ma, m.ma, hk, dd);
    td.classList.add('e'); HT.edit = ma + dd;
    let inp;
    if (dd === 'NXGV') { inp = document.createElement('input'); inp.type = 'text'; inp.style.width = '100%'; inp.style.textAlign = 'left'; inp.value = cur; }
    else if (m.ht === 'nx') { inp = document.createElement('select'); inp.innerHTML = '<option value=""></option><option>Đ</option><option>CĐ</option>'; inp.value = isD(cur) ? 'Đ' : isCD(cur) ? 'CĐ' : ''; }
    else { inp = document.createElement('input'); inp.type = 'text'; inp.inputMode = 'decimal'; inp.value = fmtV(cur); }
    td.textContent = ''; td.appendChild(inp); inp.focus(); if (inp.select) inp.select();
    let done = false;
    const finish = (move) => {
      if (done) return; done = true; HT.edit = null;
      let v = dd === 'NXGV' ? inp.value.trim() : normV(inp.value, m);
      if (v === null) { toast('Giá trị chưa hợp lệ: ' + (m.ht === 'nx' ? 'nhập Đ hoặc CĐ.' : 'nhập điểm từ 0 đến 10.')); v = cur; }
      const nextMa = tr.nextElementSibling && tr.nextElementSibling.dataset ? tr.nextElementSibling.dataset.ma : '';
      if (v !== cur) { HT.saveDiem([{ ma, mon: m.ma, hk, dd, v }]); if (HT.henBao && dd !== 'NXGV' && dd !== 'HK') HT.henBao([{ mon: m.ma, hk, dd }]); }
      HT.render();
      if (move && nextMa) { const next = document.querySelector(`#vHT tr[data-ma="${CSS.escape(nextMa)}"] td.c[data-dd="${CSS.escape(dd)}"]`); if (next) editCell(next); }
    };
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); finish('down'); }
      else if (e.key === 'Escape') { done = true; HT.edit = null; HT.render(); }
      else if (e.key === 'Delete' && dd !== 'NXGV' && inp.tagName === 'INPUT') { inp.value = ''; }
    });
    inp.addEventListener('blur', () => setTimeout(() => finish(), 0));
    if (inp.tagName === 'SELECT') inp.addEventListener('change', () => finish('down'));
  }
  function addCol() {
    const m = HT.monOf(HT.mon), dds = HT.dds(m.ma, HT.hk);
    const ntx = dds.filter(d => /^TX\d+$/.test(d)).length;
    const o = ov('Thêm đầu điểm', `<p>Môn <b>${esc(m.ten)}</b> · học kì ${HT.hk === 1 ? 'I' : 'II'}.</p>
      <label class="ck"><input type="radio" name="k" value="tx" checked> <span>Thêm 1 cột <b>ĐĐGtx ${ntx + 1}</b> (đánh giá thường xuyên, tính vào ĐTB)</span></label>
      <label class="ck"><input type="radio" name="k" value="khac"> <span>Đầu điểm khác (không tính vào ĐTB), ví dụ: Kiểm tra miệng, Dự án nhóm…</span></label>
      <input type="text" id="htNewDD" placeholder="Tên đầu điểm" style="margin-top:6px">`,
      `<button class="hb" data-x>Huỷ</button><button class="hb p" data-ok>Thêm cột</button>`);
    o.$('[data-x]').onclick = o.close;
    o.$('[data-ok]').onclick = () => {
      const k = o.$('input[name=k]:checked').value;
      let name = k === 'tx' ? 'TX' + (ntx + 1) : String(o.$('#htNewDD').value || '').trim().toUpperCase().slice(0, 24);
      if (!name) { toast('Nhập tên đầu điểm.'); return; }
      if (['GK', 'CK', 'HK', 'NXGV'].indexOf(name) >= 0 || dds.indexOf(name) >= 0) { toast('Đầu điểm này đã có.'); return; }
      const cols = ls.get('hk_ht_cols') || {}; const key = m.ma + '|' + HT.hk; cols[key] = (cols[key] || []).concat([name]); ls.set('hk_ht_cols', cols);
      o.close(); HT.render(); toast('Đã thêm cột ' + ddLabel(name) + '. Nhập điểm vào cột để lưu.');
    };
  }
  function colMenu(dd) {
    const m = HT.monOf(HT.mon), hk = HT.hk, L = activeStudents();
    const n = L.filter(s => HT.val(s.ma, m.ma, hk, dd) !== '').length;
    const o = ov('Đầu điểm: ' + ddLabel(dd), `<p>Môn <b>${esc(m.ten)}</b> · học kì ${hk === 1 ? 'I' : 'II'} · <b>${n}</b> học sinh đã có điểm ở cột này.</p>
      <label>Đổi tên đầu điểm</label><input type="text" id="htRen" value="${esc(dd)}">
      <p class="mut">TX1, TX2… = đánh giá thường xuyên · GK = giữa kì · CK = cuối kì. Tên khác = đầu điểm riêng, không tính vào ĐTB.</p>`,
      `<button class="hb d" data-del>Xoá cả cột</button><span style="flex:1"></span><button class="hb" data-x>Đóng</button><button class="hb p" data-ok>Đổi tên</button>`);
    o.$('[data-x]').onclick = o.close;
    o.$('[data-del]').onclick = () => {
      if (n && !confirm('Xoá ' + n + ' điểm ở cột ' + ddLabel(dd) + '?')) return;
      HT.saveDiem(L.filter(s => HT.val(s.ma, m.ma, hk, dd) !== '').map(s => ({ ma: s.ma, mon: m.ma, hk, dd, v: '' })));
      const cols = ls.get('hk_ht_cols') || {}; const key = m.ma + '|' + hk; cols[key] = (cols[key] || []).filter(x => x !== dd); ls.set('hk_ht_cols', cols);
      o.close(); HT.render(); toast('Đã xoá cột ' + ddLabel(dd) + '.');
    };
    o.$('[data-ok]').onclick = () => {
      const nn = String(o.$('#htRen').value || '').trim().toUpperCase();
      if (!nn || nn === dd) { o.close(); return; }
      if (HT.dds(m.ma, hk).indexOf(nn) >= 0 && !confirm('Cột ' + nn + ' đã có. Gộp điểm vào cột đó (ghi đè)?')) return;
      const items = [];
      L.forEach(s => { const v = HT.val(s.ma, m.ma, hk, dd); if (v !== '') { items.push({ ma: s.ma, mon: m.ma, hk, dd: nn, v }); items.push({ ma: s.ma, mon: m.ma, hk, dd, v: '' }); } });
      HT.saveDiem(items); o.close(); HT.render(); toast('Đã đổi tên cột.');
    };
  }
  /* ── Excel ── */
  async function xlsx() { if (window.XLSX) return window.XLSX; if (window.DL && DL.load) { await DL.load('xlsx'); return window.XLSX; } throw new Error('Không tải được thư viện Excel.'); }
  function exportExcel() {
    xlsx().then(X => {
      const wb = X.utils.book_new(), L = activeStudents();
      const ms = HT.monList(); const which = isGV() ? ms : [HT.monOf(HT.mon)];
      which.forEach(m => [1, 2].forEach(hk => {
        const dds = HT.dds(m.ma, hk);
        const rows = [['STT', 'Mã HS', 'Họ và tên'].concat(dds.map(ddLabel)).concat([m.ht === 'nx' ? 'KQ học kì' : 'ĐTBmhk'])];
        L.forEach((s, i) => { const tb = HT.tbHK(s.ma, m.ma, hk);
          rows.push([i + 1, s.ma, s.ten].concat(dds.map(d => { const v = HT.val(s.ma, m.ma, hk, d); const n = num(v); return n != null ? n : v; })).concat([tb == null ? '' : tb])); });
        const ws = X.utils.aoa_to_sheet(rows); ws['!cols'] = [{ wch: 5 }, { wch: 8 }, { wch: 26 }].concat(dds.map(() => ({ wch: 10 }))).concat([{ wch: 9 }]);
        X.utils.book_append_sheet(wb, ws, (m.vt || m.ma).slice(0, 22) + ' HK' + hk);
      }));
      X.writeFile(wb, 'Bang_diem_' + (S.cfg.lop || '') + (which.length === 1 ? '_' + which[0].ma : '') + '.xlsx');
    }).catch(err);
  }
  /** Nhận diện cột: trả mã đầu điểm hoặc null (cột thông tin). */
  function colDD(h, m) {
    const b = bo(h).replace(/[.:()]/g, ' ').replace(/\s+/g, ' ').trim();
    if (/^(dtb|dtbm|tbm|tb mon|diem tb|diem trung binh|trung binh mon|dtbmhk|tbmhk|tb hoc ki|tb hoc ky)$/.test(b)) return isCB() ? null : 'HK';
    if (!b || /^(stt|tt|ma|ma hs|ma hoc sinh|ho ten|ho va ten|ten|lop|to|ngay sinh|gioi tinh|ghi chu|dtb.*|tbm.*|diem tb.*|trung binh.*|xep loai.*|kq.*|ket qua.*)$/.test(b)) return null;
    if (/nhan xet/.test(b)) return null;   /* v6.4: không còn nhận xét của giáo viên bộ môn */
    let k = b.match(/^(?:tx|ddgtx|dgtx|kttx|thuong xuyen|ktx|diem tx|danh gia thuong xuyen)\s*(\d+)$/); if (k) return null;   /* v6.3: không nhập ĐĐGtx */
    k = b.match(/^(?:mieng|15 phut|15p|kiem tra 15 phut)\s*(\d*)$/); if (k && m) return null;
    if (/^(gk|ddggk|giua ki|giua ky|kiem tra giua ki|kiem tra giua ky|giua hoc ki|giua hoc ky)$/.test(b)) return 'GK';
    if (/^(ck|ddgck|cuoi ki|cuoi ky|kiem tra cuoi ki|kiem tra cuoi ky|cuoi hoc ki|cuoi hoc ky)$/.test(b)) return 'CK';
    if (/^hk$|^ket qua hoc ki$/.test(b)) return isCB() ? null : 'HK';
    return null;
  }
  /** Khớp học sinh: theo mã HS, rồi theo họ tên (trùng họ tên ⇒ lần lượt theo thứ tự trong tệp và trong danh sách lớp). */
  function matchStudent(row, iMa, iTen, seen) {
    const L = activeStudents();
    if (iMa >= 0 && row[iMa] != null && String(row[iMa]).trim()) { const s = L.find(x => x.ma.toLowerCase() === String(row[iMa]).trim().toLowerCase()); if (s) return s; }
    if (iTen >= 0 && row[iTen]) { const n = bo(row[iTen]); const c = L.filter(x => bo(x.ten) === n); const k = seen ? (seen[n] = (seen[n] || 0) + 1) - 1 : 0; if (c[k]) return c[k]; }
    return null;
  }
  function findMon(name) {
    const b = bo(name).replace(/\s*(hk|hoc ki|hoc ky)\s*(i{1,2}|1|2)\s*$/, '').trim();
    return HT.monList(true).find(m => bo(m.ma) === b || bo(m.ten) === b || bo(m.vt) === b || bo(m.ten).indexOf(b) === 0 && b.length >= 3) || null;
  }
  function importExcel() {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.xlsx,.xls,.csv';
    inp.onchange = async () => {
      const f = inp.files[0]; if (!f) return;
      try {
        const X = await xlsx(); const wb = X.read(await f.arrayBuffer(), { type: 'array' });
        const plan = [];
        wb.SheetNames.forEach(sn => {
          const rows = X.utils.sheet_to_json(wb.Sheets[sn], { header: 1, raw: true, defval: '' });
          let hr = rows.findIndex(r => r.some(c => /^(ho va ten|ho ten|ma hs|ma hoc sinh)$/.test(bo(c))));
          if (hr < 0) return;
          const head = rows[hr].map(c => String(c || ''));
          const iMa = head.findIndex(c => /^(ma hs|ma hoc sinh|ma)$/.test(bo(c))), iTen = head.findIndex(c => /^(ho va ten|ho ten|ten)$/.test(bo(c)));
          let m = findMon(sn);
          const hkM = bo(sn).match(/(hk|hoc ki|hoc ky)\s*(ii|2)\s*$/) ? 2 : bo(sn).match(/(hk|hoc ki|hoc ky)\s*(i|1)\s*$/) ? 1 : null;
          if (!m && (wb.SheetNames.length === 1 || !plan.length)) m = HT.monOf(HT.mon);
          if (!m) return;
          if (isGV() && (HT.d.myMon || []).indexOf(m.ma) < 0) return;
          const cols = []; head.forEach((c, i) => { if (i === iMa || i === iTen) return; const dd = colDD(c, m); if (dd) cols.push({ i, dd, h: c }); });
          if (!cols.length) return;
          const items = [], miss = [], bad = [], seen = {}; let nHS = 0;
          rows.slice(hr + 1).forEach(r => {
            if (!r.some(c => String(c).trim())) return;
            const s = matchStudent(r, iMa, iTen, seen);
            if (!s) { const t = iTen >= 0 ? String(r[iTen] || '').trim() : ''; if (t) miss.push(t); return; }
            nHS++;
            cols.forEach(c => { const raw = r[c.i]; if (raw === '' || raw == null) return;
              const v = c.dd === 'NXGV' ? String(raw).trim() : normV(raw, m);
              if (v == null) { bad.push(s.ten + ' · ' + c.h + ': ' + raw); return; }
              items.push({ ma: s.ma, dd: c.dd, v }); });
          });
          plan.push({ sn, m, hk: hkM || HT.hk, cols, items, miss, bad, nHS });
        });
        if (!plan.length) { toast('Không tìm thấy bảng điểm trong file: cần cột "Họ và tên" (hoặc "Mã HS") và các cột điểm.'); return; }
        previewImport(plan, f.name);
      } catch (e) { err(e); }
    };
    inp.click();
  }
  function previewImport(plan, fname) {
    const body = `<p>Tệp <b>${esc(fname)}</b>: ${plan.length} bảng điểm.</p>` + plan.map((p, k) => {
      const known = HT.dds(p.m.ma, p.hk);
      return `<div style="border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin:8px 0">
        <b>${esc(p.m.ten)}</b> · <select data-hk="${k}" style="width:auto;display:inline-block;padding:2px 6px"><option value="1"${p.hk === 1 ? ' selected' : ''}>Học kì I</option><option value="2"${p.hk === 2 ? ' selected' : ''}>Học kì II</option></select>
        <span class="mut"> · trang tính "${esc(p.sn)}"</span><br>
        ${p.nHS} học sinh · ${p.items.length} ô điểm · cột: ${p.cols.map(c => `<span style="${known.indexOf(c.dd) < 0 && c.dd !== 'NXGV' ? 'color:var(--warn);font-weight:700' : ''}">${esc(ddLabel(c.dd))}${known.indexOf(c.dd) < 0 && c.dd !== 'NXGV' ? ' (mới)' : ''}</span>`).join(', ')}
        ${p.miss.length ? `<div class="mut" style="color:var(--dang)">Không khớp tên trong danh sách lớp (${p.miss.length}): ${esc(p.miss.slice(0, 8).join(', '))}${p.miss.length > 8 ? '…' : ''}</div>` : ''}
        ${p.bad.length ? `<div class="mut" style="color:var(--dang)">Bỏ qua ${p.bad.length} ô sai định dạng: ${esc(p.bad.slice(0, 4).join('; '))}${p.bad.length > 4 ? '…' : ''}</div>` : ''}</div>`;
    }).join('') + `<label class="ck"><input type="radio" name="md" value="rep" checked> <span><b>Thay hàng loạt</b>: xoá điểm cũ của các cột có trong tệp (theo môn, học kì) rồi ghi điểm trong tệp.</span></label>
      <label class="ck"><input type="radio" name="md" value="upd"> <span><b>Chỉ cập nhật</b> ô có giá trị trong tệp; giữ nguyên điểm khác.</span></label>
      <p class="mut">Nhận các cột: Giữa kì, Cuối kì${isCB() ? '' : ', TB môn, Nhận xét'}. Cột điểm thường xuyên (ĐĐGtx) và cột lạ được bỏ qua.</p>`;
    const o = ov('Nhập điểm từ Excel', body, `<button class="hb" data-x>Huỷ</button><button class="hb p" data-ok>${IC.save} Lưu vào sổ</button>`);
    o.$('[data-x]').onclick = o.close;
    o.$$('select[data-hk]').forEach(s => s.onchange = () => { plan[+s.dataset.hk].hk = +s.value; });
    o.$('[data-ok]').onclick = () => {
      const rep = o.$('input[name=md]:checked').value === 'rep'; let n = 0;
      plan.forEach(p => {
        const items = p.items.map(it => ({ ma: it.ma, mon: p.m.ma, hk: p.hk, dd: it.dd, v: it.v }));
        n += items.length;
        HT.saveDiem(items, rep ? { mon: p.m.ma, hk: p.hk, dds: p.cols.map(c => c.dd) } : undefined);
        if (HT.henBao) HT.henBao(p.cols.filter(c => c.dd === 'GK' || c.dd === 'CK').map(c => ({ mon: p.m.ma, hk: p.hk, dd: c.dd })), true);
      });
      o.close(); HT.mon = plan[0].m.ma; HT.hk = plan[0].hk; HT.render(); toast('Đã nhập ' + n + ' ô điểm. Hệ thống đang lưu lên máy chủ.');
    };
  }
  HT.importExcel = importExcel;

  /* ── Tổng kết ── */
  const KY = [['gk1', 'Giữa học kì I'], ['hk1', 'Học kì I'], ['gk2', 'Giữa học kì II'], ['hk2', 'Học kì II'], ['cn', 'Cả năm']];
  HT.KY = KY;
  function viewTK() {
    const ky = HT.ky, ms = HT.monList(), L = activeStudents();
    const kq = L.map(s => ({ s, k: HT.ketQua(s.ma, ky), rl: HT.renLuyen(s.ma, ky[0] === 'g' ? 'hk' + ky[2] : ky), dh: ky === 'cn' ? HT.danhHieu(s.ma) : '' }));
    const cnt = [0, 0, 0, 0]; let chua = 0; kq.forEach(x => x.k.muc == null ? chua++ : cnt[x.k.muc]++);
    let h = `<div class="htbar"><select id="htKy">${KY.map(([k, l]) => `<option value="${k}"${k === ky ? ' selected' : ''}>${l}</option>`).join('')}</select><span class="sp"></span>
      <button class="hb" id="htTkP">${IC.down}<span class="lg">Tải PDF báo cáo</span></button><button class="hb" id="htTkX">${IC.down}<span class="lg">Tải Excel</span></button><button class="hb p" id="htPH">${IC.mail}<span class="lg">Gửi phiếu báo cha mẹ HS</span></button></div>`;
    h += `<div class="kpis" style="margin:0 12px 12px">${LV.map((l, i) => `<div class="kpi"><div class="n ${LVC[i]}">${cnt[i]}</div><div class="l">Kết quả học tập ${l}</div><div class="sub">${String(L.length ? Math.round(cnt[i] * 1000 / L.length) / 10 : 0).replace('.', ',')}% sĩ số</div></div>`).join('')}</div>`;
    if (chua) h += `<div class="htnote">${chua} học sinh chưa đủ điểm để xếp mức kết quả học tập ${esc((l => l[0].toLowerCase() + l.slice(1))(KY.find(k => k[0] === ky)[1]))}.${ky[0] === 'g' ? ' Kết quả giữa kì tính theo điểm giữa kì (tham khảo).' : ''}</div>`;
    else if (ky[0] === 'g') h += `<div class="htnote">Kết quả giữa kì tính theo điểm giữa kì (tham khảo).</div>`;
    h += `<div class="htg tablewrap"><table><thead><tr><th>TT</th><th class="name">Họ và tên</th>${ms.map(m => `<th title="${esc(m.ten)}">${esc(m.vt || m.ten.split(/[ ,]/)[0])}</th>`).join('')}<th>KQ học tập</th><th>KQ rèn luyện</th>${ky === 'cn' ? '<th>Danh hiệu</th>' : ''}</tr></thead><tbody>`;
    kq.forEach((x, i) => {
      h += `<tr data-ma="${esc(x.s.ma)}"><td>${i + 1}</td><td class="name">${esc(x.s.ten)}</td>${ms.map(m => { const v = x.k.mon[m.ma]; return `<td class="${(typeof v === 'number' && v < 5) || v === 'CĐ' ? 'lo' : ''}">${v == null ? '' : typeof v === 'number' ? f1(v) : v}</td>`; }).join('')}
        <td>${x.k.muc == null ? '<span class="mut">chưa đủ</span>' : `<span class="muc ${LVC[x.k.muc]}">${LV[x.k.muc]}${x.k.tam ? '*' : ''}</span>`}</td>
        <td>${x.rl == null ? '' : `<span class="muc ${LVC[x.rl]}">${LV[x.rl]}</span>`}</td>${ky === 'cn' ? `<td>${esc(x.dh)}</td>` : ''}</tr>`;
    });
    h += '</tbody></table></div><div class="htnote">* Tạm xếp khi còn môn chưa đủ điểm. Kết quả rèn luyện lấy từ xếp loại các tháng trong sổ (xếp loại đã xác nhận được ưu tiên).</div>';
    return h;
  }
  function bindTK(box) {
    box.querySelector('#htKy').onchange = e => { HT.ky = e.target.value; HT.render(); };
    box.querySelector('#htTkX').onclick = () => xlsx().then(X => {
      const ms = HT.monList(), ky = HT.ky, rows = [['STT', 'Mã HS', 'Họ và tên'].concat(ms.map(m => m.ten)).concat(['KQ học tập', 'KQ rèn luyện']).concat(ky === 'cn' ? ['Danh hiệu'] : [])];
      activeStudents().forEach((s, i) => { const k = HT.ketQua(s.ma, ky), rl = HT.renLuyen(s.ma, ky[0] === 'g' ? 'hk' + ky[2] : ky);
        rows.push([i + 1, s.ma, s.ten].concat(ms.map(m => k.mon[m.ma] == null ? '' : k.mon[m.ma])).concat([k.muc == null ? '' : LV[k.muc], rl == null ? '' : LV[rl]]).concat(ky === 'cn' ? [HT.danhHieu(s.ma)] : [])); });
      const wb = X.utils.book_new(); X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet(rows), 'Tong ket');
      X.writeFile(wb, 'Tong_ket_' + (S.cfg.lop || '') + '_' + ky + '.xlsx');
    }).catch(err);
    box.querySelector('#htTkP').onclick = () => { try { HT.pdfLop(HT.ky); } catch (e) { err(e); } };
    box.querySelector('#htPH').onclick = () => phieuBao();
    box.querySelectorAll('tbody tr[data-ma]').forEach(tr => tr.onclick = () => { if (typeof openProfile === 'function') openProfile(tr.dataset.ma); });
  }

  /* ── Phiếu báo kết quả gửi cha mẹ học sinh ── */
  HT.phieuHTML = function (ma, ky, o) {
    const s = stu(ma), k = HT.ketQua(ma, ky), ms = HT.monList(), kyL = KY.find(x => x[0] === ky)[1], kyl = kyL[0].toLowerCase() + kyL.slice(1);
    const rl = HT.renLuyen(ma, ky[0] === 'g' ? 'hk' + ky[2] : ky);
    const th = 'style="background:#E2F2F4;color:#0A5C64;font-size:12px;padding:6px 8px;border:1px solid #CFE3E6;text-align:center"', td = 'style="padding:6px 8px;border:1px solid #DDE9EC;font-size:13px;text-align:center"', tdl = 'style="padding:6px 8px;border:1px solid #DDE9EC;font-size:13px"';
    const hk = ky === 'cn' ? 2 : +ky[2];
    let h = `<p>Kính gửi cha mẹ học sinh <b>${esc(s.ten)}</b>,</p><p>Giáo viên chủ nhiệm lớp ${esc(S.cfg.lop || '')} trân trọng thông báo kết quả học tập${o.rl ? ', rèn luyện' : ''} ${esc(kyl)} năm học ${esc(S.cfg.namHoc || '')} của học sinh như sau:</p>`;
    h += `<table style="border-collapse:collapse;width:100%;margin:8px 0"><tr><th ${th}>Môn học</th>${o.chiTiet && ky !== 'cn' ? `<th ${th}>Giữa kì</th><th ${th}>Cuối kì</th>` : ''}<th ${th}>${ky[0] === 'g' ? 'Điểm giữa kì' : ky === 'cn' ? 'TB cả năm' : 'TB học kì'}</th>${o.nx ? `<th ${th}>Nhận xét của giáo viên bộ môn</th>` : ''}</tr>`;
    ms.forEach(m => { const v = k.mon[m.ma];
      h += `<tr><td ${tdl}>${esc(m.ten)}</td>${o.chiTiet && ky !== 'cn' ? `<td ${td}>${esc(fmtV(HT.val(ma, m.ma, hk, 'GK')))}</td><td ${td}>${esc(fmtV(HT.val(ma, m.ma, hk, 'CK')))}</td>` : ''}<td ${td}><b>${v == null ? '' : typeof v === 'number' ? f1(v) : v}</b></td>${o.nx ? `<td ${tdl}>${esc(HT.val(ma, m.ma, hk, 'NXGV'))}</td>` : ''}</tr>`; });
    h += '</table>';
    h += `<p><b>Kết quả học tập:</b> ${k.muc == null ? 'chưa đủ điểm để xếp mức' : LV[k.muc]}${o.rl && rl != null ? ` &nbsp;·&nbsp; <b>Kết quả rèn luyện:</b> ${LV[rl]}` : ''}${ky === 'cn' && HT.danhHieu(ma) ? ` &nbsp;·&nbsp; <b>Danh hiệu:</b> ${HT.danhHieu(ma)}` : ''}</p>`;
    if (o.loi) h += `<p>${esc(o.loi).replace(/\n/g, '<br>')}</p>`;
    h += `<p>Trân trọng,<br>${esc(S.cfg.gvcn || S.me.name)} — Giáo viên chủ nhiệm lớp ${esc(S.cfg.lop || '')}</p>`;
    return h;
  };
  function phieuBao() {
    const L = activeStudents(), ky = HT.ky, kyL = KY.find(x => x[0] === ky)[1], kyl = kyL[0].toLowerCase() + kyL.slice(1);
    const coMail = L.filter(s => /@/.test(s.email || ''));
    const o = ov('Gửi phiếu báo kết quả tới cha mẹ học sinh', `<p>Kỳ: <b>${esc(kyL)}</b> · ${coMail.length}/${L.length} học sinh có email cha mẹ (cột Email trong danh sách lớp).</p>
      <label class="ck"><input type="checkbox" id="pbRL" checked> <span>Kèm kết quả rèn luyện</span></label>
      <label class="ck"><input type="checkbox" id="pbCT" checked> <span>Kèm điểm giữa kì, cuối kì từng môn</span></label>
      <label style="display:block;margin-top:8px">Lời nhắn chung</label><textarea id="pbLoi" rows="3">Kính mong gia đình tiếp tục phối hợp với nhà trường, động viên và nhắc nhở học sinh trong học tập, rèn luyện.</textarea>
      <label style="display:block;margin-top:8px">Gửi tới</label><select id="pbAi"><option value="all">Tất cả học sinh có email (${coMail.length})</option>${coMail.map(s => `<option value="${esc(s.ma)}">${esc(s.ten)}</option>`).join('')}</select>
      <div style="margin-top:10px;border:1px solid var(--line);border-radius:12px;padding:10px 12px;max-height:260px;overflow:auto" id="pbXem"></div>`,
      `<button class="hb" data-x>Huỷ</button><button class="hb p" data-ok>${IC.mail} Gửi</button>`, { w: 820 });
    const opt = () => ({ rl: o.$('#pbRL').checked, chiTiet: o.$('#pbCT').checked, nx: false, loi: o.$('#pbLoi').value });
    const xem = () => { const ma = o.$('#pbAi').value === 'all' ? (coMail[0] || L[0] || {}).ma : o.$('#pbAi').value; o.$('#pbXem').innerHTML = ma ? '<div class="mut">Xem trước:</div>' + HT.phieuHTML(ma, ky, opt()) : ''; };
    o.$$('input,select,textarea').forEach(x => x.addEventListener('input', xem)); xem();
    o.$('[data-x]').onclick = o.close;
    o.$('[data-ok]').onclick = async () => {
      const ai = o.$('#pbAi').value, ds = ai === 'all' ? coMail : coMail.filter(s => s.ma === ai);
      if (!ds.length) { toast('Chưa có học sinh nào có email cha mẹ.'); return; }
      if (!confirm('Gửi phiếu báo ' + kyl + ' tới cha mẹ của ' + ds.length + ' học sinh?')) return;
      const b = o.$('[data-ok]'); b.disabled = true; b.textContent = 'Đang gửi…';
      try {
        let gui = 0, bo2 = [];
        for (let i = 0; i < ds.length; i += 15) {
          const items = ds.slice(i, i + 15).map(s => ({ ma: s.ma, subject: `[${S.cfg.lop || ''}] Thông báo kết quả ${kyl} của học sinh ${s.ten}`, html: HT.phieuHTML(s.ma, ky, opt()) }));
          const j = await rawApi('htMailPH', { items }, 90000); gui += j.gui; bo2 = bo2.concat(j.bo || []);
          b.textContent = 'Đã gửi ' + gui + '/' + ds.length + '…';
        }
        o.close(); toast('Đã gửi ' + gui + ' phiếu báo' + (bo2.length ? ' · bỏ qua ' + bo2.length + ' (chưa có email / đã huỷ nhận thư)' : '') + '.');
      } catch (e) { b.disabled = false; b.textContent = 'Gửi'; err(e); }
    };
  }

  /* ── v6.3: ĐIỂM KIỂM TRA (giữa kì, cuối kì, TB môn nếu có) + KỲ THI ⇒ PDF lớp (Tổng kết ▸ Tải PDF báo cáo) và trang "Kết quả học tập" trong báo cáo học sinh ── */
  const escH = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const cDiem = v => v >= 8 ? '#1E8449' : v >= 6.5 ? '#1F618D' : v >= 5 ? '#B9761C' : '#C0392B';
  const kyLabel = ky => KY.find(x => x[0] === ky)[1];
  const kyHKs = ky => ky === 'cn' ? [1, 2] : [+ky[2]];
  /** Kỳ của báo cáo nề nếp (RPT: {k:'thang',m} | {k:'hk',n} | {k:'nam'}) ⇒ kỳ học tập (hk1 | hk2 | cn) */
  HT.kyOfRpt = k => k.k === 'nam' || k.k === 'cn' ? 'cn' : k.k === 'hk' ? 'hk' + k.n : ([9, 10, 11, 12, 1].indexOf(k.m) >= 0 ? 'hk1' : 'hk2');
  /** Điểm 1 môn trong kỳ: TB môn (dán từ phần mềm điểm) nếu có, không thì TB các bài kiểm tra giữa / cuối kì (tham khảo). */
  HT.monKT = function (ma, mon, ky) {
    const out = []; kyHKs(ky).forEach(hk => {
      const hkv = num(HT.val(ma, mon, hk, 'HK')); if (hkv != null && ky[0] !== 'g') { out.push(hkv); return; }
      const g = num(HT.val(ma, mon, hk, 'GK')), c = ky[0] === 'g' ? null : num(HT.val(ma, mon, hk, 'CK'));
      const v = [g, c].filter(x => x != null); if (v.length) out.push(v.reduce((x, y) => x + y, 0) / v.length);
    });
    return out.length ? out.reduce((x, y) => x + y, 0) / out.length : null;
  };
  HT.tbKT = function (ma, ky) { const v = HT.monList().filter(m => m.ht !== 'nx').map(m => HT.monKT(ma, m.ma, ky)).filter(x => x != null); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
  const ktTrongKy = ky => (HT.ktList ? HT.ktList() : []).filter(k => kyHKs(ky).indexOf(k.hk) >= 0 && HT.monList().some(m => m.ma === k.mon)).sort((a, b) => String(a.ngay).localeCompare(String(b.ngay)));
  const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
  const fv = v => v == null || v === '' ? '' : typeof v === 'number' ? f1(v) : escH(fmtV(v));
  HT.gradePage = function (D, ma, rk, o) {
    if (!HT.d || !window.RPT || !HT.monList().length) return '';
    const ky = HT.kyOfRpt(rk), s = stu(ma) || { ten: ma }, ms = HT.monList(), hks = kyHKs(ky), ph = o && o.aud === 'ph';
    const kts = ktTrongKy(ky).filter(k => HT.ktDiem && HT.ktDiem(ma, k) != null);
    const has = ms.some(m => hks.some(hk => HT.val(ma, m.ma, hk, 'GK') !== '' || HT.val(ma, m.ma, hk, 'CK') !== '' || HT.val(ma, m.ma, hk, 'HK') !== ''));
    if (!has && !kts.length) return '';
    const cols = [], cv = [];
    hks.forEach(hk => { const t = hks.length > 1 ? (hk === 1 ? ' I' : ' II') : '';
      cols.push('Giữa kì' + t, 'Cuối kì' + t); cv.push(m => HT.val(ma, m.ma, hk, 'GK'), m => HT.val(ma, m.ma, hk, 'CK')); });
    const coTB = ms.some(m => hks.some(hk => HT.val(ma, m.ma, hk, 'HK') !== ''));
    if (coTB) { cols.push('TB môn'); cv.push(m => { const v = hks.map(hk => num(HT.val(ma, m.ma, hk, 'HK'))).filter(x => x != null); return v.length ? avg(v) : hks.map(hk => HT.val(ma, m.ma, hk, 'HK')).filter(Boolean).pop() || ''; }); }
    const cell = v => { const n = typeof v === 'number' ? v : num(v); return `<td class="n" style="color:${n != null ? cDiem(n) : isCD(v) ? '#C0392B' : '#1B333A'}">${fv(n != null ? n : v)}</td>`; };
    const rows = ms.map(m => `<tr><td>${escH(m.ten)}</td>${cv.map(f => cell(f(m))).join('')}</tr>`).join('');
    const tbK = HT.tbKT(ma, ky), k = coTB ? HT.ketQua(ma, ky) : null, rl = HT.renLuyen(ma, ky[0] === 'g' ? 'hk' + ky[2] : ky);
    const bars = ms.filter(m => m.ht !== 'nx').map(m => ({ m, v: HT.monKT(ma, m.ma, ky) })).filter(x => x.v != null).map(x => ({ k: escH(x.m.vt || x.m.ten), v: x.v, c: cDiem(x.v), lbl: f1(x.v) }));
    const rm = (D.remarks || []).filter(r => r.maHS === ma && r.nhanXet).slice(-1)[0];
    const kp = `<div class="kp" style="grid-template-columns:repeat(3,1fr)"><div class="kpi" style="--c:${tbK == null ? '#5C7A83' : cDiem(tbK)}"><div class="n">${tbK == null ? '—' : f1(tbK)}</div><div class="l">${coTB ? 'Điểm TB các môn' : 'TB bài kiểm tra'}</div></div>`
      + (k && k.muc != null ? `<div class="kpi" style="--c:${RPT.RC[k.muc]}"><div class="n">${LV[k.muc]}</div><div class="l">Kết quả học tập${k.tam ? ' · tạm xếp' : ''}</div></div>` : `<div class="kpi" style="--c:#B9761C"><div class="n">${kts.length}</div><div class="l">Kỳ thi, bài ôn luyện đã dự</div></div>`)
      + `<div class="kpi" style="--c:${RPT.RC[rl == null ? 1 : rl]}"><div class="n">${rl == null ? '—' : LV[rl]}</div><div class="l">Kết quả rèn luyện</div></div></div>`;
    const ktCard = kts.length ? `<div class="card" style="margin-top:3mm"><h3>Kỳ thi &amp; ôn luyện</h3><table class="t"><tr><th>Ngày</th><th>Kỳ thi</th><th>Môn</th><th class="n">Điểm</th><th class="n">Hạng</th></tr>`
      + kts.slice(-6).map(kt => { const v = HT.ktDiem(ma, kt), all = activeStudents().map(x => HT.ktDiem(x.ma, kt)).filter(x => x != null).sort((a, b) => b - a);
        return `<tr><td>${escH(String(kt.ngay).split('-').reverse().slice(0, 2).join('/'))}</td><td>${escH(kt.ten)}</td><td>${escH((HT.monOf(kt.mon) || {}).vt || kt.mon)}</td><td class="n" style="font-weight:800;color:${cDiem(v / kt.thang * 10)}">${f1(v)}${kt.thang !== 10 ? '/' + kt.thang : ''}</td><td class="n">${all.indexOf(v) + 1}/${all.length}</td></tr>`; }).join('') + '</table></div>' : '';
    const body = `<div class="g2" style="grid-template-columns:1.05fr 1fr"><div><div class="card"><h3>Điểm kiểm tra các môn · ${escH(kyLabel(ky))}</h3><table class="t"><tr><th>Môn học</th>${cols.map(c => `<th class="n">${c}</th>`).join('')}</tr>${rows}</table></div>${hks.length === 1 ? ktCard : ''}</div>`
      + `<div>${kp}<div class="card" style="margin-bottom:3mm"><h3>${coTB ? 'Điểm trung bình từng môn' : 'Điểm kiểm tra trung bình từng môn'}</h3>${RPT.hb(bars, { empty: 'Chưa có điểm.', max: 10 })}</div>`
      + `<div class="card"><h3>Nhận xét của giáo viên chủ nhiệm</h3>`
      + `<div class="nx1"><b>Giáo viên chủ nhiệm${rm ? ' · tháng ' + rm.thang : ''}:</b> ${rm ? escH(rm.nhanXet) : '<i>Giáo viên chủ nhiệm sẽ cập nhật nhận xét.</i>'}</div></div>${hks.length > 1 ? ktCard : ''}</div></div>`;
    return RPT.page(RPT.head('Kết quả học tập · ' + escH(kyLabel(ky)), escH(s.ten), (ph ? 'Gửi cha mẹ học sinh' : 'Lớp <b>' + escH(S.cfg.lop || '11D3') + '</b>') + '<br>Năm học ' + escH(S.cfg.namHoc || '')), body, RPT.footTxt(D));
  };
  /** PDF báo cáo kết quả học tập cả lớp theo kỳ (Điểm bộ môn ▸ Tổng kết ▸ Tải PDF báo cáo). */
  HT.pdfLop = function (ky) {
    const ms = HT.monList(), msD = ms.filter(m => m.ht !== 'nx'), L = activeStudents(), D = { cfg: S.cfg, students: S.students, entries: S.entries, remarks: S.remarks }, kyL = kyLabel(ky), hks = kyHKs(ky);
    const kq = L.map(s => ({ s, tb: HT.tbKT(s.ma, ky), mon: Object.fromEntries(msD.map(m => [m.ma, HT.monKT(s.ma, m.ma, ky)])), rl: HT.renLuyen(s.ma, ky[0] === 'g' ? 'hk' + ky[2] : ky) }));
    const coTb = kq.filter(x => x.tb != null), tbL = avg(coTb.map(x => x.tb));
    const gkL = avg(L.flatMap(s => msD.flatMap(m => hks.map(hk => num(HT.val(s.ma, m.ma, hk, 'GK'))))).filter(x => x != null));
    const ckL = ky[0] === 'g' ? null : avg(L.flatMap(s => msD.flatMap(m => hks.map(hk => num(HT.val(s.ma, m.ma, hk, 'CK'))))).filter(x => x != null));
    const kts = ktTrongKy(ky);
    const BIN = [['Từ 8,0', x => x >= 8], ['6,5 – dưới 8', x => x >= 6.5 && x < 8], ['5,0 – dưới 6,5', x => x >= 5 && x < 6.5], ['Dưới 5,0', x => x < 5]];
    const bins = BIN.map(([, f]) => coTb.filter(x => f(x.tb)).length);
    const hd = (k, r) => RPT.head(k, 'Lớp ' + escH(S.cfg.lop || '11D3') + ' · ' + escH(kyL), r || ('Sĩ số <b>' + L.length + '</b><br>Năm học ' + escH(S.cfg.namHoc || '')));
    const pct = n => L.length ? String(Math.round(n * 1000 / L.length) / 10).replace('.', ',') + '%' : '0%';
    const so = msD.map(m => { const v = kq.map(x => x.mon[m.ma]).filter(n => n != null);
      const g = L.flatMap(s => hks.map(hk => num(HT.val(s.ma, m.ma, hk, 'GK')))).filter(x => x != null), c = L.flatMap(s => hks.map(hk => num(HT.val(s.ma, m.ma, hk, 'CK')))).filter(x => x != null);
      return { m, n: v.length, tb: avg(v), gk: avg(g), ck: ky[0] === 'g' ? null : avg(c), hi: v.length ? Math.max(...v) : null, lo: v.length ? Math.min(...v) : null, g8: v.filter(n => n >= 8).length, d5: v.filter(n => n < 5).length }; }).filter(x => x.n);
    let html = RPT.page(hd('Báo cáo kết quả học tập'),
      `<div class="kp"><div class="kpi" style="--c:#0E7C86"><div class="n">${tbL == null ? '—' : f1(tbL)}</div><div class="l">Điểm TB cả lớp</div></div>`
      + `<div class="kpi" style="--c:#1F618D"><div class="n">${gkL == null ? '—' : f1(gkL)}</div><div class="l">TB bài kiểm tra giữa kì</div></div>`
      + `<div class="kpi" style="--c:#1E8449"><div class="n">${ckL == null ? '—' : f1(ckL)}</div><div class="l">TB bài kiểm tra cuối kì</div></div>`
      + `<div class="kpi" style="--c:#B9761C"><div class="n">${kts.length}</div><div class="l">Kỳ thi, bài ôn luyện</div></div></div>`
      + `<div class="g2"><div class="card"><h3>Phân bố điểm trung bình của học sinh</h3>${RPT.donut(bins, BIN.map(x => x[0]), { size: 170, center: tbL == null ? '' : f1(tbL), sub: 'TB cả lớp' })}<div class="txt" style="color:#5C7A83">${coTb.length}/${L.length} học sinh có điểm${coTb.length < L.length ? ' · ' + pct(L.length - coTb.length) + ' chưa có điểm' : ''}.</div></div>`
      + `<div class="card"><h3>Điểm trung bình cả lớp từng môn</h3>${RPT.hb(so.map(x => ({ k: escH(x.m.vt || x.m.ten), v: x.tb, c: cDiem(x.tb), lbl: f1(x.tb) })), { empty: 'Chưa có điểm.', max: 10 })}</div></div>`
      + `<div class="txt" style="color:#5C7A83;margin-top:3mm">Điểm môn = TB môn (lấy từ phần mềm quản lý điểm, nếu đã nhập) hoặc trung bình bài kiểm tra giữa kì / cuối kì — số liệu tham khảo.</div>`, RPT.footTxt(D));
    const top = coTb.slice().sort((a, b) => b.tb - a.tb).slice(0, 10);
    const yeu = kq.filter(x => msD.some(m => x.mon[m.ma] != null && x.mon[m.ma] < 5)).slice(0, 9);
    html += RPT.page(hd('Thống kê theo môn · học sinh tiêu biểu'),
      `<div class="g2" style="grid-template-columns:1.25fr 1fr"><div class="card"><h3>Thống kê điểm theo môn</h3><table class="t"><tr><th>Môn học</th><th class="n">TB giữa kì</th>${ky[0] === 'g' ? '' : '<th class="n">TB cuối kì</th>'}<th class="n">Cao nhất</th><th class="n">Thấp nhất</th><th class="n">Từ 8,0</th><th class="n">Dưới 5,0</th></tr>`
      + so.map(x => `<tr><td>${escH(x.m.ten)}</td><td class="n" style="color:${x.gk == null ? '#1B333A' : cDiem(x.gk)}">${x.gk == null ? '' : f1(x.gk)}</td>${ky[0] === 'g' ? '' : `<td class="n" style="font-weight:800;color:${x.ck == null ? '#1B333A' : cDiem(x.ck)}">${x.ck == null ? '' : f1(x.ck)}</td>`}<td class="n">${f1(x.hi)}</td><td class="n">${f1(x.lo)}</td><td class="n" style="color:#1E8449">${x.g8}</td><td class="n" style="color:${x.d5 ? '#C0392B' : '#8AA6AD'}">${x.d5}</td></tr>`).join('') + '</table></div>'
      + `<div><div class="card" style="margin-bottom:3mm"><h3>10 học sinh có điểm trung bình cao nhất</h3>${RPT.hb(top.map(x => ({ k: escH(x.s.ten), v: x.tb, c: '#1E8449', lbl: f1(x.tb) })), { empty: 'Chưa có điểm.', max: 10 })}</div>`
      + `<div class="card"><h3>Học sinh cần hỗ trợ thêm</h3>${yeu.length ? '<div class="lst">' + yeu.map(x => `<div><span>${escH(x.s.ten)}</span><em style="color:#C0392B;font-style:normal;font-size:8.5pt">${msD.filter(m => x.mon[m.ma] != null && x.mon[m.ma] < 5).map(m => escH(m.vt || m.ten)).join(', ')}</em></div>`).join('') + '</div>' : '<div class="none">Không có học sinh dưới 5,0 môn nào.</div>'}</div></div></div>`, RPT.footTxt(D));
    if (kts.length) {
      const nhat = kt => { const r = L.map(s => ({ s, v: HT.ktDiem(s.ma, kt) })).filter(x => x.v != null).sort((a, b) => b.v - a.v); return r; };
      html += RPT.page(hd('Kỳ thi học sinh giỏi · ôn luyện trên app', kts.length + ' kỳ thi'),
        `<table class="t"><tr><th>Ngày</th><th>Kỳ thi</th><th>Loại</th><th>Môn</th><th class="n">Dự thi</th><th class="n">TB</th><th class="n">Cao nhất</th><th>Điểm cao nhất</th></tr>`
        + kts.slice(-14).map(kt => { const r = nhat(kt), tb = avg(r.map(x => x.v)), sc = kt.thang !== 10 ? '/' + kt.thang : '';
          return `<tr><td>${escH(String(kt.ngay).split('-').reverse().join('/'))}</td><td>${escH(kt.ten)}</td><td>${{ HSG: 'Học sinh giỏi', OL: 'Ôn luyện', KT: 'Kiểm tra' }[kt.loai] || ''}</td><td>${escH((HT.monOf(kt.mon) || {}).ten || kt.mon)}</td><td class="n">${r.length}</td><td class="n">${tb == null ? '' : f1(tb) + sc}</td><td class="n" style="font-weight:800;color:#1E8449">${r.length ? f1(r[0].v) + sc : ''}</td><td>${r.filter(x => r.length && x.v === r[0].v).slice(0, 3).map(x => escH(x.s.ten)).join(', ')}</td></tr>`; }).join('') + '</table>', RPT.footTxt(D));
    }
    const per = 20, cellM = (s, m) => hks.map(hk => [HT.val(s.ma, m.ma, hk, 'GK'), ky[0] === 'g' ? '' : HT.val(s.ma, m.ma, hk, 'CK')]);
    for (let i = 0; i < kq.length; i += per) {
      html += RPT.page(hd('Bảng tổng hợp điểm kiểm tra · ' + escH(kyL), (kq.length > per ? 'Phần ' + (i / per + 1) + '/' + Math.ceil(kq.length / per) : L.length + ' học sinh') + '<br>Mỗi ô: giữa kì' + (ky[0] === 'g' ? '' : ' · cuối kì')),
        `<table class="t" style="font-size:8.3pt"><tr><th>TT</th><th>Họ và tên</th>${msD.map(m => `<th class="n">${escH(m.vt || m.ten.split(/[ ,]/)[0])}</th>`).join('')}<th class="n">TB</th><th>Rèn luyện</th></tr>`
        + kq.slice(i, i + per).map((x, j) => `<tr><td>${i + j + 1}</td><td>${escH(x.s.ten)}</td>${msD.map(m => `<td class="n" style="white-space:nowrap">${cellM(x.s, m).map(p => p.filter(v => v !== '').map(v => `<span style="color:${num(v) != null ? cDiem(num(v)) : '#1B333A'}">${fv(v)}</span>`).join(' · ')).filter(Boolean).join(' | ')}</td>`).join('')}<td class="n" style="font-weight:800;color:${x.tb == null ? '#1B333A' : cDiem(x.tb)}">${x.tb == null ? '' : f1(x.tb)}</td><td>${x.rl == null ? '' : LV[x.rl]}</td></tr>`).join('') + '</table>', RPT.footTxt(D));
    }
    return RPT.open(html, 'Ket_qua_hoc_tap_' + (S.cfg.lop || '11D3') + '_' + ky);
  };

  /* hồ sơ học sinh: nút PDF nạp điểm trước (để có trang Kết quả học tập) + nút "PDF gửi cha mẹ HS" (lời văn gửi phụ huynh) */
  document.addEventListener('click', async e => {
    const b = e.target.closest && e.target.closest('#pfPr,#pfPrPh'); if (!b || HT.d || !canHT() || b.dataset.htw) return;
    e.stopImmediatePropagation(); e.preventDefault(); b.dataset.htw = '1'; const t = b.textContent; b.textContent = 'Đang lấy điểm…';
    try { await HT.load(); } catch (_) {} b.textContent = t; delete b.dataset.htw; b.click();
  }, true);
  const openProfileHT = window.openProfile;
  if (openProfileHT) window.openProfile = openProfile = async function (ma) {
    const r = await openProfileHT.apply(this, arguments);
    const b = $('#pfPr'); if (!b || !isGVCN() || $('#pfPrPh')) return r;
    const b2 = b.cloneNode(false); b2.id = 'pfPrPh'; b2.textContent = 'PDF gửi cha mẹ HS'; b.after(b2);
    b2.onclick = () => { const k = PF.ky || ('t' + S.thang), K = k === 'nam' ? { k: 'nam' } : /^hk/.test(k) ? { k: 'hk', n: +k[2] } : { k: 'thang', m: +k.slice(1) };
      RPT.open(RPT.student({ cfg: S.cfg, students: S.students, entries: S.entries, remarks: S.remarks }, ma, K, { aud: 'ph' }), 'Bao_cao_gui_cha_me_' + String(stu(ma).ten || ma).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/\W+/g, '_')); };
    return r;
  };

  /* ── Môn học ── */
  function viewMon() {
    const D = HT.d;
    let h = `<div class="sechead"><h2>Danh mục môn học</h2></div><div class="htnote">Môn <b>đánh giá bằng nhận xét</b> (Giáo dục thể chất, Hoạt động trải nghiệm – hướng nghiệp, Nội dung giáo dục của địa phương, Nghệ thuật) nhập Đ / CĐ. Số đầu điểm ĐGtx mỗi học kì theo số tiết của môn (Thông tư 22/2021: 35 tiết → 2, 70 tiết → 3, trên 70 tiết → 4).</div>
      <div class="htlist tablewrap"><table id="htMonT"><thead><tr><th>Đang học</th><th>Mã môn</th><th class="name">Tên môn học</th><th>Viết tắt</th><th>Hình thức đánh giá</th><th>Số ĐĐGtx</th><th></th></tr></thead><tbody>
      ${D.mon.map(m => monRow(m)).join('')}</tbody></table></div>
      <div class="htbar"><button class="hb" id="htMonAdd">${IC.plus} Thêm môn</button><span class="sp"></span><button class="hb p" id="htMonSave">${IC.save} Lưu danh mục môn</button></div>`;
    return h;
  }
  const monRow = m => `<tr><td><input type="checkbox" data-k="on"${m.on !== false ? ' checked' : ''} style="width:20px;height:20px;min-width:0"></td><td><input data-k="ma" value="${esc(m.ma || '')}" style="width:80px"></td><td class="name"><input data-k="ten" value="${esc(m.ten || '')}" style="min-width:220px"></td><td><input data-k="vt" value="${esc(m.vt || '')}" style="width:80px"></td>
    <td><select data-k="ht"><option value="d"${m.ht !== 'nx' ? ' selected' : ''}>Điểm số</option><option value="nx"${m.ht === 'nx' ? ' selected' : ''}>Nhận xét</option></select></td><td><input data-k="tx" type="number" min="0" max="8" value="${esc(m.tx || 0)}" style="width:64px"></td><td><button class="x" title="Xoá">×</button></td></tr>`;
  function bindMon(box) {
    const T = box.querySelector('#htMonT tbody');
    const delB = root => root.querySelectorAll('.x').forEach(b => b.onclick = () => b.closest('tr').remove());
    delB(T);
    box.querySelector('#htMonAdd').onclick = () => { T.insertAdjacentHTML('beforeend', monRow({ ma: '', ten: '', ht: 'd', tx: 3, on: true })); delB(T); };
    box.querySelector('#htMonSave').onclick = () => {
      const mon = Array.from(T.rows).map(tr => { const g = k => tr.querySelector(`[data-k="${k}"]`); return { on: g('on').checked, ma: g('ma').value.trim().toUpperCase(), ten: g('ten').value.trim(), vt: g('vt').value.trim(), ht: g('ht').value, tx: +g('tx').value || 0 }; }).filter(m => m.ma && m.ten);
      const dup = mon.map(m => m.ma).filter((x, i, a) => a.indexOf(x) !== i); if (dup.length) { toast('Trùng mã môn: ' + dup.join(', ')); return; }
      HT.d.mon = mon.map((m, i) => Object.assign(m, { tt: i + 1 })); htqAdd('htSaveMon', { mon }); toast('Đã lưu danh mục môn học.'); HT.render();
    };
  }


  /* ── Cách tính điểm ── */
  const RULE_UI = [
    ['Điểm trung bình môn', [['heSoTX', 'Hệ số mỗi điểm ĐGtx'], ['heSoGK', 'Hệ số điểm giữa kì'], ['heSoCK', 'Hệ số điểm cuối kì'], ['heSoHK2', 'Hệ số học kì II khi tính cả năm', 'ĐTBmcn = (ĐTBmhkI + k × ĐTBmhkII) ÷ (1 + k)'], ['lamTron', 'Số chữ số thập phân khi làm tròn']]],
    ['Mức Tốt', [['totDiemMoi', 'Mọi môn đánh giá bằng điểm số có ĐTB từ'], ['totSoMon', 'Số môn tối thiểu đạt điểm cao'], ['totDiemCao', 'Mức điểm cao (ĐTB từ)']]],
    ['Mức Khá', [['khaDiemMoi', 'Mọi môn đánh giá bằng điểm số có ĐTB từ'], ['khaSoMon', 'Số môn tối thiểu đạt điểm cao'], ['khaDiemCao', 'Mức điểm cao (ĐTB từ)']]],
    ['Mức Đạt', [['datSoMon', 'Số môn tối thiểu có ĐTB đạt'], ['datDiem', 'Mức đạt (ĐTB từ)'], ['datSan', 'Không môn nào có ĐTB dưới'], ['datToiDaCD', 'Số môn nhận xét Chưa đạt tối đa']]],
    ['Danh hiệu & môn nhận xét', [['xsSoMon', 'Học sinh Xuất sắc: số môn có ĐTBmcn đạt mức xuất sắc'], ['xsDiem', 'Mức xuất sắc (ĐTBmcn từ)'], ['nxTiLeDat', 'Môn nhận xét: tỉ lệ lần Đạt tối thiểu', 'Mặc định 2/3 ≈ 0,6667; lần cuối kì phải Đạt']]]
  ];
  function viewRule() {
    const R = HT.d.rule;
    return `<div class="htnote">Mặc định theo <b>Thông tư 22/2021/TT-BGDĐT</b> về đánh giá học sinh trung học cơ sở và trung học phổ thông. Chỉ thay đổi khi nhà trường có hướng dẫn khác.</div>`
      + RULE_UI.map(([t, ks]) => `<div class="sechead"><h2>${t}</h2></div><div class="htform">${ks.map(([k, l, d]) => `<div class="row"><label>${l}${d ? `<small>${d}</small>` : ''}</label><input data-rk="${k}" type="number" step="any" value="${esc(R[k])}"></div>`).join('')}</div>`).join('')
      + `<div class="htbar"><button class="hb" id="htRuleDef">Khôi phục mặc định</button><span class="sp"></span><button class="hb p" id="htRuleSave">${IC.save} Lưu cách tính</button></div>`;
  }
  const RULE0 = { heSoTX: 1, heSoGK: 2, heSoCK: 3, heSoHK2: 2, lamTron: 1, totDiemMoi: 6.5, totSoMon: 6, totDiemCao: 8, khaDiemMoi: 5, khaSoMon: 6, khaDiemCao: 6.5, datSoMon: 6, datDiem: 5, datSan: 3.5, datToiDaCD: 1, xsSoMon: 6, xsDiem: 9, nxTiLeDat: 0.6667 };
  function bindRule(box) {
    box.querySelector('#htRuleDef').onclick = () => { box.querySelectorAll('[data-rk]').forEach(i => { i.value = RULE0[i.dataset.rk]; }); toast('Đã điền giá trị mặc định — bấm Lưu để áp dụng.'); };
    box.querySelector('#htRuleSave').onclick = () => {
      const rule = {}; box.querySelectorAll('[data-rk]').forEach(i => { rule[i.dataset.rk] = +String(i.value).replace(',', '.'); });
      Object.assign(HT.d.rule, rule); htqAdd('htSaveRule', { rule }); toast('Đã lưu cách tính điểm.'); HT.render();
    };
  }
})();
