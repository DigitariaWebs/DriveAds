import { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { FontFamily } from '../../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../../constants/TabBarStyle';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import Button from '../../../components/ui/Button';
import BrandLogo from '../../../components/BrandLogo';

const { width } = Dimensions.get('window');

// ─── Seeded background noise ───────────────────────────────
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

type NoiseDot = {
  key: number;
  top: number;
  left: number;
  size: number;
  opacity: number;
};

const generateNoise = (count: number, w: number, h: number): NoiseDot[] => {
  const dots: NoiseDot[] = [];
  for (let i = 0; i < count; i++) {
    const sizeRoll = seededRandom(i * 3.73);
    dots.push({
      key: i,
      top: seededRandom(i * 1.31) * h,
      left: seededRandom(i * 2.27) * w,
      size: sizeRoll > 0.9 ? 2 : 1,
      opacity: 0.02 + seededRandom(i * 4.13) * 0.06,
    });
  }
  return dots;
};

// ─── Status chip config ────────────────────────────────────
type StatusKey = 'available' | 'active' | 'completed' | 'upcoming';
const STATUS_META: Record<
  StatusKey,
  { label: string; fg: string; bg: string; dot: string }
> = {
  available: {
    label: 'Disponible',
    fg: '#059669',
    bg: 'rgba(16,185,129,0.18)',
    dot: '#10B981',
  },
  active: {
    label: 'En cours',
    fg: '#1E40AF',
    bg: 'rgba(59,130,246,0.22)',
    dot: '#60A5FA',
  },
  completed: {
    label: 'Terminée',
    fg: '#475569',
    bg: 'rgba(100,116,139,0.2)',
    dot: '#94A3B8',
  },
  upcoming: {
    label: 'À venir',
    fg: '#B45309',
    bg: 'rgba(245,158,11,0.2)',
    dot: '#F59E0B',
  },
};

// ─── French date formatter ─────────────────────────────────
const MONTHS_FR = [
  'jan.',
  'fév.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
};

// ─── Screen ────────────────────────────────────────────────
export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { currentDriver } = useAuth();
  const { campaigns, acceptCampaign } = useData();

  const campaign = campaigns.find((c) => c.id === id);
  const driverId = currentDriver?.id ?? 'd1';

  const heroNoise = useMemo(() => generateNoise(200, width, 440), []);

  if (!campaign) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.center}>
          <Text style={styles.emptyText}>Campagne introuvable</Text>
          <Button variant="outline" onPress={() => router.back()}>
            Retour
          </Button>
        </View>
      </View>
    );
  }

  const status = STATUS_META[campaign.status as StatusKey];
  const isAccepted = campaign.assignedDriverIds.includes(driverId);
  const canAccept = campaign.status === 'available' && !isAccepted;

  const handleAccept = () => {
    Alert.alert(
      'Confirmer',
      'Êtes-vous sûr de vouloir accepter cette campagne ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            acceptCampaign(campaign.id, driverId);
            Alert.alert('Succès', 'Mission acceptée avec succès !', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          },
        },
      ],
    );
  };

  const progressPct = Math.round(campaign.progress * 100);

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: canAccept ? 200 : 140 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Hero ───────────────────────────────────── */}
        <View style={[styles.hero, { paddingTop: insets.top + Spacing.md }]}>
          {/* Base gradient */}
          <LinearGradient
            colors={[Colors.navyDark, Colors.navy, Colors.navyLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Warm glow */}
          <View style={styles.glowWarmWrap} pointerEvents="none">
            <LinearGradient
              colors={['rgba(244,184,81,0.28)', 'rgba(244,184,81,0)']}
              style={styles.glowOrb}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </View>
          {/* Cool glow */}
          <View style={styles.glowCoolWrap} pointerEvents="none">
            <LinearGradient
              colors={['rgba(150,170,255,0.2)', 'rgba(150,170,255,0)']}
              style={styles.glowOrb}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </View>
          {/* Sheen */}
          <LinearGradient
            colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.5 }}
            pointerEvents="none"
          />
          {/* Noise */}
          <View style={styles.noiseLayer} pointerEvents="none">
            {heroNoise.map((d) => (
              <View
                key={d.key}
                style={{
                  position: 'absolute',
                  top: d.top,
                  left: d.left,
                  width: d.size,
                  height: d.size,
                  borderRadius: d.size / 2,
                  backgroundColor: '#FFFFFF',
                  opacity: d.opacity,
                }}
              />
            ))}
          </View>

          {/* Top bar */}
          <View style={styles.heroTopBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconBtn}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={18} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.heroHeaderTitle}>Détail campagne</Text>
            <View style={styles.iconBtn} />
          </View>

          {/* Brand logo */}
          <View style={styles.brandLogoWrap}>
            <View style={styles.brandLogoRing}>
              <BrandLogo
                domain={campaign.domain}
                name={campaign.brand}
                size={72}
              />
            </View>
          </View>

          {/* Brand + title */}
          <Text style={styles.heroEyebrow}>{campaign.brand.toUpperCase()}</Text>
          <Text style={styles.heroTitle}>{campaign.title}</Text>

          {/* Status chips */}
          <View style={styles.heroChipRow}>
            <View style={[styles.statusChip, { backgroundColor: status.bg }]}>
              <View style={[styles.statusDot, { backgroundColor: status.dot }]} />
              <Text style={[styles.statusChipText, { color: status.fg }]}>
                {status.label}
              </Text>
            </View>
            {isAccepted && campaign.status !== 'completed' && (
              <View
                style={[
                  styles.statusChip,
                  { backgroundColor: 'rgba(16,185,129,0.18)' },
                ]}
              >
                <Feather name="check" size={11} color="#10B981" />
                <Text style={[styles.statusChipText, { color: '#10B981' }]}>
                  Mission acceptée
                </Text>
              </View>
            )}
          </View>

          {/* KPI chip */}
          <View style={styles.kpiChip}>
            <View style={styles.kpiIconWrap}>
              <Feather name="dollar-sign" size={18} color="#1A2752" />
            </View>
            <View style={styles.kpiTextCol}>
              <Text style={styles.kpiLabel}>Rémunération</Text>
              <Text style={styles.kpiValue}>{campaign.reward} €</Text>
            </View>
            <View style={styles.kpiMetaCol}>
              <Text style={styles.kpiMetaLabel}>Suivi</Text>
              <Text style={styles.kpiMetaValue}>
                {campaign.trackingMode === 'gps' ? 'GPS temps réel' : 'Manuel'}
              </Text>
            </View>
          </View>
        </View>

        {/* ─── Content ─────────────────────────────────── */}
        <View style={styles.content}>
          {/* Description */}
          <SectionLabel>Description</SectionLabel>
          <View style={styles.card}>
            <Text style={styles.description}>{campaign.description}</Text>
          </View>

          {/* Details grid */}
          <SectionLabel>Détails</SectionLabel>
          <View style={styles.statGrid}>
            <StatTile icon="map-pin" label="Ville" value={campaign.city} />
            <StatTile
              icon="calendar"
              label="Durée"
              value={`${campaign.durationDays} jours`}
            />
            <StatTile
              icon="users"
              label="Équipe"
              value={`${campaign.driversAssigned} / ${campaign.driversNeeded}`}
            />
            <StatTile
              icon={campaign.trackingMode === 'gps' ? 'navigation' : 'edit-3'}
              label="Suivi"
              value={campaign.trackingMode === 'gps' ? 'GPS' : 'Manuel'}
            />
          </View>

          {/* Zones */}
          <SectionLabel>Zones couvertes</SectionLabel>
          <View style={[styles.card, { paddingVertical: 14 }]}>
            <View style={styles.zoneRow}>
              {campaign.zones.map((z) => (
                <View key={z} style={styles.zonePill}>
                  <Feather name="map-pin" size={10} color={Colors.navy} />
                  <Text style={styles.zonePillText}>{z}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Dates */}
          <SectionLabel>Période</SectionLabel>
          <View style={styles.card}>
            <View style={styles.dateRow}>
              <View style={styles.dateIcon}>
                <Feather name="play-circle" size={16} color={Colors.success} />
              </View>
              <Text style={styles.dateLabel}>Début</Text>
              <Text style={styles.dateValue}>
                {formatDate(campaign.startDate)}
              </Text>
            </View>
            <View style={styles.dateDivider} />
            <View style={styles.dateRow}>
              <View style={styles.dateIcon}>
                <Feather name="flag" size={16} color={Colors.danger} />
              </View>
              <Text style={styles.dateLabel}>Fin</Text>
              <Text style={styles.dateValue}>
                {formatDate(campaign.endDate)}
              </Text>
            </View>
          </View>

          {/* Progress (active) */}
          {campaign.status === 'active' && (
            <>
              <SectionLabel>Progression</SectionLabel>
              <View style={styles.card}>
                <View style={styles.progressTopRow}>
                  <Text style={styles.progressBigPct}>{progressPct}%</Text>
                  <Text style={styles.progressHint}>complétée</Text>
                </View>
                <View style={styles.progressTrack}>
                  <LinearGradient
                    colors={[Colors.success, '#34D399']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      styles.progressFill,
                      { width: `${progressPct}%` },
                    ]}
                  />
                </View>
                <View style={styles.progressMetaRow}>
                  <View style={styles.progressMeta}>
                    <Text style={styles.progressMetaValue}>
                      {campaign.kmDone.toLocaleString()}
                    </Text>
                    <Text style={styles.progressMetaLabel}>km parcourus</Text>
                  </View>
                  <View style={styles.progressMetaDivider} />
                  <View style={styles.progressMeta}>
                    <Text style={styles.progressMetaValue}>
                      {campaign.kmTotal.toLocaleString()}
                    </Text>
                    <Text style={styles.progressMetaLabel}>km cible</Text>
                  </View>
                  <View style={styles.progressMetaDivider} />
                  <View style={styles.progressMeta}>
                    <Text style={styles.progressMetaValue}>
                      {(campaign.kmTotal - campaign.kmDone).toLocaleString()}
                    </Text>
                    <Text style={styles.progressMetaLabel}>km restants</Text>
                  </View>
                </View>
              </View>
            </>
          )}

          {/* Completed */}
          {campaign.status === 'completed' && (
            <>
              <SectionLabel>Récapitulatif</SectionLabel>
              <View style={[styles.card, styles.completedCard]}>
                <View style={styles.completedIconWrap}>
                  <Feather name="award" size={28} color={Colors.success} />
                </View>
                <Text style={styles.completedTitle}>Campagne terminée</Text>
                <Text style={styles.completedStat}>
                  {campaign.kmTotal.toLocaleString()} km parcourus ·{' '}
                  {campaign.reward} € gagnés
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      {canAccept && (
        <View
          style={[
            styles.ctaDock,
            { bottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 8 },
          ]}
        >
          <TouchableOpacity
            style={styles.ctaSecondary}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.ctaSecondaryText}>Refuser</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ctaPrimary}
            onPress={handleAccept}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaPrimaryText}>Accepter la mission</Text>
            <Feather name="arrow-right" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ─── Small components ──────────────────────────────────────
function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children.toUpperCase()}</Text>;
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statTile}>
      <Feather
        name={icon}
        size={16}
        color={Colors.gray500}
        style={styles.statTileIcon}
      />
      <Text style={styles.statTileLabel}>{label}</Text>
      <Text style={styles.statTileValue}>{value}</Text>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F6F2',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.gray500,
  },

  // ─── Hero ────────────────────────────────────────────
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    overflow: 'hidden',
  },
  glowWarmWrap: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 280,
    height: 280,
  },
  glowCoolWrap: {
    position: 'absolute',
    bottom: -60,
    left: -40,
    width: 240,
    height: 240,
  },
  glowOrb: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  noiseLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },

  heroTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroHeaderTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.white,
    letterSpacing: 0.2,
  },

  brandLogoWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  brandLogoRing: {
    padding: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },

  heroEyebrow: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: 'rgba(255,255,255,0.66)',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 6,
  },
  heroTitle: {
    fontFamily: FontFamily.black,
    fontSize: 26,
    lineHeight: 32,
    color: Colors.white,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 16,
    paddingHorizontal: 8,
  },

  heroChipRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusChipText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    letterSpacing: 0.3,
  },

  // KPI chip
  kpiChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  kpiIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F4B851',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiTextCol: {
    flex: 1,
  },
  kpiLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 10.5,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  kpiValue: {
    fontFamily: FontFamily.black,
    fontSize: 20,
    color: Colors.white,
    letterSpacing: -0.3,
  },
  kpiMetaCol: {
    alignItems: 'flex-end',
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.12)',
  },
  kpiMetaLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 2,
  },
  kpiMetaValue: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: Colors.white,
  },

  // ─── Content ─────────────────────────────────────────
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10.5,
    letterSpacing: 1.2,
    color: Colors.navyLight,
    marginTop: Spacing.lg,
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray100,
    ...Shadows.sm,
  },
  description: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    lineHeight: 22,
    color: Colors.gray700,
  },

  // Stat grid
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statTile: {
    flexGrow: 1,
    flexBasis: '47%',
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray100,
    ...Shadows.sm,
  },
  statTileIcon: {
    marginBottom: 14,
  },
  statTileLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.gray500,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statTileValue: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.black,
    letterSpacing: -0.2,
  },

  // Zones
  zoneRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  zonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.navyTint,
    borderWidth: 1,
    borderColor: Colors.navySoft,
  },
  zonePillText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: Colors.navy,
  },

  // Dates
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dateIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dateLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.gray500,
    flex: 1,
  },
  dateValue: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.black,
  },
  dateDivider: {
    height: 1,
    backgroundColor: Colors.gray100,
  },

  // Progress
  progressTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
  },
  progressBigPct: {
    fontFamily: FontFamily.black,
    fontSize: 32,
    color: Colors.navy,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  progressHint: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.gray500,
    marginBottom: 6,
  },
  progressTrack: {
    height: 10,
    backgroundColor: Colors.gray100,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressFill: {
    height: 10,
    borderRadius: 5,
  },
  progressMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
  },
  progressMeta: {
    flex: 1,
    alignItems: 'center',
  },
  progressMetaDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.gray100,
  },
  progressMetaValue: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.navy,
  },
  progressMetaLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: Colors.gray500,
    marginTop: 2,
  },

  // Completed
  completedCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  completedIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  completedTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.success,
  },
  completedStat: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 4,
  },

  // CTA dock
  ctaDock: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.gray100,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
  },
  ctaSecondary: {
    paddingHorizontal: 18,
    height: 46,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaSecondaryText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.gray600,
  },
  ctaPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    borderRadius: 999,
    backgroundColor: Colors.navy,
  },
  ctaPrimaryText: {
    fontFamily: FontFamily.bold,
    fontSize: 13.5,
    color: Colors.white,
    letterSpacing: 0.2,
  },
});
