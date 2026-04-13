import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import CampaignCard from '../../components/CampaignCard';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';

type FilterKey = 'all' | 'available' | 'active' | 'completed';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'available', label: 'Disponibles' },
  { key: 'active', label: 'En cours' },
  { key: 'completed', label: 'Terminées' },
];

export default function DriverCampaignsScreen() {
  const insets = useSafeAreaInsets();
  const { currentDriver } = useAuth();
  const { campaigns, acceptCampaign } = useData();
  const [filter, setFilter] = useState<FilterKey>('all');
  const driverId = currentDriver?.id ?? 'd1';

  const filtered = campaigns.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const isAccepted = (campaignId: string) =>
    campaigns.find((c) => c.id === campaignId)?.assignedDriverIds.includes(driverId) ?? false;

  const counts = {
    all: campaigns.length,
    available: campaigns.filter((c) => c.status === 'available').length,
    active: campaigns.filter((c) => c.status === 'active').length,
    completed: campaigns.filter((c) => c.status === 'completed').length,
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Campagnes</Text>
          <Text style={styles.headerSubtitle}>{filtered.length} campagne{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}</Text>
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
        renderItem={({ item: campaign }) => (
          <CampaignCard
            campaign={campaign}
            onPress={() => router.push(`/(driver)/campaign/${campaign.id}`)}
            showActions={campaign.status === 'available' && !isAccepted(campaign.id)}
            onAccept={() => acceptCampaign(campaign.id, driverId)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Feather name="search" size={32} color={Colors.gray300} />
            </View>
            <Text style={styles.emptyTitle}>Aucune campagne trouvée</Text>
            <Text style={styles.emptyText}>Essayez un autre filtre</Text>
          </View>
        }
      />
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
});
