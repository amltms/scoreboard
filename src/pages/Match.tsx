'use client';

import { useState } from 'react';
import { db, ref, push, set, update } from '../firebase';
import type { Player } from '../types/Player';
import type { Game, Match } from '../types/Game';
import Nav from '../components/Nav/Nav';
import { getColourHex } from '../utils/colourToHex';
import { calculateElo } from '../utils/calculateElo';
import MatchHistory from '../components/MatchHistory/MatchHistory';

type Props = {
  players: Player[];
  games: Game[];
  matches: Match[];
};

export default function Match({ players, games, matches }: Props) {
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
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <Nav />
        <h2 className="text-3xl">New Match</h2>
        <hr className="mt-4 mb-4 border-zinc-700" />

        <div className="mb-12 flex flex-col gap-3">
          <div>
            <label className="text-lg">Select Players</label>
            <div className="flex gap-4 pt-2 pb-4 overflow-x-auto whitespace-nowrap no-scrollbar">
              {players.map((p) => {
                const isSelected = selected.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleSelect(p.id)}
                    className={`px-4 py-2 rounded-md font-mono uppercase transition-colors duration-200 border-2 ${
                      isSelected
                        ? 'border-white font-bold'
                        : 'border-transparent opacity-80 hover:opacity-100 bg-zinc-600!'
                    }`}
                    style={{
                      backgroundColor: `${getColourHex(p.colour)}cc`,
                    }}
                    title={`Click to ${isSelected ? 'deselect' : 'select'}`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-lg block">Select Game</label>
            <div className="flex gap-4 pt-2 pb-4 overflow-x-auto whitespace-nowrap no-scrollbar">
              {games.map((game) => {
                const isSelected = selectedGameId === game.id;
                return (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => setSelectedGameId(game.id)}
                    className={`px-4 py-2 rounded-md shrink-0 transition-colors duration-200 font-medium ${
                      isSelected
                        ? 'bg-white text-black font-bold'
                        : 'bg-zinc-700 text-white hover:bg-zinc-600'
                    }`}
                    title={`Click to select ${game.name}`}
                  >
                    {game.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-lg block">Select Winner</label>
            <div className="flex gap-4 pt-2 h-18 overflow-x-auto whitespace-nowrap no-scrollbar">
              {selected.map((id) => {
                const player = players.find((p) => p.id === id);
                if (!player) return null;

                const isWinner = winner === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setWinner(id)}
                    className={`px-4 py-2 rounded-md font-mono transition-all h-fit duration-200 ${
                      isWinner && 'bg-white text-black font-bold'
                    }`}
                    style={{
                      backgroundColor: !isWinner
                        ? `${getColourHex(player.colour)}cc`
                        : undefined,
                    }}
                  >
                    {player.name.toUpperCase()}
                  </button>
                );
              })}
            </div>
            <button
              disabled={!winner || selected.length < 2}
              onClick={submitMatch}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-40 py-3 rounded-md font-semibold"
            >
              Submit
            </button>
          </div>
        </div>

        <MatchHistory players={players} games={games} matches={matches} />
      </div>
    </div>
  );
}
