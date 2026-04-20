import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Linking,
  Alert,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import { Driver, Company, ValidationStatus } from '../../constants/Types';
import { useData } from '../../context/DataContext';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import DriverCard from '../../components/DriverCard';
import CompanyCard from '../../components/CompanyCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import CompanyDetailModal from '../../components/modals/CompanyDetailModal';

// ─── Types ──────────────────────────────────────────────────
type Tab = 'drivers' | 'companies';

type DriverFilter = 'all' | 'validated' | 'pending' | 'rejected';
const DRIVER_FILTERS: { key: DriverFilter; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'validated', label: 'Validés' },
  { key: 'pending', label: 'En attente' },
  { key: 'rejected', label: 'Refusés' },
];

type CompanyFilter = 'all' | 'validated' | 'pending';
const COMPANY_FILTERS: { key: CompanyFilter; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'validated', label: 'Validées' },
  { key: 'pending', label: 'En attente' },
];

const statusBadgeMap: Record<ValidationStatus, { variant: 'success' | 'warning' | 'danger'; label: string }> = {
  validated: { variant: 'success', label: 'Validé' },
  pending: { variant: 'warning', label: 'En attente' },
  rejected: { variant: 'danger', label: 'Refusé' },
};

// ─── Component ──────────────────────────────────────────────
export default function AdminDirectoryScreen() {
  const {
    drivers,
    companies,
    campaigns,
    updateDriverStatus,
    updateCompanyStatus,
  } = useData();

  const [tab, setTab] = useState<Tab>('drivers');
  const [search, setSearch] = useState('');
  const [driverFilter, setDriverFilter] = useState<DriverFilter>('all');
  const [companyFilter, setCompanyFilter] = useState<CompanyFilter>('all');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // ─── Filtered data ────────────────────────────────────────
  const filteredDrivers = drivers
    .filter((d) => (driverFilter === 'all' ? true : d.status === driverFilter))
    .filter((d) =>
      search
        ? `${d.firstName} ${d.lastName}`.toLowerCase().includes(search.toLowerCase())
        : true,
    );

  const filteredCompanies = companies
    .filter((c) => (companyFilter === 'all' ? true : c.status === companyFilter))
    .filter((c) =>
      search
        ? c.companyName.toLowerCase().includes(search.toLowerCase())
        : true,
    );

  // Counts
  const driverCounts: Record<DriverFilter, number> = {
    all: drivers.length,
    validated: drivers.filter((d) => d.status === 'validated').length,
    pending: drivers.filter((d) => d.status === 'pending').length,
    rejected: drivers.filter((d) => d.status === 'rejected').length,
  };
  const companyCounts: Record<CompanyFilter, number> = {
    all: companies.length,
    validated: companies.filter((c) => c.status === 'validated').length,
    pending: companies.filter((c) => c.status === 'pending').length,
  };

  // ─── Driver detail actions ────────────────────────────────
  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const confirmDriverAction = (driver: Driver, action: 'validated' | 'rejected') => {
    const verb = action === 'validated' ? 'valider' : 'refuser';
    Alert.alert(
      'Confirmation',
      `Voulez-vous ${verb} ${driver.firstName} ${driver.lastName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: action === 'validated' ? 'Valider' : 'Refuser',
          onPress: () => {
            updateDriverStatus(driver.id, action);
            setSelectedDriver(null);
          },
        },
      ],
    );
  };

  // ─── Render ───────────────────────────────────────────────
  return (
    <Screen>
      <ScreenHeader title="Annuaire" />

      {/* Segment control */}
      <View style={styles.segmentRow}>
        <TouchableOpacity
          style={[styles.segment, tab === 'drivers' && styles.segmentActive]}
          onPress={() => setTab('drivers')}
        >
          <Text style={[styles.segmentText, tab === 'drivers' && styles.segmentTextActive]}>
            Chauffeurs ({drivers.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segment, tab === 'companies' && styles.segmentActive]}
          onPress={() => setTab('companies')}
        >
          <Text style={[styles.segmentText, tab === 'companies' && styles.segmentTextActive]}>
            Entreprises ({companies.length})
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
        {tab === 'drivers'
          ? DRIVER_FILTERS.map((f) => {
              const active = driverFilter === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setDriverFilter(f.key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>
                    {f.label} ({driverCounts[f.key]})
                  </Text>
                </TouchableOpacity>
              );
            })
          : COMPANY_FILTERS.map((f) => {
              const active = companyFilter === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setCompanyFilter(f.key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>
                    {f.label} ({companyCounts[f.key]})
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
              <Feather name="users" size={48} color={Colors.gray300} />
              <Text style={styles.emptyText}>Aucun chauffeur trouvé</Text>
            </View>
          ) : (
            filteredDrivers.map((driver) => (
              <DriverCard
                key={driver.id}
                driver={driver}
                onPress={() => setSelectedDriver(driver)}
              />
            ))
          )
        ) : filteredCompanies.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="briefcase" size={48} color={Colors.gray300} />
            <Text style={styles.emptyText}>Aucune entreprise trouvée</Text>
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

      {/* ─── Driver Detail Modal ─────────────────────────── */}
      <Modal
        visible={selectedDriver !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedDriver(null)}
      >
        {selectedDriver && (
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <ScrollView
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Avatar + name + status */}
              <View style={styles.driverHeader}>
                <View style={styles.driverAvatar}>
                  <Text style={styles.driverAvatarText}>
                    {selectedDriver.firstName[0]}
                    {selectedDriver.lastName[0]}
                  </Text>
                </View>
                <Text style={styles.driverName}>
                  {selectedDriver.firstName} {selectedDriver.lastName}
                </Text>
                <Badge
                  variant={statusBadgeMap[selectedDriver.status].variant}
                  label={statusBadgeMap[selectedDriver.status].label}
                />
              </View>

              {/* Info section */}
              <Card variant="surface" style={styles.detailCard}>
                <Text style={styles.detailSectionTitle}>Informations</Text>
                <DetailRow icon="mail" label="Email" value={selectedDriver.email} />
                <DetailRow icon="phone" label="Téléphone" value={selectedDriver.phone} />
                <DetailRow icon="map-pin" label="Ville" value={selectedDriver.city} />
                <DetailRow icon="calendar" label="Inscrit le" value={selectedDriver.joinedAt} />
              </Card>

              {/* Vehicle section */}
              <Card variant="surface" style={styles.detailCard}>
                <Text style={styles.detailSectionTitle}>Véhicule</Text>
                <DetailRow icon="truck" label="Modèle" value={`${selectedDriver.vehicleModel} · ${selectedDriver.vehicleYear}`} />
                <DetailRow icon="credit-card" label="Plaque" value={selectedDriver.licensePlate} />
                <DetailRow icon="sliders" label="Type" value={selectedDriver.vehicleType} />
              </Card>

              {/* Stats */}
              <Card variant="surface" style={styles.detailCard}>
                <Text style={styles.detailSectionTitle}>Statistiques</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{selectedDriver.campaignsDone}</Text>
                    <Text style={styles.statLabel}>Campagnes</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{selectedDriver.totalKm.toLocaleString()}</Text>
                    <Text style={styles.statLabel}>Km parcourus</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{selectedDriver.totalEarnings.toLocaleString()} €</Text>
                    <Text style={styles.statLabel}>Revenus</Text>
                  </View>
                  <View style={styles.statItem}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                      <Feather name="star" size={14} color={Colors.warning} />
                      <Text style={styles.statValue}>
                        {selectedDriver.rating > 0 ? selectedDriver.rating.toFixed(1) : '—'}
                      </Text>
                    </View>
                    <Text style={styles.statLabel}>Note</Text>
                  </View>
                </View>
              </Card>

              {/* Contact actions */}
              <View style={styles.contactRow}>
                <View style={styles.contactBtn}>
                  <Button
                    variant="secondary"
                    size="md"
                    icon="phone"
                    onPress={() => handleCall(selectedDriver.phone)}
                  >
                    Appeler
                  </Button>
                </View>
                <View style={styles.contactBtn}>
                  <Button
                    variant="secondary"
                    size="md"
                    icon="mail"
                    onPress={() => handleEmail(selectedDriver.email)}
                  >
                    Email
                  </Button>
                </View>
              </View>

              {/* Approve/Reject if pending */}
              {selectedDriver.status === 'pending' && (
                <View style={styles.pendingActions}>
                  <View style={styles.contactBtn}>
                    <Button
                      variant="primary"
                      size="lg"
                      icon="check"
                      onPress={() => confirmDriverAction(selectedDriver, 'validated')}
                    >
                      Valider
                    </Button>
                  </View>
                  <View style={styles.contactBtn}>
                    <Button
                      variant="danger"
                      size="lg"
                      icon="x"
                      onPress={() => confirmDriverAction(selectedDriver, 'rejected')}
                    >
                      Refuser
                    </Button>
                  </View>
                </View>
              )}

              {/* Close */}
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedDriver(null)}
              >
                <Text style={styles.closeBtnText}>Fermer</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* Company Detail Modal (reused) */}
      <CompanyDetailModal
        visible={selectedCompany !== null}
        company={selectedCompany}
        campaigns={campaigns}
        onClose={() => setSelectedCompany(null)}
      />
    </Screen>
  );
}

// ─── Detail Row Helper ──────────────────────────────────────
function DetailRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={detailStyles.row}>
      <Feather name={icon} size={16} color={Colors.gray500} />
      <Text style={detailStyles.label}>{label}</Text>
      <Text style={detailStyles.value}>{value}</Text>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.bodySmall,
    fontFamily: FontFamily.medium,
    color: Colors.gray600,
    width: 80,
  },
  value: {
    ...Typography.bodySmall,
    color: Colors.gray800,
    flex: 1,
  },
});

// ─── Styles ─────────────────────────────────────────────────
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

  // ─── Driver Detail Modal ──────────────────────────────────
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

  // Driver header
  driverHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  driverAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  driverAvatarText: {
    fontFamily: FontFamily.bold,
    fontSize: 28,
    color: Colors.white,
  },
  driverName: {
    ...Typography.h2,
    color: Colors.black,
    marginBottom: Spacing.md,
  },

  // Detail cards
  detailCard: {
    marginBottom: Spacing.lg,
  },
  detailSectionTitle: {
    ...Typography.h3,
    color: Colors.black,
    marginBottom: Spacing.lg,
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  statValue: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.navy,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.gray500,
    marginTop: 2,
  },

  // Contact actions
  contactRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  contactBtn: {
    flex: 1,
  },

  // Pending actions
  pendingActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },

  // Close
  closeBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginTop: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.navy,
  },
  closeBtnText: {
    ...Typography.button,
    color: Colors.navy,
  },
});
