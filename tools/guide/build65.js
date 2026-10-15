/* HDSD đầy đủ v6.5 (ngang 16:9) — giao diện mới: Tổng quan · Cập nhật · Báo cáo & sổ · Quản lý · Trợ lý AI.
   Ảnh: tools/guide/cap65.js (web demo, dữ liệu ảo) ⇒ tools/guide/shots65. Chạy: NODE_PATH=$(npm root -g) node tools/guide/build65.js
   ⇒ docs/HDSD_Day_du.pdf (giữ đúng tên ⇒ mã QR cũ trên slide / poster / app vẫn dùng được). */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '../..'), SH = path.join(__dirname, 'shots65');
const img = n => 'data:image/png;base64,' + fs.readFileSync(path.join(SH, n + '.png')).toString('base64');
const APP = 'thptyenhoa.github.io/So-theo-doi-hoc-tap-va-ne-nep', VER = '6.5', TODAY = '10/2026';
const CSS0 = fs.readFileSync(path.join(__dirname, 'build.js'), 'utf8').match(/const CSS = `([\s\S]*?)`;/)[1];
const SETS = fs.readdirSync(path.join(ROOT, 'mascot')).filter(d => fs.existsSync(path.join(ROOT, 'mascot', d, 'chao.webp')));
let seed = 7; const rnd = n => (seed = (seed * 9301 + 49297) % 233280) % n;
const chibi = emo => { const c = SETS.filter(d => fs.existsSync(path.join(ROOT, 'mascot', d, emo + '.webp'))); const d = c.length ? c[rnd(c.length)] : 'chu-nhiem';
  const f = path.join(ROOT, 'mascot', d, emo + '.webp'); return fs.existsSync(f) ? 'data:image/webp;base64,' + fs.readFileSync(f).toString('base64') : ''; };
const qr = (u) => { const QR = require('child_process').execFileSync('python3', ['-c', 'import qrcode,sys,io,base64;q=qrcode.QRCode(border=1,box_size=8);q.add_data(sys.argv[1]);q.make(fit=True);b=io.BytesIO();q.make_image(fill_color="#0A5C64",back_color="white").save(b,"PNG");print(base64.b64encode(b.getvalue()).decode())', u]).toString().trim(); return 'data:image/png;base64,' + QR; };
const CSS = CSS0 + `
.dk2{position:absolute;right:36px;top:70px;width:700px;border-radius:12px;border:1px solid #D9E4E7;overflow:hidden;box-shadow:0 18px 40px rgba(20,40,50,.16)}
.dk2 img{display:block;width:100%}
.ins{position:absolute;right:56px;bottom:56px;width:330px;border-radius:10px;border:2px solid #fff;overflow:hidden;box-shadow:0 14px 34px rgba(20,40,50,.28)}
.ins img{display:block;width:100%}
.ph{top:40px;height:640px}
.ph2a{right:376px}
.qrrow{position:absolute;right:70px;top:420px;display:flex;gap:28px;align-items:flex-start}
.qrrow div{width:150px;text-align:center;font-size:12.5px;line-height:1.35;color:#5C7A83;font-weight:700}
.qrrow img{width:150px;height:150px;border:1px solid #E3ECEE;border-radius:10px;background:#fff;display:block;margin:0 0 6px}
.cover .chibi{width:300px;height:300px;top:80px;right:150px}
.grp{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:10px}
.grp .card b{font-size:15px}.grp .card span{font-size:13.5px}
.chip{display:inline-block;padding:3px 10px;border-radius:999px;background:#E6F3F4;color:#0A5C64;font-weight:800;font-size:13px;margin:0 4px 4px 0}
.qrs{display:flex;gap:26px;margin-top:22px}.qrs div{text-align:center;font-size:13px;color:#41566F;font-weight:700}
.qrs img{width:150px;height:150px;border:1px solid #E3ECEE;border-radius:12px;background:#fff;display:block;margin:0 auto 6px}
`;
const ft = (n) => `<div class="bar"></div><div class="no">${String(n).padStart(2, '0')}</div><div class="ft"><span>Sổ theo dõi học tập và nề nếp · Lớp 11D3 · THPT Yên Hòa</span><span>Phiên bản ${VER} · ${TODAY} · ${APP}</span></div>`;
const steps = a => `<ul class="steps">${a.map((t, i) => `<li><i>${i + 1}</i><span>${t}</span></li>`).join('')}</ul>`;
const tip = (t, emo) => `<div class="tip"><img src="${chibi(emo || 'chi-tay')}"><span>${t}</span></div>`;
function page(n, o) {
  if (o.cover) return `<section class="s cover">${ft(n)}<div class="txt"><div class="k">Hướng dẫn sử dụng · bản đầy đủ</div><h1>Sổ theo dõi<br>học tập và nề nếp</h1>
    <p class="lead" style="margin-top:14px;width:680px">${o.lead}</p><span class="who">Giáo viên chủ nhiệm · Cán bộ lớp · Cha mẹ học sinh</span></div>
    <img class="chibi" src="${chibi('chao')}"><div class="meta">Lớp 11D3 · THPT Yên Hòa · Năm học 2026 – 2027<br>Phiên bản ${VER} · có Trợ lý AI</div>
    <div class="qrrow"><div><img src="${qr('https://' + APP + '/')}">Mở sổ</div><div><img src="${qr('https://' + APP + '/demo.html')}">Dùng thử bản demo<br>(mã 11D3Yenhoa)</div><div><img src="${qr('https://' + APP + '/docs/HDSD_Day_du.pdf')}">Tài liệu này</div></div></section>`;
  if (o.div) return `<section class="s div">${ft(n)}<div class="txt"><div class="k">${o.k}</div><h1>${o.h}</h1><p class="lead" style="margin-top:16px">${o.lead}</p></div></section>`;
  const right = o.wide ? `<div class="dk2"><img src="${img(o.wide)}"></div>${o.ins ? `<div class="ins"><img src="${img(o.ins)}"></div>` : ''}` :
    o.phones ? (o.phones[1] ? `<div class="ph ph2a"><img src="${img(o.phones[0])}"></div><div class="ph ph2b"><img src="${img(o.phones[1])}"></div>` : `<div class="ph ph1"><img src="${img(o.phones[0])}"></div>`) : '';
  const tw = o.wide ? 470 : o.phones ? (o.phones[1] ? 560 : 640) : 1160;
  return `<section class="s">${ft(n)}<div class="txt" style="width:${tw}px"><div class="k">${o.k}</div><h2>${o.h}</h2>${o.lead ? `<p class="lead">${o.lead}</p>` : ''}${o.steps ? steps(o.steps) : ''}${o.html || ''}${o.tip ? tip(o.tip, o.emo) : ''}</div>${right}</section>`;
}
const P = [
  { cover: 1, lead: 'Một cuốn sổ chung trên web cho cả lớp: theo dõi nề nếp, điểm kiểm tra và kỳ thi, báo cáo thi đua, sổ công tác chủ nhiệm, liên lạc với cha mẹ học sinh — và Trợ lý AI đọc số liệu của sổ để trả lời, soạn giúp cô.' },
  { toc: 1 },
  { div: 1, k: 'Phần 1', h: 'Bắt đầu', lead: 'Đăng nhập, bố cục màn hình và các nhóm chức năng.' },
  { k: 'Bắt đầu', h: 'Đăng nhập bằng email + mã 6 số', wide: 'login', steps: ['Mở <b>' + APP + '</b> (hoặc quét mã QR ở trang bìa).', 'Nhập <b>email đã được giáo viên chủ nhiệm cấp quyền</b> ▸ <b>Gửi mã đăng nhập</b>.', 'Mở hộp thư, nhập <b>mã 6 số</b> ▸ vào sổ. Lần sau sổ tự nhớ.'], tip: 'Trên điện thoại: mở trình duyệt ▸ <b>Thêm vào Màn hình chính</b> để dùng như một ứng dụng.', emo: 'chao' },
  { k: 'Bắt đầu', h: 'Bố cục: 4 nhóm chức năng', wide: 'tq', html: `<div class="grp">
      <div class="card"><b>Tổng quan</b><span>Thi đua · nề nếp, học lực, top điểm của lớp.</span></div>
      <div class="card"><b>Cập nhật</b><span>Theo dõi nề nếp · Điểm bộ môn.</span></div>
      <div class="card"><b>Báo cáo &amp; sổ</b><span>Kết quả rèn luyện · Báo cáo thi đua · Sổ công tác chủ nhiệm · Nhật ký.</span></div>
      <div class="card"><b>Quản lý</b><span>Cha mẹ học sinh · Cài đặt.</span></div></div>`, tip: 'Thanh trên cùng: <b>Trợ lý AI</b>, kính lúp tìm học sinh (phím <b>/</b>), giao diện, hướng dẫn <b>?</b>.', emo: 'huong-dan' },
  { div: 1, k: 'Phần 2', h: 'Giáo viên chủ nhiệm', lead: 'Theo dõi lớp, cập nhật nề nếp và điểm số, nhận xét, báo cáo, sổ chủ nhiệm.' },
  { k: 'Tổng quan', h: 'Tổng quan thi đua · nề nếp', wide: 'tq', steps: ['Chọn kỳ <b>Tháng · Học kỳ · Năm học</b>.', '4 ô số: học sinh, lượt tuyên dương, lượt vi phạm, % rèn luyện Tốt — <b>bấm vào ô</b> để xem chi tiết.', 'Biểu đồ kết quả rèn luyện, diễn biến theo tuần, thi đua giữa các tổ.', '<b>Tải PDF</b> trang tổng quan.'] },
  { k: 'Tổng quan', h: 'Học lực và top điểm', wide: 'tq_hl', steps: ['Tab <b>Học lực</b>: điểm trung bình kiểm tra, phân bố điểm, điểm trung bình từng môn.', 'Tab <b>Top điểm</b>: các em điểm cao theo môn hoặc chung.', 'Số liệu lấy từ <b>Điểm bộ môn</b> (giữa kì, cuối kì, kỳ thi).'] },
  { k: 'Theo dõi nề nếp', h: 'Ghi cộng / trừ điểm nề nếp', wide: 'ghi', ins: 'ghi_hs', steps: ['Chọn đúng <b>tháng · tuần</b> trên thanh đầu.', 'Bấm <b>tên học sinh</b> ▸ chọn <b>Trừ điểm</b> hoặc <b>Cộng điểm</b> ▸ chọn nội dung.', 'Thêm ghi chú, <b>ngày xảy ra</b>, ảnh minh chứng ▸ <b>Lưu</b>.', 'Ghi nhiều em: <b>Chọn nhiều</b> ▸ chạm các em ▸ Ghi điểm.'], tip: 'Mạng yếu cũng không mất: điểm hiện ngay, máy tự gửi lại khi có mạng.', emo: 'chup-anh' },
  { k: 'Điểm bộ môn', h: 'Điểm kiểm tra giữa kì · cuối kì', wide: 'ht_diem', steps: ['<b>Điểm bộ môn</b> ▸ thẻ <b>Giữa kì · cuối kì</b> ▸ chọn môn, học kì.', 'Gõ điểm thẳng vào ô — tự lưu.', 'Hoặc <b>Nhập từ Excel</b>: tệp có cột Họ tên + điểm (nhiều trang tính = nhiều môn).', 'Có điểm mới ⇒ cha mẹ đã đăng ký <b>tự nhận thư báo điểm</b>.'] },
  { k: 'Điểm bộ môn', h: 'Kỳ thi học sinh giỏi & ôn luyện', wide: 'ht_kt', steps: ['Thẻ <b>Kỳ thi &amp; ôn luyện</b> ▸ <b>Thêm kỳ thi</b>: loại (học sinh giỏi, ôn luyện trên app, kiểm tra), môn, ngày, thang điểm.', 'Bấm kỳ thi ▸ nhập điểm từng em hoặc từ Excel.', 'Xếp hạng, điểm trung bình tự tính; hiện trong hồ sơ và PDF của từng em.'] },
  { k: 'Kết quả rèn luyện', h: 'Xếp loại tháng · học kỳ', wide: 'bang', steps: ['Chọn kỳ <b>Tháng · Học kỳ</b>; xếp loại tự tính theo điểm nề nếp.', 'Bấm một em ▸ <b>Nhận xét</b>: xác nhận xếp loại, viết nhận xét.', 'Cuối tháng: <b>Khoá sổ tháng</b> — không ai sửa được dữ liệu tháng đó nữa.'] },
  { k: 'Kết quả rèn luyện', h: 'Gợi ý nhận xét bằng Trợ lý AI', wide: 'nhanxet_ai', steps: ['Trong ô nhận xét, bấm <b>Gợi ý nhận xét bằng AI</b>.', 'AI đọc nề nếp, điểm kiểm tra, kỳ thi của em ▸ viết lời nhận xét, kèm điểm mạnh, điều cần cố gắng, gợi ý cho cô.', 'Cô sửa lại ▸ <b>Lưu nhận xét</b>. Có nút <b>Hoàn tác</b>.'], tip: 'Gửi cho AI chỉ là số liệu — không có họ tên học sinh.', emo: 'suy-nghi' },
  { k: 'Tra cứu', h: 'Hồ sơ cả năm của một học sinh', wide: 'hoso', ins: 'tim', steps: ['Bấm kính lúp (phím <b>/</b>) ▸ gõ tên <b>không cần dấu</b> ▸ Enter.', 'Hồ sơ: điểm từng tuần, tháng, học kỳ, cả năm; các lượt cộng / trừ; điểm kiểm tra, kỳ thi.', '<b>Tải PDF</b> · <b>PDF gửi cha mẹ HS</b> · <b>Tải Excel</b>.'] },
  { k: 'Báo cáo thi đua', h: 'Báo cáo tuần · tháng · học kỳ · năm', wide: 'bc', steps: ['Chọn kỳ; số liệu tự so với kỳ trước.', 'Thống kê lỗi vi phạm, hoạt động được tuyên dương, thi đua các tổ — <b>bấm vào số</b> để xem chi tiết.', '<b>Tải PDF</b> (khổ ngang) · <b>Tải Excel</b> · <b>Tóm tắt gửi phụ huynh</b>.'] },
  { k: 'Báo cáo thi đua', h: 'AI viết nhận xét chung & phương hướng', wide: 'bc_ai', steps: ['Bấm <b>AI viết nhận xét chung &amp; phương hướng</b>.', 'AI dựa trên số liệu cả lớp (xếp loại, lỗi thường gặp, các tổ, so kỳ trước) để viết 2 phần.', 'Cô sửa lại nếu cần — nội dung đi vào PDF báo cáo.'], tip: 'Không gửi tên học sinh nào cho AI.', emo: 'khen-lon' },
  { k: 'Sổ công tác chủ nhiệm', h: 'Sổ chủ nhiệm điền sẵn, xuất Word', wide: 'scn', steps: ['8 thẻ theo đúng sổ: thông tin lớp, kế hoạch, theo dõi, sơ kết, tổng kết…', 'Phần số liệu <b>tự điền</b> từ sổ; cô bổ sung nội dung riêng, thêm ảnh (sơ đồ lớp, biên bản…).', 'Bấm <b>Tạo file Word</b>: đúng mẫu sổ của trường, in ngay.'] },
  { k: 'Nhật ký theo dõi', h: 'Mọi lượt ghi: ai ghi, lúc nào', wide: 'ls', steps: ['Lọc theo tháng, tuần, tổ, người ghi, loại cộng / trừ.', 'Thấy ngay tổng lượt, điểm cộng, điểm trừ.', '<b>Tải Excel</b> · <b>Tải PDF</b> nhật ký.'] },
  { k: 'Cha mẹ học sinh', h: 'Liên lạc với cha mẹ học sinh', wide: 'ph', steps: ['<b>Chép link</b> trang cha mẹ học sinh, gửi nhóm Zalo lớp.', 'Cha mẹ tự đăng ký email ▸ cô <b>Duyệt</b> (có chấm đỏ báo).', 'Bật / tắt email tự động: khi con được cộng / bị trừ điểm, khi có điểm mới.'] },
  { k: 'Quản lý', h: 'Cài đặt, tài khoản & phân quyền', wide: 'cai', steps: ['<b>Lớp &amp; xếp loại</b>: số tuần, mốc điểm xếp loại.', '<b>Danh mục điểm</b>: nội dung cộng / trừ, số điểm.', '<b>Tài khoản &amp; quyền</b>: thêm email cán bộ lớp; khoá / xoá tài khoản.', '<b>Học sinh</b>: thêm, đổi tổ, đánh dấu nghỉ học; <b>Giao diện</b>: chủ đề màu, nhân vật cô giáo.'] },
  { div: 1, k: 'Phần 3', h: 'Trợ lý AI', lead: 'Hỏi bằng lời thường về lớp — trợ lý đọc số liệu của sổ để trả lời, so sánh, soạn giúp cô.' },
  { k: 'Trợ lý AI', h: 'Mở Trợ lý AI và hỏi', wide: 'tl_mo', steps: ['Bấm <b>Trợ lý AI</b> trên thanh trên cùng, nút tròn góc phải, hoặc phím <b>Ctrl + J</b>.', 'Chọn một <b>câu hỏi gợi ý</b> (Nề nếp · Học tập · Soạn giúp cô) hoặc gõ tự do.', 'Enter để gửi; <b>⟲</b> bắt đầu cuộc trò chuyện mới.'], html: `<div style="margin-top:8px">${['Em nào cần quan tâm?', 'So sánh các tổ', 'Lỗi nào tăng?', 'Điểm giữa kì dưới 5?', 'Soạn tin Zalo'].map(t => `<span class="chip">${t}</span>`).join('')}</div>` },
  { k: 'Trợ lý AI', h: 'Đọc số liệu của sổ để trả lời', wide: 'tl_tl', steps: ['Trợ lý đọc điểm nề nếp, xếp loại, lỗi, điểm kiểm tra, kỳ thi của cả lớp.', 'Câu trả lời có số liệu cụ thể; <b>bấm tên học sinh</b> để mở hồ sơ em đó.', 'Hỏi tiếp nối: trợ lý nhớ các câu trước trong cuộc trò chuyện.'], tip: 'Câu trả lời là gợi ý — cô kiểm tra lại trước khi dùng.', emo: 'suy-nghi' },
  { k: 'Trợ lý AI', h: 'Soạn giúp cô · an toàn dữ liệu', wide: 'tl_zalo', html: `<div class="grp" style="grid-template-columns:1fr">
      <div class="card"><b>Soạn tin nhắn, kế hoạch</b><span>"Soạn tin nhắn Zalo tổng kết tuần cho nhóm cha mẹ", "Gợi ý kế hoạch chủ nhiệm tuần tới" ▸ bấm <b>Sao chép</b> để dán.</span></div>
      <div class="card"><b>Ẩn danh học sinh</b><span>Trước khi gửi, tên mỗi em được đổi thành mã (E01, E02…) — kể cả tên cô gõ trong câu hỏi. Không gửi email, số điện thoại, ghi chú.</span></div>
      <div class="card"><b>Chỉ giáo viên chủ nhiệm</b><span>Cán bộ lớp và cha mẹ không thấy Trợ lý AI; có giới hạn số lượt mỗi ngày.</span></div></div>` },
  { div: 1, k: 'Phần 4', h: 'Cán bộ lớp & Cha mẹ học sinh', lead: 'Ghi nề nếp, nhập điểm ngay trên điện thoại; cha mẹ theo dõi con và nhận thư báo.' },
  { k: 'Cán bộ lớp', h: 'Ghi nề nếp trên điện thoại', phones: ['m_ghi', 'm_hs'], steps: ['Mở sổ ▸ <b>Cập nhật</b> ▸ chọn đúng <b>tuần</b>.', 'Chạm tên bạn ▸ <b>Trừ điểm / Cộng điểm</b> ▸ nội dung.', 'Ghi chú, chụp ảnh minh chứng ▸ <b>Lưu</b>.'], tip: 'Ghi đúng, ghi ngay trong ngày. Mọi lượt ghi đều lưu tên người ghi.', emo: 'co-vu' },
  { k: 'Cán bộ lớp', h: 'Nhập điểm kiểm tra, kỳ thi', phones: ['m_ht'], steps: ['<b>Điểm bộ môn</b> ▸ <b>Giữa kì · cuối kì</b> hoặc <b>Kỳ thi &amp; ôn luyện</b>.', 'Chọn môn ▸ gõ điểm từng bạn.', 'Cô chủ nhiệm xem lại; cha mẹ đã đăng ký nhận thư báo điểm.'] },
  { k: 'Cha mẹ học sinh', h: 'Theo dõi con và nhận thư báo', phones: ['m_ph', 'm_ph_hs'], steps: ['Mở link giáo viên chủ nhiệm gửi ▸ tìm <b>tên con</b> (không cần dấu).', 'Xem kết quả rèn luyện theo tuần, tháng, học kỳ; tải PDF / Excel.', '<b>Nhận thông báo qua email</b> ▸ nhập email ▸ mã 6 số ▸ chờ giáo viên chủ nhiệm duyệt.'], tip: 'Trang chỉ để xem; cần trao đổi, các bác liên hệ giáo viên chủ nhiệm.', emo: 'chao' },
  { k: 'Hỏi đáp', h: 'Câu hỏi thường gặp', html: `<div class="grp">
      <div class="card"><b>Mạng yếu có mất điểm không?</b><span>Không. Điểm hiện ngay, nằm trong hàng đợi và tự gửi lại khi có mạng, không ghi trùng.</span></div>
      <div class="card"><b>Ghi nhầm tuần / nhầm em?</b><span>Mở em đó ▸ dòng vừa ghi ▸ Sửa hoặc Xoá (tháng chưa khoá sổ).</span></div>
      <div class="card"><b>Nhiều người cùng ghi?</b><span>Sổ cập nhật trực tiếp: vài giây sau mọi máy đều thấy.</span></div>
      <div class="card"><b>Trợ lý AI có thấy tên học sinh?</b><span>Không. Tên được đổi thành mã trước khi gửi; câu trả lời đổi lại thành tên trên máy cô.</span></div>
      <div class="card"><b>Xem lại hướng dẫn?</b><span>Nút <b>?</b> ▸ Hướng dẫn từng bước, hoặc quét mã QR bên dưới.</span></div>
      <div class="card"><b>Dùng thử không ảnh hưởng sổ thật?</b><span>Bản demo dùng dữ liệu ảo, mã truy cập <b>11D3Yenhoa</b>.</span></div></div>
      <div class="qrs"><div><img src="${qr('https://' + APP + '/')}">Mở sổ</div><div><img src="${qr('https://' + APP + '/demo.html')}">Bản demo</div><div><img src="${qr('https://' + APP + '/docs/HDSD_Day_du.pdf')}">Tài liệu này</div><div><img src="${qr('https://' + APP + '/phu-huynh.html')}">Trang cha mẹ HS</div></div>` }
];
// mục lục
const toc = []; P.forEach((o, i) => { if (o.div) toc.push([o.k + ' · ' + o.h, i + 1]); });
P[1] = { k: 'Mục lục', h: 'Nội dung tài liệu', html: `<div class="toc">${toc.map(([t, n]) => `<div class="card"><b>${t}</b><em>trang ${n}</em></div>`).join('')}</div>`, tip: 'Ảnh trong tài liệu chụp từ bản demo — dữ liệu ảo, không phải học sinh thật.', emo: 'huong-dan' };
(async () => {
  const b = await chromium.launch();
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${P.map((o, i) => page(i + 1, o)).join('')}</body></html>`;
  fs.writeFileSync(path.join(__dirname, '_HDSD_Day_du_65.html'), html);
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  await p.setContent(html, { waitUntil: 'load' });
  const tran = await p.evaluate(() => [...document.querySelectorAll('section')].map((s, i) => { const t = s.querySelector('.txt'); return t && t.scrollHeight + t.offsetTop > 680 ? i + 1 : 0; }).filter(Boolean));
  await p.pdf({ path: path.join(ROOT, 'docs', 'HDSD_Day_du.pdf'), width: '1280px', height: '720px', printBackground: true });
  fs.mkdirSync(path.join(__dirname, '_xem65'), { recursive: true });
  for (let i = 0; i < P.length; i++) { const sc = (await p.$$('section'))[i]; await sc.screenshot({ path: path.join(__dirname, '_xem65', String(i + 1).padStart(2, '0') + '.png') }); }
  console.log('📄 HDSD_Day_du.pdf', P.length, 'trang · trang chữ tràn:', tran.join(',') || 'không'); await b.close();
})();
