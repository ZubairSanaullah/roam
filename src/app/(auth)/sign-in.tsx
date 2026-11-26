import { useState } from "react";
import { Pressable, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ArrowRight from "lucide-react-native/icons/arrow-right";
import Lock from "lucide-react-native/icons/lock";
import Mail from "lucide-react-native/icons/mail";
import { AuthScreenShell } from "@/components/auth/auth-screen-shell";
import { useMockAuth } from "@/components/auth/mock-auth-context";
import { SocialAuthSection } from "@/components/auth/social-auth-section";
import { AppText, Button, Input } from "@/components/ui";

export default function SignInScreen() {
  const router = useRouter();
  const { provider } = useLocalSearchParams<{ provider?: string }>();
  const { signInWithEmail, signInWithProvider } = useMockAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [notice, setNotice] = useState<string | null>(
    provider === "google"
      ? "Tap Continue with Google below to try the mocked Google sign-in."
      : null,
  );

  const handleSignIn = () => {
    const trimmedEmail = email.trim();
    const nextEmailError = !trimmedEmail
      ? "Enter your email address."
      : !trimmedEmail.includes("@")
        ? "Enter a valid email address."
        : undefined;
    const nextPasswordError = !password ? "Enter your password." : undefined;

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) {
      return;
    }

    signInWithEmail(trimmedEmail);
    router.replace("/home");
  };

  const handleForgotPassword = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setEmailError("Enter your email address first to reset your password.");
      return;
    }

    setEmailError(undefined);
    setNotice(`Mock password reset link sent to ${trimmedEmail}.`);
  };

  const handleProviderAuth = (selectedProvider: "google" | "apple") => {
    signInWithProvider(selectedProvider);
    router.replace("/home");
  };

  return (
    <AuthScreenShell
      title={"Welcome\nback"}
      subtitle="Sign in to access your saved stays, trips, and verified policy answers."
      notice={notice}
      onDismissNotice={() => setNotice(null)}
      backAccessibilityLabel="Back to onboarding"
      footerPrompt="Don't have an account?"
      footerLinkLabel="Sign up"
      footerHref="/sign-up"
    >
      <View className="mt-lg gap-md">
        <Input
          variant="stacked"
          label="Email address"
          leadingIcon={Mail}
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            if (emailError) setEmailError(undefined);
          }}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          error={emailError}
        />

        <Input
          variant="stacked"
          label="Password"
          leadingIcon={Lock}
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            if (passwordError) setPasswordError(undefined);
          }}
          placeholder="Enter your password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          textContentType="password"
          error={passwordError}
        />

        <View className="items-end">
          <Pressable
            accessibilityRole="button"
            onPress={handleForgotPassword}
            hitSlop={8}
          >
            <AppText variant="caption" tone="primary" className="font-sans-semibold underline">
              Forgot password?
            </AppText>
          </Pressable>
        </View>
      </View>

      <View className="mt-lg gap-md">
        <Button
          variant="primary"
          size="lg"
          title="Sign in"
          rightIcon={ArrowRight}
          rightIconAlign="end"
          onPress={handleSignIn}
        />

        <SocialAuthSection
          onGooglePress={() => handleProviderAuth("google")}
          onApplePress={() => handleProviderAuth("apple")}
        />
      </View>
    </AuthScreenShell>
  );
}
