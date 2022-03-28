import { Ship } from './ship';

type Axis = 'horizontal' | 'vertical';
type Coord = { x: number; y: number };

const coordEquals = (a: Coord, b: Coord) => a.x === b.x && a.y === b.y;

type Direction = 'right' | 'down';
type CellState = {
  shipState: 'ship' | 'no-ship';
  attackState: 'attacked' | 'not-attacked';
};

interface ShipLocation {
  ship: Ship;
  coords: Coord;
  direction: Direction;
}

interface GameBoard {
  dimensions: {
    width: number;
    height: number;
  };
  shipLocations: ShipLocation[];
  missedAttacks: Coord[];
  getCellState: (coord: Coord) => CellState;
  areAllShipsSunk: () => boolean;
  isPossibleShipPlacement: (shipLocation: ShipLocation) => boolean;
  placeShip: (
    ship: Ship,
    x: number,
    y: number,
    direction: Direction
  ) => GameBoard;
  receiveAttack: (x: number, y: number) => GameBoard;
}

const createGameBoard = function (width: number, height: number): GameBoard {
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

  const wasPreviouslyAttacked = function (
    this: GameBoard,
    x: number,
    y: number
  ) {
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

    const anyMatchingMissedAttacks = this.missedAttacks.some((attackCoord) =>
      coordEquals(attackCoord, { x, y })
    );

    const anyMatchingHitAttacks = this.shipLocations.some((shipLocation) =>
      getShipCells(shipLocation).some((cellCoord, index) => {
        const ship = shipLocation.ship;
        return coordEquals(cellCoord, { x, y }) && ship.hitCells[index];
      })
    );

    return anyMatchingMissedAttacks || anyMatchingHitAttacks;
  };

  /**
   * Determines whether all ships on this game board are sunk.
   */
  const areAllShipsSunk = function (this: GameBoard) {
    return this.shipLocations.every((shipLocation) =>
      shipLocation.ship.isSunk()
    );
  };

  const isPossibleShipPlacement = function (
    this: GameBoard,
    shipLocation: ShipLocation
  ): boolean {
    const anyCollisions = this.shipLocations.some((existingShipLocation) =>
      isShipCollision(shipLocation, existingShipLocation)
    );
    return isShipInBounds(shipLocation) && !anyCollisions;
  };

  /**
   * Places a ship at the given coordinates, facing the given direction>
   */
  const placeShip = function (
    this: GameBoard,
    ship: Ship,
    x: number,
    y: number,
    direction: Direction
  ): GameBoard {
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
      this.shipLocations.some((existingShipLocation) =>
        isShipCollision(shipLocation, existingShipLocation)
      )
    ) {
      throw new Error('Placed ship collides with already-existing ship.');
    }

    const newShipLocations = [...this.shipLocations, shipLocation];
    return { ...this, shipLocations: newShipLocations };
  };

  function validateOutOfBounds({ x, y }: Coord) {
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
  }

  const receiveAttack = function (
    this: GameBoard,
    x: number,
    y: number
  ): GameBoard {
    validateOutOfBounds({ x, y });

    if (wasPreviouslyAttacked.call(this, x, y)) {
      throw new Error('Given coordinate was previously attacked.');
    }

    // Try each ship to see if there's a hit
    let shipHit = false;
    const shipLocations = this.shipLocations.map((shipLocation) => {
      let ship = shipLocation.ship;
      const shipCells = getShipCells(shipLocation);

      shipCells.forEach((cellCoord, cellIndex) => {
        if (coordEquals({ x, y }, cellCoord)) {
          ship = ship.hit(cellIndex);
          shipHit = true;
        }
      });
      return { ...shipLocation, ship };
    });

    // If there was no hit, add targeted coordinates to missedAttacks
    const missedAttacks = shipHit
      ? this.missedAttacks
      : [...this.missedAttacks, { x, y }];

    return { ...this, shipLocations, missedAttacks };
  };

  const getCellState = function (this: GameBoard, coord: Coord): CellState {
    validateOutOfBounds(coord);

    // Check all ship cells
    for (const shipLocation of this.shipLocations) {
      const shipCells = getShipCells(shipLocation);

      for (const [index, cellCoord] of shipCells.entries()) {
        if (coordEquals(coord, cellCoord)) {
          const shipState = 'ship';
          const attackState = shipLocation.ship.hitCells[index]
            ? 'attacked'
            : 'not-attacked';
          return { shipState, attackState };
        }
      }
    }

    // Not a ship cell
    const shipState = 'no-ship';
    const cellWasAttacked = this.missedAttacks.some((attackCoord) =>
      coordEquals(coord, attackCoord)
    );
    const attackState = cellWasAttacked ? 'attacked' : 'not-attacked';

    return { shipState, attackState };
  };

  return {
    dimensions: { width, height },
    shipLocations: [],
    missedAttacks: [],
    getCellState,
    areAllShipsSunk,
    isPossibleShipPlacement,
    placeShip,
    receiveAttack,
  };
};

export type { Coord, CellState, ShipLocation, GameBoard };
export { createGameBoard };
