import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";
import ArrowRight from "lucide-react-native/icons/arrow-right";
import Bath from "lucide-react-native/icons/bath";
import Bookmark from "lucide-react-native/icons/bookmark";
import BotMessageSquare from "lucide-react-native/icons/bot-message-square";
import Briefcase from "lucide-react-native/icons/briefcase";
import Building2 from "lucide-react-native/icons/building-2";
import Calendar from "lucide-react-native/icons/calendar";
import ChevronRight from "lucide-react-native/icons/chevron-right";
import CreditCard from "lucide-react-native/icons/credit-card";
import FileText from "lucide-react-native/icons/file-text";
import Heart from "lucide-react-native/icons/heart";
import Home from "lucide-react-native/icons/home";
import List from "lucide-react-native/icons/list";
import Lock from "lucide-react-native/icons/lock";
import MapIcon from "lucide-react-native/icons/map";
import MapPin from "lucide-react-native/icons/map-pin";
import PawPrint from "lucide-react-native/icons/paw-print";
import Search from "lucide-react-native/icons/search";
import Settings from "lucide-react-native/icons/settings";
import Share from "lucide-react-native/icons/share";
import SlidersHorizontal from "lucide-react-native/icons/sliders-horizontal";
import Star from "lucide-react-native/icons/star";
import TreePalm from "lucide-react-native/icons/tree-palm";
import TreePine from "lucide-react-native/icons/tree-pine";
import User from "lucide-react-native/icons/user";
import Waves from "lucide-react-native/icons/waves";
import {
  Alert,
  AppIcon,
  AppText,
  Badge,
  Button,
  Card,
  Chip,
  GlassTabBar,
  GoogleIcon,
  Input,
  ListingCard,
  ProfileRow,
  SegmentedControl,
  Stepper,
  Toggle,
} from "@/components/ui";
import { palette, radius } from "@/theme";

const COLOR_SWATCHES = [
  { name: "Primary Yellow", token: palette.primaryYellow, swatchClass: "bg-primary-yellow" },
  { name: "Lavender", token: palette.lavender, swatchClass: "bg-lavender" },
  { name: "Text Primary", token: palette.textPrimary, swatchClass: "bg-text-primary" },
  { name: "Text Secondary", token: palette.textSecondary, swatchClass: "bg-text-secondary" },
  {
    name: "Surface White",
    token: palette.surfaceWhite,
    swatchClass: "bg-surface-white border border-border-gray",
  },
  {
    name: "Surface Gray",
    token: palette.surfaceGray,
    swatchClass: "bg-surface-gray border border-border-gray",
  },
  { name: "Border Gray", token: palette.borderGray, swatchClass: "bg-border-gray" },
  {
    name: "Glass Blur",
    token: palette.glassBlur,
    swatchClass: "bg-glass-blur border border-border-gray",
  },
] as const;

const PILL_FILTERS = ["Cabins", "Under $300", "Pet Friendly", "Quiet"] as const;

const CATEGORY_CHIPS = [
  { label: "All Stays", icon: Home },
  { label: "Cabins", icon: TreePine },
  { label: "Beach", icon: Waves },
  { label: "City", icon: Building2 },
  { label: "Villas", icon: TreePalm },
] as const;

const ICONOGRAPHY_SET = [
  { label: "Home", icon: Home },
  { label: "Search", icon: Search },
  { label: "Heart", icon: Heart },
  { label: "Calendar", icon: Calendar },
  { label: "User", icon: User },
  { label: "Settings", icon: Settings },
  { label: "MapPin", icon: MapPin },
  { label: "Filters", icon: SlidersHorizontal },
] as const;

const TAB_ITEMS = [
  { key: "home", label: "Home", icon: Home },
  { key: "search", label: "Search", icon: Search },
  { key: "trips", label: "Trips", icon: Calendar },
  { key: "profile", label: "Profile", icon: User },
] as const;

const SAMPLE_CABIN_IMAGE =
  "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80";

export default function Index() {
  const [selectedPill, setSelectedPill] = useState<string>("Cabins");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Stays");
  const [searchValue, setSearchValue] = useState("Cabins in California");
  const [defaultNameValue, setDefaultNameValue] = useState("");
  const [focusedNameValue, setFocusedNameValue] = useState("Joanna Smith");
  const [passwordValue, setPasswordValue] = useState("roam-secret");
  const [favorited, setFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "search" | "trips" | "profile">("home");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [toggleEnabled, setToggleEnabled] = useState(true);
  const [guestCount, setGuestCount] = useState(1);
  const [showSuccess, setShowSuccess] = useState(true);
  const [showError, setShowError] = useState(true);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 bg-surface-gray dark:bg-surface-dark"
      contentContainerClassName="gap-lg p-base pb-3xl"
    >
      <Stack.Screen options={{ title: "Roam Design System" }} />

      {/* 01. Brand */}
      <Card elevated className="gap-sm">
        <AppText variant="caption" tone="secondary">
          01. Brand
        </AppText>
        <AppText variant="display">roam</AppText>
        <AppText variant="body" tone="secondary">
          Find unforgettable stays for every kind of trip.
        </AppText>
      </Card>

      {/* 02. Color palette */}
      <Card className="gap-base">
        <AppText variant="caption" tone="secondary">
          02. Color palette
        </AppText>
        <View className="flex-row flex-wrap gap-md">
          {COLOR_SWATCHES.map((item) => (
            <View key={item.name} className="w-24 gap-xs">
              <View
                className={["h-12 w-full rounded-md", item.swatchClass].join(" ")}
                style={{ borderRadius: radius.md, borderCurve: "continuous" }}
              />
              <AppText variant="label" className="font-sans-bold">
                {item.name}
              </AppText>
              <AppText variant="label" tone="secondary">
                {item.token}
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      {/* 03. Typography */}
      <Card className="gap-base">
        <AppText variant="caption" tone="secondary">
          03. Typography
        </AppText>

        <View className="gap-xs border-b border-border-gray pb-md dark:border-border-dark">
          <AppText variant="label" tone="secondary">
            Display · Plus Jakarta Sans Bold · 56px · LH 1.0
          </AppText>
          <AppText variant="display">Find your next stay</AppText>
        </View>

        <View className="gap-xs border-b border-border-gray pb-md dark:border-border-dark">
          <AppText variant="label" tone="secondary">
            Heading · Plus Jakarta Sans Bold · 28px · LH 1.2
          </AppText>
          <AppText variant="heading">Modern Cabin with Hot Tub</AppText>
        </View>

        <View className="gap-xs border-b border-border-gray pb-md dark:border-border-dark">
          <AppText variant="label" tone="secondary">
            Body · Plus Jakarta Sans Regular · 16px · LH 1.5
          </AppText>
          <AppText variant="body" tone="secondary">
            From mountain cabins to oceanfront villas, roam helps you find
            unforgettable stays for every kind of trip.
          </AppText>
        </View>

        <View className="gap-xs border-b border-border-gray pb-md dark:border-border-dark">
          <AppText variant="label" tone="secondary">
            Caption · Plus Jakarta Sans Medium · 14px
          </AppText>
          <AppText variant="caption">Lake Arrowhead, CA</AppText>
        </View>

        <View className="items-start gap-xs">
          <AppText variant="label" tone="secondary">
            Button · Plus Jakarta Sans Medium · 17px
          </AppText>
          <Button variant="primary" size="sm" title="Book this stay" onPress={() => {}} />
        </View>
      </Card>

      {/* 04. Buttons */}
      <Card className="gap-md">
        <AppText variant="caption" tone="secondary">
          04. Buttons
        </AppText>
        <Button
          variant="primary"
          title="Book this stay"
          rightIcon={ArrowRight}
          onPress={() => {}}
        />
        <Button
          variant="secondary"
          title="Continue with Google"
          leftElement={<GoogleIcon size={20} />}
          onPress={() => {}}
        />
        <View className="flex-row items-center gap-md pt-xs">
          <Button
            variant="subtle"
            iconOnly
            leftIcon={Heart}
            accessibilityLabel="Favorite stay"
            onPress={() => {}}
          />
          <Button
            variant="subtle"
            iconOnly
            leftIcon={Share}
            accessibilityLabel="Share stay"
            onPress={() => {}}
          />
          <Button
            variant="subtle"
            iconOnly
            leftIcon={Search}
            accessibilityLabel="Search stays"
            onPress={() => {}}
          />
          <Button
            variant="subtle"
            iconOnly
            leftIcon={Bookmark}
            accessibilityLabel="Save stay"
            onPress={() => {}}
          />
        </View>
      </Card>

      {/* 05. Input Fields */}
      <Card className="gap-md">
        <AppText variant="caption" tone="secondary">
          05. Input Fields
        </AppText>
        <Input
          variant="search"
          leadingIcon={Search}
          trailingIcon={SlidersHorizontal}
          trailingLabel="Open filters"
          onTrailingPress={() => {}}
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Search stays"
        />
        <Input
          leadingIcon={User}
          value={defaultNameValue}
          onChangeText={setDefaultNameValue}
          placeholder="Enter your name"
        />
        <Input
          leadingIcon={User}
          value={focusedNameValue}
          onChangeText={setFocusedNameValue}
          placeholder="Full name"
        />
        <Input
          leadingIcon={Lock}
          secureTextEntry
          value={passwordValue}
          onChangeText={setPasswordValue}
          placeholder="Password"
        />
      </Card>

      {/* 06. Filter chips */}
      <Card className="gap-md">
        <AppText variant="caption" tone="secondary">
          06. Filter chips
        </AppText>
        <View className="flex-row flex-wrap gap-sm">
          {PILL_FILTERS.map((option) => (
            <Chip
              key={option}
              label={option}
              selected={selectedPill === option}
              onPress={() => setSelectedPill(option)}
            />
          ))}
        </View>
        <View className="flex-row flex-wrap gap-sm">
          {CATEGORY_CHIPS.map((category) => (
            <Chip
              key={category.label}
              label={category.label}
              icon={category.icon}
              accent="yellow"
              selected={selectedCategory === category.label}
              onPress={() => setSelectedCategory(category.label)}
            />
          ))}
        </View>
      </Card>

      {/* 07. Listing card */}
      <View className="gap-sm">
        <AppText variant="caption" tone="secondary" className="px-xs">
          07. Listing card
        </AppText>
        <ListingCard
          title="Modern Cabin with Hot Tub"
          location="Lake Arrowhead, CA"
          rating="4.9"
          reviewCount={342}
          pricePerNight="$280"
          imageUri={SAMPLE_CABIN_IMAGE}
          favorited={favorited}
          onToggleFavorite={() => setFavorited((prev) => !prev)}
          amenities={[
            { label: "Hot Tub", icon: Bath },
            { label: "Pet Friendly", icon: PawPrint },
          ]}
          onPress={() => {}}
        />
      </View>

      {/* 08. Policy card */}
      <Card className="gap-md">
        <AppText variant="caption" tone="secondary">
          08. Policy card
        </AppText>
        <Card variant="lavender" padding="md" className="flex-row items-center gap-md">
          <View
            className="h-11 w-11 items-center justify-center rounded-md bg-lavender-badge dark:bg-lavender-badge-dark"
            style={{ borderRadius: radius.md, borderCurve: "continuous" }}
          >
            <AppIcon icon={BotMessageSquare} size="md" tone="lavender" />
          </View>
          <View className="flex-1 gap-xs">
            <AppText variant="title">Ask about policies</AppText>
            <AppText variant="caption" tone="secondary">
              Cancellation, house rules, pets, check-in and more.
            </AppText>
          </View>
          <AppIcon icon={ChevronRight} size="md" tone="lavender" />
        </Card>

        <Card variant="lavender" padding="md" className="flex-row items-center gap-md">
          <View
            className="h-11 w-11 items-center justify-center rounded-md bg-lavender-badge dark:bg-lavender-badge-dark"
            style={{ borderRadius: radius.md, borderCurve: "continuous" }}
          >
            <AppIcon icon={FileText} size="md" tone="lavender" />
          </View>
          <View className="flex-1 gap-xs">
            <AppText variant="title">Free cancellation</AppText>
            <AppText variant="caption" tone="secondary">
              Full refund up to 7 days before check-in.
            </AppText>
          </View>
          <AppIcon icon={ChevronRight} size="md" tone="lavender" />
        </Card>
      </Card>

      {/* 09. Profile row */}
      <Card className="gap-sm">
        <AppText variant="caption" tone="secondary">
          09. Profile row
        </AppText>
        <View
          className="overflow-hidden rounded-lg border border-border-gray bg-surface-white dark:border-border-dark dark:bg-surface-elevated-dark"
          style={{ borderRadius: radius.lg, borderCurve: "continuous" }}
        >
          <ProfileRow icon={User} label="Personal info" onPress={() => {}} />
          <ProfileRow icon={CreditCard} label="Payment methods" onPress={() => {}} />
          <ProfileRow icon={Briefcase} label="Trips" showDivider={false} onPress={() => {}} />
        </View>
      </Card>

      {/* 10. Bottom navigation (Liquid glass tab bar) */}
      <Card className="gap-md">
        <AppText variant="caption" tone="secondary">
          10. Bottom navigation (Liquid glass tab bar)
        </AppText>
        <GlassTabBar
          tabs={TAB_ITEMS}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />
      </Card>

      {/* 11. Iconography */}
      <Card className="gap-md">
        <AppText variant="caption" tone="secondary">
          11. Iconography
        </AppText>
        <View className="flex-row flex-wrap gap-sm">
          {ICONOGRAPHY_SET.map((item) => (
            <Button
              key={item.label}
              variant="secondary"
              size="sm"
              iconOnly
              leftIcon={item.icon}
              accessibilityLabel={item.label}
              onPress={() => {}}
            />
          ))}
        </View>
      </Card>

      {/* 12. Segmented control */}
      <Card className="gap-md">
        <AppText variant="caption" tone="secondary">
          12. Segmented control
        </AppText>
        <SegmentedControl
          value={viewMode}
          onChange={setViewMode}
          options={[
            { value: "list", label: "List", icon: List },
            { value: "map", label: "Map", icon: MapIcon },
          ]}
        />
      </Card>

      {/* 13. Toggles / Steppers */}
      <Card className="gap-md">
        <AppText variant="caption" tone="secondary">
          13. Toggles / Steppers
        </AppText>
        <View className="flex-row items-center justify-between">
          <Toggle
            value={toggleEnabled}
            onValueChange={setToggleEnabled}
            accessibilityLabel="Instant book"
          />
          <Stepper
            value={guestCount}
            onChange={setGuestCount}
            min={1}
            max={12}
            label="Guests"
          />
        </View>
      </Card>

      {/* 14. Status / Alerts */}
      <Card className="gap-md">
        <AppText variant="caption" tone="secondary">
          14. Status / Alerts
        </AppText>
        {showSuccess ? (
          <Alert
            variant="success"
            message="Account created successfully"
            onDismiss={() => setShowSuccess(false)}
          />
        ) : null}
        {showError ? (
          <Alert
            variant="error"
            message="Something went wrong. Please try again."
            onDismiss={() => setShowError(false)}
          />
        ) : null}
        {!showSuccess || !showError ? (
          <Button
            variant="secondary"
            size="sm"
            title="Restore alerts"
            onPress={() => {
              setShowSuccess(true);
              setShowError(true);
            }}
          />
        ) : null}
      </Card>

      {/* 15. Tags / Badges */}
      <Card className="gap-md">
        <AppText variant="caption" tone="secondary">
          15. Tags / Badges
        </AppText>
        <View className="flex-row flex-wrap gap-sm">
          <Badge label="Guest favorite" variant="yellow" icon={Star} />
          <Badge label="New" variant="success" />
          <Badge label="20% off" variant="promo" />
          <Badge label="Superhost" variant="info" />
        </View>
      </Card>
    </ScrollView>
  );
}
