import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import type { Goal, GoalType, DailyActivity, Month, Task, SubGoal } from '../types';
import { getCurrentYear } from '../types';

interface GoalsContextType {
    goals: Goal[];
    dailyActivity: DailyActivity[];
    years: number[];
    goalsByYear: Record<number, Goal[]>;
    isLoading: boolean;
    addGoal: (title: string, description: string, type: GoalType, year?: number) => Promise<Goal>;
    updateGoal: (goalId: string, title: string, description: string) => Promise<Goal>;
    deleteGoal: (goalId: string) => Promise<void>;
    addMonth: (goalId: string, monthName: string, monthOrder: number) => Promise<void>;
    deleteMonth: (goalId: string, monthId: string) => Promise<void>;
    addTask: (goalId: string, monthId: string, text: string) => Promise<void>;
    toggleTask: (goalId: string, monthId: string, taskId: string) => Promise<void>;
    deleteTask: (goalId: string, monthId: string, taskId: string) => Promise<void>;
    addSubGoal: (goalId: string, text: string) => Promise<void>;
    toggleSubGoal: (goalId: string, subGoalId: string) => Promise<void>;
    deleteSubGoal: (goalId: string, subGoalId: string) => Promise<void>;
    getProgress: (goal: Goal) => number;
    refreshData: () => Promise<void>;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export function GoalsProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const [goalsData, analyticsData] = await Promise.all([
                api.getGoals(),
                api.getAnalytics(),
            ]);
            setGoals(goalsData);
            setDailyActivity(analyticsData.activity);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) {
            setGoals([]);
            setDailyActivity([]);
            setIsLoading(false);
            return;
        }

        fetchData();
    }, [isAuthenticated, fetchData]);

    const addGoal = useCallback(async (title: string, description: string, type: GoalType, year?: number) => {
        try {
            const newGoal = await api.createGoal(title, description, type, year);
            setGoals((prev) => [newGoal, ...prev]);
            return newGoal;
        } catch (error) {
            console.error('Failed to add goal:', error);
            throw error;
        }
    }, []);

    const updateGoal = useCallback(async (goalId: string, title: string, description: string) => {
        try {
            const updatedGoal = await api.updateGoal(goalId, title, description);
            setGoals((prev) =>
                prev.map((g) => (g.id === goalId ? updatedGoal : g))
            );
            return updatedGoal;
        } catch (error) {
            console.error('Failed to update goal:', error);
            throw error;
        }
    }, []);

    const deleteGoal = useCallback(async (goalId: string) => {
        try {
            await api.deleteGoal(goalId);
            setGoals((prev) => prev.filter((g) => g.id !== goalId));
        } catch (error) {
            console.error('Failed to delete goal:', error);
            throw error;
        }
    }, []);

    const addMonth = useCallback(async (goalId: string, monthName: string, monthOrder: number) => {
        try {
            const newMonth = await api.addMonth(goalId, monthName, monthOrder);
            setGoals((prev) =>
                prev.map((goal) => {
                    if (goal.id === goalId && goal.plan) {
                        return {
                            ...goal,
                            plan: {
                                ...goal.plan,
                                months: [...goal.plan.months, newMonth].sort((a, b) => a.order - b.order),
                            },
                        };
                    }
                    return goal;
                })
            );
        } catch (error) {
            console.error('Failed to add month:', error);
            throw error;
        }
    }, []);

    const deleteMonth = useCallback(async (goalId: string, monthId: string) => {
        try {
            await api.deleteMonth(goalId, monthId);
            setGoals((prev) =>
                prev.map((goal) => {
                    if (goal.id === goalId && goal.plan) {
                        return {
                            ...goal,
                            plan: {
                                ...goal.plan,
                                months: goal.plan.months.filter((m) => m.id !== monthId),
                            },
                        };
                    }
                    return goal;
                })
            );
        } catch (error) {
            console.error('Failed to delete month:', error);
            throw error;
        }
    }, []);

    const addTask = useCallback(async (goalId: string, monthId: string, text: string) => {
        try {
            const newTask = await api.addTask(goalId, monthId, text);
            setGoals((prev) =>
                prev.map((goal) => {
                    if (goal.id === goalId && goal.plan) {
                        return {
                            ...goal,
                            plan: {
                                ...goal.plan,
                                months: goal.plan.months.map((month) => {
                                    if (month.id === monthId) {
                                        return { ...month, tasks: [...month.tasks, newTask] };
                                    }
                                    return month;
                                }),
                            },
                        };
                    }
                    return goal;
                })
            );
        } catch (error) {
            console.error('Failed to add task:', error);
            throw error;
        }
    }, []);

    const toggleTask = useCallback(async (goalId: string, _monthId: string, taskId: string) => {
        try {
            const updatedTask = await api.toggleTask(goalId, taskId);
            setGoals((prev) =>
                prev.map((goal) => {
                    if (goal.id === goalId && goal.plan) {
                        return {
                            ...goal,
                            plan: {
                                ...goal.plan,
                                months: goal.plan.months.map((month) => ({
                                    ...month,
                                    tasks: month.tasks.map((task) =>
                                        task.id === taskId ? updatedTask : task
                                    ),
                                })),
                            },
                        };
                    }
                    return goal;
                })
            );

            // Refresh activity data after toggle
            if (updatedTask.completed) {
                const analytics = await api.getAnalytics();
                setDailyActivity(analytics.activity);
            }
        } catch (error) {
            console.error('Failed to toggle task:', error);
            throw error;
        }
    }, []);

    const deleteTask = useCallback(async (goalId: string, monthId: string, taskId: string) => {
        try {
            await api.deleteTask(goalId, monthId, taskId);
            setGoals((prev) =>
                prev.map((goal) => {
                    if (goal.id === goalId && goal.plan) {
                        return {
                            ...goal,
                            plan: {
                                ...goal.plan,
                                months: goal.plan.months.map((month) => {
                                    if (month.id === monthId) {
                                        return {
                                            ...month,
                                            tasks: month.tasks.filter((t) => t.id !== taskId),
                                        };
                                    }
                                    return month;
                                }),
                            },
                        };
                    }
                    return goal;
                })
            );
        } catch (error) {
            console.error('Failed to delete task:', error);
            throw error;
        }
    }, []);

    const addSubGoal = useCallback(async (goalId: string, text: string) => {
        try {
            const newSubGoal = await api.addSubGoal(goalId, text);
            setGoals((prev) =>
                prev.map((goal) => {
                    if (goal.id === goalId && goal.subGoals) {
                        return { ...goal, subGoals: [...goal.subGoals, newSubGoal] };
                    }
                    return goal;
                })
            );
        } catch (error) {
            console.error('Failed to add subgoal:', error);
            throw error;
        }
    }, []);

    const toggleSubGoal = useCallback(async (goalId: string, subGoalId: string) => {
        try {
            const updatedSubGoal = await api.toggleSubGoal(goalId, subGoalId);
            setGoals((prev) =>
                prev.map((goal) => {
                    if (goal.id === goalId && goal.subGoals) {
                        return {
                            ...goal,
                            subGoals: goal.subGoals.map((sg) =>
                                sg.id === subGoalId ? updatedSubGoal : sg
                            ),
                        };
                    }
                    return goal;
                })
            );

            // Refresh activity data after toggle
            if (updatedSubGoal.completed) {
                const analytics = await api.getAnalytics();
                setDailyActivity(analytics.activity);
            }
        } catch (error) {
            console.error('Failed to toggle subgoal:', error);
            throw error;
        }
    }, []);

    const deleteSubGoal = useCallback(async (goalId: string, subGoalId: string) => {
        try {
            await api.deleteSubGoal(goalId, subGoalId);
            setGoals((prev) =>
                prev.map((goal) => {
                    if (goal.id === goalId && goal.subGoals) {
                        return {
                            ...goal,
                            subGoals: goal.subGoals.filter((sg) => sg.id !== subGoalId),
                        };
                    }
                    return goal;
                })
            );
        } catch (error) {
            console.error('Failed to delete subgoal:', error);
            throw error;
        }
    }, []);

    const getProgress = useCallback((goal: Goal): number => {
        if (goal.type === 'plan' && goal.plan) {
            const allTasks = goal.plan.months.flatMap((m) => m.tasks);
            if (allTasks.length === 0) return 0;
            const completed = allTasks.filter((t) => t.completed).length;
            return Math.round((completed / allTasks.length) * 100);
        }
        if (goal.type === 'subgoals' && goal.subGoals) {
            if (goal.subGoals.length === 0) return 0;
            const completed = goal.subGoals.filter((sg) => sg.completed).length;
            return Math.round((completed / goal.subGoals.length) * 100);
        }
        return 0;
    }, []);

    // Get unique years from goals
    const years = useMemo(() => {
        const yearSet = new Set(goals.map((g) => g.year ?? getCurrentYear()));
        // Always include current year
        yearSet.add(getCurrentYear());
        return Array.from(yearSet).sort((a, b) => b - a); // descending
    }, [goals]);

    // Group goals by year
    const goalsByYear = useMemo(() => {
        const grouped: Record<number, Goal[]> = {};
        goals.forEach((goal) => {
            const year = goal.year ?? getCurrentYear();
            if (!grouped[year]) {
                grouped[year] = [];
            }
            grouped[year].push(goal);
        });
        return grouped;
    }, [goals]);

    const value = useMemo(
        () => ({
            goals,
            dailyActivity,
            years,
            goalsByYear,
            isLoading,
            addGoal,
            updateGoal,
            deleteGoal,
            addMonth,
            deleteMonth,
            addTask,
            toggleTask,
            deleteTask,
            addSubGoal,
            toggleSubGoal,
            deleteSubGoal,
            getProgress,
            refreshData: fetchData,
        }),
        [
            goals,
            dailyActivity,
            years,
            goalsByYear,
            isLoading,
            addGoal,
            updateGoal,
            deleteGoal,
            addMonth,
            deleteMonth,
            addTask,
            toggleTask,
            deleteTask,
            addSubGoal,
            toggleSubGoal,
            deleteSubGoal,
            getProgress,
            fetchData,
        ]
    );

    return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
}

export function useGoalsContext() {
    const context = useContext(GoalsContext);
    if (context === undefined) {
        throw new Error('useGoalsContext must be used within a GoalsProvider');
    }
    return context;
}
