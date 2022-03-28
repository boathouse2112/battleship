import clsx from 'clsx';
import { useState } from 'react';
import { CellState, Coord, createGameBoard } from '../factories/gameBoard';
import Cell from './Cell';

function GameBoard(props: {
  width: number;
  height: number;
  getCellState(coord: Coord): CellState;
}) {
  const generateCellClasses = (coord: Coord) => {
    const classes = ['cell'];
    const { shipState, attackState } = props.getCellState(coord);
    return clsx(classes, shipState, attackState);
  };

  const generateCells = () => {
    const cells = [];
    for (let x = 0; x < props.width; x++) {
      for (let y = 0; y < props.height; y++) {
        const cellClasses = generateCellClasses({ x, y });
        const cell = (
          <Cell
            key={`${x}:${y}`}
            className={cellClasses}
            handleCellClick={() => {}}
          />
        );
        cells.push(cell);
      }
    }
    return cells;
  };

  return <div className="game-board">{generateCells()}</div>;
}

export default GameBoard;
