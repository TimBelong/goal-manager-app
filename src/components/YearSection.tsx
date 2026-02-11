import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { GoalCard } from './GoalCard';
import { useTheme } from '../contexts/ThemeContext';
import type { Goal, GoalCategory } from '../types';
import { getCurrentYear } from '../types';
import { CATEGORIES, getCategoryById } from '../constants/categories';
import { borderRadius, fontSize, spacing, shadow } from '../theme/styles';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface YearSectionProps {
  year: number;
  goals: Goal[];
  getProgress: (goal: Goal) => number;
  onDeleteGoal: (goalId: string) => void;
  onEditGoal: (goal: Goal) => void;
  onAddMonth: (goalId: string, monthName: string, monthOrder: number) => void;
  onDeleteMonth: (goalId: string, monthId: string) => void;
  onAddTask: (goalId: string, monthId: string, text: string) => void;
  onToggleTask: (goalId: string, monthId: string, taskId: string) => void;
  onDeleteTask: (goalId: string, monthId: string, taskId: string) => void;
  onAddSubGoal: (goalId: string, text: string) => void;
  onToggleSubGoal: (goalId: string, subGoalId: string) => void;
  onDeleteSubGoal: (goalId: string, subGoalId: string) => void;
  onUpdateSavings: (goalId: string, delta: number) => void;
}

export function YearSection({
  year,
  goals,
  getProgress,
  onDeleteGoal,
  onEditGoal,
  onAddMonth,
  onDeleteMonth,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onAddSubGoal,
  onToggleSubGoal,
  onDeleteSubGoal,
  onUpdateSavings,
}: YearSectionProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(year === getCurrentYear());
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (catId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => getProgress(g) === 100).length;
  const overallProgress = totalGoals > 0
    ? Math.round(goals.reduce((sum, g) => sum + getProgress(g), 0) / totalGoals)
    : 0;

  // Group goals by category
  const groupedGoals = goals.reduce((acc, goal) => {
    const cat = goal.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(goal);
    return acc;
  }, {} as Record<GoalCategory, Goal[]>);

  // Filter categories that have goals
  const activeCategories = CATEGORIES.filter(
    (c) => groupedGoals[c.id] && groupedGoals[c.id].length > 0
  );

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.section}>
      <TouchableOpacity
        onPress={handleToggle}
        activeOpacity={0.7}
        style={[
          styles.header,
          shadow.sm,
          { backgroundColor: colors.bgSecondary },
        ]}
      >
        <View style={styles.headerLeft}>
          <Svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.textSecondary}
            strokeWidth={2}
            style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}
          >
            <Polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={[styles.year, { color: colors.textPrimary }]}>{year}</Text>
          {year === getCurrentYear() && (
            <View style={[styles.currentBadge, { backgroundColor: colors.accentPrimary + '20' }]}>
              <Text style={[styles.currentBadgeText, { color: colors.accentPrimary }]}>
                {t('goals.current') || 'Текущий'}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <Text style={[styles.statsText, { color: colors.textSecondary }]}>
            {completedGoals}/{totalGoals}
          </Text>
          <View style={[styles.progressMini, { backgroundColor: colors.bgTertiary }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${overallProgress}%`,
                  backgroundColor: colors.accentPrimary,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressPercent, { color: colors.accentPrimary }]}>
            {overallProgress}%
          </Text>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {goals.length === 0 ? (
            <View style={styles.empty}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                {t('goals.noGoalsForYear', { year }) || `Нет целей на ${year} год`}
              </Text>
            </View>
          ) : (
            <View style={styles.categoriesList}>
              {activeCategories.map((category) => {
                const categoryGoals = groupedGoals[category.id];
                const isCatExpanded = expandedCategories[category.id];
                const catProgress = Math.round(
                  categoryGoals.reduce((sum, g) => sum + getProgress(g), 0) / categoryGoals.length
                );

                return (
                  <View key={category.id} style={styles.categorySection}>
                    <TouchableOpacity
                      onPress={() => toggleCategory(category.id)}
                      activeOpacity={0.7}
                      style={[
                        styles.categoryHeader,
                        {
                          backgroundColor: colors.bgSecondary,
                          borderLeftColor: category.color,
                        },
                      ]}
                    >
                      <View style={styles.catHeaderLeft}>
                        <Svg
                          width={16}
                          height={16}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={colors.textSecondary}
                          strokeWidth={2}
                          style={{ transform: [{ rotate: isCatExpanded ? '180deg' : '0deg' }] }}
                        >
                          <Polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                        <View style={styles.catIcon}>{category.icon(20)}</View>
                        <Text style={[styles.catName, { color: colors.textPrimary }]}>
                          {t(`categories.${category.id}`) || category.label}
                        </Text>
                        <View style={[styles.catCount, { backgroundColor: category.color + '20' }]}>
                          <Text style={[styles.catCountText, { color: category.color }]}>
                            {categoryGoals.length}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.catHeaderRight}>
                        <View style={[styles.catProgressBar, { backgroundColor: colors.bgTertiary }]}>
                          <View
                            style={[
                              styles.catProgressFill,
                              { width: `${catProgress}%`, backgroundColor: category.color },
                            ]}
                          />
                        </View>
                        <Text style={[styles.catProgressText, { color: category.color }]}>
                          {catProgress}%
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {isCatExpanded && (
                      <View style={styles.goalsList}>
                        {categoryGoals.map((goal) => (
                          <GoalCard
                            key={goal.id}
                            goal={goal}
                            progress={getProgress(goal)}
                            onDelete={onDeleteGoal}
                            onEdit={onEditGoal}
                            onAddMonth={onAddMonth}
                            onDeleteMonth={onDeleteMonth}
                            onAddTask={onAddTask}
                            onToggleTask={onToggleTask}
                            onDeleteTask={onDeleteTask}
                            onAddSubGoal={onAddSubGoal}
                            onToggleSubGoal={onToggleSubGoal}
                            onDeleteSubGoal={onDeleteSubGoal}
                            onUpdateSavings={onUpdateSavings}
                          />
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  year: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  currentBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.xs,
  },
  currentBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statsText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  progressMini: {
    width: 60,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPercent: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  content: {
    // Categories list
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.md,
  },
  categoriesList: {
    gap: spacing.md,
  },
  categorySection: {
    marginBottom: spacing.sm,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
  },
  catHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  catIcon: {
    width: 20,
    height: 20,
  },
  catName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    flex: 1,
  },
  catCount: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  catCountText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  catHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  catProgressBar: {
    width: 50,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  catProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  catProgressText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
  goalsList: {
    marginTop: spacing.sm,
    paddingLeft: spacing.md,
  },
});
