# 第5章Linux系统用户与用户组管理

关于这部分内容，阿铭在 Linux 系统日常管理工作中用得并不多，可这不代表这部分内容不重要。毕竟 Linux 系统是一个多用户系统，每个账号用来干什么，我们必须了如指掌，因为这涉及安全问题。

安装完系统后，如果我们一直使用 root 账号来操作，其实并不安全。因为 root 账号权限太高，容易误操作。阿铭建议你以后在工作中尽量避免直接使用 root 账号登录系统，使用普通用户就可以完成大部分工作。

## 5.1 认识 /etc/passwd 和 /etc/shadow

这两个文件可以说是 Linux 系统中最重要的文件之一。如果没有这两个文件或者这两个文件出了问题，则无法正常登录系统。下面咱们先来看看 /etc/passwd 文件，示例命令如下：

```javascript
# cat /etc/passwd | head
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
看到上面那条命令，你是不是有点不知所以呢？其实，head前面的符号|，我们称之为管道
```

符，它的作用是把前面命令的输出结果再输入给后面的命令。管道符在第 10 章中还会介绍，阿铭用得也蛮多的，请掌握它的用法。

### 5.1.1 解说 /etc/passwd

/etc/passwd 可以分割成 7 个字段，每个字段的具体含义如下所示。

- 第 1 个字段为用户名（如第 1 行中的 root 就是用户名），是代表用户账号的字符串。用户名中的字符可以是大小写字母、数字、减号（不能出现在首位）、点或下划线，其他字符不合法。虽然用户名中可以出现点，但不建议使用，尤其是首位。另外，减号也不建议使用，这样容易造成混淆。

```
第 2 个字段存放的是该账号的口令。这里为什么是x呢？早期的 Unix 系统口令确实存放在
这里，但基于安全因素，后来就将其存放到 /etc/shadow 中了，这里只用一个x代替。
```

- 第 3 个字段为一个数字，这个数字代表用户标识号，也称为 uid。系统就是通过这个数字识别用户身份的。这里的 0 就是 root，也就是说我们可以修改 test 用户的 uid 为 0，那么系统会认为 root 和 test 为同一个账户。uid 的取值范围是 0~65 535（但实际上已经可以支持到 4 294 967 294）。0 是超级用户（root）的标识号，CentOS 7 和 CentOS 8 的普通用户标识号从 1000 开始。如果我们自定义建立一个普通用户，那么会看到该账户的标识号是大于或等于 1000 的。

- 第 4 个字段也是数字，表示组标识号，也称为 gid。这个字段对应着 /etc/group 中的一条记录，其实 /etc/group 和 /etc/passwd 基本类似。

- 第 5 个字段为注释说明，没有实际意义。通常记录该用户的一些属性，例如姓名、电话、

```
地址等。我们可以使用chfn命令来更改这些信息。
```

- 第 6 个字段为用户的家目录，当用户登录时，就处在这个目录下。root 的家目录是 /root，普通用户的家目录则为 /home/username，用户家目录是可以自定义的。比如，建立一个普通用户 test1，要想让 test1 的家目录在 /data 目录下，只要将 /etc/passwd 文件中对应该用

```
户那行中的本字段修改为/data即可。
```

- 最后一个字段为用户的 shell。用户登录后，要启动一个进程，用来将用户下达的指令传给内核，这就是 shell。Linux 的 shell 有 sh、csh、ksh、tcsh、bash 等多种，而 Red Hat、CentOS 的 shell 就是 bash。查看 /etc/passwd 文件，该字段中除了 /bin/bash，还有很多/sbin/nologin，这表示不允许该账号登录。如果想建立一个不允许登录的账号，可以把该字段改成 /sbin/nologin，默认是 /bin/bash。

### 5.1.2 解说 /etc/shadow

```
/etc/shadow 和 /etc/passwd 类似，由:分割成 9 个字段，示例命令如下：
# cat /etc/shadow |head -n 3
root:$6$Wu/W4eryssf9B3xQ$jgNuM24oQ9boSTUPaeJ/79GFjLUX912bSDu3ak40qJIxNj4/SpaK.JXg
5tvNIoBJ7RNcpH2K.1:18257:0:99999:7:::
bin:*:18078:0:99999:7:::
daemon:*:18078:0:99999:7:::
```

每个字段的含义如下所示。

- 第 1 个字段为用户名，与 /etc/passwd 对应。

- 第 2 个字段为用户密码，是该账号的真正密码。虽然这个密码已经加密，但是有些黑客还

```
是能够解密的。所以将该文件属性设置为000，但 root 账户还是可以访问或更改的。使用
命令ls -l查看该文件的权限，示例命令如下：
# ls -l /etc/shadow
1
---------- 1 root root 689 12月 30 07:46 /etc/shadow
2
```

- 第 3 个字段为上次更改密码的日期，这个数字以 1970 年 1 月 1 日和上次更改密码的日期为基准计算而来。例如，上次更改密码的日期为 2020 年 1 月 1 日，则这个值就是 365×（2020－1970）+（2020－1970）/4+1=18263。如果是闰年，则有 366 天。

- 第 4 个字段为要过多少天才可以更改密码，默认是 0，即不受限制。

- 第 5 个字段为密码多少天后到期，即在多少天内必须更改密码。例如，这里设置成 30，则30 天内必须更改一次密码；否则，将不能登录系统。默认是 99999，可以理解为永远不需要改。

- 第 6 个字段为密码到期前的警告期限。若这个值设置成 7，则表示当 7 天后密码过期时，系统就发出警告，提醒用户他的密码将在 7 天后到期。

- 第 7 个字段为账号失效期限。如果这个值设置为 3，则表示密码已经到期，然而用户并没有在到期前修改密码，那么再过 3 天，这个账号便失效，即锁定。

- 第 8 个字段为账号的生命周期。跟第 3 个字段一样，这个周期是按距离 1970 年 1 月 1 日多少天算的。它表示的含义是账号在这个日期前可以使用，到期后将作废。

- 最后一个字段作为保留用的，没有什么意义。

上面关于密码文件字段的介绍内容偏多并且不太容易记住，在这里阿铭提醒你，这部分内容无须记住，只需要了解即可，因为在工作中我们几乎用不到这些知识点。

## 5.2 用户和用户组管理

上面介绍了 /etc/passwd 和 /etc/shadow 这两个文件的具体含义，但这些只是理论知识。实际上，对于在 Linux 下如何创建、删除用户和组以及如何更改用户和组的属性，我们一无所知。

### 5.2.1 新增组的命令groupadd

```
命令groupadd的格式为groupadd [-g GID] groupname，示例命令如下：
# groupadd grptest1
# tail -n1 /etc/group
grptest1:x:1002:
如果不加-g选项，则按照系统默认的gid创建组。跟uid一样，gid也是从 1000 开始的。我
们也可以按如下操作自定义gid：
# groupadd -g 1008 grptest2
# tail -n2 /etc/group
grptest1:x:1002:
grptest2:x:1008:
```

### 5.2.2 删除组的命令groupdel

有时，我们会有删除组的需求，此时可进行如下操作：

```
# groupdel grptest2
# tail -n2 /etc/group
slocate:x:21:
grptest1:x:1002:
命令groupdel没有特殊选项，但有一种情况不能删除组，如下所示：
# groupdel user1
groupdel：不能移除用户“user1”的主组
```

上例中，user1 组中包含 user1 账户，只有删除 user1 账户后才可以删除 user1 组。

### 5.2.3 增加用户的命令useradd

```
从字面意思上看，useradd就是增加用户，该命令的格式为useradd [-u UID] [-g
GID] [-d HOME] [-M] [-s]，其中各个选项的具体含义如下。
```

- -u：表示自定义 UID。

```
-g：表示使新增用户属于某个已经存在的组，后面可以跟组id，也可以跟组名。
```

- -d：表示自定义用户的家目录。

- -M：表示不建立家目录。

- -s：表示自定义 shell。

下面我们先来新建一个用户 test10，示例命令如下：

```
# useradd test10
# tail -n1 /etc/passwd
test10:x:1001:1001::/home/test10:/bin/bash
# tail -n1 /etc/group
test10:x:1001:
如果useradd不加任何选项，直接跟用户名，则会创建一个跟用户名同名的组。当然，很多
时候需要我们自己去定义uid、gid或者所属的组，示例命令如下：
# useradd -u1005 -g 1006 -M -s /sbin/nologin user11
useradd：“1006”组不存在
# useradd -u1005 -g 1001 -M -s /sbin/nologin user11
# useradd -u1006 -g grptest1 user12
# tail -n2 /etc/passwd
user11:x:1005:1001::/home/user11:/sbin/nologin
user12:x:1006:1002::/home/user12:/bin/bash
# tail -n2 /etc/group
user1:x:1003:
test10:x:1001:
如果-g选项后面跟一个不存在的gid，则会报错，提示该组不存在。刚刚上面说过，加上-M
选项后，则不建立用户家目录，但在 /etc/passwd 文件中仍然有这个字段。如果你使用命令ls
/home/user11查看一下，会提示该目录不存在。所以，-M选项的作用只是不创建那个目
```

录。下面我们来查看 user11 的家目录，会提示我们目录不存在，示例命令如下：

```bash
# ls /home/user11
ls: 无法访问/home/user11: 没有那个文件或目录
```

### 5.2.4 删除用户的命令userdel

```
命令userdel的格式为userdel [-r] username，其中-r选项的作用是当删除用户时，
```

一并删除该用户的家目录。下面我们先来看看 user12 的家目录，示例命令如下：

```bash
# ls -ld /home/user12
drwx------ 2 user12 grptest1 62 1月 2 06:47 /home/user12
如果不加-r选项，则会直接删除用户 user12，但保留其家目录，命令如下所示：
# userdel user12
# ls -ld /home/user12
drwx------ 2 user12 grptest1 62 1月 2 06:47 /home/user12
此时 user12 的家目录还在，那么我们加上-r选项后再删除 user1 用户，命令如下所示：
# ls -ld /home/user1
drwx------ 2 user1 test10 62 12月 30 07:46 /home/user1
# userdel -r user1
# ls -ld /home/usre1
ls: 无法访问/home/user1: 没有那个文件或目录
```

此时 user1 的家目录已经不复存在。

## 5.3 用户密码管理

密码对于一个用户来说是非常关键的，而且密码管理是系统管理员的一项非常重要的任务。

### 5.3.1 命令passwd

用户创建后，默认是没有设置密码的。只有设置好密码后，才可以登录系统。为了安全，在为用户创建密码时，请尽量设置复杂一些。阿铭建议你按照如下规则设置密码：

- 长度大于 10 个字符；

```
密码中包含大小写字母、数字以及特殊字符*、&、%等；
```

- 不规则性（不要出现 happy、love、linux、7758520、111111 等单词或者数字）；

- 密码中不要带有自己的名字、电话、生日以及公司名字等。

```
为用户设置密码时，可以使用命令passwd，其格式为passwd [username]。该命令后面若
```

不加用户名，则是为自己设定密码，示例命令如下：

```
# passwd
更改用户root的密码 。
新的 密码：
重新输入新的 密码：
passwd： 所有的身份验证令牌已经成功更新。
```

如果你登录的是 root 用户，则后面可以跟普通用户的名字，意思是修改指定用户的密码，示例命令如下：

```
# passwd user11
更改用户 user11 的密码 。
新的 密码：
重新输入新的 密码：
passwd： 所有的身份验证令牌已经成功更新。
```

需要注意的是，只有 root 才可以修改其他用户的密码，普通用户只能修改自己的密码。

### 5.3.2 命令mkpasswd

```
命令mkpasswd用于生成密码。我们安装的 Linux 默认是没有这个命令的，因此需要安装一个
```

expect 软件包，安装命令如下：

```
# yum install -y expect
# mkpasswd
$C7iuod6M
有时，我们需要生成指定长度的密码，这个用mkpasswd命令也可以满足。比如，生成 12 位
```

长度的密码，示例命令如下：

```
# mkpasswd -l 12
j8nUg/0rddZh
```

当然，我们还可以指定密码中有几个特殊字符或有几个数字，示例命令如下：

```
# mkpasswd -l 12 -s 0 -d 3
yr4jm6SiwZ4p
上例中，-s指定的是特殊字符的个数，-d指定的是数字的个数。用生成的随机字符串作为密
```

码再好不过了，只不过它不方便记忆。大家是否还记得第 1 章阿铭介绍的 KeePass 工具？大家可以把密码记录在这里，还是很方便的。

## 5.4 用户身份切换

在 Linux 系统中，有些事情只有 root 用户才能做，普通用户是不能的，这时就需要临时切换到 root 身份。下面阿铭带你做一个小试验，创建 test 用户，并修改其密码，这样我们就可以使用 test 用户登录 Linux 了。具体操作方法如下：

```
# useradd test
# passwd test
更改用户 test 的密码 。
新的 密码：
重新输入新的 密码：
passwd： 所有的身份验证令牌已经成功更新。
```

然后用 test 用户登录 Linux，示例命令如下：

```
login as: test
test@192.168.188.128's password:
$ whoami
test
登录后，使用whoami命令查看，发现当前用户是 test。普通用户和 root 用户的 shell 提示符
号有些区别，root 用户是#，普通用户是$。
```

### 5.4.1 命令su

```
命令su的格式为su [-] username，su后面既可以跟-，也可以不跟。普通用户的su命令
不加username时，结果就是切换到 root 用户。当然，root 用户同样可以使用su命令切换到
普通用户。该命令加上-后，会初始化当前用户的各种环境变量（关于环境变量这部分内容，
阿铭放在第 10 章中讲解）。下面阿铭做个简单的试验来说明加与不加-的区别，示例命令如
```

下：

```
$ pwd
/home/test
$ su
```

- 密码：

```
# pwd
/home/test
# exit
```

- 登出

```
$ su -
```

- 密码：

```
# pwd
/root
如果不加-，普通用户切换到 root 用户时，当前目录没有变化；而加上-切换到 root 用户时，
```

当前目录为 root 用户的家目录。这跟直接登录 root 用户是一样的。当由 root 用户切换到普通用户时，是不需要输入密码的。在 root 下切换到普通用户的示例命令如下：

```
# su - test
上一次登录：四 1月 2 07:01:09 EST 2020从 192.168.72.1pts/2 上
$ whoami
test
```

### 5.4.2 命令sudo

```
用su可以切换用户身份，而且每个普通用户都能切换到 root 身份。如果某个用户不小心泄露
```

了 root 的密码，那系统岂不是非常不安全？是的。为了改进这个问题，Linux 系统工程师设计

```
了sudo这个命令。使用sudo命令执行一个只有 root 才能执行的命令是可以办到的，但是需
```

要输入密码。这个密码并不是 root 的密码，而是用户自己的密码。在默认情况下，只有 root

```
用户才能使用sudo命令，普通用户想要使用，是需要 root 预先设定的。我们可以使用
visudo命令编辑相关的配置文件 /etc/sudoers。如果没有visudo这个命令，请使用命令yum
install -y sudo安装。
默认 root 支持sudo，是因为配置文件中有一行root ALL=(ALL) ALL。在该行下面加入
test ALL=(ALL) ALL，就可以让 test 用户拥有sudo的特权。这行从左到右，第一段 test
表示一个用户，用于指定让哪个用户有sudo特权；第二段ALL=(ALL)比较难理解，左边的
ALL指的是所有的主机，右边的ALL指的是获取哪个用户的身份，这段几乎都不用配置；第三
段用于设定可以使用sudo的命令有哪些。
使用visudo命令编辑 /etc/sudoers 配置文件（必须要使用 root 用户），visudo命令的使用
方法和阿铭前面介绍的vi命令一样，即输入i进入编辑模式，编辑完成后，按 Esc 键，再输
入:wq完成保存。具体操作方法如下所示：
## Allow root to run any commands anywhere
root ALL=(ALL) ALL
test ALL=(ALL) ALL
```

此时可以验证一下 test 用户的权限了，方法如下（操作是在 root 账号下进行的）：

```bash
# su test
$ ls // 当前目录是在/root下
ls: 无法打开目录'.': 权限不够
$ sudo ls
```

- 我们信任您已经从系统管理员那里了解了日常注意事项。总结起来无外乎这三点：

```
#1) 尊重别人的隐私。
#2) 输入前要先考虑(后果和风险)。
#3) 权力越大，责任越大。
[sudo] test 的密码：
123 456 anaconda-ks.cfg
由于切换到 test 用户后当前目录还是 /root，test 用户没有任何权限，所以使用命令ls查看
时，会提示权限不够。然而使用命令sudo ls输入 test 用户自身的密码后，就有权限了。初
次使用sudo命令时，会出现上面的一大段提示，当再次使用sudo命令时则不再提示。
如果每增加一个用户就需要多设置一行，那这样也太麻烦了，所以可以这样设置：把#
%wheel ALL=(ALL) ALL前面的#去掉，让这一行生效。此设置的意思是，让wheel这个组
的所有用户都拥有sudo的权利。接下来，只要把所有需要设置sudo权限的用户都加入到
wheel这个组中即可。如下所示：
```

```
## Allows people in group wheel to run all commands
%wheel ALL=(ALL) ALL
配置文件 /etc/sudoers 中包含许多配置项，可以使用命令man sudoers来获得帮助信息。下
```

面阿铭介绍一个很实用的案例，我们的需求是把 Linux 服务器设置成这个样子：只允许使用普

```
通用户登录，而普通用户登录后，可以不输入密码就能用sudo切换到 root 用户。阿铭的配置
```

方法是，输入如下命令：

```
# visudo
```

然后在文件的最后加入如下 3 行：

```
User_Alias USER_SU = test, test1, aming
Cmnd_Alias SU = /usr/bin/su
USER_SU ALL=(ALL) NOPASSWD: SU
其中第一行设定了一个 user 别名，其实这个USER_SU相当于是 test、test1 和 aming 三个用
户；第二行设定了一个命令别名，SU相当于 /usr/bin/su；第三行我们刚刚介绍过。保存配置
文件后，使用 test、test1、aming 这 3 个用户登录 Linux。执行命令sudo su -切换到 root
```

用户，获取 root 用户的所有权利，命令如下所示：

```
# su - test
$ sudo su -
# whoami
root
```

不允许 root 直接登录，这个问题该如何解决呢？其实很简单，就是设置一个复杂到连自己都

```
记不住的密码。不过这样也会有一个问题，就是普通用户可以使用su命令切换到 root，然后
```

再修改简单的密码就能直接登录 root 了。其实阿铭还有一个更好的办法，请看下面。

### 5.4.3 不允许 root 远程登录 Linux

/etc/ssh/sshd_config 为 sshd 服务的配置文件，默认允许 root 用户通过 ssh 远程登录 Linux。要想不允许 root 用户远程登录 Linux，具体操作方法为：修改配置文件

```
/etc/ssh/sshd_config，在文件中查找PermitRootLogin yes并修改为PermitRootLogin
no。保存配置文件后，需要重启 sshd 服务，命令如下所示：
# systemctl restart sshd.service
```

需要注意的是，阿铭提供的这个方法只适用于通过 ssh 远程登录 Linux 的情况。

## 5.5 课后习题

```
(1) 查看配置文件 /etc/shadow 第一行中 root 账号的第 3 个字段（由:分隔）中的数字，请算
```

一下这个数字是怎么得来的？

(2) 写出一个你认为很强大的密码。

(3) 查资料弄清楚 /sbin/nologin 和 /bin/false 的区别。你知道它们分别用在什么场合吗？

(4) 当我们创建一个新账号时，系统会修改哪几个文件呢？

(5) 如果我们已经创建了一个普通用户 user1，默认这个用户的家目录为 /home/user1，请做试验证明能否通过直接修改 /etc/passwd 配置文件中 user1 的家目录那个字段来改变 user1 的家

```
目录呢？（提示：你可以使用cd ~命令进入当前用户的家目录来验证）
(6) /etc/passwd 文件以:为分隔符，第 3、4 个字段分别表示什么含义？如果把某一行的第 3
```

个字段改为 0，会发生什么呢？

(7) 请先新增一个组 group11，然后再新增一个账号 user12，并使该账号所属组为 group11组。

(8) 如果删除一个组时报错：cannot remove the primary group of user 'aming'，这是什么意思？如何解决该问题呢？

(9) 如何在删除某个用户时一并删除这个用户的家目录？

```
(10) 如果你的 Linux 没有命令mkpasswd，则需要安装什么软件包？
```

(11) 普通用户可以修改自己的密码吗？

```
(12) 使用su命令时，后面加-表示什么含义？
(13) sudo命令的作用是什么？
```

(14) 创建系统账号时，用户名要符合什么样的规范？

```
(15) 你知道在 Linux 系统里uid最大是多少吗？创建一个普通账号的默认uid最小是多少？
```

(16) 一个用户可以同时属于多个用户组吗？如果可以，如何把一个用户加入到另外的组里？如何同时加入多个组？
