import{_ as a,H as n,f as e,i as p}from"./chunks/framework.BH2BK_3i.js";const _=JSON.parse('{"title":"加餐05｜SQL实战：新能源车企的数据查询与优化","description":"","frontmatter":{},"headers":[{"level":2,"title":"数据表","slug":"数据表","link":"#数据表","children":[]},{"level":2,"title":"问题设定","slug":"问题设定","link":"#问题设定","children":[{"level":3,"title":"车辆实时监控查询","slug":"车辆实时监控查询","link":"#车辆实时监控查询","children":[]},{"level":3,"title":"电池健康状态分析","slug":"电池健康状态分析","link":"#电池健康状态分析","children":[]},{"level":3,"title":"故障分析统计","slug":"故障分析统计","link":"#故障分析统计","children":[]},{"level":3,"title":"行驶里程统计","slug":"行驶里程统计","link":"#行驶里程统计","children":[]},{"level":3,"title":"性能监控预警","slug":"性能监控预警","link":"#性能监控预警","children":[]},{"level":3,"title":"驾驶行为分析","slug":"驾驶行为分析","link":"#驾驶行为分析","children":[]},{"level":3,"title":"地理分布分析","slug":"地理分布分析","link":"#地理分布分析","children":[]},{"level":3,"title":"SOC 变化趋势分析","slug":"soc-变化趋势分析","link":"#soc-变化趋势分析","children":[]},{"level":3,"title":"综合性能评估","slug":"综合性能评估","link":"#综合性能评估","children":[]}]}],"relativePath":"SQL必知必会/加餐05｜SQL实战：新能源车企的数据查询与优化.md","filePath":"SQL必知必会/加餐05｜SQL实战：新能源车企的数据查询与优化.md","lastUpdated":1779816304000}'),l={name:"SQL必知必会/加餐05｜SQL实战：新能源车企的数据查询与优化.md"};function i(t,s,c,o,d,r){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="加餐05-sql实战-新能源车企的数据查询与优化" tabindex="-1">加餐05｜SQL实战：新能源车企的数据查询与优化 <a class="header-anchor" href="#加餐05-sql实战-新能源车企的数据查询与优化" aria-label="Permalink to &quot;加餐05｜SQL实战：新能源车企的数据查询与优化&quot;">​</a></h1><p>你好，我是陈博士。今天我们来探讨一下新能源汽车企业的实时车况监控业务的数据查询与优化。</p><p>随着新能源汽车市场的迅速扩张，实时车况监控成为了确保车辆安全运行的关键环节。通过查询，我们可以即时掌握每辆车的健康状态，包括电池性能、电机效率以及潜在故障，这有助于车企提前做出维护决策。</p><p>针对该场景，我整理了6张数据表以及对应的查询问题。针对这些查询问题，你可以了解到这些SQL该如何撰写。</p><h2 id="数据表" tabindex="-1"><strong>数据表</strong> <a class="header-anchor" href="#数据表" aria-label="Permalink to &quot;**数据表**&quot;">​</a></h2><ul><li><p>车辆基础信息表 vehicle_base_info</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839587/622f7184aabb3f68ebb432ba05365e4b.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839587/622f7184aabb3f68ebb432ba05365e4b.jpg" alt=""></a></p></li><li><p>实时位置信息表 vehicle_location</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839587/4cb8b6e7dee4a97ede32213e25ef818e.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839587/4cb8b6e7dee4a97ede32213e25ef818e.jpg" alt=""></a></p></li><li><p>电池状态表 battery_status</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839587/88698f485c5a4d965a8788bea26c5e92.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839587/88698f485c5a4d965a8788bea26c5e92.jpg" alt=""></a></p></li><li><p>电机状态表 motor_status</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839587/849b662cb13a3c796a477fd173f8439a.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839587/849b662cb13a3c796a477fd173f8439a.jpg" alt=""></a></p></li><li><p>故障告警表 vehicle_alarm</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839587/606b2ffae5fd2429a80d60a0e894865c.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839587/606b2ffae5fd2429a80d60a0e894865c.jpg" alt=""></a></p></li><li><p>行驶状态表 driving_status</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839587/07fd97cdd809198eecb6cab181099dd4.jpg" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/SQL%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A/images/839587/07fd97cdd809198eecb6cab181099dd4.jpg" alt=""></a></p></li></ul><h2 id="问题设定" tabindex="-1"><strong>问题设定</strong> <a class="header-anchor" href="#问题设定" aria-label="Permalink to &quot;**问题设定**&quot;">​</a></h2><p>我从车辆实时监控查询、电池健康状态分析、故障分析统计、行驶里程统计、性能监控预警、驾驶行为分析、地理分布分析、SOC 变化趋势分析、车辆综合性能评估等维度设置了一些常见的查询问题，一起来看一下。</p><h3 id="车辆实时监控查询" tabindex="-1"><strong>车辆实时监控查询</strong> <a class="header-anchor" href="#车辆实时监控查询" aria-label="Permalink to &quot;**车辆实时监控查询**&quot;">​</a></h3><p>查询指定车辆最近5分钟的实时状态，包括位置、电量、速度等信息。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    v.vin,</span></span>
<span class="line"><span>    v.model_name,</span></span>
<span class="line"><span>    d.car_status,</span></span>
<span class="line"><span>    l.speed,</span></span>
<span class="line"><span>    l.latitude,</span></span>
<span class="line"><span>    l.longitude,</span></span>
<span class="line"><span>    b.soc as battery_level,</span></span>
<span class="line"><span>    b.voltage as battery_voltage,</span></span>
<span class="line"><span>    m.motor_speed,</span></span>
<span class="line"><span>    m.motor_temperature,</span></span>
<span class="line"><span>    l.collect_time</span></span>
<span class="line"><span>FROM vehicle_base_info v</span></span>
<span class="line"><span>LEFT JOIN vehicle_location l ON v.vehicle_id = l.vehicle_id</span></span>
<span class="line"><span>LEFT JOIN battery_status b ON v.vehicle_id = b.vehicle_id</span></span>
<span class="line"><span>LEFT JOIN motor_status m ON v.vehicle_id = m.vehicle_id</span></span>
<span class="line"><span>LEFT JOIN driving_status d ON v.vehicle_id = d.vehicle_id</span></span>
<span class="line"><span>WHERE v.vehicle_id = &#39;VH00000001&#39;</span></span>
<span class="line"><span>AND l.collect_time &amp;gt;= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 5 MINUTE), &#39;%Y-%m-%d %H:%i:%s.%f&#39;)</span></span>
<span class="line"><span>ORDER BY l.collect_time DESC</span></span>
<span class="line"><span>LIMIT 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明： DATE_FORMAT 函数用于格式化日期和时间数据，使其按照指定的格式输出。在这个SQL查询中，DATE_FORMAT 与 DATE_SUB 结合使用来计算过去5分钟的时间点。</span></span></code></pre></div><h3 id="电池健康状态分析" tabindex="-1"><strong>电池健康状态分析</strong> <a class="header-anchor" href="#电池健康状态分析" aria-label="Permalink to &quot;**电池健康状态分析**&quot;">​</a></h3><p>找出所有电池温度异常或电压异常的车辆。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    v.model_name,</span></span>
<span class="line"><span>    COUNT(DISTINCT v.vehicle_id) as vehicle_count,</span></span>
<span class="line"><span>    AVG(b.soc) as avg_soc,</span></span>
<span class="line"><span>    MIN(b.min_cell_voltage) as min_cell_voltage,</span></span>
<span class="line"><span>    MAX(b.max_temperature) as max_temperature,</span></span>
<span class="line"><span>    COUNT(DISTINCT CASE WHEN b.max_temperature &amp;gt; 40 THEN v.vehicle_id END) as high_temp_vehicles,</span></span>
<span class="line"><span>    COUNT(DISTINCT CASE WHEN b.min_cell_voltage &amp;lt; 3.0 THEN v.vehicle_id END) as low_voltage_vehicles</span></span>
<span class="line"><span>FROM vehicle_base_info v</span></span>
<span class="line"><span>JOIN battery_status b ON v.vehicle_id = b.vehicle_id</span></span>
<span class="line"><span>WHERE b.collect_time &amp;gt;= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 24 HOUR), &#39;%Y-%m-%d %H:%i:%s.%f&#39;)</span></span>
<span class="line"><span>GROUP BY v.model_name</span></span>
<span class="line"><span>HAVING max_temperature &amp;gt; 40 OR min_cell_voltage &amp;lt; 3.0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明： 使用 JOIN 连接车辆和电池状态表，通过 HAVING 子句筛选出过去24小时内电池温度超过40℃或最低单体电压低于3.0V的车辆，并统计异常情况。</span></span></code></pre></div><h3 id="故障分析统计" tabindex="-1"><strong>故障分析统计</strong> <a class="header-anchor" href="#故障分析统计" aria-label="Permalink to &quot;**故障分析统计**&quot;">​</a></h3><p>统计过去7天内各类故障的发生频率和影响车辆数。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    alarm_module,</span></span>
<span class="line"><span>    alarm_level,</span></span>
<span class="line"><span>    COUNT(*) as alarm_count,</span></span>
<span class="line"><span>    COUNT(DISTINCT vehicle_id) as affected_vehicles,</span></span>
<span class="line"><span>    MIN(start_time) as first_occurrence,</span></span>
<span class="line"><span>    MAX(start_time) as last_occurrence,</span></span>
<span class="line"><span>    SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as active_alarms</span></span>
<span class="line"><span>FROM vehicle_alarm</span></span>
<span class="line"><span>WHERE start_time &amp;gt;= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 7 DAY), &#39;%Y-%m-%d %H:%i:%s.%f&#39;)</span></span>
<span class="line"><span>GROUP BY alarm_module, alarm_level</span></span>
<span class="line"><span>ORDER BY alarm_count DESC;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明： 使用 GROUP BY 按故障模块和等级分类，统计过去7天内各类故障的发生次数、影响的车辆数及活跃告警，并通过 ORDER BY 按发生频率排序。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) 是一种常用的SQL技巧，用于条件聚合。这段代码的作用是统计那些 status 字段值为1（即告警持续中的情况）的记录数量。</span></span></code></pre></div><h3 id="行驶里程统计" tabindex="-1"><strong>行驶里程统计</strong> <a class="header-anchor" href="#行驶里程统计" aria-label="Permalink to &quot;**行驶里程统计**&quot;">​</a></h3><p>统计各车型的里程信息，包括平均里程和最高里程。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    v.model_name,</span></span>
<span class="line"><span>    COUNT(DISTINCT v.vehicle_id) as vehicle_count,</span></span>
<span class="line"><span>    AVG(d.mileage) as avg_mileage,</span></span>
<span class="line"><span>    MAX(d.mileage) as max_mileage,</span></span>
<span class="line"><span>    MIN(d.mileage) as min_mileage,</span></span>
<span class="line"><span>    STDDEV(d.mileage) as mileage_stddev</span></span>
<span class="line"><span>FROM vehicle_base_info v</span></span>
<span class="line"><span>JOIN driving_status d ON v.vehicle_id = d.vehicle_id</span></span>
<span class="line"><span>GROUP BY v.model_name</span></span>
<span class="line"><span>ORDER BY avg_mileage DESC;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明： 使用 JOIN 连接车辆基础信息和行驶状态表，通过 GROUP BY 按车型统计里程信息，包括平均、最高、最低里程及标准差，并按平均里程降序排列。</span></span></code></pre></div><h3 id="性能监控预警" tabindex="-1"><strong>性能监控预警</strong> <a class="header-anchor" href="#性能监控预警" aria-label="Permalink to &quot;**性能监控预警**&quot;">​</a></h3><p>查找所有存在潜在性能问题的车辆（温度过高、电量过低等）。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    v.vehicle_id,</span></span>
<span class="line"><span>    v.vin,</span></span>
<span class="line"><span>    v.model_name,</span></span>
<span class="line"><span>    m.motor_temperature,</span></span>
<span class="line"><span>    b.soc,</span></span>
<span class="line"><span>    b.max_temperature as battery_temp,</span></span>
<span class="line"><span>    d.car_status,</span></span>
<span class="line"><span>    CASE</span></span>
<span class="line"><span>        WHEN m.motor_temperature &amp;gt; 80 THEN &#39;电机温度过高&#39;</span></span>
<span class="line"><span>        WHEN b.max_temperature &amp;gt; 40 THEN &#39;电池温度过高&#39;</span></span>
<span class="line"><span>        WHEN b.soc &amp;lt; 20 THEN &#39;电量低&#39;</span></span>
<span class="line"><span>        WHEN d.car_status = 3 THEN &#39;车辆故障&#39;</span></span>
<span class="line"><span>        ELSE &#39;正常&#39;</span></span>
<span class="line"><span>    END as warning_type</span></span>
<span class="line"><span>FROM vehicle_base_info v</span></span>
<span class="line"><span>JOIN motor_status m ON v.vehicle_id = m.vehicle_id</span></span>
<span class="line"><span>JOIN battery_status b ON v.vehicle_id = b.vehicle_id</span></span>
<span class="line"><span>JOIN driving_status d ON v.vehicle_id = d.vehicle_id</span></span>
<span class="line"><span>WHERE m.motor_temperature &amp;gt; 80</span></span>
<span class="line"><span>   OR b.max_temperature &amp;gt; 40</span></span>
<span class="line"><span>   OR b.soc &amp;lt; 20</span></span>
<span class="line"><span>   OR d.car_status = 3;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明： 使用 JOIN 连接多表，通过 CASE 语句识别潜在性能问题（如温度过高、电量低等），并筛选出存在问题的车辆，提供详细的警告类型。</span></span></code></pre></div><h3 id="驾驶行为分析" tabindex="-1"><strong>驾驶行为分析</strong> <a class="header-anchor" href="#驾驶行为分析" aria-label="Permalink to &quot;**驾驶行为分析**&quot;">​</a></h3><p>分析不同驾驶模式下的用车特征。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    v.model_name,</span></span>
<span class="line"><span>    d.driving_mode,</span></span>
<span class="line"><span>    COUNT(*) as mode_usage_count,</span></span>
<span class="line"><span>    AVG(d.accelerator_pedal) as avg_accelerator,</span></span>
<span class="line"><span>    AVG(d.brake_pedal) as avg_brake,</span></span>
<span class="line"><span>    AVG(l.speed) as avg_speed,</span></span>
<span class="line"><span>    MAX(l.speed) as max_speed,</span></span>
<span class="line"><span>    AVG(b.soc) as avg_battery_level</span></span>
<span class="line"><span>FROM vehicle_base_info v</span></span>
<span class="line"><span>JOIN driving_status d ON v.vehicle_id = d.vehicle_id</span></span>
<span class="line"><span>JOIN vehicle_location l ON v.vehicle_id = l.vehicle_id</span></span>
<span class="line"><span>JOIN battery_status b ON v.vehicle_id = b.vehicle_id</span></span>
<span class="line"><span>GROUP BY v.model_name, d.driving_mode</span></span>
<span class="line"><span>ORDER BY v.model_name, d.driving_mode;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用 JOIN 连接多表，按车型和驾驶模式分组，统计各模式下的使用频率及平均加速、刹车、速度和电量等特征，分析不同驾驶模式的用车行为。</span></span></code></pre></div><h3 id="地理分布分析" tabindex="-1"><strong>地理分布分析</strong> <a class="header-anchor" href="#地理分布分析" aria-label="Permalink to &quot;**地理分布分析**&quot;">​</a></h3><p>分析车辆的地理分布密度。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    ROUND(latitude, 2) as lat_region,</span></span>
<span class="line"><span>    ROUND(longitude, 2) as lon_region,</span></span>
<span class="line"><span>    COUNT(DISTINCT vehicle_id) as vehicle_count,</span></span>
<span class="line"><span>    AVG(speed) as avg_speed,</span></span>
<span class="line"><span>    COUNT(*) as location_records</span></span>
<span class="line"><span>FROM vehicle_location</span></span>
<span class="line"><span>WHERE collect_time &amp;gt;= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 HOUR), &#39;%Y-%m-%d %H:%i:%s.%f&#39;)</span></span>
<span class="line"><span>GROUP BY ROUND(latitude, 2), ROUND(longitude, 2)</span></span>
<span class="line"><span>HAVING vehicle_count &amp;gt; 1</span></span>
<span class="line"><span>ORDER BY vehicle_count DESC;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：通过 ROUND 函数将经纬度四舍五入，按地理区域分组，统计每区域内车辆数量和平均速度，筛选出车辆密度较高的区域，并按密度降序排列。</span></span></code></pre></div><h3 id="soc-变化趋势分析" tabindex="-1"><strong>SOC 变化趋势分析</strong> <a class="header-anchor" href="#soc-变化趋势分析" aria-label="Permalink to &quot;**SOC 变化趋势分析**&quot;">​</a></h3><p>分析电量快速下降的情况。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>WITH soc_changes AS (</span></span>
<span class="line"><span>    SELECT</span></span>
<span class="line"><span>        vehicle_id,</span></span>
<span class="line"><span>        collect_time,</span></span>
<span class="line"><span>        soc,</span></span>
<span class="line"><span>        LAG(soc) OVER (PARTITION BY vehicle_id ORDER BY collect_time) as prev_soc,</span></span>
<span class="line"><span>        LAG(collect_time) OVER (PARTITION BY vehicle_id ORDER BY collect_time) as prev_time</span></span>
<span class="line"><span>    FROM battery_status</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>SELECT</span></span>
<span class="line"><span>    v.vin,</span></span>
<span class="line"><span>    v.model_name,</span></span>
<span class="line"><span>    s.vehicle_id,</span></span>
<span class="line"><span>    s.collect_time,</span></span>
<span class="line"><span>    s.soc,</span></span>
<span class="line"><span>    s.prev_soc,</span></span>
<span class="line"><span>    s.soc - s.prev_soc as soc_drop,</span></span>
<span class="line"><span>    TIMESTAMPDIFF(MINUTE, s.prev_time, s.collect_time) as minutes_elapsed</span></span>
<span class="line"><span>FROM soc_changes s</span></span>
<span class="line"><span>JOIN vehicle_base_info v ON s.vehicle_id = v.vehicle_id</span></span>
<span class="line"><span>WHERE s.prev_soc IS NOT NULL</span></span>
<span class="line"><span>  AND (s.soc - s.prev_soc) &amp;lt; -10  -- 找出SOC快速下降的情况</span></span>
<span class="line"><span>ORDER BY s.collect_time DESC;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：使用 LAG 窗口函数获取前一次的电量和时间，计算电量变化和时间差，筛选出电量快速下降（如降幅超过10%）的情况，并按采集时间降序排列。</span></span></code></pre></div><h3 id="综合性能评估" tabindex="-1"><strong>综合性能评估</strong> <a class="header-anchor" href="#综合性能评估" aria-label="Permalink to &quot;**综合性能评估**&quot;">​</a></h3><p>对车辆进行综合性能评分。</p><div class="language-plain vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">plain</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>SELECT</span></span>
<span class="line"><span>    v.vehicle_id,</span></span>
<span class="line"><span>    v.vin,</span></span>
<span class="line"><span>    v.model_name,</span></span>
<span class="line"><span>    AVG(b.soc) as avg_soc,</span></span>
<span class="line"><span>    MAX(l.speed) as max_speed,</span></span>
<span class="line"><span>    AVG(m.motor_temperature) as avg_motor_temp,</span></span>
<span class="line"><span>    COUNT(DISTINCT a.id) as alarm_count,</span></span>
<span class="line"><span>    AVG(d.mileage) as avg_mileage,</span></span>
<span class="line"><span>    CASE</span></span>
<span class="line"><span>        WHEN COUNT(DISTINCT a.id) = 0 AND AVG(b.soc) &amp;gt; 50 THEN &#39;A&#39;</span></span>
<span class="line"><span>        WHEN COUNT(DISTINCT a.id) &amp;lt; 3 AND AVG(b.soc) &amp;gt; 30 THEN &#39;B&#39;</span></span>
<span class="line"><span>        ELSE &#39;C&#39;</span></span>
<span class="line"><span>    END as performance_grade</span></span>
<span class="line"><span>FROM vehicle_base_info v</span></span>
<span class="line"><span>LEFT JOIN battery_status b ON v.vehicle_id = b.vehicle_id</span></span>
<span class="line"><span>LEFT JOIN vehicle_location l ON v.vehicle_id = l.vehicle_id</span></span>
<span class="line"><span>LEFT JOIN motor_status m ON v.vehicle_id = m.vehicle_id</span></span>
<span class="line"><span>LEFT JOIN vehicle_alarm a ON v.vehicle_id = a.vehicle_id</span></span>
<span class="line"><span>LEFT JOIN driving_status d ON v.vehicle_id = d.vehicle_id</span></span>
<span class="line"><span>GROUP BY v.vehicle_id, v.vin, v.model_name</span></span>
<span class="line"><span>ORDER BY performance_grade, avg_soc DESC;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 说明：通过多表 LEFT JOIN 获取车辆的电量、速度、电机温度、告警次数和里程等数据，使用 CASE 语句综合评估并给出性能评分，按评分和平均电量排序。</span></span></code></pre></div><p>如果你是新能源汽车行业的从业人员，这节课将对你非常有帮助。期待你的转发，我们下节课再见！</p>`,36)])])}const v=a(l,[["render",i]]);export{_ as __pageData,v as default};
