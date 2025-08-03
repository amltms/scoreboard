import { useState, useEffect } from 'react';
import { db, ref, onValue, set, push, update, remove } from '../firebase';
import type { Player } from '../types/Player';
import { Link } from 'react-router-dom';
import { getColourHex } from '../utils/colourToHex';

const COLOURS = ['blue', 'red', 'purple', 'gray', 'green', 'orange'];

export default function ControlPanel() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newName, setNewName] = useState('');
  const [newColour, setNewColour] = useState(COLOURS[0]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [winnerId, setWinnerId] = useState<string>('');

  useEffect(() => {
    const playersRef = ref(db, 'players');
    return onValue(playersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const loaded: Player[] = Object.entries(data).map(([id, val]) => {
        const p = val as Omit<Player, 'id'>;
        return {
          id,
          name: p.name,
          colour: p.colour,
          gamesWon: p.gamesWon,
          gamesLost: p.gamesLost,
        };
      });
      setPlayers(loaded);
    });
  }, []);

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

  const toggleSelected = (id: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const submitGame = () => {
    if (!winnerId || !selectedPlayers.includes(winnerId)) return;

    // Update player stats
    selectedPlayers.forEach((id) => {
      const player = players.find((p) => p.id === id);
      if (!player) return;
      const playerRef = ref(db, `players/${id}`);
      const won = id === winnerId;
      update(playerRef, {
        gamesWon: player.gamesWon + (won ? 1 : 0),
        gamesLost: player.gamesLost + (won ? 0 : 1),
      });
    });

    // Add match to history
    const gamesRef = ref(db, 'games');
    const newGameRef = push(gamesRef);
    set(newGameRef, {
      timestamp: Date.now(),
      players: selectedPlayers,
      winner: winnerId,
    });

    // Reset UI selections
    setSelectedPlayers([]);
    setWinnerId('');
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white mx-auto">
      <div className="p-6 max-w-3xl mx-auto">
        <Link
          to="/"
          className="self-start text-zinc-400 hover:text-purple-400 font-semibold"
        >
          ← Back to Scoreboard
        </Link>

        <h1 className="mt-4 text-3xl font-bold mb-6 text-center text-purple-400 drop-shadow-lg">
          Control Panel
        </h1>

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

        {/* Game Setup */}
        <div className="bg-zinc-800 rounded-lg p-6 shadow-lg mb-10">
          <h2 className="text-xl font-bold mb-4">New Game</h2>
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto mb-4">
            {players.map((p) => (
              <label key={p.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedPlayers.includes(p.id)}
                  onChange={() => toggleSelected(p.id)}
                  className="accent-purple-500"
                />
                <span
                  className="px-3 py-1 rounded-md font-mono text-sm text-white w-fit"
                  style={{
                    backgroundColor: `${getColourHex(p.colour)}cc`,
                  }}
                >
                  {p.name}
                </span>
              </label>
            ))}
          </div>

          <select
            className="w-full mb-4 rounded-md bg-zinc-700 px-4 py-2 text-white"
            value={winnerId}
            onChange={(e) => setWinnerId(e.target.value)}
          >
            <option value="">Select Winner</option>
            {selectedPlayers.map((id) => {
              const player = players.find((p) => p.id === id);
              if (!player) return null;
              return (
                <option key={id} value={id}>
                  {player.name}
                </option>
              );
            })}
          </select>

          <button
            disabled={!winnerId || selectedPlayers.length < 2}
            onClick={submitGame}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-40 py-3 rounded-md text-white font-semibold"
          >
            Submit Game Result
          </button>
        </div>

        {/* Player Cards */}
        <div className="grid gap-5 sm:grid-cols-2">
          {players.map((player) => (
            <div
              key={player.id}
              className="bg-zinc-800 rounded-xl p-6 shadow-lg flex flex-col gap-4"
            >
              <span
                className="inline-block px-4 py-2 rounded-md font-mono text-lg shadow-inner uppercase tracking-wide text-white text-center"
                style={{
                  backgroundColor: `${getColourHex(player.colour)}cc`,
                }}
              >
                {player.name}
              </span>

              <div className="flex justify-between text-lg">
                <div>
                  <div className="text-zinc-400 text-sm uppercase">Wins</div>
                  <div className="font-bold text-white text-xl">
                    {player.gamesWon}
                  </div>
                </div>
                <div>
                  <div className="text-zinc-400 text-sm uppercase">Losses</div>
                  <div className="font-bold text-white text-xl">
                    {player.gamesLost}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() =>
                    update(ref(db, `players/${player.id}`), {
                      gamesWon: player.gamesWon + 1,
                    })
                  }
                  className="flex-grow bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold"
                >
                  + Win
                </button>
                <button
                  onClick={() =>
                    update(ref(db, `players/${player.id}`), {
                      gamesLost: player.gamesLost + 1,
                    })
                  }
                  className="flex-grow bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-semibold"
                >
                  + Loss
                </button>
              </div>

              <button
                onClick={() => deletePlayer(player.id)}
                className="bg-red-700 hover:bg-red-800 text-white py-3 rounded w-full font-semibold"
              >
                Remove Player
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
