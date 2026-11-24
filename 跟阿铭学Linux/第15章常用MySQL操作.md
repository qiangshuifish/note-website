# 第15章常用MySQL操作

前面阿铭已经介绍过 MySQL 的安装了，但是光会安装还不够，作为一个 Linux 运维工程师，你还需要掌握一些基本的操作，以满足日常管理工作所需。至于更深层次的内容，那是 DBA（专门管理数据库的技术人员）所必须掌握的。

## 15.1 更改 MySQL 数据库 root 的密码

在前一章刚安装完 MySQL，我们已经将 MySQL 的 root 用户密码修改为了 aminglinux.com，登录时需要使用该密码才能登录，如下所示：

```
# /usr/local/mysql/bin/mysql –uroot –p
/usr/local/mysql/bin/mysql: error while loading shared libraries: libncurses.so.5
```

结果报错了，这是因为阿铭的系统少一个库文件。解决办法为：

```
# yum install -y ncurses-compat-libs
```

继续刚才的命令：

```
# /usr/local/mysql/bin/mysql –uroot –p
Enter password:
Welcome to the MySQL monitor. Commands end with ; or \g.
Your MySQL connection id is 3
Server version: 5.7.29-log MySQL Community Server (GPL)
Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.
Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
mysql>
输入正确的密码后，进入到了 MySQL 命令行界面里。退出时直接输入quit或者exit即可。
```

细心的读者应该会发现，阿铭在上一条命令中使用的是绝对路径，这样很不方便。但是只单独

```
输入一个mysql命令是不行的，因为 /usr/local/mysql/bin 不在PATH这个环境变量里。那么如
何把它加入环境变量PATH中呢？方法如下：
# PATH=$PATH:/usr/local/mysql/bin
```

但重启 Linux 后还会失效，所以需要让它开机加载，如下所示：

```
# echo "PATH=$PATH:/usr/local/mysql/bin" >> /etc/profile
# source /etc/profile
# mysql -uroot -p
Enter password:
Welcome to the MySQL monitor. Commands end with ; or \g.
Your MySQL connection id is 4
Server version: 5.7.29-log MySQL Community Server (GPL)
Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.
Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
mysql>
```

```
阿铭再来解释一下上一条命令中-u的含义，它用来指定要登录的用户，后面有无空格均可。
root 用户是 MySQL 自带的管理员用户，-p后面应该跟密码，如果没有跟，就需要手动输入。
```

我们还可以直接将密码放到命令里，但这样就不太安全了：

```
# mysql -uroot -p'aminglinux.com'
mysql: [Warning] Using a password on the command line interface can be insecure.
```

我们同时得到一个警告。那么如何给 root 用户更改密码呢？操作方法如下：

```
# mysqladmin -uroot -p'aminglinux.com' password 'linux.org'
mysqladmin: [Warning] Using a password on the command line interface can be insec
Warning: Since password will be sent to server in plain text, use ssl connection
```

这样就给 MySQL 的 root 用户更改了密码，注意在生产环境中不要设置这么简单的密码。在执行命令过程中它会返回一条警告信息，意思是在命令行下面暴露了密码，这样不安全。接下来使用新密码登录，如下所示：

```
# mysql -uroot -p'linux.org'
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor. Commands end with ; or \g.
Your MySQL connection id is 7
Server version: 5.7.29-log MySQL Community Server (GPL)
Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.
Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
mysql>
输入密码时需要加-p选项，后面可以直接跟密码。-p选项后面不可以有空格，密码可以不加
```

单引号（但是密码中有特殊字符时就会出问题，所以最好还是加上单引号）。

也许你会遇到忘记 root 密码的情况，此时就需要另外一种方法了。具体步骤如下。

1) 更改配置文件：

```
# vi /etc/my.cnf // 增加一行
skip-grant-tables
```

2) 重启 MySQL：

```
# /etc/init.d/mysqld restart
```

3) 修改 MySQL 库的 user 表：

```sql
# mysql -uroot // 此时不需要root密码就可以进入到mysql
Welcome to the MySQL monitor. Commands end with ; or \g.
Your MySQL connection id is 3
Server version: 5.7.29-log MySQL Community Server (GPL)
Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.
Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
mysql> UPDATE mysql.user SET authentication_string=PASSWORD('aming123') WHERE use
Query OK, 1 row affected, 1 warning (0.06 sec)
Rows matched: 1 Changed: 1 Warnings: 1
```

4) 修改配置文件：

```
编辑 /etc/my.cnf，将刚刚增加的skip-grant-tables去掉。
```

5) 重启 MySQL：

```
# /etc/init.d/mysqld restart
```

6) 使用新密码登录：

```
# mysql -uroot -p'aming123'
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor. Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.7.29-log MySQL Community Server (GPL)
Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.
Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
mysql>
```

此时，可以使用新密码登录 MySQL 了。

## 15.2 连接数据库

```
你可以使用命令mysql -u root -p连接数据库，但这样连接的只是本地数据库
localhost。很多时候需要连接网络中某一个主机上的 MySQL，如下所示：
# mysql -uroot -p -h192.168.72.128 -P3306
Enter password:
其中，后面的-P（大写）用来指定远程主机 MySQL 的绑定端口，默认都是 3306；-h用来指
定远程主机的 IP。除了-h指定远程主机外，还可以用-S来指定 socket 文件连接 MySQL，如
```

下所示：

```
# mysql -uroot -S/tmp/mysql.sock -p
Enter password:
```

这个 socket 文件是 Linux 系统中进程之间用来通信的文件。

## 15.3 MySQL 基本操作的常用命令

在日常工作中，难免会遇到一些与 MySQL 相关的操作, 比如建库、建表、查询 MySQL 状态等。尽管我们不是专业的数据库管理员，但是最基本的操作还是要掌握的。

### 15.3.1 查询当前库

查询当前库的命令如下：

```
mysql> show databases;
+--------------------+
| Database |
+--------------------+
| information_schema |
| mysql |
| performance_schema |
| sys |
+--------------------+
4 rows in set (0.05 sec)
注意mysql命令的结尾处需要加一个分号。
```

### 15.3.2 查询某个库的表

首先需要切换到某个库里，如下所示：

```
mysql> use mysql;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A
Database changed
```

在切换库的时候，它提示这个操作会把当前库里的所有表的字段全部读一遍，你可以在启动

```
MySQL 的时候加上-A选项关闭这个特性（其实这个特性倒也不影响什么，你可以忽略它）。
```

然后再把表列出来，如下所示：

```
mysql> show tables;
+---------------------------+
| Tables_in_mysql |
+---------------------------+
| columns_priv |
| db |
| engine_cost |
| event |
| func |
| general_log |
| gtid_executed |
| help_category |
| help_keyword |
| help_relation |
| help_topic |
| innodb_index_stats |
| innodb_table_stats |
| ndb_binlog_index |
| plugin |
| proc |
| procs_priv |
| proxies_priv |
| server_cost |
| servers |
| slave_master_info |
| slave_relay_log_info |
| slave_worker_info |
| slow_log |
| tables_priv |
| time_zone |
| time_zone_leap_second |
| time_zone_name |
| time_zone_transition |
| time_zone_transition_type |
| user |
+---------------------------+
31 rows in set (0.00 sec)
```

### 15.3.3 查看某个表的全部字段

查看表的全部字段的命令如下：

```
mysql> desc db;
+-----------------------+---------------+------+-----+---------+-------+
| Field | Type | Null | Key | Default | Extra |
+-----------------------+---------------+------+-----+---------+-------+
| Host | char(60) | NO | PRI | | |
| Db | char(64) | NO | PRI | | |
| User | char(32) | NO | PRI | | |
| Select_priv | enum('N','Y') | NO | | N | |
| Insert_priv | enum('N','Y') | NO | | N | |
| Update_priv | enum('N','Y') | NO | | N | |
| Delete_priv | enum('N','Y') | NO | | N | |
| Create_priv | enum('N','Y') | NO | | N | |
| Drop_priv | enum('N','Y') | NO | | N | |
| Grant_priv | enum('N','Y') | NO | | N | |
| References_priv | enum('N','Y') | NO | | N | |
| Index_priv | enum('N','Y') | NO | | N | |
| Alter_priv | enum('N','Y') | NO | | N | |
| Create_tmp_table_priv | enum('N','Y') | NO | | N | |
| Lock_tables_priv | enum('N','Y') | NO | | N | |
| Create_view_priv | enum('N','Y') | NO | | N | |
| Show_view_priv | enum('N','Y') | NO | | N | |
| Create_routine_priv | enum('N','Y') | NO | | N | |
| Alter_routine_priv | enum('N','Y') | NO | | N | |
| Execute_priv | enum('N','Y') | NO | | N | |
| Event_priv | enum('N','Y') | NO | | N | |
| Trigger_priv | enum('N','Y') | NO | | N | |
+-----------------------+---------------+------+-----+---------+-------+
22 rows in set (0.00 sec)
```

另外，也可以使用下面这条命令，显示的信息会更详细，而且还可以把建表语句全部列出来，如下所示：

```sql
mysql> show create table db\G
*************************** 1. row ***************************
Table: db
Create Table: CREATE TABLE `db` (
`Host` char(60) COLLATE utf8_bin NOT NULL DEFAULT '',
`Db` char(64) COLLATE utf8_bin NOT NULL DEFAULT '',
`User` char(32) COLLATE utf8_bin NOT NULL DEFAULT '',
`Select_priv` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
`Insert_priv` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
`Update_priv` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
`Delete_priv` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
`Create_priv` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
`Drop_priv` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
`Grant_priv` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
`References_priv` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
`Index_priv` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
`Alter_priv` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
`Create_tmp_table_priv` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
`Lock_tables_priv` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
`Create_view_priv` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
`Show_view_priv` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
`Create_routine_priv` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
`Alter_routine_priv` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
`Execute_priv` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
`Event_priv` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
`Trigger_priv` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
PRIMARY KEY (`Host`,`Db`,`User`),
KEY `User` (`User`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Database privilege
1 row in set (0.00 sec)
这条命令后面加了一个\G，目的是让列出来的结果竖排显示，这样看起来更清晰；如果不加
\G，会有点乱。
```

### 15.3.4 查看当前是哪个用户

查看当前用户的命令如下：

```sql
mysql> select user();
+----------------+
| user() |
+----------------+
| root@localhost |
+----------------+
1 row in set (0.00 sec)
```

### 15.3.5 查看当前所使用的数据库

查看当前数据库的命令如下：

```sql
mysql> select database();
+------------+
| database() |
+------------+
| mysql |
+------------+
1 row in set (0.00 sec)
```

### 15.3.6 创建一个新库

新建一个库的命令如下：

```
mysql> create database db1;
Query OK, 1 row affected (0.05 sec)
```

### 15.3.7 创建一个新表

新建一个表的命令如下：

```sql
mysql> use db1;
Database changed
mysql> create table t1 (`id` int(4), `name` char(40));
Query OK, 0 rows affected (0.06 sec)
注意，这里的字段名id和name需要用反引号括起来。
```

### 15.3.8 查看当前数据库的版本

查看 MySQL 版本的命令如下：

```sql
mysql> select version();
+------------+
| version() |
+------------+
| 5.7.29-log |
+------------+
1 row in set (0.00 sec)
```

### 15.3.9 查看 MySQL 的当前状态

查看 MySQL 当前状态的命令如下：

```
mysql> show status;
+-----------------------------------------------+-------------+
| Variable_name | Value |
+-----------------------------------------------+-------------+
| Aborted_clients | 0 |
| Aborted_connects | 2 |
| Binlog_cache_disk_use | 0 |
| Binlog_cache_use | 0 |
| Binlog_stmt_cache_disk_use | 0 |
| Binlog_stmt_cache_use | 3 |
| Bytes_received | 1229 |
| Bytes_sent | 41129 |
| Com_admin_commands | 0 |
| Com_assign_to_keycache | 0 |
| Com_alter_db | 0 |
| Com_alter_db_upgrade | 0 |
```

由于内容太长，阿铭没有列出全部信息，感兴趣的话可以上网搜索一下其中每一行的含义。

### 15.3.10 查看 MySQL 的参数

查看 MySQL 各参数的命令如下：

```
mysql> show variables;
+-----------------------------------------+---------------------+
| Variable_name | Value |
+-----------------------------------------+---------------------+
| auto_increment_increment | 1 |
| auto_increment_offset | 1 |
| autocommit | ON |
| automatic_sp_privileges | ON |
| back_log | 50 |
| basedir | /usr/local/mysql/ |
```

限于篇幅，阿铭没有列出全部参数。其中有很多参数是可以在 /etc/my.cnf 文件中定义的，并且有部分参数是可以在线编辑的。

### 15.3.11 修改 MySQL 的参数

```
举例来说，修改参数max_connect_errors的操作方法如下：
mysql> show variables like 'max_connect%';
+--------------------+-------+
| Variable_name | Value |
+--------------------+-------+
| max_connect_errors | 100 |
| max_connections | 151 |
+--------------------+-------+
2 rows in set (0.01 sec)
mysql> set global max_connect_errors = 1000;
Query OK, 0 rows affected (0.00 sec)
mysql> show variables like 'max_connect_errors';
+--------------------+-------+
| Variable_name | Value |
+--------------------+-------+
| max_connect_errors | 1000 |
+--------------------+-------+
1 row in set (0.01 sec)
在 MySQL 命令行中，符号 % 类似于 shell 下的*，表示通配。使用命令set global可以临
```

时修改某些参数，但是重启 MySQL 服务后这些修改会失效。所以，如果你想让这些修改恒久生效，就要在配置文件 my.cnf 中定义。

### 15.3.12 查看当前 MySQL 服务器的队列

查看服务器队列在日常的管理工作中最为频繁。因为使用它可以查看当前 MySQL 在干什么，也可以发现是否有锁表，如下所示：

```
mysql> show processlist;
+----+------+-----------+------+---------+------+-------+------------------+
| Id | User | Host | db | Command | Time | State | Info |
+----+------+-----------+------+---------+------+-------+------------------+
| 13 | root | localhost | db1 | Query | 0 | NULL | show processlist |
+----+------+-----------+------+---------+------+-------+------------------+
1 row in set (0.00 sec)
```

### 15.3.13 创建一个普通用户并授权

授权命令如下：

```
mysql> grant all on *.* to user1 identified by '123456';
Query OK, 0 rows affected (0.21 sec)
其中，all表示所有的权限（如读、写、查询、删除等操作）；.有两个*，前者表示所有的数
据库，后者表示所有的表；identified by后面跟密码，密码用单引号括起来。这里的
user1特指 localhost 上的user1。如果是给网络其他机器上的某个用户授权，则要执行如下
```

命令：

```
mysql> grant all on db1.* to 'user2'@'192.168.72.129' identified by '111222';
Query OK, 0 rows affected (0.01 sec)
其中，用户和主机的 IP 之间有一个符号@。另外，命令中主机 IP 可以用 % 替代，表示所有主
```

机，如下所示：

```
mysql> grant all on db1.* to 'user3'@'%' identified by '231222';
Query OK, 0 rows affected (0.00 sec)
```

## 15.4 常用的 SQL 语句

关系型数据库的 SQL 语句都是一样的。假如你之前学过 SQL Server 或者 Oracle，便会觉得这部分内容非常熟悉。

### 15.4.1 查询语句

最常见的查询语句就是下面这两种形式。

- 第一种形式

```sql
mysql> select count(*) from mysql.user;
1
+----------+
2
| count(*) |
3
+----------+
4
| 6 |
5
+----------+
6
1 row in set (0.00 sec)
7
其中，mysql.user表示 MySQL 库的user表，count(*)表示表中共有多少行。
```

- 第二种形式

```sql
mysql> select * from mysql.db;
1
它表示查询 MySQL 库的db表中的所有数据。当然也可以查询单个字段或者多个字段，如
```

- 下所示：

```sql
mysql> select db from mysql.db;
1
mysql> select db,user from mysql.db;
2
同样，在查询语句中也可以使用万能匹配符 %，如下所示：
mysql> select * from mysql.db where host like '192.168.%';
1
```

### 15.4.2 插入一行

插入操作在 MySQL 中也很普遍，如下所示：

```sql
mysql> insert into db1.t1 values (1, 'abc');
Query OK, 1 row affected (0.01 sec)
mysql> select * from db1.t1;
+------+------+
| id | name |
+------+------+
| 1 | abc |
+------+------+
1 row in set (0.01 sec)
```

### 15.4.3 更改表的某一行

MySQL 表里存放的数据支持更改某个字段，如下所示：

```sql
mysql> update db1.t1 set name='aaa' where id=1;
Query OK, 1 row affected (0.01 sec)
Rows matched: 1 Changed: 1 Warnings: 0
mysql> select * from db1.t1;
+------+------+
| id | name |
+------+------+
| 1 | aaa |
+------+------+
1 row in set (0.00 sec)
```

### 15.4.4 清空某个表的数据

有时我们不希望删除表，而只是想清空某个表的数据，如下所示：

```sql
mysql> truncate table db1.t1;
Query OK, 0 rows affected (0.01 sec)
mysql> select * from db1.t1;
Empty set (0.00 sec)
```

### 15.4.5 删除表

如果不需要某个表了，可以直接将其删除，如下所示：

```
mysql> drop table db1.t1;
Query OK, 0 rows affected (0.02 sec)
```

### 15.4.6 删除数据库

表可以删除，当然数据库也可以删除，如下所示：

```
mysql> drop database db1;
Query OK, 0 rows affected (0.01 sec)
```

## 15.5 MySQL 数据库的备份与恢复

备份和恢复 MySQL 数据库这部分内容非常重要，请牢固掌握。

### 15.5.1 MySQL 备份

```
备份 MySQL 要使用mysqldump命令，具体用法如下：
# mysqldump -uroot -p'aming123' mysql >/tmp/mysql.sql
其中，-u和-p两个选项的使用方法和前面介绍的一样；后面的mysql指的是库名，然后重定
```

向到一个文本文档里。备份做完后，你可以查看 /tmp/mysql.sql 这个文件里的内容。

### 15.5.2 MySQL 的恢复

MySQL 的恢复和备份正好相反，如下所示：

```
# mysql -uroot -p'aming123' mysql </tmp/mysql.sql
```

关于 MySQL 的基本操作阿铭就介绍这么多。当然，学会了这些还远远不够，希望你能够在工作中学习到更多的知识。如果你对 MySQL 很感兴趣，不妨深入研究一下。

## 15.6 课后习题

```
(1) 如何更改系统环境变量PATH？
```

(2) MySQL 安装之后，如何给 root 用户更改密码？

(3) 如何在不知道以前密码的情况下重置 root 密码？

(4) 如何连接远程的 MySQL 服务器？

(5) 如何查看当前 MySQL 的登录用户？

(6) 在 MySQL 命令行下，如何切换到某个库？

(7) 如何查看一个表都有哪些字段？

(8) 如何查看某个表使用的是哪种数据库引擎？

(9) 如何查看当前数据库有哪些队列？

(10) 当有很多队列时，如何查看有哪些慢查询？

(11) 如何查看当前 MySQL 的参数值？

(12) 不重启 MySQL 服务，如何更改某个参数？

```
(13) 用什么工具备份数据库？请区分MyISAM引擎和innodb引擎两种存储引擎的备份。（扩展
```

内容，请查资料获取答案。）

```
(14) 简单描述MyISAM和innodb引擎的区别。（扩展内容，请查资料获取答案。）
```

(15) 如果你的 MySQL 服务不能启动，而当前终端又没有报错，该如何做？

```
(16) 备份MyISAM引擎的数据库时，我们除了使用mysqldump工具外，还可以直接复制数据
```

库的源数据（.frm、.MYD 和.MYI 这三种格式的数据），其中哪一个文件可以不复制？若想恢复该文件，该如何做？（扩展内容，请查资料获取答案。）

(17) MySQL 的命令历史文件在哪里？为了安全，我们其实可以做一个小处理，不让 MySQL的命令历史记录在文档中，请想一想如何利用之前我们学过的知识做到。

(18) 如何让 MySQL 的监听端口为 3307，而不是默认的 3306？
