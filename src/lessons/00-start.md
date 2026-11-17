---
id: start
num: "0"
part: "0"
title: So funktioniert der Kurs
short: So geht's
lead: Was du lernst, wie die Lektionen aufgebaut sind und wie du die Python-Blöcke benutzt. Zehn Minuten, die den Rest des Kurses leichter machen.
minutes: 10
goals:
  - die vier Phasen nennen, die jede Lektion durchläuft
  - Code in einem Python-Block ausführen, prüfen und visualisieren
  - deinen Code zur Korrektur an Claude schicken
---

## [intro] Was der Kurs abdeckt

Der Kurs behandelt die ersten drei Kapitel deines Q12-Informatikkurses **26/28 2INF1**:

| Kapitel | Themen in deinem Kurs | Lektionen hier |
|---|---|---|
| **I Rekursion** | 1 Konzept · 2 Backtracking · 3 Tiefensuche · 4 Anwendungen der Tiefensuche: Optimale Lösungen | B1 – B4 |
| **II Listen** | 1 Warteschlange · 2 Trennung von Struktur und Daten · 3 Einfach verkettete Liste · 4 Entwurfsmuster Kompositum · 5 Stapel | C1 – C5 |
| **III Bäume** | 1 Datenstruktur Baum · 2 Suchen und Einfügen · 3 Binärbaum implementieren | D1 – D3 |
| **Klausurvorbereitung** | Spickzettel und Glossar · gemischte Aufgaben über alle Kapitel · zwei vollständige Probeklausuren (Rekursion und Listen; Stapel und Bäume) mit Musterlösungen | E1 – E4 |

Deine Lehrkraft implementiert alles in **Python**, deshalb auch dieser Kurs. Weil du in Python bei null anfängst, bringt dir **Teil A** zuerst genau das Python bei, das du brauchst: nicht mehr, aber auch nichts zu wenig. Jedes Python-Thema in Teil A ist da, weil eine spätere Lektion darauf aufbaut. Die Chips *Baut auf* und *Wird gebraucht für* oben in jeder Lektion zeigen diese Verbindungen. **Teil E** führt alles für die Klausur zusammen.

:::key title="Die Idee hinter dem Kurs"
Einen Algorithmus verstehen und ihn in Python schreiben sind zwei verschiedene Fähigkeiten. Zuerst lernst du die **Logik** (was passiert und warum), ganz ohne Code. Dann siehst du, wie jeder Schritt der Logik zu einer Zeile Python wird. Erst danach schreibst du den Code selbst.
:::

## [intro] Die vier Phasen einer Lektion

Jede Lektion besteht aus denselben vier Arten von Abschnitten. Du erkennst sie an der farbigen Markierung in jeder Überschrift:

:::cols cards
#### <span class="phase-tag" style="color:var(--violet);background:var(--violet-soft)">Logik</span>
Die Idee in Worten, Bildern und **Pseudocode** in der Notation deines Kurses (`methode … falls … dann … sonst …`). Hier gibt es kein Python. Das ist auch genau das, was du für Papieraufgaben in der Klausur brauchst.
--- col
#### <span class="phase-tag" style="color:var(--amber);background:var(--amber-soft)">Brücke</span>
Links Pseudocode, rechts Python, **Zeile für Zeile**. Du siehst, welche Zeile der Logik zu welcher Zeile Code wird und welche Python-Details (wie `self.` oder `is None`) dazukommen.
--- col
#### <span class="phase-tag" style="color:var(--blue);background:var(--blue-soft)">Python</span>
**Python-Blöcke**: eine Aufgabe, ein Editor und automatische Prüfungen. Sie testen den Normalfall *und* die Sonderfälle (leere Liste, ein Element, Rekursionsende …), denn genau dort passieren die meisten Fehler.
--- col
#### <span class="phase-tag" style="color:var(--red);background:var(--red-soft)">Klausurtraining</span>
Aufgaben im Stil deiner Klausur: eine Rekursion nachvollziehen, ein Objektdiagramm zeichnen, die Reihenfolge einer Tiefensuche angeben, Pseudocode schreiben. Du löst sie auf Papier und deckst dann die Musterlösung auf.
:::

Außerdem gibt es zwei Arten von interaktiven Bildern:

- **Interaktive** Visualisierungen (grüne Markierung) zeigen einen Algorithmus Schritt für Schritt: einen Rekursionsstapel, eine Tiefensuche auf einem echten Graphen, eine Listenoperation mit jeder Pfeiländerung.
- **Schritt-für-Schritt**-Ansichten führen echten Python-Code Zeile für Zeile aus und zeigen jede Variable, jedes Objekt und jede Referenz als Pfeil. Das funktioniert auch mit deinem eigenen Code: Drück in einem Python-Block auf **◫ Visualisieren**.

## [intro] So benutzt du einen Python-Block

Probier es am Block unten aus. Das machen die einzelnen Knöpfe:

| Knopf | Was er macht |
|---|---|
| **▶ Ausführen** (<kbd>Shift</kbd>+<kbd>Enter</kbd>) | Führt deinen Code aus und zeigt, was er ausgibt. |
| **✓ Prüfen** (<kbd>Strg</kbd>+<kbd>Enter</kbd>) | Führt die automatischen Prüfungen aus. Jede Prüfung sagt, was erwartet war und was dein Code geliefert hat. Wenn alle bestanden sind, wird der Block als *gelöst* markiert. |
| **◫ Visualisieren** | Führt deinen Code Schritt für Schritt aus, mit allen Variablen und Objekten. |
| **Tipp** | Zeigt Tipps, einen nach dem anderen. Versuch es mit einem Tipp, bevor du den nächsten nimmst. |
| **Lösung** | Zeigt eine Musterlösung mit Erklärung. Nimm sie erst, wenn du es selbst versucht hast. |
| **Zurücksetzen** | Stellt den Startcode wieder her (zweimal klicken). |
| **⧉ Für Claude kopieren** | Kopiert die Aufgabe, deinen Code und das letzte Prüfergebnis. Füge alles in den Chat mit Claude ein, um eine Korrektur zu bekommen. |

Dein Code wird automatisch in diesem Browser gespeichert, du kannst die Seite also schließen und später weitermachen. Python selbst läuft **in dieser Seite**. Beim ersten Klick auf einen Knopf dauert der Start ein paar Sekunden (achte auf die *Python*-Anzeige oben rechts).

:::exercise id=start-hello title="Dein erstes Python-Programm" level=1
Pythons `print(...)` schreibt Text in die Ausgabe. Text steht zwischen Anführungszeichen.

Ändere das Programm so, dass es genau

```out
Hallo, Informatik!
```

ausgibt. Drück dann auf **✓ Prüfen**.
--- starter
print("Hello")
--- solution
print("Hallo, Informatik!")
--- tests
@test("Das Programm gibt genau aus: Hallo, Informatik!")
def _():
    eq(OUTPUT.strip(), "Hallo, Informatik!", "Ausgabe")
--- hint
Ersetze den Text zwischen den Anführungszeichen. Groß- und Kleinschreibung, das Komma und das Ausrufezeichen zählen alle mit.
--- explain
`print` zeigt an, was zwischen den Klammern steht. Die Anführungszeichen sagen Python, dass `Hallo, Informatik!` **Text** ist und kein Befehl.
:::

## [intro] Sprache und Namen

Die **Fachbegriffe** deines Kurses sind fett gedruckt, wenn sie zum ersten Mal vorkommen, denn genau diese Wörter brauchst du in der Klausur: **Rekursionsende**, **Abbruchbedingung**, **Tiefensuche**, **Warteschlange**, **Kompositum** und so weiter. Pythons eigene Fehlermeldungen sind immer englisch (`NameError`, `AttributeError` …); der Kurs erklärt sie dir jeweils auf Deutsch.

Der gesamte Code verwendet die **Namen aus deinen Kursvorlagen**: `KnotenBesuchen`, `NachfolgerGeben`, `HintenEinfügen`, `self.anfang` … Python erlaubt Umlaute in Namen, und die Vorlagen deiner Lehrkraft nutzen sie auch. Deshalb siehst du in deinem Kursmaterial sowohl `HintenEinfügen` als auch `HintenEinfuegen`. Beides ist in Ordnung, solange du eine Schreibweise einheitlich verwendest.

:::tip title="Empfohlener Weg"
Wenn Python neu für dich ist, arbeite Teil A der Reihe nach durch: Jede Lektion dauert 30 bis 60 Minuten. Wenn du schon etwas Python kannst, mach die Python-Blöcke von Teil A als schnellen Test und lies nur dort nach, wo etwas schiefgeht. Die Teile B, C und D bauen direkt auf Teil A auf, und Teil D (Bäume) verbindet Rekursion aus Teil B mit dem Kompositum aus Teil C.
:::
