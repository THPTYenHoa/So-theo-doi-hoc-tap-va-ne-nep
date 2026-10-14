/* ══ TOUR — hướng dẫn từng bước trên chính giao diện (dùng chung index.html + phu-huynh.html) ══
   TOUR.run(steps, {key, onEnd}) · step = {el:'selector' | ['sel1','sel2'] (lấy cái đang hiện), t:'tiêu đề', d:'mô tả HTML',
   pre: fn (chuẩn bị màn hình: chuyển tab, mở khung…; có thể trả Promise), wait: ms, pos:'auto'|'top'|'bottom'}
   Vùng sáng + vòng nhấp nháy + bàn tay chỉ vào đúng chỗ cần bấm; Tiếp / Quay lại / Bỏ qua; phím ← → Esc.
   Không bấm hộ người dùng — chỉ chỉ chỗ, nên không ghi nhầm dữ liệu. */
(function () {
  'use strict';
  var css = document.createElement('style');
  css.textContent =
    '#tg-hole{position:fixed;z-index:9990;border-radius:12px;box-shadow:0 0 0 9999px rgba(18,32,40,.58);transition:all .35s cubic-bezier(.2,.8,.2,1);pointer-events:none}' +
    '#tg-hole.none{box-shadow:0 0 0 9999px rgba(18,32,40,.58);width:0!important;height:0!important;left:50%!important;top:40%!important}' +
    '#tg-ring{position:fixed;z-index:9991;border:2.5px solid #FFD25E;border-radius:13px;pointer-events:none;transition:all .35s cubic-bezier(.2,.8,.2,1);animation:tgp 1.6s ease-out infinite}' +
    '@keyframes tgp{0%{box-shadow:0 0 0 0 rgba(255,210,94,.75)}70%{box-shadow:0 0 0 14px rgba(255,210,94,0)}100%{box-shadow:0 0 0 0 rgba(255,210,94,0)}}' +
    '#tg-hand{position:fixed;z-index:9992;width:34px;height:34px;pointer-events:none;transition:all .45s cubic-bezier(.2,.8,.2,1);animation:tgh 1.3s ease-in-out infinite;filter:drop-shadow(0 3px 5px rgba(0,0,0,.35))}' +
    '@keyframes tgh{0%,100%{transform:translate(0,0)}50%{transform:translate(-5px,-6px)}}' +
    '#tg-card{position:fixed;z-index:9993;width:min(340px,calc(100vw - 24px));background:#fff;color:#1B333A;border-radius:16px;padding:16px 16px 12px;' +
    'box-shadow:0 18px 50px rgba(0,0,0,.28);font-family:Aptos,"Segoe UI",system-ui,sans-serif;transition:top .35s,left .35s}' +
    '#tg-card .st{font-size:11.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--teal,#0E7C86);margin-bottom:3px}' +
    '#tg-card h4{margin:0 0 6px;font-size:16.5px;line-height:1.3}' +
    '#tg-card p{margin:0;font-size:14px;line-height:1.55;color:#41566F}' +
    '#tg-card p b{color:#1B333A}' +
    '#tg-card .bar{height:4px;border-radius:4px;background:#EEF2F4;margin:12px 0 10px;overflow:hidden}' +
    '#tg-card .bar i{display:block;height:100%;background:var(--teal,#0E7C86);transition:width .3s}' +
    '#tg-card .bt{display:flex;align-items:center;gap:8px}' +
    '#tg-card .bt .sk{margin-right:auto;font-size:13px;color:#7A8999;background:none;border:0;cursor:pointer;padding:6px 2px}' +
    '#tg-card .bt button.b{height:38px;padding:0 15px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;border:1px solid #D5E0E3;background:#fff;color:#1B333A}' +
    '#tg-card .bt button.p{background:var(--teal,#0E7C86);border-color:var(--teal,#0E7C86);color:#fff}' +
    '#tg-card .bt button[disabled]{opacity:.4;cursor:default}';
  document.head.appendChild(css);

  var HAND = '<svg viewBox="0 0 24 24"><path fill="#fff" stroke="#1B333A" stroke-width="1.3" stroke-linejoin="round" d="M9 11V4.5a1.5 1.5 0 0 1 3 0V10l.5-.1V3.5a1.5 1.5 0 0 1 3 0v6.6l.5.1V5a1.5 1.5 0 0 1 3 0v8.5c0 4.2-2.8 7.5-6.8 7.5-2.6 0-4.3-1.2-5.6-3.3L4 13.5a1.5 1.5 0 0 1 2.4-1.8L9 14z"/></svg>';
  var st = null;

  function vis(el) { if (!el) return false; var r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; }
  function find(sel) {
    var list = [].concat(sel || []);
    for (var i = 0; i < list.length; i++) {
      var all = document.querySelectorAll(list[i]);
      for (var j = 0; j < all.length; j++) if (vis(all[j])) return all[j];
    }
    return null;
  }
  function el(id, html) { var e = document.getElementById(id); if (!e) { e = document.createElement('div'); e.id = id; if (html) e.innerHTML = html; document.body.appendChild(e); } return e; }

  function place() {
    if (!st) return;
    var s = st.steps[st.i], t = find(s.el), hole = el('tg-hole'), ring = el('tg-ring'), hand = el('tg-hand', HAND), card = el('tg-card');
    var W = innerWidth, H = innerHeight, cw = Math.min(340, W - 24), ch = card.offsetHeight || 190, pad = 6;
    if (t) {
      t.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      var r = t.getBoundingClientRect(), x = Math.max(4, r.left - pad), y = Math.max(4, r.top - pad),
          w = Math.min(W - 8, r.width + pad * 2), h = Math.min(H - 8, r.height + pad * 2);
      hole.className = ''; [hole, ring].forEach(function (e) { e.style.left = x + 'px'; e.style.top = y + 'px'; e.style.width = w + 'px'; e.style.height = h + 'px'; });
      ring.style.display = ''; hand.style.display = '';
      hand.style.left = Math.min(W - 40, x + w * .5 + 6) + 'px'; hand.style.top = Math.min(H - 40, y + h * .55) + 'px';
      var below = s.pos === 'bottom' || (s.pos !== 'top' && y + h + ch + 16 < H);
      var top = below ? y + h + 12 : Math.max(10, y - ch - 12);
      if (!below && y - ch - 12 < 10) top = Math.max(10, Math.min(H - ch - 10, y + h + 12));
      card.style.top = top + 'px';
      card.style.left = Math.max(12, Math.min(W - cw - 12, x + w / 2 - cw / 2)) + 'px';
    } else {
      hole.className = 'none'; ring.style.display = 'none'; hand.style.display = 'none';
      card.style.top = Math.max(12, H / 2 - ch / 2) + 'px'; card.style.left = (W / 2 - cw / 2) + 'px';
    }
  }
  function draw() {
    var s = st.steps[st.i], n = st.steps.length, card = el('tg-card');
    var emo = s.emo || (st.i === 0 ? 'chao' : st.i === n - 1 ? 'cam-on' : s.el ? 'chi-tay' : 'huong-dan');
    var av = (window.MASCOT && MASCOT.style() !== 'off') ? '<span class="tgm">' + MASCOT.img(emo, 58, 'tour') + '</span>' : '';
    card.innerHTML = av + '<div class="st">' + (st.title ? st.title + ' · ' : '') + 'Bước ' + (st.i + 1) + '/' + n + '</div><h4>' + s.t + '</h4><p>' + (s.d || '') + '</p>' +
      '<div class="bar"><i style="width:' + Math.round((st.i + 1) / n * 100) + '%"></i></div>' +
      '<div class="bt"><button class="sk" data-a="x">Bỏ qua</button><button class="b" data-a="b"' + (st.i ? '' : ' disabled') + '>Quay lại</button>' +
      '<button class="b p" data-a="n">' + (st.i === n - 1 ? 'Xong' : 'Tiếp') + '</button></div>';
    card.querySelector('[data-a=x]').onclick = end;
    card.querySelector('[data-a=b]').onclick = function () { go(st.i - 1); };
    card.querySelector('[data-a=n]').onclick = function () { st.i === n - 1 ? end(true) : go(st.i + 1); };
    place(); setTimeout(place, 60);
  }
  function go(i) {
    if (!st || i < 0 || i >= st.steps.length) return;
    st.i = i; var s = st.steps[i];
    Promise.resolve(s.pre ? (function () { try { return s.pre(); } catch (e) {} })() : null)
      .then(function () { return new Promise(function (r) { setTimeout(r, s.wait == null ? 120 : s.wait); }); })
      .then(function () { if (st && st.i === i) draw(); });
  }
  function end(done) {
    if (!st) return;
    var o = st; st = null;
    ['tg-hole', 'tg-ring', 'tg-hand', 'tg-card'].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });
    try { if (o.key) localStorage.setItem(o.key, '1'); } catch (_) {}
    if (o.onEnd) try { o.onEnd(!!done); } catch (_) {}
  }
  addEventListener('resize', function () { if (st) place(); });
  addEventListener('scroll', function () { if (st) place(); }, true);
  addEventListener('keydown', function (e) {
    if (!st) return;
    if (e.key === 'Escape') end(); else if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); st.i === st.steps.length - 1 ? end(true) : go(st.i + 1); }
    else if (e.key === 'ArrowLeft') go(st.i - 1);
  });

  window.TOUR = {
    run: function (steps, o) { o = o || {}; if (st) end(); st = { steps: steps, i: 0, key: o.key, onEnd: o.onEnd, title: o.title || '' }; go(0); },
    seen: function (key) { try { return localStorage.getItem(key) === '1'; } catch (_) { return true; } },
    active: function () { return !!st; },
    end: end
  };
})();
