import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import {
  fetchAdvertiserPerformance,
  type PerformancePeriod,
  type PerformanceResponse,
} from '../../lib/performance-api';

const PERIODS: { value: PerformancePeriod; label: string }[] = [
  { value: '7d', label: '7 j' },
  { value: '30d', label: '30 j' },
  { value: '90d', label: '90 j' },
  { value: '365d', label: 'Année' },
];

export default function AdvertiserStatsScreen() {
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<PerformancePeriod>('30d');
  const [data, setData] = useState<PerformanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const r = await fetchAdvertiserPerformance(period);
        if (live) setData(r);
      } catch (e) {
        if (live) setError((e as Error).message);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [period]);

  const cities = data?.cities ?? [];
  const maxCity = Math.max(1, ...cities.map((c) => c.impressions));
  const timeline = data?.impressionsTimeline ?? [];
  const maxBar = Math.max(1, ...timeline);
  // Show up to last 14 buckets to keep mobile bars readable.
  const bars = timeline.slice(-14);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 24 },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Statistiques</Text>
          <Text style={styles.subtitle}>
            Lecture seule depuis le portail annonceur
          </Text>
        </View>

        <View style={styles.segmented}>
          {PERIODS.map((p) => {
            const active = p.value === period;
            return (
              <Text
                key={p.value}
                onPress={() => setPeriod(p.value)}
                style={[styles.segItem, active && styles.segItemActive]}
              >
                {p.label}
              </Text>
            );
          })}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.grid}>
          <Kpi
            icon="eye"
            label="Impressions"
            value={
              data ? data.kpis.impressionsTotal.toLocaleString('fr-FR') : '—'
            }
          />
          <Kpi
            icon="monitor"
            label="Bornes touchées"
            value={data ? data.kpis.reachTerminals.toLocaleString('fr-FR') : '—'}
          />
          <Kpi
            icon="map"
            label="Kilomètres"
            value={data ? `${data.kpis.kmTotal.toLocaleString('fr-FR')} km` : '—'}
          />
          <Kpi
            icon="calendar"
            label="Jours-campagne"
            value={data ? data.kpis.campaignDays.toLocaleString('fr-FR') : '—'}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Impressions par jour</Text>
          {loading && !data ? (
            <ActivityIndicator color={Colors.navy} />
          ) : bars.length < 2 ? (
            <Text style={styles.empty}>Pas encore d'impressions sur la période.</Text>
          ) : (
            <View style={styles.bars}>
              {bars.map((v, idx) => {
                const h = Math.max(2, Math.round((v / maxBar) * 110));
                return (
                  <View key={idx} style={styles.barWrap}>
                    <View style={[styles.bar, { height: h }]} />
                    <Text style={styles.barLabel}>{idx + 1}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Performance par ville</Text>
          {loading && !data ? (
            <ActivityIndicator color={Colors.navy} />
          ) : cities.length === 0 ? (
            <Text style={styles.empty}>Aucune ville couverte sur la période.</Text>
          ) : (
            cities.map((city) => (
              <View key={city.city} style={styles.cityRow}>
                <Text style={styles.cityName}>{city.city}</Text>
                <View style={styles.cityTrack}>
                  <View
                    style={[
                      styles.cityFill,
                      {
                        width: `${Math.round(
                          (city.impressions / maxCity) * 100,
                        )}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.cityValue}>
                  {city.impressions.toLocaleString('fr-FR')}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top campagnes</Text>
          {loading && !data ? (
            <ActivityIndicator color={Colors.navy} />
          ) : (data?.campaigns.length ?? 0) === 0 ? (
            <Text style={styles.empty}>Aucune campagne avec impressions.</Text>
          ) : (
            data!.campaigns.map((c) => (
              <View key={c.campaignId} style={styles.cityRow}>
                <Text style={styles.cityName} numberOfLines={1}>
                  {c.brand}
                </Text>
                <View style={styles.cityTrack}>
                  <View
                    style={[styles.cityFill, { width: `${c.pct}%` }]}
                  />
                </View>
                <Text style={styles.cityValue}>{c.pct}%</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function Kpi({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.kpi}>
      <View style={styles.kpiIcon}>
        <Feather name={icon} size={16} color={Colors.navy} />
      </View>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.navyTint },
  content: { padding: 20 },
  header: { marginBottom: 18 },
  title: { fontFamily: FontFamily.black, fontSize: 24, color: Colors.black },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 4,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 999,
    padding: 4,
    gap: 4,
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  segItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.gray500,
    overflow: 'hidden',
  },
  segItemActive: {
    backgroundColor: Colors.navy,
    color: Colors.white,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  kpi: { width: '48%', backgroundColor: Colors.white, borderRadius: 18, padding: 14 },
  kpiIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: { fontFamily: FontFamily.bold, fontSize: 18, color: Colors.black, marginTop: 12 },
  kpiLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 2,
  },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginTop: 14 },
  cardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.black,
    marginBottom: 14,
  },
  bars: { height: 130, flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  barWrap: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 6, backgroundColor: Colors.navy },
  barLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: Colors.gray500,
    marginTop: 6,
  },
  cityRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  cityName: { width: 96, fontFamily: FontFamily.medium, fontSize: 12, color: Colors.gray700 },
  cityTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.gray100,
    overflow: 'hidden',
  },
  cityFill: { height: '100%', borderRadius: 999, backgroundColor: Colors.info },
  cityValue: {
    width: 80,
    textAlign: 'right',
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.gray700,
  },
  empty: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.gray500 },
  error: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.danger,
    marginBottom: 12,
  },
});
