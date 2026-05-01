import ChartWithIndicators from "@/components/ChartWithIndicators";
import { Candle } from "@/lib/structure";

export default function ChartPage() {
  // Temporary mock data — replace with real feed later
  const candles: Candle[] = [
    { time: 1, open: 100, high: 105, low: 98, close: 102, volume: 1200 },
    { time: 2, open: 102, high: 108, low: 101, close: 107, volume: 1500 },
    { time: 3, open: 107, high: 110, low: 104, close: 105, volume: 900 },
    { time: 4, open: 105, high: 112, low: 103, close: 110, volume: 1800 },
  ];

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">AI Indicator Chart</h1>
      <ChartWithIndicators candles={candles} />
    </main>
  );
}
