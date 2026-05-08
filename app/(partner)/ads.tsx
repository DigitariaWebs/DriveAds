import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import PartnerSignOutButton from '../../components/PartnerSignOutButton';
import {
  fetchMyAdSchedules,
  fetchMyAdImpressions,
  reportAdIssue,
  type AdSchedule,
  type AdScheduleStatus,
  type AdIssueKind,
  type AdImpressionDaily,
} from '../../lib/ads-api';

type Filter = 'all' | 'live' | 'scheduled';

const ISSUE_KINDS: { value: AdIssueKind; label: string }[] = [
  { value: 'not_playing', label: 'Ne diffuse pas' },
  { value: 'wrong_content', label: 'Mauvais contenu' },
  { value: 'audio_issue', label: 'Son défectueux' },
  { value: 'screen_issue', label: 'Écran défectueux' },
  { value: 'other', label: 'Autre' },
];

export default function PartnerAdsScreen() {
  const insets = useSafeAreaInsets();
  const [schedules, setSchedules] = useState<AdSchedule[]>([]);
  const [impressions, setImpressions] = useState<AdImpressionDaily[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportingSchedule, setReportingSchedule] =
    useState<AdSchedule | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchMyAdSchedules(), fetchMyAdImpressions({ days: 1 })])
      .then(([s, i]) => {
        if (cancelled) return;
        setSchedules(s);
        setImpressions(i);
        if (s.length) setSelectedId(s[0].id);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'live')
      return schedules.filter((s) => s.liveStatus === 'live');
    if (filter === 'scheduled')
      return schedules.filter((s) => s.liveStatus === 'scheduled');
    return schedules;
  }, [schedules, filter]);

  const selected = schedules.find((s) => s.id === selectedId) ?? schedules[0];

  // Today total impressions across all schedules.
  const todayImpressions = impressions.reduce(
    (sum, r) => sum + r.impressions,
    0,
  );
  const liveCount = schedules.filter((s) => s.liveStatus === 'live').length;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Publicités</Text>
            <Text style={styles.subtitle}>
              Diffusion écran sur vos bornes
            </Text>
          </View>
          <PartnerSignOutButton />
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={Colors.navy} />
          </View>
        ) : schedules.length === 0 ? (
          <View style={styles.emptyBox}>
            <Feather name="monitor" size={28} color={Colors.gray400} />
            <Text style={styles.emptyText}>
              Aucune publicité programmée sur vos bornes pour le moment.
            </Text>
          </View>
        ) : (
          <>
            {selected && <PreviewCard schedule={selected} />}

            <View style={styles.kpiRow}>
              <MiniKpi label="Actives" value={liveCount.toString()} />
              <MiniKpi
                label="Vues jour"
                value={todayImpressions.toLocaleString()}
              />
              <MiniKpi label="Total" value={schedules.length.toString()} />
            </View>

            <View style={styles.filters}>
              <FilterButton
                label="Toutes"
                active={filter === 'all'}
                onPress={() => setFilter('all')}
              />
              <FilterButton
                label="En ligne"
                active={filter === 'live'}
                onPress={() => setFilter('live')}
              />
              <FilterButton
                label="Planifiées"
                active={filter === 'scheduled'}
                onPress={() => setFilter('scheduled')}
              />
            </View>

            {filtered.map((s) => (
              <ScheduleCard
                key={s.id}
                schedule={s}
                impressions={impressionsForSchedule(s, impressions)}
                active={selectedId === s.id}
                onPress={() => setSelectedId(s.id)}
                onReport={() => setReportingSchedule(s)}
              />
            ))}

            <View style={styles.infoCard}>
              <Feather name="info" size={16} color={Colors.navy} />
              <Text style={styles.infoText}>
                La gestion (pause, planification) est faite par l'admin Publeader
                depuis le tableau de bord web.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <ReportModal
        schedule={reportingSchedule}
        onClose={() => setReportingSchedule(null)}
        onSubmitted={() => {
          setReportingSchedule(null);
          Alert.alert('Signalement envoyé', 'L\'équipe a été notifiée.');
        }}
      />
    </View>
  );
}

function impressionsForSchedule(
  s: AdSchedule,
  rows: AdImpressionDaily[],
): number {
  return rows
    .filter((r) => r.terminalId === s.terminalId && r.campaignId === s.campaignId)
    .reduce((sum, r) => sum + r.impressions, 0);
}

function PreviewCard({ schedule }: { schedule: AdSchedule }) {
  return (
    <View style={styles.preview}>
      <View
        style={[
          styles.previewArt,
          schedule.campaignBrandColor
            ? { backgroundColor: schedule.campaignBrandColor }
            : undefined,
        ]}
      >
        <Feather name="monitor" size={30} color={Colors.white} />
        <Text style={styles.previewBrand}>
          {schedule.campaignBrand ?? '—'}
        </Text>
        <Text style={styles.previewCampaign}>
          {schedule.campaignTitle ?? schedule.campaignId}
        </Text>
      </View>
      <View style={styles.previewDetails}>
        <Detail label="Borne" value={schedule.terminalName ?? '—'} />
        <Detail
          label="Fenêtre"
          value={`${pad(schedule.startHour)}h - ${pad(schedule.endHour)}h`}
        />
        <Detail
          label="Fréquence"
          value={`Toutes les ${schedule.intervalSeconds}s`}
        />
        <Detail label="Statut" value={statusLabel(schedule.liveStatus)} />
      </View>
    </View>
  );
}

function ScheduleCard({
  schedule,
  impressions,
  active,
  onPress,
  onReport,
}: {
  schedule: AdSchedule;
  impressions: number;
  active: boolean;
  onPress: () => void;
  onReport: () => void;
}) {
  const tone = statusTone(schedule.liveStatus);
  return (
    <TouchableOpacity
      style={[styles.card, active && styles.cardActive]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.cardTop}>
        <View
          style={[
            styles.icon,
            schedule.campaignBrandColor
              ? { backgroundColor: schedule.campaignBrandColor + '22' }
              : undefined,
          ]}
        >
          <Feather name="monitor" size={18} color={Colors.navy} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {schedule.campaignTitle ?? schedule.campaignId}
          </Text>
          <Text style={styles.meta}>
            {schedule.campaignBrand ?? '—'} · {schedule.terminalName ?? '—'}
          </Text>
        </View>
        <Text style={[styles.statusChip, { color: tone.color, backgroundColor: tone.bg }]}>
          {statusLabel(schedule.liveStatus)}
        </Text>
      </View>
      <View style={styles.infoGrid}>
        <Info
          label="Diffusion"
          value={`Toutes les ${schedule.intervalSeconds}s`}
        />
        <Info
          label="Horaires"
          value={`${pad(schedule.startHour)}h - ${pad(schedule.endHour)}h`}
        />
        <Info label="Vues" value={impressions.toLocaleString()} />
      </View>
      <View style={styles.actionRow}>
        <Text style={styles.windowText}>
          {schedule.inWindowNow ? '🟢 Diffuse maintenant' : 'Hors fenêtre'}
        </Text>
        <TouchableOpacity
          style={styles.reportButton}
          onPress={onReport}
          activeOpacity={0.7}
        >
          <Feather name="alert-triangle" size={13} color={Colors.navy} />
          <Text style={styles.reportText}>Signaler</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function ReportModal({
  schedule,
  onClose,
  onSubmitted,
}: {
  schedule: AdSchedule | null;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [kind, setKind] = useState<AdIssueKind>('not_playing');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (schedule) {
      setKind('not_playing');
      setDescription('');
    }
  }, [schedule]);

  const submit = async () => {
    if (!schedule) return;
    if (!description.trim()) {
      Alert.alert('Description requise', 'Décrivez le problème.');
      return;
    }
    setSubmitting(true);
    try {
      await reportAdIssue({
        scheduleId: schedule.id,
        kind,
        description: description.trim(),
      });
      onSubmitted();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Échec';
      Alert.alert('Erreur', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={!!schedule}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHead}>
            <Text style={styles.modalTitle}>Signaler un problème</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={20} color={Colors.gray500} />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalSub}>
            {schedule?.campaignTitle} · {schedule?.terminalName}
          </Text>
          <View style={styles.kindList}>
            {ISSUE_KINDS.map((k) => (
              <TouchableOpacity
                key={k.value}
                style={[styles.kindRow, kind === k.value && styles.kindRowActive]}
                onPress={() => setKind(k.value)}
                activeOpacity={0.75}
              >
                <View
                  style={[styles.radio, kind === k.value && styles.radioActive]}
                />
                <Text style={styles.kindLabel}>{k.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.textArea}
            placeholder="Description du problème"
            placeholderTextColor={Colors.gray400}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={1000}
          />
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={onClose}
              activeOpacity={0.75}
            >
              <Text style={styles.modalCancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalSubmit, submitting && { opacity: 0.6 }]}
              onPress={submit}
              activeOpacity={0.75}
              disabled={submitting}
            >
              <Text style={styles.modalSubmitText}>
                {submitting ? 'Envoi…' : 'Envoyer'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function statusLabel(s: AdScheduleStatus): string {
  if (s === 'live') return 'En ligne';
  if (s === 'scheduled') return 'Planifiée';
  if (s === 'paused') return 'En pause';
  if (s === 'expired') return 'Terminée';
  return 'Annulée';
}

function statusTone(s: AdScheduleStatus): { color: string; bg: string } {
  if (s === 'live') return { color: Colors.success, bg: Colors.successSoft };
  if (s === 'scheduled')
    return { color: Colors.warning, bg: Colors.warningSoft };
  if (s === 'paused') return { color: Colors.warning, bg: Colors.warningSoft };
  return { color: Colors.gray500, bg: Colors.gray100 };
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function MiniKpi({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.miniKpi}>
      <Text style={styles.miniValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.miniLabel}>{label}</Text>
    </View>
  );
}

function FilterButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.filter, active && styles.filterActive]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.filterText, active && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.navyTint },
  content: { padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 18,
  },
  title: { fontFamily: FontFamily.black, fontSize: 24, color: Colors.black },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 4,
  },
  loadingBox: { padding: 32, alignItems: 'center' },
  emptyBox: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    gap: 10,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray500,
    textAlign: 'center',
  },
  preview: {
    backgroundColor: Colors.white,
    borderRadius: 22,
    padding: 14,
    marginBottom: 12,
  },
  previewArt: {
    height: 150,
    borderRadius: 18,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  previewBrand: {
    fontFamily: FontFamily.black,
    fontSize: 20,
    color: Colors.white,
    marginTop: 10,
  },
  previewCampaign: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 3,
    textAlign: 'center',
  },
  previewDetails: { marginTop: 12 },
  detail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  detailLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.gray500,
  },
  detailValue: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: Colors.black,
    textAlign: 'right',
    flex: 1,
  },
  kpiRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  miniKpi: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
  },
  miniValue: { fontFamily: FontFamily.black, fontSize: 18, color: Colors.navy },
  miniLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 2,
  },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filter: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
  filterActive: { backgroundColor: Colors.navy },
  filterText: { fontFamily: FontFamily.bold, fontSize: 12, color: Colors.navy },
  filterTextActive: { color: Colors.white },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  cardActive: { borderColor: Colors.navy },
  cardTop: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontFamily: FontFamily.bold, fontSize: 14, color: Colors.black },
  meta: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 3,
  },
  statusChip: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
  },
  infoGrid: { flexDirection: 'row', gap: 8, marginTop: 14 },
  info: {
    flex: 1,
    borderRadius: 13,
    padding: 9,
    backgroundColor: Colors.navyTint,
  },
  infoLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 9,
    color: Colors.gray500,
  },
  infoValue: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.black,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  windowText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.gray500,
  },
  reportButton: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: Colors.navySoft,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reportText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.navy,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.navySoft,
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.navy,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 12,
  },
  modalHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontFamily: FontFamily.black,
    fontSize: 18,
    color: Colors.black,
  },
  modalSub: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray500,
  },
  kindList: { gap: 6, marginTop: 6 },
  kindRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.navyTint,
  },
  kindRowActive: { backgroundColor: Colors.navySoft },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.gray300,
  },
  radioActive: {
    borderColor: Colors.navy,
    backgroundColor: Colors.navy,
  },
  kindLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.black,
  },
  textArea: {
    minHeight: 80,
    borderRadius: 12,
    backgroundColor: Colors.navyTint,
    padding: 12,
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.black,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  modalCancel: {
    flex: 1,
    height: 46,
    borderRadius: 999,
    backgroundColor: Colors.navyTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.navy,
  },
  modalSubmit: {
    flex: 1,
    height: 46,
    borderRadius: 999,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubmitText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.white,
  },
});
