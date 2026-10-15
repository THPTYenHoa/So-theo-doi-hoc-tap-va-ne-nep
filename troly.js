/* v6.5 — TRỢ LÝ AI (window.TL): khung chat hỏi đáp về dữ liệu của sổ. Backend: aiChat (AiTroLy.gs, yenhoa-backend — Gemini hoặc Claude).
   · Chỉ GVCN. Nút tròn góc phải dưới (#tl-fab), menu avatar, Ctrl/⌘ + J.
   · Mỗi câu hỏi kèm DỮ LIỆU CỦA SỔ do app đọc ra (duLieu): lớp, tháng, tổ, từng học sinh (điểm tuần / tháng, xếp loại, lỗi / được cộng theo danh mục,
     điểm giữa kì / cuối kì, kỳ thi) — ĐÃ ẨN DANH: học sinh mang mã tạm E01, E02… theo thứ tự danh sách; tên trong câu hỏi / lịch sử cũng được đổi
     sang mã trước khi gửi (anDanh), câu trả lời đổi mã về tên + bấm được để mở hồ sơ (hienTen). Không gửi họ tên, mã HS, email, ghi chú tự do.
   · Lịch sử trò chuyện lưu trên máy: localStorage.hk_tl_v1 (tối đa 30 lượt). */
(function () {
  if (window.TL) return;
  const LS = 'hk_tl_v1';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const r1 = x => Math.round(x * 10) / 10;
  const BOT = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="5" y="9" width="22" height="17" rx="7" fill="#fff" fill-opacity=".18" stroke="currentColor" stroke-width="2"/><circle cx="12.5" cy="17.5" r="2" fill="currentColor"/><circle cx="19.5" cy="17.5" r="2" fill="currentColor"/><path d="M13 22c1.8 1.2 4.2 1.2 6 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16 9V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 1.8l.9 2.3 2.3.9-2.3.9L16 8.2l-.9-2.3-2.3-.9 2.3-.9z" fill="currentColor"/><path d="M26.5 3.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" fill="currentColor"/></svg>';
  const SEND = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12 20 4l-4 16-4-7z"/><path d="m12 13 8-9"/></svg>';
  const GOIY = [
    ['Nề nếp', ['Tháng này những em nào cần quan tâm nhất?', 'So sánh thi đua giữa các tổ tháng này', 'Lỗi vi phạm nào tăng so với tháng trước?', 'Em nào tiến bộ nhiều nhất?']],
    ['Học tập', ['Em nào có điểm giữa kì dưới 5?', 'Tóm tắt kết quả các kỳ thi gần đây']],
    ['Soạn giúp cô', ['Soạn tin nhắn Zalo tổng kết tuần cho nhóm cha mẹ', 'Gợi ý kế hoạch chủ nhiệm tuần tới']]
  ];

  const css = document.createElement('style'); css.id = 'tl-css';
  css.textContent = `
#tl-fab{position:fixed;right:20px;bottom:70px;z-index:880;width:58px;height:58px;border-radius:50%;border:0;cursor:pointer;color:#fff;background:var(--teal);
  box-shadow:0 8px 22px rgba(0,40,60,.28);display:grid;place-items:center;transition:transform .15s}
#tl-fab:hover{transform:scale(1.06)}#tl-fab svg{width:32px;height:32px}
#tl-fab .lb{position:absolute;right:66px;white-space:nowrap;background:#fff;color:var(--teal-d,var(--teal));font:800 13px/1 inherit;padding:8px 11px;border-radius:999px;box-shadow:0 3px 12px rgba(0,0,0,.12);opacity:0;pointer-events:none;transition:opacity .15s}
#tl-fab:hover .lb{opacity:1}
body.tl-open #tl-fab{display:none}
#tl-top{display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 13px 0 9px;border-radius:12px;border:1.5px solid var(--teal);background:#fff;color:var(--teal-d,var(--teal));font:800 13.5px/1 inherit;cursor:pointer;margin-right:4px;white-space:nowrap}
#tl-top svg{width:24px;height:24px}#tl-top:hover{background:var(--paler,#F4FAFB)}
@media (max-width:760px){#tl-top span{display:none}#tl-top{padding:0 6px;height:36px}}
@media (max-width:760px){#tl-fab{bottom:84px;right:14px;width:52px;height:52px}#tl-fab svg{width:28px;height:28px}}
#tl{position:fixed;z-index:900;right:16px;bottom:16px;width:420px;max-width:calc(100vw - 32px);height:min(680px,calc(100vh - 32px));display:none;flex-direction:column;
  background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 18px 50px rgba(0,30,50,.25);overflow:hidden}
body.tl-open #tl{display:flex}
@media (min-width:761px){body:has(#dm) #tl{bottom:58px;height:min(660px,calc(100vh - 90px))}}
@media (max-width:760px){#tl{inset:0;width:auto;max-width:none;height:auto;border-radius:0}}
#tl .hd{display:flex;align-items:center;gap:10px;padding:12px 12px 12px 14px;background:var(--teal);color:#fff}
#tl .av{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.16);display:grid;place-items:center;flex:none}#tl .av svg{width:28px;height:28px}
#tl .hd .t{flex:1;min-width:0}#tl .hd b{display:block;font-size:16px}#tl .hd small{display:block;font-size:12px;opacity:.85}
#tl .hd button{width:34px;height:34px;border-radius:10px;border:0;background:rgba(255,255,255,.14);color:#fff;cursor:pointer;font-size:18px;display:grid;place-items:center}
#tl .hd button:hover{background:rgba(255,255,255,.26)}
#tl .bd{flex:1;overflow-y:auto;padding:14px 14px 6px;background:var(--paler,#F4FAFB);scroll-behavior:smooth}
#tl .m{display:flex;gap:8px;margin:0 0 12px;align-items:flex-end}
#tl .m .mav{width:28px;height:28px;border-radius:50%;background:var(--teal);color:#fff;display:grid;place-items:center;flex:none}#tl .m .mav svg{width:20px;height:20px}
#tl .bb{max-width:84%;padding:9px 12px;border-radius:14px;font-size:14px;line-height:1.55;background:#fff;border:1px solid var(--line);color:var(--ink,#1B333A);word-wrap:break-word}
#tl .m.u{justify-content:flex-end}#tl .m.u .bb{background:var(--teal);color:#fff;border-color:transparent;border-bottom-right-radius:4px}
#tl .m.a .bb{border-bottom-left-radius:4px}
#tl .bb p{margin:0 0 6px}#tl .bb p:last-child{margin:0}#tl .bb ul,#tl .bb ol{margin:2px 0 6px 18px;padding:0}#tl .bb li{margin:1px 0}
#tl .bb .tl-hs{color:var(--teal-d,var(--teal));font-weight:800;text-decoration:none;border-bottom:1px dashed currentColor;cursor:pointer}
#tl .bb .tools{display:flex;gap:6px;margin-top:6px}#tl .bb .tools button{border:1px solid var(--line);background:#fff;border-radius:8px;font-size:11.5px;font-weight:700;color:var(--sub);padding:3px 8px;cursor:pointer}
#tl .bb.err{background:#FDEDEC;border-color:#F5B7B1;color:#922B21}
#tl .dots span{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--teal);margin-right:3px;animation:tlb 1s infinite}
#tl .dots span:nth-child(2){animation-delay:.15s}#tl .dots span:nth-child(3){animation-delay:.3s}
@keyframes tlb{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
#tl .gy{margin:4px 0 10px 36px}#tl .gy h6{margin:8px 0 5px;font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--sub)}
#tl .gy button{display:block;width:100%;text-align:left;margin:0 0 6px;padding:8px 11px;border-radius:11px;border:1.5px solid var(--line);background:#fff;font-size:13.5px;font-weight:600;color:var(--ink,#1B333A);cursor:pointer}
#tl .gy button:hover{border-color:var(--teal);color:var(--teal-d,var(--teal))}
#tl .ft{border-top:1px solid var(--line);padding:10px 12px 8px;background:#fff}
#tl .in{display:flex;gap:8px;align-items:flex-end}
#tl textarea{flex:1;resize:none;min-height:42px;max-height:120px;padding:10px 12px;border-radius:12px;border:1.5px solid var(--line);font:inherit;font-size:14px;line-height:1.4;outline:none}
#tl textarea:focus{border-color:var(--teal)}
#tl .snd{width:42px;height:42px;border-radius:12px;border:0;background:var(--teal);color:#fff;cursor:pointer;display:grid;place-items:center;flex:none}
#tl .snd[disabled]{opacity:.5;cursor:wait}
#tl .nt{font-size:11px;color:var(--sub);margin-top:6px;line-height:1.4}`;
  document.head.appendChild(css);

  const st = { hist: load(), busy: false, on: null };
  function load() { try { return JSON.parse(localStorage.getItem(LS) || '[]') || []; } catch (_) { return []; } }
  function save() { try { localStorage.setItem(LS, JSON.stringify(st.hist.slice(-30))); } catch (_) {} }

  /* ── ẩn danh: học sinh ⇄ mã tạm ── */
  const fold = s => Array.from(String(s || '')).map(c => c === 'đ' ? 'd' : c === 'Đ' ? 'D' : c.normalize('NFD').replace(/[̀-ͯ]/g, '')[0] || c).join('').toLowerCase();
  function bang() {
    const L = activeStudents(), ma2id = {}, id2s = {};
    L.forEach((s, i) => { const id = 'E' + String(i + 1).padStart(2, '0'); ma2id[s.ma] = id; id2s[id] = s; });
    /* tên để nhận ra trong câu hỏi: họ tên đầy đủ, "tên đệm + tên", tên riêng (chỉ khi không trùng trong lớp) */
    const cnt = {}, keys = [];
    L.forEach(s => { const w = String(s.ten || '').trim().split(/\s+/); [w.slice(-2).join(' '), w.slice(-1)[0]].forEach(k => { if (k) { k = fold(k); cnt[k] = (cnt[k] || 0) + 1; } }); });
    L.forEach(s => { const w = String(s.ten || '').trim().split(/\s+/); const ks = [fold(s.ten)];
      [w.slice(-2).join(' '), w.slice(-1)[0]].forEach(k => { k = fold(k); if (k && cnt[k] === 1 && ks.indexOf(k) < 0) ks.push(k); });
      ks.forEach(k => keys.push([k, ma2id[s.ma]])); });
    keys.sort((a, b) => b[0].length - a[0].length);
    return { ma2id, id2s, keys };
  }
  function anDanh(t, B) {
    t = String(t || ''); let f = fold(t), out = '', i = 0;
    const isW = c => /[a-z0-9]/.test(c || '');
    while (i < t.length) {
      let hit = null;
      if (!isW(f[i - 1])) for (const [k, id] of B.keys) if (f.startsWith(k, i) && !isW(f[i + k.length])) { hit = [k, id]; break; }
      if (hit) { out += hit[1]; i += hit[0].length; } else { out += t[i]; i++; }
    }
    return out;
  }
  function hienTen(t, B, html) {   /* E07 ⇒ tên (html: thẻ bấm được) */
    return String(t || '').replace(/\bE0*(\d{1,3})\b/g, (m, n) => {
      const s = B.id2s['E' + String(+n).padStart(2, '0')]; if (!s) return m;
      return html ? `<a class="tl-hs" data-ma="${esc(s.ma)}">${esc(s.ten)}</a>` : s.ten;
    });
  }

  /* ── dữ liệu của sổ (đã ẩn danh) ── */
  function gomLoi(E) {
    const m = {}; E.forEach(e => { const k = e[E_ND] || e[E_MUC]; m[k] = (m[k] || 0) + 1; });
    return Object.keys(m).sort((a, b) => m[b] - m[a]).slice(0, 6).map(k => k + '×' + m[k]).join('; ');
  }
  function duLieu(B) {
    const L = activeStudents(), th = MONTHS_YEAR.filter(m => S.entries.some(e => e[E_THANG] === m)), T = S.cfg.thresholds.map(t => t.ten);
    const now = new Date();
    const d = { lop: { siSo: L.length, soTo: new Set(L.map(s => s.to)).size, thangDangXem: S.thang, tuanDangXem: S.tuan, soTuanMoiThang: S.cfg.soTuan,
        homNay: now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear(), mucXepLoai: S.cfg.thresholds.map(t => t.ten + ' ≥ ' + t.san).join(' · '),
        soHSCoEmailChaMe: L.filter(s => s.email).length },
      thangCoDuLieu: th, tongHopThang: {}, hocSinh: [] };
    th.forEach(m => {
      const E = S.entries.filter(e => e[E_THANG] === m), xl = {}; T.forEach(t => xl[t] = 0);
      L.forEach(s => { const x = xlOf(s.ma, [m]); xl[T[x.i]] = (xl[T[x.i]] || 0) + 1; });
      d.tongHopThang[m] = { diemTBLop: r1(L.reduce((a, s) => a + monthAvg(s.ma, m), 0) / (L.length || 1)), luotViPham: E.filter(e => e[E_DIEM] < 0).length,
        luotDuocCong: E.filter(e => e[E_DIEM] > 0).length, xepLoai: xl, loiNhieuNhat: gomLoi(E.filter(e => e[E_DIEM] < 0)), duocCongNhieuNhat: gomLoi(E.filter(e => e[E_DIEM] > 0)),
        theoTo: Array.from(new Set(L.map(s => s.to))).sort().map(to => { const LT = L.filter(s => s.to === to), ET = E.filter(e => String(e[E_TO]) === String(to));
          return { to: to, siSo: LT.length, diemTB: r1(LT.reduce((a, s) => a + monthAvg(s.ma, m), 0) / (LT.length || 1)), viPham: ET.filter(e => e[E_DIEM] < 0).length, duocCong: ET.filter(e => e[E_DIEM] > 0).length }; }) };
    });
    let HTon = false; try { HTon = !!(window.HT && HT.d); } catch (_) {}
    const kts = HTon && HT.ktList ? HT.ktList() : [];
    L.forEach(s => {
      const o = { id: B.ma2id[s.ma], to: s.to, chucVu: s.chucVu && s.chucVu !== 'Học sinh' ? s.chucVu : '', chaMeNhanThu: !!s.email, theoThang: {} };
      th.forEach(m => { const E = S.entries.filter(e => e[E_MA] === s.ma && e[E_THANG] === m), x = xlOf(s.ma, [m]);
        o.theoThang[m] = { diemTB: r1(monthAvg(s.ma, m)), xepLoai: String(x.ten || '').replace(' ✓', ''), viPham: gomLoi(E.filter(e => e[E_DIEM] < 0)), duocCong: gomLoi(E.filter(e => e[E_DIEM] > 0)) }; });
      o.diemTuanThangDangXem = Array.from({ length: S.cfg.soTuan }, (_, i) => weekScore(s.ma, i + 1, S.thang));
      if (HTon) {
        try {
          const hk = typeof hkOf === 'function' ? hkOf(S.thang) : 1, dk = [];
          HT.monList().forEach(mn => { const g = HT.val(s.ma, mn.ma, hk, 'GK'), c = HT.val(s.ma, mn.ma, hk, 'CK'); if (g !== '' && g != null || c !== '' && c != null) dk.push(mn.ten + ': GK ' + (g === '' || g == null ? '–' : g) + ', CK ' + (c === '' || c == null ? '–' : c)); });
          if (dk.length) o.diemKiemTraHK = 'HK' + hk + ' — ' + dk.join('; ');
          const kt = kts.map(k => { const v = HT.ktDiem(s.ma, k); return v == null ? null : k.ten + ' = ' + v + '/' + k.thang; }).filter(Boolean);
          if (kt.length) o.kyThi = kt.join('; ');
        } catch (_) {}
      }
      d.hocSinh.push(o);
    });
    if (kts.length) d.kyThi = kts.slice(-8).map(k => { const v = L.map(s => HT.ktDiem(s.ma, k)).filter(z => z != null);
      return { tenKy: k.ten, mon: (HT.monOf(k.mon) || {}).ten || k.mon, ngay: k.ngay || '', thangDiem: k.thang, soHSDuThi: v.length, diemTB: v.length ? r1(v.reduce((a, b) => a + b, 0) / v.length) : null, cao: v.length ? Math.max(...v) : null }; });
    return d;
  }

  /* ── hiển thị ── */
  function md(t, B) {   /* markdown gọn: **đậm**, - gạch đầu dòng, 1. đánh số, ### tiêu đề */
    const lines = esc(t).split(/\n/); let h = '', list = '';
    const close = () => { if (list) { h += '</' + list + '>'; list = ''; } };
    lines.forEach(l => {
      let x = l.trim(), m;
      if ((m = x.match(/^[-*•]\s+(.*)/))) { if (list !== 'ul') { close(); h += '<ul>'; list = 'ul'; } h += '<li>' + m[1] + '</li>'; return; }
      if ((m = x.match(/^\d+[.)]\s+(.*)/))) { if (list !== 'ol') { close(); h += '<ol>'; list = 'ol'; } h += '<li>' + m[1] + '</li>'; return; }
      close(); if (!x) return;
      if ((m = x.match(/^#{1,4}\s+(.*)/))) x = '<b>' + m[1] + '</b>';
      h += '<p>' + x + '</p>';
    });
    close();
    h = h.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<i>$2</i>');
    return hienTen(h, B, true);
  }
  function el() {
    let o = document.getElementById('tl'); if (o) return o;
    o = document.createElement('div'); o.id = 'tl'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', 'Trợ lý AI');
    o.innerHTML = `<div class="hd"><div class="av">${BOT}</div><div class="t"><b>Trợ lý AI</b><small>Đọc dữ liệu của sổ · ẩn danh học sinh</small></div>
      <button type="button" class="nw" title="Cuộc trò chuyện mới">⟲</button><button type="button" class="x" title="Đóng (Esc)">×</button></div>
      <div class="bd"></div>
      <div class="ft"><div class="in"><textarea rows="1" placeholder="Hỏi về nề nếp, điểm số, thi đua của lớp…"></textarea><button type="button" class="snd" title="Gửi (Enter)">${SEND}</button></div>
      <div class="nt">Câu trả lời là gợi ý dựa trên số liệu của sổ — cô kiểm tra lại trước khi dùng. Tên học sinh được thay bằng mã trước khi gửi đi.</div></div>`;
    document.body.appendChild(o);
    const ta = o.querySelector('textarea');
    o.querySelector('.x').onclick = close;
    o.querySelector('.nw').onclick = () => { if (st.busy) return; st.hist = []; save(); ve(); ta.focus(); };
    o.querySelector('.snd').onclick = () => hoi(ta.value);
    ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); hoi(ta.value); } else if (e.key === 'Escape') close(); });
    ta.addEventListener('input', () => { ta.style.height = 'auto'; ta.style.height = Math.min(120, ta.scrollHeight) + 'px'; });
    o.addEventListener('click', e => {
      const a = e.target.closest('.tl-hs'); if (a) { e.preventDefault(); if (typeof openProfile === 'function') openProfile(a.dataset.ma); return; }
      const g = e.target.closest('.gy button'); if (g) { hoi(g.textContent); return; }
      const c = e.target.closest('[data-cp]'); if (c) { const t = st.hist[+c.dataset.cp]; if (t) { const B = bang(); copy((t.c ? hienTen(t.c, B, false) : t.t).replace(/\*\*/g, '')); } }
    });
    return o;
  }
  function copy(t) {
    const done = () => toast('Đã sao chép câu trả lời.');
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, () => {}); else { const x = document.createElement('textarea'); x.value = t; document.body.appendChild(x); x.select(); try { document.execCommand('copy'); done(); } catch (_) {} x.remove(); }
  }
  function ve(dang) {
    const o = el(), bd = o.querySelector('.bd'), B = bang(), ten = (S.me && S.me.ten) ? String(S.me.ten).trim().split(/\s+/).slice(-1)[0] : '';
    let h = `<div class="m a"><div class="mav">${BOT}</div><div class="bb"><p>Em chào cô${ten ? ' ' + esc(ten) : ''}! Em là <b>Trợ lý AI</b> của sổ — em đọc được số liệu nề nếp, rèn luyện, điểm kiểm tra và kỳ thi của lớp để trả lời cô, tóm tắt, so sánh hoặc soạn giúp tin nhắn.</p><p>Cô có thể hỏi tự do, hoặc chọn một câu bên dưới:</p></div></div>`;
    if (!st.hist.length) h += '<div class="gy">' + GOIY.map(([g, a]) => `<h6>${g}</h6>` + a.map(q => `<button type="button">${esc(q)}</button>`).join('')).join('') + '</div>';
    st.hist.forEach((m, i) => {
      if (m.r === 'u') h += `<div class="m u"><div class="bb">${esc(m.t)}</div></div>`;
      else h += `<div class="m a"><div class="mav">${BOT}</div><div class="bb${m.err ? ' err' : ''}">${m.err ? esc(m.t) : md(m.c || m.t, B)}${m.err ? '' : `<div class="tools"><button type="button" data-cp="${i}">Sao chép</button></div>`}</div></div>`;
    });
    if (dang) h += `<div class="m a"><div class="mav">${BOT}</div><div class="bb"><span class="dots"><span></span><span></span><span></span></span> Em đang đọc sổ…</div></div>`;
    else if (st.hist.length && !st.busy) h += '<div class="gy" style="margin-top:2px">' + GOIY.flatMap(x => x[1]).filter(q => !st.hist.some(m => m.t === q)).slice(0, 3).map(q => `<button type="button">${esc(q)}</button>`).join('') + '</div>';
    bd.innerHTML = h; bd.scrollTop = st.hist.length || dang ? bd.scrollHeight : 0;
  }
  async function hoi(q) {
    q = String(q || '').trim(); if (!q || st.busy) return;
    const o = el(), ta = o.querySelector('textarea'), snd = o.querySelector('.snd');
    ta.value = ''; ta.style.height = '';
    st.hist.push({ r: 'u', t: q }); st.busy = true; snd.disabled = true; ve(true);
    try {
      if (window.HT && !HT.d && HT.load) { try { await HT.load(); } catch (_) {} }
      const B = bang();
      const lichSu = st.hist.slice(0, -1).filter(m => !m.err).slice(-10).map(m => ({ r: m.r, t: (m.r === 'a' && m.c ? m.c : anDanh(m.t, B)).slice(0, 3000) }));
      const j = await rawApi('aiChat', { hoi: anDanh(q, B), lichSu, duLieu: duLieu(B) }, 120000);
      st.hist.push({ r: 'a', c: j.tl || '', t: hienTen(j.tl || '', B, false) });
    } catch (e) {
      st.hist.push({ r: 'a', t: e.message || 'Chưa gọi được trợ lý AI, cô thử lại sau nhé.', err: 1 });
    }
    st.busy = false; snd.disabled = false; save(); ve(); ta.focus();
  }
  function open(q) {
    if (!isGVCN()) { toast('Trợ lý AI dành cho giáo viên chủ nhiệm.'); return; }
    el(); document.body.classList.add('tl-open'); ve();
    setTimeout(() => { const ta = document.querySelector('#tl textarea'); if (ta) ta.focus(); }, 50);
    if (q) hoi(q);
  }
  function close() { document.body.classList.remove('tl-open'); }

  function fab() {
    let b = document.getElementById('tl-fab');
    const show = typeof isGVCN === 'function' && S && S.me && S.me.role && isGVCN() && !(typeof isKhach === 'function' && isKhach());
    const f = document.getElementById('hFind'), t = document.getElementById('tl-top');
    if (!show) { if (b) b.remove(); if (t) t.remove(); return; }
    if (f && !t) { const x = document.createElement('button'); x.id = 'tl-top'; x.type = 'button'; x.title = 'Trợ lý AI (Ctrl + J)'; x.innerHTML = BOT + '<span>Trợ lý AI</span>'; x.onclick = () => open(); f.before(x); }
    if (b) return;
    b = document.createElement('button'); b.id = 'tl-fab'; b.type = 'button'; b.setAttribute('aria-label', 'Trợ lý AI');
    b.innerHTML = BOT + '<span class="lb">Trợ lý AI</span>'; b.onclick = () => open();
    document.body.appendChild(b);
  }
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'j' || e.key === 'J')) { e.preventDefault(); document.body.classList.contains('tl-open') ? close() : open(); }
    else if (e.key === 'Escape' && document.body.classList.contains('tl-open') && !e.target.closest('#tl')) close();
  });
  setInterval(fab, 800); setTimeout(fab, 300);
  if (window.BACK && BACK.add) try { BACK.add({ id: 'tl', open: () => document.body.classList.contains('tl-open'), close }); } catch (_) {}

  window.TL = { open, close, hoi, duLieu: () => duLieu(bang()), anDanh: t => anDanh(t, bang()), hienTen: t => hienTen(t, bang(), false), GOIY };
})();
