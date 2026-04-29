// -----------------------------
// Simple Moving Average (SMA)
// -----------------------------
export function calcSMA(candles, length = 14) {
  const result = [];
  for (let i = length - 1; i < candles.length; i++) {
    const slice = candles.slice(i - length + 1, i + 1);
    const avg = slice.reduce((s, c) => s + c.close, 0) / length;
    result.push({ time: candles[i].time, value: avg });
  }
  return result;
}

// -----------------------------
// Exponential Moving Average (EMA)
// -----------------------------
export function calcEMA(candles, length = 14) {
  const result = [];
  const k = 2 / (length + 1);

  let emaPrev = candles[0].close;

  candles.forEach((c) => {
    const ema = c.close * k + emaPrev * (1 - k);
    emaPrev = ema;
    result.push({ time: c.time, value: ema });
  });

  return result.slice(length - 1);
}

// -----------------------------
// VWAP (Volume Weighted Average Price)
// -----------------------------
export function calcVWAP(candles) {
  let cumulativePV = 0;
  let cumulativeVolume = 0;

  return candles.map((c) => {
    const typical = (c.high + c.low + c.close) / 3;
    const volume = c.volume || 1;

    cumulativePV += typical * volume;
    cumulativeVolume += volume;

    return {
      time: c.time,
      value: cumulativePV / cumulativeVolume,
    };
  });
}

// -----------------------------
// RSI (Relative Strength Index)
// -----------------------------
export function calcRSI(candles, length = 14) {
  const gains = [];
  const losses = [];

  for (let i = 1; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    gains.push(Math.max(diff, 0));
    losses.push(Math.max(-diff, 0));
  }

  const rsi = [];
  for (let i = length; i < gains.length; i++) {
    const avgGain =
      gains.slice(i - length, i).reduce((a, b) => a + b, 0) / length;
    const avgLoss =
      losses.slice(i - length, i).reduce((a, b) => a + b, 0) / length;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const value = 100 - 100 / (1 + rs);

    rsi.push({ time: candles[i].time, value });
  }

  return rsi;
}

// -----------------------------
// MACD (12/26 EMA + 9 Signal)
// -----------------------------
export function calcMACD(candles) {
  const ema12 = calcEMA(candles, 12);
  const ema26 = calcEMA(candles, 26);

  // Align arrays (EMA26 starts later)
  const macd = ema26.map((e26, i) => {
    const e12 = ema12[i + 14]; // shift to align
    if (!e12) return null;

    return {
      time: e26.time,
      value: e12.value - e26.value,
    };
  }).filter(Boolean);

  const signal = calcEMA(macd, 9);

  return { macd, signal };
}
