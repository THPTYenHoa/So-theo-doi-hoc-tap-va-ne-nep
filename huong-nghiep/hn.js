/* Tư vấn hướng nghiệp K11 — gửi câu hỏi (16/11/2026)
 * Backend: yenhoa-backend ▸ hanh-kiem-11d3 ▸ HuongNghiep.gs (action hnGui, không cần đăng nhập).
 * Chỉ gõ chữ hoặc NÓI ĐỂ VIẾT (không gửi file ghi âm — người dùng yêu cầu).
 * Trang hs/ và ph/ đặt <body data-vai="hs|ph"> ⇒ chọn sẵn đối tượng; người gửi vẫn xác nhận đối tượng + chọn lớp. */
(function () {
  'use strict';
  var GAS = 'https://script.google.com/macros/s/AKfycbz1x-UG4_Rk3M3_APc-hJ0VHns2GfvPtR6T_F8nl4KlEHnNsiYGMbY0Vc4moiIRy8gO/exec';
  var LOP_A = ['11A1','11A2','11A3','11A4','11A5','11A6','11A7','11A8','11A9','11A10'];
  var LOP_D = ['11D1','11D2','11D3','11D4','11D5','11D6','11D7'];
  var CHUDE = ['Chọn ngành nghề','Trường & tuyển sinh','Tổ hợp môn, phương thức xét tuyển','Năng lực, sở thích bản thân',
               'Thị trường lao động','Du học','Học nghề, trải nghiệm nghề','Khác'];
  var LS = 'hn_k11_v1';
  var IC = {
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
    stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="7" width="10" height="10" rx="2"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
  };
  var T = {
    hs: { who: 'Học sinh', ten: 'Họ và tên của em', tenPh: 'Ví dụ: Nguyễn Minh An', hoi: 'Em muốn hỏi ban tư vấn điều gì?',
          hoiPh: 'Ví dụ: Em thích Sinh học nhưng chưa biết nên học Y hay Công nghệ sinh học, khác nhau thế nào?' },
    ph: { who: 'Cha mẹ học sinh', ten: 'Họ tên phụ huynh (và tên con)', tenPh: 'Ví dụ: Trần Văn Bình — bố em Trần Minh Châu',
          hoi: 'Quý phụ huynh muốn hỏi ban tư vấn điều gì?',
          hoiPh: 'Ví dụ: Con tôi học khá các môn tự nhiên, nên định hướng nhóm ngành nào để dễ tìm việc sau này?' }
  };

  var st = load();
  var vaiTrang = document.body.getAttribute('data-vai');
  st.vai = vaiTrang === 'hs' || vaiTrang === 'ph' ? vaiTrang : (st.vai || '');
  st.chude = st.chude || []; st.hoi = st.hoi || ''; st.cach = st.cach || '';
  var app = document.getElementById('app');

  function load() { try { return JSON.parse(localStorage.getItem(LS) || '{}') || {}; } catch (e) { return {}; } }
  function save() {
    try { localStorage.setItem(LS, JSON.stringify({ vai: st.vai, lop: st.lop, ten: st.ten, chude: st.chude, hoi: st.hoi, cach: st.cach, rid: st.rid })); } catch (e) {}
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(s) { return app.querySelector(s); }

  function form() {
    var t = T[st.vai] || T.hs;
    var lopBtn = function (l) { return '<button type="button" data-lop="' + l + '" aria-pressed="' + (st.lop === l) + '">' + l + '</button>'; };
    app.innerHTML =
      '<p class="intro">Ngày hội Tư vấn hướng nghiệp khối 11 — thứ Bảy 28/11/2026. Câu hỏi được gửi tới ban tư vấn để chuẩn bị giải đáp trong buổi chia sẻ.</p>' +
      '<form id="f" novalidate>' +
      '<section class="card"><h2><span class="n">1</span>Bạn là</h2><div class="vai">' +
        '<button type="button" data-vai="hs" aria-pressed="' + (st.vai === 'hs') + '">Học sinh<span>khối 11</span></button>' +
        '<button type="button" data-vai="ph" aria-pressed="' + (st.vai === 'ph') + '">Cha mẹ học sinh<span>phụ huynh của học sinh khối 11</span></button>' +
      '</div></section>' +
      '<section class="card"><h2><span class="n">2</span>Lớp <small>' + (st.vai === 'ph' ? '(lớp của con)' : '') + '</small></h2>' +
        '<div class="lopg">Ban A</div><div class="lop">' + LOP_A.map(lopBtn).join('') + '</div>' +
        '<div class="lopg">Ban D</div><div class="lop">' + LOP_D.map(lopBtn).join('') + '</div>' +
      '</section>' +
      '<section class="card"><h2><span class="n">3</span>Chủ đề <small>(không bắt buộc, chọn được nhiều)</small></h2><div class="cd">' +
        CHUDE.map(function (c) { return '<button type="button" data-cd="' + esc(c) + '" aria-pressed="' + (st.chude.indexOf(c) >= 0) + '">' + esc(c) + '</button>'; }).join('') +
      '</div></section>' +
      '<section class="card"><h2><span class="n">4</span>Câu hỏi</h2>' +
        '<label class="f" for="hoi">' + esc(t.hoi) + '</label>' +
        '<textarea id="hoi" maxlength="3000" placeholder="' + esc(t.hoiPh) + '">' + esc(st.hoi) + '</textarea>' +
        '<div class="tools"><button type="button" class="btn" id="bNoi">' + IC.mic + '<span>Nói để viết</span></button></div>' +
        '<div class="hint" id="hNoi">Bấm <b>Nói để viết</b> rồi nói, chữ sẽ tự hiện trong ô — đọc lại, sửa nếu cần.</div>' +
        '<label class="f" for="ten" style="margin-top:16px">' + esc(t.ten) + ' <small>(không bắt buộc)</small></label>' +
        '<input type="text" id="ten" maxlength="80" autocomplete="name" placeholder="' + esc(t.tenPh) + '" value="' + esc(st.ten || '') + '">' +
        '<div class="hint">Có thể để trống nếu muốn hỏi ẩn danh.</div>' +
        '<div class="hp" aria-hidden="true"><label>Website<input type="text" id="web" tabindex="-1" autocomplete="off"></label></div>' +
      '</section>' +
      '<p class="sum" id="sum"></p>' +
      '<button type="submit" class="btn pri" id="bGui">Gửi câu hỏi</button>' +
      '<div class="err" id="err" role="alert"></div>' +
      '</form>';
    wire(); paintSum();
  }

  function paintSum() {
    var s = $('#sum'); if (!s) return;
    s.innerHTML = st.vai && st.lop
      ? 'Bạn xác nhận gửi với tư cách <b>' + T[st.vai].who + '</b> lớp <b>' + st.lop + '</b>.'
      : 'Hãy chọn <b>Bạn là</b> và <b>Lớp</b> trước khi gửi.';
  }

  function wire() {
    app.querySelectorAll('[data-vai]').forEach(function (b) {
      b.onclick = function () { st.vai = b.getAttribute('data-vai'); st.hoi = $('#hoi').value; st.ten = $('#ten').value; save(); form(); };
    });
    app.querySelectorAll('[data-lop]').forEach(function (b) {
      b.onclick = function () {
        st.lop = b.getAttribute('data-lop'); save();
        app.querySelectorAll('[data-lop]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        paintSum(); $('#err').textContent = '';
      };
    });
    app.querySelectorAll('[data-cd]').forEach(function (b) {
      b.onclick = function () {
        var c = b.getAttribute('data-cd'), i = st.chude.indexOf(c);
        if (i >= 0) st.chude.splice(i, 1); else st.chude.push(c);
        b.setAttribute('aria-pressed', String(i < 0)); save();
      };
    });
    $('#hoi').oninput = function () { st.hoi = this.value; if (!st.cach) st.cach = 'go'; save(); };
    $('#ten').oninput = function () { st.ten = this.value; save(); };
    $('#bNoi').onclick = toggleNoi;
    $('#f').onsubmit = function (e) { e.preventDefault(); gui(); };
  }

  /* ---------- Nói để viết (Web Speech API, tiếng Việt) ---------- */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var rec = null, recBase = '';
  function toggleNoi() {
    if (rec) { rec.stop(); return; }
    if (!SR) {
      hint('Trình duyệt này chưa hỗ trợ nói để viết. Hãy bấm biểu tượng micro trên bàn phím điện thoại, hoặc gõ chữ.', false);
      return;
    }
    var ta = $('#hoi');
    recBase = ta.value ? ta.value.replace(/\s+$/, '') + ' ' : '';
    rec = new SR(); rec.lang = 'vi-VN'; rec.continuous = true; rec.interimResults = true;
    var finalTxt = '';
    rec.onresult = function (ev) {
      var interim = '';
      for (var i = ev.resultIndex; i < ev.results.length; i++) {
        if (ev.results[i].isFinal) finalTxt += ev.results[i][0].transcript + ' ';
        else interim += ev.results[i][0].transcript;
      }
      ta.value = recBase + finalTxt + interim; st.hoi = ta.value; st.cach = recBase ? 'gonoi' : 'noi'; save();
    };
    rec.onerror = function (ev) {
      if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed')
        hint('Chưa được phép dùng micro. Hãy cho phép micro cho trang này rồi thử lại, hoặc gõ chữ.', false);
      else if (ev.error === 'no-speech') hint('Chưa nghe thấy tiếng nói — hãy thử lại và nói gần micro hơn.', false);
      else if (ev.error === 'network') hint('Nói để viết cần mạng ổn định. Hãy thử lại hoặc gõ chữ.', false);
    };
    rec.onend = function () {
      rec = null; ta.value = ta.value.replace(/\s+$/, ''); st.hoi = ta.value; save();
      setBtn('#bNoi', false, IC.mic, 'Nói để viết');
      if ($('#hNoi').classList.contains('live')) hint('Đã dừng. Hãy đọc lại và sửa chữ nếu cần trước khi gửi.', false);
    };
    try { rec.start(); } catch (e) { rec = null; hint('Không bật được micro. Hãy thử lại.', false); return; }
    setBtn('#bNoi', true, IC.stop, 'Dừng nói');
    hint('<span class="dot"></span> Đang nghe… nói rõ ràng, xong bấm <b>Dừng nói</b>.', true);
  }

  function setBtn(sel, on, ic, txt) { var b = $(sel); if (!b) return; b.classList.toggle('on', on); b.innerHTML = ic + '<span>' + txt + '</span>'; }
  function hint(html, live) { var h = $('#hNoi'); if (!h) return; h.innerHTML = html; h.classList.toggle('live', !!live); }

  /* ---------- Gửi ---------- */
  var sending = false;
  function gui() {
    if (sending) return;
    if (rec) rec.stop();
    var err = $('#err'); err.textContent = '';
    var hoi = $('#hoi').value.trim();
    if (!st.vai) { err.textContent = 'Hãy chọn: Học sinh hoặc Cha mẹ học sinh.'; return; }
    if (!st.lop) { err.textContent = 'Hãy chọn lớp.'; app.querySelector('.lop').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    if (hoi.length < 3) { err.textContent = 'Hãy viết hoặc nói câu hỏi.'; $('#hoi').focus(); return; }
    if (!st.rid) { st.rid = Date.now().toString(36) + Math.random().toString(36).slice(2, 8); save(); }
    var payload = { vai: st.vai, lop: st.lop, ten: $('#ten').value.trim(), chude: st.chude.slice(), hoi: hoi,
                    cach: st.cach || 'go', rid: st.rid, web: $('#web').value };
    sending = true;
    var b = $('#bGui'); b.disabled = true; b.textContent = 'Đang gửi…';
    post(payload, 0);
  }
  function post(payload, n) {
    var ctl = window.AbortController ? new AbortController() : null;
    var to = setTimeout(function () { if (ctl) ctl.abort(); }, 60000);
    fetch(GAS, { method: 'POST', redirect: 'follow', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                 body: JSON.stringify({ action: 'hnGui', payload: payload }), signal: ctl ? ctl.signal : undefined })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        clearTimeout(to);
        if (!j || !j.ok) throw Object.assign(new Error((j && j.error) || 'Không rõ lỗi'), { srv: 1 });
        done(j.no);
      })
      .catch(function (e) {
        clearTimeout(to);
        if (!e.srv && n < 2) { setTimeout(function () { post(payload, n + 1); }, 2000 * (n + 1)); return; }
        sending = false;
        var b = $('#bGui'); if (b) { b.disabled = false; b.textContent = 'Gửi lại'; }
        $('#err').textContent = e.srv ? e.message : 'Mạng chập chờn, chưa gửi được. Câu hỏi vẫn được giữ trên máy — hãy bấm Gửi lại.';
      });
  }
  function done(no) {
    sending = false;
    st.hoi = ''; st.chude = []; st.cach = ''; st.rid = ''; save();
    app.innerHTML = '<section class="card done"><div class="ic">' + IC.ok + '</div>' +
      '<h2>Đã gửi câu hỏi' + (no ? ' số ' + no : '') + '</h2>' +
      '<p>Cảm ơn ' + (st.vai === 'ph' ? 'quý phụ huynh' : 'em') + ' (' + T[st.vai].who.toLowerCase() + ' lớp ' + st.lop + '). ' +
      'Ban tư vấn sẽ tổng hợp và giải đáp trong Ngày hội Tư vấn hướng nghiệp 28/11/2026.</p>' +
      '<button type="button" class="btn pri" id="bThem">Gửi thêm câu hỏi khác</button></section>';
    $('#bThem').onclick = function () { form(); window.scrollTo(0, 0); $('#hoi').focus(); };
    window.scrollTo(0, 0);
  }

  form();
})();
