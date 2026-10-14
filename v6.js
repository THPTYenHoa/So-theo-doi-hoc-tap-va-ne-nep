/* ══ v6.0 — GIAO DIỆN GỌN: Tổng quan · Cập nhật · Báo cáo & sổ · Quản lý ══════════════════════════════════════
   • Điều hướng theo NHÓM (GROUPS): thanh bên máy tính có tiêu đề nhóm; điện thoại 4 nút dưới + dải tab phụ #v6sub.
   • Tổng quan #vTQ (TQ): tab Thi đua · Học lực · Top điểm; kỳ Tháng / Học kỳ / Cả năm; tự vẽ lại khi dữ liệu trực tiếp (LIVE)
     về (renderAll); Tải PDF (DL.pdfHtml). Học lực / Top điểm cần dữ liệu HT (chỉ GVCN / Quản trị).
   • Cập nhật = Theo dõi nề nếp (ghi) + Điểm bộ môn (ht).
   • Vai trò: Lớp trưởng / Tổ trưởng ⇒ hiện chung "Cán bộ lớp", ghi nề nếp cả lớp (backend v6.0). S.me.role0 = vai gốc.
   • Màn đăng nhập gọn: logo, TÊN TRƯỜNG lớn, không hiện tên lớp (tên lớp hiện bên trong app).
   • Bộ biểu tượng nét mảnh mới ICON6 (thay ICON của thanh điều hướng). */
(function () {
  'use strict';
  const SVG = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
  const ICON6 = window.ICON6 = {
    tq: '<rect x="3" y="3" width="7.5" height="9" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="5.5" rx="1.6"/><rect x="13.5" y="11.5" width="7.5" height="9.5" rx="1.6"/><rect x="3" y="15" width="7.5" height="6" rx="1.6"/>',
    cn: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    ghi: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="m9 12 2 2 4-4"/><path d="M9 17h6"/>',
    ht: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/><path d="M6.5 8h2M6.5 11h2M15.5 8h2M15.5 11h2"/>',
    bcg: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 17v-3M12 17v-5M15 17v-2"/>',
    bang: '<circle cx="12" cy="9" r="5.5"/><path d="m9.2 13.8-1.7 7 4.5-2.4 4.5 2.4-1.7-7"/><path d="m10 9 1.4 1.4L14 8"/>',
    bc: '<path d="M4 21V10M10 21V4M16 21v-8M21 21H3"/>',
    tk: '<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>',
    scn: '<path d="M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6z"/><path d="M6 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2"/><path d="M10 8h6M10 12h6M10 16h3"/>',
    ls: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v4h4"/><path d="M12 7.5V12l3 2"/>',
    ql: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 4.5a3.2 3.2 0 0 1 0 6.3M18 14.5a5.5 5.5 0 0 1 3 5.5"/>',
    ph: '<circle cx="8" cy="7.5" r="3"/><circle cx="17" cy="9.5" r="2.4"/><path d="M2.5 20a5.5 5.5 0 0 1 11 0M13.5 20a4 4 0 0 1 8 0"/>',
    cai: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    pdf: '<path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/>',
    live: '<circle cx="12" cy="12" r="3"/><path d="M6.3 6.3a8 8 0 0 0 0 11.4M17.7 6.3a8 8 0 0 1 0 11.4"/>',
    up: '<path d="m6 15 6-6 6 6"/>', down: '<path d="m6 9 6 6 6-6"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/>',
    alert: '<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4M12 17h.01"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 4.5a3.2 3.2 0 0 1 0 6.3M18 14.5a5.5 5.5 0 0 1 3 5.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
    book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4"/><path d="M12 13v4M8.5 20h7M10 17h4v3h-4z"/>'
  };
  const ic = (k, c) => SVG.replace('class="ic"', 'class="ic' + (c ? ' ' + c : '') + '"') + (ICON6[k] || '') + '</svg>';
  const fmt = (x, n) => x == null || isNaN(x) ? '—' : String(Math.round(x * Math.pow(10, n == null ? 1 : n)) / Math.pow(10, n == null ? 1 : n)).replace('.', ',');
  const pct = (a, b) => b ? Math.round(a * 1000 / b) / 10 : 0;
  const XC = ['#1E8449', '#1F618D', '#B9761C', '#C0392B'];
  const LV = ['Tốt', 'Khá', 'Đạt', 'Chưa đạt'];
  const mob = () => window.matchMedia('(max-width:760px)').matches;

  /* ════════ 1. VAI TRÒ: Cán bộ lớp ════════ */
  const CB = r => r === 'Lớp trưởng' || r === 'Tổ trưởng' || r === 'Cán bộ lớp';
  function normRole() {
    if (!S.me) return;
    if (S.me.role0 == null) S.me.role0 = S.me.role;
    if (CB(S.me.role)) S.me.role = 'Cán bộ lớp';
  }
  const ab0 = window.applyBase;
  window.applyBase = applyBase = function () { const r = ab0.apply(this, arguments); normRole(); return r; };
  const bfc0 = window.bootFromCache;
  if (typeof bfc0 === 'function') window.bootFromCache = bootFromCache = function () { const r = bfc0.apply(this, arguments); normRole(); return r; };
  window.isAdmin = isAdmin = function () { return isGVCN() || (S.me && (S.me.role0 === 'Lớp trưởng' || S.me.role0 === 'Cán bộ lớp')); };
  window.canScore = canScore = function () { return !!S.me && (isGVCN() || CB(S.me.role) || CB(S.me.role0)); };
  window.roleKey = function () { return isGVCN() ? 'gvcn' : 'lt'; };

  /* ════════ 2. NHÓM ĐIỀU HƯỚNG ════════ */
  const SUBT = { tq: 'Tổng quan', ghi: 'Theo dõi nề nếp', ht: 'Điểm bộ môn', bang: 'Kết quả rèn luyện', bc: 'Báo cáo thi đua',
    scn: 'Sổ công tác chủ nhiệm', ls: 'Nhật ký theo dõi', tk: 'Thống kê nề nếp', ph: 'Cha mẹ học sinh', cai: 'Cài đặt' };
  const SUBS = { ghi: 'Nề nếp', ht: 'Điểm bộ môn', bang: 'Rèn luyện', bc: 'Thi đua', scn: 'Sổ CN', ls: 'Nhật ký', tk: 'Thống kê', ph: 'Cha mẹ HS', cai: 'Cài đặt' };
  const GROUPS = window.V6_GROUPS = [
    { k: 'tq', t: 'Tổng quan', ic: 'tq', v: ['tq'] },
    { k: 'cn', t: 'Cập nhật', ic: 'cn', v: ['ghi', 'ht'] },
    { k: 'bc', t: 'Báo cáo & sổ', s: 'Báo cáo', ic: 'bcg', v: ['bang', 'bc', 'scn', 'ls'] },
    { k: 'ql', t: 'Quản lý', ic: 'ql', v: ['ph', 'cai'] }];
  const LAST = {};
  NAV.unshift({ v: 'tq', t: 'Tổng quan', s: 'Tổng quan', el: '#vTQ' });
  const sec = document.createElement('section'); sec.className = 'view hide'; sec.id = 'vTQ';
  const wrap = document.querySelector('#scroll .wrap'); if (wrap) wrap.insertBefore(sec, wrap.firstChild.nextSibling);
  /* thống kê cũ (tk) đã gộp vào Tổng quan ⇒ không còn trên menu (vẫn mở được bằng go('tk')) */
  const ni0 = window.navItems;
  window.navItems = navItems = function () {
    const L = ni0.apply(this, arguments).filter(n => n.v !== 'tk');
    if (S.me && S.me.role === 'Giáo viên bộ môn') return L.filter(n => n.v !== 'tq');
    return L;
  };
  function groupsVisible() {
    const have = new Set(navItems().map(n => n.v));
    return GROUPS.map(g => Object.assign({}, g, { v: g.v.filter(v => have.has(v)) })).filter(g => g.v.length);
  }
  const groupOf = v => GROUPS.find(g => g.v.indexOf(v) >= 0);
  window.buildNav = buildNav = function () {
    const G = groupsVisible(), cur = groupOf(S.view);
    $('#railNav').innerHTML = G.map(g => (g.v.length > 1 || g.k !== 'tq' ? `<div class="v6gh">${esc(g.t)}</div>` : '')
      + g.v.map(v => `<button data-v="${v}" class="${v === S.view ? 'on' : ''}">${ic(v === 'tq' ? 'tq' : v)}${esc(SUBT[v] || v)}</button>`).join('')).join('');
    $('#tabbar').innerHTML = G.map(g => `<button data-g="${g.k}" class="${cur && cur.k === g.k ? 'on' : ''}">${ic(g.ic)}${esc(g.s || g.t)}</button>`).join('');
    $('#tabbar').classList.toggle('v6one', G.length <= 1);
    $$('#railNav [data-v]').forEach(b => b.onclick = () => go(b.dataset.v));
    $$('#tabbar [data-g]').forEach(b => b.onclick = () => {
      const g = G.find(x => x.k === b.dataset.g); if (!g) return;
      const v = LAST[g.k] && g.v.indexOf(LAST[g.k]) >= 0 ? LAST[g.k] : g.v[0];
      go(v);
    });
    subBar();
  };
  function subBar() {
    let b = $('#v6sub');
    if (!b) { b = document.createElement('div'); b.id = 'v6sub'; const t = $('#top .topline'); if (t) t.insertAdjacentElement('afterend', b); }
    const G = groupsVisible(), g = G.find(x => x.v.indexOf(S.view) >= 0);
    if (!g || g.v.length < 2) { b.innerHTML = ''; b.classList.add('hide'); return; }
    b.classList.remove('hide');
    b.innerHTML = g.v.map(v => `<button data-v6="${v}" class="${v === S.view ? 'on' : ''}">${ic(v)}<span>${esc(SUBS[v] || SUBT[v])}</span></button>`).join('');
    b.querySelectorAll('[data-v6]').forEach(x => x.onclick = () => go(x.dataset.v6));
  }
  const go0 = window.go;
  window.go = go = async function (v) {
    const g = groupOf(v); if (g) LAST[g.k] = v;
    const r = await go0.apply(this, arguments);
    $$('#railNav [data-v]').forEach(b => b.classList.toggle('on', b.dataset.v === S.view));
    const cg = groupOf(S.view);
    $$('#tabbar [data-g]').forEach(b => b.classList.toggle('on', !!cg && b.dataset.g === cg.k));
    subBar();
    if (S.view === 'tq') TQ.render();
    try { $('#scroll').scrollTop = 0; } catch (_) {}
    return r;
  };
  const sv0 = window.syncView;
  window.syncView = syncView = function () {
    const r = sv0.apply(this, arguments);
    const hb = $('#helpBar'); if (hb) hb.classList.add('hide');
    if (S.view === 'tq') { const pb = $('#periodBar'); if (pb) pb.classList.add('hide'); }
    const t = $('#hTitle'); if (t && SUBT[S.view]) t.textContent = SUBT[S.view];
    document.body.dataset.v6view = S.view;
    return r;
  };
  const ra0 = window.renderAll;
  window.renderAll = renderAll = function () {
    const r = ra0.apply(this, arguments);
    const hb = $('#helpBar'); if (hb) hb.classList.add('hide');
    if (S.view === 'tq') TQ.render();
    return r;
  };
  /* mở app: GVCN ⇒ Tổng quan; cán bộ lớp ⇒ Theo dõi nề nếp */
  let homed = false;
  const sa0 = window.showApp;
  window.showApp = showApp = function () {
    normRole();
    const r = sa0.apply(this, arguments);
    if (S.me && S.me.role === 'Cán bộ lớp' && !homed) { S.filterTo = 'all'; try { renderFilters(); renderGhi(); } catch (_) {} }
    const rl = $('#rlRole'); if (rl && S.me) rl.textContent = S.me.role === 'GVCN' ? 'Giáo viên chủ nhiệm' : S.me.role;
    const bm = $('#rail .brand .bm'); if (bm && S.cfg) bm.textContent = S.cfg.lop || '11D3';
    if (!homed && S.me && isGVCN()) { homed = true; setTimeout(() => { if (S.view === 'ghi') go('tq'); }, 0); }
    homed = true;
    buildNav();
    return r;
  };

  /* ════════ 3. TỔNG QUAN ════════ */
  const TQ = window.TQ = { tab: 'td', ky: 'thang', hk: null, mon: '__tb', loadingY: false, loadingH: false };
  const hkNow = () => (typeof hkOf === 'function' ? hkOf(S.thang) : (HK_THANG[1].indexOf(S.thang) >= 0 ? 1 : 2));
  function period() {
    if (TQ.ky === 'thang') return { ky: 'thang', months: [S.thang], nhan: thangLabel(S.thang, true), short: 'T' + S.thang, hk: hkNow() };
    if (TQ.ky === 'hk') { const k = TQ.hk || hkNow(); return { ky: 'hk', months: HK_THANG[k].slice(), nhan: 'Học kỳ ' + (k === 1 ? 'I' : 'II'), short: 'HK' + (k === 1 ? 'I' : 'II'), hk: k }; }
    return { ky: 'nam', months: MONTHS_YEAR.slice(), nhan: 'Cả năm học ' + (S.cfg.namHoc || ''), short: 'Cả năm', hk: 0 };
  }
  const canHL = () => !!(window.HT && S.me && isGVCN());
  function tabs() { return canHL() ? [['td', 'Thi đua · nề nếp', 'trophy'], ['hl', 'Học lực', 'book'], ['top', 'Top điểm', 'star']] : [['td', 'Thi đua · nề nếp', 'trophy']]; }
  function needYear(P) { return P.months.some(m => !S.loaded.has(m)) && !S.allLoaded; }
  const inPer = (e, P) => P.months.indexOf(e[E_THANG]) >= 0;
  function scoreP(ma, P) {
    const ms = P.months.filter(m => S.entries.some(e => e[E_THANG] === m));
    return ms.length ? ms.reduce((a, m) => a + monthAvg(ma, m), 0) / ms.length : 0;
  }

  /* ── biểu đồ (SVG, không thư viện) ── */
  function cols(series, o) {   /* series:[{l, a(+), b(-)}] ⇒ cột đôi khen / vi phạm */
    const W = 560, H = 190, pl = 30, pb = 26, pt = 10, n = series.length || 1, mx = Math.max(1, ...series.map(s => Math.max(s.a, s.b)));
    const step = (W - pl - 8) / n, bw = Math.min(26, step * .32), y = v => pt + (H - pt - pb) * (1 - v / mx);
    let g = '';
    for (let i = 0; i <= 4; i++) { const v = mx * i / 4, yy = y(v); g += `<line x1="${pl}" x2="${W - 4}" y1="${yy}" y2="${yy}" stroke="#E8EEF0"/><text x="${pl - 6}" y="${yy + 3.5}" text-anchor="end" font-size="10" fill="#8AA6AD">${Math.round(v)}</text>`; }
    series.forEach((s, i) => {
      const cx = pl + step * i + step / 2;
      g += `<rect x="${cx - bw - 2}" y="${y(s.a)}" width="${bw}" height="${H - pb - y(s.a)}" rx="3" fill="#1E8449"><title>${esc(s.l)}: ${s.a} lượt khen</title></rect>`;
      g += `<rect x="${cx + 2}" y="${y(s.b)}" width="${bw}" height="${H - pb - y(s.b)}" rx="3" fill="#C0392B"><title>${esc(s.l)}: ${s.b} lượt vi phạm</title></rect>`;
      g += `<text x="${cx}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#5C7A83">${esc(s.l)}</text>`;
    });
    return `<svg class="v6ch" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">${g}</svg>`;
  }
  function donut(parts, size, center, sub) {
    const tot = parts.reduce((a, p) => a + p.v, 0) || 1, r = 15.9155; let off = 25, g = '';
    parts.forEach(p => { if (!p.v) return; const d = p.v / tot * 100; g += `<circle r="${r}" cx="21" cy="21" fill="none" stroke="${p.c}" stroke-width="5.2" stroke-dasharray="${d.toFixed(2)} ${(100 - d).toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}"/>`; off -= d; });
    return `<svg class="v6dn" viewBox="0 0 42 42" width="${size}" height="${size}"><circle r="${r}" cx="21" cy="21" fill="none" stroke="#EEF3F4" stroke-width="5.2"/>${g}<text x="21" y="21" text-anchor="middle" font-size="8" font-weight="800" fill="#16323A">${esc(center)}</text><text x="21" y="27" text-anchor="middle" font-size="3.4" fill="#5C7A83">${esc(sub || '')}</text></svg>`;
  }
  function stack(parts) {
    const tot = parts.reduce((a, p) => a + p.v, 0) || 1;
    return `<div class="v6stk">${parts.map(p => p.v ? `<i style="width:${(p.v / tot * 100).toFixed(2)}%;background:${p.c}" title="${esc(p.l)}: ${p.v}">${p.v / tot > .07 ? p.v : ''}</i>` : '').join('')}</div>
      <div class="v6lg">${parts.map(p => `<span><i style="background:${p.c}"></i>${esc(p.l)} <b>${p.v}</b><small>${fmt(pct(p.v, tot), 1)}%</small></span>`).join('')}</div>`;
  }
  function hrows(rows, o) {   /* rows:[{k,l,s,v,c,lab}] */
    o = o || {}; const mx = o.max || Math.max(1, ...rows.map(r => Math.abs(r.v)));
    return `<div class="v6hr">${rows.map((r, i) => `<div class="r"${r.ma ? ` data-ma="${esc(r.ma)}"` : ''}>${o.rank ? `<span class="rk rk${i < 3 ? i + 1 : 0}">${i + 1}</span>` : ''}<span class="k">${esc(r.l)}${r.s ? `<small>${esc(r.s)}</small>` : ''}</span>
      <span class="t"><i style="width:${Math.max(2, Math.abs(r.v) / mx * 100).toFixed(1)}%;background:${r.c || '#0E7C86'}"></i></span><span class="v" style="color:${r.c || '#16323A'}">${r.lab != null ? r.lab : r.v}</span></div>`).join('')}</div>`;
  }
  const card = (t, sub, body, cls) => `<div class="v6c${cls ? ' ' + cls : ''}"><div class="v6ch3"><h3>${t}</h3>${sub ? `<span>${sub}</span>` : ''}</div>${body}</div>`;
  const kpi = (n, l, sub, c, k) => `<div class="v6k"${k ? ` data-tqk="${k}"` : ''}><span class="i" style="color:${c};background:${c}14">${ic(k === 'cong' ? 'plus' : k === 'tru' ? 'minus' : k === 'tot' ? 'star' : k === 'tb' ? 'book' : k === 'hs' ? 'users' : 'trophy')}</span><b style="color:${c}">${n}</b><span class="l">${l}</span>${sub ? `<small>${sub}</small>` : ''}</div>`;

  /* ── tab Thi đua ── */
  function viewTD(P) {
    const L = activeStudents(), set = new Set(L.map(s => s.ma));
    const E = S.entries.filter(e => inPer(e, P) && set.has(e[E_MA]));
    const tru = E.filter(e => e[E_DIEM] < 0), cong = E.filter(e => e[E_DIEM] > 0);
    const has = P.months.some(m => S.entries.some(e => e[E_THANG] === m));
    const xl = L.map(s => ({ s, sc: scoreP(s.ma, P), x: xlOf(s.ma, P.months) }));
    const cnt = [0, 0, 0, 0]; xl.forEach(o => cnt[Math.min(3, o.x.i)]++);
    let h = `<div class="v6kp">${kpi(L.length, 'Học sinh đang học', 'Lớp ' + esc(S.cfg.lop || '11D3'), '#0A5C64', 'hs')}
      ${kpi(cong.length, 'Lượt được tuyên dương', '+' + cong.reduce((a, e) => a + e[E_DIEM], 0) + ' điểm', '#1E8449', 'cong')}
      ${kpi(tru.length, 'Lượt vi phạm', tru.reduce((a, e) => a + e[E_DIEM], 0) + ' điểm', '#C0392B', 'tru')}
      ${kpi(has ? fmt(pct(cnt[0], L.length), 0) + '%' : '—', 'Rèn luyện loại Tốt', has ? cnt[0] + '/' + L.length + ' học sinh' : 'chưa có dữ liệu', '#1F618D', 'tot')}</div>`;
    if (!has) return h + `<div class="v6empty">${ic('tk')}<b>Chưa có ghi nhận nào trong ${esc(P.nhan.toLowerCase())}</b><span>Cán bộ lớp ghi nề nếp ở mục Cập nhật ▸ Theo dõi nề nếp, số liệu hiện ngay tại đây.</span></div>`;
    /* diễn biến */
    let ser;
    if (P.ky === 'thang') { ser = []; for (let w = 1; w <= S.cfg.soTuan; w++) { const x = E.filter(e => e[E_TUAN] === w); ser.push({ l: 'Tuần ' + w, a: x.filter(e => e[E_DIEM] > 0).length, b: x.filter(e => e[E_DIEM] < 0).length }); } }
    else ser = P.months.map(m => { const x = E.filter(e => e[E_THANG] === m); return { l: 'T' + m, a: x.filter(e => e[E_DIEM] > 0).length, b: x.filter(e => e[E_DIEM] < 0).length }; });
    const lgd = '<div class="v6lg sm"><span><i style="background:#1E8449"></i>Tuyên dương</span><span><i style="background:#C0392B"></i>Vi phạm</span></div>';
    h += `<div class="v6g2">${card('Kết quả rèn luyện', esc(P.nhan), `<div class="v6dnw">${donut(LV.map((l, i) => ({ v: cnt[i], c: XC[i] })), 132, fmt(pct(cnt[0] + cnt[1], L.length), 0) + '%', 'Tốt + Khá')}<div style="flex:1;min-width:0">${stack(LV.map((l, i) => ({ l, v: cnt[i], c: XC[i] })))}</div></div>`)}
      ${card('Diễn biến ' + (P.ky === 'thang' ? 'theo tuần' : 'theo tháng'), 'lượt ghi nhận', cols(ser) + lgd)}</div>`;
    /* tổ */
    const TO = [...new Set(L.map(s => String(s.to)))].sort();
    const trow = TO.map(t => { const ms = L.filter(s => String(s.to) === t); const avg = ms.reduce((a, s) => a + scoreP(s.ma, P), 0) / (ms.length || 1);
      return { t, avg, n: ms.length, tru: tru.filter(e => String(e[E_TO]) === t).length, cong: cong.filter(e => String(e[E_TO]) === t).length }; }).sort((a, b) => b.avg - a.avg);
    const bm = Math.max(1, ...trow.map(r => Math.max(r.tru, r.cong)));
    const toH = `<div class="v6to">${trow.map((r, i) => `<div class="r"><span class="rk rk${i < 3 ? i + 1 : 0}">${i + 1}</span><span class="k">Tổ ${esc(r.t)}<small>${r.n} học sinh · điểm TB tuần ${fmt(r.avg)}</small></span>
      <span class="bf"><span class="l"><b>${r.tru || ''}</b><i style="width:${(r.tru / bm * 100).toFixed(0)}%"></i></span><span class="r2"><i style="width:${(r.cong / bm * 100).toFixed(0)}%"></i><b>${r.cong || ''}</b></span></span></div>`).join('')}</div>
      <div class="v6lg sm"><span><i style="background:#C0392B"></i>Vi phạm</span><span><i style="background:#1E8449"></i>Tuyên dương</span><span class="mut">Xếp theo điểm TB tuần của tổ</span></div>`;
    const grp = arr => { const g = {}; arr.forEach(e => { const k = e[E_ND] || e[E_MUC]; const o = g[k] = g[k] || { k, n: 0, d: 0, hs: new Set() }; o.n++; o.d += e[E_DIEM]; o.hs.add(e[E_MA]); }); return Object.values(g).sort((a, b) => b.n - a.n); };
    const gl = grp(tru).slice(0, 5), gk = grp(cong).slice(0, 5);
    h += `<div class="v6g2">${card('Thi đua giữa các tổ', esc(P.nhan), toH)}
      ${card('Nội dung ghi nhận nhiều nhất', '', `<div class="v6sub2">Vi phạm</div>${gl.length ? hrows(gl.map(x => ({ l: x.k, s: x.hs.size + ' học sinh', v: x.n, lab: x.n + ' lượt', c: '#C0392B' }))) : '<p class="mut">Không có vi phạm.</p>'}
        <div class="v6sub2">Được tuyên dương</div>${gk.length ? hrows(gk.map(x => ({ l: x.k, s: x.hs.size + ' học sinh', v: x.n, lab: x.n + ' lượt', c: '#1E8449' }))) : '<p class="mut">Chưa có điểm cộng.</p>'}`)}</div>`;
    /* học sinh */
    const best = xl.slice().sort((a, b) => b.sc - a.sc || a.s.ten.localeCompare(b.s.ten, 'vi')).slice(0, 5);
    const worst = xl.filter(o => o.sc < 0).sort((a, b) => a.sc - b.sc).slice(0, 5);
    const srow = (o, c) => ({ ma: o.s.ma, l: o.s.ten, s: 'Tổ ' + o.s.to + ' · ' + o.x.ten, v: o.sc, lab: (o.sc > 0 ? '+' : '') + fmt(o.sc), c });
    h += `<div class="v6g2">${card('Học sinh tiêu biểu', 'điểm TB tuần cao nhất', hrows(best.map(o => srow(o, '#1E8449')), { rank: 1 }))}
      ${card('Cần quan tâm', 'điểm TB tuần thấp nhất', worst.length ? hrows(worst.map(o => srow(o, '#C0392B')), { rank: 1 }) : '<p class="mut">Không có học sinh nào bị điểm âm. Lớp giữ nề nếp rất tốt!</p>')}</div>`;
    return h;
  }

  /* ── học lực ── */
  const kyHT = P => P.ky === 'nam' ? 'cn' : 'hk' + (P.hk || hkNow());
  const kyHTL = P => P.ky === 'nam' ? 'cả năm' : 'học kì ' + ((P.hk || hkNow()) === 1 ? 'I' : 'II');
  function tbAll(ma, ky) {
    /* v6.3: điểm môn = TB môn (nếu đã dán từ phần mềm điểm) hoặc TB bài kiểm tra giữa / cuối kì */
    const k = HT.ketQua(ma, ky), v = HT.monKT ? HT.monList().filter(m => m.ht !== 'nx').map(m => HT.monKT(ma, m.ma, ky)).filter(x => x != null) : Object.values(k.mon).filter(x => typeof x === 'number');
    return { k, tb: v.length ? v.reduce((a, b) => a + b, 0) / v.length : null, n: v.length };
  }
  function viewHL(P) {
    if (!HT.d) return '<div class="v6empty">' + ic('book') + '<b>Đang tải điểm bộ môn…</b></div>';
    const ky = kyHT(P), L = activeStudents(), ms = HT.monList().filter(m => m.ht !== 'nx');
    const R = L.map(s => Object.assign({ s }, tbAll(s.ma, ky)));
    const cnt = [0, 0, 0, 0]; let chua = 0; R.forEach(r => r.k.muc == null ? chua++ : cnt[r.k.muc]++);
    const tbs = R.filter(r => r.tb != null).map(r => r.tb), avg = tbs.length ? tbs.reduce((a, b) => a + b, 0) / tbs.length : null;
    let h = P.ky === 'thang' ? `<div class="v6note">${ic('book')}<span>Điểm bộ môn được tổng kết theo học kì — đang hiện <b>${esc(kyHTL(P))}</b> (chứa ${esc(P.nhan.toLowerCase())}).</span></div>` : '';
    h += `<div class="v6kp">${kpi(fmt(avg, 2), 'Điểm TB các môn của lớp', esc(kyHTL(P)), '#0A5C64', 'tb')}${LV.slice(0, 3).map((l, i) => kpi(cnt[i], 'Học tập ' + l, fmt(pct(cnt[i], L.length), 0) + '% sĩ số', XC[i], i ? 'hs' : 'tot')).join('')}</div>`;
    if (!tbs.length) return h + `<div class="v6empty">${ic('book')}<b>Chưa có điểm ${esc(kyHTL(P))}</b><span>Nhập ở Cập nhật ▸ Điểm bộ môn (nhập tay hoặc từ file Excel).</span></div>`;
    const mon = ms.map(m => { const v = L.map(s => { const k = HT.monKT ? HT.monKT(s.ma, m.ma, ky) : HT.ketQua(s.ma, ky).mon[m.ma]; return typeof k === 'number' ? k : null; }).filter(x => x != null); return { m, v, a: v.length ? v.reduce((x, y) => x + y, 0) / v.length : null }; }).filter(x => x.a != null).sort((a, b) => b.a - a.a);
    const colr = a => a >= 8 ? '#1E8449' : a >= 6.5 ? '#1F618D' : a >= 5 ? '#B9761C' : '#C0392B';
    const bins = [['< 5', 0, 5], ['5 – 6,5', 5, 6.5], ['6,5 – 8', 6.5, 8], ['8 – 9', 8, 9], ['≥ 9', 9, 11]].map(([l, a, b]) => ({ l, n: tbs.filter(x => x >= a - 1e-9 && x < b - 1e-9).length, c: colr(a + .01) }));
    const bm = Math.max(1, ...bins.map(b => b.n));
    const hist = `<div class="v6hist">${bins.map(b => `<div><b>${b.n}</b><i style="height:${(b.n / bm * 100).toFixed(0)}%;background:${b.c}"></i><span>${b.l}</span></div>`).join('')}</div>`;
    h += `<div class="v6g2">${card('Kết quả học tập', esc(kyHTL(P)) + (chua ? ' · ' + chua + ' em chưa đủ điểm' : ''), `<div class="v6dnw">${donut(LV.map((l, i) => ({ v: cnt[i], c: XC[i] })), 132, fmt(avg, 1), 'điểm TB lớp')}<div style="flex:1;min-width:0">${stack(LV.map((l, i) => ({ l, v: cnt[i], c: XC[i] })))}</div></div>`)}
      ${card('Phổ điểm trung bình', 'số học sinh theo khoảng điểm TB các môn', hist)}</div>`;
    h += card('Điểm trung bình từng môn', 'cả lớp · ' + esc(kyHTL(P)) + ' · bấm để xem Top của môn', hrows(mon.map(x => ({ l: x.m.ten, s: x.v.length + ' học sinh có điểm', v: x.a, lab: fmt(x.a, 2), c: colr(x.a), mon: x.m.ma })), { max: 10 }).replace(/<div class="r">/g, () => '<div class="r">'), 'v6mon');
    return h;
  }
  function viewTop(P) {
    if (!HT.d) return '<div class="v6empty">' + ic('star') + '<b>Đang tải điểm bộ môn…</b></div>';
    const ky = kyHT(P), L = activeStudents(), ms = HT.monList().filter(m => m.ht !== 'nx');
    if (TQ.mon !== '__tb' && !ms.some(m => m.ma === TQ.mon)) TQ.mon = '__tb';
    let h = `<div class="v6chips">${[['__tb', 'TB các môn']].concat(ms.map(m => [m.ma, m.ten])).map(([k, l]) => `<button data-tqmon="${esc(k)}" class="${TQ.mon === k ? 'on' : ''}">${esc(l)}</button>`).join('')}</div>`;
    const R = L.map(s => { if (TQ.mon === '__tb') { const t = tbAll(s.ma, ky); return { s, v: t.tb, k: t.k }; } const v = HT.monKT ? HT.monKT(s.ma, TQ.mon, ky) : HT.ketQua(s.ma, ky).mon[TQ.mon]; return { s, v: typeof v === 'number' ? v : null }; }).filter(r => r.v != null);
    const monL = TQ.mon === '__tb' ? 'Điểm TB các môn' : (HT.monOf(TQ.mon) || {}).ten;
    if (!R.length) return h + `<div class="v6empty">${ic('star')}<b>Chưa có điểm ${esc(monL)} · ${esc(kyHTL(P))}</b></div>`;
    R.sort((a, b) => b.v - a.v || a.s.ten.localeCompare(b.s.ten, 'vi'));
    const top = R.slice(0, 10), low = R.filter(r => r.v < 6.5).slice(-5).reverse();
    const pod = top.slice(0, 3);
    const podH = `<div class="v6pod">${[1, 0, 2].map(i => pod[i] ? `<div class="p p${i + 1}" data-ma="${esc(pod[i].s.ma)}"><span class="av">${esc(initials(pod[i].s.ten))}</span><b>${esc(pod[i].s.ten)}</b><span class="sc">${fmt(pod[i].v, 2)}</span><i>${i + 1}</i></div>` : '').join('')}</div>`;
    h += `<div class="v6g2">${card('Top 10 · ' + esc(monL), esc(kyHTL(P)), podH + hrows(top.map(r => ({ ma: r.s.ma, l: r.s.ten, s: 'Tổ ' + r.s.to + (r.k && r.k.muc != null ? ' · Học tập ' + LV[r.k.muc] : ''), v: r.v, lab: fmt(r.v, 2), c: '#1E8449' })), { rank: 1, max: 10 }))}
      ${card('Cần hỗ trợ thêm', esc(monL) + ' dưới 6,5', low.length ? hrows(low.map(r => ({ ma: r.s.ma, l: r.s.ten, s: 'Tổ ' + r.s.to, v: r.v, lab: fmt(r.v, 2), c: r.v < 5 ? '#C0392B' : '#B9761C' })), { max: 10 }) : '<p class="mut">Không có học sinh nào dưới 6,5. Rất tốt!</p>')}</div>`;
    return h;
  }

  TQ.render = function () {
    const box = $('#vTQ'); if (!box || S.view !== 'tq' || !S.cfg) return;
    const T = tabs(); if (!T.some(t => t[0] === TQ.tab)) TQ.tab = 'td';
    const P = period();
    let head = `<div class="v6hd"><div class="v6seg" role="tablist">${T.map(([k, l, i]) => `<button data-tqt="${k}" class="${TQ.tab === k ? 'on' : ''}">${ic(i)}<span>${l}</span></button>`).join('')}</div>
      <div class="v6per"><div class="v6seg sm">${[['thang', 'Tháng'], ['hk', 'Học kỳ'], ['nam', 'Năm học']].map(([k, l]) => `<button data-tqky="${k}" class="${TQ.ky === k ? 'on' : ''}">${l}</button>`).join('')}</div>
      ${TQ.ky === 'thang' ? `<select id="tqM" class="v6sel" aria-label="Chọn tháng">${MONTHS_YEAR.map(m => `<option value="${m}"${m === S.thang ? ' selected' : ''}>${esc(thangLabel(m, true))}</option>`).join('')}</select>` : ''}
      ${TQ.ky === 'hk' ? `<select id="tqH" class="v6sel" aria-label="Chọn học kỳ"><option value="1"${P.hk === 1 ? ' selected' : ''}>Học kỳ I</option><option value="2"${P.hk === 2 ? ' selected' : ''}>Học kỳ II</option></select>` : ''}
      <span class="v6live" id="tqLive">${ic('live')}Trực tiếp</span><button class="v6btn" id="tqPdf">${ic('pdf')}<span>Tải PDF</span></button></div></div>`;
    let body = '';
    if ((TQ.tab === 'td') && needYear(P)) {
      body = '<div class="v6empty">' + ic('tk') + '<b>Đang tải dữ liệu ' + esc(P.nhan.toLowerCase()) + '…</b></div>';
      if (!TQ.loadingY) { TQ.loadingY = true; loadAllMonths().catch(() => {}).finally(() => { TQ.loadingY = false; TQ.render(); }); }
    } else if (TQ.tab !== 'td' && !HT.d) {
      body = '<div class="v6empty">' + ic('book') + '<b>Đang tải điểm bộ môn…</b></div>';
      if (!TQ.loadingH) { TQ.loadingH = true; Promise.resolve(HT.load()).catch(() => {}).finally(() => { TQ.loadingH = false; TQ.render(); }); }
    } else body = TQ.tab === 'td' ? viewTD(P) : TQ.tab === 'hl' ? viewHL(P) : viewTop(P);
    const ttl = { td: 'Thi đua · nề nếp', hl: 'Học lực', top: 'Top điểm' }[TQ.tab];
    box.innerHTML = head + `<div class="v6body" id="tqBody"><div class="v6cap"><b>Lớp ${esc(S.cfg.lop || '11D3')} · ${esc(ttl)}</b><span>${esc(TQ.tab === 'td' ? P.nhan : kyHTL(P).replace(/^./, c => c.toUpperCase()))} · cập nhật ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span></div>${body}</div>`;
    box.querySelectorAll('[data-tqt]').forEach(b => b.onclick = () => { TQ.tab = b.dataset.tqt; TQ.render(); });
    box.querySelectorAll('[data-tqky]').forEach(b => b.onclick = () => { TQ.ky = b.dataset.tqky; TQ.render(); });
    const sm = box.querySelector('#tqM'); if (sm) sm.onchange = async () => { S.thang = +sm.value; try { await loadMonths([S.thang]); } catch (e) { err(e); } renderAll(); };
    const sh = box.querySelector('#tqH'); if (sh) sh.onchange = () => { TQ.hk = +sh.value; TQ.render(); };
    box.querySelectorAll('[data-tqmon]').forEach(b => b.onclick = () => { TQ.mon = b.dataset.tqmon; TQ.render(); });
    box.querySelectorAll('.v6mon .r').forEach((r, i) => { r.style.cursor = 'pointer'; r.onclick = () => { const ms = [...box.querySelectorAll('.v6mon .r .k')][i]; const m = HT.monList().find(x => ms && ms.firstChild && x.ten === ms.firstChild.textContent); if (m) { TQ.mon = m.ma; TQ.tab = 'top'; TQ.render(); } }; });
    box.querySelectorAll('[data-ma]').forEach(r => { r.style.cursor = 'pointer'; r.onclick = () => window.openProfile && openProfile(r.dataset.ma); });
    box.querySelectorAll('[data-tqk]').forEach(k => { const t = k.dataset.tqk; if (t === 'cong' || t === 'tru') { k.style.cursor = 'pointer'; k.onclick = () => { go('ls'); }; } });
    box.querySelector('#tqPdf').onclick = TQ.pdf;
    liveDot();
  };
  function liveDot() { const l = $('#tqLive'), b = $('#v32live'); if (!l) return; const off = b && /off|sync/.test(b.className); l.classList.toggle('off', !!off); }
  setInterval(liveDot, 5000);

  TQ.pdf = function () {
    const b = $('#tqBody'); if (!b || !window.DL) return;
    const c = b.cloneNode(true); c.querySelectorAll('.v6chips button:not(.on)').forEach(x => x.remove());
    const head = `<div class="v6ph"><img src="img/logo-yenhoa.webp" width="58" height="58" alt=""><div><div class="sc">TRƯỜNG THPT YÊN HÒA</div><div class="t">BÁO CÁO TỔNG QUAN LỚP ${esc((S.cfg.lop || '11D3').toUpperCase())}</div><div class="s">Năm học ${esc(S.cfg.namHoc || '')} · Xuất ngày ${new Date().toLocaleDateString('vi-VN')} từ Sổ theo dõi học sinh</div></div></div>`;
    const css = (document.getElementById('v6-css') || {}).textContent || '';
    const name = ('Tong-quan-' + (S.cfg.lop || '11D3') + '-' + ({ td: 'Thi-dua', hl: 'Hoc-luc', top: 'Top-diem' }[TQ.tab]) + '-' + period().short).replace(/\s+/g, '');
    DL.pdfHtml(head + c.innerHTML, name, { css: css + '.v6c{break-inside:avoid;box-shadow:none}.v6g2{grid-template-columns:1fr 1fr}.v6kp{grid-template-columns:repeat(4,1fr)}body{padding:26px 28px}' });
  };

  /* ════════ 4. ĐĂNG NHẬP GỌN ════════ */
  let NAMHOC = '2026 – 2027';
  try { const c = JSON.parse(localStorage.getItem('hk_cache_v4') || 'null'); if (c && c.cfg && c.cfg.namHoc) NAMHOC = String(c.cfg.namHoc).replace(/\s*-\s*/, ' – '); } catch (_) {}
  if (typeof lgShell === 'function') {
    window.lgShell = lgShell = function (inner) {
      const w = $('#login .lgwrap'); if (!w) return;
      w.classList.add('lg6');
      w.innerHTML = `<div class="lg6h"><img class="lg6logo" src="img/logo-yenhoa.webp" alt="Logo Trường THPT Yên Hòa" width="104" height="104">
        <h1 class="lg6s">THPT YÊN HÒA</h1><div class="lg6a">Sổ theo dõi học sinh · Năm học ${esc(NAMHOC)}</div></div>
        <div class="lgcard">${inner}<div class="lgerr" id="lgErr3"></div></div>
        <a class="lgph" href="phu-huynh.html"><span class="i">${ic('ph')}</span><span><b>Cha mẹ học sinh xem sổ</b><span>Không cần đăng nhập · xem và tải báo cáo của con</span></span><span class="ar">›</span></a>
        <div class="lgdocs"><a href="docs/HDSD_Day_du.pdf" target="_blank" rel="noopener">Hướng dẫn sử dụng</a></div>
        <div class="err" id="lgErr"></div>`;
    };
    if (window.LG && LG.step === 'email' && $('#login') && !$('#login').classList.contains('hide')) { try { lgEmail(); } catch (_) {} }
  }

  /* ════════ 5. HƯỚNG DẪN TỪNG BƯỚC (bố cục mới) ════════ */
  const nv = v => [`#railNav [data-v="${v}"]`, `#v6sub [data-v6="${v}"]`, `#tabbar [data-g="${(groupOf(v) || {}).k}"]`];
  if (typeof TOURS === 'object') {
    TOURS.gvcn = () => [
      { t: 'Chào cô Thảo! Đây là Sổ theo dõi học sinh lớp ' + esc(S.cfg.lop || '11D3'), d: 'Hướng dẫn nhanh khoảng 1 phút. Bấm <b>Tiếp</b> (hoặc phím →) để đi từng bước, <b>Bỏ qua</b> nếu đã quen.', pre: () => { closePanel(); go('tq'); } },
      { el: '#vTQ .v6seg', t: 'Tổng quan', d: 'Ba góc nhìn: <b>Thi đua · nề nếp</b>, <b>Học lực</b>, <b>Top điểm</b> theo môn hoặc điểm TB các môn.' },
      { el: '#vTQ .v6per', t: 'Chọn kỳ & tải PDF', d: 'Xem theo <b>tháng</b>, <b>học kỳ</b> hay <b>cả năm học</b>. Số liệu tự cập nhật khi cán bộ lớp vừa ghi; bấm <b>Tải PDF</b> để lưu báo cáo.' },
      { el: nv('ghi'), t: 'Cập nhật ▸ Theo dõi nề nếp', d: 'Chạm tên học sinh ▸ chọn lỗi hoặc nội dung được khen ▸ <b>Lưu</b>. Cán bộ lớp ghi cả lớp; điểm hiện ngay trên mọi máy.', pre: () => go('tq') },
      { el: nv('ht'), t: 'Cập nhật ▸ Điểm bộ môn', d: 'Bảng điểm từng môn, nhập tay hoặc <b>nhập từ Excel</b>; giáo viên bộ môn tự nhập môn mình dạy.' },
      { el: nv('bang'), t: 'Báo cáo & sổ', d: '<b>Kết quả rèn luyện</b>, <b>Báo cáo thi đua</b>, <b>Sổ công tác chủ nhiệm</b> (xuất Word theo biểu mẫu), <b>Nhật ký theo dõi</b>.' },
      { el: nv('cai'), t: 'Quản lý', d: 'Cha mẹ học sinh nhận thông báo qua email; Cài đặt: danh sách lớp, tài khoản cán bộ lớp, danh mục điểm, giao diện.' },
      { el: '#hFind', t: 'Tra cứu nhanh', d: 'Bấm kính lúp (phím <b>/</b>) ▸ gõ tên không cần dấu ▸ mở hồ sơ cả năm của học sinh.' },
      { el: '#hHelp', t: 'Xem lại hướng dẫn', d: 'Bấm nút <b>?</b> bất cứ lúc nào. Chúc cô một năm học nhẹ nhàng!' }];
    TOURS.cb = () => [
      { t: 'Cô Thảo chào em!', d: 'Cô hướng dẫn nhanh cho <b>cán bộ lớp</b> nhé. Em bấm <b>Tiếp</b> để đi từng bước.', pre: () => { closePanel(); go('ghi'); } },
      { el: '#periodBar', t: 'Chọn đúng tuần', d: 'Điểm ghi vào <b>tháng + tuần</b> đang chọn. Em kiểm tra tuần trước khi ghi nhé.' },
      { el: '#toFilter', t: 'Lọc theo tổ', d: 'Cán bộ lớp ghi được cho <b>cả lớp</b>. Bấm Tổ 1–4 để tìm bạn nhanh hơn.' },
      { el: firstRow(), t: 'Ghi nề nếp', d: 'Chạm tên bạn ▸ <b>Trừ điểm</b> / <b>Cộng điểm</b> ▸ chạm nội dung ▸ ghi rõ lý do, chụp ảnh bằng chứng nếu cần ▸ <b>Lưu</b>.' },
      { el: '#multiBtn', t: 'Ghi cho nhiều bạn', d: '<b>Chọn nhiều</b> ▸ tick các bạn ▸ <b>Ghi điểm</b>. Lỡ tay thì bấm <b>Hoàn tác</b>.' },
      { el: nv('tq'), t: 'Tổng quan', d: 'Xem thi đua của lớp, của từng tổ theo tháng, học kỳ, năm học.' },
      { el: '#hHelp', t: 'Cần xem lại?', d: 'Nút <b>?</b> mở lại hướng dẫn này bất cứ lúc nào. Cô cảm ơn em!' }];
  }

  /* ════════ 6. CSS ════════ */
  const css = document.createElement('style'); css.id = 'v6-css';
  css.textContent = `
#helpBar{display:none!important}
#railNav .v6gh{font-size:10.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--mute,#8AA6AD);padding:14px 14px 4px}
#railNav .v6gh:first-child{padding-top:4px}
#railNav button{min-height:40px;font-size:14px}
#tabbar.v6one{display:none}
#v6sub{display:none}
@media (max-width:760px){
  #v6sub{display:flex;gap:6px;padding:0 12px 8px;overflow-x:auto;scrollbar-width:none}#v6sub::-webkit-scrollbar{display:none}
  #v6sub.hide{display:none}
  #v6sub button{display:flex;align-items:center;gap:6px;flex:none;border:1px solid var(--line,#DEEAEC);background:#fff;color:var(--sub,#5C7A83);border-radius:99px;padding:7px 13px;font:inherit;font-size:13.5px;font-weight:700}
  #v6sub button .ic{width:16px;height:16px}
  #v6sub button.on{background:var(--teal,#0E7C86);border-color:var(--teal,#0E7C86);color:#fff}
  #tabbar button{font-size:11.5px}
}
/* Tổng quan */
#vTQ{padding:4px 0 28px}
.v6hd{display:flex;flex-wrap:wrap;gap:10px 14px;align-items:center;justify-content:space-between;margin:2px 0 14px}
.v6seg{display:inline-flex;background:#fff;border:1px solid var(--line,#DEEAEC);border-radius:12px;padding:3px;gap:2px}
.v6seg button{display:flex;align-items:center;gap:7px;border:0;background:none;font:inherit;font-size:14px;font-weight:700;color:var(--sub,#5C7A83);padding:8px 14px;border-radius:9px;cursor:pointer;white-space:nowrap}
.v6seg button .ic{width:17px;height:17px}
.v6seg button.on{background:var(--pale,#E6F3F4);color:var(--teal-d,#0A5C64)}
.v6seg.sm button{padding:6px 11px;font-size:13px}
.v6per{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.v6sel{font:inherit;font-size:13.5px;font-weight:700;color:var(--ink,#1B333A);border:1px solid var(--line,#DEEAEC);background:#fff;border-radius:10px;padding:7px 10px;height:36px}
.v6btn{display:inline-flex;align-items:center;gap:6px;font:inherit;font-size:13.5px;font-weight:700;border:0;background:var(--teal,#0E7C86);color:#fff;border-radius:10px;padding:0 14px;height:36px;cursor:pointer}
.v6btn .ic{width:17px;height:17px}
.v6live{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;color:#1E8449;background:#E5F5EB;border-radius:99px;padding:5px 10px}
.v6live .ic{width:14px;height:14px}.v6live.off{color:#8AA6AD;background:#F0F5F6}
.v6cap{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px;margin:0 2px 12px}
.v6cap b{font-size:17px;color:var(--teal-d,#0A5C64)}.v6cap span{font-size:13px;color:var(--sub,#5C7A83)}
.v6kp{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:12px}
.v6k{background:#fff;border:1px solid var(--line,#DEEAEC);border-radius:14px;padding:14px 16px;display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto auto;column-gap:12px;align-items:center}
.v6k .i{grid-row:1/4;width:42px;height:42px;border-radius:12px;display:grid;place-items:center}.v6k .i .ic{width:22px;height:22px}
.v6k b{font-size:26px;line-height:1.1;font-weight:800}.v6k .l{font-size:13px;font-weight:700;color:var(--ink,#1B333A)}.v6k small{font-size:12px;color:var(--sub,#5C7A83)}
.v6g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
.v6c{background:#fff;border:1px solid var(--line,#DEEAEC);border-radius:14px;padding:14px 16px 16px;min-width:0;margin-bottom:12px}
.v6g2 .v6c{margin-bottom:0}
.v6ch3{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin-bottom:10px}.v6ch3 h3{margin:0;font-size:15px;color:var(--ink,#1B333A)}.v6ch3 span{font-size:12.5px;color:var(--sub,#5C7A83)}
.v6ch{width:100%;height:auto;display:block}
.v6dnw{display:flex;gap:16px;align-items:center}.v6dn{flex:none}
.v6stk{display:flex;height:26px;border-radius:8px;overflow:hidden;background:#EEF3F4}.v6stk i{display:grid;place-items:center;color:#fff;font-size:12px;font-weight:800;font-style:normal}
.v6lg{display:flex;flex-wrap:wrap;gap:6px 14px;margin-top:10px;font-size:13px;color:var(--ink,#1B333A)}.v6lg span{display:inline-flex;align-items:center;gap:6px}
.v6lg i{width:10px;height:10px;border-radius:3px;display:inline-block}.v6lg small{color:var(--sub,#5C7A83)}.v6lg.sm{font-size:12px;margin-top:6px}.v6lg .mut{color:var(--mute,#8AA6AD)}
.v6hr .r{display:grid;grid-template-columns:auto minmax(0,1.3fr) minmax(60px,1fr) auto;gap:10px;align-items:center;padding:7px 4px;border-radius:9px}
.v6hr .r:hover{background:var(--paler,#F5FAFB)}
.v6hr .r:not(:has(.rk)){grid-template-columns:minmax(0,1.3fr) minmax(60px,1fr) auto}
.v6hr .k{font-size:14px;font-weight:700;color:var(--ink,#1B333A);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.v6hr .k small{display:block;font-size:12px;font-weight:500;color:var(--sub,#5C7A83);overflow:hidden;text-overflow:ellipsis}
.v6hr .t{height:9px;background:#EEF3F4;border-radius:99px;overflow:hidden}.v6hr .t i{display:block;height:100%;border-radius:99px}
.v6hr .v{font-size:14px;font-weight:800;text-align:right;min-width:52px}
.rk{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:800;background:#EEF3F4;color:#5C7A83}
.rk1{background:#F4C542;color:#5A4300}.rk2{background:#C9D3D8;color:#33454C}.rk3{background:#E3A16B;color:#4A2A10}
.v6sub2{font-size:11.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mute,#8AA6AD);margin:4px 4px 2px}
.v6sub2:not(:first-of-type){margin-top:12px}
.v6to .r{display:grid;grid-template-columns:auto minmax(0,1fr) minmax(150px,1.3fr);gap:10px;align-items:center;padding:8px 4px;border-bottom:1px solid #F0F5F6}
.v6to .k{font-weight:800;font-size:14px}.v6to .k small{display:block;font-weight:500;font-size:12px;color:var(--sub,#5C7A83)}
.v6to .bf{display:grid;grid-template-columns:1fr 1fr;gap:4px}
.v6to .bf .l{display:flex;justify-content:flex-end;align-items:center;gap:5px}.v6to .bf .r2{display:flex;align-items:center;gap:5px}
.v6to .bf i{display:block;height:12px;border-radius:4px}.v6to .bf .l i{background:#C0392B}.v6to .bf .r2 i{background:#1E8449}
.v6to .bf b{font-size:12.5px;min-width:14px}.v6to .bf .l b{color:#C0392B}.v6to .bf .r2 b{color:#1E8449}
.v6hist{display:flex;gap:10px;align-items:flex-end;height:170px;padding:6px 4px 0}
.v6hist div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:4px}
.v6hist i{display:block;width:70%;max-width:56px;border-radius:7px 7px 3px 3px;min-height:3px}.v6hist b{font-size:14px}.v6hist span{font-size:12px;color:var(--sub,#5C7A83);white-space:nowrap}
.v6chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
.v6chips button{font:inherit;font-size:13px;font-weight:700;border:1px solid var(--line,#DEEAEC);background:#fff;color:var(--sub,#5C7A83);border-radius:99px;padding:6px 12px;cursor:pointer}
.v6chips button.on{background:var(--teal,#0E7C86);border-color:var(--teal,#0E7C86);color:#fff}
.v6pod{display:flex;justify-content:center;align-items:flex-end;gap:10px;margin:2px 0 12px}
.v6pod .p{flex:1;max-width:150px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:3px;position:relative;padding:10px 6px 12px;border-radius:12px;background:var(--paler,#F5FAFB);border:1px solid var(--line2,#EDF4F5)}
.v6pod .p1{padding-top:18px;background:#FFF9E6;border-color:#F4E3A6}
.v6pod .av{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-weight:800;color:#fff;background:var(--teal,#0E7C86)}
.v6pod .p1 .av{width:52px;height:52px;background:#C79A16}
.v6pod b{font-size:13px;line-height:1.25}.v6pod .sc{font-size:18px;font-weight:800;color:#1E8449}
.v6pod i{position:absolute;top:-10px;left:50%;transform:translateX(-50%);width:22px;height:22px;border-radius:50%;font-style:normal;font-size:12px;font-weight:800;display:grid;place-items:center;background:#C9D3D8;color:#33454C}
.v6pod .p1 i{background:#F4C542;color:#5A4300}.v6pod .p3 i{background:#E3A16B;color:#4A2A10}
.v6note{display:flex;gap:8px;align-items:center;font-size:13px;color:var(--teal-d,#0A5C64);background:var(--pale,#E6F3F4);border-radius:10px;padding:9px 12px;margin-bottom:12px}.v6note .ic{width:18px;height:18px;flex:none}
.v6empty{background:#fff;border:1px dashed var(--line,#DEEAEC);border-radius:14px;padding:30px 16px;text-align:center;color:var(--sub,#5C7A83);display:flex;flex-direction:column;align-items:center;gap:6px}
.v6empty .ic{width:30px;height:30px;color:var(--teal-l,#6FBEC5)}.v6empty b{color:var(--ink,#1B333A);font-size:15px}.v6empty span{font-size:13px}
.mut{color:var(--mute,#8AA6AD);font-size:13px}
.v6ph{display:flex;gap:14px;align-items:center;border-bottom:2px solid #0E7C86;padding-bottom:10px;margin-bottom:14px}
.v6ph .sc{font-size:10pt;font-weight:700;color:#0A5C64;letter-spacing:.04em}.v6ph .t{font-size:16pt;font-weight:800;color:#16323A}.v6ph .s{font-size:9pt;color:#5C7A83}
@media (max-width:1100px){ .v6kp{grid-template-columns:repeat(2,1fr)} }
@media (max-width:900px){ .v6g2{grid-template-columns:1fr} }
@media (max-width:760px){
  .v6hd{flex-direction:column;align-items:stretch;gap:8px}
  .v6seg{display:flex;overflow-x:auto;scrollbar-width:none}.v6seg button{flex:1;justify-content:center;padding:8px 8px;font-size:13px}
  .v6per{justify-content:space-between}.v6per .v6seg{flex:1 1 100%}
  .v6sel{flex:1}.v6btn span{display:none}.v6btn{padding:0 11px}
  .v6kp{gap:8px}.v6k{padding:11px 12px;column-gap:9px}.v6k .i{width:34px;height:34px;border-radius:10px}.v6k b{font-size:21px}.v6k .l{font-size:12px}.v6k small{font-size:11px}
  .v6c{padding:12px 12px 14px}.v6dnw{flex-direction:column;align-items:stretch}.v6dn{align-self:center}
  .v6to .r{grid-template-columns:auto minmax(0,1fr) 120px}
}
/* Đăng nhập gọn */
#login .lg6{max-width:440px}
#login .lg6 .lg6h{text-align:center;margin:0 0 18px}
#login .lg6 .lg6logo{width:104px;height:104px;border-radius:50%;background:#fff;box-shadow:0 6px 22px rgba(20,40,80,.14);display:block;margin:0 auto 14px}
#login .lg6 .lg6k{font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--sub,#5C7A83)}
#login .lg6 .lg6s{margin:2px 0 8px;font-size:42px;white-space:nowrap;line-height:1.05;font-weight:800;letter-spacing:.02em;color:var(--teal-d,#0A5C64)}
#login .lg6 .lg6a{font-size:14.5px;color:var(--sub,#5C7A83)}
#login .lg6 .lgcard{box-shadow:0 2px 14px rgba(27,51,58,.06)}
#login .lg6 .lgph{margin-top:12px}
#login .lg6 .lgph .i .ic{width:20px;height:20px}
#login .lg6 .lgdocs{margin-top:14px}
#login .emtip{display:none!important}
@media (max-width:420px){ #login .lg6 .lg6s{font-size:34px} #login .lg6 .lg6logo{width:88px;height:88px} }
`;
  document.head.appendChild(css);
})();
