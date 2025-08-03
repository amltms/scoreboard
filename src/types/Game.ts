export type Game = {
  id?: string; // optional, Firebase key
  timestamp: number; // epoch milliseconds
  players: string[]; // array of player IDs
  winner: string; // player ID of the winner
};
