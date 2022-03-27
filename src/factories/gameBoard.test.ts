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

    expect(gameBoard.ships[0].ship).toBe(destroyer);
    expect(gameBoard.ships[0].coords).toStrictEqual({ x: 4, y: 5 });
    expect(gameBoard.ships[0].direction).toBe('right');
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
    const gameBoard = createGameBoard(3, 5);

    // pointing right
    expect(() => {
      gameBoard.placeShip(destroyer, 0, 0, 'right');
    }).not.toThrow();
    expect(() => {
      gameBoard.placeShip(destroyer, 0, 4, 'right');
    }).not.toThrow();
    expect(() => {
      gameBoard.placeShip(destroyer, 1, 0, 'right');
    }).not.toThrow();
    expect(() => {
      gameBoard.placeShip(destroyer, 1, 4, 'right');
    }).not.toThrow();

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
});
