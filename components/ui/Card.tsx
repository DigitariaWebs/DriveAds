import React, { ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';

type CardVariant = 'surface' | 'navy' | 'outlined' | 'gradient' | 'row';

type Props = {
  variant?: CardVariant;
  padding?: number;
  onPress?: () => void;
  children: ReactNode;
  style?: ViewStyle;
  gradientColors?: readonly [string, string, ...string[]];
};

export default function Card({
  variant = 'surface',
  padding = Spacing.xl,
  onPress,
  children,
  style,
  gradientColors,
}: Props) {
  // Gradient card
  if (variant === 'gradient') {
    const colors = gradientColors ?? [Colors.navyDark, Colors.navy] as const;
    const inner = (
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.base, styles.gradient, { padding }, style]}
      >
        {children}
      </LinearGradient>
    );
    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          {inner}
        </TouchableOpacity>
      );
    }
    return inner;
  }

  // Row/pill card
  if (variant === 'row') {
    const rowStyle = [styles.row, { paddingHorizontal: padding, paddingVertical: Spacing.md }, style];
    if (onPress) {
      return (
        <TouchableOpacity style={rowStyle} onPress={onPress} activeOpacity={0.7}>
          {children}
        </TouchableOpacity>
      );
    }
    return <View style={rowStyle}>{children}</View>;
  }

  // Standard variants
  const variantStyle = variantMap[variant];
  const cardStyle = [styles.base, variantStyle, { padding }, style];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const variantMap: Record<'surface' | 'navy' | 'outlined', ViewStyle> = {
  surface: {
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  navy: {
    backgroundColor: Colors.navy,
    ...Shadows.md,
  },
  outlined: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  gradient: {
    ...Shadows.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    ...Shadows.sm,
  },
});
