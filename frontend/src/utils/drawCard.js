import { deck } from './deck';

const drawCard = (hand) => {
  const newCard = deck[Math.floor(Math.random() * deck.length)];
  return [...hand, newCard]; // original hand array remains unchanged
};

export default drawCard;
