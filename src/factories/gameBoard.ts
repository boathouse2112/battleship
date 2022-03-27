import { Ship } from './ship';

type Axis = 'horizontal' | 'vertical';
type Coord = { x: number; y: number };
type Direction = 'right' | 'down';

type ShipLocation = {
  ship: Ship;
  coords: Coord;
  direction: Direction;
};

const createGameBoard = function (width: number, height: number) {
  const missedAttacks: Coord[] = [];
  const ships: ShipLocation[] = [];

  /**
   * Get a list of cells occupied by the ship at the given ShipLocation.
   */
  const getShipCells = function (shipLocation: ShipLocation): {
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
   * Determines whether the given cell is in bounds on the given axis.
   */
  const isCellInBounds = function (cell: number, axis: Axis) {
    if (axis === 'horizontal') {
      return cell >= 0 && cell < width;
    } else {
      return cell >= 0 && cell < height;
    }
  };

  /**
   * Determines if given ship location is in-bounds.
   * If axis is given, determines only on that axis.
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
          isCellInBounds(x, 'horizontal') &&
          isCellInBounds(rightEndCell, 'horizontal');
      } else {
        // x must be in bounds
        inBounds = inBounds && isCellInBounds(x, 'horizontal');
      }
    }

    if (typeof axis === 'undefined' || axis === 'vertical') {
      if (direction === 'right') {
        // y must be in bounds
        inBounds = inBounds && isCellInBounds(y, 'vertical');
      } else {
        // y and (y + ship.length - 1) must be in bounds
        const downEndCell = shipEndCell(y, ship);
        inBounds =
          inBounds &&
          isCellInBounds(y, 'vertical') &&
          isCellInBounds(downEndCell, 'vertical');
      }
    }

    return inBounds;
  };

  /**
   * Determines if the ships at the given ship locations collide on any occupied cell.
   */
  const isShipCollision = function (shipA: ShipLocation, shipB: ShipLocation) {
    const shipACells = getShipCells(shipA);
    const shipBCells = getShipCells(shipB);
    return shipACells.some((shipACell) =>
      shipBCells.some(
        (shipBCell) =>
          shipACell.x === shipBCell.x && shipACell.y === shipBCell.y
      )
    );
  };

  /**
   * Places a ship at the given coordinates, facing the given direction
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

  const receiveAttack = function (x: number, y: number): void {
    const outOfBoundsErrorMessage = (axis: string) =>
      `Given coordinate is out of bounds on the ${axis} axis.`;

    if (!isCellInBounds(x, 'horizontal') && !isCellInBounds(y, 'vertical')) {
      throw new Error(outOfBoundsErrorMessage('x and y'));
    }
    if (!isCellInBounds(x, 'horizontal')) {
      throw new Error(outOfBoundsErrorMessage('x'));
    }
    if (!isCellInBounds(y, 'vertical')) {
      throw new Error(outOfBoundsErrorMessage('y'));
    }

    // Try each ship to see if there's a hit
    let shipHit = false;
    ships.forEach((shipLocation) => {
      const ship = shipLocation.ship;
      const shipCells = getShipCells(shipLocation);
      shipCells.forEach(({ x: cellX, y: cellY }, index) => {
        if (x === cellX && y === cellY) {
          ship.hit(index);
          shipHit = true;
        }
      });
    });

    // If there was no hit, add targeted coordinates to missedAttacks
    if (!shipHit) {
      missedAttacks.push({ x, y });
    }
  };

  return {
    dimensions: { width, height },
    height,
    ships,
    missedAttacks,
    placeShip,
    receiveAttack,
  };
};

export { createGameBoard };
