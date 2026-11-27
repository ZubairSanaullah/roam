import { useRef, type ComponentRef } from "react";
import { View } from "react-native";
import { BlurTargetView } from "expo-blur";
import { Tabs, usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Calendar from "lucide-react-native/icons/calendar";
import Home from "lucide-react-native/icons/home";
import Search from "lucide-react-native/icons/search";
import User from "lucide-react-native/icons/user";
import { GlassTabBar, type GlassTabItem } from "@/components/ui";
import { spacing } from "@/theme";

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

export default function ProtectedTabsLayout() {
  const blurTargetRef = useRef<ComponentRef<typeof View> | null>(null);
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();

  const activeTab: TabRouteName = pathname.endsWith("/search")
    ? "search"
    : pathname.endsWith("/trips")
      ? "trips"
      : pathname.endsWith("/profile")
        ? "profile"
        : "home";

  const handleTabPress = (key: TabRouteName) => {
    if (key === activeTab) {
      return;
    }
    router.navigate(`/${key}`);
  };

  return (
    <View className="flex-1">
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <Tabs
          tabBar={() => null}
          screenOptions={{
            headerShown: false,
            animation: "none",
          }}
        >
          <Tabs.Screen name="home" options={{ title: "Home" }} />
          <Tabs.Screen name="search" options={{ title: "Search" }} />
          <Tabs.Screen name="trips" options={{ title: "Trips" }} />
          <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        </Tabs>
      </BlurTargetView>

      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          left: spacing.lg,
          right: spacing.lg,
          bottom: Math.max(insets.bottom, spacing.md),
        }}
      >
        <GlassTabBar
          variant="floating"
          blurTarget={blurTargetRef}
          tabs={TAB_ITEMS}
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
      </View>
    </View>
  );
}
