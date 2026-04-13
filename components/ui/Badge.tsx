import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, Radius } from '../../constants/Spacing';

type BadgeVariant = 'navy' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

type Props = {
  variant?: BadgeVariant;
  label: string;
  icon?: keyof typeof Feather.glyphMap;
};

const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
  navy: { bg: Colors.navySoft, text: Colors.navy },
  success: { bg: Colors.successSoft, text: Colors.success },
  warning: { bg: Colors.warningSoft, text: Colors.warning },
  danger: { bg: Colors.dangerSoft, text: Colors.danger },
  info: { bg: Colors.infoSoft, text: Colors.info },
  neutral: { bg: Colors.gray100, text: Colors.gray600 },
};

export default function Badge({ variant = 'navy', label, icon }: Props) {
  const colors = variantColors[variant];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {icon && (
        <Feather name={icon} size={12} color={colors.text} style={styles.icon} />
      )}
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  label: {
    ...Typography.captionUpper,
    fontSize: 9,
  },
});
