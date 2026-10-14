/* Kiểm thử web demo: NODE_PATH=$(npm root -g) node tools/demo/test.js  (cần python3 -m http.server 8768 ở thư mục repo)
   Bắt buộc: KHÔNG có lệnh nào đi tới script.google.com thật. */
const { chromium } = require('playwright');
const U = 'http://localhost:8768/';
(async () => {
  const b = await chromium.launch(); let bad = 0, real = 0;
  const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) bad++; };
  for (const mobile of [false, true]) {
    const ctx = await b.newContext(mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : { viewport: { width: 1366, height: 860 } });
    await ctx.route(/script\.google/, r => { if (/demo/.test(r.request().frame().url())) real++; r.abort(); });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    const tag = mobile ? '[điện thoại] ' : '[máy tính] ';
    /* sổ thật có sẵn phiên trên máy ⇒ demo không được đụng tới */
    await p.goto(U + 'img/favicon.png'); await p.evaluate(() => { localStorage.setItem('hk_token', 'REAL-TOKEN'); localStorage.setItem('hk_cache_v4', '{"real":1}'); });
    await p.goto(U + 'demo.html'); await p.waitForTimeout(800);
    ok(await p.isVisible('#dg'), tag + 'hiện màn nhập mã');
    await p.fill('#dgc', 'sai'); await p.click('#dg button'); await p.waitForTimeout(200);
    ok(/chưa đúng/.test(await p.textContent('#dge')), tag + 'mã sai bị từ chối');
    await p.fill('#dgc', '11D3Yenhoa'); await p.click('#dg button');
    await p.waitForTimeout(2500);
    ok(!(await p.isVisible('#dg')), tag + 'mã đúng ⇒ vào sổ');
    ok(await p.isVisible('#dm .pill'), tag + 'có nút Bản demo');
    const name = await p.evaluate(() => (document.body.innerText.match(/Nguyễn Thu Thảo|cô Thảo/) || [''])[0]);
    ok(/Thảo/.test(name), tag + 'vai GVCN: ' + name);
    await p.screenshot({ path: 'tools/test/out/demo_' + (mobile ? 'm' : 'd') + '_tq.png' });
    ok(await p.evaluate(() => new Set(DEMO.db().students.map(x => x.ten)).size === DEMO.db().students.length), tag + 'tên học sinh ảo không trùng');
    await p.evaluate(async () => { go('ht'); await new Promise(r => setTimeout(r, 1200)); HT.tab = 'kt'; HT.render(); }); await p.waitForTimeout(400);
    ok(await p.$$eval('.ktc', a => a.length) >= 4, tag + 'thẻ Kỳ thi & ôn luyện có dữ liệu mẫu');
    ok(/Theo dõi thi đua và nề nếp/.test(await p.title()), tag + 'tiêu đề trang: ' + await p.title());
    /* ghi điểm qua API của app (giống bấm) ⇒ thư phụ huynh vào hộp thư mô phỏng */
    const r = await p.evaluate(async () => { const th = DEMO.db().cfg.thang; return await rawApi('addEntries', { thang: th, tuan: 1, rid: 'x1', items: [{ maHS: 'HS01', loai: 'Trừ', maMuc: 'T01', noiDung: 'Đi học muộn', diem: -2 }] }); });
    ok(r.ok && r.ids.length === 1, tag + 'ghi điểm vào máy chủ ảo');
    await p.waitForTimeout(700);
    ok(await p.evaluate(() => DEMO.mails().length > 0), tag + 'email phụ huynh vào Hộp thư mô phỏng');
    await p.click('#dm .pill'); await p.click('#dm a[data-k=mail]'); await p.waitForTimeout(300);
    ok(await p.isVisible('#dbx iframe'), tag + 'mở Hộp thư mô phỏng');
    await p.screenshot({ path: 'tools/test/out/demo_' + (mobile ? 'm' : 'd') + '_mail.png' });
    await p.click('#dbx .hd button');
    /* đổi vai */
    for (const [r2, re] of [['lt', /Minh An/], ['gvtoan', /Thu Hà/]]) {
      await p.click('#dm .pill'); await p.click(`#dm a[data-r=${r2}]`); await p.waitForTimeout(2500);
      ok(re.test(await p.evaluate(() => document.body.innerText)), tag + 'đổi vai ' + r2);
    }
    await p.click('#dm .pill'); await p.click('#dm a[data-r=ph]'); await p.waitForTimeout(3000);
    ok(/demo-phu-huynh/.test(p.url()) && !(await p.isVisible('#dg')), tag + 'trang cha mẹ học sinh (demo)');
    ok((await p.textContent('body')).length > 500, tag + 'trang phụ huynh có dữ liệu');
    await p.screenshot({ path: 'tools/test/out/demo_' + (mobile ? 'm' : 'd') + '_ph.png' });
    /* sổ thật vẫn nguyên */
    await p.goto(U + 'img/favicon.png');
    const real0 = await p.evaluate(() => [localStorage.getItem('hk_token'), localStorage.getItem('hk_cache_v4')]);
    ok(real0[0] === 'REAL-TOKEN' && real0[1] === '{"real":1}', tag + 'bộ nhớ của sổ thật không bị đụng');
    ok(!errs.length, tag + 'không lỗi trang ' + errs.slice(0, 2).join(' | '));
    await ctx.close();
  }
  ok(real === 0, 'KHÔNG có lệnh nào tới máy chủ thật từ trang demo (đếm: ' + real + ')');
  await b.close(); console.log(bad ? `\n${bad} lỗi` : '\nTất cả kiểm thử web demo đều đạt'); process.exit(bad ? 1 : 0);
})();
