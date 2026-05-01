import { Candle, Pattern } from "./structure";

export function detectPatterns(candles: Candle[]): Pattern[] {
  const patterns: Pattern[] = [];

  for (let i = 1; i < candles.length; i++) {
    const c1 = candles[i - 1];
    const c2 = candles[i];

    const body1 = Math.abs(c1.close - c1.open);
    const body2 = Math.abs(c2.close - c2.open);
    const range2 = c2.high - c2.low;

    // -----------------------------
    // Bullish Engulfing
    // -----------------------------
    if (
      c1.close < c1.open &&
      c2.close > c2.open &&
      c2.open <= c1.close &&
      c2.close >= c1.open
    ) {
      patterns.push({
        name: "Bullish Engulfing",
        time: c2.time,
        price: c2.close,
        type: "bullish",
      });
    }

    // -----------------------------
    // Bearish Engulfing
    // -----------------------------
    if (
      c1.close > c1.open &&
      c2.close < c2.open &&
      c2.open >= c1.close &&
      c2.close <= c1.open
    ) {
      patterns.push({
        name: "Bearish Engulfing",
        time: c2.time,
        price: c2.close,
        type: "bearish",
      });
    }

    // -----------------------------
    // Hammer
    // -----------------------------
    const lowerWick = c2.open < c2.close
      ? c2.open - c2.low
      : c2.close - c2.low;

    if (
      body2 < range2 * 0.3 &&
      lowerWick > body2 * 2 &&
      c2.high - Math.max(c2.open, c2.close) < body2
    ) {
      patterns.push({
        name: "Hammer",
        time: c2.time,
        price: c2.close,
        type: "bullish",
      });
    }

    // -----------------------------
    // Shooting Star
    // -----------------------------
    const upperWick = c2.high - Math.max(c2.open, c2.close);

    if (
      body2 < range2 * 0.3 &&
      upperWick > body2 * 2 &&
      Math.min(c2.open, c2.close) - c2.low < body2
    ) {
      patterns.push({
        name: "Shooting Star",
        time: c2.time,
        price: c2.close,
        type: "bearish",
      });
    }

    // -----------------------------
    // Doji
    // -----------------------------
    if (body2 <= range2 * 0.05) {
      patterns.push({
        name: "Doji",
        time: c2.time,
        price: c2.close,
        type: "neutral",
      });
    }

    // -----------------------------
    // Morning Star (3‑candle)
    // -----------------------------
    if (i >= 2) {
      const c0 = candles[i - 2];

      if (
        c0.close < c0.open && // bearish
        body1 < range2 * 0.3 && // small middle candle
        c2.close > (c0.open + c0.close) / 2 // strong bullish close
      ) {
        patterns.push({
          name: "Morning Star",
          time: c2.time,
          price: c2.close,
          type: "bullish",
        });
      }
    }

    // -----------------------------
    // Evening Star (3‑candle)
    // -----------------------------
    if (i >= 2) {
      const c0 = candles[i - 2];

      if (
        c0.close > c0.open && // bullish
        body1 < range2 * 0.3 && // small middle candle
        c2.close < (c0.open + c0.close) / 2 // strong bearish close
      ) {
        patterns.push({
          name: "Evening Star",
          time: c2.time,
          price: c2.close,
          type: "bearish",
        });
      }
    }
  }

  return patterns;
}
