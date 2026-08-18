"""Erzeugt player.png: ein 16x24-Sprite in 4 Richtungen mit je 4 Laufframes.

Sheet-Layout (64 x 96 px):
    Zeile 0 = unten (zum Betrachter), 1 = links, 2 = rechts, 3 = oben
    Spalte 0..3 = Laufzyklus (0/2 = Standbein, 1 = Schritt links, 3 = Schritt rechts)
"""
from PIL import Image

OUT = "../assets/player.png"
CW, CH = 16, 24          
COLS, ROWS = 4, 4

PALETTE = {
    ".": None,
    "o": (27, 31, 42),        
    "h": (58, 42, 31),        
    "H": (85, 64, 44),        
    "s": (232, 185, 140),     
    "S": (200, 146, 106),     
    "e": (27, 31, 42),        
    "j": (47, 111, 158),      
    "J": (36, 90, 128),       
    "k": (122, 74, 44),       
    "p": (51, 64, 92),        
    "b": (42, 42, 46),        
}


HEAD_FRONT = [
    ".....oooooo.....",
    "....ohhhhhho....",
    "....ohhHHhho....",
    "....ohhhhhho....",
    "....osssssso....",
    "....osessseo....",
    "....osssssso....",
    "....ossSSsso....",
    "....osssssso....",
    ".....oooooo.....",
]
HEAD_SIDE = [
    ".....oooooo.....",
    "....ohhhhhho....",
    "....ohhhHHho....",
    "....ohhhhhho....",
    "....osshhhho....",
    "....osehhhho....",
    "....ossshhho....",
    "....osSshhho....",
    "....ossshhho....",
    ".....oooooo.....",
]
HEAD_BACK = [
    ".....oooooo.....",
    "....ohhhhhho....",
    "....ohhhhhho....",
    "....ohhHHhho....",
    "....ohhhhhho....",
    "....ohhhhhho....",
    "....ohhhhhho....",
    "....ohhhhhho....",
    "....ohhhhhho....",
    ".....oooooo.....",
]


BODY_FRONT = [
    "...ojjjjjjjjo...",
    "...ojjjjjjjjo...",
    "...oJjjjjjjJo...",
    "...osjjjjjjso...",
    "...osjjjjjjso...",
    "...oojjjjjjoo...",
]
BODY_SIDE = [
    "...ojjjjjjjjo...",
    "...ojjjjjjjjo...",
    "...ojjjjjjJJo...",
    "...osjjjjjJJo...",
    "...osjjjjjJJo...",
    "...oojjjjjjoo...",
]
BODY_BACK = [
    "...ojjjjjjjjo...",
    "...ojkkkkkkjo...",
    "...ojkkkkkkjo...",
    "...oskkkkkkso...",
    "...oskkkkkkso...",
    "...oojkkkkjoo...",
]


LEGS_STAND = [
    "....oppppppo....",
    "....oppooppo....",
    "....oppooppo....",
    "....obboobbo....",
    ".....oo..oo.....",
]
LEGS_STEP_L = [
    "....oppppppo....",
    "....oppooppo....",
    "....obbooppo....",
    ".....oo.obbo....",
    ".........oo.....",
]
LEGS_STEP_R = [
    "....oppppppo....",
    "....oppooppo....",
    "....oppoobbo....",
    "....obbo.oo.....",
    ".....oo.........",
]
LEG_CYCLE = [LEGS_STAND, LEGS_STEP_L, LEGS_STAND, LEGS_STEP_R]

BLANK = ["." * CW] * 3     


def build_cell(head, body, legs):
    rows = BLANK + head + body + legs
    assert len(rows) == CH, f"Zelle hat {len(rows)} statt {CH} Zeilen"
    for i, r in enumerate(rows):
        assert len(r) == CW, f"Zeile {i} hat {len(r)} statt {CW} Zeichen: {r!r}"
    return rows


def draw(sheet, rows, ox, oy, mirror=False):
    for y, line in enumerate(rows):
        for x, ch in enumerate(line):
            color = PALETTE[ch]
            if color is None:
                continue
            px = (CW - 1 - x) if mirror else x
            sheet.putpixel((ox + px, oy + y), color + (255,))


sheet = Image.new("RGBA", (CW * COLS, CH * ROWS), (0, 0, 0, 0))

directions = [
    (HEAD_FRONT, BODY_FRONT, False),   
    (HEAD_SIDE, BODY_SIDE, False),     
    (HEAD_SIDE, BODY_SIDE, True),      
    (HEAD_BACK, BODY_BACK, False),     
]

for row, (head, body, mirror) in enumerate(directions):
    for col, legs in enumerate(LEG_CYCLE):
        cell = build_cell(head, body, legs)
        draw(sheet, cell, col * CW, row * CH, mirror)

sheet.save(OUT)
print("Sprite:", OUT, sheet.size)

prev = Image.new("RGBA", (sheet.width * 6, sheet.height * 6), (250, 250, 250, 255))
prev.alpha_composite(sheet.resize((sheet.width * 6, sheet.height * 6), Image.NEAREST))
prev.convert("RGB").save("preview.png")
