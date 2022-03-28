import { MouseEventHandler } from 'react';
import { Coord } from '../factories/gameBoard';

function Cell(props: {
  className: string;
  coord: Coord;
  handleCellClick(coord: Coord): void;
}) {
  return (
    <div
      className={props.className}
      onClick={() => props.handleCellClick(props.coord)}
    ></div>
  );
}

export default Cell;
