import { IA } from "./ia.js";
import { Utils } from "../utils.js";

export class GloutonIA extends IA {
    constructor(name, game) {
        super(name);
        console.log('i am ' + name + ' and i am a GLOUTON ia');
    }

    play() {
        const randomMove = (valideMove, selectedMove) => {
            // console.log(valideMove);

            const randToken = Utils.getRandomInt(0, valideMove.length);
            const choosenTokenMove = valideMove[randToken];
            const randMove = Utils.getRandomInt(0, choosenTokenMove.move.length);
            const choosenMove = choosenTokenMove.move[randMove];
            const pos = { x: choosenMove.x, y: choosenMove.y };
            selectedMove.token = choosenTokenMove.tok;
            selectedMove.pos = pos;
        };

        const getRandomHigherPointMove = (moveWithPoint) => {
            let higherPointMove = { token: null, move: null, point: -1 };
            let listHigherPointMove = [];
            moveWithPoint.forEach(elem => {
                // console.log(elem);

                // elem { token: elem.token, move: elem.move, listCaptured: { listCaptured: listCaptured, point: point } };
                for (const captured of elem.listCapturedWithPoint) {
                    if (captured.point > higherPointMove.point) {
                        higherPointMove.token = elem.token;
                        higherPointMove.move = elem.move;
                        higherPointMove.point = captured.point;
                        // if with found a bigger point reset of the array
                        listHigherPointMove = [{ ...higherPointMove }];
                        continue;
                    }
                    if (captured.point === higherPointMove.point) {
                        // if it's the same value, add to the list
                        listHigherPointMove.push({ token: elem.token, move: elem.move, point: captured.point });
                    }
                }
            });

            if(listHigherPointMove.length > 1) {
                // multiple move with same point => random between them
                const rand = Utils.getRandomInt(0, listHigherPointMove.length);
                higherPointMove = listHigherPointMove[rand];
            }

            return higherPointMove;
        };

        const getListCapturedByMove = (valideMove) => {
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

            return listCapturedByMove;
        };

        const blackPlay = (valideMove) => {
            const computePointByMove = (listCapturedByMove) => {
                return listCapturedByMove.map(elem => {
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
            };
            const selectedMove = {
                token: null, pos: {
                    x: -1, y: -1
                }
            };

            const listCapturedByMove = getListCapturedByMove(valideMove);
            const listCapturedByMoveWithPoint = computePointByMove(listCapturedByMove);

            if (listCapturedByMoveWithPoint.length !== 0) {
                const higherPointMove = getRandomHigherPointMove(listCapturedByMoveWithPoint);
                selectedMove.token = higherPointMove.token;
                selectedMove.pos = higherPointMove.move;
            } else {
                //random move
                console.log('NO VALID CAPTURING MOVE => PLAY RANDOM', valideMove);
                randomMove(valideMove, selectedMove);
            }

            return selectedMove;
        }
        const whitePlay = (valideMove) => {
            const getMoveWithMostCaptured = (validMove, selectedMove) => {
                const computePointByMove = (listCapturedByMove) => {
                    return listCapturedByMove.map(elem => {
                        const newElem = { token: elem.token, move: elem.move };

                        // TODO: refactor
                        newElem.listCapturedWithPoint = elem.listCaptured.map((_1, _2, tab) => {
                            return { listCaptured: tab, point: tab.length };
                        });
                        return newElem;
                    });
                };
                const listCapturedByMove = getListCapturedByMove(validMove);
                const listCapturedByMoveWithPoint = computePointByMove(listCapturedByMove);
                if (listCapturedByMoveWithPoint.length !== 0) {
                    const higherPointMove = getRandomHigherPointMove(listCapturedByMoveWithPoint);
                    selectedMove.token = higherPointMove.token;
                    selectedMove.pos = higherPointMove.move;
                } else {
                    //random move
                    console.log('NO VALID CAPTURING MOVE => PLAY RANDOM');
                    randomMove(validMove, selectedMove);
                }
            };
            const selectedMove = {
                token: null, pos: {
                    x: -1, y: -1
                }
            };

            let kingTokMovement = valideMove.filter(elem => {
                return elem.tok.isKing === true;
            })

            if (kingTokMovement.length !== 0) {
                kingTokMovement = kingTokMovement[0];

                const boardEdge = this.game.board.getEdge();

                const allowedKingMoveOnEdge = kingTokMovement.move.filter(value => boardEdge.includes(value));
                if (allowedKingMoveOnEdge.length !== 0) {
                    selectedMove.token = kingTokMovement.tok;
                    selectedMove.pos = { x: allowedKingMoveOnEdge[0].x, y: allowedKingMoveOnEdge[0].y };
                } else {
                    getMoveWithMostCaptured(valideMove, selectedMove)
                }
            } else {
                getMoveWithMostCaptured(valideMove, selectedMove)
            }

            return selectedMove;
        }

        console.log("GLOUTON IA play");
        if (this.game.playerTurn === this.name) {
            console.log('je dois jouer !');

            const listValidMoves = [];

            this.listToken.forEach(tok => {
                const listmove = this.game.getValidPosToMove(tok);
                if (listmove.length !== 0) {
                    listValidMoves.push({ tok: tok, move: listmove });
                }
            });

            // type {token, {x,y}}
            let selectedMove = null;

            if (this.name === 'black') {
                selectedMove = blackPlay(listValidMoves);
            }
            else {
                selectedMove = whitePlay(listValidMoves);
            }

            console.log("I play : ", selectedMove);

            this.game.gameMove(selectedMove.token, selectedMove.pos);
        }
    }

    update(game) {
        console.log("Glouton IA update", game);
        this.setGame(game);
        this.play();
    }
}
