/* Kịch bản các cảnh quay app (dữ liệu giả). Mỗi cảnh: {name, title, as, mobile, url, ready, run(A)}.
   A.cap(chữ chính, chữ phụ) = chú thích bên phải video; A.click / A.type / A.move / A.scroll = thao tác có con trỏ. */
const W = ms => new Promise(r => setTimeout(r, ms));
const closePanels = A => A.ev(() => { try { closePanel(); } catch (_) {} });

module.exports = [
  { name: 'c1_dangnhap', title: 'Đăng nhập', mobile: true,
    ready: async p => { await p.waitForSelector('#lgEm'); await W(1200); },
    async run(A) {
      await A.cap('Mở đường link của lớp trên điện thoại hoặc máy tính.', 'Màn đăng nhập có logo trường, tên lớp, năm học.');
      await A.cap('Nhập email đã được giáo viên chủ nhiệm cấp quyền.', 'Không cần nhớ mật khẩu.');
      await A.type('#lgEm', 'loptruong@example.com', 60);
      await A.click('#lgGo', 1200);
      await A.cap('Hệ thống gửi mã 6 số về email.', 'Nhập mã là vào sổ.');
      await A.type('#lgCode', '123456', 160);
      await A.p.waitForSelector('#app.on', { timeout: 15000 }); await W(1800);
      await A.ev(() => { const c = document.querySelector('#updOk'); c && c.click(); }); await W(600);
      await A.cap('Vào thẳng màn Ghi điểm của tuần hiện tại.', 'Mỗi người chỉ thấy đúng phần việc của mình.');
    } },

  { name: 'c2_ghidiem', title: 'Cán bộ lớp · Ghi điểm', as: 'lt', mobile: true,
    async run(A) {
      await A.ev(() => { S.thang = 10; S.tuan = 3; renderAll(); window.scrollTo(0, 0); }); await W(600);
      await A.cap('Lớp trưởng, tổ trưởng ghi điểm ngay tại lớp.', 'Thẻ tổng quan: lượt trừ, lượt khen, bạn cần nhắc nhở trong tháng.');
      await A.scroll(420);
      await A.cap('Chạm vào tên một bạn để ghi điểm.', 'Số bên phải là điểm tuần, nhãn nhỏ là xếp loại tháng.');
      await A.click('#listGhi .row:nth-of-type(3)', 900);
      await A.cap('Chọn lỗi vi phạm hoặc nội dung được khen.', 'Danh mục điểm cộng – trừ do giáo viên chủ nhiệm đặt.');
      await A.click('#pBody [data-add="T01"]', 1000);
      if (await A.p.isVisible('#pBody [data-tp="nhan"]')) {
        await A.cap('App tự nhận ra lỗi tái phạm trong tháng.', 'Gợi ý mức trừ theo quy định của trường; người ghi chọn lại được.');
        await A.click('#pBody [data-tp="nhan"]', 1000);
      }
      await A.p.waitForSelector('#gcSkip', { timeout: 5000 }).catch(() => {});
      await A.cap('Thêm ghi chú hoặc ảnh bằng chứng nếu cần.', 'Có thể chọn ngày xảy ra để ghi lùi.');
      if (await A.p.isVisible('#gcSkip')) await A.click('#gcSkip', 900);
      await A.cap('Lưu ngay lập tức, không phải chờ.', 'Mạng yếu thì app tự gửi lại; các máy khác thấy ngay sau vài giây.', 4600);
      await A.hold(); await closePanels(A); await W(700);
      await A.cap('Cả lớp cùng một sổ, cập nhật trực tiếp.', 'Giáo viên chủ nhiệm, cán bộ lớp, phụ huynh xem cùng một dữ liệu.');
    } },

  { name: 'c3_tongquan', title: 'Giáo viên chủ nhiệm · Tổng quan', as: 'gvcn',
    async run(A) {
      await A.ev(() => { S.thang = 10; S.tuan = 3; renderAll(); window.scrollTo(0, 0); }); await W(800);
      await A.cap('Trên máy tính, cô chủ nhiệm thấy ngay tình hình cả lớp.', 'Lượt trừ, lượt khen, số bạn cần nhắc nhở, tỉ lệ đạt loại Tốt trong tháng.');
      await A.move('#v32h .tl[data-f=bad]');
      await A.cap('Mọi con số đều bấm được để xem chi tiết.', 'Ví dụ: bấm Lượt trừ điểm.');
      await A.click('#v32h .tl[data-f=bad]', 1300);
      await A.cap('Xem theo học sinh, theo nội dung lỗi, theo tổ.', 'Biểu đồ lượt trừ – cộng theo tuần.');
      if (await A.p.locator('#dr46 [data-tb]:has-text("Theo nội dung")').count()) await A.click('#dr46 [data-tb]:has-text("Theo nội dung")', 1200);
      await A.hold(); await A.ev(() => { const x = document.querySelector('#dr46 .x, #dr46 [data-x]'); if (x) x.click(); else document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); }); await W(700);
      await A.move('#tk39');
      await A.cap('Dải "Điểm tuần" lần lượt hiện các lượt vừa ghi.', 'Bấm một lượt để xem hồ sơ, sửa hoặc nhận xét.', 5200);
    } },

  { name: 'c4_hanhkiem', title: 'Giáo viên chủ nhiệm · Cập nhật hạnh kiểm', as: 'gvcn',
    async run(A) {
      await A.click('#railNav [data-v="bang"]', 1100);
      await A.cap('Xếp loại hạnh kiểm theo tháng và theo học kỳ.', 'Tự tính từ điểm cộng – trừ hằng tuần.');
      await A.scroll(380);
      await A.cap('Thẻ từng học sinh: điểm từng tuần, điểm trung bình, các lần ghi nhận.', 'Rê chuột vào ô điểm để xem điểm đến từ việc gì.');
      await A.scroll(-380, 600);
      await A.click('#vBang [data-hv="bang"]', 1100);
      await A.cap('Bảng tổng hợp cả lớp trên một màn hình.', 'Dấu ✓ là xếp loại cô đã xác nhận.');
      await A.click('#vBang [data-hk="hk"]', 1400);
      await A.cap('Chuyển sang Học kỳ: điểm từng tháng và trung bình cả kỳ.', 'Không cần cộng điểm thủ công cuối kỳ.', 4600);
    } },

  { name: 'c5_hoso', title: 'Giáo viên chủ nhiệm · Hồ sơ học sinh', as: 'gvcn',
    async run(A) {
      await A.cap('Tra cứu nhanh một học sinh bằng nút kính lúp hoặc phím /.', '');
      await A.click('#hFind', 600); await A.p.keyboard.type('khoa', { delay: 120 }); await W(900);
      await A.p.keyboard.press('Enter'); await W(1400);
      await A.cap('Hồ sơ cả năm: tháng, học kỳ, xếp loại, các lần vi phạm và được khen.', 'Tải PDF hoặc Excel riêng cho từng em.', 5200);
      await A.scroll(360);
      await A.cap('Cô viết nhận xét và xác nhận xếp loại cuối tháng.', 'Phụ huynh nhận được nhận xét này.', 4600);
      await A.hold(); await closePanels(A); await W(500);
    } },

  { name: 'c6_thongke', title: 'Giáo viên chủ nhiệm · Thống kê', as: 'gvcn',
    async run(A) {
      await A.click('#railNav [data-v="tk"]', 1300);
      await A.cap('Thống kê theo tháng, học kỳ, cả năm.', 'Phân bố xếp loại, thi đua giữa các tổ.');
      await A.scroll(560, 1200);
      await A.cap('Lỗi vi phạm nhiều nhất, hoạt động được tuyên dương.', 'Biểu đồ theo nhóm, bản đồ lỗi theo tổ, diễn biến qua các tuần.', 5200);
      await A.scroll(600, 1200);
      await A.cap('Cô Thảo nhận xét ngắn để cô chủ nhiệm nắm nhanh.', '');
    } },

  { name: 'c7_baocao', title: 'Giáo viên chủ nhiệm · Báo cáo', as: 'gvcn',
    async run(A) {
      await A.click('#railNav [data-v="bc"]', 1800);
      await A.cap('Báo cáo hạnh kiểm tháng, học kỳ, cả năm — soạn sẵn.', 'So sánh với kỳ trước: tăng, giảm bao nhiêu.');
      await A.scroll(700, 1300);
      await A.cap('Nhận xét chung và phương hướng được viết tự động từ số liệu.', 'Cô sửa lại theo ý mình rồi lưu.', 5000);
      await A.scroll(-700, 900);
      await A.move('#bcPrint');
      await A.cap('Tải PDF để in, Tải Excel, hoặc Tóm tắt gửi nhóm phụ huynh.', 'Bản tóm tắt không nêu tên học sinh vi phạm.', 5000);
      await A.move('[data-lk2], .lkb [data-lk]').catch(() => {});
      await A.cap('Xong tháng: Khoá sổ để không ai sửa được nữa.', 'Chỉ giáo viên chủ nhiệm mở khoá lại.');
    } },

  { name: 'c8_phuhuynh', title: 'Phụ huynh', mobile: true, url: 'phu-huynh.html',
    ready: async p => { await p.waitForSelector('#lst .st', { timeout: 15000 }); await W(1500); },
    async run(A) {
      await A.cap('Phụ huynh mở trang riêng, không cần đăng nhập.', 'Chỉ xem và tải về, không sửa được.');
      await A.type('#q', 'khoa', 140); await W(600);
      await A.click('#lst .st', 1500);
      await A.cap('Hồ sơ của con: xếp loại tháng, học kỳ, cả năm.', 'Có nhận xét của giáo viên chủ nhiệm.');
      await A.scroll(500, 1200);
      await A.cap('Từng lần vi phạm, được khen: ngày nào, nội dung gì.', 'Tải PDF báo cáo của con về điện thoại.', 5000);
      await A.scroll(500, 1200);
      await A.cap('Đăng ký email để nhận thông báo ngay khi có ghi nhận mới.', 'Lời nhắn nhẹ nhàng, ghi nhận cố gắng trước.', 4600);
    } }
];
