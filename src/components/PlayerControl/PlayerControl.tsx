import { useState } from 'react';
import { db, ref, set, push, remove } from '../../firebase';
import type { Player } from '../../types/Player';
import { getColourHex } from '../../utils/colourToHex';
const COLOURS = ['blue', 'red', 'purple', 'gray', 'green', 'orange'];

export default function PlayerControl({ players }: { players: Player[] }) {
  const [newName, setNewName] = useState('');
  const [newColour, setNewColour] = useState(COLOURS[0]);
  const addPlayer = () => {
    if (!newName.trim()) return;
    const playersRef = ref(db, 'players');
    const newPlayerRef = push(playersRef);
    set(newPlayerRef, {
      name: newName.trim(),
      colour: newColour,
      gamesWon: 0,
      gamesLost: 0,
    });
    setNewName('');
    setNewColour(COLOURS[0]);
  };

  const deletePlayer = (id: string) => {
    const playerRef = ref(db, `players/${id}`);
    remove(playerRef);
  };

  return (
    <div className="w-full overflow-x-auto">
      {/* Add Player */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="New player name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-grow rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition"
        />
        <select
          value={newColour}
          onChange={(e) => setNewColour(e.target.value)}
          className="rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition"
        >
          {COLOURS.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
        <button
          onClick={addPlayer}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md font-semibold transition"
        >
          Add Player
        </button>
      </div>
      <table className="w-full min-w-[320px] border-collapse rounded-lg overflow-hidden bg-zinc-900 shadow-md">
        <thead>
          <tr className="bg-zinc-800">
            <th className="py-3 px-4 text-left text-sm font-semibold text-white uppercase tracking-wide">
              Player
            </th>
            <th className="py-3 px-4 text-center text-sm font-semibold text-white uppercase tracking-wide w-32">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr
              key={player.id}
              className="border-b border-gray-700 transition-colors cursor-pointer last:border-none"
            >
              <td
                className="py-3 px-4 font-mono text-white uppercase tracking-wide"
                style={{ backgroundColor: `${getColourHex(player.colour)}cc` }}
              >
                {player.name}
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => deletePlayer(player.id)}
                  aria-label={`Remove player ${player.name}`}
                  className="bg-red-700 hover:bg-red-800 active:bg-red-900 text-white px-4 py-1 rounded font-semibold transition-colors"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
