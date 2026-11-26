import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import Animated, {
  Easing,
  FadeInDown,
  LinearTransition,
  useReducedMotion,
} from "react-native-reanimated";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import ChevronRight from "lucide-react-native/icons/chevron-right";
import MapPin from "lucide-react-native/icons/map-pin";
import Star from "lucide-react-native/icons/star";
import { AppIcon, AppText, PressableScale } from "@/components/ui";
import type { StayProperty } from "@/data/stays";
import { palette, radius, useThemeColors } from "@/theme";

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
const CARD_LAYOUT_TRANSITION = LinearTransition.duration(200);

export interface FeaturedStayCardProps {
  stay: StayProperty;
  index: number;
  onPress: () => void;
}

/**
 * Full-bleed featured property photo card with top-right rating pill,
 * bottom gradient scrim, location + title overlay, and circular chevron action.
 */
export function FeaturedStayCard({ stay, index, onPress }: FeaturedStayCardProps) {
  const colors = useThemeColors();
  const reducedMotion = useReducedMotion();

  const entering = useMemo(
    () =>
      reducedMotion
        ? undefined
        : FadeInDown.duration(240)
            .delay(Math.min(index, 4) * 45)
            .easing(EASE_OUT),
    [index, reducedMotion],
  );

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View
      entering={entering}
      layout={reducedMotion ? undefined : CARD_LAYOUT_TRANSITION}
    >
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`${stay.title} in ${stay.location}, rated ${stay.rating}`}
        onPress={handlePress}
        pressedScale={0.985}
        className="relative h-68 w-full overflow-hidden rounded-2xl bg-surface-gray shadow-card"
        style={{
          borderRadius: radius["2xl"],
          borderCurve: "continuous",
        }}
      >
        <Image
          source={{ uri: stay.imageUri }}
          contentFit="cover"
          transition={reducedMotion ? 0 : 200}
          style={StyleSheet.absoluteFill}
          accessibilityLabel={stay.title}
        />

        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width="100%" height="100%" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id={`stayScrim-${stay.id}`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="35%" stopColor={palette.surfaceDark} stopOpacity={0} />
                <Stop offset="75%" stopColor={palette.surfaceDark} stopOpacity={0.48} />
                <Stop offset="100%" stopColor={palette.surfaceDark} stopOpacity={0.82} />
              </LinearGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill={`url(#stayScrim-${stay.id})`}
            />
          </Svg>
        </View>

        {/* Top-right rating pill */}
        <View
          className="absolute right-base top-base flex-row items-center gap-xs rounded-full bg-surface-white px-md py-xs shadow-card"
          style={{ borderRadius: radius.full }}
        >
          <Star
            size={14}
            strokeWidth={1.85}
            color={colors.onPrimary}
            fill={colors.onPrimary}
          />
          <AppText variant="caption" tone="onAccent" className="font-sans-bold">
            {stay.rating}
          </AppText>
        </View>

        {/* Bottom-left info + bottom-right chevron circle */}
        <View className="absolute bottom-base left-base right-base flex-row items-end justify-between gap-md">
          <View className="flex-1 gap-xs">
            <View className="flex-row items-center gap-xs">
              <AppIcon icon={MapPin} size="sm" tone="onOverlay" />
              <AppText variant="caption" tone="onOverlay" numberOfLines={1}>
                {stay.location}
              </AppText>
            </View>

            <AppText variant="heading" tone="onOverlay" numberOfLines={2}>
              {stay.title}
            </AppText>
          </View>

          <View
            className="h-12 w-12 items-center justify-center rounded-full bg-surface-white shadow-card"
            style={{ borderRadius: radius.full }}
          >
            <AppIcon icon={ChevronRight} size="lg" tone="onAccent" />
          </View>
        </View>
      </PressableScale>
    </Animated.View>
  );
}
