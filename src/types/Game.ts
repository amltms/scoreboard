export type Game = {
  id: string;
  name: string;
  type?: string;
};

export type GameStats = {
  bayesAlpha: number;
  bayesBeta: number;
  bayesWinRate: number;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
};

export type Match = {
  id?: string; // optional, Firebase key
  timestamp: number; // epoch milliseconds
  players: string[]; // array of player IDs
  winner: string; // player ID of the winner
  gameId: string; // ID of the game played
};
