/* Ảnh cho HDSD đầy đủ v6.5 (dữ liệu ảo của web demo): python3 -m http.server 8768 ▸ NODE_PATH=$(npm root -g) node tools/guide/cap65.js
   → tools/guide/shots65/*.png (máy tính 1280×800, điện thoại 390×844 ×2). Dùng cho tools/guide/build65.js. */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const OUT = path.join(__dirname, 'shots65'); fs.mkdirSync(OUT, { recursive: true });
const U = 'http://localhost:8768/';
const W = ms => new Promise(r => setTimeout(r, ms));
async function vao(ctx, file) {
  const p = await ctx.newPage(); await p.goto(U + (file || 'demo.html')); await W(900);
  if (await p.$('#dgc')) { await p.fill('#dgc', '11D3Yenhoa'); await p.click('#dg button'); await W(2600); }
  await p.addStyleTag({ content: '#m,#msc,#dm,.mbub,#mascotBubble{display:none!important}' });
  await p.evaluate(() => document.querySelectorAll('#phNew,#hkupd,#v32pop').forEach(n => n.remove()));
  return p;
}
const shot = (p, n, o) => p.screenshot(Object.assign({ path: path.join(OUT, n + '.png') }, o || {}));
(async () => {
  const b = await chromium.launch();
  const D = await b.newContext({ viewport: { width: 1280, height: 800 } }); await D.route(/script\.google/, r => r.abort());
  /* đăng nhập (trang thật, chưa có phiên) */
  const L = await D.newPage(); await L.goto(U + 'index.html'); await W(1500);
  await L.evaluate(() => { const i = document.querySelector('#lgEm, input[type=email]'); if (i) i.value = 'co.thao@truong.edu.vn'; });
  await shot(L, 'login'); await L.close();
  /* GVCN */
  const p = await vao(D);
  const V = async (v, n, pre) => { await p.evaluate(async ([v, pre]) => { if (window.closePanel) try { closePanel(); } catch (_) {} go(v); await new Promise(r => setTimeout(r, 900)); if (pre) eval(pre); }, [v, pre]); await W(700); await shot(p, n); };
  await V('tq', 'tq');
  await V('tq', 'tq_hl', "document.querySelector('[data-tqt=\"hl\"]') && document.querySelector('[data-tqt=\"hl\"]').click()");
  await V('ghi', 'ghi');
  await p.evaluate(() => { const L = activeStudents(); openStudent ? openStudent(L[2].ma) : null; }).catch(() => {});
  await W(700); await shot(p, 'ghi_hs');
  await p.evaluate(() => { try { closePanel(); } catch (_) {} });
  await p.evaluate(async () => { go('ht'); await new Promise(r => setTimeout(r, 1200)); HT.tab = 'diem'; HT.render(); }); await W(600); await shot(p, 'ht_diem');
  await p.evaluate(() => { HT.tab = 'kt'; HT.render(); }); await W(600); await shot(p, 'ht_kt');
  await V('bang', 'bang');
  const ma = await p.evaluate(() => { const L = activeStudents(); return (L.find(s => S.entries.filter(e => e[E_MA] === s.ma && e[E_THANG] === S.thang && e[E_DIEM] < 0).length >= 2) || L[2]).ma; });
  await p.evaluate(m => { go('ghi'); openRemark(m); }, ma); await W(700);
  await p.click('#pBody .ai65 button.go'); await W(1300); await shot(p, 'nhanxet_ai');
  await p.evaluate(m => { try { closePanel(); } catch (_) {} openProfile(m); }, ma); await W(1200); await shot(p, 'hoso');
  await p.keyboard.press('Escape'); await W(300);
  await p.evaluate(() => { try { closePanel(); } catch (_) {} document.querySelectorAll('.ov,.modal').forEach(n => n.classList && n.classList.remove('on')); S.bcKy = 'thang'; go('bc'); }); await W(1300);
  await shot(p, 'bc');
  await p.click('#vBC .ai65 button.go'); await W(1300);
  await p.evaluate(() => document.querySelector('#vBC .bctxt').scrollIntoView({ block: 'start' })); await W(400); await shot(p, 'bc_ai');
  await V('scn', 'scn'); await V('ls', 'ls'); await V('ph', 'ph'); await V('cai', 'cai');
  await p.evaluate(() => { try { localStorage.removeItem('hk_tl_v1'); } catch (_) {} TL.close(); go('tq'); }); await W(900);
  await p.click('#tl-top'); await W(500); await shot(p, 'tl_mo');
  await p.click('#tl .gy button >> nth=0'); await W(1500); await shot(p, 'tl_tl');
  await p.fill('#tl textarea', 'Soạn tin nhắn Zalo tổng kết tuần cho nhóm cha mẹ'); await p.press('#tl textarea', 'Enter'); await W(1500); await shot(p, 'tl_zalo');
  await p.evaluate(() => TL.close()); await W(300);
  await p.keyboard.press('/'); await W(400); await p.keyboard.type('lan'); await W(500); await shot(p, 'tim');
  /* cán bộ lớp — điện thoại */
  const M = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); await M.route(/script\.google/, r => r.abort());
  const q = await vao(M);
  await q.evaluate(() => DEMO.setRole('lt')); await q.goto(U + 'demo.html'); await W(2600);
  await q.addStyleTag({ content: '#m,#msc,#dm,.mbub,#mascotBubble{display:none!important}' }); await q.evaluate(() => document.querySelectorAll('#phNew,#hkupd,#v32pop').forEach(n => n.remove()));
  await q.evaluate(() => go('ghi')); await W(900); await shot(q, 'm_ghi');
  await q.evaluate(() => { const L = activeStudents(); if (window.openStudent) openStudent(L[4].ma); }); await W(900); await shot(q, 'm_hs');
  await q.evaluate(() => { try { closePanel(); } catch (_) {} go('ht'); }); await W(1400); await shot(q, 'm_ht');
  /* cha mẹ học sinh — điện thoại */
  await q.evaluate(() => DEMO.setRole('ph')); await q.goto(U + 'demo-phu-huynh.html'); await W(2600);
  await q.addStyleTag({ content: '#m,#msc,#dm,.mbub,#mascotBubble{display:none!important}' });
  await shot(q, 'm_ph');
  await q.evaluate(() => { const s = document.querySelector('#lst .st'); if (s) s.click(); }); await W(1200); await shot(q, 'm_ph_hs');
  await b.close(); console.log('ảnh ở', OUT, fs.readdirSync(OUT).length);
})();
