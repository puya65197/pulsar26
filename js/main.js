// Einstiegspunkt: Menue sofort anzeigen, Bilder im Hintergrund laden.
// Ein Startknopf wartet notfalls, bis die Bilder da sind.

(function () {
  const canvas = document.getElementById('game');
  const ui = new UI();
  let game = null;

  function fail(message) {
    const text = String(message || '').trim();
    if (!text) return;                       // leere Ereignisse ignorieren
    document.getElementById('error-text').textContent = text;
    document.getElementById('error').hidden = false;
    console.error(text);
  }

  // Unerwartete Fehler sichtbar machen, statt das Spiel stumm haengen zu lassen
  addEventListener('error', (e) => fail(e.message));
  addEventListener('unhandledrejection', (e) => fail(e.reason && e.reason.message || e.reason));

  const ready = loadAssets().then((assets) => {
    const input = new Input(canvas, document.getElementById('touch'));
    game = new Game(canvas, assets, input, ui);
    game.run();
  });

  ui.showMenu(true);
  ui.onStart(async (mode) => {
    try {
      await ready;
      game.start(mode);
    } catch (err) {
      fail(err.message);
    }
  });
})();
