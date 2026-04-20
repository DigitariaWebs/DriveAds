import { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
import { useData } from '../../context/DataContext';
import Badge from '../../components/ui/Badge';
import BrandLogo from '../../components/BrandLogo';

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

// ─── Services pill row data ───────────────────────────────
type ServiceItem = {
  key: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  onPress?: () => void;
};

// ─── Screen ────────────────────────────────────────────────
export default function DriverHomeScreen() {
  const insets = useSafeAreaInsets();
  const { currentDriver } = useAuth();
  const { driverStats, campaigns, unreadCount } = useData();

  const driverName = currentDriver?.firstName ?? 'Chauffeur';
  const driverId = currentDriver?.id ?? 'd1';

  const activeCampaigns = campaigns.filter(
    (c) => c.status === 'active' && c.assignedDriverIds.includes(driverId),
  );
  const activeCampaign = activeCampaigns[0];

  const availableCampaigns = campaigns.filter(
    (c) => c.status === 'available' && !c.assignedDriverIds.includes(driverId),
  );

  const formatKm = (km: number) =>
    km >= 1000 ? `${(km / 1000).toFixed(1)}k` : km.toString();

  const daysRemaining = (endDate: string) => {
    const diff = new Date(endDate).getTime() - Date.now();
    return `${Math.max(0, Math.ceil(diff / 86400000))}j`;
  };

  // Memoized background noise — scoped to hero area (~420px tall)
  const heroNoise = useMemo(() => generateNoise(260, width, 460), []);

  const services: ServiceItem[] = [
    {
      key: 'payments',
      label: 'Paiements',
      icon: 'credit-card',
      onPress: () => router.push('/(driver)/payments'),
    },
    {
      key: 'statement',
      label: 'Relevé',
      icon: 'file-text',
    },
    {
      key: 'support',
      label: 'Support',
      icon: 'help-circle',
      onPress: () => router.push('/(driver)/support'),
    },
    {
      key: 'invite',
      label: 'Parrainer',
      icon: 'gift',
    },
  ];

  // Prompt shows only when there's no active campaign — otherwise the
  // campaign section below already surfaces the relevant context.
  const showPrompt = !activeCampaign;
  const actionPrompt = availableCampaigns.length > 0
    ? {
        icon: 'compass' as const,
        title: `${availableCampaigns.length} opportunité${availableCampaigns.length > 1 ? 's' : ''} disponible${availableCampaigns.length > 1 ? 's' : ''}`,
        subtitle: 'Découvrez les campagnes près de chez vous',
        onPress: () => router.push('/(driver)/campaigns'),
      }
    : {
        icon: 'bell' as const,
        title: 'Tout est à jour',
        subtitle: "Nous vous notifierons dès qu'une campagne arrive",
        onPress: undefined,
      };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.root}
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* ─── Hero ────────────────────────────────────── */}
        <View style={[styles.hero, { paddingTop: insets.top + 12 }]}>
          {/* Base gradient */}
          <LinearGradient
            colors={[Colors.navyDark, Colors.navy, Colors.navyLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Warm amber glow top-right */}
          <View style={styles.glowWarmWrap} pointerEvents="none">
            <LinearGradient
              colors={['rgba(244,184,81,0.32)', 'rgba(244,184,81,0)']}
              style={styles.glowOrb}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </View>

          {/* Cool lilac glow bottom-left */}
          <View style={styles.glowCoolWrap} pointerEvents="none">
            <LinearGradient
              colors={['rgba(150,170,255,0.22)', 'rgba(150,170,255,0)']}
              style={styles.glowOrb}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </View>

          {/* Diagonal sheen */}
          <LinearGradient
            colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.5 }}
            pointerEvents="none"
          />

          {/* Subtle noise */}
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

          {/* Top bar: logo + bell */}
          <View style={styles.topBar}>
            <Image
              source={require('../../assets/logo-white.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => router.push('/(driver)/notifications')}
              activeOpacity={0.7}
            >
              <Feather name="bell" size={20} color={Colors.white} />
              {unreadCount > 0 && (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Greeting */}
          <View style={styles.greetingBlock}>
            <Text style={styles.greeting}>Bonjour, {driverName}</Text>
            <Text style={styles.subtitle}>
              Prêt pour une nouvelle mission ?
            </Text>
          </View>

          {/* Earnings hero */}
          <View style={styles.earningsSection}>
            <Text style={styles.earningsLabel}>Revenus ce mois</Text>
            <View style={styles.earningsRow}>
              <Text style={styles.earningsAmount}>
                {driverStats.monthlyEarnings} €
              </Text>
              <View style={styles.growthPill}>
                <Feather name="trending-up" size={12} color={Colors.success} />
                <Text style={styles.growthText}>
                  +{driverStats.growthPercent}%
                </Text>
              </View>
            </View>
          </View>

          {/* Single mini stats row inside hero */}
          <View style={styles.miniStatsRow}>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>
                {driverStats.totalEarnings.toLocaleString()} €
              </Text>
              <Text style={styles.miniStatLabel}>Total gagné</Text>
            </View>
            <View style={styles.miniStatDivider} />
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>
                {formatKm(driverStats.totalKm)}
              </Text>
              <Text style={styles.miniStatLabel}>Kilomètres</Text>
            </View>
            <View style={styles.miniStatDivider} />
            <View style={styles.miniStat}>
              <View style={styles.ratingRow}>
                <Feather name="star" size={12} color="#F59E0B" />
                <Text style={styles.miniStatValue}>{driverStats.rating}</Text>
              </View>
              <Text style={styles.miniStatLabel}>Note</Text>
            </View>
          </View>
        </View>

        {/* ─── White Content Sheet ──────────────────────── */}
        <View style={styles.contentSheet}>
          {/* Action prompt card — only when no active campaign */}
          {showPrompt && (
            <TouchableOpacity
              style={styles.promptCard}
              onPress={actionPrompt.onPress}
              activeOpacity={actionPrompt.onPress ? 0.85 : 1}
              disabled={!actionPrompt.onPress}
            >
              <View style={styles.promptIcon}>
                <Feather
                  name={actionPrompt.icon}
                  size={18}
                  color={Colors.navy}
                />
              </View>
              <View style={styles.promptText}>
                <Text style={styles.promptTitle}>{actionPrompt.title}</Text>
                <Text style={styles.promptSubtitle} numberOfLines={1}>
                  {actionPrompt.subtitle}
                </Text>
              </View>
              {actionPrompt.onPress && (
                <View style={styles.promptArrow}>
                  <Feather
                    name="arrow-up-right"
                    size={16}
                    color={Colors.navy}
                  />
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* Services row — flat monochrome */}
          <View style={styles.servicesRow}>
            {services.map((s) => (
              <TouchableOpacity
                key={s.key}
                style={styles.serviceItem}
                onPress={s.onPress}
                activeOpacity={0.65}
                disabled={!s.onPress}
              >
                <Feather name={s.icon} size={20} color={Colors.navy} />
                <Text style={styles.serviceLabel}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Active campaign */}
          {activeCampaign && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Campagne en cours</Text>
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/(driver)/campaign/${activeCampaign.id}`)
                  }
                >
                  <Text style={styles.seeMore}>Voir</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.activeCampaignCard}
                onPress={() =>
                  router.push(`/(driver)/campaign/${activeCampaign.id}`)
                }
                activeOpacity={0.85}
              >
                <View style={styles.acHeader}>
                  <BrandLogo
                    domain={activeCampaign.domain}
                    name={activeCampaign.brand}
                    size={40}
                  />
                  <View style={styles.acHeaderText}>
                    <Text style={styles.acBrand}>{activeCampaign.brand}</Text>
                    <Text style={styles.acTitle} numberOfLines={1}>
                      {activeCampaign.title}
                    </Text>
                  </View>
                  <Badge variant="info" label={activeCampaign.city} />
                </View>

                <View style={styles.acMetrics}>
                  <View style={styles.acMetric}>
                    <Feather name="clock" size={13} color={Colors.gray400} />
                    <Text style={styles.acMetricText}>
                      {daysRemaining(activeCampaign.endDate)} restants
                    </Text>
                  </View>
                  <View style={styles.acMetric}>
                    <Feather name="dollar-sign" size={13} color={Colors.gray400} />
                    <Text style={styles.acMetricText}>
                      {activeCampaign.reward} €
                    </Text>
                  </View>
                  <View style={styles.acMetric}>
                    <Feather name="navigation" size={13} color={Colors.gray400} />
                    <Text style={styles.acMetricText}>
                      {formatKm(activeCampaign.kmDone)}/
                      {formatKm(activeCampaign.kmTotal)}
                    </Text>
                  </View>
                </View>

                <View style={styles.acProgressRow}>
                  <View style={styles.acProgressTrack}>
                    <LinearGradient
                      colors={[Colors.navy, Colors.navyLight]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[
                        styles.acProgressFill,
                        {
                          width: `${Math.round(
                            activeCampaign.progress * 100,
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.acProgressPct}>
                    {Math.round(activeCampaign.progress * 100)}%
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Opportunities */}
          {availableCampaigns.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Nouvelles opportunités</Text>
                <TouchableOpacity
                  onPress={() => router.push('/(driver)/campaigns')}
                >
                  <Text style={styles.seeMore}>Tout voir</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
                style={styles.horizontalScrollWrap}
              >
                {availableCampaigns.map((campaign) => (
                  <TouchableOpacity
                    key={campaign.id}
                    style={styles.oppCard}
                    onPress={() =>
                      router.push(`/(driver)/campaign/${campaign.id}`)
                    }
                    activeOpacity={0.85}
                  >
                    <View style={styles.oppHeader}>
                      <BrandLogo
                        domain={campaign.domain}
                        name={campaign.brand}
                        size={32}
                      />
                      <View style={styles.oppHeaderText}>
                        <Text style={styles.oppBrand}>{campaign.brand}</Text>
                        <Text style={styles.oppTitle} numberOfLines={1}>
                          {campaign.title}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.oppFooter}>
                      <Badge
                        variant="navy"
                        label={campaign.city}
                        icon="map-pin"
                      />
                      <Text style={styles.oppReward}>{campaign.reward} €</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          <View style={{ height: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.navyDark,
  },

  // ─── Hero ────────────────────────────────────────────────
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 56,
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

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  logo: {
    width: 110,
    height: 26,
  },
  greetingBlock: {
    marginBottom: 22,
  },
  greeting: {
    fontFamily: FontFamily.black,
    fontSize: 22,
    color: Colors.white,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  bellBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700',
  },

  earningsSection: {
    marginBottom: 20,
  },
  earningsLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
  },
  earningsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  earningsAmount: {
    fontFamily: FontFamily.black,
    fontSize: 42,
    color: Colors.white,
    lineHeight: 46,
    letterSpacing: -0.8,
  },
  growthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16,185,129,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 6,
  },
  growthText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: Colors.success,
  },

  miniStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  miniStat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  miniStatValue: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.white,
    lineHeight: 18,
  },
  miniStatLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  // ─── White content sheet ────────────────────────────────
  contentSheet: {
    backgroundColor: '#F6F6F2',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -28,
    paddingTop: 20,
    paddingHorizontal: 20,
    minHeight: 400,
  },

  // Action prompt card
  promptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 18,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray100,
    marginBottom: 20,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  promptIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.navyTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptText: {
    flex: 1,
  },
  promptTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 13.5,
    color: Colors.black,
    marginBottom: 2,
  },
  promptSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 11.5,
    color: Colors.gray500,
  },
  promptArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.navyTint,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Services row — flat, monochrome, no tiles
  servicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
    paddingVertical: 12,
    paddingHorizontal: 4,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray100,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  serviceItem: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    width: (width - 40 - 8) / 4,
  },
  serviceLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.gray700,
  },

  // Section
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.black,
  },
  seeMore: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.navy,
  },

  // Active campaign card
  activeCampaignCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray100,
    ...Shadows.sm,
  },
  acHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  acHeaderText: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },
  acBrand: {
    fontFamily: FontFamily.semiBold,
    fontSize: 9,
    color: Colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  acTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.black,
    marginTop: 1,
  },
  acMetrics: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 14,
  },
  acMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  acMetricText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.gray500,
  },
  acProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  acProgressTrack: {
    flex: 1,
    height: 7,
    backgroundColor: Colors.gray100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  acProgressFill: {
    height: 7,
    borderRadius: 4,
  },
  acProgressPct: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: Colors.navy,
    minWidth: 34,
    textAlign: 'right',
  },

  // Horizontal opportunities
  horizontalScrollWrap: {
    marginHorizontal: -20,
  },
  horizontalScroll: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 4,
  },
  oppCard: {
    width: 240,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.gray100,
    ...Shadows.sm,
  },
  oppHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  oppHeaderText: {
    flex: 1,
    marginLeft: 10,
  },
  oppBrand: {
    fontFamily: FontFamily.semiBold,
    fontSize: 9,
    color: Colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  oppTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.black,
    marginTop: 1,
  },
  oppFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  oppReward: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.navy,
  },
});
