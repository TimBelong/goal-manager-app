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
import { GoalCard } from './GoalCard';
import { useTheme } from '../contexts/ThemeContext';
import type { Goal } from '../types';
import { getCurrentYear } from '../types';
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
}: YearSectionProps) {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(year === getCurrentYear());

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => getProgress(g) === 100).length;
  const overallProgress = totalGoals > 0
    ? Math.round(goals.reduce((sum, g) => sum + getProgress(g), 0) / totalGoals)
    : 0;

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
                Текущий
              </Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
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
                Нет целей на {year} год
              </Text>
            </View>
          ) : (
            goals.map((goal) => (
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
              />
            ))
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
  stats: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: fontSize.sm,
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
    // Goals list
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.md,
  },
});
