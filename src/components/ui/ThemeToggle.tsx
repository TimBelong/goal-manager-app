import React from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { useTheme } from '../../contexts/ThemeContext';
import { borderRadius, spacing } from '../../theme/styles';

interface ThemeToggleProps {
  size?: number;
}

export function ThemeToggle({ size = 40 }: ThemeToggleProps) {
  const { isDark, toggleTheme, colors } = useTheme();
  const iconSize = size * 0.5;

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.7}
      style={[
        styles.toggle,
        {
          width: size,
          height: size,
          backgroundColor: colors.bgTertiary,
        },
      ]}
      accessibilityLabel={`Переключить на ${isDark ? 'светлую' : 'тёмную'} тему`}
    >
      <View style={styles.iconWrapper}>
        {/* Sun icon */}
        <View style={[styles.icon, { opacity: isDark ? 0 : 1 }]}>
          <Svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.warning}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Circle cx="12" cy="12" r="5" />
            <Line x1="12" y1="1" x2="12" y2="3" />
            <Line x1="12" y1="21" x2="12" y2="23" />
            <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <Line x1="1" y1="12" x2="3" y2="12" />
            <Line x1="21" y1="12" x2="23" y2="12" />
            <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </Svg>
        </View>
        {/* Moon icon */}
        <View style={[styles.icon, styles.moonIcon, { opacity: isDark ? 1 : 0 }]}>
          <Svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.accentSecondary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </Svg>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggle: {
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
  },
  moonIcon: {
    // Moon icon positioning
  },
});
