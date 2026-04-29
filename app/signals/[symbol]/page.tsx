import { supabase } from "@/lib/supabaseClient";
import MultiPaneChart from "@/components/MultiPaneChart";
import IndicatorToggles from "@/components/IndicatorToggles";
import AiIndicatorAnalysis from "@/components/AiIndicatorAnalysis";

import {
  calcSMA,
  calcEMA,
  calcVWAP,
  calcRSI,
  calcMACD,
  calcBollingerBands,
  calcATR,
  calcStochastic,
} from "@/lib/indicators";

import { detectSupportResistance, detectTrendlines } from "@/lib/structure";

export default async function SignalDetailPage({ params }) {
  const { data: candles } = await supabase
    .from("candles")
    .select("*")
    .eq("symbol", params.symbol)
    .order("time", { ascending: true });

  const formatted = candles.map((c) => ({
    time: c.time,
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
    volume: c.volume,
  }));

  const indicators = {
    sma: calcSMA(formatted),
    ema: calcEMA(formatted),
    vwap: calcVWAP(formatted),
    rsi: calcRSI(formatted),
    macd: calcMACD(formatted),
    bb: calcBollingerBands(formatted),
    atr: calcATR(formatted),
    stoch: calcStochastic(formatted),
  };

  const structure = {
    support: detectSupportResistance(formatted).filter((l) => l.type === "support"),
    resistance: detectSupportResistance(formatted).filter((l) => l.type === "resistance"),
    trend: detectTrendlines(formatted).slice(-1)[0].slope > 0 ? "up" : "down",
  };

  return (
    <div>
      <h1>{params.symbol} — Full Analysis</h1>

      <IndicatorToggles
        toggles={{
          sma: true,
          ema: true,
          vwap: false,
          bb: false,
          rsi: true,
          macd: true,
        }}
        setToggles={() => {}}
      />

      <MultiPaneChart
        candles={formatted}
        indicators={indicators}
        toggles={{
          sma: true,
          ema: true,
          vwap: false,
          bb: false,
          rsi: true,
          macd: true,
        }}
      />

      <AiIndicatorAnalysis indicators={indicators} structure={structure} />
    </div>
  );
}
