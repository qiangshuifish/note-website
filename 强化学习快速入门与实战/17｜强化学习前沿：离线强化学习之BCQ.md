# 17 | 强化学习前沿：离线强化学习之BCQ

你好！欢迎来到强化学习的第十七讲。上节课我们深入学习了离线强化学习本身，掌握了其定义以及应用方面的解决方案，不难看出，其极大地拓展了强化学习的应用边界。这节课我们深入学习下离线强化学习的代表算法——BCQ。

通过本节课的学习，你将能够：

- 掌握 BCQ 算法的核心机制：如何通过生成模型约束动作空间，在历史数据的“安全区”内实现策略优化。

## BCQ 算法详解

由 TD3 算法提出者 Scott Fujimoto 于 2019 年提出的 BCQ 算法，重点针对连续状态空间下的策略约束问题构建解决方案。

该研究首先系统阐释了离线强化学习中普遍存在的外推误差（extrapolation error）现象，深入剖析了此类误差产生的底层机制；进而通过严谨的数学推导证明：在特定约束条件下这类外推误差能够得到有效消除；最终创新性地提出 BCQ 算法框架，通过引入批次约束机制对动作空间实施精准限制，从根本上规避外推误差的产生。

系列实验结果充分验证了 BCQ 算法在离线学习场景中的优异性能，展现出显著优于传统方法的决策效果。

## 算法背景与动机

Online 与 Offline 的区别在于，是否与环境实时交互，标准的的 RL 算法通过反复试错来学习如何执行任务，并在探索与利用之间进行平衡达到更好的表现，而 Offline RL 要求智能体从固定的数据集汇总进行学习，不能进行探索，因此 Offline RL 研究的是，如何最大限度地利用静态的离线数据集来训练 RL 智能体。

传统的离线强化学习算法，如基于深度 Q 网络（DQN）和深度确定性策略梯度（DDPG）的方法，在处理固定数据集时遭遇了严重困境。由于数据分布的差异，当智能体尝试将从旧数据中学到的知识应用于新情况时，外推误差问题凸显。

简单来说，外推误差就像是“用前朝的剑斩本朝的官”，旧数据所蕴含的信息与当前实际环境的需求不匹配，导致智能体在面对新数据时，策略性能急剧下降。例如在一个机器人控制任务中，若基于历史数据训练的策略在实际执行时遇到与训练数据分布不同的环境状态，机器人的动作可能会变得混乱，无法完成预期任务。

BCQ 算法旨在突破这一困境，通过创新的思路来解决外推误差问题，使智能体能够在不依赖实时环境交互的情况下，从固定的批量数据中高效学习，构建出更加稳健、可靠的策略。

## 核心技术与原理

BCQ 算法为解决离线强化学习中的外推误差问题，提出了一套系统性的解决方案，其核心技术围绕巧妙的动作空间限制机制与双 Q 网络的结合，通过严谨的设计确保策略始终在历史数据的 “安全区” 内进行决策，接下来我们将详细解析这些关键技术的具体实现方式与内在原理。

1. 限制动作空间

BCQ 的核心思想之一是对智能体的动作空间进行巧妙限制。它迫使智能体在给定数据子集的范围内行动，尽可能接近在线策略。具体而言，BCQ 利用状态条件生成模型达到这一目的。该模型能够根据当前状态生成一系列与训练数据中的动作相似的候选动作。

这就像是为智能体划定了一个“安全区”，它只能在这个与历史数据相关的动作范围内进行选择，从而有效减少了外推误差的影响。例如，在一个自动驾驶场景的离线数据集中，状态条件生成模型会根据当前车辆的速度、路况等状态信息，生成一系列在历史数据中出现过的、合理的驾驶动作，如加速、减速、转弯的幅度等，避免智能体生成过于激进或不合理的驾驶决策。

## (s, a)

- ​(a ∣

## s)

- G

## B

## s

## P

给定状态 ，将

- 和数据集中的状态 - 动作对的相似度建模成条件概率。β​(a ∣

## s)

- ​(s)G

## P

## G

为了估计

- ，采用参数化的生成模型，从中采样动作来逼近ωβ

## arg max

- ​(a ∣

## s)

- G​ P。 使用变分自动编码器 VAE 来提高生成动作的多样性，引入扰动模型aB​(s, a, Φ)

## [−Φ, Φ]

## ξ

## a

- ，对动作 的扰动范围是。此时策略可以表示为：

ϕ

- n

## π(s) = arg

- ​(s, a​ +

## max

- ​(s, a​, Φ)),

## {a

- ​ ∼​(s)}​Q

## ξ

## G

- θiϕiiωi=1​​+ξ​(s,a​,Φ)aiϕi

## Φ

## Φ = 0

## n = 1

## n

参数 和

- 的选择让 BCQ 算法介于模仿学习和强化学习之间。当且时，

## Φ = a

- ​ −

## n →∞

## a

BCQ 就类似于模仿学习；当

- 且时，BCQ 算法就类似于 Q-maxmin​

## ξ

learning 算法。 扰动模型

- 的训练和 DDPG 算法的训练目标类似：​ϕ

## ∑

- ​(s, a +

## ϕ ←arg

## max

- ​(s, a, Φ))​Q

## ξ

- θϕ​ϕ(s,a)∈B

2. 结合 Q 网络

状态条件生成模型生成的候选动作并非直接被采用，而是与 Q 网络相结合。Q 网络对这些候选动作进行价值评估，选择具有最高价值的动作，作为智能体最终的执行动作。为了进一步提高评估的准确性和稳定性，BCQ 采用了双 Q 网络结构。通过两个 Q 网络对动作价值进行估计，并取两者中的最小值，能够有效减少估计误差，使智能体的决策更加保守和可靠。

具体来说，为了对未来一些不常见的状态进行惩罚，BCQ 采用 Clipped Double Q-learning 算

## {Q

- ​, Q​}

## Q

法对动作值

- 进行估计，也就是训练两个动作值网络，取它们的最小值作为动作θθ​1​2

值的估计。改进 Clipped Double Q-learning 算法，对两个动作值采用新的结合方式：

## max [

- i ]′′

## y = r + γ

- ​(s , a​) + (1 −λ)​(s , a​)

## min

## max

- ​ λ​Q​Q′′θiθj=1,2j=1,2​j​ja​i

以一个简单的游戏场景为例：双 Q 网络分别对候选动作（如向左移动、向右移动、跳跃等）进行价值评估，然后选择价值估计最小但更接近真实情况的动作，防止智能体因为过度乐观的价值估计而选择错误的动作。

3. 训练目标函数

为了实现优化给定批次的离线策略学习，BCQ 精心设计了训练目标函数，主要包含三个关键部分：

- 首先，最小化选定动作与批数据的距离，这确保了策略选择的动作与训练数据中的动作尽可能相似，减少外推误差。

- 其次，引导智能体到达可以观察到熟悉数据的状态，使策略能够将智能体引导至那些在训练数据中出现过的状态，进一步增强对历史数据的利用效率。

- 最后，最大化价值函数，促使智能体通过学习来最大化累积奖励，实现性能提升。

这三个部分相互协作，共同推动智能体在离线数据上学习到优秀的策略。

## 算法实现步骤

- 状态条件生成模型构建：通过神经网络等技术构建状态条件生成模型。该模型以当前状态作为输入，输出一系列与训练数据中动作相似的候选动作。在构建过程中，需要使用训练数据

- 对模型进行训练，使其能够准确捕捉状态与动作之间的关系。例如，可以采用生成对抗网络（GAN）的思想，让生成模型与判别模型相互对抗、协同训练，不断优化生成动作的质量。

- 动作扰动网络设计：为了增加动作的多样性，引入动作扰动网络。它对状态条件生成模型产生的动作进行微小扰动。扰动的程度需要精心调整，既不能过大导致动作过于偏离历史数据，也不能过小导致无法提供足够的探索性。通过这种方式，智能体能够在一定程度上探索新的动作，提高策略的泛化能力。

- Q 网络与双 Q 网络搭建：搭建用于评估动作价值的 Q 网络和双 Q 网络。Q 网络接收状态和动作作为输入，输出该动作在当前状态下的价值估计。双 Q 网络通过两个独立的 Q 网络结构，分别进行价值估计，并在决策时取两者的最小值。在训练过程中，使用离线数据对Q 网络进行优化，使其能够准确评估动作的价值。

- 训练与优化过程：在训练阶段，从离线数据集中采样数据，输入到上述构建好的模型中。状态条件生成模型生成候选动作，动作扰动网络对其进行扰动，然后 Q 网络对扰动后的动作进行价值评估。根据训练目标函数，通过梯度下降等优化算法不断调整模型的参数，使智能体逐渐学习到最优策略。同时，利用双 Q 网络结构减少价值估计误差，提高训练的稳定性和收敛性。

```sql
import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
import numpy as np
from collections import deque, namedtuple
import random
# 定义过渡样本的结构
Transition = namedtuple('Transition', ('state', 'action', 'next_state', 'reward',
class ReplayBuffer:
   """经验回放缓冲区，用于存储和采样训练数据"""
   def __init__(self, capacity):
       self.memory = deque([], maxlen=capacity)
   def push(self, *args):
       """添加一个过渡样本到缓冲区"""
       self.memory.append(Transition(*args))
   def sample(self, batch_size):
       """从缓冲区中随机采样一个批次的样本"""
       return random.sample(self.memory, batch_size)
   def __len__(self):
       """返回缓冲区中的样本数量"""
       return len(self.memory)
class QNetwork(nn.Module):
   """Q网络，用于估计动作价值"""
   def __init__(self, state_dim, action_dim, hidden_dim=128):
       super(QNetwork, self).__init__()
       self.fc1 = nn.Linear(state_dim, hidden_dim)
       self.fc2 = nn.Linear(hidden_dim, hidden_dim)
       self.fc3 = nn.Linear(hidden_dim, action_dim)
   def forward(self, state):
       x = F.relu(self.fc1(state))
       x = F.relu(self.fc2(x))
       return self.fc3(x)
class Actor(nn.Module):
   """策略网络，用于生成动作"""
   def __init__(self, state_dim, action_dim, hidden_dim=128, phi=0.05):
       super(Actor, self).__init__()
       self.fc1 = nn.Linear(state_dim, hidden_dim)
       self.fc2 = nn.Linear(hidden_dim, hidden_dim)
       self.fc3 = nn.Linear(hidden_dim, action_dim)
       self.phi = phi  # 用于控制动作扰动的幅度
   def forward(self, state):
       x = F.relu(self.fc1(state))
       x = F.relu(self.fc2(x))
       return torch.tanh(self.fc3(x))  # 假设动作空间是[-1, 1]
   def select_action(self, state, action_set):
       """从给定的动作集中选择最佳动作"""
       with torch.no_grad():
           # 生成目标动作
           target_action = self.forward(state)
           # 计算与目标动作的距离
           distances = torch.norm(action_set - target_action, dim=1)
           # 选择最接近的动作
           idx = torch.argmin(distances)
           return action_set[idx]
class BCQ:
   """Batch-Constrained Q-Learning算法实现"""
   def __init__(self, state_dim, action_dim, action_set, hidden_dim=128,
                lr_q=1e-3, lr_policy=1e-3, gamma=0.99, tau=0.005, phi=0.05):
       # 状态和动作维度
       self.state_dim = state_dim
       self.action_dim = action_dim
       # 动作集合（从数据集中收集）
       self.action_set = torch.tensor(action_set, dtype=torch.float32)
       # 折扣因子
       self.gamma = gamma
       # 软更新参数
       self.tau = tau
       # Q网络和目标Q网络
       self.q1 = QNetwork(state_dim, action_dim, hidden_dim)
       self.q1_target = QNetwork(state_dim, action_dim, hidden_dim)
       self.q1_target.load_state_dict(self.q1.state_dict())
       # 策略网络
       self.actor = Actor(state_dim, action_dim, hidden_dim, phi)
       # 优化器
       self.optimizer_q = optim.Adam(self.q1.parameters(), lr=lr_q)
       self.optimizer_policy = optim.Adam(self.actor.parameters(), lr=lr_policy)
       # 损失函数
       self.criterion = nn.MSELoss()
   def select_action(self, state):
       """选择动作"""
       state = torch.tensor(state, dtype=torch.float32).unsqueeze(0)
       with torch.no_grad():
           action = self.actor.select_action(state, self.action_set)
       return action.numpy()
   def update(self, batch):
       """更新网络参数"""
       states = torch.tensor([t.state for t in batch], dtype=torch.float32)
       actions = torch.tensor([t.action for t in batch], dtype=torch.float32)
       next_states = torch.tensor([t.next_state for t in batch], dtype=torch.flo
       rewards = torch.tensor([t.reward for t in batch], dtype=torch.float32)
       dones = torch.tensor([t.done for t in batch], dtype=torch.float32)
       # 计算目标Q值
       with torch.no_grad():
           # 为每个下一状态选择最佳动作
           next_actions = torch.stack([self.actor.select_action(next_states[i].u
                                      for i in range(next_states.shape[0])])
           # 计算目标Q值
           q_targets = rewards + (1 - dones) * self.gamma * self.q1_target(next_
               1, torch.argmax(self.q1(next_states), dim=1).unsqueeze(1)).squeez
       # 计算当前Q值
       q_values = self.q1(states).gather(1, torch.argmax(self.q1(states), dim=1)
       # 更新Q网络
       q_loss = self.criterion(q_values, q_targets)
       self.optimizer_q.zero_grad()
       q_loss.backward()
       self.optimizer_q.step()
       # 更新策略网络（通过最大化Q值）
       policy_actions = torch.stack([self.actor.select_action(states[i].unsqueez
                                    for i in range(states.shape[0])])
       policy_loss = -self.q1(states).gather(
           1, torch.argmax(self.q1(states), dim=1).unsqueeze(1)).mean()
       self.optimizer_policy.zero_grad()
       policy_loss.backward()
       self.optimizer_policy.step()
       # 软更新目标网络
       for param, target_param in zip(self.q1.parameters(), self.q1_target.param
           target_param.data.copy_(self.tau * param.data + (1 - self.tau) * targ
       return q_loss.item(), policy_loss.item()
# 使用示例
if __name__ == "__main__":
   # 超参数
   state_dim = 4  # 例如CartPole环境的状态维度
   action_dim = 2  # 例如CartPole环境的动作维度
   hidden_dim = 128
   batch_size = 64
   buffer_capacity = 100000
   episodes = 100
   # 假设我们有一个预先收集的动作集合
   # 在实际应用中，这应该从离线数据集中收集
   action_set = np.array([[0], [1]])  # 对于CartPole的离散动作空间
   # 初始化BCQ算法和经验回放缓冲区
   bcq = BCQ(state_dim, action_dim, action_set, hidden_dim)
   buffer = ReplayBuffer(buffer_capacity)
   # 这里应该加载离线数据集到buffer中
   # 为了演示，我们只添加一些随机数据
   for _ in range(1000):
       state = np.random.randn(state_dim)
       action = np.random.choice(action_dim)
       next_state = np.random.randn(state_dim)
       reward = np.random.randn()
       done = np.random.choice([True, False])
       buffer.push(state, action, next_state, reward, done)
   # 训练BCQ算法
   for episode in range(episodes):
       if len(buffer) < batch_size:
           continue
       batch = buffer.sample(batch_size)
       q_loss, policy_loss = bcq.update(batch)
       if episode % 10 == 0:
           print(f"Episode {episode}, Q Loss: {q_loss:.4f}, Policy Loss: {policy
print("BCQ训练完成！")
```

上面的 BCQ 算法实现包含以下几个核心部分：

1. ReplayBuffer：用于存储离线数据集，支持样本的添加和随机采样。

2. QNetwork：用于估计状态 - 动作价值，采用了三层全连接网络结构。

3. Actor：策略网络，用于生成目标动作，并从给定的动作集中选择最接近目标动作的实际动作。

4. BCQ 主类：实现了 BCQ 算法的核心逻辑，包括动作选择和网络更新。

BCQ 算法的关键特点是：它使用一个固定的动作集合（从离线数据集中收集），并通过策略网络从这个集合中选择动作，而不是直接生成全新的动作。这种方法确保了算法只使用数据集中存在的动作类型，提高了离线强化学习的稳定性和安全性。

## 优势与应用场景

BCQ 算法凭借其独特的设计思路与技术架构，在诸多方面展现出了显著优势，这些优势也进一步拓展了其在不同领域的应用可能性。无论是面对复杂多变的任务环境，还是在数据获取受限的情况下，BCQ 算法都有其用武之地。接下来，我们将深入探讨 BCQ 算法的优势以及丰富多样的应用场景。

### 优势

在克服外推误差方面，BCQ 展现出卓越性能：通过精准限制动作空间范围与科学设计训练目标函数，该方法能显著降低策略学习中的外推偏差，让智能体从离线数据中习得的决策模型具备更高的可靠性与环境泛化能力，有效规避了传统方法在数据分布外区域的决策风险。​

无需实时在线交互： 这是 BCQ 的核心优势之一。这一特性使其能在无法进行动态环境交互的场景中高效落地，尤其适用于医疗诊断、金融风控等对安全性要求极高的领域。通过摆脱对在线探索的依赖，BCQ 不仅大幅降低了实际应用中的试错风险，更显著减少了反复交互带来的时间成本与资源消耗。​

BCQ 在数据适应性上表现突出：其学习机制不仅支持从高质量专家演示数据中直接汲取最优策略，还能从有限批次的非最优数据中精准挖掘有效决策信息。这种强大的数据使用能力极大拓宽了可用数据的来源渠道，打破了对纯专家数据的依赖限制，进一步扩展了技术的实际应用场景。​

### 应用场景

- 机器人控制：在物理机器人实验中，减少实际操作次数可以极大降低硬件损耗和实验成本。例如，在机器人手臂抓取任务中，利用 BCQ 基于历史操作数据进行训练，机器人能够学习到高效、准确的抓取策略，避免在实际操作中因频繁试错而损坏设备。

- 医疗决策系统：医疗数据珍贵且有限，BCQ 可以基于这些有限的临床数据，最大程度优化病患治疗策略。例如，根据历史病例数据，为不同病情的患者制定个性化的治疗方案，提高治疗效果和安全性。

- 金融交易：基于历史交易数据训练模型，BCQ 能够帮助投资者制定交易策略，避免实时市场互动带来的潜在损失。例如，通过分析过去的股票交易数据，预测市场趋势，确定最佳的买卖时机，降低投资风险。

- 自动驾驶：在模拟环境中预先大规模训练，BCQ 可以利用大量的模拟驾驶数据，训练自动驾驶汽车的决策模型，减少真实世界测试的风险。例如，让自动驾驶汽车在虚拟的城市道路环境中学习各种路况下的驾驶策略，提高在实际道路上行驶的安全性和稳定性。

关于 BCQ 的讲解就到这里，下节课我们将探讨离线强化学习领域中的另一个重要算法：CQL。总结在完整学习离线强化学习后进行。敬请期待！

希望你通过今天的学习，对强化学习有了清晰的认识。如果有任何疑问，欢迎在讨论区留言交流！
