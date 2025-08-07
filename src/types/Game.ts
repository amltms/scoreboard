export type Game = {
  id: string;
  name: string;
  type?: string;
};

export type Match = {
  id?: string; // optional, Firebase key
  timestamp: number; // epoch milliseconds
  players: string[]; // array of player IDs
  winner: string; // player ID of the winner
  gameId: string; // ID of the game played
};
