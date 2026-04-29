export function computePerformance(candles) {
  if (candles.length < 2) return 0;

  const first = candles[0].close;
  const last = candles[candles.length - 1].close;

  return ((last - first) / first) * 100;
}
