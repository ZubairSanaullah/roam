import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { radius } from "@/theme";

const cardVariants = {
  default:
    "bg-surface-white dark:bg-surface-elevated-dark border border-border-gray dark:border-border-dark",
  subtle:
    "bg-surface-gray dark:bg-surface-subtle-dark border border-border-gray dark:border-border-dark",
  lavender: "bg-lavender-tint dark:bg-lavender-tint-dark",
  glass:
    "bg-glass-blur dark:bg-glass-blur-dark border border-border-gray dark:border-border-dark",
} as const;

const cardPadding = {
  sm: "p-md",
  md: "p-base",
  lg: "p-lg",
} as const;

export type CardVariant = keyof typeof cardVariants;
export type CardPadding = keyof typeof cardPadding;

export interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  elevated?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Surface container enforcing Roam's card radii, continuous corners, and
 * optional restrained elevation.
 */
export function Card({
  children,
  variant = "default",
  padding = "md",
  elevated = false,
  className,
  style,
}: CardProps) {
  return (
    <View
      className={[
        "rounded-xl",
        cardVariants[variant],
        cardPadding[padding],
        elevated ? "shadow-card" : null,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={[
        {
          borderRadius: radius.xl,
          borderCurve: "continuous",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
