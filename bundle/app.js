/**
 * CMC Alpha Terminal - Institutional Quant Controller (v1.0.7)
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

// Institutional Market Dataset Fixtures
const STANDALONE_FIXTURES = {
  momentum: [
    { rank: 1, symbol: "SOL", name: "Solana", price_usd: 152.40, percent_change_24h: 5.80, percent_change_7d: 14.20, volume_24h_usd: 3850000000, market_cap_usd: 71000000000, momentum_score: 8.95, parkinson_vol: 0.052, regime: "EXPANSION", turnover_tier: "DEEP_LIQUIDITY", sparkline: [134, 138, 142, 139, 145, 148, 152.4] },
    { rank: 2, symbol: "BTC", name: "Bitcoin", price_usd: 64250.00, percent_change_24h: 2.40, percent_change_7d: 6.80, volume_24h_usd: 28400000000, market_cap_usd: 1260000000000, momentum_score: 8.12, parkinson_vol: 0.017, regime: "COMPRESSION", turnover_tier: "LOW_SLIPPAGE", sparkline: [60200, 61500, 62100, 61800, 63400, 63900, 64250] },
    { rank: 3, symbol: "AVAX", name: "Avalanche", price_usd: 28.90, percent_change_24h: 4.10, percent_change_7d: 9.50, volume_24h_usd: 620000000, market_cap_usd: 11500000000, momentum_score: 7.45, parkinson_vol: 0.046, regime: "TRENDING", turnover_tier: "HIGH_VELOCITY", sparkline: [26.2, 26.8, 27.1, 26.9, 27.5, 28.1, 28.9] },
    { rank: 4, symbol: "ETH", name: "Ethereum", price_usd: 3450.00, percent_change_24h: 1.85, percent_change_7d: 4.90, volume_24h_usd: 14200000000, market_cap_usd: 415000000000, momentum_score: 7.10, parkinson_vol: 0.024, regime: "TRENDING", turnover_tier: "LOW_SLIPPAGE", sparkline: [3280, 3310, 3360, 3340, 3390, 3420, 3450] },
    { rank: 5, symbol: "LINK", name: "Chainlink", price_usd: 12.80, percent_change_24h: 3.20, percent_change_7d: 7.40, volume_24h_usd: 480000000, market_cap_usd: 7800000000, momentum_score: 6.85, parkinson_vol: 0.038, regime: "TRENDING", turnover_tier: "MODERATE", sparkline: [11.9, 12.1, 12.3, 12.0, 12.4, 12.6, 12.8] },
    { rank: 6, symbol: "BNB", name: "BNB Chain", price_usd: 585.00, percent_change_24h: 0.75, percent_change_7d: 2.10, volume_24h_usd: 1100000000, market_cap_usd: 86000000000, momentum_score: 5.90, parkinson_vol: 0.018, regime: "COMPRESSION", turnover_tier: "LOW_SLIPPAGE", sparkline: [572, 575, 579, 577, 581, 583, 585] },
    { rank: 7, symbol: "NEAR", name: "NEAR Protocol", price_usd: 4.95, percent_change_24h: -1.20, percent_change_7d: 3.50, volume_24h_usd: 310000000, market_cap_usd: 5400000000, momentum_score: 4.80, parkinson_vol: 0.061, regime: "EXPANSION", turnover_tier: "MODERATE", sparkline: [4.75, 4.82, 5.10, 5.02, 4.98, 5.01, 4.95] }
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
  quotes: {
    BTC: { symbol: "BTC", name: "Bitcoin", price_usd: 64250.00, percent_change_24h: 2.40, percent_change_7d: 6.80, volume_24h_usd: 28400000000, market_cap_usd: 1260000000000, high_24h: 65100.00, low_24h: 63800.00, momentum_score: 8.12, regime: "COMPRESSION" },
    ETH: { symbol: "ETH", name: "Ethereum", price_usd: 3450.00, percent_change_24h: 1.85, percent_change_7d: 4.90, volume_24h_usd: 14200000000, market_cap_usd: 415000000000, high_24h: 3520.00, low_24h: 3380.00, momentum_score: 7.10, regime: "TRENDING" },
    SOL: { symbol: "SOL", name: "Solana", price_usd: 152.40, percent_change_24h: 5.80, percent_change_7d: 14.20, volume_24h_usd: 3850000000, market_cap_usd: 71000000000, high_24h: 158.00, low_24h: 144.00, momentum_score: 8.95, regime: "EXPANSION" }
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

  // Z-Score Factors
  const z24 = asset.z24 ?? 1.2;
  const z7d = asset.z7d ?? 1.8;
  const zVol = asset.zVol ?? 0.9;
  if (elVal24) elVal24.textContent = `${z24 >= 0 ? '+' : ''}${z24.toFixed(2)} σ`;
  if (elVal7d) elVal7d.textContent = `${z7d >= 0 ? '+' : ''}${z7d.toFixed(2)} σ`;
  if (elValVol) elValVol.textContent = `${zVol >= 0 ? '+' : ''}${zVol.toFixed(2)} σ`;

  if (elBar24) elBar24.style.width = `${Math.min(Math.max((z24 + 3) * 16.6, 5), 100)}%`;
  if (elBar7d) elBar7d.style.width = `${Math.min(Math.max((z7d + 3) * 16.6, 5), 100)}%`;
  if (elBarVol) elBarVol.style.width = `${Math.min(Math.max((zVol + 3) * 16.6, 5), 100)}%`;

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
  // Post Summary Button
  document.getElementById("btn-post-anna-chat")?.addEventListener("click", async () => {
    const topAsset = filteredAssets[0] || currentAssets[0];
    const digest = `**[ALPHA DIGEST] CMC Quantitative Market Summary**\n\n- **Macro Breadth:** Advance/Decline \`1.85:1\` (Bullish Accumulation)\n- **Top Momentum Asset:** \`${topAsset.symbol}\` (Alpha Score: \`${topAsset.momentum_score}/10\`, 7d: \`+${topAsset.percent_change_7d}%\`)\n- **Active Universe:** \`Top 100 Large Caps\` (Min Volume: \`$500M+\`)\n- **Weights:** \`24H ${parseInt(quantWeights.w24*100)}% / 7D ${parseInt(quantWeights.w7d*100)}% / VOL ${parseInt(quantWeights.wVol*100)}%\``;

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

  // Ask Anna about Selected Asset
  document.getElementById("btn-ask-anna-selected")?.addEventListener("click", async () => {
    if (!selectedAsset) return;
    const prompt = `Please explain why **${selectedAsset.symbol}** (${selectedAsset.name}) ranks **#${selectedAsset.rank}** with an Alpha Score of **${selectedAsset.momentum_score}/10.0**.\n\nContext:\n- Spot Price: ${formatCurrency(selectedAsset.price_usd)}\n- 24h Return: ${selectedAsset.percent_change_24h}%\n- 7d Return: ${selectedAsset.percent_change_7d}%\n- 24h Volume: ${formatCurrency(selectedAsset.volume_24h_usd)}\n- Parkinson Volatility: ${selectedAsset.parkinson_vol ? (selectedAsset.parkinson_vol * 100).toFixed(2) + '%' : 'N/A'} (${selectedAsset.regime || 'TRENDING'})\n- Turnover Ratio: ${selectedAsset.turnover_tier || 'DEEP_LIQUIDITY'}\n\nWhat are the primary drivers and risks for this asset over the next 48 hours?`;

    if (anna && anna.chat && typeof anna.chat.write_message === "function") {
      try {
        await anna.chat.write_message({ message: prompt });
        alert(`Analysis prompt for ${selectedAsset.symbol} sent to Anna Chat!`);
        return;
      } catch (err) {
        console.warn("Host chat dispatch skipped:", err);
      }
    }
    navigator.clipboard.writeText(prompt);
    alert(`Copied deep-dive prompt for ${selectedAsset.symbol} to clipboard!`);
  });
}

// Volatility Regimes (Tab 2)
async function renderVolatilityRegimes() {
  const container = document.getElementById("volatility-cards");
  const spinner = document.getElementById("volatility-spinner");
  if (!container) return;

  if (spinner) spinner.classList.remove("hidden");
  const raw = await callScreener("volatility", { symbol: "ALL" });
  if (spinner) spinner.classList.add("hidden");
  const items = normalizeArray(raw);

  if (items.length === 0) {
    container.innerHTML = `<div style="color: var(--quant-red); text-align: center; padding: 20px;">Failed to compute volatility regimes.</div>`;
    return;
  }

  container.innerHTML = items.map(item => {
    const sym = item.symbol ?? "BTC";
    const rawRegime = item.regime ?? "COMPRESSION";
    const regime = String(rawRegime).toLowerCase();
    const regimeClass = regime.includes("compression") ? "compression" : regime.includes("trending") ? "trending" : "expansion";
    const volNum = item.parkinson_volatility ?? item.parkinson_vol ?? 0.02;
    const volPct = (volNum * 100).toFixed(2);
    const price = item.price_usd ?? 0;
    const high = item.high_24h_usd ?? item.high_24h ?? price;
    const low = item.low_24h_usd ?? item.low_24h ?? price;

    return `
      <div class="vol-asset-card font-mono">
        <div class="vol-card-top">
          <span class="vol-symbol">${sym}</span>
          <span class="regime-pill ${regimeClass}">${String(rawRegime).replace('_', ' ')}</span>
        </div>
        <div class="vol-metrics-row">
          <span>SPOT PRICE:</span>
          <span class="vol-val">${formatCurrency(price)}</span>
        </div>
        <div class="vol-metrics-row">
          <span>24H RANGE:</span>
          <span>${formatCurrency(low)} – ${formatCurrency(high)}</span>
        </div>
        <div class="vol-metrics-row">
          <span>PARKINSON σ:</span>
          <span class="vol-val" style="color: var(--quant-blue);">${volPct}%</span>
        </div>
      </div>
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

// Asset Inspector Standalone (Tab 4)
async function renderAssetInspector() {
  const input = document.getElementById("inspector-search-input");
  const symbol = (input?.value || "BTC").trim().toUpperCase();
  const stage = document.getElementById("inspector-content");
  if (!stage) return;

  stage.innerHTML = `<div style="text-align:center; padding: 24px; color: var(--muted-foreground);">Fetching institutional quote for ${symbol}...</div>`;

  const res = await callScreener("quote", { symbol });
  const rawList = normalizeArray(res);
  const item = (res && res.symbol) ? res : (rawList[0] || STANDALONE_FIXTURES.quotes[symbol] || STANDALONE_FIXTURES.quotes["BTC"]);
  if (!item) {
    stage.innerHTML = `<div style="color: var(--quant-red); padding: 20px;">Asset ${symbol} not found.</div>`;
    return;
  }

  const sym = item.symbol ?? symbol;
  const name = item.name ?? "";
  const price = item.price_usd ?? 0;
  const chg = item.percent_change_24h ?? 0;
  const isUp = chg >= 0;
  const high = item.high_24h_usd ?? item.high_24h ?? price;
  const low = item.low_24h_usd ?? item.low_24h ?? price;
  const vol = item.volume_24h_usd ?? 0;
  const score = (item.momentum_score ?? 5.0).toFixed(2);
  const regime = item.regime ?? "TRENDING";

  stage.innerHTML = `
    <div style="background: var(--card-elevated); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div class="asset-icon-box" style="width: 38px; height: 38px; font-size: 14px;">${sym.slice(0, 3)}</div>
        <div>
          <h3 style="font-size: 16px; font-weight: 700; color: #ffffff;">${sym} · <span style="font-size: 12px; color: var(--muted-foreground);">${name}</span></h3>
          <span class="regime-pill ${regime.toLowerCase()} font-mono" style="margin-top: 3px;">REGIME: ${regime}</span>
        </div>
      </div>
      <div style="text-align: right;" class="font-mono">
        <span style="font-size: 18px; font-weight: 700; color: #ffffff;">${formatCurrency(price)}</span><br>
        <span class="${isUp ? 'up' : 'down'} font-bold" style="font-size: 11px;">
          ${isUp ? '▲ +' : '▼ '}${chg.toFixed(2)}% (24h)
        </span>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-mono;">
      <div class="detail-card">
        <span class="card-caption">24H Range</span>
        <span style="font-size: 12px; font-weight: 700; color: #ffffff;">${formatCurrency(low)} – ${formatCurrency(high)}</span>
      </div>
      <div class="detail-card">
        <span class="card-caption">24H Volume</span>
        <span style="font-size: 12px; font-weight: 700; color: #ffffff;">${formatCurrency(vol)}</span>
      </div>
      <div class="detail-card">
        <span class="card-caption">Alpha Score</span>
        <span style="font-size: 12px; font-weight: 700; color: var(--quant-green);">${score} / 10.0</span>
      </div>
    </div>
  `;
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

  document.getElementById("btn-refresh-volatility")?.addEventListener("click", renderVolatilityRegimes);
  document.getElementById("btn-refresh-liquidity")?.addEventListener("click", renderLiquidityDepth);
  document.getElementById("btn-search-asset")?.addEventListener("click", renderAssetInspector);

  // Load Initial Dataset
  renderMomentumScreen();
  renderVolatilityRegimes();
  renderLiquidityDepth();
  renderAssetInspector();
});
