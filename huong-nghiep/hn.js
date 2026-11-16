/* Tư vấn hướng nghiệp K11 — gửi câu hỏi (16/11/2026)
 * Backend: yenhoa-backend ▸ hanh-kiem-11d3 ▸ HuongNghiep.gs (action hnGui, không cần đăng nhập).
 * Gõ chữ hoặc NÓI ĐỂ VIẾT (backend hnNoi chép giọng nói thành chữ; không gửi / lưu file ghi âm — người dùng yêu cầu).
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
        '<div id="nBox"></div>' +
        '<div class="hint" id="hNoi">Gõ chữ như bình thường, hoặc bấm <b>Nói để viết</b>: nói xong bấm Xong, chữ tự hiện vào ô để đọc lại, sửa.</div>' +
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

  /* ---------- Nói để viết ----------
   * Cách chính (mọi máy iPhone / Android): ghi giọng nói (bật lọc ồn, khử vọng của máy) ⇒ đổi sang WAV 16 kHz ngay trên máy
   * ⇒ máy chủ hnNoi (Gemini) chép thành chữ tiếng Việt, bỏ tạp âm, thêm dấu câu ⇒ chữ vào ô để đọc lại, sửa. Không lưu ghi âm.
   * Dự phòng: máy chủ chưa bật (NOSTT) ⇒ nhận giọng nói của trình duyệt (Web Speech) nếu có. */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var MAXS = 120, sttOff = false;
  var N = { on: false, busy: false };
  function inApp() { return /Zalo|FBAN|FBAV|FB_IAB|FBIOS|Messenger|Instagram|Line\/|TikTok|MicroMessenger/i.test(navigator.userAgent); }
  function canRec() { return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder); }
  function noMicMsg() {
    return inApp()
      ? 'Trình duyệt trong ứng dụng (Zalo, Facebook…) chưa cho dùng micro. Bấm dấu <b>⋯</b> ở góc trên ▸ <b>Mở bằng trình duyệt</b> (Safari / Chrome) rồi bấm Nói lại — hoặc gõ chữ như bình thường.'
      : 'Máy chưa cho trang này dùng micro. Hãy cho phép micro (biểu tượng ổ khoá / aA cạnh địa chỉ trang) rồi bấm Nói lại — hoặc gõ chữ như bình thường.';
  }
  function toggleNoi() {
    if (N.busy) return;
    if (rec) { rec.stop(); return; }
    if (N.on) { stopNoi(true); return; }
    if (sttOff || !canRec()) {
      if (SR) { webSpeech(); return; }
      hint(canRec() ? 'Chưa nói để viết được trên máy này. Hãy bấm biểu tượng micro trên bàn phím điện thoại, hoặc gõ chữ.' : noMicMsg(), false); return;
    }
    startNoi();
  }
  function pickMime() {
    if (!MediaRecorder.isTypeSupported) return '';
    var c = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/aac'];
    for (var i = 0; i < c.length; i++) { try { if (MediaRecorder.isTypeSupported(c[i])) return c[i]; } catch (e) {} }
    return '';
  }
  function startNoi() {
    var AC = window.AudioContext || window.webkitAudioContext;
    try { N.ctx = AC ? new AC() : null; if (N.ctx && N.ctx.resume) N.ctx.resume(); } catch (e) { N.ctx = null; }   // tạo ngay khi bấm (iPhone cần)
    N.on = true; N.cancel = false;
    setBtn('#bNoi', true, IC.stop, 'Xong');
    hint('Đang mở micro…', true);
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 } })
      .then(function (s) {
        if (!N.on) { s.getTracks().forEach(function (t) { t.stop(); }); return; }
        N.stream = s; N.chunks = []; N.sec = 0;
        var m = pickMime();
        try { N.mr = m ? new MediaRecorder(s, { mimeType: m }) : new MediaRecorder(s); } catch (e) { N.mr = new MediaRecorder(s); }
        N.mime = N.mr.mimeType || m || 'audio/webm';
        N.mr.ondataavailable = function (e) { if (e.data && e.data.size) N.chunks.push(e.data); };
        N.mr.onstop = afterRec;
        N.mr.start(1000);
        meter(s);
        panel('rec');
        N.timer = setInterval(function () {
          N.sec++; var t = $('#nT'); if (t) t.textContent = mmss(N.sec) + ' / ' + mmss(MAXS);
          if (N.sec >= MAXS) stopNoi(true);
        }, 1000);
      })
      .catch(function () { cleanup(); hint(noMicMsg(), false); });
  }
  function mmss(s) { return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  function meter(s) {
    if (!N.ctx) return;
    try {
      var src = N.ctx.createMediaStreamSource(s), an = N.ctx.createAnalyser(); an.fftSize = 512; src.connect(an);
      var buf = new Uint8Array(an.fftSize);
      (function loop() {
        if (!N.on) return;
        an.getByteTimeDomainData(buf);
        var sum = 0; for (var i = 0; i < buf.length; i++) { var v = (buf[i] - 128) / 128; sum += v * v; }
        var lv = Math.min(1, Math.sqrt(sum / buf.length) * 4);
        var b = $('#nLv'); if (b) b.style.transform = 'scaleX(' + Math.max(0.04, lv).toFixed(3) + ')';
        N.raf = requestAnimationFrame(loop);
      })();
    } catch (e) {}
  }
  function panel(kind) {
    var box = $('#nBox'); if (!box) return;
    if (kind === 'rec') {
      box.innerHTML = '<div class="nrec"><span class="dot"></span><b>Đang nghe</b><span class="nt" id="nT">0:00 / ' + mmss(MAXS) + '</span>' +
        '<div class="lv"><i id="nLv"></i></div>' +
        '<div class="nact"><button type="button" class="btn pri sm" id="nXong">Xong</button><button type="button" class="btn sm" id="nHuy">Huỷ</button></div></div>';
      $('#nXong').onclick = function () { stopNoi(true); };
      $('#nHuy').onclick = function () { stopNoi(false); };
      var bn = $('#bNoi'); if (bn) bn.style.display = 'none';
      hint('Nói rõ ràng, gần điện thoại. Nói xong bấm <b>Xong</b> — chữ sẽ hiện vào ô.', false);
    } else if (kind === 'wait') {
      box.innerHTML = '<div class="nrec"><span class="spin"></span><b>Đang chuyển giọng nói thành chữ…</b></div>';
      hint('', false);
    } else if (kind === 'retry') {
      box.innerHTML = '<div class="nrec"><button type="button" class="btn sm" id="nLai">Thử chuyển lại</button><button type="button" class="btn link" id="nBo">Bỏ</button></div>';
      $('#nLai').onclick = function () { send(N.last, 0); };
      $('#nBo').onclick = function () { N.last = null; panel(''); };
    } else box.innerHTML = '';
  }
  function stopNoi(keep) {
    N.cancel = !keep;
    clearInterval(N.timer); cancelAnimationFrame(N.raf);
    if (N.mr && N.mr.state !== 'inactive') { N.on = false; try { N.mr.requestData(); } catch (e) {} N.mr.stop(); }
    else { cleanup(); panel(''); hint('', false); }
  }
  function cleanup() {
    N.on = false; clearInterval(N.timer); cancelAnimationFrame(N.raf);
    if (N.stream) N.stream.getTracks().forEach(function (t) { t.stop(); });
    N.stream = null; N.mr = null;
    setBtn('#bNoi', false, IC.mic, 'Nói để viết');
    var bn = $('#bNoi'); if (bn) bn.style.display = '';
  }
  function afterRec() {
    var blob = new Blob(N.chunks || [], { type: N.mime });
    var ctx = N.ctx; N.ctx = null;
    cleanup();
    if (N.cancel) { panel(''); hint('Đã huỷ.', false); if (ctx && ctx.close) ctx.close(); return; }
    if (blob.size < 1500 || N.sec < 1) { panel(''); hint('Đoạn nói quá ngắn — bấm <b>Nói để viết</b> và nói lại nhé.', false); if (ctx && ctx.close) ctx.close(); return; }
    N.busy = true; panel('wait');
    toWav(blob, ctx).then(function (w) { return w; }, function () { return null; }).then(function (w) {
      if (ctx && ctx.close) try { ctx.close(); } catch (e) {}
      if (w) return { b64: w, mime: 'audio/wav' };
      return b64Of(blob).then(function (b) { return { b64: b, mime: N.mime.split(';')[0] }; });
    }).then(function (a) { N.last = a; send(a, 0); })
      .catch(function () { N.busy = false; panel(''); hint('Không đọc được đoạn ghi trên máy này — hãy gõ chữ giúp nhé.', false); });
  }
  function b64Of(blob) {
    return new Promise(function (ok, no) { var fr = new FileReader(); fr.onload = function () { ok(String(fr.result).split(',')[1]); }; fr.onerror = no; fr.readAsDataURL(blob); });
  }
  /* giải mã bằng chính trình duyệt ⇒ 1 kênh, 16 kHz, PCM 16-bit (Gemini đọc chắc chắn, mọi máy như nhau) */
  function toWav(blob, ctx) {
    return new Promise(function (ok, no) {
      if (!ctx || !blob.arrayBuffer && !window.FileReader) return no();
      var read = blob.arrayBuffer ? blob.arrayBuffer() : new Promise(function (r) { var fr = new FileReader(); fr.onload = function () { r(fr.result); }; fr.readAsArrayBuffer(blob); });
      read.then(function (ab) {
        var done = false;
        var fin = function (buf) {
          if (done) return; done = true;
          try {
            var n = buf.length, ch = buf.numberOfChannels, sr = buf.sampleRate, mono = new Float32Array(n);
            for (var c = 0; c < ch; c++) { var d = buf.getChannelData(c); for (var i = 0; i < n; i++) mono[i] += d[i] / ch; }
            var R = 16000, m = Math.floor(n * R / sr), out = new Int16Array(m), k = sr / R;
            for (var j = 0; j < m; j++) {                       // trung bình các mẫu trong khoảng (lọc răng cưa đơn giản)
              var a = Math.floor(j * k), b = Math.min(n, Math.floor((j + 1) * k)) || a + 1, s = 0, cnt = 0;
              for (var x = a; x < b; x++) { s += mono[x]; cnt++; }
              var v = cnt ? s / cnt : 0; v = v > 1 ? 1 : v < -1 ? -1 : v; out[j] = v < 0 ? v * 0x8000 : v * 0x7FFF;
            }
            var hdr = new DataView(new ArrayBuffer(44)), w = function (o, s) { for (var q = 0; q < s.length; q++) hdr.setUint8(o + q, s.charCodeAt(q)); };
            w(0, 'RIFF'); hdr.setUint32(4, 36 + m * 2, true); w(8, 'WAVE'); w(12, 'fmt '); hdr.setUint32(16, 16, true); hdr.setUint16(20, 1, true);
            hdr.setUint16(22, 1, true); hdr.setUint32(24, R, true); hdr.setUint32(28, R * 2, true); hdr.setUint16(32, 2, true); hdr.setUint16(34, 16, true);
            w(36, 'data'); hdr.setUint32(40, m * 2, true);
            b64Of(new Blob([hdr.buffer, out.buffer], { type: 'audio/wav' })).then(ok, no);
          } catch (e) { no(e); }
        };
        try { var pr = ctx.decodeAudioData(ab, fin, function () { if (!done) { done = true; no(); } }); if (pr && pr.then) pr.then(fin, function () { if (!done) { done = true; no(); } }); }
        catch (e) { no(e); }
      }, no);
    });
  }
  function send(a, n) {
    if (!a) return;
    N.busy = true; panel('wait');
    var ctl = window.AbortController ? new AbortController() : null, to = setTimeout(function () { if (ctl) ctl.abort(); }, 70000);
    fetch(GAS, { method: 'POST', redirect: 'follow', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                 body: JSON.stringify({ action: 'hnNoi', payload: { audio: a.b64, mime: a.mime } }), signal: ctl ? ctl.signal : undefined })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        clearTimeout(to);
        if (j && j.ok) {
          N.busy = false; N.last = null; panel('');
          if (!j.text) { hint('Chưa nghe rõ lời nói — hãy bấm <b>Nói để viết</b>, nói gần điện thoại hơn nhé.', false); return; }
          var ta = $('#hoi'), cu = ta.value.replace(/\s+$/, '');
          ta.value = cu ? cu + (/[.?!…]$/.test(cu) ? ' ' : '. ') + j.text : j.text;
          st.hoi = ta.value; st.cach = cu && st.cach !== 'noi' ? 'gonoi' : 'noi'; save();
          hint('Đã chuyển thành chữ. Hãy <b>đọc lại và sửa</b> nếu cần, có thể bấm Nói tiếp để thêm ý.', false);
          return;
        }
        if (j && j.code === 'NOSTT') { sttOff = true; N.busy = false; panel(''); if (SR) hint('Bấm <b>Nói để viết</b> lần nữa để nói (chữ hiện trực tiếp).', false); else hint('Hãy bấm micro trên bàn phím điện thoại để nói, hoặc gõ chữ.', false); return; }
        if (j && j.busy && n < 1) { setTimeout(function () { send(a, n + 1); }, 2500); return; }
        throw Object.assign(new Error((j && j.error) || 'Không rõ lỗi'), { srv: 1 });
      })
      .catch(function (e) {
        clearTimeout(to);
        if (!e.srv && n < 1) { setTimeout(function () { send(a, n + 1); }, 2000); return; }
        N.busy = false; panel('retry');
        hint(e.srv ? esc(e.message) : 'Mạng chập chờn, chưa chuyển được thành chữ.', false);
      });
  }

  /* dự phòng: nhận giọng nói ngay trên trình duyệt (khi máy chủ chưa bật) */
  var rec = null;
  function webSpeech() {
    var ta = $('#hoi');
    var base = ta.value ? ta.value.replace(/\s+$/, '') + ' ' : '';
    rec = new SR(); rec.lang = 'vi-VN'; rec.continuous = true; rec.interimResults = true;
    var finalTxt = '';
    rec.onresult = function (ev) {
      var interim = '';
      for (var i = ev.resultIndex; i < ev.results.length; i++) {
        if (ev.results[i].isFinal) finalTxt += ev.results[i][0].transcript + ' ';
        else interim += ev.results[i][0].transcript;
      }
      ta.value = base + finalTxt + interim; st.hoi = ta.value; st.cach = base ? 'gonoi' : 'noi'; save();
    };
    rec.onerror = function (ev) {
      if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') hint(noMicMsg(), false);
      else if (ev.error === 'no-speech') hint('Chưa nghe thấy tiếng nói — hãy thử lại và nói gần micro hơn.', false);
    };
    rec.onend = function () {
      rec = null; ta.value = ta.value.replace(/\s+$/, ''); st.hoi = ta.value; save();
      setBtn('#bNoi', false, IC.mic, 'Nói để viết');
      if ($('#hNoi').classList.contains('live')) hint('Đã dừng. Hãy đọc lại và sửa chữ nếu cần.', false);
    };
    try { rec.start(); } catch (e) { rec = null; hint('Không bật được micro. Hãy thử lại hoặc gõ chữ.', false); return; }
    setBtn('#bNoi', true, IC.stop, 'Dừng nói');
    hint('<span class="dot"></span> Đang nghe… xong bấm <b>Dừng nói</b>.', true);
  }

  function setBtn(sel, on, ic, txt) { var b = $(sel); if (!b) return; b.classList.toggle('on', on); b.innerHTML = ic + '<span>' + txt + '</span>'; }
  function hint(html, live) { var h = $('#hNoi'); if (!h) return; h.innerHTML = html; h.classList.toggle('live', !!live); }

  /* ---------- Gửi ---------- */
  var sending = false;
  function gui() {
    if (sending) return;
    if (rec) rec.stop();
    if (N.on || N.busy) { $('#err').textContent = 'Đang chuyển giọng nói thành chữ — đợi chút rồi bấm Gửi.'; return; }
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
