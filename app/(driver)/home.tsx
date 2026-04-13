import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Badge from '../../components/ui/Badge';
import BrandLogo from '../../components/BrandLogo';

const { width } = Dimensions.get('window');

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

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.root}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* ─── Gradient Hero Header ──────────────────────── */}
        <LinearGradient
          colors={[Colors.navyDark, Colors.navy, Colors.navyLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroGradient, { paddingTop: insets.top + 12 }]}
        >
          {/* Top bar */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.greeting}>Bonjour, {driverName}</Text>
              <Text style={styles.subtitle}>Bienvenue sur DriveAds</Text>
            </View>
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => router.push('/(driver)/notifications')}
            >
              <Feather name="bell" size={22} color={Colors.white} />
              {unreadCount > 0 && (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Earnings */}
          <View style={styles.earningsSection}>
            <Text style={styles.earningsLabel}>Revenus ce mois</Text>
            <View style={styles.earningsRow}>
              <Text style={styles.earningsAmount}>{driverStats.monthlyEarnings} €</Text>
              <View style={styles.growthPill}>
                <Feather name="trending-up" size={12} color={Colors.success} />
                <Text style={styles.growthText}>+{driverStats.growthPercent}%</Text>
              </View>
            </View>
          </View>

          {/* Mini stats */}
          <View style={styles.miniStatsRow}>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{driverStats.totalEarnings.toLocaleString()} €</Text>
              <Text style={styles.miniStatLabel}>Total gagné</Text>
            </View>
            <View style={styles.miniStatDivider} />
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{driverStats.campaignsDone}</Text>
              <Text style={styles.miniStatLabel}>Campagnes</Text>
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
        </LinearGradient>

        {/* ─── White Content Area ────────────────────────── */}
        <View style={styles.contentSheet}>
          {/* Quick stats */}
          <View style={styles.quickStatsRow}>
            <View style={styles.quickStatCard}>
              <View style={[styles.quickStatIcon, { backgroundColor: Colors.navySoft }]}>
                <Feather name="volume-2" size={18} color={Colors.navy} />
              </View>
              <Text style={styles.quickStatValue}>{driverStats.activeCampaigns}</Text>
              <Text style={styles.quickStatLabel}>Actives</Text>
            </View>
            <View style={styles.quickStatCard}>
              <View style={[styles.quickStatIcon, { backgroundColor: Colors.successSoft }]}>
                <Feather name="activity" size={18} color={Colors.success} />
              </View>
              <Text style={styles.quickStatValue}>{formatKm(driverStats.totalKm)}</Text>
              <Text style={styles.quickStatLabel}>Kilomètres</Text>
            </View>
            <View style={styles.quickStatCard}>
              <View style={[styles.quickStatIcon, { backgroundColor: Colors.infoSoft }]}>
                <Feather name="truck" size={18} color={Colors.info} />
              </View>
              <Text style={styles.quickStatValue}>{activeCampaigns.length}</Text>
              <Text style={styles.quickStatLabel}>En cours</Text>
            </View>
          </View>

          {/* Active campaign */}
          {activeCampaign && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Campagne en cours</Text>
                <TouchableOpacity onPress={() => router.push(`/(driver)/campaign/${activeCampaign.id}`)}>
                  <Text style={styles.seeMore}>Voir</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.activeCampaignCard}
                onPress={() => router.push(`/(driver)/campaign/${activeCampaign.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.acHeader}>
                  <BrandLogo domain={activeCampaign.domain} name={activeCampaign.brand} size={36} />
                  <View style={styles.acHeaderText}>
                    <Text style={styles.acBrand}>{activeCampaign.brand}</Text>
                    <Text style={styles.acTitle} numberOfLines={1}>{activeCampaign.title}</Text>
                  </View>
                  <Badge variant="info" label={activeCampaign.city} />
                </View>

                <View style={styles.acMetrics}>
                  <View style={styles.acMetric}>
                    <Feather name="clock" size={13} color={Colors.gray400} />
                    <Text style={styles.acMetricText}>{daysRemaining(activeCampaign.endDate)} restants</Text>
                  </View>
                  <View style={styles.acMetric}>
                    <Feather name="dollar-sign" size={13} color={Colors.gray400} />
                    <Text style={styles.acMetricText}>{activeCampaign.reward} €</Text>
                  </View>
                  <View style={styles.acMetric}>
                    <Feather name="navigation" size={13} color={Colors.gray400} />
                    <Text style={styles.acMetricText}>{formatKm(activeCampaign.kmDone)}/{formatKm(activeCampaign.kmTotal)}</Text>
                  </View>
                </View>

                <View style={styles.acProgressRow}>
                  <View style={styles.acProgressTrack}>
                    <LinearGradient
                      colors={[Colors.navy, Colors.navyLight]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.acProgressFill, { width: `${Math.round(activeCampaign.progress * 100)}%` }]}
                    />
                  </View>
                  <Text style={styles.acProgressPct}>{Math.round(activeCampaign.progress * 100)}%</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Opportunities */}
          {availableCampaigns.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Nouvelles opportunités</Text>
                <TouchableOpacity onPress={() => router.push('/(driver)/campaigns')}>
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
                    onPress={() => router.push(`/(driver)/campaign/${campaign.id}`)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.oppHeader}>
                      <BrandLogo domain={campaign.domain} name={campaign.brand} size={32} />
                      <View style={styles.oppHeaderText}>
                        <Text style={styles.oppBrand}>{campaign.brand}</Text>
                        <Text style={styles.oppTitle} numberOfLines={1}>{campaign.title}</Text>
                      </View>
                    </View>
                    <View style={styles.oppFooter}>
                      <Badge variant="navy" label={campaign.city} icon="map-pin" />
                      <Text style={styles.oppReward}>{campaign.reward} €</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          <View style={{ height: 100 }} />
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

  // ─── Hero gradient ────────────────────────────────────────
  heroGradient: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.white,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 3,
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.1)',
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
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 4,
  },
  earningsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  earningsAmount: {
    fontFamily: FontFamily.black,
    fontSize: 38,
    color: Colors.white,
    lineHeight: 42,
  },
  growthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16,185,129,0.15)',
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
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 4,
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
    color: 'rgba(255,255,255,0.45)',
    marginTop: 3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  // ─── White content sheet ──────────────────────────────────
  contentSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingTop: 24,
    paddingHorizontal: 20,
    minHeight: 400,
  },

  // Quick stats
  quickStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: Colors.navyTint,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 6,
  },
  quickStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStatValue: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.black,
    lineHeight: 20,
  },
  quickStatLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: Colors.gray500,
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
    borderColor: Colors.gray200,
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
    borderColor: Colors.gray200,
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
