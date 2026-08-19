
const el = (id) => document.getElementById(id);

class UI {
  constructor() {
    this.menu = el('menu');
    this.hud = el('hud');
    this.hudMode = el('hud-mode');
    this.hudProgress = el('hud-progress');
    this.hudBar = el('hud-bar-fill');
    this.hint = el('hint');
    this.overlay = el('overlay');
    this.panel = el('panel');
    this.touch = el('touch');
    this.openPanel = false;
    this._onClose = null;

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && this.openPanel) this.close();
    });
  }

  onStart(handler) {
    for (const btn of this.menu.querySelectorAll('[data-mode]')) {
      btn.addEventListener('click', () => handler(btn.dataset.mode));
    }
  }

  showMenu(show) {
    this.menu.hidden = !show;
    this.hud.hidden = show;
    this.touch.hidden = show;
  }

  setHud(mode, { done, total }) {
    this.hudMode.textContent = mode === 'quiz' ? 'Quiz-Modus' : 'Info-Modus';
    this.hudProgress.textContent = `${done} / ${total}`;
    this.hudBar.style.width = `${total ? (done / total) * 100 : 0}%`;
  }

  setHint(text) {
    this.hint.textContent = text || '';
    this.hint.hidden = !text;
  }

  close() {
    this.overlay.hidden = true;
    this.panel.innerHTML = '';
    this.openPanel = false;
    const cb = this._onClose;
    this._onClose = null;
    if (cb) cb();
  }

  _open(subject) {
    this.overlay.hidden = false;
    this.panel.dataset.subject = subject || '';
    this.panel.classList.remove('panel-win');
    this.panel.innerHTML = '';
    this.openPanel = true;
    this.setHint(null);
  }


  showInfo(station, onClose) {
    this._open(station.subject);
    this._onClose = onClose;

    const fach = station.subject === 'physik' ? 'Physik' : 'Mathematik';
    const formulas = station.info.formulas
      .map((f) => `<li><code>${escapeHtml(f.formula)}</code><span>${escapeHtml(f.label)}</span></li>`)
      .join('');
    const notes = station.info.notes.map((n) => `<li>${escapeHtml(n)}</li>`).join('');

    this.panel.innerHTML = `
      <p class="panel-eyebrow">${fach} · Info</p>
      <h2 class="panel-title">${escapeHtml(station.title)}</h2>
      <p class="panel-intro">${escapeHtml(station.info.intro)}</p>
      <h3 class="panel-sub">Formeln</h3>
      <ul class="formula-list">${formulas}</ul>
      <h3 class="panel-sub">Merksätze</h3>
      <ul class="note-list">${notes}</ul>
      <div class="panel-actions"><button class="btn" data-close>Schließen</button></div>
    `;
    this.panel.querySelector('[data-close]').addEventListener('click', () => this.close());
    this.panel.scrollTop = 0;
  }



  showQuiz(station, onFinish) {
    this._open(station.subject);
    let index = 0;
    let mistakes = 0;
    let closedByFinish = false;

    this._onClose = () => { if (!closedByFinish) onFinish(false, mistakes); };

    const render = () => {
      const q = station.questions[index];
      const fach = station.subject === 'physik' ? 'Physik' : 'Mathematik';
      const body = q.type === 'choice'
        ? `<ul class="option-list">${q.options
            .map((o, i) => `<li><button class="option" data-pick="${i}">${escapeHtml(o)}</button></li>`)
            .join('')}</ul>`
        : `<div class="number-input">
             <input type="text" inputmode="decimal" autocomplete="off"
                    id="answer-field" placeholder="Antwort" aria-label="Antwort">
             ${q.unit ? `<span class="unit">${escapeHtml(q.unit)}</span>` : ''}
             <button class="btn" data-submit>Prüfen</button>
           </div>`;

      this.panel.innerHTML = `
        <p class="panel-eyebrow">${fach} · Aufgabe ${index + 1} von ${station.questions.length}</p>
        <h2 class="panel-title">${escapeHtml(station.title)}</h2>
        <p class="panel-question">${escapeHtml(q.prompt)}</p>
        ${body}
        <div class="feedback" hidden></div>
      `;
      this.panel.scrollTop = 0;

      if (q.type === 'choice') {
        for (const btn of this.panel.querySelectorAll('[data-pick]')) {
          btn.addEventListener('click', () => check(Number(btn.dataset.pick) === q.answer, btn));
        }
      } else {
        const field = this.panel.querySelector('#answer-field');
        const submit = () => {
          const value = parseGerman(field.value);
          if (value === null) { field.classList.add('is-invalid'); return; }
          field.classList.remove('is-invalid');
          check(Math.abs(value - q.answer) <= (q.tolerance ?? 0.01));
        };
        this.panel.querySelector('[data-submit]').addEventListener('click', submit);
        field.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
        field.focus();
      }
    };

    const check = (correct, pickedBtn) => {
      const q = station.questions[index];
      if (!correct) mistakes++;

      for (const b of this.panel.querySelectorAll('.option')) b.disabled = true;
      const field = this.panel.querySelector('#answer-field');
      if (field) field.disabled = true;
      const submitBtn = this.panel.querySelector('[data-submit]');
      if (submitBtn) submitBtn.disabled = true;

      if (pickedBtn) pickedBtn.classList.add(correct ? 'is-right' : 'is-wrong');
      if (!correct && q.type === 'choice') {
        this.panel.querySelector(`[data-pick="${q.answer}"]`)?.classList.add('is-right');
      }

      const fb = this.panel.querySelector('.feedback');
      fb.hidden = false;
      fb.className = `feedback ${correct ? 'is-right' : 'is-wrong'}`;
      const last = index === station.questions.length - 1;
      fb.innerHTML = `
        <p class="feedback-verdict">${correct ? 'Richtig.' : 'Noch nicht.'}</p>
        <p class="feedback-text">${escapeHtml(q.explain)}</p>
        <button class="btn" data-next>${correct && last ? 'Station abschließen' : correct ? 'Weiter' : 'Nochmal versuchen'}</button>
      `;
      fb.querySelector('[data-next]').addEventListener('click', () => {
        if (!correct) { render(); return; }
        if (last) { closedByFinish = true; this.close(); onFinish(true, mistakes); return; }
        index++;
        render();
      });
      fb.querySelector('[data-next]').focus();
    };

    render();
  }



  showFinish(mode, { done, total }, mistakes, elapsedSeconds, onMenu) {
    this._open('');
    this._onClose = onMenu;
    const isQuiz = mode === 'quiz';
    const title = isQuiz ? 'Alle Stationen gelöst!' : 'Alle Stationen gelesen';

    this.panel.classList.toggle('panel-win', isQuiz);

    if (!isQuiz) {
      this.panel.innerHTML = `
        <p class="panel-eyebrow">Geschafft</p>
        <h2 class="panel-title">${title}</h2>
        <p class="panel-intro">Du hast alle ${total} Infopunkte auf dem Campus besucht.</p>
        <div class="panel-actions"><button class="btn" data-close>Zurück zum Menü</button></div>
      `;
      this.panel.querySelector('[data-close]').addEventListener('click', () => this.close());
      return;
    }

    const time = formatTime(elapsedSeconds);
    this.panel.innerHTML = `
      <p class="win-trophy">🏆</p>
      <p class="panel-eyebrow">Geschafft</p>
      <h2 class="panel-title">${title}</h2>
      <div class="win-stats">
        <div class="win-stat">
          <span class="win-stat-value">${time}</span>
          <span class="win-stat-label">Gesamtzeit</span>
        </div>
        <div class="win-stat">
          <span class="win-stat-value">${total}</span>
          <span class="win-stat-label">Stationen</span>
        </div>
        <div class="win-stat">
          <span class="win-stat-value">${mistakes}</span>
          <span class="win-stat-label">Fehlversuche</span>
        </div>
      </div>
      <div class="panel-actions"><button class="btn" data-close>Zurück zum Menü</button></div>
    `;
    this.panel.querySelector('[data-close]').addEventListener('click', () => this.close());
    fireConfetti();
  }
}

function formatTime(seconds) {
  const total = Math.max(0, Math.round(seconds || 0));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

let confettiCanvas = null;
let confettiCtx = null;
let confettiFrame = null;

function fireConfetti() {
  if (!confettiCanvas) {
    confettiCanvas = document.getElementById('confetti');
    confettiCtx = confettiCanvas?.getContext('2d');
  }
  if (!confettiCanvas || !confettiCtx) return;

  cancelAnimationFrame(confettiFrame);
  const dpr = window.devicePixelRatio || 1;
  confettiCanvas.width = innerWidth * dpr;
  confettiCanvas.height = innerHeight * dpr;
  confettiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  confettiCanvas.hidden = false;

  const colors = ['#d8a13a', '#3f7fbf', '#c1614a', '#4e9a4b', '#f3ead6'];
  const count = 140;
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * innerWidth,
    y: -20 - Math.random() * innerHeight * 0.5,
    w: 5 + Math.random() * 5,
    h: 8 + Math.random() * 8,
    color: colors[(Math.random() * colors.length) | 0],
    vy: 90 + Math.random() * 140,
    vx: (Math.random() - 0.5) * 80,
    rot: Math.random() * Math.PI * 2,
    vrot: (Math.random() - 0.5) * 8,
  }));

  const duration = 3200;
  const start = performance.now();

  const step = (now) => {
    const elapsed = now - start;
    confettiCtx.clearRect(0, 0, innerWidth, innerHeight);

    for (const p of particles) {
      p.x += p.vx * 0.016;
      p.y += p.vy * 0.016;
      p.vy += 60 * 0.016;
      p.rot += p.vrot * 0.016;

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rot);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      confettiCtx.restore();
    }

    if (elapsed < duration) {
      confettiFrame = requestAnimationFrame(step);
    } else {
      confettiCtx.clearRect(0, 0, innerWidth, innerHeight);
      confettiCanvas.hidden = true;
    }
  };
  confettiFrame = requestAnimationFrame(step);
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}


function parseGerman(raw) {
  const cleaned = String(raw).trim().replace(/\s/g, '').replace(',', '.');
  if (cleaned === '' || !/^-?\d*\.?\d+$/.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}
