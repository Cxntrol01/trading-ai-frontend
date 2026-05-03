"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function PaperTradesPage() {
  const [trades, setTrades] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [entry, setEntry] = useState("");

  // Load trades on mount
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
      .channel("paper-trades-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "paper_trades" },
        (payload) => {
          setTrades((prev) => [payload.new, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "paper_trades" },
        (payload) => {
          setTrades((prev) =>
            prev.map((t) => (t.id === payload.new.id ? payload.new : t))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Open a trade
  const openTrade = async () => {
    if (!symbol.trim() || !entry.trim()) return;

    await supabase.from("paper_trades").insert([
      {
        symbol: symbol.toUpperCase(),
        entry: Number(entry),
        status: "open",
      },
    ]);

    setSymbol("");
    setEntry("");
  };

  // Close a trade
  const closeTrade = async (trade) => {
    const exit = Number(prompt("Exit price"));

    if (!exit) return;

    const pnl = exit - trade.entry;

    await supabase
      .from("paper_trades")
      .update({
        exit,
        pnl,
        status: "closed",
      })
      .eq("id", trade.id);
  };

  return (
    <div>
      <h1>Paper Trading</h1>

      <input
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Symbol (e.g. TSLA)"
      />

      <input
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Entry price"
        type="number"
      />

      <button onClick={openTrade}>Open Trade</button>

      <h2>Trades</h2>
      <ul>
        {trades.map((t) => (
          <li key={t.id}>
            {t.symbol} — {t.status} — Entry: {t.entry}
            {t.status === "open" && (
              <button onClick={() => closeTrade(t)}>Close</button>
            )}
            {t.status === "closed" && (
              <span> — Exit: {t.exit} — PnL: {t.pnl}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
