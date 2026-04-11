import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Screen } from '../../components/Screen';
import { AppLogo } from '../../components/AppLogo';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { IconCircle } from '../../components/IconCircle';
import { COLORS, FONTS, RADIUS } from '../../constants/theme';

export type UserRole = 'driver' | 'admin';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
  onRegister: () => void;
}

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Mock: if email contains 'admin', go admin. Otherwise driver.
    const role: UserRole = email.toLowerCase().includes('admin')
      ? 'admin'
      : 'driver';
    onLogin(role);
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Header */}
          <View
            style={{
              alignItems: 'center',
              paddingTop: 24,
              paddingBottom: 16,
            }}
          >
            <AppLogo size="xxl" />
          </View>

          {/* Form */}
          <View style={{ paddingHorizontal: 24, paddingTop: 12, flex: 1 }}>
            <Input
              label="Email"
              placeholder="votre@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
            />
            <Input
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon="lock-closed-outline"
            />

            <TouchableOpacity
              style={{ alignSelf: 'flex-end', marginTop: 2, marginBottom: 22 }}
              hitSlop={10}
            >
              <Text
                style={{
                  fontFamily: FONTS.semibold,
                  fontSize: 13,
                  color: COLORS.navy,
                }}
              >
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>

            <Button fullWidth size="lg" onPress={handleLogin}>
              Se connecter
            </Button>

            {/* Register link */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 16,
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.regular,
                  fontSize: 14,
                  color: COLORS.gray500,
                }}
              >
                Pas encore de compte ?{' '}
              </Text>
              <TouchableOpacity onPress={onRegister} hitSlop={8}>
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 14,
                    color: COLORS.navy,
                  }}
                >
                  S'inscrire
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 24,
              }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.gray200 }} />
              <Text
                style={{
                  marginHorizontal: 14,
                  fontFamily: FONTS.medium,
                  fontSize: 12,
                  color: COLORS.gray400,
                  letterSpacing: 0.5,
                }}
              >
                ESSAYER EN DÉMO
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.gray200 }} />
            </View>

            {/* Demo accounts */}
            <View style={{ gap: 12 }}>
              <TouchableOpacity
                onPress={() => onLogin('driver')}
                activeOpacity={0.9}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: COLORS.white,
                  borderRadius: RADIUS.lg,
                  borderWidth: 1.5,
                  borderColor: COLORS.navySoft,
                  padding: 14,
                }}
              >
                <IconCircle icon="car-sport" size="md" variant="soft" />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 14,
                      color: COLORS.navy,
                    }}
                  >
                    Compte Chauffeur
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONTS.regular,
                      fontSize: 12,
                      color: COLORS.gray500,
                      marginTop: 2,
                    }}
                  >
                    Démo — accès direct au tableau de bord
                  </Text>
                </View>
                <Text style={{ fontSize: 22, color: COLORS.navy }}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onLogin('admin')}
                activeOpacity={0.9}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: COLORS.white,
                  borderRadius: RADIUS.lg,
                  borderWidth: 1.5,
                  borderColor: COLORS.navySoft,
                  padding: 14,
                }}
              >
                <IconCircle icon="shield-checkmark" size="md" variant="soft" />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 14,
                      color: COLORS.navy,
                    }}
                  >
                    Compte Admin
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONTS.regular,
                      fontSize: 12,
                      color: COLORS.gray500,
                      marginTop: 2,
                    }}
                  >
                    Démo — panneau de gestion
                  </Text>
                </View>
                <Text style={{ fontSize: 22, color: COLORS.navy }}>→</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
