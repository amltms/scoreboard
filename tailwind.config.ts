import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gamerbg: '#0f0f1b', // Background
        gamerpanel: '#1a1a2e', // Panels / cards
        gameraccent: '#7f5af0', // Accent / button
        gamertext: '#e4e4e7', // General text
      },
      fontFamily: {
        gamer: ['Orbitron', 'sans-serif'], // Gamer style font
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        gamer: '0 4px 24px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
};

export default config;
