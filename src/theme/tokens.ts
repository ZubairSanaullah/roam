/**
 * Static design tokens mirroring `global.css` for React Native APIs that require
 * numeric or string props instead of `className` (navigation headers, SVG icons,
 * borderCurve, boxShadow).
 */

export const fontFamilies = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  display: "PlusJakartaSans_700Bold",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  full: 9999,
} as const;

export const shadows = {
  card: "0 2px 8px rgba(11, 11, 26, 0.06)",
  raised: "0 6px 18px rgba(11, 11, 26, 0.10)",
  glass: "0 8px 24px rgba(11, 11, 26, 0.12)",
} as const;

export const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;
