import React from 'react';

function BetDisplay({ currentBet }) {
  return (
    <div className="bet-display">
      <h3>Current Bet: {currentBet}</h3>
    </div>
  );
}

export default BetDisplay;
