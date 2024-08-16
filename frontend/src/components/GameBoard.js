import React from 'react';
import Player from './Player';
import BetDisplay from './BetDisplay';

function calculateHandValue(cards) {
  return cards.reduce((total, card) => total + card.value, 0);
}

function determineWinner(player1Cards, player2Cards) {
  const player1Total = calculateHandValue(player1Cards);
  const player2Total = calculateHandValue(player2Cards);

  if (player1Total > 21) return 'Player 2 is winning';
  if (player2Total > 21) return 'Player 1 is winning';

  if (player1Total === player2Total) return "It's a tie";
  return player1Total > player2Total
    ? 'Player 1 is winning'
    : 'Player 2 is winning';
}

function GameBoard({
  player1Health,
  player2Health,
  currentBet,
  onDrawCard,
  onPlayTrumpCard,
  onStand,
  player1Cards,
  player2Cards,
}) {
  const winner = determineWinner(player1Cards, player2Cards);

  return (
    <div className="game-board">
      <BetDisplay currentBet={currentBet} />
      <h3>{winner}</h3>
      <div className="players">
        <Player
          name="Player 1"
          health={player1Health}
          onDrawCard={onDrawCard}
          onPlayTrumpCard={onPlayTrumpCard}
          onStand={onStand}
          playerId="player1"
          cards={player1Cards}
        />
        <Player
          name="Player 2"
          health={player2Health}
          onDrawCard={onDrawCard}
          onPlayTrumpCard={onPlayTrumpCard}
          onStand={onStand}
          playerId="player2"
          cards={player2Cards}
        />
      </div>
    </div>
  );
}

export default GameBoard;
