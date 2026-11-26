import "../../global.css";

import { useEffect } from "react";
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

SplashScreen.preventAutoHideAsync();

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
    />
  );
}
