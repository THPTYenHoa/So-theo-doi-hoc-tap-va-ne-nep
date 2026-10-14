/* ══ v4.5 — TẢI FILE (window.DL) ══════════════════════════════════════════════════════
   Trước đây PDF = lệnh In của trình duyệt (window.print) ⇒ trên điện thoại / trình duyệt trong Zalo, Gmail
   bấm vào "không thấy gì". Nay tạo FILE thật ngay trên máy:
   · PDF: dựng trang trong iframe ẩn ▸ html2canvas từng trang (.pg khổ ngang của baocao.js; trang khác cắt theo A4 dọc)
     ▸ jsPDF ▸ tự tải về + bảng "Mở file / Chia sẻ". Trong lúc tạo: màn chờ có tiến độ.
   · Excel: mọi lệnh tải .csv cũ (thẻ <a download> với blob) ⇒ đổi thành .xlsx bằng SheetJS (lỗi ⇒ giữ .csv).
   Thư viện ở vendor/ (tải khi cần lần đầu). Nạp SAU baocao.js.
   DL.pdf(docHtml, tên, {orient}) · DL.pdfHtml(bodyHtml, tên) · DL.save(blob, tên) · DL.busy(on, chữ, tiến độ) */
(function () {
  if (window.DL) return;
  var BASE = (document.currentScript && document.currentScript.src || location.href).replace(/[#?].*$/, '').replace(/[^/]*$/, '');
  var LIB = { h2c: 'vendor/html2canvas.min.js', pdf: 'vendor/jspdf.umd.min.js', xlsx: 'vendor/xlsx.full.min.js' }, got = {};
  function load(k) {
    if (got[k]) return got[k];
    return (got[k] = new Promise(function (ok, no) {
      var s = document.createElement('script'); s.src = BASE + LIB[k]; s.onload = ok;
      s.onerror = function () { got[k] = null; no(new Error('Không tải được thư viện tạo file. Kiểm tra mạng rồi thử lại.')); };
      document.head.appendChild(s);
    }));
  }
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var fname = function (n, ext) { n = String(n || 'tai-lieu').replace(/[\\/:*?"<>|]+/g, '_').trim() || 'tai-lieu'; return /\.[a-z0-9]{2,4}$/i.test(n) ? n.replace(/\.[a-z0-9]{2,4}$/i, ext) : n + ext; };

  /* ── giao diện: màn chờ + bảng kết quả ── */
  var css = document.createElement('style'); css.id = 'dl-css';
  css.textContent = '#dl-ov{position:fixed;inset:0;z-index:100000;background:rgba(16,40,44,.42);display:grid;place-items:center;padding:16px;font-family:inherit}'
    + '#dl-ov .bx{background:#fff;border-radius:18px;padding:20px 22px;max-width:340px;width:100%;text-align:center;box-shadow:0 18px 50px rgba(0,0,0,.25)}'
    + '#dl-ov .mc{height:96px;display:grid;place-items:center;margin-bottom:6px}#dl-ov .mc img{max-height:96px}'
    + '#dl-ov b{display:block;font-size:16px;color:#0A5C64;margin-bottom:4px}#dl-ov span{font-size:13px;color:#5B7479}'
    + '#dl-ov .br{height:8px;border-radius:9px;background:#E6F0F1;margin-top:14px;overflow:hidden}#dl-ov .br i{display:block;height:100%;width:8%;background:#0E7C86;border-radius:9px;transition:width .3s}'
    + '#dl-sh{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:100000;background:#fff;border:1px solid #DCE7E9;border-radius:16px;box-shadow:0 14px 40px rgba(0,0,0,.18);'
    + 'padding:14px 16px;width:min(420px,calc(100vw - 24px));font-family:inherit;animation:dlUp .25s ease}'
    + '@keyframes dlUp{from{transform:translate(-50%,20px);opacity:0}}'
    + '#dl-sh .t{display:flex;gap:10px;align-items:center}#dl-sh .ic{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;color:#fff;font-weight:800;font-size:11px;flex:none}'
    + '#dl-sh .n{font-weight:700;color:#173D42;font-size:14px;word-break:break-all}#dl-sh .s{font-size:12px;color:#5B7479}'
    + '#dl-sh .a{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}#dl-sh button{flex:1;min-width:92px;border:1px solid #CFE0E2;background:#fff;color:#0A5C64;border-radius:11px;padding:10px 8px;font:inherit;font-weight:700;font-size:13.5px;cursor:pointer}'
    + '#dl-sh button.p{background:#0E7C86;border-color:#0E7C86;color:#fff}#dl-sh .x{position:absolute;right:8px;top:6px;border:0;background:none;min-width:0;flex:none;font-size:20px;color:#8AA;padding:2px 6px}';
  document.head.appendChild(css);
  var ov = null;
  function busy(on, msg, pct) {
    if (!on) { if (ov) ov.remove(); ov = null; return; }
    if (!ov) {
      ov = document.createElement('div'); ov.id = 'dl-ov';
      var mc = ''; try { mc = window.MASCOT ? MASCOT.img('chay', 96) : ''; } catch (e) {}
      ov.innerHTML = '<div class="bx" role="status" aria-live="polite"><div class="mc">' + mc + '</div><b></b><span></span><div class="br"><i></i></div></div>';
      document.body.appendChild(ov);
    }
    ov.querySelector('b').textContent = msg || 'Đang tạo file…';
    ov.querySelector('span').textContent = pct == null ? 'Chờ chút nhé, file sẽ tự tải về.' : 'Đã xong ' + Math.round(pct * 100) + '%';
    if (pct != null) ov.querySelector('.br i').style.width = Math.max(8, Math.round(pct * 100)) + '%';
  }
  function sheet(url, name, blob) {
    var old = document.getElementById('dl-sh'); if (old) old.remove();
    var ext = (name.split('.').pop() || '').toUpperCase(), col = ext === 'PDF' ? '#C0392B' : ext === 'XLSX' || ext === 'CSV' ? '#1E7145' : '#0E7C86';
    var file = null; try { file = new File([blob], name, { type: blob.type }); } catch (e) {}
    var canShare = !!(file && navigator.canShare && navigator.canShare({ files: [file] }));
    var d = document.createElement('div'); d.id = 'dl-sh';
    d.innerHTML = '<button class="x" aria-label="Đóng">×</button><div class="t"><div class="ic" style="background:' + col + '">' + esc(ext) + '</div><div><div class="n">' + esc(name) + '</div>'
      + '<div class="s">Đã tạo xong · ' + Math.max(1, Math.round(blob.size / 1024)) + ' KB · file đã được tải về máy</div></div></div>'
      + '<div class="a"><button class="p" data-a="open">Mở file</button>' + (canShare ? '<button data-a="share">Chia sẻ / Lưu</button>' : '') + '<button data-a="again">Tải lại</button></div>';
    document.body.appendChild(d);
    var close = function () { d.remove(); };
    d.querySelector('.x').onclick = close;
    d.querySelector('[data-a=open]').onclick = function () { var w = window.open(url, '_blank'); if (!w) location.href = url; };
    d.querySelector('[data-a=again]').onclick = function () { kick(url, name); };
    if (canShare) d.querySelector('[data-a=share]').onclick = function () { navigator.share({ files: [file], title: name }).catch(function () {}); };
    clearTimeout(sheet.t); sheet.t = setTimeout(close, 45000);
  }
  var realClick = HTMLAnchorElement.prototype.click;
  function kick(url, name) { var a = document.createElement('a'); a.href = url; a.download = name; a.rel = 'noopener'; document.body.appendChild(a); realClick.call(a); setTimeout(function () { a.remove(); }, 800); }
  function save(blob, name) {
    name = String(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^\w.\-]+/g, '_').replace(/_+/g, '_');
    var url = URL.createObjectURL(blob); kick(url, name); sheet(url, name, blob);
    setTimeout(function () { URL.revokeObjectURL(url); }, 10 * 60 * 1000);
    return { url: url, name: name, size: blob.size };
  }

  /* ── PDF ── */
  var A4 = { l: { w: 1123, h: 794, mm: [297, 210] }, p: { w: 794, h: 1123, mm: [210, 297] } };
  function frameFor(doc, o) {
    var f = document.createElement('iframe'); f.setAttribute('aria-hidden', 'true');
    f.style.cssText = 'position:fixed;left:-12000px;top:0;width:' + A4[o].w + 'px;height:' + A4[o].h + 'px;border:0;opacity:0;pointer-events:none';
    document.body.appendChild(f);
    var d = f.contentDocument; d.open(); d.write(doc); d.close();
    return f;
  }
  function ready(f) {
    var d = f.contentDocument, imgs = [].slice.call(d.images);
    var pImg = Promise.all(imgs.map(function (i) { return i.complete ? 1 : new Promise(function (r) { i.onload = i.onerror = r; setTimeout(r, 4000); }); }));
    var pFont = d.fonts && d.fonts.ready ? Promise.race([d.fonts.ready, new Promise(function (r) { setTimeout(r, 3000); })]) : 1;
    return Promise.all([pImg, pFont]).then(function () { return new Promise(function (r) { setTimeout(r, 150); }); });
  }
  function h2cIn(f) {   // chạy html2canvas trong chính iframe (đúng font, đúng kích thước)
    var w = f.contentWindow; if (w.html2canvas) return Promise.resolve(w.html2canvas);
    return new Promise(function (ok, no) { var s = w.document.createElement('script'); s.src = BASE + LIB.h2c; s.onload = function () { ok(w.html2canvas); }; s.onerror = function () { no(new Error('Không tải được thư viện tạo file.')); }; w.document.head.appendChild(s); });
  }
  /* trang dọc: chèn khoảng trống để không cắt ngang một dòng bảng */
  function paginate(d, H) {
    var body = d.body, rows = [].slice.call(d.querySelectorAll('tr, .rm, h1, h2, .sub'));
    for (var k = 0; k < rows.length; k++) {
      var r = rows[k].getBoundingClientRect(), top = r.top + (d.defaultView.scrollY || 0), endPg = Math.floor(top / H) * H + H - 28;
      if (r.height < H * .5 && top < endPg && top + r.height > endPg) {
        var gap = endPg - top + 40, sp;
        if (rows[k].tagName === 'TR') { sp = d.createElement('tr'); sp.innerHTML = '<td colspan="20" style="height:' + gap + 'px;border:0;padding:0"></td>'; }
        else { sp = d.createElement('div'); sp.style.height = gap + 'px'; }
        rows[k].parentNode.insertBefore(sp, rows[k]);
      }
    }
    return Math.max(1, Math.ceil(body.scrollHeight / H));
  }
  var running = false;
  function pdf(doc, name, o) {
    o = o || {}; if (running) return Promise.resolve(null);
    running = true; name = fname(name, '.pdf');
    busy(true, 'Đang tạo file PDF…', 0.05);
    var f;
    return Promise.all([load('pdf')]).then(function () {
      var hasPg = /class="pg"/.test(doc), or = o.orient || (hasPg ? 'l' : 'p');
      f = frameFor(doc, or);
      return ready(f).then(function () { return h2cIn(f); }).then(function (h2c) {
        var d = f.contentDocument, J = window.jspdf.jsPDF, pdf = new J({ orientation: or === 'l' ? 'landscape' : 'portrait', unit: 'mm', format: 'a4', compress: true });
        var S = Math.min(2, (window.devicePixelRatio || 1) + .5), mm = A4[or].mm, list, i = 0;
        if (hasPg) list = [].slice.call(d.querySelectorAll('.pg'));
        function add(cv) { pdf.addImage(cv.toDataURL('image/jpeg', .9), 'JPEG', 0, 0, mm[0], mm[1], undefined, 'FAST'); }
        if (hasPg) {
          var step = function () {
            if (i >= list.length) return pdf;
            busy(true, 'Đang tạo file PDF…', .1 + .85 * i / list.length);
            return h2c(list[i], { scale: S, backgroundColor: '#ffffff', useCORS: true, logging: false, windowWidth: A4[or].w }).then(function (cv) { if (i) pdf.addPage(); add(cv); i++; return step(); });
          };
          return step();
        }
        var H = A4[or].h, n = paginate(d, H);
        busy(true, 'Đang tạo file PDF…', .3);
        return h2c(d.body, { scale: S, backgroundColor: '#ffffff', useCORS: true, logging: false, windowWidth: A4[or].w, height: n * H, windowHeight: n * H }).then(function (cv) {
          var ph = Math.round(cv.width * H / A4[or].w);
          for (var k = 0; k < n; k++) {
            var c = document.createElement('canvas'); c.width = cv.width; c.height = ph;
            var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(cv, 0, -k * ph);
            if (k) pdf.addPage(); add(c);
          }
          return pdf;
        });
      });
    }).then(function (p) {
      busy(true, 'Sắp xong…', 1);
      var blob = p.output('blob'); busy(false);
      return save(blob, name);
    }).catch(function (e) {
      busy(false);
      var m = 'Chưa tạo được file PDF: ' + (e && e.message || e);
      if (window.toast) try { toast(m); } catch (_) { alert(m); } else alert(m);
      return null;
    }).then(function (r) { running = false; if (f) f.remove(); return r; });
  }
  var PCSS = 'body{font-family:"Be Vietnam Pro",Arial,sans-serif;font-size:11pt;color:#111;margin:0;padding:34px 38px;background:#fff}'
    + 'h1{font-size:17pt;color:#0A5C64;margin:0 0 4pt}.sub,p{font-size:9.5pt;color:#555;margin:0 0 10pt}table{width:100%;border-collapse:collapse;font-size:9.5pt}'
    + 'th{background:#E6F3F4;text-align:left;padding:5pt 6pt;border-bottom:1.5px solid #0E7C86}td{padding:4pt 6pt;border-bottom:1px solid #e3e3e3;vertical-align:top}'
    + '.rm{margin:8pt 0;padding:7pt 9pt;background:#FDF2E1;border-radius:6px}';
  function pdfHtml(body, name, o) {
    var doc = '<!doctype html><html lang="vi"><head><meta charset="utf-8"><base href="' + BASE + '">'
      + '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&display=swap"><style>' + PCSS + ((o && o.css) || '') + '</style></head><body>' + body + '</body></html>';
    return pdf(doc, name, { orient: 'p' });
  }

  /* ── Excel: thẻ <a download> trỏ tới blob .csv ⇒ .xlsx ── */
  var blobs = new Map(), mk = URL.createObjectURL.bind(URL);
  URL.createObjectURL = function (b) { var u = mk(b); if (b instanceof Blob) { blobs.set(u, b); setTimeout(function () { blobs.delete(u); }, 120000); } return u; };
  function csvToXlsx(blob, name) {
    return Promise.all([load('xlsx'), blob.text()]).then(function (r) {
      var txt = r[1].replace(/^﻿/, ''), X = window.XLSX;
      var wb = X.read(txt, { type: 'string', raw: false, cellDates: true, dateNF: 'dd/mm/yyyy' }), ws = wb.Sheets[wb.SheetNames[0]];
      Object.keys(ws).forEach(function (k) { var c = ws[k]; if (k[0] !== '!' && c && c.t === 'd') { var hm = c.v.getHours() || c.v.getMinutes(); c.z = hm ? 'dd/mm/yyyy hh:mm' : 'dd/mm/yyyy'; } });
      var aoa = X.utils.sheet_to_json(ws, { header: 1, defval: '' }), w = [];
      aoa.forEach(function (row) { row.forEach(function (v, i) { w[i] = Math.min(60, Math.max(w[i] || 6, String(v).length + 2)); }); });
      ws['!cols'] = w.map(function (c) { return { wch: c }; });
      wb.SheetNames[0] !== 'Hanh kiem' && (wb.Props = { Title: name });
      var out = X.write(wb, { bookType: 'xlsx', type: 'array', cellDates: true });
      return new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    });
  }
  HTMLAnchorElement.prototype.click = function () {
    var a = this, b = a.download && blobs.get(a.href);
    if (!b) return realClick.apply(a, arguments);
    if (/\.csv$/i.test(a.download)) {
      var nm = a.download.replace(/\.csv$/i, '.xlsx');
      busy(true, 'Đang tạo file Excel…');
      csvToXlsx(b, nm).then(function (x) { busy(false); save(x, nm); }, function () { busy(false); save(b, a.download); });
      return;
    }
    save(b, a.download);
  };

  /* ── thay lệnh In: báo cáo khổ ngang (baocao.js) và các trang in đơn giản (#printArea, #pr) ── */
  function hookRPT() {
    if (!window.RPT || RPT._dl) return;
    var o0 = RPT.open;
    RPT.open = function (h, t, o) { if (o && o.dry) return o0(h, t, o); var doc = o0(h, t, { dry: true }); pdf(doc, t || 'Bao-cao', { orient: 'l' }); return doc; };
    RPT._dl = 1;
  }
  hookRPT(); document.addEventListener('DOMContentLoaded', hookRPT);
  var print0 = window.print.bind(window);
  window.print = function () {
    var box = document.getElementById('printArea') || document.getElementById('pr');
    if (!box || !box.innerHTML.trim()) return print0();
    var h1 = box.querySelector('h1'), t = (h1 ? h1.textContent : document.title).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
    pdfHtml(box.innerHTML, t.replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 70));
  };

  window.DL = { pdf: pdf, pdfHtml: pdfHtml, save: save, busy: busy, load: load };
})();
