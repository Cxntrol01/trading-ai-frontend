"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PnlSummary() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("paper_trades")
        .select("*")
        .order("created_at", { ascending: false });

      setTrades(data || []);
    };

    load();

    // Realtime updates
    const channel = supabase
      .channel("paper-trades-summary")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "paper_trades" },
        (payload) => {
          // Reload all trades on any change
          load();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Calculations
  const closed = trades.filter((t) => t.status === "closed");
  const open = trades.filter((t) => t.status === "open");

  const totalPnl = closed.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const openPnl = open.reduce((sum, t) => sum + ((t.current_price || 0) - t.entry), 0);

  const wins = closed.filter((t) => t.pnl > 0);
  const losses = closed.filter((t) => t.pnl < 0);

  const winRate = closed.length > 0 ? (wins.length / closed.length) * 100 : 0;
  const avgWin = wins.length > 0 ? wins.reduce((s, t) => s + t.pnl, 0) / wins.length : 0;
  const avgLoss = losses.length > 0 ? losses.reduce((s, t) => s + t.pnl, 0) / losses.length : 0;

  return (
    <div>
      <h2>PnL Summary</h2>

      <p>Total PnL: {totalPnl.toFixed(2)}</p>
      <p>Open PnL: {openPnl.toFixed(2)}</p>
      <p>Closed PnL: {totalPnl.toFixed(2)}</p>
      <p>Win Rate: {winRate.toFixed(1)}%</p>
      <p>Average Win: {avgWin.toFixed(2)}</p>
      <p>Average Loss: {avgLoss.toFixed(2)}</p>
    </div>
  );
}
