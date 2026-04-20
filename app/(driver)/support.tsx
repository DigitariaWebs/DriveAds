import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import GradientHeader from '../../components/GradientHeader';

// ─── Types ──────────────────────────────────────────────────
type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    id: '1',
    question: 'Comment fonctionne Publeader ?',
    answer:
      "Publeader vous met en relation avec des marques qui souhaitent afficher leur publicité sur votre véhicule. Vous choisissez les campagnes qui vous intéressent, un professionnel pose le covering sur votre véhicule, et vous êtes rémunéré en fonction de vos kilomètres parcourus.",
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
      "Vous pouvez nous contacter par email à contact@publeader.com ou par téléphone au +33 1 00 00 00 00. Notre équipe est disponible du lundi au vendredi de 9h à 18h.",
  },
];

// ─── Component ──────────────────────────────────────────────
export default function SupportScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
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
          title="Aide & Support"
          subtitle="Nous sommes là pour vous aider"
        />

        <View style={styles.content}>
          {/* Contact card */}
          <Text style={styles.sectionLabel}>NOUS CONTACTER</Text>
          <View style={styles.contactCard}>
            <TouchableOpacity
              style={styles.contactRow}
              activeOpacity={0.7}
              onPress={() => Linking.openURL('mailto:contact@publeader.com')}
            >
              <Feather name="mail" size={18} color={Colors.navy} style={styles.contactIcon} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>contact@publeader.com</Text>
              </View>
              <Feather name="external-link" size={14} color={Colors.gray400} />
            </TouchableOpacity>

            <View style={styles.contactDivider} />

            <TouchableOpacity
              style={styles.contactRow}
              activeOpacity={0.7}
              onPress={() => Linking.openURL('tel:+33100000000')}
            >
              <Feather name="phone" size={18} color={Colors.navy} style={styles.contactIcon} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Téléphone</Text>
                <Text style={styles.contactValue}>+33 1 00 00 00 00</Text>
              </View>
              <Feather name="external-link" size={14} color={Colors.gray400} />
            </TouchableOpacity>
          </View>

          {/* FAQ */}
          <Text style={styles.sectionLabel}>QUESTIONS FRÉQUENTES</Text>
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
                      size={16}
                      color={isExpanded ? Colors.navy : Colors.gray400}
                    />
                  </TouchableOpacity>
                  {isExpanded && (
                    <View
                      style={[
                        styles.faqAnswer,
                        index < FAQ_ITEMS.length - 1 && styles.faqItemBorder,
                      ]}
                    >
                      <Text style={styles.faqAnswerText}>{item.answer}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Knowledge base link */}
          <TouchableOpacity style={styles.kbLink} activeOpacity={0.85}>
            <Feather name="book-open" size={18} color={Colors.navy} />
            <Text style={styles.kbLinkText}>
              Consulter la base de connaissances
            </Text>
            <Feather name="arrow-up-right" size={16} color={Colors.navy} />
          </TouchableOpacity>
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

  sectionLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10.5,
    color: Colors.navyLight,
    marginBottom: 10,
    marginLeft: 4,
    letterSpacing: 1,
    marginTop: 4,
  },

  // Contact card
  contactCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.gray100,
    ...Shadows.sm,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 8,
  },
  contactIcon: {
    width: 22,
    textAlign: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  contactValue: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.black,
    marginTop: 2,
    letterSpacing: -0.1,
  },
  contactDivider: {
    height: 1,
    backgroundColor: Colors.gray100,
    marginVertical: 6,
  },

  // FAQ
  faqList: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.gray100,
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
    fontFamily: FontFamily.bold,
    fontSize: 13.5,
    color: Colors.black,
    letterSpacing: -0.1,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 2,
  },
  faqAnswerText: {
    fontFamily: FontFamily.regular,
    fontSize: 12.5,
    color: Colors.gray600,
    lineHeight: 20,
  },

  // Knowledge base
  kbLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.navyTint,
    borderRadius: 18,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.navySoft,
  },
  kbLinkText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.navy,
    flex: 1,
    letterSpacing: -0.1,
  },
});
