import { View, type StyleProp, type ViewStyle } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { radius } from "@/theme";
import { AppIcon, type AppIconTone } from "./app-icon";
import { AppText, type AppTextTone } from "./app-text";

const badgeVariants = {
  yellow: {
    container: "bg-badge-yellow-bg dark:bg-badge-yellow-bg-dark",
    textTone: "primary" as AppTextTone,
    iconTone: "warning" as AppIconTone,
  },
  success: {
    container: "bg-success-bg dark:bg-success-bg-dark",
    textTone: "success" as AppTextTone,
    iconTone: "success" as AppIconTone,
  },
  promo: {
    container: "bg-badge-promo-bg dark:bg-badge-promo-bg-dark",
    textTone: "primary" as AppTextTone,
    iconTone: "primary" as AppIconTone,
  },
  info: {
    container: "bg-badge-info-bg dark:bg-badge-info-bg-dark",
    textTone: "primary" as AppTextTone,
    iconTone: "primary" as AppIconTone,
  },
  neutral: {
    container:
      "bg-surface-gray dark:bg-surface-subtle-dark border border-border-gray dark:border-border-dark",
    textTone: "primary" as AppTextTone,
    iconTone: "primary" as AppIconTone,
  },
} as const;

export type BadgeVariant = keyof typeof badgeVariants;

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: LucideIcon;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Compact pill tag for status labels and stay highlights (Guest favorite, New,
 * promo discounts, Superhost).
 */
export function Badge({
  label,
  variant = "neutral",
  icon,
  className,
  style,
}: BadgeProps) {
  const styles = badgeVariants[variant];

  return (
    <View
      className={[
        "flex-row items-center gap-xs self-start rounded-full px-md py-xs",
        styles.container,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={[{ borderRadius: radius.full }, style]}
    >
      {icon ? <AppIcon icon={icon} size="sm" tone={styles.iconTone} /> : null}
      <AppText variant="label" tone={styles.textTone} className="font-sans-medium">
        {label}
      </AppText>
    </View>
  );
}
