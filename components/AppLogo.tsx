import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { FontFamily } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type LogoVariant = 'default' | 'white';

type Props = {
  size?: LogoSize;
  variant?: LogoVariant;
};

const sizeMap: Record<LogoSize, { fontSize: number; iconSize: number }> = {
  xs: { fontSize: 16, iconSize: 14 },
  sm: { fontSize: 20, iconSize: 18 },
  md: { fontSize: 26, iconSize: 22 },
  lg: { fontSize: 34, iconSize: 28 },
  xl: { fontSize: 42, iconSize: 34 },
};

export default function AppLogo({ size = 'md', variant = 'default' }: Props) {
  const s = sizeMap[size];
  const color = variant === 'white' ? Colors.white : Colors.navy;

  return (
    <View style={styles.container}>
      <Feather name="truck" size={s.iconSize} color={color} style={styles.icon} />
      <Text
        style={[
          styles.text,
          { fontSize: s.fontSize, color },
        ]}
      >
        DriveAds
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: Spacing.sm,
  },
  text: {
    fontFamily: FontFamily.black,
  },
});
