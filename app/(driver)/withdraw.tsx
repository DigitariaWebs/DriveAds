import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';

const PRESETS = [
  { label: '100 €', value: '100' },
  { label: '250 €', value: '250' },
  { label: '500 €', value: '500' },
  { label: 'Tout', value: '1250' },
];

export default function WithdrawScreen() {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('');

  const handleConfirm = () => {
    Alert.alert('Succès', 'Demande de retrait envoyée !', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Retirer des fonds</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20 }}
      >
        {/* Balance display */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Solde disponible</Text>
          <Text style={styles.balanceAmount}>1 250 €</Text>
        </View>

        {/* Amount input */}
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

        {/* Preset chips */}
        <View style={styles.presetsRow}>
          {PRESETS.map((preset) => (
            <TouchableOpacity
              key={preset.label}
              style={[
                styles.presetChip,
                amount === preset.value && styles.presetChipActive,
              ]}
              onPress={() => setAmount(preset.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.presetText,
                  amount === preset.value && styles.presetTextActive,
                ]}
              >
                {preset.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bank info card */}
        <TouchableOpacity style={styles.bankCard} activeOpacity={0.7}>
          <View style={styles.bankIconWrap}>
            <Feather name="credit-card" size={18} color={Colors.navy} />
          </View>
          <View style={styles.bankInfo}>
            <Text style={styles.bankTitle}>Compte bancaire</Text>
            <Text style={styles.bankIban}>FR76 •••• •••• •••• 4821</Text>
            <Text style={styles.bankName}>BNP Paribas</Text>
          </View>
          <Feather name="chevron-right" size={18} color={Colors.gray400} />
        </TouchableOpacity>

        {/* Fees note */}
        <View style={styles.feesContainer}>
          <Feather name="info" size={14} color={Colors.gray400} />
          <Text style={styles.feesText}>Commission : 0 € · Délai : 2-3 jours ouvrés</Text>
        </View>
      </ScrollView>

      {/* Confirm button */}
      <View style={[styles.bottomContainer, { paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20 }]}>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.8}>
          <Text style={styles.confirmText}>Confirmer le retrait</Text>
        </TouchableOpacity>
      </View>
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

  // Balance
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

  // Amount input
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

  // Presets
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  presetChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  presetChipActive: {
    backgroundColor: Colors.navy,
  },
  presetText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.navy,
  },
  presetTextActive: {
    color: Colors.white,
  },

  // Bank card
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
  bankInfo: {
    flex: 1,
  },
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

  // Fees
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

  // Bottom button
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
