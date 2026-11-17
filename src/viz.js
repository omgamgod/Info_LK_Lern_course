/* Interactive visualisations. Each Viz.name(host, cfg) builds its own UI inside host. */
(() => {
  'use strict';
  const D = () => window.Diagrams;
  const U = () => window.UI;
  const NS = 'http://www.w3.org/2000/svg';

  // ------------------------------------------------------------------ graph presets (from the course's own .grdb files)
  const GRAPHS = {
    autobahn: { nodes: [['FD', 168, 89], ['WÜ', 165, 185], ['UL', 136, 326], ['S', 39, 270], ['LI', 105, 419], ['A', 236, 356], ['M', 360, 384], ['N', 320, 214], ['HO', 377, 90], ['R', 459, 262], ['RO', 488, 406]],
      edges: [['WÜ', 'FD', 86], ['S', 'UL', 103], ['UL', 'WÜ', 165], ['UL', 'LI', 126], ['UL', 'A', 59], ['A', 'M', 64], ['M', 'N', 163], ['WÜ', 'N', 104], ['N', 'HO', 116], ['N', 'R', 80], ['R', 'M', 117], ['M', 'RO', 60], ['HO', 'R', 166], ['WÜ', 'HO', 192]] },
    autobahn_klein: { nodes: [['M', 150, 380], ['N', 60, 170], ['HO', 270, 40], ['R', 470, 170], ['RO', 400, 380]],
      edges: [['M', 'N', 163], ['N', 'HO', 116], ['N', 'R', 80], ['R', 'M', 117], ['M', 'RO', 60], ['HO', 'R', 166], ['RO', 'R', 177], ['RO', 'N', 223], ['RO', 'HO', 339], ['M', 'HO', 279]] },
    abiturfahrt: { nodes: [['Nürnberg', 359, 32], ['München', 388, 126], ['Innsbruck', 406, 220], ['Verona', 358, 328], ['Bologna', 412, 420], ['Venedig', 520, 325], ['Salzburg', 540, 140]],
      edges: [['Nürnberg', 'München', 170], ['München', 'Innsbruck', 150], ['Innsbruck', 'Verona', 270], ['Verona', 'Bologna', 140], ['Verona', 'Venedig', 110], ['Venedig', 'Salzburg', 450], ['München', 'Salzburg', 145]], box: true },
    beispiel: { nodes: [['A', 62, 419], ['B', 137, 404], ['C', 275, 382], ['D', 338, 353], ['E', 474, 328], ['F', 568, 387], ['G', 700, 359], ['I', 84, 288], ['J', 170, 273], ['K', 273, 287], ['L', 88, 202], ['M', 246, 211], ['N', 371, 221], ['O', 537, 192], ['H', 689, 279], ['P', 136, 115], ['Q', 312, 125], ['R', 425, 121], ['S', 584, 115], ['T', 83, 68], ['U', 221, 40], ['V', 388, 51], ['W', 677, 70]],
      edges: [['I', 'A'], ['A', 'B'], ['B', 'I'], ['I', 'J'], ['J', 'C'], ['B', 'C'], ['J', 'K'], ['K', 'C'], ['C', 'D'], ['D', 'E'], ['E', 'F'], ['F', 'G'], ['E', 'H'], ['G', 'H'], ['L', 'I'], ['M', 'K'], ['K', 'N'], ['E', 'O'], ['O', 'H'], ['P', 'L'], ['M', 'P'], ['M', 'Q'], ['N', 'Q'], ['N', 'R'], ['R', 'S'], ['S', 'O'], ['T', 'P'], ['P', 'U'], ['U', 'T'], ['U', 'V'], ['V', 'R'], ['S', 'W'], ['W', 'H'], ['N', 'E']], weights: false },
    beispiel2: { nodes: [['A', 62, 419], ['B', 137, 404], ['C', 275, 382], ['D', 338, 353], ['E', 474, 328], ['F', 568, 387], ['G', 700, 359], ['I', 84, 288], ['J', 170, 273], ['K', 273, 287], ['L', 88, 202], ['M', 246, 211], ['N', 371, 221], ['O', 537, 192], ['H', 689, 279], ['P', 136, 115], ['Q', 312, 125], ['R', 425, 121], ['S', 584, 115], ['T', 83, 68], ['U', 221, 40], ['V', 388, 51], ['W', 677, 70]],
      edges: [['I', 'A'], ['A', 'B'], ['B', 'I'], ['I', 'J'], ['J', 'C'], ['B', 'C'], ['J', 'K'], ['K', 'C'], ['C', 'D'], ['E', 'F'], ['F', 'G'], ['E', 'H'], ['G', 'H'], ['L', 'I'], ['M', 'K'], ['K', 'N'], ['E', 'O'], ['O', 'H'], ['P', 'L'], ['M', 'P'], ['M', 'Q'], ['N', 'Q'], ['N', 'R'], ['S', 'O'], ['T', 'P'], ['P', 'U'], ['U', 'T'], ['U', 'V'], ['V', 'R'], ['S', 'W'], ['W', 'H']], weights: false },
    ice: { nodes: [['HH', 354, 27], ['H', 353, 110], ['FD', 380, 228], ['WÜ', 426, 322], ['N', 513, 388], ['A', 478, 486], ['M', 567, 524], ['B', 523, 77], ['L', 516, 178], ['DD', 630, 226], ['F', 301, 288], ['S', 352, 443], ['F2', 240, 316], ['MA', 261, 407], ['K', 172, 242], ['D', 223, 149]],
      edges: [['HH', 'H', 74], ['B', 'H', 98], ['H', 'D', 100], ['D', 'K', 77], ['K', 'F2', 67], ['F2', 'F', 10], ['F', 'FD', 52], ['FD', 'H', 88], ['FD', 'L', 151], ['L', 'B', 67], ['L', 'DD', 73], ['FD', 'WÜ', 34], ['F', 'WÜ', 70], ['WÜ', 'N', 58], ['L', 'N', 189], ['F2', 'MA', 30], ['MA', 'S', 37], ['S', 'A', 98], ['A', 'N', 62], ['N', 'M', 71], ['M', 'A', 40], ['HH', 'B', 143]] },
    k7: { nodes: [['K1', 300, 40], ['K2', 190, 120], ['K3', 250, 200], ['K4', 330, 280], ['K5', 410, 200], ['K6', 430, 120], ['K7', 300, 120]],
      edges: [['K1', 'K2'], ['K1', 'K7'], ['K1', 'K6'], ['K2', 'K3'], ['K7', 'K3'], ['K6', 'K5'], ['K3', 'K4'], ['K5', 'K4']], weights: false },
    abcde: { nodes: [['A', 60, 50], ['B', 250, 50], ['C', 360, 150], ['D', 80, 190], ['E', 240, 240]],
      edges: [['A', 'B', 4], ['B', 'C', 3], ['B', 'D', 7], ['B', 'E', 8], ['C', 'E', 5], ['D', 'E', 2], ['D', 'A', 5]] },
    small: { nodes: [['A', 60, 60], ['B', 220, 40], ['C', 380, 80], ['D', 120, 210], ['E', 300, 220], ['F', 440, 230]],
      edges: [['A', 'B', 4], ['A', 'D', 2], ['B', 'C', 5], ['B', 'D', 3], ['B', 'E', 6], ['C', 'F', 3], ['D', 'E', 7], ['E', 'F', 2], ['C', 'E', 4]] },
    muesli: { nodes: [['Bananen', 470, 50], ['Dinkelflocken', 300, 40], ['Haferflocken', 190, 130], ['Mandeln', 300, 250], ['Rosinen', 110, 240], ['Schokolade', 440, 170]],
      edges: [['Dinkelflocken', 'Haferflocken', 1], ['Haferflocken', 'Rosinen', 1], ['Haferflocken', 'Mandeln', 3], ['Haferflocken', 'Schokolade', 2], ['Rosinen', 'Mandeln', 1], ['Mandeln', 'Schokolade', 2]], box: true },
  };
  function getGraph(cfg) {
    const base = typeof cfg.graph === 'string' ? GRAPHS[cfg.graph] : cfg.graph;
    return JSON.parse(JSON.stringify(base));
  }
  window.GRAPHS = GRAPHS;

  // ------------------------------------------------------------------ shared UI
  function shell(host, title, opts = {}) {
    const { el } = U();
    host.innerHTML = '';
    const head = el('div', { class: 'viz-head' }, el('span', { class: 'v-tag' }, opts.tag || 'Interaktiv'), el('span', { class: 'v-title' }, title));
    const stage = el('div', { class: 'viz-stage' });
    const panel = el('div', { class: 'panel' });
    const body = opts.side ? el('div', { class: 'viz-side' }, stage, panel) : stage;
    const ctrl = el('div', { class: 'viz-ctrl' });
    const info = el('div', { class: 'viz-info' });
    host.append(head, body, ctrl, info);
    return { head, stage, panel, ctrl, info };
  }
  function stepper(ctrl, render, opts = {}) {
    const { el } = U();
    let N = 0;
    let i = 0;
    let timer = null;
    const bF = el('button', { class: 'btn', title: 'Zum Anfang' }, '⏮');
    const bP = el('button', { class: 'btn' }, '◀ Zurück');
    const bN = el('button', { class: 'btn primary' }, 'Weiter ▶');
    const bL = el('button', { class: 'btn', title: 'Zum Ende springen' }, '⏭');
    const bPlay = el('button', { class: 'btn' }, '⏵ Abspielen');
    const speed = el('select', { 'aria-label': 'Tempo' }, el('option', { value: '900' }, 'langsam'), el('option', { value: '450', selected: true }, 'mittel'), el('option', { value: '120' }, 'schnell'), el('option', { value: '20' }, 'sehr schnell'));
    const count = el('span', { class: 'count' });
    ctrl.append(bF, bP, bN, bL, bPlay, el('label', null, 'Tempo', speed), count);
    function go(k) {
      i = Math.max(0, Math.min(N - 1, k));
      count.textContent = N ? `Schritt ${i + 1} / ${N}` : '';
      if (N) render(i);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; bPlay.textContent = '⏵ Abspielen'; } }
    function play() {
      if (timer) { stop(); return; }
      if (i >= N - 1) go(0);
      bPlay.textContent = '⏸ Anhalten';
      timer = setInterval(() => { if (i >= N - 1) stop(); else go(i + 1); }, +speed.value);
    }
    speed.addEventListener('change', () => { if (timer) { stop(); play(); } });
    bF.addEventListener('click', () => { stop(); go(0); });
    bP.addEventListener('click', () => { stop(); go(i - 1); });
    bN.addEventListener('click', () => { stop(); go(i + 1); });
    bL.addEventListener('click', () => { stop(); go(N - 1); });
    bPlay.addEventListener('click', play);
    return { reset(n, start = 0) { stop(); N = n; go(start); }, go, stop, get i() { return i; } };
  }
  function codeBox(lines) {
    const { el } = U();
    const box = el('div', { class: 'mini-code' });
    const rows = lines.map((l) => { const d = el('div', null, l || ' '); box.append(d); return d; });
    return { box, hl(k) { rows.forEach((r, j) => r.classList.toggle('hl', j === k)); } };
  }
  function select(label, options, value) {
    const { el } = U();
    const s = el('select', null, options.map(([v, t]) => el('option', { value: String(v), selected: String(v) === String(value) }, t)));
    return { label: el('label', null, label, s), s };
  }

  // ------------------------------------------------------------------ recursion stack (logic-level, no Python)
  const REC = {
    fak: { name: 'Fakultät', code: ['methode Fakultät(n)', '  falls n == 0 dann', '    return 1', '  sonst', '    return n * Fakultät(n - 1)', '  endefalls', 'endemethode'],
      base: (a) => a[0] === 0, baseVal: () => 1, next: (a) => [a[0] - 1], combine: (a, r) => a[0] * r, combineText: (a, r) => `${a[0]} · ${r}`, fmt: (a) => `Fakultät(${a[0]})`, pend: (a) => `${a[0]} · Fakultät(${a[0] - 1})` },
    sum: { name: 'Summe', code: ['methode Summe(n)', '  falls n == 0 dann', '    return 0', '  sonst', '    return n + Summe(n - 1)', '  endefalls', 'endemethode'],
      base: (a) => a[0] === 0, baseVal: () => 0, next: (a) => [a[0] - 1], combine: (a, r) => a[0] + r, combineText: (a, r) => `${a[0]} + ${r}`, fmt: (a) => `Summe(${a[0]})`, pend: (a) => `${a[0]} + Summe(${a[0] - 1})` },
    pot: { name: 'Potenz', code: ['methode Potenz(b, e)', '  falls e == 0 dann', '    return 1', '  sonst', '    return b * Potenz(b, e - 1)', '  endefalls', 'endemethode'],
      base: (a) => a[1] === 0, baseVal: () => 1, next: (a) => [a[0], a[1] - 1], combine: (a, r) => a[0] * r, combineText: (a, r) => `${a[0]} · ${r}`, fmt: (a) => `Potenz(${a[0]}, ${a[1]})`, pend: (a) => `${a[0]} · Potenz(${a[0]}, ${a[1] - 1})` },
    ggt: { name: 'GGTBerechnen', code: ['methode GGTBerechnen(zahl1, zahl2)', '  falls zahl2 == 0 dann', '    return zahl1', '  sonst', '    return GGTBerechnen(zahl2, zahl1 % zahl2)', '  endefalls', 'endemethode'],
      base: (a) => a[1] === 0, baseVal: (a) => a[0], next: (a) => [a[1], a[0] % a[1]], combine: (a, r) => r, combineText: (a, r) => `${r}`, fmt: (a) => `GGTBerechnen(${a[0]}, ${a[1]})`, pend: (a) => `GGTBerechnen(${a[1]}, ${a[0] % a[1]})` },
  };
  function recstack(host, cfg) {
    const { el, esc } = U();
    const F = REC[cfg.fn || 'fak'];
    const ui = shell(host, cfg.title || `So führt der Computer ${F.name}(…) aus`, { side: true });
    const cb = codeBox(F.code);
    ui.panel.append(el('h5', null, 'Pseudocode'), cb.box, el('h5', null, 'Aufrufstapel'));
    const stackEl = el('div', { class: 'stack' });
    ui.panel.append(stackEl);
    const svgHost = el('div');
    ui.stage.append(svgHost);
    const steps = [];
    const frames = [];
    (function rec(args, depth) {
      frames.push({ args, state: 'call' });
      steps.push({ kind: 'call', depth, frames: snap(), line: 0, text: `<b>${F.fmt(args)}</b> wird aufgerufen. Ein neuer Rahmen kommt oben auf den Stapel.` });
      if (F.base(args)) {
        steps.push({ kind: 'base', depth, frames: snap(), line: 2, text: `Rekursionsende erreicht: Die Bedingung in Zeile 2 ist wahr, also kennt <b>${F.fmt(args)}</b> sein Ergebnis direkt: <b>${F.baseVal(args)}</b>. Kein weiterer Aufruf.` });
        const v = F.baseVal(args);
        frames[frames.length - 1].state = 'ret';
        frames[frames.length - 1].val = v;
        steps.push({ kind: 'ret', depth, frames: snap(), line: 2, text: `${F.fmt(args)} gibt <b>${v}</b> zurück, sein Rahmen wird entfernt.` });
        frames.pop();
        return v;
      }
      frames[frames.length - 1].state = 'wait';
      frames[frames.length - 1].pend = F.pend(args);
      steps.push({ kind: 'step', depth, frames: snap(), line: 4, text: `Nicht das Rekursionsende, also Rekursionsschritt: ${F.fmt(args)} braucht <b>${F.pend(args)}</b> und muss deshalb <i>warten</i>, bis ${F.fmt(F.next(args))} fertig ist.` });
      const r = rec(F.next(args), depth + 1);
      const v = F.combine(args, r);
      frames[frames.length - 1].state = 'ret';
      frames[frames.length - 1].val = v;
      steps.push({ kind: 'ret', depth, frames: snap(), line: 4, text: `${F.fmt(F.next(args))} hat <b>${r}</b> geliefert. Jetzt kann ${F.fmt(args)} fertig rechnen: ${F.combineText(args, r)} = <b>${v}</b>. Es gibt ${v} zurück, sein Rahmen wird entfernt.` });
      frames.pop();
      return v;
    })(cfg.args || [cfg.n != null ? cfg.n : 4], 0);
    function snap() { return frames.map((f) => ({ ...f })); }
    const st = stepper(ui.ctrl, (i) => {
      const s = steps[i];
      cb.hl(s.line);
      stackEl.innerHTML = '';
      s.frames.forEach((f, k) => stackEl.append(el('div', { class: 'fr' + (k === s.frames.length - 1 ? ' top' : '') }, F.fmt(f.args) + (f.state === 'wait' ? '  wartet …' : f.state === 'ret' ? '  → ' + f.val : ''))));
      ui.info.innerHTML = s.text;
      drawTree(svgHost, i);
    });
    function drawTree(hostEl, upto) {
      // vertical "staircase" of calls: descent on the left, results going up on the right
      const S = D().S; const T = D().text;
      const all = [];
      (function collect(args) { all.push(args); if (!F.base(args)) collect(F.next(args)); })(cfg.args || [cfg.n != null ? cfg.n : 4]);
      const n = all.length;
      const W = 560; const rowH = 46; const H = n * rowH + 30;
      const svg = D().svgRoot(W, H, 'Rekursion');
      const mk = D().arrowDefs(svg, 'rs' + Math.random().toString(36).slice(2, 7), 'var(--blue)');
      const mk2 = D().arrowDefs(svg, 'rr' + Math.random().toString(36).slice(2, 7), 'var(--green)');
      const s = steps[upto];
      const vals = {};
      steps.slice(0, upto + 1).forEach((x) => { if (x.kind === 'ret') vals[x.depth] = x.text; });
      // which depths are visible / returned
      let maxDepth = 0;
      const returned = {};
      steps.slice(0, upto + 1).forEach((x) => { if (x.kind === 'call') maxDepth = Math.max(maxDepth, x.depth); if (x.kind === 'ret') returned[x.depth] = true; });
      const results = [];
      (function calc(args, d) { if (F.base(args)) { results[d] = F.baseVal(args); return results[d]; } const r = calc(F.next(args), d + 1); results[d] = F.combine(args, r); return results[d]; })(all[0], 0);
      all.forEach((args, d) => {
        if (d > maxDepth) return;
        const x = 20 + d * 34;
        const y = 16 + d * rowH;
        const label = F.fmt(args);
        const w = D().tw(label, 13, 'mono', 700) + 22;
        const cur = s.depth === d;
        svg.append(S('rect', { x, y, width: w, height: 30, rx: 7, fill: returned[d] ? 'var(--green-soft)' : cur ? 'var(--blue-soft)' : 'var(--sheet)', stroke: returned[d] ? 'var(--green)' : cur ? 'var(--blue)' : 'var(--ink)', 'stroke-width': cur ? 2.2 : 1.3 }));
        svg.append(T(x + w / 2, y + 15.5, label, { mono: true, size: 13, anchor: 'middle', weight: 700 }));
        const pendTxt = F.base(args) ? '= ' + F.baseVal(args) + '   (Rekursionsende)' : '= ' + F.pend(args);
        svg.append(T(x + w + 12, y + 15.5, returned[d] ? '= ' + results[d] : pendTxt, { mono: true, size: 13, fill: returned[d] ? 'var(--green)' : 'var(--ink-2)', weight: returned[d] ? 700 : 400 }));
        if (d > 0) svg.append(S('path', { d: `M${x - 34 + 14},${y - rowH + 30} v${rowH - 30 + 15 - 15} q0,15 14,15`, fill: 'none', stroke: 'var(--blue)', 'stroke-width': 1.5, 'marker-end': mk }));
        if (d > 0 && returned[d]) svg.append(T(x - 6, y - 8, '↑ ' + results[d], { hand: true, size: 18, anchor: 'end', fill: 'var(--green)' }));
      });
      svg.append(T(W - 10, H - 10, 'Aufrufe gehen nach unten ↓   Ergebnisse kommen nach oben zurück ↑', { size: 12, anchor: 'end', fill: 'var(--ink-3)' }));
      void mk2;
      hostEl.innerHTML = '';
      hostEl.append(svg);
    }
    st.reset(steps.length);
  }

  // ------------------------------------------------------------------ Towers of Hanoi
  function hanoi(host, cfg) {
    const { el } = U();
    const ui = shell(host, cfg.title || 'Türme von Hanoi', { side: true });
    const nSel = select('Scheiben', [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6']], cfg.n || 3);
    const stackEl = el('div', { class: 'stack' });
    const cb = codeBox(['TurmVerschieben(anzahl, von, nach):', '  falls anzahl > 0:', '    frei = 3 - von - nach', '    TurmVerschieben(anzahl-1, von, frei)', '    BewegenScheibe(von, nach)', '    TurmVerschieben(anzahl-1, frei, nach)']);
    ui.panel.append(el('h5', null, 'Algorithmus'), cb.box, el('h5', null, 'Aktive Aufrufe'), stackEl);
    let steps = [];
    function build(n) {
      steps = [];
      const towers = [[], [], []];
      for (let d = n; d >= 1; d--) towers[0].push(d);
      const stack = [];
      const snap = () => towers.map((t) => t.slice());
      steps.push({ towers: snap(), stack: [], text: `Start: ${n} Scheiben auf Turm 0. Ziel: Sie sollen auf Turm 2. Eine größere Scheibe darf nie auf einer kleineren liegen.`, line: 0, moves: 0 });
      let moves = 0;
      (function T(k, von, nach) {
        if (k === 0) return;
        const frei = 3 - von - nach;
        stack.push(`TurmVerschieben(${k}, ${von}, ${nach})`);
        if (k > 1) steps.push({ towers: snap(), stack: stack.slice(), text: `Um ${k} Scheiben von ${von} nach ${nach} zu bringen: zuerst die oberen ${k - 1} auf den freien Turm ${frei} (frei = 3 − ${von} − ${nach}).`, line: 3, moves });
        else steps.push({ towers: snap(), stack: stack.slice(), text: `TurmVerschieben(1, ${von}, ${nach}): nur eine Scheibe. Die beiden Unteraufrufe mit 0 Scheiben tun nichts (Rekursionsende), also wird die Scheibe direkt bewegt.`, line: 1, moves });
        T(k - 1, von, frei);
        const d = towers[von].pop();
        towers[nach].push(d);
        moves++;
        steps.push({ towers: snap(), stack: stack.slice(), text: `Scheibe <b>${d}</b> von Turm ${von} auf Turm ${nach} legen. (Zug ${moves})`, line: 4, moves, moved: d });
        if (k > 1) steps.push({ towers: snap(), stack: stack.slice(), text: `Jetzt ${k > 2 ? 'die ' + (k - 1) + ' Scheiben' : 'die Scheibe'} vom freien Turm ${frei} wieder obendrauf: Turm ${frei} → ${nach}.`, line: 5, moves });
        T(k - 1, frei, nach);
        stack.pop();
      })(n, 0, 2);
      steps.push({ towers: snap(), stack: [], text: `Fertig nach <b>${moves}</b> Zügen = 2<sup>${n}</sup> − 1.`, line: 0, moves });
    }
    function draw(s, n) {
      const S = D().S;
      const W = 600; const H = 230; const base = 200; const dh = 22;
      const svg = D().svgRoot(W, H, 'Türme');
      svg.append(S('rect', { x: 10, y: base, width: W - 20, height: 8, rx: 3, fill: 'var(--ink-2)' }));
      for (let t = 0; t < 3; t++) {
        const cx = 100 + t * 200;
        svg.append(S('rect', { x: cx - 4, y: base - 165, width: 8, height: 165, rx: 3, fill: 'var(--ink-3)' }));
        svg.append(D().text(cx, base + 22, 'Turm ' + t, { size: 13, anchor: 'middle', fill: 'var(--ink-2)' }));
        s.towers[t].forEach((d, k) => {
          const w = 30 + d * 22;
          svg.append(S('rect', { x: cx - w / 2, y: base - (k + 1) * dh, width: w, height: dh - 3, rx: 6, fill: d === s.moved ? 'var(--amber)' : `hsl(${220 + d * 22} 60% ${55 - d * 3}%)`, stroke: 'var(--ink)', 'stroke-width': 1 }));
          svg.append(D().text(cx, base - (k + 1) * dh + dh / 2 - 1, String(d), { size: 12, anchor: 'middle', weight: 700, fill: '#fff' }));
        });
      }
      void n;
      return svg;
    }
    const st = stepper(ui.ctrl, (i) => {
      const s = steps[i];
      ui.stage.innerHTML = '';
      ui.stage.append(draw(s, +nSel.s.value));
      stackEl.innerHTML = '';
      s.stack.forEach((f, k) => stackEl.append(el('div', { class: 'fr' + (k === s.stack.length - 1 ? ' top' : '') }, f)));
      if (!s.stack.length) stackEl.append(el('div', { style: 'color:var(--ink-3);font-size:13px' }, '(kein Aufruf aktiv)'));
      cb.hl(s.line);
      ui.info.innerHTML = `<span class="step-text">${s.text}</span> <span style="float:right;color:var(--ink-3)">moves: ${s.moves}</span>`;
    });
    ui.ctrl.prepend(nSel.label);
    nSel.s.addEventListener('change', () => { build(+nSel.s.value); st.reset(steps.length); });
    build(cfg.n || 3);
    st.reset(steps.length);
  }

  // ------------------------------------------------------------------ Levy C curve (turtle)
  function levy(host, cfg) {
    const { el } = U();
    const ui = shell(host, cfg.title || 'Levy-C-Kurve: recursion draws a fractal');
    const depth = el('input', { type: 'range', min: '0', max: '12', value: String(cfg.depth != null ? cfg.depth : 2) });
    const lab = el('span', { class: 'count' });
    const showPrev = el('input', { type: 'checkbox', checked: true });
    ui.ctrl.append(el('label', null, 'Tiefe', depth), el('label', null, showPrev, 'Tiefe − 1 zeigen'), lab);
    function pts(t) {
      const out = [[0, 0]];
      let x = 0; let y = 0; let a = 0;
      (function step(len, d) {
        if (d > 0) {
          a += 45; step(len * Math.SQRT1_2, d - 1);
          a -= 90; step(len * Math.SQRT1_2, d - 1);
          a += 45;
        } else {
          x += len * Math.cos((a * Math.PI) / 180); y -= len * Math.sin((a * Math.PI) / 180); out.push([x, y]);
        }
      })(300, t);
      return out;
    }
    function draw() {
      const t = +depth.value;
      const S = D().S;
      const W = 560; const H = 380;
      const svg = D().svgRoot(W, H, 'Lévy-Kurve');
      const ox = 130; const oy = 300;
      if (showPrev.checked && t > 0) {
        const p0 = pts(t - 1);
        svg.append(S('polyline', { points: p0.map(([x, y]) => `${ox + x},${oy + y}`).join(' '), fill: 'none', stroke: 'var(--ink-3)', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }));
      }
      const p = pts(t);
      svg.append(S('polyline', { points: p.map(([x, y]) => `${ox + x},${oy + y}`).join(' '), fill: 'none', stroke: 'var(--blue)', 'stroke-width': t > 8 ? 1 : 2.2, 'stroke-linejoin': 'round' }));
      svg.append(S('circle', { cx: ox, cy: oy, r: 4, fill: 'var(--red)' }));
      ui.stage.innerHTML = '';
      ui.stage.append(svg);
      lab.textContent = `Tiefe ${t}: ${2 ** t} ${t ? 'gerade Linien' : 'gerade Linie'}, jede ${(300 * Math.SQRT1_2 ** t).toFixed(1).replace('.', ',')} lang`;
      ui.info.innerHTML = t === 0 ? 'Tiefe 0 ist das <b>Rekursionsende</b>: Die Schildkröte geht nur eine gerade Linie (<code>Gehen(länge)</code>).' : `Tiefe ${t}: Jede Linie der Tiefe ${t - 1} (gestrichelt) wird durch zwei kürzere Linien mit einer 90°-Ecke ersetzt: +45° drehen, Tiefe ${t - 1} zeichnen, −90° drehen, Tiefe ${t - 1} zeichnen, +45° drehen. Längenfaktor 0,7071 = √2 / 2.`;
    }
    depth.addEventListener('input', draw);
    showPrev.addEventListener('change', draw);
    draw();
  }

  // ------------------------------------------------------------------ N queens backtracking (one queen per column)
  function queens(host, cfg) {
    const { el } = U();
    const ui = shell(host, cfg.title || 'Damenproblem: Backtracking Schritt für Schritt', { side: true });
    const nSel = select('Brett', [[4, '4 × 4'], [5, '5 × 5'], [6, '6 × 6'], [8, '8 × 8']], cfg.n || 4);
    const mSel = select('Ziel', [['one', 'erste Lösung'], ['all', 'alle Lösungen']], cfg.mode || 'one');
    ui.ctrl.prepend(nSel.label, mSel.label);
    const stats = el('div', { class: 'chips-line' });
    const logEl = el('div', { class: 'log' });
    const cb = codeBox(['SpalteBelegen(spalte):', '  für zeile von 0 bis n-1:', '    falls Feld(zeile, spalte) bedroht:', '      nächste Zeile probieren', '    sonst: Dame setzen', '      falls spalte == n-1: Lösung!', '      sonst SpalteBelegen(spalte+1)', '      Dame wieder entfernen (zurück)']);
    ui.panel.append(el('h5', null, 'Algorithmus'), cb.box, el('h5', null, 'Zähler'), stats, el('h5', null, 'Protokoll'), logEl);
    let steps = [];
    function build(n, all) {
      steps = [];
      const q = [];
      let tries = 0; let backs = 0; let sols = 0;
      const solutions = [];
      const threat = (row, col) => { for (let c = 0; c < q.length; c++) { const r = q[c]; if (r === row || Math.abs(r - row) === col - c) return c; } return -1; };
      const push = (o) => steps.push({ q: q.slice(), tries, backs, sols, solutions: solutions.slice(), ...o });
      const limit = 4000;
      (function place(col) {
        for (let row = 0; row < n; row++) {
          if (steps.length > limit) return true;
          tries++;
          const t = threat(row, col);
          if (t >= 0) { push({ try: [row, col], bad: [q[t], t], line: 2, text: `Spalte ${col}, Zeile ${row}: bedroht von der Dame in Spalte ${t} (Zeile ${q[t]}). Nächste Zeile probieren.` }); continue; }
          q.push(row);
          push({ line: 4, text: `Spalte ${col}, Zeile ${row} ist sicher → Dame setzen.` });
          if (col === n - 1) {
            sols++;
            solutions.push(q.slice());
            push({ line: 5, text: `Alle ${n} Spalten besetzt: <b>Lösung ${sols}</b> gefunden!`, sol: true });
            if (!all) return true;
          } else if (place(col + 1)) return true;
          q.pop();
          backs++;
          push({ line: 7, text: `Zurück zu Spalte ${col}: Dame aus Zeile ${row} entfernen und dort die nächste Zeile probieren (Backtracking).`, back: [row, col] });
        }
        if (col > 0) push({ line: 1, text: `Spalte ${col}: Keine Zeile passt. Sackgasse → zurück zu Spalte ${col - 1}.`, dead: col });
        return false;
      })(0);
      push({ line: 0, text: all ? `Suche beendet. ${sols} Lösungen für n = ${n}.` : (sols ? 'Erste Lösung gefunden – die Suche endet.' : 'Keine Lösung.') });
    }
    const st = stepper(ui.ctrl, (i) => {
      const s = steps[i];
      const n = +nSel.s.value;
      const pieces = s.q.map((r, c) => [r, c, '♛', s.sol ? 'green' : 'ink']);
      const marks = [];
      if (s.try) marks.push([s.try[0], s.try[1], 'red']);
      if (s.bad) marks.push([s.bad[0], s.bad[1], 'amber']);
      if (s.back) marks.push([s.back[0], s.back[1], 'violet']);
      ui.stage.innerHTML = '';
      ui.stage.append(D().board({ n, cell: n > 6 ? 40 : 52, pieces, marks }, null, { returnSvg: true }));
      cb.hl(s.line);
      stats.innerHTML = '';
      [['Versuche', s.tries], ['Rücksprünge', s.backs], ['Lösungen', s.sols]].forEach(([k, v]) => stats.append(el('span', null, `${k}: ${v}`)));
      logEl.innerHTML = steps.slice(Math.max(0, i - 6), i + 1).map((x, k, arr) => `<div class="${k === arr.length - 1 ? 'now' : ''}">${x.text.replace(/<[^>]+>/g, '')}</div>`).join('');
      ui.info.innerHTML = s.text;
    });
    const rebuild = () => { build(+nSel.s.value, mSel.s.value === 'all'); st.reset(steps.length); };
    nSel.s.addEventListener('change', rebuild);
    mSel.s.addEventListener('change', rebuild);
    rebuild();
  }

  // ------------------------------------------------------------------ knapsack decision tree
  function knapsack(host, cfg) {
    const { el } = U();
    const items = cfg.items || [[5, 40], [7, 35], [4, 12], [3, 30]];
    const cap = cfg.cap || 10;
    const ui = shell(host, cfg.title || 'Rucksackproblem als Entscheidungsbaum', { side: true });
    const bestEl = el('div', { class: 'chips-line' });
    const tbl = el('div', { html: '<table style="border-collapse:collapse;font-size:13px;font-family:var(--f-mono)"><tr><th style="border:1px solid var(--rule);padding:2px 6px">Nr</th>' + items.map((_, i) => `<td style="border:1px solid var(--rule);padding:2px 6px;text-align:center">${i}</td>`).join('') + '</tr><tr><th style="border:1px solid var(--rule);padding:2px 6px">kg</th>' + items.map((it) => `<td style="border:1px solid var(--rule);padding:2px 6px;text-align:center">${it[0]}</td>`).join('') + '</tr><tr><th style="border:1px solid var(--rule);padding:2px 6px">MJ</th>' + items.map((it) => `<td style="border:1px solid var(--rule);padding:2px 6px;text-align:center">${it[1]}</td>`).join('') + '</tr></table>' });
    ui.panel.append(el('h5', null, `Gegenstände (höchstens ${cap} kg)`), tbl, el('h5', null, 'Bisher am besten'), bestEl);
    const nodes = [];
    (function rec(i, w, v, path, parent, decision) {
      const node = { i, w, v, path: path.slice(), parent, decision, id: nodes.length, kids: [] };
      node.over = w > cap;
      nodes.push(node);
      if (parent != null) nodes[parent].kids.push(node.id);
      if (node.over || i === items.length) return;
      rec(i + 1, w + items[i][0], v + items[i][1], path.concat([i]), node.id, `+${i}`);
      rec(i + 1, w, v, path, node.id, `−${i}`);
    })(0, 0, 0, [], null, '');
    let leafX = 0;
    (function lay(id, d) {
      const n = nodes[id];
      n.d = d;
      if (!n.kids.length) { n.x = leafX; leafX += 1; } else { n.kids.forEach((k) => lay(k, d + 1)); n.x = (nodes[n.kids[0]].x + nodes[n.kids[n.kids.length - 1]].x) / 2; }
    })(0, 0);
    const order = nodes.map((n) => n.id);
    const colW = 62; const rowH = 74;
    const st = stepper(ui.ctrl, (k) => {
      const S = D().S; const T = D().text;
      const W = leafX * colW + 40; const H = (items.length + 1) * rowH + 30;
      const svg = D().svgRoot(W, H, 'Entscheidungsbaum');
      const shown = new Set(order.slice(0, k + 1));
      let best = null;
      order.slice(0, k + 1).forEach((id) => { const n = nodes[id]; if (!n.over && n.i === items.length && (!best || n.v > best.v)) best = n; });
      nodes.forEach((n) => {
        if (!shown.has(n.id) || n.parent == null) return;
        const p = nodes[n.parent];
        const x1 = 20 + p.x * colW + colW / 2; const y1 = 20 + p.d * rowH + 36;
        const x2 = 20 + n.x * colW + colW / 2; const y2 = 20 + n.d * rowH;
        svg.append(S('line', { x1, y1, x2, y2, stroke: n.decision[0] === '+' ? 'var(--blue)' : 'var(--ink-3)', 'stroke-width': 1.5, 'stroke-dasharray': n.over ? '4 4' : null }));
        svg.append(T((x1 + x2) / 2 + (n.decision[0] === '+' ? -8 : 8), (y1 + y2) / 2, n.decision[0] === '+' ? 'mit ' + n.decision.slice(1) : 'ohne', { size: 10.5, anchor: n.decision[0] === '+' ? 'end' : 'start', fill: 'var(--ink-3)' }));
      });
      nodes.forEach((n) => {
        if (!shown.has(n.id)) return;
        const x = 20 + n.x * colW + 4; const y = 20 + n.d * rowH;
        const isBest = best && best.id === n.id;
        const cur = n.id === order[k];
        svg.append(S('rect', { x, y, width: colW - 8, height: 36, rx: 7, fill: n.over ? 'var(--red-soft)' : isBest ? 'var(--green-soft)' : cur ? 'var(--blue-soft)' : 'var(--sheet)', stroke: n.over ? 'var(--red)' : isBest ? 'var(--green)' : cur ? 'var(--blue)' : 'var(--ink-2)', 'stroke-width': cur || isBest ? 2.2 : 1.2 }));
        svg.append(T(x + (colW - 8) / 2, y + 12, n.w + ' kg', { mono: true, size: 11, anchor: 'middle' }));
        svg.append(T(x + (colW - 8) / 2, y + 26, n.over ? 'zu schwer' : n.v + ' MJ', { mono: true, size: 11, anchor: 'middle', weight: 700, fill: n.over ? 'var(--red)' : null }));
      });
      ui.stage.innerHTML = '';
      ui.stage.append(svg);
      const n = nodes[order[k]];
      bestEl.innerHTML = best ? `<span class="hl">Gegenstände {${best.path.join(', ')}}: ${best.w} kg, ${best.v} MJ</span>` : '<span>noch keine</span>';
      const fin = k === order.length - 1 && best ? `<br><b>Suche beendet.</b> Beste Auswahl: Gegenstände {${best.path.join(', ')}} mit ${best.w} kg und <b>${best.v} MJ</b>.` : '';
      ui.info.innerHTML = (n.parent == null ? 'Start: leerer Rucksack. Für jeden Gegenstand wird entschieden: mitnehmen (linker Zweig) oder liegen lassen (rechter Zweig).' : n.over ? `Mit Gegenstand ${n.decision.slice(1)} wiegt der Rucksack <b>${n.w} kg &gt; ${cap} kg</b>. Dieser Zweig wird sofort abgeschnitten (keine tiefere Suche) – das ist der Backtracking-Schritt.` : n.i === items.length ? `Vollständige Entscheidung: Gegenstände {${n.path.join(', ') || '–'}} → ${n.w} kg, <b>${n.v} MJ</b>.` : `Entscheidung für Gegenstand ${n.i - 1} getroffen (${n.decision[0] === '+' ? 'mitgenommen' : 'liegen gelassen'}): bisher ${n.w} kg, ${n.v} MJ.`) + fin;
    });
    st.reset(order.length);
  }

  // ------------------------------------------------------------------ Sudoku candidates
  function sudoku(host, cfg) {
    const { el } = U();
    const ui = shell(host, cfg.title || 'Sudoku: FeldelementFixieren streicht Kandidaten', { side: true });
    const given = cfg.given || [[0, 2, 2], [1, 0, 6], [1, 4, 3], [2, 0, 4], [2, 2, 9], [2, 3, 1], [2, 4, 6], [2, 5, 7], [2, 8, 3], [3, 1, 1], [4, 2, 8], [4, 5, 4], [4, 6, 3], [4, 8, 2], [5, 6, 4], [5, 7, 7], [6, 1, 8], [6, 4, 9], [7, 4, 4], [7, 5, 3], [7, 8, 8], [8, 3, 5], [8, 4, 7], [8, 6, 9]];
    const cb = codeBox(['FeldelementFixieren(zeile, spalte, wert):', '  für i von 0 bis 8:', '    wert aus feld[zeile][i] streichen', '    wert aus feld[i][spalte] streichen', '  z0 = zeile // 3 * 3; s0 = spalte // 3 * 3', '  für die 9 Felder des Teilquadrats:', '    wert streichen', '  feld[zeile][spalte] = [wert]']);
    const stat = el('div', { class: 'chips-line' });
    ui.panel.append(el('h5', null, 'Pseudocode'), cb.box, el('h5', null, 'Zustand'), stat);
    const steps = [];
    let feld = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => [1, 2, 3, 4, 5, 6, 7, 8, 9]));
    const copy = (f) => f.map((r) => r.map((c) => c.slice()));
    steps.push({ feld: copy(feld), text: 'Start: Jedes Feld ist eine Liste aller Werte, die noch möglich sind: [1, 2, …, 9]. Kleine graue Ziffern = Kandidaten.', fix: null, line: 0 });
    given.forEach(([z, s, w]) => {
      const removed = [];
      for (let i = 0; i < 9; i++) {
        if (feld[z][i].includes(w) && i !== s) removed.push([z, i]);
        if (feld[i][s].includes(w) && i !== z) removed.push([i, s]);
      }
      const z0 = Math.floor(z / 3) * 3; const s0 = Math.floor(s / 3) * 3;
      for (let a = z0; a < z0 + 3; a++) for (let b = s0; b < s0 + 3; b++) if (feld[a][b].includes(w) && !(a === z && b === s) && !removed.some(([x, y]) => x === a && y === b)) removed.push([a, b]);
      removed.forEach(([a, b]) => { feld[a][b] = feld[a][b].filter((x) => x !== w); });
      feld[z][s] = [w];
      steps.push({ feld: copy(feld), fix: [z, s, w], removed, text: `FeldelementFixieren(${z}, ${s}, ${w}): Der Wert ${w} wird aus Zeile ${z}, Spalte ${s} und dem 3×3-Quadrat ab (${z0}, ${s0}) gestrichen – ${removed.length} Kandidatenlisten haben sich geändert.`, line: 7 });
    });
    const solved = feld.flat().filter((c) => c.length === 1).length;
    steps.push({ feld: copy(feld), text: `Alle ${given.length} vorgegebenen Werte sind fixiert. ${solved} Felder stehen fest, die übrigen haben noch mehrere Kandidaten. Jetzt probiert SchrittAusführen sie mit Backtracking aus.`, line: 0 });
    const st = stepper(ui.ctrl, (i) => {
      const s = steps[i];
      const S = D().S; const T = D().text;
      const c = 46; const svg = D().svgRoot(9 * c + 10, 9 * c + 10, 'Sudoku');
      const g = S('g', { transform: 'translate(5,5)' });
      const rm = new Set((s.removed || []).map(([a, b]) => a + ',' + b));
      for (let z = 0; z < 9; z++) {
        for (let sp = 0; sp < 9; sp++) {
          const inUnit = s.fix && (z === s.fix[0] || sp === s.fix[1] || (Math.floor(z / 3) === Math.floor(s.fix[0] / 3) && Math.floor(sp / 3) === Math.floor(s.fix[1] / 3)));
          const isFix = s.fix && z === s.fix[0] && sp === s.fix[1];
          g.append(S('rect', { x: sp * c, y: z * c, width: c, height: c, fill: isFix ? 'var(--blue-soft)' : rm.has(z + ',' + sp) ? 'var(--red-soft)' : inUnit ? 'var(--amber-soft)' : 'var(--sheet)', stroke: 'var(--rule)' }));
          const cell = s.feld[z][sp];
          if (cell.length === 1) g.append(T(sp * c + c / 2, z * c + c / 2 + 1, String(cell[0]), { mono: true, size: 21, anchor: 'middle', weight: 700, fill: isFix ? 'var(--blue)' : null }));
          else cell.forEach((v) => { const r = Math.floor((v - 1) / 3); const k = (v - 1) % 3; g.append(T(sp * c + 8 + k * 15, z * c + 9 + r * 14, String(v), { mono: true, size: 10, anchor: 'middle', fill: 'var(--ink-3)' })); });
        }
      }
      for (let k = 0; k <= 9; k += 3) {
        g.append(S('line', { x1: 0, y1: k * c, x2: 9 * c, y2: k * c, stroke: 'var(--ink)', 'stroke-width': 2 }));
        g.append(S('line', { x1: k * c, y1: 0, x2: k * c, y2: 9 * c, stroke: 'var(--ink)', 'stroke-width': 2 }));
      }
      svg.append(g);
      ui.stage.innerHTML = '';
      ui.stage.append(svg);
      cb.hl(s.line);
      const certain = s.feld.flat().filter((x) => x.length === 1).length;
      stat.innerHTML = `<span>feste Felder: ${certain}/81</span><span>übrige Kandidaten: ${s.feld.flat().reduce((a, x) => a + (x.length > 1 ? x.length : 0), 0)}</span>`;
      ui.info.innerHTML = s.text;
    });
    st.reset(steps.length);
  }

  // ------------------------------------------------------------------ DFS / BFS on a graph
  function graphwalk(host, cfg) {
    const { el, esc } = U();
    const ui = shell(host, cfg.title || 'Tiefensuche Schritt für Schritt', { side: true });
    const g0 = getGraph(cfg);
    const names = g0.nodes.map((n) => n[0]);
    const startSel = select('Start', names.map((n) => [n, n]), cfg.start || names[0]);
    const modeSel = select('Algorithmus', [['dfs', 'Tiefensuche (DFS)'], ['bfs', 'Breitensuche (BFS)']], cfg.mode || 'dfs');
    const ordSel = select('Nachbarreihenfolge', [['index', 'Matrixreihenfolge'], ['alpha', 'alphabetisch']], cfg.order || 'index');
    ui.ctrl.prepend(startSel.label);
    if (cfg.allowMode !== false) ui.ctrl.prepend(modeSel.label);
    if (cfg.allowOrder) ui.ctrl.prepend(ordSel.label);
    const adj = {};
    names.forEach((n) => { adj[n] = []; });
    g0.edges.forEach(([a, b, , dir]) => { adj[a].push(b); if (dir !== '->') adj[b].push(a); });
    const stackTitle = el('h5', null, 'Aufrufstapel');
    const stackEl = el('div', { class: 'stack' });
    const visEl = el('div', { class: 'chips-line' });
    const logEl = el('div', { class: 'log' });
    ui.panel.append(stackTitle, stackEl, el('h5', null, 'Besucht (in Reihenfolge)'), visEl, el('h5', null, 'Ausgabe'), logEl);
    let steps = [];
    function nbrs(n) {
      const list = adj[n].slice();
      if (ordSel.s.value === 'alpha') list.sort((a, b) => a.localeCompare(b, 'de'));
      else list.sort((a, b) => names.indexOf(a) - names.indexOf(b));
      return list;
    }
    function build() {
      steps = [];
      const start = startSel.s.value;
      const visited = [];
      const treeEdges = [];
      const log = [];
      const finished = new Set();
      if (modeSel.s.value === 'dfs') {
        stackTitle.textContent = 'Aufrufstapel (KnotenBesuchen)';
        const stack = [];
        const push = (o) => steps.push({ visited: visited.slice(), tree: treeEdges.slice(), stack: stack.slice(), finished: new Set(finished), log: log.slice(), ...o });
        (function visit(n, from) {
          visited.push(n); stack.push(n);
          log.push('besuche ' + n);
          push({ cur: n, text: `<b>KnotenBesuchen(${n})</b>: ${n} als besucht markieren. Jetzt die Nachbarn nacheinander ansehen: ${nbrs(n).join(', ') || '—'}.` });
          for (const m of nbrs(n)) {
            if (visited.includes(m)) { push({ cur: n, check: [n, m], text: `Nachbar ${m} von ${n} ist schon besucht → überspringen (Abbruch: kein neuer Aufruf).` }); continue; }
            treeEdges.push([n, m]);
            push({ cur: n, go: [n, m], text: `Nachbar ${m} ist noch nicht besucht → tiefer gehen: KnotenBesuchen(${m}) aufrufen.` });
            visit(m, n);
            log.push('zurück nach ' + n);
            push({ cur: n, text: `Zurück in KnotenBesuchen(${n}) – weiter mit dem nächsten Nachbarn.` });
          }
          finished.add(n);
          stack.pop();
          push({ cur: from || n, done: n, text: `Alle Nachbarn von ${n} sind erledigt. KnotenBesuchen(${n}) endet; der Rahmen wird entfernt${from ? ` und es geht zurück zu ${from}` : ''}.` });
        })(start, null);
        push({ cur: null, text: `Tiefensuche beendet. Reihenfolge: <b>${visited.join(' → ')}</b>. ${visited.length === names.length ? 'Alle Knoten wurden erreicht → der Graph ist zusammenhängend.' : `${names.length - visited.length} Knoten wurden nicht erreicht → der Graph ist <b>nicht</b> zusammenhängend.`}` });
      } else {
        stackTitle.textContent = 'Warteschlange';
        const queue = [start];
        visited.push(start);
        const push = (o) => steps.push({ visited: visited.slice(), tree: treeEdges.slice(), stack: queue.slice(), finished: new Set(finished), log: log.slice(), queue: true, ...o });
        push({ cur: null, text: `Start: ${start} markieren und in die Warteschlange stellen.` });
        while (queue.length) {
          const n = queue.shift();
          log.push('besuche ' + n);
          push({ cur: n, text: `<b>${n}</b> vorne aus der Warteschlange nehmen (FIFO) und die Nachbarn ansehen: ${nbrs(n).join(', ')}.` });
          for (const m of nbrs(n)) {
            if (visited.includes(m)) continue;
            visited.push(m); queue.push(m); treeEdges.push([n, m]);
            push({ cur: n, go: [n, m], text: `${m} ist neu → markieren und hinten an die Warteschlange anhängen.` });
          }
          finished.add(n);
        }
        push({ cur: null, text: `Breitensuche beendet. Reihenfolge: <b>${log.map((l) => l.slice(8)).join(' → ')}</b>. Die Knoten werden Schicht für Schicht besucht: zuerst alle Nachbarn des Starts, dann deren Nachbarn, …` });
      }
    }
    const st = stepper(ui.ctrl, (i) => {
      const s = steps[i];
      const g = JSON.parse(JSON.stringify(g0));
      const hlN = {};
      s.visited.forEach((n) => { hlN[n] = s.finished.has(n) ? 'green' : 'amber'; });
      if (s.cur) hlN[s.cur] = 'blue';
      const hlE = s.tree.map(([a, b]) => [a, b, 'blue']);
      if (s.check) hlE.push([s.check[0], s.check[1], 'grey']);
      if (s.go) hlE.push([s.go[0], s.go[1], 'red']);
      g.hl = { nodes: hlN, edges: hlE };
      ui.stage.innerHTML = '';
      ui.stage.append(D().graph(g, null, { returnSvg: true }));
      stackEl.innerHTML = '';
      if (s.queue) {
        stackEl.style.flexDirection = 'row'; stackEl.style.flexWrap = 'wrap';
        s.stack.forEach((n, k) => stackEl.append(el('div', { class: 'fr' + (k === 0 ? ' top' : '') }, n)));
        if (!s.stack.length) stackEl.append(el('div', { style: 'color:var(--ink-3);font-size:13px' }, '(leer)'));
      } else {
        stackEl.style.flexDirection = 'column-reverse';
        s.stack.forEach((n, k) => stackEl.append(el('div', { class: 'fr' + (k === s.stack.length - 1 ? ' top' : '') }, `KnotenBesuchen(${n})`)));
        if (!s.stack.length) stackEl.append(el('div', { style: 'color:var(--ink-3);font-size:13px' }, '(leer)'));
      }
      visEl.innerHTML = s.visited.map((n) => `<span class="${n === s.cur ? 'hl' : ''}">${esc(n)}</span>`).join('');
      logEl.innerHTML = s.log.slice(-12).map((l, k, a) => `<div class="${k === a.length - 1 ? 'now' : ''}">${esc(l)}</div>`).join('');
      ui.info.innerHTML = s.text + '<div style="font-size:13px;color:var(--ink-3);margin-top:4px">blau = aktueller Knoten · bernsteinfarben = besucht, noch auf dem Stapel · grün = fertig · blaue Kanten = Weg der Suche</div>';
    });
    const rebuild = () => { build(); st.reset(steps.length); };
    [startSel.s, modeSel.s, ordSel.s].forEach((s) => s.addEventListener('change', rebuild));
    rebuild();
  }

  // ------------------------------------------------------------------ all paths / optimal path / round trip
  function paths(host, cfg) {
    const { el, esc } = U();
    const tour = cfg.mode === 'tour';
    const ui = shell(host, cfg.title || (tour ? 'Handlungsreisender: alle Rundreisen' : 'Alle Wege und der optimale'), { side: true });
    const g0 = getGraph(cfg);
    const names = g0.nodes.map((n) => n[0]);
    const W = {};
    names.forEach((a) => { W[a] = {}; });
    g0.edges.forEach(([a, b, w]) => { W[a][b] = w; W[b][a] = w; });
    const startSel = select('Start', names.map((n) => [n, n]), cfg.start || names[0]);
    const goalSel = select('Ziel', names.map((n) => [n, n]), cfg.goal || names[names.length - 1]);
    const pruneSel = el('input', { type: 'checkbox' });
    ui.ctrl.prepend(startSel.label);
    if (!tour) ui.ctrl.prepend(goalSel.label);
    ui.ctrl.prepend(el('label', null, pruneSel, 'zu lange Wege abschneiden'));
    const curEl = el('div', { class: 'chips-line' });
    const bestEl = el('div', { class: 'chips-line' });
    const foundEl = el('div', { class: 'log' });
    ui.panel.append(el('h5', null, tour ? 'Aktuelle Rundreise' : 'aktuellerWeg'), curEl, el('h5', null, tour ? 'Beste Rundreise' : 'optimalerWeg'), bestEl, el('h5', null, tour ? 'Gefundene vollständige Rundreisen' : 'Gefundene vollständige Wege'), foundEl);
    let steps = [];
    function build() {
      steps = [];
      const start = startSel.s.value;
      const goal = tour ? start : goalSel.s.value;
      const path = [];
      const found = [];
      let best = null;
      const push = (o) => steps.push({ path: path.slice(), found: found.slice(), best: best && { ...best, p: best.p.slice() }, ...o });
      const nb = (n) => names.filter((m) => W[n][m] != null);
      (function visit(n, len) {
        path.push(n);
        if (!tour && n === goal) {
          found.push({ p: path.slice(), len });
          const better = !best || len < best.len;
          if (better) best = { p: path.slice(), len };
          push({ cur: n, len, text: `Ziel ${goal} erreicht: Weg ${path.join('–')} mit Länge <b>${len}</b>. ${better ? 'Kürzer als alles bisher → wird der neue optimalerWeg (als Kopie gespeichert).' : `Nicht kürzer als der beste (${best.len}).`}`, complete: true });
        } else if (tour && path.length === names.length) {
          const back = W[n][start];
          if (back != null) {
            const tot = len + back;
            found.push({ p: path.concat([start]), len: tot });
            const better = !best || tot < best.len;
            if (better) best = { p: path.concat([start]), len: tot };
            push({ cur: n, len: tot, back: true, text: `Alle Orte besucht. Zurück nach ${start} (+${back}): Länge der Rundreise <b>${tot}</b>. ${better ? 'Neue beste Rundreise!' : `Nicht besser als ${best.len}.`}`, complete: true });
          }
        } else if (pruneSel.checked && best && len >= best.len) {
          push({ cur: n, len, cut: true, text: `Die Weglänge ${len} ist schon ≥ der besten bekannten ${best.len}. Tiefer suchen kann nicht helfen → abschneiden.` });
        } else {
          push({ cur: n, len, text: `<b>${n}</b> betreten (Weglänge ${len}). Markieren und jeden Nachbarn probieren, der noch nicht auf dem aktuellen Weg liegt.` });
          for (const m of nb(n)) {
            if (path.includes(m)) continue;
            visit(m, len + W[n][m]);
            push({ cur: n, len, text: `Zurück bei ${n}: ${m} wurde wieder vom Weg entfernt (und die Markierung gelöscht), damit andere Wege ihn noch benutzen können.` });
          }
        }
        path.pop();
        if (steps.length > 3000) throw new Error('too many');
      })(start, 0);
      push({ cur: null, end: true, text: best ? `Suche beendet: ${found.length} vollständige ${tour ? 'Rundreisen' : 'Wege'} geprüft. Optimal: <b>${best.p.join('–')}</b> mit Länge <b>${best.len}</b>.` : 'Es gibt keinen Weg.' });
    }
    const st = stepper(ui.ctrl, (i) => {
      const s = steps[i];
      const g = JSON.parse(JSON.stringify(g0));
      const hlN = {}; const hlE = [];
      if (s.end && s.best) { s.best.p.forEach((n) => { hlN[n] = 'green'; }); for (let k = 1; k < s.best.p.length; k++) hlE.push([s.best.p[k - 1], s.best.p[k], 'green']); }
      else {
        s.path.forEach((n) => { hlN[n] = 'amber'; });
        for (let k = 1; k < s.path.length; k++) hlE.push([s.path[k - 1], s.path[k], s.complete ? 'green' : s.cut ? 'red' : 'blue']);
        if (s.back) hlE.push([s.path[s.path.length - 1], s.path[0], 'green']);
        if (s.cur) hlN[s.cur] = s.cut ? 'red' : 'blue';
      }
      g.hl = { nodes: hlN, edges: hlE };
      ui.stage.innerHTML = '';
      ui.stage.append(D().graph(g, null, { returnSvg: true }));
      curEl.innerHTML = s.path.map((n) => `<span>${esc(n)}</span>`).join('') + (s.path.length ? `<span class="hl">${s.len != null ? s.len : ''}</span>` : '');
      bestEl.innerHTML = s.best ? s.best.p.map((n) => `<span>${esc(n)}</span>`).join('') + `<span class="hl">${s.best.len}</span>` : '<span>noch keine</span>';
      foundEl.innerHTML = s.found.map((f, k) => `<div>${k + 1}. ${esc(f.p.join('–'))} = ${f.len}</div>`).join('') || '<div>(noch keine)</div>';
      foundEl.scrollTop = foundEl.scrollHeight;
      ui.info.innerHTML = s.text;
    });
    const rebuild = () => { try { build(); } catch (e) { steps.push({ path: [], found: [], text: 'Zu viele Schritte zum Anzeigen.' }); } st.reset(steps.length); };
    [startSel.s, goalSel.s, pruneSel].forEach((s) => s.addEventListener('change', rebuild));
    rebuild();
  }

  // ------------------------------------------------------------------ maze (Ariadne's thread)
  function maze(host, cfg) {
    const { el } = U();
    const ui = shell(host, cfg.title || 'Labyrinth: Tiefensuche mit dem Ariadnefaden');
    const modeSel = select('Modus', [['first', 'erster Ausweg (Teil 1)'], ['short', 'kürzester Ausweg (Teil 2)']], 'first');
    const newBtn = el('button', { class: 'btn' }, '↻ Neues Labyrinth');
    ui.ctrl.append(modeSel.label, newBtn);
    const Wc = cfg.w || 15; const Hc = cfg.h || 11;
    let grid; let start; let exit; let steps = [];
    let seed = cfg.seed || 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    function generate() {
      grid = Array.from({ length: Hc }, () => Array(Wc).fill(1));
      const carve = (x, y) => {
        grid[y][x] = 0;
        const dirs = [[2, 0], [-2, 0], [0, 2], [0, -2]].sort(() => rnd() - 0.5);
        for (const [dx, dy] of dirs) {
          const nx = x + dx; const ny = y + dy;
          if (nx > 0 && ny > 0 && nx < Wc - 1 && ny < Hc - 1 && grid[ny][nx] === 1) { grid[y + dy / 2][x + dx / 2] = 0; carve(nx, ny); }
        }
      };
      carve(1, 1);
      for (let k = 0; k < 6; k++) { const x = 1 + Math.floor(rnd() * (Wc - 2)); const y = 1 + Math.floor(rnd() * (Hc - 2)); if ((x + y) % 2 === 1) grid[y][x] = 0; }
      exit = [Wc - 1, Hc - 2]; grid[exit[1]][exit[0]] = 0;
      start = [1, 1];
    }
    function build() {
      steps = [];
      const visited = new Set();
      const path = [];
      const key = (x, y) => x + ',' + y;
      const push = (o) => steps.push({ path: path.slice(), visited: new Set(visited), ...o });
      const nbrs = (x, y) => [[1, 0], [0, 1], [-1, 0], [0, -1]].map(([dx, dy]) => [x + dx, y + dy]).filter(([a, b]) => a >= 0 && b >= 0 && a < Wc && b < Hc && grid[b][a] === 0);
      if (modeSel.s.value === 'first') {
        (function go(x, y) {
          visited.add(key(x, y)); path.push([x, y]);
          push({ text: `(${x}, ${y}) betreten – den Faden einen Schritt weiter abrollen.` });
          if (x === exit[0] && y === exit[1]) { push({ done: true, text: `Ausgang gefunden! Der Faden (jetzt grün) ist der Weg hinaus: ${path.length} Felder. Jeder Aufruf gibt <b>True</b> an seinen Aufrufer zurück, also endet die ganze Rekursion.` }); return true; }
          for (const [a, b] of nbrs(x, y)) { if (!visited.has(key(a, b)) && go(a, b)) return true; }
          path.pop();
          push({ back: [x, y], text: `Sackgasse bei (${x}, ${y}): Jeder Nachbar ist eine Wand oder schon besucht. Den Faden wieder aufrollen (return False) und das Feld als erledigt markieren.` });
          return false;
        })(start[0], start[1]);
      } else {
        let best = null; let count = 0;
        (function go(x, y) {
          path.push([x, y]); visited.add(key(x, y));
          if (best && path.length >= best.length) { visited.delete(key(x, y)); path.pop(); return; }
          if (x === exit[0] && y === exit[1]) { count++; best = path.slice(); push({ best: best.slice(), text: `Weg ${count} zum Ausgang gefunden: ${path.length} Felder. ${count > 1 ? 'Kürzer als der bisher beste.' : ''}` }); }
          else for (const [a, b] of nbrs(x, y)) if (!visited.has(key(a, b))) go(a, b);
          visited.delete(key(x, y)); path.pop();
        })(start[0], start[1]);
        steps.push({ path: best || [], visited: new Set(), best, done: true, text: `Alle Wege wurden ausprobiert (auf dem Rückweg werden die Markierungen wieder gelöscht). Der kürzeste Weg hat <b>${best ? best.length : 0}</b> Felder.` });
      }
    }
    const st = stepper(ui.ctrl, (i) => {
      const s = steps[i];
      const S = D().S; const c = 26;
      const svg = D().svgRoot(Wc * c + 4, Hc * c + 4, 'Labyrinth');
      const g = S('g', { transform: 'translate(2,2)' });
      for (let y = 0; y < Hc; y++) for (let x = 0; x < Wc; x++) {
        const k = x + ',' + y;
        const wall = grid[y][x] === 1;
        g.append(S('rect', { x: x * c, y: y * c, width: c, height: c, fill: wall ? 'var(--ink)' : s.visited.has(k) ? 'var(--amber-soft)' : 'var(--sheet)' }));
      }
      g.append(S('rect', { x: exit[0] * c, y: exit[1] * c, width: c, height: c, fill: 'var(--green)' }));
      const pts = (s.best && s.done ? s.best : s.path).map(([x, y]) => `${x * c + c / 2},${y * c + c / 2}`).join(' ');
      if (pts) g.append(S('polyline', { points: pts, fill: 'none', stroke: s.done ? 'var(--green)' : 'var(--blue)', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
      if (s.best && !s.done) g.append(S('polyline', { points: s.best.map(([x, y]) => `${x * c + c / 2},${y * c + c / 2}`).join(' '), fill: 'none', stroke: 'var(--green)', 'stroke-width': 4, opacity: 0.6 }));
      const hd = (s.path.length ? s.path[s.path.length - 1] : start);
      g.append(S('circle', { cx: hd[0] * c + c / 2, cy: hd[1] * c + c / 2, r: 8, fill: 'var(--red)' }));
      svg.append(g);
      ui.stage.innerHTML = '';
      ui.stage.append(svg);
      ui.info.innerHTML = s.text;
    });
    const rebuild = () => { build(); st.reset(steps.length); };
    modeSel.s.addEventListener('change', rebuild);
    newBtn.addEventListener('click', () => { seed = Math.floor(Math.random() * 100000) + 1; generate(); rebuild(); });
    generate();
    rebuild();
  }

  // ------------------------------------------------------------------ linked structures (queue / list / Kompositum)
  function listops(host, cfg) {
    const { el, esc } = U();
    const mode = cfg.mode || 'list';
    const titles = { queue: 'Warteschlange: Patienten zeigen auf ihren Nachfolger', qknoten: 'Warteschlange mit KNOTEN (Struktur und Daten getrennt)', list: 'Rekursive Liste (KNOTEN, ohne ABSCHLUSS)', komp: 'Liste als Kompositum (KNOTEN + ABSCHLUSS)' };
    const ui = shell(host, cfg.title || titles[mode], { side: true });
    const nameIn = el('input', { type: 'text', value: 'Emil', size: '7', 'aria-label': 'Name' });
    const opSel = el('select');
    const ops = cfg.ops || (mode === 'queue' || mode === 'qknoten' ? ['Einfügen', 'Entfernen'] : ['VorneEinfügen', 'HintenEinfügen', 'LängeGeben', 'AnfangEntfernen', 'EndeEntfernen', 'EinfügenVor', 'Suchen']);
    ops.forEach((o) => opSel.append(el('option', { value: o }, o)));
    const vorIn = el('select', { 'aria-label': 'vor welchem Element' });
    const runBtn = el('button', { class: 'btn primary' }, 'Operation ausführen');
    const resetBtn = el('button', { class: 'btn ghost' }, 'Liste zurücksetzen');
    const opRow = el('div', { class: 'viz-ctrl', style: 'border-top:0;border-bottom:1px solid var(--rule)' }, el('label', null, 'Operation', opSel), el('label', null, 'Name', nameIn), el('label', { class: 'vor' }, 'vor', vorIn), runBtn, resetBtn);
    host.insertBefore(opRow, host.children[1]);
    const nameLbl = opRow.children[1];
    const vorLbl = opRow.children[2];
    function syncCtl() {
      const op = opSel.value;
      vorLbl.style.display = op === 'EinfügenVor' ? '' : 'none';
      nameLbl.style.display = ['LängeGeben', 'AnfangEntfernen', 'EndeEntfernen', 'Entfernen'].includes(op) ? 'none' : '';
    }
    opSel.addEventListener('change', syncCtl);
    syncCtl();
    const cb = el('div');
    const stackEl = el('div', { class: 'stack' });
    const varsEl = el('div', { class: 'chips-line' });
    ui.panel.append(el('h5', null, 'Code'), cb, el('h5', null, 'Aktive Aufrufe'), stackEl);
    // model
    let model;
    let nextId = 1;
    function fresh() {
      nextId = 1;
      model = { objs: {}, root: { anfang: null, ende: null } };
      const init = cfg.init || ['Andi', 'Bert', 'Clara'];
      if (mode === 'komp') { const a = mk('Abschluss'); model.root.anfang = a; }
      init.forEach((n) => appendDirect(n));
    }
    function mk(type, data) { const id = (type === 'Abschluss' ? 'a' : type === 'Patient' ? 'p' : 'k') + (nextId++); model.objs[id] = { id, type, data: data || null, next: null }; return id; }
    function appendDirect(name) {
      if (mode === 'queue') {
        const p = mk('Patient', name);
        if (!model.root.anfang) model.root.anfang = p; else model.objs[model.root.ende].next = p;
        model.root.ende = p; return;
      }
      const d = mk('Patient', name);
      if (mode === 'komp') {
        const k = mk('Knoten', d);
        let prevId = null; let cur = model.root.anfang;
        while (model.objs[cur].type !== 'Abschluss') { prevId = cur; cur = model.objs[cur].next; }
        model.objs[k].next = cur;
        if (prevId) model.objs[prevId].next = k; else model.root.anfang = k;
        return;
      }
      const k = mk('Knoten', d);
      if (!model.root.anfang) model.root.anfang = k; else { let c = model.root.anfang; while (model.objs[c].next) c = model.objs[c].next; model.objs[c].next = k; }
      if (mode === 'qknoten') model.root.ende = k;
    }
    const clone = () => JSON.parse(JSON.stringify(model));
    const dName = (kid) => { const o = model.objs[kid]; if (!o) return '?'; if (o.type === 'Patient') return o.data; const d = model.objs[o.data]; return d ? d.data : o.data; };
    // code listings
    const CODE = {
      queue: {
        Einfügen: ['def Einfügen(self, patient_neu):', '    if self.anfang is None:', '        self.anfang = patient_neu', '    else:', '        self.ende.NachfolgerSetzen(patient_neu)', '    self.ende = patient_neu'],
        Entfernen: ['def Entfernen(self):', '    if self.anfang is None:', '        return None', '    p = self.anfang', '    self.anfang = self.anfang.NachfolgerGeben()', '    if self.anfang is None:', '        self.ende = None', '    return p'],
      },
      list: {
        VorneEinfügen: ['# Liste', 'def VorneEinfuegen(self, dneu):', '    self.anfang = Knoten(dneu, self.anfang)'],
        HintenEinfügen: ['# Liste', 'def HintenEinfuegen(self, dneu):', '    if self.anfang is not None:', '        self.anfang.HintenEinfuegen(dneu)', '    else:', '        self.anfang = Knoten(dneu)', '# Knoten', 'def HintenEinfuegen(self, dneu):', '    if self.nachfolger is not None:', '        self.nachfolger.HintenEinfuegen(dneu)', '    else:', '        self.nachfolger = Knoten(dneu)'],
        LängeGeben: ['# Liste', 'def LaengeGeben(self):', '    if self.anfang is not None:', '        return self.anfang.RestlaengeGeben()', '    return 0', '# Knoten', 'def RestlaengeGeben(self):', '    if self.nachfolger is None:', '        return 1', '    return 1 + self.nachfolger.RestlaengeGeben()'],
        AnfangEntfernen: ['# Liste', 'def AnfangEntfernen(self):', '    if self.anfang is not None:', '        d = self.anfang.DatenelementGeben()', '        self.anfang = self.anfang.NachfolgerGeben()', '        return d', '    return None'],
        EndeEntfernen: ['# Liste', 'def EndeEntfernen(self):', '    if self.anfang is not None:', '        d = self.anfang.EndeGeben()', '        self.anfang = self.anfang.EndeEntfernen()', '        return d', '# Knoten', 'def EndeEntfernen(self):', '    if self.nachfolger is None:', '        return None', '    self.nachfolger = self.nachfolger.EndeEntfernen()', '    return self'],
        EinfügenVor: ['# Liste', 'def EinfuegenVor(self, dneu, dvergleich):', '    if self.anfang is not None:', '        self.anfang = self.anfang.EinfuegenVor(dneu, dvergleich)', '# Knoten', 'def EinfuegenVor(self, dneu, dvergleich):', '    if self.daten != dvergleich:', '        if self.nachfolger is not None:', '            self.nachfolger = self.nachfolger.EinfuegenVor(dneu, dvergleich)', '        else:', '            self.HintenEinfuegen(dneu)', '        return self', '    return Knoten(dneu, self)'],
        Suchen: ['# Liste', 'def Suchen(self, schluessel):', '    if self.anfang is not None:', '        return self.anfang.Suchen(schluessel)', '    return None', '# Knoten', 'def Suchen(self, schluessel):', '    if self.daten.SchluesselIstGleich(schluessel):', '        return self.daten', '    if self.nachfolger is not None:', '        return self.nachfolger.Suchen(schluessel)', '    return None'],
      },
      komp: {
        VorneEinfügen: ['# Liste', 'def VorneEinfuegen(self, d):', '    self.anfang = Knoten(d, self.anfang)'],
        HintenEinfügen: ['# Liste', 'def HintenEinfuegen(self, d):', '    self.anfang = self.anfang.HintenEinfuegen(d)', '# Knoten', 'def HintenEinfuegen(self, d):', '    self.nachfolger = self.nachfolger.HintenEinfuegen(d)', '    return self', '# Abschluss', 'def HintenEinfuegen(self, d):', '    return Knoten(d, self)'],
        LängeGeben: ['# Liste', 'def LaengeGeben(self):', '    return self.anfang.LaengeGeben()', '# Knoten', 'def LaengeGeben(self):', '    return self.nachfolger.LaengeGeben() + 1', '# Abschluss', 'def LaengeGeben(self):', '    return 0'],
        AnfangEntfernen: ['# Liste', 'def AnfangEntfernen(self):', '    d = self.anfang.DatenelementGeben()', '    self.anfang = self.anfang.NachfolgerGeben()', '    return d', '# Abschluss: DatenelementGeben -> None,', '#            NachfolgerGeben -> self'],
        EndeEntfernen: ['# Liste', 'def EndeEntfernen(self):', '    d = self.anfang.EndeGeben(None)', '    self.anfang = self.anfang.EndeEntfernen()', '    return d', '# Knoten', 'def EndeEntfernen(self):', '    if self.nachfolger.LaengeGeben() == 0:', '        return self.nachfolger', '    self.nachfolger = self.nachfolger.EndeEntfernen()', '    return self', '# Abschluss', 'def EndeEntfernen(self):', '    return self'],
        EinfügenVor: ['# Liste', 'def EinfuegenVor(self, dNeu, dVergleich):', '    self.anfang = self.anfang.EinfuegenVor(dNeu, dVergleich)', '# Knoten', 'def EinfuegenVor(self, dNeu, dVergleich):', '    if self.daten != dVergleich:', '        self.nachfolger = self.nachfolger.EinfuegenVor(dNeu, dVergleich)', '        return self', '    return Knoten(dNeu, self)', '# Abschluss', 'def EinfuegenVor(self, dNeu, dVergleich):', '    return Knoten(dNeu, self)'],
        Suchen: ['# Liste', 'def Suchen(self, schluessel):', '    return self.anfang.Suchen(schluessel)', '# Knoten', 'def Suchen(self, schluessel):', '    if self.daten.SchluesselIstGleich(schluessel):', '        return self.daten', '    return self.nachfolger.Suchen(schluessel)', '# Abschluss', 'def Suchen(self, schluessel):', '    return None'],
      },
    };
    CODE.qknoten = {
      Einfügen: ['def Einfügen(self, dneu):', '    k = Knoten(dneu)', '    if self.anfang is None:', '        self.anfang = k', '    else:', '        self.ende.NachfolgerSetzen(k)', '    self.ende = k'],
      Entfernen: ['def Entfernen(self):', '    if self.anfang is None:', '        return None', '    k = self.anfang', '    self.anfang = self.anfang.NachfolgerGeben()', '    if self.anfang is None:', '        self.ende = None', '    return k.DatenelementGeben()'],
    };
    let steps = [];
    let stack = [];
    let vars = {};
    function rec(o) { steps.push({ m: clone(), stack: stack.slice(), vars: { ...vars }, ...o }); }
    const L = mode === 'komp';
    const isEnd = (id) => (L ? model.objs[id].type === 'Abschluss' : id == null);
    // operations as recorders
    const OPS = {
      Einfügen(name) {
        const knoten = mode === 'qknoten';
        let p;
        if (knoten) { const d = mk('Patient', name); p = mk('Knoten', d); vars = { k: p }; rec({ line: 1, hl: [p], text: `Ein neuer KNOTEN k wird erzeugt; er hält die Daten „${name}“. Sein nachfolger ist None.` }); }
        else { p = mk('Patient', name); vars = { patient_neu: p }; rec({ line: 0, hl: [p], text: `Ein neuer Patient „${name}“ kommt an. Sein nachfolger ist None.` }); }
        const L0 = knoten ? 2 : 1;
        if (!model.root.anfang) {
          rec({ line: L0, text: 'Ist die Warteschlange leer? <b>anfang is None</b> → ja. Dieser Sonderfall muss extra behandelt werden: Es gibt kein letztes Element, dessen nachfolger man setzen könnte.' });
          model.root.anfang = p;
          rec({ line: L0 + 1, refs: [['root', 'anfang']], text: 'Das neue Element ist das erste: anfang zeigt darauf.' });
        } else {
          rec({ line: L0, text: 'Ist die Warteschlange leer? Nein → das neue Element wird hinter das aktuelle letzte Element (ende) gehängt.' });
          model.objs[model.root.ende].next = p;
          rec({ line: L0 + 3, refs: [[model.root.ende, 'next']], text: `ende.NachfolgerSetzen(...): Das alte letzte Element zeigt jetzt auf das neue.` });
        }
        model.root.ende = p;
        rec({ line: L0 + 4, refs: [['root', 'ende']], text: 'In beiden Fällen: ende zeigt jetzt auf das neue Element.' });
        vars = {};
        rec({ line: -1, text: 'Fertig. Folge den Pfeilen ab anfang: Das ist die Reihenfolge, in der die Patienten aufgerufen werden.' });
      },
      Entfernen() {
        const knoten = mode === 'qknoten';
        if (!model.root.anfang) { rec({ line: 1, text: 'Die Warteschlange ist leer (anfang is None) → nichts zu entfernen; die Methode gibt None zurück. Ohne diese Prüfung würde <code>self.anfang.NachfolgerGeben()</code> mit AttributeError abstürzen.' }); return; }
        rec({ line: 1, text: 'Nicht leer, weiter.' });
        const p = model.root.anfang;
        vars = knoten ? { k: p } : { p };
        rec({ line: 3, hl: [p], text: `Das erste Element in einer lokalen Variablen (${knoten ? 'k' : 'p'}) merken, damit es nicht verloren geht.` });
        model.root.anfang = model.objs[p].next;
        rec({ line: 4, refs: [['root', 'anfang']], text: 'anfang rückt auf das zweite Element weiter (nachfolger des ersten).' });
        if (!model.root.anfang) { model.root.ende = null; rec({ line: 6, refs: [['root', 'ende']], text: 'Sonderfall: Das war das <b>letzte</b> Element. ende muss ebenfalls auf None gesetzt werden – sonst würde ende noch auf ein Element zeigen, das nicht mehr in der Warteschlange ist.' }); }
        else rec({ line: 5, text: 'Es sind noch Elemente übrig, ende bleibt, wie es ist.' });
        const name = knoten ? dName(p) : model.objs[p].data;
        delete model.objs[p];
        if (knoten) Object.keys(model.objs).forEach((id) => { if (model.objs[id].type === 'Patient' && !Object.values(model.objs).some((o) => o.data === id)) delete model.objs[id]; });
        vars = {};
        rec({ line: 7, text: `Das entfernte Element („${name}“) wird zurückgegeben. Auf sein altes Objekt zeigt keine Referenz mehr, deshalb löscht Python es automatisch.` });
      },
      VorneEinfügen(name) {
        const d = mk('Patient', name);
        vars = { d };
        rec({ line: 1, text: `VorneEinfügen wird für die Liste mit den Daten „${name}“ aufgerufen.` });
        const k = mk('Knoten', d);
        model.objs[k].next = model.root.anfang;
        rec({ line: 2, hl: [k], refs: [[k, 'next']], text: 'Ein neuer KNOTEN wird erzeugt. Sein nachfolger ist das aktuelle anfang (der alte erste Knoten – oder in einer leeren Liste der ABSCHLUSS bzw. None).' });
        model.root.anfang = k;
        vars = {};
        rec({ line: 2, refs: [['root', 'anfang']], text: 'anfang zeigt auf den neuen Knoten. Keine Rekursion nötig: Nur der Anfang ändert sich.' });
      },
      HintenEinfügen(name) {
        const d = mk('Patient', name);
        vars = { d };
        stack = ['liste.HintenEinfuegen(d)'];
        rec({ line: 1, text: `Die Liste soll „${name}“ hinten einfügen. Sie kennt nur ihren ersten Knoten, also gibt sie den Auftrag weiter.` });
        if (!L) {
          if (!model.root.anfang) { const k = mk('Knoten', d); model.root.anfang = k; rec({ line: 5, hl: [k], refs: [['root', 'anfang']], text: 'Leere Liste: Der neue Knoten wird anfang.' }); stack = []; vars = {}; rec({ line: -1, text: 'Fertig.' }); return; }
          (function go(id) {
            stack.push(`${id}.HintenEinfuegen(d)`);
            rec({ line: 7, hl: [id], text: `Knoten ${id} (${dName(id)}) erhält die Nachricht HintenEinfügen.` });
            if (model.objs[id].next) { rec({ line: 9, hl: [id], text: `${id} hat einen nachfolger → er gibt die Nachricht weiter (Rekursion).` }); go(model.objs[id].next); }
            else { const k = mk('Knoten', d); model.objs[id].next = k; rec({ line: 11, hl: [k], refs: [[id, 'next']], text: `${id} hat keinen nachfolger: Er ist der letzte Knoten. Er erzeugt den neuen Knoten und setzt ihn als seinen nachfolger.` }); }
            stack.pop();
          })(model.root.anfang);
          stack = []; vars = {};
          rec({ line: -1, text: 'Alle Aufrufe sind beendet. Der neue Knoten hängt am Ende.' });
          return;
        }
        const first = (function go(id) {
          const o = model.objs[id];
          stack.push(`${id}.HintenEinfuegen(d)`);
          if (o.type === 'Abschluss') {
            const k = mk('Knoten', d);
            model.objs[k].next = id;
            rec({ line: 9, hl: [k, id], refs: [[k, 'next']], text: `Der ABSCHLUSS ist erreicht (Rekursionsende). Er erzeugt einen neuen KNOTEN, dessen nachfolger der ABSCHLUSS selbst ist, und <b>gibt diesen neuen Knoten</b> an seinen Aufrufer <b>zurück</b>.`, ret: k });
            stack.pop();
            return k;
          }
          rec({ line: 5, hl: [id], text: `KNOTEN ${id} (${dName(id)}) gibt die Nachricht an seinen nachfolger weiter und speichert das, was zurückkommt, als neuen nachfolger.` });
          const r = go(o.next);
          model.objs[id].next = r;
          rec({ line: 5, hl: [id], refs: [[id, 'next']], text: `Zurück in ${id}: nachfolger = zurückgegebenes Element (${r}). ${r !== o.next ? 'Genau hier wird der neue Knoten eingehängt.' : 'Für diesen Knoten unverändert.'} Dann gibt ${id} sich selbst zurück.`, ret: id });
          stack.pop();
          return id;
        })(model.root.anfang);
        model.root.anfang = first;
        stack = []; vars = {};
        rec({ line: 2, refs: [['root', 'anfang']], text: 'Die Liste setzt anfang = das zurückgegebene erste Element (hier unverändert, außer die Liste war leer).' });
      },
      LängeGeben() {
        stack = ['liste.LaengeGeben()'];
        rec({ line: 1, text: 'Die Liste wird nach ihrer Länge gefragt. Sie fragt ihr erstes Element.' });
        if (!L && !model.root.anfang) { stack = []; rec({ line: 4, text: 'Leere Liste → 0.' }); return; }
        const total = (function go(id) {
          const o = model.objs[id];
          stack.push(`${id}.${L ? 'LaengeGeben' : 'RestlaengeGeben'}()`);
          if (L && o.type === 'Abschluss') { rec({ line: 8, hl: [id], text: 'ABSCHLUSS: Rekursionsende, gibt <b>0</b> zurück.', ret: '0' }); stack.pop(); return 0; }
          if (!L && !o.next) { rec({ line: 8, hl: [id], text: `${id} hat keinen nachfolger: Rekursionsende, gibt <b>1</b> zurück.`, ret: '1' }); stack.pop(); return 1; }
          rec({ line: L ? 5 : 9, hl: [id], text: `${id} fragt seinen nachfolger nach der Länge des Rests und wartet.` });
          const r = go(o.next) + 1;
          rec({ line: L ? 5 : 9, hl: [id], text: `${id} erhält ${r - 1} und gibt ${r - 1} + 1 = <b>${r}</b> zurück.`, ret: String(r) });
          stack.pop();
          return r;
        })(model.root.anfang);
        stack = [];
        rec({ line: L ? 2 : 3, text: `Die Liste gibt <b>${total}</b> zurück.` });
      },
      AnfangEntfernen() {
        stack = ['liste.AnfangEntfernen()'];
        const a = model.root.anfang;
        if (!L && !a) { stack = []; rec({ line: 6, text: 'Leere Liste: return None.' }); return; }
        const isA = L && model.objs[a].type === 'Abschluss';
        vars = { d: isA ? null : model.objs[a].data };
        rec({ line: L ? 2 : 3, hl: [a], text: isA ? 'anfang ist der ABSCHLUSS: DatenelementGeben() gibt None zurück – die Liste ist leer.' : `d = anfang.DatenelementGeben() → die Daten „${dName(a)}“ werden in der lokalen Variablen d gespeichert.` });
        if (isA) { stack = []; vars = {}; rec({ line: 3, text: 'anfang = ABSCHLUSS.NachfolgerGeben() liefert den ABSCHLUSS selbst, die leere Liste bleibt also intakt. Ergebnis: None.' }); return; }
        model.root.anfang = model.objs[a].next;
        rec({ line: L ? 3 : 4, refs: [['root', 'anfang']], text: 'anfang = anfang.NachfolgerGeben(): Die Liste beginnt jetzt beim zweiten Element.' });
        delete model.objs[a];
        stack = []; vars = {};
        rec({ line: L ? 4 : 5, text: 'Auf den alten ersten Knoten zeigt keine Referenz mehr, er verschwindet. d wird zurückgegeben.' });
      },
      EndeEntfernen() {
        stack = ['liste.EndeEntfernen()'];
        if (!L && !model.root.anfang) { stack = []; rec({ line: 6, text: 'Leere Liste: nichts zu entfernen.' }); return; }
        rec({ line: L ? 3 : 4, text: 'Die Liste holt sich zuerst das letzte Datenelement (EndeGeben) und lässt dann die Knoten den letzten Knoten entfernen.' });
        const r = (function go(id) {
          const o = model.objs[id];
          stack.push(`${id}.EndeEntfernen()`);
          if (L && o.type === 'Abschluss') { rec({ line: 13, hl: [id], text: 'ABSCHLUSS: nichts zu entfernen, gibt sich selbst zurück.', ret: id }); stack.pop(); return id; }
          const last = L ? model.objs[o.next].type === 'Abschluss' : o.next == null;
          if (last) {
            rec({ line: L ? 8 : 9, hl: [id], text: `${id} ist der letzte Knoten. Er gibt ${L ? 'seinen nachfolger (den ABSCHLUSS)' : 'None'} zurück – so überspringt ihn sein Aufrufer.`, ret: L ? o.next : 'None' });
            stack.pop();
            return L ? o.next : null;
          }
          rec({ line: L ? 9 : 10, hl: [id], text: `${id} ist nicht der letzte Knoten: Er überlässt die Arbeit seinem nachfolger und speichert das Ergebnis als neuen nachfolger.` });
          const res = go(o.next);
          const old = o.next;
          model.objs[id].next = res;
          if (old !== res) delete model.objs[old];
          rec({ line: L ? 10 : 11, hl: [id], refs: [[id, 'next']], text: `${id}.nachfolger = ${res == null ? 'None' : res}. ${old !== res ? 'Der letzte Knoten ist jetzt ausgehängt.' : ''} ${id} gibt <b>sich selbst</b> zurück (return self).`, ret: id });
          stack.pop();
          return id;
        })(model.root.anfang);
        const oldA = model.root.anfang;
        model.root.anfang = r;
        if (r !== oldA && oldA && model.objs[oldA]) delete model.objs[oldA];
        stack = [];
        rec({ line: L ? 3 : 4, refs: [['root', 'anfang']], text: 'Die Liste speichert das zurückgegebene Element als anfang (ändert sich nur, wenn die Liste genau einen Knoten hatte).' });
      },
      EinfügenVor(name, vor) {
        const dn = mk('Patient', name);
        const target = Object.values(model.objs).find((o) => o.type === 'Patient' && o.data === vor && o.id !== dn);
        const tid = target ? target.id : null;
        stack = ['liste.EinfuegenVor(dNeu, dVergleich)'];
        rec({ line: 1, text: `„${name}“ <b>vor</b> „${vor}“ einfügen. Jeder Knoten prüft, ob seine Daten die gesuchten sind.` });
        if (!L && !model.root.anfang) { const k = mk('Knoten', dn); model.root.anfang = k; stack = []; rec({ line: 2, refs: [['root', 'anfang']], text: 'Leere Liste → einfach einfügen.' }); return; }
        const r = (function go(id) {
          const o = model.objs[id];
          stack.push(`${id}.EinfuegenVor(…)`);
          if (L && o.type === 'Abschluss') { const k = mk('Knoten', dn); model.objs[k].next = id; rec({ line: 11, hl: [k], refs: [[k, 'next']], text: `„${vor}“ wurde nicht gefunden. Der ABSCHLUSS erzeugt den Knoten am Ende (gewählte Strategie) und gibt ihn zurück.`, ret: k }); stack.pop(); return k; }
          if (o.data !== tid) {
            rec({ line: L ? 5 : 6, hl: [id], text: `${id} hält „${dName(id)}“ ≠ „${vor}“ → Nachricht an den nachfolger weitergeben, Ergebnis als neuen nachfolger speichern.` });
            if (!L && !o.next) { const k = mk('Knoten', dn); model.objs[id].next = k; rec({ line: 10, hl: [k], refs: [[id, 'next']], text: 'Nicht gefunden und kein nachfolger: hinten anhängen.', ret: id }); stack.pop(); return id; }
            const res = go(o.next);
            model.objs[id].next = res;
            rec({ line: L ? 6 : 8, hl: [id], refs: [[id, 'next']], text: `${id}.nachfolger = ${res}; return self.`, ret: id });
            stack.pop();
            return id;
          }
          const k = mk('Knoten', dn);
          model.objs[k].next = id;
          rec({ line: L ? 8 : 12, hl: [k, id], refs: [[k, 'next']], text: `${id} hält „${vor}“: gefunden! Er erzeugt den neuen Knoten mit sich selbst als nachfolger und gibt den <b>neuen Knoten</b> zurück. Der Aufrufer hängt ihn ein.`, ret: k });
          stack.pop();
          return k;
        })(model.root.anfang);
        model.root.anfang = r;
        stack = [];
        rec({ line: L ? 2 : 3, refs: [['root', 'anfang']], text: 'liste.anfang = zurückgegebenes Element (ändert sich nur, wenn vor dem ersten Knoten eingefügt wurde).' });
      },
      Suchen(name) {
        stack = ['liste.Suchen(schluessel)'];
        rec({ line: 1, text: `Suche nach „${name}“.` });
        if (!L && !model.root.anfang) { stack = []; rec({ line: 4, text: 'Leere Liste → None.' }); return; }
        const r = (function go(id) {
          const o = model.objs[id];
          stack.push(`${id}.Suchen(…)`);
          if (L && o.type === 'Abschluss') { rec({ line: 10, hl: [id], text: 'ABSCHLUSS erreicht: nicht gefunden → None.', ret: 'None' }); stack.pop(); return null; }
          if (dName(id) === name) { rec({ line: L ? 6 : 8, hl: [id], text: `${id}: Daten „${dName(id)}“ passen → das Datenelement zurückgeben.`, ret: '“' + name + '”' }); stack.pop(); return id; }
          rec({ line: L ? 7 : 10, hl: [id], text: `${id}: „${dName(id)}“ passt nicht → den nachfolger fragen.` });
          if (!L && !o.next) { rec({ line: 11, hl: [id], text: 'Kein nachfolger: nicht gefunden.', ret: 'None' }); stack.pop(); return null; }
          const res = go(o.next);
          rec({ line: L ? 7 : 10, hl: [id], text: `${id} gibt das Ergebnis unverändert zurück.`, ret: res ? '“' + name + '”' : 'None' });
          stack.pop();
          return res;
        })(model.root.anfang);
        stack = [];
        rec({ line: L ? 2 : 3, text: r ? `Ergebnis: das Datenelement „${name}“.` : 'Ergebnis: None (nicht in der Liste).' });
      },
    };
    function updateVor() {
      vorIn.innerHTML = '';
      Object.values(model.objs).filter((o) => o.type === 'Patient' || (mode === 'queue' && o.type === 'Patient')).forEach((o) => vorIn.append(el('option', { value: o.data }, o.data)));
    }
    function draw(s) {
      const S = D().S; const T = D().text;
      const m = s.m;
      // order chain from anfang
      const chain = [];
      let c = m.root.anfang; const seen = new Set();
      while (c && m.objs[c] && !seen.has(c)) { seen.add(c); chain.push(c); c = m.objs[c].next; }
      const loose = Object.values(m.objs).filter((o) => o.type !== 'Patient' || mode === 'queue').map((o) => o.id).filter((id) => !seen.has(id));
      const nodes = chain.concat(loose);
      const bw = 128; const gap = 52; const x0 = 170; const y0 = 70;
      const pos = {};
      const dataMode = mode !== 'queue';
      const looseY = dataMode ? y0 + 200 : y0 + 120;
      nodes.forEach((id, i) => { const o = m.objs[id]; pos[id] = { x: x0 + i * (bw + gap), y: loose.includes(id) ? looseY : y0, h: o.type === 'Abschluss' ? 36 : 80 }; });
      const W = x0 + nodes.length * (bw + gap) + 40; const H = dataMode ? (loose.length ? 450 : 250) : (loose.length ? 260 : 180);
      const svg = D().svgRoot(Math.max(W, 420), H, 'Verkettete Struktur');
      const idp = 'lo' + Math.random().toString(36).slice(2, 7);
      const mk1 = D().arrowDefs(svg, idp + 'a', 'var(--ink)');
      const mk2 = D().arrowDefs(svg, idp + 'b', 'var(--blue)');
      const changed = new Set((s.refs || []).map(([a, f]) => a + '.' + f));
      const hl = new Set(s.hl || []);
      const arrows = S('g');
      const arrow = (x1, y1, tid, isNew, fromBelow) => {
        const t = pos[tid]; if (!t) return;
        let d;
        if (fromBelow) { const tx = t.x + bw - 26; d = `M${x1},${y1} C${x1 + 60},${y1} ${x1 + 40},${y0 - 46} ${(x1 + tx) / 2},${y0 - 46} S${tx},${y0 - 40} ${tx},${t.y - 2}`; }
        else if (t.x > x1) { const ty = t.y + 18; d = `M${x1},${y1} C${(x1 + t.x) / 2},${y1} ${(x1 + t.x) / 2},${ty} ${t.x - 2},${ty}`; }
        else if (t.y < y1) { const tx = t.x + 36; d = `M${x1},${y1} C${x1 + 40},${y1 - 10} ${tx},${t.y + t.h + 70} ${tx},${t.y + t.h + 2}`; }
        else { const tx = t.x + 36; d = `M${x1},${y1} C${x1 + 40},${y1 + 60} ${tx},${t.y - 60} ${tx},${t.y - 2}`; }
        arrows.append(S('path', { d, fill: 'none', stroke: isNew ? 'var(--blue)' : 'var(--ink)', 'stroke-width': isNew ? 2.8 : 1.5, 'marker-end': isNew ? mk2 : mk1 }));
      };
      // root object
      const rootName = mode === 'queue' || mode === 'qknoten' ? 'w: WARTESCHLANGE' : 'l: LISTE';
      const hasEnde = mode === 'queue' || mode === 'qknoten';
      const rh = hasEnde ? 76 : 52;
      svg.append(S('rect', { x: 14, y: y0, width: 140, height: rh, rx: 5, fill: 'var(--sheet)', stroke: 'var(--ink)', 'stroke-width': 1.5 }));
      svg.append(T(84, y0 + 14, rootName, { mono: true, size: 12, anchor: 'middle', weight: 700, underline: true }));
      svg.append(S('line', { x1: 14, y1: y0 + 26, x2: 154, y2: y0 + 26, stroke: 'var(--ink)' }));
      const fields = hasEnde ? ['anfang', 'ende'] : ['anfang'];
      fields.forEach((f, i) => {
        const y = y0 + 40 + i * 24;
        svg.append(T(24, y, f, { mono: true, size: 12.5 }));
        const v = m.root[f];
        const isNew = changed.has('root.' + f);
        if (v) { svg.append(S('circle', { cx: 140, cy: y, r: 4, fill: isNew ? 'var(--blue)' : 'var(--ink)' })); arrow(144, y, v, isNew, f === 'ende'); }
        else svg.append(T(144, y, 'None', { mono: true, size: 12, anchor: 'end', fill: 'var(--ink-3)' }));
      });
      nodes.forEach((id) => {
        const o = m.objs[id]; const p = pos[id];
        const isAb = o.type === 'Abschluss';
        const title = `${id}: ${o.type === 'Patient' ? 'PATIENT' : isAb ? 'ABSCHLUSS' : 'KNOTEN'}`;
        const rows = isAb ? [] : o.type === 'Patient' && mode === 'queue' ? [['name', '“' + o.data + '”'], ['nachfolger', o.next]] : [['daten', o.data], ['nachfolger', o.next]];
        const h = 28 + rows.length * 24 + (isAb ? 8 : 4);
        const isH = hl.has(id);
        svg.append(S('rect', { x: p.x, y: p.y, width: bw, height: h, rx: 5, fill: isH ? 'var(--blue-soft)' : isAb ? 'var(--green-soft)' : 'var(--sheet)', stroke: isH ? 'var(--blue)' : isAb ? 'var(--green)' : 'var(--ink)', 'stroke-width': isH ? 2.4 : 1.5, 'stroke-dasharray': loose.includes(id) ? '5 4' : null }));
        svg.append(T(p.x + bw / 2, p.y + 14, title, { mono: true, size: 12, anchor: 'middle', weight: 700, underline: true }));
        svg.append(S('line', { x1: p.x, y1: p.y + 26, x2: p.x + bw, y2: p.y + 26, stroke: 'var(--ink)' }));
        rows.forEach(([k, v], i) => {
          const y = p.y + 40 + i * 24;
          svg.append(T(p.x + 8, y, k, { mono: true, size: 12 }));
          if (k === 'name') { svg.append(T(p.x + bw - 8, y, v, { mono: true, size: 12, anchor: 'end' })); return; }
          if (k === 'daten') {
            const dd = m.objs[v];
            svg.append(S('circle', { cx: p.x + bw - 12, cy: y, r: 4, fill: 'var(--ink)' }));
            const dx = p.x + 10; const dy = p.y + 120;
            arrows.append(S('path', { d: `M${p.x + bw - 12},${y} C${p.x + bw - 12},${y + 40} ${dx + 40},${dy - 30} ${dx + 40},${dy - 2}`, fill: 'none', stroke: 'var(--ink-2)', 'stroke-width': 1.3, 'marker-end': mk1 }));
            svg.append(S('rect', { x: dx, y: dy, width: bw - 20, height: 46, rx: 5, fill: 'var(--amber-soft)', stroke: 'var(--ink-2)', 'stroke-width': 1.2 }));
            svg.append(T(dx + (bw - 20) / 2, dy + 13, ': PATIENT', { mono: true, size: 11, anchor: 'middle', underline: true }));
            svg.append(T(dx + (bw - 20) / 2, dy + 32, dd ? '“' + dd.data + '”' : '?', { mono: true, size: 12, anchor: 'middle', weight: 700 }));
            return;
          }
          const isNew = changed.has(id + '.next');
          if (v) { svg.append(S('circle', { cx: p.x + bw - 12, cy: y, r: 4, fill: isNew ? 'var(--blue)' : 'var(--ink)' })); arrow(p.x + bw - 8, y, v, isNew, false); }
          else svg.append(T(p.x + bw - 8, y, 'None', { mono: true, size: 12, anchor: 'end', fill: 'var(--ink-3)' }));
        });
        if (s.ret && s.ret === id) svg.append(T(p.x + bw / 2, p.y - 12, '↩ zurückgegeben', { hand: true, size: 19, anchor: 'middle', fill: 'var(--blue)' }));
      });
      // local variables
      Object.entries(s.vars || {}).forEach(([k, v], i) => {
        if (!v || !pos[v]) return;
        const x = pos[v].x + 10 + i * 40; const y = y0 - 40;
        svg.append(T(x, y, k, { mono: true, size: 13, weight: 700, fill: 'var(--violet)' }));
        arrows.append(S('path', { d: `M${x + 8},${y + 8} L${x + 8},${y0 - 3}`, stroke: 'var(--violet)', 'stroke-width': 1.6, 'marker-end': mk1 }));
      });
      svg.append(arrows);
      return svg;
    }
    let codeRows = [];
    function setCode(op) {
      const lines = (CODE[mode] && CODE[mode][op]) || [];
      cb.innerHTML = '';
      const box = codeBox(lines);
      cb.append(box.box);
      codeRows = box;
    }
    const st = stepper(ui.ctrl, (i) => {
      const s = steps[i];
      ui.stage.innerHTML = '';
      ui.stage.append(draw(s));
      if (codeRows.hl) codeRows.hl(s.line);
      stackEl.innerHTML = '';
      s.stack.forEach((f, k) => stackEl.append(el('div', { class: 'fr' + (k === s.stack.length - 1 ? ' top' : '') }, f)));
      if (!s.stack.length) stackEl.append(el('div', { style: 'color:var(--ink-3);font-size:13px' }, '(kein Aufruf aktiv)'));
      ui.info.innerHTML = s.text + (s.ret ? ` <span style="color:var(--blue)">↩ gibt ${esc(String(s.ret))} zurück</span>` : '');
    });
    function gc() {
      const keep = new Set();
      const mark = (id) => { if (!id || keep.has(id) || !model.objs[id]) return; keep.add(id); const o = model.objs[id]; if (o.type === 'Knoten') mark(o.data); mark(o.next); };
      mark(model.root.anfang); mark(model.root.ende);
      Object.keys(model.objs).forEach((id) => { if (!keep.has(id)) delete model.objs[id]; });
    }
    function runOp() {
      gc();
      const op = opSel.value;
      steps = []; stack = []; vars = {};
      setCode(op);
      rec({ line: -1, text: `Vor <b>${op}</b>. Drück „Weiter“, um die Operation Schritt für Schritt durchzugehen.` });
      try { OPS[op](nameIn.value.trim() || 'X', vorIn.value); } catch (e) { console.error(e); }
      st.reset(steps.length);
      gc();
      updateVor();
    }
    runBtn.addEventListener('click', runOp);
    resetBtn.addEventListener('click', () => { fresh(); updateVor(); steps = []; rec({ line: -1, text: 'Starting state.' }); st.reset(1); });
    opSel.addEventListener('change', () => { updateVor(); setCode(opSel.value); });
    fresh();
    updateVor();
    setCode(opSel.value);
    rec({ line: -1, text: 'Ausgangszustand. Wähle eine Operation, drück „Operation ausführen“ und geh sie dann Schritt für Schritt durch.' });
    st.reset(1);
    void isEnd; void varsEl;
  }

  // ------------------------------------------------------------------ Stapel (stack): ablegen/herunternehmen, Aufrufstapel, Klammerprüfung
  function stack(host, cfg) {
    const { el, esc } = U();
    const mode = cfg.mode || 'ops';
    const titles = { ops: 'Stapel: VorneEinfügen und AnfangEntfernen', vergleich: 'Stapel und Warteschlange mit denselben Daten', calls: 'Der Aufrufstapel bei LängeGeben()', brackets: 'Klammern prüfen mit einem Stapel' };
    const ui = shell(host, cfg.title || titles[mode], { side: mode === 'calls' || mode === 'brackets' });
    const box = (t, cls, sub) => el('div', { class: 'sv-box' + (cls ? ' ' + cls : '') }, t, sub ? el('small', null, sub) : null);
    function pile(items, opts = {}) {
      const p = el('div', { class: 'sv-pile' + (opts.q ? ' q' : '') });
      if (!items.length) p.append(el('div', { class: 'sv-empty' }, 'leer'));
      items.forEach((it, k) => {
        const top = opts.q ? k === 0 : k === items.length - 1;
        p.append(box(it.t, (top ? 'top' : '') + (it.cls ? ' ' + it.cls : ''), it.sub));
      });
      return p;
    }
    function chain(names, label) {
      const c = el('div', { class: 'sv-chain' });
      c.append(el('span', { class: 'o' }, label), el('span', { class: 'ar' }, '—liste→'), el('span', { class: 'o' }, ':LISTE'), el('span', { class: 'ar' }, '—anfang→'));
      names.forEach((n, k) => { c.append(el('span', { class: 'o' + (k === 0 ? ' hl' : '') }, ':KNOTEN ' + n), el('span', { class: 'ar' }, '→')); });
      c.append(el('span', { class: 'o a' }, ':ABSCHLUSS'));
      return c;
    }

    if (mode === 'ops' || mode === 'vergleich') {
      const cmp = mode === 'vergleich';
      let st = (cfg.init || ['Andi', 'Bert']).slice();
      let qu = st.slice();
      let out = [];
      let qout = [];
      let last = null;
      const nameIn = el('input', { type: 'text', value: cfg.next || 'Clara', size: '8', 'aria-label': 'Daten' });
      const bPush = el('button', { class: 'btn primary' }, cmp ? 'Einfügen' : 'VorneEinfügen (ablegen)');
      const bPop = el('button', { class: 'btn' }, cmp ? 'Entfernen' : 'AnfangEntfernen (herunternehmen)');
      const bReset = el('button', { class: 'btn ghost' }, 'Zurücksetzen');
      ui.ctrl.append(el('label', null, 'Daten', nameIn), bPush, bPop, bReset);
      const names = ['Dora', 'Emil', 'Fritz', 'Gina', 'Hanna', 'Ida', 'Jonas', 'Kim', 'Lea', 'Mia'];
      let ni = 0;
      function draw() {
        ui.stage.innerHTML = '';
        const wrap = el('div', { class: 'sv-wrap' });
        const sItems = st.map((t, k) => ({ t, cls: last && last.kind === 'push' && k === st.length - 1 ? 'new' : '' }));
        wrap.append(el('div', { class: 'sv-col' }, el('h6', null, 'Stapel (LIFO)'), el('div', { style: 'font-size:12px;color:var(--blue)' }, '↓ oben: hier wird abgelegt und heruntergenommen'), pile(sItems)));
        if (cmp) {
          const qItems = qu.map((t, k) => ({ t, cls: last && last.kind === 'push' && k === qu.length - 1 ? 'new' : '' }));
          wrap.append(el('div', { class: 'sv-col' }, el('h6', null, 'Warteschlange (FIFO)'), el('div', { style: 'font-size:12px;color:var(--blue)' }, '← vorne raus · hinten rein ←'), pile(qItems, { q: true })));
        }
        ui.stage.append(wrap);
        ui.stage.append(el('div', { style: 'margin-top:16px' }, el('div', { style: 'font-size:12px;color:var(--ink-3);text-align:center;margin-bottom:4px' }, 'So sieht der Stapel als Objekte aus: Er nutzt eine Liste (Kompositum), das oberste Element ist der erste Knoten.'), chain(st.slice().reverse(), 'stapel: STAPEL')));
        const outs = el('div', { class: 'sv-out', style: 'margin-top:12px;text-align:center' }, 'Heruntergenommen (Stapel): ', out.length ? out.join(', ') : '–');
        ui.stage.append(outs);
        if (cmp) ui.stage.append(el('div', { class: 'sv-out', style: 'text-align:center' }, 'Entfernt (Warteschlange): ', qout.length ? qout.join(', ') : '–'));
        let txt = cmp ? 'Beide Strukturen bekommen dieselben Daten in derselben Reihenfolge. Drück mehrmals <b>Entfernen</b> und vergleiche die Reihenfolgen.' : 'Leg Elemente ab und nimm sie wieder herunter. Achte darauf, welches Element jeweils herauskommt.';
        if (last && last.kind === 'push') txt = cmp ? `„${esc(last.v)}“ kommt in den Stapel nach <b>oben</b> (VorneEinfügen) und in die Warteschlange nach <b>hinten</b> (HintenEinfügen).` : `<code>stapel.VorneEinfügen(${esc(last.v)})</code>: Der Stapel ruft <code>liste.VorneEinfügen(…)</code> auf. „${esc(last.v)}“ liegt jetzt oben, alle anderen darunter.`;
        if (last && last.kind === 'pop') txt = last.v == null ? 'Der Stapel ist leer: <code>AnfangEntfernen()</code> gibt <b>nichts</b> zurück (der ABSCHLUSS liefert None).' : cmp ? `Der Stapel gibt <b>${esc(last.v)}</b> zurück (das zuletzt abgelegte Element), die Warteschlange <b>${esc(last.q)}</b> (das am längsten wartende).` : `<code>stapel.AnfangEntfernen()</code> gibt <b>${esc(last.v)}</b> zurück, das zuletzt abgelegte Element: <b>last in, first out</b>.`;
        ui.info.innerHTML = txt;
      }
      bPush.addEventListener('click', () => {
        const v = nameIn.value.trim() || names[ni % names.length];
        st.push(v); qu.push(v);
        last = { kind: 'push', v };
        nameIn.value = names[(ni++) % names.length];
        draw();
      });
      bPop.addEventListener('click', () => {
        const v = st.length ? st.pop() : null;
        const q = qu.length ? qu.shift() : null;
        if (v != null) out.push(v);
        if (q != null) qout.push(q);
        last = { kind: 'pop', v, q };
        draw();
      });
      bReset.addEventListener('click', () => { st = (cfg.init || ['Andi', 'Bert']).slice(); qu = st.slice(); out = []; qout = []; last = null; draw(); });
      draw();
      return;
    }

    // scripted modes: a list of steps, each with the current stack
    const stepsEl = el('div');
    const stackEl = el('div', { class: 'stack' });
    let steps = [];
    if (mode === 'calls') {
      const cb = codeBox(cfg.code || ['# Liste', 'def LaengeGeben(self):', '    return self.anfang.RestlaengeGeben()', '# Knoten', 'def RestlaengeGeben(self):', '    if self.nachfolger is None:', '        return 1', '    return 1 + self.nachfolger.RestlaengeGeben()']);
      ui.panel.append(el('h5', null, 'Code (Liste aus C3)'), cb.box, el('h5', null, 'Aufrufstapel'), stackEl);
      const objs = cfg.objs || ['knoten1', 'knoten2', 'knoten3'];
      const fr = [];
      const S1 = (text, line, extra) => steps.push({ frames: fr.map((f) => ({ ...f })), text, line, ...extra });
      fr.push({ t: 'liste.LängeGeben()', sub: 'objekt: liste · wartet auf anfang' });
      S1('Der Aufrufer ruft <b>liste.LängeGeben()</b> auf. Der Aufruf kommt als erster Baustein auf den Stapel: gespeichert werden das Objekt (liste), die Stelle im Programm und die lokalen Variablen.', 2, { act: -1 });
      objs.forEach((o, k) => {
        fr.push({ t: o + '.RestlängeGeben()', sub: 'objekt: ' + o + (k < objs.length - 1 ? ' · wartet auf Nachfolger' : '') });
        S1(`${k === 0 ? 'liste' : objs[k - 1]} ruft <b>${o}.RestlängeGeben()</b> auf und <i>wartet</i>. Der neue Aufruf liegt oben auf dem Stapel; nur der oberste Aufruf arbeitet, alle darunter sind inaktiv.`, k === objs.length - 1 ? 5 : 7, { act: k });
      });
      S1(`${objs[objs.length - 1]} hat keinen Nachfolger: <b>Abbruchbedingung erreicht</b>. Er gibt 1 zurück. Ab jetzt wird der Stapel abgebaut.`, 6, { act: objs.length - 1 });
      for (let k = objs.length - 1; k >= 0; k--) {
        const val = objs.length - k;
        fr.pop();
        if (k > 0) S1(`Der Aufruf von ${objs[k]} wird <b>vom Stapel geholt</b>. ${objs[k - 1]} ist wieder oben, setzt an der gespeicherten Stelle fort und rechnet 1 + ${val} = <b>${val + 1}</b>.`, 7, { act: k - 1 });
        else S1(`Der Aufruf von ${objs[0]} wird vom Stapel geholt. liste ist wieder oben und gibt das übergebene Ergebnis <b>${objs.length}</b> zurück.`, 2, { act: -1 });
      }
      fr.pop();
      S1(`Auch LängeGeben ist fertig und verschwindet vom Stapel. Der Stapel ist leer, der Aufrufer bekommt <b>${objs.length}</b>.`, -1, { act: null });
      const st = stepper(ui.ctrl, (i) => {
        const s = steps[i];
        cb.hl(s.line);
        stackEl.innerHTML = '';
        s.frames.forEach((f, k) => stackEl.append(el('div', { class: 'fr' + (k === s.frames.length - 1 ? ' top' : '') }, f.t, el('div', { style: 'font-size:11px;color:var(--ink-3)' }, f.sub))));
        if (!s.frames.length) stackEl.append(el('div', { class: 'sv-empty' }, 'leer'));
        ui.stage.innerHTML = '';
        const c = el('div', { class: 'sv-chain' });
        c.append(el('span', { class: 'o' + (s.act === -1 ? ' hl' : '') }, 'liste: LISTE'), el('span', { class: 'ar' }, '—anfang→'));
        objs.forEach((o, k) => c.append(el('span', { class: 'o' + (s.act === k ? ' hl' : '') }, o + ': KNOTEN'), el('span', { class: 'ar' }, k < objs.length - 1 ? '→' : '→ None')));
        ui.stage.append(c);
        const wrap = el('div', { class: 'sv-wrap', style: 'margin-top:18px' });
        wrap.append(el('div', { class: 'sv-col' }, el('h6', null, 'Aufrufstapel (Bauklötze)'), pile(s.frames.map((f) => ({ t: f.t, sub: f.sub })))));
        ui.stage.append(wrap);
        ui.info.innerHTML = s.text;
      });
      st.reset(steps.length);
      return;
    }

    // brackets
    const exprIn = el('input', { type: 'text', value: cfg.ausdruck || '(3 + [4 * (2 - 1)]) * {5 - 2}', size: '26', 'aria-label': 'Term' });
    const bGo = el('button', { class: 'btn primary' }, 'Prüfen');
    const row = el('div', { class: 'viz-ctrl', style: 'border-top:0;border-bottom:1px solid var(--rule)' }, el('label', null, 'Term', exprIn), bGo);
    host.insertBefore(row, host.children[1]);
    const cb = codeBox(['für jedes Zeichen z des Terms:', '  falls z öffnende Klammer dann', '    stapel.VorneEinfügen(z)', '  sonst falls z schließende Klammer dann', '    oben = stapel.AnfangEntfernen()', '    falls oben passt nicht zu z dann', '      return falsch', 'return stapel ist leer']);
    ui.panel.append(el('h5', null, 'Algorithmus'), cb.box, el('h5', null, 'Stapel'), stackEl);
    const OPEN = '([{';
    const CLOSE = ')]}';
    const st = stepper(ui.ctrl, (i) => {
      const s = steps[i];
      cb.hl(s.line);
      stackEl.innerHTML = '';
      s.stack.forEach((c, k) => stackEl.append(el('div', { class: 'fr' + (k === s.stack.length - 1 ? ' top' : '') }, c)));
      if (!s.stack.length) stackEl.append(el('div', { class: 'sv-empty' }, 'leer'));
      ui.stage.innerHTML = '';
      const ex = el('div', { class: 'sv-expr' });
      [...s.expr].forEach((c, k) => ex.append(el('span', { class: k === s.pos ? (s.bad ? 'bad' : 'cur') : k < s.pos ? 'done' : '' }, c === ' ' ? ' ' : c)));
      ui.stage.append(ex);
      const wrap = el('div', { class: 'sv-wrap' });
      wrap.append(el('div', { class: 'sv-col' }, el('h6', null, 'Stapel der offenen Klammern'), pile(s.stack.map((t) => ({ t })))));
      ui.stage.append(wrap);
      ui.info.innerHTML = s.text;
    });
    function build() {
      const expr = exprIn.value;
      steps = [];
      const stk = [];
      const push = (o) => steps.push({ expr, stack: stk.slice(), ...o });
      push({ pos: -1, line: -1, text: 'Der Stapel ist zu Beginn leer. Der Term wird Zeichen für Zeichen von links nach rechts gelesen.' });
      let okFlag = true;
      for (let k = 0; k < expr.length; k++) {
        const c = expr[k];
        if (OPEN.includes(c)) { stk.push(c); push({ pos: k, line: 2, text: `<b>${esc(c)}</b> ist eine öffnende Klammer: auf den Stapel legen. Sie wartet auf ihr Gegenstück.` }); }
        else if (CLOSE.includes(c)) {
          const want = OPEN[CLOSE.indexOf(c)];
          if (!stk.length) { push({ pos: k, line: 4, bad: true, text: `<b>${esc(c)}</b> schließt, aber der Stapel ist <b>leer</b>: Es gibt keine offene Klammer dazu. Der Term ist <b>nicht korrekt</b>.` }); okFlag = false; break; }
          const top = stk.pop();
          if (top !== want) { push({ pos: k, line: 6, bad: true, text: `<b>${esc(c)}</b> schließt, oben lag aber <b>${esc(top)}</b>. Die Klammern passen nicht zusammen: <b>nicht korrekt</b>.` }); okFlag = false; break; }
          push({ pos: k, line: 4, text: `<b>${esc(c)}</b> schließt: Die oberste Klammer <b>${esc(top)}</b> herunternehmen. Sie passt, weiter.` });
        }
      }
      if (okFlag) {
        if (stk.length) push({ pos: expr.length, line: 7, bad: true, text: `Ende des Terms, aber auf dem Stapel liegen noch <b>${esc(stk.join(' '))}</b>: Diese Klammern wurden nie geschlossen. <b>Nicht korrekt.</b>` });
        else push({ pos: expr.length, line: 7, text: 'Ende des Terms und der Stapel ist <b>leer</b>: Jede Klammer wurde in der richtigen Reihenfolge geschlossen. Der Term ist <b>korrekt geklammert</b>.' });
      }
      st.reset(steps.length);
    }
    bGo.addEventListener('click', build);
    exprIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') build(); });
    build();
  }

  // ------------------------------------------------------------------ Cheese-Champions (BWInf 17): Mäuse und Stapel
  function mice(host, cfg) {
    const { el, esc } = U();
    const ui = shell(host, cfg.title || 'Cheese-Champions: Der Seitengang ist ein Stapel', { side: true });
    const inp = el('input', { type: 'text', value: (cfg.order || [3, 2, 4, 1]).join(', '), size: '24', 'aria-label': 'Reihenfolge am Käse' });
    const go = el('button', { class: 'btn primary' }, 'Simulieren');
    const presets = select('Beispiel', [['', '…'], ['3, 2, 4, 1', '3, 2, 4, 1'], ['3, 1, 2', '3, 1, 2'], ['7, 6, 5, 4, 3, 2, 8, 9, 1', 'BWInf a'], ['1, 3, 4, 6, 7, 10, 9, 11, 12, 8, 5, 2', 'BWInf b'], ['4, 5, 3, 1, 2, 6', 'BWInf c']], '');
    const row = el('div', { class: 'viz-ctrl', style: 'border-top:0;border-bottom:1px solid var(--rule)' }, el('label', null, 'Reihenfolge am Käse', inp), go, presets.label);
    host.insertBefore(row, host.children[1]);
    const winsEl = el('div');
    const stackEl = el('div', { class: 'stack' });
    ui.panel.append(el('h5', null, 'Rechter Gang = Stapel'), stackEl, el('h5', null, 'Gewonnene Zweikämpfe'), winsEl);
    let steps = [];
    function simulate(order) {
      const n = order.length;
      const res = [];
      const waiting = Array.from({ length: n }, (_, k) => k + 1);
      const stk = [];
      const out = [];
      const wins = Array(n + 1).fill(0);
      const snap = (text, o = {}) => res.push({ waiting: waiting.slice(), stk: stk.slice(), out: out.slice(), wins: wins.slice(), text, ...o });
      const sorted = order.slice().sort((a, b) => a - b);
      if (!n || sorted.some((v, k) => v !== k + 1)) { snap('Die Reihenfolge muss jede Zahl von 1 bis n genau einmal enthalten.', { bad: true }); return res; }
      snap(`Die Mäuse 1 bis ${n} stehen im Gang, Maus 1 vorn. Am Käse sollen sie in der Reihenfolge <b>${order.join(', ')}</b> ankommen.`);
      for (const t of order) {
        for (;;) {
          const top = stk[stk.length - 1];
          if (top === t) {
            if (waiting.length) { wins[t]++; stk.pop(); out.push(t); snap(`Maus <b>${t}</b> soll als Nächstes zum Käse und ist oben im rechten Gang: Sie <b>gewinnt den Zweikampf</b> gegen Maus ${waiting[0]} und läuft durch den Abzweig zum Käse.`, { duel: [t, waiting[0]], winner: t }); }
            else { stk.pop(); out.push(t); snap(`Keine Maus kommt mehr nach: Maus <b>${t}</b> läuft ohne Zweikampf zum Käse.`); }
            break;
          }
          if (waiting.length) {
            const f = waiting.shift();
            if (stk.length) { wins[f]++; snap(`Maus ${top} (oben) darf noch nicht zum Käse, denn als Nächstes wird Maus ${t} erwartet. Also <b>gewinnt Maus ${f}</b> den Zweikampf und schiebt Maus ${top} tiefer in den Gang.`, { duel: [f, top], winner: f, pre: true }); }
            stk.push(f);
            snap(`Maus <b>${f}</b> läuft am Abzweig vorbei in den rechten Gang und liegt jetzt <b>oben</b> auf dem Stapel.`);
            continue;
          }
          snap(`Als Nächstes müsste Maus <b>${t}</b> zum Käse, aber sie steckt unter Maus ${top} im Gang, und es kommt keine Maus mehr nach. Diese Reihenfolge ist <b>unmöglich</b>.`, { bad: true });
          return res;
        }
      }
      snap(`Fertig: Alle Mäuse sind in der Reihenfolge ${order.join(', ')} am Käse. Die Tabelle zeigt, wie viele Zweikämpfe jede Maus gewonnen hat.`, { done: true });
      return res;
    }
    function draw(s) {
      const S = D().S; const T = D().text;
      const W = 660; const H = 250;
      const svg = D().svgRoot(W, H, 'Mäusegang');
      svg.append(S('rect', { x: 0, y: 70, width: W, height: H - 70, fill: 'var(--amber-soft)' }));
      svg.append(S('line', { x1: 0, y1: 70, x2: W, y2: 70, stroke: 'var(--green)', 'stroke-width': 6 }));
      const jx = 300;
      svg.append(S('path', { d: `M10,170 L${W - 20},170 L${W - 20},206 L10,206 Z`, fill: 'var(--sheet)', stroke: 'var(--ink-3)', 'stroke-width': 1.2 }));
      svg.append(S('path', { d: `M${jx - 6},170 L${jx - 120},70 L${jx - 84},70 L${jx + 30},170 Z`, fill: 'var(--sheet)', stroke: 'var(--ink-3)', 'stroke-width': 1.2 }));
      svg.append(T(jx - 102, 42, '🧀', { size: 26, anchor: 'middle' }));
      svg.append(T(40, 226, '← Mäuse kommen von links', { size: 12, fill: 'var(--ink-3)' }));
      svg.append(T(W - 24, 226, 'Ende des Gangs', { size: 12, anchor: 'end', fill: 'var(--ink-3)' }));
      svg.append(T(jx + 40, 160, 'rechter Gang (Stapel)', { size: 12, fill: 'var(--ink-3)' }));
      const mouse = (x, y, num, col) => {
        svg.append(S('circle', { cx: x, cy: y, r: 13, fill: col ? `var(--${col}-soft)` : 'var(--sheet-2)', stroke: col ? `var(--${col})` : 'var(--ink-2)', 'stroke-width': col ? 2.4 : 1.5 }));
        svg.append(T(x, y + 1, String(num), { size: 13, anchor: 'middle', weight: 700 }));
      };
      const win = s.winner;
      s.waiting.forEach((m, k) => { const x = jx - 30 - k * 30; if (x > 18) mouse(x, 188, m, s.duel && s.duel.includes(m) ? (m === win ? 'green' : 'red') : null); });
      if (s.waiting.length && jx - 30 - (s.waiting.length - 1) * 30 <= 18) svg.append(T(22, 188, '…', { size: 16 }));
      s.stk.slice().reverse().forEach((m, k) => mouse(jx + 34 + k * 30, 188, m, s.duel && s.duel.includes(m) ? (m === win ? 'green' : 'red') : k === 0 ? 'blue' : null));
      svg.append(T(jx - 50, 36, 'am Käse:', { size: 12, fill: 'var(--ink-3)' }));
      s.out.forEach((m, k) => mouse(jx + 22 + k * 30, 36, m, k === s.out.length - 1 && !s.done ? 'green' : null));
      if (s.duel) svg.append(T(jx + 8, 150, '⚔', { size: 22, anchor: 'middle', fill: 'var(--red)' }));
      ui.stage.innerHTML = '';
      ui.stage.append(svg);
      stackEl.innerHTML = '';
      s.stk.forEach((m, k) => stackEl.append(el('div', { class: 'fr' + (k === s.stk.length - 1 ? ' top' : '') }, 'Maus ' + m)));
      if (!s.stk.length) stackEl.append(el('div', { class: 'sv-empty' }, 'leer'));
      const n = s.wins.length - 1;
      const tb = el('table', { class: 'wins' });
      const r1 = el('tr', null, el('th', null, 'Maus'));
      const r2 = el('tr', null, el('th', null, 'Siege'));
      for (let m = 1; m <= n; m++) { r1.append(el('td', null, String(m))); r2.append(el('td', null, String(s.wins[m]))); }
      tb.append(r1, r2);
      winsEl.innerHTML = '';
      winsEl.append(tb);
      ui.info.innerHTML = s.text;
      ui.info.style.color = s.bad ? 'var(--red)' : '';
    }
    const st = stepper(ui.ctrl, (i) => draw(steps[i]));
    function run() {
      const order = inp.value.split(/[,\s;]+/).map((x) => x.trim()).filter(Boolean).map(Number);
      steps = simulate(order);
      st.reset(steps.length);
    }
    go.addEventListener('click', run);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') run(); });
    presets.s.addEventListener('change', () => { if (presets.s.value) { inp.value = presets.s.value; run(); } });
    run();
  }

  // ------------------------------------------------------------------ Ratespiel 1..100 (binäre Suche)
  function guess(host, cfg) {
    const { el, esc } = U();
    const max = cfg.max || 100;
    const ui = shell(host, cfg.title || `Ratespiel: eine Zahl zwischen 1 und ${max}`);
    const strat = select('Strategie', [['theo', 'Theo: 17, dann in 5er-Schritten'], ['halb', 'Halbieren: immer die Mitte']], cfg.strategy || 'theo');
    const secretIn = el('input', { type: 'number', value: String(cfg.secret || 42), min: '1', max: String(max), style: 'width:5em', 'aria-label': 'Geheime Zahl' });
    const go = el('button', { class: 'btn primary' }, 'Raten lassen');
    const all = el('button', { class: 'btn ghost' }, `Alle Zahlen 1–${max} testen`);
    const row = el('div', { class: 'viz-ctrl', style: 'border-top:0;border-bottom:1px solid var(--rule)' }, strat.label, el('label', null, 'Aylins Zahl', secretIn), go, all);
    host.insertBefore(row, host.children[1]);
    const LIMIT = cfg.limit || 7;
    function play(secret, s) {
      const tries = [];
      let lo = 1; let hi = max;
      let g = s === 'theo' ? 17 : Math.floor((lo + hi) / 2);
      for (let k = 0; k < 40; k++) {
        const fb = g === secret ? 'getroffen' : g > secret ? 'zu groß' : 'zu klein';
        tries.push({ g, fb, lo, hi });
        if (fb === 'getroffen') break;
        if (fb === 'zu groß') hi = Math.min(hi, g - 1); else lo = Math.max(lo, g + 1);
        if (s === 'theo') g = fb === 'zu groß' ? g - 5 : g + 5;
        else g = Math.floor((lo + hi) / 2);
      }
      return tries;
    }
    let tries = [];
    function draw(i) {
      const S = D().S; const T = D().text;
      const W = 660; const H = 120;
      const svg = D().svgRoot(W, H, 'Zahlenstrahl');
      const x = (v) => 20 + ((v - 1) / (max - 1)) * (W - 40);
      const t = tries[i];
      const lo = i + 1 < tries.length ? tries[i + 1].lo : t.lo;
      const hi = i + 1 < tries.length ? tries[i + 1].hi : t.hi;
      svg.append(S('line', { x1: x(1), y1: 60, x2: x(max), y2: 60, stroke: 'var(--ink-3)', 'stroke-width': 2 }));
      if (t.fb !== 'getroffen') svg.append(S('rect', { x: x(lo) - 3, y: 50, width: Math.max(6, x(hi) - x(lo) + 6), height: 20, rx: 4, fill: 'var(--blue-soft)', stroke: 'var(--blue)' }));
      for (let v = 1; v <= max; v += max >= 50 ? 10 : 1) svg.append(T(x(v), 88, String(v), { size: 11, anchor: 'middle', fill: 'var(--ink-3)' }));
      svg.append(T(x(max), 88, String(max), { size: 11, anchor: 'middle', fill: 'var(--ink-3)' }));
      tries.slice(0, i + 1).forEach((tr, k) => {
        const cur = k === i;
        svg.append(S('line', { x1: x(tr.g), y1: 30, x2: x(tr.g), y2: 58, stroke: cur ? (tr.fb === 'getroffen' ? 'var(--green)' : 'var(--red)') : 'var(--ink-3)', 'stroke-width': cur ? 2.5 : 1 }));
        if (cur) svg.append(T(x(tr.g), 20, `${tr.g}: ${tr.fb}`, { size: 13, anchor: 'middle', weight: 700, fill: tr.fb === 'getroffen' ? 'var(--green)' : 'var(--red)' }));
      });
      const secret = +secretIn.value;
      svg.append(T(x(secret), 108, '▲ ' + secret, { size: 12, anchor: 'middle', fill: 'var(--green)', weight: 700 }));
      ui.stage.innerHTML = '';
      ui.stage.append(svg);
      ui.stage.append(el('div', { class: 'chips-line', style: 'justify-content:center;margin-top:6px' }, tries.slice(0, i + 1).map((tr, k) => el('span', { class: k === i ? 'hl' : '' }, `${k + 1}. ${tr.g} (${tr.fb})`))));
      const n = i + 1;
      let msg = `Versuch ${n}: Theo rät <b>${t.g}</b>, Aylin sagt <b>${t.fb}</b>.`;
      if (t.fb !== 'getroffen') msg += ` Möglich sind noch die Zahlen <b>${lo} bis ${hi}</b> (${Math.max(0, hi - lo + 1)} Stück).`;
      else msg += n <= LIMIT ? ` Geschafft mit ${n} von ${LIMIT} Versuchen.` : ` Getroffen, aber erst mit ${n} Versuchen: Er hatte nur ${LIMIT}.`;
      if (n === LIMIT && t.fb !== 'getroffen') msg += ` <b style="color:var(--red)">Das war der letzte erlaubte Versuch.</b>`;
      ui.info.innerHTML = msg;
    }
    const st = stepper(ui.ctrl, draw);
    function run() {
      let v = Math.round(+secretIn.value);
      if (!(v >= 1 && v <= max)) { v = 42; secretIn.value = '42'; }
      tries = play(v, strat.s.value);
      st.reset(tries.length);
    }
    go.addEventListener('click', run);
    strat.s.addEventListener('change', run);
    all.addEventListener('click', () => {
      const res = {};
      ['theo', 'halb'].forEach((s) => {
        let okc = 0; let worst = 0;
        for (let v = 1; v <= max; v++) { const tr = play(v, s); const n = tr[tr.length - 1].fb === 'getroffen' ? tr.length : 99; if (n <= LIMIT) okc++; worst = Math.max(worst, n); }
        res[s] = { okc, worst };
      });
      ui.info.innerHTML = `<b>Theos Strategie</b> findet nur ${res.theo.okc} von ${max} Zahlen in höchstens ${LIMIT} Versuchen (viele Zahlen trifft sie nie, weil sie nur Zahlen der Form 5·k + 2 rät). <b>Halbieren</b> findet alle ${res.halb.okc} Zahlen, im schlechtesten Fall mit <b>${res.halb.worst}</b> Versuchen: Jeder Versuch halbiert die Menge der möglichen Zahlen, und 2<sup>7</sup> − 1 = 127 ≥ ${max}.`;
    });
    run();
  }

  // ------------------------------------------------------------------ geordneter Binärbaum: Einfügen, Suchen, Durchlaufen, Kompositum
  const BST_PRESETS = {
    beispiel: { label: 'Beispielbaum (64 …)', vals: [64, 57, 0, 30, 96, 85, 82, 69, 84, 95] },
    entstehung: { label: 'Entstehung (5781 …)', vals: [5781, 4221, 6345, 5799] },
    netz: { label: 'Netzwerkgeräte', vals: ['N202', 'R273', 'N304', 'P114', 'N111', 'R212', 'N264'] },
    abi18: { label: 'Abi18Net', vals: [3257, 66013, 116, 5485, 2485, 833271, 73680] },
    woerter: { label: 'Wörterbuch (clip …)', vals: ['clip', 'cat', 'cup', 'cut', 'cube', 'cave', 'crab'] },
    test: { label: 'Testbaum (clip, car, crab, coin)', vals: ['clip', 'car', 'crab', 'coin'] },
    sortiert: { label: 'sortiert eingefügt 1–7', vals: [1, 2, 3, 4, 5, 6, 7] },
    h13: { label: 'habit … hull (13 Wörter)', vals: ['habit', 'hag', 'hall', 'heap', 'heart', 'heat', 'hero', 'hike', 'hint', 'hole', 'hope', 'hub', 'hull'] },
    leer: { label: 'leerer Baum', vals: [] },
  };
  function cmpV(a, b) {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    a = String(a); b = String(b);
    return a < b ? -1 : a > b ? 1 : 0;
  }
  function parseVal(s) { s = String(s).trim(); return /^-?\d+(\.\d+)?$/.test(s) ? +s : s; }
  function bst(host, cfg) {
    const { el, esc } = U();
    const komp = cfg.mode === 'komp';
    const ui = shell(host, cfg.title || (komp ? 'Binärbaum als Kompositum: Nachrichten durch den Baum' : 'Geordneter Binärbaum: Einfügen, Suchen, Durchlaufen'), { side: true });
    // controls
    const preset = select('Baum', Object.entries(BST_PRESETS).map(([k, p]) => [k, p.label]), cfg.preset || 'beispiel');
    const valIn = el('input', { type: 'text', value: cfg.value != null ? String(cfg.value) : '70', size: '7', 'aria-label': 'Wert' });
    const bIns = el('button', { class: 'btn primary' }, 'Einfügen');
    const bSearch = el('button', { class: 'btn' }, 'Suchen');
    const trav = select('', [['in', 'Inorder'], ['pre', 'Preorder'], ['post', 'Postorder']], 'in');
    const bTrav = el('button', { class: 'btn' }, 'ausgeben');
    const bHeight = el('button', { class: 'btn' }, 'HöheGeben');
    const bBal = el('button', { class: 'btn ghost', title: 'Alle Werte sortiert nehmen und den Baum mit der Mitte als Wurzel neu aufbauen' }, 'Ausgeglichen neu aufbauen');
    const absBox = el('input', { type: 'checkbox' });
    if (komp || cfg.abschluss) absBox.checked = true;
    const row1 = el('div', { class: 'viz-ctrl', style: 'border-top:0' }, preset.label, el('label', null, 'Wert', valIn), bIns, bSearch, el('label', null, trav.s, bTrav));
    const row2 = el('div', { class: 'viz-ctrl', style: 'border-top:0;border-bottom:1px solid var(--rule);padding-top:0' }, bHeight, bBal, el('label', null, absBox, 'ABSCHLUSS zeigen'));
    if (!komp && !cfg.height) bHeight.style.display = 'none';
    host.insertBefore(row2, host.children[1]);
    host.insertBefore(row1, host.children[1]);
    const codeEl = el('div');
    const framesEl = el('div', { class: 'stack' });
    const outEl = el('div', { class: 'chips-line' });
    const statsEl = el('div', { class: 'kv' });
    ui.panel.append(el('h5', null, komp ? 'Code (Kompositum, verkürzt)' : 'Algorithmus'), codeEl);
    if (komp) ui.panel.append(el('h5', null, 'Aktive Aufrufe'), framesEl);
    ui.panel.append(el('h5', null, 'Ausgabe'), outEl, el('h5', null, 'Kennzahlen'), statsEl);
    // model
    let uidN = 1;
    let tree = null;
    const node = (v) => ({ v, l: null, r: null, id: uidN++ });
    const clone = (t) => (t ? { v: t.v, id: t.id, l: clone(t.l), r: clone(t.r) } : null);
    function insertDirect(v) {
      if (!tree) { tree = node(v); return; }
      let c = tree;
      for (;;) {
        const d = cmpV(v, c.v);
        if (d === 0) return;
        const side = d < 0 ? 'l' : 'r';
        if (!c[side]) { c[side] = node(v); return; }
        c = c[side];
      }
    }
    function load(key) {
      tree = null;
      (BST_PRESETS[key] || BST_PRESETS.beispiel).vals.forEach(insertDirect);
    }
    // code listings
    const CODE = {
      logicIns: ['Einfügen(neu) beginnend bei der Wurzel:', '  falls Teilbaum leer dann', '    neuer Knoten mit neu kommt hierher', '  sonst falls neu < Wert dann', '    im linken Teilbaum einfügen', '  sonst falls neu > Wert dann', '    im rechten Teilbaum einfügen', '  sonst: schon vorhanden'],
      logicSearch: ['Suchen(s) beginnend bei der Wurzel:', '  falls Teilbaum leer dann', '    return nichts (nicht gefunden)', '  falls s == Wert dann', '    return Daten (gefunden)', '  falls s < Wert dann', '    im linken Teilbaum suchen', '  sonst im rechten Teilbaum suchen'],
      kompIns: ['# BinBaum', 'def Einfuegen(self, d):', '    self.wurzel = self.wurzel.Einfuegen(d)', '# Knoten', 'def Einfuegen(self, d):', '    if gleicher Schlüssel: return self', '    if self.daten > d:', '        self.linkerNachfolger = self.linkerNachfolger.Einfuegen(d)', '    else:', '        self.rechterNachfolger = self.rechterNachfolger.Einfuegen(d)', '    return self', '# Abschluss', 'def Einfuegen(self, d):', '    return Knoten(d, Abschluss(), Abschluss())'],
      kompSearch: ['# BinBaum', 'def Suchen(self, s):', '    return self.wurzel.Suchen(s)', '# Knoten', 'def Suchen(self, s):', '    if self.daten == s: return self.daten', '    if self.daten > s:', '        return self.linkerNachfolger.Suchen(s)', '    return self.rechterNachfolger.Suchen(s)', '# Abschluss', 'def Suchen(self, s):', '    return None'],
      kompHeight: ['# BinBaum', 'def HoeheGeben(self):', '    return self.wurzel.HoeheGeben()', '# Knoten', 'def HoeheGeben(self):', '    h1 = self.linkerNachfolger.HoeheGeben()', '    h2 = self.rechterNachfolger.HoeheGeben()', '    return 1 + max(h1, h2)', '# Abschluss', 'def HoeheGeben(self):', '    return -1'],
      trav: {
        in: ['# Knoten', 'def InorderAusgeben(self):', '    self.linkerNachfolger.InorderAusgeben()', '    print(self.daten)', '    self.rechterNachfolger.InorderAusgeben()', '# Abschluss', 'def InorderAusgeben(self):', '    pass'],
        pre: ['# Knoten', 'def PreorderAusgeben(self):', '    print(self.daten)', '    self.linkerNachfolger.PreorderAusgeben()', '    self.rechterNachfolger.PreorderAusgeben()', '# Abschluss', 'def PreorderAusgeben(self):', '    pass'],
        post: ['# Knoten', 'def PostorderAusgeben(self):', '    self.linkerNachfolger.PostorderAusgeben()', '    self.rechterNachfolger.PostorderAusgeben()', '    print(self.daten)', '# Abschluss', 'def PostorderAusgeben(self):', '    pass'],
      },
      bal: ['Aufbauen(sortierte Teilliste):', '  falls Teilliste leer dann', '    return leerer Teilbaum', '  m = mittleres Element (Index n // 2)', '  Knoten mit m wird Wurzel', '  linker Teilbaum = Aufbauen(Elemente vor m)', '  rechter Teilbaum = Aufbauen(Elemente nach m)'],
    };
    let cb = codeBox(komp ? CODE.kompIns : CODE.logicIns);
    codeEl.append(cb.box);
    function setCode(lines) { codeEl.innerHTML = ''; cb = codeBox(lines); codeEl.append(cb.box); }
    // steps
    let steps = [];
    let frames = [];
    let out = [];
    function rec(o) { steps.push({ tree: clone(tree), frames: frames.slice(), out: out.slice(), ...o }); }
    const lbl = (v) => (typeof v === 'number' ? String(v) : '„' + v + '“');
    function opInsert(v) {
      steps = []; frames = []; out = [];
      if (!komp) {
        setCode(CODE.logicIns);
        if (!tree) { rec({ line: 1, text: `Der Baum ist leer. ${lbl(v)} wird die <b>Wurzel</b>.`, abs: 'root' }); tree = node(v); rec({ line: 2, text: `Neuer Knoten ${lbl(v)} ist die Wurzel.`, hl: { [tree.id]: 'green' } }); return; }
        let c = tree; const path = [];
        let n = 0;
        for (;;) {
          path.push(c.id); n++;
          const d = cmpV(v, c.v);
          if (d === 0) { rec({ line: 7, path: path.slice(), hl: { [c.id]: 'amber' }, text: `Vergleich ${n}: ${lbl(v)} = ${lbl(c.v)}. Der Schlüssel ist <b>schon vorhanden</b>, es wird nichts eingefügt.` }); return; }
          const side = d < 0 ? 'l' : 'r';
          rec({ line: d < 0 ? 4 : 6, path: path.slice(), hl: { [c.id]: 'amber' }, text: `Vergleich ${n}: ${lbl(v)} ${d < 0 ? '<' : '>'} ${lbl(c.v)}, also weiter im <b>${d < 0 ? 'linken' : 'rechten'}</b> Teilbaum von ${lbl(c.v)}.` });
          if (!c[side]) {
            rec({ line: 1, path: path.slice(), abs: [c.id, side], text: `Der ${d < 0 ? 'linke' : 'rechte'} Teilbaum von ${lbl(c.v)} ist <b>leer</b> (dort steht nur ein Abschluss).` });
            c[side] = node(v);
            rec({ line: 2, path: path.slice(), hl: { [c[side].id]: 'green' }, text: `Der neue Knoten ${lbl(v)} wird als <b>${d < 0 ? 'linker' : 'rechter'} Nachfolger</b> von ${lbl(c.v)} eingehängt. ${n} Vergleich${n > 1 ? 'e' : ''}, und der Baum ist weiterhin geordnet.` });
            return;
          }
          c = c[side];
        }
      }
      // Kompositum: messages
      setCode(CODE.kompIns);
      frames.push('binBaum.Einfuegen(' + v + ')');
      rec({ line: 2, text: `Der Baum leitet die Nachricht an seine Wurzel weiter: <code>self.wurzel = self.wurzel.Einfuegen(${esc(String(v))})</code>. Was zurückkommt, wird die (neue) Wurzel.`, cur: tree ? tree.id : null, abs: tree ? null : 'root' });
      const result = (function ins(t, parentTxt) {
        if (!t) {
          frames.push('Abschluss.Einfuegen(' + v + ')');
          rec({ line: 13, abs: parentTxt, text: `Die Nachricht kommt bei einem <b>Abschluss</b> an: Rekursionsende. Er erzeugt einen neuen Knoten ${lbl(v)} mit zwei neuen Abschluss-Objekten und gibt ihn zurück.` });
          frames.pop();
          return { created: node(v) };
        }
        frames.push('Knoten ' + t.v + '.Einfuegen(' + v + ')');
        const d = cmpV(v, t.v);
        if (d === 0) { rec({ line: 5, cur: t.id, text: `Knoten ${lbl(t.v)} hat denselben Schlüssel: nichts einfügen, <code>return self</code>.` }); frames.pop(); return { same: true }; }
        const side = d < 0 ? 'l' : 'r';
        rec({ line: d < 0 ? 7 : 9, cur: t.id, text: `Knoten ${lbl(t.v)} vergleicht: ${lbl(v)} ${d < 0 ? '<' : '>'} ${lbl(t.v)}. Er schickt die Nachricht an seinen <b>${d < 0 ? 'linken' : 'rechten'} Nachfolger</b> und wartet auf dessen Antwort.` });
        const r = ins(t[side], [t.id, side]);
        if (r.created) {
          t[side] = r.created;
          rec({ line: d < 0 ? 7 : 9, cur: t.id, hl: { [r.created.id]: 'green' }, text: `Zurück bei ${lbl(t.v)}: Die Antwort ist der neue Knoten. <code>self.${d < 0 ? 'linkerNachfolger' : 'rechterNachfolger'} = …</code> hängt ihn ein, der alte Abschluss fällt weg.` });
        } else {
          rec({ line: d < 0 ? 7 : 9, cur: t.id, text: `Zurück bei ${lbl(t.v)}: Die Antwort ist sein bisheriger Nachfolger (er hat sich selbst zurückgegeben). Die Zuweisung ändert nichts.` });
        }
        rec({ line: 10, cur: t.id, text: `Knoten ${lbl(t.v)} gibt <b>sich selbst</b> zurück (<code>return self</code>).` });
        frames.pop();
        return { self: true };
      })(tree, 'root');
      if (result.created) tree = result.created;
      rec({ line: 2, hl: result.created ? { [tree.id]: 'green' } : {}, text: result.created ? 'Der Baum war leer: Die Antwort ist der neue Knoten, er wird die Wurzel.' : 'Zurück im Baum: Die Wurzel hat sich selbst zurückgegeben, <code>self.wurzel</code> bleibt gleich. Fertig.' });
      frames.pop();
    }
    function opSearch(v) {
      steps = []; frames = []; out = [];
      if (!komp) {
        setCode(CODE.logicSearch);
        let c = tree; const path = []; let n = 0;
        for (;;) {
          if (!c) { rec({ line: 2, path: path.slice(), text: `Leerer Teilbaum erreicht: ${lbl(v)} ist <b>nicht im Baum</b>. Dafür waren ${n} Vergleich${n === 1 ? '' : 'e'} nötig.` }); return; }
          path.push(c.id); n++;
          const d = cmpV(v, c.v);
          if (d === 0) { rec({ line: 4, path: path.slice(), hl: { [c.id]: 'green' }, text: `Vergleich ${n}: ${lbl(v)} = ${lbl(c.v)}: <b>gefunden</b> mit ${n} Vergleich${n === 1 ? '' : 'en'}.` }); return; }
          rec({ line: d < 0 ? 6 : 7, path: path.slice(), hl: { [c.id]: 'amber' }, text: `Vergleich ${n}: ${lbl(v)} ${d < 0 ? '<' : '>'} ${lbl(c.v)}, also nur noch im <b>${d < 0 ? 'linken' : 'rechten'}</b> Teilbaum suchen. Der andere Teilbaum fällt ganz weg.` });
          c = d < 0 ? c.l : c.r;
        }
      }
      setCode(CODE.kompSearch);
      frames.push('binBaum.Suchen(' + v + ')');
      rec({ line: 2, text: `Der Baum leitet die Suche an die Wurzel weiter und gibt deren Antwort zurück.`, cur: tree ? tree.id : null });
      const res = (function se(t, parent) {
        if (!t) { frames.push('Abschluss.Suchen(' + v + ')'); rec({ line: 11, abs: parent, text: 'Die Suche erreicht einen <b>Abschluss</b>: Der Schlüssel kommt nicht vor. Er gibt <code>None</code> zurück.' }); frames.pop(); return null; }
        frames.push('Knoten ' + t.v + '.Suchen(' + v + ')');
        const d = cmpV(v, t.v);
        if (d === 0) { rec({ line: 5, cur: t.id, hl: { [t.id]: 'green' }, text: `Knoten ${lbl(t.v)} hat den gesuchten Schlüssel und gibt seine <b>Daten</b> zurück.` }); frames.pop(); return t.v; }
        rec({ line: d < 0 ? 7 : 8, cur: t.id, text: `Knoten ${lbl(t.v)}: ${lbl(v)} ${d < 0 ? '<' : '>'} ${lbl(t.v)}, er fragt seinen ${d < 0 ? 'linken' : 'rechten'} Nachfolger und gibt dessen Antwort <b>unverändert</b> weiter.` });
        const r = se(d < 0 ? t.l : t.r, [t.id, d < 0 ? 'l' : 'r']);
        rec({ line: d < 0 ? 7 : 8, cur: t.id, text: `Knoten ${lbl(t.v)} reicht die Antwort (${r == null ? 'None' : lbl(r)}) nach oben weiter.` });
        frames.pop();
        return r;
      })(tree, 'root');
      frames.pop();
      rec({ line: 2, text: res == null ? `Ergebnis: <b>None</b>, ${lbl(v)} ist nicht im Baum.` : `Ergebnis: die Daten von ${lbl(res)}.` });
    }
    function opTrav(kind) {
      steps = []; frames = []; out = [];
      setCode(CODE.trav[kind]);
      const nameK = { in: 'Inorder', pre: 'Preorder', post: 'Postorder' }[kind];
      const lines = { in: [2, 3, 4], pre: [3, 2, 4], post: [2, 3, 4] }[kind];
      rec({ line: 1, text: `${nameK}-Durchlauf: Jeder Knoten ${kind === 'in' ? 'gibt zuerst seinen linken Teilbaum aus, dann sich selbst, dann den rechten' : kind === 'pre' ? 'gibt zuerst sich selbst aus, dann den linken, dann den rechten Teilbaum' : 'gibt zuerst den linken, dann den rechten Teilbaum aus und zuletzt sich selbst'}.` });
      (function walk(t) {
        if (!t) return;
        frames.push('Knoten ' + t.v);
        const visit = () => { out.push(t.v); rec({ line: kind === 'pre' ? 2 : kind === 'in' ? 3 : 4, cur: t.id, hl: { [t.id]: 'green' }, text: `Knoten ${lbl(t.v)} gibt sich aus. Ausgabe bisher: ${out.map(String).join(', ')}` }); };
        if (kind === 'pre') visit();
        rec({ line: lines[0], cur: t.id, text: `Knoten ${lbl(t.v)} schickt die Nachricht an seinen <b>linken</b> Nachfolger${t.l ? '' : ' (ein Abschluss: Er tut nichts)'}.` });
        walk(t.l);
        if (kind === 'in') visit();
        rec({ line: kind === 'post' ? 3 : 4, cur: t.id, text: `Knoten ${lbl(t.v)} schickt die Nachricht an seinen <b>rechten</b> Nachfolger${t.r ? '' : ' (ein Abschluss: Er tut nichts)'}.` });
        walk(t.r);
        if (kind === 'post') visit();
        frames.pop();
      })(tree);
      rec({ line: -1, text: `Fertig. ${nameK}: <b>${out.map(String).join(', ') || '(leer)'}</b>${kind === 'in' ? '. Beim geordneten Binärbaum ist das genau die <b>sortierte</b> Reihenfolge.' : '.'}` });
    }
    function opHeight() {
      steps = []; frames = []; out = [];
      setCode(CODE.kompHeight);
      const ann = {};
      frames.push('binBaum.HoeheGeben()');
      rec({ line: 2, text: 'Höhe = größte Tiefe eines Knotens (Anzahl der Kanten von der Wurzel bis zum tiefsten Knoten). Der Baum fragt die Wurzel.', ann: { ...ann } });
      const h = (function hg(t, parent) {
        if (!t) { frames.push('Abschluss.HoeheGeben()'); rec({ line: 10, abs: parent, text: 'Ein <b>Abschluss</b> gibt <b>−1</b> zurück: Ein leerer Teilbaum ist um eins niedriger als ein einzelner Knoten (Höhe 0).', ann: { ...ann } }); frames.pop(); return -1; }
        frames.push('Knoten ' + t.v + '.HoeheGeben()');
        rec({ line: 5, cur: t.id, text: `Knoten ${lbl(t.v)} fragt zuerst seinen linken Nachfolger nach dessen Höhe.`, ann: { ...ann } });
        const a = hg(t.l, [t.id, 'l']);
        rec({ line: 6, cur: t.id, text: `Links kam ${a} zurück. Jetzt fragt ${lbl(t.v)} den rechten Nachfolger.`, ann: { ...ann } });
        const b = hg(t.r, [t.id, 'r']);
        ann[t.id] = 1 + Math.max(a, b);
        rec({ line: 7, cur: t.id, hl: { [t.id]: 'green' }, text: `Knoten ${lbl(t.v)}: 1 + max(${a}, ${b}) = <b>${ann[t.id]}</b>.`, ann: { ...ann } });
        frames.pop();
        return ann[t.id];
      })(tree, 'root');
      frames.pop();
      rec({ line: 2, text: `Die Höhe des Baums ist <b>${h}</b>${h >= 0 ? `, er hat also ${h + 1} Ebene${h ? 'n' : ''}` : ' (leerer Baum)'}.`, ann: { ...ann } });
    }
    function opBalance() {
      steps = []; frames = []; out = [];
      setCode(CODE.bal);
      const vals = [];
      (function io(t) { if (!t) return; io(t.l); vals.push(t.v); io(t.r); })(tree);
      tree = null;
      rec({ line: 0, text: `Die Werte werden sortiert genommen: ${vals.map(String).join(', ') || '(keine)'}. Daraus entsteht ein Baum mit möglichst wenigen Ebenen.` });
      function build(lo, hi, attach) {
        if (lo > hi) return;
        const m = lo + Math.floor((hi - lo + 1) / 2);
        const n = node(vals[m]);
        attach(n);
        rec({ line: 4, hl: { [n.id]: 'green' }, text: `Teilliste [${vals.slice(lo, hi + 1).map(String).join(', ')}]: Das mittlere Element <b>${lbl(vals[m])}</b> wird hier Knoten. Links davon kommen die kleineren, rechts die größeren Elemente.` });
        build(lo, m - 1, (k) => { n.l = k; });
        build(m + 1, hi, (k) => { n.r = k; });
      }
      build(0, vals.length - 1, (k) => { tree = k; });
      rec({ line: -1, text: 'Fertig: ein ausgeglichener Baum. Jede Suche braucht höchstens so viele Vergleiche, wie der Baum Ebenen hat.' });
    }
    // drawing
    function stats(t) {
      let n = 0; let leaves = 0;
      const h = (function hh(x) { if (!x) return -1; n++; if (!x.l && !x.r) leaves++; return 1 + Math.max(hh(x.l), hh(x.r)); })(t);
      const bal = (function bb(x) { if (!x) return -1; const a = bb(x.l); const b = bb(x.r); if (a === null || b === null || Math.abs(a - b) > 1) return null; return 1 + Math.max(a, b); })(t) !== null;
      let degen = true;
      (function dg(x) { if (!x) return; if (x.l && x.r) degen = false; dg(x.l); dg(x.r); })(t);
      const full = n === 2 ** (h + 1) - 1;
      const minLevels = n ? Math.ceil(Math.log2(n + 1)) : 0;
      return { n, h, leaves, inner: n - leaves, bal, degen: degen && n >= 3, full: full && n > 0, minLevels };
    }
    function drawTree(s) {
      const S = D().S; const T = D().text; const tw = D().tw;
      const showA = absBox.checked;
      const items = [];
      let cursor = 0;
      const gap = 12;
      const absHl = s.abs;
      (function lay(t, d, parentId, side) {
        if (!t) {
          if (!showA && !(absHl && ((absHl === 'root' && parentId == null) || (Array.isArray(absHl) && absHl[0] === parentId && absHl[1] === side)))) return null;
          const it = { a: true, d, parentId, side, w: 22, h: 18 };
          it.x = cursor + 11; cursor += 22 + gap; items.push(it); return it;
        }
        const w = Math.max(38, tw(String(t.v), 14, 'body', 700) + 20);
        const it = { t, d, parentId, side, w, h: 30 };
        lay(t.l, d + 1, t.id, 'l');
        it.x = cursor + w / 2; cursor += w + gap;
        lay(t.r, d + 1, t.id, 'r');
        items.push(it);
        return it;
      })(s.tree, 0, null, null);
      ui.stage.innerHTML = '';
      if (!items.length) { ui.stage.append(el('div', { class: 'sv-empty', style: 'padding:30px' }, 'Der Baum ist leer.')); return; }
      const LH = 64;
      const maxD = Math.max(...items.map((i) => i.d));
      const W = cursor + 30;
      const H = 30 + maxD * LH + 50;
      const svg = D().svgRoot(Math.max(W, 200), H, 'Binärbaum');
      const mk = D().arrowDefs(svg, 'bs' + Math.random().toString(36).slice(2, 7), 'var(--ink-2)');
      const mkB = D().arrowDefs(svg, 'bb' + Math.random().toString(36).slice(2, 7), 'var(--blue)');
      const byId = {};
      items.forEach((i) => { if (i.t) byId[i.t.id] = i; });
      const path = new Set(s.path || []);
      const X = (i) => i.x + 15;
      const Y = (i) => 20 + i.d * LH;
      items.forEach((i) => {
        if (i.parentId == null) return;
        const p = byId[i.parentId];
        if (!p) return;
        const onP = i.t ? path.has(i.t.id) && path.has(p.t.id) : false;
        svg.append(S('line', { x1: X(p), y1: Y(p) + p.h, x2: X(i), y2: Y(i) - 2, stroke: onP ? 'var(--blue)' : 'var(--ink-2)', 'stroke-width': onP ? 2.6 : 1.4, 'marker-end': onP ? mkB : mk, 'stroke-dasharray': i.a ? '3 3' : null }));
      });
      items.forEach((i) => {
        const x = X(i) - i.w / 2; const y = Y(i);
        if (i.a) {
          const hot = absHl && ((absHl === 'root' && i.parentId == null) || (Array.isArray(absHl) && absHl[0] === i.parentId && absHl[1] === i.side));
          svg.append(S('rect', { x, y, width: i.w, height: i.h, rx: 3, fill: hot ? 'var(--amber-soft)' : 'var(--sheet-2)', stroke: hot ? 'var(--amber)' : 'var(--ink-3)', 'stroke-width': hot ? 2.2 : 1.1 }));
          svg.append(S('line', { x1: x + 5, y1: y + i.h / 2, x2: x + i.w - 5, y2: y + i.h / 2, stroke: hot ? 'var(--amber)' : 'var(--ink-3)', 'stroke-width': 1.3 }));
          return;
        }
        const id = i.t.id;
        const c = (s.hl && s.hl[id]) || (s.cur === id ? 'amber' : path.has(id) ? 'blue' : null);
        svg.append(S('rect', { x, y, width: i.w, height: i.h, rx: 9, fill: c ? `var(--${c}-soft)` : 'var(--sheet)', stroke: c ? `var(--${c})` : 'var(--ink)', 'stroke-width': c ? 2.3 : 1.4 }));
        svg.append(T(X(i), y + 15.5, String(i.t.v), { size: 14, anchor: 'middle', weight: 700 }));
        if (s.ann && s.ann[id] != null) svg.append(T(X(i) + i.w / 2 + 4, y + 2, 'h=' + s.ann[id], { size: 12, fill: 'var(--green)', weight: 700 }));
      });
      ui.stage.append(svg);
    }
    function render(i) {
      const s = steps[i];
      cb.hl(s.line);
      drawTree(s);
      framesEl.innerHTML = '';
      (s.frames || []).forEach((f, k) => framesEl.append(el('div', { class: 'fr' + (k === s.frames.length - 1 ? ' top' : '') }, f)));
      if (komp && !(s.frames || []).length) framesEl.append(el('div', { class: 'sv-empty' }, 'keine'));
      outEl.innerHTML = '';
      (s.out || []).forEach((v) => outEl.append(el('span', null, String(v))));
      if (!(s.out || []).length) outEl.append(el('span', { style: 'border:0;background:none;color:var(--ink-3)' }, '–'));
      const st0 = stats(s.tree);
      statsEl.innerHTML = '';
      const kv = (k, v) => statsEl.append(el('span', null, k), el('b', null, v));
      kv('Knoten', String(st0.n));
      kv('Blätter / innere', `${st0.leaves} / ${st0.inner}`);
      kv('Höhe', st0.n ? String(st0.h) : '–');
      kv('Ebenen', String(st0.h + 1));
      kv('mindestens nötig', String(st0.minLevels) + ' Ebenen');
      kv('Form', st0.n === 0 ? '–' : [st0.degen ? 'entartet' : null, st0.full ? 'vollständig' : null, st0.bal ? 'balanciert' : 'nicht balanciert'].filter(Boolean).join(', '));
      ui.info.innerHTML = s.text;
    }
    const st = stepper(ui.ctrl, render);
    function idle(text) { steps = []; frames = []; out = []; rec({ line: -1, text }); st.reset(1); }
    function run(fn) { fn(); st.reset(steps.length, 0); }
    preset.s.addEventListener('change', () => { load(preset.s.value); idle(`Baum geladen: Die Werte wurden in der Reihenfolge ${(BST_PRESETS[preset.s.value].vals).map(String).join(', ') || '(keine)'} eingefügt.`); });
    bIns.addEventListener('click', () => run(() => opInsert(parseVal(valIn.value))));
    bSearch.addEventListener('click', () => run(() => opSearch(parseVal(valIn.value))));
    valIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') run(() => opInsert(parseVal(valIn.value))); });
    bTrav.addEventListener('click', () => run(() => opTrav(trav.s.value)));
    bHeight.addEventListener('click', () => run(opHeight));
    bBal.addEventListener('click', () => run(opBalance));
    absBox.addEventListener('change', () => st.go(st.i));
    load(cfg.preset || 'beispiel');
    if (cfg.start === 'insert') run(() => opInsert(parseVal(valIn.value)));
    else if (cfg.start === 'search') run(() => opSearch(parseVal(valIn.value)));
    else if (cfg.start === 'height') run(opHeight);
    else if (cfg.start === 'inorder') run(() => opTrav('in'));
    else if (cfg.start === 'balance') run(opBalance);
    else idle(cfg.intro || 'Gib einen Wert ein und drück <b>Einfügen</b> oder <b>Suchen</b>. Mit „Weiter ▶“ gehst du dann Vergleich für Vergleich durch.');
  }

  window.Viz = { recstack, hanoi, levy, queens, knapsack, sudoku, graphwalk, paths, maze, listops, stack, mice, guess, bst };
})();
