import { useMemo } from 'react';
import type { Goal, DailyActivity } from '../types';
import { getCurrentYear } from '../types';

interface AnalyticsData {
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  totalTasks: number;
  completedTasks: number;
  overallProgress: number;
  goalProgress: Array<{
    goal: Goal;
    progress: number;
    totalTasks: number;
    completedTasks: number;
  }>;
  monthlyProgress: Array<{
    month: string;
    completed: number;
    total: number;
    percentage: number;
  }>;
}

export function useAnalytics(
  goals: Goal[],
  dailyActivity: DailyActivity[],
  getProgress: (goal: Goal) => number,
  selectedYear?: number,
  monthNames?: string[]
) {
  const year = selectedYear ?? getCurrentYear();
  const defaultMonthNames = monthNames || [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const analytics = useMemo<AnalyticsData>(() => {
    const yearGoals = goals.filter((g) => g.year === year);

    let totalTasks = 0;
    let completedTasks = 0;

    const goalProgress = yearGoals.map((goal) => {
      const progress = getProgress(goal);
      let goalTotalTasks = 0;
      let goalCompletedTasks = 0;

      if (goal.type === 'plan' && goal.plan) {
        goal.plan.months.forEach((month) => {
          goalTotalTasks += month.tasks.length;
          goalCompletedTasks += month.tasks.filter((t) => t.completed).length;
        });
      } else if (goal.type === 'subgoals' && goal.subGoals) {
        goalTotalTasks = goal.subGoals.length;
        goalCompletedTasks = goal.subGoals.filter((sg) => sg.completed).length;
      }

      totalTasks += goalTotalTasks;
      completedTasks += goalCompletedTasks;

      return {
        goal,
        progress,
        totalTasks: goalTotalTasks,
        completedTasks: goalCompletedTasks,
      };
    });

    const completedGoals = goalProgress.filter((gp) => gp.progress === 100).length;
    const inProgressGoals = goalProgress.filter((gp) => gp.progress > 0 && gp.progress < 100).length;
    const overallProgress = yearGoals.length > 0
      ? Math.round(goalProgress.reduce((sum, gp) => sum + gp.progress, 0) / yearGoals.length)
      : 0;

    // Calculate monthly progress
    const monthlyData: { completed: number; total: number }[] = defaultMonthNames.map(() => ({ completed: 0, total: 0 }));

    yearGoals.forEach((goal) => {
      if (goal.type === 'plan' && goal.plan) {
        goal.plan.months.forEach((month) => {
          const monthIndex = month.order - 1;
          if (monthIndex >= 0 && monthIndex < 12) {
            monthlyData[monthIndex].total += month.tasks.length;
            monthlyData[monthIndex].completed += month.tasks.filter((t) => t.completed).length;
          }
        });
      }
    });

    const monthlyProgress = defaultMonthNames.map((month, index) => ({
      month,
      completed: monthlyData[index].completed,
      total: monthlyData[index].total,
      percentage: monthlyData[index].total > 0
        ? Math.round((monthlyData[index].completed / monthlyData[index].total) * 100)
        : 0,
    }));

    return {
      totalGoals: yearGoals.length,
      completedGoals,
      inProgressGoals,
      totalTasks,
      completedTasks,
      overallProgress,
      goalProgress,
      monthlyProgress,
    };
  }, [goals, year, getProgress, defaultMonthNames]);

  const activityByYear = useMemo(() => {
    return dailyActivity.filter((a) => a.date.startsWith(year.toString()));
  }, [dailyActivity, year]);

  return { analytics, activityByYear, year };
}
