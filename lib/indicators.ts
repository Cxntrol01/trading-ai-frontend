// Simple Moving Average
export function calcSMA(candles, length = 14) {
  const result = [];
  for (let i = length - 1; i < candles.length; i++) {
    const slice = candles.slice(i - length + 1, i + 1);
    const avg = slice.reduce((s, c) => s + c.close, 0) / length;
    result.push({ time: candles[i].time, value: avg });
  }
  return result;
}

// Exponential Moving Average
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

// VWAP
export function calcVWAP(candles) {
  let cumulativePV = 0;
  let cumulativeVolume = 0;

  return candles.map((c) => {
    const typical = (c.high + c.low + c.close) / 3;
    cumulativePV += typical * (c.volume || 1);
    cumulativeVolume += c.volume || 1;

    return {
      time: c.time,
      value: cumulativePV / cumulativeVolume,
    };
  });
}
