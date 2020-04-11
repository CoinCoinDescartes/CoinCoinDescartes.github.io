import { Player } from "../player.js";

export class IA extends Player {
    constructor(name) {
        super(name);
        this.game = null;
        this.myself = null;
        this.listToken = null;
        console.log('i am ' + name + ' and i am an ia');
    }

    setGame(game) {
        this.game = game;
        console.log(this.name);
        
        this.myself = this.game.getPlayerByName(this.name);
        this.listToken = this.game.getListTokenOfPlayer(this);
        // this.play();
    }

    play() {
        throw new Error("Method 'play()' must be implemented by an IA.");
    }

    update(game) {
        throw new Error("Method 'update()' must be implemented by an IA.");
    }
}