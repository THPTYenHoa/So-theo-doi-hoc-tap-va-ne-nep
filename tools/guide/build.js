/* Dựng 3 PDF hướng dẫn (ngang 16:9): NODE_PATH=$(npm root -g) node tools/guide/build.js  → docs/HDSD_GVCN.pdf, HDSD_Can_bo_lop.pdf, HDSD_Phu_huynh.pdf
   Ảnh: tools/guide/shots (tools/guide/cap.js, dữ liệu giả). Nhân vật: mascot.js (chibi SVG tạm / ảnh thật khi có). */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '../..'), SH = path.join(__dirname, 'shots');
const img = n => 'data:image/png;base64,' + fs.readFileSync(path.join(SH, n + '.png')).toString('base64');
const APP = 'thptyenhoa.github.io/So-theo-doi-hoc-tap-va-ne-nep';
global.window = {}; global.document = { createElement: () => ({ style: {} }), head: { appendChild() {} } }; global.localStorage = { getItem: () => null, setItem() {} };
require(path.join(ROOT, 'mascot.js')); const M = global.window.MASCOT;
/* v3.9: mỗi hình cô Thảo chọn ngẫu nhiên trong các bộ trang phục có biểu cảm đó (thư mục mascot/<vai>/<emo>.webp) */
const SETS = fs.readdirSync(path.join(ROOT, 'mascot')).filter(d => fs.existsSync(path.join(ROOT, 'mascot', d, 'goc.webp')) || fs.existsSync(path.join(ROOT, 'mascot', d, 'chao.webp')));
const pickSet = emo => { const c = SETS.filter(d => fs.existsSync(path.join(ROOT, 'mascot', d, emo + '.webp'))); return c.length ? c[Math.floor(Math.random() * c.length)] : 'chu-nhiem'; };
const chibi = (emo, st) => { const f = path.join(ROOT, 'mascot', pickSet(emo), emo + '.webp'); return fs.existsSync(f) ? 'data:image/webp;base64,' + fs.readFileSync(f).toString('base64') : 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(M.svg(emo, st || 'kawaii')); };   /* v3.6: ảnh 3D */
const VER = '3.6', TODAY = '10/2026';

const CSS = `
@page{size:1280px 720px;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Aptos,Inter,'Segoe UI',sans-serif;color:#1B333A;background:#fff}
.s{width:1280px;height:720px;position:relative;overflow:hidden;page-break-after:always;background:#F6F9FA}
.s .bar{position:absolute;left:0;top:0;right:0;height:6px;background:linear-gradient(90deg,#0E7C86,#1AA0AB)}
.s .ft{position:absolute;left:56px;right:56px;bottom:22px;display:flex;justify-content:space-between;font-size:12px;color:#8AA6AD}
.s .no{position:absolute;right:56px;top:34px;font-size:13px;font-weight:800;color:#8AA6AD}
.k{font-size:13px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#0E7C86}
h1{font-family:Georgia,'Times New Roman',serif;font-size:58px;line-height:1.08;color:#0A5C64;font-weight:700}
h2{font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.15;color:#0A5C64;font-weight:700;margin:6px 0 14px}
.lead{font-size:18px;line-height:1.55;color:#41566F}
.txt{position:absolute;left:56px;top:56px;width:560px}
.steps{list-style:none;margin-top:6px}
.steps li{display:flex;gap:12px;align-items:flex-start;margin:0 0 13px;font-size:16.5px;line-height:1.5;color:#2C434B}
.steps li i{flex:none;width:28px;height:28px;border-radius:50%;background:#E07B39;color:#fff;font-style:normal;font-weight:800;font-size:14px;display:grid;place-items:center;margin-top:1px}
.steps li b{color:#0A5C64}
.tip{margin-top:10px;display:flex;gap:10px;align-items:flex-start;background:#fff;border:1px solid #E3ECEE;border-radius:14px;padding:12px 14px;font-size:14.5px;line-height:1.5;color:#41566F}
.tip img{width:54px;height:54px;flex:none}
.ph{position:absolute;top:44px;height:632px;border-radius:26px;border:8px solid #1B333A;background:#1B333A;overflow:hidden;box-shadow:0 18px 40px rgba(20,40,50,.18)}
.ph img{display:block;height:100%;width:auto}
.ph1{right:96px}.ph2a{right:330px}.ph2b{right:40px}
.dk{position:absolute;right:36px;top:96px;width:690px;border-radius:12px;border:1px solid #D9E4E7;overflow:hidden;box-shadow:0 18px 40px rgba(20,40,50,.16)}
.dk img{display:block;width:100%}
.cover{background:linear-gradient(135deg,#E6F3F4 0%,#FFFFFF 55%,#FFF8EC 100%)}
.cover .txt{top:120px;width:900px}
.cover .who{display:inline-block;margin-top:22px;padding:8px 16px;border-radius:999px;background:#0E7C86;color:#fff;font-weight:800;font-size:16px}
.cover .chibi{position:absolute;right:120px;top:120px;width:380px;height:380px}
.cover .meta{position:absolute;left:56px;bottom:60px;font-size:14px;color:#5C7A83;line-height:1.6}
.qr{position:absolute;right:84px;bottom:56px;text-align:center;font-size:12px;color:#5C7A83}
.qr img{width:150px;height:150px;border-radius:10px;border:1px solid #E3ECEE;background:#fff;display:block;margin:0 auto 6px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:16px}
.card{background:#fff;border:1px solid #E3ECEE;border-radius:16px;padding:16px}
.card b{display:block;color:#0A5C64;font-size:16px;margin-bottom:5px}
.card span{font-size:14.5px;line-height:1.5;color:#41566F}
.faq .card{margin-bottom:12px}
.mc{position:absolute;left:44px;bottom:44px;height:200px;width:200px;object-fit:contain;filter:drop-shadow(0 10px 14px rgba(20,40,50,.14))}
.pp{position:absolute;right:110px;top:40px;height:640px;border:1px solid #D9E4E7;box-shadow:0 18px 40px rgba(20,40,50,.16);background:#fff}
.div{background:linear-gradient(135deg,#0E7C86 0%,#0A5C64 100%);color:#fff}
.div .txt{top:170px;width:760px} .div .k{color:#BFE6E9} .div h1{color:#fff} .div .lead{color:#E3F4F5}
.div .chibi{position:absolute;right:120px;top:150px;width:340px;height:340px} .div .ft,.div .no{color:#BFE6E9}
.toc{margin-top:18px} .toc .card{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.toc .card b{margin:0} .toc .card em{font-style:normal;font-weight:800;color:#E07B39;font-size:15px}
`;
const ft = (title, n) => `<div class="bar"></div><div class="no">${String(n).padStart(2, '0')}</div><div class="ft"><span>Sổ theo dõi học sinh 11D3 · THPT Yên Hòa · ${title}</span><span>Phiên bản ${VER} · ${TODAY} · ${APP}</span></div>`;
const steps = a => `<ul class="steps">${a.map((t, i) => `<li><i>${i + 1}</i><span>${t}</span></li>`).join('')}</ul>`;
const tip = (t, emo) => `<div class="tip"><img src="${chibi(emo || 'chi-tay')}"><span>${t}</span></div>`;
const phone = (a, b) => b ? `<div class="ph ph2a"><img src="${img(a)}"></div><div class="ph ph2b"><img src="${img(b)}"></div>` : `<div class="ph ph1"><img src="${img(a)}"></div>`;
function slide(T, n, o) {
  if (o.cover) return `<section class="s cover">${ft(T, n)}<div class="txt"><div class="k">${o.kk || 'Hướng dẫn sử dụng'}</div><h1>Sổ theo dõi<br>học sinh 11D3</h1><p class="lead" style="margin-top:14px">${o.lead}</p>${o.who ? `<span class="who">${o.who}</span>` : ""}</div>
    <div class="meta">THPT Yên Hòa · Năm học 2026 – 2027<br>${o.meta || ''}</div>${o.qr ? `<div class="qr"><img src="${img(o.qr)}">${o.qrt}</div>` : ''}</section>`;
  if (o.div) return `<section class="s div">${ft(T, n)}<div class="txt"><div class="k">${o.k}</div><h1>${o.h}</h1><p class="lead" style="margin-top:16px">${o.lead}</p></div></section>`;
  /* v3.6: cô Thảo 3D ở trang nội dung — biểu cảm theo chủ đề trang (tự bỏ nếu chạm chữ, xem bước kiểm tra trước khi in) */
  const POSE = { 'Bắt đầu': ['chao'], 'Tổng quan': ['huong-dan'], 'Ghi điểm': ['chi-tay', 'vui', 'chup-anh', 'co-vu'], 'Trực tiếp': ['ngac-nhien', 'vui'],
    'Xếp loại': ['suy-nghi', 'nghiem'], 'Báo cáo': ['khen-lon', 'huong-dan', 'cam-on'], 'Quản lý lớp': ['nghiem', 'chi-tay', 'huong-dan'], 'Cá nhân hoá': ['vui'],
    'Phụ huynh': ['chao'], 'Mẹo': ['suy-nghi', 'nghi-ngoi'], 'Trước khi ghi': ['chi-tay'], 'Lưu': ['chup-anh'], 'Tra cứu': ['suy-nghi'],
    'Bước 1': ['chi-tay'], 'Bước 2': ['huong-dan'], 'Bước 3': ['an-mung'], 'Lưu ý': ['cam-on'], 'Mục lục': ['chao'] };
  slide.c = slide.c || {}; const lst = POSE[o.k] || ['vui'], ci = slide.c[T + o.k] = (slide.c[T + o.k] || 0) + 1;
  const mc = o.noMc ? '' : `<img class="mc" src="${chibi(o.pose || lst[(ci - 1) % lst.length])}">`;
  const w = o.wide ? `<div class="dk"><img src="${img(o.wide)}"></div>` : (o.shots ? phone(...o.shots) : '');
  const tw = o.tw || (o.wide || /class="dk"/.test(o.right || '')) ? (o.tw || 500) : (o.shots && o.shots[1] ? 560 : 640);
  return `<section class="s">${ft(T, n)}<div class="txt" style="width:${tw}px"><div class="k">${o.k}</div><h2>${o.h}</h2>${o.lead ? `<p class="lead">${o.lead}</p>` : ''}${o.steps ? steps(o.steps) : ''}${o.html || ''}${o.tip ? tip(o.tip, o.emo) : ''}</div>${w}${o.right || ''}${mc}</section>`;
}
const LOGIN = { k: 'Bắt đầu', h: 'Đăng nhập bằng email + mã 6 số', shots: ['login1', 'login2'], steps: ['Nhập <b>email đã đăng ký với GVCN</b> vào ô Email.', 'Bấm <b>Gửi mã đăng nhập</b> — mở hộp thư, lấy <b>mã 6 số</b> (xem cả mục Thư rác).', 'Nhập mã ▸ tự vào sổ. Máy được ghi nhớ <b>30 ngày</b>.'], tip: 'Không còn mật khẩu chung — mỗi người chỉ vào được bằng email của mình. Chưa vào được? Nhờ GVCN thêm / sửa email trong mục Tài khoản.', emo: 'chao' };
const DOCS = {
  'HDSD_GVCN': { T: 'Hướng dẫn GVCN', slides: [
    { cover: 1, who: 'Dành cho Giáo viên chủ nhiệm', lead: 'Ghi điểm, xác nhận xếp loại, thống kê và quản lý lớp — trên máy tính lẫn điện thoại.', meta: 'Đăng nhập: ' + APP, qr: 'qr_app', qrt: 'Mở sổ bằng điện thoại' },
    LOGIN,
    { k: 'Tổng quan', h: 'Màn hình chính (máy tính)', wide: 'd_home', steps: ['<b>Menu</b>: Ghi điểm · Hạnh kiểm · Thống kê · Báo cáo · Lịch sử · Phụ huynh · Cài đặt.', '<b>Tháng + tuần</b> đang ghi — kiểm tra trước khi ghi điểm.', '<b>Danh sách lớp</b>: điểm tuần, xếp loại, các lỗi vừa ghi.', '<b>Tra cứu nhanh</b> (phím /).', '<b>Giao diện</b>: màu, hình nền, nhân vật cô giáo.', '<b>?</b> Hướng dẫn từng bước + file PDF.'] },
    { k: 'Tổng quan', h: 'Dải điểm tuần tự lật', wide: 'd_tk', steps: ['<b>Điểm tuần</b>: tự lật chậm qua mọi lượt cộng / trừ của cả lớp trong tuần (6 giây một lượt).', 'Rê chuột để <b>dừng</b>; bấm <b>‹ ›</b> để xem tay.', 'Bấm một lượt ⇒ <b>Xem hồ sơ · Sửa / xoá · Ghi thêm · Nhận xét</b> (tuỳ quyền).'], pose: 'chi-tay' },
    { k: 'Tổng quan', h: 'Tìm kiếm thông minh', wide: 'd_sq', steps: ['Gõ tự nhiên: <b>"tổ 2 vi phạm"</b>, <b>"khá"</b>, <b>"đi muộn"</b>, tên học sinh (không cần dấu).', 'Hoặc bấm <b>chip</b>: Vi phạm · Được khen · Tổ · Xếp loại · lỗi hay gặp.', 'Thẻ / bảng lọc ngay, hiện số học sinh khớp. Có ở <b>Cập nhật hạnh kiểm</b> và <b>Báo cáo</b>.'] },
    { k: 'Tổng quan', h: 'Rê chuột: điểm từ đâu?', wide: 'd_tip', steps: ['Rê chuột vào <b>ô điểm</b> bất kỳ (tuần, tháng, bảng tổng hợp, báo cáo).', 'Hiện ngay <b>được cộng</b> / <b>bị trừ</b> từ những nội dung nào, mấy lần, tuần nào.'] },
    { k: 'Ghi điểm', h: 'Ghi điểm cho một học sinh', shots: ['home', 'student'], steps: ['Chọn đúng <b>tháng / tuần</b> ở thanh trên.', 'Lọc nhanh theo <b>tổ</b>.', 'Chạm vào <b>tên học sinh</b> ▸ mở bảng ghi điểm.', 'Hoặc <b>Chọn nhiều</b> để ghi cho cả nhóm.', 'Kính lúp: <b>tra cứu</b> một em.', 'Thanh dưới: chuyển giữa các mục (điện thoại).'] },
    { k: 'Ghi điểm', h: 'Diễn giải & ảnh bằng chứng', shots: ['note', 'saved'], steps: ['Ghi rõ <b>vì sao</b> (hiện ngay cạnh tên học sinh).', 'Bấm <b>micro</b> để nói thay vì gõ.', '<b>Chụp ảnh / chọn ảnh, tài liệu</b> làm bằng chứng (biên bản, giấy khen…).', 'Bấm <b>Lưu điểm</b> — điểm hiện ngay, máy tự lưu phía sau. Lỡ tay: bấm <b>Hoàn tác</b> trong 5 giây.'], tip: 'Cô giáo chibi phản ứng theo từng lần ghi: vui khi khen, buồn khi trừ, nghiêm khi tái phạm lần 2, "giận" khi vi phạm nhiều lần.', emo: 'vui' },
    { k: 'Ghi điểm', h: 'Ghi cho nhiều em & xem bằng chứng', shots: ['multi', 'evview'], steps: ['<b>Chọn nhiều</b> ▸ chạm các em cần ghi.', 'Các em đã chọn được tô màu.', 'Bấm <b>Ghi điểm</b> ▸ chọn lý do — áp cho cả nhóm.'], html: `<p class="lead" style="font-size:16px;margin-top:6px">Bấm biểu tượng <b>📎</b> cạnh một ghi nhận để xem lại bằng chứng, phóng to ảnh, thêm ảnh hoặc gỡ file. File lưu trong thư mục Drive riêng của lớp — <b>phụ huynh không xem được</b>.</p>` },
    { k: 'Ghi điểm', h: 'Thẻ tổng quan tuần', shots: ['hero', 'hero_loc'], steps: ['<b>Cô Thảo chào</b> cùng tuần, tháng đang xem.', '<b>4 ô số</b>: lượt trừ, lượt khen, số bạn cần nhắc nhở, % đạt Tốt.', '<b>Vừa cập nhật</b>: ai vừa ghi gì — chạm để mở bạn đó.'], tip: 'Bấm một ô (ví dụ "Cần nhắc") để lọc ngay các bạn đó; bấm "Bỏ lọc ✕" để xem lại cả lớp.', emo: 'chi-tay' },
    { k: 'Trực tiếp', h: 'Sổ tự cập nhật — không cần tải lại', shots: ['live'], steps: ['Lớp trưởng / tổ trưởng vừa ghi ⇒ máy cô hiện <b>thông báo nhỏ</b> sau vài giây (chạm để mở bạn đó).', 'Nhãn <b>● Trực tiếp</b> màu xanh: sổ đang đồng bộ. Xám "Mất kết nối": máy tự thử lại khi có mạng.', 'Mục mới <b>trượt vào</b>, mục bị xoá <b>thu gọn</b> lại, điểm thay đổi sẽ nảy lên.'], tip: 'Lưu, xoá đều hiện ngay trên máy mình; máy chủ ghi phía sau. Mạng yếu cũng không mất điểm.', emo: 'vui' },
    { k: 'Xếp loại', h: 'Cập nhật hạnh kiểm & hồ sơ học sinh', shots: ['bang', 'profile'], steps: ['Chọn kỳ: <b>Tháng · Học kỳ</b> (xếp loại không tính theo tuần).', 'Xem dạng <b>thẻ chi tiết</b> hoặc <b>bảng tổng hợp</b>.', 'Chạm một em ▸ <b>hồ sơ cả năm</b>: điểm từng tuần, từng tháng, học kỳ.', '<b>Nhận xét</b> & xác nhận xếp loại; <b>In / PDF</b>, <b>Tải Excel</b>.'] },
    { k: 'Xếp loại', h: 'Nhận xét & xác nhận xếp loại tháng', shots: ['remark'], steps: ['Chọn <b>xác nhận xếp loại</b> (để trống = tính tự động theo điểm).', 'Viết <b>nhận xét</b> về ý thức, nề nếp, tiến bộ — phụ huynh đọc được.'], tip: 'Xếp loại có dấu ✓ là GVCN đã xác nhận. Màu: xanh lá Tốt · xanh dương Khá · vàng Trung bình · đỏ Yếu.', emo: 'huong-dan' },
    { k: 'Xếp loại', h: 'Khoá sổ tháng', shots: ['lock'], steps: ['Cuối tháng, cô vào <b>Cập nhật hạnh kiểm</b> (hoặc Báo cáo tháng) ▸ bấm <b>Khoá sổ tháng</b>.', 'Từ lúc đó mọi ghi nhận, nhận xét, ảnh bằng chứng của tháng <b>chỉ còn xem</b> — không ai thêm, sửa, xoá được (máy chủ cũng chặn).', 'Cần chỉnh lại: bấm <b>Mở khoá</b>, sửa xong khoá sổ lại.'], tip: 'Chỉ cô chủ nhiệm khoá sổ và mở khoá được. Cán bộ lớp thấy dải vàng "đã khoá sổ".', emo: 'nghiem' },
    { k: 'Xếp loại', h: 'PDF riêng từng học sinh', steps: ['Chạm tên học sinh ▸ chọn <b>tháng · học kỳ · cả năm</b>.', 'Bấm <b>Tải PDF báo cáo</b>: file khổ ngang — điểm từng tuần / tháng, cộng / trừ, so với kỳ trước.', 'Trang 2: <b>lỗi thường mắc</b>, <b>khen thưởng</b>, nhận xét của cô; sau đó bảng từng lần ghi nhận.'], tip: 'Hình cô Thảo trong file đổi theo kết quả của em. Phụ huynh tải được file tương tự ở trang phụ huynh.', emo: 'huong-dan', right: `<div class="dk"><img src="${img('hs_pdf')}"></div>` },
    { k: 'Phụ huynh', h: 'Trang Phụ huynh của cô', wide: 'd_ph', steps: ['<b>Chép link</b> trang phụ huynh gửi nhóm Zalo lớp.', 'Số học sinh đã có email phụ huynh, số <b>đăng ký chờ duyệt</b>, email tự động bật / tắt.', '<b>Duyệt / Từ chối</b> phụ huynh đăng ký; cài đặt email.', 'Danh sách email phụ huynh từng em — lọc <b>Chưa có email</b>, bấm <b>Sửa</b>.'], pose: 'cam-on' },
    { k: 'Phụ huynh', h: 'Email cho phụ huynh', html: `<div class="grid3" style="grid-template-columns:1fr;gap:10px;margin-top:4px">
      <div class="card"><b>Phụ huynh tự đăng ký</b><span>Ở trang phụ huynh, các bác mở hồ sơ của con ▸ <strong>Nhận thông báo qua email</strong> ▸ nhập email ▸ nhập mã 6 số gửi về hộp thư.</span></div>
      <div class="card"><b>Cô được báo ngay · cô duyệt</b><span>Màn hình cô hiện thẻ <strong>Phụ huynh vừa đăng ký</strong> (chấm đỏ ở menu <strong>Phụ huynh</strong>) và cô nhận email báo ▸ <strong>Duyệt ngay</strong>. Duyệt xong, phụ huynh nhận thư xác nhận <strong>kèm file hướng dẫn PDF</strong>; email được ghi vào ô Email phụ huynh của học sinh.</span></div>
      <div class="card"><b>Tự động gửi</b><span>Mỗi khi con được cộng / bị trừ điểm, các bác nhận thư có lời cô Thảo theo tình huống và nút mở <strong>PDF thông báo</strong>. Cài đặt ▸ Email cho phụ huynh: bật / tắt, có báo điểm cộng hay không.</span></div></div>`, tip: 'Phụ huynh bấm "Không nhận thư nữa" ở cuối thư là dừng ngay.', emo: 'cam-on', right: `<div class="dk"><img src="${img('tb_pdf')}"></div>` },
    { k: 'Báo cáo', h: 'Thống kê & lịch sử', shots: ['tk', 'ls'], steps: ['<b>Thống kê</b>: chọn Tháng / Học kỳ / Cả năm — em vi phạm nhiều, em được khen, lỗi hay mắc, so sánh tổ, chỉ tiêu xếp loại Khá.', '<b>Lịch sử</b>: lọc theo tháng, tổ, học sinh ▸ <b>Xuất Excel</b> hoặc <b>In / PDF</b> để nộp bản giấy.'] },
    { k: 'Báo cáo', h: 'Báo cáo tháng · học kỳ · cả năm', wide: 'd_bc', steps: ['Chọn kỳ: <b>Tháng · Học kỳ · Cả năm</b>; GVCN lấy thêm <b>báo cáo tuần</b> khi cần (nút Tuần ở cuối).', '<b>In / Lưu PDF · Tải Excel · Tóm tắt gửi phụ huynh</b>.', '4 ô số kèm <b>▲▼ so với kỳ trước</b> (xanh tốt lên, đỏ kém đi).', 'Xếp loại + chỉ tiêu, biểu đồ, <b>thi đua tổ</b>, lỗi theo nhóm, tuyên dương.'] },
    { k: 'Báo cáo', h: 'Nhận xét tự soạn từ số liệu', wide: 'd_bc3', steps: ['<b>Nhận xét chung</b> soạn sẵn: sĩ số, vi phạm, xếp loại, lỗi hay mắc, tổ dẫn đầu, tuyên dương.', '<b>Phương hướng</b> gợi ý theo nhóm lỗi nhiều nhất.', '<b>Viết lại tự động</b> nếu muốn soạn lại từ số liệu mới nhất.'], tip: 'Cô sửa thẳng vào khung — máy tự lưu, bản in dùng đúng nội dung đã sửa. Phía trên có danh sách học sinh cần quan tâm kèm lý do.', emo: 'huong-dan' },
    { k: 'Báo cáo', h: 'PDF khổ ngang · gửi phụ huynh', steps: ['<b>In / Lưu PDF</b>: file khổ ngang — số liệu so với kỳ trước, biểu đồ, xếp hạng tổ, tuyên dương, nhắc nhở, nhận xét, chữ ký GVCN, phụ lục.', '<b>Tải Excel</b>: toàn bộ số liệu báo cáo.', '<b>Tóm tắt gửi phụ huynh</b>: sao chép đoạn tin, dán vào nhóm Zalo.'], tip: 'Tóm tắt gửi phụ huynh chỉ nêu tên các em được tuyên dương — không nêu tên học sinh vi phạm.', emo: 'cam-on', right: `<div class="dk"><img src="${img('bc_print')}"></div>` },
    { k: 'Quản lý lớp', h: 'Ai được làm gì trong sổ', shots: ['quyen'], html: `<div class="grid3" style="grid-template-columns:1fr;gap:10px;margin-top:4px">
      <div class="card"><b>GVCN — toàn quyền</b><span>Ghi điểm cả lớp, sửa danh mục, cấu hình; <strong>cấp quyền cho email khác</strong>, khoá / xoá tài khoản; <strong>đổi tổ</strong>, thêm, <strong>xoá học sinh</strong>.</span></div>
      <div class="card"><b>Lớp trưởng</b><span>Ghi điểm cả lớp, sửa danh mục điểm và cấu hình kỳ theo dõi.</span></div>
      <div class="card"><b>Tổ trưởng</b><span>Chỉ ghi điểm cho tổ mình.</span></div></div>`, tip: 'Máy chủ cũng kiểm tra lại quyền, nên dù ai cố tình gửi lệnh sai vai trò cũng bị chặn.', emo: 'nghiem' },
    { k: 'Quản lý lớp', h: 'Học sinh: thêm · đổi tổ · xoá', shots: ['hs_to', 'hs_form'], steps: ['<b>Cài đặt ▸ Đổi tổ hàng loạt</b> ▸ chạm chọn các em.', 'Chọn <b>tổ mới</b>.', 'Bấm <b>Áp dụng</b> — đổi tổ cho tất cả các em đã chọn.', 'Sửa từng em: <b>Sửa danh sách</b> ▸ chạm tên ▸ đổi tổ, trạng thái, hoặc <b>Xoá khỏi danh sách</b>.'], tip: 'Em chuyển lớp / nghỉ học: nên bấm "Đánh dấu nghỉ học / chuyển lớp" thay vì xoá — em đó ẩn khỏi sổ nhưng vẫn giữ lịch sử điểm.', emo: 'huong-dan' },
    { k: 'Quản lý lớp', h: 'Tài khoản cán bộ lớp', shots: ['accounts', 'accform'], steps: ['<b>Cài đặt ▸ Tài khoản & phân quyền ▸ Thêm</b>.', 'Nhập <b>email</b> của em (email em dùng hằng ngày).', 'Chọn <b>vai trò</b>: Lớp trưởng (ghi cả lớp) hoặc Tổ trưởng.', 'Chọn <b>tổ phụ trách</b> ▸ <b>Thêm tài khoản</b>. Em đăng nhập bằng email + mã, không cần mật khẩu.'], tip: 'Khoá tạm một em: mở tài khoản ▸ Trạng thái: Đã khoá. Bấm Xoá tài khoản để thu hồi quyền hẳn — có hiệu lực ngay.', emo: 'nghiem' },
    { k: 'Cá nhân hoá', h: 'Cài đặt & tài khoản', wide: 'd_cai', steps: ['Cài đặt chia <b>mục bên trái</b>: Lớp & xếp loại · Danh mục điểm · Tài khoản & quyền · Thông báo · Phụ huynh · Giao diện · Dữ liệu.', 'Bấm <b>avatar góc phải</b> ⇒ tài khoản của cô, Phụ huynh, Đổi giao diện, Hướng dẫn, <b>Đăng xuất</b>.'] },
    { k: 'Cá nhân hoá', h: 'Giao diện & nhân vật cô giáo', shots: ['theme', 'theme2'], steps: ['Chọn <b>nhân vật cô giáo</b> — cô Thảo 3D với 7 bộ trang phục (chủ nhiệm, áo len, áo dài trắng, áo dài chàm, lên lớp, STEM, mùa đông) — để <b>Tự động</b> thì cô đổi ngẫu nhiên theo từng tình huống.', 'Chọn <b>chủ đề màu & hình nền</b>: Mận chín, Chàm màu nước, Vở ô ly, Hoa phượng…'], html: `<p class="lead" style="font-size:16px;margin-top:4px">GVCN bấm <b>"Đặt … làm mặc định cho cả lớp"</b> để mọi người (và trang phụ huynh) cùng dùng chủ đề đó.</p>` },
    { k: 'Phụ huynh', h: 'Gửi trang xem sổ cho phụ huynh', html: `<p class="lead">Phụ huynh <b>không cần đăng nhập</b>: mở đường link (hoặc quét mã QR) để tìm tên con, xem xếp loại theo tháng / học kỳ / cả năm, từng lỗi và lần được khen, tải PDF / Excel. Không sửa được dữ liệu, không xem được ảnh bằng chứng.</p>
      <div class="grid3"><div class="card"><b>Link</b><span>${APP}/phu-huynh.html</span></div><div class="card"><b>Hướng dẫn riêng</b><span>File HDSD_Phu_huynh.pdf (nút ? ▸ Hướng dẫn cho phụ huynh)</span></div><div class="card"><b>Gửi qua Zalo nhóm lớp</b><span>Dán link + file PDF hướng dẫn</span></div></div>`, shots: ['ph_prof'] },
    { k: 'Mẹo', h: 'Câu hỏi thường gặp', html: `<div class="faq" style="margin-top:6px">
      <div class="card"><b>Mạng yếu, ghi điểm có mất không?</b><span>Không. Điểm hiện ngay và nằm trong hàng đợi; máy tự gửi lại khi có mạng, không bao giờ ghi trùng. Chip "Đang lưu…" chuyển "Đã lưu vào sổ" là xong.</span></div>
      <div class="card"><b>Ghi nhầm tuần / nhầm em?</b><span>Mở em đó ▸ dòng vừa ghi ▸ Sửa (đổi tuần, điểm, ghi chú) hoặc Xoá.</span></div>
      <div class="card"><b>Sửa thẳng trên Google Sheet được không?</b><span>Được — mở lại app là tự cập nhật. Nút hình bảng trên đầu trang (máy tính) mở Sheet gốc.</span></div>
      <div class="card"><b>Xem lại hướng dẫn?</b><span>Nút ? ▸ Hướng dẫn từng bước (cô giáo chibi chỉ tận tay từng nút).</span></div></div>`, shots: ['help'] }
  ]},
  'HDSD_Can_bo_lop': { T: 'Hướng dẫn cán bộ lớp', slides: [
    { cover: 1, who: 'Dành cho Lớp trưởng & Tổ trưởng', lead: 'Ghi điểm cộng / trừ cho các bạn nhanh, đúng tuần, có ảnh bằng chứng — ngay trên điện thoại.', meta: 'Đăng nhập: ' + APP, qr: 'qr_app', qrt: 'Mở sổ bằng điện thoại', emo: 'co-vu' },
    LOGIN,
    { k: 'Trước khi ghi', h: 'Chọn đúng tuần & tổ', shots: ['tt_home'], steps: ['Kiểm tra <b>tháng + tuần</b> đang ghi — ghi nhầm tuần thì điểm cả tháng lệch.', '<b>Tổ trưởng</b> chỉ ghi được cho <b>tổ mình</b>; lớp trưởng ghi cả lớp.', 'Danh sách các bạn: điểm tuần + xếp loại bên phải.'], tip: 'Bạn tổ khác hiện chữ "chỉ xem" — không ghi được, đó là bình thường.', emo: 'huong-dan' },
    { k: 'Ghi điểm', h: 'Ghi điểm cho một bạn', shots: ['student', 'note'], steps: ['Chạm tên bạn ▸ chọn <b>Trừ điểm</b> hoặc <b>Cộng điểm</b> ▸ chạm <b>lý do</b>.', 'Ghi rõ <b>vì sao</b> — hoặc bấm <b>micro</b> để nói.', '<b>Chụp ảnh</b> bằng chứng nếu có (biên bản, sổ đầu bài, giấy khen…).', 'Bấm <b>Lưu điểm</b>.'], tip: 'Lỗi tái phạm: app tự hỏi tính điểm gốc hay nhân hệ số theo quy định trường.', emo: 'chup-anh' },
    { k: 'Ghi điểm', h: 'Ghi nhiều bạn · Hoàn tác', shots: ['multi'], steps: ['<b>Chọn nhiều</b> ▸ chạm các bạn cần ghi.', 'Các bạn đã chọn được tô màu.', 'Bấm <b>Ghi điểm</b> ▸ chọn lý do — áp cho cả nhóm.'], html: `<p class="lead" style="font-size:16px;margin-top:6px">Lỡ tay? Bấm <b>Hoàn tác</b> ở thông báo cuối màn hình trong 5 giây. Xoá nhanh một lỗi: bấm <b>✕</b> cạnh lỗi đó.</p>` },
    { k: 'Lưu', h: 'Đã lưu chưa?', shots: ['tt_saving'], steps: ['Chip <b>Đang lưu…</b> ▸ <b>Đã lưu vào sổ</b>: điểm đã vào Google Sheet.', '<b>Hoàn tác</b> trong 5 giây nếu ghi nhầm.'], tip: 'Mạng yếu cứ để máy tự gửi lại — đừng ghi lại lần nữa, máy không bao giờ ghi trùng. Chip đỏ = lỗi thật: bấm Thử lại.', emo: 'suy-nghi' },
    { k: 'Trực tiếp', h: 'Sổ tự cập nhật', shots: ['live'], steps: ['Bạn khác vừa ghi ⇒ máy em hiện <b>thông báo nhỏ</b> sau vài giây.', '<b>● Trực tiếp</b> màu xanh: sổ đang đồng bộ, không cần tải lại trang.', 'Mục mới trượt vào, mục bị xoá thu gọn lại.'], tip: 'Hai bạn cùng ghi một lúc vẫn không bị mất hay trùng điểm.', emo: 'vui' },
    { k: 'Báo cáo', h: 'Xem báo cáo của lớp', shots: ['m_bc'], steps: ['Chọn <b>Tuần · Tháng · Học kỳ · Cả năm</b>.', 'In / PDF · Excel · Tóm tắt gửi phụ huynh.', 'Số liệu so với kỳ trước, thi đua tổ, lỗi hay mắc.'], tip: 'Em xem được báo cáo để chuẩn bị giờ sinh hoạt lớp; lời nhận xét chỉ cô chủ nhiệm sửa.', emo: 'huong-dan' },
    { k: 'Tra cứu', h: 'Tra cứu & bằng chứng', shots: ['find', 'evview'], steps: ['Kính lúp ▸ gõ tên <b>không cần dấu</b>.', 'Chạm tên ▸ hồ sơ cả năm của bạn đó.'], html: `<p class="lead" style="font-size:16px;margin-top:6px">Bấm <b>📎</b> cạnh một ghi nhận để xem / thêm ảnh bằng chứng.</p>` },
    { k: 'Mẹo', h: 'Lưu ý của cán bộ lớp', html: `<div class="faq" style="margin-top:6px">
      <div class="card"><b>Ghi đúng, ghi đủ, ghi ngay</b><span>Ghi trong ngày, kèm diễn giải rõ ràng; có bằng chứng thì chụp luôn.</span></div>
      <div class="card"><b>Công bằng</b><span>Ghi đúng quy định (Cài đặt ▸ Quy định tính điểm). Có mục chưa rõ, hỏi lớp trưởng hoặc GVCN.</span></div>
      <div class="card"><b>Không dùng tài khoản của bạn khác</b><span>Mỗi người đăng nhập bằng email của mình; mọi lần ghi đều lưu tên người ghi.</span></div>
      <div class="card"><b>Xem lại hướng dẫn</b><span>Nút ? ▸ Hướng dẫn từng bước.</span></div></div>`, shots: ['tour'] }
  ]},
  'HDSD_Phu_huynh': { T: 'Hướng dẫn phụ huynh', slides: [
    { cover: 1, who: 'Cô Thảo gửi các bác phụ huynh 11D3', lead: 'Cô Thảo chào các bác ạ! Các bác theo dõi hạnh kiểm của các con mọi lúc trên điện thoại — không cần đăng nhập, chỉ xem và tải về.', meta: 'Trang phụ huynh: ' + APP + '/phu-huynh.html', qr: 'qr_ph', qrt: 'Quét để mở trang phụ huynh', emo: 'chao' },
    { k: 'Bước 1', h: 'Tìm tên con', shots: ['ph_list'], steps: ['Các bác gõ <b>tên con</b> vào ô tìm kiếm — <b>không cần dấu</b> (ví dụ "an").', 'Hoặc bấm số <b>tổ</b> để lọc.', 'Bên phải mỗi tên là <b>xếp loại tháng này</b> ▸ chạm để xem chi tiết.'], tip: 'Lần đầu mở trang, cô Thảo sẽ chỉ các bác từng bước (xem lại bằng nút ?). Trang tự cập nhật khi giáo viên chủ nhiệm ghi điểm mới ạ.', emo: 'chi-tay' },
    { k: 'Bước 2', h: 'Xem hạnh kiểm của con', shots: ['ph_prof', 'ph_ev'], steps: ['Các bác chọn <b>tháng · học kỳ 1 · học kỳ 2 · cả năm</b>.', '<b>Điểm trung bình tuần</b> và <b>xếp loại</b> (dấu ✓ = GVCN đã xác nhận), điểm từng tuần.', '<b>Tải PDF báo cáo</b> hoặc <b>Tải Excel</b> để lưu.'], html: `<p class="lead" style="font-size:16px;margin-top:6px">Các bác kéo xuống để xem <b>từng lần vi phạm</b>, <b>được cộng điểm</b> (ngày, tuần, nội dung, ghi chú) và <b>nhận xét của cô Thảo</b> về con.</p>` },
    { k: 'Bước 3', h: 'Nhận thông báo qua email', shots: ['ph_reg', 'ph_tb'], steps: ['Trong hồ sơ của con, kéo xuống <b>Nhận thông báo qua email</b> ▸ nhập email ▸ <b>Gửi mã</b>.', 'Mở hộp thư (cả mục Spam), nhập <b>mã 6 số</b> ▸ <b>Xác nhận</b>. Giáo viên chủ nhiệm được báo ngay; duyệt xong các bác nhận thư xác nhận kèm <b>file hướng dẫn (PDF)</b>.', 'Mỗi khi con được cộng / bị trừ điểm, các bác nhận thư — bấm nút trong thư để mở <b>Thông báo mới từ cô Thảo</b> và <b>Tải PDF thông báo</b>.'], tip: 'Không muốn nhận nữa: bấm "Không nhận thư nữa" ở cuối thư.', emo: 'cam-on' },
    { k: 'Bước 4', h: 'Xem cả lớp', shots: ['ph_lop'], steps: ['Chọn kỳ (tháng / học kỳ / cả năm).', '<b>Phân bố xếp loại</b> của lớp.', '<b>Tải Excel cả lớp</b>.', '<b>In / PDF</b> bảng tổng hợp.'] },
    { k: 'Lưu ý', h: 'Cách đọc xếp loại', html: `<div class="grid3" style="grid-template-columns:repeat(2,1fr)">
      <div class="card"><b style="color:#1E8449">Tốt</b><span>Điểm trung bình tuần đạt mốc cao nhất của lớp.</span></div>
      <div class="card"><b style="color:#1F618D">Khá</b><span>Có vài lỗi nhỏ trong kỳ.</span></div>
      <div class="card"><b style="color:#B9761C">Trung bình</b><span>Con còn nhiều lỗi — các bác trò chuyện cùng con giúp cô Thảo nhé.</span></div>
      <div class="card"><b style="color:#C0392B">Yếu</b><span>Con vi phạm nặng / nhiều lần — các bác liên hệ cô Thảo để cùng nhắc con ạ.</span></div></div>
      ${tip('Trang chỉ để xem: các bác không sửa được dữ liệu và không xem ảnh bằng chứng. Cần trao đổi gì, các bác cứ nhắn trực tiếp cô Thảo ạ. Cô Thảo cảm ơn các bác đã đồng hành cùng các con!', 'cam-on')}`, shots: ['ph_tour'] }
  ]}
};
/* bản đầy đủ: bìa + mục lục + 3 phần (mỗi phần có trang phân cách) */
(() => {
  const P = [['HDSD_GVCN', 'Phần 1', 'Giáo viên chủ nhiệm', 'Ghi điểm, thẻ tổng quan, cập nhật trực tiếp, xếp loại, thống kê, báo cáo, quản lý lớp.', 'huong-dan'],
    ['HDSD_Can_bo_lop', 'Phần 2', 'Lớp trưởng & Tổ trưởng', 'Ghi điểm cho các bạn, ảnh bằng chứng, lưu không chờ, xem báo cáo.', 'co-vu'],
    ['HDSD_Phu_huynh', 'Phần 3', 'Phụ huynh', 'Xem hạnh kiểm của con, tải PDF / Excel — không cần đăng nhập.', 'chao']];
  const out = [{ cover: 1, who: 'Bản đầy đủ · GVCN · Cán bộ lớp · Phụ huynh', lead: 'Sổ theo dõi và xếp loại hạnh kiểm trên máy tính, điện thoại — ghi điểm không chờ, cập nhật trực tiếp, báo cáo tự soạn, trang riêng cho phụ huynh.', meta: 'Sổ: ' + APP, qr: 'qr_app', qrt: 'Mở sổ bằng điện thoại' }, null];
  const toc = [];
  P.forEach(([f, k, h, lead, emo]) => { toc.push([k + ' · ' + h, out.length + 1]); out.push({ div: 1, k, h, lead, emo }); DOCS[f].slides.filter(s => !s.cover).forEach(s => out.push(s)); });
  out[1] = { k: 'Mục lục', h: 'Nội dung tài liệu', html: `<div class="toc">${toc.map(([t, n]) => `<div class="card"><b>${t}</b><em>trang ${n}</em></div>`).join('')}</div>`, tip: 'Mỗi vai trò cũng có file hướng dẫn riêng: HDSD_GVCN.pdf · HDSD_Can_bo_lop.pdf · HDSD_Phu_huynh.pdf.', emo: 'huong-dan' };
  DOCS.HDSD_Day_du = { T: 'Hướng dẫn đầy đủ', slides: out };
})();
/* v4.0: Hướng dẫn trải nghiệm cho ban giám khảo (chế độ Kiểm tra tính năng ứng dụng) — ảnh: tools/guide/cap_demo.js */
const DM = `${APP}/?demo=1`;
const rimg = n => `<div class="dk"><img src="${img(n)}"></div>`;
DOCS.HD_Trai_nghiem = { T: 'Hướng dẫn trải nghiệm', slides: [
  { cover: 1, kk: 'Hướng dẫn trải nghiệm · Kiểm tra tính năng ứng dụng', lead: 'Trải nghiệm <b>toàn bộ</b> ứng dụng trong 10 phút: không cần tài khoản, không cần mật khẩu, dữ liệu mẫu — chọn vai giáo viên chủ nhiệm, cán bộ lớp hoặc phụ huynh, ứng dụng chỉ từng bước.', meta: 'Quét mã hoặc mở: ' + DM, qr: 'qr_demo', qrt: 'Quét để vào thẳng<br>chế độ trải nghiệm' },
  { k: 'Bắt đầu', h: 'Vào chế độ trải nghiệm', wide: 'dm_login', steps: ['Quét mã QR ở trang bìa, hoặc mở <b>' + APP + '</b>.', 'Bấm thẻ <b>Kiểm tra tính năng ứng dụng</b> (màu cam).', '<b>Không cần email, không cần mật khẩu</b>: ứng dụng mở ngay với dữ liệu mẫu và hiện bảng chọn vai.'], tip: 'Dữ liệu là mẫu (tên học sinh giả). Mọi thao tác chỉ diễn ra trên máy của thầy cô, không ảnh hưởng sổ thật của lớp.', emo: 'chao' },
  { k: 'Bắt đầu', h: 'Chọn vai trò muốn trải nghiệm', wide: 'dm_roles', steps: ['Ba vai: <b>Giáo viên chủ nhiệm</b>, <b>Cán bộ lớp</b>, <b>Phụ huynh</b>; mỗi vai liệt kê các việc làm được.', 'Bấm một việc để được hướng dẫn việc đó, hoặc <b>Bắt đầu hướng dẫn</b> để đi lần lượt.', 'Việc đã thử xong có dấu <b>✓</b>.'] },
  { k: 'Bắt đầu', h: 'Hướng dẫn từng bước: chỉ cần bấm theo', wide: 'dm_tut_gv', steps: ['Màn hình tối lại, <b>chỉ sáng đúng chỗ cần bấm</b>; bong bóng ghi rõ bước mấy, làm gì.', 'Bấm đúng chỗ đang sáng: ứng dụng <b>tự sang bước sau</b>. Bước chỉ để xem thì bấm <b>Tiếp</b>.', 'Có <b>Quay lại</b>, <b>Thoát</b> bất cứ lúc nào; ứng dụng tự đổi vai, đổi trang khi cần.'] },
  { k: 'Bắt đầu', h: 'Thanh trải nghiệm', wide: 'dm_bar', steps: ['<b>Đổi vai</b>: Giáo viên chủ nhiệm · Lớp trưởng · Tổ trưởng · Phụ huynh.', '<b>Hướng dẫn</b>: mở lại bảng chọn vai, xem đã thử bao nhiêu việc.', '<b>Hộp thư</b>: thư hệ thống gửi phụ huynh và giáo viên (giả định).', '<b>Làm lại</b>: về dữ liệu mẫu ban đầu · <b>Thoát</b>: về màn đăng nhập.'] },
  { k: 'Giáo viên chủ nhiệm', h: '6 việc của giáo viên chủ nhiệm', wide: 'dm_nx', steps: ['Xem điểm cả lớp, rê chuột xem nguồn từng điểm.', 'Nhận xét và <b>xác nhận xếp loại</b> từng học sinh.', 'Báo cáo tháng, tải PDF và Excel; tải báo cáo riêng một học sinh.', '<b>Duyệt</b> phụ huynh đăng ký email; <b>Khoá sổ</b> cuối tháng.'] },
  { k: 'Tải file', h: 'Tải PDF, Excel: file tự tải về', wide: 'dm_dlsheet', steps: ['Bấm <b>Tải PDF</b> hoặc <b>Tải Excel</b>: màn chờ hiện tiến độ trong lúc tạo file.', 'Xong, file <b>tự tải về máy</b> và hiện bảng <b>Mở file / Chia sẻ</b>.', 'Chạy được trên điện thoại và trong trình duyệt mở từ Zalo, Gmail.'] },
  { k: 'Tải file', h: 'PDF báo cáo lớp và từng học sinh', right: rimg('dm_bcpdf'), steps: ['<b>Báo cáo lớp</b>: so với kỳ trước, biểu đồ, xếp hạng tổ, tuyên dương, nhắc nhở, nhận xét của cô Thảo.', '<b>Từng học sinh</b>: điểm từng tuần, lỗi thường mắc, khen thưởng, nhận xét.', 'Khổ ngang, gọn để gửi phụ huynh hoặc lưu hồ sơ.'] },
  { k: 'Cán bộ lớp', h: '4 việc của cán bộ lớp', shots: ['dm_tut_cb', 'dm_ghi3'], steps: ['<b>Ghi điểm</b> cho một bạn hoặc nhiều bạn cùng lúc.', 'Ghi chú, chụp ảnh bằng chứng; mạng yếu ứng dụng tự gửi lại.', 'Xem lại, sửa hoặc xoá một lượt đã ghi; tra cứu một bạn.', 'Tổ trưởng chỉ ghi được cho tổ mình.'] },
  { k: 'Phụ huynh', h: '4 việc của phụ huynh', shots: ['dm_tut_ph', 'dm_dk2'], steps: ['Xem kết quả của con theo tuần, tháng, học kỳ.', 'Tải báo cáo PDF, Excel của con.', '<b>Đăng ký nhận email</b>: nhập email bất kỳ, mã <b>123456</b> (giả định).', 'Nhận email khi con được ghi điểm, mở thông báo, tải PDF.'] },
  { k: 'Phụ huynh', h: 'Email giả định: xem trong Hộp thư', wide: 'dm_inbox', steps: ['Chế độ trải nghiệm <b>không gửi thư thật</b>, không cần email thật.', 'Mọi thư (thông báo điểm, mã xác nhận, thư duyệt kèm hướng dẫn PDF) hiện trong <b>Hộp thư</b>.', 'Bấm nút trong thư ⇒ trang phụ huynh mở đúng thông báo.'] },
  { k: 'Phụ huynh', h: 'Thông báo mới và PDF thông báo', right: rimg('dm_tbpdf'), steps: ['Bấm nút trong email: trang phụ huynh mở thẻ <b>Thông báo mới từ cô Thảo</b>.', 'Bấm <b>Tải PDF thông báo</b>: lời cô Thảo theo tình huống, điểm từng tuần, nhận xét tháng.'] },
  { k: 'Giáo viên chủ nhiệm', h: 'Khoá sổ tháng', wide: 'dm_chot', steps: ['<b>Cập nhật hạnh kiểm</b> ▸ <b>Khoá sổ tháng 10</b>.', 'Thử xoá / sửa một ghi nhận của tháng: hệ thống <b>chặn lại</b>.', 'Cần chỉnh lại: bấm <b>Mở khoá</b>.'], tip: 'Màn đăng nhập có thêm <b>Tính năng sắp ra mắt</b>: lộ trình mở rộng thành sổ liên lạc điện tử (học bạ, nội quy, hoạt động của trường).' },
]};
(async () => {
  const b = await chromium.launch();
  for (const [file, d] of Object.entries(DOCS)) {
    if (process.env.ONLY && process.env.ONLY !== file) continue;
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${d.slides.map((s, i) => slide(d.T, i + 1, s)).join('')}</body></html>`;
    fs.writeFileSync(path.join(__dirname, '_' + file + '.html'), html);
    const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
    await p.setContent(html, { waitUntil: 'load' });
    const bo = await p.evaluate(() => { let n = 0; document.querySelectorAll('section').forEach(sc => { const m = sc.querySelector('.mc'); if (!m) return;
      const r = m.getBoundingClientRect(), bad = [...sc.querySelectorAll('.txt > *, .ph, .dk, .pp')].some(e => { const q = e.getBoundingClientRect(); return q.width && q.left < r.right - 20 && q.right > r.left + 20 && q.bottom > r.top + 12 && q.top < r.bottom; });
      if (bad) { m.remove(); n++; } }); return n; });
    await p.pdf({ path: path.join(ROOT, 'docs', file + '.pdf'), width: '1280px', height: '720px', printBackground: true });
    for (const n of [1, 2, 4]) { await p.screenshot({ path: `/tmp/claude-0/pdf_${file}_${n}.png`, clip: { x: 0, y: (n - 1) * 720, width: 1280, height: 720 } }).catch(() => {}); }
    console.log('📄', file, d.slides.length, 'trang · bỏ hình ở', bo, 'trang'); await p.close();
  }
  await b.close();
})();
