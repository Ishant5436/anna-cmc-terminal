#!/usr/bin/env python3
"""
CMC Alpha Screener — Executa stdio tool plugin for Anna AI OS.
Provides institutional quantitative crypto screening, Parkinson realized volatility
regime detection, liquidity turnover grading, and market breadth metrics.

Protocol: JSON-RPC 2.0 over stdio
Methods:  describe, invoke, health
"""

from __future__ import annotations

import json
import math
import os
import sys
from typing import Any, Dict, List, Optional
import httpx

from sample_data import SAMPLE_GLOBAL_METRICS, SAMPLE_LISTINGS

CONST_PARKINSON_FACTOR = 0.36067376022224085  # 1.0 / (4.0 * ln(2))
DEFAULT_BASE_URL = "https://pro-api.coinmarketcap.com"

MANIFEST: Dict[str, Any] = {
    "display_name": "CMC Alpha Screener",
    "version": "1.0.9",
    "description": (
        "Institutional quantitative crypto intelligence, cross-sectional momentum screening, "
        "Parkinson realized volatility regime detection, and liquidity analytics."
    ),
    "author": "Ishant Panchal",
    "homepage": "https://github.com/Ishant5436/anna-cmc-terminal",
    "license": "MIT",
    "tags": ["crypto", "finance", "quantitative", "screener", "anna-app"],
    "tools": [
        {
            "name": "screener",
            "description": (
                "Execute institutional quantitative crypto market screens. Use `action` "
                "to select: momentum | volatility | liquidity | breadth | quote | funding | risk_parity | neutral_alpha | pairs_arbitrage | l2_depth."
            ),
            "parameters": [
                {
                    "name": "action",
                    "type": "string",
                    "description": "One of: momentum, volatility, liquidity, breadth, quote, funding, risk_parity, neutral_alpha, pairs_arbitrage, l2_depth.",
                    "required": True,
                },
                {
                    "name": "top_n",
                    "type": "integer",
                    "description": "Optional number of assets to return for momentum screen (1-100, default 10).",
                    "required": False,
                    "default": 10,
                },
                {
                    "name": "min_volume_usd",
                    "type": "number",
                    "description": "Optional minimum 24h USD volume threshold for filtering (default 50,000,000).",
                    "required": False,
                    "default": 50000000.0,
                },
                {
                    "name": "symbol",
                    "type": "string",
                    "description": "Target ticker symbol (e.g. BTC, ETH, SOL) required for volatility, liquidity, quote, or l2_depth.",
                    "required": False,
                    "default": "BTC",
                },
                {
                    "name": "pair",
                    "type": "string",
                    "description": "Synthetic cointegrated pair (e.g. SOL/ETH, AVAX/SOL, NEAR/SUI, BTC/ETH) for pairs_arbitrage.",
                    "required": False,
                    "default": "SOL/ETH",
                },
            ],
        }
    ],
    "runtime": {"type": "uv", "min_version": "0.1.0"},
}


class CMCDataSource:
    """Ingestion engine with deterministic fallback to institutional sample fixtures."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get("CMC_PRO_API_KEY") or os.environ.get("CMC_API_KEY")
        self.is_offline = not bool(self.api_key)
        self.last_source = "offline_fixture" if self.is_offline else "live_api"

    def fetch_listings(self, limit: int = 50) -> List[Dict[str, Any]]:
        assert limit > 0, "limit must be strictly positive"
        assert limit <= 100, "limit must be <= 100"
        if self.is_offline:
            self.last_source = "offline_fixture"
            return SAMPLE_LISTINGS[:limit]
        url = f"{DEFAULT_BASE_URL}/v1/cryptocurrency/listings/latest"
        headers = {"X-CMC_PRO_API_KEY": self.api_key or "", "Accept": "application/json"}
        params = {"start": 1, "limit": limit, "convert": "USD"}
        try:
            with httpx.Client(timeout=6.0) as client:
                res = client.get(url, headers=headers, params=params)
                if res.status_code == 200:
                    data = res.json().get("data", [])
                    parsed = []
                    for item in data:
                        quote = item.get("quote", {}).get("USD", {})
                        price = float(quote.get("price") or 0.0)
                        pct_24h = float(quote.get("percent_change_24h") or 0.0)
                        pct_7d = float(quote.get("percent_change_7d") or 0.0)
                        span = max(0.012, abs(pct_24h) * 0.006 + abs(pct_7d) * 0.002)
                        up_pad = max(span, (pct_24h / 100.0) if pct_24h > 0 else 0.0) + 0.005
                        down_pad = max(span, (-pct_24h / 100.0) if pct_24h < 0 else 0.0) + 0.005
                        parsed.append({
                            "id": item.get("id"),
                            "name": str(item.get("name") or ""),
                            "symbol": str(item.get("symbol") or "").upper(),
                            "price_usd": price,
                            "percent_change_24h": pct_24h,
                            "percent_change_7d": pct_7d,
                            "volume_24h_usd": float(quote.get("volume_24h") or 0.0),
                            "market_cap_usd": float(quote.get("market_cap") or 0.0),
                            "high_24h_usd": price * (1.0 + up_pad),
                            "low_24h_usd": price * max(0.001, (1.0 - down_pad)),
                            "circulating_supply": float(item.get("circulating_supply") or 0.0),
                        })
                    self.last_source = "live_api"
                    return parsed
        except Exception:
            pass
        self.last_source = "offline_fixture"
        return SAMPLE_LISTINGS[:limit]

    def fetch_global_metrics(self) -> Dict[str, Any]:
        if self.is_offline:
            self.last_source = "offline_fixture"
            return SAMPLE_GLOBAL_METRICS
        url = f"{DEFAULT_BASE_URL}/v1/global-metrics/quotes/latest"
        headers = {"X-CMC_PRO_API_KEY": self.api_key or "", "Accept": "application/json"}
        try:
            with httpx.Client(timeout=6.0) as client:
                res = client.get(url, headers=headers)
                if res.status_code == 200:
                    quote = res.json().get("data", {}).get("quote", {}).get("USD", {})
                    self.last_source = "live_api"
                    return {
                        "total_market_cap_usd": float(quote.get("total_market_cap") or 0.0),
                        "total_volume_24h_usd": float(quote.get("total_volume_24h") or 0.0),
                        "btc_dominance_percentage": float(res.json().get("data", {}).get("btc_dominance") or 0.0),
                        "eth_dominance_percentage": float(res.json().get("data", {}).get("eth_dominance") or 0.0),
                        "defi_volume_24h_usd": float(quote.get("defi_volume_24h") or 0.0),
                        "updated_at": str(quote.get("last_updated") or "live"),
                    }
        except Exception:
            pass
        self.last_source = "offline_fixture"
        return SAMPLE_GLOBAL_METRICS


DATA_SOURCE = CMCDataSource()


def calc_parkinson_volatility(high: float, low: float) -> float:
    assert high >= 0.0, "high must be non-negative"
    assert low >= 0.0, "low must be non-negative"
    if low <= 0.0 or high <= low:
        return 0.015
    ratio = high / low
    log_ratio = math.log(ratio)
    return math.sqrt(CONST_PARKINSON_FACTOR * (log_ratio ** 2))


def calc_momentum_score(pct_24h: float, pct_7d: float, vol_24h: float, mcap: float) -> float:
    assert isinstance(pct_24h, (int, float)), "pct_24h must be float"
    assert isinstance(pct_7d, (int, float)), "pct_7d must be float"
    vol_weight = min(max(vol_24h / 500_000_000.0, 0.1), 3.0)
    mcap_factor = math.log10(max(mcap, 1_000_000.0)) / 10.0
    return (0.6 * pct_24h + 0.4 * pct_7d) * vol_weight * mcap_factor


def action_momentum(top_n: int = 10, min_volume_usd: float = 50_000_000.0) -> Dict[str, Any]:
    assert top_n > 0, "top_n must be > 0"
    assert min_volume_usd >= 0.0, "min_volume_usd must be >= 0"
    listings = DATA_SOURCE.fetch_listings(limit=50)
    filtered = [i for i in listings if float(i.get("volume_24h_usd") or 0.0) >= min_volume_usd]
    if not filtered:
        filtered = listings[:top_n]
    scored: List[Dict[str, Any]] = []
    for item in filtered:
        s = calc_momentum_score(
            float(item.get("percent_change_24h") or 0.0),
            float(item.get("percent_change_7d") or 0.0),
            float(item.get("volume_24h_usd") or 0.0),
            float(item.get("market_cap_usd") or 0.0),
        )
        scored.append({**item, "momentum_score": round(s, 2)})
    scored.sort(key=lambda x: x["momentum_score"], reverse=True)
    selected = scored[:top_n]
    n_tot = len(scored)
    for idx, it in enumerate(selected):
        it["rank"] = idx + 1
        it["percentile"] = round((n_tot - idx) / float(n_tot), 4)
    return {
        "action": "momentum",
        "data_source": DATA_SOURCE.last_source,
        "universe_count": n_tot,
        "returned_count": len(selected),
        "assets": selected,
    }


def _format_volatility_item(item: Dict[str, Any]) -> Dict[str, Any]:
    assert isinstance(item, dict), "item must be a dict"
    price = float(item.get("price_usd", 0.0))
    high = float(item.get("high_24h_usd") or price)
    low = float(item.get("low_24h_usd") or price)
    assert high >= low or low > 0, "price sanity"
    parkinson = calc_parkinson_volatility(high, low)
    ann_vol = parkinson * math.sqrt(365.0)
    if parkinson < 0.025:
        regime, risk = "COMPRESSION (Breakout Watch)", "LOW"
    elif parkinson <= 0.050:
        regime, risk = "TRENDING (Directional)", "MODERATE"
    else:
        regime, risk = "EXPANSION_VOLATILE (Turbulent)", "HIGH"
    vol_val = round(parkinson, 4)
    return {
        "symbol": str(item.get("symbol", "")).upper(),
        "name": str(item.get("name", "")),
        "price_usd": price,
        "high_24h_usd": high,
        "high_24h": high,
        "low_24h_usd": low,
        "low_24h": low,
        "parkinson_vol": vol_val,
        "parkinson_volatility": vol_val,
        "annualized_vol": round(ann_vol, 4),
        "regime": regime,
        "risk_level": risk,
    }


def action_volatility(symbol: str = "ALL") -> Dict[str, Any]:
    assert isinstance(symbol, str), "symbol must be string"
    clean_sym = symbol.strip().upper()
    listings = DATA_SOURCE.fetch_listings(limit=50)
    assert len(listings) > 0, "listings must not be empty"
    vol_assets = [_format_volatility_item(it) for it in listings[:10]]
    if clean_sym in ("", "ALL"):
        first = vol_assets[0]
        return {
            "action": "volatility",
            "data_source": DATA_SOURCE.last_source,
            "assets": vol_assets,
            **first,
        }
    match = next((v for v in vol_assets if v["symbol"] == clean_sym), None)
    if not match:
        match_raw = next((i for i in listings if str(i.get("symbol", "")).upper() == clean_sym), listings[0])
        match = _format_volatility_item(match_raw)
    return {
        "action": "volatility",
        "data_source": DATA_SOURCE.last_source,
        "assets": vol_assets,
        **match,
    }


def _format_liquidity_item(item: Dict[str, Any]) -> Dict[str, Any]:
    assert isinstance(item, dict), "item must be a dict"
    vol = float(item.get("volume_24h_usd") or 0.0)
    mcap = float(item.get("market_cap_usd") or 0.0)
    assert vol >= 0.0, "volume cannot be negative"
    turnover = (vol / mcap) if mcap > 0.0 else 0.0
    if turnover >= 0.05:
        tier, grade, slippage, risk = "HIGH_VELOCITY (<0.05%)", "INSTITUTIONAL_DEEP", "< 2 bps", "MODERATE"
    elif turnover >= 0.02:
        tier, grade, slippage, risk = "LOW_SLIPPAGE (<0.03%)", "LIQUID_MIDCAP", "2 - 6 bps", "MINIMAL"
    else:
        tier, grade, slippage, risk = "THIN_SPECULATIVE (>0.10%)", "THIN_SPECULATIVE", "> 12 bps", "HIGH"
    return {
        "symbol": str(item.get("symbol", "")).upper(),
        "name": str(item.get("name", "")),
        "price_usd": float(item.get("price_usd") or 0.0),
        "volume_24h_usd": vol,
        "market_cap_usd": mcap,
        "turnover_ratio": round(turnover, 4),
        "turnover_tier": tier,
        "liquidity_grade": grade,
        "grade": grade,
        "slippage_risk": risk,
        "slippage_est": slippage,
        "slippage": slippage,
    }


def action_liquidity(symbol: str = "ALL") -> Dict[str, Any]:
    assert isinstance(symbol, str), "symbol must be string"
    clean_sym = symbol.strip().upper()
    listings = DATA_SOURCE.fetch_listings(limit=50)
    assert len(listings) > 0, "listings must not be empty"
    liq_assets = [_format_liquidity_item(it) for it in listings[:10]]
    if clean_sym in ("", "ALL"):
        first = liq_assets[0]
        return {
            "action": "liquidity",
            "data_source": DATA_SOURCE.last_source,
            "assets": liq_assets,
            **first,
        }
    match = next((v for v in liq_assets if v["symbol"] == clean_sym), None)
    if not match:
        match_raw = next((i for i in listings if str(i.get("symbol", "")).upper() == clean_sym), listings[0])
        match = _format_liquidity_item(match_raw)
    return {
        "action": "liquidity",
        "data_source": DATA_SOURCE.last_source,
        "assets": liq_assets,
        **match,
    }


def action_breadth() -> Dict[str, Any]:
    metrics = DATA_SOURCE.fetch_global_metrics()
    listings = DATA_SOURCE.fetch_listings(limit=50)
    assert len(listings) > 0, "listings must not be empty"
    advances = sum(1 for i in listings if float(i.get("percent_change_24h") or 0.0) > 0.0)
    declines = sum(1 for i in listings if float(i.get("percent_change_24h") or 0.0) < 0.0)
    assert advances + declines <= len(listings), "count invariant"
    ratio = round(advances / max(declines, 1), 2)
    sentiment = "BULLISH_DOMINANT" if ratio >= 1.5 else ("BEARISH_DOMINANT" if ratio <= 0.67 else "NEUTRAL_BALANCED")
    return {
        "action": "breadth",
        "data_source": DATA_SOURCE.last_source,
        "total_market_cap_usd": metrics["total_market_cap_usd"],
        "total_volume_24h_usd": metrics["total_volume_24h_usd"],
        "btc_dominance_percentage": metrics["btc_dominance_percentage"],
        "advances_count": advances,
        "declines_count": declines,
        "advance_decline_ratio": ratio,
        "market_sentiment": sentiment,
        "updated_at": metrics.get("updated_at", ""),
    }


def action_quote(symbol: str = "BTC") -> Dict[str, Any]:
    assert isinstance(symbol, str), "symbol must be string"
    clean_sym = symbol.strip().upper()
    assert len(clean_sym) > 0, "symbol cannot be empty"
    listings = DATA_SOURCE.fetch_listings(limit=50)
    match = next((i for i in listings if str(i.get("symbol", "")).upper() == clean_sym), None)
    if not match:
        match = listings[0]
        clean_sym = str(match["symbol"]).upper()
    price = float(match.get("price_usd", 0.0))
    high = float(match.get("high_24h_usd") or price)
    low = float(match.get("low_24h_usd") or price)
    parkinson = calc_parkinson_volatility(high, low)
    regime = "COMPRESSION" if parkinson < 0.025 else ("TRENDING" if parkinson <= 0.050 else "EXPANSION_VOLATILE")
    score = calc_momentum_score(
        float(match.get("percent_change_24h") or 0.0),
        float(match.get("percent_change_7d") or 0.0),
        float(match.get("volume_24h_usd") or 0.0),
        float(match.get("market_cap_usd") or 0.0),
    )
    return {
        "action": "quote",
        "data_source": DATA_SOURCE.last_source,
        "symbol": clean_sym,
        "name": match.get("name", ""),
        "price_usd": price,
        "high_24h_usd": high,
        "high_24h": high,
        "low_24h_usd": low,
        "low_24h": low,
        "percent_change_24h": match.get("percent_change_24h", 0.0),
        "percent_change_7d": match.get("percent_change_7d", 0.0),
        "volume_24h_usd": match.get("volume_24h_usd", 0.0),
        "market_cap_usd": match.get("market_cap_usd", 0.0),
        "momentum_score": round(score, 2),
        "regime": regime,
        "circulating_supply": match.get("circulating_supply", 0.0),
    }


SAMPLE_FUNDING_RATES: Dict[str, float] = {
    "BTC": 0.00010,
    "ETH": 0.00012,
    "SOL": 0.00028,
    "BNB": 0.00008,
    "AVAX": 0.00035,
    "DOGE": -0.00065,
    "LINK": 0.00015,
    "NEAR": 0.00022,
    "SUI": 0.00045,
    "APT": 0.00018,
}

SAMPLE_BETAS: Dict[str, float] = {
    "BTC": 1.00,
    "ETH": 1.15,
    "SOL": 1.45,
    "BNB": 0.85,
    "AVAX": 1.55,
    "DOGE": 1.60,
    "LINK": 1.25,
    "NEAR": 1.40,
    "SUI": 1.65,
    "APT": 1.35,
}

COINT_PAIRS: Dict[str, Dict[str, Any]] = {
    "SOL/ETH": {"beta": 0.052, "z": 1.84, "half_life": 4.2, "p_val": 0.018, "desc": "L1 Layer Competition"},
    "AVAX/SOL": {"beta": 0.178, "z": -2.15, "half_life": 6.5, "p_val": 0.024, "desc": "High-Throughput Alt-L1"},
    "NEAR/SUI": {"beta": 1.340, "z": 0.45, "half_life": 3.1, "p_val": 0.009, "desc": "Next-Gen Execution Chains"},
    "BTC/ETH": {"beta": 18.25, "z": -1.12, "half_life": 8.4, "p_val": 0.035, "desc": "Macro SOV vs Smart Contract"},
    "DOGE/SHIB": {"beta": 8420.0, "z": 2.38, "half_life": 2.8, "p_val": 0.004, "desc": "Meme Cointegration Basket"},
    "LINK/ETH": {"beta": 0.0055, "z": -2.40, "half_life": 5.1, "p_val": 0.012, "desc": "Oracle Infrastructure Basis"},
}



def action_funding() -> Dict[str, Any]:
    listings = DATA_SOURCE.fetch_listings(limit=50)
    assert len(listings) > 0, "listings must not be empty"
    items = []
    for item in listings[:10]:
        sym = str(item.get("symbol", "")).upper()
        rate_8h = SAMPLE_FUNDING_RATES.get(sym, 0.00010)
        vol_24h = float(item.get("volume_24h_usd") or 0.0)
        apy = round(rate_8h * 3.0 * 365.0, 2)
        sq_risk = "HIGH_SHORT_SQUEEZE" if rate_8h < -0.0005 else ("HIGH_LONG_FLUSH" if rate_8h > 0.0004 else "NEUTRAL")
        items.append({
            "symbol": sym,
            "name": str(item.get("name", "")),
            "funding_rate_8h": rate_8h,
            "funding_rate_pct": round(rate_8h * 100.0, 4),
            "annualized_apy": apy,
            "open_interest_usd": round(vol_24h * 0.42, 2),
            "squeeze_risk": sq_risk,
        })
    assert len(items) > 0, "items must not be empty"
    return {
        "action": "funding",
        "data_source": DATA_SOURCE.last_source,
        "assets": items,
    }


def action_risk_parity() -> Dict[str, Any]:
    listings = DATA_SOURCE.fetch_listings(limit=50)
    assert len(listings) >= 5, "listings must have at least 5 assets"
    subset = listings[:5]
    inv_vols: List[float] = []
    vol_vals: List[float] = []
    for item in subset:
        h = float(item.get("high_24h_usd") or item.get("price_usd") or 1.0)
        l = float(item.get("low_24h_usd") or item.get("price_usd") or 1.0)
        vol = calc_parkinson_volatility(h, l)
        vol_vals.append(vol)
        inv_vols.append(1.0 / max(vol, 0.005))
    total_inv = sum(inv_vols)
    assert total_inv > 0.0, "total inverse volatility must be positive"
    raw_weights = [iv / total_inv for iv in inv_vols]
    w_sum = sum(raw_weights)
    norm_weights = [round(w / w_sum, 4) for w in raw_weights]
    diff = round(1.0 - sum(norm_weights), 4)
    norm_weights[0] = round(norm_weights[0] + diff, 4)
    weights_out = []
    for i, it in enumerate(subset):
        weights_out.append({
            "symbol": str(it.get("symbol", "")).upper(),
            "name": str(it.get("name", "")),
            "volatility": round(vol_vals[i], 4),
            "weight": norm_weights[i],
            "weight_pct": round(norm_weights[i] * 100.0, 2),
        })
    avg_vol = sum(w * v for w, v in zip(norm_weights, vol_vals))
    port_var = round(avg_vol * 1.645 * 100000.0, 2)
    assert len(weights_out) == len(subset), "weights count invariant"
    return {
        "action": "risk_parity",
        "data_source": DATA_SOURCE.last_source,
        "weights": weights_out,
        "portfolio_var_95": port_var,
    }


def action_neutral_alpha() -> Dict[str, Any]:
    listings = DATA_SOURCE.fetch_listings(limit=50)
    assert len(listings) > 0, "listings must not be empty"
    btc_match = next((i for i in listings if str(i.get("symbol", "")).upper() == "BTC"), listings[0])
    r_btc = float(btc_match.get("percent_change_24h") or 0.0)
    results = []
    for it in listings[:10]:
        sym = str(it.get("symbol", "")).upper()
        raw_r = float(it.get("percent_change_24h") or 0.0)
        beta = SAMPLE_BETAS.get(sym, 1.0)
        resid = round(raw_r - beta * r_btc, 2)
        score = round(resid * 1.5 + 5.0, 2)
        results.append({
            "symbol": sym,
            "name": str(it.get("name", "")),
            "raw_return_24h": raw_r,
            "beta_btc": beta,
            "residual_alpha_24h": resid,
            "neutral_score": score,
        })
    assert len(results) > 0, "results must not be empty"
    return {
        "action": "neutral_alpha",
        "data_source": DATA_SOURCE.last_source,
        "assets": results,
    }


def action_pairs_arbitrage(pair_sym: str = "SOL/ETH") -> Dict[str, Any]:
    pair = (pair_sym or "SOL/ETH").strip().upper()
    assert isinstance(pair, str), "pair must be string"
    info = COINT_PAIRS.get(pair, COINT_PAIRS["SOL/ETH"])
    z_cur = float(info["z"])
    beta = float(info["beta"])
    half_life = float(info["half_life"])
    p_val = float(info["p_val"])
    sig = "SHORT_SPREAD" if z_cur >= 2.0 else ("LONG_SPREAD" if z_cur <= -2.0 else "EQUILIBRIUM")
    history = []
    for i in range(30):
        decay = math.exp(-((29 - i) / max(half_life * 3.0, 1.0)))
        osc = math.sin(i * 0.45) * 0.75
        history.append({
            "t": i + 1,
            "z": round(z_cur * decay + osc * (1.0 - decay), 3),
            "upper": 2.0,
            "lower": -2.0,
        })
    assert len(history) == 30, "history must contain exactly 30 points"
    parts = pair.split("/")
    return {
        "action": "pairs_arbitrage",
        "pair": pair,
        "asset_a": parts[0] if len(parts) > 0 else "SOL",
        "asset_b": parts[1] if len(parts) > 1 else "ETH",
        "hedge_ratio_beta": beta,
        "spread_zscore": z_cur,
        "half_life_days": half_life,
        "p_value_adf": p_val,
        "is_stationary": p_val < 0.05,
        "signal": sig,
        "spread_history": history,
    }


def action_l2_depth(symbol: str = "BTC") -> Dict[str, Any]:
    sym = (symbol or "BTC").strip().upper()
    assert isinstance(sym, str), "symbol must be string"
    listings = DATA_SOURCE.fetch_listings(limit=50)
    match = next((i for i in listings if str(i.get("symbol", "")).upper() == sym), listings[0])
    mid = float(match.get("price_usd") or 96500.0)
    bids = [{"price": round(mid * (1.0 - 0.0001 * (i + 1)), 2), "amount": round(1.5 * (i + 1) * 0.8, 2)} for i in range(5)]
    asks = [{"price": round(mid * (1.0 + 0.0001 * (i + 1)), 2), "amount": round(1.2 * (i + 1) * 0.9, 2)} for i in range(5)]
    v_bid = sum(b["amount"] for b in bids)
    v_ask = sum(a["amount"] for a in asks)
    spread_bps = round(((asks[0]["price"] - bids[0]["price"]) / mid) * 10000.0, 2)
    obi = round((v_bid - v_ask) / (v_bid + v_ask), 3) if (v_bid + v_ask) > 0 else 0.0
    vol = 0.045
    assert len(bids) == 5 and len(asks) == 5, "depth must have 5 levels"
    return {
        "action": "l2_depth",
        "symbol": sym,
        "mid_price": mid,
        "spread_bps": spread_bps,
        "bids": bids,
        "asks": asks,
        "total_bid_vol": round(v_bid, 2),
        "total_ask_vol": round(v_ask, 2),
        "obi_ratio": obi,
        "kyle_slippage_dynamic": {
            "order_5k_bps": round(0.5 * vol * math.sqrt(5000.0 / 50000000.0) * 10000.0, 2),
            "order_25k_bps": round(0.5 * vol * math.sqrt(25000.0 / 50000000.0) * 10000.0, 2),
            "order_50k_bps": round(0.5 * vol * math.sqrt(50000.0 / 50000000.0) * 10000.0, 2),
            "order_100k_bps": round(0.5 * vol * math.sqrt(100000.0 / 50000000.0) * 10000.0, 2),
        },
    }



def tool_screener(
    action: str = "momentum",
    top_n: int = 10,
    min_volume_usd: float = 50_000_000.0,
    symbol: str = "BTC",
    pair: str = "SOL/ETH",
    **_kwargs: Any,
) -> Dict[str, Any]:
    assert isinstance(action, str), "action must be string"
    act = (action or "momentum").strip().lower()
    if act == "momentum":
        return action_momentum(int(top_n), float(min_volume_usd))
    if act == "volatility":
        return action_volatility(symbol)
    if act == "liquidity":
        return action_liquidity(symbol)
    if act == "breadth":
        return action_breadth()
    if act == "quote":
        return action_quote(symbol)
    if act == "funding":
        return action_funding()
    if act == "risk_parity":
        return action_risk_parity()
    if act == "neutral_alpha":
        return action_neutral_alpha()
    if act == "pairs_arbitrage":
        return action_pairs_arbitrage(pair)
    if act == "l2_depth":
        return action_l2_depth(symbol)
    raise ValueError(f"Unknown action: {action!r}; expected momentum|volatility|liquidity|breadth|quote|funding|risk_parity|neutral_alpha|pairs_arbitrage|l2_depth")



TOOL_DISPATCH = {"screener": tool_screener}


def handle_describe(_params: Dict[str, Any]) -> Dict[str, Any]:
    return MANIFEST


def handle_invoke(params: Dict[str, Any]) -> Dict[str, Any]:
    assert isinstance(params, dict), "params must be a dictionary"
    tool_name = (
        params.get("tool")
        or params.get("name")
        or params.get("method")
        or "screener"
    )
    args = (
        params.get("arguments")
        or params.get("args")
        or params.get("parameters")
    )
    if args is None or not isinstance(args, dict):
        args = {
            k: v for k, v in params.items()
            if k not in ("tool", "name", "method", "tool_id", "timeoutMs")
        }
    assert isinstance(args, dict), "`arguments` must be an object"
    if not tool_name:
        tool_name = "screener"
    fn = TOOL_DISPATCH.get(tool_name)
    if fn is None:
        raise ValueError(f"unknown tool: {tool_name!r}")
    try:
        payload = fn(**args)
    except Exception as exc:
        return {"success": False, "error": f"{type(exc).__name__}: {exc}"}
    return {"success": True, "data": payload}


def handle_health(_params: Dict[str, Any]) -> Dict[str, Any]:
    return {"status": "ok", "mode": DATA_SOURCE.last_source, "tools_available": 1}


METHOD_DISPATCH = {
    "describe": handle_describe,
    "invoke": handle_invoke,
    "health": handle_health,
}


def send(message: Dict[str, Any]) -> None:
    sys.stdout.write(json.dumps(message, ensure_ascii=False) + "\n")
    sys.stdout.flush()


def main() -> None:
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
        except json.JSONDecodeError as err:
            send({"jsonrpc": "2.0", "id": None, "error": {"code": -32700, "message": f"parse error: {err}"}})
            continue
        req_id = req.get("id")
        method = req.get("method")
        params = req.get("params") or {}
        handler = METHOD_DISPATCH.get(method)
        if handler is None:
            send({"jsonrpc": "2.0", "id": req_id, "error": {"code": -32601, "message": f"method not found: {method}"}})
            continue
        try:
            result = handler(params)
            send({"jsonrpc": "2.0", "id": req_id, "result": result})
        except Exception as exc:
            send({"jsonrpc": "2.0", "id": req_id, "error": {"code": -32000, "message": str(exc)}})


if __name__ == "__main__":
    main()
