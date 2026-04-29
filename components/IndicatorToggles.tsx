"use client";

export default function IndicatorToggles({ toggles, setToggles }) {
  const toggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      {Object.keys(toggles).map((key) => (
        <button
          key={key}
          onClick={() => toggle(key)}
          style={{
            marginRight: "8px",
            background: toggles[key] ? "#333" : "#ddd",
            color: toggles[key] ? "#fff" : "#000",
            padding: "6px 12px",
            borderRadius: "6px",
          }}
        >
          {key.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
