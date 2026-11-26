import { Text, type TextProps } from "react-native";

export type RoamLogoSize = "lg" | "md";

export interface RoamLogoProps extends Omit<TextProps, "children"> {
  size?: RoamLogoSize;
  className?: string;
}

const sizeClasses: Record<RoamLogoSize, string> = {
  lg: "type-wordmark",
  md: "type-brand",
};

/**
 * Pure typography lowercase wordmark for Roam using Plus Jakarta Sans ExtraBold
 * with tight geometric tracking.
 */
export function RoamLogo({
  size = "lg",
  className,
  style,
  accessibilityRole = "header",
  accessibilityLabel = "roam",
  ...props
}: RoamLogoProps) {
  return (
    <Text
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      maxFontSizeMultiplier={1.2}
      className={[
        sizeClasses[size],
        "text-text-primary dark:text-text-primary-dark",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={[{ includeFontPadding: false }, style]}
      {...props}
    >
      roam
    </Text>
  );
}
