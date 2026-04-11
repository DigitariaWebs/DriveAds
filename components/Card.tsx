import React from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

type Variant = 'surface' | 'navy' | 'outlined';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: Variant;
  padding?: keyof typeof SPACING | 'none';
  style?: StyleProp<ViewStyle>;
}

export function Card({
  children,
  onPress,
  variant = 'surface',
  padding = 'xl',
  style,
}: CardProps) {
  const paddingValue = padding === 'none' ? 0 : SPACING[padding];

  const variantStyles: Record<Variant, ViewStyle> = {
    surface: {
      backgroundColor: COLORS.white,
      borderRadius: RADIUS.xxl,
      ...SHADOWS.sm,
      borderWidth: 1,
      borderColor: COLORS.gray100,
    },
    navy: {
      backgroundColor: COLORS.navy,
      borderRadius: RADIUS.xxl,
      ...SHADOWS.lg,
    },
    outlined: {
      backgroundColor: COLORS.white,
      borderRadius: RADIUS.xxl,
      borderWidth: 1.5,
      borderColor: COLORS.navySoft,
    },
  };

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      activeOpacity={onPress ? 0.9 : 1}
      style={[variantStyles[variant], { padding: paddingValue }, style]}
    >
      {children}
    </Component>
  );
}
