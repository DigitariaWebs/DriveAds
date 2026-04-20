import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { Driver } from '../../constants/Types';
import { useData } from '../../context/DataContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

// ─── Constants ──────────────────────────────────────────────
const CITIES = ['Paris', 'Lyon', 'Caen', 'Marseille', 'Nice', 'Bordeaux'] as const;
const VEHICLE_TYPES = ['Berline', 'SUV', 'Utilitaire', 'Autre'] as const;

type StepMeta = {
  label: string;
  title: string;
  subtitle: string;
};

const STEPS: StepMeta[] = [
  {
    label: 'Identité',
    title: 'Parlez-nous de vous',
    subtitle: 'Quelques informations pour créer votre profil chauffeur.',
  },
  {
    label: 'Véhicule',
    title: 'Votre véhicule',
    subtitle: 'Ajoutez les détails qui aideront à vous matcher aux campagnes.',
  },
  {
    label: 'Sécurité',
    title: 'Sécurisez votre compte',
    subtitle: 'Choisissez un mot de passe et acceptez les conditions.',
  },
  {
    label: 'Documents',
    title: 'Derniers documents',
    subtitle: 'Importez vos pièces pour finaliser la validation.',
  },
];

const DOCUMENTS = [
  { key: 'license', icon: 'credit-card' as const, label: 'Permis de conduire' },
  { key: 'registration', icon: 'file-text' as const, label: 'Carte grise du véhicule' },
  { key: 'insurance', icon: 'shield' as const, label: "Attestation d'assurance" },
  { key: 'photos', icon: 'camera' as const, label: 'Photos du véhicule (extérieur)' },
];

// ─── Component ──────────────────────────────────────────────
export default function RegisterDriverScreen() {
  const insets = useSafeAreaInsets();
  const { addDriver } = useData();
  const [step, setStep] = useState(1);

  // Step 1 — Identité
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState<string>('');

  // Step 2 — Véhicule
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleType, setVehicleType] = useState<string>('');
  const [photoUploaded, setPhotoUploaded] = useState(false);

  // Step 3 — Sécurité
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptCGU, setAcceptCGU] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  // Step 4 — Documents
  const [docs, setDocs] = useState<Record<string, boolean>>({
    license: false,
    registration: false,
    insurance: false,
    photos: false,
  });

  const docsCount = Object.values(docs).filter(Boolean).length;
  const allDocsUploaded = docsCount === 4;
  const progressPercent = step * 25;

  // ─── Animated progress bar ────────────────────────────────
  const progressAnim = useRef(new Animated.Value(25)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercent,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [progressPercent]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  // ─── Validation ───────────────────────────────────────────
  const validateStep1 = (): boolean => {
    if (!firstName.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre prénom.');
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre nom.');
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Erreur', 'Veuillez saisir un email valide.');
      return false;
    }
    if (!phone.trim() || !/^(\+33|0)[1-9]\d{8}$/.test(phone.replace(/\s/g, ''))) {
      Alert.alert('Erreur', 'Veuillez saisir un numéro de téléphone français valide (ex: +33 6 12 34 56 78).');
      return false;
    }
    if (!city) {
      Alert.alert('Erreur', 'Veuillez sélectionner votre ville.');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!vehicleModel.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir le modèle du véhicule.');
      return false;
    }
    if (!vehicleYear.trim() || !/^\d{4}$/.test(vehicleYear)) {
      Alert.alert('Erreur', "Veuillez saisir une année valide (ex: 2022).");
      return false;
    }
    if (!licensePlate.trim()) {
      Alert.alert('Erreur', "Veuillez saisir la plaque d'immatriculation.");
      return false;
    }
    if (!vehicleType) {
      Alert.alert('Erreur', 'Veuillez sélectionner le type de véhicule.');
      return false;
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    if (!password || password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return false;
    }
    if (!acceptCGU) {
      Alert.alert('Erreur', "Veuillez accepter les conditions générales d'utilisation.");
      return false;
    }
    if (!acceptPrivacy) {
      Alert.alert('Erreur', 'Veuillez accepter la politique de confidentialité.');
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep((s) => Math.min(s + 1, 4));
  };

  const goBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = () => {
    const newDriver: Driver = {
      id: `d_${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city as Driver['city'],
      vehicleModel: vehicleModel.trim(),
      vehicleYear: vehicleYear.trim(),
      licensePlate: licensePlate.trim().toUpperCase(),
      vehicleType: vehicleType as Driver['vehicleType'],
      status: 'pending',
      joinedAt: new Date().toISOString().split('T')[0],
      campaignsDone: 0,
      rating: 0,
      totalKm: 0,
      totalEarnings: 0,
      documentsUploaded: true,
    };
    addDriver(newDriver);
    router.replace('/(auth)/pending');
  };

  // ─── Picker helper ────────────────────────────────────────
  const renderChipPicker = (
    options: readonly string[],
    selected: string,
    onSelect: (v: string) => void,
  ) => (
    <View style={styles.chipRow}>
      {options.map((opt) => {
        const active = selected === opt;
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelect(opt)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // ─── Checkbox helper ──────────────────────────────────────
  const renderCheckbox = (
    checked: boolean,
    onToggle: () => void,
    label: string,
  ) => (
    <TouchableOpacity
      style={styles.checkboxRow}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Feather name="check" size={14} color={Colors.white} />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

  // ─── Step content ─────────────────────────────────────────
  const renderStep1 = () => (
    <>
      <Input
        label="Prénom"
        placeholder="Marie"
        value={firstName}
        onChangeText={setFirstName}
        icon="user"
      />
      <Input
        label="Nom"
        placeholder="Dupont"
        value={lastName}
        onChangeText={setLastName}
        icon="user"
      />
      <Input
        label="Email"
        placeholder="marie@email.com"
        value={email}
        onChangeText={setEmail}
        icon="mail"
        keyboardType="email-address"
      />
      <Input
        label="Téléphone"
        placeholder="+33 6 12 34 56 78"
        value={phone}
        onChangeText={setPhone}
        icon="phone"
        keyboardType="phone-pad"
      />

      <Text style={styles.pickerLabel}>Ville</Text>
      {renderChipPicker(CITIES, city, setCity)}

      <View style={styles.buttonArea}>
        <Button variant="primary" size="lg" onPress={goNext} icon="arrow-right">
          Suivant
        </Button>
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      <Input
        label="Modèle du véhicule"
        placeholder="Peugeot 308"
        value={vehicleModel}
        onChangeText={setVehicleModel}
        icon="truck"
      />
      <Input
        label="Année du véhicule"
        placeholder="2022"
        value={vehicleYear}
        onChangeText={setVehicleYear}
        icon="calendar"
        keyboardType="number-pad"
      />
      <Input
        label="Plaque d'immatriculation"
        placeholder="AB-123-CD"
        value={licensePlate}
        onChangeText={setLicensePlate}
        icon="credit-card"
      />

      <Text style={styles.pickerLabel}>Type de véhicule</Text>
      {renderChipPicker(VEHICLE_TYPES, vehicleType, setVehicleType)}

      {/* Photo upload placeholder */}
      <Text style={styles.pickerLabel}>Photo du véhicule</Text>
      <TouchableOpacity
        style={[styles.uploadButton, photoUploaded && styles.uploadButtonDone]}
        onPress={() => setPhotoUploaded(!photoUploaded)}
        activeOpacity={0.7}
      >
        <Feather
          name={photoUploaded ? 'check-circle' : 'camera'}
          size={24}
          color={photoUploaded ? Colors.success : Colors.navy}
        />
        <Text
          style={[
            styles.uploadText,
            photoUploaded && styles.uploadTextDone,
          ]}
        >
          {photoUploaded ? 'Photo ajoutée' : 'Ajouter une photo'}
        </Text>
      </TouchableOpacity>

      <View style={styles.buttonArea}>
        <Button variant="primary" size="lg" onPress={goNext} icon="arrow-right">
          Suivant
        </Button>
      </View>
    </>
  );

  const renderStep3 = () => (
    <>
      <Input
        label="Mot de passe"
        placeholder="Minimum 6 caractères"
        value={password}
        onChangeText={setPassword}
        icon="lock"
        secureTextEntry
      />
      <Input
        label="Confirmer le mot de passe"
        placeholder="Retapez votre mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        icon="lock"
        secureTextEntry
      />

      <View style={styles.checkboxGroup}>
        {renderCheckbox(acceptCGU, () => setAcceptCGU(!acceptCGU),
          "J'accepte les conditions générales d'utilisation")}
        {renderCheckbox(acceptPrivacy, () => setAcceptPrivacy(!acceptPrivacy),
          "J'accepte la politique de confidentialité")}
      </View>

      <View style={styles.buttonArea}>
        <Button variant="primary" size="lg" onPress={goNext} icon="arrow-right">
          Suivant
        </Button>
      </View>
    </>
  );

  const renderStep4 = () => (
    <>
      <Text style={styles.docsCount}>
        {docsCount}/4 documents fournis
      </Text>

      {DOCUMENTS.map((doc) => {
        const uploaded = docs[doc.key];
        return (
          <TouchableOpacity
            key={doc.key}
            style={[styles.docCard, uploaded && styles.docCardDone]}
            onPress={() =>
              setDocs((prev) => ({ ...prev, [doc.key]: !prev[doc.key] }))
            }
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.docIconCircle,
                uploaded && styles.docIconCircleDone,
              ]}
            >
              <Feather
                name={uploaded ? 'check' : doc.icon}
                size={22}
                color={uploaded ? Colors.white : Colors.navy}
              />
            </View>
            <Text
              style={[styles.docLabel, uploaded && styles.docLabelDone]}
            >
              {doc.label}
            </Text>
            <Feather
              name={uploaded ? 'check-circle' : 'upload-cloud'}
              size={22}
              color={uploaded ? Colors.success : Colors.gray400}
            />
          </TouchableOpacity>
        );
      })}

      {allDocsUploaded && (
        <View style={styles.buttonArea}>
          <Button variant="primary" size="lg" onPress={handleSubmit} icon="check-circle">
            S'inscrire
          </Button>
        </View>
      )}
    </>
  );

  const steps = [renderStep1, renderStep2, renderStep3, renderStep4];
  const current = STEPS[step - 1];
  const percent = Math.round(progressPercent);

  // ─── Render ───────────────────────────────────────────────
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
            {/* Warm radial glow */}
            <View style={styles.heroGlowWrap} pointerEvents="none">
              <LinearGradient
                colors={['rgba(244,184,81,0.55)', 'rgba(244,184,81,0)']}
                style={styles.heroGlow}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              />
            </View>
            {/* Secondary cool glow */}
            <View style={styles.heroGlowWrap2} pointerEvents="none">
              <LinearGradient
                colors={['rgba(150,170,255,0.25)', 'rgba(150,170,255,0)']}
                style={styles.heroGlow}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              />
            </View>

            <View style={styles.heroContent}>
              <View style={styles.heroTopRow}>
                <TouchableOpacity
                  onPress={goBack}
                  style={styles.heroBackBtn}
                  activeOpacity={0.7}
                >
                  <Feather name="arrow-left" size={18} color={Colors.white} />
                </TouchableOpacity>

                <View style={styles.heroDotsRow}>
                  {[1, 2, 3, 4].map((i) => (
                    <View
                      key={i}
                      style={[
                        styles.heroDot,
                        i < step && styles.heroDotDone,
                        i === step && styles.heroDotActive,
                      ]}
                    />
                  ))}
                </View>
              </View>

              <Text style={styles.heroEyebrow}>
                INSCRIPTION · ÉTAPE {step} SUR 4
              </Text>
              <Text style={styles.heroTitle}>{current.title}</Text>
              <Text style={styles.heroSubtitle}>{current.subtitle}</Text>

              {/* Progress chip */}
              <View style={styles.heroProgressChip}>
                <View style={styles.heroProgressNum}>
                  <Text style={styles.heroProgressNumText}>{step}</Text>
                </View>
                <View style={styles.heroProgressCol}>
                  <Text style={styles.heroProgressLabel}>{current.label}</Text>
                  <View style={styles.heroProgressBarTrack}>
                    <Animated.View
                      style={[
                        styles.heroProgressBarFill,
                        { width: progressWidth },
                      ]}
                    />
                  </View>
                </View>
                <Text style={styles.heroProgressPct}>{percent}%</Text>
              </View>
            </View>
          </View>

          {/* ─── Form card ───────────────────────────────── */}
          <View style={styles.formCard}>
            <Text style={styles.formCardLabel}>{current.label.toUpperCase()}</Text>
            {steps[step - 1]()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F4EF',
  },
  flex: {
    flex: 1,
  },

  // Scroll content
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.huge,
  },

  // ─── Hero card ────────────────────────────────────────
  heroCard: {
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    minHeight: 260,
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
  heroDotsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  heroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  heroDotDone: {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  heroDotActive: {
    width: 22,
    backgroundColor: '#F4B851',
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

  // Progress chip
  heroProgressChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroProgressNum: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F4B851',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroProgressNumText: {
    fontFamily: FontFamily.black,
    fontSize: 14,
    color: '#1A2752',
  },
  heroProgressCol: {
    flex: 1,
    gap: 6,
  },
  heroProgressLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: Colors.white,
  },
  heroProgressBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  heroProgressBarFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.white,
  },
  heroProgressPct: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.white,
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

  // Upload button
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    borderStyle: 'dashed',
    backgroundColor: '#FAFAF7',
    marginBottom: Spacing.lg,
  },
  uploadButtonDone: {
    borderColor: Colors.success,
    borderStyle: 'solid',
    backgroundColor: Colors.successSoft,
  },
  uploadText: {
    ...Typography.bodyMedium,
    color: Colors.navy,
  },
  uploadTextDone: {
    color: Colors.success,
  },

  // Checkboxes
  checkboxGroup: {
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
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

  // Documents
  docsCount: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.navy,
    marginBottom: Spacing.lg,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: Colors.navyTint,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#FAFAF7',
    borderWidth: 1,
    borderColor: Colors.gray100,
    marginBottom: Spacing.sm,
  },
  docCardDone: {
    backgroundColor: Colors.successSoft,
    borderColor: 'rgba(16,185,129,0.25)',
  },
  docIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconCircleDone: {
    backgroundColor: Colors.success,
  },
  docLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.black,
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.sm,
  },
  docLabelDone: {
    color: Colors.success,
  },

  // Button area
  buttonArea: {
    marginTop: Spacing.lg,
  },
});
