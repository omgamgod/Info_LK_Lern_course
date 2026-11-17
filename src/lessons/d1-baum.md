---
id: d1
num: D1
part: D
title: Die Datenstruktur Baum
short: Datenstruktur Baum
lead: In einer Liste muss man im schlimmsten Fall jedes Element ansehen, um eines zu finden. Ein Baum verzweigt sich dagegen bei jedem Schritt, und ein geordneter Binärbaum schließt mit jedem Vergleich die Hälfte der übrigen Elemente aus. Diese Lektion führt die Fachbegriffe ein, die in jeder Baumaufgabe vorkommen, und zeigt, warum Bäume so schnell sind.
minutes: 100
uses: [b1, b3, c4]
goals:
  - die Fachbegriffe Wurzel, Knoten, Kante, Blatt, innerer Knoten, Teilbaum, Pfad, Tiefe, Ebene und Höhe sicher verwenden
  - einen Baum als besonderen Graphen beschreiben (zusammenhängend, kreisfrei, k Knoten und k − 1 Kanten)
  - entscheiden, ob ein Binärbaum geordnet ist, auch bei Wörtern (lexikographische Ordnung)
  - eine sortierte Liste zu einem ausgeglichenen Binärbaum umstrukturieren
  - entartete, vollständige und balancierte Binärbäume unterscheiden
  - Kapazität und Suchaufwand eines Binärbaums berechnen (2ⁿ − 1, Anzahl der Ebenen)
---

## [logic] Ein Ratespiel (12_III_1_Einstieg)

Aylin denkt sich eine Zahl zwischen 1 und 100 aus. Theo hat höchstens **sieben Versuche**; nach jedem Fehlversuch sagt Aylin, ob seine Zahl zu groß oder zu klein war.

**a) Theos Strategie:** Er beginnt immer mit seinem Alter, 17, und geht dann in 5er-Schritten nach oben oder unten. Bei welchen der Zahlen 5, 42, 50 und 90 hat er Erfolg?

Theo rät nur Zahlen der Form 17 ± 5 · k, also 2, 7, 12, 17, 22, 27 … Zahlen wie **5, 50 und 90 trifft er nie**: Bei 5 springt er zwischen 7 (zu groß) und 2 (zu klein) hin und her. Bei 90 bräuchte er von 17 aus ohnehin mehr als sieben Schritte. **Nur 42 findet er**, mit 17, 22, 27, 32, 37, 42 im sechsten Versuch.

**b) Eine bessere Strategie:** Immer die **Mitte** der noch möglichen Zahlen raten. Der erste Tipp ist 50. Ist er zu groß, bleiben 1 bis 49, der nächste Tipp ist 25. Ist er zu klein, bleiben 51 bis 100, der nächste Tipp ist 75. Jeder Tipp **halbiert** die Menge der Kandidaten.

**c) Reichen sieben Versuche immer?** Nach einem Versuch bleiben höchstens 50 Zahlen, nach zwei höchstens 25, dann 12, 6, 3, 1. Allgemein: Mit *k* Versuchen kann man zwischen höchstens 2<sup>k</sup> − 1 Zahlen unterscheiden. 2<sup>7</sup> − 1 = **127 ≥ 100**, also reichen sieben Versuche für jede Zahl; sechs (2<sup>6</sup> − 1 = 63) reichen nicht immer.

:::viz guess
{"strategy": "theo", "secret": 42}
:::

Zeichnet man alle möglichen Tipps der Halbierungsstrategie auf, entsteht ein **Baum**: Oben steht der erste Tipp, darunter für jede Antwort der nächste.

:::diagram bintree caption="Die ersten drei Ebenen der Halbierungsstrategie (links: zu groß, rechts: zu klein)"
labels: zu groß | zu klein
50(25(12,37),75(62,88))
:::

Ein Spiel ist ein **Pfad** von oben nach unten; die Anzahl der Versuche ist die Anzahl der Ebenen, die man durchläuft. Sieben Ebenen haben Platz für 127 Zahlen. Genau diese Idee macht den **geordneten Binärbaum** zu einer schnellen Datenstruktur zum Suchen.

## [logic] Bäume im Alltag

Bäume begegnen dir überall, wo etwas **hierarchisch** gegliedert ist: Jedes Teil gehört zu genau einem übergeordneten Teil.

:::cols cards
**Dateisystem**: Ordner enthalten Dateien und Unterordner (das Kompositum-Beispiel aus C4).
--- col
**Stammbaum** der Nachfahren einer Person, **Organigramm** einer Firma, **Gliederung** eines Buchs (Kapitel, Abschnitte, Unterabschnitte).
--- col
**Turnierbaum** (K.-o.-System), **Entscheidungsbaum** wie beim Rucksackproblem (B2), **Aufrufbaum** einer Rekursion (B1).
:::

:::diagram bintree caption="Ein Dateisystem als Baum: Die Wurzel steht in der Informatik oben"
nary: ja
"C:"(Users(petrn(Dokumente(Schule, Fotos), PycharmProjects)), Programme(Python))
:::

Informatikerinnen zeichnen Bäume **verkehrt herum**: die Wurzel oben, die Blätter unten.

## [logic] Die Fachbegriffe

:::diagram bintree caption="Ein Baum mit 10 Knoten und 9 Kanten"
ebenen: ja
nary: ja
A{blue}(B(E, F(K)), C, D(G, H, I))
:::

| Begriff | Bedeutung | im Bild |
|---|---|---|
| **Knoten** | ein Element des Baums | A, B, …, K |
| **Kante** | Verbindung von einem Knoten zu einem seiner Nachfolger | 9 Pfeile |
| **Wurzel** | der einzige Knoten ohne Vorgänger | A |
| **Vorgänger** (Elternknoten) | der direkt übergeordnete Knoten | B ist Vorgänger von E und F |
| **Nachfolger** (Kindknoten) | die direkt untergeordneten Knoten | G, H, I sind Nachfolger von D |
| **Blatt** | Knoten ohne Nachfolger | E, K, C, G, H, I |
| **innerer Knoten** | Knoten mit mindestens einem Nachfolger | A, B, D, F |
| **Teilbaum** | ein Knoten mit allen Knoten unter ihm | B mit E, F, K |
| **Pfad** | Folge von Knoten entlang der Kanten | A → B → F → K |
| **Tiefe** eines Knotens | Anzahl der Kanten von der Wurzel bis zu ihm | Tiefe(A) = 0, Tiefe(F) = 2, Tiefe(K) = 3 |
| **Ebene** *i* | alle Knoten der Tiefe *i* | Ebene 1: B, C, D |
| **Höhe** des Baums | die größte Tiefe, die ein Knoten erreicht | 3 (Knoten K) |
| **Grad** eines Knotens | Anzahl seiner Nachfolger | Grad(D) = 3, Grad(F) = 1 |

:::warn title="Höhe und Anzahl der Ebenen"
Die **Höhe** zählt **Kanten**, die Anzahl der **Ebenen** zählt **Knotenschichten**. Ein Baum der Höhe 3 hat 4 Ebenen (0, 1, 2, 3); ein Baum aus nur einer Wurzel hat Höhe 0 und eine Ebene. Abituraufgaben sprechen meist von **Ebenen**. Lies genau, wonach gefragt ist, und schreib dazu, wie du zählst.
:::

### Ein Baum ist ein besonderer Graph

Ein Baum ist ein **Graph** (B3) mit besonderen Eigenschaften:

- Er ist **zusammenhängend**: Von der Wurzel aus ist jeder Knoten erreichbar.
- Er ist **kreisfrei**: Es gibt keinen Weg, der zu seinem Anfang zurückführt. Zwischen zwei Knoten gibt es deshalb **genau einen** Weg.
- Jeder Knoten außer der Wurzel hat **genau einen** Vorgänger, also genau eine Kante, die zu ihm führt. Deshalb hat ein Baum mit *k* Knoten genau ***k* − 1 Kanten**.

Eine Tiefensuche auf einem Baum braucht deshalb keine Liste der besuchten Knoten: Man kann keinen Knoten zweimal erreichen.

### Bäume sind rekursiv

Jeder Teilbaum ist selbst wieder ein Baum. Daraus folgt eine **rekursive Definition**: *Ein Baum ist entweder leer, oder er besteht aus einer Wurzel und mehreren Teilbäumen, die selbst Bäume sind.* Fast jede Frage an einen Baum lässt sich deshalb rekursiv beantworten, wie in B1:

```pseudo
methode GANZZAHL AnzahlKnoten(baum)
  falls baum ist leer dann
    return 0
  sonst
    summe = 1
    für jeden Teilbaum t von baum
      summe = summe + AnzahlKnoten(t)
    endefür
    return summe
  endefalls
endemethode
```

Rekursionsende ist der leere Baum, Rekursionsschritt der Blick in die Teilbäume. Dieses Muster wirst du in D2 und D3 bei jeder Baummethode wiedersehen.

## [logic] Binärbaum und geordneter Binärbaum

Ein **Binärbaum** ist ein Baum, in dem jeder Knoten **höchstens zwei** Nachfolger hat; man unterscheidet den **linken** und den **rechten** Nachfolger (und damit den linken und rechten Teilbaum). Auch wenn ein Knoten nur einen Nachfolger hat, ist festgelegt, ob er links oder rechts hängt.

Ein **geordneter Binärbaum** (auch *binärer Suchbaum*) erfüllt für **jeden** Knoten mit Schlüssel *s*:

- alle Schlüssel im **linken** Teilbaum sind **kleiner** als *s*,
- alle Schlüssel im **rechten** Teilbaum sind **größer** als *s*.

:::diagram bintree caption="Der Beispielbaum deiner Lehrkraft (12_III_2_Beispielbaum) ist geordnet"
64(57(0(,30),),96(85(82(69,84),95),))
:::

Prüf es an einem Knoten: Im linken Teilbaum von 85 liegen 82, 69, 84, alle kleiner als 85; im rechten 95. Und alle diese Werte sind größer als 64, denn sie liegen im **rechten** Teilbaum der Wurzel.

:::warn title="Es zählt der ganze Teilbaum, nicht nur das Kind"
Ein typischer Fehler: nur die direkten Nachfolger prüfen. Im Baum unten ist jeder Knoten für sich in Ordnung (12 > 5, also rechts von 5), aber 12 liegt im **linken** Teilbaum von 10 und ist größer als 10. Der Baum ist **nicht** geordnet.
:::

:::diagram bintree caption="Nicht geordnet: 12 steht im linken Teilbaum von 10"
10(5(,12{x}),20)
:::

### Wörter vergleichen: lexikographische Ordnung

Bei Wörtern gilt die **lexikographische** Ordnung, die Reihenfolge im Wörterbuch: Man vergleicht **Zeichen für Zeichen**, das erste unterschiedliche Zeichen entscheidet.

- `car` und `cake`: c = c, a = a, dann r gegen k. Weil k vor r kommt, ist **cake < car**.
- `hero` und `heron`: Ist ein Wort der Anfang des anderen, ist das **kürzere kleiner**: hero < heron.
- Python vergleicht Zeichenketten genau so: `"cake" < "car"` ergibt `True`. Achtung: Großbuchstaben kommen dort **vor** allen Kleinbuchstaben (`"Zebra" < "apfel"`), und Umlaute stehen **hinter** z.
- Auch Schlüssel wie `N202`, `P114`, `R273` werden so verglichen: Erst entscheidet der Buchstabe, dann die Ziffern. Vorsicht bei Zahlen als Text: `"10" < "9"`, weil das Zeichen 1 vor 9 kommt.

### Besondere Binärbäume oder nicht? (12_III_1_Aufgabe_3 a)

::::cols
:::diagram bintree caption="Baum 1"
21(7(3,20),22(23{x},24))
:::
--- col
:::diagram bintree caption="Baum 2"
43(56(67(,59),),34(36,11))
:::
::::

:::diagram bintree caption="Baum 3 (englisch | deutsch)"
"cake|Kuchen"("car|Auto"("call|Anruf","care|Fürsorge"),"coin|Münze"("cuff|Manschette","code|Vorwahl"))
:::

- **Baum 1 ist nicht geordnet**: 23 hängt links an 22, ist aber größer.
- **Baum 2 ist nach der üblichen Festlegung nicht geordnet** (56 links von 43 ist größer). Er ist aber **konsequent umgekehrt** geordnet: links stehen immer die größeren, rechts die kleineren Schlüssel (59 im linken Teilbaum von 43 und 56 ist größer als beide). Mit der Festlegung „größer links“ wäre er geordnet; eine Ausgabe von links nach rechts liefert die Zahlen absteigend.
- **Baum 3 ist nach den englischen Wörtern nicht geordnet** (car > cake, steht aber links). Nach den **deutschen** Wörtern ist er geordnet: Anruf < Auto < Fürsorge < Kuchen < Manschette < Münze < Vorwahl. Als englisch-deutsches Wörterbuch, in dem man nach dem englischen Wort sucht, ist er also unbrauchbar.

:::quiz
Welcher Schlüssel darf im Beispielbaum (Wurzel 64) **nicht** im linken Teilbaum von 85 stehen?
- [ ] 70
- [ ] 84
- [x] 60
- [ ] 65
--- explain
Der linke Teilbaum von 85 liegt im rechten Teilbaum von 64. Seine Schlüssel müssen also größer als 64 **und** kleiner als 85 sein. 60 ist kleiner als 64 und gehört in den linken Teilbaum der Wurzel.
:::

## [logic] Eine Liste umstrukturieren (12_III_1_Aufgabe_2)

In einer sortierten Liste sucht man von vorne nach hinten. Baut man aus ihr einen Baum, indem man das **mittlere** Element zur Wurzel macht, die kleinere Hälfte zum linken und die größere zum rechten Teilbaum, und das **rekursiv** in jeder Hälfte wiederholt, entsteht ein geordneter Binärbaum mit möglichst wenigen Ebenen.

```pseudo
methode Aufbauen(sortierte Liste L)
  falls L ist leer dann
    return leerer Baum
  endefalls
  m = mittleres Element von L
  Wurzel = m
  linker Teilbaum = Aufbauen(Elemente vor m)
  rechter Teilbaum = Aufbauen(Elemente nach m)
endemethode
```

**a)** Für habit, hag, hall, heap, heart, heat, **hero**, hike, hint, hole, hope, hub, hull (13 Wörter) ist hero das mittlere Element. Links bleiben sechs, rechts sechs Wörter.

**b) Was ist schwieriger?** Bei einer **geraden** Anzahl gibt es kein mittleres Element, sondern zwei. Man muss sich für eines entscheiden und diese Regel dann **in jedem Teilschritt gleich** anwenden. Hier wird immer das rechte der beiden genommen (bei *n* Elementen das mit Index *n* // 2, gezählt ab 0): Aus habit … heat (6 Wörter) wird heap die Wurzel des linken Teilbaums.

:::diagram bintree caption="Die 13 Wörter als ausgeglichener Binärbaum (vier Ebenen)"
ebenen: ja
hero(heap(hag(habit,hall),heat(heart,)),hope(hint(hike,hole),hull(hub,)))
:::

**c) Suche nach „honest“** (kommt nicht vor):

- **Liste**: Man vergleicht von vorne habit, hag, … bis hope. Erst bei hope, dem ersten größeren Wort, steht fest, dass honest fehlt: **11 Vergleiche**. Ist die Liste nicht sortiert, sind es alle **13**.
- **Baum**: hero (honest ist größer, rechts), hope (kleiner, links), hint (größer, rechts), hole (größer, rechts), dann ein leerer Teilbaum: **4 Vergleiche**.

:::viz bst
{"preset": "h13", "start": "balance"}
:::

## [logic] Entartet, vollständig, balanciert

Wie gut ein geordneter Binärbaum funktioniert, hängt von seiner **Form** ab:

:::cols cards
**entartet (degeneriert)**: Jeder Knoten hat höchstens einen Nachfolger. Der Baum ist zu einer **Liste** geworden; eine Suche braucht bis zu *n* Vergleiche.
--- col
**vollständig**: Alle Ebenen sind **ganz** gefüllt. Ein vollständiger Binärbaum mit *n* Ebenen hat genau 2<sup>n</sup> − 1 Knoten, jeder innere Knoten hat zwei Nachfolger, alle Blätter liegen auf der untersten Ebene.
--- col
**balanciert (ausgeglichen)**: Bei **jedem** Knoten unterscheiden sich die Höhen des linken und des rechten Teilbaums um höchstens 1. Ein balancierter Baum hat fast so wenige Ebenen wie möglich.
:::

::::cols
:::diagram bintree caption="i: entartet"
1(,2(,3(,4)))
:::
--- col
:::diagram bintree caption="ii: balanciert, nicht vollständig"
8(4(2(1,),6),12(10,14(,15)))
:::
--- col
:::diagram bintree caption="iii: vollständig (und damit balanciert)"
4(2(1,3),6(5,7))
:::
::::

Für die Bäume aus Aufgabe 3 a): Baum 1 und Baum 3 haben 7 Knoten auf 3 vollen Ebenen, sie sind **vollständig** und balanciert. Baum 2 ist weder vollständig noch balanciert: Bei 56 ist der linke Teilbaum (67, 59) zwei Ebenen hoch, der rechte leer. Entartet ist er nicht, denn 43 und 34 haben je zwei Nachfolger.

:::note title="Begriffe in Schulbüchern"
Die Begriffe werden nicht überall gleich verwendet. Manche Bücher nennen einen Baum schon **vollständig**, wenn alle Ebenen außer der letzten voll sind. Abituraufgaben umschreiben es deshalb oft: „möglichst wenige Ebenen“ oder „für die Suche optimal aufgebaut“. Gib in der Klausur bei Bedarf deine Definition mit an.
:::

## [logic] Kapazität und Suchaufwand

Auf **Ebene *i*** eines Binärbaums haben höchstens **2<sup>i</sup>** Knoten Platz: 1, 2, 4, 8 … (jeder Knoten hat höchstens zwei Nachfolger). Ein Binärbaum mit ***n* Ebenen** fasst deshalb höchstens

**1 + 2 + 4 + … + 2<sup>n−1</sup> = 2<sup>n</sup> − 1 Knoten.**

Umgekehrt braucht ein Baum mit *k* Knoten mindestens so viele Ebenen, dass 2<sup>n</sup> − 1 ≥ *k* ist, also *n* = ⌈log<sub>2</sub>(*k* + 1)⌉.

| Ebenen *n* | Platz für 2<sup>n</sup> − 1 Knoten |
|---|---|
| 4 | 15 |
| 7 | 127 |
| 10 | 1 023 |
| 11 | 2 047 |
| 17 | 131 071 |
| 18 | 262 143 |
| 19 | 524 287 |
| 20 | 1 048 575 |

Bei einer Suche vergleicht man auf jeder Ebene **genau einmal** und steigt eine Ebene tiefer. Die **maximale Anzahl der Vergleiche ist die Anzahl der Ebenen**. Jede Ebene mehr verdoppelt die Kapazität, kostet aber nur einen Vergleich: Eine Million Einträge brauchen 20 Vergleiche, eine Liste bis zu einer Million.

**Suchaufwand (12_III_1_Aufgabe_8).** Ein soziales Netzwerk hat 500 000 Nutzer in einem ausgeglichenen geordneten Binärbaum; ein Vergleich dauert 3 · 10<sup>−6</sup> s.

- a) 2<sup>18</sup> − 1 = 262 143 < 500 000 ≤ 524 287 = 2<sup>19</sup> − 1, der Baum hat also **19 Ebenen**. Höchstens 19 Vergleiche: 19 · 3 · 10<sup>−6</sup> s = **5,7 · 10<sup>−5</sup> s**, also etwa 0,06 ms.
- b) Die Zeit wird oft unterschritten, weil ein vorhandener Name auch weiter oben im Baum liegen kann; die Suche endet dann früher. Nur Namen auf der untersten Ebene und manche fehlende Namen brauchen alle 19 Vergleiche.
- c) In einer Liste sind bis zu 500 000 Vergleiche nötig: 500 000 · 3 · 10<sup>−6</sup> s = 1,5 s. Wird bei jedem Tastendruck geprüft, wartet der Nutzer jedes Mal anderthalb Sekunden.

**Kinoverwaltung Teil 1 (12_III_1_Aufgabe_9, Abitur 2020).** Der Baum hat 9 Ebenen und 295 Kunden.

- a) 9 Ebenen fassen 2<sup>9</sup> − 1 = 511 Kunden, im besten Fall passen also noch **511 − 295 = 216** Kunden hinein, ohne dass eine Ebene dazukommt.
- b) Freie Plätze bei *n* Ebenen und *k* Kunden: **2<sup>n</sup> − 1 − *k***.

:::quiz
Ein geordneter Binärbaum enthält 1000 Schlüssel und hat möglichst wenige Ebenen. Wie viele Vergleiche braucht eine Suche höchstens?
- [ ] 9
- [x] 10
- [ ] 11
- [ ] 500
--- explain
2<sup>9</sup> − 1 = 511 < 1000 ≤ 1023 = 2<sup>10</sup> − 1, also 10 Ebenen und höchstens 10 Vergleiche.
:::

## [logic] Richtig oder falsch? (12_III_1_Aufgabe_5)

:::exam title="a) Jeder Baum ist eine Liste." points=1
--- solution
**Falsch.** Umgekehrt stimmt es: Eine Liste ist ein (entarteter) Baum, in dem jeder Knoten höchstens einen Nachfolger hat. Ein Baum kann sich verzweigen, eine Liste nicht.
:::

:::exam title="b) Jeder Knoten in einem Baum hat genau einen übergeordneten Knoten." points=1
--- solution
**Falsch.** Die Wurzel hat keinen. Richtig ist: Jeder Knoten **außer der Wurzel** hat genau einen Vorgänger.
:::

:::exam title="c) Die Anzahl der inneren Knoten ist immer größer als die Anzahl der Blätter." points=1
--- solution
**Falsch.** Gegenbeispiel: Eine Wurzel mit drei Nachfolgern hat einen inneren Knoten und drei Blätter. Auch der vollständige Binärbaum mit 7 Knoten hat 3 innere Knoten und 4 Blätter. Richtig wäre: Das Verhältnis hängt von der Form ab; nur in einem entarteten Baum mit mindestens drei Knoten gibt es mehr innere Knoten als Blätter.
:::

:::exam title="d) Jeder Baum mit k Knoten hat genau k − 2 Kanten." points=1
--- solution
**Falsch.** Er hat **k − 1** Kanten: Jeder Knoten außer der Wurzel hat genau eine Kante zu seinem Vorgänger.
:::

:::exam title="e) Jeder Baum ist ein Graph." points=1
--- solution
**Richtig.** Ein Baum ist ein zusammenhängender, kreisfreier Graph (meist mit gerichteten Kanten von der Wurzel weg).
:::

## [bridge] Bäume in Python: verschachtelte Tupel

Bevor du in D3 Bäume aus Objekten baust, kannst du die Logik schon mit einfachen Mitteln üben. Ein Binärbaum lässt sich als **verschachteltes Tupel** `(wert, links, rechts)` schreiben, ein leerer Baum als `None`. Die Funktion `B` spart Schreibarbeit:

```python
def B(wert, links=None, rechts=None):
    return (wert, links, rechts)

# 64(57(0(,30),),96(85(82(69,84),95),))
beispiel = B(64, B(57, B(0, None, B(30))), B(96, B(85, B(82, B(69), B(84)), B(95))))
wert, links, rechts = beispiel     # Tupel auspacken: wert = 64
```

:::bridge title="Rekursiv zählen"
methode AnzahlKnoten(baum) || def AnzahlKnoten(baum):
  falls baum ist leer dann ||     if baum is None:
    return 0 ||         return 0
  sonst ||     wert, links, rechts = baum
    return 1 + AnzahlKnoten(links) + AnzahlKnoten(rechts) ||     return 1 + AnzahlKnoten(links) + AnzahlKnoten(rechts)
>> Rekursionsende ist der leere Baum (`None`). Jeder Knoten zählt sich selbst und fragt seine beiden Teilbäume.
:::

## [python] Python-Blöcke

:::exercise id=t1-raten title="Das Ratespiel" level=1
Schreib `Raten(geheim)`: Sie spielt das Ratespiel mit der Halbierungsstrategie für eine Zahl zwischen 1 und 100 und gibt die **Anzahl der Versuche** zurück. Der Tipp ist immer `(unten + oben) // 2`, wobei `unten` und `oben` die Grenzen der noch möglichen Zahlen sind.
--- starter
def Raten(geheim):
    unten = 1
    oben = 100
    versuche = 0
    # dein Code
    return versuche


print(Raten(42))
print(max(Raten(z) for z in range(1, 101)))
--- solution
def Raten(geheim):
    unten = 1
    oben = 100
    versuche = 0
    while True:
        tipp = (unten + oben) // 2
        versuche += 1
        if tipp == geheim:
            return versuche
        if tipp > geheim:
            oben = tipp - 1
        else:
            unten = tipp + 1


print(Raten(42))
print(max(Raten(z) for z in range(1, 101)))
--- tests
@test("Einzelne Zahlen")
def _():
    eq(Raten(50), 1, "Raten(50)")
    eq(Raten(25), 2, "Raten(25)")
    eq(Raten(75), 2, "Raten(75)")
    eq(Raten(100), 7, "Raten(100)")
    eq(Raten(1), 6, "Raten(1)")

@test("Alle Zahlen 1 bis 100 in höchstens 7 Versuchen")
def _():
    alle = [Raten(z) for z in range(1, 101)]
    eq(max(alle), 7, "größte Anzahl an Versuchen")
    eq(sum(alle), 580, "Summe aller Versuche (Kontrolle der Strategie)")
--- hint
Eine Schleife: Tipp berechnen, Versuch zählen. Ist der Tipp zu groß, wird `oben = tipp - 1`, ist er zu klein, `unten = tipp + 1`.
--- explain
Jeder Versuch halbiert den Bereich [unten, oben]. Die Tipps bilden genau den Baum aus dem Logik-Teil; die Anzahl der Versuche ist die Ebene, auf der die geheime Zahl steht, plus 1.
:::

:::exercise id=t1-zaehlen title="Knoten, Blätter, Höhe" level=2
Schreib drei rekursive Funktionen für Bäume aus verschachtelten Tupeln `(wert, links, rechts)`:

- `AnzahlKnoten(baum)`,
- `AnzahlBlaetter(baum)` (Knoten ohne Nachfolger),
- `Hoehe(baum)`: größte Tiefe eines Knotens; ein einzelner Knoten hat Höhe 0, der leere Baum `-1`.
--- starter
def B(wert, links=None, rechts=None):
    return (wert, links, rechts)


def AnzahlKnoten(baum):
    pass


def AnzahlBlaetter(baum):
    pass


def Hoehe(baum):
    pass


beispiel = B(64, B(57, B(0, None, B(30))), B(96, B(85, B(82, B(69), B(84)), B(95))))
print(AnzahlKnoten(beispiel), AnzahlBlaetter(beispiel), Hoehe(beispiel))
--- solution
def B(wert, links=None, rechts=None):
    return (wert, links, rechts)


def AnzahlKnoten(baum):
    if baum is None:
        return 0
    wert, links, rechts = baum
    return 1 + AnzahlKnoten(links) + AnzahlKnoten(rechts)


def AnzahlBlaetter(baum):
    if baum is None:
        return 0
    wert, links, rechts = baum
    if links is None and rechts is None:
        return 1
    return AnzahlBlaetter(links) + AnzahlBlaetter(rechts)


def Hoehe(baum):
    if baum is None:
        return -1
    wert, links, rechts = baum
    return 1 + max(Hoehe(links), Hoehe(rechts))


beispiel = B(64, B(57, B(0, None, B(30))), B(96, B(85, B(82, B(69), B(84)), B(95))))
print(AnzahlKnoten(beispiel), AnzahlBlaetter(beispiel), Hoehe(beispiel))
--- tests
beispiel = B(64, B(57, B(0, None, B(30))), B(96, B(85, B(82, B(69), B(84)), B(95))))
kette = B(1, None, B(2, None, B(3, None, B(4))))
voll = B(4, B(2, B(1), B(3)), B(6, B(5), B(7)))

@test("AnzahlKnoten")
def _():
    eq(AnzahlKnoten(None), 0, "AnzahlKnoten(None)")
    eq(AnzahlKnoten(B(5)), 1, "AnzahlKnoten(B(5))")
    eq(AnzahlKnoten(beispiel), 10, "AnzahlKnoten(beispiel)")
    eq(AnzahlKnoten(kette), 4, "AnzahlKnoten(kette)")

@test("AnzahlBlaetter")
def _():
    eq(AnzahlBlaetter(None), 0, "AnzahlBlaetter(None)")
    eq(AnzahlBlaetter(B(5)), 1, "AnzahlBlaetter(B(5))")
    eq(AnzahlBlaetter(beispiel), 4, "AnzahlBlaetter(beispiel)")
    eq(AnzahlBlaetter(voll), 4, "AnzahlBlaetter(voll)")
    eq(AnzahlBlaetter(kette), 1, "AnzahlBlaetter(kette)")

@test("Hoehe")
def _():
    eq(Hoehe(None), -1, "Hoehe(None)")
    eq(Hoehe(B(5)), 0, "Hoehe(B(5))")
    eq(Hoehe(beispiel), 4, "Hoehe(beispiel)")
    eq(Hoehe(voll), 2, "Hoehe(voll)")
    eq(Hoehe(kette), 3, "Hoehe(kette)")

@test("Rekursiv")
def _():
    r, rec = recursive(AnzahlKnoten, beispiel)
    ok(rec, "AnzahlKnoten soll sich selbst aufrufen")
    r, rec = recursive(Hoehe, beispiel)
    ok(rec, "Hoehe soll sich selbst aufrufen")
--- hint
Alle drei beginnen mit `if baum is None:`. Was ist die Antwort für den leeren Baum? Danach packst du mit `wert, links, rechts = baum` aus.
--- hint
Ein Blatt erkennst du an `links is None and rechts is None`. Für die Höhe: `1 + max(Hoehe(links), Hoehe(rechts))`.
--- explain
Das Rekursionsende ist immer der leere Baum. Bei der Höhe sorgt −1 für den leeren Baum dafür, dass ein Blatt 1 + max(−1, −1) = 0 bekommt, passend zur Definition „Anzahl der Kanten“.
:::

:::exercise id=t1-geordnet title="Ist der Baum geordnet? (12_III_1_Aufgabe_3 a)" level=3
Schreib `IstGeordnet(baum)`: `True`, wenn der Baum ein geordneter Binärbaum ist (links kleiner, rechts größer, für **alle** Knoten in den Teilbäumen, ohne doppelte Schlüssel). Die Schlüssel können Zahlen oder Zeichenketten sein.

Tipp: Eine Hilfsfunktion `IstGeordnetZwischen(baum, unten, oben)` prüft, ob alle Schlüssel echt zwischen `unten` und `oben` liegen. `None` bedeutet „keine Grenze“.
--- starter
def B(wert, links=None, rechts=None):
    return (wert, links, rechts)


def IstGeordnetZwischen(baum, unten, oben):
    pass


def IstGeordnet(baum):
    return IstGeordnetZwischen(baum, None, None)


baum1 = B(21, B(7, B(3), B(20)), B(22, B(23), B(24)))
print(IstGeordnet(baum1))
--- solution
def B(wert, links=None, rechts=None):
    return (wert, links, rechts)


def IstGeordnetZwischen(baum, unten, oben):
    if baum is None:
        return True
    wert, links, rechts = baum
    if unten is not None and not wert > unten:
        return False
    if oben is not None and not wert < oben:
        return False
    return IstGeordnetZwischen(links, unten, wert) and IstGeordnetZwischen(rechts, wert, oben)


def IstGeordnet(baum):
    return IstGeordnetZwischen(baum, None, None)


baum1 = B(21, B(7, B(3), B(20)), B(22, B(23), B(24)))
print(IstGeordnet(baum1))
--- tests
@test("Die Bäume aus Aufgabe 3 a")
def _():
    eq(IstGeordnet(B(21, B(7, B(3), B(20)), B(22, B(23), B(24)))), False, "Baum 1")
    eq(IstGeordnet(B(43, B(56, B(67, None, B(59))), B(34, B(36), B(11)))), False, "Baum 2")
    eq(IstGeordnet(B("cake", B("car", B("call"), B("care")), B("coin", B("cuff"), B("code")))), False, "Baum 3 (englisch)")
    eq(IstGeordnet(B("Kuchen", B("Auto", B("Anruf"), B("Fürsorge")), B("Münze", B("Manschette"), B("Vorwahl")))), True, "Baum 3 (deutsch)")

@test("Geordnete Bäume")
def _():
    eq(IstGeordnet(None), True, "leerer Baum")
    eq(IstGeordnet(B(5)), True, "ein Knoten")
    eq(IstGeordnet(B(64, B(57, B(0, None, B(30))), B(96, B(85, B(82, B(69), B(84)), B(95))))), True, "Beispielbaum")

@test("Fallen: nicht nur die Kinder prüfen")
def _():
    eq(IstGeordnet(B(10, B(5, None, B(12)), B(20))), False, "12 im linken Teilbaum von 10")
    eq(IstGeordnet(B(10, B(5), B(20, B(8)))), False, "8 im rechten Teilbaum von 10")
    eq(IstGeordnet(B(10, B(10), None)), False, "doppelter Schlüssel")
--- hint
Rekursionsende: Ein leerer Baum ist immer geordnet. Sonst: Liegt `wert` zwischen den Grenzen? Dann rekursiv weiter.
--- hint
Der linke Teilbaum bekommt die neue obere Grenze `wert`, der rechte die neue untere Grenze `wert`: `IstGeordnetZwischen(links, unten, wert) and IstGeordnetZwischen(rechts, wert, oben)`.
--- explain
Jeder Knoten engt den erlaubten Bereich für seine Teilbäume ein. So wird die Bedingung für den ganzen Teilbaum geprüft und nicht nur für die direkten Nachfolger. Eine andere korrekte Lösung: Die Werte von links nach rechts (Inorder, D2) einsammeln und prüfen, ob sie echt aufsteigend sind.
:::

:::exercise id=t1-ebenen title="Ebenen und Platz" level=1
Schreib drei Funktionen:

- `MaxKnoten(n)`: wie viele Knoten passen höchstens in einen Binärbaum mit `n` Ebenen?
- `MinEbenen(k)`: wie viele Ebenen braucht ein Binärbaum mit `k` Knoten mindestens? Verwende eine Schleife und `MaxKnoten`, keine Logarithmen.
- `FreiePlaetze(n, k)`: wie viele Knoten passen bei `n` Ebenen und `k` vorhandenen Knoten im besten Fall noch hinein?
--- starter
def MaxKnoten(n):
    pass


def MinEbenen(k):
    pass


def FreiePlaetze(n, k):
    pass


print(MaxKnoten(9), MinEbenen(500000), FreiePlaetze(9, 295))
--- solution
def MaxKnoten(n):
    return 2 ** n - 1


def MinEbenen(k):
    n = 0
    while MaxKnoten(n) < k:
        n = n + 1
    return n


def FreiePlaetze(n, k):
    return MaxKnoten(n) - k


print(MaxKnoten(9), MinEbenen(500000), FreiePlaetze(9, 295))
--- tests
@test("MaxKnoten")
def _():
    eq(MaxKnoten(1), 1, "MaxKnoten(1)")
    eq(MaxKnoten(3), 7, "MaxKnoten(3)")
    eq(MaxKnoten(9), 511, "MaxKnoten(9)")
    eq(MaxKnoten(0), 0, "MaxKnoten(0)")

@test("MinEbenen")
def _():
    for k, n in [(0, 0), (1, 1), (2, 2), (3, 2), (7, 3), (8, 4), (100, 7), (2000, 11), (150000, 18), (500000, 19)]:
        eq(MinEbenen(k), n, "MinEbenen(%d)" % k)

@test("FreiePlaetze")
def _():
    eq(FreiePlaetze(9, 295), 216, "FreiePlaetze(9, 295) (Kinoverwaltung)")
    eq(FreiePlaetze(3, 7), 0, "FreiePlaetze(3, 7)")
--- hint
`MaxKnoten(n)` ist `2 ** n - 1`. Für `MinEbenen`: Fang bei 0 Ebenen an und erhöhe, solange noch nicht genug Platz ist.
--- explain
Die Schleife in `MinEbenen` probiert die Ebenenzahlen der Reihe nach aus. Das ist genau das, was du in der Klausur ohne Taschenrechner machst: 2er-Potenzen hochzählen, bis 2ⁿ − 1 ≥ k.
:::

## [exam] Klausurtraining

:::exam title="Fachbegriffe" points=4
Gegeben ist der Baum `A(B(E, F(K)), C, D(G, H, I))` aus dem Logik-Teil. Gib an: die Wurzel, alle Blätter, alle inneren Knoten, die Tiefe von F, die Höhe des Baums und die Anzahl der Kanten. Ist er ein Binärbaum?
--- solution
Wurzel A; Blätter E, K, C, G, H, I; innere Knoten A, B, D, F; Tiefe(F) = 2; Höhe 3 (Knoten K, also 4 Ebenen); 9 Kanten (10 Knoten − 1). Kein Binärbaum: A und D haben je drei Nachfolger.
:::

::::exam title="Liste umstrukturieren" points=4
Strukturiere die sortierte Liste 3, 8, 12, 17, 21, 26, 30, 34 zu einem geordneten Binärbaum mit möglichst wenigen Ebenen um. Nimm bei einer geraden Anzahl jeweils das rechte der beiden mittleren Elemente. Wie viele Vergleiche braucht die Suche nach 13 in der Liste und im Baum?
--- solution
:::diagram bintree
21(12(8(3,),17),30(26,34))
:::
Erst [3 … 34] (8 Elemente): Index 4 → 21. Links [3, 8, 12, 17] → 12, darunter [3, 8] → 8 (links 3) und [17]. Rechts [26, 30, 34] → 30 mit 26 und 34. Vier Ebenen (8 Knoten brauchen ⌈log₂ 9⌉ = 4).

Suche nach 13: In der sortierten Liste 3, 8, 12, 17, also **4** Vergleiche (bei 17 steht fest, dass 13 fehlt). Im Baum 21 (links), 12 (rechts), 17 (links), leer: **3** Vergleiche. Bei so wenigen Elementen ist der Unterschied klein, bei 1000 Elementen sind es höchstens 10 gegen bis zu 1000.
::::

:::exam title="Suchaufwand" points=4
Ein Online-Händler verwaltet 1 000 000 Artikelnummern in einem geordneten Binärbaum mit möglichst wenigen Ebenen. Ein Vergleich dauert 2 · 10⁻⁶ s. a) Wie lange dauert eine Suche höchstens? b) Wie lange dauert sie höchstens, wenn die Artikelnummern in aufsteigender Reihenfolge eingefügt wurden? Erkläre.
--- solution
a) 2¹⁹ − 1 = 524 287 < 1 000 000 ≤ 1 048 575 = 2²⁰ − 1, also 20 Ebenen: höchstens 20 · 2 · 10⁻⁶ s = 4 · 10⁻⁵ s.

b) Beim Einfügen in aufsteigender Reihenfolge hängt jeder neue Knoten rechts am vorigen: Der Baum entartet zu einer Liste mit 1 000 000 Ebenen. Höchstens 10⁶ · 2 · 10⁻⁶ s = 2 s.
:::

:::exam title="Kapazität (Abitur 2020)" points=3
Ein geordneter Binärbaum hat 12 Ebenen und enthält 3000 Kunden. a) Wie viele Kunden passen im besten Fall noch hinein, ohne dass eine Ebene dazukommt? b) Wie viele Ebenen hätte der Baum mindestens, wenn er optimal aufgebaut wäre?
--- solution
a) 2¹² − 1 = 4095 Plätze, also noch 4095 − 3000 = **1095** Kunden.

b) 2¹¹ − 1 = 2047 < 3000 ≤ 4095: mindestens **12** Ebenen. Der Baum ist also schon optimal.
:::

::::exam title="Formen erkennen" points=3
Entscheide für die drei Bäume, ob sie entartet, vollständig oder balanciert sind, und begründe.
a) `7(3(1,5),11(9,13))`  b) `5(2(1,),8(,9(,10)))`  c) `1(,3(2,))`
--- solution
- a) **vollständig** (drei volle Ebenen, 7 Knoten) und damit balanciert; nicht entartet.
- b) **nicht balanciert**: Bei 8 ist der linke Teilbaum leer (Höhe −1), der rechte (9, 10) hat Höhe 1, Unterschied 2. Nicht entartet (5 hat zwei Nachfolger), nicht vollständig.
- c) **entartet**: Jeder Knoten hat höchstens einen Nachfolger. Nicht balanciert (bei 1: links −1, rechts 1).
::::
