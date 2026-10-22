---
id: a2
num: A2
part: A
title: Variablen
short: Variablen
lead: Variablen geben Werten Namen. Genau zu verstehen, was = tut, ist die Grundlage für alles Weitere, besonders für die Pfeile (Referenzen), auf denen das ganze Listenkapitel aufbaut.
minutes: 35
uses: [a1]
goals:
  - Zuweisungen wie <code>x = x + 1</code> richtig lesen und schreiben
  - ein Programm in einer Ablauftabelle nachvollziehen
  - die Werte zweier Variablen vertauschen
  - NameError und Fehler bei Groß-/Kleinschreibung erkennen und beheben
---

## [logic] Ein Name für einen Wert

Eine **Variable** ist ein Name, der auf einen Wert verweist. Die Zeile

```python
alter = 17
```

bedeutet: *Erzeuge den Wert 17 und häng den Namen `alter` daran*. Ab jetzt verwendet Python jedes Mal, wenn es `alter` liest, den Wert 17.

Ein gutes Bild ist ein **Namensschild mit Pfeil**: Auf der einen Seite steht der Name, auf der anderen der Wert, und der Pfeil verbindet beide. Bei Zahlen und Texten kannst du dir genauso gut eine Schachtel mit der Aufschrift `alter` vorstellen, in der 17 liegt. Das Pfeilbild wird in Lektion A8 unverzichtbar, wenn die Werte Objekte sind.

:::diagram objects caption="Drei Variablen: Jeder Name zeigt auf seinen Wert"
var alter = 17 @0,0
var name = "Andi" @0,0.35
var ist_schueler = True @0,0.7
:::

### `=` ist eine Anweisung, keine Gleichung

In der Mathematik ist `x = x + 1` Unsinn. In Python ist es eine der häufigsten Zeilen, denn `=` bedeutet **Zuweisung**:

1. Zuerst wird die **rechte Seite** mit den aktuellen Werten ausgewertet: `x + 1`.
2. Dann wird der Name auf der **linken Seite** an das Ergebnis gehängt.

`x = x + 1` heißt also *„das neue x ist das alte x plus eins“*. Python hat dafür auch eine Kurzform: `x += 1` macht genau dasselbe; `x -= 2`, `x *= 3` funktionieren entsprechend.

Um zwei Werte zu **vergleichen**, verwendet Python `==` (zwei Gleichheitszeichen). `x == 5` fragt *„ist x gleich 5?“* und liefert `True` oder `False`. `=` und `==` zu verwechseln ist einer der häufigsten Anfängerfehler.

### Ein Programm nachvollziehen: die Ablauftabelle

Um zu verstehen, was ein Programm tut, gehst du es Schritt für Schritt durch und notierst nach jeder Zeile den Wert jeder Variablen. Diese **Ablauftabelle** (Belegungstabelle) ist auch eine typische Klausuraufgabe.

```python
a = 3
b = a + 2
a = a * b
b = b - 1
```

| nach Zeile | `a` | `b` |
|---|---|---|
| 1 | 3 | – |
| 2 | 3 | 5 |
| 3 | 15 | 5 |
| 4 | 15 | 4 |

Zeile 3 verwendet die *aktuellen* Werte: `a * b` ist `3 * 5`. Zeile 2 hat den Wert von `a` in genau diesem Moment kopiert; wenn sich `a` später ändert, bleibt `b` davon unberührt.

:::quiz
Welchen Wert hat `b` nach diesen drei Zeilen?

```python
a = 3
b = a
a = 5
```
- [x] `3`
- [ ] `5`
- [ ] `8`
- [ ] einen Fehler, weil sich `a` geändert hat
--- explain
`b = a` gibt `b` den Wert, den `a` in diesem Moment hatte, also 3. Wenn `a` danach einen neuen Wert bekommt, wird nur der Name `a` umgehängt; `b` zeigt weiter auf 3.
:::

### Zwei Werte vertauschen

Beim Vertauschen von `a` und `b` muss man aufpassen. So funktioniert es **nicht**:

```python
a = 1
b = 2
a = b     # a ist 2 – der alte Wert 1 ist verloren!
b = a     # b ist auch 2
```

Die klassische Lösung verwendet eine **Hilfsvariable**, die sich den alten Wert merkt:

```python
hilf = a
a = b
b = hilf
```

Python hat auch eine Kurzform, die du beim iterativen ggT sehen wirst: `a, b = b, a`. Python wertet zuerst die ganze rechte Seite aus (beide alten Werte) und weist sie dann zu.

:::trace title="Vertauschen mit Hilfsvariable"
a = 1
b = 2
hilf = a
a = b
b = hilf
print(a, b)
:::

## [python] Namen in Python

Regeln für Variablennamen:

- Buchstaben, Ziffern und `_`, aber **nicht mit einer Ziffer am Anfang**: `knoten2` ist erlaubt, `2knoten` nicht
- keine Leerzeichen: `besuchte_knoten` oder `besuchteKnoten`, nicht `besuchte knoten`
- **Groß- und Kleinschreibung zählt**: `knotenNummer` und `KnotenNummer` sind zwei *verschiedene* Namen
- Pythons eigene Schlüsselwörter (`if`, `for`, `class`, `return` …) dürfen keine Namen sein

Deine Kursvorlagen schreiben Variablen in **camelCase** (`optimalerWeg`, `besuchteKnoten`, `aktuellerWeg`) und Methoden mit großem Anfangsbuchstaben (`KnotenBesuchen`). Wähle Namen, die sagen, was der Wert bedeutet: `laenge` ist besser als `x`.

:::warn
Deine Tiefensuche-Vorlage enthält genau diesen Fehler: Der Parameter heißt `KnotenNummer`, im Methodenrumpf steht aber `knotenNummer`. Python bricht mit **NameError: name 'knotenNummer' is not defined** ab, weil das für Python zwei unabhängige Namen sind. Wenn du einen NameError bekommst, prüf zuerst die Schreibweise und die Groß-/Kleinschreibung.
:::

Eine Variable muss existieren, **bevor** sie verwendet wird. Das hier scheitert, weil `summe` noch nicht existiert, wenn Zeile 1 ausgeführt wird:

```python
summe = summe + 5    # NameError: name 'summe' is not defined
```

Jeder Zähler und jede Summe braucht deshalb zuerst einen **Startwert**: `summe = 0`.

## [python] Python-Blöcke

:::exercise id=a2-swap title="Zwei Variablen vertauschen" level=1
Vertausche die Werte von `links` und `rechts`, sodass `links` danach den alten Wert von `rechts` hat und umgekehrt. Verwende eine Hilfsvariable. (Die Prüfungen führen deinen Code auch mit anderen Werten aus, schreib die Zahlen also nicht selbst hin.)
--- starter
links = 10
rechts = 25

# hier vertauschen

print(links, rechts)
--- solution
links = 10
rechts = 25

hilf = links
links = rechts
rechts = hilf

print(links, rechts)
--- tests
@test("10 und 25 sind vertauscht")
def _():
    eq((links, rechts), (25, 10), "(links, rechts)")

@test("Funktioniert für andere Werte")
def _():
    ns, out = run_again(links="Andi", rechts="Bert")
    eq((ns["links"], ns["rechts"]), ("Bert", "Andi"), "(links, rechts) für 'Andi', 'Bert'")
--- hint
Bevor du `links` überschreibst, speichere seinen Wert in einer neuen Variablen, zum Beispiel `hilf`.
--- explain
Die Hilfsvariable hält den alten Wert von `links` fest, während `links` überschrieben wird. (`links, rechts = rechts, links` ist auch richtig.)
:::

:::exercise id=a2-trace title="Erst vorhersagen, dann prüfen" level=1
**Vor dem Ausführen**: Überleg dir auf Papier, was das Programm ausgibt. Ergänze dann die Variable `vorhersage` mit der vorhergesagten Zahl und starte die Prüfungen. (Die Prüfung vergleicht nur deine Vorhersage mit dem echten Ergebnis.)
--- starter
x = 4
y = x * 2
x = x + y
y = y - x
print(y)

vorhersage = 0   # deine Vorhersage für den ausgegebenen Wert
--- solution
x = 4
y = x * 2
x = x + y
y = y - x
print(y)

vorhersage = -4
--- tests
@test("Deine Vorhersage stimmt mit dem ausgegebenen Wert überein")
def _():
    eq(vorhersage, y, "vorhersage")
--- hint
Leg eine Ablauftabelle mit den Spalten `x` und `y` an und füll pro Zeile eine Reihe aus.
--- explain
| nach Zeile | x | y |
|---|---|---|
| 1 | 4 | – |
| 2 | 4 | 8 |
| 3 | 12 | 8 |
| 4 | 12 | −4 |
:::

:::exercise id=a2-names title="Repariere die Namen" level=1
Dieses Programm soll den Durchschnitt aus drei Noten berechnen, bricht aber mit einem Fehler ab. Führ es aus, lies die Fehlermeldung und behebe **alle** Fehler. Ändere die Werte nicht.
--- starter
note1 = 2
note2 = 3
Note3 = 1
summe = note1 + note2 + note3
Durchschnitt = summe / 3
print(durchschnitt)
--- solution
note1 = 2
note2 = 3
note3 = 1
summe = note1 + note2 + note3
durchschnitt = summe / 3
print(durchschnitt)
--- tests
@test("durchschnitt ist 2.0")
def _():
    eq(durchschnitt, 2.0, "durchschnitt")

@test("Das Programm gibt 2.0 aus")
def _():
    eq(OUTPUT.strip(), "2.0", "Ausgabe")
--- hint
Python meldet das **erste** Problem, auf das es stößt. Wenn du es behoben hast, führ das Programm noch einmal aus: Es gibt ein zweites.
--- explain
`Note3` und `note3` sind verschiedene Namen, ebenso `Durchschnitt` und `durchschnitt`. Eine einheitliche Schreibweise behebt beide NameErrors.
:::

:::exercise id=a2-counter title="Zähler und laufende Summe" level=2
Ein Kino zählt seine Besucher. Beginne mit `besucher = 0` und `einnahmen = 0`. Dann kommen drei Gruppen mit je einer Anzahl Personen. Erhöhe für jede Gruppe `besucher` um die Anzahl der Personen und `einnahmen` um `preis` pro Person. Verwende `+=`.

Gruppen: 4 Personen, 2 Personen, 7 Personen. Der Eintrittspreis steht in `preis`.
--- starter
preis = 9
besucher = 0
einnahmen = 0

# Gruppe 1: 4 Personen

# Gruppe 2: 2 Personen

# Gruppe 3: 7 Personen

print(besucher, einnahmen)
--- solution
preis = 9
besucher = 0
einnahmen = 0

# Gruppe 1: 4 Personen
besucher += 4
einnahmen += 4 * preis
# Gruppe 2: 2 Personen
besucher += 2
einnahmen += 2 * preis
# Gruppe 3: 7 Personen
besucher += 7
einnahmen += 7 * preis

print(besucher, einnahmen)
--- tests
@test("13 visitors")
def _():
    eq(besucher, 13, "besucher")

@test("Einnahmen mit preis = 9 sind 117")
def _():
    eq(einnahmen, 117, "einnahmen")

@test("Die Einnahmen verwenden die Variable preis (geprüft mit preis = 12)")
def _():
    ns, out = run_again(preis=12)
    eq(ns["einnahmen"], 156, "einnahmen für preis = 12")
--- hint
`besucher += 4` ist dasselbe wie `besucher = besucher + 4`.
--- explain
Eine Variable, die schrittweise erhöht wird, braucht einen Startwert (`0`) und dann bei jedem Ereignis eine Aktualisierung. Dieses Muster (ein **Akkumulator**) kommt in Lektion A4 in jeder Schleife wieder.
:::

## [exam] Klausurtraining

:::exam title="Ablauftabelle" points=4
Füll eine Ablauftabelle für die Variablen `a`, `b` und `c` aus und gib an, was ausgegeben wird.

```python
a = 7
b = 3
c = a // b
a = a % b
b = c + a
c = c * c
print(a, b, c)
```
--- solution
| nach Zeile | a | b | c |
|---|---|---|---|
| 1 | 7 | – | – |
| 2 | 7 | 3 | – |
| 3 | 7 | 3 | 2 |
| 4 | 1 | 3 | 2 |
| 5 | 1 | 3 | 2 |
| 6 | 1 | 3 | 4 |

Ausgabe: `1 3 4`. (Zeile 5: `b = 2 + 1 = 3`, das ist zufällig gleich dem alten Wert von `b`.)
:::
