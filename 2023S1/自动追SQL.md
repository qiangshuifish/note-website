自动追新系统追价

```sql
SELECT '追原价POI数量（上周）' as `类型`, count(DISTINCT poi_id)  as `数量` from ias_trace_price_record 
where  date_key  <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 8 DAY), '%Y%m%d') 
and date_key >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 14 DAY), '%Y%m%d') 
and trace_price > 0 and type in (1)
UNION all
SELECT '删除原价POI数量（上周）' as `类型`, count(DISTINCT poi_id)  as `数量` from ias_trace_price_record 
where date_key <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 8 DAY), '%Y%m%d') 
and date_key >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 14 DAY), '%Y%m%d') 
and type in (2)
UNION all
SELECT '追原价POI数量' as `类型`,count(DISTINCT poi_id)  as `数量` from ias_trace_price_record 
where date_key <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 1 DAY), '%Y%m%d') 
and date_key >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 7 DAY), '%Y%m%d') 
and trace_price > 0 and type in (1)
UNION all
SELECT '删除原价POI数量' as `类型`,count(DISTINCT poi_id)  as `数量` from ias_trace_price_record 
where date_key <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 1 DAY), '%Y%m%d') 
and date_key >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 7 DAY), '%Y%m%d') 
and type in (2)

UNION all

SELECT '追商促价POI数量（上周）' as `类型`,count(DISTINCT poi_id)  as `数量` from ias_trace_price_record 
where date_key <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 8 DAY), '%Y%m%d') 
and date_key >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 14 DAY), '%Y%m%d') 
and trace_price > 0 and type in (3)
UNION all
SELECT '删除商促价POI数量（上周）' as `类型`,count(DISTINCT poi_id)  as `数量` from ias_trace_price_record 
where date_key <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 8 DAY), '%Y%m%d') 
and date_key >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 14 DAY), '%Y%m%d') 
and type in (4)
UNION all
SELECT '追商促价POI数量' as `类型`,count(DISTINCT poi_id)  as `数量` from ias_trace_price_record 
where date_key <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 1 DAY), '%Y%m%d') 
and date_key >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 7 DAY), '%Y%m%d') 
and trace_price > 0 and type in (3)
UNION all
SELECT '删除商促价POI数量' as `类型`,count(DISTINCT poi_id)  as `数量` from ias_trace_price_record 
where date_key <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 1 DAY), '%Y%m%d') 
and date_key >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 7 DAY), '%Y%m%d') 
and type in (4)
```



自动追新系统追房

```sql
SELECT '修改房态POI数量（上周）' as `类型`, count(DISTINCT poi_id)  as `数量` from ias_trace_room_record 
where  date_key  <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 8 DAY), '%Y%m%d') 
and date_key >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 14 DAY), '%Y%m%d') 
and change_room_status = 1  
UNION all
SELECT '修改库存POI数量（上周）' as `类型`, count(DISTINCT poi_id)  as `数量` from ias_trace_room_record 
where date_key <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 8 DAY), '%Y%m%d') 
and date_key >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 14 DAY), '%Y%m%d') 
and   change_inventory   > 0  
UNION all
SELECT '修改房态POI数量' as `类型`,count(DISTINCT poi_id)  as `数量` from ias_trace_room_record 
where date_key <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 1 DAY), '%Y%m%d') 
and date_key >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 7 DAY), '%Y%m%d') 
and change_room_status = 1  
UNION all
SELECT '修改库存POI数量' as `类型`,count(DISTINCT poi_id)  as `数量` from ias_trace_room_record 
where date_key <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 1 DAY), '%Y%m%d') 
and date_key >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 7 DAY), '%Y%m%d') 
and   change_inventory   > 0

```



老系统追房追价POI量

```sql
SELECT '追价POI量（上周）' as `类别`,count(DISTINCT mt_poi_id) as `数量` from comp_pega_trace_price_push2gc_record 
WHERE datekey <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 8 DAY), '%Y%m%d') and datekey >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 14 DAY), '%Y%m%d') and trace_price > 0
UNION ALL
SELECT '追价撤回POI量（上周）' as `类别`,count(DISTINCT mt_poi_id) as `数量` from comp_pega_trace_price_push2gc_record 
WHERE datekey <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 8 DAY), '%Y%m%d') and datekey >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 14 DAY), '%Y%m%d') and trace_price = 0
UNION ALL
SELECT '追价POI量' as `类别`,count(DISTINCT mt_poi_id) as `数量` from comp_pega_trace_price_push2gc_record 
WHERE datekey <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 1 DAY), '%Y%m%d') and datekey >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 7 DAY), '%Y%m%d') and trace_price > 0
UNION ALL
SELECT '追价撤回POI量' as `类别`,count(DISTINCT mt_poi_id) as `数量` from comp_pega_trace_price_push2gc_record 
WHERE datekey <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 1 DAY), '%Y%m%d') and datekey >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 7 DAY), '%Y%m%d') and trace_price = 0


UNION ALL
SELECT '追房开房POI量（上周）' as `类别`,count(DISTINCT mt_poi_id) as `数量` from comp_pega_trace_room_record 
WHERE datekey <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 8 DAY), '%Y%m%d') and datekey >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 14 DAY), '%Y%m%d') 
and trace_result = 200
UNION ALL
SELECT '追房修改库存POI量（上周）' as `类别`,count(DISTINCT mt_poi_id) as `数量` from comp_pega_trace_room_record 
WHERE datekey <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 8 DAY), '%Y%m%d') and datekey >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 14 DAY), '%Y%m%d') 
and trace_result = 200 AND trace_inv_real_volume > 0
UNION ALL
SELECT '追房开房POI量' as `类别`,count(DISTINCT mt_poi_id) as `数量` from comp_pega_trace_room_record 
WHERE datekey <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 1 DAY), '%Y%m%d') and datekey >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 7 DAY), '%Y%m%d') 
and trace_result = 200
UNION ALL
SELECT '追房修改库存POI量' as `类别`,count(DISTINCT mt_poi_id) as `数量` from comp_pega_trace_room_record 
WHERE datekey <= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 1 DAY), '%Y%m%d') and datekey >= DATE_FORMAT( DATE_SUB(CURDATE(), INTERVAL 7 DAY), '%Y%m%d') 
and trace_result = 200 AND trace_inv_real_volume > 0;
```



poi 总量统计

```sql
-- 追价的   change_sale_price   change_promotion_price
SELECT
  '追商促' as `类别`,count(DISTINCT poi_id)
FROM
  ias_vpoi_calculate_rule
WHERE
  scene_type = 1
  AND status = 1
  AND scene_id in (
    SELECT
      distinct scene_id
    FROM
      ias_scene_calculate_relation
    WHERE
      scene_type = 1
      AND (
        config like '%"strategyType":"change_promotion_price"%'
        OR config like '%"strategyType":"change_sale_promotion_price"%'
      )
  )
union all
-- 追原价
SELECT
  '追商促' as `类别`,count(DISTINCT poi_id)
FROM
  ias_vpoi_calculate_rule
WHERE
  scene_type = 1
  AND status = 1
  AND scene_id in (
    SELECT
      distinct scene_id
    FROM
      ias_scene_calculate_relation
    WHERE
      scene_type = 1
      AND (
        config like '%"strategyType":"change_sale_price"%'
        OR config like '%"strategyType":"change_sale_promotion_price"%'
      )
  )

  UNION ALL
  -- 追房
  SELECT
   '追原价' as `类别`,count(DISTINCT poi_id)
FROM
  ias_vpoi_calculate_rule
WHERE
  scene_type = 2
  AND status = 1
  AND scene_id in (
    SELECT
      distinct scene_id
    FROM
      ias_scene_calculate_relation
    WHERE
      scene_type = 2
  );
```







COE 故障统计

```sql
SELECT  DISTINCT mt_goods_id from (
SELECT  CONCAT(mt_goods_id,'-',check_in_date) as `goodsCheckIn`,mt_goods_id ,check_in_date  from (
SELECT
  record.mt_goods_id ,
  (record.trace_start_on + interval config.config minute) as `end_on`,
  record.trace_start_on,  
  record.trace_end_on,
  record.check_in_date
from
  ias_trace_price_record record
  LEFT JOIN (
    SELECT
      id,
      REPLACE(REPLACE(config, '{"freshness":', ''), '}', '') config
    from
      ias_scene_filter_relation
    WHERE
      filter_id = 18
      AND scene_id in (
        SELECT
          id
        from
          ias_scene
        WHERE
          type = 1
          and is_del != 1
      )
  ) config on record.scene_id
  and record.status = 99
  and date_key = 20221231
  and type = 3
  ) t
  where t.trace_end_on != t.end_on
  and t.end_on > '2023-01-01 00:00:00'
) tt
where tt.goodsCheckIn not in
 (
SELECT CONCAT(mt_goods_id,'-',check_in_date) from ias_trace_price_record WHERE date_key = 20230101 and type = 3
)
;

```

