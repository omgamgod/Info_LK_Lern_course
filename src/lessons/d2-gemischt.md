---
id: d2
num: D2
part: D
title: Gemischte Aufgaben
short: Gemischte Aufgaben
lead: Klausuraufgaben bleiben selten innerhalb einer Lektion. Diese Blöcke verbinden Themen, z. B. eine Breitensuche mit deiner eigenen Warteschlange, eine Wegzählung durch Rekursion mit Rückgabewerten oder Rekursion auf einer Kompositum-Liste in einer Richtung, die du noch nicht geübt hast. Jeder Block nennt die Lektionen, auf die er zurückgreift.
minutes: 100
uses: [b1, b3, b4, c1, c2, c4]
goals:
  - Warteschlange, Graph und Rekursion in einem Programm verbinden
  - rekursive Methoden schreiben, die Rückgabewerte verknüpfen (Wege zählen)
  - entscheiden, an welcher Stelle einer rekursiven Methode die eigene Arbeit passiert (vor oder nach dem rekursiven Aufruf)
  - die Kompositum-Liste wiederverwenden, um andere Strukturen zu bauen
---

## [intro] So funktionieren diese Blöcke

Jeder Block steht für sich: Der Startcode enthält alle Klassen, die du brauchst, und die Aufgabe sagt, auf welchen Lektionen sie aufbaut. Sie sind grob nach Schwierigkeit geordnet. Versuch jeden zuerst ohne Tipps; steckst du länger als zehn Minuten fest, öffne einen Tipp und geh dann zu der Lektion zurück, die in der Aufgabe genannt ist.

## [logic] Bevor du anfängst: die Stelle der eigenen Arbeit

Viele Aufgaben unterscheiden sich nur darin, **wo** ein Knoten (oder ein Aufruf) seine eigene Arbeit erledigt:

:::cols
**Vor dem rekursiven Aufruf** (auf dem Weg nach unten): Die Dinge passieren in der Reihenfolge der Liste / des Abstiegs.

```python
def InformationAusgeben(self):         # Knoten
    self.daten.InformationAusgeben()   # zuerst ich
    self.nachfolger.InformationAusgeben()
```
--- col
**Nach dem rekursiven Aufruf** (auf dem Weg zurück nach oben): Die Dinge passieren in **umgekehrter** Reihenfolge, und der Aufruf kann das Ergebnis des Rests verwenden.

```python
def LaengeGeben(self):                 # Knoten
    rest = self.nachfolger.LaengeGeben()
    return rest + 1                    # ich nach dem Rest
```
:::

Das ist wieder der Abstieg / Aufstieg aus Lektion B1: Alles, was du nach den Aufruf schreibst, wartet, bis die tieferen Aufrufe fertig sind.

:::quiz
Eine Kompositum-Liste enthält A, B, C. In `Knoten.X()` ruft der Knoten **zuerst** `self.nachfolger.X()` auf und gibt **dann** seine Daten aus; der ABSCHLUSS tut nichts. Was gibt `liste.X()` aus?
- [ ] A B C
- [x] C B A
- [ ] nur C
- [ ] nichts
--- explain
Der Knoten von A wartet auf den von B, der auf den von C wartet, der auf den ABSCHLUSS wartet. Die Ausgaben passieren beim Aufstieg: zuerst C, dann B, dann A.
:::

## [python] Graphen und Warteschlangen

:::exercise id=d2-bfs-queue title="Breitensuche mit deiner eigenen Warteschlange (B3 + C2)" level=2
In B3 hat die Breitensuche eine Python-Liste als Warteschlange verwendet. Nimm jetzt die `Warteschlange` aus Lektion C2 (gegeben, mit `Einfügen`, `Entfernen`, `IstLeer`). Die Warteschlange speichert die **Knotennummern**.

Implementiere `BreitensucheAusführen(start)`: Es gibt die Liste der Knotennamen in der Reihenfolge zurück, in der sie aus der Warteschlange genommen werden. Verwende kein Python-`pop` auf einer Liste.
--- starter
class Knoten:
    def __init__(self, d):
        self.daten = d
        self.nachfolger = None

    def NachfolgerSetzen(self, nf):
        self.nachfolger = nf

    def NachfolgerGeben(self):
        return self.nachfolger

    def DatenelementGeben(self):
        return self.daten


class Warteschlange:
    def __init__(self):
        self.anfang = None
        self.ende = None

    def Einfügen(self, d):
        k = Knoten(d)
        if self.anfang is None:
            self.anfang = k
        else:
            self.ende.NachfolgerSetzen(k)
        self.ende = k

    def Entfernen(self):
        if self.anfang is None:
            return None
        k = self.anfang
        self.anfang = self.anfang.NachfolgerGeben()
        if self.anfang is None:
            self.ende = None
        return k.DatenelementGeben()

    def IstLeer(self):
        return self.anfang is None


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
class Knoten:
    def __init__(self, d):
        self.daten = d
        self.nachfolger = None

    def NachfolgerSetzen(self, nf):
        self.nachfolger = nf

    def NachfolgerGeben(self):
        return self.nachfolger

    def DatenelementGeben(self):
        return self.daten


class Warteschlange:
    def __init__(self):
        self.anfang = None
        self.ende = None

    def Einfügen(self, d):
        k = Knoten(d)
        if self.anfang is None:
            self.anfang = k
        else:
            self.ende.NachfolgerSetzen(k)
        self.ende = k

    def Entfernen(self):
        if self.anfang is None:
            return None
        k = self.anfang
        self.anfang = self.anfang.NachfolgerGeben()
        if self.anfang is None:
            self.ende = None
        return k.DatenelementGeben()

    def IstLeer(self):
        return self.anfang is None


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
        schlange = Warteschlange()
        schlange.Einfügen(s)
        reihenfolge = []
        while not schlange.IstLeer():
            k = schlange.Entfernen()
            reihenfolge.append(self.knoten[k])
            for n in range(len(self.knoten)):
                if self.matrix[k][n] > 0 and n not in besucht:
                    besucht.append(n)
                    schlange.Einfügen(n)
        return reihenfolge


K7 = GraphMatrix(["K1", "K2", "K3", "K4", "K5", "K6", "K7"],
                 [("K1", "K2"), ("K1", "K7"), ("K1", "K6"), ("K2", "K3"), ("K7", "K3"), ("K6", "K5"), ("K3", "K4"), ("K5", "K4")])
print(K7.BreitensucheAusführen("K1"))
--- tests
import ast

def method_src(cls, name):
    for node in ast.parse(SOURCE).body:
        if isinstance(node, ast.ClassDef) and node.name == cls:
            for fn in node.body:
                if isinstance(fn, ast.FunctionDef) and fn.name == name:
                    return fn
    return None

@test("Ab K1: K1, K2, K6, K7, K3, K5, K4")
def _():
    eq(K7.BreitensucheAusführen("K1"), ["K1", "K2", "K6", "K7", "K3", "K5", "K4"], "Reihenfolge")

@test("Ab K4 und ein nicht zusammenhängender Graph")
def _():
    eq(K7.BreitensucheAusführen("K4"), ["K4", "K3", "K5", "K2", "K7", "K6", "K1"], "Reihenfolge ab K4")
    g = GraphMatrix(list("ABCD"), [("A", "B"), ("C", "D")])
    eq(g.BreitensucheAusführen("C"), ["C", "D"], "Reihenfolge ab C")

@test("Verwendet die Warteschlange, keine Liste mit pop")
def _():
    fn = method_src("GraphMatrix", "BreitensucheAusführen")
    ok(fn is not None, "Methode BreitensucheAusführen nicht gefunden")
    names = {n.id for n in ast.walk(fn) if isinstance(n, ast.Name)}
    attrs = {n.attr for n in ast.walk(fn) if isinstance(n, ast.Attribute)}
    ok("Warteschlange" in names, "erzeuge in BreitensucheAusführen eine Warteschlange()")
    ok("pop" not in attrs, "verwende kein list.pop: nimm Elemente mit Entfernen() heraus")
    ok("Entfernen" in attrs and "Einfügen" in attrs, "verwende Einfügen und Entfernen der Warteschlange")
--- hint
Ersetze `schlange = [s]` durch eine Warteschlange mit einem Einfügen, `while len(schlange) > 0` durch `while not schlange.IstLeer()`, `pop(0)` durch `Entfernen()` und `append` durch `Einfügen`.
--- explain
Dem Algorithmus ist es egal, wie die Warteschlange gebaut ist, nur FIFO muss sie sein. Das ist die Idee einer Datenstruktur mit fester Schnittstelle (Einfügen, Entfernen, IstLeer): Die Breitensuche funktioniert mit einer Python-Liste, einem Feld oder einer Kette von Knoten.
:::

:::exercise id=d2-count title="Alle Wege über Rückgabewerte zählen (B4 + B1)" level=2
In B4 wurden alle Wege in Attributen gesammelt. Hier wird die Zahl der Wege über **Rückgabewerte** zurückgegeben, wie bei `LaengeGeben`:

`WegeZaehlen(aktuell, ziel)` gibt die Zahl der einfachen Wege von Knotennummer `aktuell` zu Knotennummer `ziel` zurück:

- am Ziel: genau 1 Weg (der, der hier endet)
- sonst: `aktuell` markieren, die Wegzahlen aller unmarkierten Nachbarn addieren, die Markierung von `aktuell` entfernen, die Summe zurückgeben

`AnzahlWege(start, ziel)` übersetzt die Namen und startet die Rekursion.
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

    def WegeZaehlen(self, aktuell, ziel):
        pass

    def AnzahlWege(self, start, ziel):
        self.besuchteKnoten = []
        return self.WegeZaehlen(self.knoten.index(start), self.knoten.index(ziel))


AUTOBAHN = GraphMatrix(["FD", "WÜ", "UL", "S", "LI", "A", "M", "N", "HO", "R", "RO"],
    [("WÜ", "FD", 86), ("S", "UL", 103), ("UL", "WÜ", 165), ("UL", "LI", 126), ("UL", "A", 59),
     ("A", "M", 64), ("M", "N", 163), ("WÜ", "N", 104), ("N", "HO", 116), ("N", "R", 80),
     ("R", "M", 117), ("M", "RO", 60), ("HO", "R", 166), ("WÜ", "HO", 192)])

print(AUTOBAHN.AnzahlWege("UL", "HO"))
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

    def WegeZaehlen(self, aktuell, ziel):
        if aktuell == ziel:
            return 1
        self.besuchteKnoten.append(aktuell)
        anzahl = 0
        for nummer in range(len(self.knoten)):
            if self.matrix[aktuell][nummer] > 0 and nummer not in self.besuchteKnoten:
                anzahl += self.WegeZaehlen(nummer, ziel)
        self.besuchteKnoten.remove(aktuell)
        return anzahl

    def AnzahlWege(self, start, ziel):
        self.besuchteKnoten = []
        return self.WegeZaehlen(self.knoten.index(start), self.knoten.index(ziel))


AUTOBAHN = GraphMatrix(["FD", "WÜ", "UL", "S", "LI", "A", "M", "N", "HO", "R", "RO"],
    [("WÜ", "FD", 86), ("S", "UL", 103), ("UL", "WÜ", 165), ("UL", "LI", 126), ("UL", "A", 59),
     ("A", "M", 64), ("M", "N", 163), ("WÜ", "N", 104), ("N", "HO", 116), ("N", "R", 80),
     ("R", "M", 117), ("M", "RO", 60), ("HO", "R", 166), ("WÜ", "HO", 192)])

print(AUTOBAHN.AnzahlWege("UL", "HO"))
--- tests
@test("UL → HO: 10 Wege (wie in B4)")
def _():
    eq(AUTOBAHN.AnzahlWege("UL", "HO"), 10, "Anzahl der Wege")

@test("Kleine Fälle")
def _():
    eq(AUTOBAHN.AnzahlWege("M", "M"), 1, "start == ziel")
    eq(AUTOBAHN.AnzahlWege("S", "UL"), 1, "S hat nur einen Nachbarn")
    g = GraphMatrix(list("ABCDEFG"), [("A", "B", 5), ("A", "C", 3), ("B", "D", 4), ("B", "G", 2), ("C", "D", 5), ("C", "E", 2), ("D", "F", 3), ("E", "F", 7)])
    eq(g.AnzahlWege("A", "F"), 4, "A → F im Graphen der Probeklausur")

@test("Danach alles freigegeben, rekursiv")
def _():
    AUTOBAHN.AnzahlWege("FD", "RO")
    eq(AUTOBAHN.besuchteKnoten, [], "besuchteKnoten nach der Suche")
    AUTOBAHN.besuchteKnoten = []
    r, rec = recursive(AUTOBAHN.WegeZaehlen, 2, 8)
    ok(rec, "WegeZaehlen muss sich selbst aufrufen")
--- hint
Die Struktur ist die Suche aus B4, aber statt am Ziel einen Weg zu speichern, schreibst du `return 1`, und statt die Nachbarn „einfach so“ aufzurufen, addierst du, was sie zurückgeben: `anzahl += self.WegeZaehlen(nummer, ziel)`.
--- hint
Vergiss nicht, die Markierung vor `return anzahl` zu entfernen, sonst können spätere Zweige den Knoten nicht benutzen.
--- explain
Jeder Aufruf beantwortet die Frage *„Wie viele Wege führen von hier zum Ziel, ohne einen markierten Knoten zu benutzen?“*. Das ist die Summe über alle Nachbarn. Das Rekursionsende ist das Ziel selbst (1). Ein Knoten ohne unmarkierte Nachbarn gibt 0 zurück: eine Sackgasse.
:::

## [python] Rekursion auf der Kompositum-Liste

Alle Blöcke in diesem Abschnitt verwenden die Kompositum-Klassen aus C4 (gegeben).

:::exercise id=d2-reverse title="RueckwaertsAusgeben (B1 + C4)" level=2
Ergänze `RueckwaertsAusgeben()` in `Liste`, `Knoten` und `Abschluss`: gibt alle Datenelemente vom **letzten** bis zum **ersten** aus. Kein `if`, keine Python-Liste, keine Schleife.
--- starter
from abc import ABC, abstractmethod


class Patient:
    def __init__(self, name):
        self.name = name

    def InformationAusgeben(self):
        print(self.name)


class Listenelement(ABC):
    @abstractmethod
    def HintenEinfuegen(self, dneu):
        pass

    @abstractmethod
    def RueckwaertsAusgeben(self):
        pass


class Knoten(Listenelement):
    def __init__(self, dneu, kneu):
        self.daten = dneu
        self.nachfolger = kneu

    def HintenEinfuegen(self, dneu):
        self.nachfolger = self.nachfolger.HintenEinfuegen(dneu)
        return self

    def RueckwaertsAusgeben(self):
        pass


class Abschluss(Listenelement):
    def HintenEinfuegen(self, dneu):
        return Knoten(dneu, self)

    def RueckwaertsAusgeben(self):
        pass


class Liste:
    def __init__(self):
        self.anfang = Abschluss()

    def HintenEinfuegen(self, dneu):
        self.anfang = self.anfang.HintenEinfuegen(dneu)

    def RueckwaertsAusgeben(self):
        pass


l = Liste()
for n in ["Andi", "Bert", "Clara"]:
    l.HintenEinfuegen(Patient(n))
l.RueckwaertsAusgeben()
--- solution
from abc import ABC, abstractmethod


class Patient:
    def __init__(self, name):
        self.name = name

    def InformationAusgeben(self):
        print(self.name)


class Listenelement(ABC):
    @abstractmethod
    def HintenEinfuegen(self, dneu):
        pass

    @abstractmethod
    def RueckwaertsAusgeben(self):
        pass


class Knoten(Listenelement):
    def __init__(self, dneu, kneu):
        self.daten = dneu
        self.nachfolger = kneu

    def HintenEinfuegen(self, dneu):
        self.nachfolger = self.nachfolger.HintenEinfuegen(dneu)
        return self

    def RueckwaertsAusgeben(self):
        self.nachfolger.RueckwaertsAusgeben()
        self.daten.InformationAusgeben()


class Abschluss(Listenelement):
    def HintenEinfuegen(self, dneu):
        return Knoten(dneu, self)

    def RueckwaertsAusgeben(self):
        pass


class Liste:
    def __init__(self):
        self.anfang = Abschluss()

    def HintenEinfuegen(self, dneu):
        self.anfang = self.anfang.HintenEinfuegen(dneu)

    def RueckwaertsAusgeben(self):
        self.anfang.RueckwaertsAusgeben()


l = Liste()
for n in ["Andi", "Bert", "Clara"]:
    l.HintenEinfuegen(Patient(n))
l.RueckwaertsAusgeben()
--- tests
import ast

@test("Clara, Bert, Andi")
def _():
    eq(lines(OUTPUT), ["Clara", "Bert", "Andi"], "ausgegebene Zeilen")

@test("Leere Liste und ein Element")
def _():
    eq(printed(Liste().RueckwaertsAusgeben).strip(), "", "Ausgabe für die leere Liste")
    l2 = Liste()
    l2.HintenEinfuegen(Patient("X"))
    eq(lines(printed(l2.RueckwaertsAusgeben)), ["X"], "ein Element")

@test("Rekursiv, ohne if, Schleife oder Python-Liste")
def _():
    for node in ast.parse(SOURCE).body:
        if isinstance(node, ast.ClassDef) and node.name in ("Knoten", "Abschluss", "Liste"):
            for fn in node.body:
                if isinstance(fn, ast.FunctionDef) and fn.name == "RueckwaertsAusgeben":
                    bad = [n for n in ast.walk(fn) if isinstance(n, (ast.If, ast.For, ast.While, ast.List, ast.ListComp))]
                    ok(not bad, f"{node.name}.RueckwaertsAusgeben: kein if, keine Schleife und keine Liste nötig")
--- hint
Vergleiche mit `InformationAusgeben` aus C4. Nur die **Reihenfolge zweier Zeilen** im Knoten ist anders.
--- explain
Der Knoten lässt zuerst den Rest sich selbst ausgeben (Abstieg bis zum Abschluss) und gibt seine eigenen Daten erst auf dem Rückweg aus: Der letzte Knoten gibt zuerst aus.
:::

:::exercise id=d2-max title="Die beste Messung: Information nach unten weitergeben (C4)" level=3
Eine Liste speichert `Messung`-Objekte (`ort`, `wert`). Implementiere `MaximumGeben(bisher)` in `Knoten` und `Abschluss` im Stil von `EndeGeben(bisher)` aus C4: `bisher` ist das Datenelement mit dem größten **bisher gesehenen** Wert (oder `None` am Anfang). `Liste.MaximumGeben()` gibt die Messung mit dem größten Wert zurück, `None` bei einer leeren Liste. Bei gleichen Werten bleibt die frühere.
--- starter
from abc import ABC, abstractmethod


class Messung:
    def __init__(self, ort, wert):
        self.ort = ort
        self.wert = wert


class Listenelement(ABC):
    @abstractmethod
    def HintenEinfuegen(self, dneu):
        pass

    @abstractmethod
    def MaximumGeben(self, bisher):
        pass


class Knoten(Listenelement):
    def __init__(self, dneu, kneu):
        self.daten = dneu
        self.nachfolger = kneu

    def HintenEinfuegen(self, dneu):
        self.nachfolger = self.nachfolger.HintenEinfuegen(dneu)
        return self

    def MaximumGeben(self, bisher):
        pass


class Abschluss(Listenelement):
    def HintenEinfuegen(self, dneu):
        return Knoten(dneu, self)

    def MaximumGeben(self, bisher):
        pass


class Liste:
    def __init__(self):
        self.anfang = Abschluss()

    def HintenEinfuegen(self, dneu):
        self.anfang = self.anfang.HintenEinfuegen(dneu)

    def MaximumGeben(self):
        pass


l = Liste()
for ort, wert in [("Passau", 31), ("Hof", 27), ("Würzburg", 34), ("Kempten", 29)]:
    l.HintenEinfuegen(Messung(ort, wert))
m = l.MaximumGeben()
print(m.ort, m.wert)
--- solution
from abc import ABC, abstractmethod


class Messung:
    def __init__(self, ort, wert):
        self.ort = ort
        self.wert = wert


class Listenelement(ABC):
    @abstractmethod
    def HintenEinfuegen(self, dneu):
        pass

    @abstractmethod
    def MaximumGeben(self, bisher):
        pass


class Knoten(Listenelement):
    def __init__(self, dneu, kneu):
        self.daten = dneu
        self.nachfolger = kneu

    def HintenEinfuegen(self, dneu):
        self.nachfolger = self.nachfolger.HintenEinfuegen(dneu)
        return self

    def MaximumGeben(self, bisher):
        if bisher is None or self.daten.wert > bisher.wert:
            bisher = self.daten
        return self.nachfolger.MaximumGeben(bisher)


class Abschluss(Listenelement):
    def HintenEinfuegen(self, dneu):
        return Knoten(dneu, self)

    def MaximumGeben(self, bisher):
        return bisher


class Liste:
    def __init__(self):
        self.anfang = Abschluss()

    def HintenEinfuegen(self, dneu):
        self.anfang = self.anfang.HintenEinfuegen(dneu)

    def MaximumGeben(self):
        return self.anfang.MaximumGeben(None)


l = Liste()
for ort, wert in [("Passau", 31), ("Hof", 27), ("Würzburg", 34), ("Kempten", 29)]:
    l.HintenEinfuegen(Messung(ort, wert))
m = l.MaximumGeben()
print(m.ort, m.wert)
--- tests
def liste(*paare):
    l = Liste()
    ms = [Messung(o, w) for o, w in paare]
    for m in ms:
        l.HintenEinfuegen(m)
    return l, ms

@test("Würzburg 34")
def _():
    eq(OUTPUT.strip(), "Würzburg 34", "Ausgabe")

@test("Maximum vorne, am Ende, Gleichstand")
def _():
    l, ms = liste(("a", 9), ("b", 2), ("c", 5))
    ok(l.MaximumGeben() is ms[0], "Maximum vorne")
    l, ms = liste(("a", 1), ("b", 2), ("c", 5))
    ok(l.MaximumGeben() is ms[2], "Maximum am Ende")
    l, ms = liste(("a", 4), ("b", 7), ("c", 7))
    ok(l.MaximumGeben() is ms[1], "zwei gleiche Maxima: das frühere")
    l, ms = liste(("a", -3), ("b", -8))
    ok(l.MaximumGeben() is ms[0], "negative Werte")

@test("Leere Liste")
def _():
    eq(Liste().MaximumGeben(), None, "MaximumGeben() der leeren Liste")
--- hint
Knoten: Vergleiche deine eigenen Daten mit `bisher`; gib das Bessere weiter: `return self.nachfolger.MaximumGeben(…)`.
--- hint
Der Abschluss gibt zurück, was er bekommt. Die Liste beginnt mit `None`. Der Knoten muss `bisher is None` behandeln (noch keine Messung gesehen).
--- explain
Die Information „bisher am besten“ wandert als Parameter **nach unten**, und die endgültige Antwort wandert unverändert **nach oben** zurück: Die Rekursion ist endrekursiv. Eine Version, die auf dem Rückweg vergleicht (zuerst `rest = nachfolger.MaximumGeben()`), funktioniert auch, dann muss der ABSCHLUSS aber etwas zurückgeben, mit dem jeder Vergleich zurechtkommt.
:::

:::exercise id=d2-queue-komp title="Eine Warteschlange aus dem Kompositum (C1 + C4)" level=2
Eine Warteschlange ist eine Liste, die nur hinten einfügen und vorne entfernen erlaubt. Implementiere die Klasse `Warteschlange` **mithilfe** der Kompositum-Liste: Ihr einziges Attribut ist `self.liste`, ein `Liste`-Objekt, und

- `Einfügen(d)` fügt hinten ein,
- `Entfernen()` entfernt das erste Datenelement und gibt es zurück (`None`, wenn leer),
- `IstLeer()`.

Verwende in `Warteschlange` kein `if`. Vergleiche mit all den Sonderfällen aus C1.
--- starter
from abc import ABC, abstractmethod


class Listenelement(ABC):
    @abstractmethod
    def HintenEinfuegen(self, dneu):
        pass

    @abstractmethod
    def LaengeGeben(self):
        pass

    @abstractmethod
    def NachfolgerGeben(self):
        pass

    @abstractmethod
    def DatenelementGeben(self):
        pass


class Knoten(Listenelement):
    def __init__(self, dneu, kneu):
        self.daten = dneu
        self.nachfolger = kneu

    def HintenEinfuegen(self, dneu):
        self.nachfolger = self.nachfolger.HintenEinfuegen(dneu)
        return self

    def LaengeGeben(self):
        return self.nachfolger.LaengeGeben() + 1

    def NachfolgerGeben(self):
        return self.nachfolger

    def DatenelementGeben(self):
        return self.daten


class Abschluss(Listenelement):
    def HintenEinfuegen(self, dneu):
        return Knoten(dneu, self)

    def LaengeGeben(self):
        return 0

    def NachfolgerGeben(self):
        return self

    def DatenelementGeben(self):
        return None


class Liste:
    def __init__(self):
        self.anfang = Abschluss()

    def HintenEinfuegen(self, dneu):
        self.anfang = self.anfang.HintenEinfuegen(dneu)

    def LaengeGeben(self):
        return self.anfang.LaengeGeben()

    def AnfangEntfernen(self):
        d = self.anfang.DatenelementGeben()
        self.anfang = self.anfang.NachfolgerGeben()
        return d


class Warteschlange:
    def __init__(self):
        pass

    def Einfügen(self, d):
        pass

    def Entfernen(self):
        pass

    def IstLeer(self):
        pass
--- solution
from abc import ABC, abstractmethod


class Listenelement(ABC):
    @abstractmethod
    def HintenEinfuegen(self, dneu):
        pass

    @abstractmethod
    def LaengeGeben(self):
        pass

    @abstractmethod
    def NachfolgerGeben(self):
        pass

    @abstractmethod
    def DatenelementGeben(self):
        pass


class Knoten(Listenelement):
    def __init__(self, dneu, kneu):
        self.daten = dneu
        self.nachfolger = kneu

    def HintenEinfuegen(self, dneu):
        self.nachfolger = self.nachfolger.HintenEinfuegen(dneu)
        return self

    def LaengeGeben(self):
        return self.nachfolger.LaengeGeben() + 1

    def NachfolgerGeben(self):
        return self.nachfolger

    def DatenelementGeben(self):
        return self.daten


class Abschluss(Listenelement):
    def HintenEinfuegen(self, dneu):
        return Knoten(dneu, self)

    def LaengeGeben(self):
        return 0

    def NachfolgerGeben(self):
        return self

    def DatenelementGeben(self):
        return None


class Liste:
    def __init__(self):
        self.anfang = Abschluss()

    def HintenEinfuegen(self, dneu):
        self.anfang = self.anfang.HintenEinfuegen(dneu)

    def LaengeGeben(self):
        return self.anfang.LaengeGeben()

    def AnfangEntfernen(self):
        d = self.anfang.DatenelementGeben()
        self.anfang = self.anfang.NachfolgerGeben()
        return d


class Warteschlange:
    def __init__(self):
        self.liste = Liste()

    def Einfügen(self, d):
        self.liste.HintenEinfuegen(d)

    def Entfernen(self):
        return self.liste.AnfangEntfernen()

    def IstLeer(self):
        return self.liste.LaengeGeben() == 0
--- tests
import ast

@test("FIFO-Reihenfolge")
def _():
    w = Warteschlange()
    for n in ["Andi", "Bert", "Clara"]:
        w.Einfügen(n)
    eq([w.Entfernen() for i in range(3)], ["Andi", "Bert", "Clara"], "in dieser Reihenfolge entfernt")

@test("Leere Warteschlange, Wiederbefüllen nach dem Leeren")
def _():
    w = Warteschlange()
    eq(w.IstLeer(), True, "IstLeer() einer neuen Warteschlange")
    eq(w.Entfernen(), None, "Entfernen() einer leeren Warteschlange")
    w.Einfügen("A")
    eq(w.IstLeer(), False, "IstLeer() nach einem Einfügen")
    eq(w.Entfernen(), "A", "Entfernen()")
    w.Einfügen("B")
    eq(w.Entfernen(), "B", "Entfernen() nach dem Wiederbefüllen (der Fehlerfall aus C1)")
    eq(w.IstLeer(), True, "IstLeer() am Ende")

@test("Aus der Liste gebaut, ohne if")
def _():
    w = Warteschlange()
    ok(isinstance(getattr(w, "liste", None), Liste), "die Warteschlange muss ein Attribut liste = Liste() haben")
    for node in ast.parse(SOURCE).body:
        if isinstance(node, ast.ClassDef) and node.name == "Warteschlange":
            ok(not any(isinstance(n, ast.If) for n in ast.walk(node)), "Warteschlange braucht kein if")
--- hint
Jede Methode ist eine Zeile, die eine Methode von `self.liste` aufruft.
--- explain
Alle Sonderfälle, die C1 brauchte (leere Warteschlange, ein Element, `ende` zurücksetzen), erledigt der ABSCHLUSS. Der Preis: HintenEinfuegen durchläuft die ganze Liste, während die Warteschlange aus C1 mit `ende` direkt ans Ende sprang. Was wichtiger ist, hängt von der Anwendung ab.
:::

## [exam] Klausurtraining

:::exam title="Code lesen" points=4
```python
def Geheim(liste_von_zahlen, i):
    if i == len(liste_von_zahlen):
        return 0
    if liste_von_zahlen[i] % 2 == 0:
        return 1 + Geheim(liste_von_zahlen, i + 1)
    return Geheim(liste_von_zahlen, i + 1)
```
a) Bestimme `Geheim([3, 8, 2, 5], 0)` und beschreibe, was die Funktion berechnet.
b) Ist `Geheim` linear rekursiv? Ist es endrekursiv?
--- solution
a) Aufrufe: i = 0 (3 ungerade) → i = 1 (8 gerade: 1 + …) → i = 2 (2 gerade: 1 + …) → i = 3 (5 ungerade) → i = 4 = len → 0. Aufstieg: 0, 0, 1, 2, 2. Ergebnis **2**. Die Funktion zählt die geraden Zahlen ab Position i bis zum Ende.

b) Linear rekursiv: ja, jede Ausführung macht höchstens einen rekursiven Aufruf. Endrekursiv: **nein**, weil im geraden Fall nach der Rückkehr des Aufrufs noch `1 + …` berechnet werden muss (nur der ungerade Fall reicht das Ergebnis unverändert weiter).
:::

:::exam title="Breitensuche oder Tiefensuche?" points=3
Ein Bahnnetz ist als Graph gespeichert (Bahnhöfe = Knoten, direkte Verbindungen = Kanten). Eine App soll für einen Startbahnhof herausfinden, wie viele **Halte** (Kanten) man mindestens braucht, um jeden anderen Bahnhof zu erreichen. Welche Suche passt besser? Begründe und nenne die Datenstruktur, die sie verwendet.
--- solution
Die **Breitensuche**: Sie besucht die Knoten in der Reihenfolge ihrer Entfernung (Zahl der Kanten) vom Start: zuerst alle Bahnhöfe einen Halt entfernt, dann alle Bahnhöfe zwei Halte entfernt und so weiter. Wird ein Knoten zum ersten Mal erreicht, dann mit der kleinsten Zahl von Schritten. Sie verwendet eine **Warteschlange** (FIFO). Eine Tiefensuche folgt einem Zweig so tief wie möglich und erreicht einen Bahnhof eventuell zuerst über einen langen Umweg.
:::
