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
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { authClient } from '../../lib/api';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert('Erreur', 'Saisissez votre email.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await authClient.emailOtp.sendVerificationOtp({
        email: email.trim().toLowerCase(),
        type: 'forget-password',
      });
      if (res.error) throw new Error(res.error.message ?? 'Erreur envoi');
      router.push({
        pathname: '/(auth)/reset-password',
        params: { email: email.trim().toLowerCase() },
      });
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Impossible d\'envoyer le code.');
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
            <Feather name="lock" size={32} color={Colors.navy} />
          </View>

          <Text style={styles.title}>Mot de passe oublié</Text>
          <Text style={styles.subtitle}>
            Saisissez votre email. Nous enverrons un code à 6 chiffres pour
            réinitialiser votre mot de passe.
          </Text>

          <Input
            label="Email"
            placeholder="votre@email.com"
            value={email}
            onChangeText={setEmail}
            icon="mail"
            keyboardType="email-address"
          />

          <View style={{ marginTop: Spacing.lg }}>
            <Button variant="primary" size="lg" loading={submitting} onPress={handleSend}>
              Envoyer le code
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
});
