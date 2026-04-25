import { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import { partnerNotifications } from '../../mocks/partner';
import PartnerSignOutButton from '../../components/PartnerSignOutButton';

type Filter = 'all' | 'unread' | 'stock' | 'ops';

export default function PartnerNotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('all');
  const [readIds, setReadIds] = useState<string[]>([]);
  const [handledIds, setHandledIds] = useState<string[]>([]);

  const notifications = useMemo(() => {
    return partnerNotifications.filter((n) => {
      const unread = n.unread && !readIds.includes(n.id);
      if (filter === 'unread') return unread;
      if (filter === 'stock') return n.category === 'stock';
      if (filter === 'ops') return n.category === 'ops' || n.category === 'pub';
      return true;
    });
  }, [filter, readIds]);

  const unreadCount = partnerNotifications.filter((n) => n.unread && !readIds.includes(n.id)).length;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 24 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Alertes</Text>
            <Text style={styles.subtitle}>Stock, pubs, maintenance et livraisons</Text>
          </View>
          <PartnerSignOutButton />
        </View>

        <TouchableOpacity style={styles.markAll} onPress={() => setReadIds(partnerNotifications.map((n) => n.id))} activeOpacity={0.75}>
          <View>
            <Text style={styles.markTitle}>{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</Text>
            <Text style={styles.markMeta}>Marquer toutes les alertes comme lues</Text>
          </View>
          <Feather name="check-circle" size={22} color={Colors.navy} />
        </TouchableOpacity>

        <View style={styles.filters}>
          <FilterButton label="Toutes" active={filter === 'all'} onPress={() => setFilter('all')} />
          <FilterButton label="Non lues" active={filter === 'unread'} onPress={() => setFilter('unread')} />
          <FilterButton label="Stock" active={filter === 'stock'} onPress={() => setFilter('stock')} />
          <FilterButton label="Ops" active={filter === 'ops'} onPress={() => setFilter('ops')} />
        </View>

        {notifications.map((n) => {
          const unread = n.unread && !readIds.includes(n.id);
          const handled = handledIds.includes(n.id);
          return (
            <View key={n.id} style={[styles.card, unread && styles.cardUnread]}>
              <View style={styles.cardMain}>
                <View style={styles.icon}>
                  <Feather name={n.icon as keyof typeof Feather.glyphMap} size={17} color={Colors.navy} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.name}>{n.title}</Text>
                    {unread && <View style={styles.dot} />}
                  </View>
                  <Text style={styles.body}>{n.body}</Text>
                  <Text style={styles.time}>{n.time}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.secondaryAction}
                  onPress={() => setReadIds((prev) => prev.includes(n.id) ? prev : [...prev, n.id])}
                >
                  <Text style={styles.secondaryText}>Lu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryAction}
                  onPress={() => {
                    setReadIds((prev) => prev.includes(n.id) ? prev : [...prev, n.id]);
                    setHandledIds((prev) => prev.includes(n.id) ? prev : [...prev, n.id]);
                  }}
                >
                  <Feather name={handled ? 'check' : 'arrow-right'} size={14} color={Colors.white} />
                  <Text style={styles.primaryText}>{handled ? 'Traité' : n.action}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
        {notifications.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Aucune alerte</Text>
            <Text style={styles.emptyMeta}>Ce filtre ne contient rien pour le moment.</Text>
          </View>
        )}
      </ScrollView>
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

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.navyTint },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 18 },
  title: { fontFamily: FontFamily.black, fontSize: 24, color: Colors.black },
  subtitle: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.gray500, marginTop: 4 },
  markAll: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white, borderRadius: 18, padding: 16, marginBottom: 12 },
  markTitle: { fontFamily: FontFamily.bold, fontSize: 15, color: Colors.black },
  markMeta: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.gray500, marginTop: 2 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  filter: { height: 36, paddingHorizontal: 14, borderRadius: 999, backgroundColor: Colors.white, justifyContent: 'center' },
  filterActive: { backgroundColor: Colors.navy },
  filterText: { fontFamily: FontFamily.bold, fontSize: 12, color: Colors.navy },
  filterTextActive: { color: Colors.white },
  card: { backgroundColor: Colors.white, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.white },
  cardUnread: { borderColor: Colors.warning },
  cardMain: { flexDirection: 'row', gap: 12 },
  icon: { width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.navySoft, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { flex: 1, fontFamily: FontFamily.bold, fontSize: 14, color: Colors.black },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.warning },
  body: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.gray600, marginTop: 4, lineHeight: 17 },
  time: { fontFamily: FontFamily.medium, fontSize: 11, color: Colors.gray400, marginTop: 8 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 14 },
  secondaryAction: { height: 36, minWidth: 66, borderRadius: 999, backgroundColor: Colors.navySoft, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 },
  secondaryText: { fontFamily: FontFamily.bold, fontSize: 12, color: Colors.navy },
  primaryAction: { height: 36, minWidth: 112, borderRadius: 999, backgroundColor: Colors.navy, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingHorizontal: 14 },
  primaryText: { fontFamily: FontFamily.bold, fontSize: 12, color: Colors.white },
  empty: { backgroundColor: Colors.white, borderRadius: 18, padding: 22, alignItems: 'center' },
  emptyTitle: { fontFamily: FontFamily.bold, fontSize: 15, color: Colors.black },
  emptyMeta: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.gray500, marginTop: 4, textAlign: 'center' },
});
