---
id: d3
num: D3
part: D
title: Binärbaum mit dem Kompositum implementieren
short: Binärbaum mit Kompositum
lead: In D2 musste jede Methode zweimal fragen, ob es links oder rechts überhaupt einen Nachfolger gibt. Das Kompositum aus C4 löst das wie bei der Liste. Jeder leere Teilbaum wird ein ABSCHLUSS-Objekt, das jede Nachricht selbst beantwortet, und jede Baummethode schrumpft auf wenige Zeilen. Diese Lektion setzt das Wörterbuch deiner Lehrkraft um, erweitert es um weitere rekursive Methoden und bearbeitet die Abituraufgaben zum Thema.
minutes: 120
uses: [d2, c4, a9]
goals:
  - das Klassendiagramm eines geordneten Binärbaums mit dem Entwurfsmuster Kompositum zeichnen und die Rollen benennen
  - Einfügen und Suchen polymorph in KNOTEN und ABSCHLUSS implementieren (Muster „gib den neuen Teilbaum zurück“)
  - erklären, warum die Vergleiche im DATENELEMENT stehen
  - weitere rekursive Baummethoden entwickeln (IstVorhanden, HöheGeben, TiefeGeben, AnzahlGeben, InorderAusgeben)
  - Objekt- und Sequenzdiagramme für den Kompositum-Baum zeichnen und Abituraufgaben (2019, 2020) lösen
---

## [logic] Vom Listen-Kompositum zum Baum-Kompositum

In C4 bekam die Liste einen ABSCHLUSS am Ende. Beim Baum gibt es nicht ein Ende, sondern **viele**: Jeder Platz, an dem in D2 `nichts` stand, also jeder leere linke oder rechte Teilbaum, wird ein **ABSCHLUSS-Objekt**.

:::diagram bintree caption="Der Testbaum aus Aufgabe 3 c mit allen ABSCHLUSS-Objekten"
abschluss: ja
clip(car, crab(coin,))
:::

Ein Baum mit *k* Knoten hat **k + 1** Abschlüsse: Jeder Knoten hat zwei Plätze für Nachfolger, also 2*k* Plätze; *k* − 1 davon sind von Knoten belegt (jeder außer der Wurzel hängt an genau einem Platz), die übrigen 2*k* − (*k* − 1) = *k* + 1 sind Abschlüsse.

Das Klassendiagramm deiner Lehrkraft (12_III_3_Aufgabe_3):

:::diagram classes caption="Geordneter Binärbaum mit dem Entwurfsmuster Kompositum"
class BINBAUM @0,0 | wurzel: BAUMELEMENT | Konstruktor(); Suchen(ZEICHENKETTE): DATENELEMENT; Einfügen(DATENELEMENT)
abstract BAUMELEMENT @1.6,0 | | Suchen(ZEICHENKETTE): DATENELEMENT {abstract}; Einfügen(DATENELEMENT): BAUMELEMENT {abstract}
class ABSCHLUSS @0.95,1.35 | | Konstruktor(); Suchen(ZEICHENKETTE): DATENELEMENT; Einfügen(DATENELEMENT): BAUMELEMENT
class KNOTEN @2.25,1.35 | linkerNf: BAUMELEMENT; rechterNf: BAUMELEMENT; daten: DATENELEMENT | Konstruktor(DATENELEMENT); Suchen(ZEICHENKETTE): DATENELEMENT; Einfügen(DATENELEMENT): BAUMELEMENT
abstract DATENELEMENT @2.25,2.75 | | InformationAusgeben(); IstGleich(DATENELEMENT): WAHRHEITSWERT; IstGrößerAls(DATENELEMENT): WAHRHEITSWERT; SchlüsselIstGleich(ZEICHENKETTE): WAHRHEITSWERT; SchlüsselIstGrößerAls(ZEICHENKETTE): WAHRHEITSWERT
assoc BINBAUM -> BAUMELEMENT : hat als Wurzel [1]
inherit ABSCHLUSS -> BAUMELEMENT
inherit KNOTEN -> BAUMELEMENT
assoc KNOTEN -> BAUMELEMENT : hat als Nachfolger [2]
assoc KNOTEN -> DATENELEMENT : verwaltet [1]
:::

- **KNOTEN → BAUMELEMENT mit Multiplizität 2**: Jeder Knoten hat genau zwei Nachfolger, `linkerNf` und `rechterNf`. Beide sind immer Objekte (ein Knoten oder ein Abschluss), nie *nichts*.
- **BINBAUM → BAUMELEMENT mit 1**: Auch ein leerer Baum hat eine Wurzel, nämlich einen Abschluss.
- **DATENELEMENT** ist eine «Schnittstelle» (oder eine konkrete Klasse wie WÖRTERBUCHEINTRAG) mit den **Vergleichsmethoden**, die zum sortierten Einfügen und Suchen gebraucht werden.

| Rolle im Muster | Klasse | Aufgabe |
|---|---|---|
| **Komponente** | BAUMELEMENT | gemeinsame Schnittstelle (abstrakt) |
| **Kompositum** | KNOTEN | vergleicht und gibt Nachrichten an **einen** oder **beide** Nachfolger weiter |
| **Blatt** | ABSCHLUSS | leerer Teilbaum, Rekursionsende jeder Baummethode |
| **Klient** | BINBAUM | spricht nur mit der Wurzel |

:::note title="Blatt im Muster, Blatt im Baum"
Vorsicht mit dem Wort **Blatt**: Im Entwurfsmuster ist der ABSCHLUSS das „Blatt“. Im Baum (D1) heißt ein **Knoten** ohne Nachfolger Blatt; im Kompositum-Baum ist das ein KNOTEN, dessen beide Nachfolger Abschlüsse sind.
:::

## [logic] Warum vergleicht das Datenelement? (Aufgabe 3 a)

Der Baum soll für **beliebige** Daten funktionieren: Wörterbucheinträge, Kunden, Nutzernamen. Ein Knoten weiß aber nicht, was in seinem Datenelement steckt und wonach sortiert wird. Deshalb **fragt** er das Datenelement:

| Methode im WÖRTERBUCHEINTRAG | Vergleicht | Verwendet von |
|---|---|---|
| `SchlüsselIstGleich(zk)` | eigenes Wort mit einer Zeichenkette | Suchen, Einfügen |
| `SchlüsselIstGrößerAls(zk)` | eigenes Wort > Zeichenkette? | Suchen, Einfügen |
| `IstGleich(d)`, `IstGrößerAls(d)` | eigenes Wort mit dem Wort eines anderen Datenelements | Einfügen (Variante) |
| `SchlüsselAlsStringGeben()` | gibt den Schlüssel als Zeichenkette zurück | Einfügen |

Beim **Suchen** liegt nur der Suchschlüssel als Zeichenkette vor, deshalb die Methoden mit *Schlüssel* im Namen. Beim **Einfügen** liegt ein ganzes Datenelement vor; die Vorlage holt sich mit `SchlüsselAlsStringGeben()` dessen Schlüssel und verwendet dieselben Vergleiche. Will man den Baum für Kunden statt Wörter verwenden, schreibt man eine Klasse KUNDE mit denselben Methoden; am Baum ändert sich **nichts**.

Lies die Bedingung `daten.SchlüsselIstGrößerAls(s)` als: *„Mein Schlüssel ist größer als s, also liegt s links von mir.“*

## [logic] Einfügen und Suchen

Beide Methoden haben dieselbe Form wie in C4: Der KNOTEN macht den Rekursionsschritt, der ABSCHLUSS ist das Rekursionsende.

```pseudo
// BINBAUM
methode Einfügen(dNeu)
  wurzel = wurzel.Einfügen(dNeu)
endemethode

methode DATENELEMENT Suchen(s)
  return wurzel.Suchen(s)
endemethode

// KNOTEN
methode BAUMELEMENT Einfügen(dNeu)
  s = dNeu.SchlüsselAlsStringGeben()
  falls daten.SchlüsselIstGleich(s) dann
    // schon vorhanden: nichts ändern
  sonst falls daten.SchlüsselIstGrößerAls(s) dann
    linkerNf = linkerNf.Einfügen(dNeu)
  sonst
    rechterNf = rechterNf.Einfügen(dNeu)
  endefalls
  return selbst
endemethode

methode DATENELEMENT Suchen(s)
  falls daten.SchlüsselIstGleich(s) dann
    return daten
  sonst falls daten.SchlüsselIstGrößerAls(s) dann
    return linkerNf.Suchen(s)
  sonst
    return rechterNf.Suchen(s)
  endefalls
endemethode

// ABSCHLUSS
methode BAUMELEMENT Einfügen(dNeu)
  return neu KNOTEN(dNeu, neu ABSCHLUSS(), neu ABSCHLUSS())
endemethode

methode DATENELEMENT Suchen(s)
  return nichts
endemethode
```

**Das Muster „gib zurück, was an meiner Stelle stehen soll“** (aus C4) ist der Kern des Einfügens. Der Abschluss, bei dem die Nachricht ankommt, antwortet: *„An meine Stelle gehört jetzt dieser neue Knoten.“* Sein Vorgänger speichert die Antwort mit `linkerNf = linkerNf.Einfügen(dNeu)`. Alle anderen Knoten auf dem Weg geben sich selbst zurück; ihre Zuweisungen ändern nichts. Auch der leere Baum funktioniert ohne Sonderfall: Seine Wurzel ist ein Abschluss, der den ersten Knoten zurückgibt, und der wird die neue Wurzel.

:::viz bst
{"mode": "komp", "preset": "test", "value": "cow", "start": "insert"}
:::

Probier auch **Suchen** (z. B. `coin` und `dog`) und einen Schlüssel, der schon da ist (`car`).

:::diagram seq caption="Einfügen(„car“) in einen Baum, der nur „clip“ enthält"
actors: Aufrufer | b: BINBAUM | k1: KNOTEN | a1: ABSCHLUSS | kNeu: KNOTEN
Aufrufer -> b: Einfügen(car)
b -> k1: Einfügen(car)
k1 -> a1: Einfügen(car)
a1 -> kNeu: «neu» KNOTEN(car, neu ABSCHLUSS, neu ABSCHLUSS)
kNeu --> a1: kNeu
a1 --> k1: kNeu
k1 --> b: k1
b --> Aufrufer: 
:::

k1 vergleicht: Sein Schlüssel „clip“ ist größer als „car“, also geht die Nachricht an seinen linken Nachfolger a1. Danach gilt `k1.linkerNf = kNeu`; a1 wird von niemandem mehr referenziert und verschwindet.

:::warn title="Ein Fehler im Lösungsvorschlag"
Im Python-Lösungsvorschlag steht beim schon vorhandenen Element `print("Element " + datenNeu + " ist schon vorhanden. …")`. `datenNeu` ist ein Wörterbucheintrag und keine Zeichenkette, also bricht Python hier mit `TypeError: can only concatenate str (not "Woerterbucheintrag") to str` ab. Richtig ist `"Element " + datenNeu.WortGeben() + …`. Außerdem gibt `BinBaum.Suchen` dort nur eine Meldung aus und nichts zurück. Der Unittest der Vorlage erwartet aber, dass `Suchen` das Datenelement **zurückgibt** (`Suchen("cat").BedeutungGeben()`). In diesem Kurs gibt `Suchen` deshalb immer das Datenelement oder `None` zurück.
:::

## [logic] Das Rollenspiel (12_III_3_Aufgabe_1)

Im Rollenspiel übernimmt jede Person ein Objekt. Gestartet wird mit einem Wörterbuch, das nur „clip“ enthält.

**a) Startsituation:** 5 Objekte aus 4 Klassen: der BINBAUM, ein KNOTEN, sein WÖRTERBUCHEINTRAG („clip“) und zwei ABSCHLUSS-Objekte (links und rechts von clip).

:::diagram objects caption="Die Startsituation als Objektdiagramm"
b: BINBAUM @0,0 | wurzel -> k1
k1: KNOTEN @1,0 | daten -> w1 | linkerNf -> a1 | rechterNf -> a2
w1: WÖRTERBUCHEINTRAG @2.2,0 | wort = "clip" | bedeutung = "Spange"
a1: ABSCHLUSS @0.6,1.05
a2: ABSCHLUSS @1.6,1.05
:::

**b) Ein Aufruf von Einfügen:** Einfügen selbst erzeugt **drei** neue Objekte: einen KNOTEN und zwei ABSCHLUSS-Objekte. Dazu kommt der neue WÖRTERBUCHEINTRAG, den der Aufrufer vorher erzeugt und übergibt. Gleichzeitig wird ein Abschluss (der, bei dem die Nachricht ankam) nicht mehr gebraucht. Netto wächst die Struktur also um einen Knoten, einen Eintrag und einen Abschluss.

**c) Zwei Wörter mit verschiedenen Fällen.** Eine sinnvolle Wahl:

- **„car“**: Der Weg ist kurz (clip → links → Abschluss). Er zeigt den Grundfall: Der Abschluss erzeugt den neuen Knoten, clip speichert ihn als linken Nachfolger.
- **„cab“** (danach): clip → links zu car → car vergleicht: cab < car → links → Abschluss. Hier gibt car die Nachricht weiter, empfängt den neuen Knoten **und gibt sich selbst zurück**; clip „ersetzt“ seinen linken Nachfolger durch car, also durch sich selbst. Der Fall zeigt, dass Zwischenknoten nichts verändern.
- Zusätzlich lohnt **„clip“**: Die Wurzel erkennt den gleichen Schlüssel, nichts wird erzeugt, sie gibt sich selbst zurück.

## [logic] Weitere rekursive Methoden

Jede neue Methode folgt demselben Rezept: Was antwortet der **Abschluss** (leerer Teilbaum)? Wie setzt ein **Knoten** seine Antwort aus der Antwort eines oder beider Nachfolger zusammen?

| Methode | ABSCHLUSS | KNOTEN | fragt |
|---|---|---|---|
| `IstVorhanden(s)` | falsch | wahr, falls gleicher Schlüssel; sonst Antwort des passenden Nachfolgers | einen Nachfolger |
| `AnzahlGeben()` | 0 | 1 + links + rechts | beide |
| `HöheGeben()` | −1 | 1 + Maximum(links, rechts) | beide |
| `TiefeGeben(s)` | −1 (nicht gefunden) | 0, falls gleicher Schlüssel; sonst Antwort + 1, aber −1 bleibt −1 | einen |
| `InorderAusgeben()` | nichts tun | links, sich selbst ausgeben, rechts | beide |

**Höhe:** Nach der Definition aus D1 (größte Tiefe, also Kanten zählen) muss der Abschluss **−1** zurückgeben: Ein Knoten mit zwei Abschlüssen hat dann 1 + max(−1, −1) = 0. Gibt der Abschluss 0 zurück, zählt die Methode stattdessen die **Ebenen**. Beides ist richtig, solange man sagt, was man zählt.

:::viz bst
{"mode": "komp", "preset": "beispiel", "start": "height"}
:::

**TiefeGeben (Aufgabe 3 f).**

- i) Methodenkopf: `GANZZAHL TiefeGeben(suchschlüssel: ZEICHENKETTE)`, in BINBAUM, BAUMELEMENT (abstrakt), KNOTEN und ABSCHLUSS.
- ii) Echte Tiefen sind 0, 1, 2 …; für „nicht gefunden“ eignet sich deshalb **−1**, ein Wert, der als Tiefe nie vorkommt. (`nichts` wäre auch möglich, ist aber keine GANZZAHL.)
- iii) Die Umsetzung muss aufpassen: Ein Knoten darf zu −1 **nicht** 1 addieren, sonst wird aus „nicht gefunden“ plötzlich Tiefe 0.

```pseudo
// KNOTEN
methode GANZZAHL TiefeGeben(s)
  falls daten.SchlüsselIstGleich(s) dann
    return 0
  endefalls
  falls daten.SchlüsselIstGrößerAls(s) dann
    t = linkerNf.TiefeGeben(s)
  sonst
    t = rechterNf.TiefeGeben(s)
  endefalls
  falls t = -1 dann
    return -1
  endefalls
  return t + 1
endemethode

// ABSCHLUSS
methode GANZZAHL TiefeGeben(s)
  return -1
endemethode
```

## [logic] Den Testbaum bewerten (Aufgabe 3 c)

Der Testbaum clip(car, crab(coin, –)) ist **klein, aber gut gewählt**, weil er fast alle Fälle beim Suchen und Einfügen abdeckt:

- gefunden **an der Wurzel** (clip), in einem **Blatt** links (car), in einem **inneren Knoten** (crab) und auf der **tiefsten Ebene** (coin),
- **nicht gefunden** links von car (bus), rechts von car (cat), zwischen coin und crab (cow) und rechts von crab (dog): Jeder Abschluss wird einmal erreicht,
- ein Knoten mit **nur einem** Nachfolger (crab).

Was fehlt: ein Knoten mit nur einem **rechten** Nachfolger und der **leere** Baum. Beide sollte man zusätzlich testen. Der Unittest der Vorlage prüft außerdem nur einige wenige Schlüssel; die Python-Blöcke unten prüfen jeden dieser Fälle.

## [logic] Abituraufgaben zum Kompositum-Baum

### Kinoverwaltung Teil 2 (12_III_3_Aufgabe_6, Abitur 2020)

*Beschreibe in Worten den rekursiven Algorithmus, den ein Knoten zum Einfügen eines neuen Kunden ausführt, und die Rolle des Abschlusses.*

Ein Knoten vergleicht den Schlüssel des neuen Kunden mit dem Schlüssel seines eigenen Kunden. Ist der neue Schlüssel kleiner, ruft er die Einfügemethode seines **linken** Nachfolgers auf und speichert das zurückgegebene Baumelement als neuen linken Nachfolger; ist er größer, macht er dasselbe mit dem **rechten** Nachfolger. Danach gibt er sich selbst zurück. Der **Abschluss** markiert jeden leeren Teilbaum und ist das Rekursionsende: Kommt die Einfügenachricht bei ihm an, erzeugt er einen neuen Knoten mit dem Kunden (mit zwei Abschlüssen als Nachfolgern) und gibt ihn zurück, sodass sein Vorgänger den neuen Knoten an seiner Stelle einhängt. Dadurch muss kein Knoten prüfen, ob ein Nachfolger existiert.

### Nutzerverwaltung eines Onlinespiels (12_III_3_Aufgabe_4, Abitur 2019)

**a)** Eine Suche nach einem Namen auf der **untersten** Ebene braucht die meisten Vergleiche, ebenso viele erfolglose Suchen. Sind die oberen Ebenen voll besetzt und unten möglichst wenige Knoten, werden möglichst viele Namen mit wenigen Vergleichen gefunden: Die **durchschnittliche** Suchdauer sinkt, nicht nur die maximale.

**b)** 2<sup>17</sup> − 1 = 131 071 < 150 000 ≤ 262 143 = 2<sup>18</sup> − 1: Der optimal aufgebaute Baum hat **18 Ebenen**, eine Prüfung braucht höchstens 18 Rekursionsschritte: 18 · 5 · 10<sup>−6</sup> s = **9 · 10<sup>−5</sup> s**, also unter einer Zehntelmillisekunde. Selbst nach jedem Tastendruck merkt der Nutzer davon nichts; zwischen zwei Tastendrücken vergehen etwa 0,1 bis 0,3 s.

**c)** `istFrei(benutzername)` gibt **falsch** zurück, wenn der Name schon vergeben ist. Mit `vergleichenMit` (negativ: kleiner, 0: gleich, positiv: größer):

```pseudo
// NUTZERBAUM
methode WAHRHEITSWERT istFrei(name)
  return wurzel.istFrei(name)
endemethode

// KNOTEN
methode WAHRHEITSWERT istFrei(name)
  v = name.vergleichenMit(benutzername)
  falls v = 0 dann
    return falsch
  sonst falls v < 0 dann
    return liNachfolger.istFrei(name)
  sonst
    return reNachfolger.istFrei(name)
  endefalls
endemethode

// ABSCHLUSS
methode WAHRHEITSWERT istFrei(name)
  return wahr
endemethode
```

Nicht vergessen: `istFrei` auch als abstrakte Methode in BAUMELEMENT. Die Methode nutzt die Ordnung, weil sie nur **einen** Teilbaum weiter befragt.

**d)** `m1('s')` gibt eine **Liste aller Benutzernamen zurück, die mit s beginnen, alphabetisch sortiert**. In `m2` vergleicht jeder Knoten *z* mit dem ersten Buchstaben *z1* seines Namens:

- *z* vor *z1*: Alle Namen mit *z* können nur im **linken** Teilbaum stehen.
- *z* nach *z1*: Sie können nur im **rechten** Teilbaum stehen.
- *z* = *z1*: Der eigene Name passt, und passende Namen kann es auf **beiden** Seiten geben. Der Knoten sammelt erst links, hängt dann seinen eigenen Namen an und sammelt dann rechts. Das ist ein **Inorder-Durchlauf**, also kommt alles sortiert in die Liste.

Der Abschluss (nicht abgebildet) tut in `m2` nichts. Teilbäume, in denen keine passenden Namen stehen können, werden gar nicht betreten.

## [bridge] Vom Klassendiagramm zu Python

Die Python-Vorlage `2_3_A03_WoerterbuchMitVisualisierung` verwendet die Namen `linkerNachfolger`, `rechterNachfolger`, `daten` und schreibt Umlaute aus (`Einfuegen`, `SchluesselIstGroesserAls`). Die Zeichenmethoden (`KnotenZeichnen`, `BaumZeichnen`) lassen die Python-Blöcke weg.

:::bridge title="Konstruktor und Einfügen"
// KNOTEN ||     # class Knoten(Baumelement):
Konstruktor(dNeu) ||     def __init__(self, datenNeu, linkerNachfolgerNeu=None, rechterNachfolgerNeu=None):
  daten = dNeu ||         self.daten = datenNeu
  linkerNf = neu ABSCHLUSS() ||         self.linkerNachfolger = linkerNachfolgerNeu if linkerNachfolgerNeu is not None else Abschluss()
  rechterNf = neu ABSCHLUSS() ||         self.rechterNachfolger = rechterNachfolgerNeu if rechterNachfolgerNeu is not None else Abschluss()
methode Einfügen(dNeu) ||     def Einfuegen(self, datenNeu):
  s = dNeu.SchlüsselAlsStringGeben() ||         s = datenNeu.SchluesselAlsStringGeben()
  falls daten.SchlüsselIstGleich(s) dann ||         if self.daten.SchluesselIstGleich(s):
    return selbst ||             return self
  sonst falls daten.SchlüsselIstGrößerAls(s) dann ||         if self.daten.SchluesselIstGroesserAls(s):
    linkerNf = linkerNf.Einfügen(dNeu) ||             self.linkerNachfolger = self.linkerNachfolger.Einfuegen(datenNeu)
  sonst ||         else:
    rechterNf = rechterNf.Einfügen(dNeu) ||             self.rechterNachfolger = self.rechterNachfolger.Einfuegen(datenNeu)
  return selbst ||         return self
// ABSCHLUSS ||     # class Abschluss(Baumelement):
methode Einfügen(dNeu) ||     def Einfuegen(self, datenNeu):
  return neu KNOTEN(dNeu, neu ABSCHLUSS(), neu ABSCHLUSS()) ||         return Knoten(datenNeu, Abschluss(), Abschluss())
>> Die Standardwerte `=None` im Konstruktor sind nur ein Python-Trick, damit man `Knoten(d)` schreiben kann. Ein Standardwert `=Abschluss()` direkt in der Parameterliste wäre ein Fehler: Python erzeugt ihn nur **einmal**, und alle Knoten würden sich denselben Abschluss teilen.
:::

:::bridge title="Suchen"
// BINBAUM ||     # class BinBaum:
methode Suchen(s) ||     def Suchen(self, suchSchluessel):
  return wurzel.Suchen(s) ||         return self.wurzel.Suchen(suchSchluessel)
// KNOTEN ||     # class Knoten:
methode Suchen(s) ||     def Suchen(self, suchSchluessel):
  falls daten.SchlüsselIstGleich(s) dann return daten ||         if self.daten.SchluesselIstGleich(suchSchluessel): return self.daten
  falls daten.SchlüsselIstGrößerAls(s) dann ||         if self.daten.SchluesselIstGroesserAls(suchSchluessel):
    return linkerNf.Suchen(s) ||             return self.linkerNachfolger.Suchen(suchSchluessel)
  return rechterNf.Suchen(s) ||         return self.rechterNachfolger.Suchen(suchSchluessel)
// ABSCHLUSS ||     # class Abschluss:
methode Suchen(s) ||     def Suchen(self, suchSchluessel):
  return nichts ||         return None
:::

:::trace title="Drei Wörter einfügen und eines suchen"
class Eintrag:
    def __init__(self, wort):
        self.wort = wort

    def SchluesselIstGleich(self, s):
        return self.wort == s

    def SchluesselIstGroesserAls(self, s):
        return self.wort > s

    def SchluesselAlsStringGeben(self):
        return self.wort


class Abschluss:
    def Einfuegen(self, datenNeu):
        return Knoten(datenNeu, Abschluss(), Abschluss())

    def Suchen(self, s):
        return None


class Knoten:
    def __init__(self, datenNeu, links, rechts):
        self.daten = datenNeu
        self.linkerNachfolger = links
        self.rechterNachfolger = rechts

    def Einfuegen(self, datenNeu):
        s = datenNeu.SchluesselAlsStringGeben()
        if self.daten.SchluesselIstGleich(s):
            return self
        if self.daten.SchluesselIstGroesserAls(s):
            self.linkerNachfolger = self.linkerNachfolger.Einfuegen(datenNeu)
        else:
            self.rechterNachfolger = self.rechterNachfolger.Einfuegen(datenNeu)
        return self

    def Suchen(self, s):
        if self.daten.SchluesselIstGleich(s):
            return self.daten
        if self.daten.SchluesselIstGroesserAls(s):
            return self.linkerNachfolger.Suchen(s)
        return self.rechterNachfolger.Suchen(s)


class BinBaum:
    def __init__(self):
        self.wurzel = Abschluss()

    def Einfuegen(self, datenNeu):
        self.wurzel = self.wurzel.Einfuegen(datenNeu)

    def Suchen(self, s):
        return self.wurzel.Suchen(s)


b = BinBaum()
b.Einfuegen(Eintrag("clip"))
b.Einfuegen(Eintrag("car"))
b.Einfuegen(Eintrag("crab"))
print(b.Suchen("crab").wort)
:::

## [python] Python-Blöcke

Alle Blöcke verwenden die Klassen aus der Vorlage deiner Lehrkraft, ohne die Zeichenmethoden. `Woerterbucheintrag` ist immer gegeben.

:::exercise id=t3-einfuegen title="Die Struktur und Einfügen (Aufgabe 3 b)" level=2
Implementiere:

1. `Abschluss.Einfuegen(datenNeu)`: gibt einen neuen Knoten mit zwei neuen Abschlüssen zurück.
2. `Knoten.__init__`: speichert die Daten; fehlt ein Nachfolger (`None`), wird ein **neuer** `Abschluss()` verwendet.
3. `Knoten.Einfuegen(datenNeu)`: sortiert einfügen und sich selbst zurückgeben; ein vorhandener Schlüssel wird nicht noch einmal eingefügt (ohne Absturz).
4. `BinBaum.Einfuegen(datenNeu)`.

Nur `Knoten` darf `if` enthalten.
--- starter
from abc import ABC, abstractmethod


class Woerterbucheintrag:
    def __init__(self, wortNeu, bedeutungNeu):
        self.wort = wortNeu
        self.bedeutung = bedeutungNeu

    def InformationAusgeben(self):
        print(f"{self.wort}: {self.bedeutung}")

    def SchluesselIstGleich(self, vergleichsSchluessel):
        return self.wort == vergleichsSchluessel

    def SchluesselIstGroesserAls(self, vergleichsSchluessel):
        return self.wort > vergleichsSchluessel

    def SchluesselAlsStringGeben(self):
        return self.wort

    def WortGeben(self):
        return self.wort

    def BedeutungGeben(self):
        return self.bedeutung


class Baumelement(ABC):
    @abstractmethod
    def Einfuegen(self, datenNeu):
        pass


class Abschluss(Baumelement):
    def Einfuegen(self, datenNeu):
        pass


class Knoten(Baumelement):
    def __init__(self, datenNeu, linkerNachfolgerNeu=None, rechterNachfolgerNeu=None):
        pass

    def Einfuegen(self, datenNeu):
        pass


class BinBaum:
    def __init__(self):
        self.wurzel = Abschluss()

    def Einfuegen(self, datenNeu):
        pass


binBaum1 = BinBaum()
for w, b in [("clip", "Clip, Spange, Klammer"), ("cat", "Katze"), ("cup", "Tasse, Becher"), ("cut", "Schnitt")]:
    binBaum1.Einfuegen(Woerterbucheintrag(w, b))
print(binBaum1.wurzel.daten.WortGeben())
--- solution
from abc import ABC, abstractmethod


class Woerterbucheintrag:
    def __init__(self, wortNeu, bedeutungNeu):
        self.wort = wortNeu
        self.bedeutung = bedeutungNeu

    def InformationAusgeben(self):
        print(f"{self.wort}: {self.bedeutung}")

    def SchluesselIstGleich(self, vergleichsSchluessel):
        return self.wort == vergleichsSchluessel

    def SchluesselIstGroesserAls(self, vergleichsSchluessel):
        return self.wort > vergleichsSchluessel

    def SchluesselAlsStringGeben(self):
        return self.wort

    def WortGeben(self):
        return self.wort

    def BedeutungGeben(self):
        return self.bedeutung


class Baumelement(ABC):
    @abstractmethod
    def Einfuegen(self, datenNeu):
        pass


class Abschluss(Baumelement):
    def Einfuegen(self, datenNeu):
        return Knoten(datenNeu, Abschluss(), Abschluss())


class Knoten(Baumelement):
    def __init__(self, datenNeu, linkerNachfolgerNeu=None, rechterNachfolgerNeu=None):
        self.daten = datenNeu
        self.linkerNachfolger = linkerNachfolgerNeu if linkerNachfolgerNeu is not None else Abschluss()
        self.rechterNachfolger = rechterNachfolgerNeu if rechterNachfolgerNeu is not None else Abschluss()

    def Einfuegen(self, datenNeu):
        s = datenNeu.SchluesselAlsStringGeben()
        if self.daten.SchluesselIstGleich(s):
            print("Element " + s + " ist schon vorhanden. Einfügen abgebrochen.")
            return self
        if self.daten.SchluesselIstGroesserAls(s):
            self.linkerNachfolger = self.linkerNachfolger.Einfuegen(datenNeu)
        else:
            self.rechterNachfolger = self.rechterNachfolger.Einfuegen(datenNeu)
        return self


class BinBaum:
    def __init__(self):
        self.wurzel = Abschluss()

    def Einfuegen(self, datenNeu):
        self.wurzel = self.wurzel.Einfuegen(datenNeu)


binBaum1 = BinBaum()
for w, b in [("clip", "Clip, Spange, Klammer"), ("cat", "Katze"), ("cup", "Tasse, Becher"), ("cut", "Schnitt")]:
    binBaum1.Einfuegen(Woerterbucheintrag(w, b))
print(binBaum1.wurzel.daten.WortGeben())
--- tests
import ast

def form(e):
    if isinstance(e, Abschluss):
        return "-"
    ok(isinstance(e, Knoten), "Jeder Nachfolger muss ein Knoten oder ein Abschluss sein, gefunden: %r" % (e,))
    l, r = e.linkerNachfolger, e.rechterNachfolger
    if isinstance(l, Abschluss) and isinstance(r, Abschluss):
        return e.daten.WortGeben()
    return "%s(%s,%s)" % (e.daten.WortGeben(), form(l), form(r))

def baue(*worte):
    b = BinBaum()
    for w in worte:
        b.Einfuegen(Woerterbucheintrag(w, w.upper()))
    return b

@test("Knoten und Abschluss")
def _():
    k = Knoten(Woerterbucheintrag("clip", "Spange"))
    ok(isinstance(k.linkerNachfolger, Abschluss) and isinstance(k.rechterNachfolger, Abschluss), "Knoten(d) braucht zwei Abschlüsse als Nachfolger")
    ok(k.linkerNachfolger is not k.rechterNachfolger, "links und rechts müssen verschiedene Abschluss-Objekte sein")
    k2 = Knoten(Woerterbucheintrag("car", "Auto"))
    ok(k2.linkerNachfolger is not k.linkerNachfolger, "jeder Knoten braucht eigene Abschlüsse")
    e = Abschluss().Einfuegen(Woerterbucheintrag("cat", "Katze"))
    ok(isinstance(e, Knoten) and e.daten.WortGeben() == "cat", "Abschluss.Einfuegen muss einen neuen Knoten zurückgeben")

@test("Leerer Baum und erstes Einfügen")
def _():
    b = BinBaum()
    ok(isinstance(b.wurzel, Abschluss), "der leere Baum hat einen Abschluss als Wurzel")
    b.Einfuegen(Woerterbucheintrag("clip", "Spange"))
    eq(form(b.wurzel), "clip", "nach dem ersten Einfügen")

@test("Wörterbuch aus der Vorlage")
def _():
    eq(form(baue("clip", "cat", "cup", "cut", "cube", "cave", "crab").wurzel), "clip(cat(-,cave),cup(cube(crab,-),cut))", "Form des Baums")
    eq(form(baue("clip", "car", "crab", "coin").wurzel), "clip(car,crab(coin,-))", "Testbaum aus Aufgabe 3 c")

@test("Doppelte Schlüssel")
def _():
    b = baue("clip", "car")
    b.Einfuegen(Woerterbucheintrag("car", "Wagen"))
    b.Einfuegen(Woerterbucheintrag("clip", "Klammer"))
    eq(form(b.wurzel), "clip(car,-)", "doppelte Schlüssel ändern den Baum nicht")
    eq(b.wurzel.linkerNachfolger.daten.BedeutungGeben(), "CAR", "der alte Eintrag bleibt erhalten")

@test("Keine if-Abfragen in Abschluss und BinBaum")
def _():
    for node in ast.parse(SOURCE).body:
        if isinstance(node, ast.ClassDef) and node.name in ("Abschluss", "BinBaum"):
            for n in ast.walk(node):
                if isinstance(n, (ast.If, ast.IfExp)):
                    ok(False, "%s braucht kein if (Zeile %d): Das Kompositum entscheidet über die Klasse" % (node.name, n.lineno))
--- hint
`Abschluss.Einfuegen`: eine Zeile, `return Knoten(datenNeu, Abschluss(), Abschluss())`. `BinBaum.Einfuegen`: `self.wurzel = self.wurzel.Einfuegen(datenNeu)`.
--- hint
`Knoten.__init__`: `self.linkerNachfolger = linkerNachfolgerNeu if linkerNachfolgerNeu is not None else Abschluss()`, rechts genauso.
--- hint
`Knoten.Einfuegen`: Hol den Schlüssel mit `datenNeu.SchluesselAlsStringGeben()`. Ist dein Schlüssel größer (`self.daten.SchluesselIstGroesserAls(s)`), gehört der neue nach links: `self.linkerNachfolger = self.linkerNachfolger.Einfuegen(datenNeu)`. Am Ende `return self`.
--- explain
Jede Klasse hat genau eine Aufgabe: Der Abschluss erzeugt, der Knoten vergleicht und leitet weiter, der Baum spricht nur mit seiner Wurzel. Die Zuweisung an `linkerNachfolger` bzw. `rechterNachfolger` hängt den neuen Knoten genau dann ein, wenn die Nachricht direkt bei einem Abschluss gelandet ist.
:::

:::exercise id=t3-suchen title="Suchen und IstVorhanden (Aufgabe 3 d)" level=2
Einfügen ist fertig. Implementiere in `Abschluss`, `Knoten` und `BinBaum`:

- `Suchen(suchSchluessel)`: gibt den Wörterbucheintrag zurück, `None`, wenn es ihn nicht gibt.
- `IstVorhanden(suchSchluessel)`: `True` genau dann, wenn ein Eintrag mit diesem Schlüssel existiert. Schreib sie **rekursiv in allen drei Klassen** (nicht über `Suchen`).

Die Prüfungen sind die Fälle aus dem Unittest der Vorlage und aus Aufgabe 3 c.
--- starter
from abc import ABC, abstractmethod


class Woerterbucheintrag:
    def __init__(self, wortNeu, bedeutungNeu):
        self.wort = wortNeu
        self.bedeutung = bedeutungNeu

    def SchluesselIstGleich(self, vergleichsSchluessel):
        return self.wort == vergleichsSchluessel

    def SchluesselIstGroesserAls(self, vergleichsSchluessel):
        return self.wort > vergleichsSchluessel

    def SchluesselAlsStringGeben(self):
        return self.wort

    def WortGeben(self):
        return self.wort

    def BedeutungGeben(self):
        return self.bedeutung


class Baumelement(ABC):
    @abstractmethod
    def Einfuegen(self, datenNeu):
        pass

    @abstractmethod
    def Suchen(self, suchSchluessel):
        pass

    @abstractmethod
    def IstVorhanden(self, suchSchluessel):
        pass


class Abschluss(Baumelement):
    def Einfuegen(self, datenNeu):
        return Knoten(datenNeu, Abschluss(), Abschluss())

    def Suchen(self, suchSchluessel):
        pass

    def IstVorhanden(self, suchSchluessel):
        pass


class Knoten(Baumelement):
    def __init__(self, datenNeu, linkerNachfolgerNeu=None, rechterNachfolgerNeu=None):
        self.daten = datenNeu
        self.linkerNachfolger = linkerNachfolgerNeu if linkerNachfolgerNeu is not None else Abschluss()
        self.rechterNachfolger = rechterNachfolgerNeu if rechterNachfolgerNeu is not None else Abschluss()

    def Einfuegen(self, datenNeu):
        s = datenNeu.SchluesselAlsStringGeben()
        if self.daten.SchluesselIstGleich(s):
            return self
        if self.daten.SchluesselIstGroesserAls(s):
            self.linkerNachfolger = self.linkerNachfolger.Einfuegen(datenNeu)
        else:
            self.rechterNachfolger = self.rechterNachfolger.Einfuegen(datenNeu)
        return self

    def Suchen(self, suchSchluessel):
        pass

    def IstVorhanden(self, suchSchluessel):
        pass


class BinBaum:
    def __init__(self):
        self.wurzel = Abschluss()

    def Einfuegen(self, datenNeu):
        self.wurzel = self.wurzel.Einfuegen(datenNeu)

    def Suchen(self, suchSchluessel):
        pass

    def IstVorhanden(self, suchSchluessel):
        pass


binBaum1 = BinBaum()
for w, b in [("clip", "Clip, Spange, Klammer"), ("cat", "Katze"), ("cup", "Tasse, Becher"), ("cut", "Schnitt")]:
    binBaum1.Einfuegen(Woerterbucheintrag(w, b))
ergebnis = binBaum1.Suchen("cat")
if ergebnis is not None:
    print("Das Wort cat wird übersetzt als " + ergebnis.BedeutungGeben())
--- solution
from abc import ABC, abstractmethod


class Woerterbucheintrag:
    def __init__(self, wortNeu, bedeutungNeu):
        self.wort = wortNeu
        self.bedeutung = bedeutungNeu

    def SchluesselIstGleich(self, vergleichsSchluessel):
        return self.wort == vergleichsSchluessel

    def SchluesselIstGroesserAls(self, vergleichsSchluessel):
        return self.wort > vergleichsSchluessel

    def SchluesselAlsStringGeben(self):
        return self.wort

    def WortGeben(self):
        return self.wort

    def BedeutungGeben(self):
        return self.bedeutung


class Baumelement(ABC):
    @abstractmethod
    def Einfuegen(self, datenNeu):
        pass

    @abstractmethod
    def Suchen(self, suchSchluessel):
        pass

    @abstractmethod
    def IstVorhanden(self, suchSchluessel):
        pass


class Abschluss(Baumelement):
    def Einfuegen(self, datenNeu):
        return Knoten(datenNeu, Abschluss(), Abschluss())

    def Suchen(self, suchSchluessel):
        return None

    def IstVorhanden(self, suchSchluessel):
        return False


class Knoten(Baumelement):
    def __init__(self, datenNeu, linkerNachfolgerNeu=None, rechterNachfolgerNeu=None):
        self.daten = datenNeu
        self.linkerNachfolger = linkerNachfolgerNeu if linkerNachfolgerNeu is not None else Abschluss()
        self.rechterNachfolger = rechterNachfolgerNeu if rechterNachfolgerNeu is not None else Abschluss()

    def Einfuegen(self, datenNeu):
        s = datenNeu.SchluesselAlsStringGeben()
        if self.daten.SchluesselIstGleich(s):
            return self
        if self.daten.SchluesselIstGroesserAls(s):
            self.linkerNachfolger = self.linkerNachfolger.Einfuegen(datenNeu)
        else:
            self.rechterNachfolger = self.rechterNachfolger.Einfuegen(datenNeu)
        return self

    def Suchen(self, suchSchluessel):
        if self.daten.SchluesselIstGleich(suchSchluessel):
            return self.daten
        if self.daten.SchluesselIstGroesserAls(suchSchluessel):
            return self.linkerNachfolger.Suchen(suchSchluessel)
        return self.rechterNachfolger.Suchen(suchSchluessel)

    def IstVorhanden(self, suchSchluessel):
        if self.daten.SchluesselIstGleich(suchSchluessel):
            return True
        if self.daten.SchluesselIstGroesserAls(suchSchluessel):
            return self.linkerNachfolger.IstVorhanden(suchSchluessel)
        return self.rechterNachfolger.IstVorhanden(suchSchluessel)


class BinBaum:
    def __init__(self):
        self.wurzel = Abschluss()

    def Einfuegen(self, datenNeu):
        self.wurzel = self.wurzel.Einfuegen(datenNeu)

    def Suchen(self, suchSchluessel):
        return self.wurzel.Suchen(suchSchluessel)

    def IstVorhanden(self, suchSchluessel):
        return self.wurzel.IstVorhanden(suchSchluessel)


binBaum1 = BinBaum()
for w, b in [("clip", "Clip, Spange, Klammer"), ("cat", "Katze"), ("cup", "Tasse, Becher"), ("cut", "Schnitt")]:
    binBaum1.Einfuegen(Woerterbucheintrag(w, b))
ergebnis = binBaum1.Suchen("cat")
if ergebnis is not None:
    print("Das Wort cat wird übersetzt als " + ergebnis.BedeutungGeben())
--- tests
import ast

def baue(*worte):
    b = BinBaum()
    for w in worte:
        b.Einfuegen(Woerterbucheintrag(w, w.upper()))
    return b

@test("Unittest der Vorlage")
def _():
    b = BinBaum()
    for w, bd in [("clip", "Clip, Spange, Klammer"), ("cat", "Katze"), ("cup", "Tasse, Becher"), ("cut", "Schnitt"), ("cube", "Würfel"), ("cave", "Höhle"), ("crab", "Krabbe")]:
        b.Einfuegen(Woerterbucheintrag(w, bd))
    ok(b.Suchen("clip") is not None, 'Suchen("clip") darf nicht None sein')
    eq(b.Suchen("cat").BedeutungGeben(), "Katze", 'Suchen("cat").BedeutungGeben()')
    eq(b.Suchen("dog"), None, 'Suchen("dog")')
    eq(b.IstVorhanden("clip"), True, 'IstVorhanden("clip")')
    eq(b.IstVorhanden("dog"), False, 'IstVorhanden("dog")')

@test("Alle Fälle des Testbaums (Aufgabe 3 c)")
def _():
    b = baue("clip", "car", "crab", "coin")
    for w in ["clip", "car", "crab", "coin"]:
        e = b.Suchen(w)
        ok(e is not None and e.WortGeben() == w, 'Suchen("%s") muss den Eintrag %s liefern' % (w, w))
        eq(b.IstVorhanden(w), True, 'IstVorhanden("%s")' % w)
    for w in ["bus", "cat", "cow", "dog"]:
        eq(b.Suchen(w), None, 'Suchen("%s")' % w)
        eq(b.IstVorhanden(w), False, 'IstVorhanden("%s")' % w)

@test("Leerer Baum")
def _():
    eq(BinBaum().Suchen("clip"), None, "Suchen im leeren Baum")
    eq(BinBaum().IstVorhanden("clip"), False, "IstVorhanden im leeren Baum")

@test("IstVorhanden ist rekursiv in allen Klassen")
def _():
    for node in ast.parse(SOURCE).body:
        if isinstance(node, ast.ClassDef) and node.name in ("Knoten", "Abschluss", "BinBaum"):
            for fn in node.body:
                if isinstance(fn, ast.FunctionDef) and fn.name == "IstVorhanden":
                    calls = {n.func.attr for n in ast.walk(fn) if isinstance(n, ast.Call) and isinstance(n.func, ast.Attribute)}
                    ok("Suchen" not in calls, "%s.IstVorhanden soll nicht Suchen verwenden" % node.name)
--- hint
Abschluss: `Suchen` gibt `None`, `IstVorhanden` gibt `False` zurück. BinBaum: beide leiten an `self.wurzel` weiter (mit `return`!).
--- hint
Knoten: gleicher Schlüssel → Daten bzw. `True`; eigener Schlüssel größer → links weiterfragen; sonst rechts. Immer `return` vor dem rekursiven Aufruf.
--- explain
Suchen und IstVorhanden unterscheiden sich nur in den beiden Antworten am Rekursionsende: Daten/True beim Treffer, None/False im Abschluss. Der Weg durch den Baum ist derselbe.
:::

:::exercise id=t3-hoehe title="HöheGeben und AnzahlGeben (Aufgabe 3 e)" level=2
Implementiere in allen drei Klassen:

- `HoeheGeben()`: Höhe als größte Tiefe (Kanten zählen); ein einzelner Knoten hat Höhe 0, der leere Baum −1.
- `AnzahlGeben()`: Anzahl der Knoten.
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


class Baumelement(ABC):
    @abstractmethod
    def Einfuegen(self, datenNeu):
        pass

    @abstractmethod
    def HoeheGeben(self):
        pass

    @abstractmethod
    def AnzahlGeben(self):
        pass


class Abschluss(Baumelement):
    def Einfuegen(self, datenNeu):
        return Knoten(datenNeu, Abschluss(), Abschluss())

    def HoeheGeben(self):
        pass

    def AnzahlGeben(self):
        pass


class Knoten(Baumelement):
    def __init__(self, datenNeu, linkerNachfolgerNeu, rechterNachfolgerNeu):
        self.daten = datenNeu
        self.linkerNachfolger = linkerNachfolgerNeu
        self.rechterNachfolger = rechterNachfolgerNeu

    def Einfuegen(self, datenNeu):
        s = datenNeu.SchluesselAlsStringGeben()
        if self.daten.SchluesselIstGleich(s):
            return self
        if self.daten.SchluesselIstGroesserAls(s):
            self.linkerNachfolger = self.linkerNachfolger.Einfuegen(datenNeu)
        else:
            self.rechterNachfolger = self.rechterNachfolger.Einfuegen(datenNeu)
        return self

    def HoeheGeben(self):
        pass

    def AnzahlGeben(self):
        pass


class BinBaum:
    def __init__(self):
        self.wurzel = Abschluss()

    def Einfuegen(self, datenNeu):
        self.wurzel = self.wurzel.Einfuegen(datenNeu)

    def HoeheGeben(self):
        pass

    def AnzahlGeben(self):
        pass


b = BinBaum()
for w in ["clip", "cat", "cup", "cut", "cube", "cave", "crab"]:
    b.Einfuegen(Eintrag(w))
print(b.HoeheGeben(), b.AnzahlGeben())
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


class Baumelement(ABC):
    @abstractmethod
    def Einfuegen(self, datenNeu):
        pass

    @abstractmethod
    def HoeheGeben(self):
        pass

    @abstractmethod
    def AnzahlGeben(self):
        pass


class Abschluss(Baumelement):
    def Einfuegen(self, datenNeu):
        return Knoten(datenNeu, Abschluss(), Abschluss())

    def HoeheGeben(self):
        return -1

    def AnzahlGeben(self):
        return 0


class Knoten(Baumelement):
    def __init__(self, datenNeu, linkerNachfolgerNeu, rechterNachfolgerNeu):
        self.daten = datenNeu
        self.linkerNachfolger = linkerNachfolgerNeu
        self.rechterNachfolger = rechterNachfolgerNeu

    def Einfuegen(self, datenNeu):
        s = datenNeu.SchluesselAlsStringGeben()
        if self.daten.SchluesselIstGleich(s):
            return self
        if self.daten.SchluesselIstGroesserAls(s):
            self.linkerNachfolger = self.linkerNachfolger.Einfuegen(datenNeu)
        else:
            self.rechterNachfolger = self.rechterNachfolger.Einfuegen(datenNeu)
        return self

    def HoeheGeben(self):
        return 1 + max(self.linkerNachfolger.HoeheGeben(), self.rechterNachfolger.HoeheGeben())

    def AnzahlGeben(self):
        return 1 + self.linkerNachfolger.AnzahlGeben() + self.rechterNachfolger.AnzahlGeben()


class BinBaum:
    def __init__(self):
        self.wurzel = Abschluss()

    def Einfuegen(self, datenNeu):
        self.wurzel = self.wurzel.Einfuegen(datenNeu)

    def HoeheGeben(self):
        return self.wurzel.HoeheGeben()

    def AnzahlGeben(self):
        return self.wurzel.AnzahlGeben()


b = BinBaum()
for w in ["clip", "cat", "cup", "cut", "cube", "cave", "crab"]:
    b.Einfuegen(Eintrag(w))
print(b.HoeheGeben(), b.AnzahlGeben())
--- tests
def baue(*worte):
    b = BinBaum()
    for w in worte:
        b.Einfuegen(Eintrag(w))
    return b

@test("HoeheGeben")
def _():
    eq(BinBaum().HoeheGeben(), -1, "Höhe des leeren Baums")
    eq(baue("clip").HoeheGeben(), 0, "Höhe eines einzelnen Knotens")
    eq(baue("clip", "car", "crab", "coin").HoeheGeben(), 2, "Höhe des Testbaums")
    eq(baue("clip", "cat", "cup", "cut", "cube", "cave", "crab").HoeheGeben(), 3, "Höhe des Wörterbuchs")
    eq(baue("a", "b", "c", "d", "e").HoeheGeben(), 4, "Höhe bei sortiertem Einfügen")

@test("AnzahlGeben")
def _():
    eq(BinBaum().AnzahlGeben(), 0, "Anzahl im leeren Baum")
    eq(baue("clip", "car", "crab", "coin").AnzahlGeben(), 4, "Anzahl im Testbaum")
    eq(baue("clip", "cat", "cup", "cut", "cube", "cave", "crab", "cat").AnzahlGeben(), 7, "Anzahl (ein Wort doppelt eingefügt)")
--- hint
Abschluss: Höhe −1, Anzahl 0. Knoten: Höhe 1 + größere Höhe der beiden Nachfolger (`max(...)`), Anzahl 1 + beide Anzahlen.
--- explain
Beide Methoden fragen **beide** Nachfolger (im Gegensatz zu Suchen), denn die Antwort hängt vom ganzen Teilbaum ab. Das ist ein Postorder-Muster: Erst kommen die Antworten der Nachfolger, dann rechnet der Knoten.
:::

:::exercise id=t3-tiefe title="TiefeGeben (Aufgabe 3 f)" level=3
Implementiere `TiefeGeben(suchSchluessel)` in allen drei Klassen: Sie gibt die Tiefe des Knotens mit diesem Schlüssel zurück (Wurzel: 0) und **−1**, wenn es den Schlüssel nicht gibt. Nutze die Ordnung (nur einen Nachfolger fragen).
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


class Baumelement(ABC):
    @abstractmethod
    def Einfuegen(self, datenNeu):
        pass

    @abstractmethod
    def TiefeGeben(self, suchSchluessel):
        pass


class Abschluss(Baumelement):
    def Einfuegen(self, datenNeu):
        return Knoten(datenNeu, Abschluss(), Abschluss())

    def TiefeGeben(self, suchSchluessel):
        pass


class Knoten(Baumelement):
    def __init__(self, datenNeu, linkerNachfolgerNeu, rechterNachfolgerNeu):
        self.daten = datenNeu
        self.linkerNachfolger = linkerNachfolgerNeu
        self.rechterNachfolger = rechterNachfolgerNeu

    def Einfuegen(self, datenNeu):
        s = datenNeu.SchluesselAlsStringGeben()
        if self.daten.SchluesselIstGleich(s):
            return self
        if self.daten.SchluesselIstGroesserAls(s):
            self.linkerNachfolger = self.linkerNachfolger.Einfuegen(datenNeu)
        else:
            self.rechterNachfolger = self.rechterNachfolger.Einfuegen(datenNeu)
        return self

    def TiefeGeben(self, suchSchluessel):
        pass


class BinBaum:
    def __init__(self):
        self.wurzel = Abschluss()

    def Einfuegen(self, datenNeu):
        self.wurzel = self.wurzel.Einfuegen(datenNeu)

    def TiefeGeben(self, suchSchluessel):
        pass


b = BinBaum()
for w in ["clip", "car", "crab", "coin"]:
    b.Einfuegen(Eintrag(w))
print(b.TiefeGeben("coin"), b.TiefeGeben("dog"))
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


class Baumelement(ABC):
    @abstractmethod
    def Einfuegen(self, datenNeu):
        pass

    @abstractmethod
    def TiefeGeben(self, suchSchluessel):
        pass


class Abschluss(Baumelement):
    def Einfuegen(self, datenNeu):
        return Knoten(datenNeu, Abschluss(), Abschluss())

    def TiefeGeben(self, suchSchluessel):
        return -1


class Knoten(Baumelement):
    def __init__(self, datenNeu, linkerNachfolgerNeu, rechterNachfolgerNeu):
        self.daten = datenNeu
        self.linkerNachfolger = linkerNachfolgerNeu
        self.rechterNachfolger = rechterNachfolgerNeu

    def Einfuegen(self, datenNeu):
        s = datenNeu.SchluesselAlsStringGeben()
        if self.daten.SchluesselIstGleich(s):
            return self
        if self.daten.SchluesselIstGroesserAls(s):
            self.linkerNachfolger = self.linkerNachfolger.Einfuegen(datenNeu)
        else:
            self.rechterNachfolger = self.rechterNachfolger.Einfuegen(datenNeu)
        return self

    def TiefeGeben(self, suchSchluessel):
        if self.daten.SchluesselIstGleich(suchSchluessel):
            return 0
        if self.daten.SchluesselIstGroesserAls(suchSchluessel):
            t = self.linkerNachfolger.TiefeGeben(suchSchluessel)
        else:
            t = self.rechterNachfolger.TiefeGeben(suchSchluessel)
        if t == -1:
            return -1
        return t + 1


class BinBaum:
    def __init__(self):
        self.wurzel = Abschluss()

    def Einfuegen(self, datenNeu):
        self.wurzel = self.wurzel.Einfuegen(datenNeu)

    def TiefeGeben(self, suchSchluessel):
        return self.wurzel.TiefeGeben(suchSchluessel)


b = BinBaum()
for w in ["clip", "car", "crab", "coin"]:
    b.Einfuegen(Eintrag(w))
print(b.TiefeGeben("coin"), b.TiefeGeben("dog"))
--- tests
def baue(*worte):
    b = BinBaum()
    for w in worte:
        b.Einfuegen(Eintrag(w))
    return b

@test("Vorhandene Schlüssel")
def _():
    b = baue("clip", "car", "crab", "coin")
    for w, t in [("clip", 0), ("car", 1), ("crab", 1), ("coin", 2)]:
        eq(b.TiefeGeben(w), t, 'TiefeGeben("%s")' % w)
    b2 = baue("clip", "cat", "cup", "cut", "cube", "cave", "crab")
    eq(b2.TiefeGeben("crab"), 3, 'TiefeGeben("crab") im Wörterbuch')

@test("Nicht vorhanden: -1 auf jeder Ebene")
def _():
    b = baue("clip", "car", "crab", "coin")
    for w in ["bus", "cat", "cow", "dog"]:
        eq(b.TiefeGeben(w), -1, 'TiefeGeben("%s")' % w)
    eq(BinBaum().TiefeGeben("clip"), -1, "im leeren Baum")
--- hint
Abschluss: `return -1`. Knoten: gleicher Schlüssel → 0. Sonst die Antwort `t` des passenden Nachfolgers holen.
--- hint
Gib `t + 1` nur zurück, wenn `t` nicht −1 ist. Sonst würde aus „nicht gefunden“ in der Ebene darüber 0, also „gefunden an der Wurzel“.
--- explain
Der Sonderwert −1 muss unverändert durch alle Ebenen nach oben gereicht werden. Das ist dieselbe Idee wie bei `Suchen`, das `None` unverändert weitergibt; nur muss hier jede Ebene bei einem echten Ergebnis eins addieren.
:::

:::exercise id=t3-inorder title="Das Wörterbuch sortiert ausgeben" level=2
Implementiere in allen drei Klassen:

- `InorderAusgeben()`: gibt alle Einträge alphabetisch aus (mit `InformationAusgeben()` jedes Eintrags).
- `WoerterSammeln(liste)`: hängt alle Wörter alphabetisch an die Python-Liste `liste` an. `BinBaum.WoerterGeben()` ist gegeben.
--- starter
from abc import ABC, abstractmethod


class Woerterbucheintrag:
    def __init__(self, wortNeu, bedeutungNeu):
        self.wort = wortNeu
        self.bedeutung = bedeutungNeu

    def InformationAusgeben(self):
        print(f"{self.wort}: {self.bedeutung}")

    def SchluesselIstGleich(self, s):
        return self.wort == s

    def SchluesselIstGroesserAls(self, s):
        return self.wort > s

    def SchluesselAlsStringGeben(self):
        return self.wort

    def WortGeben(self):
        return self.wort


class Baumelement(ABC):
    @abstractmethod
    def Einfuegen(self, datenNeu):
        pass

    @abstractmethod
    def InorderAusgeben(self):
        pass

    @abstractmethod
    def WoerterSammeln(self, liste):
        pass


class Abschluss(Baumelement):
    def Einfuegen(self, datenNeu):
        return Knoten(datenNeu, Abschluss(), Abschluss())

    def InorderAusgeben(self):
        pass

    def WoerterSammeln(self, liste):
        pass


class Knoten(Baumelement):
    def __init__(self, datenNeu, linkerNachfolgerNeu, rechterNachfolgerNeu):
        self.daten = datenNeu
        self.linkerNachfolger = linkerNachfolgerNeu
        self.rechterNachfolger = rechterNachfolgerNeu

    def Einfuegen(self, datenNeu):
        s = datenNeu.SchluesselAlsStringGeben()
        if self.daten.SchluesselIstGleich(s):
            return self
        if self.daten.SchluesselIstGroesserAls(s):
            self.linkerNachfolger = self.linkerNachfolger.Einfuegen(datenNeu)
        else:
            self.rechterNachfolger = self.rechterNachfolger.Einfuegen(datenNeu)
        return self

    def InorderAusgeben(self):
        pass

    def WoerterSammeln(self, liste):
        pass


class BinBaum:
    def __init__(self):
        self.wurzel = Abschluss()

    def Einfuegen(self, datenNeu):
        self.wurzel = self.wurzel.Einfuegen(datenNeu)

    def InorderAusgeben(self):
        pass

    def WoerterGeben(self):
        liste = []
        self.wurzel.WoerterSammeln(liste)
        return liste


b = BinBaum()
for w, bd in [("clip", "Spange"), ("cat", "Katze"), ("cup", "Tasse"), ("cut", "Schnitt"), ("cube", "Würfel")]:
    b.Einfuegen(Woerterbucheintrag(w, bd))
b.InorderAusgeben()
--- solution
from abc import ABC, abstractmethod


class Woerterbucheintrag:
    def __init__(self, wortNeu, bedeutungNeu):
        self.wort = wortNeu
        self.bedeutung = bedeutungNeu

    def InformationAusgeben(self):
        print(f"{self.wort}: {self.bedeutung}")

    def SchluesselIstGleich(self, s):
        return self.wort == s

    def SchluesselIstGroesserAls(self, s):
        return self.wort > s

    def SchluesselAlsStringGeben(self):
        return self.wort

    def WortGeben(self):
        return self.wort


class Baumelement(ABC):
    @abstractmethod
    def Einfuegen(self, datenNeu):
        pass

    @abstractmethod
    def InorderAusgeben(self):
        pass

    @abstractmethod
    def WoerterSammeln(self, liste):
        pass


class Abschluss(Baumelement):
    def Einfuegen(self, datenNeu):
        return Knoten(datenNeu, Abschluss(), Abschluss())

    def InorderAusgeben(self):
        pass

    def WoerterSammeln(self, liste):
        pass


class Knoten(Baumelement):
    def __init__(self, datenNeu, linkerNachfolgerNeu, rechterNachfolgerNeu):
        self.daten = datenNeu
        self.linkerNachfolger = linkerNachfolgerNeu
        self.rechterNachfolger = rechterNachfolgerNeu

    def Einfuegen(self, datenNeu):
        s = datenNeu.SchluesselAlsStringGeben()
        if self.daten.SchluesselIstGleich(s):
            return self
        if self.daten.SchluesselIstGroesserAls(s):
            self.linkerNachfolger = self.linkerNachfolger.Einfuegen(datenNeu)
        else:
            self.rechterNachfolger = self.rechterNachfolger.Einfuegen(datenNeu)
        return self

    def InorderAusgeben(self):
        self.linkerNachfolger.InorderAusgeben()
        self.daten.InformationAusgeben()
        self.rechterNachfolger.InorderAusgeben()

    def WoerterSammeln(self, liste):
        self.linkerNachfolger.WoerterSammeln(liste)
        liste.append(self.daten.WortGeben())
        self.rechterNachfolger.WoerterSammeln(liste)


class BinBaum:
    def __init__(self):
        self.wurzel = Abschluss()

    def Einfuegen(self, datenNeu):
        self.wurzel = self.wurzel.Einfuegen(datenNeu)

    def InorderAusgeben(self):
        self.wurzel.InorderAusgeben()

    def WoerterGeben(self):
        liste = []
        self.wurzel.WoerterSammeln(liste)
        return liste


b = BinBaum()
for w, bd in [("clip", "Spange"), ("cat", "Katze"), ("cup", "Tasse"), ("cut", "Schnitt"), ("cube", "Würfel")]:
    b.Einfuegen(Woerterbucheintrag(w, bd))
b.InorderAusgeben()
--- tests
def baue(*worte):
    b = BinBaum()
    for w in worte:
        b.Einfuegen(Woerterbucheintrag(w, w.upper()))
    return b

@test("WoerterGeben")
def _():
    eq(baue("clip", "cat", "cup", "cut", "cube", "cave", "crab").WoerterGeben(), ["cat", "cave", "clip", "crab", "cube", "cup", "cut"], "WoerterGeben()")
    eq(BinBaum().WoerterGeben(), [], "leerer Baum")
    eq(baue("hero", "heap", "hope", "hag", "heat", "hint", "hull").WoerterGeben(), ["hag", "heap", "heat", "hero", "hint", "hope", "hull"], "h-Wörter")

@test("InorderAusgeben")
def _():
    b = baue("clip", "cat", "cup")
    eq(lines(printed(b.InorderAusgeben)), ["cat: CAT", "clip: CLIP", "cup: CUP"], "Ausgabe von InorderAusgeben()")
    eq(lines(printed(BinBaum().InorderAusgeben)), [], "leerer Baum gibt nichts aus")

@test("Ausgabe des Programms")
def _():
    eq(lines(OUTPUT), ["cat: Katze", "clip: Spange", "cube: Würfel", "cup: Tasse", "cut: Schnitt"], "Ausgabe")
--- hint
Abschluss: In beiden Methoden ist nichts zu tun (`pass`). Knoten: links, sich selbst, rechts.
--- explain
Inorder auf einem geordneten Binärbaum ergibt immer die sortierte Reihenfolge. Die Python-Liste wird als Parameter durch alle Knoten gereicht, alle hängen an dieselbe Liste an.
:::

:::exercise id=t3-istfrei title="istFrei (Abitur 2019, Aufgabe 4 c)" level=2
Implementiere `istFrei(benutzername)` in `Nutzerbaum`, `Knoten` und `Abschluss`: `False` genau dann, wenn der Name schon vergeben ist. Verwende die gegebene Funktion `vergleichenMit(zk1, zk2)` (negativ, 0 oder positiv wie im Hinweis der Aufgabe) und nutze die Ordnung: Jeder Knoten fragt höchstens **einen** Nachfolger.
--- starter
from abc import ABC, abstractmethod


def vergleichenMit(zk1, zk2):
    """negativ, wenn zk1 lexikographisch vor zk2 steht, 0 bei Gleichheit, sonst positiv"""
    if zk1 < zk2:
        return -1
    if zk1 > zk2:
        return 1
    return 0


class Baumelement(ABC):
    @abstractmethod
    def einfuegen(self, name):
        pass

    @abstractmethod
    def istFrei(self, name):
        pass


class Abschluss(Baumelement):
    def einfuegen(self, name):
        return Knoten(name, Abschluss(), Abschluss())

    def istFrei(self, name):
        pass


class Knoten(Baumelement):
    def __init__(self, name, li, re):
        self.benutzername = name
        self.liNachfolger = li
        self.reNachfolger = re

    def einfuegen(self, name):
        v = vergleichenMit(name, self.benutzername)
        if v < 0:
            self.liNachfolger = self.liNachfolger.einfuegen(name)
        elif v > 0:
            self.reNachfolger = self.reNachfolger.einfuegen(name)
        return self

    def istFrei(self, name):
        pass


class Nutzerbaum:
    def __init__(self):
        self.wurzel = Abschluss()

    def einfuegen(self, name):
        self.wurzel = self.wurzel.einfuegen(name)

    def istFrei(self, name):
        pass


baum = Nutzerbaum()
for n in ["mira", "falk", "tom", "anna", "kai", "sina", "zoe"]:
    baum.einfuegen(n)
print(baum.istFrei("kai"), baum.istFrei("ben"))
--- solution
from abc import ABC, abstractmethod


def vergleichenMit(zk1, zk2):
    """negativ, wenn zk1 lexikographisch vor zk2 steht, 0 bei Gleichheit, sonst positiv"""
    if zk1 < zk2:
        return -1
    if zk1 > zk2:
        return 1
    return 0


class Baumelement(ABC):
    @abstractmethod
    def einfuegen(self, name):
        pass

    @abstractmethod
    def istFrei(self, name):
        pass


class Abschluss(Baumelement):
    def einfuegen(self, name):
        return Knoten(name, Abschluss(), Abschluss())

    def istFrei(self, name):
        return True


class Knoten(Baumelement):
    def __init__(self, name, li, re):
        self.benutzername = name
        self.liNachfolger = li
        self.reNachfolger = re

    def einfuegen(self, name):
        v = vergleichenMit(name, self.benutzername)
        if v < 0:
            self.liNachfolger = self.liNachfolger.einfuegen(name)
        elif v > 0:
            self.reNachfolger = self.reNachfolger.einfuegen(name)
        return self

    def istFrei(self, name):
        v = vergleichenMit(name, self.benutzername)
        if v == 0:
            return False
        if v < 0:
            return self.liNachfolger.istFrei(name)
        return self.reNachfolger.istFrei(name)


class Nutzerbaum:
    def __init__(self):
        self.wurzel = Abschluss()

    def einfuegen(self, name):
        self.wurzel = self.wurzel.einfuegen(name)

    def istFrei(self, name):
        return self.wurzel.istFrei(name)


baum = Nutzerbaum()
for n in ["mira", "falk", "tom", "anna", "kai", "sina", "zoe"]:
    baum.einfuegen(n)
print(baum.istFrei("kai"), baum.istFrei("ben"))
--- tests
def baue(*namen):
    b = Nutzerbaum()
    for n in namen:
        b.einfuegen(n)
    return b

@test("Vergebene und freie Namen")
def _():
    b = baue("mira", "falk", "tom", "anna", "kai", "sina", "zoe")
    for n in ["mira", "falk", "tom", "anna", "kai", "sina", "zoe"]:
        eq(b.istFrei(n), False, 'istFrei("%s")' % n)
    for n in ["ben", "aaron", "lea", "tim", "zara", "mi"]:
        eq(b.istFrei(n), True, 'istFrei("%s")' % n)
    eq(Nutzerbaum().istFrei("tom"), True, "im leeren Baum ist jeder Name frei")

@test("Nutzt die Ordnung")
def _():
    namen = ["h", "d", "l", "b", "f", "j", "n", "a", "c", "e", "g", "i", "k", "m", "o"]
    b = baue(*namen)
    aufrufe = [0]
    original = Knoten.istFrei
    def zaehlend(self, name):
        aufrufe[0] += 1
        return original(self, name)
    Knoten.istFrei = zaehlend
    try:
        b.istFrei("g")
        b.istFrei("p")
    finally:
        Knoten.istFrei = original
    ok(aufrufe[0] <= 8, "Bei 15 Namen auf 4 Ebenen darf eine Prüfung höchstens 4 Knoten befragen (gezählt: %d bei zwei Prüfungen)" % aufrufe[0])
--- hint
Abschluss: Hier ist die Suche erfolglos, also ist der Name **frei**.
--- hint
Knoten: `v = vergleichenMit(name, self.benutzername)`. Bei 0 ist der Name vergeben. Bei negativem `v` steht der Name vor meinem, also links weiterfragen, sonst rechts.
--- explain
`istFrei` ist eine Suche mit umgekehrter Antwort: Treffer bedeutet „nicht frei“, der Abschluss bedeutet „frei“. Weil jeder Knoten nur einen Nachfolger fragt, braucht eine Prüfung höchstens so viele Schritte, wie der Baum Ebenen hat.
:::

:::exercise id=t3-m1 title="Alle Namen mit einem Anfangsbuchstaben (Abitur 2019, Aufgabe 4 d)" level=3
Setze die Methoden `m1` und `m2` aus der Abituraufgabe in Python um. Statt der Klasse LISTE verwendest du eine Python-Liste (`hintenEinfuegen` wird `append`). `Nutzerbaum.m1(z)` gibt die Liste zurück. Vergiss `m2` im Abschluss nicht.
--- starter
from abc import ABC, abstractmethod


class Baumelement(ABC):
    @abstractmethod
    def einfuegen(self, name):
        pass

    @abstractmethod
    def m2(self, z, liste):
        pass


class Abschluss(Baumelement):
    def einfuegen(self, name):
        return Knoten(name, Abschluss(), Abschluss())

    def m2(self, z, liste):
        pass


class Knoten(Baumelement):
    def __init__(self, name, li, re):
        self.benutzername = name
        self.liNachfolger = li
        self.reNachfolger = re

    def einfuegen(self, name):
        if name < self.benutzername:
            self.liNachfolger = self.liNachfolger.einfuegen(name)
        elif name > self.benutzername:
            self.reNachfolger = self.reNachfolger.einfuegen(name)
        return self

    def m2(self, z, liste):
        pass


class Nutzerbaum:
    def __init__(self):
        self.wurzel = Abschluss()

    def einfuegen(self, name):
        self.wurzel = self.wurzel.einfuegen(name)

    def m1(self, z):
        pass


baum = Nutzerbaum()
for n in ["mira", "sven", "falk", "tom", "sina", "anna", "susi", "sam", "zoe", "kai"]:
    baum.einfuegen(n)
print(baum.m1("s"))
--- solution
from abc import ABC, abstractmethod


class Baumelement(ABC):
    @abstractmethod
    def einfuegen(self, name):
        pass

    @abstractmethod
    def m2(self, z, liste):
        pass


class Abschluss(Baumelement):
    def einfuegen(self, name):
        return Knoten(name, Abschluss(), Abschluss())

    def m2(self, z, liste):
        pass


class Knoten(Baumelement):
    def __init__(self, name, li, re):
        self.benutzername = name
        self.liNachfolger = li
        self.reNachfolger = re

    def einfuegen(self, name):
        if name < self.benutzername:
            self.liNachfolger = self.liNachfolger.einfuegen(name)
        elif name > self.benutzername:
            self.reNachfolger = self.reNachfolger.einfuegen(name)
        return self

    def m2(self, z, liste):
        z1 = self.benutzername[0]
        if z < z1:
            self.liNachfolger.m2(z, liste)
        elif z > z1:
            self.reNachfolger.m2(z, liste)
        else:
            self.liNachfolger.m2(z, liste)
            liste.append(self.benutzername)
            self.reNachfolger.m2(z, liste)


class Nutzerbaum:
    def __init__(self):
        self.wurzel = Abschluss()

    def einfuegen(self, name):
        self.wurzel = self.wurzel.einfuegen(name)

    def m1(self, z):
        liste = []
        self.wurzel.m2(z, liste)
        return liste


baum = Nutzerbaum()
for n in ["mira", "sven", "falk", "tom", "sina", "anna", "susi", "sam", "zoe", "kai"]:
    baum.einfuegen(n)
print(baum.m1("s"))
--- tests
def baue(*namen):
    b = Nutzerbaum()
    for n in namen:
        b.einfuegen(n)
    return b

@test("m1 liefert alle Namen mit dem Buchstaben, sortiert")
def _():
    b = baue("mira", "sven", "falk", "tom", "sina", "anna", "susi", "sam", "zoe", "kai")
    eq(b.m1("s"), ["sam", "sina", "susi", "sven"], 'm1("s")')
    eq(b.m1("m"), ["mira"], 'm1("m")')
    eq(b.m1("b"), [], 'm1("b")')
    eq(Nutzerbaum().m1("s"), [], "leerer Baum")

@test("Unabhängig von der Einfügereihenfolge")
def _():
    b = baue("sven", "susi", "sina", "sam", "mira", "tom")
    eq(b.m1("s"), ["sam", "sina", "susi", "sven"], 'm1("s") bei anderer Reihenfolge')

@test("Betritt keine unnötigen Teilbäume")
def _():
    b = baue("mira", "falk", "tom", "anna", "kai", "sina", "zoe")
    besucht = []
    original = Knoten.m2
    def merken(self, z, liste):
        besucht.append(self.benutzername)
        return original(self, z, liste)
    Knoten.m2 = merken
    try:
        b.m1("z")
    finally:
        Knoten.m2 = original
    eq(besucht, ["mira", "tom", "zoe"], 'besuchte Knoten bei m1("z")')
--- hint
`Nutzerbaum.m1`: leere Python-Liste anlegen, `self.wurzel.m2(z, liste)`, Liste zurückgeben.
--- hint
`Knoten.m2`: `z1 = self.benutzername[0]`. Drei Fälle wie im Pseudocode: nur links, nur rechts, oder links, eigenen Namen anhängen, rechts.
--- explain
Bei `z == z1` ist m2 ein Inorder-Durchlauf, deshalb ist die Liste sortiert. In den anderen Fällen wird nur ein Teilbaum betreten, weil die Ordnung garantiert, dass im anderen kein passender Name stehen kann.
:::

## [exam] Klausurtraining

::::exam title="Klassendiagramm" points=5
Ein Kino verwaltet KUNDE-Objekte (Attribute kundennummer, name; Methode SchlüsselIstGleich, SchlüsselIstGrößerAls) in einem geordneten Binärbaum mit dem Entwurfsmuster Kompositum. Zeichne das Klassendiagramm mit den Methoden Einfügen und Suchen und benenne die Rollen des Musters.
--- solution
:::diagram classes
class KUNDENBAUM @0,0 | wurzel: BAUMELEMENT | Einfügen(k: KUNDE); Suchen(nr): KUNDE
abstract BAUMELEMENT @1.45,0 | | Einfügen(k): BAUMELEMENT {abstract}; Suchen(nr): KUNDE {abstract}
class ABSCHLUSS @0.85,1.25 | | Einfügen(k): BAUMELEMENT; Suchen(nr): KUNDE
class KNOTEN @2.1,1.25 | linkerNf: BAUMELEMENT; rechterNf: BAUMELEMENT; daten: KUNDE | Einfügen(k): BAUMELEMENT; Suchen(nr): KUNDE
class KUNDE @2.1,2.5 | kundennummer; name | SchlüsselIstGleich(nr): WAHRHEITSWERT; SchlüsselIstGrößerAls(nr): WAHRHEITSWERT
assoc KUNDENBAUM -> BAUMELEMENT : hat als Wurzel [1]
inherit ABSCHLUSS -> BAUMELEMENT
inherit KNOTEN -> BAUMELEMENT
assoc KNOTEN -> BAUMELEMENT : hat als Nachfolger [2]
assoc KNOTEN -> KUNDE : verwaltet [1]
:::
Rollen: BAUMELEMENT = Komponente, KNOTEN = Kompositum, ABSCHLUSS = Blatt, KUNDENBAUM = Klient. Häufige Punktverluste: Assoziation KNOTEN → KNOTEN statt KNOTEN → BAUMELEMENT, Multiplizität 2 vergessen, Einfügen ohne Rückgabetyp BAUMELEMENT.
::::

::::exam title="Objektdiagramm" points=4
Zeichne das Objektdiagramm eines Wörterbuchs (Kompositum), in das nacheinander „hat“, „cap“ und „pen“ eingefügt wurden. Wie viele ABSCHLUSS-Objekte gibt es?
--- solution
:::diagram objects
b: BINBAUM @0,0 | wurzel -> k1
k1: KNOTEN @1,0 | daten -> w1 | linkerNf -> k2 | rechterNf -> k3
w1: EINTRAG @2.2,0 | wort = "hat"
k2: KNOTEN @0,1.2 | daten -> w2 | linkerNf -> a1 | rechterNf -> a2
k3: KNOTEN @2,1.2 | daten -> w3 | linkerNf -> a3 | rechterNf -> a4
w2: EINTRAG @0,2.4 | wort = "cap"
w3: EINTRAG @3.1,1.2 | wort = "pen"
a1: ABSCHLUSS @0.95,2.4
a2: ABSCHLUSS @0.95,2.95
a3: ABSCHLUSS @3.05,2.4
a4: ABSCHLUSS @3.05,2.95
:::
Vier Abschlüsse (3 Knoten + 1). Kein Attribut hat den Wert nichts.
::::

::::exam title="Sequenzdiagramm für Suchen" points=5
Zeichne das Sequenzdiagramm für `Suchen("cow")` im Testbaum clip(car, crab(coin, –)). Beschrifte die Rückgabewerte.
--- solution
:::diagram seq
actors: Aufrufer | b: BINBAUM | k1: KNOTEN | k3: KNOTEN | k4: KNOTEN | a: ABSCHLUSS
Aufrufer -> b: Suchen(cow)
b -> k1: Suchen(cow)
k1 -> k3: Suchen(cow)
k3 -> k4: Suchen(cow)
k4 -> a: Suchen(cow)
a --> k4: nichts
k4 --> k3: nichts
k3 --> k1: nichts
k1 --> b: nichts
b --> Aufrufer: nichts
:::
k1 = clip (cow > clip: rechts), k3 = crab (cow < crab: links), k4 = coin (cow > coin: rechts), a = rechter Abschluss von coin. Jeder Knoten gibt die Antwort unverändert weiter.
::::

::::exam title="AnzahlBlätterGeben" points=5
Ergänze den Kompositum-Baum um eine Methode `AnzahlBlätterGeben()`, die die Anzahl der Knoten zurückgibt, deren beide Nachfolger Abschlüsse sind (die Blätter im Sinne von D1). Gib die Methode für BINBAUM, KNOTEN und ABSCHLUSS in Pseudocode an.
--- solution
```pseudo
// BINBAUM
methode GANZZAHL AnzahlBlätterGeben()
  return wurzel.AnzahlBlätterGeben()
endemethode

// KNOTEN
methode GANZZAHL AnzahlBlätterGeben()
  s = linkerNf.AnzahlBlätterGeben() + rechterNf.AnzahlBlätterGeben()
  falls s = 0 dann
    return 1
  endefalls
  return s
endemethode

// ABSCHLUSS
methode GANZZAHL AnzahlBlätterGeben()
  return 0
endemethode
```
Warum funktioniert `falls s = 0`? Jeder nichtleere Teilbaum enthält mindestens ein Blatt. Die Summe ist also genau dann 0, wenn beide Nachfolger Abschlüsse sind, und dann ist der Knoten selbst ein Blatt. So braucht der Knoten keine Abfrage, welche Klasse seine Nachfolger haben.
::::

:::exam title="Einfügen in Worten (Abitur 2020)" points=4
Beschreibe in Worten den rekursiven Algorithmus, den ein Knoten beim Einfügen eines neuen Datenelements ausführt, und erläutere die Rolle des Abschlusses.
--- solution
Siehe Logik-Abschnitt „Kinoverwaltung Teil 2“. Punkte gibt es für: Vergleich des neuen Schlüssels mit dem eigenen; Weitergabe an den linken bzw. rechten Nachfolger; Speichern des zurückgegebenen Elements als neuen Nachfolger; Rückgabe von sich selbst; Abschluss als Rekursionsende, der einen neuen Knoten erzeugt und zurückgibt; keine Prüfung auf nichts nötig.
:::

:::exam title="Rollenspiel" points=3
Ein Wörterbuch (Kompositum) enthält 6 Wörter. Wie viele Objekte gehören zur Struktur, wenn man BINBAUM, Knoten, Abschlüsse und Wörterbucheinträge zählt? Wie viele Objekte werden bei einem weiteren Aufruf von Einfügen (neues Wort) erzeugt, und wie viele fallen weg?
--- solution
1 BINBAUM + 6 KNOTEN + 6 WÖRTERBUCHEINTRÄGE + 7 ABSCHLÜSSE (Knoten + 1) = **20 Objekte**. Einfügen erzeugt 1 KNOTEN und 2 ABSCHLÜSSE (der Wörterbucheintrag wird vom Aufrufer erzeugt); ein Abschluss fällt weg. Danach: 1 + 7 + 7 + 8 = 23.
:::
