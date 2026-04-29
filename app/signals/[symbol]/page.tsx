import { supabase } from "@/lib/supabaseClient";
import PriceChart from "@/components/PriceChart";
import AiAnalysis from "@/components/AiAnalysis";

export default async function SignalDetailPage({ params }) {
  const { data: signal } = await supabase
    .from("signals")
    .select("*")
    .eq("symbol", params.symbol)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const { data: candles } = await supabase
    .from("candles")
    .select("*")
    .eq("symbol", params.symbol)
    .order("time", { ascending: true });

  const formatted = (candles || []).map((c) => ({
    time: c.time,
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
  }));

  return (
    <div>
      <h1>{params.symbol} — Latest Signal</h1>

      <PriceChart candles={formatted} />

      <h2>Signal Data</h2>
      <pre>{JSON.stringify(signal, null, 2)}</pre>

      <AiAnalysis signal={signal} />
    </div>
  );
}
