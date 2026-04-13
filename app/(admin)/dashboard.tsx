import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { useData } from '../../context/DataContext';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import CreateCampaignModal from '../../components/modals/CreateCampaignModal';

export default function AdminDashboardScreen() {
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

  return (
    <Screen scroll>
      <ScreenHeader title="Administration" subtitle="Tableau de bord" />

      <View style={styles.content}>
        {/* ─── 1. Revenue Hero Card ────────────────────── */}
        <Card variant="navy" style={styles.heroCard}>
          <Text style={styles.heroLabel}>Revenus mensuels</Text>
          <View style={styles.heroRow}>
            <Text style={styles.heroAmount}>
              {adminStats.monthlyRevenue.toLocaleString()} €
            </Text>
            <Badge
              variant="success"
              label={`+${adminStats.revenueGrowth}% vs mois dernier`}
              icon="trending-up"
            />
          </View>
        </Card>

        {/* ─── 2. Quick Actions Grid (2x2) ────────────── */}
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.gridRow}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push('/(admin)/directory')}
            activeOpacity={0.7}
          >
            <View style={styles.gridIconRow}>
              <Feather name="truck" size={24} color={Colors.navy} />
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
              <Feather name="briefcase" size={24} color={Colors.navy} />
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
            <Feather name="plus-circle" size={24} color={Colors.navy} />
            <Text style={styles.gridLabel}>Créer campagne</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push('/(admin)/campaigns')}
            activeOpacity={0.7}
          >
            <View style={styles.gridIconRow}>
              <Feather name="bar-chart-2" size={24} color={Colors.navy} />
              <View style={[styles.gridBadge, { backgroundColor: Colors.info }]}>
                <Text style={styles.gridBadgeText}>{activeCampaignsCount}</Text>
              </View>
            </View>
            <Text style={styles.gridLabel}>Suivi</Text>
          </TouchableOpacity>
        </View>

        {/* ─── 3. Répartition par ville ────────────────── */}
        <Text style={styles.sectionTitle}>Répartition par ville</Text>
        <View style={styles.cityRow}>
          {adminStats.citiesBreakdown.map((item) => (
            <View key={item.city} style={styles.cityCard}>
              <Text style={styles.cityName}>{item.city}</Text>
              <Text style={styles.cityCount}>{item.vehicles} véhicules</Text>
            </View>
          ))}
        </View>

        {/* ─── 4. Inscriptions en attente ──────────────── */}
        {pendingItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Inscriptions en attente</Text>
              <TouchableOpacity onPress={() => router.push('/(admin)/validations')}>
                <Text style={styles.viewAllLink}>Voir tout →</Text>
              </TouchableOpacity>
            </View>

            {pendingItems.map((item) => (
              <View key={item.id} style={styles.pendingItem}>
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
      </View>

      <View style={styles.bottomSpacer} />

      <CreateCampaignModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.xl,
  },

  // Hero
  heroCard: {
    marginBottom: Spacing.xxl,
  },
  heroLabel: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: Spacing.xs,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  heroAmount: {
    ...Typography.displayLarge,
    color: Colors.white,
  },

  // Sections
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  viewAllLink: {
    ...Typography.bodySmall,
    fontFamily: FontFamily.semiBold,
    color: Colors.navy,
  },

  // Grid
  gridRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  gridItem: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  gridIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
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
    ...Typography.bodySmall,
    fontFamily: FontFamily.medium,
    color: Colors.gray700,
  },

  // Cities
  cityRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  cityCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  cityName: {
    ...Typography.bodyMedium,
    color: Colors.black,
  },
  cityCount: {
    ...Typography.caption,
    color: Colors.gray500,
    marginTop: 2,
  },

  // Pending items
  pendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  pendingInfo: {
    flex: 1,
    gap: Spacing.sm,
  },
  pendingName: {
    ...Typography.bodyMedium,
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

  bottomSpacer: {
    height: Spacing.xxl,
  },
});
