import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import GradientHeader from '../../components/GradientHeader';

const { width } = Dimensions.get('window');

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

export default function PaymentsScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20 }}
      >
        <GradientHeader
          title="Paiements"
          subtitle="Votre solde et vos transactions"
        />

        {/* ─── Stacked wallet cards ──────────────────────── */}
        <View style={styles.walletArea}>
          {/* Background peek cards */}
          <View style={[styles.peekCard, styles.peekCard1]}>
            <Text style={styles.peekBrand}>Nike Air Max</Text>
            <Text style={styles.peekType}>Campagne</Text>
          </View>
          <View style={[styles.peekCard, styles.peekCard2]}>
            <Text style={styles.peekBrand}>Samsung Galaxy</Text>
            <Text style={styles.peekType}>Campagne</Text>
          </View>

          {/* Main balance card */}
          <LinearGradient
            colors={[Colors.navyDark, Colors.navy, Colors.navyLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mainCard}
          >
            <View style={styles.mainCardTop}>
              <Text style={styles.mainCardLabel}>Solde disponible</Text>
              <View style={styles.cardChip}>
                <Feather name="credit-card" size={12} color={Colors.white} />
              </View>
            </View>

            <Text style={styles.mainCardAmount}>1 250,00 €</Text>

            <View style={styles.mainCardBottom}>
              <View style={styles.pendingRow}>
                <Text style={styles.pendingLabel}>En attente</Text>
                <Text style={styles.pendingAmount}>280 €</Text>
              </View>
              <View style={styles.cardDots}>
                <Text style={styles.cardDotsText}>Publeader</Text>
                <Text style={styles.cardNumber}>•••• 4821</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* ─── Quick actions ─────────────────────────────── */}
        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.7}
            onPress={() => router.push('/(driver)/withdraw')}
          >
            <Feather name="download" size={20} color={Colors.navy} />
            <Text style={styles.actionLabel}>Retirer</Text>
          </TouchableOpacity>
          <View style={styles.actionDivider} />
          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.7}
            onPress={() => router.push('/(driver)/statement')}
          >
            <Feather name="file-text" size={20} color={Colors.navy} />
            <Text style={styles.actionLabel}>Relevé</Text>
          </TouchableOpacity>
          <View style={styles.actionDivider} />
          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.7}
            onPress={() => router.push('/(driver)/stats')}
          >
            <Feather name="bar-chart-2" size={20} color={Colors.navy} />
            <Text style={styles.actionLabel}>Statistiques</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Stats cards — flat monochrome ─────────────── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Feather name="trending-up" size={16} color={Colors.gray500} />
            <Text style={styles.statValue}>4 320 €</Text>
            <Text style={styles.statLabel}>Total gagné</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="award" size={16} color={Colors.gray500} />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Campagnes</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="clock" size={16} color={Colors.gray500} />
            <Text style={styles.statValue}>280 €</Text>
            <Text style={styles.statLabel}>En attente</Text>
          </View>
        </View>

        {/* ─── Transactions ──────────────────────────────── */}
        <View style={styles.txSection}>
          <View style={styles.txHeader}>
            <Text style={styles.txSectionTitle}>Historique</Text>
            <TouchableOpacity onPress={() => router.push('/(driver)/statement')}>
              <Text style={styles.txSeeAll}>Tout voir</Text>
            </TouchableOpacity>
          </View>

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
                  <View style={styles.txIcon}>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F6F2' },

  // ─── Wallet stacked cards ─────────────────────────────────
  walletArea: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 24,
    height: 240,
  },
  peekCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 180,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  peekCard1: {
    top: 16,
    backgroundColor: '#E8EAF4',
    zIndex: 1,
  },
  peekCard2: {
    top: 28,
    backgroundColor: '#D5DAF0',
    zIndex: 2,
  },
  peekBrand: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.navy,
    opacity: 0.6,
  },
  peekType: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.navy,
    opacity: 0.4,
  },

  mainCard: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    borderRadius: 20,
    padding: 20,
    zIndex: 3,
    ...Shadows.lg,
  },
  mainCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mainCardLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  cardChip: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCardAmount: {
    fontFamily: FontFamily.black,
    fontSize: 34,
    color: Colors.white,
    marginBottom: 16,
  },
  mainCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  pendingRow: {},
  pendingLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
  },
  pendingAmount: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  cardDots: {
    alignItems: 'flex-end',
  },
  cardDotsText: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
  },
  cardNumber: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },

  // ─── Quick actions — flat monochrome ──────────────────────
  actionsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingVertical: 14,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.gray100,
    ...Shadows.sm,
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  actionDivider: {
    width: 1,
    backgroundColor: Colors.gray100,
    marginVertical: 4,
  },
  actionLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: Colors.gray700,
  },

  // ─── Stats — flat monochrome ──────────────────────────────
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.gray100,
    ...Shadows.sm,
  },
  statValue: {
    fontFamily: FontFamily.black,
    fontSize: 15,
    color: Colors.navy,
    letterSpacing: -0.2,
  },
  statLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: Colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  // ─── Transactions ─────────────────────────────────────────
  txSection: {
    paddingHorizontal: 20,
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  txSectionTitle: {
    fontFamily: FontFamily.black,
    fontSize: 16,
    color: Colors.navy,
    letterSpacing: -0.2,
  },
  txSeeAll: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: Colors.navy,
  },
  txList: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray100,
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
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray50,
  },
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
});
