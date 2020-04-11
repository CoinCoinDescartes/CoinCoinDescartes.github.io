export class Token {
  constructor(color, x, y, id, isKing) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.id = id;
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
}
