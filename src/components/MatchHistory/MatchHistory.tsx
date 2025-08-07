import type { Player } from '../../types/Player';
import type { Game, Match } from '../../types/Game';
import { getColourHex } from '../../utils/colourToHex';

type MatchHistoryProps = {
  players: Player[];
  games: Game[];
  matches: Match[];
};

function MatchHistory({ players, games, matches }: MatchHistoryProps) {
  const playerMap = Object.fromEntries(players.map((p) => [p.id, p]));
  const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));

  return (
    <div className="text-white">
      <h2 className="text-3xl">Match History</h2>
      <hr className="mt-4 mb-6 border-zinc-700" />
      <ul className="space-y-6 overflow-y-auto">
        {matches.map(({ id, timestamp, players: pids, winner, gameId }) => {
          const gameName = gameMap[gameId]?.name || 'Unknown Game';

          // Winner first, others next
          const orderedPids = [
            winner,
            ...pids.filter((pid) => pid !== winner),
          ].filter(Boolean);

          return (
            <li
              key={id}
              className="relative rounded-2xl overflow-hidden w-full mx-auto border border-zinc-900"
            >
              <img
                src={`./${gameName.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                alt={`${gameName} background`}
                className="absolute inset-0 w-full h-full object-cover brightness-20 z-10"
              />

              <div className="relative z-20 flex flex-col justify-between h-full p-5 gap-4">
                <div className="flex justify-between">
                  <span className="text-2xl font-semibold max-w-[60%] truncate">
                    {gameName}
                  </span>
                  <time
                    dateTime={new Date(timestamp).toISOString()}
                    className="text-sm text-zinc-300"
                  >
                    {new Date(timestamp).toLocaleString()}
                  </time>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  {orderedPids.length > 0 ? (
                    orderedPids.map((pid) => {
                      const player = playerMap[pid];
                      const isWinner = pid === winner;
                      return (
                        <span
                          key={pid}
                          title={`Player colour: ${
                            player?.colour || 'unknown'
                          }`}
                          className={`inline-block px-3 py-1 rounded h-fit font-mono text-base truncate max-w-[180px] border-2 ${
                            isWinner
                              ? 'border-white font-semibold'
                              : 'border-transparent'
                          }`}
                          style={{
                            backgroundColor: player
                              ? `${getColourHex(player.colour)}cc`
                              : '#444',
                          }}
                        >
                          {player?.name.toUpperCase() || 'Unknown'}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-zinc-500 italic">
                      No players recorded
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default MatchHistory;
