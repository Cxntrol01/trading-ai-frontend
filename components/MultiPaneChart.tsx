"use client";

import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function MultiPaneChart({ candles, indicators, toggles }) {
  const mainRef = useRef(null);
  const rsiRef = useRef(null);
  const macdRef = useRef(null);

  useEffect(() => {
    if (!mainRef.current) return;

    // MAIN CHART
    const mainChart = createChart(mainRef.current, {
      width: mainRef.current.clientWidth,
      height: 300,
    });

    const candleSeries = mainChart.addCandlestickSeries();
    candleSeries.setData(candles);

    // Overlays
    if (toggles.sma) {
      const sma = mainChart.addLineSeries({ color: "blue" });
      sma.setData(indicators.sma);
    }

    if (toggles.ema) {
      const ema = mainChart.addLineSeries({ color: "orange" });
      ema.setData(indicators.ema);
    }

    if (toggles.vwap) {
      const vwap = mainChart.addLineSeries({ color: "purple" });
      vwap.setData(indicators.vwap);
    }

    if (toggles.bb) {
      const upper = mainChart.addLineSeries({ color: "green" });
      const lower = mainChart.addLineSeries({ color: "red" });

      upper.setData(indicators.bb.map((b) => ({ time: b.time, value: b.upper })));
      lower.setData(indicators.bb.map((b) => ({ time: b.time, value: b.lower })));
    }

    // RSI PANE
    if (toggles.rsi && rsiRef.current) {
      const rsiChart = createChart(rsiRef.current, {
        width: rsiRef.current.clientWidth,
        height: 150,
      });

      const rsiSeries = rsiChart.addLineSeries({ color: "teal" });
      rsiSeries.setData(indicators.rsi);
    }

    // MACD PANE
    if (toggles.macd && macdRef.current) {
      const macdChart = createChart(macdRef.current, {
        width: macdRef.current.clientWidth,
        height: 150,
      });

      const macdSeries = macdChart.addHistogramSeries({ color: "blue" });
      macdSeries.setData(indicators.macd.macd);

      const signalSeries = macdChart.addLineSeries({ color: "red" });
      signalSeries.setData(indicators.macd.signal);
    }
  }, [candles, indicators, toggles]);

  return (
    <div>
      <div ref={mainRef} style={{ width: "100%", height: "300px" }} />

      {toggles.rsi && (
        <div ref={rsiRef} style={{ width: "100%", height: "150px", marginTop: "20px" }} />
      )}

      {toggles.macd && (
        <div ref={macdRef} style={{ width: "100%", height: "150px", marginTop: "20px" }} />
      )}
    </div>
  );
}
