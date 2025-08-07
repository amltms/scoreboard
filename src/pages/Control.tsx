import { useState } from 'react';
import { db, ref, set, push, remove } from '../firebase';
import type { Player } from '../types/Player';
import { getColourHex } from '../utils/colourToHex';
import Nav from '../components/Nav/Nav';
import GameForm from '../components/GameForm/GameForm';
import type { Game } from '../types/Game';

const COLOURS = ['blue', 'red', 'purple', 'gray', 'green', 'orange'];

export default function Control({
  players,
  games,
}: {
  players: Player[];
  games: Game[];
}) {
  const [name, setName] = useState('');
  const [colour, setColour] = useState(COLOURS[0]);

  const addPlayer = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newRef = push(ref(db, 'players'));
    set(newRef, {
      name: trimmed,
      colour,
      gamesWon: 0,
      gamesLost: 0,
    });
    setName('');
    setColour(COLOURS[0]);
  };

  const removePlayer = (id: string) => remove(ref(db, `players/${id}`));

  return (
    <div className="min-h-screen bg-zinc-900 text-white px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <Nav />
        <h1 className="mt-4 text-3xl font-bold mb-6 text-center text-purple-400 drop-shadow-lg">
          Players
        </h1>

        {/* Player Form */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Player Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded bg-zinc-800 px-4 py-2 border border-zinc-700 placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
          />
          <select
            value={colour}
            onChange={(e) => setColour(e.target.value)}
            className="rounded bg-zinc-800 px-4 py-2 border border-zinc-700 focus:border-purple-500 focus:outline-none"
          >
            {COLOURS.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={addPlayer}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-semibold"
          >
            Add Player
          </button>
        </div>

        {/* Players Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-zinc-800 text-xs uppercase text-white tracking-wide text-center">
                <th className="py-3 px-2">Player</th>
                <th className="py-3 px-2">ELO</th>
                <th className="py-3 px-2">Won</th>
                <th className="py-3 px-2">Lost</th>
                <th className="py-3 px-2">Win %</th>
                <th className="py-3 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => {
                const total = p.gamesWon + p.gamesLost;
                const winRate = total
                  ? ((p.gamesWon / total) * 100).toFixed(1)
                  : '–';

                return (
                  <tr
                    key={p.id}
                    className="border-t border-zinc-700 text-center"
                  >
                    <td
                      className="py-3 px-2 font-mono uppercase truncate"
                      style={{ backgroundColor: `${getColourHex(p.colour)}cc` }}
                    >
                      {p.name}
                    </td>
                    <td className="py-3 px-2 font-bold">{p.elo ?? '—'}</td>
                    <td className="py-3 px-2">{p.gamesWon}</td>
                    <td className="py-3 px-2">{p.gamesLost}</td>
                    <td className="py-3 px-2">{winRate}%</td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => removePlayer(p.id)}
                        className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded text-sm font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <GameForm games={games} />
      </div>
    </div>
  );
}
