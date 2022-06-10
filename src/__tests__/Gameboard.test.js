import GameboardFactory from "../modules/Gameboard";
import ShipFactory from "../modules/Ship";

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
    });
});

describe('placeShip function', () => {
    test('Happy Path 1: horizontal placement', () => {
        let gameBoard = GameboardFactory();
        const mockShip = ShipFactory(5,'horizontal');
        const coordinates = [2,0];
        expect(gameBoard.placeShip(mockShip, coordinates)).toBeTruthy();
        expect(gameBoard.getPlacedShips()).toEqual([mockShip]);
        expect(gameBoard.getBoard()[0]).toEqual([null,null,'Carrier','Carrier','Carrier','Carrier', 'Carrier', null, null,null])
    })
    
    test('Happy Path 2: vertical placement', () => {
        let gameBoard = GameboardFactory();
        const mockShip = ShipFactory(3);
        expect(gameBoard.placeShip(mockShip, [0,2])).toBeTruthy();
        let boardColumn = gameBoard.getBoard().map((row) => row[0]);
        expect(boardColumn).toEqual([null,null,'Destroyer','Destroyer','Destroyer',null,null,null,null, null])
    })

    test('Coordinates out of range/overflow out of board', () => {
        let gameBoard = GameboardFactory();
        const mockShip = ShipFactory(5);
        expect(gameBoard.placeShip(mockShip, [0,8])).toBeFalsy();
    });

    test('Invalid coordinates - another ship is in the way!', () => {
        let gameBoard = GameboardFactory();
        const mockShip1 = ShipFactory(5);
        const mockShip2 = ShipFactory(4,'horizontal');
        expect(gameBoard.placeShip(mockShip1, [4,5])).toBeTruthy();
        expect(gameBoard.placeShip(mockShip2, [2,5])).toBeFalsy();
        expect(gameBoard.getBoard()[5]).toEqual([null,null,null,null,'Carrier',null,null,null,null,null]);
    });

    test.only('Invalid coordinates 2- two ships are in the way!', () => {
        let gameBoard = GameboardFactory();
        const mockShip1 = ShipFactory(4);
        const mockShip2 = ShipFactory(3);
        const mockShip3 = ShipFactory(5,'horizontal');
        gameBoard.placeShip(mockShip1,[3,0]);
        gameBoard.placeShip(mockShip2, [4,0]);
        expect(gameBoard.getPlacedShips()).toEqual([mockShip1,mockShip2]);
        expect(gameBoard.placeShip(mockShip3, [0,0])).toBeFalsy();
        expect(gameBoard.getBoard()[0]).toEqual([null,null,null,'Battleship','Destroyer',null,null,null,null,null]);
    });

});

describe('receiveAttack function', () => {
    test('Happy path 1: Attack missed', () => {   
        let gameBoard = GameboardFactory();
        const coordinates = [5,4];
        gameBoard.receiveAttack(coordinates);
        expect(gameBoard.getBoard()[coordinates[1]][coordinates[0]]).toBe('x');
    })
})

