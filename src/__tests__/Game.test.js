import Game from "../modules/Game";
import ShipFactory from "../modules/Ship";


describe('startGame function', () => {
    Game.start();

    test('Players initialized', () => {
        expect(Game.player1 != null).toBeTruthy();
        expect(Game.player2 != null).toBeTruthy();
        expect(Game.winner == null).toBeTruthy();
    });
})

describe('playRound function', () => {

    test('Happy path 1 - returns true when both players attack', () => {
        Game.start();
        Game.player1.gameBoard.placeShip(ShipFactory(5), [0,0], 'horizontal');
        expect(Game.playRound([0,0])).toBeTruthy();
        expect(Game.player2.gameBoard.getBoard()[0][0]).toBe('hit');
    });

    test('Happy path 2 - returns false when winner is declared', () => {
        Game.start();
        Game.player1.gameBoard.placeShip(ShipFactory(5), [0,0], 'horizontal');
        const p2_ship_coordinates = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[9,0],[9,1],[9,2],[9,3],[5,5],[5,6],[0,9],[1,9],[2,9]];
        for (let i = 0; i < p2_ship_coordinates.length - 1; i++) {
            Game.playRound(p2_ship_coordinates[i]);
        }
        expect(Game.playRound([2,9])).toBeFalsy();
        expect(Game.winner == null).toBeFalsy();
    });
});