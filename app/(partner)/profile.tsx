import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import { useAuth } from '../../context/AuthContext';
import PartnerSignOutButton from '../../components/PartnerSignOutButton';
import { fetchMyPartner, type PartnerProfile } from '../../lib/profile-api';

export default function PartnerProfileScreen() {
  const insets = useSafeAreaInsets();
  const { currentPartner, logout } = useAuth();
  const [livePartner, setLivePartner] = useState<PartnerProfile | null>(null);
  const [liveEmail, setLiveEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMyPartner();
      setLivePartner(res.partner);
      setLiveEmail(res.email);
    } catch (e) {
      setError((e as Error).message);
      setLivePartner(null);
      setLiveEmail(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const partner: PartnerProfile | null =
    livePartner ??
    (currentPartner
      ? {
          id: currentPartner.id,
          businessName: currentPartner.businessName,
          managerName: currentPartner.managerName,
          phone: currentPartner.phone,
          address: currentPartner.address,
          city: currentPartner.city,
          openingHours: currentPartner.openingHours,
          monthlySprayRevenue: currentPartner.monthlySprayRevenue,
          monthlyAdsRevenue: currentPartner.monthlyAdsRevenue,
          status: 'pending',
          createdAt: '',
        }
      : null);
  const email = liveEmail ?? currentPartner?.email ?? '—';

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 24 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} tintColor={Colors.navy} />
        }
      >
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{partner?.businessName ?? 'Partenaire'}</Text>
            <Text style={styles.subtitle}>Profil commerce (lecture seule)</Text>
          </View>
          <PartnerSignOutButton />
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Feather name="alert-triangle" size={14} color={Colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Commerce</Text>
          <Info icon="briefcase" label="Nom" value={partner?.businessName ?? '—'} />
          <Info icon="user" label="Responsable" value={partner?.managerName ?? '—'} />
          <Info icon="map-pin" label="Adresse" value={partner ? `${partner.address}, ${partner.city}` : '—'} />
          <Info icon="clock" label="Horaires" value={partner?.openingHours || '—'} />
          <Info icon="phone" label="Téléphone" value={partner?.phone ?? '—'} />
          <Info icon="mail" label="Email" value={email} />
        </View>

        <View style={styles.editHint}>
          <Feather name="info" size={12} color={Colors.gray500} />
          <Text style={styles.editHintText}>
            Pour modifier votre profil, utilisez le tableau de bord web.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.logout}
          onPress={() => logout().then(() => router.replace('/(auth)/welcome'))}
          activeOpacity={0.75}
        >
          <Feather name="log-out" size={18} color={Colors.danger} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Info({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.info}>
      <View style={styles.icon}>
        <Feather name={icon} size={16} color={Colors.navy} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.navyTint },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 18 },
  title: { fontFamily: FontFamily.black, fontSize: 24, color: Colors.black },
  subtitle: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.gray500, marginTop: 4 },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.dangerSoft,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  errorText: { fontFamily: FontFamily.medium, fontSize: 12, color: Colors.danger, flex: 1 },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginBottom: 12 },
  sectionTitle: { fontFamily: FontFamily.bold, fontSize: 15, color: Colors.black, marginBottom: 8 },
  info: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  icon: { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.navySoft, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: FontFamily.medium, fontSize: 11, color: Colors.gray500 },
  value: { fontFamily: FontFamily.bold, fontSize: 13, color: Colors.black, marginTop: 2 },
  editHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  editHintText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.gray500,
    textAlign: 'center',
  },
  logout: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.white, borderRadius: 18, padding: 16, marginTop: 2 },
  logoutText: { fontFamily: FontFamily.bold, fontSize: 14, color: Colors.danger },
});
