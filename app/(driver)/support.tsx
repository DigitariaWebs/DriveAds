import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';

// ─── Types ──────────────────────────────────────────────────
type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    id: '1',
    question: 'Comment fonctionne DriveAds ?',
    answer:
      "DriveAds vous met en relation avec des marques qui souhaitent afficher leur publicité sur votre véhicule. Vous choisissez les campagnes qui vous intéressent, un professionnel pose le covering sur votre véhicule, et vous êtes rémunéré en fonction de vos kilomètres parcourus.",
  },
  {
    id: '2',
    question: 'Comment sont calculés mes revenus ?',
    answer:
      "Vos revenus sont calculés en fonction du nombre de kilomètres parcourus pendant la durée de la campagne. Chaque campagne a un tarif au kilomètre défini par l'annonceur. Vous pouvez suivre vos gains en temps réel depuis l'application.",
  },
  {
    id: '3',
    question: 'Comment modifier mon véhicule ?',
    answer:
      "Rendez-vous dans votre profil, puis dans la section 'Mes véhicules'. Vous pouvez y modifier les informations de votre véhicule, ajouter des photos ou enregistrer un nouveau véhicule.",
  },
  {
    id: '4',
    question: 'Comment contacter le support ?',
    answer:
      "Vous pouvez nous contacter par email à contact@driveads.com ou par téléphone au +33 1 00 00 00 00. Notre équipe est disponible du lundi au vendredi de 9h à 18h.",
  },
];

// ─── Component ──────────────────────────────────────────────
export default function SupportScreen() {
  const insets = useSafeAreaInsets();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aide & Support</Text>
        <View style={styles.headerBtnPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20 }}
      >
        <View style={styles.content}>
          {/* Contact card */}
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Nous contacter</Text>

            <TouchableOpacity
              style={styles.contactRow}
              activeOpacity={0.7}
              onPress={() => Linking.openURL('mailto:contact@driveads.com')}
            >
              <View style={[styles.contactIconWrap, { backgroundColor: Colors.infoSoft }]}>
                <Feather name="mail" size={18} color={Colors.info} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>contact@driveads.com</Text>
              </View>
              <Feather name="external-link" size={16} color={Colors.gray400} />
            </TouchableOpacity>

            <View style={styles.contactDivider} />

            <TouchableOpacity
              style={styles.contactRow}
              activeOpacity={0.7}
              onPress={() => Linking.openURL('tel:+33100000000')}
            >
              <View style={[styles.contactIconWrap, { backgroundColor: Colors.successSoft }]}>
                <Feather name="phone" size={18} color={Colors.success} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Téléphone</Text>
                <Text style={styles.contactValue}>+33 1 00 00 00 00</Text>
              </View>
              <Feather name="external-link" size={16} color={Colors.gray400} />
            </TouchableOpacity>
          </View>

          {/* FAQ section */}
          <Text style={styles.sectionTitle}>Questions fréquentes</Text>
          <View style={styles.faqList}>
            {FAQ_ITEMS.map((item, index) => {
              const isExpanded = expandedId === item.id;
              return (
                <View key={item.id}>
                  <TouchableOpacity
                    style={[
                      styles.faqItem,
                      index < FAQ_ITEMS.length - 1 && !isExpanded && styles.faqItemBorder,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => toggleFaq(item.id)}
                  >
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <Feather
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={Colors.gray400}
                    />
                  </TouchableOpacity>
                  {isExpanded && (
                    <View style={[
                      styles.faqAnswer,
                      index < FAQ_ITEMS.length - 1 && styles.faqItemBorder,
                    ]}>
                      <Text style={styles.faqAnswerText}>{item.answer}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Knowledge base link */}
          <TouchableOpacity style={styles.kbLink} activeOpacity={0.7}>
            <Feather name="book-open" size={18} color={Colors.navy} />
            <Text style={styles.kbLinkText}>Consulter la base de connaissances</Text>
            <Feather name="arrow-right" size={16} color={Colors.navy} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.navyTint },

  // Header
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

  // Contact card
  contactCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    ...Shadows.sm,
  },
  contactTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.black,
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.gray500,
  },
  contactValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.black,
    marginTop: 1,
  },
  contactDivider: {
    height: 1,
    backgroundColor: Colors.gray100,
    marginVertical: 14,
  },

  // FAQ
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.black,
    marginBottom: 12,
  },
  faqList: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginBottom: 20,
    ...Shadows.sm,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  faqItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  faqQuestion: {
    flex: 1,
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.black,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswerText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.gray600,
    lineHeight: 20,
  },

  // Knowledge base link
  kbLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.navySoft,
    borderRadius: 20,
    padding: 16,
    gap: 8,
  },
  kbLinkText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.navy,
    flex: 1,
  },
});
