import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Player } from '../types/Player';
import { getColourHex } from '../utils/colourToHex';
import { FaTrophy, FaSkullCrossbones, FaGamepad } from 'react-icons/fa';
import confetti from 'canvas-confetti';

type Props = {
  players: Player[];
};

export default function Scoreboard({ players }: Props) {
  const prevPlayersRef = useRef<Player[]>([]);

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

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white p-6 font-sans">
      <h1 className="text-5xl mb-8 font-bold text-center tracking-wide text-purple-400 drop-shadow-lg">
        🏆 Scoreboard
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-4">
          <thead>
            <tr className="text-lg text-zinc-300 uppercase tracking-wider">
              <th className="p-4 text-center">#</th>
              <th className="p-4 text-center">Name</th>
              <th className="p-4 text-center">ELO</th>
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
              .sort((a, b) => b.elo - a.elo)
              .map((p, index) => {
                const rank = index + 1;
                const rankStyles: { [key: string]: string } = {
                  1: 'border-2 border-yellow-400 bg-yellow-500/15 shadow-yellow-500/60',
                  2: 'border-2 border-gray-400 bg-gray-500/25 shadow-gray-400/60',
                  3: 'border-2 border-amber-700 bg-amber-700/15 shadow-amber-700/60',
                };

                return (
                  <tr
                    key={p.id}
                    className={`text-2xl shadow-lg text-center ${
                      rankStyles[String(rank)] || 'bg-zinc-800/60'
                    }`}
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
                    <td className="p-4 text-center font-bold">
                      {p.elo ?? 1000}
                      {p.eloDelta !== undefined && p.eloDelta !== 0 && (
                        <span
                          className={`ml-2 font-semibold ${
                            p.eloDelta > 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          ({p.eloDelta > 0 ? '+' : ''}
                          {p.eloDelta})
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center font-semibold">
                      {p.gamesWon + p.gamesLost > 0
                        ? `${(
                            (p.gamesWon / (p.gamesWon + p.gamesLost)) *
                            100
                          ).toFixed(1)}%`
                        : '0%'}
                    </td>
                    <td className="p-4 text-center">
                      {p.gamesWon + p.gamesLost}
                    </td>
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
