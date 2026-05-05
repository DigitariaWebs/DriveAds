import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import {
  fetchWallet,
  requestWithdrawal,
  type WalletResponse,
} from '../../lib/payments-api';
import { eurToCents, formatEur } from '../../lib/money';
import { useAuth } from '../../context/AuthContext';

export default function WithdrawScreen() {
  const insets = useSafeAreaInsets();
  const { currentDriver, refresh } = useAuth();
  const [amount, setAmount] = useState(''); // raw euro input
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchWallet()
      .then(setWallet)
      .catch(() => setWallet(null))
      .finally(() => setLoading(false));
  }, []);

  const available = wallet?.balances.availableBalanceCents ?? 0;
  const minCents = wallet?.config.withdrawalMinCents ?? 5000;
  const bank = currentDriver?.bankAccount;
  const hasBank = !!bank?.iban;

  const presets: { label: string; cents: number }[] = (() => {
    const items: { label: string; cents: number }[] = [];
    if (available >= 10000) items.push({ label: '100 €', cents: 10000 });
    if (available >= 25000) items.push({ label: '250 €', cents: 25000 });
    if (available >= 50000) items.push({ label: '500 €', cents: 50000 });
    if (available > 0) items.push({ label: 'Tout', cents: available });
    return items;
  })();

  const requestedCents = eurToCents(amount);

  const handleConfirm = async () => {
    if (!hasBank) {
      Alert.alert('IBAN manquant', 'Ajoutez votre IBAN dans le profil avant de demander un retrait.', [
        { text: 'Plus tard', style: 'cancel' },
        {
          text: 'Ajouter',
          onPress: () => router.push('/(driver)/edit-profile'),
        },
      ]);
      return;
    }
    if (requestedCents < minCents) {
      Alert.alert('Montant trop bas', `Minimum ${formatEur(minCents)}`);
      return;
    }
    if (requestedCents > available) {
      Alert.alert('Solde insuffisant', `Disponible : ${formatEur(available)}`);
      return;
    }

    setSubmitting(true);
    try {
      await requestWithdrawal(requestedCents);
      await refresh();
      Alert.alert(
        'Demande envoyée',
        `Votre demande de retrait de ${formatEur(requestedCents)} a été envoyée. Délai : 2-3 jours ouvrés.`,
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Demande échouée.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator color={Colors.navy} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Retirer des fonds</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 100,
        }}
      >
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Solde disponible</Text>
          <Text style={styles.balanceAmount}>{formatEur(available)}</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            placeholderTextColor={Colors.gray300}
            keyboardType="numeric"
          />
          <Text style={styles.currencySuffix}>€</Text>
        </View>

        <View style={styles.presetsRow}>
          {presets.length === 0 ? (
            <Text style={styles.noPresets}>Aucun montant rapide disponible</Text>
          ) : (
            presets.map((p) => (
              <TouchableOpacity
                key={p.label}
                style={[
                  styles.presetChip,
                  requestedCents === p.cents && styles.presetChipActive,
                ]}
                onPress={() => setAmount(String(Math.round(p.cents / 100)))}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.presetText,
                    requestedCents === p.cents && styles.presetTextActive,
                  ]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <TouchableOpacity
          style={styles.bankCard}
          activeOpacity={0.7}
          onPress={() => router.push('/(driver)/edit-profile')}
        >
          <View style={styles.bankIconWrap}>
            <Feather name="credit-card" size={18} color={Colors.navy} />
          </View>
          <View style={styles.bankInfo}>
            {hasBank ? (
              <>
                <Text style={styles.bankTitle}>Compte bancaire</Text>
                <Text style={styles.bankIban}>
                  {bank!.iban.replace(/(.{4})/g, '$1 ').trim()}
                </Text>
                {bank?.bankName && (
                  <Text style={styles.bankName}>{bank.bankName}</Text>
                )}
              </>
            ) : (
              <>
                <Text style={[styles.bankTitle, { color: Colors.danger }]}>
                  Aucun IBAN configuré
                </Text>
                <Text style={styles.bankName}>Ajoutez-en un dans votre profil</Text>
              </>
            )}
          </View>
          <Feather name="chevron-right" size={18} color={Colors.gray400} />
        </TouchableOpacity>

        <View style={styles.feesContainer}>
          <Feather name="info" size={14} color={Colors.gray400} />
          <Text style={styles.feesText}>
            Min {formatEur(minCents)} · Délai 2-3 jours ouvrés · Commission 0 €
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomContainer,
          { paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20 },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.confirmBtn,
            (submitting || requestedCents <= 0) && { opacity: 0.5 },
          ]}
          onPress={handleConfirm}
          activeOpacity={0.8}
          disabled={submitting || requestedCents <= 0}
        >
          <Text style={styles.confirmText}>
            {submitting ? 'Envoi…' : 'Confirmer le retrait'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.navyTint },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

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

  balanceContainer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
  },
  balanceLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.gray500,
    marginBottom: 4,
  },
  balanceAmount: {
    fontFamily: FontFamily.black,
    fontSize: 28,
    color: Colors.navy,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  amountInput: {
    fontFamily: FontFamily.black,
    fontSize: 48,
    color: Colors.black,
    textAlign: 'right',
    minWidth: 80,
    paddingHorizontal: 4,
  },
  currencySuffix: {
    fontFamily: FontFamily.bold,
    fontSize: 32,
    color: Colors.gray400,
    marginTop: 4,
  },

  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  noPresets: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray500,
  },
  presetChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  presetChipActive: { backgroundColor: Colors.navy },
  presetText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.navy,
  },
  presetTextActive: { color: Colors.white },

  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 16,
    ...Shadows.sm,
  },
  bankIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankInfo: { flex: 1 },
  bankTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.black,
    marginBottom: 2,
  },
  bankIban: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.gray500,
  },
  bankName: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.gray400,
    marginTop: 1,
  },

  feesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  feesText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray500,
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: Colors.navyTint,
  },
  confirmBtn: {
    backgroundColor: Colors.navy,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    ...Shadows.md,
  },
  confirmText: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.white,
  },
});
