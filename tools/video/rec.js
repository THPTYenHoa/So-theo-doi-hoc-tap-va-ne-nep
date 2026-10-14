/* Quay video giới thiệu (dữ liệu GIẢ, backend giả lập tools/test/mock.js).
   Chạy: python3 -m http.server 8768 (thư mục repo) rồi  NODE_PATH=$(npm root -g) node tools/video/rec.js [tên cảnh…]
   Mỗi cảnh ⇒ OUT/<cảnh>/f_00001.jpg… + meta.json {frames:[{f,t}], caps:[{t,text,sub}], w,h,mobile}. Dựng video: tools/video/build.py */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const { newPage } = require('../test/mock');
const U = 'http://127.0.0.1:8768/', OUT = process.env.OUT || '/tmp/hk_video', W = ms => new Promise(r => setTimeout(r, ms));
const DESK = { width: 1440, height: 810 };

/* con trỏ chuột / vòng chạm vẽ vào trang (không ảnh hưởng thao tác) */
function cursorJS(mobile) {
  if (!document.documentElement || !document.body) { addEventListener('DOMContentLoaded', () => cursorJS(mobile), { once: true }); return; }
  if (document.getElementById('vcur')) return;
  const st = document.createElement('style');
  st.textContent = `#vcur{position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;transition:opacity .2s;will-change:transform}
  #vcur.m{width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;background:rgba(255,255,255,.35);border:3px solid rgba(224,123,57,.95);box-shadow:0 2px 10px rgba(0,0,0,.25)}
  #vcur.d{width:26px;height:26px}
  .vrip{position:fixed;z-index:2147483646;pointer-events:none;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:50%;border:4px solid rgba(224,123,57,.9);animation:vrip .6s ease-out forwards}
  @keyframes vrip{from{transform:scale(.25);opacity:1}to{transform:scale(1.15);opacity:0}}`;
  document.documentElement.appendChild(st);
  const c = document.createElement('div'); c.id = 'vcur'; c.className = mobile ? 'm' : 'd';
  if (!mobile) c.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M4 2l16 10.5-7 1.2 4 7.3-3 1.5-4-7.3L4 20z" fill="#1B333A" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  c.style.opacity = mobile ? '0' : '1'; c.style.transform = 'translate(-60px,-60px)';
  document.documentElement.appendChild(c);
  addEventListener('mousemove', e => { c.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; if (mobile) c.style.opacity = '1'; }, true);
  addEventListener('mousedown', e => { const r = document.createElement('div'); r.className = 'vrip'; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px'; document.documentElement.appendChild(r); setTimeout(() => r.remove(), 700); }, true);
  if (mobile) addEventListener('mouseup', () => setTimeout(() => { c.style.opacity = '0'; }, 350), true);
}

async function record(b, name, o, fn) {
  const dir = path.join(OUT, name); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const p = await newPage(b, Object.assign({ ctx: o.mobile ? {} : { viewport: DESK } }, o.mock || {}, { as: o.as, mobile: !!o.mobile }));
  /* dữ liệu giả cho video: không để 2 học sinh trùng họ tên */
  const MID = ['Anh', 'Hoàng', 'Quỳnh', 'Tuấn', 'Diệu', 'Kim', 'Xuân', 'Hồng', 'Việt', 'Thảo', 'Huy', 'Nhật'], seen = new Set();
  p.M.D.students.forEach((st, i) => { let k = 0; while (seen.has(st.ten)) { const w = st.ten.split(' '); w[1] = MID[(i + k++) % MID.length]; st.ten = w.join(' '); } seen.add(st.ten); });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(cursorJS, !!o.mobile);
  await p.goto(U + (o.url || 'index.html'));
  if (o.ready) await o.ready(p); else { await p.waitForSelector('#app.on', { timeout: 15000 }); await W(1500); }
  await p.evaluate(() => { const c = document.querySelector('#updOk'); c && c.click(); });
  await W(500);
  const cdp = await p.context().newCDPSession(p), frames = []; let n = 0;
  cdp.on('Page.screencastFrame', async f => {
    const fn2 = 'f_' + String(++n).padStart(5, '0') + '.jpg'; fs.writeFileSync(path.join(dir, fn2), Buffer.from(f.data, 'base64'));
    frames.push({ f: fn2, t: f.metadata.timestamp }); cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  });
  const vp = p.viewportSize(), sc = o.mobile ? 2 : 1;
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: vp.width * sc, maxHeight: vp.height * sc, everyNthFrame: 1 });
  /* trang đứng yên thì không có khung mới ⇒ ép 1 khung bằng thay đổi nhỏ vô hình */
  await p.evaluate(() => { const d = document.createElement('div'); d.id = 'vtick'; d.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;z-index:2147483647;pointer-events:none;opacity:.01;background:#000'; document.documentElement.appendChild(d); let k = 0; setInterval(() => { d.style.opacity = (k++ % 2) ? '.01' : '.02'; }, 100); });
  const caps = []; let lastCap = 0, minNext = 0;
  const now = () => Date.now() / 1000;
  const A = {
    p, W,
    /* chú thích hiện bên phải video; min = thời gian tối thiểu (ms) trước chú thích kế tiếp */
    async cap(text, sub, min) { const t = now(); if (t < minNext) await W((minNext - t) * 1000); caps.push({ t: now(), text, sub: sub || '' }); minNext = now() + Math.max(min || 0, 1600 + (text.length + (sub || '').length) * 72) / 1000;   /* đủ thời gian đọc / lồng giọng (~14 chữ cái/giây) */ },
    async hold() { const t = now(); if (t < minNext) await W((minNext - t) * 1000 + 300); },
    async box(sel) { const l = p.locator(sel).first(); await l.waitFor({ state: 'visible', timeout: 8000 });
      await l.evaluate(e => e.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })).catch(() => {}); await W(650); return l.boundingBox(); },
    async move(sel, ms = 650) { const bb = typeof sel === 'string' ? await A.box(sel) : sel; const x = bb.x + bb.width / 2, y = bb.y + bb.height / 2;
      const s = A._pos || { x: vp.width * 0.6, y: vp.height * 0.7 }, N = Math.max(8, Math.round(ms / 22));
      for (let i = 1; i <= N; i++) { const k = i / N, e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; await p.mouse.move(s.x + (x - s.x) * e, s.y + (y - s.y) * e); await W(18); }
      A._pos = { x, y }; return { x, y }; },
    async click(sel, after = 700) { const { x, y } = await A.move(sel); await W(220); await p.mouse.down(); await W(90); await p.mouse.up(); await W(after); },
    async type(sel, text, d = 75) { await A.click(sel, 200); await p.keyboard.type(text, { delay: d }); await W(400); },
    async scroll(dy, ms = 900) { if (!o.mobile && (!A._pos || A._pos.x < 320)) await A.move({ x: vp.width * 0.58 - 1, y: vp.height * 0.55 - 1, width: 2, height: 2 }, 500); const N = Math.round(ms / 30); for (let i = 0; i < N; i++) { await p.mouse.wheel(0, dy / N); await W(30); } await W(300); },
    async ev(f, arg) { return p.evaluate(f, arg); }
  };
  try { await fn(A); await A.hold(); await W(500); }
  catch (e) { console.log('❌', name, e.message.split('\n')[0]); }
  await cdp.send('Page.stopScreencast').catch(() => {}); await W(300);
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify({ name, mobile: !!o.mobile, w: vp.width * sc, h: vp.height * sc, end: now(), frames, caps, title: o.title || '' }, null, 1));
  console.log((errs.length ? '⚠️ ' : '🎬 ') + name, frames.length + ' khung', ((now() - (frames[0] || { t: now() }).t)).toFixed(1) + ' s', errs.join(' | ').slice(0, 200));
  await p.context().close();
}

module.exports = { record, U, W };
if (require.main === module) {
  const S = require('./scenes'); const want = process.argv.slice(2);
  (async () => { const b = await chromium.launch();
    for (const s of S) if (!want.length || want.includes(s.name)) await record(b, s.name, s, s.run);
    await b.close(); })();
}
