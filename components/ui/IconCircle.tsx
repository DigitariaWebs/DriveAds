import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

type IconCircleSize = 'sm' | 'md' | 'lg' | 'xl';
type IconCircleVariant = 'soft' | 'solid' | 'outline';

type Props = {
  icon: keyof typeof Feather.glyphMap;
  size?: IconCircleSize;
  variant?: IconCircleVariant;
  color?: string;
};

const sizeMap: Record<IconCircleSize, { container: number; icon: number }> = {
  sm: { container: 26, icon: 13 },
  md: { container: 32, icon: 16 },
  lg: { container: 40, icon: 20 },
  xl: { container: 48, icon: 24 },
};

export default function IconCircle({
  icon,
  size = 'md',
  variant = 'soft',
  color = Colors.navy,
}: Props) {
  const s = sizeMap[size];

  const containerStyle = [
    styles.base,
    {
      width: s.container,
      height: s.container,
      borderRadius: s.container / 2,
    },
    variant === 'soft' && { backgroundColor: color + '15' },
    variant === 'solid' && { backgroundColor: color },
    variant === 'outline' && { borderWidth: 1.5, borderColor: color },
  ];

  const iconColor =
    variant === 'solid' ? Colors.white : color;

  return (
    <View style={containerStyle}>
      <Feather name={icon} size={s.icon} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
