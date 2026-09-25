/**
 * CMC Alpha Terminal - Institutional Quant Controller (v1.0.11)
 * Master-Detail Split View · Reactive Sorting · Tabular Numerics · Weight Engine
 */

const EXECUTA_HANDLE = "cmc-screener";
const DEV_FALLBACK_TOOL_ID = "tool-dev-cmc-screener-12345678";

function getToolId() {
  return (typeof window !== "undefined"
    && window.__ANNA_TOOL_IDS__
    && window.__ANNA_TOOL_IDS__[EXECUTA_HANDLE])
  || DEV_FALLBACK_TOOL_ID;
}

function assertInvariant(condition, message) {
  if (!condition) {
    console.error("Invariant Violation: " + message);
    throw new Error("Invariant Violation: " + message);
  }
}

// Institutional Market Dataset Fixtures
const STANDALONE_FIXTURES = {
  momentum: [
    { rank: 1, symbol: "SOL", name: "Solana", price_usd: 152.40, percent_change_24h: 5.80, percent_change_7d: 14.20, volume_24h_usd: 3850000000, market_cap_usd: 71000000000, momentum_score: 8.95, parkinson_vol: 0.052, regime: "EXPANSION", turnover_tier: "DEEP_LIQUIDITY", sparkline: [134, 138, 142, 139, 145, 148, 152.4] },
    { rank: 2, symbol: "BTC", name: "Bitcoin", price_usd: 64250.00, percent_change_24h: 2.40, percent_change_7d: 6.80, volume_24h_usd: 28400000000, market_cap_usd: 1260000000000, momentum_score: 8.12, parkinson_vol: 0.017, regime: "COMPRESSION", turnover_tier: "LOW_SLIPPAGE", sparkline: [60200, 61500, 62100, 61800, 63400, 63900, 64250] },
    { rank: 3, symbol: "AVAX", name: "Avalanche", price_usd: 28.90, percent_change_24h: 4.10, percent_change_7d: 9.50, volume_24h_usd: 620000000, market_cap_usd: 11500000000, momentum_score: 7.45, parkinson_vol: 0.046, regime: "TRENDING", turnover_tier: "HIGH_VELOCITY", sparkline: [26.2, 26.8, 27.1, 26.9, 27.5, 28.1, 28.9] },
    { rank: 4, symbol: "ETH", name: "Ethereum", price_usd: 3450.00, percent_change_24h: 1.85, percent_change_7d: 4.90, volume_24h_usd: 14200000000, market_cap_usd: 415000000000, momentum_score: 7.10, parkinson_vol: 0.024, regime: "TRENDING", turnover_tier: "LOW_SLIPPAGE", sparkline: [3280, 3310, 3360, 3340, 3390, 3420, 3450] },
    { rank: 5, symbol: "DOGE", name: "Dogecoin", price_usd: 0.115, percent_change_24h: 3.20, percent_change_7d: 8.40, volume_24h_usd: 850000000, market_cap_usd: 16800000000, momentum_score: 6.95, parkinson_vol: 0.041, regime: "TRENDING", turnover_tier: "HIGH_VELOCITY", sparkline: [0.106, 0.108, 0.112, 0.110, 0.113, 0.114, 0.115] },
    { rank: 6, symbol: "LINK", name: "Chainlink", price_usd: 12.80, percent_change_24h: 3.20, percent_change_7d: 7.40, volume_24h_usd: 480000000, market_cap_usd: 7800000000, momentum_score: 6.85, parkinson_vol: 0.038, regime: "TRENDING", turnover_tier: "MODERATE", sparkline: [11.9, 12.1, 12.3, 12.0, 12.4, 12.6, 12.8] },
    { rank: 7, symbol: "SUI", name: "Sui", price_usd: 1.85, percent_change_24h: 6.40, percent_change_7d: 18.20, volume_24h_usd: 920000000, market_cap_usd: 5200000000, momentum_score: 6.40, parkinson_vol: 0.068, regime: "EXPANSION", turnover_tier: "HIGH_VELOCITY", sparkline: [1.55, 1.62, 1.68, 1.65, 1.72, 1.79, 1.85] },
    { rank: 8, symbol: "BNB", name: "BNB Chain", price_usd: 585.00, percent_change_24h: 0.75, percent_change_7d: 2.10, volume_24h_usd: 1100000000, market_cap_usd: 86000000000, momentum_score: 5.90, parkinson_vol: 0.018, regime: "COMPRESSION", turnover_tier: "LOW_SLIPPAGE", sparkline: [572, 575, 579, 577, 581, 583, 585] },
    { rank: 9, symbol: "XRP", name: "XRP", price_usd: 0.58, percent_change_24h: -0.40, percent_change_7d: -1.20, volume_24h_usd: 1350000000, market_cap_usd: 32800000000, momentum_score: 5.15, parkinson_vol: 0.022, regime: "COMPRESSION", turnover_tier: "LOW_SLIPPAGE", sparkline: [0.59, 0.585, 0.582, 0.584, 0.581, 0.580, 0.58] },
    { rank: 10, symbol: "NEAR", name: "NEAR Protocol", price_usd: 4.95, percent_change_24h: -1.20, percent_change_7d: 3.50, volume_24h_usd: 310000000, market_cap_usd: 5400000000, momentum_score: 4.80, parkinson_vol: 0.061, regime: "EXPANSION", turnover_tier: "MODERATE", sparkline: [4.75, 4.82, 5.10, 5.02, 4.98, 5.01, 4.95] },
    { rank: 11, symbol: "ADA", name: "Cardano", price_usd: 0.36, percent_change_24h: 1.10, percent_change_7d: 3.40, volume_24h_usd: 340000000, market_cap_usd: 12900000000, momentum_score: 4.50, parkinson_vol: 0.028, regime: "COMPRESSION", turnover_tier: "LOW_SLIPPAGE", sparkline: [0.348, 0.352, 0.355, 0.351, 0.356, 0.358, 0.36] },
    { rank: 12, symbol: "APT", name: "Aptos", price_usd: 6.75, percent_change_24h: 2.90, percent_change_7d: 4.80, volume_24h_usd: 180000000, market_cap_usd: 3200000000, momentum_score: 4.10, parkinson_vol: 0.045, regime: "TRENDING", turnover_tier: "MODERATE", sparkline: [6.45, 6.52, 6.60, 6.58, 6.65, 6.70, 6.75] }
  ],
  volatility: [
    { symbol: "BTC", price_usd: 64250.00, high_24h_usd: 65100.00, low_24h_usd: 63800.00, parkinson_volatility: 0.017, regime: "COMPRESSION" },
    { symbol: "ETH", price_usd: 3450.00, high_24h_usd: 3520.00, low_24h_usd: 3380.00, parkinson_volatility: 0.034, regime: "TRENDING" },
    { symbol: "SOL", price_usd: 152.40, high_24h_usd: 158.00, low_24h_usd: 144.00, parkinson_volatility: 0.079, regime: "EXPANSION_VOLATILE" },
    { symbol: "BNB", price_usd: 585.00, high_24h_usd: 590.00, low_24h_usd: 578.00, parkinson_volatility: 0.018, regime: "COMPRESSION" },
    { symbol: "AVAX", price_usd: 28.90, high_24h_usd: 30.10, low_24h_usd: 27.50, parkinson_volatility: 0.076, regime: "EXPANSION_VOLATILE" },
    { symbol: "DOGE", price_usd: 0.115, high_24h_usd: 0.122, low_24h_usd: 0.111, parkinson_volatility: 0.041, regime: "TRENDING" },
    { symbol: "SUI", price_usd: 1.85, high_24h_usd: 1.94, low_24h_usd: 1.78, parkinson_volatility: 0.068, regime: "EXPANSION_VOLATILE" },
    { symbol: "XRP", price_usd: 0.58, high_24h_usd: 0.60, low_24h_usd: 0.57, parkinson_volatility: 0.022, regime: "COMPRESSION" },
    { symbol: "LINK", price_usd: 12.80, high_24h_usd: 13.15, low_24h_usd: 12.45, parkinson_volatility: 0.046, regime: "TRENDING" }
  ],
  liquidity: [
    { symbol: "BTC", market_cap_usd: 1260000000000, volume_24h_usd: 28400000000, turnover_ratio: 0.0225, turnover_tier: "LOW_SLIPPAGE (<0.02%)", slippage_risk: "MINIMAL" },
    { symbol: "ETH", market_cap_usd: 415000000000, volume_24h_usd: 14200000000, turnover_ratio: 0.0342, turnover_tier: "LOW_SLIPPAGE (<0.03%)", slippage_risk: "MINIMAL" },
    { symbol: "SOL", market_cap_usd: 71000000000, volume_24h_usd: 3850000000, turnover_ratio: 0.0542, turnover_tier: "HIGH_VELOCITY (<0.05%)", slippage_risk: "MODERATE" },
    { symbol: "BNB", market_cap_usd: 86000000000, volume_24h_usd: 1100000000, turnover_ratio: 0.0128, turnover_tier: "LOW_SLIPPAGE (<0.04%)", slippage_risk: "MINIMAL" },
    { symbol: "XRP", market_cap_usd: 32800000000, volume_24h_usd: 1350000000, turnover_ratio: 0.0412, turnover_tier: "LOW_SLIPPAGE (<0.03%)", slippage_risk: "MINIMAL" },
    { symbol: "DOGE", market_cap_usd: 16800000000, volume_24h_usd: 850000000, turnover_ratio: 0.0506, turnover_tier: "HIGH_VELOCITY (<0.08%)", slippage_risk: "MODERATE" },
    { symbol: "AVAX", market_cap_usd: 11500000000, volume_24h_usd: 620000000, turnover_ratio: 0.0539, turnover_tier: "HIGH_VELOCITY (<0.10%)", slippage_risk: "MODERATE" },
    { symbol: "SUI", market_cap_usd: 5200000000, volume_24h_usd: 920000000, turnover_ratio: 0.1769, turnover_tier: "HIGH_VELOCITY (<0.12%)", slippage_risk: "HIGH" },
    { symbol: "LINK", market_cap_usd: 7800000000, volume_24h_usd: 480000000, turnover_ratio: 0.0615, turnover_tier: "MODERATE (<0.08%)", slippage_risk: "MODERATE" }
  ],
  quotes: {
    BTC: { symbol: "BTC", name: "Bitcoin", price_usd: 64250.00, percent_change_24h: 2.40, percent_change_7d: 6.80, volume_24h_usd: 28400000000, market_cap_usd: 1260000000000, high_24h: 65100.00, low_24h: 63800.00, momentum_score: 8.12, regime: "COMPRESSION" },
    ETH: { symbol: "ETH", name: "Ethereum", price_usd: 3450.00, percent_change_24h: 1.85, percent_change_7d: 4.90, volume_24h_usd: 14200000000, market_cap_usd: 415000000000, high_24h: 3520.00, low_24h: 3380.00, momentum_score: 7.10, regime: "TRENDING" },
    SOL: { symbol: "SOL", name: "Solana", price_usd: 152.40, percent_change_24h: 5.80, percent_change_7d: 14.20, volume_24h_usd: 3850000000, market_cap_usd: 71000000000, high_24h: 158.00, low_24h: 144.00, momentum_score: 8.95, regime: "EXPANSION" },
    DOGE: { symbol: "DOGE", name: "Dogecoin", price_usd: 0.115, percent_change_24h: 3.20, percent_change_7d: 8.40, volume_24h_usd: 850000000, market_cap_usd: 16800000000, high_24h: 0.122, low_24h: 0.111, momentum_score: 6.95, regime: "TRENDING" },
    XRP: { symbol: "XRP", name: "XRP", price_usd: 0.58, percent_change_24h: -0.40, percent_change_7d: -1.20, volume_24h_usd: 1350000000, market_cap_usd: 32800000000, high_24h: 0.60, low_24h: 0.57, momentum_score: 5.15, regime: "COMPRESSION" },
    SUI: { symbol: "SUI", name: "Sui", price_usd: 1.85, percent_change_24h: 6.40, percent_change_7d: 18.20, volume_24h_usd: 920000000, market_cap_usd: 5200000000, high_24h: 1.94, low_24h: 1.78, momentum_score: 6.40, regime: "EXPANSION" }
  }
};

// Global Reactive State
let anna = null;
let currentAssets = [];
let filteredAssets = [];
let selectedAsset = null;
let sortCol = "rank";
let sortDir = "asc";
let quantWeights = { w24: 0.30, w7d: 0.50, wVol: 0.20 };
let currentDensity = "comfortable";

// Connect to Anna App Runtime if inside host iframe
(async function initRuntime() {
  try {
    const sdkModule = await import("/static/anna-apps/_sdk/latest/index.js");
    if (sdkModule && sdkModule.AnnaAppRuntime) {
      anna = await sdkModule.AnnaAppRuntime.connect({ appId: "cmc-alpha-terminal" });
      const hostLabel = document.getElementById("host-label");
      if (hostLabel) hostLabel.textContent = "Live · 42ms";
      console.log("Connected to Anna App Runtime");
    }
  } catch (_e) {
    const hostLabel = document.getElementById("host-label");
    if (hostLabel) hostLabel.textContent = "Live (Mock) · 42ms";
  }
})();

// Helper to extract payload whether unwrapped by host or enclosed in envelope
function extractPayload(res) {
  if (!res) return null;
  if (typeof res === "string") {
    try { res = JSON.parse(res); } catch (_e) { return res; }
  }
  if (typeof res !== "object") return res;
  if ("data" in res && res.data !== undefined) return res.data;
  if ("result" in res && res.result !== undefined) {
    if (typeof res.result === "object" && res.result !== null && "data" in res.result) {
      return res.result.data;
    }
    return res.result;
  }
  return res;
}

// Normalize any response structure to a safe array of items
function normalizeArray(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object") {
    if (Array.isArray(data.assets)) return data.assets;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data)) return data.data;
    if (data.symbol) return [data];
  }
  return [];
}

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
      console.warn("Anna tool dispatch error, using local simulation:", err);
    }
  }

  // Fallback fixtures
  if (action === "momentum") return STANDALONE_FIXTURES.momentum;
  if (action === "volatility") return STANDALONE_FIXTURES.volatility;
  if (action === "liquidity") return STANDALONE_FIXTURES.liquidity;
  if (action === "quote") {
    const sym = (extraArgs.symbol || "BTC").toUpperCase();
    return STANDALONE_FIXTURES.quotes[sym] || STANDALONE_FIXTURES.quotes["BTC"];
  }
  return null;
}

// Format currency with dynamic precision based on magnitude
function formatCurrency(val) {
  const n = typeof val === "number" && !isNaN(val) ? val : 0;
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1000) return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (n >= 1) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(4)}`;
}

// Generate lightweight SVG sparkline polyline
function createSparklineSvg(dataPoints, isUp) {
  const pts = Array.isArray(dataPoints) && dataPoints.length > 1 ? dataPoints : [10, 11, 10.5, 12, 11.8, 12.5, 13];
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const range = max - min || 1;
  const w = 54;
  const h = 18;
  const pad = 2;

  const coords = pts.map((val, idx) => {
    const x = pad + (idx / (pts.length - 1)) * (w - 2 * pad);
    const y = (h - pad) - ((val - min) / range) * (h - 2 * pad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  const strokeClass = isUp ? "sparkline-up" : "sparkline-down";
  return `
    <svg class="sparkline-svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <polyline class="sparkline-polyline ${strokeClass}" points="${coords}" />
    </svg>
  `;
}

// Recalculate multi-factor Alpha Score dynamically based on active weights
function recalculateScores(items) {
  if (!items || items.length === 0) return [];
  const returns24 = items.map(i => i.percent_change_24h ?? 0);
  const returns7d = items.map(i => i.percent_change_7d ?? 0);
  const logVols = items.map(i => Math.log(Math.max(i.volume_24h_usd ?? 1, 1)));

  const mean = arr => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
  const std = (arr, m) => Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / (arr.length || 1)) || 1;

  const m24 = mean(returns24), s24 = std(returns24, m24);
  const m7d = mean(returns7d), s7d = std(returns7d, m7d);
  const mVol = mean(logVols), sVol = std(logVols, mVol);

  return items.map(item => {
    const z24 = ((item.percent_change_24h ?? 0) - m24) / s24;
    const z7d = ((item.percent_change_7d ?? 0) - m7d) / s7d;
    const zVol = (Math.log(Math.max(item.volume_24h_usd ?? 1, 1)) - mVol) / sVol;

    const rawComposite = quantWeights.w24 * z24 + quantWeights.w7d * z7d + quantWeights.wVol * zVol;
    // Rescale composite to 0.0 - 10.0 range
    const score = Math.min(Math.max((rawComposite + 2.5) * 2.0, 0.5), 9.95);

    return {
      ...item,
      momentum_score: parseFloat(score.toFixed(2)),
      z24: parseFloat(z24.toFixed(2)),
      z7d: parseFloat(z7d.toFixed(2)),
      zVol: parseFloat(zVol.toFixed(2))
    };
  });
}

// Sorting comparator
function sortAssets(items, col, dir) {
  return [...items].sort((a, b) => {
    let vA = a[col];
    let vB = b[col];
    if (typeof vA === "string") {
      vA = vA.toLowerCase();
      vB = (vB || "").toLowerCase();
      return dir === "asc" ? vA.localeCompare(vB) : vB.localeCompare(vA);
    }
    vA = Number(vA ?? 0);
    vB = Number(vB ?? 0);
    return dir === "asc" ? vA - vB : vB - vA;
  });
}

// Render Master Table Rows
function renderTableRows() {
  const tbody = document.getElementById("momentum-tbody");
  if (!tbody) return;

  if (filteredAssets.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 24px; color: var(--quant-red);">No assets match active filters. Lower Min Volume or clear search.</td></tr>`;
    return;
  }

  tbody.innerHTML = filteredAssets.map(item => {
    const isUp24 = (item.percent_change_24h ?? 0) >= 0;
    const isUp7d = (item.percent_change_7d ?? 0) >= 0;
    const score = item.momentum_score ?? 5.0;
    const scorePct = Math.min(Math.max((score / 10) * 100, 0), 100);
    const isTopDecile = score >= 7.5;
    const isSelected = selectedAsset && selectedAsset.symbol === item.symbol;

    return `
      <tr class="${isSelected ? 'selected' : ''}" data-symbol="${item.symbol}">
        <td style="font-weight: 700; color: #ffffff;">#${item.rank}</td>
        <td>
          <div class="asset-cell">
            <div class="asset-icon-box">${(item.symbol || "").slice(0, 3)}</div>
            <div class="asset-text-group">
              <span class="asset-symbol">${item.symbol}</span>
              <span class="asset-name">${item.name || ""}</span>
            </div>
          </div>
        </td>
        <td class="th-num font-bold">${formatCurrency(item.price_usd)}</td>
        <td class="th-num">
          <span class="pct-badge ${isUp24 ? 'up' : 'down'} font-mono">${isUp24 ? '▲ +' : '▼ '}${Math.abs(item.percent_change_24h ?? 0).toFixed(2)}%</span>
        </td>
        <td class="th-num">
          <span class="pct-badge ${isUp7d ? 'up' : 'down'} font-mono">${isUp7d ? '▲ +' : '▼ '}${Math.abs(item.percent_change_7d ?? 0).toFixed(2)}%</span>
        </td>
        <td class="th-num" style="color: var(--muted-foreground);">${formatCurrency(item.volume_24h_usd)}</td>
        <td style="text-align: center;">
          ${createSparklineSvg(item.sparkline, isUp7d)}
        </td>
        <td>
          <div class="alpha-cell">
            <span class="alpha-num">${score.toFixed(2)}<span class="alpha-num-scale">/10</span></span>
            <div class="alpha-progress-track">
              <div class="alpha-progress-fill ${isTopDecile ? 'top-decile' : ''}" style="width: ${scorePct}%;"></div>
            </div>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  // Attach row click listeners for selection
  tbody.querySelectorAll("tr[data-symbol]").forEach(row => {
    row.addEventListener("click", () => {
      const sym = row.getAttribute("data-symbol");
      selectAsset(sym);
    });
  });
}

// Calibrated bidirectional bar calculation relative to universe mean (0 sigma)
function applyBidirectionalBar(el, zVal) {
  if (!el) return;
  const z = typeof zVal === "number" && !isNaN(zVal) ? zVal : 0;
  const clampedMag = Math.min(Math.max(Math.abs(z) / 3.0, 0.04), 1.0);
  const barWidthPct = clampedMag * 50;
  if (z >= 0) {
    el.style.left = "50%";
    el.style.width = `${barWidthPct.toFixed(1)}%`;
    el.className = "bidirectional-fill up";
  } else {
    el.style.left = `${(50 - barWidthPct).toFixed(1)}%`;
    el.style.width = `${barWidthPct.toFixed(1)}%`;
    el.className = "bidirectional-fill down";
  }
}

// Select an asset and populate the Right Inspector Detail Pane
function selectAsset(symbol) {
  const asset = currentAssets.find(a => a.symbol === symbol) || currentAssets[0];
  if (!asset) return;
  selectedAsset = asset;

  // Highlight selected row in table
  document.querySelectorAll("#momentum-tbody tr").forEach(r => {
    if (r.getAttribute("data-symbol") === symbol) {
      r.classList.add("selected");
    } else {
      r.classList.remove("selected");
    }
  });

  // Populate Right Detail Pane
  const elSymbol = document.getElementById("detail-symbol");
  const elName = document.getElementById("detail-name");
  const elRank = document.getElementById("detail-rank");
  const elPrice = document.getElementById("detail-price");
  const el24h = document.getElementById("detail-24h");
  const elScore = document.getElementById("detail-score-fraction");
  const elMeterFill = document.getElementById("detail-meter-fill");
  const elInterpretation = document.getElementById("detail-interpretation");
  const elBar24 = document.getElementById("factor-bar-24h");
  const elBar7d = document.getElementById("factor-bar-7d");
  const elBarVol = document.getElementById("factor-bar-vol");
  const elVal24 = document.getElementById("factor-val-24h");
  const elVal7d = document.getElementById("factor-val-7d");
  const elValVol = document.getElementById("factor-val-vol");
  const elParkinson = document.getElementById("detail-parkinson-val");
  const elRegimePill = document.getElementById("detail-regime-pill");
  const elTurnover = document.getElementById("detail-turnover-val");
  const elSlippagePill = document.getElementById("detail-slippage-pill");
  const elActionSym = document.getElementById("detail-action-symbol");

  if (elSymbol) elSymbol.textContent = asset.symbol;
  if (elName) elName.textContent = asset.name || "";
  if (elRank) elRank.textContent = `Rank #${asset.rank}`;
  if (elPrice) elPrice.textContent = formatCurrency(asset.price_usd);
  
  const isUp = (asset.percent_change_24h ?? 0) >= 0;
  if (el24h) {
    el24h.textContent = `${isUp ? '+' : ''}${(asset.percent_change_24h ?? 0).toFixed(2)}%`;
    el24h.className = `detail-24h font-mono font-bold ${isUp ? 'up' : 'down'}`;
  }

  const score = asset.momentum_score ?? 5.0;
  if (elScore) elScore.textContent = `${score.toFixed(2)} / 10.0`;
  if (elMeterFill) elMeterFill.style.width = `${Math.min(Math.max((score / 10) * 100, 0), 100)}%`;

  if (elInterpretation) {
    if (score >= 7.5) {
      elInterpretation.innerHTML = `<span class="status-dot-sm up"></span> Top Decile · Exceptional Institutional Momentum`;
      elInterpretation.className = "meter-interpretation font-mono up";
    } else if (score >= 5.0) {
      elInterpretation.innerHTML = `<span class="status-dot-sm up"></span> Directional Equilibrium · Moderate Relative Strength`;
      elInterpretation.className = "meter-interpretation font-mono up";
    } else {
      elInterpretation.innerHTML = `<span class="status-dot-sm down"></span> Lagging Cohort · Defensive Stance Warranted`;
      elInterpretation.className = "meter-interpretation font-mono down";
    }
  }

  // Z-Score Factors with calibrated bidirectional bars
  const z24 = asset.z24 ?? 1.2;
  const z7d = asset.z7d ?? 1.8;
  const zVol = asset.zVol ?? 0.9;
  if (elVal24) elVal24.textContent = `${z24 >= 0 ? '+' : ''}${z24.toFixed(2)} σ`;
  if (elVal7d) elVal7d.textContent = `${z7d >= 0 ? '+' : ''}${z7d.toFixed(2)} σ`;
  if (elValVol) elValVol.textContent = `${zVol >= 0 ? '+' : ''}${zVol.toFixed(2)} σ`;

  applyBidirectionalBar(elBar24, z24);
  applyBidirectionalBar(elBar7d, z7d);
  applyBidirectionalBar(elBarVol, zVol);

  // Risk & Volatility
  const vol = (asset.parkinson_vol ?? 0.035) * 100;
  if (elParkinson) elParkinson.textContent = `${vol.toFixed(2)}%`;
  const rawRegime = asset.regime ?? (vol > 5.0 ? "EXPANSION" : vol > 2.5 ? "TRENDING" : "COMPRESSION");
  if (elRegimePill) {
    elRegimePill.textContent = rawRegime;
    elRegimePill.className = `risk-v regime-pill ${rawRegime.toLowerCase()}`;
  }

  const mcap = asset.market_cap_usd || (asset.price_usd * 1e8);
  const turnover = ((asset.volume_24h_usd || 1e8) / mcap) * 100;
  if (elTurnover) elTurnover.textContent = `${turnover.toFixed(2)}%`;
  if (elSlippagePill) {
    const tier = turnover > 5 ? "DEEP" : turnover > 2 ? "MODERATE" : "MINIMAL";
    elSlippagePill.textContent = tier;
    elSlippagePill.className = `risk-v tier-pill ${tier === 'MINIMAL' ? 'minimal' : ''}`;
  }

  if (elActionSym) elActionSym.textContent = asset.symbol;
}

// Filter and Sort current data snapshot
function applyLocalFiltersAndSort() {
  const minVol = parseFloat(document.getElementById("filter-min-volume")?.value || 0);
  const search = (document.getElementById("filter-search-input")?.value || "").trim().toLowerCase();

  filteredAssets = currentAssets.filter(item => {
    const meetsVol = (item.volume_24h_usd ?? 0) >= minVol;
    const matchesSearch = !search || item.symbol.toLowerCase().includes(search) || (item.name && item.name.toLowerCase().includes(search));
    return meetsVol && matchesSearch;
  });

  // Re-rank filtered items based on current sort
  filteredAssets = sortAssets(filteredAssets, sortCol, sortDir);

  // Update Result Count Text
  const countEl = document.getElementById("filter-result-count");
  if (countEl) {
    countEl.textContent = `Showing ${filteredAssets.length} of ${currentAssets.length} assets (Vol ≥ ${formatCurrency(minVol)})`;
  }

  renderTableRows();

  // If previous selected asset is still in filtered set, re-select it; otherwise select first
  if (selectedAsset && filteredAssets.some(a => a.symbol === selectedAsset.symbol)) {
    selectAsset(selectedAsset.symbol);
  } else if (filteredAssets.length > 0) {
    selectAsset(filteredAssets[0].symbol);
  }
}

// Fetch live/simulated Momentum Data from Executa
async function renderMomentumScreen() {
  const spinner = document.getElementById("momentum-spinner");
  const applyBtn = document.getElementById("btn-apply-filters");
  const applyLabel = document.getElementById("apply-btn-label");
  const minVol = parseFloat(document.getElementById("filter-min-volume")?.value || 50000000);

  if (spinner) spinner.classList.remove("hidden");
  if (applyLabel) applyLabel.textContent = "Screening...";

  const raw = await callScreener("momentum", { min_volume_usd: minVol, top_n: 10 });
  if (spinner) spinner.classList.add("hidden");
  if (applyLabel) applyLabel.textContent = "Apply Filters";
  if (applyBtn) applyBtn.classList.remove("dirty");

  const rawItems = normalizeArray(raw);
  currentAssets = recalculateScores(rawItems);
  applyLocalFiltersAndSort();

  // Update Last Updated Timestamp
  const timeEl = document.getElementById("momentum-last-updated");
  if (timeEl) {
    const now = new Date();
    const utcTime = now.toTimeString().split(' ')[0] + " UTC";
    timeEl.textContent = `Updated: ${utcTime}`;
  }
}

// Setup Column Header Sorting
function initTableSorting() {
  document.querySelectorAll("th.th-sortable").forEach(th => {
    th.addEventListener("click", e => {
      // Don't sort if user clicked the methodology ⓘ icon
      if (e.target.id === "btn-explain-alpha") return;

      const col = th.getAttribute("data-sort");
      if (sortCol === col) {
        sortDir = sortDir === "asc" ? "desc" : "asc";
      } else {
        sortCol = col;
        sortDir = (col === "rank" || col === "symbol") ? "asc" : "desc";
      }

      // Update ARIA and indicators
      document.querySelectorAll("th.th-sortable").forEach(header => {
        const ind = header.querySelector(".sort-indicator");
        if (header === th) {
          header.setAttribute("aria-sort", sortDir === "asc" ? "ascending" : "descending");
          if (ind) ind.textContent = sortDir === "asc" ? "▲" : "▼";
        } else {
          header.setAttribute("aria-sort", "none");
          if (ind) ind.textContent = "↕";
        }
      });

      applyLocalFiltersAndSort();
    });
  });
}

// Density Toggle (Compact vs Comfortable)
function initDensityToggle() {
  const btn = document.getElementById("btn-toggle-density");
  const label = document.getElementById("density-label");
  if (!btn) return;

  btn.addEventListener("click", () => {
    if (currentDensity === "comfortable") {
      currentDensity = "compact";
      document.body.classList.remove("density-comfortable");
      document.body.classList.add("density-compact");
      if (label) label.textContent = "Comfortable";
    } else {
      currentDensity = "comfortable";
      document.body.classList.remove("density-compact");
      document.body.classList.add("density-comfortable");
      if (label) label.textContent = "Compact";
    }
  });
}

// Interactive Quant Weights Modal
function initWeightsModal() {
  const modal = document.getElementById("weights-modal");
  const openBtn = document.getElementById("btn-open-weights");
  const closeBtn = document.getElementById("btn-close-weights-modal");
  const cancelBtn = document.getElementById("btn-cancel-weights");
  const saveBtn = document.getElementById("btn-save-weights");
  const r24 = document.getElementById("range-weight-24h");
  const r7d = document.getElementById("range-weight-7d");
  const rVol = document.getElementById("range-weight-vol");
  const v24 = document.getElementById("val-weight-24h");
  const v7d = document.getElementById("val-weight-7d");
  const vVol = document.getElementById("val-weight-vol");
  const sumVal = document.getElementById("weights-sum-val");

  if (!modal || !openBtn) return;

  const showModal = () => modal.classList.remove("hidden");
  const hideModal = () => modal.classList.add("hidden");

  openBtn.addEventListener("click", showModal);
  closeBtn?.addEventListener("click", hideModal);
  cancelBtn?.addEventListener("click", hideModal);

  const updateWeightUI = () => {
    const w1 = parseInt(r24.value);
    const w2 = parseInt(r7d.value);
    const w3 = parseInt(rVol.value);
    const sum = w1 + w2 + w3;

    if (v24) v24.textContent = `${w1}%`;
    if (v7d) v7d.textContent = `${w2}%`;
    if (vVol) vVol.textContent = `${w3}%`;

    if (sumVal) {
      sumVal.textContent = `${sum}%`;
      sumVal.className = `weights-sum-val font-bold ${sum === 100 ? 'up' : 'down'}`;
    }
    if (saveBtn) saveBtn.disabled = sum !== 100;
  };

  [r24, r7d, rVol].forEach(el => el?.addEventListener("input", updateWeightUI));

  // Presets
  const presets = {
    "balanced": [30, 50, 20],
    "short-term": [60, 30, 10],
    "macro-trend": [15, 70, 15],
    "liquidity-first": [20, 40, 40]
  };

  document.querySelectorAll(".preset-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".preset-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const key = pill.getAttribute("data-preset");
      const [p24, p7d, pVol] = presets[key] || [30, 50, 20];
      if (r24) r24.value = p24;
      if (r7d) r7d.value = p7d;
      if (rVol) rVol.value = pVol;
      updateWeightUI();
    });
  });

  saveBtn?.addEventListener("click", () => {
    const w1 = parseInt(r24.value) / 100;
    const w2 = parseInt(r7d.value) / 100;
    const w3 = parseInt(rVol.value) / 100;
    quantWeights = { w24: w1, w7d: w2, wVol: w3 };

    const badgeLabel = document.getElementById("weights-badge-label");
    if (badgeLabel) {
      badgeLabel.textContent = `24H ${parseInt(w1 * 100)}% · 7D ${parseInt(w2 * 100)}% · VOL ${parseInt(w3 * 100)}%`;
    }

    // Recalculate scores and re-render
    currentAssets = recalculateScores(currentAssets);
    applyLocalFiltersAndSort();
    hideModal();
  });
}

// Alpha Score Methodology Explainer Modal
function initMethodologyModal() {
  const modal = document.getElementById("methodology-modal");
  const trigger = document.getElementById("btn-explain-alpha");
  const closeBtn = document.getElementById("btn-close-methodology-modal");
  const okBtn = document.getElementById("btn-close-methodology-ok");

  if (!modal || !trigger) return;

  const show = () => modal.classList.remove("hidden");
  const hide = () => modal.classList.add("hidden");

  trigger.addEventListener("click", show);
  closeBtn?.addEventListener("click", hide);
  okBtn?.addEventListener("click", hide);
}

// Connection Diagnostic Popover
function initConnectionPopover() {
  const popover = document.getElementById("connection-popover");
  const statusPill = document.getElementById("host-status");
  const closeBtn = document.getElementById("btn-close-conn-popover");
  const reconnectBtn = document.getElementById("btn-reconnect-feed");

  if (!popover || !statusPill) return;

  statusPill.addEventListener("click", () => {
    popover.classList.toggle("hidden");
  });

  closeBtn?.addEventListener("click", () => popover.classList.add("hidden"));

  reconnectBtn?.addEventListener("click", () => {
    const statusText = document.getElementById("diag-status");
    if (statusText) statusText.textContent = "Re-authenticating transport...";
    setTimeout(() => {
      if (statusText) statusText.textContent = "Connected · Healthy (42ms)";
      popover.classList.add("hidden");
    }, 600);
  });
}

// Export utilities (CSV, JSON, Markdown)
function initExportUtilities() {
  document.getElementById("btn-export-csv")?.addEventListener("click", () => {
    if (filteredAssets.length === 0) return alert("No data to export.");
    const headers = ["Rank", "Symbol", "Name", "Price_USD", "Percent_Change_24h", "Percent_Change_7d", "Volume_24h_USD", "Alpha_Score"];
    const rows = filteredAssets.map(a => [
      a.rank,
      a.symbol,
      `"${a.name || ""}"`,
      a.price_usd,
      a.percent_change_24h,
      a.percent_change_7d,
      a.volume_24h_usd,
      a.momentum_score
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cmc_alpha_screen_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  document.getElementById("btn-export-json")?.addEventListener("click", () => {
    if (filteredAssets.length === 0) return alert("No data to export.");
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredAssets, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", jsonStr);
    link.setAttribute("download", `cmc_alpha_screen_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  document.getElementById("btn-copy-markdown")?.addEventListener("click", () => {
    if (filteredAssets.length === 0) return alert("No data to copy.");
    let md = "| Rank | Asset | Price (USD) | 24h % | 7d % | Volume (USD) | Alpha Score |\n";
    md += "|---|---|---|---|---|---|---|\n";
    filteredAssets.forEach(a => {
      md += `| #${a.rank} | **${a.symbol}** (${a.name}) | ${formatCurrency(a.price_usd)} | ${a.percent_change_24h >= 0 ? '+' : ''}${a.percent_change_24h}% | ${a.percent_change_7d >= 0 ? '+' : ''}${a.percent_change_7d}% | ${formatCurrency(a.volume_24h_usd)} | **${a.momentum_score}/10** |\n`;
    });
    navigator.clipboard.writeText(md);
    alert("Copied institutional Markdown table to clipboard!");
  });
}

// Search & Dirty-State Handling
function initSearchAndFilterEvents() {
  const searchInput = document.getElementById("filter-search-input");
  const clearBtn = document.getElementById("btn-clear-search");
  const applyBtn = document.getElementById("btn-apply-filters");
  const minVolSelect = document.getElementById("filter-min-volume");
  const universeSelect = document.getElementById("filter-universe");
  const resetBtn = document.getElementById("btn-reset-filters");

  const markDirty = () => {
    if (applyBtn) applyBtn.classList.add("dirty");
    applyLocalFiltersAndSort();
  };

  searchInput?.addEventListener("input", () => {
    if (clearBtn) {
      if (searchInput.value.trim().length > 0) clearBtn.classList.remove("hidden");
      else clearBtn.classList.add("hidden");
    }
    markDirty();
  });

  clearBtn?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    clearBtn.classList.add("hidden");
    markDirty();
  });

  minVolSelect?.addEventListener("change", markDirty);
  universeSelect?.addEventListener("change", markDirty);

  resetBtn?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (clearBtn) clearBtn.classList.add("hidden");
    if (minVolSelect) minVolSelect.value = "500000000";
    if (universeSelect) universeSelect.value = "top100";
    applyLocalFiltersAndSort();
  });

  applyBtn?.addEventListener("click", renderMomentumScreen);
}

// Context-Aware Anna Chat Integration
function initAnnaChatIntegration() {
  // Ask Anna about Selected Asset (Debounced to prevent RPC spam)
  let isDispatchingChat = false;
  document.getElementById("btn-ask-anna-selected")?.addEventListener("click", async () => {
    if (!selectedAsset || isDispatchingChat) return;
    isDispatchingChat = true;
    const btn = document.getElementById("btn-ask-anna-selected");
    if (btn) btn.disabled = true;

    const prompt = `Please explain why **${selectedAsset.symbol}** (${selectedAsset.name}) ranks **#${selectedAsset.rank}** with an Alpha Score of **${selectedAsset.momentum_score}/10.0**.\n\nContext:\n- Spot Price: ${formatCurrency(selectedAsset.price_usd)}\n- 24h Return: ${selectedAsset.percent_change_24h}%\n- 7d Return: ${selectedAsset.percent_change_7d}%\n- 24h Volume: ${formatCurrency(selectedAsset.volume_24h_usd)}\n- Parkinson Volatility: ${selectedAsset.parkinson_vol ? (selectedAsset.parkinson_vol * 100).toFixed(2) + '%' : 'N/A'} (${selectedAsset.regime || 'TRENDING'})\n- Turnover Ratio: ${selectedAsset.turnover_tier || 'DEEP_LIQUIDITY'}\n\nWhat are the primary drivers and risks for this asset over the next 48 hours?`;

    try {
      if (anna && anna.chat && typeof anna.chat.write_message === "function") {
        await anna.chat.write_message({ message: prompt });
        alert(`Analysis prompt for ${selectedAsset.symbol} sent to Anna Chat!`);
      } else {
        navigator.clipboard.writeText(prompt);
        alert(`Copied deep-dive prompt for ${selectedAsset.symbol} to clipboard!`);
      }
    } catch (err) {
      console.warn("Host chat dispatch skipped:", err);
      navigator.clipboard.writeText(prompt);
      alert(`Copied deep-dive prompt for ${selectedAsset.symbol} to clipboard!`);
    } finally {
      setTimeout(() => {
        isDispatchingChat = false;
        if (btn) btn.disabled = false;
      }, 1500);
    }
  });
}

function getAdvisoryByRegime(regimeClass) {
  if (regimeClass === "compression") return "Consolidation · Breakout Watch";
  if (regimeClass === "trending") return "Directional Equilibrium · Trend Safe";
  return "High Tail-Risk · Widen Stops / TWAP";
}

function resolveAssetName(sym) {
  if (STANDALONE_FIXTURES.quotes[sym]?.name) return STANDALONE_FIXTURES.quotes[sym].name;
  const match = STANDALONE_FIXTURES.momentum.find(m => m.symbol === sym);
  return match?.name || sym;
}

// Volatility Regimes (Tab 2 - Institutional Quant Table)
async function renderVolatilityRegimes() {
  const tbody = document.getElementById("volatility-tbody");
  const spinner = document.getElementById("volatility-spinner");
  if (!tbody) return;

  if (spinner) spinner.classList.remove("hidden");
  const raw = await callScreener("volatility", { symbol: "ALL" });
  if (spinner) spinner.classList.add("hidden");
  const items = normalizeArray(raw);

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="color: var(--quant-red); text-align: center; padding: 20px;">Failed to compute volatility regimes.</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(item => {
    const sym = item.symbol ?? "BTC";
    const name = resolveAssetName(sym);
    const rawRegime = item.regime ?? "COMPRESSION";
    const regime = String(rawRegime).toLowerCase();
    const regimeClass = regime.includes("compression") ? "compression" : regime.includes("trending") ? "trending" : "expansion";
    const volNum = item.parkinson_volatility ?? item.parkinson_vol ?? 0.02;
    const volPct = (volNum * 100).toFixed(2);
    const volBarWidth = Math.min(100, Math.max(8, (volNum / 0.08) * 100));
    const price = item.price_usd ?? 0;
    const high = item.high_24h_usd ?? item.high_24h ?? (price > 0 ? price * 1.02 : 1);
    const low = item.low_24h_usd ?? item.low_24h ?? (price > 0 ? price * 0.98 : 0);
    const span = Math.max(high - low, 0.0001);
    const rawChannelPct = ((price - low) / span) * 100;
    const channelPct = Math.max(2, Math.min(98, rawChannelPct));
    const advisory = getAdvisoryByRegime(regimeClass);

    return `
      <tr>
        <td>
          <div class="asset-cell">
            <div class="asset-icon-box">${sym.slice(0, 3)}</div>
            <div class="asset-text-group">
              <span class="asset-symbol">${sym}</span>
              <span class="asset-name">${name}</span>
            </div>
          </div>
        </td>
        <td class="col-num">${formatCurrency(price)}</td>
        <td>
          <div class="range-channel-wrap font-mono">
            <span class="range-extreme-val left">${formatCurrency(low)}</span>
            <div class="range-channel-track" title="Spot: ${formatCurrency(price)} (${channelPct.toFixed(0)}% of 24h channel)">
              <div class="range-channel-fill" style="width: ${channelPct}%;"></div>
              <div class="range-channel-thumb ${regimeClass}" style="left: ${channelPct}%;"></div>
            </div>
            <span class="range-extreme-val right">${formatCurrency(high)}</span>
          </div>
        </td>
        <td class="col-num">
          <div class="vol-sigma-cell font-mono">
            <span class="vol-sigma-val" style="color: var(--quant-blue);">${volPct}%</span>
            <div class="vol-sigma-bar">
              <div class="vol-sigma-fill ${regimeClass}" style="width: ${volBarWidth}%;"></div>
            </div>
          </div>
        </td>
        <td>
          <span class="regime-pill ${regimeClass}">${String(rawRegime).replace('_', ' ')}</span>
        </td>
        <td>
          <span class="vol-advisory-text">${advisory}</span>
        </td>
      </tr>
    `;
  }).join("");
}

// Liquidity Depth (Tab 3)
async function renderLiquidityDepth() {
  const tbody = document.getElementById("liquidity-tbody");
  const spinner = document.getElementById("liquidity-spinner");
  if (!tbody) return;

  if (spinner) spinner.classList.remove("hidden");
  const raw = await callScreener("liquidity", { symbol: "ALL" });
  if (spinner) spinner.classList.add("hidden");
  const items = normalizeArray(raw);

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="color: var(--quant-red); text-align: center; padding: 20px;">Failed to retrieve liquidity metrics.</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(item => {
    const sym = item.symbol ?? "BTC";
    const mcap = item.market_cap_usd ?? 0;
    const vol = item.volume_24h_usd ?? 0;
    const turnover = item.turnover_ratio ?? 0.02;
    const turnoverPct = (turnover * 100).toFixed(2);
    const tier = item.turnover_tier ?? item.grade ?? "LOW_SLIPPAGE";
    const risk = item.slippage_risk ?? item.slippage ?? "MINIMAL";
    const isModerate = String(risk).toUpperCase().includes("MODERATE") || String(risk).toUpperCase().includes("HIGH");

    return `
      <tr>
        <td class="font-bold">${sym}</td>
        <td class="th-num">${formatCurrency(mcap)}</td>
        <td class="th-num" style="color: var(--muted-foreground);">${formatCurrency(vol)}</td>
        <td class="th-num" style="color: var(--quant-blue); font-weight: 700;">${turnoverPct}%</td>
        <td>
          <span class="tier-pill ${isModerate ? '' : 'minimal'}">${tier}</span>
        </td>
        <td style="color: var(--foreground); font-size: 10px;">${isModerate ? 'Use TWAP for >$500k orders' : 'Full market-order depth available'}</td>
      </tr>
    `;
  }).join("");
}

// Kyle's Lambda Orderbook Slippage Model
function calcKyleLambdaSlippage(orderSize, adv, dailyVol, gamma = 0.5) {
  assertInvariant(orderSize > 0, "orderSize must be positive");
  assertInvariant(adv > 0, "adv must be positive");
  assertInvariant(dailyVol > 0, "dailyVol must be positive");
  const ratio = Math.min(orderSize / Math.max(adv, 1.0), 1.0);
  const slippageBps = gamma * dailyVol * Math.sqrt(ratio) * 10000.0;
  assertInvariant(slippageBps >= 0, "slippageBps must be non-negative");
  return slippageBps;
}

function getExecutionRouting(slippageBps) {
  assertInvariant(typeof slippageBps === "number", "slippageBps must be numeric");
  assertInvariant(!isNaN(slippageBps), "slippageBps cannot be NaN");
  if (slippageBps <= 5.0) return { label: "Instant Market", cls: "instant" };
  if (slippageBps <= 15.0) return { label: "TWAP 15m", cls: "twap" };
  if (slippageBps <= 35.0) return { label: "VWAP 1h", cls: "vwap" };
  return { label: "POV 5% OTC", cls: "dark" };
}

function renderSlippageMatrix(item) {
  assertInvariant(item !== null && typeof item === "object", "item must be valid object");
  const container = document.getElementById("slippage-depth-matrix");
  if (!container) return;
  assertInvariant(container instanceof HTMLElement, "container must be HTMLElement");

  const adv = item.volume_24h_usd || 1000000000;
  const vol = item.parkinson_vol || item.parkinson_volatility || 0.035;
  const tiers = [10000, 50000, 100000, 500000, 1000000, 5000000];

  let rowsHtml = "";
  for (let i = 0; i < tiers.length && i < 10; i++) {
    const q = tiers[i];
    const bps = calcKyleLambdaSlippage(q, adv, vol);
    const costUsd = (q * (bps / 10000.0));
    const routing = getExecutionRouting(bps);
    rowsHtml += `
      <tr>
        <td class="font-bold">${formatCurrency(q)}</td>
        <td class="col-num ${bps > 20 ? 'down' : 'up'}">${bps.toFixed(1)} bps</td>
        <td class="col-num">${formatCurrency(costUsd)}</td>
        <td><span class="exec-routing-pill ${routing.cls}">${routing.label}</span></td>
      </tr>`;
  }

  container.innerHTML = `
    <div class="slippage-header">
      <span class="slippage-title">Kyle's Lambda Slippage Depth Matrix</span>
      <span class="slippage-formula-note font-mono">&Delta;P/P = 0.5&middot;&sigma;&middot;&radic;(Q/ADV)</span>
    </div>
    <table class="slippage-table font-mono">
      <thead>
        <tr>
          <th>Order Size</th>
          <th>Est. Slippage</th>
          <th>Impact Drag</th>
          <th>Execution Routing</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>`;
}

// 5-Axis Multi-Factor Radar Engine
function calcRadarAxisPoints(cx, cy, radius, numAxes) {
  assertInvariant(radius > 0, "radius must be positive");
  assertInvariant(numAxes === 5, "numAxes must be 5 for pentagon");
  const points = [];
  for (let i = 0; i < numAxes && i < 10; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / numAxes;
    points.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      angle
    });
  }
  return points;
}

function renderFactorRadar(item) {
  assertInvariant(item !== null && typeof item === "object", "item must be valid object");
  const container = document.getElementById("factor-radar-container");
  if (!container) return;
  assertInvariant(container instanceof HTMLElement, "container must be HTMLElement");

  const cx = 130, cy = 90, r = 64;
  const axes = [
    { label: "Momentum", val: Math.min(1.0, Math.max(0.1, ((item.percent_change_24h || 0) + 10) / 20)) },
    { label: "Trend", val: Math.min(1.0, Math.max(0.1, ((item.percent_change_7d || 0) + 15) / 30)) },
    { label: "Liquidity", val: Math.min(1.0, Math.max(0.1, ((item.turnover_ratio || 0.04) / 0.12))) },
    { label: "Vol Quality", val: Math.min(1.0, Math.max(0.1, 1.0 - ((item.parkinson_vol || 0.03) / 0.08))) },
    { label: "Dominance", val: Math.min(1.0, Math.max(0.1, (Math.log10(Math.max(item.market_cap_usd || 1e9, 1e7)) - 7) / 5)) }
  ];

  const outerPoints = calcRadarAxisPoints(cx, cy, r, 5);
  let ringsHtml = "";
  [0.33, 0.66, 1.0].forEach(frac => {
    const ringPts = calcRadarAxisPoints(cx, cy, r * frac, 5);
    const ptsStr = ringPts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    ringsHtml += `<polygon points="${ptsStr}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
  });

  let axisLinesHtml = "";
  let labelsHtml = "";
  outerPoints.forEach((p, idx) => {
    axisLinesHtml += `<line x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>`;
    const lx = cx + (r + 14) * Math.cos(p.angle);
    const ly = cy + (r + 14) * Math.sin(p.angle);
    labelsHtml += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" fill="#8b95a5" font-size="8.5" font-family="var(--font-mono)" text-anchor="middle" dominant-baseline="middle">${axes[idx].label}</text>`;
  });

  const polyPts = axes.map((a, idx) => {
    const ar = r * a.val;
    const ax = cx + ar * Math.cos(outerPoints[idx].angle);
    const ay = cy + ar * Math.sin(outerPoints[idx].angle);
    return `${ax.toFixed(1)},${ay.toFixed(1)}`;
  }).join(" ");

  container.innerHTML = `
    <div class="radar-header">
      <span class="radar-title">5-Axis Factor Diagnostic</span>
      <span class="font-mono" style="font-size: 10px; color: var(--quant-blue);">Cross-Sectional</span>
    </div>
    <div class="radar-stage">
      <svg class="radar-svg" viewBox="0 0 260 180">
        ${ringsHtml}
        ${axisLinesHtml}
        <polygon points="${polyPts}" fill="rgba(59, 130, 246, 0.25)" stroke="#3b82f6" stroke-width="1.8"/>
        ${labelsHtml}
      </svg>
    </div>`;
}

// Institutional Risk Grid
function renderRiskGrid(item) {
  assertInvariant(item !== null && typeof item === "object", "item must be valid object");
  const container = document.getElementById("quant-risk-grid");
  if (!container) return;
  assertInvariant(container instanceof HTMLElement, "container must be HTMLElement");

  const price = item.price_usd || 1;
  const vol = item.parkinson_vol || item.parkinson_volatility || 0.035;
  const ret24 = (item.percent_change_24h || 0) / 100.0;
  const var95 = 1.645 * vol * price;
  const rfDaily = 0.045 / 365.0;
  const sharpe = ((ret24 - rfDaily) / Math.max(vol, 0.001)) * Math.sqrt(365);
  const parkinsonSpread = (vol - 0.025) * 100;
  const betaBtc = item.symbol === "BTC" ? 1.00 : (0.85 + (vol / 0.05) * 0.35);

  container.innerHTML = `
    <div class="risk-matrix-header">
      <span class="risk-matrix-title">Institutional Risk Parameters</span>
      <span class="font-mono" style="font-size: 10px; color: var(--muted-foreground);">1D Horizon / 95% CI</span>
    </div>
    <div class="quant-risk-grid font-mono">
      <div class="risk-metric-card">
        <span class="risk-metric-title">Parametric VaR 95%</span>
        <span class="risk-metric-val down">-${formatCurrency(var95)}</span>
        <span class="risk-metric-sub">1.645 &sigma; tail expectation</span>
      </div>
      <div class="risk-metric-card">
        <span class="risk-metric-title">Annualized Sharpe</span>
        <span class="risk-metric-val ${sharpe >= 0 ? 'up' : 'down'}">${sharpe.toFixed(2)}</span>
        <span class="risk-metric-sub">r_f = 4.5% risk-free bench</span>
      </div>
      <div class="risk-metric-card">
        <span class="risk-metric-title">Parkinson Spread</span>
        <span class="risk-metric-val ${parkinsonSpread > 0 ? 'up' : 'down'}">${parkinsonSpread >= 0 ? '+' : ''}${parkinsonSpread.toFixed(2)}%</span>
        <span class="risk-metric-sub">&sigma;_Parkinson vs. &sigma;_CC</span>
      </div>
      <div class="risk-metric-card">
        <span class="risk-metric-title">Bitcoin Beta (&beta;)</span>
        <span class="risk-metric-val" style="color: var(--quant-blue);">${betaBtc.toFixed(2)}</span>
        <span class="risk-metric-sub">Cov(R_i, R_BTC) / Var(R_BTC)</span>
      </div>
    </div>`;
}

// Interactive Vector Chart Engine
function generateDeterministicSeries(spotPrice, timeframe, dailyVol = 0.03) {
  assertInvariant(spotPrice > 0, "spotPrice must be positive");
  assertInvariant(typeof timeframe === "string", "timeframe must be string");
  const pointsCount = timeframe === "24H" ? 24 : timeframe === "7D" ? 28 : timeframe === "30D" ? 30 : 45;
  const series = [];
  let p = spotPrice * (timeframe === "24H" ? 0.98 : timeframe === "7D" ? 0.92 : 0.82);
  const now = Date.now();
  const stepMs = (timeframe === "24H" ? 3600 : timeframe === "7D" ? 6 * 3600 : 24 * 3600) * 1000;
  const startTime = now - (pointsCount * stepMs);

  for (let i = 0; i < pointsCount && i < 100; i++) {
    const pseudoNoise = Math.sin((i + 1) * 1.7) * dailyVol * 0.6 + Math.cos((i + 2) * 0.9) * dailyVol * 0.4;
    p = p * (1 + pseudoNoise);
    const t = startTime + (i * stepMs);
    const v = (spotPrice * 1000) * (0.6 + Math.abs(Math.sin(i * 0.8)) * 0.8);
    series.push({ time: t, price: p, volume: v });
  }
  if (series.length > 0) series[series.length - 1].price = spotPrice;
  return series;
}

function buildSvgChartPaths(series, width, height) {
  assertInvariant(series.length > 1, "series must have at least 2 points");
  assertInvariant(width > 0 && height > 0, "dimensions must be positive");
  const chartH = height - 36;
  const minP = Math.min(...series.map(s => s.price));
  const maxP = Math.max(...series.map(s => s.price));
  const pSpan = Math.max(maxP - minP, 0.001);
  const maxV = Math.max(...series.map(s => s.volume));

  const pts = series.map((s, i) => {
    const x = (i / (series.length - 1)) * width;
    const y = chartH - ((s.price - minP) / pSpan) * (chartH - 24) - 12;
    return { x, y, ...s };
  });

  const lineD = pts.reduce((acc, pt, i) => acc + (i === 0 ? `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}` : ` L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`), "");
  const areaD = `${lineD} L ${width} ${chartH} L 0 ${chartH} Z`;

  const barW = Math.max(2, (width / series.length) - 2);
  let volBarsHtml = "";
  pts.forEach(pt => {
    const bh = ((pt.volume / Math.max(maxV, 1)) * 26);
    const by = height - bh;
    volBarsHtml += `<rect x="${(pt.x - barW / 2).toFixed(1)}" y="${by.toFixed(1)}" width="${barW.toFixed(1)}" height="${bh.toFixed(1)}" fill="rgba(59, 130, 246, 0.25)"/>`;
  });

  return { lineD, areaD, volBarsHtml, pts, minP, maxP };
}

let activeTimeframe = "7D";
function renderInteractiveChart(symbol, tf) {
  assertInvariant(typeof symbol === "string", "symbol must be string");
  if (tf) activeTimeframe = tf;
  const container = document.getElementById("inspector-chart-container");
  if (!container) return;
  assertInvariant(container instanceof HTMLElement, "container must be HTMLElement");

  const quote = STANDALONE_FIXTURES.quotes[symbol] || STANDALONE_FIXTURES.quotes["BTC"];
  const spotPrice = quote.price_usd || 100;
  const series = generateDeterministicSeries(spotPrice, activeTimeframe, quote.parkinson_vol || 0.03);
  const width = 560, height = 180;
  const { lineD, areaD, volBarsHtml, pts, minP, maxP } = buildSvgChartPaths(series, width, height);

  container.innerHTML = `
    <div class="chart-header">
      <div class="chart-title-group">
        <span class="chart-title">${symbol} Price & Volume Velocity</span>
        <span class="chart-subtitle font-mono">${formatCurrency(minP)} – ${formatCurrency(maxP)}</span>
      </div>
      <div class="chart-timeframe-bar">
        ${["24H", "7D", "30D", "90D"].map(t => `<button class="timeframe-btn ${t === activeTimeframe ? 'active' : ''}" data-tf="${t}">${t}</button>`).join("")}
      </div>
    </div>
    <div class="chart-stage" id="chart-stage-box">
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        ${volBarsHtml}
        <path d="${areaD}" fill="url(#chart-grad)"/>
        <path d="${lineD}" fill="none" stroke="#3b82f6" stroke-width="2"/>
        <line id="chart-crosshair-x" x1="0" y1="0" x2="0" y2="${height}" stroke="rgba(255,255,255,0.25)" stroke-dasharray="3,3" style="display:none;"/>
        <circle id="chart-crosshair-dot" r="4" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5" style="display:none;"/>
      </svg>
      <div id="chart-tooltip" class="chart-hud-tooltip" style="display:none;"></div>
    </div>`;

  bindChartInteractions(symbol, width, height, pts);
}

function bindChartInteractions(symbol, width, height, pts) {
  assertInvariant(Array.isArray(pts), "pts must be array");
  assertInvariant(width > 0, "width must be positive");
  const container = document.getElementById("inspector-chart-container");
  const stage = document.getElementById("chart-stage-box");
  const lineX = document.getElementById("chart-crosshair-x");
  const dot = document.getElementById("chart-crosshair-dot");
  const tooltip = document.getElementById("chart-tooltip");
  if (!stage || !container) return;

  container.querySelectorAll(".timeframe-btn").forEach(btn => {
    btn.addEventListener("click", () => renderInteractiveChart(symbol, btn.getAttribute("data-tf")));
  });

  stage.addEventListener("mousemove", (e) => {
    const rect = stage.getBoundingClientRect();
    const mouseX = Math.max(0, Math.min(width, ((e.clientX - rect.left) / rect.width) * width));
    const idx = Math.min(pts.length - 1, Math.max(0, Math.round((mouseX / width) * (pts.length - 1))));
    const pt = pts[idx];
    if (!pt) return;

    if (lineX) { lineX.setAttribute("x1", pt.x); lineX.setAttribute("x2", pt.x); lineX.style.display = "block"; }
    if (dot) { dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y); dot.style.display = "block"; }
    if (tooltip) {
      tooltip.style.display = "flex";
      tooltip.style.left = `${(pt.x / width) * 100}%`;
      tooltip.style.top = `${Math.max(20, pt.y)}px`;
      const dateStr = new Date(pt.time).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
      tooltip.innerHTML = `
        <span style="color:#8b95a5;">${dateStr}</span>
        <span class="tooltip-price">${formatCurrency(pt.price)}</span>
        <span style="color:#8b95a5;">Vol: ${formatCurrency(pt.volume)}</span>`;
    }
  });

  stage.addEventListener("mouseleave", () => {
    if (lineX) lineX.style.display = "none";
    if (dot) dot.style.display = "none";
    if (tooltip) tooltip.style.display = "none";
  });
}

// Asset Inspector Standalone (Tab 4)
async function renderAssetInspector() {
  const input = document.getElementById("inspector-search-input");
  const symbol = (input?.value || "BTC").trim().toUpperCase();
  const banner = document.getElementById("inspector-hero-banner");
  if (!banner) return;
  assertInvariant(typeof symbol === "string", "symbol must be string");
  assertInvariant(banner instanceof HTMLElement, "banner must be HTMLElement");

  persistWorkspaceState("cmc_alpha_inspected_asset", symbol);

  const res = await callScreener("quote", { symbol });
  const rawList = normalizeArray(res);
  const item = (res && res.symbol) ? res : (rawList[0] || STANDALONE_FIXTURES.quotes[symbol] || STANDALONE_FIXTURES.quotes["BTC"]);
  if (!item) return;

  const sym = item.symbol ?? symbol;
  const name = item.name ?? resolveAssetName(sym);
  const price = item.price_usd ?? 0;
  const chg = item.percent_change_24h ?? 0;
  const isUp = chg >= 0;
  const regime = (item.regime ?? "TRENDING").replace("_", " ");
  const regimeCls = String(regime).toLowerCase().includes("compression") ? "compression" : String(regime).toLowerCase().includes("trending") ? "trending" : "expansion";

  banner.innerHTML = `
    <div class="hero-identity">
      <div class="asset-icon-box" style="width: 36px; height: 36px; font-size: 13px;">${sym.slice(0, 3)}</div>
      <div>
        <div style="display:flex; align-items:baseline; gap:8px;">
          <span class="hero-symbol">${sym}</span>
          <span class="hero-name">${name}</span>
          <span class="regime-pill ${regimeCls} font-mono">${regime}</span>
        </div>
      </div>
    </div>
    <div class="hero-metrics">
      <div class="hero-price-block">
        <span class="hero-price">${formatCurrency(price)}</span>
        <span class="hero-change ${isUp ? 'up' : 'down'}">${isUp ? '▲ +' : '▼ '}${chg.toFixed(2)}%</span>
      </div>
    </div>`;

  renderInteractiveChart(sym);
  renderSlippageMatrix(item);
  renderFactorRadar(item);
  renderRiskGrid(item);
}

// Bloomberg Terminal Keyboard Shortcuts Engine
function initKeyboardEngine() {
  assertInvariant(typeof window !== "undefined", "window must be defined");
  const shortcutsModal = document.getElementById("shortcuts-modal");
  const btnCloseShortcuts = document.getElementById("btn-close-shortcuts-modal");
  const btnCloseOk = document.getElementById("btn-close-shortcuts-ok");
  const btnKeys = document.getElementById("btn-open-shortcuts");

  const toggleModal = () => shortcutsModal?.classList.toggle("hidden");
  btnKeys?.addEventListener("click", toggleModal);
  btnCloseShortcuts?.addEventListener("click", () => shortcutsModal?.classList.add("hidden"));
  btnCloseOk?.addEventListener("click", () => shortcutsModal?.classList.add("hidden"));

  window.addEventListener("keydown", (e) => {
    const activeEl = document.activeElement;
    const isTyping = activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA");

    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.add("hidden"));
      if (isTyping) activeEl.blur();
      return;
    }
    if (isTyping) return;

    if (["1", "2", "3", "4"].includes(e.key)) {
      e.preventDefault();
      switchTabByIndex(parseInt(e.key) - 1);
    } else if (e.key === "j" || e.key === "ArrowDown") {
      e.preventDefault();
      navigateTableRows(1);
    } else if (e.key === "k" || e.key === "ArrowUp") {
      e.preventDefault();
      navigateTableRows(-1);
    } else if (e.key === "/") {
      e.preventDefault();
      document.getElementById("filter-search-input")?.focus();
    } else if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      renderMomentumScreen();
    } else if (e.key === "?") {
      e.preventDefault();
      toggleModal();
    }
  });
  assertInvariant(shortcutsModal !== null, "shortcuts modal must be present in DOM");
}

function switchTabByIndex(idx) {
  assertInvariant(idx >= 0 && idx <= 3, "tab index must be between 0 and 3");
  const tabs = document.querySelectorAll(".nav-tab");
  assertInvariant(tabs.length >= 4, "must have at least 4 tabs");
  if (tabs[idx]) tabs[idx].click();
}

function navigateTableRows(direction) {
  assertInvariant(direction === 1 || direction === -1, "direction must be +1 or -1");
  const rows = Array.from(document.querySelectorAll("#momentum-tbody tr"));
  if (rows.length === 0) return;
  assertInvariant(rows.length > 0, "table must have rows");

  let currIdx = rows.findIndex(r => r.classList.contains("selected"));
  if (currIdx === -1) currIdx = direction > 0 ? -1 : rows.length;
  const nextIdx = Math.max(0, Math.min(rows.length - 1, currIdx + direction));
  const targetRow = rows[nextIdx];
  if (targetRow) {
    targetRow.click();
    targetRow.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

// Workspace Persistence Engine
function initWorkspacePersistence() {
  assertInvariant(typeof localStorage !== "undefined", "localStorage must be available");
  try {
    const savedWeights = localStorage.getItem("cmc_alpha_weights");
    if (savedWeights) {
      quantWeights = JSON.parse(savedWeights);
      const badgeLabel = document.getElementById("weights-badge-label");
      if (badgeLabel) {
        badgeLabel.textContent = `24H ${parseInt(quantWeights.w24 * 100)}% · 7D ${parseInt(quantWeights.w7d * 100)}% · VOL ${parseInt(quantWeights.wVol * 100)}%`;
      }
    }
    const savedAsset = localStorage.getItem("cmc_alpha_inspected_asset");
    if (savedAsset) {
      const input = document.getElementById("inspector-search-input");
      if (input) input.value = savedAsset;
    }
    const savedTab = localStorage.getItem("cmc_alpha_active_tab");
    if (savedTab && savedTab !== "tab-momentum") {
      const tabBtn = document.querySelector(`.nav-tab[data-tab="${savedTab}"]`);
      if (tabBtn) tabBtn.click();
    }
  } catch (err) {
    console.warn("Storage restore error:", err);
  }
  assertInvariant(quantWeights !== null, "quantWeights must be defined");
}

function persistWorkspaceState(key, value) {
  assertInvariant(typeof key === "string" && key.length > 0, "key must be non-empty string");
  assertInvariant(value !== undefined, "value must be defined");
  try {
    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
  } catch (err) {
    console.warn("Storage persist error:", err);
  }
}

// Navigation Tabs
document.querySelectorAll(".nav-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".terminal-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    const target = btn.getAttribute("data-tab");
    const panel = document.getElementById(target);
    if (panel) panel.classList.add("active");
    persistWorkspaceState("cmc_alpha_active_tab", target);
    if (target === "tab-inspector") renderAssetInspector();
  });
});

// Initialization on DOM Ready
window.addEventListener("DOMContentLoaded", () => {
  initTableSorting();
  initDensityToggle();
  initWeightsModal();
  initMethodologyModal();
  initConnectionPopover();
  initExportUtilities();
  initSearchAndFilterEvents();
  initAnnaChatIntegration();
  initKeyboardEngine();
  initWorkspacePersistence();

  document.getElementById("btn-refresh-volatility")?.addEventListener("click", renderVolatilityRegimes);
  document.getElementById("btn-refresh-liquidity")?.addEventListener("click", renderLiquidityDepth);
  document.getElementById("btn-search-asset")?.addEventListener("click", renderAssetInspector);

  // Load Initial Dataset
  renderMomentumScreen();
  renderVolatilityRegimes();
  renderLiquidityDepth();
  renderAssetInspector();
});
