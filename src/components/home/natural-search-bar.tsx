import { TextInput, View } from "react-native";
import * as Haptics from "expo-haptics";
import ArrowUpRight from "lucide-react-native/icons/arrow-up-right";
import Search from "lucide-react-native/icons/search";
import { AppIcon, PressableScale } from "@/components/ui";
import { fontFamilies, palette, radius } from "@/theme";

export interface NaturalSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

/**
 * Lavender natural-language prompt pill matching Roam's home design, with
 * editable input, keyboard search return, and circular submit trigger.
 */
export function NaturalSearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = "quiet pet friendly cabin with hot tub",
}: NaturalSearchBarProps) {
  const handleSubmitPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSubmit();
  };

  return (
    <View
      className="min-h-14 flex-row items-center gap-md rounded-full bg-lavender pl-base pr-xs"
      style={{ borderRadius: radius.full }}
    >
      <AppIcon icon={Search} size="md" tone="onAccent" />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={handleSubmitPress}
        placeholder={placeholder}
        placeholderTextColor={palette.textPrimary}
        selectionColor={palette.lavenderAccent}
        returnKeyType="search"
        autoCorrect
        className="type-caption flex-1 py-md text-text-primary"
        style={{
          fontFamily: fontFamilies.medium,
          color: palette.textPrimary,
        }}
        accessibilityLabel="Describe the stay you want"
      />

      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Search stays"
        onPress={handleSubmitPress}
        hitSlop={6}
        pressedScale={0.94}
        className="h-11 w-11 items-center justify-center rounded-full bg-surface-white shadow-card"
        style={{ borderRadius: radius.full }}
      >
        <AppIcon icon={ArrowUpRight} size="md" tone="onAccent" />
      </PressableScale>
    </View>
  );
}
