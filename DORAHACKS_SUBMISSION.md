# DoraHacks BUIDL Submission: CMC Alpha Terminal for Anna AI OS

## 1. Project Overview
- **Project Name:** CMC Alpha Terminal
- **App Slug:** `cmc-alpha-terminal`
- **Tagline:** Institutional Quantitative Crypto Intelligence & Alpha Screener for Anna AI OS
- **Track:** Anna Native App / Financial Analytics / Developer Tools
- **GitHub Repository:** https://github.com/Ishant5436/anna-cmc-terminal
- **License:** MIT License

---

## 2. Problem Statement
Traders and quantitative researchers operating on desktop platforms face extreme cognitive overload toggling between fragmented web browser tabs, charting tools, and exchange interfaces. Furthermore, retail indicators frequently fail during high-volatility regimes due to lack of extreme-value variance estimation and liquidity slippage modeling.

Existing AI chat assistants lack direct access to deterministic quantitative screening kernels, forcing them to hallucinate price action and market breadth.

---

## 3. The Solution: CMC Alpha Terminal on Anna AI OS
CMC Alpha Terminal transforms Anna into an institutional crypto trading desk. It pairs an Executa stdio tool plugin (`bundled:cmc-screener`) with a responsive, glassmorphic desktop interface that can be operated visually or orchestrated via natural language in Anna chat.

### Core Features:
1. **Multi-Factor Cross-Sectional Momentum:** Screens top liquid cryptocurrencies using combined 24h/7d return vectors, volume weighting, and logarithmic market cap normalization.
2. **Parkinson Realized Volatility Regimes:** Calculates extreme-value intraday variance from high/low data to classify market conditions into `COMPRESSION` (breakout watch), `TRENDING` (directional momentum), and `EXPANSION_VOLATILE` (turbulent risk).
3. **Turnover & Liquidity Depth Analysis:** Analyzes 24h volume-to-market-cap velocity to classify execution slippage tiers (`< 2 bps` to `> 12 bps`).
4. **Market Breadth & Dominance Tracking:** Monitors real-time advance/decline ratios, Bitcoin dominance, and aggregate market capitalization.
5. **Direct Anna Chat Integration:** With a single click, users can transmit quantitative reports directly into their active Anna conversation (`anna.chat.write_message`) for multi-turn agent analysis.

---

## 4. Technical Architecture & Invariants
- **Host Runtime:** Anna App Schema 2 (`manifest.json`) with fine-grained Host API security allowlists (`tools.invoke`, `chat.write_message`, `storage`, `window`).
- **Executa Plugin:** Python 3.10+ standalone process communicating via JSON-RPC 2.0 over `stdio`.
- **Zero-Failure Fallback:** Connects to live CoinMarketCap Pro API when keys are provided, with deterministic fallback to institutional sample fixtures when offline.
- **Verification:** 100% passing automated test suite (11 unit and invariant tests) and strict CLI schema validation (`anna-app validate --strict`).
