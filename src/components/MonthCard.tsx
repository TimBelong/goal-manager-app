import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { TaskItem } from './TaskItem';
import { ConfirmModal, InputModal } from './ui';
import { useTheme } from '../contexts/ThemeContext';
import type { Month } from '../types';
import { borderRadius, fontSize, spacing } from '../theme/styles';

interface MonthCardProps {
  month: Month;
  goalId: string;
  onAddTask: (goalId: string, monthId: string, text: string) => void;
  onToggleTask: (goalId: string, monthId: string, taskId: string) => void;
  onDeleteTask: (goalId: string, monthId: string, taskId: string) => void;
  onDeleteMonth: (goalId: string, monthId: string) => void;
}

export function MonthCard({
  month,
  goalId,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onDeleteMonth,
}: MonthCardProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [showAddTask, setShowAddTask] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const completedTasks = month.tasks.filter((t) => t.completed).length;
  const totalTasks = month.tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleAddTask = (text: string) => {
    onAddTask(goalId, month.id, text);
  };

  const confirmDeleteMonth = () => {
    onDeleteMonth(goalId, month.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.bgSecondary,
            borderColor: colors.borderColor,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {t(`months.${month.name}`)}
            </Text>
            <Text style={[styles.stats, { color: colors.textMuted }]}>
              {completedTasks}/{totalTasks}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowDeleteConfirm(true)}
            style={styles.deleteBtn}
          >
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth={2}>
              <Line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
              <Line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
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

        {/* Tasks */}
        <View style={styles.tasks}>
          {month.tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => onToggleTask(goalId, month.id, task.id)}
              onDelete={() => onDeleteTask(goalId, month.id, task.id)}
            />
          ))}
        </View>

        {/* Add task button */}
        <TouchableOpacity
          onPress={() => setShowAddTask(true)}
          style={styles.addTaskBtn}
        >
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.accentPrimary} strokeWidth={2}>
            <Path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </Svg>
          <Text style={[styles.addTaskText, { color: colors.accentPrimary }]}>
            {t('goals.addTask')}
          </Text>
        </TouchableOpacity>
      </View>

      <InputModal
        visible={showAddTask}
        placeholder={t('goals.taskPlaceholder')}
        onSubmit={handleAddTask}
        onClose={() => setShowAddTask(false)}
      />

      <ConfirmModal
        visible={showDeleteConfirm}
        title={t('goals.deleteMonth') + '?'}
        message={t('goals.deleteMonthConfirm')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        variant="danger"
        onConfirm={confirmDeleteMonth}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  stats: {
    fontSize: fontSize.sm,
  },
  deleteBtn: {
    padding: spacing.xs,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  tasks: {
    marginBottom: spacing.sm,
  },
  addTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  addTaskText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
});
