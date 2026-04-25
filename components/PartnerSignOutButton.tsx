import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { FontFamily } from '../constants/Typography';
import { useAuth } from '../context/AuthContext';

type Props = {
  tone?: 'light' | 'dark';
};

export default function PartnerSignOutButton({ tone = 'dark' }: Props) {
  const { logout } = useAuth();
  const light = tone === 'light';

  const handlePress = () => {
    logout().then(() => router.replace('/(auth)/welcome'));
  };

  return (
    <TouchableOpacity
      style={[styles.button, light ? styles.lightButton : styles.darkButton]}
      onPress={handlePress}
      activeOpacity={0.75}
      hitSlop={8}
    >
      <Feather
        name="log-out"
        size={15}
        color={light ? Colors.white : Colors.danger}
      />
      <Text style={[styles.label, light ? styles.lightLabel : styles.darkLabel]}>
        Sortir
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 38,
    borderRadius: 13,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  lightButton: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  darkButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.dangerSoft,
  },
  label: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
  },
  lightLabel: {
    color: Colors.white,
  },
  darkLabel: {
    color: Colors.danger,
  },
});
