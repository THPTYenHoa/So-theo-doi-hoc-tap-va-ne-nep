/* Vẽ các lớp hình 1920×1080 cho video: nền (bg_desk / bg_mob), lớp chữ trong suốt cho từng chú thích, trang tiêu đề (card).
   node tools/video/chrome.js <spec.json>   — spec: [{out, kind:'bg'|'fg'|'card', layout:'desk'|'mob', ...}] */
const { chromium } = require('playwright'); const fs = require('fs');
const U = 'http://127.0.0.1:8768/';
const L = {
  desk: { x: 60, y: 132, w: 1440, h: 810, r: 16 },
  mob: { x: 220, y: 150, w: 398, h: 860, r: 44 }
};
const CH = ['Đăng nhập', 'Ghi điểm', 'Tổng quan', 'Hạnh kiểm', 'Hồ sơ', 'Thống kê', 'Báo cáo', 'Phụ huynh'];
const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const CSS = `<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=block" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0}html,body{width:1920px;height:1080px;overflow:hidden;font-family:'Be Vietnam Pro',sans-serif;color:#17343B}
.bg{position:absolute;inset:0;background:radial-gradient(1200px 700px at 85% 10%,#DDF0F1 0%,rgba(221,240,241,0) 70%),radial-gradient(900px 600px at 0% 100%,#FFF4E2 0%,rgba(255,244,226,0) 70%),linear-gradient(160deg,#EEF7F8,#F8FBFB 60%,#FFFBF3)}
.win{position:absolute;background:#fff;box-shadow:0 30px 70px rgba(14,60,70,.18),0 6px 18px rgba(14,60,70,.10)}
.phone{position:absolute;background:#16262B;box-shadow:0 40px 80px rgba(14,60,70,.28),0 8px 20px rgba(14,60,70,.18)}
.hd{position:absolute;left:60px;top:34px;display:flex;align-items:center;gap:18px}
.hd img{width:66px;height:66px;border-radius:50%;box-shadow:0 3px 10px rgba(20,40,80,.15)}
.hd .a{font-size:19px;color:#5A777E;font-weight:600}.hd .b{font-size:30px;font-weight:800;color:#0A5C64;letter-spacing:-.01em}
.chip{display:inline-block;margin-left:6px;padding:6px 16px;border-radius:99px;background:#0E7C86;color:#fff;font-size:20px;font-weight:700;vertical-align:4px}
.brd{position:absolute;border:2px solid rgba(14,124,134,.18);pointer-events:none}
.cap{position:absolute;display:flex;flex-direction:column;justify-content:center}
.cap .k{font-size:20px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#E07B39;margin-bottom:16px}
.cap .t{font-weight:800;color:#0A5C64;line-height:1.28;letter-spacing:-.01em}
.cap .s{color:#41606A;line-height:1.5;margin-top:18px;font-weight:500}
.cap .bar{width:64px;height:6px;border-radius:6px;background:#E07B39;margin-bottom:22px}
.chs{position:absolute;left:60px;right:60px;bottom:40px;display:flex;gap:10px;justify-content:center}
.chs span{font-size:17px;font-weight:600;color:#7B979D;padding:7px 15px;border-radius:99px;background:rgba(255,255,255,.7);border:1px solid #DCE9EB}
.chs span.on{background:#0E7C86;color:#fff;border-color:#0E7C86}
.chs span.done{color:#0E7C86}
/* trang tiêu đề */
.card{position:absolute;inset:0;padding:110px 130px;display:flex;flex-direction:column;justify-content:center}
.card .lg{width:150px;height:150px;border-radius:50%;box-shadow:0 8px 26px rgba(20,40,80,.16);margin-bottom:34px}
.card .k{font-size:24px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#E07B39;margin-bottom:14px}
.card h1{font-size:84px;line-height:1.08;font-weight:800;color:#0A5C64;letter-spacing:-.02em}
.card h2{font-size:64px;line-height:1.12;font-weight:800;color:#0A5C64;letter-spacing:-.015em;max-width:1200px;text-wrap:balance}
.card .l1{font-size:34px;color:#2C4C55;margin-top:22px;font-weight:600}.card .l2{font-size:28px;color:#5A777E;margin-top:12px;font-weight:500}
.card ul{list-style:none;margin-top:44px;max-width:1150px}
.card li{display:flex;gap:22px;align-items:flex-start;font-size:36px;line-height:1.4;color:#23434B;margin:0 0 26px;font-weight:500}
.card li i{flex:none;width:48px;height:48px;border-radius:50%;background:#E07B39;color:#fff;font-style:normal;font-weight:800;font-size:24px;display:grid;place-items:center;margin-top:2px}
.ms{position:absolute;right:120px;bottom:90px;width:460px;height:460px;object-fit:contain;filter:drop-shadow(0 18px 24px rgba(14,60,70,.15))}
.card .url{margin-top:30px;display:inline-block;font-size:30px;font-weight:700;color:#0E7C86;background:#fff;border:2px solid #CFE5E8;border-radius:16px;padding:14px 26px}
.card .big{font-size:150px;font-weight:800;color:#E07B39;line-height:1;margin-bottom:6px}
.foot{position:absolute;left:130px;bottom:56px;font-size:22px;color:#7B979D;font-weight:600}
</style>`;
function header(title) { return `<div class="hd"><img src="${U}img/logo-yenhoa.webp"><div><div class="a">Trường THPT Yên Hòa · Năm học 2026 – 2027</div><div class="b">Sổ theo dõi học sinh 11D3 <span class="chip">${esc(title)}</span></div></div></div>`; }
function chapters(ch, mob) { return `<div class="chs"${mob ? ' style="left:860px;right:40px;justify-content:flex-start;flex-wrap:wrap"' : ''}>${CH.map((c, i) => `<span class="${i === ch ? 'on' : i < ch ? 'done' : ''}">${c}</span>`).join('')}</div>`; }
function html(s) {
  const g = L[s.layout || 'desk'];
  if (s.kind === 'bg') {
    if (s.layout === 'mob') return `<div class="bg"></div><div class="phone" style="left:${g.x - 16}px;top:${g.y - 16}px;width:${g.w + 32}px;height:${g.h + 32}px;border-radius:${g.r + 14}px"></div>`;
    return `<div class="bg"></div><div class="win" style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px;border-radius:${g.r}px"></div>`;
  }
  if (s.kind === 'mask') return `<div style="position:absolute;left:0;top:0;width:${g.w}px;height:${g.h}px;border-radius:${g.r}px;background:#fff"></div>`;
  if (s.kind === 'fg') {
    const mob = s.layout === 'mob', cx = mob ? 860 : 1540, cw = mob ? 960 : 330, ts = mob ? (s.text.length > 70 ? 50 : 56) : (s.text.length > 80 ? 30 : s.text.length > 55 ? 33 : 36), ss = mob ? 32 : 23;
    return header(s.title) + (mob ? '' : `<div class="brd" style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${g.h}px;border-radius:${g.r}px"></div>`)
      + `<div class="cap" style="left:${cx}px;top:${g.y}px;width:${cw}px;height:${g.h}px"><div class="k">${esc(s.step || '')}</div><div class="bar"></div><div class="t" style="font-size:${ts}px">${esc(s.text)}</div>${s.sub ? `<div class="s" style="font-size:${ss}px">${esc(s.sub)}</div>` : ''}</div>`
      + chapters(s.ch, mob);
  }
  if (s.kind === 'card') {
    const b = s.body || {};
    return `<div class="bg"></div><div class="card">${b.logo ? `<img class="lg" src="${U}img/logo-yenhoa.webp">` : ''}${b.big ? `<div class="big">${esc(b.big)}</div>` : ''}${b.k ? `<div class="k">${esc(b.k)}</div>` : ''}
      ${b.h1 ? `<h1>${b.h1}</h1>` : ''}${b.h2 ? `<h2>${b.h2}</h2>` : ''}${b.l1 ? `<div class="l1">${b.l1}</div>` : ''}${b.l2 ? `<div class="l2">${b.l2}</div>` : ''}
      ${b.li ? `<ul>${b.li.map((x, i) => `<li><i>${i + 1}</i><span>${x}</span></li>`).join('')}</ul>` : ''}${b.url ? `<div><span class="url">${esc(b.url)}</span></div>` : ''}</div>
      ${b.ms ? `<img class="ms" src="${U}mascot/chu-nhiem/${b.ms}.webp">` : ''}${b.foot ? `<div class="foot">${b.foot}</div>` : ''}`;
  }
}
(async () => {
  const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const s of spec) {
    const g = L[s.layout || 'desk'];
    await p.setContent(`<!doctype html><html><head><meta charset="utf-8">${CSS}</head><body style="background:${s.kind === 'mask' ? '#000' : 'transparent'}">${html(s)}</body></html>`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const clip = s.kind === 'mask' ? { x: 0, y: 0, width: g.w, height: g.h } : undefined;
    await p.screenshot({ path: s.out, omitBackground: s.kind === 'fg', clip });
  }
  await b.close(); console.log('🖼', spec.length, 'lớp hình');
})();
