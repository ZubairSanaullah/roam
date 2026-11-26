import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import ArrowRight from "lucide-react-native/icons/arrow-right";
import Lock from "lucide-react-native/icons/lock";
import Mail from "lucide-react-native/icons/mail";
import User from "lucide-react-native/icons/user";
import { AuthScreenShell } from "@/components/auth/auth-screen-shell";
import { useMockAuth } from "@/components/auth/mock-auth-context";
import { SocialAuthSection } from "@/components/auth/social-auth-section";
import { Button, Input } from "@/components/ui";

export default function SignUpScreen() {
  const router = useRouter();
  const { beginSignUp, signInWithProvider } = useMockAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [notice, setNotice] = useState<string | null>(null);

  const handleCreateAccount = () => {
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

    if (nextNameError || nextEmailError || nextPasswordError) {
      return;
    }

    beginSignUp({ name: trimmedName, email: trimmedEmail });
    router.push({
      pathname: "/verify",
      params: { email: trimmedEmail, name: trimmedName },
    });
  };

  const handleProviderAuth = (provider: "google" | "apple") => {
    signInWithProvider(provider);
    router.replace("/home");
  };

  return (
    <AuthScreenShell
      title={"Create\nyour account"}
      subtitle="Join roam to save your stays, get personalized recommendations and access them across all your devices."
      notice={notice}
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
          error={nameError}
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
          placeholder="At least 8 characters"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          error={passwordError}
        />
      </View>

      <View className="mt-lg gap-md">
        <Button
          variant="primary"
          size="lg"
          title="Create account"
          rightIcon={ArrowRight}
          rightIconAlign="end"
          onPress={handleCreateAccount}
        />

        <SocialAuthSection
          onGooglePress={() => handleProviderAuth("google")}
          onApplePress={() => handleProviderAuth("apple")}
        />
      </View>
    </AuthScreenShell>
  );
}
