---
id: c4
num: C4
part: C
title: Entwurfsmuster Kompositum
short: Kompositum
lead: In C3 musste jede Methode auf None prüfen, am Anfang der Liste und an ihrem Ende. Das Kompositum ersetzt „nichts“ durch ein echtes Objekt, den ABSCHLUSS. Er beantwortet jede Nachricht selbst und ist das Rekursionsende jeder Rekursion. Die Prüfungen verschwinden, und die Listenmethoden schrumpfen auf je ein oder zwei Zeilen. Das ist das letzte Thema von Kapitel II und die Form, die deine Klausur erwartet.
minutes: 110
uses: [c3, a9, b1]
goals:
  - die Idee eines Entwurfsmusters und die Rollen Komponente, Kompositum und Blatt erklären
  - das Klassendiagramm einer Liste als Kompositum mit LISTE, LISTENELEMENT, KNOTEN, ABSCHLUSS, DATENELEMENT zeichnen
  - alle Listenmethoden polymorph in KNOTEN und ABSCHLUSS implementieren, ganz ohne None-Prüfung
  - Objekt- und Sequenzdiagramme für Kompositum-Listen zeichnen
  - das Muster auf andere Strukturen übertragen (Ordner und Dateien)
---

## [logic] Das Problem mit „nichts“

In der Liste aus C3 wird das Ende der Liste durch `None` markiert, also durch *gar kein Objekt*. `None` kann keine Nachrichten beantworten, deshalb muss der Absender vor jeder Nachricht fragen: *„Ist da überhaupt jemand?“*

:::cols
```python
# Liste (C3)
def LaengeGeben(self):
    if self.anfang is not None:
        return self.anfang.RestlaengeGeben()
    return 0
```
--- col
```python
# Knoten (C3)
def RestlaengeGeben(self):
    if self.nachfolger is None:
        return 1
    return 1 + self.nachfolger.RestlaengeGeben()
```
:::

Jede Methode aus C3 wiederholt diese Prüfungen, einmal in LISTE (leere Liste?) und einmal in KNOTEN (letzter Knoten?). Sie machen die Methoden länger und sind die häufigste Fehlerquelle: Vergisst man eine, bekommt man `AttributeError: 'NoneType' object has no attribute …`.

**Idee:** Setz ein **echtes Objekt** ans Ende der Liste, den **ABSCHLUSS**. Er gehört wie ein Knoten zur Struktur der Liste, trägt aber keine Daten. Weil er ein Objekt ist, kann er jede Nachricht empfangen und sie **auf seine eigene Art** beantworten:

- *„Wie lang ist der Rest ab dir?“* — der ABSCHLUSS antwortet **0**.
- *„Füg das hinten ein!“* — der ABSCHLUSS antwortet: *„Hier, ein neuer Knoten, mit mir dahinter.“*
- *„Hast du den Schlüssel X?“* — der ABSCHLUSS antwortet **nichts** (nicht gefunden).

Jetzt müssen die Knoten nie etwas prüfen: Ihr Nachfolger ist **immer** ein Objekt, das die Nachricht versteht, entweder ein KNOTEN oder der ABSCHLUSS. Auch die Liste muss nie prüfen: Selbst eine leere Liste hat ein erstes Element, ihren ABSCHLUSS.

:::diagram objects caption="Eine Liste mit drei Knoten als Kompositum"
l: LISTE @0,0 | anfang -> k1
k1: KNOTEN @0.95,0 | daten -> d1 | nachfolger -> k2
k2: KNOTEN @1.95,0 | daten -> d2 | nachfolger -> k3
k3: KNOTEN @2.95,0 | daten -> d3 | nachfolger -> a
a: ABSCHLUSS @3.95,0 !
d1: PATIENT @0.95,1.1 | name = "Andi"
d2: PATIENT @1.95,1.1 | name = "Bert"
d3: PATIENT @2.95,1.1 | name = "Clara"
:::

:::diagram objects caption="Die leere Liste: anfang zeigt auf den ABSCHLUSS, nie auf None"
l: LISTE @0,0 | anfang -> a
a: ABSCHLUSS @1,0 !
:::

:::key
Im Kompositum ist der **ABSCHLUSS das Rekursionsende** jeder rekursiven Listenmethode. Der KNOTEN macht den Rekursionsschritt, der ABSCHLUSS das Rekursionsende. Welches von beiden läuft, entscheidet das **Objekt**, das die Nachricht empfängt: Das ist Polymorphie (Lektion A9), eingesetzt, um eine Rekursion zu beenden.
:::

Vergleiche mit der Rekursion aus B1: Dort hat ein `if` zwischen Rekursionsende und Rekursionsschritt entschieden. Hier entscheidet das die *Klasse* des empfangenden Objekts.

## [logic] Das Klassendiagramm

KNOTEN und ABSCHLUSS müssen **dieselben Nachrichten** verstehen, deshalb erben beide von einer abstrakten Oberklasse **LISTENELEMENT**, die sie alle als abstrakte Methoden aufführt. LISTE und KNOTEN kennen als `anfang` / `nachfolger` nur „irgendein LISTENELEMENT“; welche Art es ist, ist ihnen egal.

:::diagram classes caption="Einfach verkettete Liste als Kompositum"
class LISTE @0,0 | anfang: LISTENELEMENT | VorneEinfügen(d); HintenEinfügen(d); LängeGeben(): GANZZAHL; Suchen(s): DATENELEMENT; AnfangEntfernen(): DATENELEMENT; EndeEntfernen(): DATENELEMENT
abstract LISTENELEMENT @1.75,0 | | LängeGeben(): GANZZAHL {abstract}; HintenEinfügen(d): LISTENELEMENT {abstract}; Suchen(s): DATENELEMENT {abstract}; NachfolgerGeben(): LISTENELEMENT {abstract}; DatenelementGeben(): DATENELEMENT {abstract}
class KNOTEN @1.9,1.45 | daten: DATENELEMENT; nachfolger: LISTENELEMENT | (alle Methoden von LISTENELEMENT)
class ABSCHLUSS @3.15,1.45 | | (alle Methoden von LISTENELEMENT)
abstract DATENELEMENT @0,1.45 | | InformationAusgeben() {abstract}; SchlüsselIstGleich(s): WAHRHEITSWERT {abstract}
assoc LISTE -> LISTENELEMENT : anfang [1]
inherit KNOTEN -> LISTENELEMENT
inherit ABSCHLUSS -> LISTENELEMENT
assoc KNOTEN -> LISTENELEMENT : nachfolger [1]
assoc KNOTEN -> DATENELEMENT : daten [1]
:::

Lies es genau, nach diesen Details wird in Klausuren gefragt:

- LISTE —`anfang`→ LISTENELEMENT, Multiplizität **1** (nicht 0..1 wie in C3): Es gibt immer ein erstes Element, mindestens den ABSCHLUSS.
- KNOTEN —`nachfolger`→ LISTENELEMENT, Multiplizität **1**: Jeder Knoten hat einen Nachfolger, der letzte Knoten hat den ABSCHLUSS.
- KNOTEN —`daten`→ DATENELEMENT: Die Trennung von Struktur und Daten aus C2 bleibt.
- ABSCHLUSS hat **keine Attribute** und verweist auf nichts.
- LISTENELEMENT ist **abstrakt** (Name kursiv oder «abstract»): Es gibt keine „Listenelemente an sich“, nur Knoten und Abschlussobjekte.

## [logic] Das Entwurfsmuster dahinter

Ein **Entwurfsmuster** ist eine bewährte, wiederverwendbare Lösungsschablone für ein Entwurfsproblem, das immer wieder auftritt. Es beschreibt Klassen, ihre Rollen und Beziehungen, keinen fertigen Code.

Das **Kompositum** löst dieses Problem: *Objekte sollen zu einer Struktur (einer Kette, einem Baum) beliebiger Größe zusammengesetzt werden, und ein Klient soll ein einzelnes Teil und eine zusammengesetzte Struktur gleich behandeln können.*

:::diagram classes caption="Entwurfsmuster Kompositum, allgemeine Form"
class KLIENT @0,0 | | 
abstract KOMPONENTE @1.25,0 | | Operation() {abstract}
class BLATT @0.75,1.2 | | Operation()
class KOMPOSITUM @1.95,1.2 | | Operation()
assoc KLIENT -> KOMPONENTE : benutzt
inherit BLATT -> KOMPONENTE
inherit KOMPOSITUM -> KOMPONENTE
assoc KOMPOSITUM -> KOMPONENTE : enthält [*]
:::

| Rolle im Muster | Aufgabe | in deiner Liste |
|---|---|---|
| **Komponente** | abstrakte Oberklasse: die gemeinsame Schnittstelle | LISTENELEMENT |
| **Kompositum** | enthält andere Komponenten, gibt Arbeit an sie weiter und verknüpft die Ergebnisse | KNOTEN (enthält genau eine Komponente, seinen nachfolger) |
| **Blatt** | enthält nichts, erledigt seine Arbeit direkt | ABSCHLUSS |
| **Klient** | benutzt die Struktur nur über die Schnittstelle der Komponente | LISTE |

Der Trick des Musters ist der Pfeil von KOMPOSITUM zurück zu KOMPONENTE: Ein Kompositum enthält Komponenten, die wieder Komposita sein können. So entsteht eine **rekursive Struktur**, und die Operationen laufen rekursiv an ihr entlang. Bei der Liste enthält jedes Kompositum genau eine Komponente, die Struktur ist also eine Kette. Enthält ein Kompositum *mehrere* Komponenten, wird die Struktur ein **Baum**, zum Beispiel ein Dateisystem:

:::diagram classes caption="Dasselbe Muster: Ordner und Dateien"
abstract ELEMENT @0.85,0 | name | GrößeGeben(): GANZZAHL {abstract}
class DATEI @0.3,1.2 | größe | GrößeGeben(): GANZZAHL
class ORDNER @1.45,1.2 | | GrößeGeben(): GANZZAHL; Hinzufügen(e: ELEMENT)
inherit DATEI -> ELEMENT
inherit ORDNER -> ELEMENT
assoc ORDNER -> ELEMENT : inhalt [*]
:::

`GrößeGeben()` einer DATEI gibt ihre eigene Größe zurück (Blatt, Rekursionsende); `GrößeGeben()` eines ORDNERs fragt jedes enthaltene Element und addiert die Antworten (Kompositum, Rekursionsschritt). Zeichnungen mit Gruppen, Menüs mit Untermenüs und Rechenausdrücke sind genauso aufgebaut. Der letzte Python-Block dieser Lektion implementiert die Ordner.

## [logic] Die Listenmethoden im Einzelnen

Jede Methode hat jetzt drei kurze Teile: LISTE gibt die Nachricht an `anfang` weiter, KNOTEN erledigt seinen Teil und gibt den Rest weiter, ABSCHLUSS beendet die Rekursion.

| Methode | LISTE | KNOTEN (Rekursionsschritt) | ABSCHLUSS (Rekursionsende) |
|---|---|---|---|
| `LängeGeben()` | return anfang.LängeGeben() | return nachfolger.LängeGeben() + 1 | return 0 |
| `InformationAusgeben()` | anfang.InformationAusgeben() | daten.InformationAusgeben(); nachfolger.InformationAusgeben() | (tut nichts) |
| `Suchen(s)` | return anfang.Suchen(s) | falls daten.SchlüsselIstGleich(s): return daten, sonst return nachfolger.Suchen(s) | return nichts |
| `HintenEinfügen(d)` | anfang = anfang.HintenEinfügen(d) | nachfolger = nachfolger.HintenEinfügen(d); return selbst | return neu KNOTEN(d, selbst) |
| `VorneEinfügen(d)` | anfang = neu KNOTEN(d, anfang) | – | – |
| `NachfolgerGeben()` | – | return nachfolger | return **selbst** |
| `DatenelementGeben()` | – | return daten | return nichts |

Vier Punkte brauchen eine Erklärung.

**1. HintenEinfügen gibt den neuen Rest zurück.** In C3 hat der letzte Knoten den neuen Knoten selbst erzeugt (`nachfolger = neu KNOTEN(d)`). Jetzt weiß kein Knoten, dass er der letzte ist; nur der ABSCHLUSS „merkt“, dass das Ende erreicht ist. Er kann den `nachfolger` seines Vorgängers nicht ändern, also **gibt** er den neuen Knoten **zurück**, genau das Muster `nachfolger = nachfolger.Methode(…)` / `return selbst` aus C3. Der neue Knoten bekommt den ABSCHLUSS als Nachfolger, so bleibt dasselbe Abschlussobjekt am Ende.

:::diagram seq caption="HintenEinfügen(d) bei einer Liste mit einem Knoten"
actors: Aufrufer | l: LISTE | k1: KNOTEN | a: ABSCHLUSS | kNeu: KNOTEN
Aufrufer -> l: HintenEinfügen(d)
l -> k1: HintenEinfügen(d)
k1 -> a: HintenEinfügen(d)
a -> kNeu: «neu» KNOTEN(d, a)
kNeu --> a: kNeu
a --> k1: kNeu
k1 --> l: k1
l --> Aufrufer: 
:::

k1 speichert das zurückgegebene kNeu als seinen `nachfolger` und gibt sich selbst zurück; die Liste speichert k1 als `anfang` (unverändert). Bei einer **leeren** Liste ist der ABSCHLUSS selbst `anfang`: Er gibt kNeu direkt an die Liste zurück, die es als neuen `anfang` speichert. Es ist kein Sonderfall nötig.

**2. LängeGeben zählt auf dem Rückweg.**

:::diagram seq caption="LängeGeben() bei einer Liste mit zwei Knoten"
actors: Aufrufer | l: LISTE | k1: KNOTEN | k2: KNOTEN | a: ABSCHLUSS
Aufrufer -> l: LängeGeben()
l -> k1: LängeGeben()
k1 -> k2: LängeGeben()
k2 -> a: LängeGeben()
a --> k2: 0
k2 --> k1: 1
k1 --> l: 2
l --> Aufrufer: 2
:::

**3. AnfangEntfernen braucht weder Rekursion noch Prüfung.** Die Liste fragt ihr erstes Element nach seinen Daten und seinem Nachfolger:

```pseudo
methode AnfangEntfernen() -> DATENELEMENT       // in LISTE
    d = anfang.DatenelementGeben()
    anfang = anfang.NachfolgerGeben()
    return d
endemethode
```

Bei einer leeren Liste ist `anfang` der ABSCHLUSS: `DatenelementGeben()` liefert nichts, und `NachfolgerGeben()` liefert den ABSCHLUSS **selbst**. Die Liste bleibt leer und gibt nichts zurück, ohne Fehler und ohne `falls`. Deshalb gibt `ABSCHLUSS.NachfolgerGeben()` `selbst` zurück.

**4. Methoden „am Ende“ stellen eine Frage.** Bei EndeGeben und EndeEntfernen ist das Rekursionsende der **letzte Knoten**, nicht der ABSCHLUSS. Ein Knoten muss herausfinden, ob er der letzte ist, also ob sein Nachfolger der ABSCHLUSS ist. Zwei saubere Wege:

- **Information nach unten weitergeben.** `EndeGeben(bisher)`: Jeder Knoten ruft `nachfolger.EndeGeben(daten)` auf, gibt also seine eigenen Daten an den Nachfolger weiter. Der ABSCHLUSS gibt zurück, was er bekommen hat, und das sind die Daten des letzten Knotens. Die Liste beginnt mit `anfang.EndeGeben(nichts)`, eine leere Liste liefert also nichts.
- **Den Nachfolger fragen.** In `EndeEntfernen()` fragt ein Knoten `nachfolger.LängeGeben() == 0`: Nur der ABSCHLUSS antwortet 0. Dann ist der Knoten der letzte und gibt seinen Nachfolger (den ABSCHLUSS) zurück, um zu verschwinden. Sonst macht er mit dem Muster weiter. Der ABSCHLUSS selbst gibt `selbst` zurück (in einer leeren Liste gibt es nichts zu entfernen).

```pseudo
methode EndeEntfernen() -> LISTENELEMENT        // in KNOTEN
    falls nachfolger.LängeGeben() == 0 dann
        return nachfolger                         // ich bin der letzte Knoten: überspring mich
    sonst
        nachfolger = nachfolger.EndeEntfernen()
        return selbst
    endefalls
endemethode
```

:::note
`nachfolger.LängeGeben()` durchläuft in jedem Knoten den ganzen Rest der Liste, das ist bei sehr langen Listen langsam. In der Klausur spielt das keine Rolle. Wenn du es schnell willst: Da `ABSCHLUSS.NachfolgerGeben()` sich selbst zurückgibt, ist `nachfolger.NachfolgerGeben() == nachfolger` nur beim ABSCHLUSS wahr.
:::

**EinfügenVor, SortiertEinfügen und KnotenEntfernen** behalten das Muster aus C3, nur das `falls nachfolger ≠ nichts` fällt weg. Wird der ABSCHLUSS erreicht, entscheidet er, was „hinter dem letzten Knoten“ passiert: EinfügenVor und SortiertEinfügen (Element nicht gefunden / neues Element ist das größte) geben `neu KNOTEN(d, selbst)` zurück, der neue Knoten wird also angehängt. KnotenEntfernen (nicht gefunden) gibt `selbst` zurück, es ändert sich also nichts.

Probier jede Operation aus und vergleiche mit der Version aus C3. Der ABSCHLUSS ist grün gezeichnet:

:::viz listops
{"mode": "komp", "init": ["Andi", "Bert", "Clara"]}
:::

:::quiz
Was gibt der ABSCHLUSS zurück, wenn er `HintenEinfügen(d)` empfängt?
- [ ] nichts, weil er keine Daten hat
- [ ] sich selbst, weil er am Ende bleibt
- [x] einen neuen KNOTEN mit den Daten d und sich selbst als nachfolger
- [ ] einen neuen KNOTEN mit den Daten d und einem neuen ABSCHLUSS als nachfolger
--- explain
Der ABSCHLUSS erzeugt den neuen Knoten und setzt **sich selbst** dahinter: `return neu KNOTEN(d, selbst)`. Der Aufrufer (der letzte Knoten oder, bei einer leeren Liste, die LISTE) speichert den zurückgegebenen Knoten. Einen neuen ABSCHLUSS zu erzeugen würde auch funktionieren, aber dann lägen in der Liste mehrere Abschlussobjekte herum; ein Abschlussobjekt pro Liste genügt.
:::

:::quiz
Eine Liste enthält Andi und Bert. Welche Objekte führen ihre Methode `LängeGeben()` aus, wenn `LängeGeben()` der Liste aufgerufen wird, und welches gibt 0 zurück?
- [ ] nur die beiden KNOTEN; der ABSCHLUSS wird nie gefragt
- [x] KNOTEN(Andi), KNOTEN(Bert) und der ABSCHLUSS; der ABSCHLUSS gibt 0 zurück
- [ ] KNOTEN(Bert) gibt 0 zurück, weil er der letzte Knoten ist
- [ ] nur die LISTE, die mit einer Schleife zählt
--- explain
Jeder Knoten gibt die Frage weiter, also wird der ABSCHLUSS erreicht und antwortet 0 (Rekursionsende). Berts Knoten gibt 0 + 1 = 1 zurück, Andis Knoten 1 + 1 = 2.
:::

## [bridge] Vom Klassendiagramm zu Python

:::bridge title="Abstraktes LISTENELEMENT, KNOTEN und ABSCHLUSS"
abstrakte klasse LISTENELEMENT            || class Listenelement(ABC):
    abstrakte methode LängeGeben()        ||     @abstractmethod
                                          ||     def LaengeGeben(self):
                                          ||         pass
klasse KNOTEN erbt von LISTENELEMENT      || class Knoten(Listenelement):
    nachfolger: LISTENELEMENT             ||     def __init__(self, dneu, kneu):
    daten: DATENELEMENT                   ||         self.daten = dneu
                                          ||         self.nachfolger = kneu
    methode LängeGeben()                  ||     def LaengeGeben(self):
        return nachfolger.LängeGeben() + 1||         return self.nachfolger.LaengeGeben() + 1
klasse ABSCHLUSS erbt von LISTENELEMENT   || class Abschluss(Listenelement):
    methode LängeGeben()                  ||     def LaengeGeben(self):
        return 0                          ||         return 0
klasse LISTE                              || class Liste:
    anfang: LISTENELEMENT                 ||     def __init__(self):
    konstruktor: anfang = neu ABSCHLUSS() ||         self.anfang = Abschluss()
>> `from abc import ABC, abstractmethod` am Anfang der Datei (Lektion A9). Eine Klasse, die von `Listenelement` erbt, muss **jede** abstrakte Methode implementieren, sonst weigert sich Python, Objekte von ihr zu erzeugen (TypeError). Der Konstruktor von KNOTEN **verlangt** jetzt einen Nachfolger: Es gibt keinen Standardwert `kneu=None` mehr, weil ein Knoten nie ins Nichts zeigt.
:::

:::bridge title="HintenEinfügen mit zurückgegebenem Rest"
// LISTE                                    || # class Liste
methode HintenEinfügen(d)                   || def HintenEinfuegen(self, dneu):
    anfang = anfang.HintenEinfügen(d)       ||     self.anfang = self.anfang.HintenEinfuegen(dneu)
// KNOTEN                                   || # class Knoten
methode HintenEinfügen(d) -> LISTENELEMENT  || def HintenEinfuegen(self, dneu):
    nachfolger = nachfolger.HintenEinfügen(d)||     self.nachfolger = self.nachfolger.HintenEinfuegen(dneu)
    return selbst                           ||     return self
// ABSCHLUSS                                || # class Abschluss
methode HintenEinfügen(d) -> LISTENELEMENT  || def HintenEinfuegen(self, dneu):
    return neu KNOTEN(d, selbst)            ||     return Knoten(dneu, self)
>> Zähl die Zeilen: drei Klassen, fünf Zeilen Methodenrumpf, kein `if`. Vergleiche mit acht Zeilen und zwei Prüfungen in C3.
:::

:::warn title="Der klassische Fehler: return self vergessen"
Endet `Knoten.HintenEinfuegen` nicht mit `return self`, gibt Python `None` zurück. Der Aufrufer des Knotens (die Liste) speichert dann `None` als `anfang`. Zunächst passiert nichts; der **nächste** Aufruf stürzt mit `AttributeError: 'NoneType' object has no attribute 'HintenEinfuegen'` ab. Der Fehler zeigt sich einen Aufruf später als der Fehler im Code. Jede Methode nach dem Muster `x = x.Methode(…)` muss in **jedem** Fall ein LISTENELEMENT zurückgeben.
:::

## [python] Python-Blöcke

Die Blöcke bauen die vollständige Kompositum-Liste auf. Die Datenklasse `Patient` (ein `Datenelement` wie in A9) ist in jedem Startcode gegeben.

:::exercise id=c4-classes title="Listenelement, Knoten, Abschluss" level=1
Vervollständige das Kompositum:

- `Abschluss`: `LaengeGeben()` gibt 0 zurück, `NachfolgerGeben()` gibt den Abschluss selbst zurück, `DatenelementGeben()` gibt `None` zurück
- `Knoten`: die Getter und das rekursive `LaengeGeben()`
- `Liste`: Der Konstruktor erzeugt eine leere Liste (`anfang` ist ein neuer Abschluss), `VorneEinfuegen(dneu)`, `LaengeGeben()`

Verwende überhaupt kein `if`.
--- starter
from abc import ABC, abstractmethod


class Patient:
    def __init__(self, name):
        self.name = name

    def InformationAusgeben(self):
        print(self.name)


class Listenelement(ABC):
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

    def NachfolgerGeben(self):
        pass

    def DatenelementGeben(self):
        pass

    def LaengeGeben(self):
        pass


class Abschluss(Listenelement):
    def NachfolgerGeben(self):
        pass

    def DatenelementGeben(self):
        pass

    def LaengeGeben(self):
        pass


class Liste:
    def __init__(self):
        self.anfang = None

    def VorneEinfuegen(self, dneu):
        pass

    def LaengeGeben(self):
        pass
--- solution
from abc import ABC, abstractmethod


class Patient:
    def __init__(self, name):
        self.name = name

    def InformationAusgeben(self):
        print(self.name)


class Listenelement(ABC):
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

    def NachfolgerGeben(self):
        return self.nachfolger

    def DatenelementGeben(self):
        return self.daten

    def LaengeGeben(self):
        return self.nachfolger.LaengeGeben() + 1


class Abschluss(Listenelement):
    def NachfolgerGeben(self):
        return self

    def DatenelementGeben(self):
        return None

    def LaengeGeben(self):
        return 0


class Liste:
    def __init__(self):
        self.anfang = Abschluss()

    def VorneEinfuegen(self, dneu):
        self.anfang = Knoten(dneu, self.anfang)

    def LaengeGeben(self):
        return self.anfang.LaengeGeben()
--- tests
import ast

def checks_in(*class_names):
    found = []
    for node in ast.parse(SOURCE).body:
        if isinstance(node, ast.ClassDef) and node.name in class_names:
            for n in ast.walk(node):
                if isinstance(n, (ast.If, ast.IfExp, ast.While)):
                    found.append(f"{node.name}, Zeile {n.lineno}")
    return found

def namen(l):
    out = []
    e = l.anfang
    while isinstance(e, Knoten) and len(out) < 30:
        out.append(e.daten.name)
        e = e.nachfolger
    return out

@test("Eine leere Liste hat einen Abschluss als anfang")
def _():
    l = Liste()
    ok(isinstance(l.anfang, Abschluss), "Liste() muss anfang auf ein neues Abschluss-Objekt setzen, nicht auf None")
    eq(l.LaengeGeben(), 0, "Länge der leeren Liste")

@test("Abschluss: NachfolgerGeben und DatenelementGeben")
def _():
    a = Abschluss()
    ok(a.NachfolgerGeben() is a, "Abschluss.NachfolgerGeben() muss den Abschluss selbst zurückgeben")
    eq(a.DatenelementGeben(), None, "Abschluss.DatenelementGeben()")

@test("VorneEinfuegen und LaengeGeben")
def _():
    l = Liste()
    for n in ["Clara", "Bert", "Andi"]:
        l.VorneEinfuegen(Patient(n))
    eq(namen(l), ["Andi", "Bert", "Clara"], "Liste")
    eq(l.LaengeGeben(), 3, "Länge")
    e = l.anfang
    for i in range(3):
        e = e.NachfolgerGeben()
    ok(isinstance(e, Abschluss), "der nachfolger des letzten Knotens muss der Abschluss sein")

@test("Knoten.LaengeGeben ist rekursiv")
def _():
    l = Liste()
    for n in "ABC":
        l.VorneEinfuegen(Patient(n))
    r, rec = recursive(l.anfang.LaengeGeben)
    ok(rec and r == 3, "Knoten.LaengeGeben muss LaengeGeben seines nachfolgers aufrufen")

@test("Listenelement ist abstrakt, kein if in Knoten, Abschluss, Liste")
def _():
    try:
        Listenelement()
        ok(False, "Listenelement() sollte unmöglich sein (abstrakte Klasse)")
    except TypeError:
        pass
    ok(issubclass(Knoten, Listenelement) and issubclass(Abschluss, Listenelement), "Knoten und Abschluss müssen von Listenelement erben")
    f = checks_in("Knoten", "Abschluss", "Liste")
    ok(not f, "Das Kompositum braucht hier kein if/while. Gefunden: " + ", ".join(f))
--- hint
Knoten: „Die Länge ab mir ist die Länge ab meinem Nachfolger, plus 1.“ Abschluss: das Rekursionsende.
--- hint
`VorneEinfuegen` ist dieselbe Zeile wie in C3; sie funktioniert auch bei der leeren Liste, weil `self.anfang` dann der Abschluss ist.
--- explain
Keine Methode braucht eine Prüfung: Eine leere Liste beginnt mit dem Abschluss, und der antwortet 0. Die Polymorphie wählt für jedes Objekt das richtige `LaengeGeben`.
:::

:::exercise id=c4-append title="HintenEinfuegen und InformationAusgeben" level=2
Ergänze `HintenEinfuegen(dneu)` (mit zurückgegebenem Rest, siehe Brücke) und `InformationAusgeben()` in allen drei Klassen. Weiterhin kein `if`.
--- starter
from abc import ABC, abstractmethod


class Patient:
    def __init__(self, name):
        self.name = name

    def InformationAusgeben(self):
        print(self.name)


class Listenelement(ABC):
    @abstractmethod
    def LaengeGeben(self):
        pass

    @abstractmethod
    def HintenEinfuegen(self, dneu):
        pass

    @abstractmethod
    def InformationAusgeben(self):
        pass


class Knoten(Listenelement):
    def __init__(self, dneu, kneu):
        self.daten = dneu
        self.nachfolger = kneu

    def LaengeGeben(self):
        return self.nachfolger.LaengeGeben() + 1

    def HintenEinfuegen(self, dneu):
        pass

    def InformationAusgeben(self):
        pass


class Abschluss(Listenelement):
    def LaengeGeben(self):
        return 0

    def HintenEinfuegen(self, dneu):
        pass

    def InformationAusgeben(self):
        pass


class Liste:
    def __init__(self):
        self.anfang = Abschluss()

    def LaengeGeben(self):
        return self.anfang.LaengeGeben()

    def HintenEinfuegen(self, dneu):
        pass

    def InformationAusgeben(self):
        pass
--- solution
from abc import ABC, abstractmethod


class Patient:
    def __init__(self, name):
        self.name = name

    def InformationAusgeben(self):
        print(self.name)


class Listenelement(ABC):
    @abstractmethod
    def LaengeGeben(self):
        pass

    @abstractmethod
    def HintenEinfuegen(self, dneu):
        pass

    @abstractmethod
    def InformationAusgeben(self):
        pass


class Knoten(Listenelement):
    def __init__(self, dneu, kneu):
        self.daten = dneu
        self.nachfolger = kneu

    def LaengeGeben(self):
        return self.nachfolger.LaengeGeben() + 1

    def HintenEinfuegen(self, dneu):
        self.nachfolger = self.nachfolger.HintenEinfuegen(dneu)
        return self

    def InformationAusgeben(self):
        self.daten.InformationAusgeben()
        self.nachfolger.InformationAusgeben()


class Abschluss(Listenelement):
    def LaengeGeben(self):
        return 0

    def HintenEinfuegen(self, dneu):
        return Knoten(dneu, self)

    def InformationAusgeben(self):
        pass


class Liste:
    def __init__(self):
        self.anfang = Abschluss()

    def LaengeGeben(self):
        return self.anfang.LaengeGeben()

    def HintenEinfuegen(self, dneu):
        self.anfang = self.anfang.HintenEinfuegen(dneu)

    def InformationAusgeben(self):
        self.anfang.InformationAusgeben()
--- tests
import ast

def checks_in(*class_names):
    found = []
    for node in ast.parse(SOURCE).body:
        if isinstance(node, ast.ClassDef) and node.name in class_names:
            for n in ast.walk(node):
                if isinstance(n, (ast.If, ast.IfExp, ast.While)):
                    found.append(f"{node.name}, Zeile {n.lineno}")
    return found

def namen(l):
    out = []
    e = l.anfang
    while isinstance(e, Knoten) and len(out) < 30:
        out.append(e.daten.name)
        e = e.nachfolger
    return out

@test("HintenEinfuegen in die leere Liste")
def _():
    l = Liste()
    a = l.anfang
    l.HintenEinfuegen(Patient("Andi"))
    ok(isinstance(l.anfang, Knoten), "nach dem ersten HintenEinfuegen muss anfang ein Knoten sein (hat die Liste das zurückgegebene Element gespeichert?)")
    eq(namen(l), ["Andi"], "Liste")
    ok(l.anfang.nachfolger is a, "der nachfolger des neuen Knotens muss der (alte) Abschluss der Liste sein")

@test("HintenEinfuegen behält die Reihenfolge")
def _():
    l = Liste()
    for n in ["Andi", "Bert", "Clara", "Dora"]:
        l.HintenEinfuegen(Patient(n))
    eq(namen(l), ["Andi", "Bert", "Clara", "Dora"], "Liste")
    eq(l.LaengeGeben(), 4, "Länge")

@test("Nur ein Abschluss pro Liste")
def _():
    l = Liste()
    a = l.anfang
    for n in "ABC":
        l.HintenEinfuegen(Patient(n))
    e = l.anfang
    while isinstance(e, Knoten):
        e = e.nachfolger
    ok(e is a, "der Abschluss am Ende muss noch der ursprüngliche sein: return Knoten(dneu, self)")

@test("InformationAusgeben")
def _():
    l = Liste()
    eq(printed(l.InformationAusgeben).strip(), "", "Ausgabe für die leere Liste")
    for n in ["Andi", "Bert", "Clara"]:
        l.HintenEinfuegen(Patient(n))
    eq(lines(printed(l.InformationAusgeben)), ["Andi", "Bert", "Clara"], "ausgegebene Zeilen")

@test("Rekursiv und ohne if")
def _():
    l = Liste()
    for n in "ABC":
        l.HintenEinfuegen(Patient(n))
    r, rec = recursive(l.anfang.HintenEinfuegen, Patient("D"))
    ok(rec, "Knoten.HintenEinfuegen muss HintenEinfuegen seines nachfolgers aufrufen")
    f = checks_in("Knoten", "Abschluss", "Liste")
    ok(not f, "Kein if/while nötig. Gefunden: " + ", ".join(f))
--- hint
Knoten: `self.nachfolger = self.nachfolger.HintenEinfuegen(dneu)` und dann `return self`.
--- hint
Abschluss: `return Knoten(dneu, self)`. Liste: `self.anfang = self.anfang.HintenEinfuegen(dneu)`.
--- explain
Nur der Abschluss erzeugt Knoten. Jeder Knoten speichert, was sein Nachfolger zurückgibt, und gibt sich selbst zurück; die Liste speichert, was ihr erstes Element zurückgibt. Bei der leeren Liste antwortet der Abschluss der Liste direkt, und der neue Knoten wird `anfang`.
:::

:::exercise id=c4-bug title="Fehlersuche: der Absturz einen Aufruf später" level=2
Diese Liste stürzt ab, aber nicht dort, wo der Fehler steckt. Führ sie aus, lies die Fehlermeldung und finde die Zeile, die wirklich falsch ist.
--- starter
from abc import ABC, abstractmethod


class Listenelement(ABC):
    @abstractmethod
    def HintenEinfuegen(self, dneu):
        pass

    @abstractmethod
    def LaengeGeben(self):
        pass


class Knoten(Listenelement):
    def __init__(self, dneu, kneu):
        self.daten = dneu
        self.nachfolger = kneu

    def HintenEinfuegen(self, dneu):
        self.nachfolger = self.nachfolger.HintenEinfuegen(dneu)

    def LaengeGeben(self):
        return self.nachfolger.LaengeGeben() + 1


class Abschluss(Listenelement):
    def HintenEinfuegen(self, dneu):
        return Knoten(dneu, self)

    def LaengeGeben(self):
        return 0


class Liste:
    def __init__(self):
        self.anfang = Abschluss()

    def HintenEinfuegen(self, dneu):
        self.anfang = self.anfang.HintenEinfuegen(dneu)

    def LaengeGeben(self):
        return self.anfang.LaengeGeben()


l = Liste()
l.HintenEinfuegen("Andi")
l.HintenEinfuegen("Bert")
l.HintenEinfuegen("Clara")
print(l.LaengeGeben())
--- solution
from abc import ABC, abstractmethod


class Listenelement(ABC):
    @abstractmethod
    def HintenEinfuegen(self, dneu):
        pass

    @abstractmethod
    def LaengeGeben(self):
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


class Abschluss(Listenelement):
    def HintenEinfuegen(self, dneu):
        return Knoten(dneu, self)

    def LaengeGeben(self):
        return 0


class Liste:
    def __init__(self):
        self.anfang = Abschluss()

    def HintenEinfuegen(self, dneu):
        self.anfang = self.anfang.HintenEinfuegen(dneu)

    def LaengeGeben(self):
        return self.anfang.LaengeGeben()


l = Liste()
l.HintenEinfuegen("Andi")
l.HintenEinfuegen("Bert")
l.HintenEinfuegen("Clara")
print(l.LaengeGeben())
--- tests
@test("Das Programm gibt 3 aus")
def _():
    eq(OUTPUT.strip(), "3", "Ausgabe")

@test("Fünf Elemente")
def _():
    l2 = Liste()
    for n in "ABCDE":
        l2.HintenEinfuegen(n)
    eq(l2.LaengeGeben(), 5, "Länge")
--- hint
Die Fehlermeldung sagt `'NoneType' object has no attribute 'HintenEinfuegen'` in `Liste.HintenEinfuegen`. Also ist `self.anfang` gleich `None`. Wer hat `None` dort hineingeschrieben, und wann?
--- hint
Nimm **Visualisieren**: Schau, was `l.anfang` nach dem **zweiten** Aufruf ist.
--- explain
Der erste Aufruf klappt: Der Abschluss gibt einen Knoten zurück. Im zweiten Aufruf läuft `Knoten.HintenEinfuegen`, das kein `return` hat, also `None` zurückgibt, und die Liste speichert `None` als `anfang`. Der dritte Aufruf stürzt ab. Die Korrektur ist `return self` in `Knoten.HintenEinfuegen`.
:::

:::exercise id=c4-search title="Suchen, EndeGeben und AnfangEntfernen" level=2
Implementiere ohne jedes `if`, außer dem in `Knoten.Suchen` (den Schlüssel zu vergleichen ist die eigene Arbeit des Knotens):

- `Suchen(schluessel)`: gibt das erste Datenelement mit `SchluesselIstGleich(schluessel)` zurück, sonst `None`
- `EndeGeben(bisher)`: gibt die Information nach unten weiter (Logik, Punkt 4). `Liste.EndeGeben()` (ohne Parameter) gibt das Datenelement des letzten Knotens zurück, `None` bei einer leeren Liste
- `Liste.AnfangEntfernen()`: entfernt den ersten Knoten und gibt sein Datenelement zurück, `None` bei einer leeren Liste (mit `DatenelementGeben` und `NachfolgerGeben`)
--- starter
from abc import ABC, abstractmethod


class Patient:
    def __init__(self, name):
        self.name = name

    def SchluesselIstGleich(self, schluessel):
        return self.name == schluessel


class Listenelement(ABC):
    @abstractmethod
    def HintenEinfuegen(self, dneu):
        pass

    @abstractmethod
    def Suchen(self, schluessel):
        pass

    @abstractmethod
    def EndeGeben(self, bisher):
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

    def NachfolgerGeben(self):
        return self.nachfolger

    def DatenelementGeben(self):
        return self.daten

    def HintenEinfuegen(self, dneu):
        self.nachfolger = self.nachfolger.HintenEinfuegen(dneu)
        return self

    def Suchen(self, schluessel):
        pass

    def EndeGeben(self, bisher):
        pass


class Abschluss(Listenelement):
    def NachfolgerGeben(self):
        return self

    def DatenelementGeben(self):
        return None

    def HintenEinfuegen(self, dneu):
        return Knoten(dneu, self)

    def Suchen(self, schluessel):
        pass

    def EndeGeben(self, bisher):
        pass


class Liste:
    def __init__(self):
        self.anfang = Abschluss()

    def HintenEinfuegen(self, dneu):
        self.anfang = self.anfang.HintenEinfuegen(dneu)

    def Suchen(self, schluessel):
        pass

    def EndeGeben(self):
        pass

    def AnfangEntfernen(self):
        pass
--- solution
from abc import ABC, abstractmethod


class Patient:
    def __init__(self, name):
        self.name = name

    def SchluesselIstGleich(self, schluessel):
        return self.name == schluessel


class Listenelement(ABC):
    @abstractmethod
    def HintenEinfuegen(self, dneu):
        pass

    @abstractmethod
    def Suchen(self, schluessel):
        pass

    @abstractmethod
    def EndeGeben(self, bisher):
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

    def NachfolgerGeben(self):
        return self.nachfolger

    def DatenelementGeben(self):
        return self.daten

    def HintenEinfuegen(self, dneu):
        self.nachfolger = self.nachfolger.HintenEinfuegen(dneu)
        return self

    def Suchen(self, schluessel):
        if self.daten.SchluesselIstGleich(schluessel):
            return self.daten
        return self.nachfolger.Suchen(schluessel)

    def EndeGeben(self, bisher):
        return self.nachfolger.EndeGeben(self.daten)


class Abschluss(Listenelement):
    def NachfolgerGeben(self):
        return self

    def DatenelementGeben(self):
        return None

    def HintenEinfuegen(self, dneu):
        return Knoten(dneu, self)

    def Suchen(self, schluessel):
        return None

    def EndeGeben(self, bisher):
        return bisher


class Liste:
    def __init__(self):
        self.anfang = Abschluss()

    def HintenEinfuegen(self, dneu):
        self.anfang = self.anfang.HintenEinfuegen(dneu)

    def Suchen(self, schluessel):
        return self.anfang.Suchen(schluessel)

    def EndeGeben(self):
        return self.anfang.EndeGeben(None)

    def AnfangEntfernen(self):
        d = self.anfang.DatenelementGeben()
        self.anfang = self.anfang.NachfolgerGeben()
        return d
--- tests
import ast

def checks_in(*class_names):
    found = []
    for node in ast.parse(SOURCE).body:
        if isinstance(node, ast.ClassDef) and node.name in class_names:
            for n in ast.walk(node):
                if isinstance(n, (ast.If, ast.IfExp, ast.While)):
                    found.append(f"{node.name}, Zeile {n.lineno}")
    return found

def liste(*names):
    l = Liste()
    ps = [Patient(n) for n in names]
    for p in ps:
        l.HintenEinfuegen(p)
    return l, ps

@test("Suchen")
def _():
    l, ps = liste("Andi", "Bert", "Clara")
    ok(l.Suchen("Bert") is ps[1], "Suchen('Bert') muss das Patient-Objekt Bert zurückgeben")
    ok(l.Suchen("Clara") is ps[2], "Suchen('Clara')")
    eq(l.Suchen("Zoe"), None, "Suchen('Zoe')")
    eq(Liste().Suchen("X"), None, "Suchen in der leeren Liste")

@test("EndeGeben")
def _():
    l, ps = liste("Andi", "Bert", "Clara")
    ok(l.EndeGeben() is ps[2], "EndeGeben() muss Clara zurückgeben")
    l2, ps2 = liste("Andi")
    ok(l2.EndeGeben() is ps2[0], "EndeGeben() einer Liste mit einem Element")
    eq(Liste().EndeGeben(), None, "EndeGeben() der leeren Liste")

@test("AnfangEntfernen, auch bei der leeren Liste")
def _():
    l, ps = liste("Andi", "Bert")
    ok(l.AnfangEntfernen() is ps[0], "das erste AnfangEntfernen() muss Andi zurückgeben")
    ok(l.AnfangEntfernen() is ps[1], "das zweite AnfangEntfernen() muss Bert zurückgeben")
    ok(isinstance(l.anfang, Abschluss), "danach muss anfang wieder der Abschluss sein")
    eq(l.AnfangEntfernen(), None, "AnfangEntfernen() der leeren Liste")
    ok(isinstance(l.anfang, Abschluss), "die leere Liste muss intakt bleiben")

@test("Keine Prüfungen in Abschluss und Liste, EndeGeben ohne if")
def _():
    f = checks_in("Abschluss", "Liste")
    ok(not f, "Hier ist kein if/while nötig. Gefunden: " + ", ".join(f))
    for node in ast.parse(SOURCE).body:
        if isinstance(node, ast.ClassDef) and node.name == "Knoten":
            for fn in node.body:
                if isinstance(fn, ast.FunctionDef) and fn.name == "EndeGeben":
                    ok(not any(isinstance(n, ast.If) for n in ast.walk(fn)), "Knoten.EndeGeben: gib deine Daten nach unten weiter, kein if nötig")
--- hint
`Knoten.EndeGeben(bisher)`: `return self.nachfolger.EndeGeben(self.daten)`. Was soll der Abschluss zurückgeben?
--- hint
`AnfangEntfernen` sind drei Zeilen; bei der leeren Liste funktioniert es, weil der Abschluss `None` als Daten und sich selbst als Nachfolger zurückgibt.
--- explain
EndeGeben reicht die Daten jedes Knotens einen Schritt weiter; der Abschluss bekommt die Daten des letzten Knotens und gibt sie zurück. AnfangEntfernen braucht keine Prüfung, weil der Abschluss beide Fragen sinnvoll beantwortet.
:::

:::exercise id=c4-remove title="EndeEntfernen und KnotenEntfernen" level=3
Implementiere in allen drei Klassen (nur `Knoten` darf `if` enthalten):

- `EndeEntfernen()`: entfernt den letzten Knoten; `Liste.EndeEntfernen()` gibt sein Datenelement zurück (`None` bei einer leeren Liste). Verwende `EndeGeben` (gegeben).
- `KnotenEntfernen(dvergleich)`: entfernt den Knoten, dessen Datenelement `dvergleich` **ist**; gibt es ihn nicht, passiert nichts.
--- starter
from abc import ABC, abstractmethod


class Patient:
    def __init__(self, name):
        self.name = name


class Listenelement(ABC):
    @abstractmethod
    def LaengeGeben(self):
        pass

    @abstractmethod
    def HintenEinfuegen(self, dneu):
        pass

    @abstractmethod
    def EndeGeben(self, bisher):
        pass

    @abstractmethod
    def EndeEntfernen(self):
        pass

    @abstractmethod
    def KnotenEntfernen(self, dvergleich):
        pass


class Knoten(Listenelement):
    def __init__(self, dneu, kneu):
        self.daten = dneu
        self.nachfolger = kneu

    def LaengeGeben(self):
        return self.nachfolger.LaengeGeben() + 1

    def HintenEinfuegen(self, dneu):
        self.nachfolger = self.nachfolger.HintenEinfuegen(dneu)
        return self

    def EndeGeben(self, bisher):
        return self.nachfolger.EndeGeben(self.daten)

    def EndeEntfernen(self):
        pass

    def KnotenEntfernen(self, dvergleich):
        pass


class Abschluss(Listenelement):
    def LaengeGeben(self):
        return 0

    def HintenEinfuegen(self, dneu):
        return Knoten(dneu, self)

    def EndeGeben(self, bisher):
        return bisher

    def EndeEntfernen(self):
        pass

    def KnotenEntfernen(self, dvergleich):
        pass


class Liste:
    def __init__(self):
        self.anfang = Abschluss()

    def HintenEinfuegen(self, dneu):
        self.anfang = self.anfang.HintenEinfuegen(dneu)

    def EndeEntfernen(self):
        pass

    def KnotenEntfernen(self, dvergleich):
        pass
--- solution
from abc import ABC, abstractmethod


class Patient:
    def __init__(self, name):
        self.name = name


class Listenelement(ABC):
    @abstractmethod
    def LaengeGeben(self):
        pass

    @abstractmethod
    def HintenEinfuegen(self, dneu):
        pass

    @abstractmethod
    def EndeGeben(self, bisher):
        pass

    @abstractmethod
    def EndeEntfernen(self):
        pass

    @abstractmethod
    def KnotenEntfernen(self, dvergleich):
        pass


class Knoten(Listenelement):
    def __init__(self, dneu, kneu):
        self.daten = dneu
        self.nachfolger = kneu

    def LaengeGeben(self):
        return self.nachfolger.LaengeGeben() + 1

    def HintenEinfuegen(self, dneu):
        self.nachfolger = self.nachfolger.HintenEinfuegen(dneu)
        return self

    def EndeGeben(self, bisher):
        return self.nachfolger.EndeGeben(self.daten)

    def EndeEntfernen(self):
        if self.nachfolger.LaengeGeben() == 0:
            return self.nachfolger
        self.nachfolger = self.nachfolger.EndeEntfernen()
        return self

    def KnotenEntfernen(self, dvergleich):
        if self.daten == dvergleich:
            return self.nachfolger
        self.nachfolger = self.nachfolger.KnotenEntfernen(dvergleich)
        return self


class Abschluss(Listenelement):
    def LaengeGeben(self):
        return 0

    def HintenEinfuegen(self, dneu):
        return Knoten(dneu, self)

    def EndeGeben(self, bisher):
        return bisher

    def EndeEntfernen(self):
        return self

    def KnotenEntfernen(self, dvergleich):
        return self


class Liste:
    def __init__(self):
        self.anfang = Abschluss()

    def HintenEinfuegen(self, dneu):
        self.anfang = self.anfang.HintenEinfuegen(dneu)

    def EndeEntfernen(self):
        d = self.anfang.EndeGeben(None)
        self.anfang = self.anfang.EndeEntfernen()
        return d

    def KnotenEntfernen(self, dvergleich):
        self.anfang = self.anfang.KnotenEntfernen(dvergleich)
--- tests
import ast

def checks_in(*class_names):
    found = []
    for node in ast.parse(SOURCE).body:
        if isinstance(node, ast.ClassDef) and node.name in class_names:
            for n in ast.walk(node):
                if isinstance(n, (ast.If, ast.IfExp, ast.While)):
                    found.append(f"{node.name}, Zeile {n.lineno}")
    return found

def namen(l):
    out = []
    e = l.anfang
    while isinstance(e, Knoten) and len(out) < 30:
        out.append(e.daten.name)
        e = e.nachfolger
    return out

def liste(*names):
    l = Liste()
    ps = [Patient(n) for n in names]
    for p in ps:
        l.HintenEinfuegen(p)
    return l, ps

@test("EndeEntfernen")
def _():
    l, ps = liste("A", "B", "C")
    ok(l.EndeEntfernen() is ps[2], "EndeEntfernen() muss C zurückgeben")
    eq(namen(l), ["A", "B"], "rest")
    ok(l.EndeEntfernen() is ps[1], "EndeEntfernen() muss B zurückgeben")
    ok(l.EndeEntfernen() is ps[0], "EndeEntfernen() muss A zurückgeben")
    ok(isinstance(l.anfang, Abschluss), "die Liste muss leer sein (anfang ist der Abschluss)")
    eq(l.EndeEntfernen(), None, "EndeEntfernen() der leeren Liste")
    ok(isinstance(l.anfang, Abschluss), "die leere Liste muss intakt bleiben")

@test("KnotenEntfernen vorne, in der Mitte, am Ende")
def _():
    l, ps = liste("A", "B", "C", "D")
    l.KnotenEntfernen(ps[1])
    eq(namen(l), ["A", "C", "D"], "nach dem Entfernen von B")
    l.KnotenEntfernen(ps[0])
    eq(namen(l), ["C", "D"], "nach dem Entfernen von A")
    l.KnotenEntfernen(ps[3])
    eq(namen(l), ["C"], "nach dem Entfernen von D")
    l.KnotenEntfernen(Patient("C"))
    eq(namen(l), ["C"], "das Entfernen eines anderen Objekts mit demselben Namen ändert nichts")
    l.KnotenEntfernen(ps[2])
    ok(isinstance(l.anfang, Abschluss), "nach dem Entfernen von C muss die Liste leer sein")

@test("Keine Prüfungen in Abschluss und Liste")
def _():
    f = checks_in("Abschluss", "Liste")
    ok(not f, "Hier ist kein if/while nötig. Gefunden: " + ", ".join(f))
--- hint
`Knoten.EndeEntfernen`: „Ist der Rest hinter mir leer (`self.nachfolger.LaengeGeben() == 0`), bin ich der letzte Knoten: gib meinen Nachfolger zurück. Sonst …“
--- hint
`Abschluss.EndeEntfernen` und `Abschluss.KnotenEntfernen`: Am Ende gibt es nichts zu tun, also `return self`.
--- explain
Beide Methoden verwenden das Muster „gib zurück, was an meiner Stelle stehen soll“. Der Abschluss gibt sich selbst zurück (nichts ändert sich); der zu entfernende Knoten gibt seinen Nachfolger zurück; jeder andere Knoten speichert den neuen Rest und gibt sich selbst zurück.
:::

:::exercise id=c4-insert title="EinfuegenVor und SortiertEinfuegen" level=3
Implementiere beide Methoden in allen drei Klassen (nur `Knoten` darf `if` enthalten). Gibt es `dvergleich` nicht, hängt `EinfuegenVor` `dneu` hinten an. `SortiertEinfuegen` verwendet `IstKleinerAls`.
--- starter
from abc import ABC, abstractmethod


class Patient:
    def __init__(self, name):
        self.name = name

    def IstKleinerAls(self, dvergleich):
        return self.name < dvergleich.name


class Listenelement(ABC):
    @abstractmethod
    def EinfuegenVor(self, dneu, dvergleich):
        pass

    @abstractmethod
    def SortiertEinfuegen(self, dneu):
        pass


class Knoten(Listenelement):
    def __init__(self, dneu, kneu):
        self.daten = dneu
        self.nachfolger = kneu

    def EinfuegenVor(self, dneu, dvergleich):
        pass

    def SortiertEinfuegen(self, dneu):
        pass


class Abschluss(Listenelement):
    def EinfuegenVor(self, dneu, dvergleich):
        pass

    def SortiertEinfuegen(self, dneu):
        pass


class Liste:
    def __init__(self):
        self.anfang = Abschluss()

    def EinfuegenVor(self, dneu, dvergleich):
        pass

    def SortiertEinfuegen(self, dneu):
        pass
--- solution
from abc import ABC, abstractmethod


class Patient:
    def __init__(self, name):
        self.name = name

    def IstKleinerAls(self, dvergleich):
        return self.name < dvergleich.name


class Listenelement(ABC):
    @abstractmethod
    def EinfuegenVor(self, dneu, dvergleich):
        pass

    @abstractmethod
    def SortiertEinfuegen(self, dneu):
        pass


class Knoten(Listenelement):
    def __init__(self, dneu, kneu):
        self.daten = dneu
        self.nachfolger = kneu

    def EinfuegenVor(self, dneu, dvergleich):
        if self.daten == dvergleich:
            return Knoten(dneu, self)
        self.nachfolger = self.nachfolger.EinfuegenVor(dneu, dvergleich)
        return self

    def SortiertEinfuegen(self, dneu):
        if self.daten.IstKleinerAls(dneu):
            self.nachfolger = self.nachfolger.SortiertEinfuegen(dneu)
            return self
        return Knoten(dneu, self)


class Abschluss(Listenelement):
    def EinfuegenVor(self, dneu, dvergleich):
        return Knoten(dneu, self)

    def SortiertEinfuegen(self, dneu):
        return Knoten(dneu, self)


class Liste:
    def __init__(self):
        self.anfang = Abschluss()

    def EinfuegenVor(self, dneu, dvergleich):
        self.anfang = self.anfang.EinfuegenVor(dneu, dvergleich)

    def SortiertEinfuegen(self, dneu):
        self.anfang = self.anfang.SortiertEinfuegen(dneu)
--- tests
import ast

def checks_in(*class_names):
    found = []
    for node in ast.parse(SOURCE).body:
        if isinstance(node, ast.ClassDef) and node.name in class_names:
            for n in ast.walk(node):
                if isinstance(n, (ast.If, ast.IfExp, ast.While)):
                    found.append(f"{node.name}, Zeile {n.lineno}")
    return found

def namen(l):
    out = []
    e = l.anfang
    while isinstance(e, Knoten) and len(out) < 30:
        out.append(e.daten.name)
        e = e.nachfolger
    return out

@test("SortiertEinfuegen in beliebiger Reihenfolge")
def _():
    l = Liste()
    for n in ["Dora", "Bert", "Emil", "Andi", "Clara"]:
        l.SortiertEinfuegen(Patient(n))
    eq(namen(l), ["Andi", "Bert", "Clara", "Dora", "Emil"], "Liste")

@test("EinfuegenVor: vorne, Mitte, fehlendes Element, leere Liste")
def _():
    l = Liste()
    b = Patient("Bert")
    l.SortiertEinfuegen(b)
    l.EinfuegenVor(Patient("Andi"), b)
    eq(namen(l), ["Andi", "Bert"], "vor dem ersten Element")
    l.EinfuegenVor(Patient("Zoe"), Patient("X"))
    eq(namen(l), ["Andi", "Bert", "Zoe"], "fehlendes Element: anhängen")
    l.EinfuegenVor(Patient("Clara"), b)
    eq(namen(l), ["Andi", "Clara", "Bert", "Zoe"], "vor Bert")
    l2 = Liste()
    l2.EinfuegenVor(Patient("A"), Patient("X"))
    eq(namen(l2), ["A"], "leere Liste")

@test("Der Abschluss bleibt am Ende")
def _():
    l = Liste()
    a = l.anfang
    for n in ["C", "A", "B"]:
        l.SortiertEinfuegen(Patient(n))
    e = l.anfang
    while isinstance(e, Knoten):
        e = e.nachfolger
    ok(e is a, "der ursprüngliche Abschluss der Liste muss hinter dem letzten Knoten stehen")

@test("Keine Prüfungen in Abschluss und Liste")
def _():
    f = checks_in("Abschluss", "Liste")
    ok(not f, "Hier ist kein if/while nötig. Gefunden: " + ", ".join(f))
--- hint
Der Abschluss beantwortet beide Methoden gleich: Das neue Element kommt hinter den letzten Knoten, also vor den Abschluss.
--- explain
Vergleiche mit C3: Der Fall „kein Nachfolger → HintenEinfuegen“ ist in den Abschluss gewandert. Nur die eigene Entscheidung des Knotens (gefunden? / kleiner?) bleibt als `if` übrig.
:::

:::exercise id=c4-files title="Transfer: Ordner und Dateien als Kompositum" level=3
Implementiere das Dateisystem aus dem Logik-Abschnitt:

- `Element` (abstrakt) mit dem Attribut `name` und den abstrakten Methoden `GroesseGeben()` und `AnzahlDateienGeben()`
- `Datei(name, groesse)`: Blatt
- `Ordner(name)`: Kompositum mit einer Python-Liste `self.inhalt`, der Methode `Hinzufuegen(e)` (gibt nichts zurück) und beiden Methoden rekursiv: Die Größe eines Ordners ist die Summe der Größen seines Inhalts, ein leerer Ordner hat Größe 0 und enthält 0 Dateien
--- starter
from abc import ABC, abstractmethod


class Element(ABC):
    def __init__(self, name):
        self.name = name

    @abstractmethod
    def GroesseGeben(self):
        pass

    @abstractmethod
    def AnzahlDateienGeben(self):
        pass


class Datei(Element):
    def __init__(self, name, groesse):
        super().__init__(name)
        self.groesse = groesse


class Ordner(Element):
    def __init__(self, name):
        super().__init__(name)
        self.inhalt = []


schule = Ordner("Schule")
info = Ordner("Informatik")
info.Hinzufuegen(Datei("Rekursion.pdf", 300))
info.Hinzufuegen(Datei("Listen.pdf", 450))
schule.Hinzufuegen(info)
schule.Hinzufuegen(Datei("Stundenplan.png", 120))
print(schule.GroesseGeben(), schule.AnzahlDateienGeben())
--- solution
from abc import ABC, abstractmethod


class Element(ABC):
    def __init__(self, name):
        self.name = name

    @abstractmethod
    def GroesseGeben(self):
        pass

    @abstractmethod
    def AnzahlDateienGeben(self):
        pass


class Datei(Element):
    def __init__(self, name, groesse):
        super().__init__(name)
        self.groesse = groesse

    def GroesseGeben(self):
        return self.groesse

    def AnzahlDateienGeben(self):
        return 1


class Ordner(Element):
    def __init__(self, name):
        super().__init__(name)
        self.inhalt = []

    def Hinzufuegen(self, e):
        self.inhalt.append(e)

    def GroesseGeben(self):
        summe = 0
        for e in self.inhalt:
            summe += e.GroesseGeben()
        return summe

    def AnzahlDateienGeben(self):
        anzahl = 0
        for e in self.inhalt:
            anzahl += e.AnzahlDateienGeben()
        return anzahl


schule = Ordner("Schule")
info = Ordner("Informatik")
info.Hinzufuegen(Datei("Rekursion.pdf", 300))
info.Hinzufuegen(Datei("Listen.pdf", 450))
schule.Hinzufuegen(info)
schule.Hinzufuegen(Datei("Stundenplan.png", 120))
print(schule.GroesseGeben(), schule.AnzahlDateienGeben())
--- tests
@test("Das Beispiel gibt 870 3 aus")
def _():
    eq(OUTPUT.strip(), "870 3", "Ausgabe")

@test("Leerer Ordner und verschachtelte Ordner")
def _():
    o = Ordner("leer")
    eq(o.GroesseGeben(), 0, "Größe eines leeren Ordners")
    eq(o.AnzahlDateienGeben(), 0, "Dateien in einem leeren Ordner")
    a = Ordner("a"); b = Ordner("b"); c = Ordner("c")
    c.Hinzufuegen(Datei("x", 5))
    b.Hinzufuegen(c); b.Hinzufuegen(Datei("y", 7))
    a.Hinzufuegen(b); a.Hinzufuegen(Ordner("leer")); a.Hinzufuegen(Datei("z", 1))
    eq(a.GroesseGeben(), 13, "Größe von a (drei Ebenen tief)")
    eq(a.AnzahlDateienGeben(), 3, "Anzahl der Dateien in a")

@test("Polymorphie statt Typprüfungen")
def _():
    ok("isinstance" not in SOURCE and "type(" not in SOURCE, "Lass jedes Element selbst antworten: e.GroesseGeben(), keine isinstance/type-Prüfungen")
    try:
        Element("x")
        ok(False, "Element muss abstrakt bleiben")
    except TypeError:
        pass
--- hint
`Datei.GroesseGeben()` gibt die eigene Größe zurück (Blatt). `Ordner.GroesseGeben()` fragt jedes Element von `self.inhalt` und addiert die Antworten.
--- hint
Ein leerer Ordner: Die Schleife läuft null Mal, die Summe bleibt 0; das ist das Rekursionsende ohne zusätzliches `if`.
--- explain
Der Ordner weiß nicht, ob ein Element eine Datei oder ein Ordner ist; er schickt einfach `GroesseGeben()`. Ein Ordner im Ordner antwortet rekursiv, eine Datei antwortet direkt. Eine Kette (Liste) und ein Baum (Dateisystem) sind zwei Formen desselben Musters.
:::

## [exam] Klausurtraining

::::exam title="Klassendiagramm" points=5
Zeichne das Klassendiagramm einer einfach verketteten Liste, die Objekte der Klasse PATIENT speichert und mit dem Entwurfsmuster Kompositum umgesetzt ist. Benenne die Rollen des Musters.
--- solution
:::diagram classes
class LISTE @0,0 | anfang: LISTENELEMENT | HintenEinfügen(p: PATIENT); LängeGeben(): GANZZAHL
abstract LISTENELEMENT @1.4,0 | | HintenEinfügen(p): LISTENELEMENT {abstract}; LängeGeben(): GANZZAHL {abstract}
class KNOTEN @0.9,1.2 | daten: PATIENT; nachfolger: LISTENELEMENT | HintenEinfügen(p): LISTENELEMENT; LängeGeben(): GANZZAHL
class ABSCHLUSS @2.1,1.2 | | HintenEinfügen(p): LISTENELEMENT; LängeGeben(): GANZZAHL
class PATIENT @0,2.3 | name | InformationAusgeben()
assoc LISTE -> LISTENELEMENT : anfang [1]
inherit KNOTEN -> LISTENELEMENT
inherit ABSCHLUSS -> LISTENELEMENT
assoc KNOTEN -> LISTENELEMENT : nachfolger [1]
assoc KNOTEN -> PATIENT : daten [1]
:::

Rollen: LISTENELEMENT = Komponente (abstrakt), KNOTEN = Kompositum, ABSCHLUSS = Blatt, LISTE = Klient. Punkte gibt es meist für: abstrakte Oberklasse, beide Vererbungspfeile, die Assoziation KNOTEN → LISTENELEMENT (nicht → KNOTEN!), Multiplizität 1, Datenklasse an KNOTEN angebunden.
::::

::::exam title="Objektdiagramm" points=3
Zeichne das Objektdiagramm einer Liste (Kompositum) nach `HintenEinfügen(Andi)`, `HintenEinfügen(Bert)` auf einer leeren Liste.
--- solution
:::diagram objects
l: LISTE @0,0 | anfang -> k1
k1: KNOTEN @1,0 | daten -> p1 | nachfolger -> k2
k2: KNOTEN @2.15,0 | daten -> p2 | nachfolger -> a
a: ABSCHLUSS @3.3,0
p1: PATIENT @1,1.15 | name = "Andi"
p2: PATIENT @2.15,1.15 | name = "Bert"
:::
Genau ein ABSCHLUSS, am Ende; kein Attribut hat den Wert nichts.
::::

::::exam title="Sequenzdiagramm für HintenEinfügen" points=5
Zeichne das Sequenzdiagramm für `HintenEinfügen(p)` bei einer Liste, die genau einen Knoten k1 enthält. Beschrifte die Rückgabewerte.
--- solution
:::diagram seq
actors: Aufrufer | l: LISTE | k1: KNOTEN | a: ABSCHLUSS | kNeu: KNOTEN
Aufrufer -> l: HintenEinfügen(p)
l -> k1: HintenEinfügen(p)
k1 -> a: HintenEinfügen(p)
a -> kNeu: «neu» KNOTEN(p, a)
kNeu --> a: kNeu
a --> k1: kNeu
k1 --> l: k1
l --> Aufrufer: 
:::
k1 speichert kNeu als seinen nachfolger und gibt sich selbst zurück; die Liste speichert k1 als anfang.
::::

:::exam title="Methoden ergänzen" points=6
Eine Liste von PATIENT-Objekten (Kompositum) soll eine Methode `AnzahlGeben(buchstabe)` bekommen, die zurückgibt, wie viele Patienten einen Namen haben, der mit `buchstabe` beginnt. PATIENT hat eine Methode `NameGeben()`. Schreib die Methode für LISTE, KNOTEN und ABSCHLUSS in Pseudocode oder Python.
--- solution
```python
# Liste
def AnzahlGeben(self, buchstabe):
    return self.anfang.AnzahlGeben(buchstabe)

# Knoten
def AnzahlGeben(self, buchstabe):
    rest = self.nachfolger.AnzahlGeben(buchstabe)
    if self.daten.NameGeben()[0] == buchstabe:
        return rest + 1
    return rest

# Abschluss
def AnzahlGeben(self, buchstabe):
    return 0
```
Der ABSCHLUSS ist das Rekursionsende (0 Patienten hinter dem Ende). Jeder Knoten addiert 1, wenn sein eigener Patient passt. Vergiss nicht die abstrakte Methode `AnzahlGeben` in LISTENELEMENT.
:::

:::exam title="Vorteile des Kompositums" points=4
Erkläre zwei Vorteile des Kompositums gegenüber der Liste aus C3 (Ende mit nichts markiert). Erkläre, warum `ABSCHLUSS.NachfolgerGeben()` den ABSCHLUSS selbst zurückgibt.
--- solution
- **Keine Prüfungen auf nichts**: Weder LISTE (leere Liste?) noch KNOTEN (letzter Knoten?) muss prüfen; jeder Nachfolger versteht jede Nachricht. Kürzere Methoden, weniger Fehler (kein AttributeError bei None).
- **Klares Rekursionsende**: Die Rekursion endet immer im ABSCHLUSS; die Fallunterscheidung erledigt die Polymorphie (die Klasse des Objekts), nicht ein `falls`.
- **Leicht erweiterbar**: Eine neue Methode heißt eine kurze Methode pro Klasse; die Struktur bleibt dieselbe.

`NachfolgerGeben()` gibt `selbst` zurück: `AnfangEntfernen()` setzt `anfang = anfang.NachfolgerGeben()`. Bei einer leeren Liste ist `anfang` der ABSCHLUSS; er gibt sich selbst zurück, die Liste bleibt also ohne Prüfung eine gültige leere Liste (anfang = ABSCHLUSS).
:::
