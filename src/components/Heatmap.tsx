import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import type { DailyActivity } from '../types';
import { fontSize, spacing, borderRadius } from '../theme/styles';

// SVG Calendar icon matching frontend design
const CalendarIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" stroke="#3b82f6" strokeWidth="2" fill="none" />
    <Line x1="16" y1="2" x2="16" y2="6" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
    <Line x1="8" y1="2" x2="8" y2="6" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
    <Line x1="3" y1="10" x2="21" y2="10" stroke="#3b82f6" strokeWidth="2" />
  </Svg>
);

interface HeatmapProps {
  activity: DailyActivity[];
  year: number;
}

export function Heatmap({ activity, year }: HeatmapProps) {
  const { colors } = useTheme();

  const { weeks, months } = useMemo(() => {
    // Generate all days for the year
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    // Adjust to start from the first Sunday of the year or before
    const firstDay = new Date(startDate);
    firstDay.setDate(firstDay.getDate() - firstDay.getDay());
    
    const activityMap = new Map<string, number>();
    activity.forEach((a) => {
      activityMap.set(a.date, a.tasksCompleted);
    });

    const weeks: { date: Date; count: number }[][] = [];
    const months: { name: string; weeks: number }[] = [];
    
    let currentWeek: { date: Date; count: number }[] = [];
    let currentMonth = -1;
    let weeksInMonth = 0;
    
    const current = new Date(firstDay);
    while (current <= endDate || currentWeek.length > 0) {
      const dateStr = current.toISOString().split('T')[0];
      const isInYear = current.getFullYear() === year;
      
      if (current.getMonth() !== currentMonth && isInYear) {
        if (currentMonth !== -1) {
          const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
          months.push({ name: monthNames[currentMonth], weeks: weeksInMonth });
        }
        currentMonth = current.getMonth();
        weeksInMonth = 0;
      }
      
      currentWeek.push({
        date: new Date(current),
        count: isInYear ? (activityMap.get(dateStr) || 0) : -1,
      });
      
      if (current.getDay() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
        if (isInYear) weeksInMonth++;
      }
      
      current.setDate(current.getDate() + 1);
      
      if (current > endDate && currentWeek.length === 7) {
        weeks.push(currentWeek);
        break;
      }
    }
    
    // Add last month
    if (currentMonth !== -1) {
      const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
      months.push({ name: monthNames[currentMonth], weeks: weeksInMonth + 1 });
    }

    return { weeks, months };
  }, [activity, year]);

  const getColor = (count: number): string => {
    if (count < 0) return 'transparent';
    if (count === 0) return colors.heatmapLevel0;
    if (count <= 2) return colors.heatmapLevel1;
    if (count <= 4) return colors.heatmapLevel2;
    if (count <= 6) return colors.heatmapLevel3;
    return colors.heatmapLevel4;
  };

  const CELL_SIZE = 12;
  const CELL_GAP = 3;

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.bgSecondary, borderColor: colors.borderColor }]}>
      <View style={styles.titleContainer}>
        <CalendarIcon />
        <Text style={[styles.title, { color: colors.textPrimary }]}>Активность за {year} год</Text>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Month labels */}
          <View style={styles.monthLabels}>
            {months.map((month, i) => (
              <Text
                key={i}
                style={[
                  styles.monthLabel,
                  { color: colors.textMuted, width: month.weeks * (CELL_SIZE + CELL_GAP) },
                ]}
              >
                {month.name}
              </Text>
            ))}
          </View>
          
          {/* Heatmap grid */}
          <View style={styles.grid}>
            {/* Day labels */}
            <View style={styles.dayLabels}>
              <Text style={[styles.dayLabel, { color: colors.textMuted }]}>Пн</Text>
              <Text style={[styles.dayLabel, { color: colors.textMuted }]}>Ср</Text>
              <Text style={[styles.dayLabel, { color: colors.textMuted }]}>Пт</Text>
            </View>
            
            {/* Cells */}
            <View style={styles.cells}>
              {weeks.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.week}>
                  {week.map((day, dayIndex) => {
                    const dateStr = day.date.toISOString().split('T')[0];
                    const isToday = dateStr === todayStr;
                    return (
                      <View
                        key={dayIndex}
                        style={[
                          styles.cell,
                          {
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            backgroundColor: getColor(day.count),
                            borderRadius: 2,
                          },
                          isToday && {
                            borderWidth: 2,
                            borderColor: colors.accentPrimary,
                          },
                        ]}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Legend */}
      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: colors.textMuted }]}>Меньше</Text>
        {[0, 1, 2, 3, 4].map((level) => (
          <View
            key={level}
            style={[
              styles.legendCell,
              {
                backgroundColor: level === 0 ? colors.heatmapLevel0 :
                  level === 1 ? colors.heatmapLevel1 :
                  level === 2 ? colors.heatmapLevel2 :
                  level === 3 ? colors.heatmapLevel3 : colors.heatmapLevel4,
              },
            ]}
          />
        ))}
        <Text style={[styles.legendText, { color: colors.textMuted }]}>Больше</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  monthLabels: {
    flexDirection: 'row',
    marginLeft: 30,
    marginBottom: spacing.xs,
  },
  monthLabel: {
    fontSize: fontSize.xs,
  },
  grid: {
    flexDirection: 'row',
  },
  dayLabels: {
    justifyContent: 'space-around',
    marginRight: spacing.xs,
    height: 7 * 15,
  },
  dayLabel: {
    fontSize: fontSize.xs,
  },
  cells: {
    flexDirection: 'row',
    gap: 3,
  },
  week: {
    gap: 3,
  },
  cell: {
    // Size set dynamically
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  legendText: {
    fontSize: fontSize.xs,
  },
  legendCell: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
