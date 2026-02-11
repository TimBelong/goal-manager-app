import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path, Polyline } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { MonthCard } from './MonthCard';
import { SubGoalItem } from './SubGoalItem';
import { Button, Select, ConfirmModal, InputModal, Input } from './ui';
import { useTheme } from '../contexts/ThemeContext';
import { useMonths } from '../hooks/useMonths';
import type { Goal } from '../types';
import { borderRadius, fontSize, spacing, shadow } from '../theme/styles';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Helper functions to get/set expanded state in AsyncStorage
const getExpandedState = async (goalId: string): Promise<boolean> => {
  try {
    const stored = await AsyncStorage.getItem(`goal-expanded-${goalId}`);
    return stored === 'true';
  } catch {
    return false;
  }
};

const setExpandedState = async (goalId: string, isExpanded: boolean) => {
  try {
    await AsyncStorage.setItem(`goal-expanded-${goalId}`, String(isExpanded));
  } catch {
    // Ignore storage errors
  }
};

interface GoalCardProps {
  goal: Goal;
  progress: number;
  onDelete: (goalId: string) => void;
  onEdit: (goal: Goal) => void;
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

export function GoalCard({
  goal,
  progress,
  onDelete,
  onEdit,
  onAddMonth,
  onDeleteMonth,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onAddSubGoal,
  onToggleSubGoal,
  onDeleteSubGoal,
  onUpdateSavings,
}: GoalCardProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { months } = useMonths();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddMonth, setShowAddMonth] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [showAddSubGoal, setShowAddSubGoal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [savingsInput, setSavingsInput] = useState('');

  // Load expanded state from AsyncStorage on mount
  useEffect(() => {
    getExpandedState(goal.id).then(setIsExpanded);
  }, [goal.id]);

  // Save expanded state to AsyncStorage when it changes
  useEffect(() => {
    setExpandedState(goal.id, isExpanded);
  }, [goal.id, isExpanded]);

  const usedMonthKeys = goal.plan?.months.map((m) => m.name) || [];
  const availableMonths = months.filter((m) => !usedMonthKeys.includes(m.key));

  const handleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const toggleAddMonth = (show: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowAddMonth(show);
    if (!show) setSelectedMonth('');
  };

  const handleAddMonth = () => {
    if (selectedMonth) {
      const month = months.find((m) => m.key === selectedMonth);
      if (month) {
        onAddMonth(goal.id, month.key, month.order);
        toggleAddMonth(false);
      }
    }
  };

  const handleAddSubGoal = (text: string) => {
    onAddSubGoal(goal.id, text);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(goal.id);
    setShowDeleteConfirm(false);
  };

  return (
    <View
      style={[
        styles.card,
        shadow.md,
        {
          backgroundColor: colors.bgSecondary,
          borderColor: colors.borderColor,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={handleExpand} style={styles.expandBtn}>
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
          </TouchableOpacity>

          <View style={styles.titleArea}>
            <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
              {goal.title}
            </Text>
            {goal.description && (
              <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
                {goal.description}
              </Text>
            )}
          </View>

          <View style={styles.actions}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    goal.type === 'plan' ? colors.accentPrimary + '20' : colors.accentSecondary + '20',
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color: goal.type === 'plan' ? colors.accentPrimary : goal.type === 'savings' ? colors.success : colors.accentSecondary,
                  },
                ]}
              >
                {goal.type === 'plan' ? t('analytics.plan') : goal.type === 'savings' ? (t('goals.typeSavings') || 'Копилка') : t('analytics.subgoals')}
              </Text>
            </View>
            <TouchableOpacity onPress={() => onEdit(goal)} style={styles.actionBtn}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth={2}>
                <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.actionBtn}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.danger} strokeWidth={2}>
                <Polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
              {t('goals.progress')}
            </Text>
            <Text style={[styles.progressValue, { color: colors.accentPrimary }]}>
              {goal.type === 'savings'
                ? `${goal.currentAmount || 0} / ${goal.targetAmount}`
                : `${progress}%`}
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.bgTertiary }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: colors.accentPrimary,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Expanded content */}
      {isExpanded && (
        <View style={styles.content}>
          {goal.type === 'plan' && goal.plan && (
            <>
              {goal.plan.months.map((month) => (
                <MonthCard
                  key={month.id}
                  month={month}
                  goalId={goal.id}
                  onAddTask={onAddTask}
                  onToggleTask={onToggleTask}
                  onDeleteTask={onDeleteTask}
                  onDeleteMonth={onDeleteMonth}
                />
              ))}

              {availableMonths.length > 0 &&
                (showAddMonth ? (
                  <View style={styles.addMonthForm}>
                    <Select
                      value={selectedMonth}
                      onChange={setSelectedMonth}
                      options={[
                        { value: '', label: t('goals.selectMonth'), disabled: true },
                        ...availableMonths.map((m) => ({ value: m.key, label: m.name })),
                      ]}
                      placeholder={t('goals.selectMonth')}
                    />
                    <View style={styles.addMonthActions}>
                      <Button size="sm" onPress={handleAddMonth} disabled={!selectedMonth}>
                        {t('common.add')}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onPress={() => toggleAddMonth(false)}
                      >
                        {t('common.cancel')}
                      </Button>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => toggleAddMonth(true)} style={styles.addBtn}>
                    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.accentPrimary} strokeWidth={2}>
                      <Path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </Svg>
                    <Text style={[styles.addBtnText, { color: colors.accentPrimary }]}>
                      {t('goals.addMonth')}
                    </Text>
                  </TouchableOpacity>
                ))}
            </>
          )}

          {goal.type === 'subgoals' && goal.subGoals && (
            <>
              {goal.subGoals.map((subGoal) => (
                <SubGoalItem
                  key={subGoal.id}
                  subGoal={subGoal}
                  onToggle={() => onToggleSubGoal(goal.id, subGoal.id)}
                  onDelete={() => onDeleteSubGoal(goal.id, subGoal.id)}
                />
              ))}

              <TouchableOpacity onPress={() => setShowAddSubGoal(true)} style={styles.addBtn}>
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.accentPrimary} strokeWidth={2}>
                  <Path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </Svg>
                <Text style={[styles.addBtnText, { color: colors.accentPrimary }]}>
                  {t('goals.addSubgoal')}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {goal.type === 'savings' && (
        <View style={styles.savingsContainer}>
          <Text style={[styles.savingsLabel, { color: colors.textSecondary }]}>
            {t('goals.addFunds') || 'Добавить/Снять средства'}
          </Text>
          <View style={styles.savingsControls}>
            <Button
              size="sm"
              variant="ghost" // Using ghost but maybe outline is better if exists, or custom
              style={[styles.savingsBtn, { borderColor: colors.danger, borderWidth: 1 }]}
              textStyle={{ color: colors.danger }}
              disabled={!savingsInput}
              onPress={() => {
                const val = parseFloat(savingsInput);
                if (val > 0) {
                  onUpdateSavings(goal.id, -val);
                  setSavingsInput('');
                }
              }}
            >
              -
            </Button>
            <View style={[styles.savingsInputWrapper, { backgroundColor: colors.bgTertiary }]}>
              <Input
                value={savingsInput}
                onChangeText={setSavingsInput}
                placeholder="0"
                keyboardType="numeric"
                style={styles.savingsInput}
              // Simplified Input usage here, assuming Input component fits or wrapping it
              />
            </View>
            <Button
              size="sm"
              style={styles.savingsBtn}
              disabled={!savingsInput}
              onPress={() => {
                const val = parseFloat(savingsInput);
                if (val > 0) {
                  onUpdateSavings(goal.id, val);
                  setSavingsInput('');
                }
              }}
            >
              +
            </Button>
          </View>
        </View>
      )}


      <InputModal
        visible={showAddSubGoal}
        placeholder={t('goals.subgoalPlaceholder')}
        onSubmit={handleAddSubGoal}
        onClose={() => setShowAddSubGoal(false)}
      />

      <ConfirmModal
        visible={showDeleteConfirm}
        title={t('goals.deleteGoal') + '?'}
        message={t('goals.deleteGoalMessage', { title: goal.title })}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </View >
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  header: {
    padding: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  expandBtn: {
    padding: spacing.xs,
    marginTop: 2,
  },
  titleArea: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: fontSize.sm,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  actionBtn: {
    padding: spacing.xs,
  },
  progressSection: {
    marginTop: spacing.lg,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    fontSize: fontSize.sm,
  },
  progressValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  addMonthForm: {
    gap: spacing.sm,
  },
  addMonthActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  addBtnText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  savingsContainer: {
    marginTop: spacing.md,
  },
  savingsLabel: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  savingsControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  savingsBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  savingsInputWrapper: {
    flex: 1,
    borderRadius: borderRadius.md,
    height: 40,
    justifyContent: 'center',
  },
  savingsInput: {
    fontSize: fontSize.md,
    textAlign: 'center',
    height: '100%',
    paddingVertical: 0,
  },
});
