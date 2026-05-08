import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import PartnerSignOutButton from '../../components/PartnerSignOutButton';
import { fetchMyTerminals, type Terminal } from '../../lib/terminals-api';
import {
  fetchTerminalStock,
  type Cartridge,
  type StockStatus,
} from '../../lib/stock-api';

type Filter = 'all' | 'alerts' | 'ok';

export default function PartnerStockScreen() {
  const insets = useSafeAreaInsets();
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [selectedTerminalId, setSelectedTerminalId] = useState<string | null>(
    null,
  );
  const [cartridges, setCartridges] = useState<Cartridge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');

  // Initial: load terminal list, pick first one
  useEffect(() => {
    let cancelled = false;
    fetchMyTerminals()
      .then((ts) => {
        if (cancelled) return;
        setTerminals(ts);
        if (ts.length) setSelectedTerminalId(ts[0].id);
        else setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // When terminal selection changes, fetch its stock
  useEffect(() => {
    if (!selectedTerminalId) return;
    setLoading(true);
    let cancelled = false;
    fetchTerminalStock(selectedTerminalId)
      .then((c) => {
        if (!cancelled) setCartridges(c);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedTerminalId]);

  const filtered = useMemo(() => {
    if (filter === 'alerts') return cartridges.filter((c) => c.status !== 'ok');
    if (filter === 'ok') return cartridges.filter((c) => c.status === 'ok');
    return cartridges;
  }, [cartridges, filter]);

  const alertCount = cartridges.filter((c) => c.status !== 'ok').length;
  const selectedTerminal = terminals.find((t) => t.id === selectedTerminalId);

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
            <Text style={styles.title}>Stock parfums</Text>
            <Text style={styles.subtitle}>
              {selectedTerminal
                ? `${selectedTerminal.name} · ${selectedTerminal.code}`
                : 'Aucune borne'}
            </Text>
          </View>
          <PartnerSignOutButton />
        </View>

        {terminals.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.terminalRow}
          >
            {terminals.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.terminalChip,
                  selectedTerminalId === t.id && styles.terminalChipActive,
                ]}
                onPress={() => setSelectedTerminalId(t.id)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.terminalChipText,
                    selectedTerminalId === t.id &&
                      styles.terminalChipTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {t.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.kpiRow}>
          <MiniKpi label="Cartouches" value={cartridges.length.toString()} />
          <MiniKpi
            label="Alertes"
            value={alertCount.toString()}
            tone={alertCount > 0 ? 'warning' : undefined}
          />
        </View>

        <View style={styles.filters}>
          <FilterButton
            label="Tous"
            active={filter === 'all'}
            onPress={() => setFilter('all')}
          />
          <FilterButton
            label="Alertes"
            active={filter === 'alerts'}
            onPress={() => setFilter('alerts')}
          />
          <FilterButton
            label="OK"
            active={filter === 'ok'}
            onPress={() => setFilter('ok')}
          />
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={Colors.navy} />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Feather name="droplet" size={28} color={Colors.gray400} />
            <Text style={styles.emptyText}>
              {cartridges.length === 0
                ? 'Aucune cartouche installée. Contactez un admin pour planifier un refill.'
                : 'Aucune cartouche ne correspond au filtre.'}
            </Text>
          </View>
        ) : (
          filtered.map((c) => <CartridgeCard key={c.slot} c={c} />)
        )}

        <View style={styles.infoCard}>
          <Feather name="info" size={16} color={Colors.navy} />
          <Text style={styles.infoText}>
            Les commandes de refill se passent depuis le tableau de bord web.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function CartridgeCard({ c }: { c: Cartridge }) {
  const tone = getTone(c.status);
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={[styles.icon, { backgroundColor: tone.soft }]}>
          <Feather name="droplet" size={16} color={tone.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {c.scentName ?? `Slot ${c.slot} (vide)`}
          </Text>
          <Text style={styles.meta}>
            Slot {c.slot} · {c.spraysSinceRefill} sprays · capacité{' '}
            {c.capacityMl}ml
          </Text>
        </View>
        <Text style={[styles.level, { color: tone.color }]}>
          {c.levelPercent}%
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${c.levelPercent}%`, backgroundColor: tone.color },
          ]}
        />
      </View>
      <View style={styles.infoGrid}>
        <InfoPill label="Statut" value={statusLabel(c.status)} />
        <InfoPill
          label="Dernier refill"
          value={
            c.lastRefillAt
              ? formatRelative(c.lastRefillAt)
              : '—'
          }
        />
      </View>
    </View>
  );
}

function statusLabel(s: StockStatus): string {
  if (s === 'ok') return 'OK';
  if (s === 'low') return 'Faible';
  return 'Rupture';
}

function getTone(s: StockStatus) {
  if (s === 'critical') return { color: Colors.danger, soft: Colors.dangerSoft };
  if (s === 'low') return { color: Colors.warning, soft: Colors.warningSoft };
  return { color: Colors.success, soft: Colors.successSoft };
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "à l'instant";
  if (diff < 3600_000) return `il y a ${Math.floor(diff / 60_000)} min`;
  if (diff < 86400_000) return `il y a ${Math.floor(diff / 3600_000)} h`;
  return `il y a ${Math.floor(diff / 86400_000)} j`;
}

function MiniKpi({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'warning';
}) {
  const color = tone === 'warning' ? Colors.warning : Colors.navy;
  return (
    <View style={styles.miniKpi}>
      <Text style={[styles.miniValue, { color }]}>{value}</Text>
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

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoPill}>
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
  terminalRow: { gap: 8, paddingVertical: 4, marginBottom: 12 },
  terminalChip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
  terminalChipActive: { backgroundColor: Colors.navy },
  terminalChipText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: Colors.navy,
    maxWidth: 200,
  },
  terminalChipTextActive: { color: Colors.white },
  kpiRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  miniKpi: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
  },
  miniValue: { fontFamily: FontFamily.black, fontSize: 20 },
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
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontFamily: FontFamily.bold, fontSize: 14, color: Colors.black },
  meta: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 2,
  },
  level: { fontFamily: FontFamily.bold, fontSize: 16 },
  track: {
    height: 9,
    borderRadius: 999,
    backgroundColor: Colors.gray100,
    overflow: 'hidden',
    marginTop: 14,
  },
  fill: { height: '100%', borderRadius: 999 },
  infoGrid: { flexDirection: 'row', gap: 8, marginTop: 12 },
  infoPill: {
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
});
