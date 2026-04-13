import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardTypeOptions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius } from '../../constants/Spacing';

type Props = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  icon?: keyof typeof Feather.glyphMap;
  secureTextEntry?: boolean;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
};

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  icon,
  secureTextEntry = false,
  multiline = false,
  keyboardType,
}: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);

  const borderColor = error
    ? Colors.danger
    : focused
      ? Colors.navy
      : Colors.gray200;

  const bgColor = error ? Colors.dangerSoft : Colors.white;

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.container,
          { borderColor, backgroundColor: bgColor },
          multiline && styles.multiline,
        ]}
      >
        {icon && (
          <Feather
            name={icon}
            size={16}
            color={error ? Colors.danger : focused ? Colors.navy : Colors.gray400}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          placeholder={placeholder}
          placeholderTextColor={Colors.gray400}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidden}
          multiline={multiline}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setHidden(!hidden)} style={styles.eyeButton}>
            <Feather
              name={hidden ? 'eye-off' : 'eye'}
              size={16}
              color={Colors.gray400}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.caption,
    color: Colors.gray600,
    marginBottom: Spacing.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.md,
    height: 40,
    paddingHorizontal: Spacing.md,
  },
  multiline: {
    height: undefined,
    minHeight: 80,
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.black,
  },
  multilineInput: {
    textAlignVertical: 'top',
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  error: {
    ...Typography.bodySmall,
    color: Colors.danger,
    marginTop: Spacing.xs,
  },
});
