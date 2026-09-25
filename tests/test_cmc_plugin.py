"""
TDD Unit & Invariant Test Suite for CMC Alpha Screener Executa Plugin.
Tests JSON-RPC 2.0 dispatch, method execution, mathematical properties, and error states.
"""

import os
import sys

# Add executas/cmc-screener to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "executas", "cmc-screener")))

from cmc_plugin import (
    calc_momentum_score,
    calc_parkinson_volatility,
    handle_describe,
    handle_health,
    handle_invoke,
)


def test_describe_manifest_structure():
    res = handle_describe({})
    assert "display_name" in res
    assert res["display_name"] == "CMC Alpha Screener"
    assert "tools" in res
    assert len(res["tools"]) == 1
    assert res["tools"][0]["name"] == "screener"
    param_names = [p["name"] for p in res["tools"][0]["parameters"]]
    assert "action" in param_names
    assert "top_n" in param_names
    assert "symbol" in param_names


def test_health_check():
    res = handle_health({})
    assert res["status"] == "ok"
    assert "mode" in res
    assert res["tools_available"] == 1


def test_parkinson_volatility_invariants():
    # Identical high and low should return minimum floor
    v_zero = calc_parkinson_volatility(100.0, 100.0)
    assert v_zero == 0.015

    # Positive price spread
    v_normal = calc_parkinson_volatility(110.0, 90.0)
    assert 0.0 < v_normal < 1.0

    # Higher spread yields strictly higher volatility
    v_high = calc_parkinson_volatility(150.0, 80.0)
    assert v_high > v_normal


def test_momentum_score_invariants():
    s1 = calc_momentum_score(10.0, 20.0, 1_000_000_000.0, 100_000_000_000.0)
    s2 = calc_momentum_score(-10.0, -20.0, 1_000_000_000.0, 100_000_000_000.0)
    assert s1 > 0.0
    assert s2 < 0.0
    assert s1 > s2


def test_invoke_momentum_action():
    res = handle_invoke({
        "tool": "screener",
        "arguments": {"action": "momentum", "top_n": 5, "min_volume_usd": 100_000_000.0}
    })
    assert res["success"] is True
    data = res["data"]
    assert data["action"] == "momentum"
    assert len(data["assets"]) <= 5
    assert len(data["assets"]) > 0
    first = data["assets"][0]
    assert "symbol" in first
    assert "momentum_score" in first
    assert "rank" in first
    assert first["rank"] == 1
    # Verify descending sort
    for i in range(len(data["assets"]) - 1):
        assert data["assets"][i]["momentum_score"] >= data["assets"][i + 1]["momentum_score"]


def test_invoke_volatility_action():
    res = handle_invoke({
        "tool": "screener",
        "arguments": {"action": "volatility", "symbol": "BTC"}
    })
    assert res["success"] is True
    data = res["data"]
    assert data["action"] == "volatility"
    assert data["symbol"] == "BTC"
    assert "parkinson_vol" in data
    assert "regime" in data
    assert "risk_level" in data
    assert data["parkinson_vol"] > 0.0


def test_invoke_liquidity_action():
    res = handle_invoke({
        "tool": "screener",
        "arguments": {"action": "liquidity", "symbol": "ETH"}
    })
    assert res["success"] is True
    data = res["data"]
    assert data["action"] == "liquidity"
    assert data["symbol"] == "ETH"
    assert "turnover_ratio" in data
    assert "liquidity_grade" in data
    assert "slippage_est" in data


def test_invoke_breadth_action():
    res = handle_invoke({
        "tool": "screener",
        "arguments": {"action": "breadth"}
    })
    assert res["success"] is True
    data = res["data"]
    assert data["action"] == "breadth"
    assert "total_market_cap_usd" in data
    assert "btc_dominance_percentage" in data
    assert "advance_decline_ratio" in data
    assert data["advances_count"] >= 0
    assert data["declines_count"] >= 0


def test_invoke_quote_action():
    res = handle_invoke({
        "tool": "screener",
        "arguments": {"action": "quote", "symbol": "SOL"}
    })
    assert res["success"] is True
    data = res["data"]
    assert data["action"] == "quote"
    assert data["symbol"] == "SOL"
    assert data["price_usd"] > 0.0
    assert "percent_change_24h" in data


def test_invoke_unknown_tool_error():
    try:
        handle_invoke({"tool": "nonexistent_tool", "arguments": {}})
        assert False, "Should have raised ValueError"
    except ValueError as err:
        assert "unknown tool" in str(err)


def test_invoke_unknown_action_error():
    res = handle_invoke({
        "tool": "screener",
        "arguments": {"action": "invalid_action_xyz"}
    })
    assert res["success"] is False
    assert "Unknown action" in res["error"]


def test_invoke_volatility_all_assets_list():
    res = handle_invoke({
        "tool": "screener",
        "arguments": {"action": "volatility"}
    })
    assert res["success"] is True
    data = res["data"]
    assert "assets" in data
    assert len(data["assets"]) >= 5
    for item in data["assets"]:
        assert "symbol" in item
        assert "parkinson_vol" in item
        assert "parkinson_volatility" in item
        assert item["parkinson_vol"] == item["parkinson_volatility"]
        assert "regime" in item
        assert "risk_level" in item
        assert "high_24h_usd" in item or "high_24h" in item


def test_invoke_liquidity_all_assets_list():
    res = handle_invoke({
        "tool": "screener",
        "arguments": {"action": "liquidity"}
    })
    assert res["success"] is True
    data = res["data"]
    assert "assets" in data
    assert len(data["assets"]) >= 5
    for item in data["assets"]:
        assert "symbol" in item
        assert "turnover_ratio" in item
        assert "turnover_tier" in item
        assert "slippage_risk" in item


def test_manifest_version_109():
    desc = handle_describe({})
    assert desc["version"] == "1.0.9"


def test_bundle_volatility_table_contract():
    bundle_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "bundle"))
    index_path = os.path.join(bundle_dir, "index.html")
    style_path = os.path.join(bundle_dir, "style.css")
    app_path = os.path.join(bundle_dir, "app.js")

    with open(index_path, "r", encoding="utf-8") as f:
        html = f.read()
    with open(style_path, "r", encoding="utf-8") as f:
        css = f.read()
    with open(app_path, "r", encoding="utf-8") as f:
        js = f.read()

    # Red test assertions: will pass once Tasks 1-4 are completed
    assert "id=\"volatility-table\"" in html
    assert "id=\"volatility-tbody\"" in html
    assert ".range-channel-track" in css
    assert "renderVolatilityRegimes" in js
    assert "isDispatchingChat" in js


def test_kyle_lambda_slippage_math():
    import math

    def kyle_lambda(order_size, adv, daily_vol, gamma=0.5):
        assert order_size > 0
        assert adv > 0
        assert daily_vol > 0
        ratio = order_size / adv
        return gamma * daily_vol * math.sqrt(ratio) * 10000.0  # in basis points

    # Invariant 1: Larger order yields strictly higher slippage
    s_small = kyle_lambda(10_000, 1_000_000_000, 0.05)
    s_large = kyle_lambda(1_000_000, 1_000_000_000, 0.05)
    assert s_large > s_small
    assert s_small > 0.0

    # Invariant 2: Higher ADV yields strictly lower slippage
    s_deep_liquidity = kyle_lambda(1_000_000, 10_000_000_000, 0.05)
    assert s_deep_liquidity < s_large


def test_institutional_suite_contracts():
    bundle_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "bundle"))
    index_path = os.path.join(bundle_dir, "index.html")
    style_path = os.path.join(bundle_dir, "style.css")
    app_path = os.path.join(bundle_dir, "app.js")

    with open(index_path, "r", encoding="utf-8") as f:
        html = f.read()
    with open(style_path, "r", encoding="utf-8") as f:
        css = f.read()
    with open(app_path, "r", encoding="utf-8") as f:
        js = f.read()

    # Red test assertions for institutional components
    assert "id=\"shortcuts-modal\"" in html
    assert "id=\"inspector-chart-container\"" in html
    assert "id=\"factor-radar-container\"" in html
    assert "id=\"slippage-depth-matrix\"" in html
    assert ".chart-stage" in css
    assert ".radar-stage" in css
    assert ".slippage-table" in css
    assert "renderInteractiveChart" in js
    assert "renderFactorRadar" in js
    assert "renderSlippageMatrix" in js
    assert "initKeyboardEngine" in js
    assert "initWorkspacePersistence" in js


def test_zero_prompt_leaks_in_bundle():
    import re
    bundle_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "bundle"))
    js_path = os.path.join(bundle_dir, "app.js")
    html_path = os.path.join(bundle_dir, "index.html")
    with open(js_path, "r", encoding="utf-8") as f:
        js = f.read()
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Invariant: Zero prompt leaks; neither JS nor HTML may expose 'prompt' to end users
    assert not re.search(r'\bprompt\b', js, re.IGNORECASE), "Detected leaked 'prompt' keyword in bundle/app.js"
    assert not re.search(r'\bprompt\b', html, re.IGNORECASE), "Detected leaked 'prompt' keyword in bundle/index.html"




