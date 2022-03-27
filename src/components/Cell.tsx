import { MouseEventHandler } from 'react';

function Cell(props: { handleCellClick: MouseEventHandler }) {
  return <div className="cell" onClick={props.handleCellClick}></div>;
}

export default Cell;
