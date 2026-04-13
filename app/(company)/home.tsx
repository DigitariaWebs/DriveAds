import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import BrandLogo from '../../components/BrandLogo';

export default function CompanyHomeScreen() {
  const { currentCompany } = useAuth();
  const { campaigns, unreadCount } = useData();

  const company = currentCompany;
  const companyId = company?.id ?? 'c1';

  const companyCampaigns = campaigns.filter((c) => c.companyId === companyId);
  const activeCampaigns = companyCampaigns.filter((c) => c.status === 'active');
  const completedCampaigns = companyCampaigns.filter((c) => c.status === 'completed');

  const vehiclesInCirculation = activeCampaigns.reduce((sum, c) => sum + c.driversAssigned, 0);
  const uniqueCities = [...new Set(companyCampaigns.map((c) => c.city))].length;

  return (
    <Screen scroll>
      <ScreenHeader
        title={company?.companyName ?? 'Entreprise'}
        subtitle="Tableau de bord"
        notificationCount={unreadCount}
      />

      <View style={styles.content}>
        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard
            icon="volume-2"
            label="Campagnes actives"
            value={String(activeCampaigns.length)}
          />
          <StatCard
            icon="truck"
            label="Véhicules en circulation"
            value={String(vehiclesInCirculation)}
          />
          <StatCard
            icon="map-pin"
            label="Villes couvertes"
            value={String(uniqueCities)}
          />
        </View>

        {/* Active campaigns section */}
        {activeCampaigns.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vos campagnes en cours</Text>
          </View>
        )}
      </View>

      {/* Horizontal scroll for active campaigns */}
      {activeCampaigns.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {activeCampaigns.map((campaign) => (
            <Card key={campaign.id} variant="surface" style={styles.compactCard}>
              <View style={styles.compactHeader}>
                <BrandLogo domain={campaign.domain} name={campaign.brand} size={36} />
                <View style={styles.compactInfo}>
                  <Text style={styles.compactTitle} numberOfLines={1}>{campaign.title}</Text>
                  <Text style={styles.compactCity}>{campaign.city}</Text>
                </View>
              </View>
              <View style={styles.compactMetrics}>
                <Text style={styles.compactMetric}>
                  {campaign.driversAssigned}/{campaign.driversNeeded} chauffeurs
                </Text>
                <Text style={styles.compactMetric}>{campaign.reward} €</Text>
              </View>
              <View style={styles.progressRow}>
                <View style={styles.progressTrack}>
                  <View
                    style={[styles.progressFill, { width: `${Math.round(campaign.progress * 100)}%` }]}
                  />
                </View>
                <Text style={styles.progressLabel}>{Math.round(campaign.progress * 100)}%</Text>
              </View>
            </Card>
          ))}
        </ScrollView>
      )}

      <View style={styles.content}>
        {/* Completed campaigns */}
        {completedCampaigns.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Historique récent</Text>
            {completedCampaigns.slice(0, 2).map((campaign) => (
              <Card key={campaign.id} variant="outlined" style={styles.historyCard}>
                <View style={styles.historyRow}>
                  <BrandLogo domain={campaign.domain} name={campaign.brand} size={36} />
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyTitle} numberOfLines={1}>{campaign.title}</Text>
                    <Text style={styles.historyMeta}>
                      {campaign.city} · {campaign.durationDays} jours · {campaign.reward} €
                    </Text>
                  </View>
                  <Badge variant="neutral" label="Terminée" />
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* CTA card */}
        <Card
          variant="navy"
          style={styles.ctaCard}
          onPress={() => router.push('/(company)/request')}
        >
          <View style={styles.ctaRow}>
            <Feather name="plus-circle" size={28} color={Colors.white} />
            <View style={styles.ctaText}>
              <Text style={styles.ctaTitle}>Lancer une nouvelle campagne</Text>
              <Text style={styles.ctaSubtitle}>
                Créez votre campagne et touchez des milliers de personnes
              </Text>
            </View>
            <Feather name="arrow-right" size={22} color="rgba(255,255,255,0.6)" />
          </View>
        </Card>
      </View>

      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.xl,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },

  // Section
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.black,
    marginBottom: Spacing.md,
  },

  // Horizontal scroll
  horizontalScroll: {
    paddingLeft: Spacing.xl,
    paddingRight: Spacing.sm,
    paddingBottom: Spacing.lg,
  },

  // Compact campaign card
  compactCard: {
    width: 260,
    marginRight: Spacing.md,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  compactInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  compactTitle: {
    ...Typography.h3,
    color: Colors.black,
    fontSize: 15,
  },
  compactCity: {
    ...Typography.caption,
    color: Colors.gray500,
  },
  compactMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  compactMetric: {
    ...Typography.bodySmall,
    color: Colors.gray600,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 5,
    backgroundColor: Colors.gray200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 5,
    backgroundColor: Colors.success,
    borderRadius: 3,
  },
  progressLabel: {
    ...Typography.caption,
    color: Colors.gray500,
  },

  // History
  historyCard: {
    marginBottom: Spacing.sm,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.sm,
  },
  historyTitle: {
    ...Typography.bodyMedium,
    color: Colors.black,
  },
  historyMeta: {
    ...Typography.caption,
    color: Colors.gray500,
    marginTop: 2,
  },

  // CTA
  ctaCard: {
    marginTop: Spacing.sm,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  ctaText: {
    flex: 1,
  },
  ctaTitle: {
    ...Typography.h3,
    color: Colors.white,
  },
  ctaSubtitle: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },

  bottomSpacer: {
    height: Spacing.xxl,
  },
});
