import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.resolve(__dirname, 'cognitive-os.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// --------------- Schema ---------------

db.exec(`
  CREATE TABLE IF NOT EXISTS energy_logs (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    sleepStart TEXT NOT NULL DEFAULT '',
    sleepEnd TEXT NOT NULL DEFAULT '',
    physicalState TEXT NOT NULL,
    mentalClarity INTEGER NOT NULL,
    stressLevel INTEGER NOT NULL,
    deepWorkDone INTEGER NOT NULL DEFAULT 0,
    notes TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    track TEXT NOT NULL,
    stage TEXT NOT NULL,
    depthScore INTEGER NOT NULL DEFAULT 0,
    expectedOutput TEXT NOT NULL DEFAULT '',
    killCriteria TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    importance INTEGER,
    focusTime TEXT
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    energyRequired TEXT NOT NULL,
    bestTime TEXT NOT NULL,
    pipelineId TEXT,
    date TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS parking_lot_items (
    id TEXT PRIMARY KEY,
    idea TEXT NOT NULL,
    category TEXT NOT NULL,
    urgency TEXT NOT NULL,
    linkedTrack TEXT,
    reviewWeek TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS weekly_plan (
    key TEXT PRIMARY KEY DEFAULT 'current',
    focus1 TEXT NOT NULL DEFAULT '',
    focus2 TEXT NOT NULL DEFAULT '',
    mon TEXT NOT NULL DEFAULT '',
    tue TEXT NOT NULL DEFAULT '',
    wed TEXT NOT NULL DEFAULT '',
    thu TEXT NOT NULL DEFAULT '',
    fri TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS info_items (
    id TEXT PRIMARY KEY,
    source TEXT NOT NULL DEFAULT '',
    tier INTEGER NOT NULL,
    rawInput TEXT NOT NULL DEFAULT '',
    frameworkId TEXT,
    outputType TEXT,
    outputContent TEXT,
    linkedProjectId TEXT,
    linkedTrack TEXT,
    date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'blocked'
  );

  CREATE TABLE IF NOT EXISTS frameworks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS reflections (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    trigger TEXT NOT NULL DEFAULT '',
    insight TEXT NOT NULL DEFAULT '',
    principle TEXT,
    linkedProjectId TEXT,
    linkedPeople TEXT,
    weight TEXT NOT NULL DEFAULT 'Notable'
  );

  CREATE TABLE IF NOT EXISTS strategy_signals (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL,
    permissionLevel INTEGER NOT NULL,
    repeatedCount INTEGER NOT NULL DEFAULT 1,
    evidence TEXT NOT NULL DEFAULT '',
    decision TEXT NOT NULL DEFAULT 'pending',
    decisionNote TEXT,
    linkedInfoId TEXT,
    linkedHypothesisId TEXT
  );

  CREATE TABLE IF NOT EXISTS strategy_hypotheses (
    id TEXT PRIMARY KEY,
    statement TEXT NOT NULL,
    domain TEXT NOT NULL,
    confidence INTEGER NOT NULL DEFAULT 50,
    evidenceFor TEXT NOT NULL DEFAULT '',
    evidenceAgainst TEXT NOT NULL DEFAULT '',
    lastReviewed TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS strategy_reviews (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    cadence TEXT NOT NULL,
    worldModelDelta TEXT NOT NULL DEFAULT '',
    signalsProcessed TEXT NOT NULL DEFAULT '[]',
    hypothesesUpdated TEXT NOT NULL DEFAULT '[]',
    decision TEXT NOT NULL,
    notes TEXT NOT NULL DEFAULT ''
  );
`);

// Migrate older energy_logs schemas that still have sleepHours but lack
// sleepStart / sleepEnd. SQLite has no IF NOT EXISTS for ADD COLUMN, so we
// inspect the column list once.
{
  const cols = (db.prepare(`PRAGMA table_info(energy_logs)`).all() as { name: string }[]).map(c => c.name);
  if (!cols.includes('sleepStart')) db.exec(`ALTER TABLE energy_logs ADD COLUMN sleepStart TEXT NOT NULL DEFAULT ''`);
  if (!cols.includes('sleepEnd'))   db.exec(`ALTER TABLE energy_logs ADD COLUMN sleepEnd TEXT NOT NULL DEFAULT ''`);
}

// --------------- Types (matching frontend) ---------------

interface EnergyLog {
  id: string; date: string; sleepStart: string; sleepEnd: string; physicalState: string;
  mentalClarity: number; stressLevel: number; deepWorkDone: boolean; notes: string;
}

interface PipelineProject {
  id: string; title: string; track: string; stage: string; depthScore: number;
  expectedOutput: string; killCriteria: string; notes: string;
  importance?: number; focusTime?: string;
}

interface Task {
  id: string; title: string; energyRequired: string; bestTime: string;
  pipelineId?: string; date: string; completed: boolean;
}

interface ParkingLotItem {
  id: string; idea: string; category: string; urgency: string;
  linkedTrack?: string; reviewWeek: string;
}

interface WeeklyPlan {
  focus1: string; focus2: string;
  mon: string; tue: string; wed: string; thu: string; fri: string;
}

interface InfoItem {
  id: string; source: string; tier: number; rawInput: string;
  frameworkId?: string; outputType?: string; outputContent?: string;
  linkedProjectId?: string; linkedTrack?: string;
  date: string; status: string;
}

interface Framework {
  id: string; name: string; description: string;
}

interface Reflection {
  id: string; date: string; category: string;
  trigger: string; insight: string;
  principle?: string; linkedProjectId?: string; linkedPeople?: string;
  weight: string;
}

interface StrategySignal {
  id: string; date: string; source: string; description: string;
  category: string; permissionLevel: number; repeatedCount: number;
  evidence: string; decision: string; decisionNote?: string;
  linkedInfoId?: string; linkedHypothesisId?: string;
}

interface StrategyHypothesis {
  id: string; statement: string; domain: string; confidence: number;
  evidenceFor: string; evidenceAgainst: string; lastReviewed: string; status: string;
}

interface StrategyReview {
  id: string; date: string; cadence: string; worldModelDelta: string;
  signalsProcessed: string[]; hypothesesUpdated: string[];
  decision: string; notes: string;
}

interface AppData {
  energyLogs: EnergyLog[];
  projects: PipelineProject[];
  tasks: Task[];
  parkingLotItems: ParkingLotItem[];
  weeklyPlan: WeeklyPlan | null;
  infoItems: InfoItem[];
  frameworks: Framework[];
  reflections: Reflection[];
  strategySignals: StrategySignal[];
  strategyHypotheses: StrategyHypothesis[];
  strategyReviews: StrategyReview[];
}

// --------------- Helpers ---------------

function boolToInt(v: boolean): number { return v ? 1 : 0; }
function intToBool(v: number): boolean { return v === 1; }

// --------------- Read ---------------

export function getAllData(): AppData {
  const energyLogs = db.prepare('SELECT * FROM energy_logs ORDER BY date DESC').all().map((row: any) => ({
    ...row,
    deepWorkDone: intToBool(row.deepWorkDone),
  })) as EnergyLog[];

  const projects = db.prepare('SELECT * FROM projects').all() as PipelineProject[];

  const tasks = db.prepare('SELECT * FROM tasks ORDER BY date DESC').all().map((row: any) => ({
    ...row,
    completed: intToBool(row.completed),
  })) as Task[];

  const parkingLotItems = db.prepare('SELECT * FROM parking_lot_items').all() as ParkingLotItem[];

  const planRow = db.prepare('SELECT * FROM weekly_plan WHERE key = ?').get('current') as any;
  const weeklyPlan: WeeklyPlan | null = planRow
    ? { focus1: planRow.focus1, focus2: planRow.focus2, mon: planRow.mon, tue: planRow.tue, wed: planRow.wed, thu: planRow.thu, fri: planRow.fri }
    : null;

  const infoItems = db.prepare('SELECT * FROM info_items ORDER BY date DESC').all() as InfoItem[];
  const frameworks = db.prepare('SELECT * FROM frameworks ORDER BY name ASC').all() as Framework[];
  const reflections = db.prepare('SELECT * FROM reflections ORDER BY date DESC').all() as Reflection[];

  const strategySignals = db.prepare('SELECT * FROM strategy_signals ORDER BY date DESC').all() as StrategySignal[];
  const strategyHypotheses = db.prepare('SELECT * FROM strategy_hypotheses ORDER BY lastReviewed DESC').all() as StrategyHypothesis[];
  const strategyReviews = db.prepare('SELECT * FROM strategy_reviews ORDER BY date DESC').all().map((row: any) => ({
    ...row,
    signalsProcessed: safeJsonParseArray(row.signalsProcessed),
    hypothesesUpdated: safeJsonParseArray(row.hypothesesUpdated),
  })) as StrategyReview[];

  return {
    energyLogs, projects, tasks, parkingLotItems, weeklyPlan,
    infoItems, frameworks, reflections,
    strategySignals, strategyHypotheses, strategyReviews,
  };
}

function safeJsonParseArray(s: unknown): string[] {
  if (typeof s !== 'string') return [];
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

// --------------- Write (batch replace all) ---------------

const insertEnergyLog = db.prepare(`
  INSERT OR REPLACE INTO energy_logs (id, date, sleepStart, sleepEnd, physicalState, mentalClarity, stressLevel, deepWorkDone, notes)
  VALUES (@id, @date, @sleepStart, @sleepEnd, @physicalState, @mentalClarity, @stressLevel, @deepWorkDone, @notes)
`);

const insertProject = db.prepare(`
  INSERT OR REPLACE INTO projects (id, title, track, stage, depthScore, expectedOutput, killCriteria, notes, importance, focusTime)
  VALUES (@id, @title, @track, @stage, @depthScore, @expectedOutput, @killCriteria, @notes, @importance, @focusTime)
`);

const insertTask = db.prepare(`
  INSERT OR REPLACE INTO tasks (id, title, energyRequired, bestTime, pipelineId, date, completed)
  VALUES (@id, @title, @energyRequired, @bestTime, @pipelineId, @date, @completed)
`);

const insertParkingLotItem = db.prepare(`
  INSERT OR REPLACE INTO parking_lot_items (id, idea, category, urgency, linkedTrack, reviewWeek)
  VALUES (@id, @idea, @category, @urgency, @linkedTrack, @reviewWeek)
`);

const upsertWeeklyPlan = db.prepare(`
  INSERT OR REPLACE INTO weekly_plan (key, focus1, focus2, mon, tue, wed, thu, fri)
  VALUES ('current', @focus1, @focus2, @mon, @tue, @wed, @thu, @fri)
`);

const insertInfoItem = db.prepare(`
  INSERT OR REPLACE INTO info_items
    (id, source, tier, rawInput, frameworkId, outputType, outputContent, linkedProjectId, linkedTrack, date, status)
  VALUES
    (@id, @source, @tier, @rawInput, @frameworkId, @outputType, @outputContent, @linkedProjectId, @linkedTrack, @date, @status)
`);

const insertFramework = db.prepare(`
  INSERT OR REPLACE INTO frameworks (id, name, description)
  VALUES (@id, @name, @description)
`);

const insertReflection = db.prepare(`
  INSERT OR REPLACE INTO reflections
    (id, date, category, trigger, insight, principle, linkedProjectId, linkedPeople, weight)
  VALUES
    (@id, @date, @category, @trigger, @insight, @principle, @linkedProjectId, @linkedPeople, @weight)
`);

const insertStrategySignal = db.prepare(`
  INSERT OR REPLACE INTO strategy_signals
    (id, date, source, description, category, permissionLevel, repeatedCount, evidence,
     decision, decisionNote, linkedInfoId, linkedHypothesisId)
  VALUES
    (@id, @date, @source, @description, @category, @permissionLevel, @repeatedCount, @evidence,
     @decision, @decisionNote, @linkedInfoId, @linkedHypothesisId)
`);

const insertStrategyHypothesis = db.prepare(`
  INSERT OR REPLACE INTO strategy_hypotheses
    (id, statement, domain, confidence, evidenceFor, evidenceAgainst, lastReviewed, status)
  VALUES
    (@id, @statement, @domain, @confidence, @evidenceFor, @evidenceAgainst, @lastReviewed, @status)
`);

const insertStrategyReview = db.prepare(`
  INSERT OR REPLACE INTO strategy_reviews
    (id, date, cadence, worldModelDelta, signalsProcessed, hypothesesUpdated, decision, notes)
  VALUES
    (@id, @date, @cadence, @worldModelDelta, @signalsProcessed, @hypothesesUpdated, @decision, @notes)
`);

export function saveAllData(data: AppData): void {
  const transaction = db.transaction(() => {
    // Clear existing data and re-insert (simple full-replace strategy)
    db.prepare('DELETE FROM energy_logs').run();
    db.prepare('DELETE FROM projects').run();
    db.prepare('DELETE FROM tasks').run();
    db.prepare('DELETE FROM parking_lot_items').run();
    db.prepare('DELETE FROM info_items').run();
    db.prepare('DELETE FROM frameworks').run();
    db.prepare('DELETE FROM reflections').run();
    db.prepare('DELETE FROM strategy_signals').run();
    db.prepare('DELETE FROM strategy_hypotheses').run();
    db.prepare('DELETE FROM strategy_reviews').run();

    for (const log of data.energyLogs) {
      insertEnergyLog.run({
        ...log,
        sleepStart: log.sleepStart ?? '',
        sleepEnd: log.sleepEnd ?? '',
        deepWorkDone: boolToInt(log.deepWorkDone),
      });
    }
    for (const project of data.projects) {
      insertProject.run({
        ...project,
        importance: project.importance ?? null,
        focusTime: project.focusTime ?? null,
      });
    }
    for (const task of data.tasks) {
      insertTask.run({
        ...task,
        pipelineId: task.pipelineId ?? null,
        completed: boolToInt(task.completed),
      });
    }
    for (const item of data.parkingLotItems) {
      insertParkingLotItem.run({
        ...item,
        linkedTrack: item.linkedTrack ?? null,
      });
    }
    if (data.weeklyPlan) {
      upsertWeeklyPlan.run(data.weeklyPlan);
    }
    for (const item of data.infoItems ?? []) {
      insertInfoItem.run({
        ...item,
        frameworkId: item.frameworkId ?? null,
        outputType: item.outputType ?? null,
        outputContent: item.outputContent ?? null,
        linkedProjectId: item.linkedProjectId ?? null,
        linkedTrack: item.linkedTrack ?? null,
      });
    }
    for (const fw of data.frameworks ?? []) {
      insertFramework.run(fw);
    }
    for (const r of data.reflections ?? []) {
      insertReflection.run({
        ...r,
        principle: r.principle ?? null,
        linkedProjectId: r.linkedProjectId ?? null,
        linkedPeople: r.linkedPeople ?? null,
      });
    }
    for (const s of data.strategySignals ?? []) {
      insertStrategySignal.run({
        ...s,
        decisionNote: s.decisionNote ?? null,
        linkedInfoId: s.linkedInfoId ?? null,
        linkedHypothesisId: s.linkedHypothesisId ?? null,
      });
    }
    for (const h of data.strategyHypotheses ?? []) {
      insertStrategyHypothesis.run(h);
    }
    for (const r of data.strategyReviews ?? []) {
      insertStrategyReview.run({
        ...r,
        signalsProcessed: JSON.stringify(r.signalsProcessed ?? []),
        hypothesesUpdated: JSON.stringify(r.hypothesesUpdated ?? []),
      });
    }
  });

  transaction();
}

export function closeDb(): void {
  db.close();
}
