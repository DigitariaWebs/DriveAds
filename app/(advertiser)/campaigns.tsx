import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { useFocusEffect } from 'expo-router';
import Badge from '../../components/ui/Badge';
import BrandLogo from '../../components/BrandLogo';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import {
  AdvertiserAssignedDriver,
  AdvertiserCampaignDTO,
  fetchAdvertiserCampaignDrivers,
  fetchAdvertiserCampaigns,
} from '../../lib/campaigns-api';

type FilterKey = 'all' | 'draft' | 'upcoming' | 'active' | 'completed';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'draft', label: 'Brouillon' },
  { key: 'upcoming', label: 'À venir' },
  { key: 'active', label: 'En cours' },
  { key: 'completed', label: 'Terminées' },
];

const STATUS_BADGE: Record<
  AdvertiserCampaignDTO['status'],
  { variant: 'success' | 'warning' | 'info' | 'neutral'; label: string }
> = {
  draft: { variant: 'warning', label: 'Brouillon' },
  upcoming: { variant: 'info', label: 'À venir' },
  active: { variant: 'success', label: 'En cours' },
  completed: { variant: 'neutral', label: 'Terminée' },
};

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
  });
}

function formatEur(cents: number): string {
  return `${(cents / 100).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`;
}

export default function AdvertiserCampaignsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [campaigns, setCampaigns] = useState<AdvertiserCampaignDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<AdvertiserCampaignDTO | null>(null);
  const [selectedDrivers, setSelectedDrivers] = useState<
    AdvertiserAssignedDriver[]
  >([]);
  const [driversLoading, setDriversLoading] = useState(false);

  const reload = useCallback(async (silent = false) => {
    if (!silent) setError(null);
    try {
      const list = await fetchAdvertiserCampaigns();
      setCampaigns(list);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  useFocusEffect(
    useCallback(() => {
      void reload(true);
    }, [reload]),
  );

  const filtered = useMemo(() => {
    if (filter === 'all') return campaigns;
    return campaigns.filter((c) => c.status === filter);
  }, [campaigns, filter]);

  async function openDetail(c: AdvertiserCampaignDTO) {
    setSelected(c);
    setSelectedDrivers([]);
    if (c.campaignType === 'flocage' && c.assignedDriverIds.length > 0) {
      setDriversLoading(true);
      try {
        const list = await fetchAdvertiserCampaignDrivers(c.id);
        setSelectedDrivers(list);
      } catch {
        /* ignore — modal still works */
      } finally {
        setDriversLoading(false);
      }
    }
  }

  function closeDetail() {
    setSelected(null);
    setSelectedDrivers([]);
  }

  if (loading) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.navy} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mes campagnes</Text>
          <Text style={styles.headerSubtitle}>
            {filtered.length} campagne{filtered.length > 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

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
              <Text
                style={[styles.filterText, active && styles.filterTextActive]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              void reload(true);
            }}
            tintColor={Colors.navy}
          />
        }
        renderItem={({ item }) => {
          const badge = STATUS_BADGE[item.status];
          const isFlocage = item.campaignType === 'flocage';
          const capacity = isFlocage
            ? `${item.driversAssigned}/${item.driversNeeded} chauffeurs`
            : `${item.borne?.terminalIds?.length ?? 0}/${item.borne?.count ?? 0} bornes`;
          return (
            <TouchableOpacity
              style={styles.campaignCard}
              onPress={() => openDetail(item)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <BrandLogo
                  domain={item.domain}
                  name={item.brand}
                  size={36}
                  brandColor={item.brandColor}
                  logoUrl={item.brandLogoUrl}
                />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title || item.brand}
                  </Text>
                  <Text style={styles.cardMeta}>
                    {item.city} · {formatDateShort(item.startDate)} →{' '}
                    {formatDateShort(item.endDate)}
                  </Text>
                </View>
                <Badge variant={badge.variant} label={badge.label} />
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.cardStat}>{capacity}</Text>
                <Text style={styles.cardReward}>{formatEur(item.budgetCents)}</Text>
              </View>
              {item.status === 'active' && (
                <View style={styles.progressRow}>
                  <View style={styles.progressTrack}>
                    <LinearGradient
                      colors={[Colors.navy, Colors.navyLight]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[
                        styles.progressFill,
                        { width: `${Math.round(item.progress * 100)}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressLabel}>
                    {Math.round(item.progress * 100)}%
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Feather name="folder" size={32} color={Colors.gray300} />
            </View>
            <Text style={styles.emptyTitle}>Aucune campagne</Text>
            <Text style={styles.emptyText}>
              Créez votre première campagne depuis le web.
            </Text>
          </View>
        }
      />

      <Modal
        visible={selected !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeDetail}
      >
        {selected && (
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalContent}
            >
              <View style={styles.modalHeader}>
                <BrandLogo
                  domain={selected.domain}
                  name={selected.brand}
                  size={48}
                  brandColor={selected.brandColor}
                  logoUrl={selected.brandLogoUrl}
                />
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalTitle}>
                    {selected.title || selected.brand}
                  </Text>
                  <Badge
                    variant={STATUS_BADGE[selected.status].variant}
                    label={STATUS_BADGE[selected.status].label}
                  />
                </View>
              </View>

              <View style={styles.modalInfoCard}>
                <Text style={styles.modalDescription}>
                  {selected.description || '—'}
                </Text>
                <View style={styles.modalDetailRow}>
                  <Feather name="map-pin" size={16} color={Colors.gray500} />
                  <Text style={styles.modalDetail}>
                    {selected.city}
                    {selected.zones.length > 0
                      ? ` · ${selected.zones.join(', ')}`
                      : ''}
                  </Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Feather name="calendar" size={16} color={Colors.gray500} />
                  <Text style={styles.modalDetail}>
                    {formatDateShort(selected.startDate)} →{' '}
                    {formatDateShort(selected.endDate)} ({selected.durationDays}{' '}
                    jours)
                  </Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Feather name="dollar-sign" size={16} color={Colors.gray500} />
                  <Text style={styles.modalDetail}>
                    Budget {formatEur(selected.budgetCents)} ·{' '}
                    {selected.budgetTier.toUpperCase()}
                  </Text>
                </View>
                {selected.campaignType === 'flocage' ? (
                  <View style={styles.modalDetailRow}>
                    <Feather name="users" size={16} color={Colors.gray500} />
                    <Text style={styles.modalDetail}>
                      {selected.driversAssigned}/{selected.driversNeeded}{' '}
                      chauffeurs · {formatEur(selected.rewardCents)} / chauffeur
                    </Text>
                  </View>
                ) : (
                  <View style={styles.modalDetailRow}>
                    <Feather name="tv" size={16} color={Colors.gray500} />
                    <Text style={styles.modalDetail}>
                      {selected.borne?.terminalIds?.length ?? 0}/
                      {selected.borne?.count ?? 0} bornes ·{' '}
                      {(selected.borne?.targetImpressions ?? 0).toLocaleString(
                        'fr-FR',
                      )}{' '}
                      impressions visées
                    </Text>
                  </View>
                )}
              </View>

              {selected.status === 'active' &&
                selected.campaignType === 'flocage' && (
                  <View style={styles.modalProgressCard}>
                    <Text style={styles.modalSectionTitle}>Progression</Text>
                    <View style={styles.progressRow}>
                      <View style={styles.progressTrackLarge}>
                        <LinearGradient
                          colors={[Colors.navy, Colors.navyLight]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[
                            styles.progressFillLarge,
                            {
                              width: `${Math.round(selected.progress * 100)}%`,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressLabelLarge}>
                        {Math.round(selected.progress * 100)}%
                      </Text>
                    </View>
                    <Text style={styles.modalKm}>
                      {selected.kmDone.toLocaleString('fr-FR')} /{' '}
                      {selected.kmTotal.toLocaleString('fr-FR')} km
                    </Text>
                  </View>
                )}

              {selected.campaignType === 'flocage' && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>
                    Chauffeurs assignés ({selected.driversAssigned})
                  </Text>
                  {driversLoading ? (
                    <ActivityIndicator color={Colors.navy} />
                  ) : selectedDrivers.length === 0 ? (
                    <Text style={styles.emptyDrivers}>
                      Aucun chauffeur assigné.
                    </Text>
                  ) : (
                    selectedDrivers.map((d) => (
                      <View key={d.id} style={styles.driverRow}>
                        <View style={styles.driverAvatar}>
                          <Text style={styles.driverInitials}>
                            {d.firstName[0]}
                            {d.lastName[0]}
                          </Text>
                        </View>
                        <View style={styles.driverInfo}>
                          <Text style={styles.driverName}>
                            {d.firstName} {d.lastName}
                          </Text>
                          <Text style={styles.driverMeta}>
                            {d.city} · {d.rating.toFixed(1)} ★ ·{' '}
                            {d.totalKm.toLocaleString('fr-FR')} km
                          </Text>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              )}

              {selected.campaignType === 'borne' &&
                (selected.borne?.terminalIds?.length ?? 0) > 0 && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>
                      Terminaux assignés
                    </Text>
                    {(selected.borne?.terminalIds ?? []).map((tid) => (
                      <View key={tid} style={styles.terminalRow}>
                        <Feather name="tv" size={14} color={Colors.gray500} />
                        <Text style={styles.terminalText}>{tid}</Text>
                      </View>
                    ))}
                  </View>
                )}

              <TouchableOpacity style={styles.closeBtn} onPress={closeDetail}>
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
  screen: { flex: 1, backgroundColor: Colors.navyTint },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: { fontFamily: FontFamily.black, fontSize: 22, color: Colors.black },
  headerSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  errorBox: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: 12,
  },
  errorText: { color: '#b91c1c', fontSize: 13, fontFamily: FontFamily.medium },

  filterScroll: { flexGrow: 0 },
  filterRow: { paddingHorizontal: 20, paddingBottom: 14, gap: 8 },
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
  filterChipActive: { backgroundColor: Colors.navy, borderColor: Colors.navy },
  filterText: { fontFamily: FontFamily.medium, fontSize: 12, color: Colors.gray600 },
  filterTextActive: { color: Colors.white },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 16,
  },

  empty: { alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: { fontFamily: FontFamily.bold, fontSize: 15, color: Colors.gray700 },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray400,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

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
  cardInfo: { flex: 1, marginLeft: 10, marginRight: 8 },
  cardTitle: { fontFamily: FontFamily.bold, fontSize: 14, color: Colors.black },
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
  cardStat: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.gray600 },
  cardReward: { fontFamily: FontFamily.bold, fontSize: 15, color: Colors.navy },
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
  progressFill: { height: 7, borderRadius: 4 },
  progressLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: Colors.navy,
    minWidth: 34,
    textAlign: 'right',
  },

  modal: { flex: 1, backgroundColor: Colors.navyTint },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  modalContent: { paddingHorizontal: 20, paddingBottom: 40 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalHeaderText: { flex: 1, marginLeft: 12, gap: 6 },
  modalTitle: { fontFamily: FontFamily.bold, fontSize: 17, color: Colors.black },
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
  progressFillLarge: { height: 8, borderRadius: 4 },
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
  modalSection: { marginBottom: 12 },
  modalSectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.black,
    marginBottom: 12,
  },
  emptyDrivers: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray500,
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
  driverInfo: { flex: 1, marginLeft: 10 },
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
  terminalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  terminalText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.black,
  },
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
