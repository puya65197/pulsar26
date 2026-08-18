
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



  showFinish(mode, { done, total }, mistakes, onMenu) {
    this._open('');
    this._onClose = onMenu;
    const title = mode === 'quiz' ? 'Alle Stationen gelöst' : 'Alle Stationen gelesen';
    const detail = mode === 'quiz'
      ? `${total} Stationen abgeschlossen, ${mistakes} Fehlversuche insgesamt.`
      : `Du hast alle ${total} Infopunkte auf dem Campus besucht.`;
    this.panel.innerHTML = `
      <p class="panel-eyebrow">Geschafft</p>
      <h2 class="panel-title">${title}</h2>
      <p class="panel-intro">${detail}</p>
      <div class="panel-actions"><button class="btn" data-close>Zurück zum Menü</button></div>
    `;
    this.panel.querySelector('[data-close]').addEventListener('click', () => this.close());
  }
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
