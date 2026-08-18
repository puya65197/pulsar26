// Laedt die beiden Bilder. Die Lerndaten und das Kollisionsraster liegen
// als normale Skripte vor (data/questions.js, assets/collision.js) und
// stehen beim Start bereits als window.QUESTIONS / window.COLLISION bereit.

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Bild nicht gefunden: ${src}`));
    img.src = src;
  });
}

async function loadAssets() {
  if (!window.QUESTIONS) throw new Error('data/questions.js wurde nicht geladen');
  if (!window.COLLISION) throw new Error('assets/collision.js wurde nicht geladen');
  const [map, player] = await Promise.all([
    loadImage('assets/campus_map.png'),
    loadImage('assets/player.png'),
  ]);
  return { map, player, collision: window.COLLISION, questions: window.QUESTIONS };
}
