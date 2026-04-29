"use client";

import { useState } from "react";

export default function AiAnalysis({ signal }) {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);

    // Placeholder until we connect your AI endpoint
    const fake = `
Trend: ${signal.trend || "Unknown"}
Support: ${signal.support || "Not detected"}
Resistance: ${signal.resistance || "Not detected"}
Risk Level: Medium
Summary: This signal suggests a potential move based on recent structure.
    `;

    setTimeout(() => {
      setAnalysis(fake);
      setLoading(false);
    }, 800);
  };

  return (
    <div>
      <h2>AI Analysis</h2>

      <button onClick={runAnalysis} disabled={loading}>
        {loading ? "Analyzing..." : "Run AI Analysis"}
      </button>

      {analysis && <pre>{analysis}</pre>}
    </div>
  );
}
