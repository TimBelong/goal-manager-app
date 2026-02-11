import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import type { GoalCategory } from '../../types';
import { CATEGORIES } from '../../constants/categories';
import { borderRadius, fontSize, spacing } from '../../theme/styles';

interface CategorySelectorProps {
  value: GoalCategory;
  onChange: (category: GoalCategory) => void;
  label?: string;
}

export function CategorySelector({ value, onChange, label }: CategorySelectorProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      )}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.grid}
        nestedScrollEnabled
      >
        {CATEGORIES.map((category) => {
          const isSelected = value === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => onChange(category.id)}
              activeOpacity={0.7}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected ? category.color + '15' : colors.bgTertiary,
                  borderColor: isSelected ? category.color : colors.borderColor,
                },
              ]}
            >
              <View style={styles.optionIcon}>{category.icon(20)}</View>
              <Text
                style={[
                  styles.optionTitle,
                  { color: isSelected ? category.color : colors.textPrimary },
                ]}
                numberOfLines={1}
              >
                {t(`categories.${category.id}`) || category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    gap: spacing.sm,
  },
  optionIcon: {
    width: 20,
    height: 20,
  },
  optionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    flex: 1,
  },
});
