/* ═══════════════════════════════════════════════════════════
   MAX STORE — SALES ANALYTICS  |  app.js
   Interactive Dashboard Controller
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── GLOBAL CHART REGISTRY ─────────────────────────────────────
const chartRegistry = {};

// ── CHART.JS GLOBAL DEFAULTS ──────────────────────────────────
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(17,21,32,0.95)';
Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.12)';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.cornerRadius = 10;
Chart.defaults.plugins.tooltip.titleColor = '#f1f5f9';
Chart.defaults.plugins.tooltip.bodyColor = '#94a3b8';
Chart.defaults.plugins.legend.display = false;

// ── HELPERS ───────────────────────────────────────────────────
const fmt = {
  currency: (v) => {
    if (v >= 1e6) return '$' + (v / 1e6).toFixed(2) + 'M';
    if (v >= 1e3) return '$' + (v / 1e3).toFixed(1) + 'K';
    return '$' + v.toFixed(0);
  },
  number: (v) => v.toLocaleString(),
  pct: (v) => (v >= 0 ? '+' : '') + v.toFixed(1) + '%',
};

function destroyChart(id) {
  if (chartRegistry[id]) {
    chartRegistry[id].destroy();
    delete chartRegistry[id];
  }
}

function createChart(id, config) {
  destroyChart(id);
  const ctx = document.getElementById(id);
  if (!ctx) return;
  chartRegistry[id] = new Chart(ctx, config);
  return chartRegistry[id];
}

// ── SIDEBAR TOGGLE ────────────────────────────────────────────
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const main    = document.getElementById('mainContent');
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    sidebar.classList.toggle('mobile-open');
  } else {
    sidebar.classList.toggle('collapsed');
    main.classList.toggle('expanded');
  }
}

// ── SECTION NAVIGATION ────────────────────────────────────────
const pageTitles = {
  overview:      'Overview',
  sales:         'Sales Trends',
  products:      'Products',
  regional:      'Regional Analysis',
  customers:     'Customers',
  profitability: 'Profitability',
};

function showSection(id, el) {
  // hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  // deactivate nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // show target
  const section = document.getElementById('section-' + id);
  if (section) section.classList.add('active');
  if (el) el.classList.add('active');

  // update topbar title
  document.getElementById('pageTitle').textContent = pageTitles[id] || id;

  // render charts for this section
  renderSection(id);

  // prevent default anchor scroll
  return false;
}

// ── FILTER STATE ──────────────────────────────────────────────
let filters = { year: 'all', region: 'all', segment: 'all' };

function applyFilters() {
  filters.year    = document.getElementById('filterYear').value;
  filters.region  = document.getElementById('filterRegion').value;
  filters.segment = document.getElementById('filterSegment').value;

  // Scale factor simulation based on filters
  const scale = computeScale();
  updateKPIs(scale);

  // re-render current section
  const activeSection = document.querySelector('.section.active');
  if (activeSection) {
    const id = activeSection.id.replace('section-', '');
    renderSection(id);
  }
}

function computeScale() {
  // Simplified: each active filter reduces scale realistically
  const yearScales   = { all: 1, '2014': 0.211, '2015': 0.205, '2016': 0.265, '2017': 0.319 };
  const regionScales = { all: 1, West: 0.316, East: 0.296, Central: 0.218, South: 0.171 };
  const segScales    = { all: 1, Consumer: 0.505, Corporate: 0.307, 'Home Office': 0.187 };
  return yearScales[filters.year] * regionScales[filters.region] * segScales[filters.segment] /
         (filters.year !== 'all' ? 1 : 1) /
         (filters.region !== 'all' || filters.segment !== 'all' ? 1 : 1);
}

function updateKPIs(scale) {
  const d = SALES_DATA.kpi;
  const normalize = (filters.year === 'all' && filters.region === 'all' && filters.segment === 'all') ? 1 : scale;
  document.getElementById('kpi-sales').textContent = fmt.currency(d.totalSales * normalize);
  document.getElementById('kpi-profit').textContent = fmt.currency(d.totalProfit * normalize);
  document.getElementById('kpi-orders').textContent = fmt.number(Math.round(d.totalOrders * normalize));
  document.getElementById('kpi-qty').textContent = fmt.number(Math.round(d.totalQuantity * normalize));
  document.getElementById('kpi-customers').textContent = fmt.number(Math.round(d.uniqueCustomers * normalize));
  document.getElementById('kpi-margin').textContent = (d.profitMargin + (normalize < 1 ? (normalize - 1) * 5 : 0)).toFixed(2) + '%';
}

// ── CHART RENDERING ───────────────────────────────────────────
function renderSection(id) {
  switch (id) {
    case 'overview':      renderOverview(); break;
    case 'sales':         renderSalesTrends(); break;
    case 'products':      renderProducts(); break;
    case 'regional':      renderRegional(); break;
    case 'customers':     renderCustomers(); break;
    case 'profitability': renderProfitability(); break;
  }
}

// ═══ OVERVIEW ══════════════════════════════════════════════════
function renderOverview() {
  const d = SALES_DATA;

  // Monthly Sales & Profit Trend
  createChart('monthlySalesChart', {
    type: 'line',
    data: {
      labels: d.monthly.labels,
      datasets: [
        {
          label: 'Sales',
          data: d.monthly.sales,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.12)',
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#6366f1',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Profit',
          data: d.monthly.profit,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.08)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#10b981',
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    },
    options: chartOptions({
      scales: { y: { ticks: { callback: v => fmt.currency(v) } } },
      plugins: { tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${fmt.currency(c.raw)}` } } },
    }),
  });

  // Category Donut
  const catCtx = document.getElementById('categoryDonutChart');
  if (catCtx) {
    const c = d.category;
    createChart('categoryDonutChart', {
      type: 'doughnut',
      data: {
        labels: c.labels,
        datasets: [{ data: c.sales, backgroundColor: c.colors, borderColor: '#161b2e', borderWidth: 3, hoverOffset: 8 }],
      },
      options: {
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${fmt.currency(ctx.raw)} (${(ctx.raw/d.kpi.totalSales*100).toFixed(1)}%)` } },
        },
      },
    });
    // build legend
    const leg = document.getElementById('categoryLegend');
    if (leg) {
      leg.innerHTML = c.labels.map((l, i) =>
        `<span style="display:flex;align-items:center;gap:6px">
           <span style="width:10px;height:10px;border-radius:50%;background:${c.colors[i]}"></span>
           ${l}: <b style="color:#f1f5f9">${fmt.currency(c.sales[i])}</b>
         </span>`
      ).join('');
    }
  }

  // Segment Bar
  const seg = d.segment;
  createChart('segmentChart', {
    type: 'bar',
    data: {
      labels: seg.labels,
      datasets: [{
        label: 'Sales',
        data: seg.sales,
        backgroundColor: seg.colors.map(c => c + 'cc'),
        borderColor: seg.colors,
        borderWidth: 2,
        borderRadius: 8,
      }],
    },
    options: chartOptions({ scales: { y: { ticks: { callback: v => fmt.currency(v) } } } }),
  });

  // Ship Mode Horizontal Bar
  const ship = d.shipMode;
  createChart('shipModeChart', {
    type: 'bar',
    data: {
      labels: ship.labels,
      datasets: [{
        label: 'Orders',
        data: ship.orders,
        backgroundColor: ship.colors.map(c => c + 'bb'),
        borderColor: ship.colors,
        borderWidth: 2,
        borderRadius: 8,
      }],
    },
    options: chartOptions({ indexAxis: 'y', scales: { x: { ticks: { callback: v => v.toLocaleString() } } } }),
  });

  // Quarterly Donut
  const q = d.quarterly;
  createChart('quarterlyChart', {
    type: 'doughnut',
    data: {
      labels: q.labels,
      datasets: [{ data: q.sales, backgroundColor: q.colors, borderColor: '#161b2e', borderWidth: 3, hoverOffset: 6 }],
    },
    options: {
      cutout: '65%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom', labels: { padding: 12, usePointStyle: true, pointStyleWidth: 8 } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${fmt.currency(ctx.raw)}` } },
      },
    },
  });
}

// ═══ SALES TRENDS ══════════════════════════════════════════════
function renderSalesTrends() {
  const d = SALES_DATA;

  // Yearly Sales Bar + Line combo
  createChart('yearlySalesChart', {
    type: 'bar',
    data: {
      labels: d.yearly.labels,
      datasets: [
        {
          type: 'bar',
          label: 'Sales',
          data: d.yearly.sales,
          backgroundColor: 'rgba(99,102,241,0.5)',
          borderColor: '#6366f1',
          borderWidth: 2,
          borderRadius: 10,
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Profit',
          data: d.yearly.profit,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.1)',
          borderWidth: 2.5,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#10b981',
          pointRadius: 6,
          yAxisID: 'y1',
        },
      ],
    },
    options: chartOptions({
      scales: {
        y:  { position: 'left',  ticks: { callback: v => fmt.currency(v) } },
        y1: { position: 'right', ticks: { callback: v => fmt.currency(v) }, grid: { display: false } },
      },
      plugins: { legend: { display: true, position: 'top', labels: { padding: 16, usePointStyle: true } } },
    }),
  });

  // MoM Growth Rate
  const gr = d.growthRate;
  createChart('growthRateChart', {
    type: 'bar',
    data: {
      labels: gr.labels,
      datasets: [{
        label: 'Growth %',
        data: gr.values,
        backgroundColor: gr.values.map(v => v >= 0 ? 'rgba(16,185,129,0.6)' : 'rgba(239,68,68,0.6)'),
        borderColor:     gr.values.map(v => v >= 0 ? '#10b981' : '#ef4444'),
        borderWidth: 2,
        borderRadius: 6,
      }],
    },
    options: chartOptions({
      scales: { y: { ticks: { callback: v => v + '%' } } },
      plugins: { tooltip: { callbacks: { label: c => ` Growth: ${fmt.pct(c.raw)}` } } },
    }),
  });

  // Scatter — Sales vs Profit
  createChart('scatterChart', {
    type: 'bubble',
    data: {
      datasets: [{
        label: 'Sub-Category',
        data: d.scatter.map(p => ({ x: p.x, y: p.y, r: p.r, label: p.label })),
        backgroundColor: d.scatter.map(p => p.y >= 0 ? 'rgba(99,102,241,0.6)' : 'rgba(239,68,68,0.6)'),
        borderColor:     d.scatter.map(p => p.y >= 0 ? '#6366f1' : '#ef4444'),
        borderWidth: 2,
      }],
    },
    options: chartOptions({
      scales: {
        x: { title: { display: true, text: 'Total Sales ($)', color: '#94a3b8' }, ticks: { callback: v => fmt.currency(v) } },
        y: { title: { display: true, text: 'Total Profit ($)', color: '#94a3b8' }, ticks: { callback: v => fmt.currency(v) } },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => {
              const d2 = ctx.raw;
              return ` ${d2.label}: Sales ${fmt.currency(d2.x)}, Profit ${fmt.currency(d2.y)}`;
            },
          },
        },
      },
    }),
  });

  // Discount Impact
  const dis = d.discount;
  createChart('discountChart', {
    type: 'line',
    data: {
      labels: dis.labels,
      datasets: [{
        label: 'Avg Profit ($)',
        data: dis.profit,
        borderColor: '#f59e0b',
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
          gradient.addColorStop(0, 'rgba(245,158,11,0.3)');
          gradient.addColorStop(1, 'rgba(239,68,68,0.05)');
          return gradient;
        },
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: dis.profit.map(v => v >= 0 ? '#f59e0b' : '#ef4444'),
        pointRadius: 5,
      }],
    },
    options: chartOptions({
      scales: { y: { ticks: { callback: v => '$' + v } } },
      plugins: { tooltip: { callbacks: { label: c => ` Avg Profit: $${c.raw}` } } },
    }),
  });
}

// ═══ PRODUCTS ══════════════════════════════════════════════════
function renderProducts() {
  const d = SALES_DATA;

  // Top 10 Sales — Horizontal Bar
  const t10s = d.top10Sales;
  createChart('top10SalesChart', {
    type: 'bar',
    data: {
      labels: t10s.labels,
      datasets: [{
        label: 'Sales',
        data: t10s.values,
        backgroundColor: 'rgba(99,102,241,0.55)',
        borderColor: '#6366f1',
        borderWidth: 2,
        borderRadius: 6,
      }],
    },
    options: chartOptions({
      indexAxis: 'y',
      scales: { x: { ticks: { callback: v => fmt.currency(v) } } },
    }),
  });

  // Sub-Category horizontal bar
  const sc = d.subCategory;
  createChart('subCategoryChart', {
    type: 'bar',
    data: {
      labels: sc.labels,
      datasets: [{
        label: 'Sales',
        data: sc.sales,
        backgroundColor: sc.colors.map(c => c + 'aa'),
        borderColor: sc.colors,
        borderWidth: 2,
        borderRadius: 6,
      }],
    },
    options: chartOptions({ indexAxis: 'y', scales: { x: { ticks: { callback: v => fmt.currency(v) } } } }),
  });

  // Top 10 Profit
  const t10p = d.top10Profit;
  createChart('top10ProfitChart', {
    type: 'bar',
    data: {
      labels: t10p.labels,
      datasets: [{
        label: 'Profit',
        data: t10p.values,
        backgroundColor: 'rgba(16,185,129,0.55)',
        borderColor: '#10b981',
        borderWidth: 2,
        borderRadius: 6,
      }],
    },
    options: chartOptions({ indexAxis: 'y', scales: { x: { ticks: { callback: v => fmt.currency(v) } } } }),
  });

  // Loss Products
  const lp = d.lossProducts;
  createChart('lossProductsChart', {
    type: 'bar',
    data: {
      labels: lp.labels,
      datasets: [{
        label: 'Profit (Loss)',
        data: lp.values,
        backgroundColor: 'rgba(239,68,68,0.55)',
        borderColor: '#ef4444',
        borderWidth: 2,
        borderRadius: 6,
      }],
    },
    options: chartOptions({ indexAxis: 'y', scales: { x: { ticks: { callback: v => fmt.currency(v) } } } }),
  });
}

// ═══ REGIONAL ══════════════════════════════════════════════════
function renderRegional() {
  const d = SALES_DATA;
  const r = d.region;

  // Region cards
  const container = document.getElementById('regionCards');
  if (container) {
    container.innerHTML = r.labels.map((label, i) => `
      <div class="region-card" style="--region-color:${r.colors[i]}">
        <div class="region-name">${label} Region</div>
        <div class="region-sales">${fmt.currency(r.sales[i])}</div>
        <div class="region-profit" style="color:${r.colors[i]}">Profit: ${fmt.currency(r.profit[i])}</div>
        <div class="region-badge" style="color:${r.colors[i]}">Margin ${r.margin[i]}%</div>
      </div>
    `).join('');
  }

  // Grouped bar: Region Sales vs Profit
  createChart('regionalBarChart', {
    type: 'bar',
    data: {
      labels: r.labels,
      datasets: [
        {
          label: 'Sales',
          data: r.sales,
          backgroundColor: r.colors.map(c => c + 'aa'),
          borderColor: r.colors,
          borderWidth: 2,
          borderRadius: 8,
        },
        {
          label: 'Profit',
          data: r.profit,
          backgroundColor: r.colors.map(c => c + '44'),
          borderColor: r.colors,
          borderWidth: 2,
          borderRadius: 8,
          borderDash: [4, 4],
        },
      ],
    },
    options: chartOptions({
      scales: { y: { ticks: { callback: v => fmt.currency(v) } } },
      plugins: { legend: { display: true, position: 'top', labels: { padding: 16, usePointStyle: true } } },
    }),
  });

  // Region Market Share Pie
  createChart('regionalPieChart', {
    type: 'doughnut',
    data: {
      labels: r.labels,
      datasets: [{ data: r.sales, backgroundColor: r.colors, borderColor: '#161b2e', borderWidth: 3, hoverOffset: 8 }],
    },
    options: {
      cutout: '60%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom', labels: { padding: 10, usePointStyle: true, pointStyleWidth: 8 } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${fmt.currency(ctx.raw)} (${(ctx.raw/d.kpi.totalSales*100).toFixed(1)}%)` } },
      },
    },
  });

  // Region × Category Stacked Bar
  const rc = d.regionCategory;
  createChart('regionCategoryChart', {
    type: 'bar',
    data: {
      labels: rc.labels,
      datasets: [
        { label: 'Technology',     data: rc.technology,     backgroundColor: 'rgba(99,102,241,0.7)', borderRadius: 4 },
        { label: 'Furniture',      data: rc.furniture,      backgroundColor: 'rgba(236,72,153,0.7)', borderRadius: 4 },
        { label: 'Office Supplies',data: rc.officeSupplies, backgroundColor: 'rgba(16,185,129,0.7)', borderRadius: 4 },
      ],
    },
    options: chartOptions({
      scales: {
        x: { stacked: true },
        y: { stacked: true, ticks: { callback: v => fmt.currency(v) } },
      },
      plugins: { legend: { display: true, position: 'top', labels: { padding: 16, usePointStyle: true } } },
    }),
  });
}

// ═══ CUSTOMERS ═════════════════════════════════════════════════
function renderCustomers() {
  const d = SALES_DATA;
  const seg = d.segment;

  // Segment Donut
  createChart('custSegmentDonut', {
    type: 'doughnut',
    data: {
      labels: seg.labels,
      datasets: [{ data: seg.sales, backgroundColor: seg.colors, borderColor: '#161b2e', borderWidth: 3, hoverOffset: 8 }],
    },
    options: {
      cutout: '70%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom', labels: { padding: 12, usePointStyle: true } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${fmt.currency(ctx.raw)}` } },
      },
    },
  });

  // Multi-KPI grouped bar
  createChart('segmentKpiChart', {
    type: 'bar',
    data: {
      labels: seg.labels,
      datasets: [
        { label: 'Sales',    data: seg.sales,   backgroundColor: 'rgba(99,102,241,0.7)', borderRadius: 6 },
        { label: 'Profit',   data: seg.profit,  backgroundColor: 'rgba(16,185,129,0.7)', borderRadius: 6 },
        { label: 'Quantity', data: seg.qty,      backgroundColor: 'rgba(245,158,11,0.7)', borderRadius: 6 },
      ],
    },
    options: chartOptions({
      scales: { y: { ticks: { callback: v => v.toLocaleString() } } },
      plugins: { legend: { display: true, position: 'top', labels: { padding: 16, usePointStyle: true } } },
    }),
  });

  // Order Frequency
  const of = d.orderFreq;
  createChart('orderFreqChart', {
    type: 'bar',
    data: {
      labels: of.labels,
      datasets: [{
        label: 'Customers',
        data: of.values,
        backgroundColor: of.colors.map(c => c + 'bb'),
        borderColor: of.colors,
        borderWidth: 2,
        borderRadius: 10,
      }],
    },
    options: chartOptions({ scales: { y: { ticks: { callback: v => v + ' customers' } } } }),
  });

  // Ship Mode × Segment Stacked
  const ss = d.shipSegment;
  createChart('shipSegmentChart', {
    type: 'bar',
    data: {
      labels: ss.labels,
      datasets: [
        { label: 'Standard Class', data: ss.standard, backgroundColor: 'rgba(99,102,241,0.7)', borderRadius: 4 },
        { label: 'Second Class',   data: ss.second,   backgroundColor: 'rgba(16,185,129,0.7)', borderRadius: 4 },
        { label: 'First Class',    data: ss.first,    backgroundColor: 'rgba(245,158,11,0.7)', borderRadius: 4 },
        { label: 'Same Day',       data: ss.sameDay,  backgroundColor: 'rgba(236,72,153,0.7)', borderRadius: 4 },
      ],
    },
    options: chartOptions({
      scales: { x: { stacked: true }, y: { stacked: true } },
      plugins: { legend: { display: true, position: 'top', labels: { padding: 12, usePointStyle: true, boxWidth: 10 } } },
    }),
  });
}

// ═══ PROFITABILITY ═════════════════════════════════════════════
function renderProfitability() {
  const d = SALES_DATA;

  // Profit Margin horizontal bar
  const m = d.margin;
  createChart('marginChart', {
    type: 'bar',
    data: {
      labels: m.labels,
      datasets: [{
        label: 'Profit Margin %',
        data: m.values,
        backgroundColor: m.values.map(v => v >= 10 ? 'rgba(16,185,129,0.65)' : v >= 0 ? 'rgba(245,158,11,0.65)' : 'rgba(239,68,68,0.65)'),
        borderColor:     m.values.map(v => v >= 10 ? '#10b981' : v >= 0 ? '#f59e0b' : '#ef4444'),
        borderWidth: 2,
        borderRadius: 6,
      }],
    },
    options: chartOptions({
      indexAxis: 'y',
      scales: { x: { ticks: { callback: v => v + '%' } } },
      plugins: { tooltip: { callbacks: { label: c => ` Margin: ${c.raw.toFixed(1)}%` } } },
    }),
  });

  // Ship Mode Profit
  const ship = d.shipMode;
  createChart('shipProfitChart', {
    type: 'bar',
    data: {
      labels: ship.labels,
      datasets: [{
        label: 'Profit',
        data: ship.profit,
        backgroundColor: ship.colors.map(c => c + 'bb'),
        borderColor: ship.colors,
        borderWidth: 2,
        borderRadius: 8,
      }],
    },
    options: chartOptions({ scales: { y: { ticks: { callback: v => fmt.currency(v) } } } }),
  });

  // Discount Detail — line with fill zones
  const dis = d.discount;
  createChart('discountDetailChart', {
    type: 'line',
    data: {
      labels: dis.labels,
      datasets: [
        {
          label: 'Avg Profit ($)',
          data: dis.profit,
          borderColor: '#6366f1',
          backgroundColor: (ctx) => {
            const chart = ctx.chart;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) return 'transparent';
            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(99,102,241,0.3)');
            gradient.addColorStop(0.5, 'rgba(245,158,11,0.1)');
            gradient.addColorStop(1, 'rgba(239,68,68,0.05)');
            return gradient;
          },
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: dis.profit.map(v => v >= 0 ? '#10b981' : '#ef4444'),
          pointRadius: 7,
          pointHoverRadius: 10,
        },
        {
          label: 'Break-even',
          data: Array(dis.labels.length).fill(0),
          borderColor: 'rgba(239,68,68,0.5)',
          borderWidth: 1.5,
          borderDash: [6, 4],
          pointRadius: 0,
          fill: false,
        },
      ],
    },
    options: chartOptions({
      scales: { y: { ticks: { callback: v => '$' + v } } },
      plugins: {
        legend: { display: true, position: 'top', labels: { padding: 16, usePointStyle: true } },
        tooltip: { callbacks: { label: c => ` ${c.dataset.label}: $${c.raw}` } },
        annotation: {},
      },
    }),
  });
}

// ── CHART OPTIONS HELPER ──────────────────────────────────────
function chartOptions(extras = {}) {
  const base = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600, easing: 'easeOutQuart' },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {},
      },
    },
    interaction: { mode: 'index', intersect: false },
  };

  // Deep merge
  return deepMerge(base, extras);
}

function deepMerge(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = deepMerge(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Render first section
  renderOverview();

  // Animate KPI cards
  document.querySelectorAll('.kpi-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 80 * i);
  });

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      Object.values(chartRegistry).forEach(c => c.resize());
    }, 200);
  });

  // Mobile: close sidebar on outside click
  document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const btn = document.getElementById('menuBtn');
    if (window.innerWidth < 768 && sidebar.classList.contains('mobile-open')) {
      if (!sidebar.contains(e.target) && !btn.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
      }
    }
  });
});
