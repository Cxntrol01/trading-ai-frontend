import { supabase } from "@/lib/supabaseClient";

export default async function DashboardPage() {
  const { data: signals, error } = await supabase
    .from("signals")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1>AI Trading Dashboard</h1>

      {error && <p>Error loading signals: {error.message}</p>}

      <pre>{JSON.stringify(signals, null, 2)}</pre>
    </div>
  );
}
