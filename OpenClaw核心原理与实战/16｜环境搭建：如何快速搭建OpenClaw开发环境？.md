# 16 | 环境搭建：如何快速搭建OpenClaw开发环境？

你好，我是 Henry，欢迎来到《OpenClaw 核心原理与实战》。

前面我们一起深入拆解了 OpenClaw 的核心原理——Agent Loop 怎么循环推理、Memory 怎么做向量记忆、消息怎么路由到正确的 Agent，这些知识帮你建立了对 OpenClaw 内部机制的完整认知。学到这里，你可能有一个强烈的感受：我知道 OpenClaw 怎么工作了，但我还没有真正用过它。

这就是演练场模块要解决的问题。演练场（一）共四节课，核心理念是“配置驱动、零代码上手”，就能让 OpenClaw 为你工作。这正是 VibeCoding 理念的落地，非技术人员通过配置和自然语言驱动 AI Agent。

今天是第一步：我们先把 OpenClaw 装好，接通一个聊天通道，让 Agent 回复你的第一条消息。这一步看起来简单，但它是后面所有实战的基础。就像盖房子，今天我们打地基。地基稳了，后面才能一层一层盖上去。

## 三条安装路径——按你的角色选择

### 为什么提供三条路径

在正式操作之前，先回答一个问题：为什么安装方式不是一刀切？

因为不同受众需求差异很大。一键 Docker、本地安装、云服务器部署三种安装方式，核心区别在于运行环境、使用场景和对使用者的技术背景要求。

- 路径 A（一键 Docker）：追求稳定、安全、省心，适合不熟悉编程但希望系统长期稳定运行的用户，如运营、产品、管理者。

- 路径 B（本地安装）：看重开发、调试的灵活性，适合有技术背景的开发者。

- 路径 C（云服务器部署）：需要远程访问、7×24 小时持续在线，适合需要随时随地使用或团队共用的用户。

如果你不确定选哪个，就选路径 A。Docker 安装是最省心的方式，它把 OpenClaw 和所有依赖打包在一个容器里，与你电脑上的其他软件完全隔离，不会弄乱你的环境。

### 路径 A：一键 Docker 安装

优点：

- 环境隔离，系统干净：所有依赖打包在独立容器里，不会污染你的电脑系统，也彻底避免了因环境不一致导致的“在我电脑上能跑”的问题。

```
简单快速，管理方便：只需  docker-compose up -d 一条命令即可启动，升级、回滚、
```

- 卸载等管理操作也非常简单。

- 安全加固，风险可控：AI Agent 执行危险命令的风险被隔离在容器内，加上权限限制，大大降低了对宿主机的安全威胁。

安装条件：

1. Docker Desktop（Windows/Mac）或 Docker Engine（Linux）

2. Docker Compose ≥ v2.0.0

3. 至少 1 核、2GB 内存、20GB 存储；推荐 2 核、4GB 内存、40GB SSD

4. 网络连接正常，服务器需能访问外网（用于拉取镜像）

### 第一步，安装 Docker 环境：

Windows 用户：

```
以管理员身份打开 PowerShell，运行  wsl --install  安装并重启。
从  Docker 官网下载安装 Docker Desktop for Windows，确保安装时勾选  Use WSL 2
instead of Hyper-V。
在 Docker Desktop 设置 (Settings > Resources > WSL Integration) 中，为你的
```

- WSL2 发行版启用集成。

macOS 用户：

直接下载并安装 Docker Desktop for Mac。

Linux 用户：

使用官方提供的便捷脚本进行安装：

```bash
# 国内用户建议使用镜像加速
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
sudo usermod -aG docker $USER
# 运行后请退出并重新登录，或重启终端使用户组权限生效。
```

### 第二步，核心部署步骤

方式 A：全自动交互式脚本 (推荐新手)

```bash
# 通过向导自动完成，能最大程度避免出错
# 1. 克隆项目
git clone https://github.com/openclaw/openclaw.git
cd openclaw
# 2. 运行官方设置脚本
./scripts/docker/setup.sh
```

交互式会引导依次完成以下配置：

1. 安全确认：阅读并确认运行 AI Agent 的安全注意事项

2. 模型提供商配置：选择模型（OpenAI/Anthropic/ 通义千问等），并输入 API Key 或通过OAuth 认证

3. 聊天渠道配置：选择需要接入的消息平台（Telegram、飞书、Discord 等），并输入对应凭证

4. 渠道白名单：配置哪些渠道或用户可以访问机器人

5. 技能配置：启用可选功能，如联网搜索、图像生成等

6. 网关启动：完成构建并启动服务

提示：如果某些配置项暂不确定，可以留空跳过，后续再通过 Web 管理界面或 CLI 工具补充配置。

方式 B：手动配置 Docker Compose (适合自定义)

创建配置目录：

```bash
mkdir -p ~/.openclaw
cd ~/.openclaw
为什么用 ~/.openclaw？这是 OpenClaw 的默认数据目录。所有配置、会话数据、记忆数
```

据都存在这里。放在用户主目录下是一个安全的选择，它的权限默认只有你自己能访问。

```
创建核心配置文件 openclaw.yaml：
# ~/.openclaw/openclaw.yaml — 最小可运行配置
providers:
 anthropic:
   apiKey: "${ANTHROPIC_API_KEY}"  # 推荐 Claude 模型
agents:
 list:
   - id: assistant
     model: claude-sonnet-4-20250514  # 性价比之选
```

这个配置只有 7 行有效内容，但它已经定义了一个完整的 Agent 系统。我们来逐字段理解：

```
providers：声明 LLM 提供商，OpenClaw 内置 33 种 LLM Provider，这里只需要声明你
要用的那个。apiKey 使用 ${ANTHROPIC_API_KEY} 格式引用环境变量，不要在配置文
```

- 件中明文写入 API Key。

```
agents.list：声明 Agent 列表。每个 Agent 有一个唯一的 id 和一个 model。
OpenClaw 内置了一些默认值，例如 DEFAULT_PROVIDER = "anthropic"、
DEFAULT_MODEL = "claude-sonnet-4-20250514"——这里的配置与默认值一致，
```

- 所以即使省略这些字段，OpenClaw 也能正常启动。但显式声明比隐式依赖更好，可以让配置文件成为系统行为的唯一真实来源。

编写 docker-compose.yml：

```
version: '3.8'
services:
 openclaw:
   image: openclaw/openclaw:latest
   container_name: openclaw-gateway
   ports:
     - "3000:3000"
   volumes:
     - ~/.openclaw:/root/.openclaw
   environment:
     - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
   restart: unless-stopped
```

设置环境变量并启动：

```bash
# 设置 API Key 环境变量
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
# 一键启动
docker-compose up -d
# 查看运行状态及日志
docker compose ps
docker compose logs -f openclaw-gateway
# 停止/重启服务
docker compose stop
docker compose start
docker compose restart
执行完毕后，打开浏览器访问 http://localhost:3000，你应该能看到 OpenClaw 的
```

Control UI 界面。

### 路径 B：本地安装

### Windows 用户：

检查依赖：

安装 Git 和 Node.js：

```
# git 官方下载地址
https://git-scm.com/install/windows
# Node.js 官方下载地址
https://nodejs.org/zh-cn/download
```

安装 OpenClaw：

打开 powershell 管理员模式执行以下命令：

```
iwr -useb https://openclaw.ai/install.ps1 | iex
```

基于交互式逐次进行下面步骤

```sql
Staring setup ，选择 Yes
Setup mode，选择 QuickStart（快速安装）
Model/auth provider，选择大模型，这里可以选择 Skip for now（跳过，后续配置）
Filter models by provider，选择 ALL providers
Default model，可以选择暂时第一个 Keep current
Select channel，后续配置选择 Skip for now
Search provider，后续配置选择 Skip for now
```

8. Configure skills now? 可以不配置 skills

9. Enable hooks？全部选择，按空格选中后回车

```
弹出窗口显示 Gateway 启动 How do you want to hacth your bot？，选择打开
```

- WebUI（Open the Web UI）

安装完成，显示一些配置信息（保存好这里的 token），同时浏览器会打开 WebUI。

### macOS / Linux 用户：

检查依赖：

```
Node.js 22+  是必须的，提前装好或者安装脚本自动安装。在终端输入  node -v  检查版
```

本。Git 不是必须，但在克隆插件或从源码安装时会用到。

安装 OpenClaw：

打开“终端”（Terminal），运行以下命令：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

通过向导完成初始配置（和 windows 类似）：

需要根据提示完成几项关键设置

```
同意条款：选择  Yes，并确认已知晓相关风险。
安装模式：新手推荐选择  QuickStart。
```

3. 选择模型：这是核心步骤，使用：a. 本地模型：如果已通过 Ollama 等部署了本地大模型，可以选择对应的本地服务。

- b. 云端模型：如 OpenAI、DeepSeek 等，后续需输入 API Key。

```
c. 暂时跳过：也可以选择  Skip for now，以后再配置模型。
选择渠道与技能：可以选择  Skip for now，以后再配置模型。
```

5. 配置完成后，终端会自动启动 Gateway 服务。

```
a. 验证安装：打开一个新的终端窗口，输入  openclaw --version  检查版本号。如果
```

- 能正常显示，说明安装成功。

```
b. 进入聊天界面：在终端中输入  openclaw tui，回车后就能开始与你的专属 AI 助理对
```

- 话了。

```
c. 检查服务状态：通过  openclaw status  可以查看服务的整体健康状态。
```

### 路径 C：云服务器部署

方式 A：云厂商购买服务器独立部署

由于各个厂商都做了一键部署和封装，可以在云厂商官网自行购买。对应的部署使用都有详细的教程，这里不详细赘述。

方式 B：路径 A 基础上增加反向代理

路径 A 基于 Docker 部署，可以部署在本地，也可以部署在云端。如果你需要在云服务器上部署（让团队成员远程访问），那么要在路径 A 的基础上增加反向代理：

```bash
# 在服务器上安装 Nginx 作为反向代理
sudo apt install nginx -y
# 配置 Nginx（/etc/nginx/sites-enabled/openclaw）
server {
   listen 443 ssl;
   server_name your-domain.com;
   ssl_certificate /path/to/cert.pem;
   ssl_certificate_key /path/to/key.pem;
   location / {
       proxy_pass http://127.0.0.1:3000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
   }
}
```

## 常见问题排查

OpenClaw 的安装和运行过程会涉及到多层架构（包括运行环境、守护进程、渠道插件等），因此遇到的报错类型可能比较多。首先遇到任何问题，可以先执行下面的诊断命令：

```
openclaw status          # 查看整体状态
openclaw gateway status  # 查看网关运行时状态
openclaw doctor          # 配置自检 + 自动修复常见错误
openclaw logs --follow   # 实时查看日志，最直接的问题追踪入口
```

### 安装阶段报错

Node.js 版本不兼容问题

OpenClaw 大量现代 JavaScript 特性，Node 20 及以下版本缺少支持，安装时会报语法错误或编译失败。OpenClaw 要求 Node.js 22 及以上版本。

```bash
# macOS (Homebrew)
brew install node@22 && brew link node@22 --force --overwrite[reference:5]
# Linux (Debian/Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get
# Windows (winget)
winget install OpenJS.NodeJS.LTS[reference:7]
```

### 网关启动阶段报错

安装成功后，发现跑不起来，很多问题出现在 Gateway 启动这一步，常见问题如下：

```
网关模式未设置为本地 (gateway.mode=local)
解决方案：运行  openclaw configure  进行交互式配置，或在
 ~/.openclaw/openclaw.json  中设置  "gateway": { "mode": "local" }
端口被占用 (EADDRINUSE)
常见原因：OpenClaw 默认的  18789  端口被其他进程占用
解决方案：可运行  openclaw doctor --repair  自动修复，或手动关闭占用进程或
```

- 更改端口

### API 与模型配置报错

```
API 限流 (API rate limit reached)
```

- 常见原因：配置的 Base URL 或模型提供商有误，或免费套餐额度用尽

```
解决方案：仔细核对配置文件中的  models  和  providers  设置
```

- 401 鉴权错误

- 常见原因：API Key 无效或配置有误（例如复制粘贴时前后多了空格或换行符导致 401鉴权失败）

- 解决方案:

- 重新生成 API Key 并确保配置文件中无空格或换行

```
确认 API Key 格式，例如 Anthropic（Claude）：以  sk-ant-api03-  开头，
OpenAI：以  sk-  开头
确认 baseUrl 格式，接口地址末尾必须带  /v1，否则请求直接失败
去主配置文件，确认相关细节，在 ~/.openclaw/openclaw.json，包含
```

- Gateway、模型、插件等全局设置

## 总结

本节我们完成了环境搭建。三条路径任选其一（Docker/ 本地 / 云服务器），成功安装并启动了

```
OpenClaw。核心配置文件 openclaw.yaml 只需 7 行有效内容即可运行。
```

这节课的思考题，就是完成 OpenClaw 的安装部署工作。如果你遇到了无法解决的问题，欢迎留言区与我交流！如果今天的课程让你有所收获，也欢迎转发给有需要的朋友，邀请他来一起学习，我们下节课再见！
