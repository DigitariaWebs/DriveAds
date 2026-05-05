import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import {
  fetchMyStats,
  type StatsPeriod,
  type StatsResponse,
} from '../../lib/stats-api';

const PERIODS: { key: StatsPeriod; label: string }[] = [
  { key: 'week', label: '7 jours' },
  { key: 'month', label: '30 jours' },
  { key: '3mo', label: '3 mois' },
  { key: 'year', label: '1 an' },
];

function formatKm(km: number): string {
  return km >= 1000 ? `${(km / 1000).toFixed(1)}k` : km.toString();
}

function avgPerCampaign(earnings: number, count: number): string {
  if (count === 0) return '0 €';
  return `${Math.round(earnings / count)} €/campagne`;
}

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<StatsPeriod>('month');
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (p: StatsPeriod) => {
    setLoading(true);
    try {
      const res = await fetchMyStats(p);
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(period);
  }, [load, period]);

  useFocusEffect(
    useCallback(() => {
      load(period);
    }, [load, period]),
  );

  const lifetime = data?.lifetime;
  const periodStats = data?.period;
  const breakdown = periodStats?.monthlyBreakdown ?? [];
  const maxAmount =
    breakdown.length > 0
      ? Math.max(...breakdown.map((m) => m.amount))
      : 1;

  const STATS_GRID = [
    {
      label: 'Campagnes complétées',
      value: String(lifetime?.campaignsDone ?? 0),
      icon: 'award' as const,
    },
    {
      label: 'Km parcourus',
      value: formatKm(lifetime?.totalKm ?? 0),
      icon: 'map-pin' as const,
    },
    {
      label: 'Revenu moyen',
      value: avgPerCampaign(
        periodStats?.earnings ?? 0,
        periodStats?.campaignsDone ?? 0,
      ),
      icon: 'trending-up' as const,
    },
    {
      label: 'Missions actives',
      value: String(periodStats?.activeCampaigns ?? 0),
      icon: 'calendar' as const,
    },
  ];

  const growth = periodStats?.growthPercent ?? 0;
  const growthIsUp = growth >= 0;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Statistiques</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20,
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => load(period)}
            tintColor={Colors.navy}
          />
        }
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.periodsRow}
        >
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p.key}
              style={[
                styles.periodChip,
                period === p.key && styles.periodChipActive,
              ]}
              onPress={() => setPeriod(p.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.periodText,
                  period === p.key && styles.periodTextActive,
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>
            Revenus ·{' '}
            {PERIODS.find((p) => p.key === period)?.label.toLowerCase()}
          </Text>
          <Text style={styles.revenueAmount}>
            {(periodStats?.earnings ?? 0).toLocaleString()} €
          </Text>
          <View
            style={[
              styles.revenueTrend,
              !growthIsUp && { backgroundColor: '#FEE2E2' },
            ]}
          >
            <Feather
              name={growthIsUp ? 'trending-up' : 'trending-down'}
              size={14}
              color={growthIsUp ? Colors.success : '#DC2626'}
            />
            <Text
              style={[
                styles.revenueTrendText,
                !growthIsUp && { color: '#DC2626' },
              ]}
            >
              {growthIsUp ? '+' : ''}
              {growth}% vs période précédente
            </Text>
          </View>
        </View>

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

        {breakdown.length > 0 && (
          <View style={styles.breakdownSection}>
            <Text style={styles.breakdownTitle}>Détail mensuel</Text>
            <View style={styles.breakdownList}>
              {breakdown.map((item, i) => (
                <View
                  key={item.month}
                  style={[
                    styles.breakdownItem,
                    i < breakdown.length - 1 && styles.breakdownBorder,
                  ]}
                >
                  <View style={styles.breakdownTop}>
                    <Text style={styles.breakdownMonth}>{item.month}</Text>
                    <Text style={styles.breakdownAmount}>{item.amount} €</Text>
                  </View>
                  <Text style={styles.breakdownCampaigns}>
                    {item.campaigns} campagne
                    {item.campaigns > 1 ? 's' : ''}
                  </Text>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${(item.amount / maxAmount) * 100}%` },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.navyTint },

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
