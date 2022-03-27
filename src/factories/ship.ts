import { replaceAt } from '../util';

interface Ship {
  length: number;
  hitCells: boolean[];
  hit(cell: number): Ship;
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
  const _hitCells: boolean[] = Array(length).fill(false);

  const hit = function (this: Ship, cell: number) {
    const hitCells = replaceAt(this.hitCells, cell, true);
    return { length, hitCells, hit, isSunk };
  };

  const isSunk = function (this: Ship) {
    return this.hitCells.every((cell) => cell);
  };

  return { length, hitCells: _hitCells, hit, isSunk };
};

export type { Ship };
export { createShip };
