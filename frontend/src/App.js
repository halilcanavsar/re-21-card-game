import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import socket from './socket';

function App() {
  const [player1Health, setPlayer1Health] = useState(10);
  const [player2Health, setPlayer2Health] = useState(10);
  const [currentBet, setCurrentBet] = useState(1);
  const [player1Cards, setPlayer1Cards] = useState([]);
  const [player2Cards, setPlayer2Cards] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');

  useEffect(() => {
    socket.on('updatePlayerCards', ({ player1Cards, player2Cards }) => {
      setPlayer1Cards(player1Cards);
      setPlayer2Cards(player2Cards);
    });

    socket.on('roundEnd', ({ player1Health, player2Health, currentBet }) => {
      setPlayer1Health(player1Health);
      setPlayer2Health(player2Health);
      setCurrentBet(currentBet);
    });

    socket.on('gameOver', ({ winner }) => {
      setGameOver(true);
      setWinner(winner);
    });

    return () => {
      socket.off('updatePlayerCards');

      socket.off('roundEnd');
      socket.off('gameOver');
    };
  }, []);

  const handleDrawCard = (player) => {
    socket.emit('drawCard', player);
  };

  const handleStand = () => {
    socket.emit('stand');
  };

  const handlePlayTrumpCard = (trumpCard, card) => {
    socket.emit('useTrumpCard', { player: trumpCard.player, trumpCard, card });
  };

  if (gameOver) {
    return <h1>Game Over! {winner} wins!</h1>;
  }

  return (
    <div className="App">
      <h1>21 Card Game</h1>
      <GameBoard
        player1Health={player1Health}
        player2Health={player2Health}
        currentBet={currentBet}
        onDrawCard={handleDrawCard}
        onPlayTrumpCard={handlePlayTrumpCard}
        onStand={handleStand}
        player1Cards={player1Cards}
        player2Cards={player2Cards}
      />
    </div>
  );
}

export default App;
