import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { AppLogo } from '../../components/AppLogo';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { IconCircle } from '../../components/IconCircle';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../constants/theme';

export type UserRole = 'driver' | 'admin';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
  onRegister: () => void;
}

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const role: UserRole = email.toLowerCase().includes('admin')
      ? 'admin'
      : 'driver';
    onLogin(role);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.navy }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {/* Giant watermark logo — behind everything */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 40,
          left: -60,
          right: -60,
          alignItems: 'center',
          opacity: 0.06,
        }}
      >
        <Image
          source={require('../../assets/logo-removebg-preview.png')}
          style={{ width: 520, height: 160 }}
          resizeMode="contain"
        />
      </View>

      {/* Decorative navy circles */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: -100,
          right: -80,
          width: 280,
          height: 280,
          borderRadius: 140,
          backgroundColor: 'rgba(255,255,255,0.04)',
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: -50,
          left: -70,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: 'rgba(255,255,255,0.03)',
        }}
      />

      {/* Atmospheric photo background (top half) */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 360,
          opacity: 0.35,
        }}
      >
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
          }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        {/* Navy gradient fade to blend into the solid navy bg */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 140,
            backgroundColor: COLORS.navy,
            opacity: 0.5,
          }}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView style={{ flex: 1 }} edges={['top']}>
            {/* Top — visible logo + tagline */}
            <View
              style={{
                alignItems: 'center',
                paddingTop: 26,
                paddingBottom: 26,
                paddingHorizontal: 24,
              }}
            >
              <AppLogo size="xxl" variant="transparent" />
              <Text
                style={{
                  fontFamily: FONTS.medium,
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.75)',
                  marginTop: 4,
                  textAlign: 'center',
                  letterSpacing: 0.3,
                }}
              >
                Transformez votre véhicule en revenu
              </Text>
            </View>

            {/* Floating white card with the form */}
            <View
              style={{
                flex: 1,
                backgroundColor: COLORS.white,
                borderTopLeftRadius: 36,
                borderTopRightRadius: 36,
                paddingHorizontal: 24,
                paddingTop: 28,
                paddingBottom: 28,
                ...SHADOWS.lg,
              }}
            >
              {/* Small pull handle */}
              <View
                style={{
                  alignSelf: 'center',
                  width: 44,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: COLORS.gray200,
                  marginBottom: 18,
                }}
              />

              <Input
                label="Email"
                placeholder="votre@email.com"
                value={email}
                onChangeText={setEmail}
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
                style={{ alignSelf: 'flex-end', marginTop: 2, marginBottom: 18 }}
                hitSlop={10}
              >
                <Text
                  style={{
                    fontFamily: FONTS.semibold,
                    fontSize: 12,
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
                  marginTop: 14,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    fontSize: 13,
                    color: COLORS.gray500,
                  }}
                >
                  Pas encore de compte ?{' '}
                </Text>
                <TouchableOpacity onPress={onRegister} hitSlop={8}>
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 13,
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
                  marginVertical: 20,
                }}
              >
                <View
                  style={{ flex: 1, height: 1, backgroundColor: COLORS.gray200 }}
                />
                <Text
                  style={{
                    marginHorizontal: 12,
                    fontFamily: FONTS.semibold,
                    fontSize: 10,
                    color: COLORS.gray400,
                    letterSpacing: 1,
                  }}
                >
                  ESSAYER EN DÉMO
                </Text>
                <View
                  style={{ flex: 1, height: 1, backgroundColor: COLORS.gray200 }}
                />
              </View>

              {/* Demo accounts */}
              <View style={{ gap: 10 }}>
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
                    padding: 12,
                  }}
                >
                  <IconCircle icon="car-sport" size="md" variant="soft" />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.bold,
                        fontSize: 13,
                        color: COLORS.navy,
                      }}
                    >
                      Compte Chauffeur
                    </Text>
                    <Text
                      style={{
                        fontFamily: FONTS.regular,
                        fontSize: 11,
                        color: COLORS.gray500,
                        marginTop: 1,
                      }}
                    >
                      Démo — accès direct au tableau de bord
                    </Text>
                  </View>
                  <Text style={{ fontSize: 20, color: COLORS.navy }}>→</Text>
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
                    padding: 12,
                  }}
                >
                  <IconCircle icon="shield-checkmark" size="md" variant="soft" />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.bold,
                        fontSize: 13,
                        color: COLORS.navy,
                      }}
                    >
                      Compte Admin
                    </Text>
                    <Text
                      style={{
                        fontFamily: FONTS.regular,
                        fontSize: 11,
                        color: COLORS.gray500,
                        marginTop: 1,
                      }}
                    >
                      Démo — panneau de gestion
                    </Text>
                  </View>
                  <Text style={{ fontSize: 20, color: COLORS.navy }}>→</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
