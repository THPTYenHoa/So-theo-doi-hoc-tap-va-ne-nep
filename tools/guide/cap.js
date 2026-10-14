/* Chụp ảnh cho PDF hướng dẫn (dữ liệu GIẢ): NODE_PATH=$(npm root -g) node tools/guide/cap.js  (cần http.server 8768)
   → tools/guide/shots/<cảnh>.png (đã vẽ số chú thích màu cam). */
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const { newPage, TINY } = require('../test/mock');
const U = 'http://127.0.0.1:8768/', W = ms => new Promise(r => setTimeout(r, ms));
const OUT = path.join(__dirname, 'shots'); fs.mkdirSync(OUT, { recursive: true });
async function mark(p, list) {
  await p.evaluate(list => {
    document.querySelectorAll('.gmk').forEach(x => x.remove());
    list.forEach(([sel, n, corner]) => {
      const all = [...document.querySelectorAll(sel)].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height; });
      const e = all[0]; if (!e) return; const r = e.getBoundingClientRect();
      const f = document.createElement('div'); f.className = 'gmk';
      f.style.cssText = `position:fixed;z-index:99998;left:${r.left - 3}px;top:${r.top - 3}px;width:${r.width + 6}px;height:${r.height + 6}px;border:2.5px solid #E07B39;border-radius:10px;pointer-events:none`;
      const d = document.createElement('div'); d.className = 'gmk'; d.textContent = n;
      const x = corner === 'tr' ? r.right - 12 : r.left - 12, y = r.top - 12;
      d.style.cssText = `position:fixed;z-index:99999;left:${Math.max(2, Math.min(innerWidth - 28, x))}px;top:${Math.max(2, y)}px;width:26px;height:26px;border-radius:50%;background:#E07B39;color:#fff;font:800 14px Aptos,Inter,sans-serif;display:grid;place-items:center;box-shadow:0 0 0 2.5px #fff`;
      document.body.append(f, d);
    });
  }, list);
}
const rptPng = async (b, doc, name) => { const f = path.join(OUT, '_' + name + '.html'); fs.writeFileSync(f, doc.replace(/<base href="[^"]*">/, '<base href="' + U + '">'));
  const q = await b.newPage(); await q.goto('file://' + f); await q.waitForLoadState('networkidle'); await W(400); await q.pdf({ path: path.join(OUT, '_' + name + '.pdf'), width: '297mm', height: '210mm', printBackground: true }); await q.close();
  require('child_process').execSync(`pdftoppm -r 90 -png -f 1 -l 1 "${path.join(OUT, '_' + name + '.pdf')}" "${path.join(OUT, name)}" && mv "${path.join(OUT, name + '-1.png')}" "${path.join(OUT, name + '.png')}"`); console.log('📸', name); };
const shot = async (p, name, marks) => { if (marks) await mark(p, marks); await W(150); await p.screenshot({ path: path.join(OUT, name + '.png') }); await p.evaluate(() => document.querySelectorAll('.gmk').forEach(x => x.remove())); console.log('📸', name); };
const closeUpd = p => p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); });
const skipNote = async p => { await W(250); if (!(await p.isVisible('#gcSkip'))) { const o = await p.$('#pBody .item, #pBody button.btn'); if (o) await o.click(); await W(250); } };
(async () => {
  const b = await chromium.launch(); const IMG = fs.readFileSync(path.join(__dirname, 'mau', 'so-giam-thi.jpg'));
  // đăng nhập
  let p = await newPage(b, { mobile: true }); await p.goto(U + 'index.html'); await W(600);
  await p.fill('#lgEm', 'loptruong@example.com'); await shot(p, 'login1', [['#lgEm', 1], ['#lgGo', 2], ['a.lgph', 3]]);
  await p.click('#lgGo'); await p.waitForSelector('#lgCode'); await p.fill('#lgCode', '12');
  await shot(p, 'login2', [['#lgCode', 1], ['#lgRe', 2]]); await p.context().close();
  // GVCN — máy tính
  p = await newPage(b, { as: 'gvcn' }); await p.goto(U + 'index.html'); await p.waitForSelector('#app.on'); await W(3500); await closeUpd(p); await W(300);
  await shot(p, 'd_home', [['#railNav', 1], ['#periodBar', 2], ['#listGhi', 3], ['#hFind', 4, 'tr'], ['#hTheme', 5, 'tr'], ['#hHelp', 6, 'tr']]);
  await p.context().close();
  /* v3.9: dải điểm tuần, tìm kiếm, chú thích, trang Phụ huynh, Cài đặt chia tab, menu avatar */
  p = await newPage(b, { as: 'gvcn', ctx: { viewport: { width: 1440, height: 900 } }, phReg: [{ id: 'R1', ma: 'HS02', ten: 'Trần Gia Chi', email: 'bo.chi@example.com', at: '2026-10-09 09:00' }] });
  await p.goto(U + 'index.html'); await p.waitForSelector('#app.on'); await W(3000); await closeUpd(p); await W(300);
  await p.evaluate(() => { const n = document.getElementById('phNew'); if (n) n.remove(); const m = document.getElementById('msc'); if (m) m.style.display = 'none'; });
  await p.mouse.move(700, 120); await W(200);
  await shot(p, 'd_tk', [['#tk39 .sl', 1], ['#tk39 .nv', 2, 'tr'], ['#v32h .msc', 3]]);
  await p.locator('#tk39 .it').first().click(); await W(400); await shot(p, 'd_tkm', [['#tkm39', 1, 'tr']]); await p.mouse.click(5, 5); await W(200);
  await p.evaluate(() => go('bang')); await W(800); await p.fill('.sq39 input', 'tổ 2 vi phạm'); await W(400);
  await shot(p, 'd_sq', [['.sq39 .in', 1], ['.sq39 .chips', 2], ['#vBang .register', 3]]);
  await p.fill('.sq39 input', ''); await W(300); await p.locator('#vBang .hkcard .mini > div').nth(3).hover(); await W(700);
  await p.screenshot({ path: path.join(OUT, 'd_tip.png') }); console.log('📸 d_tip');
  await p.mouse.move(5, 5); await p.evaluate(() => go('ph')); await W(800);
  await shot(p, 'd_ph', [['#vPH .acts', 1], ['#vPH .kp', 2], ['#vPH .box', 3], ['#phList', 4]]);
  await p.evaluate(() => go('cai')); await W(800);
  await shot(p, 'd_cai', [['.cai39 .ctabs', 1], ['.cai39 .cbody .chd', 2]]);
  await p.click('#hAva'); await W(300); await shot(p, 'd_ava', [['#ava39', 1, 'tr']]);
  await p.context().close();
  // GVCN — điện thoại
  p = await newPage(b, { as: 'gvcn', mobile: true }); await p.goto(U + 'index.html'); await p.waitForSelector('#app.on'); await W(3500); await closeUpd(p); await W(300);
  await shot(p, 'home', [['#periodBar', 1], ['#toFilter', 2], ['#listGhi .row', 3], ['#multiBtn', 4, 'tr'], ['#hFind', 5, 'tr'], ['#tabbar', 6]]);
  await p.locator('#listGhi .row').nth(5).click(); await W(400);
  await shot(p, 'student', [['#pBody .seg', 1], ['#pBody [data-add="T06"]', 2]]);
  await p.click('#pBody [data-add="T06"]'); await skipNote(p);
  const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.click('#evFile')]); await fc.setFiles({ name: 'so-giam-thi.jpg', mimeType: 'image/jpeg', buffer: IMG }); await W(500);
  await shot(p, 'note', [['#gcTxt', 1], ['#gcMic', 2, 'tr'], ['#pBody .evpick .row2', 3], ['#gcSave', 4, 'tr']]);
  await p.click('#gcSave'); await W(900);
  await shot(p, 'saved', [['#toast', 1], ['#msc', 2]]); await W(2600);
  await p.evaluate(() => closePanel()); await W(300);
  await shot(p, 'evchip', [['#listGhi .evchip', 1, 'tr']]);
  const eid = await p.evaluate(() => { const e = S.entries.find(e => e[13] && !/p:/.test(e[13])); return e && e[0]; });
  await p.evaluate(id => evOpen(id), eid); await W(800);
  await shot(p, 'evview', [['#pBody .evcard', 1], ['#evAdd2', 2, 'tr']]); await p.evaluate(() => closePanel()); await W(300);
  await p.click('#multiBtn'); await W(200); for (const i of [1, 2, 4]) { await p.locator('#listGhi .row').nth(i).click(); await W(120); }
  await shot(p, 'multi', [['#multiStrip', 1], ['#listGhi .row.sel', 2], ['#bulkbar', 3]]);
  await p.evaluate(() => exitMulti()); await W(200);
  await p.evaluate(() => go('bang')); await W(500);
  await shot(p, 'bang', [['#vBang .segbar', 1], ['#vBang .viewtoggle', 2], ['#vBang .hkcard', 3]]);
  /* v3.7: chốt tháng */
  p.once('dialog', d => d.accept()); await p.click('#vBang [data-lk="1"]'); await W(900); await p.evaluate(() => { const m = document.getElementById('msc'); if (m) m.style.display = 'none'; });
  await shot(p, 'lock', [['#vBang .lkb', 1], ['#vBang .lkb button', 2, 'tr']]);
  p.once('dialog', d => d.accept()); await p.click('#vBang [data-lk="0"]'); await W(900);
  await p.evaluate(() => openProfile('HS03')); await W(800);
  await shot(p, 'profile', [['#pBody .pf-seg', 1], ['#pBody .pf-res', 2], ['#pfNx', 3], ['#pfPr', 4]]);
  await p.click('#pfNx'); await W(500); const rm = await p.$('#mRemark'); if (rm) { await rm.click(); await W(500); }
  await shot(p, 'remark', [['#rkXl, #pBody select', 1], ['#rkNx', 2]]);
  await p.evaluate(() => { closePanel(); go('tk'); }); await W(600); await shot(p, 'tk', [['#vTK .segbar', 1], ['#vTK .kpis', 2]]);
  await p.evaluate(() => go('ls')); await W(600); await shot(p, 'ls', [['#vLS select, #vLS .filters', 1], ['#vLS button.btn', 2]]);
  await p.evaluate(() => go('cai')); await W(500); await p.evaluate(() => document.querySelector('[data-ct="gd"]').click()); await W(300); await shot(p, 'cai', [['.cai39 .ctabs', 1], ['#caiTheme', 2, 'tr']]);
  await p.evaluate(() => document.querySelector('[data-ct="quyen"]').click()); await W(300);
  await p.evaluate(() => { const h = [...document.querySelectorAll('#vCai .sechead')].find(x => /Tài khoản/.test(x.textContent)); h && h.scrollIntoView(); }); await W(300);
  await shot(p, 'accounts', [['#accAdd', 1, 'tr'], ['#vCai [data-acc]', 2]]);
  await p.evaluate(() => document.querySelector('#accAdd').click()); await W(400); await shot(p, 'accform', [['#aEm', 1], ['#aRole', 2], ['#aTo', 3, 'tr'], ['#aSave', 4, 'tr']]);
  await p.evaluate(() => { closePanel(); document.querySelector('#qTbl').scrollIntoView({ block: 'start' }); document.querySelector('#scroll').scrollBy(0, -60); }); await W(300);
  await shot(p, 'quyen', [['#qTbl table', 1]]);
  await p.evaluate(() => document.querySelector('[data-ct="lop"]').click()); await W(300); await p.evaluate(() => { const b = document.querySelector('#hsTo'); b && b.scrollIntoView({ block: 'center' }); }); await W(200);
  await p.evaluate(() => document.querySelector('#hsTo').click()); await W(300); for (const i of [0, 2]) { await p.locator('#pBody [data-p]').nth(i).click(); await W(150); }
  await shot(p, 'hs_to', [['#pBody .item .check.on', 1], ['#btTo', 2], ['#btSave', 3]]);
  await p.evaluate(() => { closePanel(); openStudentForm(S.students[3].ma); }); await W(400);
  await shot(p, 'hs_form', [['#fTo', 1, 'tr'], ['#fTt', 2, 'tr'], ['#fNghi', 3], ['#fDel', 4]]);
  await p.evaluate(() => { closePanel(); THEME.open(); }); await W(500); await shot(p, 'theme', [['#mscGrid', 1]]);
  await p.evaluate(() => { const g = [...document.querySelectorAll('#pBody .thgrp')][1]; g && g.scrollIntoView(); }); await W(300); await shot(p, 'theme2', [['#pBody .thgrid:nth-of-type(2)', 1]]);
  await p.evaluate(() => closePanel()); await W(200);
  await p.click('#hFind'); await p.keyboard.type('nam'); await W(300); await shot(p, 'find', [['#fq', 1], ['#fls .it', 2]]);
  await p.keyboard.press('Escape'); await p.evaluate(() => go('ghi')); await W(300);
  await p.click('#hHelp'); await W(400); await p.evaluate(() => { document.querySelector('#pBody').scrollTop = 0; }); await W(200); await shot(p, 'help', [['#gTour', 1], ['#gPdf', 2], ['#gPh', 3]]);
  await p.click('#gTour'); await W(1200); await p.click('#tg-card [data-a=n]'); await W(600); await p.click('#tg-card [data-a=n]'); await W(700);
  await shot(p, 'tour', [['#tg-card', 1]]);
  await p.context().close();
  // v3.2 — thẻ tổng quan + cập nhật trực tiếp (điện thoại)
  p = await newPage(b, { as: 'gvcn', mobile: true }); await p.goto(U + 'index.html'); await p.waitForSelector('#app.on'); await W(2500); await closeUpd(p); await W(300);
  await p.evaluate(() => { const m = document.querySelector('#msc'); m && m.remove(); });
  await shot(p, 'hero', [['#v32h .top', 1], ['#v32h .tiles', 2], ['#tk39', 3]]);
  p.M.ext('HS05', 'Đi học muộn', -2); await W(5200);
  await shot(p, 'live', [['#v32pop', 1], ['#v32live', 2, 'tr'], ['#listGhi .ev.fresh', 3]]);
  await W(1500); await p.click('#v32h [data-f=warn]'); await W(400); await p.click('#dr46 [data-flt]'); await W(400); await shot(p, 'hero_loc', [['#v32h .tl.on', 1], ['#v32clr', 2]]);
  await p.click('#tabbar [data-v=bc]'); await W(1500); await shot(p, 'm_bc', [['#vBC .segbar', 1], ['#vBC .bcacts', 2], ['#vBC .kpis', 3]]);
  await p.context().close();
  // v3.3 — báo cáo (máy tính)
  p = await newPage(b, { as: 'gvcn' }); await p.goto(U + 'index.html'); await p.waitForSelector('#app.on'); await W(1500); await closeUpd(p);
  await p.click('#railNav [data-v=bc]'); await W(1500);
  await shot(p, 'd_bc', [['#vBC .segbar', 1], ['#vBC .bcacts', 2], ['#vBC .kpis', 3], ['#vBC .bcgrid .panelbox', 4]]);
  await p.evaluate(() => { const t = [...document.querySelectorAll('#vBC .sechead')].find(x => /Thi đua/.test(x.textContent)); document.querySelector('#scroll').scrollTo(0, t.offsetTop - 130); }); await W(300);
  await shot(p, 'd_bc2', [['#vBC .bct', 1], ['#vBC .bcgrid > div:nth-child(2) .register', 2]]);
  await p.evaluate(() => { document.querySelector('#bcNx').scrollIntoView({ block: 'center' }); }); await W(300);
  await shot(p, 'd_bc3', [['#bcNx', 1], ['#bcPh', 2], ['#vBC [data-auto]', 3, 'tr']]);
  await p.evaluate(() => { const o = RPT.open; RPT.open = (h, t) => o(h, t, { dry: true }); bcPrint(bcPeriod()); }); await W(300);
  await rptPng(b, await p.evaluate(() => RPT.last), 'bc_print');
  await p.evaluate(() => RPT.open(RPT.student({ cfg: S.cfg, students: S.students, entries: S.entries, remarks: S.remarks }, 'HS03', { k: 'thang', m: S.thang }, {}), 'x', { dry: true }));
  await rptPng(b, await p.evaluate(() => RPT.last), 'hs_pdf');
  await p.context().close();
  // cán bộ lớp (tổ trưởng) — điện thoại + lưu chậm
  p = await newPage(b, { as: 'tt', mobile: true, lag: 6000 }); await p.goto(U + 'index.html'); await p.waitForSelector('#app.on'); await W(7000); await closeUpd(p); await W(300);
  await shot(p, 'tt_home', [['#periodBar', 1], ['#toFilter', 2], ['#listGhi .row', 3]]);
  await p.locator('#listGhi .row').nth(1).click(); await W(300); await p.click('#pBody [data-add="T04"]'); await skipNote(p); await p.click('#gcSkip'); await W(500);
  await p.evaluate(() => closePanel()); await W(300);
  await shot(p, 'tt_saving', [['#hkq', 1], ['#toast .undo, #toastUndo', 2, 'tr']]);
  await p.context().close();
  // phụ huynh
  p = await newPage(b, { mobile: true }); await p.goto(U + 'phu-huynh.html'); await W(1500);
  await shot(p, 'ph_list', [['#q', 1], ['#toc', 2], ['#lst .st', 3]]);
  await p.fill('#q', 'khoa'); await W(200); await p.locator('#lst .st').first().click(); await W(600);
  await shot(p, 'ph_prof', [['#ks', 1], ['.res', 2], ['.acts', 3]]);
  await p.evaluate(() => window.scrollTo(0, 600)); await W(300); await shot(p, 'ph_ev', [['.ev', 1]]);
  /* v3.7: đăng ký email + thông báo từ link email */
  await p.evaluate(() => { const m = document.getElementById('msc'); if (m) m.style.display = 'none'; document.querySelector('#reg').scrollIntoView({ block: 'center' }); }); await W(300);
  await shot(p, 'ph_reg', [['#rgE', 1], ['#rgS', 2, 'tr']]);
  { const ma = await p.evaluate(() => S.ma), e = p.M.D.entries.filter(x => x[4] === ma && x[9] < 0).slice(-1)[0] || p.M.D.entries.filter(x => x[4] === ma).slice(-1)[0];
    await p.evaluate(([m, t]) => { location.hash = 'hs=' + m + '&tb=' + t; }, [ma, e[0]]); await W(900); await p.evaluate(() => { const m = document.getElementById('msc'); if (m) m.style.display = 'none'; window.scrollTo(0, 0); });
    await shot(p, 'ph_tb', [['.tbc', 1], ['#tbPdf', 2]]);
    await p.evaluate(() => { const o = RPT.open; RPT.open = (h, t) => o(h, t, { dry: true }); }); await p.click('#tbPdf'); await rptPng(b, await p.evaluate(() => RPT.last), 'tb_pdf'); }
  await p.click('#tabs [data-t=lop]'); await W(500); await shot(p, 'ph_lop', [['#lk', 1], ['.dist', 2], ['#csvL', 3], ['#pdfL', 4, 'tr']]);
  await p.click('#hp'); await W(900); await shot(p, 'ph_tour', [['#tg-card', 1]]);
  await p.context().close();
  await b.close();
})();
