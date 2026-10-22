---
id: b2
num: B2
part: B
title: Backtracking
short: Backtracking
lead: Backtracking ist systematisches Ausprobieren. Du baust eine Lösung Schritt für Schritt auf, und wann immer du feststeckst, nimmst du den letzten Schritt zurück und probierst die nächste Möglichkeit. Die Rekursion übernimmt die Buchführung für dich. Beispiele aus deinem Kurs sind das Damenproblem, das Rucksackproblem, Sudoku, das Höhlenlabyrinth und der Rösselsprung.
minutes: 100
uses: [b1, a6]
goals:
  - das Backtracking-Prinzip mit den Begriffen Stufe, Möglichkeit, zulässig, eintragen, zurücknehmen beschreiben
  - einen Entscheidungsbaum von Hand zeichnen und durchsuchen
  - das allgemeine Backtracking-Schema an ein neues Problem anpassen (eine Lösung / alle Lösungen / beste Lösung)
  - das Damenproblem, das Rucksackproblem, FeldelementFixieren für das Sudoku und den Rösselsprung in Python implementieren
---

## [logic] Systematisches Ausprobieren

Stell dir vor, du stehst ohne Karte in einem Labyrinth. Eine gute Strategie: An jeder Kreuzung nimmst du den ersten Weg, den du noch nicht probiert hast. Landest du in einer Sackgasse, **gehst du zurück** zur letzten Kreuzung und nimmst dort den nächsten Weg. Sind alle Wege einer Kreuzung aufgebraucht, gehst du noch eine Kreuzung zurück. So findest du den Ausgang, wenn es einen gibt, und läufst nie zweimal in dieselbe Sackgasse.

Das ist **Backtracking** (Rückverfolgung, *zurücksetzen*). Allgemein gilt:

- Die Lösung wird in **Stufen** aufgebaut: Spalte für Spalte eines Schachbretts, Gegenstand für Gegenstand eines Rucksacks, Zelle für Zelle eines Sudokus.
- Auf jeder Stufe gibt es mehrere **Möglichkeiten**: die 8 Zeilen einer Spalte, „Gegenstand nehmen / liegen lassen“, die Ziffern 1–9.
- Eine Möglichkeit ist **zulässig**, wenn sie mit den bisherigen Entscheidungen keine Regel verletzt (keine Dame bedroht, Rucksack nicht zu schwer, Ziffer noch nicht in Zeile/Spalte/Block).
- Zulässige Möglichkeiten werden **eingetragen**, und die nächste Stufe wird probiert.
- Hat eine Stufe **keine** zulässige Möglichkeit mehr, wird die letzte Entscheidung **zurückgenommen** (ausgetragen), und die vorherige Stufe macht mit ihrer nächsten Möglichkeit weiter. Dieses Zurückgehen ist das eigentliche *Backtracking*.

Alle Teillösungen zusammen bilden einen **Entscheidungsbaum**. Backtracking durchläuft diesen Baum **in die Tiefe zuerst**: Es geht immer erst tiefer und kehrt nur an einem Blatt oder in einer Sackgasse um. Ganze Teilbäume, deren Wurzel schon eine Regel verletzt, werden nie besucht. Dieses **Abschneiden** spart gegenüber dem blinden Ausprobieren aller Kombinationen enorm viel Arbeit.

### Das allgemeine Schema

```pseudo
methode SchrittAusführen(stufe)
    für jede Möglichkeit m auf dieser stufe
        falls m zulässig dann
            m eintragen
            falls Lösung vollständig dann
                Lösung ausgeben
            sonst
                SchrittAusführen(stufe + 1)
            endefalls
            m wieder austragen          // zurücknehmen
        endefalls
    endefür
endemethode
```

Warum passt Rekursion so gut? Jeder Aufruf ist für **eine Stufe** zuständig. Sein Rahmen auf dem Aufrufstapel merkt sich, welche Möglichkeit er gerade probiert (die Schleifenvariable). Wenn ein tieferer Aufruf zurückkehrt, setzt der Rahmen seine Schleife einfach mit der nächsten Möglichkeit fort. Das Zurückgehen ist die ganz normale Rückkehr einer Funktion.

:::key title="Drei Varianten desselben Schemas"
- **Alle Lösungen**: wie oben, denn nach einer Lösung geht die Suche weiter.
- **Eine Lösung**: `SchrittAusführen` gibt `wahr` zurück, wenn eine Lösung gefunden ist; jeder Aufrufer, der `wahr` bekommt, gibt sofort ebenfalls `wahr` zurück, und die ganze Suche endet.
- **Beste Lösung** (Rucksack, kürzester Weg): Jede vollständige Lösung wird mit der bisher besten verglichen; die beste wird **gemerkt** (als Kopie!). Wahlweise werden Zweige abgeschnitten, die die beste nicht mehr schlagen können.
:::

## [logic] Das Damenproblem (12_I_2_Damenproblem)

*Auf wie viele Arten kann man 8 Damen so auf ein Schachbrett stellen, dass keine Dame eine andere schlagen kann?* (Max Bezzel, 1848.) Eine Dame schlägt waagrecht, senkrecht und diagonal, deshalb **steht in jeder Spalte genau eine Dame**. Das ergibt die Stufen: Spalte 0, Spalte 1, …; die Möglichkeiten auf jeder Stufe sind die Zeilen.

Ein Feld (zeile, spalte) ist von einer früheren Dame in (z, s) **bedroht**, wenn

- `z == zeile` (gleiche Zeile) oder
- `|z − zeile| == |s − spalte|` (gleiche Diagonale: so viele Zeilen auseinander wie Spalten).

Die Spalte kann nicht kollidieren, weil wir genau eine Dame pro Spalte setzen.

:::diagram board caption="Dame in (1, 0): Die roten Felder in Spalte 1 und 2 sind bedroht"
{"n": 4, "pieces": [[1, 0, "♛"]], "marks": [[0, 1, "red"], [1, 1, "red"], [2, 1, "red"], [1, 2, "red"], [3, 2, "red"], [1, 3, "red"]]}
:::

Geh die Suche auf einem 4×4-Brett Schritt für Schritt durch. Rot = gerade geprüftes Feld, bernsteinfarben = die Dame, die es bedroht, violett = eine Dame, die gerade zurückgenommen wurde:

:::viz queens
{"n": 4}
:::

Anzahl der Lösungen: 4×4 → 2, 5×5 → 10, 6×6 → 4, 8×8 → **92**. Für eine Lösung auf 8×8 braucht die Suche ein paar hundert Schritte; stell auf *alle Lösungen* um und sieh, wie viel länger die vollständige Suche dauert.

### Darstellung

Wir speichern die Damen als Liste `damen`, wobei `damen[spalte]` die Zeile der Dame in dieser Spalte ist. Eine Dame in Spalte `len(damen)` setzen ist `damen.append(zeile)`, sie zurücknehmen ist `damen.pop()`. Die Liste ist genau der aktuelle Pfad im Entscheidungsbaum.

## [logic] Das Rucksackproblem (12_I_2_Rucksackproblem)

Aus deinem Arbeitsblatt: Der Rucksack darf höchstens **10 kg** wiegen. Welche Gegenstände liefern den höchsten Nährwert?

| Nummer | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Gewicht [kg] | 5 | 7 | 4 | 3 |
| Nährwert [MJ] | 40 | 35 | 12 | 30 |

Stufen: die Gegenstände 0, 1, 2, 3. Möglichkeiten pro Stufe: **nehmen** oder **liegen lassen**. Eine Wahl ist nicht zulässig, wenn der Rucksack schwerer als 10 kg wird; dann wird dieser ganze Zweig abgeschnitten. Gesucht ist hier die **beste** Lösung, deshalb wird jede vollständige Auswahl mit der bisher besten verglichen.

:::viz knapsack
{}
:::

Ergebnis: Gegenstände **0 und 3**, 8 kg, **70 MJ**. 0 und 1 (12 kg) oder 1, 2 und 3 (14 kg) sind nicht zulässig. 1 und 3 (10 kg, 65 MJ) ist zulässig, aber schlechter.

Bei n Gegenständen gibt es 2ⁿ mögliche Auswahlen. Backtracking mit Abschneiden spart viel, aber bei vielen Gegenständen bleibt das Problem sehr aufwendig. Ein grundsätzlich schnelleres Verfahren ist nicht bekannt.

## [logic] Sudoku (12_I_2_Sudoku)

Deine Vorlage stellt das Sudoku geschickt dar: Jedes Element des 9×9-Feldes ist eine **Liste der Werte, die an dieser Stelle noch möglich sind**. Am Anfang ist jedes Element `[1, 2, …, 9]`.

**FeldelementFixieren(zeile, spalte, wert)** (Teilaufgabe b) trägt einen Wert ein:

1. `wert` aus jedem Element derselben **Zeile** entfernen,
2. aus jedem Element derselben **Spalte**,
3. aus jedem Element desselben **3×3-Blocks** (beginnt bei `zeile // 3 * 3`, `spalte // 3 * 3`, siehe Lektion A1),
4. das Element selbst auf `[wert]` setzen.

:::viz sudoku
{}
:::

**SchrittAusführen(zeile, spalte)** (in der Vorlage gegeben) ist das Backtracking: Es geht die Zellen in Lesereihenfolge durch. Für die aktuelle Zelle probiert es jeden Wert, der noch möglich ist. Ist die Zelle die letzte, ist eine Lösung gefunden. Sonst geht es mit der nächsten Zelle weiter. Vor dem Probieren speichert es eine **Kopie** des ganzen Feldes (`startFeld = self.Kopieren(self.feld)`), und nach jedem Versuch stellt es diese Kopie wieder her. Das ist das *Zurücknehmen*: Alles, was weiter unten fixiert wurde, wird auf einmal rückgängig gemacht.

Hat eine Zelle eine **leere** Kandidatenliste, hat die `for`-Schleife nichts zu probieren: Dieser Zweig ist eine Sackgasse, und der Aufruf kehrt ohne Lösung zurück.

## [logic] Höhlenlabyrinth und Rösselsprung

**Höhlenlabyrinth (Aufgabe 3)**: Die Kammern sind Knoten, die Gänge sind Kanten. Nummeriere die Knoten und leg für jede Kammer eine Reihenfolge fest, in der ihre Gänge probiert werden. Dann such vom Eingang aus: Geh in den ersten Gang, den du noch nicht probiert hast, und geh zurück, wenn eine Kammer keinen neuen Gang mehr hat. Das ist schon die **Tiefensuche** aus Lektion B3: Backtracking auf einem Graphen.

**Rösselsprung (Aufgabe 5)**: Ein Springer soll jedes Feld des Bretts genau einmal besuchen. Stufen: die Züge 1, 2, 3, …; Möglichkeiten: die 8 Springerzüge; zulässig: Das Zielfeld liegt auf dem Brett und ist noch frei. Das Brett speichert für jedes Feld die Nummer des Zuges (0 = frei); Zurücknehmen heißt, das Feld wieder auf 0 zu setzen.

:::diagram board caption="Die 8 Züge eines Springers von (2, 2) aus"
{"n": 5, "pieces": [[2, 2, "♞"], [0, 1, "♞", "grey"], [0, 3, "♞", "grey"], [1, 0, "♞", "grey"], [1, 4, "♞", "grey"], [3, 0, "♞", "grey"], [3, 4, "♞", "grey"], [4, 1, "♞", "grey"], [4, 3, "♞", "grey"]], "marks": [[0, 1, "blue"], [0, 3, "blue"], [1, 0, "blue"], [1, 4, "blue"], [3, 0, "blue"], [3, 4, "blue"], [4, 1, "blue"], [4, 3, "blue"]]}
:::

Als (Δzeile, Δspalte): (2, 1), (1, 2), (−1, 2), (−2, 1), (−2, −1), (−1, −2), (1, −2), (2, −1). Auf 5×5 gibt es von einer Ecke aus eine Tour. Auf 8×8 kann einfaches Backtracking sehr lange dauern, deshalb schlägt dein Arbeitsblatt 5×5 oder 6×6 vor. Eine **geschlossene** Tour (Teilaufgabe b) verlangt zusätzlich, dass das letzte Feld einen Springerzug vom ersten entfernt ist.

## [bridge] Vom Schema zu Python

:::bridge title="Damenproblem: alle Lösungen"
methode SpalteBelegen(spalte)                 || def spalte_belegen(n, damen):
    falls spalte == n dann                     ||     if len(damen) == n:
        Lösung zählen                          ||         return 1
    für zeile von 0 bis n-1                    ||     anzahl = 0
                                               ||     for zeile in range(n):
        falls (zeile, spalte) nicht bedroht    ||         if ist_sicher(damen, zeile):
            Dame eintragen                     ||             damen.append(zeile)
            SpalteBelegen(spalte + 1)          ||             anzahl += spalte_belegen(n, damen)
            Dame austragen                     ||             damen.pop()
        endefalls                              ||
    endefür                                    ||     return anzahl
endemethode                                    ||
>> Die aktuelle Stufe (die Spalte) ist `len(damen)`: Die Liste wächst mit jeder gesetzten Dame um eins. `append` ist *eintragen*, `pop` ist *austragen*. Statt auszugeben **gibt jeder Aufruf zurück, wie viele Lösungen** er unter sich gefunden hat, und der Aufrufer zählt sie zusammen.
:::

:::bridge title="Variante: bei der ersten Lösung anhalten"
methode Belegen(spalte) -> WAHRHEITSWERT  || def belegen(n, damen):
    falls spalte == n dann return wahr    ||     if len(damen) == n:
                                          ||         return True
    für zeile von 0 bis n-1               ||     for zeile in range(n):
        falls nicht bedroht dann          ||         if ist_sicher(damen, zeile):
            eintragen                     ||             damen.append(zeile)
            falls Belegen(spalte + 1) dann||             if belegen(n, damen):
                return wahr               ||                 return True
            austragen                     ||             damen.pop()
    return falsch                         ||     return False
>> Meldet ein tieferer Aufruf Erfolg, werden die Damen **nicht** zurückgenommen, die Liste `damen` enthält danach also die Lösung. Jeder Rahmen reicht das `True` direkt nach oben weiter.
:::

## [python] Backtracking in Python

Typische Zutaten:

- **Zustand** in einer Liste (oder 2D-Liste), die wächst und schrumpft: `append`/`pop`, oder ein Feld setzen und zurücksetzen.
- Eine Hilfsfunktion **ist zulässig?**, die die Regeln am aktuellen Zustand prüft.
- Die rekursive Funktion für eine Stufe, mit einer `for`-Schleife über die Möglichkeiten.
- Beim Sudoku: **Kopien** des Zustands (`[[list(zelle) for zelle in zeile] for zeile in feld]` kopiert jede Kandidatenliste), weil die Änderungen zu verstreut sind, um sie einzeln rückgängig zu machen.

:::trace title="Alle Anordnungen von drei Buchstaben: das einfachste Backtracking"
def anordnungen(rest, aktuell, ergebnis):
    if len(rest) == 0:
        ergebnis.append(list(aktuell))
        return
    for x in list(rest):
        aktuell.append(x)
        rest.remove(x)
        anordnungen(rest, aktuell, ergebnis)
        rest.append(x)
        aktuell.pop()


alle = []
anordnungen(["A", "B", "C"], [], alle)
print(alle)
:::

Achte auf `ergebnis.append(list(aktuell))`: Es wird eine **Kopie** des aktuellen Zustands gespeichert, weil sich `aktuell` danach weiter ändert (Lektion A6).

## [python] Python-Blöcke

:::exercise id=b2-perm title="Aufwärmen: alle Anordnungen" level=1
Vervollständige `anordnungen(rest, aktuell, ergebnis)` aus dem Schritt-für-Schritt-Beispiel oben selbst, ohne hinzuschauen. Die Funktion speichert jede Anordnung der Elemente in `rest` als Liste in `ergebnis`.

Regeln: Stufe = nächste Position; Möglichkeiten = jedes Element, das noch in `rest` ist; eintragen = `aktuell.append(x)` und `rest.remove(x)`; austragen = beides rückgängig machen.
--- starter
def anordnungen(rest, aktuell, ergebnis):
    if len(rest) == 0:
        # eine vollständige Anordnung: eine Kopie speichern
        return
    for x in list(rest):
        pass


alle = []
anordnungen(["A", "B", "C"], [], alle)
print(alle)
--- solution
def anordnungen(rest, aktuell, ergebnis):
    if len(rest) == 0:
        ergebnis.append(list(aktuell))
        return
    for x in list(rest):
        aktuell.append(x)
        rest.remove(x)
        anordnungen(rest, aktuell, ergebnis)
        rest.append(x)
        aktuell.pop()


alle = []
anordnungen(["A", "B", "C"], [], alle)
print(alle)
--- tests
@test("Alle 6 Anordnungen von A, B, C")
def _():
    e = []
    anordnungen(["A", "B", "C"], [], e)
    eq(sorted(e), [["A", "B", "C"], ["A", "C", "B"], ["B", "A", "C"], ["B", "C", "A"], ["C", "A", "B"], ["C", "B", "A"]], "sortiertes Ergebnis")

@test("4 Elemente ergeben 24 verschiedene Anordnungen")
def _():
    e = []
    anordnungen([1, 2, 3, 4], [], e)
    eq(len(e), 24, "Anzahl der Anordnungen")
    eq(len(set(tuple(x) for x in e)), 24, "Anzahl verschiedener Anordnungen")

@test("Die Eingabeliste ist danach wiederhergestellt")
def _():
    r = ["X", "Y"]
    anordnungen(r, [], [])
    eq(sorted(r), ["X", "Y"], "rest nach der Suche")
--- hint
In der Schleife: eintragen (zwei Zeilen), rekursiver Aufruf, austragen (zwei Zeilen, in umgekehrter Reihenfolge).
--- hint
Beim Rekursionsende `ergebnis.append(list(aktuell))`. Ohne `list(...)` wären alle gespeicherten Einträge dieselbe Liste, und die ist am Ende leer.
--- explain
Jeder Aufruf ist für eine Position zuständig. Weil jede Wahl nach dem rekursiven Aufruf rückgängig gemacht wird, beginnt der nächste Schleifendurchlauf mit genau demselben Zustand: die Kernregel des Backtrackings.
:::

:::exercise id=b2-safe title="Ist das Feld bedroht?" level=1
Schreib `ist_sicher(damen, zeile)`. `damen[s]` ist die Zeile der Dame in Spalte `s`; die neue Dame käme in Spalte `len(damen)` und Zeile `zeile`. Gib `True` zurück, wenn keine vorhandene Dame dieses Feld bedroht (gleiche Zeile oder gleiche Diagonale).
--- starter
def ist_sicher(damen, zeile):
    spalte = len(damen)
    pass
--- solution
def ist_sicher(damen, zeile):
    spalte = len(damen)
    for s in range(spalte):
        z = damen[s]
        if z == zeile or abs(z - zeile) == spalte - s:
            return False
    return True
--- tests
@test("Leeres Brett: jedes Feld ist sicher")
def _():
    ok(all(ist_sicher([], z) for z in range(8)), "ist_sicher([], z) muss True sein")

@test("Gleiche Zeile ist bedroht")
def _():
    eq(ist_sicher([1], 1), False, "ist_sicher([1], 1)")

@test("Diagonalen sind bedroht")
def _():
    eq(ist_sicher([1], 0), False, "ist_sicher([1], 0)")
    eq(ist_sicher([1], 2), False, "ist_sicher([1], 2)")
    eq(ist_sicher([0, 3], 2), False, "ist_sicher([0, 3], 2)")
    eq(ist_sicher([3, 1], 1), False, "ist_sicher([3, 1], 1) (Zeile)")

@test("Sichere Felder")
def _():
    eq(ist_sicher([1], 3), True, "ist_sicher([1], 3)")
    eq(ist_sicher([1, 3], 0), True, "ist_sicher([1, 3], 0)")
    eq(ist_sicher([0, 2], 4), True, "ist_sicher([0, 2], 4)")
--- hint
Durchlauf alle vorhandenen Damen `s`. Zwei Felder liegen auf derselben Diagonale, wenn sie so viele Zeilen auseinanderliegen wie Spalten: `abs(z - zeile) == spalte - s`.
--- explain
Sobald eine Dame das Feld bedroht, steht die Antwort fest: `return False` in der Schleife. Erst nach der Prüfung aller Damen darf die Funktion `True` zurückgeben.
:::

:::exercise id=b2-queens title="Damenproblem: alle Lösungen zählen" level=2
Schreib `anzahl_loesungen(n)`, das mit Backtracking alle Lösungen des n-Damen-Problems zählt. `ist_sicher` ist gegeben. Verwende eine rekursive Hilfsfunktion `belegen(n, damen)`, siehe Brücke-Abschnitt.

Kontrollwerte: n = 4 → 2, n = 5 → 10, n = 6 → 4, n = 8 → 92.
--- starter
def ist_sicher(damen, zeile):
    spalte = len(damen)
    for s in range(spalte):
        z = damen[s]
        if z == zeile or abs(z - zeile) == spalte - s:
            return False
    return True


def belegen(n, damen):
    pass


def anzahl_loesungen(n):
    return belegen(n, [])


print(anzahl_loesungen(4))
--- solution
def ist_sicher(damen, zeile):
    spalte = len(damen)
    for s in range(spalte):
        z = damen[s]
        if z == zeile or abs(z - zeile) == spalte - s:
            return False
    return True


def belegen(n, damen):
    if len(damen) == n:
        return 1
    anzahl = 0
    for zeile in range(n):
        if ist_sicher(damen, zeile):
            damen.append(zeile)
            anzahl = anzahl + belegen(n, damen)
            damen.pop()
    return anzahl


def anzahl_loesungen(n):
    return belegen(n, [])


print(anzahl_loesungen(4))
--- tests
@test("n = 4 → 2 Lösungen")
def _():
    eq(anzahl_loesungen(4), 2, "anzahl_loesungen(4)")

@test("n = 1 → 1, n = 2 → 0, n = 3 → 0")
def _():
    eq((anzahl_loesungen(1), anzahl_loesungen(2), anzahl_loesungen(3)), (1, 0, 0), "(n=1, n=2, n=3)")

@test("n = 5 → 10, n = 6 → 4")
def _():
    eq((anzahl_loesungen(5), anzahl_loesungen(6)), (10, 4), "(n=5, n=6)")

@test("n = 8 → 92")
def _():
    eq(anzahl_loesungen(8), 92, "anzahl_loesungen(8)")
--- hint
Rekursionsende: Alle n Spalten sind belegt (`len(damen) == n`) → das ist eine Lösung.
--- hint
Sonst probier jede Zeile: wenn sicher, `append`, die Lösungen des tieferen Aufrufs zu einem Zähler addieren, dann `pop`.
--- explain
Jeder Aufruf gibt die Zahl der Lösungen in seinem Teilbaum zurück; die Zahlen werden auf dem Rückweg (Aufstieg) addiert. Das `pop()` nach dem rekursiven Aufruf ist das *Zurücknehmen*.
:::

:::exercise id=b2-first title="Damenproblem: die erste Lösung" level=2
Schreib `erste_loesung(n)`, das die **erste** Lösung als Liste zurückgibt (z. B. `[1, 3, 0, 2]` für n = 4), oder `None`, wenn es keine gibt. Die Suche muss aufhören, sobald eine Lösung gefunden ist (siehe zweite Brücke).
--- starter
def ist_sicher(damen, zeile):
    spalte = len(damen)
    for s in range(spalte):
        z = damen[s]
        if z == zeile or abs(z - zeile) == spalte - s:
            return False
    return True


def belegen(n, damen):
    pass


def erste_loesung(n):
    damen = []
    if belegen(n, damen):
        return damen
    return None
--- solution
def ist_sicher(damen, zeile):
    spalte = len(damen)
    for s in range(spalte):
        z = damen[s]
        if z == zeile or abs(z - zeile) == spalte - s:
            return False
    return True


def belegen(n, damen):
    if len(damen) == n:
        return True
    for zeile in range(n):
        if ist_sicher(damen, zeile):
            damen.append(zeile)
            if belegen(n, damen):
                return True
            damen.pop()
    return False


def erste_loesung(n):
    damen = []
    if belegen(n, damen):
        return damen
    return None
--- tests
def valid(sol, n):
    if sol is None or len(sol) != n:
        return False
    for a in range(n):
        for b in range(a + 1, n):
            if sol[a] == sol[b] or abs(sol[a] - sol[b]) == b - a:
                return False
    return True

@test("n = 4 → [1, 3, 0, 2]")
def _():
    eq(erste_loesung(4), [1, 3, 0, 2], "erste_loesung(4)")

@test("n = 8 ergibt eine gültige Lösung: [0, 4, 7, 5, 2, 6, 1, 3]")
def _():
    s = erste_loesung(8)
    ok(valid(s, 8), f"keine gültige Lösung: {s}")
    eq(s, [0, 4, 7, 5, 2, 6, 1, 3], "erste_loesung(8)")

@test("n = 3 → None")
def _():
    eq(erste_loesung(3), None, "erste_loesung(3)")
--- hint
`belegen` gibt `True` oder `False` zurück. Wenn der rekursive Aufruf `True` liefert, gib sofort `True` zurück, **ohne** `pop()`.
--- explain
Weil die Damen nach einem Erfolg nicht entfernt werden, enthält die Liste `damen` die Lösung, wenn die Rekursion endet. Die erste Lösung ist nach viel weniger Schritten gefunden als bei der vollständigen Suche.
:::

:::exercise id=b2-knapsack title="Rucksackproblem: die beste Auswahl" level=2
Schreib `bester_wert(gewichte, werte, max_gewicht)`, das den höchsten Gesamtwert zurückgibt, der in den Rucksack passt. Verwende Backtracking mit einer rekursiven Hilfsfunktion `waehlen(i, gewicht, wert)`, die für Gegenstand `i` entscheidet (nehmen / liegen lassen) und den besten von dort aus erreichbaren Gesamtwert zurückgibt. Schneide zu schwere Zweige ab.

Beispiel aus dem Arbeitsblatt: Gewichte `[5, 7, 4, 3]`, Werte `[40, 35, 12, 30]`, höchstens 10 kg → **70**.
--- starter
def bester_wert(gewichte, werte, max_gewicht):

    def waehlen(i, gewicht, wert):
        # i: Nummer des nächsten Gegenstands, über den entschieden wird
        # gewicht, wert: Summen der bisher genommenen Gegenstände
        pass

    return waehlen(0, 0, 0)


print(bester_wert([5, 7, 4, 3], [40, 35, 12, 30], 10))
--- solution
def bester_wert(gewichte, werte, max_gewicht):

    def waehlen(i, gewicht, wert):
        if i == len(gewichte):
            return wert
        bester = waehlen(i + 1, gewicht, wert)
        if gewicht + gewichte[i] <= max_gewicht:
            mit = waehlen(i + 1, gewicht + gewichte[i], wert + werte[i])
            if mit > bester:
                bester = mit
        return bester

    return waehlen(0, 0, 0)


print(bester_wert([5, 7, 4, 3], [40, 35, 12, 30], 10))
--- tests
@test("Beispiel aus dem Arbeitsblatt → 70")
def _():
    eq(bester_wert([5, 7, 4, 3], [40, 35, 12, 30], 10), 70, "bester_wert(...)")

@test("Nichts passt → 0")
def _():
    eq(bester_wert([5, 7], [10, 20], 4), 0, "bester_wert([5, 7], [10, 20], 4)")

@test("Alles passt")
def _():
    eq(bester_wert([1, 2, 3], [5, 5, 5], 10), 15, "bester_wert([1, 2, 3], [5, 5, 5], 10)")

@test("Eine gierige Auswahl reicht nicht")
def _():
    eq(bester_wert([6, 5, 5], [60, 50, 50], 10), 100, "bester_wert([6, 5, 5], [60, 50, 50], 10)")
    eq(bester_wert([2, 3, 4, 5, 9], [3, 4, 5, 8, 10], 20), 26, "fünf Gegenstände, höchstens 20")
--- hint
Rekursionsende: Über alle Gegenstände ist entschieden (`i == len(gewichte)`) → der bisher gesammelte Wert.
--- hint
Zwei Zweige: *ohne* Gegenstand i (immer zulässig) und *mit* Gegenstand i (nur, wenn er noch passt). Gib das größere Ergebnis zurück.
--- explain
Die Funktion ist innerhalb von `bester_wert` definiert und kann deshalb `gewichte`, `werte` und `max_gewicht` direkt lesen. Jeder Aufruf hat zwei Möglichkeiten, der Entscheidungsbaum ist also binär, und das `if` schneidet jeden Zweig ab, der zu schwer würde.
:::

:::exercise id=b2-sudoku title="Sudoku: Teilaufgaben a, b, c" level=3
Vervollständige die Sudoku-Klasse aus deiner Vorlage (`SchrittAusführen` und `Kopieren` sind gegeben):

- **a)** `__init__`: Erzeuge `self.feld` als 9×9-Feld, dessen Elemente Listen `[1, 2, …, 9]` sind (jedes Element eine eigene Liste!).
- **b)** `FeldelementFixieren(zeile, spalte, wert)`: Entferne `wert` aus der Zeile, der Spalte und dem 3×3-Block, setze dann das Element auf `[wert]`.
- **c)** `FeldAusgeben()`: Gib das Feld aus, eine Zeile pro Reihe, den Wert, wenn er feststeht, sonst `-`, durch Leerzeichen getrennt.

Die Prüfungen testen jeden Teil und lassen am Ende `SchrittAusführen` ein fast vollständiges Sudoku lösen.
--- starter
class Sudoku:
    def __init__(self):
        self.feld = []
        self.loesungen = 0

    def Kopieren(self, original):
        return [[list(zelle) for zelle in zeile] for zeile in original]

    def FeldelementFixieren(self, zeile, spalte, wert):
        pass

    def FeldAusgeben(self):
        pass

    def SchrittAusführen(self, aktuelleZeile, aktuelleSpalte):
        startFeld = self.Kopieren(self.feld)
        for wert in startFeld[aktuelleZeile][aktuelleSpalte]:
            self.FeldelementFixieren(aktuelleZeile, aktuelleSpalte, wert)
            if aktuelleZeile == 8 and aktuelleSpalte == 8:
                self.loesungen += 1
                self.FeldAusgeben()
            else:
                zeile, spalte = aktuelleZeile, aktuelleSpalte + 1
                if spalte > 8:
                    spalte = 0
                    zeile += 1
                self.SchrittAusführen(zeile, spalte)
            self.feld = self.Kopieren(startFeld)


s = Sudoku()
s.FeldelementFixieren(0, 2, 2)
s.FeldAusgeben()
--- solution
class Sudoku:
    def __init__(self):
        self.feld = [[list(range(1, 10)) for spalte in range(9)] for zeile in range(9)]
        self.loesungen = 0

    def Kopieren(self, original):
        return [[list(zelle) for zelle in zeile] for zeile in original]

    def FeldelementFixieren(self, zeile, spalte, wert):
        for i in range(9):
            if wert in self.feld[zeile][i]:
                self.feld[zeile][i].remove(wert)
            if wert in self.feld[i][spalte]:
                self.feld[i][spalte].remove(wert)
        z0 = zeile // 3 * 3
        s0 = spalte // 3 * 3
        for z in range(z0, z0 + 3):
            for sp in range(s0, s0 + 3):
                if wert in self.feld[z][sp]:
                    self.feld[z][sp].remove(wert)
        self.feld[zeile][spalte] = [wert]

    def FeldAusgeben(self):
        for zeile in range(9):
            teile = []
            for spalte in range(9):
                if len(self.feld[zeile][spalte]) == 1:
                    teile.append(str(self.feld[zeile][spalte][0]))
                else:
                    teile.append("-")
            print(" ".join(teile))

    def SchrittAusführen(self, aktuelleZeile, aktuelleSpalte):
        startFeld = self.Kopieren(self.feld)
        for wert in startFeld[aktuelleZeile][aktuelleSpalte]:
            self.FeldelementFixieren(aktuelleZeile, aktuelleSpalte, wert)
            if aktuelleZeile == 8 and aktuelleSpalte == 8:
                self.loesungen += 1
                self.FeldAusgeben()
            else:
                zeile, spalte = aktuelleZeile, aktuelleSpalte + 1
                if spalte > 8:
                    spalte = 0
                    zeile += 1
                self.SchrittAusführen(zeile, spalte)
            self.feld = self.Kopieren(startFeld)


s = Sudoku()
s.FeldelementFixieren(0, 2, 2)
s.FeldAusgeben()
--- tests
LOES = [[8,3,2,4,5,9,6,1,7],[6,7,1,8,3,2,5,4,9],[4,5,9,1,6,7,2,8,3],[7,1,4,3,2,6,8,9,5],[5,9,8,7,1,4,3,6,2],[3,2,6,9,8,5,4,7,1],[2,8,5,6,9,1,7,3,4],[9,6,7,2,4,3,1,5,8],[1,4,3,5,7,8,9,2,6]]

@test("a) 9×9-Feld, jedes Element [1..9]")
def _():
    s = Sudoku()
    eq(len(s.feld), 9, "Anzahl der Zeilen")
    ok(all(len(r) == 9 for r in s.feld), "jede Zeile braucht 9 Elemente")
    ok(all(c == list(range(1, 10)) for r in s.feld for c in r), "jedes Element muss [1, 2, ..., 9] sein")

@test("a) Die Elemente sind unabhängige Listen")
def _():
    s = Sudoku()
    s.feld[0][0].remove(5)
    ok(5 in s.feld[0][1] and 5 in s.feld[1][0], "Die Änderung eines Elements darf keine anderen ändern.")

@test("b) FeldelementFixieren(4, 4, 7)")
def _():
    s = Sudoku()
    s.FeldelementFixieren(4, 4, 7)
    eq(s.feld[4][4], [7], "feld[4][4]")
    ok(7 not in s.feld[4][0] and 7 not in s.feld[4][8], "7 muss aus Zeile 4 entfernt werden")
    ok(7 not in s.feld[0][4] and 7 not in s.feld[8][4], "7 muss aus Spalte 4 entfernt werden")
    ok(7 not in s.feld[3][3] and 7 not in s.feld[5][5], "7 muss aus dem 3×3-Block entfernt werden")
    ok(7 in s.feld[0][0] and 7 in s.feld[3][0], "andere Zellen müssen die 7 behalten")

@test("c) FeldAusgeben")
def _():
    s = Sudoku()
    s.FeldelementFixieren(0, 2, 2)
    out = lines(printed(s.FeldAusgeben))
    eq(len(out), 9, "Anzahl der ausgegebenen Zeilen")
    eq(out[0], "- - 2 - - - - - -", "erste Zeile")
    eq(out[8], "- - - - - - - - -", "letzte Zeile")

@test("SchrittAusführen löst ein fast vollständiges Sudoku")
def _():
    s = Sudoku()
    leer = {(0, 0), (1, 4), (2, 7), (4, 4), (4, 2), (6, 6), (7, 1), (8, 8), (5, 3), (3, 6)}
    for z in range(9):
        for sp in range(9):
            if (z, sp) not in leer:
                s.FeldelementFixieren(z, sp, LOES[z][sp])
    out = printed(lambda: s.SchrittAusführen(0, 0))
    eq(s.loesungen, 1, "Anzahl der Lösungen")
    eq(lines(out), [" ".join(str(v) for v in r) for r in LOES], "ausgegebene Lösung")
--- hint
a) Eine verschachtelte List Comprehension erzeugt unabhängige Listen: `[[list(range(1, 10)) for spalte in range(9)] for zeile in range(9)]`.
--- hint
b) Prüf vor `remove` mit `if wert in ...`, sonst löst `remove` bei Elementen, die den Wert nicht enthalten, einen ValueError aus.
--- hint
c) Sammle die 9 Teile einer Zeile in einer Liste und gib sie mit `" ".join(teile)` aus.
--- explain
Durch die Kandidatenlisten werden die Sudoku-Regeln Teil der Daten: Nach dem Fixieren eines Werts bieten ihn seine Nachbarn einfach nicht mehr an. `SchrittAusführen` probiert dann nur noch Werte, die noch möglich sind, und eine leere Kandidatenliste beendet einen Zweig automatisch.
:::

:::exercise id=b2-knight title="Rösselsprung auf 5×5" level=3
Schreib `tour(n, brett, zeile, spalte, nummer)`: Der Springer springt als Zug `nummer` auf (zeile, spalte). Trag `nummer` auf dem Brett ein, gib `True` zurück, wenn alle n·n Felder nummeriert sind, sonst probier die 8 Züge in der Reihenfolge von `ZUEGE`. Führt keiner zu einer Lösung, nimm das Feld zurück (setz es auf 0) und gib `False` zurück.

`springer(n, zeile, spalte)` (gegeben) erzeugt das Brett und startet die Tour; es gibt das nummerierte Brett oder `None` zurück.
--- starter
ZUEGE = [(2, 1), (1, 2), (-1, 2), (-2, 1), (-2, -1), (-1, -2), (1, -2), (2, -1)]


def tour(n, brett, zeile, spalte, nummer):
    pass


def springer(n, zeile, spalte):
    brett = [[0] * n for i in range(n)]
    if tour(n, brett, zeile, spalte, 1):
        return brett
    return None


b = springer(5, 0, 0)
if b is not None:
    for reihe in b:
        print(reihe)
--- solution
ZUEGE = [(2, 1), (1, 2), (-1, 2), (-2, 1), (-2, -1), (-1, -2), (1, -2), (2, -1)]


def tour(n, brett, zeile, spalte, nummer):
    brett[zeile][spalte] = nummer
    if nummer == n * n:
        return True
    for dz, ds in ZUEGE:
        z = zeile + dz
        s = spalte + ds
        if 0 <= z < n and 0 <= s < n and brett[z][s] == 0:
            if tour(n, brett, z, s, nummer + 1):
                return True
    brett[zeile][spalte] = 0
    return False


def springer(n, zeile, spalte):
    brett = [[0] * n for i in range(n)]
    if tour(n, brett, zeile, spalte, 1):
        return brett
    return None


b = springer(5, 0, 0)
if b is not None:
    for reihe in b:
        print(reihe)
--- tests
def check_tour(b, n):
    pos = {}
    for z in range(n):
        for s in range(n):
            pos[b[z][s]] = (z, s)
    ok(sorted(pos) == list(range(1, n * n + 1)), "jedes Feld muss genau eine Zahl 1 .. n·n bekommen")
    for k in range(1, n * n):
        (z1, s1), (z2, s2) = pos[k], pos[k + 1]
        ok(sorted([abs(z1 - z2), abs(s1 - s2)]) == [1, 2], f"Schritt {k} → {k + 1} ist kein Springerzug")

@test("5×5 ab (0, 0) ergibt eine vollständige Tour")
def _():
    b = springer(5, 0, 0)
    ok(b is not None, "springer(5, 0, 0) hat None zurückgegeben")
    check_tour(b, 5)
    eq(b[0][0], 1, "Startfeld")

@test("Auf 4×4 gibt es keine Tour")
def _():
    eq(springer(4, 0, 0), None, "springer(4, 0, 0)")

@test("3×3 hat keine Tour")
def _():
    eq(springer(3, 0, 0), None, "springer(3, 0, 0)")
--- hint
Die Reihenfolge in `tour`: Nummer eintragen, prüfen, ob das Brett voll ist, die 8 Nachbarn probieren (auf dem Brett und noch 0), zurücknehmen, wenn nichts geklappt hat.
--- hint
`0 <= z < n` prüft, ob die neue Zeile auf dem Brett liegt.
--- explain
Der Rösselsprung ist Backtracking auf einem Graphen, dessen Knoten die Felder und dessen Kanten die Springerzüge sind. Auf 5×5 ist eine Tour von einer Ecke aus nach ein paar tausend Versuchen gefunden. Auf 4×4 beweist die vollständige Suche, dass es überhaupt keine Tour gibt.
:::

## [exam] Klausurtraining

:::exam title="Damenproblem von Hand" points=5
Finde mit Backtracking (Spalte für Spalte, Zeilen von oben nach unten) die **erste** Lösung auf einem 4×4-Brett. Schreib die Folge der Setz- und Rücknahmeschritte auf, bis die Lösung gefunden ist.
--- solution
- Spalte 0: Zeile 0 ✓
- Spalte 1: Zeilen 0, 1 bedroht; Zeile 2 ✓
- Spalte 2: Zeilen 0–3 alle bedroht → zurück: (2, 1) entfernen
- Spalte 1: Zeile 3 ✓
- Spalte 2: Zeile 0 bedroht, Zeile 1 ✓
- Spalte 3: Zeilen 0–3 bedroht → zurück: (1, 2) entfernen; Spalte 2: Zeilen 2, 3 bedroht → zurück: (3, 1) entfernen; Spalte 1 hat keine Zeile mehr → zurück: (0, 0) entfernen
- Spalte 0: Zeile 1 ✓; Spalte 1: Zeile 3 ✓; Spalte 2: Zeile 0 ✓; Spalte 3: Zeile 2 ✓ → **Lösung [1, 3, 0, 2]**
:::

:::exam title="Rucksackproblem (12_I_2_Rucksackproblem)" points=4
Löse das Problem aus dem Arbeitsblatt mit Papier und Bleistift: höchstens 10 kg, Gegenstände (kg / MJ): 0: 5/40, 1: 7/35, 2: 4/12, 3: 3/30. Zeichne den Entscheidungsbaum und markiere die abgeschnittenen Zweige.
--- solution
Alle zulässigen vollständigen Auswahlen: {} 0 MJ, {3} 30, {2} 12, {2,3} 42 (7 kg), {1} 35, {1,3} 65 (10 kg), {0} 40, {0,3} 70 (8 kg), {0,2} 52 (9 kg). Abgeschnitten, weil zu schwer: {0,1} (12 kg), {0,2,3} (12 kg), {1,2} (11 kg). **Am besten: Gegenstände 0 und 3, 8 kg, 70 MJ.** (Der interaktive Baum oben zeigt den vollständigen Entscheidungsbaum.)
:::

:::exam title="Die Rolle des Zurücknehmens" points=3
Beim Damenproblem wird eine Dame nach dem rekursiven Aufruf wieder entfernt (`damen.pop()`), beim Sudoku wird die Kopie `startFeld` wiederhergestellt. Erkläre, warum dieser Schritt nötig ist und was ohne ihn passieren würde.
--- solution
Nach der Rückkehr aus der tieferen Stufe muss die nächste Möglichkeit der *aktuellen* Stufe mit demselben Zustand probiert werden wie vor dem ersten Versuch. Ohne Zurücknehmen blieben die Damen / fixierten Werte des gescheiterten Versuchs auf dem Brett: Spätere Versuche würden gegen falsche Daten geprüft, Lösungen würden übersehen, und der Zustand würde über das Brett hinauswachsen (mehr Damen als Spalten). Das Zurücknehmen stellt genau die Situation der aktuellen Stufe wieder her; nur so ist die systematische Suche vollständig.
:::
