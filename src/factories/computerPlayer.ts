import { Coord, GameBoard, ShipLocation } from './gameBoard';
import { Player } from './player';
import { createShip, Ship } from './ship';

const createComputerPlayer = function () {
  const possibleAttacks = function (
    this: Player,
    width: number,
    height: number
  ): Coord[] {
    const attacks = [];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const attack = { x, y };
        if (!this.previousAttacks.includes(attack)) {
          attacks.push(attack);
        }
      }
    }
    return attacks;
  };

  /*
  const possibleShipPlacements = function (
    gameBoard: GameBoard,
    ship: Ship
  ): ShipLocation[] {
    const { width, height } = gameBoard.dimensions;

    const placements = [];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const coords = { x, y };
        const placementRight: ShipLocation = {
          ship,
          coords,
          direction: 'right',
        };
        const placementDown: ShipLocation = { ship, coords, direction: 'down' };
        if (gameBoard.isPossibleShipPlacement(placementRight)) {
          placements.push(placementRight);
        }
        if (gameBoard.isPossibleShipPlacement(placementDown)) {
          placements.push(placementDown);
        }
      }
    }

    return placements;
  };
  */

  const placeInitialShips = function (gameBoard: GameBoard): GameBoard {
    return gameBoard
      .placeShip(createShip(5), 0, 0, 'right')
      .placeShip(createShip(4), 0, 1, 'right')
      .placeShip(createShip(3), 0, 2, 'right')
      .placeShip(createShip(3), 0, 3, 'right')
      .placeShip(createShip(2), 0, 4, 'right');
  };

  /**
   * Makes a random in-bounds attack that has not already been made.
   */
  const makeAttack = function (
    this: Player,
    gameBoard: GameBoard
  ): [Player, GameBoard] {
    const attacks = possibleAttacks.call(
      this,
      gameBoard.dimensions.width,
      gameBoard.dimensions.height
    );
    // Random item from attacks
    const attack = attacks[Math.floor(Math.random() * attacks.length)];

    const previousAttacks = [...this.previousAttacks, attack];
    const player = { ...this, previousAttacks };
    gameBoard = gameBoard.receiveAttack(attack.x, attack.y);

    return [player, gameBoard];
  };

  return { previousAttacks: [], placeInitialShips, makeAttack };
};

export { createComputerPlayer };
