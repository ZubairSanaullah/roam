import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { useThemeColors } from "@/theme";

export default function AuthLayout() {
  const colors = useThemeColors();
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface },
      }}
    />
  );
}
