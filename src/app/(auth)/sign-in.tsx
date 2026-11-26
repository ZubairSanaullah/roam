import { useState } from "react";
import { Pressable, View } from "react-native";
import { useSignIn, useSSO } from "@clerk/expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import ArrowRight from "lucide-react-native/icons/arrow-right";
import Lock from "lucide-react-native/icons/lock";
import Mail from "lucide-react-native/icons/mail";
import { AuthScreenShell } from "@/components/auth/auth-screen-shell";
import {
  formatClerkError,
  navigateAfterClerkAuth,
  runClerkSSOFlow,
} from "@/components/auth/clerk-helpers";
import { SocialAuthSection } from "@/components/auth/social-auth-section";
import { AppText, Button, Input } from "@/components/ui";

type SignInMode = "password" | "email_code";

export default function SignInScreen() {
  const router = useRouter();
  const { provider } = useLocalSearchParams<{ provider?: string }>();
  const { signIn, errors, fetchStatus } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [mode, setMode] = useState<SignInMode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [notice, setNotice] = useState<{
    variant: "info" | "error";
    message: string;
  } | null>(
    provider === "google"
      ? {
          variant: "info",
          message: "Tap Continue with Google below to sign in with Google.",
        }
      : null,
  );
  const [loadingProvider, setLoadingProvider] = useState<"google" | "apple" | null>(null);

  const isBusy = fetchStatus === "fetching" || loadingProvider !== null;

  const resolvedEmailError =
    emailError ?? errors.fields.identifier?.longMessage ?? errors.fields.identifier?.message;
  const resolvedPasswordError =
    passwordError ?? errors.fields.password?.longMessage ?? errors.fields.password?.message;
  const clerkGlobalError = errors.global?.[0]?.longMessage ?? errors.global?.[0]?.message;

  const activeNotice =
    notice ?? (clerkGlobalError ? { variant: "error" as const, message: clerkGlobalError } : null);

  const handleSignIn = async () => {
    const trimmedEmail = email.trim();
    const nextEmailError = !trimmedEmail
      ? "Enter your email address."
      : !trimmedEmail.includes("@")
        ? "Enter a valid email address."
        : undefined;
    const nextPasswordError =
      mode === "password" && !password ? "Enter your password." : undefined;

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setNotice(null);

    if (nextEmailError || nextPasswordError) {
      return;
    }

    if (mode === "email_code") {
      const { error } = await signIn.emailCode.sendCode({ emailAddress: trimmedEmail });
      if (error) {
        return;
      }
      router.push({
        pathname: "/verify",
        params: { mode: "sign-in-code", email: trimmedEmail },
      });
      return;
    }

    const { error } = await signIn.password({
      emailAddress: trimmedEmail,
      password,
    });
    if (error) {
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: (params) => navigateAfterClerkAuth(router, params),
      });
      return;
    }

    if (signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor") {
      const emailFactor = signIn.supportedSecondFactors?.find(
        (factor) => factor.strategy === "email_code",
      );
      if (emailFactor) {
        const { error: sendError } = await signIn.mfa.sendEmailCode();
        if (sendError) {
          setNotice({ variant: "error", message: formatClerkError(sendError) });
          return;
        }
        router.push({
          pathname: "/verify",
          params: { mode: "sign-in-mfa", email: trimmedEmail },
        });
        return;
      }

      setNotice({
        variant: "error",
        message: "Additional verification is required to complete sign in.",
      });
    }
  };

  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setEmailError("Enter your email address first to reset your password.");
      return;
    }

    setEmailError(undefined);
    setPasswordError(undefined);
    setNotice(null);

    const { error: createError } = await signIn.create({ identifier: trimmedEmail });
    if (createError) {
      return;
    }

    const { error: sendError } = await signIn.resetPasswordEmailCode.sendCode();
    if (sendError) {
      setNotice({ variant: "error", message: formatClerkError(sendError) });
      return;
    }

    router.push({
      pathname: "/verify",
      params: { mode: "reset-password", email: trimmedEmail },
    });
  };

  const handleToggleMode = () => {
    setMode((prev) => (prev === "password" ? "email_code" : "password"));
    setPasswordError(undefined);
    setNotice(null);
    signIn.reset();
  };

  const handleProviderAuth = async (selectedProvider: "google" | "apple") => {
    setLoadingProvider(selectedProvider);
    setNotice(null);
    try {
      const strategy = selectedProvider === "google" ? "oauth_google" : "oauth_apple";
      const message = await runClerkSSOFlow(startSSOFlow, strategy, router);
      if (message) {
        setNotice({ variant: "error", message });
      }
    } catch (err) {
      setNotice({ variant: "error", message: formatClerkError(err) });
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <AuthScreenShell
      title={"Welcome\nback"}
      subtitle={
        mode === "email_code"
          ? "Enter your email address and we will send a 6-digit verification code to sign you in."
          : "Sign in to access your saved stays, trips, and verified policy answers."
      }
      notice={activeNotice?.message ?? null}
      noticeVariant={activeNotice?.variant ?? "info"}
      onDismissNotice={() => setNotice(null)}
      backAccessibilityLabel="Back to onboarding"
      onBackPress={() => signIn.reset()}
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
          editable={!isBusy}
          error={resolvedEmailError}
        />

        {mode === "password" ? (
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
            editable={!isBusy}
            error={resolvedPasswordError}
          />
        ) : null}

        <View className="flex-row items-center justify-between">
          <Pressable
            accessibilityRole="button"
            disabled={isBusy}
            onPress={handleToggleMode}
            hitSlop={8}
          >
            <AppText variant="caption" tone="lavender" className="font-sans-semibold">
              {mode === "password" ? "Use email code instead" : "Use password instead"}
            </AppText>
          </Pressable>

          {mode === "password" ? (
            <Pressable
              accessibilityRole="button"
              disabled={isBusy}
              onPress={handleForgotPassword}
              hitSlop={8}
            >
              <AppText variant="caption" tone="primary" className="font-sans-semibold underline">
                Forgot password?
              </AppText>
            </Pressable>
          ) : null}
        </View>
      </View>

      <View className="mt-lg gap-md">
        <Button
          variant="primary"
          size="lg"
          title={mode === "email_code" ? "Send verification code" : "Sign in"}
          rightIcon={ArrowRight}
          rightIconAlign="end"
          loading={fetchStatus === "fetching"}
          disabled={loadingProvider !== null}
          onPress={handleSignIn}
        />

        <SocialAuthSection
          loadingProvider={loadingProvider}
          disabled={fetchStatus === "fetching"}
          onGooglePress={() => handleProviderAuth("google")}
          onApplePress={() => handleProviderAuth("apple")}
        />
      </View>
    </AuthScreenShell>
  );
}
