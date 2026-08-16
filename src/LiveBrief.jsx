import React, { useState, useEffect } from "react";

const PROXY_BASE = "https://fmp-proxy.amitgupta-nine.workers.dev";
const STORAGE_KEY = "stockbrief:watchlist";

export default function LiveBrief() {
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [watchlist, setWatchlist] = useState([]);

  // Load saved watchlist once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setWatchlist(JSON.parse(saved));
    } catch (_) {
      // corrupted or unavailable storage — start empty rather than crash
    }
  }, []);

  function persist(next) {
    setWatchlist(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (_) {
      // storage full or blocked (e.g. private mode) — UI still works this session
    }
  }

  function toggleWatch(symbol) {
    if (!symbol) return;
    const next = watchlist.includes(symbol)
      ? watchlist.filter((s) => s !== symbol)
      : [...watchlist, symbol];
    persist(next);
  }

  async function search(symbolOverride) {
    const symbol = (symbolOverride || input).toUpperCase().trim();
    if (!symbol) return;

    setInput(symbol);
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`${PROXY_BASE}/brief?symbol=${encodeURIComponent(symbol)}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Something went wrong.");
      } else {
        setData(json);
      }
    } catch (_) {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const isWatched = data && watchlist.includes(data.symbol);

  return (
    <div className="wrap">
      <style>{css}</style>
      <p className="eyebrow">LIVE STOCK BRIEF</p>
      <h1>Search any ticker.</h1>
      <p className="sub">Real-time analysis — tailwinds, risks, what to watch, and valuation vs. peers.</p>

      <div className="search-row">
        <input
          className="search-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="e.g. NVDA"
          maxLength={10}
        />
        <button className="search-btn" onClick={() => search()} disabled={loading || !input.trim()}>
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </div>

      {watchlist.length > 0 && (
        <div className="watchlist">
          <p className="watch-label">Watchlist</p>
          <div className="chips">
            {watchlist.map((sym) => (
              <div key={sym} className="chip">
                <button className="chip-main" onClick={() => search(sym)} disabled={loading}>
                  {sym}
                </button>
                <button className="chip-x" onClick={() => toggleWatch(sym)} aria-label={`Remove ${sym}`}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="status">Searching current news and building the brief — this takes ~15 seconds.</div>
      )}

      {error && <div className="error">{error}</div>}

      {data && (
        <div className="result">
          <div className="head">
            <div>
              {data.name && <p className="name">{data.name}</p>}
              {data.hasQuote ? (
                <p className="price">
                  ${Number(data.price).toFixed(2)}
                  <span className={"chg " + (data.changePercentage >= 0 ? "up" : "down")}>
                    {data.changePercentage >= 0 ? "▲" : "▼"} {Math.abs(Number(data.changePercentage)).toFixed(2)}%
                  </span>
                </p>
              ) : (
                <p className="no-quote">Live price unavailable — analysis based on web sources</p>
              )}
            </div>
            <div className="head-right">
              <p className="sym">{data.symbol}</p>
              <button
                className={"star-btn " + (isWatched ? "on" : "")}
                onClick={() => toggleWatch(data.symbol)}
              >
                {isWatched ? "★ Saved" : "☆ Save"}
              </button>
            </div>
          </div>

          <Section title="Tailwinds" items={data.tailwinds} tone="pos" />
          <Section title="Risks" items={data.risks} tone="neg" />

          <div className="single-block">
            <p className="block-label">Watch closely</p>
            <p className="block-text">{data.watch}</p>
          </div>
          <div className="single-block">
            <p className="block-label">Valuation vs. peers</p>
            <p className="block-text">{data.valuation}</p>
          </div>

          <p className="footnote">
            Generated {new Date(data.generatedAt).toLocaleString()} · Not financial advice ·{" "}
            <a className="repo-link" href="https://github.com/supergitxyz/stock-analyzer" target="_blank" rel="noreferrer">
              How this was built ↗
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

function Section({ title, items, tone }) {
  if (!items || !items.length) return null;
  return (
    <div className="section">
      <p className={"section-title " + tone}>{title}</p>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
  * { box-sizing: border-box; }
  body { margin:0; }
  .wrap { max-width:620px; margin:0 auto; padding:40px 24px 60px; font-family:'Inter',sans-serif; background:#F5F5F2; min-height:100vh; }
  .eyebrow { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.08em; color:#1B3A5C; margin:0 0 10px; }
  h1 { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:28px; color:#14171C; margin:0 0 6px; }
  .sub { font-size:13.5px; color:#8A8F98; margin:0 0 22px; }

  .search-row { display:flex; gap:8px; margin-bottom:18px; }
  .search-input { flex:1; font-family:'JetBrains Mono',monospace; font-size:15px; padding:11px 14px; border:1px solid #D8D6CE; border-radius:4px; background:#fff; color:#14171C; text-transform:uppercase; }
  .search-input:focus { outline:none; border-color:#1B3A5C; }
  .search-btn { font-family:'Inter',sans-serif; font-size:14px; font-weight:600; padding:11px 20px; border-radius:4px; border:none; background:#1B3A5C; color:#fff; cursor:pointer; }
  .search-btn:disabled { background:#B0AEA6; cursor:not-allowed; }

  .watchlist { margin-bottom:22px; }
  .watch-label { font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:0.05em; text-transform:uppercase; color:#8A8F98; margin:0 0 8px; }
  .chips { display:flex; flex-wrap:wrap; gap:8px; }
  .chip { display:flex; align-items:stretch; border:1px solid #D8D6CE; border-radius:4px; overflow:hidden; background:#fff; }
  .chip-main { font-family:'JetBrains Mono',monospace; font-size:12.5px; font-weight:700; padding:6px 10px; border:none; background:none; color:#1B3A5C; cursor:pointer; }
  .chip-main:disabled { color:#B0AEA6; cursor:not-allowed; }
  .chip-x { border:none; background:none; color:#B0AEA6; font-size:15px; padding:0 8px; cursor:pointer; border-left:1px solid #EFEDE6; }
  .chip-x:hover { color:#B23B3B; }

  .status { font-size:13.5px; color:#8A8F98; font-style:italic; padding:14px 0; }
  .error { background:#F5DEDE; color:#8A2E2E; font-size:13.5px; padding:12px 14px; border-radius:4px; }

  .head { display:flex; justify-content:space-between; align-items:flex-start; padding-bottom:16px; border-bottom:1px solid #E3E1D9; margin-bottom:20px; }
  .head-right { text-align:right; }
  .name { font-size:13px; color:#8A8F98; margin:0 0 4px; }
  .price { font-family:'Space Grotesk',sans-serif; font-size:26px; font-weight:700; margin:0; color:#14171C; }
  .chg { font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:700; margin-left:10px; }
  .chg.up { color:#1E7F4C; }
  .chg.down { color:#B23B3B; }
  .sym { font-family:'JetBrains Mono',monospace; font-size:15px; font-weight:700; color:#1B3A5C; margin:0 0 6px; }
  .no-quote { font-size:13px; color:#8A8F98; font-style:italic; margin:0; }
  .star-btn { font-family:'Inter',sans-serif; font-size:12px; font-weight:600; padding:5px 10px; border-radius:4px; border:1px solid #D8D6CE; background:#fff; color:#8A8F98; cursor:pointer; white-space:nowrap; }
  .star-btn.on { border-color:#D9A441; color:#9A6B1A; background:#FDF6E7; }

  .section { margin-bottom:22px; }
  .section-title { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.05em; text-transform:uppercase; margin:0 0 10px; font-weight:700; }
  .section-title.pos { color:#1E7F4C; }
  .section-title.neg { color:#B23B3B; }
  .section ul { margin:0; padding-left:18px; }
  .section li { font-size:14.5px; color:#2C2B27; line-height:1.6; margin-bottom:8px; }

  .single-block { background:#fff; border:1px solid #E3E1D9; border-radius:6px; padding:14px 18px; margin-bottom:12px; }
  .block-label { font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:0.05em; text-transform:uppercase; color:#1B3A5C; margin:0 0 6px; font-weight:700; }
  .block-text { font-size:14.5px; color:#2C2B27; margin:0; line-height:1.55; }

  .footnote { margin-top:20px; font-size:12px; color:#8A8F98; font-style:italic; }
  .repo-link { color:#1B3A5C; text-decoration:underline; }

  @media (max-width:420px){
    .wrap { padding:28px 16px 48px; }
    h1 { font-size:23px; }
    .section li, .block-text { font-size:13.5px; }
    .price { font-size:22px; }
  }
`;
