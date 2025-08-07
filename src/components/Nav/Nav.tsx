import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <div className="flex justify-between">
      <Link
        to="/scoreboard"
        className="text-zinc-400 hover:text-purple-400 font-semibold"
      >
        Scoreboard
      </Link>
      <Link
        to="/match"
        className="text-zinc-400 hover:text-purple-400 font-semibold"
      >
        Match
      </Link>
      <Link
        to="/control"
        className="text-zinc-400 hover:text-purple-400 font-semibold"
      >
        Control
      </Link>
    </div>
  );
}
