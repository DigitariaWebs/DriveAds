import { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { FontFamily } from '../constants/Typography';
import { useData } from '../context/DataContext';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../constants/TabBarStyle';
import NotificationItemComponent from './NotificationItem';

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

// ─── Screen ────────────────────────────────────────────────
export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    archiveNotification,
    deleteNotification,
  } = useData();

  const heroNoise = useMemo(() => generateNoise(200, width, 260), []);

  return (
    <View style={styles.screen}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* ─── Hero ────────────────────────────────────── */}
            <View style={[styles.hero, { paddingTop: insets.top + 12 }]}>
              <LinearGradient
                colors={[Colors.navyDark, Colors.navy, Colors.navyLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              {/* Warm glow */}
              <View style={styles.glowWarmWrap} pointerEvents="none">
                <LinearGradient
                  colors={['rgba(244,184,81,0.28)', 'rgba(244,184,81,0)']}
                  style={styles.glowOrb}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                />
              </View>
              {/* Cool glow */}
              <View style={styles.glowCoolWrap} pointerEvents="none">
                <LinearGradient
                  colors={['rgba(150,170,255,0.2)', 'rgba(150,170,255,0)']}
                  style={styles.glowOrb}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                />
              </View>
              {/* Sheen */}
              <LinearGradient
                colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0)']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.5 }}
                pointerEvents="none"
              />
              {/* Noise */}
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
                  source={require('../assets/logo-white.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                {unreadCount > 0 && (
                  <TouchableOpacity
                    onPress={markAllNotificationsRead}
                    style={styles.markAllBtn}
                    activeOpacity={0.75}
                  >
                    <Feather name="check" size={14} color={Colors.white} />
                    <Text style={styles.markAllText}>Tout lire</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Title */}
              <View style={styles.heroTitleBlock}>
                <Text style={styles.heroTitle}>Notifications</Text>
                <Text style={styles.heroSubtitle}>
                  {notifications.length} notification
                  {notifications.length > 1 ? 's' : ''}
                  {unreadCount > 0
                    ? ` · ${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`
                    : ''}
                </Text>
              </View>
            </View>

            {/* ─── Unread banner (or fallback spacer) ─────── */}
            {unreadCount > 0 ? (
              <View style={styles.bannerWrap}>
                <TouchableOpacity
                  onPress={markAllNotificationsRead}
                  activeOpacity={0.88}
                >
                  <LinearGradient
                    colors={[Colors.navy, Colors.navyLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.banner}
                  >
                    <View style={styles.bannerIcon}>
                      <Feather name="bell" size={16} color={Colors.white} />
                    </View>
                    <View style={styles.bannerText}>
                      <Text style={styles.bannerCount}>
                        {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                      </Text>
                      <Text style={styles.bannerHint}>
                        Appuyez pour marquer comme lu
                      </Text>
                    </View>
                    <View style={styles.bannerBadge}>
                      <Text style={styles.bannerBadgeText}>{unreadCount}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.bannerSpacer} />
            )}
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <NotificationItemComponent
              notification={item}
              onPress={() => markNotificationRead(item.id)}
              onArchive={() => archiveNotification(item.id)}
              onDelete={() => deleteNotification(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Feather name="bell-off" size={28} color={Colors.gray400} />
            </View>
            <Text style={styles.emptyTitle}>Aucune notification</Text>
            <Text style={styles.emptyText}>
              Vous êtes à jour — nous vous enverrons un signal dès qu'il se
              passe quelque chose.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F6F2',
  },
  listContent: {
    paddingHorizontal: 0,
  },

  // ─── Hero ────────────────────────────────────────────
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    overflow: 'hidden',
  },
  glowWarmWrap: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 260,
    height: 260,
  },
  glowCoolWrap: {
    position: 'absolute',
    bottom: -60,
    left: -40,
    width: 220,
    height: 220,
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
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  markAllText: {
    fontFamily: FontFamily.bold,
    fontSize: 11.5,
    color: Colors.white,
    letterSpacing: 0.2,
  },

  heroTitleBlock: {
    marginTop: 4,
  },
  heroTitle: {
    fontFamily: FontFamily.black,
    fontSize: 32,
    color: Colors.white,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  heroSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 4,
  },

  // ─── Banner ──────────────────────────────────────────
  bannerWrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  bannerSpacer: {
    height: 20,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    gap: 12,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 6,
  },
  bannerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    flex: 1,
  },
  bannerCount: {
    fontFamily: FontFamily.bold,
    fontSize: 14.5,
    color: Colors.white,
    letterSpacing: -0.2,
  },
  bannerHint: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  bannerBadge: {
    width: 30,
    height: 30,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerBadgeText: {
    fontFamily: FontFamily.black,
    fontSize: 13,
    color: Colors.white,
  },

  // List items
  itemRow: {
    paddingHorizontal: 20,
  },

  // Empty state
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
    gap: 6,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.gray700,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: 12.5,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 18,
  },
});
