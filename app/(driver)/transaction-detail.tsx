import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import {
  fetchTransactionDetail,
  type TransactionDetail,
} from '../../lib/payments-api';
import { formatEur } from '../../lib/money';

const MONTHS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

function fmtFullDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
}

function txTypeLabel(type: string): string {
  switch (type) {
    case 'campaign_completion':
      return 'Paiement campagne';
    case 'withdrawal_debit':
      return 'Retrait';
    case 'withdrawal_refund':
      return 'Remboursement';
    default:
      return 'Ajustement';
  }
}

function txMethodLabel(type: string): string {
  switch (type) {
    case 'campaign_completion':
      return 'Crédit interne';
    case 'withdrawal_debit':
      return 'Virement bancaire';
    case 'withdrawal_refund':
      return 'Crédit interne';
    default:
      return '-';
  }
}

export default function TransactionDetailScreen() {
  const insets = useSafeAreaInsets();
  const { txId } = useLocalSearchParams<{ txId: string }>();
  const [data, setData] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!txId) return;
    setLoading(true);
    fetchTransactionDetail(txId)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [txId]);

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator color={Colors.navy} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Feather name="arrow-left" size={22} color={Colors.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détail transaction</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.center}>
          <Text style={styles.emptyText}>Transaction introuvable</Text>
        </View>
      </View>
    );
  }

  const tx = data.transaction;
  const isDebit = tx.amountCents < 0;
  const isPending = tx.tier === 'pending';
  const isRejected = data.context.withdrawal?.status === 'rejected';

  const detailRows: { label: string; value: string }[] = [
    { label: 'Description', value: tx.description },
    { label: 'Date', value: fmtFullDate(tx.createdAt) },
    { label: 'Type', value: txTypeLabel(tx.type) },
    { label: 'Référence', value: `TX-${tx.id.slice(-8).toUpperCase()}` },
    { label: 'Méthode', value: txMethodLabel(tx.type) },
  ];
  if (data.context.withdrawal?.payoutReference) {
    detailRows.push({
      label: 'Réf. bancaire',
      value: data.context.withdrawal.payoutReference,
    });
  }
  if (data.context.withdrawal?.rejectReason) {
    detailRows.push({
      label: 'Motif rejet',
      value: data.context.withdrawal.rejectReason,
    });
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détail transaction</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20,
        }}
      >
        <View style={styles.statusSection}>
          <View
            style={[
              styles.statusIconWrap,
              isPending
                ? styles.statusIconPending
                : isRejected
                  ? styles.statusIconRejected
                  : styles.statusIconDone,
            ]}
          >
            <Feather
              name={
                isPending
                  ? 'clock'
                  : isRejected
                    ? 'x-circle'
                    : 'check-circle'
              }
              size={36}
              color={
                isPending
                  ? Colors.warning
                  : isRejected
                    ? Colors.danger
                    : Colors.success
              }
            />
          </View>

          <Text style={[styles.amount, isDebit && { color: Colors.danger }]}>
            {formatEur(tx.amountCents, { withSign: true })}
          </Text>

          <View
            style={[
              styles.statusBadge,
              isPending
                ? styles.statusBadgePending
                : isRejected
                  ? styles.statusBadgeRejected
                  : styles.statusBadgeDone,
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                isPending
                  ? { color: Colors.warning }
                  : isRejected
                    ? { color: Colors.danger }
                    : { color: Colors.success },
              ]}
            >
              {isPending ? 'En attente' : isRejected ? 'Rejeté' : 'Complété'}
            </Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          {detailRows.map((row, i) => (
            <View
              key={row.label}
              style={[
                styles.detailRow,
                i < detailRows.length - 1 && styles.detailRowBorder,
              ]}
            >
              <Text style={styles.detailLabel}>{row.label}</Text>
              <Text style={styles.detailValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {data.timeline.length > 0 && (
          <View style={styles.timelineCard}>
            <Text style={styles.timelineTitle}>Chronologie</Text>
            {data.timeline.map((step, i) => (
              <View key={i} style={styles.timelineRow}>
                <View style={styles.timelineDotCol}>
                  <View
                    style={[
                      styles.timelineDot,
                      i === data.timeline.length - 1 && styles.timelineDotActive,
                    ]}
                  />
                  {i < data.timeline.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>{step.label}</Text>
                  <Text style={styles.timelineDate}>
                    {fmtFullDate(step.date)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.reportContainer}>
          <TouchableOpacity
            style={styles.reportBtn}
            onPress={() =>
              Alert.alert('Info', 'Fonctionnalité bientôt disponible')
            }
            activeOpacity={0.7}
          >
            <Feather name="alert-circle" size={16} color={Colors.danger} />
            <Text style={styles.reportText}>Signaler un problème</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.navyTint },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: {
    fontFamily: FontFamily.regular,
    color: Colors.gray500,
  },

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

  statusSection: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 28,
  },
  statusIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statusIconDone: { backgroundColor: Colors.successSoft },
  statusIconPending: { backgroundColor: Colors.warningSoft },
  statusIconRejected: { backgroundColor: Colors.dangerSoft },
  amount: {
    fontFamily: FontFamily.black,
    fontSize: 36,
    color: Colors.success,
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
  },
  statusBadgeDone: { backgroundColor: Colors.successSoft },
  statusBadgePending: { backgroundColor: Colors.warningSoft },
  statusBadgeRejected: { backgroundColor: Colors.dangerSoft },
  statusBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
  },

  detailsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
    ...Shadows.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  detailLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.gray500,
  },
  detailValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.black,
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: 16,
  },

  timelineCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    ...Shadows.sm,
  },
  timelineTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.black,
    marginBottom: 14,
  },
  timelineRow: { flexDirection: 'row', gap: 12 },
  timelineDotCol: { alignItems: 'center', width: 16 },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.gray300,
    marginTop: 2,
  },
  timelineDotActive: { backgroundColor: Colors.navy },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.gray200,
    marginVertical: 2,
  },
  timelineContent: { flex: 1, paddingBottom: 16 },
  timelineLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.black,
    marginBottom: 2,
  },
  timelineDate: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.gray400,
  },

  reportContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.danger,
    borderRadius: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
  },
  reportText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.danger,
  },
});
