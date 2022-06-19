import PlayerFactory from "./Player";
import AIFactory from "./AI";

const Game = (() => {
    let player1 = null;
    let player2 = null;
    let winner = null;

    const start = () => {
        player1 = PlayerFactory('Player 1');
        player2 = AIFactory('Player 2');
        player2.randomShipPlacement(); 
    }

    const playRound = (p1_attack) => {
        player1.attack(player2.gameBoard, p1_attack);
        if (player2.gameBoard.allShipsSunk() == true) {
            winner = player1;
            return false;
        }
        player2.attack(player1.gameBoard, player2.randomAttack());
        if (player1.gameBoard.allShipsSunk() == true) {
            winner = player2;
            return false;
        }
        return true;
    }

    return { 
        get player1() { return player1},
        get player2() {return player2},
        get winner() {return winner},
        playRound,
        start }
})();

export default Game;
