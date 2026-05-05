import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import GradientHeader from '../../components/GradientHeader';
import { fetchWallet, type WalletResponse, type Transaction } from '../../lib/payments-api';
import { formatEur } from '../../lib/money';

const { width } = Dimensions.get('window');

const MONTHS_FR = [
  'janv.', 'fév.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
];

function fmtShortDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
}

function txTypeLabel(t: Transaction): string {
  switch (t.type) {
    case 'campaign_completion':
      return 'Campagne';
    case 'withdrawal_debit':
      return 'Retrait';
    case 'withdrawal_refund':
      return 'Remboursement';
    default:
      return 'Ajustement';
  }
}

export default function PaymentsScreen() {
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const w = await fetchWallet();
      setWallet(w);
    } catch {
      setWallet(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const balances = wallet?.balances ?? {
    availableBalanceCents: 0,
    pendingBalanceCents: 0,
    withdrawnTotalCents: 0,
  };
  const transactions = wallet?.transactions ?? [];

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20,
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={load}
            tintColor={Colors.navy}
          />
        }
      >
        <GradientHeader
          title="Paiements"
          subtitle="Votre solde et vos transactions"
        />

        <View style={styles.walletArea}>
          <View style={[styles.peekCard, styles.peekCard1]}>
            <Text style={styles.peekBrand}>En attente</Text>
            <Text style={styles.peekType}>
              {formatEur(balances.pendingBalanceCents)}
            </Text>
          </View>
          <View style={[styles.peekCard, styles.peekCard2]}>
            <Text style={styles.peekBrand}>Total retiré</Text>
            <Text style={styles.peekType}>
              {formatEur(balances.withdrawnTotalCents)}
            </Text>
          </View>

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

            <Text style={styles.mainCardAmount}>
              {formatEur(balances.availableBalanceCents)}
            </Text>

            <View style={styles.mainCardBottom}>
              <View style={styles.pendingRow}>
                <Text style={styles.pendingLabel}>En attente</Text>
                <Text style={styles.pendingAmount}>
                  {formatEur(balances.pendingBalanceCents)}
                </Text>
              </View>
              <View style={styles.cardDots}>
                <Text style={styles.cardDotsText}>Publeader</Text>
                <Text style={styles.cardNumber}>
                  {wallet?.config
                    ? `Hold ${wallet.config.pendingHoldDays}j`
                    : ''}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

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

        <View style={styles.txSection}>
          <View style={styles.txHeader}>
            <Text style={styles.txSectionTitle}>Historique</Text>
            <TouchableOpacity onPress={() => router.push('/(driver)/statement')}>
              <Text style={styles.txSeeAll}>Tout voir</Text>
            </TouchableOpacity>
          </View>

          {transactions.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="inbox" size={28} color={Colors.gray400} />
              <Text style={styles.emptyText}>Aucune transaction.</Text>
            </View>
          ) : (
            <View style={styles.txList}>
              {transactions.slice(0, 10).map((tx, i, arr) => {
                const isDebit = tx.amountCents < 0;
                const isPending = tx.tier === 'pending';
                return (
                  <TouchableOpacity
                    key={tx.id}
                    style={[
                      styles.txItem,
                      i < arr.length - 1 && styles.txBorder,
                    ]}
                    onPress={() =>
                      router.push({
                        pathname: '/(driver)/transaction-detail',
                        params: { txId: tx.id },
                      })
                    }
                    activeOpacity={0.7}
                  >
                    <View style={styles.txIcon}>
                      <Feather
                        name={isDebit ? 'arrow-up-right' : 'arrow-down-left'}
                        size={16}
                        color={isDebit ? Colors.danger : Colors.success}
                      />
                    </View>
                    <View style={styles.txInfo}>
                      <Text style={styles.txBrand}>{tx.description}</Text>
                      <Text style={styles.txDate}>
                        {fmtShortDate(tx.createdAt)} · {txTypeLabel(tx)}
                      </Text>
                    </View>
                    <View style={styles.txRight}>
                      <Text
                        style={[
                          styles.txAmount,
                          isDebit && styles.txAmountWithdraw,
                        ]}
                      >
                        {formatEur(tx.amountCents, { withSign: true })}
                      </Text>
                      {isPending && (
                        <View style={styles.txPendingBadge}>
                          <Text style={styles.txPendingText}>En attente</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F6F2' },

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
  peekCard1: { top: 16, backgroundColor: '#E8EAF4', zIndex: 1 },
  peekCard2: { top: 28, backgroundColor: '#D5DAF0', zIndex: 2 },
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
  cardDots: { alignItems: 'flex-end' },
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

  txSection: { paddingHorizontal: 20 },
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
  txRight: { alignItems: 'flex-end', gap: 3 },
  txAmount: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.success,
  },
  txAmountWithdraw: { color: Colors.danger },
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
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 30,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: 12.5,
    color: Colors.gray500,
  },
});
