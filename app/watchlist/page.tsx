import { supabase } from "@/lib/supabaseClient";

export default async function WatchlistPage() {
  const { data: watchlist } = await supabase
    .from("watchlist")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1>Your Watchlist</h1>
      <pre>{JSON.stringify(watchlist, null, 2)}</pre>
    </div>
  );
}
