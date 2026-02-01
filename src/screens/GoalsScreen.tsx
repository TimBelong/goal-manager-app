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
import { useTranslation } from 'react-i18next';

const HorizontalLogoLight = require('../assets/images/horizontal_logo_light.png');
const HorizontalLogoDark = require('../assets/images/horizontal_logo_dark.png');
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { YearSection } from '../components/YearSection';
import { Button, Input, Select, TypeSelector } from '../components/ui';
import { useGoals } from '../hooks/useGoals';
import { useTheme } from '../contexts/ThemeContext';
import type { Goal, GoalType } from '../types';
import { getCurrentYear } from '../types';
import { borderRadius, fontSize, spacing, shadow } from '../theme/styles';

export function GoalsScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
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
      Alert.alert(t('common.error'), t('goals.errorEnterTitle'));
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
      Alert.alert(t('common.error'), t('goals.errorSaveGoal'));
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
      <TouchableOpacity onPress={handleAddGoal} style={[styles.addBtn, { backgroundColor: colors.accentPrimary }]}>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.5}>
          <Path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </Svg>
        <Text style={styles.addBtnText}>{t('goals.newGoal')}</Text>
      </TouchableOpacity>
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
      <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>{t('goals.emptyTitle')}</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {t('goals.emptyText')}
      </Text>
      <Button onPress={handleAddGoal} style={styles.emptyButton}>
        {t('goals.createGoal')}
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
              {editingGoal ? t('goals.editGoal') : t('goals.newGoal')}
            </Text>

            <Input
              label={t('goals.goalTitle')}
              value={formTitle}
              onChangeText={setFormTitle}
              placeholder={t('goals.goalTitlePlaceholder')}
            />

            <Input
              label={t('goals.goalDescription')}
              value={formDescription}
              onChangeText={setFormDescription}
              placeholder={t('goals.goalDescriptionPlaceholder')}
              multiline
              numberOfLines={3}
            />

            {!editingGoal && (
              <>
                <Select
                  label={t('goals.goalYear')}
                  value={formYear}
                  onChange={setFormYear}
                  options={Array.from({ length: 7 }, (_, i) => {
                    const year = getCurrentYear() - 1 + i;
                    return { value: year.toString(), label: year.toString() };
                  })}
                />

                <TypeSelector
                  label={t('goals.goalType')}
                  value={formType}
                  onChange={setFormType}
                />
              </>
            )}

            <View style={styles.modalActions}>
              <Button onPress={handleSubmit} fullWidth>
                {editingGoal ? t('common.save') : t('common.create')}
              </Button>
              <Button
                variant="ghost"
                onPress={() => setShowForm(false)}
                fullWidth
              >
                {t('common.cancel')}
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: fontSize.sm,
    fontWeight: '600',
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
