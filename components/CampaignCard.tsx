import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Campaign } from '../constants/Types';
import { Colors } from '../constants/Colors';
import { FontFamily } from '../constants/Typography';
import { Shadows } from '../constants/Spacing';
import BrandLogo from './BrandLogo';

type Props = {
  campaign: Campaign;
  onPress?: () => void;
};

type StatusKey = 'available' | 'active' | 'completed' | 'upcoming';

const STATUS_META: Record<
  StatusKey,
  { label: string; fg: string; bg: string; dot: string }
> = {
  available: {
    label: 'Disponible',
    fg: '#059669',
    bg: 'rgba(16,185,129,0.14)',
    dot: '#10B981',
  },
  active: {
    label: 'En cours',
    fg: '#1E40AF',
    bg: 'rgba(59,130,246,0.16)',
    dot: '#60A5FA',
  },
  completed: {
    label: 'Terminée',
    fg: '#475569',
    bg: 'rgba(100,116,139,0.16)',
    dot: '#94A3B8',
  },
  upcoming: {
    label: 'À venir',
    fg: '#B45309',
    bg: 'rgba(245,158,11,0.18)',
    dot: '#F59E0B',
  },
};

export default function CampaignCard({ campaign, onPress }: Props) {
  const status = STATUS_META[campaign.status as StatusKey];
  const progressPct = Math.round(campaign.progress * 100);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.logoWrap}>
          <BrandLogo domain={campaign.domain} name={campaign.brand} size={40} />
        </View>
        <View style={styles.topInfo}>
          <Text style={styles.brand}>{campaign.brand.toUpperCase()}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {campaign.title}
          </Text>
        </View>
        <View style={[styles.statusChip, { backgroundColor: status.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: status.dot }]} />
          <Text style={[styles.statusText, { color: status.fg }]}>
            {status.label}
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {campaign.description}
      </Text>

      {/* Meta row — monochrome */}
      <View style={styles.metaRow}>
        <View style={styles.metaCol}>
          <View style={styles.metaItem}>
            <Feather name="map-pin" size={12} color={Colors.gray500} />
            <Text style={styles.metaText}>{campaign.city}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="calendar" size={12} color={Colors.gray500} />
            <Text style={styles.metaText}>{campaign.durationDays}j</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="users" size={12} color={Colors.gray500} />
            <Text style={styles.metaText}>
              {campaign.driversAssigned}/{campaign.driversNeeded}
            </Text>
          </View>
        </View>
        <View style={styles.rewardCol}>
          <Text style={styles.rewardAmount}>{campaign.reward} €</Text>
          <Text style={styles.rewardLabel}>rémunération</Text>
        </View>
      </View>

      {/* Progress bar (active only) */}
      {campaign.status === 'active' && (
        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={[Colors.navy, Colors.navyLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progressPct}%` }]}
            />
          </View>
          <Text style={styles.progressPct}>{progressPct}%</Text>
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
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  topInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  brand: {
    fontFamily: FontFamily.semiBold,
    fontSize: 9.5,
    color: Colors.gray400,
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.black,
    marginTop: 2,
    letterSpacing: -0.2,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 100,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    letterSpacing: 0.3,
  },

  // Description
  description: {
    fontFamily: FontFamily.regular,
    fontSize: 12.5,
    lineHeight: 18,
    color: Colors.gray500,
    marginBottom: 14,
  },

  // Meta row — monochrome icons + reward
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  metaCol: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.gray600,
  },
  rewardCol: {
    alignItems: 'flex-end',
    paddingLeft: 10,
  },
  rewardAmount: {
    fontFamily: FontFamily.black,
    fontSize: 18,
    color: Colors.navy,
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  rewardLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 9.5,
    color: Colors.gray400,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 1,
  },

  // Progress
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
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
    fontSize: 12,
    color: Colors.navy,
    minWidth: 34,
    textAlign: 'right',
  },
});
