// Buendelt Tastatur, Wisch-Steuerung und Bildschirm-Buttons zu einem
// gemeinsamen Richtungsvektor plus einem Aktions-Flag.

const KEY_DIRS = {
  KeyW: [0, -1], ArrowUp: [0, -1],
  KeyS: [0, 1], ArrowDown: [0, 1],
  KeyA: [-1, 0], ArrowLeft: [-1, 0],
  KeyD: [1, 0], ArrowRight: [1, 0],
};
const ACTION_KEYS = ['KeyE', 'Enter', 'Space'];
const DEAD_ZONE = 8;      // px, bevor ein Wisch als Richtung zaehlt
const MAX_SWIPE = 34;     // px, ab hier volle Geschwindigkeit

class Input {
  constructor(canvas, touchLayer) {
    this.keys = new Set();
    this.pad = { x: 0, y: 0 };
    this.swipe = { x: 0, y: 0 };
    this.actionPressed = false;
    this._touchId = null;
    this._origin = { x: 0, y: 0 };

    this._bindKeyboard();
    this._bindSwipe(canvas);
    this._bindButtons(touchLayer);
  }

  _bindKeyboard() {
    addEventListener('keydown', (e) => {
      if (e.repeat) return;
      if (KEY_DIRS[e.code]) { this.keys.add(e.code); e.preventDefault(); }
      if (ACTION_KEYS.includes(e.code)) { this.actionPressed = true; e.preventDefault(); }
    });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    addEventListener('blur', () => { this.keys.clear(); this.swipe = { x: 0, y: 0 }; });
  }

  _bindSwipe(canvas) {
    const start = (t) => { this._touchId = t.identifier; this._origin = { x: t.clientX, y: t.clientY }; };
    const move = (t) => {
      const dx = t.clientX - this._origin.x;
      const dy = t.clientY - this._origin.y;
      const len = Math.hypot(dx, dy);
      if (len < DEAD_ZONE) { this.swipe = { x: 0, y: 0 }; return; }
      const scale = Math.min(len, MAX_SWIPE) / len;
      this.swipe = { x: (dx * scale) / MAX_SWIPE, y: (dy * scale) / MAX_SWIPE };
    };
    const end = () => { this._touchId = null; this.swipe = { x: 0, y: 0 }; };

    canvas.addEventListener('touchstart', (e) => {
      if (this._touchId === null) start(e.changedTouches[0]);
      e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      for (const t of e.changedTouches) if (t.identifier === this._touchId) move(t);
      e.preventDefault();
    }, { passive: false });

    for (const type of ['touchend', 'touchcancel']) {
      canvas.addEventListener(type, (e) => {
        for (const t of e.changedTouches) if (t.identifier === this._touchId) end();
      });
    }
  }

  _bindButtons(layer) {
    if (!layer) return;
    const held = new Map();
    const setDir = () => {
      let x = 0, y = 0;
      for (const dir of held.values()) { x += dir[0]; y += dir[1]; }
      this.pad = { x: Math.sign(x), y: Math.sign(y) };
    };

    for (const btn of layer.querySelectorAll('[data-dir]')) {
      const [dx, dy] = btn.dataset.dir.split(',').map(Number);
      const press = (e) => { e.preventDefault(); held.set(btn, [dx, dy]); setDir(); btn.classList.add('is-down'); };
      const release = () => { held.delete(btn); setDir(); btn.classList.remove('is-down'); };
      btn.addEventListener('pointerdown', press);
      btn.addEventListener('pointerup', release);
      btn.addEventListener('pointerleave', release);
      btn.addEventListener('pointercancel', release);
    }

    const action = layer.querySelector('[data-action]');
    if (action) {
      action.addEventListener('pointerdown', (e) => { e.preventDefault(); this.actionPressed = true; });
    }
  }


  direction() {
    let x = this.pad.x + this.swipe.x;
    let y = this.pad.y + this.swipe.y;
    for (const code of this.keys) {
      const [kx, ky] = KEY_DIRS[code];
      x += kx; y += ky;
    }
    const len = Math.hypot(x, y);
    if (len < 0.01) return { x: 0, y: 0 };
    return { x: x / Math.max(len, 1), y: y / Math.max(len, 1) };
  }


  consumeAction() {
    if (!this.actionPressed) return false;
    this.actionPressed = false;
    return true;
  }
}
