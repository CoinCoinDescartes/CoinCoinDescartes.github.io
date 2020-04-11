export class Square {
  constructor(x, y, isThrone) {
    this.content = null;
    this.x = x;
    this.y = y;

    if (isThrone) {
      this.isThrone = isThrone;
    }
  }

  setContent(content) {
    this.content = content;
  }

  setIsThrone(isThrone) {
    this.isThrone = isThrone;
  }
}
