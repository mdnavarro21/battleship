const GameboardFactory = () => {
    let board = new Array(10).fill().map(_ => Array(10).fill(null))
    const getBoard = () => board;

    const validateCoordinates = (shipLength, xy_coordinates, direction) => {
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

    const placeShip = (shipLength, shipID, xy_coordinates, direction) => {

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
        }

    }

    const receiveAttack = (coordinates) => {
        board[coordinates[1]][coordinates[0]] = 'x';
    }
    return {getBoard, placeShip, receiveAttack}
};

export default GameboardFactory;
