import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ArrowRight from "lucide-react-native/icons/arrow-right";
import { AuthScreenShell } from "@/components/auth/auth-screen-shell";
import { useMockAuth } from "@/components/auth/mock-auth-context";
import { OtpInput } from "@/components/auth/otp-input";
import { AppText, Button } from "@/components/ui";

const RESEND_SECONDS = 30;

export default function VerifyScreen() {
  const router = useRouter();
  const { email: emailParam } = useLocalSearchParams<{ email?: string; name?: string }>();
  const { pendingSignUp, verifySignUpCode } = useMockAuth();

  const targetEmail = emailParam || pendingSignUp?.email || "your email address";

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | undefined>();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [notice, setNotice] = useState<string | null>(
    "Mock verification active: enter any 6 digits to continue.",
  );

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleVerify = () => {
    if (code.length !== 6) {
      setCodeError("Enter all 6 digits from your verification email.");
      return;
    }

    verifySignUpCode(code);
    router.replace("/home");
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_SECONDS);
    setCodeError(undefined);
    setNotice(`A fresh verification code was sent to ${targetEmail}.`);
  };

  return (
    <AuthScreenShell
      title={"Verify\nyour email"}
      subtitle={`We sent a 6-digit verification code to ${targetEmail}. Enter it below to confirm your account.`}
      notice={notice}
      onDismissNotice={() => setNotice(null)}
      backAccessibilityLabel="Back to sign up"
      footerPrompt="Entered the wrong email?"
      footerLinkLabel="Change email"
      onFooterLinkPress={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/sign-up");
        }
      }}
    >
      <View className="mt-xl gap-lg">
        <OtpInput
          value={code}
          onChange={(next) => {
            setCode(next);
            if (codeError) setCodeError(undefined);
          }}
          error={codeError}
        />

        <Button
          variant="primary"
          size="lg"
          title="Verify & continue"
          rightIcon={ArrowRight}
          rightIconAlign="end"
          onPress={handleVerify}
        />

        <View className="flex-row items-center justify-center gap-xs">
          <AppText variant="caption" tone="secondary">
            Didn&apos;t receive a code?
          </AppText>
          <Pressable
            accessibilityRole="button"
            disabled={secondsLeft > 0}
            onPress={handleResend}
            hitSlop={8}
          >
            <AppText
              variant="caption"
              tone={secondsLeft > 0 ? "secondary" : "primary"}
              className={secondsLeft > 0 ? "font-sans-medium" : "font-sans-bold underline"}
            >
              {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend code"}
            </AppText>
          </Pressable>
        </View>
      </View>
    </AuthScreenShell>
  );
}
