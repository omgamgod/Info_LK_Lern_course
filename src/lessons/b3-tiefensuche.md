---
id: b3
num: B3
part: B
title: Graphen und Tiefensuche
short: Tiefensuche
lead: Ein Graph modelliert Orte und Verbindungen, etwa Städte und Autobahnen oder Zutaten, die oft zusammen gewählt werden. Die Tiefensuche besucht alle Knoten eines Graphen durch rekursives Backtracking. Diese Lektion behandelt die Graphbegriffe, die Adjazenzmatrix, die Tiefensuche, den Vergleich mit der Breitensuche und die Abituraufgabe 2016 „Die Mischung macht's“.
minutes: 100
uses: [b2, a6, a7]
goals:
  - die Graphbegriffe gewichtet/ungewichtet, gerichtet/ungerichtet, zyklisch/zyklenfrei, zusammenhängend/nicht zusammenhängend erklären
  - die <b>Adjazenzmatrix</b> eines Graphen aufstellen und einen Graphen aus einer Matrix ablesen
  - eine <b>Tiefensuche</b> von Hand durchführen und Besuchsreihenfolge und Aufrufstapel angeben
  - <code>KnotenBesuchen</code>, einen Zusammenhangstest und die <b>Breitensuche</b> in Python implementieren
  - die Abituraufgabe 2016 (Müsli) einschließlich Struktogramm lösen
---

## [logic] Graphen (12_I_3_Wiederholung)

Ein **Graph** besteht aus **Knoten** und **Kanten**. Jede Kante verbindet zwei Knoten. Zwei Knoten, die durch eine Kante verbunden sind, heißen **benachbart** (Nachbarn).

:::diagram graph caption="Der Graph aus 12_I_3_Wiederholung (Pfeile: Einbahn-Kanten)"
{"nodes": [["A", 60, 50], ["B", 250, 50], ["C", 360, 150], ["D", 80, 190], ["E", 240, 240]], "edges": [["A", "B", 4, "--"], ["B", "C", 3, "->"], ["B", "D", 7, "->"], ["B", "E", 8, "--"], ["C", "E", 5, "--"], ["D", "E", 2, "--"], ["D", "A", 5, "->"]]}
:::

| Begriffspaar | Bedeutung | Dieser Graph |
|---|---|---|
| **gewichtet / ungewichtet** | Kanten tragen eine Zahl (Gewicht: Entfernung, Kosten, Häufigkeit) oder nicht | gewichtet |
| **gerichtet / ungerichtet** | Kanten können nur in einer Richtung (Pfeil) oder in beiden benutzt werden | gerichtet: B→C, B→D, D→A sind Einbahnen (eine ungerichtete Kante zählt wie zwei entgegengesetzte gerichtete Kanten) |
| **zyklisch / zyklenfrei** | es gibt einen **Zyklus**: einen Weg, der zu seinem Startknoten zurückführt, ohne eine Kante zweimal zu benutzen | zyklisch, z. B. A → B → D → A |
| **zusammenhängend / nicht zusammenhängend** | jeder Knoten ist von jedem anderen aus erreichbar (ohne Rücksicht auf die Richtung) oder nicht | zusammenhängend |

Ein zyklenfreier, zusammenhängender, ungerichteter Graph ist ein **Baum**.

## [logic] Die Adjazenzmatrix

Ein Computer kann keine Zeichnung speichern, deshalb wird der Graph als Tabelle gespeichert: die **Adjazenzmatrix**. In Zeile `i`, Spalte `j` steht das Gewicht der Kante **von** Knoten `i` **zu** Knoten `j`; „keine Kante“ wird durch einen besonderen Wert markiert. Deine Python-Vorlagen verwenden **−1**; manche Aufgaben (wie das Abitur 2016) verwenden **0**; in Zeichnungen steht oft **–**.

:::diagram matrix caption="Adjazenzmatrix des Graphen oben (Zeilen: von, Spalten: nach, – = keine Kante)"
{"labels": ["A", "B", "C", "D", "E"], "m": [[-1, 4, -1, -1, -1], [4, -1, 3, 7, 8], [-1, -1, -1, -1, 5], [5, -1, -1, -1, 2], [-1, 8, 5, 2, -1]], "empty": -1, "hl": [[1, 2, "blue"], [1, 3, "blue"], [3, 0, "blue"]]}
:::

- Eine ungerichtete Kante kommt **zweimal** vor (A–B: `[A][B]` und `[B][A]`). Sind alle Kanten ungerichtet, ist die Matrix **symmetrisch** zur Diagonale.
- Eine gerichtete Kante kommt **einmal** vor (B→C nur in Zeile B, hervorgehoben).
- Die Nachbarn eines Knotens findest du, indem du **seine Zeile** liest.

Bei n Knoten hat die Matrix n² Zellen, auch wenn es nur wenige Kanten gibt. Für die Graphen in diesem Kurs ist das kein Problem.

## [logic] Die Tiefensuche (12_I_3_Einstieg)

*Ein Vertreter für Gastronomiebedarf will alle Kunden in seinem neuen Bezirk besuchen. Eine optimale Route ist ihm egal.* (Projekt **Vertreter**.)

Eine einfache Strategie, die garantiert jeden Kunden erreicht:

1. Besuche die aktuelle Stadt und **markiere** sie als besucht.
2. Schau dir ihre Nachbarn in einer festen Reihenfolge an. Geh zum **ersten Nachbarn, der noch nicht markiert ist**, und mach dort mit Schritt 1 weiter.
3. Wenn die aktuelle Stadt **keinen unmarkierten Nachbarn mehr** hat, geh **zurück** zu der Stadt, aus der du gekommen bist, und mach dort mit ihrem nächsten Nachbarn weiter.

Das ist Backtracking (B2) auf einem Graphen: Die Stufen sind die Städte, die Möglichkeiten die Nachbarn, und *zulässig* heißt *noch nicht besucht*. Weil die Suche immer so **tief** wie möglich geht, bevor sie umkehrt, heißt sie **Tiefensuche**.

Probier es auf dem Autobahnnetz deiner Vorlage aus (Projekt Vertreter startet in **M**, München). Die Nachbarn werden wie in der Vorlage in Matrixreihenfolge geprüft:

:::viz graphwalk
{"graph": "autobahn", "start": "M", "mode": "dfs", "allowMode": false, "allowOrder": true}
:::

### Rekursive Formulierung (Aufgabe c, d)

```pseudo
methode KnotenBesuchen(aktuellerKnoten)
    aktuellerKnoten als besucht markieren
    für jeden Knoten k
        falls es eine Kante von aktuellerKnoten zu k gibt und k nicht besucht ist dann
            KnotenBesuchen(k)
        endefalls
    endefür
endemethode
```

- **Rekursionsschritt**: einen unbesuchten Nachbarn besuchen, also dasselbe Problem von einem neuen Knoten aus.
- **Abbruchbedingungen**: Ein Nachbar, der **schon besucht** ist, wird nicht noch einmal aufgerufen, und wenn **kein unbesuchter Nachbar** mehr übrig ist, endet die Schleife ohne weiteren Aufruf, die Methode ist also einfach fertig (das Rekursionsende hat kein eigenes `if`).
- Jeder Knoten wird **genau einmal** aufgerufen (er wird markiert, bevor seine Nachbarn besucht werden), deshalb muss die Suche enden.

Die Besuchsreihenfolge hängt davon ab, in welcher Reihenfolge die Nachbarn geprüft werden (Aufgabe e): Prüft man die Matrix von hinten, ergibt sich eine andere Reihenfolge.

Die Aufrufe von KnotenBesuchen bilden einen Baum: den **Tiefensuchbaum** (blaue Kanten in der Visualisierung). Er enthält jeden Knoten einmal, im Allgemeinen aber nicht jede Kante.

### Testen, ob ein Graph zusammenhängend ist (Aufgabe 4 d)

Eine einzige Tiefensuche von einem beliebigen Startknoten erreicht genau die Knoten, die mit ihm verbunden sind. Also:

**Der Graph ist zusammenhängend ⇔ nach einer Tiefensuche sind alle Knoten markiert.**

Beim Beispielgraph2 aus deiner Vorlage fehlen zwei Kanten. Starte eine Tiefensuche bei A und zähle die besuchten Knoten:

:::viz graphwalk
{"graph": "beispiel2", "start": "A", "mode": "dfs", "allowMode": false, "title": "Beispielgraph2: zusammenhängend?"}
:::

## [logic] Tiefensuche gegen Breitensuche (Aufgabe 7)

Die **Breitensuche** besucht ebenfalls alle erreichbaren Knoten, aber in **Schichten**: zuerst den Startknoten, dann **alle** seine Nachbarn, dann alle Nachbarn von diesen und so weiter. Sie braucht eine **Warteschlange**: Neu entdeckte Knoten werden hinten angehängt, und der nächste zu bearbeitende Knoten wird vorne entnommen (wer zuerst kommt, geht zuerst). Eine Warteschlange implementierst du in Lektion C1 selbst.

Wechsle auf dem Graphen aus Aufgabe 7 zwischen den beiden Algorithmen (Start K1, Nachbarn in alphabetischer Reihenfolge):

:::viz graphwalk
{"graph": "k7", "start": "K1", "mode": "dfs", "allowOrder": false, "title": "Aufgabe 7: Tiefensuche vs. Breitensuche"}
:::

| | Tiefensuche | Breitensuche |
|---|---|---|
| Reihenfolge ab K1 | K1, K2, K3, K4, K5, K6, K7 | K1, K2, K6, K7, K3, K5, K4 |
| Idee | so tief wie möglich, dann zurück | Schicht für Schicht (Entfernung vom Start) |
| Datenstruktur | ein **Stapel** (Stack, LIFO). Bei Rekursion ist das der Aufrufstapel selbst | eine **Warteschlange** (FIFO) |
| typische Umsetzung | rekursiv | iterativ mit einer Schleife |
| alle Kanten benutzt? | nein: nur die Kanten zu unbesuchten Knoten (Baumkanten) | nein, auch nur Baumkanten |

**Aufgabe 7 c**: Jede Kante wird nur dann benutzt, wenn jede Kante zu einem noch nicht besuchten Knoten führt. Das ist genau dann der Fall, wenn der Graph ein **Baum** ist (zusammenhängend und zyklenfrei). In einem Baum benutzt auch die Breitensuche jede Kante. Sobald es einen Zyklus gibt, führt eine Kante des Zyklus zu einem besuchten Knoten zurück und wird nicht benutzt.

## [logic] Abitur 2016: „Die Mischung macht's“ (12_I_3_Aufgabe_9)

Während ein Kunde ein Müsli zusammenstellt, schlägt der Shop weitere Zutaten vor, die andere Kunden oft mit der aktuellen kombiniert haben. Ausgewertet wurden vier Kombinationen: A (Haferflocken, Rosinen, Mandeln), B (Haferflocken, Mandeln, Schokolade), C (Dinkelflocken, Haferflocken), D (Haferflocken, Schokolade, Mandeln). Das Kantengewicht gibt an, in wie vielen Kombinationen beide Zutaten vorkommen.

:::diagram graph caption="Der Müsli-Graph"
{"nodes": [["Bananen", 470, 50], ["Dinkelflocken", 300, 40], ["Haferflocken", 190, 130], ["Mandeln", 300, 250], ["Rosinen", 110, 240], ["Schokolade", 440, 170]], "edges": [["Dinkelflocken", "Haferflocken", 1], ["Haferflocken", "Rosinen", 1], ["Haferflocken", "Mandeln", 3], ["Haferflocken", "Schokolade", 2], ["Rosinen", "Mandeln", 1], ["Mandeln", "Schokolade", 2]], "box": true}
:::

**a)** Zwei wesentliche Eigenschaften: Der Graph ist **ungerichtet** (eine Kombination hat keine Richtung) und **gewichtet** (Anzahl der Kombinationen). Er ist außerdem **nicht zusammenhängend** (Bananen hat keine Kante) und **zyklisch** (Haferflocken–Rosinen–Mandeln–Haferflocken). Die Adjazenzmatrix, wie in der Aufgabe gefordert mit 0 für „keine Kante“:

:::diagram matrix caption="Adjazenzmatrix in der Knotenreihenfolge des Konstruktors (0 = keine Kombination)"
{"labels": ["Ban", "Din", "Haf", "Man", "Ros", "Sch"], "rowLabels": ["Bananen", "Dinkelflocken", "Haferflocken", "Mandeln", "Rosinen", "Schokolade"], "m": [[0,0,0,0,0,0],[0,0,1,0,0,0],[0,1,0,3,1,2],[0,0,3,0,1,2],[0,0,1,1,0,0],[0,0,2,2,0,0]], "hlRows": [3]}
:::

**c)** `dazuEmpfehlen(i)` liest **Zeile i** und empfiehlt jede Zutat, die **mehr als einmal** mit Zutat i kombiniert wurde. Für Mandeln (Zeile 3): Haferflocken (3) und Schokolade (2), aber nicht Rosinen (1).

:::diagram struktogramm caption="dazuEmpfehlen(i)"
title dazuEmpfehlen(i)
W: wiederhole für j von 0 bis 5
  F: matrix[i][j] > 1
    T:
      S: ausgeben "Viele Kunden haben zu Ihrer Zutat noch " + knoten[j] + " gewählt."
    E:
      S: (nichts)
:::

**d)** *Welche Zutaten hängen mit einer Startzutat zusammen, auch indirekt?* (z. B. Dinkelflocken und Rosinen über Haferflocken). Das ist genau eine Tiefensuche auf der Matrix: Starte beim gegebenen Knoten, besuche jeden noch nicht besuchten Knoten mit Matrixeintrag ≠ 0 und gib jeden Knoten aus, wenn er besucht wird. Jeder erreichbare Knoten wird genau einmal ausgegeben.

## [bridge] Vom Pseudocode zur Vorlage GraphMatrix

Deine Vorlage `Tiefensuche.py` speichert die Knoten in der Liste `self.knoten`, die Matrix in `self.matrix` (−1 = keine Kante) und die Nummern der besuchten Knoten in `self.besuchteKnoten`.

:::bridge title="KnotenBesuchen (K3_3_A04 Tiefensuche.py)"
methode KnotenBesuchen(aktuell)                 || def KnotenBesuchen(self, aktuell):
    aktuell als besucht markieren               ||     self.besuchteKnoten.append(aktuell)
    für jeden Knoten nummer                     ||     for nummer in range(len(self.knoten)):
        falls Kante aktuell→nummer existiert    ||         if self.matrix[aktuell][nummer] > 0 \
          und nummer nicht besucht dann         ||                 and nummer not in self.besuchteKnoten:
            KnotenBesuchen(nummer)              ||             self.KnotenBesuchen(nummer)
        endefalls                               ||
    endefür                                     ||
endemethode                                     ||
                                                ||
methode TiefensucheAusführen(start)             || def TiefensucheAusführen(self, startKnoten):
    alle Markierungen löschen                   ||     self.besuchteKnoten.clear()
    KnotenBesuchen(start)                       ||     self.KnotenBesuchen(startKnoten)
>> Knoten werden über ihre **Nummer** (Index in `self.knoten`) angesprochen, weil die Matrix mit Nummern indiziert ist. `KnotenNummerGeben("M")` übersetzt einen Namen in seine Nummer. „Kante existiert“ heißt `matrix[aktuell][nummer] > 0`, weil −1 keine Kante bedeutet. Ein `\` am Zeilenende setzt die Bedingung in der nächsten Zeile fort.
:::

:::bridge title="Breitensuche mit einer Warteschlange"
methode Breitensuche(start)                     || def BreitensucheAusführen(self, start):
    start markieren                             ||     besucht = [start]
    schlange = [start]                          ||     schlange = [start]
    solange schlange nicht leer                 ||     while len(schlange) > 0:
        k = erstes Element entfernen            ||         k = schlange.pop(0)
        k ausgeben                              ||         print(self.knoten[k])
        für jeden Nachbarn n von k              ||         for n in range(len(self.knoten)):
            falls n nicht markiert dann         ||             if self.matrix[k][n] > 0 and n not in besucht:
                n markieren, hinten anhängen    ||                 besucht.append(n)
                                                ||                 schlange.append(n)
>> Keine Rekursion: Die Warteschlange ersetzt den Aufrufstapel. Knoten werden markiert, wenn sie **in** die Warteschlange **kommen**, damit kein Knoten zweimal hineingerät.
:::

## [python] Tiefensuche in Python

Die Aufgaben verwenden eine abgespeckte `GraphMatrix` ohne Grafik: `self.knoten` enthält die **Namen** (Strings) statt `Knoten`-Objekte. Alles andere ist wie in deiner Vorlage.

```python
class GraphMatrix:
    def __init__(self):
        self.knoten = []           # Namen, Index = Knotennummer
        self.matrix = []           # matrix[i][j] = Gewicht, -1 = keine Kante
        self.besuchteKnoten = []

    def KnotenEinfuegen(self, bezeichner):
        self.knoten.append(bezeichner)
        for zeile in self.matrix:        # jede vorhandene Zeile bekommt eine neue Spalte
            zeile.append(-1)
        self.matrix.append([-1] * len(self.knoten))   # und eine neue Zeile für den neuen Knoten
```

Warum sieht `KnotenEinfuegen` so aus? Bei n Knoten ist die Matrix n × n. Ein neuer Knoten braucht eine **neue Spalte** in jeder vorhandenen Zeile und eine **neue Zeile** der Länge n + 1.

:::trace title="Eine winzige Tiefensuche: Beobachte die Rahmen von KnotenBesuchen"
matrix = [[-1, 1, 1, -1],
          [1, -1, -1, 1],
          [1, -1, -1, -1],
          [-1, 1, -1, -1]]
namen = ["A", "B", "C", "D"]
besucht = []


def KnotenBesuchen(aktuell):
    besucht.append(aktuell)
    print("besuche", namen[aktuell])
    for nummer in range(len(namen)):
        if matrix[aktuell][nummer] > 0 and nummer not in besucht:
            KnotenBesuchen(nummer)


KnotenBesuchen(0)
:::

### Besucht als Attribut des Knotens (Aufgabe 5)

Statt einer Liste `besuchteKnoten` kann jedes `Knoten`-Objekt ein Attribut `besucht` (True/False) tragen.

| | Liste `besuchteKnoten` | Attribut `knoten.besucht` |
|---|---|---|
| Prüfung | `nummer not in self.besuchteKnoten` (durchsucht die Liste) | `not self.knoten[nummer].besucht` (direkt) |
| Zurücksetzen vor einer neuen Suche | `self.besuchteKnoten.clear()` | alle Knoten durchlaufen und `besucht = False` setzen |
| Nebenwirkung | keine, die Graphdaten bleiben unverändert | die Knoten tragen einen „Suchzustand“, der eigentlich keine Eigenschaft einer Stadt ist |
| Bonus | die Liste speichert auch die **Reihenfolge** der Besuche | schnellere Prüfung bei großen Graphen |

Beides ist richtig; viele bevorzugen die Liste, weil sie die Daten des Graphen vom Zustand einer bestimmten Suche getrennt hält. (Das ist die Idee aus Kapitel II.2, *Trennung von Struktur und Daten*.)

## [python] Python-Blöcke

:::exercise id=b3-graph title="GraphMatrix: die Matrix aufbauen" level=1
Vervollständige die Klasse `GraphMatrix`:

- `KnotenEinfuegen(bezeichner)`: wie oben gezeigt (neue Spalte in jeder Zeile + neue Zeile)
- `KnotenNummerGeben(bezeichner)`: der Index des Knotens, oder −1
- `KanteEinfuegen(von, nach, gewicht)`: **ungerichtete** Kante zwischen den Knoten mit diesen Namen (beide Richtungen); nichts tun, wenn ein Name unbekannt ist oder `von == nach`
- `KanteGewichtGeben(von, nach)`: das Gewicht, oder −1
--- starter
class GraphMatrix:
    def __init__(self):
        self.knoten = []
        self.matrix = []

    def KnotenEinfuegen(self, bezeichner):
        pass

    def KnotenNummerGeben(self, bezeichner):
        pass

    def KanteEinfuegen(self, von, nach, gewicht):
        pass

    def KanteGewichtGeben(self, von, nach):
        pass


g = GraphMatrix()
for name in ["A", "B", "C"]:
    g.KnotenEinfuegen(name)
g.KanteEinfuegen("A", "B", 4)
print(g.matrix)
--- solution
class GraphMatrix:
    def __init__(self):
        self.knoten = []
        self.matrix = []

    def KnotenEinfuegen(self, bezeichner):
        self.knoten.append(bezeichner)
        for zeile in self.matrix:
            zeile.append(-1)
        self.matrix.append([-1] * len(self.knoten))

    def KnotenNummerGeben(self, bezeichner):
        for i in range(len(self.knoten)):
            if self.knoten[i] == bezeichner:
                return i
        return -1

    def KanteEinfuegen(self, von, nach, gewicht):
        a = self.KnotenNummerGeben(von)
        b = self.KnotenNummerGeben(nach)
        if a != -1 and b != -1 and a != b:
            self.matrix[a][b] = gewicht
            self.matrix[b][a] = gewicht

    def KanteGewichtGeben(self, von, nach):
        a = self.KnotenNummerGeben(von)
        b = self.KnotenNummerGeben(nach)
        if a != -1 and b != -1:
            return self.matrix[a][b]
        return -1


g = GraphMatrix()
for name in ["A", "B", "C"]:
    g.KnotenEinfuegen(name)
g.KanteEinfuegen("A", "B", 4)
print(g.matrix)
--- tests
@test("Drei Knoten ergeben eine 3×3-Matrix aus -1")
def _():
    g = GraphMatrix()
    for n in "ABC":
        g.KnotenEinfuegen(n)
    eq(g.matrix, [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]], "matrix")

@test("KnotenNummerGeben")
def _():
    g = GraphMatrix()
    for n in ["M", "N", "R"]:
        g.KnotenEinfuegen(n)
    eq((g.KnotenNummerGeben("M"), g.KnotenNummerGeben("R"), g.KnotenNummerGeben("X")), (0, 2, -1), "Nummern von M, R, X")

@test("KanteEinfuegen setzt beide Richtungen")
def _():
    g = GraphMatrix()
    for n in "ABC":
        g.KnotenEinfuegen(n)
    g.KanteEinfuegen("A", "C", 7)
    eq((g.matrix[0][2], g.matrix[2][0], g.matrix[0][1]), (7, 7, -1), "(A→C, C→A, A→B)")
    eq(g.KanteGewichtGeben("C", "A"), 7, "KanteGewichtGeben('C', 'A')")

@test("Unbekannte Namen und Schleifen werden ignoriert")
def _():
    g = GraphMatrix()
    for n in "AB":
        g.KnotenEinfuegen(n)
    g.KanteEinfuegen("A", "X", 3)
    g.KanteEinfuegen("A", "A", 3)
    eq(g.matrix, [[-1, -1], [-1, -1]], "matrix")
    eq(g.KanteGewichtGeben("A", "X"), -1, "KanteGewichtGeben('A', 'X')")

@test("Zeilen sind auch nach vielen Knoten unabhängig")
def _():
    g = GraphMatrix()
    for n in "ABCDE":
        g.KnotenEinfuegen(n)
    g.KanteEinfuegen("B", "D", 2)
    eq(sum(1 for r in g.matrix for v in r if v == 2), 2, "Anzahl der Einträge 2")
--- hint
`KnotenEinfuegen`: zuerst den Namen mit `append` anhängen, dann jede vorhandene Zeile um −1 verlängern, dann eine neue Zeile mit `len(self.knoten)`-mal −1 anhängen.
--- hint
`KanteEinfuegen` übersetzt die Namen zuerst mit `KnotenNummerGeben` in Nummern.
--- explain
Das ist der Code der Vorlage ohne Zeichnung. Durch `KnotenEinfuegen` bleibt die Matrix immer quadratisch, und jeder neue Knoten beginnt ohne Kanten.
:::

:::exercise id=b3-dfs title="KnotenBesuchen" level=2
Implementiere die Tiefensuche (12_I_3_Aufgabe_4 a): `KnotenBesuchen(aktuell)` markiert die Knotennummer `aktuell` in `besuchteKnoten` und ruft sich dann für jeden Nachbarn (Matrixwert > 0), der noch nicht besucht ist, in Matrixreihenfolge selbst auf. `TiefensucheAusführen(start)` (gegeben) startet sie mit einem Knoten**namen** und gibt die Liste der besuchten **Namen** in Besuchsreihenfolge zurück.

Die Prüfungen verwenden den Autobahngraphen aus deiner Vorlage.
--- starter
class GraphMatrix:
    def __init__(self):
        self.knoten = []
        self.matrix = []
        self.besuchteKnoten = []

    def KnotenEinfuegen(self, bezeichner):
        self.knoten.append(bezeichner)
        for zeile in self.matrix:
            zeile.append(-1)
        self.matrix.append([-1] * len(self.knoten))

    def KnotenNummerGeben(self, bezeichner):
        return self.knoten.index(bezeichner)

    def KanteEinfuegen(self, von, nach, gewicht):
        a = self.KnotenNummerGeben(von)
        b = self.KnotenNummerGeben(nach)
        self.matrix[a][b] = gewicht
        self.matrix[b][a] = gewicht

    def KnotenBesuchen(self, aktuell):
        pass

    def TiefensucheAusführen(self, start):
        self.besuchteKnoten.clear()
        self.KnotenBesuchen(self.KnotenNummerGeben(start))
        return [self.knoten[i] for i in self.besuchteKnoten]


def autobahn():
    g = GraphMatrix()
    for n in ["FD", "WÜ", "UL", "S", "LI", "A", "M", "N", "HO", "R", "RO"]:
        g.KnotenEinfuegen(n)
    for a, b, w in [("WÜ", "FD", 86), ("S", "UL", 103), ("UL", "WÜ", 165), ("UL", "LI", 126), ("UL", "A", 59),
                    ("A", "M", 64), ("M", "N", 163), ("WÜ", "N", 104), ("N", "HO", 116), ("N", "R", 80),
                    ("R", "M", 117), ("M", "RO", 60), ("HO", "R", 166), ("WÜ", "HO", 192)]:
        g.KanteEinfuegen(a, b, w)
    return g


print(autobahn().TiefensucheAusführen("M"))
--- solution
class GraphMatrix:
    def __init__(self):
        self.knoten = []
        self.matrix = []
        self.besuchteKnoten = []

    def KnotenEinfuegen(self, bezeichner):
        self.knoten.append(bezeichner)
        for zeile in self.matrix:
            zeile.append(-1)
        self.matrix.append([-1] * len(self.knoten))

    def KnotenNummerGeben(self, bezeichner):
        return self.knoten.index(bezeichner)

    def KanteEinfuegen(self, von, nach, gewicht):
        a = self.KnotenNummerGeben(von)
        b = self.KnotenNummerGeben(nach)
        self.matrix[a][b] = gewicht
        self.matrix[b][a] = gewicht

    def KnotenBesuchen(self, aktuell):
        self.besuchteKnoten.append(aktuell)
        for nummer in range(len(self.knoten)):
            if self.matrix[aktuell][nummer] > 0 and nummer not in self.besuchteKnoten:
                self.KnotenBesuchen(nummer)

    def TiefensucheAusführen(self, start):
        self.besuchteKnoten.clear()
        self.KnotenBesuchen(self.KnotenNummerGeben(start))
        return [self.knoten[i] for i in self.besuchteKnoten]


def autobahn():
    g = GraphMatrix()
    for n in ["FD", "WÜ", "UL", "S", "LI", "A", "M", "N", "HO", "R", "RO"]:
        g.KnotenEinfuegen(n)
    for a, b, w in [("WÜ", "FD", 86), ("S", "UL", 103), ("UL", "WÜ", 165), ("UL", "LI", 126), ("UL", "A", 59),
                    ("A", "M", 64), ("M", "N", 163), ("WÜ", "N", 104), ("N", "HO", 116), ("N", "R", 80),
                    ("R", "M", 117), ("M", "RO", 60), ("HO", "R", 166), ("WÜ", "HO", 192)]:
        g.KanteEinfuegen(a, b, w)
    return g


print(autobahn().TiefensucheAusführen("M"))
--- tests
@test("Ab M: M, A, UL, WÜ, FD, N, HO, R, S, LI, RO")
def _():
    eq(autobahn().TiefensucheAusführen("M"), ["M", "A", "UL", "WÜ", "FD", "N", "HO", "R", "S", "LI", "RO"], "Besuchsreihenfolge")

@test("Ab FD und ab RO")
def _():
    eq(autobahn().TiefensucheAusführen("FD"), ["FD", "WÜ", "UL", "S", "LI", "A", "M", "N", "HO", "R", "RO"], "ab FD")
    eq(autobahn().TiefensucheAusführen("RO"), ["RO", "M", "A", "UL", "WÜ", "FD", "N", "HO", "R", "S", "LI"], "ab RO")

@test("Jeder Knoten genau einmal")
def _():
    r = autobahn().TiefensucheAusführen("N")
    eq(sorted(r), sorted(["FD", "WÜ", "UL", "S", "LI", "A", "M", "N", "HO", "R", "RO"]), "besuchte Knoten")

@test("KnotenBesuchen ist rekursiv")
def _():
    g = autobahn()
    g.besuchteKnoten.clear()
    r, rec = recursive(g.KnotenBesuchen, 6)
    ok(rec, "KnotenBesuchen muss sich selbst aufrufen")
--- hint
Übersetze die Brücke Zeile für Zeile. Denk an `self.` vor jedem Attribut und vor dem rekursiven Aufruf.
--- explain
Jeder Aufruf markiert *zuerst* seinen Knoten und besucht erst dann die Nachbarn, deshalb wird jeder Knoten genau einmal aufgerufen. Vergleiche die Reihenfolge mit der interaktiven Visualisierung oben (Start M, Matrixreihenfolge).
:::

:::exercise id=b3-back title="Besuchsreihenfolge mit „zurück nach“ (Aufgabe 4 b)" level=2
Erweitere `KnotenBesuchen` um zwei Ausgaben: Beim Betreten eines Knotens gib `besuche X` aus, und nach **jeder** Rückkehr aus einem rekursiven Aufruf gib `zurück nach X` aus, wobei X der aktuelle Knoten ist (der, dessen Aufruf weiterläuft).

Schreib zuerst auf Papier auf, welche Ausgabe du für den kleinen Graphen im Startcode erwartest, und führ es dann aus.
--- starter
class GraphMatrix:
    def __init__(self, namen, kanten):
        self.knoten = list(namen)
        self.matrix = [[-1] * len(namen) for i in range(len(namen))]
        self.besuchteKnoten = []
        for a, b in kanten:
            i, j = self.knoten.index(a), self.knoten.index(b)
            self.matrix[i][j] = 1
            self.matrix[j][i] = 1

    def KnotenBesuchen(self, aktuell):
        self.besuchteKnoten.append(aktuell)
        for nummer in range(len(self.knoten)):
            if self.matrix[aktuell][nummer] > 0 and nummer not in self.besuchteKnoten:
                self.KnotenBesuchen(nummer)


g = GraphMatrix(["A", "B", "C", "D"], [("A", "B"), ("A", "C"), ("B", "D")])
g.KnotenBesuchen(0)
--- solution
class GraphMatrix:
    def __init__(self, namen, kanten):
        self.knoten = list(namen)
        self.matrix = [[-1] * len(namen) for i in range(len(namen))]
        self.besuchteKnoten = []
        for a, b in kanten:
            i, j = self.knoten.index(a), self.knoten.index(b)
            self.matrix[i][j] = 1
            self.matrix[j][i] = 1

    def KnotenBesuchen(self, aktuell):
        self.besuchteKnoten.append(aktuell)
        print("besuche " + self.knoten[aktuell])
        for nummer in range(len(self.knoten)):
            if self.matrix[aktuell][nummer] > 0 and nummer not in self.besuchteKnoten:
                self.KnotenBesuchen(nummer)
                print("zurück nach " + self.knoten[aktuell])


g = GraphMatrix(["A", "B", "C", "D"], [("A", "B"), ("A", "C"), ("B", "D")])
g.KnotenBesuchen(0)
--- tests
@test("Ausgabe für den kleinen Graphen")
def _():
    eq(lines(OUTPUT), ["besuche A", "besuche B", "besuche D", "zurück nach B", "zurück nach A", "besuche C", "zurück nach A"], "ausgegebene Zeilen")

@test("Ausgabe für einen Weg A–B–C")
def _():
    g2 = GraphMatrix(["A", "B", "C"], [("A", "B"), ("B", "C")])
    out = printed(lambda: g2.KnotenBesuchen(0))
    eq(lines(out), ["besuche A", "besuche B", "besuche C", "zurück nach B", "zurück nach A"], "ausgegebene Zeilen")
--- hint
„zurück nach“ wird in dem Rahmen ausgegeben, der weiterläuft, also direkt **nach** der Zeile mit dem rekursiven Aufruf, innerhalb des `if`.
--- explain
Die „zurück“-Zeilen machen den Aufstieg sichtbar: Jeder Rahmen macht dort weiter, wo sein rekursiver Aufruf stand. Deine Vorhersage mit der Ausgabe zu vergleichen ist genau das, was Aufgabe 4 b verlangt.
:::

:::exercise id=b3-connected title="ZusammenhangTesten (Aufgabe 4 d)" level=2
Ergänze `ZusammenhangTesten()`, das `True` zurückgibt, wenn der Graph zusammenhängend ist. Verwende eine Tiefensuche ab Knoten 0. Ein Graph ohne Knoten gilt als zusammenhängend.
--- starter
class GraphMatrix:
    def __init__(self, namen, kanten):
        self.knoten = list(namen)
        self.matrix = [[-1] * len(namen) for i in range(len(namen))]
        self.besuchteKnoten = []
        for a, b in kanten:
            i, j = self.knoten.index(a), self.knoten.index(b)
            self.matrix[i][j] = 1
            self.matrix[j][i] = 1

    def KnotenBesuchen(self, aktuell):
        self.besuchteKnoten.append(aktuell)
        for nummer in range(len(self.knoten)):
            if self.matrix[aktuell][nummer] > 0 and nummer not in self.besuchteKnoten:
                self.KnotenBesuchen(nummer)

    def ZusammenhangTesten(self):
        pass
--- solution
class GraphMatrix:
    def __init__(self, namen, kanten):
        self.knoten = list(namen)
        self.matrix = [[-1] * len(namen) for i in range(len(namen))]
        self.besuchteKnoten = []
        for a, b in kanten:
            i, j = self.knoten.index(a), self.knoten.index(b)
            self.matrix[i][j] = 1
            self.matrix[j][i] = 1

    def KnotenBesuchen(self, aktuell):
        self.besuchteKnoten.append(aktuell)
        for nummer in range(len(self.knoten)):
            if self.matrix[aktuell][nummer] > 0 and nummer not in self.besuchteKnoten:
                self.KnotenBesuchen(nummer)

    def ZusammenhangTesten(self):
        if len(self.knoten) == 0:
            return True
        self.besuchteKnoten.clear()
        self.KnotenBesuchen(0)
        return len(self.besuchteKnoten) == len(self.knoten)
--- tests
@test("Ein zusammenhängender Graph")
def _():
    eq(GraphMatrix("ABCD", [("A", "B"), ("B", "C"), ("C", "D")]).ZusammenhangTesten(), True, "Weg A–B–C–D")

@test("Ein isolierter Knoten macht ihn nicht zusammenhängend")
def _():
    eq(GraphMatrix("ABCD", [("A", "B"), ("B", "C")]).ZusammenhangTesten(), False, "D isolated")

@test("Zwei getrennte Teile")
def _():
    eq(GraphMatrix("ABCDEF", [("A", "B"), ("B", "C"), ("C", "A"), ("D", "E"), ("E", "F")]).ZusammenhangTesten(), False, "zwei Dreiecke/Wege")

@test("Kann zweimal aufgerufen werden (Markierungen werden zurückgesetzt)")
def _():
    g = GraphMatrix("ABC", [("A", "B"), ("B", "C")])
    g.ZusammenhangTesten()
    eq(g.ZusammenhangTesten(), True, "zweiter Aufruf")

@test("Leerer Graph und einzelner Knoten")
def _():
    eq(GraphMatrix("", []).ZusammenhangTesten(), True, "leerer Graph")
    eq(GraphMatrix("A", []).ZusammenhangTesten(), True, "einzelner Knoten")
--- hint
Leere `besuchteKnoten`, starte `KnotenBesuchen(0)` und vergleiche dann die Zahl der besuchten Knoten mit der Zahl der Knoten.
--- explain
Das Leeren von `besuchteKnoten` zu vergessen ist ein klassischer Fehler: Eine zweite Tiefensuche würde die Markierungen der ersten sehen und nichts besuchen.
:::

:::exercise id=b3-attr title="Besucht als Attribut (Aufgabe 5 a)" level=2
Diesmal ist jeder Knoten ein `Knoten`-Objekt mit den Attributen `bezeichner` und `besucht`. Implementiere

- `KnotenBesuchen(aktuell)` mit `self.knoten[...].besucht` statt einer Liste (notiere die Besuchsreihenfolge für die Prüfungen in `self.reihenfolge`),
- `TiefensucheAusführen(start)`: `besucht` bei **allen** Knoten auf `False` zurücksetzen, `reihenfolge` leeren, die Suche beim Knoten namens `start` starten und `reihenfolge` (Liste von Namen) zurückgeben.
--- starter
class Knoten:
    def __init__(self, bezeichner):
        self.bezeichner = bezeichner
        self.besucht = False


class GraphMatrix:
    def __init__(self, namen, kanten):
        self.knoten = [Knoten(n) for n in namen]
        self.matrix = [[-1] * len(namen) for i in range(len(namen))]
        self.reihenfolge = []
        for a, b in kanten:
            i, j = namen.index(a), namen.index(b)
            self.matrix[i][j] = 1
            self.matrix[j][i] = 1

    def KnotenBesuchen(self, aktuell):
        pass

    def TiefensucheAusführen(self, start):
        pass
--- solution
class Knoten:
    def __init__(self, bezeichner):
        self.bezeichner = bezeichner
        self.besucht = False


class GraphMatrix:
    def __init__(self, namen, kanten):
        self.knoten = [Knoten(n) for n in namen]
        self.matrix = [[-1] * len(namen) for i in range(len(namen))]
        self.reihenfolge = []
        for a, b in kanten:
            i, j = namen.index(a), namen.index(b)
            self.matrix[i][j] = 1
            self.matrix[j][i] = 1

    def KnotenBesuchen(self, aktuell):
        self.knoten[aktuell].besucht = True
        self.reihenfolge.append(self.knoten[aktuell].bezeichner)
        for nummer in range(len(self.knoten)):
            if self.matrix[aktuell][nummer] > 0 and not self.knoten[nummer].besucht:
                self.KnotenBesuchen(nummer)

    def TiefensucheAusführen(self, start):
        for k in self.knoten:
            k.besucht = False
        self.reihenfolge.clear()
        for i in range(len(self.knoten)):
            if self.knoten[i].bezeichner == start:
                self.KnotenBesuchen(i)
        return self.reihenfolge
--- tests
KANTEN = [("A", "B"), ("A", "C"), ("B", "D"), ("C", "D"), ("D", "E")]

@test("Reihenfolge ab A")
def _():
    eq(GraphMatrix(list("ABCDE"), KANTEN).TiefensucheAusführen("A"), ["A", "B", "D", "C", "E"], "Reihenfolge")

@test("Eine zweite Suche funktioniert (besucht wird zurückgesetzt)")
def _():
    g = GraphMatrix(list("ABCDE"), KANTEN)
    g.TiefensucheAusführen("A")
    eq(list(g.TiefensucheAusführen("E")), ["E", "D", "B", "A", "C"], "Reihenfolge der zweiten Suche")

@test("Das Attribut besucht wird verwendet")
def _():
    g = GraphMatrix(list("ABCDE"), KANTEN)
    g.TiefensucheAusführen("A")
    ok(all(k.besucht for k in g.knoten), "nach der Suche muss jeder erreichbare Knoten besucht == True haben")
--- hint
Ersetze in `KnotenBesuchen` die Listenprüfung durch `not self.knoten[nummer].besucht`.
--- explain
Die Rücksetzschleife in `TiefensucheAusführen` ist der Preis dieser Variante: Die Markierungen stecken in den Knoten und müssen vor jeder neuen Suche gelöscht werden.
:::

:::exercise id=b3-bfs title="Breitensuche (Aufgabe 7)" level=2
Implementiere `BreitensucheAusführen(start)` **iterativ** mit einer Python-Liste als Warteschlange (`append` hinten, `pop(0)` vorne). Gib die Liste der Knoten**namen** in der Reihenfolge zurück, in der sie aus der Warteschlange genommen werden. Die Nachbarn werden in Matrixreihenfolge geprüft.
--- starter
class GraphMatrix:
    def __init__(self, namen, kanten):
        self.knoten = list(namen)
        self.matrix = [[-1] * len(namen) for i in range(len(namen))]
        for a, b in kanten:
            i, j = self.knoten.index(a), self.knoten.index(b)
            self.matrix[i][j] = 1
            self.matrix[j][i] = 1

    def BreitensucheAusführen(self, start):
        pass


K7 = GraphMatrix(["K1", "K2", "K3", "K4", "K5", "K6", "K7"],
                 [("K1", "K2"), ("K1", "K7"), ("K1", "K6"), ("K2", "K3"), ("K7", "K3"), ("K6", "K5"), ("K3", "K4"), ("K5", "K4")])
print(K7.BreitensucheAusführen("K1"))
--- solution
class GraphMatrix:
    def __init__(self, namen, kanten):
        self.knoten = list(namen)
        self.matrix = [[-1] * len(namen) for i in range(len(namen))]
        for a, b in kanten:
            i, j = self.knoten.index(a), self.knoten.index(b)
            self.matrix[i][j] = 1
            self.matrix[j][i] = 1

    def BreitensucheAusführen(self, start):
        s = self.knoten.index(start)
        besucht = [s]
        schlange = [s]
        reihenfolge = []
        while len(schlange) > 0:
            k = schlange.pop(0)
            reihenfolge.append(self.knoten[k])
            for n in range(len(self.knoten)):
                if self.matrix[k][n] > 0 and n not in besucht:
                    besucht.append(n)
                    schlange.append(n)
        return reihenfolge


K7 = GraphMatrix(["K1", "K2", "K3", "K4", "K5", "K6", "K7"],
                 [("K1", "K2"), ("K1", "K7"), ("K1", "K6"), ("K2", "K3"), ("K7", "K3"), ("K6", "K5"), ("K3", "K4"), ("K5", "K4")])
print(K7.BreitensucheAusführen("K1"))
--- tests
@test("Aufgabe 7 ab K1: K1, K2, K6, K7, K3, K5, K4")
def _():
    eq(K7.BreitensucheAusführen("K1"), ["K1", "K2", "K6", "K7", "K3", "K5", "K4"], "Reihenfolge")

@test("Ab K4")
def _():
    eq(K7.BreitensucheAusführen("K4"), ["K4", "K3", "K5", "K2", "K7", "K6", "K1"], "Reihenfolge")

@test("Unerreichbare Knoten werden nicht besucht")
def _():
    g = GraphMatrix(list("ABCD"), [("A", "B"), ("C", "D")])
    eq(g.BreitensucheAusführen("A"), ["A", "B"], "Reihenfolge")
--- hint
Markiere einen Knoten, wenn du ihn in die Warteschlange **hängst**, nicht, wenn du ihn herausnimmst. Sonst kann ein Knoten zweimal hineingeraten.
--- explain
Die Warteschlange garantiert, dass die Knoten in der Reihenfolge bearbeitet werden, in der sie entdeckt wurden: zuerst alle Knoten mit Entfernung 1, dann alle mit Entfernung 2 und so weiter.
:::

:::exercise id=b3-muesli title="Abitur 2016: MUESLIMATRIX" level=3
Implementiere die Klasse `MUESLIMATRIX` (Teilaufgaben b–d):

- **b)** Konstruktor: `self.knoten` = die sechs Namen in dieser Reihenfolge: Bananen, Dinkelflocken, Haferflocken, Mandeln, Rosinen, Schokolade; `self.matrix` = 6×6, alle Einträge **0**.
- `KanteEinfuegen(a, b, anzahl)` (gegeben)
- **c)** `dazuEmpfehlen(i)`: Gib für jedes j mit `matrix[i][j] > 1` den Satz `Viele Kunden haben zu Ihrer Zutat noch <name> gewählt.` aus.
- **d)** `erreichbareAusgeben(start)`: Gib jede Zutat aus, die von der Knotennummer `start` aus erreichbar ist (direkt oder indirekt), jede genau einmal, den Start eingeschlossen, in Tiefensuch-Reihenfolge (Matrixreihenfolge). Kanten sind Einträge ≠ 0.
--- starter
class MUESLIMATRIX:
    def __init__(self):
        self.knoten = []
        self.matrix = []

    def KanteEinfuegen(self, a, b, anzahl):
        i = self.knoten.index(a)
        j = self.knoten.index(b)
        self.matrix[i][j] = anzahl
        self.matrix[j][i] = anzahl

    def dazuEmpfehlen(self, i):
        pass

    def erreichbareAusgeben(self, start):
        pass


m = MUESLIMATRIX()
m.KanteEinfuegen("Dinkelflocken", "Haferflocken", 1)
m.KanteEinfuegen("Haferflocken", "Rosinen", 1)
m.KanteEinfuegen("Haferflocken", "Mandeln", 3)
m.KanteEinfuegen("Haferflocken", "Schokolade", 2)
m.KanteEinfuegen("Rosinen", "Mandeln", 1)
m.KanteEinfuegen("Mandeln", "Schokolade", 2)
m.dazuEmpfehlen(3)
--- solution
class MUESLIMATRIX:
    def __init__(self):
        self.knoten = ["Bananen", "Dinkelflocken", "Haferflocken", "Mandeln", "Rosinen", "Schokolade"]
        self.matrix = []
        for i in range(6):
            self.matrix.append([0] * 6)

    def KanteEinfuegen(self, a, b, anzahl):
        i = self.knoten.index(a)
        j = self.knoten.index(b)
        self.matrix[i][j] = anzahl
        self.matrix[j][i] = anzahl

    def dazuEmpfehlen(self, i):
        for j in range(len(self.knoten)):
            if self.matrix[i][j] > 1:
                print("Viele Kunden haben zu Ihrer Zutat noch " + self.knoten[j] + " gewählt.")

    def erreichbareAusgeben(self, start):
        besucht = []
        self.besuchen(start, besucht)

    def besuchen(self, i, besucht):
        besucht.append(i)
        print(self.knoten[i])
        for j in range(len(self.knoten)):
            if self.matrix[i][j] != 0 and j not in besucht:
                self.besuchen(j, besucht)


m = MUESLIMATRIX()
m.KanteEinfuegen("Dinkelflocken", "Haferflocken", 1)
m.KanteEinfuegen("Haferflocken", "Rosinen", 1)
m.KanteEinfuegen("Haferflocken", "Mandeln", 3)
m.KanteEinfuegen("Haferflocken", "Schokolade", 2)
m.KanteEinfuegen("Rosinen", "Mandeln", 1)
m.KanteEinfuegen("Mandeln", "Schokolade", 2)
m.dazuEmpfehlen(3)
--- tests
def muesli():
    m = MUESLIMATRIX()
    for a, b, n in [("Dinkelflocken", "Haferflocken", 1), ("Haferflocken", "Rosinen", 1), ("Haferflocken", "Mandeln", 3),
                    ("Haferflocken", "Schokolade", 2), ("Rosinen", "Mandeln", 1), ("Mandeln", "Schokolade", 2)]:
        m.KanteEinfuegen(a, b, n)
    return m

@test("b) knoten und eine 6×6-Nullmatrix")
def _():
    m = MUESLIMATRIX()
    eq(m.knoten, ["Bananen", "Dinkelflocken", "Haferflocken", "Mandeln", "Rosinen", "Schokolade"], "knoten")
    eq(m.matrix, [[0] * 6 for i in range(6)], "matrix")
    m.matrix[0][1] = 9
    eq(m.matrix[1][1], 0, "Zeilen müssen unabhängig sein: matrix[1][1]")

@test("c) Empfehlungen für Mandeln (Index 3)")
def _():
    out = printed(lambda: muesli().dazuEmpfehlen(3))
    eq(lines(out), ["Viele Kunden haben zu Ihrer Zutat noch Haferflocken gewählt.", "Viele Kunden haben zu Ihrer Zutat noch Schokolade gewählt."], "ausgegebene Zeilen")

@test("c) Keine Empfehlung für Dinkelflocken und Bananen")
def _():
    eq(printed(lambda: muesli().dazuEmpfehlen(1)).strip(), "", "Ausgabe für Dinkelflocken")
    eq(printed(lambda: muesli().dazuEmpfehlen(0)).strip(), "", "Ausgabe für Bananen")

@test("d) Erreichbar von Dinkelflocken")
def _():
    out = printed(lambda: muesli().erreichbareAusgeben(1))
    eq(lines(out), ["Dinkelflocken", "Haferflocken", "Mandeln", "Rosinen", "Schokolade"], "ausgegebene Zeilen")

@test("d) Bananen erreicht nur sich selbst")
def _():
    eq(lines(printed(lambda: muesli().erreichbareAusgeben(0))), ["Bananen"], "ausgegebene Zeilen")
--- hint
c) Lies Zeile `i` der Matrix: eine `for`-Schleife, ein `if`.
--- hint
d) Eine rekursive Hilfsmethode mit einer Liste der besuchten Nummern, genau wie `KnotenBesuchen`, die den Namen ausgibt, wenn ein Knoten besucht wird.
--- explain
d) ist eine Tiefensuche auf einer Matrix mit 0 statt −1 als „keine Kante“ (die Prüfung lautet also `!= 0`). Weil jeder Knoten markiert wird, bevor seine Nachbarn besucht werden, wird jede erreichbare Zutat genau einmal ausgegeben.
:::

## [exam] Klausurtraining

:::exam title="Tiefensuche und Breitensuche von Hand" points=6
Graph: Knoten A–F, ungerichtete Kanten A–B, A–C, B–D, C–D, C–E, D–F, E–F. Die Nachbarn werden in alphabetischer Reihenfolge genommen.
a) Gib die Reihenfolge der Tiefensuche ab A an und zeichne den Tiefensuchbaum.
b) Gib die Reihenfolge der Breitensuche ab A an.
c) Welche Kanten benutzt die Tiefensuche nicht?
--- solution
a) A, B, D, C, E, F. (A→B→D; Nachbarn von D: B ✓, C → C; Nachbarn von C: A ✓, D ✓, E → E; Nachbarn von E: C ✓, F → F; Nachbarn von F: D ✓, E ✓.) Tiefensuchbaum: A–B, B–D, D–C, C–E, E–F.

b) A, B, C, D, E, F. (Warteschlange: A → B, C → D (von B) → E (von C) → F (von D).)

c) A–C und D–F führen zu Knoten, die schon besucht sind, und werden deshalb nicht benutzt.
:::

:::exam title="Adjazenzmatrix, gerichtet und gewichtet" points=4
Schreib die Adjazenzmatrix (− für keine Kante) des Graphen aus 12_I_3_Wiederholung auf und erkläre, wie man an einer Matrix erkennt, ob ein Graph ungerichtet ist.
--- solution
Siehe die Matrix im Logik-Abschnitt (Zeilen A–E: A: B4; B: A4, C3, D7, E8; C: E5; D: A5, E2; E: B8, C5, D2). Ein Graph ist genau dann ungerichtet, wenn seine Matrix **symmetrisch** ist: `matrix[i][j] == matrix[j][i]` für alle i, j. Hier ist sie es nicht (z. B. B→C = 3, aber C→B = –).
:::

:::exam title="Abitur 2016, Teilaufgabe c" points=5
Stelle den Algorithmus von `dazuEmpfehlen(i)` als Struktogramm dar.
--- solution
Siehe das Struktogramm im Logik-Abschnitt: eine Zählschleife `für j von 0 bis 5` mit einer Verzweigung `matrix[i][j] > 1`; der wahr-Zweig gibt *„Viele Kunden haben zu Ihrer Zutat noch " + knoten[j] + " gewählt.“* aus, der falsch-Zweig ist leer.
:::
