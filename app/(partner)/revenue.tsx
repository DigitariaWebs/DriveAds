import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import { useAuth } from '../../context/AuthContext';
import { partnerAds, partnerRevenueHistory, partnerTerminal, partnerTransactions } from '../../mocks/partner';
import PartnerSignOutButton from '../../components/PartnerSignOutButton';

export default function PartnerRevenueScreen() {
  const insets = useSafeAreaInsets();
  const { currentPartner } = useAuth();
  const [reportReady, setReportReady] = useState(false);
  const sprays = currentPartner?.monthlySprayRevenue ?? 0;
  const ads = currentPartner?.monthlyAdsRevenue ?? 0;
  const total = sprays + ads;
  const progress = Math.min(100, Math.round((total / partnerTerminal.monthlyTarget) * 100));
  const max = Math.max(...partnerRevenueHistory);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 24 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Revenus</Text>
            <Text style={styles.subtitle}>Sprays, pubs et paiement mensuel</Text>
          </View>
          <PartnerSignOutButton />
        </View>

        <View style={styles.totalCard}>
          <View style={styles.totalTop}>
            <View>
              <Text style={styles.totalLabel}>Total mensuel</Text>
              <Text style={styles.total}>{total.toLocaleString()} €</Text>
            </View>
            <TouchableOpacity style={styles.exportButton} onPress={() => setReportReady(true)}>
              <Feather name={reportReady ? 'check' : 'download'} size={15} color={Colors.white} />
              <Text style={styles.exportText}>{reportReady ? 'Prêt' : 'Export'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}% de l'objectif · paiement prévu le {partnerTerminal.nextPayout}</Text>
        </View>

        <View style={styles.kpiRow}>
          <RevenueBox icon="droplet" label="Sprays" value={sprays} />
          <RevenueBox icon="monitor" label="Pubs" value={ads} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Évolution 7 jours</Text>
          <View style={styles.chart}>
            {partnerRevenueHistory.map((amount, index) => (
              <View key={index} style={styles.barCol}>
                <Text style={styles.barValue}>{amount}</Text>
                <View style={[styles.bar, { height: Math.max(36, (amount / max) * 128), backgroundColor: index > 3 ? Colors.success : Colors.navy }]} />
                <Text style={styles.barLabel}>J-{6 - index}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Revenus publicitaires</Text>
          {partnerAds.map((ad) => (
            <View key={ad.id} style={styles.adLine}>
              <View style={{ flex: 1 }}>
                <Text style={styles.lineTitle}>{ad.advertiser}</Text>
                <Text style={styles.lineMeta}>{ad.impressionsToday.toLocaleString()} vues · {ad.campaignName}</Text>
              </View>
              <Text style={styles.lineAmount}>{ad.shareRevenue} €</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Transactions</Text>
          {partnerTransactions.map((tr) => (
            <View key={tr.id} style={styles.transaction}>
              <View style={styles.transactionIcon}>
                <Feather name={tr.type === 'Sprays' ? 'droplet' : 'monitor'} size={15} color={Colors.navy} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.lineTitle}>{tr.label}</Text>
                <Text style={styles.lineMeta}>{tr.type} · {tr.date}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.lineAmount}>{tr.amount} €</Text>
                <Text style={tr.status === 'Validé' ? styles.valid : styles.pending}>{tr.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function RevenueBox({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: number }) {
  return (
    <View style={styles.revenueBox}>
      <Feather name={icon} size={17} color={Colors.navy} />
      <Text style={styles.revenueValue}>{value.toLocaleString()} €</Text>
      <Text style={styles.revenueLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.navyTint },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 18 },
  title: { fontFamily: FontFamily.black, fontSize: 24, color: Colors.black },
  subtitle: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.gray500, marginTop: 4 },
  totalCard: { backgroundColor: Colors.navy, borderRadius: 22, padding: 20, marginBottom: 12 },
  totalTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  totalLabel: { fontFamily: FontFamily.medium, fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  total: { fontFamily: FontFamily.black, fontSize: 34, color: Colors.white, marginTop: 6 },
  exportButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, height: 36, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.14)' },
  exportText: { fontFamily: FontFamily.bold, fontSize: 12, color: Colors.white },
  progressTrack: { height: 9, backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 999, overflow: 'hidden', marginTop: 18 },
  progressFill: { height: '100%', backgroundColor: Colors.success, borderRadius: 999 },
  progressText: { fontFamily: FontFamily.medium, fontSize: 11, color: 'rgba(255,255,255,0.68)', marginTop: 9 },
  kpiRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  revenueBox: { flex: 1, backgroundColor: Colors.white, borderRadius: 18, padding: 14 },
  revenueValue: { fontFamily: FontFamily.bold, fontSize: 17, color: Colors.black, marginTop: 10 },
  revenueLabel: { fontFamily: FontFamily.medium, fontSize: 11, color: Colors.gray500, marginTop: 2 },
  card: { backgroundColor: Colors.white, borderRadius: 18, padding: 16, marginBottom: 12 },
  sectionTitle: { fontFamily: FontFamily.bold, fontSize: 15, color: Colors.black, marginBottom: 14 },
  chart: { height: 184, flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  barValue: { fontFamily: FontFamily.bold, fontSize: 10, color: Colors.gray500, marginBottom: 6 },
  bar: { width: '100%', borderRadius: 9 },
  barLabel: { fontFamily: FontFamily.medium, fontSize: 10, color: Colors.gray400, marginTop: 6 },
  adLine: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.gray100 },
  transaction: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.gray100 },
  transactionIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: Colors.navySoft, alignItems: 'center', justifyContent: 'center' },
  lineTitle: { fontFamily: FontFamily.bold, fontSize: 13, color: Colors.black },
  lineMeta: { fontFamily: FontFamily.regular, fontSize: 11, color: Colors.gray500, marginTop: 2 },
  lineAmount: { fontFamily: FontFamily.bold, fontSize: 14, color: Colors.black },
  valid: { fontFamily: FontFamily.bold, fontSize: 10, color: Colors.success, marginTop: 2 },
  pending: { fontFamily: FontFamily.bold, fontSize: 10, color: Colors.warning, marginTop: 2 },
});
