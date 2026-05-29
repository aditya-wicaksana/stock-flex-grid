const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>U.S. Stock Chart Grid</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body { height: 100%; overflow: hidden; }

    body {
      background: #0d1117;
      color: #e6edf3;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
    }

    /* ── Header ────────────────────────────────────────────── */
    header {
      background: #161b22;
      border-bottom: 1px solid #30363d;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
      flex-shrink: 0;
    }

    .global-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      flex: 1;
    }

    .control-label {
      font-size: 0.75rem;
      color: #8b949e;
      white-space: nowrap;
    }

    .interval-group {
      display: flex;
      gap: 3px;
      background: #0d1117;
      border: 1px solid #30363d;
      border-radius: 6px;
      padding: 3px;
    }

    .interval-btn {
      padding: 4px 9px;
      font-size: 0.75rem;
      font-weight: 500;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: transparent;
      color: #8b949e;
      transition: background 0.15s, color 0.15s;
    }
    .interval-btn:hover  { background: #21262d; color: #e6edf3; }
    .interval-btn.active { background: #1f6feb; color: #fff; }

    .theme-group {
      display: flex;
      gap: 3px;
      background: #0d1117;
      border: 1px solid #30363d;
      border-radius: 6px;
      padding: 3px;
    }

    .theme-btn {
      padding: 4px 9px;
      font-size: 0.75rem;
      font-weight: 500;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: transparent;
      color: #8b949e;
      transition: background 0.15s, color 0.15s;
    }
    .theme-btn:hover  { background: #21262d; color: #e6edf3; }
    .theme-btn.active { background: #388bfd26; color: #58a6ff; border: 1px solid #1f6feb; }

    .apply-btn {
      padding: 5px 12px;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid #1f6feb;
      border-radius: 6px;
      cursor: pointer;
      background: transparent;
      color: #58a6ff;
      transition: background 0.15s;
      white-space: nowrap;
    }
    .apply-btn:hover { background: #1f6feb22; }

    .toggle-btn {
      padding: 4px 10px;
      font-size: 0.75rem;
      font-weight: 500;
      border: 1px solid #30363d;
      border-radius: 5px;
      cursor: pointer;
      background: transparent;
      color: #8b949e;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
      white-space: nowrap;
    }
    .toggle-btn:hover  { background: #21262d; color: #e6edf3; }
    .toggle-btn.active { background: #1f6feb22; color: #58a6ff; border-color: #1f6feb; }

    main.hide-inputs .card-header { display: none; }

    .badge {
      font-size: 0.7rem;
      border-radius: 12px;
      padding: 3px 9px;
      white-space: nowrap;
    }
    .badge-green { background: #1a3a1a; color: #3fb950; border: 1px solid #238636; }
    .badge-blue  { background: #0d2a4a; color: #79c0ff; border: 1px solid #1f6feb; }

    /* ── Chart-controls collapse ────────────────────────────── */
    .ctrl-toggle {
      padding: 3px 8px;
      font-size: 0.75rem;
      border: 1px solid #30363d;
      border-radius: 5px;
      cursor: pointer;
      background: transparent;
      color: #8b949e;
      flex-shrink: 0;
      transition: background 0.15s, color 0.15s;
      line-height: 1;
    }
    .ctrl-toggle:hover { background: #21262d; color: #e6edf3; }
    body.theme-light .ctrl-toggle       { border-color: #d0d7de; color: #57606a; }
    body.theme-light .ctrl-toggle:hover { background: #f3f4f6; color: #24292f; }

    #chartControls {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    #chartControls.hidden { display: none; }

    /* ── Portfolio toolbar elements ─────────────────────────── */
    .portfolio-btn {
      padding: 5px 12px;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid #30363d;
      border-radius: 6px;
      cursor: pointer;
      background: transparent;
      color: #8b949e;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
      white-space: nowrap;
    }
    .portfolio-btn:hover { background: #21262d; color: #e6edf3; border-color: #8b949e; }

    .portfolio-total {
      font-size: 1.1rem;
      font-weight: 700;
      color: #3fb950;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
      letter-spacing: 0.01em;
    }
    .portfolio-total:empty { display: none; }

    .portfolio-change {
      font-size: 0.82rem;
      font-weight: 600;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
    .portfolio-change.up   { color: #3fb950; }
    .portfolio-change.down { color: #f85149; }
    .portfolio-change:empty { display: none; }

    .portfolio-updated {
      font-size: 0.68rem;
      color: #484f58;
      white-space: nowrap;
    }
    .portfolio-updated:empty { display: none; }
    body.theme-light .portfolio-change.up   { color: #1a7f37; }
    body.theme-light .portfolio-change.down { color: #cf222e; }
    body.theme-light .portfolio-updated { color: #8c959f; }

    /* ── Grid ───────────────────────────────────────────────── */
    main {
      flex: 1;
      display: grid;
      gap: 8px;
      padding: 8px;
      min-height: 0;
      overflow: hidden;
    }

    main.layout-desktop          { grid-template-columns: repeat(4,1fr); grid-template-rows: repeat(2,1fr); }
    main.layout-tablet-landscape { grid-template-columns: repeat(3,1fr); grid-template-rows: repeat(2,1fr); }
    main.layout-tablet-portrait  { grid-template-columns: repeat(2,1fr); grid-template-rows: repeat(3,1fr); }
    main.layout-mobile-landscape { grid-template-columns: repeat(2,1fr); grid-template-rows: repeat(1,1fr); }
    main.layout-mobile-portrait  { grid-template-columns: repeat(1,1fr); grid-template-rows: repeat(2,1fr); }

    /* ── Chart card ─────────────────────────────────────────── */
    .chart-card {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 200px;
      transition: border-color 0.15s;
    }
    .chart-card:hover   { border-color: #58a6ff55; }
    .chart-card[hidden] { display: none !important; }

    .card-header {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 7px 9px;
      background: #0d1117;
      border-bottom: 1px solid #21262d;
      flex-shrink: 0;
    }

    .ticker-input {
      flex: 1;
      background: #21262d;
      border: 1px solid #30363d;
      border-radius: 5px;
      color: #e6edf3;
      font-size: 0.85rem;
      font-weight: 700;
      padding: 4px 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      transition: border-color 0.15s;
    }
    .ticker-input:focus { outline: none; border-color: #58a6ff; background: #161b22; }

    .load-btn {
      padding: 4px 11px;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid #238636;
      border-radius: 5px;
      cursor: pointer;
      background: transparent;
      color: #3fb950;
      transition: background 0.15s;
      white-space: nowrap;
    }
    .load-btn:hover { background: #23863622; }

    .chart-wrap { flex: 1; position: relative; min-height: 0; }
    .chart-wrap .tv-container {
      position: absolute; inset: 0; width: 100%; height: 100%; border: none;
    }

    /* ── Portfolio modal ────────────────────────────────────── */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.65);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-overlay[hidden] { display: none !important; }

    .modal {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 12px;
      width: min(680px, 95vw);
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 12px 40px rgba(0,0,0,0.6);
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-bottom: 1px solid #30363d;
      flex-shrink: 0;
    }
    .modal-title { font-size: 0.95rem; font-weight: 700; color: #e6edf3; }
    .modal-close {
      background: transparent; border: none; cursor: pointer;
      color: #8b949e; font-size: 1rem; padding: 2px 6px; border-radius: 4px;
      line-height: 1; transition: color 0.15s, background 0.15s;
    }
    .modal-close:hover { color: #e6edf3; background: #21262d; }

    .modal-body { flex: 1; overflow-y: auto; padding: 12px 16px; }

    .p-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
    .p-table th {
      color: #8b949e; font-weight: 600; text-align: left;
      padding: 4px 8px; border-bottom: 1px solid #21262d; white-space: nowrap;
    }
    .p-table th.num { text-align: right; }
    .p-table td { padding: 4px 6px; vertical-align: middle; }
    .p-table tbody tr:hover { background: #0d1117; }

    .p-ticker-input, .p-qty-input, .p-avg-input {
      background: #21262d; border: 1px solid #30363d; border-radius: 4px;
      color: #e6edf3; font-size: 0.8rem; padding: 5px 8px; width: 100%;
      transition: border-color 0.15s;
    }
    .p-ticker-input { text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em; }
    .p-qty-input, .p-avg-input { text-align: right; }
    .p-ticker-input:focus, .p-qty-input:focus, .p-avg-input:focus { outline: none; border-color: #58a6ff; background: #161b22; }
    .p-avg-input:disabled { color: #484f58; cursor: default; }

    .p-price-cell, .p-value-cell {
      text-align: right; font-variant-numeric: tabular-nums;
      white-space: nowrap; padding: 4px 8px;
    }
    .p-price-cell { color: #8b949e; font-size: 0.78rem; }
    .p-value-cell { color: #e6edf3; font-size: 0.8rem; font-weight: 500; }

    .p-del {
      background: transparent; border: none; cursor: pointer;
      color: #6e7681; font-size: 0.75rem; padding: 4px 8px;
      border-radius: 4px; transition: color 0.15s, background 0.15s; line-height: 1;
    }
    .p-del:hover { color: #f85149; background: #f8514922; }

    .p-add-btn {
      margin-top: 10px; padding: 6px 12px; font-size: 0.75rem; font-weight: 500;
      border: 1px dashed #30363d; border-radius: 6px; cursor: pointer;
      background: transparent; color: #8b949e; width: 100%;
      transition: color 0.15s, border-color 0.15s;
    }
    .p-add-btn:hover { color: #e6edf3; border-color: #8b949e; }

    .modal-footer {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 16px; border-top: 1px solid #30363d; flex-shrink: 0;
    }
    .modal-total-label { font-size: 0.75rem; color: #8b949e; white-space: nowrap; }
    .modal-total-value {
      font-size: 0.9rem; font-weight: 700; color: #3fb950;
      font-variant-numeric: tabular-nums; flex: 1;
    }
    .modal-actions { display: flex; gap: 6px; }

    .p-save-btn {
      padding: 6px 16px; font-size: 0.75rem; font-weight: 600;
      border: 1px solid #238636; border-radius: 6px; cursor: pointer;
      background: #238636; color: #fff; transition: background 0.15s;
    }
    .p-save-btn:hover { background: #2ea043; }

    .p-cancel-btn {
      padding: 6px 16px; font-size: 0.75rem; font-weight: 600;
      border: 1px solid #30363d; border-radius: 6px; cursor: pointer;
      background: transparent; color: #8b949e; transition: background 0.15s, color 0.15s;
    }
    .p-cancel-btn:hover { background: #21262d; color: #e6edf3; }

    /* ── Light theme ────────────────────────────────────────── */
    body.theme-light { background: #f0f3fa; color: #24292f; }
    body.theme-light header         { background: #f6f8fa; border-bottom-color: #d0d7de; }
    body.theme-light .control-label { color: #57606a; }

    body.theme-light .interval-group { background: #fff; border-color: #d0d7de; }
    body.theme-light .interval-btn   { color: #57606a; }
    body.theme-light .interval-btn:hover  { background: #f3f4f6; color: #24292f; }
    body.theme-light .interval-btn.active { background: #0969da; color: #fff; }

    body.theme-light .theme-group { background: #fff; border-color: #d0d7de; }
    body.theme-light .theme-btn   { color: #57606a; }
    body.theme-light .theme-btn:hover  { background: #f3f4f6; color: #24292f; }
    body.theme-light .theme-btn.active { background: #ddf4ff; color: #0969da; border-color: #0969da; }

    body.theme-light .apply-btn       { border-color: #0969da; color: #0969da; }
    body.theme-light .apply-btn:hover { background: #0969da22; }

    body.theme-light .toggle-btn       { border-color: #d0d7de; color: #57606a; }
    body.theme-light .toggle-btn:hover { background: #f3f4f6; color: #24292f; }
    body.theme-light .toggle-btn.active { background: #ddf4ff; color: #0969da; border-color: #0969da; }

    body.theme-light .badge-green { background: #dafbe1; color: #1a7f37; border-color: #1a7f37; }
    body.theme-light .badge-blue  { background: #ddf4ff; color: #0969da; border-color: #0969da; }

    body.theme-light .portfolio-btn       { border-color: #d0d7de; color: #57606a; }
    body.theme-light .portfolio-btn:hover { background: #f3f4f6; color: #24292f; border-color: #24292f; }
    body.theme-light .portfolio-total     { color: #1a7f37; }

    body.theme-light .chart-card       { background: #fff; border-color: #d0d7de; }
    body.theme-light .chart-card:hover { border-color: #0969da55; }
    body.theme-light .card-header      { background: #f6f8fa; border-bottom-color: #d0d7de; }
    body.theme-light .ticker-input     { background: #fff; border-color: #d0d7de; color: #24292f; }
    body.theme-light .ticker-input:focus { border-color: #0969da; }
    body.theme-light .load-btn         { border-color: #1a7f37; color: #1a7f37; }
    body.theme-light .load-btn:hover   { background: #1a7f3722; }

    body.theme-light .modal             { background: #fff; border-color: #d0d7de; box-shadow: 0 12px 40px rgba(0,0,0,0.15); }
    body.theme-light .modal-header      { border-bottom-color: #d0d7de; }
    body.theme-light .modal-title       { color: #24292f; }
    body.theme-light .modal-close       { color: #57606a; }
    body.theme-light .modal-close:hover { background: #f3f4f6; color: #24292f; }
    body.theme-light .p-table th        { color: #57606a; border-bottom-color: #d0d7de; }
    body.theme-light .p-table tbody tr:hover { background: #f6f8fa; }
    body.theme-light .p-ticker-input, body.theme-light .p-qty-input, body.theme-light .p-avg-input {
      background: #f6f8fa; border-color: #d0d7de; color: #24292f;
    }
    body.theme-light .p-ticker-input:focus, body.theme-light .p-qty-input:focus, body.theme-light .p-avg-input:focus {
      border-color: #0969da; background: #fff;
    }
    body.theme-light .p-avg-input:disabled { color: #8c959f; }
    body.theme-light .p-price-cell  { color: #57606a; }
    body.theme-light .p-value-cell  { color: #24292f; }
    body.theme-light .p-del:hover   { color: #cf222e; background: #cf222e22; }
    body.theme-light .p-add-btn     { border-color: #d0d7de; color: #57606a; }
    body.theme-light .p-add-btn:hover { color: #24292f; border-color: #57606a; }
    body.theme-light .modal-footer  { border-top-color: #d0d7de; }
    body.theme-light .modal-total-label { color: #57606a; }
    body.theme-light .modal-total-value { color: #1a7f37; }
    body.theme-light .p-cancel-btn  { border-color: #d0d7de; color: #57606a; }
    body.theme-light .p-cancel-btn:hover { background: #f3f4f6; color: #24292f; }
  </style>
</head>
<body>
<script src="https://s3.tradingview.com/tv.js"><\/script>

<header>
  <div class="global-controls">
    <button class="ctrl-toggle" id="ctrlToggle" title="Show / hide chart controls">&#9664;</button>

    <div id="chartControls">
      <span class="control-label">Interval:</span>
      <div class="interval-group" id="intervalGroup">
        <button class="interval-btn" data-val="1">1m</button>
        <button class="interval-btn" data-val="5">5m</button>
        <button class="interval-btn" data-val="15">15m</button>
        <button class="interval-btn" data-val="30">30m</button>
        <button class="interval-btn" data-val="60">1h</button>
        <button class="interval-btn active" data-val="D">1D</button>
        <button class="interval-btn" data-val="W">1W</button>
      </div>

      <span class="control-label">Theme:</span>
      <div class="theme-group">
        <button class="theme-btn active" data-theme="dark">Dark</button>
        <button class="theme-btn" data-theme="light">Light</button>
      </div>

      <button class="apply-btn" id="applyAll">Apply to All</button>

      <span class="control-label">Show:</span>
      <button class="toggle-btn active" id="toggleInputs">Inputs</button>

      <span class="badge badge-green">&#10003; Pre-market &amp; After-hours</span>
      <span class="badge badge-blue" id="layoutBadge">&#8212;</span>
    </div>

    <button class="portfolio-btn" id="portfolioBtn">Edit Portfolio</button>
    <span class="portfolio-total" id="portfolioTotal"></span>
    <span class="portfolio-change" id="portfolioChange"></span>
    <span class="portfolio-updated" id="portfolioUpdated"></span>
  </div>
</header>

<main id="grid"></main>

<!-- Portfolio modal -->
<div class="modal-overlay" id="portfolioModal" hidden>
  <div class="modal">
    <div class="modal-header">
      <span class="modal-title">Portfolio</span>
      <button class="modal-close" id="modalClose" title="Close">&#10005;</button>
    </div>
    <div class="modal-body">
      <table class="p-table">
        <thead>
          <tr>
            <th>Ticker / CASH</th>
            <th class="num">Quantity</th>
            <th class="num">Avg Price</th>
            <th class="num">Price</th>
            <th class="num">Value</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="portfolioRows"></tbody>
      </table>
      <button class="p-add-btn" id="addRow">+ Add Row</button>
    </div>
    <div class="modal-footer">
      <span class="modal-total-label">Total</span>
      <span class="modal-total-value" id="modalTotal">&#8212;</span>
      <div class="modal-actions">
        <button class="p-save-btn"   id="savePortfolio">Save</button>
        <button class="p-cancel-btn" id="cancelPortfolio">Cancel</button>
      </div>
    </div>
  </div>
</div>

<script>
  /* ── Storage ──────────────────────────────────────────────── */
  var STORAGE_KEY = "stockgrid_v1";
  function loadSettings() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch(e) { return {}; }
  }
  function saveSettings(patch) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.assign(loadSettings(), patch))); }
    catch(e) {}
  }

  /* ── Restored settings ────────────────────────────────────── */
  var DEFAULT_TICKERS = ["AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "TSLA", "META", "JPM"];
  var saved           = loadSettings();
  var initialTickers  = DEFAULT_TICKERS.map(function(d, i) { return saved.tickers ? (saved.tickers[i] || d) : d; });
  var currentInterval  = saved.interval       || "D";
  var currentTheme     = saved.theme          || "dark";
  var showInputs       = saved.showInputs     !== false;
  var ctrlsCollapsed   = saved.ctrlsCollapsed === true;

  var loaded = [];

  /* ── Layout detection ─────────────────────────────────────── */
  var LAYOUTS = {
    desktop:         { cls: "layout-desktop",          visible: 8, label: "Desktop 4x2" },
    tabletLandscape: { cls: "layout-tablet-landscape", visible: 6, label: "Tablet Landscape 3x2" },
    tabletPortrait:  { cls: "layout-tablet-portrait",  visible: 6, label: "Tablet Portrait 2x3" },
    mobileLandscape: { cls: "layout-mobile-landscape", visible: 2, label: "Mobile Landscape 2x1" },
    mobilePortrait:  { cls: "layout-mobile-portrait",  visible: 2, label: "Mobile Portrait 1x2" },
  };

  function detectLayout() {
    var w = window.innerWidth;
    var isLandscape = window.matchMedia("(orientation: landscape)").matches;
    if (w >= 1200)               return LAYOUTS.desktop;
    if (w >= 768 && isLandscape) return LAYOUTS.tabletLandscape;
    if (w >= 768)                return LAYOUTS.tabletPortrait;
    if (isLandscape)             return LAYOUTS.mobileLandscape;
    return LAYOUTS.mobilePortrait;
  }

  /* ── Build grid ───────────────────────────────────────────── */
  var grid  = document.getElementById("grid");
  var cards = [];

  initialTickers.forEach(function(ticker, i) {
    var card = document.createElement("div");
    card.className   = "chart-card";
    card.dataset.idx = i;
    card.innerHTML   =
      '<div class="card-header">' +
        '<input class="ticker-input" id="ticker-' + i + '" value="' + ticker + '"' +
        ' placeholder="e.g. AAPL" maxlength="12"' +
        ' title="Type a ticker and press Enter or click Load" />' +
        '<button class="load-btn" data-idx="' + i + '">Load<\/button>' +
      '<\/div>' +
      '<div class="chart-wrap" id="wrap-' + i + '"><\/div>';
    grid.appendChild(card);
    cards.push(card);

    card.querySelector(".ticker-input").addEventListener("keydown", function(e) {
      if (e.key === "Enter") loadChart(i);
    });
    card.querySelector(".load-btn").addEventListener("click", function() { loadChart(i); });
  });

  /* ── Apply layout ─────────────────────────────────────────── */
  var activeLayout = null;

  function applyLayout() {
    var layout = detectLayout();
    if (layout === activeLayout) return;
    activeLayout = layout;

    Object.keys(LAYOUTS).forEach(function(k) { grid.classList.remove(LAYOUTS[k].cls); });
    grid.classList.add(layout.cls);

    cards.forEach(function(card, i) {
      var visible = i < layout.visible;
      card.hidden = !visible;
      if (visible && loaded.indexOf(i) === -1) loadChart(i);
    });

    document.getElementById("layoutBadge").textContent = layout.label;
  }

  /* ── TradingView widget ───────────────────────────────────── */
  function loadChart(idx, symbol, interval, theme) {
    symbol   = symbol   != null ? symbol   : document.getElementById("ticker-" + idx).value;
    interval = interval != null ? interval : currentInterval;
    theme    = theme    != null ? theme    : currentTheme;
    symbol   = symbol.trim().toUpperCase();
    if (!symbol) return;

    if (loaded.indexOf(idx) === -1) loaded.push(idx);

    var allTickers = cards.map(function(_, j) { return document.getElementById("ticker-" + j).value; });
    saveSettings({ tickers: allTickers });

    var wrap = document.getElementById("wrap-" + idx);
    wrap.innerHTML = "";

    var containerId = "tv_" + idx + "_" + Date.now();
    var div = document.createElement("div");
    div.id        = containerId;
    div.className = "tv-container";
    wrap.appendChild(div);

    new TradingView.widget({
      autosize:            true,
      symbol:              symbol,
      interval:            interval,
      timezone:            "America/New_York",
      theme:               theme,
      style:               "1",
      locale:              "en",
      toolbar_bg:          theme === "dark" ? "#161b22" : "#f0f3fa",
      enable_publishing:   false,
      hide_top_toolbar:    false,
      hide_legend:         false,
      save_image:          false,
      allow_symbol_change: false,
      extended_hours:      true,
      container_id:        containerId,
    });
  }

  function reloadVisible() {
    cards.forEach(function(card, i) {
      if (!card.hidden) loadChart(i);
    });
  }

  /* ── Resize / orientation ─────────────────────────────────── */
  var resizeTimer = null;
  function onViewportChange() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      var before = activeLayout;
      applyLayout();
      if (activeLayout !== before) reloadVisible();
    }, 150);
  }
  window.addEventListener("resize",            onViewportChange);
  window.addEventListener("orientationchange", onViewportChange);

  /* ── Interval buttons ─────────────────────────────────────── */
  document.getElementById("intervalGroup").addEventListener("click", function(e) {
    var btn = e.target.closest(".interval-btn");
    if (!btn) return;
    document.querySelectorAll("#intervalGroup .interval-btn").forEach(function(b) { b.classList.remove("active"); });
    btn.classList.add("active");
    currentInterval = btn.dataset.val;
    saveSettings({ interval: currentInterval });
  });

  /* ── Theme buttons ────────────────────────────────────────── */
  document.querySelectorAll(".theme-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      document.querySelectorAll(".theme-btn").forEach(function(b) { b.classList.remove("active"); });
      btn.classList.add("active");
      currentTheme = btn.dataset.theme;
      saveSettings({ theme: currentTheme });
      document.body.classList.toggle("theme-light", currentTheme === "light");
    });
  });

  /* ── Apply to All ─────────────────────────────────────────── */
  document.getElementById("applyAll").addEventListener("click", reloadVisible);

  /* ── Chart-controls collapse ──────────────────────────────── */
  function applyCtrlsState() {
    document.getElementById("chartControls").classList.toggle("hidden", ctrlsCollapsed);
    document.getElementById("ctrlToggle").textContent = ctrlsCollapsed ? "►" : "◄";
  }
  document.getElementById("ctrlToggle").addEventListener("click", function() {
    ctrlsCollapsed = !ctrlsCollapsed;
    saveSettings({ ctrlsCollapsed: ctrlsCollapsed });
    applyCtrlsState();
  });

  /* ── Input visibility toggle ──────────────────────────────── */
  function applyVisibility() {
    grid.classList.toggle("hide-inputs", !showInputs);
    document.getElementById("toggleInputs").classList.toggle("active", showInputs);
  }
  document.getElementById("toggleInputs").addEventListener("click", function() {
    showInputs = !showInputs;
    saveSettings({ showInputs: showInputs });
    applyVisibility();
  });

  /* ── Portfolio ────────────────────────────────────────────── */
  var portfolio       = saved.portfolio || [];   /* [{ticker:'AAPL', qty:10, avgPrice:150}] */
  var modalPortfolio  = [];
  var portfolioPrices = {};   /* {AAPL: currentPrice} */
  var portfolioTimer  = null;

  async function fetchPrices(symbols) {
    var nonCash = symbols.filter(function(s) { return s !== "CASH"; });
    if (nonCash.length === 0) return {};
    try {
      var resp = await fetch("/api/quote?symbols=" + nonCash.join(","), { cache: "no-store" });
      var data = await resp.json();
      var prices = {};
      ((data.quoteResponse && data.quoteResponse.result) || []).forEach(function(q) {
        prices[q.symbol] = q.regularMarketPrice;
      });
      return prices;
    } catch(e) {
      return {};
    }
  }

  function calcTotal(items, prices) {
    var total = 0;
    items.forEach(function(item) {
      var t   = (item.ticker || "").toUpperCase();
      var qty = parseFloat(item.qty) || 0;
      if (t === "CASH") {
        total += qty;
      } else if (prices[t] != null) {
        total += qty * prices[t];
      }
    });
    return total;
  }

  function fmtMoney(n) {
    return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calcCostBasis(items) {
    var total = 0;
    items.forEach(function(item) {
      var t        = (item.ticker || "").toUpperCase();
      var qty      = parseFloat(item.qty)      || 0;
      var avgPrice = t === "CASH" ? 1 : (parseFloat(item.avgPrice) || 0);
      total += qty * avgPrice;
    });
    return total;
  }

  function renderToolbarTotal() {
    var el  = document.getElementById("portfolioTotal");
    var chg = document.getElementById("portfolioChange");
    var ts  = document.getElementById("portfolioUpdated");
    if (portfolio.length === 0) {
      el.textContent = ""; chg.textContent = ""; ts.textContent = ""; return;
    }

    var currentTotal = calcTotal(portfolio, portfolioPrices);
    var costBasis    = calcCostBasis(portfolio);
    el.textContent   = fmtMoney(currentTotal);

    /* show change only when every non-cash holding has a price loaded */
    var allHavePrices = portfolio.every(function(item) {
      var t = (item.ticker || "").toUpperCase();
      return t === "CASH" || portfolioPrices[t] != null;
    });

    if (allHavePrices && costBasis > 0) {
      var change = currentTotal - costBasis;
      var pct    = (change / costBasis) * 100;
      var sign   = change >= 0 ? "+" : "-";
      chg.textContent = sign + fmtMoney(Math.abs(change)) +
                        " (" + sign + Math.abs(pct).toFixed(2) + "%)";
      chg.className   = "portfolio-change " + (change >= 0 ? "up" : "down");
    } else {
      chg.textContent = "";
    }

    var now = new Date();
    ts.textContent = "updated " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }

  function renderModalTotal() {
    var el = document.getElementById("modalTotal");
    el.textContent = modalPortfolio.length === 0 ? "—" : fmtMoney(calcTotal(modalPortfolio, portfolioPrices));
  }

  function renderModalRows() {
    var tbody = document.getElementById("portfolioRows");
    tbody.innerHTML = "";
    modalPortfolio.forEach(function(item, i) {
      var t      = (item.ticker || "").toUpperCase();
      var isCash = t === "CASH";
      var price  = isCash ? 1 : portfolioPrices[t];
      var qty    = parseFloat(item.qty) || 0;
      var value  = price != null ? qty * price : null;

      var tr = document.createElement("tr");
      var avgPrice = isCash ? 1 : (parseFloat(item.avgPrice) || "");
      tr.innerHTML =
        '<td><input class="p-ticker-input" value="' + (item.ticker || "") + '"' +
          ' placeholder="e.g. AAPL" data-idx="' + i + '" /></td>' +
        '<td><input class="p-qty-input" type="number" value="' + (item.qty !== "" ? item.qty : "") + '"' +
          ' min="0" step="any" placeholder="0" data-idx="' + i + '" /></td>' +
        '<td><input class="p-avg-input" type="number" value="' + (isCash ? "1" : (item.avgPrice != null ? item.avgPrice : "")) + '"' +
          ' min="0" step="any" placeholder="0"' + (isCash ? ' disabled' : '') + ' data-idx="' + i + '" /></td>' +
        '<td class="p-price-cell">' +
          (isCash ? "&#8212;" : (price != null ? fmtMoney(price) : "&#8212;")) +
        '<\/td>' +
        '<td class="p-value-cell">' + (value != null ? fmtMoney(value) : "&#8212;") + '<\/td>' +
        '<td><button class="p-del" data-idx="' + i + '" title="Remove">&#10005;<\/button><\/td>';
      tbody.appendChild(tr);
    });
    renderModalTotal();
  }

  function refreshModalPrices() {
    var rows = document.querySelectorAll("#portfolioRows tr");
    rows.forEach(function(tr, i) {
      if (i >= modalPortfolio.length) return;
      var t      = (modalPortfolio[i].ticker || "").toUpperCase();
      var isCash = t === "CASH";
      var price  = isCash ? 1 : portfolioPrices[t];
      var qty    = parseFloat(modalPortfolio[i].qty) || 0;
      var value  = price != null ? qty * price : null;
      tr.querySelector(".p-price-cell").innerHTML =
        isCash ? "&#8212;" : (price != null ? fmtMoney(price) : "&#8212;");
      tr.querySelector(".p-value-cell").textContent =
        value != null ? fmtMoney(value) : "—";
    });
    renderModalTotal();
  }

  async function refreshPortfolioValue() {
    if (portfolio.length === 0) { renderToolbarTotal(); return; }
    var symbols = portfolio
      .map(function(p) { return (p.ticker || "").toUpperCase(); })
      .filter(function(s, i, a) { return s && a.indexOf(s) === i && s !== "CASH"; });
    var prices = await fetchPrices(symbols);
    Object.assign(portfolioPrices, prices);
    renderToolbarTotal();
    if (!document.getElementById("portfolioModal").hidden) refreshModalPrices();
  }

  function startPricePolling() {
    clearInterval(portfolioTimer);
    if (portfolio.length === 0) return;
    refreshPortfolioValue();
    portfolioTimer = setInterval(refreshPortfolioValue, 30000);
  }

  /* Modal open / close */
  function openModal() {
    modalPortfolio = portfolio.map(function(p) { return { ticker: p.ticker, qty: p.qty }; });
    renderModalRows();
    document.getElementById("portfolioModal").hidden = false;
    /* fetch prices for items currently in the modal */
    var symbols = modalPortfolio
      .map(function(p) { return (p.ticker || "").toUpperCase(); })
      .filter(function(s, i, a) { return s && a.indexOf(s) === i && s !== "CASH"; });
    if (symbols.length > 0) {
      fetchPrices(symbols).then(function(prices) {
        Object.assign(portfolioPrices, prices);
        refreshModalPrices();
      });
    }
  }

  function closeModal() {
    document.getElementById("portfolioModal").hidden = true;
  }

  function savePortfolioFromModal() {
    /* read current input values before saving */
    var tickerInputs = document.querySelectorAll("#portfolioRows .p-ticker-input");
    var qtyInputs    = document.querySelectorAll("#portfolioRows .p-qty-input");
    var avgInputs    = document.querySelectorAll("#portfolioRows .p-avg-input");
    var result = [];
    tickerInputs.forEach(function(input, i) {
      var ticker   = input.value.trim().toUpperCase().replace(/[^A-Z0-9.\-]/g, "");
      var qty      = parseFloat(qtyInputs[i].value)  || 0;
      var isCash   = ticker === "CASH";
      var avgPrice = isCash ? 1 : (parseFloat(avgInputs[i].value) || 0);
      if (ticker) result.push({ ticker: ticker, qty: qty, avgPrice: avgPrice });
    });
    portfolio = result;
    saveSettings({ portfolio: portfolio });
    closeModal();
    startPricePolling();
  }

  /* Event delegation — tbody */
  document.getElementById("portfolioRows").addEventListener("input", function(e) {
    var idx = parseInt(e.target.dataset.idx, 10);
    if (isNaN(idx)) return;
    if (e.target.classList.contains("p-ticker-input")) {
      modalPortfolio[idx].ticker = e.target.value;
    } else if (e.target.classList.contains("p-qty-input")) {
      modalPortfolio[idx].qty = e.target.value;
      renderModalTotal();
    } else if (e.target.classList.contains("p-avg-input")) {
      modalPortfolio[idx].avgPrice = e.target.value;
    }
  });

  /* Fetch price when user leaves a ticker input */
  document.getElementById("portfolioRows").addEventListener("blur", function(e) {
    if (!e.target.classList.contains("p-ticker-input")) return;
    var ticker = e.target.value.trim().toUpperCase();
    if (!ticker || ticker === "CASH") { refreshModalPrices(); return; }
    fetchPrices([ticker]).then(function(prices) {
      Object.assign(portfolioPrices, prices);
      refreshModalPrices();
    });
  }, true);

  document.getElementById("portfolioRows").addEventListener("click", function(e) {
    var btn = e.target.closest(".p-del");
    if (!btn) return;
    var idx = parseInt(btn.dataset.idx, 10);
    if (!isNaN(idx)) {
      modalPortfolio.splice(idx, 1);
      renderModalRows();
    }
  });

  document.getElementById("addRow").addEventListener("click", function() {
    modalPortfolio.push({ ticker: "", qty: "" });
    renderModalRows();
    var inputs = document.querySelectorAll("#portfolioRows .p-ticker-input");
    if (inputs.length) inputs[inputs.length - 1].focus();
  });

  document.getElementById("portfolioBtn").addEventListener("click", openModal);
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("cancelPortfolio").addEventListener("click", closeModal);
  document.getElementById("savePortfolio").addEventListener("click", savePortfolioFromModal);

  /* Close on overlay backdrop click */
  document.getElementById("portfolioModal").addEventListener("click", function(e) {
    if (e.target === this) closeModal();
  });

  /* ── Boot ─────────────────────────────────────────────────── */
  document.querySelectorAll("#intervalGroup .interval-btn").forEach(function(b) {
    b.classList.toggle("active", b.dataset.val === currentInterval);
  });
  document.querySelectorAll(".theme-btn").forEach(function(b) {
    b.classList.toggle("active", b.dataset.theme === currentTheme);
  });
  if (currentTheme === "light") document.body.classList.add("theme-light");

  applyCtrlsState();
  applyVisibility();
  applyLayout();
  startPricePolling();
<\/script>
</body>
</html>`;

export default {
  async fetch(request) {
    const url = new URL(request.url);

    /* Price proxy — uses the chart API (no crumb/auth required) */
    if (url.pathname === "/api/quote") {
      const raw     = url.searchParams.get("symbols") || "";
      const symbols = raw.split(",").map(s => s.trim().toUpperCase()).filter(Boolean);

      if (symbols.length === 0) {
        return new Response(JSON.stringify({ quoteResponse: { result: [] } }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

      const results = await Promise.all(
        symbols.map(async (sym) => {
          try {
            const r    = await fetch(
              "https://query1.finance.yahoo.com/v8/finance/chart/" + sym + "?interval=1d&range=5d",
              { headers: { "User-Agent": UA } }
            );
            const d    = await r.json();
            const meta = d && d.chart && d.chart.result && d.chart.result[0] && d.chart.result[0].meta;
            if (!meta) return null;
            // Pick the most current available price across all sessions
            let price = meta.regularMarketPrice;
            if (meta.marketState === "PRE"  && meta.preMarketPrice  > 0) price = meta.preMarketPrice;
            if (meta.marketState === "POST" && meta.postMarketPrice > 0) price = meta.postMarketPrice;
            if (price == null) price = meta.chartPreviousClose;

            return {
              symbol:             meta.symbol || sym,
              regularMarketPrice: price,
            };
          } catch (_) {
            return null;
          }
        })
      );

      return new Response(
        JSON.stringify({ quoteResponse: { result: results.filter(Boolean) } }),
        { headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } }
      );
    }

    return new Response(HTML, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
};
