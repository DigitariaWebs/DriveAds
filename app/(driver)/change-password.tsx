import { useState, useMemo } from 'react';
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

type Requirement = {
  label: string;
  met: boolean;
};

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const requirements: Requirement[] = useMemo(
    () => [
      { label: 'Au moins 8 caractères', met: newPassword.length >= 8 },
      { label: 'Une lettre majuscule', met: /[A-Z]/.test(newPassword) },
      { label: 'Un chiffre', met: /[0-9]/.test(newPassword) },
      { label: 'Un caractère spécial', met: /[^A-Za-z0-9]/.test(newPassword) },
    ],
    [newPassword]
  );

  const metCount = requirements.filter((r) => r.met).length;

  const strengthColor =
    metCount <= 1 ? Colors.danger : metCount <= 3 ? Colors.warning : Colors.success;

  const strengthWidth = `${(metCount / requirements.length) * 100}%` as const;

  const handleUpdate = () => {
    if (!currentPassword) {
      Alert.alert('Erreur', 'Veuillez entrer votre mot de passe actuel.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }
    if (metCount < requirements.length) {
      Alert.alert('Erreur', 'Le mot de passe ne respecte pas toutes les exigences.');
      return;
    }
    Alert.alert('Succès', 'Votre mot de passe a été mis à jour.', [
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
        <Text style={styles.headerTitle}>Mot de passe</Text>
        <View style={styles.headerBtnPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20 }}
      >
        <View style={styles.content}>
          <View style={styles.formCard}>
            {/* Current password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Mot de passe actuel</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Entrez votre mot de passe actuel"
                  placeholderTextColor={Colors.gray400}
                  secureTextEntry={!showCurrent}
                />
                <TouchableOpacity
                  onPress={() => setShowCurrent(!showCurrent)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather
                    name={showCurrent ? 'eye' : 'eye-off'}
                    size={18}
                    color={Colors.gray400}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Nouveau mot de passe</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Entrez un nouveau mot de passe"
                  placeholderTextColor={Colors.gray400}
                  secureTextEntry={!showNew}
                />
                <TouchableOpacity
                  onPress={() => setShowNew(!showNew)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather
                    name={showNew ? 'eye' : 'eye-off'}
                    size={18}
                    color={Colors.gray400}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Strength indicator */}
            {newPassword.length > 0 && (
              <View style={styles.strengthWrap}>
                <View style={styles.strengthTrack}>
                  <View
                    style={[
                      styles.strengthBar,
                      { width: strengthWidth, backgroundColor: strengthColor },
                    ]}
                  />
                </View>
              </View>
            )}

            {/* Confirm password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Confirmer le nouveau mot de passe</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirmez le mot de passe"
                  placeholderTextColor={Colors.gray400}
                  secureTextEntry={!showConfirm}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm(!showConfirm)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather
                    name={showConfirm ? 'eye' : 'eye-off'}
                    size={18}
                    color={Colors.gray400}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Requirements */}
            <View style={styles.requirementsList}>
              {requirements.map((req) => (
                <View key={req.label} style={styles.requirementRow}>
                  <Feather
                    name={req.met ? 'check-circle' : 'circle'}
                    size={16}
                    color={req.met ? Colors.success : Colors.gray300}
                  />
                  <Text
                    style={[
                      styles.requirementText,
                      req.met && styles.requirementTextMet,
                    ]}
                  >
                    {req.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Update button */}
          <View style={styles.buttonWrap}>
            <Button size="lg" onPress={handleUpdate}>
              Mettre à jour
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

  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    ...Shadows.sm,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.gray500,
    marginBottom: 6,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.navyTint,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.black,
    padding: 0,
  },

  // Strength
  strengthWrap: {
    marginBottom: 16,
    marginTop: -8,
  },
  strengthTrack: {
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
  },

  // Requirements
  requirementsList: {
    gap: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.gray400,
  },
  requirementTextMet: {
    color: Colors.success,
  },

  buttonWrap: {
    marginTop: 24,
    alignItems: 'center',
  },
});
