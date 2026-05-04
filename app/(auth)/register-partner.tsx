import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { apiFetch } from '../../lib/fetcher';

export default function RegisterPartnerScreen() {
  const insets = useSafeAreaInsets();
  const [businessName, setBusinessName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!businessName.trim() || !managerName.trim() || !email.trim() ||
        !phone.trim() || !password || !address.trim() || !city.trim()) {
      Alert.alert('Erreur', 'Tous les champs obligatoires sont requis.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erreur', 'Mot de passe : 6 caractères minimum.');
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch('/api/register/partner', {
        method: 'POST',
        body: JSON.stringify({
          businessName: businessName.trim(),
          managerName: managerName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          address: address.trim(),
          city: city.trim(),
          openingHours: openingHours.trim() || undefined,
        }),
      });
      router.replace({
        pathname: '/(auth)/verify-email',
        params: { email: email.trim().toLowerCase() },
      });
    } catch (e: any) {
      Alert.alert('Inscription échouée', e?.message ?? 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + Spacing.lg }]}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color={Colors.navy} />
          </TouchableOpacity>

          <Text style={styles.title}>Inscription Partenaire</Text>
          <Text style={styles.subtitle}>
            Créez votre compte pour héberger une borne et générer des revenus.
          </Text>

          <Input label="Nom de l'établissement" placeholder="Club Neon" value={businessName} onChangeText={setBusinessName} icon="map-pin" />
          <Input label="Nom du gérant" placeholder="Yanis Haddad" value={managerName} onChangeText={setManagerName} icon="user" />
          <Input label="Email" placeholder="contact@clubneon.fr" value={email} onChangeText={setEmail} icon="mail" keyboardType="email-address" />
          <Input label="Téléphone" placeholder="+33 1 42 00 18 44" value={phone} onChangeText={setPhone} icon="phone" keyboardType="phone-pad" />
          <Input label="Mot de passe" placeholder="Minimum 6 caractères" value={password} onChangeText={setPassword} icon="lock" secureTextEntry />
          <Input label="Adresse" placeholder="18 rue Montorgueil" value={address} onChangeText={setAddress} icon="map" />
          <Input label="Ville" placeholder="Paris" value={city} onChangeText={setCity} icon="map-pin" />
          <Input label="Horaires d'ouverture" placeholder="20h - 4h" value={openingHours} onChangeText={setOpeningHours} icon="clock" />

          <View style={{ marginTop: Spacing.lg }}>
            <Button variant="primary" size="lg" loading={submitting} onPress={handleSubmit}>
              S'inscrire
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.white },
  scroll: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.huge },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.navyTint,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: { ...Typography.h1, color: Colors.navy, marginBottom: Spacing.sm },
  subtitle: { ...Typography.body, color: Colors.gray500, marginBottom: Spacing.xl },
});
