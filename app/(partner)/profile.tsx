import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import { useAuth } from '../../context/AuthContext';
import { partnerTerminal } from '../../mocks/partner';
import PartnerSignOutButton from '../../components/PartnerSignOutButton';

export default function PartnerProfileScreen() {
  const insets = useSafeAreaInsets();
  const { currentPartner, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [maintenanceAllowed, setMaintenanceAllowed] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 24 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{currentPartner?.businessName ?? 'Partenaire'}</Text>
            <Text style={styles.subtitle}>Infos commerce et préférences borne</Text>
          </View>
          <PartnerSignOutButton />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.75}>
          <Feather name={saved ? 'check' : 'settings'} size={17} color={Colors.white} />
          <Text style={styles.saveText}>{saved ? 'Préférences enregistrées' : 'Enregistrer les préférences'}</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Commerce</Text>
          <Info icon="map-pin" label="Adresse" value={`${currentPartner?.address ?? '—'}, ${currentPartner?.city ?? '—'}`} />
          <Info icon="clock" label="Horaires" value={currentPartner?.openingHours ?? '—'} />
          <Info icon="user" label="Contact" value={currentPartner?.managerName ?? '—'} />
          <Info icon="mail" label="Email" value={currentPartner?.email ?? '—'} />
          <Info icon="phone" label="Téléphone" value={currentPartner?.phone ?? '—'} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>État borne</Text>
          <Info icon="package" label="Borne" value={partnerTerminal.id} />
          <Info icon="monitor" label="Écran" value={partnerTerminal.screenStatus} />
          <Info icon="refresh-cw" label="Dernière synchro" value={partnerTerminal.lastSync} />
          <Info icon="tool" label="Maintenance" value={partnerTerminal.nextMaintenance} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Préférences</Text>
          <ToggleRow
            title="Notifications"
            meta="Stock, pubs, maintenance et livraisons"
            value={notifications}
            onChange={setNotifications}
          />
          <ToggleRow
            title="Intervention hors horaires"
            meta="Autoriser un passage avant ouverture"
            value={maintenanceAllowed}
            onChange={setMaintenanceAllowed}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Actions support</Text>
          <SupportAction icon="message-square" title="Contacter support" meta="Question sur la borne ou une campagne" />
          <SupportAction icon="download" title="Télécharger contrat" meta="Version partenaire en PDF" />
          <SupportAction icon="tool" title="Demander maintenance" meta="Créer une demande d'intervention" />
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

function ToggleRow({ title, meta, value, onChange }: { title: string; meta: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleMeta}>{meta}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: Colors.gray200, true: Colors.successSoft }}
        thumbColor={value ? Colors.success : Colors.gray400}
      />
    </View>
  );
}

function SupportAction({ icon, title, meta }: { icon: keyof typeof Feather.glyphMap; title: string; meta: string }) {
  return (
    <TouchableOpacity style={styles.supportAction} activeOpacity={0.75}>
      <View style={styles.icon}>
        <Feather name={icon} size={16} color={Colors.navy} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.supportTitle}>{title}</Text>
        <Text style={styles.supportMeta}>{meta}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={Colors.gray400} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.navyTint },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 18 },
  title: { fontFamily: FontFamily.black, fontSize: 24, color: Colors.black },
  subtitle: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.gray500, marginTop: 4 },
  saveButton: { height: 46, borderRadius: 999, backgroundColor: Colors.navy, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 },
  saveText: { fontFamily: FontFamily.bold, fontSize: 13, color: Colors.white },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginBottom: 12 },
  sectionTitle: { fontFamily: FontFamily.bold, fontSize: 15, color: Colors.black, marginBottom: 8 },
  info: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  icon: { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.navySoft, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: FontFamily.medium, fontSize: 11, color: Colors.gray500 },
  value: { fontFamily: FontFamily.bold, fontSize: 13, color: Colors.black, marginTop: 2 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderTopWidth: 1, borderTopColor: Colors.gray100 },
  toggleTitle: { fontFamily: FontFamily.bold, fontSize: 13, color: Colors.black },
  toggleMeta: { fontFamily: FontFamily.regular, fontSize: 11, color: Colors.gray500, marginTop: 2 },
  supportAction: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, borderTopWidth: 1, borderTopColor: Colors.gray100 },
  supportTitle: { fontFamily: FontFamily.bold, fontSize: 13, color: Colors.black },
  supportMeta: { fontFamily: FontFamily.regular, fontSize: 11, color: Colors.gray500, marginTop: 2 },
  logout: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.white, borderRadius: 18, padding: 16, marginTop: 2 },
  logoutText: { fontFamily: FontFamily.bold, fontSize: 14, color: Colors.danger },
});
