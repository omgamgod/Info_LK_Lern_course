---
id: b4
num: B4
part: B
title: "Anwendungen der Tiefensuche: optimale Lösungen"
short: Optimale Lösungen
lead: Die Tiefensuche erreicht jeden Knoten, findet aber nicht den kürzesten Weg. Mit zwei kleinen Änderungen (Knoten auf dem Rückweg wieder freigeben, den besten vollständigen Weg merken) findet sie alle Wege und den optimalen. Diese Lektion wendet das auf das Autobahnnetz, das Labyrinth und den Handlungsreisenden an.
minutes: 100
uses: [b3, b2, a6]
goals:
  - die zwei Änderungen erklären, die aus der Tiefensuche eine Suche nach <b>allen Wegen</b> machen
  - alle Wege zwischen zwei Knoten in der Reihenfolge des Algorithmus mit ihren Längen auflisten (Aufgabe 1)
  - den optimalen Weg korrekt als Kopie speichern (<code>list(self.aktuellerWeg)</code>) und aussichtslose Zweige abschneiden
  - einen Weg aus einem Labyrinth finden (Ariadnefaden) und den kürzesten
  - den Handlungsreisenden mit Backtracking lösen
---

## [logic] Von „alles besuchen“ zu „den besten Weg finden“ (12_I_4_Einstieg)

Das Projekt **WEGE** sucht einen Weg von M nach N. Bei der normalen Tiefensuche wird jeder Knoten höchstens einmal besucht; die Suche findet also *einen* Weg, weiß aber nicht, ob er der kürzeste ist. Ein kürzerer Weg braucht vielleicht einen Knoten, den die Suche auf einem anderen Zweig schon verbraucht hat.

Um den **optimalen** Weg zu finden, muss die Suche **jeden möglichen Weg** vom Start zum Ziel ausprobieren. Zwei Änderungen an `KnotenBesuchen` genügen:

1. **Auf dem Rückweg die Markierung entfernen.** Wenn ein Aufruf fertig ist, wird sein Knoten wieder aus den besuchten Knoten entfernt. „Besucht“ bedeutet jetzt **„liegt auf dem aktuellen Weg“**, nicht „jemals gesehen“. Ein Knoten kann deshalb auf vielen verschiedenen Wegen vorkommen, aber nie zweimal auf demselben Weg (keine Zyklen).
2. **Am Ziel anhalten.** Ist das Ziel erreicht, ist ein Weg vollständig; er wird nicht weiter verlängert.

```pseudo
methode KnotenBesuchen(aktuell, ziel)
    aktuell markieren
    falls aktuell == ziel dann
        Weg ausgeben                              // ein vollständiger Weg
    sonst
        für jeden Nachbarn k von aktuell
            falls k nicht markiert dann
                KnotenBesuchen(k, ziel)
            endefalls
        endefür
    endefalls
    Markierung von aktuell wieder entfernen      // NEU: Markierung entfernen
endemethode
```

Jetzt durchläuft die Suche den **vollständigen Entscheidungsbaum** aller einfachen Wege: Backtracking (B2) in seiner reinsten Form.

### Den besten Weg merken

Um das Optimum zu finden, führt die Suche Buch über

- `aktuellerWeg`: die Knoten des aktuellen Wegs (anhängen beim Betreten eines Knotens, entfernen beim Verlassen),
- `länge`: die Länge des aktuellen Wegs, als Parameter übergeben (jeder Aufruf addiert das Gewicht der Kante, über die er gekommen ist),
- `optimalerWeg` und `optimaleLänge`: den besten bisher gefundenen vollständigen Weg (`optimaleLänge` beginnt bei ∞, damit der erste vollständige Weg immer besser ist).

Am Ziel: Wenn `länge < optimaleLänge`, wird der aktuelle Weg das neue Optimum, **gespeichert als Kopie**.

:::warn title="Die Kopie ist unverzichtbar"
`aktuellerWeg` ändert sich bis zum Ende der Suche ständig, und ganz am Ende ist er wieder leer. `optimalerWeg = aktuellerWeg` würde nur einen zweiten Verweis auf diese Liste speichern, und der beste Weg ginge verloren. Deine Vorlage schreibt `self.optimalerWeg = list(self.aktuellerWeg)` (siehe Lektion A6).
:::

Geh alle Wege von **UL** (Ulm) nach **HO** (Hof) auf dem Autobahngraphen deiner Vorlage Schritt für Schritt durch. Beobachte `aktuellerWeg`, die Liste der vollständigen Wege und das aktuelle Optimum:

:::viz paths
{"graph": "autobahn", "start": "UL", "goal": "HO"}
:::

Der Algorithmus findet **10 Wege** (12_I_4_Aufgabe_1), in dieser Reihenfolge:

| # | Weg | Länge |
|---|---|---|
| 1 | UL – WÜ – N – M – R – HO | 715 |
| 2 | UL – WÜ – N – HO | 385 |
| 3 | UL – WÜ – N – R – HO | 515 |
| 4 | UL – WÜ – HO | **357** ← Optimum |
| 5 | UL – A – M – N – WÜ – HO | 582 |
| 6 | UL – A – M – N – HO | 402 |
| 7 | UL – A – M – N – R – HO | 532 |
| 8 | UL – A – M – R – N – WÜ – HO | 616 |
| 9 | UL – A – M – R – N – HO | 436 |
| 10 | UL – A – M – R – HO | 406 |

Die Reihenfolge folgt der Matrixreihenfolge der Nachbarn (FD, WÜ, UL, S, LI, A, M, N, HO, R, RO): Von UL aus probiert die Suche zuerst WÜ, dann A. Von WÜ aus probiert sie N vor HO.

### Abschneiden

Ist der aktuelle Weg **schon mindestens so lang** wie der beste vollständige Weg, kann ihn jede Verlängerung nur länger machen. Der Zweig kann sofort aufgegeben werden. Setz in der Visualisierung oben das Häkchen bei *zu lange Wege abschneiden* und vergleiche die Zahl der Schritte. Diese Idee heißt **Branch and Bound**. Sie ändert nichts am Ergebnis, nur am Aufwand.

### Wie aufwendig ist das?

Die Zahl der einfachen Wege kann mit der Größe des Graphen exponentiell wachsen. Für kleine Graphen wie das Autobahnnetz ist das kein Problem; für eine echte Straßenkarte mit Tausenden von Kreuzungen ist es hoffnungslos. Navigationssysteme verwenden deshalb klügere Algorithmen (z. B. Dijkstra, der dir später vielleicht begegnet). Hier geht es um das Prinzip: **alles systematisch ausprobieren, das Beste merken**.

## [logic] Das Labyrinth (12_I_4_Aufgabe_3 und 6)

Theseus findet mit dem **Ariadnefaden** aus dem Labyrinth des Minotauros: Er wickelt den Faden beim Gehen ab, und in einer Sackgasse wickelt er ihn bis zur letzten Kreuzung wieder auf und probiert dort den nächsten Gang. Eine Kreuzung, an der schon Faden liegt, ist besucht.

Als Graph: Kreuzungen, Abzweigungen und die Enden von Sackgassen sind die **Knoten**, die Gänge sind die **Kanten**. (Deine Vorlage macht einfach jede freie Zelle zu einem Knoten.)

**Teil 1: irgendein Weg hinaus.** Tiefensuche mit einer Wegliste (dem Faden):

- Knoten betreten: an `weg` anhängen (Faden abwickeln),
- Ziel erreicht: `wahr` zurückgeben, und der Faden ist der Weg hinaus,
- Sackgasse (kein unbesuchter Nachbar führt zum Ausgang): den Knoten aus `weg` entfernen (Faden aufwickeln) und `falsch` zurückgeben.

Eine Regel für die Wahl des Gangs an einer Kreuzung könnte sein: *immer der am weitesten links liegende Gang, in dem noch kein Faden liegt* (jede feste Reihenfolge funktioniert). Eine besuchte Kreuzung erkennt man am Faden (oder an einer Kreidemarkierung).

Hier werden die Knoten auf dem Rückweg **nicht** wieder freigegeben: Eine Sackgasse bleibt eine Sackgasse, man muss sie also nicht noch einmal erkunden, wenn nur *irgendein* Weg gesucht ist.

**Teil 2: der kürzeste Weg hinaus.** Verwende das Verfahren aus dem vorigen Abschnitt: auf dem Rückweg freigeben, die Längen vergleichen, eine Kopie des besten Wegs aufheben.

:::viz maze
{"w": 15, "h": 11, "seed": 7}
:::

## [logic] Der Handlungsreisende (12_I_4_Aufgabe_7)

*Ein Handlungsreisender soll von seinem Büro aus alle Kunden besuchen und dann ins Büro zurückkehren. Die Reise soll so kurz wie möglich sein.* Das ist das berühmte **Problem des Handlungsreisenden** (Traveling Salesman Problem, TSP).

Die Vorlage vereinfacht zuerst eine Sache: `AlleVerbindungenBerechnen()` (Algorithmus von Floyd–Warshall, gegeben) ersetzt jeden Eintrag der Matrix durch die Länge der **kürzesten Verbindung** zwischen den beiden Städten, eventuell über andere Städte. Danach ist jede Stadt direkt mit jeder anderen verbunden, und der Reisende muss nie eine Stadt zweimal besuchen. (Ob der Weg von München nach Würzburg über Nürnberg oder über Ulm führt, spielt für die Rundreise keine Rolle.)

Dann Backtracking über alle Reihenfolgen:

```pseudo
methode KnotenBesuchen(aktuell, büro, länge)
    aktuell markieren, an aktuellerWeg anhängen
    falls alle Knoten markiert dann
        gesamt = länge + Entfernung(aktuell, büro)       // Rückweg nach Hause
        falls gesamt < optimaleLänge dann
            optimaleLänge = gesamt
            optimalerWeg = Kopie von aktuellerWeg
        endefalls
    sonst
        für jeden nicht markierten Knoten k
            KnotenBesuchen(k, büro, länge + Entfernung(aktuell, k))
        endefür
    endefalls
    Markierung entfernen, aktuell aus aktuellerWeg entfernen
endemethode
```

:::viz paths
{"graph": "autobahn_klein", "start": "M", "mode": "tour", "title": "Handlungsreisender auf Autobahn_klein (nach AlleVerbindungenBerechnen)"}
:::

Auf `Autobahn_klein` (M, N, HO, R, RO) ist die beste Rundreise ab M **M – N – HO – R – RO – M mit 682 km**.

Bei n Städten gibt es (n − 1)! Reihenfolgen (jede Rundreise wird zweimal gefunden, einmal in jeder Richtung). 10 Städte bedeuten schon 362.880 Reihenfolgen; 20 Städte etwa 1,2 · 10¹⁷. Für das TSP ist kein effizienter exakter Algorithmus bekannt, deshalb ist Abschneiden wichtig.

**Aufgabe 7 b (bester Bürostandort)**: Interessanterweise ist die optimale **Rundreise** für jede Startstadt gleich: Eine Rundreise ist ein geschlossener Zyklus, und es ist egal, wo auf dem Zyklus man anfängt. Auf Autobahn_klein ist das Optimum von M, N, HO, R und RO aus gleichermaßen 682 km. Berechnet das Programm das Optimum für jedes mögliche Büro, sind alle Ergebnisse gleich. Der Bürostandort spielt nur dann eine Rolle, wenn der Reisende zum Beispiel nicht nach Hause zurückkehrt oder wenn zusätzliche Fahrten vom Büro aus gezählt werden.

## [bridge] Vom Pseudocode zu den Vorlagen

:::bridge title="KnotenBesuchen2 in Kurze_Wege.py (alle Wege + Optimum)" right="Python (K3_4_A00 Kurze_Wege.py, ohne die Farben)"
methode KnotenBesuchen(aktuell, ziel, länge)  || def KnotenBesuchen2(self, aktuell, ziel, länge):
    aktuell markieren                        ||     self.besuchteKnoten.append(self.knoten[aktuell])
    aktuell an aktuellerWeg anhängen         ||     self.aktuellerWeg.append(self.knoten[aktuell])
    falls aktuell == ziel dann               ||     if aktuell == ziel:
        falls länge < optimaleLänge dann     ||         if länge < self.optimaleLänge:
            optimalerWeg = Kopie             ||             self.optimalerWeg = list(self.aktuellerWeg)
            optimaleLänge = länge            ||             self.optimaleLänge = länge
    sonst                                    ||     else:
        für jeden Knoten nummer              ||         for nummer in range(len(self.knoten)):
            falls Kante und nicht markiert   ||             if (self.matrix[aktuell][nummer] > 0 and
                                             ||                     self.knoten[nummer] not in self.besuchteKnoten):
                KnotenBesuchen(nummer, ziel, ||                 self.KnotenBesuchen2(nummer, ziel,
                  länge + Gewicht)           ||                     länge + self.matrix[aktuell][nummer])
    Markierung entfernen                     ||     self.besuchteKnoten.remove(self.knoten[aktuell])
    aktuell aus aktuellerWeg entfernen       ||     self.aktuellerWeg.pop()
>> Achtung: Diese Vorlage speichert in `besuchteKnoten` die `Knoten`-**Objekte** (nicht die Nummern). `ZurueckSetzen()` setzt vor jeder Suche `self.optimaleLänge = float('inf')` (∞). `länge` ist ein Parameter, also hat jeder Rahmen seinen eigenen Wert, und auf dem Rückweg muss nichts abgezogen werden.
:::

:::bridge title="Labyrinth1.py, Teil 1: beim ersten Weg hinaus anhalten" right="Python (K3_4_A03 Labyrinth1.py)"
methode KnotenBesuchen(aktuell, ziel) -> WAHRHEITSWERT || def KnotenBesuchen(self, aktuell, ziel):
    aktuell markieren                     ||     self.besuchteKnoten.append(self.knoten[aktuell])
    aktuell an weg anhängen               ||     self.weg.append(self.knoten[aktuell])
    falls aktuell == ziel dann            ||     if aktuell == ziel:
        return wahr                       ||         return True
    für jeden Nachbarn nummer             ||     for nummer in range(len(self.knoten)):
        falls Kante und nicht markiert    ||         if (self.matrix[aktuell][nummer] > 0 and
                                          ||                 self.knoten[nummer] not in self.besuchteKnoten):
            falls KnotenBesuchen(nummer)  ||             if self.KnotenBesuchen(nummer, ziel):
                return wahr               ||                 return True
    aktuell aus weg entfernen             ||     self.weg.pop()
    return falsch                         ||     return False
>> Das ist die Version, die du selbst in deinem PyCharm-Projekt geschrieben hast, und sie ist richtig. `TiefensucheAusfuehren` gibt `self.weg` zurück, den Theseus dann entlanggeht.
:::

## [python] Python-Blöcke

Alle Blöcke verwenden eine kompakte `GraphMatrix` mit Knoten**namen** in `self.knoten` und Nummern als Indizes, wie in B3.

:::exercise id=b4-all title="Alle Wege (Aufgabe 1)" level=2
Implementiere `KnotenBesuchen(aktuell, ziel)` so, dass es **jeden** Weg vom Start zu `ziel` als Liste von Namen in `self.wege` speichert, in der Reihenfolge des Algorithmus. Verwende `self.besuchteKnoten` (Nummern) und `self.aktuellerWeg` (Namen) und entferne beide Einträge am Ende des Aufrufs wieder.

`AlleWege(start, ziel)` (gegeben) setzt die Listen zurück und startet die Suche.
--- starter
class GraphMatrix:
    def __init__(self, namen, kanten):
        self.knoten = list(namen)
        self.matrix = [[-1] * len(namen) for i in range(len(namen))]
        for a, b, w in kanten:
            i, j = self.knoten.index(a), self.knoten.index(b)
            self.matrix[i][j] = w
            self.matrix[j][i] = w
        self.besuchteKnoten = []
        self.aktuellerWeg = []
        self.wege = []

    def KnotenBesuchen(self, aktuell, ziel):
        pass

    def AlleWege(self, start, ziel):
        self.besuchteKnoten = []
        self.aktuellerWeg = []
        self.wege = []
        self.KnotenBesuchen(self.knoten.index(start), self.knoten.index(ziel))
        return self.wege


AUTOBAHN = GraphMatrix(["FD", "WÜ", "UL", "S", "LI", "A", "M", "N", "HO", "R", "RO"],
    [("WÜ", "FD", 86), ("S", "UL", 103), ("UL", "WÜ", 165), ("UL", "LI", 126), ("UL", "A", 59),
     ("A", "M", 64), ("M", "N", 163), ("WÜ", "N", 104), ("N", "HO", 116), ("N", "R", 80),
     ("R", "M", 117), ("M", "RO", 60), ("HO", "R", 166), ("WÜ", "HO", 192)])

for w in AUTOBAHN.AlleWege("UL", "HO"):
    print(w)
--- solution
class GraphMatrix:
    def __init__(self, namen, kanten):
        self.knoten = list(namen)
        self.matrix = [[-1] * len(namen) for i in range(len(namen))]
        for a, b, w in kanten:
            i, j = self.knoten.index(a), self.knoten.index(b)
            self.matrix[i][j] = w
            self.matrix[j][i] = w
        self.besuchteKnoten = []
        self.aktuellerWeg = []
        self.wege = []

    def KnotenBesuchen(self, aktuell, ziel):
        self.besuchteKnoten.append(aktuell)
        self.aktuellerWeg.append(self.knoten[aktuell])
        if aktuell == ziel:
            self.wege.append(list(self.aktuellerWeg))
        else:
            for nummer in range(len(self.knoten)):
                if self.matrix[aktuell][nummer] > 0 and nummer not in self.besuchteKnoten:
                    self.KnotenBesuchen(nummer, ziel)
        self.besuchteKnoten.remove(aktuell)
        self.aktuellerWeg.pop()

    def AlleWege(self, start, ziel):
        self.besuchteKnoten = []
        self.aktuellerWeg = []
        self.wege = []
        self.KnotenBesuchen(self.knoten.index(start), self.knoten.index(ziel))
        return self.wege


AUTOBAHN = GraphMatrix(["FD", "WÜ", "UL", "S", "LI", "A", "M", "N", "HO", "R", "RO"],
    [("WÜ", "FD", 86), ("S", "UL", 103), ("UL", "WÜ", 165), ("UL", "LI", 126), ("UL", "A", 59),
     ("A", "M", 64), ("M", "N", 163), ("WÜ", "N", 104), ("N", "HO", 116), ("N", "R", 80),
     ("R", "M", 117), ("M", "RO", 60), ("HO", "R", 166), ("WÜ", "HO", 192)])

for w in AUTOBAHN.AlleWege("UL", "HO"):
    print(w)
--- tests
EXPECTED = ["UL-WÜ-N-M-R-HO", "UL-WÜ-N-HO", "UL-WÜ-N-R-HO", "UL-WÜ-HO", "UL-A-M-N-WÜ-HO", "UL-A-M-N-HO",
            "UL-A-M-N-R-HO", "UL-A-M-R-N-WÜ-HO", "UL-A-M-R-N-HO", "UL-A-M-R-HO"]

@test("UL → HO: 10 Wege")
def _():
    eq(len(AUTOBAHN.AlleWege("UL", "HO")), 10, "Anzahl der Wege")

@test("UL → HO: die Wege in der Reihenfolge des Algorithmus")
def _():
    eq(["-".join(w) for w in AUTOBAHN.AlleWege("UL", "HO")], EXPECTED, "Wege")

@test("Start gleich Ziel → ein Weg [start]")
def _():
    eq(AUTOBAHN.AlleWege("M", "M"), [["M"]], "AlleWege('M', 'M')")

@test("Die Listen sind nach der Suche wieder leer")
def _():
    AUTOBAHN.AlleWege("UL", "HO")
    eq((AUTOBAHN.besuchteKnoten, AUTOBAHN.aktuellerWeg), ([], []), "(besuchteKnoten, aktuellerWeg)")
--- hint
Verglichen mit `KnotenBesuchen` aus B3: (1) am Ziel eine **Kopie** von `aktuellerWeg` speichern und nicht weitergehen; (2) ganz am Ende der Methode `aktuell` aus beiden Listen entfernen.
--- hint
`self.besuchteKnoten.remove(aktuell)` und `self.aktuellerWeg.pop()` müssen bei **jedem** Aufruf laufen, auch am Ziel; schreib sie deshalb hinter das `if/else`.
--- explain
Das Freigeben am Ende macht aus „besucht“ ein „liegt auf dem aktuellen Weg“, und genau dadurch findet die Suche alle 10 Wege statt nur einen.
:::

:::exercise id=b4-best title="Der kürzeste Weg (KnotenBesuchen2)" level=2
Implementiere jetzt die Optimumsuche: `KnotenBesuchen2(aktuell, ziel, länge)` mit `self.aktuellerWeg`, `self.optimalerWeg` und `self.optimaleLänge` wie in deiner Vorlage. Schneide zusätzlich einen Zweig **ab**, sobald `länge >= self.optimaleLänge` ist. `KuerzesterWeg(start, ziel)` (gegeben) gibt `(optimalerWeg, optimaleLänge)` zurück.
--- starter
class GraphMatrix:
    def __init__(self, namen, kanten):
        self.knoten = list(namen)
        self.matrix = [[-1] * len(namen) for i in range(len(namen))]
        for a, b, w in kanten:
            i, j = self.knoten.index(a), self.knoten.index(b)
            self.matrix[i][j] = w
            self.matrix[j][i] = w
        self.besuchteKnoten = []
        self.aktuellerWeg = []
        self.optimalerWeg = []
        self.optimaleLänge = float('inf')

    def KnotenBesuchen2(self, aktuell, ziel, länge):
        pass

    def KuerzesterWeg(self, start, ziel):
        self.besuchteKnoten = []
        self.aktuellerWeg = []
        self.optimalerWeg = []
        self.optimaleLänge = float('inf')
        self.KnotenBesuchen2(self.knoten.index(start), self.knoten.index(ziel), 0)
        return self.optimalerWeg, self.optimaleLänge


AUTOBAHN = GraphMatrix(["FD", "WÜ", "UL", "S", "LI", "A", "M", "N", "HO", "R", "RO"],
    [("WÜ", "FD", 86), ("S", "UL", 103), ("UL", "WÜ", 165), ("UL", "LI", 126), ("UL", "A", 59),
     ("A", "M", 64), ("M", "N", 163), ("WÜ", "N", 104), ("N", "HO", 116), ("N", "R", 80),
     ("R", "M", 117), ("M", "RO", 60), ("HO", "R", 166), ("WÜ", "HO", 192)])

print(AUTOBAHN.KuerzesterWeg("UL", "HO"))
--- solution
class GraphMatrix:
    def __init__(self, namen, kanten):
        self.knoten = list(namen)
        self.matrix = [[-1] * len(namen) for i in range(len(namen))]
        for a, b, w in kanten:
            i, j = self.knoten.index(a), self.knoten.index(b)
            self.matrix[i][j] = w
            self.matrix[j][i] = w
        self.besuchteKnoten = []
        self.aktuellerWeg = []
        self.optimalerWeg = []
        self.optimaleLänge = float('inf')

    def KnotenBesuchen2(self, aktuell, ziel, länge):
        if länge >= self.optimaleLänge:
            return
        self.besuchteKnoten.append(aktuell)
        self.aktuellerWeg.append(self.knoten[aktuell])
        if aktuell == ziel:
            self.optimalerWeg = list(self.aktuellerWeg)
            self.optimaleLänge = länge
        else:
            for nummer in range(len(self.knoten)):
                if self.matrix[aktuell][nummer] > 0 and nummer not in self.besuchteKnoten:
                    self.KnotenBesuchen2(nummer, ziel, länge + self.matrix[aktuell][nummer])
        self.besuchteKnoten.remove(aktuell)
        self.aktuellerWeg.pop()

    def KuerzesterWeg(self, start, ziel):
        self.besuchteKnoten = []
        self.aktuellerWeg = []
        self.optimalerWeg = []
        self.optimaleLänge = float('inf')
        self.KnotenBesuchen2(self.knoten.index(start), self.knoten.index(ziel), 0)
        return self.optimalerWeg, self.optimaleLänge


AUTOBAHN = GraphMatrix(["FD", "WÜ", "UL", "S", "LI", "A", "M", "N", "HO", "R", "RO"],
    [("WÜ", "FD", 86), ("S", "UL", 103), ("UL", "WÜ", 165), ("UL", "LI", 126), ("UL", "A", 59),
     ("A", "M", 64), ("M", "N", 163), ("WÜ", "N", 104), ("N", "HO", 116), ("N", "R", 80),
     ("R", "M", 117), ("M", "RO", 60), ("HO", "R", 166), ("WÜ", "HO", 192)])

print(AUTOBAHN.KuerzesterWeg("UL", "HO"))
--- tests
@test("UL → HO: UL-WÜ-HO, 357")
def _():
    eq(AUTOBAHN.KuerzesterWeg("UL", "HO"), (["UL", "WÜ", "HO"], 357), "KuerzesterWeg('UL', 'HO')")

@test("M → N: direkt, 163; S → RO: 286; FD → RO: 413")
def _():
    eq(AUTOBAHN.KuerzesterWeg("M", "N"), (["M", "N"], 163), "M → N")
    eq(AUTOBAHN.KuerzesterWeg("S", "RO"), (["S", "UL", "A", "M", "RO"], 286), "S → RO")
    eq(AUTOBAHN.KuerzesterWeg("FD", "RO"), (["FD", "WÜ", "N", "M", "RO"], 413), "FD → RO")

@test("Das Optimum ist eine Kopie, nicht die Arbeitsliste")
def _():
    w, l = AUTOBAHN.KuerzesterWeg("UL", "HO")
    ok(w is not AUTOBAHN.aktuellerWeg, "optimalerWeg muss eine Kopie (list(...)) von aktuellerWeg sein")

@test("Es wird wirklich abgeschnitten")
def _():
    calls = [0]
    orig = GraphMatrix.KnotenBesuchen2
    def counting(self, a, z, l):
        calls[0] += 1
        return orig(self, a, z, l)
    GraphMatrix.KnotenBesuchen2 = counting
    try:
        r = AUTOBAHN.KuerzesterWeg("WÜ", "FD")
    finally:
        GraphMatrix.KnotenBesuchen2 = orig
    eq(r, (["WÜ", "FD"], 86), "KuerzesterWeg('WÜ', 'FD')")
    ok(calls[0] < 30, f"WÜ → FD brauchte {calls[0]} Aufrufe von KnotenBesuchen2. Mit Abschneiden sind es weniger als 30 (ohne: 74). Ergänze: if länge >= self.optimaleLänge: return")
--- hint
Fang wie `KnotenBesuchen` aus dem vorigen Block an. Am Ziel vergleichst du mit dem Optimum. Beachte: Mit dem Abschneiden ganz am Anfang (`if länge >= self.optimaleLänge: return`) ist jeder Weg, der das Ziel erreicht, automatisch kürzer als das alte Optimum.
--- hint
Die Abschneide-Prüfung muss **vor** dem Markieren des Knotens stehen, sonst würdest du zurückkehren, ohne die Markierung zu entfernen.
--- explain
Ohne Abschneiden werden alle 10 Wege vollständig durchlaufen. Mit Abschneiden wird jeder Zweig gestoppt, sobald er nicht kürzer ist als der beste bisher gefundene Weg. Das Ergebnis ist dasselbe, mit weniger Aufrufen.
:::

:::exercise id=b4-maze title="Ein Weg aus dem Labyrinth (Aufgabe 3)" level=2
Das Labyrinth ist eine Liste von Strings: `#` Wand, `.` Gang, `S` Start (Theseus), `A` Ausgang. Schreib `weg_finden(lab)`, das einen Weg von S nach A als Liste von `(zeile, spalte)`-Tupeln zurückgibt (Start und Ausgang eingeschlossen), oder `None`, wenn es keinen Weg gibt.

Verwende eine Tiefensuche mit einer Wegliste (dem Faden) wie in Labyrinth1.py: eine rekursive Hilfsfunktion `besuchen(z, s)`, die `True` zurückgibt, wenn sie den Ausgang erreicht hat. Nachbarn: unten, rechts, oben, links.
--- starter
def weg_finden(lab):
    hoehe = len(lab)
    breite = len(lab[0])
    besucht = []
    weg = []

    # den Anfang finden
    for z in range(hoehe):
        for s in range(breite):
            if lab[z][s] == "S":
                start = (z, s)

    def besuchen(z, s):
        pass

    if besuchen(start[0], start[1]):
        return weg
    return None


LAB = ["#########",
       "#S..#...#",
       "#.#.#.#.#",
       "#.#...#.#",
       "#.#####.#",
       "#...#...A",
       "#########"]
print(weg_finden(LAB))
--- solution
def weg_finden(lab):
    hoehe = len(lab)
    breite = len(lab[0])
    besucht = []
    weg = []

    # den Anfang finden
    for z in range(hoehe):
        for s in range(breite):
            if lab[z][s] == "S":
                start = (z, s)

    def besuchen(z, s):
        besucht.append((z, s))
        weg.append((z, s))
        if lab[z][s] == "A":
            return True
        for dz, ds in [(1, 0), (0, 1), (-1, 0), (0, -1)]:
            nz = z + dz
            ns = s + ds
            if 0 <= nz < hoehe and 0 <= ns < breite and lab[nz][ns] != "#" and (nz, ns) not in besucht:
                if besuchen(nz, ns):
                    return True
        weg.pop()
        return False

    if besuchen(start[0], start[1]):
        return weg
    return None


LAB = ["#########",
       "#S..#...#",
       "#.#.#.#.#",
       "#.#...#.#",
       "#.#####.#",
       "#...#...A",
       "#########"]
print(weg_finden(LAB))
--- tests
LAB = ["#########",
       "#S..#...#",
       "#.#.#.#.#",
       "#.#...#.#",
       "#.#####.#",
       "#...#...A",
       "#########"]

def check(lab, w):
    ok(w is not None, "weg_finden hat None zurückgegeben, obwohl es einen Weg gibt")
    ok(lab[w[0][0]][w[0][1]] == "S", "der Weg muss bei S beginnen")
    ok(lab[w[-1][0]][w[-1][1]] == "A", "der Weg muss bei A enden")
    for (z1, s1), (z2, s2) in zip(w, w[1:]):
        ok(abs(z1 - z2) + abs(s1 - s2) == 1, f"{(z1, s1)} → {(z2, s2)} ist kein Schritt zu einem Nachbarn")
        ok(lab[z2][s2] != "#", f"{(z2, s2)} ist eine Wand")
    ok(len(set(w)) == len(w), "der Weg besucht eine Zelle zweimal")

@test("Ein gültiger Weg durch das gegebene Labyrinth")
def _():
    check(LAB, weg_finden(LAB))

@test("Der Weg enthält keine Sackgassen")
def _():
    w = weg_finden(LAB)
    ok((5, 1) not in w and (5, 3) not in w, "die Sackgasse unten links darf nicht zum Weg gehören (Zellen beim Zurückgehen entfernen)")

@test("Kein Weg → None")
def _():
    eq(weg_finden(["#####", "#S#A#", "#####"]), None, "weg_finden(geschlossenes Labyrinth)")

@test("Start direkt neben dem Ausgang")
def _():
    eq(weg_finden(["####", "#SA#", "####"]), [(1, 1), (1, 2)], "weg_finden(...)")
--- hint
`besuchen` ist `KnotenBesuchen` aus Labyrinth1.py mit Zellen statt Knotennummern: markieren, an `weg` anhängen, den Ausgang prüfen, die vier Nachbarn probieren und in einer Sackgasse `weg.pop()` und `return False`.
--- hint
Ein Nachbar ist zulässig, wenn er im Labyrinth liegt, keine Wand ist und noch nicht besucht ist.
--- explain
Die innere Funktion kann `lab`, `besucht` und `weg` von `weg_finden` direkt verwenden. Zellen werden auf dem Rückweg nicht freigegeben: Eine Sackgasse bleibt eine Sackgasse, deshalb ist der erste Weg hinaus schnell gefunden.
:::

:::exercise id=b4-maze-short title="Der kürzeste Weg hinaus (Aufgabe 6)" level=3
Ändere die Suche so, dass sie den **kürzesten** Weg hinaus findet: `kuerzester_weg(lab)` gibt den kürzesten Weg als Liste von Zellen zurück, oder `None`. Gib Zellen auf dem Rückweg wieder frei, merk dir den besten Weg als Kopie und schneide Wege ab, die schon mindestens so lang sind wie der beste.
--- starter
def kuerzester_weg(lab):
    hoehe = len(lab)
    breite = len(lab[0])
    for z in range(hoehe):
        for s in range(breite):
            if lab[z][s] == "S":
                start = (z, s)
    besucht = []
    weg = []
    bester = []          # bester[0] enthält den besten bisher gefundenen Weg

    def besuchen(z, s):
        pass

    besuchen(start[0], start[1])
    if bester:
        return bester[0]
    return None


LAB = ["#########",
       "#S......#",
       "#.##.##.#",
       "#.......#",
       "#.##.##.#",
       "#......A#",
       "#########"]
print(kuerzester_weg(LAB))
--- solution
def kuerzester_weg(lab):
    hoehe = len(lab)
    breite = len(lab[0])
    for z in range(hoehe):
        for s in range(breite):
            if lab[z][s] == "S":
                start = (z, s)
    besucht = []
    weg = []
    bester = []          # bester[0] enthält den besten bisher gefundenen Weg

    def besuchen(z, s):
        if bester and len(weg) + 1 >= len(bester[0]):
            return
        besucht.append((z, s))
        weg.append((z, s))
        if lab[z][s] == "A":
            bester.clear()
            bester.append(list(weg))
        else:
            for dz, ds in [(1, 0), (0, 1), (-1, 0), (0, -1)]:
                nz = z + dz
                ns = s + ds
                if 0 <= nz < hoehe and 0 <= ns < breite and lab[nz][ns] != "#" and (nz, ns) not in besucht:
                    besuchen(nz, ns)
        besucht.remove((z, s))
        weg.pop()

    besuchen(start[0], start[1])
    if bester:
        return bester[0]
    return None


LAB = ["#########",
       "#S......#",
       "#.##.##.#",
       "#.......#",
       "#.##.##.#",
       "#......A#",
       "#########"]
print(kuerzester_weg(LAB))
--- tests
def bfs_len(lab):
    h, b = len(lab), len(lab[0])
    st = [(z, s) for z in range(h) for s in range(b) if lab[z][s] == "S"][0]
    dist = {st: 1}
    q = [st]
    while q:
        z, s = q.pop(0)
        if lab[z][s] == "A":
            return dist[(z, s)]
        for dz, ds in [(1, 0), (0, 1), (-1, 0), (0, -1)]:
            n = (z + dz, s + ds)
            if 0 <= n[0] < h and 0 <= n[1] < b and lab[n[0]][n[1]] != "#" and n not in dist:
                dist[n] = dist[(z, s)] + 1
                q.append(n)
    return None

LAB = ["#########",
       "#S......#",
       "#.##.##.#",
       "#.......#",
       "#.##.##.#",
       "#......A#",
       "#########"]

@test("Kürzester Weg in einem Labyrinth mit vielen Wegen: 11 Zellen")
def _():
    w = kuerzester_weg(LAB)
    ok(w is not None, "kein Weg gefunden")
    eq(len(w), bfs_len(LAB), "Länge des Wegs")
    ok(w[0] == (1, 1) and w[-1] == (5, 7), "der Weg muss von S nach A führen")
    for (z1, s1), (z2, s2) in zip(w, w[1:]):
        ok(abs(z1 - z2) + abs(s1 - s2) == 1, f"{(z1, s1)} → {(z2, s2)} ist kein Schritt")

@test("Ein Labyrinth mit einem langen und einem kurzen Weg")
def _():
    lab = ["#######",
           "#S...A#",
           "#.###.#",
           "#.....#",
           "#######"]
    eq(kuerzester_weg(lab), [(1, 1), (1, 2), (1, 3), (1, 4), (1, 5)], "kuerzester_weg(...)")

@test("Kein Weg → None")
def _():
    eq(kuerzester_weg(["#####", "#S#A#", "#####"]), None, "kuerzester_weg(geschlossenes Labyrinth)")
--- hint
Drei Unterschiede zu `weg_finden`: kein vorzeitiges `return True`; am Ausgang vergleichen und `list(weg)` speichern; und am Ende jedes Aufrufs `besucht.remove(...)` und `weg.pop()`.
--- hint
Abschneiden: Wenn schon ein Weg bekannt ist und der aktuelle Weg plus diese Zelle nicht kürzer ist, sofort zurückkehren (vor dem Markieren).
--- explain
`bester` ist eine Liste, damit die innere Funktion ihren Inhalt ändern kann (eine einfache Variable, der in `besuchen` etwas zugewiesen wird, wäre eine neue lokale Variable). Ohne Abschneiden hat schon dieses kleine Labyrinth Hunderte von Wegen; mit Abschneiden ist die Suche schnell fertig.
:::

:::exercise id=b4-tsp title="Handlungsreisender (Aufgabe 7 a)" level=3
`AlleVerbindungenBerechnen()` (Floyd–Warshall, aus der Vorlage) ist gegeben. Implementiere `KnotenBesuchen(aktuell, büro, länge)` und vervollständige `TiefensucheAusfuehren(start)` so, dass die beste Rundreise in `self.optimalerWeg` (Liste von Namen, die mit dem Büro beginnt **und** endet) und `self.optimaleLänge` gespeichert wird.

Erwartet für Autobahn_klein ab M: `['M', 'N', 'HO', 'R', 'RO', 'M']`, 682.
--- starter
class GraphMatrix:
    def __init__(self, namen, kanten):
        self.knoten = list(namen)
        self.matrix = [[-1] * len(namen) for i in range(len(namen))]
        for a, b, w in kanten:
            i, j = self.knoten.index(a), self.knoten.index(b)
            self.matrix[i][j] = w
            self.matrix[j][i] = w

    def AlleVerbindungenBerechnen(self):
        n = len(self.matrix)
        for k in range(n):
            for i in range(n):
                for j in range(n):
                    if i != j and self.matrix[i][k] != -1 and self.matrix[k][j] != -1:
                        if self.matrix[i][j] == -1 or self.matrix[i][j] > self.matrix[i][k] + self.matrix[k][j]:
                            self.matrix[i][j] = self.matrix[i][k] + self.matrix[k][j]

    def KnotenBesuchen(self, aktuell, büro, länge):
        pass

    def TiefensucheAusfuehren(self, start):
        self.besuchteKnoten = []
        self.aktuellerWeg = []
        self.optimalerWeg = []
        self.optimaleLänge = float('inf')
        # hier die Suche starten
        return self.optimalerWeg, self.optimaleLänge


def klein():
    g = GraphMatrix(["M", "N", "HO", "R", "RO"],
        [("M", "N", 163), ("N", "HO", 116), ("N", "R", 80), ("R", "M", 117), ("M", "RO", 60),
         ("HO", "R", 166), ("RO", "R", 177), ("RO", "N", 223), ("RO", "HO", 339), ("M", "HO", 279)])
    g.AlleVerbindungenBerechnen()
    return g


print(klein().TiefensucheAusfuehren("M"))
--- solution
class GraphMatrix:
    def __init__(self, namen, kanten):
        self.knoten = list(namen)
        self.matrix = [[-1] * len(namen) for i in range(len(namen))]
        for a, b, w in kanten:
            i, j = self.knoten.index(a), self.knoten.index(b)
            self.matrix[i][j] = w
            self.matrix[j][i] = w

    def AlleVerbindungenBerechnen(self):
        n = len(self.matrix)
        for k in range(n):
            for i in range(n):
                for j in range(n):
                    if i != j and self.matrix[i][k] != -1 and self.matrix[k][j] != -1:
                        if self.matrix[i][j] == -1 or self.matrix[i][j] > self.matrix[i][k] + self.matrix[k][j]:
                            self.matrix[i][j] = self.matrix[i][k] + self.matrix[k][j]

    def KnotenBesuchen(self, aktuell, büro, länge):
        self.besuchteKnoten.append(aktuell)
        self.aktuellerWeg.append(self.knoten[aktuell])
        if len(self.besuchteKnoten) == len(self.knoten):
            gesamt = länge + self.matrix[aktuell][büro]
            if gesamt < self.optimaleLänge:
                self.optimaleLänge = gesamt
                self.optimalerWeg = list(self.aktuellerWeg) + [self.knoten[büro]]
        elif länge < self.optimaleLänge:
            for nummer in range(len(self.knoten)):
                if self.matrix[aktuell][nummer] > 0 and nummer not in self.besuchteKnoten:
                    self.KnotenBesuchen(nummer, büro, länge + self.matrix[aktuell][nummer])
        self.besuchteKnoten.remove(aktuell)
        self.aktuellerWeg.pop()

    def TiefensucheAusfuehren(self, start):
        self.besuchteKnoten = []
        self.aktuellerWeg = []
        self.optimalerWeg = []
        self.optimaleLänge = float('inf')
        s = self.knoten.index(start)
        self.KnotenBesuchen(s, s, 0)
        return self.optimalerWeg, self.optimaleLänge


def klein():
    g = GraphMatrix(["M", "N", "HO", "R", "RO"],
        [("M", "N", 163), ("N", "HO", 116), ("N", "R", 80), ("R", "M", 117), ("M", "RO", 60),
         ("HO", "R", 166), ("RO", "R", 177), ("RO", "N", 223), ("RO", "HO", 339), ("M", "HO", 279)])
    g.AlleVerbindungenBerechnen()
    return g


print(klein().TiefensucheAusfuehren("M"))
--- tests
@test("Ab M: M-N-HO-R-RO-M, 682")
def _():
    eq(klein().TiefensucheAusfuehren("M"), (["M", "N", "HO", "R", "RO", "M"], 682), "TiefensucheAusfuehren('M')")

@test("Von jedem Start aus ist das Optimum 682 (Aufgabe 7 b)")
def _():
    for s in ["N", "HO", "R", "RO"]:
        w, l = klein().TiefensucheAusfuehren(s)
        eq(l, 682, f"Länge ab {s}")
        ok(w[0] == s and w[-1] == s and sorted(w[:-1]) == sorted(["M", "N", "HO", "R", "RO"]), f"Rundreise ab {s} muss jede Stadt einmal besuchen und zurückkehren: {w}")

@test("Funktioniert an einem vollständigen Quadrat")
def _():
    g = GraphMatrix(list("ABCD"), [("A", "B", 1), ("B", "C", 1), ("C", "D", 1), ("D", "A", 1), ("A", "C", 5), ("B", "D", 5)])
    w, l = g.TiefensucheAusfuehren("A")
    eq(l, 4, "Länge der Rundreise")
--- hint
„Alle Kunden besucht“ heißt `len(self.besuchteKnoten) == len(self.knoten)`. Dann kommt der Rückweg `self.matrix[aktuell][büro]` dazu.
--- hint
Speichere `list(self.aktuellerWeg) + [self.knoten[büro]]`, damit die Rundreise im Büro endet.
--- explain
Nach `AlleVerbindungenBerechnen` ist jedes Städtepaar verbunden, die Schleife findet also jede Reihenfolge der Städte. Das `elif länge < self.optimaleLänge` schneidet Reihenfolgen ab, die schon zu lang sind. Aufgabe 7 b: Die optimale Rundreise ist ein Zyklus, ihre Länge hängt also nicht von der Startstadt ab.
:::

## [exam] Klausurtraining

:::exam title="Alle Wege auf Papier (12_I_4_Aufgabe_1)" points=6
Schreib alle Wege von UL nach HO in der Reihenfolge auf, in der der Algorithmus sie findet (Nachbarreihenfolge FD, WÜ, UL, S, LI, A, M, N, HO, R, RO), mit ihren Längen, und markiere den optimalen Weg.
--- solution
Siehe die Tabelle im Logik-Abschnitt: 1. UL-WÜ-N-M-R-HO 715, 2. UL-WÜ-N-HO 385, 3. UL-WÜ-N-R-HO 515, **4. UL-WÜ-HO 357 (optimal)**, 5. UL-A-M-N-WÜ-HO 582, 6. UL-A-M-N-HO 402, 7. UL-A-M-N-R-HO 532, 8. UL-A-M-R-N-WÜ-HO 616, 9. UL-A-M-R-N-HO 436, 10. UL-A-M-R-HO 406.
:::

:::exam title="Zwei Änderungen an der Tiefensuche" points=4
a) Nenne die zwei Änderungen an `KnotenBesuchen`, durch die es alle Wege zwischen zwei Knoten findet.
b) Warum muss der optimale Weg mit `list(self.aktuellerWeg)` gespeichert werden?
--- solution
a) (1) Am Ende jedes Aufrufs wird der Knoten wieder aus den besuchten Knoten (und aus dem aktuellen Weg) entfernt, damit andere Wege ihn benutzen können. (2) Ist das Ziel erreicht, ist der Weg vollständig: Er wird ausgewertet (gespeichert / verglichen) und nicht verlängert.

b) `self.aktuellerWeg` wird von der Suche ständig verändert (append/pop) und ist am Ende leer. Eine Zuweisung ohne Kopie erzeugt nur einen zweiten Verweis auf genau diese Liste, das gespeicherte „Optimum“ würde sich also mitändern. `list(...)` erzeugt eine unabhängige Kopie des aktuellen Zustands.
:::

:::exam title="Labyrinth-Strategie (Aufgabe 3 a)" points=4
Beschreibe, wie man ein Labyrinth mit einem langen Faden nach dem Prinzip der Tiefensuche durchsuchen kann. Gib eine Regel für die Wahl des nächsten Gangs an einer Kreuzung an und sag, woran man eine besuchte Kreuzung erkennt.
--- solution
Beim Gehen den Faden abwickeln. An jeder Kreuzung den ersten Gang (z. B. den am weitesten links liegenden) nehmen, in dem noch kein Faden liegt, und weitergehen. Erreicht man eine Sackgasse oder eine Kreuzung, in deren Gängen schon überall Faden liegt, wickelt man den Faden bis zur vorherigen Kreuzung auf und probiert dort den nächsten Gang. Eine Kreuzung ist besucht, wenn dort schon Faden liegt. Erreicht man den Ausgang, zeigt der Faden den Weg. Das ist genau die Tiefensuche: Abwickeln = rekursiver Aufruf, Aufwickeln = Rückkehr.
:::

:::exam title="Bürostandort (Aufgabe 7 b)" points=3
Ein Kollege behauptet: „Mit dem Programm aus 7 a können wir die beste Stadt für das Büro finden, indem wir für jeden möglichen Start die optimale Rundreise berechnen.“ Beurteile die Behauptung.
--- solution
Man kann das Programm für jeden Start laufen lassen, aber alle Ergebnisse sind gleich: Eine optimale Rundreise ist ein geschlossener Zyklus durch alle Städte, und derselbe Zyklus kann in jeder seiner Städte beginnen. Der Bürostandort beeinflusst also die Länge der optimalen Rundreise nicht. Er spielte nur unter anderen Annahmen eine Rolle, z. B. wenn die Reise nicht ins Büro zurückführt oder wenn das Büro keine der Kundenstädte ist.
:::
