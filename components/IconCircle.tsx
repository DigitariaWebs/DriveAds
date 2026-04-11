import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

type Size = 'sm' | 'md' | 'lg' | 'xl';
type Variant = 'soft' | 'solid' | 'outline';

const SIZE_MAP: Record<Size, { box: number; icon: number }> = {
  sm: { box: 40, icon: 20 },
  md: { box: 56, icon: 26 },
  lg: { box: 88, icon: 40 },
  xl: { box: 176, icon: 84 },
};

interface IconCircleProps {
  icon: keyof typeof Ionicons.glyphMap;
  size?: Size;
  variant?: Variant;
  shadow?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function IconCircle({
  icon,
  size = 'md',
  variant = 'soft',
  shadow = false,
  style,
}: IconCircleProps) {
  const { box, icon: iconSize } = SIZE_MAP[size];

  const variantStyles: Record<Variant, ViewStyle> = {
    soft: {
      backgroundColor: COLORS.navySoft,
    },
    solid: {
      backgroundColor: COLORS.navy,
    },
    outline: {
      backgroundColor: COLORS.white,
      borderWidth: 1.5,
      borderColor: COLORS.navySoft,
    },
  };

  const iconColor = variant === 'solid' ? COLORS.white : COLORS.navy;

  return (
    <View
      style={[
        {
          width: box,
          height: box,
          borderRadius: box / 2,
          alignItems: 'center',
          justifyContent: 'center',
        },
        variantStyles[variant],
        shadow && SHADOWS.md,
        style,
      ]}
    >
      <Ionicons name={icon} size={iconSize} color={iconColor} />
    </View>
  );
}
