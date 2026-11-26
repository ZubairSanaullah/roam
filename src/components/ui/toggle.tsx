import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import { radius } from "@/theme";

export interface ToggleProps {
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Pill toggle switch using Roam's Primary Yellow active track.
 */
export function Toggle({
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel = "Toggle",
  className,
  style,
}: ToggleProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      hitSlop={6}
      className={[
        "h-9 w-16 justify-center rounded-full px-xs",
        value
          ? "items-end bg-primary-yellow"
          : "items-start border border-border-gray bg-surface-gray dark:border-border-dark dark:bg-surface-subtle-dark",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={({ pressed }) => [
        {
          borderRadius: radius.full,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <View
        className="h-7 w-7 rounded-full bg-surface-white shadow-card"
        style={{ borderRadius: radius.full }}
      />
    </Pressable>
  );
}
