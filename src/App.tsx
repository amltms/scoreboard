import { HashRouter, Routes, Route } from 'react-router-dom';
import ControlPanel from './pages/ControlPanel';
import Scoreboard from './pages/Scoreboard';
import MatchHistory from './pages/MatchHistory';

export default function App() {
  return (
    <div className="dark">
      <div className="bg-gamerbg text-gamertext min-h-screen font-gamer">
        <HashRouter>
          <Routes>
            <Route path="/" element={<Scoreboard />} />
            <Route path="/control" element={<ControlPanel />} />
            <Route path="/history" element={<MatchHistory />} />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
}
