"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [ticker, setTicker] = useState("");

  // Load initial watchlist + subscribe to realtime changes
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("watchlist")
        .select("*")
        .order("created_at", { ascending: false });

      setWatchlist(data || []);
    };

    load();

    // Realtime: INSERT + DELETE
    const channel = supabase
      .channel("watchlist-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "watchlist" },
        (payload) => {
          setWatchlist((prev) => [payload.new, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "watchlist" },
        (payload) => {
          setWatchlist((prev) => prev.filter((item) => item.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Add ticker
  const addTicker = async () => {
    if (!ticker.trim()) return;

    await supabase
      .from("watchlist")
      .insert([{ symbol: ticker.toUpperCase() }]);

    setTicker("");
  };

  // Remove ticker
  const removeTicker = async (id) => {
    await supabase.from("watchlist").delete().eq("id", id);
  };

  return (
    <div>
      <h1>Your Watchlist</h1>

      <input
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        placeholder="Enter ticker (e.g. AAPL)"
      />

      <button onClick={addTicker}>Add</button>

      <ul>
        {watchlist.map((item) => (
          <li key={item.id}>
            {item.symbol}
            <button onClick={() => removeTicker(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
