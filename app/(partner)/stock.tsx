import { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import { partnerStock } from '../../mocks/partner';
import PartnerSignOutButton from '../../components/PartnerSignOutButton';

type Filter = 'all' | 'alerts' | 'ok';

export default function PartnerStockScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('all');
  const [orders, setOrders] = useState<Record<string, number>>({});

  const filteredStock = useMemo(() => {
    if (filter === 'alerts') return partnerStock.filter((p) => p.status !== 'OK');
    if (filter === 'ok') return partnerStock.filter((p) => p.status === 'OK');
    return partnerStock;
  }, [filter]);

  const alertCount = partnerStock.filter((p) => p.status !== 'OK').length;
  const orderCount = Object.values(orders).reduce((sum, qty) => sum + qty, 0);

  const orderAlerts = () => {
    const next: Record<string, number> = {};
    partnerStock.filter((p) => p.status !== 'OK').forEach((p) => {
      next[p.id] = p.recommendedQty;
    });
    setOrders((prev) => ({ ...prev, ...next }));
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 24 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Stock parfums</Text>
            <Text style={styles.subtitle}>Commande refill et priorités de livraison</Text>
          </View>
          <PartnerSignOutButton />
        </View>

        <TouchableOpacity style={styles.primaryAction} onPress={orderAlerts} activeOpacity={0.75}>
          <View style={styles.primaryIcon}>
            <Feather name="package" size={18} color={Colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.primaryTitle}>Commander les alertes</Text>
            <Text style={styles.primaryMeta}>{alertCount} parfums faibles ou rupture</Text>
          </View>
          <Feather name="chevron-right" size={20} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.kpiRow}>
          <MiniKpi label="Références" value={partnerStock.length.toString()} />
          <MiniKpi label="Alertes" value={alertCount.toString()} tone="warning" />
          <MiniKpi label="Panier" value={orderCount.toString()} tone="success" />
        </View>

        <View style={styles.filters}>
          <FilterButton label="Tous" active={filter === 'all'} onPress={() => setFilter('all')} />
          <FilterButton label="Alertes" active={filter === 'alerts'} onPress={() => setFilter('alerts')} />
          <FilterButton label="OK" active={filter === 'ok'} onPress={() => setFilter('ok')} />
        </View>

        {filteredStock.map((item) => {
          const tone = getTone(item.level);
          const qty = orders[item.id] || 0;
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={[styles.icon, { backgroundColor: tone.soft }]}>
                  <Feather name="droplet" size={16} color={tone.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.meta}>{item.dailyUse} ml/j · refill {item.lastRefill}</Text>
                </View>
                <Text style={[styles.level, { color: tone.color }]}>{item.level}%</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${item.level}%`, backgroundColor: tone.color }]} />
              </View>
              <View style={styles.infoGrid}>
                <InfoPill label="Statut" value={item.status} />
                <InfoPill label="Livraison" value={item.eta} />
                <InfoPill label="Conseillé" value={`${item.recommendedQty}x`} />
              </View>
              <View style={styles.actions}>
                {[1, 2, 3].map((count) => (
                  <TouchableOpacity
                    key={count}
                    style={[styles.qtyButton, qty === count && styles.qtyButtonActive]}
                    onPress={() => setOrders((prev) => ({ ...prev, [item.id]: count }))}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.qtyText, qty === count && styles.qtyTextActive]}>{count}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.orderButton}
                  onPress={() => setOrders((prev) => ({ ...prev, [item.id]: item.recommendedQty }))}
                  activeOpacity={0.75}
                >
                  <Feather name={qty ? 'check' : 'package'} size={15} color={Colors.navy} />
                  <Text style={styles.orderText}>{qty ? 'Ajouté' : 'Commander'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Derniers mouvements</Text>
          <Movement title="Rose Musquée" meta="Alerte rupture · il y a 24 min" />
          <Movement title="Ambre Noir" meta="Livraison prévue demain" />
          <Movement title="Bois de Cèdre" meta="Recharge posée · 21 avr." />
        </View>
      </ScrollView>
    </View>
  );
}

function getTone(level: number) {
  if (level < 20) return { color: Colors.danger, soft: Colors.dangerSoft };
  if (level < 50) return { color: Colors.warning, soft: Colors.warningSoft };
  return { color: Colors.success, soft: Colors.successSoft };
}

function MiniKpi({ label, value, tone }: { label: string; value: string; tone?: 'warning' | 'success' }) {
  const color = tone === 'warning' ? Colors.warning : tone === 'success' ? Colors.success : Colors.navy;
  return (
    <View style={styles.miniKpi}>
      <Text style={[styles.miniValue, { color }]}>{value}</Text>
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

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoPill}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function Movement({ title, meta }: { title: string; meta: string }) {
  return (
    <View style={styles.movement}>
      <Text style={styles.movementTitle}>{title}</Text>
      <Text style={styles.movementMeta}>{meta}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.navyTint },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 18 },
  title: { fontFamily: FontFamily.black, fontSize: 24, color: Colors.black },
  subtitle: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.gray500, marginTop: 4 },
  primaryAction: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.navy, borderRadius: 22, padding: 16, marginBottom: 12 },
  primaryIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  primaryTitle: { fontFamily: FontFamily.bold, fontSize: 15, color: Colors.white },
  primaryMeta: { fontFamily: FontFamily.regular, fontSize: 12, color: 'rgba(255,255,255,0.68)', marginTop: 2 },
  kpiRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  miniKpi: { flex: 1, backgroundColor: Colors.white, borderRadius: 16, padding: 12 },
  miniValue: { fontFamily: FontFamily.black, fontSize: 20 },
  miniLabel: { fontFamily: FontFamily.medium, fontSize: 11, color: Colors.gray500, marginTop: 2 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filter: { height: 36, paddingHorizontal: 14, borderRadius: 999, backgroundColor: Colors.white, justifyContent: 'center' },
  filterActive: { backgroundColor: Colors.navy },
  filterText: { fontFamily: FontFamily.bold, fontSize: 12, color: Colors.navy },
  filterTextActive: { color: Colors.white },
  card: { backgroundColor: Colors.white, borderRadius: 18, padding: 16, marginBottom: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: FontFamily.bold, fontSize: 14, color: Colors.black },
  meta: { fontFamily: FontFamily.regular, fontSize: 11, color: Colors.gray500, marginTop: 2 },
  level: { fontFamily: FontFamily.bold, fontSize: 16 },
  track: { height: 9, borderRadius: 999, backgroundColor: Colors.gray100, overflow: 'hidden', marginTop: 14 },
  fill: { height: '100%', borderRadius: 999 },
  infoGrid: { flexDirection: 'row', gap: 8, marginTop: 12 },
  infoPill: { flex: 1, borderRadius: 13, padding: 9, backgroundColor: Colors.navyTint },
  infoLabel: { fontFamily: FontFamily.medium, fontSize: 9, color: Colors.gray500 },
  infoValue: { fontFamily: FontFamily.bold, fontSize: 11, color: Colors.black, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: 14 },
  qtyButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.navySoft, alignItems: 'center', justifyContent: 'center' },
  qtyButtonActive: { backgroundColor: Colors.navy },
  qtyText: { fontFamily: FontFamily.bold, fontSize: 13, color: Colors.navy },
  qtyTextActive: { color: Colors.white },
  orderButton: { minWidth: 126, height: 38, borderRadius: 999, backgroundColor: Colors.navySoft, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingHorizontal: 14 },
  orderText: { fontFamily: FontFamily.bold, fontSize: 12, color: Colors.navy },
  sectionTitle: { fontFamily: FontFamily.bold, fontSize: 15, color: Colors.black, marginBottom: 8 },
  movement: { paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.gray100 },
  movementTitle: { fontFamily: FontFamily.bold, fontSize: 13, color: Colors.black },
  movementMeta: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.gray500, marginTop: 2 },
});
