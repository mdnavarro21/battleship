const GameboardFactory = () => {
    let board = new Array(10).fill().map(_ => Array(10).fill(null))
    const getBoard = () => board;

    const placeShip = (shipLength, xy_coordinates, direction) => {
        if (direction == 'horizontal') {
            for (let i = 0; i < shipLength; i++) {
                if (board[xy_coordinates[1]][xy_coordinates[0] + i] == null) {
                    board[xy_coordinates[1]][xy_coordinates[0] + i] = 'o';
                }
                else {
                    throw new Error('Invalid Coordinates - another ship is in the way!')
                }
            }
        }
        else {
            for (let i = 0; i < shipLength; i++) {
                if (board[xy_coordinates[1] + i][xy_coordinates[0]] == null) {
                   board[xy_coordinates[1] + i][xy_coordinates[0]] = 'o'; 
                }
                else {
                    throw new Error('Invalid Coordinates - another ship is in the way!');
                }
            }
        }
    }
    return {getBoard, placeShip}
};

export default GameboardFactory;
