export function detectDoubleTop(candles, lookback = 50, tolerance = 0.003) {
  const patterns = [];

  for (let i = 2; i < candles.length - 2; i++) {
    const left = candles[i - 2];
    const mid = candles[i];
    const right = candles[i + 2];

    const isPeak = mid.high > left.high && mid.high > right.high;
    if (!isPeak) continue;

    const prevPeaks = candles.slice(Math.max(0, i - lookback), i - 2);
    const match = prevPeaks.find(
      (p) => Math.abs(p.high - mid.high) / mid.high < tolerance
    );

    if (match) {
      patterns.push({
        type: "double_top",
        time: mid.time,
        price: mid.high,
      });
    }
  }

  return patterns;
}

export function detectDoubleBottom(candles, lookback = 50, tolerance = 0.003) {
  const patterns = [];

  for (let i = 2; i < candles.length - 2; i++) {
    const left = candles[i - 2];
    const mid = candles[i];
    const right = candles[i + 2];

    const isTrough = mid.low < left.low && mid.low < right.low;
    if (!isTrough) continue;

    const prevTroughs = candles.slice(Math.max(0, i - lookback), i - 2);
    const match = prevTroughs.find(
      (p) => Math.abs(p.low - mid.low) / mid.low < tolerance
    );

    if (match) {
      patterns.push({
        type: "double_bottom",
        time: mid.time,
        price: mid.low,
      });
    }
  }

  return patterns;
}

export function detectBreakout(candles, lookback = 20) {
  const patterns = [];

  for (let i = lookback; i < candles.length; i++) {
    const slice = candles.slice(i - lookback, i);
    const high = Math.max(...slice.map((c) => c.high));
    const low = Math.min(...slice.map((c) => c.low));
    const close = candles[i].close;

    if (close > high) {
      patterns.push({
        type: "breakout_up",
        time: candles[i].time,
        price: close,
      });
    } else if (close < low) {
      patterns.push({
        type: "breakout_down",
        time: candles[i].time,
        price: close,
      });
    }
  }

  return patterns;
}
