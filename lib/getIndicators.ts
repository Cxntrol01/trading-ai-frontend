import { Candle, Indicators, LinePoint, BollingerBands, MacdData } from "./structure";

// -----------------------------
// Simple Moving Average (SMA)
// -----------------------------
function calculateSMA(candles: Candle[], length: number): LinePoint[] {
  const result: LinePoint[] = [];
  for (let i = length - 1; i < candles.length; i++) {
    const slice = candles.slice(i - length + 1, i + 1);
    const avg = slice.reduce((sum, c) => sum + c.close, 0) / length;
    result.push({ time: candles[i].time, value: avg });
  }
  return result;
}

// -----------------------------
// Exponential Moving Average (EMA)
// -----------------------------
function calculateEMA(candles: Candle[], length: number): LinePoint[] {
  const result: LinePoint[] = [];
  const k = 2 / (length + 1);

  let emaPrev = candles[0].close;

  candles.forEach((candle) => {
    const ema = candle.close * k + emaPrev * (1 - k);
    emaPrev = ema;
    result.push({ time: candle.time, value: ema });
  });

  return result;
}

// -----------------------------
// VWAP
// -----------------------------
function calculateVWAP(candles: Candle[]): LinePoint[] {
  let cumulativePV = 0;
  let cumulativeVolume = 0;

  return candles.map((c) => {
    const typical = (c.high + c.low + c.close) / 3;
    cumulativePV += typical * c.volume;
    cumulativeVolume += c.volume;

    return {
      time: c.time,
      value: cumulativePV / cumulativeVolume,
    };
  });
}

// -----------------------------
// RSI
// -----------------------------
function calculateRSI(candles: Candle[], length = 14): LinePoint[] {
  const result: LinePoint[] = [];
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / length;
  let avgLoss = losses / length;

  for (let i = length + 1; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;

    if (diff >= 0) {
      avgGain = (avgGain * (length - 1) + diff) / length;
      avgLoss = (avgLoss * (length - 1)) / length;
    } else {
      avgGain = (avgGain * (length - 1)) / length;
      avgLoss = (avgLoss * (length - 1) - diff) / length;
    }

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);

    result.push({ time: candles[i].time, value: rsi });
  }

  return result;
}

// -----------------------------
// Bollinger Bands
// -----------------------------
function calculateBollingerBands(candles: Candle[], length = 20, mult = 2): BollingerBands {
  const sma = calculateSMA(candles, length);
  const upper: LinePoint[] = [];
  const lower: LinePoint[] = [];

  for (let i = length - 1; i < candles.length; i++) {
    const slice = candles.slice(i - length + 1, i + 1);
    const mean = sma[i - (length - 1)].value;

    const variance =
      slice.reduce((sum, c) => sum + Math.pow(c.close - mean, 2), 0) / length;

    const std = Math.sqrt(variance);

    upper.push({ time: candles[i].time, value: mean + mult * std });
    lower.push({ time: candles[i].time, value: mean - mult * std });
  }

  return { upper, lower };
}

// -----------------------------
// MACD
// -----------------------------
function calculateMACD(candles: Candle[]): MacdData {
  const ema12 = calculateEMA(candles, 12);
  const ema26 = calculateEMA(candles, 26);

  const macdLine: LinePoint[] = ema12.map((p, i) => ({
    time: p.time,
    value: p.value - ema26[i].value,
  }));

  const signalLine = calculateEMA(
    macdLine.map((m) => ({
      time: m.time,
      open: m.value,
      high: m.value,
      low: m.value,
      close: m.value,
      volume: 0,
    })),
    9
  );

  return { macd: macdLine, signal: signalLine };
}

// -----------------------------
// Main Export
// -----------------------------
export function getIndicators(candles: Candle[]): Indicators {
  return {
    sma: calculateSMA(candles, 20),
    ema: calculateEMA(candles, 20),
    vwap: calculateVWAP(candles),
    rsi: calculateRSI(candles),
    macd: calculateMACD(candles),
    bb: calculateBollingerBands(candles),
  };
  }
