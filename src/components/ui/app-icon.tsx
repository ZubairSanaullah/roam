import type { LucideIcon } from "lucide-react-native";
import { iconSizes, useThemeColors, type ThemeColors } from "@/theme";

export type AppIconSize = keyof typeof iconSizes | number;
export type AppIconTone =
  | "primary"
  | "secondary"
  | "inverse"
  | "onAccent"
  | "lavender"
  | "success"
  | "error"
  | "warning";

export interface AppIconProps {
  icon: LucideIcon;
  size?: AppIconSize;
  tone?: AppIconTone;
  color?: string;
  strokeWidth?: number;
}

function resolveToneColor(colors: ThemeColors, tone: AppIconTone): string {
  switch (tone) {
    case "primary":
      return colors.textPrimary;
    case "secondary":
      return colors.textSecondary;
    case "inverse":
      return colors.textInverse;
    case "onAccent":
      return colors.onPrimary;
    case "lavender":
      return colors.lavenderAccent;
    case "success":
      return colors.successFg;
    case "error":
      return colors.errorFg;
    case "warning":
      return colors.primary;
  }
}

/**
 * Renders a Lucide vector icon with tokened size and semantic light/dark color.
 */
export function AppIcon({
  icon: Icon,
  size = "md",
  tone = "primary",
  color,
  strokeWidth = 1.85,
}: AppIconProps) {
  const colors = useThemeColors();
  const resolvedSize = typeof size === "number" ? size : iconSizes[size];
  const resolvedColor = color ?? resolveToneColor(colors, tone);

  return <Icon size={resolvedSize} color={resolvedColor} strokeWidth={strokeWidth} />;
}
