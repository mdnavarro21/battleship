const ShipFactory = (length) => {
  let sunk = false;
  const hits = new Array(length).fill("o");

  const hit = (index) => {
    hits[index] = "hit";
  };

  const isSunk = () => {
    if (hits.every((element) => element === "hit")) {
      sunk = true;
    }
    return sunk;
  };

  return { hit, isSunk };
};

export default ShipFactory;
