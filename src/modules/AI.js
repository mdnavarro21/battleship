import PlayerFactory from "./Player";
import ShipFactory from "./Ship";

const AIFactory = (id = "AI") => {
  const prototype = PlayerFactory(id);
  let possible_moves = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      possible_moves.push([i, j]);
    }
  }
  const randomAttack = () => {
    const index = randomIndex();
    const temp = possible_moves[index];
    possible_moves.splice(index, 1);
    return temp;
  };
  const randomIndex = () => {
    return Math.floor(Math.random() * possible_moves.length);
  };

  const randomShipPlacement = () => {
    prototype.gameBoard.placeShip(ShipFactory(5), [0, 0], "horizontal");
    prototype.gameBoard.placeShip(ShipFactory(4), [9, 0], "vertical");
    prototype.gameBoard.placeShip(ShipFactory(3), [0, 9], "horizontal");
    prototype.gameBoard.placeShip(ShipFactory(2), [5, 5], "vertical");
    prototype.gameBoard.placeShip(ShipFactory(1), [5, 0], "horizontal");
  };

  return Object.assign({}, prototype, { randomAttack, randomShipPlacement });
};

export default AIFactory;
