import { useState } from 'react';
import { db, ref, set, push, remove } from '../../firebase';
import type { Game } from '../../types/Game';

export default function GameForm({ games }: { games: Game[] }) {
  const [newGameName, setNewGameName] = useState('');
  const [editingGameId, setEditingGameId] = useState<string | null>(null);

  const saveGame = () => {
    const trimmed = newGameName.trim();
    if (!trimmed) return;

    if (editingGameId) {
      // Update existing game
      set(ref(db, `games/${editingGameId}`), {
        id: editingGameId,
        name: trimmed,
      });
      setEditingGameId(null);
    } else {
      // Add new game
      const newRef = push(ref(db, 'games'));
      set(newRef, { id: newRef.key, name: trimmed });
    }

    setNewGameName('');
  };

  const deleteGame = (id: string) => remove(ref(db, `games/${id}`));

  const editGame = (game: Game) => {
    setNewGameName(game.name);
    setEditingGameId(game.id);
  };

  return (
    <div className="mt-10">
      <hr className="my-6 border-zinc-700" />
      <h1 className="mt-4 text-3xl font-bold mb-6 text-center text-purple-400 drop-shadow-lg">
        Games
      </h1>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Game name"
          value={newGameName}
          onChange={(e) => setNewGameName(e.target.value)}
          className="flex-1 rounded bg-zinc-800 px-4 py-2 border border-zinc-700 placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
        />
        <button
          onClick={saveGame}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-semibold"
        >
          {editingGameId ? 'Update' : 'Add'}
        </button>
      </div>

      <ul className="space-y-2">
        {games.map((g) => (
          <li
            key={g.id}
            className="flex justify-between items-center bg-zinc-800 px-4 py-2 rounded"
          >
            <span className="font-mono truncate">{g.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => editGame(g)}
                className="text-yellow-400 hover:underline text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => deleteGame(g.id)}
                className="text-red-500 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
