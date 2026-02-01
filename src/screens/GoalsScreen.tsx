import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

const HorizontalLogoLight = require('../assets/images/horizontal_logo_light.png');
const HorizontalLogoDark = require('../assets/images/horizontal_logo_dark.png');
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { YearSection } from '../components/YearSection';
import { Button, Input, Select, TypeSelector, ThemeToggle } from '../components/ui';
import { useGoals } from '../hooks/useGoals';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { Goal, GoalType } from '../types';
import { getCurrentYear } from '../types';
import { borderRadius, fontSize, spacing, shadow } from '../theme/styles';

export function GoalsScreen() {
  const { colors, isDark } = useTheme();
  const { user, logout } = useAuth();
  const {
    goals,
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
  } = useGoals();

  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<GoalType>('plan');
  const [formYear, setFormYear] = useState(getCurrentYear().toString());
  const [refreshing, setRefreshing] = useState(false);

  const handleAddGoal = () => {
    setEditingGoal(null);
    setFormTitle('');
    setFormDescription('');
    setFormType('plan');
    setFormYear(getCurrentYear().toString());
    setShowForm(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setFormTitle(goal.title);
    setFormDescription(goal.description || '');
    setFormType(goal.type);
    setFormYear(goal.year.toString());
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formTitle.trim()) {
      Alert.alert('Ошибка', 'Введите название цели');
      return;
    }

    try {
      if (editingGoal) {
        await updateGoal(editingGoal.id, formTitle.trim(), formDescription.trim());
      } else {
        await addGoal(formTitle.trim(), formDescription.trim(), formType, parseInt(formYear));
      }
      setShowForm(false);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить цель');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderHeader = () => (
    <View style={[styles.header, shadow.md, { backgroundColor: colors.bgSecondary }]}>
      <View style={styles.headerLeft}>
        <Image
          source={isDark ? HorizontalLogoDark : HorizontalLogoLight}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.headerRight}>
        <ThemeToggle size={36} />
        <TouchableOpacity onPress={handleAddGoal} style={[styles.addBtn, { backgroundColor: colors.accentPrimary }]}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2}>
            <Path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={[styles.userName, { color: colors.textSecondary }]}>
            {user?.name
              ?.split(' ')
              .filter(Boolean)
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </Text>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth={2}>
            <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <Path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderYearSection = ({ item: year }: { item: number }) => {
    const yearGoals = goalsByYear[year] || [];

    return (
      <YearSection
        year={year}
        goals={yearGoals}
        getProgress={getProgress}
        onDeleteGoal={deleteGoal}
        onEditGoal={handleEditGoal}
        onAddMonth={addMonth}
        onDeleteMonth={deleteMonth}
        onAddTask={addTask}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
        onAddSubGoal={addSubGoal}
        onToggleSubGoal={toggleSubGoal}
        onDeleteSubGoal={deleteSubGoal}
      />
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🎯</Text>
      <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Нет целей</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        Создайте свою первую цель, чтобы начать
      </Text>
      <Button onPress={handleAddGoal} style={styles.emptyButton}>
        Создать цель
      </Button>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.accentPrimary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      {renderHeader()}

      <FlatList
        data={years}
        renderItem={renderYearSection}
        keyExtractor={(item) => item.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accentPrimary}
          />
        }
      />

      {/* Goal Form Modal */}
      <Modal visible={showForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.bgSecondary }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              {editingGoal ? 'Редактировать цель' : 'Новая цель'}
            </Text>

            <Input
              label="Название"
              value={formTitle}
              onChangeText={setFormTitle}
              placeholder="Название цели"
            />

            <Input
              label="Описание"
              value={formDescription}
              onChangeText={setFormDescription}
              placeholder="Описание (опционально)"
              multiline
              numberOfLines={3}
            />

            {!editingGoal && (
              <>
                <Select
                  label="Год"
                  value={formYear}
                  onChange={setFormYear}
                  options={Array.from({ length: 7 }, (_, i) => {
                    const year = getCurrentYear() - 1 + i;
                    return { value: year.toString(), label: year.toString() };
                  })}
                />

                <TypeSelector
                  label="Тип отслеживания"
                  value={formType}
                  onChange={setFormType}
                />
              </>
            )}

            <View style={styles.modalActions}>
              <Button onPress={handleSubmit} fullWidth>
                {editingGoal ? 'Сохранить' : 'Создать'}
              </Button>
              <Button
                variant="ghost"
                onPress={() => setShowForm(false)}
                fullWidth
              >
                Отмена
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 150,
    height: 40,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  userName: {
    fontSize: fontSize.sm,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.md,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  emptyButton: {
    minWidth: 150,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  modalActions: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
});
