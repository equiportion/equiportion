/**
 * This file contains all the easter eggs that are used in the application.
 */
import ConfettiGenerator from 'confetti-js';

function init() {
  setInterval(searchDocument, 1000);
}

function searchDocument() {
  const run = sessionStorage.getItem('easteregg') === 'true';
  if (run) return;

  const source = document.getElementsByTagName('html')[0].innerHTML;

  if (source.indexOf('do a barrel roll') !== -1) {
    doABarrelRoll();

    // set session storage to true
    sessionStorage.setItem('easteregg', 'true');
  }

  const congrats = [
    'congrats',
    'congratulations',
    'congratulation',
    'congrats!',
    'congratulations!',
    'congratulation!',
    'Geburtstag',
    'Alles Gute',
    'Happy Birthday',
    'happy birthday',
  ];

  congrats.forEach((congrat) => {
    if (source.indexOf(congrat) !== -1) {
      doConfetti();

      // set session storage to true
      sessionStorage.setItem('easteregg', 'true');
    }
  });

  if (source.indexOf('Rick Astley') !== -1) {
    doRickRoll();

    // set session storage to true
    sessionStorage.setItem('easteregg', 'true');
  }
}

function doABarrelRoll() {
  const body = document.getElementsByTagName('body')[0];
  body.style.transition = 'all 2s ease-in-out';
  body.style.transform = 'rotate(360deg)';
}

function doConfetti() {
  // create canvas for confetti
  const canvas = document.createElement('canvas');
  canvas.id = 'confetti';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  // create confetti generator
  const confettiSettings = {
    target: 'confetti',
    max: '200',
    size: '1',
    rotate: true,
  };
  const confetti = new ConfettiGenerator(confettiSettings);
  confetti.render();

  // remove canvas after 10 seconds
  setTimeout(() => {
    document.body.removeChild(canvas);

    // reload page
    window.location.reload();
  }, 10000);
}

function doRickRoll() {
  const rick = document.createElement('iframe');
  rick.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
  rick.style.position = 'fixed';
  rick.style.top = '0';
  rick.style.left = '0';
  rick.style.width = '100%';
  rick.style.height = '100%';
  rick.style.zIndex = '999999';
  document.body.appendChild(rick);

  // remove iframe after 10 seconds
  setTimeout(() => {
    document.body.removeChild(rick);

    // reload page
    window.location.reload();
  }, 10000);
}

export default init;
