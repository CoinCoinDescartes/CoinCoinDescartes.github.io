import { Game } from "./modules/games.js";
import { Utils } from "./modules/utils.js";
import { OriginalRenderer } from "./modules/renderers/originalRenderer.js";
// import { MobileRenderer } from "./modules/renderers/mobileRenderer.js";
import { Player } from "./modules/player.js";
import { RandomIA } from "./modules/ia/randomIA.js";

let game;
initGame();
initSW();

function initGame() {
  let whitePlayer = null;
  let blackPlayer = null;
  let ia = null;

  const rand = Utils.getRandomIntInclusive(1, 2);
  if (rand === 1) {
    whitePlayer = new Player("white");
    blackPlayer = new RandomIA("black");
    ia = blackPlayer;
  } else {
    blackPlayer = new Player("black");
    whitePlayer = new RandomIA("white");
    ia = whitePlayer;
  }
  game = new Game(whitePlayer, blackPlayer);
  ia.setGame(game);

  const gameZoneElement = document.getElementById("game-zone");
  const playerTurnElement = document.getElementById("player-turn");
  const winnerElement = document.getElementById("winner");
  const bip = document.getElementById("sound-bip");
  const boup = document.getElementById("sound-boup");
  const renderer = new OriginalRenderer(
    gameZoneElement,
    playerTurnElement,
    winnerElement,
    bip,
    boup
  );
  game.observer.push(renderer);
  game.observer.push(ia);
  renderer.generateView(game);
  if (game.playerTurn === ia.name) {
    ia.play();
  }
}

function initSW() {
  const checkUpdate = (registration) => {
    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      installingWorker.onstatechange = () => {
        switch (installingWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              // new update available
              const refreshBtn = document.querySelector('#reload-btn');
              const alert = document.querySelector('#update-alert');

              refreshBtn.addEventListener('click', () => window.location.reload());
              alert.style.display = 'block';
            } else {
              // no update available
              console.log('No update');

            }
            break;
        }
      }
    }
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./sw.js')
      .then(registration => {
        console.log('Service Worker Registered');
        checkUpdate(registration);
      })
      .catch(err => console.error('[SW ERROR]', err));
  }
}




// Code to handle install prompt on desktop
/*
let deferredPrompt;
const addBtn = document.querySelector('.add-button');
addBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = 'block';

  addBtn.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    addBtn.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  });
});
*/