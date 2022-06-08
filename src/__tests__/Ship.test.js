import ShipFactory from "../modules/Ship";

describe("Ship properties initialized correctly", () => {
  const newShip = ShipFactory(4);
  test("Length set with 4", () => {
    expect(newShip.getLength()).toBe(4);
  });

  test("Throw error if no length specified", () => {
    expect(() => ShipFactory()).toThrow("No length specified");
  });

  test("Hits array set with length 4", () => {
    expect(newShip.getHits()).toEqual([null, null, null, null]);
  });

  test("Direction set - default vertical", () => {
    expect(newShip.getDirection()).toEqual('vertical');
  });

  test("Direction set - horizontal", () => {
    const newShip2 = ShipFactory(3,'horizontal');
    expect(newShip2.getDirection()).toEqual('horizontal');
  });

  test("isSunk function - expected false", () => {
    expect(newShip.isSunk()).toBeFalsy();
  });
});

test("Hit function happy path", () => {
  const newShip = ShipFactory(5);
  newShip.hit(2);
  expect(newShip.getHits()).toEqual([null, null, "hit", null, null]);
});

test("Hit function - index out of range", () => {
  const newShip = ShipFactory(3);
  expect(() => newShip.hit(4)).toThrow("Ship index out of range");
});

test("isSunk happy path 1 - ship still afloat after hits; expecting false", () => {
  const newShip = ShipFactory(4);
  for (let i = 0; i < newShip.getLength(); i += 2) {
    newShip.hit(i);
  }
  expect(newShip.isSunk()).toBeFalsy();
});

test("isSunk happy path 2 - ship has sunk", () => {
  const newShip = ShipFactory(4);
  for (let i = 0; i < newShip.getLength(); i += 1) {
    newShip.hit(i);
  }
  expect(newShip.isSunk()).toBeTruthy();
});
