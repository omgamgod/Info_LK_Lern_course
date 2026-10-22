---
id: a1
num: A1
part: A
title: Programme, Werte und Rechnen
short: Werte & Rechnen
lead: Was ein Programm ist, wie Python es ausführt, welche Arten von Werten es gibt und wie Python rechnet, einschließlich der beiden Operatoren // und %, die du für den ggT, das Sudoku und viele Listenaufgaben brauchst.
minutes: 40
uses: [start]
goals:
  - erklären, dass ein Programm Zeile für Zeile von oben nach unten abläuft
  - die Datentypen int, float, str, bool und None und ihre Kursnamen GANZZAHL, ZEICHENKETTE, WAHRHEITSWERT nennen
  - mit + - * / // % ** rechnen und Ergebnisse von Hand vorhersagen
  - Text und Zahlen mit str() verbinden
---

## [intro] Ein Programm ist eine Liste von Anweisungen

Ein **Programm** ist eine Folge von Anweisungen. Python führt sie **nacheinander von oben nach unten** aus, eine Zeile nach der anderen. Jede Zeile erledigt meist eine kleine Sache.

```python
print("Erste Zeile")
print(3 + 4)
print("Ende")
```

```out
Erste Zeile
7
Ende
```

Drei Dinge fallen auf:

1. `print(...)` schreibt etwas in die Ausgabe. Was zwischen den Klammern steht, wird **zuerst ausgewertet**: Aus `3 + 4` wird `7`, und dann wird `7` ausgegeben.
2. Text muss zwischen Anführungszeichen stehen: `"Erste Zeile"`. Ohne Anführungszeichen würde Python versuchen, `Erste` als Befehl oder Namen zu verstehen, und scheitern.
3. Die Reihenfolge zählt. Zeile 3 läuft erst, wenn die Zeilen 1 und 2 fertig sind.

Zeilen, die mit `#` beginnen, sind **Kommentare**. Python ignoriert sie; sie sind Notizen für Menschen:

```python
# Dieses Programm rechnet eine Summe aus.
print(17 + 25)   # ein Kommentar darf auch hinter Code stehen
```

## [logic] Werte und ihre Typen

Alles, womit ein Programm arbeitet, ist ein **Wert**. Jeder Wert hat einen **Datentyp**, der festlegt, was man mit ihm machen kann. Dein Kurs verwendet in Pseudocode und Klassendiagrammen eigene Namen für die Typen (`zahl1: GANZZAHL`). Hier stehen sie neben den Python-Namen:

| Art von Wert | Python-Typ | Kursname | Beispiele |
|---|---|---|---|
| ganze Zahl | `int` | **GANZZAHL** | `0`, `17`, `-3`, `2026` |
| Kommazahl | `float` | **KOMMAZAHL** | `3.5`, `0.7071`, `-2.0` (Python schreibt einen **Punkt**, kein Komma) |
| Text | `str` (String) | **ZEICHENKETTE** | `"Andi"`, `'M'`, `""` (leerer Text) |
| Wahrheitswert | `bool` | **WAHRHEITSWERT** | `True`, `False` (großer Anfangsbuchstabe!) |
| „nichts“ | `NoneType` | (kein Wert / leer) | `None` |

`None` ist besonders: Es bedeutet *hier gibt es keinen Wert*. In Teil C wird es sehr wichtig, denn dort markiert `None` das Ende einer Liste (`nachfolger = None`) oder eine leere Warteschlange (`anfang = None`).

Mit `type(...)` kannst du Python nach dem Typ jedes Werts fragen:

```python
print(type(17))        # <class 'int'>
print(type(17.0))      # <class 'float'>
print(type("17"))      # <class 'str'>   – Text, keine Zahl!
print(type(True))      # <class 'bool'>
print(type(None))      # <class 'NoneType'>
```

:::warn
`17` und `"17"` sind völlig verschiedene Werte. `17` ist eine Zahl, mit der man rechnen kann; `"17"` ist Text aus den beiden Zeichen `1` und `7`. `"17" + 1` ergibt einen Fehler, `17 + 1` dagegen `18`.
:::

## [logic] Rechnen

Python kennt diese Rechenoperatoren:

| Operator | Bedeutung | Beispiel | Ergebnis |
|---|---|---|---|
| `+` | plus | `7 + 3` | `10` |
| `-` | minus | `7 - 3` | `4` |
| `*` | mal | `7 * 3` | `21` |
| `/` | geteilt (liefert immer einen `float`) | `7 / 2` | `3.5` |
| `//` | **ganzzahlige Division** (rundet ab) | `7 // 2` | `3` |
| `%` | **Rest** der Division (Modulo) | `7 % 2` | `1` |
| `**` | hoch (Potenz) | `2 ** 10` | `1024` |

Es gelten die üblichen Vorrangregeln: `**` vor `*` `/` `//` `%` vor `+` `-`. Klammern `( )` kommen zuerst: `(2 + 3) * 4` ist `20`, aber `2 + 3 * 4` ist `14`.

### Die zwei wichtigsten: `//` und `%`

Stell dir vor, du verteilst 17 Bonbons gerecht an 5 Kinder. Jedes Kind bekommt **3** Bonbons, und **2** bleiben übrig:

- `17 // 5` ist `3`: wie oft 5 ganz in 17 passt
- `17 % 5` ist `2`: was übrig bleibt

Die beiden gehören immer zusammen: `17 == 5 * (17 // 5) + 17 % 5`, also 17 = 5·3 + 2.

Diese beiden Operatoren tauchen im ganzen Kurs auf:

| Aufgabe | Wie | Wo du es brauchst |
|---|---|---|
| Ist `n` gerade? | `n % 2 == 0` | Bedingungen, Tests |
| Letzte Ziffer von `n` | `n % 10` (z. B. ist `4711 % 10` gleich `1`) | Rekursion über Ziffern (B1) |
| `n` ohne letzte Ziffer | `n // 10` (z. B. ist `4711 // 10` gleich `471`) | Rekursion über Ziffern (B1) |
| ggT nach Euklid | `GGTBerechnen(zahl2, zahl1 % zahl2)` | B1 (aus deinem Arbeitsblatt 12_I_1_Aufgabe_6) |
| Anfang eines 3×3-Sudoku-Blocks | `zeile // 3 * 3` | B2 Sudoku |
| Sekunden → Minuten und Sekunden | `t // 60` und `t % 60` | Python-Block unten |

:::diagram matrix caption="zeile // 3 * 3 ordnet jeder Zeilennummer die erste Zeile ihres 3×3-Blocks zu"
{"corner": "zeile", "labels": ["0","1","2","3","4","5","6","7","8"], "rowLabels": ["zeile // 3", "zeile // 3 * 3"], "m": [[0,0,0,1,1,1,2,2,2],[0,0,0,3,3,3,6,6,6]], "hlRows": [1]}
:::

:::quiz
Was gibt Python bei `print(17 // 5, 17 % 5)` aus?
- [ ] `3.4 0`
- [x] `3 2`
- [ ] `3 0.4`
- [ ] `2 3`
--- explain
`17 // 5` ist der ganzzahlige Teil der Division (3), `17 % 5` der Rest (2). Probe: 5·3 + 2 = 17.
:::

:::quiz
Welchen Wert hat `zeile // 3 * 3` für `zeile = 7`?
- [ ] `7`
- [ ] `2`
- [x] `6`
- [ ] `21`
--- explain
`//` und `*` haben denselben Vorrang und werden von links nach rechts ausgewertet: `7 // 3` ist `2`, und `2 * 3` ist `6`. Zeile 7 gehört zu dem 3×3-Block, der bei Zeile 6 beginnt.
:::

## [python] Text (Strings)

Textwerte heißen **Strings** (`str`). Mit `+` kannst du Strings aneinanderhängen:

```python
vorname = "Ada"
print("Hallo " + vorname + "!")      # Hallo Ada!
print(len("Informatik"))             # 10  – Anzahl der Zeichen
```

Einen String und eine Zahl kann man nicht direkt aneinanderhängen. Wandle die Zahl vorher mit `str(...)` in Text um:

```python
alter = 17
print("Alter: " + str(alter))        # Alter: 17
```

Die andere Richtung gibt es auch: `int("42")` macht aus Text eine ganze Zahl, `float("3.5")` eine Kommazahl.

:::warn
`print("Alter: " + alter)` bricht ab mit **TypeError: can only concatenate str (not "int") to str**: Python weigert sich, eine Zahl an einen Text zu hängen. Nimm `str(alter)`.

Eine andere Möglichkeit: `print("Alter:", alter)`. Wenn du `print` mehrere Werte mit Kommas getrennt gibst, gibt es sie mit einem Leerzeichen dazwischen aus und wandelt Zahlen automatisch um.
:::

Es gibt auch eine sehr gut lesbare Kurzform, den **f-String**: Schreib ein `f` vor die Anführungszeichen und Werte in geschweifte Klammern.

```python
name = "Bert"
alter = 17
print(f"{name} ist {alter} Jahre alt.")   # Bert ist 17 Jahre alt.
```

Die Vorlagen deiner Lehrkraft verwenden meist `+` und `str(...)`. Beides ist richtig.

## [python] Python-Blöcke

Die Blöcke verwenden **Variablen** (`sekunden = 7384`). Wie Variablen genau funktionieren, lernst du in der nächsten Lektion; lies `x = 5` vorerst als *„x steht jetzt für den Wert 5“*.

:::exercise id=a1-time title="Sekunden in Stunden, Minuten, Sekunden" level=1
Eine Sport-App misst einen Lauf in Sekunden: `sekunden = 7384`. Berechne:

- `stunden`: die ganzen Stunden
- `minuten`: die ganzen Minuten, die nach den Stunden übrig bleiben
- `rest`: die Sekunden, die danach noch übrig bleiben

Verwende nur `//` und `%` und **tipp die Ergebnisse nicht selbst ein**: Die Prüfungen führen dein Programm noch einmal mit anderen Werten für `sekunden` aus. Gib am Ende zum Beispiel `2 h 3 min 4 s` aus.
--- starter
sekunden = 7384

stunden = 0   # ersetze 0 durch eine Rechnung
minuten = 0
rest = 0

print(str(stunden) + " h " + str(minuten) + " min " + str(rest) + " s")
--- solution
sekunden = 7384

stunden = sekunden // 3600
minuten = sekunden % 3600 // 60
rest = sekunden % 60

print(str(stunden) + " h " + str(minuten) + " min " + str(rest) + " s")
--- tests
@test("7384 Sekunden sind 2 h 3 min 4 s")
def _():
    eq((stunden, minuten, rest), (2, 3, 4), "(stunden, minuten, rest)")

@test("Es funktioniert auch für andere Werte (59, 60, 3600, 86399)")
def _():
    for s, exp in [(59, (0, 0, 59)), (60, (0, 1, 0)), (3600, (1, 0, 0)), (86399, (23, 59, 59))]:
        ns, out = run_again(sekunden=s)
        eq((ns["stunden"], ns["minuten"], ns["rest"]), exp, f"für sekunden = {s}: (stunden, minuten, rest)")

@test("Das Programm gibt das Ergebnis aus")
def _():
    ok("2 h 3 min 4 s" in OUTPUT, "Die Ausgabe sollte enthalten: 2 h 3 min 4 s")
--- hint
Eine Stunde hat 3600 Sekunden, also liefert `sekunden // 3600` die ganzen Stunden.
--- hint
Die Sekunden, die nach den Stunden übrig sind, sind `sekunden % 3600`. Wie viele ganze Minuten passen da hinein?
--- explain
`sekunden // 3600` zählt die ganzen Stunden. `sekunden % 3600` ist das, was nach dem Abziehen der Stunden übrig bleibt; `// 60` davon ergibt die Minuten. Der letzte Rest ist einfach `sekunden % 60`, denn ganze Stunden und ganze Minuten sind beide Vielfache von 60.
:::

:::exercise id=a1-digits title="Eine Zahl zerlegen" level=1
Gegeben ist `zahl = 4711`. Berechne

- `letzte_ziffer`: die letzte Ziffer (hier `1`)
- `ohne_letzte`: die Zahl ohne ihre letzte Ziffer (hier `471`)
- `ist_gerade`: `True`, wenn `zahl` gerade ist, sonst `False`

Jedes davon braucht nur **einen** Operator. Dein Programm wird auch mit anderen Zahlen geprüft.
--- starter
zahl = 4711

letzte_ziffer = 0
ohne_letzte = 0
ist_gerade = False
--- solution
zahl = 4711

letzte_ziffer = zahl % 10
ohne_letzte = zahl // 10
ist_gerade = zahl % 2 == 0
--- tests
@test("letzte_ziffer von 4711 ist 1")
def _():
    eq(letzte_ziffer, 1, "letzte_ziffer")

@test("ohne_letzte von 4711 ist 471")
def _():
    eq(ohne_letzte, 471, "ohne_letzte")

@test("ist_gerade von 4711 ist False")
def _():
    eq(ist_gerade, False, "ist_gerade")

@test("Funktioniert für 2026, 8 und 90")
def _():
    for z, exp in [(2026, (6, 202, True)), (8, (8, 0, True)), (90, (0, 9, True)), (35, (5, 3, False))]:
        ns, out = run_again(zahl=z)
        eq((ns["letzte_ziffer"], ns["ohne_letzte"], ns["ist_gerade"]), exp, f"für zahl = {z}")
--- hint
Teilen durch 10 schiebt jede Ziffer eine Stelle nach rechts. Die ganzzahlige Division wirft weg, was herausfällt; der Rest ist genau diese Ziffer.
--- hint
Eine Zahl ist gerade, wenn beim Teilen durch 2 kein Rest bleibt. Ein Vergleich wie `x == 0` **ist** bereits ein Wahrheitswert (`True`/`False`), du brauchst also kein `if`.
--- explain
`% 10` liefert die letzte Ziffer, `// 10` entfernt sie. `zahl % 2 == 0` vergleicht den Rest mit 0; das Ergebnis eines Vergleichs ist ein `bool` und kann direkt gespeichert werden.
:::

:::exercise id=a1-text title="Text und Zahlen zusammen" level=1
Bilde aus den Variablen `name` und `alter` den Satz `Andi ist 17 Jahre alt.` und speichere ihn in der Variablen `satz`. Gib dann `satz` aus.

Die Prüfungen probieren auch andere Namen und Alter aus.
--- starter
name = "Andi"
alter = 17

satz = name + " ist " + alter + " Jahre alt."
print(satz)
--- solution
name = "Andi"
alter = 17

satz = name + " ist " + str(alter) + " Jahre alt."
print(satz)
--- tests
@test("satz ist 'Andi ist 17 Jahre alt.'")
def _():
    eq(satz, "Andi ist 17 Jahre alt.", "satz")

@test("Funktioniert für andere Werte")
def _():
    ns, out = run_again(name="Clara", alter=18)
    eq(ns["satz"], "Clara ist 18 Jahre alt.", "satz für Clara, 18")
--- hint
Führ zuerst den Startcode aus und lies die Fehlermeldung. Welcher Wert hat den falschen Typ?
--- explain
`alter` ist ein `int`. `+` zwischen einem String und einem int ist nicht erlaubt, deshalb muss es zuerst mit `str(alter)` umgewandelt werden.
:::

:::exercise id=a1-sudoku title="Welcher 3×3-Block?" level=2
Im Sudoku gehört jede Zelle `(zeile, spalte)` zu einem 3×3-Block. Berechne die Zeile und die Spalte, in der dieser Block **beginnt**, und speichere sie in `start_zeile` und `start_spalte`.

Beispiel: Die Zelle `(7, 4)` gehört zu dem Block, der bei `(6, 3)` beginnt. Genau diese Formel verwendest du in Lektion B2.
--- starter
zeile = 7
spalte = 4

start_zeile = 0
start_spalte = 0
print(start_zeile, start_spalte)
--- solution
zeile = 7
spalte = 4

start_zeile = zeile // 3 * 3
start_spalte = spalte // 3 * 3
print(start_zeile, start_spalte)
--- tests
@test("(7, 4) beginnt ihren Block bei (6, 3)")
def _():
    eq((start_zeile, start_spalte), (6, 3), "(start_zeile, start_spalte)")

@test("Funktioniert für alle 81 Zellen")
def _():
    for z in range(9):
        for s in range(9):
            ns, out = run_again(zeile=z, spalte=s)
            eq((ns["start_zeile"], ns["start_spalte"]), (z - z % 3, s - s % 3), f"für Zelle ({z}, {s})")
--- hint
Schau dir die Tabelle im Logik-Abschnitt an: `zeile // 3` sagt dir, *welcher* Block es ist (0, 1 oder 2). Wie kommst du von der Blocknummer zu seiner ersten Zeile?
--- explain
`zeile // 3` ist die Nummer des Blocks (0, 1 oder 2); mal 3 ergibt die erste Zeile dieses Blocks. Für die Spalte genauso. Gleichwertig ist `zeile - zeile % 3`.
:::

## [exam] Klausurtraining

:::exam title="Ausdrücke von Hand auswerten" points=6
Ohne Computer: Gib den Wert **und** den Typ jedes Ausdrucks an.

1. `23 // 4`
2. `23 % 4`
3. `23 / 4`
4. `2 + 3 * 4 % 5`
5. `"3" + "4"`
6. `str(3 + 4) + "4"`
--- solution
| Ausdruck | Wert | Typ |
|---|---|---|
| `23 // 4` | `5` | int |
| `23 % 4` | `3` | int (23 = 4·5 + 3) |
| `23 / 4` | `5.75` | float (`/` liefert immer einen float) |
| `2 + 3 * 4 % 5` | `4` (zuerst `3*4 = 12`, dann `12 % 5 = 2`, dann `2 + 2`) | int |
| `"3" + "4"` | `"34"` (Text wird aneinandergehängt, nicht addiert) | str |
| `str(3 + 4) + "4"` | `"74"` | str |
:::
