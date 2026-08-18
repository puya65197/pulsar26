// Spielschleife, Rendering und Zustandswechsel.


const SPAWN = { x: 206, y: 312 };   // offener Schulhof, Pixelkoordinaten auf campus_map.png
const TARGET_VIEW_W = 232;     // angestrebte sichtbare Weltbreite in Pixeln
const MIN_ZOOM = 2;
const MAX_ZOOM = 8;

const COLORS = {
  ink: '#14181f',
  paper: '#f3ead6',
  paperShade: '#cbbd9d',
  physik: '#3f7fbf',
  mathe: '#c1614a',
  locked: '#7d8590',
  solved: '#4e9a4b',
};

class Game {
  constructor(canvas, assets, input, ui) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.input = input;
    this.ui = ui;
    this.world = new World(assets);
    this.player = new Player(assets.player, SPAWN.x, SPAWN.y);

    this.mode = null;          // 'info' | 'quiz'
    this.state = 'menu';       // 'menu' | 'play' | 'panel'
    this.mistakes = 0;
    this.zoom = 3;
    this.time = 0;
    this._last = 0;
    this.showGrid = false;

    addEventListener('keydown', (e) => {
      if (e.code === 'KeyG') this.showGrid = !this.showGrid;
    });

    addEventListener('resize', () => this.resize());
    this.resize();
  }

  start(mode) {
    this.mode = mode;
    this.state = 'play';
    this.mistakes = 0;
    this.world.reset();
    this.player.x = SPAWN.x;
    this.player.y = SPAWN.y;
    this.player.dir = 'down';
    this.ui.showMenu(false);
    this.ui.setHud(mode, this.world.progress(mode));
  }

  toMenu() {
    this.state = 'menu';
    this.ui.showMenu(true);
    this.ui.setHint(null);
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.round(this.canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * dpr));
    this.canvas.width = w;
    this.canvas.height = h;
    this.zoom = clamp(Math.round(w / TARGET_VIEW_W), MIN_ZOOM, MAX_ZOOM);
    this.ctx.imageSmoothingEnabled = false;
  }

  run() {
    requestAnimationFrame((t) => { this._last = t; this.loop(t); });
  }

  loop(now) {
    const dt = Math.min((now - this._last) / 1000 || 0, 0.05);
    this._last = now;
    this.time += dt;

    if (this.state === 'play') this.update(dt);
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    this.player.update(dt, this.input.direction(), this.world);

    const near = this.world.nearestStation(this.player.x, this.player.y, this.mode);
    this.ui.setHint(near ? `${near.title} — öffnen mit E` : null);

    const acted = this.input.consumeAction();
    if (acted && near) this.openStation(near);
  }

  openStation(station) {
    this.state = 'panel';
    if (this.mode === 'info') {
      station.seen = true;
      this.ui.showInfo(station, () => this.afterPanel());
    } else {
      this.ui.showQuiz(station, (solved, mistakes) => {
        this.mistakes += mistakes;
        if (solved) station.solved = true;
        this.afterPanel();
      });
    }
    this.ui.setHud(this.mode, this.world.progress(this.mode));
  }

  afterPanel() {
    const progress = this.world.progress(this.mode);
    this.ui.setHud(this.mode, progress);
    if (progress.done === progress.total) {
      this.state = 'panel';
      this.ui.showFinish(this.mode, progress, this.mistakes, () => this.toMenu());
      return;
    }
    this.state = 'play';
  }

  // ---------- Rendering ----------

  render() {
    const { ctx, canvas, zoom, world } = this;
    const viewW = canvas.width / zoom;
    const viewH = canvas.height / zoom;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#0d1015';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (this.state === 'menu') return;

    world.updateCamera(this.player.x, this.player.y, viewW, viewH);

    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(-world.camera.x, -world.camera.y);

    ctx.drawImage(world.image, 0, 0);

    const drawables = [];
    for (const s of world.stations) {
      if (this.mode === 'quiz' && s.solved) { drawables.push({ y: s.y, draw: () => this.drawStation(s, 'solved') }); continue; }
      const locked = world.isLocked(s, this.mode);
      const seen = this.mode === 'info' && s.seen;
      drawables.push({ y: s.y, draw: () => this.drawStation(s, locked ? 'locked' : seen ? 'seen' : 'open') });
    }
    drawables.push({ y: this.player.y, draw: () => this.player.draw(ctx) });
    drawables.sort((a, b) => a.y - b.y);
    for (const d of drawables) d.draw();

    if (this.showGrid) this.drawCollisionGrid();

    ctx.restore();
  }

  /** Debug: blockierte Zellen einblenden (Taste G). */
  drawCollisionGrid() {
    const { ctx, world } = this;
    const cell = world.cell;
    ctx.fillStyle = 'rgba(220, 60, 70, 0.38)';
    const x0 = Math.floor(world.camera.x / cell);
    const y0 = Math.floor(world.camera.y / cell);
    const x1 = Math.min(world.cols, x0 + Math.ceil(this.canvas.width / this.zoom / cell) + 2);
    const y1 = Math.min(world.rows, y0 + Math.ceil(this.canvas.height / this.zoom / cell) + 2);
    for (let cy = Math.max(0, y0); cy < y1; cy++) {
      for (let cx = Math.max(0, x0); cx < x1; cx++) {
        if (world.grid[cy][cx] === 1) ctx.fillRect(cx * cell, cy * cell, cell, cell);
      }
    }
  }

  /** Merkzettel-Marker: Schatten, Papier, Fachfarbe, Zustand. */
  drawStation(station, state) {
    const ctx = this.ctx;
    const bob = Math.round(Math.sin(this.time * 2.2 + station.x * 0.1) * 1.5);
    const x = Math.round(station.x) - 6;
    const y = Math.round(station.y) - 20 + bob;

    // Schatten am Boden
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.fillRect(x + 2, Math.round(station.y) - 2, 8, 2);

    // Kontur + Papier
    ctx.fillStyle = COLORS.ink;
    ctx.fillRect(x - 1, y - 1, 14, 16);
    ctx.fillStyle = state === 'locked' ? COLORS.paperShade : COLORS.paper;
    ctx.fillRect(x, y, 12, 14);

    // Kopfband in der Fachfarbe
    let band = station.subject === 'physik' ? COLORS.physik : COLORS.mathe;
    if (state === 'locked') band = COLORS.locked;
    if (state === 'solved') band = COLORS.solved;
    ctx.fillStyle = band;
    ctx.fillRect(x, y, 12, 4);

    // Zustandssymbol
    ctx.fillStyle = COLORS.ink;
    if (state === 'locked') {
      ctx.fillRect(x + 4, y + 7, 4, 4);
      ctx.fillRect(x + 5, y + 6, 2, 1);
    } else if (state === 'solved') {
      ctx.fillStyle = COLORS.solved;
      ctx.fillRect(x + 3, y + 9, 2, 2);
      ctx.fillRect(x + 5, y + 10, 2, 2);
      ctx.fillRect(x + 7, y + 7, 2, 2);
      ctx.fillRect(x + 8, y + 6, 2, 2);
    } else {
      // angedeutete Textzeilen
      ctx.fillRect(x + 2, y + 6, 8, 1);
      ctx.fillRect(x + 2, y + 8, 8, 1);
      ctx.fillRect(x + 2, y + 10, 5, 1);
      if (state === 'seen') {
        ctx.fillStyle = COLORS.solved;
        ctx.fillRect(x + 8, y + 10, 3, 3);
      }
    }
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
