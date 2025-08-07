export function calculateElo(
  current: number,
  opponent: number,
  score: 1 | 0 | 0.5,
  k = 32
): number {
  const expected = 1 / (1 + 10 ** ((opponent - current) / 400));
  return Math.round(current + k * (score - expected));
}
