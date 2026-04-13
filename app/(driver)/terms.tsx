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
    title: '1. Acceptation',
    body: "En utilisant l'application DriveAds, vous acceptez sans réserve les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services. L'utilisation continue de l'application après toute modification des conditions constitue votre acceptation de ces changements.",
  },
  {
    title: '2. Services',
    body: "DriveAds est une plateforme de mise en relation entre annonceurs et conducteurs souhaitant afficher de la publicité sur leur véhicule. Nous facilitons le processus de sélection des campagnes, le suivi des trajets et le paiement des conducteurs participants. Les services peuvent être modifiés ou interrompus à tout moment sans préavis.",
  },
  {
    title: '3. Inscription',
    body: "Pour utiliser nos services, vous devez créer un compte en fournissant des informations exactes et complètes. Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toutes les activités effectuées depuis votre compte. Vous devez être âgé d'au moins 18 ans et détenir un permis de conduire valide.",
  },
  {
    title: '4. Obligations',
    body: "Les conducteurs s'engagent à maintenir les supports publicitaires en bon état, à respecter les itinéraires convenus et à fournir des informations de suivi exactes. Toute tentative de fraude ou de manipulation des données de trajet entraînera la résiliation immédiate du compte et le remboursement des sommes indûment perçues.",
  },
  {
    title: '5. Paiements',
    body: "Les paiements sont effectués conformément aux conditions de chaque campagne. DriveAds se réserve le droit de retenir les paiements en cas de suspicion de fraude ou de non-respect des conditions de la campagne. Les conducteurs sont responsables de leurs obligations fiscales liées aux revenus perçus via la plateforme.",
  },
  {
    title: '6. Responsabilités',
    body: "DriveAds ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation de la plateforme. Les conducteurs sont responsables de leur véhicule et de leur conduite. DriveAds n'est pas responsable des accidents, des dommages au véhicule ou des infractions au code de la route.",
  },
  {
    title: '7. Modifications',
    body: "DriveAds se réserve le droit de modifier les présentes conditions à tout moment. Les utilisateurs seront informés de tout changement significatif par email ou notification dans l'application. La poursuite de l'utilisation des services après notification des modifications vaut acceptation des nouvelles conditions.",
  },
];

export default function TermsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"Conditions d'utilisation"}</Text>
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

          <Text style={styles.lastUpdate}>
            Dernière mise à jour: 1er janvier 2026
          </Text>
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

  lastUpdate: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray400,
    textAlign: 'center',
    marginTop: 20,
  },
});
