import { View } from "react-native";
import { AppText, AppleIcon, Button, GoogleIcon } from "@/components/ui";

export interface SocialAuthSectionProps {
  onGooglePress: () => void;
  onApplePress: () => void;
  disabled?: boolean;
  loadingProvider?: "google" | "apple" | null;
}

/**
 * Shared `"or"` hairline divider and Google / Apple pill buttons for auth screens.
 */
export function SocialAuthSection({
  onGooglePress,
  onApplePress,
  disabled = false,
  loadingProvider = null,
}: SocialAuthSectionProps) {
  const isLocked = disabled || loadingProvider !== null;

  return (
    <View className="gap-md">
      <View className="my-xs flex-row items-center gap-md">
        <View className="h-px flex-1 bg-border-gray dark:bg-border-dark" />
        <AppText variant="caption" tone="secondary">
          or
        </AppText>
        <View className="h-px flex-1 bg-border-gray dark:bg-border-dark" />
      </View>

      <Button
        variant="secondary"
        size="lg"
        title="Continue with Google"
        leftElement={<GoogleIcon size={20} />}
        loading={loadingProvider === "google"}
        disabled={isLocked && loadingProvider !== "google"}
        onPress={onGooglePress}
      />
      <Button
        variant="secondary"
        size="lg"
        title="Continue with Apple"
        leftElement={<AppleIcon size={20} />}
        loading={loadingProvider === "apple"}
        disabled={isLocked && loadingProvider !== "apple"}
        onPress={onApplePress}
      />
    </View>
  );
}
