import { IA } from "./ia.js";
import { Utils } from "../utils.js";

export class RandomIA extends IA {
    constructor(name, game) {
        super(name);
        console.log('i am ' + name + ' and i am a RANDOM ia');
    }

    play() {
        console.log("Random IA play");
        if (this.game.playerTurn === this.name) {
            console.log('je dois jouer !');

            const listMoves = this.listToken.map(tok => {
                const listmove = this.game.getValidPosToMove(tok);
                return { tok: tok, move: listmove };
            }).filter(pos => pos.move.length !== 0);
            // console.log(listMoves);

            const randToken = Utils.getRandomInt(0, listMoves.length);
            const choosenTokenMove = listMoves[randToken];
            console.log('randToken', randToken, 'choosenTokenMove', choosenTokenMove);
            const randMove = Utils.getRandomInt(0, choosenTokenMove.move.length);
            const choosenMove = choosenTokenMove.move[randMove];
            // console.log('randMove', randMove, 'choosenMove', choosenMove, 'x', choosenMove.x, 'y', choosenMove.y);
            const pos = { x: choosenMove.x, y: choosenMove.y };
            // console.log('pos to play', pos);

            this.game.gameMove(choosenTokenMove.tok, pos);
        }
    }

    update(game) {
        console.log("Random IA update", game);
        this.setGame(game);
        this.play();
    }
}