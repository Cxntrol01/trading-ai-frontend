export function buildVolumeProfile(candles, bins = 20) {
  if (!candles.length) return [];

  const lows = candles.map((c) => c.low);
  const highs = candles.map((c) => c.high);

  const min = Math.min(...lows);
  const max = Math.max(...highs);
  const step = (max - min) / bins;

  const profile = Array.from({ length: bins }, (_, i) => ({
    price: min + i * step,
    volume: 0,
  }));

  candles.forEach((c) => {
    const typical = (c.high + c.low + c.close) / 3;
    const idx = Math.min(
      bins - 1,
      Math.max(0, Math.floor((typical - min) / step))
    );
    profile[idx].volume += c.volume || 1;
  });

  return profile;
}
