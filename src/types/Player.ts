export interface Player {
  id: string;
  name: string;
  colour: string;
  gamesWon: number;
  gamesLost: number;
  gamesPlayed?: number;
}
