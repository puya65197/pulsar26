# PULSAR — Entwicklungsdokumentation

Technische Beschreibung des Projekts. Für die Spielanleitung siehe
[README.md](README.md).

Top-Down-Lernspiel im Pixel-Look auf dem Gelände des Campus Klarenthal.
Vanilla HTML5 / CSS3 / JavaScript, keine Frameworks, keine Build-Tools.

## Ordnerstruktur

```
lernspiel/
├── index.html              Seitengerüst (Menü, HUD, Dialoge, Touch-Steuerung)
├── README.md               Spielanleitung
├── ENTWICKLUNG.md          diese Datei
├── css/
│   └── style.css           Pixel-UI, responsiv für Handy und Desktop
├── js/
│   ├── main.js             Einstiegspunkt: Menü zeigen, Bilder laden
│   ├── assets.js           Bilder und JSON laden
│   ├── input.js            Tastatur, Wisch-Joystick, Steuerkreuz
│   ├── world.js            Karte, Kollisionsraster, Stationen, Kamera
│   ├── player.js           Bewegung, Kollision, Laufanimation
│   ├── ui.js               Menü, HUD, Info-Dialog, Quiz-Dialog
│   └── game.js             Spielschleife, Rendering, Zustandswechsel
├── assets/
│   ├── campus_map.png      640×564 px, Pixel-Art aus dem Satellitenbild
│   ├── player.png          64×96 px Sprite-Sheet (4 Richtungen × 4 Frames)
│   └── collision.js        Kollisionsraster, 8-px-Zellen (80×70)
├── data/
│   └── questions.js        12 Stationen, 36 Aufgaben
└── tools/                  Python-Skripte zum Neuerzeugen der Assets
    ├── make_map.py
    ├── make_player.py
    └── make_collision.py
```

## Starten

Doppelklick auf `index.html` genügt. Das Spiel braucht keinen Server,
keinen Build und keine Internetverbindung — die Schriftart wird
nachgeladen, fehlt sie, greift eine Systemschrift.

Online läuft es genauso, z. B. über GitHub Pages.

## Steuerung

| | PC | Handy |
|---|---|---|
| Bewegen | `W A S D` oder Pfeiltasten | wischen oder Steuerkreuz |
| Station öffnen | `E`, `Enter` oder Leertaste | Knopf `E` |
| Dialog schließen | `Esc` | außerhalb tippen |
| Kollisionen anzeigen | `G` | — |

## Die beiden Modi

**Info-Modus** — alle zwölf Stationen sind offen. Man liest Einführung,
Formeln und Merksätze. Der Fortschritt zählt besuchte Stationen.

**Quiz-Modus** — jede Station stellt drei Aufgaben (Multiple Choice oder
Zahleneingabe). Erst wenn alle drei richtig beantwortet sind, gilt die
Station als gelöst und die nächste im Strang wird freigeschaltet. Es gibt
zwei getrennte Stränge: Physik und Mathematik, beide starten offen.

```
Physik:  Kinematik → Beschleunigung → Freier Fall → Newton → Energie → Wellen
Mathe:   Ableitungen → Kurvendiskussion → Extremwerte → Vektoren → Skalarprodukt → Stochastik
```

## Inhalte anpassen

Alles Fachliche steht in `data/questions.js`. Die Datei enthält ein
einziges JavaScript-Objekt — die Struktur ist reines JSON. Eine Station sieht so aus:

```jsonc
{
  "id": "kinematik",
  "subject": "physik",          // steuert nur die Farbe: "physik" oder "mathe"
  "title": "Gleichförmige Bewegung",
  "pos": [196, 286],            // Pixelkoordinaten auf campus_map.png
  "requires": null,             // id der Vorgängerstation oder null
  "info": {
    "intro":    "…",
    "formulas": [{ "formula": "v = Δs / Δt", "label": "Geschwindigkeit" }],
    "notes":    ["…"]
  },
  "questions": [
    { "type": "choice", "prompt": "…", "options": ["…"], "answer": 1, "explain": "…" },
    { "type": "number", "prompt": "…", "answer": 15, "tolerance": 0.1, "unit": "m/s", "explain": "…" }
  ]
}
```

- `answer` ist bei `choice` der **Index** der richtigen Option (beginnt bei 0).
- Bei `number` werden deutsche Kommazahlen akzeptiert: `19,6` und `19.6`.
- `tolerance` ist die erlaubte Abweichung nach oben und unten.

## Stationen verschieben

`pos` sind Pixelkoordinaten auf `assets/campus_map.png` (640 × 564).
Bild in einem Grafikprogramm öffnen, Koordinaten ablesen, eintragen.
Wichtig: die Position muss auf einer begehbaren Zelle liegen — mit `G`
im Spiel das Kollisionsraster einblenden und prüfen.

## Kollisionen

Standardmäßig ist das gesamte Gelände begehbar — nur der Kartenrand ist
dicht. Man läuft also frei über den Campus, auch über Gebäude und Bäume.

Wer Hindernisse möchte, öffnet `tools/make_collision.py` und setzt oben:

```python
BLOCK_TERRAIN = True
```

Dann werden dichte Baumgruppen anhand der Bildfarben erkannt und die
Gebäude aus der Liste `BUILDINGS` gesperrt. Rechtecke im Format
`(x, y, breite, hoehe)`, Pixelkoordinaten auf `assets/campus_map.png`.

```bash
cd tools
python3 make_collision.py
python3 check_reach.py     # prüft, ob alle Stationen erreichbar bleiben
```

`check_reach.py` läuft per Flood-Fill vom Startpunkt aus über die Karte
und meldet jede Station, die abgeschnitten oder zugebaut wurde. Im Spiel
zeigt die Taste `G` das Raster direkt über der Karte.

## Assets neu erzeugen

Die Skripte in `tools/` brauchen Pillow und NumPy:

```bash
pip install pillow numpy
```

- `make_map.py` — Screenshot zuschneiden, Google-Labels per Inpainting
  entfernen, auf Pixel-Art-Auflösung rechnen, Farbpalette reduzieren.
  Erwartet den Screenshot unter `quelle/campus_screenshot.png`.
- `make_player.py` — Sprite-Sheet aus ASCII-Pixelvorlagen bauen.
  Die Figur lässt sich dort direkt umzeichnen; die Palette steht oben
  im Skript.
- `make_collision.py` — Kollisionsraster erzeugen und ein Kontrollbild
  schreiben.

## Quellenangabe

Die Karte basiert auf einem Satellitenbild aus Google Earth. Der Hinweis
unten rechts im Spiel ist die erforderliche Quellenangabe und sollte
stehen bleiben.

## Warum keine ES-Module?

Die Skripte werden in `index.html` der Reihe nach mit `<script>`
eingebunden statt über `import`. Das ist eine bewusste Entscheidung:
ES-Module und `fetch` werden vom Browser bei lokal geöffneten Dateien
(`file://`) blockiert, das Spiel liefe dann nur über einen Server. So
läuft es überall — auf dem Schulrechner, vom USB-Stick, online.

Die Reihenfolge der `<script>`-Tags ist deshalb wichtig: erst die Daten,
dann die Klassen, zuletzt `main.js`.

## Startpunkt der Spielfigur

Steht in `js/game.js` ganz oben:

```js
const SPAWN = { x: 206, y: 312 };
```

Pixelkoordinaten auf `assets/campus_map.png`. Wird der Wert geändert,
muss `SPAWN` in `tools/check_reach.py` mitgezogen werden, sonst prüft
das Skript von der falschen Stelle aus.

## Stellschrauben

| Datei | Konstante | Wirkung |
|---|---|---|
| `js/player.js` | `SPEED` | Laufgeschwindigkeit in Pixeln pro Sekunde |
| `js/game.js` | `TARGET_VIEW_W` | wie viel Karte sichtbar ist (größer = herausgezoomt) |
| `js/game.js` | `MIN_ZOOM` / `MAX_ZOOM` | Grenzen der Vergrößerung |
| `js/world.js` | `INTERACT_RADIUS` | ab welchem Abstand eine Station reagiert |
| `js/player.js` | `FOOT_W` / `FOOT_H` | Größe des Kollisionsrechtecks an den Füßen |

## Team

Puya Darafshan, Maxi Stoll, Ferdinand Ploss, Henry Benninghaus.
