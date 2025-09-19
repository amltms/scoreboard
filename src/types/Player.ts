// Stats specific to one game
export type PlayerGameStats = {
  bayesAlpha: number; // Prior wins + actual wins
  bayesBeta: number; // Prior losses + actual losses
  bayesWinRate: number; // Derived from alpha / (alpha + beta)
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
};

// Player record, now keyed by gameId for per-game stats
export type Player = {
  id: string;
  name: string;
  colour: string;
  games: {
    [gameId: string]: PlayerGameStats;
  };
};
