import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/Colors';
import { FontFamily, Typography } from '../../constants/Typography';
import { Spacing, Radius } from '../../constants/Spacing';

const { width, height } = Dimensions.get('window');

// ─── Seeded noise ────────────────────────────────────────────
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

type NoiseDot = {
  key: number;
  top: number;
  left: number;
  size: number;
  opacity: number;
  warm: boolean;
};

const generateNoise = (count: number, w: number, h: number): NoiseDot[] => {
  const dots: NoiseDot[] = [];
  for (let i = 0; i < count; i++) {
    const sizeRoll = seededRandom(i * 3.73);
    const size = sizeRoll > 0.96 ? 3 : sizeRoll > 0.78 ? 2 : 1;
    dots.push({
      key: i,
      top: seededRandom(i * 1.31) * h,
      left: seededRandom(i * 2.27) * w,
      size,
      opacity: 0.035 + seededRandom(i * 4.13) * 0.17,
      warm: seededRandom(i * 5.19) > 0.7,
    });
  }
  return dots;
};

// ─── Radial burst ────────────────────────────────────────────
// 10 concentric circles with stepped opacity + color fade,
// centered off-screen upper-right to mimic Svitols' "Deep Layers" burst.
type BurstRing = { size: number; opacity: number; color: string };

const BURST_RINGS: BurstRing[] = [
  { size: 900, opacity: 0.04, color: '#2A3C7A' },
  { size: 780, opacity: 0.06, color: '#33478F' },
  { size: 660, opacity: 0.09, color: '#3F54A3' },
  { size: 560, opacity: 0.13, color: '#4D64BA' },
  { size: 460, opacity: 0.18, color: '#6278CC' },
  { size: 360, opacity: 0.24, color: '#8092DB' },
  { size: 270, opacity: 0.32, color: '#A5B3E8' },
  { size: 190, opacity: 0.45, color: '#C6D0F3' },
  { size: 120, opacity: 0.62, color: '#E2E8FA' },
  { size: 70, opacity: 0.82, color: '#F4F6FF' },
];

// ─── Screen ─────────────────────────────────────────────────
export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const [pickerOpen, setPickerOpen] = useState(false);

  const noise = useMemo(() => generateNoise(900, width, height), []);

  const handleCreateAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPickerOpen(true);
  };

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(auth)/login');
  };

  const goToRole = (path: '/(auth)/register-driver' | '/(auth)/register-company') => {
    setPickerOpen(false);
    setTimeout(() => router.push(path), 120);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      {/* Base: deep black */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#05060C' }]} />

      {/* Radial burst — stacked circles */}
      <View style={styles.burstLayer} pointerEvents="none">
        {BURST_RINGS.map((r, i) => (
          <View
            key={i}
            style={[
              styles.burstRing,
              {
                width: r.size,
                height: r.size,
                borderRadius: r.size / 2,
                backgroundColor: r.color,
                opacity: r.opacity,
                marginTop: -r.size / 2,
                marginLeft: -r.size / 2,
              },
            ]}
          />
        ))}
      </View>

      {/* Ambient spill — bottom center */}
      <View style={styles.spillWrap} pointerEvents="none">
        <LinearGradient
          colors={['rgba(210,220,245,0)', 'rgba(210,220,245,0.12)', 'rgba(210,220,245,0.22)']}
          locations={[0, 0.6, 1]}
          style={styles.spill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>

      {/* Vignette — keeps edges deep */}
      <LinearGradient
        colors={['rgba(5,6,12,0)', 'rgba(5,6,12,0.35)', 'rgba(5,6,12,0.75)']}
        locations={[0.4, 0.75, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      />
      <LinearGradient
        colors={['rgba(5,6,12,0.6)', 'rgba(5,6,12,0)']}
        locations={[0, 0.6]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />

      {/* Noise — sandy grain */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {noise.map((d) => (
          <View
            key={d.key}
            style={{
              position: 'absolute',
              top: d.top,
              left: d.left,
              width: d.size,
              height: d.size,
              borderRadius: d.size / 2,
              backgroundColor: d.warm ? '#FFF6E8' : '#FFFFFF',
              opacity: d.opacity,
            }}
          />
        ))}
      </View>

      {/* Content */}
      <View style={[styles.safe, { paddingTop: insets.top + Spacing.xl }]}>
        {/* Top — logo centered */}
        <View style={styles.topBar}>
          <Image
            source={require('../../assets/logo-white.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.headline}>
            Votre véhicule,{'\n'}votre <Text style={styles.headlineAccent}>revenu</Text>.
          </Text>

          <Text style={styles.subtitle}>
            Rejoignez la plateforme qui transforme chaque trajet en opportunité.
            Campagnes locales, revenus transparents, validation rapide.
          </Text>
        </View>

        {/* CTA */}
        <View
          style={[
            styles.ctaArea,
            { paddingBottom: Math.max(insets.bottom + Spacing.md, Spacing.xxl) },
          ]}
        >
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleCreateAccount}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryBtnText}>Créer un compte</Text>
            <Feather
              name="arrow-right"
              size={18}
              color={Colors.black}
              style={styles.primaryBtnIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ghostBtn}
            onPress={handleLogin}
            activeOpacity={0.75}
          >
            <Text style={styles.ghostBtnText}>
              J'ai déjà un compte ·{' '}
              <Text style={styles.ghostBtnEm}>Se connecter</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.terms}>
            En continuant, vous acceptez nos{' '}
            <Text style={styles.termsLink}>Conditions</Text> et notre{' '}
            <Text style={styles.termsLink}>Politique de confidentialité</Text>.
          </Text>
        </View>
      </View>

      {/* Role picker */}
      <Modal
        visible={pickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerOpen(false)}
        statusBarTranslucent
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setPickerOpen(false)}
        >
          <Pressable
            style={[
              styles.modalSheet,
              { paddingBottom: Math.max(insets.bottom + Spacing.lg, Spacing.huge) },
            ]}
          >
            <View style={styles.modalHandle} />

            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setPickerOpen(false)}
              activeOpacity={0.7}
              hitSlop={10}
            >
              <Feather name="x" size={18} color={Colors.gray500} />
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              <Text style={styles.modalEyebrow}>Rejoindre Publeader</Text>
              <Text style={styles.modalTitle}>Créez votre compte</Text>
              <Text style={styles.modalSubtitle}>
                Choisissez le profil qui vous correspond.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.roleCard}
              activeOpacity={0.9}
              onPress={() => goToRole('/(auth)/register-driver')}
            >
              <LinearGradient
                colors={[Colors.navy, Colors.navyLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.roleIcon}
              >
                <Feather name="truck" size={22} color={Colors.white} />
              </LinearGradient>

              <View style={styles.roleTextCol}>
                <Text style={styles.roleTitle}>Chauffeur</Text>
                <Text style={styles.roleCopy}>
                  Je monétise mon véhicule personnel.
                </Text>
              </View>

              <View style={styles.roleArrow}>
                <Feather name="arrow-up-right" size={16} color={Colors.navy} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleCard}
              activeOpacity={0.9}
              onPress={() => goToRole('/(auth)/register-company')}
            >
              <LinearGradient
                colors={[Colors.navy, Colors.navyLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.roleIcon}
              >
                <Feather name="briefcase" size={22} color={Colors.white} />
              </LinearGradient>

              <View style={styles.roleTextCol}>
                <Text style={styles.roleTitle}>Entreprise</Text>
                <Text style={styles.roleCopy}>
                  Je lance une campagne publicitaire.
                </Text>
              </View>

              <View style={styles.roleArrow}>
                <Feather name="arrow-up-right" size={16} color={Colors.navy} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalLoginRow}
              onPress={() => {
                setPickerOpen(false);
                setTimeout(() => router.push('/(auth)/login'), 120);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.modalLoginText}>
                Déjà membre ?{' '}
                <Text style={styles.modalLoginLink}>Se connecter</Text>
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────
const ACCENT = '#E2E8FA';

// Burst positioning — center lives off-screen upper-right,
// matching the Svitols reference (core near the top-right edge).
const BURST_CX = width + 40;
const BURST_CY = -40;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#05060C',
    overflow: 'hidden',
  },

  // Radial burst
  burstLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  burstRing: {
    position: 'absolute',
    top: BURST_CY,
    left: BURST_CX,
  },

  // Ambient spill bottom
  spillWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -120,
    height: 420,
    alignItems: 'center',
  },
  spill: {
    width: width * 1.3,
    height: 420,
    borderRadius: width,
  },

  // Layout
  safe: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
  },
  topBar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    height: 32,
  },

  // Hero
  hero: {
    flex: 1,
    justifyContent: 'center',
  },
  headline: {
    fontFamily: FontFamily.black,
    fontSize: 44,
    lineHeight: 50,
    color: Colors.white,
    letterSpacing: -0.8,
  },
  headlineAccent: {
    color: ACCENT,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.62)',
    marginTop: Spacing.xl,
    maxWidth: 340,
  },

  // CTA
  ctaArea: {
    gap: Spacing.md,
  },
  primaryBtn: {
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.45,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  primaryBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.black,
    letterSpacing: 0.1,
  },
  primaryBtnIcon: {
    marginLeft: 8,
  },
  ghostBtn: {
    height: 54,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  ghostBtnText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.72)',
  },
  ghostBtnEm: {
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
  terms: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(255,255,255,0.38)',
    textAlign: 'center',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  termsLink: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: FontFamily.semiBold,
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(6,9,22,0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FAFAF7',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
  },
  modalHandle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.gray200,
    marginBottom: Spacing.lg,
  },
  modalClose: {
    position: 'absolute',
    top: Spacing.lg + 8,
    right: Spacing.xxl,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeader: {
    marginBottom: Spacing.xl,
    paddingRight: 40,
  },
  modalEyebrow: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.navyLight,
    marginBottom: 6,
  },
  modalTitle: {
    fontFamily: FontFamily.black,
    fontSize: 26,
    lineHeight: 32,
    color: Colors.navy,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  modalSubtitle: {
    ...Typography.bodyLarge,
    color: Colors.gray500,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray100,
    marginBottom: Spacing.md,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  roleIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTextCol: {
    flex: 1,
  },
  roleTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.navy,
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  roleCopy: {
    fontFamily: FontFamily.regular,
    fontSize: 12.5,
    lineHeight: 17,
    color: Colors.gray500,
  },
  roleArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.navyTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalLoginRow: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  modalLoginText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.gray500,
  },
  modalLoginLink: {
    fontFamily: FontFamily.bold,
    color: Colors.navy,
  },
});
