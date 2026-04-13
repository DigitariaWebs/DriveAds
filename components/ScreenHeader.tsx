import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';
import AppLogo from './AppLogo';

type Props = {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  notificationCount?: number;
  rightAction?: ReactNode;
};

export default function ScreenHeader({
  title,
  subtitle,
  showLogo = false,
  notificationCount = 0,
  rightAction,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showLogo ? (
          <AppLogo size="sm" />
        ) : (
          <>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </>
        )}
      </View>
      <View style={styles.right}>
        {rightAction}
        {notificationCount > 0 && (
          <TouchableOpacity style={styles.bellButton}>
            <Feather name="bell" size={24} color={Colors.navy} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  left: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    ...Typography.h1,
    color: Colors.black,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.gray500,
    marginTop: 2,
  },
  bellButton: {
    position: 'relative',
    padding: Spacing.xs,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
