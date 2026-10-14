/* Ảnh phát hành v6.5 — Trợ lý AI (dữ liệu ảo của web demo): NODE_PATH=$(npm root -g) node tools/demo/cap65.js updates/v6.5 */
const { chromium } = require('playwright'); const out = process.argv[2] || 'tools/test/out';
(async () => {
  const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.route(/script\.google/, r => r.abort());
  const p = await ctx.newPage(); await p.goto('http://localhost:8768/demo.html'); await p.waitForTimeout(800);
  await p.fill('#dgc', '11D3Yenhoa'); await p.click('#dg button'); await p.waitForTimeout(2500);
  await p.addStyleTag({ content: '#m,#msc{display:none!important}' }); await p.evaluate(() => document.querySelectorAll('#phNew,#hkupd').forEach(n => n.remove()));
  const ma = await p.evaluate(() => { const L = activeStudents(); return (L.find(s => S.entries.filter(e => e[E_MA] === s.ma && e[E_THANG] === S.thang && e[E_DIEM] < 0).length >= 2) || L[2]).ma; });
  await p.evaluate(m => { go('ghi'); openRemark(m); }, ma); await p.waitForTimeout(700);
  await p.click('#pBody .ai65 button.go'); await p.waitForTimeout(1200);
  await p.screenshot({ path: out + '/nhan-xet-hs.png' });
  await p.evaluate(() => { closePanel(); S.bcKy = 'thang'; go('bc'); }); await p.waitForTimeout(1200);
  await p.click('#vBC .ai65 button.go'); await p.waitForTimeout(1200);
  await p.evaluate(() => document.querySelector('#vBC .bctxt').scrollIntoView({ block: 'start' })); await p.waitForTimeout(400);
  await p.screenshot({ path: out + '/bao-cao-lop.png' });
  await b.close();
})();
