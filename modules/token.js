export class Token {
  constructor(color, x, y, id, isKing) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.id = id;
    this.previousPosition = null;
    this.isDeleted = false;
    if (isKing) {
      this.isKing = true;
    }
  }

  setPos(x, y) {
    this.x = x;
    this.y = y;
  }

  setId(id) {
    this.id = id;
  }

  savePosition() {
    this.previousPosition = { x: this.x, y: this.y };
  };

}
