import type { ComponentProps } from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import Calendar from "lucide-react-native/icons/calendar";
import Home from "lucide-react-native/icons/home";
import Search from "lucide-react-native/icons/search";
import User from "lucide-react-native/icons/user";
import { GlassTabBar, type GlassTabItem } from "@/components/ui";

export const unstable_settings = {
  anchor: "home",
};

type TabRouteName = "home" | "search" | "trips" | "profile";

const TAB_ITEMS: readonly GlassTabItem<TabRouteName>[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "search", label: "Search", icon: Search },
  { key: "trips", label: "Trips", icon: Calendar },
  { key: "profile", label: "Profile", icon: User },
] as const;

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>["tabBar"]>>[0];

function RoamFloatingTabBar({
  state,
  emitter,
  navigateToTab,
  insets,
}: TabBarProps) {
  const activeRoute = state.routes[state.index]?.name;
  const activeTab: TabRouteName =
    activeRoute === "search" || activeRoute === "trips" || activeRoute === "profile"
      ? activeRoute
      : "home";

  const handleTabPress = (key: TabRouteName) => {
    const targetRoute = state.routes.find((route) => route.name === key);
    if (!targetRoute) {
      return;
    }

    const event = emitter.emit({
      type: "tabPress",
      target: targetRoute.key,
      canPreventDefault: true,
    });

    if (activeTab !== key && !event.defaultPrevented) {
      navigateToTab(targetRoute.key);
    }
  };

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <GlassTabBar
        variant="docked"
        bottomInset={insets.bottom}
        tabs={TAB_ITEMS}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
}

export default function ProtectedTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
      tabBar={(props) => <RoamFloatingTabBar {...props} />}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="trips" options={{ title: "Trips" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
