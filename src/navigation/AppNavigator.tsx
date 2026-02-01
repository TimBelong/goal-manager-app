import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { GoalsScreen } from '../screens/GoalsScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useTheme } from '../contexts/ThemeContext';

export type AppTabParamList = {
  Goals: undefined;
  Analytics: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

function GoalsIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="12" r="10" />
      <Circle cx="12" cy="12" r="6" />
      <Circle cx="12" cy="12" r="2" />
    </Svg>
  );
}

function AnalyticsIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M18 20V10" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 20V4" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 20v-6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SettingsIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Svg>
  );
}

export function AppNavigator() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgSecondary,
          borderTopColor: colors.borderColor,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.accentPrimary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          tabBarLabel: t('navigation.goals'),
          tabBarIcon: ({ color, size }) => <GoalsIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarLabel: t('navigation.analytics'),
          tabBarIcon: ({ color, size }) => <AnalyticsIcon color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t('navigation.settings'),
          tabBarIcon: ({ color, size }) => <SettingsIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
