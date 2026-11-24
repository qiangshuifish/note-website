# 第10章shell基础知识

shell 脚本在日常的 Linux 系统管理工作中是必不可少的。如果不会写 shell 脚本，你就不算是一个合格的管理员。目前，很多单位在招聘 Linux 系统管理员时，shell 脚本的编写是必考的题目。有的单位甚至用 shell 脚本的编写能力来衡量这个 Linux 系统管理员的经验是否丰富。所以，你必须认真学习 shell 脚本并不断练习。只要 shell 脚本写得好，那么相信你的 Linux 求职之路就会轻松得多。阿铭在这一章中只是带你进入 shell 脚本的世界，如果你很感兴趣，可以到网上下载相关的资料或者到书店购买 shell 相关的图书。

在学习 shell 脚本之前，需要你了解很多相关的知识，这些知识是编写 shell 脚本的基础，希望你能够熟练掌握。

## 10.1 什么是 shell

shell 是系统跟计算机硬件交互时使用的中间介质，它只是系统的一个工具。实际上，在 shell和计算机硬件之间还有一层东西——系统内核。如果把计算机硬件比作一个人的躯体，那系统内核就是人的大脑。至于 shell，把它比作人的五官似乎更贴切些。言归正传，用户直接面对的不是计算机硬件而是 shell，用户把指令告诉 shell，然后 shell 传输给系统内核，接着内核再去支配计算机硬件去执行各种操作。

阿铭接触的 Linux 发布版本（Red Hat/CentOS）默认安装的 shell 版本是 bash（即 BourneAgain Shell），它是 sh（即 Bourne Shell）的增强版本。Bourn Shell 是最早流行起来的一个shell 版本。其创始人是 Steven Bourne，为了纪念他而将其命名为 Bourn Shell，简称 sh。那么，这个 bash 有什么特点呢？

### 10.1.1 记录命令历史

我们执行过的命令 Linux 都会记录，预设可以记录 1000 条历史命令。这些命令保存在用户的家目录的.bash_history 文件中。但需要注意的是，只有当用户正常退出当前 shell 时，在当前shell 中运行的命令才会保存至 .bash_history 文件中。那什么情况才算正常退出？敲 exit 命令或者按 Ctrl＋D 快捷键都可以正常退出。而意外断电或者断网就不算正常退出。

```
!是与命令有关的一个特殊字符，该字符常用的应用有以下 3 个。
!!：连续两个!表示执行上一条指令。示例命令如下：
# pwd
1
/root
2
# !!
3
pwd
4
/root
5
!n：这里的n是数字，表示执行命令历史中的第n条指令。例如，!1002表示执行命令历史
```

- 中的第 1002 个命令，如下所示：

```
# history |grep 1002
1
1002 pwd
2
1015 history |grep 1002
3
# !1002
4
pwd
5
/root
6
上例中的history命令如果未改动过环境变量，默认可以把最近执行的 1000 条命令历史
```

- 打印出来。

```
!字符串（字符串大于等于 1）：例如!pw表示执行命令历史中最近一次以 pw 开头的命令。
```

- 示例代码如下：

```
# !pw
1
pwd
2
/root
3
```

### 10.1.2 命令和文件名补全

最开始阿铭就介绍过，按 tab 键可以帮我们补全一个指令、一个路径或者一个文件名。连续按两次 tab 键，系统则会把所有的命令或者文件名都列出来。

### 10.1.3 别名

前面的章节中也曾提到过 alias，它也是 bash 所特有的功能之一。我们可以通过 alias 把一个常用的并且很长的指令另取名为一个简单易记的指令。如果不想用此功能了，还可以使用

```
unalias命令解除别名功能。直接执行alias命令，会看到目前系统预设的别名，如下所
```

示：

```
# alias
alias cp='cp -i'
alias egrep='egrep --color=auto'
alias fgrep='fgrep --color=auto'
alias grep='grep --color=auto'
alias l.='ls -d .* --color=auto'
alias ll='ls -l --color=auto'
alias ls='ls --color=auto'
alias mv='mv -i'
alias rm='rm -i'
alias which='(alias; declare -f) | /usr/bin/which --tty-only --read-alias --read-
--show-tilde --show-dot'
alias xzegrep='xzegrep --color=auto'
alias xzfgrep='xzfgrep --color=auto'
alias xzgrep='xzgrep --color=auto'
alias zegrep='zegrep --color=auto'
alias zfgrep='zfgrep --color=auto'
alias zgrep='zgrep --color=auto'
另外，你也可以自定义命令的别名，其格式为alias [命令别名]=['具体的命令']，示例命
```

令如下：

```sql
# alias aming='pwd'
# aming
/root
# unalias aming
# aming
bash: aming: command not found...
Failed to search for file: Cannot update read-only repo
```

### 10.1.4 通配符

```
在 bash 下，可以使用*来匹配零个或多个字符，用?匹配一个字符。示例命令如下：
# ls -d /tmp/4_6/test*
/tmp/4_6/test1 /tmp/4_6/test4 /tmp/4_6/test5
# touch /tmp/4_6/test111
# ls -d /tmp/4_6/test?
/tmp/4_6/test1 /tmp/4_6/test4 /tmp/4_6/test5
```

### 10.1.5 输入 / 输出重定向

输入重定向用于改变命令的输入，输出重定向用于改变命令的输出。输出重定向更为常用，它

```
经常用于将命令的结果输入到文件中，而不是屏幕上。输入重定向的命令是<，输出重定向的
命令是>。另外，还有错误重定向命令2>以及追加重定向命令>>，示例命令如下：
# mkdir /tmp/10
# cd /tmp/10
# echo "123" > 1.txt
# echo "123" >> 1.txt
# cat 1.txt
123
123
```

### 10.1.6 管道符

```
前面已经提过管道符|，它用于将前一个指令的输出作为后一个指令的输入，如下所示：
# cat /etc/passwd|wc -l
```

### 10.1.7 作业控制

```
当运行进程时，你可以暂停（按 Ctrl+Z 组合键）它，然后使用fg（foreground 的简写）命令
恢复它，或是利用bg（background 的简写）命令使它到后台运行。此外，你也可以使它终止
```

（按 Ctrl+C 组合键）。示例命令如下：

```
# vi test1.txt
testtestsstststst
接下来阿铭使用vi命令编辑 test1.txt，随便输入一些内容，按 Esc 键后，使用 Ctrl+Z 组合键
```

暂停任务，如下所示：

```
# vi test1.txt
[1]+ 已停止 vi test1.txt
此时提示vi test1.txt已经停止了，然后使用fg命令恢复它，此时就又进入刚才的vi窗口
了。再次使其暂停，然后输入jobs，可以看到被暂停或者在后台运行的任务，如下所示：
# jobs
[1]+ 已停止 vi test1.txt
如果想把暂停的任务放在后台重新运行，就使用bg命令，如下所示：
# bg
[1]+ vi test1.txt &
[1]+ 已停止 vi test1.txt
但是vi似乎并不支持在后台运行，那阿铭换一个其他的命令，如下所示：
# vmstat 1 > /tmp/1.log
^Z //此处按ctrl + z
[2]+ 已停止 vmstat 1 > /tmp/1.log
# jobs
[1]- 已停止 vi test1.txt
[2]+ 已停止 vmstat 1 > /tmp/1.log
# bg 2
[2]+ vmstat 1 > /tmp/1.log &
在上面的例子中，又出现了一个新的知识点，那就是多个被暂停的任务会有编号，使用jobs
命令可以看到两个任务，使用bg命令或者fg命令时，则需要在任务后面加编号。这里阿铭使
用命令bg 2把第 2 个暂停的任务放到后台重新运行（需要在命令后边加符号&，且中间有个
空格）。本例中的vmstat 1是用来观察系统状态的一个命令，阿铭在 13.1.2 节中再介绍。
如何关掉在后台运行的任务呢？如果你没有退出刚才的 shell，那么应该先使用命令“fg 编号”
```

把任务调到前台，然后按 Ctrl+C 组合键结束任务。如下所示：

```
# fg 2
vmstat 1 > /tmp/1.log
^C //此处按 ctrl + c
另一种情况则是，关闭了当前的 shell，再次打开另一个 shell 时，使用jobs命令并不会显示
在后台运行或者被暂停的任务。要想关闭这些任务，则需要先知道它们的pid。如下所示：
# vmstat 1 > /tmp/1.log &
[1] 32689
[root@localhost 10]# ps aux |grep vmstat
root 32689 0.1 0.0 41192 2012 pts/2 S 22:14 0:00 vmstat 1
root 32691 0.0 0.0 9184 1084 pts/2 R+ 22:14 0:00 grep --color=auto vmstat
使用&把任务放到后台运行时，会显示pid信息。如果忘记这个pid，还可以使用ps aux命
令找到那个进程（关于ps命令，阿铭会在 13.1.7 节中讲解）。如果想结束该进程，需要使用
kill命令，如下所示：
# kill 32689
# jobs
[1]+ Terminated vmstat 1 > /tmp/1.log
kill命令很简单，直接在后面加pid即可。如果遇到结束不了的进程时，可以在kill后面加
一个选项，即kill -9 [pid]。
在该节结束时，大家要记得把后台的vi给结束掉，免得以后遇到一些困扰。具体怎么结束，
```

阿铭相信，经过前面的学习，你应该知道答案了。

## 10.2 变量

```
阿铭在前面介绍过环境变量PATH，它是 shell 预设的一个变量。通常，shell 预设的变量都是
```

大写的。变量就是使用一个较简单的字符串来替代某些具有特殊意义的设定以及数据。就拿

```
PATH来讲，它就代替了所有常用命令的绝对路径的设定。有了PATH这个变量，我们运行某个
命令时，就不再需要输入全局路径，直接输入命令名即可。你可以使用echo命令显示变量的
```

值，如下所示：

```
# echo $PATH
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin
# echo $HOME
/root
# echo $PWD
/root
# echo $LOGNAME
root
除了PATH、HOME和LOGNAME外，系统预设的环境变量还有哪些呢？
```

### 10.2.1 命令env

```javascript
使用env命令，可列出系统预设的全部系统变量，如下所示：
# env
LS_COLORS=rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=
SSH_CONNECTION=192.168.18.1 62926 192.168.18.119 22
LANG=zh_CN.UTF-8
HISTCONTROL=ignoredups
HOSTNAME=localhost.localdomain
XDG_SESSION_ID=15
USER=root
SELINUX_ROLE_REQUESTED=
PWD=/tmp/10
HOME=/root
SSH_CLIENT=192.168.18.1 62926 22
SELINUX_LEVEL_REQUESTED=
XDG_DATA_DIRS=/root/.local/share/flatpak/exports/share:/var/lib/flatpak/exports/s
SSH_TTY=/dev/pts/2
MAIL=/var/spool/mail/root
TERM=xterm
SHELL=/bin/bash
SELINUX_USE_CURRENT_RANGE=
SHLVL=1
LOGNAME=root
DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/0/bus
XDG_RUNTIME_DIR=/run/user/0
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin
HISTSIZE=1000
LESSOPEN=||/usr/bin/lesspipe.sh %s
_=/usr/bin/env
OLDPWD=/root
```

登录不同的用户，这些环境变量的值也不同。当前显示的是 root 用户的环境变量。下面阿铭简单介绍一下常见的环境变量。

- HOSTNAME：表示主机的名称。

- SHELL：表示当前用户的 shell 类型。

- HISTSIZE：表示历史记录数。

- MAIL：表示当前用户的邮件存放目录。

- PATH：该变量决定了 shell 将到哪些目录中寻找命令或程序。

- PWD：表示当前目录。

- LANG：这是与语言相关的环境变量，多语言环境可以修改此环境变量。

- HOME：表示当前用户的家目录。

- LOGNAME：表示当前用户的登录名。

```
env命令显示的变量只是环境变量，系统预设的变量其实还有很多，你可以使用set命令把系
```

统预设的全部变量都显示出来。

### 10.2.2 命令set

```
set命令和env命令类似，也可以输出环境变量，如下所示：
# set
BASH=/bin/bash
BASHOPTS=checkwinsize:cmdhist:complete_fullquote:expand_aliases:extglob:extquote:
histappend:interactive_comments:login_shell:progcomp:promptvars:sourcepath
BASHRCSOURCED=Y
BASH_ALIASES=()
BASH_ARGC=()
BASH_ARGV=()
BASH_CMDS=()
BASH_COMPLETION_VERSINFO=([0]="2" [1]="7")
BASH_LINENO=()
BASH_REMATCH=()
BASH_SOURCE=()
BASH_VERSINFO=([0]="4" [1]="4" [2]="19" [3]="1" [4]="release" [5]="x86_64-redhat-
BASH_VERSION='4.4.19(1)-release'
COLUMNS=189
COMP_WORDBREAKS=$' \t\n"\'><=;|&(:'
DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/0/bus
DIRSTACK=()
EUID=0
FINAL_LIST=
GLUSTER_BARRIER_OPTIONS=$'\n ,\n \n'
阿铭并没有把全部内容都列出来，set命令不仅可以显示系统预设的变量，还可以显示用户自
```

定义的变量。比如，我们自定义一个变量，如下所示：

```
# myname=Aming
# echo $myname
Aming
# set |grep myname
myname=Aming
```

虽然你可以自定义变量，但是该变量只能在当前 shell 中生效，如下所示：

```
# echo $myname
Aming
# bash // 执行该命令，会进入一个子shell环境中
# echo $myname
# exit
exit
# echo $myname
Aming
使用bash命令可以再打开一个 shell，此时先前设置的myname变量已经不存在了，退出当前
shell 回到原来的 shell，myname变量还在。如果想让设置的环境变量一直生效，该怎么做
```

呢？这分以下两种情况。

- 允许系统内所有用户登录后都能使用该变量。具体的操作方法是：在 /etc/profile 文件的最

```
后一行加入export myname=Aming，然后运行source /etc/profile就可以生效
了。此时再运行bash命令或者切换到其他用户（如su - test）就可以看到效果。如下
```

- 所示：

```
# echo "export myname=Aming" >> /etc/profile
1
# source !$
2
source /etc/profile
3
# bash
4
# echo $myname
5
Aming
6
# exit
7
exit
8
# su - test
9
$ echo $myname
10
Aming
11
```

- 仅允许当前用户使用该变量。具体的操作方法是：在用户主目录下的.bashrc 文件的最后一

```
行加入export myname=Aming，然后运行source .bashrc就可以生效了。这时再登
录 test 用户，myname变量则不会生效了。这里source命令的作用是将目前设定的配置刷
```

- 新，即不用注销再登录也能生效。

```
阿铭在上例中使用myname=Aming来设置变量myname，那么，在 Linux 下设置自定义变量，
```

有哪些规则呢？

```
设定变量的格式为a=b，其中a为变量名，b为变量的内容，等号两边不能有空格。
```

- 变量名只能由字母、数字以及下划线组成，而且不能以数字开头。

- 当变量内容带有特殊字符（如空格）时，需要加上单引号。示例命令如下：

```
# myname='Aming Li'
1
# echo $myname
2
Aming Li
3
```

有一种情况需要你注意，就是变量内容中本身带有单引号，这时就需要加双引号了。示例命令如下：

```
# myname="Aming's"
# echo $myname
Aming's
```

如果变量内容中需要用到其他命令，则运行结果可以使用反引号。示例命令如下：

```
# myname=`pwd`
# echo $myname
/root
```

变量内容可以累加其他变量的内容，但需要加双引号。示例命令如下：

```
# myname="$LOGNAME"Aming
# echo $myname
rootAming
```

如果你不小心把双引号错加为了单引号，则得不到你想要的结果。示例命令如下：

```
# myname='$LOGNAME'Aming
# echo $myname
$LOGNAMEAming
```

通过上面几个例子，也许你已经看出了使用单引号和双引号的区别。使用双引号时，不会取消

```
双引号中特殊字符本身的作用（这里是$），而使用单引号时，里面的特殊字符将全部失去其
```

本身的作用。

```
在前面的例子中，阿铭多次使用了bash命令，如果在当前 shell 中运行bash指令，则会进入
一个新的 shell，这个 shell 就是原来 shell 的子 shell。你不妨用pstree指令来查看一下，示
```

例命令如下：

```
# pstree |grep bash
|-login---bash
|-sshd---sshd---bash-+-grep
# bash
# pstree |grep bash
|-login---bash
|-sshd---sshd---bash---bash-+-grep
如果没有该命令，请运行yum install psmisc命令安装，pstree命令会把 Linux 系统中
的所有进程以树结构显示出来。限于篇幅，阿铭没有全部列出，你可以直接输入pstree查
```

看。在父 shell 中设定变量后，进入子 shell 时，该变量是不会生效的。如果想让这个变量在

```
子 shell 中生效，则要用到export指令。示例命令如下：
# abc=123
# echo $abc
123
# bash
# echo $abc
# exit
exit
# export abc
# echo $abc
123
# bash
# echo $abc
123
```

```
其实export命令就是声明一下这个变量，让该 shell 的子 shell 也知道变量abc的值是123。
设置变量之后，如果想取消某个变量，只要输入unset变量名即可。示例命令如下：
# echo $abc
123
# unset abc
# echo $abc
```

## 10.3 系统环境变量与个人环境变量的配置文件

上面讲了很多系统变量，那么在 Linux 系统中，这些变量存在哪里呢？为什么用户一登录shell 就自动有了这些变量呢？我们先来看看下面几个文件。

```
/etc/profile：这个文件预设了几个重要的变量，例如PATH、USER、LOGNAME、MAIL、
INPUTRC、HOSTNAME、HISTSIZE、umask等。
/etc/bashrc：这个文件主要预设umask以及PS1。这个PS1就是我们在输入命令时前面的
那串字符。例如，阿铭的 Linux 系统的PS1就是[root@localhost ~]#，我们不妨看一
下PS1的值，如下所示：
# echo $PS1
1
[\u@\h \W]\$
2
其中，\u指用户，\h指主机名，\W指当前目录，\$指字符#（如果是普通用户，则显示为
$）。
```

除了以上两个系统级别的配置文件外，每个用户的主目录下还有以下几个隐藏文件。

- .bash_profile：该文件定义了用户的个人化路径与环境变量的文件名称。每个用户都可使用该文件输入专属于自己的 shell 信息，当用户登录时，该文件仅执行一次。

- .bashrc：该文件包含专属于自己的 shell 的 bash 信息，当登录或每次打开新的 shell 时，会读取该文件。例如，你可以将用户自定义的别名或者自定义变量写到这个文件中。

- .bash_history：该文件用于记录命令历史。

- .bash_logout：当退出 shell 时，会执行该文件。你可以将一些清理工作放到这个文件中。

## 10.4 Linux shell 中的特殊符号

```
在学习 Linux 的过程中，也许你已经接触过某个特殊符号，例如*，它是一个通配符，代表零
```

个或多个字符或数字。下面阿铭就介绍一下常用的特殊字符。

### 10.4.1 *代表零个或多个任意字符

这个字符前面已经介绍过，这里再次提到，它的用法如下：

```
# ls /tmp/4_6/test*
/tmp/4_6/test1 /tmp/4_6/test111 /tmp/4_6/test4 /tmp/4_6/test5
```

### 10.4.2 ?只代表一个任意的字符

这个字符的用法如下：

```
# touch /tmp/4_6/testa
# ls -d /tmp/4_6/test?
/tmp/4_6/test1 /tmp/4_6/test4 /tmp/4_6/test5 /tmp/4_6/testa
```

不管是数字还是字母，只要是一个字符，都能匹配出来。

### 10.4.3 注释符号#

```
这个符号在 Linux 中表示注释说明，即#后面的内容都会被忽略。用法如下：
# abc=123 #aaaaa
# echo $abc
123
```

### 10.4.4 脱义字符\

```bash
这个字符会将后面的特殊符号（如*）还原为普通字符。用法如下：
# ls -d test\*
ls: cannot access 'test*': No such file or directory
```

### 10.4.5 再说管道符|

这个字符前面曾多次出现过，它的作用是将前面命令的输出作为后面命令的输入。注意这里提

```
到的后面的命令，并不是所有的命令都可以，一般针对文档操作的命令比较常用。例如cat、
less、head、tail、grep、cut、sort、wc、uniq、tee、tr、split、sed、awk
等，其中grep、sed和awk是正则表达式必须掌握的工具，在第 11 章中会详细介绍。管道符
```

的用法如下：

```
# cat testb.txt |wc -l
0
在上例中，wc -l用来计算一个文档有多少行。上面阿铭列出了很多陌生的命令，这些命令在
```

日常的文档处理工作中非常实用，所以阿铭需要先简单介绍一下它们，如果你记不住，也没有关系，以后用到的时候再进一步了解即可。

1. 命令cut

```
cut命令用来截取某一个字段，其格式为cut -d '分隔字符' [-cf] n，这里的n是数
```

- 字。该命令有如下几个可用选项。

- -d：后面跟分隔字符，分隔字符要用单引号括起来。

- -c：后面接的是第几个字符。

- -f：后面接的是第几个区块。

```
cut命令的用法如下：
# cat /etc/passwd|cut -d ':' -f 1 |head -5
1
root
2
bin
3
daemon
4
adm
5
lp
6
通过上例可以看出，-d选项后面加冒号作为分隔字符，-f 1表示截取第一段，-f和1之间
```

- 的空格可有可无。示例命令如下：

```
# head -n2 /etc/passwd|cut -c2
1
o
2
i
3
# head -n2 /etc/passwd|cut -c1
4
r
5
b
6
# head -n2 /etc/passwd|cut -c1-10
7
root:x:0:0
8
bin:x:1:1:
9
# head -n2 /etc/passwd|cut -c5-10
10
:x:0:0
11
x:1:1:
12
```

```
通过上例可以看出，-c选项后面可以是一个数字n，也可以是一个区间n1-n2，还可以是
多个数字n1、n2和n3。示例命令如下：
# head -n2 /etc/passwd|cut -c1,3,10
1
ro0
2
bn:
3
```

2. 命令sort

```
sort命令用作排序，其格式为sort [-t 分隔符] [-kn1,n2] [-nru]，这里n1和n2
```

- 指的是数字，其他选项的含义如下。

```
-t：后面跟分隔字符，作用跟cut命令的-d选项一样。
```

- -n：表示使用纯数字排序。

- -r：表示反向排序。

- -u：表示去重复。

```
-kn1,n2：表示由n1区间排序到n2区间，可以只写-kn1，即对n1字段排序。
如果sort不加任何选项，则从首字符向后依次按 ASCII 码值进行比较，最后将它们按升序
```

- 输出。示例命令如下：

```javascript
# head -n5 /etc/passwd|sort
1
adm:x:3:4:adm:/var/adm:/sbin/nologin
2
bin:x:1:1:bin:/bin:/sbin/nologin
3
daemon:x:2:2:daemon:/sbin:/sbin/nologin
4
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
5
root:x:0:0:root:/root:/bin/bash
6
-t选项后面跟分隔符，-k选项后面跟单个数字表示对第几个区域的字符串排序，-n选项则
```

- 表示使用纯数字排序。示例命令如下：

```javascript
# head -n5 /etc/passwd |sort -t: -k3 -n
1
root:x:0:0:root:/root:/bin/bash
2
bin:x:1:1:bin:/bin:/sbin/nologin
3
daemon:x:2:2:daemon:/sbin:/sbin/nologin
4
adm:x:3:4:adm:/var/adm:/sbin/nologin
5
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
6
-k选项后面跟数字n1和n2表示对第n1和n2区域内的字符串排序，-r选项则表示反向排
```

- 序。示例命令如下：

```javascript
# head -n5 /etc/passwd |sort -t: -k3,5 -r
1
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
2
adm:x:3:4:adm:/var/adm:/sbin/nologin
3
daemon:x:2:2:daemon:/sbin:/sbin/nologin
4
bin:x:1:1:bin:/bin:/sbin/nologin
5
root:x:0:0:root:/root:/bin/bash
6
这里的-k3,5表示对第 3 区域至第 5 区域间的字符串排序。
```

3. 命令wc

```
wc命令用于统计文档的行数、字符数或词数。该命令的常用选项有-l（统计行数）、-m
（统计字符数）和-w（统计词数）。示例命令如下：
# wc /etc/passwd
1
45 103 2499 /etc/passwd
2
# wc -l /etc/passwd
3
45 /etc/passwd
4
# wc -m /etc/passwd
5
2499 /etc/passwd
6
# wc -w /etc/passwd
7
103 /etc/passwd
8
如果wc不跟任何选项，直接跟文档，则会把行数、词数和字符数依次输出。
```

4. 命令uniq

```
uniq命令用来删除重复的行，该命令只有-c选项比较常用，它表示统计重复的行数，并把
```

- 行数写在前面。我们先来编写一个文件，示例命令如下：

```
# vim testb.txt // 把下面的内容写入testb.txt并保存
1
111
2
222
3
111
4
333
5
使用uniq前，必须先给文件排序，否则不管用。示例命令如下：
# uniq testb.txt
1
111
2
222
3
111
4
333
5
# sort testb.txt |uniq
6
111
7
222
8
333
9
# sort testb.txt |uniq -c
10
2 111
11
1 222
12
1 333
13
```

5. 命令tee

```
tee命令后面跟文件名，其作用类似于重定向>，但它比重定向多一个功能，即在把文件写
入后面所跟文件的同时，还将其显示在屏幕上。该命令常用于管道符|后。示例命令如下：
# echo "aaaaaaaaaaaaaaaaaaaaaaaaaaa" |tee testb.txt
1
aaaaaaaaaaaaaaaaaaaaaaaaaaa
2
# cat testb.txt
3
aaaaaaaaaaaaaaaaaaaaaaaaaaa
4
```

6. 命令tr

```
tr命令用于替换字符，常用来处理文档中出现的特殊符号，如 DOS 文档中出现的符号
^M。该命令常用的选项有以下两个。
```

- -d：表示删除某个字符，后面跟要删除的字符。

- -s：表示删除重复的字符。

```
tr命令常用于把小写字母变成大写字母，如tr '[a-z]' '[A-Z]'。示例命令如下：
# head -n2 /etc/passwd |tr '[a-z]' '[A-Z]'
1
ROOT:X:0:0:ROOT:/ROOT:/BIN/BASH
2
BIN:X:1:1:BIN:/BIN:/SBIN/NOLOGIN
3
tr命令还可以替换一个字符，示例命令如下：
# grep 'root' /etc/passwd |tr 'r' 'R'
1
Root:x:0:0:Root:/Root:/bin/bash
2
opeRatoR:x:11:0:opeRatoR:/Root:/sbin/nologin
3
```

- 不过替换、删除以及去重复等操作都是针对一个字符来讲的，有一定的局限性。如果是针对

```
一个字符串，tr命令就不能再使用了，所以你只需简单了解一下即可。以后，你还会学到
```

- 更多可以实现字符串操作的工具。

7. 命令split

```
split命令用于切割文档，常用的选项为-b和-l。
```

- -b：表示依据大小来分割文档，单位为 B。示例命令如下：

```bash
# mkdir split_dir
1
# cd !$
2
cd split_dir
3
# cp /etc/passwd ./
4
# split -b 500 passwd
5
# ls
6
passwd xaa xab xac xad xae
7
如果split不指定目标文件名，则会以xaa、xab... 这样的文件名来存取切割后的文
```

- 件。当然，我们也可以指定目标文件名，如下所示：

```
# rm –f xa*
1
# split -b 500 passwd 123
2
# ls
3
123aa 123ab 123ac 123ad 123ae passwd
4
```

- -l：表示依据行数来分割文档。示例命令如下：

```
# rm -f 123a*
1
# split -l 10 passwd
2
# wc -l *
3
45 passwd
4
10 xaa
5
10 xab
6
10 xac
7
10 xad
8
5 xae
9
90 total
10
```

### 10.4.6 特殊符号$

```bash
符号$可以用作变量前面的标识符，还可以和!结合起来使用。示例命令如下：
# cd ..
# ls testb.txt
testb.txt
# ls !$
ls testb.txt
testb.txt
!$表示上条命令中的最后一个变量，本例中上条命令的最后是 testb.txt，那么在当前命令下输
入!$就代表 testb.txt。
```

### 10.4.7 特殊符号;

通常，我们都是在一行中输入一个命令，然后回车就表示运行了。如果想在一行中运行两个或

```
两个以上的命令，则需要在命令之间加符号;。示例命令如下：
# mkdir testdir ; touch test1.txt ; touch test2.txt; ls -d test*
test1.txt test2.txt testb.txt testdir
```

### 10.4.8 特殊符号~

```
符号~表示用户的家目录，root 用户的家目录是 /root，普通用户的是 /home/username。示例
```

命令如下：

```
# cd ~
# pwd
/root
# su aming
$ cd ~
$ pwd
/home/aming
```

### 10.4.9 特殊符号&

```
如果想把一条命令放到后台执行，则需要加上符号&，它通常用于命令运行时间较长的情况。
比如，可以用在sleep后，如下所示：
# sleep 30 &
[1] 3808
# jobs
[1]+ 运行中 sleep 30 &
```

### 10.4.10 重定向符号>、>>、2>和2>>

```
前面讲过重定向符号>和>>，它们分别表示取代和追加的意思。当我们运行一个命令报错时，
报错信息会输出到当前屏幕。如果想重定向到一个文本，则要用重定向符号2>或者2>>，它
```

们分别表示错误重定向和错误追加重定向。示例命令如下：

```bash
# ls aaaa
ls: cannot access 'aaaa': No such file or directory
# ls aaaa 2> /tmp/error
# cat /tmp/error
ls: cannot access 'aaaa': No such file or directory
# ls aaaa 2>> /tmp/error
# cat /tmp/error
ls: cannot access 'aaaa': No such file or directory
ls: cannot access 'aaaa': No such file or directory
```

### 10.4.11 中括号[]

```
中括号内为字符组合，代表字符组合中的任意一个，可以是一个范围（1-3，a-z），用法如
```

下：

```
# cd /tmp/10
# ls -d test*
test1.txt test2.txt testb.txt testdir
# ls -d test[1-3].txt
test1.txt test2.txt
# ls -d test[12b].txt
test1.txt test2.txt testb.txt
# ls -d test[1-9].txt
test1.txt test2.txt
# ls -d test[1-9a-z].txt
test1.txt test2.txt testb.txt
```

### 10.4.12 特殊符号&&和||

前面提到了分号可作为多条命令间的分隔符，其实还有两个可以用于多条命令中间的特殊符

```
号，那就是&&和||。下面阿铭列出以下几种情况：
```

- command1 ; command2

- command1 && command2

- command1 || command2

```
使用;时，不管command1是否执行成功，都会执行command2。
使用&&时，只有command1执行成功后，command2才会执行，否则command2不执行。
使用||时，若command1执行成功，则command2不执行，否则执行command2，即
command1和command2中总有一条命令会执行。接下来，阿铭要通过做试验来说明&&与||
```

这两个特殊符号的作用：

```bash
# rm -rf test*
# touch test1 test3
# ls test2 && touch test2
ls: cannot access 'test2': No such file or directory
# ls test2
ls: cannot access 'test2': No such file or directory
在本例中，只有当ls test2成功执行后，才会执行touch test2。因为 test2 不存在，ls
test2没有执行成功，所以&&后面的touch test2并没有执行。
# ls test2 || touch test2
ls: cannot access 'test2': No such file or directory
# ls test*
test1 test2 test3
本例中，若ls test2执行不成功，则会执行touch test2。因为 test2 不存在，所以ls
test2没有执行成功，转而执行||后面的touch test2，然后增加了 test2 这个文件。
```

## 10.5 课后习题

```
(1) 请设置环境变量HISTSIZE，使其能够保存 10 000 条命令历史。
(2) 如果设置PS1="[\u@\h \W]\$ "，为什么显示的结果和我们预想的不一样？如何才能恢
```

复默认设置？

(3) 如何把当前目录下文件的文件名中的小写字母全部替换为大写字母？

```
(4) 以:为分隔符，使用sort命令对 /etc/passwd 文件的第 5 段排序。
(5) 以:为分隔符，使用cut命令截出 /etc/passwd 的第 3 段字符。
```

(6) 简述这几个文件的作用：/etc/profile、/etc/bashrc、.bashrc 和.bash_profile。

```
(7) export的作用是什么？
```

(8) Linux 下自定义变量要符合什么样的规则？

(9) 如何把要运行的命令放到后台运行？如何把后台运行的进程调到前台？

(10) 列出当前目录下以 test 开头的文件和目录。

(11) 如何把一个命令的输出内容打印到屏幕上，并重定向到一个文件内？

(12) 假如有个命令很长，如何用一个简单的字符串代替这个复杂的命令呢？请举例说明。

(13) 如何把一个命令放到后台运行，并将其正确输出和错误输出同时重定向到一个文件内？

(14) 如何按照大小（如 10 MB）分隔一个大文件？又如何按照行数（如 10 000 行）分隔呢？

```
(15) 做试验弄清楚;、&&以及||这 3 个符号的含义。
```

(16) 如果只想让某个用户使用某个变量，如何做？

(17) 使用哪个命令能把系统当中所有的变量以及当前用户定义的自定义变量列出来？
