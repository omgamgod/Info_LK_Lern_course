---
id: d1
num: D1
part: D
title: Spickzettel und Glossar
short: Spickzettel
lead: Alles aus den Kapiteln I und II auf einer Seite. Jedes Thema steht mit seiner Idee, seinem Muster in Pseudocode und Python und den Fehlern, die Punkte kosten. Das Glossar am Ende erklärt jeden Fachbegriff des Kurses. Nutz die Seite zum Wiederholen; jeder Abschnitt verweist auf die Lektion, in der das Thema ausführlich erklärt ist.
minutes: 45
uses: [b1, b2, b3, b4, c1, c2, c3, c4]
goals:
  - das Muster jedes Algorithmus aus den Kapiteln I und II abrufen und aus dem Gedächtnis aufschreiben
  - jedem Fachbegriff seine Bedeutung zuordnen
  - die typischen Fehler kennen und wissen, wie man sie vermeidet
---

## [intro] So benutzt du diese Seite

Lies einen Abschnitt, deck die rechte Spalte jeder Brücke ab und schreib die Python-Version selbst; vergleiche dann. Kommt dir ein Abschnitt fremd vor, geh zurück zu der Lektion, die in seiner Überschrift verlinkt ist. Die Kurztests zwischen den Abschnitten mischen die Themen absichtlich, so wie die Klausur.

## [logic] I.1 Rekursion ([B1](#b1))

Eine Methode ist **rekursiv**, wenn sie sich selbst für ein **kleineres Problem derselben Art** aufruft.

| Teil | Frage | Beispiel `Fakultät(n)` |
|---|---|---|
| **Rekursionsende** | Welcher Fall wird direkt gelöst? | `n == 0` → 1 |
| **Rekursionsschritt** | Wie wird das Problem verkleinert? | `n * Fakultät(n - 1)` |
| **Abbruchbedingung** | Warum wird das Ende sicher erreicht? | n wird um 1 kleiner, erreicht also 0 |

:::bridge title="Die Form jeder rekursiven Methode"
methode Löse(problem)                     || def loese(problem):
    falls problem einfach dann            ||     if problem_ist_einfach:
        return direkte Lösung             ||         return direkte_loesung
    sonst                                 ||     else:
        teil = Löse(kleineres problem)    ||         teil = loese(kleineres_problem)
        return Lösung aus teil            ||         return loesung_aus(teil)
>> **Abstieg**: Die Aufrufe stapeln sich auf dem Aufrufstapel, jeder Rahmen wartet. **Aufstieg**: Die Rahmen kehren nacheinander zurück, jeder beendet seine Rechnung mit der Antwort von oben.
:::

- **linear rekursiv**: höchstens ein rekursiver Aufruf pro Ausführung (Fakultät, ggT). **mehrfach / baumartig rekursiv**: mehrere Aufrufe (Fibonacci, Hanoi), der Aufrufbaum verzweigt sich.
- **endrekursiv**: Der rekursive Aufruf ist die letzte Aktion, und sein Ergebnis wird unverändert zurückgegeben (`return GGT(b, a % b)`); `return n * F(n - 1)` ist **nicht** endrekursiv.
- Rekursion gegen Iteration: Rekursion ist kürzer und natürlich für verzweigte Probleme, braucht aber einen Rahmen pro aktivem Aufruf (`RecursionError`, wenn zu tief).
- Code, der **vor** dem rekursiven Aufruf steht, läuft beim Abstieg; Code **danach** läuft beim Aufstieg, in umgekehrter Reihenfolge.

:::quiz
Was gibt `f(3)` aus?

```python
def f(n):
    if n > 0:
        print(n)
        f(n - 1)
        print(n)
```
- [ ] 3 2 1
- [ ] 3 2 1 3 2 1
- [x] 3 2 1 1 2 3
- [ ] 1 2 3 3 2 1
--- explain
Das erste `print` läuft auf dem Weg nach unten (3, 2, 1). `f(0)` gibt nichts aus. Das zweite `print` läuft auf dem Weg zurück nach oben, der tiefste Rahmen zuerst (1, 2, 3).
:::

## [logic] I.2 Backtracking ([B2](#b2))

Bau eine Lösung **Schritt für Schritt** auf. Probier auf jeder Stufe jede Möglichkeit; ist sie zulässig, trag sie ein und geh eine Stufe tiefer. Hat eine Stufe keine Möglichkeit mehr, kehr zurück und **nimm** den letzten Eintrag **zurück**: Das ist das „Back“ im Backtracking.

:::bridge title="Backtracking-Schema"
methode SchrittAusführen(stufe)              || def schritt(stufe):
    für jede Möglichkeit m                   ||     for m in moeglichkeiten(stufe):
        falls m zulässig dann                ||         if zulaessig(m, stufe):
            m eintragen                      ||             eintragen(m, stufe)
            falls Lösung vollständig dann    ||             if vollstaendig(stufe):
                Lösung ausgeben              ||                 ausgeben()
            sonst                            ||             else:
                SchrittAusführen(stufe + 1)  ||                 schritt(stufe + 1)
            m wieder austragen               ||             austragen(m, stufe)
>> Damenproblem: Stufe = Spalte, Möglichkeit = Zeile. Sudoku: Stufe = leere Zelle, Möglichkeit = Ziffer 1–9. Rucksack: Stufe = Gegenstand, Möglichkeiten = nehmen / nicht nehmen. Für nur die **erste** Lösung gib `True` zurück, sobald eine Lösung vollständig ist, und beende alle Schleifen mit `if schritt(...): return True`.
:::

- Um die **beste** Lösung aufzuheben, speichere eine **Kopie** (`list(...)`, `[zeile[:] for zeile in feld]`), nie die Arbeitsliste selbst.
- Der Aufwand wächst exponentiell; **Abschneiden** (Zweige beenden, die nicht besser werden können) hilft.

## [logic] I.3 Graphen und Tiefensuche ([B3](#b3))

**Graph** = Knoten + Kanten; gerichtet/ungerichtet, gewichtet, zusammenhängend, zyklisch. **Adjazenzmatrix**: `matrix[i][j]` = Gewicht der Kante i → j, **−1** = keine Kante (in deinen Vorlagen). Ungerichtete Kanten kommen zweimal vor, die Matrix ist symmetrisch.

:::bridge title="Tiefensuche (rekursiv) und Breitensuche (Warteschlange)"
methode KnotenBesuchen(aktuell)              || def KnotenBesuchen(self, aktuell):
    aktuell markieren                        ||     self.besuchteKnoten.append(aktuell)
    für jeden Knoten nummer                  ||     for nummer in range(len(self.knoten)):
        falls Kante und nicht markiert dann  ||         if self.matrix[aktuell][nummer] > 0 and nummer not in self.besuchteKnoten:
            KnotenBesuchen(nummer)           ||             self.KnotenBesuchen(nummer)
methode Breitensuche(start)                  || def BreitensucheAusführen(self, start):
    start markieren, in Schlange             ||     besucht = [start]; schlange = [start]
    solange Schlange nicht leer              ||     while len(schlange) > 0:
        k = vorne entfernen; ausgeben        ||         k = schlange.pop(0)
        für jeden Nachbarn n von k           ||         for n in range(len(self.knoten)):
            falls n nicht markiert dann      ||             if self.matrix[k][n] > 0 and n not in besucht:
                n markieren, hinten anhängen ||                 besucht.append(n); schlange.append(n)
>> Tiefensuche: zuerst so tief wie möglich, der Aufrufstapel merkt sich den Rückweg. Breitensuche: zuerst alle Nachbarn (Entfernung 1, 2, …), eine Warteschlange ersetzt den Aufrufstapel. Die Nachbarn werden immer in **Matrixreihenfolge** geprüft.
:::

- Die Tiefensuche besucht jeden erreichbaren Knoten **genau einmal**; Markierungen werden nie entfernt.
- **Zusammenhang testen**: Tiefensuche von einem beliebigen Knoten; der Graph ist zusammenhängend, wenn danach alle Knoten markiert sind.

## [logic] I.4 Optimale Lösungen ([B4](#b4))

Finde **alle** Wege start → ziel und behalte den besten. Zwei Änderungen an der Tiefensuche: **auf dem Rückweg die Markierung entfernen**, **am Ziel anhalten**.

:::bridge title="KnotenBesuchen2: alle Wege und der kürzeste"
methode KnotenBesuchen(aktuell, ziel, länge)  || def KnotenBesuchen2(self, aktuell, ziel, länge):
    aktuell markieren, an Weg anhängen        ||     self.besuchteKnoten.append(aktuell); self.aktuellerWeg.append(self.knoten[aktuell])
    falls aktuell == ziel dann                ||     if aktuell == ziel:
        falls länge < optimaleLänge dann      ||         if länge < self.optimaleLänge:
            optimalerWeg = KOPIE von Weg      ||             self.optimalerWeg = list(self.aktuellerWeg)
            optimaleLänge = länge             ||             self.optimaleLänge = länge
    sonst                                     ||     else:
        für jeden Nachbarn nummer             ||         for nummer in range(len(self.knoten)):
            falls nicht markiert dann         ||             if self.matrix[aktuell][nummer] > 0 and nummer not in self.besuchteKnoten:
                KnotenBesuchen(nummer, ziel,  ||                 self.KnotenBesuchen2(nummer, ziel,
                    länge + Gewicht)          ||                     länge + self.matrix[aktuell][nummer])
    Markierung entfernen, Weg kürzen          ||     self.besuchteKnoten.remove(aktuell); self.aktuellerWeg.pop()
>> `optimaleLänge` beginnt bei ∞ (`float('inf')`). `länge` ist ein **Parameter**: Jeder Rahmen hat seinen eigenen Wert, auf dem Rückweg muss nichts abgezogen werden. Abschneiden: `if länge >= self.optimaleLänge: return` am Anfang.
:::

- **Labyrinth, irgendein Weg hinaus**: keine Markierung entfernen, am Ziel `return True` und nach oben weiterreichen; den Knoten nur in einer Sackgasse aus `weg` entfernen.
- **Handlungsreisender**: „vollständig“ heißt, alle Knoten sind besucht; den Rückweg nach Hause addieren; (n − 1)! Reihenfolgen.

:::quiz
Nach einer vollständigen Suche nach dem kürzesten Weg ist `optimalerWeg` leer, obwohl ein Weg gefunden wurde. Was ist der wahrscheinlichste Fehler?
- [ ] die Markierungen wurden auf dem Rückweg nicht entfernt
- [x] `self.optimalerWeg = self.aktuellerWeg` statt einer Kopie
- [ ] `optimaleLänge` wurde mit ∞ belegt
- [ ] `länge` wurde als Parameter übergeben
--- explain
Ohne Kopie ist `optimalerWeg` nur ein zweiter Name für die Arbeitsliste `aktuellerWeg`, die auf dem Rückweg wieder geleert wird. `list(self.aktuellerWeg)` erzeugt eine unabhängige Kopie.
:::

## [logic] II.1 Warteschlange ([C1](#c1))

**FIFO** (first in, first out): Einfügen am Ende, Entfernen am Anfang. Referenzen `anfang` und `ende`; jedes Element kennt seinen `nachfolger`.

:::bridge title="Einfügen und Entfernen mit allen Sonderfällen"
methode Einfügen(neu)                    || def Einfügen(self, neu):
    falls anfang == nichts dann          ||     if self.anfang is None:
        anfang = neu                     ||         self.anfang = neu
    sonst                                ||     else:
        ende.NachfolgerSetzen(neu)       ||         self.ende.NachfolgerSetzen(neu)
    ende = neu                           ||     self.ende = neu
methode Entfernen()                      || def Entfernen(self):
    falls anfang == nichts dann          ||     if self.anfang is None:
        return nichts                    ||         return None
    alt = anfang                         ||     alt = self.anfang
    anfang = anfang.NachfolgerGeben()    ||     self.anfang = self.anfang.NachfolgerGeben()
    falls anfang == nichts dann          ||     if self.anfang is None:
        ende = nichts                    ||         self.ende = None
    return alt                           ||     return alt
>> Drei Fälle prüfst du jedes Mal: leere Warteschlange, genau ein Element, mehrere Elemente. Feld gegen Warteschlange: Ein Feld hat eine feste Größe und direkten Zugriff über den Index; die Kette wächst und schrumpft, Zugriff aber nur durch Durchlaufen ab `anfang`.
:::

## [logic] II.2 Struktur und Daten trennen ([C2](#c2))

Die Datenklasse (PATIENT) soll nichts von Listen wissen. Ein **KNOTEN** trägt die Struktur (`nachfolger`) und verweist auf ein **DATENELEMENT** (`daten`). Dieselben Listenklassen funktionieren dann für beliebige Daten. Abstrakte Klasse DATENELEMENT: Jede Datenklasse verspricht `InformationAusgeben()`, `SchlüsselIstGleich(s)` (und `IstKleinerAls(d)` zum Sortieren).

## [logic] II.3 Einfach verkettete Liste ([C3](#c3))

Die Methoden arbeiten **rekursiv an den Knoten entlang**: LISTE startet, jeder KNOTEN erledigt seinen Teil und delegiert den Rest. Methoden, die die Kette ändern, verwenden das Muster **den neuen Rest zurückgeben**:

:::bridge title="nachfolger = nachfolger.Methode(…) / return selbst"
// LISTE                                     || # class Liste
anfang = anfang.EinfügenVor(dNeu, dVgl)      || self.anfang = self.anfang.EinfuegenVor(dneu, d_vergleich)
// KNOTEN                                    || # class Knoten
falls daten == dVgl dann                     || if self.daten == d_vergleich:
    return neu KNOTEN(dNeu, selbst)          ||     return Knoten(dneu, self)      # der neue Knoten nimmt meinen Platz ein
nachfolger = nachfolger.EinfügenVor(…)       || self.nachfolger = self.nachfolger.EinfuegenVor(dneu, d_vergleich)
return selbst                                || return self                        # ich bleibe
>> Gib **selbst** zurück, wenn sich hier nichts ändert, einen **neuen Knoten**, um vor dir einzufügen, deinen **nachfolger**, um zu verschwinden. Ohne Kompositum brauchen LISTE und KNOTEN zusätzlich Prüfungen `falls … ≠ nichts`.
:::

## [logic] II.4 Kompositum ([C4](#c4))

Das Ende der Liste ist ein echtes Objekt, der **ABSCHLUSS**. KNOTEN und ABSCHLUSS erben vom abstrakten **LISTENELEMENT**. Der ABSCHLUSS ist das Rekursionsende jeder Methode; Prüfungen auf nichts sind nicht nötig.

:::diagram classes caption="Kompositum: das Klassendiagramm, das du zeichnen können musst"
class LISTE @0,0 | anfang: LISTENELEMENT | 
abstract LISTENELEMENT @1.3,0 | | Methoden {abstract}
class KNOTEN @0.8,1.1 | daten; nachfolger | 
class ABSCHLUSS @1.9,1.1 | | 
abstract DATENELEMENT @0,2.1 | | 
assoc LISTE -> LISTENELEMENT : anfang [1]
inherit KNOTEN -> LISTENELEMENT
inherit ABSCHLUSS -> LISTENELEMENT
assoc KNOTEN -> LISTENELEMENT : nachfolger [1]
assoc KNOTEN -> DATENELEMENT : daten [1]
:::

| Methode | LISTE | KNOTEN | ABSCHLUSS |
|---|---|---|---|
| LängeGeben | anfang.LängeGeben() | nachfolger.LängeGeben() + 1 | 0 |
| HintenEinfügen(d) | anfang = anfang.HintenEinfügen(d) | nachfolger = nachfolger.HintenEinfügen(d); return selbst | return neu KNOTEN(d, selbst) |
| Suchen(s) | return anfang.Suchen(s) | falls daten passt: daten, sonst nachfolger.Suchen(s) | nichts |
| InformationAusgeben | anfang.InformationAusgeben() | daten.InformationAusgeben(); nachfolger.InformationAusgeben() | – |
| AnfangEntfernen | d = anfang.DatenelementGeben(); anfang = anfang.NachfolgerGeben(); return d | – | DatenelementGeben → nichts, NachfolgerGeben → selbst |
| EndeGeben(bisher) | anfang.EndeGeben(nichts) | nachfolger.EndeGeben(daten) | return bisher |
| EndeEntfernen | anfang = anfang.EndeEntfernen() | falls nachfolger.LängeGeben() == 0: return nachfolger; sonst Muster | return selbst |
| KnotenEntfernen(d) | anfang = anfang.KnotenEntfernen(d) | falls daten == d: return nachfolger; sonst Muster | return selbst |

Rollen im Entwurfsmuster: LISTENELEMENT = **Komponente**, KNOTEN = **Kompositum**, ABSCHLUSS = **Blatt**, LISTE = **Klient**.

:::quiz
In welcher Klasse liegt das Rekursionsende von `LängeGeben()`, wenn die Liste ein Kompositum ist?
- [ ] LISTE
- [ ] KNOTEN, in einem falls nachfolger == nichts
- [x] ABSCHLUSS
- [ ] LISTENELEMENT
--- explain
Der ABSCHLUSS antwortet 0, ohne einen weiteren Aufruf. Die Entscheidung zwischen Rekursionsschritt und Rekursionsende trifft die Klasse des empfangenden Objekts (Polymorphie), nicht ein `if`.
:::

## [logic] Diagramme in der Klausur

| Diagramm | Muss enthalten | Typische Punktverluste |
|---|---|---|
| **Objektdiagramm** | Kästen `name: KLASSE` (unterstrichen), Attributwerte, Referenzen als Pfeile | eine Referenz als Wert gezeichnet; den ABSCHLUSS vergessen; zwei ABSCHLUSS-Objekte |
| **Klassendiagramm** | Klassenname, Attribute, Methoden; Assoziationen mit Name und **Multiplizität**; Vererbung als hohles Dreieck; abstrakt *kursiv* / «abstract» | KNOTEN → KNOTEN statt KNOTEN → LISTENELEMENT; fehlende Multiplizitäten |
| **Sequenzdiagramm** | Objekte oben mit gestrichelten **Lebenslinien**, Aktivierungsbalken, Aufruf = durchgezogener Pfeil mit Methodenname, Rückgabe = gestrichelter Pfeil **mit dem zurückgegebenen Wert** | fehlende Rückgabewerte; das Objekt, das eine Nachricht empfängt, muss die nächste Nachricht von seiner eigenen Lebenslinie aus zeichnen |
| **Aufrufbaum** | ein Kasten pro Aufruf mit seinen Parametern, Ergebnisse an die Kanten geschrieben | vergessen, dass Ergebnisse nach oben zurückwandern |
| **Struktogramm** | Sequenz, falls (zwei Zweige), wiederhole solange / für | falsche Verschachtelung |

## [logic] Die zehn teuersten Fehler

1. Kein Rekursionsende oder eines, das nie erreicht wird → `RecursionError` ([B1](#b1)).
2. `return` vor dem rekursiven Aufruf vergessen → das Ergebnis geht verloren, `None` kommt zurück ([B1](#b1), [C3](#c3)).
3. Backtracking ohne **Zurücknehmen** → spätere Zweige sehen ein belegtes Feld ([B2](#b2)).
4. Die beste Lösung ohne **Kopie** speichern ([B4](#b4)).
5. In der normalen Tiefensuche Markierungen entfernen (sie besucht Knoten dann mehrfach) oder bei der Suche nach allen Wegen **nicht** entfernen ([B3](#b3), [B4](#b4)).
6. Warteschlange: die Sonderfälle „leer“ und „ein Element“ vergessen, besonders `ende = nichts` nach dem Entfernen des letzten ([C1](#c1)).
7. Mit `nichts` in der falschen Reihenfolge prüfen: `anfang.NachfolgerGeben()`, bevor `anfang ≠ nichts` geprüft ist → AttributeError ([A8](#a8)).
8. Beim Muster „neuen Rest zurückgeben“: `return self` vergessen oder `return self.nachfolger`, wo `return self` nötig ist ([C3](#c3), [C4](#c4)).
9. Kompositum: die Assoziation KNOTEN → KNOTEN statt KNOTEN → LISTENELEMENT, oder mehrere ABSCHLUSS-Objekte ([C4](#c4)).
10. Python: `self.` vor Attributen und Methoden vergessen, `=` statt `==`, falsche Einrückung ([A2](#a2), [A7](#a7)).

## [intro] Glossar

Die englischen Begriffe helfen dir, Pythons Fehlermeldungen und Dokumentation zu lesen.

| Begriff | Englisch | Bedeutung | Lektion |
|---|---|---|---|
| **Rekursion**, rekursiv | recursion | eine Methode ruft sich selbst für ein kleineres Problem derselben Art auf | B1 |
| **Rekursionsende** | base case | Fall, der direkt gelöst wird, ohne weiteren Aufruf | B1 |
| **Rekursionsschritt** | recursive step | Zurückführen des Problems auf ein kleineres, mit einem rekursiven Aufruf | B1 |
| **Abbruchbedingung** | termination condition | Garantie, dass das Rekursionsende erreicht wird | B1 |
| **Abstieg / Aufstieg** | winding / unwinding | Aufrufe stapeln sich / kehren nacheinander zurück | B1 |
| **Aufrufbaum** | call tree | Zeichnung aller Aufrufe mit Parametern und Ergebnissen | B1 |
| **Aufrufstapel** (Stack) | call stack | die Rahmen aller aktiven Aufrufe, der neueste oben | A5, B1 |
| **linear / mehrfach rekursiv** | linear / tree recursion | höchstens ein / mehrere rekursive Aufrufe pro Ausführung | B1 |
| **endrekursiv** | tail recursive | rekursiver Aufruf ist die letzte Aktion, Ergebnis wird unverändert weitergegeben | B1 |
| **iterativ** | iterative | mit einer Schleife statt mit Rekursion | B1 |
| **Backtracking** | backtracking | systematisches Ausprobieren mit Zurücknehmen | B2 |
| **zurücknehmen / austragen** | undo | den letzten Eintrag beim Zurückgehen entfernen | B2 |
| **Graph, Knoten, Kante** | graph, node (vertex), edge | | B3 |
| **gerichtet / ungerichtet** | directed / undirected | Kanten in einer / beiden Richtungen benutzbar | B3 |
| **gewichtet** | weighted | Kanten tragen Zahlen | B3 |
| **zusammenhängend** | connected | jeder Knoten ist von jedem anderen aus erreichbar | B3 |
| **zyklisch** | cyclic | enthält einen Zyklus | B3 |
| **Adjazenzmatrix** | adjacency matrix | Tabelle mit den Kantengewichten, −1 = keine Kante | B3 |
| **Tiefensuche** | depth-first search | rekursiver Besuch aller erreichbaren Knoten, zuerst in die Tiefe | B3 |
| **Breitensuche** | breadth-first search | Besuch nach Entfernung, mit einer Warteschlange | B3 |
| **optimaler Weg / optimale Länge** | optimal path / length | beste bisher gefundene vollständige Lösung | B4 |
| **Abschneiden** | pruning (branch and bound) | einen Zweig beenden, der nicht besser werden kann | B4 |
| **Handlungsreisender** | travelling salesman | kürzeste Rundreise durch alle Knoten | B4 |
| **Warteschlange** | queue (FIFO) | hinten einfügen, vorne entfernen | C1 |
| **Feld** | array | Folge fester Größe mit Zugriff über den Index | C1 |
| **Referenz / Verweis** | reference | ein Attribut, das auf ein Objekt zeigt | A8 |
| **nichts** | None / null | kein Objekt | A8 |
| **Nachfolger** | successor | das nächste Element in einer Kette | C1 |
| **Trennung von Struktur und Daten** | separation of structure and data | KNOTEN trägt die Kette, DATENELEMENT den Inhalt | C2 |
| **KNOTEN** (Liste) | node | Element der Kette mit `daten` und `nachfolger` | C2 |
| **DATENELEMENT** | data element | abstrakte Klasse für beliebige gespeicherte Daten | C2 |
| **einfach verkettete Liste** | singly linked list | jeder Knoten kennt nur seinen Nachfolger | C3 |
| **Entwurfsmuster** | design pattern | bewährte Lösungsschablone für ein wiederkehrendes Entwurfsproblem | C4 |
| **Kompositum** | composite pattern | Komponente, Kompositum, Blatt | C4 |
| **LISTENELEMENT** | list element | abstrakte Komponente der Liste | C4 |
| **ABSCHLUSS** | end object (terminator) | Blatt der Liste, Rekursionsende aller Methoden | C4 |
| **Klasse, Objekt, Attribut, Methode** | class, object, attribute, method | | A7 |
| **Konstruktor** | constructor | `__init__`, setzt die Attribute eines neuen Objekts | A7 |
| **Vererbung, Ober-/Unterklasse** | inheritance, super-/subclass | | A9 |
| **überschreiben** | override | eine geerbte Methode neu definieren | A9 |
| **Polymorphie** | polymorphism | dieselbe Nachricht, unterschiedliches Verhalten je nach Objekt | A9 |
| **abstrakte Klasse** | abstract class | kann nicht instanziiert werden, beschreibt, was Unterklassen bereitstellen müssen | A9 |
| **Schnittstelle** | interface | nur abstrakte Methoden | A9 |
| **Multiplizität** | multiplicity | wie viele Objekte an einer Assoziation beteiligt sind | A7, C4 |
| **Rückgabewert** | return value | Ergebnis, das mit `return` zurückgegeben wird | A5 |
| **Parameter / lokale Variable** | parameter / local variable | Werte, die zu einem Aufruf gehören | A5 |
| **GANZZAHL, KOMMAZAHL, ZEICHENKETTE, WAHRHEITSWERT** | int, float, str, bool | Datentypen in der Notation deines Kurses | A1 |
