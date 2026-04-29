"use client";

export default function IndicatorToggles({ toggles, setToggles }) {
  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleStyle =
    "flex items-center justify-between bg-[#111] border border-[#222] px-4 py-3 rounded-lg cursor-pointer hover:bg-[#1a1a1a] transition";

  return (
    <div className="grid grid-cols-2 gap-3 w-full mt-4">

      <div className={toggleStyle} onClick={() => handleToggle("sma")}>
        <span>SMA</span>
        <input type="checkbox" checked={toggles.sma} readOnly />
      </div>

      <div className={toggleStyle} onClick={() => handleToggle("ema")}>
        <span>EMA</span>
        <input type="checkbox" checked={toggles.ema} readOnly />
      </div>

      <div className={toggleStyle} onClick={() => handleToggle("vwap")}>
        <span>VWAP</span>
        <input type="checkbox" checked={toggles.vwap} readOnly />
      </div>

      <div className={toggleStyle} onClick={() => handleToggle("bb")}>
        <span>Bollinger Bands</span>
        <input type="checkbox" checked={toggles.bb} readOnly />
      </div>

      <div className={toggleStyle} onClick={() => handleToggle("rsi")}>
        <span>RSI</span>
        <input type="checkbox" checked={toggles.rsi} readOnly />
      </div>

      <div className={toggleStyle} onClick={() => handleToggle("macd")}>
        <span>MACD</span>
        <input type="checkbox" checked={toggles.macd} readOnly />
      </div>

      <div className={toggleStyle} onClick={() => handleToggle("patterns")}>
        <span>Patterns</span>
        <input type="checkbox" checked={toggles.patterns} readOnly />
      </div>

      <div className={toggleStyle} onClick={() => handleToggle("volumeProfile")}>
        <span>Volume Profile</span>
        <input type="checkbox" checked={toggles.volumeProfile} readOnly />
      </div>

    </div>
  );
}
