import { useRef, useState, type ComponentRef } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { AppText } from "@/components/ui";
import { radius, useThemeColors } from "@/theme";

export interface OtpInputProps {
  value: string;
  onChange: (code: string) => void;
  length?: number;
  error?: string;
}

/**
 * 6-cell verification code input backed by a single hidden TextInput for
 * reliable paste, backspace, and one-time-code autofill across platforms.
 */
export function OtpInput({ value, onChange, length = 6, error }: OtpInputProps) {
  const colors = useThemeColors();
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [focused, setFocused] = useState(false);

  const activeCell = Math.min(value.length, length - 1);

  return (
    <View className="gap-xs">
      <Pressable
        accessibilityLabel="Verification code"
        accessibilityHint={`Enter ${length} digit verification code`}
        onPress={() => inputRef.current?.focus()}
        className="relative flex-row gap-sm"
      >
        {Array.from({ length }, (_, index) => {
          const digit = value[index] ?? "";
          const isCurrent = focused && index === activeCell;
          const borderClass = error
            ? "border-2 border-error-fg dark:border-error-fg-dark"
            : isCurrent
              ? "border-2 border-lavender"
              : digit
                ? "border border-border-gray dark:border-border-dark"
                : "border border-transparent";
          const bgClass = isCurrent
            ? "bg-lavender-tint/40 dark:bg-lavender-tint-dark/60"
            : "bg-surface-gray dark:bg-surface-subtle-dark";

          return (
            <View
              key={index}
              className={[
                "h-14 flex-1 items-center justify-center rounded-lg",
                bgClass,
                borderClass,
              ].join(" ")}
              style={{ borderRadius: radius.lg, borderCurve: "continuous" }}
            >
              {digit ? (
                <AppText variant="heading">{digit}</AppText>
              ) : isCurrent ? (
                <View className="h-6 w-0.5 rounded-full bg-lavender-accent dark:bg-lavender" />
              ) : null}
            </View>
          );
        })}

        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={(next) => onChange(next.replace(/[^0-9]/g, "").slice(0, length))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          maxLength={length}
          caretHidden
          selectionColor={colors.lavenderAccent}
          style={[StyleSheet.absoluteFill, { opacity: 0.02 }]}
          accessibilityLabel="Verification code input"
        />
      </Pressable>

      {error ? (
        <AppText variant="caption" tone="error" className="px-xs">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
