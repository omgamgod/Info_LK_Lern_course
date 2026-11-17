/* Static diagram renderers (SVG): graph, objects, classes, seq, struktogramm, calltree, matrix, board, bintree, metro. */
(() => {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  let uid = 0;

  function S(tag, attrs, ...kids) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) { if (v != null && v !== false) e.setAttribute(k, v); }
    for (const k of kids.flat()) { if (k == null) continue; e.append(k.nodeType ? k : document.createTextNode(String(k))); }
    return e;
  }
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  function tw(text, size = 14, family = 'body', weight = 400) {
    const fam = family === 'mono' ? '"JetBrains Mono", ui-monospace, Consolas, monospace' : family === 'hand' ? 'Caveat, cursive' : '"Atkinson Hyperlegible", "Segoe UI", system-ui, sans-serif';
    ctx.font = `${weight} ${size}px ${fam}`;
    return ctx.measureText(String(text)).width;
  }
  function text(x, y, str, o = {}) {
    const cls = o.mono ? 'svg-mono' : o.hand ? 'svg-hand' : 'svg-text';
    return S('text', { x, y, class: cls, 'font-size': o.size || 14, 'text-anchor': o.anchor || 'start', 'dominant-baseline': o.base || 'middle', 'font-weight': o.weight || null, 'font-style': o.italic ? 'italic' : null, fill: o.fill || null, 'text-decoration': o.underline ? 'underline' : null }, str);
  }
  function svgRoot(w, h, label) {
    return S('svg', { viewBox: `0 0 ${Math.ceil(w)} ${Math.ceil(h)}`, width: Math.ceil(w), role: 'img', 'aria-label': label || 'Diagramm' });
  }
  function arrowDefs(svg, id, color, open) {
    const m = S('marker', { id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 8, markerHeight: 8, orient: 'auto-start-reverse' },
      open ? S('path', { d: 'M0,0 L10,5 L0,10', fill: 'none', stroke: color, 'stroke-width': 1.5 }) : S('path', { d: 'M0,0 L10,5 L0,10 z', fill: color }));
    let defs = svg.querySelector('defs');
    if (!defs) { defs = S('defs'); svg.prepend(defs); }
    defs.append(m);
    return `url(#${id})`;
  }
  const COLORS = { blue: 'var(--blue)', red: 'var(--red)', green: 'var(--green)', amber: 'var(--amber)', violet: 'var(--violet)', ink: 'var(--ink)', grey: 'var(--ink-3)' };
  const SOFT = { blue: 'var(--blue-soft)', red: 'var(--red-soft)', green: 'var(--green-soft)', amber: 'var(--amber-soft)', violet: 'var(--violet-soft)', grey: 'var(--sheet-2)', ink: 'var(--sheet-2)' };
  function place(fig, node) {
    const cap = fig.querySelector('figcaption');
    if (cap) fig.insertBefore(node, cap); else fig.append(node);
  }

  // ---------------------------------------------------------------- graph
  function graph(src, fig, opt) {
    const g = typeof src === 'string' ? JSON.parse(src) : src;
    const r = g.r || 19;
    const nodes = {};
    g.nodes.forEach(([id, x, y]) => { nodes[id] = { id, x, y, hw: g.box ? tw(id, 13, 'body', 700) / 2 + 11 : 0, hh: 15 }; });
    const clip = (N, ux, uy) => {
      if (!g.box) return r;
      const tx = ux !== 0 ? N.hw / Math.abs(ux) : Infinity;
      const ty = uy !== 0 ? N.hh / Math.abs(uy) : Infinity;
      return Math.min(tx, ty);
    };
    const xs = g.nodes.map((n) => n[1]);
    const ys = g.nodes.map((n) => n[2]);
    const pad = (g.box ? Math.max(...Object.values(nodes).map((n) => n.hw)) : r) + 26;
    const minX = Math.min(...xs) - pad;
    const minY = Math.min(...ys) - pad;
    const w = Math.max(...xs) - minX + pad;
    const h = Math.max(...ys) - minY + pad;
    const svg = svgRoot(w, h, g.label || 'Graph');
    svg.setAttribute('viewBox', `${minX} ${minY} ${w} ${h}`);
    const id = 'g' + (++uid);
    const mk = { ink: arrowDefs(svg, id + 'i', 'var(--ink-2)'), blue: arrowDefs(svg, id + 'b', 'var(--blue)'), red: arrowDefs(svg, id + 'r', 'var(--red)'), green: arrowDefs(svg, id + 'g', 'var(--green)') };
    const hlE = {};
    (g.hl && g.hl.edges || []).forEach(([a, b, c]) => { hlE[a + '|' + b] = c; if (!g.directed) hlE[b + '|' + a] = c; });
    const edgeLayer = S('g');
    const labelLayer = S('g');
    (g.edges || []).forEach((e) => {
      const [a, b, wgt, dirFlag] = e;
      const A = nodes[a];
      const B = nodes[b];
      if (!A || !B) return;
      const directed = dirFlag === '->' || (g.directed && dirFlag !== '--');
      const dx = B.x - A.x;
      const dy = B.y - A.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const ra = clip(A, ux, uy);
      const rb = clip(B, ux, uy);
      const x1 = A.x + ux * ra;
      const y1 = A.y + uy * ra;
      const x2 = B.x - ux * (rb + (directed ? 2 : 0));
      const y2 = B.y - uy * (rb + (directed ? 2 : 0));
      const c = hlE[a + '|' + b];
      const col = c ? COLORS[c] : 'var(--ink-2)';
      edgeLayer.append(S('line', { x1, y1, x2, y2, stroke: col, 'stroke-width': c ? 3.2 : 1.7, 'marker-end': directed ? (mk[c] || mk.ink) : null, 'stroke-dasharray': c === 'grey' ? '5 4' : null }));
      if (wgt != null && wgt !== '' && g.weights !== false) {
        const mx = (A.x + B.x) / 2 - uy * 11;
        const my = (A.y + B.y) / 2 + ux * 11;
        const t = String(wgt);
        const tw0 = tw(t, 12.5, 'mono') + 8;
        labelLayer.append(S('rect', { x: mx - tw0 / 2, y: my - 9, width: tw0, height: 18, rx: 4, fill: 'var(--sheet)', stroke: 'var(--grid)' }));
        labelLayer.append(text(mx, my + 0.5, t, { mono: true, size: 12.5, anchor: 'middle' }));
      }
    });
    svg.append(edgeLayer, labelLayer);
    const hlN = (g.hl && g.hl.nodes) || {};
    Object.values(nodes).forEach((n) => {
      const c = hlN[n.id];
      const fill = c ? SOFT[c] : 'var(--sheet)';
      const stroke = c ? COLORS[c] : 'var(--ink)';
      const lab = String(n.id);
      if (g.box) svg.append(S('rect', { x: n.x - n.hw, y: n.y - n.hh, width: 2 * n.hw, height: 2 * n.hh, rx: 9, fill, stroke, 'stroke-width': c ? 2.6 : 1.6 }));
      else svg.append(S('circle', { cx: n.x, cy: n.y, r: Math.max(r, tw(lab, 13, 'body', 700) / 2 + 6), fill, stroke, 'stroke-width': c ? 2.6 : 1.6 }));
      svg.append(text(n.x, n.y + 0.5, lab, { size: 13, anchor: 'middle', weight: 700 }));
    });
    (g.notes || []).forEach(([x, y, t, c]) => svg.append(text(x, y, t, { hand: true, size: 20, anchor: 'middle', fill: c ? COLORS[c] : null })));
    if (opt && opt.returnSvg) return svg;
    place(fig, svg);
    return svg;
  }

  // ---------------------------------------------------------------- object diagram
  // name: TYPE @x,y [!] | attr = value | attr -> target | attr => target (new) | attr -x target (removed)
  // var name -> target @x,y
  function objects(src, fig) {
    const lines = src.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
    const objs = [];
    const byName = {};
    const notes = [];
    let auto = 0;
    lines.forEach((line) => {
      if (line.startsWith('note ')) {
        const m = line.match(/^note\s+@([\d.-]+),([\d.-]+)\s+(.*)$/);
        if (m) notes.push({ x: +m[1], y: +m[2], t: m[3] });
        return;
      }
      if (line.startsWith('var ')) {
        const m = line.match(/^var\s+(\S+)\s*(->|=>|=)\s*([^@]+?)\s*(?:@([\d.-]+),([\d.-]+))?$/);
        if (!m) return;
        const o = { kind: 'var', name: m[1], rel: m[2], target: m[3].trim(), x: m[4] != null ? +m[4] : auto, y: m[5] != null ? +m[5] : 0 };
        objs.push(o);
        return;
      }
      const parts = line.split('|').map((p) => p.trim());
      const hm = parts[0].match(/^(\S*)\s*:\s*([^@!]+?)\s*(?:@([\d.-]+),([\d.-]+))?\s*(!)?$/);
      if (!hm) return;
      const o = { kind: 'obj', name: hm[1], type: hm[2].trim(), x: hm[3] != null ? +hm[3] : auto++, y: hm[4] != null ? +hm[4] : 0, hl: !!hm[5], attrs: [] };
      parts.slice(1).forEach((p) => {
        let m = p.match(/^(\S+)\s*(->|=>|-x)\s*(\S+)$/);
        if (m) { o.attrs.push({ k: m[1], rel: m[2], target: m[3] }); return; }
        m = p.match(/^(\S+)\s*=\s*(.*)$/);
        if (m) o.attrs.push({ k: m[1], v: m[2] });
        else o.attrs.push({ k: p, v: '' });
      });
      objs.push(o);
      if (o.name) byName[o.name] = o;
    });
    const CW = 210;
    const RH = 130;
    const RW = 24;
    objs.forEach((o) => {
      if (o.kind === 'var') { o.w = tw(o.name, 13.5, 'mono', 700) + 34; o.h = 28; }
      else {
        const head = (o.name ? o.name : '') + ': ' + o.type;
        let w = tw(head, 13, 'mono', 700) + 24;
        o.attrs.forEach((a) => { w = Math.max(w, tw(a.k, 13, 'mono') + (a.v != null ? tw(a.v, 13, 'mono') : 14) + 40); });
        o.w = Math.max(132, w);
        o.h = 28 + o.attrs.length * RW + 4;
      }
      o.px = 20 + o.x * CW;
      o.py = 40 + o.y * RH;
    });
    const W = Math.max(...objs.map((o) => o.px + o.w), ...notes.map((n) => 20 + n.x * CW + 120)) + 30;
    const H = Math.max(...objs.map((o) => o.py + o.h), ...notes.map((n) => 40 + n.y * RH + 20)) + 30;
    const svg = svgRoot(W, H, 'Objektdiagramm');
    const id = 'o' + (++uid);
    const mk = { '->': arrowDefs(svg, id + 'a', 'var(--ink)'), '=>': arrowDefs(svg, id + 'n', 'var(--blue)'), '-x': arrowDefs(svg, id + 'x', 'var(--red)') };
    const arrowLayer = S('g');
    function connect(x1, y1, target, rel, src) {
      const t = byName[target];
      if (!t) {
        arrowLayer.append(text(x1 + 6, y1, target, { mono: true, size: 13 }));
        return;
      }
      let x2;
      let y2;
      let d;
      const between = objs.some((o2) => o2.kind === 'obj' && o2 !== t && o2.px > x1 + 4 && o2.px + o2.w < t.px + 4 && o2.py < y1 + 10 && o2.py + o2.h > y1 - 10);
      if (t.px >= x1 + 10 && between) {
        const top = Math.min(t.py, ...objs.filter((o2) => o2.kind === 'obj' && o2.px > x1 && o2.px < t.px).map((o2) => o2.py)) - 18;
        x2 = t.px + Math.min(34, t.w / 3); y2 = t.py;
        const mx = (x1 + x2) / 2;
        d = `M${x1},${y1} C${x1 + 50},${y1} ${x1 + 30},${top} ${mx},${top} S${x2},${top} ${x2},${y2 - 1}`;
      } else if (t.px >= x1 + 10) {
        x2 = t.px; y2 = t.py + 14;
        const mx = (x1 + x2) / 2;
        d = `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2 - 1},${y2}`;
      } else if (t.py > y1) {
        y2 = t.py;
        if (t.px + t.w > x1 - 40) {
          // target (mostly) below the source: drop down near the source's right edge
          x2 = Math.max(t.px + 20, Math.min(t.px + t.w - 24, x1 - 16));
          d = `M${x1},${y1} C${x1 + 40},${y1} ${x2},${y1 + (y2 - y1) * 0.45} ${x2},${y2 - 1}`;
        } else if (src && t.py > src.py + src.h + 8) {
          // target below and to the left: leave to the right, pass under the source box, then drop down
          x2 = t.px + Math.min(40, t.w / 3);
          const yb = src.py + src.h + Math.min(14, (t.py - src.py - src.h) / 2);
          const r = 8;
          d = `M${x1},${y1} H${x1 + 10} Q${x1 + 10 + r},${y1} ${x1 + 10 + r},${y1 + r} V${yb - r} Q${x1 + 10 + r},${yb} ${x1 + 10},${yb} H${x2 + r} Q${x2},${yb} ${x2},${yb + r} V${y2 - 1}`;
        } else {
          x2 = t.px + Math.min(40, t.w / 3);
          d = `M${x1},${y1} C${x1 + 50},${y1} ${x2},${y2 - 60} ${x2},${y2 - 1}`;
        }
      } else {
        y2 = t.py + t.h;
        if (t.px + t.w > x1 - 40) {
          x2 = Math.max(t.px + 20, Math.min(t.px + t.w - 24, x1 - 16));
          d = `M${x1},${y1} C${x1 + 40},${y1} ${x2},${y1 - (y1 - y2) * 0.45} ${x2},${y2 + 1}`;
        } else {
          x2 = t.px + Math.min(40, t.w / 3);
          d = `M${x1},${y1} C${x1 + 50},${y1} ${x2},${y2 + 60} ${x2},${y2 + 1}`;
        }
      }
      const col = rel === '=>' ? 'var(--blue)' : rel === '-x' ? 'var(--red)' : 'var(--ink)';
      arrowLayer.append(S('path', { d, fill: 'none', stroke: col, 'stroke-width': rel === '=>' ? 2.6 : 1.6, 'stroke-dasharray': rel === '-x' ? '6 4' : null, 'marker-end': mk[rel] }));
      if (rel === '-x') {
        const mxp = (x1 + x2) / 2;
        const myp = (y1 + y2) / 2;
        arrowLayer.append(S('path', { d: `M${mxp - 7},${myp - 7} L${mxp + 7},${myp + 7} M${mxp + 7},${myp - 7} L${mxp - 7},${myp + 7}`, stroke: 'var(--red)', 'stroke-width': 2.6 }));
      }
    }
    objs.forEach((o) => {
      if (o.kind === 'var') {
        svg.append(text(o.px, o.py + 14, o.name, { mono: true, size: 13.5, weight: 700 }));
        const dx = o.px + tw(o.name, 13.5, 'mono', 700) + 10;
        if (o.rel === '=') { svg.append(text(dx, o.py + 14, '= ' + o.target, { mono: true, size: 13 })); return; }
        svg.append(S('circle', { cx: dx + 4, cy: o.py + 14, r: 4, fill: o.rel === '=>' ? 'var(--blue)' : 'var(--ink)' }));
        connect(dx + 8, o.py + 14, o.target, o.rel);
        return;
      }
      const g = S('g');
      g.append(S('rect', { x: o.px, y: o.py, width: o.w, height: o.h, rx: 5, fill: o.hl ? 'var(--blue-soft)' : 'var(--sheet)', stroke: o.hl ? 'var(--blue)' : 'var(--ink)', 'stroke-width': o.hl ? 2.4 : 1.5 }));
      g.append(text(o.px + o.w / 2, o.py + 15, (o.name || '') + ': ' + o.type, { mono: true, size: 13, anchor: 'middle', weight: 700, underline: true }));
      g.append(S('line', { x1: o.px, y1: o.py + 28, x2: o.px + o.w, y2: o.py + 28, stroke: o.hl ? 'var(--blue)' : 'var(--ink)', 'stroke-width': 1.2 }));
      o.attrs.forEach((a, i) => {
        const y = o.py + 28 + i * RW + RW / 2 + 2;
        g.append(text(o.px + 10, y, a.k, { mono: true, size: 13 }));
        if (a.v != null) {
          g.append(text(o.px + o.w - 10, y, a.v, { mono: true, size: 13, anchor: 'end', fill: a.v === 'None' ? 'var(--ink-3)' : null }));
        } else {
          const cx = o.px + o.w - 14;
          g.append(S('circle', { cx, cy: y, r: 4, fill: a.rel === '=>' ? 'var(--blue)' : a.rel === '-x' ? 'var(--red)' : 'var(--ink)' }));
          connect(cx + 4, y, a.target, a.rel, o);
        }
      });
      svg.append(g);
    });
    svg.append(arrowLayer);
    notes.forEach((n) => svg.append(text(20 + n.x * CW, 40 + n.y * RH, n.t, { hand: true, size: 21 })));
    place(fig, svg);
  }

  // ---------------------------------------------------------------- class diagram
  // class NAME @x,y | attr; attr | method; method      (abstract NAME ... for abstract classes)
  // assoc A -> B : label mult        inherit A -> B        dep A ..> B : label
  function classes(src, fig) {
    const lines = src.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
    const cls = {};
    const rels = [];
    lines.forEach((line) => {
      let m = line.match(/^(class|abstract|interface)\s+([^\s@|]+)\s*(?:@([\d.-]+),([\d.-]+))?\s*(?:\|(.*?))?(?:\|(.*))?$/);
      if (m) {
        cls[m[2]] = { name: m[2], kind: m[1], x: +(m[3] || 0), y: +(m[4] || 0), attrs: (m[5] || '').split(';').map((s) => s.trim()).filter(Boolean), meths: (m[6] || '').split(';').map((s) => s.trim()).filter(Boolean) };
        return;
      }
      m = line.match(/^(assoc|inherit|dep|realize)\s+(\S+)\s*(?:->|\.\.>)\s*(\S+)\s*(?::\s*(.*))?$/);
      if (m) {
        const lab = (m[4] || '').trim();
        const mm = lab.match(/^(.*?)\s*\[(.*)\]$/);
        rels.push({ type: m[1], a: m[2], b: m[3], label: mm ? mm[1] : lab, mult: mm ? mm[2] : '' });
      }
    });
    const CW = 250;
    const RH = 190;
    const list = Object.values(cls);
    list.forEach((c) => {
      const head = c.name;
      let w = tw(head, 14, 'mono', 700) + 30;
      c.attrs.concat(c.meths).forEach((s) => { w = Math.max(w, tw(s, 12.5, 'mono') + 24); });
      if (c.kind !== 'class') w = Math.max(w, tw('«' + c.kind + '»', 11.5) + 24);
      c.w = Math.max(150, w);
      c.hh = c.kind !== 'class' ? 42 : 30;
      c.ah = Math.max(14, c.attrs.length * 19 + 8);
      c.mh = Math.max(14, c.meths.length * 19 + 8);
      c.h = c.hh + c.ah + c.mh;
      c.px = 20 + c.x * CW;
      c.py = 20 + c.y * RH;
    });
    let W = Math.max(...list.map((c) => c.px + c.w)) + 80;
    rels.forEach((r) => { if (r.a === r.b && cls[r.a]) W = Math.max(W, cls[r.a].px + cls[r.a].w + 60 + tw(r.label || '', 12, 'mono')); });
    const H = Math.max(...list.map((c) => c.py + c.h)) + 30;
    const svg = svgRoot(W, H, 'Klassendiagramm');
    const id = 'c' + (++uid);
    const mkA = arrowDefs(svg, id + 'a', 'var(--ink)', true);
    const tri = S('marker', { id: id + 't', viewBox: '0 0 12 12', refX: 11, refY: 6, markerWidth: 14, markerHeight: 14, orient: 'auto-start-reverse' }, S('path', { d: 'M0,0 L12,6 L0,12 z', fill: 'var(--sheet)', stroke: 'var(--ink)', 'stroke-width': 1.3 }));
    svg.querySelector('defs').append(tri);
    const relLayer = S('g');
    function border(c, tx, ty) {
      const cx = c.px + c.w / 2;
      const cy = c.py + c.h / 2;
      const dx = tx - cx;
      const dy = ty - cy;
      const sx = dx !== 0 ? (c.w / 2) / Math.abs(dx) : Infinity;
      const sy = dy !== 0 ? (c.h / 2) / Math.abs(dy) : Infinity;
      const s = Math.min(sx, sy);
      return [cx + dx * s, cy + dy * s];
    }
    const pairN = {};
    const pairI = {};
    const pk = (r) => [r.a, r.b].sort().join('|');
    rels.forEach((r) => { if (r.a !== r.b) pairN[pk(r)] = (pairN[pk(r)] || 0) + 1; });
    rels.forEach((r) => {
      const A = cls[r.a];
      const B = cls[r.b];
      if (!A || !B) return;
      if (A === B) {
        const x = A.px + A.w;
        const y1 = A.py + 18;
        const y2 = A.py + 50;
        relLayer.append(S('path', { d: `M${x},${y1} h40 v${y2 - y1} h-40`, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 1.4, 'marker-end': mkA }));
        if (r.label) relLayer.append(text(x + 46, (y1 + y2) / 2 - 2, r.label, { mono: true, size: 12 }));
        if (r.mult) relLayer.append(text(x + 6, y2 + 12, r.mult, { mono: true, size: 11.5 }));
        return;
      }
      let [x1, y1] = border(A, B.px + B.w / 2, B.py + B.h / 2);
      let [x2, y2] = border(B, A.px + A.w / 2, A.py + A.h / 2);
      const n = pairN[pk(r)];
      if (n > 1) {
        const k = pairI[pk(r)] = (pairI[pk(r)] || 0) + 1;
        // offset parallel relations between the same two classes
        const sgn = r.a < r.b ? 1 : -1;
        const off = (k - 1 - (n - 1) / 2) * 34 * sgn;
        const len = Math.hypot(x2 - x1, y2 - y1) || 1;
        const nx = -(y2 - y1) / len;
        const ny = (x2 - x1) / len;
        x1 += nx * off; y1 += ny * off; x2 += nx * off; y2 += ny * off;
      }
      const dashed = r.type === 'dep' || r.type === 'realize';
      relLayer.append(S('line', { x1, y1, x2, y2, stroke: 'var(--ink)', 'stroke-width': 1.4, 'stroke-dasharray': dashed ? '6 4' : null, 'marker-end': r.type === 'inherit' || r.type === 'realize' ? `url(#${id}t)` : mkA }));
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      if (r.label) {
        const tl = tw(r.label, 12, 'mono') + 8;
        relLayer.append(S('rect', { x: mx - tl / 2, y: my - 19, width: tl, height: 16, fill: 'var(--sheet)', opacity: 0.9 }));
        relLayer.append(text(mx, my - 11, r.label, { mono: true, size: 12, anchor: 'middle' }));
      }
      if (r.mult) {
        const tx = x2 + (x1 - x2) * 0.16;
        const ty = y2 + (y1 - y2) * 0.16;
        relLayer.append(text(tx + 8, ty + 10, r.mult, { mono: true, size: 11.5 }));
      }
    });
    svg.append(relLayer);
    list.forEach((c) => {
      const g = S('g');
      g.append(S('rect', { x: c.px, y: c.py, width: c.w, height: c.h, fill: 'var(--sheet)', stroke: 'var(--ink)', 'stroke-width': 1.5 }));
      if (c.kind !== 'class') g.append(text(c.px + c.w / 2, c.py + 13, '«' + c.kind + '»', { size: 11.5, anchor: 'middle', fill: 'var(--ink-2)' }));
      g.append(text(c.px + c.w / 2, c.py + c.hh - 14, c.name, { mono: true, size: 14, anchor: 'middle', weight: 700, italic: c.kind === 'abstract' }));
      g.append(S('line', { x1: c.px, y1: c.py + c.hh, x2: c.px + c.w, y2: c.py + c.hh, stroke: 'var(--ink)' }));
      c.attrs.forEach((a, i) => g.append(text(c.px + 10, c.py + c.hh + 14 + i * 19, a, { mono: true, size: 12.5 })));
      g.append(S('line', { x1: c.px, y1: c.py + c.hh + c.ah, x2: c.px + c.w, y2: c.py + c.hh + c.ah, stroke: 'var(--ink)' }));
      c.meths.forEach((a, i) => g.append(text(c.px + 10, c.py + c.hh + c.ah + 14 + i * 19, a, { mono: true, size: 12.5, italic: /\{abstract\}|\*$/.test(a) })));
      svg.append(g);
    });
    place(fig, svg);
  }

  // ---------------------------------------------------------------- sequence diagram
  function seq(src, fig) {
    const lines = src.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
    let actors = [];
    const msgs = [];
    lines.forEach((l) => {
      if (l.startsWith('actors:')) { actors = l.slice(7).split('|').map((s) => s.trim()).filter(Boolean); return; }
      if (l.startsWith('note:')) { msgs.push({ note: l.slice(5).trim() }); return; }
      const m = l.match(/^(.+?)\s*(-->|->)\s*(.+?)\s*:\s*(.*)$/);
      if (m) msgs.push({ from: m[1].trim(), to: m[3].trim(), ret: m[2] === '-->', label: m[4] });
    });
    const keyOf = (a) => a.split(':')[0].trim();
    const idx = {};
    actors.forEach((a, i) => { idx[keyOf(a)] = i; });
    const colW = [];
    actors.forEach((a) => colW.push(Math.max(120, tw(a, 13, 'mono', 700) + 30)));
    let maxLabel = 0;
    msgs.forEach((m) => { if (m.label) maxLabel = Math.max(maxLabel, tw(m.label, 12.5, 'mono') + 30); });
    const gap = Math.max(150, Math.min(260, maxLabel));
    const xs = [];
    let x = 20 + colW[0] / 2;
    actors.forEach((a, i) => { xs.push(x); x += (i < actors.length - 1 ? Math.max(gap, colW[i] / 2 + colW[i + 1] / 2 + 20) : 0); });
    const top = 20;
    const headH = 32;
    const row = 36;
    const y0 = top + headH + 40;
    const H = y0 + msgs.length * row + 30;
    const W = xs[xs.length - 1] + colW[colW.length - 1] / 2 + 30;
    const svg = svgRoot(W, H, 'Sequenzdiagramm');
    const id = 's' + (++uid);
    const mkC = arrowDefs(svg, id + 'c', 'var(--ink)');
    const mkR = arrowDefs(svg, id + 'r', 'var(--ink)', true);
    actors.forEach((a, i) => {
      const k = keyOf(a);
      const isActor = /^Aufrufer$|^Benutzer$|^User$/.test(k);
      if (isActor) {
        const cx = xs[i];
        svg.append(S('circle', { cx, cy: top + 5, r: 5, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 1.4 }));
        svg.append(S('path', { d: `M${cx},${top + 10} v12 M${cx - 8},${top + 15} h16 M${cx},${top + 22} l-7,9 M${cx},${top + 22} l7,9`, stroke: 'var(--ink)', fill: 'none', 'stroke-width': 1.4 }));
        svg.append(text(cx, top + headH + 8, a, { size: 12.5, anchor: 'middle', underline: true }));
      } else {
        svg.append(S('rect', { x: xs[i] - colW[i] / 2, y: top, width: colW[i], height: headH, rx: 6, fill: 'var(--sheet)', stroke: 'var(--ink)', 'stroke-width': 1.4 }));
        svg.append(text(xs[i], top + headH / 2 + 1, a, { mono: true, size: 13, anchor: 'middle', weight: 700, underline: true }));
      }
      svg.append(S('line', { x1: xs[i], y1: top + headH + (isActor ? 16 : 0), x2: xs[i], y2: H - 10, stroke: 'var(--ink-3)', 'stroke-dasharray': '4 4' }));
    });
    // activations
    const stack = [];
    const acts = [];
    const depthOf = {};
    msgs.forEach((m, r) => {
      if (m.note) return;
      const y = y0 + r * row;
      if (!m.ret) {
        const tk = idx[m.to];
        depthOf[tk] = (depthOf[tk] || 0) + 1;
        stack.push({ k: tk, start: y, level: depthOf[tk] - 1 });
      } else {
        const fk = idx[m.from];
        for (let s = stack.length - 1; s >= 0; s--) {
          if (stack[s].k === fk) { const a = stack.splice(s, 1)[0]; acts.push({ ...a, end: y }); depthOf[fk] -= 1; break; }
        }
      }
    });
    stack.forEach((a) => acts.push({ ...a, end: H - 16 }));
    acts.forEach((a) => svg.append(S('rect', { x: xs[a.k] - 6 + a.level * 6, y: a.start, width: 12, height: Math.max(8, a.end - a.start), fill: a.level ? 'var(--blue-soft)' : 'var(--sheet-2)', stroke: 'var(--ink)', 'stroke-width': 1.2 })));
    const level = {};
    msgs.forEach((m, r) => {
      const y = y0 + r * row;
      if (m.note) { svg.append(text(20, y, m.note, { hand: true, size: 19 })); return; }
      const a = idx[m.from];
      const b = idx[m.to];
      if (a == null || b == null) return;
      if (!m.ret) level[b] = (level[b] || 0) + 1;
      const lb = m.ret ? (level[a] || 1) - 1 : (level[b] || 1) - 1;
      const la = m.ret ? Math.max(0, (level[b] || 1) - 1) : Math.max(0, (level[a] || 1) - 1);
      if (m.ret) level[a] = Math.max(0, (level[a] || 1) - 1);
      if (a === b) {
        const xx = xs[a] + 6;
        svg.append(S('path', { d: `M${xx},${y - 10} h34 v14 h-28`, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 1.3, 'stroke-dasharray': m.ret ? '5 4' : null, 'marker-end': m.ret ? mkR : mkC }));
        svg.append(text(xx + 40, y - 6, m.label, { mono: true, size: 12.5 }));
        return;
      }
      const dir = b > a ? 1 : -1;
      void la; void lb;
      const xA = xs[a] + dir * 6;
      const xB = xs[b] - dir * 6;
      svg.append(S('line', { x1: xA, y1: y, x2: xB - dir * 1, y2: y, stroke: m.ret ? 'var(--ink-2)' : 'var(--ink)', 'stroke-width': 1.4, 'stroke-dasharray': m.ret ? '5 4' : null, 'marker-end': m.ret ? mkR : mkC }));
      svg.append(text((xA + xB) / 2, y - 9, m.label, { mono: true, size: 12.5, anchor: 'middle', fill: m.ret ? 'var(--ink-2)' : null }));
    });
    place(fig, svg);
  }

  // ---------------------------------------------------------------- Struktogramm (Nassi-Shneiderman)
  function struktogramm(src, fig) {
    const raw = src.split('\n').filter((l) => l.trim());
    let title = '';
    const root = { kids: [] };
    const stack = [{ ind: -1, node: root }];
    raw.forEach((l) => {
      const ind = l.match(/^\s*/)[0].length;
      const t = l.trim();
      if (t.startsWith('title ')) { title = t.slice(6); return; }
      while (stack.length > 1 && stack[stack.length - 1].ind >= ind) stack.pop();
      const parent = stack[stack.length - 1].node;
      let node;
      if (t.startsWith('S:')) node = { k: 'S', t: t.slice(2).trim() };
      else if (t.startsWith('W:')) node = { k: 'W', t: t.slice(2).trim(), kids: [] };
      else if (t.startsWith('U:')) node = { k: 'U', t: t.slice(2).trim(), kids: [] };
      else if (t.startsWith('F:')) node = { k: 'F', t: t.slice(2).trim(), yes: { kids: [] }, no: { kids: [] }, kids: [] };
      else if (t === 'T:' || t === 'wahr:') node = { k: 'branch', side: 'yes' };
      else if (t === 'E:' || t === 'falsch:') node = { k: 'branch', side: 'no' };
      else node = { k: 'S', t };
      if (node.k === 'branch') {
        const target = parent.yes ? parent[node.side] : parent;
        stack.push({ ind, node: target });
        return;
      }
      (parent.kids || (parent.kids = [])).push(node);
      if (node.kids) stack.push({ ind, node });
    });
    const FS = 13.5;
    function wrap(str, width) {
      const words = String(str).split(' ');
      const out = [];
      let cur = '';
      words.forEach((wd) => {
        const tst = cur ? cur + ' ' + wd : wd;
        if (tw(tst, FS, 'mono') > width - 16 && cur) { out.push(cur); cur = wd; } else cur = tst;
        while (tw(cur, FS, 'mono') > width - 16 && cur.length > 3) {
          let k = cur.length - 1;
          while (k > 1 && tw(cur.slice(0, k), FS, 'mono') > width - 16) k--;
          out.push(cur.slice(0, k)); cur = cur.slice(k);
        }
      });
      if (cur) out.push(cur);
      return out.length ? out : [''];
    }
    function measure(block, w) {
      let h = 0;
      block.kids.forEach((n) => { h += mNode(n, w); });
      return Math.max(h, block.kids.length ? 0 : 30);
    }
    function mNode(n, w) {
      if (n.k === 'S') { n._l = wrap(n.t, w); return n._h = 12 + n._l.length * 19; }
      if (n.k === 'W' || n.k === 'U') { n._l = wrap(n.t, w); n._hh = 12 + n._l.length * 19; n._bh = measure(n, w - 26); return n._h = n._hh + n._bh + (n.k === 'U' ? 0 : 0); }
      if (n.k === 'F') {
        n._l = wrap(n.t, w * 0.8);
        n._hh = 30 + n._l.length * 19;
        const half = w / 2;
        n._yh = measure(n.yes, half);
        n._nh = measure(n.no, half);
        return n._h = n._hh + Math.max(n._yh, n._nh);
      }
      return 0;
    }
    function draw(svg, block, x, y, w, h) {
      let cy = y;
      if (!block.kids.length) {
        svg.append(S('rect', { x, y, width: w, height: h, fill: 'var(--sheet)', stroke: 'var(--ink)', 'stroke-width': 1.3 }));
        svg.append(text(x + w / 2, y + h / 2, '∅', { size: 14, anchor: 'middle', fill: 'var(--ink-3)' }));
        return;
      }
      block.kids.forEach((n, i) => {
        let nh = n._h;
        if (i === block.kids.length - 1) nh = y + h - cy;
        dNode(svg, n, x, cy, w, nh);
        cy += n._h;
      });
    }
    function dNode(svg, n, x, y, w, h) {
      if (n.k === 'S') {
        svg.append(S('rect', { x, y, width: w, height: h, fill: 'var(--sheet)', stroke: 'var(--ink)', 'stroke-width': 1.3 }));
        n._l.forEach((ln, i) => svg.append(text(x + 8, y + 16 + i * 19, ln, { mono: true, size: FS })));
      } else if (n.k === 'W' || n.k === 'U') {
        svg.append(S('rect', { x, y, width: w, height: h, fill: 'var(--violet-soft)', stroke: 'var(--ink)', 'stroke-width': 1.3 }));
        n._l.forEach((ln, i) => svg.append(text(x + 8, y + 16 + i * 19, ln, { mono: true, size: FS, weight: 700 })));
        draw(svg, n, x + 26, y + n._hh, w - 26, h - n._hh);
      } else if (n.k === 'F') {
        svg.append(S('rect', { x, y, width: w, height: n._hh, fill: 'var(--amber-soft)', stroke: 'var(--ink)', 'stroke-width': 1.3 }));
        svg.append(S('path', { d: `M${x},${y} L${x + w / 2},${y + n._hh} L${x + w},${y}`, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 1.3 }));
        n._l.forEach((ln, i) => svg.append(text(x + w / 2, y + 14 + i * 19, ln, { mono: true, size: FS, anchor: 'middle', weight: 700 })));
        svg.append(text(x + 8, y + n._hh - 10, 'wahr', { size: 12.5, fill: 'var(--green)', weight: 700 }));
        svg.append(text(x + w - 8, y + n._hh - 10, 'falsch', { size: 12.5, anchor: 'end', fill: 'var(--red)', weight: 700 }));
        const bh = h - n._hh;
        draw(svg, n.yes, x, y + n._hh, w / 2, bh);
        draw(svg, n.no, x + w / 2, y + n._hh, w / 2, bh);
      }
    }
    const fdepth = (block) => Math.max(0, ...block.kids.map((n) => (n.k === 'F' ? 1 + Math.max(fdepth(n.yes), fdepth(n.no)) : n.kids ? fdepth(n) : 0)));
    const W0 = Math.min(880, Math.max(560, 150 * 2 ** fdepth(root)));
    const total = measure(root, W0);
    const th = title ? 32 : 0;
    const svg = svgRoot(W0 + 4, total + th + 4, 'Struktogramm');
    if (title) {
      svg.append(S('rect', { x: 2, y: 2, width: W0, height: th, fill: 'var(--sheet-2)', stroke: 'var(--ink)', 'stroke-width': 1.3 }));
      svg.append(text(10, 2 + th / 2, title, { mono: true, size: 14, weight: 700 }));
    }
    draw(svg, root, 2, 2 + th, W0, total);
    place(fig, svg);
  }

  // ---------------------------------------------------------------- call tree
  function calltree(src, fig) {
    const raw = src.split('\n').filter((l) => l.trim());
    const root = { kids: [], depth: -1 };
    const stack = [{ ind: -1, node: root }];
    raw.forEach((l) => {
      const ind = l.match(/^\s*/)[0].length;
      let t = l.trim();
      let hl = null;
      const hm = t.match(/\s+\{(\w+)\}$/);
      if (hm) { hl = hm[1]; t = t.slice(0, hm.index); }
      const [call, res] = t.split('=>').map((s) => s && s.trim());
      while (stack.length > 1 && stack[stack.length - 1].ind >= ind) stack.pop();
      const node = { call, res, hl, kids: [] };
      stack[stack.length - 1].node.kids.push(node);
      stack.push({ ind, node });
    });
    const NW = 14;
    let leafX = 0;
    const gapX = 16;
    function layout(n, d) {
      n.w = Math.max(70, tw(n.call, 13, 'mono', 700) + 22);
      n.d = d;
      if (!n.kids.length) { n.x = leafX + n.w / 2; leafX += n.w + gapX; }
      else {
        n.kids.forEach((k) => layout(k, d + 1));
        const a = n.kids[0].x;
        const b = n.kids[n.kids.length - 1].x;
        n.x = (a + b) / 2;
        const left = n.x - n.w / 2;
        if (left < 0) shift(n, -left);
      }
    }
    function shift(n, dx) { n.x += dx; n.kids.forEach((k) => shift(k, dx)); }
    root.kids.forEach((k) => layout(k, 0));
    const all = [];
    (function walk(n) { n.kids.forEach((k) => { all.push(k); walk(k); }); })(root);
    const LH = 92;
    const W = Math.max(...all.map((n) => n.x + n.w / 2)) + 30;
    const H = Math.max(...all.map((n) => n.d)) * LH + 80;
    const svg = svgRoot(W + 10, H, 'Aufrufbaum');
    const id = 't' + (++uid);
    const mk = arrowDefs(svg, id, 'var(--ink-2)');
    const off = 10;
    all.forEach((n) => {
      const y = 20 + n.d * LH;
      n.kids.forEach((k) => {
        const yk = 20 + k.d * LH;
        svg.append(S('line', { x1: n.x + off, y1: y + (n.res ? 52 : 30), x2: k.x + off, y2: yk - 2, stroke: k.hl === 'x' ? 'var(--red)' : 'var(--ink-2)', 'stroke-width': 1.4, 'marker-end': mk, 'stroke-dasharray': k.hl === 'x' ? '5 4' : null }));
      });
    });
    all.forEach((n) => {
      const y = 20 + n.d * LH;
      const c = n.hl && n.hl !== 'x' ? n.hl : null;
      svg.append(S('rect', { x: n.x - n.w / 2 + off, y, width: n.w, height: 30, rx: 8, fill: c ? SOFT[c] : n.hl === 'x' ? 'var(--red-soft)' : 'var(--sheet)', stroke: c ? COLORS[c] : n.hl === 'x' ? 'var(--red)' : 'var(--ink)', 'stroke-width': c ? 2.2 : 1.4 }));
      svg.append(text(n.x + off, y + 15.5, n.call, { mono: true, size: 13, anchor: 'middle', weight: 700 }));
      if (n.res) svg.append(text(n.x + off, y + 44, '↑ ' + n.res, { mono: true, size: 12.5, anchor: 'middle', fill: 'var(--green)', weight: 700 }));
    });
    place(fig, svg);
  }

  // ---------------------------------------------------------------- matrix
  function matrix(src, fig) {
    const m = JSON.parse(src);
    const { el, esc } = window.UI;
    const hl = {};
    (m.hl || []).forEach(([i, j, c]) => { hl[i + ',' + j] = c || 'amber'; });
    const hr = new Set(m.hlRows || []);
    let html = '<table class="mx" style="border-collapse:collapse;margin:0 auto;font-family:var(--f-mono);font-size:13.5px;background:var(--sheet)"><tr><th style="border:1px solid var(--rule);padding:5px 9px;background:var(--sheet-2)">' + esc(m.corner || '') + '</th>';
    m.labels.forEach((l) => { html += `<th style="border:1px solid var(--rule);padding:5px 9px;background:var(--sheet-2)">${esc(l)}</th>`; });
    html += '</tr>';
    m.m.forEach((row, i) => {
      html += `<tr><th style="border:1px solid var(--rule);padding:5px 9px;background:var(--sheet-2)">${esc(m.rowLabels ? m.rowLabels[i] : m.labels[i])}</th>`;
      row.forEach((v, j) => {
        const c = hl[i + ',' + j] || (hr.has(i) ? 'blue' : null);
        const shown = (m.empty != null && String(v) === String(m.empty)) ? (m.emptyShow != null ? m.emptyShow : '–') : v;
        html += `<td style="border:1px solid var(--rule);padding:5px 9px;text-align:center;min-width:34px;${c ? `background:${SOFT[c]};color:${COLORS[c]};font-weight:700` : ''}${String(v) === String(m.empty) ? ';color:var(--ink-3)' : ''}">${esc(shown)}</td>`;
      });
      html += '</tr>';
    });
    html += '</table>';
    place(fig, el('div', { html, style: 'overflow-x:auto' }));
  }

  // ---------------------------------------------------------------- board (chess / sudoku style)
  function board(src, fig, opt) {
    const b = typeof src === 'string' ? JSON.parse(src) : src;
    const n = b.n || 8;
    const c = b.cell || 44;
    const svg = svgRoot(n * c + 40, n * c + 40, b.label || 'Spielbrett');
    const g = S('g', { transform: 'translate(28,8)' });
    const mark = {};
    (b.marks || []).forEach(([r, k, col]) => { mark[r + ',' + k] = col; });
    for (let r = 0; r < n; r++) {
      for (let k = 0; k < n; k++) {
        const dark = (r + k) % 2 === 1;
        const m = mark[r + ',' + k];
        g.append(S('rect', { x: k * c, y: r * c, width: c, height: c, fill: m ? SOFT[m] : dark ? 'var(--grid)' : 'var(--sheet)', stroke: 'var(--rule)' }));
        if (m === 'red') g.append(S('path', { d: `M${k * c + 12},${r * c + 12} L${k * c + c - 12},${r * c + c - 12} M${k * c + c - 12},${r * c + 12} L${k * c + 12},${r * c + c - 12}`, stroke: 'var(--red)', 'stroke-width': 2, opacity: 0.6 }));
      }
    }
    for (let i = 0; i < n; i++) {
      g.append(text(-14, i * c + c / 2, String(i), { mono: true, size: 11, anchor: 'middle', fill: 'var(--ink-3)' }));
      g.append(text(i * c + c / 2, n * c + 14, String(i), { mono: true, size: 11, anchor: 'middle', fill: 'var(--ink-3)' }));
    }
    g.append(S('rect', { x: 0, y: 0, width: n * c, height: n * c, fill: 'none', stroke: 'var(--ink)', 'stroke-width': 1.6 }));
    (b.pieces || []).forEach(([r, k, p, col]) => g.append(text(k * c + c / 2, r * c + c / 2 + 2, p, { size: c * 0.62, anchor: 'middle', fill: col ? COLORS[col] : 'var(--ink)' })));
    (b.nums || []).forEach(([r, k, t, col]) => g.append(text(k * c + c / 2, r * c + c / 2 + 1, String(t), { mono: true, size: c * 0.36, anchor: 'middle', weight: 700, fill: col ? COLORS[col] : null })));
    (b.arrows || []).forEach(([r1, k1, r2, k2]) => g.append(S('line', { x1: k1 * c + c / 2, y1: r1 * c + c / 2, x2: k2 * c + c / 2, y2: r2 * c + c / 2, stroke: 'var(--blue)', 'stroke-width': 2, opacity: 0.8 })));
    svg.append(g);
    if (opt && opt.returnSvg) return svg;
    place(fig, svg);
    return svg;
  }

  // ---------------------------------------------------------------- trees
  // Bracket notation: 64(57(0(,30),),96(85(82(69,84),95),))  – binary: empty slot = missing child.
  // Option lines before the tree:  abschluss: ja | ebenen: ja | nary: ja | pfad: 64, 96 | labels: kleiner | größer
  // Node suffix {green|blue|amber|red|violet|grey|x} highlights a node; "a|b" breaks a label into two lines.
  function parseTree(expr, nary) {
    let i = 0;
    const s = expr;
    function ws() { while (i < s.length && /\s/.test(s[i])) i++; }
    function label() {
      ws();
      let t = '';
      if (s[i] === '"') { i++; while (i < s.length && s[i] !== '"') t += s[i++]; i++; }
      else while (i < s.length && !'(),{'.includes(s[i])) t += s[i++];
      t = t.trim();
      let hl = null;
      ws();
      if (s[i] === '{') { i++; let h = ''; while (i < s.length && s[i] !== '}') h += s[i++]; i++; hl = h.trim(); }
      return { t, hl };
    }
    function node() {
      ws();
      const { t, hl } = label();
      if (!t) return null;
      const n = { label: t, hl, kids: [] };
      ws();
      if (s[i] === '(') {
        i++;
        const kids = [];
        let expectItem = true;
        while (i < s.length) {
          ws();
          if (s[i] === ')') { if (expectItem && kids.length) kids.push(null); i++; break; }
          if (s[i] === ',') { if (expectItem) kids.push(null); i++; expectItem = true; continue; }
          kids.push(node());
          expectItem = false;
        }
        n.kids = nary ? kids.filter(Boolean) : [kids[0] || null, kids[1] || null];
      }
      return n;
    }
    return node();
  }
  function bintree(src, fig) {
    const lines = src.split('\n');
    const opt = {};
    let expr = '';
    lines.forEach((l) => {
      const m = l.match(/^\s*(abschluss|ebenen|nary|pfad|labels|tiefe|titel|breite)\s*:\s*(.*)$/i);
      if (m) opt[m[1].toLowerCase()] = m[2].trim();
      else expr += ' ' + l;
    });
    const yes = (k) => opt[k] && !/^(nein|no|0|false)$/i.test(opt[k]);
    const nary = yes('nary');
    const root = parseTree(expr.trim(), nary);
    if (!root) return;
    const showA = yes('abschluss') && !nary;
    const path = new Set((opt.pfad || '').split(',').map((x) => x.trim()).filter(Boolean));
    const edgeLabels = opt.labels ? opt.labels.split('|').map((x) => x.trim()) : null;
    const FS = 14;
    const gap = +(opt.breite || 14);
    const nodes = [];
    function prep(n, d) {
      n.d = d;
      n.lines = n.label.split('|');
      n.w = Math.max(38, ...n.lines.map((ln) => tw(ln, FS, 'body', 700) + 22));
      n.h = 14 + n.lines.length * 18;
      nodes.push(n);
      if (n.abschluss) return;
      if (!nary && showA) n.kids = n.kids.length ? n.kids : [null, null];
      n.kids = n.kids.map((k) => (k ? k : showA ? { label: '', abschluss: true, kids: [], hl: null } : null));
      n.kids.forEach((k) => k && prep(k, d + 1));
    }
    prep(root, 0);
    nodes.forEach((n) => { if (n.abschluss) { n.w = 22; n.h = 18; n.lines = []; } });
    const LH = Math.max(...nodes.map((n) => n.h)) + 40;
    let cursor = 0;
    if (!nary) {
      (function inorder(n) {
        if (!n) return;
        inorder(n.kids[0]);
        n.x = cursor + n.w / 2;
        cursor += n.w + gap;
        inorder(n.kids[1]);
      })(root);
      // pull parents above their children when possible (keeps in-order, avoids overlap)
    } else {
      (function lay(n) {
        const ks = n.kids.filter(Boolean);
        if (!ks.length) { n.x = cursor + n.w / 2; cursor += n.w + gap; return; }
        ks.forEach(lay);
        n.x = (ks[0].x + ks[ks.length - 1].x) / 2;
        if (n.x - n.w / 2 < 0) { const dx = n.w / 2 - n.x; (function sh(m) { m.x += dx; m.kids.forEach((k) => k && sh(k)); })(n); cursor += dx; }
      })(root);
    }
    const maxD = Math.max(...nodes.map((n) => n.d));
    const levelW = yes('ebenen') ? 96 : 0;
    const W = Math.max(...nodes.map((n) => n.x + n.w / 2)) + 20 + levelW;
    const H = 24 + maxD * LH + Math.max(...nodes.map((n) => n.h)) + 16;
    const svg = svgRoot(W + 20, H, opt.titel || (nary ? 'Baum' : 'Binärbaum'));
    const id = 'bt' + (++uid);
    const mk = { ink: arrowDefs(svg, id + 'i', 'var(--ink-2)'), blue: arrowDefs(svg, id + 'b', 'var(--blue)'), red: arrowDefs(svg, id + 'r', 'var(--red)') };
    const X = (n) => n.x + 20;
    const Y = (n) => 24 + n.d * LH;
    if (levelW) {
      for (let d = 0; d <= maxD; d++) {
        const y = 24 + d * LH + 16;
        svg.append(S('line', { x1: 10, y1: y, x2: W - levelW + 14, y2: y, stroke: 'var(--rule)', 'stroke-dasharray': '3 5' }));
        svg.append(text(W - levelW + 24, y, (opt.tiefe ? 'Tiefe ' : 'Ebene ') + d, { size: 13, fill: 'var(--ink-3)', weight: 700 }));
      }
    }
    nodes.forEach((n) => {
      n.kids.forEach((k, ki) => {
        if (!k) return;
        const onPath = path.has(n.label) && path.has(k.label);
        const bad = k.hl === 'x';
        const col = onPath ? 'var(--blue)' : bad ? 'var(--red)' : 'var(--ink-2)';
        const x1 = X(n);
        const y1 = Y(n) + n.h;
        const x2 = X(k);
        const y2 = Y(k) - 2;
        svg.append(S('line', { x1, y1, x2, y2, stroke: col, 'stroke-width': onPath ? 2.6 : 1.5, 'marker-end': onPath ? mk.blue : bad ? mk.red : mk.ink, 'stroke-dasharray': k.abschluss ? '3 3' : null }));
        if (edgeLabels && !k.abschluss) {
          const lab = edgeLabels[nary ? 0 : ki] || '';
          const mx = (x1 + x2) / 2 + (ki === 0 && !nary ? -8 : 8);
          svg.append(text(mx, (y1 + y2) / 2, lab, { size: 12.5, anchor: ki === 0 && !nary ? 'end' : 'start', fill: 'var(--ink-3)', italic: true }));
        }
      });
    });
    nodes.forEach((n) => {
      const x = X(n) - n.w / 2;
      const y = Y(n);
      if (n.abschluss) {
        svg.append(S('rect', { x, y, width: n.w, height: n.h, rx: 3, fill: 'var(--sheet-2)', stroke: 'var(--ink-3)', 'stroke-width': 1.2 }));
        svg.append(S('line', { x1: x + 5, y1: y + n.h / 2, x2: x + n.w - 5, y2: y + n.h / 2, stroke: 'var(--ink-3)', 'stroke-width': 1.4 }));
        return;
      }
      const c = path.has(n.label) && !n.hl ? 'blue' : n.hl && n.hl !== 'x' ? n.hl : null;
      const bad = n.hl === 'x';
      svg.append(S('rect', { x, y, width: n.w, height: n.h, rx: 9, fill: c ? SOFT[c] : bad ? 'var(--red-soft)' : 'var(--sheet)', stroke: c ? COLORS[c] : bad ? 'var(--red)' : 'var(--ink)', 'stroke-width': c || bad ? 2.2 : 1.4 }));
      n.lines.forEach((ln, li) => svg.append(text(X(n), y + 16 + li * 18, ln, { size: FS, anchor: 'middle', weight: li === 0 ? 700 : 400 })));
    });
    if (showA) {
      const lx = 20;
      svg.append(S('rect', { x: lx, y: H - 22, width: 22, height: 14, rx: 3, fill: 'var(--sheet-2)', stroke: 'var(--ink-3)' }));
      svg.append(text(lx + 30, H - 15, '= ABSCHLUSS', { size: 12, fill: 'var(--ink-3)' }));
    }
    place(fig, svg);
  }

  // ---------------------------------------------------------------- course map (metro style)
  function metro(host, C, statusFn) {
    const parts = C.parts;
    const rowH = 118;
    const step = 104;
    const x0 = 140;
    let maxX = 0;
    const pos = {};
    parts.forEach((p, pi) => {
      p.lessons.forEach((id, li) => {
        pos[id] = { x: x0 + li * step + (p.offset || 0) * step, y: 46 + pi * rowH, p };
        maxX = Math.max(maxX, pos[id].x);
      });
    });
    const W = maxX + 72;
    const H = 46 + parts.length * rowH;
    const svg = svgRoot(W, H, 'Kurskarte');
    // transfers
    const tl = S('g');
    C.order.forEach((id) => {
      (C.lessons[id].uses || []).forEach((u) => {
        if (!pos[u] || pos[u].p === pos[id].p) return;
        const a = pos[u];
        const b = pos[id];
        const my = (a.y + b.y) / 2;
        tl.append(S('path', { d: `M${a.x},${a.y} C${a.x},${my} ${b.x},${my} ${b.x},${b.y}`, class: 'xfer', 'data-a': u, 'data-b': id, fill: 'none', stroke: 'var(--ink-2)', 'stroke-width': 1.8, 'stroke-dasharray': '4 5' }));
      });
    });
    svg.append(tl);
    parts.forEach((p) => {
      const ps = p.lessons.map((id) => pos[id]);
      const y = ps[0].y;
      svg.append(S('line', { x1: ps[0].x - 26, y1: y, x2: ps[ps.length - 1].x + 26, y2: y, stroke: p.color, 'stroke-width': 9, 'stroke-linecap': 'round' }));
      svg.append(S('rect', { x: 14, y: y - 15, width: 30, height: 30, rx: 7, fill: p.color }));
      svg.append(text(29, y + 1, p.letter, { anchor: 'middle', size: 15, weight: 800, fill: '#fff' }));
      svg.append(text(52, y - 22, p.title, { size: 13, weight: 700 }));
    });
    C.order.forEach((id) => {
      const L = C.lessons[id];
      const P = pos[id];
      if (!P) return;
      const st = statusFn(id);
      const a = S('a', { href: '#' + id, class: 'station' });
      const on = (v) => tl.querySelectorAll('.xfer').forEach((x) => { x.classList.toggle('on', v && (x.dataset.a === id || x.dataset.b === id)); });
      a.addEventListener('mouseenter', () => on(true));
      a.addEventListener('mouseleave', () => on(false));
      a.addEventListener('focus', () => on(true));
      a.addEventListener('blur', () => on(false));
      a.append(S('title', null, L.num + ' ' + L.title));
      a.append(S('circle', { cx: P.x, cy: P.y, r: 11, fill: st.done ? P.p.color : 'var(--sheet)', stroke: P.p.color, 'stroke-width': 4 }));
      if (st.done) a.append(text(P.x, P.y + 1, '✓', { anchor: 'middle', size: 12, weight: 700, fill: '#fff' }));
      a.append(S('text', { x: P.x, y: P.y + 30, class: 'st-num', 'text-anchor': 'middle' }, L.num));
      const words = L.short || L.title;
      const parts2 = splitLabel(words, 15);
      parts2.forEach((ln, i) => a.append(S('text', { x: P.x, y: P.y + 46 + i * 15, class: 'st-label', 'text-anchor': 'middle' }, ln)));
      svg.append(a);
    });
    host.append(svg);
  }
  function splitLabel(s, max) {
    const words = s.split(' ');
    const out = [];
    let cur = '';
    words.forEach((w) => { if ((cur + ' ' + w).trim().length > max && cur) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); });
    if (cur) out.push(cur);
    return out.slice(0, 3);
  }

  function render(kind, src, fig) {
    const f = { graph, objects, classes, seq, struktogramm, calltree, matrix, board, bintree }[kind];
    if (!f) throw new Error('Unknown diagram ' + kind);
    f(src, fig);
  }

  window.Diagrams = { render, metro, graph, board, bintree, parseTree, S, text, tw, arrowDefs, svgRoot, COLORS, SOFT };
})();
