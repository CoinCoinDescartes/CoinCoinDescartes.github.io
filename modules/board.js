import { Square } from "./square.js";
import { Token } from "./token.js";

export class Board {
  constructor(tabSize) {
    const initTokenPos = () => {
      let allToken = [];
      const blackToken = [];
      const whiteToken = [];

      blackToken.push(new Token("black", 0, 3, "black0"));
      blackToken.push(new Token("black", 0, 4, "black1"));
      blackToken.push(new Token("black", 0, 5, "black2"));
      blackToken.push(new Token("black", 1, 4, "black3"));
      blackToken.push(new Token("black", 3, 0, "black4"));
      blackToken.push(new Token("black", 3, 8, "black5"));
      blackToken.push(new Token("black", 4, 0, "black6"));
      blackToken.push(new Token("black", 4, 1, "black7"));
      blackToken.push(new Token("black", 4, 7, "black8"));
      blackToken.push(new Token("black", 4, 8, "black9"));
      blackToken.push(new Token("black", 5, 0, "black10"));
      blackToken.push(new Token("black", 5, 8, "black11"));
      blackToken.push(new Token("black", 7, 4, "black12"));
      blackToken.push(new Token("black", 8, 3, "black13"));
      blackToken.push(new Token("black", 8, 4, "black14"));
      blackToken.push(new Token("black", 8, 5, "black15"));

      whiteToken.push(new Token("white", 2, 4, "white0"));
      whiteToken.push(new Token("white", 3, 4, "white1"));
      whiteToken.push(new Token("white", 4, 2, "white2"));
      whiteToken.push(new Token("white", 4, 3, "white3"));
      whiteToken.push(new Token("white", 4, 4, "white4", true));
      whiteToken.push(new Token("white", 4, 5, "white5"));
      whiteToken.push(new Token("white", 4, 6, "white6"));
      whiteToken.push(new Token("white", 5, 4, "white7"));
      whiteToken.push(new Token("white", 6, 4, "white8"));

      allToken = [...blackToken, ...whiteToken];

      for (const tok of allToken) {
        const sq = this.getSquare(tok.x, tok.y);
        sq.setContent(tok);
      }
      const sq = this.getSquare(4, 4);
      sq.setIsThrone(true);

      return {
        allToken: allToken,
        whiteToken: whiteToken,
        blackToken: blackToken
      };
    };
    this.tabSize = tabSize;
    this.board = [];
    for (let x = 0; x < tabSize; x++) {
      const tab = [];
      for (let y = 0; y < tabSize; y++) {
        const sq = new Square(x, y);
        tab.push(sq);
      }
      this.board.push(tab);
    }
    this.board[4][4] = new Square(4, 4, true);

    const listToken = initTokenPos();
    this.allToken = listToken.allToken;
    this.blackToken = listToken.blackToken;
    this.whiteToken = listToken.whiteToken;
  }

  getTokenDataFromId(id) {
    return this.allToken.filter(tok => tok.id === id)[0];
  }

  getSquare(x, y) {
    if (x > 8 || x < 0 || y > 8 || y < 0) {
      return;
    }
    return this.board[x][y];
  }

  getNorthSquare(x, y) {
    return this.getSquare(x - 1, y);
  }
  getSouthSquare(x, y) {
    return this.getSquare(x + 1, y);
  }
  getEastSquare(x, y) {
    return this.getSquare(x, y + 1);
  }
  getWestSquare(x, y) {
    return this.getSquare(x, y - 1);
  }

  getSameCol(y) {
    const tab = [];
    this.board.forEach(elem => {
      tab.push(elem[y]);
    });
    return tab;
  }

  getSameLine(x) {
    return this.board[x];
  }

  getSquareAround(token) {
    const x = token.x;
    const y = token.y;

    const squareAround = {
      north: undefined,
      south: undefined,
      east: undefined,
      west: undefined
    };

    squareAround.north = this.getNorthSquare(x, y);
    squareAround.south = this.getSouthSquare(x, y);
    squareAround.east = this.getEastSquare(x, y);
    squareAround.west = this.getWestSquare(x, y);

    return squareAround;
  }

  moveToken(token, finalPos) {
    const sqStart = this.getSquare(token.x, token.y);
    const sqEnd = this.getSquare(finalPos.x, finalPos.y);
    sqStart.setContent(null);
    sqEnd.setContent(token);
    token.setPos(finalPos.x, finalPos.y);
  }

  deleteToken(token) {
    const sqStart = this.getSquare(token.x, token.y);
    sqStart.setContent(null);
  }

  getEdge() {
    const topLine = this.board[0];
    const bottomLine = this.board[this.tabSize - 1];
    const firstCol = this.getSameCol(0);
    const lastCol = this.getSameCol(this.tabSize - 1);

    return [...topLine, ...bottomLine, ...firstCol, ...lastCol];
  }
}
