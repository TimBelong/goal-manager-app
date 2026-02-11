import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import type { Goal, GoalType, GoalCategory, DailyActivity, Month, Task, SubGoal } from '../types';
import { getCurrentYear } from '../types';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Custom animation config for smoother list updates
const layoutAnimConfig = {
    duration: 250,
    create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
    },
    update: {
        type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
    },
};

// Generate temporary ID for optimistic updates
const generateTempId = () => `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

interface GoalsContextType {
    goals: Goal[];
    dailyActivity: DailyActivity[];
    years: number[];
    goalsByYear: Record<number, Goal[]>;
    isLoading: boolean;
    addGoal: (title: string, description: string, type: GoalType, category: GoalCategory, year?: number, targetAmount?: number, currentAmount?: number) => Promise<Goal>;
    updateGoal: (goalId: string, title: string, description: string, category: GoalCategory, targetAmount?: number, currentAmount?: number) => Promise<Goal>;
    updateSavingsAmount: (goalId: string, delta: number) => Promise<void>;
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

    const addGoal = useCallback(async (title: string, description: string, type: GoalType, category: GoalCategory, year?: number, targetAmount?: number, currentAmount?: number) => {
        // Optimistic update
        const tempId = generateTempId();
        const tempGoal: Goal = {
            id: tempId,
            title,
            description,
            type,
            category,
            year: year ?? getCurrentYear(),
            targetAmount,
            currentAmount: currentAmount ?? 0,
            createdAt: new Date().toISOString(),
            ...(type === 'plan' ? { plan: { id: tempId, months: [] } } : type === 'subgoals' ? { subGoals: [] } : {}),
        };

        const listId = "goals-list"; // Should ideally be unique per list but we only have one main list
        // LayoutAnimation.configureNext(layoutAnimConfig); // Removing this might reduce jumpiness if issues arise
        setGoals((prev) => [tempGoal, ...prev]);

        try {
            const newGoal = await api.createGoal(title, description, type, category, year, targetAmount, currentAmount);
            // Replace temp goal with real one
            setGoals((prev) => prev.map((g) => (g.id === tempId ? newGoal : g)));
            return newGoal;
        } catch (error) {
            // Rollback on error
            LayoutAnimation.configureNext(layoutAnimConfig);
            setGoals((prev) => prev.filter((g) => g.id !== tempId));
            console.error('Failed to add goal:', error);
            throw error;
        }
    }, []);

    const updateGoal = useCallback(async (goalId: string, title: string, description: string, category: GoalCategory, targetAmount?: number, currentAmount?: number) => {
        // Store original for rollback
        let originalGoal: Goal | undefined;

        // Optimistic update
        setGoals((prev) =>
            prev.map((g) => {
                if (g.id === goalId) {
                    originalGoal = g;
                    return { ...g, title, description, category, targetAmount, currentAmount: currentAmount ?? g.currentAmount };
                }
                return g;
            })
        );

        try {
            const updatedGoal = await api.updateGoal(goalId, title, description, category, targetAmount, currentAmount);
            // Sync with server response
            setGoals((prev) =>
                prev.map((g) => (g.id === goalId ? updatedGoal : g))
            );
            return updatedGoal;
        } catch (error) {
            // Rollback on error
            if (originalGoal) {
                setGoals((prev) =>
                    prev.map((g) => (g.id === goalId ? originalGoal! : g))
                );
            }
            console.error('Failed to update goal:', error);
            throw error;
        }
    }, []);

    const updateSavingsAmount = useCallback(async (goalId: string, delta: number) => {
        const goal = goals.find(g => g.id === goalId);
        if (!goal || goal.type !== 'savings') return;

        const originalGoal = goal;
        const newAmount = (goal.currentAmount || 0) + delta;

        // Optimistic update
        setGoals((prev) =>
            prev.map((g) => {
                if (g.id === goalId) {
                    return { ...g, currentAmount: newAmount };
                }
                return g;
            })
        );

        try {
            // We need to pass all fields to updateGoal currently
            // Ideally API should support PATCH for amount only
            await api.updateGoal(goal.id, goal.title, goal.description || '', goal.category, goal.targetAmount, newAmount);

            // Refresh activity if amount increased (optional gamification)
            if (delta > 0) {
                const analytics = await api.getAnalytics();
                setDailyActivity(analytics.activity);
            }
        } catch (error) {
            // Rollback
            setGoals((prev) =>
                prev.map((g) => (g.id === goalId ? originalGoal : g))
            );
            console.error('Failed to update savings amount:', error);
            throw error;
        }
    }, [goals]);

    const deleteGoal = useCallback(async (goalId: string) => {
        // Store for rollback
        let deletedGoal: Goal | undefined;

        // Optimistic update
        LayoutAnimation.configureNext(layoutAnimConfig);
        setGoals((prev) => {
            deletedGoal = prev.find((g) => g.id === goalId);
            return prev.filter((g) => g.id !== goalId);
        });

        try {
            await api.deleteGoal(goalId);
        } catch (error) {
            // Rollback on error
            if (deletedGoal) {
                LayoutAnimation.configureNext(layoutAnimConfig);
                setGoals((prev) => [deletedGoal!, ...prev]);
            }
            console.error('Failed to delete goal:', error);
            throw error;
        }
    }, []);

    const addMonth = useCallback(async (goalId: string, monthName: string, monthOrder: number) => {
        // Optimistic update
        const tempId = generateTempId();
        const tempMonth: Month = {
            id: tempId,
            name: monthName,
            order: monthOrder,
            tasks: [],
        };

        LayoutAnimation.configureNext(layoutAnimConfig);
        setGoals((prev) =>
            prev.map((goal) => {
                if (goal.id === goalId && goal.plan) {
                    return {
                        ...goal,
                        plan: {
                            ...goal.plan,
                            months: [...goal.plan.months, tempMonth].sort((a, b) => a.order - b.order),
                        },
                    };
                }
                return goal;
            })
        );

        try {
            const newMonth = await api.addMonth(goalId, monthName, monthOrder);
            // Replace temp month with real one
            setGoals((prev) =>
                prev.map((goal) => {
                    if (goal.id === goalId && goal.plan) {
                        return {
                            ...goal,
                            plan: {
                                ...goal.plan,
                                months: goal.plan.months.map((m) => (m.id === tempId ? newMonth : m)),
                            },
                        };
                    }
                    return goal;
                })
            );
        } catch (error) {
            // Rollback on error
            LayoutAnimation.configureNext(layoutAnimConfig);
            setGoals((prev) =>
                prev.map((goal) => {
                    if (goal.id === goalId && goal.plan) {
                        return {
                            ...goal,
                            plan: {
                                ...goal.plan,
                                months: goal.plan.months.filter((m) => m.id !== tempId),
                            },
                        };
                    }
                    return goal;
                })
            );
            console.error('Failed to add month:', error);
            throw error;
        }
    }, []);

    const deleteMonth = useCallback(async (goalId: string, monthId: string) => {
        // Store for rollback
        let deletedMonth: Month | undefined;

        // Optimistic update
        LayoutAnimation.configureNext(layoutAnimConfig);
        setGoals((prev) =>
            prev.map((goal) => {
                if (goal.id === goalId && goal.plan) {
                    deletedMonth = goal.plan.months.find((m) => m.id === monthId);
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

        try {
            await api.deleteMonth(goalId, monthId);
        } catch (error) {
            // Rollback on error
            if (deletedMonth) {
                LayoutAnimation.configureNext(layoutAnimConfig);
                setGoals((prev) =>
                    prev.map((goal) => {
                        if (goal.id === goalId && goal.plan) {
                            return {
                                ...goal,
                                plan: {
                                    ...goal.plan,
                                    months: [...goal.plan.months, deletedMonth!].sort((a, b) => a.order - b.order),
                                },
                            };
                        }
                        return goal;
                    })
                );
            }
            console.error('Failed to delete month:', error);
            throw error;
        }
    }, []);

    const addTask = useCallback(async (goalId: string, monthId: string, text: string) => {
        // Optimistic update
        const tempId = generateTempId();
        const tempTask: Task = {
            id: tempId,
            text,
            completed: false,
        };

        LayoutAnimation.configureNext(layoutAnimConfig);
        setGoals((prev) =>
            prev.map((goal) => {
                if (goal.id === goalId && goal.plan) {
                    return {
                        ...goal,
                        plan: {
                            ...goal.plan,
                            months: goal.plan.months.map((month) => {
                                if (month.id === monthId) {
                                    return { ...month, tasks: [...month.tasks, tempTask] };
                                }
                                return month;
                            }),
                        },
                    };
                }
                return goal;
            })
        );

        try {
            const newTask = await api.addTask(goalId, monthId, text);
            // Replace temp task with real one
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
                                            tasks: month.tasks.map((t) => (t.id === tempId ? newTask : t)),
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
            // Rollback on error
            LayoutAnimation.configureNext(layoutAnimConfig);
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
                                            tasks: month.tasks.filter((t) => t.id !== tempId),
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
            console.error('Failed to add task:', error);
            throw error;
        }
    }, []);

    const toggleTask = useCallback(async (goalId: string, _monthId: string, taskId: string) => {
        // Store original state for rollback
        let originalCompleted: boolean | undefined;

        // Optimistic update
        setGoals((prev) =>
            prev.map((goal) => {
                if (goal.id === goalId && goal.plan) {
                    return {
                        ...goal,
                        plan: {
                            ...goal.plan,
                            months: goal.plan.months.map((month) => ({
                                ...month,
                                tasks: month.tasks.map((task) => {
                                    if (task.id === taskId) {
                                        originalCompleted = task.completed;
                                        return { ...task, completed: !task.completed };
                                    }
                                    return task;
                                }),
                            })),
                        },
                    };
                }
                return goal;
            })
        );

        try {
            const updatedTask = await api.toggleTask(goalId, taskId);
            // Sync with server response
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
            // Rollback on error
            if (originalCompleted !== undefined) {
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
                                            task.id === taskId ? { ...task, completed: originalCompleted! } : task
                                        ),
                                    })),
                                },
                            };
                        }
                        return goal;
                    })
                );
            }
            console.error('Failed to toggle task:', error);
            throw error;
        }
    }, []);

    const deleteTask = useCallback(async (goalId: string, monthId: string, taskId: string) => {
        // Store for rollback
        let deletedTask: Task | undefined;

        // Optimistic update
        LayoutAnimation.configureNext(layoutAnimConfig);
        setGoals((prev) =>
            prev.map((goal) => {
                if (goal.id === goalId && goal.plan) {
                    return {
                        ...goal,
                        plan: {
                            ...goal.plan,
                            months: goal.plan.months.map((month) => {
                                if (month.id === monthId) {
                                    deletedTask = month.tasks.find((t) => t.id === taskId);
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

        try {
            await api.deleteTask(goalId, monthId, taskId);
        } catch (error) {
            // Rollback on error
            if (deletedTask) {
                LayoutAnimation.configureNext(layoutAnimConfig);
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
                                                tasks: [...month.tasks, deletedTask!],
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
            }
            console.error('Failed to delete task:', error);
            throw error;
        }
    }, []);

    const addSubGoal = useCallback(async (goalId: string, text: string) => {
        // Optimistic update
        const tempId = generateTempId();
        const tempSubGoal: SubGoal = {
            id: tempId,
            text,
            completed: false,
        };

        LayoutAnimation.configureNext(layoutAnimConfig);
        setGoals((prev) =>
            prev.map((goal) => {
                if (goal.id === goalId && goal.subGoals) {
                    return { ...goal, subGoals: [...goal.subGoals, tempSubGoal] };
                }
                return goal;
            })
        );

        try {
            const newSubGoal = await api.addSubGoal(goalId, text);
            // Replace temp subgoal with real one
            setGoals((prev) =>
                prev.map((goal) => {
                    if (goal.id === goalId && goal.subGoals) {
                        return {
                            ...goal,
                            subGoals: goal.subGoals.map((sg) => (sg.id === tempId ? newSubGoal : sg)),
                        };
                    }
                    return goal;
                })
            );
        } catch (error) {
            // Rollback on error
            LayoutAnimation.configureNext(layoutAnimConfig);
            setGoals((prev) =>
                prev.map((goal) => {
                    if (goal.id === goalId && goal.subGoals) {
                        return {
                            ...goal,
                            subGoals: goal.subGoals.filter((sg) => sg.id !== tempId),
                        };
                    }
                    return goal;
                })
            );
            console.error('Failed to add subgoal:', error);
            throw error;
        }
    }, []);

    const toggleSubGoal = useCallback(async (goalId: string, subGoalId: string) => {
        // Store original state for rollback
        let originalCompleted: boolean | undefined;

        // Optimistic update
        setGoals((prev) =>
            prev.map((goal) => {
                if (goal.id === goalId && goal.subGoals) {
                    return {
                        ...goal,
                        subGoals: goal.subGoals.map((sg) => {
                            if (sg.id === subGoalId) {
                                originalCompleted = sg.completed;
                                return { ...sg, completed: !sg.completed };
                            }
                            return sg;
                        }),
                    };
                }
                return goal;
            })
        );

        try {
            const updatedSubGoal = await api.toggleSubGoal(goalId, subGoalId);
            // Sync with server response
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
            // Rollback on error
            if (originalCompleted !== undefined) {
                setGoals((prev) =>
                    prev.map((goal) => {
                        if (goal.id === goalId && goal.subGoals) {
                            return {
                                ...goal,
                                subGoals: goal.subGoals.map((sg) =>
                                    sg.id === subGoalId ? { ...sg, completed: originalCompleted! } : sg
                                ),
                            };
                        }
                        return goal;
                    })
                );
            }
            console.error('Failed to toggle subgoal:', error);
            throw error;
        }
    }, []);

    const deleteSubGoal = useCallback(async (goalId: string, subGoalId: string) => {
        // Store for rollback
        let deletedSubGoal: SubGoal | undefined;

        // Optimistic update
        LayoutAnimation.configureNext(layoutAnimConfig);
        setGoals((prev) =>
            prev.map((goal) => {
                if (goal.id === goalId && goal.subGoals) {
                    deletedSubGoal = goal.subGoals.find((sg) => sg.id === subGoalId);
                    return {
                        ...goal,
                        subGoals: goal.subGoals.filter((sg) => sg.id !== subGoalId),
                    };
                }
                return goal;
            })
        );

        try {
            await api.deleteSubGoal(goalId, subGoalId);
        } catch (error) {
            // Rollback on error
            if (deletedSubGoal) {
                LayoutAnimation.configureNext(layoutAnimConfig);
                setGoals((prev) =>
                    prev.map((goal) => {
                        if (goal.id === goalId && goal.subGoals) {
                            return {
                                ...goal,
                                subGoals: [...goal.subGoals, deletedSubGoal!],
                            };
                        }
                        return goal;
                    })
                );
            }
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
        if (goal.type === 'savings') {
            if (!goal.targetAmount || goal.targetAmount === 0) return 0;
            const progress = ((goal.currentAmount || 0) / goal.targetAmount) * 100;
            return Math.round(progress > 100 ? 100 : progress);
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
            updateSavingsAmount,
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
            updateSavingsAmount,
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
