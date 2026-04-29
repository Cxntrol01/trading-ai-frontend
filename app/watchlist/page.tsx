
import { supabase } from "@/lib/supabaseClient";

export default async function WatchlistPage() {
  const { data: watchlist, error } = await supabase
    .from("watchlist")
    .select("*");

  return (
    <div>
      <h1>Your Watchlist</h1>

      {error && <p>Error loading watchlist: {error.message}</p>}

      <pre>{JSON.stringify(watchlist, null, 2)}</pre>
    </div>
  );
}
