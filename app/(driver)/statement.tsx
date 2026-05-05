import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import { fetchStatement, type StatementSummary } from '../../lib/payments-api';
import { formatEur } from '../../lib/money';
import { authClient } from '../../lib/api';

const baseURL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

const MONTHS_FR_SHORT = [
  'janv.', 'fév.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
];

function fmtShortDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_FR_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

export default function StatementScreen() {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<StatementSummary | null>(null);
  const [period, setPeriod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const load = useCallback(async (p?: string) => {
    setLoading(true);
    try {
      const res = await fetchStatement(p);
      setData(res);
      setPeriod(res.period);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDownload = async () => {
    if (!period) return;
    setDownloading(true);
    try {
      const cookie = authClient.getCookie();
      const url = `${baseURL}/api/me/statements/${period}`;
      const target = `${FileSystem.cacheDirectory}releve-${period}.pdf`;
      const dl = await FileSystem.downloadAsync(url, target, {
        headers: cookie ? { Cookie: cookie } : undefined,
      });
      if (dl.status !== 200) {
        throw new Error(`HTTP ${dl.status}`);
      }
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(dl.uri, {
          mimeType: 'application/pdf',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('Téléchargé', `Fichier disponible : ${dl.uri}`);
      }
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Téléchargement échoué.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Relevé de compte</Text>
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
            onRefresh={() => load(period ?? undefined)}
            tintColor={Colors.navy}
          />
        }
      >
        {/* Period selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.monthsRow}
        >
          {(data?.periods ?? []).map((p) => (
            <TouchableOpacity
              key={p.period}
              style={[
                styles.monthPill,
                period === p.period && styles.monthPillActive,
              ]}
              onPress={() => load(p.period)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.monthText,
                  period === p.period && styles.monthTextActive,
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Revenus</Text>
              <Text style={[styles.summaryValue, { color: Colors.success }]}>
                {formatEur(data?.incomeCents ?? 0, { withSign: true })}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Retraits</Text>
              <Text style={[styles.summaryValue, { color: Colors.danger }]}>
                -{formatEur(data?.withdrawnCents ?? 0)}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Solde net</Text>
              <Text style={[styles.summaryValue, { color: Colors.navy }]}>
                {formatEur(data?.netCents ?? 0, { withSign: true })}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.txSection}>
          <Text style={styles.txSectionTitle}>Transactions</Text>
          {(data?.transactions.length ?? 0) === 0 ? (
            <View style={styles.empty}>
              <Feather name="inbox" size={28} color={Colors.gray400} />
              <Text style={styles.emptyText}>
                Aucune transaction sur cette période.
              </Text>
            </View>
          ) : (
            <View style={styles.txList}>
              {(data?.transactions ?? []).map((tx, i, arr) => {
                const isDebit = tx.amountCents < 0;
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
                    <View
                      style={[
                        styles.txIcon,
                        isDebit ? styles.txIconWithdraw : styles.txIconIncome,
                      ]}
                    >
                      <Feather
                        name={isDebit ? 'arrow-up-right' : 'arrow-down-left'}
                        size={16}
                        color={isDebit ? Colors.danger : Colors.success}
                      />
                    </View>
                    <View style={styles.txInfo}>
                      <Text style={styles.txBrand}>{tx.description}</Text>
                      <Text style={styles.txDate}>
                        {fmtShortDate(tx.createdAt)}
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
                      {tx.tier === 'pending' && (
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

        <View style={styles.downloadContainer}>
          <TouchableOpacity
            style={[
              styles.downloadBtn,
              downloading && { opacity: 0.5 },
            ]}
            onPress={handleDownload}
            activeOpacity={0.7}
            disabled={downloading || !period}
          >
            {downloading ? (
              <ActivityIndicator color={Colors.navy} />
            ) : (
              <>
                <Feather name="download" size={16} color={Colors.navy} />
                <Text style={styles.downloadText}>
                  Télécharger le relevé PDF
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
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

  monthsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  monthPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  monthPillActive: { backgroundColor: Colors.navy },
  monthText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.navy,
  },
  monthTextActive: { color: Colors.white },

  summaryCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    ...Shadows.sm,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center', gap: 4 },
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

  txSection: { paddingHorizontal: 16, marginBottom: 24 },
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
    fontSize: 12,
    color: Colors.gray500,
  },

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
