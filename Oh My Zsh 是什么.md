安装 **Oh My Zsh**

### Oh My Zsh 是什么

- **Oh My Zsh** 是一款社区驱动的命令行工具，正如它的主页上说的，**Oh My Zsh** 是一种生活方式。它基于 **zsh** 命令行，提供了主题配置，插件机制，已经内置的便捷操作。给我们一种全新的方式使用命令行。
- **Oh My Zsh** 是基于 **zsh** 命令行的一个扩展工具集，提供了丰富的扩展功能。
- 安装 **Oh My Zsh** 前提条件：必须已安装 **zsh**
- 笔者是 **Mac** 系统，以下操作都是基于 **Mac** 系统。

https://link.zhihu.com/?target=http%3A//ohmyz.sh/

https://link.zhihu.com/?target=https%3A//github.com/robbyrussell/oh-my-zsh



### Zsh 是什么

- **Zsh** 是一款强大的虚拟终端，既是一个系统的虚拟终端，也可以作为一个脚本语言的交互解析器。

```bash
# 打开终端，在终端上输入: 
zsh --version

# 这个命令来查看我们的电脑上是否安装了 Zsh 
# 端查询版本为： zsh 5.8 (x86_64-apple-darwin20.0)
```

- 终端查询版本为： **zsh 5.7.1 (x86_64-apple-darwin18.2.0)**

```bash
# 查看系统当前 shell
cat /etc/shells 
```



### 安装 Oh My Zsh 方法

- **可以通过 curl 或 wget 两种方式来安装，用一条命令即可安装。**

```bash
yum install git curl wget zsh -y
```



### curl 安装

**GitHub**:

```bash
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

**Gitee ( 国内镜像 )**

```bash
sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"
```

------

### wget 安装

**GitHub**:

```bash
sh -c "$(wget https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
```

### **Gitee ( 国内镜像 )**

```bash
sh -c "$(wget -O- https://gitee.com/pocmon/mirrors/raw/master/tools/install.sh)"
```

------

### 安装过程中输出如下：

```bash
xxxx% sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" 
Cloning Oh My Zsh...
Cloning into '/Users/xxxx/.oh-my-zsh'...
remote: Counting objects: 831, done.
remote: Compressing objects: 100% (700/700), done.
remote: Total 831 (delta 14), reused 775 (delta 10), pack-reused 0
Receiving objects: 100% (831/831), 567.67 KiB | 75.00 KiB/s, done.
Resolving deltas: 100% (14/14), done.
Looking for an existing zsh config...
Found ~/.zshrc. Backing up to ~/.zshrc.pre-oh-my-zsh
Using the Oh My Zsh template file and adding it to ~/.zshrc
             __                                     __   
      ____  / /_     ____ ___  __  __   ____  _____/ /_  
     / __ \/ __ \   / __ `__ \/ / / /  /_  / / ___/ __ \ 
    / /_/ / / / /  / / / / / / /_/ /    / /_(__  ) / / / 
    \____/_/ /_/  /_/ /_/ /_/\__, /    /___/____/_/ /_/  
                            /____/                       ....is now installed!
Please look over the ~/.zshrc file to select plugins, themes, and options.
p.s. Follow us at https://twitter.com/ohmyzsh.
p.p.s. Get stickers and t-shirts at http://shop.planetargon.com.
```

------

### 设置主题

### 设置固定主题

- **安装完毕后，我们就可以使用了，先来简单配置一下，Oh My Zsh 提供了很多主题风格，我们可以根据自己的喜好，设置主题风格**

```bash
## 1.将zsh设置为默认shell
$ chsh -s /bin/zsh

## 2.安装oh-my-zsh
$ sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

## 2.1 下载插件: 命令自动补全
$ git clone https://gitee.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions

## 2.2 下载插件: 命令高亮
$ git clone https://gitee.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM}/plugins/zsh-syntax-highlighting

## 2.3 下载主题: powerlevel10k
$ git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

## 3.修改.zsh配置
$ vim ~/.zshrc  # 或 nano ~/.zshrc

### 作如下修改:
### 修改主题
export TERM="xterm-256color"
ZSH_THEME="powerlevel10k/powerlevel10k"

### 配置插件: 找到 plugins=(git) 按如下修改，增加刚下载的两个插件
plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
)

## 4.刷新环境变量
$ source ~/.zshrc

## 5.[配置主题 powerlevel10k]
### 安装完成会自动进入配置界面,如需手动修改配置可以执行:
$ p10k configure
### 按照提示选择自己喜欢的设置即可
```

- 保存这个文件文件，重新打开终端。

------

### 设置随机主题

- **我们还可以随机设置主题：**
- 步骤同上

```bash
ZSH_THEME="random"
```

- 每次打开终端主题是随机的。
- 终端输出：

```bash
[oh-my-zsh] Random theme '/Users/xxxx/.oh-my-zsh/themes/zhann.zsh-theme' loaded...
```

- 其中 **zhann.zsh-theme** 是主题的名称， 有喜欢的童鞋可以记录保留.

------

### 查看主题名称

- **Oh My Zsh** 默认自带了一些默认主题，存放在 **~/.oh-my-zsh/themes** 目录中。我们可以查看这些主题
- 终端输入：

```bash
cd ~/.oh-my-zsh/themes && ls
```

[查看更多主题样式github.com/robbyrussell/oh-my-zsh/wiki/Themes](https://link.zhihu.com/?target=https%3A//github.com/robbyrussell/oh-my-zsh/wiki/Themes)

------

### 卸载 Oh My Zsh

- 终端输入 ：

```bash
uninstall_oh_my_zsh
Are you sure you want to remove Oh My Zsh? [y/N]  Y
```

- 终端提示信息：

```bash
Removing ~/.oh-my-zsh
Looking for original zsh config...
Found ~/.zshrc.pre-oh-my-zsh -- Restoring to ~/.zshrc
Found ~/.zshrc -- Renaming to ~/.zshrc.omz-uninstalled-20170820200007
Your original zsh config was restored. Please restart your session.
Thanks for trying out Oh My Zsh. It's been uninstalled.
```

------

### Tips

- **Oh My Zsh** 的自动更新提示误触关掉了解决办法
- 打开终端输入：

```bash
upgrade_oh_my_zsh
```

- https://zhuanlan.zhihu.com/p/264161761)

------

**Oh My Zsh 定制主题：**

[Dream：Oh My Zsh, 『 Powerlevel9k 安装 & 配置 』30 赞同 · 7 评论文章![img](https://pic4.zhimg.com/v2-d954f509151d626211b2dce379cef807_180x120.jpg)](https://zhuanlan.zhihu.com/p/265525597)

[Dream：Oh My Zsh,『 Agnoster 主题配置 』8 赞同 · 0 评论文章![img](https://pic3.zhimg.com/v2-1cca76fdb0ecee31ad550081607f1ad2_180x120.jpg)](https://zhuanlan.zhihu.com/p/62419420)