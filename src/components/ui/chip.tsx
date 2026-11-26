import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { radius } from "@/theme";
import { AppIcon } from "./app-icon";
import { AppText } from "./app-text";

export interface ChipProps {
  label: string;
  selected?: boolean;
  accent?: "lavender" | "yellow";
  icon?: LucideIcon;
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Pill filter chip supporting unselected neutral, selected lavender, and
 * selected yellow states.
 */
export function Chip({
  label,
  selected = false,
  accent = "lavender",
  icon,
  disabled = false,
  onPress,
  className,
  style,
}: ChipProps) {
  const containerClass = selected
    ? accent === "yellow"
      ? "bg-primary-yellow border border-primary-yellow"
      : "bg-lavender border border-lavender"
    : "bg-surface-gray dark:bg-surface-subtle-dark border border-border-gray dark:border-border-dark";

  const textTone = selected ? "onAccent" : "primary";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      className={[
        "min-h-11 flex-row items-center justify-center gap-sm rounded-full px-base",
        containerClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={({ pressed }) => [
        {
          borderRadius: radius.full,
          opacity: disabled ? 0.45 : pressed ? 0.78 : 1,
        },
        style,
      ]}
    >
      {icon ? <AppIcon icon={icon} size="sm" tone={textTone} /> : null}
      <AppText variant="caption" tone={textTone} className="font-sans-medium">
        {label}
      </AppText>
    </Pressable>
  );
}
