"use client";

import { Indicators, Pattern, Candle } from "@/lib/structure";

interface Props {
  indicators: Indicators | null;
  patterns: Pattern[];
  candles: Candle[];
}

export default function AiIndicatorAnalysis({ indicators, patterns, candles }: Props) {
  if (!indicators || candles.length === 0) return null;

  const last = candles[candles.length - 1];

  const trend =
    indicators.ema && indicators.sma
      ? indicators.ema.at(-1)!.value > indicators.sma.at(-1)!.value
        ? "Uptrend — EMA above SMA, buyers in control."
        : "Downtrend — EMA below SMA, sellers dominating."
      : "Trend unclear — missing EMA/SMA.";

  const momentum =
    indicators.rsi
      ? indicators.rsi.at(-1)!.value > 60
        ? "Strong bullish momentum (RSI > 60)."
        : indicators.rsi.at(-1)!.value < 40
        ? "Bearish momentum (RSI < 40)."
        : "Neutral momentum."
      : "Momentum unclear — RSI missing.";

  const volatility =
    indicators.bb
      ? last.close > indicators.bb.upper.at(-1)!.value
        ? "Price extended above upper Bollinger Band — volatility expansion."
        : last.close < indicators.bb.lower.at(-1)!.value
        ? "Price extended below lower Bollinger Band — volatility spike."
        : "Volatility normal — price inside bands."
      : "Volatility unclear — Bollinger Bands missing.";

  const macdSignal =
    indicators.macd
      ? indicators.macd.macd.at(-1)!.value > indicators.macd.signal.at(-1)!.value
        ? "MACD line above signal — bullish momentum shift."
        : "MACD line below signal — bearish momentum shift."
      : "MACD unavailable.";

  const patternSummary =
    patterns && patterns.length > 0
      ? `Detected patterns: ${patterns.map((p) => p.name).join(", ")}.`
      : "No major patterns detected.";

  const volume =
    last.volume > candles[candles.length - 2].volume
      ? "Volume rising — increasing participation."
      : "Volume declining — weaker conviction.";

  const finalBias = (() => {
    let score = 0;
    if (trend.includes("Uptrend")) score++;
    if (momentum.includes("bullish")) score++;
    if (macdSignal.includes("bullish")) score++;
    if (volatility.includes("below")) score--;
    if (volatility.includes("above")) score++;

    if (score >= 2) return "Overall Bias: Bullish";
    if (score <= -1) return "Overall Bias: Bearish";
    return "Overall Bias: Neutral";
  })();

  return (
    <div className="bg-[#0f0f0f] border border-[#222] rounded-xl p-5 mt-6 space-y-3">
      <h2 className="text-xl font-semibold text-white mb-2">AI Indicator Analysis</h2>

      <p className="text-gray-300"><strong>Trend:</strong> {trend}</p>
      <p className="text-gray-300"><strong>Momentum:</strong> {momentum}</p>
      <p className="text-gray-300"><strong>MACD:</strong> {macdSignal}</p>
      <p className="text-gray-300"><strong>Volatility:</strong> {volatility}</p>
      <p className="text-gray-300"><strong>Volume:</strong> {volume}</p>
      <p className="text-gray-300"><strong>Patterns:</strong> {patternSummary}</p>

      <div className="mt-4 text-lg font-bold text-white">{finalBias}</div>
    </div>
  );
}
