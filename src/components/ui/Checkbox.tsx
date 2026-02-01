import React from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../contexts/ThemeContext';
import { borderRadius } from '../../theme/styles';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
  disabled?: boolean;
}

export function Checkbox({
  checked,
  onToggle,
  size = 22,
  disabled = false,
}: CheckboxProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: borderRadius.sm,
          backgroundColor: checked ? colors.accentPrimary : 'transparent',
          borderColor: checked ? colors.accentPrimary : colors.borderColor,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      {checked && (
        <Svg
          width={size * 0.6}
          height={size * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth={3}
        >
          <Path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
