import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { ValidationStatus, Company } from '../../constants/Types';
import { useData } from '../../context/DataContext';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ScreenHeader';
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

  return (
    <Screen>
      <ScreenHeader title="Inscriptions en attente" />

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
                {f.label} ({counts[f.key]})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* List */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'drivers' ? (
          filteredDrivers.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Aucune inscription en attente</Text>
            </View>
          ) : (
            filteredDrivers.map((driver) => (
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
            ))
          )
        ) : filteredCompanies.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune inscription en attente</Text>
          </View>
        ) : (
          filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onPress={() => setSelectedCompany(company)}
            />
          ))
        )}
      </ScrollView>

      <CompanyDetailModal
        visible={selectedCompany !== null}
        company={selectedCompany}
        campaigns={campaigns}
        onClose={() => setSelectedCompany(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  // Segment
  segmentRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.xl,
    backgroundColor: Colors.gray100,
    borderRadius: Radius.md,
    padding: 3,
    marginBottom: Spacing.md,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.sm,
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
    marginHorizontal: Spacing.xl,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 40,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
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
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
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
    paddingTop: 60,
    gap: Spacing.md,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.gray400,
  },
});
