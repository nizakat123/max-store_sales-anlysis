/* ═══════════════════════════════════════════════════════════
   MAX STORE — SALES DATA
   Superstore dataset aggregated for chart rendering
   ═══════════════════════════════════════════════════════════ */

const SALES_DATA = {
  // ── OVERALL KPIs ─────────────────────────────────────────
  kpi: {
    totalSales:     2297201,
    totalProfit:    286397,
    totalOrders:    9994,
    totalQuantity:  37873,
    uniqueCustomers: 793,
    profitMargin:   12.47,
  },

  // ── YEARLY SUMMARY ───────────────────────────────────────
  yearly: {
    labels: ['2014', '2015', '2016', '2017'],
    sales:  [484247, 470533, 609206, 733215],
    profit: [49544,  61619,  81796,  93439],
    qty:    [7681,   7870,   9764,   10558],
    orders: [2015,   1866,   2880,   3233],
  },

  // ── MONTHLY SUMMARY (aggregated across all years) ─────────
  monthly: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    sales:  [94925, 59751, 205006, 61756, 97739, 132878, 103284, 148806, 174671, 199276, 347039, 272069],
    profit: [11768, 6874, 27115, 5614, 12183, 17290, 11895, 19512, 22614, 27356, 47318, 34858],
  },

  // ── MONTHLY GROWTH RATE ──────────────────────────────────
  growthRate: {
    labels: ['Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan'],
    values: [-37.1, 243.1, -69.9, 58.3, 35.9, -22.3, 44.1, 17.4, 14.1, 74.2, -21.6, -65.2],
  },

  // ── CATEGORY SUMMARY ─────────────────────────────────────
  category: {
    labels:  ['Technology', 'Furniture', 'Office Supplies'],
    sales:   [836154, 741999, 719047],
    profit:  [145455, 18451, 122491],
    margin:  [17.4, 2.5, 17.0],
    colors:  ['#6366f1', '#ec4899', '#10b981'],
  },

  // ── SUB-CATEGORY ─────────────────────────────────────────
  subCategory: {
    labels:  ['Phones','Chairs','Storage','Tables','Binders','Machines','Accessories','Copiers',
               'Bookcases','Appliances','Furnishings','Paper','Envelopes','Labels','Art','Fasteners','Supplies'],
    sales:   [330007,328449,223844,206966,203413,189239,167380,149528,
               114880,107532,91705,78479,16476,12486,27119,3024,46674],
    profit:  [44516,26590,21279,-17725,30221,3385,41937,55618,
               -3473,18138,13059,34054,6964,5546,6528,949,-1189],
    colors:  ['#6366f1','#ec4899','#10b981','#ef4444','#f59e0b','#8b5cf6','#06b6d4','#f97316',
               '#ef4444','#10b981','#94a3b8','#6366f1','#f59e0b','#10b981','#ec4899','#8b5cf6','#ef4444'],
  },

  // ── REGION SUMMARY ───────────────────────────────────────
  region: {
    labels:  ['West', 'East', 'Central', 'South'],
    sales:   [725458, 678781, 501240, 391723],
    profit:  [108418, 91523, 39706, 46749],
    qty:     [11527, 11161, 8252, 6933],
    orders:  [3203, 2848, 2323, 1620],
    colors:  ['#6366f1','#10b981','#f59e0b','#ec4899'],
    margin:  [14.9, 13.5, 7.9, 11.9],
  },

  // ── SEGMENT SUMMARY ──────────────────────────────────────
  segment: {
    labels:  ['Consumer', 'Corporate', 'Home Office'],
    sales:   [1161401, 706146, 429655],
    profit:  [134119,  91979,  60299],
    qty:     [19521,   11866,  6486],
    orders:  [5191,    3020,   1783],
    colors:  ['#6366f1','#10b981','#f59e0b'],
  },

  // ── SHIP MODE ────────────────────────────────────────────
  shipMode: {
    labels:  ['Standard Class', 'Second Class', 'First Class', 'Same Day'],
    sales:   [1358216, 459194, 351428, 128363],
    profit:  [164106,  57360,  48969,  15962],
    orders:  [5968, 1945, 1538, 543],
    colors:  ['#6366f1','#10b981','#f59e0b','#ec4899'],
  },

  // ── QUARTERLY ────────────────────────────────────────────
  quarterly: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    sales:  [359682, 292373, 426761, 918385],
    profit: [45758, 35087, 53921, 151631],
    colors: ['#6366f1','#10b981','#f59e0b','#ec4899'],
  },

  // ── TOP 10 PRODUCTS BY SALES ─────────────────────────────
  top10Sales: {
    labels: [
      'Canon imageCLASS 2200',
      'Fellowes PB500 Punch Machine',
      'Cisco TelePresence EX90',
      'HON 5400 Task Chairs',
      'GBC DocuBind TL300',
      'Cubify CubeX 3D Printer',
      'Motorola Smart Phone',
      'Apple iPhone',
      'Hewlett Packard LaserJet 3310',
      'Brother Fax Machine',
    ],
    values: [61600, 27453, 22639, 21871, 19824, 19149, 17530, 15890, 14732, 13923],
    colors: Array(10).fill('#6366f1'),
  },

  // ── TOP 10 PRODUCTS BY PROFIT ────────────────────────────
  top10Profit: {
    labels: [
      'Canon imageCLASS 2200',
      'Cisco TelePresence EX90',
      'Motorola Smart Phone XT',
      'HP Designjet T520',
      'Fellowes PB500 Punch Machine',
      'GBC DocuBind TL300',
      'Bretford CR4500 Carts',
      'Cubify CubeX 3D Printer',
      'Ativa V4110MDD Shredder',
      'Plantronics CS510',
    ],
    values: [25199, 22638, 17036, 15145, 13946, 11582, 10403, 8879, 8601, 8114],
    colors: Array(10).fill('#10b981'),
  },

  // ── LOSS-MAKING PRODUCTS ─────────────────────────────────
  lossProducts: {
    labels: [
      'Cubify CubeX Double (Loss)',
      'Lexmark MX611dhe',
      'Bevis Round Table',
      'GBC Ibimaster 500',
      'Motorola Razr (Loss)',
      'Eldon Jumbo (Loss)',
      'Ibico EPK-21 Punch',
      'Bush Envoy L-Shaped',
    ],
    values: [-8880, -4590, -4017, -3630, -3490, -2980, -2745, -2381],
    colors: Array(8).fill('#ef4444'),
  },

  // ── SCATTER DATA (sub-category): sales vs profit ─────────
  scatter: [
    { x: 330007, y: 44516,  label: 'Phones',       r: 15 },
    { x: 328449, y: 26590,  label: 'Chairs',        r: 14 },
    { x: 149528, y: 55618,  label: 'Copiers',       r: 10 },
    { x: 167380, y: 41937,  label: 'Accessories',   r: 11 },
    { x: 203413, y: 30221,  label: 'Binders',       r: 13 },
    { x: 223844, y: 21279,  label: 'Storage',       r: 12 },
    { x: 206966, y:-17725,  label: 'Tables',        r: 13 },
    { x: 107532, y: 18138,  label: 'Appliances',    r: 9  },
    { x: 91705,  y: 13059,  label: 'Furnishings',   r: 8  },
    { x: 78479,  y: 34054,  label: 'Paper',         r: 7  },
    { x: 114880, y: -3473,  label: 'Bookcases',     r: 9  },
    { x: 189239, y:  3385,  label: 'Machines',      r: 12 },
  ],

  // ── DISCOUNT IMPACT ──────────────────────────────────────
  discount: {
    labels: ['0%','10%','20%','30%','40%','50%','60%','70%','80%'],
    profit: [17.8, 14.2, 9.1, -1.4, -8.3, -14.7, -23.5, -38.1, -59.4],
  },

  // ── ORDER FREQUENCY ──────────────────────────────────────
  orderFreq: {
    labels: ['1 Order','2 Orders','3 Orders','4 Orders','5 Orders','6+ Orders'],
    values: [42, 113, 143, 137, 109, 249],
    colors: ['#6366f1','#8b5cf6','#10b981','#f59e0b','#ec4899','#06b6d4'],
  },

  // ── SHIP MODE × SEGMENT ─────────────────────────────────
  shipSegment: {
    labels: ['Consumer','Corporate','Home Office'],
    standard: [2983, 1736, 1249],
    second:   [1047, 525,  373],
    first:    [822, 477,  239],
    sameDay:  [339, 282,  122],
  },

  // ── PROFIT MARGIN BY SUB-CATEGORY ────────────────────────
  margin: {
    labels: ['Copiers','Labels','Accessories','Paper','Envelopes','Phones',
             'Binders','Appliances','Art','Furnishings','Fasteners','Chairs',
             'Storage','Bookcases','Supplies','Machines','Tables'],
    values: [37.2, 44.4, 25.1, 43.4, 42.3, 13.5,
             14.9, 16.9, 24.1, 14.2, 31.4, 8.1,
             9.5, -3.0, -2.5, 1.8, -8.6],
    colors: ['#10b981','#10b981','#10b981','#10b981','#10b981','#6366f1',
             '#6366f1','#6366f1','#6366f1','#6366f1','#6366f1','#f59e0b',
             '#f59e0b','#ef4444','#ef4444','#ef4444','#ef4444'],
  },

  // ── REGION × CATEGORY ───────────────────────────────────
  regionCategory: {
    labels: ['West','East','Central','South'],
    technology:     [262038, 239622, 184617, 149877],
    furniture:      [269024, 231073, 140047, 101855],
    officeSupplies: [194396, 208086, 176576, 139991],
  },
};
