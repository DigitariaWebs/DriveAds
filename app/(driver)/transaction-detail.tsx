import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';

type TransactionData = {
  id: string;
  brand: string;
  amount: string;
  date: string;
  fullDate: string;
  pending: boolean;
  type: string;
  reference: string;
  method: string;
  timeline: { label: string; date: string }[];
};

const TX_DATA: Record<string, TransactionData> = {
  '1': {
    id: '1',
    brand: 'Nike Air Max 2026',
    amount: '+350 €',
    date: '10 avr. 2026',
    fullDate: '10 avril 2026',
    pending: false,
    type: 'Paiement campagne',
    reference: 'TX-2026-04-001',
    method: 'Virement bancaire',
    timeline: [
      { label: 'Campagne terminée', date: '8 avr. 2026' },
      { label: 'Paiement initié', date: '9 avr. 2026' },
      { label: 'Paiement reçu', date: '10 avr. 2026' },
    ],
  },
  '2': {
    id: '2',
    brand: 'Samsung Galaxy',
    amount: '+460 €',
    date: '2 avr. 2026',
    fullDate: '2 avril 2026',
    pending: false,
    type: 'Paiement campagne',
    reference: 'TX-2026-04-002',
    method: 'Virement bancaire',
    timeline: [
      { label: 'Campagne terminée', date: '31 mars 2026' },
      { label: 'Paiement initié', date: '1 avr. 2026' },
      { label: 'Paiement reçu', date: '2 avr. 2026' },
    ],
  },
  '3': {
    id: '3',
    brand: 'Coca-Cola Summer',
    amount: '+280 €',
    date: '28 mars 2026',
    fullDate: '28 mars 2026',
    pending: true,
    type: 'Paiement campagne',
    reference: 'TX-2026-03-003',
    method: 'Virement bancaire',
    timeline: [
      { label: 'Campagne terminée', date: '26 mars 2026' },
      { label: 'Paiement initié', date: '27 mars 2026' },
    ],
  },
  '4': {
    id: '4',
    brand: 'Nike Running Caen',
    amount: '+250 €',
    date: '15 mars 2026',
    fullDate: '15 mars 2026',
    pending: false,
    type: 'Paiement campagne',
    reference: 'TX-2026-03-004',
    method: 'Virement bancaire',
    timeline: [
      { label: 'Campagne terminée', date: '13 mars 2026' },
      { label: 'Paiement initié', date: '14 mars 2026' },
      { label: 'Paiement reçu', date: '15 mars 2026' },
    ],
  },
  '5': {
    id: '5',
    brand: 'Retrait bancaire',
    amount: '-800 €',
    date: '1 mars 2026',
    fullDate: '1 mars 2026',
    pending: false,
    type: 'Retrait',
    reference: 'TX-2026-03-005',
    method: 'Virement bancaire',
    timeline: [
      { label: 'Demande de retrait', date: '28 fév. 2026' },
      { label: 'Virement effectué', date: '1 mars 2026' },
    ],
  },
};

const DEFAULT_TX: TransactionData = {
  id: '0',
  brand: 'Transaction inconnue',
  amount: '0 €',
  date: '',
  fullDate: '',
  pending: false,
  type: 'Inconnu',
  reference: '-',
  method: '-',
  timeline: [],
};

export default function TransactionDetailScreen() {
  const insets = useSafeAreaInsets();
  const { txId } = useLocalSearchParams<{ txId: string }>();
  const tx = TX_DATA[txId ?? ''] ?? DEFAULT_TX;
  const isWithdraw = tx.amount.startsWith('-');
  const isPending = tx.pending;

  const detailRows = [
    { label: 'Campagne', value: tx.brand },
    { label: 'Date', value: tx.fullDate },
    { label: 'Type', value: tx.type },
    { label: 'Référence', value: tx.reference },
    { label: 'Méthode', value: tx.method },
  ];

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détail transaction</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20 }}
      >
        {/* Status icon */}
        <View style={styles.statusSection}>
          <View style={[styles.statusIconWrap, isPending ? styles.statusIconPending : styles.statusIconDone]}>
            <Feather
              name={isPending ? 'clock' : 'check-circle'}
              size={36}
              color={isPending ? Colors.warning : Colors.success}
            />
          </View>

          {/* Amount */}
          <Text style={[styles.amount, isWithdraw && { color: Colors.danger }]}>{tx.amount}</Text>

          {/* Status badge */}
          <View style={[styles.statusBadge, isPending ? styles.statusBadgePending : styles.statusBadgeDone]}>
            <Text style={[styles.statusBadgeText, isPending ? { color: Colors.warning } : { color: Colors.success }]}>
              {isPending ? 'En attente' : 'Complété'}
            </Text>
          </View>
        </View>

        {/* Details card */}
        <View style={styles.detailsCard}>
          {detailRows.map((row, i) => (
            <View
              key={row.label}
              style={[styles.detailRow, i < detailRows.length - 1 && styles.detailRowBorder]}
            >
              <Text style={styles.detailLabel}>{row.label}</Text>
              <Text style={styles.detailValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Timeline card */}
        {tx.timeline.length > 0 && (
          <View style={styles.timelineCard}>
            <Text style={styles.timelineTitle}>Chronologie</Text>
            {tx.timeline.map((step, i) => (
              <View key={i} style={styles.timelineRow}>
                <View style={styles.timelineDotCol}>
                  <View style={[styles.timelineDot, i === tx.timeline.length - 1 && styles.timelineDotActive]} />
                  {i < tx.timeline.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>{step.label}</Text>
                  <Text style={styles.timelineDate}>{step.date}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Report button */}
        <View style={styles.reportContainer}>
          <TouchableOpacity
            style={styles.reportBtn}
            onPress={() => Alert.alert('Info', 'Fonctionnalité bientôt disponible')}
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

  // Status section
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
  statusIconDone: {
    backgroundColor: Colors.successSoft,
  },
  statusIconPending: {
    backgroundColor: Colors.warningSoft,
  },
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
  statusBadgeDone: {
    backgroundColor: Colors.successSoft,
  },
  statusBadgePending: {
    backgroundColor: Colors.warningSoft,
  },
  statusBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
  },

  // Details card
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

  // Timeline card
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
  timelineRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineDotCol: {
    alignItems: 'center',
    width: 16,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.gray300,
    marginTop: 2,
  },
  timelineDotActive: {
    backgroundColor: Colors.navy,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.gray200,
    marginVertical: 2,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
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

  // Report button
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
