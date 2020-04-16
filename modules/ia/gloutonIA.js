import { IA } from "./ia.js";
import { Utils } from "../utils.js";

export class GloutonIA extends IA {
    constructor(name, game) {
        super(name);
        console.log('i am ' + name + ' and i am a GLOUTON ia');
    }

    play() {
        const blackPlay = (valideMove) => {
            const selectedMove = {
                token: null, pos: {
                    x: -1, y: -1
                }
            };

            const listCapturedByMove = [];
            valideMove.forEach(allowedMove => {
                allowedMove.move.forEach(pos => {
                    const tmpTok = { ...allowedMove.tok };
                    tmpTok.x = pos.x;
                    tmpTok.y = pos.y;
                    const listCaptured = this.game.listCapturedTokensFromMovedToken(tmpTok);

                    if (listCaptured.length > 0) {
                        listCapturedByMove.push({ token: allowedMove.tok, move: pos, listCaptured: listCaptured });
                    }
                });
            });


            const listCapturedByMoveWithPoint = listCapturedByMove.map(elem => {
                const newElem = { token: elem.token, move: elem.move };

                newElem.listCapturedWithPoint = elem.listCaptured.map((capturedToken, _, tab) => {
                    let point = 0;

                    point += tab.length;
                    if (capturedToken.isKing === true) {
                        point += 1000;
                    }
                    return { listCaptured: tab, point: point };
                });
                return newElem;
            });

            const firstMove = listCapturedByMoveWithPoint[0];
            if (firstMove) {
                let higherPointMove = { token: firstMove.token, move: firstMove.move, point: -1 }
                listCapturedByMoveWithPoint.forEach(elem => {
                    // console.log(elem);

                    // elem { token: elem.token, move: elem.move, listCaptured: { listCaptured: listCaptured, point: point } };
                    elem.listCapturedWithPoint.forEach(captured => {
                        if (captured.point > higherPointMove.point) {
                            higherPointMove.token = elem.token;
                            higherPointMove.move = elem.move;
                            higherPointMove.point = captured.point;
                        }
                    });
                });
                selectedMove.token = higherPointMove.token;
                selectedMove.pos = higherPointMove.move;
            } else {
                //random move
                console.log('NO VALID CAPTURING MOVE => PLAY RANDOM');

                const randToken = Utils.getRandomInt(0, valideMove.length);
                const choosenTokenMove = valideMove[randToken];
                const randMove = Utils.getRandomInt(0, choosenTokenMove.move.length);
                const choosenMove = choosenTokenMove.move[randMove];
                const pos = { x: choosenMove.x, y: choosenMove.y };
                selectedMove.token = choosenTokenMove.tok;
                selectedMove.pos = pos;
            }

            return selectedMove;
        }
        const whitePlay = (valideMove) => {
            const selectedMove = {
                token: null, pos: {
                    x: -1, y: -1
                }
            };
            // TODO: white strategy

            return selectedMove;
        }

        console.log("GLOUTON IA play");
        if (this.game.playerTurn === this.name) {
            console.log('je dois jouer !');

            const listValidMoves = this.listToken.map(tok => {
                const listmove = this.game.getValidPosToMove(tok);
                return { tok: tok, move: listmove };
            }).filter(pos => pos.move.length !== 0);


            // type {token, {x,y}}
            let selectedMove = null;

            if (this.name === 'black') {
                selectedMove = blackPlay(listValidMoves);
            }
            else {
                selectedMove = whitePlay(listValidMoves);
            }

            this.game.gameMove(selectedMove.token, selectedMove.pos);
        }
    }

    update(game) {
        console.log("Glouton IA update", game);
        this.setGame(game);
        this.play();
    }
}