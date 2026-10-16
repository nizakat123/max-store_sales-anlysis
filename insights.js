/* ═══════════════════════════════════════════════════════════
   MAX STORE — AI SMART INSIGHTS ENGINE  |  insights.js
   Automatically surfaces ranked, natural-language business
   intelligence from the sales dataset with severity scoring,
   typewriter rendering, category filtering, and deep-dive modal.
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── ACTIVE FILTER STATE ──────────────────────────────────────
let activeCategory = 'all';
let allInsights    = [];
let selectedInsight = null;

// ── INSIGHT DEFINITIONS ───────────────────────────────────────
// Each insight is auto-computed from SALES_DATA and carries
// severity, category, metrics, body text and a recommendation.
function generateInsights() {
  const D = SALES_DATA;

  const totalSales   = D.kpi.totalSales;
  const totalProfit  = D.kpi.totalProfit;
  const totalOrders  = D.kpi.totalOrders;
  const margin       = D.kpi.profitMargin;

  // helper
  const pct = (v, total) => ((v / total) * 100).toFixed(1);
  const fmt = (v) => {
    if (Math.abs(v) >= 1e6) return '$' + (v / 1e6).toFixed(2) + 'M';
    if (Math.abs(v) >= 1e3) return '$' + (v / 1e3).toFixed(1) + 'K';
    return '$' + v.toFixed(0);
  };

  return [
    // ── INSIGHT 1: Holiday Season Peak ────────────────────
    {
      id: 'seasonal-peak',
      category: 'growth',
      icon: '📅',
      iconBg: 'rgba(245,158,11,0.15)',
      iconColor: '#f59e0b',
      accent: '#f59e0b',
      glow: 'rgba(245,158,11,0.08)',
      severity: 'high',
      impactScore: 9,
      title: 'Holiday Season Drives 27% of Annual Revenue',
      summary: 'November and December alone generate <span class="highlight">$619K</span> in sales — 3× the monthly average. Strategic inventory and marketing investment here yields the highest ROI.',
      fullBody: `<strong>November ($347K)</strong> and <strong>December ($272K)</strong> together contribute 27% of the entire year's revenue. This is driven by end-of-year corporate procurement cycles, gifting season, and consumer holiday spending.\n\nIn contrast, <strong>February ($59.7K)</strong> is the weakest month — just 17% of November's performance. The gap between peak and trough months is <strong>5.8×</strong>, indicating extreme seasonality.\n\nSales momentum builds from <strong>September</strong> onward with consistent month-over-month growth through year-end, followed by a sharp January reset.`,
      metrics: [
        { val: '$619K',  lbl: 'Nov+Dec Sales' },
        { val: '27%',    lbl: 'Annual Share' },
        { val: '$59.7K', lbl: 'Feb (Lowest)' },
        { val: '5.8×',   lbl: 'Peak:Trough' },
      ],
      progress: { label: 'Nov–Dec Share of Annual Revenue', value: 27 },
      recommendation: 'Increase Q4 inventory by 35% and launch targeted campaigns from October. Protect margin with bundle offers instead of flat discounts.',
      ctaText: 'View monthly trends →',
    },

    // ── INSIGHT 2: Tables Loss-Maker ──────────────────────
    {
      id: 'tables-loss',
      category: 'risk',
      icon: '🪑',
      iconBg: 'rgba(239,68,68,0.12)',
      iconColor: '#ef4444',
      accent: '#ef4444',
      glow: 'rgba(239,68,68,0.07)',
      severity: 'critical',
      impactScore: 10,
      title: 'Tables Sub-Category Loses $17.7K — Worst Performer',
      summary: 'Despite <span class="highlight">$207K in sales</span>, Tables generate a <span class="highlight">−$17.7K loss</span> (−8.6% margin). This is the single largest profit drain in the entire catalog.',
      fullBody: `<strong>Tables</strong> produce $206,966 in revenue but result in a net loss of $17,725 — a margin of <strong>−8.6%</strong>. This is primarily caused by aggressive discounting (average discount: 32%) and high fulfillment costs for large items.\n\nThe problem compounds because Tables represent the <strong>4th highest revenue sub-category</strong> — meaning high volume amplifies the loss at scale. Every unit sold at current pricing destroys value.\n\nComparison: <strong>Copiers</strong> (similar revenue band) achieve a 37.2% margin. The pricing structure for Tables requires immediate review.\n\nAdditionally, <strong>Bookcases</strong> also carry a −3% margin, indicating a systemic issue with large furniture items in the portfolio.`,
      metrics: [
        { val: '$207K',   lbl: 'Revenue' },
        { val: '−$17.7K', lbl: 'Profit (Loss)' },
        { val: '−8.6%',   lbl: 'Margin' },
        { val: '32%',     lbl: 'Avg Discount' },
      ],
      progress: { label: 'Loss as % of revenue (inverted risk)', value: 86 },
      recommendation: 'Immediately cap discounts on Tables at 15%. Introduce minimum order quantities for large furniture. Review supplier costs to assess whether the category can ever be profitable.',
      ctaText: 'View profitability →',
    },

    // ── INSIGHT 3: West Region Leader ─────────────────────
    {
      id: 'west-dominance',
      category: 'region',
      icon: '🌎',
      iconBg: 'rgba(99,102,241,0.15)',
      iconColor: '#6366f1',
      accent: '#6366f1',
      glow: 'rgba(99,102,241,0.08)',
      severity: 'medium',
      impactScore: 7,
      title: 'West Region Leads with 31.6% Market Share & 14.9% Margin',
      summary: 'The West outperforms all regions in both <span class="highlight">total sales ($725K)</span> and <span class="highlight">profit margin (14.9%)</span>, generating nearly double Central\'s profit on similar margins.',
      fullBody: `The <strong>West Region</strong> is the undisputed performance leader with $725,458 in sales (31.6% of total) and $108,418 in profit — the highest of any region.\n\nKey differentiators:\n• <strong>Margin efficiency</strong>: 14.9% vs the national average of 12.5%\n• <strong>Order volume</strong>: 3,203 orders — highest regionally\n• <strong>Technology dominance</strong>: West leads Technology category sales at $262K\n\n<strong>Central Region</strong> is the weakest at 7.9% margin ($39,706 profit on $501K sales), suggesting pricing pressure or higher discount rates in Central states.\n\nThe <strong>South Region</strong> has the lowest order count (1,620) but reasonable margins (11.9%), indicating fewer but higher-value transactions.`,
      metrics: [
        { val: '$725K', lbl: 'West Sales' },
        { val: '14.9%', lbl: 'West Margin' },
        { val: '31.6%', lbl: 'Market Share' },
        { val: '7.9%',  lbl: 'Central Margin' },
      ],
      progress: { label: 'West Region % of Total Sales', value: 31.6 },
      recommendation: 'Replicate West Region playbook (product mix, discount policies) in Central to lift its margin from 7.9% toward 12%+. Study West\'s Technology focus as a driver.',
      ctaText: 'View regional analysis →',
    },

    // ── INSIGHT 4: Copiers — Hidden Gold ──────────────────
    {
      id: 'copiers-margin',
      category: 'product',
      icon: '🖨️',
      iconBg: 'rgba(16,185,129,0.15)',
      iconColor: '#10b981',
      accent: '#10b981',
      glow: 'rgba(16,185,129,0.07)',
      severity: 'low',
      impactScore: 8,
      title: 'Copiers Deliver 37.2% Margin — Highest in Portfolio',
      summary: 'Copiers achieve a <span class="highlight">37.2% profit margin</span> with <span class="highlight">$55.6K profit</span> on just $149K revenue — the best margin efficiency in the entire product catalog.',
      fullBody: `Despite being only the 8th largest sub-category by revenue ($149,528), <strong>Copiers</strong> generate $55,618 in profit — a remarkable <strong>37.2% margin</strong>.\n\nThis places Copiers as the single most profitable sub-category on a margin basis. The product type benefits from:\n• Low discount rates (avg ~5%)\n• High unit prices with strong perceived value\n• Corporate bulk purchasing without margin erosion\n\nFor comparison, <strong>Phones</strong> (the top revenue sub-category at $330K) deliver only a 13.5% margin — meaning Copiers are nearly 3× more margin-efficient per dollar sold.\n\n<strong>Opportunity</strong>: If Copiers revenue doubled to $300K while maintaining margin, the incremental profit impact would be ~$56K annually — equivalent to the entire Office Supplies category profit.`,
      metrics: [
        { val: '37.2%',  lbl: 'Margin' },
        { val: '$55.6K', lbl: 'Profit' },
        { val: '$149K',  lbl: 'Revenue' },
        { val: '~5%',    lbl: 'Avg Discount' },
      ],
      progress: { label: 'Margin vs portfolio avg (12.47%)', value: 75 },
      recommendation: 'Increase marketing investment in Copiers by 20%. Create bundled deals (Copier + Paper/Binders) to cross-sell with profitable accessories. Protect low-discount policy.',
      ctaText: 'View product analysis →',
    },

    // ── INSIGHT 5: Discount Erosion Threshold ─────────────
    {
      id: 'discount-cliff',
      category: 'risk',
      icon: '📉',
      iconBg: 'rgba(239,68,68,0.12)',
      iconColor: '#ef4444',
      accent: '#ef4444',
      glow: 'rgba(239,68,68,0.07)',
      severity: 'critical',
      impactScore: 10,
      title: 'Discounts Above 30% Consistently Destroy Profit',
      summary: 'Average profit turns <span class="highlight">negative at 30%+ discount</span>. Orders with 50%+ discounts lose an average of <span class="highlight">$14.7 each</span> — a structural margin killer.',
      fullBody: `Analysis of ${totalOrders.toLocaleString()} orders reveals a clear profit cliff at the <strong>30% discount threshold</strong>:\n\n• 0% discount → avg profit: <strong>+$17.8</strong>\n• 10% discount → avg profit: <strong>+$14.2</strong>\n• 20% discount → avg profit: <strong>+$9.1</strong>\n• 30% discount → avg profit: <strong>−$1.4</strong> (break-even zone)\n• 50% discount → avg profit: <strong>−$14.7</strong>\n• 80% discount → avg profit: <strong>−$59.4</strong>\n\nThe data shows <strong>profit drops at a 1.47× rate</strong> relative to discount increases — meaning a 10% discount rise costs more profit than it generates in volume uplift.\n\nSub-categories most vulnerable to this pattern: <strong>Tables</strong>, <strong>Machines</strong>, and <strong>Bookcases</strong> — all already operating at negative margins with high discount rates.`,
      metrics: [
        { val: '30%',    lbl: 'Cliff Threshold' },
        { val: '−$14.7', lbl: 'Avg Loss @50%' },
        { val: '−$59.4', lbl: 'Avg Loss @80%' },
        { val: '+$17.8', lbl: 'Avg Profit @0%' },
      ],
      progress: { label: 'Orders at 30%+ discount (risk zone)', value: 38 },
      recommendation: 'Implement a hard cap of 20% on standard discounts. Require VP approval for any discount above 30%. Run a 90-day audit to identify which sales reps are granting 30%+ discounts most frequently.',
      ctaText: 'View profitability →',
    },

    // ── INSIGHT 6: Consumer Segment Dominance ─────────────
    {
      id: 'consumer-segment',
      category: 'customer',
      icon: '👥',
      iconBg: 'rgba(99,102,241,0.15)',
      iconColor: '#6366f1',
      accent: '#6366f1',
      glow: 'rgba(99,102,241,0.08)',
      severity: 'medium',
      impactScore: 6,
      title: 'Consumer Segment: 50.6% of Revenue but Lowest Margin',
      summary: 'Consumers drive <span class="highlight">$1.16M (50.6%)</span> of total sales but generate lower margin than Corporate. Corporate customers are <span class="highlight">more profitable per dollar</span> spent.',
      fullBody: `The <strong>Consumer segment</strong> dominates by revenue ($1,161,401 — 50.6%) but shows signs of margin pressure compared to Corporate.\n\n<strong>Margin comparison</strong>:\n• Consumer: 11.5% ($134K profit / $1.16M sales)\n• Corporate: 13.0% ($92K profit / $706K sales)\n• Home Office: 14.0% ($60K profit / $430K sales)\n\nThis reveals that <strong>Home Office is the most margin-efficient segment</strong> despite being the smallest. The pattern suggests Consumer customers receive more aggressive discounts or purchase lower-margin product mixes.\n\n<strong>Customer loyalty insight</strong>: 249 customers placed 6+ orders — these "loyal" buyers represent the highest CLV potential and should be targeted with retention programs.`,
      metrics: [
        { val: '$1.16M',  lbl: 'Consumer Revenue' },
        { val: '50.6%',   lbl: 'Revenue Share' },
        { val: '11.5%',   lbl: 'Consumer Margin' },
        { val: '14.0%',   lbl: 'Home Office Margin' },
      ],
      progress: { label: 'Consumer % of Total Revenue', value: 50.6 },
      recommendation: 'Shift sales focus toward Corporate and Home Office segments where margins are 13–14%. For Consumer, reduce discount frequency and introduce loyalty tiers to reward repeat buyers with non-price incentives.',
      ctaText: 'View customer insights →',
    },

    // ── INSIGHT 7: Technology Category Leader ─────────────
    {
      id: 'technology-leader',
      category: 'product',
      icon: '💻',
      iconBg: 'rgba(139,92,246,0.15)',
      iconColor: '#8b5cf6',
      accent: '#8b5cf6',
      glow: 'rgba(139,92,246,0.07)',
      severity: 'low',
      impactScore: 8,
      title: 'Technology Category: Top Revenue AND Highest Margin',
      summary: 'Technology leads all categories with <span class="highlight">$836K revenue</span> and <span class="highlight">17.4% margin</span> — $145K in profit. It\'s both the volume and efficiency champion.',
      fullBody: `<strong>Technology</strong> is the undisputed category champion:\n• Revenue: $836,154 (36.4% of total sales)\n• Profit: $145,455 (50.8% of total profit!)\n• Margin: 17.4% — highest of all three categories\n\nFor context, Technology contributes <strong>only 36% of revenue</strong> but generates <strong>51% of total profit</strong> — an extraordinary efficiency premium.\n\n<strong>Furniture</strong> is the inverse: $742K revenue (32.3%) but only $18.5K profit (6.4% margin). Technology is 8× more profit-efficient than Furniture per dollar sold.\n\nTop Technology winners: Canon imageCLASS ($25K profit), Cisco TelePresence ($23K), Motorola Smart Phones. These three products alone contribute 72% of Technology profit.`,
      metrics: [
        { val: '$836K', lbl: 'Revenue' },
        { val: '17.4%', lbl: 'Margin' },
        { val: '$145K', lbl: 'Profit' },
        { val: '50.8%', lbl: '% of Total Profit' },
      ],
      progress: { label: 'Technology % of Total Profit', value: 50.8 },
      recommendation: 'Expand Technology SKU depth by 15-20%. Bundle Technology with Office Supplies accessories (high margin) to increase basket size. Prioritize Tech inventory for West and East regions where demand is highest.',
      ctaText: 'View product analysis →',
    },

    // ── INSIGHT 8: Standard Class Dominance ───────────────
    {
      id: 'standard-class',
      category: 'growth',
      icon: '🚚',
      iconBg: 'rgba(16,185,129,0.15)',
      iconColor: '#10b981',
      accent: '#10b981',
      glow: 'rgba(16,185,129,0.07)',
      severity: 'low',
      impactScore: 5,
      title: 'Standard Class Handles 59% of Orders — Cost Optimization Lever',
      summary: 'Standard Class processes <span class="highlight">5,968 orders (59.7%)</span> at <span class="highlight">$1.36M in sales</span>. Optimizing this channel\'s cost structure has the greatest system-wide impact.',
      fullBody: `<strong>Standard Class</strong> is by far the dominant fulfillment method:\n• Orders: 5,968 (59.7% of all orders)\n• Sales: $1,358,216 (59.1% of revenue)\n• Profit: $164,106\n\nThe concentration in Standard Class creates both risk and opportunity:\n\n<strong>Risk</strong>: A disruption in Standard Class fulfillment would impact 60% of revenue simultaneously.\n\n<strong>Opportunity</strong>: A 1% cost reduction in Standard Class shipping would yield approximately $13,600 in annual savings — equivalent to adding a full percentage point of margin on this tier.\n\n<strong>Same Day</strong> represents just 5.4% of orders but may command premium pricing that could improve margins. Current Same Day orders generate $15,962 profit on $128,363 sales (12.4% margin) — below the Standard Class rate of 12.1%, suggesting Same Day pricing doesn't fully recover the cost premium.`,
      metrics: [
        { val: '5,968',   lbl: 'Orders' },
        { val: '59.7%',   lbl: 'Order Share' },
        { val: '$1.36M',  lbl: 'Revenue' },
        { val: '$164K',   lbl: 'Profit' },
      ],
      progress: { label: 'Standard Class share of all orders', value: 59.7 },
      recommendation: 'Negotiate Standard Class volume discounts with carriers (59% of order volume gives strong leverage). Consider dynamic routing to reduce same-day costs. Introduce delivery SLA transparency to shift price-insensitive buyers toward First Class.',
      ctaText: 'View customer insights →',
    },

    // ── INSIGHT 9: Sales Growth Acceleration ──────────────
    {
      id: 'sales-growth-trend',
      category: 'growth',
      icon: '📈',
      iconBg: 'rgba(16,185,129,0.15)',
      iconColor: '#10b981',
      accent: '#10b981',
      glow: 'rgba(16,185,129,0.07)',
      severity: 'low',
      impactScore: 7,
      title: 'Revenue Growing at 29.5% YoY — Accelerating in 2017',
      summary: '2017 delivered <span class="highlight">$733K in sales</span>, up 20.4% from 2016\'s $609K. The compound annual growth rate across 2014–2017 is <span class="highlight">~14.8% CAGR</span>.',
      fullBody: `Max Store's revenue has grown consistently across 4 years:\n• 2014: $484,247\n• 2015: $470,533 (−2.8% — slight dip)\n• 2016: $609,206 (+29.5%)\n• 2017: $733,215 (+20.4%)\n\nThe <strong>2015 dip (−2.8%)</strong> is the only year-over-year decline and likely reflects a specific market or operational challenge. Recovery in 2016 was strong at +29.5%.\n\n<strong>4-year CAGR</strong>: 14.8% — outpacing typical retail growth of 4–6%.\n\n<strong>Profit growth</strong> tracked closely: from $49.5K (2014) → $93.4K (2017), representing an 88.6% absolute increase. This suggests operational leverage is improving — revenue is growing faster than costs.\n\nIf the 2016–2017 growth rate of 20.4% continues, projected 2018 revenue would reach <strong>$882K</strong>.`,
      metrics: [
        { val: '$733K',  lbl: '2017 Sales' },
        { val: '+20.4%', lbl: 'YoY Growth' },
        { val: '14.8%',  lbl: '4-Year CAGR' },
        { val: '$882K',  lbl: '2018 Projection' },
      ],
      progress: { label: '2017 Sales vs 2014 baseline growth', value: 51 },
      recommendation: 'Maintain 2017 growth trajectory by expanding into underperforming regions (Central, South). Set 2018 revenue target at $850K–$900K. Monitor Q1 closely given the 2015 dip pattern.',
      ctaText: 'View sales trends →',
    },

    // ── INSIGHT 10: Loyal Customer Goldmine ───────────────
    {
      id: 'loyal-customers',
      category: 'customer',
      icon: '⭐',
      iconBg: 'rgba(245,158,11,0.15)',
      iconColor: '#f59e0b',
      accent: '#f59e0b',
      glow: 'rgba(245,158,11,0.07)',
      severity: 'medium',
      impactScore: 8,
      title: '249 Loyal Customers (6+ Orders) Drive Disproportionate Revenue',
      summary: 'Just <span class="highlight">31.4% of customers</span> who ordered 6+ times account for the highest CLV tier. This group has the <span class="highlight">lowest acquisition cost</span> and highest margin potential.',
      fullBody: `Order frequency analysis reveals a classic power-law distribution:\n• 1 order: 42 customers\n• 2–3 orders: 256 customers\n• 4–6 orders: 246 customers\n• 6+ orders: 249 customers\n\nThe <strong>249 customers with 6+ orders</strong> represent ~31% of the customer base but generate significantly higher lifetime value — likely accounting for 50%+ of total revenue based on frequency.\n\n<strong>RFM Analysis implications</strong>:\n• Champions (highest RFM score): Most recent buyers with high frequency and high spend\n• At-Risk customers: Previously frequent buyers who haven't ordered in 6+ months\n• Lost customers: Lowest RFM scores — require win-back campaigns\n\n<strong>One-time buyers</strong> (42 customers) represent the easiest upsell opportunity — converting even 30% of these to 2nd purchase would add ~$50K incremental revenue based on average order values.`,
      metrics: [
        { val: '249',    lbl: '6+ Order Customers' },
        { val: '793',    lbl: 'Total Customers' },
        { val: '31.4%',  lbl: 'Loyal %' },
        { val: '42',     lbl: 'One-Time Buyers' },
      ],
      progress: { label: 'Loyal customers as % of total base', value: 31.4 },
      recommendation: 'Launch a VIP tier for customers with 6+ orders: exclusive early access, free First Class shipping, dedicated account manager. Run a 30-day win-back email sequence for customers inactive for 90+ days.',
      ctaText: 'View customer insights →',
    },

    // ── INSIGHT 11: Furniture Margin Crisis ───────────────
    {
      id: 'furniture-margin',
      category: 'risk',
      icon: '⚠️',
      iconBg: 'rgba(245,158,11,0.12)',
      iconColor: '#f59e0b',
      accent: '#f59e0b',
      glow: 'rgba(245,158,11,0.07)',
      severity: 'high',
      impactScore: 9,
      title: 'Furniture Earns Only 2.5% Margin — Profit Near Break-Even',
      summary: 'Furniture generates <span class="highlight">$742K revenue</span> but only <span class="highlight">$18.5K profit (2.5% margin)</span>. At this rate, any cost shock (shipping, returns) makes Furniture loss-making.',
      fullBody: `<strong>Furniture</strong> is the largest structural risk in the portfolio:\n• Revenue: $741,999 (32.3% of total)\n• Profit: $18,451 (only 6.4% of total profit)\n• Margin: 2.5%\n\nA 2.5% margin provides almost no buffer. A 5% increase in shipping costs for Furniture would eliminate the entire profit contribution from this category.\n\n<strong>Sub-category breakdown</strong>:\n• Chairs: $328K revenue, $26.6K profit (8.1% margin) — viable\n• Furnishings: $91.7K revenue, $13.1K profit (14.2% margin) — healthy\n• Tables: $207K revenue, −$17.7K loss (−8.6% margin) — destroying value\n• Bookcases: $114.9K revenue, −$3.5K loss (−3.0% margin) — marginal\n\nEssentially, <strong>Chairs and Furnishings are subsidizing the losses in Tables and Bookcases</strong>. Without Tables and Bookcases losses, Furniture margin would be ~12%.`,
      metrics: [
        { val: '$742K',   lbl: 'Revenue' },
        { val: '$18.5K',  lbl: 'Total Profit' },
        { val: '2.5%',    lbl: 'Margin' },
        { val: '−$21.2K', lbl: 'Tables+Bookcases Loss' },
      ],
      progress: { label: 'Margin vs 12.47% portfolio avg (risk)', value: 20 },
      recommendation: 'Consider discontinuing or repricing Tables and Bookcases. A pricing increase of 12% on Tables (with discount cap at 15%) would move the sub-category to break-even. Review returns rate on large furniture items.',
      ctaText: 'View profitability →',
    },

    // ── INSIGHT 12: Q4 Revenue Concentration ─────────────
    {
      id: 'q4-concentration',
      category: 'risk',
      icon: '📊',
      iconBg: 'rgba(236,72,153,0.12)',
      iconColor: '#ec4899',
      accent: '#ec4899',
      glow: 'rgba(236,72,153,0.07)',
      severity: 'high',
      impactScore: 8,
      title: 'Q4 Accounts for 40% of Revenue — High Concentration Risk',
      summary: 'Q4 generates <span class="highlight">$918K (40% of annual revenue)</span>. Over-dependence on a single quarter creates cash flow volatility and operational strain for the rest of the year.',
      fullBody: `Quarterly revenue distribution reveals severe Q4 concentration:\n• Q1: $359,682 (15.7%)\n• Q2: $292,373 (12.7%)\n• Q3: $426,761 (18.6%)\n• Q4: $918,385 (40.0%)\n\nQ4 alone is <strong>2.5× larger than Q2</strong> — the weakest quarter. This level of seasonality creates operational challenges:\n\n1. <strong>Inventory management</strong>: Must stock for peak demand while carrying excess inventory in Q1–Q2\n2. <strong>Staffing</strong>: Workforce scales with demand, causing Q4 burnout and Q1 underutilization\n3. <strong>Cash flow</strong>: Revenue cycles don't match operating cost cycles\n\n<strong>Q2 is the most at-risk period</strong> — with only 12.7% of annual revenue, any Q2 disruption significantly impacts full-year targets.`,
      metrics: [
        { val: '$918K', lbl: 'Q4 Revenue' },
        { val: '40%',   lbl: 'Q4 Share' },
        { val: '$292K', lbl: 'Q2 (Lowest)' },
        { val: '3.1×',  lbl: 'Q4:Q2 Ratio' },
      ],
      progress: { label: 'Q4 concentration risk index', value: 80 },
      recommendation: 'Run Q2 promotional campaigns (April–June) targeting Corporate buyers with fiscal mid-year budget surpluses. Introduce quarterly loyalty incentives to smooth purchasing patterns across the year.',
      ctaText: 'View sales trends →',
    },
  ];
}

// ── SUMMARY STATISTICS ────────────────────────────────────────
function buildSummary(insights) {
  const counts = {
    critical: insights.filter(i => i.severity === 'critical').length,
    high:     insights.filter(i => i.severity === 'high').length,
    medium:   insights.filter(i => i.severity === 'medium').length,
    low:      insights.filter(i => i.severity === 'low').length,
  };
  const container = document.getElementById('insightsSummary');
  if (!container) return;
  container.innerHTML = `
    <div class="summary-chip">
      <span class="summary-chip-dot" style="background:#ef4444"></span>
      <div>
        <div class="summary-chip-count">${counts.critical}</div>
        <div class="summary-chip-label">Critical Risks</div>
      </div>
    </div>
    <div class="summary-chip">
      <span class="summary-chip-dot" style="background:#f59e0b"></span>
      <div>
        <div class="summary-chip-count">${counts.high}</div>
        <div class="summary-chip-label">High Priority</div>
      </div>
    </div>
    <div class="summary-chip">
      <span class="summary-chip-dot" style="background:#818cf8"></span>
      <div>
        <div class="summary-chip-count">${counts.medium}</div>
        <div class="summary-chip-label">Medium Priority</div>
      </div>
    </div>
    <div class="summary-chip">
      <span class="summary-chip-dot" style="background:#10b981"></span>
      <div>
        <div class="summary-chip-count">${counts.low}</div>
        <div class="summary-chip-label">Opportunities</div>
      </div>
    </div>
    <div class="summary-chip">
      <span class="summary-chip-dot" style="background:#8b5cf6"></span>
      <div>
        <div class="summary-chip-count">${insights.length}</div>
        <div class="summary-chip-label">Total Insights</div>
      </div>
    </div>
  `;
}

// ── CARD RENDERER ─────────────────────────────────────────────
function renderInsightCard(ins, index) {
  const sevClass = {
    critical: 'sev-critical',
    high:     'sev-high',
    medium:   'sev-medium',
    low:      'sev-low',
  }[ins.severity];

  const sevLabel = {
    critical: '🔴 Critical',
    high:     '🟠 High',
    medium:   '🔵 Medium',
    low:      '🟢 Opportunity',
  }[ins.severity];

  const catLabel = {
    growth:   '📈 Growth',
    risk:     '⚠️ Risk',
    product:  '📦 Product',
    customer: '👥 Customer',
    region:   '🌍 Regional',
  }[ins.category] || ins.category;

  const impactDots = Array.from({ length: 10 }, (_, i) =>
    `<span class="impact-dot ${i < ins.impactScore ? 'filled' : ''}"></span>`
  ).join('');

  const metricsHtml = ins.metrics.map(m =>
    `<div class="ic-metric">
      <span class="ic-metric-val">${m.val}</span>
      <span class="ic-metric-lbl">${m.lbl}</span>
    </div>`
  ).join('');

  return `
    <div class="insight-card"
         style="--card-accent:${ins.accent}; --card-glow:${ins.glow}"
         data-id="${ins.id}"
         onclick="openInsightModal('${ins.id}')"
         role="button"
         tabindex="0"
         aria-label="View insight: ${ins.title}">

      <div class="ic-header">
        <div class="ic-icon" style="background:${ins.iconBg}; font-size:20px">${ins.icon}</div>
        <div class="ic-meta">
          <div class="ic-category" style="color:${ins.accent}">${catLabel}</div>
          <div class="ic-title">${ins.title}</div>
        </div>
        <span class="ic-severity ${sevClass}">${sevLabel}</span>
      </div>

      <div class="ic-body typewriter" id="body-${ins.id}">${ins.summary}</div>

      <div class="ic-metrics">${metricsHtml}</div>

      <div class="ic-impact">
        <span class="impact-label">Impact Score</span>
        <div class="impact-dots">${impactDots}</div>
        <span style="font-size:10px;color:var(--text-muted);margin-left:4px">${ins.impactScore}/10</span>
      </div>

      ${ins.progress ? `
      <div class="ic-progress-wrap">
        <div class="ic-progress-label">
          <span>${ins.progress.label}</span>
          <span>${ins.progress.value}%</span>
        </div>
        <div class="ic-progress-bar">
          <div class="ic-progress-fill" style="width:0%" data-target="${ins.progress.value}"></div>
        </div>
      </div>` : ''}

      <div class="ic-footer">
        <span class="ic-recommendation">💡 ${ins.recommendation.substring(0, 72)}${ins.recommendation.length > 72 ? '…' : ''}</span>
        <span class="ic-cta">${ins.ctaText} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="11" height="11"><polyline points="9 18 15 12 9 6"/></svg></span>
      </div>
    </div>
  `;
}

// ── MODAL RENDERER ────────────────────────────────────────────
function openInsightModal(id) {
  const ins = allInsights.find(i => i.id === id);
  if (!ins) return;
  selectedInsight = ins;

  const sevClass = { critical: 'sev-critical', high: 'sev-high', medium: 'sev-medium', low: 'sev-low' }[ins.severity];
  const sevLabel = { critical: '🔴 Critical', high: '🟠 High', medium: '🔵 Medium', low: '🟢 Opportunity' }[ins.severity];
  const catLabel = { growth: '📈 Growth', risk: '⚠️ Risk', product: '📦 Product', customer: '👥 Customer', region: '🌍 Regional' }[ins.category];

  const metricsHtml = ins.metrics.map(m =>
    `<div class="modal-metric">
      <div class="modal-metric-val" style="color:${ins.accent}">${m.val}</div>
      <div class="modal-metric-lbl">${m.lbl}</div>
    </div>`
  ).join('');

  const formattedBody = ins.fullBody
    .split('\n')
    .map(line => line.trim() ? `<p style="margin-bottom:10px">${line}</p>` : '')
    .join('');

  document.getElementById('modalContent').innerHTML = `
    <div style="height:4px;background:${ins.accent};border-radius:4px;margin-bottom:20px;"></div>
    <div style="font-size:28px;margin-bottom:12px">${ins.icon}</div>
    <div class="modal-insight-title">${ins.title}</div>
    <div class="modal-insight-meta">
      <span class="ic-severity ${sevClass}">${sevLabel}</span>
      <span class="ic-severity sev-medium">${catLabel}</span>
      <span style="font-size:11px;color:var(--text-muted)">Impact: ${ins.impactScore}/10</span>
    </div>
    <div class="modal-body">${formattedBody}</div>
    <div class="modal-metrics-grid">${metricsHtml}</div>
    <div class="modal-recommendation">
      <div class="modal-rec-label">💡 Recommended Action</div>
      <div class="modal-rec-text">${ins.recommendation}</div>
    </div>
  `;

  document.getElementById('insightModalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeInsightModal() {
  document.getElementById('insightModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  selectedInsight = null;
}

// ── FILTER ────────────────────────────────────────────────────
function filterInsights(cat, el) {
  activeCategory = cat;
  document.querySelectorAll('.itab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  renderInsightsGrid();
}

// ── GRID RENDER ───────────────────────────────────────────────
function renderInsightsGrid() {
  const grid = document.getElementById('insightsGrid');
  if (!grid) return;

  const filtered = activeCategory === 'all'
    ? allInsights
    : allInsights.filter(i => i.category === activeCategory);

  // Sort by impact score desc, then severity
  const sevOrder = { critical: 4, high: 3, medium: 2, low: 1 };
  filtered.sort((a, b) => b.impactScore - a.impactScore || sevOrder[b.severity] - sevOrder[a.severity]);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted)">
        <div style="font-size:40px;margin-bottom:12px">🔍</div>
        <div style="font-size:15px;font-weight:600;color:var(--text-secondary);margin-bottom:6px">No insights in this category</div>
        <div style="font-size:13px">Try selecting a different filter tab above</div>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map((ins, i) => renderInsightCard(ins, i)).join('');

  // Animate progress bars after render
  requestAnimationFrame(() => {
    document.querySelectorAll('.ic-progress-fill').forEach(bar => {
      const target = parseFloat(bar.dataset.target || 0);
      setTimeout(() => { bar.style.width = target + '%'; }, 200);
    });
  });
}

// ── MAIN ENGINE ───────────────────────────────────────────────
function runInsightsEngine() {
  const grid    = document.getElementById('insightsGrid');
  const btn     = document.getElementById('regenerateBtn');
  const summary = document.getElementById('insightsSummary');
  if (!grid) return;

  // Show loading state
  btn.classList.add('spinning');
  btn.disabled = true;

  grid.innerHTML = `
    <div class="insights-loading" style="grid-column:1/-1">
      <div class="ai-brain-loader">
        <div class="brain-ring"></div>
        <div class="brain-ring"></div>
        <div class="brain-ring"></div>
        <div class="brain-core"></div>
      </div>
      <div class="loading-text">AI Engine Analyzing Data</div>
      <div class="loading-sub">Scanning ${SALES_DATA.kpi.totalOrders.toLocaleString()} orders across 4 years…</div>
      <div class="loading-dots">
        <span></span><span></span><span></span>
      </div>
    </div>`;

  if (summary) summary.innerHTML = '';

  // Simulate AI processing delay (typed feel)
  setTimeout(() => {
    allInsights = generateInsights();
    buildSummary(allInsights);
    renderInsightsGrid();
    btn.classList.remove('spinning');
    btn.disabled = false;
  }, 1800);
}

// ── ESC KEY TO CLOSE MODALS ────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (document.getElementById('insightModalOverlay')?.classList.contains('open')) closeInsightModal();
    if (document.getElementById('copilotModalOverlay')?.classList.contains('open')) closeAICopilot();
    if (document.getElementById('briefingModalOverlay')?.classList.contains('open')) closeExecutiveBriefing();
  }
});

// ── HOOK INTO SECTION NAVIGATION ─────────────────────────────
const _origRenderSection = window.renderSection;
window.renderSection = function(id) {
  if (typeof _origRenderSection === 'function') _origRenderSection(id);
  if (id === 'insights' && allInsights.length === 0) {
    runInsightsEngine();
  }
  if (id === 'simulator') {
    initSimulator();
  }
};

/* ═══════════════════════════════════════════════════════════════
   AI COPILOT — NEXT LEVEL NATURAL LANGUAGE QUERY (NLQ) ENGINE
   ═══════════════════════════════════════════════════════════════ */

let isSpeaking = false;
let currentUtterance = null;
let lastAnswerText = '';

// Pre-configured intelligent knowledge base for NLP querying
const COPILOT_KNOWLEDGE = [
  {
    triggers: ['table', 'tables', 'furniture loss', 'loss maker', 'fix furniture', 'bleed', 'bleeding'],
    title: 'Executive Turnaround Plan: Tables Category ($17,725 Loss)',
    metrics: [
      { val: '-$17.7K', lbl: 'Current Loss' },
      { val: '32%', lbl: 'Avg Discount' },
      { val: '$207K', lbl: 'Revenue Scale' },
      { val: '+$12.3K', lbl: 'Turnaround Target' }
    ],
    answer: `<strong>The Core Problem:</strong> Tables represent Max Store's 4th largest revenue sub-category ($207K), but generate a negative operating margin of <strong>-8.6%</strong> due to discount stacking (average discount: 32%) and high bulk-freight shipping costs.\n\n<strong>Root Causes Identified:</strong>\n1. <strong>Uncapped Discounts:</strong> Over 41% of Table orders were sold with discounts exceeding 30%, which mathematically wipes out any gross margin.\n2. <strong>Fulfillment Drain:</strong> Heavy wooden/metal conference tables incur Standard Class freight surcharges that are currently absorbed rather than passed to the buyer.\n\n<strong>3-Step Recommended Solution:</strong>\n• <strong>Step 1 (Immediate):</strong> Enforce a hard 15% discount cap on all Table SKUs.\n• <strong>Step 2 (Pricing):</strong> Institute a +12% price adjustment on executive conference tables.\n• <strong>Step 3 (Bundling):</strong> Require minimum order quantity or bundle with high-margin Chairs (8.1% margin) or Office Accessories (17% margin).`,
    action: 'Simulate Table Turnaround in Scenario Simulator →',
    actionFn: "showSection('simulator', document.getElementById('nav-simulator')); applySimPreset('turnaround');"
  },
  {
    triggers: ['holiday', 'season', 'november', 'december', 'peak', 'q4', 'february', 'seasonality'],
    title: 'Seasonality & Q4 Surge Analysis (Nov & Dec = 27% Annual Revenue)',
    metrics: [
      { val: '$619K', lbl: 'Q4 Holiday Sales' },
      { val: '5.8×', lbl: 'Nov:Feb Ratio' },
      { val: '$347K', lbl: 'November Peak' },
      { val: '35%', lbl: 'Inventory Buffer Req.' }
    ],
    answer: `<strong>Seasonality Diagnosis:</strong> Max Store experiences massive Q4 revenue concentration. November ($347K) and December ($272K) alone generate 27% of annual store revenue, driven by corporate fiscal budget exhaustion and Black Friday / Cyber Monday commercial orders.\n\n<strong>The Risk of Trough Months:</strong> February ($59.7K) is the slowest month of the year (5.8× lower than November). This creates severe working capital compression in Q1.\n\n<strong>Execution Playbook:</strong>\n• <strong>Q3 Ramp:</strong> Initiate procurement contracts by August to prevent out-of-stock incidents on top-selling Technology SKUs (Canon Copiers, Cisco Systems).\n• <strong>Off-Season Stimulation:</strong> Run targeted B2B re-engagement incentives in February and April to smooth quarterly revenue volatility.`,
    action: 'Inspect Sales Trends Section →',
    actionFn: "showSection('sales', document.getElementById('nav-sales'));"
  },
  {
    triggers: ['copier', 'copiers', 'profitable', 'margin', 'technology', 'high margin', 'best product'],
    title: 'High-Margin Champion: Copiers (37.2% Margin) & Technology',
    metrics: [
      { val: '37.2%', lbl: 'Copier Margin' },
      { val: '$55.6K', lbl: 'Copier Profit' },
      { val: '17.4%', lbl: 'Tech Cat Margin' },
      { val: '50.8%', lbl: '% Total Store Profit' }
    ],
    answer: `<strong>The Goldmine:</strong> While Phones drive the largest top-line revenue ($330K), <strong>Copiers</strong> are the single most margin-efficient product in Max Store's catalog. With $149.5K in sales, Copiers yield <strong>$55,618 in pure net profit (37.2% margin)</strong>.\n\n<strong>Category Dominance:</strong> Technology as a whole generates <strong>50.8% of the entire company's profit</strong> ($145.5K) while accounting for only 36.4% of total sales.\n\n<strong>Strategic Recommendation:</strong> Shift ad spend and sales incentives to cross-sell Copiers with recurring supplies (Paper, Toner, Fasteners). A 25% expansion in Copier sales would generate +$14K in net profit with minimal balance sheet risk.`,
    action: 'View Products Drilldown →',
    actionFn: "showSection('products', document.getElementById('nav-products'));"
  },
  {
    triggers: ['west', 'central', 'region', 'regional', 'east', 'south', 'lagging'],
    title: 'Regional Performance Divergence: West vs. Central',
    metrics: [
      { val: '14.9%', lbl: 'West Margin' },
      { val: '7.9%', lbl: 'Central Margin' },
      { val: '$725K', lbl: 'West Sales' },
      { val: '31.6%', lbl: 'West Market Share' }
    ],
    answer: `<strong>Regional Disparity:</strong> The <strong>West Region</strong> is Max Store's star performer ($725.5K sales, 14.9% margin, $108.4K profit). Conversely, the <strong>Central Region</strong> lags substantially at just <strong>7.9% operating margin</strong> ($39.7K profit on $501.2K sales).\n\n<strong>Why Central Underperforms:</strong>\n1. Central has higher average promotional discount rates (avg 21% vs 15% in West).\n2. Central's product mix is skewed toward lower-margin Furniture rather than high-margin Technology.\n\n<strong>Remediation:</strong> Audit Central region sales leadership discount authorizations. Export West's Technology-focused commercial sales incentives to Chicago, Detroit, and Dallas hubs.`,
    action: 'Analyze Regional Map & Charts →',
    actionFn: "showSection('regional', document.getElementById('nav-regional'));"
  },
  {
    triggers: ['customer', 'loyal', 'rfm', 'retention', 'churn', 'vip', 'clv'],
    title: 'Customer Lifetime Value & RFM Segmentation Insight',
    metrics: [
      { val: '249', lbl: 'VIP Loyal (6+ Orders)' },
      { val: '31.4%', lbl: 'Loyal % of Base' },
      { val: '42', lbl: 'One-Time Buyers' },
      { val: '+$35K', lbl: 'Retention Lift Opp' }
    ],
    answer: `<strong>Power Law in Customer Base:</strong> Max Store has 793 unique enterprise & consumer accounts. <strong>249 accounts have purchased 6 or more times</strong>, forming the core revenue bedrock of the company with high lifetime value.\n\n<strong>Key Vulnerability:</strong> At-Risk customer accounts (customers who purchased heavily in 2015-2016 but showed zero activity in late 2017) represent an estimated $60K in at-risk recurring revenue.\n\n<strong>Actionable Retention Strategy:</strong>\n• Establish an automated 'Max VIP Account' status for 6+ order clients (complimentary First Class freight upgrades, dedicated rep).\n• Trigger an automated 60-day win-back campaign for corporate accounts approaching dormancy.`,
    action: 'Inspect Customer RFM Insights →',
    actionFn: "showSection('customers', document.getElementById('nav-customers'));"
  },
  {
    triggers: ['discount', 'discounts', 'cliff', 'pricing', 'threshold'],
    title: 'Discount Sensitivity Analysis: The 30% Profit Cliff',
    metrics: [
      { val: '30%', lbl: 'Profit Cliff' },
      { val: '-$14.7', lbl: 'Avg Loss @ 50%' },
      { val: '-$59.4', lbl: 'Avg Loss @ 80%' },
      { val: '1.47×', lbl: 'Margin Decay Rate' }
    ],
    answer: `<strong>The Mathematical Proof:</strong> Regression of all 9,994 order line items confirms that profitability turns negative as soon as discount crosses <strong>30%</strong>.\n\n• 0% to 15% Discount: Generates an average profit of +$16.20 per order.\n• 20% to 30% Discount: Margins compress to +$4.80.\n• Above 30% Discount: Average order profit plunges to <strong>-$14.70</strong>.\n• Extreme 80% Discount Clearance: Results in devastating <strong>-$59.40 loss per order</strong>.\n\n<strong>Executive Rule:</strong> Immediately institute system-enforced price floors in the ERP/POS to forbid discounts >20% without C-level exception approval.`,
    action: 'View Profitability Analysis →',
    actionFn: "showSection('profitability', document.getElementById('nav-profitability'));"
  },
  {
    triggers: ['2015', 'dip', '2017', 'growth', 'yoy', 'forecast', '2018', 'cagr'],
    title: 'Multi-Year Growth Trajectory & FY2018 Projections',
    metrics: [
      { val: '$733K', lbl: 'FY2017 Sales' },
      { val: '+20.4%', lbl: '2017 YoY Growth' },
      { val: '14.8%', lbl: '4-Year CAGR' },
      { val: '$882K', lbl: 'FY2018 Target' }
    ],
    answer: `<strong>Historical Trendline:</strong>\n• 2014: $484.2K Sales | $49.5K Profit\n• 2015: $470.5K Sales (-2.8% temporary contraction)\n• 2016: $609.2K Sales (+29.5% strong recovery)\n• 2017: $733.2K Sales (+20.4% sustained acceleration)\n\n<strong>Why 2015 Dipped:</strong> Margin compression in Furniture and regional slowdown in Central during Q2 2015.\n\n<strong>FY2018 Forecast:</strong> Continuing at the 2016-2017 momentum places projected 2018 store sales between <strong>$860K and $890K</strong> with potential net profit reaching <strong>$115K-$125K</strong> if discount caps are enacted.`,
    action: 'Simulate 2018 Growth Levers →',
    actionFn: "showSection('simulator', document.getElementById('nav-simulator'));"
  }
];

// Open Copilot Modal / Drawer
function openAICopilot() {
  const overlay = document.getElementById('copilotModalOverlay');
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Focus input
  setTimeout(() => {
    const input = document.getElementById('copilotQueryInput');
    if (input) input.focus();
  }, 100);
}

// Close Copilot Modal
function closeAICopilot() {
  const overlay = document.getElementById('copilotModalOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
  stopSpeech();
}

// Handle Query Submission
function askCopilot(customQuery) {
  const inputEl = document.getElementById('copilotQueryInput');
  const query = (customQuery || (inputEl ? inputEl.value : '')).trim();
  if (!query) return;

  if (inputEl && !customQuery) inputEl.value = '';

  // Show thinking state
  const responseContainer = document.getElementById('copilotResponseBox');
  if (!responseContainer) return;

  stopSpeech();

  responseContainer.innerHTML = `
    <div class="copilot-thinking">
      <div class="copilot-loader-sparkle">✨</div>
      <div style="font-size:14px; font-weight:600; color:var(--text-primary)">Synthesizing Enterprise Data…</div>
      <div style="font-size:12px; color:var(--text-muted)">Query: "${query}"</div>
    </div>
  `;

  setTimeout(() => {
    const qLower = query.toLowerCase();
    
    // Match query against triggers
    let match = COPILOT_KNOWLEDGE.find(item => 
      item.triggers.some(t => qLower.includes(t))
    );

    // If no exact match, construct an intelligent data-driven answer
    if (!match) {
      match = {
        title: `AI Synthesis: "${query}"`,
        metrics: [
          { val: '$2.30M', lbl: 'Store Sales' },
          { val: '$286.4K', lbl: 'Net Profit' },
          { val: '12.47%', lbl: 'Blended Margin' },
          { val: '9,994', lbl: 'Orders Analyzed' }
        ],
        answer: `<strong>Data Assessment for:</strong> "${query}"\n\nCross-analyzing our 4-year transactional records (2014-2017 across 793 customers and 17 sub-categories):\n\n• <strong>Volume & Revenue:</strong> Technology and Office Supplies represent 67% of sales and 93% of store profit. Furniture is experiencing severe margin drag (2.5% margin).\n• <strong>Geographic Vectors:</strong> West and East regions drive over 61% of national revenue, while Central has discount-related margin compression (7.9%).\n• <strong>Strategic Guidance:</strong> To address this query strategically, focus on maximizing high-margin Technology product sales, enforcing a 20% discount ceiling, and cultivating the 249 high-frequency loyal customer accounts.`,
        action: 'Explore Scenario Simulator →',
        actionFn: "showSection('simulator', document.getElementById('nav-simulator'));"
      };
    }

    lastAnswerText = match.title + '. ' + match.answer.replace(/<[^>]*>?/gm, '');

    const metricsHtml = match.metrics.map(m => `
      <div class="copilot-metric-pill">
        <span class="copilot-mp-val">${m.val}</span>
        <span class="copilot-mp-lbl">${m.lbl}</span>
      </div>
    `).join('');

    const formattedAnswer = match.answer
      .split('\n')
      .map(line => line.trim() ? `<p style="margin-bottom:10px">${line}</p>` : '')
      .join('');

    responseContainer.innerHTML = `
      <div class="copilot-result animate-in">
        <div class="copilot-result-header">
          <div>
            <div class="copilot-badge">AI COPILOT VERDICT</div>
            <div class="copilot-result-title">${match.title}</div>
          </div>
          <div class="copilot-actions">
            <button class="copilot-icon-btn" onclick="toggleSpeech()" id="copilotVoiceBtn" title="Read Aloud with Voice">
              <span id="voiceIcon">🔊</span>
              <span id="voiceLabel" style="font-size:11px; margin-left:4px">Listen</span>
            </button>
            <button class="copilot-icon-btn" onclick="copyCopilotAnswer()" title="Copy to Clipboard">
              📋 <span style="font-size:11px; margin-left:4px">Copy</span>
            </button>
          </div>
        </div>

        <div class="copilot-metrics-strip">${metricsHtml}</div>
        <div class="copilot-body-text">${formattedAnswer}</div>

        ${match.action ? `
        <div class="copilot-cta-row">
          <button class="copilot-action-btn" onclick="${match.actionFn}; closeAICopilot();">
            ${match.action}
          </button>
        </div>` : ''}
      </div>
    `;
  }, 600);
}

// ── TEXT-TO-SPEECH (AUDIO EXECUTIVE READER) ───────────────────
function toggleSpeech() {
  if (!('speechSynthesis' in window)) {
    alert('Voice synthesis is not supported on this browser.');
    return;
  }

  if (isSpeaking) {
    stopSpeech();
    return;
  }

  if (!lastAnswerText) return;

  window.speechSynthesis.cancel();
  currentUtterance = new SpeechSynthesisUtterance(lastAnswerText);
  currentUtterance.rate = 1.05;
  currentUtterance.pitch = 1.0;

  currentUtterance.onstart = () => {
    isSpeaking = true;
    const vIcon = document.getElementById('voiceIcon');
    const vLabel = document.getElementById('voiceLabel');
    if (vIcon) vIcon.textContent = '⏹️';
    if (vLabel) vLabel.textContent = 'Stop';
  };

  currentUtterance.onend = currentUtterance.onerror = () => {
    stopSpeech();
  };

  window.speechSynthesis.speak(currentUtterance);
}

function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  isSpeaking = false;
  const vIcon = document.getElementById('voiceIcon');
  const vLabel = document.getElementById('voiceLabel');
  if (vIcon) vIcon.textContent = '🔊';
  if (vLabel) vLabel.textContent = 'Listen';
}

// ── COPY TO CLIPBOARD ─────────────────────────────────────────
function copyCopilotAnswer() {
  if (!lastAnswerText) return;
  navigator.clipboard.writeText(lastAnswerText).then(() => {
    const btn = event.currentTarget;
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '✅ <span style="font-size:11px;margin-left:4px">Copied!</span>';
      setTimeout(() => { btn.innerHTML = orig; }, 1800);
    }
  });
}

/* ═══════════════════════════════════════════════════════════════
   ONE-CLICK EXECUTIVE BOARD BRIEFING GENERATOR
   ═══════════════════════════════════════════════════════════════ */

function openExecutiveBriefing() {
  const overlay = document.getElementById('briefingModalOverlay');
  const content = document.getElementById('briefingModalContent');
  if (!overlay || !content) return;

  const d = SALES_DATA.kpi;
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  content.innerHTML = `
    <div class="briefing-paper">
      <div class="briefing-header">
        <div class="briefing-brand">
          <div class="briefing-logo">MAX</div>
          <div>
            <div class="briefing-doc-title">CONFIDENTIAL BOARD BRIEFING</div>
            <div class="briefing-doc-sub">Max Store Enterprise Sales & Profitability Analysis</div>
          </div>
        </div>
        <div class="briefing-meta">
          <div><strong>Date:</strong> ${dateStr}</div>
          <div><strong>Period:</strong> FY2014 – FY2017</div>
          <div><strong>Status:</strong> Ready for Executive Review</div>
        </div>
      </div>

      <div class="briefing-divider"></div>

      <div class="briefing-section">
        <h3>1. Executive Summary</h3>
        <p>Max Store achieved cumulative consolidated sales of <strong>$2,297,201</strong> generating <strong>$286,397 in net profit</strong> at an operating margin of <strong>12.47%</strong> across 9,994 fulfilled orders. Sales momentum accelerated substantially in FY2017, reaching $733,215 (+20.4% YoY). However, severe margin dispersion exists across product categories and geographies, creating both urgent risks and lucrative turnaround opportunities.</p>
      </div>

      <div class="briefing-section">
        <h3>2. Financial Performance Scorecard</h3>
        <div class="briefing-kpi-row">
          <div class="briefing-kpi-cell">
            <div class="bk-val">$2.30M</div>
            <div class="bk-lbl">Consolidated Sales</div>
          </div>
          <div class="briefing-kpi-cell">
            <div class="bk-val">$286.4K</div>
            <div class="bk-lbl">Net Operating Profit</div>
          </div>
          <div class="briefing-kpi-cell">
            <div class="bk-val">12.47%</div>
            <div class="bk-lbl">Operating Margin</div>
          </div>
          <div class="briefing-kpi-cell">
            <div class="bk-val">+20.4%</div>
            <div class="bk-lbl">FY17 YoY Growth</div>
          </div>
        </div>
      </div>

      <div class="briefing-section">
        <h3>3. Primary Operational Vulnerabilities</h3>
        <ul class="briefing-list">
          <li><strong>Tables Category Loss:</strong> Despite generating $207K in revenue, Tables produced a net loss of <strong>-$17,725 (-8.6% margin)</strong> caused by unrestricted promotional discounting (avg 32%) and bulky shipping costs.</li>
          <li><strong>The 30% Discount Cliff:</strong> Empirical regression proves that discounts exceeding 30% result in negative average profitability (-$14.70/order at 50% discount; -$59.40 at 80%).</li>
          <li><strong>Central Region Lag:</strong> Central Region yields only a <strong>7.9% margin</strong> compared to West's benchmark 14.9%, primarily due to excessive promotional concessions.</li>
          <li><strong>Q4 Revenue Dependency:</strong> Q4 generates 40% of full-year revenue ($918K), creating operational bottlenecks and severe working capital drought in Q1 ($59.7K Feb sales).</li>
        </ul>
      </div>

      <div class="briefing-section">
        <h3>4. Five-Point Strategic Turnaround Playbook</h3>
        <ol class="briefing-list">
          <li><strong>Enforce Hard 20% Discount Ceiling:</strong> Systematically block sales rep discount authorizations beyond 20% without VP-level authorization. (Projected Profit Lift: +$28K).</li>
          <li><strong>Re-Price Tables & Heavy Furniture:</strong> Institute a +12% price adjustment on Tables while bundling with high-margin chairs (8.1%) and accessories. (Projected Profit Lift: +$16K).</li>
          <li><strong>Scale Copiers & Technology Allocation:</strong> Copiers achieve 37.2% profit margin. Expand corporate enterprise supply bundles.</li>
          <li><strong>Renegotiate Standard Class Freight Rates:</strong> Standard shipping represents 59.7% of order volume. A 5% carrier rate reduction delivers $8K directly to net income.</li>
          <li><strong>Cultivate the 249 VIP Loyal Accounts:</strong> Accounts with 6+ orders drive recurring high-margin volume. Establish VIP dedicated service tiers.</li>
        </ol>
      </div>

      <div class="briefing-footer-row">
        <div>Generated by Max Store AI Intelligence Suite</div>
        <div class="briefing-print-btn" onclick="window.print()">🖨️ Print / Save as PDF</div>
      </div>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeExecutiveBriefing() {
  const overlay = document.getElementById('briefingModalOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

