import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { Checkbox, ConfirmModal } from './ui';
import { useTheme } from '../contexts/ThemeContext';
import type { Task } from '../types';
import { borderRadius, fontSize, spacing } from '../theme/styles';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const { colors } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.bgTertiary,
          },
        ]}
      >
        <Checkbox checked={task.completed} onToggle={onToggle} />
        <Text
          style={[
            styles.text,
            {
              color: task.completed ? colors.textMuted : colors.textPrimary,
              textDecorationLine: task.completed ? 'line-through' : 'none',
            },
          ]}
          numberOfLines={2}
        >
          {task.text}
        </Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth={2}>
            <Line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
            <Line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
      </View>

      <ConfirmModal
        visible={showDeleteConfirm}
        title="Удалить задачу?"
        message={`Вы уверены, что хотите удалить задачу "${task.text}"?`}
        confirmText="Удалить"
        cancelText="Отмена"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  text: {
    flex: 1,
    fontSize: fontSize.sm,
  },
  deleteBtn: {
    padding: spacing.xs,
  },
});
