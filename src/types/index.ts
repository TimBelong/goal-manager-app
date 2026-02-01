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

export const MONTHS_LIST = [
  { name: 'Январь', order: 1 },
  { name: 'Февраль', order: 2 },
  { name: 'Март', order: 3 },
  { name: 'Апрель', order: 4 },
  { name: 'Май', order: 5 },
  { name: 'Июнь', order: 6 },
  { name: 'Июль', order: 7 },
  { name: 'Август', order: 8 },
  { name: 'Сентябрь', order: 9 },
  { name: 'Октябрь', order: 10 },
  { name: 'Ноябрь', order: 11 },
  { name: 'Декабрь', order: 12 },
] as const;

export type Theme = 'light' | 'dark';

export const getCurrentYear = () => new Date().getFullYear();
