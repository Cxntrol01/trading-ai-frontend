export function detectSupportResistance(candles, lookback = 20) {
  const levels = [];

  for (let i = lookback; i < candles.length - lookback; i++) {
    const slice = candles.slice(i - lookback, i + lookback);

    const low = candles[i].low;
    const high = candles[i].high;

    const isSupport = slice.every((c) => low <= c.low);
    const isResistance = slice.every((c) => high >= c.high);

    if (isSupport) levels.push({ type: "support", price: low, time: candles[i].time });
    if (isResistance) levels.push({ type: "resistance", price: high, time: candles[i].time });
  }

  return levels;
}

export function detectTrendlines(candles) {
  const trendlines = [];

  for (let i = 1; i < candles.length; i++) {
    const prev = candles[i - 1];
    const curr = candles[i];

    const slope = curr.close - prev.close;

    trendlines.push({
      time: curr.time,
      value: curr.close,
      slope,
    });
  }

  return trendlines;
}
