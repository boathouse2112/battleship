import React, { useState } from 'react';
import GameBoard from './components/GameBoard';
import './App.css';
import { createGameBoard } from './factories/gameBoard';
import { createComputerPlayer } from './factories/computerPlayer';

const GAME_BOARD_WIDTH = 7;
const GAME_BOARD_HEIGHT = 7;

function App() {
  const [computer, setComputer] = useState(createComputerPlayer());

  const [playerBoard, setPlayerBoard] = useState(() => {
    console.log(computer);
    const gameBoard = createGameBoard(GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT);
    return computer.placeInitialShips(gameBoard);
  });

  const [computerBoard, setComputerboard] = useState(() => {
    const gameBoard = createGameBoard(GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT);
    return computer.placeInitialShips(gameBoard);
  });

  return (
    <div className="container">
      <div className="header"></div>
      <div className="player-board">
        <GameBoard
          width={GAME_BOARD_WIDTH}
          height={GAME_BOARD_HEIGHT}
          getCellState={(coord) => playerBoard.getCellState(coord)}
        />
      </div>
      <div className="computer-board">
        <GameBoard
          width={GAME_BOARD_WIDTH}
          height={GAME_BOARD_HEIGHT}
          getCellState={(coord) => computerBoard.getCellState(coord)}
        />
      </div>
    </div>
  );
}

export default App;
