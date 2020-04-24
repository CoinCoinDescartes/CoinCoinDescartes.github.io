import { Renderer } from "./renderer.js";

export class TimoRenderer extends Renderer {

  generateView(game) {
    console.info("Timo Renderer");

    const gridContainer = document.createElement("div");
    gridContainer.classList.add("timoRenderer", "grid-container");

    let index = 0;
    for (const line of game.board.board) {
      for (const col of line) {
        const newGridItem = document.createElement("div");
        newGridItem.classList.add("grid-item");
        newGridItem.setAttribute("id", index);

        if (col.isThrone) {
          newGridItem.classList.add("throne");
        }

        gridContainer.appendChild(newGridItem);
        index++;
      }
    }

    this.tokenContainer = document.createElement("div");
    this.tokenContainer.classList.add("timoRenderer", "token-container");


    this.gameZone.appendChild(gridContainer);
    this.gameZone.appendChild(this.tokenContainer);

    this.initTokenPos(game);
    this.updateInfo(game);
  }

  initTokenPos(game) {
    console.info('initTokenPos');
    window.requestAnimationFrame(() => {
      // this.clearContainer(this.tokenContainer);

      game.board.board.forEach((column) => {
        column.forEach((cell) => {
          if (cell.content) {
            this.addToken(cell.content, game);
          }
        });
      });

      this.updateInfo(game);
    });
  }

  update(game) {
    console.info('update');
    window.requestAnimationFrame(() => {
      // this.clearContainer(this.tokenContainer);

      game.board.allToken.forEach((tok) => {
        if (tok) {
          this.updateTokenPos(tok)
        }
      });

      this.updateInfo(game);
    });
  };

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

  clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  };

  updateTokenPos(token) {
    const id = token.id;
    const color = token.color;
    const isKing = token.isKing;
    const isDeleted = token.isDeleted;

    const tokenView = document.querySelector("#" + id);
    // console.log(tokenView.classList);
    // let classes = [...tokenView.classList.value.split(' ')];
    // console.log(classes.split(' '));

    // console.log(tokenView);

    const classes = ["pion", color];
    const position = token.previousPosition || { x: token.x, y: token.y };
    const positionClass = this.positionClass(position);
    classes.push(positionClass);
    if (isKing) classes.push("king");

    window.requestAnimationFrame(() => {
      if (token.previousPosition) {
        classes[2] = this.positionClass({ x: token.x, y: token.y });
      } else {
        token.savePosition();
      }
      this.applyClasses(tokenView, classes); // Update the position
      if (isDeleted) {
        this.tokenContainer.removeChild(tokenView);
        return;
      }
    });

  }

  addToken(token, game) {
    const color = token.color;
    const isKing = token.isKing;
    const id = token.id;

    const tokenView = document.createElement("div");
    tokenView.setAttribute("id", id);
    const classes = ["pion", color];
    // tokenView.classList.add("pion");
    // tokenView.classList.add(color);
    const position = token.previousPosition || { x: token.x, y: token.y }; //set the previous position to use for animation
    const positionClass = this.positionClass(position);
    classes.push(positionClass);
    if (isKing) classes.push("king");

    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(() => {
      if (token.previousPosition) {
        classes[2] = this.positionClass({ x: token.x, y: token.y });
      } else {
        token.savePosition();
      }
      this.applyClasses(tokenView, classes); // Update the position
    });

    if (token.color === game.playerTurn) {
      tokenView.addEventListener('click', ev => { this.tokenClick(ev, game) });
    }

    // Put the tile on the board
    this.tokenContainer.appendChild(tokenView);
  };

  normalizePosition(position) {
    return { x: position.x + 1, y: position.y + 1 };
  };

  positionClass(position) {
    position = this.normalizePosition(position);
    return "token-position-" + position.x + "-" + position.y;
  };

  applyClasses(element, classes) {
    element.setAttribute("class", classes.join(" "));
  };

  tokenClick(ev, game) {
    let currentTokenClicked = null;
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
      if (currentTokenClicked) {
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
}
