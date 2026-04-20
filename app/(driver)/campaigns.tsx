import { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
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
import { useData } from '../../context/DataContext';
import CampaignCard from '../../components/CampaignCard';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';

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

// ─── Filters ───────────────────────────────────────────────
type FilterKey = 'all' | 'available' | 'active' | 'completed';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'available', label: 'Disponibles' },
  { key: 'active', label: 'En cours' },
  { key: 'completed', label: 'Terminées' },
];

// ─── Screen ────────────────────────────────────────────────
export default function DriverCampaignsScreen() {
  const insets = useSafeAreaInsets();
  const { campaigns } = useData();
  const [filter, setFilter] = useState<FilterKey>('all');

  const heroNoise = useMemo(() => generateNoise(200, width, 280), []);

  const filtered = campaigns.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const counts = {
    all: campaigns.length,
    available: campaigns.filter((c) => c.status === 'available').length,
    active: campaigns.filter((c) => c.status === 'active').length,
    completed: campaigns.filter((c) => c.status === 'completed').length,
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={filtered}
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
                  source={require('../../assets/logo-white.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <TouchableOpacity
                  style={styles.searchBtn}
                  activeOpacity={0.7}
                >
                  <Feather name="search" size={18} color={Colors.white} />
                </TouchableOpacity>
              </View>

              {/* Title */}
              <View style={styles.heroTitleBlock}>
                <Text style={styles.heroTitle}>Campagnes</Text>
                <Text style={styles.heroSubtitle}>
                  {filtered.length} campagne
                  {filtered.length > 1 ? 's' : ''}
                  {filter !== 'all'
                    ? ` · ${FILTERS.find((f) => f.key === filter)?.label.toLowerCase()}`
                    : ''}
                </Text>
              </View>
            </View>

            {/* ─── Filter chips ────────────────────────────── */}
            <View style={styles.filtersWrap}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
              >
                {FILTERS.map((f) => {
                  const active = filter === f.key;
                  const count = counts[f.key];
                  return (
                    <TouchableOpacity
                      key={f.key}
                      style={[
                        styles.filterChip,
                        active && styles.filterChipActive,
                      ]}
                      onPress={() => setFilter(f.key)}
                      activeOpacity={0.75}
                    >
                      <Text
                        style={[
                          styles.filterText,
                          active && styles.filterTextActive,
                        ]}
                      >
                        {f.label}
                      </Text>
                      <View
                        style={[
                          styles.filterCount,
                          active && styles.filterCountActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.filterCountText,
                            active && styles.filterCountTextActive,
                          ]}
                        >
                          {count}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </>
        }
        renderItem={({ item: campaign }) => (
          <View style={styles.cardRow}>
            <CampaignCard
              campaign={campaign}
              onPress={() =>
                router.push(`/(driver)/campaign/${campaign.id}`)
              }
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Feather name="search" size={28} color={Colors.gray400} />
            </View>
            <Text style={styles.emptyTitle}>Aucune campagne trouvée</Text>
            <Text style={styles.emptyText}>
              Essayez un autre filtre pour élargir votre recherche.
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
    paddingBottom: 32,
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
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
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

  // ─── Filters ─────────────────────────────────────────
  filtersWrap: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  filterRow: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 14,
    paddingRight: 6,
    height: 34,
    borderRadius: 100,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  filterChipActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  filterText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12.5,
    color: Colors.gray600,
  },
  filterTextActive: {
    color: Colors.white,
  },
  filterCount: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCountActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  filterCountText: {
    fontFamily: FontFamily.bold,
    fontSize: 10.5,
    color: Colors.gray600,
  },
  filterCountTextActive: {
    color: Colors.white,
  },

  cardRow: {
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
