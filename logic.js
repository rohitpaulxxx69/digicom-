/* General Styles & Variables */
:root {
  --color-bg-main: #0a0d16;
  --color-bg-card: #121824;
  --color-bg-input: #1b2336;
  --color-border: #242f47;
  
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #94a3b8;
  --color-text-dim: #64748b;
  
  --color-accent-primary: #3b82f6;
  --color-accent-primary-glow: rgba(59, 130, 246, 0.25);
  
  /* Signal Colors */
  --color-sig-orig: #00bcff;
  --color-sig-orig-glow: rgba(0, 188, 255, 0.2);
  --color-sig-sampled: #ffd000;
  --color-sig-sampled-glow: rgba(255, 208, 0, 0.2);
  --color-sig-recon: #00e676;
  --color-sig-recon-glow: rgba(0, 230, 118, 0.2);
  --color-sig-error: #ff1744;
  --color-sig-error-glow: rgba(255, 23, 68, 0.2);
  --color-sig-sampled-spec: #ec4899; /* pink for replicas */
  --color-sig-sampled-spec-glow: rgba(236, 72, 153, 0.15);
  
  /* State Colors */
  --color-safe: #10b981;
  --color-safe-bg: rgba(16, 185, 129, 0.1);
  --color-warn: #f59e0b;
  --color-warn-bg: rgba(245, 158, 11, 0.1);
  --color-danger: #ef4444;
  --color-danger-bg: rgba(239, 68, 68, 0.1);
  
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  --border-radius: 12px;
  --border-radius-sm: 6px;
  --transition-speed: 0.2s;
  
  --grid-osc-color: rgba(30, 41, 59, 0.7);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--color-bg-main);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  line-height: 1.5;
  padding: 20px;
  min-height: 100vh;
}

.lab-container {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Header */
.lab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
}

.header-left .lab-badge {
  background-color: var(--color-accent-primary);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  letter-spacing: 0.05em;
  display: inline-block;
  margin-bottom: 6px;
}

.header-left h1 {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 2px;
}

.header-left .subtitle {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

/* Indicators */
.status-indicator-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  border: 1px solid transparent;
}

.status-indicator-pill.safe {
  background-color: var(--color-safe-bg);
  color: var(--color-safe);
  border-color: rgba(16, 185, 129, 0.2);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
  animation: pulse-ring 1.5s infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(0.85); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(0.85); opacity: 0.5; }
}

/* Grid Layout */
.lab-grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 20px;
  align-items: start;
}

@media (max-width: 1100px) {
  .lab-grid {
    grid-template-columns: 1fr;
  }
}

/* Sidebar Panels */
.control-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.control-card {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 20px;
}

.control-card h2 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-primary);
}

.control-card .card-desc {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.control-card .card-formula {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  background-color: var(--color-bg-main);
  padding: 6px 10px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  color: var(--color-sig-orig);
  margin-bottom: 16px;
  text-align: center;
}

.card-divider {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 16px 0;
}

/* Inputs and Sliders */
.input-group {
  margin-bottom: 16px;
}

.input-group:last-child {
  margin-bottom: 0;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}

.input-header label {
  color: var(--color-text-secondary);
}

.unit-readout {
  font-family: var(--font-mono);
  color: var(--color-text-primary);
  font-weight: 700;
  font-size: 0.9rem;
}

.highlighted-readout {
  color: var(--color-sig-sampled);
}

/* Slider Custom Styling */
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background: var(--color-bg-input);
  border-radius: 3px;
  outline: none;
  border: 1px solid var(--color-border);
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-accent-primary);
  cursor: pointer;
  box-shadow: 0 0 6px var(--color-accent-primary-glow);
  transition: transform 0.1s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.quick-fs-entry {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.numeric-input {
  background-color: var(--color-bg-input);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  border-radius: var(--border-radius-sm);
  padding: 4px 8px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  width: 70px;
  text-align: center;
}

.input-label-inline {
  font-size: 0.75rem;
  color: var(--color-text-dim);
}

.help-text {
  font-size: 0.75rem;
  color: var(--color-text-dim);
  margin-top: 4px;
}

/* Presets button styles */
.preset-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn {
  font-family: var(--font-sans);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  padding: 10px 14px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all var(--transition-speed) ease;
  text-align: left;
}

.btn-preset {
  background-color: var(--color-bg-input);
  color: var(--color-text-secondary);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.btn-preset strong {
  color: var(--color-text-primary);
  font-family: var(--font-mono);
}

.btn-preset span {
  font-size: 0.75rem;
  color: var(--color-text-dim);
}

.btn-preset:hover {
  background-color: var(--color-border);
  color: var(--color-text-primary);
  border-color: var(--color-accent-primary);
}

.btn-preset.active {
  background-color: var(--color-accent-primary-glow);
  border-color: var(--color-accent-primary);
  color: var(--color-text-primary);
}

/* Actions Card */
.action-card {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-primary {
  background-color: var(--color-accent-primary);
  color: #fff;
  border-color: transparent;
  font-weight: 700;
  text-align: center;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: none;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.export-buttons {
  display: flex;
  gap: 8px;
}

.export-buttons .btn-secondary {
  flex: 1;
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-text-secondary);
  border-color: var(--color-border);
  text-align: center;
  padding: 8px;
  font-size: 0.8rem;
}

.btn-secondary:hover {
  background-color: var(--color-bg-input);
  color: var(--color-text-primary);
}

/* Collapsible Advanced Card */
.collapsible-card {
  padding: 0;
}

.collapsible-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.collapsible-header h2 {
  margin-bottom: 0;
}

.collapsible-content {
  padding: 0 20px 20px 20px;
  display: none;
  border-top: 1px solid var(--color-border);
  padding-top: 16px;
}

.collapsible-content.show {
  display: block;
}

.toggle-icon {
  font-size: 0.75rem;
  color: var(--color-text-dim);
  transition: transform var(--transition-speed) ease;
}

.collapsible-header.open .toggle-icon {
  transform: rotate(180deg);
}

/* Right Columns / Main Dashboard */
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Status Banner */
.status-banner {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  border-radius: var(--border-radius);
  border: 1px solid transparent;
}

.status-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-details h3 {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.status-details p {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

/* Status Banner Themes */
.safe-banner {
  background-color: var(--color-safe-bg);
  border-color: rgba(16, 185, 129, 0.2);
  color: var(--color-safe);
}
.safe-banner .status-icon { color: var(--color-safe); }
.safe-banner .warning-path { display: none; }

.warn-banner {
  background-color: var(--color-warn-bg);
  border-color: rgba(245, 158, 11, 0.2);
  color: var(--color-warn);
}
.warn-banner .status-icon { color: var(--color-warn); }
.warn-banner .safe-path { display: none; }

.danger-banner {
  background-color: var(--color-danger-bg);
  border-color: rgba(239, 68, 68, 0.2);
  color: var(--color-danger);
}
.danger-banner .status-icon { color: var(--color-danger); }
.danger-banner .safe-path { display: none; }

/* Visualizer Grid */
.visualizer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.screen-card {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 16px;
}

.screen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.screen-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.screen-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.green-pulse {
  background-color: var(--color-safe);
  box-shadow: 0 0 8px var(--color-safe);
}

.screen-title h3 {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

/* Oscilloscope controls */
.canvas-controls {
  display: flex;
  gap: 4px;
}

.btn-icon {
  background-color: var(--color-bg-input);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
}

.btn-icon:hover {
  background-color: var(--color-border);
  color: var(--color-text-primary);
}

.btn-icon.text-btn {
  width: auto;
  padding: 0 10px;
  font-size: 0.75rem;
}

.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 320px;
  background-color: #05080f;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  overflow: hidden;
  cursor: crosshair;
}

.canvas-wrapper canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* Legend items */
.graph-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.legend-item input {
  display: none;
}

.legend-box {
  width: 14px;
  height: 14px;
  border: 2px solid var(--sig-color);
  border-radius: 3px;
  display: inline-block;
  background-color: transparent;
  transition: background-color 0.15s ease;
}

.legend-item input:checked + .legend-box {
  background-color: var(--sig-color);
}

.legend-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.legend-item:hover .legend-label {
  color: var(--color-text-primary);
}

/* Static Legend details */
.legend-item-static {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.legend-box-static {
  width: 12px;
  height: 12px;
  border: 2px solid var(--sig-color);
  border-radius: 2px;
  display: inline-block;
}

.legend-box-static.dashed {
  border-style: dashed;
}

.legend-box-static.fill {
  background-color: var(--sig-color);
  border-color: transparent;
}

.justify-between {
  justify-content: space-between;
}
.flex { display: flex; }
.gap-4 { gap: 16px; }
.text-gray { color: var(--color-text-dim) !important; }

.interaction-tip {
  font-size: 0.72rem;
  color: var(--color-text-dim);
  margin-top: 6px;
  text-align: right;
}

/* Hover readouts on graphs */
.graph-hover-readout {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(5, 8, 15, 0.85);
  border: 1px solid var(--color-border);
  padding: 6px 10px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-primary);
  pointer-events: none;
  display: none;
  z-index: 10;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
}

/* Readouts Grid */
.readouts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}

@media (max-width: 1000px) {
  .readouts-grid {
    grid-template-columns: 1fr;
  }
}

.data-card {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 16px 20px;
}

.data-card h3 {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 8px;
}

/* Stats table */
.stats-table {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.stat-label {
  color: var(--color-text-secondary);
}

.stat-value {
  font-weight: 600;
  color: var(--color-text-primary);
}

.highlighted-value {
  color: var(--color-sig-orig);
}

/* Error metrics styling */
.error-metrics {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.error-metric-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-title {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.metric-value {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-sig-recon);
}

.metric-meter {
  width: 100%;
  height: 4px;
  background-color: var(--color-bg-input);
  border-radius: 2px;
  overflow: hidden;
}

.meter-bar {
  height: 100%;
  width: 0%;
  background-color: var(--color-sig-recon);
  transition: width 0.3s ease;
}

#err-relative + .metric-meter .meter-bar {
  background-color: var(--color-accent-primary);
}

#err-rmse + .metric-meter .meter-bar {
  background-color: var(--color-sig-orig);
}

/* Aliasing Theory Panel */
.alias-theory-panel {
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  line-height: 1.45;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.alias-title {
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}

.alias-steps {
  background-color: var(--color-bg-main);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  padding: 8px 12px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-sig-sampled);
}

.alias-matched {
  color: var(--color-safe);
}
.alias-mismatched {
  color: var(--color-danger);
}

/* Comparison Dashboard Table */
.dashboard-section {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 20px;
}

.dashboard-section h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.section-desc {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.table-container {
  overflow-x: auto;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;
}

.comparison-table th, .comparison-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
}

.comparison-table th {
  background-color: var(--color-bg-input);
  font-weight: 600;
  color: var(--color-text-secondary);
}

.comparison-table tr:hover {
  background-color: rgba(255,255,255,0.02);
}

.comparison-table tr:last-child td {
  border-bottom: none;
}

.comparison-table th.current-col, .comparison-table td.current-col {
  background-color: rgba(59, 130, 246, 0.05);
  border-left: 1px solid rgba(59, 130, 246, 0.2);
  border-right: 1px solid rgba(59, 130, 246, 0.2);
}

.text-safe { color: var(--color-safe) !important; font-weight: 600; }
.text-warn { color: var(--color-warn) !important; font-weight: 600; }
.text-danger { color: var(--color-danger) !important; font-weight: 600; }

.table-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 14px;
}

/* Observation Reports Card */
.observations-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}

@media (max-width: 1000px) {
  .observations-container {
    grid-template-columns: 1fr;
  }
}

.observation-card {
  background-color: var(--color-bg-main);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  opacity: 0.6;
  transition: opacity var(--transition-speed) ease, border-color var(--transition-speed) ease;
}

.observation-card.active-case {
  opacity: 1;
  border-color: var(--color-accent-primary);
  box-shadow: 0 4px 12px rgba(59,130,246,0.1);
}

.obs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 8px;
}

.obs-header h3 {
  font-size: 0.9rem;
  font-weight: 600;
}

.obs-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.obs-badge.safe { background-color: var(--color-safe); color: #fff; }
.obs-badge.warn { background-color: var(--color-warn); color: #fff; }
.obs-badge.danger { background-color: var(--color-danger); color: #fff; }

.obs-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.8rem;
}

.obs-section h4 {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 2px;
  text-transform: uppercase;
}

.obs-section p {
  color: var(--color-text-primary);
}

.obs-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: var(--border-radius-sm);
  font-size: 0.78rem;
}

.obs-status.theory-agreed {
  background-color: var(--color-safe-bg);
  color: var(--color-safe);
}

.obs-status.theory-discrepancy {
  background-color: var(--color-danger-bg);
  color: var(--color-danger);
}

.obs-section.diagnostic {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  padding: 8px 10px;
}

.obs-section.diagnostic h4 {
  color: var(--color-warn);
}

.obs-section.diagnostic p {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

/* Viva Accordion Q&A */
.viva-accordion {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.viva-item {
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-main);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.viva-question {
  width: 100%;
  background: none;
  border: none;
  color: var(--color-text-primary);
  padding: 14px 16px;
  font-size: 0.88rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color var(--transition-speed) ease;
}

.viva-question:hover {
  background-color: var(--color-bg-input);
}

.viva-question .icon {
  font-size: 1.1rem;
  font-family: monospace;
  color: var(--color-text-secondary);
}

.viva-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease-out;
  background-color: var(--color-bg-card);
}

.viva-answer p {
  padding: 16px;
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  border-top: 1px solid var(--color-border);
  line-height: 1.5;
}

.viva-item.open .viva-answer {
  max-height: 250px;
}

.viva-item.open .viva-question {
  background-color: var(--color-bg-input);
}

.viva-item.open .viva-question .icon {
  color: var(--color-accent-primary);
}

/* Collapsible Theory section */
.collapsible-section {
  padding: 0;
}

.section-collapsible-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.section-collapsible-header h2 {
  margin-bottom: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.section-collapsible-content {
  padding: 0 20px 20px 20px;
  display: none;
  border-top: 1px solid var(--color-border);
  padding-top: 16px;
}

.section-collapsible-content.show {
  display: block;
}

.theory-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 800px) {
  .theory-grid {
    grid-template-columns: 1fr;
  }
}

.theory-block h3 {
  font-size: 0.9rem;
  color: var(--color-sig-orig);
  margin-bottom: 8px;
}

.theory-block p {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: 8px;
}

/* Lab Footer */
.lab-footer {
  text-align: center;
  padding: 20px 0;
  font-size: 0.78rem;
  color: var(--color-text-dim);
  border-top: 1px solid var(--color-border);
  margin-top: 20px;
}
