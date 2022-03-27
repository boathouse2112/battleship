import { Coord, GameBoard } from './gameBoard';

const computerPlayer = (function () {
  const previousAttacks: Coord[] = [];

  const possibleAttacks = function (width: number, height: number) {
    const attacks = [];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const attack = { x, y };
        if (!previousAttacks.includes(attack)) {
          attacks.push(attack);
        }
      }
    }
    return attacks;
  };
  /**
   * Makes a random in-bounds attack that has not already been made.
   */
  const makeAttack = function (gameBoard: GameBoard) {
    const attacks = possibleAttacks(
      gameBoard.dimensions.width,
      gameBoard.dimensions.height
    );
    // Random item from attacks
    const attack = attacks[Math.floor(Math.random() * attacks.length)];

    gameBoard.receiveAttack(attack.x, attack.y);
    previousAttacks.push(attack);
  };

  return { makeAttack };
})();

export { computerPlayer };
