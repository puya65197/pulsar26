

const INTERACT_RADIUS = 20;

class World {
  constructor({ map, collision, questions }) {
    this.image = map;
    this.width = map.width;
    this.height = map.height;

    this.cell = collision.cell;
    this.cols = collision.cols;
    this.rows = collision.rows;
    this.grid = collision.grid;

    this.stations = questions.stations.map((s) => ({
      ...s,
      x: s.pos[0],
      y: s.pos[1],
      solved: false,
      seen: false,
    }));

    this.camera = { x: 0, y: 0 };
  }

  stationById(id) {
    return this.stations.find((s) => s.id === id) || null;
  }


  isLocked(station, mode) {
    if (mode !== 'quiz' || !station.requires) return false;
    const prev = this.stationById(station.requires);
    return prev ? !prev.solved : false;
  }

  blockedAt(px, py) {
    const cx = Math.floor(px / this.cell);
    const cy = Math.floor(py / this.cell);
    if (cx < 0 || cy < 0 || cx >= this.cols || cy >= this.rows) return true;
    return this.grid[cy][cx] === 1;
  }


  boxBlocked(left, top, w, h) {
    const x0 = Math.floor(left / this.cell);
    const x1 = Math.floor((left + w - 1) / this.cell);
    const y0 = Math.floor(top / this.cell);
    const y1 = Math.floor((top + h - 1) / this.cell);
    for (let cy = y0; cy <= y1; cy++) {
      for (let cx = x0; cx <= x1; cx++) {
        if (cx < 0 || cy < 0 || cx >= this.cols || cy >= this.rows) return true;
        if (this.grid[cy][cx] === 1) return true;
      }
    }
    return false;
  }

  nearestStation(px, py, mode) {
    let best = null;
    let bestDist = INTERACT_RADIUS;
    for (const s of this.stations) {
      if (this.isLocked(s, mode)) continue;
      if (mode === 'quiz' && s.solved) continue;
      const d = Math.hypot(s.x - px, s.y - py);
      if (d < bestDist) { bestDist = d; best = s; }
    }
    return best;
  }

  updateCamera(px, py, viewW, viewH) {
    const cx = this.width <= viewW
      ? (this.width - viewW) / 2
      : Math.min(Math.max(px - viewW / 2, 0), this.width - viewW);
    const cy = this.height <= viewH
      ? (this.height - viewH) / 2
      : Math.min(Math.max(py - viewH / 2, 0), this.height - viewH);
    this.camera.x = Math.round(cx);
    this.camera.y = Math.round(cy);
  }

  progress(mode) {
    const total = this.stations.length;
    const done = this.stations.filter((s) => (mode === 'quiz' ? s.solved : s.seen)).length;
    return { done, total };
  }

  reset() {
    for (const s of this.stations) { s.solved = false; s.seen = false; }
  }
}
