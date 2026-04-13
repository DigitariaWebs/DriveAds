import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { Typography, FontFamily } from '../../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../../constants/TabBarStyle';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import BrandLogo from '../../../components/BrandLogo';

const statusBadge: Record<string, { variant: 'success' | 'warning' | 'info' | 'navy' | 'neutral'; label: string }> = {
  available: { variant: 'success', label: 'Disponible' },
  active: { variant: 'info', label: 'En cours' },
  completed: { variant: 'neutral', label: 'Terminée' },
  upcoming: { variant: 'warning', label: 'À venir' },
};

export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { currentDriver } = useAuth();
  const { campaigns, acceptCampaign } = useData();

  const campaign = campaigns.find((c) => c.id === id);
  const driverId = currentDriver?.id ?? 'd1';

  if (!campaign) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.center}>
          <Text style={styles.emptyText}>Campagne introuvable</Text>
          <Button variant="outline" onPress={() => router.back()}>
            Retour
          </Button>
        </View>
      </View>
    );
  }

  const badge = statusBadge[campaign.status];
  const isAccepted = campaign.assignedDriverIds.includes(driverId);
  const canAccept = campaign.status === 'available' && !isAccepted;

  const handleAccept = () => {
    Alert.alert(
      'Confirmer',
      'Êtes-vous sûr de vouloir accepter cette campagne ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            acceptCampaign(campaign.id, driverId);
            Alert.alert('Succès', 'Mission acceptée avec succès !', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détail campagne</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero placeholder */}
        <View style={styles.hero}>
          <BrandLogo domain={campaign.domain} name={campaign.brand} size={72} />
        </View>

        {/* Brand + title */}
        <View style={styles.titleSection}>
          <Text style={styles.brand}>{campaign.brand}</Text>
          <Text style={styles.title}>{campaign.title}</Text>
          <View style={styles.badgeRow}>
            <Badge variant={badge.variant} label={badge.label} />
            {isAccepted && campaign.status !== 'completed' && (
              <Badge variant="success" label="Mission acceptée ✓" icon="check-circle" />
            )}
          </View>
        </View>

        {/* Details card */}
        <Card variant="surface" style={styles.detailsCard}>
          <Text style={styles.description}>{campaign.description}</Text>

          <View style={styles.detailRow}>
            <Feather name="map-pin" size={16} color={Colors.gray500} />
            <Text style={styles.detailLabel}>Ville :</Text>
            <Text style={styles.detailValue}>{campaign.city}</Text>
          </View>

          <View style={styles.detailRow}>
            <Feather name="map" size={16} color={Colors.gray500} />
            <Text style={styles.detailLabel}>Zones :</Text>
            <Text style={styles.detailValue}>{campaign.zones.join(', ')}</Text>
          </View>

          <View style={styles.detailRow}>
            <Feather name="calendar" size={16} color={Colors.gray500} />
            <Text style={styles.detailLabel}>Du</Text>
            <Text style={styles.detailValue}>
              {campaign.startDate} au {campaign.endDate} ({campaign.durationDays} jours)
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Feather name="users" size={16} color={Colors.gray500} />
            <Text style={styles.detailLabel}>Chauffeurs :</Text>
            <Text style={styles.detailValue}>
              {campaign.driversAssigned}/{campaign.driversNeeded}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Feather name="dollar-sign" size={16} color={Colors.gray500} />
            <Text style={styles.detailLabel}>Rémunération :</Text>
            <Text style={styles.detailValueBold}>{campaign.reward} €</Text>
          </View>

          {campaign.status === 'active' && (
            <View style={styles.trackingRow}>
              <Badge
                variant="navy"
                label={campaign.trackingMode === 'gps' ? 'GPS' : 'Manuel'}
                icon={campaign.trackingMode === 'gps' ? 'navigation' : 'navigation'}
              />
            </View>
          )}
        </Card>

        {/* Progress for active */}
        {campaign.status === 'active' && (
          <Card variant="surface" style={styles.progressCard}>
            <Text style={styles.progressTitle}>Progression</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.round(campaign.progress * 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressLabel}>
                {Math.round(campaign.progress * 100)}%
              </Text>
            </View>
            <Text style={styles.progressKm}>
              {campaign.kmDone.toLocaleString()} / {campaign.kmTotal.toLocaleString()} km parcourus
            </Text>
          </Card>
        )}

        {/* Completed stats */}
        {campaign.status === 'completed' && (
          <Card variant="surface" style={styles.completedCard}>
            <Feather name="award" size={32} color={Colors.success} />
            <Text style={styles.completedTitle}>Campagne terminée</Text>
            <Text style={styles.completedStat}>
              {campaign.kmTotal.toLocaleString()} km parcourus · {campaign.reward} € gagnés
            </Text>
          </Card>
        )}
      </ScrollView>

      {/* Bottom action buttons — above floating tab bar */}
      {canAccept && (
        <View style={[styles.bottomActions, { bottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 8 }]}>
          <View style={styles.actionBtn}>
            <Button variant="primary" size="md" onPress={handleAccept}>
              Accepter la mission
            </Button>
          </View>
          <View style={styles.actionBtnSecondary}>
            <Button variant="outline" size="md" onPress={() => router.back()}>
              Refuser
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.navyTint,
  },
  flex: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.gray500,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.navy,
    flex: 1,
    textAlign: 'center',
  },

  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 180,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    backgroundColor: Colors.navySoft,
    borderRadius: Radius.xl,
    marginBottom: Spacing.xl,
  },

  // Title section
  titleSection: {
    marginBottom: Spacing.xl,
  },
  brand: {
    ...Typography.captionUpper,
    color: Colors.gray500,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.h1,
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },

  // Details card
  detailsCard: {
    marginBottom: Spacing.lg,
  },
  description: {
    ...Typography.body,
    color: Colors.gray700,
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  detailLabel: {
    ...Typography.bodyMedium,
    color: Colors.gray600,
    marginRight: Spacing.sm,
  },
  detailValue: {
    ...Typography.body,
    color: Colors.black,
    flex: 1,
  },
  detailValueBold: {
    ...Typography.body,
    fontFamily: FontFamily.bold,
    color: Colors.navy,
    flex: 1,
  },
  trackingRow: {
    marginTop: Spacing.md,
  },

  // Progress card
  progressCard: {
    marginBottom: Spacing.lg,
  },
  progressTitle: {
    ...Typography.h3,
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  progressLabel: {
    ...Typography.bodyMedium,
    color: Colors.gray600,
    minWidth: 40,
    textAlign: 'right',
  },
  progressKm: {
    ...Typography.bodySmall,
    color: Colors.gray500,
  },

  // Completed
  completedCard: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.xxl,
  },
  completedTitle: {
    ...Typography.h3,
    color: Colors.success,
    marginTop: Spacing.md,
  },
  completedStat: {
    ...Typography.bodySmall,
    color: Colors.gray500,
    marginTop: Spacing.sm,
  },

  // Bottom actions — floating above tab bar
  bottomActions: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  actionBtn: {
    flex: 2,
  },
  actionBtnSecondary: {
    flex: 1,
  },
});
