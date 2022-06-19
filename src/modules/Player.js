import GameboardFactory from "./Gameboard";

const PlayerFactory = (player_id) => {
    const id = player_id;
    let gameBoard = GameboardFactory();

    const attack = (opponentBoard, coordinates) => {
        return opponentBoard.receiveAttack(coordinates);
    }

    
    return { 
        get gameBoard(){ return gameBoard },
        get id() { return id},
        attack
    }
};

export default PlayerFactory;
