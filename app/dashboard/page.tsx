import RealtimeSignals from "../../components/RealtimeSignals";
import PnlSummary from "@/components/PnlSummary";

export default function DashboardPage() {
  return (
    <div>
      <h1>AI Trading Dashboard</h1>

      <PnlSummary />

      <h2>Live Signals</h2>
      <RealtimeSignals />
    </div>
  );
}
