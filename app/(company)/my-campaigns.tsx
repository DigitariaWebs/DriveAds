import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { Campaign } from '../../constants/Types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Badge from '../../components/ui/Badge';
import BrandLogo from '../../components/BrandLogo';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';

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
  const insets = useSafeAreaInsets();
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

  const renderCampaignCard = ({ item: campaign }: { item: Campaign }) => {
    const badge = statusBadge[campaign.status];
    return (
      <TouchableOpacity
        style={styles.campaignCard}
        onPress={() => setSelectedCampaign(campaign)}
        activeOpacity={0.7}
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
              <LinearGradient
                colors={[Colors.navy, Colors.navyLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${Math.round(campaign.progress * 100)}%` }]}
              />
            </View>
            <Text style={styles.progressLabel}>{Math.round(campaign.progress * 100)}%</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mes campagnes</Text>
          <Text style={styles.headerSubtitle}>
            {filtered.length} campagne{filtered.length > 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity style={styles.searchBtn}>
          <Feather name="search" size={20} color={Colors.navy} />
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
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
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderCampaignCard}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Feather name="folder" size={32} color={Colors.gray300} />
            </View>
            <Text style={styles.emptyTitle}>Aucune campagne trouvée</Text>
            <Text style={styles.emptyText}>Essayez un autre filtre</Text>
          </View>
        }
      />

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
              <View style={styles.modalInfoCard}>
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
              </View>

              {/* Progress */}
              {selectedCampaign.status === 'active' && (
                <View style={styles.modalProgressCard}>
                  <Text style={styles.modalSectionTitle}>Progression</Text>
                  <View style={styles.progressRow}>
                    <View style={styles.progressTrackLarge}>
                      <LinearGradient
                        colors={[Colors.navy, Colors.navyLight]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressFillLarge, { width: `${Math.round(selectedCampaign.progress * 100)}%` }]}
                      />
                    </View>
                    <Text style={styles.progressLabelLarge}>{Math.round(selectedCampaign.progress * 100)}%</Text>
                  </View>
                  <Text style={styles.modalKm}>
                    {selectedCampaign.kmDone.toLocaleString()} / {selectedCampaign.kmTotal.toLocaleString()} km
                  </Text>
                </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.navyTint,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: FontFamily.black,
    fontSize: 22,
    color: Colors.black,
  },
  headerSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },

  // Filters
  filterScroll: {
    flexGrow: 0,
  },
  filterRow: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  filterChipActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  filterText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.gray600,
  },
  filterTextActive: {
    color: Colors.white,
  },

  // List
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 16,
  },

  // Empty
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 8,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.gray700,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray400,
  },

  // Campaign card
  campaignCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.gray100,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },
  cardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.black,
  },
  cardMeta: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardStat: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray600,
  },
  cardReward: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.navy,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  progressTrack: {
    flex: 1,
    height: 7,
    backgroundColor: Colors.gray100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 7,
    borderRadius: 4,
  },
  progressLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: Colors.navy,
    minWidth: 34,
    textAlign: 'right',
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
    marginTop: 8,
    marginBottom: 12,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalHeaderText: {
    flex: 1,
    marginLeft: 12,
    gap: 6,
  },
  modalTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.black,
  },
  modalInfoCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.gray100,
    ...Shadows.sm,
  },
  modalDescription: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.gray700,
    marginBottom: 12,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  modalDetail: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray600,
    flex: 1,
  },
  modalProgressCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.gray100,
    ...Shadows.sm,
  },
  progressTrackLarge: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.gray100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFillLarge: {
    height: 8,
    borderRadius: 4,
  },
  progressLabelLarge: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.navy,
    minWidth: 34,
    textAlign: 'right',
  },
  modalKm: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 6,
  },

  // Drivers
  modalSection: {
    marginBottom: 12,
  },
  modalSectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.black,
    marginBottom: 12,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
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
    marginLeft: 10,
  },
  driverName: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.black,
  },
  driverMeta: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.gray500,
  },

  // Close
  closeBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.navy,
  },
  closeBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.navy,
  },
});
