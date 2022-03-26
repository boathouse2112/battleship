/**
 * Creates a battleship ship.
 * @param length length of the ship
 * @returns
 * - length: length of the ship
 * - isCellHit: array indicating whether the nth cell has been hit
 * - isSunk: Whether all cells have been hit, and the ship has been sunk
 */
const createShip = function (length: number) {
  const isCellHit: Array<boolean> = Array(length).fill(false);

  /**
   * Marks the given cell as hit
   * @param cell the index of the cell to mark as hit
   */
  const hit = function (cell: number) {
    isCellHit[cell] = true;
  };

  const isSunk = function () {
    return isCellHit.every((cell) => cell);
  };

  return { length, isCellHit, hit, isSunk };
};

export { createShip };
