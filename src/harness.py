
# Harness that runs learner code inside the course page (Pyodide) and in the
# offline validator (CPython). Everything the page needs from Python lives here.
import sys, io, json, builtins, contextlib, traceback, linecache

_USER = "<dein Code>"
_TESTS = "<tests>"
_STEP_LIMIT = 5_000_000
_REC_LIMIT = 400


class _StepLimit(BaseException):
    pass


class _Fail(Exception):
    pass


class _OutputLimit(BaseException):
    pass


class _Out(io.StringIO):
    """stdout replacement that stops programs printing endlessly."""
    LIMIT = 60000

    def write(self, s):
        if self.tell() > self.LIMIT:
            raise _OutputLimit()
        return super().write(s)


def _no_input(*args, **kwargs):
    raise RuntimeError("input() ist im Kurs-Editor nicht verfügbar. Schreib die Werte stattdessen direkt in deinen Code.")


builtins.input = _no_input


def _make_counter(limit):
    count = [0]

    def local(frame, event, arg):
        if event == "line":
            count[0] += 1
            if count[0] > limit:
                raise _StepLimit()
        return local

    def glob(frame, event, arg):
        if frame.f_code.co_filename == _USER:
            return local
        return None

    return glob


def _fmt_exc(e):
    tb = e.__traceback__
    frames = [f for f in traceback.extract_tb(tb) if f.filename == _USER]
    info = {"type": type(e).__name__, "msg": str(e)}
    if frames:
        info["line"] = frames[-1].lineno
        info["trace"] = [[f.lineno, f.name, (f.line or "").strip()] for f in frames[-6:]]
    if isinstance(e, SyntaxError):
        info["msg"] = e.msg
        info["line"] = e.lineno
        info["col"] = e.offset
        info["text"] = (e.text or "").rstrip("\n")
    return info


# ---------------------------------------------------------------- test helpers
def _short(v):
    r = repr(v)
    return r if len(r) <= 160 else r[:157] + "..."


def eq(actual, expected, what="Ergebnis"):
    if actual != expected:
        raise _Fail(f"{what}: erwartet {_short(expected)}, erhalten {_short(actual)}")


def ok(condition, message):
    if not condition:
        raise _Fail(message)


def printed(fn):
    """Runs fn() and returns everything it printed (str)."""
    buf = _Out()
    with contextlib.redirect_stdout(buf):
        fn()
    return buf.getvalue()


def lines(text):
    return [l.rstrip() for l in text.strip("\n").split("\n")] if text.strip() else []


def recursive(fn, *args, **kwargs):
    """Calls fn(*args) and reports whether the *same* function code was active
    twice at the same time (= real recursion). Returns (result, used_recursion)."""
    code = getattr(fn, "__code__", None) or getattr(getattr(fn, "__func__", None), "__code__", None)
    depth = [0]
    maxdepth = [0]
    old = sys.gettrace()

    def tracer(frame, event, arg):
        if frame.f_code is code:
            depth[0] += 1
            maxdepth[0] = max(maxdepth[0], depth[0])

            def local(fr, ev, a):
                if ev == "return":
                    depth[0] -= 1
                return local
            return local
        return old(frame, event, arg) if old else None

    sys.settrace(tracer)
    try:
        result = fn(*args, **kwargs)
    finally:
        sys.settrace(old)
    return result, maxdepth[0] >= 2


def max_depth_of(code_objects, fn):
    """Runs fn() and returns how deep frames of the given code objects were nested."""
    codes = set(code_objects)
    depth = [0]
    maxdepth = [0]
    old = sys.gettrace()

    def tracer(frame, event, arg):
        if frame.f_code in codes:
            depth[0] += 1
            maxdepth[0] = max(maxdepth[0], depth[0])

            def local(fr, ev, a):
                if ev == "return":
                    depth[0] -= 1
                return local
            return local
        return old(frame, event, arg) if old else None

    sys.settrace(tracer)
    try:
        fn()
    finally:
        sys.settrace(old)
    return maxdepth[0]


def has_method(cls, name):
    return callable(getattr(cls, name, None))


# ---------------------------------------------------------------- runner
def _exec_user(code, ns, out):
    compiled = compile(code, _USER, "exec")
    old_rec = sys.getrecursionlimit()
    sys.setrecursionlimit(_REC_LIMIT)
    sys.settrace(_make_counter(_STEP_LIMIT))
    try:
        with contextlib.redirect_stdout(out):
            exec(compiled, ns)
    finally:
        sys.settrace(None)
        sys.setrecursionlimit(old_rec)


def _error_for(e):
    if isinstance(e, _OutputLimit):
        return {"type": "StepLimit", "msg": "Dein Programm hat mehr als 60.000 Zeichen ausgegeben und wurde gestoppt. Höchstwahrscheinlich eine Endlosschleife, die in jedem Durchlauf etwas ausgibt."}
    if isinstance(e, _StepLimit):
        return {"type": "StepLimit", "msg": "Dein Programm ist mehr als 5 Millionen Schritte gelaufen und wurde gestoppt. Höchstwahrscheinlich eine Endlosschleife oder eine Rekursion, die ihr Rekursionsende nie erreicht."}
    if isinstance(e, RecursionError):
        info = _fmt_exc(e)
        info["type"] = "RecursionError"
        tr = info.get("trace") or []
        if len(tr) >= 2:
            info["line"] = tr[-2][0]
        return info
    return _fmt_exc(e)


def _register(code):
    linecache.cache[_USER] = (len(code), None, code.splitlines(True), _USER)


def run_code(code, tests_code="", mode="run"):
    _register(code)
    res = {"stdout": "", "error": None, "tests": None}
    out = _Out()
    ns = {"__name__": "__main__"}
    try:
        compile(code, _USER, "exec")
    except SyntaxError as e:
        res["error"] = _fmt_exc(e)
        return json.dumps(res)
    try:
        _exec_user(code, ns, out)
    except BaseException as e:  # noqa
        res["error"] = _error_for(e)
    res["stdout"] = out.getvalue()[:30000]
    if mode != "check" or not tests_code.strip():
        return json.dumps(res)
    if res["error"]:
        res["tests"] = []
        return json.dumps(res)
    res["tests"] = _run_tests(tests_code, ns, code, res["stdout"])
    return json.dumps(res)


def _run_tests(tests_code, ns, source, output=""):
    registry = []

    def test(name):
        def deco(fn):
            registry.append((name, fn))
            return fn
        return deco

    tns = dict(ns)
    tns.update(test=test, eq=eq, ok=ok, printed=printed, lines=lines, recursive=recursive,
               max_depth_of=max_depth_of, has_method=has_method, SOURCE=source, OUTPUT=output, Fail=_Fail,
               run_again=lambda **values: _run_again(source, values))
    try:
        exec(compile(tests_code, _TESTS, "exec"), tns)
    except BaseException as e:  # noqa
        return [{"name": "Vorbereitung der Prüfungen", "status": "error",
                 "msg": f"{type(e).__name__}: {e}", "exc": _fmt_exc(e)}]
    results = []
    for name, fn in registry:
        old_rec = sys.getrecursionlimit()
        sys.setrecursionlimit(_REC_LIMIT)
        sys.settrace(_make_counter(_STEP_LIMIT))
        buf = _Out()
        try:
            with contextlib.redirect_stdout(buf):
                fn()
            results.append({"name": name, "status": "pass"})
        except _Fail as f:
            results.append({"name": name, "status": "fail", "msg": str(f)})
        except BaseException as e:  # noqa
            err = _error_for(e)
            results.append({"name": name, "status": "error", "msg": f"{err['type']}: {err.get('msg', '')}", "exc": err})
        finally:
            sys.settrace(None)
            sys.setrecursionlimit(old_rec)
    return results


def _run_again(source, values):
    """Runs the learner's program again with different start values for the given
    top-level variables (the first assignment of each name is replaced). Returns (namespace, output)."""
    lines = source.split("\n")
    done = set()
    for i, line in enumerate(lines):
        for name, value in values.items():
            if name in done:
                continue
            if line.startswith(name + " =") or line.startswith(name + "="):
                lines[i] = f"{name} = {value!r}"
                done.add(name)
    missing = set(values) - done
    if missing:
        raise _Fail("Behalte die vorgegebene(n) Startzeile(n) bei für: " + ", ".join(sorted(missing)))
    ns = {"__name__": "__main__"}
    out = _Out()
    old = sys.gettrace()
    with contextlib.redirect_stdout(out):
        exec(compile("\n".join(lines), _USER, "exec"), ns)
    return ns, out.getvalue()


# ---------------------------------------------------------------- step visualizer
def _enc(v, heap, budget):
    if v is None or isinstance(v, (bool, int, float)):
        return ["p", repr(v)]
    if isinstance(v, str):
        r = repr(v)
        return ["p", r if len(r) <= 40 else r[:37] + "...'"]
    t = type(v)
    if isinstance(v, type):
        return ["f", "class " + v.__name__]
    if callable(v) and not hasattr(v, "__dict__") or t.__name__ in ("function", "method", "builtin_function_or_method", "module"):
        return ["f", getattr(v, "__name__", t.__name__)]
    key = str(id(v))
    if key in heap:
        return ["r", key]
    if len(heap) >= budget[0]:
        return ["p", "…"]
    heap[key] = None
    if isinstance(v, (list, tuple)):
        heap[key] = {"t": "list" if isinstance(v, list) else "tuple",
                     "items": [_enc(x, heap, budget) for x in list(v)[:30]], "more": max(0, len(v) - 30)}
    elif isinstance(v, dict):
        heap[key] = {"t": "dict", "items": [[_enc(k, heap, budget), _enc(x, heap, budget)] for k, x in list(v.items())[:20]]}
    elif hasattr(v, "__dict__"):
        heap[key] = {"t": "obj", "cls": t.__name__,
                     "fields": [[k, _enc(x, heap, budget)] for k, x in v.__dict__.items() if not k.startswith("__")]}
    else:
        heap[key] = {"t": "other", "repr": repr(v)[:60]}
    return ["r", key]


def trace_code(code, max_steps=500):
    _register(code)
    res = {"steps": [], "error": None, "truncated": False}
    try:
        compiled = compile(code, _USER, "exec")
    except SyntaxError as e:
        res["error"] = _fmt_exc(e)
        return json.dumps(res)
    out = _Out()
    ns = {"__name__": "__main__"}
    steps = res["steps"]

    def snapshot(frame, event, arg):
        chain = []
        f = frame
        while f is not None:
            if f.f_code.co_filename == _USER:
                chain.append(f)
            f = f.f_back
        chain.reverse()
        heap = {}
        budget = [70]
        frames = []
        for fr in chain:
            name = fr.f_code.co_name
            if name == "<module>":
                items = [(k, v) for k, v in fr.f_globals.items()
                         if not k.startswith("__") and type(v).__name__ not in ("module", "function", "type", "ABCMeta")]
                name = "Global"
            else:
                items = [(k, v) for k, v in fr.f_locals.items() if not k.startswith("__")]
            frames.append({"name": name, "vars": [[k, _enc(v, heap, budget)] for k, v in items]})
        step = {"line": frame.f_lineno, "ev": event, "frames": frames, "heap": heap, "out": out.getvalue()[-4000:]}
        if event == "return":
            step["ret"] = _enc(arg, heap, budget)
        if event == "exception":
            step["exc"] = f"{arg[0].__name__}: {arg[1]}"
        steps.append(step)
        if len(steps) >= max_steps:
            raise _StepLimit()

    def local(frame, event, arg):
        if event in ("line", "return", "exception"):
            snapshot(frame, event, arg)
        return local

    def glob(frame, event, arg):
        if frame.f_code.co_filename != _USER:
            return None
        if frame.f_code.co_name != "<module>":
            snapshot(frame, "call", arg)
        return local

    old_rec = sys.getrecursionlimit()
    sys.setrecursionlimit(_REC_LIMIT)
    sys.settrace(glob)
    try:
        with contextlib.redirect_stdout(out):
            exec(compiled, ns)
    except (_StepLimit, _OutputLimit):
        res["truncated"] = True
    except BaseException as e:  # noqa
        res["error"] = _error_for(e)
    finally:
        sys.settrace(None)
        sys.setrecursionlimit(old_rec)
    res["finalOut"] = out.getvalue()[-6000:]
    return json.dumps(res)
