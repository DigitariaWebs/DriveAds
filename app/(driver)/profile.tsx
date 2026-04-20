import { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

// ─── Seeded background noise ───────────────────────────────
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
};

const generateNoise = (count: number, w: number, h: number): NoiseDot[] => {
  const dots: NoiseDot[] = [];
  for (let i = 0; i < count; i++) {
    const sizeRoll = seededRandom(i * 3.73);
    dots.push({
      key: i,
      top: seededRandom(i * 1.31) * h,
      left: seededRandom(i * 2.27) * w,
      size: sizeRoll > 0.9 ? 2 : 1,
      opacity: 0.02 + seededRandom(i * 4.13) * 0.06,
    });
  }
  return dots;
};

// ─── Menu config ───────────────────────────────────────────
type MenuItem = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  danger?: boolean;
  route?: string;
};

const MENU_ITEMS: MenuItem[] = [
  { icon: 'truck', label: 'Mes véhicules', route: '/(driver)/my-cars' },
  { icon: 'file-text', label: 'Documents', route: '/(driver)/documents' },
  { icon: 'credit-card', label: 'Paiements', route: '/(driver)/payments' },
  { icon: 'settings', label: 'Paramètres', route: '/(driver)/settings' },
  { icon: 'help-circle', label: 'Aide & Support', route: '/(driver)/support' },
  { icon: 'log-out', label: 'Se déconnecter', danger: true },
];

// ─── Screen ────────────────────────────────────────────────
export default function DriverProfileScreen() {
  const insets = useSafeAreaInsets();
  const { currentDriver, logout } = useAuth();

  const heroNoise = useMemo(() => generateNoise(200, width, 340), []);

  const driver = currentDriver;
  const initials = driver
    ? `${driver.firstName[0]}${driver.lastName[0]}`.toUpperCase()
    : '??';

  const handleMenuPress = (item: MenuItem) => {
    if (item.danger) {
      logout().then(() => {
        router.replace('/(auth)/welcome');
      });
    } else if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20,
        }}
      >
        {/* ─── Hero ────────────────────────────────────── */}
        <View style={[styles.hero, { paddingTop: insets.top + 12 }]}>
          <LinearGradient
            colors={[Colors.navyDark, Colors.navy, Colors.navyLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.glowWarmWrap} pointerEvents="none">
            <LinearGradient
              colors={['rgba(244,184,81,0.32)', 'rgba(244,184,81,0)']}
              style={styles.glowOrb}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </View>
          <View style={styles.glowCoolWrap} pointerEvents="none">
            <LinearGradient
              colors={['rgba(150,170,255,0.22)', 'rgba(150,170,255,0)']}
              style={styles.glowOrb}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </View>
          <LinearGradient
            colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.5 }}
            pointerEvents="none"
          />
          <View style={styles.noiseLayer} pointerEvents="none">
            {heroNoise.map((d) => (
              <View
                key={d.key}
                style={{
                  position: 'absolute',
                  top: d.top,
                  left: d.left,
                  width: d.size,
                  height: d.size,
                  borderRadius: d.size / 2,
                  backgroundColor: '#FFFFFF',
                  opacity: d.opacity,
                }}
              />
            ))}
          </View>

          {/* Top bar */}
          <View style={styles.heroTopBar}>
            <Image
              source={require('../../assets/logo-white.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.iconBtn}
              activeOpacity={0.75}
              onPress={() => router.push('/(driver)/edit-profile')}
            >
              <Feather name="edit-2" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Avatar + Identity */}
          <View style={styles.identityBlock}>
            <View style={styles.avatarRing}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            </View>
            <Text style={styles.name}>
              {driver ? `${driver.firstName} ${driver.lastName}` : 'Chauffeur'}
            </Text>
            <Text style={styles.email}>{driver?.email}</Text>
            {driver && (
              <View style={styles.locationChip}>
                <Feather name="map-pin" size={11} color={Colors.white} />
                <Text style={styles.locationText}>{driver.city}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ─── Content ──────────────────────────────────── */}
        <View style={styles.content}>
          {/* Stats row */}
          {driver && (
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  {driver.totalEarnings.toLocaleString()} €
                </Text>
                <Text style={styles.statLabel}>gagnés</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{driver.campaignsDone}</Text>
                <Text style={styles.statLabel}>campagnes</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <View style={styles.ratingInline}>
                  <Feather name="star" size={13} color="#F4B851" />
                  <Text style={styles.statValue}>
                    {driver.rating > 0 ? driver.rating.toFixed(1) : '—'}
                  </Text>
                </View>
                <Text style={styles.statLabel}>note</Text>
              </View>
            </View>
          )}

          {/* Vehicle card */}
          {driver && (
            <TouchableOpacity
              style={styles.vehicleCard}
              activeOpacity={0.85}
              onPress={() => router.push('/(driver)/my-cars')}
            >
              <Feather name="truck" size={20} color={Colors.navy} />
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleModel}>
                  {driver.vehicleModel} · {driver.vehicleYear}
                </Text>
                <Text style={styles.vehiclePlate}>{driver.licensePlate}</Text>
              </View>
              <View style={styles.vehicleTypeChip}>
                <Text style={styles.vehicleTypeText}>
                  {driver.vehicleType.toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Menu list */}
          <View style={styles.menuCard}>
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  index < MENU_ITEMS.length - 1 && styles.menuItemBorder,
                ]}
                onPress={() => handleMenuPress(item)}
                activeOpacity={0.65}
              >
                <Feather
                  name={item.icon}
                  size={18}
                  color={item.danger ? Colors.danger : Colors.navy}
                />
                <Text
                  style={[
                    styles.menuLabel,
                    item.danger && styles.menuLabelDanger,
                  ]}
                >
                  {item.label}
                </Text>
                <Feather
                  name="chevron-right"
                  size={16}
                  color={item.danger ? Colors.danger : Colors.gray400}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F6F2',
  },

  // Hero
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    overflow: 'hidden',
  },
  glowWarmWrap: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 300,
    height: 300,
  },
  glowCoolWrap: {
    position: 'absolute',
    bottom: -80,
    left: -40,
    width: 260,
    height: 260,
  },
  glowOrb: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  noiseLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },

  heroTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 110,
    height: 26,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  identityBlock: {
    alignItems: 'center',
    paddingTop: 4,
  },
  avatarRing: {
    padding: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    marginBottom: 14,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#F4B851',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FontFamily.black,
    fontSize: 26,
    color: '#1A2752',
    letterSpacing: -0.5,
  },
  name: {
    fontFamily: FontFamily.black,
    fontSize: 22,
    color: Colors.white,
    letterSpacing: -0.3,
  },
  email: {
    fontFamily: FontFamily.regular,
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    marginBottom: 14,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  locationText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.white,
    letterSpacing: 0.6,
  },

  // Content
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.gray100,
    ...Shadows.sm,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FontFamily.black,
    fontSize: 17,
    color: Colors.navy,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.gray100,
  },
  ratingInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  // Vehicle
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray100,
    marginBottom: 14,
    ...Shadows.sm,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleModel: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.black,
    letterSpacing: -0.1,
  },
  vehiclePlate: {
    fontFamily: FontFamily.medium,
    fontSize: 11.5,
    color: Colors.gray500,
    marginTop: 2,
  },
  vehicleTypeChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    backgroundColor: Colors.navyTint,
  },
  vehicleTypeText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.navy,
    letterSpacing: 0.5,
  },

  // Menu
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray100,
    ...Shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  menuLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.black,
    flex: 1,
    letterSpacing: -0.1,
  },
  menuLabelDanger: {
    color: Colors.danger,
  },
});
