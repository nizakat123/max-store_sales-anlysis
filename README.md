# 🏪 Max Store — Sales Performance Analysis

> **An upgraded, production-quality rebuild** of the Superstore Sales Analysis project — featuring an interactive web dashboard, expanded SQL analytics, RFM customer scoring, and professional documentation.

---

## 📸 Dashboard Preview

The interactive dashboard is live in `index.html` — open it in any modern browser (no server required).

---

## 🎯 Project Objective

Perform a deep-dive analysis of 4 years (2014–2017) of retail transactional data for **Max Store**, uncovering:

- Revenue and profit trends across time, region, category and customer segment
- Loss-making products and profitability risk areas
- Discount elasticity and its impact on margins
- Customer lifetime value and RFM segmentation
- Seasonality indices for inventory planning

---

## 🛠️ Tools & Stack

| Tool | Purpose |
|------|---------|
| **SQL Server (T-SQL)** | Data quality checks, KPI aggregation, advanced window function analytics |
| **HTML + CSS + JavaScript** | Interactive web analytics dashboard (no build tools required) |
| **Chart.js v4** | 20+ interactive charts across 6 analytical views |
| **Excel (.xlsx)** | Source dataset |

---

## 📂 Project Structure

```
Max Store Sales Analysis/
├── index.html                   ← Interactive dashboard (open in browser)
├── style.css                    ← Premium dark-mode design system & animations
├── app.js                       ← Dashboard controller & Chart.js renderer
├── data.js                      ← Aggregated sales dataset & metrics
├── insights.js                  ← AI Smart Insights & Copilot NLP engine
├── simulator.js                 ← What-If Scenario Simulator & Forecasting model
├── MaxStore_Sales_Analysis.sql  ← Full SQL analytics (9 sections, 40+ queries)
└── README.md                    ← Project documentation
```

---

## 📊 Dataset

| Column | Description |
|--------|-------------|
| `Order ID` | Unique order identifier |
| `Order Date / Ship Date` | Transaction & fulfillment dates |
| `Ship Mode` | Standard / Second / First / Same Day |
| `Customer ID / Name` | Customer reference |
| `Segment` | Consumer · Corporate · Home Office |
| `Region / State / City` | Geographic hierarchy |
| `Category / Sub-Category` | Product taxonomy |
| `Product Name` | Individual SKU name |
| `Sales` | Transaction revenue ($) |
| `Quantity` | Units sold |
| `Discount` | Discount rate applied (0.0 – 0.8) |
| `Profit` | Net profit after costs & discounts |

**Dataset:** `DataSet/Superstore_Orders_Data.xlsx` · **Records:** 9,994 · **Period:** Jan 2014 – Dec 2017

---

## 🖥️ Interactive Dashboard — 8 Analytical Views

### 1️⃣ Overview
- 6 animated KPI cards (Sales, Profit, Orders, Quantity, Customers, Margin)
- Monthly Sales & Profit trend line chart
- Category revenue donut chart
- Segment bar chart, Ship Mode horizontal bar, Quarterly donut
- **Sidebar filters**: Year · Region · Segment (live KPI update)

### 2️⃣ Sales Trends
- Yearly Sales + Profit combo chart (bar + line dual-axis)
- Month-over-Month growth rate (positive/negative color-coded bars)
- Sales vs Profit bubble scatter by sub-category
- Discount impact curve

### 3️⃣ Products
- Top 10 Products by Sales (horizontal bar)
- All Sub-Categories by Sales
- Top 10 Products by Profit
- Loss-making products (negative profit)

### 4️⃣ Regional Analysis
- 4 region summary cards (Sales · Profit · Margin %)
- Grouped bars: Region Sales vs Profit
- Regional market share donut
- Stacked bar: Technology / Furniture / Office Supplies by region

### 5️⃣ Customer Insights
- Segment sales distribution donut
- Multi-KPI grouped bar (Sales · Profit · Quantity by segment)
- Customer order frequency distribution
- Ship mode preference by segment (stacked bar)

### 6️⃣ Profitability
- Profit margin by sub-category (color-coded: green/yellow/red)
- Profit by ship mode
- Discount vs Profit detailed line with break-even threshold

### 7️⃣ 🤖 AI Smart Insights Panel
- 12 dynamically generated natural-language business insights ranked by impact score (1–10)
- Severity badges (Critical, High, Medium, Opportunity) & Category filtering
- Click-to-expand deep dive modal with metric cards and prescriptive recommendations
- AI Brain animated scanner & typewriter delivery

### 8️⃣ ⚡ What-If Scenario Simulator & Strategic Forecasting (NEW)
- Interactive executive sandbox modeling real-time financial sensitivity
- **5 Dynamic Parameter Sliders**:
  - Discount Cap on loss-making categories (0%–25%)
  - Furniture Re-Pricing on Tables & Bookcases (0%–25%)
  - High-Margin Technology & Copier Volume Acceleration (0%–50%)
  - Standard Class Freight Contract Renegotiation (0%–15%)
  - Customer VIP Retention & Repeat Purchase Lift (0%–20%)
- Live recalculation of **Projected Sales, Projected Net Profit, Margin Expansion, and Tables Breakeven Turnaround**
- Baseline vs Simulated bar comparison chart (`Chart.js`)
- **4 One-Click Strategy Presets**: Fix Furniture Losses, Aggressive Scale, Margin Fortress, and Baseline Reset

---

## 🧠 Next-Level AI Capabilities

1. **✨ Interactive AI Copilot (Natural Language Query Assistant)**
   - Click "Ask AI Copilot" from the top navigation bar or AI Insights section
   - Ask any conversational question (*"Why did sales drop in 2015?"*, *"How do we turn around the Tables loss?"*, *"Compare West vs Central"*)
   - Instant response with metric highlights, executive breakdown, and action triggers
   - **🔊 Voice Read Aloud (Text-to-Speech)**: Audio debrief powered by the browser SpeechSynthesis API
   - **📋 One-Click Copy**: Export findings to clipboard

2. **📄 Executive Board Briefing Generator**
   - Click "Board Memo" in the top bar to synthesize a confidential, board-level executive memo
   - Formatted for immediate executive review and includes **Print / Save as PDF** styling


---

## 🗄️ SQL Analysis — 9 Sections

| # | Section | Highlights |
|---|---------|-----------|
| 0 | Database Setup | CREATE, USE |
| 1 | Data Quality & Profiling | NULL check, duplicates, anomalies, date range |
| 2 | Overall KPIs | Sales, Profit, Margin, AOV, Discount rate |
| 3 | Time Dimension | YoY growth, MoM growth with LAG(), QoQ, Seasonality Index |
| 4 | Product Analysis | Top/Bottom 10, Sub-category ranking, Products in all regions |
| 5 | Regional Analysis | Market share %, Region × Category pivot, City leaderboard |
| 6 | Customer Analysis | CLV, Order frequency segmentation, RFM scoring |
| 7 | Shipping Analysis | Avg ship days, Late shipments, Revenue at risk |
| 8 | Profitability | Discount buckets, Loss threshold, Margin ranking |
| 9 | Advanced Analytics | Running totals, NTILE quartiles, Pareto 80/20, Repeat vs New customers, Full RFM model |

---

## 📈 Key Business Insights

| Finding | Insight |
|---------|---------|
| 💻 **Technology** leads sales ($836K) | Highest revenue but not the only high-margin category |
| 📎 **Copiers** top margin (37.2%) | Highest-margin sub-category despite lower volume |
| 🪑 **Tables** are margin-negative (-8.6%) | Structural loss-maker — needs pricing review |
| 🌎 **West region** leads all metrics | 31.6% market share, 14.9% margin |
| 📅 **Nov–Dec** drive 27%+ of annual sales | Clear holiday seasonality peak |
| 🎯 **Discounts >30%** consistently lose money | Avg profit turns negative at 30% threshold |
| 🚚 **Standard Class** = 59% of orders | High volume, lower urgency |
| 👥 **249 customers** placed 6+ orders | Loyal segment with highest CLV potential |

---

## 🚀 How to Run

### Dashboard (Web)
```bash
# Simply open index.html in your browser
# No installation or build step required
```

### SQL Analysis
```sql
-- 1. Import Superstore_Orders_Data.xlsx into SQL Server
-- 2. Run MaxStore_Sales_Analysis.sql section by section
-- 3. Use SQL Server Management Studio (SSMS) or Azure Data Studio
```

---

## ⚡ Improvements Over Base Project

| Feature | Cloned Project | Max Store Project |
|---------|---------------|------------------|
| Visualization | Static Power BI .pbix | Interactive web dashboard (open anywhere) |
| Charts | ~10 charts | **20+ interactive charts** |
| Dashboard Sections | 1 | **6 dedicated sections** |
| SQL Depth | 20 queries | **40+ queries across 9 sections** |
| Customer Analytics | Basic segment summary | **RFM scoring + CLV + Quartile segmentation** |
| Discount Analysis | Simple avg profit table | **Erosion threshold + bucket analysis** |
| Shipping Analysis | Usage frequency only | **Avg ship days + Late shipments + Revenue at risk** |
| Seasonality | Not covered | **Seasonality Index (peak/normal/low)** |
| Pareto Analysis | Not covered | **80/20 product contribution analysis** |
| Data Quality | 2 checks | **8 comprehensive profiling queries** |
| Filters | Power BI slicers | **Live sidebar filters (Year/Region/Segment)** |
| Design | Default Power BI theme | **Premium dark-mode with animations** |

---

## 📬 Contact

**Max Store Sales Analysis** — Portfolio Project  
*Built as an enhanced rebuild of the Superstore Sales Performance Analysis*

---

⭐ *Star this project if you found it useful for learning SQL analytics and dashboard design!*
