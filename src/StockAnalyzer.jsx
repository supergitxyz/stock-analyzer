import React, { useState } from "react";

// Real data, formatted to the exact spec built & tested in Project 0.4:
// Tailwinds / Risks / Watch closely / Valuation vs peers.
// One sentence per point, source tag, no repeated facts.

const BRIEFS = {
  TSLA: {
    name: "Tesla Inc.",
    tailwinds: [
      "Record Q2 deliveries driven by aggressive price cuts show demand elasticity remains intact (market coverage, Aug 2026)",
      "Robotaxi and Optimus robot programs remain the core long-term growth narrative driving bull cases (market coverage, Aug 2026)",
    ],
    risks: [
      "Margins fell even as shipments hit records, with much of the revenue lift tied to one-time tariff and warranty benefits (market coverage, Aug 2026)",
      "Trades near 300x trailing earnings despite falling profits; roughly a third of analysts rate it Sell (market coverage, Aug 2026)",
      "Chinese rivals like BYD are squeezing the core auto business while robotaxi and humanoid bets stay pre-revenue (market coverage, Aug 2026)",
    ],
    watch: "Next quarterly earnings and delivery guidance — the market's sensitivity to margin trends is the key swing factor.",
    valuation: "TSLA's ~300x trailing P/E dwarfs traditional automakers like Ford and GM, trading in single digits — the entire premium is a bet on robotaxi and AI optionality, not current auto economics.",
  },
  GLW: {
    name: "Corning Inc.",
    tailwinds: [
      "Meta signed a $6B multi-year fiber deal, with two more hyperscalers reportedly signing similar deals (Corning Q1 call)",
      "NVIDIA took a $500M equity/warrant stake in May, reinforcing Corning's AI-infrastructure role (Photoncap)",
      "China-tariff headlines are boosting optical stocks broadly — GLW rose 9.6% on Aug 4 alone (CNN)",
    ],
    risks: [
      "Trading at 67x trailing P/E, far above historical average after an 83% YTD run (Robinhood)",
      "Stock dropped 12% after last earnings despite a headline beat, showing guidance sensitivity (StockAnalysis)",
      "New U.S. tariffs on polysilicon, a key input material, could raise costs (CNBC)",
    ],
    watch: "Q3 earnings in late October — the market has punished soft guidance even on beats.",
    valuation: "GLW's 67x trailing P/E sits above Amphenol (~43x) but below Lumentum (~134x) — priced as a newer AI-infrastructure entrant, not an established one.",
  },
  AAPL: {
    name: "Apple Inc.",
    tailwinds: [
      "Q3 revenue rose 16% to $109.4B with EPS up 29% to $2.02, beating expectations (Simply Wall St, Aug 2026)",
      "Mac lineup lead times stretched to weeks or months, a signal demand is outrunning supply (Wedbush)",
      "Technical models turned bullish, with one upgrading AAPL from Sell to Buy this week (StockInvest.us, Aug 2026)",
    ],
    risks: [
      "Trades near 34-35x forward earnings, rich given decelerating Services growth and thin free-cash-flow yield (Seeking Alpha, Aug 2026)",
      "AI strategy remains defensive and dependent on competitors, with no clear monetization path yet (Simply Wall St, Aug 2026)",
      "CEO transition this September adds leadership uncertainty at a pivotal product moment (Seeking Alpha, Jun 2026)",
    ],
    watch: "iPhone 18 launch details over the next 6-8 weeks — seen as the real test of the current rally.",
    valuation: "AAPL's ~35x forward P/E sits above the broader market average, priced for AI catch-up that hasn't been proven yet.",
  },
};

export default function StockAnalyzer() {
  const [ticker, setTicker] = useState("TSLA");
  const b = BRIEFS[ticker];

  return (
    <div className="wrap">
      <style>{css}</style>
      <p className="eyebrow">STOCK ANALYZER · WATCHLIST DECISION FORMAT</p>
      <h1>{b.name} <span className="tk">({ticker})</span></h1>
      <p className="sub">6–12 month watchlist read — tailwinds, risks, what to watch, and valuation vs. peers.</p>

      <div className="ticker-row">
        {Object.keys(BRIEFS).map((sym) => (
          <button key={sym} className={"tbtn " + (sym === ticker ? "active" : "")} onClick={() => setTicker(sym)}>
            {sym}
          </button>
        ))}
      </div>

      <Section title="Tailwinds" items={b.tailwinds} tone="pos" />
      <Section title="Risks" items={b.risks} tone="neg" />

      <div className="single-block">
        <p className="block-label">Watch closely</p>
        <p className="block-text">{b.watch}</p>
      </div>
      <div className="single-block">
        <p className="block-label">Valuation vs. peers</p>
        <p className="block-text">{b.valuation}</p>
      </div>

      <p className="footnote">
        Data as of Aug 9, 2026 · Sample briefs in the tested Project 0.4 format · Live search is the next build ·{" "}
        <a className="repo-link" href="https://github.com/supergitxyz/stock-analyzer" target="_blank" rel="noreferrer">
          How this was built ↗
        </a>
      </p>
    </div>
  );
}

function Section({ title, items, tone }) {
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
  .tk { color:#8A8F98; font-weight:500; font-size:20px; }
  .sub { font-size:13.5px; color:#8A8F98; margin:0 0 22px; }

  .ticker-row { display:flex; gap:8px; margin-bottom:26px; }
  .tbtn { font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:500; padding:8px 16px; border-radius:4px; border:1px solid #D8D6CE; background:#fff; color:#57554E; cursor:pointer; }
  .tbtn.active { background:#1B3A5C; color:#fff; border-color:#1B3A5C; }

  .section { margin-bottom:22px; }
  .section-title { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.05em; text-transform:uppercase; margin:0 0 10px; font-weight:700; }
  .section-title.pos { color:#1E7F4C; }
  .section-title.neg { color:#B23B3B; }
  .section ul { margin:0; padding-left:18px; }
  .section li { font-size:14.5px; color:#2C2B27; line-height:1.6; margin-bottom:8px; }

  .single-block { background:#fff; border:1px solid #E3E1D9; border-radius:6px; padding:14px 18px; margin-bottom:12px; }
  .block-label { font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:0.05em; text-transform:uppercase; color:#1B3A5C; margin:0 0 6px; font-weight:700; }
  .block-text { font-size:14.5px; color:#2C2B27; margin:0; line-height:1.55; }

  .footnote { margin-top:24px; font-size:12px; color:#8A8F98; font-style:italic; }
  .repo-link { color:#1B3A5C; text-decoration:underline; }

  @media (max-width:420px){
    .wrap { padding:28px 16px 48px; }
    h1 { font-size:23px; }
    .tk { font-size:16px; }
    .ticker-row { flex-wrap:wrap; }
    .tbtn { padding:8px 12px; font-size:12px; }
    .section li { font-size:13.5px; }
    .block-text { font-size:13.5px; }
  }
`;
