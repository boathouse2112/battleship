interface Ship {
  length: number;
  hitCells: boolean[];
  hit(cell: number): void;
  isSunk(): boolean;
}

/**
 * Creates a battleship ship.
 * @param length length of the ship
 * @returns
 * - length: length of the ship
 * - isCellHit: array indicating whether the nth cell has been hit
 * - isSunk: Whether all cells have been hit, and the ship has been sunk
 */
const createShip = function (length: number): Ship {
  const hitCells: boolean[] = Array(length).fill(false);

  /**
   * Marks the given cell as hit
   * @param cell the index of the cell to mark as hit
   */
  const hit = function (cell: number) {
    hitCells[cell] = true;
  };

  const isSunk = function () {
    return hitCells.every((cell) => cell);
  };

  return { length, hitCells, hit, isSunk };
};

export type { Ship };
export { createShip };
