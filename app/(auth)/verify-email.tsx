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
import { Spacing, Radius } from '../../constants/Spacing';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { authClient } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function VerifyEmailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = (params.email ?? '').toString();
  const { refresh } = useAuth();
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (!otp.trim() || otp.trim().length < 6) {
      Alert.alert('Erreur', 'Saisissez le code à 6 chiffres reçu par email.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await authClient.emailOtp.verifyEmail({
        email,
        otp: otp.trim(),
      });
      if (res.error) {
        throw new Error(res.error.message ?? 'Code invalide');
      }
      await refresh();
      router.replace('/(auth)/pending');
    } catch (e: any) {
      Alert.alert('Vérification échouée', e?.message ?? 'Code invalide.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'email-verification',
      });
      Alert.alert('Code renvoyé', 'Vérifiez votre boîte mail.');
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Impossible de renvoyer le code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + Spacing.lg },
          ]}
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
            <Feather name="mail" size={32} color={Colors.navy} />
          </View>

          <Text style={styles.title}>Vérifiez votre email</Text>
          <Text style={styles.subtitle}>
            Saisissez le code à 6 chiffres envoyé à{' '}
            <Text style={styles.email}>{email}</Text>.
          </Text>

          <Input
            label="Code de vérification"
            placeholder="123456"
            value={otp}
            onChangeText={(v) => setOtp(v.replace(/\D/g, '').slice(0, 6))}
            icon="key"
            keyboardType="number-pad"
          />

          <View style={{ marginTop: Spacing.lg }}>
            <Button
              variant="primary"
              size="lg"
              loading={submitting}
              onPress={handleVerify}
            >
              Vérifier
            </Button>
          </View>

          <TouchableOpacity
            style={styles.resendRow}
            onPress={handleResend}
            disabled={resending}
            activeOpacity={0.7}
          >
            <Text style={styles.resendText}>
              {resending ? 'Envoi…' : 'Renvoyer le code'}
            </Text>
          </TouchableOpacity>
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
  title: {
    ...Typography.h1,
    color: Colors.navy,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.gray500,
    marginBottom: Spacing.xl,
  },
  email: { fontFamily: FontFamily.semiBold, color: Colors.navy },
  resendRow: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  resendText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.navy,
  },
});
