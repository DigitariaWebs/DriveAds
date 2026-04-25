import { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import { partnerAds } from '../../mocks/partner';
import PartnerSignOutButton from '../../components/PartnerSignOutButton';

type Filter = 'all' | 'live' | 'scheduled';

export default function PartnerAdsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState(partnerAds[0]?.id ?? '');
  const [reported, setReported] = useState<string[]>([]);

  const ads = useMemo(() => {
    if (filter === 'live') return partnerAds.filter((ad) => ad.status === 'En ligne');
    if (filter === 'scheduled') return partnerAds.filter((ad) => ad.status === 'Planifiée');
    return partnerAds;
  }, [filter]);
  const selected = partnerAds.find((ad) => ad.id === selectedId) ?? partnerAds[0];
  const impressions = partnerAds.reduce((sum, ad) => sum + ad.impressionsToday, 0);
  const revenue = partnerAds.reduce((sum, ad) => sum + ad.shareRevenue, 0);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 24 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Publicités</Text>
            <Text style={styles.subtitle}>Diffusion écran, performance et signalement</Text>
          </View>
          <PartnerSignOutButton />
        </View>

        {selected && (
          <View style={styles.preview}>
            <View style={styles.previewArt}>
              <Feather name={selected.type === 'Vidéo' ? 'play' : 'image'} size={30} color={Colors.white} />
              <Text style={styles.previewBrand}>{selected.advertiser}</Text>
              <Text style={styles.previewCampaign}>{selected.campaignName}</Text>
            </View>
            <View style={styles.previewDetails}>
              <Detail label="Prochaine lecture" value={selected.nextPlayback} />
              <Detail label="Fenêtre" value={selected.timeWindow} />
              <Detail label="Fréquence" value={selected.frequency} />
            </View>
            <TouchableOpacity
              style={styles.reportButton}
              onPress={() => setReported((prev) => prev.includes(selected.id) ? prev : [...prev, selected.id])}
              activeOpacity={0.75}
            >
              <Feather name={reported.includes(selected.id) ? 'check' : 'alert-triangle'} size={15} color={Colors.navy} />
              <Text style={styles.reportText}>{reported.includes(selected.id) ? 'Signalement envoyé' : 'Signaler affichage'}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.kpiRow}>
          <MiniKpi label="Actives" value={partnerAds.filter((ad) => ad.status === 'En ligne').length.toString()} />
          <MiniKpi label="Vues jour" value={impressions.toLocaleString()} />
          <MiniKpi label="Revenus" value={`${revenue} €`} />
        </View>

        <View style={styles.filters}>
          <FilterButton label="Toutes" active={filter === 'all'} onPress={() => setFilter('all')} />
          <FilterButton label="En ligne" active={filter === 'live'} onPress={() => setFilter('live')} />
          <FilterButton label="Planifiées" active={filter === 'scheduled'} onPress={() => setFilter('scheduled')} />
        </View>

        {ads.map((ad) => (
          <TouchableOpacity key={ad.id} style={[styles.card, selectedId === ad.id && styles.cardActive]} onPress={() => setSelectedId(ad.id)} activeOpacity={0.75}>
            <View style={styles.cardTop}>
              <View style={styles.icon}>
                <Feather name={ad.type === 'Vidéo' ? 'play' : 'image'} size={18} color={Colors.navy} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{ad.campaignName}</Text>
                <Text style={styles.meta}>{ad.advertiser} · {ad.type} · {ad.duration}</Text>
              </View>
              <Text style={ad.status === 'En ligne' ? styles.activeChip : styles.pendingChip}>{ad.status}</Text>
            </View>
            <View style={styles.infoGrid}>
              <Info label="Diffusion" value={ad.frequency} />
              <Info label="Horaires" value={ad.timeWindow} />
              <Info label="Partage" value={`${ad.shareRevenue} €`} />
            </View>
            <Text style={styles.period}>{ad.period} · prochaine lecture {ad.nextPlayback}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
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
      <Text style={styles.miniValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text style={styles.miniLabel}>{label}</Text>
    </View>
  );
}

function FilterButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.filter, active && styles.filterActive]} onPress={onPress} activeOpacity={0.75}>
      <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.navyTint },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 18 },
  title: { fontFamily: FontFamily.black, fontSize: 24, color: Colors.black },
  subtitle: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.gray500, marginTop: 4 },
  preview: { backgroundColor: Colors.white, borderRadius: 22, padding: 14, marginBottom: 12 },
  previewArt: { height: 150, borderRadius: 18, backgroundColor: Colors.navy, alignItems: 'center', justifyContent: 'center', padding: 18 },
  previewBrand: { fontFamily: FontFamily.black, fontSize: 20, color: Colors.white, marginTop: 10 },
  previewCampaign: { fontFamily: FontFamily.regular, fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 3, textAlign: 'center' },
  previewDetails: { marginTop: 12 },
  detail: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  detailLabel: { fontFamily: FontFamily.medium, fontSize: 12, color: Colors.gray500 },
  detailValue: { fontFamily: FontFamily.bold, fontSize: 12, color: Colors.black, textAlign: 'right', flex: 1 },
  reportButton: { height: 40, borderRadius: 999, backgroundColor: Colors.navySoft, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12 },
  reportText: { fontFamily: FontFamily.bold, fontSize: 12, color: Colors.navy },
  kpiRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  miniKpi: { flex: 1, backgroundColor: Colors.white, borderRadius: 16, padding: 12 },
  miniValue: { fontFamily: FontFamily.black, fontSize: 18, color: Colors.navy },
  miniLabel: { fontFamily: FontFamily.medium, fontSize: 11, color: Colors.gray500, marginTop: 2 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filter: { height: 36, paddingHorizontal: 14, borderRadius: 999, backgroundColor: Colors.white, justifyContent: 'center' },
  filterActive: { backgroundColor: Colors.navy },
  filterText: { fontFamily: FontFamily.bold, fontSize: 12, color: Colors.navy },
  filterTextActive: { color: Colors.white },
  card: { backgroundColor: Colors.white, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.white },
  cardActive: { borderColor: Colors.navy },
  cardTop: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  icon: { width: 42, height: 42, borderRadius: 14, backgroundColor: Colors.navySoft, alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: FontFamily.bold, fontSize: 14, color: Colors.black },
  meta: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.gray500, marginTop: 3 },
  activeChip: { fontFamily: FontFamily.bold, fontSize: 10, color: Colors.success, backgroundColor: Colors.successSoft, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 999 },
  pendingChip: { fontFamily: FontFamily.bold, fontSize: 10, color: Colors.warning, backgroundColor: Colors.warningSoft, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 999 },
  infoGrid: { flexDirection: 'row', gap: 8, marginTop: 14 },
  info: { flex: 1, borderRadius: 13, padding: 9, backgroundColor: Colors.navyTint },
  infoLabel: { fontFamily: FontFamily.medium, fontSize: 9, color: Colors.gray500 },
  infoValue: { fontFamily: FontFamily.bold, fontSize: 11, color: Colors.black, marginTop: 2 },
  period: { fontFamily: FontFamily.medium, fontSize: 11, color: Colors.gray500, marginTop: 12 },
});
