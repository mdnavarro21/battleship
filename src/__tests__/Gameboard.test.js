import GameboardFactory from "../modules/Gameboard";

describe('Empty board initialized correctly', () => {
    const gameBoard = GameboardFactory();
    test('getBoard returns board array', () => {
        expect(Array.isArray(gameBoard.getBoard())).toBeTruthy();
    });

    test('Board contains 10 rows', () => {
        expect(gameBoard.getBoard().length).toBe(10);
    });

    test('Board contains 10 columns', () => {
        expect(gameBoard.getBoard()[0].length).toBe(10);
    });

    test('Board full of null values', () => {
        expect(gameBoard.getBoard().every((row) => {
            return row.every((column) => column == null);
        })).toBeTruthy();
    })
});

describe('placeShip function', () => {
    test('Happy Path 1: horizontal placement', () => {
        let gameBoard = GameboardFactory();
        let mockShipLength = 5;
        gameBoard.placeShip(mockShipLength, [2,0], 'horizontal');
        expect(gameBoard.getBoard()[0]).toEqual([null,null,'o','o','o','o', 'o', null, null,null])
    })
    
    test('Happy Path 2: vertical placement', () => {
        let gameBoard = GameboardFactory();
        gameBoard.placeShip(5, [0,2], 'vertical');
        let boardColumn = gameBoard.getBoard().map((row) => row[0]);
        expect(boardColumn).toEqual([null,null,'o','o','o','o','o',null,null, null])
    })

    test('Coordinates out of range/overflow out of board', () => {
        let gameBoard = GameboardFactory();
        expect(() => gameBoard.placeShip(5, [0,8], 'vertical')).toThrow(Error);
    });

    test('Invalid coordinates - another ship is in the way!', () => {
        let gameBoard = GameboardFactory();
        gameBoard.placeShip(5, [5,5], 'vertical');
        expect(() => gameBoard.placeShip(4, [3,5], 'horizontal')).toThrow("Invalid Coordinates - another ship is in the way!");
    });

});

describe('receiveAttack function', () => {

})

