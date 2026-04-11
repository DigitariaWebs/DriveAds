module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#233466',
          light: '#2d4382',
          dark: '#1a2752',
        },
        accent: {
          DEFAULT: '#00C2FF',
          light: '#33d1ff',
          dark: '#00a3d6',
        },
        gradient: {
          start: '#233466',
          end: '#4A6CF7',
        },
        background: '#F5F7FA',
        foreground: '#1A1F36',
      },
      fontFamily: {
        poppins: ['Poppins_400Regular'],
        'poppins-medium': ['Poppins_500Medium'],
        'poppins-semibold': ['Poppins_600SemiBold'],
        'poppins-bold': ['Poppins_700Bold'],
        'poppins-black': ['Poppins_800ExtraBold'],
      },
    },
  },
  plugins: [],
}
