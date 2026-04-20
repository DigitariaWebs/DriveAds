import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import GradientHeader from '../../components/GradientHeader';

// ─── Types ──────────────────────────────────────────────────
type SettingItem = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  type: 'link' | 'toggle' | 'value';
  value?: string;
  toggleKey?: string;
  danger?: boolean;
  route?: string;
};

type SettingSection = {
  title: string;
  items: SettingItem[];
};

const SECTIONS: SettingSection[] = [
  {
    title: 'Compte',
    items: [
      { icon: 'user', label: 'Modifier le profil', type: 'link', route: '/(driver)/edit-profile' },
      { icon: 'lock', label: 'Changer le mot de passe', type: 'link', route: '/(driver)/change-password' },
      { icon: 'mail', label: 'Email de notification', type: 'link', route: '/(driver)/notification-email' },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { icon: 'volume-2', label: 'Nouvelles campagnes', type: 'toggle', toggleKey: 'newCampaigns' },
      { icon: 'dollar-sign', label: 'Paiements reçus', type: 'toggle', toggleKey: 'payments' },
      { icon: 'bell', label: 'Rappels', type: 'toggle', toggleKey: 'reminders' },
    ],
  },
  {
    title: 'Application',
    items: [
      { icon: 'globe', label: 'Langue', type: 'value', value: 'Français' },
      { icon: 'moon', label: 'Mode sombre', type: 'toggle', toggleKey: 'darkMode' },
      { icon: 'info', label: 'Version', type: 'value', value: '1.0.0' },
    ],
  },
  {
    title: 'Confidentialité',
    items: [
      { icon: 'file-text', label: "Conditions d'utilisation", type: 'link', route: '/(driver)/terms' },
      { icon: 'shield', label: 'Politique de confidentialité', type: 'link', route: '/(driver)/privacy' },
      { icon: 'trash-2', label: 'Supprimer mon compte', type: 'link', danger: true },
    ],
  },
];

// ─── Component ──────────────────────────────────────────────
export default function SettingsScreen() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    newCampaigns: true,
    payments: true,
    reminders: false,
    darkMode: false,
  });

  const handleToggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20,
        }}
      >
        <GradientHeader
          title="Paramètres"
          subtitle="Gérez votre compte et vos préférences"
        />

        <View style={styles.content}>
          {SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>
                {section.title.toUpperCase()}
              </Text>
              <View style={styles.sectionCard}>
                {section.items.map((item, index) => (
                  <TouchableOpacity
                    key={item.label}
                    style={[
                      styles.settingRow,
                      index < section.items.length - 1 && styles.settingRowBorder,
                    ]}
                    activeOpacity={item.type === 'toggle' ? 1 : 0.65}
                    onPress={() => {
                      if (item.type === 'link' && item.route) {
                        router.push(item.route as any);
                      } else if (item.type === 'link' && item.danger) {
                        Alert.alert(
                          'Supprimer le compte',
                          'Êtes-vous sûr ? Cette action est irréversible.',
                          [
                            { text: 'Annuler', style: 'cancel' },
                            {
                              text: 'Supprimer',
                              style: 'destructive',
                              onPress: () => {},
                            },
                          ],
                        );
                      } else if (item.type === 'toggle' && item.toggleKey) {
                        handleToggle(item.toggleKey);
                      }
                    }}
                  >
                    <Feather
                      name={item.icon}
                      size={18}
                      color={item.danger ? Colors.danger : Colors.navy}
                      style={styles.settingIcon}
                    />

                    <Text
                      style={[
                        styles.settingLabel,
                        item.danger && styles.settingLabelDanger,
                      ]}
                    >
                      {item.label}
                    </Text>

                    {item.type === 'toggle' && item.toggleKey && (
                      <Switch
                        value={toggles[item.toggleKey]}
                        onValueChange={() => handleToggle(item.toggleKey!)}
                        trackColor={{ false: Colors.gray200, true: Colors.navy }}
                        thumbColor={Colors.white}
                      />
                    )}

                    {item.type === 'value' && (
                      <Text style={styles.settingValue}>{item.value}</Text>
                    )}

                    {item.type === 'link' && (
                      <Feather
                        name="chevron-right"
                        size={16}
                        color={item.danger ? Colors.danger : Colors.gray400}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F6F2',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10.5,
    color: Colors.navyLight,
    marginBottom: 10,
    marginLeft: 4,
    letterSpacing: 1,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray100,
    ...Shadows.sm,
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 14,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  settingIcon: {
    width: 22,
    textAlign: 'center',
  },
  settingLabel: {
    flex: 1,
    fontFamily: FontFamily.semiBold,
    fontSize: 13.5,
    color: Colors.black,
    letterSpacing: -0.1,
  },
  settingLabelDanger: {
    color: Colors.danger,
  },
  settingValue: {
    fontFamily: FontFamily.medium,
    fontSize: 12.5,
    color: Colors.gray500,
  },
});
