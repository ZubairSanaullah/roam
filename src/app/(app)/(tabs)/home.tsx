import { useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, StyleSheet, View } from "react-native";
import { useUser } from "@clerk/expo";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Building2 from "lucide-react-native/icons/building-2";
import Home from "lucide-react-native/icons/home";
import Search from "lucide-react-native/icons/search";
import TreePalm from "lucide-react-native/icons/tree-palm";
import TreePine from "lucide-react-native/icons/tree-pine";
import Waves from "lucide-react-native/icons/waves";
import { FeaturedStayCard } from "@/components/home/featured-stay-card";
import { NaturalSearchBar } from "@/components/home/natural-search-bar";
import { Alert, AppIcon, AppText, Button, Card, Chip, PressableScale, RoamLogo } from "@/components/ui";
import type { StayCategory } from "@/data/stays";
import { useLiveStays } from "@/hooks/use-stays";
import { radius, spacing, useThemeColors } from "@/theme";

const CATEGORY_OPTIONS: readonly { label: StayCategory; icon: typeof Home }[] = [
  { label: "All Stays", icon: Home },
  { label: "Cabins", icon: TreePine },
  { label: "Beach", icon: Waves },
  { label: "City", icon: Building2 },
  { label: "Villas", icon: TreePalm },
] as const;

export default function HomeTabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const reducedMotion = useReducedMotion();
  const { user } = useUser();

  const { stays, loading, refreshing, error, reload, refresh } = useLiveStays();

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<StayCategory>("All Stays");

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.set(event.contentOffset.y);
  });

  const greetingAnimatedStyle = useAnimatedStyle(() => {
    if (reducedMotion) {
      return { opacity: 1, transform: [{ translateY: 0 }] };
    }
    const y = scrollY.get();
    return {
      opacity: interpolate(y, [0, 56], [1, 0.35], Extrapolation.CLAMP),
      transform: [{ translateY: interpolate(y, [0, 56], [0, -4], Extrapolation.CLAMP) }],
    };
  });

  const firstName =
    user?.firstName ||
    user?.fullName?.split(" ")[0] ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "Guest";
  const initial = firstName.charAt(0).toUpperCase();

  const filteredStays =
    selectedCategory === "All Stays"
      ? stays
      : stays.filter((stay) => stay.category === selectedCategory);

  const handleCategoryPress = (category: StayCategory) => {
    if (category !== selectedCategory) {
      Haptics.selectionAsync();
      setSelectedCategory(category);
    }
  };

  const handleSearchSubmit = () => {
    const trimmed = query.trim();
    if (trimmed) {
      router.navigate({ pathname: "/search", params: { q: trimmed } });
    } else {
      router.navigate("/search");
    }
  };

  const handleOpenSearchTab = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleSearchSubmit();
  };

  return (
    <Animated.ScrollView
      onScroll={onScroll}
      scrollEventThrottle={16}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          tintColor={colors.textPrimary}
          colors={[colors.textPrimary]}
        />
      }
      className="flex-1 bg-surface-white dark:bg-surface-dark"
      contentContainerStyle={{
        paddingTop: insets.top + spacing.sm,
        paddingHorizontal: spacing.xl,
        paddingBottom: insets.bottom + 112,
      }}
    >
      <StatusBar style="dark" />

      {/* Top Brand & Profile Avatar */}
      <View className="flex-row items-center justify-between">
        <RoamLogo size="lg" />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={() => router.navigate("/profile")}
          hitSlop={6}
          className="h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-badge-yellow-bg"
          style={({ pressed }) => ({
            borderRadius: radius.full,
            opacity: pressed ? 0.82 : 1,
          })}
        >
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              contentFit="cover"
              style={StyleSheet.absoluteFill}
              accessibilityLabel={`${firstName}'s avatar`}
            />
          ) : (
            <AppText variant="title" tone="onAccent">
              {initial}
            </AppText>
          )}
        </Pressable>
      </View>

      {/* Greeting + Quick Search Button + Single-Line Bold Headline */}
      <View className="mt-lg gap-xs">
        <View className="flex-row items-center justify-between gap-base">
          <Animated.View style={greetingAnimatedStyle}>
            <AppText variant="title" tone="secondary" className="font-sans-medium">
              Hey, {firstName} 👋
            </AppText>
          </Animated.View>

          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Open search"
            onPress={handleOpenSearchTab}
            hitSlop={6}
            pressedScale={0.95}
            className="h-14 w-14 items-center justify-center rounded-xl bg-surface-gray dark:bg-surface-subtle-dark"
            style={{ borderRadius: radius.xl, borderCurve: "continuous" }}
          >
            <AppIcon icon={Search} size="lg" tone="primary" />
          </PressableScale>
        </View>

        <AppText
          variant="hero"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.78}
        >
          Find your next stay
        </AppText>
      </View>

      {/* Lavender Natural-Language Search Bar */}
      <View className="mt-lg">
        <NaturalSearchBar
          value={query}
          onChangeText={setQuery}
          onSubmit={handleSearchSubmit}
        />
      </View>

      {/* Category Filter Chips */}
      <View className="mt-lg flex-row flex-wrap gap-sm">
        {CATEGORY_OPTIONS.map((category) => (
          <Chip
            key={category.label}
            label={category.label}
            icon={category.icon}
            accent="yellow"
            selected={selectedCategory === category.label}
            onPress={() => handleCategoryPress(category.label)}
          />
        ))}
      </View>

      {/* Featured Stay Cards / Loading / Error / Empty */}
      <View className="mt-lg gap-base">
        {error && stays.length > 0 ? (
          <Alert variant="error" message={error} />
        ) : null}

        {loading && stays.length === 0 ? (
          <Card padding="lg" className="items-center gap-md py-2xl">
            <ActivityIndicator color={colors.textPrimary} />
            <AppText variant="caption" tone="secondary">
              Loading live stays...
            </AppText>
          </Card>
        ) : error && stays.length === 0 ? (
          <Card padding="lg" className="gap-md">
            <Alert variant="error" message={error} />
            <Button variant="primary" size="md" title="Try again" onPress={reload} />
          </Card>
        ) : filteredStays.length === 0 ? (
          <Card padding="lg" className="items-center gap-md py-2xl">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-lavender-tint">
              <AppIcon icon={Home} size="lg" tone="lavender" />
            </View>
            <View className="items-center gap-xs">
              <AppText variant="title">No stays in {selectedCategory}</AppText>
              <AppText variant="caption" tone="secondary" className="text-center">
                Try another category or refresh to load the latest stays.
              </AppText>
            </View>
            <Button
              variant="primary"
              size="md"
              title={selectedCategory === "All Stays" ? "Refresh" : "Show all stays"}
              onPress={() => {
                if (selectedCategory === "All Stays") {
                  reload();
                } else {
                  setSelectedCategory("All Stays");
                }
              }}
            />
          </Card>
        ) : (
          filteredStays.map((stay, index) => (
            <FeaturedStayCard
              key={stay.id}
              stay={stay}
              index={index}
              onPress={() =>
                router.push({
                  pathname: "/stay/[id]",
                  params: { id: stay.id },
                })
              }
            />
          ))
        )}
      </View>
    </Animated.ScrollView>
  );
}
