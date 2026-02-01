import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Rect, Path, Line, Polygon, Polyline } from 'react-native-svg';
import { Select, ProgressRing } from '../components/ui';
import { Heatmap } from '../components/Heatmap';
import { useGoals } from '../hooks/useGoals';
import { useAnalytics } from '../hooks/useAnalytics';
import { useTheme } from '../contexts/ThemeContext';
import { getCurrentYear } from '../types';
import { borderRadius, fontSize, spacing, shadow } from '../theme/styles';
import type { ThemeColors } from '../theme/colors';

// SVG Icons matching frontend design
const ChartIcon = () => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <Rect x="17" y="10" width="4" height="10" rx="1" fill="#a855f7" />
    <Rect x="10" y="4" width="4" height="16" rx="1" fill="#8b5cf6" />
    <Rect x="3" y="14" width="4" height="6" rx="1" fill="#6366f1" />
  </Svg>
);

const TargetIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#f97316" strokeWidth="2" fill="none" />
    <Circle cx="12" cy="12" r="6" stroke="#ec4899" strokeWidth="2" fill="none" opacity={0.7} />
    <Circle cx="12" cy="12" r="2.5" fill="#f97316" />
  </Svg>
);

const ClockIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="2" fill="none" />
    <Path d="M12 6v6l4 2" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ListIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="3" stroke="#8b5cf6" strokeWidth="2" fill="none" />
    <Path d="M7 8h10M7 12h10M7 16h6" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" stroke="#3b82f6" strokeWidth="2" fill="none" />
    <Line x1="16" y1="2" x2="16" y2="6" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
    <Line x1="8" y1="2" x2="8" y2="6" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
    <Line x1="3" y1="10" x2="21" y2="10" stroke="#3b82f6" strokeWidth="2" />
  </Svg>
);

const LayersIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Polygon points="12 2 2 7 12 12 22 7 12 2" stroke="#a855f7" strokeWidth="2" fill="none" strokeLinejoin="round" />
    <Polyline points="2 17 12 22 22 17" stroke="#ec4899" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Polyline points="2 12 12 17 22 12" stroke="#a855f7" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
  </Svg>
);

// Helper function for progress color (4 levels)
const getProgressColor = (progress: number, colors: ThemeColors): string => {
  if (progress === 100) return colors.success;
  if (progress >= 70) return colors.accentPrimary;
  if (progress >= 40) return colors.warning;
  return colors.danger;
};

export function AnalyticsScreen() {
  const { colors } = useTheme();
  const { goals, dailyActivity, years, getProgress } = useGoals();
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [refreshing, setRefreshing] = useState(false);

  const { analytics, activityByYear } = useAnalytics(goals, dailyActivity, getProgress, selectedYear);

  const yearOptions = years.length > 0
    ? years.map((y) => ({ value: y.toString(), label: y.toString() }))
    : [{ value: getCurrentYear().toString(), label: getCurrentYear().toString() }];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    color,
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon?: React.ReactNode;
    color?: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor: colors.bgTertiary }]}>
      {icon && <View style={[styles.statIcon, { backgroundColor: colors.bgSecondary }]}>{icon}</View>}
      <View style={styles.statInfo}>
        <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{title}</Text>
        <Text style={[styles.statValue, { color: color || colors.accentPrimary }]}>{value}</Text>
        <Text style={[styles.statSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accentPrimary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <ChartIcon />
            <Text style={[styles.title, { color: colors.textPrimary }]}>Аналитика</Text>
          </View>
          <View style={styles.yearSelect}>
            <Select
              value={selectedYear.toString()}
              onChange={(value) => setSelectedYear(Number(value))}
              options={yearOptions}
            />
          </View>
        </View>

        {/* Stats Section with Progress Ring */}
        <View style={[styles.statsContainer, { backgroundColor: colors.bgSecondary, borderColor: colors.borderColor }]}>
          <View style={styles.progressRingContainer}>
            <ProgressRing
              progress={analytics.overallProgress}
              size={140}
              strokeWidth={12}
              label="Общий прогресс"
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.borderColor }]} />
          <View style={styles.statsGrid}>
            <StatCard
              title="Цели"
              value={`${analytics.completedGoals}/${analytics.totalGoals}`}
              subtitle="целей выполнено"
              icon={<TargetIcon />}
              color={colors.accentPrimary}
            />
            <StatCard
              title="В процессе"
              value={analytics.inProgressGoals}
              subtitle="целей в работе"
              icon={<ClockIcon />}
              color={colors.warning}
            />
            <StatCard
              title="Задачи"
              value={`${analytics.completedTasks}/${analytics.totalTasks}`}
              subtitle="задач выполнено"
              icon={<ListIcon />}
              color={colors.success}
            />
          </View>
        </View>

        {/* Goal Progress */}
        {analytics.goalProgress.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.bgSecondary, borderColor: colors.borderColor }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Прогресс по целям
            </Text>
            {[...analytics.goalProgress]
              .sort((a, b) => b.progress - a.progress)
              .map((item) => {
                const progressColor = getProgressColor(item.progress, colors);
                return (
                  <View key={item.goal.id} style={styles.goalProgressItem}>
                    <View style={styles.goalProgressHeader}>
                      <Text style={[styles.goalProgressTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                        {item.goal.title}
                      </Text>
                      <Text style={[styles.goalProgressPercent, { color: progressColor }]}>
                        {item.progress}%
                      </Text>
                    </View>
                    <View style={[styles.progressBar, { backgroundColor: colors.bgTertiary }]}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${item.progress}%`,
                            backgroundColor: progressColor,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.goalProgressFooter}>
                      <View style={styles.goalTypeContainer}>
                        {item.goal.type === 'plan' ? <CalendarIcon /> : <LayersIcon />}
                        <Text style={[styles.goalProgressType, { color: colors.textMuted }]}>
                          {item.goal.type === 'plan' ? ' План' : ' Подцели'}
                        </Text>
                      </View>
                      <Text style={[styles.goalProgressStats, { color: colors.textMuted }]}>
                        {item.completedTasks}/{item.totalTasks}
                      </Text>
                    </View>
                  </View>
                );
              })}
          </View>
        )}

        {/* Monthly Progress */}
        <View style={[styles.section, { backgroundColor: colors.bgSecondary, borderColor: colors.borderColor }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Прогресс по месяцам
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.monthlyChart}>
              {analytics.monthlyProgress.map((item, index) => {
                const maxTotal = Math.max(...analytics.monthlyProgress.map((d) => d.total), 1);
                const barHeight = item.total > 0 ? (item.total / maxTotal) * 120 : 8;
                const fillHeight = item.total > 0 ? (item.completed / item.total) * barHeight : 0;
                const isCurrent = index === new Date().getMonth();
                return (
                  <View
                    key={item.month}
                    style={[
                      styles.monthBar,
                      isCurrent && { backgroundColor: colors.accentPrimary + '15', borderRadius: 8 },
                    ]}
                  >
                    <View style={styles.barContainer}>
                      {/* Total bar (background) */}
                      <View
                        style={[
                          styles.bar,
                          styles.barTotal,
                          {
                            height: barHeight,
                            backgroundColor: colors.bgTertiary,
                          },
                        ]}
                      >
                        {/* Completed bar (fill) */}
                        <View
                          style={[
                            styles.barFill,
                            {
                              height: fillHeight,
                              backgroundColor: colors.accentPrimary,
                            },
                          ]}
                        />
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.monthLabel,
                        { color: isCurrent ? colors.accentPrimary : colors.textMuted },
                        isCurrent && { fontWeight: '600' },
                      ]}
                    >
                      {item.month}
                    </Text>
                    {item.total > 0 && (
                      <Text style={[styles.monthPercent, { color: colors.textSecondary }]}>
                        {item.percentage}%
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>
          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.bgTertiary }]} />
              <Text style={[styles.legendText, { color: colors.textMuted }]}>Всего задач</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.accentPrimary }]} />
              <Text style={[styles.legendText, { color: colors.textMuted }]}>Выполнено</Text>
            </View>
          </View>
        </View>

        {/* Heatmap */}
        <Heatmap activity={activityByYear} year={selectedYear} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  yearSelect: {
    width: 120,
  },
  statsContainer: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  progressRingContainer: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  divider: {
    height: 1,
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'column',
    gap: spacing.md,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.md,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },
  statSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  section: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  goalProgressItem: {
    marginBottom: spacing.lg,
  },
  goalProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  goalProgressTitle: {
    fontSize: fontSize.md,
    fontWeight: '500',
    flex: 1,
    marginRight: spacing.sm,
  },
  goalProgressPercent: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalProgressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalProgressType: {
    fontSize: fontSize.xs,
  },
  goalProgressStats: {
    fontSize: fontSize.xs,
  },
  monthlyChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  monthBar: {
    alignItems: 'center',
    width: 40,
  },
  barContainer: {
    height: 150,
    justifyContent: 'flex-end',
    marginBottom: spacing.sm,
  },
  bar: {
    width: 24,
    borderRadius: 4,
  },
  barTotal: {
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  monthLabel: {
    fontSize: fontSize.xs,
    marginBottom: spacing.xs,
  },
  monthPercent: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    fontSize: fontSize.xs,
  },
});
