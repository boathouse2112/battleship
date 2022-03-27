import { GameBoard } from './gameBoard';
import { Player } from './player';

const computerPlayer = (function () {
  const possibleAttacks = function (
    this: Player,
    width: number,
    height: number
  ) {
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

  return { previousAttacks: [], makeAttack };
})();

export { computerPlayer };
