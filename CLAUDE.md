# Sổ theo dõi học tập và nề nếp (11D3) — quy tắc làm việc cho Claude

**Địa chỉ (từ 14/10/2026, kho `THPTYenHoa/So-theo-doi-hoc-tap-va-ne-nep`)**: app https://thptyenhoa.github.io/So-theo-doi-hoc-tap-va-ne-nep/ ·
phụ huynh `…/phu-huynh.html` · web demo `…/demo.html` (QR trong video). Kho cũ `Theo-doi-hanh-kiem-11D3-nam-hoc-2026-2027` chỉ còn trang
tự chuyển hướng (giữ `?…` / `#…`) — **mọi thay đổi làm ở kho này**. Backend `APP_URL` (`KhoaThang.gs`) trỏ địa chỉ mới.

App 1 file `index.html` (GitHub Pages từ `main`) + trang phụ huynh `phu-huynh.html`, dữ liệu ở Google Sheet qua Apps Script.
Người dùng là giáo viên chủ nhiệm (không rành kỹ thuật) — **trả lời và viết nội dung bằng tiếng Việt**. Quy trình giống
MMH Report Hub / CRM (skill `gh-webapp-upgrader`). App dùng để dự thi "Nhà giáo sáng tạo với công nghệ số và AI 2026" (nộp trước 25/10/2026).

## Quyền
- Khi người dùng bảo sửa / gộp: commit → PR → **squash merge `main`**, không cần hỏi lại.

## Mỗi thay đổi người dùng nhìn thấy (cùng PR)
1. Tăng `HK_VER` (khối `<script id="v3-js">`) và tham số `updates/notes.js?v=` ở **cả** `index.html` và `phu-huynh.html`.
2. Thêm mục lên ĐẦU `window.HK_UPDATES` (`updates/notes.js`): `id` `YYYY-MM-DD-vX.Y`, `version`, `date`, `title`, `summary`,
   `items:[{type:"new"|"imp"|"fix", title, text, img}]` — kiểu *bấm vào đâu → làm gì → kết quả*. App tự hiện 7 ngày.
3. Ảnh thật, **dữ liệu giả** (không tên / điểm học sinh thật — repo công khai) ở `updates/vX.Y/*.jpg`: `tools/test/cap.js`.
4. Kiểm thử: `python3 -m http.server 8768` ở thư mục repo → `NODE_PATH=$(npm root -g) node tools/test/run.js`
   (backend giả lập `tools/test/mock.js`; `script.google.com` bị chặn trong môi trường Claude). `node --check` mọi khối `<script>`.

## Backend
- Code `.gs` ở kho riêng tư **`THPTYenHoa/yenhoa-backend`** (`backends/hanh-kiem-11d3/`): sửa → PR → gộp ⇒ GitHub Actions tự deploy,
  URL `/exec` không đổi. **Không** gửi file `.gs` cho người dùng dán. Gộp backend trước, đợi Deploy xanh, rồi mới gộp app.
- Lệnh: `bootstrap` (kèm `theme`), `entries`, `addEntries` (`rid` chống trùng), `updateEntry`, `deleteEntry` (không còn ⇒ ok),
  `saveConfig/Notify/QuyDinh/Catalog/Students/Accounts/Remark`, `saveTheme` (GVCN), `otpStart` / `otpVerify` (đăng nhập),
  `loginKhach` (phụ huynh, chỉ `bootstrap` + `entries`). `login` / `changePin` / `resetPin` đã tắt (v3).
- Vai trò lấy từ sheet `TaiKhoan` (email · tên · vai trò · tổ · (mật khẩu cũ) · hoạt động): GVCN / Quản trị toàn quyền,
  Lớp trưởng ghi cả lớp + cấu hình, Tổ trưởng chỉ ghi tổ mình.

## Ghi chú kỹ thuật (v3.0)
- Vá lớp bằng khối `<style id="v3-css">` + `<script id="v3-js">` cuối `index.html` (`window.fn = …`). Khởi động chạy ở
  `DOMContentLoaded` để các bản vá kịp thay hàm.
- **Đăng nhập** (`lgEmail` / `lgCode`): email → mã 6 số. Mock: email `gvcn@ / loptruong@ / totruong2@example.com`, mã đúng `123456`.
- **Ghi không chờ `HQ`** (`localStorage.hk_outbox_v1`): `ghiThucTe` / `delEntry` cập nhật màn hình ngay (số tạm `tmp-…`), chạy nền
  bằng `rawApi`, lỗi mạng thử lại 2–60 s cùng `rid`, lỗi thật ⇒ trả lại + chip đỏ `#hkq`. `hqOverlay()` áp lại thao tác khi dữ liệu
  từ máy chủ về. Mock: `drop:{addEntries:1}`, `failWrite`, `lag`.
- **Dữ liệu cả năm** lưu `localStorage.hk_cache_v4`; tự tải nền cả năm (`preloadYear`); đồng bộ 60 s chỉ tháng đang xem, cả năm 10 phút/lần.
- **Tra cứu** `findOpen` (nút kính lúp, phím `/`, Ctrl+K) → **hồ sơ** `openProfile(ma)` (tháng / HK / cả năm, In, Tải Excel).
  Chạm học sinh ở tab Hạnh kiểm / Thống kê cũng mở hồ sơ.
- **Chủ đề** `THEME` (18 chủ đề, `THEMES[].c` = 8 màu thay biến `--teal…--bg`): ảnh nền `themes/<id>/d.webp` (máy tính) và `m.webp`
  (điện thoại), thiếu ảnh ⇒ hoạ tiết CSS. Người dùng chọn (`localStorage.hk_theme`), GVCN đặt mặc định lớp (`saveTheme`).
  Prompt tạo ảnh: `docs/prompt-hinh-nen.md`. Màu xếp loại (Tốt/Khá/TB/Yếu) giữ cố định.
- **Phụ huynh** `phu-huynh.html`: `loginKhach` → xem cả lớp, hồ sơ từng em, tải PDF (in) / Excel (CSV), dùng chủ đề của lớp.

## v3.1
- **Bằng chứng**: khối `v31-js` — bước diễn giải (`hoiGhiChu`) có Chụp ảnh / Chọn ảnh, tài liệu; ảnh thu nhỏ ≤1600px JPEG; hàng đợi op `ev` / `evdel`
  chạy sau lệnh ghi; cột 13 bản ghi = `fileId|tên|loại;…` (phụ huynh nhận `'1'`); 📎 `evOpen(id)`. Backend `addEvidence` / `getEvidence` / `delEvidence`
  (file ở thư mục Drive riêng tư, cần quyền Drive: chạy `capQuyenBangChung` một lần trong trình soạn). Admin cố định: `ADMIN_EMAILS` (backend).
- **Hướng dẫn từng bước** `tour.js` (`TOUR.run`): GVCN 11 bước, cán bộ lớp 9 bước (`TOURS` trong `v31-js`), phụ huynh 9 bước (`phu-huynh.html`);
  tự chạy lần đầu (`hk_tour_gvcn` / `hk_tour_cb` / `hkph_tour`), mở lại ở nút ?. Mock mặc định đánh dấu đã xem; `{tour:true}` để thử.
- **Nhân vật cô Thảo** `mascot.js` (`MASCOT.say/img`): kính cận gọng đen, mặt tròn phúc hậu; 10 vai `STYLES` (`chu-nhiem` mặc định, `giang-day` cho hướng dẫn,
  `ao-dai` tự bật 14–22/11, …) ghép theo chủ đề `BY_THEME`. **Xưng hô**: với phụ huynh cô xưng "cô", gọi "các bác", học sinh là "các con / con X";
  với cán bộ lớp gọi "em"; GVCN: "Chào cô Thảo!". Ảnh `mascot/<vai>/<biểu-cảm>.webp` (có thể là WebP động), thiếu ⇒ chibi SVG;
  hiệu ứng hành động CSS `.m-<biểu-cảm>`; phản ứng khi ghi điểm (`mReact`: vui / khen-lon / buon / nghiem lần 2 / gian lần 3+ hoặc ≥6 lỗi/tháng).
  Prompt: `docs/prompt-chibi.md` — viết cho người không rành: 3 bước, khung copy-dán sẵn; người dùng gửi `goc.png` + `1.png`…`16.png`
  theo thứ tự chao, huong-dan, chi-tay, vui, khen-lon, co-vu, buon, lo-lang, nghiem, gian, suy-nghi, ngac-nhien, nghi-ngoi, an-mung, chup-anh, cam-on
  (bộ không ghi tên = `chu-nhiem`). Ảnh theo ảnh thật của cô — **không** đưa ảnh thật vào repo). Video Veo nền xanh ⇒
  `ffmpeg -i x.mp4 -vf "chromakey=0x00FF00:0.18:0.08,scale=360:-1" -loop 0 -c:v libwebp_anim -q:v 70 x.webp`.
- **PDF hướng dẫn**: `tools/guide/cap.js` (ảnh, dữ liệu giả) → `tools/guide/build.js` → `docs/HDSD_GVCN.pdf`, `HDSD_Can_bo_lop.pdf`, `HDSD_Phu_huynh.pdf`.
  + **`docs/HDSD_Day_du.pdf`** (bìa, mục lục, 3 phần có trang phân cách — ghép tự động từ 3 bộ trang trong `build.js`). Mock GVCN tên "Nguyễn Thu Thảo"
  (ảnh hiện "Chào cô Thảo!"); vai Quản trị không gọi "cô".

## v3.2 — trực tiếp & nhanh
- **Đồng bộ trực tiếp `LIVE`** (khối `v32-js`): backend `sync` {rev, thangs} (file `DongBo.gs`): mọi lần ghi gọi `cacheClear` ⇒ đổi `rev`;
  `rev` không đổi ⇒ trả `same` ngay (không đọc Sheet). App hỏi 4 giây/lần khi đang mở (15 giây nếu không thao tác 2 phút, dừng khi ẩn tab,
  chờ khi hàng đợi ghi đang chạy); có thay đổi ⇒ thay dữ liệu tháng đang xem, `hqOverlay`, mục mới của người khác hiện hiệu ứng + `#v32pop`.
  Backend cũ ("Không nhận ra yêu cầu") ⇒ `LIVE.off`, quay về làm mới 60 s. Trang phụ huynh: `sync` 15 giây/lần.
- Backend: `ss()` / `sheet()` mở 1 lần mỗi lượt gọi; đệm `hk_e_<k?><rev>_<tháng>` (khoá gắn rev, phụ huynh đệm riêng — không lộ mã file bằng chứng);
  `cacheClear()` (ghi điểm) chỉ đổi rev, `cacheClear(true)` (cấu hình, danh mục, HS, tài khoản) xoá thêm `hk_static` / `hk_acc` / `hk_boot2`.
- **Hiệu ứng**: `FRESH` (id → lúc thêm) ⇒ lớp `.fresh` + `animation-delay` âm (vẽ lại không giật); xoá ⇒ `.out` 220 ms rồi mới xoá;
  điểm tuần đổi ⇒ `.row.bump`. Phần tử ghi nhận có `data-eid`.
- **Thẻ tổng quan** `#v32h` (`v32Hero`): ô bấm để lọc (`S.v32f` bọc `visibleStudents`), dải "Vừa cập nhật", nhãn `#v32live`. Avatar `.av32.t<tổ>`.
- Mock: `p.M.ext(ma, nộiDung, điểm)` / `p.M.extDel(id)` giả lập người khác ghi / xoá; `{oldBackend:true}` = backend chưa có `sync`.

## v3.3 — Báo cáo
- Menu **Báo cáo** (`#vBC`, khối `v33-js`, `NAV` thêm `bc`, ẩn với phụ huynh): kỳ `S.bcKy` tuần / tháng / hk / nam theo tháng-tuần đang chọn
  (`bcPeriod`, kỳ trước `prev`), số liệu `bcStats` (xếp loại dùng `xlOf` ⇒ tôn trọng xếp loại GVCN đã chốt), so kỳ trước `dl()`.
- Lời văn `bcAuto` (nhận xét chung + phương hướng theo nhóm lỗi `GOI_Y`), GVCN sửa được, lưu `localStorage.hk_bc_<kỳ>`; đang gõ thì không vẽ lại.
- Xuất: `bcPrint` (mẫu văn bản: quốc hiệu, mục I–VII, chữ ký, phụ lục) · `bcExcel` (CSV) · `bcCopy` (tóm tắt Zalo — KHÔNG nêu tên học sinh vi phạm).

## v3.4 — Quản lý lớp & phân quyền
- **Chỉ GVCN / Quản trị** (`isGVCN()`, backend kiểm lại): `saveAccounts` (cấp quyền email khác, khoá / xoá), `saveStudents` (thêm, đổi tổ, xoá HS).
  Lớp trưởng: ghi cả lớp + danh mục + cấu hình; Tổ trưởng: ghi tổ mình. Bảng `QUYEN` (`v34-js`) hiện trong Cài đặt (`#qTbl`; cán bộ lớp thấy "Quyền của bạn").
- Backend `apiSaveAccounts` gọi `cacheClear(true)` (trước đó thiếu ⇒ đệm `hk_acc` 30 phút). Không tự xoá tài khoản của mình; xoá HS có lựa chọn
  "Đánh dấu nghỉ học / chuyển lớp" (giữ lịch sử). Mock `saveStudents` / `saveAccounts` chặn khi không phải GVCN.
- HDSD: bìa và trang phân cách **không** có chibi; **không nhắc vai Quản trị / admin, tên hay email người quản trị** (người dùng yêu cầu). Trên app, dòng "Quản trị" (bảng quyền, chọn vai trò) chỉ hiện với chính tài khoản Quản trị.

## v3.5 — Màn chờ + chibi 3D
- `MASCOT.loader(host,{msgs,every})` (mascot.js): thanh tiến trình + cô Thảo chạy (`img('chay')`, CSS `.mld-*`; ảnh `mascot/<vai>/chay.webp` động nếu có).
  App: khối `v35-js` vẽ vào `#loader` lúc mở sổ và lúc `lgVerify`; lời nhắn theo vai (`LD_MSG`, vai lấy từ `hk_cache_v4.me` / `hk_last_role`):
  cán bộ lớp "Mạng lag xíu, các con chờ chút nha…", GVCN "Cô Thảo chờ chút xíu nhé…". Trang phụ huynh: `#ld` "Các bác chờ chút ạ…".
- Prompt chibi **3D**: `docs/prompt-chibi-3d.md` — mỗi khung lặp đủ REFERENCE + CHARACTER + OUTFIT + STYLE (người dùng yêu cầu lặp lại);
  file `goc.png`, `1.png`…`17.png` (17 = `chay`), video `chay.mp4` (màn chờ), `chao/vui/khen-lon/buon/gian/cam-on.mp4`, nền xanh ⇒ ffmpeg chromakey.

## v3.6 — Bộ ảnh 3D cô Thảo
- `mascot/chu-nhiem/*.webp` (360×360, nền trong suốt, ~8–12 KB): 16 biểu cảm + `goc` + `chay` (đã lật để chạy sang phải). Tách nền từ ảnh Gemini nền trắng:
  flood-fill vùng trắng/xám trung tính nối với mép ảnh (PIL, nhớ `.copy()` ảnh từ numpy), bóng chân giữ mờ, cắt theo nhân vật + 6% lề.
- mascot.js: `READY` = các vai đã có bộ 3D (hiện chỉ `chu-nhiem`); vai khác dùng bộ 3D này (không trộn 2D/3D); ảnh lỗi ⇒ SVG dự phòng; tải sẵn sau 300 ms.
  `MASCOT.STYLES` chỉ trả vai `READY` (bảng chọn nhân vật). Muốn thêm vai (áo dài…): thêm thư mục + khoá vào `READY`.
- HDSD: `build.js` lấy ảnh 3D (`chibi()`) cho phần mẹo **và góc dưới trái mọi trang nội dung** (`.mc`, biểu cảm theo chủ đề trang `POSE`, `pose:` để chọn riêng, `noMc` để tắt; tự bỏ nếu chạm chữ). Bìa và trang phân cách không có. Ảnh động (video Veo) người dùng gửi sau ⇒ thay `<emo>.webp` bằng WebP động cùng tên.

## v3.7 — Khoá sổ tháng (trước đây gọi "Chốt tháng"; từ v4.3 không dùng chữ "chốt" trên giao diện — dùng "khoá sổ" / "xác nhận xếp loại"), báo cáo ngang, email phụ huynh
- **Chốt tháng** (khối `v37-js`): backend `lockMonth` (GVCN), trạng thái `khoa` {tháng:{by,at}} trong bootstrap / `sync`; `kiemKhoa_` (backend `KhoaThang.gs`) chặn
  `addEntries` / `saveRemark` / `updateEntry` / `deleteEntry` / `addEvidence` / `delEvidence` của tháng đã chốt. App: `g37()` chặn trước, dải `.lkb`, `body.hk-lk`. GVCN mở khoá được.
- **PDF khổ ngang** `baocao.js` (`window.RPT`): `student(D,ma,ky,{aud:'ph'|'gv'})`, `notice(D,ma,ids)`, `open(html,title,{dry})` (iframe ẩn ▸ in; iOS mở cửa sổ mới);
  biểu đồ SVG `line` / `bars2` / `donut` / `hb`, cô Thảo `mc(emo)` — ít ảnh, biểu cảm theo kết quả. `bcPrint` (báo cáo lớp) **không có quốc hiệu**.
  Test: `RPT.open` với `{dry:true}` ⇒ `RPT.last`; `run.js` mục 16 dựng PDF ra `tools/test/out/` và kiểm không trang nào tràn.
- **Email phụ huynh**: gửi tới cột Email (F) của học sinh sau mỗi `addEntries` (`guiPhuHuynh_`, ảnh `mascot/chu-nhiem/png/*.png`, link `phu-huynh.html#hs=MA&tb=ids` ⇒
  thẻ "Thông báo mới" + PDF thông báo). Phụ huynh **tự đăng ký** (`phDangKy` mã 6 số ▸ `phXacNhan` ▸ GVCN `phDuyet` trong Cài đặt), hủy nhận bằng link ký HMAC.
  Cài đặt `savePhMail` {on, cong}. Mock: `{khoa:{10:{…}}, phReg:[…]}`, mã đúng `123456`.

## v3.8 — Báo cô khi phụ huynh đăng ký
- Backend `phXacNhan` ⇒ email báo các tài khoản vai trò **GVCN** (không báo quản trị), link `APP_URL#duyet`; `sync` trả `phReg` cho GVCN.
- App (`v38-js`): `phCheck` ⇒ thẻ `#phNew` (Duyệt ngay / Để sau) + chấm đỏ `.navbdg` ở Cài đặt; đã thấy lưu `hk_phreg_seen`; `#duyet` ⇒ `phOpen()`.
- Duyệt: `phDuyet` gửi `pdfVer` (`PH_PDF_VER`, **tăng khi dựng lại `docs/HDSD_Phu_huynh.pdf`**); máy chủ chưa có bản đúng ⇒ lỗi "Cần gửi kèm file hướng dẫn"
  ⇒ app gửi `pdf` (base64), máy chủ lưu vào thư mục Drive bằng chứng (`hk_ph_pdf`) và đính kèm thư duyệt. Không dùng UrlFetchApp (tránh xin quyền mới).
  Mock: `M.phNew(ma,email)` giả lập phụ huynh đăng ký.
- **Bộ trang phục khác của cô Thảo**: prompt `docs/prompt-chibi-3d.md` ▸ Bước 5 (9 bộ × ảnh gốc + 8 biểu cảm: `1..8.png` = chao, vui, khen-lon, co-vu, buon, nghiem,
  chi-tay, cam-on). Nhận ảnh ⇒ tách nền như v3.6 vào `mascot/<vai>/` + khai báo `READY['<vai>']=[…]` (mascot.js; thiếu biểu cảm ⇒ dùng `chu-nhiem`).

## v3.9 — Giao diện gọn, Phụ huynh, tìm kiếm, cô Thảo nhiều trang phục
- **Cô Thảo nhiều bộ** (`mascot.js` ▸ `READY`): `chu-nhiem` (đủ) + `doi-thuong` (áo len tím), `ao-dai` (trắng), `mau-nuoc` (áo dài chàm), `giang-day` (cardigan),
  `stem`, `mua-dong` — mỗi bộ ~8 biểu cảm (chao, vui, khen-lon, co-vu, buon, nghiem, chi-tay, cam-on, goc). Chế độ auto: `rnd(emo)` chọn ngẫu nhiên **chỉ trong ảnh đã tải**
  (tải ngầm lúc rảnh, giữ 60 s / biểu cảm; `say()` luôn chọn mới); 14–22/11 ưu tiên áo dài. PDF (`baocao.js mc`) và HDSD (`build.js chibi`) cũng ngẫu nhiên.
  **Thêm đợt ảnh**: `python3 tools/mascot/cut.py <vai> <emo>=<ảnh.png> …` (tách nền trắng + bóng mềm ⇒ webp 360 + png email) rồi khai báo `READY`.
- **Khối `v39-js`**: trang **Phụ huynh** `#vPH` (nav `ph`, chỉ GVCN; điện thoại ẩn khỏi thanh dưới — vào từ menu avatar / Cài đặt ▸ Phụ huynh); **Cài đặt chia tab**
  (`CAI_TABS` gom theo tiêu đề mục, nhớ `hk_cai_tab`); **menu avatar** `#ava39` (Đăng xuất ở đây); **tìm kiếm thông minh** `.sq39` (`parseQ`: tổ N, xếp loại,
  vi phạm/khen/không lỗi, chữ còn lại khớp tên hoặc nội dung lỗi) ở Cập nhật hạnh kiểm + Báo cáo; **chú thích rê chuột** `#tip39` (`tipCtx` theo ô).
- **Khối `v39b-js`**: dải **Điểm tuần** `#tk39` trong thẻ tổng quan — lật 6 s/lượt, dừng khi rê chuột, bấm ⇒ menu `#tkm39` theo quyền (`canScore`, `isGVCN`).
- **Phụ huynh**: với phụ huynh của 1 học sinh cô gọi **"bác"** (không "các bác") — trang hồ sơ con, PDF, email. Trang chung / hướng dẫn vẫn "các bác".
  Mọi báo cáo PDF có mục **Nhận xét của cô Thảo** (lớp: trang 1 + trang nhận xét; học sinh: trang 1; thông báo: nhận xét tháng).

## v4.0 — Chế độ "Kiểm tra tính năng ứng dụng" (cho ban giám khảo)
- `demo.js` (nạp đầu `<head>` cả 2 trang): bật khi `localStorage.hk_demo=1` / `?demo=1`; **chặn `fetch` tới script.google.com** và trả lời bằng máy chủ
  mô phỏng `DEMO.api` (dữ liệu mẫu `hk_demo_db_v1`, tên giả; token `tok.gvcn|lt|tt|ph`). Email gửi phụ huynh / GVCN ⇒ `DB.mails` (Hộp thư mô phỏng).
  **Thêm lệnh backend mới ⇒ thêm `case` trong `DEMO.api`** để chế độ trải nghiệm vẫn chạy.
- `demo-ui.js` (cuối `<body>`): nút `#dm-enter` ở màn đăng nhập; thanh `#dm-bar` (đổi vai, Hướng dẫn 9 việc `STEPS` tự đánh dấu qua `DEMO.mark`,
  Hộp thư, Làm lại, Thoát — khôi phục token thật `hk_demo_bak`). Đổi vai = xoá cache + tải lại; việc kế tiếp truyền qua `sessionStorage.dm_next`.

## v4.5 — Tải file thật · hướng dẫn theo vai · Tính năng sắp ra mắt
- **`taive.js` (`window.DL`, nạp sau `baocao.js` ở cả 2 trang)**: KHÔNG dùng lệnh In của trình duyệt nữa (điện thoại / trình duyệt trong Zalo, Gmail
  bấm "không thấy gì"). PDF = dựng trang trong iframe ẩn ▸ `html2canvas` từng `.pg` (khổ ngang, `baocao.js`) hoặc cắt A4 dọc (trang in đơn giản
  `#printArea` / `#pr` — `window.print` bị thay) ▸ `jsPDF` ▸ tự tải + bảng `#dl-sh` (Mở file / Chia sẻ / Tải lại); màn chờ `#dl-ov` có tiến độ.
  `RPT.open(h,t)` ⇒ PDF (giữ `{dry:true}` cho test). Excel: mọi `<a download>` trỏ blob `.csv` ⇒ đổi sang `.xlsx` (SheetJS, ngày giữ định dạng),
  tên file bỏ dấu. Thư viện ở `vendor/` (tải khi cần lần đầu). Nút mới: dùng `DL.pdf(doc,tên)` / `DL.pdfHtml(body,tên)` / tạo CSV như cũ.
- **`demo-guide.js` (`window.DMG`, sau `demo-ui.js`)**: Hướng dẫn trải nghiệm = chọn vai (Giáo viên chủ nhiệm · Cán bộ lớp · Phụ huynh) ▸ các việc
  của vai ▸ hướng dẫn TỪNG BƯỚC: 4 tấm che tối + vòng sáng `#dmg-ring` quanh đúng chỗ cần bấm, bong bóng `#dmg-tip`; bấm đúng chỗ (bắt cả
  pointerdown) ⇒ tự sang bước. Bước `{el, t, d, act:'click'|'next', until, pre, nav, opt, hold, wait}` trong `T`. Đổi vai/trang ⇒ `sessionStorage.dm_next='tut:<id>:<bước>'`.
  Đầu mỗi bài `clean()` đóng bảng/hộp còn mở; bài ghi điểm tự `unlock()` tháng mẫu. Email = giả định (Hộp thư). `DMUI` (demo-ui) = switchRole / bar / inbox.
  Không viết kiểu "đóng vai…/như một…" — tên việc ngắn, tự nhiên. Kiểm thử cả 14 bài (máy tính + điện thoại) bằng kịch bản tự bấm theo vòng sáng.
- **`roadmap.js` (`window.ROADMAP`)**: hộp "Tính năng sắp ra mắt" (Hạnh kiểm & nề nếp = ĐANG DÙNG; Ban giám hiệu, học bạ, nội quy, hoạt động,
  thông báo = ĐANG PHÁT TRIỂN) — lối vào: màn đăng nhập (`.lgdocs`), menu avatar, trang phụ huynh (cạnh "Tải hướng dẫn").
- Vai trong demo: `ROLE_T` = Giáo viên chủ nhiệm · Lớp trưởng · Tổ trưởng (tổ 2) · Phụ huynh.

## v4.6 — Số liệu bấm được · mở app vào Ghi điểm · ngày xảy ra
- **Khối `v46-css` + `v46-js`** (trước `demo-ui.js`). `DRILL.open(o)` = màn chi tiết `#dr46` (nền mờ, ngăn xếp quay lại `‹`, Esc / bấm nền / × đóng):
  `o.mode` = (mặc định) danh sách ghi nhận `E` ⇒ tổng · biểu đồ lượt trừ/cộng theo tuần · tab Theo học sinh / nội dung / tổ / Từng lượt (bấm ⇒ xem sâu);
  `'S'` danh sách học sinh `L` + điểm `sc` (bấm ⇒ `openProfile`); `'avg'` điểm TB lớp từng tuần + theo tổ.
- Bắt **click capture ở document** cho `#vTK`, `#vLS`, `#vBC`, `#v32h` theo cấu trúc (`.kpi` theo nhãn, `.distbar>div` / `.legend>span` lớp `b<i>`,
  `.toprow[data-dk]` — `topList` gắn `data-dk` = mã HS hoặc nội dung lỗi, tiêu đề mục trước `.register` quyết định loại, `table.bct tr` "Tổ N",
  `.panelbox` có svg) ⇒ không sửa hàm vẽ. Ngữ cảnh số liệu `ctx(view)`: TK `tkEntries`, LS `lsData`, BC `inP`+`bcXL`, thẻ tổng quan = tuần đang xem.
  Ô thẻ tổng quan mở chi tiết, nút "Lọc danh sách Ghi điểm" gọi lại bộ lọc cũ (`pass`). Thêm số liệu mới ⇒ thêm nhánh trong listener.
- **Mở app** (`showApp`, lần đầu, không phải phụ huynh) ⇒ `go('ghi')` + `wkOfDate(hôm nay)` (tuần tính từ thứ Hai, ≤ `soTuan`). Chế độ trải nghiệm:
  chỉ đổi khi tháng hôm nay = tháng dữ liệu mẫu.
- **Ngày xảy ra** (`#gc46` trong `hoiGhiChu`, `S.ngay46`): `ghiThucTe` đổi tạm `S.thang/S.tuan` quanh lời gọi đồng bộ (các lớp bên trong đọc đồng bộ trước `await`),
  ghi chú thêm "ngày dd/mm"; tháng khoá sổ / tương lai / ngoài năm học ⇒ chặn. Đang xem tuần khác tuần hôm nay ⇒ ô ngày để trống (ghi vào tuần đang xem).
  Số lần tái phạm vẫn tính theo tuần đang xem. `run.js` mục 20.

## v4.7 — Thống kê lỗi vi phạm & hoạt động được tuyên dương
- **Khối `v47-css` + `v47-js`** (trước `demo-ui.js`): `vpStats(E)` (lỗi / hoạt động khen gom theo nội dung · nhóm `nhomOf` · tổ), `vpBlock(E,P,view)` =
  khối "Vi phạm & tuyên dương": 2 lời cô Thảo (`MASCOT.img`), vòng tròn theo nhóm + bảng lỗi có cột nhỏ xu hướng, top hoạt động được tuyên dương,
  bản đồ lỗi × tổ (ô đỏ đậm dần), khen / vi phạm từng tổ (biểu đồ hai phía), đường diễn biến 3 lỗi + 2 hoạt động khen. Mốc thời gian: tuần ⇒ thứ (theo giờ ghi),
  1 tháng ⇒ tuần, nhiều tháng ⇒ tháng. Bấm `[data-v47k]` ⇒ `DRILL.open` (listener capture ở **window** để đi trước listener v4.6; mọi click trong `.v47` dừng ở đó).
- Báo cáo: thay "Vi phạm theo nhóm" + "Lỗi thường gặp" bằng khối mới (sau `.bcgrid`). Thống kê: thay "Lỗi mắc nhiều nhất", thêm kỳ **Học kỳ** (`S.tkKy='hk'`,
  bọc `tkEntries` / `tkScore` / `tkNhan`).
- PDF báo cáo lớp: `bcPrint` bọc `RPT.open` 1 lần ⇒ chèn 2 trang (`vpPdfPages`) sau trang 3: "Thống kê lỗi vi phạm", "Hoạt động được tuyên dương". `run.js` mục 21.

## v4.8 — Nút Quay lại · trang phụ huynh · xưng hô với phụ huynh
- **`back.js` (`window.BACK`, cả 2 trang)**: Back của trình duyệt / điện thoại ở lại trong app. `BACK.add({id, open, close, back?})` = hộp được theo dõi
  (MutationObserver: mở ⇒ `pushState`, đóng bằng nút ⇒ tự `history.back()`; Back ⇒ `close()`, hoặc `back()` lùi 1 tầng — `DRILL.depth/pop`).
  `BACK.view(key, apply)` (bọc `go` ở index) ⇒ Back về mục trước. Chốt đầu lịch sử ⇒ toast "Bấm Quay lại thêm lần nữa để thoát" (2,5 s).
  Trang phụ huynh dùng `#hash` ⇒ gọi `BACK.hashNav(hash)` trước khi đổi hash (không bị hiểu là bấm Back). Hộp mới ⇒ thêm vào danh sách `BACK.add` (khối `v48-js` / cuối `phu-huynh.html`).
- **Trang phụ huynh**: tab phụ `#tabs2` (Danh sách học sinh · Hồ sơ: tên — nhớ `S.lastMa`; bỏ nút "‹ Danh sách" nhỏ), nút **Thoát** `#lo` ⇒ `#lo-ov`
  (xoá `hkph_token/cache/reg_*`, về `./`), ô email `#rgE` focus ⇒ `.emtip` có ảnh cô Thảo. Ô email đăng nhập `#lgEm` cũng có `.emtip`.
- **mascot.js `say()`**: hẹn giờ ẩn tính từ lúc bong bóng thật sự hiện (trang ở nền ⇒ chờ `visibilitychange`); chạm ra ngoài / cuộn ⇒ ẩn; có dấu ×.
- **Xưng hô với phụ huynh** (người dùng yêu cầu 10/10/2026): không xưng "cô" trống không. Câu nói về con ⇒ **"cô Thảo"**; xưng với các bác ⇒ **"em"**;
  thông báo / hướng dẫn ⇒ **"giáo viên chủ nhiệm"**. Áp dụng `phu-huynh.html`, `baocao.js` (PDF phụ huynh, thông báo), `demo.js` (thư mô phỏng),
  backend `KhoaThang.gs` (`loiNhan_`, thư duyệt, huỷ nhận thư), HDSD phụ huynh (`build.js`). `run.js` mục 22 kiểm tra. `PH_PDF_VER='4.8'`.

## v4.9 — Logo trường · xếp loại chỉ theo tháng / học kỳ · bỏ học phí
- Logo `img/logo-yenhoa.webp` (tròn, nền trong) ở màn đăng nhập (`lgShell` ▸ `.lghead` / `.lglogo`); favicon `img/favicon.png`, `img/logo-180.png` (cả 2 trang).
- **Không xếp loại hạnh kiểm theo tuần** (người dùng yêu cầu 13/10/2026): Cập nhật hạnh kiểm chỉ Tháng · Học kỳ; Thống kê Tháng · Học kỳ · Cả năm;
  Báo cáo kỳ Tuần chỉ hiện với GVCN (`isGVCN()`, nút cuối hàng). Ghi điểm: số = điểm tuần (màu theo dấu), nhãn = xếp loại tháng tạm tính `T<tháng> · <loại>`;
  thẻ tổng quan "Cần nhắc nhở" / "Đạt loại Tốt" tính theo `monthAvg`. Điểm từng tuần vẫn hiện nhưng không tô màu xếp loại. Không thêm lại xếp loại tuần ở màn mới.
- **Không có thông tin học phí** trong app / tài liệu (roadmap, bài dự thi .pptx đã bỏ).
- `run.js` mục 8 "thấy ≥ 6 học sinh trên điện thoại" đỏ sẵn từ trước (5 em) — chưa sửa.

## v5.0 — Kết quả học tập · Sổ công tác chủ nhiệm · giáo viên bộ môn · ngôn ngữ hành chính
- **Backend** (`HocTap.gs` ở yenhoa-backend): sheet tự tạo `MonHoc`, `GiaoVienBM`, `CachTinhDiem`, `DiemSo` (mỗi dòng 1 đầu điểm: mã HS · môn · HK · đầu điểm · giá trị),
  `HoSoHS`, `SoChuNhiem` (khoá · giá trị). Lệnh: `htBoot`, `htSaveMon/GV/Rule/Diem/HoSo`, `scnSave`, `scnImg/ImgDel/ImgGet`, `htMailBGH/GV/PH`.
  GVBM có email trong `GiaoVienBM` ⇒ tài khoản vai trò **"Giáo viên bộ môn"** (`themGVBM_` trong `accountsMap`, `me.mon`), chỉ đọc / ghi điểm môn mình dạy.
- **`hoctap.js` (`window.HT`, menu `ht` "Kết quả học tập")**: bảng điểm (ô sửa tại chỗ, thêm / đổi tên / xoá cột; đầu điểm `TX1…`, `GK`, `CK`, `HK` (ghi đè KQ học kì),
  `NXGV` (nhận xét GVBM), tên khác = đầu điểm mới, không tính ĐTB), nhập Excel nhiều trang tính (tên trang = tên / mã môn, "HK2" ⇒ học kì II; thay hàng loạt = `replace`),
  tổng kết `HT.ketQua(ma, 'gk1'|'hk1'|'gk2'|'hk2'|'cn')` theo tham số `CachTinhDiem` (mặc định TT22), `HT.renLuyen` (từ xếp loại tháng), `HT.danhHieu`,
  phiếu báo cha mẹ HS `HT.phieuHTML` ⇒ `htMailPH`. Hàng đợi ghi `HTQ` (`hk_htq_v1`), đệm `hk_ht_v1`. GVBM: `navItems` chỉ còn `ht`, không tự chạy tour.
  Tên mức cũ "Trung bình / Yếu" hiển thị thành "Đạt / Chưa đạt" (`chuanTen`).
- **`socn.js` (`window.SCN`, menu `scn`, chỉ GVCN)**: 8 thẻ theo đúng sổ; `SCN.data()` = dữ liệu điền khuôn (tự động + GVCN điền, khoá trong `SoChuNhiem`);
  ảnh `img.<khoá>` (sodo1, sodo2, quydinh_lop, sk_hk1, tk_nam, bb_daunam, bb_hk1, bb_cuoinam). Xuất: `SCN.taoWord()` ⇒ `templates/so-chu-nhiem.docx` + `docxfill.js`.
- **Khuôn Word**: `tools/socn/lam_khuon.py <file mẫu> templates/so-chu-nhiem.docx` — giữ trình bày file mẫu, thay dữ liệu bằng ô `{{…}}` (cú pháp ở đầu `docxfill.js`).
  **File mẫu gốc có dữ liệu thật của lớp khác — KHÔNG đưa vào repo.** Đổi mẫu ⇒ dựng lại khuôn, kiểm tra không còn tên / số điện thoại thật, tăng `?v=` trong `taoWord`.
- **Máy chủ mô phỏng** `demo/htdemo.js` (dùng cho web demo + `tools/test/mock.js`, email `gvtoan@example.com`).
  Lệnh backend mới ⇒ thêm vào `htdemo.js`. `run.js` mục 23.
- **Ngôn ngữ** (người dùng yêu cầu 14/10/2026, theo sổ công tác chủ nhiệm): Theo dõi nề nếp · Kết quả rèn luyện · Kết quả học tập · Báo cáo thi đua · Sổ công tác chủ nhiệm ·
  Nhật ký theo dõi · Cha mẹ học sinh; không dùng "hạnh kiểm" trên giao diện / email (dùng "rèn luyện").

## v6.0 — Giao diện gọn: Tổng quan · Cập nhật · Báo cáo & sổ · Quản lý (`v6.js`, nạp cuối `index.html`)
- **ĐÃ BỎ chế độ "Kiểm tra tính năng ứng dụng"** (`demo.js`, `demo-ui.js`, `demo-guide.js`, `docs/HD_Trai_nghiem.pdf` đã xoá — người dùng yêu cầu 14/10/2026).
  Các mục v4.0 / v4.5 (DEMO, DMUI, DMG) ở trên chỉ còn là lịch sử; không thêm lại.
- **Điều hướng theo nhóm** `V6_GROUPS`: Tổng quan (`tq`) · Cập nhật (`ghi` Theo dõi nề nếp, `ht` Điểm bộ môn) · Báo cáo & sổ (`bang`, `bc`, `scn`, `ls`) · Quản lý (`ph`, `cai`).
  `tk` (Thống kê cũ) không còn trên menu (gộp vào Tổng quan, vẫn `go('tk')` được). Thanh bên có tiêu đề nhóm `.v6gh`; điện thoại 4 nút `#tabbar [data-g]` + dải tab phụ `#v6sub`.
  Mục mới ⇒ thêm vào 1 nhóm + `SUBT` / `SUBS`; biểu tượng mới vào `ICON6` (nét mảnh, không emoji). Thanh hướng dẫn `#helpBar` ẩn (dùng nút ?).
- **Tổng quan `TQ`** (`#vTQ`): tab Thi đua · nề nếp / Học lực / Top điểm (2 tab sau chỉ GVCN, cần `HT`), kỳ Tháng / Học kỳ / Năm học, tự vẽ lại ở `renderAll`
  (LIVE gọi renderAll khi có lượt ghi mới), `TQ.pdf()` ⇒ `DL.pdfHtml`. Biểu đồ SVG tự vẽ (`cols`, `donut`, `stack`, `hrows`). GVCN mở app ⇒ `tq`; cán bộ lớp ⇒ `ghi`.
- **Cán bộ lớp**: vai Lớp trưởng / Tổ trưởng / "Cán bộ lớp" ⇒ `S.me.role='Cán bộ lớp'` (`S.me.role0` = vai gốc), ghi nề nếp cả lớp (backend `isCanBo_`).
  Tài khoản mới chọn vai GVCN · Quản trị · Cán bộ lớp. Không viết "tổ trưởng chỉ ghi tổ mình" ở giao diện / hướng dẫn nữa.
- **Đăng nhập** (`lgShell` trong v6.js): logo + **THPT YÊN HÒA** cỡ chữ đều, lớn (v6.1), KHÔNG hiện tên lớp (tên lớp chỉ hiện bên trong).
- **Tính năng sắp ra mắt** (`roadmap.js`): thêm "Mở rộng cho nhiều lớp" (file mẫu `templates/mau-danh-sach-lop.xlsx`: DanhSachLop · PhanQuyen · HuongDan) và
  "Phân quyền từ quản trị" (bảng quyền mẫu).

## v6.2 — Web demo (cho ban giám khảo, QR trong video)
- **`demo.html` + `demo-phu-huynh.html` TỰ SINH** từ `index.html` / `phu-huynh.html` bằng `node tools/demo/build.js` — **chạy lại mỗi lần sửa 2 trang thật** (cùng PR), không sửa tay.
  Cùng thư mục với app thật ⇒ dùng chung mọi script / ảnh; chỉ chèn thêm `demo/htdemo.js` + `demo/server.js` (đầu `<head>`) và `demo/gate.js` (cuối `<body>`).
- `demo/server.js`: máy chủ ẢO trong trình duyệt — chặn mọi `fetch` tới script.google.com, trả lời bằng `DEMO.api` (dữ liệu ảo theo ngày hôm nay, tháng 9 → tháng hiện tại,
  tháng cũ đã khoá sổ); **tách bộ nhớ**: `Storage.prototype` get/set/remove của localStorage tự thêm tiền tố `d11:` ⇒ không đụng sổ thật trên cùng máy.
  Lệnh backend mới ⇒ thêm `case` ở đây (phần học tập: `htdemo.js`). Email hệ thống ⇒ Hộp thư mô phỏng (`DEMO.mails`).
- `demo/gate.js`: màn nhập **mã truy cập `11D3Yenhoa`** (không phân biệt hoa thường, bỏ dấu cách) ⇒ vào vai GVCN; nút **Bản demo** (đổi vai GVCN / Cán bộ lớp /
  GV bộ môn Toán / Cha mẹ HS, Hộp thư mô phỏng, Làm lại dữ liệu ảo, Thoát). Ẩn "Có gì mới" của sổ thật. Link tới trang thật trong file dùng chung ⇒ đổi sang trang demo.
- Kiểm thử: `NODE_PATH=$(npm root -g) node tools/demo/test.js` (máy tính + điện thoại; bắt buộc 0 lệnh tới máy chủ thật, bộ nhớ sổ thật nguyên vẹn). Ảnh: `tools/demo/cap.js`.
- QR trong video dự thi trỏ tới `…/demo.html`.

## v6.3 — Điểm kiểm tra & kỳ thi (thay nhập ĐĐGtx), email báo điểm, PDF kết quả học tập
- **KHÔNG nhập ĐĐGtx** (người dùng 14/10/2026: điểm thường xuyên đã có ở phần mềm khác, GV bộ môn tự điền). `HT.dds` = GK, CK (+ `HK` "TB môn" cho giáo viên, dán từ phần mềm kia);
  `HT.ddsCu` giữ cách tính TT22 cũ khi sổ còn ĐĐGtx. Excel bỏ qua cột ĐĐGtx / cột lạ; cột "ĐTB / TB môn" ⇒ `HK`.
- **Cán bộ lớp** (`HT.isCB`) vào Điểm bộ môn: chỉ thẻ Giữa kì · cuối kì + Kỳ thi & ôn luyện, không TB môn / nhận xét GV. Backend `htCanEnter_` / `ktDdCanBo_` (yenhoa-backend `KyThi.gs`).
- **`kythi.js`** (sau hoctap.js): thẻ Kỳ thi & ôn luyện — loại HSG / OL (ôn luyện trên app) / KT, 1 môn, ngày, thang điểm; điểm ở DiemSo đầu điểm `KT#<mã>`; nhập tay, Excel (cột Họ tên + cột điểm).
  Backend `htSaveKyThi` (op save / del), boot trả `kyThi`.
- **Email báo điểm**: `HT.henBao(keys)` ⇒ `htBaoDiem` 90 s sau lần sửa cuối (4 s sau nhập Excel); máy chủ chỉ gửi điểm mới / đã sửa (sheet `DaBaoDiem`), theo cài đặt email phụ huynh
  + huỷ nhận thư như email rèn luyện. Tắt / bật trên máy: `localStorage.hk_bao_diem`.
- **Điểm môn dùng chung** `HT.monKT(ma, mon, ky)` = TB môn nếu có, không thì TB bài giữa / cuối kì (tham khảo); `HT.tbKT`. Tổng quan Học lực / Top điểm dùng `monKT`.
- **PDF**: `HT.pdfLop(ky)` (Tổng kết ▸ Tải PDF báo cáo: tổng quan, theo môn, kỳ thi, bảng tổng hợp) và `HT.gradePage` chèn vào `RPT.student` (trang "Kết quả học tập":
  điểm từng môn, biểu đồ, kỳ thi đã dự + hạng, nhận xét GVCN; v6.4 bỏ nhận xét GVBM). Hồ sơ học sinh có thêm nút **PDF gửi cha mẹ HS**. Trang phụ huynh (`phu-huynh.html`) CHƯA có điểm
  (phụ huynh xem được cả lớp ⇒ cần thiết kế riêng quyền xem điểm từng con).
- Web demo: tiêu đề "Theo dõi thi đua và nề nếp", tên học sinh ảo không trùng, `htdemo.js` có kỳ thi mẫu + `htSaveKyThi` / `htBaoDiem` (thư vào Hộp thư mô phỏng). Ảnh: `tools/demo/cap63.js`.

## v6.4 — Bỏ vai giáo viên bộ môn
- **Không có giáo viên bộ môn trong sổ** (người dùng yêu cầu 14/10/2026): GVBM không đăng nhập, không nhập điểm, không nhận thư. Chỉ **GVCN và cán bộ lớp** cập nhật điểm.
  Backend: `accountsMap` không gọi `themGVBM_`; `htSaveGV` / `htMailGV` trả lỗi. App: `isGV()` luôn false, bỏ cột / nhập Excel "Nhận xét của GVBM" (NXGV), nút "Đề nghị GVBM nhập",
  danh sách giáo viên ở thẻ **Môn học**; PDF kết quả học tập chỉ còn nhận xét GVCN. Web demo bỏ vai "GV bộ môn (Toán)". Không thêm lại GVBM ở giao diện, hướng dẫn, video.

## v6.5 — Trợ lý AI (khung chat + gợi ý; Gemini hoặc Claude)
- **`ai.js` (`window.AI65`, nạp sau `kythi.js`)**: bọc `openRemark` ⇒ khung `.ai65` dưới `#rkNx` "Gợi ý nhận xét bằng AI" (nhận xét tháng + điểm mạnh / cần cố gắng / gợi ý cho cô, nút Hoàn tác);
  bọc `renderBC` ⇒ "AI viết nhận xét chung & phương hướng" (điền `#bcNx` / `#bcPh` + `bcSave`). Chỉ GVCN. Số liệu gửi đi **ẩn danh** (`duLieuHS` / `duLieuLop`: không họ tên, mã HS, ghi chú tự do).
- **Backend `AiTroLy.gs`** (yenhoa-backend): `aiTrangThai`, `aiGoiY` {loai: `nx_hs` | `bc_lop`, data} — máy chủ tự dựng câu hỏi + `output_config.format` json_schema, lọc khoá cá nhân (`aiSach_`),
  giới hạn lượt/ngày (`AI_MAX_NGAY`, mặc định 300). Claude API `claude-opus-5-5` (đổi bằng thuộc tính `AI_MODEL`), effort `low`, `fallbacks:"default"`. Khoá `CLAUDE_API_KEY` trong
  Thuộc tính tập lệnh (KHÔNG đưa vào repo / chat). Cần quyền UrlFetchApp: chủ script chạy `capQuyenAI` 1 lần (Deploy: `push_only` ⇒ cấp quyền ⇒ deploy).
- **Khung chat `troly.js` (`window.TL`, nạp sau `ai.js`)**: nút **Trợ lý AI** `#tl-top` (trước `#hFind`) + nút tròn `#tl-fab` + Ctrl/⌘ J, chỉ GVCN. Câu hỏi gợi ý `TL.GOIY` (Nề nếp · Học tập · Soạn giúp cô).
  Mỗi câu hỏi gửi `aiChat` {hoi, lichSu (≤10), duLieu} — `duLieu` = lớp, tổng hợp từng tháng (tổ, lỗi nhiều nhất, xếp loại), từng học sinh (điểm TB / xếp loại / lỗi theo tháng,
  điểm tuần tháng đang xem, GK / CK, kỳ thi), kỳ thi. **Ẩn danh**: học sinh = mã tạm `E01…` theo thứ tự `activeStudents()`; tên trong câu hỏi đổi sang mã (`anDanh`, so khớp không dấu,
  họ tên / tên đệm + tên / tên riêng nếu không trùng); câu trả lời đổi mã ⇒ tên bấm được (`.tl-hs` ⇒ `openProfile`). Lịch sử máy `localStorage.hk_tl_v1` (lượt AI giữ bản mã `c`).
  Không đặt khoá `ten / ma / email / ghiChu` trong `duLieu` (máy chủ lọc bỏ); tên kỳ thi dùng `tenKy`. Mã `HSnn` KHÔNG dùng (trùng mã HS của bản demo).
- **Backend `AiTroLy.gs`**: `aiGoi_` chung 2 nhà cung cấp — `GEMINI_API_KEY` (miễn phí, `gemini-2.5-flash`, `AI_MODEL_GEMINI`) hoặc `CLAUDE_API_KEY`; có cả hai ⇒ Gemini, `AI_PROVIDER` để chọn.
  `apiAiChat` (câu lệnh hệ thống `AI_CHAT_HE_THONG`: chỉ dựa dữ liệu, viết mã E…, không nêu tên HS vi phạm trong tin nhắn chung). Giao diện / tài liệu gọi là **"Trợ lý AI"** (không ghi tên hãng).
- Demo / mock: `htdemo.js` `chatMau()` (khung chat, trả lời từ đúng `duLieu` ẩn danh) + `aiMau()` soạn câu trả lời mẫu từ đúng số liệu ẩn danh (không gọi AI thật). `run.js` mục v6.5 kiểm không lộ tên / mã HS. Ảnh: `tools/demo/cap65.js`.
- Video / hồ sơ dự thi: nêu rõ công cụ AI — Claude Code (xây dựng toàn bộ app + backend), "Trợ lý AI" trong app (Gemini miễn phí hoặc Claude API), ElevenLabs (giọng đọc video), Gemini (ảnh cô Thảo).
