import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';

const SECTIONS = [
  {
    title: '1. Collecte des données',
    body: "Nous collectons les données personnelles que vous fournissez lors de votre inscription (nom, prénom, email, numéro de téléphone, adresse) ainsi que les données de géolocalisation nécessaires au suivi des campagnes publicitaires. Les données relatives à votre véhicule (marque, modèle, immatriculation) sont également collectées pour assurer la compatibilité avec les supports publicitaires.",
  },
  {
    title: '2. Utilisation',
    body: "Vos données sont utilisées pour gérer votre compte, vous proposer des campagnes adaptées à votre profil et votre zone géographique, calculer vos rémunérations et améliorer nos services. Nous utilisons les données de géolocalisation uniquement pendant les campagnes actives pour vérifier les trajets effectués. Les données agrégées et anonymisées peuvent être utilisées à des fins statistiques.",
  },
  {
    title: '3. Partage',
    body: "Vos données personnelles ne sont jamais vendues à des tiers. Elles peuvent être partagées avec les annonceurs de manière anonymisée pour le reporting des campagnes. Nous pouvons partager vos données avec nos sous-traitants techniques (hébergement, paiement) qui sont soumis aux mêmes obligations de confidentialité. En cas d'obligation légale, vos données peuvent être communiquées aux autorités compétentes.",
  },
  {
    title: '4. Sécurité',
    body: "Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, toute modification, divulgation ou destruction. Les données sont chiffrées en transit et au repos. L'accès aux données personnelles est limité aux employés qui en ont besoin dans le cadre de leurs fonctions.",
  },
  {
    title: '5. Vos droits',
    body: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles. Vous pouvez également vous opposer au traitement de vos données ou demander la limitation de ce traitement. Pour exercer ces droits, contactez-nous à l'adresse indiquée ci-dessous. Vous disposez également du droit d'introduire une réclamation auprès de la CNIL.",
  },
];

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confidentialité</Text>
        <View style={styles.headerBtnPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20 }}
      >
        <View style={styles.content}>
          <View style={styles.card}>
            {SECTIONS.map((section) => (
              <View key={section.title} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionBody}>{section.body}</Text>
              </View>
            ))}
          </View>

          <View style={styles.contactWrap}>
            <Feather name="mail" size={14} color={Colors.gray500} />
            <Text style={styles.contactText}>
              Pour toute question: privacy@publeader.com
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.navyTint },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  headerBtnPlaceholder: { width: 40 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.navy,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    ...Shadows.sm,
  },

  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.navy,
    marginBottom: 8,
  },
  sectionBody: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.gray600,
    lineHeight: 20,
  },

  contactWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
  },
  contactText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray500,
  },
});
