/* Ảnh phát hành v6.3 (dữ liệu ảo của web demo): NODE_PATH=$(npm root -g) node tools/demo/cap63.js updates/v6.3 */
const { chromium } = require('playwright'); const out = process.argv[2] || 'tools/test/out';
(async () => {
  const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 1280, height: 760 } });
  await ctx.route(/script\.google/, r => r.abort());
  const p = await ctx.newPage(); await p.goto('http://localhost:8768/demo.html'); await p.waitForTimeout(800);
  await p.fill('#dgc', '11D3Yenhoa'); await p.click('#dg button'); await p.waitForTimeout(2500);
  await p.evaluate(() => document.querySelectorAll('#phNew,#hkupd').forEach(n => n.remove()));
  await p.evaluate(async () => { go('ht'); await new Promise(r => setTimeout(r, 1200)); HT.tab = 'kt'; HT.render(); }); await p.waitForTimeout(500);
  await p.screenshot({ path: out + '/ky-thi.png' });
  await p.click('.ktc'); await p.waitForTimeout(500); await p.screenshot({ path: out + '/nhap-diem.png' });
  await p.evaluate(() => { window.__H = []; RPT.open = (h) => { __H.push(h); return h; }; HT.pdfLop('hk1');
    RPT.open(RPT.student({ cfg: S.cfg, students: S.students, entries: S.entries, remarks: S.remarks }, 'HS05', { k: 'hk', n: 1 }, { aud: 'ph' })); });
  const docs = await p.evaluate(() => __H);
  const q = await b.newPage({ viewport: { width: 1123, height: 794 } });
  await q.setContent(docs[1], { waitUntil: 'load' }); await (await q.$$('.pg'))[1].screenshot({ path: out + '/bao-cao-hs.png' });
  await q.setContent(docs[0], { waitUntil: 'load' }); await (await q.$$('.pg'))[1].screenshot({ path: out + '/bao-cao-lop.png' });
  await b.close();
})();
