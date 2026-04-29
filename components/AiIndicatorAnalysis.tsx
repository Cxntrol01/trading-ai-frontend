"use client";

import { useState } from "react";

export default function AiIndicatorAnalysis({ indicators, structure }) {
  const [text, setText] = useState("");

  const run = () => {
    const summary = `
Trend: ${structure.trend}
Support Levels: ${structure.support.map((s) => s.price).join(", ")}
Resistance Levels: ${structure.resistance.map((r) => r.price).join(", ")}

SMA/EMA: ${
      indicators.sma[indicators.sma.length - 1].value >
      indicators.ema[indicators.ema.length - 1].value
        ? "Bullish crossover"
        : "Bearish crossover"
    }

RSI: ${indicators.rsi[indicators.rsi.length - 1].value.toFixed(1)}
MACD: ${indicators.macd.macd[indicators.macd.macd.length - 1].value.toFixed(2)}

Summary: Market structure and indicators suggest ${
      structure.trend === "up" ? "bullish momentum" : "bearish pressure"
    }.
    `;

    setText(summary);
  };

  return (
    <div>
      <h2>AI Indicator Analysis</h2>
      <button onClick={run}>Run AI Indicator Analysis</button>
      {text && <pre>{text}</pre>}
    </div>
  );
}
