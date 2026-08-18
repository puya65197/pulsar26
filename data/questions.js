// Lerninhalte. Struktur siehe README. Diese Datei bearbeitest du,
// wenn du Fragen, Formeln oder Stationspositionen aendern willst.
window.QUESTIONS = {
  "meta": {
    "titel": "Campus Klarenthal — Lernspiel",
    "faecher": [
      "Physik",
      "Mathematik"
    ],
    "stufe": "Klasse 10-12, hessisches Kerncurriculum",
    "hinweis": "Positionen (pos) sind Pixelkoordinaten auf campus_map.png (640x564)."
  },
  "stations": [
    {
      "id": "kinematik",
      "subject": "physik",
      "title": "Gleichförmige Bewegung",
      "pos": [
        196,
        286
      ],
      "requires": null,
      "info": {
        "intro": "Eine Bewegung heißt gleichförmig, wenn die Geschwindigkeit nach Betrag und Richtung konstant bleibt. In gleichen Zeitspannen wird immer derselbe Weg zurückgelegt.",
        "formulas": [
          {
            "formula": "v = Δs / Δt",
            "label": "Geschwindigkeit"
          },
          {
            "formula": "s(t) = s₀ + v · t",
            "label": "Weg-Zeit-Gesetz"
          },
          {
            "formula": "1 m/s = 3,6 km/h",
            "label": "Umrechnung"
          }
        ],
        "notes": [
          "Im t-s-Diagramm ist die gleichförmige Bewegung eine Gerade. Ihre Steigung ist die Geschwindigkeit.",
          "Im t-v-Diagramm ist sie eine Waagerechte. Die Fläche unter dem Graphen ist der zurückgelegte Weg.",
          "Von km/h nach m/s: durch 3,6 teilen. Von m/s nach km/h: mit 3,6 multiplizieren."
        ]
      },
      "questions": [
        {
          "type": "choice",
          "prompt": "Ein Radfahrer legt 900 m in 2,0 Minuten zurück. Wie groß ist seine Geschwindigkeit?",
          "options": [
            "4,5 m/s",
            "7,5 m/s",
            "15 m/s",
            "450 m/s"
          ],
          "answer": 1,
          "explain": "2,0 min = 120 s. v = 900 m / 120 s = 7,5 m/s."
        },
        {
          "type": "number",
          "prompt": "Rechne 54 km/h in m/s um.",
          "unit": "m/s",
          "answer": 15,
          "tolerance": 0.1,
          "explain": "54 : 3,6 = 15. Also 15 m/s."
        },
        {
          "type": "choice",
          "prompt": "Was beschreibt die Fläche unter dem Graphen im t-v-Diagramm?",
          "options": [
            "die Beschleunigung",
            "den zurückgelegten Weg",
            "die Masse",
            "die Endgeschwindigkeit"
          ],
          "answer": 1,
          "explain": "Geschwindigkeit mal Zeit ergibt einen Weg, deshalb entspricht die Fläche dem zurückgelegten Weg."
        }
      ]
    },
    {
      "id": "beschleunigung",
      "subject": "physik",
      "title": "Beschleunigte Bewegung",
      "pos": [
        250,
        340
      ],
      "requires": "kinematik",
      "info": {
        "intro": "Bei einer gleichmäßig beschleunigten Bewegung ändert sich die Geschwindigkeit in gleichen Zeitspannen um gleiche Beträge. Die Beschleunigung a ist konstant.",
        "formulas": [
          {
            "formula": "a = Δv / Δt",
            "label": "Beschleunigung"
          },
          {
            "formula": "v(t) = v₀ + a · t",
            "label": "Geschwindigkeit-Zeit-Gesetz"
          },
          {
            "formula": "s(t) = s₀ + v₀ · t + ½ · a · t²",
            "label": "Weg-Zeit-Gesetz"
          },
          {
            "formula": "v² = v₀² + 2 · a · s",
            "label": "zeitfreie Form"
          }
        ],
        "notes": [
          "Aus der Ruhe heraus (v₀ = 0) vereinfacht sich das Weg-Zeit-Gesetz zu s = ½ · a · t².",
          "Weil t quadratisch eingeht, gilt: doppelte Zeit bedeutet vierfachen Weg.",
          "Im t-v-Diagramm ist die Bewegung eine Gerade mit der Steigung a."
        ]
      },
      "questions": [
        {
          "type": "number",
          "prompt": "Ein Auto startet aus der Ruhe und beschleunigt mit a = 2,5 m/s². Welche Geschwindigkeit hat es nach 8,0 s?",
          "unit": "m/s",
          "answer": 20,
          "tolerance": 0.2,
          "explain": "v = a · t = 2,5 m/s² · 8,0 s = 20 m/s."
        },
        {
          "type": "choice",
          "prompt": "Welchen Weg legt dasselbe Auto in diesen 8,0 s zurück?",
          "options": [
            "20 m",
            "40 m",
            "80 m",
            "160 m"
          ],
          "answer": 2,
          "explain": "s = ½ · a · t² = ½ · 2,5 · 64 = 80 m."
        },
        {
          "type": "choice",
          "prompt": "Ein Körper startet aus der Ruhe und wird konstant beschleunigt. Wie ändert sich der Weg, wenn die Zeit verdoppelt wird?",
          "options": [
            "er verdoppelt sich",
            "er vervierfacht sich",
            "er bleibt gleich",
            "er halbiert sich"
          ],
          "answer": 1,
          "explain": "In s = ½ · a · t² geht die Zeit quadratisch ein: aus 2t wird 4-facher Weg."
        }
      ]
    },
    {
      "id": "freierfall",
      "subject": "physik",
      "title": "Freier Fall",
      "pos": [
        172,
        212
      ],
      "requires": "beschleunigung",
      "info": {
        "intro": "Der freie Fall ist eine gleichmäßig beschleunigte Bewegung ohne Anfangsgeschwindigkeit. Vernachlässigt man den Luftwiderstand, fallen alle Körper gleich schnell — unabhängig von ihrer Masse.",
        "formulas": [
          {
            "formula": "g ≈ 9,81 m/s²",
            "label": "Fallbeschleunigung"
          },
          {
            "formula": "v(t) = g · t",
            "label": "Fallgeschwindigkeit"
          },
          {
            "formula": "h(t) = ½ · g · t²",
            "label": "Fallhöhe"
          },
          {
            "formula": "v = √(2 · g · h)",
            "label": "Aufprallgeschwindigkeit"
          }
        ],
        "notes": [
          "Die Fallzeit aus der Höhe h ergibt sich zu t = √(2h / g).",
          "Ohne Luft fallen Feder und Hammer gleich schnell — das ist auf dem Mond tatsächlich vorgeführt worden.",
          "Mit Luftwiderstand stellt sich nach einiger Zeit eine konstante Endgeschwindigkeit ein."
        ]
      },
      "questions": [
        {
          "type": "number",
          "prompt": "Ein Stein fällt 2,0 s lang frei. Aus welcher Höhe wurde er losgelassen?",
          "unit": "m",
          "answer": 19.6,
          "tolerance": 0.4,
          "explain": "h = ½ · g · t² = ½ · 9,81 · 4,0 ≈ 19,6 m."
        },
        {
          "type": "choice",
          "prompt": "Im Vakuum werden eine Stahlkugel und eine Feder aus gleicher Höhe losgelassen. Was passiert?",
          "options": [
            "Die Kugel kommt deutlich früher an.",
            "Die Feder kommt früher an.",
            "Beide kommen gleichzeitig an.",
            "Das hängt von der Fallhöhe ab."
          ],
          "answer": 2,
          "explain": "Ohne Luftwiderstand ist die Fallbeschleunigung für alle Körper gleich groß, die Masse kürzt sich heraus."
        },
        {
          "type": "number",
          "prompt": "Mit welcher Geschwindigkeit trifft ein Körper auf, der aus 45 m Höhe frei fällt?",
          "unit": "m/s",
          "answer": 29.7,
          "tolerance": 0.6,
          "explain": "v = √(2 · 9,81 · 45) = √882,9 ≈ 29,7 m/s."
        }
      ]
    },
    {
      "id": "newton",
      "subject": "physik",
      "title": "Newtonsche Gesetze",
      "pos": [
        128,
        238
      ],
      "requires": "freierfall",
      "info": {
        "intro": "Die drei newtonschen Axiome verknüpfen Kräfte mit Bewegungsänderungen. Sie sind die Grundlage der gesamten klassischen Mechanik.",
        "formulas": [
          {
            "formula": "ΣF = 0  ⟹  v = konstant",
            "label": "1. Axiom (Trägheit)"
          },
          {
            "formula": "F = m · a",
            "label": "2. Axiom (Grundgleichung)"
          },
          {
            "formula": "F₁₂ = − F₂₁",
            "label": "3. Axiom (Wechselwirkung)"
          },
          {
            "formula": "F_G = m · g",
            "label": "Gewichtskraft"
          }
        ],
        "notes": [
          "Kraft ist keine Voraussetzung für Bewegung, sondern für Bewegungsänderung.",
          "Beim 3. Axiom greifen die beiden Kräfte an verschiedenen Körpern an — deshalb heben sie sich nicht auf.",
          "1 N = 1 kg · m/s²."
        ]
      },
      "questions": [
        {
          "type": "number",
          "prompt": "Ein Auto der Masse 1200 kg wird mit 3,0 m/s² beschleunigt. Wie groß ist die beschleunigende Kraft?",
          "unit": "N",
          "answer": 3600,
          "tolerance": 20,
          "explain": "F = m · a = 1200 kg · 3,0 m/s² = 3600 N."
        },
        {
          "type": "choice",
          "prompt": "Eine Rakete stößt Gas nach hinten aus und wird dadurch nach vorn getrieben. Welches Axiom beschreibt das?",
          "options": [
            "1. Axiom",
            "2. Axiom",
            "3. Axiom",
            "keines der drei"
          ],
          "answer": 2,
          "explain": "Das Wechselwirkungsgesetz: Die Kraft auf das Gas und die Kraft auf die Rakete sind gleich groß und entgegengesetzt."
        },
        {
          "type": "choice",
          "prompt": "Ein Körper bewegt sich geradlinig mit konstanter Geschwindigkeit. Was gilt für die Kräfte?",
          "options": [
            "Es wirkt gar keine Kraft.",
            "Die Summe aller Kräfte ist null.",
            "Es wirkt genau eine Kraft in Bewegungsrichtung.",
            "Die Kräfte nehmen gleichmäßig zu."
          ],
          "answer": 1,
          "explain": "Es dürfen durchaus Kräfte wirken (z. B. Antrieb und Reibung), sie müssen sich nur zu null addieren."
        }
      ]
    },
    {
      "id": "energie",
      "subject": "physik",
      "title": "Energie & Arbeit",
      "pos": [
        300,
        172
      ],
      "requires": "newton",
      "info": {
        "intro": "Arbeit wird verrichtet, wenn eine Kraft einen Körper längs eines Weges verschiebt. Dabei wird Energie von einer Form in eine andere umgewandelt — die Gesamtenergie bleibt erhalten.",
        "formulas": [
          {
            "formula": "W = F · s · cos α",
            "label": "Arbeit"
          },
          {
            "formula": "E_kin = ½ · m · v²",
            "label": "kinetische Energie"
          },
          {
            "formula": "E_pot = m · g · h",
            "label": "Lageenergie"
          },
          {
            "formula": "P = W / t",
            "label": "Leistung"
          },
          {
            "formula": "E_kin + E_pot = konstant",
            "label": "Energieerhaltung (reibungsfrei)"
          }
        ],
        "notes": [
          "1 J = 1 N · m = 1 W · s.",
          "Wirkt die Kraft senkrecht zum Weg (α = 90°), wird keine Arbeit verrichtet.",
          "Reibung wandelt mechanische Energie in innere Energie um; sie verschwindet nicht, sie ist nur nicht mehr nutzbar."
        ]
      },
      "questions": [
        {
          "type": "number",
          "prompt": "Welche kinetische Energie hat ein Körper der Masse 2,0 kg bei v = 6,0 m/s?",
          "unit": "J",
          "answer": 36,
          "tolerance": 0.5,
          "explain": "E_kin = ½ · 2,0 · 6,0² = ½ · 2,0 · 36 = 36 J."
        },
        {
          "type": "choice",
          "prompt": "Ein Ball fällt reibungsfrei aus 5,0 m Höhe. Wie schnell ist er beim Aufprall?",
          "options": [
            "5,0 m/s",
            "9,9 m/s",
            "49 m/s",
            "98 m/s"
          ],
          "answer": 1,
          "explain": "m · g · h = ½ · m · v² ⟹ v = √(2gh) = √98,1 ≈ 9,9 m/s. Die Masse kürzt sich heraus."
        },
        {
          "type": "number",
          "prompt": "Eine Kiste wird mit 400 N über 3,0 m in Kraftrichtung geschoben. Welche Arbeit wird verrichtet?",
          "unit": "J",
          "answer": 1200,
          "tolerance": 10,
          "explain": "W = F · s = 400 N · 3,0 m = 1200 J (α = 0°, also cos α = 1)."
        }
      ]
    },
    {
      "id": "wellen",
      "subject": "physik",
      "title": "Wellenlehre",
      "pos": [
        372,
        292
      ],
      "requires": "energie",
      "info": {
        "intro": "Eine Welle transportiert Energie, aber keine Materie. Sie entsteht, wenn sich eine Schwingung räumlich ausbreitet.",
        "formulas": [
          {
            "formula": "c = λ · f",
            "label": "Ausbreitungsgeschwindigkeit"
          },
          {
            "formula": "T = 1 / f",
            "label": "Schwingungsdauer"
          },
          {
            "formula": "Δs = n · λ",
            "label": "konstruktive Interferenz"
          },
          {
            "formula": "Δs = (n + ½) · λ",
            "label": "destruktive Interferenz"
          }
        ],
        "notes": [
          "Bei Transversalwellen schwingen die Teilchen senkrecht zur Ausbreitungsrichtung, bei Longitudinalwellen längs dazu.",
          "Schall in Luft ist eine Longitudinalwelle, Licht ist eine Transversalwelle.",
          "Am Doppelspalt entstehen Maxima dort, wo der Gangunterschied ein ganzzahliges Vielfaches von λ ist."
        ]
      },
      "questions": [
        {
          "type": "number",
          "prompt": "Ein Ton hat die Frequenz 170 Hz. Die Schallgeschwindigkeit beträgt 340 m/s. Wie groß ist die Wellenlänge?",
          "unit": "m",
          "answer": 2,
          "tolerance": 0.05,
          "explain": "λ = c / f = 340 / 170 = 2,0 m."
        },
        {
          "type": "choice",
          "prompt": "Zwei gleiche Wellen treffen mit dem Gangunterschied 1,5 λ aufeinander. Was passiert?",
          "options": [
            "Verstärkung",
            "Auslöschung",
            "die Frequenz verdoppelt sich",
            "nichts Besonderes"
          ],
          "answer": 1,
          "explain": "1,5 λ = (1 + ½) · λ, das ist der Fall destruktiver Interferenz."
        },
        {
          "type": "choice",
          "prompt": "Schallwellen in Luft sind …",
          "options": [
            "Transversalwellen",
            "Longitudinalwellen",
            "stehende Wellen",
            "elektromagnetische Wellen"
          ],
          "answer": 1,
          "explain": "Luftteilchen schwingen in Ausbreitungsrichtung — es entstehen Verdichtungen und Verdünnungen."
        }
      ]
    },
    {
      "id": "ableitung",
      "subject": "mathe",
      "title": "Ableitungsregeln",
      "pos": [
        330,
        122
      ],
      "requires": null,
      "info": {
        "intro": "Die Ableitung f'(x₀) gibt die Steigung der Tangente an den Graphen von f im Punkt x₀ an. Mit den Ableitungsregeln lässt sie sich ohne Grenzwertrechnung bestimmen.",
        "formulas": [
          {
            "formula": "f(x) = xⁿ  ⟹  f'(x) = n · xⁿ⁻¹",
            "label": "Potenzregel"
          },
          {
            "formula": "(u · v)' = u' · v + u · v'",
            "label": "Produktregel"
          },
          {
            "formula": "(u / v)' = (u' · v − u · v') / v²",
            "label": "Quotientenregel"
          },
          {
            "formula": "f(g(x))' = f'(g(x)) · g'(x)",
            "label": "Kettenregel"
          }
        ],
        "notes": [
          "Konstante Summanden fallen beim Ableiten weg, konstante Faktoren bleiben stehen.",
          "Merkspruch zur Kettenregel: äußere Ableitung mal innere Ableitung.",
          "f'(x₀) ist zugleich die momentane Änderungsrate an der Stelle x₀."
        ]
      },
      "questions": [
        {
          "type": "choice",
          "prompt": "Wie lautet die Ableitung von f(x) = 3x⁴ − 5x² + 7?",
          "options": [
            "12x³ − 10x",
            "12x³ − 10x + 7",
            "3x³ − 5x",
            "12x⁴ − 10x²"
          ],
          "answer": 0,
          "explain": "Potenzregel gliedweise: 3·4x³ = 12x³, −5·2x = −10x, die 7 fällt weg."
        },
        {
          "type": "choice",
          "prompt": "Wie lautet die Ableitung von f(x) = (2x + 1)⁵?",
          "options": [
            "5(2x + 1)⁴",
            "10(2x + 1)⁴",
            "(2x + 1)⁴",
            "10(2x + 1)⁶"
          ],
          "answer": 1,
          "explain": "Kettenregel: äußere Ableitung 5(2x+1)⁴, innere Ableitung 2, zusammen 10(2x+1)⁴."
        },
        {
          "type": "number",
          "prompt": "Welche Steigung hat die Tangente an f(x) = x³ an der Stelle x = 2?",
          "answer": 12,
          "tolerance": 0.01,
          "explain": "f'(x) = 3x², also f'(2) = 3 · 4 = 12."
        }
      ]
    },
    {
      "id": "kurven",
      "subject": "mathe",
      "title": "Kurvendiskussion",
      "pos": [
        452,
        214
      ],
      "requires": "ableitung",
      "info": {
        "intro": "Bei der Kurvendiskussion untersucht man eine Funktion systematisch auf Nullstellen, Extrempunkte, Wendepunkte, Symmetrie und Verhalten im Unendlichen.",
        "formulas": [
          {
            "formula": "f(x) = 0",
            "label": "Nullstellen"
          },
          {
            "formula": "f'(x) = 0  und  f''(x) ≠ 0",
            "label": "Extremstellen"
          },
          {
            "formula": "f''(x) < 0 → Hochpunkt",
            "label": "Art des Extremums"
          },
          {
            "formula": "f''(x) = 0  und  f'''(x) ≠ 0",
            "label": "Wendestellen"
          }
        ],
        "notes": [
          "Nur gerade Exponenten bedeuten Achsensymmetrie zur y-Achse, nur ungerade bedeuten Punktsymmetrie zum Ursprung.",
          "f'(x) = 0 allein reicht nicht: es könnte auch ein Sattelpunkt vorliegen.",
          "Die Wendestelle ist die Stelle stärkster Steigung bzw. stärksten Gefälles."
        ]
      },
      "questions": [
        {
          "type": "choice",
          "prompt": "Wo liegen die Extremstellen von f(x) = x³ − 3x?",
          "options": [
            "nur bei x = 0",
            "bei x = −1 und x = 1",
            "bei x = −3 und x = 3",
            "es gibt keine"
          ],
          "answer": 1,
          "explain": "f'(x) = 3x² − 3 = 0 ⟹ x² = 1 ⟹ x = ±1."
        },
        {
          "type": "choice",
          "prompt": "An der Stelle x₀ gilt f''(x₀) = 0 und f'''(x₀) ≠ 0. Was liegt dort vor?",
          "options": [
            "ein Hochpunkt",
            "ein Tiefpunkt",
            "eine Wendestelle",
            "eine Nullstelle"
          ],
          "answer": 2,
          "explain": "Das ist genau das hinreichende Kriterium für eine Wendestelle."
        },
        {
          "type": "number",
          "prompt": "An welcher Stelle liegt die Wendestelle von f(x) = x³ − 3x?",
          "answer": 0,
          "tolerance": 0.01,
          "explain": "f''(x) = 6x = 0 ⟹ x = 0, und f'''(0) = 6 ≠ 0."
        }
      ]
    },
    {
      "id": "extremwerte",
      "subject": "mathe",
      "title": "Extremwertprobleme",
      "pos": [
        348,
        396
      ],
      "requires": "kurven",
      "info": {
        "intro": "Bei Extremwertaufgaben soll eine Größe maximal oder minimal werden. Man stellt eine Zielfunktion auf, setzt die Nebenbedingung ein und leitet ab.",
        "formulas": [
          {
            "formula": "1. Zielgröße Z aufstellen",
            "label": "Schritt 1"
          },
          {
            "formula": "2. Nebenbedingung einsetzen → Z(x)",
            "label": "Schritt 2"
          },
          {
            "formula": "3. Z'(x) = 0 lösen",
            "label": "Schritt 3"
          },
          {
            "formula": "4. Z''(x) < 0 → Maximum",
            "label": "Schritt 4"
          }
        ],
        "notes": [
          "Der Definitionsbereich ergibt sich aus dem Sachzusammenhang, z. B. x > 0 für eine Länge.",
          "Randwerte des Definitionsbereichs müssen zusätzlich geprüft werden.",
          "Am Ende immer zurück in den Sachzusammenhang: Antwortsatz mit Einheit."
        ]
      },
      "questions": [
        {
          "type": "choice",
          "prompt": "Ein Rechteck hat den Umfang 40 m. Bei welchen Seitenlängen ist die Fläche maximal?",
          "options": [
            "5 m × 15 m",
            "8 m × 12 m",
            "10 m × 10 m",
            "2 m × 18 m"
          ],
          "answer": 2,
          "explain": "Mit u = 40 gilt y = 20 − x, also A(x) = x(20 − x). A'(x) = 20 − 2x = 0 ⟹ x = 10. Das Quadrat ist optimal."
        },
        {
          "type": "number",
          "prompt": "Wie groß ist bei dieser Aufgabe die maximale Fläche?",
          "unit": "m²",
          "answer": 100,
          "tolerance": 0.5,
          "explain": "A(10) = 10 · (20 − 10) = 100 m²."
        },
        {
          "type": "choice",
          "prompt": "Warum müssen bei Extremwertaufgaben auch die Ränder des Definitionsbereichs geprüft werden?",
          "options": [
            "Weil die Ableitung dort nicht existiert.",
            "Weil das Maximum am Rand liegen kann, ohne dass Z'(x) = 0 gilt.",
            "Weil die Nebenbedingung dort ungültig wird.",
            "Das ist nicht nötig."
          ],
          "answer": 1,
          "explain": "Ein Randmaximum ist kein lokaler Extrempunkt im Innern, wird also von Z'(x) = 0 nicht gefunden."
        }
      ]
    },
    {
      "id": "vektoren",
      "subject": "mathe",
      "title": "Punkte & Vektoren im Raum",
      "pos": [
        500,
        292
      ],
      "requires": "extremwerte",
      "info": {
        "intro": "Im dreidimensionalen Raum wird jeder Punkt durch drei Koordinaten beschrieben. Vektoren geben Verschiebungen an und haben Betrag und Richtung.",
        "formulas": [
          {
            "formula": "AB = B − A",
            "label": "Verbindungsvektor"
          },
          {
            "formula": "|a| = √(a₁² + a₂² + a₃²)",
            "label": "Betrag"
          },
          {
            "formula": "M = ½ · (A + B)",
            "label": "Mittelpunkt einer Strecke"
          },
          {
            "formula": "x = a + r · u",
            "label": "Geradengleichung"
          }
        ],
        "notes": [
          "Der Betrag eines Vektors ist die Länge der zugehörigen Strecke.",
          "Zwei Vektoren sind parallel (kollinear), wenn einer ein Vielfaches des anderen ist.",
          "In der Geradengleichung ist a der Stützvektor und u der Richtungsvektor."
        ]
      },
      "questions": [
        {
          "type": "choice",
          "prompt": "Gegeben sind A(1|2|3) und B(4|6|3). Wie lautet der Vektor AB?",
          "options": [
            "(3|4|0)",
            "(5|8|6)",
            "(−3|−4|0)",
            "(3|4|6)"
          ],
          "answer": 0,
          "explain": "AB = B − A = (4−1 | 6−2 | 3−3) = (3|4|0)."
        },
        {
          "type": "number",
          "prompt": "Wie groß ist der Betrag des Vektors (3|4|0)?",
          "answer": 5,
          "tolerance": 0.05,
          "explain": "|a| = √(9 + 16 + 0) = √25 = 5."
        },
        {
          "type": "choice",
          "prompt": "Wo liegt der Mittelpunkt der Strecke von A(2|0|4) nach B(6|4|0)?",
          "options": [
            "M(4|2|2)",
            "M(8|4|4)",
            "M(2|2|2)",
            "M(4|4|0)"
          ],
          "answer": 0,
          "explain": "M = ½ · (A + B) = ½ · (8|4|4) = (4|2|2)."
        }
      ]
    },
    {
      "id": "skalar",
      "subject": "mathe",
      "title": "Skalarprodukt",
      "pos": [
        140,
        396
      ],
      "requires": "vektoren",
      "info": {
        "intro": "Das Skalarprodukt ordnet zwei Vektoren eine Zahl zu. Damit lassen sich Winkel berechnen und Orthogonalität prüfen.",
        "formulas": [
          {
            "formula": "a · b = a₁b₁ + a₂b₂ + a₃b₃",
            "label": "Koordinatenform"
          },
          {
            "formula": "a · b = |a| · |b| · cos φ",
            "label": "geometrische Form"
          },
          {
            "formula": "a · b = 0  ⟺  a ⊥ b",
            "label": "Orthogonalität"
          },
          {
            "formula": "cos φ = (a · b) / (|a| · |b|)",
            "label": "Winkel zwischen Vektoren"
          }
        ],
        "notes": [
          "Das Ergebnis des Skalarprodukts ist eine Zahl, kein Vektor.",
          "Der Nullvektor ist zu jedem Vektor orthogonal — dieser Sonderfall wird meist ausgeschlossen.",
          "Für den Winkel zwischen Geraden nimmt man den Betrag des Skalarprodukts, damit φ ≤ 90° herauskommt."
        ]
      },
      "questions": [
        {
          "type": "number",
          "prompt": "Berechne das Skalarprodukt von (1|2|3) und (4|−1|2).",
          "answer": 8,
          "tolerance": 0.01,
          "explain": "1·4 + 2·(−1) + 3·2 = 4 − 2 + 6 = 8."
        },
        {
          "type": "choice",
          "prompt": "Welche Beziehung besteht zwischen (2|−1|0) und (1|2|5)?",
          "options": [
            "sie sind parallel",
            "sie sind orthogonal",
            "sie sind gleich lang",
            "keine besondere"
          ],
          "answer": 1,
          "explain": "2·1 + (−1)·2 + 0·5 = 2 − 2 + 0 = 0, also stehen sie senkrecht aufeinander."
        },
        {
          "type": "number",
          "prompt": "Welchen Winkel schließen (1|0|0) und (0|1|0) ein? Gib den Wert in Grad an.",
          "unit": "°",
          "answer": 90,
          "tolerance": 0.5,
          "explain": "Das Skalarprodukt ist 0, also cos φ = 0 und damit φ = 90°."
        }
      ]
    },
    {
      "id": "stochastik",
      "subject": "mathe",
      "title": "Stochastik",
      "pos": [
        286,
        432
      ],
      "requires": "skalar",
      "info": {
        "intro": "Die Stochastik beschreibt Zufallsexperimente. Bei einer Bernoulli-Kette wird ein Versuch mit zwei Ausgängen n-mal unabhängig wiederholt.",
        "formulas": [
          {
            "formula": "P(A) = günstige / mögliche",
            "label": "Laplace-Wahrscheinlichkeit"
          },
          {
            "formula": "P(X = k) = C(n,k) · pᵏ · (1−p)ⁿ⁻ᵏ",
            "label": "Binomialverteilung"
          },
          {
            "formula": "E(X) = n · p",
            "label": "Erwartungswert"
          },
          {
            "formula": "σ = √(n · p · (1 − p))",
            "label": "Standardabweichung"
          },
          {
            "formula": "P(A|B) = P(A ∩ B) / P(B)",
            "label": "bedingte Wahrscheinlichkeit"
          }
        ],
        "notes": [
          "Bei unabhängigen Ereignissen multiplizieren sich die Wahrscheinlichkeiten entlang eines Pfades im Baumdiagramm.",
          "Die Wahrscheinlichkeiten aller Äste an einem Knoten ergeben zusammen 1.",
          "Gegenereignis nutzen: P(mindestens einmal) = 1 − P(keinmal)."
        ]
      },
      "questions": [
        {
          "type": "number",
          "prompt": "Ein Versuch wird 50-mal durchgeführt, die Trefferwahrscheinlichkeit beträgt p = 0,2. Wie groß ist der Erwartungswert?",
          "answer": 10,
          "tolerance": 0.1,
          "explain": "E(X) = n · p = 50 · 0,2 = 10."
        },
        {
          "type": "choice",
          "prompt": "Ein fairer Würfel wird zweimal geworfen. Wie groß ist die Wahrscheinlichkeit für zweimal die Sechs?",
          "options": [
            "1/6",
            "1/12",
            "1/36",
            "2/6"
          ],
          "answer": 2,
          "explain": "Die Würfe sind unabhängig: 1/6 · 1/6 = 1/36."
        },
        {
          "type": "number",
          "prompt": "Wie groß ist die Standardabweichung bei n = 100 und p = 0,5?",
          "answer": 5,
          "tolerance": 0.05,
          "explain": "σ = √(100 · 0,5 · 0,5) = √25 = 5."
        }
      ]
    }
  ]
};
