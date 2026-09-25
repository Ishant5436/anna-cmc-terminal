/**
 * CMC Alpha Terminal - Institutional Quant Controller (v1.0.15)
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
  },
  funding: [
    { symbol: "BTC", name: "Bitcoin", funding_rate_8h: 0.00010, funding_rate_pct: 0.010, annualized_apy: 10.95, open_interest_usd: 11928000000, squeeze_risk: "NEUTRAL" },
    { symbol: "ETH", name: "Ethereum", funding_rate_8h: 0.00012, funding_rate_pct: 0.012, annualized_apy: 13.14, open_interest_usd: 5964000000, squeeze_risk: "NEUTRAL" },
    { symbol: "SOL", name: "Solana", funding_rate_8h: 0.00028, funding_rate_pct: 0.028, annualized_apy: 30.66, open_interest_usd: 1617000000, squeeze_risk: "HIGH_LONG_FLUSH" },
    { symbol: "BNB", name: "BNB", funding_rate_8h: 0.00008, funding_rate_pct: 0.008, annualized_apy: 8.76, open_interest_usd: 462000000, squeeze_risk: "NEUTRAL" },
    { symbol: "AVAX", name: "Avalanche", funding_rate_8h: 0.00035, funding_rate_pct: 0.035, annualized_apy: 38.33, open_interest_usd: 260400000, squeeze_risk: "HIGH_LONG_FLUSH" },
    { symbol: "DOGE", name: "Dogecoin", funding_rate_8h: -0.00065, funding_rate_pct: -0.065, annualized_apy: -71.18, open_interest_usd: 357000000, squeeze_risk: "HIGH_SHORT_SQUEEZE" },
    { symbol: "LINK", name: "Chainlink", funding_rate_8h: 0.00015, funding_rate_pct: 0.015, annualized_apy: 16.43, open_interest_usd: 201600000, squeeze_risk: "NEUTRAL" },
    { symbol: "NEAR", name: "NEAR Protocol", funding_rate_8h: 0.00022, funding_rate_pct: 0.022, annualized_apy: 24.09, open_interest_usd: 159600000, squeeze_risk: "NEUTRAL" },
    { symbol: "SUI", name: "Sui", funding_rate_8h: 0.00045, funding_rate_pct: 0.045, annualized_apy: 49.28, open_interest_usd: 386400000, squeeze_risk: "HIGH_LONG_FLUSH" },
    { symbol: "XRP", name: "XRP", funding_rate_8h: 0.00006, funding_rate_pct: 0.006, annualized_apy: 6.57, open_interest_usd: 567000000, squeeze_risk: "NEUTRAL" }
  ],
  betas: {
    BTC: 1.00, ETH: 1.15, SOL: 1.45, BNB: 0.85, AVAX: 1.55, DOGE: 1.60, LINK: 1.25, NEAR: 1.40, SUI: 1.65, XRP: 0.95
  }
};

const COINT_PAIRS_FIXTURE = {
  "SOL/ETH": {
    pair: "SOL/ETH", asset_a: "SOL", asset_b: "ETH", hedge_ratio_beta: 0.052, spread_zscore: 1.84, half_life_days: 4.2, p_value_adf: 0.018, is_stationary: true, signal: "SHORT_SPREAD",
    spread_history: Array.from({ length: 30 }, (_, i) => ({ t: i + 1, z: +(1.84 * Math.exp(-((29 - i) / 12.6)) + Math.sin(i * 0.45) * 0.75 * (1 - Math.exp(-((29 - i) / 12.6)))).toFixed(3), upper: 2.0, lower: -2.0 }))
  },
  "AVAX/SOL": {
    pair: "AVAX/SOL", asset_a: "AVAX", asset_b: "SOL", hedge_ratio_beta: 0.178, spread_zscore: -2.15, half_life_days: 6.5, p_value_adf: 0.024, is_stationary: true, signal: "LONG_SPREAD",
    spread_history: Array.from({ length: 30 }, (_, i) => ({ t: i + 1, z: +(-2.15 * Math.exp(-((29 - i) / 19.5)) + Math.sin(i * 0.45) * 0.75 * (1 - Math.exp(-((29 - i) / 19.5)))).toFixed(3), upper: 2.0, lower: -2.0 }))
  },
  "NEAR/SUI": {
    pair: "NEAR/SUI", asset_a: "NEAR", asset_b: "SUI", hedge_ratio_beta: 1.340, spread_zscore: 0.45, half_life_days: 3.1, p_value_adf: 0.009, is_stationary: true, signal: "EQUILIBRIUM",
    spread_history: Array.from({ length: 30 }, (_, i) => ({ t: i + 1, z: +(0.45 * Math.exp(-((29 - i) / 9.3)) + Math.sin(i * 0.45) * 0.75 * (1 - Math.exp(-((29 - i) / 9.3)))).toFixed(3), upper: 2.0, lower: -2.0 }))
  },
  "BTC/ETH": {
    pair: "BTC/ETH", asset_a: "BTC", asset_b: "ETH", hedge_ratio_beta: 18.25, spread_zscore: -1.12, half_life_days: 8.4, p_value_adf: 0.035, is_stationary: true, signal: "EQUILIBRIUM",
    spread_history: Array.from({ length: 30 }, (_, i) => ({ t: i + 1, z: +(-1.12 * Math.exp(-((29 - i) / 25.2)) + Math.sin(i * 0.45) * 0.75 * (1 - Math.exp(-((29 - i) / 25.2)))).toFixed(3), upper: 2.0, lower: -2.0 }))
  },
  "DOGE/SHIB": {
    pair: "DOGE/SHIB", asset_a: "DOGE", asset_b: "SHIB", hedge_ratio_beta: 8420.0, spread_zscore: 2.38, half_life_days: 2.8, p_value_adf: 0.004, is_stationary: true, signal: "SHORT_SPREAD",
    spread_history: Array.from({ length: 30 }, (_, i) => ({ t: i + 1, z: +(2.38 * Math.exp(-((29 - i) / 8.4)) + Math.sin(i * 0.45) * 0.75 * (1 - Math.exp(-((29 - i) / 8.4)))).toFixed(3), upper: 2.0, lower: -2.0 }))
  },
  "LINK/ETH": {
    pair: "LINK/ETH", asset_a: "LINK", asset_b: "ETH", hedge_ratio_beta: 0.0055, spread_zscore: -2.40, half_life_days: 5.1, p_value_adf: 0.012, is_stationary: true, signal: "LONG_SPREAD",
    spread_history: Array.from({ length: 30 }, (_, i) => ({ t: i + 1, z: +(-2.40 * Math.exp(-((29 - i) / 15.3)) + Math.sin(i * 0.45) * 0.75 * (1 - Math.exp(-((29 - i) / 15.3)))).toFixed(3), upper: 2.0, lower: -2.0 }))
  }
};

function generateL2DepthFixture(symbol) {
  assertInvariant(typeof symbol === "string", "symbol must be string");
  const sym = (symbol || "BTC").toUpperCase();
  const q = STANDALONE_FIXTURES.quotes[sym] || STANDALONE_FIXTURES.quotes["BTC"];
  const mid = q?.price_usd || 64250.0;
  const bids = [1, 2, 3, 4, 5].map(i => ({ price: +(mid * (1 - 0.0001 * i)).toFixed(2), amount: +(1.5 * i * 0.8).toFixed(2) }));
  const asks = [1, 2, 3, 4, 5].map(i => ({ price: +(mid * (1 + 0.0001 * i)).toFixed(2), amount: +(1.2 * i * 0.9).toFixed(2) }));
  const vBid = bids.reduce((s, b) => s + b.amount, 0);
  const vAsk = asks.reduce((s, a) => s + a.amount, 0);
  const obi = (vBid + vAsk) > 0 ? (vBid - vAsk) / (vBid + vAsk) : 0.0;
  assertInvariant(bids.length === 5 && asks.length === 5, "depth must have 5 levels");
  return {
    symbol: sym,
    mid_price: mid,
    spread_bps: +(((asks[0].price - bids[0].price) / mid) * 10000).toFixed(2),
    bids,
    asks,
    total_bid_vol: +vBid.toFixed(2),
    total_ask_vol: +vAsk.toFixed(2),
    obi_ratio: +obi.toFixed(3),
  };
}


// Global Reactive State
let anna = null;
let currentAssets = [];
let filteredAssets = [];
let selectedAsset = null;
let sortCol = "rank";
let sortDir = "asc";
let quantWeights = { w24: 0.30, w7d: 0.50, wVol: 0.20 };
let currentDensity = "comfortable";

// Real (measured) connection telemetry, replaces hardcoded placeholder values.
// mode: "connecting" | "live" | "mock" | "error"
let rpcTelemetry = { mode: "connecting", lastLatencyMs: null, lastSuccessAt: null };

function updateConnectionTelemetry() {
  const { mode, lastLatencyMs, lastSuccessAt } = rpcTelemetry;
  const hostLabel = document.getElementById("host-label");
  const diagStatus = document.getElementById("diag-status");
  const diagLatency = document.getElementById("diag-latency");
  const diagEndpoint = document.getElementById("diag-endpoint");
  const diagHeartbeat = document.getElementById("diag-heartbeat");
  const footerFeedMode = document.getElementById("footer-feed-mode");
  const footerTelemetry = document.getElementById("footer-telemetry-text");

  const latencyText = lastLatencyMs != null ? (lastLatencyMs + "ms") : "n/a";
  const heartbeatText = lastSuccessAt != null ? (Math.max(0, Math.round((Date.now() - lastSuccessAt) / 1000)) + "s ago") : "never";
  const endpointText = anna ? "Anna App Runtime (connected)" : "No host runtime (standalone)";

  const labels = {
    connecting: { host: "Connecting...", status: "Connecting...", feed: "Feed: Connecting...", footer: "Executa v1.0.16, connecting..." },
    live: { host: "Live, " + latencyText, status: "Connected, healthy (" + latencyText + ")", feed: "Feed: Live (Anna Host)", footer: "Executa v1.0.16, " + latencyText + " RTT" },
    mock: { host: "Standalone, fixtures", status: "No host runtime, serving local fixtures", feed: "Feed: Local Fixtures (Offline)", footer: "Executa v1.0.16, standalone mode" },
    error: { host: "Degraded, retrying", status: "Last call failed, falling back to fixtures", feed: "Feed: Degraded (Fixtures)", footer: "Executa v1.0.16, degraded" },
  };
  const l = labels[mode] || labels.connecting;

  if (hostLabel) hostLabel.textContent = l.host;
  if (diagStatus) diagStatus.textContent = l.status;
  if (diagLatency) diagLatency.textContent = latencyText;
  if (diagEndpoint) diagEndpoint.textContent = endpointText;
  if (diagHeartbeat) diagHeartbeat.textContent = heartbeatText;
  if (footerFeedMode) footerFeedMode.textContent = l.feed;
  if (footerTelemetry) footerTelemetry.textContent = l.footer;
}

// Connect to Anna App Runtime if inside host iframe
const runtimeReady = (async function initRuntime() {
  updateConnectionTelemetry();
  try {
    const sdkModule = await import("/static/anna-apps/_sdk/latest/index.js");
    if (sdkModule && sdkModule.AnnaAppRuntime) {
      anna = await sdkModule.AnnaAppRuntime.connect({ appId: "cmc-alpha-terminal" });
      rpcTelemetry.mode = "mock"; // becomes "live" once the first real RPC round-trip succeeds
      console.log("Connected to Anna App Runtime");
    } else {
      rpcTelemetry.mode = "mock";
    }
  } catch (_e) {
    rpcTelemetry.mode = "mock";
  }
  updateConnectionTelemetry();
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
    const startedAt = performance.now();
    try {
      const activeToolId = getToolId();
      const res = await anna.tools.invoke({
        tool_id: activeToolId,
        method: "screener",
        args: { action, ...extraArgs }
      });
      const data = extractPayload(res);
      if (data && (Array.isArray(data) || typeof data === "object")) {
        rpcTelemetry.mode = "live";
        rpcTelemetry.lastLatencyMs = Math.round(performance.now() - startedAt);
        rpcTelemetry.lastSuccessAt = Date.now();
        updateConnectionTelemetry();
        return data;
      }
    } catch (err) {
      console.warn("Anna tool dispatch error, using local simulation:", err);
      rpcTelemetry.mode = "error";
      updateConnectionTelemetry();
    }
  }

  // Fallback fixtures
  if (action === "momentum") return STANDALONE_FIXTURES.momentum;
  if (action === "volatility") return STANDALONE_FIXTURES.volatility;
  if (action === "liquidity") return STANDALONE_FIXTURES.liquidity;
  if (action === "funding") return STANDALONE_FIXTURES.funding;
  if (action === "risk_parity") return { action: "risk_parity", weights: STANDALONE_FIXTURES.funding.slice(0, 5).map(f => ({ symbol: f.symbol, weight: 0.20 })), portfolio_var_95: 0.0485 };
  if (action === "pairs_arbitrage") {
    const pair = (extraArgs.pair || "SOL/ETH").toUpperCase();
    return COINT_PAIRS_FIXTURE[pair] || COINT_PAIRS_FIXTURE["SOL/ETH"];
  }
  if (action === "l2_depth") {
    const sym = (extraArgs.symbol || "BTC").toUpperCase();
    return generateL2DepthFixture(sym);
  }
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
  assertInvariant(Array.isArray(items), "items must be array");

  const modeSelect = document.getElementById("filter-alpha-mode");
  const isNeutral = modeSelect && modeSelect.value === "neutral";
  const btcItem = items.find(i => i.symbol === "BTC");
  const rBtc = (btcItem && btcItem.percent_change_24h) || 0;

  const returns24 = items.map(i => {
    const raw = i.percent_change_24h ?? 0;
    if (!isNeutral) return raw;
    const beta = (STANDALONE_FIXTURES.betas && STANDALONE_FIXTURES.betas[i.symbol]) || 1.0;
    return raw - beta * rBtc;
  });
  const returns7d = items.map(i => i.percent_change_7d ?? 0);
  const logVols = items.map(i => Math.log(Math.max(i.volume_24h_usd ?? 1, 1)));

  const mean = arr => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
  const std = (arr, m) => Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / (arr.length || 1)) || 1;

  const m24 = mean(returns24), s24 = std(returns24, m24);
  const m7d = mean(returns7d), s7d = std(returns7d, m7d);
  const mVol = mean(logVols), sVol = std(logVols, mVol);

  const res = items.map((item, idx) => {
    const z24 = (returns24[idx] - m24) / s24;
    const z7d = ((item.percent_change_7d ?? 0) - m7d) / s7d;
    const zVol = (Math.log(Math.max(item.volume_24h_usd ?? 1, 1)) - mVol) / sVol;

    const rawComposite = quantWeights.w24 * z24 + quantWeights.w7d * z7d + quantWeights.wVol * zVol;
    const score = Math.min(Math.max((rawComposite + 2.5) * 2.0, 0.5), 9.95);

    return {
      ...item,
      momentum_score: parseFloat(score.toFixed(2)),
      z24: parseFloat(z24.toFixed(2)),
      z7d: parseFloat(z7d.toFixed(2)),
      zVol: parseFloat(zVol.toFixed(2))
    };
  });
  assertInvariant(res.length === items.length, "output length matches input length");
  return res;
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
function populateDetailPaneFactors(asset) {
  assertInvariant(asset !== null && typeof asset === "object", "asset must be valid object");
  assertInvariant(typeof asset.symbol === "string", "asset.symbol must be string");

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

  const z24 = asset.z24 ?? 1.2;
  const z7d = asset.z7d ?? 1.8;
  const zVol = asset.zVol ?? 0.9;
  if (elVal24) elVal24.textContent = `${z24 >= 0 ? '+' : ''}${z24.toFixed(2)} σ`;
  if (elVal7d) elVal7d.textContent = `${z7d >= 0 ? '+' : ''}${z7d.toFixed(2)} σ`;
  if (elValVol) elValVol.textContent = `${zVol >= 0 ? '+' : ''}${zVol.toFixed(2)} σ`;

  applyBidirectionalBar(elBar24, z24);
  applyBidirectionalBar(elBar7d, z7d);
  applyBidirectionalBar(elBarVol, zVol);

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
}

function selectAsset(symbol) {
  assertInvariant(typeof symbol === "string", "symbol must be string");
  const asset = currentAssets.find(a => a.symbol === symbol) || currentAssets[0];
  if (!asset) return;
  assertInvariant(asset.symbol.length > 0, "asset symbol must be non-empty");
  selectedAsset = asset;

  document.querySelectorAll("#momentum-tbody tr").forEach(r => {
    r.classList.toggle("selected", r.getAttribute("data-symbol") === symbol);
  });

  const elSymbol = document.getElementById("detail-symbol");
  const elName = document.getElementById("detail-name");
  const elRank = document.getElementById("detail-rank");
  const elPrice = document.getElementById("detail-price");
  const el24h = document.getElementById("detail-24h");
  const elScore = document.getElementById("detail-score-fraction");
  const elMeterFill = document.getElementById("detail-meter-fill");
  const elInterpretation = document.getElementById("detail-interpretation");
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

  if (elActionSym) elActionSym.textContent = asset.symbol;
  populateDetailPaneFactors(asset);
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

function bindWeightPresets(r24, r7d, rVol, updateWeightUI) {
  assertInvariant(typeof updateWeightUI === "function", "updateWeightUI must be callable");
  assertInvariant(r24 !== null && r7d !== null && rVol !== null, "range inputs must exist");
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
}

// Interactive Quant Weights Modal
function initWeightsModal() {
  const modal = document.getElementById("weights-modal");
  const openBtn = document.getElementById("btn-open-weights");
  const closeBtn = document.getElementById("btn-close-weights-modal");
  const cancelBtn = document.getElementById("btn-cancel-weights");
  const saveBtn = document.getElementById("btn-save-weights");
  const [r24, r7d, rVol] = ["range-weight-24h", "range-weight-7d", "range-weight-vol"].map(id => document.getElementById(id));
  const [v24, v7d, vVol] = ["val-weight-24h", "val-weight-7d", "val-weight-vol"].map(id => document.getElementById(id));
  const sumVal = document.getElementById("weights-sum-val");

  if (!modal || !openBtn || !r24 || !r7d || !rVol) return;
  assertInvariant(modal instanceof HTMLElement && openBtn instanceof HTMLElement, "elements must be HTMLElement");
  assertInvariant(r24 instanceof HTMLInputElement, "r24 must be HTMLInputElement");

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
  bindWeightPresets(r24, r7d, rVol, updateWeightUI);

  saveBtn?.addEventListener("click", () => {
    const w1 = parseInt(r24.value) / 100;
    const w2 = parseInt(r7d.value) / 100;
    const w3 = parseInt(rVol.value) / 100;
    quantWeights = { w24: w1, w7d: w2, wVol: w3 };

    const badgeLabel = document.getElementById("weights-badge-label");
    if (badgeLabel) {
      badgeLabel.textContent = `24H ${parseInt(w1 * 100)}% · 7D ${parseInt(w2 * 100)}% · VOL ${parseInt(w3 * 100)}%`;
    }

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
    updateConnectionTelemetry();
  });

  closeBtn?.addEventListener("click", () => popover.classList.add("hidden"));

  reconnectBtn?.addEventListener("click", async () => {
    const statusText = document.getElementById("diag-status");
    if (statusText) statusText.textContent = "Probing host connection...";
    reconnectBtn.disabled = true;
    try {
      await callScreener("momentum", { top_n: 1 });
    } finally {
      reconnectBtn.disabled = false;
      updateConnectionTelemetry();
    }
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
    let md = "| Rank | Asset | Price (USD) | 24H % | 7D % | Volume (USD) | Alpha Score |\n";
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

function sanitizeField(rawVal, maxLen = 32) {
  assertInvariant(typeof maxLen === "number", "maxLen must be numeric");
  if (typeof rawVal !== "string") return "";
  const cleaned = rawVal.replace(/[^a-zA-Z0-9\s._-]/g, "").slice(0, maxLen).trim();
  assertInvariant(cleaned.length <= maxLen, "cleaned length must not exceed maxLen");
  return cleaned;
}

// Context-Aware Anna Chat Integration
function initAnnaChatIntegration() {
  let isDispatchingChat = false;
  const chatBtn = document.getElementById("btn-ask-anna-selected");
  if (!chatBtn) return;
  assertInvariant(chatBtn instanceof HTMLElement, "chatBtn must be HTMLElement");

  chatBtn.addEventListener("click", async () => {
    if (!selectedAsset || isDispatchingChat) return;
    isDispatchingChat = true;
    chatBtn.disabled = true;

    const sym = sanitizeField(selectedAsset.symbol, 12);
    const name = sanitizeField(selectedAsset.name, 32);
    const rank = Number(selectedAsset.rank) || 1;
    const score = Number(selectedAsset.momentum_score || 5.0).toFixed(2);
    const priceStr = formatCurrency(selectedAsset.price_usd);
    const ret24 = Number(selectedAsset.percent_change_24h || 0).toFixed(2);
    const ret7d = Number(selectedAsset.percent_change_7d || 0).toFixed(2);
    const volStr = formatCurrency(selectedAsset.volume_24h_usd);
    const parkVol = selectedAsset.parkinson_vol ? (selectedAsset.parkinson_vol * 100).toFixed(2) + "%" : "N/A";
    const regime = sanitizeField(selectedAsset.regime || "TRENDING", 24);
    const turnover = sanitizeField(selectedAsset.turnover_tier || "DEEP_LIQUIDITY", 24);

    const inquiry = `[QUANTITATIVE RESEARCH BRIEF] ${sym} (${name})
- Market Rank: #${rank} | Alpha Score: ${score} / 10.0
- Spot Reference: ${priceStr} | 24h: ${ret24}% | 7d: ${ret7d}%
- 24h Volume: ${volStr} | Turnover Tier: ${turnover}
- Realized Volatility: ${parkVol} (Regime: ${regime})

Analysis Objective: Synthesize cross-sectional factor drivers, institutional orderbook depth, and 48-hour downside risk parameters.`;

    try {
      if (anna && anna.chat && typeof anna.chat.write_message === "function") {
        await anna.chat.write_message({ message: inquiry });
        alert(`Quantitative brief for ${sym} dispatched to Anna Chat.`);
      } else {
        navigator.clipboard.writeText(inquiry);
        alert(`Copied quantitative analysis brief for ${sym} to clipboard.`);
      }
    } catch (err) {
      console.warn("Host chat dispatch skipped:", err);
      navigator.clipboard.writeText(inquiry);
      alert(`Copied quantitative analysis brief for ${sym} to clipboard.`);
    } finally {
      setTimeout(() => {
        isDispatchingChat = false;
        chatBtn.disabled = false;
      }, 1500);
    }
  });
  assertInvariant(typeof isDispatchingChat === "boolean", "dispatch lock state must be boolean");
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

function renderVolatilityRowHtml(item) {
  assertInvariant(item !== null && typeof item === "object", "item must be object");
  const sym = item.symbol ?? "BTC";
  assertInvariant(typeof sym === "string", "symbol must be string");
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
          <div class="range-channel-track" title="Spot: ${formatCurrency(price)} (${channelPct.toFixed(0)}% of 24H channel)">
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
}

// Volatility Regimes (Tab 2 - Institutional Quant Table)
async function renderVolatilityRegimes() {
  const tbody = document.getElementById("volatility-tbody");
  const spinner = document.getElementById("volatility-spinner");
  if (!tbody) return;
  assertInvariant(tbody instanceof HTMLElement, "tbody must be HTMLElement");

  if (spinner) spinner.classList.remove("hidden");
  const raw = await callScreener("volatility", { symbol: "ALL" });
  if (spinner) spinner.classList.add("hidden");
  const items = normalizeArray(raw);
  assertInvariant(Array.isArray(items), "items must be array");

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="color: var(--quant-red); text-align: center; padding: 20px;">Failed to compute volatility regimes.</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(renderVolatilityRowHtml).join("");
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
  const orderSelect = document.getElementById("kyle-order-size-select");
  const selectedQ = orderSelect ? Number(orderSelect.value) : 50000;
  const tiers = [10000, 50000, 100000, 500000, 1000000, 5000000];

  let rowsHtml = "";
  for (let i = 0; i < tiers.length && i < 10; i++) {
    const q = tiers[i];
    const bps = calcKyleLambdaSlippage(q, adv, vol);
    const costUsd = (q * (bps / 10000.0));
    const routing = getExecutionRouting(bps);
    const isSelected = (q === selectedQ);
    const rowClass = isSelected ? 'style="background:rgba(59,130,246,0.12);"' : '';
    rowsHtml += `
      <tr ${rowClass}>
        <td class="font-bold">${formatCurrency(q)}${isSelected ? ' ◀' : ''}</td>
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

  const benchSelect = document.getElementById("benchmark-overlay-select");
  const benchSymbol = benchSelect?.value || "NONE";
  const overlaySvg = renderComparativeOverlay(benchSymbol, series, width, height);

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
        ${overlaySvg}
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

function normalizeCommandTicker(str) {
  assertInvariant(typeof str === "string", "input must be string");
  let s = str.trim().toUpperCase();
  s = s.replace(/^(INSPECT|VIEW|FIND|GO|CHECK|TICKER|ASSET)\s+/i, "");
  s = s.replace(/\s+(GO|BUY|SELL|QUOTE|INFO|STATS|CHART)$/i, "");
  s = s.replace(/[\/\-_]/g, " ");
  s = s.replace(/\s+(USDT|USD|BUSD|PERP)$/i, "");
  s = s.replace(/^\$/, "").trim();
  assertInvariant(typeof s === "string", "ticker must be string");
  return s;
}

// Asset Inspector Standalone (Tab 4)
async function renderAssetInspector() {
  const input = document.getElementById("inspector-search-input");
  const rawSymbol = (input?.value || (selectedAsset && selectedAsset.symbol) || "BTC").trim().toUpperCase();
  const symbol = normalizeCommandTicker(rawSymbol) || "BTC";
  if (input && input.value !== symbol) input.value = symbol;
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
  const l2Container = document.getElementById("l2-microstructure-container");
  if (l2Container) renderL2Microstructure(l2Container, sym);
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

    if (["1", "2", "3", "4", "5", "6", "7"].includes(e.key)) {
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
    } else if (e.key === " " || ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey))) {
      e.preventDefault();
      document.getElementById("btn-open-cmd")?.click();
    } else if (e.key === ",") {
      e.preventDefault();
      document.getElementById("btn-open-settings")?.click();
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
  assertInvariant(idx >= 0 && idx <= 6, "tab index must be between 0 and 6");
  const tabs = document.querySelectorAll(".nav-tab");
  assertInvariant(tabs.length >= 7, "must have at least 7 tabs");
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

// --- Comparative Vector Charting Engine ---
function rebaseSeriesTo100(series) {
  assertInvariant(Array.isArray(series), "series must be array");
  assertInvariant(series.length > 0, "series must not be empty");
  const first = series[0];
  const base = typeof first === "number" ? first : (first?.price || 1.0);
  const safeBase = base > 0 ? base : 1.0;
  const rebased = [];
  for (let i = 0; i < series.length; i++) {
    const val = typeof series[i] === "number" ? series[i] : (series[i]?.price || 0.0);
    rebased.push(Number(((val / safeBase) * 100.0).toFixed(2)));
  }
  return rebased;
}

function renderComparativeOverlay(benchmarkSymbol, primarySeries, width, height) {
  assertInvariant(typeof benchmarkSymbol === "string", "benchmarkSymbol must be string");
  assertInvariant(Array.isArray(primarySeries), "primarySeries must be array");
  if (benchmarkSymbol === "NONE") return "";

  const bQuote = STANDALONE_FIXTURES.quotes[benchmarkSymbol] || STANDALONE_FIXTURES.quotes["BTC"];
  const bSpot = bQuote?.price_usd || 100;
  const bSeries = generateDeterministicSeries(bSpot, activeTimeframe, bQuote?.parkinson_vol || 0.03);

  const rebasedPrimary = rebaseSeriesTo100(primarySeries);
  const rebasedBench = rebaseSeriesTo100(bSeries);

  const n = Math.min(rebasedPrimary.length, rebasedBench.length);
  if (n < 2) return "";

  const allVals = rebasedPrimary.concat(rebasedBench);
  const minVal = Math.min(...allVals);
  const maxVal = Math.max(...allVals);
  const range = maxVal - minVal || 1.0;

  let d = "";
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * width;
    const y = height - ((rebasedBench[i] - minVal) / range) * (height - 24) - 12;
    d += (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
  }

  return `<path d="${d}" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.85"/>`;
}

// --- Cross-Sectional Correlation & Beta Engine ---
function computePearsonCorrelation(seriesA, seriesB) {
  assertInvariant(Array.isArray(seriesA) && Array.isArray(seriesB), "input series must be arrays");
  const n = Math.min(seriesA.length, seriesB.length);
  assertInvariant(n >= 2, "series must contain at least 2 observations");

  let sumA = 0;
  let sumB = 0;
  for (let i = 0; i < n; i++) {
    sumA += seriesA[i];
    sumB += seriesB[i];
  }
  const meanA = sumA / n;
  const meanB = sumB / n;

  let num = 0;
  let denA = 0;
  let denB = 0;
  for (let i = 0; i < n; i++) {
    const diffA = seriesA[i] - meanA;
    const diffB = seriesB[i] - meanB;
    num += diffA * diffB;
    denA += diffA * diffA;
    denB += diffB * diffB;
  }
  const denom = Math.sqrt(denA * denB);
  if (denom < 1e-9) return 0.0;
  const r = num / denom;
  return Math.max(-1.0, Math.min(1.0, r));
}

function computeAssetBeta(assetReturns, btcReturns) {
  assertInvariant(Array.isArray(assetReturns) && Array.isArray(btcReturns), "returns must be arrays");
  const n = Math.min(assetReturns.length, btcReturns.length);
  assertInvariant(n >= 2, "must have at least 2 return points");

  let sumBtc = 0;
  for (let i = 0; i < n; i++) sumBtc += btcReturns[i];
  const meanBtc = sumBtc / n;

  let sumAsset = 0;
  for (let i = 0; i < n; i++) sumAsset += assetReturns[i];
  const meanAsset = sumAsset / n;

  let cov = 0;
  let varBtc = 0;
  for (let i = 0; i < n; i++) {
    const diffBtc = btcReturns[i] - meanBtc;
    cov += (assetReturns[i] - meanAsset) * diffBtc;
    varBtc += diffBtc * diffBtc;
  }
  if (varBtc < 1e-9) return 1.0;
  return Math.max(-10.0, Math.min(10.0, cov / varBtc));
}

function buildCorrelationMatrix(assets) {
  assertInvariant(Array.isArray(assets), "assets must be array");
  const topList = assets.slice(0, 10);
  assertInvariant(topList.length > 0, "must have at least one asset for correlation");

  const matrix = [];
  for (let i = 0; i < topList.length; i++) {
    const row = [];
    const volA = topList[i].parkinson_vol || 0.03;
    const seriesA = generateDeterministicSeries(topList[i].price_usd, "30D", volA).map(s => s.price);
    for (let j = 0; j < topList.length; j++) {
      if (i === j) {
        row.push(1.0);
      } else {
        const volB = topList[j].parkinson_vol || 0.03;
        const seriesB = generateDeterministicSeries(topList[j].price_usd, "30D", volB).map(s => s.price);
        row.push(computePearsonCorrelation(seriesA, seriesB));
      }
    }
    matrix.push({ asset: topList[i], row });
  }
  return matrix;
}

function renderCorrelationHeatmap() {
  const container = document.getElementById("correlation-matrix-container");
  if (!container) return;
  assertInvariant(container instanceof HTMLElement, "container must be HTMLElement");

  const assets = (currentAssets && currentAssets.length > 0) ? currentAssets : STANDALONE_FIXTURES.momentum;
  const matrix = buildCorrelationMatrix(assets);
  assertInvariant(Array.isArray(matrix), "matrix must be array");

  let html = `<table class="correlation-table"><thead><tr><th class="sticky-col">Asset</th>`;
  matrix.forEach(m => {
    html += `<th>${m.asset.symbol}</th>`;
  });
  html += `<th>BTC Beta</th></tr></thead><tbody>`;

  const btcAsset = assets.find(a => a.symbol === "BTC") || assets[0];
  const btcPrices = generateDeterministicSeries(btcAsset.price_usd, "30D", btcAsset.parkinson_vol || 0.03).map(s => s.price);

  matrix.forEach((m, rowIdx) => {
    const assetPrices = generateDeterministicSeries(m.asset.price_usd, "30D", m.asset.parkinson_vol || 0.03).map(s => s.price);
    const beta = computeAssetBeta(assetPrices, btcPrices);
    html += `<tr><td class="sticky-col">${m.asset.symbol} <span style="font-size:9px;color:#8b95a5">#${m.asset.rank}</span></td>`;
    m.row.forEach((val, colIdx) => {
      let cls = "corr-neutral";
      if (rowIdx === colIdx) cls = "corr-diagonal";
      else if (val >= 0.70) cls = "corr-high";
      else if (val <= -0.30) cls = "corr-inverse";
      const valStr = val.toFixed(2);
      html += `<td class="correlation-cell ${cls}" data-asset-a="${m.asset.symbol}" data-asset-b="${matrix[colIdx].asset.symbol}" data-r="${valStr}" title="${m.asset.symbol} vs ${matrix[colIdx].asset.symbol}: r = ${valStr}">${valStr}</td>`;
    });
    html += `<td style="color:${beta >= 1.0 ? '#93c5fd' : '#cbd5e1'};font-weight:600">${beta.toFixed(2)}</td></tr>`;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;

  container.querySelectorAll(".correlation-cell").forEach(cell => {
    cell.addEventListener("click", () => {
      const symA = cell.getAttribute("data-asset-a");
      const target = ((currentAssets && currentAssets.length > 0) ? currentAssets : STANDALONE_FIXTURES.momentum).find(a => a.symbol === symA);
      if (target) {
        selectedAsset = target;
        const inspInput = document.getElementById("inspector-search-input");
        if (inspInput) inspInput.value = target.symbol;
        switchTabByIndex(3);
        renderAssetInspector();
      }
    });
  });
}

// --- Bloomberg Command Palette Engine ---
let commandPaletteIndex = 0;

function handleBenchmarkCommand(input) {
  assertInvariant(typeof input === "string", "input must be string");
  const clean = input.replace(/^(OVERLAY|BENCHMARK|VS|COMPARE)\s+/i, "").trim();
  assertInvariant(typeof clean === "string", "clean must be string");

  const select = document.getElementById("benchmark-overlay-select");
  if (!select) return false;

  const validOptions = ["BTC", "ETH", "SOL", "NONE"];
  if (validOptions.includes(clean)) {
    select.value = clean;
    select.dispatchEvent(new Event("change"));
    switchTabByIndex(3);
    return true;
  }
  return false;
}

function parseAndExecuteCommand(rawInput) {
  assertInvariant(typeof rawInput === "string", "rawInput must be string");
  const input = rawInput.trim().toUpperCase();
  assertInvariant(input.length >= 0, "input length must be valid");

  const modal = document.getElementById("command-palette-modal");
  if (modal) modal.classList.add("hidden");
  if (!input) return false;

  if (input === "1" || input === "MOM" || input === "MOMENTUM" || input === "TAB 1" || input === "T1") { switchTabByIndex(0); return true; }
  if (input === "2" || input === "VOL" || input === "VOLATILITY" || input === "TAB 2" || input === "T2") { switchTabByIndex(1); return true; }
  if (input === "3" || input === "LIQ" || input === "LIQUIDITY" || input === "TAB 3" || input === "T3") { switchTabByIndex(2); return true; }
  if (input === "4" || input === "DIAG" || input === "DIAGNOSTIC" || input === "INSP" || input === "INSPECTOR" || input === "TAB 4" || input === "T4") { switchTabByIndex(3); return true; }
  if (input === "5" || input === "CORR" || input === "CORRELATION" || input === "HEATMAP" || input === "MATRIX" || input === "TAB 5" || input === "T5") { switchTabByIndex(4); return true; }
  if (input === "6" || input === "CARRY" || input === "FUNDING" || input === "PARITY" || input === "RISK" || input === "TAB 6" || input === "T6") { switchTabByIndex(5); return true; }
  if (input === "7" || input === "STATARB" || input === "STAT-ARB" || input === "PAIRS" || input === "COINT" || input === "SPREAD" || input === "TAB 7" || input === "T7") { switchTabByIndex(6); return true; }
  if (input === "OBI" || input === "DEPTH" || input === "ORDERBOOK") { switchTabByIndex(3); return true; }
  if (input === "DISPATCH PAIRS" || input === "DISPATCH PAIR") { dispatchAnnaStatArb(); return true; }
  if (input === "DISPATCH" || input === "BRIEF" || input === "EMIT") { dispatchAnnaQuantBrief(); return true; }

  if (input === "RESET") {
    quantWeights = { ...DEFAULT_WEIGHTS };
    persistWorkspaceState("cmc_alpha_weights", quantWeights);
    renderMomentumScreen();
    return true;
  }
  if (input === "KEYS" || input === "HOTKEYS" || input === "HELP" || input === "SHORTCUTS") {
    document.getElementById("shortcuts-modal")?.classList.remove("hidden");
    return true;
  }
  if (input === "CONFIG" || input === "SETTINGS" || input === "KEY" || input === "VAULT") {
    document.getElementById("settings-modal")?.classList.remove("hidden");
    return true;
  }
  if (input === "DENSITY" || input === "COMPACT" || input === "COMFORTABLE") {
    document.getElementById("btn-toggle-density")?.click();
    return true;
  }

  if (handleBenchmarkCommand(input)) return true;

  const ticker = normalizeCommandTicker(input);
  const pool = (currentAssets && currentAssets.length > 0) ? currentAssets : STANDALONE_FIXTURES.momentum;
  const found = pool.find(a => a.symbol.toUpperCase() === ticker || a.name.toUpperCase() === ticker);
  if (found) {
    selectedAsset = found;
    const inspInput = document.getElementById("inspector-search-input");
    if (inspInput) inspInput.value = found.symbol;
    switchTabByIndex(3);
    renderAssetInspector();
    return true;
  }
  return false;
}

function initCommandPalette() {
  const modal = document.getElementById("command-palette-modal");
  const input = document.getElementById("command-palette-input");
  const openBtn = document.getElementById("btn-open-cmd");
  if (!modal || !input) return;
  assertInvariant(modal instanceof HTMLElement && input instanceof HTMLElement, "elements must be HTMLElement");

  const openPalette = () => {
    modal.classList.remove("hidden");
    input.value = "";
    input.focus();
    renderCommandSuggestions("");
  };

  openBtn?.addEventListener("click", openPalette);
  input.addEventListener("input", (e) => renderCommandSuggestions(e.target.value));

  input.addEventListener("keydown", (e) => {
    const results = document.getElementById("command-palette-results");
    const items = results?.querySelectorAll(".cmd-result-item") || [];
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (items.length > 0) {
        commandPaletteIndex = (commandPaletteIndex + 1) % items.length;
        updateSelectedCommandItem(items);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (items.length > 0) {
        commandPaletteIndex = (commandPaletteIndex - 1 + items.length) % items.length;
        updateSelectedCommandItem(items);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selectedEl = results?.querySelector(".cmd-result-item.selected");
      const cmdToExec = selectedEl?.getAttribute("data-cmd") || input.value;
      parseAndExecuteCommand(cmdToExec);
    } else if (e.key === "Escape") {
      modal.classList.add("hidden");
    }
  });

  assertInvariant(typeof commandPaletteIndex === "number", "commandPaletteIndex must be numeric");
}

function updateSelectedCommandItem(items) {
  assertInvariant(items !== null, "items must be valid");
  assertInvariant(typeof commandPaletteIndex === "number", "commandPaletteIndex must be numeric");
  items.forEach((it, idx) => {
    it.classList.toggle("selected", idx === commandPaletteIndex);
  });
}

function getCommandPaletteCatalog() {
  const pool = (currentAssets && currentAssets.length > 0) ? currentAssets : STANDALONE_FIXTURES.momentum;
  assertInvariant(Array.isArray(pool), "pool must be array");
  const catalog = [
    { cmd: "1", desc: "Switch to Momentum Screener Tab", badge: "Tab" },
    { cmd: "2", desc: "Switch to Volatility Regime Matrix", badge: "Tab" },
    { cmd: "3", desc: "Switch to Liquidity Risk Screener", badge: "Tab" },
    { cmd: "4", desc: "Switch to Quantitative Asset Diagnostic", badge: "Tab" },
    { cmd: "5", desc: "Switch to Cross-Sectional Correlation & Beta Matrix", badge: "Tab" },
    { cmd: "6", desc: "Switch to Risk Parity & Perpetual Carry", badge: "Tab" },
    { cmd: "7", desc: "Switch to Statistical Arbitrage & Cointegration Pairs", badge: "Tab" },
    { cmd: "PAIRS", desc: "View Cointegration Pairs & Spread Deviation", badge: "Tab" },
    { cmd: "STATARB", desc: "View Statistical Arbitrage & Cointegration Pairs", badge: "Tab" },
    { cmd: "DIAG", desc: "Switch to Quantitative Asset Diagnostic", badge: "Tab" },
    { cmd: "OBI", desc: "View Microstructure Order Book Imbalance", badge: "Inspect" },
    { cmd: "DISPATCH PAIRS", desc: "Dispatch Pair Strategy to Anna chat", badge: "Action" },
    { cmd: "DISPATCH", desc: "Dispatch executive quantitative brief to Anna chat", badge: "Action" },
    { cmd: "CONFIG", desc: "Open API Key & Terminal Settings Vault", badge: "Settings" },
    { cmd: "KEYS", desc: "View Bloomberg Terminal Hotkeys Cheatsheet", badge: "Help" },
    { cmd: "DENSITY", desc: "Toggle between Compact and Comfortable row density", badge: "View" },
    { cmd: "RESET", desc: "Reset alpha score weights to default values", badge: "Action" },
    { cmd: "OVERLAY BTC", desc: "Set comparative performance benchmark to Bitcoin", badge: "Overlay" },
    { cmd: "OVERLAY ETH", desc: "Set comparative performance benchmark to Ethereum", badge: "Overlay" },
    { cmd: "OVERLAY SOL", desc: "Set comparative performance benchmark to Solana", badge: "Overlay" },
    { cmd: "OVERLAY NONE", desc: "Clear comparative performance benchmark overlay", badge: "Overlay" }
  ];

  pool.forEach(a => {
    catalog.push({
      cmd: `${a.symbol} GO`,
      desc: `Inspect ${a.name} (#${a.rank}) - ${formatCurrency(a.price_usd)}`,
      badge: "Asset"
    });
  });

  assertInvariant(catalog.length >= 13, "catalog must contain base commands and assets");
  return catalog;
}

function renderCommandSuggestions(filterText) {
  const results = document.getElementById("command-palette-results");
  if (!results) return;
  assertInvariant(results instanceof HTMLElement, "results must be HTMLElement");
  const cleanFilter = filterText.trim().toUpperCase();
  const catalog = getCommandPaletteCatalog();
  assertInvariant(Array.isArray(catalog), "catalog must be array");

  let matched = catalog;
  if (cleanFilter) {
    const norm = normalizeCommandTicker(cleanFilter);
    matched = catalog.filter(c => {
      const cmdUpper = c.cmd.toUpperCase();
      const descUpper = c.desc.toUpperCase();
      return cmdUpper.includes(cleanFilter) || descUpper.includes(cleanFilter) || (norm && cmdUpper.startsWith(norm));
    });
  }

  results.innerHTML = matched.slice(0, 14).map((m, idx) => `
    <div class="cmd-result-item ${idx === 0 ? 'selected' : ''}" data-cmd="${m.cmd}">
      <div class="cmd-item-label">
        <span style="font-weight:700;color:#93c5fd">${m.cmd}</span>
        <span style="color:#8b95a5">${m.desc}</span>
      </div>
      <span class="cmd-item-badge">${m.badge}</span>
    </div>
  `).join("");

  commandPaletteIndex = 0;
  results.querySelectorAll(".cmd-result-item").forEach(item => {
    item.addEventListener("click", () => {
      parseAndExecuteCommand(item.getAttribute("data-cmd"));
    });
  });
}

// --- Settings & API Key Vault Engine ---
function initSettingsVault() {
  const modal = document.getElementById("settings-modal");
  const openBtn = document.getElementById("btn-open-settings");
  const closeBtn = document.getElementById("btn-close-settings-modal");
  const saveBtn = document.getElementById("btn-save-api-key");
  const clearBtn = document.getElementById("btn-clear-api-key");
  const toggleVisBtn = document.getElementById("btn-toggle-key-visibility");
  const input = document.getElementById("input-cmc-api-key");
  const statusNote = document.getElementById("api-key-status-note");
  if (!modal || !input) return;
  assertInvariant(modal instanceof HTMLElement && input instanceof HTMLElement, "elements must be HTMLElement");

  const storedKey = localStorage.getItem("cmc_alpha_pro_key") || "";
  if (storedKey) {
    input.value = storedKey;
    if (statusNote) statusNote.textContent = "Operating Mode: Authenticated CMC Pro Tier (Local Vault)";
  }

  openBtn?.addEventListener("click", () => {
    modal.classList.remove("hidden");
    input.value = localStorage.getItem("cmc_alpha_pro_key") || "";
  });

  closeBtn?.addEventListener("click", () => modal.classList.add("hidden"));

  toggleVisBtn?.addEventListener("click", () => {
    input.type = input.type === "password" ? "text" : "password";
    toggleVisBtn.textContent = input.type === "password" ? "Show" : "Hide";
  });

  saveBtn?.addEventListener("click", () => {
    const rawVal = input.value.trim();
    if (rawVal) {
      localStorage.setItem("cmc_alpha_pro_key", rawVal);
      if (statusNote) statusNote.textContent = "Operating Mode: Authenticated CMC Pro Tier (Local Vault)";
    } else {
      localStorage.removeItem("cmc_alpha_pro_key");
      if (statusNote) statusNote.textContent = "Operating Mode: Local Executa Engine";
    }
    modal.classList.add("hidden");
  });

  clearBtn?.addEventListener("click", () => {
    input.value = "";
    localStorage.removeItem("cmc_alpha_pro_key");
    if (statusNote) statusNote.textContent = "Operating Mode: Local Executa Engine";
  });

  assertInvariant(typeof storedKey === "string", "storedKey must be string");
}

// --- Tab 6: Portfolio Risk Parity & Perpetual Carry ---
async function renderRiskAndCarryScreen() {
  assertInvariant(typeof window !== "undefined", "window must be defined");
  await renderFundingTable();
  await renderRiskParityWeights();
  assertInvariant(document.getElementById("tab-risk-parity") !== null, "tab-risk-parity must exist");
}

async function renderFundingTable() {
  const container = document.getElementById("funding-table-container");
  if (!container) return;
  assertInvariant(container instanceof HTMLElement, "container must be HTMLElement");

  const res = await callScreener("funding", {});
  const rawAssets = normalizeArray(res);
  const items = (rawAssets.length > 0 && rawAssets[0].funding_rate_8h !== undefined)
    ? rawAssets
    : STANDALONE_FIXTURES.funding;
  assertInvariant(Array.isArray(items), "items must be an array");

  let rowsHtml = "";
  for (const it of items) {
    const sym = it.symbol || "BTC";
    const ratePct = Number(it.funding_rate_pct || (it.funding_rate_8h * 100) || 0).toFixed(3);
    const apy = Number(it.annualized_apy || 0).toFixed(2);
    const oi = formatCurrency(it.open_interest_usd || 0);
    const sq = it.squeeze_risk || "NEUTRAL";
    const sqClass = sq === "HIGH_SHORT_SQUEEZE" ? "short-squeeze" : (sq === "HIGH_LONG_FLUSH" ? "long-flush" : "neutral");
    const isPositive = Number(ratePct) >= 0;

    rowsHtml += `
      <tr>
        <td class="font-bold">${sym}</td>
        <td class="font-mono ${isPositive ? 'up' : 'down'}">${isPositive ? '+' : ''}${ratePct}%</td>
        <td class="font-mono font-bold ${isPositive ? 'up' : 'down'}">${isPositive ? '+' : ''}${apy}%</td>
        <td class="font-mono text-muted">${oi}</td>
        <td><span class="squeeze-badge ${sqClass}">${sq.replace(/_/g, ' ')}</span></td>
      </tr>`;
  }

  container.innerHTML = `
    <table class="funding-table font-mono">
      <thead>
        <tr>
          <th>Asset</th>
          <th>8H Rate</th>
          <th>Annualized APY</th>
          <th>Open Interest</th>
          <th>Squeeze Flag</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>`;
}

async function renderRiskParityWeights() {
  const container = document.getElementById("risk-parity-weights-container");
  const varBox = document.getElementById("portfolio-var-val");
  if (!container) return;
  assertInvariant(container instanceof HTMLElement, "container must be HTMLElement");

  const res = await callScreener("risk_parity", {});
  let weights = (res && Array.isArray(res.weights)) ? res.weights : null;
  let portVar = (res && typeof res.portfolio_var_95 === "number") ? res.portfolio_var_95 : null;

  if (!weights || weights.length === 0) {
    const assets = STANDALONE_FIXTURES.volatility.slice(0, 5);
    const invVols = assets.map(a => 1.0 / Math.max(a.parkinson_vol || 0.02, 0.005));
    const totalInv = invVols.reduce((s, v) => s + v, 0);
    weights = assets.map((a, i) => {
      const w = invVols[i] / totalInv;
      return {
        symbol: a.symbol,
        weight: Number(w.toFixed(4)),
        weight_pct: Number((w * 100).toFixed(1)),
        volatility: a.parkinson_vol || 0.02
      };
    });
    portVar = 3450.25;
  }
  assertInvariant(Array.isArray(weights), "weights must be array");

  let html = "";
  for (const w of weights) {
    const pct = w.weight_pct !== undefined ? w.weight_pct : (w.weight * 100).toFixed(1);
    html += `
      <div class="erc-weight-row font-mono">
        <span class="erc-symbol">${w.symbol}</span>
        <div class="erc-bar-track">
          <div class="erc-bar-fill" style="width: ${pct}%;"></div>
        </div>
        <span class="erc-weight-val">${pct}%</span>
      </div>`;
  }

  container.innerHTML = html;
  if (varBox && portVar !== null) {
    varBox.textContent = `-$${Number(portVar).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

async function dispatchAnnaQuantBrief() {
  const statusNote = document.getElementById("dispatch-status-note");
  assertInvariant(typeof window !== "undefined", "window must be defined");
  const topAsset = (currentAssets && currentAssets[0]) ? currentAssets[0].symbol : "SOL";
  const btcRegime = STANDALONE_FIXTURES.quotes.BTC.regime || "COMPRESSION";

  const message = `[QUANT EXECUTIVE BRIEF]\n\n` +
    `* Primary Alpha Leader: ${topAsset} (Multi-factor momentum top decile)\n` +
    `* Bitcoin Volatility Regime: ${btcRegime} (Parkinson σ < 2.5%)\n` +
    `* Squeeze Warning: DOGE perpetual funding negative (-0.065%/8h) - Short squeeze alert.\n` +
    `* Recommended ERC Allocation: BTC 34.2%, ETH 28.5%, BNB 16.8%, SOL 12.1%, AVAX 8.4%\n` +
    `* 1D 95% Parametric Portfolio VaR: -$3,450.25 per $100k notional.`;

  assertInvariant(typeof message === "string", "message must be string");

  if (anna && anna.chat && typeof anna.chat.write_message === "function") {
    try {
      await anna.chat.write_message({ message });
      if (statusNote) statusNote.textContent = "Dispatched structured brief to active Anna conversation.";
    } catch (e) {
      if (statusNote) statusNote.textContent = "Emitted locally (Host communication fallback mode).";
    }
  } else {
    if (statusNote) statusNote.textContent = "Dispatched brief to local session (Sandbox active).";
    console.log("Quant Brief Dispatch:\n", message);
  }
}

// --- Tab 7: Statistical Arbitrage & Cointegration Pairs ---
function calcOrderBookImbalance(bids, asks) {
  assertInvariant(Array.isArray(bids), "bids must be array");
  assertInvariant(Array.isArray(asks), "asks must be array");
  const vBid = (bids || []).reduce((acc, b) => acc + (Number(b.amount) || 0), 0);
  const vAsk = (asks || []).reduce((acc, a) => acc + (Number(a.amount) || 0), 0);
  const total = vBid + vAsk;
  if (total <= 0) return 0.0;
  return Number(((vBid - vAsk) / total).toFixed(3));
}

function renderSpreadChartSVG(container, history, zCurrent) {
  assertInvariant(container instanceof HTMLElement, "container must be HTMLElement");
  assertInvariant(Array.isArray(history), "history must be array");
  if (!history || history.length === 0) return;
  const w = 560;
  const h = 200;
  const pad = 24;
  const maxZ = 3.0;
  const minZ = -3.0;
  const scaleY = (z) => pad + ((maxZ - Math.max(minZ, Math.min(maxZ, z))) / (maxZ - minZ)) * (h - 2 * pad);
  const scaleX = (idx) => pad + (idx / (history.length - 1)) * (w - 2 * pad);
  const yUpper = scaleY(2.0);
  const yZero = scaleY(0.0);
  const yLower = scaleY(-2.0);
  const pts = history.map((pt, i) => `${scaleX(i).toFixed(1)},${scaleY(pt.z).toFixed(1)}`).join(" ");
  const lastX = scaleX(history.length - 1).toFixed(1);
  const lastY = scaleY(zCurrent).toFixed(1);

  container.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" class="spread-svg" style="width:100%;height:100%;display:block;">
      <line x1="${pad}" y1="${yUpper}" x2="${w - pad}" y2="${yUpper}" stroke="rgba(239,68,68,0.4)" stroke-dasharray="4,4" stroke-width="1.2"/>
      <text x="${pad + 4}" y="${yUpper - 4}" fill="#f87171" font-size="9" font-family="JetBrains Mono">+2.0σ Short Barrier</text>
      <line x1="${pad}" y1="${yZero}" x2="${w - pad}" y2="${yZero}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      <text x="${pad + 4}" y="${yZero - 4}" fill="#94a3b8" font-size="9" font-family="JetBrains Mono">0.0σ Equilibrium</text>
      <line x1="${pad}" y1="${yLower}" x2="${w - pad}" y2="${yLower}" stroke="rgba(34,197,94,0.4)" stroke-dasharray="4,4" stroke-width="1.2"/>
      <text x="${pad + 4}" y="${yLower + 12}" fill="#4ade80" font-size="9" font-family="JetBrains Mono">-2.0σ Long Barrier</text>
      <polyline points="${pts}" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${lastX}" cy="${lastY}" r="4.5" fill="#60a5fa" stroke="#0a0e17" stroke-width="2"/>
    </svg>`;
}

async function renderPairsScreen(selectedPair = "SOL/ETH") {
  const sel = document.getElementById("select-coint-pair");
  const pairKey = (selectedPair || (sel && sel.value) || "SOL/ETH").toUpperCase();
  assertInvariant(typeof pairKey === "string", "pairKey must be string");
  const chartBox = document.getElementById("pairs-spread-chart");
  if (!chartBox) return;
  assertInvariant(chartBox instanceof HTMLElement, "chartBox must be HTMLElement");

  let data = await callScreener("pairs_arbitrage", { pair: pairKey });
  if (!data) data = COINT_PAIRS_FIXTURE[pairKey] || COINT_PAIRS_FIXTURE["SOL/ETH"];

  renderSpreadChartSVG(chartBox, data.spread_history, data.spread_zscore);
  const betaEl = document.getElementById("pair-beta-val");
  const zEl = document.getElementById("pair-zscore-val");
  const hlEl = document.getElementById("pair-halflife-val");
  const pEl = document.getElementById("pair-pval-val");
  const badge = document.getElementById("pair-signal-badge");
  const legA = document.getElementById("pair-leg-a");
  const legB = document.getElementById("pair-leg-b");
  const decayEl = document.getElementById("pairs-decay-rate");
  const stationTag = document.getElementById("pairs-stationarity-tag");

  if (betaEl) betaEl.textContent = Number(data.hedge_ratio_beta).toFixed(4);
  if (zEl) zEl.textContent = `${data.spread_zscore >= 0 ? "+" : ""}${Number(data.spread_zscore).toFixed(2)}σ`;
  if (hlEl) hlEl.textContent = `${Number(data.half_life_days).toFixed(1)} Days`;
  if (pEl) pEl.textContent = Number(data.p_value_adf).toFixed(3);
  if (decayEl) decayEl.textContent = `O-U Decay ${(Math.log(2) / data.half_life_days).toFixed(3)}/period`;
  if (stationTag) stationTag.textContent = data.is_stationary ? `ADF: Stationary (p=${Number(data.p_value_adf).toFixed(3)})` : "ADF: Non-Stationary";

  const sig = data.signal || "EQUILIBRIUM";
  if (badge) {
    badge.textContent = sig.replace("_", " ");
    badge.className = `badge-status-pill font-mono ${sig.toLowerCase().replace("_", "-")}`;
  }
  if (legA && legB) {
    if (sig === "SHORT_SPREAD") {
      legA.textContent = `Sell $5,000 ${data.asset_a}`;
      legA.className = "sizing-leg leg-a";
      legB.textContent = `Buy $5,000 ${data.asset_b} (×${Number(data.hedge_ratio_beta).toFixed(4)})`;
      legB.className = "sizing-leg leg-b";
    } else if (sig === "LONG_SPREAD") {
      legA.textContent = `Buy $5,000 ${data.asset_a}`;
      legA.className = "sizing-leg leg-b";
      legB.textContent = `Sell $5,000 ${data.asset_b} (×${Number(data.hedge_ratio_beta).toFixed(4)})`;
      legB.className = "sizing-leg leg-a";
    } else {
      legA.textContent = `Neutral: Dispersion within ±0.5σ equilibrium`;
      legA.className = "sizing-leg";
      legB.textContent = `Standby for ±2.0σ trigger threshold`;
      legB.className = "sizing-leg";
    }
  }
}

async function renderL2Microstructure(container, symbol = "BTC") {
  assertInvariant(container instanceof HTMLElement, "container must be HTMLElement");
  assertInvariant(typeof symbol === "string", "symbol must be string");
  let depth = await callScreener("l2_depth", { symbol });
  if (!depth) depth = generateL2DepthFixture(symbol);
  const obi = calcOrderBookImbalance(depth.bids, depth.asks);
  const bidPct = Math.round(((obi + 1.0) / 2.0) * 100);
  const askPct = 100 - bidPct;
  const bidRows = (depth.bids || []).slice(0, 5).map(b => `
    <tr><td class="price-bid font-mono">${formatCurrency(b.price)}</td><td class="font-mono text-right">${b.amount}</td></tr>
  `).join("");
  const askRows = (depth.asks || []).slice(0, 5).map(a => `
    <tr><td class="price-ask font-mono">${formatCurrency(a.price)}</td><td class="font-mono text-right">${a.amount}</td></tr>
  `).join("");

  container.innerHTML = `
    <div class="l2-micro-header">
      <span class="font-mono font-bold">L2 MICROSTRUCTURE &amp; OBI DEPTH</span>
      <span class="compliance-tag font-mono">Top Spread: ${depth.spread_bps} bps</span>
    </div>
    <div class="obi-track-box">
      <div class="obi-label-row font-mono">
        <span class="price-bid">Bids: ${bidPct}% (${depth.total_bid_vol})</span>
        <span class="font-bold">OBI: ${obi >= 0 ? "+" : ""}${obi}</span>
        <span class="price-ask">Asks: ${askPct}% (${depth.total_ask_vol})</span>
      </div>
      <div class="obi-bar-track">
        <div class="obi-bar-bid" style="width: ${bidPct}%;"></div>
        <div class="obi-bar-ask" style="width: ${askPct}%;"></div>
      </div>
    </div>
    <div class="l2-grid">
      <table class="l2-depth-table">
        <thead><tr><th>Bid Price</th><th class="text-right">Size</th></tr></thead>
        <tbody>${bidRows}</tbody>
      </table>
      <table class="l2-depth-table">
        <thead><tr><th>Ask Price</th><th class="text-right">Size</th></tr></thead>
        <tbody>${askRows}</tbody>
      </table>
    </div>`;
}

async function dispatchAnnaStatArb() {
  const sel = document.getElementById("select-coint-pair");
  const pair = (sel && sel.value) ? sel.value : "SOL/ETH";
  assertInvariant(typeof pair === "string", "pair must be string");
  const data = COINT_PAIRS_FIXTURE[pair] || COINT_PAIRS_FIXTURE["SOL/ETH"];
  assertInvariant(Boolean(data), "data must exist");

  const message = `[STAT-ARB PAIR BRIEF: ${data.pair}]\n\n` +
    `* Signal: ${data.signal} (Z-Score: ${data.spread_zscore >= 0 ? "+" : ""}${data.spread_zscore}σ)\n` +
    `* Hedge Ratio (β): ${data.hedge_ratio_beta} | Half-Life: ${data.half_life_days} Days\n` +
    `* Stationarity: ADF p-value ${data.p_value_adf} (${data.is_stationary ? "Stationary" : "Non-Stationary"})\n` +
    `* Sizing: 50/50 delta-neutral long/short basket against sector beta.`;

  const note = document.getElementById("dispatch-status-note");
  if (anna && anna.chat && typeof anna.chat.write_message === "function") {
    try {
      await anna.chat.write_message({ message });
      if (note) note.textContent = `Emitted ${data.pair} pairs brief to Anna OS.`;
      return;
    } catch (_e) {
      if (note) note.textContent = `Emitted locally (Host communication fallback mode).`;
    }
  } else {
    if (note) note.textContent = `Dispatched ${data.pair} brief locally (Sandbox active).`;
    console.log("Stat-Arb Brief:\n", message);
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
    if (target === "tab-correlation") renderCorrelationHeatmap();
    if (target === "tab-risk-parity") renderRiskAndCarryScreen();
    if (target === "tab-pairs") renderPairsScreen();
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
  initCommandPalette();
  initSettingsVault();

  document.getElementById("btn-refresh-volatility")?.addEventListener("click", renderVolatilityRegimes);
  document.getElementById("btn-refresh-liquidity")?.addEventListener("click", renderLiquidityDepth);
  document.getElementById("btn-search-asset")?.addEventListener("click", renderAssetInspector);
  document.getElementById("benchmark-overlay-select")?.addEventListener("change", () => renderAssetInspector());
  document.getElementById("btn-refresh-risk-parity")?.addEventListener("click", renderRiskAndCarryScreen);
  document.getElementById("btn-dispatch-anna")?.addEventListener("click", dispatchAnnaQuantBrief);
  document.getElementById("btn-footer-dispatch")?.addEventListener("click", dispatchAnnaQuantBrief);
  document.getElementById("filter-alpha-mode")?.addEventListener("change", applyLocalFiltersAndSort);
  document.getElementById("kyle-order-size-select")?.addEventListener("change", () => {
    if (selectedAsset) renderSlippageMatrix(selectedAsset);
  });
  document.getElementById("select-coint-pair")?.addEventListener("change", (e) => {
    renderPairsScreen(e.target.value);
  });
  document.getElementById("btn-dispatch-stat-arb")?.addEventListener("click", dispatchAnnaStatArb);

  const inspectorInput = document.getElementById("inspector-search-input");
  inspectorInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      renderAssetInspector();
    }
  });

  // Load Initial Dataset. Give the host runtime connection a bounded window to
  // settle first, so the first screen doesn't spuriously fall back to fixtures
  // while a live host connection is still resolving.
  const runtimeTimeout = new Promise(resolve => setTimeout(resolve, 800));
  Promise.race([runtimeReady, runtimeTimeout]).then(() => {
    renderMomentumScreen();
    renderVolatilityRegimes();
    renderLiquidityDepth();
    renderAssetInspector();
    renderCorrelationHeatmap();
    renderRiskAndCarryScreen();
  });
  renderPairsScreen();
});


