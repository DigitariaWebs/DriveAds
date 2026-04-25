import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Badge from '../../components/ui/Badge';
import BrandLogo from '../../components/BrandLogo';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';

type MenuItem = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  danger?: boolean;
  route?: string;
};

const MENU_ITEMS: MenuItem[] = [
  { icon: 'edit', label: 'Modifier le profil' },
  { icon: 'credit-card', label: 'Facturation' },
  { icon: 'settings', label: 'Paramètres' },
  { icon: 'help-circle', label: 'Aide & Support' },
  { icon: 'log-out', label: 'Se déconnecter', danger: true },
];

export default function AdvertiserProfileScreen() {
  const insets = useSafeAreaInsets();
  const { currentCompany, logout } = useAuth();
  const { campaigns } = useData();

  const company = currentCompany;
  const companyId = company?.id ?? 'c1';

  const companyCampaigns = campaigns.filter((c) => c.companyId === companyId);
  const totalBudget = companyCampaigns.reduce((sum, c) => sum + c.reward * c.driversNeeded, 0);
  const uniqueCities = [...new Set(companyCampaigns.map((c) => c.city))];

  const handleMenuPress = (item: MenuItem) => {
    if (item.danger) {
      logout().then(() => {
        router.replace('/(auth)/welcome');
      });
    } else if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + Name */}
        <View style={styles.profileHeader}>
          <BrandLogo
            domain={company?.domain ?? 'company.com'}
            name={company?.companyName ?? 'E'}
            size={80}
          />
          <Text style={styles.name}>{company?.companyName ?? 'Annonceur'}</Text>
          <View style={styles.badgeRow}>
            {company?.sector && <Badge variant="navy" label={company.sector} />}
            {company?.city && <Badge variant="neutral" label={company.city} icon="map-pin" />}
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{companyCampaigns.length}</Text>
            <Text style={styles.statLabel}>campagnes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{totalBudget.toLocaleString()} €</Text>
            <Text style={styles.statLabel}>budget total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{uniqueCities.length}</Text>
            <Text style={styles.statLabel}>villes</Text>
          </View>
        </View>

        {/* Contact info card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Informations de contact</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <Feather name="user" size={16} color={Colors.navy} />
            </View>
            <Text style={styles.infoValue}>{company?.contactName ?? '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <Feather name="mail" size={16} color={Colors.navy} />
            </View>
            <Text style={styles.infoValue}>{company?.email ?? '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <Feather name="phone" size={16} color={Colors.navy} />
            </View>
            <Text style={styles.infoValue}>{company?.phone ?? '—'}</Text>
          </View>
          {company?.website ? (
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrap}>
                <Feather name="globe" size={16} color={Colors.navy} />
              </View>
              <Text style={styles.infoValue}>{company.website}</Text>
            </View>
          ) : null}
        </View>

        {/* Menu list */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < MENU_ITEMS.length - 1 && styles.menuItemBorder,
              ]}
              onPress={() => handleMenuPress(item)}
              activeOpacity={0.6}
            >
              <View style={[styles.menuIconWrap, item.danger && styles.menuIconDanger]}>
                <Feather
                  name={item.icon}
                  size={18}
                  color={item.danger ? Colors.danger : Colors.navy}
                />
              </View>
              <Text
                style={[
                  styles.menuLabel,
                  item.danger && styles.menuLabelDanger,
                ]}
              >
                {item.label}
              </Text>
              <Feather
                name="chevron-right"
                size={18}
                color={item.danger ? Colors.danger : Colors.gray400}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 16 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.navyTint,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },

  // Profile header
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  name: {
    fontFamily: FontFamily.black,
    fontSize: 20,
    color: Colors.black,
    marginTop: 12,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    ...Shadows.sm,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.black,
  },
  statLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.gray200,
  },

  // Info card
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    ...Shadows.sm,
  },
  cardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.black,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  infoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoValue: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.gray700,
    flex: 1,
  },

  // Menu
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconDanger: {
    backgroundColor: Colors.dangerSoft,
  },
  menuLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.black,
    flex: 1,
  },
  menuLabelDanger: {
    color: Colors.danger,
  },
});
