import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, RefreshControl } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
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
import { fetchMyCompany, type CompanyProfile } from '../../lib/profile-api';

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

  const [liveCompany, setLiveCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const c = await fetchMyCompany();
      setLiveCompany(c);
    } catch {
      setLiveCompany(null);
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

  // Prefer live company doc; fallback fields from AuthContext snapshot when
  // /api/me/company hasn't replied yet.
  const company: CompanyProfile | null =
    liveCompany ??
    (currentCompany
      ? {
          id: currentCompany.id,
          companyName: currentCompany.companyName,
          contactName: currentCompany.contactName,
          phone: currentCompany.phone,
          domain: currentCompany.domain,
          sector: currentCompany.sector,
          city: currentCompany.city,
          website: currentCompany.website,
          description: currentCompany.description,
          founded: currentCompany.founded,
          headquarters: currentCompany.headquarters,
          employees: currentCompany.employees,
          status: currentCompany.status,
          budgetTotal: currentCompany.budgetTotal,
          campaignsCount: currentCompany.campaignsCount,
          createdAt: '',
        }
      : null);
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
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={load}
            tintColor={Colors.navy}
          />
        }
      >
        {/* Avatar + Name */}
        <View
          style={[
            styles.profileHeader,
            company?.brandColor
              ? { backgroundColor: `${company.brandColor}1A`, borderRadius: 20 }
              : null,
          ]}
        >
          {company?.logo?.url || company?.logoUrl ? (
            <Image
              source={{ uri: company.logo?.url ?? company.logoUrl! }}
              style={{ width: 80, height: 80, borderRadius: 20 }}
              resizeMode="cover"
            />
          ) : (
            <BrandLogo
              domain={company?.domain ?? 'company.com'}
              name={company?.companyName ?? 'E'}
              size={80}
            />
          )}
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

        {/* Legal info (read-only — edit on web) */}
        {(company?.legalName ||
          company?.siret ||
          company?.vatNumber ||
          company?.legalForm) && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Informations légales</Text>
            {company.legalName ? (
              <View style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <Feather name="briefcase" size={16} color={Colors.navy} />
                </View>
                <Text style={styles.infoValue}>{company.legalName}</Text>
              </View>
            ) : null}
            {company.legalForm ? (
              <View style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <Feather name="file-text" size={16} color={Colors.navy} />
                </View>
                <Text style={styles.infoValue}>{company.legalForm}</Text>
              </View>
            ) : null}
            {company.siret ? (
              <View style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <Feather name="hash" size={16} color={Colors.navy} />
                </View>
                <Text style={styles.infoValue}>SIRET : {company.siret}</Text>
              </View>
            ) : null}
            {company.vatNumber ? (
              <View style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <Feather name="hash" size={16} color={Colors.navy} />
                </View>
                <Text style={styles.infoValue}>TVA : {company.vatNumber}</Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Edit hint */}
        <View style={styles.editHint}>
          <Feather name="info" size={12} color={Colors.gray500} />
          <Text style={styles.editHintText}>
            Pour modifier votre profil et votre logo, utilisez le tableau de bord web.
          </Text>
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
});
