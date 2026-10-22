---
id: a8
num: A8
part: A
title: Referenzen, None und Ketten von Objekten
short: Referenzen & None
lead: Variablen und Attribute enthalten keine Objekte, sie zeigen auf sie. Wenn du diese Pfeile siehst, ist eine verkettete Liste einfach eine Reihe von Objekten, die aufeinander zeigen. Diese Lektion bereitet das ganze Listenkapitel vor.
minutes: 60
uses: [a7]
goals:
  - für ein gegebenes Programm Objektdiagramme mit Referenzen (Pfeilen) zeichnen
  - den Unterschied zwischen <code>is</code> und <code>==</code> erklären und warum man <code>None</code> mit <code>is None</code> prüft
  - eine Kette von Objekten mit einem Attribut <code>nachfolger</code> aufbauen und mit einer while-Schleife durchlaufen
  - "<code>AttributeError: 'NoneType' object has no attribute …</code> verstehen und vermeiden"
---

## [logic] Variablen zeigen auf Objekte

In A2 haben wir gesagt, eine Variable ist ein Name mit einem Pfeil auf ihren Wert. Bei Objekten ist dieses Bild genau richtig: **Ein Objekt existiert für sich, und Variablen oder Attribute halten nur einen Verweis** (eine **Referenz**) darauf.

```python
p1 = Patient("Andi")
p2 = p1
p2.name = "Anna"
print(p1.NameGeben())   # Anna !
```

Es gibt nur **ein** `Patient`-Objekt. `p2 = p1` kopiert den *Pfeil*, nicht das Objekt. Wenn du das Objekt über `p2` änderst, siehst du das auch über `p1`, weil beide Pfeile auf dasselbe zeigen.

:::diagram objects caption="Zwei Variablen, ein Objekt"
var p1 -> obj @0,0
var p2 -> obj @0,0.45
obj: PATIENT @1,0 | name = "Anna"
:::

### `None`: ein Pfeil ins Nichts

`None` bedeutet **keine Referenz**: Die Variable oder das Attribut existiert, zeigt aber auf kein Objekt. In Objektdiagrammen schreibst du `None` (oder zeichnest keinen Pfeil).

### Objekte, die auf Objekte zeigen

Ein Attribut kann auch eine Referenz auf ein anderes Objekt enthalten. So werden Objekte verbunden: Eine **Beziehung** (Assoziation) zwischen Klassen wird in Python zu einem Referenzattribut.

```python
class Patient:
    def __init__(self, s):
        self.name = s
        self.nachfolger = None      # noch kein Nachfolger

a = Patient("Andi")
b = Patient("Bert")
c = Patient("Clara")
a.nachfolger = b
b.nachfolger = c
```

:::diagram objects caption="Eine Kette: Jeder Patient zeigt auf den nächsten; der letzte hat nachfolger = None"
var anfang -> a @0,0.2
a: PATIENT @0.75,0 | name = "Andi" | nachfolger -> b
b: PATIENT @1.85,0 | name = "Bert" | nachfolger -> c
c: PATIENT @2.95,0 | name = "Clara" | nachfolger = None
:::

Diese Kette **ist** die Warteschlange aus Kapitel II („Lösung ohne Feld“): keine Liste, kein Feld, nur Objekte, die ihren Nachfolger kennen. Um zu Clara zu kommen, beginnst du bei Andi und folgst den Pfeilen: `a.nachfolger.nachfolger`.

Im Klassendiagramm wird eine solche Referenz auf die eigene Klasse als Pfeil von der Klasse zurück zu sich selbst gezeichnet:

:::diagram classes caption="PATIENT kennt (höchstens) einen nachfolger der eigenen Klasse"
class PATIENT @0,0 | name: ZEICHENKETTE; nachfolger: PATIENT | NachfolgerSetzen(nf: PATIENT); NachfolgerGeben(): PATIENT
assoc PATIENT -> PATIENT : nachfolger [0..1]
:::

## [logic] Eine Kette entlanglaufen

Wie besuchst du jedes Objekt einer Kette, wenn du nur das erste kennst? Mit einer Hilfsvariablen, die von Objekt zu Objekt wandert:

```pseudo
k = anfang
solange k ≠ nichts
    ausgeben k.name
    k = k.nachfolger
endesolange
```

1. `k` beginnt beim ersten Objekt.
2. Solange `k` auf ein Objekt zeigt: verarbeite es, dann lass `k` auf seinen Nachfolger zeigen.
3. Nach dem letzten Objekt wird `k` zu `None`, und die Schleife endet.

Die Hilfsvariable `k` wandert, die Kette selbst bleibt unverändert. Das `A00_Arzt.py` deiner Lehrkraft endet mit genau dieser Schleife.

## [python] Referenzen in Python

:::trace title="Eine Kette aufbauen und durchlaufen"
class Patient:
    def __init__(self, s):
        self.name = s
        self.nachfolger = None


a = Patient("Andi")
b = Patient("Bert")
a.nachfolger = b
b.nachfolger = Patient("Clara")

k = a
while k is not None:
    print(k.name)
    k = k.nachfolger
:::

### `is` gegen `==`

- `x == y` fragt: **Haben sie gleiche Werte?**
- `x is y` fragt: **Sind sie genau dasselbe Objekt?** (Zeigen beide Pfeile auf dasselbe?)

Von `None` gibt es nur ein einziges Objekt, deshalb lautet die richtige Prüfung `x is None` / `x is not None`. Deine Kursvorlagen verwenden immer diese Form, und dieser Kurs auch. (`x == None` funktioniert meistens auch, gilt aber als schlechter Stil.)

### Der häufigste Fehler in Kapitel II

```python
leer = None
leer.NachfolgerGeben()     # AttributeError: 'NoneType' object has no attribute 'NachfolgerGeben'
```

Auf `None` kann man keine Methode aufrufen, weil es kein Objekt gibt. Dieser Fehler bedeutet immer: **Eine Referenz, von der du erwartet hast, dass sie auf ein Objekt zeigt, ist leer.** In einer Warteschlange oder Liste passiert das in den Sonderfällen:

| Situation | `None`-Referenz |
|---|---|
| leere Warteschlange / Liste | `anfang is None` (und `ende is None`) |
| letztes Element | `nachfolger is None` |
| Funktion hat das `return` vergessen | das Ergebnis ist `None` |

Bevor du also eine Methode über eine Referenz aufrufst, die `None` sein *könnte*, prüf sie: `if self.anfang is not None: …`.

### Objekte an Funktionen übergeben

Ein Funktionsparameter bekommt ebenfalls eine **Referenz**. Die Funktion kann das Objekt also ändern, und der Aufrufer sieht die Änderung:

```python
def umbenennen(p, neu):
    p.name = neu          # ändert das Objekt, das der Aufrufer übergeben hat

x = Patient("Andi")
umbenennen(x, "Anna")
print(x.name)             # Anna
```

Weist man dem Parameter dagegen ein *neues* Objekt zu, wird nur der lokale Pfeil umgehängt, und der Aufrufer merkt nichts davon (`p = Patient("Bob")` in der Funktion lässt `x` unverändert). Deshalb **geben** die rekursiven Listenmethoden in C3 den neuen Anfang der Restliste **zurück**, statt zu versuchen, „die Variable des Aufrufers zu ändern“.

### Objekte, auf die niemand zeigt

Wenn keine Variable und kein Attribut mehr auf ein Objekt zeigt, löscht Python es automatisch (Garbage Collection). Wenn ein Patient vorne aus der Warteschlange entfernt wird, indem `anfang` auf den zweiten Patienten gesetzt wird, verschwindet das erste Patientenobjekt einfach, solange nichts anderes darauf verweist.

:::quiz
Was liefert `a.nachfolger.name` nach diesen Zeilen?

```python
a = Patient("A")
b = Patient("B")
c = Patient("C")
a.nachfolger = b
b.nachfolger = c
a.nachfolger = c
```
- [ ] `'B'`
- [x] `'C'`
- [ ] `None`
- [ ] einen AttributeError
--- explain
Die letzte Zeile lenkt den Pfeil von `a` auf `c` um. Jetzt ist `a.nachfolger` gleich `c`, der Name also `'C'`. Objekt `b` zeigt noch auf `c`, aber auf `b` zeigt nichts mehr.
:::

:::quiz
Welche Schleife gibt **jeden** Namen der Kette ab `anfang` aus, auch den letzten, und funktioniert auch für eine leere Kette (`anfang is None`)?
- [ ] `k = anfang` · `while k.nachfolger is not None:` · `print(k.name)` · `k = k.nachfolger`
- [x] `k = anfang` · `while k is not None:` · `print(k.name)` · `k = k.nachfolger`
- [ ] `k = anfang.nachfolger` · `while k is not None:` · `print(k.name)` · `k = k.nachfolger`
- [ ] `while anfang is not None:` · `print(anfang.name)`
--- explain
Nur B prüft das aktuelle Objekt selbst. A lässt den letzten Namen aus und stürzt bei einer leeren Kette ab (`None.nachfolger`). C lässt den ersten Namen aus. D kommt nie weiter: Endlosschleife.
:::

## [python] Python-Blöcke

:::exercise id=a8-chain title="Eine Kette von Hand bauen" level=1
Die Klasse `Patient` hat `name` und `nachfolger`. Erzeuge drei Patienten **Andi → Bert → Clara**, in dieser Reihenfolge verkettet, und speichere den ersten in `anfang`. Gib dann alle Namen mit einer while-Schleife aus (einen pro Zeile).
--- starter
class Patient:
    def __init__(self, s):
        self.name = s
        self.nachfolger = None


anfang = None
--- solution
class Patient:
    def __init__(self, s):
        self.name = s
        self.nachfolger = None


a = Patient("Andi")
b = Patient("Bert")
c = Patient("Clara")
a.nachfolger = b
b.nachfolger = c
anfang = a

k = anfang
while k is not None:
    print(k.name)
    k = k.nachfolger
--- tests
@test("anfang ist Andi")
def _():
    ok(anfang is not None, "anfang ist None")
    eq(anfang.name, "Andi", "anfang.name")

@test("Die Kette ist Andi → Bert → Clara → None")
def _():
    names = []
    k = anfang
    while k is not None and len(names) < 10:
        names.append(k.name)
        k = k.nachfolger
    eq(names, ["Andi", "Bert", "Clara"], "Namen entlang der Kette")

@test("Das Programm gibt die drei Namen aus")
def _():
    eq(lines(OUTPUT), ["Andi", "Bert", "Clara"], "ausgegebene Zeilen")
--- hint
Erzeuge zuerst die drei Objekte, setze dann `a.nachfolger = b` und `b.nachfolger = c`.
--- explain
Die Objekte selbst bilden die Reihenfolge: Es ist keine Liste beteiligt. Drück **◫ Visualisieren**, um die drei Objekte und die Pfeile dazwischen zu sehen.
:::

:::exercise id=a8-length title="Die Kette zählen" level=1
Schreib `laenge(anfang)`, das zurückgibt, wie viele Objekte die Kette ab `anfang` hat. `anfang` darf `None` sein (leere Kette → 0).
--- starter
class Patient:
    def __init__(self, s):
        self.name = s
        self.nachfolger = None


def laenge(anfang):
    pass
--- solution
class Patient:
    def __init__(self, s):
        self.name = s
        self.nachfolger = None


def laenge(anfang):
    anzahl = 0
    k = anfang
    while k is not None:
        anzahl = anzahl + 1
        k = k.nachfolger
    return anzahl
--- tests
def kette(*names):
    first = None
    last = None
    for n in names:
        p = Patient(n)
        if first is None:
            first = p
        else:
            last.nachfolger = p
        last = p
    return first

@test("Eine Kette aus 3 hat die Länge 3")
def _():
    eq(laenge(kette("A", "B", "C")), 3, "laenge(A→B→C)")

@test("Leere Kette → 0, ein Element → 1")
def _():
    eq(laenge(None), 0, "laenge(None)")
    eq(laenge(kette("A")), 1, "laenge(A)")

@test("Die Kette wird nicht verändert")
def _():
    k = kette("A", "B")
    laenge(k)
    eq((k.name, k.nachfolger.name), ("A", "B"), "Kette nach dem Zählen")
--- hint
Zählermuster (A4) + Durchlaufmuster (diese Lektion).
--- explain
Die Hilfsvariable `k` wandert, der Zähler zählt. `anfang` selbst wird nie geändert, die Kette bleibt also intakt.
:::

:::exercise id=a8-last title="Das letzte Objekt" level=2
Schreib `letzter(anfang)`, das das **letzte** Objekt der Kette zurückgibt (das mit `nachfolger is None`), oder `None` bei einer leeren Kette.
--- starter
class Patient:
    def __init__(self, s):
        self.name = s
        self.nachfolger = None


def letzter(anfang):
    pass
--- solution
class Patient:
    def __init__(self, s):
        self.name = s
        self.nachfolger = None


def letzter(anfang):
    if anfang is None:
        return None
    k = anfang
    while k.nachfolger is not None:
        k = k.nachfolger
    return k
--- tests
def kette(*names):
    first = None
    last = None
    for n in names:
        p = Patient(n)
        if first is None:
            first = p
        else:
            last.nachfolger = p
        last = p
    return first

@test("letzter(A→B→C) ist C")
def _():
    r = letzter(kette("A", "B", "C"))
    ok(r is not None, "letzter hat None zurückgegeben")
    eq(r.name, "C", "letzter(...).name")

@test("letzter einer Kette mit einem Element ist dieses Element")
def _():
    k = kette("A")
    ok(letzter(k) is k, "letzter(A) muss das Objekt A selbst zurückgeben")

@test("letzter(None) ist None")
def _():
    eq(letzter(None), None, "letzter(None)")
--- hint
Diesmal muss die Schleife **beim** letzten Objekt anhalten, die Bedingung schaut also auf `k.nachfolger`, nicht auf `k`.
--- hint
Diese Bedingung stürzt ab, wenn `k` selbst `None` ist; behandle deshalb zuerst die leere Kette.
--- explain
Um das letzte Objekt zu finden, läufst du weiter, *solange es einen Nachfolger gibt*. Weil `k.nachfolger` ausgewertet wird, muss die leere Kette vor der Schleife behandelt werden. Genau dieses Problem löst die Warteschlange mit einer zusätzlichen Referenz `ende`.
:::

:::exercise id=a8-append title="Hinten anhängen" level=2
Schreib `anhaengen(anfang, neu)`, das das Objekt `neu` ans Ende der Kette hängt und **das erste Objekt der entstandenen Kette zurückgibt**. Ist die Kette leer (`anfang is None`), wird `neu` selbst das erste Objekt.

Verwendung: `anfang = anhaengen(anfang, Patient("Dora"))`
--- starter
class Patient:
    def __init__(self, s):
        self.name = s
        self.nachfolger = None


def anhaengen(anfang, neu):
    pass
--- solution
class Patient:
    def __init__(self, s):
        self.name = s
        self.nachfolger = None


def anhaengen(anfang, neu):
    if anfang is None:
        return neu
    k = anfang
    while k.nachfolger is not None:
        k = k.nachfolger
    k.nachfolger = neu
    return anfang
--- tests
def namen(k):
    out = []
    while k is not None and len(out) < 20:
        out.append(k.name)
        k = k.nachfolger
    return out

@test("An eine leere Kette anhängen")
def _():
    a = anhaengen(None, Patient("A"))
    eq(namen(a), ["A"], "Kette")

@test("Dreimal anhängen")
def _():
    a = None
    for n in ["A", "B", "C"]:
        a = anhaengen(a, Patient(n))
    eq(namen(a), ["A", "B", "C"], "Kette")

@test("Das erste Objekt bleibt das erste Objekt")
def _():
    first = Patient("A")
    r = anhaengen(first, Patient("B"))
    ok(r is first, "anhaengen muss das ursprüngliche erste Objekt zurückgeben")
--- hint
Zwei Fälle: leere Kette (gib `neu` zurück), sonst lauf zum letzten Objekt (wie bei `letzter`) und setze dessen `nachfolger`.
--- explain
Warum den Anfang zurückgeben? Weil sich bei einer leeren Kette der Anfang *ändert* (von `None` zu `neu`), und eine Funktion kann die Variable des Aufrufers nicht ändern. Der Aufrufer schreibt `anfang = anhaengen(anfang, ...)`. Genau diese Idee, „gib den neuen Anfang zurück“, steckt in allen rekursiven Listenmethoden in C3 und C4.
:::

## [exam] Klausurtraining

::::exam title="Objektdiagramm nach einem Programm" points=5
Zeichne das Objektdiagramm **nach** der letzten Zeile. Welche Objekte sind von `start` aus nicht mehr erreichbar?

```python
p = Patient("P")
q = Patient("Q")
r = Patient("R")
start = p
p.nachfolger = q
q.nachfolger = r
r.nachfolger = None
start = q
q.nachfolger = p
p.nachfolger = None
```
--- solution
Endgültige Referenzen: `start → q`, `q.nachfolger → p`, `p.nachfolger = None`, `r.nachfolger = None`.

:::diagram objects
var start -> q @0,0.2
q: PATIENT @0.7,0 | name = "Q" | nachfolger -> p
p: PATIENT @1.8,0 | name = "P" | nachfolger = None
r: PATIENT @1.8,1.1 | name = "R" | nachfolger = None
:::

Von `start` aus erreichst du Q und dann P. **R** ist nicht mehr erreichbar (keine Referenz zeigt darauf), deshalb löscht Python es.
::::
