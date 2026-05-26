# 加餐05｜SQL实战：新能源车企的数据查询与优化
你好，我是陈博士。今天我们来探讨一下新能源汽车企业的实时车况监控业务的数据查询与优化。

随着新能源汽车市场的迅速扩张，实时车况监控成为了确保车辆安全运行的关键环节。通过查询，我们可以即时掌握每辆车的健康状态，包括电池性能、电机效率以及潜在故障，这有助于车企提前做出维护决策。

针对该场景，我整理了6张数据表以及对应的查询问题。针对这些查询问题，你可以了解到这些SQL该如何撰写。

## **数据表**

- 车辆基础信息表 vehicle\_base\_info

  ![](images/839587/622f7184aabb3f68ebb432ba05365e4b.jpg)

- 实时位置信息表 vehicle\_location

  ![](images/839587/4cb8b6e7dee4a97ede32213e25ef818e.jpg)

- 电池状态表 battery\_status

  ![](images/839587/88698f485c5a4d965a8788bea26c5e92.jpg)

- 电机状态表 motor\_status

  ![](images/839587/849b662cb13a3c796a477fd173f8439a.jpg)

- 故障告警表 vehicle\_alarm

  ![](images/839587/606b2ffae5fd2429a80d60a0e894865c.jpg)


- 行驶状态表 driving\_status

  ![](images/839587/07fd97cdd809198eecb6cab181099dd4.jpg)

## **问题设定**

我从车辆实时监控查询、电池健康状态分析、故障分析统计、行驶里程统计、性能监控预警、驾驶行为分析、地理分布分析、SOC 变化趋势分析、车辆综合性能评估等维度设置了一些常见的查询问题，一起来看一下。

### **车辆实时监控查询**

查询指定车辆最近5分钟的实时状态，包括位置、电量、速度等信息。

```plain
SELECT
    v.vin,
    v.model_name,
    d.car_status,
    l.speed,
    l.latitude,
    l.longitude,
    b.soc as battery_level,
    b.voltage as battery_voltage,
    m.motor_speed,
    m.motor_temperature,
    l.collect_time
FROM vehicle_base_info v
LEFT JOIN vehicle_location l ON v.vehicle_id = l.vehicle_id
LEFT JOIN battery_status b ON v.vehicle_id = b.vehicle_id
LEFT JOIN motor_status m ON v.vehicle_id = m.vehicle_id
LEFT JOIN driving_status d ON v.vehicle_id = d.vehicle_id
WHERE v.vehicle_id = 'VH00000001'
AND l.collect_time &gt;= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 5 MINUTE), '%Y-%m-%d %H:%i:%s.%f')
ORDER BY l.collect_time DESC
LIMIT 1;

// 说明： DATE_FORMAT 函数用于格式化日期和时间数据，使其按照指定的格式输出。在这个SQL查询中，DATE_FORMAT 与 DATE_SUB 结合使用来计算过去5分钟的时间点。

```

### **电池健康状态分析**

找出所有电池温度异常或电压异常的车辆。

```plain
SELECT
    v.model_name,
    COUNT(DISTINCT v.vehicle_id) as vehicle_count,
    AVG(b.soc) as avg_soc,
    MIN(b.min_cell_voltage) as min_cell_voltage,
    MAX(b.max_temperature) as max_temperature,
    COUNT(DISTINCT CASE WHEN b.max_temperature &gt; 40 THEN v.vehicle_id END) as high_temp_vehicles,
    COUNT(DISTINCT CASE WHEN b.min_cell_voltage &lt; 3.0 THEN v.vehicle_id END) as low_voltage_vehicles
FROM vehicle_base_info v
JOIN battery_status b ON v.vehicle_id = b.vehicle_id
WHERE b.collect_time &gt;= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 24 HOUR), '%Y-%m-%d %H:%i:%s.%f')
GROUP BY v.model_name
HAVING max_temperature &gt; 40 OR min_cell_voltage &lt; 3.0;

// 说明： 使用 JOIN 连接车辆和电池状态表，通过 HAVING 子句筛选出过去24小时内电池温度超过40℃或最低单体电压低于3.0V的车辆，并统计异常情况。

```

### **故障分析统计**

统计过去7天内各类故障的发生频率和影响车辆数。

```plain
SELECT
    alarm_module,
    alarm_level,
    COUNT(*) as alarm_count,
    COUNT(DISTINCT vehicle_id) as affected_vehicles,
    MIN(start_time) as first_occurrence,
    MAX(start_time) as last_occurrence,
    SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as active_alarms
FROM vehicle_alarm
WHERE start_time &gt;= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 7 DAY), '%Y-%m-%d %H:%i:%s.%f')
GROUP BY alarm_module, alarm_level
ORDER BY alarm_count DESC;

// 说明： 使用 GROUP BY 按故障模块和等级分类，统计过去7天内各类故障的发生次数、影响的车辆数及活跃告警，并通过 ORDER BY 按发生频率排序。

SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) 是一种常用的SQL技巧，用于条件聚合。这段代码的作用是统计那些 status 字段值为1（即告警持续中的情况）的记录数量。

```

### **行驶里程统计**

统计各车型的里程信息，包括平均里程和最高里程。

```plain
SELECT
    v.model_name,
    COUNT(DISTINCT v.vehicle_id) as vehicle_count,
    AVG(d.mileage) as avg_mileage,
    MAX(d.mileage) as max_mileage,
    MIN(d.mileage) as min_mileage,
    STDDEV(d.mileage) as mileage_stddev
FROM vehicle_base_info v
JOIN driving_status d ON v.vehicle_id = d.vehicle_id
GROUP BY v.model_name
ORDER BY avg_mileage DESC;

// 说明： 使用 JOIN 连接车辆基础信息和行驶状态表，通过 GROUP BY 按车型统计里程信息，包括平均、最高、最低里程及标准差，并按平均里程降序排列。

```

### **性能监控预警**

查找所有存在潜在性能问题的车辆（温度过高、电量过低等）。

```plain
SELECT
    v.vehicle_id,
    v.vin,
    v.model_name,
    m.motor_temperature,
    b.soc,
    b.max_temperature as battery_temp,
    d.car_status,
    CASE
        WHEN m.motor_temperature &gt; 80 THEN '电机温度过高'
        WHEN b.max_temperature &gt; 40 THEN '电池温度过高'
        WHEN b.soc &lt; 20 THEN '电量低'
        WHEN d.car_status = 3 THEN '车辆故障'
        ELSE '正常'
    END as warning_type
FROM vehicle_base_info v
JOIN motor_status m ON v.vehicle_id = m.vehicle_id
JOIN battery_status b ON v.vehicle_id = b.vehicle_id
JOIN driving_status d ON v.vehicle_id = d.vehicle_id
WHERE m.motor_temperature &gt; 80
   OR b.max_temperature &gt; 40
   OR b.soc &lt; 20
   OR d.car_status = 3;

// 说明： 使用 JOIN 连接多表，通过 CASE 语句识别潜在性能问题（如温度过高、电量低等），并筛选出存在问题的车辆，提供详细的警告类型。

```

### **驾驶行为分析**

分析不同驾驶模式下的用车特征。

```plain
SELECT
    v.model_name,
    d.driving_mode,
    COUNT(*) as mode_usage_count,
    AVG(d.accelerator_pedal) as avg_accelerator,
    AVG(d.brake_pedal) as avg_brake,
    AVG(l.speed) as avg_speed,
    MAX(l.speed) as max_speed,
    AVG(b.soc) as avg_battery_level
FROM vehicle_base_info v
JOIN driving_status d ON v.vehicle_id = d.vehicle_id
JOIN vehicle_location l ON v.vehicle_id = l.vehicle_id
JOIN battery_status b ON v.vehicle_id = b.vehicle_id
GROUP BY v.model_name, d.driving_mode
ORDER BY v.model_name, d.driving_mode;

// 说明：使用 JOIN 连接多表，按车型和驾驶模式分组，统计各模式下的使用频率及平均加速、刹车、速度和电量等特征，分析不同驾驶模式的用车行为。

```

### **地理分布分析**

分析车辆的地理分布密度。

```plain
SELECT
    ROUND(latitude, 2) as lat_region,
    ROUND(longitude, 2) as lon_region,
    COUNT(DISTINCT vehicle_id) as vehicle_count,
    AVG(speed) as avg_speed,
    COUNT(*) as location_records
FROM vehicle_location
WHERE collect_time &gt;= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 HOUR), '%Y-%m-%d %H:%i:%s.%f')
GROUP BY ROUND(latitude, 2), ROUND(longitude, 2)
HAVING vehicle_count &gt; 1
ORDER BY vehicle_count DESC;

// 说明：通过 ROUND 函数将经纬度四舍五入，按地理区域分组，统计每区域内车辆数量和平均速度，筛选出车辆密度较高的区域，并按密度降序排列。

```

### **SOC 变化趋势分析**

分析电量快速下降的情况。

```plain
WITH soc_changes AS (
    SELECT
        vehicle_id,
        collect_time,
        soc,
        LAG(soc) OVER (PARTITION BY vehicle_id ORDER BY collect_time) as prev_soc,
        LAG(collect_time) OVER (PARTITION BY vehicle_id ORDER BY collect_time) as prev_time
    FROM battery_status
)
SELECT
    v.vin,
    v.model_name,
    s.vehicle_id,
    s.collect_time,
    s.soc,
    s.prev_soc,
    s.soc - s.prev_soc as soc_drop,
    TIMESTAMPDIFF(MINUTE, s.prev_time, s.collect_time) as minutes_elapsed
FROM soc_changes s
JOIN vehicle_base_info v ON s.vehicle_id = v.vehicle_id
WHERE s.prev_soc IS NOT NULL
  AND (s.soc - s.prev_soc) &lt; -10  -- 找出SOC快速下降的情况
ORDER BY s.collect_time DESC;

// 说明：使用 LAG 窗口函数获取前一次的电量和时间，计算电量变化和时间差，筛选出电量快速下降（如降幅超过10%）的情况，并按采集时间降序排列。

```

### **综合性能评估**

对车辆进行综合性能评分。

```plain
SELECT
    v.vehicle_id,
    v.vin,
    v.model_name,
    AVG(b.soc) as avg_soc,
    MAX(l.speed) as max_speed,
    AVG(m.motor_temperature) as avg_motor_temp,
    COUNT(DISTINCT a.id) as alarm_count,
    AVG(d.mileage) as avg_mileage,
    CASE
        WHEN COUNT(DISTINCT a.id) = 0 AND AVG(b.soc) &gt; 50 THEN 'A'
        WHEN COUNT(DISTINCT a.id) &lt; 3 AND AVG(b.soc) &gt; 30 THEN 'B'
        ELSE 'C'
    END as performance_grade
FROM vehicle_base_info v
LEFT JOIN battery_status b ON v.vehicle_id = b.vehicle_id
LEFT JOIN vehicle_location l ON v.vehicle_id = l.vehicle_id
LEFT JOIN motor_status m ON v.vehicle_id = m.vehicle_id
LEFT JOIN vehicle_alarm a ON v.vehicle_id = a.vehicle_id
LEFT JOIN driving_status d ON v.vehicle_id = d.vehicle_id
GROUP BY v.vehicle_id, v.vin, v.model_name
ORDER BY performance_grade, avg_soc DESC;

// 说明：通过多表 LEFT JOIN 获取车辆的电量、速度、电机温度、告警次数和里程等数据，使用 CASE 语句综合评估并给出性能评分，按评分和平均电量排序。

```

如果你是新能源汽车行业的从业人员，这节课将对你非常有帮助。期待你的转发，我们下节课再见！