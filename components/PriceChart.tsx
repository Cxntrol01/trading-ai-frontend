"use client";

import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function PriceChart({ candles }) {
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

    const handleResize = () => {
      chart.applyOptions({ width: chartRef.current.clientWidth });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [candles]);

  return <div ref={chartRef} style={{ width: "100%", height: "300px" }} />;
}
