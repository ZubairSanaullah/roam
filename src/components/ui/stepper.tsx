import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import Minus from "lucide-react-native/icons/minus";
import Plus from "lucide-react-native/icons/plus";
import { radius } from "@/theme";
import { AppIcon } from "./app-icon";
import { AppText } from "./app-text";

export interface StepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Pill numeric stepper (e.g. guest or night counts) with accessible bounds.
 */
export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
  label = "Count",
  className,
  style,
}: StepperProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <View
      className={[
        "min-h-11 flex-row items-center gap-sm self-start rounded-full border border-border-gray bg-surface-white px-sm dark:border-border-dark dark:bg-surface-elevated-dark",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={[{ borderRadius: radius.full }, style]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Decrease ${label}`}
        accessibilityState={{ disabled: !canDecrement }}
        disabled={!canDecrement}
        onPress={() => onChange(Math.max(min, value - 1))}
        hitSlop={6}
        className="h-9 w-9 items-center justify-center rounded-full"
        style={({ pressed }) => ({
          borderRadius: radius.full,
          opacity: !canDecrement ? 0.35 : pressed ? 0.65 : 1,
        })}
      >
        <AppIcon icon={Minus} size="sm" tone="primary" />
      </Pressable>

      <AppText
        variant="body"
        className="min-w-6 text-center font-sans-semibold"
        accessibilityLabel={`${label}: ${value}`}
      >
        {value}
      </AppText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Increase ${label}`}
        accessibilityState={{ disabled: !canIncrement }}
        disabled={!canIncrement}
        onPress={() => onChange(Math.min(max, value + 1))}
        hitSlop={6}
        className="h-9 w-9 items-center justify-center rounded-full"
        style={({ pressed }) => ({
          borderRadius: radius.full,
          opacity: !canIncrement ? 0.35 : pressed ? 0.65 : 1,
        })}
      >
        <AppIcon icon={Plus} size="sm" tone="primary" />
      </Pressable>
    </View>
  );
}
