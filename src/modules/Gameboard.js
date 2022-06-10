const GameboardFactory = () => {
    let board = new Array(10).fill().map(_ => Array(10).fill(null))
    let placedShips = [];

    const getBoard = () => board;
    const getPlacedShips = () => placedShips;

    const validateCoordinates = (shipObject, xy_coordinates) => {
        const direction = shipObject.getDirection();
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

    const placeShip = (shipObject, xy_coordinates) => {
        /*
        if (validateCoordinates(shipLength, xy_coordinates, direction)) {
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
            return true;            
        }
        else {
            return false;
        }*/
        if (validateCoordinates(shipObject, xy_coordinates)) {
            const shipLength = shipObject.getLength();
            const shipID = shipObject.getID();
            if (shipObject.getDirection() == 'horizontal') {
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

    const receiveAttack = (coordinates) => {
        board[coordinates[1]][coordinates[0]] = 'x';
    }
    return {getBoard, getPlacedShips ,placeShip, receiveAttack}
};

export default GameboardFactory;
