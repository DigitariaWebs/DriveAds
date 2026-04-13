import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ImageBackground,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius } from '../../constants/Spacing';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../constants/Types';
import AppLogo from '../../components/AppLogo';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function LoginScreen() {
  const { setRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    // Mock login — default to driver
    handleQuickAccess('driver');
  };

  const handleQuickAccess = async (role: UserRole) => {
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
    Alert.alert(
      "S'inscrire",
      'Choisissez votre type de compte :',
      [
        {
          text: 'Chauffeur',
          onPress: () => router.push('/(auth)/register-driver'),
        },
        {
          text: 'Entreprise',
          onPress: () => router.push('/(auth)/register-company'),
        },
        { text: 'Annuler', style: 'cancel' },
      ],
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/login.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoSection}>
            <AppLogo size="lg" variant="white" />
            <Text style={styles.tagline}>
              Publicité mobile pour véhicules
            </Text>
          </View>

          {/* Form card */}
          <View style={styles.formCard}>
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

            <Button
              variant="primary"
              size="lg"
              loading={loading}
              onPress={handleLogin}
            >
              Se connecter
            </Button>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou accès rapide</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Quick access buttons */}
            <View style={styles.quickAccessRow}>
              <View style={styles.quickAccessBtn}>
                <Button
                  variant="outline"
                  size="sm"
                  icon="truck"
                  onPress={() => handleQuickAccess('driver')}
                >
                  Chauffeur
                </Button>
              </View>
              <View style={styles.quickAccessBtn}>
                <Button
                  variant="outline"
                  size="sm"
                  icon="briefcase"
                  onPress={() => handleQuickAccess('company')}
                >
                  Entreprise
                </Button>
              </View>
              <View style={styles.quickAccessBtn}>
                <Button
                  variant="outline"
                  size="sm"
                  icon="shield"
                  onPress={() => handleQuickAccess('admin')}
                >
                  Admin
                </Button>
              </View>
            </View>
          </View>

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>
              Pas encore de compte ?{' '}
            </Text>
            <Text style={styles.registerLink} onPress={handleRegister}>
              S'inscrire
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingTop: 80,
    paddingBottom: Spacing.huge,
  },
  // Logo section
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  tagline: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.6)',
    marginTop: Spacing.sm,
  },
  // Form card
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    padding: Spacing.xxl,
  },
  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xxl,
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
  },
  // Quick access
  quickAccessRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickAccessBtn: {
    flex: 1,
  },
  // Register
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xxl,
  },
  registerText: {
    ...Typography.body,
    color: 'rgba(255,255,255,0.7)',
  },
  registerLink: {
    ...Typography.bodyMedium,
    color: Colors.white,
    textDecorationLine: 'underline',
  },
});
