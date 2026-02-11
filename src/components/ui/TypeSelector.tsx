import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Path } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import type { GoalType } from '../../types';
import { borderRadius, fontSize, spacing } from '../../theme/styles';

interface TypeSelectorProps {
  value: GoalType;
  onChange: (type: GoalType) => void;
  label?: string;
}

export function TypeSelector({ value, onChange, label }: TypeSelectorProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const options = [
    {
      type: 'plan' as GoalType,
      title: t('goals.typePlan'),
      description: t('goals.typePlanDesc'),
      icon: (color: string) => (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
          <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <Line x1="16" y1="2" x2="16" y2="6" />
          <Line x1="8" y1="2" x2="8" y2="6" />
          <Line x1="3" y1="10" x2="21" y2="10" />
        </Svg>
      ),
    },
    {
      type: 'subgoals' as GoalType,
      title: t('goals.typeSubgoals'),
      description: t('goals.typeSubgoalsDesc'),
      icon: (color: string) => (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
          <Path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </Svg>
      ),
    },
    {
      type: 'savings' as GoalType,
      title: t('goals.typeSavings') || 'Копилка',
      description: t('goals.typeSavingsDesc') || 'Накопительная цель',
      icon: (color: string) => (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
          <Path d="M12 1v22M5 12h14" strokeLinecap="round" />
          <Rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
          <Line x1="12" y1="2" x2="12" y2="4" />
          <Line x1="12" y1="20" x2="12" y2="22" />
        </Svg>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      )}
      <View style={styles.options}>
        {options.map((option) => {
          const isSelected = value === option.type;
          return (
            <TouchableOpacity
              key={option.type}
              onPress={() => onChange(option.type)}
              activeOpacity={0.7}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected ? colors.accentPrimary + '15' : colors.bgTertiary,
                  borderColor: isSelected ? colors.accentPrimary : colors.borderColor,
                },
              ]}
            >
              <View style={styles.optionIcon}>
                {option.icon(isSelected ? colors.accentPrimary : colors.textMuted)}
              </View>
              <Text
                style={[
                  styles.optionTitle,
                  { color: isSelected ? colors.accentPrimary : colors.textPrimary },
                ]}
              >
                {option.title}
              </Text>
              <Text style={[styles.optionDescription, { color: colors.textMuted }]}>
                {option.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  options: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  option: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  optionIcon: {
    marginBottom: spacing.sm,
  },
  optionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  optionDescription: {
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
});
