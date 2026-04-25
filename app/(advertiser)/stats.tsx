import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const cityStats = [
  { label: 'Paris', value: 182400 },
  { label: 'Lyon', value: 96320 },
  { label: 'Marseille', value: 68200 },
  { label: 'Bordeaux', value: 54120 },
];

export default function AdvertiserStatsScreen() {
  const insets = useSafeAreaInsets();
  const { currentCompany } = useAuth();
  const { campaigns } = useData();
  const companyId = currentCompany?.id ?? 'c1';
  const myCampaigns = campaigns.filter((c) => c.companyId === companyId);
  const activeBornes = Math.max(3, myCampaigns.length * 2);
  const impressions = myCampaigns.reduce((sum, c) => sum + c.kmDone * 18, 486320);
  const maxCity = Math.max(...cityStats.map((c) => c.value));

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 24 }]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Statistiques</Text>
          <Text style={styles.subtitle}>Lecture seule depuis le portail annonceur</Text>
        </View>

        <View style={styles.grid}>
          <Kpi icon="eye" label="Impressions" value={impressions.toLocaleString()} />
          <Kpi icon="monitor" label="Bornes actives" value={activeBornes.toString()} />
          <Kpi icon="map" label="Zones vues" value="12" />
          <Kpi icon="trending-up" label="ROI estimé" value="2.4x" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Impressions par jour</Text>
          <View style={styles.bars}>
            {[42, 56, 49, 68, 74, 62, 86].map((h, index) => (
              <View key={index} style={styles.barWrap}>
                <View style={[styles.bar, { height: h }]} />
                <Text style={styles.barLabel}>{index + 1}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Performance par ville</Text>
          {cityStats.map((city) => (
            <View key={city.label} style={styles.cityRow}>
              <Text style={styles.cityName}>{city.label}</Text>
              <View style={styles.cityTrack}>
                <View style={[styles.cityFill, { width: `${Math.round((city.value / maxCity) * 100)}%` }]} />
              </View>
              <Text style={styles.cityValue}>{city.value.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Kpi({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
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
  subtitle: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.gray500, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  kpi: { width: '48%', backgroundColor: Colors.white, borderRadius: 18, padding: 14 },
  kpiIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.navySoft, alignItems: 'center', justifyContent: 'center' },
  kpiValue: { fontFamily: FontFamily.bold, fontSize: 18, color: Colors.black, marginTop: 12 },
  kpiLabel: { fontFamily: FontFamily.medium, fontSize: 11, color: Colors.gray500, marginTop: 2 },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginTop: 14 },
  cardTitle: { fontFamily: FontFamily.bold, fontSize: 15, color: Colors.black, marginBottom: 14 },
  bars: { height: 120, flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  barWrap: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 8, backgroundColor: Colors.navy },
  barLabel: { fontFamily: FontFamily.medium, fontSize: 10, color: Colors.gray500, marginTop: 6 },
  cityRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  cityName: { width: 72, fontFamily: FontFamily.medium, fontSize: 12, color: Colors.gray700 },
  cityTrack: { flex: 1, height: 8, borderRadius: 999, backgroundColor: Colors.gray100, overflow: 'hidden' },
  cityFill: { height: '100%', borderRadius: 999, backgroundColor: Colors.info },
  cityValue: { width: 64, textAlign: 'right', fontFamily: FontFamily.bold, fontSize: 11, color: Colors.gray700 },
});
