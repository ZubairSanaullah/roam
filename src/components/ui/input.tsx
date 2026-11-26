import { useState } from "react";
import {
  Pressable,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
} from "react-native";
import type { LucideIcon } from "lucide-react-native";
import Eye from "lucide-react-native/icons/eye";
import EyeOff from "lucide-react-native/icons/eye-off";
import { fontFamilies, radius, useThemeColors } from "@/theme";
import { AppIcon } from "./app-icon";
import { AppText } from "./app-text";

export interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  variant?: "default" | "search" | "stacked";
  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon;
  onTrailingPress?: () => void;
  trailingLabel?: string;
  error?: string;
  containerClassName?: string;
  className?: string;
  style?: StyleProp<TextStyle>;
}

/**
 * Text field supporting pill default/search variants, stacked rounded-box
 * auth fields, focus lavender ring, password toggle, and inline errors.
 */
export function Input({
  label,
  variant = "default",
  leadingIcon,
  trailingIcon,
  onTrailingPress,
  trailingLabel,
  error,
  secureTextEntry,
  editable = true,
  containerClassName,
  className,
  style,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const colors = useThemeColors();
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const isStacked = variant === "stacked";
  const isPassword = Boolean(secureTextEntry);
  const effectiveSecure = isPassword && !revealed;
  const activeTrailingIcon =
    trailingIcon ?? (isPassword ? (revealed ? Eye : EyeOff) : undefined);

  const handleTrailingAction = () => {
    if (trailingIcon && onTrailingPress) {
      onTrailingPress();
    } else if (isPassword) {
      setRevealed((prev) => !prev);
    }
  };

  const borderClass = error
    ? "border-2 border-error-fg dark:border-error-fg-dark"
    : focused
      ? "border-2 border-lavender"
      : isStacked
        ? "border border-transparent"
        : "border border-border-gray dark:border-border-dark";

  const surfaceClass = focused
    ? "bg-lavender-tint/40 dark:bg-lavender-tint-dark/60"
    : "bg-surface-gray dark:bg-surface-subtle-dark";

  const textInputEl = (
    <TextInput
      editable={editable}
      secureTextEntry={effectiveSecure}
      placeholderTextColor={colors.textSecondary}
      selectionColor={colors.lavenderAccent}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      className={[
        "type-body text-text-primary dark:text-text-primary-dark",
        isStacked ? "p-0" : "flex-1 py-md",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={[
        {
          fontFamily: fontFamilies.regular,
          color: colors.textPrimary,
        },
        style,
      ]}
      {...props}
    />
  );

  return (
    <View className={["gap-xs", containerClassName].filter(Boolean).join(" ")}>
      {label && !isStacked ? (
        <AppText variant="caption" tone="secondary" className="px-sm">
          {label}
        </AppText>
      ) : null}

      <View
        className={[
          "flex-row items-center gap-md px-base",
          isStacked ? "min-h-16 rounded-lg py-md" : "min-h-12 rounded-full",
          surfaceClass,
          borderClass,
          !editable ? "opacity-50" : null,
        ]
          .filter(Boolean)
          .join(" ")}
        style={
          isStacked
            ? { borderRadius: radius.lg, borderCurve: "continuous" }
            : { borderRadius: radius.full }
        }
      >
        {leadingIcon ? (
          <AppIcon
            icon={leadingIcon}
            size="md"
            tone={focused ? "lavender" : isStacked ? "primary" : "secondary"}
          />
        ) : null}

        {isStacked ? (
          <View className="flex-1 justify-center gap-xs">
            {label ? (
              <AppText variant="label" tone="primary" className="font-sans-semibold">
                {label}
              </AppText>
            ) : null}
            {textInputEl}
          </View>
        ) : (
          textInputEl
        )}

        {activeTrailingIcon ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              trailingLabel ??
              (isPassword
                ? revealed
                  ? "Hide password"
                  : "Show password"
                : "Input action")
            }
            disabled={!onTrailingPress && !isPassword}
            onPress={handleTrailingAction}
            hitSlop={8}
            className="items-center justify-center p-xs"
          >
            <AppIcon
              icon={activeTrailingIcon}
              size="md"
              tone={isStacked ? "primary" : "secondary"}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <AppText variant="caption" tone="error" className="px-sm">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
