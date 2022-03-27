import { GameBoard } from './gameBoard';

export interface Player {
  makeAttack(gameBoard: GameBoard): void;
}
