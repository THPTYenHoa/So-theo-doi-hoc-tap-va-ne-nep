/* ══ WEB DEMO — màn nhập mã truy cập + nút "Bản demo" (đổi vai, Hộp thư mô phỏng, làm lại dữ liệu, thoát) ══
   Nạp cuối <body> của demo.html / demo-phu-huynh.html, sau demo/server.js. */
(function () {
  'use strict';
  if (!window.DEMO) return;
  var D = window.DEMO, PH = D.page === 'ph';
  var css = document.createElement('style'); css.id = 'demo-css';
  css.textContent = [
    '#dg{position:fixed;inset:0;z-index:2147483000;background:#F3F7FA;display:flex;align-items:center;justify-content:center;padding:16px;font-family:Aptos,"Segoe UI",system-ui,sans-serif;color:#003047}',
    '#dg .bx{width:100%;max-width:420px;background:#fff;border:1px solid #E6EAEF;border-radius:20px;padding:30px 26px 24px;text-align:center}',
    '#dg img{width:84px;height:84px;border-radius:50%}',
    '#dg h1{font-size:34px;letter-spacing:.5px;margin:12px 0 2px;white-space:nowrap}',
    '#dg .sub{color:#3A5CAA;font-weight:700;margin:2px 0 4px}',
    '#dg .tag{display:inline-block;font-size:12px;font-weight:700;color:#7A5A00;background:#FFF4D6;border:1px solid #F1DB9C;border-radius:999px;padding:3px 10px;margin:6px 0 14px}',
    '#dg p{font-size:14px;color:#4A6170;line-height:1.5;margin:0 0 16px}',
    '#dg input{width:100%;box-sizing:border-box;font:inherit;font-size:20px;text-align:center;letter-spacing:1px;padding:12px;border:1.5px solid #C3CDD8;border-radius:12px;outline:none}',
    '#dg input:focus{border-color:#3A5CAA;box-shadow:0 0 0 3px #CFE2F3}',
    '#dg button{width:100%;margin-top:12px;font:inherit;font-size:16px;font-weight:700;color:#fff;background:#3A5CAA;border:0;border-radius:12px;padding:12px;cursor:pointer}',
    '#dg .er{color:#C0392B;font-size:13px;min-height:18px;margin-top:8px}',
    '#dg .ft{font-size:12px;color:#7D8E99;margin-top:14px}',
    '#dg .bx.shake{animation:dgs .35s}@keyframes dgs{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}',
    '#dm{position:fixed;right:14px;bottom:16px;z-index:2147482000;font-family:Aptos,"Segoe UI",system-ui,sans-serif}',
    '@media(max-width:760px){#dm{bottom:auto;top:70px;right:8px}#dm .pill{padding:4px 9px;font-size:11px;opacity:.92}#dm .pill i{display:none}#dm .mn{bottom:auto;top:34px}}',
    '#dm .pill{display:flex;align-items:center;gap:6px;background:#fff;color:#7A5A00;border:1px solid #F1DB9C;border-radius:999px;padding:7px 12px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(0,48,71,.10)}',
    '#dm .pill b{background:#C0392B;color:#fff;border-radius:999px;font-size:11px;padding:1px 6px}',
    '#dm .mn{position:absolute;right:0;bottom:44px;width:270px;background:#fff;border:1px solid #E6EAEF;border-radius:14px;padding:8px;display:none;box-shadow:0 8px 24px rgba(0,48,71,.14)}',
    '#dm.open .mn{display:block}',
    '#dm .mn h4{margin:6px 8px 4px;font-size:12px;color:#7D8E99;font-weight:700;text-transform:uppercase;letter-spacing:.4px}',
    '#dm .mn a{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:9px 10px;border-radius:10px;color:#003047;text-decoration:none;font-size:14px;cursor:pointer}',
    '#dm .mn a:hover{background:#F0F7FF}#dm .mn a.on{background:#F0F7FF;color:#3A5CAA;font-weight:700}',
    '#dm .mn hr{border:0;border-top:1px solid #E6EAEF;margin:6px 4px}',
    '#dbx{position:fixed;inset:0;z-index:2147483100;background:rgba(0,30,45,.35);display:flex;align-items:center;justify-content:center;padding:12px;font-family:Aptos,"Segoe UI",system-ui,sans-serif}',
    '#dbx .w{background:#fff;border-radius:16px;width:100%;max-width:880px;height:min(640px,92vh);display:flex;flex-direction:column;overflow:hidden;border:1px solid #E6EAEF}',
    '#dbx .hd{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #E6EAEF;color:#003047;font-weight:700}',
    '#dbx .hd span{font-weight:400;font-size:12px;color:#7D8E99;margin-left:6px}',
    '#dbx .hd button{border:0;background:#F0F7FF;border-radius:8px;width:32px;height:32px;font-size:18px;cursor:pointer;color:#003047}',
    '#dbx .bd{flex:1;display:flex;min-height:0}',
    '#dbx .ls{width:44%;border-right:1px solid #E6EAEF;overflow:auto}',
    '#dbx .it{padding:10px 14px;border-bottom:1px solid #F1F4F7;cursor:pointer;font-size:13px;color:#4A6170}',
    '#dbx .it b{display:block;color:#003047;font-size:14px;margin-bottom:2px}#dbx .it.u b::before{content:"● ";color:#3A5CAA}',
    '#dbx .it.on{background:#F0F7FF}',
    '#dbx iframe{flex:1;border:0;min-width:0}',
    '#dbx .em{padding:24px;color:#7D8E99;font-size:14px;line-height:1.5}',
    '@media(max-width:760px){#dbx .bd{flex-direction:column}#dbx .ls{width:auto;max-height:38%;border-right:0;border-bottom:1px solid #E6EAEF}}'
  ].join('\n');
  document.head.appendChild(css);
  function el(h) { var d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstChild; }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* bản demo không hiện "Có gì mới" của sổ thật */
  try { var hid = {}; (window.HK_UPDATES || []).forEach(function (u) { hid[u.id] = 1; }); localStorage.setItem('hk_upd_hide', JSON.stringify(hid)); } catch (e) {}
  /* link tới trang thật trong các file dùng chung (v6.js…) ⇒ trang demo tương ứng */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    var h = a.getAttribute('href') || '';
    if (/(^|\/)phu-huynh\.html/.test(h) && !/demo-phu-huynh/.test(h)) { e.preventDefault(); location.href = h.replace(/(^|\/)phu-huynh\.html/, '$1demo-phu-huynh.html'); }
    else if (h === './' || h === 'index.html') { e.preventDefault(); location.href = 'demo.html'; }
  }, true);

  /* ── màn nhập mã ── */
  if (!D.unlocked) {
    var g = el('<div id="dg"><form class="bx" autocomplete="off"><img src="img/logo-yenhoa.webp" alt="Logo THPT Yên Hòa">'
      + '<h1>THPT YÊN HÒA</h1><div class="sub">Theo dõi thi đua và nề nếp</div><div class="tag">BẢN DEMO · DỮ LIỆU ẢO</div>'
      + '<p>Bản trải nghiệm có đầy đủ tính năng như ứng dụng thật, dùng dữ liệu ảo và máy chủ ảo riêng — mọi thao tác không ảnh hưởng tới sổ thật của lớp.</p>'
      + '<input id="dgc" placeholder="Nhập mã truy cập" aria-label="Mã truy cập" autocapitalize="off" spellcheck="false">'
      + '<div class="er" id="dge"></div><button type="submit">Vào bản demo</button>'
      + '<div class="ft">Mã truy cập được ghi trong video giới thiệu / hồ sơ dự thi.</div></form></div>');
    document.body.appendChild(g);
    var f = g.querySelector('form'), inp = g.querySelector('#dgc');
    setTimeout(function () { try { inp.focus(); } catch (e) {} }, 60);
    f.onsubmit = function (ev) {
      ev.preventDefault();
      if (D.unlock(inp.value)) { if (!PH) D.setRole('gvcn'); location.reload(); return; }
      g.querySelector('#dge').textContent = 'Mã chưa đúng. Bạn kiểm tra lại giúp (viết liền, không dấu cách).';
      f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake');
    };
    return;
  }

  /* ── nút "Bản demo" ── */
  var cur = D.role();
  var roles = [['gvcn', 'Giáo viên chủ nhiệm'], ['lt', 'Cán bộ lớp'], ['ph', 'Cha mẹ học sinh']];
  var dm = el('<div id="dm"><div class="mn"><h4>Xem với vai trò</h4>'
    + roles.map(function (r) { return '<a data-r="' + r[0] + '" class="' + (r[0] === cur ? 'on' : '') + '">' + r[1] + (r[0] === cur ? '<span>✓</span>' : '') + '</a>'; }).join('')
    + '<hr><a data-k="mail">Hộp thư mô phỏng <span id="dmn"></span></a><a data-k="reset">Làm lại dữ liệu ảo</a><a data-k="out">Thoát bản demo</a></div>'
    + '<div class="pill" role="button" tabindex="0">Bản demo<i style="font-style:normal"> · ' + esc((D.ROLE_T[cur] || '').replace(/ \(.*\)/, '')) + '</i> <b id="dmb" hidden></b></div></div>');
  document.body.appendChild(dm);
  var pill = dm.querySelector('.pill');
  pill.onclick = function () { dm.classList.toggle('open'); };
  document.addEventListener('click', function (e) { if (!dm.contains(e.target)) dm.classList.remove('open'); }, true);
  function badge() { var n = D.mails().filter(function (m) { return m.unread; }).length, b = dm.querySelector('#dmb');
    b.hidden = !n; b.textContent = n; dm.querySelector('#dmn').textContent = n ? '(' + n + ' mới)' : ''; }
  badge(); window.addEventListener('demo-mail', badge);
  dm.querySelector('.mn').onclick = function (e) {
    var a = e.target.closest('a'); if (!a) return;
    var r = a.getAttribute('data-r'), k = a.getAttribute('data-k');
    if (r) { if (r === cur) { dm.classList.remove('open'); return; }
      D.setRole(r); location.href = r === 'ph' ? 'demo-phu-huynh.html' : 'demo.html'; return; }
    if (k === 'mail') { dm.classList.remove('open'); box(); }
    if (k === 'reset' && confirm('Xoá mọi thao tác đã thử và tạo lại dữ liệu ảo ban đầu?')) { D.reset(); location.reload(); }
    if (k === 'out') { D.lock(); location.href = 'demo.html'; }
  };

  /* ── Hộp thư mô phỏng: email hệ thống "gửi" đi trong bản demo ── */
  function box() {
    var M = D.mails(), x = el('<div id="dbx"><div class="w"><div class="hd"><div>Hộp thư mô phỏng<span>email hệ thống sẽ gửi khi dùng thật</span></div><button aria-label="Đóng">×</button></div>'
      + '<div class="bd"><div class="ls">' + (M.length ? M.map(function (m, i) { return '<div class="it' + (m.unread ? ' u' : '') + '" data-i="' + i + '"><b>' + esc(m.subject) + '</b>Tới: ' + esc(m.to) + ' · ' + esc(m.at) + '</div>'; }).join('')
        : '<div class="em">Chưa có thư nào. Thử ghi điểm nề nếp cho một học sinh — email báo cha mẹ học sinh sẽ hiện ở đây.</div>') + '</div><iframe sandbox="allow-popups allow-popups-to-escape-sandbox" title="Nội dung thư"></iframe></div></div></div>');
    document.body.appendChild(x);
    var fr = x.querySelector('iframe');
    function show(i) { var m = M[i]; if (!m) return; x.querySelectorAll('.it').forEach(function (n) { n.classList.toggle('on', +n.getAttribute('data-i') === i); });
      fr.srcdoc = '<base target="_blank"><div style="font-family:Aptos,Arial,sans-serif;color:#003047;padding:14px 18px"><div style="font-size:12px;color:#7D8E99">Từ: ' + esc(m.from) + '<br>Tới: ' + esc(m.to) + ' · ' + esc(m.at) + '</div><h3 style="margin:8px 0 12px">' + esc(m.subject) + '</h3>' + m.html + '</div>'; }
    x.querySelector('.ls').onclick = function (e) { var it = e.target.closest('.it'); if (it) show(+it.getAttribute('data-i')); };
    function close() { x.remove(); D.readAll(); badge(); }
    x.querySelector('.hd button').onclick = close; x.onclick = function (e) { if (e.target === x) close(); };
    if (M.length) show(0);
  }
  window.DEMO.box = box;
})();
