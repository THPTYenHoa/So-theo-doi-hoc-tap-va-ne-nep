/* v6.5 — TRỢ LÝ AI (window.AI65): gợi ý nhận xét học sinh + lời văn báo cáo lớp. Backend: aiTrangThai · aiGoiY (AiTroLy.gs, yenhoa-backend).
   · Chỉ GVCN. Số liệu gửi đi ĐÃ ẨN DANH: không họ tên, không mã HS, không ghi chú tự do — chỉ con số, nội dung lỗi / khen theo danh mục, điểm theo môn.
   · Kết quả là GỢI Ý: điền vào ô nhận xét (có Hoàn tác), GVCN đọc, sửa rồi mới bấm Lưu như cũ.
   · Chỗ dùng: Nhận xét tháng của 1 học sinh (openRemark ▸ #rkNx) · Báo cáo thi đua (renderBC ▸ #bcNx, #bcPh). */
(function () {
  if (window.AI65) return;
  const IC = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>';
  const css = document.createElement('style'); css.id = 'v65-css';
  css.textContent = `.ai65{margin:8px 0 2px;border:1.5px dashed var(--line);border-radius:12px;padding:10px 12px;background:var(--paler,#F4FAFB)}
.ai65 .r{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.ai65 button.go{display:inline-flex;gap:6px;align-items:center;height:34px;padding:0 12px;border-radius:10px;border:1.5px solid var(--teal);background:#fff;color:var(--teal-d,var(--teal));font-weight:800;font-size:13.5px;cursor:pointer}
.ai65 button.go[disabled]{opacity:.6;cursor:wait}
.ai65 button.un{height:30px;padding:0 10px;border-radius:9px;border:1px solid var(--line);background:#fff;font-size:12.5px;font-weight:700;color:var(--sub);cursor:pointer}
.ai65 .nt{font-size:12px;color:var(--sub);line-height:1.45;margin-top:6px}
.ai65 .res{margin-top:8px;font-size:13px;line-height:1.5}.ai65 .res b{color:var(--teal-d,var(--teal))}
.ai65 .res ul{margin:2px 0 6px 18px;padding:0}
.bctxt .ai65{margin:0 0 10px}`;
  document.head.appendChild(css);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const r1 = x => Math.round(x * 10) / 10;
  const NOTE = 'Gợi ý của <b>Trợ lý AI</b>. Số liệu gửi đi đã ẩn danh (không họ tên). Cô đọc, sửa cho đúng rồi mới lưu.';

  async function goi(loai, data) {
    const j = await rawApi('aiGoiY', { loai, data }, 90000);
    return j.goiY || {};
  }
  function gom(E, sign) {   /* gom lượt theo nội dung danh mục (không lấy ghi chú tự do) */
    const m = {}; E.filter(e => sign < 0 ? e[E_DIEM] < 0 : e[E_DIEM] > 0).forEach(e => { const k = e[E_ND] || e[E_MUC]; m[k] = m[k] || { noiDung: k, nhom: nhomOf(e), lan: 0, diem: 0 }; m[k].lan++; m[k].diem += e[E_DIEM]; });
    return Object.values(m).sort((a, b) => b.lan - a.lan).slice(0, 12);
  }
  /** Số liệu ẩn danh của 1 học sinh trong tháng đang xem (+ điểm kiểm tra / kỳ thi nếu đã tải phần học tập). */
  function duLieuHS(ma, thang) {
    const s = stu(ma) || {}, E = S.entries.filter(e => e[E_MA] === ma && e[E_THANG] === thang), x = xlOf(ma, [thang]);
    const d = { ky: 'tháng ' + thang, chucVu: s.chucVu && s.chucVu !== 'Học sinh' ? s.chucVu : 'học sinh',
      diemTuan: Array.from({ length: S.cfg.soTuan }, (_, i) => weekScore(ma, i + 1, thang)), diemTBThang: r1(monthAvg(ma, thang)), xepLoaiThang: String(x.ten || '').replace(' ✓', ''),
      viPham: gom(E, -1), duocCong: gom(E, 1) };
    const pv = MONTHS_YEAR[MONTHS_YEAR.indexOf(thang) - 1];
    if (pv && S.entries.some(e => e[E_THANG] === pv)) d.diemTBThangTruoc = r1(monthAvg(ma, pv));
    try {
      if (window.HT && HT.d) {
        const hk = typeof hkOf === 'function' ? hkOf(thang) : 1;
        d.diemKiemTra = HT.monList().map(m => ({ mon: m.ten, giuaKi: HT.val(ma, m.ma, hk, 'GK') || null, cuoiKi: HT.val(ma, m.ma, hk, 'CK') || null }))
          .filter(o => o.giuaKi || o.cuoiKi);
        d.kyThi = (HT.ktList ? HT.ktList() : []).map(k => { const v = HT.ktDiem(ma, k); if (v == null) return null;
          const all = activeStudents().map(o => HT.ktDiem(o.ma, k)).filter(z => z != null).sort((a, b) => b - a);
          return { kyThi: k.ten, mon: (HT.monOf(k.mon) || {}).ten || k.mon, diem: v, thangDiem: k.thang, hang: all.indexOf(v) + 1, soHSDuThi: all.length }; }).filter(Boolean).slice(0, 8);
      }
    } catch (_) {}
    return d;
  }
  /** Số liệu ẩn danh cả lớp cho báo cáo (không tên học sinh). */
  function duLieuLop(P, st, pv) {
    const n = st.list.length, ten = S.cfg.thresholds.map(t => t.ten);
    return { ky: P.nhan, siSo: n, diemTBLop: r1(st.tb), xepLoai: ten.map((t, i) => ({ loai: t, soHS: st.cnt[i] })),
      luotViPham: st.tru.length, diemTru: st.dTru, luotDuocCong: st.cong.length, diemCong: st.dCong,
      loiThuongGap: st.topLoi.slice(0, 6).map(x => ({ noiDung: x.k, nhom: x.nhom, lan: x.n, soHS: x.hs })),
      theoNhom: Object.keys(st.nhom).map(k => ({ nhom: k, lan: st.nhom[k].n })),
      thiDuaTo: st.to.map(t => ({ to: t.t, diemTB: r1(t.tb), luotViPham: t.tru, luotCong: t.cong, hang: t.rk })),
      soHSCanQuanTam: st.care.length, soHSTienBo: st.tienBo.length, soHSDuocTuyenDuong: st.khen.length,
      kyTruoc: pv ? { diemTBLop: r1(pv.tb), luotViPham: pv.tru.length, luotDuocCong: pv.cong.length } : null };
  }
  function hop(target, onGo, label) {   /* khung nút AI chèn trước / sau ô văn bản */
    const b = document.createElement('div'); b.className = 'ai65';
    b.innerHTML = `<div class="r"><button class="go" type="button">${IC}<span>${esc(label)}</span></button></div><div class="nt">${NOTE}</div><div class="res"></div>`;
    const go = b.querySelector('.go'), sp = go.querySelector('span');
    go.onclick = async () => {
      go.disabled = true; sp.textContent = 'AI đang viết…';
      try { await onGo(b); } catch (e) { toast(e.message || 'Chưa gọi được trợ lý AI.'); }
      go.disabled = false; sp.textContent = label;
    };
    return b;
  }
  function hoanTac(b, list) {   /* list: [[textarea, giá trị cũ]] */
    let u = b.querySelector('.un'); if (u) u.remove();
    u = document.createElement('button'); u.className = 'un'; u.type = 'button'; u.textContent = 'Hoàn tác';
    u.onclick = () => { list.forEach(([ta, v]) => { ta.value = v; ta.dispatchEvent(new Event('input', { bubbles: true })); }); u.remove(); };
    b.querySelector('.r').appendChild(u);
  }

  /* 1. Nhận xét tháng của 1 học sinh */
  const openRemark0 = window.openRemark;
  if (openRemark0) window.openRemark = openRemark = function (ma) {
    const r = openRemark0.apply(this, arguments);
    const ta = document.querySelector('#rkNx'); if (!ta || !isGVCN() || document.querySelector('#pBody .ai65')) return r;
    ta.after(hop(ta, async b => {
      if (window.HT && !HT.d && HT.load) { try { await HT.load(); } catch (_) {} }
      const g = await goi('nx_hs', duLieuHS(ma, S.thang)), cu = ta.value;
      ta.value = g.nhanXet || ''; ta.focus(); hoanTac(b, [[ta, cu]]);
      const li = a => (a || []).length ? '<ul>' + a.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '';
      b.querySelector('.res').innerHTML = ((g.diemManh || []).length ? '<b>Điểm mạnh</b>' + li(g.diemManh) : '') + ((g.canCoGang || []).length ? '<b>Cần cố gắng</b>' + li(g.canCoGang) : '')
        + (g.goiYGV ? '<b>Gợi ý cho cô</b><div>' + esc(g.goiYGV) + '</div>' : '');
      toast('AI đã gợi ý nhận xét — cô sửa lại rồi bấm Lưu.');
    }, 'Gợi ý nhận xét bằng AI'));
    return r;
  };

  /* 2. Báo cáo thi đua: nhận xét chung + phương hướng */
  const renderBC0 = window.renderBC;
  if (renderBC0) window.renderBC = renderBC = function () {
    const r = renderBC0.apply(this, arguments);
    const nx = document.querySelector('#bcNx'), ph = document.querySelector('#bcPh'), box = document.querySelector('#vBC .bctxt');
    if (!nx || !ph || !box || !isGVCN() || box.querySelector('.ai65')) return r;
    box.insertBefore(hop(nx, async b => {
      const P = bcPeriod(), st = bcStats(P), pv = bcPrevStats(P);
      const g = await goi('bc_lop', duLieuLop(P, st, pv)), c1 = nx.value, c2 = ph.value;
      if (g.nhanXet) { nx.value = g.nhanXet; bcSave(P, 'nx', g.nhanXet); }
      if (g.phuongHuong) { ph.value = g.phuongHuong; bcSave(P, 'ph', g.phuongHuong); }
      hoanTac(b, [[nx, c1], [ph, c2]]);
      toast('AI đã viết nhận xét chung và phương hướng — cô sửa lại nếu cần.');
    }, 'AI viết nhận xét chung & phương hướng'), box.firstChild);
    return r;
  };

  window.AI65 = { duLieuHS, duLieuLop, goi };
})();
