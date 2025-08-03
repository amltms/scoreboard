import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ControlPanel from './pages/ControlPanel';
import Scoreboard from './pages/Scoreboard';
import MatchHistory from './pages/MatchHistory';

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

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
              element={isMobile ? <ControlPanel /> : <Scoreboard />}
            />
            <Route path="/scoreboard" element={<Scoreboard />} />
            <Route path="/control" element={<ControlPanel />} />
            <Route path="/history" element={<MatchHistory />} />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
}
