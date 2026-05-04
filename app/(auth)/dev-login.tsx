import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { useAuth } from '../../context/AuthContext';

type DemoUser = {
  role: 'driver' | 'advertiser' | 'partner' | 'admin';
  email: string;
  password: string;
  label: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
};

const DEMO_USERS: DemoUser[] = [
  {
    role: 'driver',
    email: 'driver@driveads.local',
    password: 'driver123!',
    label: 'Chauffeur',
    description: 'Marie Dupont · Paris · Peugeot 308',
    icon: 'truck',
    color: '#0ea5e9',
  },
  {
    role: 'advertiser',
    email: 'advertiser@driveads.local',
    password: 'advert123!',
    label: 'Annonceur',
    description: 'Acme Corp · lecture seule',
    icon: 'briefcase',
    color: '#7c3aed',
  },
  {
    role: 'partner',
    email: 'partner@driveads.local',
    password: 'partner123!',
    label: 'Partenaire',
    description: 'Club Neon · lecture seule',
    icon: 'map-pin',
    color: '#f59e0b',
  },
  {
    role: 'admin',
    email: 'admin@driveads.local',
    password: 'admin123!',
    label: 'Admin',
    description: 'Accès dashboard web',
    icon: 'shield',
    color: '#1A2752',
  },
];

export default function DevLoginScreen() {
  const insets = useSafeAreaInsets();
  const { signInEmail } = useAuth();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleLogin = async (u: DemoUser) => {
    setLoadingRole(u.role);
    try {
      await signInEmail(u.email, u.password);
      router.replace('/');
    } catch (e: any) {
      Alert.alert(
        'Connexion échouée',
        `${e?.message ?? 'Erreur'}\n\nAvez-vous lancé "npm run seed:users" sur le backend ?`,
      );
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + Spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={20} color={Colors.navy} />
        </TouchableOpacity>

        <View style={styles.devBadge}>
          <Feather name="zap" size={11} color="#F4B851" />
          <Text style={styles.devBadgeText}>DEV MODE</Text>
        </View>

        <Text style={styles.title}>Fast Login</Text>
        <Text style={styles.subtitle}>
          Connexion rapide aux comptes de démo seedés.
        </Text>

        <View style={styles.cards}>
          {DEMO_USERS.map((u) => {
            const loading = loadingRole === u.role;
            const disabled = loadingRole !== null && !loading;
            return (
              <TouchableOpacity
                key={u.role}
                style={[styles.card, disabled && { opacity: 0.4 }]}
                onPress={() => handleLogin(u)}
                disabled={disabled || loading}
                activeOpacity={0.85}
              >
                <View style={[styles.iconCircle, { backgroundColor: u.color }]}>
                  <Feather name={u.icon} size={20} color={Colors.white} />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardLabel}>{u.label}</Text>
                  <Text style={styles.cardDesc}>{u.description}</Text>
                  <Text style={styles.cardCreds}>{u.email}</Text>
                </View>
                {loading ? (
                  <ActivityIndicator color={Colors.navy} />
                ) : (
                  <Feather name="arrow-right" size={20} color={Colors.gray400} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.note}>
          <Feather name="info" size={14} color={Colors.gray500} />
          <Text style={styles.noteText}>
            Lancez `npm run seed:users` côté backend si la connexion échoue.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.standardBtn}
          onPress={() => router.replace('/(auth)/login')}
          activeOpacity={0.7}
        >
          <Text style={styles.standardBtnText}>Connexion standard</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.navyTint },
  scroll: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.huge },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  devBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(244,184,81,0.15)',
    marginBottom: Spacing.md,
  },
  devBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: '#F4B851',
    letterSpacing: 1,
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
  cards: { gap: Spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: 14,
    borderRadius: 18,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1 },
  cardLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.navy,
  },
  cardDesc: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray600,
    marginTop: 2,
  },
  cardCreds: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: Colors.gray400,
    marginTop: 4,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.xl,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },
  noteText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.gray500,
  },
  standardBtn: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  standardBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.navy,
    textDecorationLine: 'underline',
  },
});
