import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Props = {
  focused: boolean;
  icon: keyof typeof Feather.glyphMap;
};

export default function TabIcon({ focused, icon }: Props) {
  return (
    <View style={styles.container}>
      <Feather
        name={icon}
        size={22}
        color={focused ? '#FFFFFF' : 'rgba(255,255,255,0.45)'}
      />
      {focused && <View style={styles.dot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
});
