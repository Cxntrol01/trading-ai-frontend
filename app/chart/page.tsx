"use client";

import { useEffect, useState } from "react";
import ChartWithIndicators from "@/components/ChartWithIndicators";
import { Candle } from "@/lib/structure";
import { fetchMassiveCandles } from "@/lib/massive";

export default function ChartPage() {
  const [symbol, setSymbol] = useState("AAPL");
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMassiveCandles(symbol, "minute", 300);
        if (!cancelled) setCandles(data);
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    // Re-poll every 30 seconds
    const interval = setInterval(load, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [symbol]);

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Massive.com (Delayed) Stock Chart</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="bg-black border border-gray-700 p-2 rounded"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="AAPL"
        />
      </div>

      {loading && <p className="text-gray-400 mb-2">Loading candles…</p>}
      {error && <p className="text-red-400 mb-2">{error}</p>}

      {candles.length > 0 && <ChartWithIndicators candles={candles} />}
    </main>
  );
}
