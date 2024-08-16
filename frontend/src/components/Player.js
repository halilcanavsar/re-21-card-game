import React from 'react';

function Player({
  name,
  health,
  onDrawCard,
  onPlayTrumpCard,
  onStand,
  playerId,
  cards = [],
  trumpCards = [],
}) {
  return (
    <div className="player">
      <h2>{name}</h2>
      <p>Health: {health}</p>
      <button onClick={() => onDrawCard(playerId)}>Draw Card</button>
      <button onClick={onStand}>Stand</button>
      <div className="cards">
        <h3>Your Cards:</h3>
        {cards.map((card, index) => (
          <div key={index} className="card">
            {card.label}
          </div>
        ))}
      </div>
      <div className="trump-cards">
        <h3>Your Trump Cards:</h3>
        {trumpCards.map((trumpCard, index) => (
          <button key={index} onClick={() => onPlayTrumpCard(trumpCard)}>
            {trumpCard.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Player;
