import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import ChevronRight from "lucide-react-native/icons/chevron-right";
import { AppIcon } from "./app-icon";
import { AppText } from "./app-text";

export interface ProfileRowProps {
  icon: LucideIcon;
  label: string;
  subtitle?: string;
  showDivider?: boolean;
  showChevron?: boolean;
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
  subtitle,
  showDivider = true,
  showChevron = true,
  onPress,
  className,
  style,
}: ProfileRowProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : "text"}
      accessibilityLabel={subtitle ? `${label}, ${subtitle}` : label}
      disabled={!onPress}
      onPress={onPress}
      className={[
        "min-h-13 flex-row items-center gap-md px-base py-md",
        showDivider ? "border-b border-border-gray dark:border-border-dark" : null,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={({ pressed }) => [
        { opacity: pressed && onPress ? 0.72 : 1 },
        style,
      ]}
    >
      <View className="items-center justify-center">
        <AppIcon icon={icon} size="md" tone="primary" />
      </View>
      <View className="flex-1 gap-xs">
        <AppText variant="body" className="font-sans-medium">
          {label}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" tone="secondary">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {showChevron ? <AppIcon icon={ChevronRight} size="md" tone="secondary" /> : null}
    </Pressable>
  );
}
