"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PnlSummary() {
  const [stats, setStats] = useState({
    totalPnl: 0,
    openPnl: 0,
    closedPnl: 0,
    winRate: 0,
    avgWin: 0,
    avgLoss: 0,
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("paper_trades")
        .select("*");

      if (!data) return;

      const closed = data.filter((t) => t.status === "closed");
      const open = data.filter((t) => t.status === "open");

      const closedPnl = closed.reduce((sum, t) => sum + (t.pnl || 0), 0);
      const openPnl = open.reduce((sum, t) => {
        // If you later add live prices, update this
        return sum;
      }, 0);

      const
