import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { Campaign } from '../../constants/Types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import BrandLogo from '../../components/BrandLogo';

type FilterKey = 'all' | 'available' | 'active' | 'completed';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'available', label: 'Disponibles' },
  { key: 'active', label: 'En cours' },
  { key: 'completed', label: 'Terminées' },
];

const statusBadge: Record<string, { variant: 'success' | 'warning' | 'info' | 'neutral'; label: string }> = {
  available: { variant: 'success', label: 'Disponible' },
  active: { variant: 'info', label: 'En cours' },
  completed: { variant: 'neutral', label: 'Terminée' },
  upcoming: { variant: 'warning', label: 'À venir' },
};

export default function CompanyMyCampaignsScreen() {
  const { currentCompany } = useAuth();
  const { campaigns, drivers } = useData();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const companyId = currentCompany?.id ?? 'c1';
  const companyCampaigns = campaigns.filter((c) => c.companyId === companyId);

  const filtered = companyCampaigns.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const getAssignedDrivers = (campaign: Campaign) =>
    drivers.filter((d) => campaign.assignedDriverIds.includes(d.id));

  return (
    <Screen>
      <ScreenHeader title="Mes campagnes" />

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setFilter(f.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Campaign list */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="folder" size={48} color={Colors.gray300} />
            <Text style={styles.emptyText}>Aucune campagne trouvée</Text>
          </View>
        ) : (
          filtered.map((campaign) => {
            const badge = statusBadge[campaign.status];
            return (
              <Card
                key={campaign.id}
                variant="surface"
                style={styles.campaignCard}
                onPress={() => setSelectedCampaign(campaign)}
              >
                <View style={styles.cardHeader}>
                  <BrandLogo domain={campaign.domain} name={campaign.brand} size={36} />
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{campaign.title}</Text>
                    <Text style={styles.cardMeta}>
                      {campaign.city} · {campaign.startDate} → {campaign.endDate}
                    </Text>
                  </View>
                  <Badge variant={badge.variant} label={badge.label} />
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardStat}>
                    {campaign.driversAssigned}/{campaign.driversNeeded} chauffeurs
                  </Text>
                  <Text style={styles.cardReward}>{campaign.reward} €</Text>
                </View>
                {campaign.status === 'active' && (
                  <View style={styles.progressRow}>
                    <View style={styles.progressTrack}>
                      <View
                        style={[styles.progressFill, { width: `${Math.round(campaign.progress * 100)}%` }]}
                      />
                    </View>
                    <Text style={styles.progressLabel}>{Math.round(campaign.progress * 100)}%</Text>
                  </View>
                )}
              </Card>
            );
          })
        )}
      </ScrollView>

      {/* Detail bottom sheet modal */}
      <Modal
        visible={selectedCampaign !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedCampaign(null)}
      >
        {selectedCampaign && (
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalContent}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <BrandLogo domain={selectedCampaign.domain} name={selectedCampaign.brand} size={48} />
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalTitle}>{selectedCampaign.title}</Text>
                  <Badge
                    variant={statusBadge[selectedCampaign.status].variant}
                    label={statusBadge[selectedCampaign.status].label}
                  />
                </View>
              </View>

              {/* Info */}
              <Card variant="outlined" style={styles.modalInfoCard}>
                <Text style={styles.modalDescription}>{selectedCampaign.description}</Text>
                <View style={styles.modalDetailRow}>
                  <Feather name="map-pin" size={16} color={Colors.gray500} />
                  <Text style={styles.modalDetail}>
                    {selectedCampaign.city} · {selectedCampaign.zones.join(', ')}
                  </Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Feather name="calendar" size={16} color={Colors.gray500} />
                  <Text style={styles.modalDetail}>
                    {selectedCampaign.startDate} → {selectedCampaign.endDate} ({selectedCampaign.durationDays} jours)
                  </Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Feather name="dollar-sign" size={16} color={Colors.gray500} />
                  <Text style={styles.modalDetail}>{selectedCampaign.reward} € / véhicule</Text>
                </View>
              </Card>

              {/* Progress */}
              {selectedCampaign.status === 'active' && (
                <Card variant="surface" style={styles.modalProgressCard}>
                  <Text style={styles.modalSectionTitle}>Progression</Text>
                  <View style={styles.progressRow}>
                    <View style={styles.progressTrackLarge}>
                      <View
                        style={[styles.progressFillLarge, { width: `${Math.round(selectedCampaign.progress * 100)}%` }]}
                      />
                    </View>
                    <Text style={styles.progressLabelLarge}>{Math.round(selectedCampaign.progress * 100)}%</Text>
                  </View>
                  <Text style={styles.modalKm}>
                    {selectedCampaign.kmDone.toLocaleString()} / {selectedCampaign.kmTotal.toLocaleString()} km
                  </Text>
                </Card>
              )}

              {/* Assigned drivers */}
              {getAssignedDrivers(selectedCampaign).length > 0 && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>
                    Chauffeurs assignés ({getAssignedDrivers(selectedCampaign).length})
                  </Text>
                  {getAssignedDrivers(selectedCampaign).map((driver) => (
                    <View key={driver.id} style={styles.driverRow}>
                      <View style={styles.driverAvatar}>
                        <Text style={styles.driverInitials}>
                          {driver.firstName[0]}{driver.lastName[0]}
                        </Text>
                      </View>
                      <View style={styles.driverInfo}>
                        <Text style={styles.driverName}>
                          {driver.firstName} {driver.lastName}
                        </Text>
                        <Text style={styles.driverMeta}>
                          {driver.vehicleModel} · {driver.city}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Close button */}
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedCampaign(null)}
              >
                <Text style={styles.closeBtnText}>Fermer</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  // Filters
  filterRow: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
  },
  filterChipActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  filterText: {
    ...Typography.bodySmall,
    fontFamily: FontFamily.medium,
    color: Colors.gray600,
  },
  filterTextActive: {
    color: Colors.white,
  },

  // List
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: Spacing.md,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.gray400,
  },

  // Campaign card
  campaignCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.sm,
  },
  cardTitle: {
    ...Typography.h3,
    color: Colors.black,
    fontSize: 15,
  },
  cardMeta: {
    ...Typography.caption,
    color: Colors.gray500,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardStat: {
    ...Typography.bodySmall,
    color: Colors.gray600,
  },
  cardReward: {
    ...Typography.bodyMedium,
    fontFamily: FontFamily.bold,
    color: Colors.navy,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
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

  // Modal
  modal: {
    flex: 1,
    backgroundColor: Colors.navyTint,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  modalContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  modalHeaderText: {
    flex: 1,
    marginLeft: Spacing.lg,
    gap: Spacing.sm,
  },
  modalTitle: {
    ...Typography.h2,
    color: Colors.black,
  },
  modalInfoCard: {
    marginBottom: Spacing.lg,
  },
  modalDescription: {
    ...Typography.body,
    color: Colors.gray700,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  modalDetail: {
    ...Typography.bodySmall,
    color: Colors.gray600,
    flex: 1,
  },
  modalProgressCard: {
    marginBottom: Spacing.lg,
  },
  progressTrackLarge: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFillLarge: {
    height: 8,
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  progressLabelLarge: {
    ...Typography.bodyMedium,
    color: Colors.gray600,
  },
  modalKm: {
    ...Typography.bodySmall,
    color: Colors.gray500,
    marginTop: Spacing.sm,
  },

  // Drivers
  modalSection: {
    marginBottom: Spacing.lg,
  },
  modalSectionTitle: {
    ...Typography.h3,
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  driverAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInitials: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.white,
  },
  driverInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  driverName: {
    ...Typography.bodyMedium,
    color: Colors.black,
  },
  driverMeta: {
    ...Typography.caption,
    color: Colors.gray500,
  },

  // Close
  closeBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.navy,
  },
  closeBtnText: {
    ...Typography.button,
    color: Colors.navy,
  },
});
