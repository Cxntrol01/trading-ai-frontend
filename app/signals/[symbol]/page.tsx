import { supabase } from "@/lib/supabaseClient";

export default async function SignalDetailPage({ params }) {
  const { data: signal } = await supabase
    .from("signals")
    .select("*")
    .eq("symbol", params.symbol)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <div>
      <h1>Signal for {params.symbol}</h1>
      <pre>{JSON.stringify(signal, null, 2)}</pre>
    </div>
  );
}
