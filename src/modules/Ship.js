const ShipFactory = (length) => {
  if (!length) {
    throw new Error("No length specified");
  }
  let hits = new Array(length).fill(null);

  const getHits = () => hits;
  const getLength = () => length;

  const hit = (index) => {
    if (index >= length || index < 0) {
      throw new Error('Ship index out of range');
    }
    hits[index] = "hit";
  }

  const isSunk = () => {
    return hits.every((tile) => tile == 'hit');
  }

  return {getLength, getHits, hit, isSunk}
};

export default ShipFactory;
