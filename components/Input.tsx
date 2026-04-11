import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS } from '../constants/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
  label,
  error,
  icon,
  secureTextEntry,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(!secureTextEntry);

  const borderColor = error
    ? COLORS.danger
    : focused
      ? COLORS.navy
      : COLORS.gray200;

  return (
    <View style={[{ marginBottom: 14 }, containerStyle]}>
      {label && (
        <Text
          style={{
            fontFamily: FONTS.semibold,
            fontSize: 13,
            color: COLORS.gray700,
            marginBottom: 8,
            marginLeft: 4,
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.white,
          borderRadius: RADIUS.lg,
          borderWidth: 1.5,
          borderColor,
          paddingHorizontal: 16,
          minHeight: 56,
        }}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={focused ? COLORS.navy : COLORS.gray400}
            style={{ marginRight: 12 }}
          />
        )}
        <TextInput
          {...props}
          secureTextEntry={secureTextEntry && !visible}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          placeholderTextColor={COLORS.gray400}
          style={{
            flex: 1,
            fontFamily: FONTS.medium,
            fontSize: 15,
            color: COLORS.navy,
            paddingVertical: 14,
          }}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setVisible((v) => !v)}
            hitSlop={10}
            style={{ marginLeft: 8 }}
          >
            <Ionicons
              name={visible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.gray400}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text
          style={{
            fontFamily: FONTS.medium,
            fontSize: 12,
            color: COLORS.danger,
            marginTop: 6,
            marginLeft: 4,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
