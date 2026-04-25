import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Badge from '../../components/ui/Badge';
import BrandLogo from '../../components/BrandLogo';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';

const { width } = Dimensions.get('window');

export default function AdvertiserHomeScreen() {
  const insets = useSafeAreaInsets();
  const { currentCompany } = useAuth();
  const { campaigns, unreadCount } = useData();

  const company = currentCompany;
  const companyId = company?.id ?? 'c1';
  const companyName = company?.companyName ?? 'Annonceur';

  const companyCampaigns = campaigns.filter((c) => c.companyId === companyId);
  const activeCampaigns = companyCampaigns.filter((c) => c.status === 'active');
  const completedCampaigns = companyCampaigns.filter((c) => c.status === 'completed');

  const totalBudget = companyCampaigns.reduce((sum, c) => sum + c.reward * c.driversNeeded, 0);
  const vehiclesInCirculation = activeCampaigns.reduce((sum, c) => sum + c.driversAssigned, 0);
  const uniqueCities = [...new Set(companyCampaigns.map((c) => c.city))].length;

  const growthPercent = 12;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.root}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Gradient Hero Header */}
        <LinearGradient
          colors={[Colors.navyDark, Colors.navy, Colors.navyLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroGradient, { paddingTop: insets.top + 12 }]}
        >
          {/* Top bar */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.greeting}>{companyName}</Text>
              <Text style={styles.subtitle}>Tableau de bord</Text>
            </View>
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => router.push('/(advertiser)/notifications')}
            >
              <Feather name="bell" size={22} color={Colors.white} />
              {unreadCount > 0 && (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Budget total */}
          <View style={styles.earningsSection}>
            <Text style={styles.earningsLabel}>Budget total investi</Text>
            <View style={styles.earningsRow}>
              <Text style={styles.earningsAmount}>{totalBudget.toLocaleString()} €</Text>
              <View style={styles.growthPill}>
                <Feather name="trending-up" size={12} color={Colors.success} />
                <Text style={styles.growthText}>+{growthPercent}%</Text>
              </View>
            </View>
          </View>

          {/* Mini stats */}
          <View style={styles.miniStatsRow}>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{companyCampaigns.length}</Text>
              <Text style={styles.miniStatLabel}>Campagnes</Text>
            </View>
            <View style={styles.miniStatDivider} />
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{vehiclesInCirculation}</Text>
              <Text style={styles.miniStatLabel}>Véhicules actifs</Text>
            </View>
            <View style={styles.miniStatDivider} />
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{uniqueCities}</Text>
              <Text style={styles.miniStatLabel}>Villes</Text>
            </View>
          </View>
        </LinearGradient>

        {/* White Content Area */}
        <View style={styles.contentSheet}>
          {/* Quick action cards */}
          <View style={styles.quickStatsRow}>
            <TouchableOpacity
              style={styles.quickStatCard}
              onPress={() => router.push('/(advertiser)/campaigns')}
              activeOpacity={0.7}
            >
              <View style={[styles.quickStatIcon, { backgroundColor: Colors.navySoft }]}>
                <Feather name="map-pin" size={18} color={Colors.navy} />
              </View>
              <Text style={styles.quickStatLabel}>Bornes</Text>
              <Text style={styles.quickStatSub}>actives</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickStatCard}
              onPress={() => router.push('/(advertiser)/campaigns')}
              activeOpacity={0.7}
            >
              <View style={[styles.quickStatIcon, { backgroundColor: Colors.successSoft }]}>
                <Feather name="layers" size={18} color={Colors.success} />
              </View>
              <Text style={styles.quickStatLabel}>Voir</Text>
              <Text style={styles.quickStatSub}>campagnes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickStatCard}
              onPress={() => router.push('/(advertiser)/stats')}
              activeOpacity={0.7}
            >
              <View style={[styles.quickStatIcon, { backgroundColor: Colors.infoSoft }]}>
                <Feather name="bar-chart-2" size={18} color={Colors.info} />
              </View>
              <Text style={styles.quickStatLabel}>Stats</Text>
              <Text style={styles.quickStatSub}>lecture</Text>
            </TouchableOpacity>
          </View>

          {/* Active campaigns */}
          {activeCampaigns.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Campagnes en cours</Text>
                <TouchableOpacity onPress={() => router.push('/(advertiser)/campaigns')}>
                  <Text style={styles.seeMore}>Tout voir</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
                style={styles.horizontalScrollWrap}
              >
                {activeCampaigns.map((campaign) => (
                  <TouchableOpacity
                    key={campaign.id}
                    style={styles.activeCampaignCard}
                    activeOpacity={0.7}
                  >
                    <View style={styles.acHeader}>
                      <BrandLogo domain={campaign.domain} name={campaign.brand} size={36} />
                      <View style={styles.acHeaderText}>
                        <Text style={styles.acBrand}>{campaign.brand}</Text>
                        <Text style={styles.acTitle} numberOfLines={1}>{campaign.title}</Text>
                      </View>
                      <Badge variant="info" label={campaign.city} />
                    </View>

                    <View style={styles.acMetrics}>
                      <View style={styles.acMetric}>
                        <Feather name="users" size={13} color={Colors.gray400} />
                        <Text style={styles.acMetricText}>{campaign.driversAssigned}/{campaign.driversNeeded}</Text>
                      </View>
                      <View style={styles.acMetric}>
                        <Feather name="dollar-sign" size={13} color={Colors.gray400} />
                        <Text style={styles.acMetricText}>{campaign.reward} €</Text>
                      </View>
                      <View style={styles.acMetric}>
                        <Feather name="navigation" size={13} color={Colors.gray400} />
                        <Text style={styles.acMetricText}>{campaign.kmDone}/{campaign.kmTotal} km</Text>
                      </View>
                    </View>

                    <View style={styles.acProgressRow}>
                      <View style={styles.acProgressTrack}>
                        <LinearGradient
                          colors={[Colors.navy, Colors.navyLight]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[styles.acProgressFill, { width: `${Math.round(campaign.progress * 100)}%` }]}
                        />
                      </View>
                      <Text style={styles.acProgressPct}>{Math.round(campaign.progress * 100)}%</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* History section */}
          {completedCampaigns.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Historique récent</Text>
                <TouchableOpacity onPress={() => router.push('/(advertiser)/campaigns')}>
                  <Text style={styles.seeMore}>Tout voir</Text>
                </TouchableOpacity>
              </View>

              {completedCampaigns.slice(0, 3).map((campaign) => (
                <View key={campaign.id} style={styles.historyCard}>
                  <BrandLogo domain={campaign.domain} name={campaign.brand} size={36} />
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyTitle} numberOfLines={1}>{campaign.title}</Text>
                    <Text style={styles.historyMeta}>
                      {campaign.city} · {campaign.durationDays} jours · {campaign.reward} €
                    </Text>
                  </View>
                  <Badge variant="neutral" label="Terminée" />
                </View>
              ))}
            </View>
          )}

          {/* Bottom spacer for floating tab bar */}
          <View style={{ height: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 16 }} />
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

  // Hero gradient
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

  // White content sheet
  contentSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingTop: 24,
    paddingHorizontal: 20,
    minHeight: 400,
  },

  // Quick action cards
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
  quickStatLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.black,
    lineHeight: 16,
  },
  quickStatSub: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: Colors.gray500,
    marginTop: -4,
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

  // Active campaign cards (horizontal)
  horizontalScrollWrap: {
    marginHorizontal: -20,
  },
  horizontalScroll: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 4,
  },
  activeCampaignCard: {
    width: 280,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginRight: 10,
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

  // History cards
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Shadows.sm,
  },
  historyInfo: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },
  historyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.black,
  },
  historyMeta: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 2,
  },
});
