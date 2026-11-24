# 第12章shell脚本

shell 脚本在 Linux 系统管理员的运维工作中非常重要，下面就让阿铭带你正式进入 shell 脚本的世界吧！

## 12.1 什么是 shell 脚本

shell 脚本并不能作为正式的编程语言，因为它是在 Linux 的 shell 中运行的，所以称为 shell脚本。事实上，shell 脚本就是一些命令的集合。比如，我想实现这样的操作：

(1) 进入 /tmp/ 目录；

(2) 列出当前目录中所有的文件名；

(3) 把所有当前的文件都复制到 /root/ 目录下；

(4) 删除当前目录下所有的文件。

完成以上简单的 4 步需要在 shell 窗口中输入 4 次命令，按 4 次回车，这不算太难。但如果是输入复杂的命令，一次一次敲键盘就会很麻烦。所以我们不妨把所有的操作都记录到一个文档中，然后去调用此文档中的命令，这样一步操作就可以完成。其实这个文档就是 shell 脚本，只是这个 shell 脚本有它特殊的格式。

shell 脚本能帮助我们很方便地管理服务器，因为我们可以指定一个任务计划，定时去执行某个 shell 脚本来满足需求。这对于 Linux 系统管理员来说是一件非常值得自豪的事情。我们可以在 Linux 服务器上部署监控的 shell 脚本，然后脚本中可以加上邮件通知来告之自己出现故障。比如，网卡流量出现异常或者 Web 服务器停止服务时，就可以发一封邮件给管理员。这样可以让管理员及时知道服务器出问题了。

在正式编写 shell 脚本之前，阿铭建议凡是自定义的脚本都放到 /usr/local/sbin/ 目录下。这样做的目的是：一来可以更好地管理文档；二来以后接管你工作的管理员都知道自定义脚本放在哪里，方便维护。

### 12.1.1 shell 脚本的创建和执行

下面请跟着阿铭编写第一个 shell 脚本，如下所示：

```bash
# cd /usr/local/sbin/
# vim first.sh // 加入如下内容
#! /bin/bash
## This is my first shell script.
## Writen by Aming 2020-03-02.
date
echo "Hello world!"
```

shell 脚本通常以.sh 为后缀名。这并不是说不加.sh 的脚本就不能执行，只是大家都有这样一个习惯而已。所以，以后如果发现了以.sh 为后缀的文件，那么只能说它可能是一个 shell 脚

```
本。本例中，脚本文件 first.sh 的第 1 行要以#! /bin/bash开头，表示该文件使用的是
bash 语法。如果不设置该行，你的 shell 脚本也可以执行，但是不符合规范。#表示注释，后
```

面跟一些该脚本的相关注释内容，以及作者、创建日期或者版本等。当然，这些注释并非必需的，但阿铭不建议省略。因为随着工作时间的逐渐过渡，写的 shell 脚本也会越来越多，如果有一天你回头查看自己写过的某个脚本，很有可能忘记该脚本是用来干什么的以及什么时候写的，所以写上注释是有必要的。另外，系统管理员并非只有你一个，写上注释有助于其他管理员查看你的脚本。

下面我们执行一下这个脚本，如下所示：

```
# sh first.sh
Mon Mar 2 22:16:56 CST 2020
Hello world!
```

其实 shell 脚本还有一种执行方法，如下所示：

```
# ./first.sh
-bash: ./first.sh: 权限不够
# chmod +x first.sh
# ./first.sh
Mon Mar 2 22:16:56 CST 2020
Hello world!
使用该方法运行 shell 脚本的前提是脚本本身有执行权限，所以需要给脚本加一个x权限。另
外，使用sh命令执行一个 shell 脚本时，可以加-x选项来查看这个脚本的执行过程，这样有
```

利于我们调试这个脚本。如下所示：

```
# sh -x first.sh
+ date
Mon Mar 2 22:17:43 CST 2020
+ echo 'Hello world!'
Hello world!
本例中有一个date命令，之前阿铭从未介绍过，这个命令在 shell 脚本中使用非常频繁，因此
```

有必要介绍一下它的用法。

### 12.1.2 命令date

```
date命令在 shell 脚本中最常用的几个用法如下。
```

- date +%Y：表示以四位数字格式打印年份。

- date +%y：表示以两位数字格式打印年份。

- date +%m：表示月份。

- date +%d：表示日期。

- date +%H：表示小时。

- date +%M：表示分钟。

- date +%S：表示秒。

```
date +%w：表示星期。结果显示0则表示周日。
下面阿铭举几个比较实用的例子来帮助你掌握date命令的用法，示例代码如下：
# date +"%Y-%m-%d %H:%M:%S"
2020-03-02 22:18:03
```

有时，在脚本中会用到一天前的日期，如下所示：

```
# date -d "-1 day" +%d
01
```

或者一小时前，如下所示：

```
# date -d "-1 hour" +%H
21
```

甚至一分钟前，如下所示：

```
# date -d "-1 min" +%M
17
```

## 12.2 shell 脚本中的变量

在 shell 脚本中使用变量会使我们的脚本更加专业，更像是一门语言。如果你写了一个长达1000 行的 shell 脚本，并且脚本中多次出现某一个命令或者路径，而你觉得路径不对想修改一下，就得一个一个修改，或者使用批量替换的命令修改。这样做很麻烦，并且脚本也显得臃肿

```
了很多。变量就是用来解决这个问题的。定义变量的格式为：“变量名=变量的值”。在脚本中
引用变量时需要加上符号$，这跟前面介绍的在 shell 中自定义变量是一致的。
```

下面我们编写第一个与变量相关的脚本，如下所示：

```bash
# vim variable.sh
#! /bin/bash
## In this script we will use variables.
## Writen by Aming 2020-03-02.
d=`date +%H:%M:%S`
echo "The script begin at $d."
echo "Now we'll sleep 2 seconds."
sleep 2
d1=`date +%H:%M:%S`
echo "The script end at $d1."
```

本例中使用到了反引号，它的作用是将引号中的字符串当成 shell 命令执行，返回命令的执行

```
结果。d和d1在脚本中作为变量出现。
```

下面来看看该脚本的执行结果，如下所示：

```
# sh variable.sh
The script begin at 22:23:04.
Now we'll sleep 2 seconds.
The script end at 22:23:06.
```

### 12.2.1 数学运算

示例命令如下：

```bash
# vim sum.sh
#! /bin/bash
## For get the sum of two numbers.
## Aming 2020-03-02.
a=1
b=2
sum=$[$a+$b]
echo "$a+$b=$sum"
数学计算要用[ ]括起来，并且前面要加符号$。该脚本的结果如下：
# sh sum.sh
1+2=3
```

### 12.2.2 和用户交互

示例脚本如下：

```bash
# cat read.sh
#! /bin/bash
## Using 'read' in shell script.
## Aming 2020-03-02.
read -p "Please input a number: " x
read -p "Please input another number: " y
sum=$[$x+$y]
echo "The sum of the two numbers is: $sum"
read命令用于和用户交互，它把用户输入的字符串作为变量值。该脚本的执行过程如下：
# sh read.sh
Please input a number: 2
Please input another number: 10
The sum of the two numbers is: 12
我们不妨加上-x选项再来看看这个执行过程：
# sh -x read.sh
+ read -p 'Please input a number: ' x
Please input a number: 22
+ read -p 'Please input another number: ' y
Please input another number: 13
+ sum=35
+ echo 'The sum of the two numbers is: 35'
The sum of the two numbers is: 35
```

### 12.2.3 shell 脚本预设变量

```
有时我们会用到类似/etc/init.d/iptables restart（该命令来源于早期 CentOS 系
```

统）的命令，其中前面的 /etc/init.d/iptables 文件其实就是一个 shell 脚本。脚本后面为什么可

```
以跟一个restart字符串呢？这就涉及 shell 脚本的预设变量了。实际上，shell 脚本在执行
```

时，后面可以跟一个或者多个参数。比如下面的脚本：

```bash
# vim option.sh // 内容如下
#! /bin/bash
sum=$[$1+$2]
echo "sum=$sum"
```

该脚本的执行结果如下：

```
# sh -x option.sh 1 2
+ sum=3
+ echo sum=3
sum=3
你可能会问：脚本中的$1和$2是从哪里来的？这其实就是 shell 脚本的预设变量。本例中，
$1和$2的值就是在执行时分别输入的1和2，$1就是脚本的第一个参数，$2是脚本的第二个
```

参数，以此类推。当然一个 shell 脚本的预设变量是没有限制的。

```bash
另外还有一个$0，它代表脚本本身的名字。我们不妨把脚本修改一下，如下所示：
#! /bin/bash
echo "$1 $2 $0"
```

该脚本的执行结果如下：

```
# sh option.sh 1 2
1 2 option.sh
```

## 12.3 shell 脚本中的逻辑判断

```
如果你学过 C 等语言，相信你不会对if感到陌生。在 shell 脚本中，我们同样可以使用if逻
```

辑判断。

### 12.3.1 不带else

具体格式如下：

```
if 判断语句; then
command
fi
```

示例脚本如下：

```bash
# cat if1.sh
#! /bin/bash
read -p "Please input your score: " a
if ((a<60)); then
echo "You didn't pass the exam."
fi
if1.sh中出现了((a<60))这样的形式，这是 shell 脚本中特有的格式，只用一个小括号或
```

者不用都会报错，请记住这个格式。阿铭还会用另外一种格式，后面会介绍到。

该脚本的执行结果如下：

```
# sh if1.sh
Please input your score: 90
# sh if1.sh
Please input your score: 33
You didn't pass the exam.
```

### 12.3.2 带有else

具体格式如下：

```
if 判断语句; then
command
else
command
fi
```

示例脚本如下：

```bash
# vim if2.sh // 内容如下
#! /bin/bash
read -p "Please input your score: " a
if ((a<60)); then
echo "You didn't pass the exam."
else
echo "Good! You passed the exam."
fi
```

该脚本的执行结果如下：

```
# sh if2.sh
Please input your score: 80
Good! You passed the exam.
# sh if2.sh
Please input your score: 25
You didn't pass the exam.
```

脚本 if2.sh 和脚本 if1.sh 唯一的区别是：如果输入大于或等于 60 的数字时会有提示。

### 12.3.3 带有elif

具体格式如下：

```
if 判断语句1; then
command
elif 判断语句2; then
command
else
command
fi
```

示例脚本如下：

```bash
# vim if3.sh // 内容如下
#! /bin/bash
read -p "Please input your score: " a
if ((a<60)); then
echo "You didn't pass the exam."
elif ((a>=60)) && ((a<85)); then
echo "Good! You pass the exam."
else
echo "Very good! Your score is very high!"
fi
这里的&&表示“并且”的意思，当然也可以使用||表示“或者”。
```

该脚本的执行结果如下：

```
# sh if3.sh
Please input your score: 90
Very good! Your score is very high!
# sh if3.sh
Please input your score: 60
Good! You pass the exam.
以上只是简单介绍了if语句的结构。判断数值大小除了可以用(())的形式外，还可以使用
[]。但是不能使用>、<、=这样的符号了，要使用-lt（小于）、-gt（大于）、-le（小于
或等于）、-ge（大于或等于）、-eq（等于）、-ne（不等于）。下面阿铭就以命令行的形式简
```

单比较一下，不再写 shell 脚本。示例代码如下：

```
# a=10; if [ $a -lt 5 ]; then echo ok; fi
# a=10; if [ $a -gt 5 ]; then echo ok; fi
ok
# a=10; if [ $a -ge 10 ]; then echo ok; fi
ok
# a=10; if [ $a -eq 10 ]; then echo ok; fi
ok
# a=10; if [ $a -ne 10 ]; then echo ok; fi
下面是在if语句中使用&&和||的情况，示例代码如下：
# a=10; if [ $a -lt 1 ] || [ $a -gt 5 ]; then echo ok; fi
ok
# a=10; if [ $a -gt 1 ] || [ $a -lt 10 ]; then echo ok; fi
ok
```

### 12.3.4 和文件相关的判断

```
shell 脚本中if还经常用于判断文件的属性，比如判断文件是普通文件还是目录，判断文件是
否有读、写、执行权限等。if常用的选项有以下几个。
```

- -e：判断文件或目录是否存在。

- -d：判断是不是目录以及目录是否存在。

- -f：判断是不是普通文件以及普通文件是否存在。

- -r：判断是否有读权限。

- -w：判断是否有写权限。

- -x：判断是否可执行。

```
使用if判断时的具体格式如下：
if [ -e filename ] ; then
command
fi
```

示例代码如下：

```
# if [ -d /home/ ]; then echo ok; fi
ok
# if [ -f /home/ ]; then echo ok; fi
因为 /home/ 是目录而非文件，所以并不会显示ok。其他示例如下所示：
# if [ -f /root/test.txt ]; then echo ok; fi
ok
# if [ -r /root/test.txt ]; then echo ok; fi
ok
# if [ -w /root/test.txt ]; then echo ok; fi
ok
# if [ -x /root/test.txt ]; then echo ok; fi
# if [ -e /root/test1.txt ]; then echo ok; fi
```

### 12.3.5 case逻辑判断

```
在 shell 脚本中，除了用if来判断逻辑外，还有一种常用的方式——case。其具体格式如
```

下：

```
case 变量 in
value1)
command
;;
value2)
command
;;
value3)
command
;;
*)
command
;;
esac
上面的结构中，不限制value的个数，*代表其他值。下面阿铭写一个判断输入数值是奇数还
```

是偶数的脚本，如下所示：

```bash
# vim case.sh // 内容如下
#! /bin/bash
read -p "Input a number: " n
a=$[$n%2]
case $a in
1)
echo "The number is odd."
;;
0)
echo "The number is even."
;;
*)
echo "It's not a number!"
;;
esac
```

```
脚本中$a的值为1或0，其执行结果如下：
# sh case.sh
Input a number: 100
The number is even.
# sh case.sh
Input a number: 101
The number is odd.
```

## 12.4 shell 脚本中的循环

shell 脚本可以算是一种简易的编程语言，脚本中的循环也是不能缺少的。常用到的循环有

```
for循环和while循环，下面我们就分别介绍一下这两种循环结构。
```

### 12.4.1 for循环

```
for循环结构是阿铭在日常运维工作中使用最频繁的循环结构。下面阿铭先写个简单的for循
```

环脚本，如下所示：

```bash
# vim for.sh // 内容如下
#! /bin/bash
for i in `seq 1 5`; do
echo $i
done
脚本中的seq 1 5表示从1到5的一个序列。你可以直接运行这个命令试一下。该脚本的执行
```

结果如下：

```
# sh for.sh
1
2
3
4
5
通过这个脚本就可以看到for循环的基本结构，具体格式如下：
for 变量名 in 循环的条件; do
command
done
```

这里“循环的条件”可以是一组字符串或者数字（用一个或者多个空格隔开）, 也可以是一条命令的执行结果。为了方便演示，阿铭以一条命令的形式给大家举例，命令如下：

```
# for i in 1 2 3 a b; do echo $i; done
1
2
3
a
b
“循环的条件”还可以引用系统命令的执行结果（如seq 1 5），但必须用反引号括起来。示例
```

命令如下：

```
# for file in `ls`; do echo $file; done
case.sh
first.sh
for.sh
if1.sh
if2.sh
if3.sh
option.sh
read.sh
sum.sh
variable.sh
```

### 12.4.2 while循环

```
阿铭常常用while循环来编写死循环的脚本，用于监控某项服务。while循环的格式也很简
```

单，如下所示：

```
while 条件; do
command
done
```

示例脚本如下：

```bash
# cat while.sh
#! /bin/bash
a=5
while [ $a -ge 1 ]; do
echo $a
a=$[$a-1]
done
```

该脚本的执行结果如下：

```
# sh while.sh
5
4
3
2
1
```

另外，你可以用一个冒号代替循环条件，这样可以做到死循环。示例代码如下：

```
while :; do
command
sleep 3
done
```

## 12.5 shell 脚本中的函数

shell 脚本中的函数就是把一段代码整理到一个小单元中，并给这个小单元命名，当用到这段代码时直接调用这个小单元的名字即可。有时候脚本中的某段代码总是重复使用，如果将这段代码写成函数，那么每次用到时直接用函数名代替即可，这样不仅节省时间还节省空间。

下面阿铭写一个简单的带有函数功能的 shell 脚本，示例脚本如下：

```bash
# vim func.sh // 内容如下
#! /bin/bash
function sum()
{
sum=$[$1+$2]
echo $sum
}
sum $1 $2
```

该脚本的执行结果如下：

```javascript
# sh func.sh 1 2
3
func.sh 中的sum()为自定义的函数。在 shell 脚本中函数的格式如下：
function 函数名()
{
command1
command2
}
```

值得注意的是，在 shell 脚本中，函数一定要写在最前面，不能出现在中间或者最后。因为函数是要被调用的，如果还没有出现就被调用，肯定会出错。

## 12.6 shell 脚本中的中断和继续

在 shell 脚本循环的过程中，我们难免会遇到一些特殊需求，比如当循环到某个地方时需要做一些事情，这时候很有可能需要退出循环，或者跳过本次循环，这样的需求如何实现呢？

### 12.6.1 break

```
首先有一点你需要明白，break用在循环中，不管是for循环或者while循环都可以。在脚本
```

中使用它，表示退出该层循环。之所以说层，是因为有时我们会用到嵌套循环，大循环里面还

```bash
有小循环，而break仅仅是退出那一层循环，它的上层循环并不受影响。下面阿铭给大家写一
个break的示例，如下所示：
# vim break.sh // 内容如下
#!/bin/bash
for i in `seq 1 5`
do
echo $i
if [ $i == 3 ]
then
break
fi
echo $i
done
echo aaaaaaa
此脚本中，本意是要把1~5数值赋予i，当i等于 3 时，就跳出循环，因此后面的4和5都不会
```

再执行了。该脚本的执行结果如下：

```
# sh break.sh
1
1
2
2
3
aaaaaaa
```

### 12.6.2 continue

```
continue也是使用在循环中的，但和break不同的是，当在 shell 脚本中遇到continue
```

时，结束的不是整个循环，而是本次循环。具体示例如下：

```bash
# vim continue.sh // 内容如下
#!/bin/bash
for i in `seq 1 5`
do
echo $i
if [ $i == 3 ]
then
continue
fi
echo $i
done
echo $i
```

脚本执行结果如下：

```
# sh continue.sh
1
1
2
2
3
4
4
5
5
5
当i等于3的时候，出现了continue，所以结束本次循环，continue后面的语句不再执
```

行，继续下一次循环。

### 12.6.3 exit

```
其实，还有一个和break、continue类似的用法，那就是exit，它的作用范围更大，表示
```

直接退出整个 shell 脚本。示例脚本如下：

```bash
# vim exit.sh // 内容如下
#!/bin/bash
for i in `seq 1 5`
do
echo $i
if [ $i == 3 ]
then
exit
fi
echo $i
done
echo aaaaaaa
```

这个就很容易理解了，脚本执行结果如下：

```
# sh exit.sh
1
1
2
2
3
```

## 12.7 shell 脚本练习题

以上阿铭所举的例子都是最基础的，如果你想写好 shell 脚本就要多加练习，或者找专门介绍shell 脚本的书深入地研究一下。下面阿铭将留几个 shell 脚本的练习题，请不要偷懒哦。

```
(1) 编写 shell 脚本，计算1~100的和。
(2) 编写 shell 脚本，输入一个数字n并计算1~n的和。要求：如果输入的数字小于1，则重新
```

输入，直到输入正确的数字为止。

(3) 编写 shell 脚本，把 /root/ 目录下的所有目录（只需要一级）复制到 /tmp/ 目录下。

```
(4) 编写 shell 脚本，批量建立用户user_00、user_01...user_99。要求：所有用户同属于
users组。
(5) 编写 shell 脚本，截取文件 test.log 中包含关键词abc的行中的第 1 列（假设分隔符为:），
```

然后把截取的数字排序（假设第 1 列为数字），最后打印出重复超过 10 次的列。

```
(6) 编写 shell 脚本，判断输入的 IP 是否正确。要求：IP 的规则是n1.n2.n3.n4，其中
1<n1<255，0<n2<255，0<n3<255，0<n4<255）。
```

下面是以上习题的答案，仅作参考。

```bash
(1) # cat 1.sh
#! /bin/bash
sum=0
for i in `seq 1 100`; do
sum=$[$i+$sum]
done
echo $sum
(2) # cat 2.sh
```

```bash
#! /bin/bash
n=0
while [ $n -lt "1" ]; do
read -p "Please input a number, it must greater than "1":" n
done
sum=0
for i in `seq 1 $n`; do
sum=$[$i+$sum]
done
echo $sum
(3) # cat 3.sh
#! /bin/bash
cd /root
for f in `ls `; do
if [ -d $f ] ; then
cp -r $f /tmp/
fi
done
(4) # cat 4.sh
#! /bin/bash
groupadd users
for i in `seq –w 0 99`; do
useradd -g users user_0$i
done
说明 seq -w可以让序列等宽。
(5) # cat 5.sh
#! /bin/bash
awk -F':' '$0~/abc/ ' test.log >/tmp/n.txt
sort -n n.txt |uniq -c |sort -n >/tmp/n2.txt
awk '$1>10 ' /tmp/n2.txt
(6) # cat 6.sh
#! /bin/bash
checkip()
{
if echo $1 |egrep -q '^[0-9]\.[0-9]\.[0-9]\.[0-9]$'
then
a=`echo $1 | awk -F. ''`
b=`echo $1 | awk -F. ''`
c=`echo $1 | awk -F. ''`
d=`echo $1 | awk -F. ''`
for n in $a $b $c $d; do
if [ $n -ge 255 ] || [ $n -le 0 ]; then
echo "the number should less than 255 and greate than 0"
return 2
fi
done
else
echo "The IP you input is something wrong, the format is like 192.168.100.1"
return 1
fi
}
rs=1
while [ $rs -gt 0 ]; do
read -p "Please input the ip:" ip
checkip $ip
rs=`echo $?`
done
echo "The IP is right!"
```

## 12.8 课后习题

(1) shell 脚本中，怎么把某一行当作注释？

(2) 如何执行一个 shell 脚本呢？

(3) 为了方便管理，我们约定把 shell 脚本都放到哪个目录下？

(4) 为了更好地调试 shell 脚本，我们可以加哪个选项来观察 shell 脚本的执行过程？

```
(5) 使用date命令打印 5 天前的日期。要求：日期格式为xxxx-xx-xx。
```

(6) 请指出下面这个脚本的问题出现在哪里。

```bash
#! /bin/bash
a = 1
b = 2
echo $a, $b
```

(7) 在 shell 脚本中如何使用数学运算？请举例说明。

(8) shell 脚本中的哪个命令可以实现脚本和用户交互？怎么使用？

(9) 在 shell 中如何进行大小或者等于判断？

(10) 在 shell 脚本中，用什么符号表示“并且”？用什么符号表示“或者”？

```
(11) 在 shell 脚本中，case逻辑判断的结构是什么样的？
```

(12) 列举 shell 脚本中常用的循环结构。

(13) shell 脚本中函数的作用是什么？函数结构是什么样的？

(14) 编写一个 shell 脚本，在一个目录下的所有文件（不含目录）的文件名后面加“.bak”。

(15) 编写一个 shell 脚本，将当前目录下大于 100 KB 的文件全部移动到 /tmp/ 目录下。

(16) 编写一个 shell 脚本，获取本机的 HOSTNAME、IP 地址以及 DNS 地址。

```
(17) 编写两个小脚本，验证break和continue在循环中的作用。
```
