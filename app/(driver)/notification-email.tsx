import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import Button from '../../components/ui/Button';

export default function NotificationEmailScreen() {
  const insets = useSafeAreaInsets();
  const [newEmail, setNewEmail] = useState('');

  const handleUpdate = () => {
    if (!newEmail.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email.');
      return;
    }
    Alert.alert('Succès', 'Un email de vérification a été envoyé.', [
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
        <Text style={styles.headerTitle}>Email de notification</Text>
        <View style={styles.headerBtnPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20 }}
      >
        <View style={styles.content}>
          {/* Current email card */}
          <View style={styles.emailCard}>
            <View style={styles.emailCardHeader}>
              <Feather name="mail" size={18} color={Colors.navy} />
              <Text style={styles.emailCardLabel}>Email actuel</Text>
            </View>
            <View style={styles.emailRow}>
              <Text style={styles.emailText}>marie.dupont@email.com</Text>
              <View style={styles.verifiedBadge}>
                <Feather name="check-circle" size={14} color={Colors.success} />
                <Text style={styles.verifiedText}>Vérifié</Text>
              </View>
            </View>
          </View>

          {/* New email */}
          <View style={styles.formCard}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Nouvel email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={newEmail}
                  onChangeText={setNewEmail}
                  placeholder="Entrez votre nouvel email"
                  placeholderTextColor={Colors.gray400}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.infoRow}>
              <Feather name="info" size={14} color={Colors.info} />
              <Text style={styles.infoText}>
                Un email de vérification sera envoyé à votre nouvelle adresse.
              </Text>
            </View>
          </View>

          {/* Update button */}
          <View style={styles.buttonWrap}>
            <Button size="lg" onPress={handleUpdate}>
              {"Mettre à jour l'email"}
            </Button>
          </View>
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
  headerBtnPlaceholder: { width: 40 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.navy,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  // Current email card
  emailCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    ...Shadows.sm,
  },
  emailCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  emailCardLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.gray500,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emailText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.black,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.successSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.success,
  },

  // Form
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    ...Shadows.sm,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.gray500,
    marginBottom: 6,
    marginLeft: 4,
  },
  inputWrapper: {
    backgroundColor: Colors.navyTint,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.black,
    padding: 0,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.infoSoft,
    borderRadius: 12,
    padding: 12,
  },
  infoText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.info,
    lineHeight: 18,
  },

  buttonWrap: {
    marginTop: 24,
    alignItems: 'center',
  },
});
