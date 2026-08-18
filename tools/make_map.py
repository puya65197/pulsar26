"""Erzeugt aus dem Google-Earth-Screenshot eine Pixel-Art-Map fuer das Spiel.

Schritte:
  1. Crop auf den Campus (Google-Earth-Bedienelemente entfernen)
  2. Eingeblendete Labels (Text + Pin) per Inpainting entfernen
  3. Downsampling auf Pixel-Art-Aufloesung
  4. Kontrast/Saettigung + feste Palette -> Retro-Look
"""
from PIL import Image
import numpy as np

SRC = "../quelle/campus_screenshot.png"
OUT = "../assets/campus_map.png"
CROP = (500, 180, 1340, 920)
BASE_W = 640
LABEL_BOXES = [
    (486, 388, 692, 440),   # "Campus Klarenthal" + Pin
    (0, 574, 145, 626),     # "Gehrner Bach"
]

img = Image.open(SRC).convert("RGB").crop(CROP)
arr = np.asarray(img).astype(np.float32)
h, w, _ = arr.shape

# --- Maske: helle Schriftpixel und ihre dunkle Kontur innerhalb der Label-Boxen ---
mask = np.zeros((h, w), dtype=bool)
lum = arr.mean(axis=2)
for l, t, r, b in LABEL_BOXES:
    region = np.zeros((h, w), dtype=bool)
    region[t:b, l:r] = True
    mask |= region & ((lum > 165) | (lum < 42))

# Maske verbreitern, damit Antialiasing-Raender mitgehen
for _ in range(3):
    grown = mask.copy()
    grown[1:, :] |= mask[:-1, :]
    grown[:-1, :] |= mask[1:, :]
    grown[:, 1:] |= mask[:, :-1]
    grown[:, :-1] |= mask[:, 1:]
    mask = grown

# --- Inpainting: maskierte Pixel iterativ aus gueltigen Nachbarn mitteln ---
valid = (~mask).astype(np.float32)[..., None]
work = arr * valid
for _ in range(160):
    acc = np.zeros_like(work)
    cnt = np.zeros_like(valid)
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        acc += np.roll(work, (dy, dx), axis=(0, 1))
        cnt += np.roll(valid, (dy, dx), axis=(0, 1))
    filled = np.divide(acc, np.maximum(cnt, 1e-6))
    newly = (cnt > 0) & (valid == 0)
    work = np.where(newly, filled, work)
    valid = np.maximum(valid, newly.astype(np.float32))
    if valid.min() > 0:
        break

img = Image.fromarray(np.clip(work, 0, 255).astype(np.uint8))

# --- Pixel-Art-Aufbereitung ---
small = img.resize((BASE_W, round(BASE_W * h / w)), Image.BOX)
a = np.asarray(small).astype(np.float32)
a = np.clip((a - 128.0) * 1.16 + 132.0, 0, 255)
m = a.mean(axis=2, keepdims=True)
a = np.clip(m + (a - m) * 1.40, 0, 255)
small = Image.fromarray(a.astype(np.uint8))

pixel = small.quantize(colors=32, method=Image.MEDIANCUT, dither=Image.NONE).convert("RGB")
pixel.save(OUT)
print("Map:", OUT, pixel.size)
pixel.save("preview.png")
