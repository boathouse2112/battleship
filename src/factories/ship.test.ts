import { createShip } from './ship';

describe('createShip', () => {
  test('created ship has length, hitCells, and isSunk properties', () => {
    const ship = createShip(8);
    expect(ship.length).toBe(8);
    expect(ship.hitCells).toHaveLength(8);
    expect(ship.isSunk()).toBe(false);
  });
  test('ship.hit marks only the given cell as hit', () => {
    let ship = createShip(8);
    ship = ship.hit(6);
    // Cell 7 is hit
    expect(ship.hitCells[6]).toBe(true);
    // No other cells are hit
    ship.hitCells.slice(0, 6).forEach((cell) => expect(cell).toBe(false));
    expect(ship.hitCells[7]).toBe(false);
  });
  test('ship.isSunk is true if all cells have been hit', () => {
    let ship = createShip(3);
    ship = ship.hit(0);
    ship = ship.hit(1);
    ship = ship.hit(2);
    expect(ship.isSunk()).toBe(true);
  });
  test('ship.isSunk is false if not all cells have been hit', () => {
    const ship = createShip(3);
    ship.hit(0);
    ship.hit(2);
    expect(ship.isSunk()).toBe(false);
  });
});
