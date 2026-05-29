const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>U.S. Stock Chart Grid</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      height: 100%;
      overflow: hidden;
    }

    body {
      background: #0d1117;
      color: #e6edf3;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
    }

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
    .toggle-btn:hover           { background: #21262d; color: #e6edf3; }
    .toggle-btn.active          { background: #1f6feb22; color: #58a6ff; border-color: #1f6feb; }

    main.hide-inputs .card-header { display: none; }

    .badge {
      font-size: 0.7rem;
      border-radius: 12px;
      padding: 3px 9px;
      white-space: nowrap;
    }
    .badge-green {
      background: #1a3a1a;
      color: #3fb950;
      border: 1px solid #238636;
    }
    .badge-blue {
      background: #0d2a4a;
      color: #79c0ff;
      border: 1px solid #1f6feb;
    }

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
    .chart-card:hover          { border-color: #58a6ff55; }
    .chart-card[hidden]        { display: none !important; }

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
    .ticker-input:focus {
      outline: none;
      border-color: #58a6ff;
      background: #161b22;
    }

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

    .chart-wrap {
      flex: 1;
      position: relative;
      min-height: 0;
    }

    .chart-wrap .tv-container {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: none;
    }

    body.theme-light { background: #f0f3fa; color: #24292f; }
    body.theme-light header          { background: #f6f8fa; border-bottom-color: #d0d7de; }
    body.theme-light .control-label  { color: #57606a; }

    body.theme-light .interval-group { background: #ffffff; border-color: #d0d7de; }
    body.theme-light .interval-btn   { color: #57606a; }
    body.theme-light .interval-btn:hover { background: #f3f4f6; color: #24292f; }

    body.theme-light .theme-group    { background: #ffffff; border-color: #d0d7de; }
    body.theme-light .theme-btn      { color: #57606a; }
    body.theme-light .theme-btn:hover { background: #f3f4f6; color: #24292f; }
    body.theme-light .theme-btn.active { background: #ddf4ff; color: #0969da; border-color: #0969da; }

    body.theme-light .apply-btn      { border-color: #0969da; color: #0969da; }
    body.theme-light .apply-btn:hover { background: #0969da22; }

    body.theme-light .toggle-btn     { border-color: #d0d7de; color: #57606a; }
    body.theme-light .toggle-btn:hover { background: #f3f4f6; color: #24292f; }
    body.theme-light .toggle-btn.active { background: #ddf4ff; color: #0969da; border-color: #0969da; }

    body.theme-light .badge-green    { background: #dafbe1; color: #1a7f37; border-color: #1a7f37; }
    body.theme-light .badge-blue     { background: #ddf4ff; color: #0969da; border-color: #0969da; }

    body.theme-light .chart-card     { background: #ffffff; border-color: #d0d7de; }
    body.theme-light .chart-card:hover { border-color: #0969da55; }

    body.theme-light .card-header    { background: #f6f8fa; border-bottom-color: #d0d7de; }
    body.theme-light .ticker-input   { background: #ffffff; border-color: #d0d7de; color: #24292f; }
    body.theme-light .ticker-input:focus { border-color: #0969da; }
    body.theme-light .load-btn       { border-color: #1a7f37; color: #1a7f37; }
    body.theme-light .load-btn:hover { background: #1a7f3722; }

    .toolbar-toggle {
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
    .toolbar-toggle:hover { background: #21262d; color: #e6edf3; }
    body.theme-light .toolbar-toggle { border-color: #d0d7de; color: #57606a; }
    body.theme-light .toolbar-toggle:hover { background: #f3f4f6; color: #24292f; }

    header.collapsed { padding: 5px 16px; }
    header.collapsed .global-controls { display: none; }
  </style>
</head>
<body>
<script src="https://s3.tradingview.com/tv.js"><\/script>

<header>
<div class="global-controls">
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
    <button class="toggle-btn active" id="toggleInputs" title="Show / hide ticker inputs">Inputs</button>

    <span class="badge badge-green">&#10003; Pre-market &amp; After-hours</span>
    <span class="badge badge-blue" id="layoutBadge">&#8212;</span>
  </div>
  <button class="toolbar-toggle" id="toolbarToggle" title="Collapse / expand toolbar">&#9668;</button>
</header>

<main id="grid"></main>

<script>
  const STORAGE_KEY = "stockgrid_v1";
  function loadSettings() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }
  function saveSettings(patch) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...loadSettings(), ...patch })); }
    catch {}
  }

  const DEFAULT_TICKERS = ["AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "TSLA", "META", "JPM"];
  const saved             = loadSettings();
  const initialTickers    = DEFAULT_TICKERS.map((d, i) => saved.tickers?.[i] || d);
  let currentInterval  = saved.interval    || "D";
  let currentTheme     = saved.theme       || "dark";
  let showInputs        = saved.showInputs   !== false;
  let toolbarCollapsed  = saved.toolbarCollapsed === true;

  const loaded = new Set();

  const LAYOUTS = {
    desktop:         { cls: "layout-desktop",          visible: 8, label: "Desktop 4x2" },
    tabletLandscape: { cls: "layout-tablet-landscape", visible: 6, label: "Tablet Landscape 3x2" },
    tabletPortrait:  { cls: "layout-tablet-portrait",  visible: 6, label: "Tablet Portrait 2x3" },
    mobileLandscape: { cls: "layout-mobile-landscape", visible: 2, label: "Mobile Landscape 2x1" },
    mobilePortrait:  { cls: "layout-mobile-portrait",  visible: 2, label: "Mobile Portrait 1x2" },
  };

  function detectLayout() {
    const w           = window.innerWidth;
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    if (w >= 1200)                    return LAYOUTS.desktop;
    if (w >= 768  &&  isLandscape)    return LAYOUTS.tabletLandscape;
    if (w >= 768  && !isLandscape)    return LAYOUTS.tabletPortrait;
    if (              isLandscape)    return LAYOUTS.mobileLandscape;
    return LAYOUTS.mobilePortrait;
  }

  const grid   = document.getElementById("grid");
  const cards  = [];

  initialTickers.forEach((ticker, i) => {
    const card = document.createElement("div");
    card.className  = "chart-card";
    card.dataset.idx = i;
    card.innerHTML  = '<div class="card-header">' +
      '<input class="ticker-input" id="ticker-' + i + '" value="' + ticker + '"' +
      ' placeholder="e.g. AAPL" maxlength="12"' +
      ' title="Type a ticker and press Enter or click Load" />' +
      '<button class="load-btn" data-idx="' + i + '">Load<\/button>' +
      '<\/div>' +
      '<div class="chart-wrap" id="wrap-' + i + '"><\/div>';
    grid.appendChild(card);
    cards.push(card);

    card.querySelector(".ticker-input").addEventListener("keydown", e => {
      if (e.key === "Enter") loadChart(i);
    });
    card.querySelector(".load-btn").addEventListener("click", () => loadChart(i));
  });

  let activeLayout = null;

  function applyLayout() {
    const layout = detectLayout();
    if (layout === activeLayout) return;
    activeLayout = layout;

    Object.values(LAYOUTS).forEach(l => grid.classList.remove(l.cls));
    grid.classList.add(layout.cls);

    cards.forEach((card, i) => {
      const visible = i < layout.visible;
      card.hidden = !visible;
      if (visible && !loaded.has(i)) loadChart(i);
    });

    document.getElementById("layoutBadge").textContent = layout.label;
  }

  function tvSymbol(raw) {
    return raw.trim().toUpperCase();
  }

  function loadChart(idx, symbol, interval, theme) {
    symbol   = symbol   ?? document.getElementById("ticker-" + idx).value;
    interval = interval ?? currentInterval;
    theme    = theme    ?? currentTheme;
    symbol   = tvSymbol(symbol);
    if (!symbol) return;

    loaded.add(idx);

    const allTickers = cards.map((_, j) => document.getElementById("ticker-" + j).value);
    saveSettings({ tickers: allTickers });

    const wrap = document.getElementById("wrap-" + idx);
    wrap.innerHTML = "";

    const containerId = "tv_" + idx + "_" + Date.now();
    const div = document.createElement("div");
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
    cards.forEach((card, i) => {
      if (!card.hidden) loadChart(i);
    });
  }

  let resizeTimer = null;

  function onViewportChange() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const before = activeLayout;
      applyLayout();
      if (activeLayout !== before) reloadVisible();
    }, 150);
  }

  window.addEventListener("resize",            onViewportChange);
  window.addEventListener("orientationchange", onViewportChange);

  document.getElementById("intervalGroup").addEventListener("click", e => {
    const btn = e.target.closest(".interval-btn");
    if (!btn) return;
    document.querySelectorAll("#intervalGroup .interval-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentInterval = btn.dataset.val;
    saveSettings({ interval: currentInterval });
  });

  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".theme-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentTheme = btn.dataset.theme;
      saveSettings({ theme: currentTheme });
      document.body.classList.toggle("theme-light", currentTheme === "light");
    });
  });

  document.getElementById("applyAll").addEventListener("click", reloadVisible);

  function applyToolbarState() {
    const hdr = document.querySelector("header");
    hdr.classList.toggle("collapsed", toolbarCollapsed);
    document.getElementById("toolbarToggle").textContent = toolbarCollapsed ? "►" : "◄";
  }

  document.getElementById("toolbarToggle").addEventListener("click", () => {
    toolbarCollapsed = !toolbarCollapsed;
    saveSettings({ toolbarCollapsed });
    applyToolbarState();
  });

  function applyVisibility() {
    grid.classList.toggle("hide-inputs", !showInputs);
    document.getElementById("toggleInputs").classList.toggle("active", showInputs);
  }

  document.getElementById("toggleInputs").addEventListener("click", () => {
    showInputs = !showInputs;
    saveSettings({ showInputs });
    applyVisibility();
  });

  document.querySelectorAll("#intervalGroup .interval-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.val === currentInterval);
  });

  applyToolbarState();
  applyVisibility();

  document.querySelectorAll(".theme-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.theme === currentTheme);
  });
  if (currentTheme === "light") document.body.classList.add("theme-light");

  applyLayout();
<\/script>
</body>
</html>`;

export default {
  async fetch(request) {
    return new Response(HTML, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
};
