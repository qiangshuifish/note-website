# 加餐06｜SQL实战：快消场景的数据查询与优化
你好，我是陈博士。今天我们来看下麦当劳如何通过数据查询与分析来优化其业务运营。

麦当劳每天处理大量的交易，涉及数以百万计的顾客订单。有效的数据分析不仅有助于理解顾客消费行为和偏好，还能够为管理层提供决策支持。

针对该场景，我整理了5张数据表以及对应的查询问题。针对这些查询问题，你可以了解到这些SQL该如何撰写。

## **数据表**

- **订单表 orders**

  ![](images/839602/0f331b0d7d23b90fd78ce6cbb0d69cb1.jpg)

- **订单明细表 order\_details**

  ![](images/839602/05f2a4bc77b0aa12aed302dbb18f77a1.jpg)

- **产品表 products**

  ![](images/839602/374ec704448b03f990a0d7a9fyy402e5.jpg)

- **门店表 stores**

  ![](images/839602/6832ccaba343ab13b05c1a4d95c576fa.jpg)

- **会员表 (members)**

  ![](images/839602/f8eaba74a4a4219a693e12911ae646a0.jpg)

## **问题设定**

我从门店分析、销售分析、产品分析、会员分析、订单分析、组合分析等维度设置了一些常见的查询问题，一起来看一下。

### **门店分析**

- 各城市门店数量分布

```plain
 SELECT city, COUNT(*) as store_count
FROM stores
GROUP BY city
ORDER BY store_count DESC
LIMIT 10;

// 说明：使用 GROUP BY 对城市进行分组，COUNT(*) 统计各城市门店数量，ORDER BY 和 LIMIT 限制结果，展示门店数量最多的前10个城市。

```

- 查找最近30天新开业的门店

```plain
SELECT store_name, city, address, created_time
FROM stores
WHERE created_time &gt;= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
ORDER BY created_time DESC;

// 说明：使用 DATE_SUB 和 CURDATE() 函数计算最近30天的时间范围，WHERE 子句筛选新开业的门店，ORDER BY 按创建时间降序排列。

```

- 统计各省份的门店数量

```plain
SELECT province, COUNT(*) as store_count
FROM stores
GROUP BY province
ORDER BY store_count DESC;

// 说明：使用 GROUP BY province 对省份进行分组，COUNT(*) 统计每个省份的门店数量，ORDER BY store_count DESC 按门店数量降序排列，展示各省份的门店分布情况。

```

### **销售分析**

- 统计最近30天各门店的销售额

```plain
SELECT s.store_name,
       COUNT(o.order_id) as order_count,
       SUM(o.payment_amount) as total_sales
FROM orders o
JOIN stores s ON o.store_id = s.store_id
WHERE o.created_time &gt;= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY s.store_id, s.store_name
ORDER BY total_sales DESC;

// 说明：通过JOIN 连接订单和门店表，使用 WHERE 筛选最近30天的数据，GROUP BY 按门店分组，SUM 和 COUNT 分别计算销售额和订单数。

DATE_SUB 是 SQL 中用于日期运算的函数之一，主要用于从给定日期中减去一个时间间隔。它对于筛选特定时间段的数据非常有用。

```

- 统计各支付方式的使用比例

```plain
SELECT
    payment_method,
    COUNT(*) as use_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM orders), 2) as percentage
FROM orders
GROUP BY payment_method;

// 说明：使用 GROUP BY payment_method 分组统计每种支付方式的使用次数，通过子查询计算总订单数，ROUND 函数计算并格式化各支付方式的使用比例。

```

- 按小时统计订单量分布

```plain
SELECT
    HOUR(created_time) as hour,
    COUNT(*) as order_count
FROM orders
GROUP BY HOUR(created_time)
ORDER BY hour;

// 说明：使用 HOUR(created_time) 提取订单创建时间的小时部分，GROUP BY 按小时分组统计订单量，ORDER BY hour 按小时顺序排列，展示每小时的订单分布情况。

```

### **产品分析**

- 销量TOP10的产品

```plain
SELECT
    p.product_name,
    p.category_id,
    SUM(od.quantity) as total_quantity,
    SUM(od.subtotal) as total_amount
FROM order_details od
JOIN products p ON od.product_id = p.product_id
GROUP BY p.product_id, p.product_name, p.category_id
ORDER BY total_quantity DESC
LIMIT 10;

// 说明：通过 JOIN 连接订单明细和产品表，使用 GROUP BY 按产品分组，SUM 计算总销量和总金额，ORDER BY total_quantity DESC 按销量排序，LIMIT 10 展示销量最高的10个产品。

```

- 各品类销售占比

```plain
SELECT
    p.category_id,
    COUNT(DISTINCT od.order_id) as order_count,
    SUM(od.quantity) as total_quantity,
    SUM(od.subtotal) as total_amount,
    ROUND(SUM(od.subtotal) * 100.0 / (SELECT SUM(subtotal) FROM order_details), 2) as sales_percentage
FROM order_details od
JOIN products p ON od.product_id = p.product_id
GROUP BY p.category_id
ORDER BY total_amount DESC;

// 说明：ROUND(SUM(od.subtotal) * 100.0 / (SELECT SUM(subtotal) FROM order_details), 2) 这个表达式用于计算每个类别的销售额占总销售额的百分比，并将结果保留两位小数。

```

### **会员分析**

- 会员等级分布

```plain
SELECT
    member_level,
    COUNT(*) as member_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM members), 2) as percentage
FROM members
GROUP BY member_level;

// 说明：使用 GROUP BY member_level 按会员等级分组，COUNT(*) 统计各等级会员数量，通过子查询计算总会员数，ROUND 函数计算并格式化各等级会员占比。

```

- 最近30天新增会员数

```plain
SELECT
    DATE(register_time) as register_date,
    COUNT(*) as new_member_count
FROM members
WHERE register_time &gt;= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(register_time)
ORDER BY register_date;

// 说明：使用 DATE(register_time) 提取注册日期，WHERE 筛选最近30天的数据，GROUP BY DATE(register_time) 按天统计新增会员数，ORDER BY register_date 按日期排序展示。

```

- 会员消费行为分析

```plain
SELECT
    m.member_level,
    COUNT(DISTINCT o.member_id) as active_members,
    COUNT(o.order_id) as total_orders,
    ROUND(COUNT(o.order_id) * 1.0 / COUNT(DISTINCT o.member_id), 2) as avg_orders_per_member,
    ROUND(AVG(o.payment_amount), 2) as avg_amount_per_order,
    ROUND(SUM(o.payment_amount) * 1.0 / COUNT(DISTINCT o.member_id), 2) as avg_amount_per_member
FROM orders o
JOIN members m ON o.member_id = m.member_id
GROUP BY m.member_level;

// 说明：通过 JOIN 连接订单和会员表，按会员等级分组，统计活跃会员数、总订单数、平均每人订单数、平均每笔订单金额及平均每人消费金额，全面分析会员消费行为。

```

### **订单分析**

- 订单完成率

```plain
SELECT
    order_status,
    COUNT(*) as order_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM orders), 2) as percentage
FROM orders
GROUP BY order_status;

// 说明：使用 GROUP BY order_status 按订单状态分组，统计各状态的订单数量，通过子查询计算总订单数，ROUND 函数计算并格式化各状态订单的占比，分析订单完成率。

```

- 平均订单处理时间（分钟）

```plain
SELECT
    AVG(TIMESTAMPDIFF(MINUTE, created_time, payment_time)) as avg_payment_time,
    AVG(TIMESTAMPDIFF(MINUTE, payment_time, complete_time)) as avg_process_time,
    AVG(TIMESTAMPDIFF(MINUTE, created_time, complete_time)) as avg_total_time
FROM orders
WHERE order_status = 3;  -- 已完成的订单

// 说明：使用 TIMESTAMPDIFF 计算订单各阶段的时间差（分钟），AVG 求平均值，WHERE order_status = 3 筛选已完成订单，统计平均支付时间、处理时间和总时间。

```

- 各时段订单量和金额分布

```plain
SELECT
    CASE
        WHEN HOUR(created_time) BETWEEN 6 AND 9 THEN '早餐'
        WHEN HOUR(created_time) BETWEEN 10 AND 13 THEN '午餐'
        WHEN HOUR(created_time) BETWEEN 14 AND 16 THEN '下午茶'
        WHEN HOUR(created_time) BETWEEN 17 AND 20 THEN '晚餐'
        ELSE '夜宵'
    END as meal_period,
    COUNT(*) as order_count,
    ROUND(AVG(payment_amount), 2) as avg_amount,
    SUM(payment_amount) as total_amount
FROM orders
GROUP BY meal_period
ORDER BY order_count DESC;

// 说明：使用 CASE 语句按小时划分订单到不同的用餐时段，GROUP BY meal_period 统计各时段的订单量和金额，ORDER BY order_count DESC 按订单量降序排列，分析各时段的业务表现。

```

### **组合分析**

- 查找经常一起购买的产品组合

```plain
SELECT
    p1.product_name as product1,
    p2.product_name as product2,
    COUNT(*) as combination_count
FROM order_details od1
JOIN order_details od2 ON od1.order_id = od2.order_id AND od1.product_id &lt; od2.product_id
JOIN products p1 ON od1.product_id = p1.product_id
JOIN products p2 ON od2.product_id = p2.product_id
GROUP BY p1.product_id, p2.product_id, p1.product_name, p2.product_name
HAVING combination_count &gt; 10
ORDER BY combination_count DESC;

// 说明：通过自连接 order_details 表匹配同一订单中的不同产品，使用 JOIN 连接产品表获取产品名称，GROUP BY 和 HAVING 筛选并统计购买次数超过10次的产品组合，按组合频率排序。

```

- 会员消费升级分析（比较首次消费和最近一次消费）

```plain
WITH first_last_orders AS (
    SELECT
        member_id,
        MIN(created_time) as first_order_time,
        MAX(created_time) as last_order_time
    FROM orders
    GROUP BY member_id
)
SELECT
    m.member_level,
    ROUND(AVG(first_order.payment_amount), 2) as avg_first_amount,
    ROUND(AVG(last_order.payment_amount), 2) as avg_last_amount,
    ROUND(AVG(last_order.payment_amount - first_order.payment_amount), 2) as avg_amount_increase
FROM first_last_orders fl
JOIN orders first_order ON fl.member_id = first_order.member_id
    AND fl.first_order_time = first_order.created_time
JOIN orders last_order ON fl.member_id = last_order.member_id
    AND fl.last_order_time = last_order.created_time
JOIN members m ON fl.member_id = m.member_id
GROUP BY m.member_level;

// 说明：使用 WITH 子句获取每个会员的首次和最近一次消费时间，通过 JOIN 连接订单表和会员表，计算各会员等级的首次与最近一次平均消费金额及其增长，分析消费升级趋势。

```

如果你是快消行业的从业人员，这节课将对你非常有帮助。

本次的课程迭代到这里就结束了，期待再会。如果你有更多SQL相关的学习需求，欢迎你留言给我，我们一起探讨！