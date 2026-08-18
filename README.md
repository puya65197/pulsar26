# PULSAR

Ein Lernspiel für Physik und Mathematik, gespielt auf dem Gelände des
Campus Klarenthal in Wiesbaden.

Ein Projekt von **Puya Darafshan, Maxi Stoll, Ferdinand Ploss und
Henry Benninghaus**.

---

## Worum es geht

Man steuert eine Figur aus der Vogelperspektive über das echte
Schulgelände — die Karte ist ein Satellitenbild des Campus, in
Pixelgrafik umgesetzt. Verteilt über das Gelände liegen zwölf
Stationen, erkennbar an schwebenden Merkzetteln:

- **blauer Zettel** — eine Physik-Station
- **roter Zettel** — eine Mathe-Station

Läuft man an einen Zettel heran, erscheint unten sein Name. Mit `E`
öffnet man ihn.

Der Stoff deckt Klasse 10 bis 12 nach dem hessischen Kerncurriculum ab.

## Starten

Doppelklick auf `index.html`. Es braucht keinen Server, keine
Installation und keine Internetverbindung.

Online läuft es unter der GitHub-Pages-Adresse des Projekts.

## Steuerung

| | Am Computer | Am Handy |
|---|---|---|
| Laufen | `W` `A` `S` `D` oder Pfeiltasten | über die Karte wischen oder Steuerkreuz |
| Station öffnen | `E`, `Enter` oder Leertaste | Knopf `E` unten rechts |
| Fenster schließen | `Esc` | daneben tippen |

## Die zwei Spielmodi

Im Startbildschirm wählt man zwischen zwei Modi. Der Fortschritt oben
links zeigt, wie viele der zwölf Stationen schon erledigt sind.

### Info-Modus — erst lernen

Alle zwölf Stationen sind von Anfang an offen. Jede zeigt:

- eine kurze Einführung ins Thema
- die wichtigsten Formeln mit Bezeichnung
- Merksätze und typische Stolperfallen

Man kann in beliebiger Reihenfolge herumlaufen und Stationen auch
mehrfach öffnen. Besuchte Stationen bekommen einen grünen Punkt.

### Quiz-Modus — dann prüfen

Dieselbe Karte, aber an den Stationen stehen jetzt Aufgaben. Jede
Station stellt drei Fragen, entweder als Multiple Choice oder als
Zahleneingabe.

- Bei jeder Antwort erscheint eine Erklärung — auch bei einer richtigen.
- Falsch beantwortete Fragen kann man beliebig oft wiederholen.
- Erst wenn alle drei Fragen einer Station richtig sind, gilt sie als
  gelöst und die nächste Station im selben Fach wird freigeschaltet.
- Gesperrte Stationen erkennt man am grauen Zettel mit Schloss.

Zahlen darf man deutsch schreiben: `19,6` und `19.6` werden beide
akzeptiert. Kleine Rundungsabweichungen sind erlaubt.

## Die Stationen

Physik und Mathematik sind zwei getrennte Stränge. Beide starten offen,
man kann also frei wechseln.

**Physik**

1. Gleichförmige Bewegung
2. Beschleunigte Bewegung
3. Freier Fall
4. Newtonsche Gesetze
5. Energie & Arbeit
6. Wellenlehre

**Mathematik**

1. Ableitungsregeln
2. Kurvendiskussion
3. Extremwertprobleme
4. Punkte & Vektoren im Raum
5. Skalarprodukt
6. Stochastik

Zusammen sind das 36 Aufgaben.

## Für Lehrkräfte und zum Weiterbauen

Alle Inhalte stehen in einer einzigen Datei: `data/questions.js`.
Fragen, Formeln, Merksätze und die Positionen der Stationen auf der
Karte lassen sich dort ändern, ohne den Spielcode anzufassen. Die
technische Beschreibung dazu steht in `ENTWICKLUNG.md`.

## Quellen

Die Karte basiert auf einem Satellitenbild aus Google Earth. Der
Hinweis unten rechts im Spiel ist die zugehörige Quellenangabe.

Sämtliche Grafik im Spiel — Karte, Spielfigur, Bedienoberfläche —
wurde für dieses Projekt erzeugt. Es kommt kein fertiges Spiel-Framework
zum Einsatz, nur HTML, CSS und JavaScript.
