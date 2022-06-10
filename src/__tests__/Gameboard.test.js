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
    let gameBoard = GameboardFactory();
    const mockShip1 = ShipFactory(5);
    const mockShip2 = ShipFactory(3);
    const mockShip3 = ShipFactory(4);
    const mockShip4 = ShipFactory(2);

    test('Happy Path 1: horizontal placement', () => {
        expect(gameBoard.placeShip(mockShip1, [2,0], 'horizontal')).toBeTruthy();
        expect(gameBoard.getPlacedShips()).toEqual([mockShip1]);
        expect(gameBoard.getBoard()[0]).toEqual([null,null,'Carrier','Carrier','Carrier','Carrier', 'Carrier', null, null,null])
    })
    
    test('Happy Path 2: vertical placement', () => {
        expect(gameBoard.placeShip(mockShip2, [0,2], 'vertical')).toBeTruthy();
        expect(gameBoard.getPlacedShips()).toEqual([mockShip1, mockShip2]);
        let boardColumn = gameBoard.getBoard().map((row) => row[0]);
        expect(boardColumn).toEqual([null,null,'Destroyer','Destroyer','Destroyer',null,null,null,null, null])
    })

    test('Coordinates out of range/overflow out of board', () => {
        expect(gameBoard.placeShip(mockShip3, [0,8], 'vertical')).toBeFalsy();
    });

    test('Invalid coordinates - another ship is in the way!', () => {
        expect(gameBoard.placeShip(mockShip3, [2,5], 'vertical')).toBeTruthy();
        expect(gameBoard.placeShip(mockShip4, [1,5], 'horizontal')).toBeFalsy();
        expect(gameBoard.getBoard()[5]).toEqual([null,null,'Battleship',null,null,null,null,null,null,null]);
    });

});

describe('receiveAttack function', () => {
    let gameBoard = GameboardFactory();
    let ship1 = ShipFactory(4);
    let ship2 = ShipFactory(5);
    gameBoard.placeShip(ship1, [0,0], 'vertical');
    gameBoard.placeShip(ship2, [5,0], 'horizontal');

    test('Happy path 1: Attack missed', () => {   
        const coordinates = [5,4];
        expect(gameBoard.receiveAttack(coordinates)).toBeTruthy();
        expect(gameBoard.getBoard()[coordinates[1]][coordinates[0]]).toBe('X');
    });

    test('Happy path 2: Attack hits ship', () => {
        gameBoard.receiveAttack([7,0]);
        expect(gameBoard.getBoard()[0][7]).toBe('hit');
        expect(gameBoard.getBoard()[0]).toEqual(['Battleship',null,null,null,null,'Carrier','Carrier','hit','Carrier','Carrier'])
        expect(ship2.getHits()).toEqual([null,null,'hit',null,null])
    });

    test('Invalid Coordinates: tile already attacked', () => {
        expect(gameBoard.receiveAttack([5,4])).toBeFalsy();
        expect(gameBoard.getBoard()[4][5]).toBe('X');
    });

    test('Invalid Coordinates 2: ship already attacked', () => {
        expect(gameBoard.receiveAttack([7,0])).toBeFalsy();
        expect(gameBoard.getBoard()[0][7]).toBe('hit');
    });
})

