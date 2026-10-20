export const Colors = {
  // Backgrounds
  background: '#090D16',       // Deep obsidian
  backgroundElevated: '#111827', // Rich dark surface
  surface: '#1E293B',          // Card surface
  surfaceLight: '#27354A',     // Hover / active item
  surfaceBorder: 'rgba(255, 255, 255, 0.08)',
  surfaceBorderHover: 'rgba(255, 255, 255, 0.16)',

  // Brand Accents
  primary: '#6366F1',          // Indigo vibrant
  primaryLight: '#818CF8',
  primaryGlow: 'rgba(99, 102, 241, 0.25)',
  secondary: '#38BDF8',        // Sky blue
  
  // Financial Semantics
  income: '#10B981',           // Emerald green
  incomeLight: '#34D399',
  incomeGlow: 'rgba(16, 185, 129, 0.2)',
  expense: '#F43F5E',          // Vibrant Rose
  expenseLight: '#FB7185',
  expenseGlow: 'rgba(244, 63, 94, 0.2)',
  transfer: '#F59E0B',         // Warm Amber
  transferLight: '#FBBF24',
  
  // Neutrals / Typography
  textPrimary: '#F8FAFC',      // Pure bright text
  textSecondary: '#94A3B8',    // Muted slate
  textTertiary: '#64748B',     // Subdued text
  divider: '#1E293B',
  
  // Statuses
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Preset Colors for Category & Wallet Customization
  presetPalette: [
    '#6366F1', // Indigo
    '#EC4899', // Pink
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#14B8A6', // Teal
    '#F97316', // Orange
    '#84CC16', // Lime
    '#A855F7', // Violet
  ],
};

export const Typography = {
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    xxl: 26,
    hero: 32,
    giant: 40,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  hero: 32,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};
