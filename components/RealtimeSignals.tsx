"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RealtimeSignals() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    // Load initial signals
    const loadSignals = async () => {
      const { data } = await supabase
        .from("signals")
        .select("*")
        .order("created_at", { ascending: false });
      setSignals(data || []);
    };

    loadSignals();

    // Subscribe to realtime inserts
    const channel = supabase
      .channel("signals-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "signals" },
        (payload) => {
          setSignals((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <pre>{JSON.stringify(signals, null, 2)}</pre>
  );
}
