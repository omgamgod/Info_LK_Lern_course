#!/usr/bin/env python3
"""Builds content.js and index.html from the lesson sources."""
import html
import json
import os
import re
import shutil
import sys

import markdown
import yaml

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "docs")          # the finished site (GitHub Pages / offline folder)
BUILD = os.path.join(ROOT, ".build")      # course.json for validate.py
VENDOR = os.path.join(ROOT, "vendor", "codemirror")
SUBJECTS_FILE = os.path.join(HERE, "subjects.json")
CM_FILES = ("codemirror.js", "python.js", "runmode.js", "matchbrackets.js", "LICENSE")

PHASES = {"logic": "Logik", "bridge": "Brücke", "python": "Python", "exam": "Klausurtraining", "intro": "Überblick"}

MD_EXT = ["fenced_code", "tables", "sane_lists"]

PY_KW = r"\b(def|class|if|elif|else|return|while|for|in|not|is|None|self|and|or|True|False|pass|import|from|break|continue)\b"
PS_KW = r"(^|[^\wäöüÄÖÜß])(methode|endemethode|falls|dann|sonst|endefalls|solange|endesolange|wiederhole|endewiederhole|für|jeden|jedes|von|bis|return|neu|und|oder|nicht|klasse|wahr|falsch|endefür|selbst|nichts)(?=$|[^\wäöüÄÖÜß])"


def md(text):
    return markdown.markdown(text, extensions=MD_EXT)


def parse_attrs(s):
    attrs = {}
    rest = []
    for m in re.finditer(r'(\w+)="([^"]*)"|(\w+)=(\S+)|(\S+)', s):
        if m.group(1):
            attrs[m.group(1)] = m.group(2)
        elif m.group(3):
            attrs[m.group(3)] = m.group(4)
        else:
            rest.append(m.group(5))
    return attrs, rest


def split_sections(body, names):
    """Split a block body at lines like '--- starter'. Returns (head, [(name, text), ...])."""
    parts = []
    head = []
    cur = None
    buf = []
    for line in body.split("\n"):
        m = re.match(r"^---\s*(\w+)\s*$", line)
        if m and m.group(1) in names:
            if cur is None:
                head = buf
            else:
                parts.append((cur, "\n".join(buf)))
            cur = m.group(1)
            buf = []
        else:
            buf.append(line)
    if cur is None:
        head = buf
    else:
        parts.append((cur, "\n".join(buf)))
    return "\n".join(head), parts


def strip_code(t):
    lines = t.split("\n")
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()
    return "\n".join(lines) + "\n"


def load_subjects():
    """Load course parts and prepare their lesson lists for the generated site."""
    try:
        with open(SUBJECTS_FILE, encoding="utf-8") as f:
            subjects = json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        raise SystemExit(f"Cannot read {SUBJECTS_FILE}: {e}")

    if not isinstance(subjects, list):
        raise SystemExit("subjects.json must contain a list of subjects")

    required = ("id", "letter", "title", "color", "desc")
    seen = set()
    for i, subject in enumerate(subjects, start=1):
        if not isinstance(subject, dict):
            raise SystemExit(f"Subject {i} in subjects.json must be an object")
        missing = [key for key in required if key not in subject]
        if missing:
            raise SystemExit(f"Subject {i} in subjects.json is missing: {', '.join(missing)}")
        invalid = [key for key in required if not isinstance(subject[key], str) or not subject[key].strip()]
        if invalid:
            raise SystemExit(f"Subject {i} in subjects.json must have non-empty text for: {', '.join(invalid)}")
        subject_id = subject["id"]
        if subject_id in seen:
            raise SystemExit(f"Duplicate subject id {subject_id!r} in subjects.json")
        seen.add(subject_id)
        subject["id"] = subject_id
        subject["lessons"] = []
    return subjects


class Builder:
    def __init__(self):
        self.lessons = {}
        self.order = []
        self.exercises = {}
        self.stats = {"quizzes": 0, "exams": 0}
        self.traces = []

    # ---------------------------------------------------------------- blocks
    def render_body(self, text, L):
        """Markdown with ::: blocks (3+ colons; nested blocks use fewer colons)."""
        lines = text.split("\n")
        out_lines = []
        blocks = []
        i = 0
        while i < len(lines):
            line = lines[i]
            m = re.match(r"^(:{3,})(\w+)\s*(.*)$", line)
            if m:
                fence = m.group(1)
                kind = m.group(2)
                attr_s = m.group(3)
                j = i + 1
                buf = []
                while j < len(lines) and lines[j].rstrip() != fence:
                    buf.append(lines[j])
                    j += 1
                if j >= len(lines):
                    raise SystemExit(f"Unclosed block {kind} in lesson {L['id']} at line {i + 1}")
                blocks.append(self.render_block(kind, attr_s, "\n".join(buf), L))
                out_lines.append("")
                out_lines.append(f"@@BLOCK{len(blocks) - 1}@@")
                out_lines.append("")
                i = j + 1
                continue
            out_lines.append(line)
            i += 1
        h = md("\n".join(out_lines))
        for k, b in enumerate(blocks):
            h = h.replace(f"<p>@@BLOCK{k}@@</p>", b).replace(f"@@BLOCK{k}@@", b)
        return h

    def render_block(self, kind, attr_s, body, L):
        attrs, rest = parse_attrs(attr_s)
        if kind == "exercise":
            return self.exercise(attrs, body, L)
        if kind == "quiz":
            return self.quiz(attrs, body, L)
        if kind == "exam":
            return self.exam(attrs, body, L)
        if kind in ("note", "key", "warn", "tip"):
            default = {"note": "Hinweis", "key": "Kernidee", "warn": "Typischer Fehler", "tip": "Tipp"}[kind]
            title = attrs.get("title", default)
            return f'<div class="callout {kind}"><div class="c-title">{html.escape(title)}</div>{self.render_body(body, L)}</div>'
        if kind == "bridge":
            return self.bridge(attrs, body)
        if kind == "diagram":
            k = rest[0] if rest else attrs.get("kind")
            cap = attrs.get("caption", "")
            wide = " wide" if "wide" in rest else ""
            body_esc = body.replace("</script", "<\\/script")
            capd = f"<figcaption>{html.escape(cap)}</figcaption>" if cap else ""
            return f'<figure class="diagram{wide}" data-kind="{k}"><script type="text/plain">{body_esc}</script>{capd}</figure>'
        if kind == "viz":
            name = rest[0]
            cfg = body.strip() or "{}"
            json.loads(cfg)
            return f'<div class="viz" data-viz="{name}"><script type="application/json">{cfg}</script></div>'
        if kind == "trace":
            title = attrs.get("title", "Schau dem Code beim Laufen zu")
            code = strip_code(body)
            self.traces.append((L["id"], code))
            safe = code.replace("</script", "<\\/script")
            return f'<div class="trace" data-trace="1" data-title="{html.escape(title)}"><script type="text/plain">{safe}</script></div>'
        if kind == "cols":
            head, parts = split_sections(body, ["col"])
            cols = ([head] if head.strip() else []) + [t for _, t in parts]
            card = "cards" in rest
            inner = "".join(f'<div class="{"card" if card else ""}">{self.render_body(c, L)}</div>' for c in cols)
            return f'<div class="cols">{inner}</div>'
        raise SystemExit(f"Unknown block {kind} in {L['id']}")

    def exercise(self, attrs, body, L):
        ex_id = attrs["id"]
        if ex_id in self.exercises:
            raise SystemExit("Duplicate exercise id " + ex_id)
        task, parts = split_sections(body, ["starter", "solution", "tests", "hint", "explain"])
        d = {"starter": "", "solution": "", "tests": "", "hints": [], "explain": ""}
        for name, text in parts:
            if name == "hint":
                d["hints"].append(md(text.strip()))
            elif name == "explain":
                d["explain"] = md(text.strip())
            else:
                d[name] = strip_code(text)
        L["_exn"] = L.get("_exn", 0) + 1
        ex = {
            "id": ex_id, "lesson": L["id"], "label": f"{L['num']}.{L['_exn']}", "title": attrs.get("title", "Python-Block"),
            "level": int(attrs.get("level", 1)), "task": self.render_body(task.strip(), L), **d,
        }
        if not ex["solution"] or not ex["tests"]:
            raise SystemExit("Exercise without solution/tests: " + ex_id)
        self.exercises[ex_id] = ex
        L["exercises"].append(ex_id)
        return f'<div class="exercise" data-ex="{ex_id}"></div>'

    def quiz(self, attrs, body, L):
        head, parts = split_sections(body, ["explain"])
        q_lines = []
        opts = []
        for line in head.split("\n"):
            m = re.match(r"^\s*-\s*\[( |x)\]\s*(.*)$", line)
            if m:
                opts.append((m.group(1) == "x", m.group(2)))
            elif opts and line.strip() and line.startswith("    "):
                c, t = opts[-1]
                opts[-1] = (c, t + "\n" + line.strip())
            else:
                q_lines.append(line)
        explain = parts[0][1] if parts else ""
        self.stats["quizzes"] += 1
        L["quizzes"] = L.get("quizzes", 0) + 1
        letters = "ABCDEFG"
        oh = "".join(
            f'<button class="q-opt" data-c="{1 if c else 0}"><span class="l">{letters[k]}</span><span>{md(t)[3:-4] if md(t).startswith("<p>") and md(t).count("<p>") == 1 else md(t)}</span></button>'
            for k, (c, t) in enumerate(opts))
        exp = f'<div class="q-explain" hidden>{self.render_body(explain.strip(), L)}</div>' if explain.strip() else ""
        return f'<div class="quiz"><div class="q-tag">Kurztest</div><div class="q-text">{self.render_body(chr(10).join(q_lines).strip(), L)}</div><div class="q-opts">{oh}</div>{exp}</div>'

    def exam(self, attrs, body, L):
        task, parts = split_sections(body, ["solution"])
        sol = parts[0][1] if parts else ""
        self.stats["exams"] += 1
        L["exams"] = L.get("exams", 0) + 1
        pts = attrs.get("points")
        title = attrs.get("title", "Klausuraufgabe")
        ph = f'<span class="x-pts">{html.escape(pts)} {"Punkt" if pts == "1" else "Punkte"}</span>' if pts else ""
        return (f'<div class="exam"><div class="exam-head"><span class="x-tag">Klausuraufgabe</span><span class="x-title">{html.escape(title)}</span>{ph}</div>'
                f'<div class="exam-body">{self.render_body(task.strip(), L)}</div>'
                f'<div class="exam-sol"><div class="s-title">Musterlösung</div>{self.render_body(sol.strip(), L)}</div></div>')

    def bridge(self, attrs, body):
        rows = []
        for line in body.split("\n"):
            if not line.strip():
                continue
            if line.startswith(">>"):
                rows.append(f'<tr class="cmt"><td colspan="2" class="c">{md(line[2:].strip())[3:-4]}</td></tr>')
                continue
            if "||" not in line:
                raise SystemExit("Bridge row without ||: " + line)
            ps, py = line.split("||", 1)
            ps = ps.rstrip()
            py = py[1:] if py.startswith(" ") else py
            ps_code, ps_com = (ps.split("//", 1) + [None])[:2]
            ps_h = re.sub(PS_KW, r'\1<span class="kw">\2</span>', html.escape(ps_code))
            if ps_com is not None:
                ps_h += '<span class="tok-com">' + html.escape("//" + ps_com) + '</span>'
            py_code, py_com = (py.split("#", 1) + [None])[:2]
            py_h = re.sub(PY_KW, r'<span class="tok-kw">\1</span>', html.escape(py_code))
            if py_com is not None:
                py_h += '<span class="tok-com">' + html.escape("#" + py_com) + '</span>'
            rows.append(f'<tr><td class="ps pseudo">{ps_h}</td><td class="py">{py_h}</td></tr>')
        title = attrs.get("title")
        th = f'<div class="bridge-title">{html.escape(title)}</div>' if title else ""
        left = attrs.get("left", "Logik (Pseudocode)")
        right = attrs.get("right", "Python")
        return f'<div class="bridge">{th}<div class="bridge-head"><div>{html.escape(left)}</div><div>{html.escape(right)}</div></div><div class="bridge-rows"><table>{"".join(rows)}</table></div></div>'

    # ---------------------------------------------------------------- lessons
    def load_lesson(self, path):
        raw = open(path, encoding="utf-8").read()
        m = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.S)
        if not m:
            raise SystemExit("No front matter in " + path)
        meta = yaml.safe_load(m.group(1))
        body = m.group(2)
        L = {"id": str(meta["id"]), "num": str(meta["num"]), "part": str(meta["part"]), "title": meta["title"],
             "short": meta.get("short", meta["title"]), "lead": meta.get("lead", ""), "minutes": meta.get("minutes", 30),
             "uses": [str(u) for u in meta.get("uses", [])], "goals": [md(g)[3:-4] for g in meta.get("goals", [])],
             "exercises": [], "sort": meta.get("sort", 0)}
        L["html"] = self.render_headings(self.render_body(body, L))
        L.pop("_exn", None)
        return L

    def render_headings(self, h):
        used = set()

        def rep(m):
            inner = m.group(1)
            pm = re.match(r"^\[(\w+)\]\s*(.*)$", inner, re.S)
            phase = pm.group(1) if pm else ""
            title = pm.group(2) if pm else inner
            plain = re.sub("<[^>]+>", "", title)
            slug = re.sub(r"[^a-z0-9]+", "-", plain.lower()).strip("-")[:40] or "s"
            while slug in used:
                slug += "-x"
            used.add(slug)
            if phase:
                return (f'<h2 id="s-{slug}" class="phase phase-{phase}" data-phase="{phase}" data-title="{html.escape(plain)}">'
                        f'<span class="phase-tag">{PHASES.get(phase, phase)}</span><span>{title}</span></h2>')
            return f'<h2 id="s-{slug}" data-title="{html.escape(plain)}">{title}</h2>'
        return re.sub(r"<h2>(.*?)</h2>", rep, h, flags=re.S)

    def build(self):
        ldir = os.path.join(HERE, "lessons")
        files = sorted(f for f in os.listdir(ldir) if f.endswith(".md"))
        lessons = [self.load_lesson(os.path.join(ldir, f)) for f in files]
        parts = load_subjects()
        parts_by_id = {p["id"]: p for p in parts}
        for L in lessons:
            self.lessons[L["id"]] = L
            if L["part"] not in parts_by_id:
                raise SystemExit(f"Unknown part {L['part']!r} in lesson {L['id']}")
            parts_by_id[L["part"]]["lessons"].append(L["id"])
        for p in parts:
            p["lessons"].sort(key=lambda i: (self.lessons[i]["sort"], self.lessons[i]["num"]))
            self.order += p["lessons"]
        parts = [p for p in parts if p["lessons"]]
        for L in lessons:
            for u in L["uses"]:
                if u not in self.lessons:
                    print("WARN unknown 'uses' reference", u, "in", L["id"], file=sys.stderr)
        harness = open(os.path.join(HERE, "harness.py"), encoding="utf-8").read()
        course = {"parts": parts, "lessons": self.lessons, "order": self.order, "exercises": self.exercises,
                  "stats": self.stats, "harness": harness}
        os.makedirs(OUT, exist_ok=True)
        with open(os.path.join(OUT, "content.js"), "w", encoding="utf-8") as f:
            f.write("window.COURSE = " + json.dumps(course, ensure_ascii=False) + ";\n")
        os.makedirs(BUILD, exist_ok=True)
        with open(os.path.join(BUILD, "course.json"), "w", encoding="utf-8") as f:
            json.dump({"exercises": self.exercises, "traces": self.traces}, f, ensure_ascii=False)
        tpl = open(os.path.join(HERE, "index.template.html"), encoding="utf-8").read()
        cm_css = open(os.path.join(VENDOR, "codemirror.css"), encoding="utf-8").read()
        with open(os.path.join(OUT, "index.html"), "w", encoding="utf-8") as f:
            f.write(tpl.replace("/*__CM_CSS__*/", cm_css))
        for js in ("engine.js", "diagrams.js", "viz.js", "tracer.js"):
            with open(os.path.join(HERE, js), encoding="utf-8") as src, open(os.path.join(OUT, js), "w", encoding="utf-8") as dst:
                dst.write(src.read())
        os.makedirs(os.path.join(OUT, "lib", "codemirror"), exist_ok=True)
        for name in CM_FILES:
            shutil.copyfile(os.path.join(VENDOR, name), os.path.join(OUT, "lib", "codemirror", name))
        print(f"Built {len(self.lessons)} lessons, {len(self.exercises)} exercises, {self.stats['quizzes']} quizzes, {self.stats['exams']} exams.")


if __name__ == "__main__":
    Builder().build()
