---
id: a5
num: A5
part: A
title: Funktionen, Parameter und Rückgabewerte
short: Funktionen
lead: Eine Funktion ist ein benanntes Stück Code, das Eingabewerte bekommt und ein Ergebnis zurückgibt. Rekursion ist nichts anderes als eine Funktion, die sich selbst aufruft. Deshalb zeigt diese Lektion auch genau, was bei einem Aufruf im Computer passiert.
minutes: 55
uses: [a4]
goals:
  - Funktionen mit Parametern definieren und mit Argumenten aufrufen
  - den Unterschied zwischen <b>return</b> und <b>print</b> erklären
  - beschreiben, was bei einem Aufruf passiert (Aufrufrahmen, lokale Variablen, Rückgabewert), und den Aufrufstapel zeichnen
  - Standardwerte für Parameter wie <code>kNeu=None</code> verwenden
---

## [logic] Funktionen: Eingabe → Verarbeitung → Ergebnis

Eine **Funktion** (in Klassen: **Methode**) fasst mehrere Anweisungen unter einem Namen zusammen. Sie bekommt Werte über **Parameter**, verarbeitet sie und liefert meist ein **Ergebnis** (Rückgabewert) an die Stelle zurück, an der sie aufgerufen wurde.

Stell dir einen Automaten vor: Du steckst etwas hinein (die Argumente), der Automat arbeitet innen (wie, musst du nicht wissen), und es kommt etwas heraus (der Rückgabewert).

Im Pseudocode deines Kurses (aus dem Arbeitsblatt 12_I_1_Aufgabe_6):

```pseudo
methode GGTBerechnen(zahl1: GANZZAHL, zahl2: GANZZAHL) -> GANZZAHL
    ...
    return ergebnis
endemethode
```

- `zahl1`, `zahl2` sind die **Parameter** (hier mit ihren Typen)
- `-> GANZZAHL` gibt den Typ des Rückgabewerts an
- `return …` beendet die Methode und liefert den Wert

Eine Funktion wird einmal **definiert** und kann beliebig oft **aufgerufen** werden: `GGTBerechnen(24, 15)`, `GGTBerechnen(7, 3)` … Die Werte im Aufruf (24 und 15) heißen **Argumente**. Während dieses Aufrufs ist `zahl1` gleich 24 und `zahl2` gleich 15.

### Wozu Funktionen?

- **Keine Wiederholung**: Code, den du mehrmals brauchst, schreibst du nur einmal.
- **Struktur**: Ein langes Programm wird zu ein paar gut benannten Schritten (`TiefensucheAusführen`, `KnotenBesuchen`, `AlleVerbindungenBerechnen`).
- **Testen**: Eine Funktion lässt sich für sich allein prüfen: `GGTBerechnen(24, 15)` muss 3 ergeben. Genau so funktionieren die Prüfungen in den Python-Blöcken.
- **Rekursion**: Eine Funktion kann sich selbst aufrufen. Das ist Kapitel B.

## [logic] Was bei einem Aufruf passiert

Das ist das wichtigste Bild des ganzen Kurses. Wenn eine Funktion aufgerufen wird:

1. Der aufrufende Code **hält** beim Aufruf **an**.
2. Für die Funktion wird ein neuer **Aufrufrahmen** (Frame) angelegt. Er enthält die Parameter (mit den Argumenten als Werten) und später die **lokalen Variablen** der Funktion.
3. Der Funktionsrumpf läuft Zeile für Zeile.
4. Bei `return wert` wird der Rahmen **entfernt**, und `wert` wird an den Aufrufer geliefert. Der Aufrufausdruck wird durch diesen Wert ersetzt.
5. Der Aufrufer **macht weiter**, wo er angehalten hat.

Rahmen stapeln sich übereinander, wenn eine Funktion eine andere Funktion aufruft: der **Aufrufstapel** (*Stack*). Nur der oberste Rahmen ist aktiv; die darunter warten.

```python
def maximum(a, b):
    if a > b:
        return a
    return b

def maximum3(a, b, c):
    m = maximum(a, b)
    return maximum(m, c)

print(maximum3(4, 9, 2))
```

:::diagram seq caption="Sequenzdiagramm von maximum3(4, 9, 2): Aufrufe gehen nach rechts, Rückgabewerte kommen zurück (gestrichelt)"
actors: Aufrufer | maximum3 | maximum
Aufrufer -> maximum3: maximum3(4, 9, 2)
maximum3 -> maximum: maximum(4, 9)
maximum --> maximum3: 9
maximum3 -> maximum: maximum(9, 2)
maximum --> maximum3: 9
maximum3 --> Aufrufer: 9
:::

Schau zu, wie die Rahmen erscheinen und verschwinden:

:::trace title="Rahmen auf dem Aufrufstapel"
def maximum(a, b):
    if a > b:
        return a
    return b

def maximum3(a, b, c):
    m = maximum(a, b)
    return maximum(m, c)

ergebnis = maximum3(4, 9, 2)
print(ergebnis)
:::

Beachte: Während `maximum` läuft, existiert darunter noch der Rahmen von `maximum3` mit seinen eigenen `a`, `b`, `c`. Beide Funktionen haben Parameter namens `a` und `b`, aber das sind **verschiedene Variablen in verschiedenen Rahmen**. Eine lokale Variable existiert nur in ihrem eigenen Rahmen und nur, solange dieser Rahmen existiert.

:::key
Jeder Aufruf hat seinen **eigenen Rahmen** mit seinen **eigenen lokalen Variablen**. Wenn eine Funktion sich selbst aufruft (Rekursion), passiert genau dasselbe: Mehrere Rahmen *derselben* Funktion liegen auf dem Stapel, jeder mit seinem eigenen Wert von `n`. Wenn du dieses Bild verstanden hast, ist Rekursion kein Rätsel mehr.
:::

## [bridge] Vom Pseudocode zu Python

:::bridge title="Eine Funktion in beiden Schreibweisen"
methode Quadrat(x: GANZZAHL) -> GANZZAHL  || def quadrat(x):
    return x * x                          ||     return x * x
endemethode                               ||
                                          ||
ausgeben Quadrat(7)                       || print(quadrat(7))
>> Aus `methode` wird `def`, die Parameterliste bekommt am Ende einen Doppelpunkt, der Rumpf wird eingerückt. Python schreibt die Typen nicht hin (sie sind optional: `def quadrat(x: int) -> int:` ist auch erlaubt). `endemethode` hat keine Entsprechung: Die Einrückung beendet die Funktion.
:::

## [python] Funktionen in Python

```python
def ist_teiler(a, n):
    """Gibt zurück, ob a ein Teiler von n ist."""
    return n % a == 0
```

- `def`, der Name, die Parameter in Klammern, ein Doppelpunkt.
- Der Text in dreifachen Anführungszeichen ist ein **Docstring**: eine Beschreibung der Funktion. Deine Kursvorlagen haben einen für jede Methode.
- `return` liefert das Ergebnis und **beendet die Funktion sofort**. Code nach einem `return` im selben Block läuft nie.

### `return` ist nicht `print`

Das ist der häufigste Anfängerfehler, und bei Rekursion ist er fatal.

:::cols
```python
def doppelt_falsch(x):
    print(x * 2)      # ZEIGT den Wert nur an

y = doppelt_falsch(5) # gibt 10 aus
print(y + 1)          # TypeError!
```
--- col
```python
def doppelt(x):
    return x * 2      # LIEFERT den Wert

y = doppelt(5)        # y ist 10
print(y + 1)          # 11
```
:::

`print` schreibt etwas für einen Menschen auf den Bildschirm, und das Programm kann danach nichts damit anfangen. `return` gibt den Wert an das Programm zurück, das ihn speichern, damit rechnen oder ihn weitergeben kann. Eine Funktion ohne `return` gibt `None` zurück. Deshalb scheitert links `y + 1`: `None + 1` ist ein TypeError.

:::warn title="Typischer Fehler: ausgeben statt zurückgeben"
Die Prüfungen eines Python-Blocks rufen deine Funktion auf und schauen, was sie **zurückgibt**. Wenn deine Funktion die richtige Zahl ausgibt, aber nicht zurückgibt, meldet die Prüfung *Ergebnis: erwartet 120, erhalten None*.
:::

### Mehrere `return`: früh zurückkehren

Eine Funktion darf mehrere `return`-Anweisungen enthalten, und die erste, die erreicht wird, beendet die Funktion. So werden Fallunterscheidungen kurz:

```python
def vorzeichen(x):
    if x > 0:
        return 1
    if x < 0:
        return -1
    return 0          # nur erreicht, wenn x == 0
```

Rekursive Funktionen schreibt man genau so: `if` Rekursionsende → direkt `return`; sonst → `return` etwas mit einem rekursiven Aufruf.

### Standardwerte für Parameter

Ein Parameter kann einen **Standardwert** haben, der verwendet wird, wenn der Aufrufer ihn weglässt:

```python
def begruessen(name, gruss="Hallo"):
    return gruss + ", " + name + "!"

begruessen("Ada")            # 'Hallo, Ada!'
begruessen("Ada", "Servus")  # 'Servus, Ada!'
```

Das begegnet dir in der Listenvorlage deines Kurses: `def __init__(self, dNeu, kNeu=None)`. Ein neuer Knoten bekommt den Nachfolger `kNeu`, oder `None`, wenn du keinen angibst.

### Funktionen verwenden andere Funktionen

Eine Funktion darf jede andere Funktion aufrufen, die im Programm definiert ist. Bau Großes aus kleinen, getesteten Teilen: `maximum3` oben verwendet `maximum` zweimal.

:::quiz
Was gibt dieses Programm aus?

```python
def f(x):
    print(x + 1)
    return x * 2

y = f(3)
print(y)
```
- [ ] `4`
- [ ] `6`
- [x] `4` und dann `6`
- [ ] `6` und dann `4`
--- explain
Der Aufruf `f(3)` gibt zuerst `3 + 1 = 4` aus (das passiert in der Funktion) und gibt dann `3 * 2 = 6` zurück; das wird in `y` gespeichert und danach ausgegeben.
:::

:::quiz
Was enthält `ergebnis` nach `ergebnis = g(5)`?

```python
def g(n):
    if n > 3:
        return "groß"
    print("klein")
```
- [x] `'groß'`
- [ ] `None`
- [ ] `'klein'`
- [ ] nichts, es gibt einen Fehler
--- explain
Für `n = 5` ist die Bedingung wahr, also wird `"groß"` zurückgegeben. (Für `n = 2` würde die Funktion `klein` ausgeben und dann `None` zurückgeben, weil kein `return` erreicht wird.)
:::

## [python] Python-Blöcke

:::exercise id=a5-square title="Deine erste Funktion" level=1
Schreib eine Funktion `quadrat(x)`, die `x * x` **zurückgibt**. (Das Programm muss nichts ausgeben.)
--- starter
def quadrat(x):
    pass
--- solution
def quadrat(x):
    return x * x
--- tests
@test("quadrat(7) gibt 49 zurück")
def _():
    eq(quadrat(7), 49, "quadrat(7)")

@test("quadrat(0), quadrat(-3), quadrat(1.5)")
def _():
    eq(quadrat(0), 0, "quadrat(0)")
    eq(quadrat(-3), 9, "quadrat(-3)")
    eq(quadrat(1.5), 2.25, "quadrat(1.5)")
--- hint
Ersetze `pass` durch eine `return`-Anweisung.
--- explain
`pass` tut nichts, deshalb gibt die Startfunktion `None` zurück. `return x * x` liefert das Ergebnis an den Aufrufer.
:::

:::exercise id=a5-divisor title="Eine Funktion, die einen Wahrheitswert zurückgibt" level=1
Schreib `ist_teiler(a, n)`, das `True` zurückgibt, wenn `a` ein Teiler von `n` ist, sonst `False`. Verwende sie dann in einer zweiten Funktion `anzahl_teiler(n)`, die zurückgibt, wie viele Teiler `n` hat (siehe Zählermuster in A4).
--- starter
def ist_teiler(a, n):
    pass


def anzahl_teiler(n):
    pass
--- solution
def ist_teiler(a, n):
    return n % a == 0


def anzahl_teiler(n):
    anzahl = 0
    for a in range(1, n + 1):
        if ist_teiler(a, n):
            anzahl = anzahl + 1
    return anzahl
--- tests
@test("ist_teiler(3, 12) ist True, ist_teiler(5, 12) ist False")
def _():
    eq(ist_teiler(3, 12), True, "ist_teiler(3, 12)")
    eq(ist_teiler(5, 12), False, "ist_teiler(5, 12)")

@test("ist_teiler(1, 7) und ist_teiler(7, 7) sind True")
def _():
    eq(ist_teiler(1, 7), True, "ist_teiler(1, 7)")
    eq(ist_teiler(7, 7), True, "ist_teiler(7, 7)")

@test("anzahl_teiler(12) ist 6, anzahl_teiler(13) ist 2, anzahl_teiler(1) ist 1")
def _():
    eq(anzahl_teiler(12), 6, "anzahl_teiler(12)")
    eq(anzahl_teiler(13), 2, "anzahl_teiler(13)")
    eq(anzahl_teiler(1), 1, "anzahl_teiler(1)")

@test("anzahl_teiler verwendet ist_teiler")
def _():
    ok(SOURCE.count("ist_teiler(") >= 2, "Ruf ist_teiler innerhalb von anzahl_teiler auf.")
--- hint
`n % a == 0` ist bereits `True` oder `False`, du kannst es also direkt zurückgeben.
--- explain
Kleine Funktionen mit klaren Namen machen die größere Funktion lesbar: *zähle die Zahlen a, für die ist_teiler(a, n) gilt*.
:::

:::exercise id=a5-max3 title="Auf einer anderen Funktion aufbauen" level=1
`maximum(a, b)` ist gegeben. Schreib `maximum3(a, b, c)` **nur mit `maximum`** (kein `if`, kein `max`).
--- starter
def maximum(a, b):
    if a > b:
        return a
    return b


def maximum3(a, b, c):
    pass
--- solution
def maximum(a, b):
    if a > b:
        return a
    return b


def maximum3(a, b, c):
    return maximum(maximum(a, b), c)
--- tests
@test("maximum3 aller Reihenfolgen von (1, 5, 3)")
def _():
    import itertools
    for t in itertools.permutations((1, 5, 3)):
        eq(maximum3(*t), 5, f"maximum3{t}")

@test("Gleiche und negative Werte")
def _():
    eq(maximum3(2, 2, 2), 2, "maximum3(2, 2, 2)")
    eq(maximum3(-4, -9, -1), -1, "maximum3(-4, -9, -1)")

@test("Nur maximum wird verwendet")
def _():
    body = SOURCE.split("def maximum3")[1]
    ok("if" not in body and "max(" not in body.replace("maximum(", ""), "Verwende in maximum3 nur Aufrufe von maximum.")
--- hint
Die größte von drei Zahlen ist die größere von (der größeren von a und b) und c.
--- explain
Das Ergebnis eines Aufrufs kann direkt als Argument eines anderen Aufrufs verwendet werden: `maximum(maximum(a, b), c)`.
:::

:::exercise id=a5-return title="print oder return?" level=2
`summe_bis(n)` soll 1 + 2 + … + n zurückgeben. Die Funktion scheint zu funktionieren (sie zeigt die richtige Zahl), aber die Prüfung schlägt fehl. Finde heraus, warum, und behebe es.
--- starter
def summe_bis(n):
    summe = 0
    for i in range(1, n + 1):
        summe = summe + i
    print(summe)


ergebnis = summe_bis(10)
print("Das Ergebnis ist", ergebnis)
--- solution
def summe_bis(n):
    summe = 0
    for i in range(1, n + 1):
        summe = summe + i
    return summe


ergebnis = summe_bis(10)
print("Das Ergebnis ist", ergebnis)
--- tests
@test("summe_bis(10) gibt 55 zurück")
def _():
    eq(summe_bis(10), 55, "summe_bis(10)")

@test("summe_bis(0) gibt 0 zurück, summe_bis(4) gibt 10 zurück")
def _():
    eq(summe_bis(0), 0, "summe_bis(0)")
    eq(summe_bis(4), 10, "summe_bis(4)")

@test("Das Hauptprogramm gibt aus: Das Ergebnis ist 55")
def _():
    ok("Das Ergebnis ist 55" in OUTPUT, "Erwartet wurde die Zeile: Das Ergebnis ist 55")
--- hint
Führ es aus und schau dir die zweite Zeile der Ausgabe an.
--- explain
Die Funktion hat die Summe ausgegeben, aber `None` zurückgegeben; `ergebnis` war also `None`. Wenn du `print(summe)` durch `return summe` ersetzt, kommt der Wert beim Aufrufer an.
:::

:::exercise id=a5-factorial title="Fakultät mit einer Schleife" level=2
Die Fakultät von n ist n! = 1 · 2 · 3 · … · n, und per Definition ist 0! = 1. Schreib `fakultaet(n)` mit einer Schleife. Beispiel: `fakultaet(5)` gibt 120 zurück.

In Lektion B1 schreibst du dieselbe Funktion **rekursiv** und vergleichst beide Versionen.
--- starter
def fakultaet(n):
    pass
--- solution
def fakultaet(n):
    ergebnis = 1
    for i in range(2, n + 1):
        ergebnis = ergebnis * i
    return ergebnis
--- tests
@test("fakultaet(5) ist 120")
def _():
    eq(fakultaet(5), 120, "fakultaet(5)")

@test("fakultaet(0) ist 1 und fakultaet(1) ist 1")
def _():
    eq(fakultaet(0), 1, "fakultaet(0)")
    eq(fakultaet(1), 1, "fakultaet(1)")

@test("fakultaet(10) ist 3628800")
def _():
    eq(fakultaet(10), 3628800, "fakultaet(10)")
--- hint
Ein Akkumulator für ein Produkt muss bei 1 beginnen, nicht bei 0.
--- explain
Für n = 0 und n = 1 ist die Schleife `range(2, n + 1)` leer, also wird der Startwert 1 zurückgegeben: genau die Definition 0! = 1! = 1.
:::

:::exercise id=a5-default title="Standardwerte" level=2
Schreib `begruessen(name, gruss="Hallo")`, das den Text `gruss + ", " + name + "!"` **zurückgibt**.

- `begruessen("Ada")` → `'Hallo, Ada!'`
- `begruessen("Ada", "Servus")` → `'Servus, Ada!'`
--- starter
def begruessen(name):
    pass
--- solution
def begruessen(name, gruss="Hallo"):
    return gruss + ", " + name + "!"
--- tests
@test("begruessen('Ada') → 'Hallo, Ada!'")
def _():
    eq(begruessen("Ada"), "Hallo, Ada!", "begruessen('Ada')")

@test("begruessen('Ada', 'Servus') → 'Servus, Ada!'")
def _():
    eq(begruessen("Ada", "Servus"), "Servus, Ada!", "begruessen('Ada', 'Servus')")
--- hint
Schreib den Standardwert direkt in die Parameterliste: `gruss="Hallo"`.
--- explain
Parameter mit Standardwert müssen hinter den Parametern ohne Standardwert stehen. Das ist genau die Form der Listenvorlage: `def __init__(self, dNeu, kNeu=None)`.
:::

## [exam] Klausurtraining

:::exam title="Aufrufstapel und Ausgabe" points=5
```python
def a(x):
    return x + 1

def b(x):
    y = a(x) * 2
    return y

def c(x):
    print(b(x) + a(x))

c(3)
```
1. Schreib die Ausgabe auf.
2. Zeichne den Aufrufstapel in dem Moment, in dem `a` **aus `b` heraus** aufgerufen wird.
3. Was gibt `c(3)` zurück?
--- solution
1. `b(3)`: `a(3)` ist 4, mal 2 → 8. `a(3)` ist 4. Ausgabe: `12`.
2. Aufrufstapel (oben = aktiv):

   | Rahmen | lokale Variablen |
   |---|---|
   | `a` (aktiv) | x = 3 |
   | `b` (wartet) | x = 3 (y existiert noch nicht) |
   | `c` (wartet) | x = 3 |
   | Hauptprogramm | |

3. `c` hat kein `return`, also gibt `c(3)` den Wert `None` zurück. Die `12` wird nur ausgegeben.
:::
