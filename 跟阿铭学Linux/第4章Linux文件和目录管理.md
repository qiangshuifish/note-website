# 第4章Linux文件和目录管理

从这一章开始，阿铭介绍的命令会越来越多，希望你能够反复练习每一个命令的每一个选项。在 Windows 下，新建、复制、删除文件或者文件夹都非常简单，但 Linux 需要我们使用命令行进行操作。这样便增加了学习 Linux 系统的难度，不过不用担心，一旦能够熟练使用它们，那你将永远也不会忘记。万事开头难，所以请大家努力吧！

## 4.1 绝对路径和相对路径

在 Linux 中，什么是一个文件的路径呢？简单地说，就是这个文件存放的地方，例如在上一章提到的 /root/.ssh/authorized_keys 就是一个文件的路径。只要你告诉系统某个文件的路径，系统就可以找到这个文件。

在 Linux 中，存在着绝对路径和相对路径。

- 绝对路径：路径的写法一定是由根目录 / 写起的，例如 /usr/local/mysql。

- 相对路径：路径的写法不是由根目录 / 写起的。例如，要使用户首先进入到 /home 目录，然后再进入到 test 目录，需执行的命令为：

```
# cd /home
1
# cd test
2
此时用户所在的路径为 /home/test。第一个cd命令后紧跟 /home，home 前面有斜杠；而
第二个cd命令后紧跟 test，test 前面没有斜杠。这个 test 是相对于 /home 目录来讲的，所
```

- 以称为相对路径。

### 4.1.1 命令cd

```
命令cd（change directory 的简写）是用来变更用户所在目录的，如果该命令后面什么都不
跟，就会直接进入当前用户的根目录下。我们做实验用的是 root 账户，所以运行命令cd后，
会进入 root 账户的根目录 /root 下。如果cd后面跟目录名，则会直接切换到指定目录下。示例
```

命令如下：

```
# cd /tmp/
# pwd
/tmp
# cd
# pwd
/root
上例中，命令pwd用于显示当前所在目录。命令cd后面只能是目录名，如果跟了文件名，则
```

会报错，例如：

```
# cd /etc/passwd
-bash: cd: /etc/passwd: 不是目录
```

因为 /etc/passwd 为一个文件名，所以就报错了。在 Linux 文件系统中，有两个特殊的符号也

```
可以表示目录。“.”表示当前目录，“..”表示当前目录的上一级目录，示例命令如下：
# cd /usr/local/lib/
# pwd
/usr/local/lib
# cd .
# pwd
/usr/local/lib
# cd ..
# pwd
/usr/local
```

```
上例中，首先进入 /usr/local/lib/ 目录，接着输入“.”，用命令pwd查看当前目录，还是在
/usr/local/lib/ 目录下，然后输入“..”，则进入 /usr/local/ 目录（即 /usr/local/lib 目录的上一级
```

目录）。

### 4.1.2 命令mkdir

```
命令mkdir（make directory 的简写）用于创建目录，这个命令在上一章中用过。该命令的格
式为：mkdir [-mp] [目录名称]。其中，-m、-p为其选项。-m选项用于指定要创建目录
的权限（这个选项不常用，阿铭不作重点解释）。-p选项很管用，我们做个试验，你就一目了
```

然了。执行如下命令：

```bash
# mkdir /tmp/test/123
mkdir: 无法创建目录 '/tmp/test/123': 没有那个文件或目录
# mkdir -p /tmp/test/123
# ls /tmp/test
123
```

当我们创建目录 /tmp/test/123 时，会提示无法创建、/tmp/test 目录不存在。在 Linux 中，如

```
果它发现要创建的目录的上一级目录不存在，就会报错。为了解决这个问题，Linux 设置了-p
```

选项，这个选项可以帮我们创建一大串级联目录，并且当创建一个已经存在的目录时，不会报错。示例命令如下：

```bash
# ls -ld /tmp/test/123
drwxr-xr-x 2 root root 6 12月 30 07:25 /tmp/test/123
# mkdir /tmp/test/123
mkdir: 无法创建目录 '/tmp/test/123': 文件已存在
# mkdir -p /tmp/test/123
# ls -ld /tmp/test/123
drwxr-xr-x 2 root root 6 12月 30 07:25 /tmp/test/123
在上一章中阿铭已经介绍过ls命令，但并没有介绍它的-d选项。这个选项是针对目录的，通
常都是和-l并用，写成-ld。它可以查看指定目录的属性，比如在本例中，它可以查看
/tmp/test/123 目录的创建时间，如果不加-d，则会显示该目录里面的文件和子目录的属性。
```

### 4.1.3 命令rmdir

```
命令rmdir（remove directory 的简写）用于删除空目录，后面可以是一个目录，也可以是多
```

个目录（用空格分隔）。但该命令只能删除目录，不能删除文件，所以阿铭一般不用它，而改

```
用命令rm（remove 的简写），这个命令不仅可以删除目录，还可以删除文件，将在 4.1.4 节
中介绍。rmdir和mkdir具有相同的选项-p，它同样可以级联删除一大串目录，但在级联的
```

目录中，如果某一个目录里还有目录或者文件，那这个命令就不好用了。我们先来看看命令

```
rmdir的用法，示例命令如下：
# ls /tmp/test
123
# rmdir /tmp/test/
rmdir: 删除 '/tmp/test/' 失败: 目录非空
# rmdir /tmp/test/123
# ls /tmp/test
#
在上例中，命令rmdir只能删除空目录，即使加上-p选项也只能删除一串空目录。可见，这
```

个命令有很大的局限性，偶尔用一下还可以。

### 4.1.4 命令rm

```
命令rm是最常用的，它也有很多选项。你可以通过命令man rm来获得它的详细帮助信息。这
```

里，阿铭只介绍最常用的两个选项。

```
-r：删除目录用的选项，类似于rmdir，但可以删除非空目录。下面阿铭先创建一连串的
```

- 目录，然后尝试删除它们。示例命令如下：

```
# mkdir -p /tmp/test/123
1
# rm -r /tmp/test/123
2
rm:是否删除目录 '/tmp/test/123'? y
3
和rmdir不同的是，在使用rm –r命令删除目录时，会询问是否删除，如果输入y，则会删
除，如果输入n，则不删除。
-f：表示强制删除。它不会询问是否删除，而是直接删除。即使后面跟一个不存在的文件
```

- 或者目录，也不会报错。下面阿铭尝试删除一个不存在的目录，示例命令如下：

```
# rm /tmp/test/123/123
1
rm: 无法删除 '/tmp/test/123/123': 没有那个文件或目录
2
# rm -f /tmp/test/123/123
3
上例中，由于 /tmp/test/123/123 这个目录是不存在的，因此直接运行rm命令后会报错，加
上-f选项后，就不会了。但如果要删除一个存在的目录，即使加上-f选项也会报错。所
以，使用命令rm删除目录时，一定要加-r选项。请对比下面的示例命令和上面的示例命
```

- 令，发现两者的区别：

```
# rm -f /tmp/test/123
1
rm: 无法删除 '/tmp/test/123': 是一个目录
2
# rm -rf /tmp/test/123
3
关于rm命令，阿铭使用最多的是-rf选项，这样删除文件或目录比较方便。但请大家千万要
注意，rm -rf命令后面不能加/，因为它会把你的系统文件全部删除，这是非常危险的！
```

## 4.2 环境变量PATH

```
在讲环境变量之前，阿铭先介绍一下命令which，它用于查找某个命令的绝对路径。示例命令
```

如下：

```
# which rmdir
/usr/bin/rmdir
# which rm
alias rm='rm -i'
/usr/bin/rm
# which ls
alias ls='ls --color=auto'
/usr/bin/ls
其中rm和ls是两个特殊的命令，因为使用alias命令做了别名，所以我们用的rm实际上是
rm -i，加上-i选项后，删除文件或者命令时都会询问是否确定要删除，这样做比较安全。
命令alias可以设置命令或文件的别名，阿铭会在 10.1.3 节中详细介绍该命令。阿铭并不常
使用命令which，平时只用它来查询某个命令的绝对路径。
在上面的示例中，用which命令查到rm命令的绝对路径为 /usr/bin/rm。那么你是否会问：“为
```

什么我们使用命令时，只是直接打出了命令，而没有使用这些命令的绝对路径呢？”这是环境

```
变量PATH在起作用。请输入如下命令：
# echo $PATH
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin
这里的echo命令用来打印$PATH的值。PATH前面的$是变量的前缀符号，这些知识点将会在
```

第 10 章中详细介绍。

```
因为 /bin 目录存在于PATH的设定中，所以自然可以找到ls。但值得注意的是，由于PATH里
并没有 /root 目录，因此如果你将ls移到 /root 目录下，那么再执行ls命令时，系统自然就找
```

不到可执行文件了，它会提示 command not found!。示例命令如下：

```
# mv /usr/bin/ls /root/
# ls
-bash: /usr/bin/ls: 没有那个文件或目录
命令mv（move 的简写）用于移动目录或者文件，它还有重命名的作用（这个将在 4.2.2 节中
```

介绍）。那么，该如何解决上面的这种问题呢？有两种方法，一种方法是直接将 /root 这个路径

```
加入到$PATH当中，命令如下：
# PATH=$PATH:/root
# echo $PATH
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin:/root
# ls
anaconda-ks.cfg ls
```

另一种方法是使用绝对路径，命令如下：

```
# /root/ls
anaconda-ks.cfg ls
```

为了不影响系统使用，建议将 ls 文件还原，命令如下：

```
# mv /root/ls /usr/bin/
```

### 4.2.1 命令cp

```
cp是 copy（即复制）的简写，该命令的格式为：cp [选项] [ 来源文件 ] [目的文件]。
例如，若想把 test1 文件复制成 test2 文件，则可以写为cp test1 test2。下面介绍命令
cp的几个常用选项。
-r：如果要复制一个目录，必须加-r选项，否则不能复制，这类似于rm命令。示例命令如
```

- 下：

```
# mkdir 123
1
# cp 123 456
2
cp: 略过目录"123"
3
# cp -r 123 456
4
# ls –ld 123 456
5
drwxr-xr-x 2 root root 6 12月 30 07:35 123
6
drwxr-xr-x 2 root root 6 12月 30 07:36 456
7
-i：这是安全选项，当遇到一个目的文件名已存在的文件时，会询问是否覆盖，这也与rm
命令类似。在 Red Hat/CentOS 系统中，使用的cp命令其实是cp –i，我们可以通过
which命令查看，具体如下：
# which cp
1
alias cp='cp -i'
2
/bin/cp
3
为了更形象地说明-i选项的作用，我们来做一个简单的小试验，命令如下：
# cd 123
1
# ls
2
# touch 111
3
# touch 222
4
# cp -i 111 222
5
cp：是否覆盖 '222'？ n
6
# echo 'abc' > 111
7
# echo 'def' > 222
8
# cat 111 222
9
abc
10
def
11
# /bin/cp 111 222
12
# cat 111
13
abc
14
# cat 222
15
abc
16
上例中的touch可以解释为：如果有这个文件，则改变该文件的访问时间；如果没有这个
文件，就创建这个文件。echo命令用于打印，但这里打印的内容abc和def并没有显示在
屏幕上，而是分别写入了文件“111”和“222”。其中起写入作用的就是符号“>”，这在 Linux 中
叫作重定向，即把前面产生的输出写入到后面的文件中。cat命令则用于读取一个文件，并
把读出的内容打印到当前屏幕上。（重定向将在第 10 章中介绍，cat命令将在 4.3.1 节中详
```

- 细介绍，这里你只要明白它们的含义即可。）

### 4.2.2 命令mv

```
mv是 move（移动）的简写，该命令的格式为：mv [ 选项 ] [源文件或目录] [目标文件
或目录]。该命令有如下几种情况。
```

- 目标文件是目录，但该目录不存在。

- 目标文件是目录，且该目录存在。

- 目标文件是文件，且该文件不存在。

- 目标文件是文件，但该文件存在。

```
当目标文件是目录时，在其存在与不存在的两种情况下，执行mv命令后的结果是不一样的。
```

如果该目录存在，则会把源文件或目录移动到该目录中。如果该目录不存在，则会把源目录重命名为给定的目标文件名。

```
当目标文件是文件时，在其存在与不存在的两种情况下，执行mv命令后的结果也是不一样
```

的。如果该文件存在，则会询问是否覆盖。如果该文件不存在，则会把源文件重命名为给定的目标文件名。

下面我们来做几个小试验，示例命令如下：

```
# mkdir /tmp/test_mv
# cd /tmp/test_mv
# mkdir dira dirb
# ls
dira dirb
# mv dira dirc
# ls
dirb dirc
```

上例中，阿铭首先创建了一个实验用的目录 /tmp/test_mv，然后进入到该目录下进行实验，这

```
样做的目的是保持目录和文件的简洁，后面的实验以此类推。在这里，mv命令的目标文件是
```

目录 dirc，并且该目录不存在，因此就把目录 dira 重命名为 dirc。

下例中，目标文件是目录 dirb，且 dirb 存在，因此会把目录 dirc 移动到目录 dirb 里：

```
# mv dirc dirb
# ls
dirb
# ls dirb
dirc
下例中，mv命令的目标文件是文件 filee 且这个文件不存在，因此把文件 filed 重命名为
filee。mv filee dirb命令则将更名后的文件 filee 移动到目录 dirb 里：
# touch filed
# ls
dirb filed
# mv filed filee
# ls
dirb filee
# mv filee dirb
# ls
dirb
# ls dirb
dirc filee
```

## 4.3 几个与文档相关的命令

上面介绍的几个命令几乎都是与目录相关的，下面阿铭继续介绍几个与文档相关的命令。

### 4.3.1 命令cat

```
命令cat（这并不是某个单词的简写，大家可以通过man cat命令查看它的解释）是比较常
用的一个命令，用于查看一个文件的内容并将其显示在屏幕上。cat后面可以不加任何选项，
```

直接跟文件名。下面阿铭将介绍它的两个常用选项。

- -n：查看文件时，把行号也显示到屏幕上。示例命令如下（当前目录依然在/tmp/test_mv）：

```
# echo '111111111' > dirb/filee
1
# echo '222222222' >> dirb/filee
2
# cat dirb/filee
3
111111111
4
222222222
5
# cat -n dirb/filee
6
1 111111111
7
2 222222222
8
上例中出现了符号>>，它跟前面介绍的符号>类似，作用也是重定向，即把前面的内容输
入到后面的文件中，但符号>>是“追加”的意思。当使用符号>时，如果文件中有内容，则会
删除文件中原有的内容，而使用符号>>则不会。
```

- -A：显示所有的内容，包括特殊字符。示例命令如下：

```
# cat -A dirb/filee
1
111111111$
2
222222222$
3
上例中，若不加-A选项，那么每行后面的$符号是看不到的。
```

### 4.3.2 命令tac

```
和命令cat一样，命令tac（正好是命令cat的反序写法）也是把文件的内容显示在屏幕上，
只不过是先显示最后一行，然后显示倒数第二行，最后才显示第一行。我们使用命令tac来查
看刚才创建的文件 dirb/filee，显示的结果和执行命令cat后的结果正好是反序，如下所示：
# tac dirb/filee
222222222
111111111
```

### 4.3.3 命令more

```
命令more也用于查看一个文件的内容，后面直接跟文件名。当文件内容太多，一屏不能全部
显示时，用命令cat肯定是看不了前面的文件内容，这时可以使用命令more。当看完一屏
```

后，按空格键可以继续看下一屏，看完所有内容后就会退出，可以按 Ctrl+B 向上翻屏，按Ctrl+F 向下翻屏（同空格）。如果想提前退出，按 Q 键即可。

### 4.3.4 命令less

```
命令less的作用和命令more一样，后面直接跟文件名，但命令less比more要多一些功能。
```

按空格键可以翻页，按 J 键可以向下移动（按一下就向下移动一行），按 K 键可以向上移动。

```
在使用more和less命令查看某个文件时，你可以按一下 / 键，并输入一个字符串（如
root），然后回车，这样就可以查找这个字符串了。如果想查找多个该字符串，可以按 N 键
```

以显示下一个。另外，也可以用 ? 键替代 / 键来搜索字符串，唯一不同的是，/ 键是从当前行向下搜索，而 ? 键是从当前行向上搜索。

### 4.3.5 命令head

```
命令head用于显示文件的前 10 行内容，后面直接跟文件名。如果加-n选项，则代表显示文
```

件的前几行，示例命令如下：

```javascript
# head /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
# head -n 1 /etc/passwd
root:x:0:0:root:/root:/bin/bash
# head -n2 /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
大家请注意，选项-n后有无空格均可。另外，也可以省略n，-后面直接跟数字，示例命令如
```

下：

```
# head -2 /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
```

### 4.3.6 命令tail

```
和命令head类似，命令tail用于显示文件的最后 10 行内容，后面直接跟文件名。如果加-n
```

选项，则代表显示文件的最后几行，示例命令如下：

```javascript
# tail /etc/passwd
nobody:x:65534:65534:Kernel Overflow User:/:/sbin/nologin
dbus:x:81:81:System message bus:/:/sbin/nologin
systemd-coredump:x:999:997:systemd Core Dumper:/:/sbin/nologin
systemd-resolve:x:193:193:systemd Resolver:/:/sbin/nologin
tss:x:59:59:Account used by the trousers package to sandbox the tcsd daemon:/dev/
polkitd:x:998:996:User for polkitd:/:/sbin/nologin
unbound:x:997:995:Unbound DNS resolver:/etc/unbound:/sbin/nologin
sssd:x:996:993:User for sssd:/:/sbin/nologin
sshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin
chrony:x:995:992::/var/lib/chrony:/sbin/nologin
# tail -n2 /etc/passwd
sshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin
chrony:x:995:992::/var/lib/chrony:/sbin/nologin
# tail -2 /etc/passwd
sshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin
chrony:x:995:992::/var/lib/chrony:/sbin/nologin
同样，-n后面有无空格均可，且n也可以省略。
另外，命令tail的-f选项也常用，它可以动态显示文件的最后 10 行。如果文件内容在不断
增加，使用-f选项将非常方便和直观。比如tail -f /var/log/messages可以动态、实
```

时地查看文件 /var/log/messages 中的内容。

## 4.4 文件的所有者和所属组

每一个 Linux 目录或者文件，都会有一个所有者（owner）和所属组（group）。所有者是指文件的拥有者，所属组是指这个文件属于哪一个用户组（关于用户、用户组的概念，会在第 5 章中详细介绍，这里你要明白一个用户组下面会有若干个用户）。Linux 这样设置文件属性是为文件的安全着想。

例如，test 文件的所有者是 owner0，而 test1 文件的所有者是 owner1，那么 owner1 很有可能是不可以查看 test 文件的，相应地，owner0 也很有可能不可以查看 test1 文件（之所以说可能，是因为 owner0 和 owner1 有可能属于同一个用户组，而恰好这个用户组对这两个文件都有查看权限）。

有时我们也会有这样的需求：使一个文件能同时被 owner0 和 owner1 查看，这怎么实现呢？这时“所属组”就派上用场了。先创建一个组 owners，让 owner0 和 owner1 同属于这个组，然后建立一个文件 test2，且其所属组为 owners，这样 owner0 和 owner1 就都可以访问 test2文件。Linux 文件属性不仅规定了所有者和所属组，还规定了所有者、所属组以及其他用户

```
（others）对该文件的权限。我们可以通过ls -l命令来查看这些属性，代码如下：
# ls -l /etc/passwd
-rw-r--r--. 1 root root 1080 12月 26 08:08 /etc/passwd
其中，第 3 列（用空格划分列）和第 4 列的root就是所有者和所属组。
```

## 4.5 Linux 文件属性

```
在上例中，用ls –l命令查看当前目录下的文件时，共显示了 9 列内容（用空格划分列），它
```

们都代表什么含义呢？

- 第 1 列：包含所查看文件的类型、所有者、所属组以及其他用户对该文件的权限。第 1 列

```
共 11 位，其中第 1 位用来描述该文件的类型。上例中我们看到的文件类型是-，其实除了
这个，还有d、l、b、c、s等，具体描述如下所示。
-表示该文件为普通文件。
d表示该文件为目录。
l表示该文件为链接文件（link file），在 4.9.3 节中即将提到的软链接即为该类型，示例
```

- 命令如下：

```
# ls -l /etc/rc.local
1
lrwxrwxrwx. 1 root root 13 7月 1 11:29 /etc/rc.local -> rc.d/rc.local
2
上例中，第 1 列lrwxrwxrwx.的第 1 位是l，表示该文件为链接文件，后面阿铭还会介
```

- 绍它。

```
b表示该文件为块设备，比如 /dev/sda 就是这样的文件，磁盘分区文件就是这种类型。
c表示该文件为串行端口设备文件（又称字符设备文件），比如键盘、鼠标、打印机、tty
```

- 终端等都是这样的文件。

```
s表示该文件为套接字文件（socket），应用于进程之间的通信，后面讲到 MySQL 时会
```

- 用到该类型的文件。

```
在文件类型后面紧接着的 9 位，每 3 位为一组，上例中（lrwxrwxrwx.）的这 9 位均
为rwx这 3 个参数的组合。其中，r代表可读，w代表可写，x代表可执行。前 3 位为所
```

- 有者的权限，中间 3 位为所属组的权限，最后 3 位为其他非本用户组的用户的权限。下面阿铭举例来说明一下。

```
假设一个文件的属性为-rwxr-xr--.，它代表的意思是，该文件为普通文件，文件所有
```

- 者对其可读、可写且可执行，文件所属组对其可读、不可写但可执行，其他用户对其只可读。对于一个目录来讲，打开这个目录即为执行这个目录，所以任何一个用户必须要

```
有x权限才能打开并查看该目录下的内容。例如，一个目录的属性为drwxr--r--.，其
所有者为 root，只有 root 有x权限，那么除 root 之外的所有用户都不能打开这个目录。
关于前面提到的第 1 列最后 1 位的“.”，阿铭要特别说明一下。老版本 CentOS 5 是没有
这个点的，这主要是因为新版本的ls命令添加了 SELinux 或者 acl 的属性。如果文件或
者目录使用了 SELinux context 的属性，这里会是一个点“.”；如果使用了 acl 的属性，
这里会是一个加号“+”。关于 SELinux 和 acl，阿铭不在此详细介绍，你只要了解是怎么
```

- 回事即可。

```
第 2 列：表示该文件占用的节点（inode），如果是目录，那么这个数值与该目录下的子目
```

- 录数量有关。

- 第 3 列：表示该文件的所有者。

- 第 4 列：表示该文件的所属组。

- 第 5 列：表示该文件的大小。

```
第 6 列、第 7 列和第 8 列：表示该文件最后一次被修改的时间（mtime），依次为月、日以
```

- 及具体时间。

- 第 9 列：表示文件名。

## 4.6 更改文件的权限

4.5 节讲了那么多的文件属性，你虽然不能一下子明白每列信息所表示的具体含义，但随着后续章节的逐步深入，阿铭相信你一定能理解和掌握它们。

### 4.6.1 命令chgrp

```
chgrp（change group 的简写）命令可以更改文件的所属组，其格式为chgrp [组名] [文
件名]，示例命令如下：
# groupadd testgroup
# mkdir /tmp/4_6 // 创建实验用的目录
# cd /tmp/4_6
# touch test1
# ls -l test1
-rw-r--r-- 1 root root 0 12月 30 07:43 test1
# chgrp testgroup test1
# ls -l test1
-rw-r--r-- 1 root testgroup 0 12月 30 07:43 test1
上例中用到了groupadd命令，其含义为增加一个用户组。
chgrp命令还可以更改目录的所属组，示例命令如下：
# mkdir dir2
# touch dir2/test2
# ls –ld dir2
drwxr-xr-x 2 root root 19 12月 30 07:44 dir2
# chgrp testgroup dir2
# ls -ld dir2
drwxr-xr-x 2 root testgroup 19 12月 30 07:44 dir2
# ls –l dir2
总用量 0
-rw-r--r-- 1 root root 0 12月 30 07:44 test2
```

```
上例中，chgrp命令只更改了目录本身，而目录下的文件并没有更改。如果要想级联更改子目
录以及子文件，加-R选项可以实现，示例命令如下：
# chgrp -R testgroup dir2
# ls -l dir2
总用量 0
-rw-r--r-- 1 root testgroup 0 12月 30 07:44 test2
阿铭不常用chgrp命令，因为还有一个命令可以替代它，那就是chown。
```

### 4.6.2 命令chown

```
chown（change owner 的简写）命令可以更改文件的所有者，其格式为：chown [ -R ]
账户名 文件名或者chown [ -R ] 账户名:组名 文件名。这里的-R选项只适用于目录，作
```

用是级联更改，即不仅可以更改当前目录，连其中的子目录或者子文件也可以全部更改。示例命令如下：

```
# mkdir dir3
# useradd user1 // 创建用户user1，useradd命令会在5.2.3节中介绍
# touch dir3/test3 // 在dir3目录下创建test3文件
# chown user1 dir3
# ls -ld dir3 // dir3目录的所有者已经由root改为user1
drwxr-xr-x 2 user1 root 19 12月 30 07:46 dir3
# ls -l dir3 // 但是dir3目录下的test3文件的所有者依旧是root
总用量 0
-rw-r--r-- 1 root root 0 12月 30 07:46 test3
# chown -R user1:testgroup dir3
# ls -l dir3
总用量 0
-rw-r--r-- 1 user1 testgroup 0 12月 30 07:46 test3
上例中，chown -R user1:testgroup会把 test 目录以及该目录下的文件的所有者都修改
```

成 user1，所属组都修改成 testgroup。

### 4.6.3 命令chmod

```
为了方便更改文件的权限，Linux 使用数字代替rwx，具体规则为：用 4 表示r，用 2 表示
w，用 1 表示x，用 0 表示-。例如，rwxrwx---用数字表示就是 770，其具体算法为：
rwx=4+2+1=7，rwx=4+2+1=7，---=0+0+0=0。
命令chmod（change mode 的简写）用于改变用户对文件 / 目录的读、写和执行权限，其格
式为：chmod [-R] xyz 文件名（这里的xyz表示数字）。其中，-R选项的作用等同于
chown命令的-R选项，也表示级联更改。值得注意的是，在 Linux 系统中，一个目录的默认
```

权限为 755，而一个文件的默认权限为 644。下面我们举例说明一下：

```bash
# ls -ld dir3
drwxr-xr-x 2 user1 testgroup 19 12月 30 07:46 dir3
# ls -l dir3
总用量 0
-rw-r--r-- 1 user1 testgroup 0 12月 30 07:46 test3
# chmod 750 dir3
# ls -ld dir3
drwxr-x--- 2 user1 testgroup 19 12月 30 07:46 dir3
# ls -l dir3/test3
-rw-r--r-- 1 user1 testgroup 0 12月 30 07:46 dir3/test3
# chmod 700 dir3/test3
# ls -l dir3/test3
-rwx------ 1 user1 testgroup 0 12月 30 07:46 dir3/test3
# chmod -R 700 dir3
# ls -ld dir3
drwx------ 2 user1 testgroup 19 12月 30 07:46 dir3
# ls -l dir3
总用量 0
-rwx------ 1 user1 testgroup 0 12月 30 07:46 test3
如果你创建了一个目录，但又不想让其他人看到该目录的内容，则只需将其权限设置成rwxr-
----（即 740）即可。
chmod命令还支持使用rwx的方式来设置权限。从之前的介绍中可以发现，基本上就 9 个属
性。我们可以使用u、g和o来分别表示所有者、所属组和其他用户的属性，用a代表all（即
```

全部）。下面阿铭举例介绍它们的用法，示例命令如下：

```
# chmod u=rwx,og=rx dir3/test3
# ls -l dir3/test3
-rwxr-xr-x 1 user1 testgroup 0 12月 30 07:46 dir3/test3
这样可以把 dir3/test3 的文件权限修改为rwxr-xr-x。此外，我们还可以针对u、g、o和a，
```

增加或者减少它们的某个权限（读、写或执行），示例命令如下：

```
# chmod u-x dir3/test3
# ls -l dir3
总用量 0
-rw-r-xr-x 1 user1 testgroup 0 12月 30 07:46 test3
# chmod a-x dir3/test3
# ls -l dir3/test3
-rw-r--r-- 1 user1 testgroup 0 12月 30 07:46 dir3/test3
# chmod u+x dir3/test3
# ls -l dir3/test3
-rwxr--r-- 1 user1 testgroup 0 12月 30 07:46 dir3/test3
```

### 4.6.4 命令umask

默认情况下，目录的权限值为 755，普通文件的权限值为 644，那么这两个权限值是由谁规定

```
的呢？究其原因，便涉及umask。
命令umask用于改变文件的默认权限，其格式为：umask xxx（这里的xxx代表 3 个数字）。
如果要查看umask的值，只要在命令行输入umask，然后按回车即可，如下所示：
# umask
0022
```

```
这里umask的预设值是 0022，这表示什么含义呢？咱们先来看以下两条规则。
若用户建立普通文件，则预设没有可执行权限，只有r、w两个权限，最大值为 666（-rw-
rw-rw-）。
若用户建立目录，则预设所有权限均开放，即 777（drwxrwxrwx）。
umask数值代表的含义为以上两条规则中的默认值（文件为 666，目录为 777）需要减掉的权
```

限，所以：

```
目录的权限为rwxrwxrwx - ----w--w- = rwxr-xr-x
普通文件的权限为rw-rw-rw- - ----w--w- = rw-r--r--
umask的值是可以自定义的，比如设置umask为 002，之后当你再次创建目录或者文件时，
```

默认权限分别为：

```
rwxrwxrwx - -------w- = rwxrwxr-x（目录的权限）
rw-rw-rw- - -------w- = rw-rw-r--（文件的权限）
```

示例命令如下：

```
# umask 002
# mkdir dir4
# ls -ld dir4
drwxrwxr-x 2 root root 6 12月 30 07:53 dir4
# touch test4
# ls -l test4
-rw-rw-r-- 1 root root 0 12月 30 07:54 test4
```

这里我们可以看到创建的目录的默认权限变为 775，而文件的默认权限变为 664。如果要把

```
umask改回来，具体操作方法如下：
# umask 022
# touch test5
# ls -l test5
-rw-r--r-- 1 root root 0 12月 30 07:54 test5
关于umask的计算方法，有的朋友喜欢换算成数字去做减法，比如rwxrwxrwx − ----w--
w-= 777 － 022 = 755。乍一看这好像没有任何问题，但有时会出错，比如当umask值为 033
时，如果使用单纯的数字减法，则文件的默认权限为 666－033=633，但实际权限应该为rw-
rw-rw- − ----wx-wx = rw-r--r-- = 644。
可以在 /etc/bashrc 里面更改umask的值，默认情况下，root 的umask为 022，而一般使用者
```

的则为 002。由于可写的权限非常重要，因此预设会去掉写权限。可能大家一直有一个疑问，

```
阿铭介绍的umask值一直都是 3 位数，但为什么系统里面是 4 位呢？为什么最前面还有一个 0
呢？其实这个 0 加与不加没有影响，它表示umask数值是八进制的。
```

### 4.6.5 修改文件的特殊属性

1. 命令chattr

```
命令chattr（change attribute）的格式为：chattr [+-=][Asaci] [文件或者目录
名]，其中，+、-和=分别表示增加、减少和设定。各个权限选项的含义如下。
A：增加该权限后，表示文件或目录的atime将不可修改。
```

- s：增加该权限后，会将数据同步写入磁盘中。

- a：增加该权限后，表示只能追加不能删除，非 root 用户不能设定该属性。

- c：增加该权限后，表示自动压缩该文件，读取时会自动解压。

- i：增加该权限后，表示文件不能删除、重命名、设定链接、写入以及新增数据。

```
以上选项中，常用的为a和i这两个选项。下面阿铭举例说明其用法，示例命令如下：
# chattr +i dir2
1
# touch dir2/test5
2
touch: 无法创建"dir2/test5": 权限不够
3
# chattr -i dir2
4
# touch dir2/test5
5
# chattr +i dir2
6
# rm -f dir2/test5
7
rm: 无法删除"dir2/test5": 权限不够
8
上例中，给 dir2 目录增加i权限后，即使是 root 账户，也不能在 dir2 目录中创建或删除
```

- test5 文件。

```
下面再来看看a权限的作用，示例命令如下：
# chattr -i dir2
1
# touch dir2/test6
2
# ls dir2
3
test2 test5 test6
4
# chattr +a dir2
5
# rm -f dir2/test6
6
rm: 无法删除"dir2/test6": 不允许的操作
7
# touch dir2/test7
8
# ls dir2
9
test2 test5 test6 test7
10
上例中，dir2 目录增加a权限后，只可以在里面创建文件，而不能删除文件。
```

- 文件同样适用以上权限，示例命令如下：

```
1
# chattr +a dir2/test7
2
# echo '11111' > dir2/test7
3
-bash: dir2/test7: 不允许的操作
4
# echo '11111' >> dir2/test7
5
# cat dir2/test7
6
11111
7
# chattr +i dir2/test6
8
# echo '11111' >> dir2/test6
9
-bash: test2/test3: 权限不够
10
# echo '11111' > dir2/test6
11
-bash: dir2/test6: 权限不够
12
# rm -f dir2/test6
13
rm: 无法删除"dir2/test6": 权限不够
14
```

2. 命令lsattr

```bash
lsattr（list attribute）命令用于读取文件或者目录的特殊权限，其格式为：lsattr [-
aR] [文件/目录名]。下面先来看看-a和-R这两个选项的含义。
-a：类似于ls命令的-a选项，即连同隐藏文件一同列出。
```

- -R：连同子目录的数据一同列出。

```
这个命令的用法和ls类似，示例命令如下：
# lsattr dir2
1
---------------- dir2/test2
2
---------------- dir2/test5
3
----i----------- dir2/test6
4
-----a---------- dir2/test7
5
# lsattr -aR dir2
6
-----a---------- dir2/.
7
---------------- dir2/..
8
---------------- dir2/test2
9
---------------- dir2/test5
10
----i----------- dir2/test6
11
-----a---------- dir2/test7
12
```

3. set uid、set gid和sticky bit前面介绍权限的时候，我们一直都是用 3 位数，其实最前面还有一位，那就是下面要讲的

```
set uid、set gid和sticky bit。
```

- set uid：该权限针对二进制可执行文件，使文件在执行阶段具有文件所有者的权限。

```
比如，passwd这个命令就具有该权限。当普通用户执行passwd命令时，可以临时获得
```

- root 权限，从而可以更改密码。

- set gid：该权限既可以作用在文件上（二进制可执行文件），也可以作用在目录上。当

```
作用在文件上时，其功能和set uid一样，会使文件在执行阶段具有文件所属组的权
```

- 限。给目录设置这个权限后，任何用户在此目录下创建的文件都具有和该目录的所属组相同的组。

- sticky bit：可以理解为防删除位。文件是否可以被某用户删除，主要取决于该文件所在的目录是否对该用户具有写权限。如果没有写权限，则这个目录下的所有文件都不能删除，同时也不能添加新的文件。如果希望用户能够添加文件但不能删除该目录下其他用户的文件，则可以对父目录增加该权限。设置该权限后，就算用户对目录具有写权限，也不能删除其他用户的文件。

```
例如，passwd命令设置了set uid权限，而 /tmp/ 目录则设置了sticky bit权限。下面
```

- 我们来看看它们的权限，示例命令如下：

```
# ls -l /usr/bin/passwd
1
-rwsr-xr-x. 1 root root 27832 5月 11 2019 /usr/bin/passwd
2
# ls -ld /tmp/
3
drwxrwxrwt. 21 root root 4096 12月 30 07:43 /tmp/
4
可以发现，passwd显示的是rws而非传统的rwx，用数字表示为 4755。/tmp/ 显示的是
rwt而非rwx，用数字表示为 1777。那么，这个 4 和 1 是如何计算出来的呢？当有特殊权
限时，第一位数字可以是 0、1（--t）、2（-s-）、3（-st）、4（s--）、5（s-t）、6
（ss-）或 7（sst）。再回过头来看passwd，它是s--，所以是 4；而 /tmp/ 是--t，所
```

- 以是 1。

```bash
配置这些特殊权限的方法和之前一样。比如，我想给一个文件增加set uid权限，那么命
令为chmod u+s filename，而去掉这个权限的命令则为chmod u-s filename。同
理，设置set gid权限的命令为chmod g+s dirname，设置sticky bit权限的命令为
chmod o+t dirname。
有时候，你可能会发现set_uid上的权限为大写的S，而不是小写的s，比如rwS，这是因
为该文件没有x权限，不管是大写的S还是小写的s，都表示它存在set_uid或者set_gid
权限，同理sticky bit也一样。
```

## 4.7 在 Linux 下搜索文件

在 Windows 下有一个搜索工具，可以让我们快速找到文件，这很有用。然而在 Linux 下，搜索功能更加强大。

### 4.7.1 用which命令查找可执行文件的绝对路径

```
前面已经用过which命令，但需要注意的是，which只能用来查找在PATH环境变量中出现的
路径下的可执行文件。这个命令比较常用，有时我们不知道某个命令的绝对路径，用which查
找就很容易知道了。例如，查找vi和cat的绝对路径，命令如下：
# which vi
/usr/bin/vi
# which cat
/usr/bin/cat
```

### 4.7.2 用whereis命令查找文件

```
whereis命令通过预先生成的一个文件列表库查找与给出的文件名相关的文件，其格式为
whereis [-bms] [文件名称]，其中各选项的含义如下所示。
```

- -b：只查找二进制文件。

- -m：只查找帮助文件（在 man 目录下的文件）。

- -s：只查找源代码文件。

```
例如，用whereis查看ls的示例命令如下：
```

```bash
# whereis ls
ls: /usr/bin/ls /usr/share/man/man1/ls.1.gz
可以看到，共找到了两个文件。这个命令类似于模糊查找，只要文件名包含ls字符，就会将
此文件列出来。此外，阿铭很少用到whereis命令。
```

### 4.7.3 用locate命令查找文件

```
locate命令类似于whereis，也是通过查找预先生成的文件列表库来告诉用户要查找的文件
```

在哪里，后面直接跟文件名。如果你的 Linux 没有这个命令，请安装 mlocate 软件包，安装命令如下：

```javascript
# yum install -y mlocate
# locate passwd
locate: 无法执行 stat () `/var/lib/mlocate/mlocate.db': 没有那个文件或目录
安装好 mlocate 软件包后，初次运行locate命令会报错，这是因为系统还没有生成那个查找
所需的文件列表库。可以使用updatedb命令立即生成（或更新）这个库。如果你的服务器上
```

正执行重要的业务，那么最好不要运行这个命令，因为一旦运行，服务器的压力就会增大。默

```
认情况下，这个数据库每周更新一次。如果使用locate命令搜索一个文件，而该文件正好是
```

在两次更新时间段内创建的，那么肯定得不到结果。我们可以到文件 /etc/updated.conf 中配置生成（或更新）这个数据库的规则。

```
Locate命令搜索到的文件列表，不管是目录名还是文件名，只要包含我们要搜索的关键词，
就会列出来，所以locate不适合精准搜索。这个命令阿铭也不常用。
```

### 4.7.4 使用find搜索文件

```
find这个搜索工具是阿铭使用最多的一个，请务必熟记，其格式为：find [路径] [参
数]。下面介绍阿铭常用的几个参数。
```

- -atime +n/-n：表示访问或执行时间大于 / 小于n天的文件。

```
-ctime +n/-n：表示写入、更改inode属性（如更改所有者、权限或者链接）的时间大
```

- 于 / 小于n天的文件。

- -mtime +n/-n：表示写入时间大于 / 小于n天的文件，该参数用得最多。

下面我们先来做个简单的试验，示例命令如下：

```
# find /tmp/4_6/ -mtime -1
/tmp/4_6/
/tmp/4_6/test1
/tmp/4_6/dir2
/tmp/4_6/dir2/test2
/tmp/4_6/dir2/test5
/tmp/4_6/dir2/test6
/tmp/4_6/dir2/test7
/tmp/4_6/dir3
/tmp/4_6/dir3/test3
/tmp/4_6/dir4
/tmp/4_6/test4
/tmp/4_6/test5
上例中，-mtime -1表示mtime在 1 天之内的文件，单位是天。而-mtime +10表示mtime
在 10 天以上的文件。还有一种用法-mmin -10表示mtime在 10 分钟内的文件。有时候，也
可以不加+或者-，比如-mtime 10，这表示正好为 10 天，这种用法相对较少。
看到这里，你可能不太理解这三个time属性，那么阿铭就先介绍一下它们。文件的 access
time（即atime）是在读取或者执行文件时更改的。文件的 modified time（即mtime）是在
写入文件时随文件内容的更改而更改的。文件的 change time（即ctime）是在写入文件、更
改所有者、权限或链接设置时随inode内容的更改而更改的。
其中，inode（索引节点）用来存放档案以及目录的基本信息，包含时间信息、文档名、所有
者以及所属组等。inode是 Unix 操作系统中的一种数据结构，其本质是结构体，在文件系统
创建时生成，且个数有限。在 Linux 下，可以通过命令df -i来查看各个分区的inode总数
```

以及使用情况。

```
因此，更改文件的内容便会更改mtime和ctime，但是文件的ctime可能会在mtime未发生
```

任何变化时更改。例如，更改了文件的权限，但是文件内容没有变化。那么如何获得一个文件

```
的atime、mtime以及ctime呢？stat命令可用来列出文件的atime、ctime和mtime，
```

示例命令如下：

```
# stat dir2/test2
文件："dir2/test2"
大小：0 块：0 IO 块：4096 普通空文件
设备：803h/2051d Inode：25689396 硬链接：1
权限：(0644/-rw-r--r--) Uid：( 0/ root) Gid：( 1000/testgroup)
最近访问：2019-12-30 07:44:10.706789647 -0500
最近更改：2019-12-30 07:44:10.706789647 -0500
最近改动：2019-12-30 07:45:37.978885268 -0500
创建时间：-
atime不一定在访问文件之后被修改，因为在使用 ext3 文件系统时，如果mount使用了
noatime参数，那么就不会更新atime的信息。总之，这三个time属性值都放在inode中。
若mtime、atime被修改，那么inode就一定会改，当然ctime也跟着要改了。
下面阿铭继续介绍find的常用选项。
```

- -name filename：表示直接查找指定文件名的文件，这个选项比较常用，示例命令如下：

```
# find . -name test2 // .表示当前目录，当前目录在 /tmp/4_6下面
1
./dir2/test2
2
# find . -name "test*" // 支持用 * 通配
3
./test1
4
./dir2/test2
5
./dir2/test5
6
./dir2/test6
7
./dir2/test7
8
./dir3/test3
9
./test4
10
./test5
11
```

- -type filetype：表示通过文件类型查找文件。文件类型在前面已经简单介绍过，相信

```
你已经基本了解了。filetype包含f、b、c、d、l、s等类型，示例命令如下：
# find . -type d
1
.
2
./dir2
3
./dir3
4
./dir4
5
```

## 4.8 Linux 文件系统简介

Windows 系统格式化硬盘时，会指定格式 FAT 或者 NTFS，而 Linux 的文件系统格式为ext3、ext4 或者 xfs。早期的 Linux 使用 ext2 格式，CentOS 5 默认使用 ext3 格式，CentOS6 默认使用 ext4 格式，而 CentOS 7 和 CentOS 8 默认使用 xfs 格式。ext2 文件系统虽然高效、稳定，但随着 Linux 系统在关键业务中的应用，Linux 文件系统的弱点也逐渐显露出来。ext2 文件系统不是日志文件系统，这在关键行业是一个致命的弱点。

ext3 文件系统是直接从 ext2 文件系统发展而来的，它带有日志功能，可以跟踪记录文件系统的变化，并将变化内容写入日志。写操作首先是对日志记录文件进行操作，若整个写操作由于某种原因（如系统掉电）而中断，则当系统重启时，会根据日志记录来恢复中断前的写操作，而且这个过程费时极短。目前，ext3 文件系统已经非常稳定、可靠，它完全兼容 ext2 文件系统，因此用户可以平滑地过渡到一个日志功能健全的文件系统，这实际上也是 ext3 日志文件系统设计的初衷。

而 ext4 文件系统较 ext3 文件系统又有很多好的特性，其中最明显的是 ext4 支持的最大文件系统容量和单个最大文件大小比 ext3 大许多，二者之间的详细区别阿铭不再介绍。虽然 ext4支持的单个文件大小已经达到了 16TB，最大文件支持到 40 多亿，但依然还是有瓶颈的，xfs支持的量级要比 ext4 大得多，所以 CentOS 7 默认采用 xfs 也是必然的，还有一个原因，xfs的开发者目前受雇于 Red Hat 公司，ext4 的开发者受雇于 Google 公司。

在 Windows 中是不能识别 Linux 文件系统的，但在 Linux 系统中可以挂载 Windows 文件系统。Linux 目前支持 MS-DOS、VFAT、FAT、BSD 等格式，如果你使用的是 Red Hat 或者CentOS，那么请不要妄图挂载 NTFS 格式的分区到 Linux 下，因为它不支持 NTFS。当有这方面的需求时，我们可以通过安装 ntfs-3g 软件包来解决。

除了 ext3/ext4 文件系统外，有些 Linux 发行版（如 SUSE）默认的文件系统为 ReiserFS，它在处理小于 1KB 的文件时的速度是 ext 文件系统的 10 倍。另外，ReiserFS 空间浪费较少，

```
它不会为一些小文件分配inode，而是打包存放在同一个磁盘块中。而 ext 是把这些小文件单
```

独存放在不同的块上。例如，块大小为 4KB，那么两个 100 字节的文件会占用两个块，ReiserFS 则只占用一个块。当然，ReiserFS 也有缺点，就是每升级一个版本，都要将磁盘重新格式化一次。

## 4.9 Linux 文件类型

```
前面我们简单介绍了普通文件-、目录d等文件类型，为了加深理解，阿铭将详细介绍 Linux
```

的文件类型。

### 4.9.1 常见文件类型

在 Linux 文件系统中，主要有以下几种类型的文件。

```
普通文件（regular file）：即一般类型的文件，当用命令ls -l查看某个目录时，第一个属
性为“-”的文件就是普通文件。它又可分成纯文本文件（ASCII）和二进制文件（binary）。
纯文本文件的内容可以通过cat、more、less等工具直接查看，而二进制文件则不能。例
```

- 如，我们用的命令 /usr/bin/ls 就是一个二进制文件。

- 目录（directory）：它与 Windows 下的文件夹类似，只不过在 Linux 中我们不将其称为“文

```
件夹”，而称为“目录”。用命令ls -l查看的第一个属性值为d的文件就是目录。
链接文件（link file）：用命令ls -l查看的第一个属性为l的文件就是链接文件，它类似于
```

- Windows 下的快捷方式。这种文件在 Linux 中很常见，阿铭在日常系统运维工作中也经常用到，所以你要特别留意一下这类文件。

- 设备（device）：与系统周边相关的一些文件，通常都集中在 /dev 目录下。这种文件一般分为两种，一种是块（block）设备，就是一些存储数据以提供系统存取的接口设备，简称

```
硬盘。例如，第一块硬盘是 /dev/sda1，用命令ls-l查看的第一个属性值为b的文件就是块
```

- 设备。另一种是字符（character）设备，是一些串行端口的接口设备，例如键盘、鼠标

```
等，用命令ls-l查看的第一个属性为c的文件就是字符设备。
```

### 4.9.2 Linux 文件后缀名

对于“后缀名”这个概念，相信你并不陌生。在 Linux 系统中，文件的后缀名没有具体意义，加或者不加都无所谓。但是为了便于区分，我们习惯在定义文件名时加一个后缀名。这样当用户看到某个文件名时，就会很快知道它到底是一个什么文件，例如 1.sh、2.tar.gz、my.cnf、test.zip 等。

如果你是首次接触这些文件，也许会很疑惑，但没关系，等深入学习之后，你就会逐渐了解这些文件。在阿铭所列举的几个文件名中，1.sh 代表它是一个 shell 脚本，2.tar.gz 代表它是一个压缩包，my.cnf 代表它是一个配置文件，test.zip 代表它是一个压缩文件。

另外需要知道，早期的 UNIX 系统文件名最多允许 14 个字符，而在新的 UNIX 或者 Linux 系统中，文件名最长可达 255 个字符。

### 4.9.3 Linux 的链接文件

前面阿铭多次提到了“链接文件”这个概念，它分为硬链接（hard link）和软链接（symbolic

```
link）两种。两种链接的本质区别在于inode。下面阿铭就来介绍一下这两种链接文件。
硬链接：当系统要读取一个文件时，会先读inode信息，然后再根据inode中的信息到块
区域将数据取出来。硬链接是直接再建立一个inode链接到文件放置的块区域，即进行硬
链接时该文件内容没有任何变化，只是增加了一个指向该文件的inode，并不会占用额外
```

- 的磁盘空间。硬链接有两个限制：(1) 不能跨文件系统，因为不同的文件系统有不同的

```
inode table；(2) 不能链接目录。
```

- 软链接：与硬链接不同，软链接是建立一个独立的文件，当读取这个链接文件时，它会把读取的行为转发到该文件所链接的文件上。例如，现在有一个文件 a，我们做了一个软链接文件 b（只是一个链接文件，非常小），b 指向 a。之后当读取 b 时，b 就会把读取的动作转发到 a 上，这样就读取了文件 a。当我们删除文件 a 时，链接文件 b 并不会被删除，但如果

- 再次读取 b，就会提示无法打开文件。另外，如果我们删除了 b，那么 a 是不会有任何影响的。

由此看来，似乎硬链接比较安全，因为无论删除哪一个硬链接文件，都会有其他文件指向那个

```
inode，只要inode存在，那么文件的数据块也就存在。但由于硬链接的限制太多了（包括
```

无法做目录的链接），因此用途上比较受限，而软链接的使用方向则较广。那么，如何建立软

```
链接和硬链接呢？这就用到了下面我们要介绍的ln（link）命令。
ln命令的格式为：ln [-s] [来源文件] [目的文件]，该命令常用的选项是-s。如果不
加-s选项就是建立硬链接，加上-s选项就建立软链接。示例命令如下：
# mkdir /tmp/4_9
# cd /tmp/4_9
# cp /etc/passwd ./
# ll
总用量 4
-rw-r--r-- 1 root root 1121 12月 30 08:03 passwd
# du -sk // du命令用来计算文件或者目录的大小，-k表示以KB为单位，这里的4，就是4KB
4 .
# ln passwd passwd-hard
# ll
总用量 8
-rw-r--r-- 2 root root 1121 12月 30 08:03 passwd
-rw-r--r-- 2 root root 1121 12月 30 08:03 passwd-hard
# du -sk
4 .
这里的ll命令等同于ls -l，请使用which命令查看一下。一开始目录下面只有一个
```

passwd 文件，目录总大小为 4KB，做了硬链接后，虽然两个文件的大小都为 1121B，但目录的总大小并没有变化。我们不妨先删除源文件，然后再来比较一下，示例命令如下：

```
# rm -f passwd
# ll
总用量 4
-rw-r--r-- 1 root root 1121 12月 30 08:03 passwd-hard
# du -sk
4 .
```

上例中，删除源文件 passwd 后，文件大小依旧不变。这说明硬链接文件并不会复制数据块，额外占用磁盘空间。再来看硬链接的另外一个限制——不允许目录做硬链接，示例命令如下：

```
# mkdir 123
# ln 123 456
ln: "123": 不允许将硬链接指向目录
```

下面我们再来看看软链接的一些特性。首先建立一个测试目录 456，然后复制 /etc/passwd 文件来做测试，再给它做一个软链接文件，示例命令如下：

```
# mkdir 456
# cd 456
# cp /etc/passwd ./
# ln -s passwd passwd-soft
# ll
总用量 4
-rw-r--r-- 1 root root 1121 12月 30 08:05 passwd
lrwxrwxrwx 1 root root 6 12月 30 08:05 passwd-soft -> passwd
# head -n1 passwd-soft
root:x:0:0:root:/root:/bin/bash
# head -n1 passwd
root:x:0:0:root:/root:/bin/bash
# rm -f passwd
# head -n1 passwd-soft
head:无法打开"passwd-soft"读取数据:没有那个文件或目录
# ll
总用量 0
lrwxrwxrwx 1 root root 6 12月 30 08:05 passwd-soft -> passwd
上例中，如果删除源文件，则不能读取软链接文件，而且使用命令ll查看后，会发现颜色也
```

有所变化。另外，目录不可以做硬链接，但可以做软链接，示例命令如下：

```
# cd ..
# In 456 789
In: "456": 不允许将硬链接指向目录
# ln -s 456 789
# ls -ld 456 789
drwxrwxr-x 2 root root 25 12月 30 08:06 456
lrwxrwxrwx 1 root root 3 12月 30 08:07 789 -> 456
```

## 4.10 课后习题

```
(1) 命令rmdir -p用来删除一串目录，比如rmdir -p /tmp/test/1/2/3。如果 /tmp/1/2/
```

目录下除了 3 目录外还有个 4 目录，4 目录里还有 5 目录，那么是否可以成功删除？用命令

```
rmdir -p删除一个不存在的目录时，是否会报错呢？
```

(2) 删除一个目录或者文件时，在删除之前会先询问我们是否删除，如果直接回车，是否能删除呢？如果输入的不是 y 也不是 n，会发生什么呢？

(3) 如何创建一串目录（如 /home/1/2/3/4）？

```
(4) 使用mv命令时，如果目标文件不是目录，但该文件存在，会怎么样？
(5) 使用less命令查看文件 /etc/passwd，搜索一下共出现了几个 root？按哪个键可以向上 /
```

向下逐行移动？

```javascript
(6) 为什么目录必须要有x权限才可以查看目录下面的文件呢？
(7) 如果设置umask为 001，那么用户默认创建的目录和文件的权限是什么样子的？
(8) 用find找出 /var/ 目录下最近一天内变更的文件，再用find找出 /root/ 目录下一小时内变
```

更的文件。

```
(9) 用find找出 /etc/ 目录下一年内从未变更过的文件。
```

(10) 为什么硬链接不能链接目录？硬链接的文件是否占用空间大小？硬链接文件是否可以跨分区创建？

(11) Linux 系统里，分别用什么符号表示纯文本文件、二进制文件、目录、链接文件、块设备以及字符设备？

(12) 如何把 dira 目录以及该目录下的所有文件和目录修改为所有者为 user1、所属组为users？

(13) Linux 系统中默认目录的权限是什么？文档的权限是什么？分别用三个数字表示。我们可

```
以通过修改umask的值更改目录和文档的默认权限值，那么如何通过umask的值得到默认权
```

限值呢？

(14) 修改 dirb 目录的权限，使其所有者可读、可写且可执行，所属组可读且可执行，其他用户不可读、不可写也不可执行，使用什么命令呢？

(15) 如何使文件只能写且不能删除呢？如何使文件不能被删除、重命名、设定链接、写入且新增数据呢？

(16) Linux 下的一个点“.”和两个点“..”分别表示什么？

```
(17) cd -表示什么含义？
(18) 用ls命令查看目录或者文件时，第 2 列的数值表示什么意思？如果一个目录的第 2 列的
```

值为 3，那么这个 3 是如何得到的呢？

```
(19) 如果系统中没有locate命令，我们需要安装哪个软件包？初次使用locate命令会报错
```

can not open `/var/lib/mlocate/mlocate.db`: No such file or directory，我们需要如何做呢？

(20) 当复制一个文件时，如果目标文件存在会询问我们是否覆盖，如何做就不再询问了呢？

(21) 假如一个文件内容一直在增加，如何动态显示这个文件的内容呢？

(22) 更改文件读写执行权限的命令是什么？如何把一个目录下的所有文件（不含目录）的权限改为 644？

(23) 如何查看当前用户的目录?

(24) 假如一个目录可以让任何人可写，那么如何能做到该目录下的文件只允许文件的所有者更改？

(25) 简述软链接和硬链接的区别。

```
(26) cat a.txt会更改 a.txt 的什么时间？chmod 644 a.txt会更改 a.txt 的什么时间？vi
呢？直接touch呢？
```
