/*
===============================================================================
 Project:     Max Store Sales Analysis
 Author:      Portfolio Project
 Description:
   Comprehensive SQL analysis of the Max Store (Superstore) sales dataset.
   Covers data quality checks, KPI extraction, trend analysis, customer
   segmentation, profitability diagnostics, and advanced window function
   analytics — significantly expanded over the base Superstore SQL project.
 
 Database:    SQL Server (T-SQL compatible)
 Table:       sample_superstore
===============================================================================
*/

-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 0: DATABASE & TABLE SETUP
-- ─────────────────────────────────────────────────────────────────────────────

CREATE DATABASE MaxStore_Analytics;
GO
USE MaxStore_Analytics;
GO

-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 1: DATA QUALITY & PROFILING
-- ─────────────────────────────────────────────────────────────────────────────

-- 1.1 Total Record Count
SELECT COUNT(*) AS Total_Records FROM sample_superstore;

-- 1.2 NULL Check Across All Key Columns
SELECT
    SUM(CASE WHEN Row_ID       IS NULL THEN 1 ELSE 0 END) AS Null_RowID,
    SUM(CASE WHEN Order_ID     IS NULL THEN 1 ELSE 0 END) AS Null_OrderID,
    SUM(CASE WHEN Customer_ID  IS NULL THEN 1 ELSE 0 END) AS Null_CustomerID,
    SUM(CASE WHEN Sales        IS NULL THEN 1 ELSE 0 END) AS Null_Sales,
    SUM(CASE WHEN Profit       IS NULL THEN 1 ELSE 0 END) AS Null_Profit,
    SUM(CASE WHEN Quantity     IS NULL THEN 1 ELSE 0 END) AS Null_Quantity,
    SUM(CASE WHEN Discount     IS NULL THEN 1 ELSE 0 END) AS Null_Discount,
    SUM(CASE WHEN Order_Date   IS NULL THEN 1 ELSE 0 END) AS Null_OrderDate,
    SUM(CASE WHEN Ship_Date    IS NULL THEN 1 ELSE 0 END) AS Null_ShipDate
FROM sample_superstore;

-- 1.3 Duplicate Order-Row Check
SELECT Order_ID, Product_ID, COUNT(*) AS Occurrences
FROM sample_superstore
GROUP BY Order_ID, Product_ID
HAVING COUNT(*) > 1
ORDER BY Occurrences DESC;

-- 1.4 Date Range Sanity Check
SELECT
    MIN(Order_Date) AS Earliest_Order,
    MAX(Order_Date) AS Latest_Order,
    DATEDIFF(DAY, MIN(Order_Date), MAX(Order_Date)) AS Days_Span
FROM sample_superstore;

-- 1.5 Negative Sales or Quantity Records (Data Anomalies)
SELECT *
FROM sample_superstore
WHERE Sales < 0 OR Quantity <= 0;

-- 1.6 Distinct Value Audit
SELECT 'Category'  AS Field, COUNT(DISTINCT Category)  AS Distinct_Values FROM sample_superstore UNION ALL
SELECT 'Region',             COUNT(DISTINCT Region)             FROM sample_superstore UNION ALL
SELECT 'Ship_Mode',          COUNT(DISTINCT Ship_Mode)          FROM sample_superstore UNION ALL
SELECT 'Segment',            COUNT(DISTINCT Segment)            FROM sample_superstore UNION ALL
SELECT 'Sub_Category',       COUNT(DISTINCT Sub_Category)       FROM sample_superstore UNION ALL
SELECT 'State',              COUNT(DISTINCT State)              FROM sample_superstore UNION ALL
SELECT 'City',               COUNT(DISTINCT City)               FROM sample_superstore;

-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 2: OVERALL KPI SUMMARY
-- ─────────────────────────────────────────────────────────────────────────────

SELECT
    ROUND(SUM(Sales),    2)  AS Total_Sales,
    ROUND(SUM(Profit),   2)  AS Total_Profit,
    SUM(Quantity)            AS Total_Quantity,
    COUNT(DISTINCT Order_ID)           AS Total_Orders,
    COUNT(DISTINCT Customer_ID)        AS Unique_Customers,
    ROUND(SUM(Profit) * 100.0 / SUM(Sales), 2) AS Overall_Profit_Margin_Pct,
    ROUND(AVG(Sales),    2)  AS Avg_Order_Value,
    ROUND(AVG(Discount), 4)  AS Avg_Discount_Rate
FROM sample_superstore;

-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 3: TIME DIMENSION ANALYSIS
-- ─────────────────────────────────────────────────────────────────────────────

-- 3.1 Yearly Summary + YoY Growth
WITH Yearly AS (
    SELECT
        YEAR(Order_Date) AS Order_Year,
        ROUND(SUM(Sales),  2) AS Total_Sales,
        ROUND(SUM(Profit), 2) AS Total_Profit,
        SUM(Quantity)         AS Total_Quantity,
        COUNT(DISTINCT Order_ID) AS Total_Orders
    FROM sample_superstore
    GROUP BY YEAR(Order_Date)
)
SELECT
    Order_Year,
    Total_Sales,
    Total_Profit,
    Total_Quantity,
    Total_Orders,
    LAG(Total_Sales)  OVER (ORDER BY Order_Year) AS Prev_Year_Sales,
    ROUND((Total_Sales - LAG(Total_Sales) OVER (ORDER BY Order_Year)) * 100.0
        / NULLIF(LAG(Total_Sales) OVER (ORDER BY Order_Year), 0), 2) AS Sales_YoY_Growth_Pct,
    ROUND((Total_Profit - LAG(Total_Profit) OVER (ORDER BY Order_Year)) * 100.0
        / NULLIF(LAG(Total_Profit) OVER (ORDER BY Order_Year), 0), 2) AS Profit_YoY_Growth_Pct
FROM Yearly
ORDER BY Order_Year;

-- 3.2 Monthly Summary (All Years Combined)
SELECT
    MONTH(Order_Date)                  AS Month_Num,
    DATENAME(MONTH, Order_Date)        AS Month_Name,
    ROUND(SUM(Sales),  2)              AS Total_Sales,
    ROUND(SUM(Profit), 2)              AS Total_Profit,
    SUM(Quantity)                      AS Total_Quantity,
    COUNT(DISTINCT Order_ID)           AS Total_Orders
FROM sample_superstore
GROUP BY MONTH(Order_Date), DATENAME(MONTH, Order_Date)
ORDER BY Month_Num;

-- 3.3 Month-over-Month Sales Growth Rate (Window Function)
WITH Monthly_Sales AS (
    SELECT
        FORMAT(Order_Date, 'yyyy-MM') AS Year_Month,
        ROUND(SUM(Sales), 2)          AS Total_Sales,
        ROUND(SUM(Profit), 2)         AS Total_Profit
    FROM sample_superstore
    GROUP BY FORMAT(Order_Date, 'yyyy-MM')
)
SELECT
    Year_Month,
    Total_Sales,
    Total_Profit,
    LAG(Total_Sales) OVER (ORDER BY Year_Month)        AS Prev_Month_Sales,
    ROUND(
        (Total_Sales - LAG(Total_Sales) OVER (ORDER BY Year_Month)) * 100.0
        / NULLIF(LAG(Total_Sales) OVER (ORDER BY Year_Month), 0), 2
    )                                                  AS MoM_Growth_Pct,
    SUM(Total_Sales) OVER (ORDER BY Year_Month ROWS UNBOUNDED PRECEDING) AS Running_Total_Sales
FROM Monthly_Sales
ORDER BY Year_Month;

-- 3.4 Quarterly Performance + Quarter-over-Quarter Growth
WITH Quarterly AS (
    SELECT
        YEAR(Order_Date)     AS Order_Year,
        DATEPART(QUARTER, Order_Date) AS Quarter,
        ROUND(SUM(Sales),  2) AS Total_Sales,
        ROUND(SUM(Profit), 2) AS Total_Profit
    FROM sample_superstore
    GROUP BY YEAR(Order_Date), DATEPART(QUARTER, Order_Date)
)
SELECT
    Order_Year,
    'Q' + CAST(Quarter AS VARCHAR) AS Quarter,
    Total_Sales,
    Total_Profit,
    ROUND(Total_Profit * 100.0 / NULLIF(Total_Sales, 0), 2) AS Profit_Margin_Pct,
    LAG(Total_Sales) OVER (ORDER BY Order_Year, Quarter)    AS Prev_Quarter_Sales,
    ROUND(
        (Total_Sales - LAG(Total_Sales) OVER (ORDER BY Order_Year, Quarter)) * 100.0
        / NULLIF(LAG(Total_Sales) OVER (ORDER BY Order_Year, Quarter), 0), 2
    )                                                       AS QoQ_Sales_Growth_Pct
FROM Quarterly
ORDER BY Order_Year, Quarter;

-- 3.5 Peak Sales Day (Day of Week Analysis)
SELECT
    DATENAME(WEEKDAY, Order_Date) AS Day_Of_Week,
    DATEPART(WEEKDAY, Order_Date) AS Day_Num,
    COUNT(DISTINCT Order_ID)      AS Total_Orders,
    ROUND(SUM(Sales), 2)          AS Total_Sales
FROM sample_superstore
GROUP BY DATENAME(WEEKDAY, Order_Date), DATEPART(WEEKDAY, Order_Date)
ORDER BY Day_Num;

-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 4: PRODUCT ANALYSIS
-- ─────────────────────────────────────────────────────────────────────────────

-- 4.1 Category Summary
SELECT
    Category,
    ROUND(SUM(Sales),  2)  AS Total_Sales,
    ROUND(SUM(Profit), 2)  AS Total_Profit,
    SUM(Quantity)           AS Total_Quantity,
    COUNT(DISTINCT Order_ID) AS Total_Orders,
    ROUND(SUM(Profit) * 100.0 / NULLIF(SUM(Sales), 0), 2) AS Profit_Margin_Pct
FROM sample_superstore
GROUP BY Category
ORDER BY Total_Sales DESC;

-- 4.2 Sub-Category Drill-Down with Rank
WITH SubCat AS (
    SELECT
        Category,
        Sub_Category,
        ROUND(SUM(Sales),  2) AS Total_Sales,
        ROUND(SUM(Profit), 2) AS Total_Profit,
        SUM(Quantity)          AS Total_Qty,
        ROUND(SUM(Profit) * 100.0 / NULLIF(SUM(Sales), 0), 2) AS Margin_Pct,
        RANK() OVER (PARTITION BY Category ORDER BY SUM(Sales) DESC) AS Rank_Within_Category
    FROM sample_superstore
    GROUP BY Category, Sub_Category
)
SELECT * FROM SubCat ORDER BY Category, Rank_Within_Category;

-- 4.3 Top 10 Products by Sales
SELECT TOP 10
    Product_Name,
    ROUND(SUM(Sales),    2) AS Total_Sales,
    ROUND(SUM(Profit),   2) AS Total_Profit,
    SUM(Quantity)            AS Total_Qty,
    COUNT(DISTINCT Order_ID) AS Order_Count
FROM sample_superstore
GROUP BY Product_Name
ORDER BY Total_Sales DESC;

-- 4.4 Top 10 Products by Profit
SELECT TOP 10
    Product_Name,
    ROUND(SUM(Profit),   2) AS Total_Profit,
    ROUND(SUM(Sales),    2) AS Total_Sales,
    ROUND(SUM(Profit) * 100.0 / NULLIF(SUM(Sales), 0), 2) AS Margin_Pct
FROM sample_superstore
GROUP BY Product_Name
ORDER BY Total_Profit DESC;

-- 4.5 Bottom 10 Loss-Making Products
SELECT TOP 10
    Product_Name,
    ROUND(SUM(Profit), 2) AS Total_Loss,
    ROUND(SUM(Sales),  2) AS Total_Sales,
    SUM(Quantity)          AS Total_Qty
FROM sample_superstore
GROUP BY Product_Name
HAVING SUM(Profit) < 0
ORDER BY Total_Loss ASC;

-- 4.6 Products Sold in Every Region (Market-Wide Products)
SELECT Product_Name, COUNT(DISTINCT Region) AS Region_Count
FROM sample_superstore
GROUP BY Product_Name
HAVING COUNT(DISTINCT Region) = 4
ORDER BY Product_Name;

-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 5: REGIONAL ANALYSIS
-- ─────────────────────────────────────────────────────────────────────────────

-- 5.1 Regional Summary
SELECT
    Region,
    ROUND(SUM(Sales),  2)    AS Total_Sales,
    ROUND(SUM(Profit), 2)    AS Total_Profit,
    SUM(Quantity)             AS Total_Quantity,
    COUNT(DISTINCT Order_ID)  AS Total_Orders,
    COUNT(DISTINCT Customer_ID) AS Unique_Customers,
    ROUND(SUM(Profit) * 100.0 / NULLIF(SUM(Sales), 0), 2) AS Profit_Margin_Pct,
    ROUND(SUM(Sales) * 100.0 / SUM(SUM(Sales)) OVER (), 2) AS Market_Share_Pct
FROM sample_superstore
GROUP BY Region
ORDER BY Total_Sales DESC;

-- 5.2 Region × Category Cross-Tab
SELECT
    Region,
    MAX(CASE WHEN Category = 'Technology'     THEN Total_Sales END) AS Technology_Sales,
    MAX(CASE WHEN Category = 'Furniture'      THEN Total_Sales END) AS Furniture_Sales,
    MAX(CASE WHEN Category = 'Office Supplies'THEN Total_Sales END) AS OfficeSup_Sales
FROM (
    SELECT Region, Category, ROUND(SUM(Sales), 2) AS Total_Sales
    FROM sample_superstore
    GROUP BY Region, Category
) AS Pivoted
GROUP BY Region
ORDER BY Region;

-- 5.3 Top Product by Region (using RANK)
WITH RegionRanked AS (
    SELECT
        Region,
        Product_Name,
        ROUND(SUM(Sales),  2) AS Total_Sales,
        ROUND(SUM(Profit), 2) AS Total_Profit,
        RANK() OVER (PARTITION BY Region ORDER BY SUM(Sales) DESC) AS Sales_Rank
    FROM sample_superstore
    GROUP BY Region, Product_Name
)
SELECT Region, Product_Name, Total_Sales, Total_Profit
FROM RegionRanked
WHERE Sales_Rank = 1;

-- 5.4 State-Level Sales Leaderboard (Top 15)
SELECT TOP 15
    State,
    Region,
    ROUND(SUM(Sales),  2) AS Total_Sales,
    ROUND(SUM(Profit), 2) AS Total_Profit,
    COUNT(DISTINCT Order_ID) AS Total_Orders
FROM sample_superstore
GROUP BY State, Region
ORDER BY Total_Sales DESC;

-- 5.5 City-Level Top 10
SELECT TOP 10
    City,
    State,
    ROUND(SUM(Sales), 2) AS Total_Sales,
    ROUND(SUM(Profit),2) AS Total_Profit
FROM sample_superstore
GROUP BY City, State
ORDER BY Total_Sales DESC;

-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 6: CUSTOMER ANALYSIS
-- ─────────────────────────────────────────────────────────────────────────────

-- 6.1 Customer Segment Summary
SELECT
    Segment,
    COUNT(DISTINCT Customer_ID)  AS Unique_Customers,
    COUNT(DISTINCT Order_ID)     AS Total_Orders,
    ROUND(SUM(Sales),  2)        AS Total_Sales,
    ROUND(SUM(Profit), 2)        AS Total_Profit,
    ROUND(AVG(Sales),  2)        AS Avg_Order_Sales,
    ROUND(SUM(Profit) * 100.0 / NULLIF(SUM(Sales), 0), 2) AS Profit_Margin_Pct
FROM sample_superstore
GROUP BY Segment
ORDER BY Total_Sales DESC;

-- 6.2 Top 20 Customers by Revenue
SELECT TOP 20
    Customer_ID,
    Customer_Name,
    Segment,
    Region,
    ROUND(SUM(Sales),  2)         AS Total_Revenue,
    ROUND(SUM(Profit), 2)         AS Total_Profit,
    COUNT(DISTINCT Order_ID)      AS Order_Count,
    ROUND(AVG(Sales),  2)         AS Avg_Order_Value,
    MIN(Order_Date)               AS First_Order,
    MAX(Order_Date)               AS Last_Order
FROM sample_superstore
GROUP BY Customer_ID, Customer_Name, Segment, Region
ORDER BY Total_Revenue DESC;

-- 6.3 Customer Order Frequency Segmentation
WITH CustomerOrders AS (
    SELECT
        Customer_ID,
        Customer_Name,
        Segment,
        COUNT(DISTINCT Order_ID) AS Order_Count,
        ROUND(SUM(Sales), 2)     AS Total_Sales
    FROM sample_superstore
    GROUP BY Customer_ID, Customer_Name, Segment
)
SELECT
    CASE
        WHEN Order_Count = 1 THEN '1 - One-time'
        WHEN Order_Count BETWEEN 2 AND 3 THEN '2-3 - Occasional'
        WHEN Order_Count BETWEEN 4 AND 6 THEN '4-6 - Regular'
        WHEN Order_Count BETWEEN 7 AND 10 THEN '7-10 - Frequent'
        ELSE '11+ - Loyal'
    END AS Customer_Segment_Label,
    COUNT(*)         AS Customer_Count,
    SUM(Order_Count) AS Total_Orders,
    ROUND(AVG(Total_Sales), 2) AS Avg_Customer_Revenue
FROM CustomerOrders
GROUP BY
    CASE
        WHEN Order_Count = 1 THEN '1 - One-time'
        WHEN Order_Count BETWEEN 2 AND 3 THEN '2-3 - Occasional'
        WHEN Order_Count BETWEEN 4 AND 6 THEN '4-6 - Regular'
        WHEN Order_Count BETWEEN 7 AND 10 THEN '7-10 - Frequent'
        ELSE '11+ - Loyal'
    END
ORDER BY Customer_Segment_Label;

-- 6.4 Customer Lifetime Value (CLV) Estimate
WITH CLV AS (
    SELECT
        Customer_ID,
        Customer_Name,
        Segment,
        ROUND(SUM(Sales),  2)         AS Total_Revenue,
        ROUND(SUM(Profit), 2)         AS Total_Profit,
        COUNT(DISTINCT Order_ID)      AS Order_Count,
        DATEDIFF(DAY, MIN(Order_Date), MAX(Order_Date)) AS Customer_Tenure_Days
    FROM sample_superstore
    GROUP BY Customer_ID, Customer_Name, Segment
)
SELECT TOP 20
    Customer_ID,
    Customer_Name,
    Segment,
    Total_Revenue,
    Total_Profit,
    Order_Count,
    Customer_Tenure_Days,
    ROUND(Total_Revenue / NULLIF(Customer_Tenure_Days, 0) * 365, 2) AS Annualized_Revenue,
    DENSE_RANK() OVER (ORDER BY Total_Revenue DESC)                  AS CLV_Rank
FROM CLV
ORDER BY CLV_Rank;

-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 7: SHIPPING ANALYSIS
-- ─────────────────────────────────────────────────────────────────────────────

-- 7.1 Ship Mode Summary
SELECT
    Ship_Mode,
    COUNT(*)                    AS Total_Rows,
    COUNT(DISTINCT Order_ID)    AS Total_Orders,
    ROUND(SUM(Sales),  2)       AS Total_Sales,
    ROUND(SUM(Profit), 2)       AS Total_Profit,
    ROUND(AVG(DATEDIFF(DAY, Order_Date, Ship_Date)), 1) AS Avg_Ship_Days,
    ROUND(SUM(Sales) * 100.0 / SUM(SUM(Sales)) OVER (), 2) AS Sales_Share_Pct
FROM sample_superstore
GROUP BY Ship_Mode
ORDER BY Total_Orders DESC;

-- 7.2 Average Shipping Days by Region × Ship Mode
SELECT
    Region,
    Ship_Mode,
    ROUND(AVG(DATEDIFF(DAY, Order_Date, Ship_Date)), 1) AS Avg_Ship_Days,
    COUNT(DISTINCT Order_ID) AS Orders
FROM sample_superstore
GROUP BY Region, Ship_Mode
ORDER BY Region, Avg_Ship_Days;

-- 7.3 Late Shipments Analysis (shipped > 7 days after order)
SELECT
    Ship_Mode,
    COUNT(*) AS Late_Shipments,
    ROUND(AVG(DATEDIFF(DAY, Order_Date, Ship_Date)), 1) AS Avg_Days_Delayed,
    ROUND(SUM(Sales), 2) AS Revenue_At_Risk
FROM sample_superstore
WHERE DATEDIFF(DAY, Order_Date, Ship_Date) > 7
GROUP BY Ship_Mode
ORDER BY Late_Shipments DESC;

-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 8: PROFITABILITY & DISCOUNT ANALYSIS
-- ─────────────────────────────────────────────────────────────────────────────

-- 8.1 Profit Margin by Category
SELECT
    Category,
    ROUND(SUM(Sales),  2) AS Total_Sales,
    ROUND(SUM(Profit), 2) AS Total_Profit,
    ROUND(SUM(Profit) * 100.0 / NULLIF(SUM(Sales), 0), 2) AS Profit_Margin_Pct
FROM sample_superstore
GROUP BY Category
ORDER BY Profit_Margin_Pct DESC;

-- 8.2 Discount Buckets vs Average Profit
SELECT
    CASE
        WHEN Discount = 0               THEN '0% - No Discount'
        WHEN Discount BETWEEN 0.01 AND 0.10 THEN '1-10%'
        WHEN Discount BETWEEN 0.11 AND 0.20 THEN '11-20%'
        WHEN Discount BETWEEN 0.21 AND 0.30 THEN '21-30%'
        WHEN Discount BETWEEN 0.31 AND 0.50 THEN '31-50%'
        ELSE '51%+'
    END AS Discount_Bucket,
    COUNT(*)                    AS Records,
    ROUND(AVG(Sales),  2)       AS Avg_Sales,
    ROUND(AVG(Profit), 2)       AS Avg_Profit,
    ROUND(SUM(Profit), 2)       AS Total_Profit,
    ROUND(AVG(Profit) * 100.0 / NULLIF(AVG(Sales), 0), 2) AS Avg_Margin_Pct
FROM sample_superstore
GROUP BY
    CASE
        WHEN Discount = 0               THEN '0% - No Discount'
        WHEN Discount BETWEEN 0.01 AND 0.10 THEN '1-10%'
        WHEN Discount BETWEEN 0.11 AND 0.20 THEN '11-20%'
        WHEN Discount BETWEEN 0.21 AND 0.30 THEN '21-30%'
        WHEN Discount BETWEEN 0.31 AND 0.50 THEN '31-50%'
        ELSE '51%+'
    END
ORDER BY Avg_Profit DESC;

-- 8.3 Discount Erosion Threshold (at what discount does profit turn negative?)
SELECT
    ROUND(Discount, 1) AS Discount_Level,
    COUNT(*)            AS Records,
    ROUND(AVG(Profit),  2) AS Avg_Profit,
    SUM(CASE WHEN Profit < 0 THEN 1 ELSE 0 END) AS Loss_Transactions,
    ROUND(SUM(CASE WHEN Profit < 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS Loss_Rate_Pct
FROM sample_superstore
GROUP BY ROUND(Discount, 1)
ORDER BY Discount_Level;

-- 8.4 Sub-Category Profit Margin Ranking
SELECT
    Sub_Category,
    Category,
    ROUND(SUM(Sales),  2) AS Total_Sales,
    ROUND(SUM(Profit), 2) AS Total_Profit,
    ROUND(SUM(Profit) * 100.0 / NULLIF(SUM(Sales), 0), 2) AS Margin_Pct,
    RANK() OVER (ORDER BY SUM(Profit) * 100.0 / NULLIF(SUM(Sales), 0) DESC) AS Profitability_Rank
FROM sample_superstore
GROUP BY Sub_Category, Category
ORDER BY Profitability_Rank;

-- ─────────────────────────────────────────────────────────────────────────────
-- SECTION 9: ADVANCED ANALYTICS (WINDOW FUNCTIONS & CTEs)
-- ─────────────────────────────────────────────────────────────────────────────

-- 9.1 Cumulative Sales & Profit (Running Total by Month)
WITH Monthly AS (
    SELECT
        FORMAT(Order_Date, 'yyyy-MM') AS Yr_Mo,
        ROUND(SUM(Sales),  2) AS Monthly_Sales,
        ROUND(SUM(Profit), 2) AS Monthly_Profit
    FROM sample_superstore
    GROUP BY FORMAT(Order_Date, 'yyyy-MM')
)
SELECT
    Yr_Mo,
    Monthly_Sales,
    Monthly_Profit,
    SUM(Monthly_Sales)  OVER (ORDER BY Yr_Mo ROWS UNBOUNDED PRECEDING) AS Cumulative_Sales,
    SUM(Monthly_Profit) OVER (ORDER BY Yr_Mo ROWS UNBOUNDED PRECEDING) AS Cumulative_Profit,
    AVG(Monthly_Sales)  OVER (ORDER BY Yr_Mo ROWS 2 PRECEDING)         AS Rolling_3M_Avg_Sales
FROM Monthly
ORDER BY Yr_Mo;

-- 9.2 Sales Percentile by Customer (NTILE)
WITH CustSales AS (
    SELECT
        Customer_ID,
        Customer_Name,
        Segment,
        ROUND(SUM(Sales), 2) AS Total_Sales
    FROM sample_superstore
    GROUP BY Customer_ID, Customer_Name, Segment
)
SELECT
    Customer_ID,
    Customer_Name,
    Segment,
    Total_Sales,
    NTILE(4) OVER (ORDER BY Total_Sales DESC) AS Quartile,
    CASE NTILE(4) OVER (ORDER BY Total_Sales DESC)
        WHEN 1 THEN 'Top 25% (Platinum)'
        WHEN 2 THEN 'Top 50% (Gold)'
        WHEN 3 THEN 'Top 75% (Silver)'
        ELSE        'Bottom 25% (Bronze)'
    END AS Customer_Tier
FROM CustSales
ORDER BY Total_Sales DESC;

-- 9.3 Product Sales Contribution (Pareto — 80/20 Rule)
WITH ProductSales AS (
    SELECT
        Product_Name,
        ROUND(SUM(Sales), 2) AS Product_Sales
    FROM sample_superstore
    GROUP BY Product_Name
),
Ranked AS (
    SELECT
        Product_Name,
        Product_Sales,
        RANK() OVER (ORDER BY Product_Sales DESC) AS Rnk,
        SUM(Product_Sales) OVER (ORDER BY Product_Sales DESC ROWS UNBOUNDED PRECEDING) AS Running_Sales,
        SUM(Product_Sales) OVER ()                                                      AS Grand_Total
    FROM ProductSales
)
SELECT
    Rnk,
    Product_Name,
    Product_Sales,
    ROUND(Running_Sales * 100.0 / Grand_Total, 2) AS Cumulative_Pct,
    CASE WHEN Running_Sales * 100.0 / Grand_Total <= 80 THEN 'Top 80% Revenue' ELSE 'Tail Products' END AS Pareto_Group
FROM Ranked
ORDER BY Rnk;

-- 9.4 Seasonality Index (Monthly Sales vs Annual Average)
WITH Totals AS (
    SELECT
        MONTH(Order_Date)           AS Mo,
        DATENAME(MONTH, Order_Date) AS Month_Name,
        ROUND(SUM(Sales), 2)        AS Monthly_Sales
    FROM sample_superstore
    GROUP BY MONTH(Order_Date), DATENAME(MONTH, Order_Date)
),
Avg AS (
    SELECT AVG(Monthly_Sales) AS Annual_Monthly_Avg FROM Totals
)
SELECT
    T.Mo,
    T.Month_Name,
    T.Monthly_Sales,
    ROUND(T.Monthly_Sales / A.Annual_Monthly_Avg, 3) AS Seasonality_Index,
    CASE
        WHEN T.Monthly_Sales / A.Annual_Monthly_Avg > 1.2 THEN 'High Season'
        WHEN T.Monthly_Sales / A.Annual_Monthly_Avg < 0.8 THEN 'Low Season'
        ELSE 'Normal'
    END AS Season_Label
FROM Totals T, Avg A
ORDER BY T.Mo;

-- 9.5 Repeat vs New Customers per Year
WITH FirstOrder AS (
    SELECT Customer_ID, MIN(YEAR(Order_Date)) AS First_Year
    FROM sample_superstore
    GROUP BY Customer_ID
),
Orders AS (
    SELECT s.Customer_ID, YEAR(s.Order_Date) AS Order_Year, f.First_Year
    FROM sample_superstore s
    JOIN FirstOrder f ON s.Customer_ID = f.Customer_ID
)
SELECT
    Order_Year,
    COUNT(DISTINCT CASE WHEN Order_Year = First_Year THEN Customer_ID END) AS New_Customers,
    COUNT(DISTINCT CASE WHEN Order_Year > First_Year  THEN Customer_ID END) AS Repeat_Customers
FROM Orders
GROUP BY Order_Year
ORDER BY Order_Year;

-- 9.6 Average Days Between Orders Per Customer (Recency)
WITH OrderDates AS (
    SELECT
        Customer_ID,
        Order_Date,
        LAG(Order_Date) OVER (PARTITION BY Customer_ID ORDER BY Order_Date) AS Prev_Order_Date
    FROM (SELECT DISTINCT Customer_ID, Order_Date FROM sample_superstore) AS Distinct_Orders
)
SELECT
    Customer_ID,
    ROUND(AVG(DATEDIFF(DAY, Prev_Order_Date, Order_Date)), 1) AS Avg_Days_Between_Orders
FROM OrderDates
WHERE Prev_Order_Date IS NOT NULL
GROUP BY Customer_ID
HAVING COUNT(*) >= 2
ORDER BY Avg_Days_Between_Orders;

-- 9.7 RFM Scoring (Recency, Frequency, Monetary)
WITH RFM_Base AS (
    SELECT
        Customer_ID,
        Customer_Name,
        DATEDIFF(DAY, MAX(Order_Date), '2018-01-01') AS Recency,
        COUNT(DISTINCT Order_ID)                      AS Frequency,
        ROUND(SUM(Sales), 2)                          AS Monetary
    FROM sample_superstore
    GROUP BY Customer_ID, Customer_Name
),
RFM_Scores AS (
    SELECT *,
        NTILE(5) OVER (ORDER BY Recency   ASC)  AS R_Score,
        NTILE(5) OVER (ORDER BY Frequency DESC) AS F_Score,
        NTILE(5) OVER (ORDER BY Monetary  DESC) AS M_Score
    FROM RFM_Base
)
SELECT
    Customer_ID,
    Customer_Name,
    Recency,
    Frequency,
    Monetary,
    R_Score,
    F_Score,
    M_Score,
    (R_Score + F_Score + M_Score) AS RFM_Total,
    CASE
        WHEN (R_Score + F_Score + M_Score) >= 13 THEN 'Champions'
        WHEN (R_Score + F_Score + M_Score) >= 10 THEN 'Loyal Customers'
        WHEN (R_Score + F_Score + M_Score) >= 7  THEN 'Potential Loyalists'
        WHEN (R_Score + F_Score + M_Score) >= 5  THEN 'At Risk'
        ELSE 'Lost'
    END AS RFM_Segment
FROM RFM_Scores
ORDER BY RFM_Total DESC;

-- ─────────────────────────────────────────────────────────────────────────────
-- END OF MAX STORE SALES ANALYSIS SQL
-- ─────────────────────────────────────────────────────────────────────────────
