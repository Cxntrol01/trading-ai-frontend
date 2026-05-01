// -----------------------------
// Candle Structure
// -----------------------------
export interface Candle {
  time: number | string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// -----------------------------
// Indicator Structures
// -----------------------------
export interface LinePoint {
  time: number | string;
  value: number;
}

export interface BollingerBands {
  upper: LinePoint[];
  lower: LinePoint[];
}

export interface MacdData {
  macd: LinePoint[];
  signal: LinePoint[];
}

export interface Indicators {
  sma: LinePoint[];
  ema: LinePoint[];
  vwap: LinePoint[];
  rsi: LinePoint[];
  macd: MacdData;
  bb: BollingerBands;
}

// -----------------------------
// Pattern Detection
// -----------------------------
export interface Pattern {
  name: string;
  time: number | string;
  price: number;
  type: "bullish" | "bearish" | "neutral";
}

// -----------------------------
// Toggle Controls
// -----------------------------
export interface IndicatorToggles {
  sma: boolean;
  ema: boolean;
  vwap: boolean;
  bb: boolean;
  rsi: boolean;
  macd: boolean;
  patterns: boolean;
  volumeProfile: boolean;
}
