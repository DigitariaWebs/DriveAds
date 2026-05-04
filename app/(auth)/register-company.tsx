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

export default function RegisterCompanyScreen() {
  const insets = useSafeAreaInsets();
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [sector, setSector] = useState('');
  const [city, setCity] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!companyName.trim() || !contactName.trim() || !email.trim() ||
        !phone.trim() || !password || !domain.trim() ||
        !sector.trim() || !city.trim()) {
      Alert.alert('Erreur', 'Tous les champs obligatoires sont requis.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erreur', 'Mot de passe : 6 caractères minimum.');
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch('/api/register/company', {
        method: 'POST',
        body: JSON.stringify({
          companyName: companyName.trim(),
          contactName: contactName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          domain: domain.trim(),
          sector: sector.trim(),
          city: city.trim(),
          website: website.trim() || undefined,
          description: description.trim() || undefined,
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

          <Text style={styles.title}>Inscription Annonceur</Text>
          <Text style={styles.subtitle}>
            Créez votre compte entreprise pour lancer des campagnes publicitaires.
          </Text>

          <Input label="Nom de l'entreprise" placeholder="Acme Corp" value={companyName} onChangeText={setCompanyName} icon="briefcase" />
          <Input label="Nom du contact" placeholder="Jean Dupont" value={contactName} onChangeText={setContactName} icon="user" />
          <Input label="Email" placeholder="contact@acme.com" value={email} onChangeText={setEmail} icon="mail" keyboardType="email-address" />
          <Input label="Téléphone" placeholder="+33 1 23 45 67 89" value={phone} onChangeText={setPhone} icon="phone" keyboardType="phone-pad" />
          <Input label="Mot de passe" placeholder="Minimum 6 caractères" value={password} onChangeText={setPassword} icon="lock" secureTextEntry />
          <Input label="Domaine" placeholder="Restauration, Mode, Automobile…" value={domain} onChangeText={setDomain} icon="tag" />
          <Input label="Secteur" placeholder="B2C, B2B…" value={sector} onChangeText={setSector} icon="layers" />
          <Input label="Ville" placeholder="Paris" value={city} onChangeText={setCity} icon="map-pin" />
          <Input label="Site web (optionnel)" placeholder="https://acme.com" value={website} onChangeText={setWebsite} icon="globe" />
          <Input label="Description (optionnel)" placeholder="Décrivez votre activité" value={description} onChangeText={setDescription} icon="file-text" />

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
