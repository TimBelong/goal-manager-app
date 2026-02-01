export interface Task {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string; // ISO date when task was completed
}

export interface Month {
  id: string;
  name: string;
  order: number;
  tasks: Task[];
}

export interface Plan {
  id: string;
  months: Month[];
}

export interface SubGoal {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string; // ISO date when subgoal was completed
}

export type GoalType = 'plan' | 'subgoals';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: GoalType;
  plan?: Plan;
  subGoals?: SubGoal[];
  createdAt: string;
  year: number; // 2025, 2026, etc.
}

export interface DailyActivity {
  date: string; // "2025-01-15"
  tasksCompleted: number;
}

// Month keys for translation - used to store and identify months
export const MONTHS_LIST = [
  { key: 'january', order: 1 },
  { key: 'february', order: 2 },
  { key: 'march', order: 3 },
  { key: 'april', order: 4 },
  { key: 'may', order: 5 },
  { key: 'june', order: 6 },
  { key: 'july', order: 7 },
  { key: 'august', order: 8 },
  { key: 'september', order: 9 },
  { key: 'october', order: 10 },
  { key: 'november', order: 11 },
  { key: 'december', order: 12 },
] as const;

export type MonthKey = (typeof MONTHS_LIST)[number]['key'];

export type Theme = 'light' | 'dark';

export const getCurrentYear = () => new Date().getFullYear();
