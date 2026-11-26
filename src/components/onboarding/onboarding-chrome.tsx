import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import Animated, {
  Extrapolation,
  cubicBezier,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  type SharedValue,
} from "react-native-reanimated";
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import MapPin from "lucide-react-native/icons/map-pin";
import { AppIcon, AppText } from "@/components/ui";
import type { OnboardingSlide } from "@/components/onboarding/onboarding-slides";
import { radius, spacing, useThemeColors } from "@/theme";

const CSS_EASE_OUT = cubicBezier(0.23, 1, 0.32, 1);

/**
 * Soft top gradient scrim keeping the `roam` wordmark and `Skip` pill legible
 * over bright sky photography.
 */
export function TopMistScrim() {
  const colors = useThemeColors();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="roamTopMist" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.surface} stopOpacity={0.95} />
            <Stop offset="52%" stopColor={colors.surface} stopOpacity={0.62} />
            <Stop offset="100%" stopColor={colors.surface} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#roamTopMist)" />
      </Svg>
    </View>
  );
}

/**
 * Sloped-curve top edge transitioning smoothly from the hero image into the
 * bottom content sheet.
 */
export function SlopedSheetCurve() {
  const colors = useThemeColors();

  return (
    <View className="h-12 w-full" style={{ marginBottom: -1 }} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 390 48" preserveAspectRatio="none">
        <Path
          d="M 0 30 C 0 11, 16 0, 38 0 C 130 0, 275 18, 390 48 L 390 48 L 0 48 Z"
          fill={colors.surface}
        />
      </Svg>
    </View>
  );
}

/**
 * Dark translucent location pill anchored above the bottom sheet curve.
 */
export function LocationPill({ location }: { location: string }) {
  const colors = useThemeColors();

  return (
    <View
      className="flex-row items-center gap-xs rounded-full bg-glass-blur-dark px-md py-sm"
      style={{
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.overlayBorder,
      }}
    >
      <AppIcon icon={MapPin} size="sm" tone="onOverlay" />
      <AppText variant="caption" tone="onOverlay" className="font-sans-medium">
        {location}
      </AppText>
    </View>
  );
}

/**
 * Interactive 3-pill step indicator with UI-thread width and color transitions.
 */
export function OnboardingStepDots({
  total,
  activeIndex,
  onSelect,
}: {
  total: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const colors = useThemeColors();
  const reducedMotion = useReducedMotion();

  return (
    <View className="flex-row items-center gap-sm" accessibilityRole="tablist">
      {Array.from({ length: total }, (_, index) => {
        const isActive = index === activeIndex;

        return (
          <Pressable
            key={index}
            accessibilityRole="tab"
            accessibilityLabel={`Step ${index + 1} of ${total}`}
            accessibilityState={{ selected: isActive }}
            hitSlop={10}
            onPress={() => onSelect(index)}
          >
            <Animated.View
              style={{
                width: isActive ? 32 : 20,
                height: 6,
                borderRadius: radius.full,
                backgroundColor: isActive ? colors.lavenderIndicator : colors.border,
                transitionProperty: ["width", "backgroundColor"],
                transitionDuration: reducedMotion ? 0 : 200,
                transitionTimingFunction: CSS_EASE_OUT,
              }}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * Full-bleed hero slide with UI-thread horizontal parallax, subtle depth scale,
 * and counter-gliding location pill during swipes.
 */
export function OnboardingHeroSlide({
  slide,
  index,
  scrollX,
  slideWidth,
  sheetOverlap,
}: {
  slide: OnboardingSlide;
  index: number;
  scrollX: SharedValue<number>;
  slideWidth: SharedValue<number>;
  sheetOverlap: number;
}) {
  const reducedMotion = useReducedMotion();

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const w = slideWidth.get();
    if (w <= 0) {
      return { opacity: 1, transform: [{ translateX: 0 }, { scale: 1 }] };
    }
    const offset = scrollX.get();
    const inputRange = [(index - 1) * w, index * w, (index + 1) * w];
    const opacity = interpolate(offset, inputRange, [0.75, 1, 0.75], Extrapolation.CLAMP);

    if (reducedMotion) {
      return { opacity, transform: [{ translateX: 0 }, { scale: 1 }] };
    }

    const translateX = interpolate(
      offset,
      inputRange,
      [-w * 0.05, 0, w * 0.05],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(offset, inputRange, [1.12, 1, 1.12], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ translateX }, { scale }],
    };
  });

  const badgeAnimatedStyle = useAnimatedStyle(() => {
    const w = slideWidth.get();
    if (w <= 0) {
      return { opacity: 1, transform: [{ translateX: 0 }] };
    }
    const offset = scrollX.get();
    const inputRange = [(index - 0.55) * w, index * w, (index + 0.55) * w];
    const opacity = interpolate(offset, inputRange, [0, 1, 0], Extrapolation.CLAMP);
    const translateX = reducedMotion
      ? 0
      : interpolate(offset, inputRange, [24, 0, -24], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ translateX }],
    };
  });

  return (
    <View className="relative h-full w-full overflow-hidden">
      <Animated.View style={[StyleSheet.absoluteFill, imageAnimatedStyle]}>
        <Image
          source={{ uri: slide.imageUri }}
          contentFit="cover"
          transition={reducedMotion ? 0 : 200}
          style={{ width: "100%", height: "100%" }}
          accessibilityLabel={`Stay in ${slide.location}`}
        />
      </Animated.View>

      <Animated.View
        className="absolute left-xl"
        style={[{ bottom: sheetOverlap + spacing.base }, badgeAnimatedStyle]}
      >
        <LocationPill location={slide.location} />
      </Animated.View>
    </View>
  );
}

/**
 * Scroll-linked crossfade and micro-lift for the bottom sheet headline and
 * subtitle so copy transitions smoothly in sync with horizontal swipes.
 */
export function OnboardingCopyTransition({
  scrollX,
  slideWidth,
  children,
}: {
  scrollX: SharedValue<number>;
  slideWidth: SharedValue<number>;
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();

  const animatedStyle = useAnimatedStyle(() => {
    const w = slideWidth.get();
    if (w <= 0) {
      return { opacity: 1, transform: [{ translateY: 0 }] };
    }
    const page = scrollX.get() / w;
    const distance = Math.abs(page - Math.round(page));
    const opacity = interpolate(distance, [0, 0.35, 0.5], [1, 0.15, 0], Extrapolation.CLAMP);
    const translateY = reducedMotion
      ? 0
      : interpolate(distance, [0, 0.5], [0, 8], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
