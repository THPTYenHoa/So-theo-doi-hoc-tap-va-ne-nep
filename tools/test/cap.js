/* Ảnh cho thông báo v3.0 (dữ liệu GIẢ): NODE_PATH=$(npm root -g) node tools/test/cap.js → /tmp/claude-0/hk3_*.png */
const { chromium } = require('playwright'); const { newPage } = require('./mock');
const U = 'http://127.0.0.1:8768/', W = ms => new Promise(r => setTimeout(r, ms)), O = '/tmp/claude-0/hk3_';
const skip = async p => { await W(250); if (!(await p.isVisible('#gcSkip'))) { const o = await p.$('#pBody .item, #pBody button.btn'); if (o) await o.click(); await W(250); } if (await p.isVisible('#gcSkip')) await p.click('#gcSkip'); };
const close = p => p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); });
(async () => {
  const b = await chromium.launch();
  for (const mob of [true, false]) { const sfx = mob ? 'm' : 'd';
    let p = await newPage(b, { mobile: mob }); await p.goto(U + 'index.html'); await W(500);
    await p.fill('#lgEm', 'loptruong@example.com'); await p.screenshot({ path: O + 'login1_' + sfx + '.png' });
    await p.click('#lgGo'); await p.waitForSelector('#lgCode'); await p.fill('#lgCode', '12'); await p.screenshot({ path: O + 'login2_' + sfx + '.png' });
    await p.fill('#lgCode', '123456'); await W(1500); await p.screenshot({ path: O + 'upd_' + sfx + '.png' }); await close(p); await W(300);
    await p.screenshot({ path: O + 'ghi_' + sfx + '.png' });
    await p.context().close();
    p = await newPage(b, { as: 'lt', mobile: mob, lag: 6000 }); await p.goto(U + 'index.html'); await p.waitForSelector('#app.on'); await W(7000); await close(p);
    await p.locator('#listGhi .row').nth(2).click(); await W(300); await p.click('#pBody [data-add="T06"]'); await skip(p); await W(400);
    await p.evaluate(() => closePanel()); await W(300);
    await p.screenshot({ path: O + 'saving_' + sfx + '.png' });
    await p.context().close();
    p = await newPage(b, { as: 'gvcn', mobile: mob }); await p.goto(U + 'index.html'); await p.waitForSelector('#app.on'); await W(3500); await close(p);
    await p.click('#hFind'); await p.keyboard.type('nam'); await W(300); await p.screenshot({ path: O + 'find_' + sfx + '.png' });
    await p.keyboard.press('Enter'); await W(700); await p.screenshot({ path: O + 'profile_' + sfx + '.png' });
    await p.evaluate(() => closePanel()); await W(300);
    await p.evaluate(() => THEME.pick('man-chin')); await p.click('#hTheme'); await W(400); await p.screenshot({ path: O + 'theme_' + sfx + '.png' });
    await p.evaluate(() => closePanel()); await p.evaluate(() => go('bang')); await W(500); await p.screenshot({ path: O + 'bang_man_' + sfx + '.png' });
    await p.evaluate(() => THEME.pick('cham-mau-nuoc')); await p.evaluate(() => go('tk')); await W(500); await p.screenshot({ path: O + 'tk_cham_' + sfx + '.png' });
    await p.evaluate(() => THEME.pick('vo-o-ly')); await p.evaluate(() => go('ghi')); await W(500); await p.screenshot({ path: O + 'ghi_voly_' + sfx + '.png' });
    await p.context().close();
    p = await newPage(b, { mobile: mob }); await p.goto(U + 'phu-huynh.html'); await W(1200); await p.fill('#q', 'khoa'); await W(200); await p.locator('#lst .st').first().click(); await W(500);
    await p.screenshot({ path: O + 'ph_' + sfx + '.png' }); await p.context().close();
  }
  await b.close();
})();
