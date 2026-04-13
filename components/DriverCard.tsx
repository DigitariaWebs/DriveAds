import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Driver, ValidationStatus } from '../constants/Types';
import { Colors } from '../constants/Colors';
import { Typography, FontFamily } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

type Props = {
  driver: Driver;
  onPress?: () => void;
  showActions?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
};

const statusBadge: Record<ValidationStatus, { variant: 'success' | 'warning' | 'danger'; label: string }> = {
  validated: { variant: 'success', label: 'Validé' },
  pending: { variant: 'warning', label: 'En attente' },
  rejected: { variant: 'danger', label: 'Refusé' },
};

export default function DriverCard({
  driver,
  onPress,
  showActions = false,
  onApprove,
  onReject,
}: Props) {
  const initials = `${driver.firstName[0]}${driver.lastName[0]}`.toUpperCase();
  const badge = statusBadge[driver.status];

  return (
    <Card variant="surface" onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name}>
            {driver.firstName} {driver.lastName}
          </Text>
          <View style={styles.detailsRow}>
            <Feather name="map-pin" size={13} color={Colors.gray500} />
            <Text style={styles.detail}>{driver.city}</Text>
            {driver.campaignsDone > 0 && (
              <>
                <Text style={styles.dot}>·</Text>
                <Text style={styles.detail}>{driver.campaignsDone} campagnes</Text>
              </>
            )}
          </View>
          {driver.rating > 0 && (
            <View style={styles.ratingRow}>
              <Feather name="star" size={13} color={Colors.warning} />
              <Text style={styles.rating}>{driver.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>

        {/* Status badge */}
        <Badge variant={badge.variant} label={badge.label} />
      </View>

      {/* Admin actions */}
      {showActions && driver.status === 'pending' && (
        <View style={styles.actions}>
          <View style={styles.actionBtn}>
            <Button
              variant="primary"
              size="sm"
              icon="check"
              onPress={onApprove}
            >
              Valider
            </Button>
          </View>
          <View style={styles.actionBtn}>
            <Button
              variant="danger"
              size="sm"
              icon="x"
              onPress={onReject}
            >
              Refuser
            </Button>
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.white,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.sm,
  },
  name: {
    ...Typography.h3,
    color: Colors.black,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  detail: {
    ...Typography.bodySmall,
    color: Colors.gray500,
  },
  dot: {
    color: Colors.gray400,
    marginHorizontal: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  rating: {
    ...Typography.caption,
    color: Colors.gray600,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  actionBtn: {
    flex: 1,
  },
});
