import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import IconCircle from './IconCircle';

type Props = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
};

const trendColors = {
  up: Colors.success,
  down: Colors.danger,
  neutral: Colors.gray500,
};

export default function StatCard({
  icon,
  label,
  value,
  trend,
  trendDirection = 'neutral',
}: Props) {
  return (
    <View style={styles.container}>
      <IconCircle icon={icon} size="sm" variant="soft" color={Colors.navy} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {trend && (
        <View style={styles.trendRow}>
          <Feather
            name={
              trendDirection === 'up'
                ? 'arrow-up'
                : trendDirection === 'down'
                  ? 'arrow-down'
                  : 'minus'
            }
            size={10}
            color={trendColors[trendDirection]}
          />
          <Text style={[styles.trendText, { color: trendColors[trendDirection] }]}>
            {trend}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'flex-start',
    ...Shadows.sm,
  },
  value: {
    ...Typography.h3,
    color: Colors.black,
    marginTop: Spacing.sm,
  },
  label: {
    ...Typography.caption,
    color: Colors.gray500,
    marginTop: 1,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  trendText: {
    ...Typography.caption,
    marginLeft: 2,
  },
});
