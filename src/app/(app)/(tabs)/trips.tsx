import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Calendar from "lucide-react-native/icons/calendar";
import Clock from "lucide-react-native/icons/clock";
import Compass from "lucide-react-native/icons/compass";
import { AppIcon, AppText, Button, Card, SegmentedControl } from "@/components/ui";
import { spacing } from "@/theme";

type TripsSegment = "upcoming" | "past";

export default function TripsTabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [segment, setSegment] = useState<TripsSegment>("upcoming");

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 bg-surface-gray dark:bg-surface-dark"
      contentContainerStyle={{
        paddingTop: insets.top + spacing.base,
        paddingHorizontal: spacing.xl,
        paddingBottom: insets.bottom + 112,
        gap: spacing.lg,
      }}
    >
      <StatusBar style="dark" />

      <View className="gap-xs">
        <AppText variant="hero">Trips</AppText>
        <AppText variant="caption" tone="secondary">
          Your upcoming bookings, check-in codes, and past getaways.
        </AppText>
      </View>

      <SegmentedControl
        value={segment}
        onChange={setSegment}
        options={[
          { value: "upcoming", label: "Upcoming", icon: Calendar },
          { value: "past", label: "Past", icon: Clock },
        ]}
      />

      <Card elevated padding="lg" className="items-center gap-md py-2xl">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-lavender-tint">
          <AppIcon icon={Compass} size="lg" tone="lavender" />
        </View>
        <View className="items-center gap-xs">
          <AppText variant="title">
            {segment === "upcoming" ? "No upcoming trips yet" : "No past trips yet"}
          </AppText>
          <AppText variant="caption" tone="secondary" className="text-center">
            {segment === "upcoming"
              ? "When you reserve a cabin, beach house, or villa, your itinerary and house rules appear here."
              : "Completed stays will be archived here for quick rebooking."}
          </AppText>
        </View>
        <Button
          variant="primary"
          size="md"
          title="Explore stays"
          onPress={() => router.navigate("/search")}
        />
      </Card>
    </ScrollView>
  );
}
