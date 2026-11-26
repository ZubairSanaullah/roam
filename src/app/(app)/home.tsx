import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useClerk, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CheckCircle2 from "lucide-react-native/icons/check-circle-2";
import LogOut from "lucide-react-native/icons/log-out";
import Palette from "lucide-react-native/icons/palette";
import { formatClerkError } from "@/components/auth/clerk-helpers";
import { Alert, AppIcon, AppText, Badge, Button, Card } from "@/components/ui";
import { spacing, useThemeColors } from "@/theme";

export default function ProtectedHomeScreen() {
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
    <View
      className="flex-1 justify-between bg-surface-gray px-xl dark:bg-surface-dark"
      style={{
        paddingTop: insets.top + spacing.xl,
        paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.base,
      }}
    >
      <StatusBar style="auto" />

      <View className="gap-lg">
        <View className="flex-row items-center justify-between">
          <AppText variant="brand">roam</AppText>
          <Badge label="Clerk session" variant="success" icon={CheckCircle2} />
        </View>

        {error ? (
          <Alert variant="error" message={error} onDismiss={() => setError(null)} />
        ) : null}

        <Card elevated padding="lg" className="gap-md">
          <View className="flex-row items-center gap-md">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-lavender-tint dark:bg-lavender-tint-dark">
              <AppIcon icon={CheckCircle2} size="lg" tone="lavender" />
            </View>
            <View className="flex-1 gap-xs">
              <AppText variant="title">Signed in as {displayName}</AppText>
              <AppText variant="caption" tone="secondary">
                {emailAddress} via {authStrategy}
              </AppText>
            </View>
          </View>

          <AppText variant="body" tone="secondary">
            Your Clerk session is persisted securely on this device and protected by route guards.
          </AppText>
        </Card>
      </View>

      <View className="gap-md">
        <Button
          variant="secondary"
          size="lg"
          title="View design system"
          leftIcon={Palette}
          disabled={signingOut}
          onPress={() => router.push("/design-system")}
        />
        <Button
          variant="primary"
          size="lg"
          title="Sign out"
          leftIcon={LogOut}
          loading={signingOut}
          onPress={handleSignOut}
        />
      </View>
    </View>
  );
}
