#!/usr/bin/env python3
"""Runs every model solution against its tests (must pass) and every starter (must not pass)."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import harness  # noqa
data = json.load(open(os.path.join(os.path.dirname(HERE), ".build", "course.json"), encoding="utf-8"))  # written by build.py
bad = 0
only = sys.argv[1:]
for eid, ex in data["exercises"].items():
    if only and not any(eid.startswith(o) for o in only):
        continue
    r = json.loads(harness.run_code(ex["solution"], ex["tests"], "check"))
    if r["error"] or not r["tests"] or any(t["status"] != "pass" for t in r["tests"]):
        bad += 1
        print(f"FAIL solution {eid}: error={r['error']}")
        for t in r["tests"] or []:
            if t["status"] != "pass":
                print("   ", t)
    s = json.loads(harness.run_code(ex["starter"], ex["tests"], "check"))
    if s["tests"] and all(t["status"] == "pass" for t in s["tests"]) and not s["error"]:
        bad += 1
        print(f"WARN starter passes all tests: {eid}")
    if r["stdout"] and len(r["stdout"]) > 3000:
        print(f"NOTE long output in {eid}")
for lid, code in data["traces"]:
    if only and not any(lid.startswith(o) for o in only):
        continue
    t = json.loads(harness.trace_code(code))
    if t["error"]:
        bad += 1
        print(f"FAIL trace in {lid}: {t['error']}")
    if t["truncated"]:
        print(f"NOTE trace truncated in {lid} ({len(t['steps'])} steps)")
print("problems:", bad, "| exercises:", len(data["exercises"]), "| traces:", len(data["traces"]))
