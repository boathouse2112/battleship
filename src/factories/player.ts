import { Coord, GameBoard } from './gameBoard';

export interface Player {
  previousAttacks: Coord[];
  makeAttack(gameBoard: GameBoard): [Player, GameBoard];
}
