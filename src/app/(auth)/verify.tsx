import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { useSignIn, useSignUp } from "@clerk/expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import ArrowRight from "lucide-react-native/icons/arrow-right";
import Lock from "lucide-react-native/icons/lock";
import { AuthScreenShell } from "@/components/auth/auth-screen-shell";
import { formatClerkError, navigateAfterClerkAuth } from "@/components/auth/clerk-helpers";
import { OtpInput } from "@/components/auth/otp-input";
import { AppText, Button, Input } from "@/components/ui";

const RESEND_SECONDS = 30;

type VerifyMode = "sign-up" | "sign-in-code" | "sign-in-mfa" | "reset-password";

export default function VerifyScreen() {
  const router = useRouter();
  const { mode: rawMode, email: emailParam } = useLocalSearchParams<{
    mode?: string;
    email?: string;
  }>();

  const mode: VerifyMode =
    rawMode === "sign-in-code" || rawMode === "sign-in-mfa" || rawMode === "reset-password"
      ? rawMode
      : "sign-up";

  const {
    signUp,
    errors: signUpErrors,
    fetchStatus: signUpStatus,
  } = useSignUp();
  const {
    signIn,
    errors: signInErrors,
    fetchStatus: signInStatus,
  } = useSignIn();

  const targetEmail =
    emailParam ||
    (mode === "sign-up" ? signUp.emailAddress : signIn.identifier) ||
    "your email address";

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [codeError, setCodeError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [notice, setNotice] = useState<{
    variant: "info" | "success" | "error";
    message: string;
  } | null>(null);

  const isPasswordResetStep =
    mode === "reset-password" && signIn.status === "needs_new_password";
  const isFetching = mode === "sign-up" ? signUpStatus === "fetching" : signInStatus === "fetching";

  const clerkCodeError =
    mode === "sign-up"
      ? signUpErrors.fields.code?.longMessage ?? signUpErrors.fields.code?.message
      : signInErrors.fields.code?.longMessage ?? signInErrors.fields.code?.message;
  const clerkPasswordError =
    signInErrors.fields.password?.longMessage ?? signInErrors.fields.password?.message;
  const clerkGlobalError =
    mode === "sign-up"
      ? signUpErrors.global?.[0]?.longMessage ?? signUpErrors.global?.[0]?.message
      : signInErrors.global?.[0]?.longMessage ?? signInErrors.global?.[0]?.message;

  const activeNotice =
    notice ?? (clerkGlobalError ? { variant: "error" as const, message: clerkGlobalError } : null);

  useEffect(() => {
    if (secondsLeft <= 0 || isPasswordResetStep) return;
    const timer = setTimeout(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, isPasswordResetStep]);

  const resetActiveAttempt = () => {
    if (mode === "sign-up") {
      signUp.reset();
    } else {
      signIn.reset();
    }
  };

  const handleLeaveScreen = () => {
    resetActiveAttempt();
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(mode === "sign-up" ? "/sign-up" : "/sign-in");
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setCodeError("Enter all 6 digits from your verification email.");
      return;
    }

    setCodeError(undefined);
    setNotice(null);

    if (mode === "sign-up") {
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      if (error) {
        return;
      }
      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: (params) => navigateAfterClerkAuth(router, params),
        });
      }
      return;
    }

    if (mode === "sign-in-code") {
      const { error } = await signIn.emailCode.verifyCode({ code });
      if (error) {
        return;
      }
      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: (params) => navigateAfterClerkAuth(router, params),
        });
      }
      return;
    }

    if (mode === "sign-in-mfa") {
      const { error } = await signIn.mfa.verifyEmailCode({ code });
      if (error) {
        return;
      }
      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: (params) => navigateAfterClerkAuth(router, params),
        });
      }
      return;
    }

    const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code });
    if (error) {
      return;
    }
    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: (params) => navigateAfterClerkAuth(router, params),
      });
    }
  };

  const handleSubmitNewPassword = async () => {
    if (newPassword.length < 8) {
      setPasswordError("Use at least 8 characters for your new password.");
      return;
    }

    setPasswordError(undefined);
    setNotice(null);

    const { error } = await signIn.resetPasswordEmailCode.submitPassword({
      password: newPassword,
    });
    if (error) {
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: (params) => navigateAfterClerkAuth(router, params),
      });
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || isFetching) return;
    setCodeError(undefined);
    setNotice(null);

    let sendError: unknown = null;
    if (mode === "sign-up") {
      ({ error: sendError } = await signUp.verifications.sendEmailCode());
    } else if (mode === "sign-in-code") {
      ({ error: sendError } = await signIn.emailCode.sendCode());
    } else if (mode === "sign-in-mfa") {
      ({ error: sendError } = await signIn.mfa.sendEmailCode());
    } else {
      ({ error: sendError } = await signIn.resetPasswordEmailCode.sendCode());
    }

    if (sendError) {
      setNotice({ variant: "error", message: formatClerkError(sendError) });
      return;
    }

    setSecondsLeft(RESEND_SECONDS);
    setNotice({
      variant: "info",
      message: `A fresh verification code was sent to ${targetEmail}.`,
    });
  };

  const title = isPasswordResetStep
    ? "Set a new\npassword"
    : mode === "sign-in-mfa"
      ? "Confirm\nthis device"
      : "Verify\nyour email";

  const subtitle = isPasswordResetStep
    ? `Choose a new password for ${targetEmail}.`
    : `We sent a 6-digit verification code to ${targetEmail}. Enter it below to continue.`;

  return (
    <AuthScreenShell
      title={title}
      subtitle={subtitle}
      notice={activeNotice?.message ?? null}
      noticeVariant={activeNotice?.variant ?? "info"}
      onDismissNotice={() => setNotice(null)}
      backAccessibilityLabel={mode === "sign-up" ? "Back to sign up" : "Back to sign in"}
      onBackPress={resetActiveAttempt}
      footerPrompt="Entered the wrong email?"
      footerLinkLabel="Change email"
      onFooterLinkPress={handleLeaveScreen}
    >
      <View className="mt-xl gap-lg">
        {isPasswordResetStep ? (
          <>
            <Input
              variant="stacked"
              label="New password"
              leadingIcon={Lock}
              value={newPassword}
              onChangeText={(value) => {
                setNewPassword(value);
                if (passwordError) setPasswordError(undefined);
              }}
              placeholder="At least 8 characters"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
              textContentType="newPassword"
              editable={!isFetching}
              error={passwordError ?? clerkPasswordError}
            />

            <Button
              variant="primary"
              size="lg"
              title="Update password"
              rightIcon={ArrowRight}
              rightIconAlign="end"
              loading={isFetching}
              onPress={handleSubmitNewPassword}
            />
          </>
        ) : (
          <>
            <OtpInput
              value={code}
              onChange={(next) => {
                setCode(next);
                if (codeError) setCodeError(undefined);
              }}
              error={codeError ?? clerkCodeError}
            />

            <Button
              variant="primary"
              size="lg"
              title="Verify & continue"
              rightIcon={ArrowRight}
              rightIconAlign="end"
              loading={isFetching}
              onPress={handleVerify}
            />

            <View className="flex-row items-center justify-center gap-xs">
              <AppText variant="caption" tone="secondary">
                Didn&apos;t receive a code?
              </AppText>
              <Pressable
                accessibilityRole="button"
                disabled={secondsLeft > 0 || isFetching}
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
          </>
        )}
      </View>
    </AuthScreenShell>
  );
}
