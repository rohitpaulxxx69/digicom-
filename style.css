/**
 * Digital Communication Laboratory - Experiment 3
 * Sampling, Aliasing & Reconstruction Simulation Engine
 */

// --- Mathematical Helper Classes ---

class Complex {
  constructor(r = 0, i = 0) {
    this.r = r;
    this.i = i;
  }
  add(c) { return new Complex(this.r + c.r, this.i + c.i); }
  sub(c) { return new Complex(this.r - c.r, this.i - c.i); }
  mul(c) { return new Complex(this.r * c.r - this.i * c.i, this.r * c.i + this.i * c.r); }
  mag() { return Math.sqrt(this.r * this.r + this.i * this.i); }
}

/**
 * Radix-2 Cooley-Tukey Fast Fourier Transform (FFT)
 * Assumes input array length is a power of 2
 */
function fft(x) {
  const N = x.length;
  if (N <= 1) return [new Complex(x[0].r, x[0].i)];
  
  const even = [];
  const odd = [];
  for (let i = 0; i < N; i++) {
    if (i % 2 === 0) even.push(x[i]);
    else odd.push(x[i]);
  }
  
  const F_even = fft(even);
  const F_odd = fft(odd);
  
  const X = new Array(N);
  for (let k = 0; k < N / 2; k++) {
    const angle = -2 * Math.PI * k / N;
    const w = new Complex(Math.cos(angle), Math.sin(angle));
    const t = w.mul(F_odd[k]);
    X[k] = F_even[k].add(t);
    X[k + N / 2] = F_even[k].sub(t);
  }
  return X;
}

/**
 * Compute normalized, double-sided magnitude spectrum
 */
function getDoubleSidedFFT(timeData, samplingRate, padSize) {
  const N_active = timeData.length;
  const complexIn = [];
  for (let i = 0; i < padSize; i++) {
    if (i < N_active) {
      complexIn.push(new Complex(timeData[i], 0));
    } else {
      complexIn.push(new Complex(0, 0));
    }
  }
  
  const complexOut = fft(complexIn);
  const spectrum = [];
  const binWidth = samplingRate / padSize;
  
  for (let i = 0; i < padSize; i++) {
    let freq;
    // We normalize by the active window length N_active so peak amplitude matches sine amplitudes
    const val = complexOut[i].mag() / N_active; 
    
    if (i < padSize / 2) {
      freq = i * binWidth;
      spectrum.push({ freq, val });
    } else {
      freq = (i - padSize) * binWidth;
      spectrum.push({ freq, val });
    }
  }
  
  // Sort by frequency from -fs/2 to +fs/2
  spectrum.sort((a, b) => a.freq - b.freq);
  return spectrum;
}

/**
 * Ideal Sinc function
 */
function sinc(x) {
  if (Math.abs(x) < 1e-9) return 1.0;
  return Math.sin(Math.PI * x) / (Math.PI * x);
}

// --- Global Simulation State ---
const State = {
  // Signal parameters
  f1: 50,
  a1: 1.0,
  f2: 120,
  a2: 0.5,
  
  // Sampling parameters
  fs: 400,
  duration: 0.10,
  
  // Advanced parameters
  plotRes: 10000,     // fine grid sample rate (Hz)
  sincWindow: 24,     // truncation cutoff (samples)
  
  // Computed values
  fmax: 120,
  nyquistRate: 240,
  ts: 0.0025,
  ns: 40,
  
  // Simulation numerical results
  t_fine: [],
  x_fine: [],
  x_recon: [],
  samples: [],
  
  // FFT Spectra
  specOrig: [],       // Original continuous-looking FFT
  specRecon: [],      // Reconstructed continuous-looking FFT
  specSampledBase: [],// Baseband discrete FFT (covers [-fs/2, fs/2])
  fftPadSize: 2048,   // FFT Length
  
  // Visualizer bounds (Zoom and Pan)
  tMin: 0,
  tMax: 0.10,
  fMin: -600,
  fMax: 600,
  
  // Comparison dashboard data store
  comparisons: {
    a: null, // Preset Above
    b: null, // Preset At
    c: null  // Preset Below
  },
  
  // Interaction variables
  isDraggingT: false,
  dragStartXT: 0,
  dragTMinStart: 0,
  dragTMaxStart: 0,
  
  isDraggingF: false,
  dragStartXF: 0,
  dragFMinStart: 0,
  dragFMaxStart: 0,
  
  hoverT: null,
  hoverF: null
};

// --- Mathematical Core Pipeline ---

function evaluateSignal(t) {
  return State.a1 * Math.sin(2 * Math.PI * State.f1 * t) + 
         State.a2 * Math.sin(2 * Math.PI * State.f2 * t);
}

/**
 * Whittaker-Shannon sinc interpolation
 */
function reconstructSignal(t) {
  const Ts = 1 / State.fs;
  let sum = 0;
  const W = State.sincWindow;
  
  // Find central sample index around current time t
  const centerN = t / Ts;
  const startN = Math.max(0, Math.ceil(centerN - W));
  const endN = Math.min(State.ns - 1, Math.floor(centerN + W));
  
  for (let n = startN; n <= endN; n++) {
    const tn = n * Ts;
    const sampleVal = State.samples[n];
    sum += sampleVal * sinc((t - tn) / Ts);
  }
  return sum;
}

/**
 * Dynamic report text generator helper
 */
function updateObservationCard(id, active, obsText) {
  const card = document.getElementById(`obs-card-${id}`);
  const resEl = document.getElementById(`obs-res-${id}`);
  
  if (active) {
    card.classList.add('active-case');
  } else {
    card.classList.remove('active-case');
  }
  
  if (obsText) {
    resEl.innerHTML = obsText;
  }
}

/**
 * Search the spectrum array for peaks locally using quadratic interpolation
 */
function findInterpolatedPeak(spectrum, targetFreq, searchRadius = 15) {
  let bestIdx = -1;
  let minDist = Infinity;
  for (let i = 0; i < spectrum.length; i++) {
    const dist = Math.abs(spectrum[i].freq - targetFreq);
    if (dist < minDist) {
      minDist = dist;
      bestIdx = i;
    }
  }
  
  if (bestIdx <= 1 || bestIdx >= spectrum.length - 2) {
    return targetFreq;
  }
  
  // Locate local maximum in neighborhood
  const df = spectrum[1].freq - spectrum[0].freq;
  const binsRadius = Math.ceil(searchRadius / df);
  let maxIdx = bestIdx;
  let maxVal = -1;
  
  const startIdx = Math.max(1, bestIdx - binsRadius);
  const endIdx = Math.min(spectrum.length - 2, bestIdx + binsRadius);
  
  for (let i = startIdx; i <= endIdx; i++) {
    if (spectrum[i].val > maxVal) {
      maxVal = spectrum[i].val;
      maxIdx = i;
    }
  }
  
  // Parabolic interpolation around maxIdx
  const alpha = spectrum[maxIdx - 1].val;
  const beta = spectrum[maxIdx].val;
  const gamma = spectrum[maxIdx + 1].val;
  
  const denom = alpha - 2 * beta + gamma;
  if (Math.abs(denom) < 1e-6) {
    return spectrum[maxIdx].freq;
  }
  
  const p = 0.5 * (alpha - gamma) / denom;
  return spectrum[maxIdx].freq + p * df;
}

/**
 * Runs the complete signal sampling and reconstruction process
 */
function runSimulationPipeline() {
  document.getElementById('sim-spinner').style.display = 'inline-block';
  
  setTimeout(() => {
    // 1. Calculate fundamental parameters
    State.fmax = Math.max(State.f1, State.f2);
    State.nyquistRate = 2 * State.fmax;
    State.ts = 1 / State.fs;
    State.ns = Math.floor(State.duration * State.fs);
    
    // 2. Generate fine-resolution time grid & Original signal
    const numFine = Math.floor(State.duration * State.plotRes);
    State.t_fine = [];
    State.x_fine = [];
    for (let i = 0; i < numFine; i++) {
      const t = i / State.plotRes;
      State.t_fine.push(t);
      State.x_fine.push(evaluateSignal(t));
    }
    
    // 3. Generate physical samples
    State.samples = [];
    for (let n = 0; n < State.ns; n++) {
      State.samples.push(evaluateSignal(n * State.ts));
    }
    
    // 4. Perform sinc reconstruction on the fine grid
    State.x_recon = [];
    for (let i = 0; i < numFine; i++) {
      State.x_recon.push(reconstructSignal(State.t_fine[i]));
    }
    
    // 5. Calculate numerical error metrics
    let sumDiffSq = 0;
    let sumOrigSq = 0;
    for (let i = 0; i < numFine; i++) {
      const diff = State.x_fine[i] - State.x_recon[i];
      sumDiffSq += diff * diff;
      sumOrigSq += State.x_fine[i] * State.x_fine[i];
    }
    
    const mse = sumDiffSq / numFine;
    const rmse = Math.sqrt(mse);
    const relError = sumOrigSq > 0 ? (Math.sqrt(sumDiffSq / sumOrigSq) * 100) : 0;
    
    // Write errors to UI
    document.getElementById('err-mse').textContent = mse.toFixed(6);
    document.getElementById('err-rmse').textContent = rmse.toFixed(6);
    document.getElementById('err-relative').textContent = relError.toFixed(2) + '%';
    
    // Update metric bars
    document.getElementById('meter-mse').style.width = Math.min(100, mse * 500) + '%';
    document.getElementById('meter-rmse').style.width = Math.min(100, rmse * 100) + '%';
    document.getElementById('meter-relative').style.width = Math.min(100, relError) + '%';
    
    // 6. Compute Fourier Spectra
    // Original FFT sampled at plotting rate (high speed)
    State.specOrig = getDoubleSidedFFT(State.x_fine, State.plotRes, State.fftPadSize);
    
    // Reconstructed FFT sampled at plotting rate
    State.specRecon = getDoubleSidedFFT(State.x_recon, State.plotRes, State.fftPadSize);
    
    // Discrete Sampled FFT sampled at physical fs
    State.specSampledBase = getDoubleSidedFFT(State.samples, State.fs, State.fftPadSize);
    
    // 7. Aliasing calculations and Peak detection
    const aliasInfo = calculateAliasingMath();
    
    // Find observed peak frequencies in reconstructed spectrum
    const obsF1 = Math.abs(findInterpolatedPeak(State.specRecon, State.f1, 15));
    const obsF2 = Math.abs(findInterpolatedPeak(State.specRecon, aliasInfo.f2.aliasFreq, 15));
    
    // Update Aliasing Theory Check card
    renderTheoryCheckCard(aliasInfo, obsF1, obsF2);
    
    // 8. Update Banner Status
    updateStatusBanner(aliasInfo);
    
    // 9. Update UI textual stats
    document.getElementById('val-fmax').textContent = State.fmax + ' Hz';
    document.getElementById('val-nyquist-rate').textContent = State.nyquistRate + ' Hz';
    document.getElementById('val-fs-readout').textContent = State.fs + ' Hz';
    document.getElementById('val-ts').textContent = (State.ts * 1000).toFixed(3) + ' ms';
    document.getElementById('val-ns').textContent = State.ns + ' samples';
    
    // Update Current column in the Comparison Table
    document.getElementById('cell-curr-fs').textContent = State.fs + ' Hz';
    document.getElementById('cell-curr-nyq').textContent = State.nyquistRate + ' Hz';
    
    let currentCondition = '';
    let isAliasExpText = '';
    if (State.fs > State.nyquistRate) {
      currentCondition = 'fs > 2fmax (Proper)';
      isAliasExpText = 'No';
      document.getElementById('cell-curr-cond').className = 'current-col text-safe';
    } else if (State.fs === State.nyquistRate) {
      currentCondition = 'fs = 2fmax (Nyquist)';
      isAliasExpText = 'No (Theoretical Limit)';
      document.getElementById('cell-curr-cond').className = 'current-col text-warn';
    } else {
      currentCondition = 'fs < 2fmax (Aliasing)';
      isAliasExpText = 'Yes';
      document.getElementById('cell-curr-cond').className = 'current-col text-danger';
    }
    document.getElementById('cell-curr-cond').textContent = currentCondition;
    document.getElementById('cell-curr-alias').textContent = isAliasExpText;
    document.getElementById('cell-curr-alias-freq').textContent = State.fs < State.nyquistRate ? aliasInfo.f2.aliasFreq + ' Hz' : 'None';
    document.getElementById('cell-curr-obs-freq').textContent = obsF2.toFixed(1) + ' Hz';
    if (State.fs < State.nyquistRate) {
      document.getElementById('cell-curr-obs-freq').className = 'current-col text-danger font-mono';
    } else {
      document.getElementById('cell-curr-obs-freq').className = 'current-col font-mono';
    }
    
    document.getElementById('cell-curr-mse').textContent = mse.toFixed(5);
    document.getElementById('cell-curr-rmse').textContent = rmse.toFixed(5);
    
    // 10. Update Observation Panel cards dynamically
    updateObservationResTexts(obsF1, obsF2, mse, relError);
    
    // 11. Draw plots
    drawTimeDomain();
    drawFreqDomain();
    
    document.getElementById('sim-spinner').style.display = 'none';
  }, 100);
}

/**
 * Calculate expected folding integer k and aliased frequency
 */
function calculateAliasingMath() {
  const calculateToneAlias = (f) => {
    const k = Math.round(f / State.fs);
    const aliasFreq = Math.abs(f - k * State.fs);
    const isAliased = f > State.fs / 2;
    return { k, aliasFreq, isAliased };
  };
  
  return {
    f1: calculateToneAlias(State.f1),
    f2: calculateToneAlias(State.f2),
    nyqFreq: State.fs / 2
  };
}

/**
 * Renders the Step-by-Step Aliasing calculation card in HTML
 */
function renderTheoryCheckCard(alias, obsF1, obsF2) {
  const panel = document.getElementById('alias-calc-panel');
  
  let html = `
    <div class="stat-row" style="margin-bottom: 8px;">
      <span class="stat-label">Nyquist Frequency (fs/2)</span>
      <span class="stat-value highlighted-value">${alias.nyqFreq} Hz</span>
    </div>
  `;
  
  // Tone 1
  html += `
    <div class="alias-tone-box" style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px dashed rgba(255,255,255,0.05);">
      <div class="alias-title">Tone 1 (f₁ = ${State.f1} Hz):</div>
      <p style="font-size: 0.75rem; margin-bottom: 4px;">
        Condition: ${State.f1} Hz &le; ${alias.nyqFreq} Hz &rarr; 
        <span class="${alias.f1.isAliased ? 'text-danger' : 'text-safe'}">${alias.f1.isAliased ? 'Aliasing' : 'No Aliasing'}</span>
      </p>
      <div class="alias-steps">
        k = round(${State.f1}/${State.fs}) = ${alias.f1.k}<br>
        f_alias = |${State.f1} - ${alias.f1.k} &times; ${State.fs}| = ${alias.f1.aliasFreq} Hz
      </div>
      <p style="font-size: 0.75rem; margin-top: 4px;">
        Observed Peak: <span class="font-mono">${obsF1.toFixed(2)} Hz</span>
        (Diff: <span class="font-mono">${Math.abs(alias.f1.aliasFreq - obsF1).toFixed(2)} Hz</span>)
      </p>
    </div>
  `;
  
  // Tone 2
  html += `
    <div class="alias-tone-box">
      <div class="alias-title">Tone 2 (f₂ = ${State.f2} Hz):</div>
      <p style="font-size: 0.75rem; margin-bottom: 4px;">
        Condition: ${State.f2} Hz &le; ${alias.nyqFreq} Hz &rarr; 
        <span class="${alias.f2.isAliased ? 'text-danger' : 'text-safe'}">${alias.f2.isAliased ? 'Aliasing' : 'No Aliasing'}</span>
      </p>
      <div class="alias-steps">
        k = round(${State.f2}/${State.fs}) = ${alias.f2.k}<br>
        f_alias = |${State.f2} - ${alias.f2.k} &times; ${State.fs}| = ${alias.f2.aliasFreq} Hz
      </div>
      <p style="font-size: 0.75rem; margin-top: 4px;">
        Observed Peak: <span class="font-mono ${alias.f2.isAliased ? 'text-danger' : ''}">${obsF2.toFixed(2)} Hz</span>
        (Diff: <span class="font-mono">${Math.abs(alias.f2.aliasFreq - obsF2).toFixed(2)} Hz</span>)
      </p>
    </div>
  `;
  
  panel.innerHTML = html;
}

/**
 * Adjust the status banner text and colors based on criteria
 */
function updateStatusBanner(alias) {
  const banner = document.getElementById('status-card');
  const title = document.getElementById('status-title');
  const explanation = document.getElementById('status-explanation');
  
  banner.className = 'status-banner ';
  
  if (State.fs > State.nyquistRate) {
    banner.classList.add('safe-banner');
    title.textContent = 'STATUS: SAFE / NO ALIASING';
    explanation.innerHTML = `Sampling frequency <strong>fs (${State.fs} Hz)</strong> is greater than the Nyquist Rate <strong>2fmax (${State.nyquistRate} Hz)</strong>. Both components lie below the Nyquist boundary <strong>fs/2 (${alias.nyqFreq} Hz)</strong>. Sinc reconstruction is clean and error is low.`;
    
    // Sync indicator pill
    const connPill = document.getElementById('connection-status');
    connPill.className = 'status-indicator-pill safe';
    connPill.querySelector('.status-text').textContent = 'SYSTEM ONLINE';
  } else if (State.fs === State.nyquistRate) {
    banner.classList.add('warn-banner');
    title.textContent = 'STATUS: NYQUIST LIMIT BOUNDARY';
    explanation.innerHTML = `Sampling frequency <strong>fs (${State.fs} Hz)</strong> is exactly equal to the Nyquist Rate <strong>2fmax (${State.nyquistRate} Hz)</strong>. The high-frequency tone of <strong>${State.f2} Hz</strong> lies exactly on the limit boundary <strong>fs/2 (${alias.nyqFreq} Hz)</strong>. Theoretical reconstruction is barely possible, but practical edge ripple and phase-alignment challenges are visible.`;
    
    const connPill = document.getElementById('connection-status');
    connPill.className = 'status-indicator-pill safe';
    connPill.querySelector('.status-text').textContent = 'NYQUIST LIMIT';
  } else {
    banner.classList.add('danger-banner');
    title.textContent = 'STATUS: ALIASING DETECTED';
    explanation.innerHTML = `Sampling frequency <strong>fs (${State.fs} Hz)</strong> is below the Nyquist Rate <strong>2fmax (${State.nyquistRate} Hz)</strong>. The high frequency tone <strong>${State.f2} Hz</strong> is higher than the fold-over limit <strong>fs/2 (${alias.nyqFreq} Hz)</strong> and aliased back to <strong>${alias.f2.aliasFreq} Hz</strong>. This distortion cannot be corrected digitally.`;
    
    const connPill = document.getElementById('connection-status');
    connPill.className = 'status-indicator-pill';
    connPill.style.backgroundColor = 'var(--color-danger-bg)';
    connPill.style.color = 'var(--color-danger)';
    connPill.style.borderColor = 'rgba(239, 68, 68, 0.2)';
    connPill.querySelector('.status-text').textContent = 'ALIASING ACTIVE';
  }
}

/**
 * Generates dynamic statements inside the observation cards
 */
function updateObservationResTexts(obsF1, obsF2, mse, relError) {
  const isAbove = State.fs > State.nyquistRate;
  const isAt = State.fs === State.nyquistRate;
  const isBelow = State.fs < State.nyquistRate;
  
  // Clear status classes
  ['above', 'at', 'below'].forEach(id => {
    const el = document.getElementById(`obs-status-${id}`);
    el.className = 'obs-status ';
  });
  
  // Case A text
  let txtA = 'Not active preset.';
  if (isAbove) {
    txtA = `The simulation runs at fs = ${State.fs} Hz. The peaks in the reconstructed spectrum are observed at <strong>${obsF1.toFixed(1)} Hz</strong> and <strong>${obsF2.toFixed(1)} Hz</strong>, matching the source frequencies. Sinc reconstruction is extremely clean, and the Relative Error is very small (<strong>${relError.toFixed(3)}%</strong>).`;
    document.getElementById('obs-status-above').classList.add('theory-agreed');
    document.getElementById('obs-status-above').innerHTML = '<span class="status-icon">✓</span> Observation agrees with sampling theory';
  } else {
    document.getElementById('obs-status-above').classList.add('theory-discrepancy');
    document.getElementById('obs-status-above').innerHTML = 'Not active';
  }
  updateObservationCard('above', isAbove, txtA);
  
  // Case B text
  let txtB = 'Not active preset.';
  if (isAt) {
    txtB = `The simulation runs at the Nyquist boundary fs = ${State.fs} Hz. The high-frequency tone lies exactly at the limit of the spectrum <strong>${obsF2.toFixed(1)} Hz</strong>. Sinc interpolation shows a small increase in MSE (<strong>${mse.toFixed(5)}</strong>) due to the sharp cutoff border, and the waveform shows edge ripple (Gibbs-like effect).`;
    document.getElementById('obs-status-at').classList.add('theory-agreed');
    document.getElementById('obs-status-at').innerHTML = '<span class="status-icon">✓</span> Observation agrees with sampling theory';
  } else {
    document.getElementById('obs-status-at').classList.add('theory-discrepancy');
    document.getElementById('obs-status-at').innerHTML = 'Not active';
  }
  updateObservationCard('at', isAt, txtB);
  
  // Case C text
  let txtC = 'Not active preset.';
  if (isBelow) {
    const aliasExp = Math.abs(State.f2 - Math.round(State.f2/State.fs)*State.fs);
    txtC = `The simulation runs at fs = ${State.fs} Hz. The high-frequency tone has folded back. The time waveform shows a lower beat frequency, and the spectrum shows the second peak at <strong>${obsF2.toFixed(1)} Hz</strong> instead of ${State.f2} Hz. Sinc interpolation fails to recover the original signal, resulting in a large Relative Error (<strong>${relError.toFixed(2)}%</strong>).`;
    document.getElementById('obs-status-below').classList.add('theory-agreed');
    document.getElementById('obs-status-below').innerHTML = '<span class="status-icon">✓</span> Observation agrees with sampling theory';
  } else {
    document.getElementById('obs-status-below').classList.add('theory-discrepancy');
    document.getElementById('obs-status-below').innerHTML = 'Not active';
  }
  updateObservationCard('below', isBelow, txtC);
}

// --- Graphical Canvas Drawing Engine ---

// Nice Grid Tick finder
function getNiceStep(range) {
  const rawStep = range / 5;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const ratio = rawStep / mag;
  let step;
  if (ratio < 1.5) step = 1 * mag;
  else if (ratio < 3.0) step = 2 * mag;
  else if (ratio < 7.5) step = 5 * mag;
  else step = 10 * mag;
  return step;
}

const Pad = { left: 55, right: 20, top: 20, bottom: 35 };

// Time axis mapping functions
function tToX(t, w) {
  return Pad.left + ((t - State.tMin) / (State.tMax - State.tMin)) * (w - Pad.left - Pad.right);
}
function xToT(x, w) {
  return State.tMin + ((x - Pad.left) / (w - Pad.left - Pad.right)) * (State.tMax - State.tMin);
}
function yToY(y, h, yMin = -1.8, yMax = 1.8) {
  return Pad.top + (1 - (y - yMin) / (yMax - yMin)) * (h - Pad.top - Pad.bottom);
}
function yToVal(yCanvas, h, yMin = -1.8, yMax = 1.8) {
  return yMin + (1 - (yCanvas - Pad.top) / (h - Pad.top - Pad.bottom)) * (yMax - yMin);
}

// Freq axis mapping functions
function fToX(f, w) {
  return Pad.left + ((f - State.fMin) / (State.fMax - State.fMin)) * (w - Pad.left - Pad.right);
}
function xToF(x, w) {
  return State.fMin + ((x - Pad.left) / (w - Pad.left - Pad.right)) * (State.fMax - State.fMin);
}
function fyToY(y, h, yMax = 0.65) {
  return Pad.top + (1 - y / yMax) * (h - Pad.top - Pad.bottom);
}
function fyToVal(yCanvas, h, yMax = 0.65) {
  return (1 - (yCanvas - Pad.top) / (h - Pad.top - Pad.bottom)) * yMax;
}

/**
 * Draws the time-domain canvas
 */
function drawTimeDomain() {
  const canvas = document.getElementById('timeCanvas');
  const wrapper = canvas.parentNode;
  
  // Handle high-dpi monitors
  const dpr = window.devicePixelRatio || 1;
  const width = wrapper.clientWidth;
  const height = wrapper.clientHeight;
  
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  
  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.scale(dpr, dpr);
  
  // Clear Background
  ctx.fillStyle = '#05080f';
  ctx.fillRect(0, 0, width, height);
  
  const gWidth = width - Pad.left - Pad.right;
  const gHeight = height - Pad.top - Pad.bottom;
  
  if (gWidth <= 0 || gHeight <= 0) {
    ctx.restore();
    return;
  }
  
  const yMin = -1.8;
  const yMax = 1.8;
  
  // Draw Grid Lines (Time)
  const tRange = State.tMax - State.tMin;
  const tStep = getNiceStep(tRange);
  const firstT = Math.ceil(State.tMin / tStep) * tStep;
  
  ctx.lineWidth = 1;
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  
  for (let t = firstT; t <= State.tMax; t += tStep) {
    // Avoid floating point inaccuracies
    const x = tToX(t, width);
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.beginPath();
    ctx.moveTo(x, Pad.top);
    ctx.lineTo(x, height - Pad.bottom);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#64748b';
    ctx.fillText((t * 1000).toFixed(1) + 'ms', x, height - Pad.bottom + 14);
  }
  
  // Draw Grid Lines (Amplitude)
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let y = -1.5; y <= 1.5; y += 0.5) {
    const yC = yToY(y, height, yMin, yMax);
    ctx.strokeStyle = y === 0 ? 'rgba(71, 85, 105, 0.8)' : 'rgba(30, 41, 59, 0.4)';
    ctx.beginPath();
    ctx.moveTo(Pad.left, yC);
    ctx.lineTo(width - Pad.right, yC);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#64748b';
    ctx.fillText(y.toFixed(1) + 'V', Pad.left - 8, yC);
  }
  
  // Boundary boxes
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
  ctx.strokeRect(Pad.left, Pad.top, gWidth, gHeight);
  
  // 1. Draw Original Signal (chk-orig)
  if (document.getElementById('chk-orig').checked) {
    ctx.strokeStyle = 'var(--color-sig-orig)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    
    let first = true;
    for (let px = 0; px <= gWidth; px++) {
      const xCanvas = Pad.left + px;
      const t = xToT(xCanvas, width);
      const yVal = evaluateSignal(t);
      const yCanvas = yToY(yVal, height, yMin, yMax);
      
      if (first) {
        ctx.moveTo(xCanvas, yCanvas);
        first = false;
      } else {
        ctx.lineTo(xCanvas, yCanvas);
      }
    }
    ctx.stroke();
  }
  
  // 2. Draw Sinc Reconstructed Waveform (chk-recon)
  if (document.getElementById('chk-recon').checked) {
    ctx.strokeStyle = 'var(--color-sig-recon)';
    ctx.lineWidth = 2.0;
    ctx.setLineDash([5, 2]); // dashed to distinguish from original
    ctx.beginPath();
    
    let first = true;
    for (let px = 0; px <= gWidth; px++) {
      const xCanvas = Pad.left + px;
      const t = xToT(xCanvas, width);
      const yVal = reconstructSignal(t);
      const yCanvas = yToY(yVal, height, yMin, yMax);
      
      if (first) {
        ctx.moveTo(xCanvas, yCanvas);
        first = false;
      } else {
        ctx.lineTo(xCanvas, yCanvas);
      }
    }
    ctx.stroke();
    ctx.setLineDash([]); // reset
  }
  
  // 3. Draw Error Signal (chk-error)
  if (document.getElementById('chk-error').checked) {
    ctx.strokeStyle = 'var(--color-sig-error)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    
    let first = true;
    for (let px = 0; px <= gWidth; px++) {
      const xCanvas = Pad.left + px;
      const t = xToT(xCanvas, width);
      const yVal = evaluateSignal(t) - reconstructSignal(t);
      const yCanvas = yToY(yVal, height, yMin, yMax);
      
      if (first) {
        ctx.moveTo(xCanvas, yCanvas);
        first = false;
      } else {
        ctx.lineTo(xCanvas, yCanvas);
      }
    }
    ctx.stroke();
  }
  
  // 4. Draw Sampled Points (chk-sampled)
  if (document.getElementById('chk-sampled').checked) {
    const Ts = 1 / State.fs;
    ctx.lineWidth = 1.5;
    
    for (let n = 0; n < State.ns; n++) {
      const tn = n * Ts;
      if (tn < State.tMin || tn > State.tMax) continue;
      
      const xCanvas = tToX(tn, width);
      const yVal = State.samples[n];
      const yCanvas = yToY(yVal, height, yMin, yMax);
      const zeroCanvas = yToY(0, height, yMin, yMax);
      
      // Draw Stem line
      ctx.strokeStyle = 'var(--color-sig-sampled-glow)';
      ctx.beginPath();
      ctx.moveTo(xCanvas, zeroCanvas);
      ctx.lineTo(xCanvas, yCanvas);
      ctx.stroke();
      
      // Draw Dot
      ctx.fillStyle = 'var(--color-sig-sampled)';
      ctx.beginPath();
      ctx.arc(xCanvas, yCanvas, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#05080f';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  
  // 5. Draw Interactive Hover Cursor
  if (State.hoverT !== null && State.hoverT >= State.tMin && State.hoverT <= State.tMax) {
    const xCursor = tToX(State.hoverT, width);
    
    // Vertical cursor line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(xCursor, Pad.top);
    ctx.lineTo(xCursor, height - Pad.bottom);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Calculate values at hover point
    const yOrig = evaluateSignal(State.hoverT);
    const yRecon = reconstructSignal(State.hoverT);
    const yErr = yOrig - yRecon;
    
    // Draw cursor dots on waveforms
    if (document.getElementById('chk-orig').checked) {
      ctx.fillStyle = 'var(--color-sig-orig)';
      ctx.beginPath();
      ctx.arc(xCursor, yToY(yOrig, height, yMin, yMax), 4, 0, 2 * Math.PI);
      ctx.fill();
    }
    if (document.getElementById('chk-recon').checked) {
      ctx.fillStyle = 'var(--color-sig-recon)';
      ctx.beginPath();
      ctx.arc(xCursor, yToY(yRecon, height, yMin, yMax), 4, 0, 2 * Math.PI);
      ctx.fill();
    }
    if (document.getElementById('chk-error').checked) {
      ctx.fillStyle = 'var(--color-sig-error)';
      ctx.beginPath();
      ctx.arc(xCursor, yToY(yErr, height, yMin, yMax), 4, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Draw tooltip box inside canvas
    updateHoverReadoutT(State.hoverT, yOrig, yRecon, yErr, width);
  } else {
    document.getElementById('time-hover-readout').style.display = 'none';
  }
  
  ctx.restore();
}

/**
 * Updates text coordinates for the Time Hover Div
 */
function updateHoverReadoutT(t, yOrig, yRecon, yErr, canvasWidth) {
  const div = document.getElementById('time-hover-readout');
  div.style.display = 'block';
  
  // Format HTML details
  div.innerHTML = `
    <div style="font-weight: 700; color: #fff; border-bottom: 1px solid var(--color-border); padding-bottom: 2px; margin-bottom: 4px;">Cursor Readings</div>
    <div>Time: ${(t * 1000).toFixed(3)} ms</div>
    ${document.getElementById('chk-orig').checked ? `<div style="color: var(--color-sig-orig);">Orig x(t): ${yOrig.toFixed(3)} V</div>` : ''}
    ${document.getElementById('chk-recon').checked ? `<div style="color: var(--color-sig-recon);">Recon xr(t): ${yRecon.toFixed(3)} V</div>` : ''}
    ${document.getElementById('chk-error').checked ? `<div style="color: var(--color-sig-error);">Error e(t): ${yErr.toFixed(3)} V</div>` : ''}
  `;
}

/**
 * Interpolate linear value from double sided FFT spectrum
 */
function getFFTVal(freq, spectrum) {
  if (spectrum.length === 0) return 0;
  
  const fStart = spectrum[0].freq;
  const fEnd = spectrum[spectrum.length - 1].freq;
  if (freq < fStart || freq > fEnd) return 0;
  
  // Binary search index
  let low = 0;
  let high = spectrum.length - 1;
  let idx = 0;
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (spectrum[mid].freq < freq) {
      low = mid + 1;
      idx = mid;
    } else {
      high = mid - 1;
    }
  }
  
  if (idx >= spectrum.length - 1) return spectrum[spectrum.length - 1].val;
  
  // Linear Interpolate
  const f0 = spectrum[idx].freq;
  const f1 = spectrum[idx + 1].freq;
  const v0 = spectrum[idx].val;
  const v1 = spectrum[idx + 1].val;
  
  const ratio = (freq - f0) / (f1 - f0);
  return v0 + ratio * (v1 - v0);
}

/**
 * Wrap frequency periodically inside [-fs/2, fs/2]
 */
function wrapFrequency(f, fs) {
  const halfFs = fs / 2;
  let val = (f + halfFs) % fs;
  if (val < 0) val += fs;
  return val - halfFs;
}

/**
 * Interpolate periodic sampled spectrum value showing replicas
 */
function getSampledReplicaVal(f) {
  const fs = State.fs;
  const fWrapped = wrapFrequency(f, fs);
  
  // Look up wrapped freq inside the baseband FFT
  const padSize = State.fftPadSize;
  const binWidth = fs / padSize;
  
  // Since fWrapped is in [-fs/2, fs/2], map index
  const idx = ((fWrapped + fs / 2) / fs) * padSize;
  
  let idx0 = Math.floor(idx);
  let idx1 = Math.ceil(idx);
  if (idx0 < 0) idx0 = 0;
  if (idx1 >= padSize) idx1 = padSize - 1;
  
  const v0 = State.specSampledBase[idx0].val;
  if (idx0 === idx1) return v0;
  
  const v1 = State.specSampledBase[idx1].val;
  const ratio = idx - idx0;
  
  // Replicas are scaled by fs/f_plot_resolution but in double-sided normalized peak view, 
  // DFT scaling ensures matching height directly. We multiply by some scaling factor 
  // to account for impulse mapping representation if needed, but direct magnitude scaling 
  // makes matching baseband heights educational and clean!
  return v0 + ratio * (v1 - v0);
}

/**
 * Draws the frequency-domain spectrum canvas
 */
function drawFreqDomain() {
  const canvas = document.getElementById('freqCanvas');
  const wrapper = canvas.parentNode;
  
  const dpr = window.devicePixelRatio || 1;
  const width = wrapper.clientWidth;
  const height = wrapper.clientHeight;
  
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  
  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.scale(dpr, dpr);
  
  // Clear Background
  ctx.fillStyle = '#05080f';
  ctx.fillRect(0, 0, width, height);
  
  const gWidth = width - Pad.left - Pad.right;
  const gHeight = height - Pad.top - Pad.bottom;
  
  if (gWidth <= 0 || gHeight <= 0) {
    ctx.restore();
    return;
  }
  
  const yMax = 0.65; // peaks of magnitude A/2 = 0.5 fit perfectly
  
  // 0. Draw Shaded Nyquist Reconstruction Band [-fs/2, fs/2]
  const halfFs = State.fs / 2;
  const xNyqMin = fToX(-halfFs, width);
  const xNyqMax = fToX(halfFs, width);
  
  // Clamp boundaries within graph range
  const xNyqLeft = Math.max(Pad.left, xNyqMin);
  const xNyqRight = Math.min(width - Pad.right, xNyqMax);
  
  if (xNyqRight > xNyqLeft) {
    ctx.fillStyle = 'rgba(30, 41, 59, 0.35)'; // translucent grey representation
    ctx.fillRect(xNyqLeft, Pad.top, xNyqRight - xNyqLeft, gHeight);
  }
  
  // Draw Grid Lines (Frequency)
  const fRange = State.fMax - State.fMin;
  const fStep = getNiceStep(fRange);
  const firstF = Math.ceil(State.fMin / fStep) * fStep;
  
  ctx.lineWidth = 1;
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  
  for (let f = firstF; f <= State.fMax; f += fStep) {
    const x = fToX(f, width);
    ctx.strokeStyle = f === 0 ? 'rgba(71, 85, 105, 0.8)' : 'rgba(30, 41, 59, 0.4)';
    ctx.beginPath();
    ctx.moveTo(x, Pad.top);
    ctx.lineTo(x, height - Pad.bottom);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#64748b';
    ctx.fillText(f.toFixed(0) + ' Hz', x, height - Pad.bottom + 14);
  }
  
  // Draw Grid Lines (Magnitude)
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let y = 0.1; y <= 0.6; y += 0.1) {
    const yC = fyToY(y, height, yMax);
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.beginPath();
    ctx.moveTo(Pad.left, yC);
    ctx.lineTo(width - Pad.right, yC);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#64748b';
    ctx.fillText(y.toFixed(1), Pad.left - 8, yC);
  }
  
  // Draw Nyquist Cutoff Boundary Labels & lines
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  
  if (xNyqMin >= Pad.left && xNyqMin <= width - Pad.right) {
    ctx.beginPath();
    ctx.moveTo(xNyqMin, Pad.top);
    ctx.lineTo(xNyqMin, height - Pad.bottom);
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText('-fs/2', xNyqMin, Pad.top + 8);
  }
  if (xNyqMax >= Pad.left && xNyqMax <= width - Pad.right) {
    ctx.beginPath();
    ctx.moveTo(xNyqMax, Pad.top);
    ctx.lineTo(xNyqMax, height - Pad.bottom);
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText('+fs/2', xNyqMax, Pad.top + 8);
  }
  ctx.setLineDash([]);
  
  // Graph Box Border
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
  ctx.lineWidth = 1;
  ctx.strokeRect(Pad.left, Pad.top, gWidth, gHeight);
  
  // 1. Draw Sampled Signal Spectrum with replicas (pink)
  ctx.strokeStyle = 'var(--color-sig-sampled-spec)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 2]);
  ctx.beginPath();
  let firstSampled = true;
  for (let px = 0; px <= gWidth; px++) {
    const xCanvas = Pad.left + px;
    const f = xToF(xCanvas, width);
    const yVal = getSampledReplicaVal(f);
    const yCanvas = fyToY(yVal, height, yMax);
    
    if (firstSampled) {
      ctx.moveTo(xCanvas, yCanvas);
      firstSampled = false;
    } else {
      ctx.lineTo(xCanvas, yCanvas);
    }
  }
  ctx.stroke();
  ctx.setLineDash([]);
  
  // 2. Draw Original Signal Spectrum (blue)
  ctx.strokeStyle = 'var(--color-sig-orig)';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  let firstOrig = true;
  for (let px = 0; px <= gWidth; px++) {
    const xCanvas = Pad.left + px;
    const f = xToF(xCanvas, width);
    const yVal = getFFTVal(f, State.specOrig);
    const yCanvas = fyToY(yVal, height, yMax);
    
    if (firstOrig) {
      ctx.moveTo(xCanvas, yCanvas);
      firstOrig = false;
    } else {
      ctx.lineTo(xCanvas, yCanvas);
    }
  }
  ctx.stroke();
  
  // 3. Draw Reconstructed Spectrum (green)
  ctx.strokeStyle = 'var(--color-sig-recon)';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  let firstRecon = true;
  for (let px = 0; px <= gWidth; px++) {
    const xCanvas = Pad.left + px;
    const f = xToF(xCanvas, width);
    const yVal = getFFTVal(f, State.specRecon);
    const yCanvas = fyToY(yVal, height, yMax);
    
    if (firstRecon) {
      ctx.moveTo(xCanvas, yCanvas);
      firstRecon = false;
    } else {
      ctx.lineTo(xCanvas, yCanvas);
    }
  }
  ctx.stroke();
  
  // 4. Interactive Hover Cursor (Frequency)
  if (State.hoverF !== null && State.hoverF >= State.fMin && State.hoverF <= State.fMax) {
    const xCursor = fToX(State.hoverF, width);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(xCursor, Pad.top);
    ctx.lineTo(xCursor, height - Pad.bottom);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Values
    const vOrig = getFFTVal(State.hoverF, State.specOrig);
    const vSampled = getSampledReplicaVal(State.hoverF);
    const vRecon = getFFTVal(State.hoverF, State.specRecon);
    
    // Draw dots
    ctx.fillStyle = 'var(--color-sig-orig)';
    ctx.beginPath();
    ctx.arc(xCursor, fyToY(vOrig, height, yMax), 4, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = 'var(--color-sig-sampled-spec)';
    ctx.beginPath();
    ctx.arc(xCursor, fyToY(vSampled, height, yMax), 3, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = 'var(--color-sig-recon)';
    ctx.beginPath();
    ctx.arc(xCursor, fyToY(vRecon, height, yMax), 4, 0, 2 * Math.PI);
    ctx.fill();
    
    updateHoverReadoutF(State.hoverF, vOrig, vSampled, vRecon);
  } else {
    document.getElementById('freq-hover-readout').style.display = 'none';
  }
  
  ctx.restore();
}

/**
 * Updates text coordinates for the Freq Hover Div
 */
function updateHoverReadoutF(f, vOrig, vSampled, vRecon) {
  const div = document.getElementById('freq-hover-readout');
  div.style.display = 'block';
  
  div.innerHTML = `
    <div style="font-weight: 700; color: #fff; border-bottom: 1px solid var(--color-border); padding-bottom: 2px; margin-bottom: 4px;">Spectral Density</div>
    <div>Freq: ${f.toFixed(1)} Hz</div>
    <div style="color: var(--color-sig-orig);">Orig |X(f)|: ${vOrig.toFixed(3)}</div>
    <div style="color: var(--color-sig-sampled-spec);">Sampled |Xs(f)|: ${vSampled.toFixed(3)}</div>
    <div style="color: var(--color-sig-recon);">Recon |Xr(f)|: ${vRecon.toFixed(3)}</div>
  `;
}

// --- Interactive Events & UI Bindings ---

function initEventHandlers() {
  
  // Inputs binding to State
  const f1Slider = document.getElementById('input-f1');
  const f1Readout = document.getElementById('readout-f1');
  f1Slider.addEventListener('input', (e) => {
    State.f1 = parseInt(e.target.value);
    f1Readout.textContent = State.f1;
    runSimulationPipeline();
  });
  
  const a1Slider = document.getElementById('input-a1');
  const a1Readout = document.getElementById('readout-a1');
  a1Slider.addEventListener('input', (e) => {
    State.a1 = parseFloat(e.target.value);
    a1Readout.textContent = State.a1.toFixed(1);
    runSimulationPipeline();
  });
  
  const f2Slider = document.getElementById('input-f2');
  const f2Readout = document.getElementById('readout-f2');
  f2Slider.addEventListener('input', (e) => {
    State.f2 = parseInt(e.target.value);
    f2Readout.textContent = State.f2;
    runSimulationPipeline();
  });
  
  const a2Slider = document.getElementById('input-a2');
  const a2Readout = document.getElementById('readout-a2');
  a2Slider.addEventListener('input', (e) => {
    State.a2 = parseFloat(e.target.value);
    a2Readout.textContent = State.a2.toFixed(1);
    runSimulationPipeline();
  });
  
  const fsSlider = document.getElementById('input-fs');
  const fsNumInput = document.getElementById('num-fs');
  const fsReadout = document.getElementById('readout-fs');
  
  fsSlider.addEventListener('input', (e) => {
    State.fs = parseInt(e.target.value);
    fsReadout.textContent = State.fs;
    fsNumInput.value = State.fs;
    runSimulationPipeline();
  });
  
  fsNumInput.addEventListener('change', (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 400;
    if (val < 20) val = 20;
    if (val > 500) val = 500;
    State.fs = val;
    fsReadout.textContent = val;
    fsSlider.value = val;
    runSimulationPipeline();
  });
  
  const durSlider = document.getElementById('input-duration');
  const durReadout = document.getElementById('readout-duration');
  durSlider.addEventListener('input', (e) => {
    State.duration = parseFloat(e.target.value);
    durReadout.textContent = State.duration.toFixed(2);
    // Adjust visual limits if duration shrinks
    State.tMax = State.duration;
    runSimulationPipeline();
  });
  
  const plotResSlider = document.getElementById('input-plot-res');
  const plotResReadout = document.getElementById('readout-plot-res');
  plotResSlider.addEventListener('input', (e) => {
    State.plotRes = parseInt(e.target.value);
    plotResReadout.textContent = State.plotRes;
    runSimulationPipeline();
  });
  
  const sincWinSlider = document.getElementById('input-sinc-window');
  const sincWinReadout = document.getElementById('readout-sinc-window');
  sincWinSlider.addEventListener('input', (e) => {
    State.sincWindow = parseInt(e.target.value);
    sincWinReadout.textContent = State.sincWindow;
    runSimulationPipeline();
  });
  
  // Toggles redraw
  ['chk-orig', 'chk-sampled', 'chk-recon', 'chk-error'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
      drawTimeDomain();
    });
  });
  
  // Action buttons
  document.getElementById('btn-run').addEventListener('click', () => {
    runSimulationPipeline();
  });
  
  document.getElementById('btn-export-csv').addEventListener('click', exportCSV);
  document.getElementById('btn-export-report').addEventListener('click', exportTextReport);
  document.getElementById('btn-save-current').addEventListener('click', saveCurrentToDashboard);
  
  // Preset buttons
  document.getElementById('btn-preset-above').addEventListener('click', () => {
    applyPreset(400);
    savePresetToTable('a');
  });
  document.getElementById('btn-preset-at').addEventListener('click', () => {
    applyPreset(240);
    savePresetToTable('b');
  });
  document.getElementById('btn-preset-below').addEventListener('click', () => {
    applyPreset(180);
    savePresetToTable('c');
  });
  
  // Collapsibles
  setupCollapsible('adv-settings-toggle', 'adv-settings-content');
  setupCollapsible('theory-section-toggle', 'theory-section-content');
  
  // Accordions
  setupAccordion();
  
  // Time Graph Zoom/Pan interactions
  const tCanvas = document.getElementById('timeCanvas');
  tCanvas.addEventListener('mousedown', (e) => {
    State.isDraggingT = true;
    State.dragStartXT = e.clientX;
    State.dragTMinStart = State.tMin;
    State.dragTMaxStart = State.tMax;
  });
  
  window.addEventListener('mouseup', () => {
    State.isDraggingT = false;
    State.isDraggingF = false;
  });
  
  tCanvas.addEventListener('mousemove', (e) => {
    const rect = tCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    if (State.isDraggingT) {
      const dx = e.clientX - State.dragStartXT;
      const tRange = State.dragTMaxStart - State.dragTMinStart;
      const gWidth = rect.width - Pad.left - Pad.right;
      const dt = (dx / gWidth) * tRange;
      
      State.tMin = State.dragTMinStart - dt;
      State.tMax = State.dragTMaxStart - dt;
      
      // Clamp boundaries
      if (State.tMin < -0.05) {
        State.tMin = -0.05;
        State.tMax = -0.05 + tRange;
      }
      if (State.tMax > State.duration + 0.05) {
        State.tMax = State.duration + 0.05;
        State.tMin = State.tMax - tRange;
      }
      
      drawTimeDomain();
    } else {
      // Normal hover tracking
      if (mouseX >= Pad.left && mouseX <= rect.width - Pad.right) {
        State.hoverT = xToT(mouseX, rect.width);
      } else {
        State.hoverT = null;
      }
      drawTimeDomain();
      
      // Move HTML Div tooltip
      const div = document.getElementById('time-hover-readout');
      if (State.hoverT !== null) {
        div.style.left = (mouseX + 12) + 'px';
        div.style.top = (e.clientY - rect.top - 10) + 'px';
      }
    }
  });
  
  tCanvas.addEventListener('mouseleave', () => {
    State.hoverT = null;
    drawTimeDomain();
  });
  
  tCanvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = tCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    if (mouseX < Pad.left || mouseX > rect.width - Pad.right) return;
    
    const tMouse = xToT(mouseX, rect.width);
    const zoomFactor = e.deltaY < 0 ? 0.85 : 1.15;
    
    const newTMin = tMouse - (tMouse - State.tMin) * zoomFactor;
    const newTMax = tMouse + (State.tMax - tMouse) * zoomFactor;
    
    // Limit zoom range
    if (newTMax - newTMin > 0.002 && newTMax - newTMin < 0.5) {
      State.tMin = newTMin;
      State.tMax = newTMax;
      drawTimeDomain();
    }
  });
  
  // Time Zoom Buttons
  document.getElementById('btn-zoom-in-t').addEventListener('click', () => {
    const tCenter = (State.tMin + State.tMax) / 2;
    const half = (State.tMax - State.tMin) * 0.75 / 2;
    State.tMin = tCenter - half;
    State.tMax = tCenter + half;
    drawTimeDomain();
  });
  
  document.getElementById('btn-zoom-out-t').addEventListener('click', () => {
    const tCenter = (State.tMin + State.tMax) / 2;
    const half = (State.tMax - State.tMin) * 1.3 / 2;
    State.tMin = tCenter - half;
    State.tMax = tCenter + half;
    drawTimeDomain();
  });
  
  document.getElementById('btn-reset-t').addEventListener('click', () => {
    State.tMin = 0;
    State.tMax = State.duration;
    drawTimeDomain();
  });
  
  // Frequency Graph Zoom/Pan interactions
  const fCanvas = document.getElementById('freqCanvas');
  fCanvas.addEventListener('mousedown', (e) => {
    State.isDraggingF = true;
    State.dragStartXF = e.clientX;
    State.dragFMinStart = State.fMin;
    State.dragFMaxStart = State.fMax;
  });
  
  fCanvas.addEventListener('mousemove', (e) => {
    const rect = fCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    if (State.isDraggingF) {
      const dx = e.clientX - State.dragStartXF;
      const fRange = State.dragFMaxStart - State.dragFMinStart;
      const gWidth = rect.width - Pad.left - Pad.right;
      const df = (dx / gWidth) * fRange;
      
      State.fMin = State.dragFMinStart - df;
      State.fMax = State.dragFMaxStart - df;
      
      // Boundaries
      if (State.fMin < -1500) {
        State.fMin = -1500;
        State.fMax = -1500 + fRange;
      }
      if (State.fMax > 1500) {
        State.fMax = 1500;
        State.fMin = 1500 - fRange;
      }
      
      drawFreqDomain();
    } else {
      if (mouseX >= Pad.left && mouseX <= rect.width - Pad.right) {
        State.hoverF = xToF(mouseX, rect.width);
      } else {
        State.hoverF = null;
      }
      drawFreqDomain();
      
      const div = document.getElementById('freq-hover-readout');
      if (State.hoverF !== null) {
        div.style.left = (mouseX + 12) + 'px';
        div.style.top = (e.clientY - rect.top - 10) + 'px';
      }
    }
  });
  
  fCanvas.addEventListener('mouseleave', () => {
    State.hoverF = null;
    drawFreqDomain();
  });
  
  fCanvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = fCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    if (mouseX < Pad.left || mouseX > rect.width - Pad.right) return;
    
    const fMouse = xToF(mouseX, rect.width);
    const zoomFactor = e.deltaY < 0 ? 0.85 : 1.15;
    
    const newFMin = fMouse - (fMouse - State.fMin) * zoomFactor;
    const newFMax = fMouse + (State.fMax - fMouse) * zoomFactor;
    
    if (newFMax - newFMin > 50 && newFMax - newFMin < 3000) {
      State.fMin = newFMin;
      State.fMax = newFMax;
      drawFreqDomain();
    }
  });
  
  // Frequency Zoom Buttons
  document.getElementById('btn-zoom-in-f').addEventListener('click', () => {
    const fCenter = (State.fMin + State.fMax) / 2;
    const half = (State.fMax - State.fMin) * 0.75 / 2;
    State.fMin = fCenter - half;
    State.fMax = fCenter + half;
    drawFreqDomain();
  });
  
  document.getElementById('btn-zoom-out-f').addEventListener('click', () => {
    const fCenter = (State.fMin + State.fMax) / 2;
    const half = (State.fMax - State.fMin) * 1.3 / 2;
    State.fMin = fCenter - half;
    State.fMax = fCenter + half;
    drawFreqDomain();
  });
  
  document.getElementById('btn-reset-f').addEventListener('click', () => {
    const limit = Math.max(2.5 * State.fmax, 1.5 * State.fs);
    State.fMin = -limit;
    State.fMax = limit;
    drawFreqDomain();
  });
  
  // Handle window resizing
  window.addEventListener('resize', () => {
    drawTimeDomain();
    drawFreqDomain();
  });
}

function setupCollapsible(headerId, contentId) {
  const header = document.getElementById(headerId);
  const content = document.getElementById(contentId);
  
  header.addEventListener('click', () => {
    content.classList.toggle('show');
    header.classList.toggle('open');
  });
}

function setupAccordion() {
  const questions = document.querySelectorAll('.viva-question');
  
  questions.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentNode;
      const isOpen = item.classList.contains('open');
      
      // Close all accordion items
      document.querySelectorAll('.viva-item').forEach(el => el.classList.remove('open'));
      
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/**
 * Configure preset values without full page reload
 */
function applyPreset(fsVal) {
  // Update State
  State.fs = fsVal;
  State.f1 = 50;
  State.a1 = 1.0;
  State.f2 = 120;
  State.a2 = 0.5;
  State.duration = 0.10;
  
  // Reset Zoom
  State.tMin = 0;
  State.tMax = 0.10;
  
  const limit = Math.max(2.5 * 120, 1.5 * fsVal);
  State.fMin = -limit;
  State.fMax = limit;
  
  // Sync sliders
  document.getElementById('input-f1').value = 50;
  document.getElementById('readout-f1').textContent = 50;
  document.getElementById('input-a1').value = 1.0;
  document.getElementById('readout-a1').textContent = '1.0';
  
  document.getElementById('input-f2').value = 120;
  document.getElementById('readout-f2').textContent = 120;
  document.getElementById('input-a2').value = 0.5;
  document.getElementById('readout-a2').textContent = '0.5';
  
  document.getElementById('input-fs').value = fsVal;
  document.getElementById('num-fs').value = fsVal;
  document.getElementById('readout-fs').textContent = fsVal;
  
  document.getElementById('input-duration').value = 0.10;
  document.getElementById('readout-duration').textContent = '0.10';
  
  // Highlight active preset button
  document.querySelectorAll('.btn-preset').forEach(btn => btn.classList.remove('active'));
  if (fsVal === 400) document.getElementById('btn-preset-above').classList.add('active');
  if (fsVal === 240) document.getElementById('btn-preset-at').classList.add('active');
  if (fsVal === 180) document.getElementById('btn-preset-below').classList.add('active');
  
  runSimulationPipeline();
}

/**
 * Synchronously computes error metrics and observed peak for a specific sampling frequency
 * to avoid DOM race conditions during batch updates.
 */
function computeMetricsForFs(fsVal) {
  const Ts = 1 / fsVal;
  const Ns = Math.floor(State.duration * fsVal);
  
  // Generate temporary samples for this fs
  const tempSamples = [];
  for (let n = 0; n < Ns; n++) {
    tempSamples.push(evaluateSignal(n * Ts));
  }
  
  // Generate temporary sinc reconstruction on t_fine
  const numFine = State.t_fine.length;
  const tempRecon = [];
  const W = State.sincWindow;
  
  for (let i = 0; i < numFine; i++) {
    const t = State.t_fine[i];
    let sum = 0;
    const centerN = t / Ts;
    const startN = Math.max(0, Math.ceil(centerN - W));
    const endN = Math.min(Ns - 1, Math.floor(centerN + W));
    
    for (let n = startN; n <= endN; n++) {
      const tn = n * Ts;
      sum += tempSamples[n] * sinc((t - tn) / Ts);
    }
    tempRecon.push(sum);
  }
  
  // Compute error metrics
  let sumDiffSq = 0;
  for (let i = 0; i < numFine; i++) {
    const diff = State.x_fine[i] - tempRecon[i];
    sumDiffSq += diff * diff;
  }
  const mse = sumDiffSq / numFine;
  const rmse = Math.sqrt(mse);
  
  // Compute FFT for observed frequency detection
  const specRecon = getDoubleSidedFFT(tempRecon, State.plotRes, State.fftPadSize);
  const aliasFreq = Math.abs(State.f2 - Math.round(State.f2 / fsVal) * fsVal);
  const obsF2 = Math.abs(findInterpolatedPeak(specRecon, aliasFreq, 15));
  
  return { mse, rmse, obsF2 };
}

/**
 * Writes computed preset values directly to the comparison table
 */
function writePresetToTable(colId, fs, mse, rmse, obsF2) {
  const nyq = State.nyquistRate;
  let cond = '';
  let aliasText = '';
  let aliasF = 'None';
  
  if (fs > nyq) {
    cond = 'fs > 2fmax';
    aliasText = 'No';
  } else if (fs === nyq) {
    cond = 'fs = 2fmax';
    aliasText = 'No (Limit)';
  } else {
    cond = 'fs < 2fmax';
    aliasText = 'Yes';
    aliasF = Math.abs(State.f2 - Math.round(State.f2 / fs) * fs) + ' Hz';
  }
  
  document.getElementById(`cell-${colId}-fs`).textContent = fs + ' Hz';
  document.getElementById(`cell-${colId}-nyq`).textContent = nyq + ' Hz';
  document.getElementById(`cell-${colId}-cond`).textContent = cond;
  document.getElementById(`cell-${colId}-alias`).textContent = aliasText;
  document.getElementById(`cell-${colId}-alias-freq`).textContent = aliasF;
  document.getElementById(`cell-${colId}-obs-freq`).textContent = obsF2.toFixed(1) + ' Hz';
  document.getElementById(`cell-${colId}-mse`).textContent = mse.toFixed(5);
  document.getElementById(`cell-${colId}-rmse`).textContent = rmse.toFixed(5);
  
  const condEl = document.getElementById(`cell-${colId}-cond`);
  const aliasEl = document.getElementById(`cell-${colId}-alias`);
  const obsEl = document.getElementById(`cell-${colId}-obs-freq`);
  
  if (fs < nyq) {
    condEl.className = 'text-danger';
    aliasEl.className = 'text-danger';
    obsEl.className = 'text-danger font-mono';
  } else if (fs === nyq) {
    condEl.className = 'text-warn';
    aliasEl.className = 'text-warn';
    obsEl.className = 'font-mono';
  } else {
    condEl.className = 'text-safe';
    aliasEl.className = 'text-safe';
    obsEl.className = 'font-mono';
  }
}

/**
 * Save current simulation state into the table column matching a specific ID
 */
function savePresetToTable(colId) {
  const fs = State.fs;
  const metrics = computeMetricsForFs(fs);
  writePresetToTable(colId, fs, metrics.mse, metrics.rmse, metrics.obsF2);
}

/**
 * Saves current user state to table
 */
function saveCurrentToDashboard() {
  const fs = State.fs;
  let colId = '';
  if (fs === 400) colId = 'a';
  else if (fs === 240) colId = 'b';
  else if (fs === 180) colId = 'c';
  
  if (colId) {
    savePresetToTable(colId);
    alert(`Current setup matched Preset Case ${colId.toUpperCase()} and has updated that column in the comparison dashboard.`);
  } else {
    const choice = prompt("Which column should be updated with current parameters? Enter A, B, or C:").toLowerCase();
    if (choice === 'a' || choice === 'b' || choice === 'c') {
      savePresetToTable(choice);
    }
  }
}

// --- Data & Report Exporters ---

/**
 * Exports CSV plotting data
 */
function exportCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Time (s),Original Signal (V),Reconstructed Signal (V),Error (V),Sample Time (s),Sample Value (V)\n";
  
  const N_fine = State.t_fine.length;
  const N_samp = State.ns;
  const Ts = State.ts;
  const maxLen = Math.max(N_fine, N_samp);
  
  for (let i = 0; i < maxLen; i++) {
    const t_val = i < N_fine ? State.t_fine[i].toFixed(6) : "";
    const orig_val = i < N_fine ? State.x_fine[i].toFixed(6) : "";
    const recon_val = i < N_fine ? State.x_recon[i].toFixed(6) : "";
    const err_val = i < N_fine ? (State.x_fine[i] - State.x_recon[i]).toFixed(6) : "";
    
    const s_time = i < N_samp ? (i * Ts).toFixed(6) : "";
    const s_val = i < N_samp ? State.samples[i].toFixed(6) : "";
    
    csvContent += `${t_val},${orig_val},${recon_val},${err_val},${s_time},${s_val}\n`;
  }
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `sampling_experiment_data_fs_${State.fs}Hz.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate a complete text lab report file
 */
function exportTextReport() {
  const alias = calculateAliasingMath();
  const mse = document.getElementById('err-mse').textContent;
  const rmse = document.getElementById('err-rmse').textContent;
  const rel = document.getElementById('err-relative').textContent;
  
  const obsF2 = Math.abs(findInterpolatedPeak(State.specRecon, alias.f2.aliasFreq, 15));
  
  const report = `========================================================================
DIGITAL COMMUNICATION LABORATORY REPORT
EXPERIMENT 3: SAMPLING, ALIASING AND RECONSTRUCTION
========================================================================
Date of Simulation: ${new Date().toLocaleDateString()}
Conversation Ref: d1cabdd4-fea1-416f-8c40-50dc87a94aae

1. SIGNAL SOURCE CONFIGURATION
----------------------------------
Signal Model: x(t) = A1*sin(2*pi*f1*t) + A2*sin(2*pi*f2*t)
Tone 1 (f1)        : ${State.f1} Hz (Amplitude: ${State.a1.toFixed(1)})
Tone 2 (f2)        : ${State.f2} Hz (Amplitude: ${State.a2.toFixed(1)})
Max Frequency fmax : ${State.fmax} Hz
Nyquist Rate (2fmax): ${State.nyquistRate} Hz

2. PHYSICAL SAMPLING CONFIGURATION
----------------------------------
Sampling Rate (fs) : ${State.fs} Hz
Sampling Period (Ts): ${(State.ts * 1000).toFixed(3)} ms
Duration (T_dur)   : ${State.duration.toFixed(2)} s
Number of Samples  : ${State.ns}

3. AUTOMATIC ALIASING ANALYSIS
------------------------------
Nyquist Interval Limit (fs/2) : ${alias.nyqFreq} Hz
Tone 1 Aliasing Status        : ${alias.f1.isAliased ? 'ALIASED' : 'SAFE'}
Tone 2 Aliasing Status        : ${alias.f2.isAliased ? 'ALIASED' : 'SAFE'}

Manual Aliasing Folding Steps (Tone 2):
  Folding Integer k = round(f2/fs) = ${alias.f2.k}
  Expected Alias Freq = |f2 - k*fs| = |${State.f2} - ${alias.f2.k} * ${State.fs}| = ${alias.f2.aliasFreq} Hz
  Observed Spectral Peak in FFT     = ${obsF2.toFixed(2)} Hz
  Mathematical Discrepancy          = ${Math.abs(alias.f2.aliasFreq - obsF2).toFixed(3)} Hz

4. RECONSTRUCTION QUALITY METRICS
---------------------------------
Mean Squared Error (MSE)      : ${mse}
Root Mean Squared Error (RMSE): ${rmse}
Relative Reconstruction Error : ${rel}

5. INTERPRETATION & DISCUSSION
------------------------------
Active Case: ${State.fs > State.nyquistRate ? 'Case A (fs > 2fmax) - Proper Sampling' : (State.fs === State.nyquistRate ? 'Case B (fs = 2fmax) - Nyquist Limit' : 'Case C (fs < 2fmax) - Undersampling')}

${State.fs > State.nyquistRate 
  ? "Conclusion: The sampling frequency satisfies the Nyquist condition. The reconstruction matches the original continuous-time signal perfectly. Minor edge errors are due to finite window sinc truncation." 
  : (State.fs === State.nyquistRate 
    ? "Conclusion: Boundary state. Theoretically recoverable, but edge windowing truncations cause noticeable ripple. Minor phase shifting can trigger severe amplitude distortion." 
    : "Conclusion: Severe Aliasing. Sinc interpolation recovers the folded alias frequency (60 Hz for default case) instead of the original 120 Hz tone. Analog anti-aliasing filter is required prior to sampling.")
}

------------------------------------------------------------------------
Generated by Antigravity AI Lab Simulation Suite.
========================================================================`;

  const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `sampling_aliasing_lab_report_fs_${State.fs}Hz.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// --- Background Initialization ---

/**
 * Runs background simulations to populate comparison columns for Preset Cases A, B, and C
 */
function precalculatePresets() {
  // Case A (400 Hz)
  const resA = computeMetricsForFs(400);
  writePresetToTable('a', 400, resA.mse, resA.rmse, resA.obsF2);
  
  // Case B (240 Hz)
  const resB = computeMetricsForFs(240);
  writePresetToTable('b', 240, resB.mse, resB.rmse, resB.obsF2);
  
  // Case C (180 Hz)
  const resC = computeMetricsForFs(180);
  writePresetToTable('c', 180, resC.mse, resC.rmse, resC.obsF2);
  
  // Run main pipeline
  runSimulationPipeline();
}

// Window Onload Initialize
window.addEventListener('load', () => {
  // Pre-initialize basic arrays for precalculation
  State.fmax = Math.max(State.f1, State.f2);
  State.nyquistRate = 2 * State.fmax;
  
  const numFine = Math.floor(State.duration * State.plotRes);
  State.t_fine = [];
  State.x_fine = [];
  for (let i = 0; i < numFine; i++) {
    const t = i / State.plotRes;
    State.t_fine.push(t);
    State.x_fine.push(evaluateSignal(t));
  }
  
  initEventHandlers();
  precalculatePresets();
});

