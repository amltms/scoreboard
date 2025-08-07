import { useParams, Link } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import { getColourHex } from '../utils/colourToHex';
import type { Player } from '../types/Player';
import type { Game, Match } from '../types/Game';

type Props = {
  players: Player[];
  games: Game[];
  matches: Match[];
};

export default function Profile({ players, games, matches }: Props) {
  const { id } = useParams<{ id: string }>();
  const player = players.find((p) => p.id === id);

  if (!player)
    return (
      <div className="p-6 text-center bg-zinc-900 h-screen flex flex-col justify-center items-center">
        <p className="text-lg text-white">Player not found.</p>
        <Link
          to="/"
          className="text-blue-400 hover:underline mt-2 inline-block"
        >
          Back to Home
        </Link>
      </div>
    );

  const gamesPlayed = player.gamesWon + player.gamesLost;
  const winRate = gamesPlayed
    ? ((player.gamesWon / gamesPlayed) * 100).toFixed(1)
    : '0';

  const playerMatches = matches
    .filter((m) => m.players.some((p) => p === player.id))
    .sort((a, b) => (b.timestamp as number) - (a.timestamp as number));

  const playerMap = Object.fromEntries(players.map((p) => [p.id, p]));
  const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Nav />

        {/* Player Card */}
        <div className="bg-zinc-800 rounded-2xl overflow-hidden shadow-lg mb-8">
          <div
            className="h-32 sm:h-40"
            style={{
              backgroundColor: `${getColourHex(player.colour)}cc`,
              borderBottom: '2px solid rgba(0,0,0,0.2)',
            }}
          />
          <div className="relative -mt-12 sm:-mt-16 px-6 pb-6">
            <div className="bg-zinc-900 p-4 sm:p-6 rounded-xl shadow-inner">
              <h1 className="text-2xl font-bold mb-4 text-center">
                {player.name}
              </h1>

              {/* Stats - horizontal scroll on mobile */}
              <dl className="flex sm:grid sm:grid-cols-3 gap-4 overflow-x-auto scrollbar-hide">
                {[
                  { label: 'ELO', value: player.elo },
                  { label: 'Games Played', value: gamesPlayed },
                  { label: 'Wins', value: player.gamesWon },
                  { label: 'Losses', value: player.gamesLost },
                  { label: 'Win Rate', value: `${winRate}%` },
                  {
                    label: 'ELO Change',
                    value: `${(player.eloDelta ?? 0) >= 0 ? '+' : ''}${
                      player.eloDelta ?? 0
                    }`,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-zinc-800 rounded-lg p-3 flex-shrink-0 min-w-[130px] sm:min-w-0 text-center"
                  >
                    <dt className="text-sm text-zinc-400">{stat.label}</dt>
                    <dd className="text-lg font-semibold">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Match History */}
        <div>
          <h2 className="text-2xl mb-6 text-center">Match History</h2>

          {playerMatches.length === 0 ? (
            <p className="text-center text-zinc-400">
              No matches found for this player.
            </p>
          ) : (
            <ul className="space-y-6 overflow-y-auto scrollbar-hide">
              {playerMatches.map(
                ({ id, timestamp, players: pids, winner, gameId }) => {
                  const gameName = gameMap[gameId]?.name || 'Unknown Game';
                  const isWinner = winner === player.id;
                  const orderedPids = [
                    winner,
                    ...pids.filter((pid) => pid !== winner),
                  ].filter(Boolean);

                  return (
                    <li
                      key={id}
                      className={`relative rounded-2xl overflow-hidden shadow-md bg-black`}
                    >
                      {/* Background image */}
                      <div className="absolute inset-0">
                        <img
                          src={`./${gameName
                            .toLowerCase()
                            .replace(/\s+/g, '-')}.jpg`}
                          alt={`${gameName} background`}
                          className={`w-full h-full object-cover ${
                            isWinner ? 'opacity-25' : 'opacity-10'
                          }`}
                        />
                      </div>

                      <div className="relative z-10 p-5 flex flex-col gap-4">
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <span className="text-xl font-semibold truncate max-w-[65%]">
                            {gameName}
                          </span>
                          <time className="text-sm text-zinc-400">
                            {new Date(timestamp).toLocaleString()}
                          </time>
                        </div>

                        <div className="text-lg font-semibold">
                          {isWinner ? (
                            <span className="text-green-400">Winner</span>
                          ) : (
                            <span className="text-red-400">Loser</span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {orderedPids.map((pid) => {
                            const playerObj = playerMap[pid];
                            const isWinnerPlayer = pid === winner;
                            return (
                              <span
                                key={pid}
                                className={`px-3 py-1 rounded font-mono text-sm truncate max-w-[160px] border-2 ${
                                  isWinnerPlayer
                                    ? 'border-white font-semibold'
                                    : 'border-transparent'
                                }`}
                                style={{
                                  backgroundColor: playerObj
                                    ? `${getColourHex(playerObj.colour)}cc`
                                    : '#444',
                                }}
                              >
                                {playerObj?.name.toUpperCase() || 'Unknown'}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </li>
                  );
                }
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
