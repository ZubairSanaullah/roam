import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import ChevronRight from "lucide-react-native/icons/chevron-right";
import { AppIcon } from "./app-icon";
import { AppText } from "./app-text";

export interface ProfileRowProps {
  icon: LucideIcon;
  label: string;
  showDivider?: boolean;
  onPress?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Navigation list row for profile and settings groups, separated by subtle
 * hairlines and highlighted on press without scaling.
 */
export function ProfileRow({
  icon,
  label,
  showDivider = true,
  onPress,
  className,
  style,
}: ProfileRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className={[
        "min-h-13 flex-row items-center gap-md px-base py-md",
        showDivider ? "border-b border-border-gray dark:border-border-dark" : null,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={({ pressed }) => [
        { opacity: pressed ? 0.72 : 1 },
        style,
      ]}
    >
      <View className="items-center justify-center">
        <AppIcon icon={icon} size="md" tone="primary" />
      </View>
      <AppText variant="body" className="flex-1 font-sans-medium">
        {label}
      </AppText>
      <AppIcon icon={ChevronRight} size="md" tone="secondary" />
    </Pressable>
  );
}
