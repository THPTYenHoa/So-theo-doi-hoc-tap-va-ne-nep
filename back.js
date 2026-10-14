/* ══ v4.8 — NÚT QUAY LẠI (Back) CỦA TRÌNH DUYỆT / ĐIỆN THOẠI (window.BACK) ═══════════════════════════════════════
   Mục tiêu: bấm Back ⇒ quay lại màn trước TRONG app (đóng hộp đang mở, về mục vừa xem), không bật ra trang web khác.
   • Hộp / bảng đang mở (khung bên, màn chi tiết, thông báo cập nhật, tìm kiếm, menu…) = 1 bước lịch sử: mở ⇒ pushState,
     Back ⇒ đóng hộp. Đóng bằng nút × ⇒ tự lùi 1 bước để lịch sử không dư.
     Danh sách hộp: BACK.add({id, open:()=>bool, close:()=>void, back?:()=>bool}) — `back` trả true nếu đã lùi 1 cấp bên trong
     (vd. màn chi tiết nhiều tầng) và hộp vẫn còn mở.
   • Đổi mục (Ghi điểm, Thống kê…): trang chính gọi BACK.view(key, apply) — Back ⇒ apply(key cũ).
     Trang phụ huynh dùng #hash nên trình duyệt tự lùi được; BACK chỉ chặn việc thoát khỏi trang.
   • Đầu lịch sử có 1 "chốt": Back tới chốt ⇒ báo "Bấm Quay lại lần nữa để thoát", bấm tiếp trong 2,5 giây mới rời trang. */
(function () {
  if (window.BACK) return;
  var L = [], seen = {}, ign = 0, inPop = false, curView = null, applyView = null, lastGuard = 0, ready = false;
  var hs = function () { return history.state || {}; };
  function toast(t) {
    var f = document.getElementById('bk-t');
    if (!f) { f = document.createElement('div'); f.id = 'bk-t'; f.style.cssText = 'position:fixed;left:50%;bottom:calc(84px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:#1B333A;color:#fff;padding:10px 18px;border-radius:999px;font:600 14px/1.4 Aptos,"Segoe UI",system-ui,sans-serif;z-index:100001;max-width:calc(100vw - 32px);text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.2);transition:opacity .25s'; document.body.appendChild(f); }
    f.textContent = t; f.style.opacity = '1'; clearTimeout(f._t); f._t = setTimeout(function () { f.style.opacity = '0'; }, 2400);
  }
  function init() {
    if (ready) return; ready = true;
    var st = hs();
    if (!st.bkG && !st.bk) {   /* lần đầu: đặt chốt rồi đứng ở bước sau chốt */
      history.replaceState({ bkG: 1 }, '');
      history.pushState({ bk: 1, v: curView }, '');
    }
  }
  /* theo dõi hộp mở / đóng */
  function scan() {
    L.forEach(function (o) {
      var on = false; try { on = !!o.open(); } catch (e) {}
      if (on && !seen[o.id]) { seen[o.id] = 1; init(); history.pushState({ bk: 1, ov: o.id, v: curView }, ''); }
      else if (!on && seen[o.id]) { delete seen[o.id]; if (!inPop && hs().ov === o.id) { ign++; history.back(); } }
    });
  }
  var q = 0;
  function sched() { if (q) return; q = requestAnimationFrame(function () { q = 0; scan(); }); }
  new MutationObserver(sched).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'hidden', 'style'] });

  addEventListener('popstate', function (e) {
    if (ign) { ign--; return; }
    var st = e.state || {};
    /* 1) có hộp đang mở ⇒ đóng hộp trên cùng (hoặc lùi 1 cấp bên trong) */
    var top = null;
    for (var i = L.length - 1; i >= 0; i--) { var on = false; try { on = !!L[i].open(); } catch (x) {} if (on && seen[L[i].id]) { top = L[i]; break; } }
    if (top) {
      inPop = true;
      try {
        if (top.back && top.back()) { history.pushState({ bk: 1, ov: top.id, v: curView }, ''); }
        else { delete seen[top.id]; top.close(); }
      } catch (x) {}
      setTimeout(function () { inPop = false; }, 0);
      if (st.bkG) { history.pushState({ bk: 1, v: curView }, ''); }
      return;
    }
    /* 2) về tới chốt ⇒ hỏi trước khi thoát */
    if (st.bkG) {
      if (Date.now() - lastGuard < 2500) { history.back(); return; }
      lastGuard = Date.now(); toast('Bấm Quay lại thêm lần nữa để thoát ứng dụng');
      history.pushState({ bk: 1, v: curView }, ''); return;
    }
    /* 3) đổi mục */
    if (st.bk && st.v && applyView && st.v !== curView) { curView = st.v; inPop = true; try { applyView(st.v); } finally { setTimeout(function () { inPop = false; }, 0); } }
  });

  window.BACK = {
    add: function (o) { L.push(o); sched(); },
    init: init,
    /* gọi khi người dùng đổi mục (không phải do Back) */
    view: function (v, apply) {
      if (apply) applyView = apply;
      if (inPop || v === curView) { curView = v; return; }
      var first = curView == null; curView = v; init();
      if (first) history.replaceState({ bk: 1, v: v }, ''); else history.pushState({ bk: 1, v: v }, '');
    },
    /* trang dùng #hash để chuyển màn: báo trước khi đổi hash ⇒ sự kiện popstate do chính app gây ra không bị hiểu là bấm Back */
    hashNav: function (h) { h = String(h || ''); if (h.charAt(0) !== '#') h = '#' + h; if (h !== location.hash && !(h === '#' && !location.hash)) ign++; },
    busy: function () { return inPop; },
    toast: toast
  };
})();
