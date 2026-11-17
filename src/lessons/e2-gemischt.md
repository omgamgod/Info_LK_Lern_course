---
id: e2
num: E2
part: E
title: Gemischte Aufgaben
short: Gemischte Aufgaben
lead: Klausuraufgaben bleiben selten innerhalb einer Lektion. Diese Blöcke verbinden Themen, z. B. eine Breitensuche mit deiner eigenen Warteschlange, eine Wegzählung durch Rekursion mit Rückgabewerten, Rekursion auf einer Kompositum-Liste in einer Richtung, die du noch nicht geübt hast, eine Tiefensuche mit einem Stapel oder einen Baum, der seine Daten in eine Liste schreibt. Jeder Block nennt die Lektionen, auf die er zurückgreift.
minutes: 100
uses: [b1, b3, b4, c1, c2, c4, c5, d3]
goals:
  - Warteschlange, Graph und Rekursion in einem Programm verbinden
  - rekursive Methoden schreiben, die Rückgabewerte verknüpfen (Wege zählen)
  - entscheiden, an welcher Stelle einer rekursiven Methode die eigene Arbeit passiert (vor oder nach dem rekursiven Aufruf)
  - die Kompositum-Liste wiederverwenden, um andere Strukturen zu bauen
  - den Aufrufstapel einer Rekursion durch einen eigenen Stapel ersetzen
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

## [python] Stapel und Bäume

Diese Blöcke verbinden Kapitel III und II.5 mit den früheren Themen.

:::exercise id=e2-dfs-stapel title="Tiefensuche mit einem Stapel statt Rekursion (B3 + C5)" level=2
Der Computer verwaltet die Aufrufe einer rekursiven Tiefensuche auf seinem Aufrufstapel. Man kann diesen Stapel auch selbst verwalten. Implementiere `TiefensucheMitStapel(start)` ohne Rekursion:

1. Leg den Startknoten (seine Nummer) auf einen `Stapel`.
2. Solange der Stapel nicht leer ist: Nimm die oberste Nummer *k* herunter. Ist *k* schon besucht, mach weiter. Sonst markiere *k* als besucht, häng seinen Namen an das Ergebnis an und lege alle noch nicht besuchten Nachbarn auf den Stapel, und zwar **in absteigender Reihenfolge** (größte Nummer zuerst).

Gib die Liste der Knotennamen zurück. Sie soll dieselbe Reihenfolge haben wie die rekursive Tiefensuche aus B3 (gegeben zum Vergleich).
--- starter
class Abschluss:
    def DatenelementGeben(self):
        return None

    def NachfolgerGeben(self):
        return self


class Knoten:
    def __init__(self, dNeu, lNeu):
        self.daten = dNeu
        self.nachfolger = lNeu

    def DatenelementGeben(self):
        return self.daten

    def NachfolgerGeben(self):
        return self.nachfolger


class Stapel:
    def __init__(self):
        self.anfang = Abschluss()

    def VorneEinfuegen(self, dNeu):
        self.anfang = Knoten(dNeu, self.anfang)

    def AnfangEntfernen(self):
        d = self.anfang.DatenelementGeben()
        self.anfang = self.anfang.NachfolgerGeben()
        return d

    def IstLeer(self):
        return isinstance(self.anfang, Abschluss)


class GraphMatrix:
    def __init__(self, namen, kanten):
        self.knoten = list(namen)
        self.matrix = [[-1] * len(namen) for i in range(len(namen))]
        for a, b in kanten:
            i, j = self.knoten.index(a), self.knoten.index(b)
            self.matrix[i][j] = 1
            self.matrix[j][i] = 1

    def TiefensucheRekursiv(self, start):
        besucht = [False] * len(self.knoten)
        ergebnis = []

        def KnotenBesuchen(k):
            besucht[k] = True
            ergebnis.append(self.knoten[k])
            for i in range(len(self.knoten)):
                if self.matrix[k][i] != -1 and not besucht[i]:
                    KnotenBesuchen(i)

        KnotenBesuchen(self.knoten.index(start))
        return ergebnis

    def TiefensucheMitStapel(self, start):
        besucht = [False] * len(self.knoten)
        ergebnis = []
        stapel = Stapel()
        # dein Code
        return ergebnis


K7 = GraphMatrix(["K1", "K2", "K3", "K4", "K5", "K6", "K7"],
                 [("K1", "K2"), ("K1", "K7"), ("K1", "K6"), ("K2", "K3"), ("K7", "K3"), ("K6", "K5"), ("K3", "K4"), ("K5", "K4")])
print(K7.TiefensucheRekursiv("K1"))
print(K7.TiefensucheMitStapel("K1"))
--- solution
class Abschluss:
    def DatenelementGeben(self):
        return None

    def NachfolgerGeben(self):
        return self


class Knoten:
    def __init__(self, dNeu, lNeu):
        self.daten = dNeu
        self.nachfolger = lNeu

    def DatenelementGeben(self):
        return self.daten

    def NachfolgerGeben(self):
        return self.nachfolger


class Stapel:
    def __init__(self):
        self.anfang = Abschluss()

    def VorneEinfuegen(self, dNeu):
        self.anfang = Knoten(dNeu, self.anfang)

    def AnfangEntfernen(self):
        d = self.anfang.DatenelementGeben()
        self.anfang = self.anfang.NachfolgerGeben()
        return d

    def IstLeer(self):
        return isinstance(self.anfang, Abschluss)


class GraphMatrix:
    def __init__(self, namen, kanten):
        self.knoten = list(namen)
        self.matrix = [[-1] * len(namen) for i in range(len(namen))]
        for a, b in kanten:
            i, j = self.knoten.index(a), self.knoten.index(b)
            self.matrix[i][j] = 1
            self.matrix[j][i] = 1

    def TiefensucheRekursiv(self, start):
        besucht = [False] * len(self.knoten)
        ergebnis = []

        def KnotenBesuchen(k):
            besucht[k] = True
            ergebnis.append(self.knoten[k])
            for i in range(len(self.knoten)):
                if self.matrix[k][i] != -1 and not besucht[i]:
                    KnotenBesuchen(i)

        KnotenBesuchen(self.knoten.index(start))
        return ergebnis

    def TiefensucheMitStapel(self, start):
        besucht = [False] * len(self.knoten)
        ergebnis = []
        stapel = Stapel()
        stapel.VorneEinfuegen(self.knoten.index(start))
        while not stapel.IstLeer():
            k = stapel.AnfangEntfernen()
            if besucht[k]:
                continue
            besucht[k] = True
            ergebnis.append(self.knoten[k])
            for i in range(len(self.knoten) - 1, -1, -1):
                if self.matrix[k][i] != -1 and not besucht[i]:
                    stapel.VorneEinfuegen(i)
        return ergebnis


K7 = GraphMatrix(["K1", "K2", "K3", "K4", "K5", "K6", "K7"],
                 [("K1", "K2"), ("K1", "K7"), ("K1", "K6"), ("K2", "K3"), ("K7", "K3"), ("K6", "K5"), ("K3", "K4"), ("K5", "K4")])
print(K7.TiefensucheRekursiv("K1"))
print(K7.TiefensucheMitStapel("K1"))
--- tests
import ast, random

@test("K7 wie die rekursive Tiefensuche")
def _():
    K = GraphMatrix(["K1", "K2", "K3", "K4", "K5", "K6", "K7"],
                    [("K1", "K2"), ("K1", "K7"), ("K1", "K6"), ("K2", "K3"), ("K7", "K3"), ("K6", "K5"), ("K3", "K4"), ("K5", "K4")])
    for s in ["K1", "K4", "K7"]:
        eq(K.TiefensucheMitStapel(s), K.TiefensucheRekursiv(s), "TiefensucheMitStapel(%r)" % s)

@test("Zufällige Graphen")
def _():
    rnd = random.Random(7)
    for t in range(40):
        n = rnd.randint(1, 8)
        namen = ["N%d" % i for i in range(n)]
        kanten = [(namen[a], namen[b]) for a in range(n) for b in range(a + 1, n) if rnd.random() < 0.4]
        g = GraphMatrix(namen, kanten)
        s = rnd.choice(namen)
        eq(g.TiefensucheMitStapel(s), g.TiefensucheRekursiv(s), "Graph %d: Kanten %s, Start %s" % (t, kanten, s))

@test("Ohne Rekursion")
def _():
    for node in ast.walk(ast.parse(SOURCE)):
        if isinstance(node, ast.FunctionDef) and node.name == "TiefensucheMitStapel":
            calls = {n.func.attr for n in ast.walk(node) if isinstance(n, ast.Call) and isinstance(n.func, ast.Attribute)}
            ok("TiefensucheMitStapel" not in calls and "TiefensucheRekursiv" not in calls, "Verwende den Stapel, keinen rekursiven Aufruf")
            ok("VorneEinfuegen" in calls and "AnfangEntfernen" in calls, "Verwende den Stapel")
--- hint
Schleife: `while not stapel.IstLeer():`, darin `k = stapel.AnfangEntfernen()`. Ist `besucht[k]`, geht es mit `continue` zur nächsten Runde.
--- hint
Absteigend: `for i in range(len(self.knoten) - 1, -1, -1):`. Der kleinste Nachbar liegt dann oben und wird als Nächstes besucht, genau wie bei der rekursiven Version.
--- explain
Der eigene Stapel übernimmt die Rolle des Aufrufstapels: Was oben liegt, wird als Nächstes bearbeitet. Mit einer **Warteschlange** statt des Stapels (und Markieren beim Einreihen) wird daraus die Breitensuche. Stapel und Warteschlange machen genau den Unterschied zwischen Tiefen- und Breitensuche aus.
:::

:::exercise id=e2-baum-liste title="Vom Baum in die Liste (D3 + C4)" level=2
Ein Wörterbuch ist als Kompositum-Baum gespeichert, eine Vokabelliste als Kompositum-Liste (beide gegeben). Schreib `InListeSchreiben(liste)` in `BinBaum`, `Knoten` und `Abschluss`: Alle Einträge sollen **alphabetisch** mit `liste.HintenEinfuegen(...)` in die Liste kommen.
--- starter
from abc import ABC, abstractmethod


class Eintrag:
    def __init__(self, wort):
        self.wort = wort

    def SchluesselIstGleich(self, s):
        return self.wort == s

    def SchluesselIstGroesserAls(self, s):
        return self.wort > s

    def SchluesselAlsStringGeben(self):
        return self.wort


# ---------- Kompositum-Liste (C4) ----------
class LAbschluss:
    def HintenEinfuegen(self, d):
        return LKnoten(d, self)

    def WoerterGeben(self):
        return []


class LKnoten:
    def __init__(self, d, nf):
        self.daten = d
        self.nachfolger = nf

    def HintenEinfuegen(self, d):
        self.nachfolger = self.nachfolger.HintenEinfuegen(d)
        return self

    def WoerterGeben(self):
        return [self.daten.wort] + self.nachfolger.WoerterGeben()


class Liste:
    def __init__(self):
        self.anfang = LAbschluss()

    def HintenEinfuegen(self, d):
        self.anfang = self.anfang.HintenEinfuegen(d)

    def WoerterGeben(self):
        return self.anfang.WoerterGeben()


# ---------- Kompositum-Baum (D3) ----------
class Baumelement(ABC):
    @abstractmethod
    def Einfuegen(self, d):
        pass

    @abstractmethod
    def InListeSchreiben(self, liste):
        pass


class Abschluss(Baumelement):
    def Einfuegen(self, d):
        return Knoten(d, Abschluss(), Abschluss())

    def InListeSchreiben(self, liste):
        pass


class Knoten(Baumelement):
    def __init__(self, d, li, re):
        self.daten = d
        self.linkerNachfolger = li
        self.rechterNachfolger = re

    def Einfuegen(self, d):
        s = d.SchluesselAlsStringGeben()
        if self.daten.SchluesselIstGleich(s):
            return self
        if self.daten.SchluesselIstGroesserAls(s):
            self.linkerNachfolger = self.linkerNachfolger.Einfuegen(d)
        else:
            self.rechterNachfolger = self.rechterNachfolger.Einfuegen(d)
        return self

    def InListeSchreiben(self, liste):
        pass


class BinBaum:
    def __init__(self):
        self.wurzel = Abschluss()

    def Einfuegen(self, d):
        self.wurzel = self.wurzel.Einfuegen(d)

    def InListeSchreiben(self, liste):
        pass


baum = BinBaum()
for w in ["clip", "cat", "cup", "cut", "cube"]:
    baum.Einfuegen(Eintrag(w))
vokabeln = Liste()
baum.InListeSchreiben(vokabeln)
print(vokabeln.WoerterGeben())
--- solution
from abc import ABC, abstractmethod


class Eintrag:
    def __init__(self, wort):
        self.wort = wort

    def SchluesselIstGleich(self, s):
        return self.wort == s

    def SchluesselIstGroesserAls(self, s):
        return self.wort > s

    def SchluesselAlsStringGeben(self):
        return self.wort


# ---------- Kompositum-Liste (C4) ----------
class LAbschluss:
    def HintenEinfuegen(self, d):
        return LKnoten(d, self)

    def WoerterGeben(self):
        return []


class LKnoten:
    def __init__(self, d, nf):
        self.daten = d
        self.nachfolger = nf

    def HintenEinfuegen(self, d):
        self.nachfolger = self.nachfolger.HintenEinfuegen(d)
        return self

    def WoerterGeben(self):
        return [self.daten.wort] + self.nachfolger.WoerterGeben()


class Liste:
    def __init__(self):
        self.anfang = LAbschluss()

    def HintenEinfuegen(self, d):
        self.anfang = self.anfang.HintenEinfuegen(d)

    def WoerterGeben(self):
        return self.anfang.WoerterGeben()


# ---------- Kompositum-Baum (D3) ----------
class Baumelement(ABC):
    @abstractmethod
    def Einfuegen(self, d):
        pass

    @abstractmethod
    def InListeSchreiben(self, liste):
        pass


class Abschluss(Baumelement):
    def Einfuegen(self, d):
        return Knoten(d, Abschluss(), Abschluss())

    def InListeSchreiben(self, liste):
        pass


class Knoten(Baumelement):
    def __init__(self, d, li, re):
        self.daten = d
        self.linkerNachfolger = li
        self.rechterNachfolger = re

    def Einfuegen(self, d):
        s = d.SchluesselAlsStringGeben()
        if self.daten.SchluesselIstGleich(s):
            return self
        if self.daten.SchluesselIstGroesserAls(s):
            self.linkerNachfolger = self.linkerNachfolger.Einfuegen(d)
        else:
            self.rechterNachfolger = self.rechterNachfolger.Einfuegen(d)
        return self

    def InListeSchreiben(self, liste):
        self.linkerNachfolger.InListeSchreiben(liste)
        liste.HintenEinfuegen(self.daten)
        self.rechterNachfolger.InListeSchreiben(liste)


class BinBaum:
    def __init__(self):
        self.wurzel = Abschluss()

    def Einfuegen(self, d):
        self.wurzel = self.wurzel.Einfuegen(d)

    def InListeSchreiben(self, liste):
        self.wurzel.InListeSchreiben(liste)


baum = BinBaum()
for w in ["clip", "cat", "cup", "cut", "cube"]:
    baum.Einfuegen(Eintrag(w))
vokabeln = Liste()
baum.InListeSchreiben(vokabeln)
print(vokabeln.WoerterGeben())
--- tests
def baue(*worte):
    b = BinBaum()
    for w in worte:
        b.Einfuegen(Eintrag(w))
    return b

@test("Alphabetisch in die Liste")
def _():
    l = Liste()
    baue("clip", "cat", "cup", "cut", "cube", "cave", "crab").InListeSchreiben(l)
    eq(l.WoerterGeben(), ["cat", "cave", "clip", "crab", "cube", "cup", "cut"], "Wörter in der Liste")

@test("Leerer Baum, volle Liste")
def _():
    l = Liste()
    l.HintenEinfuegen(Eintrag("aaa"))
    BinBaum().InListeSchreiben(l)
    eq(l.WoerterGeben(), ["aaa"], "ein leerer Baum fügt nichts hinzu")
    baue("zz", "bb").InListeSchreiben(l)
    eq(l.WoerterGeben(), ["aaa", "bb", "zz"], "die Einträge kommen hinten dazu")

@test("Dieselben Objekte, keine Kopien")
def _():
    b = BinBaum()
    e = Eintrag("solo")
    b.Einfuegen(e)
    l = Liste()
    b.InListeSchreiben(l)
    ok(l.anfang.daten is e, "die Liste soll das Eintrag-Objekt aus dem Baum enthalten")
--- hint
Das ist ein Inorder-Durchlauf (D2): links, eigene Daten mit `liste.HintenEinfuegen(self.daten)`, rechts. Der Abschluss tut nichts.
--- explain
Baum und Liste teilen sich die Datenelemente: Die Trennung von Struktur und Daten (C2) erlaubt, dieselben Objekte in zwei verschiedenen Strukturen zu verwalten. Inorder plus HintenEinfügen ergibt eine sortierte Liste.
:::

:::exercise id=e2-aufrufstapel title="Rekursion von Hand: Fakultät mit einem Stapel (B1 + C5)" level=1
Berechne `n!` **ohne Rekursion** so, wie der Computer es mit dem Aufrufstapel tut: Leg zuerst n, n − 1, …, 1 auf einen Stapel (der Abstieg), dann nimm alle Zahlen wieder herunter und multipliziere sie (der Aufstieg). `FakultaetMitStapel(0)` ist 1.
--- starter
class Abschluss:
    def DatenelementGeben(self):
        return None

    def NachfolgerGeben(self):
        return self


class Knoten:
    def __init__(self, dNeu, lNeu):
        self.daten = dNeu
        self.nachfolger = lNeu

    def DatenelementGeben(self):
        return self.daten

    def NachfolgerGeben(self):
        return self.nachfolger


class Stapel:
    def __init__(self):
        self.anfang = Abschluss()

    def VorneEinfuegen(self, dNeu):
        self.anfang = Knoten(dNeu, self.anfang)

    def AnfangEntfernen(self):
        d = self.anfang.DatenelementGeben()
        self.anfang = self.anfang.NachfolgerGeben()
        return d

    def IstLeer(self):
        return isinstance(self.anfang, Abschluss)


def FakultaetMitStapel(n):
    pass


print(FakultaetMitStapel(5))
--- solution
class Abschluss:
    def DatenelementGeben(self):
        return None

    def NachfolgerGeben(self):
        return self


class Knoten:
    def __init__(self, dNeu, lNeu):
        self.daten = dNeu
        self.nachfolger = lNeu

    def DatenelementGeben(self):
        return self.daten

    def NachfolgerGeben(self):
        return self.nachfolger


class Stapel:
    def __init__(self):
        self.anfang = Abschluss()

    def VorneEinfuegen(self, dNeu):
        self.anfang = Knoten(dNeu, self.anfang)

    def AnfangEntfernen(self):
        d = self.anfang.DatenelementGeben()
        self.anfang = self.anfang.NachfolgerGeben()
        return d

    def IstLeer(self):
        return isinstance(self.anfang, Abschluss)


def FakultaetMitStapel(n):
    s = Stapel()
    while n > 0:
        s.VorneEinfuegen(n)
        n = n - 1
    ergebnis = 1
    while not s.IstLeer():
        ergebnis = ergebnis * s.AnfangEntfernen()
    return ergebnis


print(FakultaetMitStapel(5))
--- tests
import ast

@test("Werte")
def _():
    for n, f in [(0, 1), (1, 1), (3, 6), (5, 120), (10, 3628800)]:
        eq(FakultaetMitStapel(n), f, "FakultaetMitStapel(%d)" % n)

@test("Mit Stapel, ohne Rekursion")
def _():
    for node in ast.parse(SOURCE).body:
        if isinstance(node, ast.FunctionDef) and node.name == "FakultaetMitStapel":
            calls = {(n.func.attr if isinstance(n.func, ast.Attribute) else getattr(n.func, "id", "")) for n in ast.walk(node) if isinstance(n, ast.Call)}
            ok("FakultaetMitStapel" not in calls, "ohne rekursiven Aufruf")
            ok("VorneEinfuegen" in calls and "AnfangEntfernen" in calls, "lege die Zahlen auf den Stapel und nimm sie wieder herunter")
--- hint
Erste Schleife: solange `n > 0`, `n` ablegen und um 1 verringern. Zweite Schleife: solange der Stapel nicht leer ist, herunternehmen und multiplizieren. Starte mit `ergebnis = 1` (das Rekursionsende).
--- explain
Die erste Schleife entspricht dem Abstieg (jeder Aufruf `Fakultät(k)` legt seinen Parameter k ab), die zweite dem Aufstieg (jeder Aufruf multipliziert mit seinem k, sobald das Ergebnis von unten kommt). Der Startwert 1 ist das Rekursionsende `Fakultät(0) = 1`.
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

:::exam title="Welche Struktur passt?" points=4
Gib jeweils an, ob ein **Stapel**, eine **Warteschlange** oder ein **geordneter Binärbaum** am besten passt, und begründe in einem Satz.

a) Ein Texteditor soll die letzten Änderungen der Reihe nach rückgängig machen können.

b) Ein Drucker im Netz bekommt Aufträge von mehreren Rechnern.

c) Eine Bibliothek will zu einer Signatur schnell das Buch finden; es kommen laufend neue Bücher dazu.

d) Ein Programm prüft, ob in einem Term jede Klammer `(` zu einer passenden `)` geschlossen wird.
--- solution
a) **Stapel**: Die zuletzt gemachte Änderung wird als erste zurückgenommen (LIFO).

b) **Warteschlange**: Wer zuerst druckt, kommt zuerst dran (FIFO), niemand wird übergangen.

c) **Geordneter Binärbaum**: Suchen und Einfügen brauchen bei einem ausgeglichenen Baum nur so viele Vergleiche, wie der Baum Ebenen hat (rund log₂ n statt n wie in einer Liste).

d) **Stapel**: Jede `(` wird abgelegt, jede `)` nimmt die oberste herunter. Ist der Stapel dabei leer oder am Ende nicht leer, passen die Klammern nicht.
:::

::::exam title="Preorder mit einem Stapel" points=4
Ein Baum soll ohne Rekursion in **Preorder** durchlaufen werden. Dazu wird die Wurzel auf einen Stapel gelegt. Solange der Stapel nicht leer ist, wird das oberste Element heruntergenommen und ausgegeben; danach werden erst sein **rechter**, dann sein **linker** Nachfolger abgelegt (sofern vorhanden).
:::diagram bintree
8(3(1,6),10(,14))
:::
a) Gib nach jedem Herunternehmen die Ausgabe und den Inhalt des Stapels an (oberstes Element links).

b) Warum wird zuerst der rechte Nachfolger abgelegt?
--- solution
a)

| heruntergenommen / Ausgabe | Stapel danach |
|---|---|
| 8 | 3, 10 |
| 3 | 1, 6, 10 |
| 1 | 6, 10 |
| 6 | 10 |
| 10 | 14 |
| 14 | (leer) |

Ausgabe: **8, 3, 1, 6, 10, 14**, genau die Preorder.

b) Der Stapel gibt das zuletzt abgelegte Element zuerst heraus. Damit der **linke** Teilbaum vor dem rechten bearbeitet wird (wie bei der rekursiven Preorder), muss der linke Nachfolger **oben** liegen, also als Letzter abgelegt werden.
::::

::::exam title="Sortierte Daten ausgeglichen einfügen" points=5
Die Zahlen 1 bis 7 liegen sortiert vor und sollen in einen leeren geordneten Binärbaum eingefügt werden.

a) Zeichne den Baum, wenn sie in der Reihenfolge 1, 2, …, 7 eingefügt werden. Wie viele Ebenen hat er?

b) Die Methode `MitteEinfuegen(zahlen, von, bis)` fügt zuerst das mittlere Element des Bereichs ein und ruft sich dann für die linke und die rechte Hälfte auf. Gib die Methode in Python oder Pseudocode an (`baum.Einfuegen(x)` ist vorhanden) und nenne das Rekursionsende.

c) In welcher Reihenfolge fügt `MitteEinfuegen([1, …, 7], 0, 6)` die Zahlen ein? Zeichne den entstehenden Baum.
--- solution
a) Jede Zahl wird rechter Nachfolger der vorigen: Der Baum **entartet** zu einer Liste mit **7 Ebenen**.
:::diagram bintree
1(,2(,3(,4(,5(,6(,7))))))
:::
b)
```python
def MitteEinfuegen(zahlen, von, bis):
    if von > bis:                 # Rekursionsende: leerer Bereich
        return
    m = (von + bis) // 2
    baum.Einfuegen(zahlen[m])
    MitteEinfuegen(zahlen, von, m - 1)
    MitteEinfuegen(zahlen, m + 1, bis)
```
Rekursionsende: Der Bereich ist leer (`von > bis`), dann wird nichts eingefügt.

c) Reihenfolge **4, 2, 1, 3, 6, 5, 7** (das ist die Preorder des Ergebnisses). Der Baum ist vollständig mit **3 Ebenen**:
:::diagram bintree
4(2(1,3),6(5,7))
:::
::::
