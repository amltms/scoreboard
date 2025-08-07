import { useState, useEffect } from 'react';
import { db, ref, onValue } from '../../firebase';
import type { Player } from '../../types/Player';
import type { Game, Match } from '../../types/Game';
import { getColourHex } from '../../utils/colourToHex';

type MatchHistoryProps = {
  players: Player[];
  games: Game[];
};

function MatchHistory({ players, games }: MatchHistoryProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const playerMap = Object.fromEntries(players.map((p) => [p.id, p]));
  const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));

  useEffect(() => {
    const unsub = onValue(ref(db, 'matches'), (snap) => {
      const data = snap.val() || {};
      const loaded = Object.entries(data).map(([id, val]) => ({
        id,
        ...(val as Omit<Match, 'id'>),
      }));
      setMatches(loaded.reverse());
    });

    return () => unsub();
  }, []);

  return (
    <div className="bg-zinc-800/90 rounded-lg p-6 mt-6 max-w-3xl mx-auto text-white shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">
        Match History
      </h2>
      <ul className="space-y-6 max-h-[600px] overflow-y-auto">
        {matches.map(({ id, timestamp, players: pids, winner, gameId }) => {
          const gameName = gameMap[gameId]?.name || 'Unknown Game';

          // Winner first, others next
          const orderedPids = [
            winner,
            ...pids.filter((pid) => pid !== winner),
          ].filter(Boolean);

          return (
            <li key={id} className="bg-zinc-900/40 rounded-lg p-5">
              <div className="flex justify-between items-center mb-3">
                <time
                  dateTime={new Date(timestamp).toISOString()}
                  className="text-sm text-zinc-400"
                >
                  {new Date(timestamp).toLocaleString()}
                </time>
                <span className="text-xl font-semibold text-purple-300 max-w-[60%] truncate">
                  {gameName}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                {orderedPids.length > 0 ? (
                  orderedPids.map((pid) => {
                    const player = playerMap[pid];
                    const isWinner = pid === winner;
                    return (
                      <span
                        key={pid}
                        title={`Player colour: ${player?.colour || 'unknown'}`}
                        className={`inline-block px-4 py-1 rounded-full font-mono text-base truncate max-w-[180px] border-2 ${
                          isWinner
                            ? 'border-white text-white font-semibold'
                            : 'border-transparent'
                        }`}
                        style={{
                          backgroundColor: player
                            ? `${getColourHex(player.colour)}cc`
                            : '#444',
                        }}
                      >
                        {player?.name.toUpperCase() || 'Unknown'}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-zinc-500 italic">
                    No players recorded
                  </span>
                )}
              </div>

              <div className="text-green-400 font-semibold text-lg">
                Winner: {playerMap[winner]?.name || 'Unknown'}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default MatchHistory;
