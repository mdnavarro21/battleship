const GameboardFactory = () => {
    let board = new Array(10).fill().map(_ => Array(10).fill(null))
    let placedShips = [];

    const getBoard = () => board;
    const getPlacedShips = () => placedShips;

    const validatePlacement = (shipObject, xy_coordinates, direction) => {
        const shipLength = shipObject.getLength();
        if (direction == 'horizontal') {
            if (xy_coordinates[0] + shipLength > 10) {
                return false;
            }
            for (let i = 0; i < shipLength; i++) {
                if (board[xy_coordinates[1]][xy_coordinates[0] + i] != null) {
                    return false;
                }
            }
        }
        else {
            if (xy_coordinates[1] + shipLength > 10) {
                return false;
            }
            for (let i = 0; i < shipLength; i++) {
                if (board[xy_coordinates[1] + i][xy_coordinates[0]] != null) {
                    return false;
                }
            }
        }
        return true;
    }

    const placeShip = (shipObject, xy_coordinates, direction) => {
        if (validatePlacement(shipObject, xy_coordinates, direction)) {
            const shipLength = shipObject.getLength();
            const shipID = shipObject.getID();
            if (direction == 'horizontal') {
                for (let i = 0; i < shipLength; i++) {
                    board[xy_coordinates[1]][xy_coordinates[0] + i] = shipID;
                }       
            } 
            else {
                for (let i = 0; i < shipLength; i++) {
                    board[xy_coordinates[1] + i][xy_coordinates[0]] = shipID;
                }
            }
            placedShips.push(shipObject);
            return true;
        } else {
            return false;
        }
    }
    const validateAttack = (coordinates) => {
        const tile = board[coordinates[1]][coordinates[0]];
        if (tile == 'X' || tile == 'hit') {
            return false;
        }
        return true;
    }

    const receiveAttack = (coordinates) => {
        if (validateAttack(coordinates)) {
            if (board[coordinates[1]][coordinates[0]] != null) {
                const shipPart = board[coordinates[1]][coordinates[0]];
                let attackedShip = placedShips.find((ship) => ship.getID() == shipPart);
                attackedShip.hit(2);
                board[coordinates[1]][coordinates[0]] = 'hit';
            }
            else {
                board[coordinates[1]][coordinates[0]] = 'X';
            }
            return true;
        }
        else {
            return false;
        }


        
    }
    return {getBoard, getPlacedShips ,placeShip, receiveAttack}
};

export default GameboardFactory;
