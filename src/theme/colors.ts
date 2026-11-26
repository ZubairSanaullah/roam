import { useColorScheme } from "react-native";

/**
 * Exact light-mode palette from the Roam design reference plus derived
 * dark-mode and semantic/status tokens. Mirrors `global.css` for React Native
 * props that do not accept `className` (icons, TextInput placeholders, headers).
 */
export const palette = {
  // Reference palette (02. Color palette)
  primaryYellow: "#FFC629",
  lavender: "#C9B4FF",
  textPrimary: "#0B0B1A",
  textSecondary: "#6B7280",
  surfaceWhite: "#FFFFFF",
  surfaceGray: "#F4F5F7",
  borderGray: "#E5E7EB",
  glassBlur: "rgba(255, 255, 255, 0.7)",

  // Derived dark surfaces & text
  surfaceDark: "#0B0B1A",
  surfaceElevatedDark: "#151528",
  surfaceSubtleDark: "#1F1F36",
  borderDark: "#2D2D48",
  textPrimaryDark: "#F9FAFB",
  textSecondaryDark: "#9CA3AF",
  glassBlurDark: "rgba(11, 11, 26, 0.72)",

  // Semantic & component tints
  lavenderTint: "#EFEAFF",
  lavenderTintDark: "#241E42",
  lavenderAccent: "#6D4AFF",
  lavenderIndicator: "#9E82FF",
  lavenderBadge: "#E4DAFF",
  lavenderBadgeDark: "#32285C",
  overlayBorder: "rgba(255, 255, 255, 0.28)",
  topScrim: "rgba(255, 255, 255, 0.88)",
  topScrimDark: "rgba(11, 11, 26, 0.85)",

  successBg: "#DCFCE7",
  successFg: "#15803D",
  successBgDark: "#123121",
  successFgDark: "#4ADE80",

  errorBg: "#FEE2E2",
  errorFg: "#DC2626",
  errorBgDark: "#351418",
  errorFgDark: "#F87171",

  badgeYellowBg: "#FEF3C7",
  badgeYellowBgDark: "#332911",
  badgeYellowFgDark: "#FDE68A",

  badgeInfoBg: "#DBEAFE",
  badgeInfoFg: "#1D4ED8",
  badgeInfoBgDark: "#172554",
  badgeInfoFgDark: "#93C5FD",

  badgePromoBg: "#FCE7F3",
  badgePromoFg: "#9D174D",
  badgePromoBgDark: "#3B1226",
  badgePromoFgDark: "#F9A8D4",

  // Third-party auth brand mark (Google G)
  googleBlue: "#4285F4",
  googleGreen: "#34A853",
  googleYellow: "#FBBC05",
  googleRed: "#EA4335",
} as const;

export const semanticColors = {
  light: {
    appBackground: palette.surfaceGray,
    surface: palette.surfaceWhite,
    surfaceSubtle: palette.surfaceGray,
    border: palette.borderGray,
    textPrimary: palette.textPrimary,
    textSecondary: palette.textSecondary,
    textInverse: palette.surfaceWhite,
    onOverlay: palette.surfaceWhite,
    primary: palette.primaryYellow,
    onPrimary: palette.textPrimary,
    lavender: palette.lavender,
    onLavender: palette.textPrimary,
    lavenderTint: palette.lavenderTint,
    lavenderAccent: palette.lavenderAccent,
    lavenderIndicator: palette.lavenderIndicator,
    lavenderBadge: palette.lavenderBadge,
    glass: palette.glassBlur,
    glassDark: palette.glassBlurDark,
    overlayBorder: palette.overlayBorder,
    topScrim: palette.topScrim,
    successBg: palette.successBg,
    successFg: palette.successFg,
    errorBg: palette.errorBg,
    errorFg: palette.errorFg,
    badgeYellowBg: palette.badgeYellowBg,
    badgeYellowFg: palette.textPrimary,
    badgeInfoBg: palette.badgeInfoBg,
    badgeInfoFg: palette.badgeInfoFg,
    badgePromoBg: palette.badgePromoBg,
    badgePromoFg: palette.badgePromoFg,
  },
  dark: {
    appBackground: palette.surfaceDark,
    surface: palette.surfaceElevatedDark,
    surfaceSubtle: palette.surfaceSubtleDark,
    border: palette.borderDark,
    textPrimary: palette.textPrimaryDark,
    textSecondary: palette.textSecondaryDark,
    textInverse: palette.textPrimary,
    onOverlay: palette.surfaceWhite,
    primary: palette.primaryYellow,
    onPrimary: palette.textPrimary,
    lavender: palette.lavender,
    onLavender: palette.textPrimary,
    lavenderTint: palette.lavenderTintDark,
    lavenderAccent: palette.lavender,
    lavenderIndicator: palette.lavender,
    lavenderBadge: palette.lavenderBadgeDark,
    glass: palette.glassBlurDark,
    glassDark: palette.glassBlurDark,
    overlayBorder: palette.overlayBorder,
    topScrim: palette.topScrimDark,
    successBg: palette.successBgDark,
    successFg: palette.successFgDark,
    errorBg: palette.errorBgDark,
    errorFg: palette.errorFgDark,
    badgeYellowBg: palette.badgeYellowBgDark,
    badgeYellowFg: palette.badgeYellowFgDark,
    badgeInfoBg: palette.badgeInfoBgDark,
    badgeInfoFg: palette.badgeInfoFgDark,
    badgePromoBg: palette.badgePromoBgDark,
    badgePromoFg: palette.badgePromoFgDark,
  },
} as const;

export type ThemeColors = (typeof semanticColors)["light"] | (typeof semanticColors)["dark"];

/**
 * Returns light or dark semantic colors based on the active OS color scheme.
 */
export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme();
  return semanticColors[scheme === "dark" ? "dark" : "light"];
}
