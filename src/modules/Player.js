import GameboardFactory from "./Gameboard";
import ShipFactory from "./Ship";

const PlayerFactory = (player_id) => {
    const id = player_id;
    let gameBoard = GameboardFactory();
    let ships = [ShipFactory(5), ShipFactory(4), ShipFactory(3), ShipFactory(2), ShipFactory(1)];

    const attack = (opponentBoard, coordinates) => {
        return opponentBoard.receiveAttack(coordinates);
    }

    
    return { 
        get gameBoard(){ return gameBoard },
        get ships() { return ships },
        get id() { return id},
        attack
    }
};

export default PlayerFactory;
