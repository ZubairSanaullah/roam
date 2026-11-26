import { useEffect, useRef, type ReactNode } from "react";
import {
  Pressable,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
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
import { radius, shadows, spacing, useThemeColors } from "@/theme";
import { AppIcon } from "./app-icon";
import { AppText } from "./app-text";

const CIRCLE_SIZE = 64;
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
  className?: string;
  style?: StyleProp<ViewStyle>;
}

interface TabLayout {
  x: number;
  width: number;
}

function GlassSurface({
  children,
  variant,
  bottomInset,
  className,
  style,
}: {
  children: ReactNode;
  variant: GlassTabBarVariant;
  bottomInset: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
}) {
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
        padding: spacing.xs,
      };

  if (isLiquidGlassAvailable()) {
    return (
      <GlassView
        glassEffectStyle="regular"
        isInteractive
        style={[{ overflow: "hidden" }, surfaceShapeStyle, style]}
      >
        <View className={className}>{children}</View>
      </GlassView>
    );
  }

  return (
    <View
      className={[
        isDocked
          ? "border-t border-border-gray bg-top-scrim shadow-glass dark:border-border-dark dark:bg-glass-blur-dark"
          : "border border-border-gray bg-top-scrim shadow-glass dark:border-border-dark dark:bg-glass-blur-dark",
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
      className="h-16 flex-1 items-center justify-center"
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
        className="h-16 w-16 items-center justify-center gap-xs"
        style={contentStyle}
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
 * Glass bottom navigation bar with a gliding round yellow active circle
 * enclosing icon + label and delayed lavender touch feedback on press.
 */
export function GlassTabBar<T extends string>({
  tabs,
  activeTab,
  onTabPress,
  variant = "floating",
  bottomInset = 0,
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
      className={className}
      style={style}
    >
      <View className="relative flex-row items-center justify-between">
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
              boxShadow: shadows.card,
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
