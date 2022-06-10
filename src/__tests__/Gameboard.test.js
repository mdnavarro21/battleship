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
        const mockShip = {length: 5, direction: 'horizontal', id: 'Carrier'};
        expect(gameBoard.placeShip(mockShip['length'],mockShip['id'], [2,0], mockShip['direction'])).toBeTruthy();
        expect(gameBoard.getBoard()[0]).toEqual([null,null,'Carrier','Carrier','Carrier','Carrier', 'Carrier', null, null,null])
    })
    
    test('Happy Path 2: vertical placement', () => {
        let gameBoard = GameboardFactory();
        const mockShip = {length: 3, direction: 'vertical', id: 'Destroyer'};
        expect(gameBoard.placeShip(mockShip.length, mockShip.id, [0,2], mockShip.direction)).toBeTruthy();
        let boardColumn = gameBoard.getBoard().map((row) => row[0]);
        expect(boardColumn).toEqual([null,null,'Destroyer','Destroyer','Destroyer',null,null,null,null, null])
    })

    test('Coordinates out of range/overflow out of board', () => {
        let gameBoard = GameboardFactory();
        expect(gameBoard.placeShip(5, 'Carrier', [0,8], 'vertical')).toBeFalsy();
    });

    test('Invalid coordinates - another ship is in the way!', () => {
        let gameBoard = GameboardFactory();
        const mockShip1 = {length: 5, direction: 'vertical', id: 'Carrier'};
        const mockShip2 = {length: 4, direction: 'horizontal', id: 'Battleship'};
        expect(gameBoard.placeShip(mockShip1.length, mockShip1.id, [4,5], mockShip1.direction)).toBeTruthy();
        expect(gameBoard.placeShip(mockShip2.length, mockShip2.id, [2,5], mockShip2.direction)).toBeFalsy();
        expect(gameBoard.getBoard()[5]).toEqual([null,null,null,null,'Carrier',null,null,null,null,null]);
    });

    test('Invalid coordinates 2- two ships are in the way!', () => {
        let gameBoard = GameboardFactory();
        gameBoard.placeShip(4,'Battleship',[3,0],'vertical');
        gameBoard.placeShip(3,'Destroyer',[4,0],'vertical');
        expect(gameBoard.placeShip(5, 'Carrier', [0,0],'horizontal')).toBeFalsy();
        expect(gameBoard.getBoard()[0]).toEqual([null,null,null,'Battleship','Destroyer',null,null,null,null,null]);
    });

});

describe('receiveAttack function', () => {
    test('Happy path', () => {   
        let gameBoard = GameboardFactory();
        const coordinates = [5,4];
        gameBoard.receiveAttack(coordinates);
        expect(gameBoard.getBoard()[coordinates[1]][coordinates[0]]).toBe('x');
    })
})

