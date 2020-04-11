import { Renderer } from "./renderer.js";

export class MobileRenderer extends Renderer {
  generateView(game) {
    let currentTokenClicked = null;
    const generateGrid = game => {
      const createTokenView = (token, playerTurn) => {
        const tokenClick = ev => {
          const getTokenDataFromId = id => {
            return game.getTokenDataFromId(id);
          };
          const getCaseFromSquare = square => {
            const x = square.x;
            const y = square.y;

            const listCase = document.getElementsByClassName("grid-item");

            return listCase[y + x * game.TAB_SIZE];
          };
          const getSquareFromCaseId = id_input => {
            const id = parseInt(id_input, 10);

            const x = Math.trunc(id / game.TAB_SIZE);
            const y = id % game.TAB_SIZE;

            return game.board.board[x][y];
          };
          const caseClick = ev => {
            ev.preventDefault();
            removeValidMoveClass();
            const tokenId = selectedToken;
            const token = game.getTokenDataFromId(tokenId);
            const caseId = ev.target.id;
            const caseData = getSquareFromCaseId(caseId);
            const newGameState = game.gameMove(
              token,
              { x: caseData.x, y: caseData.y },
              game.getPlayerByName(game.playerTurn)
            );
            console.log('newGameState', newGameState);
            
            this.endMoveSound.play();
          };
          const removeValidMoveClass = () => {
            const elements = [
              ...document.getElementsByClassName("grid-item validMove")
            ];
            elements.forEach(elem => {
              elem.classList.remove("validMove");
              elem.classList.remove("current");
              elem.removeEventListener("click", caseClick);
            });
          };
          const clearCurrentTokenClicked = () => {
            if(currentTokenClicked) {
              const tokenData = getTokenDataFromId(currentTokenClicked.id);
              const validPos = game.getValidPosToMove(tokenData);

              // ajout des class sur les cases possible de destination
              validPos.forEach(elem => {
                const sq = getCaseFromSquare(elem);
                sq.classList.add("validMove");
                sq.removeEventListener("click", caseClick);
              });

              currentTokenClicked = null;
            }
            
          };
          let selectedToken = null;

          // recuperation des données du token
          const tokenData = getTokenDataFromId(ev.target.id);
          this.startMoveSound.play();

          // clear des class
          if (currentTokenClicked !== ev.target) {
            clearCurrentTokenClicked();
            removeValidMoveClass();

            currentTokenClicked = ev.target;
            selectedToken = ev.target.id;
  
            //recherche des position valide
            const validPos = game.getValidPosToMove(tokenData);
  
            // ajout des class sur les cases possible de destination
            validPos.forEach(elem => {
              const sq = getCaseFromSquare(elem);
              sq.classList.add("validMove");
              sq.addEventListener("click", caseClick);
            });
          }
        };
        const color = token.color;
        const isKing = token.isKing;
        const id = token.id;

        const tokenView = document.createElement("div");
        tokenView.classList.add("pion");
        tokenView.classList.add(color);
        tokenView.setAttribute("id", id);
        if (isKing) {
          tokenView.classList.add("king");
        }

        if (playerTurn === color) {
          tokenView.addEventListener("click", tokenClick);
        }

        return tokenView;
      };

      const gridContainer = document.createElement("div");
      gridContainer.classList.add("mobileRenderer","grid-container");

      let index = 0;
      for (const line of game.board.board) {
        for (const col of line) {
          const newGridItem = document.createElement("div");
          newGridItem.classList.add("grid-item");
          newGridItem.setAttribute("id", index);

          if (col.isThrone) {
            newGridItem.classList.add("throne");
          }

          if (col.content) {
            const content = col.content;
            const token = createTokenView(content, game.playerTurn);
            newGridItem.appendChild(token);
          }

          gridContainer.appendChild(newGridItem);
          index++;
        }
      }

      const gameZone = document.getElementById("game-zone");
      gameZone.appendChild(gridContainer);
    };


    this.updateInfo(game);
    generateGrid(game);
  }

  updateInfo(game) {
    document.getElementById(
      "player-turn"
    ).innerHTML = `It's ${game.playerTurn} player turn`;
    if (game.gameState === "end") {
      document.getElementById(
        "winner"
      ).innerHTML = `Winner ${game.winPlayer.name}`;
      document.getElementById("player-turn").innerHTML = "";
    }
  }

  update(game) {
    const clearContent = element => {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    };
    console.log('MobileRenderer update', game);
    const gameZone = document.getElementById("game-zone");
    clearContent(gameZone);

    this.updateInfo(game);
    this.generateView(game);
  }
}
