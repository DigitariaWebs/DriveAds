import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import { useData } from '../../context/DataContext';
import Badge from '../../components/ui/Badge';
import CreateCampaignModal from '../../components/modals/CreateCampaignModal';

export default function AdminDashboardScreen() {
  const insets = useSafeAreaInsets();
  const {
    adminStats,
    drivers,
    companies,
    campaigns,
    updateDriverStatus,
    updateCompanyStatus,
  } = useData();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const pendingDrivers = drivers.filter((d) => d.status === 'pending');
  const pendingCompanies = companies.filter((c) => c.status === 'pending');
  const activeCampaignsCount = campaigns.filter((c) => c.status === 'active').length;

  // Merge pending drivers + companies for the preview list
  const pendingItems: { id: string; name: string; type: 'driver' | 'company' }[] = [
    ...pendingDrivers.map((d) => ({
      id: d.id,
      name: `${d.firstName} ${d.lastName}`,
      type: 'driver' as const,
    })),
    ...pendingCompanies.map((c) => ({
      id: c.id,
      name: c.companyName,
      type: 'company' as const,
    })),
  ].slice(0, 3);

  const totalPending = pendingDrivers.length + pendingCompanies.length;

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
              <Text style={styles.greeting}>Administration</Text>
              <Text style={styles.subtitle}>Tableau de bord</Text>
            </View>
            <TouchableOpacity
              style={styles.gearBtn}
              onPress={() => {}}
            >
              <Feather name="settings" size={22} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Revenue hero */}
          <View style={styles.earningsSection}>
            <Text style={styles.earningsLabel}>Revenus mensuels</Text>
            <View style={styles.earningsRow}>
              <Text style={styles.earningsAmount}>
                {adminStats.monthlyRevenue.toLocaleString()} €
              </Text>
              <View style={styles.growthPill}>
                <Feather name="trending-up" size={12} color={Colors.success} />
                <Text style={styles.growthText}>+{adminStats.revenueGrowth}%</Text>
              </View>
            </View>
          </View>

          {/* Mini stats in frosted row */}
          <View style={styles.miniStatsRow}>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{drivers.length}</Text>
              <Text style={styles.miniStatLabel}>Chauffeurs</Text>
            </View>
            <View style={styles.miniStatDivider} />
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{companies.length}</Text>
              <Text style={styles.miniStatLabel}>Entreprises</Text>
            </View>
            <View style={styles.miniStatDivider} />
            <View style={styles.miniStat}>
              <Text style={styles.miniStatValue}>{activeCampaignsCount}</Text>
              <Text style={styles.miniStatLabel}>Campagnes actives</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ─── White Content Sheet ───────────────────────── */}
        <View style={styles.contentSheet}>
          {/* Quick actions 2x2 grid */}
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.gridRow}>
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => router.push('/(admin)/directory')}
              activeOpacity={0.7}
            >
              <View style={styles.gridIconRow}>
                <View style={[styles.gridIconBg, { backgroundColor: Colors.navySoft }]}>
                  <Feather name="truck" size={20} color={Colors.navy} />
                </View>
                {pendingDrivers.length > 0 && (
                  <View style={styles.gridBadge}>
                    <Text style={styles.gridBadgeText}>{pendingDrivers.length}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.gridLabel}>Chauffeurs</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => router.push('/(admin)/directory')}
              activeOpacity={0.7}
            >
              <View style={styles.gridIconRow}>
                <View style={[styles.gridIconBg, { backgroundColor: Colors.navySoft }]}>
                  <Feather name="briefcase" size={20} color={Colors.navy} />
                </View>
                {pendingCompanies.length > 0 && (
                  <View style={styles.gridBadge}>
                    <Text style={styles.gridBadgeText}>{pendingCompanies.length}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.gridLabel}>Entreprises</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gridRow}>
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => setShowCreateModal(true)}
              activeOpacity={0.7}
            >
              <View style={[styles.gridIconBg, { backgroundColor: Colors.successSoft }]}>
                <Feather name="plus-circle" size={20} color={Colors.success} />
              </View>
              <Text style={styles.gridLabel}>Créer campagne</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => router.push('/(admin)/campaigns')}
              activeOpacity={0.7}
            >
              <View style={styles.gridIconRow}>
                <View style={[styles.gridIconBg, { backgroundColor: Colors.infoSoft }]}>
                  <Feather name="bar-chart-2" size={20} color={Colors.info} />
                </View>
                <View style={[styles.gridBadge, { backgroundColor: Colors.info }]}>
                  <Text style={styles.gridBadgeText}>{activeCampaignsCount}</Text>
                </View>
              </View>
              <Text style={styles.gridLabel}>Suivi</Text>
            </TouchableOpacity>
          </View>

          {/* ─── City breakdown ─────────────────────────────── */}
          <Text style={styles.sectionTitle}>Répartition par ville</Text>
          <View style={styles.cityRow}>
            {adminStats.citiesBreakdown.map((item) => (
              <View key={item.city} style={styles.cityCard}>
                <View style={styles.cityIconWrap}>
                  <Feather name="map-pin" size={14} color={Colors.navy} />
                </View>
                <Text style={styles.cityName}>{item.city}</Text>
                <Text style={styles.cityCount}>{item.vehicles} véhicules</Text>
              </View>
            ))}
          </View>

          {/* ─── Pending registrations ──────────────────────── */}
          {pendingItems.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Inscriptions en attente</Text>
                <TouchableOpacity onPress={() => router.push('/(admin)/validations')}>
                  <Text style={styles.viewAllLink}>Voir tout</Text>
                </TouchableOpacity>
              </View>

              {pendingItems.map((item) => (
                <View key={item.id} style={styles.pendingItem}>
                  <View style={styles.pendingAvatar}>
                    <Feather
                      name={item.type === 'driver' ? 'user' : 'briefcase'}
                      size={16}
                      color={Colors.navy}
                    />
                  </View>
                  <View style={styles.pendingInfo}>
                    <Text style={styles.pendingName}>{item.name}</Text>
                    <Badge
                      variant={item.type === 'driver' ? 'navy' : 'info'}
                      label={item.type === 'driver' ? 'Chauffeur' : 'Entreprise'}
                    />
                  </View>
                  <View style={styles.pendingActions}>
                    <TouchableOpacity
                      style={styles.approveBtn}
                      onPress={() =>
                        item.type === 'driver'
                          ? updateDriverStatus(item.id, 'validated')
                          : updateCompanyStatus(item.id, 'validated')
                      }
                    >
                      <Feather name="check" size={18} color={Colors.success} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rejectBtn}
                      onPress={() =>
                        item.type === 'driver'
                          ? updateDriverStatus(item.id, 'rejected')
                          : updateCompanyStatus(item.id, 'rejected')
                      }
                    >
                      <Feather name="x" size={18} color={Colors.danger} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Bottom spacer for floating tab bar */}
          <View style={{ height: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20 }} />
        </View>
      </ScrollView>

      <CreateCampaignModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
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
  gearBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
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

  // Sections
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.black,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllLink: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.navy,
  },

  // Grid
  gridRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  gridItem: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Shadows.sm,
  },
  gridIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  gridIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridBadge: {
    backgroundColor: Colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  gridBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  gridLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.gray700,
  },

  // Cities
  cityRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  cityCard: {
    flex: 1,
    backgroundColor: Colors.navyTint,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
  },
  cityIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  cityName: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.black,
  },
  cityCount: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: Colors.gray500,
  },

  // Pending items
  pendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Shadows.sm,
  },
  pendingAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    gap: Spacing.xs,
  },
  pendingName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.black,
  },
  pendingActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  approveBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
