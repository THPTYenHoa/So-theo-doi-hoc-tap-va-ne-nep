/* ══ v6.3 — KỲ THI & ÔN LUYỆN + EMAIL BÁO ĐIỂM (nạp sau hoctap.js) ══
   · Điểm bộ môn ▸ thẻ "Kỳ thi & ôn luyện": thi học sinh giỏi, thi ôn luyện trên app luyện thi, bài kiểm tra khác — mỗi kỳ thi 1 môn.
     GVCN, giáo viên bộ môn (môn mình dạy), cán bộ lớp tạo kỳ thi + nhập điểm (gõ tay hoặc Excel). Điểm lưu ở DiemSo, đầu điểm "KT#<mã>".
   · Email báo điểm: sau khi nhập điểm giữa kì / cuối kì / kỳ thi, app tự gọi htBaoDiem (90 giây sau lần sửa cuối, ngay sau khi nhập Excel)
     ⇒ máy chủ gửi thư cho cha mẹ đã đăng ký nhận thông báo, chỉ gửi điểm mới / đã sửa. Tắt / bật trên máy: localStorage hk_bao_diem.
   Backend: KyThi.gs (htSaveKyThi, htBaoDiem). Mô phỏng: demo/htdemo.js. */
(function () {
  'use strict';
  if (!window.HT) return;
  const HT = window.HT;
  const LOAI = { HSG: 'Thi học sinh giỏi', OL: 'Ôn luyện trên app', KT: 'Kiểm tra khác' };
  const LC = { HSG: '#B9761C', OL: '#1F618D', KT: '#5C7A83' };
  const e = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const num = v => { const t = String(v == null ? '' : v).trim().replace(',', '.'); return t === '' || isNaN(+t) ? null : +t; };
  const f1 = v => v == null ? '' : String(Math.round(v * 100) / 100).replace('.', ',');
  const ls = { get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} } };
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const hkOf = ngay => { const m = +(String(ngay).split('-')[1] || 0); return m >= 1 && m <= 5 && m !== 1 ? 2 : 1; };
  HT.ktList = () => (HT.d && HT.d.kyThi) || [];
  HT.ktOf = id => HT.ktList().find(k => k.id === String(id).toUpperCase()) || null;
  HT.ktDiem = (ma, k) => num(HT.val(ma, k.mon, k.hk, 'KT#' + k.id));
  const canEdit = k => (typeof isGVCN === 'function' && isGVCN()) || k.by === (S.me && S.me.name);
  const monTen = ma => (HT.monOf(ma) || {}).ten || ma;

  /* ── email báo điểm ── */
  const BAO = { keys: {}, t: null };
  const autoBao = () => ls.get('hk_bao_diem') !== '0';
  HT.baoTxt = () => ` <span id="htBaoT" role="button" tabindex="0" style="cursor:pointer;text-decoration:underline dotted" title="Bấm để bật / tắt">Email báo điểm cho cha mẹ: <b>${autoBao() ? 'tự gửi sau khi nhập' : 'đang tắt'}</b></span>`;
  document.addEventListener('click', ev => { if (ev.target.closest && ev.target.closest('#htBaoT')) { ls.set('hk_bao_diem', autoBao() ? '0' : '1'); toast(autoBao() ? 'Đã bật tự gửi email báo điểm cho cha mẹ.' : 'Đã tắt tự gửi email báo điểm.'); HT.render(); } });
  HT.henBao = function (keys, now) {
    if (!autoBao()) return;
    (keys || []).forEach(k => { BAO.keys[k.mon + '|' + k.hk + '|' + k.dd] = k; });
    clearTimeout(BAO.t); BAO.t = setTimeout(guiBao, now ? 4000 : 90000);
  };
  async function guiBao(force) {
    const keys = Object.values(BAO.keys); if (!keys.length) return;
    if (document.getElementById('htq')) { BAO.t = setTimeout(guiBao, 5000); return; }   // còn điểm đang lưu ⇒ đợi
    BAO.keys = {};
    try { const j = await rawApi('htBaoDiem', { keys }, 90000); if (j.n || force) toast('Email báo điểm: ' + (j.mail || 'xong') + '.'); }
    catch (err2) { keys.forEach(k => { BAO.keys[k.mon + '|' + k.hk + '|' + k.dd] = k; }); if (err2.net) BAO.t = setTimeout(guiBao, 30000); else toast('Chưa gửi được email báo điểm: ' + err2.message); }
  }
  window.addEventListener('pagehide', () => { if (Object.keys(BAO.keys).length) guiBao(); });

  /* ── giao diện ── */
  const css = document.createElement('style'); css.id = 'kt-css';
  css.textContent = `
.ktl{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px;margin:0 12px 14px}
.ktc{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px 14px;cursor:pointer;display:flex;flex-direction:column;gap:6px}
.ktc:hover{border-color:var(--teal-l);background:var(--paler)} .ktc b{font-size:15px;color:var(--ink);line-height:1.35}
.ktc .tg{align-self:flex-start;font-size:11.5px;font-weight:800;border-radius:99px;padding:2px 9px;background:var(--paler)}
.ktc .mt{font-size:12.5px;color:var(--mute)} .ktc .st{display:flex;gap:12px;font-size:12.5px;color:var(--sub)} .ktc .st b{font-size:13px}
.kth{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 12px 10px} .kth h3{margin:0;font-size:18px;color:var(--teal-d);flex:1 1 220px}
.ktst{display:flex;gap:10px;flex-wrap:wrap;margin:0 12px 12px} .ktst div{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:8px 14px;min-width:96px}
.ktst b{display:block;font-size:20px;color:var(--teal-d)} .ktst span{font-size:12px;color:var(--mute)}
.ktt td.c input{width:78px;height:34px;border:1.5px solid var(--line);border-radius:8px;text-align:center;font:inherit;font-weight:700}
.ktt td.c input:focus{border-color:var(--teal);outline:0} .ktt td.c input.lo{color:var(--dang)}
.ktf label{display:block;font-size:13px;font-weight:700;color:var(--ink);margin:10px 0 4px} .ktf .r2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media (min-width:761px){ .ktl,.kth,.ktst{margin-left:26px;margin-right:26px} }`;
  document.head.appendChild(css);

  function modal(title, body, foot) {
    const o = document.createElement('div'); o.id = 'htov';
    o.innerHTML = `<div class="bx" role="dialog" aria-modal="true"><div class="hd"><h3>${e(title)}</h3><button class="x" aria-label="Đóng">✕</button></div><div class="bd">${body}</div><div class="ft">${foot}</div></div>`;
    document.body.appendChild(o);
    const close = () => o.remove(); o.querySelector('.x').onclick = close; o.addEventListener('mousedown', ev => { if (ev.target === o) close(); });
    return { o, close, $: q => o.querySelector(q) };
  }
  function stats(k) {
    const L = activeStudents(), v = L.map(s => HT.ktDiem(s.ma, k)).filter(x => x != null);
    return { n: v.length, tb: v.length ? v.reduce((a, b) => a + b, 0) / v.length : null, hi: v.length ? Math.max(...v) : null, lo: v.length ? Math.min(...v) : null };
  }
  HT.ktStats = stats;
  HT.viewKT = function () {
    if (HT.ktSel && HT.ktOf(HT.ktSel)) return viewOne(HT.ktOf(HT.ktSel));
    HT.ktSel = null;
    const ms = HT.monList(), fl = HT.ktLoai || '', fm = HT.ktMon || '';
    const L = HT.ktList().filter(k => (!fl || k.loai === fl) && (!fm || k.mon === fm) && ms.some(m => m.ma === k.mon)).sort((a, b) => String(b.ngay).localeCompare(String(a.ngay)));
    let h = `<div class="htbar"><select id="ktL"><option value="">Mọi loại kỳ thi</option>${Object.keys(LOAI).map(x => `<option value="${x}"${x === fl ? ' selected' : ''}>${LOAI[x]}</option>`).join('')}</select>
      <select id="ktM"><option value="">Mọi môn</option>${ms.map(m => `<option value="${e(m.ma)}"${m.ma === fm ? ' selected' : ''}>${e(m.ten)}</option>`).join('')}</select><span class="sp"></span>
      <button class="hb p" id="ktNew">${HT.IC.plus}<span class="lg">Tạo kỳ thi</span></button></div>
      <div class="htnote">Ghi điểm các kỳ <b>thi học sinh giỏi</b>, <b>thi ôn luyện trên app</b> (vd. bài luyện đề trên ứng dụng luyện thi) và bài kiểm tra khác — mỗi kỳ thi một môn. Bấm vào một kỳ thi để nhập điểm hoặc nhập từ Excel.${HT.baoTxt()}</div>`;
    h += L.length ? '<div class="ktl">' + L.map(k => { const st = stats(k);
      return `<div class="ktc" data-kt="${e(k.id)}"><span class="tg" style="color:${LC[k.loai]}">${LOAI[k.loai] || 'Kỳ thi'}</span><b>${e(k.ten)}</b>
        <div class="mt">${e(monTen(k.mon))} · ${e(k.ngay || '')} · học kì ${k.hk === 2 ? 'II' : 'I'}${k.thang !== 10 ? ' · thang ' + k.thang : ''}</div>
        <div class="st"><span><b>${st.n}</b> học sinh</span><span>TB <b>${f1(st.tb)}</b></span><span>Cao nhất <b>${f1(st.hi)}</b></span></div></div>`; }).join('') + '</div>'
      : '<div class="empty"><b>Chưa có kỳ thi nào</b>Bấm "Tạo kỳ thi" để ghi điểm thi học sinh giỏi hoặc thi ôn luyện.</div>';
    return h;
  };
  const stBox = k => { const st = stats(k), n = activeStudents().length; return `<div><b>${st.n}/${n}</b><span>học sinh có điểm</span></div><div><b>${f1(st.tb) || '—'}</b><span>điểm trung bình</span></div><div><b>${f1(st.hi) || '—'}</b><span>cao nhất</span></div><div><b>${f1(st.lo) || '—'}</b><span>thấp nhất</span></div>`; };
  function viewOne(k) {
    const st = stats(k), L = activeStudents();
    let h = `<div class="kth"><button class="hb" id="ktBack">‹ Danh sách kỳ thi</button><h3>${e(k.ten)}</h3>
      <button class="hb" id="ktImp">${HT.IC.up}<span class="lg">Nhập từ Excel</span></button><button class="hb" id="ktExp">${HT.IC.down}<span class="lg">Tải Excel</span></button>
      <button class="hb" id="ktMail">${HT.IC.mail}<span class="lg">Gửi email báo điểm</span></button>
      ${canEdit(k) ? `<button class="hb" id="ktEdit">Sửa</button><button class="hb d" id="ktDel">Xoá</button>` : ''}</div>
      <div class="htnote"><b style="color:${LC[k.loai]}">${LOAI[k.loai] || ''}</b> · môn <b>${e(monTen(k.mon))}</b> · ngày ${e(k.ngay || '')} · học kì ${k.hk === 2 ? 'II' : 'I'} · thang điểm ${k.thang}${k.gc ? ' · ' + e(k.gc) : ''}. Gõ điểm rồi Enter để xuống dòng; để trống = không dự thi.${HT.baoTxt()}</div>
      <div class="ktst">${stBox(k)}</div>
      <div class="htg tablewrap ktt"><table><thead><tr><th>TT</th><th class="name">Họ và tên</th><th>Điểm${k.thang !== 10 ? ' / ' + k.thang : ''}</th><th>Xếp hạng</th></tr></thead><tbody>`;
    const rk = L.map(s => HT.ktDiem(s.ma, k)).filter(x => x != null).sort((a, b) => b - a);
    L.forEach((s, i) => { const v = HT.ktDiem(s.ma, k);
      h += `<tr data-ma="${e(s.ma)}"><td>${i + 1}</td><td class="name">${e(s.ten)}</td><td class="c"><input inputmode="decimal" value="${v == null ? '' : f1(v)}" class="${v != null && v < k.thang / 2 ? 'lo' : ''}" aria-label="Điểm của ${e(s.ten)}"></td><td>${v == null ? '' : rk.indexOf(v) + 1}</td></tr>`; });
    return h + '</tbody></table></div>';
  }
  function save(k, list) {
    const items = list.map(x => ({ ma: x.ma, mon: k.mon, hk: k.hk, dd: 'KT#' + k.id, v: x.v }));
    if (!items.length) return;
    HT.saveDiem(items); HT.henBao([{ mon: k.mon, hk: k.hk, dd: 'KT#' + k.id }], list.length > 3);
  }
  HT.bindKT = function (box) {
    const q = s => box.querySelector(s);
    if (!HT.ktSel) {
      q('#ktL').onchange = ev => { HT.ktLoai = ev.target.value; HT.render(); };
      q('#ktM').onchange = ev => { HT.ktMon = ev.target.value; HT.render(); };
      q('#ktNew').onclick = () => form(null);
      box.querySelectorAll('[data-kt]').forEach(c => c.onclick = () => { HT.ktSel = c.dataset.kt; HT.render(); });
      return;
    }
    const k = HT.ktOf(HT.ktSel);
    q('#ktBack').onclick = () => { HT.ktSel = null; HT.render(); };
    q('#ktImp').onclick = () => importKT(k);
    q('#ktExp').onclick = () => exportKT(k);
    q('#ktMail').onclick = () => { BAO.keys['x'] = { mon: k.mon, hk: k.hk, dd: 'KT#' + k.id }; clearTimeout(BAO.t); guiBao(true); };
    if (q('#ktEdit')) q('#ktEdit').onclick = () => form(k);
    if (q('#ktDel')) q('#ktDel').onclick = async () => {
      if (!confirm('Xoá kỳ thi "' + k.ten + '" và toàn bộ điểm của kỳ thi này?')) return;
      try { const j = await rawApi('htSaveKyThi', { op: 'del', id: k.id }); HT.d.kyThi = j.kyThi || HT.ktList().filter(x => x.id !== k.id);
        HT.d.diem = HT.d.diem.filter(r => r[3] !== 'KT#' + k.id); HT.ktSel = null; HT.render(); toast('Đã xoá kỳ thi.'); } catch (err2) { err(err2); }
    };
    box.querySelectorAll('.ktt td.c input').forEach(inp => {
      const ma = inp.closest('tr').dataset.ma;
      const done = () => { const cur = HT.ktDiem(ma, k), t = inp.value.trim(); let v = t === '' ? '' : num(t);
        if (v !== '' && (v == null || v < 0 || v > k.thang)) { toast('Điểm từ 0 đến ' + k.thang + '.'); inp.value = cur == null ? '' : f1(cur); return; }
        if ((v === '' ? null : v) === cur) return;
        save(k, [{ ma, v: v === '' ? '' : String(v) }]); inp.classList.toggle('lo', v !== '' && v < k.thang / 2);
        const sb = box.querySelector('.ktst'); if (sb) sb.innerHTML = stBox(k); };
      inp.addEventListener('change', done);
      inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); const nx = inp.closest('tr').nextElementSibling; inp.blur(); if (nx) { const i2 = nx.querySelector('input'); if (i2) { i2.focus(); i2.select(); } } } });
    });
  };
  function form(k) {
    const ms = HT.monList(), x = k || { loai: 'OL', mon: HT.ktMon || (ms[0] || {}).ma, ten: '', ngay: today(), thang: 10, gc: '' };
    const o = modal(k ? 'Sửa kỳ thi' : 'Tạo kỳ thi', `<div class="ktf">
      <label>Loại kỳ thi</label><select id="kfL">${Object.keys(LOAI).map(l => `<option value="${l}"${l === x.loai ? ' selected' : ''}>${LOAI[l]}</option>`).join('')}</select>
      <label>Môn</label><select id="kfM">${ms.map(m => `<option value="${e(m.ma)}"${m.ma === x.mon ? ' selected' : ''}>${e(m.ten)}</option>`).join('')}</select>
      <label>Tên kỳ thi</label><input type="text" id="kfT" value="${e(x.ten)}" placeholder="vd. Ôn luyện tiếng Anh tuần 3 · Thi HSG cấp trường vòng 1">
      <div class="r2"><div><label>Ngày thi</label><input type="date" id="kfN" value="${e(x.ngay)}"></div><div><label>Thang điểm</label><input type="text" inputmode="numeric" id="kfS" value="${x.thang}"></div></div>
      <label>Ghi chú (không bắt buộc)</label><input type="text" id="kfG" value="${e(x.gc || '')}" placeholder="vd. ứng dụng luyện thi, đề số…"></div>`,
      `<button class="hb" data-x>Huỷ</button><button class="hb p" data-ok>${HT.IC.save} Lưu</button>`);
    o.$('[data-x]').onclick = o.close;
    o.$('[data-ok]').onclick = async () => {
      const kt = { id: k ? k.id : '', loai: o.$('#kfL').value, mon: o.$('#kfM').value, ten: o.$('#kfT').value.trim(), ngay: o.$('#kfN').value, gc: o.$('#kfG').value.trim(),
        thang: Math.max(1, num(o.$('#kfS').value) || 10) };
      kt.hk = hkOf(kt.ngay);
      if (!kt.ten) { toast('Đặt tên kỳ thi giúp nhé.'); return; }
      const b = o.$('[data-ok]'); b.disabled = true; b.textContent = 'Đang lưu…';
      try { const j = await rawApi('htSaveKyThi', { op: 'save', kt }); HT.d.kyThi = j.kyThi || HT.ktList(); o.close(); HT.ktSel = j.id || kt.id; HT.render(); toast(k ? 'Đã sửa kỳ thi.' : 'Đã tạo kỳ thi — nhập điểm ngay bên dưới.'); }
      catch (err2) { b.disabled = false; b.textContent = 'Lưu'; err(err2); }
    };
  }
  async function xl() { if (window.XLSX) return window.XLSX; if (window.DL && DL.load) { await DL.load('xlsx'); return window.XLSX; } throw new Error('Không tải được thư viện Excel.'); }
  const bo = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/\s+/g, ' ').trim();
  function exportKT(k) {
    xl().then(X => { const L = activeStudents(), rows = [['STT', 'Mã HS', 'Họ và tên', 'Điểm']];
      L.forEach((s, i) => { const v = HT.ktDiem(s.ma, k); rows.push([i + 1, s.ma, s.ten, v == null ? '' : v]); });
      const wb = X.utils.book_new(), ws = X.utils.aoa_to_sheet(rows); ws['!cols'] = [{ wch: 5 }, { wch: 8 }, { wch: 28 }, { wch: 8 }];
      X.utils.book_append_sheet(wb, ws, 'Diem'); X.writeFile(wb, 'Ky_thi_' + bo(k.ten).replace(/\W+/g, '_').slice(0, 40) + '.xlsx'); }).catch(err);
  }
  /** Excel: cột "Họ và tên" (hoặc "Mã HS") + 1 cột điểm (tiêu đề có chữ "điểm", "score", "kết quả" hoặc cột số đầu tiên). */
  function importKT(k) {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.xlsx,.xls,.csv';
    inp.onchange = async () => {
      const f = inp.files[0]; if (!f) return;
      try {
        const X = await xl(), wb = X.read(await f.arrayBuffer(), { type: 'array' });
        const rows = X.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, raw: true, defval: '' });
        const hr = rows.findIndex(r => r.some(c => /^(ho va ten|ho ten|ma hs|ma hoc sinh|hoc sinh|ten hoc sinh)$/.test(bo(c))));
        if (hr < 0) { toast('Không thấy cột "Họ và tên" trong tệp.'); return; }
        const head = rows[hr].map(c => bo(c));
        const iMa = head.findIndex(c => /^(ma hs|ma hoc sinh|ma)$/.test(c)), iTen = head.findIndex(c => /^(ho va ten|ho ten|hoc sinh|ten hoc sinh|ten)$/.test(c));
        let iD = head.findIndex(c => /diem|score|ket qua|point/.test(c));
        if (iD < 0) iD = head.findIndex((c, i) => i !== iMa && i !== iTen && rows.slice(hr + 1).some(r => num(r[i]) != null));
        if (iD < 0) { toast('Không thấy cột điểm trong tệp.'); return; }
        const L = activeStudents(), out = [], miss = [], bad = [], seen = {};
        rows.slice(hr + 1).forEach(r => {
          if (!r.some(c => String(c).trim())) return;
          let s = null;
          if (iMa >= 0 && String(r[iMa]).trim()) s = L.find(x => x.ma.toLowerCase() === String(r[iMa]).trim().toLowerCase());
          if (!s && iTen >= 0) { const n = bo(r[iTen]), c = L.filter(x => bo(x.ten) === n), j = (seen[n] = (seen[n] || 0) + 1) - 1; s = c[j] || null; }
          if (!s) { if (iTen >= 0 && String(r[iTen]).trim()) miss.push(String(r[iTen]).trim()); return; }
          const v = num(r[iD]); if (String(r[iD]).trim() === '') return;
          if (v == null || v < 0 || v > k.thang) { bad.push(s.ten + ': ' + r[iD]); return; }
          out.push({ ma: s.ma, v: String(v) });
        });
        const o = modal('Nhập điểm từ Excel', `<p>Tệp <b>${e(f.name)}</b> · kỳ thi <b>${e(k.ten)}</b>: <b>${out.length}</b> điểm hợp lệ.</p>
          ${miss.length ? `<p class="mut" style="color:var(--dang)">Không khớp tên (${miss.length}): ${e(miss.slice(0, 8).join(', '))}${miss.length > 8 ? '…' : ''}</p>` : ''}
          ${bad.length ? `<p class="mut" style="color:var(--dang)">Bỏ qua ${bad.length} điểm sai: ${e(bad.slice(0, 4).join('; '))}</p>` : ''}
          <p class="mut">Điểm trong tệp sẽ ghi đè điểm cũ của học sinh tương ứng.${autoBao() ? ' Sau khi lưu, cha mẹ đã đăng ký nhận thông báo sẽ nhận email báo điểm.' : ''}</p>`,
          `<button class="hb" data-x>Huỷ</button><button class="hb p" data-ok>${HT.IC.save} Lưu ${out.length} điểm</button>`);
        o.$('[data-x]').onclick = o.close;
        o.$('[data-ok]').onclick = () => { save(k, out); o.close(); HT.render(); toast('Đã nhập ' + out.length + ' điểm. Hệ thống đang lưu lên máy chủ.'); };
      } catch (err2) { err(err2); }
    };
    inp.click();
  }
})();
