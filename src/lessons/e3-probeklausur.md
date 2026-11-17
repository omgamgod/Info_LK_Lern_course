---
id: e3
num: E3
part: E
title: Probeklausur 1
short: Probeklausur 1
lead: Eine vollständige Probeklausur zu den Kapiteln I und II im Stil einer Q12-Klausur. 60 Punkte, 90 Minuten, auf Papier. Jede Aufgabe hat eine Musterlösung mit einer Punkteverteilung, wie eine Lehrkraft sie vornehmen würde. Danach kannst du deinen Code mit den Python-Blöcken am Ende prüfen.
minutes: 120
uses: [e1, e2]
goals:
  - eine vollständige Klausur zu Rekursion und Listen unter Zeitdruck lösen
  - die eigenen Antworten anhand von Musterlösungen mit Punkteverteilung bewerten
  - die Themen finden, die du noch wiederholen musst
---

## [intro] So schreibst du diese Klausur

1. Nimm Papier und Stift, leg deine Unterlagen weg und stell einen Timer auf **90 Minuten**.
2. Bearbeite Aufgabe 1 bis 3, ohne eine Musterlösung zu öffnen. Pseudocode in der Notation deines Kurses und Python sind beide erlaubt, außer eine Aufgabe sagt etwas anderes.
3. Wenn die Zeit um ist, öffne die Musterlösungen eine nach der anderen und gib dir Punkte. Zähl sie in der Tabelle am Ende zusammen.
4. Geh bei jeder Aufgabe, bei der du mehr als die Hälfte der Punkte verloren hast, zu der Lektion zurück, die in ihrem Titel genannt ist.

| Aufgabe | Thema | Punkte |
|---|---|---|
| 1 | Rekursion | 16 |
| 2 | Graphen, Tiefensuche, optimale Wege | 22 |
| 3 | Listen und Kompositum | 22 |
| | **gesamt** | **60** |

## [exam] Aufgabe 1: Rekursion

Gegeben ist die Methode

```pseudo
methode Rätsel(a, b)
    falls b == 0 dann
        return 0
    sonst
        return a + Rätsel(a, b − 1)
    endefalls
endemethode
```

::::exam title="1 a) Aufrufbaum (B1)" points=4
Zeichne den Aufrufbaum für `Rätsel(4, 3)` mit allen Rückgabewerten und gib an, was `Rätsel(a, b)` für b ≥ 0 berechnet.
--- solution
:::diagram calltree
Rätsel(4, 3) => 4 + 8 = 12
  Rätsel(4, 2) => 4 + 4 = 8
    Rätsel(4, 1) => 4 + 0 = 4
      Rätsel(4, 0) => 0 {green}
:::

(2 P für den Baum mit Parametern, 1 P für die Rückgabewerte.) `Rätsel(a, b)` berechnet das Produkt **a · b**, indem es b-mal a addiert (1 P).
::::

:::exam title="1 b) Abbruchbedingung (B1)" points=2
Für welche Werte von b terminiert die Methode nicht? Was passiert dann in Python?
--- solution
Für **b < 0** (1 P): b wird bei jedem Aufruf kleiner und erreicht nie 0. Die Aufrufe stapeln sich, bis Python mit einem `RecursionError` abbricht (maximale Rekursionstiefe überschritten) (1 P).
:::

:::exam title="1 c) Endrekursion (B1)" points=3
Ist `Rätsel` endrekursiv? Begründe. Schreib eine endrekursive Version mit einem zusätzlichen Parameter `summe`.
--- solution
**Nicht** endrekursiv (1 P): Nach der Rückkehr des rekursiven Aufrufs muss noch `a + …` berechnet werden.

```pseudo
methode Rätsel2(a, b, summe)
    falls b == 0 dann
        return summe
    sonst
        return Rätsel2(a, b − 1, summe + a)
    endefalls
endemethode
```
Aufruf: `Rätsel2(4, 3, 0)`. (2 P: Die Summe wird als Parameter nach unten weitergegeben, das Ergebnis des Aufrufs wird unverändert zurückgegeben.)
:::

:::exam title="1 d) Palindrom (B1)" points=4
Ein Wort ist ein Palindrom, wenn es vorwärts und rückwärts gleich gelesen wird (z. B. „RENTNER“, „OTTO“). Schreib eine rekursive Methode `IstPalindrom(wort)`. Du darfst `wort[0]`, `wort[-1]`, `wort[1:-1]` (das Wort ohne seinen ersten und letzten Buchstaben) und `len(wort)` verwenden.
--- solution
```python
def IstPalindrom(wort):
    if len(wort) <= 1:                      # Rekursionsende: "" und ein Buchstabe
        return True
    if wort[0] != wort[-1]:                 # erster und letzter Buchstabe verschieden
        return False
    return IstPalindrom(wort[1:-1])         # Rekursionsschritt: das Innere
```
1 P Rekursionsende (beides ≤ 1, oder 0 und 1 getrennt), 1 P Vergleich des ersten und letzten Buchstabens, 2 P rekursiver Aufruf mit dem kürzeren Wort und Rückgabe seines Ergebnisses.
:::

:::exam title="1 e) Baumartige Rekursion (B1)" points=3
```python
def Muster(n):
    if n > 0:
        Muster(n - 1)
        print("*" * n)
        Muster(n - 1)
```
Schreib die Ausgabe von `Muster(3)` auf. Wie viele Zeilen gibt `Muster(10)` aus?
--- solution
```out
*
**
*
***
*
**
*
```
(2 P.) `Muster(n)` gibt zweimal die Ausgabe von `Muster(n−1)` plus eine Zeile aus: z(n) = 2·z(n−1) + 1 mit z(0) = 0, also z(n) = 2ⁿ − 1, für n = 10 also **1023** Zeilen (1 P). Dasselbe Muster wie bei den Türmen von Hanoi.
:::

## [exam] Aufgabe 2: Graphen

Eine kleine Spedition fährt zwischen sieben Depots A bis G. Die Zahlen sind Fahrzeiten in Minuten; alle Verbindungen können in beide Richtungen benutzt werden.

:::diagram graph caption="Depots und Fahrzeiten"
{"nodes": [["A", 60, 140], ["B", 200, 60], ["C", 200, 230], ["D", 340, 150], ["E", 360, 280], ["F", 490, 190], ["G", 360, 40]], "edges": [["A", "B", 5], ["A", "C", 3], ["B", "D", 4], ["B", "G", 2], ["C", "D", 5], ["C", "E", 2], ["D", "F", 3], ["E", "F", 7]]}
:::

:::exam title="2 a) Eigenschaften (B3)" points=2
Nenne vier Eigenschaften dieses Graphen mit jeweils einer Begründung.
--- solution
Je 0,5 P: **ungerichtet** (alle Verbindungen in beide Richtungen), **gewichtet** (Fahrzeiten), **zusammenhängend** (jedes Depot ist von jedem anderen aus erreichbar), **zyklisch** (z. B. A – B – D – C – A). Er ist **kein** Baum, weil er Zyklen enthält.
:::

::::exam title="2 b) Adjazenzmatrix (B3)" points=3
Schreib die Adjazenzmatrix mit der Knotenreihenfolge A, B, …, G auf. Verwende −1 für „keine Kante“.
--- solution
:::diagram matrix
{"labels": ["A", "B", "C", "D", "E", "F", "G"], "m": [[-1, 5, 3, -1, -1, -1, -1], [5, -1, -1, 4, -1, -1, 2], [3, -1, -1, 5, 2, -1, -1], [-1, 4, 5, -1, -1, 3, -1], [-1, -1, 2, -1, -1, 7, -1], [-1, -1, -1, 3, 7, -1, -1], [-1, 2, -1, -1, -1, -1, -1]], "empty": -1}
:::
Die Matrix ist symmetrisch, weil der Graph ungerichtet ist. (−1 P pro falscher Zeile, höchstens 3.)
::::

::::exam title="2 c) Tiefensuche (B3)" points=4
Die Tiefensuche `KnotenBesuchen` deines Kurses wird bei A gestartet; die Nachbarn werden in Matrixreihenfolge geprüft. Gib die Reihenfolge an, in der die Depots besucht werden, und zeichne den Aufrufbaum von `KnotenBesuchen`.
--- solution
Reihenfolge: **A, B, D, C, E, F, G** (2 P).

:::diagram calltree
KnotenBesuchen(A)
  KnotenBesuchen(B)
    KnotenBesuchen(D)
      KnotenBesuchen(C)
        KnotenBesuchen(E)
          KnotenBesuchen(F)
    KnotenBesuchen(G)
:::
(2 P.) Von B aus geht die Suche zuerst nach D (Matrixreihenfolge: A ist besucht, D kommt vor G). D → C (B ist besucht), C → E, E → F. F hat keinen unbesuchten Nachbarn; die Aufrufe kehren bis zu B zurück, das jetzt G besucht.
::::

:::exam title="2 d) Breitensuche (B3)" points=3
Gib die Reihenfolge einer Breitensuche ab A an (Nachbarn in Matrixreihenfolge) und den Inhalt der Warteschlange nach jedem Entfernen.
--- solution
| entfernt | Warteschlange danach |
|---|---|
| – | A |
| A | B, C |
| B | C, D, G |
| C | D, G, E |
| D | G, E, F |
| G | E, F |
| E | F |
| F | (leer) |

Reihenfolge: **A, B, C, D, G, E, F** (1 P Reihenfolge, 2 P Warteschlange).
:::

:::exam title="2 e) Die schnellste Route (B4)" points=6
Die Spedition möchte die schnellste Route von einem Depot zu einem anderen. Beschreibe die zwei Änderungen, die aus der Tiefensuche eine Suche nach allen Routen machen, und schreib die Methode `KnotenBesuchen(aktuell, ziel, länge)`, die die schnellste Route in `optimalerWeg` und ihre Zeit in `optimaleLänge` speichert. Du darfst `aktuellerWeg` und die Matrix `matrix` verwenden.
--- solution
Änderungen (2 P): (1) Auf dem Rückweg wird die **Markierung** des Knotens wieder **entfernt** (er kann auf anderen Wegen liegen); (2) am Ziel ist der Weg vollständig, er wird ausgewertet und **nicht** verlängert.

```python
def KnotenBesuchen(self, aktuell, ziel, länge):
    self.besuchteKnoten.append(aktuell)
    self.aktuellerWeg.append(self.knoten[aktuell])
    if aktuell == ziel:
        if länge < self.optimaleLänge:
            self.optimaleLänge = länge
            self.optimalerWeg = list(self.aktuellerWeg)     # Kopie!
    else:
        for nummer in range(len(self.knoten)):
            if self.matrix[aktuell][nummer] > 0 and nummer not in self.besuchteKnoten:
                self.KnotenBesuchen(nummer, ziel, länge + self.matrix[aktuell][nummer])
    self.besuchteKnoten.remove(aktuell)
    self.aktuellerWeg.pop()
```
(4 P: Markieren und Weg, Ziel mit Vergleich und **Kopie**, Schleife mit dem addierten Gewicht, Markierung entfernen und Weg kürzen. `optimaleLänge` muss bei ∞ beginnen.)
:::

:::exam title="2 f) Alle Routen von A nach F (B4)" points=4
Liste alle Routen von A nach F in der Reihenfolge auf, in der deine Methode sie findet, mit ihren Zeiten. Welche Route ist am Ende gespeichert? Erkläre, warum `optimalerWeg` eine Kopie von `aktuellerWeg` sein muss.
--- solution
| # | Route | Minuten |
|---|---|---|
| 1 | A – B – D – C – E – F | 23 |
| 2 | A – B – D – F | 12 |
| 3 | A – C – D – F | **11** |
| 4 | A – C – E – F | 12 |

(2 P.) Gespeichert: **A – C – D – F mit 11 Minuten** (1 P). A – B – D – F (12) ersetzt Route 1, Route 3 ersetzt diese, Route 4 ist nicht kürzer.

Kopie (1 P): `aktuellerWeg` ändert sich während der Suche ständig und ist am Ende leer. Ohne Kopie wäre `optimalerWeg` nur ein zweiter Verweis auf genau diese Liste.
:::

## [exam] Aufgabe 3: Listen

Eine Musik-App verwaltet eine Playlist. Jedes Lied ist ein Objekt der Klasse SONG mit den Attributen `titel` und `dauer` (in Sekunden) und den Methoden `TitelGeben()` und `DauerGeben()`. Die Playlist ist eine einfach verkettete Liste, umgesetzt mit dem Entwurfsmuster Kompositum.

::::exam title="3 a) Klassendiagramm (C4)" points=5
Zeichne das Klassendiagramm der Playlist mit den Klassen PLAYLIST, LISTENELEMENT, KNOTEN, ABSCHLUSS und SONG. Gib die Methoden `HintenEinfügen(s)`, `VorneEinfügen(s)` und `GesamtdauerGeben()` dort an, wo sie gebraucht werden.
--- solution
:::diagram classes
class PLAYLIST @0,0 | anfang: LISTENELEMENT | HintenEinfügen(s: SONG); VorneEinfügen(s: SONG); GesamtdauerGeben(): GANZZAHL
abstract LISTENELEMENT @1.6,0 | | HintenEinfügen(s): LISTENELEMENT {abstract}; GesamtdauerGeben(): GANZZAHL {abstract}
class KNOTEN @1.1,1.25 | daten: SONG; nachfolger: LISTENELEMENT | HintenEinfügen(s): LISTENELEMENT; GesamtdauerGeben(): GANZZAHL
class ABSCHLUSS @2.3,1.25 | | HintenEinfügen(s): LISTENELEMENT; GesamtdauerGeben(): GANZZAHL
class SONG @0,2.4 | titel: ZEICHENKETTE; dauer: GANZZAHL | TitelGeben(): ZEICHENKETTE; DauerGeben(): GANZZAHL
assoc PLAYLIST -> LISTENELEMENT : anfang [1]
inherit KNOTEN -> LISTENELEMENT
inherit ABSCHLUSS -> LISTENELEMENT
assoc KNOTEN -> LISTENELEMENT : nachfolger [1]
assoc KNOTEN -> SONG : daten [1]
:::
1 P abstraktes LISTENELEMENT, 1 P beide Vererbungspfeile, 1 P KNOTEN → LISTENELEMENT (nicht → KNOTEN) mit Multiplizität 1, 1 P KNOTEN → SONG und PLAYLIST → LISTENELEMENT, 1 P Methoden in den richtigen Klassen (VorneEinfügen nur in PLAYLIST: `anfang = neu KNOTEN(s, anfang)`).
::::

::::exam title="3 b) Objektdiagramm (C4)" points=3
Eine leere Playlist p bekommt die Aufrufe `p.HintenEinfügen(s1)`, `p.HintenEinfügen(s2)`, `p.VorneEinfügen(s3)`. Zeichne danach das Objektdiagramm (Songs nur als `s1: SONG` usw.).
--- solution
:::diagram objects
p: PLAYLIST @0,0 | anfang -> k3
k3: KNOTEN @1,0 | daten -> s3 | nachfolger -> k1
k1: KNOTEN @2.1,0 | daten -> s1 | nachfolger -> k2
k2: KNOTEN @3.2,0 | daten -> s2 | nachfolger -> a
a: ABSCHLUSS @4.3,0
s3: SONG @1,1.1
s1: SONG @2.1,1.1
s2: SONG @3.2,1.1
:::
Reihenfolge s3, s1, s2 (1 P), ein ABSCHLUSS am Ende (1 P), Referenzen als Pfeile mit den richtigen Namen (1 P).
::::

:::exam title="3 c) GesamtdauerGeben (C4)" points=5
Implementiere `GesamtdauerGeben()` in PLAYLIST, KNOTEN und ABSCHLUSS (Python oder Pseudocode). Es gibt die gesamte Spieldauer der Playlist in Sekunden zurück.
--- solution
```python
# Playlist
def GesamtdauerGeben(self):
    return self.anfang.GesamtdauerGeben()

# Knoten
def GesamtdauerGeben(self):
    return self.daten.DauerGeben() + self.nachfolger.GesamtdauerGeben()

# Abschluss
def GesamtdauerGeben(self):
    return 0
```
1 P PLAYLIST, 3 P KNOTEN (eigene Dauer vom SONG über `daten`, rekursiver Aufruf bei `nachfolger`, Summe zurückgeben), 1 P ABSCHLUSS. Dazu die abstrakte Methode in LISTENELEMENT. Eine Prüfung auf nichts ist nicht nötig.
:::

::::exam title="3 d) Sequenzdiagramm (C4)" points=5
Zeichne das Sequenzdiagramm für `GesamtdauerGeben()` bei einer Playlist mit zwei Songs s1 (180 s) und s2 (240 s). Beschrifte alle Rückgabewerte.
--- solution
:::diagram seq
actors: Aufrufer | p: PLAYLIST | k1: KNOTEN | s1: SONG | k2: KNOTEN | s2: SONG | a: ABSCHLUSS
Aufrufer -> p: GesamtdauerGeben()
p -> k1: GesamtdauerGeben()
k1 -> s1: DauerGeben()
s1 --> k1: 180
k1 -> k2: GesamtdauerGeben()
k2 -> s2: DauerGeben()
s2 --> k2: 240
k2 -> a: GesamtdauerGeben()
a --> k2: 0
k2 --> k1: 240
k1 --> p: 420
p --> Aufrufer: 420
:::
2 P Aufrufe entlang der Kette bis zum ABSCHLUSS, 1 P DauerGeben an die Songs, 2 P richtige Rückgabewerte. (Ruft dein KNOTEN zuerst den Nachfolger und danach den Song auf, ändert sich die Reihenfolge der Nachrichten; das ist ebenfalls richtig, wenn es zu deinem Code aus c) passt.)
::::

:::exam title="3 e) Einen Song entfernen (C3, C4)" points=4
Implementiere `SongEntfernen(titel)`, das den ersten Song mit dem gegebenen Titel entfernt (gibt es keinen, passiert nichts), in PLAYLIST, KNOTEN und ABSCHLUSS. Erkläre, warum KNOTEN in einem Fall `selbst` zurückgeben muss.
--- solution
```python
# Playlist
def SongEntfernen(self, titel):
    self.anfang = self.anfang.SongEntfernen(titel)

# Knoten
def SongEntfernen(self, titel):
    if self.daten.TitelGeben() == titel:
        return self.nachfolger                 # überspring mich
    self.nachfolger = self.nachfolger.SongEntfernen(titel)
    return self

# Abschluss
def SongEntfernen(self, titel):
    return self                                # nicht gefunden: nichts ändert sich
```
(3 P.) Jeder Aufrufer speichert das zurückgegebene Element als seinen neuen Nachfolger (oder als `anfang`). Ein Knoten, der **nicht** entfernt wird, muss deshalb **sich selbst** zurückgeben, damit sein Vorgänger weiter auf ihn zeigt; alles andere würde ihn aus der Kette herausschneiden (1 P).
:::

## [intro] Dein Ergebnis

| Aufgabe | max. | deine Punkte |
|---|---|---|
| 1 a–e | 16 | |
| 2 a–f | 22 | |
| 3 a–e | 22 | |
| **gesamt** | **60** | |

In einem Bereich viele Punkte verloren? Wiederhole diese Lektionen:

- 1 a, b, e → [B1](#b1) (Aufrufbaum, Abbruchbedingung, baumartige Rekursion); 1 c → B1, Abschnitt *Arten der Rekursion*; 1 d → Python-Blöcke in B1
- 2 a–d → [B3](#b3); 2 e, f → [B4](#b4)
- 3 a, b → [C4](#c4) (Klassen- und Objektdiagramm); 3 c, d → C4 und [E2](#e2); 3 e → [C3](#c3) (den neuen Rest zurückgeben)

## [python] Prüf deinen Code

Tipp ein, was du auf Papier geschrieben hast, und lass es von den Tests prüfen.

:::exercise id=d3-rec title="Aufgabe 1: Rätsel2 und IstPalindrom" level=2
Implementiere `Raetsel2(a, b, summe)` (endrekursiv, 1 c) und `IstPalindrom(wort)` (1 d).
--- starter
def Raetsel2(a, b, summe):
    pass


def IstPalindrom(wort):
    pass


print(Raetsel2(4, 3, 0))
print(IstPalindrom("RENTNER"), IstPalindrom("OTTER"))
--- solution
def Raetsel2(a, b, summe):
    if b == 0:
        return summe
    return Raetsel2(a, b - 1, summe + a)


def IstPalindrom(wort):
    if len(wort) <= 1:
        return True
    if wort[0] != wort[-1]:
        return False
    return IstPalindrom(wort[1:-1])


print(Raetsel2(4, 3, 0))
print(IstPalindrom("RENTNER"), IstPalindrom("OTTER"))
--- tests
@test("Raetsel2 berechnet a · b")
def _():
    eq(Raetsel2(4, 3, 0), 12, "Raetsel2(4, 3, 0)")
    eq(Raetsel2(7, 0, 0), 0, "Raetsel2(7, 0, 0)")
    eq(Raetsel2(6, 5, 0), 30, "Raetsel2(6, 5, 0)")

@test("Raetsel2 ist endrekursiv")
def _():
    r, rec = recursive(Raetsel2, 3, 4, 0)
    ok(rec, "Raetsel2 muss sich selbst aufrufen")
    import ast
    for node in ast.parse(SOURCE).body:
        if isinstance(node, ast.FunctionDef) and node.name == "Raetsel2":
            for n in ast.walk(node):
                if isinstance(n, ast.BinOp) and any(isinstance(c, ast.Call) for c in (n.left, n.right)):
                    ok(False, "der rekursive Aufruf darf nicht Teil einer Rechnung sein: return Raetsel2(...) direkt")

@test("IstPalindrom")
def _():
    for w, exp in [("RENTNER", True), ("OTTO", True), ("A", True), ("", True), ("OTTER", False), ("AB", False), ("ABCA", False)]:
        eq(IstPalindrom(w), exp, f"IstPalindrom({w!r})")
    r, rec = recursive(IstPalindrom, "REITTIER")
    ok(rec, "IstPalindrom muss rekursiv sein")
--- hint
Raetsel2: Die Summe wandert als Parameter nach unten; bei `b == 0` ist sie das Ergebnis.
--- explain
In `Raetsel2` bleibt nach dem rekursiven Aufruf nichts mehr zu tun, jeder Rahmen reicht die Antwort einfach weiter. `IstPalindrom` hat zwei Enden: das triviale Wort (wahr) und eine Abweichung (falsch).
:::

:::exercise id=d3-graph title="Aufgabe 2: die schnellste Route" level=2
Implementiere `KnotenBesuchen(aktuell, ziel, länge)` wie in 2 e. `SchnellsteRoute(start, ziel)` (gegeben) gibt die Route und ihre Zeit zurück.
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
        self.gefunden = []

    def KnotenBesuchen(self, aktuell, ziel, länge):
        pass

    def SchnellsteRoute(self, start, ziel):
        self.besuchteKnoten = []
        self.aktuellerWeg = []
        self.optimalerWeg = []
        self.optimaleLänge = float('inf')
        self.KnotenBesuchen(self.knoten.index(start), self.knoten.index(ziel), 0)
        return "-".join(self.optimalerWeg), self.optimaleLänge


DEPOTS = GraphMatrix(list("ABCDEFG"), [("A", "B", 5), ("A", "C", 3), ("B", "D", 4), ("B", "G", 2),
                                         ("C", "D", 5), ("C", "E", 2), ("D", "F", 3), ("E", "F", 7)])
print(DEPOTS.SchnellsteRoute("A", "F"))
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
        self.gefunden = []

    def KnotenBesuchen(self, aktuell, ziel, länge):
        self.besuchteKnoten.append(aktuell)
        self.aktuellerWeg.append(self.knoten[aktuell])
        if aktuell == ziel:
            if länge < self.optimaleLänge:
                self.optimaleLänge = länge
                self.optimalerWeg = list(self.aktuellerWeg)
        else:
            for nummer in range(len(self.knoten)):
                if self.matrix[aktuell][nummer] > 0 and nummer not in self.besuchteKnoten:
                    self.KnotenBesuchen(nummer, ziel, länge + self.matrix[aktuell][nummer])
        self.besuchteKnoten.remove(aktuell)
        self.aktuellerWeg.pop()

    def SchnellsteRoute(self, start, ziel):
        self.besuchteKnoten = []
        self.aktuellerWeg = []
        self.optimalerWeg = []
        self.optimaleLänge = float('inf')
        self.KnotenBesuchen(self.knoten.index(start), self.knoten.index(ziel), 0)
        return "-".join(self.optimalerWeg), self.optimaleLänge


DEPOTS = GraphMatrix(list("ABCDEFG"), [("A", "B", 5), ("A", "C", 3), ("B", "D", 4), ("B", "G", 2),
                                         ("C", "D", 5), ("C", "E", 2), ("D", "F", 3), ("E", "F", 7)])
print(DEPOTS.SchnellsteRoute("A", "F"))
--- tests
@test("A → F: A-C-D-F, 11 Minuten")
def _():
    eq(DEPOTS.SchnellsteRoute("A", "F"), ("A-C-D-F", 11), "Route")

@test("Weitere Routen")
def _():
    eq(DEPOTS.SchnellsteRoute("G", "E"), ("G-B-A-C-E", 12), "G → E")
    eq(DEPOTS.SchnellsteRoute("F", "A"), ("F-D-C-A", 11), "F → A")
    eq(DEPOTS.SchnellsteRoute("D", "D"), ("D", 0), "D → D")

@test("Sauberer Zustand danach")
def _():
    DEPOTS.SchnellsteRoute("A", "G")
    eq((DEPOTS.besuchteKnoten, DEPOTS.aktuellerWeg), ([], []), "besuchteKnoten und aktuellerWeg nach der Suche")
--- hint
Vergleiche mit der Brücke in B4 und mit deiner Antwort zu 2 e. Die häufigsten Fehler: keine Kopie, Markierung nicht entfernt, Markierung in der Schleife entfernt.
--- explain
Das ist die Suche aus B4 auf dem Klausurgraphen. G → E ist ein guter Test: Der einzige Weg aus G heraus führt über B, dann schlägt A – C – E (2 + 5 + 3 + 2 = 12) den Weg B – D – C – E (2 + 4 + 5 + 2 = 13).
:::

:::exercise id=d3-playlist title="Aufgabe 3: die Playlist" level=2
Implementiere `GesamtdauerGeben()` und `SongEntfernen(titel)` in `Playlist`, `Knoten` und `Abschluss` wie in 3 c und 3 e.
--- starter
from abc import ABC, abstractmethod


class Song:
    def __init__(self, titel, dauer):
        self.titel = titel
        self.dauer = dauer

    def TitelGeben(self):
        return self.titel

    def DauerGeben(self):
        return self.dauer


class Listenelement(ABC):
    @abstractmethod
    def HintenEinfuegen(self, s):
        pass

    @abstractmethod
    def GesamtdauerGeben(self):
        pass

    @abstractmethod
    def SongEntfernen(self, titel):
        pass


class Knoten(Listenelement):
    def __init__(self, s, k):
        self.daten = s
        self.nachfolger = k

    def HintenEinfuegen(self, s):
        self.nachfolger = self.nachfolger.HintenEinfuegen(s)
        return self

    def GesamtdauerGeben(self):
        pass

    def SongEntfernen(self, titel):
        pass


class Abschluss(Listenelement):
    def HintenEinfuegen(self, s):
        return Knoten(s, self)

    def GesamtdauerGeben(self):
        pass

    def SongEntfernen(self, titel):
        pass


class Playlist:
    def __init__(self):
        self.anfang = Abschluss()

    def HintenEinfuegen(self, s):
        self.anfang = self.anfang.HintenEinfuegen(s)

    def VorneEinfuegen(self, s):
        self.anfang = Knoten(s, self.anfang)

    def GesamtdauerGeben(self):
        pass

    def SongEntfernen(self, titel):
        pass


p = Playlist()
p.HintenEinfuegen(Song("Intro", 180))
p.HintenEinfuegen(Song("Refrain", 240))
print(p.GesamtdauerGeben())
--- solution
from abc import ABC, abstractmethod


class Song:
    def __init__(self, titel, dauer):
        self.titel = titel
        self.dauer = dauer

    def TitelGeben(self):
        return self.titel

    def DauerGeben(self):
        return self.dauer


class Listenelement(ABC):
    @abstractmethod
    def HintenEinfuegen(self, s):
        pass

    @abstractmethod
    def GesamtdauerGeben(self):
        pass

    @abstractmethod
    def SongEntfernen(self, titel):
        pass


class Knoten(Listenelement):
    def __init__(self, s, k):
        self.daten = s
        self.nachfolger = k

    def HintenEinfuegen(self, s):
        self.nachfolger = self.nachfolger.HintenEinfuegen(s)
        return self

    def GesamtdauerGeben(self):
        return self.daten.DauerGeben() + self.nachfolger.GesamtdauerGeben()

    def SongEntfernen(self, titel):
        if self.daten.TitelGeben() == titel:
            return self.nachfolger
        self.nachfolger = self.nachfolger.SongEntfernen(titel)
        return self


class Abschluss(Listenelement):
    def HintenEinfuegen(self, s):
        return Knoten(s, self)

    def GesamtdauerGeben(self):
        return 0

    def SongEntfernen(self, titel):
        return self


class Playlist:
    def __init__(self):
        self.anfang = Abschluss()

    def HintenEinfuegen(self, s):
        self.anfang = self.anfang.HintenEinfuegen(s)

    def VorneEinfuegen(self, s):
        self.anfang = Knoten(s, self.anfang)

    def GesamtdauerGeben(self):
        return self.anfang.GesamtdauerGeben()

    def SongEntfernen(self, titel):
        self.anfang = self.anfang.SongEntfernen(titel)


p = Playlist()
p.HintenEinfuegen(Song("Intro", 180))
p.HintenEinfuegen(Song("Refrain", 240))
print(p.GesamtdauerGeben())
--- tests
def titel(p):
    out = []
    e = p.anfang
    while isinstance(e, Knoten) and len(out) < 30:
        out.append(e.daten.titel)
        e = e.nachfolger
    return out

def pl(*songs):
    p = Playlist()
    for t, d in songs:
        p.HintenEinfuegen(Song(t, d))
    return p

@test("GesamtdauerGeben")
def _():
    eq(OUTPUT.strip(), "420", "Ausgabe des Beispiels")
    eq(Playlist().GesamtdauerGeben(), 0, "leere Playlist")
    eq(pl(("a", 100), ("b", 20), ("c", 3)).GesamtdauerGeben(), 123, "drei Songs")

@test("SongEntfernen")
def _():
    p = pl(("a", 1), ("b", 2), ("c", 3), ("b", 4))
    p.SongEntfernen("b")
    eq(titel(p), ["a", "c", "b"], "nur das erste 'b' wird entfernt")
    p.SongEntfernen("a")
    eq(titel(p), ["c", "b"], "Entfernen des ersten Songs")
    p.SongEntfernen("x")
    eq(titel(p), ["c", "b"], "unbekannter Titel")
    p.SongEntfernen("b")
    p.SongEntfernen("c")
    ok(isinstance(p.anfang, Abschluss), "nach dem Entfernen von allem muss anfang der Abschluss sein")
    p.SongEntfernen("c")
    ok(isinstance(p.anfang, Abschluss), "Entfernen aus einer leeren Playlist")
--- hint
GesamtdauerGeben hat die Form von LaengeGeben, mit der Dauer des Songs statt 1.
--- explain
Beide Methoden folgen C4: Der ABSCHLUSS beendet die Rekursion (0 Sekunden, nichts zu entfernen), der KNOTEN verknüpft seinen eigenen Teil mit der Antwort des Rests.
:::
