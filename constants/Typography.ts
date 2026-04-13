import { TextStyle } from 'react-native';

// Font family mapping for Poppins weights
export const FontFamily = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  extraBold: 'Poppins_800ExtraBold',
  black: 'Poppins_900Black',
} as const;

// Typography presets — compact scale
export const Typography: Record<string, TextStyle> = {
  displayLarge: {
    fontFamily: FontFamily.black,
    fontSize: 28,
    lineHeight: 34,
  },
  display: {
    fontFamily: FontFamily.black,
    fontSize: 24,
    lineHeight: 30,
  },
  h1: {
    fontFamily: FontFamily.black,
    fontSize: 20,
    lineHeight: 26,
  },
  h2: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    lineHeight: 22,
  },
  h3: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  bodyMedium: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    lineHeight: 19,
  },
  bodySmall: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  caption: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    lineHeight: 14,
  },
  captionUpper: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    lineHeight: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  button: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    lineHeight: 19,
  },
  buttonSmall: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    lineHeight: 16,
  },
} as const;
