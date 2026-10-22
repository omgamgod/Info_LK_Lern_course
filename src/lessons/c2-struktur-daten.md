---
id: c2
num: C2
part: C
title: Trennung von Struktur und Daten
short: Struktur & Daten
lead: In C1 kannte ein Patient seinen Nachfolger in der Warteschlange; eine Patientenakte enthielt also Informationen über ein Wartezimmer. Diese Lektion trennt beides. Eine Klasse KNOTEN trägt die Struktur, die Datenklassen tragen nur Daten, und ein abstraktes DATENELEMENT beschreibt, was die Struktur von ihren Daten erwarten darf. Das Abitur 2020 fragt genau nach diesem Konzept.
minutes: 75
uses: [c1, a9]
goals:
  - erklären, warum die Vermischung von Struktur und Daten ein Projekt schwer änderbar macht (Handball-Projekt, Schulbibliothek)
  - eine Warteschlange mit den Klassen WARTESCHLANGE, KNOTEN und einer Datenklasse modellieren
  - das Konzept und seine Vorteile nennen (Abitur 2020, Kinoverwaltung)
  - eine abstrakte Klasse DATENELEMENT verwenden, damit die Struktur für jede Art von Daten funktioniert
  - die Idee der Trennung nach Aufgabenbereichen beschreiben, einschließlich MVC
---

## [logic] Wenn eine Klasse alles macht (12_II_2_Einstieg)

Das Handball-Projekt deines Kurses (`A00_Handball.py`) verwaltet ein ganzes Spiel in **einer Klasse** `Handballspiel` mit mehr als zwanzig Attributen: `spielerMannschaft1`, `spielerMannschaft2`, `torMinuteMannschaft1`, `torSpielerMannschaft1`, `siebenmeterMinuteMannschaft2`, `istSiebenmeterTrefferMannschaft2`, … Jede Methode beginnt mit derselben Fallunterscheidung:

```python
if mannschaft_neu == self.mannschaft1:
    self.torSpielerMannschaft1.append(spieler_neu)
    self.torMinuteMannschaft1.append(minute_neu)
elif mannschaft_neu == self.mannschaft2:
    ...
```

**Warum ist das schlecht?** (Aufgabe b)

- Alles, was zu *einer* Mannschaft gehört, ist auf viele parallele Listen verteilt. Index 3 von `torMinuteMannschaft1` gehört zu Index 3 von `torSpielerMannschaft1`, und nichts im Programm garantiert das.
- Jede neue Funktion (gelbe Karten, ein dritter Schiedsrichter, Statistik pro Spieler) bedeutet Änderungen an **vielen Stellen** derselben Klasse.
- Mehrere Entwickler müssten alle gleichzeitig an dieser einen Klasse arbeiten.
- Der Code für Mannschaft 1 und Mannschaft 2 ist doppelt vorhanden, also gibt es jeden Fehler zweimal.

**Besser** (Aufgabe c): eine Klasse pro Aufgabenbereich. Eine Mannschaft ist ein Objekt, das seine Spieler und Offiziellen verwaltet; ein Ereignis (Tor, Siebenmeter, Zwei-Minuten-Strafe, Auszeit) ist ein Objekt mit einer Minute und einem Spieler; das Spiel verbindet nur Mannschaften und Ereignisse.

:::diagram classes caption="Ein mögliches Klassendiagramm für das Handball-Projekt"
class HANDBALLSPIEL @0.5,0 | termin; liga; spielort | EreignisEintragen(e: EREIGNIS); ToreGeben(m: MANNSCHAFT): GANZZAHL
class MANNSCHAFT @0,1.1 | name | SpielerAufnehmen(s: SPIELER)
class SPIELER @0,2.15 | name; nummer |
abstract EREIGNIS @1.6,1.1 | minute; mannschaft | InformationAusgeben()
class TOR @1.1,2.15 | |
class SIEBENMETER @1.75,2.15 | istTreffer |
class STRAFE @2.4,2.15 | dauer |
assoc HANDBALLSPIEL -> MANNSCHAFT : spielt [2]
assoc MANNSCHAFT -> SPIELER : kader [*]
assoc HANDBALLSPIEL -> EREIGNIS : ereignisse [*]
inherit TOR -> EREIGNIS
inherit SIEBENMETER -> EREIGNIS
inherit STRAFE -> EREIGNIS
:::

Dieses Prinzip heißt **Trennung nach Aufgabenbereichen**: Jede Klasse hat *eine* klare Aufgabe.

### Dieselbe Idee in einer Datenbanktabelle (Aufgabe 3)

Eine Schulbibliothek speichert jede Ausleihe in einer einzigen Tabelle `Entleihvorgang(buchtitel, buchautor, verlag, jahr, autor1, autor2, entleihername, entleiherklasse, entleihdatum, rückgabedatum)`. Probleme:

- **Redundanz**: Titel, Verlag und Jahr werden bei jeder Ausleihe desselben Buchs erneut gespeichert; die Klasse eines Entleihers wird bei jeder Ausleihe wiederholt.
- **Anomalien**: Wechselt ein Schüler die Klasse, muss jede Zeile geändert werden (vergisst man eine, sind die Daten widersprüchlich); ein Buch, das nie ausgeliehen wurde, lässt sich gar nicht speichern; löscht man die letzte Ausleihe eines Buchs, sind auch die Buchdaten weg.
- **Starre Struktur**: `autor1`, `autor2` erlauben höchstens zwei Autoren.
- **Vermischte Zuständigkeiten**: Buchdaten, Personendaten und Ausleihdaten haben nichts miteinander zu tun.

:::diagram classes caption="Nach Aufgabenbereichen getrennt"
class BUCH @0,0 | titel; verlag; jahr |
class AUTOR @0,1.05 | name |
class ENTLEIHVORGANG @1.3,0 | entleihdatum; rückgabedatum | RückgabeEintragen(datum)
class ENTLEIHER @2.6,0 | name; klasse |
assoc BUCH -> AUTOR : geschrieben von [1..*]
assoc ENTLEIHVORGANG -> BUCH : betrifft [1]
assoc ENTLEIHVORGANG -> ENTLEIHER : von [1]
:::

## [logic] Struktur und Daten in der Warteschlange

Schau dir die Klasse `PATIENT` aus C1 an: `name` sind Patientendaten, aber `nachfolger` und `NachfolgerSetzen` betreffen das **Warten in einer Schlange**. Eine Patientenakte hat mit Warteschlangen nichts zu tun. Die Folgen:

- Die Warteschlange funktioniert nur für Patienten. Eine Waschstraße (`A00_Waschstrasse.py`) braucht dieselbe Warteschlange für Autos: den ganzen Code nach `AUTO` kopieren?
- Ein Patient kann immer nur in **einer** Warteschlange stehen, weil er nur einen `nachfolger` hat.

**Lösung**: Eine zusätzliche Klasse **KNOTEN** trägt die Struktur. Ein Knoten kennt seinen Nachfolgerknoten und **verweist auf** ein Datenobjekt. Die Warteschlange kennt nur Knoten; die Datenklasse weiß nichts von irgendeiner Liste.

:::diagram classes caption="Struktur (WARTESCHLANGE, KNOTEN) und Daten (PATIENT) getrennt"
class WARTESCHLANGE @0,0 | anfang: KNOTEN; ende: KNOTEN | Einfügen(d: PATIENT); Entfernen(): PATIENT
class KNOTEN @1.45,0 | nachfolger: KNOTEN; daten: PATIENT | NachfolgerGeben(): KNOTEN; NachfolgerSetzen(k: KNOTEN); DatenelementGeben(): PATIENT
class PATIENT @1.45,1.25 | name | NameGeben(); InformationAusgeben()
assoc WARTESCHLANGE -> KNOTEN : anfang, ende [0..1]
assoc KNOTEN -> KNOTEN : nachfolger [0..1]
assoc KNOTEN -> PATIENT : daten [1]
:::

:::diagram objects caption="Objektdiagramm: Jeder Knoten zeigt auf seinen Patienten und auf den nächsten Knoten"
w: WARTESCHLANGE @0,0 | anfang -> k1 | ende -> k2
k1: KNOTEN @1,0 | daten -> p1 | nachfolger -> k2
k2: KNOTEN @2.2,0 | daten -> p2 | nachfolger = None
p1: PATIENT @1,1.2 | name = "Andi"
p2: PATIENT @2.2,1.2 | name = "Bert"
:::

Die Operationen bleiben dieselben wie in C1, nur erzeugt `Einfügen` jetzt zuerst einen Knoten für die Daten, und `Entfernen` gibt die **Daten** des ersten Knotens zurück (der Aufrufer will den Patienten, nicht den Knoten).

:::viz listops
{"mode": "qknoten", "init": ["Andi", "Bert"]}
:::

### Abitur 2020: die Kinoverwaltung (12_II_2_Aufgabe_5)

*Das Kino „Altstadtklotz“ möchte ein Bewertungssystem. Vorgeschlagen wurde, die Bewertungen in einer gemeinsamen Liste für alle Filme zu verwalten, auf Grundlage des folgenden Klassendiagramms:*

:::diagram classes
class BEWERTUNGSLISTE @0,0 | |
class KNOTEN @1.3,0 | |
class BEWERTUNG @1.3,1.05 | |
assoc BEWERTUNGSLISTE -> KNOTEN : anfang [0,1]
assoc KNOTEN -> KNOTEN : nachfolger [0,1]
assoc KNOTEN -> BEWERTUNG : inhalt [1]
:::

*Die Entwickler haben sich entschieden, die Bewertungen nicht direkt, sondern über eine zusätzliche Klasse KNOTEN zu verketten. Nenne das zugrunde liegende Konzept und zwei Vorteile.*

:::key title="Musterantwort"
Konzept: **Trennung von Struktur und Daten**. Vorteile (zwei beliebige):

1. Die Listenstruktur (BEWERTUNGSLISTE, KNOTEN) lässt sich **ohne Änderungen für jede Art von Daten wiederverwenden**: Dieselben Klassen könnten Filme, Kunden oder Tickets verwalten.
2. Die Datenklasse BEWERTUNG bleibt einfach und enthält **nur Daten**, ohne `nachfolger` und ohne Listenmethoden.
3. Struktur und Daten können **unabhängig voneinander entwickelt, geändert und getestet** werden (z. B. von verschiedenen Teammitgliedern). Eine Änderung der Listenimplementierung betrifft BEWERTUNG nicht und umgekehrt.
4. Ein Datenobjekt kann **gleichzeitig in mehreren Strukturen** vorkommen (z. B. in einer Liste pro Film und in der gemeinsamen Liste), weil es selbst keinen `nachfolger` trägt.
:::

## [logic] Was darf ein Knoten von seinen Daten erwarten? DATENELEMENT

Ein Knoten ruft Methoden seiner Daten auf, zum Beispiel `daten.InformationAusgeben()`, wenn die Warteschlange ausgegeben wird, oder `daten.SchlüsselIstGleich(schlüssel)`, wenn sie durchsucht wird. Damit sicher jede Datenklasse diese Methoden anbietet, werden sie in einer abstrakten Klasse (oder Schnittstelle) **DATENELEMENT** festgelegt, und alle Datenklassen erben davon (Lektion A9).

:::diagram classes caption="Die Struktur kennt nur das abstrakte DATENELEMENT"
class WARTESCHLANGE @0,0 | anfang; ende | Einfügen(d: DATENELEMENT); Entfernen(): DATENELEMENT
class KNOTEN @1.5,0 | nachfolger: KNOTEN; daten: DATENELEMENT | DatenelementGeben(): DATENELEMENT
abstract DATENELEMENT @1.5,1.15 | | InformationAusgeben() {abstract}; SchlüsselIstGleich(s): WAHRHEITSWERT {abstract}
class PATIENT @0.8,2.2 | name |
class AUTO @2.2,2.2 | kennzeichen |
assoc WARTESCHLANGE -> KNOTEN : anfang, ende
assoc KNOTEN -> KNOTEN : nachfolger
assoc KNOTEN -> DATENELEMENT : daten
inherit PATIENT -> DATENELEMENT
inherit AUTO -> DATENELEMENT
:::

Python würde auch ohne DATENELEMENT laufen (jedes Objekt mit den richtigen Methoden funktioniert, das nennt man *Duck Typing*). Die abstrakte Klasse ist trotzdem wichtig: Sie **dokumentiert die Vereinbarung**, und Python weigert sich, ein Datenobjekt zu erzeugen, dem eine geforderte Methode fehlt.

**Waschstraße → Einwohnermeldeamt (Einstieg 2)**: Mit diesem Entwurf braucht es **keine Änderung** an WARTESCHLANGE und KNOTEN, um aus der Warteschlange der Waschstraße eine Warteschlange von Bürgern zu machen. Nur eine neue Datenklasse BÜRGER wird geschrieben (und in der Vorlage würde man ein paar Attributnamen wie `self.auto` idealerweise in das neutrale `self.daten` umbenennen).

## [logic] Model – View – Controller (Aufgabe 7)

Programme mit grafischer Oberfläche werden oft nach dem Entwurfsmuster **MVC** gebaut:

- **Model**: die Daten und die Logik (z. B. WARTESCHLANGE, KNOTEN, PATIENT),
- **View**: die Darstellung (z. B. die Klasse `Darstellung` in `A02_Arzt.py`, die das Wartezimmer zeichnet),
- **Controller**: reagiert auf Benutzereingaben (Klicks auf Knöpfe) und sagt dem Model, was zu tun ist; die View zeigt danach den neuen Zustand.

Wieder dieselbe Idee: Jeder Teil hat einen Aufgabenbereich. Das Model weiß nicht, wie es dargestellt wird; man könnte die grafische Ansicht also durch eine Textausgabe ersetzen, ohne die Warteschlange anzufassen.

## [bridge] Vom Klassendiagramm zu Python

:::bridge title="Warteschlange mit KNOTEN (wie in A00_Waschstrasse.py)"
klasse KNOTEN                            || class Knoten:
  Konstruktor KNOTEN(d)                  ||     def __init__(self, d):
    nachfolger = nichts                  ||         self.nachfolger = None
    daten = d                            ||         self.daten = d
  methode DatenelementGeben()            ||     def DatenelementGeben(self):
    return daten                         ||         return self.daten
                                         ||
methode Einfügen(d)  // in WARTESCHLANGE ||     def Einfügen(self, d):
  k = neu KNOTEN(d)                      ||         k = Knoten(d)
  falls anfang == nichts dann            ||         if self.anfang is None:
    anfang = k                           ||             self.anfang = k
  sonst                                  ||         else:
    ende.NachfolgerSetzen(k)             ||             self.ende.NachfolgerSetzen(k)
  ende = k                               ||         self.ende = k
                                         ||
methode Entfernen() -> DATENELEMENT      ||     def Entfernen(self):
  falls anfang == nichts dann return nichts ||         if self.anfang is None:
                                         ||             return None
  k = anfang                             ||         k = self.anfang
  anfang = anfang.NachfolgerGeben()      ||         self.anfang = self.anfang.NachfolgerGeben()
  falls anfang == nichts dann ende = nichts ||         if self.anfang is None:
                                         ||             self.ende = None
  return k.DatenelementGeben()           ||         return k.DatenelementGeben()
>> Verglichen mit C1 ändern sich nur zwei Dinge: `Einfügen` verpackt die Daten in einen neuen Knoten, und `Entfernen` gibt `k.DatenelementGeben()` zurück, also die Daten und nicht den Knoten.
:::

## [python] Python-Blöcke

:::exercise id=c2-node title="KNOTEN und eine Warteschlange für beliebige Daten" level=1
Schreib die Klasse `Knoten` (Konstruktor mit `d`, Attribute `daten` und `nachfolger`, Methoden `NachfolgerSetzen`, `NachfolgerGeben`, `DatenelementGeben`) und vervollständige die Warteschlange: `Einfügen(d)` verpackt `d` in einen neuen Knoten; `Entfernen()` gibt das **Datenelement** des ersten Knotens zurück (oder `None`).
--- starter
class Knoten:
    pass


class Warteschlange:
    def __init__(self):
        self.anfang = None
        self.ende = None

    def Einfügen(self, d):
        pass

    def Entfernen(self):
        pass
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
--- tests
class Patient:
    def __init__(self, n):
        self.name = n

class Auto:
    def __init__(self, k):
        self.kennzeichen = k

@test("Knoten speichert Daten und Nachfolger")
def _():
    k = Knoten("x")
    eq((k.DatenelementGeben(), k.NachfolgerGeben()), ("x", None), "(DatenelementGeben(), NachfolgerGeben())")
    k2 = Knoten("y")
    k.NachfolgerSetzen(k2)
    ok(k.NachfolgerGeben() is k2, "NachfolgerSetzen/NachfolgerGeben")

@test("Entfernen gibt das Datenelement zurück, nicht den Knoten")
def _():
    w = Warteschlange()
    p = Patient("Andi")
    w.Einfügen(p)
    ok(w.Entfernen() is p, "Entfernen() muss das Patient-Objekt selbst zurückgeben")

@test("Dieselbe Struktur funktioniert für Patienten und Autos")
def _():
    w = Warteschlange()
    w.Einfügen(Patient("Andi"))
    w.Einfügen(Auto("M-AB 1"))
    w.Einfügen(Patient("Bert"))
    eq(w.Entfernen().name, "Andi", "erstes")
    eq(w.Entfernen().kennzeichen, "M-AB 1", "zweites")
    eq(w.Entfernen().name, "Bert", "drittes")
    eq(w.Entfernen(), None, "viertes (leer)")

@test("Die Datenobjekte haben kein Attribut nachfolger")
def _():
    w = Warteschlange()
    p = Patient("Andi")
    w.Einfügen(p)
    w.Einfügen(Patient("Bert"))
    ok(not hasattr(p, "nachfolger"), "Die Struktur gehört in den Knoten, nicht in das Datenobjekt.")

@test("Wiederbefüllen nach dem Leeren")
def _():
    w = Warteschlange()
    w.Einfügen("a")
    w.Entfernen()
    w.Einfügen("b")
    eq((w.Entfernen(), w.anfang, w.ende), ("b", None, None), "(Entfernen(), anfang, ende)")
--- hint
`Einfügen` ist die Methode aus C1 mit einer zusätzlichen ersten Zeile: `k = Knoten(d)`. Arbeite dann mit `k` statt mit dem Patienten.
--- explain
Die Warteschlange schaut nie in ihre Daten hinein: Sie funktioniert für Patienten, Autos und sogar einfache Strings.
:::

:::exercise id=c2-print title="Ausgeben: Der Knoten fragt seine Daten" level=2
Ergänze die Warteschlange um `InformationAusgeben()`: Es durchläuft die Knoten und ruft `InformationAusgeben()` **jedes Datenelements** auf (jede Datenklasse entscheidet selbst, was sie ausgibt). Schreib außerdem die beiden Datenklassen:

- `Patient(name)`: gibt den Namen aus
- `Auto(kennzeichen)`: gibt `Auto ` + kennzeichen aus
--- starter
class Knoten:
    def __init__(self, d):
        self.daten = d
        self.nachfolger = None

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
            self.ende.nachfolger = k
        self.ende = k

    def InformationAusgeben(self):
        pass


class Patient:
    pass


class Auto:
    pass


w = Warteschlange()
w.Einfügen(Patient("Andi"))
w.Einfügen(Auto("M-XY 42"))
w.InformationAusgeben()
--- solution
class Knoten:
    def __init__(self, d):
        self.daten = d
        self.nachfolger = None

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
            self.ende.nachfolger = k
        self.ende = k

    def InformationAusgeben(self):
        k = self.anfang
        while k is not None:
            k.DatenelementGeben().InformationAusgeben()
            k = k.nachfolger


class Patient:
    def __init__(self, name):
        self.name = name

    def InformationAusgeben(self):
        print(self.name)


class Auto:
    def __init__(self, kennzeichen):
        self.kennzeichen = kennzeichen

    def InformationAusgeben(self):
        print("Auto " + self.kennzeichen)


w = Warteschlange()
w.Einfügen(Patient("Andi"))
w.Einfügen(Auto("M-XY 42"))
w.InformationAusgeben()
--- tests
@test("Ausgabe einer gemischten Warteschlange")
def _():
    w = Warteschlange()
    w.Einfügen(Patient("Andi"))
    w.Einfügen(Auto("M-XY 42"))
    w.Einfügen(Patient("Bert"))
    eq(lines(printed(w.InformationAusgeben)), ["Andi", "Auto M-XY 42", "Bert"], "ausgegebene Zeilen")

@test("Leere Warteschlange gibt nichts aus")
def _():
    eq(printed(Warteschlange().InformationAusgeben).strip(), "", "Ausgabe")

@test("Die Warteschlange gibt die Daten nicht selbst aus")
def _():
    body = SOURCE.split("def InformationAusgeben(self):")[1].split("class Patient")[0]
    ok("print" not in body, "Die Warteschlange muss InformationAusgeben() ihrer Daten aufrufen, statt selbst auszugeben.")
--- hint
In der Schleife: `k.DatenelementGeben().InformationAusgeben()`.
--- explain
Polymorphie (A9): Die Warteschlange schickt jedem Datenelement dieselbe Nachricht, und jede Klasse antwortet auf ihre Art. Die Warteschlange muss nicht wissen, welche Arten von Daten es gibt.
:::

:::exercise id=c2-search title="DATENELEMENT und Suchen" level=2
Schreib die abstrakte Klasse `Datenelement` mit den abstrakten Methoden `InformationAusgeben()` und `SchluesselIstGleich(schluessel)` und die Unterklassen

- `Buerger(name, anliegen)`: Schlüssel = name
- `Auto(kennzeichen)`: Schlüssel = kennzeichen

Ergänze dann die Warteschlange um `Suchen(schluessel)`: Es gibt das **erste Datenelement** zurück, dessen Schlüssel passt, oder `None`.
--- starter
from abc import ABC, abstractmethod


class Knoten:
    def __init__(self, d):
        self.daten = d
        self.nachfolger = None


class Warteschlange:
    def __init__(self):
        self.anfang = None
        self.ende = None

    def Einfügen(self, d):
        k = Knoten(d)
        if self.anfang is None:
            self.anfang = k
        else:
            self.ende.nachfolger = k
        self.ende = k

    def Suchen(self, schluessel):
        pass
--- solution
from abc import ABC, abstractmethod


class Datenelement(ABC):
    @abstractmethod
    def InformationAusgeben(self):
        pass

    @abstractmethod
    def SchluesselIstGleich(self, schluessel):
        pass


class Buerger(Datenelement):
    def __init__(self, name, anliegen):
        self.name = name
        self.anliegen = anliegen

    def InformationAusgeben(self):
        print(self.name + ": " + self.anliegen)

    def SchluesselIstGleich(self, schluessel):
        return self.name == schluessel


class Auto(Datenelement):
    def __init__(self, kennzeichen):
        self.kennzeichen = kennzeichen

    def InformationAusgeben(self):
        print(self.kennzeichen)

    def SchluesselIstGleich(self, schluessel):
        return self.kennzeichen == schluessel


class Knoten:
    def __init__(self, d):
        self.daten = d
        self.nachfolger = None


class Warteschlange:
    def __init__(self):
        self.anfang = None
        self.ende = None

    def Einfügen(self, d):
        k = Knoten(d)
        if self.anfang is None:
            self.anfang = k
        else:
            self.ende.nachfolger = k
        self.ende = k

    def Suchen(self, schluessel):
        k = self.anfang
        while k is not None:
            if k.daten.SchluesselIstGleich(schluessel):
                return k.daten
            k = k.nachfolger
        return None
--- tests
@test("Datenelement ist abstrakt")
def _():
    try:
        Datenelement()
        ok(False, "Datenelement() muss einen TypeError auslösen")
    except TypeError:
        pass

@test("Buerger und Auto sind Datenelemente")
def _():
    ok(isinstance(Buerger("A", "Pass"), Datenelement) and isinstance(Auto("M-1"), Datenelement), "beide müssen von Datenelement erben")

@test("Suchen in einer gemischten Warteschlange")
def _():
    w = Warteschlange()
    b = Buerger("Bert", "Anmeldung")
    a = Auto("M-AB 1")
    w.Einfügen(Buerger("Andi", "Ausweis"))
    w.Einfügen(a)
    w.Einfügen(b)
    ok(w.Suchen("Bert") is b, "Suchen('Bert')")
    ok(w.Suchen("M-AB 1") is a, "Suchen('M-AB 1')")
    eq(w.Suchen("Zoe"), None, "Suchen('Zoe')")
    eq(Warteschlange().Suchen("X"), None, "Suchen in einer leeren Warteschlange")
--- hint
Übernimm das Muster aus Lektion A9 (`a9-data`). Die Suche durchläuft die Knoten und fragt jedes Datenelement `SchluesselIstGleich(schluessel)`.
--- explain
Die Warteschlange verwendet nur Methoden, die jedes `Datenelement` haben muss. Das ist genau die Vereinbarung der Schnittstelle DATENELEMENT in den Klassendiagrammen deines Kurses.
:::

:::exercise id=c2-library title="Schulbibliothek, getrennt (Aufgabe 3 b)" level=3
Implementiere das Klassendiagramm der getrennten Bibliothek (vereinfacht):

- `Buch(titel, autoren)`: `autoren` ist eine Liste von Namen
- `Entleiher(name, klasse)`
- `Entleihvorgang(buch, entleiher, datum)`: speichert die Referenzen und `rueckgabedatum = None`; `RueckgabeEintragen(datum)`; `IstOffen()` → True, solange nicht zurückgegeben
- `Bibliothek`: Liste `vorgaenge`; `Ausleihen(buch, entleiher, datum)` erzeugt einen Entleihvorgang, speichert ihn und gibt ihn zurück; `OffeneTitelGeben(entleiher)` gibt die Liste der Titel zurück, die dieser Entleiher noch nicht zurückgegeben hat

Achte darauf, dass ein Klassenwechsel (ein Schüler wechselt die Klasse) jetzt nur noch eine Änderung an einem Objekt braucht.
--- starter
class Buch:
    pass


class Entleiher:
    pass


class Entleihvorgang:
    pass


class Bibliothek:
    pass
--- solution
class Buch:
    def __init__(self, titel, autoren):
        self.titel = titel
        self.autoren = autoren


class Entleiher:
    def __init__(self, name, klasse):
        self.name = name
        self.klasse = klasse


class Entleihvorgang:
    def __init__(self, buch, entleiher, datum):
        self.buch = buch
        self.entleiher = entleiher
        self.entleihdatum = datum
        self.rueckgabedatum = None

    def RueckgabeEintragen(self, datum):
        self.rueckgabedatum = datum

    def IstOffen(self):
        return self.rueckgabedatum is None


class Bibliothek:
    def __init__(self):
        self.vorgaenge = []

    def Ausleihen(self, buch, entleiher, datum):
        v = Entleihvorgang(buch, entleiher, datum)
        self.vorgaenge.append(v)
        return v

    def OffeneTitelGeben(self, entleiher):
        ergebnis = []
        for v in self.vorgaenge:
            if v.entleiher is entleiher and v.IstOffen():
                ergebnis.append(v.buch.titel)
        return ergebnis
--- tests
@test("Objekte speichern ihre Daten")
def _():
    b = Buch("Faust", ["Goethe"])
    e = Entleiher("Nikita", "Q12")
    eq((b.titel, b.autoren, e.name, e.klasse), ("Faust", ["Goethe"], "Nikita", "Q12"), "Attribute")

@test("Entleihvorgang: offen bis zur Rückgabe")
def _():
    v = Entleihvorgang(Buch("A", []), Entleiher("X", "10a"), "01.10.")
    eq(v.IstOffen(), True, "IstOffen() vor der Rückgabe")
    v.RueckgabeEintragen("15.10.")
    eq((v.IstOffen(), v.rueckgabedatum), (False, "15.10."), "(IstOffen(), rueckgabedatum) nach der Rückgabe")

@test("OffeneTitelGeben")
def _():
    bib = Bibliothek()
    n = Entleiher("Nikita", "Q12")
    a = Entleiher("Ada", "Q11")
    v1 = bib.Ausleihen(Buch("Faust", ["Goethe"]), n, "01.10.")
    bib.Ausleihen(Buch("Momo", ["Ende"]), n, "02.10.")
    bib.Ausleihen(Buch("Emil", ["Kästner"]), a, "03.10.")
    v1.RueckgabeEintragen("10.10.")
    eq(bib.OffeneTitelGeben(n), ["Momo"], "offene Titel von Nikita")
    eq(bib.OffeneTitelGeben(a), ["Emil"], "offene Titel von Ada")

@test("Ein Klassenwechsel ist eine Änderung an einem Objekt")
def _():
    bib = Bibliothek()
    n = Entleiher("Nikita", "Q11")
    v1 = bib.Ausleihen(Buch("A", []), n, "1")
    v2 = bib.Ausleihen(Buch("B", []), n, "2")
    n.klasse = "Q12"
    eq((v1.entleiher.klasse, v2.entleiher.klasse), ("Q12", "Q12"), "Klasse, gesehen über beide Ausleihen")
--- hint
`Entleihvorgang` speichert **Referenzen** auf das Buch und den Entleiher, keine Kopien ihrer Daten.
--- explain
Weil jede Ausleihe nur auf das Entleiherobjekt verweist, ist die Klasse des Entleihers genau einmal gespeichert. Die Tabellenversion hat sie in jeder Zeile gespeichert, und genau diese Redundanz hat die Anomalien verursacht.
:::

## [exam] Klausurtraining

:::exam title="Abitur 2020 (Kinoverwaltung)" points=4
Die Entwickler haben sich entschieden, die Bewertungen nicht direkt, sondern über eine zusätzliche Klasse KNOTEN zu verketten. Nenne das zugrunde liegende Konzept und zwei damit verbundene Vorteile.
--- solution
**Trennung von Struktur und Daten.** Vorteile, z. B.: (1) Die Listenstruktur lässt sich ohne Änderung für andere Arten von Daten wiederverwenden; (2) die Datenklasse BEWERTUNG bleibt einfach und muss nichts über Listen wissen; (3) Struktur und Daten können unabhängig voneinander entwickelt und geändert werden; (4) eine Bewertung kann gleichzeitig in mehreren Listen enthalten sein.
:::

:::exam title="Warum eine Klasse nicht reicht (Handball, Aufgabe 2.2 Einstieg b)" points=3
Erkläre, warum das gegebene Handball-Projekt schwer lesbar ist und warum es schwierig ist, dass mehrere Entwickler an verschiedenen Stellen Funktionen ergänzen.
--- solution
Alle Daten des Spiels stehen in einer Klasse in vielen parallelen Listen (z. B. Minute und Torschütze eines Tors in zwei verschiedenen Listen, nur über denselben Index verbunden), und fast jede Methode enthält dieselbe Fallunterscheidung für Mannschaft 1 und Mannschaft 2. Daten, die zusammengehören, sind nicht in Objekten gebündelt. Jede Erweiterung (neue Ereignisarten, Statistiken) erfordert Änderungen an dieser einen Klasse und an mehreren Methoden gleichzeitig, mehrere Entwickler würden also ständig denselben Code ändern. Fehler sind für beide Mannschaften doppelt vorhanden.
:::

:::exam title="Struktur und Daten vermischt" points=3
In der Lösung ohne Feld aus C1 hat die Klasse PATIENT das Attribut `nachfolger`. Nenne zwei Probleme dieses Entwurfs.
--- solution
(1) Die Warteschlange funktioniert nur für Patienten; für Autos oder Bürger müsste der ganze Warteschlangencode in die neue Datenklasse kopiert werden. (2) Ein Patient kann immer nur in einer Warteschlange stehen, weil er nur einen `nachfolger` hat. (3) Die Datenklasse enthält eine Information (ihre Position in einer Warteschlange), die mit dem Patientsein nichts zu tun hat; damit werden zwei Aufgabenbereiche vermischt.
:::
