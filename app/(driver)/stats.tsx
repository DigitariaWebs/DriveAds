import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';

const PERIODS = ['7 jours', '30 jours', '3 mois', '1 an'];

const STATS_GRID = [
  { label: 'Campagnes complétées', value: '12', icon: 'award' as const },
  { label: 'Km parcourus', value: '18.5k', icon: 'map-pin' as const },
  { label: 'Revenu moyen', value: '360 €/campagne', icon: 'trending-up' as const },
  { label: 'Jours actifs', value: '45', icon: 'calendar' as const },
];

const MONTHLY_BREAKDOWN = [
  { month: 'Avril 2026', amount: 810, campaigns: 3 },
  { month: 'Mars 2026', amount: 530, campaigns: 2 },
  { month: 'Février 2026', amount: 680, campaigns: 3 },
  { month: 'Janvier 2026', amount: 450, campaigns: 2 },
];

const MAX_MONTH_AMOUNT = Math.max(...MONTHLY_BREAKDOWN.map((m) => m.amount));

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const [activePeriod, setActivePeriod] = useState('30 jours');

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Statistiques</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20 }}
      >
        {/* Period selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.periodsRow}
        >
          {PERIODS.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodChip,
                activePeriod === period && styles.periodChipActive,
              ]}
              onPress={() => setActivePeriod(period)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.periodText,
                  activePeriod === period && styles.periodTextActive,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Revenue card */}
        <View style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>Revenus totaux</Text>
          <Text style={styles.revenueAmount}>4 320 €</Text>
          <View style={styles.revenueTrend}>
            <Feather name="trending-up" size={14} color={Colors.success} />
            <Text style={styles.revenueTrendText}>+12% vs période précédente</Text>
          </View>
        </View>

        {/* Stats grid (2x2) */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            {STATS_GRID.slice(0, 2).map((stat) => (
              <View key={stat.label} style={styles.gridCard}>
                <View style={styles.gridIconWrap}>
                  <Feather name={stat.icon} size={16} color={Colors.navy} />
                </View>
                <Text style={styles.gridValue}>{stat.value}</Text>
                <Text style={styles.gridLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.gridRow}>
            {STATS_GRID.slice(2, 4).map((stat) => (
              <View key={stat.label} style={styles.gridCard}>
                <View style={styles.gridIconWrap}>
                  <Feather name={stat.icon} size={16} color={Colors.navy} />
                </View>
                <Text style={styles.gridValue}>{stat.value}</Text>
                <Text style={styles.gridLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Monthly breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Détail mensuel</Text>
          <View style={styles.breakdownList}>
            {MONTHLY_BREAKDOWN.map((item, i) => (
              <View
                key={item.month}
                style={[styles.breakdownItem, i < MONTHLY_BREAKDOWN.length - 1 && styles.breakdownBorder]}
              >
                <View style={styles.breakdownTop}>
                  <Text style={styles.breakdownMonth}>{item.month}</Text>
                  <Text style={styles.breakdownAmount}>{item.amount} €</Text>
                </View>
                <Text style={styles.breakdownCampaigns}>
                  {item.campaigns} campagne{item.campaigns > 1 ? 's' : ''}
                </Text>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${(item.amount / MAX_MONTH_AMOUNT) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.navyTint },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.navy,
  },

  // Period selector
  periodsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  periodChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  periodChipActive: {
    backgroundColor: Colors.navy,
  },
  periodText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.navy,
  },
  periodTextActive: {
    color: Colors.white,
  },

  // Revenue card
  revenueCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    ...Shadows.sm,
  },
  revenueLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.gray500,
    marginBottom: 4,
  },
  revenueAmount: {
    fontFamily: FontFamily.black,
    fontSize: 36,
    color: Colors.navy,
    marginBottom: 8,
  },
  revenueTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.successSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  revenueTrendText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: Colors.success,
  },

  // Stats grid
  gridContainer: {
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 24,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  gridCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    ...Shadows.sm,
  },
  gridIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridValue: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.black,
  },
  gridLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: Colors.gray500,
    textAlign: 'center',
  },

  // Monthly breakdown
  breakdownSection: {
    paddingHorizontal: 16,
  },
  breakdownTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.black,
    marginBottom: 12,
  },
  breakdownList: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    ...Shadows.sm,
  },
  breakdownItem: {
    padding: 14,
  },
  breakdownBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  breakdownTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  breakdownMonth: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.black,
  },
  breakdownAmount: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.navy,
  },
  breakdownCampaigns: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: Colors.gray400,
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.navySoft,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.navy,
  },
});
