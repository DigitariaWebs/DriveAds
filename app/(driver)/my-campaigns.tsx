import { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { useData } from '../../context/DataContext';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import CampaignCard from '../../components/CampaignCard';
import type { Campaign } from '../../constants/Types';

const { width } = Dimensions.get('window');

export default function DriverMyCampaignsScreen() {
  const insets = useSafeAreaInsets();
  const { myCampaigns, myCampaignsLoading, refreshMyCampaigns } = useData();

  useFocusEffect(
    useCallback(() => {
      refreshMyCampaigns();
    }, [refreshMyCampaigns]),
  );

  const totalCount =
    myCampaigns.active.length +
    myCampaigns.upcoming.length +
    myCampaigns.completed.length;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 24 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={myCampaignsLoading}
            onRefresh={refreshMyCampaigns}
            tintColor={Colors.navy}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { paddingTop: insets.top + 12 }]}>
          <LinearGradient
            colors={[Colors.navyDark, Colors.navy, Colors.navyLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroTopBar}>
            <Image
              source={require('../../assets/logo-white.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.heroTitle}>Mes campagnes</Text>
          <Text style={styles.heroSubtitle}>
            {totalCount} mission{totalCount > 1 ? 's' : ''}
          </Text>
        </View>

        {totalCount === 0 && !myCampaignsLoading && (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Feather name="inbox" size={28} color={Colors.gray400} />
            </View>
            <Text style={styles.emptyTitle}>Aucune campagne acceptée</Text>
            <Text style={styles.emptyText}>
              Acceptez une mission depuis l'onglet Campagnes pour la voir ici.
            </Text>
            <TouchableOpacity
              style={styles.emptyCta}
              onPress={() => router.push('/(driver)/campaigns')}
              activeOpacity={0.85}
            >
              <Text style={styles.emptyCtaText}>Voir les campagnes</Text>
              <Feather name="arrow-right" size={14} color={Colors.white} />
            </TouchableOpacity>
          </View>
        )}

        <Section label="En cours" campaigns={myCampaigns.active} />
        <Section label="À venir" campaigns={myCampaigns.upcoming} />
        <Section label="Terminées" campaigns={myCampaigns.completed} />
      </ScrollView>
    </View>
  );
}

function Section({
  label,
  campaigns,
}: {
  label: string;
  campaigns: Campaign[];
}) {
  if (campaigns.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>
        {label.toUpperCase()} · {campaigns.length}
      </Text>
      {campaigns.map((c) => (
        <View key={c.id} style={styles.cardWrap}>
          <CampaignCard
            campaign={c}
            onPress={() => router.push(`/(driver)/campaign/${c.id}`)}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F6F2',
  },
  content: {
    paddingBottom: 40,
  },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    overflow: 'hidden',
  },
  heroTopBar: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  logo: {
    width: 110,
    height: 26,
  },
  heroTitle: {
    fontFamily: FontFamily.black,
    fontSize: 32,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 4,
  },
  section: {
    paddingTop: 20,
  },
  sectionLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    letterSpacing: 0.8,
    color: Colors.gray500,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  cardWrap: {
    paddingHorizontal: 20,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
    gap: 8,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  emptyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.gray700,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: 12.5,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  emptyCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.navy,
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 100,
  },
  emptyCtaText: {
    fontFamily: FontFamily.bold,
    fontSize: 12.5,
    color: Colors.white,
  },
});
