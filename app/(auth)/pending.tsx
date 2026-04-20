import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import Button from '../../components/ui/Button';

export default function PendingScreen() {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: -1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const rotateInterpolation = rotation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        {/* Animated icon */}
        <Animated.View
          style={[styles.iconCircle, { transform: [{ rotate: rotateInterpolation }] }]}
        >
          <Feather name="loader" size={56} color={Colors.navy} />
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>Demande envoyée !</Text>

        {/* Message */}
        <Text style={styles.message}>
          Votre inscription a bien été reçue. Notre équipe va examiner votre
          dossier dans les prochaines 24 à 48 heures.
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Vous recevrez une notification dès que votre compte sera validé.
        </Text>

        {/* Info card */}
        <View style={styles.infoCard}>
          <Feather name="mail" size={20} color={Colors.navy} />
          <Text style={styles.infoText}>
            En cas de question, contactez-nous à{' '}
            <Text style={styles.infoEmail}>contact@publeader.com</Text>
          </Text>
        </View>
      </View>

      {/* Bottom button */}
      <View style={styles.bottomArea}>
        <Button
          variant="outline"
          size="lg"
          icon="home"
          onPress={() => router.replace('/(auth)/welcome')}
        >
          Retour à l'accueil
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.navyTint,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxxl,
  },
  title: {
    ...Typography.h1,
    color: Colors.navy,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  message: {
    ...Typography.body,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.gray500,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    ...Shadows.sm,
  },
  infoText: {
    ...Typography.bodySmall,
    color: Colors.gray600,
    flex: 1,
  },
  infoEmail: {
    fontFamily: FontFamily.semiBold,
    color: Colors.navy,
  },
  bottomArea: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.huge,
  },
});
