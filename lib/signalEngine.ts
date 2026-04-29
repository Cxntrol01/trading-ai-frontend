export function generateSignal({ indicators, structure, patterns }) {
  const latestRSI = indicators.rsi.at(-1)?.value ?? 50;
  const latestMACD = indicators.macd.macd.at(-1)?.value ?? 0;
  const latestSignal = indicators.macd.signal.at(-1)?.value ?? 0;

  const hasDoubleTop = patterns.some((p) => p.type === "double_top");
  const hasDoubleBottom = patterns.some((p) => p.type === "double_bottom");
  const breakoutUp = patterns.some((p) => p.type === "breakout_up");
  const breakoutDown = patterns.some((p) => p.type === "breakout_down");

  let bias = "neutral";
  let confidence = 0;
  const reasons = [];

  if (latestRSI < 30 && hasDoubleBottom) {
    bias = "long";
    confidence += 30;
    reasons.push("RSI oversold with double bottom");
  }

  if (latestRSI > 70 && hasDoubleTop) {
    bias = "short";
    confidence += 30;
    reasons.push("RSI overbought with double top");
  }

  if (breakoutUp) {
    bias = "long";
    confidence += 25;
    reasons.push("Price broke above recent range");
  }

  if (breakoutDown) {
    bias = "short";
    confidence += 25;
    reasons.push("Price broke below recent range");
  }

  if (latestMACD > latestSignal) {
    confidence += 10;
    reasons.push("MACD above signal (bullish momentum)");
  } else if (latestMACD < latestSignal) {
    confidence += 10;
    reasons.push("MACD below signal (bearish momentum)");
  }

  confidence = Math.min(100, confidence);

  return {
    bias,
    confidence,
    reasons,
  };
}
