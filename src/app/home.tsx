import { View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CheckCircle2 from "lucide-react-native/icons/check-circle-2";
import LogOut from "lucide-react-native/icons/log-out";
import Palette from "lucide-react-native/icons/palette";
import { useMockAuth } from "@/components/auth/mock-auth-context";
import { AppIcon, AppText, Badge, Button, Card } from "@/components/ui";
import { spacing } from "@/theme";

export default function MockHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useMockAuth();

  const handleSignOut = () => {
    signOut();
    router.replace("/");
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
          <Badge label="Mock session" variant="success" icon={CheckCircle2} />
        </View>

        <Card elevated padding="lg" className="gap-md">
          <View className="flex-row items-center gap-md">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-lavender-tint dark:bg-lavender-tint-dark">
              <AppIcon icon={CheckCircle2} size="lg" tone="lavender" />
            </View>
            <View className="flex-1 gap-xs">
              <AppText variant="title">
                Signed in as {user?.name ?? "Roam Guest"}
              </AppText>
              <AppText variant="caption" tone="secondary">
                {user?.email ?? "guest@roam.app"} via {user?.provider ?? "email"}
              </AppText>
            </View>
          </View>

          <AppText variant="body" tone="secondary">
            Authentication is currently mocked in memory. Real Clerk sessions and stay discovery tabs will connect here next.
          </AppText>
        </Card>
      </View>

      <View className="gap-md">
        <Button
          variant="secondary"
          size="lg"
          title="View design system"
          leftIcon={Palette}
          onPress={() => router.push("/design-system")}
        />
        <Button
          variant="primary"
          size="lg"
          title="Sign out"
          leftIcon={LogOut}
          onPress={handleSignOut}
        />
      </View>
    </View>
  );
}
