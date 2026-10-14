/* Ảnh phát hành cho web demo (dữ liệu ảo): NODE_PATH=$(npm root -g) node tools/demo/cap.js updates/v6.2 */
const { chromium } = require('playwright'); const out = process.argv[2] || 'tools/test/out';
(async () => {
  const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 1280, height: 760 }, deviceScaleFactor: 1 });
  await ctx.route(/script\.google/, r => r.abort());
  const p = await ctx.newPage(); await p.goto('http://localhost:8768/demo.html'); await p.waitForTimeout(900);
  await p.fill('#dgc', '11D3Yenhoa'); await p.screenshot({ path: out + '/demo-ma.png' });
  await p.click('#dg button'); await p.waitForTimeout(2500);
  await p.evaluate(async () => { await rawApi('addEntries', { thang: DEMO.db().cfg.thang, tuan: 1, rid: 'cap1', items: [{ maHS: 'HS07', loai: 'Cộng', maMuc: 'C03', noiDung: 'Tham gia phong trào', diem: 3 }] }); });
  await p.waitForTimeout(800); await p.evaluate(() => { document.querySelectorAll('#phNew,.mbub,#mascotBubble').forEach(n => n.remove()); });
  await p.click('#dm .pill'); await p.waitForTimeout(300); await p.screenshot({ path: out + '/demo-menu.png' });
  await p.click('#dm a[data-k=mail]'); await p.waitForTimeout(600); await p.screenshot({ path: out + '/demo-hop-thu.png' });
  await b.close();
})();
