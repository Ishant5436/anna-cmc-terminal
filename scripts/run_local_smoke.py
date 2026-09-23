#!/usr/bin/env python3
"""
Local smoke test for cmc-screener Executa plugin over stdio JSON-RPC 2.0.
Spawns the plugin as a subprocess and tests describe, health, and invoke actions.
"""

import json
import subprocess
import sys
import os

PLUGIN_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "executas", "cmc-screener", "cmc_plugin.py"))


def main():
    print(f"Launching Executa plugin: {PLUGIN_PATH}")
    proc = subprocess.Popen(
        [sys.executable, PLUGIN_PATH],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )

    def rpc_call(req_id: int, method: str, params: dict) -> dict:
        req = {"jsonrpc": "2.0", "id": req_id, "method": method, "params": params}
        proc.stdin.write(json.dumps(req) + "\n")
        proc.stdin.flush()
        line = proc.stdout.readline()
        assert line, f"Empty response from plugin for method {method}"
        return json.loads(line.strip())

    try:
        # 1. Test describe
        res = rpc_call(1, "describe", {})
        assert "result" in res, f"describe failed: {res}"
        print("✓ RPC describe: passed")

        # 2. Test health
        res = rpc_call(2, "health", {})
        assert res.get("result", {}).get("status") == "ok", f"health failed: {res}"
        print("✓ RPC health: passed")

        # 3. Test invoke momentum
        res = rpc_call(3, "invoke", {"tool": "screener", "arguments": {"action": "momentum", "top_n": 3}})
        assert res.get("result", {}).get("success") is True, f"invoke momentum failed: {res}"
        print(f"✓ RPC invoke momentum: passed ({len(res['result']['data']['assets'])} assets)")

        # 4. Test invoke volatility
        res = rpc_call(4, "invoke", {"tool": "screener", "arguments": {"action": "volatility", "symbol": "BTC"}})
        assert res.get("result", {}).get("success") is True, f"invoke volatility failed: {res}"
        print(f"✓ RPC invoke volatility: passed (regime={res['result']['data']['regime']})")

        # 5. Test invoke liquidity
        res = rpc_call(5, "invoke", {"tool": "screener", "arguments": {"action": "liquidity", "symbol": "ETH"}})
        assert res.get("result", {}).get("success") is True, f"invoke liquidity failed: {res}"
        print(f"✓ RPC invoke liquidity: passed (grade={res['result']['data']['liquidity_grade']})")

        # 6. Test invoke breadth
        res = rpc_call(6, "invoke", {"tool": "screener", "arguments": {"action": "breadth"}})
        assert res.get("result", {}).get("success") is True, f"invoke breadth failed: {res}"
        print(f"✓ RPC invoke breadth: passed (adv/dec={res['result']['data']['advance_decline_ratio']})")

        print("\nAll 6 stdio smoke checks passed successfully!")
    finally:
        proc.terminate()
        proc.wait(timeout=2)


if __name__ == "__main__":
    main()
