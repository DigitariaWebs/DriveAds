import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Campaign } from '../constants/Types';
import { Colors } from '../constants/Colors';
import { FontFamily } from '../constants/Typography';
import { Shadows } from '../constants/Spacing';
import Badge from './ui/Badge';
import Button from './ui/Button';
import BrandLogo from './BrandLogo';

type Props = {
  campaign: Campaign;
  onPress?: () => void;
  showActions?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
};

const statusConfig: Record<string, { variant: 'success' | 'warning' | 'info' | 'neutral'; label: string }> = {
  available: { variant: 'success', label: 'Disponible' },
  active: { variant: 'info', label: 'En cours' },
  completed: { variant: 'neutral', label: 'Terminée' },
  upcoming: { variant: 'warning', label: 'À venir' },
};

export default function CampaignCard({
  campaign,
  onPress,
  showActions = false,
  onAccept,
  onDecline,
}: Props) {
  const status = statusConfig[campaign.status];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Top row: logo + info + status */}
      <View style={styles.topRow}>
        <View style={styles.logoWrap}>
          <BrandLogo domain={campaign.domain} name={campaign.brand} size={36} />
        </View>
        <View style={styles.topInfo}>
          <Text style={styles.brand}>{campaign.brand.toUpperCase()}</Text>
          <Text style={styles.title} numberOfLines={1}>{campaign.title}</Text>
        </View>
        <Badge variant={status.variant} label={status.label} />
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {campaign.description}
      </Text>

      {/* Metrics chips */}
      <View style={styles.metricsRow}>
        <View style={styles.metricChip}>
          <Feather name="map-pin" size={11} color={Colors.navy} />
          <Text style={styles.metricText}>{campaign.city}</Text>
        </View>
        <View style={styles.metricChip}>
          <Feather name="calendar" size={11} color={Colors.navy} />
          <Text style={styles.metricText}>{campaign.durationDays}j</Text>
        </View>
        <View style={styles.metricChip}>
          <Feather name="users" size={11} color={Colors.navy} />
          <Text style={styles.metricText}>{campaign.driversAssigned}/{campaign.driversNeeded}</Text>
        </View>
        <View style={styles.rewardChip}>
          <Text style={styles.rewardText}>{campaign.reward} €</Text>
        </View>
      </View>

      {/* Progress bar for active */}
      {campaign.status === 'active' && (
        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={[Colors.navy, Colors.navyLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${Math.round(campaign.progress * 100)}%` }]}
            />
          </View>
          <Text style={styles.progressPct}>{Math.round(campaign.progress * 100)}%</Text>
        </View>
      )}

      {/* Action buttons */}
      {showActions && campaign.status === 'available' && (
        <View style={styles.actions}>
          <View style={styles.actionBtn}>
            <Button variant="primary" size="sm" onPress={onAccept}>
              Accepter
            </Button>
          </View>
          <View style={styles.actionBtn}>
            <Button variant="outline" size="sm" onPress={onDecline}>
              Refuser
            </Button>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.gray100,
    ...Shadows.sm,
  },

  // Top row
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  topInfo: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },
  brand: {
    fontFamily: FontFamily.semiBold,
    fontSize: 9,
    color: Colors.gray400,
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.black,
    marginTop: 1,
  },

  // Description
  description: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 17,
    color: Colors.gray500,
    marginBottom: 12,
  },

  // Metrics
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  metricChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.navySoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  metricText: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: Colors.navy,
  },
  rewardChip: {
    backgroundColor: Colors.navy,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  rewardText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.white,
  },

  // Progress
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.gray100,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  progressPct: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.navy,
    minWidth: 30,
    textAlign: 'right',
  },

  // Actions
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  actionBtn: {
    flex: 1,
  },
});
