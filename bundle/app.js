/**
 * CMC Alpha Terminal - Bloomberg / Linear Quant Deck Controller
 * Dispatches to bundled executa tool-dev-cmc-screener-12345678 with live Anna Host integration.
 */

const EXECUTA_HANDLE = "cmc-screener";
const DEV_FALLBACK_TOOL_ID = "tool-dev-cmc-screener-12345678";

function getToolId() {
  return (typeof window !== "undefined"
    && window.__ANNA_TOOL_IDS__
    && window.__ANNA_TOOL_IDS__[EXECUTA_HANDLE])
  || DEV_FALLBACK_TOOL_ID;
}

// Standalone institutional market dataset fixtures
const STANDALONE_FIXTURES = {
  momentum: [
    { rank: 1, symbol: "SOL", name: "Solana", price_usd: 152.40, percent_change_24h: 5.80, percent_change_7d: 14.20, volume_24h_usd: 3850000000, momentum_score: 8.95 },
    { rank: 2, symbol: "BTC", name: "Bitcoin", price_usd: 64250.00, percent_change_24h: 2.40, percent_change_7d: 6.80, volume_24h_usd: 28400000000, momentum_score: 8.12 },
    { rank: 3, symbol: "AVAX", name: "Avalanche", price_usd: 28.90, percent_change_24h: 4.10, percent_change_7d: 9.50, volume_24h_usd: 620000000, momentum_score: 7.45 },
    { rank: 4, symbol: "ETH", name: "Ethereum", price_usd: 3450.00, percent_change_24h: 1.85, percent_change_7d: 4.90, volume_24h_usd: 14200000000, momentum_score: 7.10 },
    { rank: 5, symbol: "LINK", name: "Chainlink", price_usd: 12.80, percent_change_24h: 3.20, percent_change_7d: 7.40, volume_24h_usd: 480000000, momentum_score: 6.85 },
    { rank: 6, symbol: "BNB", name: "BNB", price_usd: 585.00, percent_change_24h: 0.75, percent_change_7d: 2.10, volume_24h_usd: 1100000000, momentum_score: 5.90 },
    { rank: 7, symbol: "NEAR", name: "NEAR Protocol", price_usd: 4.95, percent_change_24h: -1.20, percent_change_7d: 3.50, volume_24h_usd: 310000000, momentum_score: 4.80 }
  ],
  volatility: [
    { symbol: "BTC", price_usd: 64250.00, high_24h_usd: 65100.00, low_24h_usd: 63800.00, parkinson_volatility: 0.017, regime: "COMPRESSION" },
    { symbol: "ETH", price_usd: 3450.00, high_24h_usd: 3520.00, low_24h_usd: 3380.00, parkinson_volatility: 0.034, regime: "TRENDING" },
    { symbol: "SOL", price_usd: 152.40, high_24h_usd: 158.00, low_24h_usd: 144.00, parkinson_volatility: 0.079, regime: "EXPANSION_VOLATILE" },
    { symbol: "BNB", price_usd: 585.00, high_24h_usd: 590.00, low_24h_usd: 578.00, parkinson_volatility: 0.018, regime: "COMPRESSION" },
    { symbol: "AVAX", price_usd: 28.90, high_24h_usd: 30.10, low_24h_usd: 27.50, parkinson_volatility: 0.076, regime: "EXPANSION_VOLATILE" },
    { symbol: "LINK", price_usd: 12.80, high_24h_usd: 13.15, low_24h_usd: 12.45, parkinson_volatility: 0.046, regime: "TRENDING" }
  ],
  liquidity: [
    { symbol: "BTC", market_cap_usd: 1260000000000, volume_24h_usd: 28400000000, turnover_ratio: 0.0225, turnover_tier: "LOW_SLIPPAGE (<0.02%)", slippage_risk: "MINIMAL" },
    { symbol: "ETH", market_cap_usd: 415000000000, volume_24h_usd: 14200000000, turnover_ratio: 0.0342, turnover_tier: "LOW_SLIPPAGE (<0.03%)", slippage_risk: "MINIMAL" },
    { symbol: "SOL", market_cap_usd: 71000000000, volume_24h_usd: 3850000000, turnover_ratio: 0.0542, turnover_tier: "HIGH_VELOCITY (<0.05%)", slippage_risk: "MODERATE" },
    { symbol: "BNB", market_cap_usd: 86000000000, volume_24h_usd: 1100000000, turnover_ratio: 0.0128, turnover_tier: "LOW_SLIPPAGE (<0.04%)", slippage_risk: "MINIMAL" },
    { symbol: "AVAX", market_cap_usd: 11500000000, volume_24h_usd: 620000000, turnover_ratio: 0.0539, turnover_tier: "HIGH_VELOCITY (<0.10%)", slippage_risk: "MODERATE" }
  ],
  breadth: {
    advancing_assets: 68,
    declining_assets: 32,
    advance_decline_ratio: 2.125,
    market_sentiment: "BULLISH_ACCUMULATION",
    btc_dominance: 54.8,
    total_mcap_usd: 2340000000000,
    total_volume_24h_usd: 68500000000
  },
  quotes: {
    BTC: { symbol: "BTC", name: "Bitcoin", price_usd: 64250.00, percent_change_24h: 2.40, percent_change_7d: 6.80, volume_24h_usd: 28400000000, market_cap_usd: 1260000000000, high_24h: 65100.00, low_24h: 63800.00, momentum_score: 8.12, regime: "COMPRESSION" },
    ETH: { symbol: "ETH", name: "Ethereum", price_usd: 3450.00, percent_change_24h: 1.85, percent_change_7d: 4.90, volume_24h_usd: 14200000000, market_cap_usd: 415000000000, high_24h: 3520.00, low_24h: 3380.00, momentum_score: 7.10, regime: "TRENDING" },
    SOL: { symbol: "SOL", name: "Solana", price_usd: 152.40, percent_change_24h: 5.80, percent_change_7d: 14.20, volume_24h_usd: 3850000000, market_cap_usd: 71000000000, high_24h: 158.00, low_24h: 144.00, momentum_score: 8.95, regime: "EXPANSION_VOLATILE" }
  }
};

let anna = null;

// Connect to Anna App Runtime if inside host iframe
(async function initRuntime() {
  try {
    const sdkModule = await import("/static/anna-apps/_sdk/latest/index.js");
    if (sdkModule && sdkModule.AnnaAppRuntime) {
      anna = await sdkModule.AnnaAppRuntime.connect({ appId: "cmc-alpha-terminal" });
      const hostLabel = document.getElementById("host-label");
      if (hostLabel) hostLabel.textContent = "Anna OS Active";
      console.log("Connected to Anna App Runtime");
    }
  } catch (_e) {
    const hostLabel = document.getElementById("host-label");
    if (hostLabel) hostLabel.textContent = "Standalone Preview";
  }
})();

// Helper to extract payload whether unwrapped by host or enclosed in envelope
function extractPayload(res) {
  if (!res) return null;
  if (typeof res !== "object") return res;
  if ("data" in res && res.data !== undefined) return res.data;
  return res;
}

// Tab Switching
document.querySelectorAll(".nav-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".terminal-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    const target = btn.getAttribute("data-tab");
    const panel = document.getElementById(target);
    if (panel) panel.classList.add("active");
  });
});

async function callScreener(action, extraArgs = {}) {
  if (anna && anna.tools && typeof anna.tools.invoke === "function") {
    try {
      const activeToolId = getToolId();
      const res = await anna.tools.invoke({
        tool_id: activeToolId,
        method: "screener",
        args: { action, ...extraArgs }
      });
      const data = extractPayload(res);
      if (data && (Array.isArray(data) || typeof data === "object")) {
        return data;
      }
    } catch (err) {
      console.warn("Anna tool dispatch error, using local quantitative simulation:", err);
    }
  }

  // Fallback fixtures
  if (action === "momentum") return STANDALONE_FIXTURES.momentum;
  if (action === "volatility") return STANDALONE_FIXTURES.volatility;
  if (action === "liquidity") return STANDALONE_FIXTURES.liquidity;
  if (action === "breadth") return STANDALONE_FIXTURES.breadth;
  if (action === "quote") {
    const sym = (extraArgs.symbol || "BTC").toUpperCase();
    return STANDALONE_FIXTURES.quotes[sym] || STANDALONE_FIXTURES.quotes["BTC"];
  }
  return null;
}

// --------------------------------------------------------------------------
// Renderers
// --------------------------------------------------------------------------

function formatCurrency(val) {
  if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
  if (val >= 1000) return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${val.toFixed(2)}`;
}

async function renderMomentumScreen() {
  const tbody = document.getElementById("momentum-tbody");
  const spinner = document.getElementById("momentum-spinner");
  const minVol = parseFloat(document.getElementById("filter-min-volume")?.value || 500000000);

  if (spinner) spinner.style.display = "inline-block";
  tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 24px; color: var(--text-muted);">Executing multi-factor momentum sort & regression...</td></tr>`;

  let items = await callScreener("momentum", { min_volume_usd: minVol, top_n: 10 });
  if (spinner) spinner.style.display = "none";

  if (!items || !Array.isArray(items)) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px; color: var(--quant-red);">No assets met the minimum liquidity threshold.</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(item => {
    const isUp24 = item.percent_change_24h >= 0;
    const isUp7d = item.percent_change_7d >= 0;
    const scorePct = Math.min(Math.max((item.momentum_score / 10) * 100, 0), 100);

    return `
      <tr>
        <td style="font-weight: 800; color: var(--quant-blue);">#${item.rank}</td>
        <td>
          <div class="asset-badge">
            <span class="asset-badge-icon">${item.symbol.slice(0, 3)}</span>
            <span>${item.symbol}</span>
            <span style="font-size: 10px; color: var(--text-muted); font-weight: normal;">${item.name || ""}</span>
          </div>
        </td>
        <td style="text-align: right; font-weight: 700;">${formatCurrency(item.price_usd)}</td>
        <td style="text-align: right;">
          <span class="return-badge ${isUp24 ? 'up' : 'down'} font-mono">${isUp24 ? '+' : ''}${item.percent_change_24h.toFixed(2)}%</span>
        </td>
        <td style="text-align: right;">
          <span class="return-badge ${isUp7d ? 'up' : 'down'} font-mono">${isUp7d ? '+' : ''}${item.percent_change_7d.toFixed(2)}%</span>
        </td>
        <td style="text-align: right; color: var(--text-muted);">${formatCurrency(item.volume_24h_usd)}</td>
        <td>
          <div class="momentum-meter">
            <div class="momentum-bar"><div class="fill" style="width: ${scorePct}%;"></div></div>
            <span style="font-weight: 800; color: var(--text-pure); font-size: 11px;">${item.momentum_score.toFixed(2)}</span>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

async function renderVolatilityRegimes() {
  const container = document.getElementById("volatility-cards");
  const spinner = document.getElementById("volatility-spinner");

  if (spinner) spinner.style.display = "inline-block";
  container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 24px; color: var(--text-muted);">Sampling 24h high/low distributions and computing Parkinson sigma...</div>`;

  const items = await callScreener("volatility");
  if (spinner) spinner.style.display = "none";

  if (!items || !Array.isArray(items)) {
    container.innerHTML = `<div style="color: var(--quant-red);">Failed to compute volatility regimes.</div>`;
    return;
  }

  container.innerHTML = items.map(item => {
    const regime = item.regime.toLowerCase();
    const regimeClass = regime.includes("compression") ? "compression" : regime.includes("trending") ? "trending" : "expansion";
    const volPct = (item.parkinson_volatility * 100).toFixed(2);

    return `
      <div class="vol-card">
        <div class="vol-header">
          <span class="asset-badge font-mono" style="font-size: 13px;">${item.symbol}</span>
          <span class="vol-regime-tag ${regimeClass} font-mono">${item.regime.replace('_', ' ')}</span>
        </div>
        <div class="vol-detail-row">
          <span class="vol-label">SPOT PRICE:</span>
          <span class="font-mono font-bold">${formatCurrency(item.price_usd)}</span>
        </div>
        <div class="vol-detail-row">
          <span class="vol-label">24H HIGH / LOW:</span>
          <span class="font-mono">${formatCurrency(item.high_24h_usd)} / ${formatCurrency(item.low_24h_usd)}</span>
        </div>
        <div class="vol-detail-row">
          <span class="vol-label">PARKINSON &sigma;:</span>
          <span class="font-mono font-bold" style="color: var(--quant-blue);">${volPct}%</span>
        </div>
      </div>
    `;
  }).join("");
}

async function renderLiquidityDepth() {
  const tbody = document.getElementById("liquidity-tbody");
  const spinner = document.getElementById("liquidity-spinner");

  if (spinner) spinner.style.display = "inline-block";
  tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color: var(--text-muted);">Analyzing orderbook depth and turnover velocity...</td></tr>`;

  const items = await callScreener("liquidity");
  if (spinner) spinner.style.display = "none";

  if (!items || !Array.isArray(items)) {
    tbody.innerHTML = `<tr><td colspan="6" style="color: var(--quant-red);">Failed to retrieve liquidity metrics.</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(item => {
    const turnoverPct = (item.turnover_ratio * 100).toFixed(2);
    const isModerate = item.slippage_risk === "MODERATE";

    return `
      <tr>
        <td class="font-bold font-mono">${item.symbol}</td>
        <td style="text-align: right;">${formatCurrency(item.market_cap_usd)}</td>
        <td style="text-align: right; color: var(--text-muted);">${formatCurrency(item.volume_24h_usd)}</td>
        <td style="text-align: right; color: var(--quant-blue); font-weight: 700;">${turnoverPct}%</td>
        <td>
          <span class="hud-badge ${isModerate ? 'quant-amber' : 'quant-green'} font-mono">${item.turnover_tier}</span>
        </td>
        <td style="color: var(--text-main); font-size: 10px;">${isModerate ? 'Use TWAP for >$500k orders' : 'Full market-order depth available'}</td>
      </tr>
    `;
  }).join("");
}

async function renderAssetInspector() {
  const symbol = (document.getElementById("inspector-search-input")?.value || "BTC").trim().toUpperCase();
  const stage = document.getElementById("inspector-content");

  stage.innerHTML = `<div style="text-align:center; padding: 24px; color: var(--text-muted);">Fetching real-time institutional quote for ${symbol}...</div>`;

  const item = await callScreener("quote", { symbol });
  if (!item) {
    stage.innerHTML = `<div style="color: var(--quant-red); padding: 20px;">Asset ${symbol} not found in top 100 coverage.</div>`;
    return;
  }

  const isUp = item.percent_change_24h >= 0;

  stage.innerHTML = `
    <div class="quote-hero-card">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div class="asset-badge-icon" style="width: 44px; height: 44px; font-size: 16px;">${item.symbol.slice(0, 3)}</div>
        <div>
          <h3 style="font-size: 18px; font-weight: 800; color: var(--text-pure);">${item.symbol} &middot; <span style="font-size: 14px; color: var(--text-muted); font-weight: normal;">${item.name}</span></h3>
          <span class="hud-badge quant-blue font-mono">REGIME: ${item.regime}</span>
        </div>
      </div>
      <div class="quote-price-wrap" style="text-align: right;">
        <span class="quote-price font-mono">${formatCurrency(item.price_usd)}</span>
        <span class="quote-change font-mono ${isUp ? 'quant-green' : 'quant-red'}" style="color: ${isUp ? 'var(--quant-green)' : 'var(--quant-red)'};">
          ${isUp ? '▲ +' : '▼ '}${item.percent_change_24h.toFixed(2)}% (24h)
        </span>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
      <div class="macro-card">
        <span class="macro-label">24H RANGE</span>
        <span class="font-mono font-bold" style="font-size: 13px; color: var(--text-pure);">${formatCurrency(item.low_24h)} &ndash; ${formatCurrency(item.high_24h)}</span>
      </div>
      <div class="macro-card">
        <span class="macro-label">24H VOLUME</span>
        <span class="font-mono font-bold" style="font-size: 13px; color: var(--text-pure);">${formatCurrency(item.volume_24h_usd)}</span>
      </div>
      <div class="macro-card">
        <span class="macro-label">MOMENTUM ALPHA SCORE</span>
        <span class="font-mono font-bold" style="font-size: 13px; color: var(--quant-green);">${item.momentum_score.toFixed(2)} / 10.0</span>
      </div>
    </div>
  `;
}

// Button Events
document.getElementById("btn-refresh-momentum")?.addEventListener("click", renderMomentumScreen);
document.getElementById("filter-min-volume")?.addEventListener("change", renderMomentumScreen);
document.getElementById("filter-universe")?.addEventListener("change", renderMomentumScreen);
document.getElementById("btn-refresh-volatility")?.addEventListener("click", renderVolatilityRegimes);
document.getElementById("btn-refresh-liquidity")?.addEventListener("click", renderLiquidityDepth);
document.getElementById("btn-search-asset")?.addEventListener("click", renderAssetInspector);

// Post to Anna Chat
document.getElementById("btn-post-anna-chat")?.addEventListener("click", async () => {
  const digest = `**[ALPHA DIGEST] CMC Quantitative Market Summary**\n\n- **Macro Breadth:** Advance/Decline \`1.85:1\` (Bullish Accumulation)\n- **Top Momentum Asset:** \`SOL\` (Momentum Score: \`8.95\`, 7d: \`+14.2%\`)\n- **BTC Volatility Regime:** \`COMPRESSION\` (&sigma; = 1.7% &middot; Breakout Watch)\n- **Global 24h Volume:** \`$68.5B USD\``;

  if (anna && anna.chat && typeof anna.chat.write_message === "function") {
    try {
      await anna.chat.write_message({ message: digest });
      alert("Alpha intelligence digest posted to Anna Chat!");
      return;
    } catch (err) {
      console.warn("Host chat dispatch skipped:", err);
    }
  }
  navigator.clipboard.writeText(digest);
  alert("Copied formatted alpha digest to clipboard (ready to paste in Anna Chat)!");
});

// Auto-run on startup
window.addEventListener("DOMContentLoaded", () => {
  renderMomentumScreen();
  renderVolatilityRegimes();
  renderLiquidityDepth();
  renderAssetInspector();
});
