import type { ComponentRef, ReactNode, RefObject } from "react";
import { useEffect, useRef } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import type { LucideIcon } from "lucide-react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { radius, shadows, spacing, useThemeColors } from "@/theme";
import { AppIcon } from "./app-icon";
import { AppText } from "./app-text";

const CIRCLE_SIZE = 60;
const TOUCH_DELAY_MS = 45;
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

export interface GlassTabItem<T extends string> {
  key: T;
  label: string;
  icon: LucideIcon;
}

export type GlassTabBarVariant = "floating" | "docked";

export interface GlassTabBarProps<T extends string> {
  tabs: readonly GlassTabItem<T>[];
  activeTab: T;
  onTabPress: (key: T) => void;
  variant?: GlassTabBarVariant;
  bottomInset?: number;
  blurTarget?: RefObject<ComponentRef<typeof View> | null>;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

interface TabLayout {
  x: number;
  width: number;
}

function GlassSheenOverlay() {
  const colors = useThemeColors();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="roamTabGlassSheen" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.surface} stopOpacity={0.62} />
            <Stop offset="48%" stopColor={colors.surface} stopOpacity={0.22} />
            <Stop offset="100%" stopColor={colors.surface} stopOpacity={0.44} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#roamTabGlassSheen)" />
      </Svg>
    </View>
  );
}

function GlassSurface({
  children,
  variant,
  bottomInset,
  blurTarget,
  className,
  style,
}: {
  children: ReactNode;
  variant: GlassTabBarVariant;
  bottomInset: number;
  blurTarget?: RefObject<ComponentRef<typeof View> | null>;
  className?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const colors = useThemeColors();
  const isDocked = variant === "docked";
  const surfaceShapeStyle: ViewStyle = isDocked
    ? {
        borderTopLeftRadius: radius["2xl"],
        borderTopRightRadius: radius["2xl"],
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderCurve: "continuous",
        paddingTop: spacing.sm,
        paddingHorizontal: spacing.sm,
        paddingBottom: Math.max(bottomInset, spacing.sm),
      }
    : {
        borderRadius: radius.full,
        padding: spacing.sm,
      };

  const outerShadowStyle: ViewStyle = {
    borderRadius: isDocked ? undefined : radius.full,
    borderTopLeftRadius: isDocked ? radius["2xl"] : undefined,
    borderTopRightRadius: isDocked ? radius["2xl"] : undefined,
    boxShadow: shadows.glass,
  };

  if (isLiquidGlassAvailable()) {
    return (
      <View style={[outerShadowStyle, style]}>
        <GlassView
          glassEffectStyle="regular"
          isInteractive
          style={[{ overflow: "hidden" }, surfaceShapeStyle]}
        >
          <View className={className}>{children}</View>
        </GlassView>
      </View>
    );
  }

  const canUseNativeBlur = Platform.OS === "ios" || (Platform.OS === "android" && Boolean(blurTarget));

  if (canUseNativeBlur) {
    return (
      <View style={[outerShadowStyle, style]}>
        <BlurView
          intensity={Platform.OS === "android" ? 55 : 68}
          tint="default"
          blurReductionFactor={4}
          blurMethod={Platform.OS === "android" ? "dimezisBlurView" : undefined}
          blurTarget={blurTarget}
          style={[
            {
              overflow: "hidden",
              borderWidth: 1,
              borderColor: colors.overlayBorder,
            },
            surfaceShapeStyle,
          ]}
        >
          <GlassSheenOverlay />
          <View className={className}>{children}</View>
        </BlurView>
      </View>
    );
  }

  return (
    <View
      className={[
        "border border-border-gray bg-glass-blur shadow-glass dark:border-border-dark dark:bg-glass-blur-dark",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={[surfaceShapeStyle, style]}
    >
      {children}
    </View>
  );
}

function GlassTabButton<T extends string>({
  tab,
  isActive,
  reducedMotion,
  lavenderColor,
  onPress,
  onSlotLayout,
}: {
  tab: GlassTabItem<T>;
  isActive: boolean;
  reducedMotion: boolean;
  lavenderColor: string;
  onPress: () => void;
  onSlotLayout: (key: T, event: LayoutChangeEvent) => void;
}) {
  const pressProgress = useSharedValue(0);
  const activeScale = useSharedValue(isActive ? 1 : 0.96);

  useEffect(() => {
    if (reducedMotion) {
      activeScale.set(1);
      return;
    }
    activeScale.set(
      withDelay(
        TOUCH_DELAY_MS,
        withSpring(isActive ? 1.02 : 0.96, {
          duration: 280,
          dampingRatio: 0.85,
        }),
      ),
    );
  }, [isActive, reducedMotion, activeScale]);

  const handlePressIn = () => {
    pressProgress.set(withTiming(1, { duration: 110, easing: EASE_OUT }));
  };

  const handlePressOut = () => {
    // Hold briefly so quick taps still reveal the lavender touch aura before fading out.
    pressProgress.set(
      withDelay(80, withTiming(0, { duration: 220, easing: EASE_OUT })),
    );
  };

  const lavenderCircleStyle = useAnimatedStyle(() => {
    const p = pressProgress.get();
    return {
      opacity: p * 0.95,
      transform: [{ scale: reducedMotion ? 1 : 0.78 + p * 0.22 }],
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    const p = pressProgress.get();
    const pressScale = reducedMotion ? 1 : 1 - p * 0.08;
    return {
      transform: [{ scale: activeScale.get() * pressScale }],
    };
  });

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={tab.label}
      accessibilityState={{ selected: isActive }}
      onLayout={(event) => onSlotLayout(tab.key, event)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      pressRetentionOffset={16}
      className="flex-1 items-center justify-center"
      style={{ height: CIRCLE_SIZE }}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: radius.full,
            backgroundColor: lavenderColor,
          },
          lavenderCircleStyle,
        ]}
      />

      <Animated.View
        className="items-center justify-center"
        style={[
          {
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            gap: spacing.xs / 2,
          },
          contentStyle,
        ]}
      >
        <AppIcon
          icon={tab.icon}
          size="md"
          tone={isActive ? "onAccent" : "primary"}
        />
        <AppText
          variant="label"
          numberOfLines={1}
          tone={isActive ? "onAccent" : "primary"}
          className={isActive ? "font-sans-bold" : "font-sans-medium"}
        >
          {tab.label}
        </AppText>
      </Animated.View>
    </Pressable>
  );
}

/**
 * Floating frosted-glass pill bottom navigation bar with a gliding round yellow
 * active circle enclosing icon + label and delayed lavender touch feedback.
 */
export function GlassTabBar<T extends string>({
  tabs,
  activeTab,
  onTabPress,
  variant = "floating",
  bottomInset = 0,
  blurTarget,
  className,
  style,
}: GlassTabBarProps<T>) {
  const colors = useThemeColors();
  const reducedMotion = useReducedMotion();
  const layoutsRef = useRef<Partial<Record<T, TabLayout>>>({});

  const indicatorX = useSharedValue(0);
  const indicatorScale = useSharedValue(1);
  const indicatorVisible = useSharedValue(0);

  const getTargetX = (layout: TabLayout) =>
    layout.x + (layout.width - CIRCLE_SIZE) / 2;

  useEffect(() => {
    const layout = layoutsRef.current[activeTab];
    if (!layout) {
      return;
    }

    const targetX = getTargetX(layout);
    if (indicatorVisible.get() === 0) {
      indicatorX.set(targetX);
      indicatorScale.set(1);
      indicatorVisible.set(1);
      return;
    }

    if (reducedMotion) {
      indicatorX.set(withTiming(targetX, { duration: 150, easing: EASE_OUT }));
      indicatorScale.set(1);
      return;
    }

    indicatorX.set(
      withDelay(
        TOUCH_DELAY_MS,
        withSpring(targetX, { duration: 340, dampingRatio: 0.84 }),
      ),
    );
    indicatorScale.set(
      withDelay(
        TOUCH_DELAY_MS,
        withSequence(
          withTiming(0.92, { duration: 75, easing: EASE_OUT }),
          withSpring(1, { duration: 300, dampingRatio: 0.78 }),
        ),
      ),
    );
  }, [activeTab, reducedMotion, indicatorX, indicatorScale, indicatorVisible]);

  const handleSlotLayout = (key: T, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    layoutsRef.current[key] = { x, width };

    if (key === activeTab && indicatorVisible.get() === 0) {
      indicatorX.set(getTargetX({ x, width }));
      indicatorScale.set(1);
      indicatorVisible.set(1);
    }
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: indicatorVisible.get(),
    transform: [
      { translateX: indicatorX.get() },
      { scale: indicatorScale.get() },
    ],
  }));

  return (
    <GlassSurface
      variant={variant}
      bottomInset={bottomInset}
      blurTarget={blurTarget}
      className={className}
      style={style}
    >
      <View
        className="relative flex-row items-center justify-between"
        style={{ height: CIRCLE_SIZE }}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              left: 0,
              top: 0,
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: radius.full,
              backgroundColor: colors.primary,
              boxShadow: shadows.raised,
            },
            indicatorStyle,
          ]}
        />

        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <GlassTabButton
              key={tab.key}
              tab={tab}
              isActive={isActive}
              reducedMotion={Boolean(reducedMotion)}
              lavenderColor={colors.lavender}
              onSlotLayout={handleSlotLayout}
              onPress={() => {
                if (!isActive) {
                  Haptics.selectionAsync();
                }
                onTabPress(tab.key);
              }}
            />
          );
        })}
      </View>
    </GlassSurface>
  );
}
