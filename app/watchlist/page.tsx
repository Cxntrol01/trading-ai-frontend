"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [ticker, setTicker] = useState("");

  // Load watchlist on mount
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("watchlist")
        .select("*")
        .order("created_at", { ascending: false });

      setWatchlist(data || []);
    };

    load();
  }, []);

  // Add ticker
  const addTicker = async () => {
    if (!ticker.trim()) return;

    const { data, error } = await supabase
      .from("watchlist")
      .insert([{ symbol: ticker.toUpperCase() }])
      .select()
      .single();

    if (!error) {
      setWatchlist((prev) => [data, ...prev]);
      setTicker("");
    }
  };

  // Remove ticker
  const removeTicker = async (id) => {
    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("id", id);

    if (!error) {
      setWatchlist((prev) => prev.filter((item) => item.id !== id));
    }
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
