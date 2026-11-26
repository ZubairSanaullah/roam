import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { radius } from "@/theme";
import { AppIcon } from "./app-icon";
import { AppText } from "./app-text";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: LucideIcon;
}

export interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Pill segmented toggle (e.g. List / Map view switcher).
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  style,
}: SegmentedControlProps<T>) {
  return (
    <View
      accessibilityRole="tablist"
      className={[
        "flex-row items-center rounded-full border border-border-gray bg-surface-white p-xs dark:border-border-dark dark:bg-surface-elevated-dark",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={[{ borderRadius: radius.full }, style]}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        const activeTone = isActive ? "inverse" : "primary";

        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(option.value)}
            className={[
              "min-h-11 flex-1 flex-row items-center justify-center gap-sm rounded-full px-base",
              isActive ? "bg-text-primary dark:bg-primary-yellow" : "bg-transparent",
            ].join(" ")}
            style={({ pressed }) => ({
              borderRadius: radius.full,
              opacity: pressed && !isActive ? 0.7 : 1,
            })}
          >
            {option.icon ? (
              <AppIcon
                icon={option.icon}
                size="sm"
                tone={isActive ? activeTone : "primary"}
              />
            ) : null}
            <AppText
              variant="caption"
              tone={activeTone}
              className="font-sans-semibold"
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
