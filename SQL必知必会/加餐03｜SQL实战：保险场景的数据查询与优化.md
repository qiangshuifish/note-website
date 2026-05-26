# 加餐03｜SQL实战：保险场景的数据查询与优化
你好，我是陈博士，今天我们来探讨一下保险续保业务的数据分析与优化。

续保业务是保险公司持续稳定发展的重要组成部分。通过深入的数据查询和分析，我们可以评估客户的续保倾向，识别潜在的流失风险，并为后续的续保策略提供决策支持。

针对该场景，我整理了5张数据表以及对应的查询问题。针对这些查询问题，你可以了解到这些SQL该如何撰写。

## **数据表**

- 客户信息表 customers

![](images/838086/cd58929f9e0c9b1cfcd4ca0812c0d245.jpg)

- 保险产品表 insurance\_products

![](images/838086/a2449943d03e3c430fbdcc275411a990.jpg)

- 保单表 policies

![](images/838086/28eafe57eef59f8efa1334b018e25958.jpg)

- 续保记录表 renewal\_records

![](images/838086/9b4247e0e84abd1267ff5e85yy908cf6.jpg)

- 续保提醒记录表 renewal\_reminders

![](images/838086/74f440af660a378e6f15ac1f716a05e4.jpg)

## **问题设定**

我从客户分析、产品分析、保单分析、续保分析、异常分析、提醒效果分析、交叉分析等维度设置了一些常见的查询问题。

### **1\. 客户分析**

- 查询购买保单数量最多的前10名客户及其保单数量

```plain
SELECT
    c.customer_id,
    c.name,
    c.phone,
    COUNT(p.policy_id) as policy_count
FROM customers c
JOIN policies p ON c.customer_id = p.customer_id
GROUP BY c.customer_id, c.name, c.phone
ORDER BY policy_count DESC
LIMIT 10;

// 说明：这里使用JOIN连接客户和保单表，GROUP BY按客户分组并统计保单数量

```

- 统计每个年龄段的客户数量及平均保费

```plain
WITH customer_age AS (
    SELECT
        customer_id,
        FLOOR((YEAR(CURRENT_DATE) - YEAR(STR_TO_DATE(birth_date, '%Y-%m-%d')))/10)*10 as age_group
    FROM customers
)
SELECT
    ca.age_group as age_range,
    CONCAT(ca.age_group, '-', ca.age_group + 9) as age_range_display,
    COUNT(DISTINCT ca.customer_id) as customer_count,
    ROUND(AVG(p.premium_amount), 2) as avg_premium
FROM customer_age ca
JOIN policies p ON ca.customer_id = p.customer_id
GROUP BY ca.age_group
ORDER BY ca.age_group;

// 说明：WITH 关键字用于定义公用表表达式（Common Table Expressions，简称CTE），这是一种临时结果集，可以在查询中引用一次或多次。CTE 提高了查询的可读性和维护性，尤其是在复杂的查询中需要重复使用相同子查询的情况下。

```

### **2\. 产品分析**

- 统计各类保险产品的销售份数和保费收入

```plain
SELECT
    ip.product_id,
    ip.product_name,
    ip.product_type,
    COUNT(p.policy_id) as sales_count,
    SUM(p.premium_amount) as total_premium
FROM insurance_products ip
LEFT JOIN policies p ON ip.product_id = p.product_id
GROUP BY ip.product_id, ip.product_name, ip.product_type
ORDER BY total_premium DESC;

// 说明：使用LEFT JOIN连接保险产品和保单表，确保包括所有保险产品，GROUP BY按产品分组统计销售份数和保费收入，ORDER BY按总保费降序排列。

```

- 查询续保率最高的前5个产品

```plain
WITH renewal_stats AS (
    SELECT
        ip.product_id,
        ip.product_name,
        COUNT(DISTINCT p.policy_id) as total_policies,
        COUNT(DISTINCT CASE WHEN rr.renewal_status = '成功' THEN rr.renewal_id END) as successful_renewals
    FROM insurance_products ip
    JOIN policies p ON ip.product_id = p.product_id
    LEFT JOIN renewal_records rr ON p.policy_id = rr.policy_id
    GROUP BY ip.product_id, ip.product_name
)
SELECT
    product_id,
    product_name,
    total_policies,
    successful_renewals,
    ROUND(CAST(successful_renewals AS DECIMAL(10,2)) / NULLIF(total_policies, 0) * 100, 2) as renewal_rate
FROM renewal_stats
WHERE total_policies &gt; 0
ORDER BY renewal_rate DESC
LIMIT 5;

// 说明：CAST 和 NULLIF 是SQL中用于数据类型转换和条件表达式的两个函数。在这个查询中，它们一起用于确保续保率计算的准确性，并处理可能的除以零的异常。

```

### **3\. 保单分析**

- 查询即将到期（30 天内）的保单清单

```plain
SELECT
    p.policy_id,
    p.policy_number,
    c.name as customer_name,
    c.phone,
    ip.product_name,
    p.end_date,
    p.premium_amount
FROM policies p
JOIN customers c ON p.customer_id = c.customer_id
JOIN insurance_products ip ON p.product_id = ip.product_id
WHERE p.status = '有效'
AND STR_TO_DATE(p.end_date, '%Y-%m-%d')
    BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY)
ORDER BY p.end_date;

// 说明：STR_TO_DATE、CURRENT_DATE 和 DATE_ADD 是SQL中用于日期处理的函数。在这个查询中用于筛选即将到期的保单。

STR_TO_DATE 函数用于将字符串按照指定的格式转换为日期类型。

CURRENT_DATE 函数返回当前日期，不包含时间部分。它通常用于获取今天的日期，并且在不同的数据库系统中有类似的实现方式（例如，在MySQL中就是 CURRENT_DATE() 或 CURDATE()）。

DATE_ADD 函数用于向日期添加一个时间间隔。

```

- 分析保单状态分布

```plain
SELECT
    status,
    COUNT(*) as count,
    ROUND(CAST(COUNT(*) AS DECIMAL(10,2)) / SUM(COUNT(*)) OVER() * 100, 2) as percentage
FROM policies
GROUP BY status
ORDER BY count DESC;

// 说明：使用GROUP BY按保单状态分组统计数量，通过窗口函数SUM OVER()计算总数，CAST转换数据类型并计算各状态的百分比，ORDER BY按数量降序排列。

```

### **4\. 续保分析**

- 查询连续续保 3 次以上的客户

```plain
WITH consecutive_renewals AS (
    SELECT
        p.customer_id,
        COUNT(rr.renewal_id) as renewal_count
    FROM policies p
    JOIN renewal_records rr ON p.policy_id = rr.policy_id
    WHERE rr.renewal_status = '成功'
    GROUP BY p.customer_id
    HAVING COUNT(rr.renewal_id) &gt;= 3
)
SELECT
    c.customer_id,
    c.name,
    c.phone,
    cr.renewal_count
FROM consecutive_renewals cr
JOIN customers c ON cr.customer_id = c.customer_id
ORDER BY cr.renewal_count DESC;

// 说明：这里使用CTE筛选出成功续保3次及以上的客户，通过GROUP BY和HAVING条件聚合续保记录，最后JOIN客户表获取详细信息并按续保次数排序。

```

### **5\. 异常分析**

- 查询保费异常的保单（超过平均值 2 个标准差）

```plain
WITH premium_stats AS (
    SELECT
        AVG(premium_amount) as avg_premium,
        STDDEV(premium_amount) as stddev_premium
    FROM policies
)
SELECT
    p.policy_id,
    p.policy_number,
    c.name as customer_name,
    ip.product_name,
    p.premium_amount,
    ps.avg_premium,
    ps.stddev_premium
FROM policies p
JOIN customers c ON p.customer_id = c.customer_id
JOIN insurance_products ip ON p.product_id = ip.product_id
CROSS JOIN premium_stats ps
WHERE p.premium_amount &gt; ps.avg_premium + (2 * ps.stddev_premium)
   OR p.premium_amount &lt; ps.avg_premium - (2 * ps.stddev_premium)
ORDER BY p.premium_amount DESC;

// 说明：使用CTE计算保费的平均值和标准差，通过CROSS JOIN将统计结果应用到每条保单记录，筛选出保费超过平均值±2个标准差的异常保单。

CROSS JOIN 是SQL中的一种连接类型，它返回两个表的笛卡尔积，即第一个表中的每一行与第二个表中的每一行组合。结果集中行的数量等于两个表行数的乘积。

```

### **6\. 提醒效果分析**

- 统计不同提醒方式的效果（续保成功率）

```plain
WITH reminder_stats AS (
    SELECT
        rm.remind_method,
        COUNT(DISTINCT rm.policy_id) as total_reminders,
        COUNT(DISTINCT CASE WHEN rr.renewal_status = '成功' THEN rr.renewal_id END) as successful_renewals
    FROM renewal_reminders rm
    LEFT JOIN renewal_records rr ON rm.policy_id = rr.policy_id
    WHERE rm.remind_status = '成功'
    GROUP BY rm.remind_method
)
SELECT
    remind_method,
    total_reminders,
    successful_renewals,
    ROUND(CAST(successful_renewals AS DECIMAL(10,2)) / NULLIF(total_reminders, 0) * 100, 2) as success_rate
FROM reminder_stats
ORDER BY success_rate DESC;

// 说明：使用CTE统计每种提醒方式的总提醒数和成功续保数，通过GROUP BY分组，计算续保成功率并按成功率降序排列，确保分母不为零。

```

- 分析提醒后一周内完成续保的比例

```plain
WITH reminder_conversion AS (
    SELECT
        COUNT(DISTINCT rr.renewal_id) as total_renewals,
        COUNT(DISTINCT CASE
            WHEN STR_TO_DATE(rr.renewal_date, '%Y-%m-%d') &lt;=
                 DATE_ADD(STR_TO_DATE(rm.remind_time, '%Y-%m-%d %H:%i:%s'), INTERVAL 7 DAY)
            AND rr.renewal_status = '成功'
            THEN rr.renewal_id
        END) as converted_renewals
    FROM renewal_reminders rm
    LEFT JOIN renewal_records rr ON rm.policy_id = rr.policy_id
    WHERE rm.remind_status = '成功'
)
SELECT
    total_renewals,
    converted_renewals,
    ROUND(CAST(converted_renewals AS DECIMAL(10,2)) / NULLIF(total_renewals, 0) * 100, 2) as conversion_rate
FROM reminder_conversion;

// 说明：使用CTE统计提醒后一周内成功续保的数量，通过条件判断筛选符合条件的续保记录，计算转换率并确保分母不为零，最终输出总续保数、转换续保数及比率。

```

### **7. 交叉分析**

- 分析客户年龄与产品选择的关系

```plain
WITH customer_age_group AS (
    SELECT
        customer_id,
        FLOOR((YEAR(CURRENT_DATE) - YEAR(STR_TO_DATE(birth_date, '%Y-%m-%d')))/10)*10 as age_group
    FROM customers
)
SELECT
    cag.age_group,
    CONCAT(cag.age_group, '-', cag.age_group + 9) as age_range,
    ip.product_type,
    COUNT(DISTINCT p.policy_id) as policy_count,
    ROUND(AVG(p.premium_amount), 2) as avg_premium
FROM customer_age_group cag
JOIN policies p ON cag.customer_id = p.customer_id
JOIN insurance_products ip ON p.product_id = ip.product_id
GROUP BY cag.age_group, ip.product_type
ORDER BY cag.age_group, policy_count DESC;

// 说明：使用CTE计算客户年龄组，通过JOIN连接保单和产品表，按年龄组和产品类型分组统计保单数量及平均保费，ORDER BY按年龄组和保单数量排序展示结果。

CONCAT(cag.age_group, '-', cag.age_group + 9) as age_range 这段代码使用了SQL的 CONCAT 函数来创建一个更具可读性的年龄范围字符串。

```

如果你是保险行业的从业人员，这节课将对你非常有帮助。期待你的转发，我们下节课再见！