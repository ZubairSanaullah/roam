import { useState } from "react";
import { ScrollView, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import FileText from "lucide-react-native/icons/file-text";
import Heart from "lucide-react-native/icons/heart";
import MapPin from "lucide-react-native/icons/map-pin";
import Star from "lucide-react-native/icons/star";
import Users from "lucide-react-native/icons/users";
import X from "lucide-react-native/icons/x";
import { Alert, AppIcon, AppText, Badge, Button, Card } from "@/components/ui";
import { LOCAL_STAYS } from "@/data/stays";
import { radius, spacing, useThemeColors } from "@/theme";

export default function StayDetailSheet() {
  const router = useRouter();
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const stay = LOCAL_STAYS.find((item) => item.id === id) ?? LOCAL_STAYS[0];
  const [saved, setSaved] = useState(false);
  const [reserveNotice, setReserveNotice] = useState(false);

  return (
    <ScrollView
      className="flex-1 bg-surface-white dark:bg-surface-elevated-dark"
      contentContainerStyle={{
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.base,
        paddingBottom: spacing["3xl"],
        gap: spacing.base,
      }}
    >
      <View className="flex-row items-center justify-between">
        <Badge label={stay.category} variant="info" />
        <Button
          variant="subtle"
          size="sm"
          iconOnly
          leftIcon={X}
          accessibilityLabel="Close stay details"
          onPress={() => router.back()}
        />
      </View>

      <View
        className="h-56 w-full overflow-hidden rounded-xl bg-surface-gray"
        style={{ borderRadius: radius.xl, borderCurve: "continuous" }}
      >
        <Image
          source={{ uri: stay.imageUri }}
          contentFit="cover"
          transition={200}
          style={{ width: "100%", height: "100%" }}
          accessibilityLabel={stay.title}
        />
      </View>

      <View className="gap-xs">
        <AppText variant="hero">{stay.title}</AppText>

        <View className="flex-row flex-wrap items-center gap-md">
          <View className="flex-row items-center gap-xs">
            <AppIcon icon={MapPin} size="sm" tone="secondary" />
            <AppText variant="caption" tone="secondary">
              {stay.location}
            </AppText>
          </View>

          <View className="flex-row items-center gap-xs">
            <Star
              size={14}
              strokeWidth={1.85}
              color={colors.primary}
              fill={colors.primary}
            />
            <AppText variant="caption" className="font-sans-bold">
              {stay.rating}
            </AppText>
            <AppText variant="caption" tone="secondary">
              ({stay.reviewCount} reviews)
            </AppText>
          </View>

          <View className="flex-row items-center gap-xs">
            <AppIcon icon={Users} size="sm" tone="secondary" />
            <AppText variant="caption" tone="secondary">
              Up to {stay.maxGuests} guests
            </AppText>
          </View>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-sm">
        {stay.amenities.map((amenity) => (
          <Badge
            key={amenity.label}
            label={amenity.label}
            variant="neutral"
            icon={amenity.icon}
          />
        ))}
      </View>

      <AppText variant="body" tone="secondary">
        {stay.description}
      </AppText>

      <View className="gap-sm">
        <AppText variant="title">Stay policies</AppText>
        {stay.policies.map((policy) => (
          <Card key={policy.title} variant="lavender" padding="md" className="gap-xs">
            <View className="flex-row items-center gap-sm">
              <AppIcon icon={FileText} size="sm" tone="lavender" />
              <AppText variant="caption" className="font-sans-bold">
                {policy.title}
              </AppText>
            </View>
            <AppText variant="caption" tone="secondary">
              {policy.detail}
            </AppText>
          </Card>
        ))}
      </View>

      {reserveNotice ? (
        <Alert
          variant="info"
          message="Booking checkout will connect once Sanity stays and payments are wired."
          onDismiss={() => setReserveNotice(false)}
        />
      ) : null}

      <View className="flex-row items-center justify-between gap-md pt-sm">
        <View>
          <AppText variant="heading">${stay.pricePerNight}</AppText>
          <AppText variant="caption" tone="secondary">
            per night
          </AppText>
        </View>

        <View className="flex-1 flex-row gap-sm">
          <Button
            variant="secondary"
            size="lg"
            iconOnly
            leftIcon={Heart}
            accessibilityLabel={saved ? "Remove from saved stays" : "Save stay"}
            onPress={() => {
              Haptics.selectionAsync();
              setSaved((prev) => !prev);
            }}
          />
          <Button
            variant="primary"
            size="lg"
            title="Request stay"
            className="flex-1"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setReserveNotice(true);
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
