import { Ship } from './ship';

type Axis = 'horizontal' | 'vertical';
type Direction = 'right' | 'down';

type ShipLocation = {
  ship: Ship;
  coords: { x: number; y: number };
  direction: Direction;
};

const createGameBoard = function (width: number, height: number) {
  const ships: ShipLocation[] = [];

  const cellInBounds = function (cell: number, axis: Axis) {
    if (axis === 'horizontal') {
      return cell >= 0 && cell < width;
    } else {
      return cell >= 0 && cell < height;
    }
  };

  /**
   * Get a list of cells occupied by the ship at the given ShipLocation
   */
  const shipCells = function (shipLocation: ShipLocation): {
    x: number;
    y: number;
  }[] {
    const { ship, coords, direction } = shipLocation;
    const { x, y } = coords;

    if (direction === 'right') {
      const cells = [];
      for (let i = 0; i < ship.length; i++) {
        cells.push({ x: x + i, y });
      }
      return cells;
    } else {
      const cells = [];
      for (let i = 0; i < ship.length; i++) {
        cells.push({ x, y: y + i });
      }
      return cells;
    }
  };

  /**
   * Determines if given ship location is in-bounds.
   * If axis is given, determines only on that axis
   */
  const isShipInBounds = function (shipLocation: ShipLocation, axis?: Axis) {
    const { ship, coords, direction } = shipLocation;
    const { x, y } = coords;

    const shipEndCell = (startCell: number, ship: Ship) =>
      startCell + ship.length - 1;

    let inBounds = true;
    if (typeof axis === 'undefined' || axis === 'horizontal') {
      if (direction === 'right') {
        // x and (x + ship.length - 1) must be in bounds
        const rightEndCell = shipEndCell(x, ship);
        inBounds =
          inBounds &&
          cellInBounds(x, 'horizontal') &&
          cellInBounds(rightEndCell, 'horizontal');
      } else {
        // x must be in bounds
        inBounds = inBounds && cellInBounds(x, 'horizontal');
      }
    }

    if (typeof axis === 'undefined' || axis === 'vertical') {
      if (direction === 'right') {
        // y must be in bounds
        inBounds = inBounds && cellInBounds(y, 'vertical');
      } else {
        // y and (y + ship.length - 1) must be in bounds
        const downEndCell = shipEndCell(y, ship);
        inBounds =
          inBounds &&
          cellInBounds(y, 'vertical') &&
          cellInBounds(downEndCell, 'vertical');
      }
    }

    return inBounds;
  };

  /**
   * Determines if the ships at the given ship locations collide on any occupied cell.
   */
  const isShipCollision = function (shipA: ShipLocation, shipB: ShipLocation) {
    const shipACells = shipCells(shipA);
    const shipBCells = shipCells(shipB);
    return shipACells.some((shipACell) =>
      shipBCells.some(
        (shipBCell) =>
          shipACell.x === shipBCell.x && shipACell.y === shipBCell.y
      )
    );
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
    const shipLocation = { ship, coords: { x, y }, direction };

    // Out of bounds error checking
    const outOfBoundsErrorMessage = (axis: string) =>
      `Placed ship would be out of bounds on the ${axis}-axis.`;

    if (!isShipInBounds(shipLocation, 'horizontal')) {
      throw new Error(outOfBoundsErrorMessage('x'));
    }
    if (!isShipInBounds(shipLocation, 'vertical')) {
      throw new Error(outOfBoundsErrorMessage('y'));
    }

    // Collision error checking
    if (
      ships.some((existingShipLocation) =>
        isShipCollision(shipLocation, existingShipLocation)
      )
    ) {
      throw new Error('Placed ship collides with already-existing ship.');
    }

    ships.push(shipLocation);
  };

  return {
    dimensions: { width, height },
    height,
    ships,
    placeShip,
    isShipCollision,
  };
};

export { createGameBoard };
