/* Khung chat Trợ lý AI (dữ liệu ảo web demo): NODE_PATH=$(npm root -g) node tools/demo/cap65b.js <thư mục ra> [mobile] */
const { chromium } = require('playwright'); const out = process.argv[2] || 'tools/test/out', mob = process.argv[3] === 'mobile';
(async () => {
  const b = await chromium.launch(), ctx = await b.newContext(mob ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1280, height: 800 } });
  const real = []; await ctx.route(/script\.google/, r => { real.push(r.request().url()); r.abort(); });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8768/demo.html'); await p.waitForTimeout(800);
  await p.fill('#dgc', '11D3Yenhoa'); await p.click('#dg button'); await p.waitForTimeout(2500);
  await p.addStyleTag({ content: '#m,#msc{display:none!important}' }); await p.evaluate(() => document.querySelectorAll('#phNew,#hkupd').forEach(n => n.remove()));
  await p.waitForSelector('#tl-fab', { timeout: 5000 });
  await p.screenshot({ path: out + '/tl-fab' + (mob ? '-m' : '') + '.png' });
  await p.click('#tl-top'); await p.waitForTimeout(500);
  await p.screenshot({ path: out + '/tl-mo' + (mob ? '-m' : '') + '.png' });
  const sent = []; p.on('request', () => {});
  await p.evaluate(() => { const r0 = window.rawApi; window.__sent = []; window.rawApi = rawApi = function (a, pl) { if (a === 'aiChat') __sent.push(pl); return r0.apply(this, arguments); }; });
  await p.click('#tl .gy button >> nth=0'); await p.waitForTimeout(1500);
  await p.screenshot({ path: out + '/tl-quantam' + (mob ? '-m' : '') + '.png' });
  await p.fill('#tl textarea', 'So sánh thi đua giữa các tổ tháng này'); await p.press('#tl textarea', 'Enter'); await p.waitForTimeout(1500);
  await p.screenshot({ path: out + '/tl-chat' + (mob ? '-m' : '') + '.png' });
  const info = await p.evaluate(() => { const s = JSON.stringify(__sent); const L = activeStudents();
    return { n: __sent.length, leak: L.filter(x => s.includes(x.ten) || s.includes('"' + x.ma + '"')).length, size: s.length, links: document.querySelectorAll('#tl .tl-hs').length }; });
  // hỏi có tên học sinh ⇒ phải được ẩn danh
  const ten = await p.evaluate(() => activeStudents()[3].ten);
  await p.fill('#tl textarea', 'Em ' + ten + ' tháng này thế nào?'); await p.press('#tl textarea', 'Enter'); await p.waitForTimeout(1500);
  const q3 = await p.evaluate(() => __sent[__sent.length - 1].hoi);
  console.log(JSON.stringify({ info, q3, errs, real: real.length }));
  await b.close();
})();
