"use client";

import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function PriceChart({ candles, indicators }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 300,
      layout: { background: { color: "#ffffff" }, textColor: "#000" },
      grid: { vertLines: { color: "#eee" }, horzLines: { color: "#eee" } },
    });

    const candleSeries = chart.addCandlestickSeries();
    candleSeries.setData(candles);

    // --- INDICATORS ---
    if (indicators?.sma) {
      const smaSeries = chart.addLineSeries({ color: "blue", lineWidth: 2 });
      smaSeries.setData(indicators.sma);
    }

    if (indicators?.ema) {
      const emaSeries = chart.addLineSeries({ color: "orange", lineWidth: 2 });
      emaSeries.setData(indicators.ema);
    }

    if (indicators?.vwap) {
      const vwapSeries = chart.addLineSeries({ color: "purple", lineWidth: 2 });
      vwapSeries.setData(indicators.vwap);
    }

    const handleResize = () => {
      chart.applyOptions({ width: chartRef.current.clientWidth });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [candles, indicators]);

  return <div ref={chartRef} style={{ width: "100%", height: "300px" }} />;
}
