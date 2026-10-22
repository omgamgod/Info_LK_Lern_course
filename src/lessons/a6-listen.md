---
id: a6
num: A6
part: A
title: Python-Listen und die Adjazenzmatrix
short: Listen & Matrix
lead: Python-Listen sind das, was dein Kurs ein Feld nennt. In ihnen stehen die Knoten eines Graphen, die besuchten Knoten, der aktuelle Weg und, als Liste von Listen, die Adjazenzmatrix. Diese Lektion behandelt auch den gefährlichsten Listenfehler, nämlich teilen statt kopieren.
minutes: 60
uses: [a5]
goals:
  - Listen erzeugen, lesen, ändern und mit Index und Schleife durchlaufen
  - append, pop, pop(0), insert, remove, in, len verwenden
  - mit list(...) eine echte Kopie einer Liste erstellen und erklären, warum das wichtig ist
  - eine 2D-Liste (Matrix) erzeugen und verwenden, einschließlich der −1-Konvention deines Kurses
---

## [logic] Ein Feld: nummerierte Kästchen

Ein **Feld** (Array, in Python eine **Liste**) ist eine Reihe nummerierter Kästchen, in denen jeweils ein Wert liegt. Die Nummern heißen **Indizes** (Einzahl: Index) und beginnen immer bei **0**.

:::diagram matrix caption="namen = ['Andi', 'Bert', 'Clara', 'Dora'] — vier Kästchen mit den Indizes 0 bis 3"
{"corner": "Index", "labels": ["0", "1", "2", "3"], "rowLabels": ["namen[i]"], "m": [["'Andi'", "'Bert'", "'Clara'", "'Dora'"]]}
:::

- `namen[0]` ist `'Andi'`, `namen[3]` ist `'Dora'`
- die Länge ist 4, der letzte Index also `len(namen) - 1 = 3`
- `namen[4]` existiert nicht → **IndexError**

Dein Kurs verwendet Listen überall:

| In den Vorlagen | Bedeutung |
|---|---|
| `self.knoten = []` | alle Knoten eines Graphen, der Index ist die Knotennummer |
| `self.matrix[i][j]` | die Adjazenzmatrix: Gewicht der Kante von Knoten i zu Knoten j |
| `self.besuchteKnoten` | die bei der Tiefensuche schon besuchten Knoten |
| `self.aktuellerWeg`, `self.optimalerWeg` | der aktuelle Weg und der beste bisher gefundene Weg |
| `self.patientenfeld` | die „Lösung mit Feld“ der Warteschlange |

## [python] Mit Listen arbeiten

```python
zahlen = [5, 3, 8]        # eine Liste mit drei Werten
leer = []                 # eine leere Liste

print(zahlen[0])          # 5   – lesen
zahlen[1] = 7             # ändern: [5, 7, 8]
print(len(zahlen))        # 3   – Länge
print(zahlen[-1])         # 8   – negativer Index zählt vom Ende
```

### Die Länge ändern

| Operation | Wirkung | Beispiel (Start `[5, 7, 8]`) |
|---|---|---|
| `liste.append(x)` | `x` **hinten** anhängen | `append(1)` → `[5, 7, 8, 1]` |
| `liste.insert(i, x)` | `x` **an Position i** einfügen | `insert(0, 9)` → `[9, 5, 7, 8]` |
| `liste.pop()` | das **letzte** Element entfernen und zurückgeben | liefert `8`, Liste ist `[5, 7]` |
| `liste.pop(0)` | das **erste** Element entfernen und zurückgeben | liefert `5`, Liste ist `[7, 8]` |
| `liste.remove(x)` | das erste Element entfernen, das **gleich x** ist | `remove(7)` → `[5, 8]` |
| `liste.clear()` | alles entfernen | `[]` |

`append` + `pop(0)` ergeben zusammen eine **Warteschlange**: Neue Elemente kommen hinten dazu, entfernt wird vorne. Das ist genau die „Lösung mit Feld“ aus Kapitel II.1. `append` + `pop()` ergeben einen **Stapel** (Stack): Wer zuletzt kommt, geht zuerst. Beides siehst du wieder, wenn Tiefensuche und Breitensuche verglichen werden.

### Suchen

```python
"Bert" in namen           # True  – ist der Wert in der Liste?
"Emil" not in namen       # True
namen.index("Clara")      # 2     – Position des Werts (Fehler, wenn er fehlt)
```

`if nummer not in self.besuchteKnoten:` ist genau die Prüfung der Tiefensuche: *Wurde dieser Knoten schon besucht?*

### Eine Liste durchlaufen

Es gibt zwei Wege, und du brauchst beide:

```python
# 1. über die Werte
for name in namen:
    print(name)

# 2. über die Indizes – wenn du die Position brauchst (z. B. Knotennummern)
for i in range(len(namen)):
    print(i, namen[i])
```

Die Tiefensuche deines Kurses verwendet Form 2: `for nummer in range(len(self.knoten)):`, weil man die Knotennummer braucht, um in die Matrix zu schauen.

:::exercise id=a6-stats title="Summe und Maximum ohne eingebaute Funktionen" level=1
Schreib zwei Funktionen **ohne** Pythons `sum` und `max`:

- `summe(liste)` gibt die Summe aller Zahlen zurück (0 bei einer leeren Liste)
- `groesstes(liste)` gibt die größte Zahl zurück (`None` bei einer leeren Liste)
--- starter
def summe(liste):
    pass


def groesstes(liste):
    pass
--- solution
def summe(liste):
    s = 0
    for x in liste:
        s = s + x
    return s


def groesstes(liste):
    if len(liste) == 0:
        return None
    g = liste[0]
    for x in liste:
        if x > g:
            g = x
    return g
--- tests
@test("summe([5, 3, 8]) ist 16, summe([]) ist 0")
def _():
    eq(summe([5, 3, 8]), 16, "summe([5, 3, 8])")
    eq(summe([]), 0, "summe([])")

@test("groesstes([5, 3, 8]) ist 8")
def _():
    eq(groesstes([5, 3, 8]), 8, "groesstes([5, 3, 8])")

@test("groesstes mit negativen Zahlen und mit einem Element")
def _():
    eq(groesstes([-4, -2, -9]), -2, "groesstes([-4, -2, -9])")
    eq(groesstes([7]), 7, "groesstes([7])")

@test("groesstes([]) ist None")
def _():
    eq(groesstes([]), None, "groesstes([])")

@test("Kein eingebautes sum/max")
def _():
    ok("sum(" not in SOURCE and "max(" not in SOURCE, "Schreib die Schleifen selbst, statt sum() oder max() zu verwenden.")
--- hint
Beginne beim Maximum mit dem **ersten Element** als bisher Bestem (nicht mit 0 — denk an negative Zahlen).
--- explain
`groesstes` behandelt zuerst die leere Liste, weil `liste[0]` einen IndexError auslösen würde. Danach merkt es sich den besten bisher gesehenen Wert: ein Muster, das du beim *optimalen Weg* (B4) wieder brauchst.
:::

:::exercise id=a6-count title="Zählen und filtern" level=1
Schreib

- `anzahl(liste, wert)`: wie oft `wert` in `liste` vorkommt
- `nur_positive(liste)`: eine **neue** Liste, die nur die Zahlen > 0 enthält, in derselben Reihenfolge

Verwende nicht `liste.count`.
--- starter
def anzahl(liste, wert):
    pass


def nur_positive(liste):
    pass
--- solution
def anzahl(liste, wert):
    n = 0
    for x in liste:
        if x == wert:
            n = n + 1
    return n


def nur_positive(liste):
    ergebnis = []
    for x in liste:
        if x > 0:
            ergebnis.append(x)
    return ergebnis
--- tests
@test("anzahl([1, 2, 1, 1, 3], 1) ist 3")
def _():
    eq(anzahl([1, 2, 1, 1, 3], 1), 3, "anzahl([1, 2, 1, 1, 3], 1)")
    eq(anzahl([], 5), 0, "anzahl([], 5)")

@test("nur_positive([3, -1, 0, 7, -5]) ist [3, 7]")
def _():
    eq(nur_positive([3, -1, 0, 7, -5]), [3, 7], "nur_positive([3, -1, 0, 7, -5])")

@test("nur_positive ändert die ursprüngliche Liste nicht")
def _():
    a = [1, -2, 3]
    nur_positive(a)
    eq(a, [1, -2, 3], "die ursprüngliche Liste nach dem Aufruf")
--- hint
Für die neue Liste: Beginne mit `ergebnis = []` und häng mit `append` jeden passenden Wert an.
--- explain
Eine neue Liste mit `append` in einer Schleife aufzubauen ist der Standardweg, Ergebnisse zu sammeln, zum Beispiel alle Nachbarn eines Knotens oder alle Lösungen einer Backtracking-Suche.
:::

:::exercise id=a6-queue title="Eine Warteschlange mit einer Python-Liste" level=1
Simuliere das Wartezimmer einer Arztpraxis mit einer Liste `warteschlange`:

1. Andi, Bert und Clara kommen an (in dieser Reihenfolge).
2. Ein Patient wird aufgerufen: Entferne den **ersten** und speichere seinen Namen in `aufgerufen`.
3. Dora kommt an.

Am Ende soll `warteschlange` gleich `['Bert', 'Clara', 'Dora']` und `aufgerufen` gleich `'Andi'` sein.
--- starter
warteschlange = []

# 1.

# 2.
aufgerufen = None

# 3.

print(aufgerufen, warteschlange)
--- solution
warteschlange = []

# 1.
warteschlange.append("Andi")
warteschlange.append("Bert")
warteschlange.append("Clara")
# 2.
aufgerufen = warteschlange.pop(0)
# 3.
warteschlange.append("Dora")

print(aufgerufen, warteschlange)
--- tests
@test("aufgerufen ist 'Andi'")
def _():
    eq(aufgerufen, "Andi", "aufgerufen")

@test("warteschlange ist ['Bert', 'Clara', 'Dora']")
def _():
    eq(warteschlange, ["Bert", "Clara", "Dora"], "warteschlange")

@test("append und pop werden verwendet")
def _():
    ok(".append(" in SOURCE and ".pop(0)" in SOURCE, "Verwende append zum Hinzufügen und pop(0) zum Entfernen des ersten Elements.")
--- hint
`pop(0)` entfernt das Element an Index 0 **und gibt es zurück**, du kannst es also gleichzeitig speichern.
--- explain
Neue Patienten stellen sich hinten an (`append`), der erste verlässt die Schlange vorne (`pop(0)`): **wer zuerst kommt, geht zuerst** (FIFO). Das ist die „Lösung mit Feld“ aus Kapitel II.1.
:::

## [logic] Eine Liste teilen oder kopieren

Dieser Teil ist kurz, aber entscheidend. Eine Liste ist ein **Objekt**. Eine Variable *enthält* die Liste nicht, sie **verweist** auf sie (Pfeilbild aus A2). Also

```python
a = [1, 2, 3]
b = a          # b verweist auf DIESELBE Liste
b.append(4)
print(a)       # [1, 2, 3, 4]  – a hat sich auch geändert!
```

`b = a` kopiert die Liste **nicht**. Es entsteht ein zweiter Pfeil auf dieselbe Liste. Eine unabhängige Kopie bekommst du mit

```python
b = list(a)    # eine NEUE Liste mit denselben Werten (auch: a.copy() oder a[:])
```

:::trace title="Eine Liste mit zwei Namen vs. eine echte Kopie"
a = [1, 2, 3]
b = a
b.append(4)
c = list(a)
c.append(5)
print(a, b, c)
:::

:::warn title="Typischer Fehler: den Weg speichern, ohne zu kopieren"
In B4 verändert die Suche ständig `self.aktuellerWeg` (append beim Betreten eines Knotens, pop beim Verlassen). Wenn ein besserer Weg gefunden ist, speichert ihn deine Vorlage mit

```python
self.optimalerWeg = list(self.aktuellerWeg)
```

`self.optimalerWeg = self.aktuellerWeg` würde nur einen zweiten Pfeil auf dieselbe Liste speichern, die die Suche danach weiter verändert. Am Ende sind beide leer, und der beste Weg ist verloren.
:::

:::exercise id=a6-copy title="Sich das Beste wirklich merken" level=2
`laengster_lauf(werte)` soll die längste Folge **aufsteigender** Zahlen als Liste zurückgeben. Beispiel: `[1, 2, 3, 2, 3, 4, 5, 1]` → `[2, 3, 4, 5]`.

Der gegebene Code hat die richtige Idee, liefert aber ein falsches Ergebnis. Finde den Fehler (eine Zeile) und behebe ihn. Nimm **◫ Visualisieren**, wenn du ihn nicht siehst.
--- starter
def laengster_lauf(werte):
    aktuell = []
    bester = []
    for x in werte:
        if len(aktuell) > 0 and x <= aktuell[-1]:
            aktuell.clear()
        aktuell.append(x)
        if len(aktuell) > len(bester):
            bester = aktuell
    return bester


print(laengster_lauf([1, 2, 3, 2, 3, 4, 5, 1]))
--- solution
def laengster_lauf(werte):
    aktuell = []
    bester = []
    for x in werte:
        if len(aktuell) > 0 and x <= aktuell[-1]:
            aktuell.clear()
        aktuell.append(x)
        if len(aktuell) > len(bester):
            bester = list(aktuell)
    return bester


print(laengster_lauf([1, 2, 3, 2, 3, 4, 5, 1]))
--- tests
@test("[1, 2, 3, 2, 3, 4, 5, 1] → [2, 3, 4, 5]")
def _():
    eq(laengster_lauf([1, 2, 3, 2, 3, 4, 5, 1]), [2, 3, 4, 5], "laengster_lauf(...)")

@test("[5, 6, 7, 1, 2] → [5, 6, 7]")
def _():
    eq(laengster_lauf([5, 6, 7, 1, 2]), [5, 6, 7], "laengster_lauf([5, 6, 7, 1, 2])")

@test("[] → []")
def _():
    eq(laengster_lauf([]), [], "laengster_lauf([])")
--- hint
Wie viele Listen gibt es nach `bester = aktuell`? Was passiert mit `bester`, wenn später `aktuell.clear()` läuft?
--- explain
`bester = aktuell` lässt beide Namen auf dieselbe Liste verweisen, deshalb hat `aktuell.clear()` auch `bester` geleert. `bester = list(aktuell)` speichert eine unabhängige Kopie. Das ist dieselbe Zeile wie `self.optimalerWeg = list(self.aktuellerWeg)` in B4.
:::

## [logic] Listen von Listen: die Matrix

Eine Liste darf andere Listen enthalten. Eine Liste von Zeilen, von denen jede eine Liste von Werten ist, ist eine **2D-Liste** oder **Matrix**:

```python
m = [[0, 4, -1],
     [4, 0, 3],
     [-1, 3, 0]]
print(m[1][2])     # Zeile 1, Spalte 2 → 3
```

`m[1]` ist die Zeile `[4, 0, 3]`, und `m[1][2]` ist das Element an Position 2 dieser Zeile. Immer **zuerst die Zeile, dann die Spalte**.

In Kapitel B werden Graphen als **Adjazenzmatrix** gespeichert: `matrix[i][j]` ist das Gewicht der Kante von Knoten `i` zu Knoten `j`. Deine Kursvorlagen schreiben **−1** für „keine Kante“ (Gewichte sind immer positiv, deshalb kann −1 nicht mit einem echten Gewicht verwechselt werden).

:::diagram graph caption="Ein kleiner Graph …"
{"nodes": [["A", 40, 40], ["B", 200, 40], ["C", 120, 150]], "edges": [["A", "B", 4], ["B", "C", 3]]}
:::

:::diagram matrix caption="… und seine Adjazenzmatrix (−1 = keine Kante, als – dargestellt)"
{"labels": ["A", "B", "C"], "m": [[-1, 4, -1], [4, -1, 3], [-1, 3, -1]], "empty": -1, "hl": [[0, 1, "blue"], [1, 0, "blue"]]}
:::

Der Graph ist ungerichtet, deshalb kommt die Kante A–B **zweimal** vor: `matrix[0][1]` und `matrix[1][0]`. Die Matrix ist symmetrisch.

### Eine Matrix richtig erzeugen

```python
n = 3
matrix = []
for i in range(n):
    matrix.append([-1] * n)    # eine NEUE Zeile in jedem Durchlauf
```

`[-1] * n` erzeugt eine Zeile mit n-mal −1. Deine Tiefensuche-Vorlage lässt die Matrix stattdessen Knoten für Knoten wachsen (`KnotenEinfuegen`): Sie hängt an jede bestehende Zeile eine −1 an (neue Spalte) und fügt dann eine neue Zeile hinzu.

:::warn title="Typischer Fehler: [[-1] * n] * n"
`matrix = [[-1] * 3] * 3` sieht richtig aus, erzeugt aber **eine** Zeile und drei Verweise darauf. `matrix[0][1] = 4` ändert dann *jede* Zeile. Bau die Zeilen immer in einer Schleife (oder mit `[[-1] * n for i in range(n)]`).
:::

### Die Nachbarn eines Knotens lesen

Alle Nachbarn von Knoten `i` sind die Spalten `j` mit einem echten Gewicht in Zeile `i`:

```python
for j in range(len(matrix)):
    if matrix[i][j] > 0:
        print("Nachbar:", j)
```

Diese Schleife ist das Herz jeder Tiefensuche in Kapitel B.

:::exercise id=a6-matrix title="Eine Adjazenzmatrix aufbauen" level=2
Schreib

- `leere_matrix(n)`: gibt eine n×n-Matrix voller −1 zurück (jede Zeile eine eigene Liste!)
- `kante_einfuegen(matrix, i, j, gewicht)`: trägt eine **ungerichtete** Kante ein (beide Richtungen)
- `nachbarn(matrix, i)`: gibt die Liste aller Knotennummern `j` mit einer Kante von `i` zurück (aufsteigend)
--- starter
def leere_matrix(n):
    pass


def kante_einfuegen(matrix, i, j, gewicht):
    pass


def nachbarn(matrix, i):
    pass


m = leere_matrix(4)
kante_einfuegen(m, 0, 1, 4)
kante_einfuegen(m, 1, 2, 3)
kante_einfuegen(m, 1, 3, 7)
print(m)
print(nachbarn(m, 1))
--- solution
def leere_matrix(n):
    matrix = []
    for i in range(n):
        matrix.append([-1] * n)
    return matrix


def kante_einfuegen(matrix, i, j, gewicht):
    matrix[i][j] = gewicht
    matrix[j][i] = gewicht


def nachbarn(matrix, i):
    ergebnis = []
    for j in range(len(matrix)):
        if matrix[i][j] > 0:
            ergebnis.append(j)
    return ergebnis


m = leere_matrix(4)
kante_einfuegen(m, 0, 1, 4)
kante_einfuegen(m, 1, 2, 3)
kante_einfuegen(m, 1, 3, 7)
print(m)
print(nachbarn(m, 1))
--- tests
@test("leere_matrix(3) ist eine 3×3-Matrix aus -1")
def _():
    eq(leere_matrix(3), [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]], "leere_matrix(3)")

@test("Zeilen sind unabhängige Listen")
def _():
    m2 = leere_matrix(3)
    m2[0][1] = 5
    eq(m2[1][1], -1, "m[1][1] nach dem Setzen von m[0][1] = 5")

@test("kante_einfuegen setzt beide Richtungen")
def _():
    m2 = leere_matrix(3)
    kante_einfuegen(m2, 0, 2, 9)
    eq((m2[0][2], m2[2][0], m2[0][1]), (9, 9, -1), "(m[0][2], m[2][0], m[0][1])")

@test("nachbarn")
def _():
    m2 = leere_matrix(4)
    kante_einfuegen(m2, 0, 1, 4)
    kante_einfuegen(m2, 1, 2, 3)
    kante_einfuegen(m2, 1, 3, 7)
    eq(nachbarn(m2, 1), [0, 2, 3], "nachbarn(m, 1)")
    eq(nachbarn(m2, 3), [1], "nachbarn(m, 3)")
    eq(nachbarn(leere_matrix(2), 0), [], "nachbarn eines isolierten Knotens")
--- hint
`kante_einfuegen` gibt nichts zurück: Es ändert das übergebene Matrixobjekt, und der Aufrufer sieht die Änderung, weil beide auf dieselbe Liste verweisen.
--- explain
Diese drei Funktionen sind genau das, was die Klasse `GraphMatrix` deines Kurses in `KnotenEinfuegen`, `KanteEinfuegen` und der Nachbarschleife von `KnotenBesuchen` tut.
:::

## [exam] Klausurtraining

:::exam title="Listen von Hand" points=5
```python
w = ["A", "B"]
v = w
w.append("C")
x = v.pop(0)
u = list(v)
u.append("D")
w.insert(0, x)
print(w, v, u, x)
```
Gib die Ausgabe an und erkläre, warum `v` und `w` immer denselben Inhalt zeigen.
--- solution
Ausgabe: `['A', 'B', 'C'] ['A', 'B', 'C'] ['B', 'C', 'D'] A`

Schritte: `w` und `v` verweisen auf **dieselbe** Liste. Nach `append`: `['A', 'B', 'C']`. `v.pop(0)` entfernt `'A'` aus dieser einen Liste → `['B', 'C']`, `x = 'A'`. `u` ist eine **Kopie** `['B', 'C']`, dann `['B', 'C', 'D']`. `w.insert(0, x)` setzt `'A'` wieder vorne in die gemeinsame Liste → `['A', 'B', 'C']`, sichtbar über beide Namen. `u` ist unabhängig.
:::

:::exam title="Adjazenzmatrix" points=3
Schreib die Adjazenzmatrix des Graphen mit den Knoten P, Q, R, S und den ungerichteten Kanten P–Q (2), Q–R (5), P–S (1), R–S (4) auf. Verwende – für „keine Kante“.
--- solution
|   | P | Q | R | S |
|---|---|---|---|---|
| **P** | – | 2 | – | 1 |
| **Q** | 2 | – | 5 | – |
| **R** | – | 5 | – | 4 |
| **S** | 1 | – | 4 | – |

Die Matrix ist symmetrisch, weil der Graph ungerichtet ist.
:::
