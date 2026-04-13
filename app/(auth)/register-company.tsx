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
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inscription Entreprise</Text>
        <View style={styles.backBtn} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
        </ScrollView>
      </KeyboardAvoidingView>
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.navy,
    flex: 1,
    textAlign: 'center',
  },

  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
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
    ...Typography.caption,
    color: Colors.gray600,
    marginBottom: Spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
  },
  chipActive: {
    borderColor: Colors.navy,
    backgroundColor: Colors.navySoft,
  },
  chipText: {
    ...Typography.bodySmall,
    color: Colors.gray600,
  },
  chipTextActive: {
    fontFamily: FontFamily.semiBold,
    color: Colors.navy,
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
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
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
