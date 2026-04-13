import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { Campaign } from '../../constants/Types';
import { useData } from '../../context/DataContext';
import Screen from '../../components/ui/Screen';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import BrandLogo from '../../components/BrandLogo';
import CreateCampaignModal from '../../components/modals/CreateCampaignModal';
import AssignDriversModal from '../../components/modals/AssignDriversModal';
import CampaignTrackingModal from '../../components/modals/CampaignTrackingModal';

type FilterKey = 'all' | 'available' | 'active' | 'completed';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'available', label: 'Disponibles' },
  { key: 'active', label: 'En cours' },
  { key: 'completed', label: 'Terminées' },
];

const statusBadge: Record<string, { variant: 'success' | 'info' | 'neutral' | 'warning'; label: string }> = {
  available: { variant: 'success', label: 'Disponible' },
  active: { variant: 'info', label: 'En cours' },
  completed: { variant: 'neutral', label: 'Terminée' },
  upcoming: { variant: 'warning', label: 'À venir' },
};

export default function AdminCampaignsScreen() {
  const { campaigns } = useData();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [assignCampaign, setAssignCampaign] = useState<Campaign | null>(null);
  const [trackCampaign, setTrackCampaign] = useState<Campaign | null>(null);

  const filtered = campaigns.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  return (
    <Screen>
      <ScreenHeader
        title="Campagnes"
        rightAction={
          <TouchableOpacity
            onPress={() => setShowCreate(true)}
            style={styles.addBtn}
          >
            <Feather name="plus-circle" size={28} color={Colors.navy} />
          </TouchableOpacity>
        }
      />

      {/* Filters */}
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
            <Feather name="volume-2" size={48} color={Colors.gray300} />
            <Text style={styles.emptyText}>Aucune campagne trouvée</Text>
          </View>
        ) : (
          filtered.map((campaign) => {
            const badge = statusBadge[campaign.status];
            const driverPct =
              campaign.driversNeeded > 0
                ? Math.round((campaign.driversAssigned / campaign.driversNeeded) * 100)
                : 0;

            return (
              <Card key={campaign.id} variant="surface" style={styles.card}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <BrandLogo domain={campaign.domain} name={campaign.brand} size={40} />
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardBrand}>{campaign.brand}</Text>
                    <Text style={styles.cardTitle} numberOfLines={1}>{campaign.title}</Text>
                  </View>
                  <Badge variant={badge.variant} label={badge.label} />
                </View>

                {/* Metrics */}
                <View style={styles.metricsRow}>
                  <View style={styles.metric}>
                    <Feather name="map-pin" size={14} color={Colors.gray500} />
                    <Text style={styles.metricText}>{campaign.city}</Text>
                  </View>
                  <View style={styles.metric}>
                    <Feather name="dollar-sign" size={14} color={Colors.gray500} />
                    <Text style={styles.metricText}>{campaign.reward} €</Text>
                  </View>
                  <View style={styles.metric}>
                    <Feather name="calendar" size={14} color={Colors.gray500} />
                    <Text style={styles.metricText}>{campaign.durationDays}j</Text>
                  </View>
                </View>

                {/* Driver count bar */}
                <View style={styles.driverBar}>
                  <Text style={styles.driverLabel}>
                    {campaign.driversAssigned}/{campaign.driversNeeded} chauffeurs
                  </Text>
                  <View style={styles.miniProgressTrack}>
                    <View style={[styles.miniProgressFill, { width: `${driverPct}%` }]} />
                  </View>
                </View>

                {/* Km progress for active */}
                {campaign.status === 'active' && (
                  <View style={styles.kmBar}>
                    <Text style={styles.driverLabel}>
                      {campaign.kmDone.toLocaleString()}/{campaign.kmTotal.toLocaleString()} km
                    </Text>
                    <View style={styles.miniProgressTrack}>
                      <View
                        style={[
                          styles.miniProgressFillGreen,
                          { width: `${Math.round(campaign.progress * 100)}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.pctLabel}>{Math.round(campaign.progress * 100)}%</Text>
                  </View>
                )}

                {/* Actions */}
                <View style={styles.actionsRow}>
                  {campaign.driversAssigned < campaign.driversNeeded && campaign.status !== 'completed' && (
                    <View style={styles.actionBtn}>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon="user-plus"
                        onPress={() => setAssignCampaign(campaign)}
                      >
                        Assigner
                      </Button>
                    </View>
                  )}
                  {campaign.status === 'active' && (
                    <View style={styles.actionBtn}>
                      <Button
                        variant="outline"
                        size="sm"
                        icon="bar-chart-2"
                        onPress={() => setTrackCampaign(campaign)}
                      >
                        Suivi
                      </Button>
                    </View>
                  )}
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>

      <CreateCampaignModal visible={showCreate} onClose={() => setShowCreate(false)} />
      <AssignDriversModal
        visible={assignCampaign !== null}
        campaign={assignCampaign}
        onClose={() => setAssignCampaign(null)}
      />
      <CampaignTrackingModal
        visible={trackCampaign !== null}
        campaign={trackCampaign}
        onClose={() => setTrackCampaign(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  addBtn: { padding: Spacing.xs },

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
  filterTextActive: { color: Colors.white },

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
  emptyText: { ...Typography.body, color: Colors.gray400 },

  // Card
  card: { marginBottom: Spacing.md },
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
  cardBrand: { ...Typography.captionUpper, color: Colors.gray500 },
  cardTitle: { ...Typography.h3, color: Colors.black, fontSize: 15 },

  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  metric: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metricText: { ...Typography.bodySmall, color: Colors.gray500 },

  // Driver bar
  driverBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  driverLabel: {
    ...Typography.caption,
    color: Colors.gray600,
    minWidth: 90,
  },
  miniProgressTrack: {
    flex: 1,
    height: 5,
    backgroundColor: Colors.gray200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: 5,
    backgroundColor: Colors.navy,
    borderRadius: 3,
  },

  // Km bar
  kmBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  miniProgressFillGreen: {
    height: 5,
    backgroundColor: Colors.success,
    borderRadius: 3,
  },
  pctLabel: {
    ...Typography.caption,
    color: Colors.gray500,
    minWidth: 32,
    textAlign: 'right',
  },

  // Actions
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionBtn: { flex: 1 },
});
