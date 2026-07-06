export type ThemeMode = 'light' | 'dark';

export const colors = {
  accent: '#7c3aed',
  accentMuted: '#ede9fe',
  accentLight: '#a78bfa',
  bgPrimary: '#0f172a',
  bgSecondary: '#111827',
  bgCard: '#1f2937',
  bgElevated: '#273449',
  bgInput: '#334155',
  textPrimary: '#f8fafc',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  textBody: '#e2e8f0',
  textOnPrimary: '#ffffff',
  border: '#334155',
  accentBorder: '#8b5cf6',
  overlay: 'rgba(2, 6, 23, 0.72)',
  error: '#f87171',
  videoBg: '#0b1120',
  videoProgress: '#38bdf8',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const typography = {
  fontFamily: 'Vazirmatn',
  fontFamilyRegular: 'Vazirmatn_400Regular',
  fontFamilyMedium: 'Vazirmatn_500Medium',
  fontFamilySemibold: 'Vazirmatn_600SemiBold',
  fontFamilyBold: 'Vazirmatn_700Bold',
};

export function getThemeColors(mode: ThemeMode) {
  if (mode === 'light') {
    return {
      accent: '#7c3aed',
      accentMuted: '#f5f3ff',
      accentLight: '#8b5cf6',
      bgPrimary: '#ffffff',
      bgSecondary: '#f8fafc',
      bgCard: '#ffffff',
      bgElevated: '#f8fafc',
      bgInput: '#f1f5f9',
      textPrimary: '#0f172a',
      textSecondary: '#334155',
      textMuted: '#64748b',
      textBody: '#475569',
      textOnPrimary: '#ffffff',
      border: '#e2e8f0',
      accentBorder: '#c4b5fd',
      overlay: 'rgba(15, 23, 42, 0.55)',
      error: '#dc2626',
      videoBg: '#f8fafc',
      videoProgress: '#7c3aed',
    };
  }

  return colors;
}
