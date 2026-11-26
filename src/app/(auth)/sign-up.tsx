import { useState } from "react";
import { View } from "react-native";
import { useSignUp, useSSO } from "@clerk/expo";
import { useRouter } from "expo-router";
import ArrowRight from "lucide-react-native/icons/arrow-right";
import Lock from "lucide-react-native/icons/lock";
import Mail from "lucide-react-native/icons/mail";
import User from "lucide-react-native/icons/user";
import { AuthScreenShell } from "@/components/auth/auth-screen-shell";
import {
  formatClerkError,
  navigateAfterClerkAuth,
  runClerkSSOFlow,
  splitFullName,
} from "@/components/auth/clerk-helpers";
import { SocialAuthSection } from "@/components/auth/social-auth-section";
import { Button, Input } from "@/components/ui";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, errors, fetchStatus } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [notice, setNotice] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<"google" | "apple" | null>(null);

  const isBusy = fetchStatus === "fetching" || loadingProvider !== null;

  const resolvedNameError =
    nameError ??
    errors.fields.firstName?.longMessage ??
    errors.fields.firstName?.message ??
    errors.fields.lastName?.longMessage ??
    errors.fields.lastName?.message;
  const resolvedEmailError =
    emailError ?? errors.fields.emailAddress?.longMessage ?? errors.fields.emailAddress?.message;
  const resolvedPasswordError =
    passwordError ?? errors.fields.password?.longMessage ?? errors.fields.password?.message;
  const clerkGlobalError =
    errors.global?.[0]?.longMessage ??
    errors.global?.[0]?.message ??
    errors.fields.captcha?.longMessage ??
    errors.fields.captcha?.message ??
    null;

  const displayedNotice = notice ?? clerkGlobalError;

  const handleCreateAccount = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    const nextNameError = !trimmedName ? "Enter your full name." : undefined;
    const nextEmailError = !trimmedEmail
      ? "Enter your email address."
      : !trimmedEmail.includes("@")
        ? "Enter a valid email address."
        : undefined;
    const nextPasswordError =
      password.length < 8 ? "Use at least 8 characters for your password." : undefined;

    setNameError(nextNameError);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setNotice(null);

    if (nextNameError || nextEmailError || nextPasswordError) {
      return;
    }

    const { firstName, lastName } = splitFullName(trimmedName);
    const { error } = await signUp.password({
      emailAddress: trimmedEmail,
      password,
      firstName,
      lastName,
    });

    if (error) {
      return;
    }

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: (params) => navigateAfterClerkAuth(router, params),
      });
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      setNotice(formatClerkError(sendError, "Unable to send verification code."));
      return;
    }

    if (
      signUp.status === "missing_requirements" &&
      signUp.unverifiedFields?.includes("email_address")
    ) {
      router.push({
        pathname: "/verify",
        params: { mode: "sign-up", email: trimmedEmail },
      });
    }
  };

  const handleProviderAuth = async (provider: "google" | "apple") => {
    setLoadingProvider(provider);
    setNotice(null);
    try {
      const strategy = provider === "google" ? "oauth_google" : "oauth_apple";
      const message = await runClerkSSOFlow(startSSOFlow, strategy, router);
      if (message) {
        setNotice(message);
      }
    } catch (err) {
      setNotice(formatClerkError(err));
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <AuthScreenShell
      title={"Create\nyour account"}
      subtitle="Join roam to save your stays, get personalized recommendations and access them across all your devices."
      notice={displayedNotice}
      noticeVariant={displayedNotice ? "error" : "info"}
      onDismissNotice={() => setNotice(null)}
      backAccessibilityLabel="Back to onboarding"
      footerPrompt="Already have an account?"
      footerLinkLabel="Sign in"
      footerHref="/sign-in"
    >
      <View className="mt-lg gap-md">
        <Input
          variant="stacked"
          label="Full name"
          leadingIcon={User}
          value={fullName}
          onChangeText={(value) => {
            setFullName(value);
            if (nameError) setNameError(undefined);
          }}
          placeholder="e.g. Adrian Hajdin"
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          editable={!isBusy}
          error={resolvedNameError}
        />

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
          editable={!isBusy}
          error={resolvedEmailError}
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
          placeholder="At least 8 characters"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          editable={!isBusy}
          error={resolvedPasswordError}
        />
      </View>

      <View className="mt-lg gap-md">
        <Button
          variant="primary"
          size="lg"
          title="Create account"
          rightIcon={ArrowRight}
          rightIconAlign="end"
          loading={fetchStatus === "fetching"}
          disabled={loadingProvider !== null}
          onPress={handleCreateAccount}
        />

        <SocialAuthSection
          loadingProvider={loadingProvider}
          disabled={fetchStatus === "fetching"}
          onGooglePress={() => handleProviderAuth("google")}
          onApplePress={() => handleProviderAuth("apple")}
        />
      </View>

      <View nativeID="clerk-captcha" />
    </AuthScreenShell>
  );
}
