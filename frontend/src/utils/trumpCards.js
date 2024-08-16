export const trumpCards = [
  {
    id: 'trumpSwitch',
    name: 'Trump Switch',
    description: "Switches your hand with the opponent's hand.",
    effect: (playerCards, setPlayerCards, opponentCards, setOpponentCards) => {
      const temp = [...playerCards];
      setPlayerCards([...opponentCards]);
      setOpponentCards([...temp]);
    },
  },
  {
    id: 'trumpShield',
    name: 'Trump Shield',
    description: 'Prevents you from losing health in the next round.',
    effect: (setPlayerShield) => {
      setPlayerShield(true);
    },
  },
  {
    id: 'trumpPlus',
    name: 'Trump Plus',
    description: 'Adds +1 to your current hand total.',
    effect: (playerCards, setPlayerCards) => {
      const newCard = { value: 1, label: '+1' };
      setPlayerCards([...playerCards, newCard]);
    },
  },
];
