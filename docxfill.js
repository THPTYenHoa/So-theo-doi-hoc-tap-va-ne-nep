/* ══ v5.0 — DOCXFILL: điền dữ liệu vào khuôn Word (.docx) ngay trên trình duyệt (JSZip, vendor/jszip.min.js) ══
   Khuôn tạo bằng tools/socn/lam_khuon.py — giữ nguyên trình bày của file mẫu, chỉ thêm ô đánh dấu:
     {{khoa}}            giá trị đơn; giá trị nhiều dòng ở đoạn chỉ có ô này ⇒ tách thành nhiều đoạn (giữ định dạng)
     {{*ds.truong}}      dòng bảng lặp theo mảng ds (các dòng liền nhau cùng ds = 1 nhóm lặp); ds._min = số dòng tối thiểu
     {{#ds}} … {{/ds}}   nhóm đoạn / bảng ở thân văn bản lặp theo mảng ds; bên trong dùng {{.truong}}
     {{img:khoa}}        ảnh: data.img[khoa] = [{data:ArrayBuffer|Uint8Array|base64, mime, w, h}]
   DOCXFILL.fill(arrayBufferKhuon, data) ⇒ Blob .docx */
(function () {
  'use strict';
  const NS = {
    w: 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    r: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    wp: 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
    a: 'http://schemas.openxmlformats.org/drawingml/2006/main',
    pic: 'http://schemas.openxmlformats.org/drawingml/2006/picture'
  };
  const MK = /\{\{([^{}]+)\}\}/g;
  const kids = (el, ln) => Array.from(el.childNodes).filter(n => n.nodeType === 1 && n.namespaceURI === NS.w && n.localName === ln);
  const all = (el, ln) => Array.from(el.getElementsByTagNameNS(NS.w, ln));
  const ptext = p => all(p, 't').map(t => t.textContent).join('');
  const str = v => v == null ? '' : String(v);

  function getPath(obj, path) {
    let o = obj;
    for (const k of path.split('.')) { if (o == null) return ''; o = o[k]; }
    return o == null ? '' : o;
  }

  /* Thay ô đánh dấu trong 1 đoạn. ctx: dữ liệu chung; it: phần tử đang lặp ({{.x}}); row: {name, item} ({{*name.x}}) */
  function look(key, ctx, it, row) {
    if (key[0] === '.') return it ? getPath(it, key.slice(1)) : '';
    if (key[0] === '*') { const [nm, ...f] = key.slice(1).split('.'); return row && row.name === nm ? getPath(row.item, f.join('.')) : ''; }
    return getPath(ctx, key);
  }
  function fillPara(p, ctx, it, row) {
    const ts = all(p, 't');
    if (!ts.some(t => t.textContent.indexOf('{{') >= 0)) return;
    const whole = ptext(p).trim();
    const only = whole.match(/^\{\{([^{}]+)\}\}$/);
    if (only && !/^img:|^[#/]/.test(only[1])) {
      const v = str(look(only[1], ctx, it, row));
      if (v.indexOf('\n') >= 0) {
        const lines = v.replace(/\r/g, '').split('\n');
        let ref = p;
        lines.forEach((ln, i) => {
          const q = i === 0 ? p : p.cloneNode(true);
          setParaText(q, ln);
          if (i > 0) { ref.parentNode.insertBefore(q, ref.nextSibling); ref = q; }
        });
        return;
      }
    }
    ts.forEach(t => {
      const s = t.textContent;
      if (s.indexOf('{{') < 0) return;
      t.textContent = s.replace(MK, (_, k) => str(look(k.trim(), ctx, it, row)).replace(/\r?\n/g, '; '));
      t.setAttribute('xml:space', 'preserve');
    });
  }
  function setParaText(p, text) {
    const ts = all(p, 't');
    if (!ts.length) return;
    ts[0].textContent = text; ts[0].setAttribute('xml:space', 'preserve');
    ts.slice(1).forEach(t => { t.textContent = ''; });
  }
  function fillAllParas(root, ctx, it, row) {
    const ps = all(root, 'p'); if (root.localName === 'p' && root.namespaceURI === NS.w) ps.unshift(root);
    ps.forEach(p => fillPara(p, ctx, it, row));
  }

  /* ── dòng bảng lặp ── */
  function rowList(tr) { const m = ptext(tr).match(/\{\{\*([a-zA-Z0-9_]+)\./); return m ? m[1] : null; }
  function expandRows(root, ctx, it) {
    all(root, 'tbl').forEach(tbl => {
      const trs = kids(tbl, 'tr');
      for (let i = 0; i < trs.length; i++) {
        const nm = rowList(trs[i]); if (!nm) continue;
        const grp = [trs[i]]; while (i + 1 < trs.length && rowList(trs[i + 1]) === nm) grp.push(trs[++i]);
        let list = (it && it[nm]) || ctx[nm] || [];
        if (!Array.isArray(list)) list = [];
        const min = (list._min != null ? list._min : 1);
        const items = list.slice(); while (items.length < min) items.push({});
        const anchor = grp[grp.length - 1].nextSibling;
        items.forEach(item => grp.forEach(tr => {
          const c = tr.cloneNode(true);
          tbl.insertBefore(c, anchor);
          fillAllParas(c, ctx, it, { name: nm, item });
        }));
        grp.forEach(tr => tbl.removeChild(tr));
      }
    });
  }

  /* ── nhóm đoạn / bảng lặp ở thân văn bản ── */
  function expandBlocks(body, ctx) {
    for (let guard = 0; guard < 50; guard++) {
      const ps = kids(body, 'p');
      const start = ps.find(p => /^\{\{#[a-zA-Z0-9_]+\}\}$/.test(ptext(p).trim()));
      if (!start) return;
      const nm = ptext(start).trim().slice(3, -2);
      const els = []; let n = start.nextSibling, end = null;
      while (n) { if (n.nodeType === 1 && n.localName === 'p' && ptext(n).trim() === '{{/' + nm + '}}') { end = n; break; } if (n.nodeType === 1) els.push(n); n = n.nextSibling; }
      if (!end) { body.removeChild(start); continue; }
      const list = Array.isArray(ctx[nm]) ? ctx[nm] : [];
      list.forEach(item => els.forEach(e => {
        const c = e.cloneNode(true);
        body.insertBefore(c, end);
        expandRows(c, ctx, item);
        fillAllParas(c, ctx, item, null);
      }));
      els.forEach(e => body.removeChild(e));
      body.removeChild(start); body.removeChild(end);
    }
  }

  /* ── ảnh ── */
  function b64ToU8(s) { const bin = atob(String(s).replace(/^data:[^,]+,/, '')); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
  function drawingXml(rid, id, cx, cy, name) {
    return `<w:r xmlns:w="${NS.w}"><w:drawing><wp:inline xmlns:wp="${NS.wp}" distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/>`
      + `<wp:docPr id="${id}" name="${name}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="${NS.a}" noChangeAspect="1"/></wp:cNvGraphicFramePr>`
      + `<a:graphic xmlns:a="${NS.a}"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="${NS.pic}">`
      + `<pic:nvPicPr><pic:cNvPr id="${id}" name="${name}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip xmlns:r="${NS.r}" r:embed="${rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>`
      + `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
  }

  async function fill(buf, data) {
    const zip = await JSZip.loadAsync(buf);
    const parser = new DOMParser(), ser = new XMLSerializer();
    const doc = parser.parseFromString(await zip.file('word/document.xml').async('string'), 'application/xml');
    const relsDoc = parser.parseFromString(await zip.file('word/_rels/document.xml.rels').async('string'), 'application/xml');
    let ct = await zip.file('[Content_Types].xml').async('string');
    const body = doc.getElementsByTagNameNS(NS.w, 'body')[0];
    const ctx = data || {};

    // khổ giấy ⇒ bề rộng tối đa của ảnh
    const pg = doc.getElementsByTagNameNS(NS.w, 'pgSz')[0], mar = doc.getElementsByTagNameNS(NS.w, 'pgMar')[0];
    const twip = (el, a, d) => el ? Number(el.getAttributeNS(NS.w, a) || el.getAttribute('w:' + a)) || d : d;
    const maxW = (twip(pg, 'w', 11906) - twip(mar, 'left', 850) - twip(mar, 'right', 850)) * 635;   // twip → EMU
    const maxH = (twip(pg, 'h', 16838) - twip(mar, 'top', 850) - twip(mar, 'bottom', 850)) * 635 * 0.82;

    expandBlocks(body, ctx);
    expandRows(body, ctx, null);

    // ảnh
    let relN = 1000, picN = 5000;
    const relsRoot = relsDoc.documentElement, types = new Set();
    for (const p of all(body, 'p')) {
      const m = ptext(p).trim().match(/^\{\{img:([a-zA-Z0-9_]+)\}\}$/);
      if (!m) continue;
      const imgs = ((ctx.img || {})[m[1]] || []).filter(x => x && x.data);
      if (!imgs.length) { setParaText(p, ''); continue; }
      all(p, 'r').forEach(r => r.parentNode.removeChild(r));
      let ref = p;
      imgs.forEach((im, i) => {
        const q = i === 0 ? p : p.cloneNode(true);
        if (i > 0) { ref.parentNode.insertBefore(q, ref.nextSibling); ref = q; }
        const ext = /png/i.test(im.mime || '') ? 'png' : 'jpeg';
        types.add(ext);
        const fname = 'socn_' + (++relN) + '.' + (ext === 'jpeg' ? 'jpg' : 'png');
        zip.file('word/media/' + fname, im.data instanceof ArrayBuffer || im.data instanceof Uint8Array ? im.data : b64ToU8(im.data));
        const rid = 'rIdS' + relN;
        const rel = relsDoc.createElementNS(relsRoot.namespaceURI, 'Relationship');
        rel.setAttribute('Id', rid); rel.setAttribute('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image');
        rel.setAttribute('Target', 'media/' + fname); relsRoot.appendChild(rel);
        let w = im.w || 1600, h = im.h || 1200, cx = maxW, cy = Math.round(maxW * h / w);
        if (cy > maxH) { cy = Math.round(maxH); cx = Math.round(maxH * w / h); }
        const frag = parser.parseFromString(drawingXml(rid, ++picN, Math.round(cx), Math.round(cy), fname), 'application/xml').documentElement;
        q.appendChild(doc.importNode(frag, true));
      });
    }
    types.forEach(e => {
      if (!new RegExp('Extension="' + (e === 'jpeg' ? 'jpe?g' : e) + '"', 'i').test(ct))
        ct = ct.replace('<Types ', '<Types ').replace('</Types>', `<Default Extension="${e === 'jpeg' ? 'jpg' : e}" ContentType="image/${e}"/></Types>`);
    });
    if (types.has('jpeg') && !/Extension="jpg"/i.test(ct)) ct = ct.replace('</Types>', '<Default Extension="jpg" ContentType="image/jpeg"/></Types>');

    // giá trị đơn (cả trong hộp chữ của bìa, đầu / chân trang)
    fillAllParas(body, ctx, null, null);
    zip.file('word/document.xml', ser.serializeToString(doc));
    zip.file('word/_rels/document.xml.rels', ser.serializeToString(relsDoc));
    zip.file('[Content_Types].xml', ct);
    for (const f of Object.keys(zip.files).filter(f => /^word\/(header|footer)\d*\.xml$/.test(f))) {
      const hd = parser.parseFromString(await zip.file(f).async('string'), 'application/xml');
      fillAllParas(hd.documentElement, ctx, null, null);
      zip.file(f, ser.serializeToString(hd));
    }
    return zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', compression: 'DEFLATE' });
  }

  let jszipP = null;
  function needZip() {
    if (window.JSZip) return Promise.resolve();
    return jszipP || (jszipP = new Promise((ok, no) => { const s = document.createElement('script'); s.src = 'vendor/jszip.min.js'; s.onload = ok; s.onerror = () => { jszipP = null; no(new Error('Không tải được thư viện tạo file Word.')); }; document.head.appendChild(s); }));
  }
  window.DOCXFILL = { fill: async (buf, data) => { await needZip(); return fill(buf, data); }, needZip };
})();
