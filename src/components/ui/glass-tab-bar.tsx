import type { ReactNode } from "react";
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import type { LucideIcon } from "lucide-react-native";
import { radius } from "@/theme";
import { AppIcon } from "./app-icon";
import { AppText } from "./app-text";

export interface GlassTabItem<T extends string> {
  key: T;
  label: string;
  icon: LucideIcon;
}

export interface GlassTabBarProps<T extends string> {
  tabs: readonly GlassTabItem<T>[];
  activeTab: T;
  onTabPress: (key: T) => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

function GlassSurface({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}) {
  if (isLiquidGlassAvailable()) {
    return (
      <GlassView
        glassEffectStyle="regular"
        isInteractive
        style={[{ borderRadius: radius.full, overflow: "hidden" }, style]}
      >
        <View className={className}>{children}</View>
      </GlassView>
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
      style={[{ borderRadius: radius.full }, style]}
    >
      {children}
    </View>
  );
}

/**
 * Floating pill bottom navigation bar using native Liquid Glass when supported
 * and falling back to Roam's `glass-blur` surface token elsewhere.
 */
export function GlassTabBar<T extends string>({
  tabs,
  activeTab,
  onTabPress,
  className,
  style,
}: GlassTabBarProps<T>) {
  return (
    <GlassSurface
      className={["flex-row items-center gap-xs rounded-full p-xs", className]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
            onPress={() => onTabPress(tab.key)}
            className={[
              "min-h-13 flex-1 items-center justify-center gap-xs rounded-full py-sm",
              isActive ? "bg-primary-yellow" : "bg-transparent",
            ].join(" ")}
            style={({ pressed }) => ({
              borderRadius: radius.full,
              opacity: pressed && !isActive ? 0.72 : 1,
            })}
          >
            <AppIcon
              icon={tab.icon}
              size="md"
              tone={isActive ? "onAccent" : "primary"}
            />
            <AppText
              variant="label"
              tone={isActive ? "onAccent" : "primary"}
              className={isActive ? "font-sans-bold" : "font-sans-medium"}
            >
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </GlassSurface>
  );
}
