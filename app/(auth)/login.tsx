import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../constants/Types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { setRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    handleQuickAccess('driver');
  };

  const handleQuickAccess = async (role: UserRole) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);
    await setRole(role);
    setLoading(false);

    if (role === 'driver') {
      router.replace('/(driver)/home');
    } else if (role === 'company') {
      router.replace('/(company)/home');
    } else {
      router.replace('/(admin)/dashboard');
    }
  };

  const handleRegister = () => {
    router.replace('/(auth)/welcome');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/welcome');
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + Spacing.md },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.iconBtn}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={20} color={Colors.navy} />
            </TouchableOpacity>
            <View style={styles.brandPill}>
              <Feather name="truck" size={14} color={Colors.navy} />
              <Text style={styles.brandPillText}>Publeader</Text>
            </View>
            <View style={styles.iconBtn} />
          </View>

          {/* Heading */}
          <View style={styles.headingBlock}>
            <Text style={styles.title}>Ravie de vous revoir</Text>
            <Text style={styles.subtitle}>
              Connectez-vous pour retrouver vos campagnes et vos gains.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formBlock}>
            <Input
              label="Email"
              placeholder="votre@email.com"
              value={email}
              onChangeText={setEmail}
              icon="mail"
              keyboardType="email-address"
            />
            <Input
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              icon="lock"
              secureTextEntry
            />

            <TouchableOpacity style={styles.forgotRow} activeOpacity={0.7}>
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            <View style={styles.primaryBtnWrap}>
              <Button
                variant="primary"
                size="lg"
                loading={loading}
                onPress={handleLogin}
              >
                Se connecter
              </Button>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>accès démo</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Quick access */}
          <View style={styles.quickRow}>
            <QuickChip
              icon="truck"
              label="Chauffeur"
              onPress={() => handleQuickAccess('driver')}
            />
            <QuickChip
              icon="briefcase"
              label="Entreprise"
              onPress={() => handleQuickAccess('company')}
            />
            <QuickChip
              icon="shield"
              label="Admin"
              onPress={() => handleQuickAccess('admin')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom + Spacing.md, Spacing.xxl) },
        ]}
      >
        <Text style={styles.footerText}>Pas encore de compte ? </Text>
        <TouchableOpacity onPress={handleRegister} activeOpacity={0.7}>
          <Text style={styles.footerLink}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Quick access chip ───────────────────────────────────────
function QuickChip({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.quickChip}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Feather name={icon} size={16} color={Colors.navy} />
      <Text style={styles.quickChipLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.huge,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.huge,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.navyTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.navyTint,
  },
  brandPillText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.navy,
  },

  // Heading
  headingBlock: {
    marginBottom: Spacing.huge,
  },
  title: {
    fontFamily: FontFamily.black,
    fontSize: 30,
    lineHeight: 36,
    color: Colors.navy,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.bodyLarge,
    color: Colors.gray500,
  },

  // Form
  formBlock: {
    marginBottom: Spacing.xl,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: -Spacing.sm,
    marginBottom: Spacing.xl,
  },
  forgotText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: Colors.navy,
  },
  primaryBtnWrap: {
    marginTop: Spacing.sm,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray200,
  },
  dividerText: {
    ...Typography.caption,
    color: Colors.gray400,
    marginHorizontal: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Quick access
  quickRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.navyTint,
    borderWidth: 1,
    borderColor: Colors.navySoft,
  },
  quickChipLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: Colors.navy,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    backgroundColor: Colors.white,
  },
  footerText: {
    ...Typography.body,
    color: Colors.gray500,
  },
  footerLink: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.navy,
  },
});
