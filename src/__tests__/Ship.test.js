import ShipFactory from "../modules/Ship";

test("testing test", () => {
  const newShip = ShipFactory(5);
  expect(newShip.isSunk()).toBe(false);
});
