/* ══ MASCOT — nhân vật chibi "cô Thảo" (GVCN 11D3) (dùng chung index.html + phu-huynh.html) ══
   · Ảnh thật: mascot/<phong-cách>/<biểu-cảm>.webp (prompt Gemini: docs/prompt-chibi.md). Thiếu ảnh ⇒ chibi SVG vẽ sẵn.
   · MASCOT.say(emo, html, {ms}) — bong bóng góc dưới trái; MASCOT.img(emo, size) — thẻ <img> để chèn (hướng dẫn, hồ sơ…).
   · Phong cách: localStorage.hk_mascot = 'auto' (theo chủ đề giao diện) | tên phong cách | 'off' (tắt). */
(function () {
  'use strict';
  var EMO = ['chao', 'huong-dan', 'chi-tay', 'vui', 'khen-lon', 'co-vu', 'buon', 'lo-lang', 'nghiem', 'gian', 'suy-nghi', 'ngac-nhien', 'nghi-ngoi', 'an-mung', 'chup-anh', 'cam-on', 'chay'];   /* chay = đang chạy (màn chờ) */
  /* "Vai" của cô Thảo — mỗi vai một bộ ảnh (thư mục mascot/<id>/). c = [áo chính, viền / điểm nhấn, tay áo] */
  var STYLES = [
    { id: 'chu-nhiem', ten: 'Cô Thảo chủ nhiệm', mo: 'Áo gile đen, trang phục hằng ngày', c: ['#24232B', '#E2C27A', '#F4EEE2'] },
    { id: 'giang-day', ten: 'Cô Thảo lên lớp', mo: 'Trên bục giảng, hướng dẫn bài', c: ['#0E7C86', '#FFFFFF', '#0E7C86'] },
    { id: 'ao-dai', ten: 'Cô Thảo áo dài', mo: 'Khai giảng, 20/11, ngày lễ', c: ['#F8F5EF', '#C9A36A', '#F8F5EF'] },
    { id: 'ao-dai-do', ten: 'Cô Thảo áo dài Tết', mo: 'Tết, xuân', c: ['#C0392B', '#F2C230', '#C0392B'] },
    { id: 'stem', ten: 'Cô Thảo STEM', mo: 'Áo blouse, robot, khoa học', c: ['#FFFFFF', '#3D86CF', '#FFFFFF'] },
    { id: 'man-chin', ten: 'Cô Thảo mận chín', mo: 'Áo dài màu mận chín', c: ['#7A1E3A', '#F2C230', '#F8E9ED'] },
    { id: 'mau-nuoc', ten: 'Cô Thảo màu nước', mo: 'Áo dài chàm, nét vẽ màu nước', c: ['#302663', '#D9482B', '#302663'] },
    { id: 'mua-dong', ten: 'Cô Thảo mùa đông', mo: 'Khăn len, áo khoác', c: ['#4A6378', '#C0392B', '#4A6378'] },
    { id: 'trung-thu', ten: 'Cô Thảo Trung thu', mo: 'Đèn ông sao', c: ['#E07B2E', '#F2C230', '#E07B2E'] },
    { id: 'doi-thuong', ten: 'Cô Thảo cuối tuần', mo: 'Áo len, thư thái', c: ['#9B7BC4', '#FFFFFF', '#9B7BC4'] }
  ];
  var BY_THEME = { 'mac-dinh': 'chu-nhiem', 'man-chin': 'man-chin', 'van-mieu': 'ao-dai', 'thu-vang': 'man-chin', 'giay-kraft': 'man-chin',
    'cham-mau-nuoc': 'mau-nuoc', 'trung-thu': 'trung-thu', 'dong-ha-noi': 'mua-dong', 'vo-o-ly': 'giang-day', 'bang-phan': 'giang-day',
    'hoa-phuong': 'chu-nhiem', 'hoa-dao': 'ao-dai-do', 'nha-giao': 'ao-dai', 'ho-guom': 'ao-dai', 'lo-fi': 'doi-thuong',
    'origami': 'giang-day', 'la-xanh': 'giang-day', 'bien-may': 'stem' };
  var OK = {}; /* url → true | false */

  function lsG(k) { try { return localStorage.getItem(k); } catch (_) { return null; } }
  function lsS(k, v) { try { localStorage.setItem(k, v); } catch (_) {} }
  function pick() { return lsG('hk_mascot') || 'auto'; }
  function styleId() {
    var p = pick(); if (p === 'off') return 'off';
    if (p !== 'auto' && STYLES.some(function (s) { return s.id === p; })) return p;
    var d = new Date(), m = d.getMonth() + 1, dd = d.getDate();
    if (m === 11 && dd >= 14 && dd <= 22) return 'ao-dai';            /* tuần lễ 20/11 */
    var th = (window.THEME && THEME.cur && THEME.cur().id) || lsG('hkph_theme') || '';
    return BY_THEME[th] || 'chu-nhiem';
  }
  function sty(id) { return STYLES.filter(function (s) { return s.id === id; })[0] || STYLES[0]; }

  /* ── chibi SVG dự phòng: cô Thảo — tóc dài mái thưa nâu ánh đỏ, mặt tròn phúc hậu, kính cận gọng đen; mắt / miệng / chân mày đổi theo biểu cảm ── */
  function svg(emo, st) {
    var c = sty(st).c, top = c[0], acc = c[1];
    var eye = { happy: 'M36 54q4-5 8 0M56 54q4-5 8 0', open: '', closed: 'M36 53q4 3 8 0M56 53q4 3 8 0', wide: '', sad: '', angry: '' };
    var E = {
      'chao': ['happy', 'M42 64q8 8 16 0', 0], 'huong-dan': ['open', 'M44 64q6 5 12 0', 0], 'chi-tay': ['wink', 'M43 63q7 6 14 0', 0],
      'vui': ['happy', 'M41 62q9 10 18 0', 0], 'khen-lon': ['happy', 'M40 61q10 13 20 0z', 0], 'co-vu': ['open', 'M42 63q8 7 16 0', 0],
      'buon': ['sad', 'M43 67q7-5 14 0', 1], 'lo-lang': ['open', 'M44 66q6-3 12 0', 1], 'nghiem': ['flat', 'M44 65h12', 2],
      'gian': ['angry', 'M44 67q6-4 12 0', 3], 'suy-nghi': ['up', 'M46 65q4 2 8 0', 0], 'ngac-nhien': ['wide', 'M47 64a3 4 0 1 0 6 0a3 4 0 1 0-6 0', 0],
      'nghi-ngoi': ['closed', 'M44 63q6 5 12 0', 0], 'an-mung': ['happy', 'M40 61q10 13 20 0z', 0], 'chup-anh': ['open', 'M45 64q5 4 10 0', 0], 'cam-on': ['closed', 'M43 63q7 6 14 0', 0], 'chay': ['happy', 'M41 62q9 10 18 0', 0]
    }[emo] || ['open', 'M44 64q6 5 12 0', 0];
    var e = E[0], eyes;
    if (e === 'happy' || e === 'closed') eyes = '<path d="' + eye[e] + '" fill="none" stroke="#2A1E1E" stroke-width="2.6" stroke-linecap="round"/>';
    else if (e === 'wink') eyes = '<circle cx="41" cy="52" r="3.6" fill="#2A1E1E"/><circle cx="42.2" cy="50.8" r="1.2" fill="#fff"/><path d="M55 52q4-4 8 0" fill="none" stroke="#2A1E1E" stroke-width="2.6" stroke-linecap="round"/>';
    else if (e === 'wide') eyes = '<circle cx="41" cy="52" r="4.6" fill="#2A1E1E"/><circle cx="59" cy="52" r="4.6" fill="#2A1E1E"/><circle cx="42.5" cy="50.5" r="1.6" fill="#fff"/><circle cx="60.5" cy="50.5" r="1.6" fill="#fff"/>';
    else if (e === 'flat') eyes = '<path d="M37 53h8M55 53h8" stroke="#2A1E1E" stroke-width="2.8" stroke-linecap="round"/>';
    else if (e === 'up') eyes = '<circle cx="42" cy="50" r="3.6" fill="#2A1E1E"/><circle cx="60" cy="50" r="3.6" fill="#2A1E1E"/>';
    else eyes = '<circle cx="40" cy="53.5" r="3.6" fill="#2A1E1E"/><circle cx="60" cy="53.5" r="3.6" fill="#2A1E1E"/><circle cx="41.3" cy="52.2" r="1.3" fill="#fff"/><circle cx="61.3" cy="52.2" r="1.3" fill="#fff"/>';
    var brow = ['', '<path d="M36 44l9 2M64 44l-9 2" stroke="#2A1E1E" stroke-width="2.2" stroke-linecap="round"/>',
      '<path d="M36 45h9M55 45h9" stroke="#2A1E1E" stroke-width="2.2" stroke-linecap="round"/>',
      '<path d="M36 42l9 4M64 42l-9 4" stroke="#2A1E1E" stroke-width="2.4" stroke-linecap="round"/><path d="M70 22l4 4M74 22l-4 4M72 20v8M68 24h8" stroke="#E5484D" stroke-width="2.2" stroke-linecap="round"/>'][E[2]];
    var extra = '';
    if (emo === 'vui' || emo === 'khen-lon' || emo === 'an-mung') extra = '<path d="M14 30l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM84 34l1.5 3.5 3.5 1.5-3.5 1.5L84 44l-1.5-3.5L79 39l3.5-1.5z" fill="#F2C230"/>';
    if (emo === 'buon' || emo === 'lo-lang') extra = '<path d="M70 40q3 5 0 7q-3-2 0-7z" fill="#7CC4F2"/>';
    if (emo === 'suy-nghi') extra = '<text x="74" y="30" font-size="14" font-weight="800" fill="' + top + '">?</text>';
    if (emo === 'ngac-nhien') extra = '<text x="76" y="30" font-size="15" font-weight="800" fill="#E5484D">!</text>';
    var sl = sty(st).c[2], hair = '#5A2E22', hairL = '#7A3E2C', body;
    if (st === 'chu-nhiem') body = '<path d="M20 100q2-23 30-25q28 2 30 25z" fill="' + sl + '"/><path d="M30 100q1-18 9-23l11 13 11-13q8 5 9 23z" fill="' + top + '"/><path d="M39 77l11 13 11-13" fill="none" stroke="' + acc + '" stroke-width="2.4"/><path d="M42 75q8 6 16 0" fill="#fff"/>';
    else if (st === 'ao-dai' || st === 'ao-dai-do' || st === 'mau-nuoc') body = '<path d="M20 100q2-23 30-25q28 2 30 25z" fill="' + top + '"/><rect x="44" y="72" width="12" height="9" rx="3" fill="' + top + '" stroke="' + acc + '" stroke-width="1.6"/><path d="M50 81v19" stroke="' + acc + '" stroke-width="1.6"/>';
    else if (st === 'stem') body = '<path d="M20 100q2-23 30-25q28 2 30 25z" fill="#fff" stroke="#C9D6DB" stroke-width="1.2"/><path d="M42 75l8 10 8-10" fill="#BFD6EE"/><rect x="60" y="86" width="9" height="6" rx="1.5" fill="' + acc + '"/>';
    else if (st === 'mua-dong') body = '<path d="M20 100q2-23 30-25q28 2 30 25z" fill="' + top + '"/><path d="M34 76q16 9 32 0l-2 8q-14 6-28 0z" fill="' + acc + '"/><path d="M58 82l3 14" stroke="' + acc + '" stroke-width="5" stroke-linecap="round"/>';
    else body = '<path d="M20 100q2-23 30-25q28 2 30 25z" fill="' + top + '"/><path d="M42 75l8 9 8-9" fill="none" stroke="' + acc + '" stroke-width="2.6" stroke-linejoin="round"/>';
    if (st === 'trung-thu') extra += '<path d="M84 60l3 6 6 1-4.5 4.5 1 6.5-5.5-3-5.5 3 1-6.5-4.5-4.5 6-1z" fill="#F2C230" stroke="#E07B2E" stroke-width="1"/><path d="M84 52v8" stroke="#8A5A35" stroke-width="1.4"/>';
    if (st === 'giang-day' && (emo === 'huong-dan' || emo === 'chi-tay')) extra += '<path d="M70 92L92 66" stroke="#8A5A35" stroke-width="3" stroke-linecap="round"/>';
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M22 50q0-28 28-28t28 28v34q-6 6-12 4V60H34v28q-6 2-12-4z" fill="' + hair + '"/>' + body +
      '<ellipse cx="50" cy="52" rx="24" ry="23" fill="#F8DECC"/>' +
      '<path d="M25 50q2-24 25-24t25 24q-3-9-8-13q-1 6-6 8q1-6-2-9q-3 6-9 8q1-5-1-8q-4 7-11 9q2-5 1-9q-8 5-14 14z" fill="' + hair + '"/>' +
      '<path d="M30 40q6-8 14-10" stroke="' + hairL + '" stroke-width="1.6" fill="none" opacity=".8"/>' +
      '<circle cx="40" cy="53" r="8.6" fill="rgba(255,255,255,.25)" stroke="#1E1A1A" stroke-width="2.4"/><circle cx="60" cy="53" r="8.6" fill="rgba(255,255,255,.25)" stroke="#1E1A1A" stroke-width="2.4"/><path d="M48.6 52.5q1.4-1.2 2.8 0" fill="none" stroke="#1E1A1A" stroke-width="2.2"/><path d="M31.4 51l-5-2M68.6 51l5-2" stroke="#1E1A1A" stroke-width="2"/>' +
      eyes + brow + '<ellipse cx="33" cy="63" rx="4.6" ry="3" fill="#F4A6A6" opacity=".75"/><ellipse cx="67" cy="63" rx="4.6" ry="3" fill="#F4A6A6" opacity=".75"/>' +
      '<path d="' + E[1] + '" fill="' + (/z$/.test(E[1]) ? '#B8434F' : 'none') + '" stroke="#8A3A3A" stroke-width="2.2" stroke-linecap="round"/>' + extra + '</svg>';
  }
  /* v3.6: bộ ảnh 3D thật (mascot/<vai>/<biểu-cảm>.webp). Vai chưa có bộ 3D ⇒ dùng bộ 3D "chu-nhiem" (không trộn 2D với 3D). */
  /* v3.9: NHIỀU BỘ TRANG PHỤC + CHỌN NGẪU NHIÊN.
     READY[vai] = 1 (đủ biểu cảm) hoặc danh sách biểu cảm đã có. Thêm đợt ảnh mới: python3 tools/mascot/cut.py <vai> <biểu-cảm>=<ảnh> … rồi thêm vào đây.
     Chế độ "auto" (mặc định): mỗi biểu cảm chọn ngẫu nhiên trong các bộ có ảnh đó — nhưng chỉ chọn ảnh ĐÃ TẢI XONG (không nháy, không chậm);
     ảnh chưa tải thì tải ngầm lúc rảnh (requestIdleCallback), lần sau mới dùng. Giữ cùng một ảnh cho cùng biểu cảm ~60 s để vẽ lại không đổi hình liên tục;
     MASCOT.say() (phản ứng khi thao tác) luôn chọn ảnh mới. Tuần lễ 20/11: ưu tiên áo dài. */
  var EM8 = ['chao', 'vui', 'khen-lon', 'co-vu', 'buon', 'nghiem', 'chi-tay', 'cam-on', 'goc'];
  var READY = { 'chu-nhiem': 1,
    'doi-thuong': EM8, 'ao-dai': EM8, 'giang-day': EM8,
    'mau-nuoc': EM8.filter(function (e) { return e !== 'buon'; }),
    'stem': EM8.filter(function (e) { return e !== 'goc'; }), 'mua-dong': EM8.filter(function (e) { return e !== 'goc'; }) };
  function has(st, emo) { var r = READY[st]; return r === 1 || (r && r.indexOf(emo) >= 0); }
  function path(emo, st) { return 'mascot/' + (has(st, emo) ? st : 'chu-nhiem') + '/' + emo + '.webp'; }
  function pool(emo) {
    var all = Object.keys(READY).filter(function (st) { return has(st, emo); });
    var d = new Date(); if (d.getMonth() === 10 && d.getDate() >= 14 && d.getDate() <= 22) { var ad = all.filter(function (s) { return /ao-dai|mau-nuoc/.test(s); }); if (ad.length) return ad; }
    return all;
  }
  var KEEP = {}, QUEUE = [], IDLE = false;
  function warm(u) { if (OK[u] !== undefined || QUEUE.indexOf(u) >= 0) return; QUEUE.push(u); if (!IDLE) idle(); }
  function idle() {
    if (typeof Image === 'undefined' || !QUEUE.length) { IDLE = false; return; } IDLE = true;
    var go = function () { var u = QUEUE.shift(); if (!u) { IDLE = false; return; } var t = new Image(); OK[u] = null;
      t.onload = function () { OK[u] = true; idle(); }; t.onerror = function () { OK[u] = false; idle(); }; t.src = u; };
    (window.requestIdleCallback || function (f) { setTimeout(f, 400); })(go, { timeout: 4000 });
  }
  /* ảnh ngẫu nhiên cho biểu cảm: fresh = chọn mới; any = được chọn cả ảnh chưa tải (PDF / in — trình in chờ ảnh tải) */
  function rnd(emo, o) {
    o = o || {}; var P = pool(emo), now = Date.now(), k = KEEP[emo];
    P.forEach(function (st) { warm('mascot/' + st + '/' + emo + '.webp'); });
    var ok = o.any ? P : P.filter(function (st) { return OK['mascot/' + st + '/' + emo + '.webp'] === true; });
    if (!ok.length) ok = ['chu-nhiem'];
    if (!o.fresh && !o.any && k && now - k.t < 60000 && ok.indexOf(k.st) >= 0) return path(emo, k.st);
    var st = ok[Math.floor(Math.random() * ok.length)];
    if (!o.any) KEEP[emo] = { st: st, t: now };
    return path(emo, st);
  }
  function url(emo, st, o) { return (pick() === 'auto' || !READY[st]) ? rnd(emo, o) : path(emo, st); }
  function img(emo, size, st, o) {
    var cur = styleId(); if (cur === 'off') return '';
    if (st === 'tour') st = pick() === 'auto' ? 'giang-day' : cur;
    st = st || cur;
    size = size || 72;
    var u = emo === 'chay' ? path('chay', 'chu-nhiem') : url(emo, st, o), id = 'm' + Math.random().toString(36).slice(2, 8);
    var fb = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg(emo, st));
    if (OK[u] === false) return '<img class="mascot m-' + emo + '" src="' + fb + '" width="' + size + '" height="' + size + '" alt="">';
    /* ảnh 3D trực tiếp; không tải được (mất mạng) ⇒ hình vẽ dự phòng */
    return '<img class="mascot m3d m-' + emo + '" id="' + id + '" src="' + u + '" width="' + size + '" height="' + size + '" alt="" onerror="this.onerror=null;this.classList.remove(\'m3d\');this.src=\'' + fb + '\'">';
  }

  var css = document.createElement('style');
  css.textContent =
    '#msc{position:fixed;left:14px;bottom:calc(var(--nav,0px) + env(safe-area-inset-bottom,0px) + 78px);z-index:9000;display:flex;align-items:flex-end;gap:2px;pointer-events:none;' +
    'opacity:0;transform:translateY(18px) scale(.92);transition:opacity .25s,transform .35s cubic-bezier(.2,1.4,.4,1)}' +
    '#msc.on{opacity:1;transform:none;pointer-events:auto}' +
    '#msc .mascot{width:108px;height:108px;filter:drop-shadow(0 6px 10px rgba(0,0,0,.18))}' +
    '@keyframes mscb{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}' +
    '#msc .bb{max-width:min(260px,calc(100vw - 140px));margin-bottom:64px;background:#fff;color:#1B333A;border:1px solid #E3ECEE;border-radius:16px 16px 16px 4px;' +
    'padding:9px 12px;font:600 13.5px/1.45 Aptos,"Segoe UI",system-ui,sans-serif;box-shadow:0 8px 24px rgba(20,40,50,.14);cursor:pointer}' +
    '#msc .bb b{color:var(--teal-d,#0A5C64)}' +
    '#msc .bb{position:relative;padding-right:26px}#msc .bb .bx{position:absolute;right:7px;top:3px;font-size:17px;line-height:1;color:#8AA6AD;font-weight:700}' +
    '@media (min-width:1024px){#msc{left:calc(var(--rail,0px) + 22px);bottom:22px}}' +
    '@media (prefers-reduced-motion:reduce){#msc,#msc .mascot{animation:none;transition:none}}' +
    '#tg-card .tgm{float:left;margin:-4px 10px 4px -4px}' +
    '.mascot{transform-origin:50% 90%}' +
    '.m-chao{animation:m-wave 1.2s ease-in-out 3}@keyframes m-wave{0%,100%{transform:rotate(0)}25%{transform:rotate(-8deg)}75%{transform:rotate(8deg)}}' +
    '.m-vui,.m-co-vu{animation:m-hop .55s ease-out 3}@keyframes m-hop{0%,100%{transform:translateY(0)}40%{transform:translateY(-14px) scale(1.04,.97)}}' +
    '.m-khen-lon,.m-an-mung{animation:m-jump 1.1s cubic-bezier(.3,1.6,.5,1) 2}@keyframes m-jump{0%,100%{transform:translateY(0) rotate(0)}35%{transform:translateY(-22px) rotate(-6deg) scale(1.08)}60%{transform:translateY(-10px) rotate(6deg)}}' +
    '.m-buon,.m-lo-lang{animation:m-droop 2.2s ease-in-out 2}@keyframes m-droop{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(5px) rotate(-3deg) scale(.98)}}' +
    '.m-nghiem{animation:m-no .5s ease-in-out 4}@keyframes m-no{0%,100%{transform:rotate(0)}25%{transform:rotate(-5deg)}75%{transform:rotate(5deg)}}' +
    '.m-gian{animation:m-angry .12s linear 10,m-puff .6s ease-in-out 3}@keyframes m-angry{0%,100%{transform:translateX(0)}50%{transform:translateX(-3px)}}@keyframes m-puff{50%{filter:drop-shadow(0 0 8px rgba(229,72,77,.55))}}' +
    '.m-suy-nghi{animation:m-sway 1.8s ease-in-out infinite}@keyframes m-sway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}' +
    '.m-ngac-nhien{animation:m-pop .45s cubic-bezier(.3,1.8,.5,1) 1}@keyframes m-pop{0%{transform:scale(.6)}100%{transform:scale(1)}}' +
    '.m-chi-tay,.m-huong-dan{animation:m-nudge 1s ease-in-out 3}@keyframes m-nudge{0%,100%{transform:translateX(0)}50%{transform:translateX(5px) rotate(3deg)}}' +
    '.m-chup-anh{animation:m-flash .9s ease-out 2}@keyframes m-flash{0%{filter:brightness(1)}15%{filter:brightness(1.6)}100%{filter:brightness(1)}}' +
    '.m-cam-on{animation:m-bow 1.6s ease-in-out 2}@keyframes m-bow{0%,100%{transform:rotate(0)}40%{transform:rotate(10deg) translateY(4px)}}' +
    /* màn chờ: cô Thảo chạy trên thanh tiến trình */
    '.mld{display:flex;flex-direction:column;align-items:center;gap:10px;width:min(320px,78vw);margin:0 auto;font-family:Aptos,"Segoe UI",system-ui,sans-serif}' +
    '.mld-trk{position:relative;width:100%;height:12px;border-radius:99px;background:#E3ECEE;margin-top:104px;box-shadow:inset 0 1px 2px rgba(0,0,0,.06)}' +
    '.mld-fill{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:99px;background:linear-gradient(90deg,var(--teal-l,#6FBEC5),var(--teal,#0E7C86));transition:width .25s linear}' +
    '.mld-fill::after{content:"";position:absolute;inset:0;border-radius:99px;background:repeating-linear-gradient(45deg,rgba(255,255,255,.28) 0 8px,transparent 8px 16px);animation:mld-st 0.8s linear infinite}' +
    '@keyframes mld-st{to{background-position:22px 0}}' +
    '.mld-run{position:absolute;bottom:2px;left:0;width:96px;height:96px;transform:translateX(-50%);transition:left .25s linear}' +
    '.mld-run .mascot{width:96px;height:96px;animation:mld-bob .36s ease-in-out infinite;filter:drop-shadow(0 4px 6px rgba(0,0,0,.15))}' +
    '@keyframes mld-bob{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-9px) rotate(-2deg)}}' +
    '.mld-run i{position:absolute;bottom:2px;left:6px;width:10px;height:10px;border-radius:50%;background:#C9D9DD;opacity:0;animation:mld-dust .72s ease-out infinite}' +
    '.mld-run i.d2{animation-delay:.36s;left:12px;width:7px;height:7px}' +
    '@keyframes mld-dust{0%{opacity:.8;transform:translate(0,0) scale(.6)}100%{opacity:0;transform:translate(-26px,-8px) scale(1.4)}}' +
    '.mld-run::before{content:"";position:absolute;left:-26px;top:26px;width:22px;height:3px;border-radius:3px;background:#C9D9DD;box-shadow:4px 9px 0 #DCE7EA,-2px 18px 0 #C9D9DD;animation:mld-ln .36s linear infinite}' +
    '@keyframes mld-ln{0%{opacity:.9;transform:translateX(0)}100%{opacity:.2;transform:translateX(-10px)}}' +
    '.mld-pct{font-weight:800;font-size:13px;color:var(--teal-d,#0A5C64);font-variant-numeric:tabular-nums}' +
    '.mld-msg{font-size:14.5px;font-weight:600;color:#41566F;text-align:center;min-height:22px;transition:opacity .25s}' +
    '@media (prefers-reduced-motion:reduce){.mld-run .mascot,.mld-run i,.mld-run::before,.mld-fill::after{animation:none!important}}' +
    '@media (prefers-reduced-motion:reduce){.mascot{animation:none!important}}';
  document.head.appendChild(css);

  var hideT = null;
  function say(emo, html, o) {
    o = o || {};
    if (styleId() === 'off') return;
    var b = document.getElementById('msc');
    if (!b) { b = document.createElement('div'); b.id = 'msc'; document.body.appendChild(b); b.onclick = function () { b.classList.remove('on'); }; }
    b.innerHTML = img(emo, 108, null, { fresh: true }) + (html ? '<div class="bb">' + html + '<span class="bx" aria-label="Đóng">×</span></div>' : '');
    /* v4.8: chỉ hiện khi trang đang hiển thị, và hẹn giờ ẩn tính TỪ LÚC hiện. Trước đây trang mở ở chế độ nền (bấm link từ Zalo / Gmail,
       tắt màn hình) ⇒ hẹn giờ ẩn chạy trước, rồi khung mới hiện ⇒ bong bóng nằm mãi trên màn hình. */
    var id = ++sayN;
    clearTimeout(hideT);
    var show = function () {
      if (id !== sayN) return;
      if (document.visibilityState === 'hidden') { document.addEventListener('visibilitychange', function f() { document.removeEventListener('visibilitychange', f); show(); }); return; }
      requestAnimationFrame(function () { if (id !== sayN) return; b._t = Date.now(); b.classList.add('on'); clearTimeout(hideT); hideT = setTimeout(function () { b.classList.remove('on'); }, o.ms || 3400); });
    };
    show();
  }
  var sayN = 0;
  /* chạm ra chỗ khác / cuộn trang ⇒ bong bóng tự ẩn, không che nội dung */
  function hideSay(e) { var b = document.getElementById('msc'); if (b && b.classList.contains('on') && !(e && e.target && e.target.closest && e.target.closest('#msc'))) b.classList.remove('on'); }
  if (document.addEventListener) document.addEventListener('pointerdown', hideSay, true);
  if (typeof addEventListener === 'function') addEventListener('scroll', function () { var b = document.getElementById('msc'); if (b && b.classList.contains('on') && Date.now() - (b._t || 0) > 900) hideSay(); }, true);

  /* MASCOT.loader(host, {msgs:[...], every:ms}) — thanh tiến trình + cô Thảo chạy; trả {done()}. Ảnh mascot/<vai>/chay.webp (WebP động) nếu có. */
  function loader(host, o) {
    o = o || {}; var msgs = o.msgs || ['Đang tải…'], every = o.every || 1800;
    host.innerHTML = '<div class="mld"><div class="mld-trk"><div class="mld-fill"></div><div class="mld-run">' + img('chay', 96) +
      '<i class="d1"></i><i class="d2"></i></div></div><div class="mld-pct">0%</div><div class="mld-msg">' + msgs[0] + '</div></div>';
    var p = 0, t0 = Date.now(), mi = 0, fill = host.querySelector('.mld-fill'), run = host.querySelector('.mld-run'),
        pct = host.querySelector('.mld-pct'), msg = host.querySelector('.mld-msg'), tm = null;
    function draw() { fill.style.width = p + '%'; run.style.left = p + '%'; pct.textContent = Math.round(p) + '%'; }
    function tick() {
      if (!host.isConnected || !fill.isConnected) { clearInterval(tm); return; }
      p += (96 - p) * (p < 60 ? 0.05 : 0.02); draw();
      var k = Math.min(msgs.length - 1, Math.floor((Date.now() - t0) / every));
      if (k !== mi) { mi = k; msg.style.opacity = 0; setTimeout(function () { msg.innerHTML = msgs[mi]; msg.style.opacity = 1; }, 220); }
    }
    tm = setInterval(tick, 120); draw();
    return { done: function () { clearInterval(tm); p = 100; draw(); }, stop: function () { clearInterval(tm); } };
  }

  window.MASCOT = {
    loader: loader,
    EMO: EMO, STYLES: STYLES.filter(function (s) { return READY[s.id]; }), ALL_STYLES: STYLES, BY_THEME: BY_THEME,
    say: say, img: img, svg: svg, style: styleId, pick: pick, rnd: rnd, READY: READY,
    set: function (v) { lsS('hk_mascot', v); }
  };
})();
