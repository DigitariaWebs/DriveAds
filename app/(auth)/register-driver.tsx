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

const STEP_LABELS = [
  'Identité',
  'Véhicule',
  'Sécurité',
  'Documents',
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

  // ─── Render ───────────────────────────────────────────────
  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={Colors.navy} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.stepLabel}>
            Étape {step}/4 · {STEP_LABELS[step - 1]}
          </Text>
        </View>
        <View style={styles.backBtn} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      {/* Content */}
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
          {steps[step - 1]()}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  stepLabel: {
    ...Typography.bodyMedium,
    color: Colors.navy,
  },

  // Progress
  progressTrack: {
    height: 4,
    backgroundColor: Colors.gray200,
    marginHorizontal: Spacing.xl,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.navy,
    borderRadius: 2,
  },

  // Scroll content
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
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
    ...Typography.bodySmall,
    fontFamily: FontFamily.semiBold,
    color: Colors.navy,
  },

  // Upload button
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    borderStyle: 'dashed',
    backgroundColor: Colors.white,
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
    ...Typography.bodyMedium,
    color: Colors.navy,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  docCardDone: {
    backgroundColor: Colors.successSoft,
  },
  docIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconCircleDone: {
    backgroundColor: Colors.success,
  },
  docLabel: {
    ...Typography.bodyMedium,
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
    marginTop: Spacing.xl,
  },
});
