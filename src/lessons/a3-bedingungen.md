---
id: a3
num: A3
part: A
title: Entscheidungen mit if, elif, else
short: Entscheidungen
lead: Programme müssen auf verschiedene Situationen verschieden reagieren. Jedes Rekursionsende und jeder Sonderfall einer Liste (leer? letztes Element?) ist ein if. Diese Lektion behandelt Bedingungen, das Struktogramm einer Verzweigung und wie Python Blöcke durch Einrückung markiert.
minutes: 45
uses: [a2]
goals:
  - Bedingungen mit Vergleichen und and / or / not formulieren
  - falls … dann … sonst … endefalls in if / else übersetzen und zurück
  - eine Verzweigung als Struktogramm zeichnen
  - elif für mehr als zwei Fälle verwenden und Blöcke richtig einrücken
  - die Kurzformen <code>if self.anfang:</code> und <code>if x is None:</code> aus deinen Kursvorlagen lesen
---

## [logic] Bedingungen sind Wahrheitswerte

Eine **Bedingung** ist ein Ausdruck, dessen Wert `True` (wahr) oder `False` (falsch) ist. Die meisten Bedingungen sind Vergleiche:

| Python | Bedeutung | Beispiel | Wert |
|---|---|---|---|
| `==` | gleich | `3 == 3` | `True` |
| `!=` | ungleich | `3 != 4` | `True` |
| `<` `>` | kleiner / größer | `5 < 2` | `False` |
| `<=` `>=` | kleiner gleich / größer gleich | `5 >= 5` | `True` |

Bedingungen lassen sich mit drei logischen Operatoren verknüpfen:

| Operator | Wahr, wenn … | Beispiel |
|---|---|---|
| `a and b` | **beide** wahr sind | `alter >= 14 and alter < 18` |
| `a or b` | **mindestens eine** wahr ist | `tag == "Sa" or tag == "So"` |
| `not a` | `a` falsch ist | `not besucht` |

:::diagram matrix caption="Wahrheitstafel für and / or"
{"corner": "a, b", "labels": ["a and b", "a or b"], "rowLabels": ["True, True", "True, False", "False, True", "False, False"], "m": [["True","True"],["False","True"],["False","True"],["False","False"]], "hl": [[0,0,"green"],[0,1,"green"],[1,1,"green"],[2,1,"green"]]}
:::

## [logic] Die Verzweigung: falls … dann … sonst

Eine **Verzweigung** (bedingte Anweisung) führt einen Block von Anweisungen *nur dann* aus, wenn eine Bedingung gilt, und sonst wahlweise einen anderen Block. Im Pseudocode deines Kurses:

```pseudo
falls alter >= 18 dann
    ausgeben "volljährig"
sonst
    ausgeben "minderjährig"
endefalls
```

Dasselbe als **Struktogramm** (Nassi-Shneiderman-Diagramm): Die Bedingung steht im Dreieck, die linke Spalte ist der *wahr*-Zweig, die rechte Spalte der *falsch*-Zweig.

:::diagram struktogramm caption="Eine zweiseitige Verzweigung als Struktogramm"
title Volljährigkeit prüfen
F: alter >= 18
  T:
    S: ausgeben "volljährig"
  E:
    S: ausgeben "minderjährig"
S: ausgeben "Ende"
:::

Genau einer der beiden Zweige läuft, nie beide und nie keiner. Nach der Verzweigung geht das Programm darunter weiter (`"Ende"` wird in jedem Fall ausgegeben).

## [bridge] Vom Pseudocode zu Python

:::bridge title="Die Verzweigung in beiden Schreibweisen"
falls alter >= 18 dann         || if alter >= 18:
    ausgeben "volljährig"      ||     print("volljährig")
sonst                          || else:
    ausgeben "minderjährig"    ||     print("minderjährig")
endefalls                      ||
ausgeben "Ende"                || print("Ende")
>> Aus `dann` wird ein **Doppelpunkt** `:`. Ein `endefalls` gibt es in Python nicht: Der Block endet dort, wo die **Einrückung** endet. `else` steht auf derselben Einrückung wie sein `if` und bekommt ebenfalls einen Doppelpunkt.
:::

## [python] Die Einrückung ist die Blockstruktur

In Python ist die **Einrückung** keine Verzierung. Sie entscheidet, welche Zeilen zum `if` gehören:

```python
if punkte >= 5:
    print("bestanden")       # gehört zum if
    print("Glückwunsch")     # gehört zum if
print("Auswertung fertig")   # läuft immer – nicht eingerückt
```

Regeln:

- nach `if …:` / `else:` kommt ein Doppelpunkt, und die nächsten Zeilen werden um **4 Leerzeichen** eingerückt (im Editor fügt <kbd>Tab</kbd> 4 Leerzeichen ein)
- alle Zeilen eines Blocks haben genau dieselbe Einrückung
- ein Block darf nicht leer sein; schreib `pass`, wenn du ihn vorerst leer lassen willst (das machen deine Vorlagen: `def KnotenBesuchen(...): pass`)

### Mehr als zwei Fälle: `elif`

`elif` (kurz für *else if*) fügt weitere Bedingungen hinzu. Python prüft sie **von oben nach unten** und führt den **ersten** Zweig aus, dessen Bedingung wahr ist; der Rest wird übersprungen.

```python
if punkte >= 13:
    note = 1
elif punkte >= 10:
    note = 2
elif punkte >= 7:
    note = 3
else:
    note = 4
```

Mit `punkte = 11` ist die erste Bedingung falsch, die zweite wahr → `note = 2`. Die dritte Bedingung (`11 >= 7`, auch wahr!) wird gar nicht mehr geprüft. Deshalb kommt es auf die Reihenfolge an.

### Zwei Kurzformen aus deinen Kursvorlagen

1. **`is None`**: Um zu prüfen, ob eine Variable *keinen Wert* hat, schreibt dein Kurs `if self.anfang is None:` (oder `is not None`). `is` prüft, ob etwas *genau dasselbe Objekt* wie `None` ist. Das brauchst du in Teil C ständig.

2. **Wahrheitswert von Objekten**: Python akzeptiert auch einen Nicht-bool-Wert als Bedingung. `None`, `0`, `""` und die leere Liste `[]` gelten als *falsch*; jedes Objekt und jede nicht leere Liste gilt als *wahr*. Das hier aus der Vorlage deiner Lehrkraft

   ```python
   if self.nachfolger:            # "falls es einen nachfolger gibt"
       self.nachfolger.HintenEinfügen(dneu)
   ```

   bedeutet also dasselbe wie `if self.nachfolger is not None:`. Beide Formen sind richtig; `is not None` sagt deutlicher, was gemeint ist.

:::warn
`if x = 5:` ist ein **SyntaxError**: In einer Bedingung brauchst du `==`. Und `if 0 < x < 10` funktioniert in Python, `if x > 0 and < 10` dagegen nicht: Jede Seite von `and` muss eine vollständige Bedingung sein: `x > 0 and x < 10`.
:::

:::quiz
Was wird bei `punkte = 7` ausgegeben?

```python
if punkte > 10:
    print("A")
elif punkte > 5:
    print("B")
elif punkte > 3:
    print("C")
else:
    print("D")
```
- [ ] `B` und `C`
- [x] `B`
- [ ] `C`
- [ ] `D`
--- explain
`7 > 10` ist falsch, `7 > 5` ist wahr → `B` wird ausgegeben, und die ganze if/elif-Kette ist fertig. `7 > 3` wird nie geprüft.
:::

## [python] Python-Blöcke

:::exercise id=a3-max3 title="Die größte von drei Zahlen" level=1
Speichere die größte der drei Zahlen `a`, `b`, `c` in der Variablen `groesste`. Verwende `if`/`elif`/`else`, **nicht** Pythons eingebautes `max`. Dein Code wird mit vielen Kombinationen geprüft, auch mit gleichen Zahlen.
--- starter
a = 7
b = 12
c = 5

groesste = a   # verbessere das
print(groesste)
--- solution
a = 7
b = 12
c = 5

if a >= b and a >= c:
    groesste = a
elif b >= c:
    groesste = b
else:
    groesste = c
print(groesste)
--- tests
@test("groesste von 7, 12, 5 ist 12")
def _():
    eq(groesste, 12, "groesste")

@test("Alle Reihenfolgen und gleiche Werte funktionieren")
def _():
    import itertools
    for vals in [(1, 2, 3), (5, 5, 1), (4, 4, 4), (-3, -7, -1), (9, 2, 9)]:
        for a2, b2, c2 in itertools.permutations(vals):
            ns, out = run_again(a=a2, b=b2, c=c2)
            eq(ns["groesste"], max(a2, b2, c2), f"groesste für a={a2}, b={b2}, c={c2}")

@test("max() wird nicht verwendet")
def _():
    ok("max(" not in SOURCE, "Bitte löse es mit if/elif/else statt mit max().")
--- hint
`a` ist die größte, wenn sie mindestens so groß wie `b` **und** mindestens so groß wie `c` ist.
--- hint
Wenn `a` nicht die größte ist, bleiben nur `b` und `c`: Ein weiterer Vergleich entscheidet.
--- explain
Die erste Bedingung vergleicht `a` mit beiden anderen. Wenn sie nicht zutrifft, ist die größte `b` oder `c`, und ein einziges `elif b >= c` entscheidet. Mit `>=` (statt `>`) funktionieren auch gleiche Werte.
:::

:::exercise id=a3-note title="Oberstufenpunkte in eine Note umrechnen" level=1
In der Oberstufe bekommst du 0–15 Punkte. Rechne `punkte` in die Note `note` (1–6) um:

| Punkte | 15–13 | 12–10 | 9–7 | 6–4 | 3–1 | 0 |
|---|---|---|---|---|---|---|
| Note | 1 | 2 | 3 | 4 | 5 | 6 |

Verwende eine einzige `if`/`elif`/`else`-Kette.
--- starter
punkte = 11

note = 0
print(note)
--- solution
punkte = 11

if punkte >= 13:
    note = 1
elif punkte >= 10:
    note = 2
elif punkte >= 7:
    note = 3
elif punkte >= 4:
    note = 4
elif punkte >= 1:
    note = 5
else:
    note = 6
print(note)
--- tests
@test("11 Punkte → Note 2")
def _():
    eq(note, 2, "note")

@test("Alle Werte von 0 bis 15")
def _():
    expected = {15: 1, 14: 1, 13: 1, 12: 2, 11: 2, 10: 2, 9: 3, 8: 3, 7: 3, 6: 4, 5: 4, 4: 4, 3: 5, 2: 5, 1: 5, 0: 6}
    for p, n in expected.items():
        ns, out = run_again(punkte=p)
        eq(ns["note"], n, f"note für {p} Punkte")
--- hint
Fang mit der besten Note an und arbeite dich nach unten: `if punkte >= 13:` … `elif punkte >= 10:` … Weil elif bei der ersten wahren Bedingung stoppt, brauchst du keine Obergrenzen.
--- explain
Weil von oben nach unten geprüft wird, läuft jedes `elif` nur, wenn alle vorherigen Bedingungen falsch waren. `punkte >= 10` bedeutet dort also schon `punkte <= 12`.
:::

:::exercise id=a3-leap title="Schaltjahr" level=2
Ein Jahr ist ein Schaltjahr, wenn es durch 4 teilbar ist, **außer** Jahre, die durch 100 teilbar sind; die sind nur dann Schaltjahre, wenn sie auch durch 400 teilbar sind. Setze `schaltjahr` auf `True` oder `False`.

Beispiele: 2024 ja, 2023 nein, 1900 nein, 2000 ja.
--- starter
jahr = 2024

schaltjahr = False
print(schaltjahr)
--- solution
jahr = 2024

if jahr % 400 == 0:
    schaltjahr = True
elif jahr % 100 == 0:
    schaltjahr = False
elif jahr % 4 == 0:
    schaltjahr = True
else:
    schaltjahr = False
print(schaltjahr)
--- tests
@test("2024 ist ein Schaltjahr")
def _():
    eq(schaltjahr, True, "schaltjahr")

@test("2023, 1900, 2000, 2100, 2400, 1996")
def _():
    for j, exp in [(2023, False), (1900, False), (2000, True), (2100, False), (2400, True), (1996, True)]:
        ns, out = run_again(jahr=j)
        eq(ns["schaltjahr"], exp, f"schaltjahr für {j}")
--- hint
„Durch 4 teilbar“ heißt `jahr % 4 == 0`.
--- hint
Prüf den speziellsten Fall zuerst: durch 400 teilbar → Schaltjahr. Dann durch 100 teilbar → keins. Dann durch 4 teilbar → ja.
--- explain
Eine Alternative in einer Zeile: `schaltjahr = jahr % 4 == 0 and (jahr % 100 != 0 or jahr % 400 == 0)`.
:::

:::exercise id=a3-ticket title="Eintrittspreis" level=2
Ein Museum verlangt:

- Kinder unter 6: frei (0 €)
- unter 18 **oder** Schüler (`ist_schueler` ist `True`) jeden Alters: 4 €
- alle anderen: 9 €, montags (`tag == "Mo"`) aber nur 6 €

Setze `preis` entsprechend.
--- starter
alter = 17
ist_schueler = False
tag = "Di"

preis = 9
print(preis)
--- solution
alter = 17
ist_schueler = False
tag = "Di"

if alter < 6:
    preis = 0
elif alter < 18 or ist_schueler:
    preis = 4
elif tag == "Mo":
    preis = 6
else:
    preis = 9
print(preis)
--- tests
@test("17 Jahre alt → 4 €")
def _():
    eq(preis, 4, "preis")

@test("Alle Fälle")
def _():
    cases = [((3, False, "Di"), 0), ((5, True, "Mo"), 0), ((17, False, "Mo"), 4), ((19, True, "Sa"), 4),
             ((30, False, "Di"), 9), ((30, False, "Mo"), 6), ((18, False, "So"), 9), ((6, False, "Di"), 4)]
    for (a, s, t), exp in cases:
        ns, out = run_again(alter=a, ist_schueler=s, tag=t)
        eq(ns["preis"], exp, f"preis für alter={a}, ist_schueler={s}, tag={t!r}")
--- hint
Ordne die Fälle so, dass der speziellste zuerst kommt: Freier Eintritt für kleine Kinder schlägt alles andere.
--- explain
`ist_schueler` ist bereits ein Wahrheitswert, `or ist_schueler` reicht also (`== True` ist nicht nötig).
:::

## [exam] Klausurtraining

::::exam title="Struktogramm für das Schaltjahr" points=4
Zeichne ein Struktogramm, das für ein gegebenes `jahr` die Variable `schaltjahr` setzt (Regeln wie im Python-Block oben).
--- solution
Eine mögliche Lösung mit verschachtelten Verzweigungen:

:::diagram struktogramm
F: jahr % 400 == 0
  T:
    S: schaltjahr = wahr
  E:
    F: jahr % 100 == 0
      T:
        S: schaltjahr = falsch
      E:
        F: jahr % 4 == 0
          T:
            S: schaltjahr = wahr
          E:
            S: schaltjahr = falsch
:::

Jedes `elif` wird zu einer Verzweigung, die im *falsch*-Zweig der vorherigen steckt.
::::
