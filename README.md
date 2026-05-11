# Cognitive OS

> A cognitive operating system for solo founders — built around bandwidth control, strategic discipline, and continuous Bayesian updating.
>
> 为独立创业者设计的认知操作系统 —— 围绕带宽控制、战略纪律和持续贝叶斯更新而构建。

**[中文](#中文) · [English](#english)**

---

## 中文

### 为什么

创业者最稀缺的不是时间，是 **认知带宽**。

大多数效率工具都在帮你"做更多"——更多任务、更多目标、更多信息源。
但真正决定成败的，是你 **不做什么** 、**不看什么** 、**不变什么** 。

Cognitive OS 是反过来设计的：

- 信息必须先过 **防火墙** 才能进入
- 战略必须通过 **权限层级** 才能改变
- 任务必须挂在 **项目** 下才能存在

目的不是更勤奋，而是 **持续正确**（compound through discipline, not brilliance）。

### 核心模块

#### 1. Information Firewall — 信息防火墙

> No output → no input

每条信息必须：

- 标记 **层级**：Tier 1 任务关键 / Tier 2 战略可选 / Tier 3 娱乐
- 压缩到一个 **认知框架**（Distribution / Retention / Leverage / …）
- 绑定一个 **输出类型**：note / judgment / decision / action / artifact

否则被标记为 **blocked**，你不能再吸入新信息。

Tier 1 每天硬上限 5 条。Tier 3 周累计被自动监控。

#### 2. Strategy — 战略层

输入和执行之间的过滤层。围绕一个核心问题：

> 什么信息值得改变战略？

包含四个子部分：

**战略权限层级（Strategic Permission Hierarchy）**

| Level | 含义 | 允许 | 禁止 |
|---|---|---|---|
| L1 | 噪音（Twitter / VC 情绪 / 热点） | 仅限好奇 | 不动 roadmap，不动 mission |
| L2 | 战术微调（onboarding / 竞品定价 / 工具变化） | 调整执行 / 功能 / 技术栈 | 不动 mission |
| L3 | 战略信号（用户行为 / 分发现实 / paradigm / regulatory / 技术断点） | 更新战略与假设 | 仅当重复、结构性证据出现时 |

**70 / 20 / 10 时间预算**

- 70% Execution-driven learning（build / ship / users / metrics）
- 20% Strategic monitoring（行业 / paradigm / competitors）
- 10% Exploratory curiosity（crazy ideas / research）

**World Model — 世界模型**

当前所有核心假设。每条带 Bayesian 置信度（0–100%），证据正负两栏。
证据进入 → 置信度更新 → 战略相应调整。

**Review 节奏**

- 每周：战术 review
- 每月：战略 review
- 每季度：世界模型更新

每天属于执行，不属于战略。

#### 3. Pipeline Board — 项目流水线

七个阶段：Idea → Defined → Researching → Doing → Testing → Done → Archived。

每个项目带：

- Depth Score（深度评分 1–10）
- **Kill Criteria**（强制写明：什么情况下放弃这个项目）
- 内嵌的子任务（任务带 energy 等级 + best time 时段）

任务不再是独立模块。如果任务不挂在项目下，那就是噪音。

#### 4. Energy Log — 能量日志

每日记录：

- 睡眠（开始 → 结束 时间）
- Physical state / Mental clarity / Stress level
- 是否完成 deep work

**自动联动**：当 Mental Clarity ≤ 5，仪表盘自动禁用所有 High Energy 任务。

#### 5. Reflection — 反思

把瞬时的领悟沉淀为 **永久原则**。

- 分类：人情世故 / 决策复盘 / 心态 / 教训 / 原则
- 权重：Fleeting / Notable / Permanent

仪表盘每日确定性地展示一条"今日原则"（从永久级反思中选取）。

#### 6. Parking Lot — 停车场

不在战略主线上的想法。每条带 review week —— 强制定期清理。

### 设计哲学

- 复利来自 **持续正确**，不是瞬间聪明
- Execution 本身是 **最高质量的信号源**
- 不获取信息会死，只获取信息也会死
- 真正重要的信号会出现两次。FOMO 是假的。

### 技术栈

- Frontend: React 19 · TypeScript · Vite · TailwindCSS 4
- Backend: Node · Express
- Storage: SQLite（better-sqlite3）
- Icons: lucide-react

### 快速开始

```bash
npm install
npm run dev
# 访问 http://localhost:3000
```

数据持久化在本地 `cognitive-os.db`（自动创建，已在 `.gitignore` 中）。

---

## English

### Why

A founder's scarcest resource isn't time — it's **cognitive bandwidth**.

Most productivity tools help you do *more*: more tasks, more goals, more inputs.
But what actually determines outcomes is what you *don't do*, *don't read*, *don't change*.

Cognitive OS is designed in reverse:

- Information must clear a **firewall** to enter
- Strategy must clear a **permission hierarchy** to change
- Tasks must attach to a **project** to exist

Not to be more disciplined. To be **persistently correct** — compounding through discipline, not brilliance.

### Modules

#### 1. Information Firewall

> No output → no input.

Every signal must be:

- Tagged with a **tier** — Tier 1 mission-critical / Tier 2 strategic-optional / Tier 3 entertainment
- Compressed into a **framework** (Distribution / Retention / Leverage / …)
- Bound to an **output** — note / judgment / decision / action / artifact

Otherwise it is marked **blocked**, and no new input can enter.

Tier 1 has a hard cap of 5 per day. Tier 3 weekly intake is monitored.

#### 2. Strategy Layer

The filter between input and execution. Built around one question:

> What information earns the right to change strategy?

**Strategic Permission Hierarchy**

| Level | Meaning | Allowed | Forbidden |
|---|---|---|---|
| L1 | Noise (Twitter / VC sentiment / hype) | Curiosity only | No roadmap or mission change |
| L2 | Tactical (friction / competitor pricing / tooling) | Adjust execution, feature, stack | No mission change |
| L3 | Strategic (user behavior / distribution reality / paradigm / regulatory / tech discontinuity) | Update strategy and hypotheses | Only on repeated, structural evidence |

**70 / 20 / 10 Allocation Budget**

- 70% execution-driven learning — build · ship · users · metrics
- 20% strategic monitoring — industry · paradigm · competitors
- 10% exploratory curiosity — crazy ideas · research

**World Model**

Active hypotheses with Bayesian confidence (0–100%), evidence-for and evidence-against fields.
Evidence in → confidence updates → strategy adjusts accordingly.

**Review Cadence**

- Weekly tactical review
- Monthly strategic review
- Quarterly world-model update

The daily layer belongs to execution, not strategy.

#### 3. Pipeline Board

Seven stages: Idea → Defined → Researching → Doing → Testing → Done → Archived.

Each project carries:

- Depth Score (1–10)
- **Kill Criteria** — required, explicit: when do you abandon this?
- Inline sub-tasks with energy level and best-time hints

Tasks are not a separate module. A task not attached to a project is noise.

#### 4. Energy Log

Daily entry:

- Sleep range — bedtime → wake time, with computed duration
- Physical state · mental clarity · stress level
- Deep-work flag

**Auto-rule**: when mental clarity ≤ 5, the dashboard restricts High-Energy tasks.

#### 5. Reflection

Captures fleeting insights and distills them into **permanent principles**.

- Category: Interpersonal / Decision / Mindset / Lesson / Principle
- Weight: Fleeting / Notable / Permanent

The dashboard surfaces a deterministic "Today's Principle" pulled from your permanent set.

#### 6. Parking Lot

Ideas that aren't on the strategic critical path. Each carries a review week — forcing periodic cleanup.

### Philosophy

- Compounding comes from **persistent correctness**, not brilliance.
- Execution is the **highest-quality information source**.
- Ignoring information will kill you. Only consuming information will kill you too.
- Important signals appear twice. FOMO is fake.

### Stack

- Frontend: React 19 · TypeScript · Vite · TailwindCSS 4
- Backend: Node · Express
- Storage: SQLite (better-sqlite3)
- Icons: lucide-react

### Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

Server-side persistence lives in local `cognitive-os.db` (auto-created, git-ignored).
