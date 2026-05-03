import { supabase } from "@/lib/supabaseClient";
import RealtimeSignals from "@/components/RealtimeSignals";

export default function TestResolve() {
  console.log('supabase', !!supabase);
  console.log('RealtimeSignals', !!RealtimeSignals);
  return null;
}
