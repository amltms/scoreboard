import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Player } from '../types/Player';
import { getColourHex } from '../utils/colourToHex';
import { FaTrophy, FaSkullCrossbones, FaGamepad } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import type { Game } from '../types/Game';

type Props = {
  players: Player[];
  games: Game[];
};

export default function Scoreboard({ players, games }: Props) {
  const prevPlayersRef = useRef<Player[]>([]);
  const [selectedGameId, setSelectedGameId] = useState('');

  useEffect(() => {
    if (games.length > 0 && !selectedGameId) {
      const catanGame = games.find((g) => g.name.toLowerCase() === 'catan');
      setSelectedGameId(catanGame?.id ?? games[0].id);
    }
  }, [games, selectedGameId]);

  useEffect(() => {
    if (prevPlayersRef.current.length && prevPlayersRef.current !== players) {
      triggerFireworks();
    }
    prevPlayersRef.current = players;
  }, [players]);

  const triggerFireworks = () => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
    };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const gameOptions = games.map((g) => (
    <option key={g.id} value={g.id}>
      {g.name}
    </option>
  ));

  const getStats = (p: Player) => {
    const stats = p.games?.[selectedGameId];
    if (!stats) return { winRate: 0, played: 0, won: 0, lost: 0 };

    return {
      winRate: stats.gamesPlayed ? stats.bayesWinRate : 0,
      played: stats.gamesPlayed,
      won: stats.gamesWon,
      lost: stats.gamesLost,
    };
  };

  // Sort by Bayesian win rate descending
  const sortedPlayers = [...players]
    .filter((p) => p.games?.[selectedGameId])
    .sort(
      (a, b) =>
        (b.games![selectedGameId]?.bayesWinRate ?? 0) -
        (a.games![selectedGameId]?.bayesWinRate ?? 0)
    );

  // Split players into "experienced" and "new"
  const [experienced, newcomers] = sortedPlayers.reduce(
    (acc: [Player[], Player[]], p) => {
      const stats = getStats(p);
      if (stats.played >= 3) acc[0].push(p);
      else acc[1].push(p);
      return acc;
    },
    [[], []]
  );

  const allPlayers = [...experienced, ...newcomers];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white p-6 font-sans">
      <h1 className="text-5xl mb-8 font-bold text-center tracking-wide text-purple-400 drop-shadow-lg">
        🏆 Scoreboard
      </h1>

      {/* Game selector */}
      <div className="mb-6 flex justify-center">
        <select
          value={selectedGameId}
          onChange={(e) => setSelectedGameId(e.target.value)}
          className="rounded bg-zinc-800 px-4 py-2 border border-zinc-700 focus:border-purple-500 focus:outline-none"
        >
          {gameOptions}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-4">
          <thead>
            <tr className="text-lg text-zinc-300 uppercase tracking-wider">
              <th className="p-4 text-center">#</th>
              <th className="p-4 text-center">Name</th>
              <th className="p-4 text-center">Win %</th>
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
            {allPlayers.map((p, index) => {
              const rank = index + 1;
              const stats = getStats(p);
              const rankStyles: { [key: string]: string } = {
                1: 'border-2 border-yellow-400 bg-yellow-500/15 shadow-yellow-500/60',
                2: 'border-2 border-gray-400 bg-gray-500/25 shadow-gray-400/60',
                3: 'border-2 border-amber-700 bg-amber-700/15 shadow-amber-700/60',
              };

              // Apply opacity for newcomers
              const opacityClass = stats.played < 3 ? 'opacity-50' : '';

              return (
                <tr
                  key={p.id}
                  className={`text-2xl shadow-lg text-center ${
                    rankStyles[String(rank)] || 'bg-zinc-800/60'
                  } ${opacityClass}`}
                >
                  <td className="p-4 font-bold text-3xl">{rank}</td>
                  <td className="p-4">
                    <Link
                      to={`/profile/${p.id}`}
                      title={`Player colour: ${p.colour}`}
                      style={{
                        backgroundColor: `${getColourHex(p.colour)}cc`,
                      }}
                      className="inline-block px-4 py-2 rounded-md font-mono text-lg shadow-inner uppercase tracking-wide text-white w-full hover:brightness-110 transition"
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td className="p-4 text-center font-semibold">
                    {(stats.winRate * 100).toFixed(1)}%
                  </td>
                  <td className="p-4 text-center">{stats.played}</td>
                  <td className="p-4 text-center text-green-400 font-semibold">
                    {stats.won} 🏆
                  </td>
                  <td className="p-4 text-center text-red-500 font-semibold">
                    {stats.lost} 💀
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
