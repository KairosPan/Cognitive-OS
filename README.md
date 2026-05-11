# Cognitive OS



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
