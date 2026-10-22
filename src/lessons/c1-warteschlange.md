---
id: c1
num: C1
part: C
title: Die Warteschlange
short: Warteschlange
lead: Ein Wartezimmer, ein Drucker, die Breitensuche brauchen alle eine Struktur, in der bedient wird, wer zuerst kommt. Diese Lektion baut die Warteschlange zweimal, mit einem Feld und ohne Feld als Kette von Objekten, und untersucht die Sonderfälle, in denen die meisten Fehler passieren.
minutes: 90
uses: [a8, a6, b3]
goals:
  - das FIFO-Prinzip erklären und Anwendungen der Warteschlange nennen
  - Einfügen und Entfernen mit einem Feld und als Kette von Objekten mit <code>anfang</code>, <code>ende</code> und <code>nachfolger</code> implementieren
  - Objektdiagramme vor und nach jeder Operation zeichnen, einschließlich der Sonderfälle (leere Warteschlange, letztes Element)
  - die Fehler verkürzter Implementierungen finden (Aufgabe 1) und zwischen Feld und Warteschlange entscheiden (Aufgabe 4)
---

## [logic] Wer zuerst kommt, geht zuerst

Im Wartezimmer von Dr. Ted Tanus (12_II_1_Einstieg) werden die Patienten in der Reihenfolge aufgerufen, in der sie angekommen sind. Neue Patienten stellen sich **hinten** an, und der Patient **vorne** wird als Nächstes aufgerufen. Eine Struktur, die so funktioniert, heißt **Warteschlange**. Ihre Regel: **First in, first out** (FIFO).

Eine Warteschlange bietet zwei Hauptoperationen (und meist ein paar Hilfsmethoden):

| Operation | Wirkung |
|---|---|
| **Einfügen**(element) | hängt das Element **hinten** an |
| **Entfernen**() → element | entfernt das **erste** Element und gibt es zurück (nichts, wenn die Warteschlange leer ist) |
| ErstesGeben() | gibt das erste Element zurück, ohne es zu entfernen |
| IstLeer() | sagt, ob die Warteschlange leer ist |

Anwendungen (Aufgabe 3): Druckaufträge, die auf den Drucker warten, Kunden an der Kasse, Autos in der Waschstraße, Anrufe in einer Hotline, Tastendrücke, die verarbeitet werden müssen, Nachrichten zwischen Programmen und die **Breitensuche** aus Lektion B3. Das umgekehrte Prinzip, **last in, first out** (LIFO), gehört zu einem **Stapel** (Stack), wie dem Aufrufstapel.

## [logic] Lösung 1: mit einem Feld

Die naheliegende Lösung (`A00_mit_Feld.py`) speichert die Patienten in einer Liste: `Einfügen` hängt hinten an, `Entfernen` nimmt Element 0.

```python
class Warteschlange:
    def __init__(self):
        self.patientenfeld = []

    def Einfügen(self, patient_neu):
        self.patientenfeld.append(patient_neu)

    def Entfernen(self):
        if self.patientenfeld:
            return self.patientenfeld.pop(0)
        else:
            return None
```

Das funktioniert, aber in den meisten Programmiersprachen hat ein Feld eine **feste Größe**, die man vorher wählen muss: zu klein, und Patienten werden abgewiesen; zu groß, und Speicher wird verschwendet. Und das erste Element zu entfernen heißt, **alle anderen eine Position nach vorne zu schieben**. Pythons Listen verstecken beide Probleme (sie wachsen automatisch, und `pop(0)` erledigt das Verschieben), aber die Arbeit wird trotzdem gemacht.

## [logic] Lösung 2: ohne Feld, als Kette von Objekten

Die „Lösung ohne Feld“ verwendet die Idee aus Lektion A8: **Jeder Patient kennt den Patienten nach ihm** (`nachfolger`). Die Warteschlange muss nur den **ersten** Patienten kennen (`anfang`) und, um schnell anzuhängen, den **letzten** (`ende`). Die 1:n-Beziehung zwischen Wartezimmer und Patienten wird jetzt durch Referenzen statt durch ein Feld umgesetzt.

:::diagram classes caption="Klassendiagramm der Lösung ohne Feld"
class WARTESCHLANGE @0,0 | anfang: PATIENT; ende: PATIENT | Einfügen(p: PATIENT); Entfernen(): PATIENT
class PATIENT @1.5,0 | name: ZEICHENKETTE; nachfolger: PATIENT | NachfolgerSetzen(nf: PATIENT); NachfolgerGeben(): PATIENT; NameGeben(): ZEICHENKETTE
assoc WARTESCHLANGE -> PATIENT : anfang, ende [0..1]
assoc PATIENT -> PATIENT : nachfolger [0..1]
:::

:::diagram objects caption="Objektdiagramm: eine Warteschlange mit drei Patienten"
w: WARTESCHLANGE @0,0 | anfang -> p1 | ende -> p3
p1: PATIENT @1,0.9 | name = "Andi" | nachfolger -> p2
p2: PATIENT @2.1,0.9 | name = "Bert" | nachfolger -> p3
p3: PATIENT @3.2,0.9 | name = "Clara" | nachfolger = None
:::

Eine leere Warteschlange hat `anfang = None` und `ende = None`. Bei einer Warteschlange mit **einem** Patienten zeigen `anfang` und `ende` auf **dasselbe** Objekt.

### Einfügen am Ende

Dank `ende` muss niemand die Warteschlange durchlaufen. Zwei Fälle:

- **Warteschlange leer** (`anfang is None`): Der neue Patient ist der erste und der letzte → `anfang = neu`, `ende = neu`.
- **Sonst**: Der bisher letzte Patient bekommt den neuen als Nachfolger → `ende.NachfolgerSetzen(neu)`, dann `ende = neu`.

::::cols
:::diagram objects caption="vor Einfügen(Dora)"
w: WARTESCHLANGE @0,0 | anfang -> p1 | ende -> p2
p1: PATIENT @1,0.95 | name = "Andi" | nachfolger -> p2
p2: PATIENT @2.1,0.95 | name = "Bert" | nachfolger = None
:::
--- col
:::diagram objects caption="nach Einfügen(Dora): blau = geänderte Referenz"
w: WARTESCHLANGE @0,0 | anfang -> p1 | ende => p3
p1: PATIENT @1,0.95 | name = "Andi" | nachfolger -> p2
p2: PATIENT @2.1,0.95 | name = "Bert" | nachfolger => p3
p3: PATIENT @3.2,0.95 | name = "Dora" | nachfolger = None
:::
::::

### Entfernen am Anfang

- **Warteschlange leer**: nichts zurückgeben (`None`).
- **Sonst**: den ersten Patienten merken (`p = anfang`), `anfang` auf seinen Nachfolger setzen (`anfang = anfang.NachfolgerGeben()`), `p` zurückgeben.
- **Sonderfall: Das war der letzte Patient.** Jetzt ist `anfang` gleich `None`, aber `ende` zeigt noch auf den entfernten Patienten. Also muss auch `ende` auf `None` gesetzt werden.

::::cols
:::diagram objects caption="vor Entfernen() mit einem Patienten"
w: WARTESCHLANGE @0,0 | anfang -> p1 | ende -> p1
p1: PATIENT @1.2,0.9 | name = "Andi" | nachfolger = None
:::
--- col
:::diagram objects caption="nach Entfernen(): beide Referenzen sind None"
w: WARTESCHLANGE @0,0 | anfang = None | ende = None
var p -> p1 @0,1.2
p1: PATIENT @1.2,0.9 | name = "Andi" | nachfolger = None
:::
::::

Probier jeden Fall selbst aus. Wähle eine Operation und geh sie Schritt für Schritt durch. Der Code rechts zeigt, welche Zeile gerade läuft:

:::viz listops
{"mode": "queue", "init": ["Andi", "Bert"]}
:::

:::key title="Prüf immer die Sonderfälle"
Geh bei jeder Methode einer verketteten Struktur drei Situationen durch: **leer**, **genau ein Element**, **mehrere Elemente**. Die meisten Fehler in Kapitel II stecken in den ersten beiden.
:::

## [logic] Was in verkürzten Versionen schiefgeht (12_II_1_Aufgabe_1)

Julia und Gianna haben kürzere Methoden geschrieben:

```pseudo
// Einfügen(patientNeu), kurze Version
ende.NachfolgerSetzen(patientNeu)
ende = patientNeu

// Entfernen() -> PATIENT, kurze Version
p = anfang
anfang = anfang.NachfolgerGeben()
return p
```

Beide funktionieren, solange die Warteschlange mehrere Patienten hat. Aber:

**Einfügen in eine leere Warteschlange**: `ende` ist `None`, und `None.NachfolgerSetzen(…)` ist unmöglich → in Python *AttributeError: 'NoneType' object has no attribute 'NachfolgerSetzen'*. Selbst wenn es nicht abstürzen würde, würde `anfang` nie gesetzt.

**Entfernen aus einer leeren Warteschlange**: `anfang.NachfolgerGeben()` auf `None` → AttributeError.

**Entfernen des letzten Patienten**: `anfang` wird `None`, aber `ende` zeigt weiter auf den entfernten Patienten:

:::diagram objects caption="Kurzes Entfernen mit einem Patienten: ende zeigt noch auf den entfernten Patienten"
w: WARTESCHLANGE @0,0 | anfang = None | ende -> p1
p1: PATIENT @1.3,0.6 | name = "Andi" | nachfolger = None
note @0,1.25 ende wurde nicht zurückgesetzt!
:::

Das nächste `Einfügen` hängt den neuen Patienten dann an den entfernten Andi, und `anfang` bleibt `None`: Der neue Patient ist für das Wartezimmer verloren. Die längeren Versionen sind richtig, weil sie genau diese Sonderfälle getrennt behandeln.

:::quiz
Eine Warteschlange enthält nur Andi. Mit Giannas **kurzem** Entfernen wird Andi entfernt. Dann wird Bert mit Julias **kurzem** Einfügen eingefügt. Was kommt heraus?
- [ ] anfang → Bert und ende → Bert: alles in Ordnung
- [x] Bert wird Andis nachfolger, ende → Bert, aber anfang bleibt None: Bert ist für die Warteschlange verloren
- [ ] ein AttributeError, weil ende None ist
- [ ] anfang → Andi, weil Andi noch in der Warteschlange ist
--- explain
Nach dem kurzen Entfernen ist `anfang` gleich `None`, aber `ende` zeigt noch auf Andi. Das kurze Einfügen führt dann `ende.NachfolgerSetzen(Bert)` aus (kein Fehler, da `ende` nicht `None` ist) und setzt `ende` auf Bert. `anfang` wird nie angefasst, die Warteschlange sieht also leer aus, obwohl Bert darin ist. Fehler in Sonderfällen zeigen sich oft erst in bestimmten Kombinationen, deshalb müssen die Prüfungen alle abdecken.
:::

## [logic] Feld oder Warteschlange? (12_II_1_Aufgabe_4)

| | Feld | Warteschlange (Kette von Objekten) |
|---|---|---|
| Größe | im Voraus festgelegt (in den meisten Sprachen) | wächst und schrumpft mit jedem Element |
| Speicher | eventuell verschwendet / zu klein | genau so viel wie nötig (plus eine Referenz pro Element) |
| Zugriff auf Element k | direkt: `feld[k]` | nur durch Durchlaufen ab `anfang` |
| vorne entfernen | alles rückt nach (oder zusätzliche Buchführung) | eine Referenz ändern |
| hinten einfügen | gut, wenn Platz ist | zwei Referenzen ändern (mit `ende`) |
| passt, wenn … | die Anzahl bekannt ist und Positionen wichtig sind | Elemente in FIFO-Reihenfolge kommen und gehen, Anzahl unbekannt |

Entscheidungen für b–e:

- **b) Startreihenfolge eines Ski-Weltcuprennens**: Die Startliste steht vor dem Rennen fest und hat eine bekannte Länge, und die Starter werden über ihre Startnummer angesprochen → **Feld**. (Betrachtet man das Rennen als „die Starter verlassen die Liste nacheinander“, passt auch eine Warteschlange; begründe deine Wahl.)
- **c) Erfassen der Ergebnisse eines Ski-Weltcuprennens**: Jedes Ergebnis muss nach der Zeit in die Rangliste **einsortiert**, also in der Mitte eingefügt werden → **weder** eine Warteschlange (FIFO) noch ein einfaches Feld passt gut; das braucht eine sortierte Liste (Lektion C3) oder ein Feld, das neu sortiert wird.
- **d) Ergebnisse eines Marathons**: Die Läufer kommen in der Reihenfolge der Rangliste ins Ziel, ihre Zahl ist vorher nicht bekannt und kann riesig sein → eine Struktur, die hinten wächst, eine **Warteschlange** (Einfügen am Ende).
- **e) K.-o.-Turnier**: Die beiden Spieler vorne spielen, und der Sieger stellt sich **hinten** an, um in der nächsten Runde zu spielen → klassische **Warteschlange**.

## [bridge] Vom Pseudocode zu Python

:::bridge title="Einfügen und Entfernen (A00_ohne_Feld.py, A02_Arzt.py)"
methode Einfügen(patientNeu)              || def Einfügen(self, patient_neu):
    falls anfang == nichts dann           ||     if self.anfang is None:
        anfang = patientNeu               ||         self.anfang = patient_neu
    sonst                                 ||     else:
        ende.NachfolgerSetzen(patientNeu) ||         self.ende.NachfolgerSetzen(patient_neu)
    endefalls                             ||
    ende = patientNeu                     ||     self.ende = patient_neu
endemethode                               ||
                                          ||
methode Entfernen() -> PATIENT            || def Entfernen(self):
    p = anfang                            ||     p = self.anfang
    falls anfang ≠ nichts dann            ||     if self.anfang is not None:
        falls anfang == ende dann         ||         if self.anfang == self.ende:
            anfang = nichts               ||             self.anfang = None
            ende = nichts                 ||             self.ende = None
        sonst                             ||         else:
            anfang = anfang.NachfolgerGeben() ||             self.anfang = self.anfang.NachfolgerGeben()
        endefalls                         ||
    endefalls                             ||
    return p                              ||     return p
>> Das ist die Version deiner Lehrkraft aus `A02_Arzt.py`. `anfang == ende` erkennt „genau ein Patient“. Eine gleichwertige Version setzt zuerst `anfang` weiter und prüft dann `if self.anfang is None: self.ende = None`.
:::

## [python] Die Warteschlange durchlaufen

Die Patienten zählen oder alle Namen ausgeben heißt, die Kette entlangzulaufen, wie in A8:

```python
def LaengeGeben(self):
    anzahl = 0
    p = self.anfang            # eine LOKALE Hilfsvariable läuft …
    while p is not None:
        anzahl = anzahl + 1
        p = p.NachfolgerGeben()
    return anzahl              # … anfang selbst bewegt sich nie
```

:::warn title="Typischer Fehler: mit anfang durchlaufen"
```python
while self.anfang != None:
    i += 1
    self.anfang = self.anfang.NachfolgerGeben()   # zerstört die Warteschlange!
```
Wenn du `self.anfang` selbst weiterbewegst, verlierst du jeden Patienten, an dem du vorbeigekommen bist: Nach der Schleife ist die Warteschlange leer (oder, wenn `anfang` danach wiederhergestellt wird, hinterlässt ein Absturz zwischendurch sie kaputt). Lauf immer mit einer lokalen Hilfsvariablen.
:::

:::trace title="Eine Warteschlange ohne Feld: Einfügen und Entfernen Schritt für Schritt"
class Patient:
    def __init__(self, s):
        self.name = s
        self.nachfolger = None

    def NachfolgerSetzen(self, nf):
        self.nachfolger = nf

    def NachfolgerGeben(self):
        return self.nachfolger


class Warteschlange:
    def __init__(self):
        self.anfang = None
        self.ende = None

    def Einfügen(self, patient_neu):
        if self.anfang is None:
            self.anfang = patient_neu
        else:
            self.ende.NachfolgerSetzen(patient_neu)
        self.ende = patient_neu

    def Entfernen(self):
        p = self.anfang
        if self.anfang is not None:
            self.anfang = self.anfang.NachfolgerGeben()
            if self.anfang is None:
                self.ende = None
        return p


w = Warteschlange()
w.Einfügen(Patient("Andi"))
w.Einfügen(Patient("Bert"))
print(w.Entfernen().name)
:::

## [python] Python-Blöcke

:::exercise id=c1-field title="Warteschlange mit einem Feld" level=1
Implementiere die „Lösung mit Feld“ mit dem Attribut `patientenfeld`:

- `Einfügen(patient_neu)`, `Entfernen()` (gibt den ersten Patienten zurück oder `None`, wenn leer)
- `LaengeGeben()` und `IstLeer()`
--- starter
class Patient:
    def __init__(self, s):
        self.name = s


class Warteschlange:
    def __init__(self):
        self.patientenfeld = []

    def Einfügen(self, patient_neu):
        pass

    def Entfernen(self):
        pass

    def LaengeGeben(self):
        pass

    def IstLeer(self):
        pass
--- solution
class Patient:
    def __init__(self, s):
        self.name = s


class Warteschlange:
    def __init__(self):
        self.patientenfeld = []

    def Einfügen(self, patient_neu):
        self.patientenfeld.append(patient_neu)

    def Entfernen(self):
        if len(self.patientenfeld) > 0:
            return self.patientenfeld.pop(0)
        return None

    def LaengeGeben(self):
        return len(self.patientenfeld)

    def IstLeer(self):
        return len(self.patientenfeld) == 0
--- tests
@test("FIFO: wer zuerst kommt, geht zuerst")
def _():
    w = Warteschlange()
    for n in ["Andi", "Bert", "Clara"]:
        w.Einfügen(Patient(n))
    eq([w.Entfernen().name for i in range(3)], ["Andi", "Bert", "Clara"], "Reihenfolge des Entfernens")

@test("Entfernen aus einer leeren Warteschlange gibt None zurück")
def _():
    eq(Warteschlange().Entfernen(), None, "Entfernen() einer leeren Warteschlange")

@test("LaengeGeben und IstLeer")
def _():
    w = Warteschlange()
    eq((w.LaengeGeben(), w.IstLeer()), (0, True), "leere Warteschlange")
    w.Einfügen(Patient("A"))
    w.Einfügen(Patient("B"))
    eq((w.LaengeGeben(), w.IstLeer()), (2, False), "nach zweimal Einfügen")
--- hint
`append` hängt hinten an, `pop(0)` entfernt das erste Element und gibt es zurück.
--- explain
Mit einer Python-Liste ist die Warteschlange fast trivial. Der interessante Teil, die Arbeit hinter `pop(0)`, steckt versteckt in Python.
:::

:::exercise id=c1-insert title="Einfügen ohne Feld" level=1
Implementiere `Einfügen(patient_neu)` der Lösung ohne Feld. Behandle beide Fälle: leere und nicht leere Warteschlange.
--- starter
class Patient:
    def __init__(self, s):
        self.name = s
        self.nachfolger = None

    def NachfolgerSetzen(self, nf):
        self.nachfolger = nf

    def NachfolgerGeben(self):
        return self.nachfolger


class Warteschlange:
    def __init__(self):
        self.anfang = None
        self.ende = None

    def Einfügen(self, patient_neu):
        pass
--- solution
class Patient:
    def __init__(self, s):
        self.name = s
        self.nachfolger = None

    def NachfolgerSetzen(self, nf):
        self.nachfolger = nf

    def NachfolgerGeben(self):
        return self.nachfolger


class Warteschlange:
    def __init__(self):
        self.anfang = None
        self.ende = None

    def Einfügen(self, patient_neu):
        if self.anfang is None:
            self.anfang = patient_neu
        else:
            self.ende.NachfolgerSetzen(patient_neu)
        self.ende = patient_neu
--- tests
def namen(w):
    out = []
    p = w.anfang
    while p is not None and len(out) < 20:
        out.append(p.name)
        p = p.nachfolger
    return out

@test("Einfügen in eine leere Warteschlange: anfang und ende zeigen auf den neuen Patienten")
def _():
    w = Warteschlange()
    a = Patient("Andi")
    w.Einfügen(a)
    ok(w.anfang is a and w.ende is a, "anfang und ende müssen beide auf Andi zeigen")

@test("Drei Patienten: Kette Andi → Bert → Clara")
def _():
    w = Warteschlange()
    for n in ["Andi", "Bert", "Clara"]:
        w.Einfügen(Patient(n))
    eq(namen(w), ["Andi", "Bert", "Clara"], "Kette ab anfang")
    eq(w.ende.name, "Clara", "ende.name")
--- hint
Zwei Fälle mit `if self.anfang is None:`. `self.ende = patient_neu` brauchst du in beiden Fällen, es kann also hinter dem if/else stehen.
--- explain
Im nicht leeren Fall ist `self.ende` der bisher letzte Patient; er bekommt den neuen als Nachfolger, bevor `ende` weiterrückt.
:::

:::exercise id=c1-remove title="Entfernen ohne Feld (alle Fälle)" level=2
Implementiere `Entfernen()`: Gib den ersten Patienten zurück oder `None`, wenn die Warteschlange leer ist. Vergiss nicht den Sonderfall, in dem der **letzte** Patient entfernt wird. Die Prüfungen fügen auch wieder ein, nachdem die Warteschlange geleert wurde.
--- starter
class Patient:
    def __init__(self, s):
        self.name = s
        self.nachfolger = None

    def NachfolgerSetzen(self, nf):
        self.nachfolger = nf

    def NachfolgerGeben(self):
        return self.nachfolger


class Warteschlange:
    def __init__(self):
        self.anfang = None
        self.ende = None

    def Einfügen(self, patient_neu):
        if self.anfang is None:
            self.anfang = patient_neu
        else:
            self.ende.NachfolgerSetzen(patient_neu)
        self.ende = patient_neu

    def Entfernen(self):
        pass
--- solution
class Patient:
    def __init__(self, s):
        self.name = s
        self.nachfolger = None

    def NachfolgerSetzen(self, nf):
        self.nachfolger = nf

    def NachfolgerGeben(self):
        return self.nachfolger


class Warteschlange:
    def __init__(self):
        self.anfang = None
        self.ende = None

    def Einfügen(self, patient_neu):
        if self.anfang is None:
            self.anfang = patient_neu
        else:
            self.ende.NachfolgerSetzen(patient_neu)
        self.ende = patient_neu

    def Entfernen(self):
        if self.anfang is None:
            return None
        p = self.anfang
        self.anfang = self.anfang.NachfolgerGeben()
        if self.anfang is None:
            self.ende = None
        return p
--- tests
@test("Entfernen aus einer leeren Warteschlange gibt None zurück")
def _():
    eq(Warteschlange().Entfernen(), None, "Entfernen()")

@test("FIFO-Reihenfolge")
def _():
    w = Warteschlange()
    for n in ["Andi", "Bert", "Clara"]:
        w.Einfügen(Patient(n))
    eq([w.Entfernen().name for i in range(3)], ["Andi", "Bert", "Clara"], "entfernte Namen")
    eq(w.Entfernen(), None, "Entfernen(), nachdem die Warteschlange leer ist")

@test("Nach dem Entfernen des letzten Patienten sind anfang und ende None")
def _():
    w = Warteschlange()
    w.Einfügen(Patient("Andi"))
    w.Entfernen()
    eq((w.anfang, w.ende), (None, None), "(anfang, ende)")

@test("Einfügen funktioniert wieder, nachdem die Warteschlange geleert wurde")
def _():
    w = Warteschlange()
    w.Einfügen(Patient("Andi"))
    w.Entfernen()
    w.Einfügen(Patient("Bert"))
    w.Einfügen(Patient("Clara"))
    eq((w.Entfernen().name, w.Entfernen().name), ("Bert", "Clara"), "entfernt nach dem Wiederbefüllen")
--- hint
Reihenfolge: Leer-Prüfung → ersten Patienten merken → `anfang` weitersetzen → wenn `anfang` jetzt `None` ist, auch `ende` auf `None` setzen → zurückgeben.
--- hint
`self.ende = self.ende.NachfolgerGeben()` ist **nicht** richtig: Der Nachfolger des letzten Patienten ist immer `None`, `ende` ginge also nach jedem Entfernen verloren.
--- explain
Der entfernte Patient wird in der lokalen Variablen `p` gemerkt, bevor `anfang` weiterrückt, sonst gäbe es keine Referenz mehr, die man zurückgeben könnte. Wird die Warteschlange leer, darf `ende` nicht mehr auf das entfernte Objekt zeigen.
:::

:::exercise id=c1-fix title="Julias und Giannas Methoden reparieren (Aufgabe 1)" level=2
Hier sind die kurzen Versionen aus Aufgabe 1. Mach sie mit möglichst wenigen Änderungen richtig. Erklär dir danach selbst, welche Fälle gefehlt haben (siehe Logik-Abschnitt).
--- starter
class Patient:
    def __init__(self, s):
        self.name = s
        self.nachfolger = None

    def NachfolgerSetzen(self, nf):
        self.nachfolger = nf

    def NachfolgerGeben(self):
        return self.nachfolger


class Warteschlange:
    def __init__(self):
        self.anfang = None
        self.ende = None

    def Einfügen(self, patientNeu):
        self.ende.NachfolgerSetzen(patientNeu)
        self.ende = patientNeu

    def Entfernen(self):
        p = self.anfang
        self.anfang = self.anfang.NachfolgerGeben()
        return p
--- solution
class Patient:
    def __init__(self, s):
        self.name = s
        self.nachfolger = None

    def NachfolgerSetzen(self, nf):
        self.nachfolger = nf

    def NachfolgerGeben(self):
        return self.nachfolger


class Warteschlange:
    def __init__(self):
        self.anfang = None
        self.ende = None

    def Einfügen(self, patientNeu):
        if self.anfang is None:
            self.anfang = patientNeu
        else:
            self.ende.NachfolgerSetzen(patientNeu)
        self.ende = patientNeu

    def Entfernen(self):
        p = self.anfang
        if self.anfang is not None:
            self.anfang = self.anfang.NachfolgerGeben()
            if self.anfang is None:
                self.ende = None
        return p
--- tests
@test("Einfügen in eine leere Warteschlange")
def _():
    w = Warteschlange()
    w.Einfügen(Patient("A"))
    eq((w.anfang.name, w.ende.name), ("A", "A"), "(anfang.name, ende.name)")

@test("Entfernen aus einer leeren Warteschlange")
def _():
    eq(Warteschlange().Entfernen(), None, "Entfernen()")

@test("Den letzten entfernen, dann wieder einfügen")
def _():
    w = Warteschlange()
    w.Einfügen(Patient("A"))
    eq(w.Entfernen().name, "A", "entfernt")
    eq(w.ende, None, "ende nach dem Entfernen des letzten Patienten")
    w.Einfügen(Patient("B"))
    eq(w.Entfernen().name, "B", "entfernt nach dem Wiederbefüllen")

@test("Normaler Betrieb")
def _():
    w = Warteschlange()
    for n in "ABCD":
        w.Einfügen(Patient(n))
    eq("".join(w.Entfernen().name for i in range(4)), "ABCD", "Reihenfolge")
--- hint
Einfügen braucht den Leer-Fall. Entfernen braucht den Leer-Fall **und** den Fall „letzter Patient“.
--- explain
Im Einfügen fehlte: die leere Warteschlange (`ende` ist None, `anfang` wird nie gesetzt). Im Entfernen fehlten: die leere Warteschlange (AttributeError) und das Zurücksetzen von `ende`, wenn der letzte Patient geht.
:::

:::exercise id=c1-walk title="Die Warteschlange durchlaufen" level=2
Ergänze drei Methoden, die mit einer lokalen Hilfsvariablen **durchlaufen** (nie `self.anfang` bewegen!):

- `LaengeGeben()`: Anzahl der Patienten
- `InformationAusgeben()`: gibt alle Namen aus, einen pro Zeile, von vorne nach hinten
- `PositionGeben(name)`: die Position (0 = erster) des ersten Patienten mit diesem Namen, oder −1
--- starter
class Patient:
    def __init__(self, s):
        self.name = s
        self.nachfolger = None


class Warteschlange:
    def __init__(self):
        self.anfang = None
        self.ende = None

    def Einfügen(self, p):
        if self.anfang is None:
            self.anfang = p
        else:
            self.ende.nachfolger = p
        self.ende = p

    def LaengeGeben(self):
        pass

    def InformationAusgeben(self):
        pass

    def PositionGeben(self, name):
        pass
--- solution
class Patient:
    def __init__(self, s):
        self.name = s
        self.nachfolger = None


class Warteschlange:
    def __init__(self):
        self.anfang = None
        self.ende = None

    def Einfügen(self, p):
        if self.anfang is None:
            self.anfang = p
        else:
            self.ende.nachfolger = p
        self.ende = p

    def LaengeGeben(self):
        anzahl = 0
        k = self.anfang
        while k is not None:
            anzahl = anzahl + 1
            k = k.nachfolger
        return anzahl

    def InformationAusgeben(self):
        k = self.anfang
        while k is not None:
            print(k.name)
            k = k.nachfolger

    def PositionGeben(self, name):
        position = 0
        k = self.anfang
        while k is not None:
            if k.name == name:
                return position
            position = position + 1
            k = k.nachfolger
        return -1
--- tests
def schlange(*names):
    w = Warteschlange()
    for n in names:
        w.Einfügen(Patient(n))
    return w

@test("LaengeGeben für 0, 1 und 3 Patienten")
def _():
    eq((schlange().LaengeGeben(), schlange("A").LaengeGeben(), schlange("A", "B", "C").LaengeGeben()), (0, 1, 3), "Längen")

@test("InformationAusgeben gibt alle Namen aus")
def _():
    eq(lines(printed(schlange("Andi", "Bert", "Clara").InformationAusgeben)), ["Andi", "Bert", "Clara"], "ausgegebene Zeilen")

@test("PositionGeben")
def _():
    w = schlange("Andi", "Bert", "Clara")
    eq((w.PositionGeben("Andi"), w.PositionGeben("Clara"), w.PositionGeben("Zoe")), (0, 2, -1), "Positionen von Andi, Clara, Zoe")

@test("Die Warteschlange ist nach allen drei Methoden unverändert")
def _():
    w = schlange("Andi", "Bert", "Clara")
    w.LaengeGeben()
    printed(w.InformationAusgeben)
    w.PositionGeben("Zoe")
    eq((w.anfang.name, w.LaengeGeben()), ("Andi", 3), "(anfang.name, LaengeGeben()) danach")
--- hint
Alle drei folgen dem Durchlaufmuster: `k = self.anfang`, `while k is not None:`, …, `k = k.nachfolger`.
--- hint
`PositionGeben` kann in der Schleife `return` verwenden, sobald der Name passt.
--- explain
Die letzte Prüfung schlägt bei Versionen fehl, die `self.anfang` bewegen: Durchlaufen darf die Struktur selbst nie verändern. (Dein eigenes `PositionGeben` im PyCharm-Projekt hat einen Knoten mit einem String verglichen und `self.anfang` bewegt; es hat deshalb nie einen Treffer gefunden und die Warteschlange geleert.)
:::

:::exercise id=c1-snake title="Snake: der Körper ist eine Warteschlange (Aufgabe 5, 17)" level=3
Bei Snake verhält sich der Körper der Schlange wie eine Warteschlange von Positionen: Bei jedem Zug wird die **neue Position des Kopfes hinten angehängt** und die älteste Position (der Schwanz) **vorne entfernt**. Frisst die Schlange, wird der Schwanz nicht entfernt, und die Schlange wächst.

Schreib die Klasse `Schlange` mit einer eigenen Kette von `Segment`-Objekten (Attribute `x`, `y`, `nachfolger`):

- `__init__(x, y)`: Die Schlange besteht aus einem Segment bei (x, y); `anfang` = Schwanz, `ende` = Kopf
- `Bewegen(dx, dy, wachsen)`: hängt ein Segment bei Kopf + (dx, dy) an; entfernt das Schwanzsegment, außer `wachsen` ist True
- `PositionenGeben()`: Liste der `(x, y)` vom Schwanz zum Kopf
--- starter
class Segment:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.nachfolger = None


class Schlange:
    def __init__(self, x, y):
        pass

    def Bewegen(self, dx, dy, wachsen):
        pass

    def PositionenGeben(self):
        pass


s = Schlange(5, 5)
s.Bewegen(1, 0, True)
s.Bewegen(1, 0, True)
s.Bewegen(0, 1, False)
print(s.PositionenGeben())
--- solution
class Segment:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.nachfolger = None


class Schlange:
    def __init__(self, x, y):
        self.anfang = Segment(x, y)
        self.ende = self.anfang

    def Bewegen(self, dx, dy, wachsen):
        neu = Segment(self.ende.x + dx, self.ende.y + dy)
        self.ende.nachfolger = neu
        self.ende = neu
        if not wachsen:
            self.anfang = self.anfang.nachfolger

    def PositionenGeben(self):
        ergebnis = []
        k = self.anfang
        while k is not None:
            ergebnis.append((k.x, k.y))
            k = k.nachfolger
        return ergebnis


s = Schlange(5, 5)
s.Bewegen(1, 0, True)
s.Bewegen(1, 0, True)
s.Bewegen(0, 1, False)
print(s.PositionenGeben())
--- tests
@test("Eine neue Schlange hat ein Segment")
def _():
    eq(Schlange(5, 5).PositionenGeben(), [(5, 5)], "PositionenGeben()")

@test("Zweimal wachsen, dann ein normaler Zug")
def _():
    s = Schlange(5, 5)
    s.Bewegen(1, 0, True)
    s.Bewegen(1, 0, True)
    s.Bewegen(0, 1, False)
    eq(s.PositionenGeben(), [(6, 5), (7, 5), (7, 6)], "PositionenGeben()")

@test("Normale Züge behalten die Länge")
def _():
    s = Schlange(0, 0)
    s.Bewegen(1, 0, True)
    for i in range(5):
        s.Bewegen(0, 1, False)
    eq(s.PositionenGeben(), [(1, 4), (1, 5)], "PositionenGeben()")

@test("Eine Schlange aus einem Segment bewegt sich")
def _():
    s = Schlange(2, 2)
    s.Bewegen(-1, 0, False)
    eq(s.PositionenGeben(), [(1, 2)], "PositionenGeben()")
--- hint
Bewegen = Einfügen hinten (`ende`) + (außer beim Wachsen) Entfernen vorne (`anfang`).
--- hint
Die Schlange ist nie leer, `ende` ist hier also nie `None`, und die Sonderfälle der allgemeinen Warteschlange fallen weg.
--- explain
Der Schlangenkörper ist eine Warteschlange, deren Länge sich nur beim Fressen ändert. In Snake Level 2 (Aufgabe 17) entfernen Autos, die den hinteren Teil abtrennen, mehrere Segmente vorne, also mehrere Entfernen hintereinander.
:::

## [exam] Klausurtraining

::::exam title="Objektdiagramme für die Sonderfälle" points=6
Eine Warteschlange (Lösung ohne Feld) ist leer. Zeichne das Objektdiagramm nach jedem Schritt: (1) Einfügen(Andi), (2) Einfügen(Bert), (3) Entfernen(), (4) Entfernen().
--- solution
(1) `anfang` → Andi, `ende` → Andi, Andi.nachfolger = None.

(2)
:::diagram objects
w: WARTESCHLANGE @0,0 | anfang -> p1 | ende -> p2
p1: PATIENT @1,0.9 | name = "Andi" | nachfolger -> p2
p2: PATIENT @2.1,0.9 | name = "Bert" | nachfolger = None
:::

(3) `anfang` → Bert, `ende` → Bert. Andi wird zurückgegeben (und von der Warteschlange nicht mehr referenziert).

(4) `anfang = None`, `ende = None`. Bert wird zurückgegeben. Ohne Zurücksetzen von `ende` würde es noch auf Bert zeigen.
::::

:::exam title="Feld oder Warteschlange (Aufgabe 4)" points=4
a) Diskutiere Vor- und Nachteile eines Feldes und einer Warteschlange für die Verwaltung der Patienten einer Arztpraxis.
b) Entscheide für das K.-o.-Tischtennisturnier (Aufgabe 4 e) und begründe.
--- solution
a) Feld: + direkter Zugriff auf jede Position, + einfach; − Größe muss im Voraus festgelegt werden (zu klein / verschwendeter Speicher), − beim Entfernen des ersten Patienten rücken alle anderen nach. Warteschlange (Kette): + wächst und schrumpft nach Bedarf, + Einfügen hinten und Entfernen vorne ändern nur wenige Referenzen; − kein direkter Zugriff auf den k-ten Patienten (Durchlaufen nötig), − jedes Element braucht eine zusätzliche Referenz.

b) Warteschlange: Die beiden Spieler vorne spielen gegeneinander (zweimal Entfernen), der Sieger wird hinten angehängt (Einfügen) und spielt in der nächsten Runde wieder. Das ist genau das FIFO-Prinzip; die Zahl der Spieler schrumpft im Lauf des Turniers.
:::
