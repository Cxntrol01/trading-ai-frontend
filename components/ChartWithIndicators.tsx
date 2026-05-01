"use client";

import { useEffect, useState } from "react";
import {
  createChart,
  ColorType,
  LineStyle,
} from "lightweight-charts";

import { getIndicators } from "@/lib/getIndicators";
import { detectPatterns } from "@/lib/detectPatterns";
import IndicatorToggles from "./IndicatorToggles";
import AiIndicatorAnalysis from "./AiIndicatorAnalysis";
import { Candle, Indicators, Pattern, IndicatorToggles as TogglesType } from "@/lib/structure";

interface Props {
  candles: Candle[];
}

export default function ChartWithIndicators({ candles }: Props) {
  const [toggles, setToggles] = useState<TogglesType>({
    sma: true,
    ema: true,
    vwap: false,
    bb: false,
    rsi: false,
    macd: false,
    patterns: true,
    volumeProfile: false,
  });

  const [indicators, setIndicators] = useState<Indicators | null>(null);
  const [patterns, setPatterns] = useState<Pattern[]>([]);

  useEffect(() => {
    if (!candles || candles.length === 0) return;

    setIndicators(getIndicators(candles));
    setPatterns(detectPatterns(candles));
  }, [candles]);

  useEffect(() => {
    if (!candles || candles.length === 0) return;

    const container = document.getElementById("chart-container");
    if (!container) return;

    container.innerHTML = "";

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 420,
      layout: {
        background: { type: ColorType.Solid, color: "#0f0f0f" },
        textColor: "#ccc",
      },
      grid: {
        vertLines: { color: "#222" },
        horzLines: { color: "#222" },
      },
      crosshair: { mode: 1 },
      timeScale: { borderColor: "#222" },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    candleSeries.setData(candles);

    if (toggles.sma && indicators?.sma) {
      const smaSeries = chart.addLineSeries({
        color: "#4caf50",
        lineWidth: 2,
      });
      smaSeries.setData(indicators.sma);
    }

    if (toggles.ema && indicators?.ema) {
      const emaSeries = chart.addLineSeries({
        color: "#ff9800",
        lineWidth: 2,
      });
      emaSeries.setData(indicators.ema);
    }

    if (toggles.vwap && indicators?.vwap) {
      const vwapSeries = chart.addLineSeries({
        color: "#03a9f4",
        lineWidth: 2,
      });
      vwapSeries.setData(indicators.vwap);
    }

    if (toggles.bb && indicators?.bb) {
      const upper = chart.addLineSeries({
        color: "#9c27b0",
        lineWidth: 1,
        lineStyle: LineStyle.Dotted,
      });
      const lower = chart.addLineSeries({
        color: "#9c27b0",
        lineWidth: 1,
        lineStyle: LineStyle.Dotted,
      });

      upper.setData(indicators.bb.upper);
      lower.setData(indicators.bb.lower);
    }

    if (toggles.patterns && patterns.length > 0) {
      const patternSeries = chart.addScatterSeries({
        color: "#fff",
        radius: 4,
      });

      patternSeries.setData(
        patterns.map((p) => ({
          time: p.time,
          value: p.price,
          shape: "circle",
          color:
            p.type === "bullish"
              ? "#4caf50"
              : p.type === "bearish"
              ? "#ef5350"
              : "#ccc",
        }))
      );
    }

    return () => chart.remove();
  }, [candles, indicators, patterns, toggles]);

  return (
    <div className="w-full">
      <div
        id="chart-container"
        className="w-full h-[420px] rounded-xl border border-[#222]"
      />

      <IndicatorToggles toggles={toggles} setToggles={setToggles} />

      <AiIndicatorAnalysis
        indicators={indicators}
        patterns={patterns}
        candles={candles}
      />
    </div>
  );
      }
