import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { useClerk, useUser } from "@clerk/expo";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CheckCircle2 from "lucide-react-native/icons/check-circle-2";
import LogOut from "lucide-react-native/icons/log-out";
import Palette from "lucide-react-native/icons/palette";
import ShieldCheck from "lucide-react-native/icons/shield-check";
import User from "lucide-react-native/icons/user";
import { formatClerkError } from "@/components/auth/clerk-helpers";
import { Alert, AppText, Badge, Button, Card, ProfileRow } from "@/components/ui";
import { radius, spacing, useThemeColors } from "@/theme";

export default function ProfileTabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-gray dark:bg-surface-dark">
        <ActivityIndicator color={colors.textPrimary} />
      </View>
    );
  }

  const displayName =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "Roam Guest";
  const emailAddress = user?.primaryEmailAddress?.emailAddress || "Verified account";
  const authStrategy = user?.externalAccounts?.[0]?.provider ?? "email";
  const initial = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    setSigningOut(true);
    setError(null);
    try {
      await signOut();
      router.replace("/");
    } catch (err) {
      setError(formatClerkError(err, "Unable to sign out right now."));
      setSigningOut(false);
    }
  };

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

      <View className="flex-row items-center justify-between">
        <AppText variant="hero">Profile</AppText>
        <Badge label="Verified" variant="success" icon={CheckCircle2} />
      </View>

      {error ? (
        <Alert variant="error" message={error} onDismiss={() => setError(null)} />
      ) : null}

      <Card elevated padding="lg" className="flex-row items-center gap-md">
        <View className="h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-badge-yellow-bg">
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              contentFit="cover"
              style={StyleSheet.absoluteFill}
              accessibilityLabel={`${displayName}'s avatar`}
            />
          ) : (
            <AppText variant="heading" tone="onAccent">
              {initial}
            </AppText>
          )}
        </View>
        <View className="flex-1 gap-xs">
          <AppText variant="title" numberOfLines={1}>
            {displayName}
          </AppText>
          <AppText variant="caption" tone="secondary" numberOfLines={1}>
            {emailAddress}
          </AppText>
        </View>
      </Card>

      <View
        className="overflow-hidden rounded-lg border border-border-gray bg-surface-white"
        style={{ borderRadius: radius.lg, borderCurve: "continuous" }}
      >
        <ProfileRow
          icon={User}
          label="Account method"
          subtitle={`Signed in via ${authStrategy}`}
          showChevron={false}
        />
        <ProfileRow
          icon={ShieldCheck}
          label="Session security"
          subtitle="Encrypted keychain token cache active"
          showChevron={false}
        />
        <ProfileRow
          icon={Palette}
          label="Design system showcase"
          showDivider={false}
          onPress={() => router.push("/design-system")}
        />
      </View>

      <Button
        variant="primary"
        size="lg"
        title="Sign out"
        leftIcon={LogOut}
        loading={signingOut}
        onPress={handleSignOut}
      />
    </ScrollView>
  );
}
