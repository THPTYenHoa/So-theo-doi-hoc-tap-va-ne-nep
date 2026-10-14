/* Thông báo cập nhật — Sổ hạnh kiểm 11D3. Mục mới thêm lên ĐẦU mảng (xem CLAUDE.md). */
window.HK_UPDATES = [
  {
    id: "2026-10-14-v6.5", version: "6.5", date: "2026-10-14",
    title: "Trợ lý AI: gợi ý nhận xét học sinh và viết báo cáo thi đua",
    summary: "Sổ có thêm trợ lý AI (Claude) giúp giáo viên chủ nhiệm soạn nhanh lời nhận xét từng học sinh và phần nhận xét chung, phương hướng của báo cáo thi đua. Số liệu gửi cho AI đã ẩn danh; cô luôn đọc, sửa rồi mới lưu.",
    items: [
      { type: "new", title: "Gợi ý nhận xét học sinh bằng AI",
        text: "Mở <b>Nhận xét</b> của một học sinh ▸ bấm <b>Gợi ý nhận xét bằng AI</b>: AI đọc nề nếp, điểm tuần, điểm kiểm tra, kỳ thi của em trong tháng rồi viết lời nhận xét, kèm điểm mạnh, điều cần cố gắng và gợi ý cho cô. Cô sửa lại rồi bấm <b>Lưu nhận xét</b>; có nút <b>Hoàn tác</b>.", img: "updates/v6.5/nhan-xet-hs.jpg" },
      { type: "new", title: "AI viết nhận xét chung & phương hướng cho báo cáo",
        text: "<b>Báo cáo thi đua</b> ▸ bấm <b>AI viết nhận xét chung &amp; phương hướng</b>: AI dựa trên số liệu cả lớp (xếp loại, lỗi thường gặp, thi đua các tổ, so với kỳ trước) để viết 2 phần này. Không gửi tên học sinh nào cho AI.", img: "updates/v6.5/bao-cao-lop.jpg" }
    ]
  },
  {
    id: "2026-10-14-v6.4", version: "6.4", date: "2026-10-14",
    title: "Điểm số chỉ do giáo viên chủ nhiệm và cán bộ lớp cập nhật",
    summary: "Sổ không còn vai giáo viên bộ môn: chỉ giáo viên chủ nhiệm và cán bộ lớp nhập điểm kiểm tra, kỳ thi. Bảng điểm gọn hơn, phiếu báo và báo cáo PDF chỉ còn nhận xét của giáo viên chủ nhiệm.",
    items: [
      { type: "imp", title: "Chỉ giáo viên chủ nhiệm và cán bộ lớp nhập điểm",
        text: "Điểm bộ môn ▸ <b>Giữa kì · cuối kì</b> hoặc <b>Kỳ thi &amp; ôn luyện</b>: giáo viên chủ nhiệm hoặc cán bộ lớp gõ điểm từng ô hoặc <b>Nhập từ Excel</b>. Có điểm mới, cha mẹ đã đăng ký tự nhận thư báo điểm.", img: "updates/v6.4/diem.jpg" },
      { type: "imp", title: "Thẻ Môn học gọn lại",
        text: "Điểm bộ môn ▸ <b>Môn học</b>: chỉ còn danh mục môn học. Bỏ danh sách giáo viên bộ môn, nút đề nghị giáo viên bộ môn nhập điểm và cột nhận xét của giáo viên bộ môn.", img: "updates/v6.4/mon-hoc.jpg" }
    ]
  },
  {
    id: "2026-10-14-v6.3", version: "6.3", date: "2026-10-14",
    title: "Điểm kiểm tra, kỳ thi học sinh giỏi, ôn luyện — email báo điểm và báo cáo PDF",
    summary: "Phần điểm chỉ còn những gì lớp cần theo dõi: điểm kiểm tra giữa kì, cuối kì, các kỳ thi học sinh giỏi và bài ôn luyện trên app. Cán bộ lớp nhập được, cha mẹ nhận email báo điểm, báo cáo PDF có thêm phần kết quả học tập.",
    items: [
      { type: "imp", title: "Không nhập điểm thường xuyên nữa",
        text: "Điểm bộ môn ▸ <b>Giữa kì · cuối kì</b>: chỉ nhập điểm bài kiểm tra giữa kì, cuối kì (gõ tay hoặc <b>Nhập từ Excel</b>). Điểm thường xuyên giáo viên bộ môn vẫn nhập ở phần mềm quản lý điểm của trường; cột <b>TB môn</b> dán từ đó nếu cần xếp mức học tập.",
        img: "" },
      { type: "new", title: "Kỳ thi & ôn luyện",
        text: "Điểm bộ môn ▸ <b>Kỳ thi &amp; ôn luyện</b> ▸ <b>Tạo kỳ thi</b> (thi học sinh giỏi, ôn luyện trên app, bài kiểm tra khác — chọn môn, ngày, thang điểm) ▸ bấm vào kỳ thi để nhập điểm từng bạn hoặc nhập từ Excel. Có điểm trung bình, cao nhất, xếp hạng.",
        img: "updates/v6.3/ky-thi.jpg" },
      { type: "new", title: "Cán bộ lớp nhập điểm, cha mẹ nhận email báo điểm",
        text: "Cán bộ lớp vào được Điểm bộ môn để nhập điểm giữa kì, cuối kì và các kỳ thi. Nhập xong, cha mẹ đã đăng ký nhận thông báo tự nhận email báo điểm (mỗi điểm chỉ báo một lần). Bấm dòng <b>Email báo điểm cho cha mẹ</b> để tắt / bật.",
        img: "updates/v6.3/nhap-diem.jpg" },
      { type: "new", title: "Báo cáo PDF kết quả học tập",
        text: "Điểm bộ môn ▸ <b>Tổng kết</b> ▸ <b>Tải PDF báo cáo</b>: báo cáo cả lớp (điểm trung bình, phân bố điểm, thống kê từng môn, học sinh tiêu biểu, các kỳ thi). Hồ sơ học sinh ▸ <b>Tải PDF báo cáo</b> / <b>PDF gửi cha mẹ HS</b> có thêm trang kết quả học tập: điểm từng môn, biểu đồ, kỳ thi đã dự, nhận xét của giáo viên.",
        img: "updates/v6.3/bao-cao-hs.jpg" }
    ]
  },
  {
    id: "2026-10-14-v6.2", version: "6.2", date: "2026-10-14",
    title: "Web demo cho ban giám khảo: dùng thử mọi tính năng bằng mã truy cập",
    summary: "Có thêm một trang demo riêng với dữ liệu ảo và máy chủ ảo: chỉ cần nhập mã truy cập là dùng thử được mọi tính năng, không ảnh hưởng gì tới sổ thật của lớp.",
    items: [
      { type: "new", title: "Trang demo, vào bằng mã 11D3Yenhoa",
        text: "Mở địa chỉ <b>…/demo.html</b> (hoặc quét mã QR trong video) ⇒ nhập mã <b>11D3Yenhoa</b> ⇒ vào sổ với vai giáo viên chủ nhiệm. Dữ liệu là học sinh ảo, mọi thao tác chỉ lưu trên máy đang dùng, không gửi tới Google Sheet của lớp.",
        img: "updates/v6.2/demo-ma.jpg" },
      { type: "new", title: "Đổi vai và xem email mô phỏng",
        text: "Bấm nút <b>Bản demo</b> ở góc màn hình ⇒ đổi vai (giáo viên chủ nhiệm, cán bộ lớp, giáo viên bộ môn, cha mẹ học sinh), mở <b>Hộp thư mô phỏng</b> để xem email hệ thống sẽ gửi, hoặc <b>Làm lại dữ liệu ảo</b>.",
        img: "updates/v6.2/demo-hop-thu.jpg" }
    ]
  },
  {
    id: "2026-10-14-v6.1", version: "6.1", date: "2026-10-14",
    title: "Màn đăng nhập: tên trường THPT YÊN HÒA cỡ chữ đều",
    summary: "Tên trường ở màn đăng nhập hiện đầy đủ \"THPT YÊN HÒA\" cùng một cỡ chữ lớn, gọn và dễ đọc trên cả máy tính lẫn điện thoại.",
    items: [
      { type: "imp", title: "Tên trường to, đều ở màn đăng nhập",
        text: "Mở đường link của sổ ⇒ màn đăng nhập có logo và dòng <b>THPT YÊN HÒA</b> cùng một cỡ chữ lớn; bên dưới là tên sổ và năm học.",
        img: "updates/v6.1/dang-nhap.jpg" }
    ]
  },
  {
    id: "2026-10-14-v6.0", version: "6.0", date: "2026-10-14",
    title: "Giao diện mới gọn gàng: Tổng quan · Cập nhật · Báo cáo & sổ",
    summary: "Sổ được sắp xếp lại thành 4 khu: Tổng quan (biểu đồ thi đua, học lực, top điểm), Cập nhật (theo dõi nề nếp, điểm bộ môn), Báo cáo & sổ, Quản lý. Lớp trưởng, tổ trưởng gọi chung là cán bộ lớp và ghi nề nếp được cho cả lớp. Màn đăng nhập gọn hơn, bỏ chế độ chạy thử.",
    items: [
      { type: "new", title: "Tổng quan: thi đua, học lực, top điểm",
        text: "Mở sổ ⇒ <b>Tổng quan</b>. Chọn <b>Thi đua · nề nếp</b>, <b>Học lực</b> hoặc <b>Top điểm</b>, rồi chọn <b>Tháng / Học kỳ / Năm học</b>. Số liệu tự cập nhật khi cán bộ lớp vừa ghi; bấm <b>Tải PDF</b> để lưu báo cáo.",
        img: "updates/v6.0/tong-quan.jpg" },
      { type: "new", title: "Top điểm theo môn hoặc điểm TB các môn",
        text: "Tổng quan ▸ <b>Top điểm</b> ▸ chạm tên môn (hoặc <b>TB các môn</b>) ⇒ 3 bạn dẫn đầu, danh sách top 10 và các bạn cần hỗ trợ thêm. Chạm tên học sinh để mở hồ sơ.",
        img: "updates/v6.0/top-diem.jpg" },
      { type: "imp", title: "Menu theo nhóm, điện thoại 4 nút",
        text: "Thanh bên chia nhóm <b>Cập nhật</b> (Theo dõi nề nếp, Điểm bộ môn), <b>Báo cáo &amp; sổ</b>, <b>Quản lý</b>. Trên điện thoại: 4 nút dưới cùng, các mục con hiện thành dải tab ngay dưới tiêu đề.",
        img: "updates/v6.0/dien-thoai.jpg" },
      { type: "imp", title: "Cán bộ lớp ghi nề nếp cho cả lớp",
        text: "Lớp trưởng, tổ trưởng nay gọi chung là <b>Cán bộ lớp</b>: ghi được cho mọi bạn trong lớp, không còn giới hạn theo tổ. GVCN cấp quyền ở Cài đặt ▸ Tài khoản, chọn vai <b>Cán bộ lớp</b>.",
        img: "updates/v6.0/dien-thoai.jpg" },
      { type: "imp", title: "Màn đăng nhập gọn, tên trường nổi bật",
        text: "Màn đăng nhập chỉ còn logo, <b>tên trường</b>, ô email và lối vào cho cha mẹ học sinh. Tên lớp hiện bên trong sổ. Đã bỏ chế độ chạy thử dữ liệu mẫu.",
        img: "updates/v6.0/dang-nhap.jpg" },
      { type: "new", title: "Sắp ra mắt: nhiều lớp, phân quyền từ quản trị",
        text: "Đăng nhập ▸ <b>Tính năng sắp ra mắt</b>: mở rộng cho nhiều lớp (tải <b>file Excel mẫu danh sách lớp</b> có sẵn bảng biểu) và phân quyền từ quản trị (GVCN, cán bộ lớp, giáo viên bộ môn, Ban giám hiệu).",
        img: "updates/v6.0/mo-rong.jpg" }
    ]
  },
  {
    id: "2026-10-14-v5.0", version: "5.0", date: "2026-10-14",
    title: "Kết quả học tập, Sổ công tác chủ nhiệm, kết nối giáo viên bộ môn",
    summary: "Sổ theo dõi học sinh nay theo dõi cả kết quả học tập (điểm số, nhận xét theo Thông tư 22), lập Sổ công tác chủ nhiệm đúng mẫu của trường (xuất Word, gửi Ban giám hiệu), giáo viên bộ môn tự nhập điểm, gửi phiếu báo kết quả tới cha mẹ học sinh. Cách gọi các mục theo ngôn ngữ hành chính: Theo dõi nề nếp, Kết quả rèn luyện, Kết quả học tập.",
    items: [
      { type: "new", title: "Kết quả học tập: bảng điểm từng môn",
        text: "Menu <b>Kết quả học tập</b> ▸ chọn môn, học kì ▸ bấm vào ô để nhập điểm ĐĐGtx, giữa kì, cuối kì (môn nhận xét nhập Đ / CĐ). ĐTB môn học kì, cả năm tự tính theo Thông tư 22/2021. <b>Thêm đầu điểm</b> để tạo cột mới; bấm tiêu đề cột để đổi tên hoặc xoá.",
        img: "updates/v5.0/bang-diem.jpg" },
      { type: "new", title: "Nhập, thay điểm hàng loạt từ Excel",
        text: "Bấm <b>Nhập từ Excel</b> ▸ chọn tệp (mỗi trang tính một môn, có cột Họ và tên hoặc Mã HS) ▸ xem trước ▸ <b>Lưu vào sổ</b>. Chọn <b>Thay hàng loạt</b> hoặc <b>Chỉ cập nhật</b>; cột chưa có trong sổ được lưu thành đầu điểm mới.",
        img: "updates/v5.0/nhap-excel.jpg" },
      { type: "new", title: "Tổng kết, phiếu báo kết quả gửi cha mẹ học sinh",
        text: "Thẻ <b>Tổng kết</b>: ĐTB các môn, mức kết quả học tập Tốt · Khá · Đạt · Chưa đạt, kết quả rèn luyện, danh hiệu cả năm theo giữa kì, học kì, cả năm. Bấm <b>Gửi phiếu báo cha mẹ HS</b> ▸ xem trước ▸ <b>Gửi</b>: mỗi gia đình nhận email kết quả của riêng con mình.",
        img: "updates/v5.0/tong-ket.jpg" },
      { type: "new", title: "Giáo viên bộ môn nhập điểm, nhận xét",
        text: "Thẻ <b>Môn học &amp; giáo viên</b>: nhập danh sách giáo viên bộ môn kèm email. Giáo viên đăng nhập bằng email của mình (mã 6 số), <b>chỉ thấy và nhập điểm, nhận xét môn mình dạy</b>. Nút <b>Đề nghị GVBM nhập</b> gửi email kèm đường dẫn.",
        img: "updates/v5.0/giao-vien-bo-mon.jpg" },
      { type: "new", title: "Sổ công tác chủ nhiệm: xuất Word đúng mẫu, gửi Ban giám hiệu",
        text: "Menu <b>Sổ công tác chủ nhiệm</b>: các mục theo đúng sổ của trường. Phần có nhãn <b>Tự động</b> lấy từ dữ liệu đã lưu (sơ kết tuần, xếp loại rèn luyện, chất lượng hai mặt…), phần còn lại GVCN điền, tải ảnh sơ đồ lớp, biên bản họp. Bấm <b>Xuất file Word</b> hoặc <b>Gửi Ban giám hiệu</b> (email kèm file).",
        img: "updates/v5.0/so-chu-nhiem.jpg" },
      { type: "imp", title: "Ngôn ngữ hành chính, mức đánh giá theo Thông tư 22",
        text: "Các mục đổi tên: <b>Theo dõi nề nếp</b>, <b>Kết quả rèn luyện</b>, <b>Báo cáo thi đua</b>, <b>Nhật ký theo dõi</b>, <b>Cha mẹ học sinh</b>. Mức xếp loại hiển thị Tốt · Khá · Đạt · Chưa đạt.",
        img: "updates/v5.0/menu-moi.jpg" }
    ]
  },
  {
    id: "2026-10-13-v4.9", version: "4.9", date: "2026-10-13",
    title: "Logo trường, xếp loại hạnh kiểm chỉ theo tháng và học kỳ",
    summary: "Màn đăng nhập có logo Trường THPT Yên Hòa. Hạnh kiểm chỉ xếp loại theo tháng và học kỳ — không còn xếp loại, báo cáo theo tuần (GVCN vẫn lấy được báo cáo tuần khi cần). Bỏ mục học phí khỏi Tính năng sắp ra mắt.",
    items: [
      { type: "new", title: "Logo trường ở màn đăng nhập",
        text: "Mở app ⇒ màn đăng nhập có <b>logo Trường THPT Yên Hòa</b> cạnh tên lớp. Biểu tượng trên tab trình duyệt và khi thêm app ra màn hình chính điện thoại cũng là logo trường.",
        img: "updates/v4.9/logo-dang-nhap.jpg" },
      { type: "imp", title: "Ghi điểm: số là điểm tuần, nhãn là xếp loại tháng",
        text: "Màn <b>Ghi điểm</b>: con số bên phải mỗi em là <b>tổng điểm tuần</b> đang chọn, nhãn nhỏ bên dưới là <b>xếp loại tháng (tạm tính)</b>, ví dụ “T10 · Khá”. Ô <b>Cần nhắc nhở</b> và <b>Đạt loại Tốt</b> ở thẻ tổng quan cũng tính theo tháng.",
        img: "updates/v4.9/ghi-diem-xep-loai-thang.jpg" },
      { type: "imp", title: "Cập nhật hạnh kiểm, Thống kê: chỉ tháng và học kỳ",
        text: "Bỏ lựa chọn <b>Tuần</b> ở <b>Cập nhật hạnh kiểm</b> và <b>Thống kê</b> — chỉ còn <b>Tháng · Học kỳ</b> (Thống kê có thêm Cả năm). Điểm từng tuần vẫn hiện trong thẻ học sinh nhưng không còn tô màu xếp loại.",
        img: "updates/v4.9/hanh-kiem-thang-hoc-ky.jpg" },
      { type: "imp", title: "Báo cáo tuần: chỉ GVCN, khi cần",
        text: "Menu <b>Báo cáo</b> mặc định là <b>Tháng · Học kỳ · Cả năm</b>. GVCN cần báo cáo tuần thì bấm nút <b>Tuần</b> ở cuối hàng; cán bộ lớp không thấy nút này.",
        img: "updates/v4.9/bao-cao-tuan-gvcn.jpg" },
      { type: "fix", title: "Tính năng sắp ra mắt: bỏ mục học phí",
        text: "Màn đăng nhập / menu tài khoản ▸ <b>Tính năng sắp ra mắt</b>: không còn mục <b>Học phí, khoản thu</b> — sổ không chứa thông tin học phí.",
        img: "updates/v4.9/tinh-nang-sap-ra-mat.jpg" }
    ]
  },
  {
    id: "2026-10-24-v4.8", version: "4.8", date: "2026-10-24",
    title: "Nút Quay lại trong app, trang phụ huynh dễ dùng hơn",
    summary: "Bấm Quay lại của điện thoại là về màn trước trong app, không bị thoát ra trang khác. Trang phụ huynh có nút Thoát, tab Danh sách / Hồ sơ rõ ràng và lời hướng dẫn khi nhập email.",
    items: [
      { type: "new", title: "Nút Quay lại của điện thoại / trình duyệt",
        text: "Bấm <b>Quay lại</b> ⇒ đóng hộp đang mở (khung học sinh, màn chi tiết, thông báo…) hoặc về mục vừa xem. Về tới màn đầu, app nhắc <b>Bấm Quay lại thêm lần nữa để thoát</b> để tránh bấm nhầm.",
        img: "updates/v4.8/nut-quay-lai.jpg" },
      { type: "imp", title: "Trang phụ huynh: tab Danh sách học sinh / Hồ sơ",
        text: "Mở hồ sơ một học sinh ⇒ ngay dưới thanh trên cùng có 2 nút lớn <b>Danh sách học sinh</b> và <b>Hồ sơ: tên con</b> để chuyển qua lại, dễ thấy, dễ bấm.",
        img: "updates/v4.8/phu-huynh-tab-phu.jpg" },
      { type: "new", title: "Trang phụ huynh: nút Thoát",
        text: "Bấm nút <b>Thoát</b> (góc phải trên) ⇒ xác nhận ⇒ dữ liệu sổ lưu trên máy được xoá, về trang đăng nhập. Mở lại đường link trang phụ huynh là xem được ngay.",
        img: "updates/v4.8/phu-huynh-thoat.jpg" },
      { type: "imp", title: "Lời hướng dẫn khi nhập email",
        text: "Bấm vào ô email (đăng ký nhận thông báo ở trang phụ huynh, hoặc đăng nhập) ⇒ hiện lời hướng dẫn kèm ảnh cô Thảo: nhập email nào, mã 6 số gửi về đâu, khi nào nhận thư.",
        img: "updates/v4.8/phu-huynh-email.jpg" },
      { type: "fix", title: "Thông báo cập nhật, bong bóng cô Thảo, cách xưng hô",
        text: "Điện thoại: ô <b>Không hiển thị lại</b> không còn bị nút <b>Đã hiểu</b> che. Bong bóng lời chào của cô Thảo tự ẩn đúng lúc (chạm ra ngoài cũng ẩn). Trang, email và PDF gửi phụ huynh xưng <b>cô Thảo</b> khi nói về con, <b>giáo viên chủ nhiệm</b> trong thông báo, hướng dẫn.",
        img: "updates/v4.8/thong-bao-dien-thoai.jpg" }
    ]
  },
  {
    id: "2026-10-23-v4.7", version: "4.7", date: "2026-10-23",
    title: "Thống kê lỗi vi phạm và hoạt động được tuyên dương",
    summary: "Báo cáo tuần, tháng, học kỳ, cả năm và mục Thống kê có thêm phần lỗi vi phạm, hoạt động được tuyên dương nhiều, với nhiều kiểu biểu đồ và lời nhận xét của cô Thảo.",
    items: [
      { type: "new", title: "Báo cáo: lỗi vi phạm và hoạt động được tuyên dương",
        text: "Mở <b>Báo cáo</b>, chọn Tuần / Tháng / Học kỳ / Cả năm ⇒ mục <b>Vi phạm & tuyên dương</b>: cô Thảo nêu lỗi gặp nhiều nhất và hoạt động được khen nhiều nhất, vòng tròn theo nhóm, bảng lỗi kèm xu hướng, danh sách hoạt động được tuyên dương.",
        img: "updates/v4.7/bao-cao-vi-pham-tuyen-duong.jpg" },
      { type: "new", title: "Bản đồ lỗi theo tổ, khen và vi phạm từng tổ",
        text: "Ô càng đậm, tổ đó mắc lỗi càng nhiều. Biểu đồ hai phía so sánh lượt vi phạm và lượt được khen của từng tổ; biểu đồ đường cho thấy các lỗi chính tăng hay giảm. Bấm vào ô, dòng hay tổ để xem từng lượt.",
        img: "updates/v4.7/ban-do-loi-dien-bien.jpg" },
      { type: "new", title: "File PDF báo cáo thêm 2 trang",
        text: "Bấm <b>Tải PDF</b> trong Báo cáo ⇒ có thêm trang <b>Thống kê lỗi vi phạm</b> (bảng lỗi theo tổ, vòng tròn theo nhóm, diễn biến) và trang <b>Hoạt động được tuyên dương</b> (top hoạt động, theo nhóm, từng tổ), kèm lời của cô Thảo.",
        img: "updates/v4.7/pdf-loi-vi-pham.jpg" },
      { type: "imp", title: "Thống kê: thêm Học kỳ và top hoạt động được tuyên dương",
        text: "Mục <b>Thống kê</b> có thêm nút <b>Học kỳ</b>. Ở kỳ đang chọn (tuần, tháng, học kỳ, cả năm) có thêm phần <b>Hoạt động được tuyên dương nhiều</b> cùng bảng lỗi, bản đồ lỗi theo tổ.",
        img: "updates/v4.7/thong-ke-hoc-ky.jpg" }
    ]
  },
  {
    id: "2026-10-22-v4.6", version: "4.6", date: "2026-10-22",
    title: "Bấm vào số liệu để xem chi tiết · Ghi điểm cho ngày đã qua",
    summary: "Mọi con số ở Thống kê, Báo cáo, Lịch sử và thẻ tổng quan đều bấm được để xem chi tiết. Mở app là vào ngay Ghi điểm của tuần hiện tại; có thể chọn ngày xảy ra để ghi cho việc đã qua.",
    items: [
      { type: "new", title: "Bấm vào số liệu ⇒ xem chi tiết",
        text: "Ở <b>Thống kê</b>, <b>Báo cáo</b>, <b>Lịch sử</b>, bấm vào ô số, thanh xếp loại, tên học sinh, lỗi hay dòng tổ ⇒ màn chi tiết mở ra (phía sau mờ đi): tổng số, biểu đồ từng tuần, danh sách theo học sinh, nội dung, tổ, từng lượt.",
        img: "updates/v4.6/so-lieu-chi-tiet.jpg" },
      { type: "new", title: "Xem sâu từng lớp",
        text: "Trong màn chi tiết, bấm tiếp vào một học sinh, một lỗi hay một tổ để xem riêng phần đó. Nút <b>‹</b> để quay lại, nút <b>Mở hồ sơ</b> để xem đầy đủ của học sinh. Bấm ra ngoài hoặc nút × để đóng.",
        img: "updates/v4.6/xem-sau.jpg" },
      { type: "imp", title: "Mở app là vào Ghi điểm của tuần này",
        text: "Giáo viên chủ nhiệm và cán bộ lớp đăng nhập ⇒ app mở sẵn <b>Ghi điểm</b>, đúng tháng và tuần của hôm nay. Bấm 4 ô ở thẻ tổng quan (Lượt trừ điểm, Lượt khen…) để xem chi tiết hoặc lọc danh sách.",
        img: "updates/v4.6/mo-app-ghi-diem.jpg" },
      { type: "new", title: "Ghi điểm cho việc đã xảy ra trước đó",
        text: "Khi ghi điểm, ở bước diễn giải chọn <b>Ngày xảy ra</b> (hoặc bấm Hôm qua) ⇒ app tự ghi vào đúng tuần của ngày đó và thêm \"ngày dd/mm\" vào ghi chú. Tháng đã khoá sổ thì không ghi thêm được.",
        img: "updates/v4.6/ngay-xay-ra.jpg" }
    ]
  },
  {
    id: "2026-10-21-v4.5", version: "4.5", date: "2026-10-21",
    title: "Tải PDF, Excel trên điện thoại · Hướng dẫn trải nghiệm theo vai",
    summary: "Bấm Tải PDF / Tải Excel là có file thật, kể cả trên điện thoại. Chế độ trải nghiệm có hướng dẫn từng bước cho giáo viên, cán bộ lớp và phụ huynh.",
    items: [
      { type: "fix", title: "Tải PDF, Excel chạy được trên điện thoại",
        text: "Bấm <b>Tải PDF</b> hoặc <b>Tải Excel</b> ⇒ màn chờ hiện tiến độ ⇒ file tự tải về và hiện bảng <b>Mở file / Chia sẻ</b>. Chạy được cả khi mở link từ Zalo, Gmail. File Excel là .xlsx, mở được bằng Excel hoặc Google Trang tính.",
        img: "updates/v4.5/tai-file.jpg" },
      { type: "new", title: "Hướng dẫn trải nghiệm theo 3 vai",
        text: "Màn đăng nhập ▸ <b>Kiểm tra tính năng ứng dụng</b> ⇒ chọn vai <b>Giáo viên chủ nhiệm</b>, <b>Cán bộ lớp</b> hoặc <b>Phụ huynh</b> ⇒ xem các việc vai đó làm được, bấm một việc để được hướng dẫn.",
        img: "updates/v4.5/huong-dan-vai.jpg" },
      { type: "new", title: "Chỉ từng bước, chỉ cần bấm theo",
        text: "Màn hình tối lại, chỉ sáng đúng chỗ cần bấm, kèm lời chỉ dẫn. Bấm đúng chỗ là tự sang bước sau. Email trong chế độ này là giả định, xem ở nút <b>Hộp thư</b>.",
        img: "updates/v4.5/tung-buoc.jpg" },
      { type: "new", title: "Tính năng sắp ra mắt",
        text: "Màn đăng nhập, menu tài khoản hoặc trang phụ huynh ▸ <b>Tính năng sắp ra mắt</b>: lộ trình mở rộng thành sổ liên lạc điện tử (Ban giám hiệu, học bạ, nội quy, hoạt động, thông báo).",
        img: "updates/v4.5/sap-ra-mat.jpg" }
    ]
  },
  {
    id: "2026-10-20-v4.4", version: "4.4", date: "2026-10-20",
    title: "Tên mới: Sổ theo dõi học sinh",
    summary: "Ứng dụng đổi tên thành \"Sổ theo dõi học sinh\" để sau này mở rộng thêm học bạ, thông báo của trường… Trước mắt vẫn là theo dõi, đánh giá hạnh kiểm và nề nếp.",
    items: [
      { type: "imp", title: "Tên mới trên mọi màn hình",
        text: "Thanh bên trái, màn đăng nhập, trang phụ huynh, báo cáo PDF và email gửi phụ huynh đều hiện tên <b>Sổ theo dõi học sinh</b>. Đường link và cách dùng giữ nguyên.",
        img: "updates/v4.4/ten-moi.jpg" }
    ]
  },
  {
    id: "2026-10-19-v4.3", version: "4.3", date: "2026-10-19",
    title: "\"Chốt tháng\" đổi tên thành \"Khoá sổ tháng\"",
    summary: "Cách gọi mới, dễ hiểu hơn: khoá sổ tháng (không ai sửa được nữa) và xác nhận xếp loại (giáo viên chọn xếp loại cho từng em).",
    items: [
      { type: "imp", title: "Khoá sổ tháng",
        text: "<b>Cập nhật hạnh kiểm</b> ▸ <b>Khoá sổ tháng</b>: mọi ghi nhận của tháng chỉ còn xem, không thêm, sửa, xoá được. Bấm <b>Mở khoá</b> khi cần sửa lại. Cách dùng không đổi, chỉ đổi tên.",
        img: "updates/v4.3/khoa-so.jpg" },
      { type: "imp", title: "Xác nhận xếp loại",
        text: "Khi nhận xét một em, ô chọn xếp loại nay gọi là <b>Xác nhận xếp loại</b>. Dấu ✓ cạnh xếp loại nghĩa là giáo viên đã xác nhận. Các file hướng dẫn PDF đã cập nhật theo tên mới.",
        img: "" }
    ]
  },
  {
    id: "2026-10-18-v4.2", version: "4.2", date: "2026-10-18",
    title: "Mở hướng dẫn ngay ở màn đăng nhập",
    summary: "Từ một đường link của sổ, ai cũng mở được: bản dùng thử, trang phụ huynh và các file hướng dẫn.",
    items: [
      { type: "new", title: "Link hướng dẫn ở màn đăng nhập",
        text: "Màn đăng nhập ▸ dưới nút <b>Phụ huynh xem sổ</b> có thêm <b>Hướng dẫn sử dụng (PDF)</b> và <b>Hướng dẫn trải nghiệm (PDF)</b>. Bấm là mở file, không cần đăng nhập.",
        img: "updates/v4.2/link-huong-dan.jpg" }
    ]
  },
  {
    id: "2026-10-17-v4.1", version: "4.1", date: "2026-10-17",
    title: "Lời nhắn của cô Thảo tự nhiên, dễ hiểu hơn",
    summary: "Soát lại câu chữ trong toàn bộ sổ: lời nhắn cho phụ huynh, báo cáo PDF, hướng dẫn, thông báo khi lưu và email.",
    items: [
      { type: "imp", title: "Lời nhắn cho phụ huynh rõ nghĩa hơn",
        text: "Trang phụ huynh ▸ hồ sơ của con: lời của cô Thảo nói rõ con đang thế nào, ví dụ <i>\"Con An ngoan, chỉ còn vài lỗi nhỏ. Cô và bác cùng nhắc con cố gắng thêm nhé ạ.\"</i> Báo cáo PDF của từng học sinh cũng dùng cách nói này.",
        img: "updates/v4.1/loi-nhan.jpg" },
      { type: "imp", title: "Hướng dẫn và thông báo dễ hiểu hơn",
        text: "Viết lại các câu khó hiểu trong hướng dẫn từng bước, thông báo khi lưu điểm, tên trang phục cô Thảo, chủ đề màu và email gửi phụ huynh.",
        img: "" }
    ]
  },
  {
    id: "2026-10-16-v4.0", version: "4.0", date: "2026-10-16",
    title: "Chế độ \"Kiểm tra tính năng ứng dụng\"",
    summary: "Ai cũng thử được toàn bộ sổ hạnh kiểm mà không cần tài khoản: dữ liệu mẫu, đổi vai cô chủ nhiệm · cán bộ lớp · phụ huynh, hộp thư mô phỏng, danh sách việc nên thử.",
    items: [
      { type: "new", title: "Vào thử không cần mật khẩu",
        text: "Màn đăng nhập ▸ <b>Kiểm tra tính năng ứng dụng</b> ⇒ vào ngay sổ với dữ liệu mẫu (tên học sinh giả). Mọi thao tác chỉ diễn ra trên máy, không ảnh hưởng sổ thật.",
        img: "updates/v4.0/vao-thu.jpg" },
      { type: "new", title: "Đổi vai + hướng dẫn 9 việc",
        text: "Thanh trên cùng: đổi vai <b>Cô Thảo · Lớp trưởng · Tổ trưởng · Phụ huynh</b>; <b>Hướng dẫn</b> liệt kê 9 việc (ghi điểm, email phụ huynh, nhận xét, báo cáo PDF, đăng ký & duyệt phụ huynh, chốt tháng) — bấm <b>Làm ngay</b> là tự mở đúng chỗ.",
        img: "updates/v4.0/huong-dan.jpg" },
      { type: "new", title: "Hộp thư mô phỏng",
        text: "Thư hệ thống gửi phụ huynh / cô chủ nhiệm hiện trong <b>Hộp thư</b>: lời cô Thảo theo tình huống, nút mở thông báo, thư duyệt kèm hướng dẫn PDF.",
        img: "updates/v4.0/hop-thu.jpg" }
    ]
  },
  {
    id: "2026-10-15-v3.9", version: "3.9", date: "2026-10-15",
    title: "Giao diện mới gọn gàng, cô Thảo nhiều trang phục",
    summary: "Cài đặt chia mục rõ ràng, trang Phụ huynh riêng, tìm kiếm thông minh, rê chuột xem điểm từ đâu, dải điểm tuần tự lật, 6 bộ trang phục mới của cô Thảo.",
    items: [
      { type: "new", title: "Dải điểm tuần tự lật",
        text: "Màn Ghi điểm luôn có dải <b>Điểm tuần</b>: tự lật chậm qua mọi lượt cộng / trừ của cả lớp trong tuần (rê chuột để dừng, ‹ › để xem tay). Bấm một lượt ⇒ <b>Xem hồ sơ · Sửa · Nhận xét</b> tuỳ quyền.",
        img: "updates/v3.9/diem-tuan.jpg" },
      { type: "new", title: "Tìm kiếm thông minh + rê chuột xem chi tiết",
        text: "Ở <b>Cập nhật hạnh kiểm</b> và <b>Báo cáo</b>: gõ \"tổ 2 vi phạm\", \"khá\", \"đi muộn\"… hoặc bấm chip để lọc ngay. Rê chuột vào ô điểm ⇒ thấy được cộng / bị trừ từ những nội dung nào.",
        img: "updates/v3.9/tim-kiem.jpg" },
      { type: "imp", title: "Cài đặt gọn, menu tài khoản, trang Phụ huynh",
        text: "Cài đặt chia thành các mục bên trái (Lớp & xếp loại, Danh mục điểm, Tài khoản & quyền…). Bấm <b>avatar góc phải</b> ⇒ tài khoản, Đăng xuất. Menu <b>Phụ huynh</b> (GVCN): đăng ký chờ duyệt, email phụ huynh từng học sinh.",
        img: "updates/v3.9/cai-dat.jpg" },
      { type: "imp", title: "Trang phụ huynh mới + nhận xét của cô Thảo",
        text: "Trang phụ huynh: ô <b>Nhận thông báo qua email</b> đưa lên đầu, bố cục 2 cột trên máy tính, cô xưng \"bác\". Mọi báo cáo PDF (lớp, học sinh, thông báo) đều có mục <b>Nhận xét của cô Thảo</b>.",
        img: "updates/v3.9/phu-huynh.jpg" },
      { type: "new", title: "Cô Thảo 6 bộ trang phục",
        text: "Áo len tím, áo dài trắng, áo dài chàm, cardigan lên lớp, áo blouse STEM, áo khoác mùa đông — hiện ngẫu nhiên theo từng tình huống, cả trong báo cáo và hướng dẫn. Tuần lễ 20/11 cô mặc áo dài.",
        img: "updates/v3.9/co-thao.jpg" }
    ]
  },
  {
    id: "2026-10-14-v3.8", version: "3.8", date: "2026-10-14",
    title: "Phụ huynh đăng ký — cô Thảo được báo ngay",
    summary: "Có phụ huynh đăng ký nhận email, màn hình cô hiện thông báo và cô nhận email báo. Cô duyệt xong, phụ huynh nhận thư xác nhận kèm file hướng dẫn (PDF).",
    items: [
      { type: "new", title: "Báo cô khi có phụ huynh đăng ký",
        text: "Phụ huynh xác nhận mã xong ⇒ màn hình cô hiện thẻ <b>Phụ huynh vừa đăng ký</b> (không cần tải lại), menu <b>Cài đặt</b> có chấm đỏ, và cô nhận email báo. Bấm <b>Duyệt ngay</b> (hoặc nút <b>Mở sổ để duyệt</b> trong email) ⇒ vào thẳng mục Phụ huynh chờ duyệt.",
        img: "updates/v3.8/bao-co.jpg" },
      { type: "new", title: "Duyệt xong, phụ huynh nhận hướng dẫn PDF",
        text: "Cô bấm <b>Duyệt</b> ⇒ phụ huynh nhận email \"Cô Thảo đã duyệt\" kèm <b>file hướng dẫn dành cho phụ huynh (PDF)</b> và nút xem sổ của con. Từ đó các bác nhận thông báo mỗi khi con được cộng / bị trừ điểm.",
        img: "updates/v3.8/duyet.jpg" }
    ]
  },
  {
    id: "2026-10-13-v3.7", version: "3.7", date: "2026-10-13",
    title: "Chốt tháng, báo cáo có biểu đồ, email cho phụ huynh",
    summary: "Cô chủ nhiệm chốt hạnh kiểm tháng (chốt xong không ai sửa / xoá được nữa). Báo cáo lớp và hồ sơ từng học sinh xuất PDF khổ ngang có biểu đồ, số liệu so với kỳ trước và hình cô Thảo. Phụ huynh đăng ký email để nhận thông báo mỗi khi con được cộng / bị trừ điểm.",
    items: [
      { type: "new", title: "Chốt hạnh kiểm tháng",
        text: "GVCN vào <b>Bảng tổng hợp</b> (hoặc Báo cáo tháng) ▸ bấm <b>Chốt tháng</b>. Từ lúc đó mọi ghi nhận, nhận xét, bằng chứng của tháng đó chỉ còn xem — không thêm, sửa, xoá được. Cô bấm <b>Mở khoá</b> nếu cần chỉnh lại.",
        img: "updates/v3.7/chot-thang.jpg" },
      { type: "new", title: "Báo cáo lớp: biểu đồ + so với kỳ trước",
        text: "Menu <b>Báo cáo</b> có thẻ so sánh kỳ này / kỳ trước (▲ tốt lên, ▼ kém đi), tổ dẫn đầu và tổ cần cố gắng, cô Thảo đổi nét mặt theo kết quả lớp. Bấm <b>In / Lưu PDF</b> ⇒ file khổ ngang: số liệu, biểu đồ, xếp hạng tổ, tuyên dương, nhắc nhở, nhận xét (không còn quốc hiệu).",
        img: "updates/v3.7/bao-cao.jpg" },
      { type: "new", title: "PDF riêng từng học sinh",
        text: "Chạm tên học sinh ▸ chọn tháng / học kỳ / cả năm ▸ <b>Tải PDF báo cáo</b>: điểm từng tuần, cộng / trừ, lỗi thường mắc, khen thưởng, nhận xét của cô, so với kỳ trước. Phụ huynh tải được ở trang phụ huynh.",
        img: "updates/v3.7/hoc-sinh.jpg" },
      { type: "new", title: "Phụ huynh nhận email khi con được cộng / bị trừ điểm",
        text: "Ở trang phụ huynh, các bác mở hồ sơ của con ▸ <b>Nhận thông báo qua email</b> ▸ nhập email ▸ nhập mã 6 số ⇒ cô duyệt trong <b>Cài đặt ▸ Phụ huynh chờ duyệt</b>. Thư có lời cô Thảo theo tình huống và nút mở <b>PDF thông báo</b> khổ ngang.",
        img: "updates/v3.7/phu-huynh.jpg" }
    ]
  },
  {
    id: "2026-10-12-v3.6", version: "3.6", date: "2026-10-12",
    title: "Cô Thảo 3D siêu cute",
    summary: "Toàn bộ hình cô Thảo đổi sang bộ ảnh 3D mới — vẫy tay chào, vỗ tay khi các con được khen, buồn, nghiêm, giận dễ thương, chạy ở màn chờ…",
    items: [
      { type: "new", title: "18 biểu cảm 3D",
        text: "Cô Thảo 3D xuất hiện ở thẻ tổng quan, bong bóng nhắc khi ghi điểm, hướng dẫn từng bước, báo cáo và trang phụ huynh. Mỗi lần ghi điểm cô phản ứng đúng tình huống: vui khi khen, buồn khi trừ, nghiêm khi tái phạm, giận khi vi phạm nhiều lần.",
        img: "updates/v3.6/co-thao-3d.jpg" },
      { type: "imp", title: "Màn chờ cô Thảo 3D chạy",
        text: "Lúc mở sổ, cô Thảo 3D chạy trên thanh tiến trình kèm lời nhắn cho các con / các bác. File hướng dẫn PDF cũng đổi sang hình mới.",
        img: "updates/v3.6/man-cho-3d.jpg" }
    ]
  },
  {
    id: "2026-10-11-v3.5", version: "3.5", date: "2026-10-11",
    title: "Màn chờ: cô Thảo chạy cùng thanh tiến trình",
    summary: "Lúc mở sổ hoặc nhập mã đăng nhập, cô Thảo chạy trên thanh tiến trình kèm lời nhắn — các con và các bác biết sổ đang mở, không phải chờ trong im lặng.",
    items: [
      { type: "new", title: "Cô Thảo chạy khi đang tải",
        text: "Mở sổ hoặc nhập xong mã 6 số ⇒ hiện thanh tiến trình có cô Thảo chạy. Mạng chậm thì cô nhắn: <b>\"Mạng lag xíu, các con chờ chút nha…\"</b>; ở trang phụ huynh: <b>\"Các bác chờ chút ạ…\"</b>.",
        img: "updates/v3.5/man-cho.jpg" }
    ]
  },
  {
    id: "2026-10-10-v3.4", version: "3.4", date: "2026-10-10",
    title: "Quản lý lớp và phân quyền rõ ràng",
    summary: "Chỉ GVCN được cấp quyền cho email khác, đổi tổ, thêm hoặc xoá học sinh. Thêm / khoá tài khoản có hiệu lực ngay.",
    items: [
      { type: "new", title: "Bảng phân quyền",
        text: "Vào <b>Cài đặt</b> ▸ <b>Phân quyền trong sổ</b> để xem ai được làm gì. <b>GVCN</b> toàn quyền: cấp quyền cho email khác, khoá / xoá tài khoản, đổi tổ, thêm, xoá học sinh. Lớp trưởng ghi cả lớp và sửa danh mục; tổ trưởng ghi tổ mình.",
        img: "updates/v3.4/phan-quyen.jpg" },
      { type: "imp", title: "Đổi tổ, xoá học sinh an toàn hơn",
        text: "<b>Cài đặt ▸ Đổi tổ hàng loạt</b> ▸ chạm chọn các em ▸ chọn tổ mới ▸ Áp dụng. Khi sửa một em có nút <b>Đánh dấu nghỉ học / chuyển lớp</b> — em đó ẩn khỏi sổ nhưng vẫn giữ lịch sử điểm; chỉ xoá hẳn khi thật cần.",
        img: "updates/v3.4/hoc-sinh.jpg" },
      { type: "fix", title: "Tài khoản có hiệu lực ngay",
        text: "Thêm email mới thì người đó đăng nhập được ngay; khoá hoặc xoá tài khoản thì người đó mất quyền ngay (trước đây có thể phải chờ vài phút)." }
    ]
  },
  {
    id: "2026-10-09-v3.3", version: "3.3", date: "2026-10-09",
    title: "Báo cáo tuần, tháng, học kỳ, cả năm",
    summary: "Menu mới Báo cáo: số liệu so với kỳ trước, thi đua tổ, lỗi thường gặp, tuyên dương, học sinh cần quan tâm, lời nhận xét tự soạn — in đúng mẫu văn bản, tải Excel, gửi tóm tắt cho phụ huynh.",
    items: [
      { type: "new", title: "Menu Báo cáo",
        text: "Bấm <b>Báo cáo</b> ▸ chọn <b>Tuần · Tháng · Học kỳ · Cả năm</b>. Có điểm TB lớp, lượt vi phạm / khen, tỉ lệ đạt Tốt kèm <b>▲▼ so với kỳ trước</b>, thi đua giữa các tổ, vi phạm theo nhóm, tuyên dương, các em tiến bộ và danh sách <b>cần quan tâm</b> (bấm tên để mở hồ sơ).",
        img: "updates/v3.3/bao-cao.jpg" },
      { type: "new", title: "Nhận xét tự soạn, in đúng mẫu",
        text: "Phần <b>Nhận xét chung</b> và <b>Phương hướng</b> được soạn sẵn từ số liệu; cô sửa trực tiếp, máy tự lưu. Bấm <b>In / Lưu PDF</b> ra văn bản có quốc hiệu, các mục I–VII, chữ ký GVCN và phụ lục bảng từng học sinh.",
        img: "updates/v3.3/ban-in.jpg" },
      { type: "new", title: "Excel và tóm tắt gửi phụ huynh",
        text: "<b>Tải Excel</b> lấy toàn bộ số liệu báo cáo. <b>Tóm tắt gửi phụ huynh</b> sao chép sẵn đoạn tin để dán vào nhóm Zalo — chỉ nêu tên các em được tuyên dương, <b>không nêu tên học sinh vi phạm</b>." }
    ]
  },
  {
    id: "2026-10-09-v3.2", version: "3.2", date: "2026-10-09",
    title: "Sổ cập nhật trực tiếp, mở nhanh hơn, giao diện sinh động",
    summary: "Ai ghi điểm, các máy khác thấy ngay sau vài giây — không cần tải lại. Thêm / xoá mượt mà, có thẻ tổng quan tuần và avatar từng bạn.",
    items: [
      { type: "new", title: "Cập nhật trực tiếp",
        text: "Khi lớp trưởng hoặc tổ trưởng ghi / xoá điểm, máy của cô <b>tự hiện thay đổi sau vài giây</b>, kèm thông báo nhỏ \"Lớp trưởng vừa ghi…\" ở trên cùng. Nhãn <b>● Trực tiếp</b> màu xanh nghĩa là sổ đang đồng bộ. Trang phụ huynh cũng tự cập nhật.",
        img: "updates/v3.2/truc-tiep.jpg" },
      { type: "new", title: "Thẻ tổng quan tuần",
        text: "Đầu trang Ghi điểm có cô Thảo chào, 4 ô: <b>Lượt trừ · Lượt khen · Cần nhắc nhở · Đạt Tốt</b>. Bấm vào một ô để <b>lọc nhanh</b> các bạn tương ứng; dải \"Vừa cập nhật\" cho biết ai vừa ghi gì.",
        img: "updates/v3.2/tong-quan.jpg" },
      { type: "imp", title: "Thêm / xoá mượt, mở sổ nhanh hơn",
        text: "Mục vừa ghi trượt vào, mục xoá thu gọn lại, điểm thay đổi sẽ nảy lên để dễ nhận ra. Máy chủ đọc Google Sheet ít hơn nên đăng nhập và lưu nhanh hơn; mở lại sổ hiện ngay từ dữ liệu đã lưu trên máy." }
    ]
  },
  {
    id: "2026-10-09-v3.1", version: "3.1", date: "2026-10-09",
    title: "Ảnh bằng chứng, hướng dẫn từng bước và cô Thảo chibi",
    summary: "Đính kèm ảnh chụp / tài liệu cho mỗi lần khen hoặc trừ điểm, hướng dẫn tận tay theo từng vai trò, giao diện sạch hơn và cô Thảo chibi đồng hành.",
    items: [
      { type: "new", title: "Ảnh / tài liệu bằng chứng",
        text: "Khi ghi điểm, ở bước diễn giải bấm <b>Chụp ảnh</b> hoặc <b>Chọn ảnh / tài liệu</b> (biên bản, giấy khen, PDF…). Sau này bấm biểu tượng 📎 cạnh ghi nhận để xem lại hoặc thêm. File lưu trong thư mục Drive riêng của lớp — chỉ GVCN và cán bộ lớp xem được.",
        img: "updates/v3.1/bang-chung.jpg" },
      { type: "new", title: "Hướng dẫn từng bước theo vai trò",
        text: "Lần đầu đăng nhập, cô Thảo chibi chỉ tận tay từng nút: GVCN 11 bước, cán bộ lớp 9 bước, phụ huynh 9 bước. Xem lại bất cứ lúc nào ở nút <b>?</b> ▸ <b>Hướng dẫn từng bước</b>, kèm file PDF hướng dẫn cho từng vai trò.",
        img: "updates/v3.1/huong-dan.jpg" },
      { type: "new", title: "Cô Thảo chibi đồng hành",
        text: "Cô vui khi học sinh được khen, buồn khi trừ điểm, nghiêm khi tái phạm lần 2 và \"giận\" khi vi phạm nhiều lần. Cô có 10 vai (chủ nhiệm, lên lớp, áo dài, Tết, STEM, Trung thu…) tự đổi theo chủ đề; trang phụ huynh cô chào \"các bác\", gọi \"các con\". Đổi vai hoặc tắt ở <b>Giao diện ▸ Nhân vật cô giáo</b>.",
        img: "updates/v3.1/co-giao.jpg" },
      { type: "imp", title: "Giao diện sạch, gọn hơn",
        text: "Thanh trên cùng và các khung chi tiết chuyển sang nền trắng, chữ rõ; trên điện thoại bỏ bớt nút để màn hình thoáng hơn." }
    ]
  },
  {
    id: "2026-10-09-v3.0", version: "3.0", date: "2026-10-09",
    title: "Sổ hạnh kiểm phiên bản mới",
    summary: "Đăng nhập bằng email, ghi điểm không phải chờ, tra cứu học sinh trong 1 giây, đổi màu và hình nền theo ý thích, trang riêng cho phụ huynh.",
    items: [
      { type: "new", title: "Đăng nhập bằng email + mã 6 số",
        text: "Nhập email đã đăng ký với GVCN → nhận mã 6 số qua email → nhập mã là vào sổ. Không còn mật khẩu chung, không ai vào được dưới tên người khác. Máy được ghi nhớ 30 ngày.",
        img: "updates/v3.0/dang-nhap.jpg" },
      { type: "imp", title: "Ghi điểm không phải chờ",
        text: "Chạm lý do là điểm hiện ngay. Chip nhỏ dưới màn hình báo <b>Đang lưu… → Đã lưu vào sổ</b>. Mạng yếu thì app tự gửi lại, không bao giờ ghi trùng.",
        img: "updates/v3.0/ghi-diem.jpg" },
      { type: "new", title: "Tra cứu nhanh & hồ sơ học sinh",
        text: "Bấm kính lúp (hoặc phím <b>/</b>) → gõ tên, không cần dấu → mở hồ sơ cả năm: điểm từng tuần, từng tháng, học kỳ, vi phạm, nhận xét GVCN. Có nút In / PDF và Tải Excel.",
        img: "updates/v3.0/tra-cuu.jpg" },
      { type: "new", title: "Đổi giao diện: 18 chủ đề",
        text: "Bấm biểu tượng bảng màu trên đầu trang → chọn chủ đề (Mận chín, Chàm màu nước, Vở ô ly, Hoa phượng, Hồ Gươm…). GVCN đặt được chủ đề mặc định cho cả lớp.",
        img: "updates/v3.0/giao-dien.jpg" },
      { type: "new", title: "Trang riêng cho phụ huynh",
        text: "Màn đăng nhập → <b>Phụ huynh xem sổ</b>. Tìm tên con, xem xếp loại theo tháng / học kỳ / cả năm, từng lỗi và lần được cộng, tải PDF hoặc Excel. Chỉ xem, không sửa được.",
        img: "updates/v3.0/phu-huynh.jpg" },
      { type: "imp", title: "Mở sổ nhanh hơn, gọn hơn trên điện thoại",
        text: "Sổ lưu dữ liệu cả năm trên máy nên mở là thấy ngay, Thống kê và Lịch sử không còn phải chờ tải. Trên điện thoại mỗi màn hình hiện nhiều học sinh hơn." }
    ]
  }
];
