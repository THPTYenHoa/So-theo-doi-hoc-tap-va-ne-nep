/* ══ v4.5 — TÍNH NĂNG SẮP RA MẮT (window.ROADMAP) ══════════════════════════════════════
   Một trang (hộp) liệt kê lộ trình mở rộng, khớp phần "Mở rộng" của bài dự thi: Rèn luyện & nề nếp (đang dùng) +
   các mảng đang phát triển. Mở từ: menu tài khoản (avatar), màn đăng nhập (dưới link hướng dẫn), trang phụ huynh. */
(function () {
  if (window.ROADMAP) return;
  var SV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
  var IC = {
    hk: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    bgh: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
    hb: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M8 7h8M8 11h6"/>',
    nq: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    hd: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    tb: '<path d="M3 11l18-8v18l-18-8z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    lop: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11M15 9v11"/>',
    qt: '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/>'
  };
  var L = [
    { k: 'hk', t: 'Học tập, rèn luyện và nề nếp', d: 'Theo dõi nề nếp hằng ngày, kết quả học tập theo Thông tư 22, Sổ công tác chủ nhiệm, báo tin cho cha mẹ học sinh.', on: 1 },
    { k: 'lop', t: 'Mở rộng cho nhiều lớp', d: 'Mỗi lớp có sổ riêng trên cùng một hệ thống. Nhà trường nhập danh sách lớp bằng file Excel mẫu có sẵn bảng biểu (mã HS, họ tên, ngày sinh, tổ, chức vụ, email cha mẹ học sinh).',
      more: '<a href="templates/mau-danh-sach-lop.xlsx" download class="rmdl">Tải file Excel mẫu danh sách lớp</a>' },
    { k: 'qt', t: 'Phân quyền từ quản trị', d: 'Quản trị viên phân vai cho từng lớp: giáo viên chủ nhiệm, cán bộ lớp, Ban giám hiệu; đặt quyền xem, nhập, sửa cho từng mục.',
      more: '<table class="rmq"><tr><th></th><th>Nề nếp</th><th>Điểm</th><th>Báo cáo, sổ</th><th>Cài đặt</th></tr><tr><td>GVCN</td><td>Ghi, sửa</td><td>Xem, sửa</td><td>Lập, xuất</td><td>Có</td></tr><tr><td>Cán bộ lớp</td><td>Ghi</td><td>Nhập điểm kiểm tra, kỳ thi</td><td>Xem</td><td>—</td></tr><tr><td>Ban giám hiệu</td><td>Xem</td><td>Xem</td><td>Xem các lớp</td><td>—</td></tr></table>' },
    { k: 'bgh', t: 'Ban giám hiệu theo dõi thi đua', d: 'Nhiều lớp dùng chung một mẫu; so sánh thi đua các lớp theo tháng, học kỳ.' },
    { k: 'hb', t: 'Cổng tra cứu cho cha mẹ học sinh', d: 'Mỗi gia đình đăng nhập xem điểm số, nhận xét của riêng con mình.' },
    { k: 'nq', t: 'Nội quy, quy định', d: 'Nội quy trường, lớp; quy định thi đua, khen thưởng.' },
    { k: 'hd', t: 'Hoạt động của trường', d: 'Lịch học, lịch thi, sự kiện, hoạt động ngoại khoá.' },
    { k: 'tb', t: 'Thông báo chung', d: 'Từ Ban giám hiệu, giáo viên tới đúng lớp, đúng phụ huynh.' }];
  var css = document.createElement('style'); css.id = 'rm-css';
  css.textContent = '#rm-ov{position:fixed;inset:0;z-index:9950;background:rgba(15,30,35,.45);display:flex;align-items:center;justify-content:center;padding:16px}'
    + '#rm-ov .bx{background:#fff;border-radius:18px;width:min(860px,100%);max-height:calc(100vh - 32px);overflow:auto;box-shadow:0 24px 60px rgba(0,0,0,.3);font-family:inherit;color:#1B333A}'
    + '#rm-ov .hd{display:flex;gap:12px;align-items:flex-start;padding:16px 18px 10px;border-bottom:1px solid #E6EEF0;position:sticky;top:0;background:#fff;z-index:1}'
    + '#rm-ov .hd h3{margin:0;font-size:18px;color:#0A5C64}#rm-ov .hd p{margin:3px 0 0;font-size:13px;color:#5C7A83;line-height:1.5}'
    + '#rm-ov .hd .x{margin-left:auto;border:0;background:#F0F5F6;border-radius:10px;width:34px;height:34px;font-size:18px;cursor:pointer;flex:none}'
    + '#rm-ov .gr{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:14px 18px}'
    + '#rm-ov .it{display:flex;gap:12px;border:1px solid #E6EEF0;border-radius:14px;padding:12px 14px;background:#FBFDFD;text-align:left;font:inherit;color:inherit;cursor:pointer}'
    + '#rm-ov .it.on{border-color:#0E7C86;background:#EEF7F8;cursor:default}#rm-ov .it .i{width:40px;height:40px;border-radius:12px;background:#E6F3F4;color:#0A5C64;display:grid;place-items:center;flex:none}'
    + '#rm-ov .it .i svg{width:22px;height:22px}#rm-ov .it.on .i{background:#0E7C86;color:#fff}'
    + '#rm-ov .it b{display:block;font-size:14.5px}#rm-ov .it span.d{display:block;font-size:12.5px;color:#5C7A83;line-height:1.45;margin-top:2px}'
    + '#rm-ov .tg{display:inline-block;font-size:10.5px;font-weight:800;letter-spacing:.04em;border-radius:99px;padding:2px 8px;margin-left:6px;vertical-align:2px}'
    + '#rm-ov .tg.a{background:#0E7C86;color:#fff}#rm-ov .tg.b{background:#FFF1E0;color:#9A5B13}'
    + '#rm-ov .it .more{display:none;font-size:12.5px;color:#9A5B13;margin-top:6px}#rm-ov .it.op .more{display:block}'
    + '#rm-ov .ft{padding:2px 18px 16px;font-size:12.5px;color:#5C7A83;line-height:1.5}'
    + '#rm-ov .rmdl{display:inline-block;margin-top:2px;background:#0E7C86;color:#fff;border-radius:8px;padding:6px 10px;font-weight:700;text-decoration:none}'
    + '#rm-ov .rmq{border-collapse:collapse;font-size:12px;color:#1B333A;margin-top:4px;width:100%}#rm-ov .rmq th,#rm-ov .rmq td{border:1px solid #E6EEF0;padding:3px 5px;text-align:left}#rm-ov .rmq th{background:#EEF7F8}'
    + '@media(max-width:700px){#rm-ov .gr{grid-template-columns:1fr}}';
  document.head.appendChild(css);
  function open() {
    var o = document.getElementById('rm-ov'); if (o) o.remove();
    o = document.createElement('div'); o.id = 'rm-ov';
    o.innerHTML = '<div class="bx" role="dialog" aria-label="Tính năng sắp ra mắt"><div class="hd"><div><h3>Tính năng sắp ra mắt</h3><p>Sổ theo dõi học sinh đang dùng để theo dõi kết quả học tập, rèn luyện và nề nếp, lập Sổ công tác chủ nhiệm. Các mục bên dưới đang được phát triển để trở thành sổ liên lạc điện tử của nhà trường.</p></div><button class="x" aria-label="Đóng">×</button></div>'
      + '<div class="gr">' + L.map(function (x) {
        return '<div role="button" tabindex="0" class="it' + (x.on ? ' on' : '') + '"><span class="i">' + SV + IC[x.k] + '</svg></span><span><b>' + x.t + '<span class="tg ' + (x.on ? 'a">ĐANG DÙNG' : 'b">ĐANG PHÁT TRIỂN') + '</span></b><span class="d">' + x.d + '</span>'
          + (x.on ? '' : '<span class="more">' + (x.more || 'Nội dung đang phát triển, sẽ cập nhật trong các phiên bản tới.') + '</span>') + '</span></div>';
      }).join('') + '</div><div class="ft">Mọi mục mới đều theo nguyên tắc bảo vệ dữ liệu cá nhân: mỗi người chỉ thấy phần thông tin được phép, thông tin riêng của từng học sinh chỉ gửi tới đúng gia đình.</div></div>';
    document.body.appendChild(o);
    o.onclick = function (e) { if (e.target === o) o.remove(); };
    o.querySelector('.x').onclick = function () { o.remove(); };
    o.querySelectorAll('.it:not(.on)').forEach(function (b) { b.onclick = function (e) { if (e.target.closest('a')) return; b.classList.toggle('op'); }; });
  }
  window.ROADMAP = { open: open, LIST: L };
  /* gắn lối vào */
  function hook() {
    var d = document.querySelector('#login .lgdocs');
    if (d && !d.querySelector('[data-rm]')) { var a = document.createElement('a'); a.href = '#'; a.dataset.rm = 1; a.textContent = 'Tính năng sắp ra mắt'; a.onclick = function (e) { e.preventDefault(); open(); }; d.appendChild(a); }
    var m = document.getElementById('ava39');
    if (m && m.classList.contains('on') && !m.querySelector('[data-a=rm]')) {
      var out = m.querySelector('[data-a=out]'), b = document.createElement('button'); b.dataset.a = 'rm';
      b.innerHTML = SV + '<path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5-6.5 4.5 2-7.5L2 9h7z"/></svg>Tính năng sắp ra mắt';
      b.onclick = function () { m.classList.remove('on'); open(); };
      if (out) out.before(b); else m.appendChild(b);
    }
    var ph = document.querySelector('#phRm');
    if (!ph && /phu-huynh/.test(location.pathname)) {
      var h = document.querySelector('a[href*="HDSD_Phu_huynh"]');
      if (h) { var l = document.createElement('a'); l.id = 'phRm'; l.href = '#'; l.textContent = 'Tính năng sắp ra mắt'; l.style.marginLeft = '10px'; l.className = h.className; l.onclick = function (e) { e.preventDefault(); open(); }; h.after(l); }
    }
  }
  new MutationObserver(hook).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  if (document.readyState !== 'loading') hook(); else document.addEventListener('DOMContentLoaded', hook);
})();
