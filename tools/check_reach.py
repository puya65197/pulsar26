"""Prueft, ob Spawn und alle Stationen begehbar und miteinander verbunden sind.

Nach jeder Aenderung an make_collision.py oder an den Stationspositionen
in data/questions.js ausfuehren:  python3 check_reach.py
"""
import json
import re
from collections import deque

col = json.loads(re.search(r"window\.COLLISION = (.*);", open("../assets/collision.js").read()).group(1))
qs = json.loads(re.search(r"window\.QUESTIONS = (.*);", open("../data/questions.js").read(), re.S).group(1))

CELL, gw, gh, grid = col["cell"], col["cols"], col["rows"], col["grid"]
SPAWN = (206, 312)   # muss zu SPAWN in js/game.js passen


def walkable(cx, cy):
    return 0 <= cx < gw and 0 <= cy < gh and grid[cy][cx] == 0


sx, sy = SPAWN[0] // CELL, SPAWN[1] // CELL
if not walkable(sx, sy):
    raise SystemExit("FEHLER: Startpunkt liegt auf einer blockierten Zelle")

seen = {(sx, sy)}
q = deque([(sx, sy)])
while q:
    x, y = q.popleft()
    for n in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if n not in seen and walkable(*n):
            seen.add(n)
            q.append(n)

print(f"Begehbarer Bereich ab Start: {len(seen)} von {gw * gh} Zellen "
      f"({len(seen) / (gw * gh):.0%})")

problems = []
for s in qs["stations"]:
    cx, cy = s["pos"][0] // CELL, s["pos"][1] // CELL
    if not walkable(cx, cy):
        problems.append((s["id"], s["pos"], "liegt auf blockierter Zelle"))
    elif (cx, cy) not in seen:
        problems.append((s["id"], s["pos"], "vom Start aus nicht erreichbar"))

if problems:
    print("\nProbleme:")
    for sid, pos, why in problems:
        print(f"  {sid:14s} {tuple(pos)}  {why}")
    raise SystemExit(1)
print(f"Alle {len(qs['stations'])} Stationen erreichbar.")
