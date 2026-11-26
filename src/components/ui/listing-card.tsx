import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import { Image } from "expo-image";
import type { LucideIcon } from "lucide-react-native";
import Heart from "lucide-react-native/icons/heart";
import MapPin from "lucide-react-native/icons/map-pin";
import Star from "lucide-react-native/icons/star";
import { radius, useThemeColors } from "@/theme";
import { AppIcon } from "./app-icon";
import { AppText } from "./app-text";
import { Badge } from "./badge";
import { Card } from "./card";

export interface ListingAmenity {
  label: string;
  icon: LucideIcon;
}

export interface ListingCardProps {
  title: string;
  location: string;
  rating: string;
  reviewCount: number;
  pricePerNight: string;
  imageUri: string;
  amenities?: readonly ListingAmenity[];
  favorited?: boolean;
  onToggleFavorite?: () => void;
  onPress?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Horizontal property summary card showing thumbnail, favorite toggle, title,
 * location, rating, amenity chips, and nightly rate.
 */
export function ListingCard({
  title,
  location,
  rating,
  reviewCount,
  pricePerNight,
  imageUri,
  amenities = [],
  favorited = false,
  onToggleFavorite,
  onPress,
  className,
  style,
}: ListingCardProps) {
  const colors = useThemeColors();

  return (
    <Card elevated padding="sm" className={className} style={style}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${location}, ${pricePerNight} per night`}
        onPress={onPress}
        className="flex-row gap-md"
        style={({ pressed }) => ({ opacity: pressed && onPress ? 0.92 : 1 })}
      >
        <View
          className="relative h-36 w-32 overflow-hidden rounded-md bg-surface-gray dark:bg-surface-subtle-dark"
          style={{ borderRadius: radius.md, borderCurve: "continuous" }}
        >
          <Image
            source={{ uri: imageUri }}
            contentFit="cover"
            style={{ width: "100%", height: "100%" }}
            accessibilityLabel={title}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={favorited ? "Remove from favorites" : "Add to favorites"}
            accessibilityState={{ selected: favorited }}
            onPress={onToggleFavorite}
            hitSlop={6}
            className="absolute right-sm top-sm h-9 w-9 items-center justify-center rounded-full bg-surface-white shadow-card dark:bg-surface-elevated-dark"
            style={({ pressed }) => ({
              borderRadius: radius.full,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Heart
              size={16}
              strokeWidth={1.85}
              color={favorited ? colors.errorFg : colors.textPrimary}
              fill={favorited ? colors.errorFg : "transparent"}
            />
          </Pressable>
        </View>

        <View className="flex-1 justify-between py-xs">
          <View className="gap-xs">
            <AppText variant="title" numberOfLines={2}>
              {title}
            </AppText>

            <View className="flex-row items-center gap-xs">
              <AppIcon icon={MapPin} size="sm" tone="secondary" />
              <AppText variant="caption" tone="secondary" numberOfLines={1}>
                {location}
              </AppText>
            </View>

            <View className="flex-row items-center gap-xs">
              <Star
                size={15}
                strokeWidth={1.85}
                color={colors.primary}
                fill={colors.primary}
              />
              <AppText variant="caption" className="font-sans-bold">
                {rating}
              </AppText>
              <AppText variant="caption" tone="secondary">
                ({reviewCount})
              </AppText>
            </View>
          </View>

          {amenities.length > 0 ? (
            <View className="flex-row flex-wrap gap-xs py-xs">
              {amenities.map((amenity) => (
                <Badge
                  key={amenity.label}
                  label={amenity.label}
                  variant="neutral"
                  icon={amenity.icon}
                />
              ))}
            </View>
          ) : null}

          <View className="flex-row items-baseline gap-xs">
            <AppText variant="title">{pricePerNight}</AppText>
            <AppText variant="caption" tone="secondary">
              / night
            </AppText>
          </View>
        </View>
      </Pressable>
    </Card>
  );
}
