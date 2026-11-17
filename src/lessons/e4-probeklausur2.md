---
id: e4
num: E4
part: E
title: Probeklausur 2
short: Probeklausur 2
lead: Eine zweite vollständige Probeklausur, diesmal zu den neuen Themen Stapel (II.5) und Bäume (III), mit Rekursion aus Kapitel I. 60 Punkte, 90 Minuten, auf Papier. Jede Aufgabe hat eine Musterlösung mit einer Punkteverteilung. Danach kannst du deinen Code mit den Python-Blöcken am Ende prüfen.
minutes: 120
uses: [c5, d1, d2, d3]
goals:
  - eine vollständige Klausur zu Stapel und Bäumen unter Zeitdruck lösen
  - Stapel, Aufrufstapel, geordnete Binärbäume und das Baum-Kompositum in einer Aufgabe verbinden
  - die eigenen Antworten anhand von Musterlösungen mit Punkteverteilung bewerten
---

## [intro] So schreibst du diese Klausur

1. Nimm Papier und Stift, leg deine Unterlagen weg und stell einen Timer auf **90 Minuten**.
2. Bearbeite Aufgabe 1 bis 3, ohne eine Musterlösung zu öffnen. Pseudocode in der Notation deines Kurses und Python sind beide erlaubt, außer eine Aufgabe sagt etwas anderes.
3. Wenn die Zeit um ist, öffne die Musterlösungen eine nach der anderen und gib dir Punkte. Zähl sie in der Tabelle am Ende zusammen.
4. Geh bei jeder Aufgabe, bei der du mehr als die Hälfte der Punkte verloren hast, zu der Lektion zurück, die in ihrem Titel genannt ist.

| Aufgabe | Thema | Punkte |
|---|---|---|
| 1 | Stapel und Aufrufstapel | 16 |
| 2 | Geordnete Binärbäume | 20 |
| 3 | Binärbaum mit dem Kompositum | 24 |
| | **gesamt** | **60** |

## [exam] Aufgabe 1: Stapel

Ein Paketdienst belädt seine Lieferwagen durch eine einzige Hecktür. Was zuletzt eingeladen wurde, steht direkt an der Tür und kommt als Erstes wieder heraus. Die Ladefläche wird deshalb als STAPEL modelliert, der eine LISTE (Kompositum aus Kapitel II) nutzt. Jedes Paket ist ein Objekt der Klasse PAKET mit den Attributen `nummer` und `adresse`. Die Klasse LIEFERWAGEN hat die Methoden `Einladen(p: PAKET)` und `Ausladen(): PAKET`.

:::exam title="1 a) Stapel oder Warteschlange? (C5)" points=3
Begründe, warum die Ladefläche ein Stapel und keine Warteschlange ist. Die Fahrerin fährt die Empfänger in der Reihenfolge P1, P2, P3, P4 an. In welcher Reihenfolge müssen die Pakete eingeladen werden?
--- solution
Es gibt nur **eine** Öffnung: Das zuletzt eingeladene Paket kommt als erstes heraus, das ist **LIFO**. Eine Warteschlange (FIFO) bräuchte vorne einen Ausgang und hinten einen Eingang (1 P).

Das Paket für den ersten Empfänger muss an der Tür stehen, also als **letztes** eingeladen werden. Reihenfolge: **P4, P3, P2, P1** (2 P).
:::

::::exam title="1 b) Klassendiagramm und Methoden (C5)" points=4
Zeichne das Klassendiagramm mit LIEFERWAGEN, STAPEL, LISTE und PAKET (bei LISTE genügen die benötigten Methoden). Gib `Einladen` und `Ausladen` des LIEFERWAGENs sowie `VorneEinfügen` und `AnfangEntfernen` des STAPELs in Pseudocode an.
--- solution
:::diagram classes
class LIEFERWAGEN @0,0 | ladung: STAPEL | Einladen(p: PAKET); Ausladen(): PAKET
class STAPEL @1.4,0 | liste: LISTE | VorneEinfügen(d: DATENELEMENT); AnfangEntfernen(): DATENELEMENT
class LISTE @2.85,0 | anfang: LISTENELEMENT | VorneEinfügen(d); AnfangEntfernen(): DATENELEMENT
class PAKET @1.5,1.15 | nummer; adresse | InformationAusgeben()
assoc LIEFERWAGEN -> STAPEL : ladung [1]
assoc STAPEL -> LISTE : nutzt [1]
assoc STAPEL -> PAKET : enthält als Datenelemente [*]
:::
(2 P für das Diagramm: STAPEL **nutzt** LISTE, keine Vererbung; LIEFERWAGEN hat einen STAPEL.)

```pseudo
// LIEFERWAGEN
methode Einladen(p: PAKET)
  ladung.VorneEinfügen(p)
endemethode

methode PAKET Ausladen()
  return ladung.AnfangEntfernen()
endemethode

// STAPEL
methode VorneEinfügen(d: DATENELEMENT)
  liste.VorneEinfügen(d)
endemethode

methode DATENELEMENT AnfangEntfernen()
  return liste.AnfangEntfernen()
endemethode
```
(2 P: Jede Methode delegiert nur weiter, ohne eigene Schleife.)
::::

::::exam title="1 c) Ablauf und Objektdiagramm (C5)" points=3
Ein leerer Lieferwagen w erhält nacheinander: `Einladen(P1)`, `Einladen(P2)`, `Ausladen()`, `Einladen(P3)`, `Einladen(P4)`, `Ausladen()`. Gib nach jedem Schritt den Inhalt der Ladefläche an und welches Paket ausgeladen wurde. Zeichne das Objektdiagramm am Ende (Pakete nur als Kästchen).
--- solution
| Schritt | Ladefläche (Tür rechts) | ausgeladen |
|---|---|---|
| Einladen(P1) | P1 | |
| Einladen(P2) | P1, P2 | |
| Ausladen() | P1 | **P2** |
| Einladen(P3) | P1, P3 | |
| Einladen(P4) | P1, P3, P4 | |
| Ausladen() | P1, P3 | **P4** |

(1 P)

:::diagram objects
w: LIEFERWAGEN @0,0 | ladung -> s
s: STAPEL @1,0 | liste -> l
l: LISTE @2,0 | anfang -> k3
k3: KNOTEN @3,0 | daten -> p3 | nachfolger -> k1
k1: KNOTEN @4,0 | daten -> p1 | nachfolger -> a
a: ABSCHLUSS @5,0
p3: PAKET @3,1.1 | nummer = "P3"
p1: PAKET @4,1.1 | nummer = "P1"
:::
(2 P: P3 im ersten Knoten, P1 dahinter, ABSCHLUSS am Ende, Kette über STAPEL und LISTE.)
::::

:::exam title="1 d) Ein Paket aus der Mitte (C5)" points=2
Beim Kunden für P1 stellt sich heraus, dass P1 unter P3 steht. Beschreibe mit den Operationen `Einladen` und `Ausladen`, wie die Fahrerin P1 herausholt, sodass alle anderen Pakete danach in derselben Reihenfolge wie vorher im Wagen stehen. Was braucht sie dafür?
--- solution
Sie braucht einen **zweiten Stapel** (z. B. einen Rollwagen) als Zwischenablage (1 P). Sie lädt so lange aus und legt auf den Rollwagen, bis P1 an der Tür steht, nimmt P1 heraus und lädt danach alles vom Rollwagen wieder ein. Weil der Rollwagen die Reihenfolge umdreht und das Wiedereinladen sie noch einmal umdreht, stehen die Pakete danach wie vorher (1 P).
:::

:::exam title="1 e) Der Aufrufstapel (C5, D3)" points=4
Die rekursive Methode `AnzahlGeben()` eines Kompositum-Baums (wie in Aufgabe 3) ruft im KNOTEN `AnzahlGeben()` bei beiden Nachfolgern auf; der ABSCHLUSS gibt 0 zurück.

a) Wie viele Aufrufe von `AnzahlGeben()` liegen höchstens **gleichzeitig** auf dem Aufrufstapel, wenn der Baum zu einer Liste aus n Knoten entartet ist, und wie viele bei einem vollständigen Baum mit 15 Knoten? Begründe.

b) Was passiert in Python, wenn der Baum durch sortiertes Einfügen zu einer Liste aus 5000 Knoten entartet ist?
--- solution
a) Gleichzeitig auf dem Stapel liegen immer nur die Aufrufe **eines Pfades** von der Wurzel nach unten, weil der linke Teilbaum fertig ist (und seine Aufrufe abgebaut sind), bevor der rechte beginnt (1 P). Entartet: der Aufruf beim Baum, n Knoten und der Abschluss am Ende, also **n + 2** (1 P). Vollständig mit 15 Knoten (4 Ebenen): 1 + 4 + 1 = **6** (1 P). (Wer nur die Knoten zählt, gibt n und 4 an; das ist mit dieser Begründung auch richtig.)

b) Die Rekursionstiefe überschreitet Pythons Grenze (standardmäßig 1000): Das Programm bricht mit einem **`RecursionError`** ab (1 P).
:::

## [exam] Aufgabe 2: Geordnete Binärbäume

Eine Mitfahr-App speichert die Städte, die sie anfährt, in einem geordneten Binärbaum, lexikographisch nach dem Namen geordnet. Die Städte werden in dieser Reihenfolge eingefügt:

**Köln, Bonn, München, Aachen, Dresden, Nürnberg, Hamburg, Essen**

::::exam title="2 a) Einfügen und Fachbegriffe (D1, D2)" points=5
Zeichne den Baum nach dem Einfügen aller Städte. Gib die Blätter, die Höhe des Baums und die Anzahl seiner Ebenen an.
--- solution
:::diagram bintree
Köln(Bonn(Aachen,Dresden(,Hamburg(Essen,))),München(,Nürnberg))
:::
(3 P für den Baum, 1 P Abzug je falsch platzierter Stadt. Typischer Fehler: Hamburg links von Dresden.)

Blätter: **Aachen, Essen, Nürnberg** (1 P). Essen hat die größte Tiefe 4 (Köln, Bonn, Dresden, Hamburg, Essen): Höhe **4**, also **5 Ebenen** (1 P).
::::

:::exam title="2 b) Durchläufe (D2)" points=3
Gib die Städte in Inorder, Preorder und Postorder an. Welcher Durchlauf liefert eine alphabetische Liste?
--- solution
- Inorder: Aachen, Bonn, Dresden, Essen, Hamburg, Köln, München, Nürnberg
- Preorder: Köln, Bonn, Aachen, Dresden, Hamburg, Essen, München, Nürnberg
- Postorder: Aachen, Essen, Hamburg, Dresden, Bonn, Nürnberg, München, Köln

(je 1 P, Abzug bei einem Fehler.) **Inorder** liefert die alphabetische Reihenfolge, weil bei jedem Knoten erst alle kleineren (links), dann er selbst, dann alle größeren (rechts) ausgegeben werden.
:::

:::exam title="2 c) Suchen (D2)" points=3
Wie viele Vergleiche braucht die Suche nach „Essen“ und nach „Frankfurt“? Wie viele Vergleiche braucht eine Suche in diesem Baum höchstens?
--- solution
„Essen“: Köln, Bonn, Dresden, Hamburg, Essen: **5** Vergleiche (1 P).
„Frankfurt“: Köln (links), Bonn (rechts), Dresden (rechts), Hamburg (links), Essen (rechts), dort ist ein leerer Teilbaum: **5** Vergleiche, nicht gefunden (1 P).
Höchstens so viele, wie der Baum Ebenen hat: **5** (1 P).
:::

:::exam title="2 d) Ausgeglichen? (D1, D2)" points=3
Ist der Baum aus a) balanciert? Gib eine Einfügereihenfolge derselben acht Städte an, die einen Baum mit möglichst wenigen Ebenen ergibt, und begründe, warum es nicht weniger Ebenen sein können.
--- solution
**Nicht balanciert** (1 P): Bei Dresden ist der linke Teilbaum leer (Höhe −1), der rechte (Hamburg, Essen) hat Höhe 1, Unterschied 2. (Auch Bonn ist ein Gegenbeispiel: Höhen 0 und 2.)

Immer die Mitte des sortierten Bereichs zuerst (1 P): **Essen, Bonn, Aachen, Dresden, Köln, Hamburg, München, Nürnberg**. Das ergibt `Essen(Bonn(Aachen,Dresden),Köln(Hamburg,München(,Nürnberg)))` mit 4 Ebenen.

Drei Ebenen fassen höchstens 1 + 2 + 4 = 7 Knoten, für 8 Städte braucht man also mindestens **4 Ebenen** (1 P).
:::

:::exam title="2 e) Was heißt geordnet? (D1)" points=3
Ein Mitschüler sagt: „Ein Binärbaum ist geordnet, wenn bei jedem Knoten der linke Nachfolger kleiner und der rechte Nachfolger größer ist.“ Zeige mit einem Gegenbeispiel, dass das nicht genügt, und gib die richtige Bedingung an.
--- solution
Gegenbeispiel `50(30(,60),70)` (1 P): Jeder Knoten ist größer als sein linker und kleiner als sein rechter Nachfolger (30 < 50 < 70, 30 < 60). Trotzdem steht 60 im **linken** Teilbaum von 50, obwohl 60 > 50. Eine Suche nach 60 geht bei 50 nach rechts und findet 60 nicht (1 P).

Richtig: Bei jedem Knoten sind **alle** Schlüssel im linken Teilbaum kleiner und **alle** Schlüssel im rechten Teilbaum größer als sein eigener Schlüssel (1 P).
:::

:::exam title="2 f) Aufwand (D1)" points=3
Die App wächst auf 1 000 000 Städte und Orte. Wie viele Vergleiche braucht eine Suche höchstens in einer sortierten Liste, in einem optimal aufgebauten Baum und in einem entarteten Baum? Begründe kurz.
--- solution
- Sortierte Liste: bis zu **1 000 000** Vergleiche, man geht von vorne nach hinten (1 P).
- Optimal aufgebauter Baum: so viele Vergleiche, wie er Ebenen hat. 2²⁰ − 1 = 1 048 575 ≥ 1 000 000, also **20** Ebenen und höchstens 20 Vergleiche (1 P).
- Entarteter Baum: Er ist eine Liste, also wieder bis zu **1 000 000** Vergleiche (1 P).
:::

## [exam] Aufgabe 3: Binärbaum mit dem Kompositum

Ein Online-Shop verwaltet seine Artikel in einem geordneten Binärbaum nach der **Artikelnummer** (eine ganze Zahl), umgesetzt mit dem Entwurfsmuster Kompositum. Ein ARTIKEL hat die Attribute `nummer`, `name` und `preis` und die Methoden `SchlüsselIstGleich(nr)`, `SchlüsselIstGrößerAls(nr)` (wahr, wenn die eigene Nummer größer als nr ist), `NummerGeben()`, `NameGeben()`, `PreisGeben()` und `InformationAusgeben()`. Ein Artikel mit einer Nummer, die es schon gibt, wird nicht eingefügt.

::::exam title="3 a) Klassendiagramm (D3)" points=5
Zeichne das Klassendiagramm mit ARTIKELBAUM, BAUMELEMENT, KNOTEN, ABSCHLUSS und ARTIKEL mit den Methoden `Einfügen(a)` und `PreisGeben(nr)`. Nenne die Rollen des Entwurfsmusters.
--- solution
:::diagram classes
class ARTIKELBAUM @0,0 | wurzel: BAUMELEMENT | Einfügen(a: ARTIKEL); PreisGeben(nr): GANZZAHL
abstract BAUMELEMENT @1.5,0 | | Einfügen(a): BAUMELEMENT {abstract}; PreisGeben(nr): GANZZAHL {abstract}
class ABSCHLUSS @0.9,1.25 | | Einfügen(a): BAUMELEMENT; PreisGeben(nr): GANZZAHL
class KNOTEN @2.15,1.25 | linkerNf: BAUMELEMENT; rechterNf: BAUMELEMENT; daten: ARTIKEL | Einfügen(a): BAUMELEMENT; PreisGeben(nr): GANZZAHL
class ARTIKEL @2.15,2.55 | nummer; name; preis | SchlüsselIstGleich(nr); SchlüsselIstGrößerAls(nr); NummerGeben(); PreisGeben()
assoc ARTIKELBAUM -> BAUMELEMENT : hat als Wurzel [1]
inherit ABSCHLUSS -> BAUMELEMENT
inherit KNOTEN -> BAUMELEMENT
assoc KNOTEN -> BAUMELEMENT : hat als Nachfolger [2]
assoc KNOTEN -> ARTIKEL : verwaltet [1]
:::
1 P abstraktes BAUMELEMENT mit zwei Unterklassen, 1 P KNOTEN → BAUMELEMENT mit Multiplizität 2 (nicht KNOTEN → KNOTEN), 1 P KNOTEN → ARTIKEL und ARTIKELBAUM → BAUMELEMENT, 1 P `Einfügen` mit Rückgabetyp BAUMELEMENT in BAUMELEMENT, KNOTEN, ABSCHLUSS. Rollen (1 P): BAUMELEMENT = Komponente, KNOTEN = Kompositum, ABSCHLUSS = Blatt, ARTIKELBAUM = Klient.
::::

::::exam title="3 b) Objektdiagramm (D3)" points=3
In einen leeren Artikelbaum werden die Artikel 500, 800 und 650 eingefügt. Zeichne das Objektdiagramm (Artikel nur als Kästchen mit Nummer). Wie viele ABSCHLUSS-Objekte enthält ein Artikelbaum mit n Artikeln? Begründe.
--- solution
:::diagram objects
b: ARTIKELBAUM @0,0 | wurzel -> k1
k1: KNOTEN @1,0 | daten -> x1 | linkerNf -> a1 | rechterNf -> k2
x1: ARTIKEL @2.2,0 | nummer = 500
a1: ABSCHLUSS @0,1.2
k2: KNOTEN @2,1.2 | daten -> x2 | linkerNf -> k3 | rechterNf -> a2
x2: ARTIKEL @3.2,1.2 | nummer = 800
a2: ABSCHLUSS @3.2,2.2
k3: KNOTEN @0.9,2.4 | daten -> x3 | linkerNf -> a3 | rechterNf -> a4
x3: ARTIKEL @2.1,2.4 | nummer = 650
a3: ABSCHLUSS @2.1,3.3
a4: ABSCHLUSS @2.1,3.75
:::
(2 P: 800 rechts von 500, 650 links von 800, jeder leere Platz ein eigener ABSCHLUSS.)

**n + 1** (1 P): n Knoten haben zusammen 2n Nachfolger-Referenzen. Jeder Knoten außer der Wurzel wird von genau einer davon referenziert, das sind n − 1. Die übrigen 2n − (n − 1) = n + 1 zeigen auf Abschlüsse. (Hier: 3 Artikel, 4 Abschlüsse.)
::::

:::exam title="3 c) Einfügen (D3)" points=5
Implementiere `Einfügen(a)` in ARTIKELBAUM, KNOTEN und ABSCHLUSS (Python oder Pseudocode).
--- solution
```python
# ArtikelBaum
def Einfuegen(self, a):
    self.wurzel = self.wurzel.Einfuegen(a)

# Abschluss
def Einfuegen(self, a):
    return Knoten(a, Abschluss(), Abschluss())

# Knoten
def Einfuegen(self, a):
    nr = a.NummerGeben()
    if self.daten.SchluesselIstGleich(nr):
        return self                                # schon vorhanden
    if self.daten.SchluesselIstGroesserAls(nr):
        self.linkerNf = self.linkerNf.Einfuegen(a)
    else:
        self.rechterNf = self.rechterNf.Einfuegen(a)
    return self
```
1 P ARTIKELBAUM speichert die Rückgabe als neue Wurzel, 1 P ABSCHLUSS erzeugt einen KNOTEN mit zwei neuen Abschlüssen, 2 P KNOTEN vergleicht über das Datenelement und gibt die Nachricht an die richtige Seite weiter, 1 P KNOTEN gibt sich selbst zurück (auch bei gleichem Schlüssel).
:::

:::exam title="3 d) PreisGeben (D3)" points=4
Implementiere `PreisGeben(nr)` in ARTIKELBAUM, KNOTEN und ABSCHLUSS. Gibt es keinen Artikel mit dieser Nummer, soll −1 zurückgegeben werden. Warum ist dafür keine Prüfung auf *nichts* nötig?
--- solution
```python
# ArtikelBaum
def PreisGeben(self, nr):
    return self.wurzel.PreisGeben(nr)

# Abschluss
def PreisGeben(self, nr):
    return -1

# Knoten
def PreisGeben(self, nr):
    if self.daten.SchluesselIstGleich(nr):
        return self.daten.PreisGeben()
    if self.daten.SchluesselIstGroesserAls(nr):
        return self.linkerNf.PreisGeben(nr)
    return self.rechterNf.PreisGeben(nr)
```
(3 P, davon 1 P für das `return` vor den rekursiven Aufrufen.) Jeder Nachfolger ist ein Objekt, notfalls ein ABSCHLUSS, und der beantwortet die Nachricht selbst mit −1 (1 P).
:::

::::exam title="3 e) Sequenzdiagramm (D3)" points=4
Der Baum aus b) enthält 500 (Maus, 15 €), 800 (Tastatur, 40 €) und 650 (Headset, 35 €). Zeichne das Sequenzdiagramm für `PreisGeben(800)` mit deinem Code aus d). Beschrifte die Rückgabewerte.
--- solution
:::diagram seq
actors: Aufrufer | b: ARTIKELBAUM | k1: KNOTEN | x1: ARTIKEL | k2: KNOTEN | x2: ARTIKEL
Aufrufer -> b: PreisGeben(800)
b -> k1: PreisGeben(800)
k1 -> x1: SchlüsselIstGleich(800)
x1 --> k1: falsch
k1 -> x1: SchlüsselIstGrößerAls(800)
x1 --> k1: falsch
k1 -> k2: PreisGeben(800)
k2 -> x2: SchlüsselIstGleich(800)
x2 --> k2: wahr
k2 -> x2: PreisGeben()
x2 --> k2: 40
k2 --> k1: 40
k1 --> b: 40
b --> Aufrufer: 40
:::
1 P Weg b → k1 → k2 (k3 und die Abschlüsse kommen nicht vor), 1 P Vergleiche an die Artikel mit Ergebnissen (bei k2 ist schon der erste Vergleich wahr), 1 P PreisGeben an x2, 1 P Rückgabe 40 durch alle Ebenen.
::::

:::exam title="3 f) Günstige Artikel (D2, D3)" points=3
Implementiere `GuenstigeAusgeben(p)` in KNOTEN und ABSCHLUSS: Es gibt alle Artikel, deren Preis kleiner als p ist, nach Artikelnummer sortiert aus. Warum muss die Methode immer den ganzen Baum durchlaufen?
--- solution
```python
# Abschluss
def GuenstigeAusgeben(self, p):
    pass

# Knoten
def GuenstigeAusgeben(self, p):
    self.linkerNf.GuenstigeAusgeben(p)
    if self.daten.PreisGeben() < p:
        self.daten.InformationAusgeben()
    self.rechterNf.GuenstigeAusgeben(p)
```
(2 P: Inorder, damit die Ausgabe nach Nummer sortiert ist; Bedingung nur um die eigene Ausgabe.) Der Baum ist nach der **Nummer** geordnet, nicht nach dem Preis. Ein günstiger Artikel kann in jedem Teilbaum stehen, also kann kein Teilbaum übersprungen werden (1 P).
:::

## [intro] Dein Ergebnis

| Aufgabe | max. | deine Punkte |
|---|---|---|
| 1 a–e | 16 | |
| 2 a–f | 20 | |
| 3 a–f | 24 | |
| **gesamt** | **60** | |

In einem Bereich viele Punkte verloren? Wiederhole diese Lektionen:

- 1 a–d → [C5](#c5) (LIFO, STAPEL nutzt LISTE, Objektdiagramm, Hilfsstapel bei der Patientenakte); 1 e → C5, Abschnitt *Methoden lassen sich stapeln*, und [D3](#d3)
- 2 a, e, f → [D1](#d1) (Fachbegriffe, geordnet, Ebenen und Aufwand); 2 b, c → [D2](#d2) (Durchläufe, Suchen); 2 d → D1 und D2
- 3 a–e → [D3](#d3) (Kompositum, Einfügen, Suchen, Objekt- und Sequenzdiagramm); 3 f → D2 (Inorder) und D3

## [python] Prüf deinen Code

Tipp ein, was du auf Papier geschrieben hast, und lass es von den Tests prüfen.

:::exercise id=e4-stapel title="Aufgabe 1: der Lieferwagen" level=2
Die Liste (Kompositum) ist gegeben. Implementiere die Methoden von `Stapel` und `Lieferwagen` wie in 1 b. Schreib außerdem `PaketHolen(nummer)` in `Lieferwagen` wie in 1 d: Es holt das Paket mit dieser Nummer heraus und gibt es zurück (oder `None`, wenn es nicht im Wagen ist); alle anderen Pakete stehen danach in derselben Reihenfolge wie vorher. Benutze dafür nur `Einladen`, `Ausladen`, `IstLeer` und einen zweiten Stapel.
--- starter
class Paket:
    def __init__(self, nummer, adresse):
        self.nummer = nummer
        self.adresse = adresse


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


class Liste:
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


class Stapel:
    def __init__(self):
        self.liste = Liste()

    def VorneEinfuegen(self, d):
        pass

    def AnfangEntfernen(self):
        pass

    def IstLeer(self):
        return self.liste.IstLeer()


class Lieferwagen:
    def __init__(self):
        self.ladung = Stapel()

    def Einladen(self, p):
        pass

    def Ausladen(self):
        pass

    def IstLeer(self):
        return self.ladung.IstLeer()

    def PaketHolen(self, nummer):
        pass


w = Lieferwagen()
for nr in ["P1", "P2", "P3"]:
    w.Einladen(Paket(nr, "Adresse " + nr))
print(w.PaketHolen("P1").nummer)
print(w.Ausladen().nummer, w.Ausladen().nummer)
--- solution
class Paket:
    def __init__(self, nummer, adresse):
        self.nummer = nummer
        self.adresse = adresse


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


class Liste:
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


class Stapel:
    def __init__(self):
        self.liste = Liste()

    def VorneEinfuegen(self, d):
        self.liste.VorneEinfuegen(d)

    def AnfangEntfernen(self):
        return self.liste.AnfangEntfernen()

    def IstLeer(self):
        return self.liste.IstLeer()


class Lieferwagen:
    def __init__(self):
        self.ladung = Stapel()

    def Einladen(self, p):
        self.ladung.VorneEinfuegen(p)

    def Ausladen(self):
        return self.ladung.AnfangEntfernen()

    def IstLeer(self):
        return self.ladung.IstLeer()

    def PaketHolen(self, nummer):
        rollwagen = Stapel()
        gefunden = None
        while not self.IstLeer():
            p = self.Ausladen()
            if p.nummer == nummer:
                gefunden = p
                break
            rollwagen.VorneEinfuegen(p)
        while not rollwagen.IstLeer():
            self.Einladen(rollwagen.AnfangEntfernen())
        return gefunden


w = Lieferwagen()
for nr in ["P1", "P2", "P3"]:
    w.Einladen(Paket(nr, "Adresse " + nr))
print(w.PaketHolen("P1").nummer)
print(w.Ausladen().nummer, w.Ausladen().nummer)
--- tests
def wagen(*nummern):
    w = Lieferwagen()
    for nr in nummern:
        w.Einladen(Paket(nr, "A"))
    return w

def alle(w):
    out = []
    while not w.IstLeer():
        out.append(w.Ausladen().nummer)
    return out

@test("Stapel und Lieferwagen")
def _():
    s = Stapel()
    s.VorneEinfuegen(1)
    s.VorneEinfuegen(2)
    eq(s.AnfangEntfernen(), 2, "Stapel: zuletzt abgelegt, zuerst entnommen")
    ok(isinstance(s.liste.anfang, Knoten), "Der Stapel soll seine Liste benutzen")
    eq(alle(wagen("P1", "P2", "P3", "P4")), ["P4", "P3", "P2", "P1"], "Ausladen in umgekehrter Reihenfolge")

@test("Ablauf aus 1 c")
def _():
    w = Lieferwagen()
    w.Einladen(Paket("P1", "A"))
    w.Einladen(Paket("P2", "A"))
    eq(w.Ausladen().nummer, "P2", "erstes Ausladen")
    w.Einladen(Paket("P3", "A"))
    w.Einladen(Paket("P4", "A"))
    eq(w.Ausladen().nummer, "P4", "zweites Ausladen")
    eq(alle(w), ["P3", "P1"], "Rest im Wagen")

@test("PaketHolen")
def _():
    w = wagen("P1", "P2", "P3", "P4")
    eq(w.PaketHolen("P2").nummer, "P2", "PaketHolen('P2')")
    eq(alle(w), ["P4", "P3", "P1"], "Reihenfolge der übrigen Pakete")
    w = wagen("P1", "P2", "P3")
    eq(w.PaketHolen("P3").nummer, "P3", "oberstes Paket")
    eq(alle(w), ["P2", "P1"], "Rest nach dem obersten Paket")
    w = wagen("P1", "P2")
    eq(w.PaketHolen("P9"), None, "unbekanntes Paket")
    eq(alle(w), ["P2", "P1"], "nach erfolgloser Suche muss alles wieder im Wagen sein")
    eq(Lieferwagen().PaketHolen("P1"), None, "leerer Wagen")
--- hint
In `PaketHolen`: Lade aus, bis du das Paket hast oder der Wagen leer ist, und leg alles andere auf einen neuen `Stapel()`. Danach lädst du alles vom Hilfsstapel wieder ein.
--- explain
Der Hilfsstapel dreht die Reihenfolge einmal um, das Zurückladen dreht sie wieder zurück. So bleibt die Reihenfolge der übrigen Pakete erhalten, obwohl nur die beiden Stapeloperationen benutzt werden.
:::

:::exercise id=e4-artikel title="Aufgabe 3: der Artikelbaum" level=2
Implementiere `Einfuegen`, `PreisGeben` und `GuenstigeAusgeben` in `ArtikelBaum`, `Knoten` und `Abschluss` wie in 3 c, 3 d und 3 f. `InformationAusgeben()` des Artikels gibt eine Zeile wie `650 Headset 35` aus.
--- starter
from abc import ABC, abstractmethod


class Artikel:
    def __init__(self, nummer, name, preis):
        self.nummer = nummer
        self.name = name
        self.preis = preis

    def SchluesselIstGleich(self, nr):
        return self.nummer == nr

    def SchluesselIstGroesserAls(self, nr):
        return self.nummer > nr

    def NummerGeben(self):
        return self.nummer

    def NameGeben(self):
        return self.name

    def PreisGeben(self):
        return self.preis

    def InformationAusgeben(self):
        print(self.nummer, self.name, self.preis)


class Baumelement(ABC):
    @abstractmethod
    def Einfuegen(self, a):
        pass

    @abstractmethod
    def PreisGeben(self, nr):
        pass

    @abstractmethod
    def GuenstigeAusgeben(self, p):
        pass


class Abschluss(Baumelement):
    def Einfuegen(self, a):
        pass

    def PreisGeben(self, nr):
        pass

    def GuenstigeAusgeben(self, p):
        pass


class Knoten(Baumelement):
    def __init__(self, a, li, re):
        self.daten = a
        self.linkerNf = li
        self.rechterNf = re

    def Einfuegen(self, a):
        pass

    def PreisGeben(self, nr):
        pass

    def GuenstigeAusgeben(self, p):
        pass


class ArtikelBaum:
    def __init__(self):
        self.wurzel = Abschluss()

    def Einfuegen(self, a):
        pass

    def PreisGeben(self, nr):
        pass

    def GuenstigeAusgeben(self, p):
        self.wurzel.GuenstigeAusgeben(p)


shop = ArtikelBaum()
shop.Einfuegen(Artikel(500, "Maus", 15))
shop.Einfuegen(Artikel(800, "Tastatur", 40))
shop.Einfuegen(Artikel(650, "Headset", 35))
print(shop.PreisGeben(650))
shop.GuenstigeAusgeben(36)
--- solution
from abc import ABC, abstractmethod


class Artikel:
    def __init__(self, nummer, name, preis):
        self.nummer = nummer
        self.name = name
        self.preis = preis

    def SchluesselIstGleich(self, nr):
        return self.nummer == nr

    def SchluesselIstGroesserAls(self, nr):
        return self.nummer > nr

    def NummerGeben(self):
        return self.nummer

    def NameGeben(self):
        return self.name

    def PreisGeben(self):
        return self.preis

    def InformationAusgeben(self):
        print(self.nummer, self.name, self.preis)


class Baumelement(ABC):
    @abstractmethod
    def Einfuegen(self, a):
        pass

    @abstractmethod
    def PreisGeben(self, nr):
        pass

    @abstractmethod
    def GuenstigeAusgeben(self, p):
        pass


class Abschluss(Baumelement):
    def Einfuegen(self, a):
        return Knoten(a, Abschluss(), Abschluss())

    def PreisGeben(self, nr):
        return -1

    def GuenstigeAusgeben(self, p):
        pass


class Knoten(Baumelement):
    def __init__(self, a, li, re):
        self.daten = a
        self.linkerNf = li
        self.rechterNf = re

    def Einfuegen(self, a):
        nr = a.NummerGeben()
        if self.daten.SchluesselIstGleich(nr):
            return self
        if self.daten.SchluesselIstGroesserAls(nr):
            self.linkerNf = self.linkerNf.Einfuegen(a)
        else:
            self.rechterNf = self.rechterNf.Einfuegen(a)
        return self

    def PreisGeben(self, nr):
        if self.daten.SchluesselIstGleich(nr):
            return self.daten.PreisGeben()
        if self.daten.SchluesselIstGroesserAls(nr):
            return self.linkerNf.PreisGeben(nr)
        return self.rechterNf.PreisGeben(nr)

    def GuenstigeAusgeben(self, p):
        self.linkerNf.GuenstigeAusgeben(p)
        if self.daten.PreisGeben() < p:
            self.daten.InformationAusgeben()
        self.rechterNf.GuenstigeAusgeben(p)


class ArtikelBaum:
    def __init__(self):
        self.wurzel = Abschluss()

    def Einfuegen(self, a):
        self.wurzel = self.wurzel.Einfuegen(a)

    def PreisGeben(self, nr):
        return self.wurzel.PreisGeben(nr)

    def GuenstigeAusgeben(self, p):
        self.wurzel.GuenstigeAusgeben(p)


shop = ArtikelBaum()
shop.Einfuegen(Artikel(500, "Maus", 15))
shop.Einfuegen(Artikel(800, "Tastatur", 40))
shop.Einfuegen(Artikel(650, "Headset", 35))
print(shop.PreisGeben(650))
shop.GuenstigeAusgeben(36)
--- tests
DATEN = [(500, "Maus", 15), (800, "Tastatur", 40), (650, "Headset", 35), (300, "Kabel", 5),
         (900, "Monitor", 180), (400, "Webcam", 45), (700, "Lautsprecher", 25)]

def shop(*daten):
    b = ArtikelBaum()
    for d in daten:
        b.Einfuegen(Artikel(*d))
    return b

def form(e):
    if isinstance(e, Abschluss):
        return None
    return (e.daten.nummer, form(e.linkerNf), form(e.rechterNf))

@test("Einfügen")
def _():
    b = shop(*DATEN[:3])
    eq(form(b.wurzel), (500, None, (800, (650, None, None), None)), "Baum nach 500, 800, 650")
    b.Einfuegen(Artikel(650, "Doppelt", 1))
    eq(form(b.wurzel), (500, None, (800, (650, None, None), None)), "eine vorhandene Nummer wird nicht eingefügt")
    eq(b.PreisGeben(650), 35, "der alte Artikel 650 bleibt")
    ok(isinstance(shop().wurzel, Abschluss), "ein leerer Baum hat einen Abschluss als Wurzel")

@test("PreisGeben")
def _():
    b = shop(*DATEN)
    for nr, name, preis in DATEN:
        eq(b.PreisGeben(nr), preis, "PreisGeben(%d)" % nr)
    for nr in [100, 450, 999]:
        eq(b.PreisGeben(nr), -1, "PreisGeben(%d)" % nr)
    eq(shop().PreisGeben(500), -1, "leerer Baum")

@test("GuenstigeAusgeben")
def _():
    b = shop(*DATEN)
    eq(lines(printed(lambda: b.GuenstigeAusgeben(36))),
       ["300 Kabel 5", "500 Maus 15", "650 Headset 35", "700 Lautsprecher 25"], "GuenstigeAusgeben(36)")
    eq(lines(printed(lambda: b.GuenstigeAusgeben(5))), [], "GuenstigeAusgeben(5): nichts ist günstiger als 5")
    eq(lines(printed(lambda: shop().GuenstigeAusgeben(100))), [], "leerer Baum")
--- hint
Alle drei Methoden folgen D3: Der ABSCHLUSS beantwortet die Nachricht selbst (neuer Knoten, −1, nichts), der KNOTEN vergleicht über `self.daten` und gibt die Nachricht an die richtige Seite weiter. `GuenstigeAusgeben` geht immer in beide Teilbäume.
--- explain
`Einfuegen` gibt den (neuen) Teilbaum zurück, `PreisGeben` nur einen Wert; deshalb steht beim Einfügen eine Zuweisung an `linkerNf`/`rechterNf` und beim Preis ein `return`. `GuenstigeAusgeben` ist ein Inorder-Durchlauf mit einer Bedingung.
:::
