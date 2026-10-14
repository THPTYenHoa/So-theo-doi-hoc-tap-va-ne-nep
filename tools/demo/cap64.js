/* Ảnh phát hành v6.4 (dữ liệu ảo của web demo): NODE_PATH=$(npm root -g) node tools/demo/cap64.js updates/v6.4 */
const { chromium } = require('playwright'); const out = process.argv[2] || 'tools/test/out';
(async () => {
  const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 1280, height: 760 } });
  await ctx.route(/script\.google/, r => r.abort());
  const p = await ctx.newPage(); await p.goto('http://localhost:8768/demo.html'); await p.waitForTimeout(800);
  await p.fill('#dgc', '11D3Yenhoa'); await p.click('#dg button'); await p.waitForTimeout(2500);
  await p.addStyleTag({ content: '#m,#msc{display:none!important}' }); await p.evaluate(() => document.querySelectorAll('#phNew,#hkupd').forEach(n => n.remove()));
  await p.evaluate(async () => { go('ht'); await new Promise(r => setTimeout(r, 1200)); HT.tab = 'diem'; HT.render(); }); await p.waitForTimeout(500);
  await p.screenshot({ path: out + '/diem.png' });
  await p.evaluate(() => { HT.tab = 'mon'; HT.render(); }); await p.waitForTimeout(500);
  await p.screenshot({ path: out + '/mon-hoc.png' });
  await b.close();
})();
