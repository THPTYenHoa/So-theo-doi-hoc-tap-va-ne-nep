/* Dựng WEB DEMO từ app thật: node tools/demo/build.js
   index.html ⇒ demo.html, phu-huynh.html ⇒ demo-phu-huynh.html (cùng thư mục ⇒ mọi đường dẫn ảnh / script dùng chung).
   Chèn demo/htdemo.js + demo/server.js (máy chủ ảo, tách bộ nhớ) đầu <head> và demo/gate.js (mã truy cập 11D3Yenhoa) cuối <body>.
   CHẠY LẠI mỗi khi sửa index.html / phu-huynh.html (bước bắt buộc trong quy trình phát hành). */
const fs = require('fs'), path = require('path');
const R = path.resolve(__dirname, '../..');
function make(src, dst, title, extra) {
  let h = fs.readFileSync(path.join(R, src), 'utf8');
  const head = '<meta charset="utf-8">';
  if (!h.includes(head)) throw new Error(src + ': không thấy ' + head);
  h = h.replace(head, head + '\n<!-- WEB DEMO (tự sinh bởi tools/demo/build.js — KHÔNG sửa tay) -->\n<meta name="robots" content="noindex">\n<script src="demo/htdemo.js"></script>\n<script src="demo/server.js"></script>');
  h = h.replace(/<title>([^<]*)<\/title>/, (m, t) => '<title>' + title + '</title>');
  h = h.replace(/(["'(])phu-huynh\.html/g, '$1demo-phu-huynh.html');
  for (const [a, b] of extra) { if (!h.includes(a)) throw new Error(src + ': không thấy đoạn cần thay: ' + a); h = h.split(a).join(b); }
  const i = h.lastIndexOf('</body>'); if (i < 0) throw new Error(src + ': không thấy </body>');
  h = h.slice(0, i) + '<script src="demo/gate.js"></script>\n' + h.slice(i);
  fs.writeFileSync(path.join(R, dst), h);
  console.log(dst, (h.length / 1024).toFixed(0) + ' KB');
}
make('index.html', 'demo.html', 'Demo · Theo dõi thi đua và nề nếp', []);
make('phu-huynh.html', 'demo-phu-huynh.html', 'Demo · Theo dõi thi đua và nề nếp · Cha mẹ học sinh', [
  ['Object.keys(localStorage)', 'DEMO.keys()'],
  ["location.replace('./')", "location.replace('demo.html')"],
  ['<a href="./">', '<a href="demo.html">']]);
