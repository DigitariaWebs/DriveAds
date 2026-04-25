import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import { useAuth } from '../../context/AuthContext';
import { partnerAds, partnerNotifications, partnerStock, partnerTerminal } from '../../mocks/partner';
import PartnerSignOutButton from '../../components/PartnerSignOutButton';

export default function PartnerHomeScreen() {
  const insets = useSafeAreaInsets();
  const { currentPartner } = useAuth();
  const lowStock = partnerStock.filter((p) => p.level < 50).length;
  const activeAds = partnerAds.filter((ad) => ad.status === 'En ligne');
  const totalRevenue = (currentPartner?.monthlySprayRevenue ?? 0) + (currentPartner?.monthlyAdsRevenue ?? 0);
  const target = Math.min(100, Math.round((totalRevenue / partnerTerminal.monthlyTarget) * 100));

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 24 }}
      >
        <LinearGradient
          colors={[Colors.navyDark, Colors.navy, Colors.navyLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>{currentPartner?.businessName ?? 'Partenaire'}</Text>
              <Text style={styles.heroSub}>Borne {partnerTerminal.id} · {currentPartner?.city ?? 'Paris'}</Text>
            </View>
            <View style={styles.heroActions}>
              <TouchableOpacity style={styles.bell} onPress={() => router.push('/(partner)/notifications')}>
                <Feather name="bell" size={20} color={Colors.white} />
              </TouchableOpacity>
              <PartnerSignOutButton tone="light" />
            </View>
          </View>

          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.statusLabel}>Statut borne</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>{partnerTerminal.status}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.heroButton} onPress={() => router.push('/(partner)/profile')}>
              <Feather name="tool" size={15} color={Colors.white} />
              <Text style={styles.heroButtonText}>Maintenance</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroStats}>
            <HeroStat label="Disponibilité" value={`${partnerTerminal.uptime}%`} />
            <HeroStat label="Sprays jour" value={partnerTerminal.spraysToday.toString()} />
            <HeroStat label="Sync" value={partnerTerminal.lastSync} />
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.grid}>
            <Kpi icon="droplet" label="Parfums faibles" value={lowStock.toString()} onPress={() => router.push('/(partner)/stock')} />
            <Kpi icon="monitor" label="Pubs actives" value={activeAds.length.toString()} onPress={() => router.push('/(partner)/ads')} />
            <Kpi icon="dollar-sign" label="Revenus mois" value={`${totalRevenue.toLocaleString()} €`} onPress={() => router.push('/(partner)/revenue')} />
            <Kpi icon="clock" label="Maintenance" value={partnerTerminal.nextMaintenance} onPress={() => router.push('/(partner)/profile')} />
          </View>

          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.cardTitle}>Actions prioritaires</Text>
              <Text style={styles.pill}>{target}% objectif</Text>
            </View>
            <ActionRow icon="package" title="Commander les parfums faibles" meta={`${lowStock} alertes stock`} onPress={() => router.push('/(partner)/stock')} />
            <ActionRow icon="monitor" title="Contrôler les pubs en diffusion" meta={`${activeAds.length} campagnes écran`} onPress={() => router.push('/(partner)/ads')} />
            <ActionRow icon="credit-card" title="Suivre le paiement mensuel" meta={`Prévu le ${partnerTerminal.nextPayout}`} onPress={() => router.push('/(partner)/revenue')} />
          </View>

          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.cardTitle}>Planning pubs</Text>
              <TouchableOpacity onPress={() => router.push('/(partner)/ads')}>
                <Text style={styles.link}>Tout voir</Text>
              </TouchableOpacity>
            </View>
            {partnerAds.slice(0, 2).map((ad) => (
              <View key={ad.id} style={styles.adRow}>
                <View style={styles.rowIcon}>
                  <Feather name={ad.type === 'Vidéo' ? 'play' : 'image'} size={15} color={Colors.navy} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{ad.campaignName}</Text>
                  <Text style={styles.rowMeta}>{ad.advertiser} · {ad.frequency}</Text>
                </View>
                <Text style={ad.status === 'En ligne' ? styles.activeChip : styles.pendingChip}>{ad.nextPlayback}</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.cardTitle}>Alertes récentes</Text>
              <TouchableOpacity onPress={() => router.push('/(partner)/notifications')}>
                <Text style={styles.link}>Ouvrir</Text>
              </TouchableOpacity>
            </View>
            {partnerNotifications.slice(0, 2).map((n) => (
              <ActionRow
                key={n.id}
                icon={n.icon as keyof typeof Feather.glyphMap}
                title={n.title}
                meta={`${n.body} · ${n.time}`}
                onPress={() => router.push('/(partner)/notifications')}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.heroStat}>
      <Text style={styles.heroStatLabel}>{label}</Text>
      <Text style={styles.heroStatValue}>{value}</Text>
    </View>
  );
}

function Kpi({ icon, label, value, onPress }: { icon: keyof typeof Feather.glyphMap; label: string; value: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.kpi} onPress={onPress} activeOpacity={0.75}>
      <Feather name={icon} size={17} color={Colors.navy} />
      <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function ActionRow({ icon, title, meta, onPress }: { icon: keyof typeof Feather.glyphMap; title: string; meta: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.actionRow} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.rowIcon}>
        <Feather name={icon} size={15} color={Colors.navy} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowMeta} numberOfLines={2}>{meta}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={Colors.gray400} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.navyTint },
  hero: { paddingHorizontal: 20, paddingBottom: 42 },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 12 },
  heroTitle: { fontFamily: FontFamily.black, fontSize: 22, color: Colors.white },
  heroSub: { fontFamily: FontFamily.regular, fontSize: 12, color: 'rgba(255,255,255,0.68)', marginTop: 4 },
  heroActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bell: { width: 42, height: 42, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  statusHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 },
  statusLabel: { fontFamily: FontFamily.medium, fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.success },
  statusText: { fontFamily: FontFamily.bold, fontSize: 28, color: Colors.white },
  heroButton: { flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 999, paddingHorizontal: 12, height: 36, backgroundColor: 'rgba(255,255,255,0.14)' },
  heroButtonText: { fontFamily: FontFamily.bold, fontSize: 12, color: Colors.white },
  heroStats: { flexDirection: 'row', gap: 10, marginTop: 22 },
  heroStat: { flex: 1, borderRadius: 15, padding: 10, backgroundColor: 'rgba(255,255,255,0.12)' },
  heroStatLabel: { fontFamily: FontFamily.medium, fontSize: 10, color: 'rgba(255,255,255,0.6)' },
  heroStatValue: { fontFamily: FontFamily.bold, fontSize: 12, color: Colors.white, marginTop: 5 },
  content: { marginTop: -22, paddingHorizontal: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  kpi: { width: '48%', minHeight: 104, backgroundColor: Colors.white, borderRadius: 18, padding: 14 },
  kpiValue: { fontFamily: FontFamily.bold, fontSize: 17, color: Colors.black, marginTop: 10 },
  kpiLabel: { fontFamily: FontFamily.medium, fontSize: 11, color: Colors.gray500, marginTop: 2 },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginTop: 14 },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 },
  cardTitle: { fontFamily: FontFamily.bold, fontSize: 15, color: Colors.black },
  link: { fontFamily: FontFamily.bold, fontSize: 12, color: Colors.navy },
  pill: { fontFamily: FontFamily.bold, fontSize: 11, color: Colors.success, backgroundColor: Colors.successSoft, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11 },
  adRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  rowIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: Colors.navySoft, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontFamily: FontFamily.bold, fontSize: 13, color: Colors.black },
  rowMeta: { fontFamily: FontFamily.regular, fontSize: 11, color: Colors.gray500, marginTop: 2, lineHeight: 16 },
  activeChip: { fontFamily: FontFamily.bold, fontSize: 10, color: Colors.success, backgroundColor: Colors.successSoft, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 999 },
  pendingChip: { fontFamily: FontFamily.bold, fontSize: 10, color: Colors.warning, backgroundColor: Colors.warningSoft, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 999 },
});
