import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { authClient } from '../../lib/api';

export default function ResetPasswordScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = (params.email ?? '').toString();
  const [otp, setOtp] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReset = async () => {
    if (!otp.trim() || otp.trim().length < 6) {
      Alert.alert('Erreur', 'Saisissez le code à 6 chiffres.');
      return;
    }
    if (pwd.length < 6) {
      Alert.alert('Erreur', 'Mot de passe : 6 caractères minimum.');
      return;
    }
    if (pwd !== confirm) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await authClient.emailOtp.resetPassword({
        email,
        otp: otp.trim(),
        password: pwd,
      });
      if (res.error) {
        throw new Error(res.error.message ?? 'Réinitialisation échouée');
      }
      Alert.alert('Mot de passe réinitialisé', 'Vous pouvez vous connecter.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Code invalide.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Spacing.lg }]}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color={Colors.navy} />
          </TouchableOpacity>

          <View style={styles.iconWrap}>
            <Feather name="key" size={32} color={Colors.navy} />
          </View>

          <Text style={styles.title}>Nouveau mot de passe</Text>
          <Text style={styles.subtitle}>
            Code envoyé à <Text style={styles.email}>{email}</Text>.
          </Text>

          <Input
            label="Code de vérification"
            placeholder="123456"
            value={otp}
            onChangeText={(v) => setOtp(v.replace(/\D/g, '').slice(0, 6))}
            icon="key"
            keyboardType="number-pad"
          />
          <Input
            label="Nouveau mot de passe"
            placeholder="Minimum 6 caractères"
            value={pwd}
            onChangeText={setPwd}
            icon="lock"
            secureTextEntry
          />
          <Input
            label="Confirmer le mot de passe"
            placeholder="Retapez votre mot de passe"
            value={confirm}
            onChangeText={setConfirm}
            icon="lock"
            secureTextEntry
          />

          <View style={{ marginTop: Spacing.lg }}>
            <Button variant="primary" size="lg" loading={submitting} onPress={handleReset}>
              Réinitialiser
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.white },
  scroll: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.huge },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.navyTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.navyTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: { ...Typography.h1, color: Colors.navy, marginBottom: Spacing.sm },
  subtitle: { ...Typography.body, color: Colors.gray500, marginBottom: Spacing.xl },
  email: { fontFamily: FontFamily.semiBold, color: Colors.navy },
});
