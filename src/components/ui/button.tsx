import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { radius, useThemeColors } from "@/theme";
import { AppIcon } from "./app-icon";
import { AppText } from "./app-text";

const variantContainerClasses = {
  primary: "bg-primary-yellow",
  secondary:
    "bg-surface-white dark:bg-surface-elevated-dark border border-border-gray dark:border-border-dark",
  subtle: "bg-surface-gray dark:bg-surface-subtle-dark",
  lavender: "bg-lavender",
  ghost: "bg-transparent",
} as const;

const sizeClasses = {
  sm: "min-h-11 px-base",
  md: "min-h-12 px-xl",
  lg: "min-h-14 px-xl",
} as const;

const iconOnlySizeClasses = {
  sm: "w-11 h-11",
  md: "w-12 h-12",
  lg: "w-14 h-14",
} as const;

export type ButtonVariant = keyof typeof variantContainerClasses;
export type ButtonSize = keyof typeof sizeClasses;

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  title?: string;
  leftIcon?: LucideIcon;
  leftElement?: ReactNode;
  rightIcon?: LucideIcon;
  rightIconAlign?: "inline" | "end";
  iconOnly?: boolean;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

/**
 * Pill button primitive supporting primary yellow, secondary outlined, subtle
 * gray, lavender, ghost, and circular icon-only actions.
 */
export function Button({
  variant = "primary",
  size = "md",
  title,
  leftIcon,
  leftElement,
  rightIcon,
  rightIconAlign = "inline",
  iconOnly = false,
  loading = false,
  disabled = false,
  accessibilityLabel,
  className,
  style,
  onPress,
}: ButtonProps) {
  const colors = useThemeColors();
  const isDisabled = disabled || loading;
  const foregroundTone =
    variant === "primary" || variant === "lavender" ? "onAccent" : "primary";
  const spinnerColor =
    variant === "primary" || variant === "lavender"
      ? colors.onPrimary
      : colors.textPrimary;

  const iconComponent = leftIcon ?? rightIcon;
  const alignRightEnd = !iconOnly && rightIconAlign === "end" && !!rightIcon;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      className={[
        "flex-row items-center gap-sm rounded-full",
        alignRightEnd ? "justify-between" : "justify-center",
        variantContainerClasses[variant],
        iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={({ pressed }) => [
        {
          borderRadius: radius.full,
          opacity: isDisabled ? 0.45 : pressed ? 0.82 : 1,
          transform: [{ scale: !isDisabled && pressed ? 0.985 : 1 }],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : iconOnly && leftElement ? (
        leftElement
      ) : iconOnly && iconComponent ? (
        <AppIcon icon={iconComponent} size={size === "sm" ? "sm" : "md"} tone={foregroundTone} />
      ) : alignRightEnd ? (
        <>
          <View className="w-5 items-start">
            {leftElement ??
              (leftIcon ? (
                <AppIcon icon={leftIcon} size={size === "sm" ? "sm" : "md"} tone={foregroundTone} />
              ) : null)}
          </View>
          {title ? (
            <AppText
              variant={size === "sm" ? "caption" : "button"}
              tone={foregroundTone}
              className="flex-1 text-center font-sans-semibold"
            >
              {title}
            </AppText>
          ) : null}
          <View className="w-5 items-end">
            <AppIcon icon={rightIcon} size={size === "sm" ? "sm" : "md"} tone={foregroundTone} />
          </View>
        </>
      ) : (
        <>
          {leftElement ??
            (leftIcon ? (
              <AppIcon icon={leftIcon} size={size === "sm" ? "sm" : "md"} tone={foregroundTone} />
            ) : null)}
          {title ? (
            <AppText
              variant={size === "sm" ? "caption" : "button"}
              tone={foregroundTone}
              className="font-sans-semibold"
            >
              {title}
            </AppText>
          ) : null}
          {rightIcon ? (
            <AppIcon icon={rightIcon} size={size === "sm" ? "sm" : "md"} tone={foregroundTone} />
          ) : null}
        </>
      )}
    </Pressable>
  );
}
