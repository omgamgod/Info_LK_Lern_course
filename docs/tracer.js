/* Step-by-step Python visualizer: frames (call stack), objects and references as arrows. */
(() => {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const E = () => window.UI;

  function widget(host) {
    const { el } = E();
    const code = (host.querySelector('script') || {}).textContent || '';
    const title = host.dataset.title || 'Schau dem Code beim Laufen zu';
    host.innerHTML = '';
    host.className = 'tracer-box';
    const head = el('div', { class: 'viz-head' }, el('span', { class: 'v-tag' }, 'Schritt für Schritt'), el('span', { class: 'v-title' }, title));
    const pre = el('pre', { style: 'margin:0;border:0;border-radius:0' }, el('code', { class: 'language-python' }, code.replace(/\n$/, '')));
    const stage = el('div');
    const btn = el('button', { class: 'btn primary' }, '▶ Schritt für Schritt visualisieren');
    const ctrl = el('div', { class: 'viz-ctrl' }, btn, el('span', { class: 'count' }, 'Zeigt jeden Schritt: welche Zeile läuft, welche Variablen existieren, wohin Referenzen zeigen.'));
    host.append(head, pre, ctrl, stage);
    E().highlight(host);
    btn.addEventListener('click', () => {
      pre.hidden = true; ctrl.hidden = true;
      run(stage, code, { title });
    });
  }

  async function run(box, code, opts = {}) {
    const { el } = E();
    box.innerHTML = '';
    const status = el('div', { class: 'console empty' }, window.Py.state === 'ready' ? 'Die Schritte werden aufgezeichnet …' : 'Python startet … (der erste Start dauert ein paar Sekunden)');
    box.append(status);
    let res;
    try { res = await window.Py.trace(code); } catch (e) {
      status.textContent = 'Python konnte nicht starten. Bitte lade die Seite neu.'; return;
    }
    box.innerHTML = '';
    if (!res.steps.length) {
      if (res.error) box.append(E().errorCard(res.error, code));
      else box.append(el('div', { class: 'console empty' }, 'Nichts zu zeigen: Der Code hat keine Zeilen, die laufen.'));
      return;
    }
    mountStepper(box, code, res, opts);
  }

  function mountStepper(box, code, res, opts) {
    const { el, esc } = E();
    const lines = code.replace(/\n$/, '').split('\n');
    const steps = res.steps;
    const wrap = el('div', { class: opts.compact ? '' : '' });
    const codeView = el('div', { class: 'tr-code' });
    const rows = lines.map((ln, i) => {
      const r = el('div', null, el('span', { class: 'ln' }, String(i + 1)), el('span', { class: 'ar' }, ''), el('span', null, ln || ' '));
      codeView.append(r);
      return r;
    });
    const mem = el('div', { class: 'tr-mem' });
    const grid = el('div', { class: 'tr-grid' }, codeView, mem);
    const stat = el('div', { class: 'tr-status' });
    const outEl = el('div', { class: 'tr-out' });
    const slider = el('input', { type: 'range', min: '0', max: String(steps.length - 1), value: '0', 'aria-label': 'Schritt' });
    slider.style.flex = '1';
    slider.style.minWidth = '120px';
    const bFirst = el('button', { class: 'btn', title: 'Erster Schritt' }, '⏮');
    const bPrev = el('button', { class: 'btn', title: 'Vorheriger Schritt' }, '◀ Zurück');
    const bNext = el('button', { class: 'btn primary', title: 'Nächster Schritt' }, 'Weiter ▶');
    const bLast = el('button', { class: 'btn', title: 'Letzter Schritt' }, '⏭');
    const bPlay = el('button', { class: 'btn', title: 'Automatisch abspielen' }, '⏵ Abspielen');
    const count = el('span', { class: 'count' });
    const ctrl = el('div', { class: 'viz-ctrl' }, bFirst, bPrev, bNext, bLast, bPlay, slider, count);
    const legend = el('div', { class: 'tr-status', style: 'font-size:13px;color:var(--ink-2)' }, el('span', { html: '<b style="color:var(--red)">→</b> Zeile, die als Nächstes läuft &nbsp; <b style="color:var(--green)">→</b> Zeile, die gerade gelaufen ist &nbsp; • = Referenz (Pfeil auf ein Objekt)' + (res.truncated ? ' &nbsp; <b>Nur die ersten ' + steps.length + ' Schritte werden gezeigt.</b>' : '') }));
    wrap.append(grid, ctrl, stat, el('div', { class: 'out-label', style: 'padding:8px 16px 0;margin:0' }, 'Bisherige Ausgabe'), outEl, legend);
    box.append(el('div', { class: 'tracer-box', style: 'margin:0' }, wrap));
    if (res.error) box.append(E().errorCard(res.error, code));

    let i = 0;
    let timer = null;
    function show(k) {
      i = Math.max(0, Math.min(steps.length - 1, k));
      slider.value = String(i);
      const s = steps[i];
      const prev = steps[i - 1];
      rows.forEach((r) => { r.classList.remove('cur', 'prev'); r.children[1].textContent = ''; });
      if (prev && prev.line && rows[prev.line - 1] && prev.line !== s.line) { rows[prev.line - 1].classList.add('prev'); rows[prev.line - 1].children[1].textContent = '→'; }
      if (rows[s.line - 1]) { rows[s.line - 1].classList.add('cur'); rows[s.line - 1].children[1].textContent = '→'; scrollIntoViewIfNeeded(codeView, rows[s.line - 1]); }
      count.textContent = `Schritt ${i + 1} / ${steps.length}`;
      const top = s.frames[s.frames.length - 1];
      const fname = top ? top.name : '';
      let txt;
      if (s.ev === 'call') txt = `<b>${esc(fname)}</b> wird aufgerufen. Für seine Parameter und lokalen Variablen entsteht ein neuer Rahmen.`;
      else if (s.ev === 'return') txt = `<b>${esc(fname === 'Global' ? 'Das Programm' : fname)}</b> ${fname === 'Global' ? 'endet' : 'ist fertig und gibt <code>' + esc(valText(s.ret, s.heap)) + '</code> zurück. Sein Rahmen verschwindet nach diesem Schritt'}.`;
      else if (s.ev === 'exception') txt = `<b style="color:var(--red)">Fehler:</b> ${esc(s.exc || '')}`;
      else txt = `Als Nächstes läuft Zeile <b>${s.line}</b>: <code>${esc((lines[s.line - 1] || '').trim())}</code>`;
      stat.innerHTML = txt;
      outEl.textContent = s.out || '';
      if (!s.out) outEl.innerHTML = '<span style="color:var(--ink-3);font-style:italic;font-family:var(--f-body)">(noch nichts ausgegeben)</span>';
      renderMemory(mem, s);
    }
    function scrollIntoViewIfNeeded(container, row) {
      const top = row.offsetTop - container.offsetTop;
      if (top < container.scrollTop || top > container.scrollTop + container.clientHeight - 30) container.scrollTop = Math.max(0, top - 60);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; bPlay.textContent = '⏵ Abspielen'; } }
    bFirst.addEventListener('click', () => { stop(); show(0); });
    bPrev.addEventListener('click', () => { stop(); show(i - 1); });
    bNext.addEventListener('click', () => { stop(); show(i + 1); });
    bLast.addEventListener('click', () => { stop(); show(steps.length - 1); });
    slider.addEventListener('input', () => { stop(); show(+slider.value); });
    bPlay.addEventListener('click', () => {
      if (timer) { stop(); return; }
      if (i >= steps.length - 1) show(0);
      bPlay.textContent = '⏸ Anhalten';
      timer = setInterval(() => { if (i >= steps.length - 1) stop(); else show(i + 1); }, 650);
    });
    show(0);
  }

  function valText(v, heap) {
    if (!v) return '';
    if (v[0] === 'p' || v[0] === 'f') return v[1];
    const o = heap[v[1]];
    if (!o) return 'object';
    if (o.t === 'obj') return o.cls + '-object';
    if (o.t === 'list') return 'list';
    return o.t;
  }

  function renderMemory(mem, s) {
    const { el } = E();
    mem.innerHTML = '';
    const layout = el('div', { class: 'tr-layout' });
    const framesCol = el('div', { class: 'tr-frames' });
    const arrows = [];
    const depth = {};
    const order = [];
    const queue = [];
    const visit = (v, d) => {
      if (!v || v[0] !== 'r') return;
      const id = v[1];
      if (!(id in s.heap) || s.heap[id] == null) return;
      if (depth[id] == null) { depth[id] = d; order.push(id); queue.push(id); }
    };
    s.frames.forEach((f) => f.vars.forEach(([, v]) => visit(v, 0)));
    if (s.ret) visit(s.ret, 0);
    while (queue.length) {
      const id = queue.shift();
      const o = s.heap[id];
      const d = depth[id] + 1;
      if (o.t === 'obj') o.fields.forEach(([, v]) => visit(v, d));
      else if (o.t === 'list' || o.t === 'tuple') o.items.forEach((v) => visit(v, d));
      else if (o.t === 'dict') o.items.forEach(([k, v]) => { visit(k, d); visit(v, d); });
    }
    const valCell = (v, cls) => {
      const c = el('span', { class: cls || 'v' });
      if (!v) return c;
      if (v[0] === 'r' && s.heap[v[1]]) {
        const dot = el('span', { class: 'ptr', 'data-to': v[1] });
        c.append(dot);
      } else {
        c.textContent = v[1];
        if (v[1] === 'None') c.style.color = 'var(--ink-3)';
      }
      return c;
    };
    s.frames.forEach((f, idx) => {
      const active = idx === s.frames.length - 1;
      const fr = el('div', { class: 'tr-frame' + (active ? ' active' : '') }, el('h6', null, f.name === 'Global' ? 'Globale Variablen' : f.name + '(…)'));
      if (!f.vars.length) fr.append(el('div', { class: 'tr-var' }, el('span', { style: 'color:var(--ink-3)' }, '(leer)'), el('span')));
      f.vars.forEach(([name, v]) => fr.append(el('div', { class: 'tr-var' }, el('span', null, name), valCell(v))));
      if (active && s.ev === 'return' && f.name !== 'Global') fr.append(el('div', { class: 'tr-var', style: 'background:var(--red-soft)' }, el('span', { style: 'color:var(--red)' }, 'return'), valCell(s.ret)));
      framesCol.append(fr);
    });
    layout.append(framesCol);
    const heapEl = el('div', { class: 'tr-heap' });
    const cols = [];
    order.forEach((id) => { const d = depth[id]; (cols[d] = cols[d] || []).push(id); });
    cols.forEach((ids) => {
      const col = el('div', { class: 'tr-col' });
      (ids || []).forEach((id) => col.append(objBox(id, s.heap[id])));
      heapEl.append(col);
    });
    if (order.length) layout.append(heapEl);
    mem.append(layout);

    function objBox(id, o) {
      if (o.t === 'obj') {
        const b = el('div', { class: 'tr-obj', 'data-oid': id }, el('h6', null, ': ' + o.cls));
        if (!o.fields.length) b.append(el('div', { class: 'row' }, el('span', { style: 'color:var(--ink-3)' }, '(keine Attribute)'), el('span')));
        o.fields.forEach(([k, v]) => b.append(el('div', { class: 'row' }, el('span', null, k), valCell(v))));
        return b;
      }
      if (o.t === 'list' || o.t === 'tuple') {
        const b = el('div', { class: 'tr-obj list', 'data-oid': id }, el('h6', null, o.t + ' (len ' + (o.items.length + (o.more || 0)) + ')'));
        const cells = el('div', { class: 'tr-list-cells' });
        if (!o.items.length) cells.append(el('div', { class: 'cell', style: 'color:var(--ink-3)' }, 'leer'));
        o.items.forEach((v, k) => cells.append(el('div', { class: 'cell' }, el('small', null, String(k)), valCell(v, 'cv'))));
        if (o.more) cells.append(el('div', { class: 'cell' }, '…'));
        b.append(cells);
        return b;
      }
      if (o.t === 'dict') {
        const b = el('div', { class: 'tr-obj list', 'data-oid': id }, el('h6', null, 'dict'));
        o.items.forEach(([k, v]) => b.append(el('div', { class: 'row' }, valCell(k, 'k'), valCell(v))));
        return b;
      }
      return el('div', { class: 'tr-obj', 'data-oid': id }, el('h6', null, o.repr || o.t));
    }

    requestAnimationFrame(() => drawArrows(layout));
  }

  function drawArrows(layout) {
    const old = layout.querySelector('svg.tr-arrows');
    if (old) old.remove();
    const base = layout.getBoundingClientRect();
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'tr-arrows');
    svg.setAttribute('width', layout.scrollWidth);
    svg.setAttribute('height', layout.scrollHeight);
    const defs = document.createElementNS(NS, 'defs');
    defs.innerHTML = '<marker id="trh" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--blue)"></path></marker>';
    svg.append(defs);
    layout.querySelectorAll('.ptr[data-to]').forEach((dot) => {
      const target = layout.querySelector(`[data-oid="${dot.dataset.to}"]`);
      if (!target) return;
      const a = dot.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      const x1 = a.left + a.width / 2 - base.left;
      const y1 = a.top + a.height / 2 - base.top;
      let x2 = b.left - base.left;
      let y2 = b.top - base.top + 12;
      let d;
      if (x2 > x1 + 10) {
        const mx = (x1 + x2) / 2;
        d = `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2 - 2},${y2}`;
      } else {
        x2 = b.left - base.left + Math.min(30, b.width / 2);
        y2 = b.top - base.top - 1;
        d = `M${x1},${y1} C${x1 + 50},${y1} ${x2},${y2 - 50} ${x2},${y2}`;
      }
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', 'var(--blue)');
      p.setAttribute('stroke-width', '1.6');
      p.setAttribute('marker-end', 'url(#trh)');
      svg.append(p);
    });
    layout.append(svg);
  }

  window.Tracer = { widget, run };
})();
