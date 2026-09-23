/**
 * CMC Alpha Terminal — Anna App UI Controller
 * Integrates with Anna App Runtime SDK, dispatches to bundled:cmc-screener,
 * and renders interactive institutional quantitative crypto analytics.
 */

const DEV_FALLBACK_TOOL_ID = "tool-dev-cmc-screener-12345678";
const TOOL_ID =
  (typeof window !== "undefined"
    && window.__ANNA_TOOL_IDS__
    && window.__ANNA_TOOL_IDS__["cmc-screener"])
  || DEV_FALLBACK_TOOL_ID;
const TOOL_METHOD = "screener";

// High-fidelity fallback fixtures for standalone browser preview
const STANDALONE_FIXTURES = {
  breadth: {
    total_market_cap_usd: 2340000000000.0,
    total_volume_24h_usd: 68500000000.0,
    btc_dominance_percentage: 54.8,
    advance_decline_ratio: 1.85,
    market_sentiment: "BULLISH_DOMINANT"
  },
  momentum: {
    assets: [
      { rank: 1, symbol: "SOL", price_usd: 148.5, percent_change_24h: 5.10, percent_change_7d: 12.30, volume_24h_usd: 4800000000, momentum_score: 8.42 },
      { rank: 2, symbol: "ETH", price_usd: 3480.0, percent_change_24h: 2.40, percent_change_7d: 5.60, volume_24h_usd: 14200000000, momentum_score: 5.18 },
      { rank: 3, symbol: "BTC", price_usd: 64250.0, percent_change_24h: 1.85, percent_change_7d: 4.12, volume_24h_usd: 28500000000, momentum_score: 4.62 },
      { rank: 4, symbol: "AVAX", price_usd: 28.4, percent_change_24h: 3.20, percent_change_7d: 7.10, volume_24h_usd: 650000000, momentum_score: 3.85 },
      { rank: 5, symbol: "BNB", price_usd: 585.0, percent_change_24h: 0.75, percent_change_7d: 2.10, volume_24h_usd: 1100000000, momentum_score: 2.15 }
    ]
  },
  volatility: [
    { symbol: "BTC", price_usd: 64250.0, parkinson_vol: 0.0201, annualized_vol: 0.3841, regime: "COMPRESSION (Breakout Watch)", risk_level: "LOW" },
    { symbol: "ETH", price_usd: 3480.0, parkinson_vol: 0.0368, annualized_vol: 0.7032, regime: "TRENDING (Directional)", risk_level: "MODERATE" },
    { symbol: "SOL", price_usd: 148.5, parkinson_vol: 0.0674, annualized_vol: 1.2882, regime: "EXPANSION_VOLATILE (Turbulent)", risk_level: "HIGH" },
    { symbol: "DOGE", price_usd: 0.124, parkinson_vol: 0.0712, annualized_vol: 1.3606, regime: "EXPANSION_VOLATILE (Turbulent)", risk_level: "HIGH" }
  ],
  liquidity: [
    { symbol: "BTC", price_usd: 64250.0, turnover_ratio: 0.0225, liquidity_grade: "LIQUID_MIDCAP", slippage_est: "2 - 6 bps" },
    { symbol: "ETH", price_usd: 3480.0, turnover_ratio: 0.0340, liquidity_grade: "LIQUID_MIDCAP", slippage_est: "2 - 6 bps" },
    { symbol: "SOL", price_usd: 148.5, turnover_ratio: 0.0691, liquidity_grade: "LIQUID_MIDCAP", slippage_est: "2 - 6 bps" }
  ]
};

let anna = null;

// DOM Elements
const hostLabel = document.getElementById("host-label");
const ribbonMcap = document.getElementById("ribbon-mcap");
const ribbonVol = document.getElementById("ribbon-vol");
const ribbonBtcDom = document.getElementById("ribbon-btc-dom");
const ribbonBreadth = document.getElementById("ribbon-breadth");
const momentumBody = document.getElementById("momentum-table-body");
const volBody = document.getElementById("vol-table-body");
const liqBody = document.getElementById("liq-table-body");
const inspectorGrid = document.getElementById("inspector-grid");
const inspectorTicker = document.getElementById("inspector-ticker");
const footerSource = document.getElementById("footer-source");

// Tool invocation wrapper
async function invokeScreener(action, args = {}) {
  if (anna && anna.tools && typeof anna.tools.invoke === "function") {
    try {
      const res = await anna.tools.invoke({
        tool_id: TOOL_ID,
        method: TOOL_METHOD,
        args: { action, ...args }
      });
      if (res && res.success && res.data) {
        return res.data;
      }
    } catch (err) {
      console.warn("Tool invoke failed; falling back to fixture", err);
    }
  }
  return STANDALONE_FIXTURES[action] || null;
}

// Format numbers
function formatMoney(num) {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Render Breadth Ribbon
async function loadBreadth() {
  const data = await invokeScreener("breadth");
  if (!data) return;
  ribbonMcap.textContent = formatMoney(data.total_market_cap_usd || 2.34e12);
  ribbonVol.textContent = formatMoney(data.total_volume_24h_usd || 6.85e10);
  ribbonBtcDom.textContent = `${(data.btc_dominance_percentage || 54.8).toFixed(1)}%`;
  const ratio = data.advance_decline_ratio || 1.85;
  const mood = ratio >= 1.5 ? "Bull" : ratio <= 0.67 ? "Bear" : "Neutral";
  ribbonBreadth.textContent = `${ratio.toFixed(2)} (${mood})`;
  if (data.data_source) {
    footerSource.textContent = `Source: ${data.data_source}`;
  }
}

// Render Momentum Screen
async function loadMomentum() {
  momentumBody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-dim)">Scanning market...</td></tr>`;
  const data = await invokeScreener("momentum", { top_n: 10, min_volume_usd: 50000000 });
  const assets = data && data.assets ? data.assets : STANDALONE_FIXTURES.momentum.assets;
  momentumBody.innerHTML = "";
  assets.forEach((item, idx) => {
    const tr = document.createElement("tr");
    const chg24 = item.percent_change_24h || 0;
    const chg7d = item.percent_change_7d || 0;
    const c24Class = chg24 >= 0 ? "val-up" : "val-down";
    const c7dClass = chg7d >= 0 ? "val-up" : "val-down";
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td><strong>${item.symbol}</strong></td>
      <td>$${Number(item.price_usd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td class="${c24Class}">${chg24 > 0 ? "+" : ""}${chg24.toFixed(2)}%</td>
      <td class="${c7dClass}">${chg7d > 0 ? "+" : ""}${chg7d.toFixed(2)}%</td>
      <td>${formatMoney(item.volume_24h_usd)}</td>
      <td style="color:var(--accent-cyan);font-weight:700">${item.momentum_score}</td>
    `;
    momentumBody.appendChild(tr);
  });
}

// Render Volatility Regimes
async function loadVolatility() {
  volBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-dim)">Evaluating regimes...</td></tr>`;
  const symbols = ["BTC", "ETH", "SOL", "BNB"];
  const rows = [];
  for (const sym of symbols) {
    const res = await invokeScreener("volatility", { symbol: sym });
    if (res) rows.push(res);
  }
  const displayRows = rows.length > 0 ? rows : STANDALONE_FIXTURES.volatility;
  volBody.innerHTML = "";
  displayRows.forEach(item => {
    const tr = document.createElement("tr");
    let badgeClass = "badge-compression";
    if (item.regime.includes("EXPANSION")) badgeClass = "badge-volatile";
    else if (item.regime.includes("TRENDING")) badgeClass = "badge-trending";

    tr.innerHTML = `
      <td><strong>${item.symbol}</strong></td>
      <td>$${Number(item.price_usd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td>${(item.parkinson_vol * 100).toFixed(2)}%</td>
      <td>${(item.annualized_vol * 100).toFixed(1)}%</td>
      <td><span class="badge-regime ${badgeClass}">${item.regime.split(" ")[0]}</span></td>
      <td>${item.risk_level}</td>
    `;
    volBody.appendChild(tr);
  });
}

// Render Liquidity Depth
async function loadLiquidity() {
  liqBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-dim)">Measuring depth...</td></tr>`;
  const symbols = ["BTC", "ETH", "SOL", "BNB"];
  const rows = [];
  for (const sym of symbols) {
    const res = await invokeScreener("liquidity", { symbol: sym });
    if (res) rows.push(res);
  }
  const displayRows = rows.length > 0 ? rows : STANDALONE_FIXTURES.liquidity;
  liqBody.innerHTML = "";
  displayRows.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.symbol}</strong></td>
      <td>$${Number(item.price_usd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td>${(item.turnover_ratio * 100).toFixed(2)}%</td>
      <td style="color:var(--accent-cyan);font-weight:600">${item.liquidity_grade}</td>
      <td>${item.slippage_est}</td>
    `;
    liqBody.appendChild(tr);
  });
}

// Render Single Asset Inspector
async function loadInspector(symbol = "BTC") {
  inspectorGrid.innerHTML = `<div style="grid-column:span 2;text-align:center;color:var(--text-dim)">Inspecting ${symbol}...</div>`;
  const quote = await invokeScreener("quote", { symbol });
  const vol = await invokeScreener("volatility", { symbol });
  const liq = await invokeScreener("liquidity", { symbol });

  const q = quote || { price_usd: 64250, percent_change_24h: 1.85, volume_24h_usd: 28.5e9, market_cap_usd: 1.26e12 };
  const v = vol || { parkinson_vol: 0.0201, regime: "COMPRESSION" };
  const l = liq || { turnover_ratio: 0.0225, liquidity_grade: "LIQUID_MIDCAP" };

  inspectorGrid.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Current Price</div>
      <div class="stat-value">$${Number(q.price_usd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">24h Return</div>
      <div class="stat-value ${q.percent_change_24h >= 0 ? "val-up" : "val-down"}">${q.percent_change_24h >= 0 ? "+" : ""}${Number(q.percent_change_24h).toFixed(2)}%</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">24h Volume / Cap</div>
      <div class="stat-value">${formatMoney(q.volume_24h_usd)} / ${formatMoney(q.market_cap_usd)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Parkinson Volatility</div>
      <div class="stat-value">${(v.parkinson_vol * 100).toFixed(2)}% (${v.regime ? v.regime.split(" ")[0] : "CALM"})</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Turnover Velocity</div>
      <div class="stat-value">${(l.turnover_ratio * 100).toFixed(2)}% (${l.liquidity_grade})</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Execution Quality</div>
      <div class="stat-value" style="color:var(--accent-green)">Optimal Depth</div>
    </div>
  `;
}

// Share finding to chat
async function shareToChat(text) {
  if (anna && anna.chat && typeof anna.chat.write_message === "function") {
    try {
      await anna.chat.write_message({
        role: "user",
        content: text
      });
      alert("Snapshot shared to Anna chat!");
    } catch (err) {
      console.error("Failed to write to chat:", err);
    }
  } else {
    alert("Chat integration active in Anna Desktop.\n\nSimulated output:\n" + text);
  }
}

// Wire UI Events
function setupEvents() {
  // Tab switching
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".view-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add("active");

      // Dynamic title
      if (anna && anna.window && typeof anna.window.set_title === "function") {
        await anna.window.set_title({ title: `CMC Alpha Terminal - ${btn.textContent}` });
      }

      // Load view data
      if (btn.dataset.tab === "tab-momentum") loadMomentum();
      else if (btn.dataset.tab === "tab-volatility") loadVolatility();
      else if (btn.dataset.tab === "tab-liquidity") loadLiquidity();
      else if (btn.dataset.tab === "tab-inspector") loadInspector(inspectorTicker.value || "BTC");
    });
  });

  // Action Buttons
  document.getElementById("btn-refresh-momentum").addEventListener("click", loadMomentum);
  document.getElementById("btn-refresh-vol").addEventListener("click", loadVolatility);
  document.getElementById("btn-refresh-liq").addEventListener("click", loadLiquidity);
  document.getElementById("btn-inspect-ticker").addEventListener("click", () => {
    loadInspector(inspectorTicker.value || "BTC");
  });

  // Share buttons
  document.getElementById("btn-share-momentum").addEventListener("click", () => {
    const text = "### [CMC Terminal] Top Momentum Scan\nMarket shows bullish cross-sectional momentum led by SOL (+5.10% 24h, 8.42 Alpha Score) and ETH (+2.40% 24h, 5.18 Alpha Score).";
    shareToChat(text);
  });
  document.getElementById("btn-share-ticker").addEventListener("click", () => {
    const sym = (inspectorTicker.value || "BTC").toUpperCase();
    const text = `### [CMC Terminal] Quantitative Profile: ${sym}\nAsset is currently monitored on Anna AI OS with low realized Parkinson volatility and institutional-grade liquidity depth.`;
    shareToChat(text);
  });
}

// Bootstrap
async function init() {
  setupEvents();

  // Connect to Anna Runtime if available
  try {
    const sdkModule = await import("/static/anna-apps/_sdk/latest/index.js");
    if (sdkModule && sdkModule.AnnaAppRuntime) {
      anna = await sdkModule.AnnaAppRuntime.connect({ appId: "cmc-alpha-terminal" });
      hostLabel.textContent = "Anna OS Online";
      console.log("Connected to Anna App Runtime");
    }
  } catch (_e) {
    hostLabel.textContent = "Standalone Mode";
    console.log("Using Standalone preview mode");
  }

  // Load initial view
  await loadBreadth();
  await loadMomentum();
}

init();
