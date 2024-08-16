const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

let deck = [];
let player1Cards = [];
let player2Cards = [];
let player1TrumpCards = [];
let player2TrumpCards = [];
let player1Health = 10;
let player2Health = 10;
let currentBet = 1;

const shuffleDeck = () => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
};

const initializeDeck = () => {
  deck = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10' },
    { value: 11, label: '11' },
  ];
  shuffleDeck();
};

const calculateHandValue = (cards) => {
  return cards.reduce((total, card) => total + card.value, 0);
};

const determineRoundWinner = () => {
  const player1Total = calculateHandValue(player1Cards);
  const player2Total = calculateHandValue(player2Cards);

  if (player1Total > 21) return 'player2';
  if (player2Total > 21) return 'player1';

  return player1Total > player2Total ? 'player1' : 'player2';
};

const endRound = () => {
  const winner = determineRoundWinner();
  if (winner === 'player1') {
    player2Health -= currentBet;
  } else if (winner === 'player2') {
    player1Health -= currentBet;
  }

  if (player1Health <= 0 || player2Health <= 0) {
    io.emit('gameOver', {
      winner: winner === 'player1' ? 'Player 1' : 'Player 2',
    });
  } else {
    io.emit('roundEnd', { player1Health, player2Health, currentBet });
    player1Cards = [];
    player2Cards = [];
    currentBet += 1;
  }
};

initializeDeck();

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('drawCard', (player) => {
    if (deck.length > 0) {
      const drawnCard = deck.pop();
      if (player === 'player1') {
        player1Cards.push(drawnCard);
      } else {
        player2Cards.push(drawnCard);
      }
      io.emit('updatePlayerCards', { player1Cards, player2Cards });
    }
  });

  socket.on('stand', () => {
    if (player1Cards.length > 0 && player2Cards.length > 0) {
      endRound();
    }
  });

  socket.on('useTrumpCard', ({ player, trumpCard, card }) => {
    switch (trumpCard) {
      case 'trumpSwitch':
        [player1Cards, player2Cards] = [player2Cards, player1Cards];
        break;
      case 'trumpShield':
        socket.emit('applyShield', { player });
        break;
      case 'trumpPlus':
        if (player === 'player1') {
          player1Cards.push({ value: 1, label: '+1' });
        } else {
          player2Cards.push({ value: 1, label: '+1' });
        }
        break;
      case 'trumpMinus':
        if (player === 'player1') {
          player1Cards.push({ value: -1, label: '-1' });
        } else {
          player2Cards.push({ value: -1, label: '-1' });
        }
        break;
      case 'trumpDouble':
        if (player === 'player1') {
          const totalValue = calculateHandValue(player1Cards);
          player1Cards.push({ value: totalValue, label: 'x2' });
        } else {
          const totalValue = calculateHandValue(player2Cards);
          player2Cards.push({ value: totalValue, label: 'x2' });
        }
        break;
      case 'trumpHalf':
        if (player === 'player1') {
          const totalValue = calculateHandValue(player2Cards);
          player2Cards.push({
            value: -Math.floor(totalValue / 2),
            label: 'Half',
          });
        } else {
          const totalValue = calculateHandValue(player1Cards);
          player1Cards.push({
            value: -Math.floor(totalValue / 2),
            label: 'Half',
          });
        }
        break;
      case 'trumpReturn':
        if (player === 'player1') {
          const returnedCard = player1Cards.pop();
          deck.push(returnedCard);
        } else {
          const returnedCard = player2Cards.pop();
          deck.push(returnedCard);
        }
        break;
      case 'trumpDesperation':
        if (player === 'player1') {
          const newCard = deck.pop();
          player2Cards.push(newCard);
        } else {
          const newCard = deck.pop();
          player1Cards.push(newCard);
        }
        break;
      case 'trumpGift':
        const giftedCard = deck.pop();
        if (player === 'player1') {
          player2Cards.push(giftedCard);
        } else {
          player1Cards.push(giftedCard);
        }
        break;
      case 'trumpExchange':
        if (player1Cards.length > 0 && player2Cards.length > 0) {
          const playerCard =
            player === 'player1' ? player1Cards.pop() : player2Cards.pop();
          const opponentCard =
            player === 'player1' ? player2Cards.pop() : player1Cards.pop();

          if (player === 'player1') {
            player1Cards.push(opponentCard);
            player2Cards.push(playerCard);
          } else {
            player2Cards.push(opponentCard);
            player1Cards.push(playerCard);
          }
        }
        break;
      case 'trumpCopy':
        const copiedCard =
          player === 'player1' ? player2TrumpCards[0] : player1TrumpCards[0];
        if (player === 'player1') {
          player1TrumpCards.push(copiedCard);
        } else {
          player2TrumpCards.push(copiedCard);
        }
        break;
      case 'trumpDestroy':
        if (player === 'player1') {
          player2TrumpCards = player2TrumpCards.slice(1);
        } else {
          player1TrumpCards = player1TrumpCards.slice(1);
        }
        break;
    }

    io.emit('updatePlayerCards', { player1Cards, player2Cards });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});
