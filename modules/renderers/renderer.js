export class Renderer {
    constructor(gameZoneElement, playerTurnElement, winnerElement, startMoveSoundElement, endMoveSoundElement) {
        this.gameZone = gameZoneElement;
        this.playerTurn = playerTurnElement;
        this.winner = winnerElement;
        this.startMoveSound = startMoveSoundElement;
        this.endMoveSound = endMoveSoundElement;
    }

    update() {
        throw new Error("Method 'update()' must be implemented by a renderer.");
    }

    generateView(game) {
        throw new Error("Method 'generateView(game)' must be implemented by a renderer.");
    }
}