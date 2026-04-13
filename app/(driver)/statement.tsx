import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';

const MONTHS = ['Janv.', 'Fév.', 'Mars', 'Avr.'];

type Transaction = {
  id: string;
  brand: string;
  type: string;
  date: string;
  amount: string;
  pending?: boolean;
};

const TRANSACTIONS: Transaction[] = [
  { id: '1', brand: 'Nike Air Max 2026', type: 'Campagne', date: '10 avr. 2026', amount: '+350 €' },
  { id: '2', brand: 'Samsung Galaxy', type: 'Campagne', date: '2 avr. 2026', amount: '+460 €' },
  { id: '3', brand: 'Coca-Cola Summer', type: 'Campagne', date: '28 mars 2026', amount: '+280 €', pending: true },
  { id: '4', brand: 'Nike Running Caen', type: 'Campagne', date: '15 mars 2026', amount: '+250 €' },
  { id: '5', brand: 'Retrait bancaire', type: 'Retrait', date: '1 mars 2026', amount: '-800 €' },
];

export default function StatementScreen() {
  const insets = useSafeAreaInsets();
  const [activeMonth, setActiveMonth] = useState('Avr.');

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Relevé de compte</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20 }}
      >
        {/* Month selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.monthsRow}
        >
          {MONTHS.map((month) => (
            <TouchableOpacity
              key={month}
              style={[
                styles.monthPill,
                activeMonth === month && styles.monthPillActive,
              ]}
              onPress={() => setActiveMonth(month)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.monthText,
                  activeMonth === month && styles.monthTextActive,
                ]}
              >
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Revenus</Text>
              <Text style={[styles.summaryValue, { color: Colors.success }]}>+1 340 €</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Retraits</Text>
              <Text style={[styles.summaryValue, { color: Colors.danger }]}>-800 €</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Solde net</Text>
              <Text style={[styles.summaryValue, { color: Colors.navy }]}>+540 €</Text>
            </View>
          </View>
        </View>

        {/* Transaction list */}
        <View style={styles.txSection}>
          <Text style={styles.txSectionTitle}>Transactions</Text>
          <View style={styles.txList}>
            {TRANSACTIONS.map((tx, i) => {
              const isWithdraw = tx.amount.startsWith('-');
              return (
                <TouchableOpacity
                  key={tx.id}
                  style={[styles.txItem, i < TRANSACTIONS.length - 1 && styles.txBorder]}
                  onPress={() => router.push({ pathname: '/(driver)/transaction-detail', params: { txId: tx.id } })}
                  activeOpacity={0.7}
                >
                  <View style={[styles.txIcon, isWithdraw ? styles.txIconWithdraw : styles.txIconIncome]}>
                    <Feather
                      name={isWithdraw ? 'arrow-up-right' : 'arrow-down-left'}
                      size={16}
                      color={isWithdraw ? Colors.danger : Colors.success}
                    />
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={styles.txBrand}>{tx.brand}</Text>
                    <Text style={styles.txDate}>{tx.date} · {tx.type}</Text>
                  </View>
                  <View style={styles.txRight}>
                    <Text style={[styles.txAmount, isWithdraw && styles.txAmountWithdraw]}>
                      {tx.amount}
                    </Text>
                    {tx.pending && (
                      <View style={styles.txPendingBadge}>
                        <Text style={styles.txPendingText}>En attente</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Download button */}
        <View style={styles.downloadContainer}>
          <TouchableOpacity
            style={styles.downloadBtn}
            onPress={() => Alert.alert('Info', 'Fonctionnalité bientôt disponible')}
            activeOpacity={0.7}
          >
            <Feather name="download" size={16} color={Colors.navy} />
            <Text style={styles.downloadText}>Télécharger le relevé PDF</Text>
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

  // Month selector
  monthsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  monthPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  monthPillActive: {
    backgroundColor: Colors.navy,
  },
  monthText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.navy,
  },
  monthTextActive: {
    color: Colors.white,
  },

  // Summary card
  summaryCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    ...Shadows.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  summaryLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.gray500,
  },
  summaryValue: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.black,
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.gray100,
  },

  // Transactions
  txSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  txSectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.black,
    marginBottom: 12,
  },
  txList: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    ...Shadows.sm,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  txBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  txIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconIncome: { backgroundColor: Colors.successSoft },
  txIconWithdraw: { backgroundColor: Colors.dangerSoft },
  txInfo: { flex: 1 },
  txBrand: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.black,
  },
  txDate: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: Colors.gray400,
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  txAmount: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.success,
  },
  txAmountWithdraw: {
    color: Colors.danger,
  },
  txPendingBadge: {
    backgroundColor: Colors.warningSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 100,
  },
  txPendingText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 8,
    color: Colors.warning,
    textTransform: 'uppercase',
  },

  // Download button
  downloadContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.navy,
    borderRadius: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
  },
  downloadText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.navy,
  },
});
