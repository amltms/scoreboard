import { Link, useLocation } from 'react-router-dom';

export default function Nav() {
  const { pathname } = useLocation();

  const links = [
    { to: '/scoreboard', label: 'Scoreboard' },
    { to: '/match', label: 'Match' },
    { to: '/control', label: 'Control' },
  ];

  return (
    <div className="flex justify-between gap-4 mb-8">
      {links
        .filter((link) => link.to !== pathname)
        .map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="text-zinc-400 hover:text-purple-400 font-semibold"
          >
            {label}
          </Link>
        ))}
    </div>
  );
}
