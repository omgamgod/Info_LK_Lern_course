---
id: c3
num: C3
part: C
title: Die einfach verkettete Liste
short: Verkettete Liste
lead: Eine Liste kann mehr als eine Warteschlange. Man kann überall einfügen und entfernen, suchen und die Elemente sortiert halten. Ihre Methoden werden rekursiv geschrieben, wobei jeder Knoten seinen Teil erledigt und den Rest an seinen Nachfolger weitergibt. Diese Lektion baut die vollständige Liste deiner Vorlage 1_5_A00_Liste_ohne_Kompositum, einschließlich der Technik „gib den neuen Rest zurück“.
minutes: 110
uses: [c2, b1, a8]
goals:
  - den Unterschied zwischen dem iterativen Durchlaufen einer Liste und dem rekursiven Delegieren an die Knoten erklären
  - VorneEinfügen, HintenEinfügen, LängeGeben, InformationAusgeben, Suchen rekursiv implementieren
  - das Muster <code>nachfolger = nachfolger.Methode(…)</code> / <code>return self</code> für EinfügenVor, SortiertEinfügen, KnotenEntfernen und EndeEntfernen anwenden
  - Sequenzdiagramme rekursiver Listenmethoden zeichnen
  - erkennen, warum die vielen <code>None</code>-Prüfungen das Kompositum motivieren
---

## [logic] Von der Warteschlange zur Liste

Eine Warteschlange erlaubt nur *Einfügen am Ende* und *Entfernen am Anfang*. Eine **Liste** erlaubt viel mehr: vorne, hinten oder vor einem bestimmten Element einfügen, ein beliebiges Element entfernen, suchen, die Elemente sortiert halten, die Länge bestimmen.

Dein Kurs verwendet die **einfach verkettete Liste**: Knoten wie in C2, jeder Knoten kennt nur seinen **Nachfolger** (nicht seinen Vorgänger, daher *einfach*). Das Listenobjekt kennt nur seinen ersten Knoten, `anfang`, und hat **keine** Referenz `ende`.

:::diagram objects caption="Eine Liste mit drei Knoten (Struktur und Daten getrennt)"
l: LISTE @0,0 | anfang -> k1
k1: KNOTEN @1,0 | daten -> d1 | nachfolger -> k2
k2: KNOTEN @2.15,0 | daten -> d2 | nachfolger -> k3
k3: KNOTEN @3.3,0 | daten -> d3 | nachfolger = None
d1: PATIENT @1,1.15 | name = "Andi"
d2: PATIENT @2.15,1.15 | name = "Bert"
d3: PATIENT @3.3,1.15 | name = "Clara"
:::

**Einstieg (12_II_3)**: Wie fügt man ohne `ende` hinten ein, oder wie zählt man die Elemente? Dein Kurs macht ein **Rollenspiel**: Schüler stehen in einer Reihe, jeder kennt nur die Person direkt hinter sich. Die Liste (die Lehrkraft) kennt nur den ersten Schüler. Zum Zählen fragt die Lehrkraft den ersten Schüler *„Wie viele seid ihr, von dir bis zum Ende?“* Der Schüler kann die ganze Reihe nicht sehen, also stellt er der Person hinter sich dieselbe Frage, und so weiter. Der letzte Schüler antwortet *„1, nur ich.“* Jeder Schüler addiert dann 1 und gibt die Antwort nach vorne weiter.

Das ist wieder die Rekursion aus B1, diesmal entlang der Objekte der Liste.

## [logic] Zwei Arten, eine Liste entlang zu arbeiten

**1. Iterativ (die Liste läuft).** Die Liste verwendet eine Hilfsvariable, die von Knoten zu Knoten wandert, wie in A8 und C1. Die Knoten sind passiv: Sie bieten nur `NachfolgerGeben()` und `DatenelementGeben()` an.

**2. Rekursiv (die Knoten delegieren).** Die Liste schickt eine Nachricht an ihren ersten Knoten. Jeder Knoten erledigt **seinen eigenen kleinen Teil** und **gibt den Rest der Arbeit** an seinen Nachfolger weiter. Der letzte Knoten behandelt das Rekursionsende. Jeder Knoten führt dieselbe Methode aus, die Methode ruft sich also beim nächsten Objekt selbst auf.

:::cols
```python
# 1. iterativ, in der Klasse Liste
def LaengeGeben(self):
    anzahl = 0
    k = self.anfang
    while k is not None:
        anzahl += 1
        k = k.NachfolgerGeben()
    return anzahl
```
--- col
```python
# 2. rekursiv, Liste delegiert an Knoten
# class Liste:
def LaengeGeben(self):
    if self.anfang is not None:
        return self.anfang.RestlaengeGeben()
    return 0

# class Knoten:
def RestlaengeGeben(self):
    if self.nachfolger is None:
        return 1                  # Rekursionsende
    return 1 + self.nachfolger.RestlaengeGeben()
```
:::

Dein Kurs (und seine Klausuren) verwendet die **rekursive** Version. Um sie zu verstehen, braucht man ein **Sequenzdiagramm**: Jeder Aufruf geht einen Knoten weiter, und die Antworten wandern zurück.

:::diagram seq caption="LaengeGeben() bei einer Liste mit drei Knoten"
actors: Aufrufer | l: LISTE | k1: KNOTEN | k2: KNOTEN | k3: KNOTEN
Aufrufer -> l: LaengeGeben()
l -> k1: RestlaengeGeben()
k1 -> k2: RestlaengeGeben()
k2 -> k3: RestlaengeGeben()
k3 --> k2: 1
k2 --> k1: 2
k1 --> l: 3
l --> Aufrufer: 3
:::

## [logic] Die rekursiven Listenmethoden

Jede Methode ist aufgeteilt in `Liste` (Start: Ist die Liste leer? Wenn nicht, frag den ersten Knoten) und `Knoten` (Rekursionsende + Rekursionsschritt). Die Tabelle folgt deiner Vorlage `1_5_A00_Liste_ohne_Kompositum.py`:

| Methode | in KNOTEN: Rekursionsende | in KNOTEN: Rekursionsschritt |
|---|---|---|
| `RestlaengeGeben()` | kein nachfolger → 1 | 1 + nachfolger.RestlaengeGeben() |
| `HintenEinfuegen(d)` | kein nachfolger → nachfolger = neuer Knoten(d) | nachfolger.HintenEinfuegen(d) |
| `InformationAusgeben()` | eigene Daten ausgeben; kein nachfolger → fertig | eigene Daten ausgeben, dann nachfolger.InformationAusgeben() |
| `Suchen(schlüssel)` | eigene Daten passen → zurückgeben; kein nachfolger → None | return nachfolger.Suchen(schlüssel) |
| `EndeGeben()` | kein nachfolger → eigene Daten zurückgeben | return nachfolger.EndeGeben() |

Zwei Methoden brauchen keine Rekursion, weil sie nur den Anfang betreffen:

- `VorneEinfuegen(d)`: `anfang = Knoten(d, anfang)`: Der neue Knoten zeigt auf den alten ersten Knoten und wird der neue erste Knoten. Das funktioniert auch bei der leeren Liste (dann war `anfang` gleich `None`).
- `AnfangEntfernen()`: `anfang.DatenelementGeben()` merken, dann `anfang = anfang.NachfolgerGeben()`.

### Die Schlüsseltechnik: den neuen Rest zurückgeben

Manche Methoden ändern die Kette **irgendwo in der Mitte**: vor einem bestimmten Element einfügen, sortiert halten, ein Element entfernen, das letzte entfernen. Das Problem: Die Änderung muss am Knoten **vor** der Stelle gemacht werden, aber ein Knoten kennt nur seinen Nachfolger, nicht seinen Vorgänger.

Die Lösung ist elegant: Jeder Knoten gibt **den Knoten zurück, der ab jetzt an seiner Stelle stehen soll**, und jeder Aufrufer speichert den zurückgegebenen Knoten als seinen Nachfolger:

```python
self.nachfolger = self.nachfolger.Methode(...)    # in Knoten
self.anfang = self.anfang.Methode(...)            # in Liste
```

- Ändert sich an diesem Knoten nichts, gibt er **sich selbst** zurück (`return self`), und der `nachfolger` des Aufrufers bleibt gleich.
- Muss ein neuer Knoten **vor** diesem Knoten stehen, gibt er den **neuen Knoten** zurück (dessen Nachfolger der aktuelle Knoten ist).
- Muss dieser Knoten **verschwinden**, gibt er seinen **Nachfolger** zurück, und der Aufrufer überspringt ihn.

:::key
`nachfolger = nachfolger.Methode(…)` liest sich so: *„Nachfolger, erledige die Arbeit in deinem Teil der Liste und sag mir, wer danach mein Nachfolger ist.“* Die Liste macht dasselbe mit `anfang`. Deshalb muss die Liste keinen Sonderfall für „vor dem ersten Element einfügen“ oder „das erste Element entfernen“ behandeln.
:::

**EinfügenVor(dNeu, dVergleich)** (dNeu vor dem Element dVergleich einfügen):

```pseudo
methode EinfügenVor(dNeu, dVergleich) -> KNOTEN       // in KNOTEN
    falls daten ≠ dVergleich dann
        falls nachfolger ≠ nichts dann
            nachfolger = nachfolger.EinfügenVor(dNeu, dVergleich)
        sonst
            HintenEinfügen(dNeu)                       // nicht gefunden: anhängen
        endefalls
        return selbst
    sonst
        return neu KNOTEN(dNeu, selbst)               // gefunden: der neue Knoten nimmt meinen Platz ein
    endefalls
endemethode
```

:::diagram objects caption="EinfügenVor(Dora, Bert): k2 enthält Bert und gibt einen neuen Knoten zurück …"
k1: KNOTEN @0,0 | daten = "Andi" | nachfolger -> k2
k2: KNOTEN @1.2,0 ! | daten = "Bert" | nachfolger -> k3
k3: KNOTEN @2.4,0 | daten = "Clara" | nachfolger = None
kNeu: KNOTEN @1.2,1 | daten = "Dora" | nachfolger => k2
:::

:::diagram objects caption="… und k1 speichert ihn: k1.nachfolger = zurückgegebener Knoten"
k1: KNOTEN @0,0 | daten = "Andi" | nachfolger => kNeu
kNeu: KNOTEN @1.2,0 | daten = "Dora" | nachfolger -> k2
k2: KNOTEN @2.4,0 | daten = "Bert" | nachfolger -> k3
k3: KNOTEN @3.6,0 | daten = "Clara" | nachfolger = None
:::

**EndeEntfernen()**: Der letzte Knoten muss verschwinden, also gibt er `None` zurück (im Kompositum später: das Abschlussobjekt). Jeder andere Knoten speichert, was sein Nachfolger zurückgibt, und gibt sich selbst zurück.

```pseudo
methode EndeEntfernen() -> KNOTEN       // in KNOTEN
    falls nachfolger == nichts dann
        return nichts                    // ich bin der letzte: überspring mich
    sonst
        nachfolger = nachfolger.EndeEntfernen()
        return selbst
    endefalls
endemethode
```

:::warn title="Typischer Fehler: das return this der Vorlage und return self.nachfolger"
Die Python-Vorlage beendet `EndeEntfernen` mit `return this`; das ist Java und ergibt in Python einen NameError. Es durch `return self.nachfolger` zu ersetzen ist eine verlockende, aber falsche Korrektur: Dann entfernt sich jeder Knoten **selbst** (er gibt seinen Nachfolger statt sich selbst zurück), und die ganze Liste verschwindet. Jeder Knoten, der **nicht** der letzte ist, muss **sich selbst** zurückgeben: `return self`.
:::

Probier alle Operationen aus und beobachte rechts die aktiven Aufrufe und den zurückgegebenen Knoten:

:::viz listops
{"mode": "list", "init": ["Andi", "Bert", "Clara"]}
:::

:::quiz
Die Liste enthält k1 (A), k2 (B), k3 (C). Die Liste ruft `anfang = anfang.KnotenEntfernen(A)` auf. Was gibt k1 zurück?
- [ ] sich selbst (k1), weil sich an k1 nichts ändert
- [x] k2, seinen Nachfolger: k1 verschwindet, und die Liste speichert k2 als neuen anfang
- [ ] None, weil k1 entfernt wird
- [ ] nichts; die Liste muss anfang selbst setzen
--- explain
k1 enthält das zu entfernende Element, also gibt es seinen Nachfolger k2 zurück. Die Liste speichert den zurückgegebenen Knoten in `anfang`. In der Liste ist kein Sonderfall „erstes Element entfernen“ nötig; das erledigt der Rückgabewert.
:::

:::quiz
In welcher dieser Methoden braucht ein Knoten das Muster `nachfolger = nachfolger.Methode(…)` **nie**?
- [ ] EndeEntfernen
- [ ] SortiertEinfügen
- [x] HintenEinfügen
- [ ] KnotenEntfernen
--- explain
HintenEinfügen ändert nur den **letzten** Knoten, und der kann seinen eigenen `nachfolger` direkt ändern (`nachfolger = neu KNOTEN(d)`). Bei den anderen drei muss eventuell die Verbindung des Knotens **vor** dem aktuellen geändert werden, und das geht nur über den Rückgabewert.
:::

### Sortiert einfügen und ein Element entfernen

Dasselbe Muster löst zwei weitere Aufgaben deiner Vorlage:

- **SortiertEinfügen(dNeu)**: Solange meine Daten kleiner sind als die neuen (`daten.IstKleinerAls(dNeu)`), gib weiter; sonst nimmt der neue Knoten meinen Platz ein: `return Knoten(dNeu, self)`. Bin ich der letzte Knoten, häng an. Die Liste bleibt sortiert.
- **KnotenEntfernen(d)**: Sind meine Daten die zu entfernenden, gib meinen Nachfolger zurück (ich verschwinde); sonst `nachfolger = nachfolger.KnotenEntfernen(d)` und `return self`.

### Was uns noch stört

Zähl die `if … is None`-Prüfungen: Die Liste prüft in **jeder** Methode `anfang is not None`, und der Knoten prüft in fast jeder Methode `nachfolger is not None`. Vergisst man eine, gibt es den AttributeError aus Lektion A8. Die nächste Lektion beseitigt sie alle mit einem Entwurfsmuster.

## [bridge] Vom Pseudocode zur Vorlage

:::bridge title="HintenEinfuegen und RestlaengeGeben"
// LISTE                                  || # class Liste
methode HintenEinfügen(dneu)              || def HintenEinfuegen(self, dneu):
    falls anfang ≠ nichts dann            ||     if self.anfang:
        anfang.HintenEinfügen(dneu)       ||         self.anfang.HintenEinfuegen(dneu)
    sonst                                 ||     else:
        anfang = neu KNOTEN(dneu)         ||         self.anfang = Knoten(dneu)
// KNOTEN                                 || # class Knoten
methode HintenEinfügen(dneu)              || def HintenEinfuegen(self, dneu):
    falls nachfolger ≠ nichts dann        ||     if self.nachfolger is not None:
        nachfolger.HintenEinfügen(dneu)   ||         self.nachfolger.HintenEinfuegen(dneu)
    sonst                                 ||     else:
        nachfolger = neu KNOTEN(dneu)     ||         self.nachfolger = Knoten(dneu)
>> In Python-Code begegnen dir sowohl `if self.anfang:` als auch `if self.anfang is not None:`; bei Objektreferenzen bedeuten beide dasselbe (Lektion A3). Derselbe Methodenname kommt in beiden Klassen vor: `Liste.HintenEinfuegen` startet die Arbeit, `Knoten.HintenEinfuegen` ist die rekursive Methode.
:::

:::bridge title="EinfuegenVor (Vorlage)"
// KNOTEN                                         || # class Knoten
methode EinfügenVor(dneu, dVergleich) -> KNOTEN   || def EinfuegenVor(self, dneu, d_vergleich):
    falls daten ≠ dVergleich dann                 ||     if self.daten != d_vergleich:
        falls nachfolger ≠ nichts dann            ||         if self.nachfolger:
            nachfolger = nachfolger.EinfügenVor(…)||             self.nachfolger = self.nachfolger.EinfuegenVor(dneu, d_vergleich)
        sonst                                     ||         else:
            HintenEinfügen(dneu)                  ||             self.HintenEinfuegen(dneu)
        return selbst                             ||         return self
    sonst                                         ||     else:
        return neu KNOTEN(dneu, selbst)           ||         return Knoten(dneu, self)
// LISTE                                          || # class Liste
methode EinfügenVor(dneu, dVergleich)             || def EinfuegenVor(self, dneu, d_vergleich):
    falls anfang ≠ nichts dann                    ||     if self.anfang:
        anfang = anfang.EinfügenVor(…)            ||         self.anfang = self.anfang.EinfuegenVor(dneu, d_vergleich)
    sonst VorneEinfügen(dneu)                     ||     else:
                                                  ||         self.VorneEinfuegen(dneu)
>> `Knoten(dneu, self)` verwendet den zweiten Konstruktorparameter `kNeu` (Standardwert `None`): Der neue Knoten bekommt den aktuellen Knoten als Nachfolger.
:::

## [python] Python-Blöcke

Alle Blöcke verwenden dieselbe Datenklasse (im Startcode gegeben):

```python
class Patient:
    def __init__(self, s):
        self.name = s
    def InformationAusgeben(self):
        print(self.name)
    def SchluesselIstGleich(self, gesuchterWert):
        return self.name == gesuchterWert
    def IstKleinerAls(self, dvergleich):
        return self.name < dvergleich.name
```

Die Blöcke bauen die Liste deiner Vorlage Schritt für Schritt auf. Jeder Startcode enthält schon die Lösungen der vorherigen Blöcke.

:::exercise id=c3-length title="VorneEinfuegen und LaengeGeben" level=1
Implementiere

- `Liste.VorneEinfuegen(dneu)` (ohne Rekursion),
- `Knoten.RestlaengeGeben()` (rekursiv) und `Liste.LaengeGeben()` (0 bei der leeren Liste).
--- starter
class Patient:
    def __init__(self, s):
        self.name = s

    def InformationAusgeben(self):
        print(self.name)


class Knoten:
    def __init__(self, dNeu, kNeu=None):
        self.daten = dNeu
        self.nachfolger = kNeu

    def RestlaengeGeben(self):
        pass


class Liste:
    def __init__(self):
        self.anfang = None

    def VorneEinfuegen(self, dneu):
        pass

    def LaengeGeben(self):
        pass
--- solution
class Patient:
    def __init__(self, s):
        self.name = s

    def InformationAusgeben(self):
        print(self.name)


class Knoten:
    def __init__(self, dNeu, kNeu=None):
        self.daten = dNeu
        self.nachfolger = kNeu

    def RestlaengeGeben(self):
        if self.nachfolger is None:
            return 1
        return 1 + self.nachfolger.RestlaengeGeben()


class Liste:
    def __init__(self):
        self.anfang = None

    def VorneEinfuegen(self, dneu):
        self.anfang = Knoten(dneu, self.anfang)

    def LaengeGeben(self):
        if self.anfang is not None:
            return self.anfang.RestlaengeGeben()
        return 0
--- tests
def namen(l):
    out = []
    k = l.anfang
    while k is not None and len(out) < 30:
        out.append(k.daten.name)
        k = k.nachfolger
    return out

@test("Dreimal VorneEinfuegen: der letzte ist zuerst")
def _():
    l = Liste()
    for n in ["Clara", "Bert", "Andi"]:
        l.VorneEinfuegen(Patient(n))
    eq(namen(l), ["Andi", "Bert", "Clara"], "Liste")

@test("LaengeGeben: 0, 1, 3")
def _():
    l = Liste()
    eq(l.LaengeGeben(), 0, "leere Liste")
    l.VorneEinfuegen(Patient("A"))
    eq(l.LaengeGeben(), 1, "ein Knoten")
    l.VorneEinfuegen(Patient("B"))
    l.VorneEinfuegen(Patient("C"))
    eq(l.LaengeGeben(), 3, "drei Knoten")

@test("RestlaengeGeben ist rekursiv")
def _():
    l = Liste()
    for n in "ABCD":
        l.VorneEinfuegen(Patient(n))
    r, rec = recursive(l.anfang.RestlaengeGeben)
    ok(rec and r == 4, "RestlaengeGeben muss RestlaengeGeben des nachfolgers aufrufen")
--- hint
`VorneEinfuegen`: eine Zeile, mit dem zweiten Konstruktorparameter von `Knoten`.
--- hint
`RestlaengeGeben`: Rekursionsende „kein nachfolger“ → 1.
--- explain
`Knoten(dneu, self.anfang)` erzeugt einen Knoten, dessen Nachfolger der alte erste Knoten ist; das funktioniert auch bei der leeren Liste. Die Länge berechnen die Knoten selbst, wie im Rollenspiel.
:::

:::exercise id=c3-append title="HintenEinfuegen" level=1
Implementiere `HintenEinfuegen(dneu)` in **beiden** Klassen, rekursiv wie in der Brücke.
--- starter
class Patient:
    def __init__(self, s):
        self.name = s


class Knoten:
    def __init__(self, dNeu, kNeu=None):
        self.daten = dNeu
        self.nachfolger = kNeu

    def HintenEinfuegen(self, dneu):
        pass

    def RestlaengeGeben(self):
        if self.nachfolger is None:
            return 1
        return 1 + self.nachfolger.RestlaengeGeben()


class Liste:
    def __init__(self):
        self.anfang = None

    def HintenEinfuegen(self, dneu):
        pass

    def VorneEinfuegen(self, dneu):
        self.anfang = Knoten(dneu, self.anfang)

    def LaengeGeben(self):
        if self.anfang is not None:
            return self.anfang.RestlaengeGeben()
        return 0
--- solution
class Patient:
    def __init__(self, s):
        self.name = s


class Knoten:
    def __init__(self, dNeu, kNeu=None):
        self.daten = dNeu
        self.nachfolger = kNeu

    def HintenEinfuegen(self, dneu):
        if self.nachfolger is not None:
            self.nachfolger.HintenEinfuegen(dneu)
        else:
            self.nachfolger = Knoten(dneu)

    def RestlaengeGeben(self):
        if self.nachfolger is None:
            return 1
        return 1 + self.nachfolger.RestlaengeGeben()


class Liste:
    def __init__(self):
        self.anfang = None

    def HintenEinfuegen(self, dneu):
        if self.anfang is not None:
            self.anfang.HintenEinfuegen(dneu)
        else:
            self.anfang = Knoten(dneu)

    def VorneEinfuegen(self, dneu):
        self.anfang = Knoten(dneu, self.anfang)

    def LaengeGeben(self):
        if self.anfang is not None:
            return self.anfang.RestlaengeGeben()
        return 0
--- tests
def namen(l):
    out = []
    k = l.anfang
    while k is not None and len(out) < 30:
        out.append(k.daten.name)
        k = k.nachfolger
    return out

@test("HintenEinfuegen in die leere Liste")
def _():
    l = Liste()
    l.HintenEinfuegen(Patient("A"))
    eq(namen(l), ["A"], "Liste")

@test("HintenEinfuegen behält die Reihenfolge")
def _():
    l = Liste()
    for n in ["Andi", "Bert", "Clara", "Dora"]:
        l.HintenEinfuegen(Patient(n))
    eq(namen(l), ["Andi", "Bert", "Clara", "Dora"], "Liste")

@test("Gemischt mit VorneEinfuegen")
def _():
    l = Liste()
    l.HintenEinfuegen(Patient("B"))
    l.VorneEinfuegen(Patient("A"))
    l.HintenEinfuegen(Patient("C"))
    eq(namen(l), ["A", "B", "C"], "Liste")

@test("Knoten.HintenEinfuegen ist rekursiv")
def _():
    l = Liste()
    for n in "ABC":
        l.HintenEinfuegen(Patient(n))
    r, rec = recursive(l.anfang.HintenEinfuegen, Patient("D"))
    ok(rec, "Knoten.HintenEinfuegen muss HintenEinfuegen des nachfolgers aufrufen")
--- hint
Beide Methoden haben dieselbe Form: „Wenn es ein nächstes Objekt gibt, lass es die Arbeit machen; sonst erzeuge den Knoten hier.“
--- explain
Die Liste behandelt den Leer-Fall, jeder Knoten gibt die Arbeit entweder weiter oder erledigt sie (als letzter Knoten) selbst. Vergleiche mit der Schritt-für-Schritt-Visualisierung im Logik-Abschnitt.
:::

:::exercise id=c3-search title="InformationAusgeben, Suchen, EndeGeben" level=2
Ergänze rekursiv in `Knoten` (und die Startmethode in `Liste`):

- `InformationAusgeben()`: gibt alle Datenelemente von vorne nach hinten aus (jedes Datenelement gibt sich selbst aus)
- `Suchen(gesuchterWert)`: gibt das erste Datenelement mit `SchluesselIstGleich(gesuchterWert)` zurück, oder `None`
- `EndeGeben()`: gibt das Datenelement des letzten Knotens zurück (`None` bei der leeren Liste)
--- starter
class Patient:
    def __init__(self, s):
        self.name = s

    def InformationAusgeben(self):
        print(self.name)

    def SchluesselIstGleich(self, gesuchterWert):
        return self.name == gesuchterWert


class Knoten:
    def __init__(self, dNeu, kNeu=None):
        self.daten = dNeu
        self.nachfolger = kNeu

    def HintenEinfuegen(self, dneu):
        if self.nachfolger is not None:
            self.nachfolger.HintenEinfuegen(dneu)
        else:
            self.nachfolger = Knoten(dneu)

    def InformationAusgeben(self):
        pass

    def Suchen(self, gesuchterWert):
        pass

    def EndeGeben(self):
        pass


class Liste:
    def __init__(self):
        self.anfang = None

    def HintenEinfuegen(self, dneu):
        if self.anfang is not None:
            self.anfang.HintenEinfuegen(dneu)
        else:
            self.anfang = Knoten(dneu)

    def InformationAusgeben(self):
        pass

    def Suchen(self, gesuchterWert):
        pass

    def EndeGeben(self):
        pass
--- solution
class Patient:
    def __init__(self, s):
        self.name = s

    def InformationAusgeben(self):
        print(self.name)

    def SchluesselIstGleich(self, gesuchterWert):
        return self.name == gesuchterWert


class Knoten:
    def __init__(self, dNeu, kNeu=None):
        self.daten = dNeu
        self.nachfolger = kNeu

    def HintenEinfuegen(self, dneu):
        if self.nachfolger is not None:
            self.nachfolger.HintenEinfuegen(dneu)
        else:
            self.nachfolger = Knoten(dneu)

    def InformationAusgeben(self):
        self.daten.InformationAusgeben()
        if self.nachfolger is not None:
            self.nachfolger.InformationAusgeben()

    def Suchen(self, gesuchterWert):
        if self.daten.SchluesselIstGleich(gesuchterWert):
            return self.daten
        if self.nachfolger is not None:
            return self.nachfolger.Suchen(gesuchterWert)
        return None

    def EndeGeben(self):
        if self.nachfolger is None:
            return self.daten
        return self.nachfolger.EndeGeben()


class Liste:
    def __init__(self):
        self.anfang = None

    def HintenEinfuegen(self, dneu):
        if self.anfang is not None:
            self.anfang.HintenEinfuegen(dneu)
        else:
            self.anfang = Knoten(dneu)

    def InformationAusgeben(self):
        if self.anfang is not None:
            self.anfang.InformationAusgeben()

    def Suchen(self, gesuchterWert):
        if self.anfang is not None:
            return self.anfang.Suchen(gesuchterWert)
        return None

    def EndeGeben(self):
        if self.anfang is not None:
            return self.anfang.EndeGeben()
        return None
--- tests
def liste(*names):
    l = Liste()
    ps = [Patient(n) for n in names]
    for p in ps:
        l.HintenEinfuegen(p)
    return l, ps

@test("InformationAusgeben")
def _():
    l, ps = liste("Andi", "Bert", "Clara")
    eq(lines(printed(l.InformationAusgeben)), ["Andi", "Bert", "Clara"], "ausgegebene Zeilen")
    eq(printed(Liste().InformationAusgeben).strip(), "", "Ausgabe für die leere Liste")

@test("Suchen findet das Datenelement")
def _():
    l, ps = liste("Andi", "Bert", "Clara")
    ok(l.Suchen("Bert") is ps[1], "Suchen('Bert') muss das Patient-Objekt Bert zurückgeben")
    ok(l.Suchen("Clara") is ps[2], "Suchen('Clara')")
    eq(l.Suchen("Zoe"), None, "Suchen('Zoe')")
    eq(Liste().Suchen("X"), None, "Suchen in der leeren Liste")

@test("EndeGeben")
def _():
    l, ps = liste("Andi", "Bert", "Clara")
    ok(l.EndeGeben() is ps[2], "EndeGeben() muss Clara zurückgeben")
    eq(Liste().EndeGeben(), None, "EndeGeben() der leeren Liste")

@test("Knoten-Methoden sind rekursiv")
def _():
    l, ps = liste("A", "B", "C")
    r, rec = recursive(l.anfang.EndeGeben)
    ok(rec, "Knoten.EndeGeben muss EndeGeben des nachfolgers aufrufen")
    r, rec = recursive(l.anfang.Suchen, "C")
    ok(rec, "Knoten.Suchen muss Suchen des nachfolgers aufrufen")
--- hint
`Suchen` und `EndeGeben` müssen das Ergebnis des rekursiven Aufrufs mit `return` zurückgeben. Fehlt dieses `return`, kommt `None` heraus.
--- explain
Drei Methoden, dieselbe Struktur: meinen eigenen Teil erledigen, dann (wenn es einen Nachfolger gibt) delegieren. `Suchen` endet vorzeitig, wenn es das Element findet; das Ergebnis wird unverändert durch alle Rahmen zurückgereicht (endrekursiv, B1).
:::

:::exercise id=c3-remove-end title="AnfangEntfernen und EndeEntfernen" level=2
Implementiere

- `Liste.AnfangEntfernen()`: entfernt den ersten Knoten und gibt sein Datenelement zurück (`None`, wenn leer)
- `Knoten.EndeEntfernen()`: gibt die Restliste ohne den letzten Knoten zurück (das Muster aus dem Logik-Abschnitt)
- `Liste.EndeEntfernen()`: holt mit `EndeGeben()` das letzte Datenelement, dann `self.anfang = self.anfang.EndeEntfernen()`, gibt das Datenelement zurück (`None`, wenn leer)
--- starter
class Patient:
    def __init__(self, s):
        self.name = s


class Knoten:
    def __init__(self, dNeu, kNeu=None):
        self.daten = dNeu
        self.nachfolger = kNeu

    def HintenEinfuegen(self, dneu):
        if self.nachfolger is not None:
            self.nachfolger.HintenEinfuegen(dneu)
        else:
            self.nachfolger = Knoten(dneu)

    def EndeGeben(self):
        if self.nachfolger is None:
            return self.daten
        return self.nachfolger.EndeGeben()

    def EndeEntfernen(self):
        pass


class Liste:
    def __init__(self):
        self.anfang = None

    def HintenEinfuegen(self, dneu):
        if self.anfang is not None:
            self.anfang.HintenEinfuegen(dneu)
        else:
            self.anfang = Knoten(dneu)

    def AnfangEntfernen(self):
        pass

    def EndeEntfernen(self):
        pass
--- solution
class Patient:
    def __init__(self, s):
        self.name = s


class Knoten:
    def __init__(self, dNeu, kNeu=None):
        self.daten = dNeu
        self.nachfolger = kNeu

    def HintenEinfuegen(self, dneu):
        if self.nachfolger is not None:
            self.nachfolger.HintenEinfuegen(dneu)
        else:
            self.nachfolger = Knoten(dneu)

    def EndeGeben(self):
        if self.nachfolger is None:
            return self.daten
        return self.nachfolger.EndeGeben()

    def EndeEntfernen(self):
        if self.nachfolger is None:
            return None
        self.nachfolger = self.nachfolger.EndeEntfernen()
        return self


class Liste:
    def __init__(self):
        self.anfang = None

    def HintenEinfuegen(self, dneu):
        if self.anfang is not None:
            self.anfang.HintenEinfuegen(dneu)
        else:
            self.anfang = Knoten(dneu)

    def AnfangEntfernen(self):
        if self.anfang is not None:
            d = self.anfang.daten
            self.anfang = self.anfang.nachfolger
            return d
        return None

    def EndeEntfernen(self):
        if self.anfang is not None:
            d = self.anfang.EndeGeben()
            self.anfang = self.anfang.EndeEntfernen()
            return d
        return None
--- tests
def liste(*names):
    l = Liste()
    for n in names:
        l.HintenEinfuegen(Patient(n))
    return l

def namen(l):
    out = []
    k = l.anfang
    while k is not None and len(out) < 30:
        out.append(k.daten.name)
        k = k.nachfolger
    return out

@test("AnfangEntfernen")
def _():
    l = liste("A", "B", "C")
    eq(l.AnfangEntfernen().name, "A", "entfernt")
    eq(namen(l), ["B", "C"], "rest")
    eq(Liste().AnfangEntfernen(), None, "AnfangEntfernen der leeren Liste")

@test("EndeEntfernen entfernt nur den letzten Knoten")
def _():
    l = liste("A", "B", "C", "D")
    eq(l.EndeEntfernen().name, "D", "entfernt")
    eq(namen(l), ["A", "B", "C"], "rest")

@test("EndeEntfernen mit einem Knoten und mit einer leeren Liste")
def _():
    l = liste("A")
    eq(l.EndeEntfernen().name, "A", "entfernt")
    eq(l.anfang, None, "anfang danach")
    eq(Liste().EndeEntfernen(), None, "EndeEntfernen der leeren Liste")

@test("Die Liste von hinten leeren")
def _():
    l = liste("A", "B", "C")
    eq([l.EndeEntfernen().name for i in range(3)], ["C", "B", "A"], "nacheinander entfernt")
    eq(l.anfang, None, "anfang am Ende")
--- hint
`Knoten.EndeEntfernen`: letzter Knoten → `return None`. Sonst: `self.nachfolger = self.nachfolger.EndeEntfernen()` und **`return self`**.
--- explain
Nur der vorletzte Knoten merkt eine Änderung: Sein Nachfolger gibt `None` zurück, und das speichert er als neuen Nachfolger. Jeder andere Knoten bekommt von seinem Nachfolger diesen selbst zurück und behält seine Verbindung. In der Liste erledigt `self.anfang = self.anfang.EndeEntfernen()` den Fall „nur ein Knoten“ automatisch: Dann gibt der erste Knoten `None` zurück.
:::

:::exercise id=c3-before title="EinfuegenVor" level=2
Implementiere `EinfuegenVor(dneu, d_vergleich)` in beiden Klassen wie in der Brücke. Ist `d_vergleich` nicht in der Liste, wird `dneu` hinten angehängt; in einer leeren Liste wird es einfach das einzige Element. (Der Vergleich verwendet die Datenobjekte selbst: `self.daten != d_vergleich`.)
--- starter
class Patient:
    def __init__(self, s):
        self.name = s


class Knoten:
    def __init__(self, dNeu, kNeu=None):
        self.daten = dNeu
        self.nachfolger = kNeu

    def HintenEinfuegen(self, dneu):
        if self.nachfolger is not None:
            self.nachfolger.HintenEinfuegen(dneu)
        else:
            self.nachfolger = Knoten(dneu)

    def EinfuegenVor(self, dneu, d_vergleich):
        pass


class Liste:
    def __init__(self):
        self.anfang = None

    def HintenEinfuegen(self, dneu):
        if self.anfang is not None:
            self.anfang.HintenEinfuegen(dneu)
        else:
            self.anfang = Knoten(dneu)

    def VorneEinfuegen(self, dneu):
        self.anfang = Knoten(dneu, self.anfang)

    def EinfuegenVor(self, dneu, d_vergleich):
        pass
--- solution
class Patient:
    def __init__(self, s):
        self.name = s


class Knoten:
    def __init__(self, dNeu, kNeu=None):
        self.daten = dNeu
        self.nachfolger = kNeu

    def HintenEinfuegen(self, dneu):
        if self.nachfolger is not None:
            self.nachfolger.HintenEinfuegen(dneu)
        else:
            self.nachfolger = Knoten(dneu)

    def EinfuegenVor(self, dneu, d_vergleich):
        if self.daten != d_vergleich:
            if self.nachfolger is not None:
                self.nachfolger = self.nachfolger.EinfuegenVor(dneu, d_vergleich)
            else:
                self.HintenEinfuegen(dneu)
            return self
        return Knoten(dneu, self)


class Liste:
    def __init__(self):
        self.anfang = None

    def HintenEinfuegen(self, dneu):
        if self.anfang is not None:
            self.anfang.HintenEinfuegen(dneu)
        else:
            self.anfang = Knoten(dneu)

    def VorneEinfuegen(self, dneu):
        self.anfang = Knoten(dneu, self.anfang)

    def EinfuegenVor(self, dneu, d_vergleich):
        if self.anfang is not None:
            self.anfang = self.anfang.EinfuegenVor(dneu, d_vergleich)
        else:
            self.VorneEinfuegen(dneu)
--- tests
def namen(l):
    out = []
    k = l.anfang
    while k is not None and len(out) < 30:
        out.append(k.daten.name)
        k = k.nachfolger
    return out

def build():
    l = Liste()
    ps = {n: Patient(n) for n in ["Andi", "Bert", "Clara"]}
    for n in ["Andi", "Bert", "Clara"]:
        l.HintenEinfuegen(ps[n])
    return l, ps

@test("Vor einem Element in der Mitte einfügen")
def _():
    l, ps = build()
    l.EinfuegenVor(Patient("Dora"), ps["Bert"])
    eq(namen(l), ["Andi", "Dora", "Bert", "Clara"], "Liste")

@test("Vor dem ersten Element einfügen")
def _():
    l, ps = build()
    l.EinfuegenVor(Patient("Dora"), ps["Andi"])
    eq(namen(l), ["Dora", "Andi", "Bert", "Clara"], "Liste")

@test("Nicht gefunden: anhängen; leere Liste: einfügen")
def _():
    l, ps = build()
    l.EinfuegenVor(Patient("Dora"), Patient("Zoe"))
    eq(namen(l), ["Andi", "Bert", "Clara", "Dora"], "Liste nach dem Einfügen vor einem fehlenden Element")
    l2 = Liste()
    l2.EinfuegenVor(Patient("A"), Patient("X"))
    eq(namen(l2), ["A"], "leere Liste")

@test("Vor dem letzten Element")
def _():
    l, ps = build()
    l.EinfuegenVor(Patient("Dora"), ps["Clara"])
    eq(namen(l), ["Andi", "Bert", "Dora", "Clara"], "Liste")
--- hint
Gefunden (`self.daten == d_vergleich`): `return Knoten(dneu, self)`. Nicht gefunden: weitergeben (oder anhängen, wenn es keinen Nachfolger gibt) und `return self`.
--- explain
Der Knoten, der `d_vergleich` enthält, kann die Verbindung seines Vorgängers nicht ändern, deshalb **gibt** er den neuen Knoten **zurück**; der Vorgänger (oder die Liste) speichert ihn als seinen Nachfolger (oder als `anfang`).
:::

:::exercise id=c3-sorted title="SortiertEinfuegen und KnotenEntfernen" level=3
Implementiere mit demselben Muster:

- `SortiertEinfuegen(dneu)`: fügt so ein, dass die Liste nach Namen sortiert bleibt (verwende `daten.IstKleinerAls(dneu)`)
- `KnotenEntfernen(dvergleich)`: entfernt den Knoten, dessen Datenelement `dvergleich` **ist** (falls vorhanden)

jeweils in `Knoten` (rekursiv, gibt den neuen Rest zurück) und in `Liste`.
--- starter
class Patient:
    def __init__(self, s):
        self.name = s

    def IstKleinerAls(self, dvergleich):
        return self.name < dvergleich.name


class Knoten:
    def __init__(self, dNeu, kNeu=None):
        self.daten = dNeu
        self.nachfolger = kNeu

    def SortiertEinfuegen(self, dneu):
        pass

    def KnotenEntfernen(self, dvergleich):
        pass


class Liste:
    def __init__(self):
        self.anfang = None

    def SortiertEinfuegen(self, dneu):
        pass

    def KnotenEntfernen(self, dvergleich):
        pass
--- solution
class Patient:
    def __init__(self, s):
        self.name = s

    def IstKleinerAls(self, dvergleich):
        return self.name < dvergleich.name


class Knoten:
    def __init__(self, dNeu, kNeu=None):
        self.daten = dNeu
        self.nachfolger = kNeu

    def SortiertEinfuegen(self, dneu):
        if self.daten.IstKleinerAls(dneu):
            if self.nachfolger is not None:
                self.nachfolger = self.nachfolger.SortiertEinfuegen(dneu)
            else:
                self.nachfolger = Knoten(dneu)
            return self
        return Knoten(dneu, self)

    def KnotenEntfernen(self, dvergleich):
        if self.daten == dvergleich:
            return self.nachfolger
        if self.nachfolger is not None:
            self.nachfolger = self.nachfolger.KnotenEntfernen(dvergleich)
        return self


class Liste:
    def __init__(self):
        self.anfang = None

    def SortiertEinfuegen(self, dneu):
        if self.anfang is not None:
            self.anfang = self.anfang.SortiertEinfuegen(dneu)
        else:
            self.anfang = Knoten(dneu)

    def KnotenEntfernen(self, dvergleich):
        if self.anfang is not None:
            self.anfang = self.anfang.KnotenEntfernen(dvergleich)
--- tests
def namen(l):
    out = []
    k = l.anfang
    while k is not None and len(out) < 30:
        out.append(k.daten.name)
        k = k.nachfolger
    return out

@test("SortiertEinfuegen in beliebiger Reihenfolge ergibt eine sortierte Liste")
def _():
    l = Liste()
    for n in ["Dora", "Bert", "Emil", "Andi", "Clara"]:
        l.SortiertEinfuegen(Patient(n))
    eq(namen(l), ["Andi", "Bert", "Clara", "Dora", "Emil"], "Liste")

@test("SortiertEinfuegen vorne und am Ende")
def _():
    l = Liste()
    l.SortiertEinfuegen(Patient("M"))
    l.SortiertEinfuegen(Patient("A"))
    l.SortiertEinfuegen(Patient("Z"))
    eq(namen(l), ["A", "M", "Z"], "Liste")

@test("KnotenEntfernen in der Mitte, vorne und am Ende")
def _():
    l = Liste()
    ps = [Patient(n) for n in ["A", "B", "C", "D"]]
    for p in ps:
        l.SortiertEinfuegen(p)
    l.KnotenEntfernen(ps[1])
    eq(namen(l), ["A", "C", "D"], "nach dem Entfernen von B")
    l.KnotenEntfernen(ps[0])
    eq(namen(l), ["C", "D"], "nach dem Entfernen von A")
    l.KnotenEntfernen(ps[3])
    eq(namen(l), ["C"], "nach dem Entfernen von D")
    l.KnotenEntfernen(ps[2])
    eq(l.anfang, None, "nach dem Entfernen von C")

@test("Das Entfernen eines fehlenden Elements ändert nichts")
def _():
    l = Liste()
    l.SortiertEinfuegen(Patient("A"))
    l.KnotenEntfernen(Patient("A"))
    eq(namen(l), ["A"], "Liste (ein anderes Objekt mit demselben Namen wird nicht entfernt)")
--- hint
`SortiertEinfuegen`: „Meine Daten sind kleiner als die neuen“ → das neue gehört irgendwo hinter mich. Sonst gehört es vor mich.
--- hint
`KnotenEntfernen`: Bin ich der zu entfernende Knoten, gib meinen Nachfolger zurück (der Aufrufer überspringt mich).
--- explain
Alle vier Methoden, die die Struktur ändern (EinfügenVor, SortiertEinfügen, KnotenEntfernen, EndeEntfernen), folgen demselben Muster: gib dich selbst zurück, wenn sich hier nichts ändert, gib einen neuen Knoten zurück, um vor dir einzufügen, gib deinen Nachfolger zurück, um zu verschwinden.
:::

:::exercise id=c3-position title="PositionGeben: Ergebnisse auf dem Rückweg verknüpfen" level=2
`PositionGeben(dvergleich)` gibt die Position des Knotens zurück, dessen Datenelement `dvergleich` **ist**, gezählt ab 1. Ist das Element nicht in der Liste, gibt es 0 zurück. (Schau in deiner Vorlage nach, wie dort „nicht gefunden“ gemeldet wird; die Idee ist dieselbe.)

Implementiere es rekursiv in `Knoten` und als Start in `Liste`. Denk dir das so: Wenn ich es nicht bin, frag meinen Nachfolger; meldet er eine Position p > 0 (ab ihm gezählt), ist meine Antwort p + 1; meldet er 0, melde ich auch 0.
--- starter
class Patient:
    def __init__(self, s):
        self.name = s


class Knoten:
    def __init__(self, dNeu, kNeu=None):
        self.daten = dNeu
        self.nachfolger = kNeu

    def HintenEinfuegen(self, dneu):
        if self.nachfolger is not None:
            self.nachfolger.HintenEinfuegen(dneu)
        else:
            self.nachfolger = Knoten(dneu)

    def PositionGeben(self, dvergleich):
        pass


class Liste:
    def __init__(self):
        self.anfang = None

    def HintenEinfuegen(self, dneu):
        if self.anfang is not None:
            self.anfang.HintenEinfuegen(dneu)
        else:
            self.anfang = Knoten(dneu)

    def PositionGeben(self, dvergleich):
        pass
--- solution
class Patient:
    def __init__(self, s):
        self.name = s


class Knoten:
    def __init__(self, dNeu, kNeu=None):
        self.daten = dNeu
        self.nachfolger = kNeu

    def HintenEinfuegen(self, dneu):
        if self.nachfolger is not None:
            self.nachfolger.HintenEinfuegen(dneu)
        else:
            self.nachfolger = Knoten(dneu)

    def PositionGeben(self, dvergleich):
        if self.daten == dvergleich:
            return 1
        if self.nachfolger is None:
            return 0
        p = self.nachfolger.PositionGeben(dvergleich)
        if p > 0:
            return p + 1
        return 0


class Liste:
    def __init__(self):
        self.anfang = None

    def HintenEinfuegen(self, dneu):
        if self.anfang is not None:
            self.anfang.HintenEinfuegen(dneu)
        else:
            self.anfang = Knoten(dneu)

    def PositionGeben(self, dvergleich):
        if self.anfang is not None:
            return self.anfang.PositionGeben(dvergleich)
        return 0
--- tests
def build():
    l = Liste()
    ps = [Patient(n) for n in ["Andi", "Bert", "Clara", "Dora"]]
    for p in ps:
        l.HintenEinfuegen(p)
    return l, ps

@test("Positionen 1 bis 4")
def _():
    l, ps = build()
    eq([l.PositionGeben(p) for p in ps], [1, 2, 3, 4], "Positionen von Andi, Bert, Clara, Dora")

@test("Nicht in der Liste, leere Liste")
def _():
    l, ps = build()
    eq(l.PositionGeben(Patient("Andi")), 0, "ein anderes Objekt mit demselben Namen")
    eq(Liste().PositionGeben(ps[0]), 0, "leere Liste")

@test("Recursive")
def _():
    l, ps = build()
    r, rec = recursive(l.anfang.PositionGeben, ps[3])
    ok(rec and r == 4, "Knoten.PositionGeben muss PositionGeben des nachfolgers aufrufen")
--- hint
Drei Fälle im Knoten: Ich bin es (1); hinter mir ist niemand (0); sonst den Nachfolger fragen und seine Antwort umrechnen.
--- hint
Vorsicht: `return self.nachfolger.PositionGeben(dvergleich) + 1` ist falsch, wenn das Element fehlt, denn 0 + 1 = 1 sähe aus wie „gefunden“.
--- explain
Anders als bei `Suchen` kann die Antwort nicht unverändert weitergereicht werden: Jeder Knoten auf dem Rückweg addiert 1, aber nur, wenn das Element gefunden wurde. Das ist eine typische Klausurvariante: Entscheide, was jeder Knoten mit der Antwort des Rests macht.
:::

:::exercise id=c3-bug title="Fehlersuche: Die Liste verschwindet" level=2
Dieses `EndeEntfernen` (die plausibel aussehende Korrektur des `return this` aus deiner Vorlage) entfernt viel mehr als den letzten Knoten. Führ es aus, finde heraus, was passiert, und behebe den Fehler.
--- starter
class Knoten:
    def __init__(self, dNeu, kNeu=None):
        self.daten = dNeu
        self.nachfolger = kNeu

    def EndeEntfernen(self):
        if self.nachfolger is None:
            return None
        else:
            self.nachfolger = self.nachfolger.EndeEntfernen()
            return self.nachfolger


class Liste:
    def __init__(self):
        self.anfang = None

    def HintenEinfuegen(self, d):
        if self.anfang is None:
            self.anfang = Knoten(d)
        else:
            k = self.anfang
            while k.nachfolger is not None:
                k = k.nachfolger
            k.nachfolger = Knoten(d)

    def Namen(self):
        out = []
        k = self.anfang
        while k is not None:
            out.append(k.daten)
            k = k.nachfolger
        return out


l = Liste()
for n in ["A", "B", "C", "D"]:
    l.HintenEinfuegen(n)
l.anfang = l.anfang.EndeEntfernen()
print(l.Namen())
--- solution
class Knoten:
    def __init__(self, dNeu, kNeu=None):
        self.daten = dNeu
        self.nachfolger = kNeu

    def EndeEntfernen(self):
        if self.nachfolger is None:
            return None
        else:
            self.nachfolger = self.nachfolger.EndeEntfernen()
            return self


class Liste:
    def __init__(self):
        self.anfang = None

    def HintenEinfuegen(self, d):
        if self.anfang is None:
            self.anfang = Knoten(d)
        else:
            k = self.anfang
            while k.nachfolger is not None:
                k = k.nachfolger
            k.nachfolger = Knoten(d)

    def Namen(self):
        out = []
        k = self.anfang
        while k is not None:
            out.append(k.daten)
            k = k.nachfolger
        return out


l = Liste()
for n in ["A", "B", "C", "D"]:
    l.HintenEinfuegen(n)
l.anfang = l.anfang.EndeEntfernen()
print(l.Namen())
--- tests
@test("A B C D → A B C")
def _():
    l2 = Liste()
    for n in "ABCD":
        l2.HintenEinfuegen(n)
    l2.anfang = l2.anfang.EndeEntfernen()
    eq(l2.Namen(), ["A", "B", "C"], "Liste nach EndeEntfernen")

@test("Wiederholtes Entfernen")
def _():
    l2 = Liste()
    for n in "AB":
        l2.HintenEinfuegen(n)
    l2.anfang = l2.anfang.EndeEntfernen()
    eq(l2.Namen(), ["A"], "nach dem ersten Entfernen")
    l2.anfang = l2.anfang.EndeEntfernen()
    eq(l2.Namen(), [], "nach dem zweiten Entfernen")
--- hint
Führ es aus: Was wird ausgegeben? Frag dich dann: Was sollte ein Knoten, der **nicht** der letzte ist, zurückgeben, also welcher Knoten soll an seiner Stelle stehen?
--- explain
Mit `return self.nachfolger` speichert der vorletzte Knoten `None`, gibt `None` zurück, sein Vorgänger speichert `None`, … bis hinauf zur Liste: Alles ist weg. Ein Knoten, der in der Liste bleibt, muss **sich selbst** zurückgeben.
:::

## [exam] Klausurtraining

::::exam title="Sequenzdiagramm (im Stil von 12_II_4_Aufgabe_4 c)" points=5
Zeichne das Sequenzdiagramm für den Aufruf `LaengeGeben()` bei einer Liste mit **zwei** Knoten (rekursive Version mit RestlaengeGeben).
--- solution
:::diagram seq
actors: Aufrufer | l: LISTE | k1: KNOTEN | k2: KNOTEN
Aufrufer -> l: LaengeGeben()
l -> k1: RestlaengeGeben()
k1 -> k2: RestlaengeGeben()
k2 --> k1: 1
k1 --> l: 2
l --> Aufrufer: 2
:::

k2 hat keinen Nachfolger (Rekursionsende) und gibt 1 zurück; k1 gibt 1 + 1 = 2 zurück; die Liste reicht 2 weiter.
::::

:::exam title="Rückgabewerte bei EinfügenVor" points=4
Eine Liste enthält die Knoten k1 (Andi), k2 (Bert), k3 (Clara). Die Liste ruft `EinfügenVor(Dora, Bert)` auf. Gib für jeden beteiligten Knoten an, was er zurückgibt, und was die Liste in `anfang` speichert.
--- solution
- k1 (Andi ≠ Bert) ruft k2 auf und speichert dann das Ergebnis als seinen Nachfolger.
- k2 (Bert = Bert) erzeugt kNeu = Knoten(Dora, k2) und **gibt kNeu zurück**.
- k1 setzt `nachfolger = kNeu` und **gibt sich selbst (k1) zurück**.
- Die Liste setzt `anfang = k1` (unverändert).
Ergebnis: Andi → Dora → Bert → Clara. k3 wird nie aufgerufen.
:::

::::exam title="Warum return self?" points=3
Erkläre mit einem Objektdiagramm, was bei `EndeEntfernen` schiefgeht, wenn ein Knoten, der nicht der letzte ist, `self.nachfolger` statt `self` zurückgibt.
--- solution
Jeder Knoten, der nicht der letzte ist, speichert das, was sein Nachfolger zurückgibt, als neuen Nachfolger. Mit `return self.nachfolger` speichert der vorletzte Knoten `None` (richtig), gibt dann aber seinen neuen Nachfolger `None` statt sich selbst zurück. Sein Vorgänger speichert `None` und so weiter. Am Ende bekommt die Liste `None` als `anfang`: Alle Knoten sind verloren.

:::diagram objects
l: LISTE @0,0 | anfang -x k1
k1: KNOTEN @1,0 | daten = "A" | nachfolger -x k2
k2: KNOTEN @2.2,0 | daten = "B" | nachfolger = None
:::
::::
