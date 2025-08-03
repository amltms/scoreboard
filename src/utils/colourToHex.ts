// utils/colourToHex.ts
const colourMap: Record<string, string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  pink: '#ec4899',
  orange: '#f97316',
  teal: '#14b8a6',
  // add more as needed
};

export function getColourHex(colour: string): string {
  return colourMap[colour] || '#6b7280'; // default: gray-500
}
