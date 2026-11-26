import { useState } from "react";
import { ScrollView, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArrowUpDown from "lucide-react-native/icons/arrow-up-down";
import Bath from "lucide-react-native/icons/bath";
import Compass from "lucide-react-native/icons/compass";
import DollarSign from "lucide-react-native/icons/dollar-sign";
import PawPrint from "lucide-react-native/icons/paw-print";
import Search from "lucide-react-native/icons/search";
import Star from "lucide-react-native/icons/star";
import X from "lucide-react-native/icons/x";
import {
  AppIcon,
  AppText,
  Button,
  Card,
  Chip,
  Input,
  ListingCard,
  SegmentedControl,
} from "@/components/ui";
import {
  LOCAL_STAYS,
  STAY_CATEGORIES,
  searchStays,
  type StayCategory,
  type StaySort,
} from "@/data/stays";
import { spacing } from "@/theme";

export default function SearchTabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { q } = useLocalSearchParams<{ q?: string }>();

  const [prevParamQ, setPrevParamQ] = useState(q);
  const [draftQuery, setDraftQuery] = useState(q ?? "");
  const [submittedQuery, setSubmittedQuery] = useState(q ?? "");
  const [selectedCategory, setSelectedCategory] = useState<StayCategory>("All Stays");
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);
  const [hotTubOnly, setHotTubOnly] = useState(false);
  const [underThreeHundred, setUnderThreeHundred] = useState(false);
  const [sort, setSort] = useState<StaySort>("recommended");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  if (q !== prevParamQ) {
    setPrevParamQ(q);
    if (typeof q === "string") {
      setDraftQuery(q);
      setSubmittedQuery(q);
    }
  }

  const results = searchStays(LOCAL_STAYS, {
    query: submittedQuery,
    category: selectedCategory,
    petFriendlyOnly,
    hotTubOnly,
    underThreeHundred,
    sort,
  });

  const handleSubmitQuery = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSubmittedQuery(draftQuery.trim());
  };

  const handleClearSearch = () => {
    Haptics.selectionAsync();
    setDraftQuery("");
    setSubmittedQuery("");
    setSelectedCategory("All Stays");
    setPetFriendlyOnly(false);
    setHotTubOnly(false);
    setUnderThreeHundred(false);
  };

  const toggleFavorite = (id: string) => {
    Haptics.selectionAsync();
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const hasActiveConstraints =
    Boolean(submittedQuery) ||
    selectedCategory !== "All Stays" ||
    petFriendlyOnly ||
    hotTubOnly ||
    underThreeHundred;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      className="flex-1 bg-surface-gray dark:bg-surface-dark"
      contentContainerStyle={{
        paddingTop: insets.top + spacing.base,
        paddingHorizontal: spacing.xl,
        paddingBottom: insets.bottom + 112,
        gap: spacing.base,
      }}
    >
      <StatusBar style="dark" />

      <View className="gap-xs">
        <AppText variant="hero">Search stays</AppText>
        <AppText variant="caption" tone="secondary">
          Describe your trip and press return, or combine instant filters below.
        </AppText>
      </View>

      <Input
        variant="search"
        leadingIcon={Search}
        trailingIcon={draftQuery ? X : undefined}
        trailingLabel="Clear search text"
        onTrailingPress={() => {
          setDraftQuery("");
          setSubmittedQuery("");
        }}
        value={draftQuery}
        onChangeText={setDraftQuery}
        onSubmitEditing={handleSubmitQuery}
        returnKeyType="search"
        placeholder="e.g. quiet pet friendly cabin under $300"
      />

      {/* Category Chips */}
      <View className="flex-row flex-wrap gap-sm">
        {STAY_CATEGORIES.map((category) => (
          <Chip
            key={category}
            label={category}
            accent="yellow"
            selected={selectedCategory === category}
            onPress={() => {
              Haptics.selectionAsync();
              setSelectedCategory(category);
            }}
          />
        ))}
      </View>

      {/* Constraint Chips */}
      <View className="flex-row flex-wrap gap-sm">
        <Chip
          label="Pet Friendly"
          icon={PawPrint}
          selected={petFriendlyOnly}
          onPress={() => {
            Haptics.selectionAsync();
            setPetFriendlyOnly((prev) => !prev);
          }}
        />
        <Chip
          label="Hot Tub"
          icon={Bath}
          selected={hotTubOnly}
          onPress={() => {
            Haptics.selectionAsync();
            setHotTubOnly((prev) => !prev);
          }}
        />
        <Chip
          label="Under $300"
          icon={DollarSign}
          selected={underThreeHundred}
          onPress={() => {
            Haptics.selectionAsync();
            setUnderThreeHundred((prev) => !prev);
          }}
        />
      </View>

      {/* Instant Sort */}
      <SegmentedControl
        value={sort}
        onChange={(nextSort) => {
          Haptics.selectionAsync();
          setSort(nextSort);
        }}
        options={[
          { value: "recommended", label: "Best match", icon: Compass },
          { value: "rating_desc", label: "Top rated", icon: Star },
          { value: "price_asc", label: "Lowest price", icon: ArrowUpDown },
        ]}
      />

      {/* Results Header */}
      <View className="flex-row items-center justify-between pt-xs">
        <AppText variant="caption" tone="secondary">
          {results.length} {results.length === 1 ? "stay" : "stays"} found
          {submittedQuery ? ` for "${submittedQuery}"` : ""}
        </AppText>
        {hasActiveConstraints ? (
          <Button variant="ghost" size="sm" title="Reset" onPress={handleClearSearch} />
        ) : null}
      </View>

      {/* Results or Empty State */}
      {results.length === 0 ? (
        <Card padding="lg" className="items-center gap-md py-2xl">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-lavender-tint">
            <AppIcon icon={Search} size="lg" tone="lavender" />
          </View>
          <View className="items-center gap-xs">
            <AppText variant="title">No matching stays</AppText>
            <AppText variant="caption" tone="secondary" className="text-center">
              Try relaxing your price limit, switching categories, or clearing filters.
            </AppText>
          </View>
          <Button
            variant="primary"
            size="md"
            title="Show all stays"
            onPress={handleClearSearch}
          />
        </Card>
      ) : (
        <View className="gap-md">
          {results.map((stay) => (
            <ListingCard
              key={stay.id}
              title={stay.title}
              location={stay.location}
              rating={stay.rating}
              reviewCount={stay.reviewCount}
              pricePerNight={`$${stay.pricePerNight}`}
              imageUri={stay.imageUri}
              amenities={stay.amenities.slice(0, 2)}
              favorited={favoriteIds.includes(stay.id)}
              onToggleFavorite={() => toggleFavorite(stay.id)}
              onPress={() =>
                router.push({
                  pathname: "/stay/[id]",
                  params: { id: stay.id },
                })
              }
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
