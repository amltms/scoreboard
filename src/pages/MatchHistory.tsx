import { useState, useEffect } from 'react';
import { db, ref, onValue } from '../firebase';
import type { Player } from '../types/Player';
import type { Game } from '../types/Game';
import { Link } from 'react-router-dom';

function MatchHistory() {
  const [games, setGames] = useState<Game[]>([]);
  const [playersMap, setPlayersMap] = useState<Record<string, Player>>({});

  useEffect(() => {
    // Load players once to map IDs to names
    const playersRef = ref(db, 'players');
    onValue(playersRef, (snapshot) => {
      const data = snapshot.val() as Record<string, Omit<Player, 'id'>> | null;
      const map: Record<string, Player> = {};
      if (data) {
        Object.entries(data).forEach(([id, val]) => {
          map[id] = { id, ...val };
        });
      }
      setPlayersMap(map);
    });

    // Load games history
    const gamesRef = ref(db, 'games');
    onValue(gamesRef, (snapshot) => {
      const data = snapshot.val() as Record<string, Omit<Game, 'id'>> | null;
      const loaded: Game[] = [];
      if (data) {
        for (const [id, val] of Object.entries(data)) {
          loaded.push({ id, ...val });
        }
      }
      setGames(loaded.reverse()); // most recent first
    });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 font-sans">
      <div className="flex justify-between">
        <Link
          to="/scoreboard"
          className="text-zinc-400 hover:text-purple-400 font-semibold"
        >
          Scoreboard
        </Link>
        <Link
          to="/control"
          className="text-zinc-400 hover:text-purple-400 font-semibold"
        >
          Control
        </Link>
      </div>
      <div className="bg-zinc-800/80 rounded-lg p-6 mt-6 max-w-3xl mx-auto text-white">
        <h2 className="text-2xl font-bold mb-4">Match History</h2>
        <ul className="space-y-4 max-h-96 overflow-y-auto">
          {games.map((game) => {
            const date = new Date(game.timestamp).toLocaleString();
            return (
              <li
                key={game.id}
                className="border border-zinc-700 rounded-lg p-3"
              >
                <div className="mb-1 text-sm text-zinc-400">{date}</div>
                <div>
                  Players:{' '}
                  {game.players.map((pid: string) => (
                    <span
                      key={pid}
                      className={`inline-block px-2 py-1 mr-2 rounded ${
                        pid === game.winner
                          ? 'bg-green-600 font-bold'
                          : 'bg-zinc-700'
                      }`}
                      title={playersMap[pid]?.name || pid}
                    >
                      {playersMap[pid]?.name || 'Unknown'}
                    </span>
                  ))}
                </div>
                <div className="mt-1 text-green-400 font-semibold">
                  Winner: {playersMap[game.winner]?.name || 'Unknown'}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default MatchHistory;
