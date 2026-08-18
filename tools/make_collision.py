"""Erzeugt assets/collision.js — das Kollisionsraster des Spiels.

Standardmaessig ist die gesamte Karte begehbar; nur der aeussere Rand ist
dicht, damit man nicht aus dem Bild laeuft.

Wer spaeter doch Hindernisse will, setzt BLOCK_TERRAIN = True. Dann werden
dichte Baumgruppen anhand der Bildfarben erkannt und die unten gelisteten
Gebaeuderechtecke gesperrt. Danach unbedingt pruefen, ob alle Stationen
noch erreichbar sind: python3 check_reach.py
"""
import json
from PIL import Image
import numpy as np

MAP = "../assets/campus_map.png"
OUT = "../assets/collision.js"
CELL = 8

BLOCK_TERRAIN = False,

BUILDINGS = [
    (118, 100, 128, 108),
    (222,  48,  62,  52),
    (196, 190, 100,  60),
    (226, 218,  80,  54),
    (300, 196,  76,  54),
    (286, 250,  78,  64),
    (330, 314,  96,  62),
    (416, 356, 104,  92),
    ( 62, 296,  92,  70),
    (174, 366,  90,  76),
]

img = Image.open(MAP).convert("RGB")
W, H = img.size
gw, gh = W // CELL, H // CELL
grid = [[0] * gw for _ in range(gh)]

if BLOCK_TERRAIN:
    arr = np.asarray(img).astype(np.float32)
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    vegetation = (lum < 62) & (g >= r - 6)
    for cy in range(gh):
        for cx in range(gw):
            block = vegetation[cy * CELL:(cy + 1) * CELL, cx * CELL:(cx + 1) * CELL]
            if block.mean() > 0.80:
                grid[cy][cx] = 1
    for bx, by, bw, bh in BUILDINGS:
        for cy in range(by // CELL, min(gh, (by + bh + CELL - 1) // CELL)):
            for cx in range(bx // CELL, min(gw, (bx + bw + CELL - 1) // CELL)):
                grid[cy][cx] = 1


for cx in range(gw):
    grid[0][cx] = grid[gh - 1][cx] = 1
for cy in range(gh):
    grid[cy][0] = grid[cy][gw - 1] = 1

data = {"cell": CELL, "cols": gw, "rows": gh, "grid": grid}
with open(OUT, "w") as f:
    f.write("// Kollisionsraster: 1 = blockiert, 0 = begehbar.\n")
    f.write("// Wird von tools/make_collision.py erzeugt.\n")
    f.write("window.COLLISION = " + json.dumps(data, separators=(",", ":")) + ";\n")

blocked = sum(sum(row) for row in grid)
print(f"{OUT}: {gw}x{gh} Zellen, {blocked} blockiert ({blocked / (gw * gh):.0%})")
print("Hindernisse:", "an" if BLOCK_TERRAIN else "aus (nur Kartenrand)")
