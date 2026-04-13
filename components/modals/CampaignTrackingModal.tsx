import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Campaign, TrackingEvent } from '../../constants/Types';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { useData } from '../../context/DataContext';
import BrandLogo from '../BrandLogo';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

type Props = {
  visible: boolean;
  campaign: Campaign | null;
  onClose: () => void;
};

const eventColors: Record<string, string> = {
  success: Colors.success,
  info: Colors.info,
  warning: Colors.warning,
  navy: Colors.navy,
};

export default function CampaignTrackingModal({ visible, campaign, onClose }: Props) {
  const { trackingEvents, drivers } = useData();

  if (!campaign) return null;

  const assignedDrivers = drivers.filter((d) => campaign.assignedDriverIds.includes(d.id));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modal}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Suivi de campagne</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color={Colors.gray500} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Campaign header */}
          <View style={styles.campaignHeader}>
            <BrandLogo domain={campaign.domain} name={campaign.brand} size={44} />
            <View style={styles.campaignInfo}>
              <Text style={styles.campaignTitle}>{campaign.title}</Text>
              <Text style={styles.campaignCity}>{campaign.city}</Text>
            </View>
            <Badge
              variant={campaign.trackingMode === 'gps' ? 'info' : 'warning'}
              label={campaign.trackingMode === 'gps' ? 'GPS' : 'Manuel'}
            />
          </View>

          {/* Overall progress */}
          <Card variant="surface" style={styles.progressCard}>
            <Text style={styles.sectionTitle}>Progression globale</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { width: `${Math.round(campaign.progress * 100)}%` }]}
                />
              </View>
              <Text style={styles.progressLabel}>{Math.round(campaign.progress * 100)}%</Text>
            </View>
            <Text style={styles.kmText}>
              {campaign.kmDone.toLocaleString()} / {campaign.kmTotal.toLocaleString()} km
            </Text>
            <Text style={styles.driverCount}>
              {campaign.driversAssigned}/{campaign.driversNeeded} chauffeurs assignés
            </Text>
          </Card>

          {/* Zone-by-zone progress */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progression par zone</Text>
            {campaign.zones.map((zone, i) => {
              const fakeProgress = Math.min(1, campaign.progress + (i * 0.1 - 0.15));
              const pct = Math.max(0, Math.round(fakeProgress * 100));
              return (
                <View key={zone} style={styles.zoneRow}>
                  <Text style={styles.zoneName}>{zone}</Text>
                  <View style={styles.zoneProgressTrack}>
                    <View style={[styles.zoneProgressFill, { width: `${pct}%` }]} />
                  </View>
                  <Text style={styles.zonePct}>{pct}%</Text>
                </View>
              );
            })}
          </View>

          {/* Assigned drivers */}
          {assignedDrivers.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Chauffeurs</Text>
              {assignedDrivers.map((d) => (
                <View key={d.id} style={styles.driverItem}>
                  <View style={styles.driverAvatar}>
                    <Text style={styles.driverInitials}>{d.firstName[0]}{d.lastName[0]}</Text>
                  </View>
                  <View style={styles.driverInfo}>
                    <Text style={styles.driverName}>{d.firstName} {d.lastName}</Text>
                    <Text style={styles.driverMeta}>{d.vehicleModel} · {d.city}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Tracking events timeline */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Événements récents</Text>
            {trackingEvents.map((event) => (
              <View key={event.id} style={styles.timelineRow}>
                <View style={styles.timelineTime}>
                  <Text style={styles.timeText}>{event.time}</Text>
                </View>
                <View
                  style={[
                    styles.timelineDot,
                    { backgroundColor: eventColors[event.color] || Colors.navy },
                  ]}
                />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineText}>{event.text}</Text>
                  {event.driver && (
                    <Text style={styles.timelineDriver}>{event.driver}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Fermer</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { flex: 1, backgroundColor: Colors.navyTint },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.gray300, alignSelf: 'center', marginTop: Spacing.md,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg,
  },
  headerTitle: { ...Typography.h2, color: Colors.black },
  content: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.huge },

  // Campaign header
  campaignHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xl },
  campaignInfo: { flex: 1, marginLeft: Spacing.md, marginRight: Spacing.sm },
  campaignTitle: { ...Typography.h3, color: Colors.black },
  campaignCity: { ...Typography.bodySmall, color: Colors.gray500 },

  // Progress
  progressCard: { marginBottom: Spacing.xl },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  progressTrack: { flex: 1, height: 8, backgroundColor: Colors.gray200, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: Colors.success, borderRadius: 4 },
  progressLabel: { ...Typography.bodyMedium, color: Colors.gray600, minWidth: 40, textAlign: 'right' },
  kmText: { ...Typography.bodySmall, color: Colors.gray500 },
  driverCount: { ...Typography.bodySmall, color: Colors.gray500, marginTop: 2 },

  // Zones
  section: { marginBottom: Spacing.xl },
  sectionTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.md },
  zoneRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  zoneName: { ...Typography.bodySmall, color: Colors.gray700, width: 100 },
  zoneProgressTrack: { flex: 1, height: 6, backgroundColor: Colors.gray200, borderRadius: 3, overflow: 'hidden' },
  zoneProgressFill: { height: 6, backgroundColor: Colors.info, borderRadius: 3 },
  zonePct: { ...Typography.caption, color: Colors.gray500, width: 36, textAlign: 'right' },

  // Drivers
  driverItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.gray100,
  },
  driverAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.navy, alignItems: 'center', justifyContent: 'center',
  },
  driverInitials: { fontFamily: FontFamily.bold, fontSize: 13, color: Colors.white },
  driverInfo: { flex: 1, marginLeft: Spacing.md },
  driverName: { ...Typography.bodyMedium, color: Colors.black },
  driverMeta: { ...Typography.caption, color: Colors.gray500 },

  // Timeline
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.lg },
  timelineTime: { width: 44 },
  timeText: { ...Typography.caption, color: Colors.gray500 },
  timelineDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4, marginHorizontal: Spacing.sm },
  timelineContent: { flex: 1 },
  timelineText: { ...Typography.bodySmall, color: Colors.gray700 },
  timelineDriver: { ...Typography.caption, color: Colors.gray400, marginTop: 2 },

  closeBtn: {
    alignItems: 'center', paddingVertical: Spacing.lg, marginTop: Spacing.lg,
    borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.navy,
  },
  closeBtnText: { ...Typography.button, color: Colors.navy },
});
