import { createShip } from './ship';

describe('createShip', () => {
  test('created ship has length, isCellHit, and isSunk properties', () => {
    const ship = createShip(8);
    expect(ship.length).toBe(8);
    expect(ship.isCellHit).toHaveLength(8);
    expect(ship.isSunk()).toBe(false);
  });
  test('ship.hit marks only the given cell as hit', () => {
    const ship = createShip(8);
    ship.hit(6);
    // Cell 7 is hit
    expect(ship.isCellHit[6]).toBe(true);
    // No other cells are hit
    ship.isCellHit.slice(0, 6).forEach((cell) => expect(cell).toBe(false));
    expect(ship.isCellHit[7]).toBe(false);
  });
  test('ship.isSunk is true if all cells have been hit', () => {
    const ship = createShip(3);
    ship.hit(0);
    ship.hit(1);
    ship.hit(2);
    expect(ship.isSunk()).toBe(true);
  });
  test('ship.isSunk is false if not all cells have been hit', () => {
    const ship = createShip(3);
    ship.hit(0);
    ship.hit(2);
    expect(ship.isSunk()).toBe(false);
  });
});
