import React from 'react';
import Svg, { Path, Rect, Circle, Polygon } from 'react-native-svg';
import type { GoalCategory } from '../types';

export interface CategoryConfig {
  id: GoalCategory;
  label: string;
  icon: (size?: number) => React.ReactNode;
  description: string;
  color: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'PersonalDevelopment',
    label: 'Личное развитие',
    icon: (size = 24) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2}>
        <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="#10B981" />
        <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="#34D399" />
      </Svg>
    ),
    description: 'Книги, курсы, навыки',
    color: '#10B981',
  },
  {
    id: 'Career',
    label: 'Карьера',
    icon: (size = 24) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2}>
        <Rect x="2" y="7" width="20" height="14" rx="2" ry="2" stroke="#3B82F6" />
        <Path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke="#60A5FA" />
      </Svg>
    ),
    description: 'Повышение, новый проект',
    color: '#3B82F6',
  },
  {
    id: 'Finance',
    label: 'Финансы',
    icon: (size = 24) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2}>
        <Circle cx="12" cy="12" r="10" stroke="#F59E0B" />
        <Path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" stroke="#FBBF24" />
        <Path d="M12 18V6" stroke="#F59E0B" />
      </Svg>
    ),
    description: 'Накопления, инвестиции',
    color: '#F59E0B',
  },
  {
    id: 'Health',
    label: 'Здоровье',
    icon: (size = 24) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2}>
        <Path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" stroke="#EF4444" fill="none" />
        <Path d="M12 5.5v2" stroke="#F87171" strokeLinecap="round" />
      </Svg>
    ),
    description: 'Чек-апы, лечение',
    color: '#EF4444',
  },
  {
    id: 'Sport',
    label: 'Спорт',
    icon: (size = 24) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z" />
        <Path d="m2.5 21.5 1.4-1.4" />
        <Path d="m20.1 3.9 1.4-1.4" />
        <Path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z" />
        <Path d="m9.6 14.4 4.8-4.8" />
      </Svg>
    ),
    description: 'Тренировки, активность',
    color: '#8B5CF6',
  },
  {
    id: 'Nutrition',
    label: 'Питание',
    icon: (size = 24) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M7 21h10" />
        <Path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
        <Path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1" />
        <Path d="m13 12 4-4" />
        <Path d="M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2" />
      </Svg>
    ),
    description: 'Диета, режим воды',
    color: '#EC4899',
  },
  {
    id: 'Relationships',
    label: 'Отношения',
    icon: (size = 24) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2}>
        <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#EC4899" />
        <Circle cx="9" cy="7" r="4" stroke="#F472B6" />
        <Path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#EC4899" />
        <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#F472B6" />
      </Svg>
    ),
    description: 'Семья, друзья',
    color: '#EC4899',
  },
  {
    id: 'Habits',
    label: 'Привычки',
    icon: (size = 24) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth={2}>
        <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="none" />
      </Svg>
    ),
    description: 'Режим дня, медитации',
    color: '#6366F1',
  },
  {
    id: 'Travel',
    label: 'Путешествия',
    icon: (size = 24) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth={2}>
        <Path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </Svg>
    ),
    description: 'Поездки, отпуск',
    color: '#0EA5E9',
  },
  {
    id: 'Other',
    label: 'Другое',
    icon: (size = 24) => (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={2}>
        <Circle cx="12" cy="12" r="1" fill="#64748B" stroke="#64748B" />
        <Circle cx="19" cy="12" r="1" fill="#94A3B8" stroke="#94A3B8" />
        <Circle cx="5" cy="12" r="1" fill="#475569" stroke="#475569" />
      </Svg>
    ),
    description: 'Всё остальное',
    color: '#64748B',
  },
];

export const getCategoryById = (id: GoalCategory): CategoryConfig | undefined =>
  CATEGORIES.find((c) => c.id === id);
