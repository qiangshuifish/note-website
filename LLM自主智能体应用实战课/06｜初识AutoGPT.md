# 06｜初识AutoGPT
你好，我是李锟。

前面几节课我们系统学习了 MetaGPT，对于开发 Autonomous Agent 应用已经有了一些认知。今天我们开始学习第二个开发框架 AutoGPT，也是此类开发框架的开创者。我将会分成四节课来带你系统学习 AutoGPT。

## AutoGPT官方文档导读

AutoGPT 最初名叫 EntreprenurGPT，由英国游戏开发者 Toran Bruce Richards 开发，于 2023年3月16日在 GitHub 上发布。

项目的源代码在： [https://github.com/Significant-Gravitas/AutoGPT](https://github.com/Significant-Gravitas/AutoGPT)

官方文档在： [https://docs.agpt.co/platform/getting-started/](https://docs.agpt.co/platform/getting-started/)

AutoGPT 发展得很快，新版本（称作 AutoGPT Platform）与老版本（称作 AutoGPT Classic） **完全不兼容**。国内一些爱好者翻译的中文版 AutoGPT 官方文档，都是老版本的文档，延迟有一年以上，已经过时了。同样的， **所有中文版** 的 AutoGPT 教程也都已经过时。阅读这些中文文档很容易被误导，因此我强烈建议你直接阅读 AutoGPT 新版本的英文文档，配备 DeepL 等强大的网页翻译插件，其实也非常容易。

在 AutoGPT 官方文档中，也给出了和我同样的建议。

![图片](images/841091/9754d60d3a072ba8ce842e21a9e402b7.png)

老版本的 AutoGPT 已经不再发展，其官方文档位于以下地址： [https://docs.agpt.co/classic/](https://docs.agpt.co/classic/)

本课程之后的所有 AutoGPT 相关内容都是关于 AutoGPT 新版本的，也就是 AutoGPT Platform。

尽管如此，目前 AutoGPT 新版本尚处于初期阶段，完成度不高，代码和文档都会发生变化。AutoGPT 新版本的一些文档，要么语焉不详，要么滞后于代码的发展，我们仍然有可能会被这些文档误导。这是快速发展中的很多开源项目都存在的问题，也不能过于苛责 AutoGPT 团队。不过我会持续跟进 AutoGPT 新版本的发展，将最新的成果及时加入到课程内容中，确保 AutoGPT 相关课程的内容都是与 AutoGPT 新版本的最新代码匹配并且是完全可用的。

因为 AutoGPT 的体系架构比 MetaGPT 复杂得多，与学习 MetaGPT 不同，我们不着急安装 AutoGPT 并运行第一个例子，首先读一下官方文档。与 [03 课](https://time.geekbang.org/column/article/840276) 中介绍 MetaGPT 时相同，对于如何阅读 AutoGPT Platform 的文档我先做一个导读。

建议你先读一下 Toran Bruce Richards 为全新设计开发的 AutoGPT Platform写的这篇文章： [The Future of AI Agents](https://agpt.co/blog/introducing-the-autogpt-platform)。这篇文章是未来 AutoGPT 发展的一个全面的愿景规划，也就是未来 AutoGPT 发展的路线图。另外还有一篇： [Everything You Need to Know About the AutoGPT Platform](https://autogpt.net/everything-you-need-to-know-about-the-autogpt-platform/)，内容与前一篇文章几乎完全一样。

在第一篇文章中，作者首先介绍了 AutoGPT Platform 的架构被划分成两部分：AutoGPT Server（又名 backend）和 AutoGPT Frontend，以及这样划分的原因和优势。作者写道：

> 通过分离 Server 和 Frontend 组件，我们创建了一个将强大的功能与用户友好操作相结合的平台。 这种架构使我们能够不断增强和扩展 AutoGPT 的功能，同时保持流畅、直观的用户体验，无论您选择以何种方式与 AI 智能体互动。

从上述内容，我们可以理解到 AutoGPT 的设计与 MetaGPT 大不相同。 **MetaGPT 被设计首先作为一个库来使用，而 AutoGPT 则被设计首先作为一个在线服务来使用。** 因此 AutoGPT 的架构比 MetaGPT 要复杂很多，按照 B/S 架构划分成两部分，这两部分可以运行在不同的机器上，通过 RESTful API 来交互。

在这篇文章中，作者将 AutoGPT 中的组件划分为 Agent（智能体）、Workflow（工作流）、Block（构建块）三个层次。作者写道：

> 智能体本质上是一种自动化的工作流，由您设计来执行特定的任务或流程。 重要的是，虽然我们的平台擅长人工智能驱动的自动化，但您的智能体并不局限于人工智能任务。 智能体可以是任何自动化流程，包括：
>
> - 数据处理和分析
> - 任务调度和管理
> - 通信和通知系统
> - 不同软件工具之间的集成
> - 人工智能驱动的决策制定和内容生成
> - … 很多其他的任务
>
> 这种灵活性使您可以在同一个强大的平台上实现各种业务流程的自动化，无论是否包含人工智能组件。

> AutoGPT 平台中的构建块代表行动（Action）。 这些是您用来构建工作流的构件。 构建块可包括：
>
> - 连接外部服务（如电子邮件提供商、客户关系管理或社交媒体平台）
> - 数据处理工具
> - 用于各种任务的 AI 模型
> - 自定义脚本或函数
> - 条件逻辑和决策组件
>
> 通过组合这些构建块，您可以创建无缝集成多种工具和服务的智能体，将原本需要人工干预的复杂流程自动化。

从上述内容，我们可以理解 Agent、Workflow、Block 的定义和它们之间的关系。三者的关系可以简单理解为：Agent 基于（包含）Workflow，Workflow 基于（包含）Block。AutoGPT 中的一个 Agent 相当于 MetaGPT 中的一个 Role，一个 Block 相当于 MetaGPT 中的一个 Action，而一个 Workflow 则由多个 Block 组合而成。

作者还写道：

> AutoGPT 平台预先集成了大量先进的 LLM，使您可以在自动化工作流中利用人工智能的强大功能。 这些 LLM 可以作为构建块轻松集成到您的代理中，实现自然语言处理、内容生成、情感分析等任务。 以下是我们平台上目前可用的 LLM 集成列表：
>
> - OpenAI
> - Anthropic
> - Groq
> - Llama

在 AutoGPT 平台支持的 LLM 列表里面，我们最关心的其实是最后的 Llama——目前广泛使用的开源 LLM，由 Meta 发布，因为我们的课程优先选择的是开源 LLM。从 AutoGPT 新版本的官方文档中可以了解到，AutoGPT 支持通过 ollama 来使用 llama3。既然 AutoGPT 已经能够通过 ollama 使用 llama3，那么通过 ollama 使用我们喜爱的 qwen2.5 应该也不会很困难。

接下来我们浏览一下 AutoGPT Platform 的 [官方文档](https://docs.agpt.co/platform/getting-started/)。官方文档包括这些部分：

- Getting Started：入门文档

- Advanced Setup：高级设置

- Build your own Blocks：如何开发自定义的构建块

- Using Ollama：如何配置并使用 Ollama

- Using D-ID：如何生成视频内容

- Blocks：经过 AutoGPT 官方认证的可用构建块列表


在目前阶段看来，这些文档的质量都不高。你把 Getting Started 和 Advanced Setup 两个文档大致浏览一下即可。其余文档没必要花很多时间阅读，因为本课程的后续内容更为详尽。

## 安装部署 AutoGPT

AutoGPT（Server + Frontend）的安装使用可以说相当繁琐，占据了这一课的大部分内容。

### 安装 AutoGPT 的依赖项

AutoGPT（Server + Frontend）依赖 Python、Node.js、Docker 和 Git。除了 Docker 外，其他依赖项在 03 课我们已经安装过，这里不再赘述。只需要安装一下 Docker。

```plain
sudo apt update
# 安装docker-compose时会安装所有Docekr相关的package
sudo apt install docker-compose

```

开发 AutoGPT 应用可以使用 Python 3.12，当然也可以继续使用之前学习 MetaGPT 时的用的 3.10 或 3.11。以下内容我使用的是 Python 3.12。Python 3.13 能否使用，你感兴趣的话可自行尝试。

### 拉取 AutoGPT 源代码

与 MetaGPT 不同，AutoGPT 并未发布官方的 Python 库。因此无法以库的形式安装使用，只能通过源代码来安装使用。

从 GitHub 拉取 AutoGPT 的源代码，执行以下命令：

```plain
cd ~/work
git clone https://github.com/Significant-Gravitas/AutoGPT.git
cd AutoGPT
git submodule update --init --recursive
cd autogpt_platform

```

运行 AutoGPT Server 有两种方法：

- 通过 poetry 运行

- 通过 Docker 运行


上面介绍过的那个官方 [Getting Started](https://docs.agpt.co/platform/getting-started/) 文档中只介绍了如何通过 Docker 来运行。如果选择通过 Docker 运行，对于不熟悉 Docker 的同学来说，会增加不少学习成本。如果你不愿意自己费事制作 Docker 镜像，而是使用现成的 Docker 镜像，就无法利用最新的功能。为了简化教学，我选择的是通过 poetry 运行。不过前面安装的 Docker 仍然会用到，你很快就会看到。

### 安装 AutoGPT Server 的依赖项

然后我们设法把 Server（即 backend）运行起来。Server 的功能很强大，因此依赖项有很多。我们没有选择通过 Docker 运行 Server，所以需要自行安装这些依赖项。主要的依赖项是 Supabase（包含PostgreSQL 数据库）和 Redis Server，我们需要分别安装。

我们先安装 [Supabase](https://zhuanlan.zhihu.com/p/652080031)。Supabase 官方推荐使用 brew 来安装 Superbase 命令行工具，因此需要先安装 brew。执行以下脚本：

```plain
sudo useradd brew # 需要为brew创建一个用户
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv）"' &gt;&gt; ~/.profile

```

还需要编辑 /etc/sudoers 文件，将 brew 命令所在目录 “/home/linuxbrew/.linuxbrew/bin” 加入到 secure\_path 中，这样 sudo 也可以使用通过 brew 安装的 Supabase CLI。

```plain
sudo vi /etc/sudoers
# 在secure_path中加入brew命令所在目录
Defaults   secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin:/home/linuxbrew/.linuxbrew/bin"

```

然后退出当前的登录，重新登录，登录后继续执行以下脚本，安装并启动 Supabase：

```plain
brew install supabase/tap/supabase
cd ~/work/AutoGPT/autogpt_platform/backend
supabase init
cp ../supabase/supabase/seed.sql supabase/
sudo supabase start

```

命令行工具 supabase 通过 Docker 来运行 Supabase。第一次启动 Supabase 时，因为要下载很多 Docker 镜像，所以需要等待较长时间。又是一次可以合法偷懒的时间，去喝杯咖啡吧。

Supabase 启动成功之后，会显示一些重要的信息。

```plain
         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
  S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
          DB URL: postgresql://postgres:postgres&#64;127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
   S3 Access Key: 625729a08b95bf1b7ff351a663f3a23c
   S3 Secret Key: 850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907
       S3 Region: local

```

这些信息很重要，需要备份下来，后面很快会用到。不过即使没有备份也没关系，下次重新启动 Supabase 后还会显示这些信息。

停止 Supabase 使用以下命令：

```plain
sudo supabase stop

```

然后我们安装 Redis Server。

```plain
sudo apt install redis-server
sudo systemctl start redis

```

修改 Redis Server 的配置文件，为 Redis Server 设置密码：

```plain
sudo vi /etc/redis/redis.conf
# 去掉requirepass前的注释，并设置密码
requirepass password

```

修改完配置文件后，需要重新启动 Redis Server：

```plain
sudo systemctl restart redis

```

### 运行 AutoGPT Server

为 Server（即 backend）创建并编辑配置文件 .env。

```plain
cd ~/work/AutoGPT/autogpt_platform/backend
cp .env.example .env
vi .env

```

1. 将 DB\_PORT 参数值中（运行 PostgreSQL 数据库）的端口号 5432 改为 54322。这个端口号从之前启动 Supabase 后备份信息中的 DB URL（“postgresql://postgres:postgres@127.0.0.1:54322/postgres”）中可以获得。

2. 将 DB\_PASS 参数值修改为PostgreSQL 数据库的密码 postgres。这个密码从之前启动 Supabase 后备份信息中的 DB URL（“postgresql://postgres:postgres@127.0.0.1:54322/postgres”）中可以获得。

3. 将 SUPABASE\_URL 参数值中（运行 Supabase）的端口号 8000 改为 54321。

4. 将 SUPABASE\_SERVICE\_ROLE\_KEY 参数值修改为启动 Supabase 后备份信息中的 service\_role key。

5. 将 SUPABASE\_JWT\_SECRET 参数值修改为启动 Supabase 后备份信息中的 JWT secret。

6. 将 REDIS\_PASSWORD 参数值修改为之前设置的 Redis Server 的密码。


接下来创建 poetry 虚拟环境，使用 prisma 工具生成数据库的 stub 代码（Prisma Client for PostgreSQL）并创建数据库 schema：

```plain
cd ~/work/AutoGPT/autogpt_platform/backend
PYTHON_KEYRING_BACKEND=keyring.backends.null.Keyring poetry install
poetry run prisma generate --schema schema.prisma
poetry run prisma migrate dev --schema schema.prisma

```

在上述过程中，如果发生了难以解决的错误，可以使用以下命令清除掉 prisma 生成的所有代码，然后重新生成。

```plain
poetry run python -m prisma_cleanup

```

prisma 的具体用法，请参考其官方文档：

[https://prisma-client-py.readthedocs.io/en/stable/](https://prisma-client-py.readthedocs.io/en/stable/)

最后我们终于可以进入正题，使用以下命令运行 Server：

```plain
poetry run app

```

如果没有报错（Error），则 Server 已成功运行。

### 运行 AutoGPT Frontend

成功运行 Server 之后，就可以运行 Frontend 了。如前所述，Frontend 可以与 Server 分别运行在不同的机器上，这其实也是 AutoGPT 官方推荐的做法。Frontend 并不需要直接调用开源 LLM，因此对机器配置要求不高。只要机器能够流畅运行 Node.js，可以使用任意笔记本电脑运行 Frontend。与 Frontend 相关的内容在我的 macOS 笔记本电脑上执行（也可以在 Windows 笔记本上执行，只要提前安装了 Node.js 和 Git），以下称作“客户端机器”。

与之前在 Linux 主机上的步骤类似，首先需要从 github 拉取 AutoGPT 的源代码，在客户端机器上执行以下命令：

```plain
cd ~/work
git clone https://github.com/Significant-Gravitas/AutoGPT.git
cd AutoGPT
git submodule update --init --recursive

```

为 Frontend 创建并编辑配置文件 .env.local。

```plain
cd ~/work/AutoGPT/autogpt_platform/frontend
cp .env.example .env.local
vi .env.local

```

1. 将所有的 localhost 全部改为 Linux 主机的 IP 地址。

2. 将 NEXT\_PUBLIC\_SUPABASE\_URL 参数值中（运行 Supabase）的端口号 8000 改为 54321。

3. 将 NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY 参数值修改为启动 Supabase 后备份信息中的 anon key。


编辑 webpack.config.js：

```plain
cd ~/work/AutoGPT/autogpt_platform/frontend
vi webpack.config.js

```

将 localhost 改为 Linux 主机的 IP 地址。将端口号 8000 改为 8006，即运行 Server 的端口号。

然后进入正题，使用以下命令运行 Frontend：

```plain
npm install
npm run dev

```

退出 Frontend 可以使用 Ctrl-C。如果没有修改过 Frontend 依赖的 Node.js 模块，下次重新启动 Frontend 时不需要执行 npm install。

在客户端机器的浏览器中，首先访问地址： [http://localhost:3000/signup](http://localhost:3000/signup)。这个地址是一个注册界面，可以使用任意邮箱地址注册一个账号。因为 Server 默认情况下是需要做用户认证的。账号注册成功之后，然后用注册的账号登录。如果没有退出登录，下一次会使用相同的用户，无需重新登录。

如果你想要在相同的 Linux 主机上运行 Frontend，上述步骤中，frontend 子目录中的 .env 配置文件和 webpack.config.js 不需要将 localhost 修改为 Linux 主机的 IP 地址。浏览器首先访问的地址中的 localhost 需要修改为 Linux 主机的 IP 地址（假设浏览器是运行在 Linux 主机之外的机器上）。

## 总结时刻

在这一课中，我带你阅读了 AutoGPT 的官方文档，并且完成了对 AutoGPT（Server + Frontend）的安装部署。因为 AutoGPT 的新版本（AutoGPT Platform）被设计为一套功能强大的在线服务，其依赖项非常多，因此其安装使用也比 MetaGPT 复杂得多。我详细介绍了不通过 Docker 来安装部署 AutoGPT 的方法。这些步骤看似很繁琐，但是能够为之后的教学带来便利。

AutoGPT 成功安装之后，在我们开发 AutoGPT 应用的道路上，还有一些艰难险阻需要克服。在下一课我们将设法解决这些困难，为顺利开发 AutoGPT 应用扫清障碍。

## 思考题

AutoGPT 新版本的 B/S 架构设计有何优缺点？

期待你的分享。如果今天的内容对你有所帮助，也期待你转发给你的同事或者朋友，大家一起学习，共同进步。我们下节课再见！