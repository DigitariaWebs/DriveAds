import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import { ValidationStatus, Company } from '../../constants/Types';
import { useData } from '../../context/DataContext';
import DriverCard from '../../components/DriverCard';
import CompanyCard from '../../components/CompanyCard';
import CompanyDetailModal from '../../components/modals/CompanyDetailModal';

type Tab = 'drivers' | 'companies';
type FilterKey = 'pending' | 'validated' | 'rejected';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'pending', label: 'En attente' },
  { key: 'validated', label: 'Validés' },
  { key: 'rejected', label: 'Refusés' },
];

export default function AdminValidationsScreen() {
  const insets = useSafeAreaInsets();
  const {
    drivers,
    companies,
    campaigns,
    updateDriverStatus,
    updateCompanyStatus,
  } = useData();

  const [tab, setTab] = useState<Tab>('drivers');
  const [filter, setFilter] = useState<FilterKey>('pending');
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Filtered data
  const filteredDrivers = drivers
    .filter((d) => d.status === filter)
    .filter((d) =>
      search
        ? `${d.firstName} ${d.lastName}`.toLowerCase().includes(search.toLowerCase())
        : true,
    );

  const filteredCompanies = companies
    .filter((c) => c.status === filter)
    .filter((c) =>
      search
        ? c.companyName.toLowerCase().includes(search.toLowerCase())
        : true,
    );

  // Counts for filter chips
  const driverCounts: Record<FilterKey, number> = {
    pending: drivers.filter((d) => d.status === 'pending').length,
    validated: drivers.filter((d) => d.status === 'validated').length,
    rejected: drivers.filter((d) => d.status === 'rejected').length,
  };
  const companyCounts: Record<FilterKey, number> = {
    pending: companies.filter((c) => c.status === 'pending').length,
    validated: companies.filter((c) => c.status === 'validated').length,
    rejected: companies.filter((c) => c.status === 'rejected').length,
  };
  const counts = tab === 'drivers' ? driverCounts : companyCounts;
  const totalPending = driverCounts.pending + companyCounts.pending;

  const confirmAction = (name: string, action: 'valider' | 'refuser', onConfirm: () => void) => {
    Alert.alert(
      'Confirmation',
      `Voulez-vous ${action} ${name} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: action === 'valider' ? 'Valider' : 'Refuser', onPress: onConfirm },
      ],
    );
  };

  const renderDriverItem = useCallback(
    ({ item: driver }: { item: typeof drivers[0] }) => (
      <DriverCard
        key={driver.id}
        driver={driver}
        showActions={driver.status === 'pending'}
        onApprove={() =>
          confirmAction(
            `${driver.firstName} ${driver.lastName}`,
            'valider',
            () => updateDriverStatus(driver.id, 'validated'),
          )
        }
        onReject={() =>
          confirmAction(
            `${driver.firstName} ${driver.lastName}`,
            'refuser',
            () => updateDriverStatus(driver.id, 'rejected'),
          )
        }
      />
    ),
    [updateDriverStatus],
  );

  const renderCompanyItem = useCallback(
    ({ item: company }: { item: typeof companies[0] }) => (
      <CompanyCard
        key={company.id}
        company={company}
        onPress={() => setSelectedCompany(company)}
      />
    ),
    [],
  );

  const ListEmpty = () => (
    <View style={styles.empty}>
      <Feather name="inbox" size={48} color={Colors.gray300} />
      <Text style={styles.emptyText}>Aucune inscription trouvée</Text>
    </View>
  );

  const ListHeader = () => (
    <View>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Validations</Text>
        <Text style={styles.headerSubtitle}>{totalPending} en attente</Text>
      </View>

      {/* Segment control */}
      <View style={styles.segmentRow}>
        <TouchableOpacity
          style={[styles.segment, tab === 'drivers' && styles.segmentActive]}
          onPress={() => { setTab('drivers'); setFilter('pending'); }}
        >
          <Text style={[styles.segmentText, tab === 'drivers' && styles.segmentTextActive]}>
            Chauffeurs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segment, tab === 'companies' && styles.segmentActive]}
          onPress={() => { setTab('companies'); setFilter('pending'); }}
        >
          <Text style={[styles.segmentText, tab === 'companies' && styles.segmentTextActive]}>
            Entreprises
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color={Colors.gray400} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par nom..."
          placeholderTextColor={Colors.gray400}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Feather name="x" size={18} color={Colors.gray400} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
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
                {f.label} ({counts[f.key]})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      {tab === 'drivers' ? (
        <FlatList
          data={filteredDrivers}
          keyExtractor={(item) => item.id}
          renderItem={renderDriverItem}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={filteredCompanies}
          keyExtractor={(item) => item.id}
          renderItem={renderCompanyItem}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <CompanyDetailModal
        visible={selectedCompany !== null}
        company={selectedCompany}
        campaigns={campaigns}
        onClose={() => setSelectedCompany(null)}
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
    paddingHorizontal: 20,
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    color: Colors.navy,
  },
  headerSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },

  // Segment
  segmentRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: Colors.gray100,
    borderRadius: Radius.md,
    padding: 3,
    marginBottom: Spacing.md,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  segmentActive: {
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  segmentText: {
    ...Typography.bodySmall,
    fontFamily: FontFamily.medium,
    color: Colors.gray500,
  },
  segmentTextActive: {
    color: Colors.navy,
    fontFamily: FontFamily.bold,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    height: 44,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.black,
  },

  // Filters
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs + 2,
    borderRadius: 100,
  },
  filterChipActive: {
    backgroundColor: Colors.navy,
  },
  filterText: {
    ...Typography.bodySmall,
    fontFamily: FontFamily.medium,
    color: Colors.gray500,
  },
  filterTextActive: {
    color: Colors.white,
  },

  // List
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: Spacing.md,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.gray400,
  },
});
