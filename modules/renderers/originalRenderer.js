import { Renderer } from "./renderer.js";

export class OriginalRenderer extends Renderer {
  generateView(game) {
    console.info("Original Renderer");
    let currentDraged = null;
    const generateGrid = game => {
      const createTokenView = (token, playerTurn) => {
        const drag = ev => {
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
          const dragover = ev => {
            ev.preventDefault();
            ev.target.classList.add("current");
          };
          const dragleave = ev => {
            ev.preventDefault();
            ev.target.classList.remove("current");
          };
          const drop = ev => {
            ev.preventDefault();
            removeValidMoveClass();
            const tokenId = ev.dataTransfer.getData("text");
            const token = game.getTokenDataFromId(tokenId);
            const caseId = ev.target.id;
            const caseData = getSquareFromCaseId(caseId);
            console.log('drop', caseData);

            const newGameState = game.gameMove(
              token,
              { x: caseData.x, y: caseData.y },
              game.getPlayerByName(token.color)
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
              elem.removeEventListener("drop", drop);
              elem.removeEventListener("dragover", dragover);
              elem.removeEventListener("dragleave", dragleave);
            });
          };
          const clearCurrentDragged = () => {
            if (currentDraged) {
              const tokenData = getTokenDataFromId(currentDraged.id);
              const validPos = game.getValidPosToMove(tokenData);

              // ajout des class sur les cases possible de destination
              validPos.forEach(elem => {
                const sq = getCaseFromSquare(elem);
                sq.classList.add("validMove");
                sq.removeEventListener("drop", drop);
                sq.removeEventListener("dragover", dragover);
                sq.removeEventListener("dragleave", dragleave);
              });
              currentDraged = null;
            }
          };
          // recuperation des données du token
          const tokenData = getTokenDataFromId(ev.target.id);
          this.startMoveSound.play();

          ev.dataTransfer.setData("text", ev.target.id);
          // clear des class
          if (currentDraged !== ev.target) {
            clearCurrentDragged();
            removeValidMoveClass();

            currentDraged = ev.target;
            // set des donne a tranferer durant le transfert

            //recherche des position valide
            const validPos = game.getValidPosToMove(tokenData);

            // ajout des class sur les cases possible de destination
            validPos.forEach(elem => {
              const sq = getCaseFromSquare(elem);
              sq.classList.add("validMove");
              sq.addEventListener("drop", drop);
              sq.addEventListener("dragover", dragover);
              sq.addEventListener("dragleave", dragleave);
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
          tokenView.setAttribute("draggable", "true");
          tokenView.addEventListener("dragstart", drag);
        }

        return tokenView;
      };

      const gridContainer = document.createElement("div");
      gridContainer.classList.add("originalRenderer", "grid-container");

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

      const gameZone = document.getElementById("game-zone");// ???? this.gameZone devrait suffir
      gameZone.appendChild(gridContainer);
    };

    this.updateInfo(game);
    generateGrid(game);
  }

  update(game) {
    const clearContent = element => {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    };
    console.log('OriginalRenderer update', game);
    const gameZone = document.getElementById("game-zone");
    clearContent(gameZone);

    this.updateInfo(game);
    this.generateView(game);
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
  };
}
