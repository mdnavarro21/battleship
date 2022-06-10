const ShipFactory = (length, direction = 'vertical') => {
  if (!length) {
    throw new Error("No length specified");
  }
  let hits = new Array(length).fill(null);
  let id = length == 5 ? 'Carrier' 
    : length == 4 ? 'Battleship' 
    : length == 3 ? 'Destroyer' 
    : length == 2 ? 'Submarine'
    : 'Patrol Boat';

  const getHits = () => hits;
  const getLength = () => length;
  const getDirection = () => direction;
  const getID = () => id;

  const hit = (index) => {
    if (index >= length || index < 0) {
      throw new Error("Ship index out of range");
    }
    hits[index] = "hit";
  };

  const isSunk = () => {
    return hits.every((tile) => tile == "hit");
  };

  return { getLength, getHits, getDirection, getID, hit, isSunk,  };
};

export default ShipFactory;
