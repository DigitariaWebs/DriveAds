import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { AppLogo } from '../../components/AppLogo';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../constants/theme';

interface RegisterScreenProps {
  onComplete: () => void;
  onBackToLogin: () => void;
}

type StepKey = 'identity' | 'vehicle' | 'security' | 'documents' | 'analysis';

const STEP_ORDER: StepKey[] = ['identity', 'vehicle', 'security', 'documents'];

type DocKey = 'license' | 'registration' | 'insurance' | 'vehiclePhoto';

const DOCUMENTS: {
  key: DocKey;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}[] = [
  {
    key: 'license',
    icon: 'card-outline',
    title: 'Permis de conduire',
    subtitle: 'Recto et verso · PDF ou image',
  },
  {
    key: 'registration',
    icon: 'document-text-outline',
    title: 'Carte grise',
    subtitle: 'Document à votre nom',
  },
  {
    key: 'insurance',
    icon: 'shield-checkmark-outline',
    title: 'Assurance véhicule',
    subtitle: 'Attestation en cours de validité',
  },
  {
    key: 'vehiclePhoto',
    icon: 'camera-outline',
    title: 'Photo du véhicule',
    subtitle: '4 angles : avant, arrière, côtés',
  },
];

export function RegisterScreen({ onComplete, onBackToLogin }: RegisterScreenProps) {
  const [step, setStep] = useState<StepKey>('identity');

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [year, setYear] = useState('');
  const [plate, setPlate] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [acceptCgu, setAcceptCgu] = useState(false);
  const [docs, setDocs] = useState<Record<DocKey, boolean>>({
    license: false,
    registration: false,
    insurance: false,
    vehiclePhoto: false,
  });

  const stepIndex = STEP_ORDER.indexOf(step);
  const totalSteps = STEP_ORDER.length;

  const validateStep = (): string | null => {
    if (step === 'identity') {
      if (!firstName || !lastName || !email || !phone)
        return 'Merci de remplir tous les champs.';
    }
    if (step === 'vehicle') {
      if (!city || !vehicle || !year || !plate)
        return 'Merci de remplir tous les champs.';
    }
    if (step === 'security') {
      if (!password || !confirm) return 'Merci de saisir le mot de passe.';
      if (password !== confirm)
        return 'Les deux mots de passe ne correspondent pas.';
      if (!acceptCgu)
        return "Vous devez accepter les conditions d'utilisation.";
    }
    if (step === 'documents') {
      const allUploaded = Object.values(docs).every(Boolean);
      if (!allUploaded)
        return 'Téléchargez tous les documents avant de continuer.';
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) {
      Alert.alert('Champs manquants', err);
      return;
    }
    if (step === 'documents') {
      setStep('analysis');
      // Simulate analysis
      setTimeout(() => {
        Alert.alert(
          'Documents soumis 📋',
          'Vos documents sont en cours d\'analyse. Vous recevrez une notification sous 24h.',
          [{ text: 'Continuer', onPress: onComplete }]
        );
      }, 2400);
      return;
    }
    setStep(STEP_ORDER[stepIndex + 1]);
  };

  const handleBack = () => {
    if (step === 'analysis') return;
    if (stepIndex === 0) {
      onBackToLogin();
      return;
    }
    setStep(STEP_ORDER[stepIndex - 1]);
  };

  const toggleDoc = (key: DocKey) => {
    setDocs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (step === 'analysis') {
    return (
      <Screen>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 40,
          }}
        >
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: COLORS.navySoft,
              alignItems: 'center',
              justifyContent: 'center',
              ...SHADOWS.lg,
            }}
          >
            <Ionicons name="scan" size={56} color={COLORS.navy} />
          </View>
          <Text
            style={{
              fontFamily: FONTS.black,
              fontSize: 22,
              color: COLORS.navy,
              marginTop: 28,
              textAlign: 'center',
              letterSpacing: -0.4,
            }}
          >
            Analyse en cours…
          </Text>
          <Text
            style={{
              fontFamily: FONTS.regular,
              fontSize: 14,
              color: COLORS.gray500,
              marginTop: 8,
              textAlign: 'center',
              lineHeight: 21,
            }}
          >
            Nos équipes vérifient vos documents.{'\n'}Cela ne prendra qu'un instant.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      {/* Top bar with back */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 4,
        }}
      >
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={12}
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: COLORS.navySoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="chevron-back" size={20} color={COLORS.navy} />
        </TouchableOpacity>
        <AppLogo size="md" />
        <View style={{ width: 42 }} />
      </View>

      {/* Step indicator */}
      <View style={{ paddingHorizontal: 24, marginTop: 14, marginBottom: 14 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.semibold,
              fontSize: 11,
              color: COLORS.gray500,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Étape {stepIndex + 1} sur {totalSteps}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 11,
              color: COLORS.navy,
            }}
          >
            {Math.round(((stepIndex + 1) / totalSteps) * 100)}%
          </Text>
        </View>
        <View
          style={{
            height: 6,
            backgroundColor: COLORS.gray100,
            borderRadius: RADIUS.full,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: `${((stepIndex + 1) / totalSteps) * 100}%`,
              height: '100%',
              backgroundColor: COLORS.navy,
              borderRadius: RADIUS.full,
            }}
          />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Step title */}
          <View style={{ paddingHorizontal: 24, marginBottom: 18 }}>
            <Text
              style={{
                fontFamily: FONTS.black,
                fontSize: 26,
                color: COLORS.navy,
                letterSpacing: -0.4,
              }}
            >
              {step === 'identity' && 'Vos informations'}
              {step === 'vehicle' && 'Votre véhicule'}
              {step === 'security' && 'Sécurité du compte'}
              {step === 'documents' && 'Vos documents'}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.regular,
                fontSize: 14,
                color: COLORS.gray500,
                marginTop: 4,
              }}
            >
              {step === 'identity' && 'Présentez-vous en quelques mots'}
              {step === 'vehicle' && "Le véhicule qui portera l'annonce"}
              {step === 'security' && 'Choisissez un mot de passe sécurisé'}
              {step === 'documents' && 'Téléchargez vos pièces justificatives'}
            </Text>
          </View>

          {/* Step content */}
          <View style={{ paddingHorizontal: 24 }}>
            {step === 'identity' && (
              <>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Input
                      label="Prénom"
                      placeholder="Marie"
                      value={firstName}
                      onChangeText={setFirstName}
                      icon="person-outline"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input
                      label="Nom"
                      placeholder="Dubois"
                      value={lastName}
                      onChangeText={setLastName}
                      icon="person-outline"
                    />
                  </View>
                </View>
                <Input
                  label="Email"
                  placeholder="marie@example.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  icon="mail-outline"
                />
                <Input
                  label="Téléphone"
                  placeholder="06 12 34 56 78"
                  value={phone}
                  onChangeText={setPhone}
                  icon="call-outline"
                />
              </>
            )}

            {step === 'vehicle' && (
              <>
                <Input
                  label="Ville"
                  placeholder="Paris"
                  value={city}
                  onChangeText={setCity}
                  icon="location-outline"
                />
                <Input
                  label="Modèle"
                  placeholder="Peugeot 308"
                  value={vehicle}
                  onChangeText={setVehicle}
                  icon="car-outline"
                />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Input
                      label="Année"
                      placeholder="2022"
                      value={year}
                      onChangeText={setYear}
                      icon="calendar-outline"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input
                      label="Plaque"
                      placeholder="AB-123-CD"
                      value={plate}
                      onChangeText={setPlate}
                      autoCapitalize="characters"
                      icon="pricetag-outline"
                    />
                  </View>
                </View>
              </>
            )}

            {step === 'security' && (
              <>
                <Input
                  label="Mot de passe"
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  icon="lock-closed-outline"
                />
                <Input
                  label="Confirmer le mot de passe"
                  placeholder="••••••••"
                  value={confirm}
                  onChangeText={setConfirm}
                  secureTextEntry
                  icon="lock-closed-outline"
                />

                <TouchableOpacity
                  onPress={() => setAcceptCgu(!acceptCgu)}
                  activeOpacity={0.85}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 6,
                    paddingVertical: 4,
                  }}
                >
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      borderWidth: 2,
                      borderColor: acceptCgu ? COLORS.navy : COLORS.gray300,
                      backgroundColor: acceptCgu ? COLORS.navy : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {acceptCgu && (
                      <Ionicons name="checkmark" size={14} color={COLORS.white} />
                    )}
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      fontFamily: FONTS.regular,
                      fontSize: 12,
                      color: COLORS.gray600,
                      lineHeight: 18,
                    }}
                  >
                    J'accepte les{' '}
                    <Text style={{ fontFamily: FONTS.bold, color: COLORS.navy }}>
                      conditions d'utilisation
                    </Text>{' '}
                    et la{' '}
                    <Text style={{ fontFamily: FONTS.bold, color: COLORS.navy }}>
                      politique de confidentialité
                    </Text>
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {step === 'documents' && (
              <View style={{ gap: 12 }}>
                {DOCUMENTS.map((doc) => {
                  const uploaded = docs[doc.key];
                  return (
                    <TouchableOpacity
                      key={doc.key}
                      activeOpacity={0.85}
                      onPress={() => toggleDoc(doc.key)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: COLORS.white,
                        borderRadius: RADIUS.xl,
                        padding: 16,
                        borderWidth: 1.5,
                        borderColor: uploaded ? COLORS.success : COLORS.gray100,
                        ...SHADOWS.sm,
                      }}
                    >
                      <View
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 26,
                          backgroundColor: uploaded
                            ? COLORS.successSoft
                            : COLORS.navySoft,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Ionicons
                          name={uploaded ? 'checkmark-circle' : doc.icon}
                          size={26}
                          color={uploaded ? COLORS.success : COLORS.navy}
                        />
                      </View>
                      <View style={{ flex: 1, marginLeft: 14 }}>
                        <Text
                          style={{
                            fontFamily: FONTS.bold,
                            fontSize: 14,
                            color: COLORS.navy,
                          }}
                        >
                          {doc.title}
                        </Text>
                        <Text
                          style={{
                            fontFamily: FONTS.regular,
                            fontSize: 12,
                            color: COLORS.gray500,
                            marginTop: 2,
                          }}
                        >
                          {doc.subtitle}
                        </Text>
                      </View>
                      <View
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: RADIUS.full,
                          backgroundColor: uploaded
                            ? COLORS.success
                            : COLORS.navy,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: FONTS.bold,
                            fontSize: 11,
                            color: COLORS.white,
                          }}
                        >
                          {uploaded ? 'AJOUTÉ' : 'AJOUTER'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* CTA */}
            <View style={{ marginTop: 24 }}>
              <Button
                fullWidth
                size="lg"
                onPress={handleNext}
                icon={step === 'documents' ? 'cloud-upload' : 'arrow-forward'}
                iconPosition="right"
              >
                {step === 'documents' ? 'Soumettre' : 'Continuer'}
              </Button>
            </View>

            {/* Login link only on first step */}
            {step === 'identity' && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 18,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.regular,
                    fontSize: 14,
                    color: COLORS.gray500,
                  }}
                >
                  Déjà inscrit ?{' '}
                </Text>
                <TouchableOpacity onPress={onBackToLogin} hitSlop={8}>
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 14,
                      color: COLORS.navy,
                    }}
                  >
                    Se connecter
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
