# 第19章MySQLReplication配置

MySQL Replication 又称“AB 复制”或者“主从复制”，它主要用于 MySQL 的实时备份或者读写分离。在配置之前先做一下准备工作：配置两台 MySQL 服务器，或者在一台服务器上配置两个端口。在本章的试验中，阿铭就是在一台服务器上运行两个 MySQL。

## 19.1 配置 MySQL 服务

配置 MySQL 服务的详细步骤请参考 14.1 节，阿铭在这里只写出简要步骤。假如你已经根据14.1 节搭建好了一个 MySQL，使用的是 3306 端口，那么下面再搭建一个 3307 端口的MySQL，方法如下：

```
# cd /usr/local/
# cp -r mysql mysql_2
# cd mysql_2
# cp /etc/my.cnf ./my.cnf
# vim ./my.cnf // 修改为如下内容
log_bin = aminglinux2
basedir = /usr/local/mysql_2
datadir = /data/mysql2
port = 3307
server_id = 129
socket = /tmp/mysql2.sock
# ./bin/mysqld --defaults-file=./my.cnf --initialize --user=mysql
初始化时会有一些warning，不用关注，只要没有error信息就说明初始化成功了，同时我
```

们会看到一个临时密码：

```
[Note] A temporary password is generated for root@localhost: WkCTkeQE2/zp
```

先记录一下这个密码，后面需要使用该临时密码，然后修改一个新密码。下面启动该MySQL：

```
# cp support-files/mysql.server /etc/init.d/mysqld2
# vim /etc/init.d/mysqld2
```

需要更改的地方有：

```
basedir=/usr/local/mysql_2
datadir=/data/mysql2
mysqld_pid_file_path=$datadir/mysql.pid
$bindir/mysqld_safe --defaults-file="basedir/my.cnf" --datadir="$datadir" --pid-f
最后一行为启动命令，增加了--defaults参数，若不增加此参数，则不能正确找到 mysql_2
```

的配置文件。

然后启动两个 MySQL：

```
# /etc/init.d/mysqld start // 若之前的MySQL已经启动，则不用执行该步骤
# /etc/init.d/mysqld2 start
```

到此，阿铭已经在一个 Linux 上启动了两个 MySQL，检查命令如下所示：

```
# netstat -lnp |grep mysql
tcp6 0 0 :::3306 :::* LISTEN 68934/mysqld
tcp6 0 0 :::3307 :::* LISTEN 73724/mysqld
unix 2 [ ACC ] STREAM LISTENING 240004 68934/mysqld /tmp/mysql.sock
unix 2 [ ACC ] STREAM LISTENING 271861 73724/mysqld /tmp/mysql2.sock
```

## 19.2 配置 Replication

阿铭打算把 3307 端口的 MySQL 作为 master（主），而把 3306 的 MySQL 作为 slave

```
（从）。为了让试验更加接近生产环境，阿铭先在 master 上创建一个库aming，如下所示：
# mysqladmin -uroot -S/tmp/mysql2.sock -p'WkCTkeQE2/zp' password 'aming123' // 修
# mysql -uroot -S/tmp/mysql2.sock –p'aming123'
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor. Commands end with ; or \g.
Your MySQL connection id is 5
Server version: 5.7.29-log MySQL Community Server (GPL)
Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.
Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.
Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
mysql> create database aming;
Query OK, 1 row affected (0.00 sec)
mysql> quit
Bye
其中，-S（大写字母）后面指定 MySQL 的 socket 文件路径，这也是登录 MySQL 的一种方
法。因为阿铭在一台服务器上运行了两个 MySQL 端口，所以用-S这样的方法来区分。
然后把mysql库的数据复制给aming库，如下所示：
```

```
# mysqldump -uroot -S/tmp/mysql2.sock -p'aming123' mysql > /tmp/aming.sql
# mysql -uroot -S/tmp/mysql2.sock -p'aming123' aming < /tmp/aming.sql
```

### 19.2.1 设置 master（主）

在上面的操作过程中，阿铭已经将 mysql_2 的配置文件设置过相关的参数，如果你的没有设置，请添加：

```
server-id=129
log_bin=aminglinux2
```

另外，还有两个参数你可以选择性地使用，如下所示：

```
binlog-do-db=databasename1,databasename2
binlog-ignore-db=databasename1,databasename2
其中，binlog-do-db=定义需要复制的数据库，多个数据库用英文逗号分隔；binlog-
ignore-db=定义不需要复制的数据库，这两个参数用其中一个即可。
```

如果修改过配置文件，需要重启 MySQL 服务。重启服务的方法如下：

```
# /etc/init.d/mysqld2 restart
```

重新登录 mysql2，然后创建一个用来实现主从的用户，如下所示：

```
# mysql -uroot -S/tmp/mysql2.sock -p'aming123'
mysql> grant replication slave on *.* to 'repl'@'127.0.0.1' identified by '123lal
mysql> flush privileges;
这里的repl是为 slave（从）端设置的访问 master（主）端的用户，也就是要完成主从复制
```

的用户，其密码为 123lalala，这里的 127.0.0.1 为 slave 的 IP（因为阿铭配置的 master 和

```
slave 都在本机）。第二条命令flush privileges将内存数据写入磁盘，这样刚刚创建的用
```

户和权限才能生效。下面的操作将锁定数据库写操作：

```
mysql> flush tables with read lock;
下面的操作用于查看master的状态：
mysql> show master status;
```

这些数据是要记录的，一会儿要在 slave 端用到：

```
+------------------+---------+------------+-----------------+------------------+
| File |Position |Binlog_Do_DB|Binlog_Ignore_DB |Executed_Gtid_Set |
+------------------+---------+------------+-----------------+------------------+
|aminglinux2.000003| 445 | | | |
+------------------+---------+------------+-----------------+------------------+
```

### 19.2.2 设置 slave（从）

首先修改 slave 端的配置文件 my.cnf，执行如下命令：

```
# vim /etc/my.cnf
找到server_id =，将之设置成和master不一样的数字，若一样，则会导致后面的操作不
```

成功。另外在 slave 端，你也可以选择性地增加如下两行，对应 master 端增加的两行：

```
replicate-do-db=databasename1,databasename2
replicate-ignore-db=databasename1,databasename2
```

保存修改后重启 slave，执行如下命令：

```
# /etc/init.d/mysqld restart
然后复制 master 上aming库的数据到 slave 上。因为 master 和 slave 都在一台服务器上，所
以操作起来很简单。如果在不同的机器上，就需要远程复制了（使用scp或者rsync）。首先
```

备份 master 上的 aming 库：

```
# mysqldump -uroot -S/tmp/mysql2.sock -p'aming123' aming > /tmp/aming2.sql
# mysql -uroot -S/tmp/mysql.sock -p'aming123' -e "create database aming"
# mysql -uroot -S/tmp/mysql.sock -p'aming123' aming< /tmp/aming2.sql
上面的第二行中，阿铭使用了-e选项，它用来把 MySQL 的命令写到 shell 命令行下，其格式
为：-e"commond"。-e选项很实用，阿铭经常使用，请熟记。
```

复制完数据后，就需要在 slave 上配置了，如下所示：

```
# mysql -uroot -S/tmp/mysql.sock -p'aming123'
mysql> stop slave;
mysql> change master to master_host='127.0.0.1',
master_port=3307, master_user='repl',
master_password='123lalala',
master_log_file='aminglinux2.000003',
master_log_pos=445;
mysql> start slave;
需要说明一下：change master这个命令是一大条，打完逗号后可以按回车，直到你打分号
才算结束。其中，master_log_file和master_log_pos是在前面使用show master
status命令所查到的数据。执行完这一步后，需要在 master 上执行下面一步（建议打开两
```

个终端，分别连接两个 MySQL）：

```
# mysql -uroot -S/tmp/mysql2.sock -p'aming123' -e "unlock tables"
```

然后在 slave 端查看 slave 的状态，执行如下命令：

```
mysql> show slave status\G
确认以下两项参数都为Yes，如下所示：
Slave_IO_Running: Yes
Slave_SQL_Running: Yes
```

还需要关注的地方有：

```
Seconds_Behind_Master: 0 // 为主从复制延迟的时间
Last_IO_Errno: 0
Last_IO_Error:
Last_SQL_Errno: 0
Last_SQL_Error:
如果主从不正常了，需要看这里的error信息。
```

## 19.3 测试主从

在 master 上执行如下命令：

```sql
# mysql -uroot -S/tmp/mysql2.sock -p'aming123' aming
mysql> select count(*) from db;
+----------+
| count(*) |
+----------+
| 2 |
+----------+
mysql> truncate table db;
mysql> select count(*) from db;
+----------+
| count(*) |
+----------+
| 0 |
+----------+
这样就清空了aming.db表的数据。下面查看 slave 上该表的数据，执行如下命令：
# mysql -uroot -S/tmp/mysql.sock –p'aming123' aming
mysql> select count(*) from db;
+----------+
| count(*) |
+----------+
| 0 |
+----------+
slave 上该表的数据也被清空了，但好像不太明显，我们不妨在 master 上继续删除db表，如
```

下所示：

```
mysql> drop table db;
Query OK, 0 rows affected (0.00 sec)
```

再从 slave 端查看：

```sql
mysql> select * from db;
ERROR 1146 (42S02): Table 'aming.db' doesn't exist
这次很明显了，db表已经不存在。主从配置虽然很简单，但这种机制非常脆弱，一旦我们不
```

小心在 slave 上写了数据，那么主从复制也就被破坏了。另外，如果要重启 master，务必要

```
先关闭 slave，即在 slave 上执行slave stop命令，然后去重启 master 的 MySQL 服务，否
则主从复制很有可能就会中断。当然，重启 master 后，我们还需要执行start slave命令
```

开启主从复制的服务。

## 19.4 课后习题

(1) MySQL Replication 模式主要应用于什么场景呢？

(2) 在一台服务器上同时配置两个 MySQL 服务，如果已经配置完一个，配置另一个时如何更改监听端口？

(3) 如果想让 MySQL 开机启动，需要把启动命令放到哪个文件下？

(4) 在 master 配置文件中，都修改了哪几个配置选项？

(5) 如何给 MySQL 设置 root 密码？

(6) 配置 Replication 模式时，在 master 上需要给 slave 授予什么样的权限？

(7) MySQL 的哪一个选项可以不进入 MySQL 的命令控制台，而使用 SQL 语句操作？

(8) 如何在 slave 上查看主从复制是否正常？

(9) Replication 模式下，如果想重启 master，必须先对 slave 做什么？
