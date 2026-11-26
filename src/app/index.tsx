import { useEffect, useState } from "react";
import {
  Pressable,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { useAuth, useSSO } from "@clerk/expo";
import { Redirect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useReducedMotion,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import ArrowRight from "lucide-react-native/icons/arrow-right";
import { formatClerkError, runClerkSSOFlow } from "@/components/auth/clerk-helpers";
import {
  OnboardingCopyTransition,
  OnboardingHeroSlide,
  OnboardingStepDots,
  SlopedSheetCurve,
  TopMistScrim,
} from "@/components/onboarding/onboarding-chrome";
import { ONBOARDING_SLIDES } from "@/components/onboarding/onboarding-slides";
import { Alert, AppText, Button, GoogleIcon, RoamLogo } from "@/components/ui";
import { radius, spacing } from "@/theme";

const SHEET_OVERLAP = 48;

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const reducedMotion = useReducedMotion();
  const { isLoaded, isSignedIn } = useAuth();
  const { startSSOFlow } = useSSO();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [ssoError, setSsoError] = useState<string | null>(null);

  const scrollX = useSharedValue(0);
  const slideWidth = useSharedValue(width);

  useEffect(() => {
    slideWidth.set(width);
  }, [width, slideWidth]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.set(event.contentOffset.x);
    },
  });

  useAnimatedReaction(
    () => {
      const w = slideWidth.get();
      if (w <= 0) return 0;
      const next = Math.round(scrollX.get() / w);
      return Math.max(0, Math.min(next, ONBOARDING_SLIDES.length - 1));
    },
    (nextIndex, prevIndex) => {
      if (nextIndex !== prevIndex) {
        scheduleOnRN(setActiveIndex, nextIndex);
      }
    },
  );

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/home" />;
  }

  const activeSlide = ONBOARDING_SLIDES[activeIndex] ?? ONBOARDING_SLIDES[0];

  const goToSlide = (index: number) => {
    const clamped = Math.max(0, Math.min(index, ONBOARDING_SLIDES.length - 1));
    setActiveIndex(clamped);
    scrollRef.current?.scrollTo({
      x: clamped * width,
      y: 0,
      animated: !reducedMotion,
    });
  };

  const handleGetStarted = () => {
    router.push("/sign-up");
  };

  const handleSkip = () => {
    router.push("/sign-in");
  };

  const handleContinueWithGoogle = async () => {
    setGoogleLoading(true);
    setSsoError(null);
    try {
      const message = await runClerkSSOFlow(startSSOFlow, "oauth_google", router);
      if (message) {
        setSsoError(message);
      }
    } catch (err) {
      setSsoError(formatClerkError(err, "Unable to sign in with Google."));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-surface-white dark:bg-surface-elevated-dark">
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      {/* Hero Photo Carousel */}
      <View className="relative flex-1">
        <Animated.ScrollView
          ref={scrollRef}
          style={{ flex: 1, width }}
          contentContainerStyle={{ height: "100%" }}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
        >
          {ONBOARDING_SLIDES.map((item, index) => (
            <View key={item.id} style={{ width, height: "100%" }}>
              <OnboardingHeroSlide
                slide={item}
                index={index}
                scrollX={scrollX}
                slideWidth={slideWidth}
                sheetOverlap={SHEET_OVERLAP}
              />
            </View>
          ))}
        </Animated.ScrollView>

        {/* Top Mist Scrim + Brand Wordmark + Skip Pill */}
        <View
          className="absolute left-0 right-0 top-0"
          style={{ paddingTop: insets.top + spacing.sm, paddingBottom: spacing["2xl"] }}
          pointerEvents="box-none"
        >
          <TopMistScrim />
          <View
            className="flex-row items-center justify-between px-xl"
            pointerEvents="box-none"
          >
            <RoamLogo size="lg" />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Skip onboarding and sign in"
              onPress={handleSkip}
              hitSlop={6}
              className="min-h-11 items-center justify-center rounded-full bg-surface-white/85 px-lg shadow-card dark:bg-surface-elevated-dark/85"
              style={({ pressed }) => ({
                borderRadius: radius.full,
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <AppText variant="caption" className="font-sans-semibold">
                Skip
              </AppText>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Curved Bottom Sheet */}
      <View style={{ marginTop: -SHEET_OVERLAP }}>
        <SlopedSheetCurve />

        <View
          className="bg-surface-white px-xl dark:bg-surface-elevated-dark"
          style={{ paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.sm }}
        >
          <View className="-mt-md">
            <OnboardingStepDots
              total={ONBOARDING_SLIDES.length}
              activeIndex={activeIndex}
              onSelect={goToSlide}
            />
          </View>

          <OnboardingCopyTransition scrollX={scrollX} slideWidth={slideWidth}>
            <View className="mt-base gap-sm" style={{ minHeight: 172 }}>
              <AppText variant="hero" className="pb-xs">
                {activeSlide.title}
              </AppText>
              <AppText variant="body" tone="secondary">
                {activeSlide.subtitle}
              </AppText>
            </View>
          </OnboardingCopyTransition>

          {ssoError ? (
            <Alert
              variant="error"
              message={ssoError}
              onDismiss={() => setSsoError(null)}
              className="mt-md"
            />
          ) : null}

          <View className="mt-xl gap-md">
            <Button
              variant="primary"
              size="lg"
              title="Get started"
              rightIcon={ArrowRight}
              rightIconAlign="end"
              disabled={googleLoading}
              onPress={handleGetStarted}
            />
            <Button
              variant="secondary"
              size="lg"
              title="Continue with Google"
              leftElement={<GoogleIcon size={20} />}
              loading={googleLoading}
              onPress={handleContinueWithGoogle}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
