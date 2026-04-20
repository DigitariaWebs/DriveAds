import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius } from '../../constants/Spacing';
import { Company } from '../../constants/Types';
import { useData } from '../../context/DataContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import BrandLogo from '../../components/BrandLogo';

const SECTORS = [
  'Mode & Sport',
  'Alimentation & Boissons',
  'Technologie',
  'Automobile',
  'Divertissement',
  'Santé',
  'Finance',
  'Autre',
];

const BUDGETS = [
  { label: '< 5 000€', value: 5000 },
  { label: '5 000€ - 10 000€', value: 10000 },
  { label: '10 000€ - 20 000€', value: 20000 },
  { label: '20 000€ - 30 000€', value: 30000 },
  { label: '30 000€+', value: 35000 },
];

export default function RegisterCompanyScreen() {
  const insets = useSafeAreaInsets();
  const { addCompany } = useData();

  const [companyName, setCompanyName] = useState('');
  const [domain, setDomain] = useState('');
  const [sector, setSector] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [headquarters, setHeadquarters] = useState('');
  const [budget, setBudget] = useState<{ label: string; value: number } | null>(null);
  const [acceptCGU, setAcceptCGU] = useState(false);

  const validate = (): boolean => {
    if (!companyName.trim()) {
      Alert.alert('Erreur', "Veuillez saisir le nom de l'entreprise.");
      return false;
    }
    if (!sector) {
      Alert.alert('Erreur', "Veuillez sélectionner votre secteur d'activité.");
      return false;
    }
    if (!contactName.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir le nom du contact.');
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Erreur', 'Veuillez saisir un email valide.');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un numéro de téléphone.');
      return false;
    }
    if (!budget) {
      Alert.alert('Erreur', 'Veuillez sélectionner votre budget mensuel estimé.');
      return false;
    }
    if (!acceptCGU) {
      Alert.alert('Erreur', "Veuillez accepter les conditions générales d'utilisation.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const newCompany: Company = {
      id: `c_${Date.now()}`,
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      domain: domain.trim() || `${companyName.trim().toLowerCase().replace(/\s+/g, '')}.com`,
      sector,
      city: headquarters.trim() || 'Paris',
      website: website.trim(),
      description: description.trim(),
      status: 'pending',
      founded: new Date().getFullYear().toString(),
      headquarters: headquarters.trim(),
      budgetTotal: budget!.value,
      employees: '',
      campaignsCount: 0,
      gallery: [],
    };

    addCompany(newCompany);
    router.replace('/(auth)/pending');
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + Spacing.md },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ─── Hero card ───────────────────────────────── */}
          <View style={styles.heroCard}>
            <LinearGradient
              colors={['#1A2752', '#2E3F7A', '#233466']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroGlowWrap} pointerEvents="none">
              <LinearGradient
                colors={['rgba(244,184,81,0.5)', 'rgba(244,184,81,0)']}
                style={styles.heroGlow}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              />
            </View>
            <View style={styles.heroGlowWrap2} pointerEvents="none">
              <LinearGradient
                colors={['rgba(150,170,255,0.22)', 'rgba(150,170,255,0)']}
                style={styles.heroGlow}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              />
            </View>

            <View style={styles.heroContent}>
              <View style={styles.heroTopRow}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.heroBackBtn}
                  activeOpacity={0.7}
                >
                  <Feather name="arrow-left" size={18} color={Colors.white} />
                </TouchableOpacity>

                <View style={styles.heroBadge}>
                  <Feather name="briefcase" size={12} color={Colors.white} />
                  <Text style={styles.heroBadgeText}>Entreprise</Text>
                </View>
              </View>

              <Text style={styles.heroEyebrow}>INSCRIPTION ENTREPRISE</Text>
              <Text style={styles.heroTitle}>
                Lancez votre{'\n'}première campagne
              </Text>
              <Text style={styles.heroSubtitle}>
                Présentez votre marque — notre équipe valide votre dossier
                sous 48 h.
              </Text>

              {/* Info chip */}
              <View style={styles.heroInfoChip}>
                <View style={styles.heroInfoIcon}>
                  <Feather name="clock" size={14} color="#1A2752" />
                </View>
                <Text style={styles.heroInfoLabel}>Validation sous 48 h</Text>
                <View style={{ flex: 1 }} />
                <View style={styles.heroInfoDot} />
                <Text style={styles.heroInfoStatus}>gratuit</Text>
              </View>
            </View>
          </View>

          {/* ─── Form card ───────────────────────────────── */}
          <View style={styles.formCard}>
            <Text style={styles.formCardLabel}>VOTRE MARQUE</Text>

            {/* Live brand logo preview */}
            {domain.trim().length > 3 && (
              <View style={styles.logoPreview}>
                <BrandLogo domain={domain.trim()} name={companyName || domain} size={64} />
                <Text style={styles.logoHint}>Aperçu du logo</Text>
              </View>
            )}

          <Input
            label="Nom de l'entreprise"
            placeholder="Nike France"
            value={companyName}
            onChangeText={setCompanyName}
            icon="briefcase"
          />

          <Input
            label="Nom de domaine (optionnel)"
            placeholder="nike.com"
            value={domain}
            onChangeText={setDomain}
            icon="globe"
            keyboardType="url"
          />

          <Text style={styles.pickerLabel}>Secteur d'activité</Text>
          <View style={styles.chipRow}>
            {SECTORS.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, sector === s && styles.chipActive]}
                onPress={() => setSector(s)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, sector === s && styles.chipTextActive]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Nom du contact"
            placeholder="Jean-Pierre Lefèvre"
            value={contactName}
            onChangeText={setContactName}
            icon="user"
          />

          <Input
            label="Email de contact"
            placeholder="contact@entreprise.com"
            value={email}
            onChangeText={setEmail}
            icon="mail"
            keyboardType="email-address"
          />

          <Input
            label="Téléphone"
            placeholder="+33 1 42 68 00 00"
            value={phone}
            onChangeText={setPhone}
            icon="phone"
            keyboardType="phone-pad"
          />

          <Input
            label="Site web (optionnel)"
            placeholder="https://www.entreprise.com"
            value={website}
            onChangeText={setWebsite}
            icon="link"
            keyboardType="url"
          />

          <Input
            label="Description de votre activité (optionnel)"
            placeholder="Décrivez brièvement votre entreprise et vos objectifs publicitaires..."
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Input
            label="Siège social (optionnel)"
            placeholder="Paris, France"
            value={headquarters}
            onChangeText={setHeadquarters}
            icon="map-pin"
          />

          <Text style={styles.pickerLabel}>Budget mensuel estimé</Text>
          <View style={styles.budgetCol}>
            {BUDGETS.map((b) => {
              const active = budget?.label === b.label;
              return (
                <TouchableOpacity
                  key={b.label}
                  style={[styles.budgetOption, active && styles.budgetOptionActive]}
                  onPress={() => setBudget(b)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active && <View style={styles.radioDot} />}
                  </View>
                  <Text style={[styles.budgetText, active && styles.budgetTextActive]}>
                    {b.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* CGU checkbox */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAcceptCGU(!acceptCGU)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, acceptCGU && styles.checkboxChecked]}>
              {acceptCGU && <Feather name="check" size={14} color={Colors.white} />}
            </View>
            <Text style={styles.checkboxLabel}>
              J'accepte les conditions générales d'utilisation
            </Text>
          </TouchableOpacity>

          {/* Submit */}
          <View style={styles.submitArea}>
            <Button
              variant="primary"
              size="lg"
              icon="send"
              onPress={handleSubmit}
            >
              Soumettre ma demande
            </Button>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F4EF',
  },
  flex: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.huge,
  },

  // ─── Hero card ────────────────────────────────────────
  heroCard: {
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    minHeight: 280,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  heroGlowWrap: {
    position: 'absolute',
    top: -120,
    right: -100,
    width: 360,
    height: 360,
  },
  heroGlowWrap2: {
    position: 'absolute',
    bottom: -120,
    left: -80,
    width: 320,
    height: 320,
  },
  heroGlow: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  heroContent: {
    padding: Spacing.xxl,
    paddingTop: Spacing.xl,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  heroBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.white,
    letterSpacing: 0.3,
  },
  heroEyebrow: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10.5,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 10,
  },
  heroTitle: {
    fontFamily: FontFamily.black,
    fontSize: 28,
    lineHeight: 34,
    color: Colors.white,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 13.5,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.72)',
    marginBottom: Spacing.xl,
  },
  heroInfoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroInfoIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#F4B851',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroInfoLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: Colors.white,
  },
  heroInfoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7FE8B0',
    marginRight: 6,
  },
  heroInfoStatus: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: '#7FE8B0',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  // ─── Form card ────────────────────────────────────────
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing.xxl,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  formCardLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10.5,
    letterSpacing: 1,
    color: Colors.navyLight,
    marginBottom: Spacing.lg,
  },

  // Logo preview
  logoPreview: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    paddingVertical: Spacing.lg,
  },
  logoHint: {
    ...Typography.caption,
    color: Colors.gray400,
    marginTop: Spacing.sm,
  },

  // Chip picker
  pickerLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: Colors.gray600,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
  },
  chipActive: {
    borderColor: Colors.navy,
    backgroundColor: Colors.navy,
  },
  chipText: {
    fontFamily: FontFamily.medium,
    fontSize: 12.5,
    color: Colors.gray600,
  },
  chipTextActive: {
    fontFamily: FontFamily.bold,
    fontSize: 12.5,
    color: Colors.white,
  },

  // Budget radio list
  budgetCol: {
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  budgetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gray100,
    backgroundColor: '#FAFAF7',
  },
  budgetOptionActive: {
    borderColor: Colors.navy,
    backgroundColor: Colors.navySoft,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: Colors.navy,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.navy,
  },
  budgetText: {
    ...Typography.body,
    color: Colors.gray700,
  },
  budgetTextActive: {
    fontFamily: FontFamily.semiBold,
    color: Colors.navy,
  },

  // Checkbox
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  checkboxLabel: {
    ...Typography.bodySmall,
    color: Colors.gray700,
    flex: 1,
  },

  // Submit
  submitArea: {
    marginTop: Spacing.sm,
  },
});
