'use client';

import { useState } from 'react';
import { db, ref, push, set, update } from '../firebase';
import type { Player } from '../types/Player';
import type { Game } from '../types/Game';
import Nav from '../components/Nav/Nav';
import { getColourHex } from '../utils/colourToHex';
import { calculateElo } from '../utils/calculateElo';
import MatchHistory from '../components/MatchHistory/MatchHistory';

type Props = {
  players: Player[];
  games: Game[];
};

export default function Match({ players, games }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedGameId, setSelectedGameId] = useState('');
  const [winner, setWinner] = useState('');

  const toggleSelect = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );

  const submitMatch = () => {
    if (
      !winner ||
      !selectedGameId ||
      selected.length < 2 ||
      !selected.includes(winner)
    )
      return;

    const participants = selected
      .map((id) => players.find((p) => p.id === id))
      .filter(Boolean) as Player[];

    participants.forEach((player) => {
      let newElo = player.elo;
      const isWinner = player.id === winner;

      participants.forEach((opponent) => {
        if (opponent.id !== player.id) {
          newElo = calculateElo(newElo, opponent.elo, isWinner ? 1 : 0);
        }
      });

      update(ref(db, `players/${player.id}`), {
        gamesWon: player.gamesWon + (isWinner ? 1 : 0),
        gamesLost: player.gamesLost + (isWinner ? 0 : 1),
        elo: newElo,
        eloDelta: newElo - player.elo,
      });
    });

    set(push(ref(db, 'matches')), {
      timestamp: Date.now(),
      players: selected,
      winner,
      gameId: selectedGameId,
    });

    setWinner('');
    setSelected([]);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <Nav />
        <h1 className="mt-4 text-3xl font-bold mb-6 text-center text-purple-400 drop-shadow-lg">
          Match Setup
        </h1>

        {/* Game Setup */}
        <div className="bg-zinc-800 rounded-lg p-6 shadow-lg mb-10">
          <h2 className="text-xl font-bold mb-4">New Game</h2>

          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto mb-4">
            {players.map((p) => (
              <label key={p.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={() => toggleSelect(p.id)}
                  className="accent-purple-500"
                />
                <span
                  className="px-3 py-1 rounded-md font-mono text-sm w-fit"
                  style={{ backgroundColor: `${getColourHex(p.colour)}cc` }}
                >
                  {p.name.toUpperCase()}
                </span>
              </label>
            ))}
          </div>

          <select
            className="w-full mb-4 rounded-md bg-zinc-700 px-4 py-2"
            value={selectedGameId}
            onChange={(e) => setSelectedGameId(e.target.value)}
          >
            <option hidden value="">
              Select Game
            </option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>

          <select
            className="w-full mb-4 rounded-md bg-zinc-700 px-4 py-2"
            value={winner}
            onChange={(e) => setWinner(e.target.value)}
          >
            <option hidden value="">
              Select Winner
            </option>
            {selected.map((id) => {
              const player = players.find((p) => p.id === id);
              return (
                player && (
                  <option key={id} value={id}>
                    {player.name}
                  </option>
                )
              );
            })}
          </select>

          <button
            disabled={!winner || selected.length < 2}
            onClick={submitMatch}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-40 py-3 rounded-md font-semibold"
          >
            Submit
          </button>
        </div>

        <MatchHistory players={players} games={games} />
      </div>
    </div>
  );
}
