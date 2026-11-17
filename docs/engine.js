/* Course engine: navigation, rendering, Python runtime, Python blocks, quizzes, exam tasks. */
(() => {
  'use strict';
  const C = window.COURSE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function el(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class') e.className = v;
        else if (k === 'html') e.innerHTML = v;
        else if (k === 'text') e.textContent = v;
        else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
        else e.setAttribute(k, v === true ? '' : v);
      }
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      e.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return e;
  }
  window.UI = { el, esc, $, $$ };

  // ------------------------------------------------------------------ storage
  const store = {
    get(k, d) { try { const v = localStorage.getItem('rl1:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('rl1:' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
  };
  let solved = store.get('solved', {});
  let visited = store.get('visited', {});

  function toast(msg) {
    const t = el('div', { class: 'toast', role: 'status' }, msg);
    document.body.append(t);
    setTimeout(() => t.remove(), 2600);
  }

  // ------------------------------------------------------------------ Python runtime (Pyodide, self-hosted)
  const Py = (() => {
    let state = 'idle';
    let py = null;
    let promise = null;
    const listeners = new Set();
    const setState = (s) => { state = s; listeners.forEach((f) => f(s)); };
    function loadScript(src) {
      return new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = src; s.onload = res; s.onerror = () => rej(new Error('Konnte nicht laden: ' + src));
        document.head.append(s);
      });
    }
    function b64ToBytes(b64) {
      const bin = atob(b64.trim());
      const out = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
      return out;
    }
    function load() {
      if (promise) return promise;
      promise = (async () => {
        setState('loading');
        await loadScript('pyodide/pyodide.js');
        const b64 = await (await fetch('pyodide/python_stdlib.b64.txt')).text();
        const bytes = b64ToBytes(b64);
        const origFetch = window.fetch.bind(window);
        window.fetch = (u, o) => {
          const s = String((u && u.url) || u);
          if (s.endsWith('python_stdlib.zip')) return Promise.resolve(new Response(bytes, { headers: { 'Content-Type': 'application/zip' } }));
          return origFetch(u, o);
        };
        py = await window.loadPyodide({ indexURL: new URL('pyodide/', location.href).href });
        py.runPython(C.harness);
        setState('ready');
        return py;
      })().catch((e) => { console.error(e); setState('error'); promise = null; throw e; });
      return promise;
    }
    async function call(fn, ...args) {
      await load();
      const f = py.globals.get(fn);
      try { return JSON.parse(f(...args)); } finally { f.destroy(); }
    }
    return {
      load,
      run: (code, tests, mode) => call('run_code', code, tests || '', mode || 'run'),
      trace: (code) => call('trace_code', code, 500),
      get state() { return state; },
      on(f) { listeners.add(f); f(state); },
    };
  })();
  window.Py = Py;

  // ------------------------------------------------------------------ friendly error explanations
  function explainError(err) {
    const t = err.type || '';
    const m = err.msg || '';
    let mm;
    const P = (s) => '<p>' + s + '</p>';
    if (t === 'StepLimit') return P('Das Programm ist nicht fertig geworden. Typische Ursachen: eine <code>while</code>-Schleife, deren Bedingung nie falsch wird (hast du vergessen, die Schleifenvariable zu ändern, z. B. <code>k = k.NachfolgerGeben()</code>?), oder eine Rekursion, deren Rekursionsende nie erreicht wird.');
    if (t === 'RecursionError') return P('Die Funktion ruft sich immer wieder selbst auf und erreicht nie ihr <b>Rekursionsende</b>. Prüf zwei Dinge: (1) Gibt es ein <code>if</code>, das die Rekursion beendet, ohne sich erneut aufzurufen? (2) Kommt jeder rekursive Aufruf diesem Fall <i>näher</i> (z. B. <code>n - 1</code> statt <code>n</code>)?');
    if (t === 'IndentationError' || t === 'TabError') {
      if (/expected an indented block/.test(m)) return P('Nach einer Zeile, die mit <code>:</code> endet (if, else, for, while, def, class), muss die nächste Zeile <b>um 4 Leerzeichen eingerückt</b> sein. Soll der Block vorerst leer bleiben, schreib <code>pass</code>.');
      if (/unexpected indent/.test(m)) return P('Diese Zeile ist eingerückt, obwohl kein Block geöffnet wurde. Zeilen desselben Blocks müssen genau in derselben Spalte beginnen.');
      if (/unindent does not match/.test(m)) return P('Diese Zeile springt auf eine Einrückungstiefe zurück, die es nie gab. Zähl die Leerzeichen: Blöcke verwenden Vielfache von 4.');
      return P('Die Einrückung passt nicht. In Python <i>ist</i> die Einrückung die Blockstruktur: Alles, was zu einem <code>if</code>, einer Schleife oder einer Funktion gehört, ist um 4 Leerzeichen eingerückt.');
    }
    if (t === 'SyntaxError') {
      if (/expected ':'/.test(m)) return P('Am Ende dieser Zeile fehlt ein Doppelpunkt <code>:</code>. Jede Zeile mit <code>if</code>, <code>elif</code>, <code>else</code>, <code>for</code>, <code>while</code>, <code>def</code> und <code>class</code> endet mit <code>:</code>.');
      if (/was never closed|unterminated string|EOL/.test(m)) return P('Eine Klammer oder ein Anführungszeichen wird geöffnet, aber nie geschlossen. Zähl <code>( )</code>, <code>[ ]</code> und die Anführungszeichen in dieser Zeile.');
      if (/invalid syntax\. Maybe you meant '==' or ':=' instead of '='|cannot assign to/.test(m)) return P('Du hast <code>=</code> (Zuweisung) verwendet, wo ein Vergleich <code>==</code> gemeint war, z. B. in <code>if x == 3:</code>.');
      if (/invalid character/.test(m)) return P('Hier steht ein Zeichen, das Python nicht lesen kann, oft ein typografisches Anführungszeichen <code>„ “</code> oder ein besonderer Strich, kopiert aus einem Dokument. Verwende einfache <code>"</code>-Anführungszeichen.');
      return P('Python kann diese Zeile nicht lesen. Häufige Ursachen: ein fehlender Doppelpunkt, eine fehlende Klammer oder ein fehlendes Anführungszeichen, ein falsch geschriebenes Schlüsselwort oder <code>=</code> statt <code>==</code>. In der markierten Zeile hat Python das Problem bemerkt; manchmal steckt der eigentliche Fehler in der Zeile darüber.');
    }
    if (t === 'NameError') {
      mm = m.match(/name '(.+?)' is not defined/);
      const n = mm ? '<code>' + esc(mm[1]) + '</code>' : 'diesen Namen';
      return P('Python kennt ' + n + ' nicht.') + P('Prüf: ein Tippfehler oder falsche Groß-/Kleinschreibung (<code>KnotenNummer</code> und <code>knotenNummer</code> sind verschiedene Namen)? Wird die Variable <i>vor</i> ihrer Verwendung angelegt? In einer Methode müssen Attribute mit <code>self.</code> davor geschrieben werden.');
    }
    if (t === 'UnboundLocalError') return P('Du weist diesem Namen irgendwo in der Funktion einen Wert zu, deshalb behandelt Python ihn in der ganzen Funktion als <b>lokale</b> Variable, aber in dieser Zeile hat er noch keinen Wert. Gib ihm am Anfang der Funktion einen Startwert.');
    if (t === 'AttributeError') {
      mm = m.match(/'NoneType' object has no attribute '(.+?)'/);
      if (mm) return P('Du hast <code>.' + esc(mm[1]) + '</code> auf <code>None</code> aufgerufen. Eine Variable oder ein Attribut, das auf ein Objekt zeigen sollte, ist leer.') + P('In diesem Kurs ist das fast immer der <b>Sonderfall</b> am Rand einer Struktur: eine leere Liste (<code>anfang is None</code>), der letzte Knoten (<code>nachfolger is None</code>) oder eine Funktion, die vergessen hat, ihr Ergebnis mit <code>return</code> zurückzugeben. Prüf diesen Fall mit <code>if ... is None:</code>, bevor du die Methode aufrufst.');
      mm = m.match(/'(.+?)' object has no attribute '(.+?)'/);
      if (mm) return P('Objekte vom Typ <code>' + esc(mm[1]) + '</code> haben kein Attribut und keine Methode <code>' + esc(mm[2]) + '</code>. Tippfehler oder falsche Groß-/Kleinschreibung? Hast du das Attribut in <code>__init__</code> mit <code>self.' + esc(mm[2]) + ' = ...</code> angelegt?');
      return P('Dieses Attribut oder diese Methode gibt es bei dem Objekt nicht.');
    }
    if (t === 'TypeError') {
      if (/takes (\d+) positional arguments? but (\d+) (were|was) given/.test(m)) return P('Die Funktion oder Methode hat eine andere Anzahl von Argumenten bekommen, als sie festlegt. Bei Methoden: Hast du <code>self</code> als ersten Parameter in der <code>def</code>-Zeile vergessen?');
      if (/missing (\d+) required positional argument/.test(m)) return P('Der Aufruf übergibt zu wenige Argumente. Vergleiche den Aufruf mit den Parametern in der <code>def</code>-Zeile.');
      if (/NoneType/.test(m)) return P('Ein Wert ist <code>None</code>, wo eine Zahl, eine Liste oder ein Objekt erwartet wurde. Meistens hat eine Funktion ihr Ergebnis <b>ausgegeben</b> statt es <b>zurückzugeben</b>, oder in einem Zweig fehlt ein <code>return</code>.');
      if (/can only concatenate str|unsupported operand type/.test(m)) return P('Du hast Werte verschiedener Typen verknüpft, z. B. einen Text und eine Zahl mit <code>+</code>. Wandle mit <code>str(zahl)</code> oder <code>int(text)</code> um.');
      if (/not callable/.test(m)) return P('Du hast Klammern <code>( )</code> hinter etwas geschrieben, das keine Funktion ist, z. B. ein Attribut oder eine Zahl.');
      if (/not subscriptable/.test(m)) return P('Du hast <code>[ ]</code> auf etwas angewendet, das keine Liste ist.');
      if (/abstract/.test(m)) return P('Du wolltest ein Objekt einer <b>abstrakten Klasse</b> erzeugen (oder einer Unterklasse, die noch nicht alle abstrakten Methoden implementiert).');
      return P('Eine Operation hat einen Wert des falschen Typs bekommen.');
    }
    if (t === 'IndexError') return P('Du hast auf eine Listenposition zugegriffen, die es nicht gibt. Eine Liste der Länge <code>n</code> hat die Positionen <code>0</code> bis <code>n - 1</code>. Prüf die Schleifengrenzen (<code>range(len(liste))</code>) und leere Listen.');
    if (t === 'ValueError' && /not in list/.test(m)) return P('<code>remove(x)</code> oder <code>index(x)</code> hat <code>x</code> nicht in der Liste gefunden.');
    if (t === 'ValueError') return P('Ein Wert hat den richtigen Typ, aber einen unbrauchbaren Inhalt, z. B. <code>int("abc")</code>.');
    if (t === 'ZeroDivisionError') return P('Division durch null. Prüf den Fall, in dem der Teiler 0 ist.');
    if (t === 'KeyError') return P('Das Dictionary hat keinen Eintrag mit diesem Schlüssel.');
    if (t === 'RuntimeError' && /input\(\)/.test(m)) return P('Hier können während des Programmlaufs keine Werte eingetippt werden. Schreib sie direkt in den Code.');
    return '';
  }

  function errorCard(err, code) {
    const lines = (code || '').split('\n');
    const card = el('div', { class: 'err-card' });
    const title = err.type === 'StepLimit' ? 'Endlos?' : err.type === 'RecursionError' ? 'Kein Rekursionsende erreicht' : 'Fehler';
    card.append(el('div', { class: 'e-title' }, title));
    if (err.type !== 'StepLimit') card.append(el('div', { class: 'e-raw' }, (err.type || '') + ': ' + (err.msg || '')));
    if (err.line) {
      const txt = err.text != null ? err.text : (lines[err.line - 1] || '');
      card.append(el('div', { class: 'e-line' }, 'Zeile ' + err.line + ':   ' + txt.trim()));
    }
    const help = explainError(err);
    if (help) card.append(el('div', { class: 'e-help', html: help }));
    if (err.trace && err.trace.length > 1 && err.type !== 'RecursionError') {
      card.append(el('div', { class: 'e-trace', html: 'Aufrufkette: ' + err.trace.map((t) => '<code>' + esc(t[1] === '<module>' ? 'Hauptprogramm' : t[1]) + '</code> (Zeile ' + t[0] + ')').join(' → ') }));
    }
    return card;
  }
  window.UI.errorCard = errorCard;

  // ------------------------------------------------------------------ highlighting
  const PSEUDO_KW = ['methode', 'endemethode', 'falls', 'dann', 'sonst', 'endefalls', 'solange', 'endesolange', 'wiederhole', 'endewiederhole', 'für', 'jeden', 'jedes', 'von', 'bis', 'ende', 'return', 'zurückgeben', 'neu', 'und', 'oder', 'nicht', 'klasse', 'endeklasse', 'wahr', 'falsch', 'leer', 'in', 'endefür', 'selbst', 'nichts'];
  const kwRe = new RegExp('(^|[^\\wäöüÄÖÜß])(' + PSEUDO_KW.join('|') + ')(?=$|[^\\wäöüÄÖÜß])', 'g');
  function pseudoHL(text) {
    return text.split('\n').map((line) => {
      const ci = line.indexOf('//');
      let body = ci >= 0 ? line.slice(0, ci) : line;
      const cm = ci >= 0 ? line.slice(ci) : '';
      body = esc(body).replace(kwRe, '$1<span class="kw">$2</span>');
      return body + (cm ? '<span class="tok-com">' + esc(cm) + '</span>' : '');
    }).join('\n');
  }
  function highlight(root) {
    $$('pre > code', root).forEach((code) => {
      if (code.dataset.hl) return;
      code.dataset.hl = '1';
      const cls = code.className || '';
      const text = code.textContent.replace(/\n$/, '');
      const pre = code.parentElement;
      if (/language-python/.test(cls) && window.CodeMirror && CodeMirror.runMode) {
        code.textContent = '';
        CodeMirror.runMode(text, 'python', code);
        pre.classList.add('cm-s-course');
        pre.prepend(el('span', { class: 'lbl' }, 'Python'));
      } else if (/language-pseudo/.test(cls)) {
        code.innerHTML = pseudoHL(text);
        pre.classList.add('pseudo');
        pre.prepend(el('span', { class: 'lbl' }, 'Pseudocode'));
      } else if (/language-out/.test(cls)) {
        pre.prepend(el('span', { class: 'lbl' }, 'Ausgabe'));
      }
    });
  }
  window.UI.highlight = highlight;
  window.UI.pseudoHL = pseudoHL;

  // ------------------------------------------------------------------ editor wrapper
  function makeEditor(host, value, keys) {
    if (window.CodeMirror) {
      const cm = CodeMirror(host, {
        value, mode: 'python', theme: 'course', lineNumbers: true, indentUnit: 4, tabSize: 4,
        indentWithTabs: false, matchBrackets: true, viewportMargin: Infinity, lineWrapping: false,
        extraKeys: {
          Tab: (c) => (c.somethingSelected() ? c.indentSelection('add') : c.replaceSelection('    ', 'end')),
          'Shift-Tab': (c) => c.indentSelection('subtract'),
          'Ctrl-Enter': () => keys.check(), 'Cmd-Enter': () => keys.check(),
          'Shift-Enter': () => keys.run(),
        },
      });
      let marked = null;
      return {
        get: () => cm.getValue(), set: (v) => cm.setValue(v), onChange: (f) => cm.on('change', f),
        mark(line) { this.unmark(); if (line > 0 && line <= cm.lineCount()) { marked = line - 1; cm.addLineClass(marked, 'background', 'cm-errline'); } },
        unmark() { if (marked != null) { cm.removeLineClass(marked, 'background', 'cm-errline'); marked = null; } },
        refresh: () => cm.refresh(),
      };
    }
    const ta = el('textarea', { class: 'copy-area', spellcheck: 'false' });
    ta.value = value; host.append(ta);
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('    ', s, ta.selectionEnd, 'end'); }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); keys.check(); }
    });
    return { get: () => ta.value, set: (v) => { ta.value = v; }, onChange: (f) => ta.addEventListener('input', f), mark() {}, unmark() {}, refresh() {} };
  }

  // ------------------------------------------------------------------ Python blocks
  function htmlToText(html) {
    const d = document.createElement('div');
    d.innerHTML = html;
    return d.innerText.replace(/\n{3,}/g, '\n\n').trim();
  }

  function copyText(text, fallbackHost) {
    const done = () => toast('Kopiert. Füg es in den Chat mit Claude ein.');
    const fallback = () => {
      const ta = el('textarea', { class: 'copy-area', readonly: true });
      ta.value = text;
      fallbackHost.innerHTML = '';
      fallbackHost.append(el('div', { class: 'out-label' }, 'Kopier diesen Text (Strg+C / ⌘C)'), ta);
      ta.focus(); ta.select();
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
      else fallback();
    } catch (e) { fallback(); }
  }

  function mountExercise(host) {
    const ex = C.exercises[host.dataset.ex];
    if (!ex) { host.textContent = 'Fehlende Aufgabe ' + host.dataset.ex; return; }
    host.innerHTML = '';
    const state = el('span', { class: 'ex-state' + (solved[ex.id] ? ' solved' : '') }, solved[ex.id] ? '✓ gelöst' : 'offen');
    const level = el('span', { class: 'ex-level', title: 'Schwierigkeit ' + ex.level + ' von 3' }, [1, 2, 3].map((i) => el('i', { class: i <= ex.level ? 'on' : '' })));
    host.append(el('div', { class: 'ex-head' },
      el('span', { class: 'ex-tag' }, 'Python-Block'), el('span', { class: 'ex-num' }, ex.label),
      el('span', { class: 'ex-title' }, ex.title), level, state));
    host.append(el('div', { class: 'ex-body' }, el('div', { class: 'ex-task content', html: ex.task })));
    const edHost = el('div', { class: 'ex-editor' });
    host.append(edHost);
    const hintBox = el('div', { class: 'hint-box', hidden: true });
    const solBox = el('div', { class: 'sol-box', hidden: true });
    const out = el('div', { class: 'ex-out', 'aria-live': 'polite' });
    let checks = 0;
    let hintIdx = 0;
    let busy = false;

    const keys = { run: () => doRun(), check: () => doCheck() };
    const ed = makeEditor(edHost, store.get('draft:' + ex.id, ex.starter), keys);
    let saveT = null;
    ed.onChange(() => { clearTimeout(saveT); saveT = setTimeout(() => store.set('draft:' + ex.id, ed.get()), 400); });

    const bRun = el('button', { class: 'btn', title: 'Code ausführen (Shift+Enter)' }, '▶ Ausführen', el('span', { class: 'k' }, '⇧↵'));
    const bCheck = el('button', { class: 'btn primary', title: 'Automatische Prüfungen starten (Strg+Enter)' }, '✓ Prüfen', el('span', { class: 'k' }, 'Strg↵'));
    const bViz = el('button', { class: 'btn', title: 'Deinen Code Zeile für Zeile durchgehen' }, '◫ Visualisieren');
    const bHint = el('button', { class: 'btn ghost' }, ex.hints.length ? 'Tipp (' + ex.hints.length + ')' : 'Keine Tipps');
    if (!ex.hints.length) bHint.disabled = true;
    const bSol = el('button', { class: 'btn ghost' }, 'Lösung');
    const bReset = el('button', { class: 'btn ghost' }, 'Zurücksetzen');
    const bCopy = el('button', { class: 'btn ghost', title: 'Aufgabe, Code und Prüfergebnis kopieren, um sie an Claude zu schicken' }, '⧉ Für Claude kopieren');
    host.append(el('div', { class: 'ex-tools' }, bRun, bCheck, bViz, el('span', { class: 'spacer' }), bHint, bSol, bReset, bCopy));
    host.append(hintBox, solBox, out);

    let lastResult = null;

    function setBusy(b, label) {
      busy = b;
      [bRun, bCheck, bViz].forEach((x) => { x.disabled = b; });
      if (b) {
        out.innerHTML = '';
        out.append(el('div', { class: 'console empty' }, label || (Py.state === 'ready' ? 'Läuft …' : 'Python startet … (der erste Start dauert ein paar Sekunden)')));
      }
    }

    async function exec(mode) {
      if (busy) return;
      const code = ed.get();
      ed.unmark();
      setBusy(true);
      await new Promise((r) => setTimeout(r, 30));
      let res;
      try {
        res = await Py.run(code, ex.tests, mode);
      } catch (e) {
        setBusy(false);
        out.innerHTML = '';
        out.append(el('div', { class: 'err-card' }, el('div', { class: 'e-title' }, 'Python konnte nicht starten'), el('div', { class: 'e-help' }, 'Bitte lade die Seite neu. Klappt es weiterhin nicht, blockiert dein Netzwerk vielleicht den Download der Python-Laufzeitumgebung.')));
        return;
      }
      setBusy(false);
      lastResult = { mode, res, code };
      render(mode, res, code);
    }

    function render(mode, res, code) {
      out.innerHTML = '';
      if (mode === 'check') {
        checks += 1;
        if (res.error) {
          out.append(el('div', { class: 'summary no' }, 'Dein Code bricht mit einem Fehler ab, bevor die Prüfungen laufen können.'));
        } else if (res.tests) {
          const pass = res.tests.filter((t) => t.status === 'pass').length;
          const all = res.tests.length;
          if (pass === all && all > 0) {
            out.append(el('div', { class: 'summary ok' }, el('span', { class: 'stamp' }, '✓ gelöst'), `Alle ${all} Prüfungen bestanden.`));
            if (!solved[ex.id]) { solved[ex.id] = true; store.set('solved', solved); updateProgress(); }
            state.textContent = '✓ gelöst'; state.classList.add('solved');
          } else {
            out.append(el('div', { class: 'summary no' }, `${pass} von ${all} Prüfungen bestanden.`));
          }
          const ul = el('ul', { class: 'tests' });
          res.tests.forEach((t) => {
            const li = el('li', { class: t.status }, el('span', { class: 'ic' }, t.status === 'pass' ? '✓' : '✗'));
            const body = el('div', null, t.name);
            if (t.msg) body.append(el('span', { class: 'msg' }, t.msg));
            if (t.exc) {
              if (t.exc.line) body.append(el('span', { class: 'msg' }, 'in deiner Zeile ' + t.exc.line + ': ' + ((code.split('\n')[t.exc.line - 1]) || '').trim()));
              const help = explainError(t.exc);
              if (help) body.append(el('span', { class: 'msg help', html: help }));
            }
            li.append(body);
            ul.append(li);
          });
          out.append(ul);
          const failedLine = res.tests.map((t) => t.exc && t.exc.line).find(Boolean);
          if (failedLine) ed.mark(failedLine);
        }
      }
      if (res.error) {
        out.append(errorCard(res.error, code));
        if (res.error.line) ed.mark(res.error.line);
      }
      if (mode === 'run' || res.stdout) {
        out.append(el('div', { class: 'out-label' }, 'Ausgabe'));
        out.append(el('pre', { class: 'console' + (res.stdout ? '' : ' empty') }, res.stdout || (res.error ? '(keine Ausgabe vor dem Fehler)' : '(keine Ausgabe – verwende print(...), um Werte anzuzeigen)')));
      }
    }

    function doRun() { exec('run'); }
    function doCheck() { exec('check'); }
    bRun.addEventListener('click', doRun);
    bCheck.addEventListener('click', doCheck);
    bViz.addEventListener('click', () => {
      if (busy) return;
      out.innerHTML = '';
      const box = el('div');
      out.append(box);
      window.Tracer.run(box, ed.get(), { compact: true });
    });
    bHint.addEventListener('click', () => {
      if (!ex.hints.length) return;
      hintBox.hidden = false;
      hintIdx = Math.min(hintIdx + 1, ex.hints.length);
      hintBox.innerHTML = '';
      ex.hints.slice(0, hintIdx).forEach((hh, i) => hintBox.append(el('div', { class: 'h-title' }, 'Tipp ' + (i + 1) + ' von ' + ex.hints.length), el('div', { html: hh })));
      highlight(hintBox);
      bHint.textContent = hintIdx < ex.hints.length ? 'Nächster Tipp' : 'Alle Tipps angezeigt';
    });
    let solArmed = false;
    bSol.addEventListener('click', () => {
      if (!solBox.hidden) { solBox.hidden = true; bSol.textContent = 'Lösung'; return; }
      if (checks === 0 && !solArmed && !solved[ex.id]) {
        solArmed = true;
        bSol.textContent = 'Wirklich? Probier zuerst „Prüfen“ – zum Anzeigen noch einmal klicken';
        setTimeout(() => { solArmed = false; if (solBox.hidden) bSol.textContent = 'Lösung'; }, 5000);
        return;
      }
      solBox.hidden = false;
      solBox.innerHTML = '';
      const useBtn = el('button', { class: 'btn ghost' }, 'In den Editor übernehmen');
      useBtn.addEventListener('click', () => { ed.set(ex.solution); toast('Musterlösung in den Editor übernommen.'); });
      solBox.append(el('div', { class: 's-title' }, 'Musterlösung', useBtn));
      solBox.append(el('pre', null, el('code', { class: 'language-python' }, ex.solution)));
      if (ex.explain) solBox.append(el('div', { class: 'content', html: ex.explain }));
      highlight(solBox);
      bSol.textContent = 'Lösung ausblenden';
    });
    let resetArmed = false;
    bReset.addEventListener('click', () => {
      if (!resetArmed) {
        resetArmed = true; bReset.textContent = 'Zum Zurücksetzen noch einmal klicken';
        setTimeout(() => { resetArmed = false; bReset.textContent = 'Zurücksetzen'; }, 4000);
        return;
      }
      resetArmed = false; bReset.textContent = 'Zurücksetzen';
      ed.set(ex.starter); ed.unmark(); out.innerHTML = '';
    });
    bCopy.addEventListener('click', () => {
      const code = ed.get();
      let txt = `Python-Block ${ex.label} – ${ex.title}\n(Kurs: Rekursion & Listen, Lektion ${C.lessons[ex.lesson].num} ${C.lessons[ex.lesson].title})\n\nAUFGABE:\n${htmlToText(ex.task)}\n\nMEIN CODE:\n\`\`\`python\n${code}\n\`\`\`\n`;
      if (lastResult && lastResult.code === code) {
        const r = lastResult.res;
        if (r.error) txt += `\nFEHLER: ${r.error.type}: ${r.error.msg}${r.error.line ? ' (Zeile ' + r.error.line + ')' : ''}\n`;
        if (r.tests) {
          const pass = r.tests.filter((t) => t.status === 'pass').length;
          txt += `\nPRÜFERGEBNIS: ${pass}/${r.tests.length} bestanden\n` + r.tests.map((t) => (t.status === 'pass' ? '✓ ' : '✗ ') + t.name + (t.msg ? '  →  ' + t.msg : '')).join('\n') + '\n';
        }
        if (r.stdout) txt += `\nAUSGABE:\n${r.stdout.slice(0, 1500)}\n`;
      } else {
        txt += '\n(Die Prüfungen habe ich mit dieser Version noch nicht laufen lassen.)\n';
      }
      txt += '\nBitte korrigiere meinen Code und erkläre mir, was ich falsch gemacht habe.';
      copyText(txt, out);
    });
  }

  // ------------------------------------------------------------------ quiz & exam tasks
  function mountQuiz(q) {
    const opts = $$('.q-opt', q);
    const exp = $('.q-explain', q);
    opts.forEach((o) => o.addEventListener('click', () => {
      const right = o.dataset.c === '1';
      o.classList.add(right ? 'right' : 'wrong');
      if (right) { opts.filter((x) => x.dataset.c === '1').forEach((x) => x.classList.add('right')); }
      if (exp) exp.hidden = false;
    }));
  }
  function mountExam(x) {
    const sol = $('.exam-sol', x);
    if (!sol) return;
    sol.hidden = true;
    const b = el('button', { class: 'btn' }, 'Musterlösung zeigen');
    b.addEventListener('click', () => {
      sol.hidden = !sol.hidden;
      b.textContent = sol.hidden ? 'Musterlösung zeigen' : 'Musterlösung ausblenden';
      if (!sol.hidden) hydrateDiagrams(sol);
    });
    x.append(el('div', { class: 'exam-foot' }, b));
  }

  function hydrateDiagrams(root) {
    $$('figure.diagram', root).forEach((f) => {
      if (f.dataset.done || f.closest('[hidden]')) return;
      f.dataset.done = '1';
      const src = $('script', f);
      try { window.Diagrams.render(f.dataset.kind, src ? src.textContent : '', f); } catch (e) { console.error(e); f.prepend(el('div', { class: 'err-card' }, 'Diagrammfehler: ' + e.message)); }
    });
  }

  function hydrate(root) {
    highlight(root);
    $$('table', root).forEach((t) => {
      if (t.closest('.bridge') || t.parentElement.classList.contains('table-wrap')) return;
      const w = el('div', { class: 'table-wrap' });
      t.replaceWith(w); w.append(t);
    });
    hydrateDiagrams(root);
    $$('.viz[data-viz]', root).forEach((v) => {
      if (v.dataset.done) return;
      v.dataset.done = '1';
      const cfgEl = $('script', v);
      let cfg = {};
      try { cfg = cfgEl ? JSON.parse(cfgEl.textContent || '{}') : {}; } catch (e) { console.error(e); }
      const fn = window.Viz && window.Viz[v.dataset.viz];
      if (fn) { try { fn(v, cfg); } catch (e) { console.error(e); v.append(el('div', { class: 'err-card' }, 'Fehler in der Visualisierung: ' + e.message)); } }
    });
    $$('.trace[data-trace]', root).forEach((t) => {
      if (t.dataset.done) return;
      t.dataset.done = '1';
      window.Tracer.widget(t);
    });
    $$('.exercise[data-ex]', root).forEach(mountExercise);
    $$('.quiz', root).forEach(mountQuiz);
    $$('.exam', root).forEach(mountExam);
  }

  // ------------------------------------------------------------------ navigation
  const lessonStatus = (id) => {
    const L = C.lessons[id];
    if (!L.exercises.length) return { done: !!visited[id], text: visited[id] ? '✓' : '' };
    const n = L.exercises.filter((e) => solved[e]).length;
    return { done: n === L.exercises.length, text: n === L.exercises.length ? '✓' : n + '/' + L.exercises.length };
  };
  const partOf = (id) => C.parts.find((p) => p.lessons.includes(id));

  function renderSidebar() {
    const sb = $('#sidebar');
    sb.innerHTML = '';
    sb.append(el('div', { class: 'brand' },
      el('a', { href: '#home' }, el('div', { class: 'mark', html: 'Rekursion <span>&amp;</span> Listen' }), el('div', { class: 'sub' }, 'Informatik Q12 · Kurs 2INF1')),
      el('div', { class: 'progress', 'aria-hidden': 'true' }, el('i', { id: 'prog-bar' })),
      el('div', { class: 'progress-label', id: 'prog-label' })));
    C.parts.forEach((p) => {
      const ul = el('ul', { class: 'nav-list' });
      p.lessons.forEach((id) => {
        const L = C.lessons[id];
        const st = lessonStatus(id);
        ul.append(el('li', null, el('a', { href: '#' + id, 'data-id': id }, el('span', { class: 'num' }, L.num), el('span', null, L.title), el('span', { class: 'st' + (st.done ? ' done' : ''), 'data-st': id }, st.text))));
      });
      sb.append(el('div', { class: 'nav-part' },
        el('div', { class: 'nav-part-h' }, el('span', { class: 'part-badge', style: '--pc:' + p.color }, p.letter), el('span', null, p.title), el('span', { class: 'frac', 'data-pf': p.id })),
        ul));
    });
    updateProgress();
  }

  function updateProgress() {
    const allEx = Object.keys(C.exercises);
    const n = allEx.filter((e) => solved[e]).length;
    const bar = $('#prog-bar');
    if (bar) bar.style.width = (allEx.length ? (100 * n) / allEx.length : 0) + '%';
    const lab = $('#prog-label');
    if (lab) lab.textContent = `${n} von ${allEx.length} Python-Blöcken gelöst`;
    $$('[data-st]').forEach((s) => { const st = lessonStatus(s.dataset.st); s.textContent = st.text; s.classList.toggle('done', st.done); });
    C.parts.forEach((p) => {
      const f = $(`[data-pf="${p.id}"]`);
      if (!f) return;
      const d = p.lessons.filter((id) => lessonStatus(id).done).length;
      f.textContent = d + '/' + p.lessons.length;
    });
  }
  window.UI.updateProgress = updateProgress;

  function setCrumbs(html) { $('#crumbs').innerHTML = html; }

  function renderHome() {
    const main = $('#main');
    main.innerHTML = '';
    setCrumbs('<b>Kursübersicht</b>');
    const total = Object.keys(C.exercises).length;
    const last = store.get('last', null);
    const first = C.order[0];
    const hero = el('section', { class: 'hero' },
      el('span', { class: 'kicker' }, 'Informatik Q12 · 2INF1'),
      el('h1', { html: 'Rekursion <span>&amp;</span> Listen' }),
      el('p', { class: 'lead' }, 'Von deiner allerersten Zeile Python bis zum geordneten Binärbaum mit dem Entwurfsmuster Kompositum. Jedes Thema wird zuerst als reine Logik erklärt, dann Zeile für Zeile mit seiner Umsetzung in Python verbunden und schließlich in Python-Blöcken geübt, die deinen Code automatisch prüfen.'),
      el('div', { class: 'meta-row' },
        el('span', null, el('b', null, String(C.order.length)), ' Lektionen'),
        el('span', null, el('b', null, String(total)), ' Python-Blöcke'),
        el('span', null, el('b', null, String(C.stats.quizzes)), ' Kurztests'),
        el('span', null, el('b', null, String(C.stats.exams)), ' Klausuraufgaben')),
      el('div', { class: 'btn-row' },
        el('a', { class: 'btn primary', href: '#' + (last || first) }, last ? 'Weiter: ' + C.lessons[last].num + ' ' + C.lessons[last].title : 'Mit Lektion 0 beginnen'),
        C.parts[1] ? el('a', { class: 'btn', href: '#' + C.parts[1].lessons[0] }, 'Python von null') : null,
        C.parts[2] ? el('a', { class: 'btn', href: '#' + C.parts[2].lessons[0] }, 'Direkt zur Rekursion') : null));
    main.append(hero);

    const map = el('section', { class: 'home-sec' }, el('h2', null, 'Kurskarte'),
      el('p', { class: 'prose', style: 'margin-top:0;color:var(--ink-2)' }, 'Jede Linie ist ein Teil des Kurses, jede Station eine Lektion. Zeig auf eine Station, um ihre Verbindungen zu anderen Teilen zu sehen: die Lektionen, auf denen sie aufbaut, und die Lektionen, die sie verwenden. Nichts kommt vor, bevor du gelernt hast, was es voraussetzt.'));
    const metro = el('div', { class: 'metro' });
    map.append(metro);
    main.append(map);
    try { window.Diagrams.metro(metro, C, lessonStatus); } catch (e) { console.error(e); }

    main.append(el('section', { class: 'home-sec' }, el('h2', null, 'So funktioniert jede Lektion'),
      el('div', { class: 'method' },
        card('1', 'Logik', 'Die Idee ganz ohne Code: Bilder, Diagramme, Pseudocode in der Notation deines Kurses, Beispiele von Hand durchgerechnet.'),
        card('2', 'Brücke', 'Pseudocode und Python nebeneinander, Zeile für Zeile, damit du siehst, welche Zeile Logik zu welcher Zeile Code wird.'),
        card('3', 'Python-Blöcke', 'Du schreibst den Code. „Prüfen“ führt automatische Tests aus, auch für die klassischen Sonderfälle, und erklärt, was schiefgegangen ist.'),
        card('4', 'Klausurtraining', 'Papieraufgaben wie in der Klausur: nachvollziehen, zeichnen, Pseudocode schreiben. Danach deckst du die Musterlösung auf.'))));
    function card(n, t, d) { return el('div', { class: 'card' }, el('div', { class: 'n' }, n), el('h4', null, t), el('p', null, d)); }

    const parts = el('div', { class: 'parts' });
    C.parts.forEach((p) => {
      const ol = el('ol');
      p.lessons.forEach((id) => {
        const L = C.lessons[id];
        const st = lessonStatus(id);
        ol.append(el('li', null, el('span', { class: 'num' }, L.num), el('a', { href: '#' + id }, L.title), el('span', { class: 'st' + (st.done ? ' done' : '') }, st.text)));
      });
      parts.append(el('div', { class: 'part-card' }, el('h3', null, el('span', { class: 'part-badge', style: '--pc:' + p.color }, p.letter), p.title), el('p', null, p.desc), ol));
    });
    main.append(el('section', { class: 'home-sec' }, el('h2', null, 'Alle Lektionen'), parts));
    main.append(el('section', { class: 'home-sec' }, el('div', { class: 'callout tip' }, el('div', { class: 'c-title' }, 'Deinen Code an Claude schicken'),
      el('p', null, 'Jeder Python-Block hat einen Knopf „Für Claude kopieren“. Er kopiert die Aufgabe, deinen Code und das Ergebnis der letzten Prüfung. Füg alles in den Chat ein, und du bekommst eine Korrektur mit einer Erklärung, was schiefgegangen ist.'))));
  }

  function renderLesson(id) {
    const L = C.lessons[id];
    const p = partOf(id);
    const main = $('#main');
    store.set('last', id);
    if (!L.exercises.length && !visited[id]) { visited[id] = true; store.set('visited', visited); }
    setCrumbs(`Teil ${esc(p.letter)} · ${esc(p.title)} › <b>${esc(L.num)} ${esc(L.title)}</b>`);
    main.innerHTML = '';
    const grid = el('div', { class: 'page-grid' });
    const page = el('article', { class: 'page' });
    const head = el('header', { class: 'lesson-head' },
      el('div', { class: 'eyebrow' }, el('span', { class: 'part-badge', style: '--pc:' + p.color }, p.letter), `Teil ${p.letter} · ${p.title}`, el('span', null, '·'), `Lektion ${L.num}`),
      el('h1', null, L.title),
      L.lead ? el('p', { class: 'lead' }, L.lead) : null,
      el('div', { class: 'meta-row' },
        el('span', null, '⏱ etwa ', el('b', null, String(L.minutes)), ' min'),
        L.exercises.length ? el('span', null, el('b', null, String(L.exercises.length)), L.exercises.length === 1 ? ' Python-Block' : ' Python-Blöcke') : null,
        L.quizzes ? el('span', null, el('b', null, String(L.quizzes)), ' Kurztests') : null,
        L.exams ? el('span', null, el('b', null, String(L.exams)), ' Klausuraufgaben') : null));
    if (L.goals && L.goals.length) head.append(el('div', { class: 'goals' }, el('h4', null, 'Nach dieser Lektion kannst du'), el('ul', null, L.goals.map((g) => el('li', { html: g })))));
    const uses = (L.uses || []).filter((u) => C.lessons[u]);
    const usedBy = C.order.filter((o) => (C.lessons[o].uses || []).includes(id));
    if (uses.length || usedBy.length) {
      const row = el('div', { class: 'links-row' });
      if (uses.length) { row.append('Baut auf:'); uses.forEach((u) => row.append(el('a', { class: 'chip', href: '#' + u }, el('span', { class: 'num' }, C.lessons[u].num), C.lessons[u].title))); }
      if (usedBy.length) { row.append(el('span', { style: 'margin-left:8px' }, 'Wird gebraucht für:')); usedBy.forEach((u) => row.append(el('a', { class: 'chip', href: '#' + u }, el('span', { class: 'num' }, C.lessons[u].num), C.lessons[u].title))); }
      head.append(row);
    }
    page.append(head);
    const content = el('div', { class: 'content', html: L.html });
    page.append(content);

    const idx = C.order.indexOf(id);
    const prev = C.order[idx - 1];
    const next = C.order[idx + 1];
    if (L.exercises.length) {
      page.append(el('div', { class: 'lesson-done' }, el('span', null, 'Fortschritt in der Lektion: '), el('b', { 'data-st': id }, lessonStatus(id).text), el('span', { style: 'color:var(--ink-2)' }, 'Python-Blöcke zählen als erledigt, wenn alle ihre Prüfungen bestanden sind.')));
    }
    page.append(el('nav', { class: 'pager' },
      prev ? el('a', { class: 'prev', href: '#' + prev }, el('small', null, '← Zurück'), el('b', null, C.lessons[prev].num + ' ' + C.lessons[prev].title)) : el('span'),
      next ? el('a', { class: 'next', href: '#' + next }, el('small', null, 'Weiter →'), el('b', null, C.lessons[next].num + ' ' + C.lessons[next].title)) : el('a', { class: 'next', href: '#home' }, el('small', null, 'Geschafft'), el('b', null, 'Zurück zur Übersicht'))));

    grid.append(page);
    const toc = el('nav', { class: 'toc', 'aria-label': 'Auf dieser Seite' }, el('h4', null, 'Auf dieser Seite'));
    $$('h2[id]', content).forEach((h2) => {
      const ph = h2.dataset.phase;
      const a = el('a', { href: '#' + id }, ph ? el('span', { class: 'ph ' + ph }, { logic: 'Logik', bridge: 'Brücke', python: 'Py', exam: 'Klausur', intro: 'Info' }[ph] || ph) : null, h2.dataset.title || h2.textContent);
      a.addEventListener('click', (e) => { e.preventDefault(); h2.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      toc.append(a);
    });
    grid.append(toc);
    main.append(grid);
    hydrate(content);
    updateProgress();
  }

  function route() {
    const id = (location.hash || '').replace(/^#/, '');
    document.body.classList.remove('nav-open');
    if (id && C.lessons[id]) renderLesson(id);
    else renderHome();
    $$('#sidebar a[data-id]').forEach((a) => a.classList.toggle('active', a.dataset.id === id));
    window.scrollTo(0, 0);
  }

  // ------------------------------------------------------------------ boot
  function boot() {
    renderSidebar();
    route();
    window.addEventListener('hashchange', route);
    $('#menu-btn').addEventListener('click', (e) => { e.stopPropagation(); document.body.classList.toggle('nav-open'); });
    document.addEventListener('click', (e) => {
      if (document.body.classList.contains('nav-open') && !e.target.closest('#sidebar')) document.body.classList.remove('nav-open');
    });
    const chip = $('#py-chip');
    Py.on((s) => {
      chip.dataset.state = s;
      $('.t', chip).textContent = { idle: 'Python: nicht geladen', loading: 'Python: lädt …', ready: 'Python 3.12 bereit', error: 'Python konnte nicht laden' }[s];
    });
    setTimeout(() => { Py.load().catch(() => {}); }, 1200);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
