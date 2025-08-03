import { useEffect, useState } from 'react';
import { db, ref, onValue } from '../firebase';
import type { Player } from '../types/Player';
import { getColourHex } from '../utils/colourToHex';
import { FaTrophy, FaSkullCrossbones, FaGamepad } from 'react-icons/fa';

export default function Scoreboard() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const playersRef = ref(db, 'players');
    return onValue(playersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const loaded: Player[] = Object.entries(data).map(([id, val]) => {
        const p = val as Omit<Player, 'id'>;
        const gamesWon = p.gamesWon || 0;
        const gamesLost = p.gamesLost || 0;
        return {
          id,
          name: p.name,
          colour: p.colour,
          gamesWon,
          gamesLost,
          gamesPlayed: gamesWon + gamesLost,
        };
      });
      setPlayers(loaded);
    });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 font-sans">
      <h1 className="text-5xl mb-6 font-bold text-center tracking-wide text-purple-400 drop-shadow-lg">
        🏆 Scoreboard
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-4">
          <thead>
            <tr>
              <th className="p-4 text-center">#</th>
              <th className="p-4 text-center">Name</th>
              <th className="p-4 text-center">Win Rate</th>
              <th className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <FaGamepad /> Played
                </div>
              </th>
              <th className="p-4 text-center text-green-400">
                <div className="flex items-center justify-center gap-2">
                  <FaTrophy /> Won
                </div>
              </th>
              <th className="p-4 text-center text-red-500">
                <div className="flex items-center justify-center gap-2">
                  <FaSkullCrossbones /> Lost
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {players
              .sort((a, b) => {
                const aRate = a.gamesPlayed ? a.gamesWon / a.gamesPlayed : 0;
                const bRate = b.gamesPlayed ? b.gamesWon / b.gamesPlayed : 0;
                return bRate - aRate;
              })
              .map((p, index) => {
                const rank = index + 1;

                // Special classes for top 3
                const rankStyles: { [key: string]: string } = {
                  1: 'border-2 border-yellow-400 bg-yellow-500/10 shadow-yellow-500/50',
                  2: 'border-2 border-gray-400 bg-gray-500/10 shadow-gray-400/50',
                  3: 'border-2 border-amber-700 bg-amber-700/10 shadow-amber-700/50',
                };

                const medal =
                  {
                    1: '🥇',
                    2: '🥈',
                    3: '🥉',
                  }[rank] || `#${rank}`;

                return (
                  <tr
                    key={p.id}
                    className={`text-2xl shadow-md hover:bg-zinc-700 text-center ${
                      rankStyles[String(rank)] || 'bg-zinc-800/60'
                    }`}
                  >
                    <td className="p-4 font-bold text-3xl">{medal}</td>

                    <td className="p-4">
                      <span
                        className="inline-block px-4 py-2 rounded-md font-mono text-lg shadow-inner uppercase tracking-wide text-white w-full"
                        style={{
                          backgroundColor: `${getColourHex(p.colour)}cc`,
                        }}
                        title={`Player colour: ${p.colour}`}
                      >
                        {p.name}
                      </span>
                    </td>

                    <td className="p-4 text-center font-semibold">
                      {p.gamesPlayed
                        ? `${((p.gamesWon / p.gamesPlayed) * 100).toFixed(1)}%`
                        : '0%'}
                    </td>

                    <td className="p-4 text-center">{p.gamesPlayed}</td>

                    <td className="p-4 text-center text-green-400 font-semibold">
                      {p.gamesWon} 🏆
                    </td>

                    <td className="p-4 text-center text-red-500 font-semibold">
                      {p.gamesLost} 💀
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
