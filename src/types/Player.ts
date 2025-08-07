export type Player = {
  id: string;
  name: string;
  colour: string;
  gamesWon: number;
  gamesLost: number;
  elo: number; // <-- Add this
  eloDelta?: number;
};
