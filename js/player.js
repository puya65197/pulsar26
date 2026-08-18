// Spielerfigur: Position, Bewegung mit Kollision, Laufanimation.

const FRAME_W = 16;
const FRAME_H = 24;
const DIR_ROW = { down: 0, left: 1, right: 2, up: 3 };
const WALK_CYCLE = [0, 1, 2, 3];
const FRAME_TIME = 0.14;      // Sekunden pro Laufframe
const SPEED = 54;             // Weltpixel pro Sekunde

// Fusszone (Kollisionsrechteck) relativ zur Spielerposition
const FOOT_W = 10;
const FOOT_H = 7;

class Player {
  constructor(sprite, x, y) {
    this.sprite = sprite;
    this.x = x;                 // Weltkoordinaten, Mitte der Fuesse
    this.y = y;
    this.dir = 'down';
    this.moving = false;
    this._animTime = 0;
    this._frame = 0;
  }

  footBox(x = this.x, y = this.y) {
    return { left: x - FOOT_W / 2, top: y - FOOT_H, w: FOOT_W, h: FOOT_H };
  }

  update(dt, dir, world) {
    const dx = dir.x * SPEED * dt;
    const dy = dir.y * SPEED * dt;
    this.moving = dx !== 0 || dy !== 0;

    // Achsen getrennt pruefen, damit man an Waenden entlanggleitet
    if (dx !== 0) {
      const box = this.footBox(this.x + dx, this.y);
      if (!world.boxBlocked(box.left, box.top, box.w, box.h)) this.x += dx;
    }
    if (dy !== 0) {
      const box = this.footBox(this.x, this.y + dy);
      if (!world.boxBlocked(box.left, box.top, box.w, box.h)) this.y += dy;
    }

    if (Math.abs(dir.x) > Math.abs(dir.y)) this.dir = dir.x < 0 ? 'left' : 'right';
    else if (dir.y !== 0) this.dir = dir.y < 0 ? 'up' : 'down';

    if (this.moving) {
      this._animTime += dt;
      if (this._animTime >= FRAME_TIME) {
        this._animTime -= FRAME_TIME;
        this._frame = (this._frame + 1) % WALK_CYCLE.length;
      }
    } else {
      this._frame = 0;
      this._animTime = 0;
    }
  }

  draw(ctx) {
    const col = WALK_CYCLE[this._frame];
    const row = DIR_ROW[this.dir];
    ctx.drawImage(
      this.sprite,
      col * FRAME_W, row * FRAME_H, FRAME_W, FRAME_H,
      Math.round(this.x - FRAME_W / 2), Math.round(this.y - FRAME_H + 2),
      FRAME_W, FRAME_H,
    );
  }
}
