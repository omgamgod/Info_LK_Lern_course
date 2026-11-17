---
id: c5
num: C5
part: C
title: Der Stapel
short: Stapel
lead: Der Stapel ist die letzte kleine Abwandlung der einfach verketteten Liste in Kapitel II. Er erlaubt nur zwei Dinge, oben ablegen und oben herunternehmen. Dass er so wichtig ist, liegt daran, dass dein Computer ihn bei jeder Rekursion selbst benutzt, als Aufrufstapel. Diese Lektion verbindet deshalb Kapitel I und II.
minutes: 80
uses: [c4, c1, b1]
goals:
  - das LIFO-Prinzip erklären und vom FIFO-Prinzip der Warteschlange abgrenzen
  - beschreiben, wie der Computer Methodenaufrufe auf einem Stapel verwaltet (Aufbau und Abbau des Aufrufstapels)
  - einen STAPEL implementieren, der eine LISTE nutzt (VorneEinfügen, AnfangEntfernen)
  - Anwendungen erkennen, in denen ein Stapel die passende Struktur ist (Patientenakte, Klammerprüfung, Rangiergleis, Cheese-Champions)
  - entscheiden, welche Ausgabereihenfolgen mit einem Stapel möglich sind
---

## [logic] Methoden lassen sich stapeln (12_II_5_TheoretischerEinstieg)

Erinnere dich an `LängeGeben()` aus C3. Die Liste fragt ihren ersten Knoten nach der Restlänge, der fragt seinen Nachfolger, und so weiter, bis der letzte Knoten antworten kann. Das Sequenzdiagramm zeigt zwei Bewegungen: Die Aufrufe gehen nach rechts (hinein), die Antworten kommen nach links zurück.

:::diagram seq caption="LängeGeben bei einer Liste mit drei Knoten (C3, Ende mit nichts markiert)"
actors: Aufrufer | liste: LISTE | knoten1: KNOTEN | knoten2: KNOTEN | knoten3: KNOTEN
Aufrufer -> liste: LängeGeben()
liste -> knoten1: RestlängeGeben()
knoten1 -> knoten2: RestlängeGeben()
knoten2 -> knoten3: RestlängeGeben()
knoten3 --> knoten2: 1
knoten2 --> knoten1: 2
knoten1 --> liste: 3
liste --> Aufrufer: 3
:::

Die Liste ruft `RestlängeGeben` für knoten1 auf und muss dann **warten**, bis knoten1 antwortet; erst danach kann sie `LängeGeben` beenden. Genauso wartet knoten1 auf knoten2. Wer wartet, ist **inaktiv**. Arbeiten kann immer nur der zuletzt aufgerufene Methodenaufruf.

Stell dir die Aufrufe als **Bauklötze** vor. Jeder neue Aufruf wird mit allem, was zu ihm gehört, **oben** auf einen Stapel gelegt:

- das **Objekt**, für das die Methode läuft (liste, knoten1 …),
- die **Stelle im Programm**, an der es später weitergeht (die Rücksprungstelle),
- die **lokalen Variablen** und Parameter.

Ist der oberste Aufruf fertig, wird er **vom Stapel geholt**, und der Aufruf darunter liegt wieder oben. Er setzt an seiner gespeicherten Stelle fort. Erst wird der Stapel also **aufgebaut** (die Aufrufe gehen hinein), dann **abgebaut** (die Antworten kommen zurück). Der Wendepunkt ist das Erreichen der **Abbruchbedingung**.

:::viz stack
{"mode": "calls"}
:::

Das ist genau der **Aufrufstapel**, den du in B1 bei `Fakultät(4)` gesehen hast. Der Computer verwaltet ihn selbst, du musst dafür nichts programmieren. Zwei Folgen kennst du schon:

- Eine zu tiefe Rekursion lässt den Aufrufstapel überlaufen; Python bricht dann mit `RecursionError` ab (etwa ab 1000 Aufrufen übereinander).
- Wenn du im Python-Block auf **◫ Visualisieren** drückst, siehst du diesen Stapel links unter *Aktive Aufrufe*.

:::key
Ein **Stapel** (engl. *stack*) ist eine Datenstruktur, bei der man nur **oben** etwas ablegen und nur **oben** etwas herunternehmen kann. Was zuletzt hineinkam, kommt zuerst wieder heraus: **LIFO**, *last in, first out*.
:::

## [logic] Stapel und Warteschlange

Die Warteschlange aus C1 arbeitet genau andersherum: Wer zuerst kommt, geht zuerst (**FIFO**, *first in, first out*). Beide sind Listen, bei denen nur wenige Operationen erlaubt sind; sie unterscheiden sich nur darin, **an welchem Ende** eingefügt wird.

| | Stapel | Warteschlange |
|---|---|---|
| Prinzip | **LIFO**: last in, first out | **FIFO**: first in, first out |
| Einfügen | **vorne** (oben): `VorneEinfügen(d)` | **hinten**: `HintenEinfügen(d)` |
| Entfernen | **vorne** (oben): `AnfangEntfernen()` | **vorne**: `AnfangEntfernen()` |
| Ausgabe | in **umgekehrter** Reihenfolge der Aufnahme | in **derselben** Reihenfolge |
| Beispiele | Tellerstapel, Aufrufstapel, Zurück-Knopf im Browser, Rückgängig in einem Editor | Kasse, Wartezimmer, Drucker |

Probier es mit denselben Daten in beiden Strukturen aus:

:::viz stack
{"mode": "vergleich", "init": ["Andi", "Bert"], "next": "Clara"}
:::

:::note title="Englische Namen"
In vielen Büchern und Programmiersprachen heißen die Stapeloperationen **push** (ablegen), **pop** (herunternehmen) und **top** oder **peek** (oberstes Element ansehen, ohne es zu entfernen). In deinem Kurs heißen sie wie bei der Liste `VorneEinfügen` und `AnfangEntfernen`.
:::

:::quiz
Auf einen leeren Stapel werden nacheinander A, B, C abgelegt. Dann wird zweimal heruntergenommen und D abgelegt. Was liegt jetzt oben, und was liegt ganz unten?
- [ ] oben C, unten A
- [x] oben D, unten A
- [ ] oben D, unten C
- [ ] oben A, unten D
--- explain
Nach A, B, C liegt C oben. Zweimal herunternehmen entfernt C und dann B; übrig ist A. Danach kommt D oben auf A.
:::

## [logic] Der Stapel nutzt eine Liste (12_II_5_Umsetzung)

Deine Lehrkraft baut den Stapel nicht neu, sondern **benutzt** die Liste aus C4. Ein STAPEL-Objekt besitzt eine LISTE und gibt nur zwei ihrer Methoden nach außen weiter:

:::diagram classes caption="STAPEL nutzt LISTE: Nur zwei Methoden der Liste werden weitergegeben"
class STAPEL @0,0 | liste: LISTE | Konstruktor(); VorneEinfügen(d: DATENELEMENT); AnfangEntfernen(): DATENELEMENT
class LISTE @1.55,0 | anfang: LISTENELEMENT | Konstruktor(); VorneEinfügen(d); HintenEinfügen(d); EinfügenVor(d, dVergleich); SortiertEinfügen(d); KnotenEntfernen(d); AnfangEntfernen(): DATENELEMENT; EndeEntfernen(): DATENELEMENT; Suchen(s): DATENELEMENT; InformationAusgeben(); LängeGeben(): GANZZAHL
assoc STAPEL -> LISTE : nutzt [1]
:::

Im Kontrast dazu die Warteschlange, die *dieselbe* Liste nutzt, aber hinten einfügt:

:::diagram classes caption="WARTESCHLANGE nutzt LISTE: hinten einfügen, vorne entfernen"
class WARTESCHLANGE @0,0 | liste: LISTE | Konstruktor(); HintenEinfügen(d: DATENELEMENT); AnfangEntfernen(): DATENELEMENT
class LISTE @1.55,0 | anfang: LISTENELEMENT | VorneEinfügen(d); HintenEinfügen(d); AnfangEntfernen(): DATENELEMENT; …
assoc WARTESCHLANGE -> LISTE : nutzt [1]
:::

Jede Methode des Stapels ist eine einzige Zeile, die die Arbeit an die Liste **delegiert**:

```pseudo
klasse STAPEL
  liste: LISTE

  Konstruktor()
    liste = neu LISTE()

  methode VorneEinfügen(d: DATENELEMENT)
    liste.VorneEinfügen(d)
  endemethode

  methode DATENELEMENT AnfangEntfernen()
    return liste.AnfangEntfernen()
  endemethode
```

:::diagram objects caption="Ein Stapel, auf den erst Andi und dann Bert gelegt wurde: Bert ist der erste Knoten"
s: STAPEL @0,0 | liste -> l
l: LISTE @1,0 | anfang -> k1
k1: KNOTEN @2,0 | daten -> d2 | nachfolger -> k2
k2: KNOTEN @3,0 | daten -> d1 | nachfolger -> a
a: ABSCHLUSS @4,0
d2: PATIENT @2,1.1 | name = "Bert"
d1: PATIENT @3,1.1 | name = "Andi"
:::

**Warum nutzt der Stapel die Liste, statt von ihr zu erben?** Würde STAPEL von LISTE erben, hätte jeder Stapel auch `HintenEinfügen`, `EinfügenVor`, `EndeEntfernen` … Dann könnte man mitten in den Stapel greifen, und er wäre kein Stapel mehr. Durch das **Nutzen** (eine Assoziation, *hat eine* Liste) bestimmt der Stapel selbst, welche Operationen es gibt. Die Liste ist ein Baustein, den Stapel und Warteschlange gleichermaßen verwenden: Der Code für die Verkettung steht nur einmal im Programm.

:::viz stack
{"mode": "ops", "init": ["Andi", "Bert"], "next": "Clara"}
:::

Weil der Stapel nur am Anfang der Liste arbeitet, braucht keine seiner Operationen eine Rekursion durch die Liste: `VorneEinfügen` und `AnfangEntfernen` sind sofort fertig, egal wie viele Elemente auf dem Stapel liegen.

:::warn title="Leerer Stapel"
`AnfangEntfernen()` auf einem leeren Stapel gibt **nichts** zurück: Der Anfang der Liste ist dann der ABSCHLUSS, und sein `DatenelementGeben()` liefert nichts (C4). Wer das Ergebnis benutzt, muss also prüfen, ob etwas zurückkam. Viele Implementierungen bieten deshalb zusätzlich `IstLeer()`.
:::

## [logic] Wo Stapel gebraucht werden

Stapel werden immer dann gebraucht, wenn Objekte in **umgekehrter Reihenfolge** wieder ausgegeben werden, wie sie aufgenommen wurden.

- **Lager**: Artikel werden real übereinander gestapelt; zugreifen kann man nur auf den obersten.
- **Rangierbahnhof**: Waggons fahren auf ein Abstellgleis, das nur einen Ausgang hat, und kommen in umgekehrter Reihenfolge wieder heraus. Mit einem solchen Gleis kann man Züge umsortieren.
- **Rückgängig** im Editor und **Zurück** im Browser: Der letzte Schritt wird als erster zurückgenommen.
- **Aufrufstapel**: jede Rekursion (siehe oben).
- **Klammerausdrücke** prüfen und auswerten.

### Klammern prüfen

Ist `(3 + [4 * (2 - 1)]) * {5 - 2}` korrekt geklammert? Jede schließende Klammer muss zur **zuletzt geöffneten, noch offenen** Klammer passen. „Zuletzt geöffnet“ ist genau das Stapelprinzip:

```pseudo
methode WAHRHEITSWERT KlammernKorrekt(term)
  stapel = neu STAPEL()
  für jedes Zeichen z von term
    falls z ist ( oder [ oder { dann
      stapel.VorneEinfügen(z)
    sonst falls z ist ) oder ] oder } dann
      oben = stapel.AnfangEntfernen()
      falls oben ist nichts oder oben passt nicht zu z dann
        return falsch
      endefalls
    endefalls
  endefür
  return stapel ist leer
endemethode
```

Drei Arten von Fehlern fängt der Algorithmus ab: eine schließende Klammer ohne offene (`3)`), eine falsche Sorte (`(]`) und Klammern, die am Ende noch offen sind (`((3)`).

:::viz stack
{"mode": "brackets", "ausdruck": "(3 + [4 * (2 - 1)]) * {5 - 2}"}
:::

Gib auch `([)]` oder `((3)` ein und schau, an welcher Stelle der Algorithmus abbricht.

### Welche Reihenfolgen sind mit einem Stapel möglich?

Waggons 1, 2, 3, 4 kommen in dieser Reihenfolge an. Jeder Waggon kann aufs Abstellgleis (ablegen) oder es kann der oberste Waggon vom Gleis weiterfahren (herunternehmen). Welche Reihenfolgen können am Ausgang entstehen?

Man prüft eine gewünschte Reihenfolge, indem man sie **simuliert**: Für den nächsten gewünschten Waggon legt man so lange ankommende Waggons ab, bis er oben liegt, und nimmt ihn dann herunter. Liegt er schon im Gleis, aber nicht oben, ist die Reihenfolge **unmöglich**.

- 4, 3, 2, 1: alle vier ablegen, dann alle herunternehmen. **Möglich.**
- 2, 1, 4, 3: 1 und 2 ablegen, 2 und 1 herunternehmen, 3 und 4 ablegen, 4 und 3 herunternehmen. **Möglich.**
- 3, 1, 2, 4: 1, 2, 3 ablegen, 3 herunternehmen. Als Nächstes käme 1, aber oben liegt 2. **Unmöglich.**

:::quiz
Die Zahlen 1, 2, 3 werden in dieser Reihenfolge angeliefert und laufen über einen Stapel. Welche Ausgabe ist **nicht** möglich?
- [ ] 1, 2, 3
- [ ] 3, 2, 1
- [ ] 2, 3, 1
- [x] 3, 1, 2
--- explain
Für 3 zuerst müssen 1 und 2 schon auf dem Stapel liegen, 2 über 1. Nach 3 kann also nur 2 kommen, nie 1. Alle anderen Reihenfolgen lassen sich simulieren (z. B. 2, 3, 1: 1 und 2 ablegen, 2 herunter, 3 ablegen und herunter, 1 herunter).
:::

## [logic] Die elektronische Patientenakte (12_II_5_Aufgabe_3)

In der Arztpraxis aus C1 wurde von jedem Patienten bisher nur der Name gespeichert. Jetzt soll jeder Patient eine **elektronische Patientenakte** bekommen, in der alle Behandlungen gespeichert werden.

**a) Warum ein Stapel?** Wer behandelt, will zuerst sehen, was **zuletzt** passiert ist: die letzte Diagnose, das zuletzt verschriebene Medikament. Bei einem Stapel liegt der neueste Eintrag immer **oben**; man liest die Akte von oben nach unten und sieht die Behandlungen in umgekehrter zeitlicher Reihenfolge, das Aktuellste zuerst. Alte Einträge bleiben darunter vollständig erhalten. Für den schnellen Überblick ist das genau richtig.

**b) Umsetzung.** Jeder PATIENT bekommt ein Attribut `akte` vom Typ STAPEL. Die Behandlungsdaten werden eigene Datenelemente (Klasse BEHANDLUNG). Damit die Akte komplett ausgegeben werden kann, bekommt der Stapel eine Methode `InformationAusgeben()`, die (wie alles beim Stapel) an die Liste delegiert. Die Liste gibt vom Anfang aus, also vom obersten Element aus.

:::diagram classes caption="Patient mit elektronischer Patientenakte"
class PATIENT @0,0 | name; akte: STAPEL | BehandlungEintragen(b: BEHANDLUNG); AkteAusgeben()
class STAPEL @1.35,0 | liste: LISTE | VorneEinfügen(d); AnfangEntfernen(): DATENELEMENT; InformationAusgeben()
class LISTE @2.6,0 | anfang: LISTENELEMENT | VorneEinfügen(d); AnfangEntfernen(): DATENELEMENT; InformationAusgeben()
class BEHANDLUNG @1.35,1.1 | datum; beschreibung | InformationAusgeben()
assoc PATIENT -> STAPEL : akte [1]
assoc STAPEL -> LISTE : nutzt [1]
assoc STAPEL -> BEHANDLUNG : enthält als Datenelemente [*]
:::

:::warn title="Ausgeben ohne zu zerstören"
Man könnte die Akte auch ausgeben, indem man so lange `AnfangEntfernen()` aufruft, bis der Stapel leer ist. Dann ist die Akte danach aber **leer**. Wer nur die zwei Stapeloperationen benutzen darf, muss die Einträge beim Herunternehmen auf einen Hilfsstapel legen und danach zurücklegen.
:::

## [logic] Cheese-Champions (12_II_5_Aufgabe_5)

Diese Aufgabe stammt aus dem 17. Bundeswettbewerb Informatik. Prof. Grips lässt die Mäuse einer Kolonie nacheinander von links in einen unterirdischen Gang laufen. Ein Abzweig führt in einem spitzen Winkel nach oben zum Käse. Jede Maus muss erst **am Abzweig vorbei** in den rechten Teil des Gangs. Dort kann sie entweder den **Zweikampf** gegen die nachfolgende Maus gewinnen und durch den Abzweig zum Käse laufen, oder sie verliert und wird **weiter in den Gang geschoben**. Die Mäuse sind in der Reihenfolge ihres Eintritts mit 1, 2, 3 … nummeriert. Beobachtet wird die Reihenfolge, in der sie beim Käse ankommen.

**Der rechte Gang ist ein Stapel.** Der Gang hat nur einen Ausgang, den Abzweig. Wer zuletzt hineinkam, liegt vorne am Abzweig und kommt als Erster wieder heraus. Eine verlorene Maus wird tiefer geschoben, und die Siegerin liegt oben: Das ist **ablegen**. Eine Maus, die zum Käse läuft, verlässt den Gang von oben: Das ist **herunternehmen**.

Daraus folgt der Algorithmus. Gehe die beobachtete Reihenfolge Maus für Maus durch. Für die nächste erwartete Maus *t*:

1. Liegt *t* **oben** im Gang, läuft sie zum Käse (herunternehmen). Kommt noch eine Maus nach, hat *t* gegen sie einen **Zweikampf gewonnen**.
2. Sonst muss die nächste Maus *f* aus dem Eingang in den Gang (ablegen). Lag dort schon eine Maus, hat *f* gegen sie einen **Zweikampf gewonnen** und sie tiefer geschoben.
3. Kommt keine Maus mehr nach und *t* liegt nicht oben, ist die Reihenfolge **unmöglich**. Beispiel 3, 1, 2: Für 3 müssen 1 und 2 schon im Gang liegen, 2 über 1. Danach kann 1 nicht vor 2 heraus.

:::viz mice
{"order": [3, 2, 4, 1]}
:::

Die Beispiele „BWInf a“ bis „c“ in der Auswahl sind die offiziellen Testdaten der Aufgabe. Du programmierst den Algorithmus unten im letzten Python-Block.

## [bridge] Vom Pseudocode zu Python

Der Stapel aus der Vorlage deiner Lehrkraft (Projekt `1_6_A03_Patientenakte`) benutzt die Kompositum-Liste mit den Namen `VorneEinfuegen` und `AnfangEntfernen`:

:::bridge title="STAPEL nutzt LISTE"
klasse STAPEL || class Stapel:
  Konstruktor() ||     def __init__(self):
    liste = neu LISTE() ||         self.liste = Liste()
  methode VorneEinfügen(d) ||     def VorneEinfuegen(self, dNeu):
    liste.VorneEinfügen(d) ||         self.liste.VorneEinfuegen(dNeu)
  methode AnfangEntfernen() ||     def AnfangEntfernen(self):
    return liste.AnfangEntfernen() ||         return self.liste.AnfangEntfernen()
>> Jede Methode ist eine einzige weitergeleitete Nachricht. Das Attribut `self.liste` ist die Assoziation „nutzt“ aus dem Klassendiagramm.
:::

:::bridge title="Liste.AnfangEntfernen aus der Vorlage (Kompositum)"
methode AnfangEntfernen() ||     def AnfangEntfernen(self):
  d = anfang.DatenelementGeben() ||         d = self.anfang.DatenelementGeben()
  anfang = anfang.NachfolgerGeben() ||         self.anfang = self.anfang.NachfolgerGeben()
  return d ||         return d
>> Beim leeren Stapel ist `anfang` der Abschluss: `DatenelementGeben()` liefert `None`, `NachfolgerGeben()` liefert den Abschluss selbst. Es braucht keine Prüfung.
:::

:::trace title="Ein Stapel mit drei Paketen"
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


class Stapel:
    def __init__(self):
        self.liste = Liste()

    def VorneEinfuegen(self, dNeu):
        self.liste.VorneEinfuegen(dNeu)

    def AnfangEntfernen(self):
        return self.liste.AnfangEntfernen()


s = Stapel()
s.VorneEinfuegen("A")
s.VorneEinfuegen("B")
s.VorneEinfuegen("C")
print(s.AnfangEntfernen())
print(s.AnfangEntfernen())
:::

## [python] Python-Blöcke

Die Blöcke verwenden die Kompositum-Liste aus der Vorlage deiner Lehrkraft (gekürzt auf die Methoden, die hier gebraucht werden). Die Liste ist jeweils gegeben; du schreibst nur, was darüber liegt.

:::exercise id=c5-stapel title="Die Klasse Stapel" level=1
Schreib die Klasse `Stapel`, die eine `Liste` **nutzt** (Attribut `self.liste`):

- `VorneEinfuegen(dNeu)` legt `dNeu` oben ab,
- `AnfangEntfernen()` nimmt das oberste Element herunter und gibt es zurück (`None` beim leeren Stapel),
- `LaengeGeben()` gibt die Anzahl der Elemente zurück.

Benutze dafür nur die Methoden der Liste, keine Python-Liste `[]`.
--- starter
from abc import ABC, abstractmethod


class Listenelement(ABC):
    @abstractmethod
    def RestlaengeGeben(self):
        pass

    @abstractmethod
    def DatenelementGeben(self):
        pass

    @abstractmethod
    def NachfolgerGeben(self):
        pass


class Abschluss(Listenelement):
    def RestlaengeGeben(self):
        return 0

    def DatenelementGeben(self):
        return None

    def NachfolgerGeben(self):
        return self


class Knoten(Listenelement):
    def __init__(self, dNeu, lNeu):
        self.daten = dNeu
        self.nachfolger = lNeu

    def RestlaengeGeben(self):
        return 1 + self.nachfolger.RestlaengeGeben()

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

    def LaengeGeben(self):
        return self.anfang.RestlaengeGeben()


class Stapel:
    def __init__(self):
        pass

    def VorneEinfuegen(self, dNeu):
        pass

    def AnfangEntfernen(self):
        pass

    def LaengeGeben(self):
        pass


s = Stapel()
s.VorneEinfuegen("A")
s.VorneEinfuegen("B")
print(s.AnfangEntfernen())
--- solution
from abc import ABC, abstractmethod


class Listenelement(ABC):
    @abstractmethod
    def RestlaengeGeben(self):
        pass

    @abstractmethod
    def DatenelementGeben(self):
        pass

    @abstractmethod
    def NachfolgerGeben(self):
        pass


class Abschluss(Listenelement):
    def RestlaengeGeben(self):
        return 0

    def DatenelementGeben(self):
        return None

    def NachfolgerGeben(self):
        return self


class Knoten(Listenelement):
    def __init__(self, dNeu, lNeu):
        self.daten = dNeu
        self.nachfolger = lNeu

    def RestlaengeGeben(self):
        return 1 + self.nachfolger.RestlaengeGeben()

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

    def LaengeGeben(self):
        return self.anfang.RestlaengeGeben()


class Stapel:
    def __init__(self):
        self.liste = Liste()

    def VorneEinfuegen(self, dNeu):
        self.liste.VorneEinfuegen(dNeu)

    def AnfangEntfernen(self):
        return self.liste.AnfangEntfernen()

    def LaengeGeben(self):
        return self.liste.LaengeGeben()


s = Stapel()
s.VorneEinfuegen("A")
s.VorneEinfuegen("B")
print(s.AnfangEntfernen())
--- tests
import ast

@test("Der Stapel hat eine Liste")
def _():
    s = Stapel()
    ok(isinstance(getattr(s, "liste", None), Liste), "Stapel() muss im Konstruktor self.liste = Liste() anlegen")

@test("LIFO: zuletzt abgelegt, zuerst heruntergenommen")
def _():
    s = Stapel()
    for x in ["A", "B", "C"]:
        s.VorneEinfuegen(x)
    eq(s.LaengeGeben(), 3, "LaengeGeben() nach drei Elementen")
    eq([s.AnfangEntfernen(), s.AnfangEntfernen()], ["C", "B"], "die ersten beiden heruntergenommenen Elemente")
    s.VorneEinfuegen("D")
    eq([s.AnfangEntfernen(), s.AnfangEntfernen()], ["D", "A"], "danach")
    eq(s.LaengeGeben(), 0, "LaengeGeben() des leeren Stapels")

@test("Leerer Stapel")
def _():
    s = Stapel()
    eq(s.AnfangEntfernen(), None, "AnfangEntfernen() beim leeren Stapel")
    s.VorneEinfuegen("X")
    eq(s.AnfangEntfernen(), "X", "danach funktioniert der Stapel weiter")

@test("Die Daten liegen in der Liste (oben = erster Knoten)")
def _():
    s = Stapel()
    s.VorneEinfuegen("A")
    s.VorneEinfuegen("B")
    ok(isinstance(s.liste.anfang, Knoten) and s.liste.anfang.daten == "B", "das zuletzt abgelegte Element muss der erste Knoten der Liste sein")

@test("Keine Python-Liste im Stapel")
def _():
    for node in ast.parse(SOURCE).body:
        if isinstance(node, ast.ClassDef) and node.name == "Stapel":
            for n in ast.walk(node):
                ok(not isinstance(n, (ast.List, ast.ListComp)), "Der Stapel soll die Liste aus der Vorlage nutzen, keine Python-Liste [] (Zeile %d)" % getattr(n, "lineno", 0))
--- hint
Im Konstruktor: `self.liste = Liste()`. Jede andere Methode ruft die gleichnamige Methode von `self.liste` auf.
--- hint
Vergiss bei `AnfangEntfernen` und `LaengeGeben` das `return` nicht, sonst gibt die Methode `None` zurück.
--- explain
Der Stapel delegiert: Jede seiner Methoden leitet die Nachricht an die Liste weiter. Dass oben = vorne ist, folgt daraus, dass beide Operationen am Anfang der Liste arbeiten.
:::

:::exercise id=c5-oben title="ObenGeben und IstLeer" level=2
Erweitere den Stapel um zwei Methoden, die in vielen Programmen gebraucht werden:

- `IstLeer()` gibt `True` zurück, wenn kein Element auf dem Stapel liegt.
- `ObenGeben()` gibt das oberste Element zurück, **ohne** es zu entfernen (`None` beim leeren Stapel).

Benutze in `ObenGeben` **nur** die eigenen Methoden `AnfangEntfernen` und `VorneEinfuegen`, nicht `self.liste.anfang`.
--- starter
class Abschluss:
    def RestlaengeGeben(self):
        return 0

    def DatenelementGeben(self):
        return None

    def NachfolgerGeben(self):
        return self


class Knoten:
    def __init__(self, dNeu, lNeu):
        self.daten = dNeu
        self.nachfolger = lNeu

    def RestlaengeGeben(self):
        return 1 + self.nachfolger.RestlaengeGeben()

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

    def LaengeGeben(self):
        return self.anfang.RestlaengeGeben()


class Stapel:
    def __init__(self):
        self.liste = Liste()

    def VorneEinfuegen(self, dNeu):
        self.liste.VorneEinfuegen(dNeu)

    def AnfangEntfernen(self):
        return self.liste.AnfangEntfernen()

    def IstLeer(self):
        pass

    def ObenGeben(self):
        pass
--- solution
class Abschluss:
    def RestlaengeGeben(self):
        return 0

    def DatenelementGeben(self):
        return None

    def NachfolgerGeben(self):
        return self


class Knoten:
    def __init__(self, dNeu, lNeu):
        self.daten = dNeu
        self.nachfolger = lNeu

    def RestlaengeGeben(self):
        return 1 + self.nachfolger.RestlaengeGeben()

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

    def LaengeGeben(self):
        return self.anfang.RestlaengeGeben()


class Stapel:
    def __init__(self):
        self.liste = Liste()

    def VorneEinfuegen(self, dNeu):
        self.liste.VorneEinfuegen(dNeu)

    def AnfangEntfernen(self):
        return self.liste.AnfangEntfernen()

    def IstLeer(self):
        return self.liste.LaengeGeben() == 0

    def ObenGeben(self):
        d = self.AnfangEntfernen()
        if d is not None:
            self.VorneEinfuegen(d)
        return d
--- tests
import ast

@test("IstLeer")
def _():
    s = Stapel()
    eq(s.IstLeer(), True, "IstLeer() beim neuen Stapel")
    s.VorneEinfuegen("A")
    eq(s.IstLeer(), False, "IstLeer() mit einem Element")
    s.AnfangEntfernen()
    eq(s.IstLeer(), True, "IstLeer() nach dem Herunternehmen")

@test("ObenGeben lässt den Stapel unverändert")
def _():
    s = Stapel()
    eq(s.ObenGeben(), None, "ObenGeben() beim leeren Stapel")
    ok(isinstance(s.liste.anfang, Abschluss), "ObenGeben() darf beim leeren Stapel nichts ablegen (sonst liegt dort ein Knoten mit None)")
    s.VorneEinfuegen("A")
    s.VorneEinfuegen("B")
    eq(s.ObenGeben(), "B", "ObenGeben()")
    eq(s.ObenGeben(), "B", "ObenGeben() ein zweites Mal")
    eq(s.liste.LaengeGeben(), 2, "Länge nach zweimal ObenGeben()")
    eq([s.AnfangEntfernen(), s.AnfangEntfernen()], ["B", "A"], "Reihenfolge beim Herunternehmen")

@test("ObenGeben greift nicht auf self.liste.anfang zu")
def _():
    for node in ast.parse(SOURCE).body:
        if isinstance(node, ast.ClassDef) and node.name == "Stapel":
            for fn in node.body:
                if isinstance(fn, ast.FunctionDef) and fn.name == "ObenGeben":
                    names = {n.attr for n in ast.walk(fn) if isinstance(n, ast.Attribute)}
                    ok("anfang" not in names, "Benutze in ObenGeben nur AnfangEntfernen und VorneEinfuegen")
--- hint
`IstLeer`: Die Liste kennt ihre Länge.
--- hint
`ObenGeben`: Nimm das oberste Element herunter und leg es sofort wieder zurück. Aber nur, wenn es wirklich eines gab!
--- explain
`ObenGeben` zeigt, dass zwei Operationen genügen: Herunternehmen und Zurücklegen lässt den Stapel unverändert. Die Prüfung `d is not None` verhindert, dass beim leeren Stapel ein Knoten mit `None` als Daten entsteht.
:::

:::exercise id=c5-umdrehen title="Ein Wort umdrehen" level=1
Schreib eine Funktion `Umdrehen(text)`, die `text` rückwärts zurückgibt. Leg dazu jedes Zeichen auf einen Stapel und nimm sie dann alle wieder herunter. Der Stapel ist gegeben (mit `IstLeer`).
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


def Umdrehen(text):
    pass


print(Umdrehen("Stapel"))
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


def Umdrehen(text):
    s = Stapel()
    for zeichen in text:
        s.VorneEinfuegen(zeichen)
    ergebnis = ""
    while not s.IstLeer():
        ergebnis = ergebnis + s.AnfangEntfernen()
    return ergebnis


print(Umdrehen("Stapel"))
--- tests
import ast

@test("Umdrehen")
def _():
    eq(Umdrehen("Stapel"), "lepatS", 'Umdrehen("Stapel")')
    eq(Umdrehen("a"), "a", 'Umdrehen("a")')
    eq(Umdrehen(""), "", 'Umdrehen("")')
    eq(Umdrehen("Rotor"), "rotoR", 'Umdrehen("Rotor")')

@test("Mit einem Stapel")
def _():
    src = ast.parse(SOURCE)
    for node in src.body:
        if isinstance(node, ast.FunctionDef) and node.name == "Umdrehen":
            calls = {n.func.attr for n in ast.walk(node) if isinstance(n, ast.Call) and isinstance(n.func, ast.Attribute)}
            ok("VorneEinfuegen" in calls and "AnfangEntfernen" in calls, "Leg die Zeichen auf einen Stapel und nimm sie wieder herunter")
            ok(not any(isinstance(n, ast.Slice) for n in ast.walk(node)), "Nicht mit text[::-1], sondern mit dem Stapel")
--- hint
Zwei Schleifen: `for zeichen in text:` legt ab; `while not s.IstLeer():` nimmt herunter und hängt an einen Ergebnis-String an.
--- explain
Was zuletzt abgelegt wurde (das letzte Zeichen), kommt zuerst heraus. Ein Stapel kehrt eine Reihenfolge immer um; genau das nutzen der Zurück-Knopf und die Rückgängig-Funktion.
:::

:::exercise id=c5-akte title="Elektronische Patientenakte (12_II_5_Aufgabe_3 b)" level=2
Jeder `Patient` bekommt eine Akte vom Typ `Stapel`.

1. `Stapel.InformationAusgeben()`: gibt alle Elemente von oben nach unten aus. Delegiere an die Liste (`Liste.InformationAusgeben` ist gegeben).
2. `Patient.__init__`: zusätzlich `self.akte = Stapel()`.
3. `Patient.BehandlungEintragen(datum, beschreibung)`: legt ein neues `Behandlung`-Objekt in die Akte.
4. `Patient.LetzteBehandlungGeben()`: gibt die neueste Behandlung zurück, **ohne** sie aus der Akte zu entfernen (`ObenGeben` ist gegeben).
5. `Patient.AkteAusgeben()`: gibt zuerst den Namen aus, dann die ganze Akte (neueste zuerst). Danach muss die Akte noch vollständig sein.
--- starter
class Behandlung:
    def __init__(self, datum, beschreibung):
        self.datum = datum
        self.beschreibung = beschreibung

    def InformationAusgeben(self):
        print(self.datum + ": " + self.beschreibung)


class Abschluss:
    def DatenelementGeben(self):
        return None

    def NachfolgerGeben(self):
        return self

    def InformationAusgeben(self):
        pass


class Knoten:
    def __init__(self, dNeu, lNeu):
        self.daten = dNeu
        self.nachfolger = lNeu

    def DatenelementGeben(self):
        return self.daten

    def NachfolgerGeben(self):
        return self.nachfolger

    def InformationAusgeben(self):
        self.daten.InformationAusgeben()
        self.nachfolger.InformationAusgeben()


class Liste:
    def __init__(self):
        self.anfang = Abschluss()

    def VorneEinfuegen(self, dNeu):
        self.anfang = Knoten(dNeu, self.anfang)

    def AnfangEntfernen(self):
        d = self.anfang.DatenelementGeben()
        self.anfang = self.anfang.NachfolgerGeben()
        return d

    def InformationAusgeben(self):
        self.anfang.InformationAusgeben()


class Stapel:
    def __init__(self):
        self.liste = Liste()

    def VorneEinfuegen(self, dNeu):
        self.liste.VorneEinfuegen(dNeu)

    def AnfangEntfernen(self):
        return self.liste.AnfangEntfernen()

    def ObenGeben(self):
        d = self.AnfangEntfernen()
        if d is not None:
            self.VorneEinfuegen(d)
        return d

    def InformationAusgeben(self):
        pass


class Patient:
    def __init__(self, s):
        self.name = s

    def BehandlungEintragen(self, datum, beschreibung):
        pass

    def LetzteBehandlungGeben(self):
        pass

    def AkteAusgeben(self):
        pass


p = Patient("Andi")
p.BehandlungEintragen("03.11.", "Grippe, Bettruhe")
p.BehandlungEintragen("10.11.", "Kontrolle, gesund")
p.AkteAusgeben()
--- solution
class Behandlung:
    def __init__(self, datum, beschreibung):
        self.datum = datum
        self.beschreibung = beschreibung

    def InformationAusgeben(self):
        print(self.datum + ": " + self.beschreibung)


class Abschluss:
    def DatenelementGeben(self):
        return None

    def NachfolgerGeben(self):
        return self

    def InformationAusgeben(self):
        pass


class Knoten:
    def __init__(self, dNeu, lNeu):
        self.daten = dNeu
        self.nachfolger = lNeu

    def DatenelementGeben(self):
        return self.daten

    def NachfolgerGeben(self):
        return self.nachfolger

    def InformationAusgeben(self):
        self.daten.InformationAusgeben()
        self.nachfolger.InformationAusgeben()


class Liste:
    def __init__(self):
        self.anfang = Abschluss()

    def VorneEinfuegen(self, dNeu):
        self.anfang = Knoten(dNeu, self.anfang)

    def AnfangEntfernen(self):
        d = self.anfang.DatenelementGeben()
        self.anfang = self.anfang.NachfolgerGeben()
        return d

    def InformationAusgeben(self):
        self.anfang.InformationAusgeben()


class Stapel:
    def __init__(self):
        self.liste = Liste()

    def VorneEinfuegen(self, dNeu):
        self.liste.VorneEinfuegen(dNeu)

    def AnfangEntfernen(self):
        return self.liste.AnfangEntfernen()

    def ObenGeben(self):
        d = self.AnfangEntfernen()
        if d is not None:
            self.VorneEinfuegen(d)
        return d

    def InformationAusgeben(self):
        self.liste.InformationAusgeben()


class Patient:
    def __init__(self, s):
        self.name = s
        self.akte = Stapel()

    def BehandlungEintragen(self, datum, beschreibung):
        self.akte.VorneEinfuegen(Behandlung(datum, beschreibung))

    def LetzteBehandlungGeben(self):
        return self.akte.ObenGeben()

    def AkteAusgeben(self):
        print(self.name)
        self.akte.InformationAusgeben()


p = Patient("Andi")
p.BehandlungEintragen("03.11.", "Grippe, Bettruhe")
p.BehandlungEintragen("10.11.", "Kontrolle, gesund")
p.AkteAusgeben()
--- tests
@test("Jeder Patient hat eine eigene Akte")
def _():
    a = Patient("Andi")
    b = Patient("Bert")
    ok(isinstance(getattr(a, "akte", None), Stapel), "Patient braucht das Attribut akte (ein Stapel)")
    ok(a.akte is not b.akte, "jeder Patient braucht einen eigenen Stapel")

@test("BehandlungEintragen und LetzteBehandlungGeben")
def _():
    p = Patient("Clara")
    eq(p.LetzteBehandlungGeben(), None, "LetzteBehandlungGeben() bei leerer Akte")
    p.BehandlungEintragen("01.10.", "Impfung")
    p.BehandlungEintragen("15.10.", "Husten")
    b = p.LetzteBehandlungGeben()
    ok(isinstance(b, Behandlung), "LetzteBehandlungGeben() muss ein Behandlung-Objekt zurückgeben")
    eq(b.beschreibung, "Husten", "neueste Behandlung")
    eq(p.LetzteBehandlungGeben().beschreibung, "Husten", "LetzteBehandlungGeben() darf nichts entfernen")

@test("AkteAusgeben: Name, dann neueste zuerst")
def _():
    p = Patient("Dora")
    p.BehandlungEintragen("01.10.", "A")
    p.BehandlungEintragen("02.10.", "B")
    p.BehandlungEintragen("03.10.", "C")
    eq(lines(printed(p.AkteAusgeben)), ["Dora", "03.10.: C", "02.10.: B", "01.10.: A"], "Ausgabe von AkteAusgeben()")
    eq(lines(printed(p.AkteAusgeben)), ["Dora", "03.10.: C", "02.10.: B", "01.10.: A"], "zweite Ausgabe (die Akte muss vollständig bleiben)")

@test("Ausgabe des Programms")
def _():
    eq(lines(OUTPUT), ["Andi", "10.11.: Kontrolle, gesund", "03.11.: Grippe, Bettruhe"], "Ausgabe")
--- hint
`Stapel.InformationAusgeben`: eine Zeile, `self.liste.InformationAusgeben()`.
--- hint
`BehandlungEintragen`: Erzeuge mit `Behandlung(datum, beschreibung)` ein neues Objekt und leg es mit `self.akte.VorneEinfuegen(...)` ab.
--- explain
Die Liste gibt vom Anfang aus, und beim Stapel ist der Anfang oben. Deshalb erscheint die neueste Behandlung zuerst, ohne dass etwas umsortiert werden muss. `AkteAusgeben` entfernt nichts, also bleibt die Akte vollständig.
:::

:::exercise id=c5-klammern title="Klammern prüfen" level=2
Schreib `KlammernKorrekt(term)`: Sie gibt `True` zurück, wenn `term` korrekt geklammert ist (Klammerarten `()`, `[]`, `{}`), sonst `False`. Alle anderen Zeichen werden übersprungen. Benutze den gegebenen Stapel.
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


def KlammernKorrekt(term):
    pass


print(KlammernKorrekt("(3 + [4 * (2 - 1)]) * {5 - 2}"))
print(KlammernKorrekt("([)]"))
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


def KlammernKorrekt(term):
    passend = {")": "(", "]": "[", "}": "{"}
    s = Stapel()
    for z in term:
        if z in "([{":
            s.VorneEinfuegen(z)
        elif z in ")]}":
            oben = s.AnfangEntfernen()
            if oben != passend[z]:
                return False
    return s.IstLeer()


print(KlammernKorrekt("(3 + [4 * (2 - 1)]) * {5 - 2}"))
print(KlammernKorrekt("([)]"))
--- tests
@test("Korrekte Terme")
def _():
    for t in ["(3 + [4 * (2 - 1)]) * {5 - 2}", "", "abc", "()[]{}", "{[()()]}", "((()))"]:
        eq(KlammernKorrekt(t), True, "KlammernKorrekt(%r)" % t)

@test("Falsche Sorte")
def _():
    for t in ["(]", "([)]", "{(})"]:
        eq(KlammernKorrekt(t), False, "KlammernKorrekt(%r)" % t)

@test("Schließende Klammer ohne offene")
def _():
    for t in [")", "3)", "())", ")("]:
        eq(KlammernKorrekt(t), False, "KlammernKorrekt(%r)" % t)

@test("Am Ende noch offen")
def _():
    for t in ["(", "((3)", "{[]"]:
        eq(KlammernKorrekt(t), False, "KlammernKorrekt(%r)" % t)

@test("Ausgabe des Programms")
def _():
    eq(lines(OUTPUT), ["True", "False"], "Ausgabe")
--- hint
Ein Wörterbuch `{")": "(", "]": "[", "}": "{"}` sagt dir, welche öffnende Klammer zu einer schließenden passt.
--- hint
Bei einer schließenden Klammer: oberste Klammer herunternehmen und vergleichen. Ist der Stapel leer, kommt `None` zurück, und das passt zu keiner Klammer. Am Ende: korrekt nur, wenn der Stapel leer ist.
--- explain
Drei Fehlerfälle, ein Mechanismus: Der Stapel merkt sich die offenen Klammern in der Reihenfolge, in der sie geschlossen werden müssen. `None` vom leeren Stapel wird durch den Vergleich automatisch als Fehler erkannt.
:::

:::exercise id=c5-maeuse title="Cheese-Champions (12_II_5_Aufgabe_5)" level=3
Schreib `Zweikaempfe(reihenfolge)`. `reihenfolge` ist die beobachtete Reihenfolge am Käse, z. B. `[3, 2, 4, 1]`. Die Funktion gibt eine Python-Liste zurück, deren Eintrag mit Index `i` angibt, wie viele Zweikämpfe Maus `i + 1` gewonnen hat. Ist die Reihenfolge unmöglich, gibt sie `None` zurück. Verwende für den rechten Gang den gegebenen `Stapel` (mit `ObenGeben` und `IstLeer`). Die Regeln stehen im Logik-Teil oben.
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

    def ObenGeben(self):
        return self.anfang.DatenelementGeben()

    def IstLeer(self):
        return isinstance(self.anfang, Abschluss)


def Zweikaempfe(reihenfolge):
    n = len(reihenfolge)
    siege = [0] * n
    gang = Stapel()
    naechste = 1          # die nächste Maus, die noch im Eingang wartet
    # dein Code
    return siege


print(Zweikaempfe([3, 2, 4, 1]))
print(Zweikaempfe([3, 1, 2]))
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

    def ObenGeben(self):
        return self.anfang.DatenelementGeben()

    def IstLeer(self):
        return isinstance(self.anfang, Abschluss)


def Zweikaempfe(reihenfolge):
    n = len(reihenfolge)
    if sorted(reihenfolge) != list(range(1, n + 1)):
        return None
    siege = [0] * n
    gang = Stapel()
    naechste = 1          # die nächste Maus, die noch im Eingang wartet
    for maus in reihenfolge:
        while gang.ObenGeben() != maus:
            if naechste > n:
                return None              # maus steckt tiefer im Gang: unmöglich
            if not gang.IstLeer():
                siege[naechste - 1] += 1  # die Neue schiebt die obere Maus tiefer
            gang.VorneEinfuegen(naechste)
            naechste += 1
        gang.AnfangEntfernen()           # maus läuft zum Käse
        if naechste <= n:
            siege[maus - 1] += 1         # ... und hat gegen die nachfolgende gewonnen
    return siege


print(Zweikaempfe([3, 2, 4, 1]))
print(Zweikaempfe([3, 1, 2]))
--- tests
@test("Kleine Beispiele")
def _():
    eq(Zweikaempfe([3, 2, 4, 1]), [0, 2, 2, 1], "Zweikaempfe([3, 2, 4, 1])")
    eq(Zweikaempfe([1, 2, 3]), [1, 1, 0], "Zweikaempfe([1, 2, 3])")
    eq(Zweikaempfe([3, 2, 1]), [0, 1, 1], "Zweikaempfe([3, 2, 1])")
    eq(Zweikaempfe([1]), [0], "Zweikaempfe([1])")

@test("Unmögliche Reihenfolgen")
def _():
    eq(Zweikaempfe([3, 1, 2]), None, "Zweikaempfe([3, 1, 2])")
    eq(Zweikaempfe([4, 5, 3, 1, 2, 6]), None, "BWInf c: Zweikaempfe([4, 5, 3, 1, 2, 6])")
    eq(Zweikaempfe([2, 4, 1, 3]), None, "Zweikaempfe([2, 4, 1, 3])")

@test("Offizielle Testdaten a und b")
def _():
    eq(Zweikaempfe([7, 6, 5, 4, 3, 2, 8, 9, 1]), [0, 2, 2, 2, 2, 2, 2, 2, 1], "BWInf a")
    eq(Zweikaempfe([1, 3, 4, 6, 7, 10, 9, 11, 12, 8, 5, 2]), [1, 0, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1], "BWInf b")

@test("Ungültige Eingabe")
def _():
    eq(Zweikaempfe([1, 1, 2]), None, "Zweikaempfe([1, 1, 2]) (Maus 1 doppelt)")
--- hint
Für jede erwartete Maus: Solange sie nicht oben im Gang liegt (`gang.ObenGeben() != maus`), muss die nächste Maus aus dem Eingang in den Gang. Gibt es keine mehr (`naechste > n`), ist die Reihenfolge unmöglich.
--- hint
Wer gewinnt? Kommt eine Maus in einen Gang, in dem schon eine liegt, gewinnt die **neue**. Läuft eine Maus zum Käse, während noch Mäuse im Eingang warten, gewinnt die **gehende**.
--- hint
Prüfe am Anfang, ob jede Zahl von 1 bis n genau einmal vorkommt: `sorted(reihenfolge) != list(range(1, n + 1))`.
--- explain
Der Gang ist ein Stapel, die Simulation ist dieselbe wie bei den Waggons: ablegen, bis die gewünschte Maus oben liegt, dann herunternehmen. Jeder Zweikampf gehört zu genau einem dieser Schritte: Beim Ablegen gewinnt die neue Maus gegen die obere, beim Herunternehmen gewinnt die gehende gegen die nachfolgende.
:::

## [exam] Klausurtraining

:::exam title="LIFO und FIFO" points=3
Erkläre die Begriffe LIFO und FIFO und ordne sie den Datenstrukturen Stapel und Warteschlange zu. Nenne zu jeder Struktur ein Beispiel aus dem Alltag oder der Informatik.
--- solution
**LIFO** (*last in, first out*): Das zuletzt aufgenommene Element wird als erstes wieder entnommen. Das ist der **Stapel**, z. B. ein Tellerstapel, der Aufrufstapel bei Methodenaufrufen oder der Zurück-Knopf im Browser.

**FIFO** (*first in, first out*): Das zuerst aufgenommene Element wird als erstes entnommen. Das ist die **Warteschlange**, z. B. die Kasse im Supermarkt, das Wartezimmer oder die Druckerwarteschlange.
:::

::::exam title="Stapel implementieren" points=4
Ein STAPEL soll eine bereits implementierte LISTE (Kompositum) nutzen. Zeichne das Klassendiagramm mit STAPEL und LISTE und gib die Methoden `VorneEinfügen` und `AnfangEntfernen` des Stapels in Pseudocode an. Begründe, warum STAPEL die LISTE nutzt und nicht von ihr erbt.
--- solution
:::diagram classes
class STAPEL @0,0 | liste: LISTE | VorneEinfügen(d: DATENELEMENT); AnfangEntfernen(): DATENELEMENT
class LISTE @1.4,0 | anfang: LISTENELEMENT | VorneEinfügen(d); AnfangEntfernen(): DATENELEMENT; …
assoc STAPEL -> LISTE : nutzt [1]
:::

```pseudo
methode VorneEinfügen(d: DATENELEMENT)
  liste.VorneEinfügen(d)
endemethode

methode DATENELEMENT AnfangEntfernen()
  return liste.AnfangEntfernen()
endemethode
```

Bei Vererbung hätte der Stapel alle Methoden der Liste (HintenEinfügen, EinfügenVor, EndeEntfernen …), und man könnte gegen das LIFO-Prinzip verstoßen. Durch das Nutzen bietet der Stapel nur die beiden erlaubten Operationen an und verwendet trotzdem den fertigen Code der Liste.
::::

::::exam title="Objektdiagramm eines Stapels" points=3
Ein leerer Stapel (der eine Kompositum-Liste nutzt) erhält nacheinander: `VorneEinfügen(p1)`, `VorneEinfügen(p2)`, `AnfangEntfernen()`, `VorneEinfügen(p3)`. Zeichne das Objektdiagramm danach. Die Patienten p1, p2, p3 musst du nur als Kästchen mit Namen zeichnen.
--- solution
:::diagram objects
s: STAPEL @0,0 | liste -> l
l: LISTE @1,0 | anfang -> k3
k3: KNOTEN @2,0 | daten -> p3 | nachfolger -> k1
k1: KNOTEN @3,0 | daten -> p1 | nachfolger -> a
a: ABSCHLUSS @4,0
p3: PATIENT @2,1.1 | name = "p3"
p1: PATIENT @3,1.1 | name = "p1"
:::
p2 wurde heruntergenommen; sein Knoten wird von nichts mehr referenziert und ist nicht mehr Teil der Struktur. p3 liegt oben (erster Knoten), p1 darunter, am Ende der ABSCHLUSS.
::::

:::exam title="Der Aufrufstapel" points=4
Gegeben ist die rekursive Methode `Fakultät(n)` aus B1. Zeichne den Aufrufstapel für `Fakultät(3)` zu dem Zeitpunkt, an dem er am höchsten ist, und beschreibe, was beim Abbau passiert. Welche Informationen werden zu jedem Aufruf gespeichert?
--- solution
Am höchsten Punkt liegen von unten nach oben: `Fakultät(3)`, `Fakultät(2)`, `Fakultät(1)`, `Fakultät(0)`. Nur der oberste Aufruf arbeitet; die anderen warten auf ihr Teilergebnis.

Abbau: `Fakultät(0)` erreicht die Abbruchbedingung, gibt 1 zurück und wird vom Stapel geholt. `Fakultät(1)` rechnet 1 · 1 = 1 und wird entfernt, dann `Fakultät(2)`: 2 · 1 = 2, zuletzt `Fakultät(3)`: 3 · 2 = 6.

Gespeichert werden zu jedem Aufruf das ausführende **Objekt**, die **Stelle im Programm**, an der es nach der Rückkehr weitergeht, sowie die **Parameter und lokalen Variablen** (hier n).
:::

:::exam title="Rangiergleis" points=4
Die Waggons 1, 2, 3, 4 erreichen in dieser Reihenfolge ein Abstellgleis mit nur einem Ausgang (ein Stapel). Entscheide für jede Ausgabereihenfolge, ob sie möglich ist, und gib für die möglichen die Folge der Operationen an (A = ablegen, H = herunternehmen).
a) 2, 1, 3, 4  b) 3, 4, 2, 1  c) 4, 1, 2, 3  d) 1, 4, 2, 3
--- solution
- a) **möglich**: A A H H A H A H (1, 2 ablegen; 2, 1 herunter; 3 ablegen und herunter; 4 ablegen und herunter).
- b) **möglich**: A A A H A H H H (1, 2, 3 ablegen; 3 herunter; 4 ablegen und herunter; 2, 1 herunter).
- c) **unmöglich**: Für 4 zuerst müssen 1, 2, 3 auf dem Gleis liegen, 3 oben. Nach 4 kann nur 3 kommen.
- d) **unmöglich**: 1 ablegen und herunter, dann 2, 3, 4 ablegen, 4 herunter. Oben liegt 3, nicht 2.
:::

:::exam title="Klammerprüfung nachvollziehen" points=3
Gib für den Term `{[(a)]}(b]` an, wie der Stapel der offenen Klammern nach jeder Klammer aussieht, und an welcher Stelle und warum der Algorithmus abbricht.
--- solution
Stapel nach jeder Klammer (oben rechts): `{` → `{[` → `{[(` → `)` passt zu `(`: `{[` → `]` passt: `{` → `}` passt: leer → `(` : `(` → `]`: oben liegt `(`, das passt nicht zu `]`. Der Algorithmus gibt beim letzten Zeichen **falsch** zurück: falsche Klammersorte.
:::

:::exam title="Patientenakte" points=2
Begründe, warum ein Stapel aus Sicht der behandelnden Ärztin eine geeignete Struktur für die Behandlungsdaten einer Patientenakte ist. Nenne einen Nachteil.
--- solution
Die neueste Behandlung liegt immer oben und wird als erste gesehen, die Akte wird also in umgekehrter zeitlicher Reihenfolge gelesen; das gibt sofort einen Überblick über den aktuellen Stand. Ältere Einträge bleiben vollständig darunter erhalten. Nachteil: An ältere Einträge kommt man nur über alle neueren hinweg (z. B. eine bestimmte alte Behandlung suchen), und ein Eintrag in der Mitte lässt sich nicht direkt ändern oder entfernen.
:::
