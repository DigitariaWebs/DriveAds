import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import PartnerSignOutButton from '../../components/PartnerSignOutButton';
import {
  fetchPartnerPayouts,
  fetchRevenueHistory,
  fetchRevenueSummary,
  type DailyRevenueRow,
  type PartnerPayout,
  type RevenueSummary,
} from '../../lib/revenue-api';

const eur = (cents: number) =>
  (cents / 100).toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const FR_MONTHS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

function monthLabel(month: string): string {
  const [y, m] = month.split('-').map(Number);
  if (!y || !m) return month;
  return `${FR_MONTHS[m - 1]} ${y}`;
}

function dayLabel(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export default function PartnerRevenueScreen() {
  const insets = useSafeAreaInsets();
  const [summary, setSummary] = useState<RevenueSummary | null>(null);
  const [history, setHistory] = useState<DailyRevenueRow[]>([]);
  const [payouts, setPayouts] = useState<PartnerPayout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchRevenueSummary(),
      fetchRevenueHistory(7),
      fetchPartnerPayouts(),
    ])
      .then(([s, h, p]) => {
        if (cancelled) return;
        setSummary(s);
        setHistory(h);
        setPayouts(p);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <View style={[styles.screen, styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={Colors.navy} />
      </View>
    );
  }
  if (!summary) {
    return (
      <View style={[styles.screen, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.subtitle}>Impossible de charger.</Text>
      </View>
    );
  }

  const total = summary.currentMonth.totalCents;
  const target = summary.monthlyTargetCents ?? 0;
  const progress = target > 0 ? Math.min(100, Math.round((total / target) * 100)) : 0;
  const max = Math.max(...history.map((r) => r.totalCents), 1);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Revenus</Text>
            <Text style={styles.subtitle}>
              {monthLabel(summary.currentMonth.month)}
            </Text>
          </View>
          <PartnerSignOutButton />
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total mensuel</Text>
          <Text style={styles.total}>{eur(total)} €</Text>
          {target > 0 && (
            <>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {progress}% de l'objectif ({eur(target)} €)
              </Text>
            </>
          )}
          {summary.nextScheduled && (
            <Text style={styles.payoutText}>
              Paiement {monthLabel(summary.nextScheduled.month)} prévu le{' '}
              {new Date(summary.nextScheduled.scheduledFor).toLocaleDateString(
                'fr-FR',
              )}
            </Text>
          )}
        </View>

        <View style={styles.kpiRow}>
          <RevenueBox
            icon="droplet"
            label="Sprays"
            value={summary.currentMonth.sprayCents}
          />
          <RevenueBox
            icon="monitor"
            label="Pubs"
            value={summary.currentMonth.adCents}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Évolution 7 jours</Text>
          {history.length === 0 ? (
            <Text style={styles.empty}>Aucune donnée.</Text>
          ) : (
            <View style={styles.chart}>
              {history.map((row, i) => (
                <View key={row.date} style={styles.barCol}>
                  <Text style={styles.barValue}>{eur(row.totalCents)}</Text>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(8, (row.totalCents / max) * 128),
                        backgroundColor:
                          i === history.length - 1 ? Colors.success : Colors.navy,
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>{dayLabel(row.date)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Détail par borne</Text>
          {summary.currentMonth.perTerminal.length === 0 ? (
            <Text style={styles.empty}>Aucune activité ce mois.</Text>
          ) : (
            summary.currentMonth.perTerminal.map((line) => (
              <View key={line.terminalId} style={styles.terminalLine}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lineTitle}>
                    {line.terminalName ?? line.terminalId}
                  </Text>
                  <Text style={styles.lineMeta}>
                    {line.spraysCount} sprays ·{' '}
                    {line.impressions.toLocaleString('fr-FR')} vues
                  </Text>
                </View>
                <Text style={styles.lineAmount}>{eur(line.totalCents)} €</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Paiements</Text>
          {payouts.length === 0 ? (
            <Text style={styles.empty}>Aucun paiement encore.</Text>
          ) : (
            payouts.map((p) => (
              <View key={p.id} style={styles.payoutLine}>
                <View style={styles.payoutIcon}>
                  <Feather
                    name={p.status === 'paid' ? 'check' : 'clock'}
                    size={14}
                    color={p.status === 'paid' ? Colors.success : Colors.warning}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lineTitle}>{monthLabel(p.month)}</Text>
                  <Text style={styles.lineMeta}>
                    {p.status === 'paid'
                      ? `Payé le ${new Date(p.paidAt!).toLocaleDateString('fr-FR')}`
                      : `Prévu le ${new Date(p.scheduledFor).toLocaleDateString('fr-FR')}`}
                    {p.payoutReference ? ` · ${p.payoutReference}` : ''}
                  </Text>
                </View>
                <Text style={styles.lineAmount}>{eur(p.totalCents)} €</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.infoCard}>
          <Feather name="info" size={16} color={Colors.navy} />
          <Text style={styles.infoText}>
            Téléchargez vos relevés mensuels (PDF/CSV) depuis le tableau de bord
            web.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function RevenueBox({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: number;
}) {
  return (
    <View style={styles.revenueBox}>
      <Feather name={icon} size={17} color={Colors.navy} />
      <Text style={styles.revenueValue}>{eur(value)} €</Text>
      <Text style={styles.revenueLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.navyTint },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 18,
  },
  title: { fontFamily: FontFamily.black, fontSize: 24, color: Colors.black },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 4,
  },
  totalCard: {
    backgroundColor: Colors.navy,
    borderRadius: 22,
    padding: 20,
    marginBottom: 12,
  },
  totalLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
  },
  total: {
    fontFamily: FontFamily.black,
    fontSize: 34,
    color: Colors.white,
    marginTop: 6,
  },
  progressTrack: {
    height: 9,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 18,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 999,
  },
  progressText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.68)',
    marginTop: 9,
  },
  payoutText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.68)',
    marginTop: 6,
  },
  kpiRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  revenueBox: { flex: 1, backgroundColor: Colors.white, borderRadius: 18, padding: 14 },
  revenueValue: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.black,
    marginTop: 10,
  },
  revenueLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 2,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.black,
    marginBottom: 14,
  },
  chart: { height: 184, flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  barValue: {
    fontFamily: FontFamily.bold,
    fontSize: 9,
    color: Colors.gray500,
    marginBottom: 6,
  },
  bar: { width: '100%', borderRadius: 9 },
  barLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: Colors.gray400,
    marginTop: 6,
  },
  terminalLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  payoutLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  payoutIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: Colors.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineTitle: { fontFamily: FontFamily.bold, fontSize: 13, color: Colors.black },
  lineMeta: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 2,
  },
  lineAmount: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.black,
  },
  empty: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray500,
    textAlign: 'center',
    paddingVertical: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.navySoft,
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.navy,
  },
});
