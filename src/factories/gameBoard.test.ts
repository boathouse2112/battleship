import { createGameBoard } from './gameBoard';
import { createShip } from './ship';

describe('createGameBoard', () => {
  test('has given dimensions', () => {
    const gameBoard = createGameBoard(4, 5);
    expect(gameBoard.dimensions).toStrictEqual({ width: 4, height: 5 });
  });

  test('placeShip adds a ship', () => {
    const destroyer = createShip(2);
    const gameBoard = createGameBoard(10, 10);

    gameBoard.placeShip(destroyer, 4, 5, 'right');

    expect(gameBoard.shipLocations[0].ship).toBe(destroyer);
    expect(gameBoard.shipLocations[0].coords).toStrictEqual({ x: 4, y: 5 });
    expect(gameBoard.shipLocations[0].direction).toBe('right');
  });

  test("placeShip won't place ships out of bounds", () => {
    const carrier = createShip(5);
    const gameBoard = createGameBoard(10, 15);

    // pointing right
    expect(() => {
      gameBoard.placeShip(carrier, -1, 0, 'right');
    }).toThrow('Placed ship would be out of bounds on the x-axis');
    expect(() => {
      gameBoard.placeShip(carrier, 10, 0, 'right');
    }).toThrow('Placed ship would be out of bounds on the x-axis');
    expect(() => {
      gameBoard.placeShip(carrier, 6, 0, 'right');
    }).toThrow('Placed ship would be out of bounds on the x-axis');

    expect(() => {
      gameBoard.placeShip(carrier, 0, -1, 'right');
    }).toThrow('Placed ship would be out of bounds on the y-axis');
    expect(() => {
      gameBoard.placeShip(carrier, 0, 15, 'right');
    }).toThrow('Placed ship would be out of bounds on the y-axis');

    // pointing down
    expect(() => {
      gameBoard.placeShip(carrier, 0, -1, 'down');
    }).toThrow('Placed ship would be out of bounds on the y-axis');
    expect(() => {
      gameBoard.placeShip(carrier, 0, 15, 'down');
    }).toThrow('Placed ship would be out of bounds on the y-axis');
    expect(() => {
      gameBoard.placeShip(carrier, 0, 11, 'down');
    }).toThrow('Placed ship would be out of bounds on the y-axis');

    expect(() => {
      gameBoard.placeShip(carrier, -1, 0, 'down');
    }).toThrow('Placed ship would be out of bounds on the x-axis');
    expect(() => {
      gameBoard.placeShip(carrier, 10, 0, 'down');
    }).toThrow('Placed ship would be out of bounds on the x-axis');
  });

  test('placeShip will place ships on the edge of the bord', () => {
    const destroyer = createShip(2);
    const newBoard = () => createGameBoard(3, 5);
    let gameBoard = newBoard();

    // pointing right
    expect(() => {
      gameBoard.placeShip(destroyer, 0, 0, 'right');
    }).not.toThrow();
    expect(() => {
      gameBoard.placeShip(destroyer, 0, 4, 'right');
    }).not.toThrow();
    gameBoard = newBoard(); // Avoid ship collision
    expect(() => {
      gameBoard.placeShip(destroyer, 1, 0, 'right');
    }).not.toThrow();
    expect(() => {
      gameBoard.placeShip(destroyer, 1, 4, 'right');
    }).not.toThrow();
    gameBoard = newBoard(); // Avoid ship collision

    // pointing down
    expect(() => {
      gameBoard.placeShip(destroyer, 0, 0, 'down');
    }).not.toThrow();
    expect(() => {
      gameBoard.placeShip(destroyer, 0, 3, 'down');
    }).not.toThrow();
    expect(() => {
      gameBoard.placeShip(destroyer, 2, 0, 'down');
    }).not.toThrow();
    expect(() => {
      gameBoard.placeShip(destroyer, 2, 3, 'down');
    }).not.toThrow();
  });

  test("placeShip won't place overlapping ships", () => {
    const destroyer = createShip(2);
    const carrier = createShip(5);
    const gameBoard = createGameBoard(10, 10);

    gameBoard.placeShip(destroyer, 4, 4, 'right');
    expect(() => gameBoard.placeShip(carrier, 4, 4, 'right')).toThrow(
      'Placed ship collides with already-existing ship.'
    );
    expect(() => gameBoard.placeShip(carrier, 0, 4, 'right')).toThrow(
      'Placed ship collides with already-existing ship.'
    );
    expect(() => gameBoard.placeShip(carrier, 5, 4, 'right')).toThrow(
      'Placed ship collides with already-existing ship.'
    );
    expect(() => gameBoard.placeShip(carrier, 4, 0, 'down')).toThrow(
      'Placed ship collides with already-existing ship.'
    );
    expect(() => gameBoard.placeShip(carrier, 5, 0, 'down')).toThrow(
      'Placed ship collides with already-existing ship.'
    );
    expect(() => gameBoard.placeShip(carrier, 5, 3, 'down')).toThrow(
      'Placed ship collides with already-existing ship.'
    );
  });

  test('placeShip will place ships side-by-side', () => {
    const destroyer = createShip(2);
    let gameBoard = createGameBoard(6, 3);

    expect(() => gameBoard.placeShip(destroyer, 0, 0, 'right')).not.toThrow();
    expect(() => gameBoard.placeShip(destroyer, 0, 1, 'right')).not.toThrow();
    expect(() => gameBoard.placeShip(destroyer, 0, 2, 'right')).not.toThrow();
    expect(() => gameBoard.placeShip(destroyer, 2, 0, 'right')).not.toThrow();
    expect(() => gameBoard.placeShip(destroyer, 2, 1, 'right')).not.toThrow();
    expect(() => gameBoard.placeShip(destroyer, 2, 2, 'right')).not.toThrow();
    expect(() => gameBoard.placeShip(destroyer, 4, 0, 'right')).not.toThrow();
    expect(() => gameBoard.placeShip(destroyer, 4, 1, 'right')).not.toThrow();
    expect(() => gameBoard.placeShip(destroyer, 4, 2, 'right')).not.toThrow();

    gameBoard = createGameBoard(3, 6);
    expect(() => gameBoard.placeShip(destroyer, 0, 0, 'down')).not.toThrow();
    expect(() => gameBoard.placeShip(destroyer, 0, 2, 'down')).not.toThrow();
    expect(() => gameBoard.placeShip(destroyer, 0, 4, 'down')).not.toThrow();
    expect(() => gameBoard.placeShip(destroyer, 1, 0, 'down')).not.toThrow();
    expect(() => gameBoard.placeShip(destroyer, 1, 2, 'down')).not.toThrow();
    expect(() => gameBoard.placeShip(destroyer, 1, 4, 'down')).not.toThrow();
    expect(() => gameBoard.placeShip(destroyer, 2, 0, 'down')).not.toThrow();
    expect(() => gameBoard.placeShip(destroyer, 2, 2, 'down')).not.toThrow();
    expect(() => gameBoard.placeShip(destroyer, 2, 4, 'down')).not.toThrow();
  });

  test("receiveAttack won't accept out-of-bounds attacks", () => {
    const gameBoard = createGameBoard(5, 5);

    expect(() => gameBoard.receiveAttack(-1, -1)).toThrow(
      'Given coordinate is out of bounds on the x and y axis.'
    );
    expect(() => gameBoard.receiveAttack(5, 5)).toThrow(
      'Given coordinate is out of bounds on the x and y axis.'
    );
    expect(() => gameBoard.receiveAttack(-1, 0)).toThrow(
      'Given coordinate is out of bounds on the x axis.'
    );
    expect(() => gameBoard.receiveAttack(5, 0)).toThrow(
      'Given coordinate is out of bounds on the x axis.'
    );
    expect(() => gameBoard.receiveAttack(0, -1)).toThrow(
      'Given coordinate is out of bounds on the y axis.'
    );
    expect(() => gameBoard.receiveAttack(0, 5)).toThrow(
      'Given coordinate is out of bounds on the y axis.'
    );
  });

  test("receiveAttack won't accept previously attacked coordinates", () => {
    const carrierA = createShip(5);
    const carrierB = createShip(5);
    const gameBoard = createGameBoard(5, 5);
    gameBoard.placeShip(carrierA, 0, 0, 'right');
    gameBoard.placeShip(carrierB, 0, 1, 'right');

    // Missed attacks
    gameBoard.receiveAttack(0, 2);
    gameBoard.receiveAttack(2, 2);
    gameBoard.receiveAttack(4, 2);
    // Hit attacks
    gameBoard.receiveAttack(0, 0);
    gameBoard.receiveAttack(2, 0);
    gameBoard.receiveAttack(4, 0);
    gameBoard.receiveAttack(0, 1);
    gameBoard.receiveAttack(2, 1);
    gameBoard.receiveAttack(4, 1);

    // Previously-missed attacks
    expect(() => gameBoard.receiveAttack(0, 2)).toThrow(
      'Given coordinate was previously attacked.'
    );
    expect(() => gameBoard.receiveAttack(2, 2)).toThrow(
      'Given coordinate was previously attacked.'
    );
    expect(() => gameBoard.receiveAttack(4, 2)).toThrow(
      'Given coordinate was previously attacked.'
    );
    // Previously-hit attacks
    expect(() => gameBoard.receiveAttack(0, 0)).toThrow(
      'Given coordinate was previously attacked.'
    );
    expect(() => gameBoard.receiveAttack(2, 0)).toThrow(
      'Given coordinate was previously attacked.'
    );
    expect(() => gameBoard.receiveAttack(4, 0)).toThrow(
      'Given coordinate was previously attacked.'
    );
    expect(() => gameBoard.receiveAttack(0, 1)).toThrow(
      'Given coordinate was previously attacked.'
    );
    expect(() => gameBoard.receiveAttack(2, 1)).toThrow(
      'Given coordinate was previously attacked.'
    );
    expect(() => gameBoard.receiveAttack(4, 1)).toThrow(
      'Given coordinate was previously attacked.'
    );
  });

  test('Attacking a ship hits the cell', () => {
    const carrier = createShip(5);
    const gameBoard = createGameBoard(5, 5);

    gameBoard.placeShip(carrier, 0, 0, 'right');
    gameBoard.receiveAttack(0, 0);
    gameBoard.receiveAttack(2, 0);
    gameBoard.receiveAttack(4, 0);

    expect(gameBoard.shipLocations[0].ship.hitCells[0]).toBe(true);
    expect(gameBoard.shipLocations[0].ship.hitCells[1]).toBe(false);
    expect(gameBoard.shipLocations[0].ship.hitCells[2]).toBe(true);
    expect(gameBoard.shipLocations[0].ship.hitCells[3]).toBe(false);
    expect(gameBoard.shipLocations[0].ship.hitCells[4]).toBe(true);

    expect(gameBoard.missedAttacks).toEqual([]);
  });

  test('Missing a ship adds the attack to missedAttacks', () => {
    const carrier = createShip(5);
    const gameBoard = createGameBoard(5, 5);

    gameBoard.placeShip(carrier, 0, 0, 'right');
    gameBoard.receiveAttack(0, 1);
    gameBoard.receiveAttack(2, 1);
    gameBoard.receiveAttack(4, 1);

    expect(gameBoard.missedAttacks).toEqual([
      { x: 0, y: 1 },
      { x: 2, y: 1 },
      { x: 4, y: 1 },
    ]);
  });

  test('If only some ships are sunk, areAllShipsSunk returns false', () => {
    const destroyerA = createShip(2);
    const destroyerB = createShip(2);
    const destroyerC = createShip(2);
    const gameBoard = createGameBoard(5, 5);

    gameBoard.placeShip(destroyerA, 0, 0, 'right');
    gameBoard.placeShip(destroyerB, 0, 1, 'right');
    gameBoard.placeShip(destroyerC, 0, 2, 'right');
    expect(gameBoard.areAllShipsSunk()).toBe(false);

    gameBoard.receiveAttack(0, 0);
    gameBoard.receiveAttack(1, 0);
    gameBoard.receiveAttack(0, 1);
    gameBoard.receiveAttack(1, 1);
    expect(gameBoard.areAllShipsSunk()).toBe(false);
  });

  test('If all ships are sunk, areAllShipsSunk returns true', () => {
    const destroyerA = createShip(2);
    const destroyerB = createShip(2);
    const destroyerC = createShip(2);
    const gameBoard = createGameBoard(5, 5);

    gameBoard.placeShip(destroyerA, 0, 0, 'right');
    gameBoard.placeShip(destroyerB, 0, 1, 'right');
    gameBoard.placeShip(destroyerC, 0, 2, 'right');

    gameBoard.receiveAttack(0, 0);
    gameBoard.receiveAttack(1, 0);
    gameBoard.receiveAttack(0, 1);
    gameBoard.receiveAttack(1, 1);
    gameBoard.receiveAttack(0, 2);
    gameBoard.receiveAttack(1, 2);
    expect(gameBoard.areAllShipsSunk()).toBe(true);
  });
});
