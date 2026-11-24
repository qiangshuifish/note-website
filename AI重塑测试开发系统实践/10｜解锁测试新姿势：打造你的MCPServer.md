# 10 | 解锁测试新姿势：打造你的MCPServer

你好，我是陈磊。

今天，我们继续上一节课关于 MCP Server 的话题。上节课我们一起使用 Playwright MCPServer 和 Claude 大模型，完成了第一次大模型驱动的 UI 自动化测试。你是否已经迫不及待地亲手尝试了一下，被这种基于自然语言意图描述的自动化测试的奇妙震撼了？没错，MCPServer 的生态已远远超出你的想象，几乎你能想到的 MCP Server 需求，都已有开源解决方案。

那么，这是否意味着我们就不需要学习如何开发 MCP Server 了呢？答案是否定的。因为在你工作的组织内部，还存在各种各样的私有系统和资源，特别是软件测试过程中的测试管理系统、性能测试库、接口测试库、UI 自动化测试库等，这些都需要你自己封装成 MCP Server来解决大模型的“手”的问题。今天我就带你一起打造几个服务测试过程的 MCP Server，让你体会一下服务于测试过程的 MCP Server 的“解题过程”。

## 打造大模型专属的测试报告读取服务

在测试自动化领域，我最早借 MCP 协议攻克的实战难题，就是打造一个高效的自动化测试报告读取服务，设计一个 MCP Server 用于为大模型提取 Allure 报告中的关键信息。选择测试报告作为首要的突破点，并非心血来潮的突发奇想，而是源于日常工作中积累的深刻痛点，它直接针对团队在测试流程中反复遇到的瓶颈，把我们从繁琐的手动分析中解放出来。

我所在的团队负责的项目有一个规模庞大的接口测试回归库，每天需运行逾 10 万条接口测试脚本，进行全面的回归测试。这些脚本覆盖了核心业务逻辑的各种场景，确保系统在每次迭代后都能保持稳定性和可靠性。然而，测试执行的自动化程度虽然已经比较高了，但后续的报告分析环节却成了“卡脖子”的软肋。

Allure 报告作为一种流行的测试报告生成框架，能以直观的可视化方式呈现测试结果，包括用例执行状态、失败截图、日志追踪和性能指标等。但在实际操作中，团队成员往往需要手动翻阅大量的报告，逐一分析失败用例、归纳缺陷模式，这不仅仅是时间消耗的问题，更会引入人为错误。更严重的是，在快节奏的 DevOps 环境中，这种低效分析会延缓反馈循环，导致缺陷修复周期拉长，影响整体交付效率。正是这些现实痛点，促使我将目光转向 MCPServer，寄希望于大模型，加快这一分析流程，实现自动化的解读和问题定位。

## Allure 报告的数据存储结构

Allure 报告的“data”目录就像一个数据宝库，藏着所有测试结果的秘密。它包含 CSV 和 JSON两种文件，同名文件内容一致，只是展示方式不同（CSV 适合表格，JSON 更灵活），我们重点聊 JSON（不同 Allure 版本间差异微小）。

- categories.json 分类筛选，让一些混乱的结果可以井井有条地展示出来。在这个 json 文件中定义测试结果分类和筛选的配置文件，按状态或消息自动分组测试结果。

- suites.json 构建测试的层级树，从包、模块到类 / 方法，一目了然。像家族树，帮你快速导航海量用例。

- behaviors.json 用 Epic、Feature、Story 等“叙事层”分组用例，提升可读性。如果没分组，默认显示方法名。

- package.json 按包 / 模块组织用例，镜像你的代码结构。适合大项目，定位 Bug 就如回家一样的顺手。

- test-cases 目录下是单个用例的 JSON 文件，每份就是一个用例的记录，详尽记录执行历程、步骤等内容。

## mcp-allure 服务实现

为什么不能将 Allure 的 html 格式报告直接给大模型呢？一份 HTML 的报告包含了很多和实际报告要展示的内容不相关的内容，例如一些 html 的标签、css 的样式等等，对于大模型来说，这些内容都是在占用上下文，但是却没有任何需要从中学习的语义信息，平白浪费了很多Tokens。

因此我们需要一个面对大模型友好的自动化测试报告服务，mcp-allure 就是在这样的契机之下出现的，它像个“翻译官”，把 Allure 报告快速转成大模型喜欢的 JSON 格式，让大模型轻松分析出测试结果，帮助快速定位 Bug，当然也有可能是测试脚本需要修改。

```python
import json  # 用于读写 JSON 文件，像“翻译官”把文件内容转成 Python 对象
import os  # 处理文件路径和检查存在，像“导航仪”找报告文件夹
from typing import Dict, List, Any  # 类型提示：Dict 是字典，List 是列表，Any 是任意类型
class AllureSuiteParser:
   def __init__(self, allure_report_dir: str, testcase_status=None):
       """
       初始化解析器：设置报告目录路径，并准备关键文件路径。
       :param allure_report_dir: Allure 报告根目录（e.g., './allure-report'）
       :param testcase_status: 可选过滤状态（e.g., 'failed'），只解析匹配的用例
       """
       self.report_dir = allure_report_dir  # 报告根目录
       self.data_dir = os.path.join(allure_report_dir, 'data')  # data 子目录，存所
       self.suites_file = os.path.join(self.data_dir, 'suites.json')  # suites.j
       self.test_cases_dir = os.path.join(self.data_dir, 'test-cases')  # test-c
       self.testcase_status = testcase_status  # 状态过滤器（后续用）
       # 检查 suites.json 是否存在，像“开门验货”——不存在就报错，避免空跑
       if not os.path.exists(self.suites_file):
           raise FileNotFoundError(f"Suites file not found: {self.suites_file}")
   def parse(self) -> Dict[str, Any]:
       """
       主解析入口：读 suites.json，递归解析套件和用例，返回结构化结果。
       返回：Dict，如 {"test-suites": [套件列表]}，像“打包好的外卖”
       """
       # 打开并加载 suites.json
       with open(self.suites_file, 'r', encoding='utf-8') as f:  # utf-8 防中文乱码
           suites_data = json.load(f)  # 转成 Python 字典
       # 核心：解析 children（子节点），建结果树
       result = {
           "test-suites": self._parse_suites(suites_data.get('children', []))  #
       }
       return result
   def _parse_suites(self, suites: List) -> List[Dict[str, Any]]:
       """
       递归解析套件：从 suites.json 的 children 层级中提取信息。
       作用：建套件树（模块 > 子模块 > 用例），像“整理家族树”。
       :param suites: 当前层级的套件列表（Dict 数组）
       :return: 解析后的套件列表，每个是 Dict（名、状态、用例子列表）
       """
       parsed_suites = []  # 结果容器
       for suite in suites:  # 遍历每个套件节点
           # 基础 info：像“填表格”，默认值防空
           suite_info = {
               "name": suite.get('name', ''),  # 套件名（e.g., "登录模块"）
               # "title": suite.get('name', ''),  # 注释掉的：如果有 title 用它，否则
               "description": "",  # suites.json 无描述，空着
               "status": "passed",  # 默认 passed，后续用例更新（实际应从子节点推导）
               "start": "",  # 开始时间，从用例汇总（最早的）
               "stop": "",  # 结束时间，从用例汇总（最晚的）
               "test-cases": []  # 子用例列表，核心内容
           }
           # 处理 children：像“钻洞穴”，递归子节点
           if 'children' in suite:
               for child in suite['children']:  # 每个孩子可能是子套件或用例
                   if 'children' in child:  # 有 children？是子套件，递归
                       sub_suites = self._parse_suites([child])  # 单节点传列表
                       if sub_suites:  # 非空才加
                           parsed_suites.extend(sub_suites)  # 扩展到当前层（扁平化
                   else:  # 无 children？是叶子：测试用例
                       test_case = self._parse_test_case(child)  # 解析详情
                       if test_case:  # 成功解析才加
                           suite_info['test-cases'].append(test_case)  # 加到当前套
                           # 更新套件时间戳：汇总子用例，像“找最早/最晚的航班”
                           if test_case['start'] and (not suite_info['start'] or
                               suite_info['start'] = test_case['start']
                           if test_case['stop'] and (not suite_info['stop'] or i
                               suite_info['stop'] = test_case['stop']
           # 只加有子用例的套件，避免空壳
           if suite_info['test-cases']:
               parsed_suites.append(suite_info)
       return parsed_suites
   def _parse_test_case(self, case: Dict) -> Dict[str, Any]:
       """
       解析单个测试用例：从 suites.json 的叶子节点 uid 找对应 test-cases/xxx.json，提取
       作用：像“开档案柜”，拉出用例的“全家福”（名、状态、步骤等）。
       :param case: suites.json 中的叶子 Dict（含 uid）
       :return: 用例 Dict，或 None（文件不存在/过滤不符）
       """
       case_uid = case.get('uid', '')  # uid 是用例唯一 ID，像“身份证”
       if not case_uid:
           return None  # 无 ID，跳过
       case_file = os.path.join(self.test_cases_dir, f"{case_uid}.json")  # 拼路径
       if not os.path.exists(case_file):
           return None  # 文件丢了，跳过（Allure 常见，防崩溃）
       # 加载详情 JSON
       with open(case_file, 'r', encoding='utf-8') as f:
           case_data = json.load(f)
       # TODO: 这里有未实现的过滤逻辑——检查 self.testcase_status 是否匹配 case_data['s
       # if self.testcase_status and case_data.get('status') != self.testcase_st
       #     return None  # 示例：只解析 failed 用例
       # 建用例 info：提取精华
       test_case = {
           "name": case_data.get('fullName', ''),  # 全路径名（e.g., "模块.类.方法"）
           "title": case_data.get('title', ''),  # 标题（用户友好名）
           "description": case_data.get('description', ''),  # 描述文本
           "severity": self._get_severity(case_data.get('labels', [])),  # 严重度
           "status": case_data.get('status', ''),  # 执行结果（passed/failed 等）
           "start": str(case_data.get('time', {}).get('start', '')),  # 开始时间戳
           "stop": str(case_data.get('time', {}).get('stop', '')),  # 结束时间戳
           "labels": case_data.get('labels', []),  # 所有标签（e.g., severity, sui
           "parameters": case_data.get('parameters', []),  # 参数列表（输入数据）
           "steps": self._parse_steps(case_data.get('testStage', {}).get('steps'
       }
       return test_case
   def _get_severity(self, labels: List) -> str:
       """
       从标签中挖严重度：像“找徽章”，优先 severity 标签。
       :param labels: 标签列表（Dict 数组）
       :return: 严重度字符串（e.g., 'critical'），默认 'normal'
       """
       for label in labels:
           if label.get('name') == 'severity':  # 匹配 name=severity
               return label.get('value', 'normal')  # 取 value
       return 'normal'  # 无则默认
   def _parse_steps(self, steps: List) -> List[Dict[str, Any]]:
       """
       递归解析步骤：用例的“子任务”树，像“拆俄罗斯套娃”。
       :param steps: 当前层步骤列表
       :return: 解析后的步骤列表（含子步骤）
       """
       parsed_steps = []
       for step in steps:
           step_info = {
               "name": step.get('name', ''),  # 步骤名
               "title": step.get('title', ''),  # 标题
               "status": step.get('status', ''),  # 状态
               "start": str(step.get('time', {}).get('start', '')),  # 开始时间
               "stop": str(step.get('time', {}).get('stop', '')),  # 结束时间
               "attachments": step.get('attachments', []),  # 附件（日志/截图，简化保
               "steps": self._parse_steps(step.get('steps', []))  # 递归子步骤
           }
           parsed_steps.append(step_info)
       return parsed_steps
def parse_allure_suite(report_dir: str) -> Dict[str, Any]:
   """
   入口函数：一键解析，像“点外卖按钮”。
   :param report_dir: 报告目录
   :return: 解析结果 Dict
   """
   parser = AllureSuiteParser(report_dir)  # 建解析器
return parser.parse()
# 跑解析
```

上面这段代码是这次转换中最重要的部分，重点就是把“杂乱的测试日志”转换成“整洁的数据宝藏”，这段代码的核心是 AllureSuiteParser 类，它扫描 suites.json（测试套件目录树）和test-cases/*.json（单个用例详情），提取精华（如用例名、状态、步骤、附件），输出一个干净、层级化的 JSON。这样 AI 就能轻松地“吃掉”它，帮你总结 Bug 模式、生成修复建议。

![](images/10/1.png)

代码的“心脏跳动”就是这个闭环，如上代码从 parse 总入口起步，像发号施令的队长，喊“出发！”它先读测试报告的大地图 suites.json，然后扔给 _parse_suites 进行递归套件解析，当“领队”，_parse_suites 像钻山洞的探险家，沿着 children 分支一路往下挖，挖到叶子，就叫_parse_test_case 解析用例详情。

_parse_test_case 呢？它用 uid 当“钥匙”，从 test-cases 仓库里掏出完整档案，顺手再喊_parse_steps 递归步骤拆解帮忙“剥洋葱”——层层剥开步骤树，抓名、状态、附件等宝藏。

```python
import json
from mcp.server import FastMCP  # MCP 框架核心：快速建 AI 工具服务器，简化 boilerplate
from allure_html import AllureSuiteParser  # 自定义解析器：从 Allure 报告挖 JSON 金矿
MCP_SERVER_NAME = "mcp-allure-server"  # 服务器昵称：AI 客户端用它“呼叫”这个服务，像店名
mcp = FastMCP(MCP_SERVER_NAME)  # 建服务器实例：像“挂招牌开张”，FastMCP 是高效版（同步/异
# mcp.start()  # 注释掉的：手动启动（可选），但 run() 会自动处理
@mcp.tool()  # 装饰器魔法：注册成 MCP 工具，AI 可通过协议调用（像加菜单项）
async def get_allure_report(results_dir: str) -> str:  # 异步工具函数：输入报告路径（s
   """
   读 Allure 报告目录，返回结构化 JSON 数据（供 AI 分析）。
   :param results_dir: Allure 报告路径（e.g., './allure-results' 或 './allure-repo
   :return: JSON str，如 {"test-suites": [...]}，或错误消息
   """
   try:
       parser = AllureSuiteParser(results_dir)  # 建解析器实例：扔路径给它“进厨房”
       return json.dumps(parser.parse(), indent=2, ensure_ascii=False) # 跑解析：从
   except Exception as e:  # 兜底：捕获所有错（如路径不存在、JSON 坏），返错误 str 给 AI
       return str(e)  # 简单转字符串，避免崩溃
if __name__ == '__main__':  # 保护入口：只在直接 python script.py 时跑，像“开馆营业”
   mcp.run(transport='stdio')  # 启动服务器：用 stdio 模式（命令行输入/输出），低开销适合
   # 备选：mcp.run(host='localhost', port=8000, transport='http')  # Web 模式，浏览
```

通过如上这部分简单的代码，我们将 AllureSuiteParser 包装成 AI 工具，让大模型喂个 Allure报告路径，它就吐出结构化 JSON 报告了。使用起来就非常简单了，这是一个 STDIO 模式的MCP Server，你只要将对应的代码放到本地，然后按照如下的方式配置把你的 MCP Host，就可以了。

```json
{
 "mcpServers": {
   "mcp-allure-server": {
     "command": "uv",
     "args": [
       "run",
       "--with",
       "mcp[cli]",
       "mcp",
       "run",
       "/mcp-allure/mcp-allure-server.py"
     ]
   }
 }
}
```

## 打造覆盖率读取工具

尝到第一个 MCP Server 的甜头后，我整个人都像打了鸡血似的，迫不及待地想找出所有藏在日常流程里的小雷区。团队的测试链条、开发节奏、跨部门协作，本来以为都磨合得七七八八了，谁知一扒拉，就冒出一堆“隐形杀手”：有的痛点是工具卡顿，有的则是沟通困难。但最戳心的，还得是接口测试那道“断崖”。

你知道的，接口测试跑下来，总有那么几段增量代码没被覆盖到。当测试工程师发现这个问题后，会先去找开发工程师一起讨论未覆盖代码的原因，这时往往需要测试工程师和开发工程师都有时间才能完成这个工作，有时候代码的改动还不是一个人。结果呢？从“即时聊天”秒变“会议预约剧场”——发邮件、拉群、调日历，折腾半天也定不下来。

等大家终于聚首，问题早凉了半截，整个接口测试的流水线就这么卡在半道上，DevOps 那股子“风驰电掣”的劲头，瞬间被堵成早高峰的北京三环了。哎，这不光是时间黑洞，更是心力耗损——谁不想当场拍板，立马补漏，继续往前冲呢？有了大模型这个问题终于有了更好的解决办法。

代码覆盖率报告这东西，本来就是代码覆盖的“体检单”，里面密密麻麻标注着哪些增量代码被测试覆盖过，哪些还没有。这不就和前面解决 Allure 报告的思路一样吗？我就着手打造了一个适合大模型的代码覆盖率报告，让大模型眯眼一扫，就能吐出“漏网之鱼”的清单，告诉我哪行哪列没覆盖的原因，给出补充修复建议——全自动化，零预约，测试小哥点个头，开发大佬收个通知，就能当场拍板。

哎，这不光省了小会，还把 DevOps 的油门踩到底了。

我当前使用的精准测试能力是基于开源项目 JaCoCo 二次开发的，JaCoCo 生成报告的覆盖率报告的数据存储有多种格式，我选择了 XML 格式进行读取，这是因为它结构严谨，受 DTD（Document Type Definition）管辖容易解析。那么我为什么没有选择直接将 XML 通过 MCPServer 返回呢？

这其实考虑到 XML 太“啰嗦”，一堆标签堆积，报告一长，token 瞬间爆表。大模型有上下文窗口限制，塞满上下文，大模型就会有遗忘，容易出现幻觉。

```python
from mcp.server import FastMCP  # MCP 框架核心：快速建 AI 工具服务器，像“前台 POS 系统”
from jacoco_reporter import JaCoCoReport  # 自定义解析器：JaCoCo XML “X 光机”，专挖覆盖
import json  # JSON 处理：打包输出，像“打印诊断报告”
import asyncio  # 异步支持：防多客堵塞，像“多诊室轮班”
import os  # 系统操作：读环境变量，像“查患者档案”
MCP_SERVER_NAME = "mcp-jacoco-reporter-server"  # 服务器昵称：AI 客户端用它“预约”服务，
mcp = FastMCP(MCP_SERVER_NAME)  # 建服务器实例：挂招牌开张，FastMCP 高效（同步/异步混）
# 环境变量预设：COVERED_TYPES 控过滤类型，默认 "no"（无过滤），split 成列表
# e.g., 设 "nocovered,partiallycovered" 只看漏/半漏行
if "COVERED_TYPES" not in os.environ:
   os.environ["COVERED_TYPES"] = "no"  # 默认全抓，"no" 像“全科检查”
COVERED_TYPES = os.environ["COVERED_TYPES"].split(",")  # 转列表：e.g., ['nocovere
@mcp.tool()  # 装饰器：注册成 MCP 工具，AI 可协议调用，像“挂号菜单”
async def jacoco_reporter_server(jacoco_xmlreport_path: str, covered_types=COVERE
   """
   读 JaCoCo XML 报告，返回指定覆盖类型的 JSON 数据。
   :param jacoco_xmlreport_path: JaCoCo XML 报告路径（e.g., './jacoco.xml'）
   :param covered_types: 覆盖类型列表 ['nocovered'（未覆盖，红灯）, 'partiallycovered
   :return: JSON 数据，如 {"packages": [{"name": "util", "missed_lines": [13]}]}
   """
   jac = JaCoCoReport(jacoco_xmlreport_path, covered_types)  # 建解析器：扔路径 + 类
   data = jac.jacoco_to_json()  # 跑解析：挖 XML，转结构化 JSON（过滤类型，只留红黄绿细节
   return data  # 返回 dict（MCP 工具宜 str：实际加 return json.dumps(data, indent=
# 启动块：直接跑脚本时“开诊所”
if __name__ == '__main__':
   mcp.run(transport='stdio')  # 跑服务器：stdio 模式（命令行管道），低开销；备选 http 变
```

这个 MCP Server 是如何被大模型调用呢？

大模型在分析完用户的意图后，会调用 jacoco_reporter_server 传入 jacoco.xml 的地址，然后jacoco_reporter_server 开始解析 XML，聚合 counter，过滤 line mi/ci/mb/cb 后返回给大模型，这就完成了一个更适合大模型结果的反馈。同时设置了一些覆盖类型的参数，这样可以让MCP Server 返回你更想让大模型了解的信息，进一步压缩返回消息的大小。可以看到这个MCP Server 同样是 STDIO 的，因此将代码保存在本地，就可以通过如下配置让大模型使用了。

```json
{
 "mcpServers": {
    "mcp-jacoco-reporter-server": {
     "command": "uv",
     "args": [
       "run",
       "--with",
       "mcp[cli]",
       "mcp",
       "run",
       "/Users/crisschan/workspace/pyspace/mcp-jacoco-reporter/mcp-jacoco-report
     ],
     "env": {
       "COVERED_TYPES": "nocovered, partiallycovered, fullcovered"
     },
     "alwaysAllow": [
       "jacoco_reporter_server"
     ]
   }
 }
}
```

## 结语

好了，今天就讲到这里，今天我们延续了 MCP Server 的内容，MCP Server 为大模型提供延伸的生态趋势已经成熟，但针对组织内部私有系统，如测试报告、覆盖率库，仍需自定义开发以赋能大模型的“执行臂”。

我今天给你讲了两个例子，你可以试试例子中展示的方法以及最终的 MCP Server 的结果。此外我还提供了核心代码和配置方法，供你参考。两者均采用 STDIO 模式，本地集成到 MCPHost，彰显 MCP Server 在测试自动化中的“解题”魅力：从繁琐手动到 AI 驱动闭环，显著提升效率与准确性。

## 思考题

这节课的每一个例子你都要动手试一试，配置一下就能感受到 MCP 和大模型的魔力。希望你能通过我抛的砖，走上 MCP Server 封装这条路，也开始思考哪些地方变成 MCP 会发挥更大的能力，如果让你封装你的第一个 MCP Server，首先蹦出来的是哪个呢？期待你把你的想法分享在评论区，我们一起交流讨论，如果你觉得有所收获，也欢迎你分享给需要的朋友，我们下节课再见！
