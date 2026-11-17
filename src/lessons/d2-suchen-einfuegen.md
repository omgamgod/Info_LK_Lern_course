---
id: d2
num: D2
part: D
title: Suchen und Einfügen im geordneten Binärbaum
short: Suchen und Einfügen
lead: Suchen und Einfügen laufen im geordneten Binärbaum denselben Weg von der Wurzel nach unten, bei jedem Knoten nach links oder rechts. Diese Lektion zeigt beide Algorithmen rekursiv und als Struktogramm, warum die Einfügereihenfolge die Form des Baums bestimmt und wie man einen ganzen Baum sortiert ausgibt. In Python schreibst du sie zuerst mit None, so wie die Liste in C3; in D3 folgt das Kompositum.
minutes: 100
uses: [d1, b1, c3]
goals:
  - einen Schlüssel im geordneten Binärbaum suchen und die Anzahl der Vergleiche angeben
  - Elemente in einen geordneten Binärbaum einfügen und den entstehenden Baum zeichnen
  - erklären, wo bei Suchen und Einfügen Rekursion verwendet wird, und beide Algorithmen als Struktogramm darstellen
  - alle Einfügereihenfolgen zu einem gegebenen Baum angeben und die Folgen sortierten Einfügens beurteilen
  - einen Baum in Inorder, Preorder und Postorder durchlaufen
---

## [logic] Suchen (12_III_2_Beispielbaum)

Gesucht ist der Schlüssel 84 im Beispielbaum deiner Lehrkraft. Man beginnt an der **Wurzel** und vergleicht:

:::diagram bintree caption="Suche nach 84: fünf Vergleiche"
pfad: 64, 96, 85, 82, 84
64(57(0(,30),),96(85(82(69,84{green}),95),))
:::

1. 84 > 64: Weiter rechts. Der ganze linke Teilbaum (57, 0, 30) fällt weg.
2. 84 < 96: links.
3. 84 < 85: links.
4. 84 > 82: rechts.
5. 84 = 84: **gefunden**.

Sucht man 70, läuft man 64, 96, 85, 82, 69 und will dann rechts von 69 weiter. Dort ist **nichts**: 70 ist **nicht im Baum**. Auch das steht nach fünf Vergleichen fest, ohne dass man den Rest des Baums ansehen muss.

:::viz bst
{"preset": "beispiel", "value": 84, "start": "search"}
:::

### Wo wird hier Rekursion verwendet?

Nach dem ersten Vergleich sucht man nur noch in einem **Teilbaum** weiter, und jeder Teilbaum eines geordneten Binärbaums ist **selbst wieder ein geordneter Binärbaum**. Die Aufgabe „suche *s* im Baum mit Wurzel 64“ wird zur gleichen Aufgabe „suche *s* im Baum mit Wurzel 96“, nur kleiner. Das ist der **Rekursionsschritt**. Die Rekursion endet in zwei Fällen:

- Der Schlüssel des aktuellen Knotens ist *s*: **gefunden**.
- In der gewünschten Richtung gibt es keinen Teilbaum: **nicht gefunden**.

Als Methode der Klasse KNOTEN, so wie die Liste in C3 (das Ende eines Asts wird mit *nichts* markiert):

```pseudo
methode DATENELEMENT Suchen(s)                  // in KNOTEN
  falls s = daten dann
    return daten
  sonst falls s < daten dann
    falls linkerNachfolger ≠ nichts dann
      return linkerNachfolger.Suchen(s)
    sonst
      return nichts
    endefalls
  sonst
    falls rechterNachfolger ≠ nichts dann
      return rechterNachfolger.Suchen(s)
    sonst
      return nichts
    endefalls
  endefalls
endemethode
```

Der rekursive Aufruf steht jeweils **ganz am Ende**, sein Ergebnis wird nur weitergereicht: Die Suche ist **endrekursiv** (B1). Deshalb lässt sie sich genauso gut mit einer Schleife schreiben, die sich in einer Variablen `aktuell` merkt, wo sie gerade ist:

:::diagram struktogramm caption="Suchen im geordneten Binärbaum (mit Wiederholung)"
title Suchen(s)
S: aktuell = wurzel
W: solange aktuell ≠ nichts
  F: s = aktuell.daten
    T:
      S: return aktuell.daten
    E:
      F: s < aktuell.daten
        T:
          S: aktuell = aktuell.linkerNachfolger
        E:
          S: aktuell = aktuell.rechterNachfolger
S: return nichts
:::

:::quiz
Wie viele Vergleiche braucht die Suche nach 30 im Beispielbaum?
- [ ] 2
- [ ] 3
- [x] 4
- [ ] 10
--- explain
30 < 64 (links), 30 < 57 (links), 30 > 0 (rechts), 30 = 30. Vier Vergleiche, einer pro Ebene bis zu der Ebene, auf der 30 steht.
:::

## [logic] Einfügen

Ein neuer Schlüssel muss an die Stelle, an der eine **Suche nach ihm enden würde**. Man geht also denselben Weg wie beim Suchen, bis in der gewünschten Richtung kein Nachfolger mehr ist, und hängt den neuen Knoten **genau dort** an. Daraus folgt:

- Ein neuer Knoten wird **immer ein Blatt**. Der vorhandene Baum ändert sich sonst nicht; kein Knoten wird verschoben.
- Ist der Schlüssel **schon vorhanden**, findet die Suche ihn: Es wird nichts eingefügt (jeder Schlüssel kommt nur einmal vor).
- Ist der Baum **leer**, wird der neue Knoten die Wurzel.

:::diagram bintree caption="70 einfügen: Der Weg endet rechts von 69"
pfad: 64, 96, 85, 82, 69, 70
64(57(0(,30),),96(85(82(69(,70{green}),84),95),))
:::

:::viz bst
{"preset": "beispiel", "value": 70, "start": "insert"}
:::

```pseudo
methode Einfügen(neu)                           // in KNOTEN
  falls neu = daten dann
    // schon vorhanden: nichts tun
  sonst falls neu < daten dann
    falls linkerNachfolger = nichts dann
      linkerNachfolger = neu KNOTEN(neu)
    sonst
      linkerNachfolger.Einfügen(neu)
    endefalls
  sonst
    falls rechterNachfolger = nichts dann
      rechterNachfolger = neu KNOTEN(neu)
    sonst
      rechterNachfolger.Einfügen(neu)
    endefalls
  endefalls
endemethode
```

Der Baum selbst prüft nur, ob er leer ist (dann wird der neue Knoten die Wurzel), und gibt sonst den Auftrag an die Wurzel weiter, genau wie die Liste in C3.

:::diagram struktogramm caption="Einfügen als rekursive Methode von KNOTEN"
title Einfügen(neu)
F: neu < daten
  T:
    F: linkerNf = nichts
      T:
        S: linkerNf = neu KNOTEN(neu)
      E:
        S: linkerNf.Einfügen(neu)
  E:
    F: neu > daten
      T:
        F: rechterNf = nichts
          T:
            S: rechterNf = neu KNOTEN(neu)
          E:
            S: rechterNf.Einfügen(neu)
      E:
        S: (schon vorhanden)
:::

Im Struktogramm sind die Attributnamen wie im Klassendiagramm deiner Lehrkraft abgekürzt: `linkerNf` und `rechterNf` stehen für linker und rechter Nachfolger.

:::warn title="Lexikographisch, nicht nach Länge"
Bei Wörtern und Codes wie `N202` gilt die Wörterbuchreihenfolge aus D1: Zeichen für Zeichen vergleichen. `R212` ist größer als `P114`, weil R hinter P kommt, egal wie die Ziffern lauten.
:::

## [logic] Die Reihenfolge bestimmt die Form (12_III_2_Aufgabe_1)

Dieselben Schlüssel ergeben je nach **Einfügereihenfolge** ganz verschiedene Bäume. Der erste Schlüssel wird immer die Wurzel; jeder spätere wird ein Blatt unter einem schon vorhandenen Knoten.

:::diagram bintree caption="Aufgabe 1: Welche Reihenfolgen erzeugen diesen Baum?"
5781(4221,6345(5799,))
:::

**a)** Ein Knoten kann erst eingefügt werden, wenn alle Knoten auf dem Weg von der Wurzel zu ihm (seine **Vorfahren**) schon da sind. Also: 5781 zuerst; 5799 erst nach 6345; 4221 irgendwann nach 5781. Es gibt genau **drei** Reihenfolgen:

- 5781, 4221, 6345, 5799
- 5781, 6345, 4221, 5799
- 5781, 6345, 5799, 4221

**b)** Einfügen von 6300, 5888 und 5788 nacheinander:

- 6300: > 5781 (rechts), < 6345 (links), > 5799 (rechts): rechter Nachfolger von 5799.
- 5888: > 5781, < 6345, > 5799, < 6300: linker Nachfolger von 6300.
- 5788: > 5781, < 6345, < 5799: linker Nachfolger von 5799.

:::diagram bintree caption="Nach dem Einfügen von 6300, 5888 und 5788"
5781(4221,6345(5799(5788{green},6300{green}(5888{green},)),))
:::

**Sortiert eingefügt.** Kommen die Schlüssel **aufsteigend** an (1, 2, 3, 4 …), ist jeder neue Schlüssel der größte bisher: Er wandert immer ganz nach rechts. Der Baum **entartet** zu einer Liste, und eine Suche braucht so viele Vergleiche, wie es Knoten gibt. Dasselbe passiert bei absteigender Reihenfolge nach links.

:::diagram bintree caption="1, 2, 3, 4, 5 sortiert eingefügt: ein entarteter Baum"
1(,2(,3(,4(,5))))
:::

## [logic] Netzwerkgeräte (12_III_2_Aufgabe_4)

Die Geräte N202, R273, N304, P114, N111, R212, N264 werden in dieser Reihenfolge in einen leeren, lexikographisch geordneten Binärbaum eingefügt.

:::diagram bintree caption="a) Der entstehende Baum"
ebenen: ja
N202(N111,R273(N304(N264,P114(,R212)),))
:::

Zum Beispiel R212: > N202 (rechts), < R273 (links), > N304 (rechts), > P114 (rechts).

**b)** Der tiefste Knoten R212 hat Tiefe 4: Die Höhe des Baums ist **4**, er hat **5 Ebenen**. Für **2000 Geräte** braucht man mindestens 11 Ebenen, denn 2<sup>10</sup> − 1 = 1023 < 2000 ≤ 2047 = 2<sup>11</sup> − 1.

**c)** Fügt man alle Geräte **geordnet nach Typ und Nummer** ein (N001, N002, …, P001, …), kommen sie sortiert an: Der Baum entartet zu einer Liste mit 2000 Ebenen, eine Suche braucht bis zu 2000 statt 11 Vergleiche. Das Vorgehen ist also schlecht. Besser: in zufälliger Reihenfolge einfügen oder den Baum aus der sortierten Liste wie in D1 ausgeglichen aufbauen.

## [logic] Mitgliederverwaltung Abi18Net (12_III_2_Aufgabe_5, Abitur 2018)

**a)** Mitgliedsnummern **aufsteigend** nach der Anmeldung vergeben heißt: Jede neue Nummer ist die größte. Jedes neue Mitglied wird rechts an den bisher größten Knoten gehängt, der Baum entartet zu einer Liste. Die Vorteile des Binärbaums (Suche mit wenigen Vergleichen) gehen verloren, bei *n* Mitgliedern sind bis zu *n* Vergleiche nötig. Der Vorschlag ist also ungeeignet.

**b)** Algorithmus für eine zufällige, noch nicht vergebene Nummer:

```pseudo
methode GANZZAHL NeueMitgliedsnummer()
  wiederhole
    z = Zufallszahl()
  solange Suchen(z) ≠ nichts
  return z
endemethode
```

Man zieht so lange neue Zufallszahlen, bis die Suche im Baum **erfolglos** ist; diese Nummer ist frei. Zufällige Nummern verteilen sich gleichmäßig, der Baum bleibt im Mittel gut ausgeglichen.

**c)** Einfügen von Karla (3257), Alexej (66013), Bert (116), Dagmar (5485), Holger (2485), Jörg (833271), Paula (73680). Die Nummern sind **Zahlen** und werden als Zahlen verglichen:

:::diagram bintree caption="c) Der Baum der Mitgliedsnummern"
3257(116(,2485),66013(5485,833271(73680,)))
:::

## [logic] Den ganzen Baum durchlaufen

Manchmal braucht man **alle** Elemente, zum Beispiel für eine sortierte Ausgabe. Jeder Knoten muss dann drei Dinge tun: sich selbst ausgeben, den linken Teilbaum durchlaufen und den rechten Teilbaum durchlaufen. Die Reihenfolge dieser drei Schritte gibt dem Durchlauf seinen Namen:

| Durchlauf | Reihenfolge | Beispielbaum |
|---|---|---|
| **Inorder** | links, **Knoten**, rechts | 0, 30, 57, 64, 69, 82, 84, 85, 95, 96 |
| **Preorder** | **Knoten**, links, rechts | 64, 57, 0, 30, 96, 85, 82, 69, 84, 95 |
| **Postorder** | links, rechts, **Knoten** | 30, 0, 57, 69, 84, 82, 95, 85, 96, 64 |

- **Inorder** liefert beim geordneten Binärbaum die Schlüssel **sortiert**: Alles links ist kleiner, also kommt es vorher; alles rechts ist größer, also kommt es danach. Ein geordneter Binärbaum ist damit auch ein **Sortierverfahren**: alles einfügen, dann inorder ausgeben.
- **Preorder** gibt jeden Knoten vor seinen Nachfolgern aus. Fügt man die Schlüssel in Preorder-Reihenfolge in einen leeren Baum ein, entsteht **genau derselbe Baum**; so speichert man einen Baum und lädt ihn wieder.
- **Postorder** behandelt jeden Knoten nach seinen Nachfolgern; das braucht man, wenn ein Knoten die Ergebnisse seiner Teilbäume kennen muss (z. B. die Höhe, siehe D3).

```pseudo
methode InorderAusgeben()                        // in KNOTEN
  falls linkerNachfolger ≠ nichts dann
    linkerNachfolger.InorderAusgeben()
  endefalls
  daten.InformationAusgeben()
  falls rechterNachfolger ≠ nichts dann
    rechterNachfolger.InorderAusgeben()
  endefalls
endemethode
```

:::viz bst
{"preset": "beispiel", "start": "inorder"}
:::

Wähle oben **Preorder** oder **Postorder** und drück **ausgeben**, um die anderen Durchläufe zu sehen.

:::quiz
Ein geordneter Binärbaum wurde in Preorder-Reihenfolge ausgegeben: 40, 20, 10, 30, 60, 50. Wie lautet die Inorder-Ausgabe?
- [ ] 40, 20, 60, 10, 30, 50
- [x] 10, 20, 30, 40, 50, 60
- [ ] 10, 30, 20, 50, 60, 40
- [ ] 60, 50, 40, 30, 20, 10
--- explain
Inorder eines **geordneten** Binärbaums ist immer die sortierte Reihenfolge, egal wie der Baum aussieht. (Antwort C wäre Postorder.)
:::

## [logic] Was könnte verbessert werden?

Deine Lehrkraft fragt, was an dem Algorithmus verbessert werden sollte. Vier Punkte, die man nennen kann:

- **Doppelte Schlüssel**: Im Moment passiert beim zweiten Einfügen einfach nichts. Besser ist eine Rückmeldung (Rückgabewert oder Meldung), damit der Aufrufer davon erfährt, oder, je nach Anwendung, das Aktualisieren der Daten.
- **Die Form hängt von der Reihenfolge ab**: Im ungünstigen Fall entartet der Baum. Abhilfe: Einfügereihenfolge mischen oder den Baum gelegentlich aus der sortierten Folge neu und ausgeglichen aufbauen (D1). Es gibt auch Bäume, die sich beim Einfügen selbst ausbalancieren (z. B. AVL-Bäume); sie gehören nicht zum Lehrplan.
- **Doppelter Code**: Suchen und Einfügen gehen denselben Weg. Man kann die Wegsuche einmal schreiben und für beide verwenden.
- **Die Prüfungen auf nichts**: Jede Methode fragt zweimal „Gibt es den linken / rechten Nachfolger?“. Genau dieses Problem hat das **Kompositum** bei der Liste gelöst. In D3 bekommt der Baum ABSCHLUSS-Objekte, und alle Prüfungen verschwinden.

## [bridge] Vom Pseudocode zu Python

Die Python-Blöcke dieser Lektion speichern einfache Schlüssel (Zahlen oder Zeichenketten) direkt im Knoten. Die Attributnamen sind schon die aus der Vorlage deiner Lehrkraft für D3.

:::bridge title="Suchen in KNOTEN (mit None, wie in C3)"
methode Suchen(s) ||     def Suchen(self, s):
  falls s = daten dann ||         if s == self.daten:
    return daten ||             return self.daten
  sonst falls s < daten dann ||         if s < self.daten:
    falls linkerNachfolger ≠ nichts dann ||             if self.linkerNachfolger is not None:
      return linkerNachfolger.Suchen(s) ||                 return self.linkerNachfolger.Suchen(s)
    return nichts ||             return None
  sonst ||         else:
    falls rechterNachfolger ≠ nichts dann ||             if self.rechterNachfolger is not None:
      return rechterNachfolger.Suchen(s) ||                 return self.rechterNachfolger.Suchen(s)
    return nichts ||             return None
>> Python vergleicht Zahlen nach ihrem Wert und Zeichenketten lexikographisch; derselbe Code funktioniert also für beides.
:::

:::bridge title="Einfügen in BINBAUM und KNOTEN"
// BINBAUM ||     # class BinBaum
methode Einfügen(neu) ||     def Einfuegen(self, neu):
  falls wurzel = nichts dann ||         if self.wurzel is None:
    wurzel = neu KNOTEN(neu) ||             self.wurzel = Knoten(neu)
  sonst ||         else:
    wurzel.Einfügen(neu) ||             self.wurzel.Einfuegen(neu)
// KNOTEN ||     # class Knoten
methode Einfügen(neu) ||     def Einfuegen(self, neu):
  falls neu < daten dann ||         if neu < self.daten:
    falls linkerNachfolger = nichts dann ||             if self.linkerNachfolger is None:
      linkerNachfolger = neu KNOTEN(neu) ||                 self.linkerNachfolger = Knoten(neu)
    sonst linkerNachfolger.Einfügen(neu) ||             else: self.linkerNachfolger.Einfuegen(neu)
  sonst falls neu > daten dann ||         elif neu > self.daten:
    (genauso rechts) ||             ...
>> Bei Gleichheit trifft keiner der beiden Fälle zu: Es passiert nichts.
:::

## [python] Python-Blöcke

:::exercise id=t2-suchen title="Suchen mit einer Schleife" level=1
Der Baum mit `Einfuegen` ist gegeben. Schreib in `BinBaum`:

- `Suchen(s)`: sucht **mit einer Schleife** (wie im Struktogramm) und gibt den gefundenen Schlüssel zurück, sonst `None`.
- `VergleicheZaehlen(s)`: gibt zurück, wie viele Knoten bei der Suche nach `s` angesehen werden (gefunden oder nicht).
--- starter
class Knoten:
    def __init__(self, daten):
        self.daten = daten
        self.linkerNachfolger = None
        self.rechterNachfolger = None


class BinBaum:
    def __init__(self):
        self.wurzel = None

    def Einfuegen(self, neu):
        if self.wurzel is None:
            self.wurzel = Knoten(neu)
            return
        aktuell = self.wurzel
        while True:
            if neu == aktuell.daten:
                return
            if neu < aktuell.daten:
                if aktuell.linkerNachfolger is None:
                    aktuell.linkerNachfolger = Knoten(neu)
                    return
                aktuell = aktuell.linkerNachfolger
            else:
                if aktuell.rechterNachfolger is None:
                    aktuell.rechterNachfolger = Knoten(neu)
                    return
                aktuell = aktuell.rechterNachfolger

    def Suchen(self, s):
        pass

    def VergleicheZaehlen(self, s):
        pass


baum = BinBaum()
for x in [64, 57, 0, 30, 96, 85, 82, 69, 84, 95]:
    baum.Einfuegen(x)
print(baum.Suchen(84), baum.VergleicheZaehlen(84))
print(baum.Suchen(70), baum.VergleicheZaehlen(70))
--- solution
class Knoten:
    def __init__(self, daten):
        self.daten = daten
        self.linkerNachfolger = None
        self.rechterNachfolger = None


class BinBaum:
    def __init__(self):
        self.wurzel = None

    def Einfuegen(self, neu):
        if self.wurzel is None:
            self.wurzel = Knoten(neu)
            return
        aktuell = self.wurzel
        while True:
            if neu == aktuell.daten:
                return
            if neu < aktuell.daten:
                if aktuell.linkerNachfolger is None:
                    aktuell.linkerNachfolger = Knoten(neu)
                    return
                aktuell = aktuell.linkerNachfolger
            else:
                if aktuell.rechterNachfolger is None:
                    aktuell.rechterNachfolger = Knoten(neu)
                    return
                aktuell = aktuell.rechterNachfolger

    def Suchen(self, s):
        aktuell = self.wurzel
        while aktuell is not None:
            if s == aktuell.daten:
                return aktuell.daten
            if s < aktuell.daten:
                aktuell = aktuell.linkerNachfolger
            else:
                aktuell = aktuell.rechterNachfolger
        return None

    def VergleicheZaehlen(self, s):
        anzahl = 0
        aktuell = self.wurzel
        while aktuell is not None:
            anzahl = anzahl + 1
            if s == aktuell.daten:
                return anzahl
            if s < aktuell.daten:
                aktuell = aktuell.linkerNachfolger
            else:
                aktuell = aktuell.rechterNachfolger
        return anzahl


baum = BinBaum()
for x in [64, 57, 0, 30, 96, 85, 82, 69, 84, 95]:
    baum.Einfuegen(x)
print(baum.Suchen(84), baum.VergleicheZaehlen(84))
print(baum.Suchen(70), baum.VergleicheZaehlen(70))
--- tests
import ast

def beispiel():
    b = BinBaum()
    for x in [64, 57, 0, 30, 96, 85, 82, 69, 84, 95]:
        b.Einfuegen(x)
    return b

@test("Suchen findet vorhandene Schlüssel")
def _():
    b = beispiel()
    for x in [64, 57, 0, 30, 96, 85, 82, 69, 84, 95]:
        eq(b.Suchen(x), x, "Suchen(%d)" % x)

@test("Suchen nach fehlenden Schlüsseln")
def _():
    b = beispiel()
    for x in [70, 1, 100, 60, 83]:
        eq(b.Suchen(x), None, "Suchen(%d)" % x)
    eq(BinBaum().Suchen(5), None, "Suchen im leeren Baum")

@test("VergleicheZaehlen")
def _():
    b = beispiel()
    eq(b.VergleicheZaehlen(64), 1, "VergleicheZaehlen(64)")
    eq(b.VergleicheZaehlen(30), 4, "VergleicheZaehlen(30)")
    eq(b.VergleicheZaehlen(84), 5, "VergleicheZaehlen(84)")
    eq(b.VergleicheZaehlen(70), 5, "VergleicheZaehlen(70)")
    eq(b.VergleicheZaehlen(60), 2, "VergleicheZaehlen(60)")
    eq(BinBaum().VergleicheZaehlen(5), 0, "VergleicheZaehlen im leeren Baum")

@test("Mit Wörtern")
def _():
    b = BinBaum()
    for w in ["N202", "R273", "N304", "P114", "N111", "R212", "N264"]:
        b.Einfuegen(w)
    eq(b.Suchen("P114"), "P114", 'Suchen("P114")')
    eq(b.VergleicheZaehlen("R212"), 5, 'VergleicheZaehlen("R212")')
    eq(b.Suchen("P200"), None, 'Suchen("P200")')

@test("Mit einer Schleife, ohne Rekursion")
def _():
    for node in ast.parse(SOURCE).body:
        if isinstance(node, ast.ClassDef) and node.name == "BinBaum":
            for fn in node.body:
                if isinstance(fn, ast.FunctionDef) and fn.name == "Suchen":
                    ok(any(isinstance(n, ast.While) for n in ast.walk(fn)), "Suchen soll eine while-Schleife verwenden")
--- hint
Beginn mit `aktuell = self.wurzel`. Solange `aktuell is not None`: vergleichen und `aktuell` auf den linken oder rechten Nachfolger setzen.
--- hint
`VergleicheZaehlen` ist dieselbe Schleife mit einem Zähler, der bei jedem angesehenen Knoten um 1 steigt.
--- explain
Die Schleife ersetzt die Endrekursion: Statt „frag den Nachfolger“ heißt es „geh zum Nachfolger“. Die Anzahl der Durchläufe ist höchstens die Anzahl der Ebenen.
:::

:::exercise id=t2-einfuegen title="Einfügen und Suchen rekursiv" level=2
Schreib `Einfuegen` und `Suchen` **rekursiv** als Methoden von `Knoten` (mit Prüfungen auf `None`, wie im Pseudocode). `BinBaum` prüft nur, ob der Baum leer ist, und gibt sonst an die Wurzel weiter. Doppelte Schlüssel werden nicht eingefügt.
--- starter
class Knoten:
    def __init__(self, daten):
        self.daten = daten
        self.linkerNachfolger = None
        self.rechterNachfolger = None

    def Einfuegen(self, neu):
        pass

    def Suchen(self, s):
        pass


class BinBaum:
    def __init__(self):
        self.wurzel = None

    def Einfuegen(self, neu):
        pass

    def Suchen(self, s):
        pass


baum = BinBaum()
for x in [5781, 4221, 6345, 5799, 6300, 5888, 5788]:
    baum.Einfuegen(x)
print(baum.Suchen(5888), baum.Suchen(5800))
--- solution
class Knoten:
    def __init__(self, daten):
        self.daten = daten
        self.linkerNachfolger = None
        self.rechterNachfolger = None

    def Einfuegen(self, neu):
        if neu < self.daten:
            if self.linkerNachfolger is None:
                self.linkerNachfolger = Knoten(neu)
            else:
                self.linkerNachfolger.Einfuegen(neu)
        elif neu > self.daten:
            if self.rechterNachfolger is None:
                self.rechterNachfolger = Knoten(neu)
            else:
                self.rechterNachfolger.Einfuegen(neu)

    def Suchen(self, s):
        if s == self.daten:
            return self.daten
        if s < self.daten:
            if self.linkerNachfolger is not None:
                return self.linkerNachfolger.Suchen(s)
            return None
        if self.rechterNachfolger is not None:
            return self.rechterNachfolger.Suchen(s)
        return None


class BinBaum:
    def __init__(self):
        self.wurzel = None

    def Einfuegen(self, neu):
        if self.wurzel is None:
            self.wurzel = Knoten(neu)
        else:
            self.wurzel.Einfuegen(neu)

    def Suchen(self, s):
        if self.wurzel is None:
            return None
        return self.wurzel.Suchen(s)


baum = BinBaum()
for x in [5781, 4221, 6345, 5799, 6300, 5888, 5788]:
    baum.Einfuegen(x)
print(baum.Suchen(5888), baum.Suchen(5800))
--- tests
def form(k):
    if k is None:
        return "-"
    if k.linkerNachfolger is None and k.rechterNachfolger is None:
        return str(k.daten)
    return "%s(%s,%s)" % (k.daten, form(k.linkerNachfolger), form(k.rechterNachfolger))

def baue(werte):
    b = BinBaum()
    for x in werte:
        b.Einfuegen(x)
    return b

@test("Aufgabe 1 b")
def _():
    b = baue([5781, 4221, 6345, 5799, 6300, 5888, 5788])
    eq(form(b.wurzel), "5781(4221,6345(5799(5788,6300(5888,-)),-))", "Form des Baums")

@test("Beispielbaum und Netzwerkgeräte")
def _():
    eq(form(baue([64, 57, 0, 30, 96, 85, 82, 69, 84, 95]).wurzel), "64(57(0(-,30),-),96(85(82(69,84),95),-))", "Beispielbaum")
    eq(form(baue(["N202", "R273", "N304", "P114", "N111", "R212", "N264"]).wurzel), "N202(N111,R273(N304(N264,P114(-,R212)),-))", "Netzwerkgeräte")

@test("Leerer Baum und doppelte Schlüssel")
def _():
    b = BinBaum()
    eq(b.Suchen(3), None, "Suchen im leeren Baum")
    b.Einfuegen(3)
    eq(form(b.wurzel), "3", "nach dem ersten Einfügen")
    b.Einfuegen(3)
    b.Einfuegen(1)
    b.Einfuegen(1)
    eq(form(b.wurzel), "3(1,-)", "doppelte Schlüssel dürfen nicht eingefügt werden")

@test("Suchen")
def _():
    b = baue([64, 57, 0, 30, 96, 85, 82, 69, 84, 95])
    for x in [64, 30, 84, 95]:
        eq(b.Suchen(x), x, "Suchen(%d)" % x)
    for x in [70, 1, 99, 58]:
        eq(b.Suchen(x), None, "Suchen(%d)" % x)

@test("Rekursiv")
def _():
    b = baue([64, 57, 96, 85])
    r, rec = recursive(b.wurzel.Einfuegen, 90)
    ok(rec, "Knoten.Einfuegen soll sich (beim Nachfolger) selbst aufrufen")
    r, rec = recursive(b.wurzel.Suchen, 90)
    ok(rec, "Knoten.Suchen soll sich (beim Nachfolger) selbst aufrufen")
--- hint
`Knoten.Einfuegen`: Drei Fälle: `neu < self.daten`, `neu > self.daten`, sonst (gleich) nichts tun. In den ersten beiden: Ist dort kein Nachfolger, wird ein neuer `Knoten(neu)` angehängt, sonst `...Einfuegen(neu)` beim Nachfolger.
--- hint
`Knoten.Suchen` braucht in jedem Zweig ein `return`, auch beim rekursiven Aufruf: `return self.linkerNachfolger.Suchen(s)`.
--- explain
Beide Methoden sind dieselbe Wegsuche; sie unterscheiden sich nur darin, was am Ende des Wegs passiert: Einfügen hängt einen Knoten an, Suchen gibt `None` zurück. Die vielen `is None`-Prüfungen sind genau das, was in D3 das Kompositum beseitigt.
:::

:::exercise id=t2-durchlauf title="Inorder, Preorder, Postorder" level=2
Ergänze `Knoten` um drei rekursive Methoden, die die Schlüssel in die übergebene Python-Liste `ergebnis` schreiben (`ergebnis.append(...)`): `InorderSammeln(ergebnis)`, `PreorderSammeln(ergebnis)`, `PostorderSammeln(ergebnis)`. Die Methoden in `BinBaum` sind gegeben.
--- starter
class Knoten:
    def __init__(self, daten):
        self.daten = daten
        self.linkerNachfolger = None
        self.rechterNachfolger = None

    def Einfuegen(self, neu):
        if neu < self.daten:
            if self.linkerNachfolger is None:
                self.linkerNachfolger = Knoten(neu)
            else:
                self.linkerNachfolger.Einfuegen(neu)
        elif neu > self.daten:
            if self.rechterNachfolger is None:
                self.rechterNachfolger = Knoten(neu)
            else:
                self.rechterNachfolger.Einfuegen(neu)

    def InorderSammeln(self, ergebnis):
        pass

    def PreorderSammeln(self, ergebnis):
        pass

    def PostorderSammeln(self, ergebnis):
        pass


class BinBaum:
    def __init__(self):
        self.wurzel = None

    def Einfuegen(self, neu):
        if self.wurzel is None:
            self.wurzel = Knoten(neu)
        else:
            self.wurzel.Einfuegen(neu)

    def Inorder(self):
        ergebnis = []
        if self.wurzel is not None:
            self.wurzel.InorderSammeln(ergebnis)
        return ergebnis

    def Preorder(self):
        ergebnis = []
        if self.wurzel is not None:
            self.wurzel.PreorderSammeln(ergebnis)
        return ergebnis

    def Postorder(self):
        ergebnis = []
        if self.wurzel is not None:
            self.wurzel.PostorderSammeln(ergebnis)
        return ergebnis


baum = BinBaum()
for x in [64, 57, 0, 30, 96, 85, 82, 69, 84, 95]:
    baum.Einfuegen(x)
print(baum.Inorder())
--- solution
class Knoten:
    def __init__(self, daten):
        self.daten = daten
        self.linkerNachfolger = None
        self.rechterNachfolger = None

    def Einfuegen(self, neu):
        if neu < self.daten:
            if self.linkerNachfolger is None:
                self.linkerNachfolger = Knoten(neu)
            else:
                self.linkerNachfolger.Einfuegen(neu)
        elif neu > self.daten:
            if self.rechterNachfolger is None:
                self.rechterNachfolger = Knoten(neu)
            else:
                self.rechterNachfolger.Einfuegen(neu)

    def InorderSammeln(self, ergebnis):
        if self.linkerNachfolger is not None:
            self.linkerNachfolger.InorderSammeln(ergebnis)
        ergebnis.append(self.daten)
        if self.rechterNachfolger is not None:
            self.rechterNachfolger.InorderSammeln(ergebnis)

    def PreorderSammeln(self, ergebnis):
        ergebnis.append(self.daten)
        if self.linkerNachfolger is not None:
            self.linkerNachfolger.PreorderSammeln(ergebnis)
        if self.rechterNachfolger is not None:
            self.rechterNachfolger.PreorderSammeln(ergebnis)

    def PostorderSammeln(self, ergebnis):
        if self.linkerNachfolger is not None:
            self.linkerNachfolger.PostorderSammeln(ergebnis)
        if self.rechterNachfolger is not None:
            self.rechterNachfolger.PostorderSammeln(ergebnis)
        ergebnis.append(self.daten)


class BinBaum:
    def __init__(self):
        self.wurzel = None

    def Einfuegen(self, neu):
        if self.wurzel is None:
            self.wurzel = Knoten(neu)
        else:
            self.wurzel.Einfuegen(neu)

    def Inorder(self):
        ergebnis = []
        if self.wurzel is not None:
            self.wurzel.InorderSammeln(ergebnis)
        return ergebnis

    def Preorder(self):
        ergebnis = []
        if self.wurzel is not None:
            self.wurzel.PreorderSammeln(ergebnis)
        return ergebnis

    def Postorder(self):
        ergebnis = []
        if self.wurzel is not None:
            self.wurzel.PostorderSammeln(ergebnis)
        return ergebnis


baum = BinBaum()
for x in [64, 57, 0, 30, 96, 85, 82, 69, 84, 95]:
    baum.Einfuegen(x)
print(baum.Inorder())
--- tests
def baue(werte):
    b = BinBaum()
    for x in werte:
        b.Einfuegen(x)
    return b

@test("Beispielbaum")
def _():
    b = baue([64, 57, 0, 30, 96, 85, 82, 69, 84, 95])
    eq(b.Inorder(), [0, 30, 57, 64, 69, 82, 84, 85, 95, 96], "Inorder")
    eq(b.Preorder(), [64, 57, 0, 30, 96, 85, 82, 69, 84, 95], "Preorder")
    eq(b.Postorder(), [30, 0, 57, 69, 84, 82, 95, 85, 96, 64], "Postorder")

@test("Wörter und Sonderfälle")
def _():
    b = baue(["clip", "cat", "cup", "cut", "cube", "cave", "crab"])
    eq(b.Inorder(), ["cat", "cave", "clip", "crab", "cube", "cup", "cut"], "Inorder der Wörter")
    eq(BinBaum().Inorder(), [], "Inorder des leeren Baums")
    eq(baue([7]).Postorder(), [7], "Postorder eines einzelnen Knotens")

@test("Preorder baut denselben Baum wieder auf")
def _():
    b = baue([50, 30, 70, 20, 40, 60, 80, 35])
    eq(baue(b.Preorder()).Preorder(), b.Preorder(), "Preorder nach dem Wiederaufbau")
--- hint
Inorder: erst den linken Nachfolger (falls vorhanden) sammeln lassen, dann `ergebnis.append(self.daten)`, dann den rechten.
--- hint
Preorder und Postorder unterscheiden sich nur darin, wo das `append` steht: ganz vorne oder ganz hinten.
--- explain
Alle Knoten schreiben in **dieselbe** Liste, weil sie als Parameter weitergereicht wird. Die Position von `append` relativ zu den beiden rekursiven Aufrufen ist der einzige Unterschied zwischen den drei Durchläufen.
:::

:::exercise id=t2-pfad title="Den Suchweg angeben" level=1
In Klausuren wird oft gefragt, welche Knoten bei einer Suche besucht werden. Schreib `BinBaum.PfadGeben(s)`: Sie gibt die Liste der Schlüssel zurück, die bei der Suche nach `s` verglichen werden, in dieser Reihenfolge (auch wenn `s` nicht gefunden wird).
--- starter
class Knoten:
    def __init__(self, daten):
        self.daten = daten
        self.linkerNachfolger = None
        self.rechterNachfolger = None


class BinBaum:
    def __init__(self):
        self.wurzel = None

    def Einfuegen(self, neu):
        if self.wurzel is None:
            self.wurzel = Knoten(neu)
            return
        aktuell = self.wurzel
        while neu != aktuell.daten:
            if neu < aktuell.daten:
                if aktuell.linkerNachfolger is None:
                    aktuell.linkerNachfolger = Knoten(neu)
                aktuell = aktuell.linkerNachfolger
            else:
                if aktuell.rechterNachfolger is None:
                    aktuell.rechterNachfolger = Knoten(neu)
                aktuell = aktuell.rechterNachfolger

    def PfadGeben(self, s):
        pass


baum = BinBaum()
for g in ["N202", "R273", "N304", "P114", "N111", "R212", "N264"]:
    baum.Einfuegen(g)
print(baum.PfadGeben("R212"))
--- solution
class Knoten:
    def __init__(self, daten):
        self.daten = daten
        self.linkerNachfolger = None
        self.rechterNachfolger = None


class BinBaum:
    def __init__(self):
        self.wurzel = None

    def Einfuegen(self, neu):
        if self.wurzel is None:
            self.wurzel = Knoten(neu)
            return
        aktuell = self.wurzel
        while neu != aktuell.daten:
            if neu < aktuell.daten:
                if aktuell.linkerNachfolger is None:
                    aktuell.linkerNachfolger = Knoten(neu)
                aktuell = aktuell.linkerNachfolger
            else:
                if aktuell.rechterNachfolger is None:
                    aktuell.rechterNachfolger = Knoten(neu)
                aktuell = aktuell.rechterNachfolger

    def PfadGeben(self, s):
        pfad = []
        aktuell = self.wurzel
        while aktuell is not None:
            pfad.append(aktuell.daten)
            if s == aktuell.daten:
                break
            if s < aktuell.daten:
                aktuell = aktuell.linkerNachfolger
            else:
                aktuell = aktuell.rechterNachfolger
        return pfad


baum = BinBaum()
for g in ["N202", "R273", "N304", "P114", "N111", "R212", "N264"]:
    baum.Einfuegen(g)
print(baum.PfadGeben("R212"))
--- tests
def baue(werte):
    b = BinBaum()
    for x in werte:
        b.Einfuegen(x)
    return b

@test("Netzwerkgeräte")
def _():
    b = baue(["N202", "R273", "N304", "P114", "N111", "R212", "N264"])
    eq(b.PfadGeben("R212"), ["N202", "R273", "N304", "P114", "R212"], 'PfadGeben("R212")')
    eq(b.PfadGeben("N202"), ["N202"], 'PfadGeben("N202")')
    eq(b.PfadGeben("N100"), ["N202", "N111"], 'PfadGeben("N100") (nicht vorhanden)')

@test("Beispielbaum")
def _():
    b = baue([64, 57, 0, 30, 96, 85, 82, 69, 84, 95])
    eq(b.PfadGeben(70), [64, 96, 85, 82, 69], "PfadGeben(70)")
    eq(b.PfadGeben(30), [64, 57, 0, 30], "PfadGeben(30)")
    eq(BinBaum().PfadGeben(5), [], "PfadGeben im leeren Baum")
--- hint
Dieselbe Schleife wie beim Suchen; vor jedem Vergleich kommt `aktuell.daten` in die Liste. Bei Gleichheit: Schleife verlassen (`break`).
--- explain
Der Pfad ist genau die Liste der Vergleiche. Seine Länge ist die Anzahl der Vergleiche aus `VergleicheZaehlen`.
:::

:::exercise id=t2-mitglied title="Zufällige Mitgliedsnummern (Abitur 2018, 5 b)" level=2
Schreib `NeueMitgliedsnummer(baum, zufall)`. `zufall` ist eine Funktion, die bei jedem Aufruf `zufall()` eine neue Zufallszahl liefert. Ziehe so lange Zahlen, bis eine **nicht** im Baum vorkommt, füge sie ein und gib sie zurück. Der Baum (mit `Suchen` und `Einfuegen`) ist gegeben.
--- starter
import random


class Knoten:
    def __init__(self, daten):
        self.daten = daten
        self.linkerNachfolger = None
        self.rechterNachfolger = None


class BinBaum:
    def __init__(self):
        self.wurzel = None

    def Einfuegen(self, neu):
        if self.wurzel is None:
            self.wurzel = Knoten(neu)
            return
        aktuell = self.wurzel
        while neu != aktuell.daten:
            if neu < aktuell.daten:
                if aktuell.linkerNachfolger is None:
                    aktuell.linkerNachfolger = Knoten(neu)
                aktuell = aktuell.linkerNachfolger
            else:
                if aktuell.rechterNachfolger is None:
                    aktuell.rechterNachfolger = Knoten(neu)
                aktuell = aktuell.rechterNachfolger

    def Suchen(self, s):
        aktuell = self.wurzel
        while aktuell is not None:
            if s == aktuell.daten:
                return aktuell.daten
            aktuell = aktuell.linkerNachfolger if s < aktuell.daten else aktuell.rechterNachfolger
        return None


def NeueMitgliedsnummer(baum, zufall):
    pass


baum = BinBaum()
for nr in [3257, 66013, 116, 5485, 2485, 833271, 73680]:
    baum.Einfuegen(nr)
print(NeueMitgliedsnummer(baum, lambda: random.randint(1, 999999)))
--- solution
import random


class Knoten:
    def __init__(self, daten):
        self.daten = daten
        self.linkerNachfolger = None
        self.rechterNachfolger = None


class BinBaum:
    def __init__(self):
        self.wurzel = None

    def Einfuegen(self, neu):
        if self.wurzel is None:
            self.wurzel = Knoten(neu)
            return
        aktuell = self.wurzel
        while neu != aktuell.daten:
            if neu < aktuell.daten:
                if aktuell.linkerNachfolger is None:
                    aktuell.linkerNachfolger = Knoten(neu)
                aktuell = aktuell.linkerNachfolger
            else:
                if aktuell.rechterNachfolger is None:
                    aktuell.rechterNachfolger = Knoten(neu)
                aktuell = aktuell.rechterNachfolger

    def Suchen(self, s):
        aktuell = self.wurzel
        while aktuell is not None:
            if s == aktuell.daten:
                return aktuell.daten
            aktuell = aktuell.linkerNachfolger if s < aktuell.daten else aktuell.rechterNachfolger
        return None


def NeueMitgliedsnummer(baum, zufall):
    z = zufall()
    while baum.Suchen(z) is not None:
        z = zufall()
    baum.Einfuegen(z)
    return z


baum = BinBaum()
for nr in [3257, 66013, 116, 5485, 2485, 833271, 73680]:
    baum.Einfuegen(nr)
print(NeueMitgliedsnummer(baum, lambda: random.randint(1, 999999)))
--- tests
def folge(*zahlen):
    it = iter(zahlen)
    return lambda: next(it)

def baum18():
    b = BinBaum()
    for nr in [3257, 66013, 116, 5485, 2485, 833271, 73680]:
        b.Einfuegen(nr)
    return b

@test("Freie Zahl beim ersten Versuch")
def _():
    b = baum18()
    eq(NeueMitgliedsnummer(b, folge(500)), 500, "Zufallszahlen 500")
    eq(b.Suchen(500), 500, "500 muss danach im Baum stehen")

@test("Vergebene Zahlen werden übersprungen")
def _():
    b = baum18()
    eq(NeueMitgliedsnummer(b, folge(3257, 116, 73680, 42)), 42, "Zufallszahlen 3257, 116, 73680, 42")
    eq(NeueMitgliedsnummer(b, folge(42, 42, 43)), 43, "danach: 42 ist jetzt vergeben")

@test("Leerer Baum")
def _():
    b = BinBaum()
    eq(NeueMitgliedsnummer(b, folge(7)), 7, "im leeren Baum")
--- hint
Erst eine Zahl ziehen, dann `while baum.Suchen(z) is not None:` eine neue ziehen. Nach der Schleife ist `z` frei.
--- explain
Das ist die Schleife „wiederhole … solange vergeben“. Jede Prüfung ist eine schnelle Suche im Baum; bei zufälligen Nummern bleibt der Baum im Mittel ausgeglichen.
:::

## [exam] Klausurtraining

::::exam title="Einfügen und Suchen im Beispielbaum" points=5
Füge in den Beispielbaum `64(57(0(,30),),96(85(82(69,84),95),))` nacheinander 60, 99, 83 und 1 ein. Zeichne den Baum. Wie viele Vergleiche braucht danach die Suche nach 83 und nach 61?
--- solution
:::diagram bintree
64(57(0(,30(1{green},)),60{green}),96(85(82(69,84(83{green},)),95),99{green}))
:::
60: < 64, > 57: rechter Nachfolger von 57. 99: > 64, > 96: rechts von 96. 83: > 64, < 96, < 85, > 82, < 84: links von 84. 1: < 64, < 57, **> 0** (also rechts, zu 30), < 30: **linker Nachfolger von 30**, nicht von 0.

Suche nach 83: 64, 96, 85, 82, 84, 83: **6** Vergleiche. Suche nach 61: 64 (links), 57 (rechts), 60 (rechts), leer: **3** Vergleiche, nicht gefunden.
::::

:::exam title="Einfügereihenfolgen" points=3
Gib alle Reihenfolgen an, in denen 40, 20, 60, 50 eingefügt worden sein können, damit der Baum `40(20,60(50,))` entsteht. Begründe kurz.
--- solution
40 muss zuerst kommen (Wurzel), 50 erst nach 60 (60 ist sein Vorgänger), 20 irgendwann nach 40. Möglich: **40, 20, 60, 50**; **40, 60, 20, 50**; **40, 60, 50, 20**.
:::

::::exam title="Struktogramm" points=4
Gib ein Struktogramm für die Methode `Suchen(s)` der Klasse BINBAUM an, die mit einer Wiederholung (ohne Rekursion) arbeitet und das gefundene Datenelement oder nichts zurückgibt.
--- solution
:::diagram struktogramm
title Suchen(s)
S: aktuell = wurzel
W: solange aktuell ≠ nichts
  F: s = aktuell.daten
    T:
      S: return aktuell.daten
    E:
      F: s < aktuell.daten
        T:
          S: aktuell = aktuell.linkerNachfolger
        E:
          S: aktuell = aktuell.rechterNachfolger
S: return nichts
:::
Wichtig: Die Schleife endet, wenn `aktuell` nichts ist (nicht gefunden); `aktuell` rückt in jedem Durchlauf eine Ebene tiefer.
::::

:::exam title="Rekursion beim Suchen" points=3
Erkläre, wo beim Suchen im geordneten Binärbaum Rekursion verwendet wird, und nenne die Abbruchbedingungen.
--- solution
Jeder Teilbaum eines geordneten Binärbaums ist wieder ein geordneter Binärbaum. Nach dem Vergleich mit dem aktuellen Knoten wird dieselbe Suche im linken oder rechten Teilbaum fortgesetzt; der Knoten ruft `Suchen` bei seinem Nachfolger auf (Rekursionsschritt). Abbruch: Der Schlüssel des Knotens stimmt mit dem gesuchten überein (gefunden), oder in der gewünschten Richtung gibt es keinen Nachfolger (nicht gefunden).
:::

:::exam title="Durchläufe" points=3
Gib für den Baum `N202(N111,R273(N304(N264,P114(,R212)),))` die Inorder-, Preorder- und Postorder-Ausgabe an.
--- solution
- Inorder: N111, N202, N264, N304, P114, R212, R273 (sortiert)
- Preorder: N202, N111, R273, N304, N264, P114, R212
- Postorder: N111, N264, R212, P114, N304, R273, N202
:::

:::exam title="Sortiert einfügen" points=3
Ein Programm fügt 10 000 Kundennummern in aufsteigender Reihenfolge in einen leeren geordneten Binärbaum ein. Beschreibe den entstehenden Baum, gib die Anzahl der Ebenen an und vergleiche mit einem optimal aufgebauten Baum.
--- solution
Jede neue Nummer ist größer als alle vorhandenen und wird rechter Nachfolger des bisher größten Knotens: Der Baum **entartet** zu einer Liste mit **10 000 Ebenen**; eine Suche braucht bis zu 10 000 Vergleiche. Optimal aufgebaut reichen **14 Ebenen** (2¹³ − 1 = 8191 < 10 000 ≤ 16 383 = 2¹⁴ − 1), also höchstens 14 Vergleiche.
:::
