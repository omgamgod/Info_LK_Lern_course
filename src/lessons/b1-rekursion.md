---
id: b1
num: B1
part: B
title: Das Konzept der Rekursion
short: Rekursion Konzept
lead: Eine Methode, die sich selbst aufruft, klingt nach einem Trick, ist aber der natürlichste Weg, Probleme zu lösen, die eine kleinere Kopie ihrer selbst enthalten. Diese Lektion behandelt die Idee, die drei Teile jeder Rekursion, was der Computer auf dem Aufrufstapel tut, die Arten der Rekursion und die klassischen Beispiele deines Kurses (ggT, Türme von Hanoi, Levy-C-Kurve).
minutes: 90
uses: [a5, a4, a1]
goals:
  - <b>Rekursionsschritt</b>, <b>Rekursionsende</b> und <b>Abbruchbedingung</b> für jede rekursive Methode erklären
  - eine Rekursion auf dem Aufrufstapel nachvollziehen (Abstieg und Aufstieg) und ihren Aufrufbaum zeichnen
  - <b>linear rekursiv</b>, <b>endrekursiv</b> und baumartige (mehrfache) Rekursion unterscheiden
  - Rekursion und Iteration vergleichen
  - rekursive Funktionen in Python schreiben, auch GGTBerechnen und TurmVerschieben
---

## [logic] Ein Problem, das sich selbst enthält

Du stehst irgendwo in einer langen Schlange in der Mensa und willst wissen, an welcher Stelle du stehst, kannst aber nur mit der Person direkt vor dir reden. Lösung: Du fragst sie *„An welcher Stelle stehst du?“* Sie weiß es auch nicht und fragt deshalb die Person vor *ihr*, und so weiter. Schließlich antwortet die allererste Person *„1, vor mir ist niemand.“* Jetzt wandern die Antworten zurück: Die zweite Person sagt 2, die dritte 3, … bis die Antwort bei dir ankommt.

Das ist **Rekursion**: Ein Problem wird gelöst, indem man eine **kleinere Version desselben Problems** weitergibt, bis eine Version erreicht ist, die so einfach ist, dass man sie direkt beantworten kann. Dann werden die Teilantworten auf dem Rückweg zusammengesetzt.

In der Mathematik definiert man Dinge schon lange so. Die Fakultät:

> **n! = n · (n − 1)!**   und   **0! = 1**

Um 4! zu berechnen, brauchst du 3!; dafür brauchst du 2!; dann 1!; dann 0!, und das ist einfach 1. Als Pseudocode in der Notation deines Kurses:

```pseudo
methode Fakultät(n: GANZZAHL) -> GANZZAHL
    falls n == 0 dann
        return 1
    sonst
        return n * Fakultät(n - 1)
    endefalls
endemethode
```

Eine Methode, die **sich selbst** aufruft, heißt **rekursiv**.

## [logic] Die drei Teile jeder Rekursion

Dein Einstieg (12_I_1_Einstieg) stellt drei Fragen. Jede korrekte Rekursion beantwortet alle drei:

| Frage | Name | Bei der Fakultät |
|---|---|---|
| Wie lässt sich das Problem auf ein **kleineres Problem derselben Art** zurückführen? | **Rekursionsschritt** | n! = n · (n−1)!, also `Fakultät(n − 1)` aufrufen |
| Welcher Fall ist so einfach, dass er **direkt gelöst** wird, ohne weiteren Aufruf? | **Rekursionsende** | `n == 0` → Ergebnis 1 |
| Ist **garantiert**, dass das Rekursionsende erreicht wird? | **Abbruchbedingung** | n wird bei jedem Aufruf um 1 kleiner und muss deshalb 0 erreichen (für n ≥ 0) |

Jede rekursive Methode hat also diese Form:

```pseudo
methode Löse(problem)
    falls problem ist einfach dann          // Abbruchbedingung erfüllt
        return direkte Lösung                // Rekursionsende
    sonst
        teil = Löse(kleineres problem)      // Rekursionsschritt
        return Lösung aus teil zusammengesetzt
    endefalls
endemethode
```

:::key
**Rekursionsende zuerst.** Schreib das `falls … dann return …` für den einfachsten Fall, bevor du über den rekursiven Aufruf nachdenkst. Dann vertrau der Rekursion: Nimm an, dass der Aufruf für das kleinere Problem schon die richtige Antwort liefert, und frag dich nur noch: *„Wie bekomme ich daraus meine Antwort?“*
:::

Weitere Beispiele nach demselben Muster:

| Methode | Rekursionsende | Rekursionsschritt |
|---|---|---|
| `Summe(n)` = 1 + 2 + … + n | `n == 0` → 0 | `n + Summe(n − 1)` |
| `Potenz(b, e)` = b^e | `e == 0` → 1 | `b * Potenz(b, e − 1)` |
| `Quersumme(n)` | `n < 10` → n | `n % 10 + Quersumme(n // 10)` |
| `GGTBerechnen(a, b)` | `b == 0` → a | `GGTBerechnen(b, a % b)` |
| Länge einer Schlange („meine Position“) | erste Person → 1 | 1 + Position der Person davor |

## [logic] Was der Computer tut: Abstieg und Aufstieg

Lektion A5 hat gezeigt, dass jeder Aufruf seinen eigenen **Rahmen** auf dem Aufrufstapel bekommt. Rekursion nutzt genau diesen Mechanismus: `Fakultät(4)` liegt auf dem Stapel und wartet, während `Fakultät(3)` in einem neuen Rahmen darüber läuft, der auf `Fakultät(2)` wartet, und so weiter.

- **Abstieg**: Die Aufrufe gehen immer tiefer. Jeder Rahmen hält bei seinem rekursiven Aufruf an und wartet. Noch wird nichts berechnet.
- Beim **Rekursionsende** kann der oberste Rahmen direkt antworten.
- **Aufstieg**: Die Rahmen werden einer nach dem anderen entfernt. Jeder bekommt die Antwort des Rahmens darüber, beendet seine eigene Rechnung und gibt zurück.

Geh es Schritt für Schritt durch und beobachte den Stapel rechts:

:::viz recstack
{"fn": "fak", "n": 4, "title": "Fakultät(4) auf dem Aufrufstapel"}
:::

Dieselbe Rechnung als **Aufrufbaum**: Jedes Kästchen ist ein Aufruf, die Pfeile sind die Aufrufe, und die grünen Zahlen sind die Ergebnisse, die nach oben zurückwandern.

:::diagram calltree caption="Aufrufbaum von Fakultät(3)"
Fakultät(3) => 3 · 2 = 6
  Fakultät(2) => 2 · 1 = 2
    Fakultät(1) => 1 · 1 = 1
      Fakultät(0) => 1 {green}
:::

In einer Zeile geschrieben baut der Abstieg einen Ausdruck auf, den der Aufstieg auswertet:

```out
Fakultät(4) = 4 · Fakultät(3)
            = 4 · (3 · Fakultät(2))
            = 4 · (3 · (2 · Fakultät(1)))
            = 4 · (3 · (2 · (1 · Fakultät(0))))
            = 4 · (3 · (2 · (1 · 1)))            ← Rekursionsende
            = 24
```

:::quiz
Wie viele Rahmen von `Fakultät` liegen am tiefsten Punkt von `Fakultät(4)` gleichzeitig auf dem Aufrufstapel?
- [ ] 1
- [ ] 4
- [x] 5
- [ ] 24
--- explain
Fakultät(4), (3), (2), (1) und (0) sind alle gleichzeitig aktiv: Die ersten vier warten, Fakultät(0) antwortet gerade. Das sind n + 1 Rahmen. Das ist der Speicherbedarf der Rekursion.
:::

## [logic] Rekursion oder Iteration?

Jedes Problem, das du mit dieser Art von Rekursion lösen kannst, lässt sich auch mit einer Schleife (iterativ) lösen und umgekehrt. In A5 hast du `fakultaet` mit einer `for`-Schleife geschrieben.

| | Iterativ (Schleife) | Rekursiv |
|---|---|---|
| Idee | einen Schritt wiederholen und Variablen aktualisieren | auf eine kleinere Kopie des Problems zurückführen |
| Code | oft länger, braucht Hilfsvariablen | oft sehr kurz, nah an der mathematischen Definition |
| Speicher | konstant (ein paar Variablen) | ein Rahmen pro aktivem Aufruf (n + 1 Rahmen für n!) |
| Grenze | keine | zu tief → **Stapelüberlauf** (Stack Overflow); Python bricht bei etwa 1000 verschachtelten Aufrufen mit `RecursionError` ab |
| Tempo | etwas schneller (kein Aufrufaufwand) | etwas langsamer; baumartige Rekursion kann *viel* langsamer sein (siehe Fibonacci) |
| natürlich für | Zählen, eine Liste durchlaufen | Bäume, Backtracking, Tiefensuche, das Kompositum |

Ihre eigentliche Stärke zeigt die Rekursion dort, wo sich das Problem selbst verzweigt: mehrere Möglichkeiten ausprobieren (Backtracking, B2), die Nachbarn eines Knotens besuchen (Tiefensuche, B3) oder eine Nachricht eine Kette von Objekten entlangreichen (Kompositum, C4).

## [logic] Arten der Rekursion

**Linear rekursiv**: Jede Ausführung der Methode macht **höchstens einen** rekursiven Aufruf. Die Aufrufe bilden eine einzige Kette (Fakultät, Summe, ggT). Arbeitsblatt 12_I_1_Aufgabe_6 c fragt genau das für `GGTBerechnen`.

**Endrekursiv**: Der rekursive Aufruf ist die **allerletzte Aktion**, und sein Ergebnis wird **unverändert** zurückgegeben. Beim Aufstieg bleibt nichts mehr zu tun.

- `return GGTBerechnen(zahl2, zahl1 % zahl2)` ist endrekursiv: Das Ergebnis wird durchgereicht.
- `return n * Fakultät(n - 1)` ist **nicht** endrekursiv: Nachdem der Aufruf zurückkehrt, muss noch multipliziert werden.

Eine endrekursive Methode ließe sich mechanisch in eine Schleife umwandeln, weil sich kein Rahmen etwas für den Rückweg merken muss.

**Baumartig / mehrfach rekursiv**: Eine Ausführung macht **zwei oder mehr** rekursive Aufrufe. Der Aufrufbaum verzweigt sich. Beispiel: die Fibonacci-Zahlen 1, 1, 2, 3, 5, 8, … mit `fib(n) = fib(n−1) + fib(n−2)` und `fib(1) = fib(2) = 1`.

:::diagram calltree caption="Aufrufbaum von fib(5): 9 Aufrufe, fib(3) wird zweimal berechnet und fib(2) dreimal"
fib(5) => 5
  fib(4) => 3
    fib(3) => 2 {amber}
      fib(2) => 1
      fib(1) => 1
    fib(2) => 1
  fib(3) => 2 {amber}
    fib(2) => 1
    fib(1) => 1
:::

Die Zahl der Aufrufe wächst exponentiell: `fib(30)` braucht über eine Million Aufrufe. Die Türme von Hanoi sind auch baumartig, dort ist die exponentielle Zahl von Zügen aber unvermeidlich, weil das Problem wirklich 2ⁿ − 1 Züge braucht.

## [logic] Beispiel: ggT nach Euklid (12_I_1_Aufgabe_6)

Aus deinem Arbeitsblatt:

```pseudo
methode GGTBerechnen(zahl1: GANZZAHL, zahl2: GANZZAHL) -> GANZZAHL
    falls zahl2 == 0
    dann
        return zahl1
    sonst
        return GGTBerechnen(zahl2, zahl1 % zahl2)
    endefalls
endemethode
```

:::viz recstack
{"fn": "ggt", "args": [24, 15], "title": "GGTBerechnen(24, 15) Schritt für Schritt"}
:::

GGTBerechnen(24, 15) = GGTBerechnen(15, 9) = GGTBerechnen(9, 6) = GGTBerechnen(6, 3) = GGTBerechnen(3, 0) = **3**.

- **Rekursionsende**: `zahl2 == 0`, denn ggT(a, 0) = a.
- **Rekursionsschritt**: ggT(a, b) = ggT(b, a mod b); das hat dieselben Teiler, aber kleinere Zahlen.
- **Abbruchbedingung**: `zahl1 % zahl2` ist immer kleiner als `zahl2`, das zweite Argument schrumpft also bei jedem Aufruf und muss 0 erreichen.
- linear rekursiv (ein Aufruf pro Ausführung) und **endrekursiv** (das Ergebnis des inneren Aufrufs wird unverändert zurückgegeben).
- Sonderfälle aus Aufgabe 6 b: Sind zahl1 und zahl2 teilerfremd, ist das Ergebnis 1 (`GGTBerechnen(7, 13)` → (13, 7) → (7, 6) → (6, 1) → (1, 0) → 1). Teilt zahl1 die zahl2, ist das Ergebnis zahl1 (`GGTBerechnen(4, 12)` → (12, 4) → (4, 0) → 4). Ist zahl1 < zahl2, vertauscht der erste Schritt die beiden einfach.

## [logic] Beispiel: Türme von Hanoi (12_I_1_Aufgabe_9)

Drei Türme 0, 1, 2. Auf Turm 0 liegen n Scheiben, die größte unten. Ziel: alle Scheiben auf Turm 2 bringen. Regeln: **immer nur eine Scheibe** bewegen und **nie eine größere Scheibe auf eine kleinere** legen.

Die rekursive Idee ist überraschend kurz. Um einen Turm aus n Scheiben von `von` nach `nach` zu bringen:

1. die **oberen n − 1 Scheiben** von `von` auf den freien Turm bringen (Rekursion),
2. die **größte Scheibe** von `von` nach `nach` bewegen (ein Zug),
3. die **n − 1 Scheiben** vom freien Turm darauf bringen (Rekursion).

Rekursionsende: Ein Turm aus 0 Scheiben braucht gar keinen Zug. Der freie Turm ist der, der weder `von` noch `nach` ist. Weil die Türme mit 0, 1, 2 nummeriert sind und 0 + 1 + 2 = 3 ist, gilt immer `frei = 3 - von - nach`.

```pseudo
methode TurmVerschieben(anzahl, von, nach)
    falls anzahl > 0 dann
        frei = 3 - von - nach
        TurmVerschieben(anzahl - 1, von, frei)
        BewegenScheibe(von, nach)
        TurmVerschieben(anzahl - 1, frei, nach)
    endefalls
endemethode
```

:::viz hanoi
{"n": 3}
:::

**Anzahl der Züge.** Sei Z(n) die Anzahl der Züge für n Scheiben. Der Algorithmus macht Z(n−1) Züge, dann 1, dann wieder Z(n−1): Z(n) = 2·Z(n−1) + 1 mit Z(0) = 0.

| n | 1 | 2 | 3 | 4 | 5 | 10 | 64 |
|---|---|---|---|---|---|---|---|
| Z(n) = 2ⁿ − 1 | 1 | 3 | 7 | 15 | 31 | 1023 | etwa 1,8 · 10¹⁹ |

Mit einem Zug pro Sekunde würden 64 Scheiben etwa 585 Milliarden Jahre dauern.

## [logic] Beispiel: die Levy-C-Kurve (12_I_1_Einstieg)

Dein Einstieg zeichnet ein Fraktal mit einer **Schildkröte** (Turtle), einem Stift, der geradeaus gehen (`Gehen(länge)`) und sich drehen (`Drehen(winkel)`) kann. Die rekursive Regel ersetzt eine gerade Linie durch zwei kürzere Linien mit einem rechten Winkel dazwischen:

```pseudo
methode SchrittAusführen(länge, tiefe)
    falls tiefe > 0 dann
        Drehen(45)
        SchrittAusführen(länge * 0.7071, tiefe - 1)
        Drehen(-90)
        SchrittAusführen(länge * 0.7071, tiefe - 1)
        Drehen(45)
    sonst
        Gehen(länge)          // Rekursionsende: eine gerade Linie
    endefalls
endemethode
```

0,7071 ≈ √2 / 2, damit die beiden Hälften der geknickten Linie dieselbe Strecke überspannen wie die gerade Linie, die sie ersetzen. Tiefe t erzeugt 2ᵗ Linien: eine baumartige Rekursion.

:::viz levy
{"depth": 3}
:::

## [bridge] Vom Pseudocode zu Python

:::bridge title="Fakultät"
methode Fakultät(n: GANZZAHL) -> GANZZAHL || def fakultaet(n):
    falls n == 0 dann                     ||     if n == 0:
        return 1                          ||         return 1
    sonst                                 ||     else:
        return n * Fakultät(n - 1)        ||         return n * fakultaet(n - 1)
    endefalls                             ||
endemethode                               ||
>> Der rekursive Aufruf ist ein ganz normaler Funktionsaufruf, die Funktion verwendet einfach ihren eigenen Namen. Das `return` davor ist unverzichtbar: Das Ergebnis des inneren Aufrufs muss zurückgegeben werden.
:::

:::bridge title="GGTBerechnen (Arbeitsblatt 12_I_1_Aufgabe_6)"
methode GGTBerechnen(zahl1, zahl2)            || def GGTBerechnen(zahl1, zahl2):
    falls zahl2 == 0                          ||     if zahl2 == 0:
    dann return zahl1                         ||         return zahl1
    sonst                                     ||     else:
        return GGTBerechnen(zahl2, zahl1 % zahl2) ||         return GGTBerechnen(zahl2, zahl1 % zahl2)
    endefalls                                 ||
endemethode                                   ||
:::

:::bridge title="TurmVerschieben in der Klasse Hanoi deiner Vorlage" right="Python (K3_1_A09 TuermeVonHanoi.py)"
methode TurmVerschieben(anzahl, von, nach)    || def TurmVerschieben(self, anzahlScheiben, von, nach):
    falls anzahl > 0 dann                     ||     if anzahlScheiben > 0:
        frei = 3 - von - nach                 ||         frei = 3 - von - nach
        TurmVerschieben(anzahl - 1, von, frei)||         self.TurmVerschieben(anzahlScheiben - 1, von, frei)
        BewegenScheibe(von, nach)             ||         self.BewegenScheibe(von, nach)
        TurmVerschieben(anzahl - 1, frei, nach)||         self.TurmVerschieben(anzahlScheiben - 1, frei, nach)
    endefalls                                 ||
endemethode                                   ||
>> In der Vorlage ist `TurmVerschieben` eine **Methode** der Klasse `Hanoi`, deshalb lautet der rekursive Aufruf `self.TurmVerschieben(…)`: Das Objekt ruft seine eigene Methode erneut auf. Das Rekursionsende „anzahl == 0 → nichts tun“ steckt im `if`: Wenn die Bedingung falsch ist, endet die Methode einfach.
:::

## [python] Rekursion in Python

Beobachte die Rahmen von `fakultaet(3)`. Jeder Rahmen hat sein eigenes `n`:

:::trace title="fakultaet(3): Abstieg und Aufstieg"
def fakultaet(n):
    if n == 0:
        return 1
    return n * fakultaet(n - 1)


ergebnis = fakultaet(3)
print(ergebnis)
:::

:::warn title="Typischer Fehler 1: das Ergebnis wird nicht zurückgegeben"
```python
def summe(n):
    if n == 0:
        return 0
    n + summe(n - 1)        # berechnet … und weggeworfen!
```
Ohne `return` im rekursiven Zweig gibt die Funktion `None` zurück, und beim Aufrufer bricht `n + None` mit **TypeError: unsupported operand type(s) for +: 'int' and 'NoneType'** ab.
:::

:::warn title="Typischer Fehler 2: das Rekursionsende wird nie erreicht"
```python
def runter(n):
    if n == 0:
        return "fertig"
    return runter(n - 2)    # runter(5) → 3 → 1 → -1 → -3 … nie 0
```
Python bricht mit **RecursionError: maximum recursion depth exceeded** ab. Prüf die Abbruchbedingung: Erreicht *jedes* mögliche Argument das Rekursionsende? Hier wäre `if n <= 0:` sicher.
:::

:::warn title="Typischer Fehler 3: der falsche freie Turm"
Bei den Türmen von Hanoi ist `frei = anzahlScheiben - von - nach` ein verlockender Tippfehler. Beim ersten Aufruf `TurmVerschieben(3, 0, 2)` liefert er sogar den richtigen Wert 1, in den tieferen Aufrufen aber falsche oder sogar negative Turmnummern. Der freie Turm hängt nur von `von` und `nach` ab: `frei = 3 - von - nach`.
:::

## [python] Python-Blöcke

:::exercise id=b1-sum title="Summe rekursiv" level=1
Schreib `summe(n)` **rekursiv** (ohne Schleife): `summe(n) = 1 + 2 + … + n`, `summe(0) = 0`.
--- starter
def summe(n):
    pass
--- solution
def summe(n):
    if n == 0:
        return 0
    return n + summe(n - 1)
--- tests
@test("summe(0) = 0 (Rekursionsende)")
def _():
    eq(summe(0), 0, "summe(0)")

@test("summe(4) = 10, summe(100) = 5050")
def _():
    eq(summe(4), 10, "summe(4)")
    eq(summe(100), 5050, "summe(100)")

@test("Die Funktion ruft sich wirklich selbst auf")
def _():
    r, rec = recursive(summe, 5)
    ok(rec, "summe muss sich selbst aufrufen (keine Schleife).")

@test("Es wird keine Schleife verwendet")
def _():
    ok("for " not in SOURCE and "while " not in SOURCE, "Löse es ohne for/while.")
--- hint
Rekursionsende zuerst: Was ist `summe(0)`? Dann: Wie bekommst du `summe(n)`, wenn du `summe(n - 1)` schon hast?
--- explain
Rekursionsende `n == 0` → 0. Rekursionsschritt: `n + summe(n - 1)`. Abbruchbedingung: n wird bei jedem Aufruf um 1 kleiner und erreicht für jedes n ≥ 0 die 0.
:::

:::exercise id=b1-fak title="Fakultät rekursiv" level=1
Schreib `fakultaet(n)` rekursiv. Denk an 0! = 1.
--- starter
def fakultaet(n):
    pass
--- solution
def fakultaet(n):
    if n == 0:
        return 1
    return n * fakultaet(n - 1)
--- tests
@test("fakultaet(0) = 1 und fakultaet(1) = 1")
def _():
    eq(fakultaet(0), 1, "fakultaet(0)")
    eq(fakultaet(1), 1, "fakultaet(1)")

@test("fakultaet(5) = 120, fakultaet(10) = 3628800")
def _():
    eq(fakultaet(5), 120, "fakultaet(5)")
    eq(fakultaet(10), 3628800, "fakultaet(10)")

@test("Die Funktion ist rekursiv und hat keine Schleife")
def _():
    r, rec = recursive(fakultaet, 4)
    ok(rec and "for " not in SOURCE and "while " not in SOURCE, "Ruf fakultaet innerhalb von fakultaet auf, ohne Schleife.")
--- hint
Die Multiplikation mit `n` passiert *nachdem* der rekursive Aufruf zurückgekehrt ist.
--- explain
Vergleiche mit deiner Schleifenversion aus A5: Die rekursive ist fast eine wörtliche Übersetzung der Definition n! = n · (n−1)!.
:::

:::exercise id=b1-pow title="Potenz rekursiv" level=1
Schreib `potenz(basis, exponent)` rekursiv für Exponenten ≥ 0 (kein `**`, keine Schleife). `potenz(2, 10)` = 1024, `potenz(5, 0)` = 1.
--- starter
def potenz(basis, exponent):
    pass
--- solution
def potenz(basis, exponent):
    if exponent == 0:
        return 1
    return basis * potenz(basis, exponent - 1)
--- tests
@test("potenz(2, 10) = 1024")
def _():
    eq(potenz(2, 10), 1024, "potenz(2, 10)")

@test("potenz(5, 0) = 1, potenz(7, 1) = 7, potenz(-3, 3) = -27")
def _():
    eq(potenz(5, 0), 1, "potenz(5, 0)")
    eq(potenz(7, 1), 7, "potenz(7, 1)")
    eq(potenz(-3, 3), -27, "potenz(-3, 3)")

@test("Rekursiv, ohne ** und Schleifen")
def _():
    r, rec = recursive(potenz, 2, 3)
    ok(rec, "potenz muss sich selbst aufrufen")
    ok("**" not in SOURCE and "for " not in SOURCE and "while " not in SOURCE, "Verwende kein ** und keine Schleifen.")
--- hint
bᵉ = b · bᵉ⁻¹. Welches Argument wird kleiner?
--- explain
Nur der Exponent ändert sich; die Basis wird unverändert weitergereicht.
:::

:::exercise id=b1-ggt title="GGTBerechnen (Arbeitsblatt 12_I_1_Aufgabe_6)" level=1
Implementiere die Methode aus dem Arbeitsblatt rekursiv als Funktion `GGTBerechnen(zahl1, zahl2)`. Teste mit mehreren guten Beispielen, wie es das Arbeitsblatt verlangt (teilerfremde Zahlen, zahl1 teilt zahl2, zahl1 < zahl2).
--- starter
def GGTBerechnen(zahl1, zahl2):
    pass


print(GGTBerechnen(24, 15))
--- solution
def GGTBerechnen(zahl1, zahl2):
    if zahl2 == 0:
        return zahl1
    else:
        return GGTBerechnen(zahl2, zahl1 % zahl2)


print(GGTBerechnen(24, 15))
--- tests
@test("GGTBerechnen(24, 15) = 3")
def _():
    eq(GGTBerechnen(24, 15), 3, "GGTBerechnen(24, 15)")

@test("Teilerfremd: GGTBerechnen(7, 13) = 1")
def _():
    eq(GGTBerechnen(7, 13), 1, "GGTBerechnen(7, 13)")

@test("zahl1 teilt zahl2: GGTBerechnen(4, 12) = 4")
def _():
    eq(GGTBerechnen(4, 12), 4, "GGTBerechnen(4, 12)")

@test("GGTBerechnen(9, 0) = 9 und GGTBerechnen(100, 75) = 25")
def _():
    eq(GGTBerechnen(9, 0), 9, "GGTBerechnen(9, 0)")
    eq(GGTBerechnen(100, 75), 25, "GGTBerechnen(100, 75)")

@test("Recursive")
def _():
    r, rec = recursive(GGTBerechnen, 24, 15)
    ok(rec, "GGTBerechnen muss sich selbst aufrufen")
--- hint
Übersetze den Pseudocode Zeile für Zeile (siehe Brücke-Abschnitt).
--- explain
Der rekursive Aufruf ist die letzte Aktion, und sein Ergebnis wird unverändert zurückgegeben → **endrekursiv**. Jede Ausführung enthält höchstens einen Aufruf → **linear rekursiv**.
:::

:::exercise id=b1-digits title="Quersumme" level=2
Schreib `quersumme(n)` rekursiv für n ≥ 0: die Summe der Dezimalziffern, z. B. `quersumme(4711)` = 4 + 7 + 1 + 1 = 13. Verwende `% 10` und `// 10` aus Lektion A1.
--- starter
def quersumme(n):
    pass
--- solution
def quersumme(n):
    if n < 10:
        return n
    return n % 10 + quersumme(n // 10)
--- tests
@test("quersumme(4711) = 13")
def _():
    eq(quersumme(4711), 13, "quersumme(4711)")

@test("Einstellige Zahlen und 0")
def _():
    eq(quersumme(7), 7, "quersumme(7)")
    eq(quersumme(0), 0, "quersumme(0)")

@test("quersumme(1000) = 1, quersumme(99999) = 45")
def _():
    eq(quersumme(1000), 1, "quersumme(1000)")
    eq(quersumme(99999), 45, "quersumme(99999)")

@test("Recursive")
def _():
    r, rec = recursive(quersumme, 123)
    ok(rec, "quersumme muss sich selbst aufrufen")
--- hint
Die einfachsten Zahlen sind die einstelligen: Ihre Quersumme ist die Zahl selbst.
--- hint
Spalte die letzte Ziffer ab (`n % 10`); der Rest der Zahl ist `n // 10`.
--- explain
Jeder Aufruf entfernt eine Ziffer, die Zahl der Ziffern schrumpft also, und das Rekursionsende „eine Ziffer“ wird für jedes n ≥ 0 erreicht.
:::

:::exercise id=b1-hanoi title="TurmVerschieben (Fehlersuche)" level=2
Das ist die Klasse `Hanoi` aus deiner Vorlage, ohne Grafik: `BewegenScheibe` notiert den Zug nur in der Liste `zuege`. Die rekursive Methode `TurmVerschieben` enthält einen typischen Fehler. Beim ersten Aufruf sieht alles richtig aus, aber die Züge sind nicht gültig.

Führ es aus, schau dir die Züge an, finde den Fehler und behebe ihn. Die Prüfungen simulieren die Türme und kontrollieren jeden Zug.
--- starter
class Hanoi:
    def __init__(self):
        self.zuege = []

    def BewegenScheibe(self, von, nach):
        self.zuege.append((von, nach))

    def TurmVerschieben(self, anzahlScheiben, von, nach):
        if anzahlScheiben > 0:
            frei = anzahlScheiben - von - nach
            self.TurmVerschieben(anzahlScheiben - 1, von, frei)
            self.BewegenScheibe(von, nach)
            self.TurmVerschieben(anzahlScheiben - 1, frei, nach)


h = Hanoi()
h.TurmVerschieben(3, 0, 2)
print(h.zuege)
--- solution
class Hanoi:
    def __init__(self):
        self.zuege = []

    def BewegenScheibe(self, von, nach):
        self.zuege.append((von, nach))

    def TurmVerschieben(self, anzahlScheiben, von, nach):
        if anzahlScheiben > 0:
            frei = 3 - von - nach
            self.TurmVerschieben(anzahlScheiben - 1, von, frei)
            self.BewegenScheibe(von, nach)
            self.TurmVerschieben(anzahlScheiben - 1, frei, nach)


h = Hanoi()
h.TurmVerschieben(3, 0, 2)
print(h.zuege)
--- tests
def simulate(n, zuege):
    t = [list(range(n, 0, -1)), [], []]
    for k, (a, b) in enumerate(zuege):
        ok(a in (0, 1, 2) and b in (0, 1, 2), f"Zug {k + 1}: {(a, b)} verwendet eine Turmnummer, die es nicht gibt")
        ok(len(t[a]) > 0, f"Zug {k + 1}: {(a, b)} nimmt eine Scheibe von einem leeren Turm")
        d = t[a].pop()
        ok(not t[b] or t[b][-1] > d, f"Zug {k + 1}: {(a, b)} legt Scheibe {d} auf die kleinere Scheibe {t[b][-1] if t[b] else ''}")
        t[b].append(d)
    return t

@test("3 Scheiben: alle Züge sind gültig, und der Turm endet auf 2")
def _():
    h = Hanoi()
    h.TurmVerschieben(3, 0, 2)
    t = simulate(3, h.zuege)
    eq(t, [[], [], [3, 2, 1]], "Türme am Ende")

@test("3 Scheiben brauchen genau 7 Züge")
def _():
    h = Hanoi()
    h.TurmVerschieben(3, 0, 2)
    eq(len(h.zuege), 7, "Anzahl der Züge")

@test("1 bis 6 Scheiben, auch auf Turm 1")
def _():
    for n in range(1, 7):
        h = Hanoi()
        h.TurmVerschieben(n, 0, 1)
        t = simulate(n, h.zuege)
        eq(t[1], list(range(n, 0, -1)), f"Turm 1 nach dem Verschieben von {n} Scheiben")
        eq(len(h.zuege), 2 ** n - 1, f"Anzahl der Züge für n = {n}")
--- hint
Schau dir den zweiten Zug in der Ausgabe an. Welche Turmnummern tauchen auf?
--- hint
Der freie Turm ist der, der weder `von` noch `nach` ist. Hängt das von der Zahl der Scheiben ab?
--- explain
`frei` muss der dritte Turm sein: `3 - von - nach` (die Turmnummern ergeben zusammen 0 + 1 + 2 = 3). `anzahlScheiben - von - nach` stimmt nur zufällig, wenn `anzahlScheiben` gleich 3 ist.
:::

:::exercise id=b1-fib title="Fibonacci und die Kosten baumartiger Rekursion" level=2
1. Schreib `fib(n)` rekursiv: `fib(1) = fib(2) = 1`, `fib(n) = fib(n-1) + fib(n-2)`.
2. Schreib `aufrufe(n)`, das zurückgibt, **wie viele Aufrufe** von `fib` beim Berechnen von `fib(n)` insgesamt gemacht werden (einschließlich des ersten Aufrufs). Finde selbst eine rekursive Formel: Die Aufrufe für `fib(n)` sind 1 plus die Aufrufe für beide Teilprobleme.

Probe: `aufrufe(5)` = 9 (siehe Aufrufbaum im Logik-Abschnitt).
--- starter
def fib(n):
    pass


def aufrufe(n):
    pass


print(fib(10), aufrufe(10))
--- solution
def fib(n):
    if n <= 2:
        return 1
    return fib(n - 1) + fib(n - 2)


def aufrufe(n):
    if n <= 2:
        return 1
    return 1 + aufrufe(n - 1) + aufrufe(n - 2)


print(fib(10), aufrufe(10))
--- tests
@test("fib(1..10) = 1 1 2 3 5 8 13 21 34 55")
def _():
    eq([fib(n) for n in range(1, 11)], [1, 1, 2, 3, 5, 8, 13, 21, 34, 55], "fib(1..10)")

@test("aufrufe(1) = aufrufe(2) = 1, aufrufe(5) = 9")
def _():
    eq((aufrufe(1), aufrufe(2), aufrufe(5)), (1, 1, 9), "(aufrufe(1), aufrufe(2), aufrufe(5))")

@test("aufrufe(20) = 13529")
def _():
    eq(aufrufe(20), 13529, "aufrufe(20)")

@test("fib ist rekursiv")
def _():
    r, rec = recursive(fib, 6)
    ok(rec, "fib muss sich selbst aufrufen")
--- hint
Für `aufrufe`: Die Rekursionsenden machen genau 1 Aufruf (sich selbst). Für größere n: 1 (der Aufruf selbst) + die Aufrufe von `fib(n-1)` + die Aufrufe von `fib(n-2)`.
--- explain
`aufrufe(n)` wächst wie die Fibonacci-Zahlen selbst, also exponentiell. Baumartige Rekursion berechnet dieselben Teilprobleme immer wieder neu; fib(30) braucht schon 1.664.079 Aufrufe.
:::

:::exercise id=b1-listsum title="Rekursion über eine Liste (Vorbereitung auf Kapitel II)" level=2
Schreib `summe_ab(liste, i)` rekursiv: Es gibt die Summe aller Elemente ab Index `i` bis zum Ende zurück. `summe_ab([4, 1, 7], 0)` = 12, `summe_ab([4, 1, 7], 2)` = 7, `summe_ab([4, 1, 7], 3)` = 0.

Idee: Element `i` plus die Summe des Rests ab `i + 1`.
--- starter
def summe_ab(liste, i):
    pass
--- solution
def summe_ab(liste, i):
    if i >= len(liste):
        return 0
    return liste[i] + summe_ab(liste, i + 1)
--- tests
@test("summe_ab([4, 1, 7], 0) = 12")
def _():
    eq(summe_ab([4, 1, 7], 0), 12, "summe_ab([4, 1, 7], 0)")

@test("Aus der Mitte und vom Ende")
def _():
    eq(summe_ab([4, 1, 7], 2), 7, "summe_ab([4, 1, 7], 2)")
    eq(summe_ab([4, 1, 7], 3), 0, "summe_ab([4, 1, 7], 3)")
    eq(summe_ab([], 0), 0, "summe_ab([], 0)")

@test("Recursive")
def _():
    r, rec = recursive(summe_ab, [1, 2, 3], 0)
    ok(rec, "summe_ab muss sich selbst aufrufen")
--- hint
Rekursionsende: Es ist kein Element mehr übrig (`i` hat das Ende der Liste erreicht).
--- explain
„Das erste Element plus der Rest“ ist genau die Denkweise der rekursiven Listenmethoden in Kapitel II: Ein Knoten erledigt seine eigenen Daten und gibt den Rest der Arbeit an seinen nachfolger weiter.
:::

## [exam] Klausurtraining

:::exam title="GGTBerechnen (12_I_1_Aufgabe_6)" points=6
a) Setze fort: GGTBerechnen(24, 15) = GGTBerechnen(15, 9) = …
b) Begründe, warum GGTBerechnen **linear rekursiv** ist.
c) Begründe, warum es **endrekursiv** ist.
d) Nenne Rekursionsende, Rekursionsschritt und die Abbruchbedingung.
--- solution
a) = GGTBerechnen(9, 6) = GGTBerechnen(6, 3) = GGTBerechnen(3, 0) = 3.

b) Bei jeder Ausführung der Methode findet höchstens ein rekursiver Aufruf statt, die Aufrufe bilden also eine einzige Kette.

c) Der rekursive Aufruf ist die letzte Anweisung, und sein Ergebnis wird ohne weitere Rechnung zurückgegeben. Beim Aufstieg bleibt nichts zu tun.

d) Rekursionsende: `zahl2 == 0`, Ergebnis `zahl1`. Rekursionsschritt: `GGTBerechnen(zahl2, zahl1 % zahl2)`. Abbruchbedingung: Der Rest `zahl1 % zahl2` ist immer kleiner als `zahl2`, das zweite Argument nimmt also echt ab und erreicht nach endlich vielen Schritten 0.
:::

:::exam title="Reihenfolge der Ausgabe" points=4
Was gibt `p(3)` aus? Erkläre mithilfe des Aufrufstapels.

```python
def p(n):
    if n > 0:
        print("ab", n)
        p(n - 1)
        print("auf", n)
```
--- solution
```out
ab 3
ab 2
ab 1
auf 1
auf 2
auf 3
```
Beim **Abstieg** gibt jeder Aufruf „ab“ aus, *bevor* er sich rekursiv aufruft. Dann tut der tiefste Aufruf `p(0)` nichts. Beim **Aufstieg** macht jeder wartende Rahmen nach seinem rekursiven Aufruf weiter und gibt „auf“ aus. Die Rahmen werden in umgekehrter Reihenfolge entfernt (zuletzt hinein, zuerst hinaus), deshalb erscheinen die „auf“-Zeilen umgekehrt.
:::

:::exam title="Türme von Hanoi" points=4
a) Wie viele Züge braucht man für 5 Scheiben? Begründe mit einer rekursiven Formel.
b) Schreib die ersten drei Züge von `TurmVerschieben(3, 0, 2)` auf.
--- solution
a) Z(n) = 2·Z(n−1) + 1, Z(1) = 1 → Z(5) = 31 = 2⁵ − 1.

b) TurmVerschieben(3, 0, 2) ruft zuerst TurmVerschieben(2, 0, 1) auf, das zuerst TurmVerschieben(1, 0, 2) aufruft → Zug **0 → 2**. Dann bewegt TurmVerschieben(2, 0, 1) **0 → 1**, dann TurmVerschieben(1, 2, 1) → Zug **2 → 1**. Also: 0→2, 0→1, 2→1.
:::

:::exam title="Rekursion gegen Iteration" points=3
Nenne zwei Vorteile und zwei Nachteile einer rekursiven gegenüber einer iterativen Lösung.
--- solution
Vorteile: oft kürzer und näher an der mathematischen Definition; natürlich für Probleme, die sich verzweigen (Backtracking, Bäume, Tiefensuche, Listen im Kompositum).
Nachteile: braucht einen Rahmen pro aktivem Aufruf (Speicher); eine zu tiefe Rekursion führt zum Stapelüberlauf (RecursionError); der Aufrufaufwand macht sie langsamer; baumartige Rekursion berechnet dieselben Teilprobleme eventuell viele Male neu (Fibonacci).
:::
