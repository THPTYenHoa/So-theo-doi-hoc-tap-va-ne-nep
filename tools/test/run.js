/* Kiểm thử v3.0 — chạy: python3 -m http.server 8768 (thư mục repo) rồi NODE_PATH=$(npm root -g) node tools/test/run.js */
const { chromium } = require('playwright'); const { newPage } = require('./mock');
const U = 'http://127.0.0.1:8768/index.html', PH = 'http://127.0.0.1:8768/phu-huynh.html';
let fail = 0; const ok = (c, m) => { console.log((c ? '✅ ' : '❌ ') + m); if (!c) fail++; };
const W = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(); const errs = [];
  const P = async o => { const p = await newPage(b, o); p.on('pageerror', e => errs.push(e.message)); return p; };

  // 1. đăng nhập email + mã
  let p = await P({});
  await p.goto(U); await W(600);
  ok(await p.isVisible('#lgEm'), 'màn đăng nhập: ô email (không còn chọn tên / mật khẩu)');
  ok(!(await p.isVisible('#lgPin')) && !p.M.CALLS.some(c => c.a === 'roster'), 'không gọi danh sách thành viên, không ô mật khẩu');
  ok(await p.isVisible('a.lgph[href="phu-huynh.html"]'), 'có lối vào trang phụ huynh');
  await p.fill('#lgEm', 'la@example.com'); await p.click('#lgGo'); await W(300);
  ok(/chưa được cấp quyền/.test(await p.textContent('#lgErr3')), 'email lạ ⇒ báo chưa được cấp quyền');
  await p.fill('#lgEm', 'TOTRUONG2@example.com'); await p.click('#lgGo'); await p.waitForSelector('#lgCode');
  ok(/Trần Hải Bình/.test(await p.textContent('.lgcard h3')), 'chào đúng tên người nhận mã');
  await p.fill('#lgCode', '111111'); await W(400);
  ok(/chưa đúng/.test(await p.textContent('#lgErr3')), 'mã sai ⇒ báo lỗi');
  await p.fill('#lgCode', '123456'); await W(1200);
  ok(await p.isVisible('#app.on'), 'mã đúng ⇒ vào sổ');
  ok(/Cán bộ lớp/.test(await p.textContent('#rlRole')), 'vai trò lấy từ tài khoản (tổ trưởng ⇒ Cán bộ lớp)');
  ok(await p.isVisible('#hkupd.on'), 'hiện thông báo cập nhật v3.0');
  await p.click('#updOk');
  await p.context().close();

  // 2. ghi điểm không chờ (máy chủ chậm 2,5 s)
  p = await P({ as: 'lt', lag: 2500 }); await p.goto(U); await p.waitForSelector('#app.on', { timeout: 15000 }); await W(3500);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); });
  const n0 = p.M.D.entries.length;
  await p.locator('#listGhi .row').nth(3).click(); await W(300);
  await p.click('#pBody [data-add="T02"]'); await W(200);
  const t = await p.evaluate(() => { const a = performance.now(); document.querySelector('#gcSkip').click(); return performance.now() - a; });
  await W(150);
  const shown = await p.evaluate(() => S.entries.some(e => /^tmp-/.test(e[0])));
  ok(shown && t < 200, 'ghi điểm: hiện ngay (' + Math.round(t) + ' ms), không chờ máy chủ');
  ok(/Đang lưu/.test(await p.textContent('#hkq')), 'chip "Đang lưu…"');
  await W(4500);
  ok(p.M.D.entries.length === n0 + 1, 'máy chủ (giả lập) nhận đúng 1 dòng');
  ok(await p.evaluate(() => !S.entries.some(e => /^tmp-/.test(e[0]))), 'số tạm đã đổi sang số thật');
  const add = p.M.CALLS.find(c => c.a === 'addEntries'); ok(add && add.p.rid, 'lệnh ghi có mã chống trùng rid');
  await p.context().close();

  // 3. mất phản hồi ⇒ gửi lại cùng rid, không trùng
  p = await P({ as: 'lt', drop: { addEntries: 1 } }); await p.goto(U); await p.waitForSelector('#app.on'); await W(1500);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); });
  const n1 = p.M.D.entries.length;
  await p.locator('#listGhi .row').nth(2).click(); await W(200); await p.click('#pBody [data-add="T04"]'); await W(200); await p.click('#gcSkip'); await W(5000);
  ok(p.M.D.entries.length === n1 + 1, 'mạng rớt giữa chừng ⇒ tự gửi lại, không ghi trùng');
  ok(p.M.CALLS.filter(c => c.a === 'addEntries').length >= 2, 'đã tự thử lại');
  await p.context().close();

  // 4. lỗi thật ⇒ trả lại như cũ + chip đỏ
  p = await P({ as: 'lt', failWrite: true }); await p.goto(U); await p.waitForSelector('#app.on'); await W(1500);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); });
  await p.locator('#listGhi .row').nth(1).click(); await W(200); await p.click('#pBody [data-add="T01"]'); await W(200); await p.evaluate(() => { const b = document.querySelector('#pBody .btn.ghost, #pBody button'); }); if (await p.isVisible('#gcSkip')) await p.click('#gcSkip'); else { const o = await p.$('#pBody button'); o && await o.click(); await W(200); if (await p.isVisible('#gcSkip')) await p.click('#gcSkip'); } await W(1500);
  ok(await p.isVisible('#hkq.err'), 'lỗi ghi ⇒ chip đỏ Thử lại / Bỏ');
  ok(await p.evaluate(() => !S.entries.some(e => /^tmp-/.test(e[0]))), 'dòng chưa lưu được gỡ khỏi màn hình');
  await p.context().close();

  // 5. xoá không chờ + mở lại nhanh từ dữ liệu cả năm
  p = await P({ as: 'gvcn' }); await p.goto(U); await p.waitForSelector('#app.on'); await W(4500);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); });
  ok(await p.evaluate(() => S.allLoaded), 'tự tải nền dữ liệu cả năm');
  const id = await p.evaluate(() => S.entries.find(e => e[2] === 10)[0]);
  const nD = p.M.D.entries.length;
  await p.evaluate(id => delEntry(id), id); await W(100);
  ok(await p.evaluate(id => !S.entries.some(e => e[0] === id), id), 'xoá: biến mất ngay');
  await W(1500); ok(p.M.D.entries.length === nD - 1, 'máy chủ đã xoá');
  await p.route(/script\.google\.com/, async r => { await W(5000); r.fallback(); });
  const t0 = Date.now(); await p.reload(); await p.waitForSelector('#app.on'); const dt = Date.now() - t0;
  ok(dt < 2500, 'mở lại sổ: hiện ngay từ dữ liệu lưu (' + dt + ' ms, máy chủ chậm 5 s)');
  await p.evaluate(() => go('tk')); await W(300);
  ok(!(await p.textContent('#vTK')).includes('Đang tải dữ liệu cả năm'), 'Thống kê mở ngay, không chờ tải cả năm');
  await p.context().close();

  // 6. tra cứu nhanh + hồ sơ
  p = await P({ as: 'gvcn' }); await p.goto(U); await p.waitForSelector('#app.on'); await W(3500);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); });
  await p.keyboard.press('/'); await W(200);
  ok(await p.isVisible('#hkfind.on'), 'phím / mở Tra cứu');
  await p.keyboard.type('khoa'); await W(200);
  ok(await p.locator('#fls .it').count() >= 1, 'gõ không dấu vẫn tìm được');
  await p.keyboard.press('Enter'); await W(600);
  ok(await p.isVisible('#panel.on') && /hồ sơ học sinh/.test(await p.textContent('#pSub')), 'Enter ⇒ mở hồ sơ học sinh');
  await p.click('#pBody [data-pk="hk1"]'); await W(300);
  ok(/Học kỳ 1/.test(await p.textContent('#pBody .pf-res')), 'hồ sơ: đổi sang Học kỳ 1');
  await p.context().close();

  // 7. chủ đề
  p = await P({ as: 'gvcn' }); await p.goto(U); await p.waitForSelector('#app.on'); await W(1500);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); });
  await p.click('#hTheme'); await W(200);
  ok(await p.locator('#pBody .thc').count() >= 15, 'bảng chọn có ' + await p.locator('#pBody .thc').count() + ' chủ đề');
  await p.click('#pBody [data-th="man-chin"]'); await W(200);
  ok(await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--teal').trim().toUpperCase() === '#A3264B'), 'đổi sang Mận chín ngay');
  await p.click('#thClass'); await W(500);
  ok(p.M.CALLS.some(c => c.a === 'saveTheme' && c.p.theme === 'man-chin'), 'GVCN đặt chủ đề mặc định cho lớp');
  await p.reload(); await p.waitForSelector('#app.on'); await W(500);
  ok(await p.evaluate(() => THEME.cur().id === 'man-chin'), 'tải lại vẫn giữ chủ đề');
  await p.context().close();

  // 8. điện thoại
  p = await P({ as: 'tt', mobile: true }); await p.goto(U); await p.waitForSelector('#app.on'); await W(1500);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); });
  ok(await p.evaluate(() => document.documentElement.scrollWidth) <= 390, 'điện thoại: không cuộn ngang');
  const rows = await p.evaluate(() => { const r = [...document.querySelectorAll('#listGhi .row')].filter(x => x.getBoundingClientRect().top < innerHeight); return r.length; });
  ok(rows >= 6, 'điện thoại: thấy ' + rows + ' học sinh trên một màn hình');
  await p.context().close();

  // 10. bằng chứng: chọn ảnh khi ghi điểm ⇒ gửi sau lệnh ghi
  p = await P({ as: 'lt' }); await p.goto(U); await p.waitForSelector('#app.on'); await W(1500);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); });
  await p.locator('#listGhi .row').nth(5).click(); await W(200); await p.click('#pBody [data-add="T06"]'); await W(250);
  if (!(await p.isVisible('#gcSkip'))) { const o = await p.$('#pBody .item, #pBody button.btn'); if (o) await o.click(); await W(250); }
  ok(await p.isVisible('#evFile'), 'bước diễn giải có nút Chọn ảnh / tài liệu');
  const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.click('#evFile')]);
  await fc.setFiles({ name: 'bien-ban.png', mimeType: 'image/png', buffer: Buffer.from(require('./mock').TINY, 'base64') }); await W(400);
  ok(await p.locator('#evThumbs .evt').count() === 1, 'hiện ảnh xem trước');
  await p.click('#gcSave'); await W(2500);
  const evc = p.M.CALLS.filter(c => c.a === 'addEvidence'), addc = p.M.CALLS.filter(c => c.a === 'addEntries');
  ok(evc.length === 1 && /^E/.test(evc[0].p.entryIds[0]) && p.M.CALLS.indexOf(evc[0]) > p.M.CALLS.indexOf(addc[addc.length - 1]), 'bằng chứng gửi SAU lệnh ghi, gắn đúng số thật');
  ok(evc[0] && evc[0].p.mime === 'image/jpeg', 'ảnh được thu nhỏ sang JPEG trước khi gửi');
  const eid = evc[0] && evc[0].p.entryIds[0];
  await p.evaluate(id => evOpen(id), eid); await W(500);
  ok(await p.locator('#pBody .evcard').count() === 1, 'mở 📎: thấy bằng chứng đã lưu');
  await p.evaluate(() => closePanel()); await W(200);
  ok(await p.locator('#listGhi .evchip').count() >= 1, 'danh sách có biểu tượng 📎 cạnh ghi nhận');
  await p.context().close();

  // 11. hướng dẫn từng bước
  p = await P({ as: 'gvcn', tour: true }); await p.goto(U); await p.waitForSelector('#app.on'); await W(1500);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); }); await W(3500);
  ok(await p.isVisible('#tg-card'), 'GVCN đăng nhập lần đầu ⇒ tự mở hướng dẫn từng bước');
  ok(/GVCN · Bước 1\/9/.test(await p.textContent('#tg-card')), 'hướng dẫn GVCN có 9 bước (bố cục v6.0)');
  for (let i = 0; i < 8; i++) { await p.click('#tg-card [data-a=n]'); await W(350); }
  ok(/Xem lại hướng dẫn/.test(await p.textContent('#tg-card')), 'đi hết đến bước cuối');
  await p.click('#tg-card [data-a=n]'); await W(300);
  ok(!(await p.isVisible('#tg-card')) && await p.evaluate(() => localStorage.getItem('hk_tour_gvcn') === '1'), 'xong ⇒ không tự hiện lại');
  await p.click('#hHelp'); await W(300); await p.click('#gTour'); await W(800);
  ok(await p.isVisible('#tg-card'), 'nút ? ▸ Hướng dẫn từng bước mở lại được');
  await p.context().close();
  p = await P({ as: 'tt', tour: true, mobile: true }); await p.goto(U); await p.waitForSelector('#app.on'); await W(1500);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); }); await W(3500);
  ok(/Cán bộ lớp/.test(await p.textContent('#tg-card')) && /cán bộ lớp/.test(await p.textContent('#tg-card')), 'tổ trưởng: hướng dẫn chung cho cán bộ lớp (điện thoại)');
  await p.context().close();
  p = await P({ tour: true }); await p.goto(PH); await W(2500);
  ok(await p.isVisible('#tg-card') && /Phụ huynh/.test(await p.textContent('#tg-card')), 'trang phụ huynh: hướng dẫn riêng tự mở lần đầu');
  for (let i = 0; i < 5; i++) { await p.click('#tg-card [data-a=n]'); await W(450); }
  ok(await p.isVisible('.res'), 'hướng dẫn phụ huynh tự mở hồ sơ một học sinh để chỉ');
  await p.context().close();

  // 12. v3.2 — đồng bộ trực tiếp + hiệu ứng + thẻ tổng quan
  p = await P({ as: 'gvcn' }); await p.goto(U); await p.waitForSelector('#app.on'); await W(1500);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); });
  await W(300); await p.evaluate(() => go('ghi')); await W(500);   /* v6.0: GVCN mở vào Tổng quan */
  ok(await p.isVisible('#v32h') && await p.locator('#v32h .tl').count() === 4, 'thẻ tổng quan tuần có 4 ô số');
  ok(await p.locator('#listGhi .row .av32').count() >= 30, 'avatar theo tổ cạnh tên học sinh');
  await W(1500); ok(/Trực tiếp/.test(await p.textContent('#v32live')), 'nhãn "Trực tiếp" khi đồng bộ chạy');
  const nSame = p.M.CALLS.filter(c => c.a === 'sync').length; ok(nSame >= 1, 'app hỏi sync định kỳ');
  await p.evaluate(() => { S.thang = 10; S.tuan = 1; renderAll(); }); await W(300);
  const xid = p.M.ext('HS05', 'Đi học muộn', -2);
  const tX = Date.now(); await p.waitForFunction(id => S.entries.some(e => e[0] === id), xid, { timeout: 9000 }).catch(() => {});
  const dtX = Date.now() - tX;
  ok(await p.evaluate(id => S.entries.some(e => e[0] === id), xid), 'người khác ghi ⇒ máy này thấy sau ' + dtX + ' ms (không cần tải lại)');
  await W(200); ok(await p.locator('#v32pop.on').count() === 1 && /Lớp trưởng/.test(await p.textContent('#v32pop')), 'hiện thông báo nhỏ "Lớp trưởng vừa ghi…"');
  ok(await p.locator(`#listGhi .ev.fresh[data-eid="${xid}"]`).count() === 1, 'mục mới trượt vào (hiệu ứng)');
  p.M.extDel(xid); await p.waitForFunction(id => !S.entries.some(e => e[0] === id), xid, { timeout: 9000 }).catch(() => {});
  ok(await p.evaluate(id => !S.entries.some(e => e[0] === id), xid), 'người khác xoá ⇒ máy này tự gỡ');
  const syncN = p.M.CALLS.filter(c => c.a === 'sync').length, entN = p.M.CALLS.filter(c => c.a === 'entries' || c.a === 'bootstrap').length;
  await W(4500); ok(p.M.CALLS.filter(c => c.a === 'sync').length > syncN && p.M.CALLS.filter(c => c.a === 'entries' || c.a === 'bootstrap').length === entN, 'không có gì mới ⇒ chỉ hỏi sync nhẹ, không tải lại dữ liệu');
  await p.click('#v32h [data-f=bad]'); await W(200);
  ok(await p.isVisible('#dr46') && /Lượt trừ/.test(await p.textContent('#dr46 h3')), 'v4.6: bấm ô "Lượt trừ điểm" ⇒ mở màn chi tiết');
  await p.click('#dr46 [data-flt]'); await W(200);
  const nb = await p.locator('#listGhi .row').count(); ok(nb > 0 && nb < 40 && await p.isVisible('#v32clr'), 'bấm ô "Lượt trừ điểm" ⇒ lọc ' + nb + ' bạn');
  await p.click('#v32clr'); await W(200); ok(await p.locator('#listGhi .row').count() === 40, 'bỏ lọc ⇒ đủ cả lớp');
  const did = await p.evaluate(() => { const e = document.querySelector('#listGhi .ev[data-eid]'); return e && e.dataset.eid; });
  await p.evaluate(id => { delEntry(id); }, did); await W(80);
  ok(await p.locator(`#listGhi .ev.out[data-eid="${did}"]`).count() === 1, 'xoá: mục thu gọn mượt trước khi biến mất');
  await W(400); ok(await p.evaluate(id => !S.entries.some(e => e[0] === id), did), 'xoá xong');
  await p.context().close();
  p = await P({ as: 'gvcn', oldBackend: true }); await p.goto(U); await p.waitForSelector('#app.on'); await W(2500);
  ok(/1 phút/.test(await p.textContent('#v32live')), 'backend cũ (chưa có sync) ⇒ tự quay về cập nhật 1 phút, không lỗi');
  await p.context().close();

  // 13. v3.3 — báo cáo
  p = await P({ as: 'gvcn' }); await p.goto(U); await p.waitForSelector('#app.on'); await W(1200);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); });
  await p.click('#railNav [data-v=bc]'); await W(1200);
  ok(await p.isVisible('#vBC .bchead') && /Tháng 10\/2026/.test(await p.textContent('#vBC .bchead')), 'menu Báo cáo: báo cáo tháng đang chọn');
  ok(/so kỳ trước/.test(await p.textContent('#vBC .kpis')), 'có so sánh với tháng trước');
  ok(await p.locator('#vBC .bct tr').count() >= 5 && /Nhất/.test(await p.textContent('#vBC')), 'bảng thi đua tổ có xếp hạng');
  ok(/Trong tháng 10\/2026, lớp/.test(await p.inputValue('#bcNx')), 'nhận xét chung tự soạn từ số liệu');
  await p.fill('#bcPh', 'Phương hướng cô tự viết'); await p.evaluate(() => { document.activeElement.blur(); renderAll(); });
  ok(await p.inputValue('#bcPh') === 'Phương hướng cô tự viết', 'nội dung cô sửa được giữ lại');
  await p.evaluate(() => { const o = RPT.open; RPT.open = (h, t) => o(h, t, { dry: true }); }); await p.click('#bcPrint'); await W(200);
  const pr = await p.evaluate(() => RPT.last || '');
  ok(!/CỘNG HÒA XÃ HỘI CHỦ NGHĨA/.test(pr) && /Phương hướng cô tự viết/.test(pr) && /chủ nhiệm/i.test(pr), 'bản in (v3.7 khổ ngang): không quốc hiệu, có nội dung cô sửa, chữ ký GVCN');
  for (const k of ['tuan', 'hk', 'nam']) { await p.click(`#vBC [data-bk=${k}]`); await W(250); }
  ok(/Cả năm học/.test(await p.textContent('#vBC .bchead')), 'đổi kỳ: tuần / học kỳ / cả năm');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#bcXls')]);
  ok(/Bao_cao_hanh_kiem_nam/.test(dl.suggestedFilename()), 'tải Excel báo cáo');
  await p.context().close();
  p = await P({ as: 'tt', mobile: true }); await p.goto(U); await p.waitForSelector('#app.on'); await W(1200);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); });
  await p.click('#tabbar [data-g=bc]'); await W(600); await p.click('#v6sub [data-v6=bc]'); await W(1200);   /* v6.0: nhóm Báo cáo ▸ Thi đua */
  ok(await p.evaluate(() => document.querySelector('#bcNx').readOnly), 'tổ trưởng xem được báo cáo, không sửa lời nhận xét');
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1 && [...document.querySelectorAll('#vBC .panelbox')].every(e => e.getBoundingClientRect().right <= innerWidth + 1)), 'điện thoại: báo cáo không tràn ngang');
  await p.context().close();

  // 14. v3.4 — quản lý lớp & phân quyền
  p = await P({ as: 'gvcn' }); p.on('dialog', d => d.accept()); await p.goto(U); await p.waitForSelector('#app.on'); await W(1200);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); go('cai'); }); await W(500);
  await p.click('[data-ct="quyen"]'); await W(200); const q1 = await p.isVisible('#qTbl') && await p.isVisible('#accAdd'); await p.click('[data-ct="lop"]'); await W(200);
  ok(q1 && await p.isVisible('#hsTo') && await p.isVisible('.cai39 .ctabs'), 'GVCN: thấy bảng phân quyền, tài khoản, đổi tổ, danh sách lớp');
  await p.click('[data-ct="quyen"]'); await W(200); await p.click('#accAdd'); await W(300); await p.fill('#aEm', 'totruong3@example.com'); await p.fill('#aTen', 'Cán bộ 3'); await p.selectOption('#aRole', 'Cán bộ lớp'); await p.selectOption('#aTo', '3');
  await p.click('#aSave'); await W(500);
  const sa = p.M.CALLS.filter(c => c.a === 'saveAccounts').pop();
  ok(sa && sa.p.accounts.some(a => a.email === 'totruong3@example.com' && a.role === 'Cán bộ lớp'), 'GVCN cấp quyền cho email mới (vai Cán bộ lớp)');
  await p.click('[data-ct="lop"]'); await W(200); await p.click('#hsTo'); await W(300); for (const i of [0, 1]) { await p.locator('#pBody [data-p]').nth(i).click(); await W(150); }
  await p.selectOption('#btTo', '4'); await p.click('#btSave'); await W(500);
  ok(p.M.D.students.filter(s => s.to === '4').length === 12, 'đổi tổ hàng loạt: 2 bạn sang tổ 4');
  const ma0 = await p.evaluate(() => S.students[5].ma);
  await p.evaluate(ma => openStudentForm(ma), ma0); await W(300);
  ok(await p.isVisible('#fNghi'), 'có nút "Đánh dấu nghỉ học / chuyển lớp" (giữ lịch sử)');
  await p.click('#fDel'); await W(600);
  ok(!p.M.D.students.some(s => s.ma === ma0), 'GVCN xoá được học sinh');
  await p.context().close();
  p = await P({ as: 'lt' }); await p.goto(U); await p.waitForSelector('#app.on'); await W(1000);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); go('cai'); }); await W(500);
  ok(!(await p.isVisible('#accAdd')) && !(await p.isVisible('#hsTo')) && /Quyền của bạn/.test(await p.textContent('#vCai')), 'lớp trưởng: không có tài khoản / đổi tổ / xoá học sinh, thấy "Quyền của bạn"');
  await p.context().close();

  // 15. v3.5 — màn chờ cô Thảo chạy
  p = await P({ as: 'tt', mobile: true, lag: 5000 }); await p.addInitScript(() => { try { localStorage.setItem('hk_last_role', 'Tổ trưởng'); } catch (_) {} });
  await p.goto(U); await W(2500);
  ok(await p.isVisible('#loader .mld-run') && /các con chờ chút nha/.test(await p.textContent('#loader')), 'màn chờ: cô Thảo chạy + "Mạng lag xíu, các con chờ chút nha…"');
  const pc = await p.evaluate(() => parseFloat(document.querySelector('#loader .mld-pct').textContent)); ok(pc > 20 && pc < 100, 'thanh tiến trình đang chạy (' + pc + '%)');
  await p.waitForSelector('#app.on', { timeout: 15000 }); ok(!(await p.isVisible('#loader')), 'mở sổ xong ⇒ màn chờ tắt');
  await p.context().close();
  p = await P({ mobile: true, lag: 5000 }); await p.goto(PH); await W(2500);
  ok(/Các bác chờ chút ạ/.test(await p.textContent('#main')) && await p.isVisible('.mld-run'), 'trang phụ huynh: "Các bác chờ chút ạ…"');
  await p.context().close();

  // 16. v3.7 — chốt tháng, báo cáo ngang, email phụ huynh
  const fs = require('fs'), path = require('path'), OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
  const dry = pg => pg.evaluate(() => { const o = RPT.open; RPT.open = (h, t) => o(h, t, { dry: true }); });
  const pdf = async (doc, name) => { const f = path.join(OUT, name + '.html'); fs.writeFileSync(f, doc.replace(/<base href="[^"]*">/, '<base href="http://127.0.0.1:8768/">'));
    const q = await b.newPage(); await q.goto('file://' + f); await q.waitForLoadState('networkidle'); await W(400);
    await q.pdf({ path: path.join(OUT, name + '.pdf'), width: '297mm', height: '210mm', printBackground: true });
    const n = await q.evaluate(() => document.querySelectorAll('.pg').length);
    const over = await q.evaluate(() => [...document.querySelectorAll('.pg')].filter(g => g.scrollHeight > g.clientHeight + 2).length);
    await q.setViewportSize({ width: 1123, height: 794 }); await q.screenshot({ path: path.join(OUT, name + '.png'), fullPage: true }); await q.close(); return { n, over }; };
  p = await P({ as: 'gvcn' }); p.on('dialog', d => d.accept()); await p.goto(U); await p.waitForSelector('#app.on'); await W(1200);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); go('bang'); }); await W(600);
  ok(await p.isVisible('#vBang .lkb.go [data-lk="1"]'), 'GVCN: thanh "Khoá sổ tháng 10" ở Bảng tổng hợp');
  await p.click('#vBang [data-lk="1"]'); await W(700);
  ok(p.M.khoa[10] && await p.isVisible('#vBang .lkb:not(.go)') && /đã khoá sổ/.test(await p.textContent('#vBang .lkb')), 'chốt tháng ⇒ máy chủ lưu + dải "đã chốt hạnh kiểm"');
  const id10 = await p.evaluate(() => S.entries.find(e => e[E_THANG] === 10)[E_ID]);
  const nE = p.M.D.entries.length;
  await p.evaluate(id => delEntry(id), id10); await W(500);
  ok(p.M.D.entries.length === nE && !p.M.CALLS.some(c => c.a === 'deleteEntry'), 'tháng đã chốt: không xoá được ghi nhận (chặn ngay trên máy)');
  await p.evaluate(() => { go('ghi'); }); await W(400);
  ok(await p.isVisible('#vGhi .lkb'), 'màn Ghi điểm báo tháng đã chốt');
  await p.evaluate(() => addEntry && addEntry()); await W(300);
  ok(!p.M.CALLS.some(c => c.a === 'addEntries'), 'tháng đã chốt: không thêm được điểm');
  await p.evaluate(() => go('bang')); await W(400); await p.click('#vBang [data-lk="0"]'); await W(700);
  ok(!p.M.khoa[10], 'GVCN mở khoá được tháng');
  // báo cáo
  await p.evaluate(() => go('bc')); await W(700);
  ok(await p.isVisible('#vBC .bccmp') && await p.isVisible('#vBC .totop'), 'Báo cáo: thẻ so sánh kỳ trước + tổ dẫn đầu / cố lên');
  ok(await p.locator('#vBC .bccmp img').count() >= 1, 'Báo cáo: có cô Thảo theo kết quả lớp');
  await dry(p); await p.click('#bcPrint'); await W(300);
  let doc = await p.evaluate(() => RPT.last || '');
  ok(doc && !/CỘNG HÒA|Độc lập/i.test(doc) && /landscape/.test(doc) && (doc.match(/<svg|class="cmp"|class="hb"/g) || []).length >= 4 && /mascot\/[a-z-]+\//.test(doc), 'PDF báo cáo lớp: khổ ngang, có biểu đồ + cô Thảo, không quốc hiệu');
  ok(/Tuyên dương/i.test(doc) && /Nhắc nhở/i.test(doc) && /Xếp hạng tổ|thi đua/i.test(doc), 'PDF báo cáo lớp: xếp hạng tổ, tuyên dương, nhắc nhở');
  let r = await pdf(doc, 'bao-cao-lop'); ok(r.n >= 4 && r.over === 0, 'PDF lớp ' + r.n + ' trang, không trang nào tràn');
  // hồ sơ học sinh
  await p.evaluate(() => openProfile('HS03')); await W(600);
  await p.click('#pfPr'); await W(300); doc = await p.evaluate(() => RPT.last || '');
  ok(/Báo cáo kết quả rèn luyện của học sinh/.test(doc) && /Lỗi thường mắc/.test(doc) && (doc.match(/<svg/g) || []).length >= 2, 'PDF hồ sơ học sinh: biểu đồ, lỗi thường mắc, khen thưởng');
  r = await pdf(doc, 'hoc-sinh'); ok(r.over === 0, 'PDF học sinh ' + r.n + ' trang, không tràn');
  doc = await p.evaluate(() => RPT.open(RPT.student({ cfg: S.cfg, students: S.students, entries: S.entries, remarks: S.remarks }, 'HS03', { k: 'hk', n: 1 }, {}), 'x', { dry: true }));
  r = await pdf(doc, 'hoc-sinh-hk1'); ok(r.over === 0 && /Học kỳ I/.test(doc), 'PDF học sinh theo học kỳ');
  // cài đặt email phụ huynh + duyệt
  p.M.phReg.push({ id: 'R9', ma: 'HS05', ten: 'Hoàng Bảo Hằng', email: 'bo.hs05@example.com', at: '2026-10-08 09:00' });
  await p.evaluate(() => closePanel()); await W(300); await p.evaluate(() => boot(true)); await W(500); await p.evaluate(() => go('ph')); await W(600);
  ok(await p.isVisible('#phOn') && await p.isVisible('#vPH [data-ok="R9"]'), 'trang Phụ huynh: email phụ huynh + danh sách chờ duyệt');
  await p.click('#vPH [data-ok="R9"]'); await W(2500);
  ok(/bo\.hs05@example\.com/.test(p.M.D.students.find(s => s.ma === 'HS05').email) && !(await p.isVisible('#vPH [data-ok="R9"]')), 'GVCN duyệt ⇒ email vào ô Email phụ huynh của học sinh');
  await p.context().close();
  // tổ trưởng không thấy nút chốt; máy chủ cũng chặn
  p = await P({ as: 'tt', khoa: { 10: { by: 'Nguyễn Thu Thảo', at: '2026-10-31 16:00' } } }); await p.goto(U); await p.waitForSelector('#app.on'); await W(1200);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); go('ghi'); }); await W(500);
  ok(await p.isVisible('#vGhi .lkb') && !(await p.isVisible('#vGhi [data-lk]')), 'tổ trưởng: thấy tháng đã chốt, không có nút mở khoá');
  await p.context().close();
  // trang phụ huynh: đăng ký email, link thông báo, PDF
  p = await P({ mobile: true }); await p.goto(PH + '#hs=HS03&tb=E1'); await W(1500);
  const e1 = p.M.D.entries.find(e => e[0] === 'E1');
  p.M.D.entries.forEach(e => { if (e[4] === 'HS03' && !p.M.tb) { p.M.tb = e[0]; } });
  await p.evaluate(t => { location.hash = 'hs=HS03&tb=' + t; }, p.M.tb); await W(700);
  ok(await p.isVisible('.tbc') && await p.isVisible('#tbPdf'), 'phụ huynh mở link email ⇒ thẻ "Thông báo mới từ cô Thảo" + Tải PDF');
  await dry(p); await p.click('#tbPdf'); await W(300); doc = await p.evaluate(() => RPT.last || '');
  ok(/Cô Thảo xin cập nhật cho bác/.test(doc) && /mascot\/[a-z-]+\//.test(doc) && /landscape/.test(doc), 'PDF thông báo phụ huynh: ngang, lời cô Thảo, ảnh cô');
  r = await pdf(doc, 'thong-bao'); ok(r.n === 1 && r.over === 0, 'PDF thông báo: 1 trang, không tràn');
  await p.click('#pdf'); await W(300); doc = await p.evaluate(() => RPT.last || '');
  ok(/Báo cáo kết quả rèn luyện của học sinh/.test(doc) && /Cô Thảo cảm ơn bác|Cô Thảo mong bác/.test(doc), 'phụ huynh: PDF báo cáo của con (lời gửi các bác)');
  await p.fill('#rgE', 'me.hs03@example.com'); await p.click('#rgS'); await W(500);
  ok(await p.isVisible('#rgK'), 'đăng ký email: gửi mã ⇒ hiện ô nhập mã');
  await p.fill('#rgK', '111111'); await p.click('#rgV'); await W(400); ok(/chưa đúng/.test(await p.textContent('#rgM')), 'mã sai ⇒ báo lỗi');
  await p.fill('#rgK', '123456'); await p.click('#rgV'); await W(500);
  ok(/duyệt/.test(await p.textContent('#rgM')) && p.M.phReg.some(x => x.email === 'me.hs03@example.com' && x.ma === 'HS03'), 'mã đúng ⇒ vào danh sách chờ cô Thảo duyệt');
  await p.screenshot({ path: path.join(OUT, 'ph-dangky.png'), fullPage: true });
  await p.context().close();

  // 17. v3.8 — phụ huynh đăng ký ⇒ báo cô Thảo; duyệt ⇒ gửi kèm PDF hướng dẫn
  p = await P({ as: 'gvcn' }); await p.goto(U); await p.waitForSelector('#app.on'); await W(1500);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); }); await W(300);
  p.M.phNew('HS07', 'me.hs07@example.com'); await p.waitForSelector('#phNew', { timeout: 20000 }).catch(() => {});
  ok(await p.isVisible('#phNew') && /HS07|đăng ký/.test(await p.textContent('#phNew')), 'phụ huynh đăng ký ⇒ màn hình cô hiện thẻ "Phụ huynh vừa đăng ký" (không cần tải lại)');
  ok(/1/.test(await p.textContent('#railNav [data-v="ph"] .navbdg').catch(() => '')), 'chấm đỏ số đăng ký chờ duyệt ở menu Phụ huynh');
  await p.screenshot({ path: path.join(OUT, 'ph-new.png') });
  await p.click('#phGo'); await W(900);
  ok(await p.evaluate(() => S.view === 'ph') && await p.isVisible('#vPH [data-ok]'), '"Duyệt ngay" ⇒ mở trang Phụ huynh ▸ đăng ký chờ duyệt');
  const rid = await p.evaluate(() => S.phReg[0].id);
  await p.click(`#vPH [data-ok="${rid}"]`); await W(2500);
  const dc = p.M.CALLS.filter(c => c.a === 'phDuyet');
  ok(dc.length === 2 && !dc[0].p.pdf && dc[1].p.pdf && p.M.pdfLen > 100000, 'duyệt: máy chủ chưa có hướng dẫn ⇒ app tự gửi kèm PDF hướng dẫn phụ huynh');
  ok(!(await p.isVisible('#railNav [data-v="ph"] .navbdg')) && /hướng dẫn/.test(await p.textContent('#toast').catch(() => '')), 'duyệt xong: hết chấm đỏ, báo đã gửi email kèm hướng dẫn');
  p.M.phNew('HS08', 'me.hs08@example.com'); await W(7000); await p.evaluate(() => { const r = S.phReg[0]; if (r) document.querySelector(`#vPH [data-ok="${r.id}"]`).click(); }); await W(2000);
  ok(p.M.CALLS.filter(c => c.a === 'phDuyet').length === 3, 'lần duyệt sau: máy chủ đã có PDF ⇒ không gửi lại file');
  await p.context().close();
  p = await P({ as: 'gvcn', phReg: [{ id: 'R1', ma: 'HS02', ten: 'Trần Gia Chi', email: 'x@example.com', at: '2026-10-09 09:00' }] }); await p.goto(U + '#duyet'); await p.waitForSelector('#app.on'); await W(2500);
  ok(await p.evaluate(() => S.view === 'ph') && await p.isVisible('#vPH [data-ok="R1"]'), 'link "Mở sổ để duyệt" trong email ⇒ vào thẳng mục duyệt');
  await p.context().close();

  // 18. v3.9 — menu tài khoản, tìm kiếm thông minh, chú thích, dải điểm tuần, Cài đặt chia tab
  p = await P({ as: 'gvcn' }); p.on('dialog', d => d.accept()); await p.goto(U); await p.waitForSelector('#app.on'); await W(1800);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); }); await W(300);
  await p.evaluate(() => go('ghi')); await W(500);   /* v6.0: GVCN mở vào Tổng quan */
  ok(await p.locator('#tk39 .it').count() >= 1 && /lượt/.test(await p.textContent('#tk39 .ct')), 'màn chính: dải "Điểm tuần" hiện các lượt cộng / trừ của tuần');
  const k0 = await p.evaluate(() => document.querySelector('#tk39 .it').dataset.id); await p.mouse.move(2, 2); await W(6800);
  ok(await p.evaluate(() => document.querySelector('#tk39 .it').dataset.id) !== k0, 'dải điểm tuần tự lật sang lượt khác (6 giây / lần)');
  await p.locator('#tk39 .it').first().click(); await W(300);
  ok(/Sửa \/ xoá/.test(await p.textContent('#tkm39')) && /Nhận xét/.test(await p.textContent('#tkm39')), 'bấm 1 lượt ⇒ menu Xem hồ sơ / Sửa / Nhận xét (theo quyền GVCN)');
  await p.click('#tkm39 [data-k="pf"]'); await W(700); await p.evaluate(() => closePanel()); await W(200);
  await p.click('#hAva'); await W(250);
  ok(await p.isVisible('#ava39 [data-a="out"]') && await p.isVisible('#ava39 [data-a="ph"]'), 'avatar góc phải: menu tài khoản có Phụ huynh + Đăng xuất');
  await p.click('#ava39 [data-a="cai"]'); await W(600);
  ok(await p.isVisible('.cai39 .ctabs') && !/Tài khoản của tôi/.test(await p.textContent('#vCai')), 'Cài đặt chia tab; phần tài khoản chuyển lên menu avatar');
  await p.evaluate(() => go('bang')); await W(700); await p.fill('.sq39 input', 'tổ 2 vi phạm'); await W(300);
  const vis = await p.evaluate(() => [...document.querySelectorAll('#vBang .hkcard[data-ma]')].filter(x => !x.classList.contains('hid39')).map(x => { const s = stu(x.dataset.ma); return String(s.to) === '2' && hkEntriesOf(s.ma).some(e => e[E_DIEM] < 0); }));
  ok(vis.length > 0 && vis.every(Boolean), 'tìm kiếm thông minh: "tổ 2 vi phạm" chỉ còn học sinh tổ 2 có lỗi (' + vis.length + ')');
  await p.fill('.sq39 input', ''); await W(200);
  await p.locator('#vBang .hkcard .mini > div').nth(2).hover(); await W(500);
  ok(await p.evaluate(() => document.getElementById('tip39').classList.contains('on')) && /Bị trừ|Được cộng|Không có ghi nhận/.test(await p.textContent('#tip39')), 'rê chuột vào ô điểm ⇒ hiện cộng / trừ từ đâu');
  await p.evaluate(() => go('bc')); await W(900); await p.fill('#vBC .sq39 input', 'khá'); await W(300);
  ok(/\d+\/\d+ học sinh/.test(await p.textContent('#vBC .sq39 .ct')), 'Báo cáo cũng có tìm kiếm thông minh');
  await p.context().close();

  // 19. v6.0 — giao diện gọn: không còn chế độ trải nghiệm · đăng nhập (tên trường lớn, không tên lớp) · Tổng quan · Cập nhật · Cán bộ lớp
  p = await P({}); await p.goto(U); await W(1200);
  ok(!(await p.$('#dm-enter')) && !(await p.evaluate(() => !!window.DEMO)), 'không còn chế độ "Kiểm tra tính năng ứng dụng"');
  ok(/^THPT YÊN HÒA$/.test((await p.textContent('#login .lg6s')).trim()) && !/11D3/.test(await p.textContent('#login')), 'đăng nhập: tên trường lớn, không hiện tên lớp');
  await p.click('#login [data-rm]'); await W(400);
  ok(/Mở rộng cho nhiều lớp/.test(await p.textContent('#rm-ov')) && /Phân quyền từ quản trị/.test(await p.textContent('#rm-ov')) && !!(await p.$('#rm-ov a[href$="mau-danh-sach-lop.xlsx"]')), 'Tính năng sắp ra mắt: nhiều lớp (file Excel mẫu) + phân quyền');
  await p.context().close();
  p = await P({ as: 'gvcn' }); await p.goto(U); await p.waitForSelector('#app.on'); await W(2500);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); }); await W(600);
  ok(await p.evaluate(() => S.view === 'tq') && await p.isVisible('#vTQ .v6kp'), 'GVCN mở app ⇒ Tổng quan (thẻ số liệu)');
  ok(await p.evaluate(() => [...document.querySelectorAll('#railNav .v6gh')].map(x => x.textContent).join('|')) === 'Cập nhật|Báo cáo & sổ|Quản lý', 'thanh bên chia nhóm Cập nhật · Báo cáo & sổ · Quản lý');
  ok(await p.evaluate(() => ['ghi', 'ht'].every(v => document.querySelector('#railNav [data-v="' + v + '"]'))), 'Cập nhật = Theo dõi nề nếp + Điểm bộ môn');
  for (const t of ['hl', 'top']) { await p.click(`[data-tqt="${t}"]`); await W(1200); }
  ok(await p.isVisible('.v6pod') && (await p.$$('#vTQ .v6hr .r')).length >= 10, 'Top điểm: bục 3 bạn + danh sách top 10');
  await p.click('[data-tqt="td"]'); await p.click('[data-tqky="nam"]'); await W(2500);
  ok(/Cả năm học/.test(await p.textContent('#vTQ .v6cap')) && /T9/.test(await p.textContent('#vTQ .v6ch')), 'kỳ Năm học: diễn biến theo tháng');
  const before = await p.textContent('#vTQ .v6kp');
  await p.evaluate(() => { S.thang = 10; TQ.ky = 'thang'; TQ.render(); });
  const b1 = await p.textContent('#vTQ .v6k[data-tqk="tru"] b');
  p.M.ext('HS05', 'Đi học muộn', -2); await W(7000);
  ok(+(await p.textContent('#vTQ .v6k[data-tqk="tru"] b')) === +b1 + 1, 'Tổng quan tự cập nhật trực tiếp khi có lượt ghi mới');
  await p.click('#tqPdf'); await p.waitForSelector('#dl-sh', { timeout: 30000 }).catch(() => {});
  ok(await p.isVisible('#dl-sh'), 'Tổng quan: tải PDF');
  await p.context().close();
  p = await P({ as: 'tt', mobile: true }); await p.goto(U); await p.waitForSelector('#app.on'); await W(2500);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); }); await W(500);
  ok(await p.evaluate(() => S.me.role === 'Cán bộ lớp' && S.view === 'ghi' && S.filterTo === 'all' && canScore('1') && canScore('3')), 'tổ trưởng cũ ⇒ "Cán bộ lớp", ghi được cả lớp');
  ok((await p.$$('#tabbar [data-g]')).length >= 2 && !(await p.$('#tabbar [data-v="ht"]')), 'điện thoại: thanh dưới theo nhóm');
  await p.locator('#listGhi .row[data-ma="HS07"]').click(); await W(300); await p.click('#pBody [data-add="T01"]'); await W(200);
  if (await p.isVisible('#pBody [data-tp="nhan"]')) await p.click('#pBody [data-tp="nhan"]');
  await p.click('#gcSkip'); await W(3000);
  ok(p.M.CALLS.some(c => c.a === 'addEntries' && (c.p.items || c.p.entries || [c.p]).length), 'cán bộ lớp ghi cho bạn tổ khác ⇒ gửi addEntries');
  await p.context().close();

  // 9. trang phụ huynh
  p = await P({}); await p.goto(PH); await W(1200);
  ok(await p.locator('#lst .st').count() >= 30, 'trang phụ huynh: danh sách học sinh');
  await p.context().close();

  // 20. v4.6 — mở app vào Ghi điểm đúng tuần · chọn ngày xảy ra · số liệu bấm được
  p = await P({ as: 'lt', khoa: { 9: { by: 'gv', at: '2026-10-01' } } }); await p.goto(U); await p.waitForSelector('#app.on'); await W(1500);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); });
  const wk = await p.evaluate(() => { const w = wkOfDate(new Date()); return { ok: !w || (S.thang === w.thang && S.tuan === w.tuan), v: S.view }; });
  ok(wk.ok && wk.v === 'ghi', 'v4.6: mở app ⇒ Ghi điểm, đúng tuần của hôm nay');
  // ghi lùi ngày: chọn 1 ngày ở tuần 1 tháng 10
  await p.evaluate(() => { S.thang = 10; S.tuan = 2; renderAll(); });
  await p.locator('#listGhi .row[data-ma="HS03"]').click(); await W(300); await p.click('#pBody [data-add="T02"]'); await W(200);
  ok(await p.isVisible('#gcNgay'), 'bước diễn giải có ô "Ngày xảy ra"');
  await p.fill('#gcNgay', '2026-10-02'); await p.dispatchEvent('#gcNgay', 'change'); await W(100);
  ok(/tuần 1/.test(await p.textContent('#gcW')), 'chọn ngày ⇒ báo đúng tuần sẽ ghi (' + (await p.textContent('#gcW')).trim() + ')');
  await p.click('#gcSkip'); await W(400);
  const bd = await p.evaluate(() => { const e = S.entries.filter(e => e[4] === 'HS03').slice(-1)[0]; return { th: e[2], tu: e[3], gc: e[12], cur: [S.thang, S.tuan] }; });
  ok(bd.th === 10 && bd.tu === 1 && /ngày 02\/10/.test(bd.gc) && bd.cur[0] === 10 && bd.cur[1] === 2, 'ghi vào tuần 1, ghi chú có "ngày 02/10", màn hình giữ tuần đang xem');
  await p.evaluate(() => closePanel()); await W(300);
  await p.locator('#listGhi .row[data-ma="HS07"]').click(); await W(300); await p.click('#pBody [data-add="T04"]'); await W(200);
  await p.fill('#gcNgay', '2026-09-15'); await p.dispatchEvent('#gcNgay', 'change'); await W(100);
  ok(/khoá sổ/.test(await p.textContent('#gcW')), 'ngày thuộc tháng đã khoá sổ ⇒ báo không ghi được');
  const nE46 = await p.evaluate(() => S.entries.length); await p.click('#gcSkip'); await W(300);
  ok(await p.evaluate(n => S.entries.length === n, nE46), 'tháng đã khoá sổ ⇒ không ghi');
  await p.evaluate(() => closePanel && closePanel());
  // số liệu bấm được
  await p.evaluate(() => go('tk')); await W(800);
  await p.click('#vTK .kpi >> nth=0'); await W(300);
  ok(await p.isVisible('#dr46') && await p.locator('#dr46 .rw').count() > 0, 'Thống kê: bấm ô số ⇒ màn chi tiết (nền mờ)');
  await p.keyboard.press('Escape'); await W(200);
  const tk2 = p.locator('#vTK .kpi').filter({ hasText: /trừ|vi phạm/i }).first();
  if (await tk2.count()) { await tk2.click(); await W(300);
    ok(await p.locator('#dr46 .ch svg').count() === 1 && await p.locator('#dr46 [data-tb]').count() >= 3, 'ô lượt trừ ⇒ biểu đồ theo tuần + tab Học sinh / Nội dung / Tổ / Từng lượt');
    await p.click('#dr46 .rw[data-hs] >> nth=0'); await W(300);
    ok(await p.isVisible('#dr46 .bk') && await p.isVisible('#dr46 [data-pf]'), 'bấm 1 học sinh ⇒ xem sâu (có nút quay lại, mở hồ sơ)');
    await p.click('#dr46 .bk'); await W(200); await p.click('#dr46 [data-tb="nd"]'); await W(200);
    ok(await p.locator('#dr46 .rw[data-nd]').count() > 0, 'tab Theo nội dung');
    await p.click('#dr46 .x'); await W(200); }
  ok(!(await p.isVisible('#dr46')), 'nút × đóng màn chi tiết');
  const tr = p.locator('#vTK .toprow[data-dk]').first();
  if (await tr.count()) { await tr.click(); await W(300); ok(await p.isVisible('#dr46'), 'bấm dòng xếp hạng ⇒ chi tiết'); await p.keyboard.press('Escape'); }
  await p.context().close();
  p = await P({ as: 'gvcn' }); await p.goto(U); await p.waitForSelector('#app.on'); await W(1500);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); go('bc'); }); await W(900);
  await p.locator('#vBC table.bct tr').filter({ hasText: /Tổ\s*\d/ }).first().click(); await W(300);
  ok(await p.isVisible('#dr46') && /Tổ \d/.test(await p.textContent('#dr46 h3')), 'Báo cáo: bấm dòng tổ ⇒ chi tiết của tổ');
  await p.keyboard.press('Escape'); await W(200);
  await p.locator('#vBC .distbar>div').first().click(); await W(300);
  ok(await p.isVisible('#dr46') && /Xếp loại/.test(await p.textContent('#dr46 h3')), 'Báo cáo: bấm thanh xếp loại ⇒ danh sách học sinh');
  await p.click('#dr46 .rw[data-hs] >> nth=0'); await W(500);
  ok(!(await p.isVisible('#dr46')) && await p.evaluate(() => S.panelKind === 'profile' || !!document.querySelector('#pBody .pf, #pf')), 'bấm học sinh ⇒ mở hồ sơ');
  await p.context().close();
  p = await P({ as: 'ph' }); await p.goto(U); await p.waitForSelector('#app.on').catch(() => {}); await W(1200);
  ok(await p.evaluate(() => !isKhach() || S.view !== 'ghi'), 'phụ huynh không bị chuyển vào Ghi điểm');
  await p.context().close();

  // 21. v4.7 — thống kê lỗi vi phạm & hoạt động được tuyên dương
  p = await P({ as: 'gvcn' }); await p.goto(U); await p.waitForSelector('#app.on'); await W(1500);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); S.bcKy = 'thang'; go('bc'); }); await W(900);
  ok(await p.locator('#vBC .v47 table.v47t tr[data-v47k]').count() > 0 && await p.locator('#vBC .v47 .v47bar').count() > 0, 'v4.7: Báo cáo có bảng lỗi vi phạm + hoạt động được tuyên dương');
  ok(await p.locator('#vBC .v47 svg').count() >= 4 && await p.locator('#vBC .v47 img').count() >= 4, 'nhiều kiểu biểu đồ (vòng tròn, cột nhỏ, đường) và ảnh cô Thảo');
  ok(!(await p.evaluate(() => [...document.querySelectorAll('#vBC .sechead h2')].some(h => /Lỗi thường gặp|Vi phạm theo nhóm/.test(h.textContent)))), 'không còn mục trùng lặp cũ');
  await p.click('#vBC .v47 .v47bar >> nth=0'); await W(300);
  ok(await p.isVisible('#dr46') && await p.locator('#dr46 .rw').count() > 0, 'bấm hoạt động được khen ⇒ màn chi tiết');
  await p.keyboard.press('Escape'); await W(200);
  await p.click('#vBC .v47 td.h >> nth=0'); await W(300); ok(await p.isVisible('#dr46') && /Tổ/.test(await p.textContent('#dr46 h3')), 'bấm ô bản đồ lỗi × tổ ⇒ chi tiết');
  await p.keyboard.press('Escape'); await W(200);
  for (const k of ['tuan', 'hk', 'nam']) { await p.evaluate(k => { S.bcKy = k; renderBC(); }, k); await W(200); ok(await p.locator('#vBC .v47').count() === 1, 'Báo cáo kỳ ' + k + ': có khối vi phạm & tuyên dương'); }
  await p.evaluate(() => { S.bcKy = 'thang'; renderBC(); const o = RPT.open; RPT.open = (h, t) => o(h, t, { dry: true }); }); await p.click('#bcPrint'); await W(300);
  const d47 = await p.evaluate(() => RPT.last || '');
  ok(/Thống kê lỗi vi phạm/.test(d47) && /Hoạt động được tuyên dương/.test(d47) && (d47.match(/<section class="pg">/g) || []).length >= 6, 'PDF báo cáo có 2 trang mới: lỗi vi phạm, hoạt động được tuyên dương');
  await p.evaluate(() => go('tk')); await W(600);
  ok(await p.locator('#vTK [data-ky="hk"]').count() === 1, 'Thống kê có kỳ Học kỳ');
  await p.click('#vTK [data-ky="hk"]'); await W(400);
  ok(/học kỳ/i.test(await p.textContent('#vTK .v47 .sechead')) && await p.locator('#vTK .v47 .v47bar').count() > 0, 'Thống kê học kỳ: top hoạt động được tuyên dương');
  await p.context().close();

  // 22. v4.8 — nút Back, trang phụ huynh (tab phụ, Thoát, hướng dẫn ô email), thông báo cập nhật trên điện thoại
  const back = async pg => { await pg.evaluate(() => history.back()); await W(450); };
  p = await P({ as: 'gvcn', mobile: true }); await p.goto(U); await p.waitForSelector('#app.on'); await W(1200);
  await p.evaluate(() => { localStorage.removeItem('hk_upd_hide'); UPD3.open(false); }); await W(300);
  const bb = await p.evaluate(() => { const l = document.querySelector('#hkupd .ft label').getBoundingClientRect(), b = document.querySelector('#updOk').getBoundingClientRect(); return { lw: l.width, ov: !(l.bottom <= b.top || l.top >= b.bottom || l.right <= b.left || l.left >= b.right) }; });
  ok(bb.lw > 100 && !bb.ov, 'v4.8: điện thoại — ô "Không hiển thị lại" không bị nút "Đã hiểu" che');
  await back(p); ok(!(await p.isVisible('#hkupd.on')) && await p.isVisible('#app.on'), 'Back ⇒ đóng thông báo cập nhật, vẫn ở trong app');
  await p.evaluate(() => go('tk')); await W(500); await p.evaluate(() => go('bc')); await W(500);
  await back(p); ok(await p.evaluate(() => S.view === 'tk'), 'Back ⇒ về mục vừa xem (Báo cáo → Thống kê)');
  await p.evaluate(() => go('ghi')); await W(500); await p.locator('#listGhi .row').first().click(); await W(400);
  ok(await p.isVisible('#panel.on'), 'mở khung học sinh'); await back(p);
  ok(!(await p.isVisible('#panel.on')) && await p.evaluate(() => S.view === 'ghi'), 'Back ⇒ đóng khung học sinh, giữ mục Ghi điểm');
  await p.evaluate(() => DRILL.open({ title: 'A', E: S.entries.slice(0, 5) })); await W(200);
  await p.evaluate(() => document.querySelector('#dr46 .rw[data-hs]') && document.querySelector('#dr46 .rw[data-hs]').click()); await W(300);
  await back(p); ok(await p.evaluate(() => !!document.querySelector('#dr46') && DRILL.depth() === 1), 'Back trong màn chi tiết ⇒ lùi 1 tầng');
  await back(p); ok(!(await p.isVisible('#dr46')), 'Back ⇒ đóng màn chi tiết');
  for (let i = 0; i < 6; i++) { if (await p.isVisible('#bk-t')) break; await back(p); }
  ok(await p.evaluate(() => /lần nữa để thoát/.test((document.getElementById('bk-t') || {}).textContent || '')) && await p.isVisible('#app.on'), 'về đầu ⇒ hỏi "Bấm Quay lại lần nữa để thoát", không rời app');
  await p.evaluate(() => MASCOT.say('chao', 'Thử')); await W(500); ok(await p.isVisible('#msc.on'), 'bong bóng cô Thảo hiện');
  await W(3800); ok(!(await p.evaluate(() => document.getElementById('msc').classList.contains('on'))), 'bong bóng cô Thảo tự ẩn');
  await p.context().close();
  p = await P({ mobile: true }); await p.goto(PH); await W(1800);
  await p.locator('#lst .st').first().click(); await W(500);
  ok(await p.locator('#tabs2:not([hidden]) button').count() === 2 && /Hồ sơ/.test(await p.textContent('#tabs2 .on')), 'phụ huynh: tab phụ "Danh sách học sinh / Hồ sơ" rõ ràng');
  await p.click('#tabs2 [data-s="list"]'); await W(400); ok(await p.isVisible('#lst'), 'bấm "Danh sách học sinh" ⇒ về danh sách');
  await p.click('#tabs2 [data-s="hs"]'); await W(400); ok(await p.isVisible('.res'), 'bấm "Hồ sơ" ⇒ mở lại hồ sơ vừa xem');
  await p.focus('#rgE'); await W(300); ok(await p.locator('#reg .emtip img, #reg .emtip svg').count() === 1, 'bấm ô email ⇒ lời hướng dẫn kèm ảnh cô Thảo');
  await back(p); ok(await p.isVisible('#lst'), 'phụ huynh: Back ⇒ về danh sách');
  await p.click('#lo'); await W(300); ok(await p.isVisible('#lo-ov'), 'phụ huynh: có nút Thoát');
  await p.click('#loY'); await W(1500); ok(!/phu-huynh/.test(p.url()) && await p.evaluate(() => !localStorage.getItem('hkph_token')), 'Thoát ⇒ xoá dữ liệu trên máy, về trang đăng nhập');
  await p.context().close();
  const PHTXT = require('fs').readFileSync(require('path').join(__dirname, '../../phu-huynh.html'), 'utf8');
  ok(!/giúp cô nhé|cùng cô ạ|để cô hướng dẫn|nhận xét của cô</.test(PHTXT), 'trang phụ huynh: không xưng "cô" trống không');

  // 23. v5.0 — kết quả học tập · giáo viên bộ môn · sổ công tác chủ nhiệm
  p = await P({ as: 'gvcn' }); await p.goto(U); await p.waitForSelector('#app.on'); await W(1500);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); });
  ok(await p.evaluate(() => NAV.some(n => n.v === 'ht') && NAV.some(n => n.v === 'scn')), 'v5.0: menu Kết quả học tập + Sổ công tác chủ nhiệm');
  ok(await p.evaluate(() => NAV.find(n => n.v === 'bang').t === 'Kết quả rèn luyện' && NAV.find(n => n.v === 'ghi').t === 'Theo dõi nề nếp'), 'tên mục theo ngôn ngữ hành chính (rèn luyện, nề nếp)');
  await p.evaluate(() => go('ht')); await W(1200);
  ok(await p.locator('#vHT .htg tbody tr').count() >= 30 && p.M.CALLS.some(c => c.a === 'htBoot'), 'bảng điểm môn đầu tiên đủ danh sách lớp');
  /* v6.3: không nhập ĐĐGtx — bảng điểm chỉ Giữa kì, Cuối kì, TB môn (v6.4: bỏ nhận xét GVBM) */
  const ths = await p.$$eval('#vHT .htg thead th', a => a.map(x => x.textContent.trim()));
  ok(!ths.some(t => /ĐĐGtx/.test(t)) && ths.includes('Giữa kì') && ths.includes('Cuối kì') && ths.includes('TB môn'), 'v6.3: bảng điểm chỉ giữa kì, cuối kì, TB môn (không ĐĐGtx): ' + ths.join(' | '));
  await p.click('#vHT td.c[data-dd="GK"]'); await p.keyboard.type('9,5'); await p.keyboard.press('Enter'); await W(1200);
  ok(await p.evaluate(() => HT.val(activeStudents()[0].ma, 'TOAN', 1, 'GK') === '9.5') && p.M.CALLS.some(c => c.a === 'htSaveDiem'), 'nhập điểm giữa kì trong ô ⇒ lưu ngay (htSaveDiem)');
  const kq = await p.evaluate(() => { HT.d.rule.datToiDaCD = 1; const s = activeStudents()[0];
    ['GDTC', 'HDTN'].forEach(m => HT.saveDiem([{ ma: s.ma, mon: m, hk: 1, dd: 'HK', v: 'CĐ' }])); return HT.ketQua(s.ma, 'hk1').muc; });
  ok(kq === 3, 'Thông tư 22: 2 môn nhận xét Chưa đạt ⇒ kết quả học tập Chưa đạt');
  // nhập Excel có cột mới
  const imp = await p.evaluate(async () => { await DL.load('xlsx'); const L = activeStudents();
    const rows = [['STT', 'Họ và tên', 'TX1', 'Giữa kì', 'Dự án nhóm']].concat(L.slice(0, 5).map((s, i) => [i + 1, s.ten, 7, 8, 9]));
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), 'Ngữ văn HK1');
    return Array.from(new Uint8Array(XLSX.write(wb, { type: 'array', bookType: 'xlsx' }))); });
  const [fc5] = await Promise.all([p.waitForEvent('filechooser'), p.click('#htImp')]);
  await fc5.setFiles({ name: 'diem_van.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: Buffer.from(imp) }); await W(800);
  ok(await p.isVisible('#htov') && /Ngữ văn/.test(await p.textContent('#htov')) && /Giữa kì/.test(await p.textContent('#htov')), 'nhập Excel: nhận ra môn theo tên trang tính, cột Giữa kì');
  await p.click('#htov [data-ok]'); await W(1500);
  ok(await p.evaluate(() => { const m = activeStudents()[0].ma; return HT.val(m, 'VAN', 1, 'GK') === '8' && HT.val(m, 'VAN', 1, 'TX1') !== '7' && HT.val(m, 'VAN', 1, 'DỰ ÁN NHÓM') === ''; }), 'v6.3: Excel lưu điểm giữa kì, bỏ qua cột ĐĐGtx và cột lạ');
  /* v6.3: kỳ thi & ôn luyện + email báo điểm */
  await p.evaluate(() => { HT.tab = 'kt'; HT.ktSel = null; HT.render(); }); await W(300);
  ok(await p.locator('.ktc').count() >= 4, 'v6.3: thẻ Kỳ thi & ôn luyện có danh sách kỳ thi');
  await p.click('#ktNew'); await p.fill('#kfT', 'Ôn luyện thử'); await p.click('#htov [data-ok]'); await W(1200);
  await p.locator('.ktt td.c input').first().fill('7,5'); await p.locator('.ktt td.c input').first().press('Enter'); await W(1200);
  await p.click('#ktMail'); await W(1500);
  ok(p.M.CALLS.some(c => c.a === 'htSaveKyThi') && p.M.CALLS.some(c => c.a === 'htSaveDiem' && (c.p.items || []).some(i => /^KT#/.test(i.dd))) && p.M.CALLS.some(c => c.a === 'htBaoDiem'), 'v6.3: tạo kỳ thi ⇒ nhập điểm ⇒ gửi email báo điểm (htSaveKyThi, htSaveDiem KT#, htBaoDiem)');
  await p.evaluate(() => { HT.tab = 'tk'; HT.ky = 'hk1'; HT.render(); }); await W(500);
  ok(await p.locator('#vHT .kpis .kpi').count() === 4 && await p.locator('#vHT .muc').count() > 30, 'Tổng kết: 4 mức Tốt · Khá · Đạt · Chưa đạt từng học sinh');
  await p.evaluate(() => { activeStudents()[0].email = 'ph1@example.com'; }); await p.click('#htPH'); await W(500);
  ok(/Kết quả học tập/.test(await p.textContent('#pbXem')), 'phiếu báo cha mẹ HS: có xem trước');
  await p.evaluate(() => { document.getElementById('pbAi').selectedIndex = 1; }); p.once('dialog', d => d.accept());
  await p.click('#htov [data-ok]'); await W(1200);
  ok(p.M.CALLS.some(c => c.a === 'htMailPH'), 'gửi phiếu báo ⇒ htMailPH');
  // sổ chủ nhiệm
  await p.evaluate(() => go('scn')); await W(2000);
  ok(await p.isVisible('#scnWord') && await p.locator('#vSCN .httabs button').count() === 8, 'Sổ công tác chủ nhiệm: 8 mục + Xuất file Word');
  await p.evaluate(() => { SCN.tab = 'p3'; SCN.render(); }); await W(400);
  await p.fill('#vSCN textarea[data-k="kh_khokhan"]', 'Khó khăn thử nghiệm'); await W(1600);
  ok(p.M.CALLS.some(c => c.a === 'scnSave' && c.p.kv && c.p.kv.kh_khokhan === 'Khó khăn thử nghiệm'), 'nội dung GVCN gõ tự lưu (scnSave)');
  const word = await p.evaluate(async () => { const blob = await SCN.taoWord(); const z = await JSZip.loadAsync(blob); const x = await z.file('word/document.xml').async('string');
    const txt = x.replace(/<[^>]+>/g, ''); return { size: blob.size, left: (txt.match(/\{\{[^}]*\}\}/g) || []).length, kk: txt.indexOf('Khó khăn thử nghiệm') >= 0, ten: txt.indexOf(activeStudents()[0].ten) >= 0, thang: txt.indexOf('THÁNG 10') >= 0 }; });
  ok(word.size > 500000 && word.left === 0 && word.kk && word.ten && word.thang, 'xuất Word theo mẫu: đủ dữ liệu, không còn ô đánh dấu (' + Math.round(word.size / 1024) + ' KB)');
  await p.evaluate(() => SCN.guiBGH()); await W(300); await p.click('#htov [data-ok]'); await W(3000);
  ok(p.M.CALLS.some(c => c.a === 'htMailBGH' && c.p.files && c.p.files.length === 1 && /\.docx$/.test(c.p.files[0].name)), 'gửi Ban giám hiệu kèm file Word (htMailBGH)');
  await p.context().close();
  // v6.4: không còn vai giáo viên bộ môn — chỉ GVCN và cán bộ lớp cập nhật điểm
  p = await P({ as: 'gvcn' }); await p.goto(U); await p.waitForSelector('#app.on'); await W(2500);
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); go('ht'); }); await W(2500);
  const gvTxt = async () => p.evaluate(() => document.querySelector('#vHT').innerText);
  ok(!/bộ môn|GVBM/.test(await gvTxt()) && !(await p.$('#htAskGV')), 'v6.4: bảng điểm không còn giáo viên bộ môn / nhận xét GVBM');
  ok(await p.evaluate(() => Array.from(document.querySelectorAll('[data-htt]')).map(b => b.textContent).indexOf('Môn học') >= 0), 'v6.4: thẻ "Môn học" (bỏ danh sách giáo viên)');
  await p.click('[data-htt="mon"]'); await W(800);
  ok(!/bộ môn/.test(await gvTxt()) && !(await p.$('#htGvT')), 'v6.4: thẻ Môn học không còn danh sách giáo viên bộ môn');
  await p.context().close();

  ok(errs.length === 0, 'không lỗi JavaScript' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  await b.close(); console.log(fail ? '\n' + fail + ' lỗi' : '\nTất cả đạt'); process.exit(fail ? 1 : 0);
})();
