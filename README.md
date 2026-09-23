# CMC Alpha Terminal — Anna AI OS App

[![Validation](https://img.shields.io/badge/anna--app-validate%20--strict%20passed-success)](https://anna.partners)
[![Schema](https://img.shields.io/badge/schema-v2-blue)](https://anna.partners/developers/apps/app-manifest)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

An institutional quantitative intelligence terminal and alpha screener designed natively for **Anna AI OS**.
Pairs a high-performance Python Executa plugin with an interactive glassmorphic desktop interface to deliver real-time cross-sectional momentum screening, Parkinson realized volatility regime detection, liquidity depth analysis, and global market breadth tracking.

---

## 1. Architecture Overview

```
anna-cmc-terminal/
├── manifest.json                  # Schema 2 Anna App manifest (UI + Host API + Tool grants)
├── app.json                       # Store listing metadata (categories, descriptions, bundled executas)
├── bundle/                        # Frontend Web UI (SPA iframe bundle)
│   ├── index.html                 # Terminal dashboard layout (metric ribbon, navigation tabs)
│   ├── app.js                     # Controller: AnnaAppRuntime SDK bridge + UI rendering
│   ├── style.css                  # Institutional dark terminal theme (glassmorphic styling)
│   └── icon.svg                   # Vector SVG application icon
├── executas/
│   └── cmc-screener/              # Standalone Python Executa plugin (JSON-RPC 2.0 over stdio)
│       ├── cmc_plugin.py          # Dispatcher handling describe, invoke, and health methods
│       ├── pyproject.toml         # Dependencies managed via uv (httpx, etc.)
│       └── sample_data.py         # Institutional sample fixtures for zero-failure fallback
├── tests/
│   └── test_cmc_plugin.py         # Automated pytest suite testing JSON-RPC methods and error states
├── scripts/
│   └── run_local_smoke.py         # Local stdio smoke test script
└── README.md                      # Architecture and verification documentation
```

### 1.1 Components & Interaction
1. **Executa Tool (`executas/cmc-screener`):**
   - Implements JSON-RPC 2.0 over `stdio`.
   - Single dispatcher tool `screener` supporting 5 quantitative actions: `momentum`, `volatility`, `liquidity`, `breadth`, and `quote`.
   - Incorporates zero-failure fallback: queries CoinMarketCap Pro API when credentials are present, falling back to institutional sample fixtures when offline.
2. **Glassmorphic SPA Bundle (`bundle/`):**
   - Connects to the host using `/static/anna-apps/_sdk/latest/index.js` (`AnnaAppRuntime.connect()`).
   - Dispatches tool invocations via `anna.tools.invoke`.
   - Writes quantitative summary reports directly into Anna chat via `anna.chat.write_message`.
   - Updates window titles dynamically via `anna.window.set_title`.

---

## 2. Quantitative Methodologies

### 2.1 Multi-Factor Cross-Sectional Momentum
Calculates cross-sectional relative strength across top liquid cryptocurrency assets:
$$\text{Score} = (0.6 \cdot R_{24\text{h}} + 0.4 \cdot R_{7\text{d}}) \cdot W_{\text{volume}} \cdot \log_{10}(M_{\text{cap}})$$
Assets are sorted in descending order, with percentile rankings assigned across the liquid universe.

### 2.2 Parkinson Realized Volatility
Measures extreme-value intraday price variance from high and low pricing data:
$$\sigma_P = \sqrt{\frac{1}{4 \ln(2)} \ln\left(\frac{H}{L}\right)^2}$$
Annualized volatility $\sigma_{\text{ann}} = \sigma_P \cdot \sqrt{365}$ classifies market conditions into:
- **`COMPRESSION`** ($\sigma_P < 0.025$): Low variance consolidation, breakout watch.
- **`TRENDING`** ($0.025 \le \sigma_P \le 0.050$): Directional momentum, standard risk budget.
- **`EXPANSION_VOLATILE`** ($\sigma_P > 0.050$): Turbulent conditions, volatility gating required.

### 2.3 Liquidity Depth & Turnover Velocity
Evaluates 24-hour volume relative to circulating market capitalization:
$$\text{Turnover} = \frac{V_{24\text{h}}}{M_{\text{cap}}}$$
Tiers execution slippage risk into `INSTITUTIONAL_DEEP` ($< 2\text{ bps}$), `LIQUID_MIDCAP` ($2 - 6\text{ bps}$), and `THIN_SPECULATIVE` ($> 12\text{ bps}$).

---

## 3. Local Development & Verification

### 3.1 Prerequisites
- Node.js 22+
- Python 3.10+ and `uv`
- `@anna-ai/cli` (`npm install -g @anna-ai/cli`)

### 3.2 Running the Strict Validation Gate
Verify JSON Schema 2 compliance, tool resolution, and host API security allowlists:
```bash
anna-app validate --strict
```

### 3.3 Running Unit Tests & Smoke Verification
Run automated unit tests and stdio smoke checks:
```bash
pytest tests/test_cmc_plugin.py -v
python3 scripts/run_local_smoke.py
```

### 3.4 Launching the Local Development Environment
Launch the local desktop testing shell:
```bash
anna-app dev
```

---

## 4. DoraHacks & Founding Builder Alignment

This application is built for:
- **DoraHacks Hackathon #2349:** *Anna AI App Builder Program* (Submission deadline: September 30, 2026).
- **Anna Founding Builder Program:** Qualified App MAU tracking with monthly builder grant eligibility.

---

## 5. License
MIT License. Authored by Ishant Panchal (ishant.p@somaiya.edu).
