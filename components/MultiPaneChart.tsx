"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  LineStyle,
} from "lightweight-charts";

export default function MultiPaneChart({
  candles,
  indicators,
  toggles,
}) {
  const chartRef = useRef(null);
  const rsiRef = useRef(null);
  const macdRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // MAIN CHART
    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 450,
      layout: { background: { type: ColorType.Solid, color: "#0d0d0d" }, textColor: "#d1d1d1" },
      grid: { vertLines: { color: "#222" }, horzLines: { color: "#222" } },
      timeScale: { borderColor: "#333" },
      rightPriceScale: { borderColor: "#333" },
    });

    const candleSeries = chart.addCandlestickSeries();
    candleSeries.setData(candles);

    // SMA
    if (toggles.sma) {
      const smaSeries = chart.addLineSeries({ color: "#4caf50", lineWidth: 2 });
      smaSeries.setData(indicators.sma);
    }

    // EMA
    if (toggles.ema) {
      const emaSeries = chart.addLineSeries({ color: "#ff9800", lineWidth: 2 });
      emaSeries.setData(indicators.ema);
    }

    // VWAP
    if (toggles.vwap) {
      const vwapSeries = chart.addLineSeries({ color: "#03a9f4", lineWidth: 2 });
      vwapSeries.setData(indicators.vwap);
    }

    // Bollinger Bands
    if (toggles.bb) {
      const upper = chart.addLineSeries({ color: "#8884d8", lineWidth: 1 });
      const lower = chart.addLineSeries({ color: "#8884d8", lineWidth: 1 });
      upper.setData(indicators.bb.upper);
      lower.setData(indicators.bb.lower);
    }

    // Volume bars
    const volumeSeries = chart.addHistogramSeries({
      color: "#26a69a",
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });
    volumeSeries.setData(
      candles.map((c) => ({
        time: c.time,
        value: c.volume,
        color: c.close >= c.open ? "#26a69a" : "#ef5350",
      }))
    );

    // RSI CHART
    const rsiChart = createChart(rsiRef.current, {
      width: rsiRef.current.clientWidth,
      height: 150,
      layout: { background: { type: ColorType.Solid, color: "#0d0d0d" }, textColor: "#d1d1d1" },
      grid: { vertLines: { color: "#222" }, horzLines: { color: "#222" } },
      timeScale: { borderColor: "#333" },
      rightPriceScale: { borderColor: "#333" },
    });

    if (toggles.rsi) {
      const rsiSeries = rsiChart.addLineSeries({ color: "#ffeb3b", lineWidth: 2 });
      rsiSeries.setData(indicators.rsi);
    }

    // MACD CHART
    const macdChart = createChart(macdRef.current, {
      width: macdRef.current.clientWidth,
      height: 150,
      layout: { background: { type: ColorType.Solid, color: "#0d0d0d" }, textColor: "#d1d1d1" },
      grid: { vertLines: { color: "#222" }, horzLines: { color: "#222" } },
      timeScale: { borderColor: "#333" },
      rightPriceScale: { borderColor: "#333" },
    });

    if (toggles.macd) {
      const macdLine = macdChart.addLineSeries({ color: "#03a9f4", lineWidth: 2 });
      const signalLine = macdChart.addLineSeries({ color: "#e91e63", lineWidth: 2 });
      macdLine.setData(indicators.macd.macd);
      signalLine.setData(indicators.macd.signal);
    }

    return () => {
      chart.remove();
      rsiChart.remove();
      macdChart.remove();
    };
  }, [candles, indicators, toggles]);

  return (
    <div>
      <div ref={chartRef} style={{ width: "100%", marginBottom: "20px" }} />
      <div ref={rsiRef} style={{ width: "100%", marginBottom: "20px" }} />
      <div ref={macdRef} style={{ width: "100%" }} />
    </div>
  );
}
