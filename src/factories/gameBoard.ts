import { Ship } from './ship';

type Direction = 'right' | 'down';

const createGameBoard = function (width: number, height: number) {
  const ships: {
    ship: Ship;
    coords: { x: number; y: number };
    direction: Direction;
  }[] = [];

  const inBounds = function (cell: number, axis: 'horizontal' | 'vertical') {
    if (axis === 'horizontal') {
      return cell >= 0 && cell < width;
    } else {
      return cell >= 0 && cell < height;
    }
  };

  /**
   * Places a ship at the given coordinates, facing the given direction
   * @param x X coord
   * @param y Y coord
   * @param direction 'down' | 'right'
   */
  const placeShip = function (
    ship: Ship,
    x: number,
    y: number,
    direction: Direction
  ) {
    // Out of bounds error checking

    const outOfBoundsErrorMessage = (axis: string) =>
      `Placed ship would be out of bounds on the ${axis}-axis.`;
    const shipEndCell = (startCell: number, ship: Ship) =>
      startCell + ship.length - 1;

    if (direction === 'right') {
      // If 'right':
      // - x and (x + ship.length - 1) must be in bounds
      // - y must be in bounds
      const rightEndCell = shipEndCell(x, ship);
      if (!inBounds(x, 'horizontal') || !inBounds(rightEndCell, 'horizontal')) {
        throw new Error(outOfBoundsErrorMessage('x'));
      }

      if (!inBounds(y, 'vertical')) {
        throw new Error(outOfBoundsErrorMessage('y'));
      }
    } else {
      // If 'down':
      // - x must be in bounds
      // - y and (y + ship.length - 1) must be in bounds

      if (!inBounds(x, 'horizontal')) {
        throw new Error(outOfBoundsErrorMessage('x'));
      }

      const downEndCell = shipEndCell(y, ship);
      if (!inBounds(y, 'vertical') || !inBounds(downEndCell, 'vertical')) {
        throw new Error(outOfBoundsErrorMessage('y'));
      }
    }

    ships.push({ ship, coords: { x, y }, direction });
  };

  return { dimensions: { width, height }, height, ships, placeShip };
};

export { createGameBoard };
