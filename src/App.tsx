import { useEffect, useState } from 'react';
import { db, ref, onValue } from './firebase';
import type { Player } from './types/Player';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Scoreboard from './pages/Scoreboard';
import Control from './pages/Control';
import Match from './pages/Match';
import type { Game } from './types/Game';

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const gamesRef = ref(db, 'games');
    return onValue(gamesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return setGames([]);
      const parsed = Object.entries(data).map(([id, value]) => ({
        id,
        ...(value as Omit<Game, 'id'>),
      }));
      setGames(parsed);
    });
  }, []);

  useEffect(() => {
    const unsub = onValue(ref(db, 'players'), (snapshot) => {
      const data = snapshot.val() || {};
      const loaded: Player[] = Object.entries(data).map(([id, val]) => {
        const p = val as Omit<Player, 'id'>;
        const gamesWon = p.gamesWon || 0;
        const gamesLost = p.gamesLost || 0;

        return {
          id,
          name: p.name,
          colour: p.colour,
          gamesWon,
          gamesLost,
          gamesPlayed: gamesWon + gamesLost,
          elo: p.elo ?? 1000,
          eloDelta: p.eloDelta ?? 0,
        };
      });

      setPlayers(loaded);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="dark">
      <div className="bg-gamerbg text-gamertext min-h-screen font-gamer">
        <HashRouter>
          <Routes>
            <Route
              path="/"
              element={
                isMobile ? (
                  <Match players={players} games={games} />
                ) : (
                  <Scoreboard players={players} />
                )
              }
            />
            <Route
              path="/scoreboard"
              element={<Scoreboard players={players} />}
            />
            <Route
              path="/match"
              element={<Match players={players} games={games} />}
            />
            <Route
              path="/control"
              element={<Control players={players} games={games} />}
            />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
}
