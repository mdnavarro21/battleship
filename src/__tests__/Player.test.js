import PlayerFactory from "../modules/Player";
import GameboardFactory from "../modules/Gameboard";

describe('Player object initialized correctly', () => {
    let player1 = PlayerFactory('Player 1');  

    test('Player gameboard', () => {
        expect(JSON.stringify(player1.gameBoard, function(key, val) {
            return (typeof val === 'function') ? '' + val : val;
        }) == JSON.stringify(GameboardFactory(), function(key, val) {
            return (typeof val === 'function') ? '' + val : val;
        })).toBeTruthy();
       // expect(Object.keys(player1.gameBoard)).toEqual(Object.keys(GameboardFactory()));
    });

    test('Player name/id', () => {
        expect(player1.id).toBe('Player 1');
    })

})

describe('Attack function', () => {
    let player1 = PlayerFactory('Player 1');
    let player2 = PlayerFactory('Player 2');

    test('Happy path - send attack to enemy gameboard', () => {
        expect(player1.attack(player2.gameBoard, [0,0])).toBeTruthy();
        expect(player2.gameBoard.getBoard()[0][0]).toBe('X');
    });

    test('Invalid coordinates - tile already attacked', () => {
        player1.attack(player2.gameBoard, [3,4]);
        expect(player1.attack(player2.gameBoard, [3,4])).toBeFalsy();
        expect(player2.gameBoard.getBoard()[4][3]).toBe('X');
    });
})
