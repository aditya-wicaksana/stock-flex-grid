# Stock Flex Grid

A zero-dependency, single-file dashboard that displays multiple U.S. stock charts in a responsive grid using TradingView's free embeddable widget.

## Features

- **Responsive grid layout** — automatically adapts to the viewport:
  | Breakpoint | Grid | Charts shown |
  |---|---|---|
  | Desktop (≥ 1200 px) | 4 × 2 | 8 |
  | Tablet Landscape (768–1199 px, landscape) | 3 × 2 | 6 |
  | Tablet Portrait (768–1199 px, portrait) | 2 × 3 | 6 |
  | Mobile Landscape (< 768 px, landscape) | 2 × 1 | 2 |
  | Mobile Portrait (< 768 px, portrait) | 1 × 2 | 2 |

- **Pre-market & after-hours data** — extended hours enabled on every chart
- **Configurable intervals** — 1m, 5m, 15m, 30m, 1h, 1D, 1W
- **Dark / Light theme** — switchable globally; matched to the TradingView widget theme
- **Apply to All** — reload all visible charts with the current interval and theme at once
- **Per-slot ticker input** — type any ticker and press Enter or click Load
- **Collapsible toolbar** — hide the header controls to maximise chart area
- **Persistent settings** — tickers, interval, theme, and UI preferences are saved to `localStorage` and restored on next visit

## Default tickers

`AAPL`, `MSFT`, `NVDA`, `AMZN`, `GOOGL`, `TSLA`, `META`, `JPM`

## Usage

Open `index.html` directly in any modern browser — no build step or server required.

```
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

Or serve it with any static file server:

```
npx serve .
python3 -m http.server 8080
```

## How it works

`index.html` is entirely self-contained (HTML + CSS + vanilla JS, ~600 lines). On load it:

1. Reads saved preferences from `localStorage` (`stockgrid_v1`).
2. Detects the viewport layout and renders the appropriate grid.
3. Loads a TradingView candlestick widget into each visible card slot via the public `tv.js` CDN script.
4. Wires up resize/orientation-change listeners to re-detect the layout and reload widgets when the grid shape changes.

Charts are loaded lazily — slots that are hidden in the current layout are not initialized until they become visible.

## Dependencies

- [TradingView Widget](https://www.tradingview.com/widget/) (`https://s3.tradingview.com/tv.js`) — loaded from CDN at runtime. Requires an internet connection.

## Browser support

Any modern browser with ES2015+ support (Chrome, Firefox, Safari, Edge).
