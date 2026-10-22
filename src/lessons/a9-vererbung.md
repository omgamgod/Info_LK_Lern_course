---
id: a9
num: A9
part: A
title: Vererbung, Polymorphie und abstrakte Klassen
short: Vererbung
lead: Das Kompositum aus Kapitel II beruht auf drei Ideen aus dieser Lektion. Eine Unterklasse erbt von einer Oberklasse, eine überschriebene Methode verhält sich in jeder Unterklasse anders, und eine abstrakte Klasse beschreibt nur, was ihre Unterklassen können müssen.
minutes: 55
uses: [a8]
goals:
  - '„ist ein“-Beziehungen mit Ober- und Unterklassen modellieren und in UML zeichnen'
  - Unterklassen in Python mit <code>super().__init__(…)</code> schreiben und Methoden überschreiben
  - Polymorphie an einem Beispiel erklären
  - abstrakte Klassen mit <code>ABC</code> und <code>@abstractmethod</code> anlegen
  - Vererbung, abstrakte Klasse und Schnittstelle vergleichen (Arbeitsblatt 12_II_2_Aufgabe_1)
---

## [logic] Generalisierung und Spezialisierung

Viele Klassen haben gemeinsame Eigenschaften. Ein Kreis und ein Rechteck sind beide **Formen**; jede hat eine Position und eine Farbe, aber sie berechnen ihre Fläche unterschiedlich. Statt das Gemeinsame zweimal zu schreiben, kommt es in eine **Oberklasse** `FORM`; `KREIS` und `RECHTECK` werden **Unterklassen**, die alles von `FORM` **erben** und das Besondere ergänzen oder ändern.

Der Test für Vererbung ist der Satz **„… ist ein …“**: *Ein Kreis ist eine Form* ✓. *Eine Warteschlange ist ein Patient* ✗ (das ist eine Beziehung, keine Vererbung).

In UML wird Vererbung als Pfeil mit **hohlem Dreieck** gezeichnet, der auf die Oberklasse zeigt:

:::diagram classes caption="KREIS und RECHTECK erben von FORM"
abstract FORM @0.7,0 | farbe: ZEICHENKETTE | FlaecheGeben(): KOMMAZAHL {abstract}; Beschreiben(): ZEICHENKETTE
class KREIS @0,1.1 | radius: KOMMAZAHL | FlaecheGeben(): KOMMAZAHL
class RECHTECK @1.4,1.1 | breite: KOMMAZAHL; hoehe: KOMMAZAHL | FlaecheGeben(): KOMMAZAHL
inherit KREIS -> FORM
inherit RECHTECK -> FORM
:::

- Ein Objekt der Unterklasse **hat alle Attribute und Methoden der Oberklasse**: Jeder Kreis hat eine `farbe` und kann `Beschreiben()`.
- Eine Unterklasse darf Attribute (`radius`) und Methoden **hinzufügen**.
- Eine Unterklasse darf eine Methode **überschreiben**: Sie definiert eine Methode mit demselben Namen, und für Objekte der Unterklasse wird die neue Version verwendet.

### Polymorphie

**Polymorphie** („Vielgestaltigkeit“) bedeutet: Derselbe Methodenaufruf kann unterschiedliches Verhalten auslösen, je nach der **Klasse des Objekts**, das ihn empfängt.

```pseudo
für jede form f in formen
    ausgeben f.FlaecheGeben()     // Kreis → π·r², Rechteck → b·h
endefür
```

Der Schleife ist es egal, ob `f` ein Kreis oder ein Rechteck ist. Jedes Objekt beantwortet die Nachricht `FlaecheGeben()` auf seine eigene Art. Genau das bringt das Kompositum zum Laufen: Die Liste schickt `LängeGeben()` an ihr erstes Element, und ein KNOTEN antwortet anders als ein ABSCHLUSS.

### Abstrakte Klassen

`FORM` selbst kann keine Fläche berechnen: Welche Form denn? Deshalb hat `FlaecheGeben()` in `FORM` keinen Rumpf; es legt nur fest, dass **jede Unterklasse diese Methode bereitstellen muss**. Eine solche Methode ist **abstrakt**, und eine Klasse mit abstrakten Methoden ist eine **abstrakte Klasse** (in UML: Name *kursiv* oder «abstract», abstrakte Methoden *kursiv*). Von einer abstrakten Klasse kann man keine Objekte erzeugen: Es gibt keine „Form an sich“, nur konkrete Kreise und Rechtecke.

### Schnittstelle

Eine **Schnittstelle** (Interface) geht noch einen Schritt weiter: Sie enthält **nur** abstrakte Methoden und keine Attribute. Sie ist ein reines Versprechen: *„Jede Klasse, die mich implementiert, kann X, Y und Z.“* Java hat dafür das Schlüsselwort `interface`, Python nicht. In Python übernimmt eine abstrakte Klasse mit ausschließlich abstrakten Methoden diese Rolle.

| | Vererbung (normale Oberklasse) | abstrakte Klasse | Schnittstelle |
|---|---|---|---|
| Objekte davon? | ja | nein | nein |
| enthält | Attribute + fertige Methoden | Attribute, fertige **und** abstrakte Methoden | nur abstrakte Methoden |
| Unterklasse muss … | nichts (darf überschreiben) | alle abstrakten Methoden implementieren | alle Methoden implementieren |
| sinnvoll, wenn … | Unterklassen Code teilen | Unterklassen Code teilen **und** bestimmte Methoden bereitstellen müssen | unabhängige Klassen dieselben Methoden anbieten sollen |
| Beispiel in deinem Kurs | (Q11) | `LISTENELEMENT` im Kompositum, `DATENELEMENT` | `DATENELEMENT` (Daten, die in einer Liste gespeichert werden können) |

## [bridge] Von UML zu Python

:::bridge title="Oberklasse, abstrakte Methode, Unterklasse" left="UML / Pseudocode" right="Python"
abstrakte klasse FORM                       || class Form(ABC):
  Konstruktor FORM(farbe)                   ||     def __init__(self, farbe):
    farbe = farbe                           ||         self.farbe = farbe
  abstrakte methode FlaecheGeben()          ||     @abstractmethod
                                            ||     def FlaecheGeben(self):
                                            ||         pass
klasse KREIS erbt von FORM                  || class Kreis(Form):
  Konstruktor KREIS(farbe, radius)          ||     def __init__(self, farbe, radius):
    Konstruktor der Oberklasse(farbe)       ||         super().__init__(farbe)
    radius = radius                         ||         self.radius = radius
  methode FlaecheGeben()                    ||     def FlaecheGeben(self):
    return 3.14159 * radius * radius        ||         return 3.14159 * self.radius ** 2
>> Die Oberklasse steht in Klammern hinter dem Klassennamen: `class Kreis(Form)`. `super().__init__(farbe)` führt den Konstruktor der Oberklasse aus, damit die geerbten Attribute gesetzt werden. Für abstrakte Klassen braucht Python `from abc import ABC, abstractmethod` am Anfang der Datei, die Oberklasse `ABC` und den Dekorator `@abstractmethod` über jeder abstrakten Methode.
:::

## [python] Vererbung in Python

```python
from abc import ABC, abstractmethod


class Form(ABC):
    def __init__(self, farbe):
        self.farbe = farbe

    @abstractmethod
    def FlaecheGeben(self):
        pass

    def Beschreiben(self):                       # von allen Unterklassen geerbt
        return self.farbe + "e Form mit Fläche " + str(self.FlaecheGeben())


class Rechteck(Form):
    def __init__(self, farbe, breite, hoehe):
        super().__init__(farbe)
        self.breite = breite
        self.hoehe = hoehe

    def FlaecheGeben(self):
        return self.breite * self.hoehe


r = Rechteck("rot", 3, 4)
print(r.Beschreiben())      # rote Form mit Fläche 12
```

Schau dir `Beschreiben` an: Es steht in `Form` und ruft `self.FlaecheGeben()` auf. Bei einem `Rechteck`-Objekt *ist* `self` ein Rechteck, also läuft das `FlaecheGeben` von Rechteck. Der Code der Oberklasse verwendet eine Methode, die erst die Unterklasse definiert: Polymorphie in Aktion.

Was passiert, wenn du ein abstraktes Objekt erzeugen willst?

```python
f = Form("blau")
# TypeError: Can't instantiate abstract class Form without an implementation for abstract method 'FlaecheGeben'
```

Derselbe Fehler erscheint, wenn eine Unterklasse **vergisst**, eine abstrakte Methode zu implementieren. Python prüft das beim Erzeugen des Objekts.

### Überschreiben und erweitern

Eine Unterklasse kann eine Methode komplett ersetzen oder sie erweitern, indem sie mit `super()` die Version der Oberklasse aufruft:

```python
class Quadrat(Rechteck):
    def __init__(self, farbe, seite):
        super().__init__(farbe, seite, seite)    # ein Quadrat ist ein Rechteck mit breite == hoehe

    def Beschreiben(self):
        return "Quadrat: " + super().Beschreiben()
```

:::trace title="Welche Methode läuft? Polymorphie Schritt für Schritt"
class Tier:
    def Laut(self):
        return "..."

    def Vorstellen(self):
        return "Ich mache " + self.Laut()


class Hund(Tier):
    def Laut(self):
        return "Wuff"


class Katze(Tier):
    def Laut(self):
        return "Miau"


for t in [Hund(), Katze(), Tier()]:
    print(t.Vorstellen())
:::

:::quiz
Mit den Klassen aus dem Schritt-für-Schritt-Beispiel: Was gibt `Katze().Vorstellen()` zurück?
- [ ] `'Ich mache ...'`, weil `Vorstellen` in `Tier` definiert ist
- [x] `'Ich mache Miau'`
- [ ] einen Fehler, weil `Katze` keine Methode `Vorstellen` hat
- [ ] `'Miau'`
--- explain
`Vorstellen` wird von `Tier` geerbt. Darin ist `self` das Katze-Objekt, also führt `self.Laut()` die überschreibende Methode von `Katze` aus und liefert `'Miau'`.
:::

## [python] Python-Blöcke

:::exercise id=a9-shapes title="Formen mit einer abstrakten Oberklasse" level=2
Vervollständige das Programm:

- `Form` ist abstrakt mit der abstrakten Methode `FlaecheGeben()` (schon gegeben).
- `Rechteck(breite, hoehe)` und `Kreis(radius)` erben von `Form` und implementieren `FlaecheGeben()` (nimm `3.14159` für π).
- `gesamtflaeche(formen)` gibt die Summe der Flächen aller Formen in der Liste zurück, **ohne zu fragen, welche Klasse jede Form hat**.
--- starter
from abc import ABC, abstractmethod


class Form(ABC):
    @abstractmethod
    def FlaecheGeben(self):
        pass


class Rechteck:
    pass


class Kreis:
    pass


def gesamtflaeche(formen):
    pass
--- solution
from abc import ABC, abstractmethod


class Form(ABC):
    @abstractmethod
    def FlaecheGeben(self):
        pass


class Rechteck(Form):
    def __init__(self, breite, hoehe):
        self.breite = breite
        self.hoehe = hoehe

    def FlaecheGeben(self):
        return self.breite * self.hoehe


class Kreis(Form):
    def __init__(self, radius):
        self.radius = radius

    def FlaecheGeben(self):
        return 3.14159 * self.radius * self.radius


def gesamtflaeche(formen):
    summe = 0
    for f in formen:
        summe = summe + f.FlaecheGeben()
    return summe
--- tests
@test("Rechteck(3, 4).FlaecheGeben() ist 12")
def _():
    eq(Rechteck(3, 4).FlaecheGeben(), 12, "Rechteck(3, 4).FlaecheGeben()")

@test("Kreis(1).FlaecheGeben() ist 3.14159")
def _():
    ok(abs(Kreis(1).FlaecheGeben() - 3.14159) < 1e-9, f"Kreis(1).FlaecheGeben() hat {Kreis(1).FlaecheGeben()!r} zurückgegeben")

@test("Beide erben von Form")
def _():
    ok(issubclass(Rechteck, Form) and issubclass(Kreis, Form), "Schreib class Rechteck(Form): und class Kreis(Form):")

@test("Von Form selbst kann man keine Objekte erzeugen")
def _():
    try:
        Form()
        ok(False, "Form() sollte einen TypeError auslösen (abstrakte Klasse)")
    except TypeError:
        pass

@test("gesamtflaeche arbeitet polymorph")
def _():
    total = gesamtflaeche([Rechteck(2, 5), Kreis(2), Rechteck(1, 1)])
    ok(abs(total - (10 + 3.14159 * 4 + 1)) < 1e-9, f"gesamtflaeche hat {total!r} zurückgegeben")
    eq(gesamtflaeche([]), 0, "gesamtflaeche([])")

@test("gesamtflaeche prüft die Klasse nicht")
def _():
    body = SOURCE.split("def gesamtflaeche")[1]
    ok("isinstance" not in body and "type(" not in body, "Lass jedes Objekt seine eigene Fläche berechnen: f.FlaecheGeben()")
--- hint
`class Rechteck(Form):` — die Oberklasse steht in Klammern. Dann ein Konstruktor und `FlaecheGeben`.
--- explain
`gesamtflaeche` schickt nur `FlaecheGeben()` an jedes Objekt; welcher Code läuft, hängt von der Klasse des Objekts ab. Neue Formen (eine Klasse Dreieck) würden funktionieren, ohne `gesamtflaeche` zu ändern. Das ist die Stärke der Polymorphie.
:::

:::exercise id=a9-super title="Die Oberklasse mit super() aufrufen" level=2
`Person(name)` speichert einen Namen und hat `Vorstellen()`, das `"Ich bin " + name` zurückgibt. Schreib die Unterklasse `Schueler(name, klasse)`, die

- mit `super().__init__(name)` den Namen setzt,
- zusätzlich `klasse` speichert,
- `Vorstellen()` so überschreibt, dass es den Text der Oberklasse plus `" aus der " + klasse` zurückgibt, und dabei `super().Vorstellen()` verwendet.

Beispiel: `Schueler("Nikita", "Q12").Vorstellen()` → `'Ich bin Nikita aus der Q12'`
--- starter
class Person:
    def __init__(self, name):
        self.name = name

    def Vorstellen(self):
        return "Ich bin " + self.name


class Schueler(Person):
    pass
--- solution
class Person:
    def __init__(self, name):
        self.name = name

    def Vorstellen(self):
        return "Ich bin " + self.name


class Schueler(Person):
    def __init__(self, name, klasse):
        super().__init__(name)
        self.klasse = klasse

    def Vorstellen(self):
        return super().Vorstellen() + " aus der " + self.klasse
--- tests
@test("Schueler speichert name und klasse")
def _():
    s = Schueler("Nikita", "Q12")
    eq((s.name, s.klasse), ("Nikita", "Q12"), "(name, klasse)")

@test("Vorstellen wird erweitert")
def _():
    eq(Schueler("Nikita", "Q12").Vorstellen(), "Ich bin Nikita aus der Q12", "Vorstellen()")

@test("Person funktioniert weiter unverändert")
def _():
    eq(Person("Ada").Vorstellen(), "Ich bin Ada", "Person('Ada').Vorstellen()")

@test("super() wird verwendet")
def _():
    ok(SOURCE.count("super()") >= 2, "Verwende super().__init__(…) und super().Vorstellen().")
--- hint
Im Konstruktor: `super().__init__(name)`, dann `self.klasse = klasse`.
--- explain
`super()` erreicht die Version einer Methode in der Oberklasse. So verwendet die Unterklasse den vorhandenen Code weiter, statt ihn zu kopieren.
:::

:::exercise id=a9-data title="Datenelement: eine Schnittstelle, zwei Datenklassen" level=3
Vorbereitung auf Kapitel II: Eine Liste soll **beliebige Daten** speichern können. Alle Datenklassen erben deshalb von der abstrakten Klasse `Datenelement`, die zwei Methoden verlangt:

- `InformationAusgeben()`: gibt eine Beschreibung aus
- `SchluesselIstGleich(schluessel)`: gibt `True` zurück, wenn der Schlüssel des Objekts gleich `schluessel` ist

Implementiere

- `Patient(name)`: Schlüssel ist der Name; gibt den Namen aus
- `Auto(kennzeichen, marke)`: Schlüssel ist das Kennzeichen; gibt `kennzeichen + " (" + marke + ")"` aus
- `suchen(daten, schluessel)`: gibt das erste Element der Liste `daten` zurück, dessen Schlüssel passt, oder `None`
--- starter
from abc import ABC, abstractmethod


class Datenelement(ABC):
    @abstractmethod
    def InformationAusgeben(self):
        pass

    @abstractmethod
    def SchluesselIstGleich(self, schluessel):
        pass


class Patient(Datenelement):
    pass


class Auto(Datenelement):
    pass


def suchen(daten, schluessel):
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


class Patient(Datenelement):
    def __init__(self, name):
        self.name = name

    def InformationAusgeben(self):
        print(self.name)

    def SchluesselIstGleich(self, schluessel):
        return self.name == schluessel


class Auto(Datenelement):
    def __init__(self, kennzeichen, marke):
        self.kennzeichen = kennzeichen
        self.marke = marke

    def InformationAusgeben(self):
        print(self.kennzeichen + " (" + self.marke + ")")

    def SchluesselIstGleich(self, schluessel):
        return self.kennzeichen == schluessel


def suchen(daten, schluessel):
    for d in daten:
        if d.SchluesselIstGleich(schluessel):
            return d
    return None
--- tests
@test("Patient und Auto lassen sich erzeugen (alle abstrakten Methoden implementiert)")
def _():
    Patient("Andi")
    Auto("M-AB 123", "VW")

@test("InformationAusgeben")
def _():
    eq(printed(lambda: Patient("Andi").InformationAusgeben()).strip(), "Andi", "Ausgabe Patient")
    eq(printed(lambda: Auto("M-AB 123", "VW").InformationAusgeben()).strip(), "M-AB 123 (VW)", "Ausgabe Auto")

@test("SchluesselIstGleich")
def _():
    eq(Patient("Andi").SchluesselIstGleich("Andi"), True, "Patient('Andi').SchluesselIstGleich('Andi')")
    eq(Auto("M-AB 123", "VW").SchluesselIstGleich("VW"), False, "Auto(...).SchluesselIstGleich('VW')")

@test("suchen funktioniert für gemischte Daten")
def _():
    a = Auto("M-AB 123", "VW")
    p = Patient("Bert")
    daten = [Patient("Andi"), a, p]
    ok(suchen(daten, "M-AB 123") is a, "suchen(daten, 'M-AB 123') sollte das Auto-Objekt zurückgeben")
    ok(suchen(daten, "Bert") is p, "suchen(daten, 'Bert') sollte den Patienten Bert zurückgeben")
    eq(suchen(daten, "Zoe"), None, "suchen(daten, 'Zoe')")
--- hint
Jede Unterklasse braucht ihr eigenes `__init__` plus beide Methoden. Der Schlüsselvergleich ist ein einziges `==`.
--- explain
`suchen` verwendet nur die Methoden, die `Datenelement` verspricht. Es funktioniert für Patienten, Autos und jede künftige Datenklasse. In C2 siehst du, dass dein Kurs genau deshalb `DATENELEMENT` einführt: Die Listenstruktur muss nicht mehr wissen, welche Art von Daten sie speichert.
:::

## [exam] Klausurtraining

:::exam title="Vererbung, abstrakte Klasse, Schnittstelle" points=6
(Nach 12_II_2_Aufgabe_1.) Vergleiche die drei Konzepte **Vererbung**, **Vererbung mit abstrakten Klassen** und **Schnittstelle**. Gib zu jedem ein Beispiel und einen sinnvollen Einsatzzweck an.
--- solution
- **Vererbung**: Eine Unterklasse übernimmt Attribute und Methoden einer Oberklasse und kann ergänzen oder überschreiben. Beispiel: `QUADRAT` erbt von `RECHTECK`. Einsatz: Klassen, die Code teilen und in einer „ist ein“-Beziehung stehen.
- **Abstrakte Klasse**: eine Oberklasse, von der man keine Objekte erzeugen kann und die neben gemeinsamen Attributen und fertigen Methoden abstrakte Methoden enthält, die jede Unterklasse implementieren muss. Beispiel: `FORM` mit abstraktem `FlaecheGeben()`; `LISTENELEMENT` im Kompositum mit `KNOTEN` und `ABSCHLUSS`. Einsatz: ein gemeinsames Konzept mit gemeinsamem Code, bei dem sich manches Verhalten erst in den Unterklassen festlegen lässt.
- **Schnittstelle**: nur Methodenköpfe, keine Attribute, kein Code; eine Klasse *implementiert* sie und verspricht, alle Methoden bereitzustellen. Beispiel: `DATENELEMENT` mit `InformationAusgeben()` und `SchlüsselIstGleich(...)`. Einsatz: Unabhängige Klassen (Patient, Auto, Bewertung) sollen in derselben Struktur verwendbar sein. In Python ist das eine abstrakte Klasse, die nur abstrakte Methoden enthält.
:::
