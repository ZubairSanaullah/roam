import "../../global.css";

import { useEffect } from "react";
import { Appearance, Platform } from "react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { fontFamilies, useThemeColors } from "@/theme";
import { MockAuthProvider } from "@/components/auth/mock-auth-context";

SplashScreen.preventAutoHideAsync();

if (Platform.OS !== "web" && typeof Appearance.setColorScheme === "function") {
  Appearance.setColorScheme("light");
}

export default function RootLayout() {
  const colors = useThemeColors();
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <MockAuthProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            fontFamily: fontFamilies.bold,
            color: colors.textPrimary,
          },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.appBackground },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="design-system" options={{ title: "Roam Design System" }} />
      </Stack>
    </MockAuthProvider>
  );
}
