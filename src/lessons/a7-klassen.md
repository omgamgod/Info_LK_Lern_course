---
id: a7
num: A7
part: A
title: Klassen und Objekte
short: Klassen & Objekte
lead: Alles in deinen Kursvorlagen ist eine Klasse, von PATIENT und WARTESCHLANGE bis KNOTEN und GraphMatrix. Diese Lektion verbindet die Klassendiagramme aus der Q11 mit Pythons Klassenschreibweise und erklärt self gründlich.
minutes: 60
uses: [a6]
goals:
  - ein Klassendiagramm und ein Objektdiagramm (UML) lesen
  - eine Klasse mit Konstruktor <code>__init__</code>, Attributen und Methoden schreiben
  - erklären, was <code>self</code> ist und wann man <code>self.</code> schreibt
  - mehrere Objekte erzeugen und ihre Methoden aufrufen
  - typische Klassenfehler finden (fehlendes self, fehlende Klammern, fehlendes return)
---

## [logic] Klassen und Objekte (kurze Wiederholung aus der Q11)

Eine **Klasse** ist ein Bauplan. Sie beschreibt, welche **Attribute** (Eigenschaften, Daten) und welche **Methoden** (Fähigkeiten, Verhalten) alle Objekte dieser Art haben. Ein **Objekt** (Instanz) ist ein konkretes Ding, das nach diesem Bauplan gebaut ist, mit eigenen Attributwerten.

In UML zeigt ein **Klassendiagramm** den Bauplan in drei Fächern: Name, Attribute, Methoden.

:::diagram classes caption="Klassendiagramm: die Klasse PATIENT"
class PATIENT @0,0 | name: ZEICHENKETTE | NameGeben(): ZEICHENKETTE; InformationAusgeben()
:::

Ein **Objektdiagramm** zeigt konkrete Objekte zu einem bestimmten Zeitpunkt. Im Kopf stehen das Objekt und seine Klasse, **unterstrichen**: `p1: PATIENT`. Darunter die Attribute mit ihren **aktuellen Werten**.

:::diagram objects caption="Objektdiagramm: zwei Objekte der Klasse PATIENT"
p1: PATIENT @0,0 | name = "Andi"
p2: PATIENT @1.2,0 | name = "Bert"
:::

Beide Objekte haben das Attribut `name`, aber jedes hat seinen eigenen Wert. `p1.NameGeben()` liefert `"Andi"`, `p2.NameGeben()` liefert `"Bert"`. Die Methode ist dieselbe, das Objekt, mit dem sie arbeitet, ist ein anderes.

### Konstruktor, Getter, Setter

- Der **Konstruktor** läuft automatisch, wenn ein neues Objekt erzeugt wird. Er setzt die Startwerte der Attribute.
- Ein **Getter** liest ein Attribut: Dein Kurs nennt sie `…Geben()` → `NameGeben()`, `NachfolgerGeben()`, `DatenelementGeben()`.
- Ein **Setter** ändert ein Attribut: `…Setzen(wert)` → `NachfolgerSetzen(nf)`, `FarbeSetzen(f)`.

## [bridge] Vom Klassendiagramm zu Python

:::bridge title="Die Klasse PATIENT" left="Klassendiagramm / Pseudocode" right="Python (deine Kursvorlage)"
klasse PATIENT                          || class Patient:
  // Attribut: name: ZEICHENKETTE          ||     """Beschreibung der Klasse Patient"""
  Konstruktor PATIENT(s)                ||     def __init__(self, s):
    name = s                            ||         self.name = s
  methode NameGeben(): ZEICHENKETTE     ||     def NameGeben(self):
    return name                         ||         return self.name
  methode InformationAusgeben()         ||     def InformationAusgeben(self):
    ausgeben name                       ||         print(self.name)
                                        ||
p1 = neu PATIENT("Andi")                || p1 = Patient("Andi")
ausgeben p1.NameGeben()                 || print(p1.NameGeben())
>> Der Konstruktor heißt immer `__init__` (je zwei Unterstriche auf jeder Seite). Jede Methode hat `self` als **ersten Parameter**, und jedes Attribut wird **innerhalb der Klasse als `self.`name** geschrieben. Für `neu` gibt es kein Python-Schlüsselwort: Wenn man die Klasse wie eine Funktion aufruft, entsteht ein neues Objekt.
:::

## [python] Was ist `self`?

Wenn du `p1.NameGeben()` aufrufst, ruft Python in Wirklichkeit `Patient.NameGeben(p1)` auf: Das Objekt vor dem Punkt wird als **erstes Argument** übergeben. In der Methode heißt dieses Argument `self`. **`self` ist also das Objekt, mit dem die Methode gerade arbeitet**.

- Bei `p1.NameGeben()` ist `self` gleich `p1` → `self.name` ist `"Andi"`.
- Bei `p2.NameGeben()` ist `self` gleich `p2` → `self.name` ist `"Bert"`.

Deshalb

1. wird jede Methode mit `self` als erstem Parameter definiert: `def NameGeben(self):`
2. greift man auf Attribute immer mit `self.` zu: `self.name`. Ein einfaches `name` wäre eine lokale Variable, die verschwindet, wenn die Methode endet.
3. ruft eine Methode eine andere Methode desselben Objekts mit `self.` auf: `self.InformationAusgeben()`

Wenn du eine Methode *aufrufst*, übergibst du `self` nicht selbst; Python nimmt das Objekt vor dem Punkt.

:::trace title="Zwei Objekte, eine Klasse"
class Patient:
    def __init__(self, s):
        self.name = s

    def NameGeben(self):
        return self.name


p1 = Patient("Andi")
p2 = Patient("Bert")
print(p1.NameGeben())
print(p2.NameGeben())
:::

Achte in der Schritt-für-Schritt-Ansicht auf die Rahmen: In `NameGeben` zeigt die Variable `self` beim ersten Aufruf auf `p1` und beim zweiten auf `p2`.

### Eine Klasse mit mehr Verhalten

```python
class Konto:
    """Ein Bankkonto"""

    def __init__(self, inhaber):
        self.inhaber = inhaber
        self.kontostand = 0          # jedes neue Konto beginnt bei 0

    def Einzahlen(self, betrag):
        self.kontostand = self.kontostand + betrag

    def KontostandGeben(self):
        return self.kontostand


k = Konto("Ada")
k.Einzahlen(50)
k.Einzahlen(20)
print(k.KontostandGeben())           # 70
```

Attribute behalten ihre Werte **zwischen Methodenaufrufen**: Dafür sind sie da. Eine lokale Variable in einer Methode ist weg, wenn die Methode endet.

### Objekte in einer Liste

Objekte lassen sich in Listen speichern, und man kann Methoden auf Listenelementen aufrufen:

```python
patienten = [Patient("Andi"), Patient("Bert"), Patient("Clara")]
for p in patienten:
    p.InformationAusgeben()
```

Das ist die **1:n-Beziehung mit einem Feld** (Lösung mit Feld) aus deinem Kurs: Ein Objekt (das Wartezimmer) verwaltet über ein Listenattribut viele Objekte (Patienten): `self.patientenfeld = []`.

:::warn title="Typische Klassenfehler (alle in deiner Fehlersuche-Aufgabe zum Bestellsystem)"
| Fehler | Meldung |
|---|---|
| `def GerichtEintragen(name, preis):` (kein `self`) | TypeError: …takes 2 positional arguments but 3 were given |
| `return artikel` statt `return self.artikel` | NameError: name 'artikel' is not defined |
| `self.karte = Speisekarte` (keine Klammern) | die *Klasse* wird gespeichert, kein neues Objekt; spätere Aufrufe scheitern |
| `self.summe += …`, obwohl `summe` eine lokale Variable ist | AttributeError: … has no attribute 'summe' |
| `def NameGeben(self)` ohne `:` | SyntaxError: expected ':' |
:::

:::quiz
```python
class Zaehler:
    def __init__(self):
        self.wert = 0
    def Erhoehen(self):
        self.wert = self.wert + 1

a = Zaehler()
b = Zaehler()
a.Erhoehen()
a.Erhoehen()
b.Erhoehen()
print(a.wert, b.wert)
```
Was wird ausgegeben?
- [ ] `3 3`
- [x] `2 1`
- [ ] `1 1`
- [ ] `2 0`
--- explain
`a` und `b` sind zwei getrennte Objekte mit getrennten Attributen. `a.wert` wurde zweimal erhöht, `b.wert` einmal.
:::

## [python] Python-Blöcke

:::exercise id=a7-patient title="Die Klasse Patient" level=1
Schreib die Klasse `Patient` aus dem Klassendiagramm oben:

- der Konstruktor `__init__(self, s)` speichert den Namen im Attribut `name`
- `NameGeben()` gibt den Namen zurück
- `InformationAusgeben()` gibt den Namen aus
--- starter
class Patient:
    """Beschreibung der Klasse Patient"""

    def __init__(self, s):
        pass
--- solution
class Patient:
    """Beschreibung der Klasse Patient"""

    def __init__(self, s):
        self.name = s

    def NameGeben(self):
        return self.name

    def InformationAusgeben(self):
        print(self.name)
--- tests
@test("Patient('Andi') hat das Attribut name = 'Andi'")
def _():
    p = Patient("Andi")
    eq(p.name, "Andi", "p.name")

@test("NameGeben gibt den Namen zurück")
def _():
    eq(Patient("Bert").NameGeben(), "Bert", "Patient('Bert').NameGeben()")

@test("InformationAusgeben gibt den Namen aus")
def _():
    eq(printed(lambda: Patient("Clara").InformationAusgeben()).strip(), "Clara", "ausgegebener Text")

@test("Zwei Objekte sind unabhängig")
def _():
    a, b = Patient("A"), Patient("B")
    eq((a.NameGeben(), b.NameGeben()), ("A", "B"), "Namen zweier Objekte")
--- hint
Jede Methode braucht `self` als ersten Parameter, und Attribute werden `self.name` geschrieben.
--- explain
Der Konstruktor speichert das Argument `s` im Attribut `self.name`. Danach kann jede Methode dieses Objekts es über `self` lesen.
:::

:::exercise id=a7-account title="Ein Bankkonto mit einer Regel" level=2
Schreib die Klasse `Konto`:

- `__init__(self, inhaber)`: speichert den Inhaber; der Kontostand `kontostand` beginnt bei 0
- `Einzahlen(betrag)`: erhöht den Kontostand
- `Abheben(betrag)`: verringert den Kontostand **nur, wenn genug Geld da ist**, und gibt `True` zurück; sonst ändert es nichts und gibt `False` zurück
- `KontostandGeben()`: gibt den Kontostand zurück
--- starter
class Konto:
    def __init__(self, inhaber):
        pass
--- solution
class Konto:
    def __init__(self, inhaber):
        self.inhaber = inhaber
        self.kontostand = 0

    def Einzahlen(self, betrag):
        self.kontostand = self.kontostand + betrag

    def Abheben(self, betrag):
        if betrag <= self.kontostand:
            self.kontostand = self.kontostand - betrag
            return True
        return False

    def KontostandGeben(self):
        return self.kontostand
--- tests
@test("Ein neues Konto hat den Kontostand 0")
def _():
    eq(Konto("Ada").KontostandGeben(), 0, "Kontostand eines neuen Kontos")

@test("Einzahlen 50 und 20 → 70")
def _():
    k = Konto("Ada")
    k.Einzahlen(50)
    k.Einzahlen(20)
    eq(k.KontostandGeben(), 70, "Kontostand")

@test("Abheben mit genug Geld gibt True zurück und verringert den Kontostand")
def _():
    k = Konto("Ada")
    k.Einzahlen(50)
    eq(k.Abheben(30), True, "k.Abheben(30)")
    eq(k.KontostandGeben(), 20, "Kontostand nach Abheben(30)")

@test("Abheben ohne genug Geld gibt False zurück und ändert nichts")
def _():
    k = Konto("Ada")
    k.Einzahlen(10)
    eq(k.Abheben(30), False, "k.Abheben(30)")
    eq(k.KontostandGeben(), 10, "Kontostand nach einem gescheiterten Abheben")

@test("Zwei Konten sind unabhängig")
def _():
    a, b = Konto("A"), Konto("B")
    a.Einzahlen(5)
    eq(b.KontostandGeben(), 0, "Kontostand des anderen Kontos")
--- hint
`Abheben` braucht ein `if`: Ist `betrag` höchstens `self.kontostand`?
--- explain
Die Regel steckt in der Klasse, so kann niemand aus Versehen zu viel abheben. Die Rückgabe `True`/`False` sagt dem Aufrufer, ob es geklappt hat.
:::

:::exercise id=a7-menu title="Eine Speisekarte: Objekte in einer Liste" level=2
Zwei Klassen arbeiten zusammen:

- `Gericht(name, preis)` mit `NameGeben()` und `PreisGeben()`
- `Speisekarte` mit dem Listenattribut `eintraege` (anfangs leer), `GerichtEintragen(name, preis)` (erzeugt ein `Gericht` und hängt es an) und `PreisGeben(name)`, das den Preis des Gerichts mit diesem Namen zurückgibt, oder `None`, wenn es kein solches Gericht gibt
--- starter
class Gericht:
    def __init__(self, name, preis):
        pass


class Speisekarte:
    def __init__(self):
        pass


karte = Speisekarte()
karte.GerichtEintragen("Semmelknödel", 17.0)
karte.GerichtEintragen("Apfelschorle", 4.5)
print(karte.PreisGeben("Apfelschorle"))
--- solution
class Gericht:
    def __init__(self, name, preis):
        self.name = name
        self.preis = preis

    def NameGeben(self):
        return self.name

    def PreisGeben(self):
        return self.preis


class Speisekarte:
    def __init__(self):
        self.eintraege = []

    def GerichtEintragen(self, name, preis):
        self.eintraege.append(Gericht(name, preis))

    def PreisGeben(self, name):
        for g in self.eintraege:
            if g.NameGeben() == name:
                return g.PreisGeben()
        return None


karte = Speisekarte()
karte.GerichtEintragen("Semmelknödel", 17.0)
karte.GerichtEintragen("Apfelschorle", 4.5)
print(karte.PreisGeben("Apfelschorle"))
--- tests
@test("Gericht speichert Name und Preis")
def _():
    g = Gericht("Suppe", 6.0)
    eq((g.NameGeben(), g.PreisGeben()), ("Suppe", 6.0), "(NameGeben(), PreisGeben())")

@test("Eine neue Speisekarte hat eine leere Liste eintraege")
def _():
    eq(Speisekarte().eintraege, [], "eintraege")

@test("GerichtEintragen hängt Gericht-Objekte an")
def _():
    k = Speisekarte()
    k.GerichtEintragen("A", 1.0)
    k.GerichtEintragen("B", 2.0)
    eq(len(k.eintraege), 2, "len(eintraege)")
    ok(isinstance(k.eintraege[0], Gericht), "Die Liste muss Gericht-Objekte enthalten.")

@test("PreisGeben findet den Preis")
def _():
    k = Speisekarte()
    k.GerichtEintragen("Semmelknödel", 17.0)
    k.GerichtEintragen("Apfelschorle", 4.5)
    eq(k.PreisGeben("Apfelschorle"), 4.5, "PreisGeben('Apfelschorle')")
    eq(k.PreisGeben("Semmelknödel"), 17.0, "PreisGeben('Semmelknödel')")

@test("PreisGeben gibt bei einem unbekannten Gericht None zurück")
def _():
    k = Speisekarte()
    k.GerichtEintragen("A", 1.0)
    eq(k.PreisGeben("Pizza"), None, "PreisGeben('Pizza')")

@test("Zwei Speisekarten teilen sich ihre Liste nicht")
def _():
    a, b = Speisekarte(), Speisekarte()
    a.GerichtEintragen("X", 1.0)
    eq(len(b.eintraege), 0, "Einträge der zweiten Speisekarte")
--- hint
`GerichtEintragen` erzeugt das Objekt mit `Gericht(name, preis)` und hängt es an `self.eintraege` an.
--- hint
`PreisGeben(name)` ist eine Suche: Durchlauf die Einträge; wenn ein Name passt, gib sofort seinen Preis mit `return` zurück. Nach der Schleife (nichts gefunden) `return None`.
--- explain
`return` in der Schleife beendet die Suche, sobald das Gericht gefunden ist. Das abschließende `return None` wird nur erreicht, wenn kein Eintrag gepasst hat. Dieses Suchmuster kommt bei `Suchen` für Listen (C3) wieder.
:::

:::exercise id=a7-debug title="Fehlersuche im Bestellsystem" level=3
Das ist eine gekürzte Fassung von `A03_Bestellsystem.py` aus deinem Kurs (12_I_0_Aufgabe_3). Sie enthält **vier** Fehler. Finde und behebe alle, sodass das Programm die richtige Rechnung ausgibt. Kümmere dich um eine Fehlermeldung nach der anderen.
--- starter
class Speisekarteneintrag:
    def __init__(self, nameNeu, preisNeu):
        self.name = nameNeu
        self.preis = preisNeu

    def NameGeben(self):
        return self.name

    def PreisGeben(self):
        return self.preis


class Speisekarte:
    def __init__(self):
        self.eintraege = []
        self.GerichtEintragen("Apfelschorle", 4.5)
        self.GerichtEintragen("Semmelknödel", 17.0)

    def GerichtEintragen(name, preis):
        self.eintraege.append(Speisekarteneintrag(name, preis))

    def EintragGeben(self, name):
        for e in self.eintraege:
            if e.NameGeben() == name:
                return e
        return None


class Posten:
    def __init__(self, artikelNeu, anzahlNeu):
        self.artikel = artikelNeu
        self.anzahl = anzahlNeu

    def ArtikelGeben(self):
        return artikel

    def AnzahlGeben(self):
        return self.anzahl


class Bestellsystem:
    def __init__(self):
        self.karte = Speisekarte
        self.posten = []

    def Bestellen(self, artikel, anzahl):
        self.posten.append(Posten(artikel, anzahl))

    def SummeGeben(self):
        summe = 0
        for p in self.posten:
            preis = self.karte.EintragGeben(p.ArtikelGeben()).PreisGeben()
            self.summe += preis * p.AnzahlGeben()
        return summe


b = Bestellsystem()
b.Bestellen("Semmelknödel", 2)
b.Bestellen("Apfelschorle", 3)
print("Gesamt:", b.SummeGeben())
--- solution
class Speisekarteneintrag:
    def __init__(self, nameNeu, preisNeu):
        self.name = nameNeu
        self.preis = preisNeu

    def NameGeben(self):
        return self.name

    def PreisGeben(self):
        return self.preis


class Speisekarte:
    def __init__(self):
        self.eintraege = []
        self.GerichtEintragen("Apfelschorle", 4.5)
        self.GerichtEintragen("Semmelknödel", 17.0)

    def GerichtEintragen(self, name, preis):
        self.eintraege.append(Speisekarteneintrag(name, preis))

    def EintragGeben(self, name):
        for e in self.eintraege:
            if e.NameGeben() == name:
                return e
        return None


class Posten:
    def __init__(self, artikelNeu, anzahlNeu):
        self.artikel = artikelNeu
        self.anzahl = anzahlNeu

    def ArtikelGeben(self):
        return self.artikel

    def AnzahlGeben(self):
        return self.anzahl


class Bestellsystem:
    def __init__(self):
        self.karte = Speisekarte()
        self.posten = []

    def Bestellen(self, artikel, anzahl):
        self.posten.append(Posten(artikel, anzahl))

    def SummeGeben(self):
        summe = 0
        for p in self.posten:
            preis = self.karte.EintragGeben(p.ArtikelGeben()).PreisGeben()
            summe += preis * p.AnzahlGeben()
        return summe


b = Bestellsystem()
b.Bestellen("Semmelknödel", 2)
b.Bestellen("Apfelschorle", 3)
print("Gesamt:", b.SummeGeben())
--- tests
@test("Das Programm läuft und gibt Gesamt: 47.5 aus")
def _():
    ok("Gesamt: 47.5" in OUTPUT, "Erwartet wurde die Zeile: Gesamt: 47.5")

@test("SummeGeben einer neuen Bestellung mit einem Artikel")
def _():
    b2 = Bestellsystem()
    b2.Bestellen("Apfelschorle", 2)
    eq(b2.SummeGeben(), 9.0, "SummeGeben()")

@test("Eine leere Bestellung kostet 0")
def _():
    eq(Bestellsystem().SummeGeben(), 0, "SummeGeben() einer leeren Bestellung")
--- hint
Die erste Fehlermeldung betrifft `GerichtEintragen`. Vergleiche seine Parameterliste mit den anderen Methoden.
--- hint
`self.karte = Speisekarte` speichert die Klasse selbst. Wie erzeugt man ein Objekt?
--- hint
In `SummeGeben` ist `summe` eine lokale Variable, kein Attribut.
--- explain
1. Bei `GerichtEintragen` fehlte `self`. 2. `ArtikelGeben` verwendete `artikel` statt `self.artikel`. 3. `Speisekarte` ohne Klammern ist die Klasse, kein Objekt. 4. `self.summe` gibt es nicht; gemeint ist die lokale Variable `summe`. Die Originaldatei in deinem Kurs enthält außerdem Syntaxfehler (ein fehlender `:` nach `class Bestellsystem`, ein fehlender `:` nach einer `def`-Zeile und eine falsche Einrückung), die Python meldet, bevor überhaupt etwas läuft.
:::

## [exam] Klausurtraining

::::exam title="Vom Text zum Klassendiagramm" points=4
*Eine Arztpraxis verwaltet ihre Patienten. Jeder Patient hat einen Namen und eine Versichertennummer. Die Praxis hat einen Namen und eine Liste von Patienten. Patienten können aufgenommen werden (Aufnehmen), und man kann die Anzahl der Patienten abfragen (AnzahlGeben).*

Zeichne ein Klassendiagramm mit beiden Klassen und ihrer Beziehung. Schreib dann den Python-Konstruktor der Praxis.
--- solution
:::diagram classes
class PRAXIS @0,0 | name: ZEICHENKETTE; patienten: PATIENT[ ] | Aufnehmen(p: PATIENT); AnzahlGeben(): GANZZAHL
class PATIENT @1.4,0 | name: ZEICHENKETTE; versichertennummer: ZEICHENKETTE | NameGeben(): ZEICHENKETTE
assoc PRAXIS -> PATIENT : verwaltet [*]
:::

```python
class Praxis:
    def __init__(self, name):
        self.name = name
        self.patienten = []      # 1:n-Beziehung über ein Feld (Liste)
```

Die Multiplizität `*` (beliebig viele) am Ende bei PATIENT sagt, dass eine Praxis viele Patienten verwaltet.
::::
