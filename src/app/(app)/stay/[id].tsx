import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import BedDouble from "lucide-react-native/icons/bed-double";
import CheckCircle2 from "lucide-react-native/icons/check-circle-2";
import Clock from "lucide-react-native/icons/clock";
import FileText from "lucide-react-native/icons/file-text";
import Heart from "lucide-react-native/icons/heart";
import MapPin from "lucide-react-native/icons/map-pin";
import ShieldCheck from "lucide-react-native/icons/shield-check";
import Star from "lucide-react-native/icons/star";
import Users from "lucide-react-native/icons/users";
import X from "lucide-react-native/icons/x";
import { Alert, AppIcon, AppText, Badge, Button, Card } from "@/components/ui";
import { useLiveStay } from "@/hooks/use-stays";
import { radius, spacing, useThemeColors } from "@/theme";

export default function StayDetailSheet() {
  const router = useRouter();
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const { stay, loading, error, reload } = useLiveStay(id);
  const [saved, setSaved] = useState(false);
  const [reserveNotice, setReserveNotice] = useState(false);
  const [galleryWidth, setGalleryWidth] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const handleGalleryScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (galleryWidth <= 0) return;
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / galleryWidth);
    if (nextIndex !== activePhotoIndex) {
      setActivePhotoIndex(nextIndex);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center gap-md bg-surface-white px-xl dark:bg-surface-elevated-dark">
        <ActivityIndicator color={colors.textPrimary} />
        <AppText variant="caption" tone="secondary">
          Loading stay details...
        </AppText>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center gap-md bg-surface-white px-xl dark:bg-surface-elevated-dark">
        <Alert variant="error" message={error} />
        <View className="flex-row gap-sm">
          <Button variant="primary" size="md" title="Try again" className="flex-1" onPress={reload} />
          <Button variant="subtle" size="md" title="Close" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  if (!stay) {
    return (
      <View className="flex-1 justify-center bg-surface-white px-xl dark:bg-surface-elevated-dark">
        <Card padding="lg" className="items-center gap-md">
          <AppText variant="title">Stay not found</AppText>
          <AppText variant="caption" tone="secondary" className="text-center">
            This listing may have been unpublished or moved.
          </AppText>
          <Button variant="primary" size="md" title="Go back" onPress={() => router.back()} />
        </Card>
      </View>
    );
  }

  const bedroomLabel = stay.bedrooms === 0 ? "Studio" : `${stay.bedrooms} bd`;
  const hostInitial = stay.host?.name.charAt(0).toUpperCase() || "R";

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

      {/* Multi-photo gallery */}
      <View
        onLayout={(event) => setGalleryWidth(event.nativeEvent.layout.width)}
        className="relative h-60 w-full overflow-hidden rounded-xl bg-surface-gray"
        style={{ borderRadius: radius.xl, borderCurve: "continuous" }}
      >
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleGalleryScroll}
          scrollEventThrottle={16}
        >
          {stay.images.map((image) => (
            <View
              key={image._key}
              style={{ width: galleryWidth > 0 ? galleryWidth : 340, height: "100%" }}
            >
              <Image
                source={{ uri: image.url }}
                contentFit="cover"
                transition={200}
                style={StyleSheet.absoluteFill}
                accessibilityLabel={image.alt}
              />
            </View>
          ))}
        </ScrollView>

        {stay.images.length > 1 ? (
          <View
            className="absolute bottom-md right-md rounded-full bg-surface-white px-md py-xs shadow-card"
            style={{ borderRadius: radius.full }}
          >
            <AppText variant="label" tone="onAccent" className="font-sans-bold">
              {activePhotoIndex + 1} / {stay.images.length}
            </AppText>
          </View>
        ) : null}
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
        </View>

        <View className="flex-row flex-wrap items-center gap-md pt-xs">
          <View className="flex-row items-center gap-xs">
            <AppIcon icon={Users} size="sm" tone="secondary" />
            <AppText variant="caption" tone="secondary">
              Up to {stay.maxGuests} guests
            </AppText>
          </View>

          <View className="flex-row items-center gap-xs">
            <AppIcon icon={BedDouble} size="sm" tone="secondary" />
            <AppText variant="caption" tone="secondary">
              {bedroomLabel} · {stay.beds} {stay.beds === 1 ? "bed" : "beds"} · {stay.bathrooms}{" "}
              {stay.bathrooms === 1 ? "bath" : "baths"}
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

      {stay.tagline ? (
        <AppText variant="title" className="font-sans-semibold">
          {stay.tagline}
        </AppText>
      ) : null}

      <AppText variant="body" tone="secondary">
        {stay.description}
      </AppText>

      {stay.highlights.length > 0 ? (
        <Card padding="md" className="gap-sm">
          <AppText variant="caption" className="font-sans-bold">
            Highlights
          </AppText>
          {stay.highlights.map((highlight) => (
            <View key={highlight} className="flex-row items-start gap-sm">
              <AppIcon icon={CheckCircle2} size="sm" tone="success" />
              <AppText variant="caption" tone="secondary" className="flex-1">
                {highlight}
              </AppText>
            </View>
          ))}
        </Card>
      ) : null}

      {stay.sleepingArrangements.length > 0 ? (
        <View className="gap-sm">
          <AppText variant="title">Where you will sleep</AppText>
          <View className="flex-row flex-wrap gap-sm">
            {stay.sleepingArrangements.map((room) => (
              <Card key={room._key} padding="md" className="min-w-36 flex-1 gap-xs">
                <AppIcon icon={BedDouble} size="sm" tone="primary" />
                <AppText variant="caption" className="font-sans-bold">
                  {room.roomName}
                </AppText>
                <AppText variant="caption" tone="secondary">
                  {room.bedDetails}
                </AppText>
              </Card>
            ))}
          </View>
        </View>
      ) : null}

      {stay.neighborhoodOverview ? (
        <View className="gap-xs">
          <AppText variant="title">Location</AppText>
          <AppText variant="body" tone="secondary">
            {stay.neighborhoodOverview}
          </AppText>
        </View>
      ) : null}

      {stay.host ? (
        <Card padding="md" className="gap-sm">
          <View className="flex-row items-center gap-md">
            <View className="h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-badge-yellow-bg">
              {stay.host.avatarUrl ? (
                <Image
                  source={{ uri: stay.host.avatarUrl }}
                  contentFit="cover"
                  style={StyleSheet.absoluteFill}
                  accessibilityLabel={stay.host.avatarAlt || stay.host.name}
                />
              ) : (
                <AppText variant="title" tone="onAccent">
                  {hostInitial}
                </AppText>
              )}
            </View>
            <View className="flex-1 gap-xs">
              <View className="flex-row flex-wrap items-center gap-sm">
                <AppText variant="title">Hosted by {stay.host.name}</AppText>
                {stay.host.isSuperhost ? (
                  <Badge label="Superhost" variant="yellow" icon={ShieldCheck} />
                ) : null}
              </View>
              <AppText variant="caption" tone="secondary">
                {stay.host.responseTime ? `Responds ${stay.host.responseTime}` : "Verified host"}
                {stay.host.memberSince ? ` · Hosting since ${stay.host.memberSince}` : ""}
              </AppText>
            </View>
          </View>
          {stay.host.bio ? (
            <AppText variant="caption" tone="secondary">
              {stay.host.bio}
            </AppText>
          ) : null}
        </Card>
      ) : null}

      <View className="gap-sm">
        <AppText variant="title">Check-in & stay policies</AppText>

        <Card padding="md" className="flex-row items-center gap-sm">
          <AppIcon icon={Clock} size="sm" tone="primary" />
          <AppText variant="caption" className="font-sans-medium">
            Check-in {stay.checkInTime} · Check-out {stay.checkOutTime}
          </AppText>
        </Card>

        {stay.policies.map((policy) => (
          <Card key={policy._id} variant="lavender" padding="md" className="gap-xs">
            <View className="flex-row items-center gap-sm">
              <AppIcon icon={FileText} size="sm" tone="lavender" />
              <AppText variant="caption" className="font-sans-bold">
                {policy.title}
              </AppText>
            </View>
            <AppText variant="caption" className="font-sans-medium">
              {policy.summary}
            </AppText>
            <AppText variant="caption" tone="secondary">
              {policy.exactText}
            </AppText>
          </Card>
        ))}

        {stay.staySpecificNotes.map((note) => (
          <Card key={note._key} padding="md" className="gap-xs">
            <AppText variant="caption" className="font-sans-bold">
              {note.title}
            </AppText>
            <AppText variant="caption" tone="secondary">
              {note.detail}
            </AppText>
          </Card>
        ))}
      </View>

      {reserveNotice ? (
        <Alert
          variant="info"
          message="Booking checkout will connect once payments and reservations are wired."
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
