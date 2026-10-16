/* ═══════════════════════════════════════════════════════════
   MAX STORE — WHAT-IF SCENARIO SIMULATOR & FORECASTING ENGINE
   File: simulator.js
   Dynamic simulation model calculating projected revenue,
   profit, margins, and category-level impacts based on 5
   strategic executive levers.
   ═══════════════════════════════════════════════════════════ */

'use strict';

let simChart = null;

// Baseline values from consolidated dataset
const SIM_BASELINE = {
  sales: 2297201,
  profit: 286397,
  margin: 12.47,
  // Category baselines
  categories: {
    Furniture:      { sales: 741999, profit: 18451, margin: 2.49 },
    OfficeSupplies: { sales: 719047, profit: 122491, margin: 17.04 },
    Technology:     { sales: 836154, profit: 145455, margin: 17.39 }
  },
  tablesSales: 206966,
  tablesLoss: -17725,
  standardShippingSpend: 1358216 * 0.12 // approx shipping component
};

// Current simulation parameters
let simParams = {
  discountCap: 0,      // 0% to 25% cap on high discounts
  furniturePrice: 0,   // 0% to 25% price increase on Tables/Bookcases
  techPush: 0,         // 0% to 50% volume boost on Tech
  shippingSavings: 0,  // 0% to 15% freight contract renegotiation
  retentionLift: 0     // 0% to 20% loyalty repeat purchase boost
};

// ── PRESET STRATEGIES ────────────────────────────────────────
const SIM_PRESETS = {
  baseline: {
    name: 'Historical Baseline',
    discountCap: 0,
    furniturePrice: 0,
    techPush: 0,
    shippingSavings: 0,
    retentionLift: 0
  },
  turnaround: {
    name: 'Turnaround: Fix Furniture Losses',
    discountCap: 15,
    furniturePrice: 15,
    techPush: 10,
    shippingSavings: 5,
    retentionLift: 8
  },
  aggressive: {
    name: 'Aggressive Scale: Tech & VIP Expansion',
    discountCap: 10,
    furniturePrice: 8,
    techPush: 35,
    shippingSavings: 8,
    retentionLift: 18
  },
  margin: {
    name: 'Margin Fortress: Strict Discount Policy',
    discountCap: 25,
    furniturePrice: 20,
    techPush: 15,
    shippingSavings: 12,
    retentionLift: 10
  }
};

// ── RUN SIMULATION CALCULATION ────────────────────────────────
function computeSimulation() {
  const p = simParams;
  
  // 1. Discount Cap impact:
  // Reducing excessive discounts directly converts lost discount dollars into profit
  // A 15% discount cap on troubled categories recovers ~55% of the $17.7K Table loss
  const discountProfitRecovered = (p.discountCap / 25) * 16500;
  
  // 2. Furniture Price Optimization (Tables & Bookcases):
  // Small price increase on inelastic business accounts yields high direct profit
  // Some small volume friction (-15% elasticity)
  const furniturePriceGain = SIM_BASELINE.tablesSales * (p.furniturePrice / 100) * 0.85;
  const furnitureSalesGain = SIM_BASELINE.tablesSales * (p.furniturePrice / 100) * 0.70;
  
  // 3. Tech Volume Push:
  // Boosting Tech sales brings 17.4% margin on incremental revenue
  const techSalesGain = SIM_BASELINE.categories.Technology.sales * (p.techPush / 100);
  const techProfitGain = techSalesGain * 0.174;
  
  // 4. Shipping Freight Savings:
  // Direct operational cost reduction translates 100% to bottom-line profit
  const shippingProfitGain = SIM_BASELINE.standardShippingSpend * (p.shippingSavings / 100);
  
  // 5. Customer Retention / VIP Lift:
  // Increasing repeat purchases from loyal tier (CLV booster)
  const retentionSalesGain = SIM_BASELINE.sales * 0.35 * (p.retentionLift / 100);
  const retentionProfitGain = retentionSalesGain * 0.145; // average blended margin on repeat
  
  // Totals
  const totalSalesDelta = furnitureSalesGain + techSalesGain + retentionSalesGain;
  const totalProfitDelta = discountProfitRecovered + furniturePriceGain + techProfitGain + shippingProfitGain + retentionProfitGain;
  
  const simSales = SIM_BASELINE.sales + totalSalesDelta;
  const simProfit = SIM_BASELINE.profit + totalProfitDelta;
  const simMargin = (simProfit / simSales) * 100;
  
  // Category breakouts
  const simFurnProfit = SIM_BASELINE.categories.Furniture.profit + discountProfitRecovered + furniturePriceGain;
  const simFurnSales  = SIM_BASELINE.categories.Furniture.sales + furnitureSalesGain;
  
  const simTechProfit = SIM_BASELINE.categories.Technology.profit + techProfitGain + (retentionProfitGain * 0.45);
  const simTechSales  = SIM_BASELINE.categories.Technology.sales + techSalesGain + (retentionSalesGain * 0.45);
  
  const simOfficeProfit = SIM_BASELINE.categories.OfficeSupplies.profit + (shippingProfitGain * 0.5) + (retentionProfitGain * 0.55);
  const simOfficeSales  = SIM_BASELINE.categories.OfficeSupplies.sales + (retentionSalesGain * 0.55);

  // Simulated Tables Net (baseline: -$17,725)
  const simTablesNet = SIM_BASELINE.tablesLoss + discountProfitRecovered + furniturePriceGain;

  return {
    simSales,
    simProfit,
    simMargin,
    totalSalesDelta,
    totalProfitDelta,
    profitLiftPct: ((totalProfitDelta / SIM_BASELINE.profit) * 100),
    marginDelta: (simMargin - SIM_BASELINE.margin),
    simTablesNet,
    categories: {
      Furniture: { sales: simFurnSales, profit: simFurnProfit },
      OfficeSupplies: { sales: simOfficeSales, profit: simOfficeProfit },
      Technology: { sales: simTechSales, profit: simTechProfit }
    }
  };
}

// ── UPDATE SIMULATOR UI ───────────────────────────────────────
function updateSimulatorUI() {
  const res = computeSimulation();
  const fmtC = (v) => {
    if (Math.abs(v) >= 1e6) return '$' + (v / 1e6).toFixed(2) + 'M';
    if (Math.abs(v) >= 1e3) return '$' + (v / 1e3).toFixed(1) + 'K';
    return '$' + Math.round(v);
  };

  // Update card metrics
  const elSimSales = document.getElementById('sim-metric-sales');
  const elSimProfit = document.getElementById('sim-metric-profit');
  const elSimMargin = document.getElementById('sim-metric-margin');
  const elSimTables = document.getElementById('sim-metric-tables');

  if (elSimSales) {
    elSimSales.textContent = fmtC(res.simSales);
    const deltaSales = document.getElementById('sim-delta-sales');
    if (deltaSales) {
      deltaSales.textContent = `${res.totalSalesDelta >= 0 ? '+' : ''}${fmtC(res.totalSalesDelta)} (${res.totalSalesDelta >= 0 ? '+' : ''}${((res.totalSalesDelta/SIM_BASELINE.sales)*100).toFixed(1)}%)`;
      deltaSales.className = `sim-kpi-sub ${res.totalSalesDelta >= 0 ? 'pos' : 'neg'}`;
    }
  }

  if (elSimProfit) {
    elSimProfit.textContent = fmtC(res.simProfit);
    const deltaProfit = document.getElementById('sim-delta-profit');
    if (deltaProfit) {
      deltaProfit.textContent = `+${fmtC(res.totalProfitDelta)} (+${res.profitLiftPct.toFixed(1)}% lift)`;
      deltaProfit.className = `sim-kpi-sub ${res.totalProfitDelta >= 0 ? 'pos' : 'neg'}`;
    }
  }

  if (elSimMargin) {
    elSimMargin.textContent = res.simMargin.toFixed(2) + '%';
    const deltaMargin = document.getElementById('sim-delta-margin');
    if (deltaMargin) {
      deltaMargin.textContent = `${res.marginDelta >= 0 ? '+' : ''}${res.marginDelta.toFixed(2)}% pts expansion`;
      deltaMargin.className = `sim-kpi-sub ${res.marginDelta >= 0 ? 'pos' : 'neg'}`;
    }
  }

  if (elSimTables) {
    elSimTables.textContent = (res.simTablesNet >= 0 ? '+' : '') + fmtC(res.simTablesNet);
    elSimTables.style.color = res.simTablesNet >= 0 ? '#10b981' : '#ef4444';
    const deltaTables = document.getElementById('sim-delta-tables');
    if (deltaTables) {
      if (res.simTablesNet >= 0) {
        deltaTables.textContent = '🎉 Turnaround achieved! Fully profitable';
        deltaTables.className = 'sim-kpi-sub pos';
      } else {
        const remainingLoss = Math.abs(res.simTablesNet);
        deltaTables.textContent = `Loss reduced by ${fmtC(Math.abs(SIM_BASELINE.tablesLoss) - remainingLoss)}`;
        deltaTables.className = 'sim-kpi-sub';
      }
    }
  }

  // Update slider badge labels
  const bc = document.getElementById('val-discountCap');
  if (bc) bc.textContent = simParams.discountCap + '%';
  const fp = document.getElementById('val-furniturePrice');
  if (fp) fp.textContent = '+' + simParams.furniturePrice + '%';
  const tp = document.getElementById('val-techPush');
  if (tp) tp.textContent = '+' + simParams.techPush + '%';
  const ss = document.getElementById('val-shippingSavings');
  if (ss) ss.textContent = simParams.shippingSavings + '%';
  const rl = document.getElementById('val-retentionLift');
  if (rl) rl.textContent = '+' + simParams.retentionLift + '%';

  // Update AI Strategy Assessment
  updateStrategyVerdict(res);

  // Update Chart
  updateSimulatorChart(res);
}

// ── STRATEGY VERDICT ASSESSMENT ───────────────────────────────
function updateStrategyVerdict(res) {
  const container = document.getElementById('simStrategyVerdict');
  if (!container) return;

  let riskTier = 'Conservative';
  let badgeColor = '#10b981';
  let badgeText = 'High Feasibility / Low Risk';

  if (simParams.discountCap > 18 || simParams.furniturePrice > 18 || simParams.techPush > 30) {
    riskTier = 'Aggressive Growth';
    badgeColor = '#8b5cf6';
    badgeText = 'High Impact / Active Execution Required';
  } else if (simParams.discountCap === 0 && simParams.furniturePrice === 0 && simParams.techPush === 0 && simParams.shippingSavings === 0 && simParams.retentionLift === 0) {
    riskTier = 'Historical Baseline';
    badgeColor = '#94a3b8';
    badgeText = 'No strategic levers applied';
  }

  container.innerHTML = `
    <div class="sim-verdict-header">
      <div class="sim-verdict-title">
        <span class="sim-verdict-pill" style="background:${badgeColor}22; color:${badgeColor}; border:1px solid ${badgeColor}44">
          ● ${riskTier}
        </span>
        <span style="font-size:12px; color:var(--text-muted)">${badgeText}</span>
      </div>
      <div class="sim-roi-box">
        <span style="font-size:10px; color:var(--text-muted); text-transform:uppercase">Projected Net ROI</span>
        <span style="font-size:17px; font-weight:700; color:#10b981">
          +${res.profitLiftPct > 0 ? res.profitLiftPct.toFixed(1) + '%' : '0%'}
        </span>
      </div>
    </div>
    <div class="sim-verdict-body">
      ${res.totalProfitDelta === 0 
        ? 'Adjust the 5 strategic levers above or click a scenario preset to evaluate financial sensitivity and project store growth.' 
        : `This policy creates <strong>+$${Math.round(res.totalProfitDelta).toLocaleString()}</strong> in annual incremental profit while expanding operating margins from <strong>12.5% to ${res.simMargin.toFixed(1)}%</strong>. ${res.simTablesNet >= 0 ? 'Crucially, the chronic Tables loss (-$17.7K) is completely eliminated and converted into a profit center.' : 'Losses on Tables are substantially mitigated.'}`}
    </div>
  `;
}

// ── SIMULATOR CHART ───────────────────────────────────────────
function updateSimulatorChart(res) {
  const canvas = document.getElementById('simComparisonChart');
  if (!canvas) return;

  const labels = ['Furniture', 'Office Supplies', 'Technology', 'Total Store'];
  const baselineProfit = [
    SIM_BASELINE.categories.Furniture.profit,
    SIM_BASELINE.categories.OfficeSupplies.profit,
    SIM_BASELINE.categories.Technology.profit,
    SIM_BASELINE.profit
  ];
  const simulatedProfit = [
    Math.round(res.categories.Furniture.profit),
    Math.round(res.categories.OfficeSupplies.profit),
    Math.round(res.categories.Technology.profit),
    Math.round(res.simProfit)
  ];

  if (simChart) {
    simChart.data.datasets[0].data = baselineProfit;
    simChart.data.datasets[1].data = simulatedProfit;
    simChart.update();
    return;
  }

  const ctx = canvas.getContext('2d');
  simChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Baseline Profit',
          data: baselineProfit,
          backgroundColor: 'rgba(148, 163, 184, 0.45)',
          borderColor: '#94a3b8',
          borderWidth: 1.5,
          borderRadius: 6
        },
        {
          label: 'Simulated Scenario',
          data: simulatedProfit,
          backgroundColor: 'rgba(99, 102, 241, 0.75)',
          borderColor: '#6366f1',
          borderWidth: 1.5,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } }
        },
        tooltip: {
          backgroundColor: '#161b2e',
          borderColor: 'rgba(255,255,255,0.12)',
          borderWidth: 1,
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: $${ctx.raw.toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 11 },
            callback: (v) => '$' + (v >= 1e3 ? (v/1e3).toFixed(0) + 'K' : v)
          }
        }
      }
    }
  });
}

// ── SLIDER HANDLERS ───────────────────────────────────────────
function onSimSliderChange(sliderId, value) {
  simParams[sliderId] = parseFloat(value);
  updateSimulatorUI();
}

// ── APPLY PRESET ──────────────────────────────────────────────
function applySimPreset(presetKey, btnEl) {
  const p = SIM_PRESETS[presetKey];
  if (!p) return;

  simParams.discountCap = p.discountCap;
  simParams.furniturePrice = p.furniturePrice;
  simParams.techPush = p.techPush;
  simParams.shippingSavings = p.shippingSavings;
  simParams.retentionLift = p.retentionLift;

  // Sync range inputs
  const s1 = document.getElementById('slider-discountCap');
  if (s1) s1.value = p.discountCap;
  const s2 = document.getElementById('slider-furniturePrice');
  if (s2) s2.value = p.furniturePrice;
  const s3 = document.getElementById('slider-techPush');
  if (s3) s3.value = p.techPush;
  const s4 = document.getElementById('slider-shippingSavings');
  if (s4) s4.value = p.shippingSavings;
  const s5 = document.getElementById('slider-retentionLift');
  if (s5) s5.value = p.retentionLift;

  // Active preset button styling
  document.querySelectorAll('.sim-preset-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  updateSimulatorUI();
}

// ── INIT SIMULATOR ────────────────────────────────────────────
function initSimulator() {
  updateSimulatorUI();
}
