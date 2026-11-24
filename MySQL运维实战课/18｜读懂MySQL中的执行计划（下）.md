# 18 | 读懂MySQL中的执行计划（下）

接上一讲

### POSSIBLE_KEYS

possible_keys 列显示查询单元能使用 range、ref 等访问路径访问的索引。执行计划最终选择的索引在 keys 列显示。是否使用索引，以及使用哪个索引，取决于优化器对各种访问方式的成本评估，还跟表连接的顺序和连接算法也有关系。

下面这个例子中，t1 表的 possible_keys 有索引 idx_abc，但是当 t1 表作为驱动表时，就无法使用索引 idx_abc。

```sql
mysql> explain select * from tab t1, tab t2 where t1.a = t2.a and t1.b = t2.b;
+----+-------------+-------+------+---------------+---------+---------+----------
| id | select_type | table | type | possible_keys | key     | key_len | ref
+----+-------------+-------+------+---------------+---------+---------+----------
|  1 | SIMPLE      | t1    | ALL  | idx_abc       | NULL    | NULL    | NULL
|  1 | SIMPLE      | t2    | ref  | idx_abc       | idx_abc | 8       | rep.t1.a,
+----+-------------+-------+------+---------------+---------+---------+----------
```

### KEY

key 列显示执行计划实际使用的索引。如果 key 列为 NULL，则说明查询单元没有使用索引。对于 index_merge 访问路径，key 列中会显示多个索引。

### KEY_LEN

key_len 列显示执行计划使用到的索引列的总长度。根据 key_len 可以推算出执行计划使用到了索引中的哪几个字段。key_len 根据索引字段的类型和字段是否为空计算得到。对于字符类型如 varchar、char，key_len 为字符数乘以单个字符的最大可能字节数。对于每个可变长类型如 varchar，key_len 额外加 2。对于每个可以为空的字段，key_len 额外加 1。

```sql
create table t_k(
    a varchar(20),
    b char(20),
    key idx_a(a,b)
) engine=innodb charset=utf8mb4;
mysql> explain select * from t_k where  a='x';
+----+-------------+-------+------+---------------+-------+---------+-------+----
| id | select_type | table | type | possible_keys | key   | key_len | ref   | row
+----+-------------+-------+------+---------------+-------+---------+-------+----
|  1 | SIMPLE      | t_k   | ref  | idx_a         | idx_a | 83      | const |
+----+-------------+-------+------+---------------+-------+---------+-------+----
mysql> explain select * from t_k where  a='x' and b='x';
+----+-------------+-------+------+---------------+-------+---------+------------
| id | select_type | table | type | possible_keys | key   | key_len | ref
+----+-------------+-------+------+---------------+-------+---------+------------
|  1 | SIMPLE      | t_k   | ref  | idx_a         | idx_a | 164     | const,const
+----+-------------+-------+------+---------------+-------+---------+------------
```

上面这个例子中，SQL 1 使用索引中的字段 a，字段 A 的类型为 varchar(20)，字符集为utf8mb4，key_len 为 20 * 4 + 2 + 1 = 83。

SQL 2 使用到了字段 A 和 B，字段 A 的 key_len 为 83，字段 B 的 key_len 为 20 * 4 + 1 =81，整体 Key_len 为字段 A 和字段 B 相加 164。

### REF

ref 列显示用来进行索引查找的值，ref 的取值可能是以下几种情况：

- const：使用常量匹配

- db.tab.c：使用驱动表的某个字段匹配

- func：使用某个函数的计算结果匹配。可以在执行 explain 后使用 show warnings 命令查看转换后的 SQL。

### ROWS

查询单元需要访问的记录数。对于 InnoDB 引擎，这里的记录数是一个预估的行数，跟实际执行过程中真实访问的记录数可能会有一些差异。对于全表扫描和全索引扫描，这里的行数从统计信息中获取。对于索引访问（type 为 ref 或 range），rows 通过访问索引评估得到，或通过索引的统计信息计算得到。对应派生表，rows 通过一些规则评估得到。

一般来说，rows 越大，说明查询单元需要访问的记录数越多，执行时间越长。

### FILTERED

filtered 字段单位为百分比，取值范围为 0-100，表示经过 where 子句中的条件过滤后，满足条件的记录数相对于 rows 列中显示的行数所占的百分比。使用公示 rows * filtered / 100 可以得到优化器预估的查询单元返回的记录数。如果当前的查询单元作为驱动表，那么这里的记录数还决定了被驱动的查询单元需要执行多次。

优化器中有一系列固定的规则来计算 filtered 的取值。你可以在分析表（analyze table）的时候给字段添加直方图，使优化器能更精确地计算 filtered。参数 optimizer_switch 中的选项condition_fanout_filter 用来控制是否开启条件过滤。

### EXTRA

Extra 列中显示了执行计划额外的一些重要信息。

- using where

如果访问路径为 ALL 或 index，Extra 中没用 using where，说明查询需要读取整个表或索引的数据。

- Range checked for each record (index map: 0x n)

如果 Extra 中出现了“Range checked for each record”，那么查询的性能很可能不太好。这里index map 是索引编号的位图信息。

```sql
mysql> explain select * from tab a, tab b where  a.id > b.id and a.c > b.c;
+----+-------------+-------+------+---------------+------+---------+------+------
| id | select_type | table | type | possible_keys | key  | key_len | ref  | rows
+----+-------------+-------+------+---------------+------+---------+------+------
|  1 | SIMPLE      | a     | ALL  | PRIMARY       | NULL | NULL    | NULL | 9913
|  1 | SIMPLE      | b     | ALL  | PRIMARY       | NULL | NULL    | NULL | 9913
+----+-------------+-------+------+---------------+------+---------+------+------
```

- Using index; Using temporary

Extra 中出现 Using temporary，说明用到了临时表。

```sql
mysql> explain select b,a,count(*) from  tab group by b,a;
+----+-------------+-------+-------+---------------+---------+---------+------+--
| id | select_type | table | type  | possible_keys | key     | key_len | ref  | r
+----+-------------+-------+-------+---------------+---------+---------+------+--
|  1 | SIMPLE      | tab   | index | idx_abc       | idx_abc | 12      | NULL | 9
+----+-------------+-------+-------+---------------+---------+---------+------+--
```

- Using index for skip scan

查询条件没有传入索引的前缀字段，又用到了覆盖索引时，MySQL 可能会使用 skip scan。如果前缀列的唯一值很低，skip scan 也可能会有不错的性能。

```sql
mysql> explain select c from tab where b=1;
+----+-------------+-------+-------+---------------+---------+---------+------+--
| id | select_type | table | type  | possible_keys | key     | key_len | ref  | r
+----+-------------+-------+-------+---------------+---------+---------+------+--
|  1 | SIMPLE      | tab   | range | idx_abc       | idx_abc | 8       | NULL |
+----+-------------+-------+-------+---------------+---------+---------+------+--
```

- Using index

使用了覆盖索引，也就是查询中所有列都包含在索引中。

- no matching row in const table

说明表里面不存在满足条件的记录。

```sql
mysql> explain select * from tab where id = 12345;
+----+-------------+-------------+---------------+------+---------+------+------+
| id | select_type | table  type | possible_keys | key  | key_len | ref  | rows |
+----+-------------+-------------+---------------+------+---------+------+------+
|  1 | SIMPLE      | NULL   NULL | NULL          | NULL | NULL    | NULL | NULL |
+----+-------------+-------------+---------------+------+---------+------+------+
```

- Using index for group-by

```sql
mysql> explain select a, min(b) from tab group by a;
+----+-------------+-------+-------+---------------+---------+---------+------+--
| id | select_type | table | type  | possible_keys | key     | key_len | ref  | r
+----+-------------+-------+-------+---------------+---------+---------+------+--
|  1 | SIMPLE      | tab   | range | idx_abc       | idx_abc | 4       | NULL |
+----+-------------+-------+-------+---------------+---------+---------+------+--
```

- LooseScan

LooseScan，以及 FirstMatch、Start temporary、End temporary，都是子查询自动改写为表连接后的执行方式，我们在后续的子查询这一讲中再具体介绍。

```sql
mysql> set optimizer_switch='materialization=off';
Query OK, 0 rows affected (0.01 sec)
mysql> explain select * from tab ta
 where a=1 and c in (select a from tab tb);
+----+-------------+-------+-------+---------------+---------+---------+-------+-
| id | select_type | table | type  | possible_keys | key     | key_len | ref   |
+----+-------------+-------+-------+---------------+---------+---------+-------+-
|  1 | SIMPLE      | tb    | index | idx_abc       | idx_abc | 12      | NULL  |
|  1 | SIMPLE      | ta    | ref   | idx_abc       | idx_abc | 4       | const |
+----+-------------+-------+-------+---------------+---------+---------+-------+-
```

- FirstMatch(ta)

```sql
mysql> set optimizer_switch='materialization=off';
Query OK, 0 rows affected (0.01 sec)
mysql> explain select * from tab ta where a=1 and c in (select c from tab tb);
+----+-------------+-------+-------+---------------+---------+---------+-------+-
| id | select_type | table | type  | possible_keys | key     | key_len | ref   |
+----+-------------+-------+-------+---------------+---------+---------+-------+-
|  1 | SIMPLE      | ta    | ref   | idx_abc       | idx_abc | 4       | const |
|  1 | SIMPLE      | tb    | index | NULL          | idx_abc | 12      | NULL  |
+----+-------------+-------+-------+---------------+---------+---------+-------+-
```

- Start temporary, End temporary

```sql
mysql> set optimizer_switch='materialization=off';
Query OK, 0 rows affected (0.01 sec)
mysql> explain select * from tab ta where id in (select b from tab tb where b < 1
+----+-------------+-------+--------+---------------+---------+---------+--------
| id | select_type | table | type   | possible_keys | key     | key_len | ref
+----+-------------+-------+--------+---------------+---------+---------+--------
|  1 | SIMPLE      | tb    | index  | NULL          | idx_abc | 12      | NULL
|  1 | SIMPLE      | ta    | eq_ref | PRIMARY       | PRIMARY | 4       | rep.tb.
+----+-------------+-------+--------+---------------+---------+---------+--------
```

- Using index condition

使用到了索引下推条件。

```sql
mysql> explain select * from tab where a=1 and c=1;
+----+-------------+-------+------+---------------+---------+---------+-------+--
| id | select_type | table | type | possible_keys | key     | key_len | ref   | r
+----+-------------+-------+------+---------------+---------+---------+-------+--
|  1 | SIMPLE      | tab   | ref  | idx_abc       | idx_abc | 4       | const | 3
+----+-------------+-------+------+---------------+---------+---------+-------+--
```

- Using filesort

说明查询需要排序。

```sql
mysql> explain select * from tab order by b;
+----+-------------+-------+------+---------------+------+---------+------+------
| id | select_type | table | type | possible_keys | key  | key_len | ref  | rows
+----+-------------+-------+------+---------------+------+---------+------+------
|  1 | SIMPLE      | tab   | ALL  | NULL          | NULL | NULL    | NULL | 9913
+----+-------------+-------+------+---------------+------+---------+------+------
```

- Using join buffer (hash join)

被驱动表缺少合适的索引时，MySQL 会考虑使用 Hash 连接算法。

```sql
mysql> explain select * from tab t1, tab t2 where t1.a = 1 and t1.c=t2.c;
+----+-------------+-------+------+---------------+---------+---------+-------+--
| id | select_type | table | type | possible_keys | key     | key_len | ref   | r
+----+-------------+-------+------+---------------+---------+---------+-------+--
|  1 | SIMPLE      | t1    | ref  | idx_abc       | idx_abc | 4       | const | 3
|  1 | SIMPLE      | t2    | ALL  | NULL          | NULL    | NULL    | NULL  | 9
+----+-------------+-------+------+---------------+---------+---------+-------+--
```

- Using join buffer (Batched Key Access)

表关联时，使用了 BKA 优化。和 MRR 类似，BKA 也是为了减少查询的随机 IO 的数量。

```sql
mysql> explain select /*+ BKA(tb) */ *
 from tab ta, tab tb where ta.a = tb.a;
+----+-------------+-------+------+---------------+---------+---------+----------
| id | select_type | table | type | possible_keys | key     | key_len | ref
+----+-------------+-------+------+---------------+---------+---------+----------
|  1 | SIMPLE      | ta    | ALL  | idx_abc       | NULL    | NULL    | NULL
|  1 | SIMPLE      | tb    | ref  | idx_abc       | idx_abc | 4       | rep.ta.a
+----+-------------+-------+------+---------------+---------+---------+----------
```

- Using MRR

查询使用了 MRR（Multi-Range Read），MRR 主要是为了减少回表查询数据时随机 IO 的数量。下面这个例子中使用了 BKA 提示，强制优化器使用 MRR。

```sql
mysql> explain select /*+ BKA(tab) */ *
 from tab
 where a=1 and b in (1,2,3);
+----+-------------+-------+-------+---------------+---------+---------+------+--
| id | select_type | table | type  | possible_keys | key     | key_len | ref  | r
+----+-------------+-------+-------+---------------+---------+---------+------+--
|  1 | SIMPLE      | tab   | range | idx_abc       | idx_abc | 8       | NULL |
+----+-------------+-------+-------+---------------+---------+---------+------+--
```

- Using sort_union(…), Using union(…), Using intersect(…)

```sql
mysql> explain select *
 from t_merge
 where b=2 and c=2 and d=1;
+----+-------------+---------+-------------+---------------+---------------+-----
| id | select_type | table   | type        | possible_keys | key           | key_
+----+-------------+---------+-------------+---------------+---------------+-----
|  1 | SIMPLE      | t_merge | index_merge | idx_bd,idx_cd | idx_cd,idx_bd | 8,8
+----+-------------+---------+-------------+---------------+---------------+-----
mysql> explain select *
 from t_merge
 where (b=2 and d=1) or (c=2 and d=1);
+----+-------------+---------+-------------+---------------+---------------+-----
| id | select_type | table   | type        | possible_keys | key           | key_
+----+-------------+---------+-------------+---------------+---------------+-----
|  1 | SIMPLE      | t_merge | index_merge | idx_bd,idx_cd | idx_bd,idx_cd | 8,8
+----+-------------+---------+-------------+---------------+---------------+-----
mysql> explain select *
 from t_merge
 where (b=2 and d between 1 and 2) or (d=1 and c=2);
+----+-------------+---------+-------------+---------------+---------------+-----
| id | select_type | table   | type        | possible_keys | key           | key_
+----+-------------+---------+-------------+---------------+---------------+-----
|  1 | SIMPLE      | t_merge | index_merge | idx_bd,idx_cd | idx_bd,idx_cd | 8,8
+----+-------------+---------+-------------+---------------+---------------+-----
```

## 总结

出于完整性的考虑，这一讲中我们使用了四十多个 SQL 语句，演示并解释了 MySQL 执行计划的各种输出。在实际工作中，一般也不会遇到这里的每一种情况。

执行计划有几个信息要重点关注：

- 通过 ID、SELECT_TYPE、TABLE 这几列可以了解语句整体的连接、嵌套结构。

- TYPE 列为 ref、range 时，才是我们平时说的用到了索引。type 为 index 时，实际上是使用了全索引扫描。

- ROWS 列是优化器评估的需要从到存储引擎里访问的记录的数量，这个数量对性能有直接的影响。

- EXTRA 列里面提供了执行计划的额外信息，对这里出现的内容要有大致的了解。

你也可以使用 FORMAT=TREE，以树的形式显示执行计划，有时候这样可能会更直观。

## 思考题

这一讲中有这么一个 SQL：

```sql
select id, a, (select avg(b) from tab where a=t1.a) from tab t1;
```

在我们的测试表中，字段 A 的唯一值有三个，所以理论上，最优的情况下只需要将 3 个不同的 A 的值分别传入子查询中（select avg(b) from tab where a = t1.a），并将计算结果缓存起来，这样子查询只需要执行 3 次。

MariaDB 实际上就有这样的处理，因此在执行上面这个 SQL 时，速度比较快。

```sql
mariadb> select id, a, (select avg(b) from tab where a=t1.a) from tab t1 order by
+------+---+---------------------------------------+
| id   | a | (select avg(b) from tab where a=t1.a) |
+------+---+---------------------------------------+
|    0 | 0 |                             4999.5000 |
|    1 | 1 |                             4999.0000 |
|    2 | 2 |                             5000.0000 |
......
| 9999 | 0 |                             4999.5000 |
+------+---+---------------------------------------+
10000 rows in set (0.01 sec)
```

但是 MySQL 中，同样的表结构和数据，配置一样的服务器，执行这个 SQL 时，执行时间是好几个数量级。

```sql
mysql> select id, a, (select avg(b) from tab where a=t1.a) from tab t1 order by i
+------+------+---------------------------------------+
| id   | a    | (select avg(b) from tab where a=t1.a) |
+------+------+---------------------------------------+
|    0 |    0 |                             4999.5000 |
|    1 |    1 |                             4999.0000 |
|    2 |    2 |                             5000.0000 |
......
| 9999 |    0 |                             4999.5000 |
+------+------+---------------------------------------+
10000 rows in set (4 min 17.90 sec)
```

对于这种情况，你会怎么解决呢？

期待你的思考，欢迎在留言区中与我交流。如果今天的课程让你有所收获，也欢迎转发给有需要的朋友。我们下节课再见！
