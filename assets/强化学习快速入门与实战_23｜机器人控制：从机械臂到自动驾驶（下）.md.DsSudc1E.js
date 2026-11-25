import{_ as i,H as a,f as n,i as l}from"./chunks/framework.BH2BK_3i.js";const E=JSON.parse('{"title":"23 | 机器人控制：从机械臂到自动驾驶（下）","description":"","frontmatter":{},"headers":[{"level":2,"title":"一、强化学习在自动驾驶中的应用与发展","slug":"一、强化学习在自动驾驶中的应用与发展","link":"#一、强化学习在自动驾驶中的应用与发展","children":[]},{"level":2,"title":"1.1 自动驾驶智能水平的评判与现状","slug":"_1-1-自动驾驶智能水平的评判与现状","link":"#_1-1-自动驾驶智能水平的评判与现状","children":[]},{"level":2,"title":"1.2 强化学习应用于自动驾驶的现实挑战与技术框架","slug":"_1-2-强化学习应用于自动驾驶的现实挑战与技术框架","link":"#_1-2-强化学习应用于自动驾驶的现实挑战与技术框架","children":[]},{"level":2,"title":"1.3 自动驾驶决控系统的技术变革","slug":"_1-3-自动驾驶决控系统的技术变革","link":"#_1-3-自动驾驶决控系统的技术变革","children":[{"level":3,"title":"特斯拉：数据驱动的“影子模式”与端到端之路","slug":"特斯拉-数据驱动的-影子模式-与端到端之路","link":"#特斯拉-数据驱动的-影子模式-与端到端之路","children":[]},{"level":3,"title":"Waymo：仿真优先的模拟驱动学习","slug":"waymo-仿真优先的模拟驱动学习","link":"#waymo-仿真优先的模拟驱动学习","children":[]},{"level":3,"title":"国内玩家：混合实践与务实路线","slug":"国内玩家-混合实践与务实路线","link":"#国内玩家-混合实践与务实路线","children":[]}]},{"level":2,"title":"1.4 强化学习在自动驾驶中的具体应用进展","slug":"_1-4-强化学习在自动驾驶中的具体应用进展","link":"#_1-4-强化学习在自动驾驶中的具体应用进展","children":[{"level":3,"title":"运动控制：精准实现路径跟踪与车道保持。","slug":"运动控制-精准实现路径跟踪与车道保持。","link":"#运动控制-精准实现路径跟踪与车道保持。","children":[]},{"level":3,"title":"行为决策：应对复杂交通博弈与场景决策","slug":"行为决策-应对复杂交通博弈与场景决策","link":"#行为决策-应对复杂交通博弈与场景决策","children":[]},{"level":3,"title":"特定任务：高效完成自动泊车与赛道竞速","slug":"特定任务-高效完成自动泊车与赛道竞速","link":"#特定任务-高效完成自动泊车与赛道竞速","children":[]}]},{"level":2,"title":"1.5 强化学习在自动驾驶应用中的核心挑战与解决方案","slug":"_1-5-强化学习在自动驾驶应用中的核心挑战与解决方案","link":"#_1-5-强化学习在自动驾驶应用中的核心挑战与解决方案","children":[]},{"level":2,"title":"1.6 强化学习在自动驾驶应用中与大语言模型的结合","slug":"_1-6-强化学习在自动驾驶应用中与大语言模型的结合","link":"#_1-6-强化学习在自动驾驶应用中与大语言模型的结合","children":[{"level":3,"title":"大语言模型与具身智能：赋予高阶认知与可解释性","slug":"大语言模型与具身智能-赋予高阶认知与可解释性","link":"#大语言模型与具身智能-赋予高阶认知与可解释性","children":[]},{"level":3,"title":"多智能体强化学习（MARL）：从单车智能到群体智能","slug":"多智能体强化学习-marl-从单车智能到群体智能","link":"#多智能体强化学习-marl-从单车智能到群体智能","children":[]}]},{"level":2,"title":"二、强化学习自动驾驶实例","slug":"二、强化学习自动驾驶实例","link":"#二、强化学习自动驾驶实例","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"思考题","slug":"思考题","link":"#思考题","children":[]}],"relativePath":"强化学习快速入门与实战/23｜机器人控制：从机械臂到自动驾驶（下）.md","filePath":"强化学习快速入门与实战/23｜机器人控制：从机械臂到自动驾驶（下）.md","lastUpdated":1795556303000}'),p={name:"强化学习快速入门与实战/23｜机器人控制：从机械臂到自动驾驶（下）.md"};function e(t,s,h,k,F,r){return a(),n("div",null,[...s[0]||(s[0]=[l(`<h1 id="_23-机器人控制-从机械臂到自动驾驶-下" tabindex="-1">23 | 机器人控制：从机械臂到自动驾驶（下） <a class="header-anchor" href="#_23-机器人控制-从机械臂到自动驾驶-下" aria-label="Permalink to &quot;23 | 机器人控制：从机械臂到自动驾驶（下）&quot;">​</a></h1><p>你好！欢迎来到强化学习的第二十三讲。这节课我们将探索强化学习在自动驾驶中的应用与发展。</p><p>通过本节课的学习，你将能够：</p><ul><li>理清两大场景的技术关联：识别机械臂的运动学控制、传感器融合经验如何为自动驾驶的路径跟踪、动力学控制提供借鉴，理解强化学习从“结构化环境精确控制”到“动态环境自适应决策”的技术演进。</li></ul><h2 id="一、强化学习在自动驾驶中的应用与发展" tabindex="-1">一、强化学习在自动驾驶中的应用与发展 <a class="header-anchor" href="#一、强化学习在自动驾驶中的应用与发展" aria-label="Permalink to &quot;一、强化学习在自动驾驶中的应用与发展&quot;">​</a></h2><p>在自动驾驶技术向 L4 及以上级别突破的过程中，传统方法在复杂交通场景、未知风险应对及智能决策进化等方面逐渐显露出瓶颈。如何让自动驾驶汽车真正具备接近甚至超越人类驾驶员的环境感知、行为决策与动态控制能力，成为行业亟待解决的核心问题。</p><h2 id="_1-1-自动驾驶智能水平的评判与现状" tabindex="-1">1.1 自动驾驶智能水平的评判与现状 <a class="header-anchor" href="#_1-1-自动驾驶智能水平的评判与现状" aria-label="Permalink to &quot;1.1 自动驾驶智能水平的评判与现状&quot;">​</a></h2><p>如何判断自动驾驶汽车的智能水平？从生物大脑视角切入是重要思路。普遍观点认为，生物智能高低与其大脑神经元数量密切相关。若以深度神经网络作为智能承载，智能体（Agent）的智能性也与人工神经网络规模直接相关。</p><p>当前，用于自动驾驶汽车的神经网络规模约为百万或千万级别，这与典型哺乳动物的神经元数量相差甚远，且单个机器神经元能力远不及人类神经元。因此，现有自动驾驶技术远未达到人类驾驶智能，仅适用于简单稀疏交通工况，无法应对城市复杂道路交通场景，对未知场景的适应能力也存在不足。</p><p>传统自动驾驶技术同样面临瓶颈。基于规则库或模型预测控制（MPC）的方法，在处理城市复杂交通流、非结构化道路及“长尾”场景时，局限性日益凸显。而强化学习凭借“自我学习、试错进化”的独特范式，为攻克这些难题提供了新可能，且主要应用于自动驾驶的决策与控制环节。</p><ul><li><p>决策层面：可模拟人类驾驶员在复杂交通流中的行为博弈，解决路口通行、匝道汇入、超车和跟车等复杂场景的决策问题。</p></li><li><p>控制层面：强化学习智能体通过学习，能实现对车辆的精准运动控制，如路径跟踪和车道保持，在各种路况和车速下输出最佳前轮转角和加减速指令。</p></li></ul><p>强化学习的潜力在其他领域已有亮眼体现。在围棋智能突破中，谷歌 DeepMind 的第一代围棋智能（AlphaGo）结合监督学习与强化学习训练落子决策智能，具备战胜人类职业棋手的能力；其升级版本 AlphaZero 采用自我更新、自我进化机制，仅用 21 天自我学习就战胜此前的AlphaGo 版本，充分展示出强化学习类似人类学习机制的巨大潜力。</p><h2 id="_1-2-强化学习应用于自动驾驶的现实挑战与技术框架" tabindex="-1">1.2 强化学习应用于自动驾驶的现实挑战与技术框架 <a class="header-anchor" href="#_1-2-强化学习应用于自动驾驶的现实挑战与技术框架" aria-label="Permalink to &quot;1.2 强化学习应用于自动驾驶的现实挑战与技术框架&quot;">​</a></h2><p>针对这一问题，行业形成了“车路云闭环训练”的核心技术路线，其基本原理为：通过车端传感器获取车辆状态及周围环境信息，借助车云或车路云通信技术将数据上传至云端平台；云端利用大规模算力实现自动驾驶策略的快速迭代训练，训练成熟的策略再下载到车端进行测试与应用。通过这一“感知 - 训练 - 部署”的闭环循环，自动驾驶系统的感知、决策、控制性能可逐步提升，最终从协同式驾驶辅助，过渡到协同式环境感知与决策控制，实现城市道路场景的高级别自动驾驶。</p><p>从决策控制功能的演进来看，自动驾驶决控系统已历经三代技术变革，每一代都对应着智能水平的显著提升，而强化学习正是第三代技术的核心驱动力。</p><p>第一代：专家规则型决控（代表企业 / 机构：谷歌、特斯拉早期）。该系统完全依靠专家经验制定驾驶规则，实现行为选择与轨迹规划。但其最大制约在于“人类经验的有限性”——面对城市交通中的突发场景（如行人横穿、车辆违规变道），规则库无法覆盖所有情况，导致智能性不足。数据显示，其在复杂交通工况下的事故率约为人类驾驶员的百倍以上，难以满足安全需求。</p><p>第二代：数据驱动型决控（代表企业 / 机构：英伟达、CMU）。该系统通过自然驾驶数据直接拟合神经网络策略，试图通过“数据量堆砌”提升泛化能力。但它面临两大核心问题：一是“长尾数据困境”，罕见场景（如暴雨天的障碍物识别、特殊交通标志）的数据样本极少，需海量数据（权威机构估计至少需百亿公里自然驾驶数据）才能覆盖，导致成本高、耗时久；二是“上限瓶颈”，监督学习机制只能复刻人类驾驶员的平均水平，无法实现超越，难以突破人类驾驶的安全与效率天花板。</p><p>第三代：类脑学习型决控（代表企业 / 机构：MIT、清华大学）。该系统以强化学习理论为核心，结合自动驾驶仿真平台与实车运行数据，通过“自主学习进化”方式优化策略，目标是实现“超越人类驾驶员”的自动驾驶能力。其优势在于：无需依赖海量标注数据，可通过仿真试错快速积累经验；能主动学习最优策略，而非被动复刻人类行为，为提升智能性提供了关键路径，成为当前自动驾驶技术发展的重要方向。</p><h2 id="_1-3-自动驾驶决控系统的技术变革" tabindex="-1">1.3 自动驾驶决控系统的技术变革 <a class="header-anchor" href="#_1-3-自动驾驶决控系统的技术变革" aria-label="Permalink to &quot;1.3 自动驾驶决控系统的技术变革&quot;">​</a></h2><p>目前，全球自动驾驶行业在强化学习的应用上，已形成两条截然不同但又相互融合的技术路径，分别以特斯拉和 Waymo 为代表；国内玩家则结合自身场景特点，探索出务实的混合路线。</p><h3 id="特斯拉-数据驱动的-影子模式-与端到端之路" tabindex="-1">特斯拉：数据驱动的“影子模式”与端到端之路 <a class="header-anchor" href="#特斯拉-数据驱动的-影子模式-与端到端之路" aria-label="Permalink to &quot;特斯拉：数据驱动的“影子模式”与端到端之路&quot;">​</a></h3><p>特斯拉的核心优势在于其庞大的“数据飞轮”与独特的“影子模式”。全球数百万辆已部署车辆会在后台持续运行自动驾驶系统，将系统决策与人类驾驶员的实际行为进行对比，若两者差异较大（即“边缘案例”或“长尾场景”），数据会实时回传至云端。这些真实世界数据构成了天然的强化学习训练样本，“决策差异”则成为奖励信号，驱动模型持续优化。</p><p>同时，特斯拉正从传统“感知 - 规控”模块化架构，向“端到端（End-to-End）”架构演进：其 FSDBeta V12 引入基于 Transformer 的端到端模型，直接学习从原始传感器输入（摄像头、雷达数据）到车辆控制指令（转向、加减速）的映射关系。这一架构高度依赖其庞大的数据量与强大的训练算力（如 Dojo 超级计算机），通过海量数据驱动智驾模型快速迭代，以提升策略的鲁棒性与泛化能力。</p><h3 id="waymo-仿真优先的模拟驱动学习" tabindex="-1">Waymo：仿真优先的模拟驱动学习 <a class="header-anchor" href="#waymo-仿真优先的模拟驱动学习" aria-label="Permalink to &quot;Waymo：仿真优先的模拟驱动学习&quot;">​</a></h3><p>与特斯拉依赖真实数据不同，Waymo 更强调“仿真环境中的大规模训练”。Waymo Driver 的开发经验，既包括公共道路行驶的数百万英里，更涵盖模拟环境中行驶的数十亿英里——其自研的 Waymax 模拟器专为大规模强化学习设计，可利用 Waymo Open Motion Dataset（WOMD）实例化现实交通场景，并提供多种 RL 接口进行训练。</p><p>这种模式的核心优势在于“安全与高效”：在仿真环境中，系统可无风险地进行大量试错探索，解决真实世界中 RL 训练的安全性问题；同时，Waymo 通过数据增强提升模拟器真实性，利用强化学习微调模拟交通流，使其更接近真实物理规律，从源头缓解“虚实迁移”的核心难题。</p><h3 id="国内玩家-混合实践与务实路线" tabindex="-1">国内玩家：混合实践与务实路线 <a class="header-anchor" href="#国内玩家-混合实践与务实路线" aria-label="Permalink to &quot;国内玩家：混合实践与务实路线&quot;">​</a></h3><p>国内学术与产业界结合场景需求，探索出更具落地性的混合路线。例如，清华大学李升波教授团队提出“混合型强化学习及其集成式决控（IDC）架构”，模拟人类驾驶员“先模仿、再优化”的学习过程，让自动驾驶汽车具备自我学习与进化能力，并通过实车测试验证了方法的有效性。</p><p>地平线等企业则采用“三阶段训练范式”的务实路线：第一阶段进行感知与规划预训练，夯实基础能力；第二阶段通过模仿学习实现“冷启动”，快速适配常见场景；第三阶段利用强化学习进行“后训练”，重点优化长尾场景与分布外情况，最终提升模型的鲁棒性。</p><h2 id="_1-4-强化学习在自动驾驶中的具体应用进展" tabindex="-1">1.4 强化学习在自动驾驶中的具体应用进展 <a class="header-anchor" href="#_1-4-强化学习在自动驾驶中的具体应用进展" aria-label="Permalink to &quot;1.4 强化学习在自动驾驶中的具体应用进展&quot;">​</a></h2><p>经过多年发展，强化学习在自动驾驶的运动控制、行为决策及特定任务中，已从理论研究走向实践应用，取得显著进展。</p><h3 id="运动控制-精准实现路径跟踪与车道保持。" tabindex="-1">运动控制：精准实现路径跟踪与车道保持。 <a class="header-anchor" href="#运动控制-精准实现路径跟踪与车道保持。" aria-label="Permalink to &quot;运动控制：精准实现路径跟踪与车道保持。&quot;">​</a></h3><p>在运动控制领域，强化学习的核心价值是让车辆在复杂工况下（如不同车速、路面附着系数变化），仍能保持精准的动态响应。例如，有研究提出基于深度 Q-Learning（DQN）神经网络的转向控制策略，通过训练让智能体自适应不同路况与车速，输出最优前轮转角，显著提升路径跟踪的精度与稳定性；另有研究提出“双估计强化学习 + 前向预测控制（DEQL-FPC）”的运动控制框架，解决了传统 RL 因“单步决策”导致的次优控制序列问题，在路径跟踪与局部避障任务中表现出明显优越性。</p><h3 id="行为决策-应对复杂交通博弈与场景决策" tabindex="-1">行为决策：应对复杂交通博弈与场景决策 <a class="header-anchor" href="#行为决策-应对复杂交通博弈与场景决策" aria-label="Permalink to &quot;行为决策：应对复杂交通博弈与场景决策&quot;">​</a></h3><p>城市交通中，自动驾驶汽车需与各类动态交通参与者（车辆、行人、骑行者）交互，传统决策方法难以应对这种“博弈场景”。强化学习（尤其是多智能体强化学习）能通过学习交互规律，做出更优、更“拟人化”的决策。例如，在路口通行、匝道汇入等场景中，RL 可自主学习通行优先级判断；在协作自适应巡航控制（CACC）研究中，“通信感知强化学习（CA-RL）框架”通过前向与后向信息传递，让车辆高效融合周边车辆信息，大幅提升交通流效率与安全性。</p><h3 id="特定任务-高效完成自动泊车与赛道竞速" tabindex="-1">特定任务：高效完成自动泊车与赛道竞速 <a class="header-anchor" href="#特定任务-高效完成自动泊车与赛道竞速" aria-label="Permalink to &quot;特定任务：高效完成自动泊车与赛道竞速&quot;">​</a></h3><p>在目标明确、边界清晰的特定任务中，强化学习表现尤为突出。例如，在自动驾驶赛车（Autonomous Racing, AR）领域，车辆需逼近性能极限，传统方法难以应对非线性与高速动态特性；而基于深度强化学习（如 PPO 算法）的赛车智能体，可在卡耐基梅隆大学 ROAR 项目中自主学习最优赛车线，最终实现超越人类驾驶员的圈速，证明了 RL 在“极限控制问题”上的独特优势。在自动泊车任务中，RL 也能通过学习不同车位（垂直、平行、斜列）的空间约束，输出精准的转向与速度控制指令，提升泊车效率与成功率。</p><h2 id="_1-5-强化学习在自动驾驶应用中的核心挑战与解决方案" tabindex="-1">1.5 强化学习在自动驾驶应用中的核心挑战与解决方案 <a class="header-anchor" href="#_1-5-强化学习在自动驾驶应用中的核心挑战与解决方案" aria-label="Permalink to &quot;1.5 强化学习在自动驾驶应用中的核心挑战与解决方案&quot;">​</a></h2><p>尽管强化学习在自动驾驶中应用前景广阔，但仍面临三大核心挑战，这些挑战直接决定了技术落地的安全性与可行性。</p><p>挑战 1：安全性矛盾——试错学习与绝对安全的冲突</p><p>强化学习的“试错学习”机制是其核心优势，但也与自动驾驶“零事故”的安全要求存在根本矛盾：训练过程中，智能体需通过探索未知行为优化策略，而探索可能导致危险动作（如急刹、违规变道），在真实道路中可能引发事故。传统解决方案是将“碰撞”设为巨大负奖励，但这种“软惩罚”无法提供绝对安全保障。</p><p>针对这一挑战，行业探索出三类解决方案：</p><ul><li><p>安全约束强化学习（Safe RL）：将安全问题建模为“约束型马尔可夫决策过程（CMDP）”，把安全性作为“硬约束”而非“软惩罚”。例如，通过拉格朗日乘子法将安全约束整合到 DQN、MADDPG 等算法中，确保策略优化过程中不突破安全边界；或结合人类风险偏好，在CMDP 中计算成本限制，搭配模型预测控制（MPC）设计“动作屏蔽机制”，过滤不安全动作。</p></li><li><p>安全过滤器（Safety Filter）：采用“RL + 安全验证”的混合架构，在 RL 输出决策后，增加一个实时安全验证模块。例如，某专利提出将 RL 与 MPC 结合，RL 生成动作后，安全过滤器在预测时域内验证动作安全性，仅执行通过验证的指令，兼顾 RL 的高性能与 MPC 的安全性。</p></li><li><p>可解释知识模型：利用责任敏感安全模型（RSS）等可解释框架设计“安全掩码”，在训练与测试中强制约束智能体行为，确保任何情况下不发生碰撞。</p></li></ul><p>挑战 2：样本效率与泛化能力——数据饥渴与长尾困境</p><p>自动驾驶场景的复杂性，导致强化学习面临“样本效率低”与“泛化能力不足”的双重问题：</p><ul><li><p>样本效率低：RL 训练需大量环境交互，尤其在“稀疏奖励任务”中（多数状态下无有效奖励），智能体难以获得反馈，学习进程缓慢；且真实道路交互成本极高，难以支撑大规模训练。</p></li><li><p>泛化能力不足：现实交通存在海量“长尾场景”（如特殊交通标志、行人异常动作），RL 模型在训练场景中表现优异，但面对未见过的场景时，性能会大幅下降。</p></li></ul><p>解决这些问题的核心方案包括：</p><ul><li><p>提高样本利用率：离线强化学习（Offline RL）通过静态离线数据集训练，摆脱对在线交互的依赖，可利用已收集的大规模低成本数据，大幅降低样本获取成本。</p></li><li><p>增强探索机制：设计更高效的探索策略（如基于好奇心的探索、优先级经验回放），让智能体在更少交互中获取“高价值样本”，加速学习进程。</p></li><li><p>多范式集成学习：将模仿学习（IL）与强化学习结合，先用 IL 基于专家数据完成“冷启动”，快速适配常见场景；再用 RL 微调策略，优化长尾场景性能。研究表明，这种混合方法可将关键风险事件的碰撞率降低超 38%。</p></li></ul><p>挑战 3：虚实迁移鸿沟（Sim-to-Real Gap）——仿真与现实的“最后一公里”</p><p>由于真实道路试错风险高、成本大，绝大多数 RL 训练在仿真环境中进行，但仿真与现实存在“域差距”（如物理模型不精确、传感器噪声差异、光照材质非线性），导致仿真中表现优异的策略，在真实道路中可能失效，这就是“虚实迁移鸿沟”。</p><p>缩小这一鸿沟的主要方法有：</p><ul><li><p>数据驱动的仿真：利用真实场景数据优化仿真环境，例如蔚来“世界模型（NWM）”架构，通过日行千万公里的真实数据筛选重点场景，结合三维重建生成新场景，提升仿真真实性。</p></li><li><p>域随机化与域适应：域随机化通过随机调整仿真中的光照、传感器噪声、物体外观等参数，迫使模型学习“泛化性特征”；域适应则通过最优传输理论（如“检索增强学习框架RALAD”），在仿真与真实数据间建立特征映射，通过微调缩小差距。</p></li><li><p>离线强化学习：直接在真实世界数据集上训练，从根本上绕开虚实迁移问题，为策略获取提供安全高效的路径。</p></li></ul><p>解决这些挑战的方案包括：</p><ul><li><p>提高样本利用率：离线强化学习通过在静态、离线数据集上学习，从根本上解决了对在线交互的依赖，使得利用大规模、低成本的已收集数据成为可能。</p></li><li><p>增强探索机制：学习过程中的数据分布受到动作策略的影响，因此，设计更有效的探索机制，可以在更少的交互次数下获得更有价值的样本数据，从而加速学习进程。</p></li><li><p>多范式集成学习：混合学习范式，如将模仿学习与强化学习相结合，可以有效解决样本效率问题。例如，先用 IL 基于专家数据进行“冷启动”预训练，再通过 RL 进行微调，可以显著降低数据需求。这种方法利用 IL 的计算高效性初始化模型，再通过 RL 的奖励机制提升其在未见过场景的鲁棒性 。一项研究表明，这种混合方法能在应对关键风险事件时，将碰撞率降低超过 38%。</p></li></ul><h2 id="_1-6-强化学习在自动驾驶应用中与大语言模型的结合" tabindex="-1">1.6 强化学习在自动驾驶应用中与大语言模型的结合 <a class="header-anchor" href="#_1-6-强化学习在自动驾驶应用中与大语言模型的结合" aria-label="Permalink to &quot;1.6 强化学习在自动驾驶应用中与大语言模型的结合&quot;">​</a></h2><p>随着人工智能技术的发展，强化学习正与其他前沿技术融合，为自动驾驶注入更高阶的智能，主要体现在两大方向：大语言模型（LLM）与具身智能的结合、多智能体强化学习（MARL）的群体协作。</p><h3 id="大语言模型与具身智能-赋予高阶认知与可解释性" tabindex="-1">大语言模型与具身智能：赋予高阶认知与可解释性 <a class="header-anchor" href="#大语言模型与具身智能-赋予高阶认知与可解释性" aria-label="Permalink to &quot;大语言模型与具身智能：赋予高阶认知与可解释性&quot;">​</a></h3><p>自动驾驶汽车本质是“具身智能（Embodied AI）”的典型形态——通过物理实体（汽车）与环境交互，实现感知、学习与决策。而大语言模型（LLM）在复杂推理与自然语言理解上的突破，正为具身智能赋予更高阶的能力。</p><ul><li><p>提升认知与规划能力：LLM 可将运动规划问题重构为语言建模问题，例如 GPT-Driver 能生成驾驶轨迹，并以自然语言解释决策逻辑（如“减速是因为前方行人横穿马路”），提升系统透明度与可信度；同时，LLM 能理解复杂场景意图（如预测行人未来动作），帮助系统做出更安全的决策，其知识驱动的决策成功率显著高于传统方法。</p></li><li><p>技术协同与生态拓展：自动驾驶与具身智能在核心技术（传感器融合、实时控制、数据闭环、仿真）上高度共通。当自动驾驶在 L3 + 级别面临瓶颈时，将核心能力扩展到服务机器人、智能物流等具身智能赛道，成为技术与资本的自然选择——近期多位自动驾驶技术专家投身具身智能创业，正是这一趋势的体现，预示着人工智能从“虚拟交互”向“物理世界交互”的宏大升级。</p></li></ul><h3 id="多智能体强化学习-marl-从单车智能到群体智能" tabindex="-1">多智能体强化学习（MARL）：从单车智能到群体智能 <a class="header-anchor" href="#多智能体强化学习-marl-从单车智能到群体智能" aria-label="Permalink to &quot;多智能体强化学习（MARL）：从单车智能到群体智能&quot;">​</a></h3><p>传统自动驾驶研究聚焦“单车智能”，即单辆车独立决策，但现实交通是多参与者（自动驾驶车、人类驾驶车、行人）构成的复杂交互系统，单智能体 RL 难以应对这种“群体博弈”。而多智能体强化学习（MARL）通过训练智能体团队协同完成目标，在交通效率与安全性上展现出巨大潜力。</p><ul><li><p>典型应用场景：在协作自适应巡航控制（CACC）中，车辆通过 V2V 通信共享状态信息，MARL 可让车队在动态场景下（如前车减速、车道合并）协同决策，减少跟车距离、降低急刹频率，提升交通流效率；在城市路口，MARL 能协调多方向车辆通行，优化通行顺序，减少拥堵。</p></li><li><p>性能提升与未来方向：研究表明，在交通震荡场景中，当 MARL 模型渗透率达 100% 时，安全隐患较纯人类驾驶环境降低超 73%。未来，MARL 的研究将集中于提升开放环境下的稳健性、优化多智能体协作效率，并结合博弈论应对其他参与者的不确定性行为，最终实现“群体智能驱动的高效交通系统”。</p></li></ul><h2 id="二、强化学习自动驾驶实例" tabindex="-1">二、强化学习自动驾驶实例 <a class="header-anchor" href="#二、强化学习自动驾驶实例" aria-label="Permalink to &quot;二、强化学习自动驾驶实例&quot;">​</a></h2><p>强化学习自动驾驶实例，系统架构与核心组件和训练流程与奖励机制如下：</p><ul><li><p>系统架构与核心组件：该代码实现了一个完整的汽车自动驾驶强化学习系统，采用模块化设计包含三个核心类：CarEnvironment（环境模拟器）、PPOAgent（智能体）和PolicyNetwork（神经网络）。环境模拟器构建了一个 1000×800 像素的多车道道路场景，包含 4 条车道、动态其他车辆、交通灯系统和多传感器融合系统（16 个距离传感器、视觉传感器和位置传感器）。智能体使用 PPO（Proximal Policy Optimization）算法，采用 Actor-Critic 架构，其中 Actor 网络输出连续动作（加速度和转向角），Critic 网络评估状态价值，通过经验回放和策略梯度更新来学习最优驾驶策略。</p></li><li><p>训练流程与奖励机制：训练过程采用回合制，每个回合最多 2000 步，智能体通过观察环境状态（包含传感器数据、车辆位置、速度等）选择动作，环境根据动作更新车辆状态并计算奖励。奖励函数设计精细，包含基础前进奖励（+0.1）、速度控制奖励（理想速度范围+0.5，超速惩罚 -0.3）、车道保持奖励、安全距离奖励、交通灯遵守奖励等，同时设置碰撞惩罚（-20）、越界惩罚（-10）和驾驶平滑性奖励。系统每 128 步更新一次策略网络，每100 回合输出训练进度，并定期保存模型检查点。</p></li></ul><p>图 23-1 是实时交互式演示。该演示系统通过 matplotlib 实现了实时可视化，展示智能体在复杂交通环境中的学习过程。演示界面包含多车道道路（黄色边界线、白色车道分隔线）、主车（蓝色矩形，带红色传感器范围圆圈）、其他车辆（不同颜色的圆形障碍物）和交通灯系统。系统实时显示关键指标：当前奖励值、步数、碰撞次数等，让观众直观感受强化学习智能体如何通过试错学习逐步掌握安全驾驶技能，包括速度控制、车道保持、避障和交通规则遵守等核心驾驶能力。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BC%BA%E5%8C%96%E5%AD%A6%E4%B9%A0%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8%E4%B8%8E%E5%AE%9E%E6%88%98/images/23/1.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BC%BA%E5%8C%96%E5%AD%A6%E4%B9%A0%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8%E4%B8%8E%E5%AE%9E%E6%88%98/images/23/1.png" alt=""></a></p><ul><li>图23-1 强化学习-自动驾驶演示</li></ul><p>图 23-2 展示了训练性能深度分析。从训练曲线可以看出，智能体在 1000 回合训练中表现出典型的学习模式：初期奖励波动剧烈（-100 到 300+），平均奖励从 160 快速下降到 20-25 并保持相对稳定，说明智能体快速收敛到次优策略。碰撞率分析显示前 850 回合几乎每回合都发生碰撞（碰撞率接近 100%），后期有所改善但仍不稳定，反映了环境复杂性和奖励函数设计的挑战。超速行为在训练初期频繁（最高 14 次 / 回合），150 回合后显著减少，说明速度控制学习相对成功。整体而言，虽然智能体学会了基本的速度控制，但在复杂多车环境下的安全驾驶能力仍有待提升，这为后续算法优化和奖励函数调整提供了明确方向。</p><p><a class="image-link" href="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BC%BA%E5%8C%96%E5%AD%A6%E4%B9%A0%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8%E4%B8%8E%E5%AE%9E%E6%88%98/images/23/2.png" target="_blank" rel="noopener" title="点击查看原图"><img src="https://raw.githubusercontent.com/qiangshuifish/note-website/note-website/%E5%BC%BA%E5%8C%96%E5%AD%A6%E4%B9%A0%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8%E4%B8%8E%E5%AE%9E%E6%88%98/images/23/2.png" alt=""></a></p><ul><li>图23-2 强化学习-自动驾驶数据分析</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>&quot;&quot;&quot;</span></span>
<span class="line"><span>系统使用PPO算法训练智能体在模拟环境中进行自动驾驶。</span></span></code></pre></div><ul><li>主要特性：</li></ul><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">. 完整的汽车物理模拟</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">. 多车道道路环境</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">. 智能交通系统（其他车辆、交通灯）</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">. 多传感器融合（距离、视觉、位置传感器）</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">. 实时可视化展示</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">. 性能评估和训练曲线</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">import numpy as np</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">import matplotlib.pyplot as plt</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">import matplotlib.patches as patches</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">from matplotlib.animation import FuncAnimation</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">import torch</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">import torch.nn as nn</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">import torch.nn.functional as F</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">import torch.optim as optim</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">from torch.distributions import Normal</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">import random</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">import math</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">from collections import deque</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">import time</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">import json</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">from datetime import datetime</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"># 设置中文字体</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">plt.rcParams[&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">font</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">family</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;] = [&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">SimHei</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;, &quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">WenQuanYi Micro Hei</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;, &quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Heiti TC</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;]</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">plt.rcParams[&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">axes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">unicode_minus</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;] = False</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">class CarEnvironment:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   汽车自动驾驶环境</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   这个类模拟了一个真实的驾驶环境，包括：</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 多车道道路</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 其他车辆（不同驾驶风格）</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 交通灯系统</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 物理碰撞检测</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 传感器模拟</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def __init__(self, width=1000, height=800, lane_width=100):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.width = width</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.height = height</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.lane_width = lane_width</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.num_lanes = 4</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 汽车物理参数</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.car_length = 50</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.car_width = 25</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.max_speed = 8.0</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.max_steering = 0.4</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.acceleration = 0.3</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.deceleration = 0.5</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 交通规则</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.speed_limit = 5.0</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.safe_distance = 80</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 传感器参数</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.sensor_range = 300</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.num_sensors = 16</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 重置环境</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.reset()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def reset(self):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">重置环境到初始状态</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 道路边界定义</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.road_left = self.width // 2 - self.lane_width * self.num_lanes // 2</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.road_right = self.width // 2 + self.lane_width * self.num_lanes // 2</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 主车（我们的智能体）初始位置</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.car_x = self.width // 2</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.car_y = self.height - 150</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.car_angle = 0</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.car_speed = 0</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.car_steering = 0</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.car_acceleration = 0</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 生成其他车辆</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.other_cars = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.spawn_other_cars()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 交通灯系统</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.traffic_lights = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.spawn_traffic_lights()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 统计信息</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.total_reward = 0</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.step_count = 0</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.max_steps = 2000</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.collision_count = 0</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.speed_violations = 0</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       return self.get_state()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def spawn_other_cars(self):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">生成其他车辆，模拟真实交通</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.other_cars = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for _ in range(8):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           # 随机选择车道</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           lane = random.randint(0, self.num_lanes - 1)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           x = self.road_left + lane * self.lane_width + self.lane_width // 2</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           # 随机y位置（在屏幕上方）</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           y = random.randint(-300, -50)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           # 随机速度（模拟不同驾驶风格）</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           speed = random.uniform(1.5, 4.0)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           # 随机车辆类型</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           car_type = random.choice([&#39;normal&#39;, &#39;aggressive&#39;, &#39;slow&#39;])</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           if car_type == &#39;aggressive&#39;:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               speed *= 1.5</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           elif car_type == &#39;slow&#39;:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               speed *= 0.7</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           self.other_cars.append({</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               &#39;x&#39;: x,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               &#39;y&#39;: y,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               &#39;speed&#39;: speed,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               &#39;lane&#39;: lane,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               &#39;length&#39;: self.car_length,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               &#39;width&#39;: self.car_width,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               &#39;type&#39;: car_type,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               &#39;color&#39;: &#39;red&#39; if car_type == &#39;aggressive&#39; else &#39;orange&#39; if car_t</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           })</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def spawn_traffic_lights(self):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">生成交通灯系统</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.traffic_lights = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for i in range(3):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           x = self.road_left + (i + 1) * self.lane_width</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           y = self.height // 2</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           self.traffic_lights.append({</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               &#39;x&#39;: x,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               &#39;y&#39;: y,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               &#39;state&#39;: random.choice([&#39;red&#39;, &#39;yellow&#39;, &#39;green&#39;]),</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               &#39;timer&#39;: random.randint(50, 200)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           })</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def get_state(self):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       获取当前状态向量</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       状态包含：</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">. 主车状态（位置、速度、角度等）</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">. 传感器数据（16个方向的距离检测）</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">. 车道信息</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">. 交通灯状态</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">. 相对速度信息</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       state = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 主车状态（6维）</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       state.extend([</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           self.car_x / self.width,  # 归一化x位置</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           self.car_y / self.height,  # 归一化y位置</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           self.car_angle / math.pi,  # 归一化角度</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           self.car_speed / self.max_speed,  # 归一化速度</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           self.car_steering / self.max_steering,  # 归一化转向</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           self.car_acceleration / self.acceleration  # 归一化加速度</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       ])</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 传感器数据（16个方向 × 4个特征 = 64维）</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       sensor_data = self.get_enhanced_sensor_data()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       state.extend(sensor_data)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 车道信息（6维）</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       lane_info = self.get_lane_information()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       state.extend(lane_info)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 交通灯信息（12维）</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       traffic_light_info = self.get_traffic_light_information()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       state.extend(traffic_light_info)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 相对速度信息（3维）</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       relative_speeds = self.get_relative_speeds()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       state.extend(relative_speeds)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       return np.array(state, dtype=np.float32)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def get_enhanced_sensor_data(self):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">获取增强的传感器数据</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       sensor_data = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 16个方向的传感器</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for i in range(self.num_sensors):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           angle = i * 360 / self.num_sensors</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           distance, object_type = self.enhanced_raycast(angle)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           sensor_data.extend([</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               distance / self.sensor_range,  # 归一化距离</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               1.0 if object_type == &#39;car&#39; else 0.0,  # 是否检测到车辆</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               1.0 if object_type == &#39;boundary&#39; else 0.0,  # 是否检测到边界</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               1.0 if object_type == &#39;traffic_light&#39; else 0.0  # 是否检测到交通灯</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           ])</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       return sensor_data</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def enhanced_raycast(self, angle_deg):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       增强的射线检测</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       模拟激光雷达传感器，检测前方障碍物</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       angle_rad = math.radians(angle_deg + self.car_angle * 180 / math.pi)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for distance in range(1, self.sensor_range):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           x = self.car_x + distance * math.cos(angle_rad)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           y = self.car_y + distance * math.sin(angle_rad)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           # 检查车辆碰撞</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           for car in self.other_cars:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               if (abs(x - car[&#39;x&#39;]) &lt; car[&#39;width&#39;] and</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                   abs(y - car[&#39;y&#39;]) &lt; car[&#39;length&#39;]):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                   return distance, &#39;car&#39;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           # 检查交通灯</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           for light in self.traffic_lights:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               if (abs(x - light[&#39;x&#39;]) &lt; 20 and</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                   abs(y - light[&#39;y&#39;]) &lt; 20):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                   return distance, &#39;traffic_light&#39;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           # 检查道路边界</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           if (x &lt; self.road_left or x &gt; self.road_right or</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               y &lt; 0 or y &gt; self.height):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               return distance, &#39;boundary&#39;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       return self.sensor_range, &#39;none&#39;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def get_lane_information(self):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">获取车道信息</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       lane_info = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 当前车道</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       current_lane = int((self.car_x - self.road_left) // self.lane_width)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       current_lane = max(0, min(current_lane, self.num_lanes - 1))</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 车道中心距离</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       lane_center = self.road_left + current_lane * self.lane_width + self.lane</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       lane_distance = (self.car_x - lane_center) / (self.lane_width / 2)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 车道占用情况</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for lane in range(self.num_lanes):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           occupied = self.is_lane_occupied(lane)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           lane_info.append(1.0 if occupied else 0.0)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       lane_info.extend([</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           current_lane / (self.num_lanes - 1),  # 归一化当前车道</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           lane_distance,  # 车道中心距离</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       ])</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       return lane_info</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def is_lane_occupied(self, lane):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">检查车道是否被占用</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       lane_x = self.road_left + lane * self.lane_width + self.lane_width // 2</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for car in self.other_cars:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           if (abs(car[&#39;x&#39;] - lane_x) &lt; self.lane_width / 2 and</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               abs(car[&#39;y&#39;] - self.car_y) &lt; self.safe_distance):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               return True</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       return False</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def get_traffic_light_information(self):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">获取交通灯信息</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       light_info = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for light in self.traffic_lights:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           # 距离</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           distance = math.sqrt((light[&#39;x&#39;] - self.car_x)**2 + (light[&#39;y&#39;] - sel</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           distance_norm = min(distance / 200, 1.0)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           # 状态编码</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           state_encoding = [0, 0, 0]</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           if light[&#39;state&#39;] == &#39;red&#39;:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               state_encoding[0] = 1.0</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           elif light[&#39;state&#39;] == &#39;yellow&#39;:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               state_encoding[1] = 1.0</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           else:  # green</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               state_encoding[2] = 1.0</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           light_info.extend([distance_norm] + state_encoding)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       return light_info</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def get_relative_speeds(self):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">获取相对速度信息</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       relative_speeds = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 前方车辆相对速度</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       front_cars = [car for car in self.other_cars</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                    if car[&#39;y&#39;] &gt; self.car_y and</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                    abs(car[&#39;x&#39;] - self.car_x) &lt; self.lane_width]</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       if front_cars:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           closest_car = min(front_cars, key=lambda c: c[&#39;y&#39;] - self.car_y)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           relative_speed = (closest_car[&#39;speed&#39;] - self.car_speed) / self.max_s</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           relative_speeds.append(relative_speed)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       else:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           relative_speeds.append(0.0)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 左右车道车辆相对速度</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for direction in [-1, 1]:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           lane_cars = [car for car in self.other_cars</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                       if abs(car[&#39;x&#39;] - (self.car_x + direction * self.lane_wid</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           if lane_cars:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               avg_speed = np.mean([car[&#39;speed&#39;] for car in lane_cars])</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               relative_speed = (avg_speed - self.car_speed) / self.max_speed</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               relative_speeds.append(relative_speed)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           else:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               relative_speeds.append(0.0)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       return relative_speeds</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def step(self, action):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       执行动作并返回新状态</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       Args:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           action</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [throttle, steering] 动作向量</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       Returns</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           next_state: 新状态</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           reward: 奖励</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           done: 是否结束</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">           info: 额外信息</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 解析动作</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       throttle = np.clip(action[0], -1, 1)  # 油门 [-1, 1]</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       steering = np.clip(action[1], -1, 1)  # 转向 [-1, 1]</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 更新汽车物理状态</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.car_acceleration = throttle * self.acceleration</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.car_speed += self.car_acceleration</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.car_speed = np.clip(self.car_speed, -self.max_speed, self.max_speed)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.car_steering = steering * self.max_steering</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 更新位置</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.car_x += self.car_speed * math.cos(self.car_angle)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.car_y += self.car_speed * math.sin(self.car_angle)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.car_angle += self.car_steering * 0.1</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 更新其他车辆</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.update_other_cars()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 更新交通灯</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.update_traffic_lights()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 计算奖励</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       reward = self.calculate_advanced_reward()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 检查终止条件</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       done = self.check_termination()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.total_reward += reward</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.step_count += 1</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       return self.get_state(), reward, done, {}</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def update_other_cars(self):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">更新其他车辆（包含简单的AI行为）</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for car in self.other_cars:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           # 基础移动</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           car[&#39;y&#39;] += car[&#39;speed&#39;]</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           # 简单的变道行为</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           if random.random() &lt; 0.01:  # 1%概率变道</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               new_lane = car[&#39;lane&#39;] + random.choice([-1, 1])</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               if 0 &lt;= new_lane &lt; self.num_lanes:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                   car[&#39;lane&#39;] = new_lane</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                   car[&#39;x&#39;] = self.road_left + new_lane * self.lane_width + self</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           # 根据前方车辆调整速度</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           front_cars = [c for c in self.other_cars</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                        if c != car and c[&#39;y&#39;] &gt; car[&#39;y&#39;] and</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                        abs(c[&#39;x&#39;] - car[&#39;x&#39;]) &lt; self.lane_width]</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           if front_cars:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               closest = min(front_cars, key=lambda c: c[&#39;y&#39;] - car[&#39;y&#39;])</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               if closest[&#39;y&#39;] - car[&#39;y&#39;] &lt; self.safe_distance:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                   car[&#39;speed&#39;] *= 0.9  # 减速</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           # 重新生成离开屏幕的车辆</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           if car[&#39;y&#39;] &gt; self.height + 100:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               car[&#39;y&#39;] = -100</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               car[&#39;x&#39;] = self.road_left + random.randint(0, self.num_lanes - 1)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               car[&#39;speed&#39;] = random.uniform(1.5, 4.0)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               car[&#39;lane&#39;] = int((car[&#39;x&#39;] - self.road_left) // self.lane_width)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def update_traffic_lights(self):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">更新交通灯状态</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for light in self.traffic_lights:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           light[&#39;timer&#39;] -= 1</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           if light[&#39;timer&#39;] &lt;= 0:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               if light[&#39;state&#39;] == &#39;red&#39;:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                   light[&#39;state&#39;] = &#39;green&#39;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                   light[&#39;timer&#39;] = random.randint(100, 200)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               elif light[&#39;state&#39;] == &#39;green&#39;:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                   light[&#39;state&#39;] = &#39;yellow&#39;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                   light[&#39;timer&#39;] = 20</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               else:  # yellow</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                   light[&#39;state&#39;] = &#39;red&#39;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                   light[&#39;timer&#39;] = random.randint(50, 150)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def calculate_advanced_reward(self):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       计算高级奖励函数</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       奖励函数设计原则：</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">. 鼓励安全驾驶</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">. 鼓励遵守交通规则</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">. 鼓励高效通行</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">. 惩罚危险行为</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       reward = 0</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 基础奖励（鼓励前进）</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       reward += 0.1</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 速度奖励（鼓励适当速度）</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       speed_ratio = self.car_speed / self.speed_limit</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       if 0.8 &lt;= speed_ratio &lt;= 1.2:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           reward += 0.5  # 理想速度范围</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       elif speed_ratio &gt; 1.2:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           reward -= 0.3  # 超速惩罚</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           self.speed_violations += 1</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 车道保持奖励</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       current_lane = int((self.car_x - self.road_left) // self.lane_width)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       lane_center = self.road_left + current_lane * self.lane_width + self.lane</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       lane_distance = abs(self.car_x - lane_center)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       reward += (1 - lane_distance / (self.lane_width / 2)) * 0.3</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 安全距离奖励</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       front_cars = [car for car in self.other_cars</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                    if car[&#39;y&#39;] &gt; self.car_y and</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                    abs(car[&#39;x&#39;] - self.car_x) &lt; self.lane_width]</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       if front_cars:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           closest_car = min(front_cars, key=lambda c: c[&#39;y&#39;] - self.car_y)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           distance = closest_car[&#39;y&#39;] - self.car_y</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           if distance &gt; self.safe_distance:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               reward += 0.2</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           elif distance &lt; self.safe_distance / 2:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               reward -= 0.5  # 跟车太近惩罚</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 交通灯遵守奖励</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for light in self.traffic_lights:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           if (abs(light[&#39;x&#39;] - self.car_x) &lt; self.lane_width and</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               abs(light[&#39;y&#39;] - self.car_y) &lt; 50):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               if light[&#39;state&#39;] == &#39;red&#39; and self.car_speed &gt; 0:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                   reward -= 1.0  # 闯红灯惩罚</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               elif light[&#39;state&#39;] == &#39;green&#39; and self.car_speed &gt; 0:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                   reward += 0.3  # 绿灯通行奖励</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 碰撞惩罚</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       if self.check_collision_with_cars(self.car_x, self.car_y):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           reward -= 20</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           self.collision_count += 1</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 越界惩罚</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       if (self.car_x &lt; self.road_left or self.car_x &gt; self.road_right or</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           self.car_y &lt; 0 or self.car_y &gt; self.height):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           reward -= 10</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 平滑驾驶奖励</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       reward -= abs(self.car_steering) * 0.1  # 急转弯惩罚</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       reward -= abs(self.car_acceleration) * 0.05  # 急加速/急刹车惩罚</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       return reward</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def check_collision_with_cars(self, x, y):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">检查是否与其他车辆碰撞</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for car in self.other_cars:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           if (abs(x - car[&#39;x&#39;]) &lt; car[&#39;width&#39;] and</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               abs(y - car[&#39;y&#39;]) &lt; car[&#39;length&#39;]):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               return True</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       return False</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def check_termination(self):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">检查是否终止</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 碰撞检测</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       if self.check_collision_with_cars(self.car_x, self.car_y):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           return True</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 越界检测</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       if (self.car_x &lt; self.road_left or self.car_x &gt; self.road_right or</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           self.car_y &lt; 0 or self.car_y &gt; self.height):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           return True</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 步数限制</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       if self.step_count &gt;= self.max_steps:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           return True</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       return False</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def render(self, ax):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">渲染环境（用于可视化）</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       ax.clear()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 绘制道路</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for i in range(self.num_lanes + 1):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           x = self.road_left + i * self.lane_width</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           ax.axvline(x, color=&#39;white&#39;, linewidth=2)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 绘制道路边界</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       ax.axvline(self.road_left, color=&#39;yellow&#39;, linewidth=4)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       ax.axvline(self.road_right, color=&#39;yellow&#39;, linewidth=4)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 绘制交通灯</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for light in self.traffic_lights:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           color = light[&#39;state&#39;]</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           circle = patches.Circle((light[&#39;x&#39;], light[&#39;y&#39;]), 15,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                                 color=color, alpha=0.8)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           ax.add_patch(circle)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 绘制其他车辆</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for car in self.other_cars:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           rect = patches.Rectangle(</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               (car[&#39;x&#39;] - car[&#39;width&#39;]/2, car[&#39;y&#39;] - car[&#39;length&#39;]/2),</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               car[&#39;width&#39;], car[&#39;length&#39;],</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               linewidth=2, edgecolor=&#39;black&#39;, facecolor=car[&#39;color&#39;]</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           )</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           ax.add_patch(rect)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 绘制主车（我们的智能体）</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       car_rect = patches.Rectangle(</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           (self.car_x - self.car_width/2, self.car_y - self.car_length/2),</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           self.car_width, self.car_length,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           linewidth=2, edgecolor=&#39;blue&#39;, facecolor=&#39;lightblue&#39;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       )</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       ax.add_patch(car_rect)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 绘制传感器射线</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for i in range(0, self.num_sensors, 2):  # 每2个传感器画一条线</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           angle = i * 360 / self.num_sensors</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           distance, _ = self.enhanced_raycast(angle)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           angle_rad = math.radians(angle + self.car_angle * 180 / math.pi)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           end_x = self.car_x + distance * math.cos(angle_rad)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           end_y = self.car_y + distance * math.sin(angle_rad)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           ax.plot([self.car_x, end_x], [self.car_y, end_y], &#39;g-&#39;, alpha=0.3, li</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 绘制安全距离</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       safety_circle = patches.Circle((self.car_x, self.car_y), self.safe_distan</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                                    fill=False, color=&#39;red&#39;, alpha=0.3, linewidt</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       ax.add_patch(safety_circle)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       ax.set_xlim(0, self.width)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       ax.set_ylim(0, self.height)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       ax.set_aspect(&#39;equal&#39;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       ax.set_title(f&#39;汽车自动驾驶强化学习演示 - 奖励: {self.total_reward:.2f}, 步数:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       ax.set_facecolor(&#39;darkgreen&#39;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">class PPOAgent:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   PPO (Proximal </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Policy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Optimization) 智能体</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   PPO是一种先进的策略梯度算法，具有以下优点：</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">. 训练稳定</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">. 样本效率高</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">. 适合连续控制任务</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">. 有理论保证</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def __init__(self, state_size, action_size, lr=3e-4, gamma=0.99,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                eps_clip=0.2, k_epochs=4, entropy_coef=0.01):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.state_size = state_size</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.action_size = action_size</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.lr = lr</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.gamma = gamma</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.eps_clip = eps_clip</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.k_epochs = k_epochs</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.entropy_coef = entropy_coef</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 策略网络</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.policy = PolicyNetwork(state_size, action_size).to(device)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.optimizer = optim.Adam(self.policy.parameters(), lr=lr)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 经验缓冲区</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.memory = PPOMemory()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def select_action(self, state):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">选择动作</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       state = torch.FloatTensor(state).unsqueeze(0).to(device)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       with torch.no_grad():</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           action_mean, action_std, value = self.policy(state)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       dist = Normal(action_mean, action_std)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       action = dist.sample()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       log_prob = dist.log_prob(action).sum(dim=-1)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       return action.cpu().numpy()[0], log_prob.cpu().numpy()[0], value.cpu().nu</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def store_transition(self, state, action, reward, next_state, done, log_prob,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">存储经验</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.memory.store(state, action, reward, next_state, done, log_prob, valu</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def update(self):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &quot;&quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">更新策略网络</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       if len(self.memory.states) == 0:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           return</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 计算折扣回报</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       rewards = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       discounted_reward = 0</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for reward, done in zip(reversed(self.memory.rewards), reversed(self.memo</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           if done:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               discounted_reward = 0</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           discounted_reward = reward + self.gamma * discounted_reward</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           rewards.insert(0, discounted_reward)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 转换为张量</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       states = torch.FloatTensor(self.memory.states).to(device)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       actions = torch.FloatTensor(self.memory.actions).to(device)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       old_log_probs = torch.FloatTensor(self.memory.log_probs).to(device)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       values = torch.FloatTensor(self.memory.values).to(device)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       rewards = torch.FloatTensor(rewards).to(device)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 标准化奖励</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       rewards = (rewards - rewards.mean()) / (rewards.std() + 1e-8)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # PPO更新</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for _ in range(self.k_epochs):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           action_means, action_stds, new_values = self.policy(states)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           dist = Normal(action_means, action_stds)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           new_log_probs = dist.log_prob(actions).sum(dim=-1)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           # 计算比率</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           ratio = torch.exp(new_log_probs - old_log_probs)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           # 计算优势</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           advantages = rewards - values.detach()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           # 计算损失</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           surr1 = ratio * advantages</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           surr2 = torch.clamp(ratio, 1 - self.eps_clip, 1 + self.eps_clip) * ad</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           actor_loss = -torch.min(surr1, surr2).mean()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           critic_loss = F.mse_loss(new_values.squeeze(), rewards)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           entropy = dist.entropy().sum(dim=-1).mean()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           total_loss = actor_loss + 0.5 * critic_loss - self.entropy_coef * ent</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           self.optimizer.zero_grad()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           total_loss.backward()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           self.optimizer.step()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 清空经验缓冲区</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.memory.clear()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">class PolicyNetwork(nn.Module):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   策略网络</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   使用Actor</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Critic架构：</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Actor: 输出动作的均值和标准差</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Critic: 输出状态价值</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def __init__(self, state_size, action_size, hidden_size=512):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       super(PolicyNetwork, self).__init__()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 共享特征提取层</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.fc1 = nn.Linear(state_size, hidden_size)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.fc2 = nn.Linear(hidden_size, hidden_size)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.fc3 = nn.Linear(hidden_size, hidden_size)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.fc4 = nn.Linear(hidden_size, hidden_size)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # Actor分支：输出动作</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.action_mean = nn.Linear(hidden_size, action_size)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.action_std = nn.Linear(hidden_size, action_size)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # Critic分支：输出价值</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.value = nn.Linear(hidden_size, 1)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def forward(self, x):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       x = F.relu(self.fc1(x))</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       x = F.relu(self.fc2(x))</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       x = F.relu(self.fc3(x))</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       x = F.relu(self.fc4(x))</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # Actor输出</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       action_mean = torch.tanh(self.action_mean(x))  # 限制在[-1, 1]</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       action_std = F.softplus(self.action_std(x)) + 1e-5  # 确保为正</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # Critic输出</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       value = self.value(x)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       return action_mean, action_std, value</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">class PPOMemory:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;&quot;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">PPO经验缓冲区</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def __init__(self):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.states = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.actions = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.rewards = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.next_states = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.dones = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.log_probs = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.values = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def store(self, state, action, reward, next_state, done, log_prob, value):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.states.append(state)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.actions.append(action)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.rewards.append(reward)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.next_states.append(next_state)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.dones.append(done)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.log_probs.append(log_prob)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.values.append(value)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   def clear(self):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.states.clear()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.actions.clear()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.rewards.clear()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.next_states.clear()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.dones.clear()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.log_probs.clear()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       self.values.clear()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"># 设备配置</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">device = torch.device(&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">cuda</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot; if torch.cuda.is_available() else &quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">cpu</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">print(f&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">使用设备: {device}</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">def train_agent(episodes=1000, update_frequency=128, save_interval=100):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   训练智能体</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   Args:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       episodes: 训练回合数</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       update_frequency: 更新频率</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       save_interval: 保存间隔</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   print(&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot; * 60)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   print(&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">开始训练汽车自动驾驶智能体</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   print(&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot; * 60)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   env = CarEnvironment()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   state_size = len(env.get_state())</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   action_size = 2</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   agent = PPOAgent(state_size, action_size)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   episode_rewards = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   avg_rewards = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   collision_rates = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   speed_violations = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   start_time = time.time()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   for episode in range(episodes):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       state = env.reset()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       episode_reward = 0</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for step in range(2000):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           action, log_prob, value = agent.select_action(state)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           next_state, reward, done, _ = env.step(action)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           agent.store_transition(state, action, reward, next_state, done, log_p</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           state = next_state</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           episode_reward += reward</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           if done:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               break</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       episode_rewards.append(episode_reward)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       collision_rates.append(env.collision_count)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       speed_violations.append(env.speed_violations)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 更新智能体</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       if len(agent.memory.states) &gt;= update_frequency:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           agent.update()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       # 打印进度</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       if episode % 100 == 0:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           avg_reward = np.mean(episode_rewards[-100:])</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           avg_collision = np.mean(collision_rates[-100:])</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           avg_speed_violation = np.mean(speed_violations[-100:])</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           avg_rewards.append(avg_reward)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           elapsed_time = time.time() - start_time</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           print(f&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">回合 {episode:4d} | 平均奖励: {avg_reward:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.2f} | </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                 f&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">平均碰撞: {avg_collision:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.1f} | 超速次数: {avg_speed_violation:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                 f</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;用时: {elapsed_time:.1f}s&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       # 保存模型</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> episode % save_interval </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> and</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> episode </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">           torch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">save</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">agent</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">policy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.state_dict(), f</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;autonomous_driving_model_epis</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   # 保存最终模型</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   torch.save(agent.policy.state_dict(), &#39;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">autonomous_driving_model_final</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">pth</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   print(f&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\n</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">训练完成！模型已保存为 &#39;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">autonomous_driving_model_final</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">pth</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;&quot;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   return agent, episode_rewards, avg_rewards, collision_rates, speed_violations</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">def test_agent(agent, episodes=3, render=True):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   测试智能体</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   Args:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       agent: 训练好的智能体</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       episodes: 测试回合数</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       render: 是否显示可视化</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   print(&quot;=&quot; * 60)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   print(&quot;开始测试智能体&quot;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   print(&quot;=&quot; * 60)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   env = CarEnvironment()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   if render:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       fig, ax = plt.subplots(figsize=(15, 10))</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   test_rewards = []</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   for episode in range(episodes):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       state = env.reset()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       episode_reward = 0</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       for step in range(2000):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           with torch.no_grad():</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               action, _, _ = agent.select_action(state)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           next_state, reward, done, _ = env.step(action)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           state = next_state</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           episode_reward += reward</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           if render:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               env.render(ax)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               plt.pause(0.01)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           if done:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">               break</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       test_rewards.append(episode_reward)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       print(f&quot;测试回合 {episode + 1}: 奖励 = {episode_reward:.2f}, &quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">             f&quot;碰撞次数 = {env.collision_count}, 超速次数 = {env.speed_violations}&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       if render:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">           time.sleep(1)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   if render:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       plt.close()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   avg_test_reward = np.mean(test_rewards)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   print(f&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\n</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">测试完成！平均奖励: {avg_test_reward:.2f}&quot;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   return test_rewards</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">def plot_training_curves(episode_rewards, avg_rewards, collision_rates, speed_vio</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;&quot;&quot;绘制训练曲线&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.figure(figsize=(16, 12))</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   # 子图1：每回合奖励</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.subplot(2, 2, 1)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.plot(episode_rewards, alpha=0.3, color=&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">blue</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.plot(avg_rewards, color=&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">red</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;, linewidth=2)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.title(&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">训练奖励曲线</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.xlabel(&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">回合</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.ylabel(&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">奖励</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.legend([&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">每回合奖励</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;, &#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">平均奖励（每100回合）</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;])</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.grid(True)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   # 子图2：平均奖励</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.subplot(2, 2, 2)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.plot(avg_rewards, color=&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">red</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;, linewidth=2)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.title(&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">平均奖励趋势</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.xlabel(&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">回合（×</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">）</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.ylabel(&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">平均奖励</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.grid(True)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   # 子图3：碰撞次数</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.subplot(2, 2, 3)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.plot(collision_rates, color=&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">orange</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.title(&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">碰撞次数</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.xlabel(&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">回合</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.ylabel(&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">碰撞次数</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.grid(True)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   # 子图4：超速次数</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.subplot(2, 2, 4)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.plot(speed_violations, color=&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">purple</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.title(&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">超速次数</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.xlabel(&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">回合</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.ylabel(&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">超速次数</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.grid(True)</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.tight_layout()</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   plt.savefig(&#39;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">autonomous_driving_training_curves</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">png</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;, dpi=300, bbox_inches=&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">t</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   plt</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">show</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">def create_demo_animation(agent, duration</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">):</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;&quot;&quot;创建演示动画&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;创建演示动画...&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   env </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> CarEnvironment()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   fig, ax </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> plt</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">subplots</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(figsize</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">15</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   def animate(frame):</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> frame </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">==</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">           env</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">reset</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       state</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> env</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">get_state</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       with</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> torch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">no_grad</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">():</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           action</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, _, _ </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> agent</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">select_action</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">state</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       next_state, reward, done, _ </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> env</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">step</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">action</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       env</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">render</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ax)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">       if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> done:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">           env</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">reset</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   # 创建动画</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   anim </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> FuncAnimation(fig, animate, frames</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">duration</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">30</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, interval</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">33</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">repeat=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Tr</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   # 保存动画</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   anim</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">save</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;autonomous_driving_demo.gif&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, writer</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;pillow&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, fps</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">30</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;动画已保存为 &#39;autonomous_driving_demo.gif&#39;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   plt</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">show</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> anim</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">def save_training_results(episode_rewards, avg_rewards, collision_rates, speed_vi</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;&quot;&quot;保存训练结果&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   results </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &#39;episode_rewards&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: episode_rewards,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &#39;avg_rewards&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: avg_rewards,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &#39;collision_rates&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: collision_rates,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &#39;speed_violations&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: speed_violations,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">       &#39;timestamp&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">datetime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">now</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">().isoformat()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   with</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> open</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;training_results.json&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;w&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">encoding=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;utf-8&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> f:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       json</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">dump</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(results, f, indent</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, ensure_ascii</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">False)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;训练结果已保存为 &#39;training_results.json&#39;&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">def main():</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">   &quot;&quot;&quot;主函数 - 课程展示入口&quot;&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;=&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 80</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;汽车自动驾驶强化学习课程展示&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;=&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 80</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;本演示包含以下内容：&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;1. 完整的汽车物理模拟环境&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;2. 多传感器融合系统&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;3. PPO强化学习算法&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;4. 实时可视化展示&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;5. 性能评估和分析&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   # 训练智能体</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;开始训练...&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   agent, episode_rewards, avg_rewards, collision_rates, speed_violations </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> trai</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       episodes</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       update_frequency</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">128</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   )</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   # 绘制训练曲线</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;\\n绘制训练曲线...&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   plot_training_curves(episode_rewards, avg_rewards, collision_rates, speed_vio</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   # 测试智能体</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;\\n开始测试...&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   test_rewards </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> test_agent(agent, episodes</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, render</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">True)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   # 保存结果</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   save_training_results(episode_rewards, avg_rewards, collision_rates, speed_vi</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   # 创建演示动画</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;\\n创建演示动画...&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   create_demo_animation(agent, duration</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;\\n&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> +</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;=&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 80</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;课程展示完成！&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;=&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 80</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;生成的文件：&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;- autonomous_driving_model_final.pth: 训练好的模型&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;- autonomous_driving_training_curves.png: 训练曲线图&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;- autonomous_driving_demo.gif: 演示动画&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;- training_results.json: 训练结果数据&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p>对于 L4 + 级别的自动驾驶，强化学习是一种被认为能提升决策上限的技术探索路线，理想应用模式是“强化学习突破上限 + 规则保障下限 + 海量场景库支撑 + 全量特征输入”，但现实情况是，规则与传统控制已能覆盖 99% 的场景，且强化学习在这些常规场景中难以保证达到传统控制决策的水平。因此，强化学习的应用期待主要集中在 1% 的长尾场景，然而这类场景又需大量仿真与场景触发来实现学习对比，这恰好面临强化学习“样本类型不足而难以学好”的核心问题。</p><p>不过目前头部车企均有强化学习方案探索（需注意不同企业的强化学习应用层次与深度存在差异，且与学术界侧重端到端或直接决策的方向不同）：</p><ul><li><p>一方面，强化学习多用于优化策略搜索以提升效率，例如特斯拉用 MCTS 搜索航点、百度Apollo 用其输出未来一段时间的位置、部分方案在规划阶段用其评估不同决策路径的价值（如面对车前自行车时选择跟随、远离还是变道等）；</p></li><li><p>另一方面，强化学习常在仿真环境中作为智能代理（Smart agent），模仿现实世界中人和物的决策行为，与自动驾驶车辆进行博弈，主动生成符合真实场景的人车运动状态，进而提升或验证传统算法性能。</p></li></ul><p>值得注意的是，当前强化学习的主要应用领域仍集中在游戏行业，因其环境可控、稳定且任务目标明确，且自动驾驶类游戏 AI 已能实现出色表现，但这与实际自动驾驶并非同一类问题；不过目前强化学习在非游戏领域的研究热度显著提升，尤其是模仿学习与离线强化学习成果丰硕，且已在游戏工业界实现成功应用，这对降低研发成本、加速实验迭代具有重要意义。</p><p>同时需正视，不同公司的强化学习人才储备与技术水平差异较大，受业务需求、组织发展等因素影响，强化学习人才的技术能力差距明显，而强化学习技术要实现商业化落地并展现出优异实际性能，离不开大量工程实践经验与扎实的项目背景支撑。从做出 Demo 到实际落地并达成成熟商业化，不仅是单纯的技术问题，但鉴于强化学习技术路线的探索价值，整体仍看好其在自动驾驶领域的落地前景，未来有望实现突破性表现，值得期待。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>这三节课我们以“机器人控制：从机械臂到自动驾驶”为核心主题，系统串联起两大典型机器人控制场景的技术逻辑与实践方法。机械臂控制聚焦结构化环境下的精准操作，围绕运动学（正向 / 逆运动学、线性运动学）、动力学补偿及力反馈控制展开，从 DH 参数建模到雅可比矩阵应用，构建了“关节协同 - 末端精准”的控制体系；而强化学习的引入，进一步解决了传统控制在动态力反馈任务中的适配难题，通过“试错迭代”机制让机械臂在人机协作、灵巧抓取等场景中实现自适应调整，为复杂操作任务提供了智能化解决方案。</p><p>自动驾驶则是机械臂控制技术在动态开放环境中的进阶延伸，其核心在于构建“感知 - 决策 - 规划 - 控制”的完整闭环。从行业全景看，自动驾驶正通过感知架构升级（BEV+Transformer+Occupancy）、工程方案优化（轻地图、传感器降本、集中式域控）及商业化分层落地（封闭场景先行）逐步突破 L4 级技术瓶颈；在控制层面，纵向速度调节与横向路径跟踪的协同，结合车辆动力学模型，实现了安全与效率的平衡，而强化学习从“专家规则”到“类脑学习”的技术迭代，更推动自动驾驶决策从“复刻人类”向“超越人类”迈进，成为解决复杂交通博弈与长尾场景的关键路径。</p><p>机械臂与自动驾驶虽场景差异显著，却共享“感知环境 - 决策策略 - 执行控制”的核心逻辑，形成了技术上的传承与互补——机械臂的运动学控制经验为自动驾驶路径跟踪提供了理论基础，传感器融合技术则在两者间实现跨场景复用；强化学习作为贯穿其中的核心技术纽带，既解决了机械臂力反馈等精密控制问题，又突破了自动驾驶动态决策的瓶颈，推动机器人控制技术从“结构化环境精确执行”向“动态环境智能适应”持续演进，为更高阶的机器人智能化应用奠定了基础。</p><h2 id="思考题" tabindex="-1">思考题 <a class="header-anchor" href="#思考题" aria-label="Permalink to &quot;思考题&quot;">​</a></h2><p>在自动驾驶决策控制场景中，强化学习常需应对“虚实迁移鸿沟”（Sim-to-Real Gap），即仿真环境中训练的最优策略，部署到真实道路后易因物理模型偏差、传感器噪声差异等问题失效。结合本节课中提到的自动驾驶技术框架（如感知 - 决策 - 规划 - 控制闭环）与强化学习应用逻辑（如仿真训练、真实环境微调），请分析：</p><p>从技术原理角度，“虚实迁移鸿沟”会对自动驾驶强化学习策略的哪两个核心环节产生最显著影响？请分别说明具体影响机制（例如对感知数据处理、控制指令执行的干扰）。</p><p>希望你通过今天的学习，对强化学习有了清晰的认识。如果有任何疑问，欢迎在讨论区留言交流！</p>`,87)])])}const g=i(p,[["render",e]]);export{E as __pageData,g as default};
