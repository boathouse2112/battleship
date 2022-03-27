import Cell from './Cell';

const GAME_BOARD_WIDTH = 7;
const GAME_BOARD_HEIGHT = 7;

function GameBoard() {
  const generateCells = () => {
    const cells = [];
    for (let x = 0; x < GAME_BOARD_WIDTH; x++) {
      for (let y = 0; y < GAME_BOARD_HEIGHT; y++) {
        const cell = <Cell />;
        cells.push(cell);
      }
    }
    return cells;
  };

  return <div className="game-board">{generateCells()}</div>;
}

export default GameBoard;
