import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { db, ref, onValue } from './firebase';
import type { Player } from './types/Player';
import type { Game, Match } from './types/Game';
import Scoreboard from './pages/Scoreboard';
import Control from './pages/Control';
import MatchPage from './pages/Match';
import Profile from './pages/Profile';

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const unsub = onValue(ref(db, 'matches'), (snap) => {
      const data = snap.val() || {};
      const loaded = Object.entries(data).map(([id, val]) => ({
        id,
        ...(val as Omit<Match, 'id'>),
      }));
      setMatches(loaded.reverse());
    });

    return () => unsub();
  }, []);

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
                  <MatchPage
                    players={players}
                    games={games}
                    matches={matches}
                  />
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
              element={
                <MatchPage players={players} games={games} matches={matches} />
              }
            />
            <Route
              path="/control"
              element={<Control players={players} games={games} />}
            />
            <Route
              path="/profile/:id"
              element={
                <Profile players={players} games={games} matches={matches} />
              }
            />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
}
