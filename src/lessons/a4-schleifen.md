---
id: a4
num: A4
part: A
title: Wiederholungen mit while und for
short: Schleifen
lead: Schleifen wiederholen Anweisungen. Du brauchst sie, um eine Liste Knoten für Knoten zu durchlaufen, um in der Adjazenzmatrix jeden Nachbarn eines Knotens zu prüfen und um beim Backtracking jede Möglichkeit auszuprobieren.
minutes: 50
uses: [a3]
goals:
  - while-Schleifen schreiben und sicherstellen, dass sie enden
  - for-Schleifen mit range(n), range(a, b) und range(a, b, schritt) verwenden
  - '„wiederhole solange“ und „für i von a bis b“ in Python übersetzen, einschließlich der Um-eins-daneben-Falle von range'
  - die Muster Akkumulator, Zähler und Suche anwenden
  - verschachtelte Schleifen (Zeile × Spalte) schreiben, wie man sie für eine Matrix braucht
---

## [logic] Zwei Arten der Wiederholung

Dein Kurs verwendet zwei Arten von Schleifen (Wiederholungen):

1. **Bedingte Wiederholung**: *wiederhole, solange eine Bedingung gilt*. Wie oft, weißt du vorher nicht. Beispiel: *lauf die Warteschlange entlang, solange es einen nächsten Patienten gibt*.
2. **Zählschleife**: *wiederhole für jeden Wert eines Zählers von a bis b*. Die Anzahl der Wiederholungen steht fest. Beispiel: *prüfe für jede Knotennummer i von 0 bis n−1, ob es eine Kante gibt*.

```pseudo
// bedingte Wiederholung
zahl = 1
solange zahl < 100
    zahl = zahl * 2
endesolange

// Zählschleife
summe = 0
für i von 1 bis 10
    summe = summe + i
endefür
```

Im Struktogramm wird eine Schleife als L-Form gezeichnet: Der Schleifenkopf oben und links, der wiederholte Block (der **Schleifenrumpf**) eingerückt darin.

::::cols
:::diagram struktogramm caption="Bedingte Wiederholung"
W: solange zahl < 100
  S: zahl = zahl * 2
S: ausgeben zahl
:::
--- col
:::diagram struktogramm caption="Zählschleife"
S: summe = 0
W: für i von 1 bis 10
  S: summe = summe + i
S: ausgeben summe
:::
::::

### Eine Schleife muss enden

Eine bedingte Wiederholung läuft, **solange** die Bedingung wahr ist. Irgendetwas im Schleifenrumpf muss die Bedingung also verändern, sonst hört die Schleife nie auf (**Endlosschleife**). Bei `solange zahl < 100` ist es `zahl = zahl * 2`, das die Bedingung irgendwann falsch macht.

Ablauftabelle für die bedingte Wiederholung oben:

| Durchlauf | `zahl` vorher | Bedingung `zahl < 100` | `zahl` nachher |
|---|---|---|---|
| 1 | 1 | wahr | 2 |
| 2 | 2 | wahr | 4 |
| … | … | … | … |
| 7 | 64 | wahr | 128 |
| – | 128 | **falsch** → Schleife endet | |

## [bridge] Schleifen in Python

:::bridge title="Die bedingte Wiederholung"
zahl = 1                        || zahl = 1
solange zahl < 100              || while zahl < 100:
    zahl = zahl * 2             ||     zahl = zahl * 2
endesolange                     ||
ausgeben zahl                   || print(zahl)
>> Aus `solange` wird `while`, die Bedingung bekommt einen Doppelpunkt, und der Rumpf wird eingerückt. Die Schleife endet dort, wo die Einrückung endet.
:::

:::bridge title="Die Zählschleife – achte auf den Endwert"
summe = 0                       || summe = 0
für i von 1 bis 10              || for i in range(1, 11):
    summe = summe + i           ||     summe = summe + i
endefür                         ||
>> `range(a, b)` erzeugt die Zahlen **a, a+1, …, b−1**. Der Endwert **b ist nicht enthalten**! „von 1 bis 10“ ist deshalb `range(1, 11)`.
:::

Die drei Formen von `range`:

| Python | Zahlen | Typische Verwendung |
|---|---|---|
| `range(n)` | 0, 1, …, n−1 (n Zahlen) | jeder Index einer Liste oder Matrixzeile: `for i in range(len(self.knoten)):` |
| `range(a, b)` | a, a+1, …, b−1 | „für i von a bis b−1“ |
| `range(a, b, schritt)` | a, a+schritt, … (stoppt vor b) | `range(10, 0, -1)` zählt rückwärts 10, 9, …, 1 |

:::warn
Um-eins-daneben-Fehler (ein Durchlauf zu viel oder zu wenig) sind der klassische Schleifenfehler. Wenn du `range(…)` schreibst, frag dich immer: *Was ist der letzte Wert?* `range(5)` endet bei 4, `range(1, 5)` ebenfalls bei 4.
:::

## [python] Typische Schleifenmuster

Fast jede Schleife in diesem Kurs folgt einem von vier Mustern.

**1. Akkumulator (Summe / Produkt)**: Startwert vor der Schleife, Aktualisierung darin.

```python
summe = 0
for i in range(1, n + 1):
    summe = summe + i
```

**2. Zähler**: zählen, wie oft etwas zutrifft.

```python
anzahl = 0
for i in range(1, n + 1):
    if n % i == 0:          # i ist ein Teiler von n
        anzahl = anzahl + 1
```

**3. Suche mit Merker** (*gibt es mindestens ein …?*)

```python
gefunden = False
for i in range(len(werte)):
    if werte[i] == gesucht:
        gefunden = True
```

**4. Durchlaufen bis zum Ende**: eine while-Schleife, die Schritt für Schritt weitergeht. So durchläufst du in Teil C eine verkettete Liste:

```python
k = anfang
while k is not None:
    ...                    # etwas mit k machen
    k = k.NachfolgerGeben() # weitergehen – ohne diese Zeile endet die Schleife nie!
```

### Verschachtelte Schleifen

Eine Schleife in einer Schleife führt die innere Schleife bei jedem Durchlauf der äußeren **vollständig** aus. So besuchst du jede Zelle einer Matrix (Zeile für Zeile):

```python
for zeile in range(3):
    for spalte in range(3):
        print(zeile, spalte)     # 9 Zeilen: (0,0) (0,1) (0,2) (1,0) …
```

:::trace title="Eine verschachtelte Schleife Schritt für Schritt"
for zeile in range(2):
    for spalte in range(3):
        print(zeile, spalte)
print("fertig")
:::

### `break`: eine Schleife vorzeitig verlassen

`break` beendet die Schleife sofort, auch wenn die Bedingung noch wahr ist. Das ist praktisch, wenn du suchst und schon gefunden hast, was du brauchst. In diesem Kurs brauchst du es selten, weil eine Rekursion zurückkehrt, sobald etwas gefunden ist.

:::quiz
Wie oft wird `print` ausgeführt?

```python
for i in range(2, 10, 3):
    print(i)
```
- [ ] 8
- [ ] 4
- [x] 3
- [ ] 2
--- explain
`range(2, 10, 3)` erzeugt 2, 5, 8; der nächste Wert 11 wäre schon ≥ 10. `print` läuft also 3-mal.
:::

:::quiz
Welche Schleife endet nie?
- [ ] `i = 10` · `while i > 0:` · `i = i - 3`
- [x] `i = 0` · `while i != 5:` · `i = i + 2`
- [ ] `i = 1` · `while i < 50:` · `i = i * 2`
- [ ] `for i in range(1000000):` · `pass`
--- explain
`i` nimmt die Werte 0, 2, 4, 6, … an. Es wird nie gleich 5, also bleibt `i != 5` für immer wahr. Sicherer wäre `while i < 5:`. Die erste Schleife endet, wenn `i` gleich −2 wird, die dritte bei 64, die vierte nach einer Million (schneller) Durchläufe.
:::

## [python] Python-Blöcke

:::exercise id=a4-sum title="Summe von 1 bis n" level=1
Berechne `summe = 1 + 2 + … + n` mit einer **for-Schleife** (nicht mit der Formel n·(n+1)/2). Geprüft wird mit mehreren Werten von `n`, auch mit `n = 0` (Summe 0).
--- starter
n = 10

summe = 0
# Schleife hier
print(summe)
--- solution
n = 10

summe = 0
for i in range(1, n + 1):
    summe = summe + i
print(summe)
--- tests
@test("n = 10 → 55")
def _():
    eq(summe, 55, "summe")

@test("n = 1, 0, 100")
def _():
    for n2, exp in [(1, 1), (0, 0), (100, 5050)]:
        ns, out = run_again(n=n2)
        eq(ns["summe"], exp, f"summe für n = {n2}")

@test("Eine Schleife wird verwendet")
def _():
    ok("for" in SOURCE or "while" in SOURCE, "Verwende eine Schleife.")
--- hint
`range(1, n + 1)` liefert die Zahlen 1 bis n.
--- explain
Der Akkumulator `summe` startet bei 0, und jedes `i` wird einmal dazuaddiert. Bei `n = 0` ist `range(1, 1)` leer, der Schleifenrumpf läuft also nie, und `summe` bleibt 0.
:::

:::exercise id=a4-divisors title="Teiler zählen" level=1
Zähle, wie viele Teiler die Zahl `n` hat, und speichere das Ergebnis in `anzahl`. Ein Teiler `i` ist eine Zahl von 1 bis n mit `n % i == 0`. Beispiel: 12 hat die Teiler 1, 2, 3, 4, 6, 12 → `anzahl = 6`.

Setze dann `ist_primzahl` genau dann auf `True`, wenn `n` genau 2 Teiler hat.
--- starter
n = 12

anzahl = 0
ist_primzahl = False
print(anzahl, ist_primzahl)
--- solution
n = 12

anzahl = 0
for i in range(1, n + 1):
    if n % i == 0:
        anzahl = anzahl + 1
ist_primzahl = anzahl == 2
print(anzahl, ist_primzahl)
--- tests
@test("12 hat 6 Teiler und ist keine Primzahl")
def _():
    eq((anzahl, ist_primzahl), (6, False), "(anzahl, ist_primzahl)")

@test("1, 2, 13, 36, 97")
def _():
    for n2, exp in [(1, (1, False)), (2, (2, True)), (13, (2, True)), (36, (9, False)), (97, (2, True))]:
        ns, out = run_again(n=n2)
        eq((ns["anzahl"], ns["ist_primzahl"]), exp, f"für n = {n2}")
--- hint
Das Zählermuster: `anzahl = 0` vor der Schleife, `anzahl = anzahl + 1` in einem `if`.
--- explain
Das `if` in der Schleife filtert die Zahlen; nur Teiler erhöhen den Zähler. `anzahl == 2` ist bereits ein Wahrheitswert.
:::

:::exercise id=a4-ggt title="ggT mit einer while-Schleife (Euklid)" level=2
Den größten gemeinsamen Teiler (ggT) zweier Zahlen berechnet man mit der Regel von Euklid:

*Solange `b` nicht 0 ist: Ersetze `(a, b)` durch `(b, a % b)`. Am Ende ist `a` der ggT.*

Setze das mit einer `while`-Schleife um und speichere das Ergebnis in `ggt`. Beispiel: ggT(24, 15): (24, 15) → (15, 9) → (9, 6) → (6, 3) → (3, 0) → **3**.

Die *rekursive* Version genau dieser Regel schreibst du in Lektion B1.
--- starter
a = 24
b = 15

# while-Schleife hier

ggt = a
print(ggt)
--- solution
a = 24
b = 15

while b != 0:
    a, b = b, a % b

ggt = a
print(ggt)
--- tests
@test("ggT(24, 15) = 3")
def _():
    eq(ggt, 3, "ggt")

@test("Andere Paare, auch teilerfremde Zahlen und b > a")
def _():
    for a2, b2, exp in [(48, 18, 6), (7, 13, 1), (12, 48, 12), (100, 75, 25), (9, 0, 9)]:
        ns, out = run_again(a=a2, b=b2)
        eq(ns["ggt"], exp, f"ggt für a={a2}, b={b2}")
--- hint
In der Schleife müssen sich beide Werte *gleichzeitig* ändern. `a, b = b, a % b` macht das. Mit einer Hilfsvariablen: `rest = a % b`, `a = b`, `b = rest`.
--- explain
Jeder Durchlauf ersetzt das Paar durch ein kleineres Paar mit demselben ggT. Weil `a % b < b` ist, schrumpft die zweite Zahl jedes Mal und erreicht schließlich 0; die Schleife endet also garantiert.
:::

:::exercise id=a4-triangle title="Ein Dreieck aus Sternen" level=2
Gib ein Dreieck mit `n` Zeilen aus; Zeile `k` (ab 1 gezählt) enthält `k` Sterne. Für `n = 4`:

```out
*
**
***
****
```

Verwende eine Schleife. Tipp: `"*" * 3` ist in Python `"***"`.
--- starter
n = 4

--- solution
n = 4

for k in range(1, n + 1):
    print("*" * k)
--- tests
@test("n = 4 gibt das Dreieck aus")
def _():
    eq(lines(OUTPUT), ["*", "**", "***", "****"], "ausgegebene Zeilen")

@test("n = 1 und n = 6")
def _():
    ns, out = run_again(n=1)
    eq(lines(out), ["*"], "Zeilen für n = 1")
    ns, out = run_again(n=6)
    eq(lines(out), ["*" * k for k in range(1, 7)], "Zeilen für n = 6")
--- hint
Ein `print` pro Zeile. Welche Werte muss die Schleifenvariable annehmen?
--- explain
`range(1, n + 1)` liefert die Zeilennummern 1 bis n, und `"*" * k` baut einen String aus k Sternen.
:::

:::exercise id=a4-endless title="Repariere die Endlosschleife" level=2
Dieses Programm soll die Zahlen 10, 8, 6, 4, 2 und dann `Start!` ausgeben. Es hört nie auf (probier **Ausführen** und schau dir die Meldung an). Behebe den Fehler mit einer möglichst kleinen Änderung.
--- starter
i = 10
while i != 0:
    print(i)
i = i - 2
print("Start!")
--- solution
i = 10
while i != 0:
    print(i)
    i = i - 2
print("Start!")
--- tests
@test("Gibt 10, 8, 6, 4, 2, Start! aus")
def _():
    eq(lines(OUTPUT), ["10", "8", "6", "4", "2", "Start!"], "ausgegebene Zeilen")
--- hint
Welche Zeilen gehören zum Schleifenrumpf? Schau auf die Einrückung.
--- explain
`i = i - 2` war nicht eingerückt und gehörte deshalb nicht zur Schleife. In der Schleife hat sich `i` nie geändert, und `i != 0` blieb für immer wahr. Nur die Einrückung entscheidet, was zur Schleife gehört.
:::

:::exercise id=a4-table title="Ein Einmaleins mit verschachtelten Schleifen" level=2
Gib das Einmaleins von 1 bis `n` aus: eine Zeile pro Reihe, die Produkte durch Leerzeichen getrennt. Für `n = 3`:

```out
1 2 3
2 4 6
3 6 9
```

Bau jede Zeile in der inneren Schleife als String zusammen. Achte auf die Leerzeichen: Am Zeilenende steht keins.
--- starter
n = 3

--- solution
n = 3

for zeile in range(1, n + 1):
    text = ""
    for spalte in range(1, n + 1):
        if spalte > 1:
            text = text + " "
        text = text + str(zeile * spalte)
    print(text)
--- tests
@test("n = 3")
def _():
    eq(lines(OUTPUT), ["1 2 3", "2 4 6", "3 6 9"], "ausgegebene Zeilen")

@test("n = 5")
def _():
    ns, out = run_again(n=5)
    eq(lines(out)[-1], "5 10 15 20 25", "letzte Zeile für n = 5")
    eq(len(lines(out)), 5, "Anzahl der Zeilen für n = 5")
--- hint
Äußere Schleife über die Zeilen. Für jede Zeile: Beginne mit `text = ""`, lass die innere Schleife die Produkte anhängen, dann `print(text)` nach der inneren Schleife.
--- hint
Damit am Ende kein Leerzeichen steht, füg das Leerzeichen *vor* jedem Produkt außer dem ersten ein.
--- explain
Die innere Schleife läuft für jede Zeile vollständig durch. Der Zeilentext wird *nach* der inneren Schleife ausgegeben, deshalb ist `print(text)` nur einmal eingerückt.
:::

## [exam] Klausurtraining

:::exam title="Eine while-Schleife nachvollziehen" points=5
Gib die Werte von `a`, `b` und `n` nach jedem Schleifendurchlauf und die Ausgabe am Ende an.

```python
a = 1
b = 1
n = 0
while b < 20:
    a, b = b, a + b
    n = n + 1
print(n, b)
```
--- solution
| Durchlauf | a | b | n |
|---|---|---|---|
| Start | 1 | 1 | 0 |
| 1 | 1 | 2 | 1 |
| 2 | 2 | 3 | 2 |
| 3 | 3 | 5 | 3 |
| 4 | 5 | 8 | 4 |
| 5 | 8 | 13 | 5 |
| 6 | 13 | 21 | 6 |

Nach Durchlauf 6 ist `b = 21`, und die Bedingung `b < 20` ist falsch. Ausgabe: `6 21`. (Das sind die Fibonacci-Zahlen.)
:::

:::exam title="range von Hand" points=3
Schreib die Zahlen auf, die `range(5)`, `range(3, 8)` und `range(8, 3, -2)` erzeugen. Schreib dann eine `for`-Schleife für „für i von 2 bis 6“.
--- solution
- `range(5)`: 0, 1, 2, 3, 4
- `range(3, 8)`: 3, 4, 5, 6, 7
- `range(8, 3, -2)`: 8, 6, 4
- „für i von 2 bis 6“ (6 eingeschlossen): `for i in range(2, 7):`
:::
