import { MouseEventHandler } from 'react';

function Cell(props: {
  className: string;
  handleCellClick: MouseEventHandler;
}) {
  return (
    <div className={props.className} onClick={props.handleCellClick}></div>
  );
}

export default Cell;
