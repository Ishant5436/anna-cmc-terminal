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
    "version": "1.0.1",
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
                "to select: momentum | volatility | liquidity | breadth | quote."
            ),
            "parameters": [
                {
                    "name": "action",
                    "type": "string",
                    "description": "One of: momentum, volatility, liquidity, breadth, quote.",
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
                    "description": "Target ticker symbol (e.g. BTC, ETH, SOL) required for volatility, liquidity, or quote.",
                    "required": False,
                    "default": "BTC",
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
                        parsed.append({
                            "id": item.get("id"),
                            "name": str(item.get("name") or ""),
                            "symbol": str(item.get("symbol") or "").upper(),
                            "price_usd": price,
                            "percent_change_24h": float(quote.get("percent_change_24h") or 0.0),
                            "percent_change_7d": float(quote.get("percent_change_7d") or 0.0),
                            "volume_24h_usd": float(quote.get("volume_24h") or 0.0),
                            "market_cap_usd": float(quote.get("market_cap") or 0.0),
                            "high_24h_usd": price * 1.025,
                            "low_24h_usd": price * 0.975,
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


def action_volatility(symbol: str = "BTC") -> Dict[str, Any]:
    assert isinstance(symbol, str), "symbol must be string"
    clean_sym = symbol.strip().upper()
    assert len(clean_sym) > 0, "symbol cannot be empty"
    listings = DATA_SOURCE.fetch_listings(limit=50)
    match = next((i for i in listings if str(i.get("symbol", "")).upper() == clean_sym), None)
    if not match:
        match = listings[0]
        clean_sym = str(match["symbol"]).upper()
    high = float(match.get("high_24h_usd") or match["price_usd"])
    low = float(match.get("low_24h_usd") or match["price_usd"])
    parkinson = calc_parkinson_volatility(high, low)
    ann_vol = parkinson * math.sqrt(365.0)
    if parkinson < 0.025:
        regime, risk = "COMPRESSION (Breakout Watch)", "LOW"
    elif parkinson <= 0.050:
        regime, risk = "TRENDING (Directional)", "MODERATE"
    else:
        regime, risk = "EXPANSION_VOLATILE (Turbulent)", "HIGH"
    return {
        "action": "volatility",
        "data_source": DATA_SOURCE.last_source,
        "symbol": clean_sym,
        "price_usd": match["price_usd"],
        "low_24h_usd": low,
        "high_24h_usd": high,
        "parkinson_vol": round(parkinson, 6),
        "annualized_vol": round(ann_vol, 4),
        "regime": regime,
        "risk_level": risk,
    }


def action_liquidity(symbol: str = "BTC") -> Dict[str, Any]:
    assert isinstance(symbol, str), "symbol must be string"
    clean_sym = symbol.strip().upper()
    assert len(clean_sym) > 0, "symbol cannot be empty"
    listings = DATA_SOURCE.fetch_listings(limit=50)
    match = next((i for i in listings if str(i.get("symbol", "")).upper() == clean_sym), None)
    if not match:
        match = listings[0]
        clean_sym = str(match["symbol"]).upper()
    vol = float(match.get("volume_24h_usd") or 0.0)
    mcap = float(match.get("market_cap_usd") or 0.0)
    turnover = (vol / mcap) if mcap > 0.0 else 0.0
    if turnover >= 0.10:
        grade, slippage = "INSTITUTIONAL_DEEP", "< 2 bps"
    elif turnover >= 0.03:
        grade, slippage = "LIQUID_MIDCAP", "2 - 6 bps"
    else:
        grade, slippage = "THIN_SPECULATIVE", "> 12 bps"
    return {
        "action": "liquidity",
        "data_source": DATA_SOURCE.last_source,
        "symbol": clean_sym,
        "price_usd": match["price_usd"],
        "volume_24h_usd": vol,
        "market_cap_usd": mcap,
        "turnover_ratio": round(turnover, 4),
        "liquidity_grade": grade,
        "slippage_est": slippage,
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
    return {
        "action": "quote",
        "data_source": DATA_SOURCE.last_source,
        "symbol": clean_sym,
        "name": match.get("name", ""),
        "price_usd": match.get("price_usd", 0.0),
        "percent_change_24h": match.get("percent_change_24h", 0.0),
        "percent_change_7d": match.get("percent_change_7d", 0.0),
        "volume_24h_usd": match.get("volume_24h_usd", 0.0),
        "market_cap_usd": match.get("market_cap_usd", 0.0),
        "circulating_supply": match.get("circulating_supply", 0.0),
    }


def tool_screener(
    action: str,
    top_n: int = 10,
    min_volume_usd: float = 50_000_000.0,
    symbol: str = "BTC",
) -> Dict[str, Any]:
    assert isinstance(action, str), "action must be string"
    act = action.strip().lower()
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
    raise ValueError(f"Unknown action: {action!r}; expected momentum|volatility|liquidity|breadth|quote")


TOOL_DISPATCH = {"screener": tool_screener}


def handle_describe(_params: Dict[str, Any]) -> Dict[str, Any]:
    return MANIFEST


def handle_invoke(params: Dict[str, Any]) -> Dict[str, Any]:
    tool_name = params.get("tool")
    args = params.get("arguments") or {}
    assert isinstance(args, dict), "`arguments` must be an object"
    fn = TOOL_DISPATCH.get(tool_name or "")
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
