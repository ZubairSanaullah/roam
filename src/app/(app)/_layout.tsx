import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { useThemeColors } from "@/theme";

export default function ProtectedAppLayout() {
  const colors = useThemeColors();
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="stay/[id]"
        options={{
          presentation: "formSheet",
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.68, 1.0],
          contentStyle: { backgroundColor: colors.surface },
        }}
      />
    </Stack>
  );
}
